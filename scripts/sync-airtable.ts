/**
 * Build-time sync: Airtable -> data/*.json.
 *
 * Runs at the start of `npm run build` (Netlify). If AIRTABLE_PAT is missing or Airtable is
 * unreachable, the committed data/*.json files are used unchanged, so the build never breaks.
 * The page templates read only data/*.json; nothing at runtime in the browser talks to Airtable.
 *
 *   tsx scripts/sync-airtable.ts                  # normal sync
 *   tsx scripts/sync-airtable.ts --from=raw.json  # transform a saved RawTables dump (no network)
 *   tsx scripts/sync-airtable.ts --report         # only print the publishing report from data/*.json
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { configFromEnv, listRecords } from "../shared/airtable";
import { F, T } from "../shared/airtable-schema";
import { publishability } from "../shared/catalog-logic";
import type { SiteData } from "../shared/data-types";
import { transformAll, type RawTables } from "./lib/transform";

const DATA_DIR = join(process.cwd(), "data");
const FILES: Record<keyof SiteData, string> = {
  assetTypes: "assets.json",
  locations: "locations.json",
  packages: "packages.json",
  partners: "partners.json",
  compliance: "compliance.json",
  gbp: "gbp.json",
  redirects: "redirects.json",
};

const args = process.argv.slice(2);
const FROM = args.find((a) => a.startsWith("--from="))?.slice("--from=".length);
const REPORT_ONLY = args.includes("--report");

export const readData = (): SiteData => {
  const out = {} as SiteData;
  for (const [key, file] of Object.entries(FILES)) {
    const p = join(DATA_DIR, file);
    (out as any)[key] = existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : [];
  }
  return out;
};

const writeData = (data: SiteData) => {
  mkdirSync(DATA_DIR, { recursive: true });
  let changed = 0;
  for (const [key, file] of Object.entries(FILES)) {
    const p = join(DATA_DIR, file);
    const next = JSON.stringify((data as any)[key], null, 2) + "\n";
    if (!existsSync(p) || readFileSync(p, "utf8") !== next) {
      writeFileSync(p, next);
      changed++;
    }
  }
  return changed;
};

const values = (o: Record<string, string>) => Object.values(o);
// Fields requested per table. Partners: NAME AND LINKS ONLY (no contact details); internal Notes
// fields are never requested.
const REQUEST = {
  assetTypes: values(F.assetTypes),
  locations: values(F.locations).filter((f) => f !== F.locations.notes),
  packages: values(F.packages).filter((f) => f !== F.packages.notes),
  partners: values(F.partners),
  compliance: values(F.compliance),
  gbp: values(F.gbpListings),
  pageRegistry: values(F.pageRegistry),
};

async function fetchRaw(): Promise<RawTables> {
  const cfg = configFromEnv();
  if (!cfg) throw new Error("AIRTABLE_PAT is not set");
  const [assetTypes, locations, packages, partners, compliance, gbp, pageRegistry] = await Promise.all([
    listRecords(cfg, T.assetTypes, { fields: REQUEST.assetTypes }),
    listRecords(cfg, T.locations, { fields: REQUEST.locations }),
    listRecords(cfg, T.packages, { fields: REQUEST.packages }),
    listRecords(cfg, T.partners, { fields: REQUEST.partners }),
    listRecords(cfg, T.compliance, { fields: REQUEST.compliance }),
    listRecords(cfg, T.gbpListings, { fields: REQUEST.gbp }),
    listRecords(cfg, T.pageRegistry, { fields: REQUEST.pageRegistry }),
  ]);
  return { assetTypes, locations, packages, partners, compliance, gbp, pageRegistry };
}

export const printReport = (data: SiteData) => {
  const bookable = new Set(data.assetTypes.filter((a) => a.bookable).map((a) => a.id));
  const offers = data.packages.filter((p) => bookable.has(p.assetId));
  const rows = offers.map((p) => ({ p, r: publishability(p, data) }));
  const live = rows.filter((x) => x.r.ok);
  console.log(`\nPublishing gate: ${live.length} of ${rows.length} bookable pages will be built`);
  for (const { p, r } of live) console.log(`  ✔ /${p.categorySlug}/${p.offerSlug}${p.packageSlug ? `/${p.packageSlug}` : ""}/`);
  const blocked = rows.filter((x) => !x.r.ok);
  if (blocked.length) {
    console.log(`  Not built (${blocked.length}):`);
    for (const { p, r } of blocked) console.log(`  ✖ /${p.categorySlug}/${p.offerSlug}/  -> ${r.reasons.join("; ")}`);
  }
};

async function main() {
  if (REPORT_ONLY) return printReport(readData());

  let raw: RawTables | null = null;
  try {
    raw = FROM ? JSON.parse(readFileSync(FROM, "utf8")) : await fetchRaw();
  } catch (e: any) {
    const why = e?.message || String(e);
    const level = /AIRTABLE_PAT is not set/.test(why) ? "note" : "WARNING";
    console.warn(`[sync-airtable] ${level}: ${why}. Using the committed data/*.json files.`);
  }

  if (raw) {
    const data = transformAll(raw);
    if (data.assetTypes.length === 0 || data.packages.length === 0) {
      console.warn("[sync-airtable] WARNING: Airtable returned no asset types or packages; keeping committed data/*.json.");
    } else {
      const changed = writeData(data);
      console.log(`[sync-airtable] synced from Airtable: ${data.locations.length} locations, ${data.packages.length} packages, ${data.partners.length} partners, ${data.compliance.length} compliance rules (${changed} file(s) changed)`);
    }
  }
  printReport(readData());
}

main().catch((e) => {
  console.warn(`[sync-airtable] unexpected error: ${e?.message || e}. Using committed data/*.json.`);
});
