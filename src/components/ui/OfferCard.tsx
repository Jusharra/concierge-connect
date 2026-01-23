import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

interface OfferCardProps {
  title: string;
  city: string;
  href: string;
  image?: string;
  index?: number;
}

const OfferCard = ({ title, city, href, image, index = 0 }: OfferCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link
        to={href}
        className="group block luxury-card overflow-hidden hover:border-gold-subtle transition-colors duration-300"
      >
        {/* Image */}
        {image && (
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={image}
              alt={`${title} - ${city}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-gold text-sm mb-3">
            <MapPin className="w-4 h-4" />
            <span>{city}</span>
          </div>
          <h3 className="heading-card text-foreground mb-4 group-hover:text-gold transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-gold transition-colors duration-300">
            <span className="text-sm font-medium">Request Access</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default OfferCard;
