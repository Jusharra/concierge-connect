/**
 * Runs after `vite-react-ssg build`.
 *  1. Renders the 404 route to dist/404.html (Netlify serves it with HTTP 404).
 *  2. Writes sitemap.xml and robots.txt from the SAME manifest the routes use.
 *  3. Fails the build if the emitted HTML and the manifest disagree, or if an
 *     indexable page is missing its title / description / canonical / single h1.
 */
import { existsSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { getManifest } from "../src/lib/routes-manifest";
import { SITE } from "../src/config/site";
import { writeRedirects } from "./lib/redirects";
import redirects from "../data/redirects.json";

const DIST = join(process.cwd(), "dist");
const fail: string[] = [];

// 1. 404 --------------------------------------------------------------------
const nested404 = join(DIST, "404", "index.html");
if (existsSync(nested404)) {
  renameSync(nested404, join(DIST, "404.html"));
  rmSync(join(DIST, "404"), { recursive: true, force: true });
} else if (!existsSync(join(DIST, "404.html"))) {
  fail.push("404.html was not generated");
}

// 2. Emitted pages vs manifest ----------------------------------------------
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });

const emitted = new Map<string, string>(); // url path -> file
for (const file of walk(DIST)) {
  const rel = relative(DIST, file).split(sep).join("/");
  if (rel === "index.html") emitted.set("/", file);
  else if (rel.endsWith("/index.html")) emitted.set(`/${rel.slice(0, -"index.html".length)}`, file);
}

const manifest = getManifest();
const indexable = manifest.filter((m) => m.indexable);
const expected = new Set(manifest.map((m) => m.path));

for (const m of manifest) if (!emitted.has(m.path)) fail.push(`manifest page not emitted: ${m.path}`);
for (const p of emitted.keys()) if (!expected.has(p)) fail.push(`emitted page not in manifest: ${p}`);

// 3. Per-page SEO assertions ------------------------------------------------
const tagAttrs = (html: string, tag: string): Record<string, string>[] =>
  [...html.matchAll(new RegExp("<" + tag + "\\b([^>]*)>", "g"))].map((m) => {
    const attrs: Record<string, string> = {};
    for (const a of m[1].matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[a[1]] = a[2];
    return attrs;
  });
const count = (html: string, re: RegExp) => (html.match(re) || []).length;

for (const m of manifest) {
  const file = emitted.get(m.path);
  if (!file) continue;
  const html = readFileSync(file, "utf8");
  if (count(html, /<title[ >]/g) !== 1 || !/<title[^>]*>[^<]+<\/title>/.test(html)) fail.push(`${m.path}: expected exactly one non-empty <title>`);
  const description = tagAttrs(html, "meta").find((a) => a.name === "description")?.content;
  if (!description) fail.push(`${m.path}: missing meta description`);
  const canonicals = tagAttrs(html, "link").filter((a) => a.rel === "canonical");
  if (canonicals.length !== 1) fail.push(`${m.path}: expected exactly one canonical, found ${canonicals.length}`);
  else if (canonicals[0].href !== `${SITE.url}${m.path}`) fail.push(`${m.path}: canonical is "${canonicals[0].href}"`);
  const h1s = count(html, /<h1[ >]/g);
  if (h1s !== 1) fail.push(`${m.path}: expected exactly one <h1>, found ${h1s}`);
  const robots = tagAttrs(html, "meta").find((a) => a.name === "robots")?.content ?? "";
  if (m.indexable && /noindex/.test(robots)) fail.push(`${m.path}: indexable page carries noindex`);
  if (!m.indexable && !/noindex/.test(robots)) fail.push(`${m.path}: non-indexable page is missing noindex`);
}

// 3b. Content depth report for generated city x asset pages (warning only) ----
const MIN_WORDS = 600;
const thin: string[] = [];
for (const m of manifest) {
  const file = emitted.get(m.path);
  if (!file || m.path.split("/").filter(Boolean).length < 2) continue;
  const html = readFileSync(file, "utf8");
  if (!/"@type":"Service"/.test(html)) continue; // only generated bookable pages
  const text = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, " ").replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  console.log(`  words ${String(words).padStart(5)}  ${m.path}`);
  if (words < MIN_WORDS) thin.push(`${m.path} (${words})`);
}
if (thin.length) console.warn(`  ⚠ under ${MIN_WORDS} words: ${thin.join(", ")}. Add local detail (Hub Points, Local FAQs, Page Copy, seasonal or event notes) in Airtable.`);

// 4. sitemap.xml / robots.txt / redirects -----------------------------------
const today = new Date().toISOString().slice(0, 10);
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  indexable
    .map(
      (m) =>
        `  <url>\n    <loc>${esc(SITE.url + m.path)}</loc>\n    <lastmod>${today}</lastmod>\n` +
        `    <changefreq>${m.changefreq}</changefreq>\n    <priority>${m.priority.toFixed(1)}</priority>\n  </url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);
writeFileSync(join(DIST, "robots.txt"), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);
writeRedirects(DIST, redirects as { from: string; to: string }[]);

if (fail.length) {
  console.error(`\n✖ postbuild failed (${fail.length}):\n  - ${fail.join("\n  - ")}\n`);
  process.exit(1);
}
console.log(`✔ postbuild: ${emitted.size} pages emitted, ${indexable.length} in sitemap, 404.html + robots.txt written`);
