/**
 * POST /api/create-checkout
 * Starts a deposit checkout. Price, currency, refund terms and disclosure come from the server's own
 * data, never from the browser. Requires the acknowledgment; falls back to Quote when the matching
 * Compliance Rule is not Live.
 */
import { clientIp, json, makeLimiter, readJson } from "./lib/http";
import { handleCheckout } from "./lib/checkout";

const allow = makeLimiter(6, 60_000);

export default async (req: Request, context?: { ip?: string }): Promise<Response> => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, { Allow: "POST" });
  if (!allow(clientIp(req, context))) return json({ ok: false, error: "Too many requests. Please try again shortly." }, 429, { "Retry-After": "60" });

  const body = await readJson(req);
  if (body === null || typeof body !== "object") return json({ ok: false, error: "Invalid request" }, 400);

  const result = await handleCheckout(body);
  return json(result.body, result.status);
};

export const config = {
  path: "/api/create-checkout",
  rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
