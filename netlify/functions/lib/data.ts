/**
 * Site data for Netlify Functions. Bundled from data/*.json at deploy time, so a function never
 * trusts prices, deposits, currencies or record IDs sent by the browser.
 */
import assetsJson from "../../../data/assets.json";
import locationsJson from "../../../data/locations.json";
import packagesJson from "../../../data/packages.json";
import partnersJson from "../../../data/partners.json";
import complianceJson from "../../../data/compliance.json";
import gbpJson from "../../../data/gbp.json";
import redirectsJson from "../../../data/redirects.json";
import { publishability } from "../../../shared/catalog-logic";
import type { AssetTypeData, LocationData, PackageData, SiteData } from "../../../shared/data-types";

export const DATA: SiteData = {
  assetTypes: assetsJson as unknown as AssetTypeData[],
  locations: locationsJson as unknown as LocationData[],
  packages: packagesJson as unknown as PackageData[],
  partners: partnersJson as unknown as SiteData["partners"],
  compliance: complianceJson as unknown as SiteData["compliance"],
  gbp: gbpJson as unknown as SiteData["gbp"],
  redirects: redirectsJson as unknown as SiteData["redirects"],
};

export interface ResolvedContext {
  asset?: AssetTypeData;
  location?: LocationData;
  /** The package row for the requested offer / nested package, if any. */
  pkg?: PackageData;
}

export interface ContextInput {
  category?: string; // categorySlug, e.g. "yachts"
  offer?: string; // offer slug
  package?: string; // nested package slug
  city?: string; // free text or location slug
  pagePath?: string; // e.g. /yachts/yacht-charter-miami/
}

const slugish = (s: string) =>
  s
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * Works out which asset type, location and package a request refers to, using only our own data.
 * Precedence: explicit category/offer/package, then the page path, then a free-text city.
 */
export const resolveContext = (input: ContextInput, data: SiteData = DATA): ResolvedContext => {
  let { category, offer, package: packageSlug } = input;
  if ((!category || !offer) && input.pagePath) {
    const [c, o, p] = input.pagePath.split("?")[0].split("/").filter(Boolean);
    category = category || c;
    offer = offer || o;
    packageSlug = packageSlug || p;
  }

  let pkg: PackageData | undefined;
  if (offer) {
    pkg =
      (packageSlug && data.packages.find((p) => p.offerSlug === offer && p.packageSlug === packageSlug)) ||
      data.packages.find((p) => p.offerSlug === offer && !p.packageSlug);
  }
  let asset = pkg ? data.assetTypes.find((a) => a.id === pkg!.assetId) : undefined;
  if (!asset && category) asset = data.assetTypes.find((a) => a.categorySlug === category || a.slug === category);

  let location = pkg ? data.locations.find((l) => l.id === pkg!.locationId) : undefined;
  if (!location && input.city) {
    const key = slugish(input.city);
    location = data.locations.find((l) => l.slug === key || slugish(l.city) === key);
  }
  return { asset, location, pkg };
};

/** A package the Pay path may use: it must exist and be published. */
export const findPublishedPackage = (offerSlug: string, packageSlug: string | undefined, data: SiteData = DATA) => {
  const pkg = data.packages.find((p) => p.offerSlug === offerSlug && (packageSlug ? p.packageSlug === packageSlug : !p.packageSlug));
  if (!pkg) return undefined;
  const asset = data.assetTypes.find((a) => a.id === pkg.assetId);
  const location = data.locations.find((l) => l.id === pkg.locationId);
  if (!asset || !location || !asset.bookable) return undefined;
  return publishability(pkg, data).ok ? { pkg, asset, location } : undefined;
};
