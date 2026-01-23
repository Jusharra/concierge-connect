import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface LocalSEOBlockProps {
  city: string;
  nearbyAreas: string[];
}

const LocalSEOBlock = ({ city, nearbyAreas }: LocalSEOBlockProps) => {
  if (!nearbyAreas || nearbyAreas.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-muted/30 rounded-lg p-6 border border-border/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-display font-semibold text-foreground">
          Serving {city} and Surrounding Markets
        </h2>
      </div>
      
      <p className="text-muted-foreground mb-4">
        We coordinate luxury access in {city} and surrounding areas including:
      </p>
      
      <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {nearbyAreas.map((area) => (
          <li
            key={area}
            className="flex items-center gap-2 text-foreground"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            {area}
          </li>
        ))}
      </ul>
      
      <p className="text-sm text-muted-foreground italic">
        Services are city-specific and subject to availability.
      </p>
    </motion.section>
  );
};

export default LocalSEOBlock;
