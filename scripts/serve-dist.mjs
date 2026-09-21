// Tiny static server that mimics Netlify's behaviour for local acceptance checks:
// nested index.html, trailing-slash redirect, netlify.toml [[redirects]], and a real
// HTTP 404 that serves dist/404.html. Usage: node scripts/serve-dist.mjs [port]
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";

const DIST = join(process.cwd(), "dist");
const PORT = Number(process.argv[2] || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".jpg": "image/jpeg", ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon" };

const toml = existsSync("netlify.toml") ? readFileSync("netlify.toml", "utf8") : "";
const redirects = [...toml.matchAll(/\[\[redirects\]\]\s+from = "([^"]+)"\s+to = "([^"]+)"\s+status = (\d+)/g)].map((m) => ({ from: m[1].replace(/\/$/, ""), to: m[2], status: Number(m[3]) }));

createServer((req, res) => {
  const url = new URL(req.url, "http://x");

  // MOCK_API=1 logs POSTs to /api/* and answers ok, so forms can be exercised without Netlify.
  if (process.env.MOCK_API && url.pathname.startsWith("/api/") && req.method === "POST") {
    let body = "";
    req.on("data", (c) => (body += c));
    req.on("end", () => {
      console.log(`[mock-api] ${url.pathname} ${body}`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(url.pathname.endsWith("create-checkout") ? { ok: true, url: "/thank-you/?mode=booking" } : { ok: true }));
    });
    return;
  }
  const path = normalize(decodeURIComponent(url.pathname)).split("\\").join("/");
  const bare = path.replace(/\/$/, "");
  const rule = redirects.find((r) => r.from === bare);
  if (rule) { res.writeHead(rule.status, { Location: rule.to }); return res.end(); }

  const file = join(DIST, path);
  if (existsSync(file) && statSync(file).isFile()) return send(res, 200, file);
  if (existsSync(file) && statSync(file).isDirectory() && existsSync(join(file, "index.html"))) {
    if (!path.endsWith("/")) { res.writeHead(301, { Location: `${path}/${url.search}` }); return res.end(); }
    return send(res, 200, join(file, "index.html"));
  }
  return send(res, 404, join(DIST, "404.html"));
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}`));

function send(res, status, file) {
  res.writeHead(status, { "Content-Type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}
