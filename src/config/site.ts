// Single source of truth for brand, domain and NAP (name / address / phone).
// Change the values here and canonicals, og tags, sitemap, emails and structured
// data all follow. Nothing else in the repo should hardcode either.
//
// NAP must read exactly the same as the Google Business Profile listing. Per-city
// listings (Airtable "GBP Listings") override name/phone/address on their own
// pages; these values are the site-wide default.

export const SITE = {
  /** Public brand name. Placeholder until a final brand is chosen. */
  brand: "Lux Connoisseurs",
  tagline: "Private Access to Luxury Experiences",
  /** Bare domain, no protocol. */
  domain: "luxconnoisseurs.com",
  /** Canonical origin, no trailing slash. */
  url: "https://luxconnoisseurs.com",
  ogImagePath: "/og-image.jpg",

  phone: {
    display: "+1 (678) 335 8105",
    e164: "+16783358105",
  },
  email: "luxconnoisseurs@gmail.com",

  /**
   * Postal address exactly as shown on the Google Business Profile.
   * Leave null for a service-area business that hides its address; nothing is
   * rendered or emitted in structured data until this is filled in.
   */
  address: null as null | {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  },

  /** Google Analytics 4 measurement ID (G-XXXXXXXXXX). Empty = analytics off. */
  ga4MeasurementId: "",
  /** Google Search Console "HTML tag" verification token (content value only). Empty = omitted. */
  searchConsoleVerification: "",
} as const;

export const SITE_URL = SITE.url;
export const absoluteUrl = (path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
};
