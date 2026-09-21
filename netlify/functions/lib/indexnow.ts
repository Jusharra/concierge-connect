/**
 * IndexNow: tells Bing, Yandex, Seznam and Naver which URLs changed. Google retired its public
 * "sitemap ping" endpoint in 2023, so for Google the sitemap is submitted once in Search Console
 * (and is listed in robots.txt); Google then re-reads it on its own schedule.
 */

export const extractLocs = (sitemapXml: string): string[] =>
  [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim().replace(/&amp;/g, "&"));

export const buildIndexNowPayload = (siteUrl: string, key: string, urls: string[]) => ({
  host: new URL(siteUrl).host,
  key,
  keyLocation: `${siteUrl.replace(/\/$/, "")}/${key}.txt`,
  urlList: urls.slice(0, 10_000),
});

export const notifyIndexNow = async (siteUrl: string, key: string, fetchImpl: typeof fetch = fetch) => {
  const res = await fetchImpl(`${siteUrl.replace(/\/$/, "")}/sitemap.xml`);
  if (!res.ok) throw new Error(`could not read sitemap (${res.status})`);
  const urls = extractLocs(await res.text());
  if (urls.length === 0) return { submitted: 0 };
  const ping = await fetchImpl("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(buildIndexNowPayload(siteUrl, key, urls)),
  });
  // 200/202 = accepted. Anything else is reported but never fails a deploy.
  return { submitted: urls.length, status: ping.status };
};
