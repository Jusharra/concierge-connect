import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import BookingForm from "@/components/forms/BookingForm";
import { findOffer, findPackage, type PublishedOffer, type PublishedPackage } from "@/lib/catalog";
import { PHONE_HREF, PHONE_NUMBER, SITE_NAME } from "@/lib/constants";

/**
 * /book/?category=&offer=&package=  Preselects the package from the query string. It is read after
 * mount so the pre-rendered HTML is the same generic page for everyone (and stays noindex).
 */
const BookPage = () => {
  const [params] = useSearchParams();
  const [selection, setSelection] = useState<{ offer: PublishedOffer; pkg?: PublishedPackage } | null | undefined>(undefined);

  const category = params.get("category") || "";
  const offerSlug = params.get("offer") || "";
  const packageSlug = params.get("package") || "";
  const cancelled = params.get("cancelled") === "1";

  useEffect(() => {
    if (!category || !offerSlug) return setSelection(null);
    if (packageSlug) {
      const found = findPackage(category, offerSlug, packageSlug);
      return setSelection(found ? { offer: found.offer, pkg: found.pkg } : null);
    }
    const offer = findOffer(category, offerSlug);
    setSelection(offer ? { offer } : null);
  }, [category, offerSlug, packageSlug]);

  return (
    <Layout>
      <PageHead title={`Reserve | ${SITE_NAME}`} description="Reserve your booking with a deposit." path="/book" noindex />
      <section className="pt-32 pb-24 bg-background">
        <div className="container-luxury max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Reserve your booking</h1>
          <p className="text-lg text-foreground/70 leading-relaxed mb-10">
            Review the details, accept the terms and pay the deposit on a secure page. Prices are starting-at figures and the operator confirms availability for your dates.
          </p>

          {cancelled && (
            <p role="status" className="mb-6 rounded border border-border/60 p-4 text-sm text-muted-foreground">
              Payment was cancelled and nothing was charged. You can try again below.
            </p>
          )}

          {selection ? (
            <BookingForm offer={selection.offer} pkg={selection.pkg} />
          ) : (
            <div className="luxury-card p-8">
              <h2 className="heading-card text-foreground mb-3">
                {selection === undefined ? "Loading your selection" : "Choose a package to reserve"}
              </h2>
              <p className="text-muted-foreground mb-6">
                Pick a city and package on one of our service pages, or request a quote for a custom trip.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/access/" className="luxury-btn-outline">
                  Browse services
                </Link>
                <Link to="/quote/" className="luxury-btn-primary">
                  Get a Quote
                </Link>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-muted-foreground">
            Questions before you pay?{" "}
            <a href={PHONE_HREF} className="text-gold hover-gold font-semibold">
              {PHONE_NUMBER}
            </a>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default BookPage;
