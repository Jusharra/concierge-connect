import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  tagline: string;
  href: string;
  image: string;
  index?: number;
}

const CategoryCard = ({ name, tagline, href, image, index = 0 }: CategoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link
        to={href}
        className="group block relative overflow-hidden rounded-lg aspect-[4/5] luxury-card"
      >
        {/* Image */}
        <img
          src={image}
          alt={`${name} luxury concierge services`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
            <h3 className="heading-card text-foreground mb-2">{name}</h3>
            <p className="text-sm text-platinum mb-4">{tagline}</p>
            <div className="flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-sm font-medium">Explore</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-gold transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
