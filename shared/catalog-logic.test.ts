import { describe, expect, it } from "vitest";
import { makeData } from "../src/test/fixtures/site-data";
import {
  cityLabel,
  complianceFor,
  jurisdictionsFor,
  parseFaqs,
  parseIncludedItems,
  payAvailability,
  publishability,
  splitParagraphs,
} from "./catalog-logic";

describe("text parsing", () => {
  it("parses FAQ blocks with or without Q:/A: prefixes", () => {
    expect(parseFaqs("Q: Is it open?\nA: Yes.\n\nHow much?\nFrom $1.")).toEqual([
      { q: "Is it open?", a: "Yes." },
      { q: "How much?", a: "From $1." },
    ]);
  });
  it("parses value-stack lines with optional dollar values", () => {
    expect(parseIncludedItems("Crew | 1,200\nCatering — $800\nWater toys")).toEqual([
      { label: "Crew", value: 1200 },
      { label: "Catering", value: 800 },
      { label: "Water toys", value: null },
    ]);
  });
  it("splits paragraphs on blank lines", () => {
    expect(splitParagraphs("one\nstill one\n\ntwo")).toEqual(["one still one", "two"]);
  });
});

describe("location labels", () => {
  it("uses state codes for the US and the country elsewhere", () => {
    expect(cityLabel({ city: "Miami", state: "Florida", country: "United States" })).toBe("Miami, FL");
    expect(cityLabel({ city: "London", state: "England", country: "United Kingdom" })).toBe("London, UK");
    expect(cityLabel({ city: "St. Tropez", state: "PACA", country: "France" })).toBe("St. Tropez, France");
    expect(cityLabel({ city: "Monaco", state: "", country: "Monaco" })).toBe("Monaco");
  });
});

describe("publishing gate", () => {
  it("publishes a ready city x asset page", () => {
    const d = makeData();
    expect(publishability(d.packages[0], d)).toEqual({ ok: true, reasons: [] });
  });
  it("blocks when the package is inactive, has no partner or its city is not live", () => {
    const d = makeData();
    const r = publishability(d.packages[1], d);
    expect(r.ok).toBe(false);
    expect(r.reasons).toEqual(expect.arrayContaining(["Package is not Active", "no Partner linked", "Location is not Live"]));
  });
  it("blocks thin pages: no hub points or fewer than 3 local FAQs", () => {
    const d = makeData();
    d.locations[0].hubPoints = [];
    d.locations[0].localFaqs = d.locations[0].localFaqs.slice(0, 2);
    const r = publishability(d.packages[0], d);
    expect(r.ok).toBe(false);
    expect(r.reasons.join(" ")).toMatch(/Hub Points/);
    expect(r.reasons.join(" ")).toMatch(/3\+ Local FAQs/);
  });
  it("blocks a nested package whose parent offer is not publishable", () => {
    const d = makeData();
    d.packages.push({ ...d.packages[0], id: "recChild", packageSlug: "sunset-cruise" });
    d.packages[0].active = false;
    expect(publishability(d.packages[2], d).ok).toBe(false);
  });
});

describe("compliance and the Pay path", () => {
  it("matches US jurisdictions by state", () => {
    expect(jurisdictionsFor({ country: "United States", state: "California" })).toEqual(["US Federal", "US - California"]);
    expect(jurisdictionsFor({ country: "United States", state: "Texas" })).toEqual(["US Federal", "US - Other"]);
  });
  it("allows Pay once every applicable rule is Live", () => {
    const d = makeData();
    const c = complianceFor(d.packages[0], d);
    expect(c.ok).toBe(true);
    expect(c.disclosureText).toContain("CA disclosure text");
    expect(c.disclosureVersion).toBe("California Seller of Travel@v1");
    expect(payAvailability(d.packages[0], d).allowed).toBe(true);
  });
  it("falls back to Quote when an applicable rule is not Live", () => {
    const d = makeData();
    d.compliance[0].status = "Draft";
    d.compliance[0].fullText = "";
    const p = payAvailability(d.packages[0], d);
    expect(p.allowed).toBe(false);
    expect(p.reasons.join(" ")).toMatch(/not Live/);
  });
  it("blocks Pay when no rule applies at all (unreviewed asset type)", () => {
    const d = makeData({ compliance: [] });
    expect(payAvailability(d.packages[0], d).allowed).toBe(false);
  });
  it("requires a deposit, a currency and refund wording", () => {
    const d = makeData();
    d.packages[0].depositAmount = null;
    d.packages[0].riskReversalText = "";
    const p = payAvailability(d.packages[0], d);
    expect(p.allowed).toBe(false);
    expect(p.reasons).toEqual(expect.arrayContaining(["no Deposit Amount", "no Risk Reversal Text (refund terms)"]));
  });
});
