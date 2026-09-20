import { Link } from "react-router-dom";
import { ChevronRight, Check, MapPin, Phone, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import Breadcrumbs from "@/components/offer/Breadcrumbs";
import FaqList from "@/components/offer/FaqList";
import GoogleMap from "@/components/offer/GoogleMap";
import NapBlock from "@/components/offer/NapBlock";
import OfferCta, { quoteHref } from "@/components/offer/OfferCta";
import ComplianceDisclaimer from "@/components/offer/ComplianceDisclaimer";
import { assetHubs, nearbyOffers, payFor, siblingOffers, type PublishedOffer } from "@/lib/catalog";
import { PHONE_HREF } from "@/lib/constants";
import { absoluteUrl } from "@/config/site";
import { categoryHeroImages, getOfferImage } from "@/lib/offerImages";
import {
  breadcrumbLd,
  faqLd,
  formatMoney,
  napFor,
  offerDescription,
  offerH1,
  offerTitle,
  serviceLd,
} from "@/lib/seo-templates";
import { cityLabel, cityLabelLong } from "../../shared/catalog-logic";

const lc = (s: string) => s.toLowerCase();

/**
 * City x asset "money page" for the bookable asset types. Everything on it comes from data/*.json:
 * the location's Hub Points and Local FAQs, the package's copy and pricing, the GBP listing's NAP.
 */
const CityAssetPage = ({ offer }: { offer: PublishedOffer }) => {
  const { pkg, asset, location, categoryId } = offer;
  const pay = payFor(pkg);
  const canPay = pay.allowed;
  const nap = napFor(offer.gbp);
  const place = cityLabel(location);
  const url = absoluteUrl(offer.path);

  const title = offerTitle(asset, location, pkg);
  const description = offerDescription(asset, location, pkg, { canPay });
  const h1 = offerH1(asset, location, pkg);
  const image = pkg.heroImageUrl || getOfferImage(offer.offerSlug) || categoryHeroImages[categoryId];
  const alt = `${asset.name} in ${location.city}, ${location.state || location.country}`;

  const hub = assetHubs().find((h) => h.asset.id === asset.id);
  const siblings = siblingOffers(offer);
  const otherCities = nearbyOffers(offer);
  const faqs = [...location.localFaqs, ...asset.faqs];
  const gbpUrl = offer.gbp?.gbpUrl || location.gbpUrl;

  const crumbs = [
    { name: "Home", path: "/" },
    ...(hub ? [{ name: asset.name, path: `/services/${asset.slug}/` }] : []),
    { name: cityLabel(location), path: offer.path },
  ];

  const [intro, ...rest] = pkg.pageCopy;
  const keywordH2 = `${asset.name} in ${location.city}: What's Included`;

  return (
    <Layout>
      <PageHead
        title={title}
        description={description}
        path={offer.path}
        image={image}
        jsonLd={[
          serviceLd({ name: `${asset.name} in ${location.city}`, asset, loc: location, pkg, url, description, nap, image: absoluteUrl(image) }),
          breadcrumbLd(crumbs),
          ...(faqLd(faqs) ? [faqLd(faqs) as object] : []),
        ]}
      />

      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={image} alt={alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="container relative z-10 pt-32 pb-16">
          <div className="max-w-3xl">
            <Breadcrumbs items={crumbs} />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {cityLabelLong(location)}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">{h1}</h1>
            {(pkg.subheading || asset.heroPromise) && (
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl">{pkg.subheading || asset.heroPromise}</p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#request-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {canPay ? "Reserve or Get a Quote" : "Get a Quote"}
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background/50 backdrop-blur-sm text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {nap.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-12">
              {intro && (
                <div className="space-y-4">
                  <p className="text-lg text-foreground leading-relaxed">{intro}</p>
                  {rest.map((p) => (
                    <p key={p} className="text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {pkg.includedItems.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">{keywordH2}</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {pkg.includedItems.map((item) => (
                      <li key={item.label} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-muted-foreground">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.startingPrice && (
                <div className="bg-muted/30 rounded-lg p-6 border border-border/50">
                  <h2 className="text-xl font-display font-semibold text-foreground mb-3">
                    {asset.name} pricing in {location.city}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {asset.name} in {location.city} starts at {formatMoney(pkg.startingPrice, pkg.currency)}
                    {pkg.priceUnit ? ` ${pkg.priceUnit}` : ""}. Your confirmed price depends on your dates, route or
                    itinerary and the number of guests, and is confirmed by the operator before any balance is due.
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-4">
                  {asset.name} departure points in {location.city}
                </h2>
                <p className="text-muted-foreground mb-4">
                  Departure and meeting points around {location.city} include:
                </p>
                <ul className="grid sm:grid-cols-2 gap-2">
                  {location.hubPoints.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
                {pkg.nearbyAreas.length > 0 && (
                  <p className="mt-4 text-sm text-muted-foreground">
                    Also serving {pkg.nearbyAreas.join(", ")}. Service is city-specific and subject to availability.
                  </p>
                )}
              </div>

              {pkg.howItWorks.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">How booking works</h2>
                  <ol className="space-y-4">
                    {pkg.howItWorks.map((step, i) => (
                      <li key={step} className="flex items-start gap-4">
                        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className="text-muted-foreground pt-2">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {offer.packages.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                    {asset.name} packages in {location.city}
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-4">
                    {offer.packages.map((p) => (
                      <li key={p.path} className="luxury-card p-5">
                        <Link to={p.path} className="font-display text-lg text-foreground hover:text-primary">
                          {p.pkg.name}
                        </Link>
                        {p.pkg.startingPrice ? (
                          <p className="text-sm text-muted-foreground mt-1">
                            Starting at {formatMoney(p.pkg.startingPrice, p.pkg.currency)}
                            {p.pkg.priceUnit ? ` ${p.pkg.priceUnit}` : ""}
                          </p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {faqs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                    {asset.name} in {location.city}: common questions
                  </h2>
                  <FaqList faqs={faqs} />
                </div>
              )}

              <div>
                <h2 className="text-2xl font-display font-semibold text-foreground mb-6">Find us in {location.city}</h2>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                  <NapBlock nap={nap} />
                  <div className="space-y-3">
                    <GoogleMap embedUrl={location.mapEmbedUrl} title={`Map of ${asset.name} in ${location.city}`} />
                    {gbpUrl && (
                      <a
                        href={gbpUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                      >
                        View our {location.city} {lc(asset.name)} listing on Google
                        <ChevronRight className="w-4 h-4" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {(siblings.length > 0 || otherCities.length > 0) && (
                <div className="space-y-6">
                  {siblings.length > 0 && (
                    <div>
                      <h2 className="text-xl font-display font-semibold text-foreground mb-3">Also in {location.city}</h2>
                      <ul className="flex flex-wrap gap-3">
                        {siblings.map((s) => (
                          <li key={s.path}>
                            <Link to={s.path} className="inline-flex px-4 py-2 rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition-colors">
                              {s.asset.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {otherCities.length > 0 && (
                    <div>
                      <h2 className="text-xl font-display font-semibold text-foreground mb-3">{asset.name} in other cities</h2>
                      <ul className="flex flex-wrap gap-3">
                        {otherCities.map((o) => (
                          <li key={o.path}>
                            <Link to={o.path} className="inline-flex px-4 py-2 rounded-full border border-border text-foreground hover:border-primary hover:text-primary transition-colors">
                              {cityLabel(o.location)}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-wrap gap-6">
                {hub && (
                  <Link to={`/services/${asset.slug}/`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                    <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                    All {asset.name} cities
                  </Link>
                )}
                <Link to={`/${categoryId}/`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                  <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                  View all {asset.name} locations
                </Link>
                <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                  <ChevronRight className="w-4 h-4 rotate-180" aria-hidden="true" />
                  All locations
                </Link>
              </div>
            </div>

            {/* Right column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <OfferCta offer={offer} canPay={canPay} data={pkg} />
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0" aria-hidden="true" />
                  <p>
                    Not sure yet?{" "}
                    <Link to={quoteHref(offer)} className="text-primary hover:text-primary/80 underline">
                      Ask for a quote
                    </Link>{" "}
                    and we will come back with confirmed options.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ComplianceDisclaimer variant="booking" />
        </div>
      </section>
    </Layout>
  );
};

export default CityAssetPage;
