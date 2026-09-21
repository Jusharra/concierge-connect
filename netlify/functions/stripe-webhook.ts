/**
 * POST /api/stripe-webhook
 * Verifies the signature (STRIPE_WEBHOOK_SECRET) on the RAW body, then applies the event:
 *   checkout.session.completed -> Payment Status = Deposit Paid, Status = Paid, Stripe Reference,
 *                                 Deposit Amount, and the Make.com alert / partner confirmation
 *   charge.refunded            -> Payment Status = Refunded
 * A 4xx is returned for a bad signature (Stripe will not retry); a 5xx for our own failures (it will).
 */
import { configFromEnv } from "../../shared/airtable";
import { json } from "./lib/http";
import { getPaymentProvider } from "./lib/payments";
import { applyPaymentEvent } from "./lib/webhook";

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });

  const raw = await req.text(); // must stay untouched for signature verification
  let event;
  try {
    event = await getPaymentProvider().handlePaymentEvent(raw, req.headers);
  } catch (e) {
    const msg = (e as Error).message || "";
    const badSignature = (e as { type?: string }).type === "StripeSignatureVerificationError" || /signature/i.test(msg);
    console.error("[stripe-webhook] rejected:", msg);
    return json({ ok: false, error: badSignature ? "Invalid signature" : "Webhook not configured" }, badSignature ? 400 : 500);
  }

  const cfg = configFromEnv();
  if (!cfg) {
    console.error("[stripe-webhook] AIRTABLE_PAT is not set");
    return json({ ok: false, error: "Server not configured" }, 500);
  }

  try {
    const result = await applyPaymentEvent(event, cfg);
    return json({ ok: true, ...result });
  } catch (e) {
    console.error("[stripe-webhook] failed to apply event:", (e as Error).message);
    return json({ ok: false, error: "Could not apply event" }, 500); // Stripe retries
  }
};

export const config = { path: "/api/stripe-webhook" };
