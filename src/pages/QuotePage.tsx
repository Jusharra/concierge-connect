import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import QuoteForm from "@/components/forms/QuoteForm";
import { PHONE_HREF, PHONE_NUMBER, SITE_NAME } from "@/lib/constants";

const QuotePage = () => (
  <Layout>
    <PageHead
      title={`Get a Quote | Private Jet, Yacht & Car | ${SITE_NAME}`}
      description="Request a quote for private jet charter, yacht charter or exotic car rental. Tell us your dates and route and get confirmed pricing."
      path="/quote"
    />
    <section className="pt-32 pb-24 bg-background">
      <div className="container-luxury max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Get a Quote</h1>
        <p className="text-lg text-foreground/70 leading-relaxed mb-10">
          Tell us about your trip in two short steps. We come back with confirmed options and pricing for your dates, usually within 24 hours.
        </p>
        <QuoteForm />
        <p className="mt-8 text-center text-muted-foreground">
          Prefer to talk it through?{" "}
          <a href={PHONE_HREF} className="text-gold hover-gold font-semibold">
            {PHONE_NUMBER}
          </a>
        </p>
      </div>
    </section>
  </Layout>
);

export default QuotePage;
