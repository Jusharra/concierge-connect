import { Link, useParams } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import Breadcrumbs from "@/components/offer/Breadcrumbs";
import FaqList from "@/components/offer/FaqList";
import NotFound from "./NotFound";
import { findAssetHub } from "@/lib/catalog";
import { absoluteUrl } from "@/config/site";
import { categoryHeroImages, getOfferImage } from "@/lib/offerImages";
import { assetHubDescription, assetHubTitle, breadcrumbLd, faqLd, formatMoney } from "@/lib/seo-templates";
import { cityLabel } from "../../shared/catalog-logic";
import { PHONE_HREF, PHONE_NUMBER } from "@/lib/constants";

/**
 * Asset hub: /services/{asset-slug}/. Exists only while at least one city page for the asset is
 * published, and links to every live city for that asset.
 */
const AssetHubPage = () => {
  const { assetSlug } = useParams<{ assetSlug: string }>();
  const hub = assetSlug ? findAssetHub(assetSlug) : undefined;
  if (!hub) return <NotFound />;

  const { asset, offers } = hub;
  const path = `/services/${asset.slug}/`;
  const cities = offers.map((o) => o.location.city);
  const title = assetHubTitle(asset);
  const description = assetHubDescription(asset, cities);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/access/" },
    { name: asset.name, path },
  ];
  const image = categoryHeroImages[asset.categorySlug];

  return (
    <Layout>
      <PageHead
        title={title}
        description={description}
        path={path}
        image={image}
        jsonLd={[
          breadcrumbLd(crumbs),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `${asset.name} by city`,
            itemListElement: offers.map((o, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: `${asset.name} in ${o.location.city}`,
              url: absoluteUrl(o.path),
            })),
          },
          ...(faqLd(asset.faqs) ? [faqLd(asset.faqs) as object] : []),
        ]}
      />

      <section className="pt-32 pb-12 bg-background">
        <div className="container-luxury max-w-4xl">
          <Breadcrumbs items={crumbs} />
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">{asset.name} Packages &amp; Quotes</h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            {asset.heroPromise ||
              `${asset.name} in ${cities.slice(0, 3).join(", ")}${cities.length > 3 ? " and more" : ""}. Choose a city, then reserve with a deposit or request a quote.`}
          </p>
        </div>
      </section>

      <section className="pb-16 bg-background">
        <div className="container-luxury">
          <h2 className="text-2xl font-display font-semibold text-foreground mb-8">{asset.name} by city</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((o) => {
              const img = o.pkg.heroImageUrl || getOfferImage(o.offerSlug) || image;
              return (
                <li key={o.path} className="luxury-card overflow-hidden">
                  <Link to={o.path} className="group block">
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={img}
                        alt={`${asset.name} in ${o.location.city}, ${o.location.state || o.location.country}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-gold text-sm mb-2">
                        <MapPin className="w-4 h-4" aria-hidden="true" />
                        {cityLabel(o.location)}
                      </div>
                      <h3 className="heading-card text-foreground group-hover:text-gold transition-colors">
                        {asset.name} in {o.location.city}
                      </h3>
                      {o.pkg.startingPrice ? (
                        <p className="text-sm text-muted-foreground mt-1">
                          Starting at {formatMoney(o.pkg.startingPrice, o.pkg.currency)}
                          {o.pkg.priceUnit ? ` ${o.pkg.priceUnit}` : ""}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-gold">
                        Book or get a quote <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {asset.whatsIncluded.length > 0 && (
        <section className="pb-16 bg-background">
          <div className="container-luxury max-w-4xl">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-6">What is included</h2>
            <ul className="grid sm:grid-cols-2 gap-3 text-muted-foreground">
              {asset.whatsIncluded.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {asset.faqs.length > 0 && (
        <section className="pb-16 bg-background">
          <div className="container-luxury max-w-4xl">
            <h2 className="text-2xl font-display font-semibold text-foreground mb-6">{asset.name}: common questions</h2>
            <FaqList faqs={asset.faqs} />
          </div>
        </section>
      )}

      <section className="pb-24 bg-background">
        <div className="container-luxury max-w-4xl text-center">
          <p className="text-muted-foreground mb-3">Prefer to speak to someone?</p>
          <a href={PHONE_HREF} className="text-2xl font-serif text-gold hover-gold">
            {PHONE_NUMBER}
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default AssetHubPage;
