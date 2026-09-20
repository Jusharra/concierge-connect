/**
 * Google Analytics 4 helpers. Off unless SITE.ga4MeasurementId is set. Uses Consent Mode v2: analytics
 * storage starts DENIED and is granted only after the visitor accepts in the cookie banner, so the
 * default is privacy-preserving. Every event carries city and asset so results can be read per
 * city x asset (the numbers that prove the asset works).
 */
import { SITE } from "@/config/site";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const CONSENT_KEY = "lux-cookie-consent";
export const CONSENT_EVENT = "lux-consent-change";

export interface EventContext {
  city?: string;
  asset?: string;
  category?: string;
  offer?: string;
  package?: string;
}

let initialised = false;

export const initAnalytics = () => {
  const id = SITE.ga4MeasurementId;
  if (!id || typeof window === "undefined" || initialised) return;
  initialised = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    (window.dataLayer as unknown[]).push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  const apply = () => {
    let accepted = false;
    try {
      accepted = localStorage.getItem(CONSENT_KEY) === "accepted";
    } catch {
      /* storage unavailable: stay denied */
    }
    window.gtag?.("consent", "update", { analytics_storage: accepted ? "granted" : "denied" });
  };
  apply();
  window.addEventListener(CONSENT_EVENT, apply);
};

export const track = (name: string, params: EventContext & Record<string, unknown> = {}) => {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params);
};
