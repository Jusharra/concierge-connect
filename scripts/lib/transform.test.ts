import { describe, expect, it } from "vitest";
import { F } from "../../shared/airtable-schema";
import { transformCompliance, transformPartners, transformRedirects } from "./transform";

describe("public-safety of the Airtable transform", () => {
  it("never copies draft compliance text or registration numbers", () => {
    const [draft, live] = transformCompliance([
      { id: "r1", fields: { [F.compliance.ruleName]: "Draft rule", [F.compliance.status]: "Draft", [F.compliance.fullText]: "SECRET DRAFT", [F.compliance.registrationNumber]: "X-1" } },
      { id: "r2", fields: { [F.compliance.ruleName]: "Live rule", [F.compliance.status]: "Live", [F.compliance.fullText]: "Public text", [F.compliance.registrationNumber]: "CST-9" } },
    ]);
    expect(draft.fullText).toBe("");
    expect(draft.registrationNumber).toBe("");
    expect(live.fullText).toBe("Public text");
    expect(live.registrationNumber).toBe("CST-9");
  });

  it("keeps partner names only: no contact details", () => {
    const [p] = transformPartners([
      { id: "p1", fields: { [F.partners.name]: "Harbor Yachts", fldRPducJowO4fjS9: "boss@example.com", fldSTN92pJK1LzzkB: "+1 555 0100" } },
    ]);
    expect(Object.keys(p).sort()).toEqual(["assetTypeIds", "id", "locationIds", "name", "verified"]);
    expect(JSON.stringify(p)).not.toContain("example.com");
  });

  it("turns Redirected Page Registry rows into 301 targets, defaulting to the category hub", () => {
    const assets = [{ id: "recJet", categorySlug: "private-air" }] as any;
    const out = transformRedirects(
      [
        { id: "a", fields: { [F.pageRegistry.urlPath]: "/private-air/old", [F.pageRegistry.status]: "Redirected", [F.pageRegistry.assetType]: ["recJet"] } },
        { id: "b", fields: { [F.pageRegistry.urlPath]: "/yachts/old", [F.pageRegistry.status]: "Redirected", [F.pageRegistry.redirectTo]: "/yachts/new" } },
        { id: "c", fields: { [F.pageRegistry.urlPath]: "/live", [F.pageRegistry.status]: "Live" } },
      ],
      assets,
    );
    expect(out).toEqual([
      { from: "/private-air/old", to: "/private-air/" },
      { from: "/yachts/old", to: "/yachts/new/" },
    ]);
  });
});

import {
  listingCopyWarnings,
  listingPriceLabel,
  skippedListings,
  soldListingRedirects,
  transformListings,
} from "./transform";
import { LISTINGS_INTERNAL_FIELD_IDS } from "../../shared/airtable-schema";

const L = F.listings;
const row = (id: string, over: Record<string, unknown> = {}) => ({
  id,
  fields: {
    [L.name]: "Private Island, Exuma Cays",
    [L.slug]: "private-island-exuma-cays",
    [L.category]: "Private Islands",
    [L.status]: "Live",
    [L.summary]: "A private cay with deep-water access.",
    [L.price]: 14_500_000,
    ...over,
  },
});

describe("Listings transform", () => {
  it("syncs only Live rows and maps the category to its URL slug", () => {
    const out = transformListings([row("a"), row("b", { [L.status]: "Draft", [L.slug]: "draft-one" }), row("c", { [L.status]: "Sold", [L.slug]: "sold-one" })]);
    expect(out.map((l) => l.slug)).toEqual(["private-island-exuma-cays"]);
    expect(out[0].categorySlug).toBe("private-islands");
  });

  it("builds a Starting-at price label, lets an override win, and never invents a price", () => {
    expect(listingPriceLabel(14_500_000, "")).toBe("Starting at $14,500,000");
    expect(listingPriceLabel(14_500_000, "Starting at $14.5M")).toBe("Starting at $14.5M");
    expect(listingPriceLabel(null, "")).toBe("");
    expect(listingPriceLabel(0, "")).toBe("");
  });

  it("shows the irresistible-offer text only when its checkbox is ticked", () => {
    const text = "Buy through us and get 10% off any future purchase.";
    expect(transformListings([row("a", { [L.offerText]: text })])[0].offerText).toBe("");
    expect(transformListings([row("a", { [L.offerText]: text, [L.offerActive]: true })])[0].offerText).toBe(text);
  });

  it("never copies Deal Structure or Internal Notes, and never requests them", () => {
    const [l] = transformListings([row("a", { fldPWmhOfwY00rpaw: "Buy & Resell", fldGaL45FlcnCp38R: "paid 9M, flip for 14.5M" })]);
    expect(JSON.stringify(l)).not.toMatch(/Buy & Resell|flip for/);
    const requested = Object.values(L) as string[];
    for (const id of LISTINGS_INTERNAL_FIELD_IDS) expect(requested).not.toContain(id);
  });

  it("does not publish a Live row that is incomplete, and reports why", () => {
    const rows = [row("a", { [L.summary]: "" }), row("b", { [L.slug]: "Bad Slug!" }), row("c", { [L.category]: undefined })];
    expect(transformListings(rows)).toEqual([]);
    const reasons = skippedListings(rows).map((s) => s.reasons.join(" "));
    expect(reasons[0]).toMatch(/Summary/);
    expect(reasons[1]).toMatch(/lowercase/);
    expect(reasons[2]).toMatch(/Category/);
  });

  it("keeps the first row when two listings share a slug", () => {
    const out = transformListings([row("a", { [L.name]: "First" }), row("b", { [L.name]: "Second" })]);
    expect(out).toHaveLength(1);
    expect(out[0].name).toBe("First");
  });

  it("turns a Sold listing into a 301 to its category hub", () => {
    expect(soldListingRedirects([row("c", { [L.status]: "Sold" })])).toEqual([{ from: "/private-islands/private-island-exuma-cays", to: "/private-islands/" }]);
  });

  it("warns (never edits) when copy contains banned words", () => {
    const w = listingCopyWarnings([row("a", { [L.summary]: "Free helicopter transfer included", [L.offerText]: "We dispatch a boat" })]);
    expect(w.join(" ")).toMatch(/free/);
    expect(w.join(" ")).toMatch(/dispatch/);
  });
});
