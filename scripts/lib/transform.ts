/**
 * Airtable records (keyed by field ID) -> data/*.json shapes. Pure: no network, no file access.
 * Public-safe by construction: only the fields listed here are copied, so partner contact details,
 * internal notes and draft compliance text can never reach the site bundle.
 */
import type { AirtableRecord } from "../../shared/airtable";
import { F } from "../../shared/airtable-schema";
import { parseFaqs, parseIncludedItems, splitLines, splitParagraphs } from "../../shared/catalog-logic";
import type {
  AssetTypeData,
  ComplianceRuleData,
  GbpListingData,
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

export const transformAll = (raw: RawTables): SiteData => {
  const assetTypes = transformAssetTypes(raw.assetTypes);
  return {
    assetTypes,
    locations: transformLocations(raw.locations),
    packages: transformPackages(raw.packages),
    partners: transformPartners(raw.partners),
    compliance: transformCompliance(raw.compliance),
    gbp: transformGbp(raw.gbp),
    redirects: transformRedirects(raw.pageRegistry, assetTypes),
  };
};
