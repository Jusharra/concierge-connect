/**
 * The whole payment surface the site depends on. Stripe is the first implementation
 * (./stripe.ts); another processor only has to implement this interface and be returned from
 * getPaymentProvider() in ./index.ts. Nothing else in the codebase imports a payment SDK.
 */

export interface DepositSessionInput {
  /** Airtable Leads & Bookings record ID: the link between a payment and its booking. */
  bookingRecordId: string;
  /** Smallest currency unit (cents), computed from the package's Deposit Amount on the server. */
  amountMinor: number;
  /** ISO 4217 code, from the package data. */
  currency: string;
  description: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface DepositSession {
  /** Provider's session ID. */
  id: string;
  /** Hosted page to send the customer to. */
  url: string;
}

export type PaymentEvent =
  | {
      kind: "deposit_paid";
      bookingRecordId: string;
      /** Provider reference for the payment, stored as "Stripe Reference" (a PaymentIntent ID). */
      reference: string;
      amountMinor: number;
      currency: string;
    }
  | {
      kind: "refunded";
      reference: string;
      bookingRecordId?: string;
      amountMinor: number;
      amountRefundedMinor: number;
      fullyRefunded: boolean;
      currency: string;
    }
  | { kind: "ignored"; reason: string };

export interface PaymentProvider {
  readonly name: string;
  /** Creates the hosted checkout for the deposit. */
  createDepositSession(input: DepositSessionInput): Promise<DepositSession>;
  /**
   * Verifies the webhook signature and turns the provider's event into a PaymentEvent.
   * Must throw when the signature is missing or invalid.
   */
  handlePaymentEvent(rawBody: string, headers: Headers): Promise<PaymentEvent>;
}

/** Zero- and three-decimal currencies differ from the usual two; the site only sells in 2-decimal ones today. */
const ZERO_DECIMAL = new Set(["JPY", "KRW", "VND", "CLP", "UGX", "XAF", "XOF"]);
const THREE_DECIMAL = new Set(["BHD", "KWD", "OMR", "JOD", "TND"]);

export const toMinorUnits = (amount: number, currency: string): number => {
  const c = currency.toUpperCase();
  const factor = ZERO_DECIMAL.has(c) ? 1 : THREE_DECIMAL.has(c) ? 1000 : 100;
  return Math.round(amount * factor);
};

export const fromMinorUnits = (minor: number, currency: string): number => {
  const c = currency.toUpperCase();
  const factor = ZERO_DECIMAL.has(c) ? 1 : THREE_DECIMAL.has(c) ? 1000 : 100;
  return minor / factor;
};
