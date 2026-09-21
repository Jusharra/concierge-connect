/**
 * Builds data/citations.json: for each PUBLISHED city x asset page, the canonical NAP, landing page,
 * GBP URL and preferred anchor text, so citations and posts can be submitted consistently by hand.
 * This never submits or posts anything: link building stays manual.
 */
import { SITE, absoluteUrl } from "../../src/config/site";
import { napFor } from "../../src/lib/seo-templates";
import { cityLabel } from "../../shared/catalog-logic";
import type { PublishedOffer } from "../../src/lib/catalog";

export interface CitationEntry {
  city: string;
  region: string;
  asset: string;
  landingPage: string;
  gbpUrl: string;
  nap: { name: string; address: string; phone: string; email: string };
  anchorText: { primary: string; variants: string[] };
}

export interface CitationsReport {
  generatedFrom: string;
  entries: CitationEntry[];
  warnings: string[];
}

export const buildCitations = (offers: PublishedOffer[]): CitationsReport => {
  const warnings: string[] = [];
  const entries = offers.map((o): CitationEntry => {
    const landing = absoluteUrl(o.path);
    const nap = napFor(o.gbp);
    const label = `${o.asset.name} in ${o.location.city}`;

    if (!o.gbp) warnings.push(`${o.path}: no GBP Listings row linked to this city and asset (NAP falls back to site config)`);
    else {
      if (o.gbp.landingUrl && o.gbp.landingUrl.replace(/\/?$/, "/") !== landing) {
        warnings.push(`${o.path}: GBP landing page URL is "${o.gbp.landingUrl}" but the page is ${landing}`);
      }
      if (!o.gbp.landingUrl) warnings.push(`${o.path}: GBP listing has no Landing Page URL`);
      if (!o.gbp.phone) warnings.push(`${o.path}: GBP listing has no Local Phone Number (using ${SITE.phone.display})`);
      if (!o.gbp.gbpUrl && !o.location.gbpUrl) warnings.push(`${o.path}: no GBP URL on the listing or the Location`);
    }

    return {
      city: o.location.city,
      region: cityLabel(o.location),
      asset: o.asset.name,
      landingPage: landing,
      gbpUrl: o.gbp?.gbpUrl || o.location.gbpUrl || "",
      nap: { name: nap.name, address: nap.address || "", phone: nap.phoneDisplay, email: nap.email },
      anchorText: {
        primary: label,
        variants: [...new Set([...o.asset.keywordVariants.map((k) => `${k} ${o.location.city}`), `${o.location.city} ${o.asset.name.toLowerCase()}`])],
      },
    };
  });
  return { generatedFrom: SITE.url, entries, warnings };
};
