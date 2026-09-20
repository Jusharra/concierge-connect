import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { SITE_NAME, CATEGORIES } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

// Import category images
import categoryAir from "@/assets/category-private-air.jpg";
import categoryYachts from "@/assets/category-yachts.jpg";
import categoryCars from "@/assets/category-exotic-cars.jpg";
import categoryProperties from "@/assets/category-properties.jpg";
import categoryBusiness from "@/assets/category-business.jpg";
import PageHead from "@/components/seo/PageHead";

const categoryImages: Record<string, string> = {
  "private-air": categoryAir,
  "yachts": categoryYachts,
  "exotic-cars": categoryCars,
  "properties": categoryProperties,
  "business-acquisitions": categoryBusiness,
};

const AccessPage = () => {
  return (
    <>
      <PageHead
        title={`Access | ${SITE_NAME}`}
        description="Private access to luxury experiences: private jets, yachts, exotic cars, off-market properties, and business acquisitions. Curated for discerning clients."
        path="/access"
      />

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
                Private Access
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 leading-relaxed">
                Book private jets, yachts and exotic cars, or request a quote, with verified operators. 
                Select a category to explore available services.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories Grid */}
        <section className="py-16 md:py-24 bg-background">
          <div className="container-luxury">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={category.href}
                    className="group block relative aspect-[4/5] overflow-hidden rounded-lg"
                  >
                    {/* Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                      style={{ backgroundImage: `url(${categoryImages[category.id]})` }}
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-90" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                      <span className="text-gold text-sm font-medium tracking-wider uppercase mb-2">
                        {category.tagline}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3">
                        {category.name}
                      </h2>
                      <p className="text-foreground/70 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center gap-2 text-gold font-medium text-sm group-hover:gap-3 transition-all">
                        <span>Explore {category.offers.length} Locations</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 md:py-24 bg-muted/30 border-y border-border/30">
          <div className="container-luxury">
            <SectionHeading
              title="How Access Works"
              description="A discreet, streamlined process from inquiry to experience"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-12">
              {[
                { step: "01", title: "Select", description: "Choose your category and destination" },
                { step: "02", title: "Request", description: "Submit your requirements confidentially" },
                { step: "03", title: "Confirmation", description: "Availability and pricing are confirmed with the operator" },
                { step: "04", title: "Experience", description: "Enjoy seamless luxury access" },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  className="text-center"
                >
                  <span className="text-gold text-4xl font-serif font-semibold">{item.step}</span>
                  <h3 className="text-lg font-semibold mt-3 mb-2">{item.title}</h3>
                  <p className="text-foreground/60 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default AccessPage;
