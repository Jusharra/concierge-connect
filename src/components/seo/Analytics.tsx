import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { findOffer } from "@/lib/catalog";
import { initAnalytics, track, type EventContext } from "@/lib/analytics";
import { captureAttribution } from "@/lib/attribution";

/** City / asset for the current URL, when it is a city x asset (or package) page. */
export const contextForPath = (pathname: string): EventContext => {
  const [category, offerSlug] = pathname.split("/").filter(Boolean);
  const offer = category && offerSlug ? findOffer(category, offerSlug) : undefined;
  return offer
    ? { city: offer.location.city, asset: offer.asset.name, category: offer.categoryId, offer: offer.offerSlug }
    : {};
};

/**
 * Mounts GA4 once and reports tel: clicks (with city and asset) from anywhere on the site via a single
 * delegated listener, so individual phone links need no extra wiring.
 */
const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    captureAttribution();
    initAnalytics();
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a[href^='tel:']") as HTMLAnchorElement | null;
      if (!a) return;
      track("phone_click", { ...contextForPath(window.location.pathname), link_url: a.getAttribute("href") || "" });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [location.pathname]);

  return null;
};

export default Analytics;
