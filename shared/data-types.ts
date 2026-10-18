/**
 * Shape of data/*.json (derived from Airtable by scripts/sync-airtable.ts).
 * Page templates and Netlify Functions read ONLY these files, never Airtable directly.
 * Nothing here is sensitive: no partner contact details, no internal notes.
 */

export interface Faq {
  q: string;
  a: string;
}

export interface AssetTypeData {
  id: string; // Airtable record ID
  slug: string; // e.g. yacht-charter  -> /services/yacht-charter/
  name: string; // e.g. Yacht Charter
  categorySlug: string; // existing categoryId in URLs: private-air | yachts | exotic-cars | ...
  bookable: boolean;
  heroPromise: string;
  keywordVariants: string[];
  whatsIncluded: string[];
  faqs: Faq[];
  active: boolean;
}

export interface LocationData {
  id: string;
  slug: string; // e.g. los-angeles
  city: string;
  state: string; // "California" ("" for city-states)
  country: string; // "United States"
  lat: number | null;
  lng: number | null;
  gbpUrl: string;
  mapEmbedUrl: string;
  hubPoints: string[]; // airports, marinas, neighborhoods
  localFaqs: Faq[];
  live: boolean;
  launchStatus: string;
  partnerCount: number;
}

export interface IncludedItem {
  label: string;
  /** Dollar value for the value stack, or null when none was entered. */
  value: number | null;
}

export interface PackageData {
  id: string;
  name: string;
  offerSlug: string; // /{category}/{offerSlug}
  packageSlug: string; // "" = the city x asset page itself; otherwise nested /{category}/{offerSlug}/{packageSlug}
  assetId: string;
  locationId: string;
  partnerIds: string[];
  categorySlug: string;
  bookingMode: "Pay" | "Quote" | "";
  startingPrice: number | null;
  currency: string; // ISO code, "" when unset
  priceUnit: string;
  boldPromise: string;
  includedItems: IncludedItem[];
  valueStackTotal: number | null;
  riskReversalText: string;
  depositAmount: number | null;
  stripePaymentLink: string;
  metaTitle: string;
  metaDescription: string;
  heroImageUrl: string;
  h1: string;
  subheading: string;
  pageCopy: string[];
  howItWorks: string[];
  nearbyAreas: string[];
  // Airtable's own publishing-gate inputs (formula/rollup fields)
  active: boolean;
  partnerCount: number;
  locationLive: number;
  ready: "Ready" | "Blocked" | string;
}

export interface PartnerData {
  id: string;
  name: string; // name only: no contact details ever reach data/*.json
  verified: boolean;
  assetTypeIds: string[];
  locationIds: string[];
}

export interface ComplianceRuleData {
  id: string;
  ruleName: string;
  jurisdiction: string;
  status: "Draft" | "Attorney Review" | "Live" | string;
  version: string;
  effectiveDate: string;
  /** Only populated when status is Live, so drafts never reach the bundle. */
  fullText: string;
  registrationNumber: string;
  appliesAssetTypeIds: string[];
  appliesLocationIds: string[];
}

export interface GbpListingData {
  id: string;
  listingName: string;
  gbpUrl: string;
  primaryCategory: string;
  address: string;
  phone: string;
  landingUrl: string;
  status: string;
  verification: string;
  locationId: string;
  assetTypeId: string;
  reviewCount: number | null;
  averageRating: number | null;
}

export interface RedirectData {
  from: string;
  to: string;
}

/** A one-off for-sale listing (e.g. a private island). Public fields only: no deal structure or notes. */
export interface ListingData {
  id: string;
  slug: string;
  name: string;
  categorySlug: string; // e.g. private-islands
  region: string; // "Exuma Cays, Bahamas"
  price: number | null;
  /** What the page shows: the override if set, else "Starting at $X", else "" (page says price on request). */
  priceLabel: string;
  summary: string;
  description: string[]; // paragraphs
  highlights: string[];
  photoUrl: string;
  /** Present only when Irresistible Offer Active is ticked. */
  offerText: string;
}

export interface SiteData {
  assetTypes: AssetTypeData[];
  locations: LocationData[];
  packages: PackageData[];
  partners: PartnerData[];
  compliance: ComplianceRuleData[];
  gbp: GbpListingData[];
  redirects: RedirectData[];
  listings: ListingData[];
}
