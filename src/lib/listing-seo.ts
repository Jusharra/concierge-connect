/**
 * Titles, descriptions and JSON-LD for one-off listings (private islands). Built from the Listings row,
 * so a new listing needs no code. Prices are only ever "Starting at"; nothing here promises availability.
 */
import { SITE, absoluteUrl } from "@/config/site";
import type { ListingData } from "../../shared/data-types";
import { clamp } from "./seo";
import { TITLE_MAX, DESCRIPTION_MAX } from "./seo-templates";

const fit = (variants: string[]) => variants.find((v) => v.length <= TITLE_MAX) ?? variants[variants.length - 1];

export const listingPath = (l: Pick<ListingData, "categorySlug" | "slug">) => `/${l.categorySlug}/${l.slug}/`;

export const listingTitle = (l: ListingData, categoryName: string) =>
  fit([`${l.name} | ${categoryName} | ${SITE.brand}`, `${l.name} | ${SITE.brand}`, l.name]);

/** Summary first (it is the hook), then the price label when it fits. */
export const listingDescription = (l: ListingData) =>
  clamp(l.priceLabel ? `${l.summary} ${l.priceLabel}.` : l.summary, DESCRIPTION_MAX);

export const listingLd = (l: ListingData, categoryName: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: l.name,
  category: categoryName,
  description: l.summary,
  url: absoluteUrl(listingPath(l)),
  ...(l.photoUrl ? { image: l.photoUrl } : {}),
  ...(l.region ? { areaServed: l.region } : {}),
  ...(l.price
    ? {
        offers: {
          "@type": "Offer",
          url: absoluteUrl(listingPath(l)),
          priceCurrency: "USD",
          priceSpecification: { "@type": "PriceSpecification", minPrice: l.price, priceCurrency: "USD" },
        },
      }
    : {}),
});
