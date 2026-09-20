/**
 * Pure rules shared by the site (src/lib/catalog.ts), the build scripts and the Netlify Functions:
 * text parsing, the publishing gate, compliance matching and the Pay-path gate.
 * No I/O, no browser or Node APIs.
 */
import type {
  AssetTypeData,
  ComplianceRuleData,
  Faq,
  IncludedItem,
  LocationData,
  PackageData,
  SiteData,
} from "./data-types";

// ---------------------------------------------------------------------------
// Text parsing (Airtable long-text fields)
// ---------------------------------------------------------------------------

export const splitLines = (text: string | undefined | null): string[] =>
  (text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

export const splitParagraphs = (text: string | undefined | null): string[] =>
  (text || "")
    .split(/\r?\n\s*\r?\n/)
    .map((p) => p.replace(/\s*\r?\n\s*/g, " ").trim())
    .filter(Boolean);

/**
 * FAQ blocks separated by a blank line. First line is the question, the rest is the answer.
 * "Q:" / "A:" prefixes are optional.
 */
export const parseFaqs = (text: string | undefined | null): Faq[] =>
  (text || "")
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.split(/\r?\n/).map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length >= 2)
    .map((lines) => ({
      q: lines[0].replace(/^Q\s*[:.)-]\s*/i, "").trim(),
      a: lines.slice(1).join(" ").replace(/^A\s*[:.)-]\s*/i, "").trim(),
    }))
    .filter((f) => f.q && f.a);

/** "Item text | 1200" or "Item text — $1,200" -> { label, value }. Value is optional. */
export const parseIncludedItems = (text: string | undefined | null): IncludedItem[] =>
  splitLines(text).map((line) => {
    const m = line.match(/^(.*?)\s*(?:\||—|–|-{2,})\s*\$?\s*([\d,]+(?:\.\d+)?)\s*$/);
    if (m && m[1]) return { label: m[1].trim(), value: Number(m[2].replace(/,/g, "")) };
    return { label: line, value: null };
  });

// ---------------------------------------------------------------------------
// Location labels
// ---------------------------------------------------------------------------

const US_STATE_CODES: Record<string, string> = {
  Alabama: "AL", Alaska: "AK", Arizona: "AZ", Arkansas: "AR", California: "CA", Colorado: "CO",
  Connecticut: "CT", Delaware: "DE", "District of Columbia": "DC", Florida: "FL", Georgia: "GA",
  Hawaii: "HI", Idaho: "ID", Illinois: "IL", Indiana: "IN", Iowa: "IA", Kansas: "KS", Kentucky: "KY",
  Louisiana: "LA", Maine: "ME", Maryland: "MD", Massachusetts: "MA", Michigan: "MI", Minnesota: "MN",
  Mississippi: "MS", Missouri: "MO", Montana: "MT", Nebraska: "NE", Nevada: "NV", "New Hampshire": "NH",
  "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
  Ohio: "OH", Oklahoma: "OK", Oregon: "OR", Pennsylvania: "PA", "Rhode Island": "RI",
  "South Carolina": "SC", "South Dakota": "SD", Tennessee: "TN", Texas: "TX", Utah: "UT", Vermont: "VT",
  Virginia: "VA", Washington: "WA", "West Virginia": "WV", Wisconsin: "WI", Wyoming: "WY",
};

const COUNTRY_SHORT: Record<string, string> = {
  "United States": "US",
  "United Arab Emirates": "UAE",
  "United Kingdom": "UK",
};

export const isUS = (loc: Pick<LocationData, "country">) => loc.country === "United States";

/** "FL" for US cities, otherwise the (short) country: "Miami, FL", "London, UK", "St. Tropez, France". */
export const regionShort = (loc: Pick<LocationData, "city" | "state" | "country">): string => {
  if (isUS(loc)) return US_STATE_CODES[loc.state] || loc.state;
  if (loc.country && loc.country.toLowerCase() === loc.city.toLowerCase()) return ""; // Monaco, Bahamas
  return COUNTRY_SHORT[loc.country] || loc.country;
};

/** "Miami, FL" | "Monaco" | "London, UK" */
export const cityLabel = (loc: Pick<LocationData, "city" | "state" | "country">): string => {
  const r = regionShort(loc);
  return r ? `${loc.city}, ${r}` : loc.city;
};

/** Long form for body copy and schema: "Miami, Florida, United States". */
export const cityLabelLong = (loc: Pick<LocationData, "city" | "state" | "country">): string =>
  [loc.city, loc.state && loc.state !== loc.city ? loc.state : "", loc.country && loc.country !== loc.city ? loc.country : ""]
    .filter(Boolean)
    .join(", ");

// ---------------------------------------------------------------------------
// Publishing gate
// ---------------------------------------------------------------------------

export interface Publishability {
  ok: boolean;
  reasons: string[];
}

export const MIN_LOCAL_FAQS = 3;

/**
 * A bookable city x asset page (or nested package page) is built only when this is ok.
 * Airtable's own "Ready to Publish" formula (Active + partner linked + location Live) is the primary
 * gate; the extra checks stop thin pages: the location must carry Hub Points and 3+ Local FAQs.
 */
export const publishability = (pkg: PackageData, data: SiteData): Publishability => {
  const reasons: string[] = [];
  const asset = data.assetTypes.find((a) => a.id === pkg.assetId);
  const loc = data.locations.find((l) => l.id === pkg.locationId);

  if (!asset) reasons.push("no Asset Type linked");
  else if (!asset.active) reasons.push("Asset Type is not Active");
  if (!loc) reasons.push("no Location linked");
  if (!pkg.active) reasons.push("Package is not Active");
  if (pkg.partnerCount < 1) reasons.push("no Partner linked");
  if (loc && !loc.live) reasons.push("Location is not Live");
  if (pkg.ready !== "Ready" && reasons.length === 0) reasons.push(`Airtable Ready to Publish reads "${pkg.ready}"`);

  if (loc) {
    if (loc.hubPoints.length === 0) reasons.push("Location has no Hub Points");
    if (loc.localFaqs.length < MIN_LOCAL_FAQS) reasons.push(`Location needs ${MIN_LOCAL_FAQS}+ Local FAQs (has ${loc.localFaqs.length})`);
    if (!loc.country) reasons.push("Location has no Country");
    if (loc.country === "United States" && !loc.state) reasons.push("Location has no State");
  }
  if (!pkg.offerSlug) reasons.push("no Offer Slug");

  if (pkg.packageSlug) {
    const parent = data.packages.find((p) => !p.packageSlug && p.offerSlug === pkg.offerSlug);
    if (!parent) reasons.push("parent offer row not found");
    else {
      const pp = publishability(parent, data);
      if (!pp.ok) reasons.push("parent offer page is not publishable");
    }
  }
  return { ok: reasons.length === 0, reasons };
};

// ---------------------------------------------------------------------------
// Compliance matching and the Pay-path gate
// ---------------------------------------------------------------------------

export const jurisdictionsFor = (loc: Pick<LocationData, "country" | "state">): string[] => {
  switch (loc.country) {
    case "United States":
      return [
        "US Federal",
        loc.state === "California" ? "US - California" : loc.state === "Florida" ? "US - Florida" : "US - Other",
      ];
    case "United Arab Emirates":
      return ["UAE"];
    case "United Kingdom":
      return ["UK"];
    case "Monaco":
    case "France":
      return ["France / Monaco"];
    case "Spain":
      return ["Spain"];
    case "Bahamas":
      return ["Bahamas"];
    default:
      return [];
  }
};

/**
 * A rule applies to an asset x location when it is linked to that asset type AND either lists the
 * location explicitly or its Jurisdiction covers the location. A rule with Jurisdiction "Other" only
 * applies to locations it lists explicitly.
 */
export const ruleApplies = (rule: ComplianceRuleData, asset: AssetTypeData, loc: LocationData): boolean => {
  if (!rule.appliesAssetTypeIds.includes(asset.id)) return false;
  if (rule.appliesLocationIds.length > 0) return rule.appliesLocationIds.includes(loc.id);
  return jurisdictionsFor(loc).includes(rule.jurisdiction);
};

export interface ComplianceCheck {
  rules: ComplianceRuleData[]; // every applicable rule (any status)
  liveRules: ComplianceRuleData[];
  disclosureText: string; // concatenated text of the Live rules
  disclosureVersion: string; // "Rule name@version; ..."
  ok: boolean;
  reasons: string[];
}

export const complianceFor = (pkg: PackageData, data: SiteData): ComplianceCheck => {
  const asset = data.assetTypes.find((a) => a.id === pkg.assetId);
  const loc = data.locations.find((l) => l.id === pkg.locationId);
  const reasons: string[] = [];
  if (!asset || !loc) return { rules: [], liveRules: [], disclosureText: "", disclosureVersion: "", ok: false, reasons: ["missing asset or location"] };

  const rules = data.compliance.filter((r) => ruleApplies(r, asset, loc));
  const liveRules = rules.filter((r) => r.status === "Live" && r.fullText.trim());
  if (rules.length === 0) reasons.push("no Compliance Rule applies to this asset and location");
  for (const r of rules) if (!liveRules.includes(r)) reasons.push(`Compliance Rule "${r.ruleName}" is ${r.status}, not Live (or has no text)`);

  return {
    rules,
    liveRules,
    disclosureText: liveRules.map((r) => `${r.ruleName}\n${r.fullText.trim()}`).join("\n\n"),
    disclosureVersion: liveRules.map((r) => `${r.ruleName}@${r.version || "unversioned"}`).join("; "),
    ok: rules.length > 0 && liveRules.length === rules.length,
    reasons,
  };
};

export interface PayAvailability {
  allowed: boolean;
  reasons: string[];
  compliance: ComplianceCheck;
}

/** Pay is offered only for Pay-mode packages with a deposit, refund wording and Live compliance. */
export const payAvailability = (pkg: PackageData, data: SiteData): PayAvailability => {
  const compliance = complianceFor(pkg, data);
  const reasons: string[] = [];
  if (pkg.bookingMode !== "Pay") reasons.push("Booking Mode is not Pay");
  if (!pkg.depositAmount || pkg.depositAmount <= 0) reasons.push("no Deposit Amount");
  if (!pkg.currency) reasons.push("no Currency Code");
  if (!pkg.riskReversalText.trim()) reasons.push("no Risk Reversal Text (refund terms)");
  if (!compliance.ok) reasons.push(...compliance.reasons);
  return { allowed: reasons.length === 0, reasons, compliance };
};

// ---------------------------------------------------------------------------
// Lookups
// ---------------------------------------------------------------------------

export const byId = <T extends { id: string }>(list: T[], id: string): T | undefined => list.find((x) => x.id === id);
