import { useParams, Navigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { MapPin, Phone, ArrowLeft, Check } from "lucide-react";
import Layout from "@/components/layout/Layout";
import LeadForm from "@/components/ui/LeadForm";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, CATEGORIES } from "@/lib/constants";
import { getOfferImage } from "@/lib/offerImages";

// Import category images as fallback
import privateAirImage from "@/assets/category-private-air.jpg";
import yachtsImage from "@/assets/category-yachts.jpg";
import exoticCarsImage from "@/assets/category-exotic-cars.jpg";
import propertiesImage from "@/assets/category-properties.jpg";
import businessImage from "@/assets/category-business.jpg";

const categoryImages: Record<string, string> = {
  "private-air": privateAirImage,
  "yachts": yachtsImage,
  "exotic-cars": exoticCarsImage,
  "properties": propertiesImage,
  "business-acquisitions": businessImage,
};

const howAccessWorks = [
  {
    step: "01",
    title: "Submit Your Request",
    description: "Complete the form below with your requirements. Include preferred dates, group size, and any specific preferences."
  },
  {
    step: "02", 
    title: "Concierge Review",
    description: "Our team reviews your request and verifies details. We'll reach out within 24 hours to discuss specifics."
  },
  {
    step: "03",
    title: "Partner Coordination",
    description: "We connect you with our vetted partners who match your exact requirements and standards."
  },
  {
    step: "04",
    title: "Seamless Booking",
    description: "Finalize details directly with our partner. Payment is handled off-site for maximum privacy and flexibility."
  },
];

const OfferDetailPage = () => {
  const { categoryId, offerSlug } = useParams<{ categoryId: string; offerSlug: string }>();
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  const offer = category?.offers.find(o => o.slug === offerSlug);
  
  if (!category || !offer) {
    return <Navigate to="/404" replace />;
  }

  // Use offer-specific image if available, fallback to category image
  const heroImage = getOfferImage(offer.slug) || categoryImages[category.id];

  // Generate SEO-friendly description
  const seoDescription = `Request exclusive ${offer.title.toLowerCase()} access through our verified partner network. Concierge service, complete discretion, ${offer.city}.`;

  return (
    <>
      <Helmet>
        <title>{offer.title} | {SITE_NAME} - {offer.city}</title>
        <meta name="description" content={seoDescription} />
        <meta property="og:title" content={`${offer.title} | ${SITE_NAME}`} />
        <meta property="og:description" content={seoDescription} />
        <link rel="canonical" href={`${category.href}/${offer.slug}`} />
      </Helmet>

      <Layout>
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-end overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={`${offer.title} - ${offer.city}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/60 to-obsidian/20" />
          </div>

          <div className="relative container-luxury py-16 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm mb-6">
                <Link to="/" className="text-muted-foreground hover:text-gold transition-colors">
                  Home
                </Link>
                <span className="text-muted-foreground">/</span>
                <Link to={category.href} className="text-muted-foreground hover:text-gold transition-colors">
                  {category.name}
                </Link>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground">{offer.city}</span>
              </nav>

              {/* Location badge */}
              <div className="flex items-center gap-2 text-gold text-sm mb-4">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{offer.city}</span>
              </div>

              <h1 className="heading-display text-foreground mb-6">{offer.title}</h1>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#request-access" className="luxury-btn-primary">
                  Request Access
                </a>
                <a href={PHONE_HREF} className="luxury-btn-outline">
                  <Phone className="w-5 h-5" />
                  Call Concierge
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <section className="section-padding bg-gradient-dark">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Content Column */}
              <div className="lg:col-span-2 space-y-12">
                {/* What This Offer Is */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="heading-section text-foreground mb-6">
                    About This Access
                  </h2>
                  <div className="prose prose-invert max-w-none">
                    <p className="body-large mb-4">
                      Experience exclusive {category.name.toLowerCase()} access in {offer.city} through our curated network of 
                      verified partners. This isn't a traditional rental or booking service—it's concierge-level access to 
                      opportunities typically reserved for an elite clientele.
                    </p>
                    <p className="body-regular mb-4">
                      Our {offer.city} {category.name.toLowerCase()} partners maintain the highest standards in the industry. 
                      Each has been personally vetted by our team and consistently delivers experiences that exceed expectations.
                    </p>
                    <p className="body-regular">
                      Whether this is your first inquiry or you're a returning client, our concierge team treats every 
                      request with the same attention to detail and commitment to discretion.
                    </p>
                  </div>
                </motion.div>

                {/* How Access Works */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="heading-section text-foreground mb-8">
                    How Access Works
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {howAccessWorks.map((item, index) => (
                      <div 
                        key={item.step}
                        className="luxury-card p-6"
                      >
                        <span className="text-3xl font-serif text-gold/30 mb-2 block">
                          {item.step}
                        </span>
                        <h3 className="heading-card text-foreground mb-2">{item.title}</h3>
                        <p className="body-regular">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* What's Included */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="heading-section text-foreground mb-6">
                    What to Expect
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      "Dedicated concierge support",
                      "Verified partner network",
                      "Complete discretion guaranteed",
                      "Flexible scheduling options",
                      "Customized experience",
                      "24/7 availability",
                      "No hidden fees",
                      "Premium quality assured",
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-gradient-gold flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <span className="text-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Back to Category */}
                <Link 
                  to={category.href}
                  className="inline-flex items-center gap-2 text-gold hover-gold"
                >
                  <ArrowLeft className="w-4 h-4" />
                  View all {category.name} offers
                </Link>
              </div>

              {/* Form Column */}
              <div className="lg:col-span-1">
                <div id="request-access" className="sticky top-28">
                  <LeadForm 
                    category={category.name}
                    offer={offer.title}
                    offerCity={offer.city}
                    variant="hero"
                  />

                  {/* Call Option */}
                  <div className="mt-6 p-6 luxury-card text-center">
                    <p className="text-sm text-muted-foreground mb-2">Prefer to speak directly?</p>
                    <a href={PHONE_HREF} className="text-xl font-serif text-gold hover-gold block">
                      {PHONE_NUMBER}
                    </a>
                    <p className="text-xs text-muted-foreground mt-2">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default OfferDetailPage;
