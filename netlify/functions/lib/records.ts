/**
 * Airtable record helpers shared by quote-request, create-checkout and stripe-webhook.
 * All writes go through the server-side PAT; the browser never talks to Airtable.
 */
import { SITE } from "../../../src/config/site";
import { F, T } from "../../../shared/airtable-schema";
import { createRecords, formulaString, listRecords, updateRecords, type AirtableConfig } from "../../../shared/airtable";

export interface CustomerInput {
  name: string;
  email: string;
  phone: string;
  smsOptIn?: boolean;
  emailOptIn?: boolean;
  leadSource?: string;
}

/** Finds the Customer by email (case-insensitive) or creates one. Never downgrades an existing opt-in. */
export const upsertCustomer = async (cfg: AirtableConfig, c: CustomerInput): Promise<string> => {
  const email = c.email.trim().toLowerCase();
  const existing = await listRecords(cfg, T.customers, {
    fields: [F.customers.email, F.customers.phone, F.customers.smsOptIn, F.customers.emailOptIn],
    filterByFormula: `LOWER({${F.customers.email}})=${formulaString(email)}`,
  });
  if (existing.length > 0) {
    const row = existing[0];
    const patch: Record<string, unknown> = {};
    if (c.smsOptIn && !row.fields[F.customers.smsOptIn]) patch[F.customers.smsOptIn] = true;
    if (c.emailOptIn && !row.fields[F.customers.emailOptIn]) patch[F.customers.emailOptIn] = true;
    if (c.phone && !row.fields[F.customers.phone]) patch[F.customers.phone] = c.phone;
    if (Object.keys(patch).length) await updateRecords(cfg, T.customers, [{ id: row.id, fields: patch }], { typecast: true });
    return row.id;
  }
  const [created] = await createRecords(
    cfg,
    T.customers,
    [
      {
        fields: {
          [F.customers.name]: c.name,
          [F.customers.email]: email,
          [F.customers.phone]: c.phone,
          [F.customers.smsOptIn]: !!c.smsOptIn,
          [F.customers.emailOptIn]: !!c.emailOptIn,
          ...(c.leadSource ? { [F.customers.leadSource]: c.leadSource } : {}),
        },
      },
    ],
    { typecast: true },
  );
  return created.id;
};

export const createLead = async (cfg: AirtableConfig, fields: Record<string, unknown>) => {
  const [rec] = await createRecords(cfg, T.leads, [{ fields }], { typecast: true });
  return rec;
};

export const updateLead = async (cfg: AirtableConfig, id: string, fields: Record<string, unknown>) => {
  const [rec] = await updateRecords(cfg, T.leads, [{ id, fields }], { typecast: true });
  return rec;
};

/** Only real http(s) URLs go into Airtable URL fields. */
export const safeUrl = (u: string | undefined | null): string | undefined => {
  if (!u) return undefined;
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString().slice(0, 500) : undefined;
  } catch {
    return undefined;
  }
};

export const brandInfo = () => ({
  name: SITE.brand,
  tagline: SITE.tagline,
  phone: SITE.phone.display,
  email: SITE.email,
  website: SITE.url,
});

/**
 * Forwards to the existing Make.com scenario so alerts and follow-ups keep working. A Make outage
 * never fails the visitor's request; the caller decides what to do with the boolean.
 */
export const forwardToMake = async (payload: Record<string, unknown>, url = process.env.MAKE_WEBHOOK_URL): Promise<boolean> => {
  if (!url) return false;
  try {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: brandInfo(), ...payload }) });
    return res.ok;
  } catch {
    return false;
  }
};
