import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SITE_NAME, EMAIL, PHONE_NUMBER } from "@/lib/constants";

const PrivacyPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Privacy Policy | {SITE_NAME}</title>
        <meta
          name="description"
          content="Privacy Policy for Lux Connoisseurs. Learn how we collect, use, and protect your personal information."
        />
      </Helmet>

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
              Privacy
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Privacy Policy</h1>
            <p className="text-champagne-muted">How we collect, use, and protect your information</p>
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
            {/* Introduction */}
            <div className="mb-12 p-6 bg-gold/5 border border-gold/20 rounded-lg">
              <p className="text-champagne-muted leading-relaxed">
                Lux Connoisseurs ("we," "us," or "our"), is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you visit our website{" "}
                <a href="https://luxconnoisseurs.com" className="text-gold hover:text-gold-light transition-colors">
                  https://luxconnoisseurs.com
                </a>{" "}
                or use our concierge services. Please read this privacy policy carefully. If you do not agree with the
                terms of this privacy policy, please do not access the site.
              </p>
            </div>

            {/* Privacy Sections */}
            <div className="space-y-10">
              {/* Section 1 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">1. Information We Collect</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  We collect information that you voluntarily provide to us when you express interest in obtaining
                  information about us or our services, when you participate in activities on the Website, or otherwise
                  when you contact us.
                </p>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  <strong className="text-champagne">Personal Information:</strong> The personal information we collect
                  may include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-champagne-muted ml-4">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>City of residence</li>
                  <li>Service preferences (category of interest)</li>
                  <li>Preferred dates for services</li>
                  <li>Additional notes or requirements you provide</li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">2. How We Use Your Information</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  We use the information we collect or receive:
                </p>
                <ul className="list-disc list-inside space-y-2 text-champagne-muted ml-4">
                  <li>To connect you with our verified luxury service partners</li>
                  <li>To facilitate the provision of concierge services you request</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To send you communications about our services (with your consent)</li>
                  <li>To improve our website and service offerings</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              {/* Section 3 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">3. Sharing Your Information</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside space-y-2 text-champagne-muted ml-4">
                  <li>
                    <strong className="text-champagne">With Service Partners:</strong> We share your inquiry details
                    with our verified luxury service partners who can fulfill your requested services. This is the
                    primary purpose of our concierge platform.
                  </li>
                  <li>
                    <strong className="text-champagne">With Third-Party Service Providers:</strong> We may share your
                    information with third-party vendors, service providers, contractors, or agents who perform services
                    for us or on our behalf, including data processing and workflow automation.
                  </li>
                  <li>
                    <strong className="text-champagne">Legal Obligations:</strong> We may disclose your information
                    where required to comply with applicable law, governmental requests, judicial proceedings, court
                    orders, or legal process.
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">4. Data Retention</h3>
                <p className="text-champagne-muted leading-relaxed">
                  We will only keep your personal information for as long as it is necessary for the purposes set out in
                  this privacy policy, unless a longer retention period is required or permitted by law. When we have no
                  ongoing legitimate business need to process your personal information, we will either delete or
                  anonymize it.
                </p>
              </div>

              {/* Section 5 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">5. Security of Your Information</h3>
                <p className="text-champagne-muted leading-relaxed">
                  We use administrative, technical, and physical security measures to help protect your personal
                  information. While we have taken reasonable steps to secure the personal information you provide to
                  us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no
                  method of data transmission can be guaranteed against any interception or other type of misuse.
                </p>
              </div>

              {/* Section 6 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">6. Cookies and Tracking Technologies</h3>
                <p className="text-champagne-muted leading-relaxed">
                  Our website may use cookies and similar tracking technologies to improve your browsing experience. We
                  use only essential cookies required for the website to function properly. We do not use tracking
                  cookies for advertising purposes. You can instruct your browser to refuse all cookies or to indicate
                  when a cookie is being sent.
                </p>
              </div>

              {/* Section 7 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">7. Your Privacy Rights</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-champagne-muted ml-4">
                  <li>
                    <strong className="text-champagne">Right to Access:</strong> You may request a copy of the personal
                    information we hold about you.
                  </li>
                  <li>
                    <strong className="text-champagne">Right to Rectification:</strong> You may request that we correct
                    any inaccurate or incomplete information.
                  </li>
                  <li>
                    <strong className="text-champagne">Right to Erasure:</strong> You may request that we delete your
                    personal information, subject to certain exceptions.
                  </li>
                  <li>
                    <strong className="text-champagne">Right to Withdraw Consent:</strong> If we rely on your consent to
                    process your personal information, you have the right to withdraw that consent at any time.
                  </li>
                </ul>
                <p className="text-champagne-muted leading-relaxed mt-4">
                  To exercise any of these rights, please contact us using the contact information provided below.
                </p>
              </div>

              {/* Section 8 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">8. Third-Party Websites</h3>
                <p className="text-champagne-muted leading-relaxed">
                  Our website may contain links to third-party websites and services that are not owned or controlled by
                  us. We are not responsible for the privacy practices of these third parties. We encourage you to
                  review the privacy policies of any third-party sites you visit.
                </p>
              </div>

              {/* Section 9 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">9. Children's Privacy</h3>
                <p className="text-champagne-muted leading-relaxed">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect
                  personal information from children under 18. If you are a parent or guardian and believe your child
                  has provided us with personal information, please contact us so that we can delete such information.
                </p>
              </div>

              {/* Section 10 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">10. Updates to This Policy</h3>
                <p className="text-champagne-muted leading-relaxed">
                  We may update this privacy policy from time to time. The updated version will be indicated by an
                  updated "Last Updated" date and the updated version will be effective as soon as it is accessible. We
                  encourage you to review this privacy policy frequently to be informed of how we are protecting your
                  information.
                </p>
              </div>

              {/* Section 11 */}
              <div className="legal-section">
                <h3 className="text-xl font-display font-bold text-gold mb-4">11. Contact Us</h3>
                <p className="text-champagne-muted leading-relaxed mb-4">
                  If you have questions or comments about this privacy policy, you may contact us at:
                </p>
                <div className="p-4 bg-card border border-border rounded-lg">
                  <p className="text-champagne font-semibold mb-2">Lux Connoisseurs</p>
                  <p className="text-champagne-muted mt-2">
                    Email:{" "}
                    <a href={`mailto:${EMAIL}`} className="text-gold hover:text-gold-light transition-colors">
                      {EMAIL}
                    </a>
                  </p>
                  <p className="text-champagne-muted">
                    Phone:{" "}
                    <a
                      href={`tel:${PHONE_NUMBER.replace(/\D/g, "")}`}
                      className="text-gold hover:text-gold-light transition-colors"
                    >
                      {PHONE_NUMBER}
                    </a>
                  </p>
                  <p className="text-champagne-muted">
                    Website:{" "}
                    <a href="https://luxconnoisseurs.com" className="text-gold hover:text-gold-light transition-colors">
                      https://luxconnoisseurs.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Related Links */}
            <div className="mt-16 p-6 bg-card border border-border rounded-lg text-center">
              <h3 className="text-lg font-display font-bold text-champagne mb-4">Related Legal Documents</h3>
              <Link to="/terms" className="inline-flex items-center text-gold hover:text-gold-light transition-colors">
                View Terms of Service →
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default PrivacyPage;
