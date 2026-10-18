/**
 * Airtable records (keyed by field ID) -> data/*.json shapes. Pure: no network, no file access.
 * Public-safe by construction: only the fields listed here are copied, so partner contact details,
 * internal notes and draft compliance text can never reach the site bundle.
 */
import type { AirtableRecord } from "../../shared/airtable";
import { F, LISTINGS_CATEGORY_SLUG } from "../../shared/airtable-schema";
import { parseFaqs, parseIncludedItems, splitLines, splitParagraphs } from "../../shared/catalog-logic";
import type {
  AssetTypeData,
  ComplianceRuleData,
  GbpListingData,
  ListingData,
  LocationData,
  PackageData,
  PartnerData,
  RedirectData,
  SiteData,
} from "../../shared/data-types";

export interface RawTables {
  assetTypes: AirtableRecord[];
  locations: AirtableRecord[];
  packages: AirtableRecord[];
  partners: AirtableRecord[];
  compliance: AirtableRecord[];
  gbp: AirtableRecord[];
  pageRegistry: AirtableRecord[];
  /** Optional so older raw dumps (and --from files) without Listings still work. */
  listings?: AirtableRecord[];
}

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);
const bool = (v: unknown): boolean => v === true;
const ids = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
const first = (v: unknown): string => {
  if (Array.isArray(v)) return str(v[0]);
  return str(v);
};
const bySlug = <T extends { slug?: string; offerSlug?: string; packageSlug?: string }>(a: T, b: T) =>
  `${a.offerSlug ?? a.slug}/${a.packageSlug ?? ""}`.localeCompare(`${b.offerSlug ?? b.slug}/${b.packageSlug ?? ""}`);

export const transformAssetTypes = (rows: AirtableRecord[]): AssetTypeData[] =>
  rows
    .map((r) => ({
      id: r.id,
      slug: str(r.fields[F.assetTypes.slug]),
      name: str(r.fields[F.assetTypes.name]),
      categorySlug: str(r.fields[F.assetTypes.categorySlug]),
      bookable: bool(r.fields[F.assetTypes.bookable]),
      heroPromise: str(r.fields[F.assetTypes.heroPromise]),
      keywordVariants: splitLines(r.fields[F.assetTypes.keywordVariants]),
      whatsIncluded: splitLines(r.fields[F.assetTypes.whatsIncluded]),
      faqs: parseFaqs(r.fields[F.assetTypes.faqs]),
      active: bool(r.fields[F.assetTypes.active]),
    }))
    .filter((a) => a.slug)
    .sort(bySlug);

export const transformLocations = (rows: AirtableRecord[]): LocationData[] =>
  rows
    .map((r) => ({
      id: r.id,
      slug: str(r.fields[F.locations.slug]),
      city: str(r.fields[F.locations.city]),
      state: str(r.fields[F.locations.state]),
      country: str(r.fields[F.locations.country]),
      lat: num(r.fields[F.locations.latitude]),
      lng: num(r.fields[F.locations.longitude]),
      gbpUrl: str(r.fields[F.locations.gbpUrl]),
      mapEmbedUrl: str(r.fields[F.locations.mapEmbedUrl]),
      hubPoints: splitLines(r.fields[F.locations.hubPoints]),
      localFaqs: parseFaqs(r.fields[F.locations.localFaqs]),
      live: bool(r.fields[F.locations.live]),
      launchStatus: str(r.fields[F.locations.launchStatus]),
      partnerCount: num(r.fields[F.locations.partnerCount]) ?? 0,
    }))
    .filter((l) => l.slug && l.city)
    .sort(bySlug);

export const transformPackages = (rows: AirtableRecord[]): PackageData[] =>
  rows
    .map((r) => {
      const f = r.fields;
      const mode = str(f[F.packages.bookingMode]);
      return {
        id: r.id,
        name: str(f[F.packages.name]),
        offerSlug: str(f[F.packages.offerSlug]),
        packageSlug: str(f[F.packages.packageSlug]),
        assetId: ids(f[F.packages.assetType])[0] ?? "",
        locationId: ids(f[F.packages.location])[0] ?? "",
        partnerIds: ids(f[F.packages.partner]),
        categorySlug: first(f[F.packages.categorySlug]),
        bookingMode: (mode === "Pay" || mode === "Quote" ? mode : "") as PackageData["bookingMode"],
        startingPrice: num(f[F.packages.startingPrice]),
        currency: str(f[F.packages.currency]),
        priceUnit: str(f[F.packages.priceUnit]),
        boldPromise: str(f[F.packages.boldPromise]),
        includedItems: parseIncludedItems(f[F.packages.includedItems]),
        valueStackTotal: num(f[F.packages.valueStackTotal]),
        riskReversalText: str(f[F.packages.riskReversal]),
        depositAmount: num(f[F.packages.depositAmount]),
        stripePaymentLink: str(f[F.packages.stripePaymentLink]),
        metaTitle: str(f[F.packages.metaTitle]),
        metaDescription: str(f[F.packages.metaDescription]),
        heroImageUrl: str(f[F.packages.heroImageUrl]),
        h1: str(f[F.packages.h1]),
        subheading: str(f[F.packages.subheading]),
        pageCopy: splitParagraphs(f[F.packages.pageCopy]),
        howItWorks: splitLines(f[F.packages.howItWorks]),
        nearbyAreas: splitLines(f[F.packages.nearbyAreas]),
        active: bool(f[F.packages.active]),
        partnerCount: num(f[F.packages.partnerCount]) ?? 0,
        locationLive: num(f[F.packages.locationLive]) ?? 0,
        ready: str(f[F.packages.ready]),
      };
    })
    .filter((p) => p.offerSlug)
    .sort(bySlug);

export const transformPartners = (rows: AirtableRecord[]): PartnerData[] =>
  rows
    .map((r) => ({
      id: r.id,
      name: str(r.fields[F.partners.name]),
      verified: str(r.fields[F.partners.verificationStatus]) === "Verified",
      assetTypeIds: ids(r.fields[F.partners.assetTypes]),
      locationIds: ids(r.fields[F.partners.locationsServed]),
    }))
    .filter((p) => p.name)
    .sort((a, b) => a.name.localeCompare(b.name));

export const transformCompliance = (rows: AirtableRecord[]): ComplianceRuleData[] =>
  rows
    .map((r) => {
      const status = str(r.fields[F.compliance.status]);
      const live = status === "Live";
      return {
        id: r.id,
        ruleName: str(r.fields[F.compliance.ruleName]),
        jurisdiction: str(r.fields[F.compliance.jurisdiction]),
        status,
        version: str(r.fields[F.compliance.version]),
        effectiveDate: str(r.fields[F.compliance.effectiveDate]),
        // Draft / Attorney Review text is never copied into the bundle.
        fullText: live ? str(r.fields[F.compliance.fullText]) : "",
        registrationNumber: live ? str(r.fields[F.compliance.registrationNumber]) : "",
        appliesAssetTypeIds: ids(r.fields[F.compliance.appliesAssetTypes]),
        appliesLocationIds: ids(r.fields[F.compliance.appliesLocations]),
      };
    })
    .filter((c) => c.ruleName)
    .sort((a, b) => a.ruleName.localeCompare(b.ruleName));

export const transformGbp = (rows: AirtableRecord[]): GbpListingData[] =>
  rows
    .map((r) => ({
      id: r.id,
      listingName: str(r.fields[F.gbpListings.listingName]),
      gbpUrl: str(r.fields[F.gbpListings.gbpUrl]),
      primaryCategory: str(r.fields[F.gbpListings.primaryCategory]),
      address: str(r.fields[F.gbpListings.address]),
      phone: str(r.fields[F.gbpListings.phone]),
      landingUrl: str(r.fields[F.gbpListings.landingUrl]),
      status: str(r.fields[F.gbpListings.status]),
      verification: str(r.fields[F.gbpListings.verification]),
      locationId: ids(r.fields[F.gbpListings.location])[0] ?? "",
      assetTypeId: ids(r.fields[F.gbpListings.assetType])[0] ?? "",
      reviewCount: num(r.fields[F.gbpListings.reviewCount]),
      averageRating: num(r.fields[F.gbpListings.averageRating]),
    }))
    .filter((g) => g.listingName)
    .sort((a, b) => a.listingName.localeCompare(b.listingName));

const normPath = (p: string) => {
  const t = p.trim();
  return t.startsWith("/") ? t : `/${t}`;
};

/** Page Registry rows with Status = Redirected. Missing target -> the asset's category hub. */
export const transformRedirects = (rows: AirtableRecord[], assets: AssetTypeData[]): RedirectData[] =>
  rows
    .filter((r) => str(r.fields[F.pageRegistry.status]) === "Redirected")
    .map((r) => {
      const from = normPath(str(r.fields[F.pageRegistry.urlPath]));
      let to = str(r.fields[F.pageRegistry.redirectTo]);
      if (!to) {
        // A known asset hub is the safe default target for a removed city page.
        const assetId = ids(r.fields[F.pageRegistry.assetType])[0];
        const asset = assets.find((a) => a.id === assetId);
        to = asset ? `/${asset.categorySlug}` : "/";
      }
      const canon = normPath(to);
      return { from, to: canon.endsWith("/") ? canon : `${canon}/` };
    })
    .filter((r) => r.from !== "/" && r.from !== r.to)
    .sort((a, b) => a.from.localeCompare(b.from));

// ---------------------------------------------------------------------------
// Listings (one-off for-sale items). Only Status = Live rows that are complete enough to publish.
// ---------------------------------------------------------------------------

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

/** "Starting at $14,500,000", or the manual override, or "" when there is no price at all. */
export const listingPriceLabel = (price: number | null, override: string): string =>
  override || (price !== null && price > 0 ? `Starting at ${usd(price)}` : "");

interface ListingCandidate {
  name: string;
  status: string;
  slug: string;
  categorySlug: string;
  summary: string;
}

const candidateOf = (r: AirtableRecord): ListingCandidate => ({
  name: str(r.fields[F.listings.name]),
  status: str(r.fields[F.listings.status]),
  slug: str(r.fields[F.listings.slug]),
  categorySlug: LISTINGS_CATEGORY_SLUG[str(r.fields[F.listings.category])] ?? "",
  summary: str(r.fields[F.listings.summary]),
});

/** Why a Live listing is not published (empty = fine). A Live row must not publish half-finished. */
export const listingProblems = (c: ListingCandidate): string[] => {
  const out: string[] = [];
  if (!c.name) out.push("no Listing Name");
  if (!c.slug) out.push("no Slug");
  else if (!SLUG_RE.test(c.slug)) out.push(`Slug "${c.slug}" must be lowercase letters, numbers and hyphens`);
  if (!c.categorySlug) out.push("Category is empty or not mapped in LISTINGS_CATEGORY_SLUG");
  if (!c.summary) out.push("no Summary");
  return out;
};

export const transformListings = (rows: AirtableRecord[]): ListingData[] => {
  const seen = new Set<string>();
  const out: ListingData[] = [];
  for (const r of rows) {
    const c = candidateOf(r);
    if (c.status !== "Live" || listingProblems(c).length > 0) continue;
    const key = `${c.categorySlug}/${c.slug}`;
    if (seen.has(key)) continue; // duplicate slug: first row wins
    seen.add(key);
    const price = num(r.fields[F.listings.price]);
    out.push({
      id: r.id,
      slug: c.slug,
      name: c.name,
      categorySlug: c.categorySlug,
      region: str(r.fields[F.listings.region]),
      price,
      priceLabel: listingPriceLabel(price, str(r.fields[F.listings.priceOverride])),
      summary: c.summary,
      description: splitParagraphs(r.fields[F.listings.description]),
      highlights: splitLines(r.fields[F.listings.highlights]),
      photoUrl: str(r.fields[F.listings.photoUrl]),
      // Only exposed when the checkbox is ticked.
      offerText: bool(r.fields[F.listings.offerActive]) ? str(r.fields[F.listings.offerText]) : "",
    });
  }
  return out.sort((a, b) => `${a.categorySlug}/${a.slug}`.localeCompare(`${b.categorySlug}/${b.slug}`));
};

/** Live rows that were NOT published, with the reason, so a "Live" listing never silently disappears. */
export const skippedListings = (rows: AirtableRecord[]): { name: string; reasons: string[] }[] =>
  rows
    .map((r) => candidateOf(r))
    .filter((c) => c.status === "Live")
    .map((c) => ({ name: c.name || "(unnamed)", reasons: listingProblems(c) }))
    .filter((x) => x.reasons.length > 0);

/** A listing marked Sold stops being served; send its old URL to the category hub instead of a 404. */
export const soldListingRedirects = (rows: AirtableRecord[]): RedirectData[] =>
  rows
    .map((r) => candidateOf(r))
    .filter((c) => c.status === "Sold" && c.slug && SLUG_RE.test(c.slug) && c.categorySlug)
    .map((c) => ({ from: `/${c.categorySlug}/${c.slug}`, to: `/${c.categorySlug}/` }));

/** Text fields where the site's copy rules should be checked (never auto-edited, only warned about). */
export const listingCopyWarnings = (rows: AirtableRecord[]): string[] => {
  const warnings: string[] = [];
  for (const r of rows) {
    if (str(r.fields[F.listings.status]) !== "Live") continue;
    const name = str(r.fields[F.listings.name]) || r.id;
    const text = [F.listings.summary, F.listings.description, F.listings.highlights, F.listings.offerText, F.listings.priceOverride]
      .map((f) => str(r.fields[f]))
      .join("\n");
    for (const word of ["free", "dispatch"]) {
      if (new RegExp("\\b" + word + "\\b", "i").test(text)) warnings.push(`"${name}" contains the word "${word}" (site copy rule)`);
    }
  }
  return warnings;
};

const mergeRedirects = (a: RedirectData[], b: RedirectData[]): RedirectData[] => {
  const seen = new Set(a.map((r) => r.from));
  return [...a, ...b.filter((r) => !seen.has(r.from))].sort((x, y) => x.from.localeCompare(y.from));
};

export const transformAll = (raw: RawTables): SiteData => {
  const assetTypes = transformAssetTypes(raw.assetTypes);
  return {
    assetTypes,
    locations: transformLocations(raw.locations),
    packages: transformPackages(raw.packages),
    partners: transformPartners(raw.partners),
    compliance: transformCompliance(raw.compliance),
    gbp: transformGbp(raw.gbp),
    redirects: mergeRedirects(transformRedirects(raw.pageRegistry, assetTypes), soldListingRedirects(raw.listings ?? [])),
    listings: transformListings(raw.listings ?? []),
  };
};
