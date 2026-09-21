import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import { F, T } from "../../../shared/airtable-schema";
import { applyPaymentEvent } from "./webhook";
import { createStripeProvider } from "./payments/stripe";
import { fromMinorUnits, toMinorUnits } from "./payments";

const cfg = { pat: "patTEST", baseId: "appTEST" };
const MAKE = "https://hook.example.test/abc";
const NOW = () => new Date("2026-10-01T16:00:00Z");

interface Call { method: string; url: string; body?: any }

/** In-memory Airtable: one lead row that PATCHes actually change, so replays behave realistically. */
const stubAirtable = (lead: Record<string, any>) => {
  const calls: Call[] = [];
  const state = { ...lead };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init: RequestInit = {}) => {
      const method = init.method || "GET";
      const body = init.body ? JSON.parse(String(init.body)) : undefined;
      calls.push({ method, url, body });
      if (url === MAKE) return new Response("ok");
      if (url.includes(`/${T.leads}/recLead1`)) return Response.json({ id: "recLead1", fields: state });
      if (url.includes(`/${T.customers}/recCust`)) return Response.json({ id: "recCust", fields: { [F.customers.name]: "Ada", [F.customers.email]: "ada@example.com", [F.customers.phone]: "+1 310" } });
      if (url.includes(`/${T.leads}?`) && method === "GET") {
        const wanted = decodeURIComponent(url).includes(`"${state[F.leads.stripeReference]}"`);
        return Response.json({ records: wanted ? [{ id: "recLead1", fields: state }] : [] });
      }
      if (url.endsWith(`/${T.leads}`) && method === "PATCH") {
        Object.assign(state, body.records[0].fields);
        return Response.json({ records: [{ id: "recLead1", fields: state }] });
      }
      return new Response("unexpected " + url, { status: 500 });
    }),
  );
  return { calls, state };
};

const baseLead = {
  [F.leads.paymentStatus]: "Unpaid",
  [F.leads.status]: "New Request",
  [F.leads.disclosureShown]: true,
  [F.leads.disclosureShownAt]: "2026-10-01T15:30:00.000Z",
  [F.leads.customer]: ["recCust"],
  [F.leads.dates]: "Nov 14-16",
  [F.leads.bookingNumber]: 7,
  [F.leads.notes]: "n",
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

const paid = { kind: "deposit_paid" as const, bookingRecordId: "recLead1", reference: "pi_123", amountMinor: 50_000, currency: "USD" };

describe("applyPaymentEvent: deposit paid", () => {
  it("marks the booking Deposit Paid / Paid with the Stripe reference and deposit, and alerts Make", async () => {
    const { calls, state } = stubAirtable({ ...baseLead });
    const r = await applyPaymentEvent(paid, cfg, NOW);
    expect(r).toEqual({ handled: true, detail: "deposit paid" });
    expect(state[F.leads.paymentStatus]).toBe("Deposit Paid");
    expect(state[F.leads.status]).toBe("Paid");
    expect(state[F.leads.stripeReference]).toBe("pi_123");
    expect(state[F.leads.depositAmount]).toBe(500);
    const make = calls.filter((c) => c.url === MAKE);
    expect(make).toHaveLength(1);
    expect(make[0].body.event).toBe("deposit_paid");
    expect(make[0].body.email).toBe("ada@example.com");
    expect(make[0].body.disclosureLogged).toBe(true);
  });

  it("is idempotent: a replayed webhook neither re-writes nor re-alerts", async () => {
    const { calls } = stubAirtable({ ...baseLead });
    await applyPaymentEvent(paid, cfg, NOW);
    const before = calls.length;
    const r = await applyPaymentEvent(paid, cfg, NOW);
    expect(r).toEqual({ handled: true, detail: "already applied" });
    expect(calls.slice(before).filter((c) => c.method === "PATCH" || c.url === MAKE)).toHaveLength(0);
  });

  it("flags a payment that arrives without a logged disclosure acknowledgment", async () => {
    const { state } = stubAirtable({ ...baseLead, [F.leads.disclosureShown]: false, [F.leads.disclosureShownAt]: undefined });
    const r = await applyPaymentEvent(paid, cfg, NOW);
    expect(r.detail).toMatch(/NOT logged/);
    expect(state[F.leads.notes]).toContain("CHECK: payment received but no disclosure acknowledgment");
  });
});

describe("applyPaymentEvent: refunds", () => {
  const refund = { kind: "refunded" as const, reference: "pi_123", amountMinor: 50_000, amountRefundedMinor: 50_000, fullyRefunded: true, currency: "USD" };

  it("sets Payment Status = Refunded on a full refund (found by Stripe reference)", async () => {
    const { state, calls } = stubAirtable({ ...baseLead, [F.leads.paymentStatus]: "Deposit Paid", [F.leads.status]: "Paid", [F.leads.stripeReference]: "pi_123" });
    const r = await applyPaymentEvent(refund, cfg, NOW);
    expect(r.detail).toBe("refunded");
    expect(state[F.leads.paymentStatus]).toBe("Refunded");
    expect(state[F.leads.status]).toBe("Refunded");
    expect(calls.find((c) => c.url === MAKE)!.body.event).toBe("refunded");
  });

  it("records a partial refund without changing the payment status", async () => {
    const { state } = stubAirtable({ ...baseLead, [F.leads.paymentStatus]: "Deposit Paid", [F.leads.stripeReference]: "pi_123" });
    await applyPaymentEvent({ ...refund, amountRefundedMinor: 10_000, fullyRefunded: false }, cfg, NOW);
    expect(state[F.leads.paymentStatus]).toBe("Deposit Paid");
    expect(state[F.leads.notes]).toContain("Partial refund of 100 USD");
  });

  it("ignores events it does not handle", async () => {
    stubAirtable({ ...baseLead });
    expect(await applyPaymentEvent({ kind: "ignored", reason: "invoice.paid" }, cfg, NOW)).toEqual({ handled: false, detail: "invoice.paid" });
  });
});

describe("Stripe provider: signature verification and event mapping", () => {
  const SECRET = "whsec_test_secret";
  const stripe = new Stripe("sk_test_dummy");
  const provider = createStripeProvider({ STRIPE_SECRET_KEY: "sk_test_dummy", STRIPE_WEBHOOK_SECRET: SECRET }, stripe);
  const sign = (payload: string, secret = SECRET) => new Headers({ "stripe-signature": stripe.webhooks.generateTestHeaderString({ payload, secret }) });

  const sessionEvent = (over: Record<string, unknown> = {}) =>
    JSON.stringify({
      id: "evt_1", object: "event", type: "checkout.session.completed", api_version: "2024-06-20", created: 1,
      data: { object: { id: "cs_1", object: "checkout.session", payment_status: "paid", payment_intent: "pi_123", amount_total: 50000, currency: "usd", client_reference_id: "recLead1", metadata: { bookingRecordId: "recLead1" }, ...over } },
    });

  it("accepts a correctly signed checkout.session.completed", async () => {
    const body = sessionEvent();
    expect(await provider.handlePaymentEvent(body, sign(body))).toEqual({
      kind: "deposit_paid", bookingRecordId: "recLead1", reference: "pi_123", amountMinor: 50000, currency: "USD",
    });
  });

  it("rejects a wrong secret, a tampered body and a missing signature", async () => {
    const body = sessionEvent();
    await expect(provider.handlePaymentEvent(body, sign(body, "whsec_other"))).rejects.toThrow(/signature/i);
    await expect(provider.handlePaymentEvent(body.replace("50000", "1"), sign(body))).rejects.toThrow(/signature/i);
    await expect(provider.handlePaymentEvent(body, new Headers())).rejects.toThrow(/Stripe-Signature/);
  });

  it("does not treat an unpaid session as paid", async () => {
    const body = sessionEvent({ payment_status: "unpaid" });
    expect((await provider.handlePaymentEvent(body, sign(body))).kind).toBe("ignored");
  });

  it("maps charge.refunded", async () => {
    const body = JSON.stringify({
      id: "evt_2", object: "event", type: "charge.refunded", api_version: "2024-06-20", created: 1,
      data: { object: { id: "ch_1", object: "charge", payment_intent: "pi_123", amount: 50000, amount_refunded: 50000, refunded: true, currency: "usd", metadata: { bookingRecordId: "recLead1" } } },
    });
    expect(await provider.handlePaymentEvent(body, sign(body))).toEqual({
      kind: "refunded", reference: "pi_123", bookingRecordId: "recLead1", amountMinor: 50000, amountRefundedMinor: 50000, fullyRefunded: true, currency: "USD",
    });
  });

  it("ignores unrelated event types", async () => {
    const body = JSON.stringify({ id: "evt_3", object: "event", type: "invoice.paid", api_version: "2024-06-20", created: 1, data: { object: {} } });
    expect((await provider.handlePaymentEvent(body, sign(body))).kind).toBe("ignored");
  });
});

describe("minor units", () => {
  it("converts to and from cents", () => {
    expect(toMinorUnits(500, "USD")).toBe(50_000);
    expect(toMinorUnits(19.99, "EUR")).toBe(1999);
    expect(fromMinorUnits(50_000, "USD")).toBe(500);
  });
});
