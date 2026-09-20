import { useParams, Link } from "react-router-dom";
import NotFound from "./NotFound";
import { bookableCategoryIds } from "@/lib/catalog";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import OfferCard from "@/components/ui/OfferCard";
import CityCard from "@/components/ui/CityCard";
import LeadForm from "@/components/ui/LeadForm";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, CATEGORIES } from "@/lib/constants";
import { getOfferImage } from "@/lib/offerImages";

// Import category images
import privateAirImage from "@/assets/category-private-air.jpg";
import yachtsImage from "@/assets/category-yachts.jpg";
import exoticCarsImage from "@/assets/category-exotic-cars.jpg";
import propertiesImage from "@/assets/category-properties.jpg";
import businessImage from "@/assets/category-business.jpg";
import PageHead from "@/components/seo/PageHead";

const categoryImages: Record<string, string> = {
  "private-air": privateAirImage,
  "yachts": yachtsImage,
  "exotic-cars": exoticCarsImage,
  "properties": propertiesImage,
  "business-acquisitions": businessImage,
};

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  
  const category = CATEGORIES.find(c => c.id === categoryId);
  
  if (!category) {
    return <NotFound />;
  }

  const heroImage = categoryImages[category.id];

  return (
    <>
      <PageHead
        title={`${category.name} | ${SITE_NAME} - Luxury ${category.name} Access`}
        description={`${category.description} Request private access through our verified partner network.`}
        path={category.href}
        image={heroImage}
      />

      <Layout>
        {/* Hero Section */}
        <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt={`${category.name} luxury services`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/30" />
          </div>

          <div className="relative container-luxury py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 text-sm text-gold hover-gold mb-6"
              >
                Home
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground">{category.name}</span>
              </Link>

              <h1 className="heading-display text-foreground mb-4">{category.name}</h1>
              <p className="text-gold text-lg font-medium mb-4">{category.tagline}</p>
              <p className="body-large mb-8">{category.description}</p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#offers" className="luxury-btn-primary">
                  View Offers
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a href={PHONE_HREF} className="luxury-btn-outline">
                  <Phone className="w-5 h-5" />
                  {PHONE_NUMBER}
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Offers Section */}
        <section id="offers" className="section-padding bg-gradient-dark">
          <div className="container-luxury">
            <SectionHeading
              label={category.id === "properties" ? "Markets" : category.id === "business-acquisitions" ? "Verticals" : "Available Access"}
              title={category.id === "properties" 
                ? "Explore Property Markets" 
                : category.id === "business-acquisitions"
                  ? "Business Transition Opportunities"
                  : `${category.name} by City`}
              description={category.id === "properties"
                ? "Private access to luxury homes through structured terms. Select a market to explore opportunities."
                : category.id === "business-acquisitions"
                  ? "Seller-financed transitions in established, owner-operated businesses. Select a vertical to learn more."
                  : "Select a location to learn more about our curated access in each market."}
            />

            <div className={`grid gap-6 ${
              category.id === "properties" || category.id === "business-acquisitions"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}>
              {category.offers.map((offer, index) => (
                category.id === "properties" || category.id === "business-acquisitions" ? (
                  <CityCard
                    key={offer.slug}
                    title={offer.title}
                    city={offer.city}
                    subtitle={offer.seo?.h1?.split(" in ")[0] || offer.seo?.h1?.split(" — ")[0]}
                    href={`${category.href}/${offer.slug}/`}
                    image={getOfferImage(offer.slug) || heroImage}
                    index={index}
                    variant={category.id === "business-acquisitions" ? "business" : "property"}
                  />
                ) : (
                  <OfferCard
                    key={offer.slug}
                    title={offer.title}
                    city={offer.city}
                    href={`${category.href}/${offer.slug}/`}
                    image={getOfferImage(offer.slug) || heroImage}
                    index={index}
                  />
                )
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="section-padding bg-charcoal">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block text-sm font-medium tracking-widest uppercase text-gold mb-4">
                  Get Started
                </span>
                <h2 className="heading-section text-foreground mb-4">
                  Request {category.name} Access
                </h2>
                <p className="body-large mb-6">
                  {bookableCategoryIds().includes(category.id)
                    ? `Tell us about your ${category.name.toLowerCase()} plans and we will come back with confirmed options and pricing. Reserve with a deposit where available, or request a quote.`
                    : `Submit your requirements and our concierge team will connect you with verified partners who can fulfill your ${category.name.toLowerCase()} needs.`}
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-foreground">Verified partner network</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-foreground">Response within 24 hours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-gold" />
                    <span className="text-foreground">Complete discretion guaranteed</span>
                  </div>
                </div>

                <div className="p-6 luxury-card">
                  <p className="text-sm text-muted-foreground mb-2">Prefer to speak directly?</p>
                  <a href={PHONE_HREF} className="text-2xl font-serif text-gold hover-gold">
                    {PHONE_NUMBER}
                  </a>
                </div>
              </motion.div>

              <LeadForm category={category.name} variant="hero" />
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default CategoryPage;
