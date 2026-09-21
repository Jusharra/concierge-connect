/**
 * Monthly city x asset aggregation from Leads & Bookings. Pure so it can be tested.
 * Counts are by the record's Submitted time (UTC month).
 */
import { F } from "../../shared/airtable-schema";
import type { AirtableRecord } from "../../shared/airtable";

export interface CityAssetTotals {
  locationId: string;
  assetId: string;
  quoteRequests: number;
  depositsTaken: number;
  depositRevenue: number;
  currencies: string[];
}

/** "2026-09" for a Date (UTC). */
export const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;

/** The month before `now`, as "YYYY-MM" (UTC). */
export const previousMonth = (now: Date = new Date()) => monthKey(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)));

export const aggregateMonth = (leads: AirtableRecord[], month: string): { totals: CityAssetTotals[]; unassigned: number } => {
  const map = new Map<string, CityAssetTotals>();
  let unassigned = 0;

  for (const r of leads) {
    const submitted = r.fields[F.leads.submitted];
    if (typeof submitted !== "string" || monthKey(new Date(submitted)) !== month) continue;

    const locationId = r.fields[F.leads.location]?.[0];
    const assetId = r.fields[F.leads.assetType]?.[0];
    if (!locationId || !assetId) {
      unassigned++;
      continue;
    }
    const key = `${locationId}|${assetId}`;
    const t = map.get(key) ?? { locationId, assetId, quoteRequests: 0, depositsTaken: 0, depositRevenue: 0, currencies: [] };

    const mode = r.fields[F.leads.mode];
    const paymentStatus = r.fields[F.leads.paymentStatus];
    const deposit = typeof r.fields[F.leads.depositAmount] === "number" ? (r.fields[F.leads.depositAmount] as number) : 0;

    if (mode === "Quote") t.quoteRequests += 1;
    // A deposit counts once it is actually paid; refunded bookings do not count as revenue.
    if ((paymentStatus === "Deposit Paid" || paymentStatus === "Paid") && deposit > 0) {
      t.depositsTaken += 1;
      t.depositRevenue += deposit;
      const cur = r.fields[F.leads.currency];
      if (typeof cur === "string" && !t.currencies.includes(cur)) t.currencies.push(cur);
    }
    map.set(key, t);
  }
  return { totals: [...map.values()], unassigned };
};
