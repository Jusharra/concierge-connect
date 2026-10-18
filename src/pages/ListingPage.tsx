import { Link } from "react-router-dom";
import { Check, Gem, MapPin, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import Breadcrumbs from "@/components/offer/Breadcrumbs";
import LeadForm from "@/components/ui/LeadForm";
import { CATEGORIES, PHONE_HREF, PHONE_NUMBER } from "@/lib/constants";
import { categoryHeroImages } from "@/lib/offerImages";
import { breadcrumbLd } from "@/lib/seo-templates";
import { listingDescription, listingLd, listingPath, listingTitle } from "@/lib/listing-seo";
import type { ListingData } from "../../shared/data-types";

/**
 * Detail page for one real listing (e.g. a private island). Everything comes from the Airtable
 * "Listings" row via data/listings.json. The price is always "Starting at"; the optional
 * irresistible-offer line shows only when its checkbox is ticked in Airtable.
 */
const ListingPage = ({ listing }: { listing: ListingData }) => {
  const category = CATEGORIES.find((c) => c.id === listing.categorySlug);
  const categoryName = category?.name ?? "Listings";
  const path = listingPath(listing);
  const image = listing.photoUrl || categoryHeroImages[listing.categorySlug];
  const crumbs = [
    { name: "Home", path: "/" },
    { name: categoryName, path: `/${listing.categorySlug}/` },
    { name: listing.name, path },
  ];
  const [intro, ...rest] = listing.description;

  return (
    <Layout>
      <PageHead
        title={listingTitle(listing, categoryName)}
        description={listingDescription(listing)}
        path={path}
        image={image}
        jsonLd={[listingLd(listing, categoryName), breadcrumbLd(crumbs)]}
      />

      <section className="relative min-h-[60vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img
            src={image}
            alt={listing.region ? `${listing.name}, ${listing.region}` : listing.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>
        <div className="container relative z-10 pt-32 pb-16">
          <div className="max-w-3xl">
            <Breadcrumbs items={crumbs} />
            {listing.region && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                {listing.region}
              </div>
            )}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4">{listing.name}</h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl">{listing.summary}</p>
            <p className="mb-8 text-2xl font-display font-semibold text-primary">
              {listing.priceLabel || "Price available on request"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#request-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ask About This Island
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background/50 backdrop-blur-sm text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5" aria-hidden="true" />
                Call {PHONE_NUMBER}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {listing.offerText && (
                <div className="flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/5 p-5">
                  <Gem className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                  <p className="text-foreground">{listing.offerText}</p>
                </div>
              )}

              {intro && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-semibold text-foreground">About {listing.name}</h2>
                  <p className="text-lg text-foreground leading-relaxed">{intro}</p>
                  {rest.map((p) => (
                    <p key={p} className="text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
              )}

              {listing.highlights.length > 0 && (
                <div>
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">What&apos;s Included</h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    {listing.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Link to={`/${listing.categorySlug}/`} className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                View all {categoryName}
              </Link>
            </div>

            <div className="lg:col-span-1">
              <div id="request-form" className="sticky top-24 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">Ask About This Island</h3>
                  <p className="text-sm text-muted-foreground mb-6">Share your details and we will come back to you with more information.</p>
                  <LeadForm category={categoryName} offer={listing.name} variant="hero" />
                </div>
              </div>
            </div>
          </div>

          <p className="mt-12 pt-8 border-t border-border/50 text-xs text-muted-foreground leading-relaxed max-w-3xl">
            Prices are starting-at figures. Details and availability are confirmed before any commitment is made.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ListingPage;
