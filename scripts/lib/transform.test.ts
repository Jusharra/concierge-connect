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
