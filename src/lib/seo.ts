// Pure SEO helpers shared by pages, the sitemap generator and tests.

/** "/a/b" -> "/a/b/", "/" -> "/", strips query/hash. */
export const canonicalPath = (path: string): string => {
  const clean = path.split("#")[0].split("?")[0];
  if (clean === "" || clean === "/") return "/";
  const withLead = clean.startsWith("/") ? clean : `/${clean}`;
  return withLead.endsWith("/") ? withLead : `${withLead}/`;
};

/** Trim to a max length on a word boundary, adding an ellipsis when cut. */
export const clamp = (text: string, max: number): string => {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.\-–|]+$/, "")}…`;
};
