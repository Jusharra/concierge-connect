import { useParams, Link } from "react-router-dom";
import NotFound from "./NotFound";
import { motion } from "framer-motion";
import { MapPin, Phone, ChevronRight, Check, Shield } from "lucide-react";
import Layout from "@/components/layout/Layout";
import LeadForm from "@/components/ui/LeadForm";
import LocalSEOBlock from "@/components/offer/LocalSEOBlock";
import ComplianceDisclaimer from "@/components/offer/ComplianceDisclaimer";
import { CATEGORIES, SITE_NAME, PHONE_NUMBER, PHONE_HREF, Category, Offer } from "@/lib/constants";
import { getOfferImage } from "@/lib/offerImages";

// Category-specific hero images
import heroPrivateAir from "@/assets/hero-slide-air.jpg";
import heroYachts from "@/assets/hero-slide-yachts.jpg";
import heroCars from "@/assets/hero-slide-cars.jpg";
import heroProperties from "@/assets/hero-slide-properties.jpg";
import heroBusiness from "@/assets/category-business.jpg";
import PageHead from "@/components/seo/PageHead";

const categoryImages: Record<string, string> = {
  "private-air": heroPrivateAir,
  "yachts": heroYachts,
  "exotic-cars": heroCars,
  "properties": heroProperties,
  "business-acquisitions": heroBusiness,
};

// Default "How It Works" for offers without custom content
const defaultHowItWorks = [
  { step: "01", title: "Submit your request with dates and preferences" },
  { step: "02", title: "We verify availability with trusted partners" },
  { step: "03", title: "Receive confirmed pricing and options" },
  { step: "04", title: "Payment and execution occur directly with partners" }
];

// Default included access for categories without custom content
const defaultIncludedAccess: Record<string, string[]> = {
  "private-air": [
    "Private jet charter options",
    "Helicopter transfers",
    "Domestic and international routing",
    "Crew and ground coordination"
  ],
  "yachts": [
    "Day charters and extended voyages",
    "Motor yachts and sailing vessels",
    "Crewed and captained options",
    "Catering and event coordination"
  ],
  "exotic-cars": [
    "Supercar and luxury vehicle access",
    "Short-term and extended rentals",
    "Delivery and pickup service",
    "Insurance coordination"
  ],
  "properties": [
    "Luxury single-family homes",
    "Executive residences",
    "Vacation and second homes",
    "High-end condos and estates"
  ],
  "business-acquisitions": [
    "Seller-financed transitions",
    "Gradual ownership transfer",
    "Employee and customer continuity",
    "Operational improvement support"
  ]
};

// Properties specific "How It Works"
const propertiesHowItWorks = [
  { step: "01", title: "Submit a property access or transition inquiry" },
  { step: "02", title: "We assess alignment and terms fit" },
  { step: "03", title: "Structured arrangement is negotiated privately" },
  { step: "04", title: "Agreement executed directly between parties" }
];

// Business Acquisitions specific "How It Works"
const businessAcquisitionsHowItWorks = [
  { step: "01", title: "Request a confidential conversation" },
  { step: "02", title: "We assess fit and transition structure" },
  { step: "03", title: "Seller financing terms are negotiated" },
  { step: "04", title: "Ownership transitions with continuity focus" }
];

const OfferDetailPage = () => {
  const { categoryId, offerSlug } = useParams<{ categoryId: string; offerSlug: string }>();
  
  const category = CATEGORIES.find(cat => cat.id === categoryId) as Category | undefined;
  const offer = category?.offers.find(o => o.slug === offerSlug) as Offer | undefined;

  if (!category || !offer) {
    return <NotFound />;
  }

  const heroImage = getOfferImage(offer.slug) || categoryImages[category.id];
  
  // Use SEO content if available, otherwise fallback
  const metaTitle = offer.seo?.metaTitle || `${offer.title} | ${SITE_NAME}`;
  const metaDescription = offer.seo?.metaDescription || 
    `Request exclusive access to ${category.name.toLowerCase()} in ${offer.city}. Verified partners, discreet coordination.`;
  const h1 = offer.seo?.h1 || offer.title;
  const subheading = offer.seo?.subheading || category.description;
  const pageCopy = offer.pageCopy || [];
  const includedAccess = offer.includedAccess || defaultIncludedAccess[category.id] || [];
  const howItWorks = offer.howItWorks || (category.id === "properties" ? propertiesHowItWorks : (category.id === "business-acquisitions" ? businessAcquisitionsHowItWorks : defaultHowItWorks));
  const nearbyAreas = offer.nearbyAreas || [];
  
  return (
    <Layout>
      <PageHead
        title={metaTitle}
        description={metaDescription}
        path={`/${category.id}/${offer.slug}`}
      />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroImage}
            alt={h1}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 pt-32 pb-16">
          <div className="max-w-3xl">
            {/* Breadcrumb */}
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
            >
              <Link to="/" className="hover:text-primary transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to={category.href} className="hover:text-primary transition-colors">{category.name}</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{offer.city}</span>
            </motion.nav>

            {/* Location Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-primary text-sm mb-6"
            >
              <MapPin className="w-4 h-4" />
              {offer.city}
            </motion.div>

            {/* H1 - Only one per page */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-4"
            >
              {h1}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl"
            >
              {subheading}
            </motion.p>

            {/* Hero CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a
                href="#request-form"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                {category.id === "properties" 
                  ? "Request Property Access" 
                  : category.id === "business-acquisitions" 
                    ? "Request a Private Discussion" 
                    : "Request Private Access"}
              </a>
              <a
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border bg-background/50 backdrop-blur-sm text-foreground font-semibold rounded-lg hover:bg-muted transition-colors"
              >
                <Phone className="w-5 h-5" />
                Call Concierge
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Trust & Positioning Block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-muted/30 rounded-lg p-6 border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                  <h2 className="text-xl font-display font-semibold text-foreground">
                    {category.id === "properties"
                      ? "Private, Terms-Based Property Access"
                      : category.id === "business-acquisitions" 
                        ? "Private, Off-Market Acquisitions" 
                        : "Why Clients Use Concierge Access Instead of Public Marketplaces"}
                  </h2>
                </div>
                <div className="space-y-3 text-muted-foreground">
                  {category.id === "properties" ? (
                    <>
                      <p>We work privately with property owners and qualified buyers to create structured, terms-based arrangements that allow homes to be occupied, controlled, and ultimately purchased over time — without relying solely on traditional bank financing.</p>
                      <p className="font-medium text-foreground">This model is ideal for:</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {["Owners seeking income or gradual exit", "Buyers seeking access without full financing", "Control without immediate ownership transfer", "Time-based purchase paths"].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm italic pt-2">Not a brokerage. Not a landlord. Control and placement.</p>
                    </>
                  ) : category.id === "business-acquisitions" ? (
                    <>
                      <p>We are not a brokerage service and do not solicit public bids. We work directly with owners seeking quiet, seller-financed transitions.</p>
                      <p className="font-medium text-foreground">Our model prioritizes:</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {["Seller financing only", "Employee & customer continuity", "Gradual ownership transitions", "No public listings"].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm italic pt-2">Principal buyer. Structured intermediary. Aligned capital partners.</p>
                    </>
                  ) : (
                    <>
                      <p>We do not list inventory publicly. We coordinate access through verified operators and partners based on your city, timing, and preferences.</p>
                      <p className="font-medium text-foreground">This ensures:</p>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {["Discretion", "Priority access", "Accurate availability", "Serious counterparties only"].map((item) => (
                          <li key={item} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="text-sm italic pt-2">No browsing. No spam. No wasted time.</p>
                    </>
                  )}
                </div>
              </motion.div>

              {/* Page Copy - City-specific content */}
              {pageCopy.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="space-y-4"
                >
                  {pageCopy.map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </motion.div>
              )}

              {/* What's Included */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                  {category.id === "business-acquisitions" 
                    ? "Ideal Businesses" 
                    : category.id === "properties" 
                      ? "Properties We Work With"
                      : `Included ${category.name} Access`}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {includedAccess.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Who This Is For - Properties Only */}
              {category.id === "properties" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                    Who This Is For
                  </h2>
                  <ul className="grid sm:grid-cols-2 gap-3">
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Owners open to flexible sale structures</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">Buyers seeking rent-to-own or delayed cash-out options</span>
                    </li>
                  </ul>
                </motion.div>
              )}

              {/* How It Works */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                  How Concierge Access Works
                </h2>
                <div className="space-y-4">
                  {howItWorks.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-sm">
                        {step.step}
                      </span>
                      <p className="text-muted-foreground pt-2">{step.title}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Local SEO Block */}
              {nearbyAreas.length > 0 && (
                <LocalSEOBlock city={offer.city} nearbyAreas={nearbyAreas} />
              )}

              {/* Back Link */}
              <Link
                to={category.href}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                View all {category.name} locations
              </Link>
            </div>

            {/* Right Column - Form */}
            <div className="lg:col-span-1">
              <div id="request-form" className="sticky top-24 space-y-6">
                <div className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                    {category.id === "properties"
                      ? "Explore Property Access"
                      : category.id === "business-acquisitions" 
                        ? "Start a Confidential Review" 
                        : "Request Private Access"}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    {category.id === "properties"
                      ? "Explore whether a structured property arrangement is right for you."
                      : category.id === "business-acquisitions" 
                        ? "Share your situation and we'll begin a private conversation."
                        : "Share your requirements and we'll coordinate verified access."}
                  </p>
                  <LeadForm
                    category={category.name}
                    offer={offer.title}
                    offerCity={offer.city}
                    variant="hero"
                  />
                </div>

                {/* Phone Card */}
                <div className="bg-muted/30 border border-border/50 rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-2">Prefer to speak directly?</p>
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    {PHONE_NUMBER}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Compliance Disclaimer */}
          <ComplianceDisclaimer />
        </div>
      </section>
    </Layout>
  );
};

export default OfferDetailPage;
