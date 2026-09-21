import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { F, T } from "../../../shared/airtable-schema";
import { handleQuote } from "./quote";

const cfg = { pat: "patTEST", baseId: "appTEST" };
const MAKE = "https://hook.example.test/abc";

interface Call {
  method: string;
  url: string;
  body?: any;
}

/** Fake Airtable + Make. `existingCustomer` makes the email lookup return a row. */
const stubFetch = (opts: { existingCustomer?: boolean; airtableFails?: boolean; makeFails?: boolean } = {}) => {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const method = init.method || "GET";
      const body = init.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ method, url, body });
      if (url === MAKE) return new Response("ok", { status: opts.makeFails ? 500 : 200 });
      if (opts.airtableFails) return new Response("nope", { status: 500 });
      if (url.includes(`/${T.customers}?`) && method === "GET") {
        return Response.json({ records: opts.existingCustomer ? [{ id: "recCustOld", fields: { [F.customers.smsOptIn]: false } }] : [] });
      }
      if (url.endsWith(`/${T.customers}`) && method === "POST") return Response.json({ records: [{ id: "recCustNew", fields: {} }] });
      if (url.endsWith(`/${T.customers}`) && method === "PATCH") return Response.json({ records: [{ id: "recCustOld", fields: {} }] });
      if (url.endsWith(`/${T.leads}`) && method === "POST") return Response.json({ records: [{ id: "recLead1", fields: { [F.leads.bookingNumber]: 42 } }] });
      return new Response("unexpected", { status: 500 });
    }),
  );
  return calls;
};

const valid = {
  name: "Ada Lovelace",
  email: "Ada@Example.com",
  phone: "+1 310 555 0100",
  category: "yachts",
  offer: "yacht-charter-los-angeles",
  city: "Los Angeles",
  dates: "Nov 14-16",
  partySize: 8,
  route: "Marina del Rey",
  notes: "Birthday",
  smsOptIn: true,
  emailOptIn: true,
  pagePath: "/yachts/yacht-charter-los-angeles/",
  sourcePageUrl: "https://luxconnoisseurs.com/yachts/yacht-charter-los-angeles/",
  utmSource: "google",
  utmMedium: "cpc",
  utmCampaign: "la-yacht",
  website: "",
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

describe("quote-request", () => {
  it("rejects invalid input with per-field messages and writes nothing", async () => {
    const calls = stubFetch();
    const r = await handleQuote({ ...valid, email: "not-an-email", name: "A" }, { cfg });
    expect(r.status).toBe(400);
    expect((r as any).body.fields).toHaveProperty("email");
    expect((r as any).body.fields).toHaveProperty("name");
    expect(calls).toHaveLength(0);
  });

  it("swallows honeypot submissions without touching Airtable or Make", async () => {
    const calls = stubFetch();
    const r = await handleQuote({ ...valid, website: "http://spam.example" }, { cfg });
    expect(r).toEqual({ status: 200, body: { ok: true } });
    expect(calls).toHaveLength(0);
  });

  it("creates a Customer and a Quote lead linked from OUR data, then forwards to Make", async () => {
    const calls = stubFetch();
    const r = await handleQuote(valid, { cfg, now: () => new Date("2026-09-20T12:00:00Z") });
    expect(r).toEqual({ status: 200, body: { ok: true, reference: 42 } });

    const customerCreate = calls.find((c) => c.method === "POST" && c.url.endsWith(`/${T.customers}`))!;
    expect(customerCreate.body.records[0].fields[F.customers.email]).toBe("ada@example.com"); // normalised
    expect(customerCreate.body.records[0].fields[F.customers.smsOptIn]).toBe(true);

    const lead = calls.find((c) => c.method === "POST" && c.url.endsWith(`/${T.leads}`))!.body.records[0].fields;
    expect(lead[F.leads.mode]).toBe("Quote");
    expect(lead[F.leads.status]).toBe("New Request");
    expect(lead[F.leads.customer]).toEqual(["recCustNew"]);
    expect(lead[F.leads.assetType]).toEqual(["rectUBKwlyTequsYM"]); // Yacht Charter record
    expect(lead[F.leads.location]).toEqual(["rechAWMgxSKPqTaOs"]); // Los Angeles record
    expect(lead[F.leads.package]).toHaveLength(1);
    expect(lead[F.leads.route]).toBe("Marina del Rey");
    expect(lead[F.leads.dates]).toBe("Nov 14-16");
    expect(lead[F.leads.partySize]).toBe(8);
    expect(lead[F.leads.sourcePageUrl]).toBe("https://luxconnoisseurs.com/yachts/yacht-charter-los-angeles/");
    expect(lead[F.leads.utmSource]).toBe("google");
    expect(lead[F.leads.utmCampaign]).toBe("la-yacht");

    const make = calls.find((c) => c.url === MAKE)!;
    expect(make.body.brand.name).toBeTruthy();
    expect(make.body.mode).toBe("Quote");
    expect(make.body.offerCity).toBe("Los Angeles");
    expect(make.body.airtable.leadRecordId).toBe("recLead1");
  });

  it("reuses an existing Customer (by email) and upgrades opt-ins instead of duplicating", async () => {
    const calls = stubFetch({ existingCustomer: true });
    await handleQuote(valid, { cfg });
    expect(calls.some((c) => c.method === "POST" && c.url.endsWith(`/${T.customers}`))).toBe(false);
    const patch = calls.find((c) => c.method === "PATCH")!;
    expect(patch.body.records[0].id).toBe("recCustOld");
    expect(patch.body.records[0].fields[F.customers.smsOptIn]).toBe(true);
    const lead = calls.find((c) => c.url.endsWith(`/${T.leads}`))!.body.records[0].fields;
    expect(lead[F.leads.customer]).toEqual(["recCustOld"]);
  });

  it("keeps unlinkable details in Request Details rather than dropping them", async () => {
    const calls = stubFetch();
    await handleQuote({ ...valid, category: "", offer: "", pagePath: "", city: "Lisbon", notes: "Anniversary" }, { cfg });
    const lead = calls.find((c) => c.url.endsWith(`/${T.leads}`))!.body.records[0].fields;
    expect(lead[F.leads.assetType]).toBeUndefined();
    expect(lead[F.leads.requestDetails]).toContain("City requested: Lisbon");
    expect(lead[F.leads.requestDetails]).toContain("Anniversary");
  });

  it("still succeeds (and alerts via Make) when Airtable is down", async () => {
    stubFetch({ airtableFails: true });
    const r = await handleQuote(valid, { cfg });
    expect(r.status).toBe(200);
  });

  it("still succeeds when only Make is down", async () => {
    stubFetch({ makeFails: true });
    expect((await handleQuote(valid, { cfg })).status).toBe(200);
  });

  it("returns 502 only when both Airtable and Make fail", async () => {
    stubFetch({ airtableFails: true, makeFails: true });
    expect((await handleQuote(valid, { cfg })).status).toBe(502);
  });

  it("never puts the Airtable token in a request body or error", async () => {
    const calls = stubFetch();
    await handleQuote(valid, { cfg });
    expect(JSON.stringify(calls.map((c) => c.body))).not.toContain("patTEST");
  });
});
