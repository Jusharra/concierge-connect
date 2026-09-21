/**
 * POST /api/quote-request
 * Creates the Customer + Leads & Bookings row in Airtable (server-side token) and forwards to the
 * Make.com webhook. Same-origin only; honeypot + rate limiting; never returns internal record IDs.
 */
import { clientIp, json, makeLimiter, readJson } from "./lib/http";
import { handleQuote } from "./lib/quote";

const allow = makeLimiter(8, 60_000);

export default async (req: Request, context?: { ip?: string }): Promise<Response> => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
  if (!allow(clientIp(req, context))) return json({ ok: false, error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": "60" });

  const body = await readJson(req);
  if (body === null || typeof body !== "object") return json({ ok: false, error: "Invalid request" }, 400);

  const result = await handleQuote(body);
  return json(result.body, result.status);
};

export const config = {
  path: "/api/quote-request",
  // Netlify-level rate limit (per IP); the in-memory limiter above is a second layer.
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
