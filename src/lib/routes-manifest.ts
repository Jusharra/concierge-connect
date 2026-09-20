// The single list of pages the site emits. Routes (getStaticPaths), the sitemap and
// the build-time drift check all read from here so they cannot disagree.
import { CATEGORIES } from "@/lib/constants";

export interface ManifestEntry {
  path: string;
  changefreq: "weekly" | "monthly";
  priority: number;
  /** false = rendered but excluded from sitemap and marked noindex. */
  indexable: boolean;
}

export const categoryStaticPaths = (): string[] => CATEGORIES.map((c) => c.id);

export const offerStaticPaths = (): string[] =>
  CATEGORIES.flatMap((c) => c.offers.map((o) => `${c.id}/${o.slug}`));

const STATIC_PAGES: ManifestEntry[] = [
  { path: "/", changefreq: "weekly", priority: 1.0, indexable: true },
  { path: "/access/", changefreq: "monthly", priority: 0.8, indexable: true },
  { path: "/locations/", changefreq: "monthly", priority: 0.8, indexable: true },
  { path: "/partners/", changefreq: "monthly", priority: 0.6, indexable: true },
  { path: "/contact/", changefreq: "monthly", priority: 0.8, indexable: true },
  { path: "/faq/", changefreq: "monthly", priority: 0.6, indexable: true },
  { path: "/privacy/", changefreq: "monthly", priority: 0.3, indexable: true },
  { path: "/terms/", changefreq: "monthly", priority: 0.3, indexable: true },
];

export const getManifest = (): ManifestEntry[] => [
  ...STATIC_PAGES,
  ...categoryStaticPaths().map((id) => ({
    path: `/${id}/`,
    changefreq: "weekly" as const,
    priority: 0.9,
    indexable: true,
  })),
  ...offerStaticPaths().map((p) => ({
    path: `/${p}/`,
    changefreq: "monthly" as const,
    priority: 0.7,
    indexable: true,
  })),
];
