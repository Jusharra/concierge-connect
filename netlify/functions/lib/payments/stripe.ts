/**
 * Stripe implementation of PaymentProvider (hosted Checkout). Test keys first:
 * STRIPE_SECRET_KEY=sk_test_..., STRIPE_WEBHOOK_SECRET=whsec_... (Netlify environment variables only).
 */
import Stripe from "stripe";
import type { DepositSession, DepositSessionInput, PaymentEvent, PaymentProvider } from "./types";

export const createStripeProvider = (
  env: Record<string, string | undefined> = process.env,
  client?: Stripe,
): PaymentProvider => {
  const secret = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  const stripe = client ?? (secret ? new Stripe(secret) : (undefined as unknown as Stripe));

  const need = () => {
    if (!stripe) throw new Error("STRIPE_SECRET_KEY is not set");
    return stripe;
  };

  return {
    name: "stripe",

    async createDepositSession(input: DepositSessionInput): Promise<DepositSession> {
      const s = need();
      const session = await s.checkout.sessions.create({
        mode: "payment",
        customer_email: input.customerEmail,
        client_reference_id: input.bookingRecordId,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: input.currency.toLowerCase(),
              unit_amount: input.amountMinor,
              product_data: { name: input.description },
            },
          },
        ],
        success_url: input.successUrl,
        cancel_url: input.cancelUrl,
        metadata: { bookingRecordId: input.bookingRecordId, ...(input.metadata || {}) },
        // Copied onto the PaymentIntent so refunds can be matched to the booking too.
        payment_intent_data: { metadata: { bookingRecordId: input.bookingRecordId } },
      });
      if (!session.url) throw new Error("Stripe did not return a checkout URL");
      return { id: session.id, url: session.url };
    },

    async handlePaymentEvent(rawBody: string, headers: Headers): Promise<PaymentEvent> {
      const s = need();
      if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
      const signature = headers.get("stripe-signature");
      if (!signature) throw new Error("Missing Stripe-Signature header");
      // Throws on a bad signature or a body that was modified in transit.
      const event = s.webhooks.constructEvent(rawBody, signature, webhookSecret);

      switch (event.type) {
        case "checkout.session.completed":
        case "checkout.session.async_payment_succeeded": {
          const session = event.data.object as Stripe.Checkout.Session;
          if (session.payment_status !== "paid") return { kind: "ignored", reason: `payment_status=${session.payment_status}` };
          const bookingRecordId = session.metadata?.bookingRecordId || session.client_reference_id || "";
          if (!bookingRecordId) return { kind: "ignored", reason: "no bookingRecordId on session" };
          const reference = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || session.id;
          return {
            kind: "deposit_paid",
            bookingRecordId,
            reference,
            amountMinor: session.amount_total ?? 0,
            currency: (session.currency || "").toUpperCase(),
          };
        }
        case "charge.refunded": {
          const charge = event.data.object as Stripe.Charge;
          const reference = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id || "";
          if (!reference) return { kind: "ignored", reason: "refunded charge has no payment_intent" };
          return {
            kind: "refunded",
            reference,
            bookingRecordId: charge.metadata?.bookingRecordId || undefined,
            amountMinor: charge.amount,
            amountRefundedMinor: charge.amount_refunded,
            fullyRefunded: charge.refunded === true,
            currency: (charge.currency || "").toUpperCase(),
          };
        }
        default:
          return { kind: "ignored", reason: event.type };
      }
    },
  };
};
