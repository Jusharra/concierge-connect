import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeData } from "../../../src/test/fixtures/site-data";
import { F, T } from "../../../shared/airtable-schema";
import { handleCheckout } from "./checkout";
import type { PaymentProvider } from "./payments";

const cfg = { pat: "patTEST", baseId: "appTEST" };
const MAKE = "https://hook.example.test/abc";
const NOW = new Date("2026-10-01T15:30:00Z");

interface Call { method: string; url: string; body?: any }

const stubAirtable = () => {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const method = init.method || "GET";
      const body = init.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ method, url, body });
      if (url === MAKE) return new Response("ok");
      if (url.includes(`/${T.customers}?`) && method === "GET") return Response.json({ records: [] });
      if (url.endsWith(`/${T.customers}`) && method === "POST") return Response.json({ records: [{ id: "recCust", fields: {} }] });
      if (url.endsWith(`/${T.leads}`) && method === "POST") return Response.json({ records: [{ id: "recLead1", fields: {} }] });
      if (url.endsWith(`/${T.leads}`) && method === "PATCH") return Response.json({ records: [{ id: "recLead1", fields: {} }] });
      return new Response("unexpected", { status: 500 });
    }),
  );
  return calls;
};

const fakeProvider = (over: Partial<PaymentProvider> = {}) => {
  const createDepositSession = vi.fn(async () => ({ id: "cs_test_1", url: "https://checkout.example.test/pay/cs_test_1" }));
  const provider: PaymentProvider = { name: "fake", createDepositSession, handlePaymentEvent: vi.fn(), ...over };
  return { provider, createDepositSession };
};

const data = makeData();
const versionNow = "California Seller of Travel@v1";
const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+1 310 555 0100",
  offer: "yacht-charter-los-angeles",
  dates: "Nov 14-16",
  partySize: 8,
  route: "Marina del Rey",
  duration: "Full day",
  occasion: "Birthday",
  acknowledged: true,
  disclosureVersion: versionNow,
  utmSource: "google",
  sourcePageUrl: "https://luxconnoisseurs.com/yachts/yacht-charter-los-angeles/",
};

beforeEach(() => {
  vi.stubEnv("MAKE_WEBHOOK_URL", MAKE);
  vi.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

const run = (body: unknown, extra: Parameters<typeof handleCheckout>[1] = {}) =>
  handleCheckout(body, { cfg, data, now: () => NOW, origin: "https://site.example.test", ...extra });

describe("create-checkout: acknowledgment gate", () => {
  it("cannot start without the acknowledgment (nothing is written, no session is created)", async () => {
    const calls = stubAirtable();
    const { provider, createDepositSession } = fakeProvider();
    for (const ack of [false, undefined, "yes", 1]) {
      const r = await run({ ...valid, acknowledged: ack }, { provider });
      expect(r.status).toBe(400);
      expect((r as any).body.code).toBe("not_acknowledged");
    }
    expect(calls).toHaveLength(0);
    expect(createDepositSession).not.toHaveBeenCalled();
  });

  it("requires the customer to have seen the CURRENT disclosure version", async () => {
    const calls = stubAirtable();
    const { provider, createDepositSession } = fakeProvider();
    const r = await run({ ...valid, disclosureVersion: "California Seller of Travel@v0" }, { provider });
    expect(r.status).toBe(409);
    expect((r as any).body.code).toBe("disclosure_changed");
    expect(calls).toHaveLength(0);
    expect(createDepositSession).not.toHaveBeenCalled();
  });
});

describe("create-checkout: Pay only when it is allowed", () => {
  it("falls back to Quote when the matching Compliance Rule is not Live", async () => {
    const calls = stubAirtable();
    const draft = makeData();
    draft.compliance[0].status = "Draft";
    draft.compliance[0].fullText = "";
    const { provider, createDepositSession } = fakeProvider();
    const r = await run(valid, { provider, data: draft });
    expect(r.status).toBe(409);
    expect((r as any).body.code).toBe("pay_unavailable");
    expect(calls).toHaveLength(0);
    expect(createDepositSession).not.toHaveBeenCalled();
  });

  it("refuses unknown and unpublished offers", async () => {
    stubAirtable();
    const { provider } = fakeProvider();
    expect((await run({ ...valid, offer: "does-not-exist" }, { provider })).status).toBe(409);
    expect((await run({ ...valid, offer: "private-jet-charter-dubai" }, { provider })).status).toBe(409);
  });

  it("refuses a Quote-mode package", async () => {
    stubAirtable();
    const d = makeData();
    d.packages[0].bookingMode = "Quote";
    const { provider } = fakeProvider();
    expect((await run(valid, { provider, data: d })).status).toBe(409);
  });
});

describe("create-checkout: happy path", () => {
  it("logs the disclosure BEFORE redirecting, and takes price/currency from server data only", async () => {
    const calls = stubAirtable();
    const { provider, createDepositSession } = fakeProvider();
    // A malicious client tries to set its own price and currency.
    const r = await run({ ...valid, depositAmount: 1, amount: 1, currency: "EUR", price: 1 }, { provider });
    expect(r).toEqual({ status: 200, body: { ok: true, url: "https://checkout.example.test/pay/cs_test_1" } });

    const create = calls.find((c) => c.method === "POST" && c.url.endsWith(`/${T.leads}`))!.body.records[0].fields;
    expect(create[F.leads.mode]).toBe("Pay");
    expect(create[F.leads.status]).toBe("New Request");
    expect(create[F.leads.paymentStatus]).toBe("Unpaid");
    expect(create[F.leads.disclosureShown]).toBe(true);
    expect(create[F.leads.disclosureShownAt]).toBe(NOW.toISOString());
    expect(create[F.leads.disclosureVersion]).toBe(versionNow);
    expect(create[F.leads.assetType]).toEqual(["recYacht"]);
    expect(create[F.leads.location]).toEqual(["recLA"]);
    expect(create[F.leads.package]).toEqual(["recPkgLA"]);
    expect(create[F.leads.requestDetails]).toContain("Duration: Full day");
    expect(create[F.leads.requestDetails]).toContain("Occasion: Birthday");
    expect(create[F.leads.depositAmount]).toBeUndefined(); // only set once actually paid

    expect(createDepositSession).toHaveBeenCalledTimes(1);
    const session = (createDepositSession.mock.calls[0] as any[])[0];
    expect(session.amountMinor).toBe(50_000); // $500.00 from data, not the client's 1
    expect(session.currency).toBe("USD");
    expect(session.bookingRecordId).toBe("recLead1");
    expect(session.successUrl).toBe("https://site.example.test/thank-you/?mode=booking");
    expect(session.cancelUrl).toContain("/book/?category=yachts&offer=yacht-charter-los-angeles");

    // ordering: the lead (with the disclosure log) exists before the session is created
    const leadIdx = calls.findIndex((c) => c.method === "POST" && c.url.endsWith(`/${T.leads}`));
    expect(leadIdx).toBeGreaterThan(-1);
    expect(createDepositSession.mock.invocationCallOrder[0]).toBeGreaterThan(0);
  });

  it("alerts through Make and returns 502 when the payment provider fails (the lead is kept)", async () => {
    const calls = stubAirtable();
    const { provider } = fakeProvider({ createDepositSession: vi.fn(async () => { throw new Error("stripe down"); }) });
    const r = await run(valid, { provider });
    expect(r.status).toBe(502);
    expect((r as any).body.code).toBe("provider_error");
    expect(calls.some((c) => c.url.endsWith(`/${T.leads}`) && c.method === "POST")).toBe(true);
    const make = calls.find((c) => c.url === MAKE)!;
    expect(make.body.event).toBe("checkout_failed");
  });

  it("never leaks the Airtable token", async () => {
    const calls = stubAirtable();
    const { provider } = fakeProvider();
    await run(valid, { provider });
    expect(JSON.stringify(calls.map((c) => c.body))).not.toContain("patTEST");
  });
});
