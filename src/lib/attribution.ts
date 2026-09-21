/**
 * First-touch attribution kept for the browsing session: UTM values plus the landing URL and
 * referrer. Sent with every quote / booking so Airtable "Leads & Bookings" records Source Page URL and
 * UTM fields, which is what makes results measurable per city x asset.
 */
const KEY = "lux-attribution";

export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  sourcePageUrl?: string;
}

const read = (): Attribution | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : null;
  } catch {
    return null;
  }
};

/** Call once per page load (Analytics does). Keeps the first UTM-tagged landing of the session. */
export const captureAttribution = () => {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source") || undefined;
  const utmMedium = params.get("utm_medium") || undefined;
  const utmCampaign = params.get("utm_campaign") || undefined;
  const existing = read();
  if (existing && !(utmSource || utmMedium || utmCampaign)) return;
  if (existing && (existing.utmSource || existing.utmMedium || existing.utmCampaign) && !(utmSource || utmMedium || utmCampaign)) return;
  try {
    sessionStorage.setItem(
      KEY,
      JSON.stringify({
        utmSource,
        utmMedium,
        utmCampaign,
        referrer: document.referrer || undefined,
        sourcePageUrl: window.location.origin + window.location.pathname,
      } satisfies Attribution),
    );
  } catch {
    /* storage unavailable: attribution is best-effort */
  }
};

/** Attribution for a submission. `sourcePageUrl` is always the page the visitor submitted from. */
export const getAttribution = (): Attribution => {
  if (typeof window === "undefined") return {};
  const stored = read() || {};
  return {
    ...stored,
    referrer: stored.referrer ?? (document.referrer || undefined),
    sourcePageUrl: window.location.origin + window.location.pathname,
  };
};
