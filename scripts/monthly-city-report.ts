/**
 * Monthly per-city results. Aggregates LAST MONTH's quote requests, deposits taken and deposit revenue
 * per city x asset from Airtable "Leads & Bookings" and writes one row per city x asset to
 * "City Performance". GBP calls, direction requests, website clicks, sessions and ranks are entered by
 * hand and are never touched: an existing row only has its three computed fields updated.
 *
 *   AIRTABLE_PAT=... tsx scripts/monthly-city-report.ts                 # last month
 *   AIRTABLE_PAT=... tsx scripts/monthly-city-report.ts --month=2026-09
 *   tsx scripts/monthly-city-report.ts --dry-run                        # print, write nothing
 */
import assets from "../data/assets.json";
import locations from "../data/locations.json";
import { configFromEnv, createRecords, listRecords, updateRecords } from "../shared/airtable";
import { F, T } from "../shared/airtable-schema";
import { aggregateMonth, previousMonth } from "./lib/city-report";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const month = args.find((a) => a.startsWith("--month="))?.slice("--month=".length) || previousMonth();
if (!/^\d{4}-\d{2}$/.test(month)) {
  console.error(`--month must look like 2026-09 (got "${month}")`);
  process.exit(1);
}

async function main() {
  const cfg = configFromEnv();
  if (!cfg) throw new Error("AIRTABLE_PAT is not set");

  const leads = await listRecords(cfg, T.leads, {
    fields: [F.leads.submitted, F.leads.mode, F.leads.paymentStatus, F.leads.depositAmount, F.leads.currency, F.leads.location, F.leads.assetType],
  });
  const { totals, unassigned } = aggregateMonth(leads, month);

  const existing = await listRecords(cfg, T.cityPerformance, { fields: [F.cityPerformance.label] });
  const byLabel = new Map(existing.map((r) => [r.fields[F.cityPerformance.label] as string, r.id]));

  const creates: { fields: Record<string, unknown> }[] = [];
  const updates: { id: string; fields: Record<string, unknown> }[] = [];

  for (const t of totals) {
    const city = (locations as { id: string; city: string }[]).find((l) => l.id === t.locationId)?.city ?? t.locationId;
    const asset = (assets as { id: string; name: string }[]).find((a) => a.id === t.assetId)?.name ?? t.assetId;
    const label = `${month} ${city} ${asset}`;
    const computed = {
      [F.cityPerformance.quoteRequests]: t.quoteRequests,
      [F.cityPerformance.depositsTaken]: t.depositsTaken,
      [F.cityPerformance.depositRevenue]: t.depositRevenue,
    };
    const currencyNote = t.currencies.length && !(t.currencies.length === 1 && t.currencies[0] === "USD") ? `Deposit revenue currency: ${t.currencies.join(", ")}.` : "";
    console.log(`${label}: ${t.quoteRequests} quote request(s), ${t.depositsTaken} deposit(s), ${t.depositRevenue} revenue${currencyNote ? ` (${currencyNote})` : ""}`);

    const id = byLabel.get(label);
    if (id) updates.push({ id, fields: computed });
    else {
      creates.push({
        fields: {
          [F.cityPerformance.label]: label,
          [F.cityPerformance.month]: `${month}-01`,
          [F.cityPerformance.location]: [t.locationId],
          [F.cityPerformance.assetType]: [t.assetId],
          ...computed,
          ...(currencyNote ? { [F.cityPerformance.notes]: currencyNote } : {}),
        },
      });
    }
  }
  if (unassigned) console.log(`${unassigned} lead(s) this month had no city or asset linked and were not counted.`);
  if (totals.length === 0) console.log(`No leads in ${month}.`);

  if (DRY) return console.log(`(dry run) would create ${creates.length}, update ${updates.length}`);
  if (creates.length) await createRecords(cfg, T.cityPerformance, creates, { typecast: true });
  if (updates.length) await updateRecords(cfg, T.cityPerformance, updates, { typecast: true });
  console.log(`City Performance: ${creates.length} created, ${updates.length} updated for ${month}.`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
