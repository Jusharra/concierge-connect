import { describe, expect, it } from "vitest";
import { F } from "../../shared/airtable-schema";
import { aggregateMonth, monthKey, previousMonth } from "./city-report";
import { buildCitations } from "./citations";
import { makeData } from "../../src/test/fixtures/site-data";

const lead = (over: Record<string, unknown>) => ({
  id: "rec" + Math.random().toString(36).slice(2, 8),
  fields: { [F.leads.submitted]: "2026-09-10T12:00:00.000Z", [F.leads.location]: ["recLA"], [F.leads.assetType]: ["recYacht"], ...over },
});

describe("monthly city report", () => {
  it("computes the previous month, including across a year boundary", () => {
    expect(previousMonth(new Date("2026-10-03T00:00:00Z"))).toBe("2026-09");
    expect(previousMonth(new Date("2026-01-15T00:00:00Z"))).toBe("2025-12");
    expect(monthKey(new Date("2026-09-30T23:59:59Z"))).toBe("2026-09");
  });

  it("counts quotes, paid deposits and revenue per city x asset for the month only", () => {
    const { totals, unassigned } = aggregateMonth(
      [
        lead({ [F.leads.mode]: "Quote" }),
        lead({ [F.leads.mode]: "Quote" }),
        lead({ [F.leads.mode]: "Pay", [F.leads.paymentStatus]: "Deposit Paid", [F.leads.depositAmount]: 500, [F.leads.currency]: "USD" }),
        lead({ [F.leads.mode]: "Pay", [F.leads.paymentStatus]: "Unpaid" }), // abandoned checkout: not a deposit
        lead({ [F.leads.mode]: "Pay", [F.leads.paymentStatus]: "Refunded", [F.leads.depositAmount]: 500 }), // refunded: not revenue
        lead({ [F.leads.mode]: "Quote", [F.leads.submitted]: "2026-08-31T23:00:00.000Z" }), // other month
        lead({ [F.leads.mode]: "Quote", [F.leads.location]: undefined }), // unlinked
        lead({ [F.leads.mode]: "Quote", [F.leads.location]: ["recMIA"] }),
      ],
      "2026-09",
    );
    expect(unassigned).toBe(1);
    const la = totals.find((t) => t.locationId === "recLA")!;
    expect(la).toMatchObject({ quoteRequests: 2, depositsTaken: 1, depositRevenue: 500, currencies: ["USD"] });
    expect(totals.find((t) => t.locationId === "recMIA")).toMatchObject({ quoteRequests: 1, depositsTaken: 0, depositRevenue: 0 });
  });
});

describe("citations export", () => {
  it("emits canonical NAP, landing page, GBP URL and anchor text, and warns on a GBP landing-URL mismatch", () => {
    const d = makeData();
    const offer: any = {
      pkg: d.packages[0], asset: { ...d.assetTypes[0], keywordVariants: ["yacht charter", "luxury yacht rental"] }, location: d.locations[0],
      categoryId: "yachts", offerSlug: "yacht-charter-los-angeles", path: "/yachts/yacht-charter-los-angeles/", packages: [],
      gbp: { id: "g", listingName: "LA Yachts", gbpUrl: "https://maps.app.goo.gl/x", primaryCategory: "", address: "1 Marina Way", phone: "(310) 555-0100", landingUrl: "https://luxconnoisseurs.com/yachts/other/", status: "Live", verification: "", locationId: "recLA", assetTypeId: "recYacht", reviewCount: null, averageRating: null },
    };
    const r = buildCitations([offer]);
    expect(r.entries[0].landingPage).toBe("https://luxconnoisseurs.com/yachts/yacht-charter-los-angeles/");
    expect(r.entries[0].nap).toMatchObject({ name: "LA Yachts", address: "1 Marina Way", phone: "(310) 555-0100" });
    expect(r.entries[0].anchorText.primary).toBe("Yacht Charter in Los Angeles");
    expect(r.entries[0].anchorText.variants).toContain("luxury yacht rental Los Angeles");
    expect(r.warnings.join(" ")).toMatch(/GBP landing page URL/);
  });

  it("warns when a live page has no GBP listing at all", () => {
    const d = makeData();
    const offer: any = { pkg: d.packages[0], asset: d.assetTypes[0], location: d.locations[0], categoryId: "yachts", offerSlug: "x", path: "/yachts/x/", packages: [], gbp: null };
    expect(buildCitations([offer]).warnings[0]).toMatch(/no GBP Listings row/);
  });
});
