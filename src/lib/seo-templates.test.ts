import { describe, expect, it } from "vitest";
import { makeData } from "@/test/fixtures/site-data";
import {
  DESCRIPTION_MAX,
  TITLE_MAX,
  assetHubTitle,
  breadcrumbLd,
  faqLd,
  formatMoney,
  offerDescription,
  offerTitle,
  packageTitle,
  riskReversalShort,
  serviceLd,
  napFor,
} from "./seo-templates";
import { SITE } from "@/config/site";

const d = makeData();
const [yacht] = d.assetTypes;
const [la] = d.locations;
const [pkg] = d.packages;

describe("titles", () => {
  it("uses the full template when it fits and drops the brand/CTA only when it must", () => {
    expect(offerTitle(yacht, la, pkg)).toBe(`Yacht Charter in Los Angeles, CA | ${SITE.brand}`);
    expect(offerTitle(yacht, la, pkg).length).toBeLessThanOrEqual(TITLE_MAX);
    const short = { ...la, city: "Rome" };
    // With a short brand the CTA variant would fit; verify the ordering logic with the current brand.
    expect(offerTitle({ ...yacht, name: "Yacht" }, short, pkg).length).toBeLessThanOrEqual(TITLE_MAX);
  });
  it("respects a Meta Title override from Airtable", () => {
    expect(offerTitle(yacht, la, { ...pkg, metaTitle: "Custom" })).toBe("Custom");
  });
  it("builds package and hub titles", () => {
    expect(packageTitle(yacht, la, { ...pkg, name: "Catalina Weekend" })).toContain("Catalina Weekend – Yacht Charter Los Angeles");
    expect(assetHubTitle(yacht)).toBe(`Yacht Charter Packages & Quotes | ${SITE.brand}`);
  });
});

describe("meta descriptions", () => {
  it("says starting at, never a fixed price, and stays within the limit", () => {
    const text = offerDescription(yacht, la, pkg, { canPay: true });
    expect(text).toContain("Book yacht charter in Los Angeles, starting at $4,500.");
    expect(text).toContain("Reserve with a deposit or request a quote.");
    expect(text).toContain("Full refund if your operator cannot confirm your trip.");
    expect(text.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });
  it("does not promise a deposit booking when the Pay path is unavailable", () => {
    const text = offerDescription(yacht, la, pkg, { canPay: false });
    expect(text).not.toMatch(/deposit/i);
    expect(text).toContain("Request a quote.");
  });
  it("never uses banned words", () => {
    const text = offerDescription(yacht, la, pkg, { canPay: true }) + offerTitle(yacht, la, pkg);
    expect(text.toLowerCase()).not.toMatch(/dispatch|\bfree\b/);
  });
});

describe("helpers", () => {
  it("formats money", () => {
    expect(formatMoney(4500, "USD")).toBe("$4,500");
    expect(formatMoney(4500, "EUR")).toBe("EUR 4,500");
  });
  it("takes the first sentence of the risk reversal", () => {
    expect(riskReversalShort("Full refund if we cannot confirm. Terms apply.")).toBe("Full refund if we cannot confirm.");
  });
});

describe("JSON-LD", () => {
  it("Service uses areaServed and a minimum-price Offer, and adds geo only when coordinates exist", () => {
    const ld: any = serviceLd({ name: "n", asset: yacht, loc: la, pkg, url: "https://x/y/", description: "d", nap: napFor(null) });
    expect(ld["@type"]).toBe("Service");
    expect(ld.areaServed.name).toBe("Los Angeles");
    expect(ld.offers.priceSpecification.minPrice).toBe(4500);
    expect(ld.provider.geo.latitude).toBe(33.7);
    const noGeo: any = serviceLd({ name: "n", asset: yacht, loc: { ...la, lat: null, lng: null }, pkg, url: "u", description: "d", nap: napFor(null) });
    expect(noGeo.provider.geo).toBeUndefined();
  });
  it("omits the Offer when there is no starting price and never emits AggregateRating", () => {
    const ld: any = serviceLd({ name: "n", asset: yacht, loc: la, pkg: { ...pkg, startingPrice: null }, url: "u", description: "d", nap: napFor(null) });
    expect(ld.offers).toBeUndefined();
    expect(JSON.stringify(ld)).not.toContain("AggregateRating");
  });
  it("FAQPage and BreadcrumbList", () => {
    expect(faqLd([])).toBeNull();
    expect((faqLd([{ q: "q", a: "a" }]) as any).mainEntity[0].name).toBe("q");
    const bc: any = breadcrumbLd([{ name: "Home", path: "/" }, { name: "Yachts", path: "/yachts/" }]);
    expect(bc.itemListElement[1].item).toBe(`${SITE.url}/yachts/`);
  });
  it("NAP prefers the GBP listing over site config", () => {
    const nap = napFor({ listingName: "LA Yacht Co", phone: "(310) 555-0100", address: "1 Marina Way", gbpUrl: "", id: "g", primaryCategory: "", landingUrl: "", status: "Live", verification: "", locationId: "", assetTypeId: "", reviewCount: null, averageRating: null });
    expect(nap.name).toBe("LA Yacht Co");
    expect(nap.phoneHref).toBe("tel:3105550100");
    expect(napFor(null).phoneHref).toBe(`tel:${SITE.phone.e164}`);
  });
});
