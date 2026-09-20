import { Head } from "vite-react-ssg";
import { SITE, absoluteUrl } from "@/config/site";
import { canonicalPath } from "@/lib/seo";

interface PageHeadProps {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/yachts/yacht-charter-miami". Canonical is always absolute + trailing slash. */
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  jsonLd?: object | object[];
}

/**
 * Every page renders exactly one PageHead. Because the site is pre-rendered,
 * everything here lands in the static HTML (view-source / curl).
 */
const PageHead = ({ title, description, path, image, noindex, type = "website", jsonLd }: PageHeadProps) => {
  const url = absoluteUrl(canonicalPath(path));
  const ogImage = absoluteUrl(image || SITE.ogImagePath);
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE.brand} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {SITE.searchConsoleVerification ? (
        <meta name="google-site-verification" content={SITE.searchConsoleVerification} />
      ) : null}

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Head>
  );
};

export default PageHead;
