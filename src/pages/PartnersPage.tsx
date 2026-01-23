import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, EMAIL } from "@/lib/constants";
import { Shield, Users, TrendingUp, Phone, Mail, ArrowRight } from "lucide-react";

const PartnersPage = () => {
  return (
    <>
      <Helmet>
        <title>Partners | {SITE_NAME}</title>
        <meta 
          name="description" 
          content="Partner with Luxe Concierge. We represent verified buyers and coordinate bookings for private aviation, yachts, exotic cars, properties, and business acquisitions." 
        />
        <link rel="canonical" href="/partners" />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="pt-32 pb-16 bg-background">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="text-gold text-sm font-medium tracking-wider uppercase mb-4 block">
                Partner Network
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
                Join Our Network
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                We represent serious buyers and coordinate verified bookings. 
                Partner with us to access qualified, high-net-worth clientele.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Who We Work With */}
        <section className="py-16 md:py-24 bg-muted/30 border-y border-border/30">
          <div className="container-luxury">
            <SectionHeading
              title="Who We Work With"
              description="Verified partners across luxury verticals"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[
                {
                  title: "Asset Owners",
                  description: "Private jet operators, yacht owners, exotic car collections, and property owners seeking qualified renters and buyers.",
                  items: ["Aircraft operators", "Yacht management", "Luxury vehicle fleets", "Property developers"],
                },
                {
                  title: "Operators & Brokers",
                  description: "Licensed brokers and operators looking to expand their client base through verified referrals.",
                  items: ["Charter brokers", "Real estate agents", "M&A advisors", "Concierge services"],
                },
                {
                  title: "Affiliates",
                  description: "Content creators, wealth managers, and lifestyle brands with high-net-worth audiences.",
                  items: ["Wealth advisors", "Family offices", "Lifestyle influencers", "Luxury brands"],
                },
              ].map((partner, index) => (
                <motion.div
                  key={partner.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 md:p-8 bg-background border border-border/30 rounded-lg"
                >
                  <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                    {partner.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-4">
                    {partner.description}
                  </p>
                  <ul className="space-y-2">
                    {partner.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-foreground/60 text-sm">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Partner */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container-luxury">
            <SectionHeading
              title="Why Partner With Us"
              description="A streamlined approach to qualified referrals"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {[
                {
                  icon: Users,
                  title: "Qualified Leads",
                  description: "Every inquiry is pre-screened. We only connect you with serious, verified clients ready to transact.",
                },
                {
                  icon: Shield,
                  title: "Complete Discretion",
                  description: "Confidentiality is paramount. All client information and transactions are handled with absolute privacy.",
                },
                {
                  icon: TrendingUp,
                  title: "Growth Focused",
                  description: "Scale your business through consistent referrals without marketing overhead or platform fees.",
                },
              ].map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 bg-gold/10 rounded-lg mb-4">
                    <benefit.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-foreground/60 text-sm">{benefit.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 md:py-24 bg-muted/30 border-y border-border/30">
          <div className="container-luxury">
            <div className="max-w-2xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                  Ready to Partner?
                </h2>
                <p className="text-foreground/70 mb-8">
                  Contact our partnership team to discuss collaboration opportunities. 
                  We respond to all serious inquiries within 24 hours.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                  <a
                    href={PHONE_HREF}
                    className="luxury-btn-primary inline-flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    {PHONE_NUMBER}
                  </a>
                  <a
                    href={`mailto:${EMAIL}`}
                    className="luxury-btn-outline inline-flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Email Partnership Team
                  </a>
                </div>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm font-medium"
                >
                  Or submit an inquiry form
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default PartnersPage;
