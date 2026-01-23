import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ArrowRight, Building2, Home } from "lucide-react";

interface CityCardProps {
  title: string;
  city: string;
  subtitle?: string;
  href: string;
  image?: string;
  index?: number;
  variant?: "property" | "business" | "default";
}

const CityCard = ({ 
  title, 
  city, 
  subtitle,
  href, 
  image, 
  index = 0,
  variant = "default"
}: CityCardProps) => {
  const Icon = variant === "business" ? Building2 : variant === "property" ? Home : MapPin;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link
        to={href}
        className="block relative h-full overflow-hidden rounded-lg border border-border/50 hover:border-primary/50 transition-all duration-500"
      >
        {/* Full-bleed Image */}
        {image && (
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={`${title} - ${city}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-6">
          {/* Location Badge */}
          <div className="flex items-center gap-2 text-primary text-sm mb-2">
            <Icon className="w-4 h-4" />
            <span className="font-medium">{city}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-display font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-2">
            {subtitle || title}
          </h3>
          
          {/* CTA */}
          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors duration-300 mt-3">
            <span className="text-sm font-medium">
              {variant === "business" ? "Request Discussion" : variant === "property" ? "Explore Access" : "View Details"}
            </span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CityCard;
