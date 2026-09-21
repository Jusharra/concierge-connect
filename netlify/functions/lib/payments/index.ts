import { createStripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export * from "./types";

/**
 * The single place that decides which processor is used. To swap Stripe for another company,
 * implement PaymentProvider and return it here (e.g. based on a PAYMENT_PROVIDER env var).
 */
export const getPaymentProvider = (): PaymentProvider => createStripeProvider();
