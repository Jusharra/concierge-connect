/**
 * Data-driven catalogue for the bookable asset types (jets, yachts, exotic cars).
 * Reads ONLY data/*.json (derived from Airtable at build time). Every page, route, sitemap entry and
 * internal link for a city x asset offer comes from here, so adding a city or an asset type is a data
 * entry in Airtable, not a code change.
 */
import assetsJson from "../../data/assets.json";
import locationsJson from "../../data/locations.json";
import packagesJson from "../../data/packages.json";
import partnersJson from "../../data/partners.json";
import complianceJson from "../../data/compliance.json";
import gbpJson from "../../data/gbp.json";
import redirectsJson from "../../data/redirects.json";
import {
  byId,
  complianceFor,
  payAvailability,
  publishability,
  type ComplianceCheck,
  type PayAvailability,
} from "../../shared/catalog-logic";
import type {
  AssetTypeData,
  GbpListingData,
  LocationData,
  PackageData,
  SiteData,
} from "../../shared/data-types";
import type { Category, Offer } from "./constants";

export const DATA: SiteData = {
  assetTypes: assetsJson as unknown as AssetTypeData[],
  locations: locationsJson as unknown as LocationData[],
  packages: packagesJson as unknown as PackageData[],
  partners: partnersJson as unknown as SiteData["partners"],
  compliance: complianceJson as unknown as SiteData["compliance"],
  gbp: gbpJson as unknown as GbpListingData[],
  redirects: redirectsJson as unknown as SiteData["redirects"],
};

export interface PublishedOffer {
  pkg: PackageData;
  asset: AssetTypeData;
  location: LocationData;
  categoryId: string;
  offerSlug: string;
  /** Canonical path with trailing slash, e.g. /yachts/yacht-charter-los-angeles/ */
  path: string;
  gbp: GbpListingData | null;
  packages: PublishedPackage[];
}

export interface PublishedPackage {
  pkg: PackageData;
  path: string; // /{category}/{offer}/{package}/
}

const isBookableAsset = (a?: AssetTypeData) => !!a && a.bookable;

export const bookableCategoryIds = (): string[] => DATA.assetTypes.filter((a) => a.bookable).map((a) => a.categorySlug);

const gbpFor = (asset: AssetTypeData, loc: LocationData): GbpListingData | null =>
  DATA.gbp.find((g) => g.locationId === loc.id && g.assetTypeId === asset.id) ?? null;

let cache: PublishedOffer[] | null = null;

/** Every bookable city x asset page that passes the publishing gate. */
export const publishedOffers = (): PublishedOffer[] => {
  if (cache) return cache;
  const offers: PublishedOffer[] = [];
  for (const pkg of DATA.packages) {
    if (pkg.packageSlug) continue;
    const asset = byId(DATA.assetTypes, pkg.assetId);
    const location = byId(DATA.locations, pkg.locationId);
    if (!asset || !location || !isBookableAsset(asset)) continue;
    if (!publishability(pkg, DATA).ok) continue;
    const categoryId = asset.categorySlug;
    const path = `/${categoryId}/${pkg.offerSlug}/`;
    const packages = DATA.packages
      .filter((c) => c.packageSlug && c.offerSlug === pkg.offerSlug && publishability(c, DATA).ok)
      .map((c) => ({ pkg: c, path: `${path}${c.packageSlug}/` }));
    offers.push({ pkg, asset, location, categoryId, offerSlug: pkg.offerSlug, path, gbp: gbpFor(asset, location), packages });
  }
  cache = offers.sort((a, b) => a.path.localeCompare(b.path));
  return cache;
};

export const findOffer = (categoryId: string, offerSlug: string): PublishedOffer | undefined =>
  publishedOffers().find((o) => o.categoryId === categoryId && o.offerSlug === offerSlug);

export const findPackage = (categoryId: string, offerSlug: string, packageSlug: string) => {
  const offer = findOffer(categoryId, offerSlug);
  const pkg = offer?.packages.find((p) => p.pkg.packageSlug === packageSlug);
  return offer && pkg ? { offer, pkg } : undefined;
};

/** Same city, other bookable assets ("Also in Los Angeles: Yacht Charter"). */
export const siblingOffers = (offer: PublishedOffer): PublishedOffer[] =>
  publishedOffers().filter((o) => o.location.id === offer.location.id && o.asset.id !== offer.asset.id);

/** Same asset in other LIVE cities only. */
export const nearbyOffers = (offer: PublishedOffer): PublishedOffer[] =>
  publishedOffers().filter((o) => o.asset.id === offer.asset.id && o.location.id !== offer.location.id);

/** Asset hub /services/{asset-slug}/ exists only when at least one city page is published for it. */
export const assetHubs = (): { asset: AssetTypeData; offers: PublishedOffer[] }[] =>
  DATA.assetTypes
    .filter((a) => a.bookable && a.active)
    .map((asset) => ({ asset, offers: publishedOffers().filter((o) => o.asset.id === asset.id) }))
    .filter((h) => h.offers.length > 0);

export const findAssetHub = (slug: string) => assetHubs().find((h) => h.asset.slug === slug);

/** Live locations with at least one published offer. */
export const liveLocations = (): { location: LocationData; offers: PublishedOffer[] }[] => {
  const map = new Map<string, { location: LocationData; offers: PublishedOffer[] }>();
  for (const o of publishedOffers()) {
    const e = map.get(o.location.id) ?? { location: o.location, offers: [] };
    e.offers.push(o);
    map.set(o.location.id, e);
  }
  return [...map.values()];
};

export const payFor = (pkg: PackageData): PayAvailability => payAvailability(pkg, DATA);
export const complianceForPackage = (pkg: PackageData): ComplianceCheck => complianceFor(pkg, DATA);

/** Category views for the existing list pages (home, /access, category hubs, /locations, footer). */
export const buildCategories = (legacy: Category[]): Category[] =>
  legacy.map((cat) => {
    const asset = DATA.assetTypes.find((a) => a.categorySlug === cat.id);
    if (!asset?.bookable) return cat; // properties / business acquisitions stay exactly as they were
    const offers: Offer[] = publishedOffers()
      .filter((o) => o.categoryId === cat.id)
      .map((o) => ({ city: o.location.city, slug: o.offerSlug, title: o.pkg.name }));
    return { ...cat, offers };
  });
