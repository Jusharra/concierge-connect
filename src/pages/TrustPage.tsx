import Layout from "@/components/layout/Layout";
import PageHead from "@/components/seo/PageHead";
import { DATA } from "@/lib/catalog";
import { PHONE_HREF, PHONE_NUMBER, EMAIL, SITE_NAME } from "@/lib/constants";

/**
 * Trust & Compliance. Every disclosure and registration number on this page comes from Airtable
 * "Compliance Rules" rows whose Status is Live (data/compliance.json contains no text for any other
 * status). Nothing here is hardcoded legal text: to publish, edit the rule and set it to Live.
 */
const TrustPage = () => {
  const live = DATA.compliance.filter((r) => r.status === "Live" && r.fullText.trim());
  const assetName = (id: string) => DATA.assetTypes.find((a) => a.id === id)?.name;

  return (
    <Layout>
      <PageHead
        title={`Trust & Compliance | ${SITE_NAME}`}
        description={`How bookings work with ${SITE_NAME}, plus the disclosures and registrations that apply to our services.`}
        path="/trust"
      />
      <section className="pt-32 pb-24 bg-background">
        <div className="container-luxury max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Trust &amp; Compliance</h1>
          <p className="text-lg text-foreground/70 leading-relaxed mb-12">
            Clear terms before you pay. This page explains how bookings work and lists the disclosures and registration
            details that apply to our services.
          </p>

          <h2 className="text-2xl font-display font-semibold text-foreground mb-4">How bookings work</h2>
          <ul className="mb-12 space-y-3 text-muted-foreground leading-relaxed">
            <li>Aircraft, vessels and vehicles are owned and operated by independent operators. {SITE_NAME} does not own or operate them.</li>
            <li>Prices shown are starting-at figures. The operator confirms availability and your final price for your dates.</li>
            <li>When you reserve online you pay a deposit, which is our booking fee. The remaining balance is paid directly to the operator.</li>
            <li>The refund terms for a package are shown before you pay, and you acknowledge them at checkout.</li>
          </ul>

          <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Disclosures and registrations</h2>
          {live.length === 0 ? (
            <p className="mb-12 text-muted-foreground">
              Disclosures and registration details are published here as each one takes effect. If you have a question about a
              booking, please contact us before you pay.
            </p>
          ) : (
            <div className="mb-12 space-y-8">
              {live.map((r) => (
                <article key={r.id} className="luxury-card p-6">
                  <h3 className="heading-card text-foreground mb-1">{r.ruleName}</h3>
                  <p className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
                    {[r.jurisdiction, r.version && `Version ${r.version}`, r.effectiveDate && `Effective ${r.effectiveDate}`, r.appliesAssetTypeIds.map(assetName).filter(Boolean).join(", ")]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {r.registrationNumber && (
                    <p className="mb-4 text-sm text-foreground">
                      <span className="text-muted-foreground">Registration number: </span>
                      {r.registrationNumber}
                    </p>
                  )}
                  <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{r.fullText}</p>
                </article>
              ))}
            </div>
          )}

          <h2 className="text-2xl font-display font-semibold text-foreground mb-4">Questions</h2>
          <p className="text-muted-foreground">
            Call{" "}
            <a href={PHONE_HREF} className="text-gold hover-gold font-semibold">
              {PHONE_NUMBER}
            </a>{" "}
            or email{" "}
            <a href={`mailto:${EMAIL}`} className="text-gold hover-gold font-semibold">
              {EMAIL}
            </a>
            .
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default TrustPage;
