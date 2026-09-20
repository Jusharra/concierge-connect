import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import Layout from "@/components/layout/Layout";
import LeadForm from "@/components/ui/LeadForm";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, EMAIL } from "@/lib/constants";
import PageHead from "@/components/seo/PageHead";

const ContactPage = () => {
  return (
    <>
      <PageHead
        title={`Contact | ${SITE_NAME} - Request Luxury Access`}
        description="Contact our concierge team for exclusive access to private jets, yachts, exotic cars, and luxury properties. Available 24/7 for your inquiries."
        path="/contact"
      />

      <Layout>
        {/* Hero Section */}
        <section className="section-padding bg-gradient-hero">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <span className="inline-block text-sm font-medium tracking-widest uppercase text-gold mb-6">
                Contact Us
              </span>
              <h1 className="heading-display text-foreground mb-4">
                Begin Your Journey
              </h1>
              <p className="body-large">
                Our concierge team is available around the clock to discuss your requirements 
                and connect you with verified partners.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-8"
              >
                {/* Direct Contact */}
                <div className="luxury-card p-8">
                  <h2 className="heading-card text-foreground mb-6">Direct Contact</h2>
                  <div className="space-y-6">
                    <a 
                      href={PHONE_HREF}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Call Concierge</p>
                        <p className="text-xl font-serif text-gold group-hover:text-gold-light transition-colors">
                          {PHONE_NUMBER}
                        </p>
                      </div>
                    </a>

                    <a 
                      href={`mailto:${EMAIL}`}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Email Us</p>
                        <p className="text-lg text-foreground group-hover:text-gold transition-colors">
                          {EMAIL}
                        </p>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Hours & Locations */}
                <div className="luxury-card p-8">
                  <h2 className="heading-card text-foreground mb-6">Availability</h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Hours</p>
                        <p className="text-foreground font-medium">24/7 Concierge Service</p>
                        <p className="text-sm text-muted-foreground">Always available for urgent requests</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Service Areas</p>
                        <p className="text-foreground font-medium">Global Coverage</p>
                        <p className="text-sm text-muted-foreground">
                          Primary hubs: Miami • Los Angeles • New York • Monaco
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="luxury-card p-8">
                  <h2 className="heading-card text-foreground mb-6">Our Commitment</h2>
                  <ul className="space-y-3">
                    {[
                      "Complete discretion on all inquiries",
                      "Verified, vetted partner network",
                      "Response within 24 hours",
                      "No obligation consultations",
                      "White-glove concierge service",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                        <span className="text-foreground text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <LeadForm variant="hero" />
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default ContactPage;
