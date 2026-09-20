/**
 * ONE-TIME seed: exports the 19 cities and 25 offers from src/lib/constants.ts into the Airtable
 * "Concierge Connect" base (Locations + Packages). Safe to re-run: it only creates rows that do not
 * exist yet (matched by Location Slug / Package Offer Slug) and never edits existing rows.
 *
 *   AIRTABLE_PAT=... tsx scripts/seed-airtable.ts            # create missing rows
 *   tsx scripts/seed-airtable.ts --dry-run                   # print what would be created
 *   tsx scripts/seed-airtable.ts --emit=seed-payloads.json   # write payloads without calling Airtable
 *
 * Every Location is created with Live unchecked and every Package with Active unchecked. Nothing is
 * invented: latitude/longitude, GBP URLs, hub points, FAQs, prices, deposits, risk-reversal wording
 * and compliance text are left blank and reported at the end.
 *
 * Existing slugs are kept exactly. Editorial copy for the bookable offers comes from
 * scripts/seed-data/copy-rewrites.ts (money-model-safe rewrites of the original copy).
 */
import { writeFileSync } from "node:fs";
import { LEGACY_CATEGORIES } from "../src/lib/constants";
import { F, T } from "../shared/airtable-schema";
import { configFromEnv, createRecords, listRecords } from "../shared/airtable";
import { COPY, HOW_IT_WORKS, INCLUDED_REWRITES } from "./seed-data/copy-rewrites";

const args = process.argv.slice(2);
const DRY = args.includes("--dry-run");
const EMIT = args.find((a) => a.startsWith("--emit="))?.slice("--emit=".length);

/** Objective geography only. No coordinates (those are for you to add). */
const GEO: Record<string, { state: string; country: string; currency: "USD" | "EUR" | "GBP" | "AED" | "BSD" }> = {
  Miami: { state: "Florida", country: "United States", currency: "USD" },
  "Los Angeles": { state: "California", country: "United States", currency: "USD" },
  "New York": { state: "New York", country: "United States", currency: "USD" },
  Dubai: { state: "Dubai", country: "United Arab Emirates", currency: "AED" },
  London: { state: "England", country: "United Kingdom", currency: "GBP" },
  Monaco: { state: "", country: "Monaco", currency: "EUR" },
  "St. Tropez": { state: "Provence-Alpes-Côte d'Azur", country: "France", currency: "EUR" },
  Bahamas: { state: "", country: "Bahamas", currency: "BSD" },
  Ibiza: { state: "Balearic Islands", country: "Spain", currency: "EUR" },
  Scottsdale: { state: "Arizona", country: "United States", currency: "USD" },
  "Newport Beach": { state: "California", country: "United States", currency: "USD" },
  Naperville: { state: "Illinois", country: "United States", currency: "USD" },
  "Boca Raton": { state: "Florida", country: "United States", currency: "USD" },
  Bellevue: { state: "Washington", country: "United States", currency: "USD" },
  Columbus: { state: "Ohio", country: "United States", currency: "USD" },
  Tampa: { state: "Florida", country: "United States", currency: "USD" },
  Riverside: { state: "California", country: "United States", currency: "USD" },
  Allentown: { state: "Pennsylvania", country: "United States", currency: "USD" },
  "Kansas City": { state: "Missouri", country: "United States", currency: "USD" },
};

const BOOKABLE_CATEGORIES = new Set(["private-air", "yachts", "exotic-cars"]);
const slugify = (city: string) =>
  city
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// The one offer that does not exist in constants.ts yet: the Los Angeles yacht page used for the
// first end-to-end test. Created as a DRAFT row with no invented content.
const DRAFT_LA_YACHT = {
  categoryId: "yachts",
  city: "Los Angeles",
  slug: "yacht-charter-los-angeles",
  title: "Yacht Charter Los Angeles",
};

interface PlannedOffer {
  categoryId: string;
  city: string;
  slug: string;
  title: string;
  offer?: (typeof LEGACY_CATEGORIES)[number]["offers"][number];
}

const offers: PlannedOffer[] = [
  ...LEGACY_CATEGORIES.flatMap((c) => c.offers.map((o) => ({ categoryId: c.id, city: o.city, slug: o.slug, title: o.title, offer: o }))),
  DRAFT_LA_YACHT,
];

const uniqueCities = [...new Set(offers.map((o) => o.city))];

export const locationFields = (city: string) => {
  const geo = GEO[city];
  if (!geo) throw new Error(`No geography defined for "${city}" in scripts/seed-airtable.ts`);
  const fields: Record<string, any> = {
    [F.locations.city]: city,
    [F.locations.slug]: slugify(city),
    [F.locations.country]: geo.country,
    [F.locations.launchStatus]: "Candidate",
  };
  if (geo.state) fields[F.locations.state] = geo.state;
  if (city === "Los Angeles") {
    fields[F.locations.notes] =
      "First end-to-end test city (Los Angeles yacht). Add coordinates, GBP URL, Hub Points, 3+ Local FAQs and a linked partner before checking Live.";
  }
  return fields;
};

export const packageFields = (o: PlannedOffer, ids: { asset: string; location: string }) => {
  const geo = GEO[o.city];
  const fields: Record<string, any> = {
    [F.packages.name]: o.title,
    [F.packages.offerSlug]: o.slug,
    [F.packages.assetType]: [ids.asset],
    [F.packages.location]: [ids.location],
  };
  if (!BOOKABLE_CATEGORIES.has(o.categoryId)) {
    fields[F.packages.notes] =
      "Not bookable: the site keeps rendering this page from its original content. No deposit or quote flow. Row exists for reference only.";
    return fields;
  }
  fields[F.packages.bookingMode] = "Quote"; // switch to Pay only once a deposit + Stripe are configured
  fields[F.packages.currency] = geo.currency;
  const copy = COPY[o.slug];
  if (o.offer && copy) {
    fields[F.packages.h1] = o.offer.seo?.h1 ?? o.title;
    fields[F.packages.subheading] = copy.subheading;
    fields[F.packages.pageCopy] = copy.pageCopy.join("\n\n");
    fields[F.packages.howItWorks] = HOW_IT_WORKS[o.categoryId as keyof typeof HOW_IT_WORKS].join("\n");
    if (o.offer.includedAccess?.length) {
      fields[F.packages.includedItems] = o.offer.includedAccess.map((i) => INCLUDED_REWRITES[i] ?? i).join("\n");
    }
    if (o.offer.nearbyAreas?.length) fields[F.packages.nearbyAreas] = o.offer.nearbyAreas.join("\n");
  } else {
    fields[F.packages.notes] =
      "DRAFT for the first end-to-end test. No content invented: add H1, Subheading, Page Copy, price, deposit and risk-reversal wording, then link a partner.";
  }
  return fields;
};

async function main() {
  const locationPayloads = uniqueCities.map((city) => ({ fields: locationFields(city), slug: slugify(city) }));

  if (EMIT) {
    const out = {
      locations: locationPayloads,
      packages: offers.map((o) => ({
        categoryId: o.categoryId,
        locationSlug: slugify(o.city),
        fields: packageFields(o, { asset: "$ASSET", location: "$LOCATION" }),
      })),
    };
    writeFileSync(EMIT, JSON.stringify(out, null, 2));
    console.log(`wrote ${EMIT}: ${out.locations.length} locations, ${out.packages.length} packages`);
    return;
  }

  console.log(`${uniqueCities.length} locations, ${offers.length} packages planned`);
  if (DRY) {
    for (const l of locationPayloads) console.log(`  location  ${l.slug}`);
    for (const o of offers) console.log(`  package   /${o.categoryId}/${o.slug}${BOOKABLE_CATEGORIES.has(o.categoryId) ? "" : "  (non-bookable, minimal row)"}`);
    return;
  }

  const cfg = configFromEnv();
  if (!cfg) throw new Error("AIRTABLE_PAT is not set. Use --dry-run or --emit=file to preview without Airtable.");

  const assetRows = await listRecords(cfg, T.assetTypes, { fields: [F.assetTypes.categorySlug] });
  const assetByCategory = new Map(assetRows.map((r) => [r.fields[F.assetTypes.categorySlug] as string, r.id]));

  const existingLocations = await listRecords(cfg, T.locations, { fields: [F.locations.slug] });
  const locationBySlug = new Map(existingLocations.map((r) => [r.fields[F.locations.slug] as string, r.id]));
  const newLocations = locationPayloads.filter((l) => !locationBySlug.has(l.slug));
  const createdLocations = await createRecords(cfg, T.locations, newLocations.map((l) => ({ fields: l.fields })));
  createdLocations.forEach((r) => locationBySlug.set(r.fields[F.locations.slug], r.id));
  console.log(`locations: ${createdLocations.length} created, ${locationPayloads.length - newLocations.length} already existed`);

  const existingPackages = await listRecords(cfg, T.packages, { fields: [F.packages.offerSlug, F.packages.packageSlug] });
  const haveOffer = new Set(existingPackages.filter((r) => !r.fields[F.packages.packageSlug]).map((r) => r.fields[F.packages.offerSlug]));
  const toCreate = offers.filter((o) => !haveOffer.has(o.slug));
  const rows = toCreate.map((o) => {
    const asset = assetByCategory.get(o.categoryId);
    const location = locationBySlug.get(slugify(o.city));
    if (!asset) throw new Error(`No Asset Types row for category "${o.categoryId}"`);
    if (!location) throw new Error(`No Locations row for "${o.city}"`);
    return { fields: packageFields(o, { asset, location }) };
  });
  const createdPackages = await createRecords(cfg, T.packages, rows);
  console.log(`packages: ${createdPackages.length} created, ${offers.length - toCreate.length} already existed`);

  console.log(
    "\nStill blank in Airtable before any city can go Live: latitude/longitude, GBP URL, Map Embed URL, Hub Points, 3+ Local FAQs, a linked Partner, and Live Compliance Rules. Prices, deposits and risk-reversal text are also empty. Run `npm run build` to see the exact per-page list.",
  );
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
