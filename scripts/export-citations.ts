/**
 * Writes data/citations.json from the published pages and prints NAP/GBP consistency warnings.
 * Runs during `npm run build` (after the Airtable sync). Not deployed: it lives in data/ for you.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { publishedOffers } from "../src/lib/catalog";
import { buildCitations } from "./lib/citations";

const report = buildCitations(publishedOffers());
mkdirSync(join(process.cwd(), "data"), { recursive: true });
writeFileSync(join(process.cwd(), "data", "citations.json"), JSON.stringify(report, null, 2) + "\n");

console.log(`[citations] ${report.entries.length} live city x asset page(s) exported to data/citations.json`);
for (const w of report.warnings) console.warn(`[citations] ⚠ ${w}`);
