/** Small HTTP helpers shared by the Netlify Functions. */

export const json = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...headers },
  });

/** Best-effort client IP for rate limiting (Netlify sets context.ip and x-nf-client-connection-ip). */
export const clientIp = (req: Request, context?: { ip?: string }): string =>
  context?.ip || req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

/**
 * Per-instance sliding-window limiter. Netlify's `config.rateLimit` is the primary control; this
 * covers a warm instance being hammered and keeps the handlers safe when run outside Netlify.
 */
export const makeLimiter = (limit: number, windowMs: number) => {
  const hits = new Map<string, number[]>();
  return (key: string, now = Date.now()): boolean => {
    const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear(); // bound memory
    return true;
  };
};

/** Reads a JSON body with a hard size cap. Returns null when it is not valid JSON or too large. */
export const readJson = async (req: Request, maxBytes = 20_000): Promise<unknown | null> => {
  const text = await req.text();
  if (text.length > maxBytes) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
};
