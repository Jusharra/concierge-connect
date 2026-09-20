import type { SiteData } from "../../../shared/data-types";

/** A tiny, fully-ready dataset: one live US yacht city plus a not-live jet city. */
export const makeData = (over: Partial<SiteData> = {}): SiteData => ({
  assetTypes: [
    { id: "recYacht", slug: "yacht-charter", name: "Yacht Charter", categorySlug: "yachts", bookable: true, heroPromise: "", keywordVariants: [], whatsIncluded: [], faqs: [], active: true },
    { id: "recJet", slug: "private-jet-charter", name: "Private Jet Charter", categorySlug: "private-air", bookable: true, heroPromise: "", keywordVariants: [], whatsIncluded: [], faqs: [], active: true },
  ],
  locations: [
    {
      id: "recLA", slug: "los-angeles", city: "Los Angeles", state: "California", country: "United States", lat: 33.7, lng: -118.3,
      gbpUrl: "", mapEmbedUrl: "", hubPoints: ["Marina del Rey", "Newport Harbor"], live: true, launchStatus: "Live", partnerCount: 1,
      localFaqs: [{ q: "a?", a: "b" }, { q: "c?", a: "d" }, { q: "e?", a: "f" }],
    },
    {
      id: "recDXB", slug: "dubai", city: "Dubai", state: "Dubai", country: "United Arab Emirates", lat: null, lng: null,
      gbpUrl: "", mapEmbedUrl: "", hubPoints: [], localFaqs: [], live: false, launchStatus: "Candidate", partnerCount: 0,
    },
  ],
  packages: [
    {
      id: "recPkgLA", name: "Yacht Charter Los Angeles", offerSlug: "yacht-charter-los-angeles", packageSlug: "", assetId: "recYacht", locationId: "recLA",
      partnerIds: ["recPartner"], categorySlug: "yachts", bookingMode: "Pay", startingPrice: 4500, currency: "USD", priceUnit: "per day",
      boldPromise: "", includedItems: [], valueStackTotal: null, riskReversalText: "Full refund if your operator cannot confirm your trip.",
      depositAmount: 500, stripePaymentLink: "", metaTitle: "", metaDescription: "", heroImageUrl: "", h1: "", subheading: "", pageCopy: [], howItWorks: [], nearbyAreas: [],
      active: true, partnerCount: 1, locationLive: 1, ready: "Ready",
    },
    {
      id: "recPkgDXB", name: "Private Jet Charter Dubai", offerSlug: "private-jet-charter-dubai", packageSlug: "", assetId: "recJet", locationId: "recDXB",
      partnerIds: [], categorySlug: "private-air", bookingMode: "Quote", startingPrice: null, currency: "AED", priceUnit: "",
      boldPromise: "", includedItems: [], valueStackTotal: null, riskReversalText: "", depositAmount: null, stripePaymentLink: "", metaTitle: "", metaDescription: "",
      heroImageUrl: "", h1: "", subheading: "", pageCopy: [], howItWorks: [], nearbyAreas: [], active: false, partnerCount: 0, locationLive: 0, ready: "Blocked",
    },
  ],
  partners: [{ id: "recPartner", name: "Harbor Yachts", verified: true, assetTypeIds: ["recYacht"], locationIds: ["recLA"] }],
  compliance: [
    { id: "recCA", ruleName: "California Seller of Travel", jurisdiction: "US - California", status: "Live", version: "v1", effectiveDate: "", fullText: "CA disclosure text", registrationNumber: "CST-1", appliesAssetTypeIds: ["recYacht", "recJet"], appliesLocationIds: [] },
  ],
  gbp: [],
  redirects: [],
  ...over,
});
