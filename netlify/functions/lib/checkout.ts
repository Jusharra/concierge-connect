/**
 * create-checkout logic. The browser sends WHO and WHEN plus an acknowledgment; everything that
 * matters commercially (deposit, currency, refund terms, disclosure text and version, whether Pay is
 * allowed at all) comes from data/*.json on the server.
 *
 *   validate -> honeypot -> package must be published AND Pay-eligible (compliance Live)
 *   -> acknowledgment required + disclosure version must match -> upsert Customer
 *   -> create Leads & Bookings (Mode Pay, New Request, Unpaid, disclosure LOGGED)
 *   -> create hosted checkout with the booking record ID in metadata
 */
import { z } from "zod";
import { SITE } from "../../../src/config/site";
import { configFromEnv, type AirtableConfig } from "../../../shared/airtable";
import { F } from "../../../shared/airtable-schema";
import { DATA, findPublishedPackage } from "./data";
import { payAvailability } from "../../../shared/catalog-logic";
import type { SiteData } from "../../../shared/data-types";
import { createLead, forwardToMake, safeUrl, updateLead, upsertCustomer } from "./records";
import { getPaymentProvider, toMinorUnits, type PaymentProvider } from "./payments";

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().or(z.literal(""));

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(254),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  offer: z.string().trim().min(1).max(120),
  package: optionalText(120),
  // Trip details (some are conditional on asset type)
  dates: optionalText(120),
  partySize: z.coerce.number().int().min(1).max(500).optional().or(z.literal("").transform(() => undefined)),
  route: optionalText(200), // departure point
  aircraftPreference: optionalText(200),
  vehiclePreference: optionalText(200),
  duration: optionalText(100),
  occasion: optionalText(200),
  notes: optionalText(2000),
  smsOptIn: z.boolean().optional(),
  emailOptIn: z.boolean().optional(),
  // The acknowledgment. Literal true: no acknowledgment, no checkout.
  acknowledged: z.literal(true, { errorMap: () => ({ message: "Please read and accept the terms to continue" }) }),
  disclosureVersion: optionalText(600),
  // Attribution
  pagePath: optionalText(300),
  sourcePageUrl: optionalText(500),
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
  website: optionalText(200), // honeypot
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export type CheckoutResult =
  | { status: 200; body: { ok: true; url: string } }
  | { status: 400 | 409 | 502; body: { ok: false; error: string; code?: string; fields?: Record<string, string> } };

const siteOrigin = () => (process.env.SITE_URL_OVERRIDE || SITE.url).replace(/\/$/, "");

export const handleCheckout = async (
  raw: unknown,
  opts: { cfg?: AirtableConfig | null; provider?: PaymentProvider; now?: () => Date; origin?: string; data?: SiteData } = {},
): Promise<CheckoutResult> => {
  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0] ?? "form")] = issue.message;
    const ack = fields.acknowledged;
    return { status: 400, body: { ok: false, error: ack || "Please check the highlighted fields.", code: ack ? "not_acknowledged" : "invalid", fields } };
  }
  const q = parsed.data;
  if (q.website) return { status: 400, body: { ok: false, error: "Invalid request", code: "invalid" } };

  const data = opts.data ?? DATA;
  const found = findPublishedPackage(q.offer, q.package || undefined, data);
  if (!found) return { status: 409, body: { ok: false, error: "This trip is not available to reserve online. Please request a quote.", code: "pay_unavailable" } };

  const pay = payAvailability(found.pkg, data);
  if (!pay.allowed) {
    // e.g. the matching Compliance Rule is not Live: fall back to Quote only.
    return { status: 409, body: { ok: false, error: "Online reservation is not available for this trip yet. Please request a quote.", code: "pay_unavailable" } };
  }

  // The customer must have seen the CURRENT disclosure text.
  const currentVersion = pay.compliance.disclosureVersion;
  if ((q.disclosureVersion || "") !== currentVersion) {
    return { status: 409, body: { ok: false, error: "The booking terms were updated. Please reload the page and review them again.", code: "disclosure_changed" } };
  }

  const cfg = opts.cfg === undefined ? configFromEnv() : opts.cfg;
  if (!cfg) return { status: 502, body: { ok: false, error: "Reservations are temporarily unavailable. Please request a quote or call us.", code: "unavailable" } };

  const provider = opts.provider ?? getPaymentProvider();
  const now = (opts.now ?? (() => new Date()))();
  const { pkg, asset, location } = found;
  const deposit = pkg.depositAmount as number;
  const currency = pkg.currency;

  const details = [
    q.aircraftPreference && `Aircraft preference: ${q.aircraftPreference}`,
    q.vehiclePreference && `Vehicle preference: ${q.vehiclePreference}`,
    q.duration && `Duration: ${q.duration}`,
    q.occasion && `Occasion: ${q.occasion}`,
    q.notes,
  ]
    .filter(Boolean)
    .join("\n");

  let leadId: string;
  try {
    const customerId = await upsertCustomer(cfg, {
      name: q.name,
      email: q.email,
      phone: q.phone,
      smsOptIn: q.smsOptIn,
      emailOptIn: q.emailOptIn,
      leadSource: "Booking form",
    });
    const lead = await createLead(cfg, {
      [F.leads.mode]: "Pay",
      [F.leads.status]: "New Request",
      [F.leads.paymentStatus]: "Unpaid",
      [F.leads.customer]: [customerId],
      [F.leads.assetType]: [asset.id],
      [F.leads.location]: [location.id],
      [F.leads.package]: [pkg.id],
      [F.leads.currency]: currency,
      // Disclosure is logged BEFORE the customer is sent to pay, with the exact version they saw.
      [F.leads.disclosureShown]: true,
      [F.leads.disclosureShownAt]: now.toISOString(),
      [F.leads.disclosureVersion]: currentVersion.slice(0, 500),
      ...(q.route ? { [F.leads.route]: q.route } : {}),
      ...(q.dates ? { [F.leads.dates]: q.dates } : {}),
      ...(q.partySize ? { [F.leads.partySize]: q.partySize } : {}),
      ...(details ? { [F.leads.requestDetails]: details } : {}),
      [F.leads.notes]: `Acknowledged before payment: deposit is a booking fee; balance paid directly to the operator. Refund terms shown: ${pkg.riskReversalText}`,
      ...(safeUrl(q.sourcePageUrl) ? { [F.leads.sourcePageUrl]: safeUrl(q.sourcePageUrl) } : {}),
      ...(q.utmSource ? { [F.leads.utmSource]: q.utmSource } : {}),
      ...(q.utmMedium ? { [F.leads.utmMedium]: q.utmMedium } : {}),
      ...(q.utmCampaign ? { [F.leads.utmCampaign]: q.utmCampaign } : {}),
    });
    leadId = lead.id;
  } catch (e) {
    console.error("[create-checkout] Airtable write failed:", (e as Error).message);
    return { status: 502, body: { ok: false, error: "We could not start your reservation. Please request a quote or call us.", code: "unavailable" } };
  }

  const origin = (opts.origin || siteOrigin()).replace(/\/$/, "");
  try {
    const session = await provider.createDepositSession({
      bookingRecordId: leadId,
      amountMinor: toMinorUnits(deposit, currency),
      currency,
      description: `${pkg.name} deposit`,
      customerEmail: q.email,
      successUrl: `${origin}/thank-you/?mode=booking`,
      cancelUrl: `${origin}/book/?category=${asset.categorySlug}&offer=${pkg.offerSlug}${pkg.packageSlug ? `&package=${pkg.packageSlug}` : ""}&cancelled=1`,
      metadata: { offer: pkg.offerSlug, package: pkg.packageSlug || "", asset: asset.slug, city: location.slug },
    });
    // Keep the session ID on the booking until the payment reference replaces it.
    await updateLead(cfg, leadId, { [F.leads.stripeReference]: session.id }).catch(() => undefined);
    return { status: 200, body: { ok: true, url: session.url } };
  } catch (e) {
    console.error("[create-checkout] payment provider error:", (e as Error).message);
    // The lead exists and someone should follow up: alert through Make as a manual request.
    await forwardToMake({
      name: q.name,
      email: q.email,
      phone: q.phone,
      mode: "Pay",
      event: "checkout_failed",
      category: asset.name,
      offer: pkg.name,
      offerCity: location.city,
      timestamp: now.toISOString(),
      airtable: { leadRecordId: leadId },
    });
    return { status: 502, body: { ok: false, error: "We could not open the secure payment page. Our team has your details and will be in touch, or please call us.", code: "provider_error" } };
  }
};
