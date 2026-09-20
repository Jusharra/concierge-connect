import { Link } from "react-router-dom";
import { Check, ChevronRight, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import Breadcrumbs from "@/components/offer/Breadcrumbs";
import OfferCta from "@/components/offer/OfferCta";
import ComplianceDisclaimer from "@/components/offer/ComplianceDisclaimer";
import { assetHubs, payFor, type PublishedOffer, type PublishedPackage } from "@/lib/catalog";
import { absoluteUrl } from "@/config/site";
import { categoryHeroImages, getOfferImage } from "@/lib/offerImages";
import { breadcrumbLd, napFor, packageDescription, packageTitle, serviceLd } from "@/lib/seo-templates";
import { cityLabel } from "../../shared/catalog-logic";

/** Nested package page: /{category}/{offer-slug}/{package-slug}. Links up to its city x asset page. */
const PackagePage = ({ offer, pkg: child }: { offer: PublishedOffer; pkg: PublishedPackage }) => {
  const { asset, location, categoryId } = offer;
  const data = child.pkg;
  const pay = payFor(data);
  const canPay = pay.allowed;
  const nap = napFor(offer.gbp);
  const url = absoluteUrl(child.path);
  const title = packageTitle(asset, location, data);
  const description = packageDescription(asset, location, data, { canPay });
  const h1 = data.h1 || data.name;
  const image = data.heroImageUrl || getOfferImage(offer.offerSlug) || categoryHeroImages[categoryId];
  const hub = assetHubs().find((h) => h.asset.id === asset.id);

  const crumbs = [
    { name: "Home", path: "/" },
    ...(hub ? [{ name: asset.name, path: `/services/${asset.slug}/` }] : []),
    { name: cityLabel(location), path: offer.path },
    { name: data.name, path: child.path },
  ];

  return (
    <Layout>
      <PageHead
        title={title}
        description={description}
        path={child.path}
        image={image}
        jsonLd={[
          serviceLd({ name: data.name, asset, loc: location, pkg: data, url, description, nap, image: absoluteUrl(image) }),
          breadcrumbLd(crumbs),
        ]}
      />

      <section className="relative min-h-[50vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={image} alt={`${data.name}: ${asset.name} in ${location.city}`} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="container relative z-10 pt-32 pb-12">
          <div className="max-w-3xl">
            <Breadcrumbs items={crumbs} />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {cityLabel(location)}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">{h1}</h1>
            {data.subheading && <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">{data.subheading}</p>}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-10">
              {data.pageCopy.map((p, i) => (
                <p key={p} className={i === 0 ? "text-lg text-foreground leading-relaxed" : "text-muted-foreground leading-relaxed"}>
                  {p}
                </p>
              ))}

              {data.includedItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                    What is in the {data.name} package
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {data.includedItems.map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-muted-foreground">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {data.howItWorks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">How booking works</h2>
                  <ol className="space-y-3 text-muted-foreground list-decimal pl-5">
                    {data.howItWorks.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                </div>
              )}

              <Link to={offer.path} className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                Back to {asset.name} in {location.city}
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <OfferCta offer={offer} pkg={child} canPay={canPay} data={data} />
              </div>
            </div>
          </div>
          <ComplianceDisclaimer variant="booking" />
        </div>
      </section>
    </Layout>
  );
};

export default PackagePage;
