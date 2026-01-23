import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { PHONE_NUMBER, PHONE_HREF } from "@/lib/constants";

const CTASection = () => {
  return (
    <section className="section-padding bg-gradient-hero relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-2xl" />

      <div className="container-luxury relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="inline-block text-sm font-medium tracking-widest uppercase text-gold mb-6">
            Begin Your Journey
          </span>
          <h2 className="heading-display text-foreground mb-6">
            Ready for
            <span className="text-gradient-gold"> Extraordinary?</span>
          </h2>
          <p className="body-large mb-10">
            Whether you're seeking a private charter, exclusive property, or business opportunity, 
            our concierge team is ready to curate your perfect experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="luxury-btn-primary">
              Request Access
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={PHONE_HREF} className="luxury-btn-outline">
              <Phone className="w-5 h-5" />
              {PHONE_NUMBER}
            </a>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>24/7 Concierge</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>Verified Partners</span>
            <span className="w-1 h-1 rounded-full bg-gold" />
            <span>Complete Discretion</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
