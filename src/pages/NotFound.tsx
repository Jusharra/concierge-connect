import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, Home } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF } from "@/lib/constants";
import PageHead from "@/components/seo/PageHead";

const NotFound = () => {
  const location = useLocation();

  return (
    <>
      <PageHead
        title={`Page Not Found | ${SITE_NAME}`}
        description="The page you are looking for does not exist."
        path="/404"
        noindex
      />

      <Layout>
        <section className="min-h-[80vh] flex items-center justify-center section-padding bg-gradient-dark">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-xl mx-auto"
            >
              <span className="text-8xl font-serif font-bold text-gold/20 mb-4 block">
                404
              </span>
              <h1 className="heading-section text-foreground mb-4">
                Page Not Found
              </h1>
              <p className="body-large mb-8">
                The page you're looking for doesn't exist or has been moved. 
                Let us help you find what you're looking for.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/" className="luxury-btn-primary">
                  <Home className="w-5 h-5" />
                  Back to Home
                </Link>
                <a href={PHONE_HREF} className="luxury-btn-outline">
                  <Phone className="w-5 h-5" />
                  Call Concierge
                </a>
              </div>

              <p className="text-sm text-muted-foreground">
                Looking for something specific? Call us at{" "}
                <a href={PHONE_HREF} className="text-gold hover-gold">
                  {PHONE_NUMBER}
                </a>
              </p>

              {location.pathname && (
                <p className="text-xs text-muted-foreground/50 mt-4">
                  Requested: {location.pathname}
                </p>
              )}
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default NotFound;
