import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import { PHONE_HREF, PHONE_NUMBER, SITE_NAME } from "@/lib/constants";

const ThankYouPage = () => {
  const [params] = useSearchParams();
  const booked = params.get("mode") === "booking";

  return (
    <Layout>
      <PageHead title={`Thank You | ${SITE_NAME}`} description="We have received your request." path="/thank-you" noindex />
      <section className="pt-32 pb-24 bg-background">
        <div className="container-luxury max-w-2xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
            <Check className="h-8 w-8 text-gold" aria-hidden="true" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">
            {booked ? "Your deposit is received" : "Thank you, we have your request"}
          </h1>
          <p className="text-lg text-foreground/70 leading-relaxed mb-8">
            {booked
              ? "The operator will now confirm your trip. If the operator cannot confirm, the refund terms shown on your package apply."
              : "We will come back with confirmed options and pricing for your dates, usually within 24 hours."}
          </p>
          <p className="text-muted-foreground mb-8">
            Need to add something?{" "}
            <a href={PHONE_HREF} className="text-gold hover-gold font-semibold">
              {PHONE_NUMBER}
            </a>
          </p>
          <Link to="/" className="luxury-btn-outline">
            Back to home
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default ThankYouPage;
