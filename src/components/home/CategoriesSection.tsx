import CategoryCard from "@/components/ui/CategoryCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/constants";

// Import category images
import privateAirImage from "@/assets/category-private-air.jpg";
import yachtsImage from "@/assets/category-yachts.jpg";
import exoticCarsImage from "@/assets/category-exotic-cars.jpg";
import propertiesImage from "@/assets/category-properties.jpg";
import businessImage from "@/assets/category-business.jpg";

const categoryImages: Record<string, string> = {
  "private-air": privateAirImage,
  "yachts": yachtsImage,
  "exotic-cars": exoticCarsImage,
  "properties": propertiesImage,
  "business-acquisitions": businessImage,
};

const CategoriesSection = () => {
  return (
    <section className="section-padding bg-gradient-dark">
      <div className="container-luxury">
        <SectionHeading
          label="Our Services"
          title="Curated Access"
          description="Each category connects you with our network of verified, vetted partners who share our commitment to excellence and discretion."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {CATEGORIES.map((category, index) => (
            <CategoryCard
              key={category.id}
              name={category.name}
              tagline={category.tagline}
              href={category.href}
              image={categoryImages[category.id]}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
