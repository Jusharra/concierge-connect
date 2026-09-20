import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { SITE_NAME, EMAIL } from "@/lib/constants";
import { SITE_URL } from "@/config/site";
import PageHead from "@/components/seo/PageHead";

const TermsPage = () => {
  return (
    <Layout>
      <PageHead
        title={`Terms of Service | ${SITE_NAME}`}
        description={`Partnership Policy Terms and Conditions for ${SITE_NAME}, a product of CommuniTee.`}
        path="/terms"
      />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-black via-obsidian to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest text-gold uppercase bg-gold/10 rounded-full border border-gold/20">
              Legal
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Terms of Service</h1>
            <p className="text-champagne-muted">Partnership Policy Terms and Conditions</p>
            <p className="text-sm text-muted-foreground mt-4">Last Updated: January 2025</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            {/* Important Notice */}
            <div className="mb-12 p-6 bg-gold/5 border border-gold/20 rounded-lg">
              <h2 className="text-xl font-display font-bold text-gold mb-4">IMPORTANT</h2>
              <p className="text-champagne-muted leading-relaxed">
                Please read these Partnership Policy (the "Terms") before using this website or any of our services.
                These Terms governs to all site visitors to or users of {SITE_NAME}, website located at{" "}
                <a href={SITE_URL} className="text-gold hover:text-gold-light transition-colors">
                  {SITE_URL}
                </a>{" "}
                or any other sites operated by {SITE_NAME} (jointly, the "Web site"). By accessing this Web site,
                you accept be bound by these Terms. If you do not accept the Terms of this Contract, please do leave
                this website now.
              </p>
              <p className="text-champagne-muted leading-relaxed mt-4">
                {SITE_NAME} (or "we," "us" or "our") reserves the right to change these Terms, in whole or partly,
                at our sole discretion, as we might not provide you with notification of such changes. You must always
                check these Terms as often as possible before you access our website. Your access of this website
                following the changes to these Terms will means that you approve those changes.
              </p>
              <p className="text-gold font-semibold mt-6 text-sm">
                Using Our Website Or Services Means You Have Read, Understood And Accept All Of The Terms And Conditions
                Stated Herein.
              </p>
            </div>

            {/* Terms Sections */}
            <div className="space-y-10">
              {/* Section 1 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">1. Overview</h3>
                <p className="text-champagne-muted leading-relaxed">
                  This website offers deals to its users and the services will be fulfilled by our partners on this
                  website. The main transaction is between our partners and our users. We are a mere passive conduit of
                  the transaction between our partner and our users. We are not liable as a result of the service
                  engagement between the user and our partners.
                </p>
              </div>

              {/* Section 2 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">2. Using this Website</h3>
                <p className="text-champagne-muted leading-relaxed">
                  You understand and agree that you are solely responsible for compliance with any and all laws, rules
                  and regulations that may apply to your use of our website and services. You also agree to submit to
                  all of our policies that are made from time to time. Rules and policies we published from time to time
                  shall form part to this terms and conditions.
                </p>
              </div>

              {/* Section 3 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">3. Availability</h3>
                <p className="text-champagne-muted leading-relaxed">
                  Our services are available only to legal entities and persons who are at least eighteen (18) years old
                  and are otherwise capable of forming legally binding contracts under applicable law. Users below 18
                  may use our services provided that there's an express approval from their parent or guardian.
                </p>
              </div>

              {/* Section 4 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">4. Account Registration</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  Certain portions or access to our website is available only to registered users. You may be required
                  to register with us in order to access certain areas of the Website. With respect to any registration,
                  we may refuse to grant you, and you may not use, a user name or email address that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-champagne-muted ml-4">
                  <li>belongs to or is already being used by another person;</li>
                  <li>may be construed as impersonating another person;</li>
                  <li>violates the intellectual property or other rights of any person;</li>
                  <li>is offensive; or</li>
                  <li>we reject for any other reason in our sole discretion.</li>
                </ul>
              </div>

              {/* Section 5 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">5. Your Account</h3>
                <p className="text-champagne-muted leading-relaxed">
                  You are responsible for maintaining confidentiality of your password that you use to access our
                  website. You agree not to transfer your password or user name, or lend or otherwise transfer your use
                  of or access to this website, to any third party. You are fully responsible for all Transactions
                  (including any information transmitted in connection with any Transactions) and other interactions
                  with the Website that occurs in connection with your account or username. You agree to immediately
                  notify us of any unauthorized use of your password or username or any other breach of security related
                  to your account, your username or the Website. You also agree that you will "log off" and exit from
                  your account with the Website (if applicable) at the end of each session. We are not liable for any
                  loss or damage arising from your failure to comply with any of these obligations.
                </p>
              </div>

              {/* Section 6 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">6. Rules of Conduct</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  We expect users of the Website to respect the law as well as the rights and dignity of others. While
                  using this website, you agree to comply with all relevant laws, policies and guidelines. The use of
                  this website is conditioned on your compliance with the rules of conduct listed below. Your failure to
                  adhere to these rules of conduct could result in either suspension of your account with us. You agree
                  that you will not post, transmit, rearrange, upload, or advertise any kind of communications or
                  interactions, web content or materials that:
                </p>
                <ul className="list-disc list-inside space-y-2 text-champagne-muted ml-4">
                  <li>
                    contains corrupt files, or viruses with the intent to harm another computer, system or machine
                  </li>
                  <li>
                    are unlawful, harmful, pestering, violent, libelous, intrusive of personal privacy, repulsive,
                    vulgar, obscene, despiteful, profane, indecent, racially or ethnically bad, or otherwise
                    objectionable;
                  </li>
                  <li>contain chain letters or pyramid schemes;</li>
                  <li>
                    include any type of unsolicited advertising and marketing or various other forms of solicitation to
                    other individuals or entities;
                  </li>
                  <li>
                    impersonate any person, organization or entity, including our company and our workers, consultants
                    and agents;
                  </li>
                  <li>post any tobacco, cannabis, alcohol or any illegal products;</li>
                  <li>encourage conduct that would constitute criminal offence; or</li>
                  <li>violates any law.</li>
                </ul>
              </div>

              {/* Section 7 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">7. Release</h3>
                <p className="text-champagne-muted leading-relaxed">
                  You hereby grant {SITE_NAME} permission to use any and all of the uploaded photographs, videos,
                  or material to be posted on this website without any payment or any other consideration. You hereby
                  waive any right to royalties or other compensation arising or related to the use of the photograph,
                  videos or materials. You also warrant that you own all submitted or uploaded photographs, videos or
                  materials or have authority to do so.
                </p>
              </div>

              {/* Section 8 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">
                  8. Transaction Between Partner and User
                </h3>
                <div className="space-y-4 text-champagne-muted">
                  <p>
                    <strong className="text-champagne">a. Relationship.</strong> You hereby agree that all our partner
                    (who offers services on this website) are independent contractors and are fully responsible for
                    their own taxes to their local agency with regard to their activity. They are also solely
                    responsible for informing their local authorities with regard to their business.
                  </p>
                  <p>
                    <strong className="text-champagne">b. Photos, Videos and Content.</strong> All photos, videos and/or
                    content posted on this website by our partner are not owned by us but rather they are the property
                    of our partner. Thus, Partner shall be fully responsible over the content posted on this website.
                  </p>
                  <p>
                    <strong className="text-champagne">c. Transactions.</strong> The transaction is between the user and
                    the partner and we are mere a passive conduit between their transaction. Users are advised to
                    observed proper diligence in dealing with our partner. We are not liable after the service is
                    transferred to the Partner.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">9. Customers</h3>
                <p className="text-champagne-muted leading-relaxed">
                  Customers agrees to communicate with Partner through this website or through allowable communications
                  means. The transactions between Partner and customers are between them and we are not party to their
                  transaction. You agree that we are a mere passive conduit with regard to the transaction. You agree to
                  observe proper diligence in providing research and background checks before engagement.
                </p>
              </div>

              {/* Section 10 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">
                  10. Transactions between Partner and Customers
                </h3>
                <p className="text-champagne-muted leading-relaxed">
                  You understand that we are not a party to, or have no involvement or interest in, make no
                  representations or warranties as to, and have no responsibility or liability with respect to any
                  communications, transactions, interactions, disputes or any relations whatsoever between Customers and
                  Partner. You agree that we are not responsible or held us accountable for any transaction between
                  Partner and Customers. You must conduct any necessary, appropriate, prudent or judicious
                  investigation, inquiry, research or due diligence with respect to your interactions with others.
                </p>
              </div>

              {/* Section 11 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">11. Fees</h3>
                <p className="text-champagne-muted leading-relaxed">
                  We will be get paid for the work by connecting the customer and partners only. Our work has been
                  completed after connecting customers and partners and therefore no refund will be given. Customer must
                  go to the connected partner that provided the services for any disputes.
                </p>
              </div>

              {/* Section 12 - Disclaimer */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">12. Disclaimer</h3>
                <div className="p-4 bg-muted/30 border border-border rounded-lg">
                  <p className="text-champagne-muted text-sm leading-relaxed font-mono">
                    THE WEBSITE, THE MATERIALS, THE CONTENT AND THE RELATED SERVICES AND PRODUCTS ARE PROVIDED "AS IS"
                    AND "AS AVAILABLE." WE DISCLAIM ANY REPRESENTATIONS OR WARRANTIES REGARDING THE WEBSITE, THE
                    MATERIALS, THE CONTENT AND THE RELATED SERVICES AND PRODUCTS, WHETHER EXPRESS OR IMPLIED, INCLUDING
                    BUT NOT LIMITED TO, THOSE OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE AND
                    NON-INFRINGEMENT. WE MAKE NO REPRESENTATION OR WARRANTY AS TO THE ACCURACY, RELIABILITY, TIMELINESS
                    OR COMPLETENESS OF ANY MATERIAL ON OR ACCESSIBLE THROUGH THE WEBSITE. ANY RELIANCE ON OR USE OF
                    THESE MATERIALS IS AT YOUR SOLE RISK. WE MAKE NO REPRESENTATION OR WARRANTY: REGARDING THE
                    STATEMENTS, ACTS OR OMISSIONS OF COMMUNITEE OR OUR EMPLOYEES OR AGENTS; THAT WEBSITE WILL BE
                    AVAILABLE ON A TIMELY BASIS, OR THAT ACCESS TO THE WEBSITE WILL BE UNINTERRUPTED, ERROR FREE OR
                    SECURE; THAT DEFECTS OR ERRORS WILL BE CORRECTED; THAT USE OF THE WEBSITE WILL PROVIDE SPECIFIC
                    RESULTS; OR THAT THE WEBSITE OR THE SERVERS OR NETWORKS THROUGH WHICH THE WEBSITE ARE MADE AVAILABLE
                    ARE SECURE OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. APPLICABLE LAW MAY NOT ALLOW THE
                    EXCLUSION OF IMPLIED WARRANTIES, SO THE ABOVE EXCLUSION MAY NOT APPLY TO YOU.
                  </p>
                </div>
              </div>

              {/* Section 13 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">13. Entire Agreement</h3>
                <p className="text-champagne-muted leading-relaxed">
                  This Terms of Service constitutes the entire agreement and understanding between CommuniTee and You
                  regarding this website and the use of our services and supersedes any and all prior oral or written
                  understandings or agreements between CommuniTee and you regarding the use, viewing this website,
                  services and content.
                </p>
              </div>

              {/* Section 14 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">14. Changes</h3>
                <p className="text-champagne-muted leading-relaxed">
                  {SITE_NAME} reserves the right, at its sole discretion, to modify the Services or to modify these
                  Terms at any time and without prior notice. If we modify these Terms, we will either post the
                  modification on this website otherwise provide you with notice of the modification (for registered
                  users only). By continuing to access or use this website after we have posted a modification on
                  website or have provided you with notice of a modification, you are indicating that you agree to be
                  bound by the modified Terms. If the modified Terms are not acceptable to you, your only recourse is to
                  cease using this website and our services.
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-16 p-6 bg-card border border-border rounded-lg text-center">
              <h3 className="text-lg font-display font-bold text-champagne mb-2">Questions About These Terms?</h3>
              <p className="text-champagne-muted mb-4">
                Contact us at{" "}
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-gold hover:text-gold-light transition-colors"
                >
                  {EMAIL}
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default TermsPage;
