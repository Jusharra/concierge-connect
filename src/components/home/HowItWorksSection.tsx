import { motion } from "framer-motion";
import SectionHeading from "@/components/ui/SectionHeading";
import { Send, UserCheck, Handshake, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Send,
    title: "Submit Request",
    description: "Share your requirements through our secure form. Describe your ideal experience or acquisition.",
  },
  {
    icon: UserCheck,
    title: "Verification",
    description: "Our team reviews your request and verifies details to ensure a seamless experience.",
  },
  {
    icon: Handshake,
    title: "Confirmation",
    description: "Availability and pricing are confirmed with the operator or partner for your dates.",
  },
  {
    icon: Sparkles,
    title: "Experience Delivered",
    description: "Enjoy your experience with support from our team throughout.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="section-padding bg-charcoal">
      <div className="container-luxury">
        <SectionHeading
          label="The Process"
          title="How It Works"
          description="A streamlined approach that prioritizes your time, privacy, and expectations."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative text-center"
            >
              {/* Step number */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-6xl font-serif font-bold text-gold/10">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Icon */}
              <div className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold">
                <step.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="heading-card text-foreground mb-3">{step.title}</h3>
              <p className="body-regular">{step.description}</p>

              {/* Connector line (not on last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-gold/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
