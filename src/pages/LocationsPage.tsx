import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_NAME, CATEGORIES } from "@/lib/constants";
import { MapPin, ArrowRight } from "lucide-react";

// Build unique locations from all offers
const getLocationsWithOffers = () => {
  const locationMap = new Map<string, { city: string; offers: { category: string; categoryId: string; slug: string; title: string }[] }>();
  
  CATEGORIES.forEach(category => {
    category.offers.forEach(offer => {
      const existing = locationMap.get(offer.city) || { city: offer.city, offers: [] };
      existing.offers.push({
        category: category.name,
        categoryId: category.id,
        slug: offer.slug,
        title: offer.title,
      });
      locationMap.set(offer.city, existing);
    });
  });
  
  return Array.from(locationMap.values()).sort((a, b) => b.offers.length - a.offers.length);
};

const locations = getLocationsWithOffers();

// Featured locations for hero cards
const featuredCities = ["Miami", "Los Angeles", "New York", "Monaco", "London"];

const LocationsPage = () => {
  const featured = locations.filter(loc => featuredCities.includes(loc.city));
  const others = locations.filter(loc => !featuredCities.includes(loc.city));

  return (
    <>
      <Helmet>
        <title>Locations | {SITE_NAME}</title>
        <meta 
          name="description" 
          content="Global luxury access in Miami, Los Angeles, New York, Monaco, London, and beyond. Private jets, yachts, exotic cars, and properties in the world's most prestigious destinations." 
        />
        <link rel="canonical" href="/locations" />
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold mb-6">
                Global Presence
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                We coordinate luxury experiences across the world's most coveted destinations. 
                From coastal retreats to metropolitan capitals.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Locations */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container-luxury">
            <SectionHeading
              title="Featured Destinations"
              description="Primary markets with full-service access"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {featured.map((location, index) => (
                <motion.div
                  key={location.city}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group p-6 md:p-8 bg-muted/30 border border-border/30 rounded-lg hover:border-gold/30 transition-colors"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-gold/10 rounded-lg">
                      <MapPin className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-serif font-semibold text-foreground">
                        {location.city}
                      </h2>
                      <p className="text-foreground/60 text-sm">
                        {location.offers.length} {location.offers.length === 1 ? 'service' : 'services'} available
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-6">
                    {location.offers.slice(0, 3).map((offer, i) => (
                      <Link
                        key={i}
                        to={`/${offer.categoryId}/${offer.slug}`}
                        className="flex items-center justify-between py-2 px-3 rounded bg-background/50 hover:bg-background transition-colors text-sm"
                      >
                        <span className="text-foreground/80">{offer.category}</span>
                        <ArrowRight className="w-4 h-4 text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                    {location.offers.length > 3 && (
                      <p className="text-foreground/50 text-xs pl-3">
                        +{location.offers.length - 3} more services
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Other Locations */}
        {others.length > 0 && (
          <section className="py-16 md:py-24 bg-muted/30 border-y border-border/30">
            <div className="container-luxury">
              <SectionHeading
                title="Additional Destinations"
                description="Expanding network of verified partners"
              />
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12">
                {others.map((location, index) => (
                  <motion.div
                    key={location.city}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
                    className="p-4 bg-background border border-border/30 rounded-lg text-center hover:border-gold/30 transition-colors"
                  >
                    <MapPin className="w-5 h-5 text-gold mx-auto mb-2" />
                    <h3 className="font-medium text-foreground">{location.city}</h3>
                    <p className="text-foreground/50 text-xs mt-1">
                      {location.offers.length} {location.offers.length === 1 ? 'service' : 'services'}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container-luxury text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-4">
                Don't See Your Destination?
              </h2>
              <p className="text-foreground/70 mb-8 max-w-lg mx-auto">
                Our network extends beyond listed locations. Contact our concierge team for arrangements in any destination worldwide.
              </p>
              <Link
                to="/contact"
                className="luxury-btn-primary inline-flex items-center gap-2"
              >
                Contact Concierge
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default LocationsPage;
