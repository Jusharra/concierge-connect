import { describe, expect, it, vi } from "vitest";
import { buildIndexNowPayload, extractLocs, notifyIndexNow } from "./indexnow";

describe("IndexNow", () => {
  it("extracts sitemap URLs and unescapes ampersands", () => {
    expect(extractLocs("<urlset><url><loc>https://a.test/x/</loc></url><url><loc>https://a.test/?a=1&amp;b=2</loc></url></urlset>")).toEqual([
      "https://a.test/x/",
      "https://a.test/?a=1&b=2",
    ]);
  });
  it("builds the payload with the key file location", () => {
    expect(buildIndexNowPayload("https://a.test", "abc12345", ["https://a.test/x/"])).toEqual({
      host: "a.test",
      key: "abc12345",
      keyLocation: "https://a.test/abc12345.txt",
      urlList: ["https://a.test/x/"],
    });
  });
  it("reads the sitemap then posts to IndexNow", async () => {
    const f = vi.fn(async (url: string) => (url.endsWith("sitemap.xml") ? new Response("<loc>https://a.test/x/</loc>") : new Response("", { status: 200 })));
    expect(await notifyIndexNow("https://a.test", "abc12345", f as unknown as typeof fetch)).toEqual({ submitted: 1, status: 200 });
    expect(f.mock.calls[1][0]).toBe("https://api.indexnow.org/IndexNow");
  });
});
