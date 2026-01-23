import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Phone, ArrowRight } from "lucide-react";
import { PHONE_NUMBER, PHONE_HREF } from "@/lib/constants";
import heroImage from "@/assets/hero-luxury.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Luxury private jet interior with champagne"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/80 to-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/50" />
      </div>

      {/* Content */}
      <div className="relative container-luxury py-20 md:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-sm font-medium tracking-widest uppercase text-gold mb-6">
              Private Access • Verified Partners
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="heading-display text-foreground mb-6"
          >
            Discreet Access to
            <span className="block text-gradient-gold">Extraordinary Experiences</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="body-large max-w-xl mb-10"
          >
            From private aviation to superyachts, exotic automobiles to off-market properties. 
            One point of contact. Complete confidentiality. Uncompromising standards.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/contact" className="luxury-btn-primary">
              Request Access
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a href={PHONE_HREF} className="luxury-btn-outline">
              <Phone className="w-5 h-5" />
              Call Concierge
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 pt-8 border-t border-border/30"
          >
            <p className="text-sm text-muted-foreground mb-2">Or call us directly:</p>
            <a href={PHONE_HREF} className="text-2xl font-serif text-gold hover-gold">
              {PHONE_NUMBER}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-gold"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
