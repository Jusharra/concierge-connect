import { motion } from "framer-motion";

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

const SectionHeading = ({ label, title, description, align = "center" }: SectionHeadingProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`mb-12 md:mb-16 ${align === "center" ? "text-center" : "text-left"}`}
    >
      {label && (
        <span className="inline-block text-sm font-medium tracking-widest uppercase text-gold mb-4">
          {label}
        </span>
      )}
      <h2 className="heading-section text-foreground mb-4">{title}</h2>
      {description && (
        <p className={`body-large max-w-2xl ${align === "center" ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeading;
