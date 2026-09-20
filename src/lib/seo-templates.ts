/**
 * Titles, descriptions, H1s and JSON-LD for generated pages. Everything is built from data
 * (assets, locations, packages, GBP listings) and src/config/site.ts, so pages stay consistent as
 * cities and asset types are added.
 *
 * Titles target about 60 characters; descriptions about 155. Prices are always "starting at".
 */
import { SITE, absoluteUrl } from "@/config/site";
import { cityLabel, cityLabelLong } from "../../shared/catalog-logic";
import type { AssetTypeData, FaqLike, GbpListingData, LocationData, PackageData } from "./seo-types";
import { clamp } from "./seo";

export const TITLE_MAX = 65; // "about 60": leaves room for a wide character or two
export const DESCRIPTION_MAX = 155;

const lc = (s: string) => s.toLowerCase();

/** "$4,500" for USD, "EUR 4,500" for the rest. Deterministic on server and client. */
export const formatMoney = (amount: number, currency: string): string => {
  const n = amount.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return !currency || currency === "USD" ? `$${n}` : `${currency} ${n}`;
};

/** First sentence of the risk-reversal wording, for meta descriptions and button sub-labels. */
export const riskReversalShort = (text: string): string => {
  const m = text.trim().match(/^[^.!?]*[.!?]?/);
  return m ? m[0].trim() : "";
};

/** Picks the longest variant that fits, so the brand only drops off when it has to. */
const fit = (variants: string[], max = TITLE_MAX): string => variants.find((v) => v.length <= max) ?? variants[variants.length - 1];

export const homeTitle = () => `${SITE.brand} – Private Jet, Yacht & Exotic Car Booking`;

export const assetHubTitle = (asset: AssetTypeData) =>
  fit([`${asset.name} Packages & Quotes | ${SITE.brand}`, `${asset.name} Packages & Quotes`]);

export const offerTitle = (asset: AssetTypeData, loc: LocationData, pkg: PackageData) => {
  if (pkg.metaTitle) return pkg.metaTitle;
  const place = cityLabel(loc);
  return fit([
    `${asset.name} in ${place} | Book or Get a Quote | ${SITE.brand}`,
    `${asset.name} in ${place} | ${SITE.brand}`,
    `${asset.name} in ${place}`,
  ]);
};

export const packageTitle = (asset: AssetTypeData, loc: LocationData, pkg: PackageData) => {
  if (pkg.metaTitle) return pkg.metaTitle;
  return fit([
    `${pkg.name} – ${asset.name} ${loc.city} | ${SITE.brand}`,
    `${pkg.name} – ${asset.name} ${loc.city}`,
    `${pkg.name} | ${SITE.brand}`,
  ]);
};

export const offerH1 = (asset: AssetTypeData, loc: LocationData, pkg: PackageData) =>
  pkg.h1 || `${asset.name} in ${cityLabel(loc)}`;

export interface DescribeOpts {
  /** false when the Pay path is unavailable (compliance not Live etc.): never promise a deposit booking. */
  canPay: boolean;
}

/**
 * "Book {asset} in {City} from ${price}. Reserve with a deposit or request a quote. {riskReversalShort}"
 * Adapted so it never promises what the page cannot deliver: quote-only cities say "request a quote".
 */
export const offerDescription = (asset: AssetTypeData, loc: LocationData, pkg: PackageData, { canPay }: DescribeOpts) => {
  if (pkg.metaDescription) return pkg.metaDescription;
  const price = pkg.startingPrice ? `, starting at ${formatMoney(pkg.startingPrice, pkg.currency)}` : "";
  const cta = canPay ? "Reserve with a deposit or request a quote." : "Request a quote.";
  const reversal = canPay ? riskReversalShort(pkg.riskReversalText) : "";
  return clamp(`Book ${lc(asset.name)} in ${loc.city}${price}. ${cta} ${reversal}`, DESCRIPTION_MAX);
};

export const packageDescription = (asset: AssetTypeData, loc: LocationData, pkg: PackageData, opts: DescribeOpts) => {
  if (pkg.metaDescription) return pkg.metaDescription;
  const price = pkg.startingPrice ? ` Starting at ${formatMoney(pkg.startingPrice, pkg.currency)}.` : "";
  const cta = opts.canPay ? "Reserve with a deposit or request a quote." : "Request a quote.";
  return clamp(`${pkg.name}: ${lc(asset.name)} in ${loc.city}.${price} ${cta}`, DESCRIPTION_MAX);
};

export const assetHubDescription = (asset: AssetTypeData, cities: string[]) =>
  clamp(
    `${asset.name} packages and quotes in ${cities.slice(0, 4).join(", ")}${cities.length > 4 ? " and more" : ""}. Choose a city, reserve with a deposit or request a quote.`,
    DESCRIPTION_MAX,
  );

// ---------------------------------------------------------------------------
// NAP (name, address, phone): the GBP listing wins; site config is the default
// ---------------------------------------------------------------------------

export interface Nap {
  name: string;
  phoneDisplay: string;
  phoneHref: string;
  address: string | null;
  email: string;
}

const digits = (s: string) => s.replace(/[^\d+]/g, "");

export const napFor = (gbp: GbpListingData | null): Nap => {
  const cfgAddress = SITE.address
    ? `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`
    : null;
  const phone = gbp?.phone || SITE.phone.display;
  return {
    name: gbp?.listingName || SITE.brand,
    phoneDisplay: phone,
    phoneHref: `tel:${gbp?.phone ? digits(gbp.phone) : SITE.phone.e164}`,
    address: gbp?.address || cfgAddress,
    email: SITE.email,
  };
};

// ---------------------------------------------------------------------------
// JSON-LD
// ---------------------------------------------------------------------------

export const organizationLd = () => ({
  "@context": "https://schema.org",
  "@type": ["Organization", "LocalBusiness"],
  "@id": `${SITE.url}/#organization`,
  name: SITE.brand,
  url: SITE.url,
  image: absoluteUrl(SITE.ogImagePath),
  telephone: SITE.phone.e164,
  email: SITE.email,
  description: SITE.tagline,
  ...(SITE.address
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: SITE.address.street,
          addressLocality: SITE.address.city,
          addressRegion: SITE.address.region,
          postalCode: SITE.address.postalCode,
          addressCountry: SITE.address.country,
        },
      }
    : {}),
});

const providerLd = (loc: LocationData | null, nap: Nap) => ({
  "@type": "LocalBusiness",
  name: nap.name,
  url: SITE.url,
  telephone: nap.phoneHref.replace("tel:", ""),
  email: nap.email,
  ...(loc
    ? {
        address: {
          "@type": "PostalAddress",
          addressLocality: loc.city,
          ...(loc.state ? { addressRegion: loc.state } : {}),
          addressCountry: loc.country,
        },
        ...(loc.lat !== null && loc.lng !== null
          ? { geo: { "@type": "GeoCoordinates", latitude: loc.lat, longitude: loc.lng } }
          : {}),
      }
    : {}),
});

/** Service with areaServed and a "starting at" Offer (minPrice), never a fixed price. */
export const serviceLd = (args: {
  name: string;
  asset: AssetTypeData;
  loc: LocationData;
  pkg: PackageData;
  url: string;
  description: string;
  nap: Nap;
  image?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: args.name,
  serviceType: args.asset.name,
  description: args.description,
  url: args.url,
  ...(args.image ? { image: args.image } : {}),
  provider: providerLd(args.loc, args.nap),
  areaServed: {
    "@type": "City",
    name: args.loc.city,
    ...(args.loc.state ? { containedInPlace: { "@type": args.loc.country === "United States" ? "State" : "AdministrativeArea", name: args.loc.state } } : {}),
    ...(args.loc.lat !== null && args.loc.lng !== null
      ? { geo: { "@type": "GeoCoordinates", latitude: args.loc.lat, longitude: args.loc.lng } }
      : {}),
  },
  ...(args.pkg.startingPrice
    ? {
        offers: {
          "@type": "Offer",
          url: args.url,
          priceCurrency: args.pkg.currency || "USD",
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: args.pkg.startingPrice,
            priceCurrency: args.pkg.currency || "USD",
          },
        },
      }
    : {}),
});

export const faqLd = (faqs: FaqLike[]) =>
  faqs.length === 0
    ? null
    : {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      };

export interface Crumb {
  name: string;
  path: string;
}

export const breadcrumbLd = (crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: crumbs.map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: absoluteUrl(c.path),
  })),
});

export { cityLabel, cityLabelLong };
