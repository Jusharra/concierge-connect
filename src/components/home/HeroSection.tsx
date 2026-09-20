import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Hero slide images
import heroMain from "@/assets/hero-luxury.jpg";
import heroAir from "@/assets/hero-slide-air.jpg";
import heroYachts from "@/assets/hero-slide-yachts.jpg";
import heroCars from "@/assets/hero-slide-cars.jpg";
import heroProperties from "@/assets/hero-slide-properties.jpg";
import heroBusiness from "@/assets/hero-slide-business.jpg";

interface HeroSlide {
  id: number;
  image: string;
  headline: string;
  headlineAccent?: string;
  subtext: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta?: {
    label: string;
    href: string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: heroMain,
    headline: "Global Luxury Access.",
    headlineAccent: "Curated Privately.",
    subtext: "Book private jets, yachts and exotic cars, or request a quote. Off-market properties and business acquisitions by private introduction.",
    primaryCta: { label: "Request Private Access", href: "/contact" },
    secondaryCta: { label: "Explore Categories", href: "/#categories" },
  },
  {
    id: 2,
    image: heroAir,
    headline: "Private Air Without",
    headlineAccent: "Public Marketplaces",
    subtext: "Jet and helicopter charter city by city with licensed operators. Book online or request a quote.",
    primaryCta: { label: "Explore Private Air", href: "/private-air" },
  },
  {
    id: 3,
    image: heroYachts,
    headline: "Yacht Access, Curated —",
    headlineAccent: "Not Crowdsourced",
    subtext: "Day charters and superyacht charters with professional captains and crews. Book online or request a quote.",
    primaryCta: { label: "Explore Yachts", href: "/yachts" },
  },
  {
    id: 4,
    image: heroCars,
    headline: "Exotic Vehicles.",
    headlineAccent: "Discreet Delivery.",
    subtext: "From Lamborghinis to vintage Porsches, available in select cities. Book online or request a quote.",
    primaryCta: { label: "Explore Exotic Cars", href: "/exotic-cars" },
  },
  {
    id: 5,
    image: heroProperties,
    headline: "Luxury Homes.",
    headlineAccent: "Structured Terms.",
    subtext: "Off-market estates with flexible financing options — coordinated through private networks.",
    primaryCta: { label: "Explore Properties", href: "/properties" },
  },
  {
    id: 6,
    image: heroBusiness,
    headline: "Seller-Financed",
    headlineAccent: "Business Acquisitions.",
    subtext: "Confidential introductions to owner-operators ready for private transitions.",
    primaryCta: { label: "Explore Opportunities", href: "/business-acquisitions" },
  },
];

const SLIDE_DURATION = 6000; // 6 seconds

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(nextSlide, SLIDE_DURATION);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const slide = heroSlides[currentSlide];

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with Fade Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="w-full h-full object-cover"
          />
          {/* Dark cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/85 to-obsidian/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-obsidian/60" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative container-luxury py-20 md:py-32 z-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${slide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block text-sm font-medium tracking-widest uppercase text-gold mb-6">
                Private Access • Verified Partners
              </span>

              <h1 className="heading-display text-foreground mb-6">
                {slide.headline}
                {slide.headlineAccent && (
                  <span className="block text-gradient-gold">{slide.headlineAccent}</span>
                )}
              </h1>

              <p className="body-large max-w-xl mb-10">
                {slide.subtext}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={slide.primaryCta.href} className="luxury-btn-primary">
                  {slide.primaryCta.label}
                  <ArrowRight className="w-5 h-5" />
                </Link>
                {slide.secondaryCta && (
                  <Link to={slide.secondaryCta.href} className="luxury-btn-outline">
                    {slide.secondaryCta.label}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`relative w-12 h-1 rounded-full overflow-hidden transition-all duration-300 ${
              index === currentSlide ? "bg-gold/30" : "bg-white/20 hover:bg-white/40"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === currentSlide && (
              <motion.div
                className="absolute inset-0 bg-gold origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: SLIDE_DURATION / 1000, ease: "linear" }}
                key={`progress-${currentSlide}`}
              />
            )}
          </button>
        ))}
      </div>

      {/* Subtle corner accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-gold/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none" />
    </section>
  );
};

export default HeroSection;
