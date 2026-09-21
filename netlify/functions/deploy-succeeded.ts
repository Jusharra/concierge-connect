/**
 * Netlify event function: runs automatically after every successful production deploy (the file name
 * is the trigger). Notifies IndexNow-compatible search engines about the sitemap URLs. Best effort:
 * it can never fail or block a deploy.
 *
 * Needs INDEXNOW_KEY (any 8-128 char hex/alphanumeric string). The build writes the matching
 * /{key}.txt file so the engines can verify ownership.
 */
import { SITE } from "../../src/config/site";
import { notifyIndexNow } from "./lib/indexnow";

export const handler = async () => {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return { statusCode: 200, body: "INDEXNOW_KEY not set; skipped" };
  if (process.env.CONTEXT && process.env.CONTEXT !== "production") return { statusCode: 200, body: "not a production deploy; skipped" };

  try {
    const result = await notifyIndexNow(process.env.SITE_URL_OVERRIDE || SITE.url, key);
    console.log("[deploy-succeeded] IndexNow:", JSON.stringify(result));
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (e) {
    console.error("[deploy-succeeded] IndexNow failed:", (e as Error).message);
    return { statusCode: 200, body: "failed (ignored)" };
  }
};
