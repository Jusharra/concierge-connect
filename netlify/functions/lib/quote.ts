/**
 * Quote request logic (Netlify Function quote-request). Kept separate from the HTTP wrapper so it
 * can be unit tested with a mocked fetch.
 *
 *  validate -> honeypot -> resolve asset/location/package from OUR data -> upsert Customer
 *  -> create Leads & Bookings row (Mode = Quote, Status = New Request) -> forward to Make.com
 */
import { z } from "zod";
import { configFromEnv, type AirtableConfig } from "../../../shared/airtable";
import { F } from "../../../shared/airtable-schema";
import { DATA, resolveContext } from "./data";
import { createLead, forwardToMake, safeUrl, upsertCustomer } from "./records";

const text = (max: number) => z.string().trim().max(max);
const optionalText = (max: number) => text(max).optional().or(z.literal(""));

export const quoteSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(254),
  phone: z.string().trim().min(7, "Please enter a valid phone number").max(30),
  // Trip details
  category: optionalText(60), // categorySlug: private-air | yachts | exotic-cars | ...
  offer: optionalText(120), // offer slug
  package: optionalText(120), // nested package slug
  city: optionalText(100),
  dates: optionalText(120),
  partySize: z.coerce.number().int().min(1).max(500).optional().or(z.literal("").transform(() => undefined)),
  route: optionalText(200), // departure point or route
  notes: optionalText(2000),
  smsOptIn: z.boolean().optional(),
  emailOptIn: z.boolean().optional(),
  // Attribution
  pagePath: optionalText(300),
  sourcePageUrl: optionalText(500),
  referrer: optionalText(500),
  utmSource: optionalText(100),
  utmMedium: optionalText(100),
  utmCampaign: optionalText(100),
  // Bot trap: real visitors never see or fill this
  website: optionalText(200),
});

export type QuoteInput = z.infer<typeof quoteSchema>;

export type QuoteResult =
  | { status: 200; body: { ok: true; reference?: number } }
  | { status: 400; body: { ok: false; error: string; fields?: Record<string, string> } }
  | { status: 502; body: { ok: false; error: string } };

export const handleQuote = async (
  raw: unknown,
  opts: { cfg?: AirtableConfig | null; now?: () => Date } = {},
): Promise<QuoteResult> => {
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const issue of parsed.error.issues) fields[String(issue.path[0] ?? "form")] = issue.message;
    return { status: 400, body: { ok: false, error: "Please check the highlighted fields.", fields } };
  }
  const q = parsed.data;

  // Honeypot: pretend success so bots learn nothing, write nothing.
  if (q.website) return { status: 200, body: { ok: true } };

  const now = (opts.now ?? (() => new Date()))();
  const cfg = opts.cfg === undefined ? configFromEnv() : opts.cfg;
  const ctx = resolveContext({ category: q.category || undefined, offer: q.offer || undefined, package: q.package || undefined, city: q.city || undefined, pagePath: q.pagePath || undefined });

  // Anything we could not link goes into Request Details so nothing the visitor typed is lost.
  const details = [
    q.notes,
    !ctx.location && q.city ? `City requested: ${q.city}` : "",
    !ctx.asset && q.category ? `Service requested: ${q.category}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  let customerId: string | undefined;
  let leadId: string | undefined;
  let reference: number | undefined;
  let airtableOk = false;

  if (cfg) {
    try {
      customerId = await upsertCustomer(cfg, {
        name: q.name,
        email: q.email,
        phone: q.phone,
        smsOptIn: q.smsOptIn,
        emailOptIn: q.emailOptIn,
        leadSource: "Quote form",
      });
      const lead = await createLead(cfg, {
        [F.leads.mode]: "Quote",
        [F.leads.status]: "New Request",
        [F.leads.customer]: [customerId],
        ...(ctx.asset ? { [F.leads.assetType]: [ctx.asset.id] } : {}),
        ...(ctx.location ? { [F.leads.location]: [ctx.location.id] } : {}),
        ...(ctx.pkg ? { [F.leads.package]: [ctx.pkg.id] } : {}),
        ...(ctx.pkg?.currency ? { [F.leads.currency]: ctx.pkg.currency } : {}),
        ...(q.route ? { [F.leads.route]: q.route } : {}),
        ...(q.dates ? { [F.leads.dates]: q.dates } : {}),
        ...(q.partySize ? { [F.leads.partySize]: q.partySize } : {}),
        ...(details ? { [F.leads.requestDetails]: details } : {}),
        ...(safeUrl(q.sourcePageUrl) ? { [F.leads.sourcePageUrl]: safeUrl(q.sourcePageUrl) } : {}),
        ...(q.utmSource ? { [F.leads.utmSource]: q.utmSource } : {}),
        ...(q.utmMedium ? { [F.leads.utmMedium]: q.utmMedium } : {}),
        ...(q.utmCampaign ? { [F.leads.utmCampaign]: q.utmCampaign } : {}),
      });
      leadId = lead.id;
      const n = lead.fields?.[F.leads.bookingNumber];
      if (typeof n === "number") reference = n;
      airtableOk = true;
    } catch (e) {
      console.error("[quote-request] Airtable write failed:", (e as Error).message);
    }
  } else {
    console.error("[quote-request] AIRTABLE_PAT is not set; forwarding to Make only");
  }

  // Same payload shape the Supabase submit-lead function sent, plus the new fields.
  const makeOk = await forwardToMake({
    name: q.name,
    email: q.email,
    phone: q.phone,
    city: q.city || ctx.location?.city || "",
    startDate: undefined,
    endDate: undefined,
    preferredDates: q.dates || "Not specified",
    notes: q.notes || "",
    category: ctx.asset?.name || q.category || "General",
    offer: ctx.pkg?.name || "General Inquiry",
    offerCity: ctx.location?.city || q.city || "",
    pageUrl: q.pagePath || "",
    source: q.referrer || "Direct",
    timestamp: now.toISOString(),
    mode: "Quote",
    route: q.route || "",
    partySize: q.partySize ?? null,
    smsOptIn: !!q.smsOptIn,
    emailOptIn: !!q.emailOptIn,
    utm: { source: q.utmSource || "", medium: q.utmMedium || "", campaign: q.utmCampaign || "" },
    airtable: { leadRecordId: leadId || null, customerRecordId: customerId || null },
  });

  if (!airtableOk && !makeOk) {
    return { status: 502, body: { ok: false, error: "We could not submit your request. Please try again or call us." } };
  }
  return { status: 200, body: { ok: true, ...(reference ? { reference } : {}) } };
};

export { DATA };
