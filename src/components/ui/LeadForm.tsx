import { useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Check, Loader2 } from "lucide-react";
import { z } from "zod";

// Form validation schema
const formSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  phone: z.string().trim().min(10, "Please enter a valid phone number").max(20),
  city: z.string().trim().min(2, "Please enter your city").max(100),
  dates: z.string().optional(),
  notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

interface LeadFormProps {
  category?: string;
  offer?: string;
  offerCity?: string;
  variant?: "default" | "hero" | "compact";
}

const LeadForm = ({ category, offer, offerCity, variant = "default" }: LeadFormProps) => {
  const location = useLocation();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    city: offerCity || "",
    dates: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate form
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof FormData, string>> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof FormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    // Prepare data with hidden fields
    const submissionData = {
      ...formData,
      category: category || "General",
      offer: offer || "General Inquiry",
      offerCity: offerCity || formData.city,
      pageUrl: location.pathname,
      source: document.referrer || "Direct",
      timestamp: new Date().toISOString(),
    };

    // Simulate form submission (replace with actual Google Sheets integration)
    // For production: Use Netlify Forms, Tally, or Jotform embedded forms
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log("Form submission data:", submissionData);
    
    setIsSubmitting(false);
    setIsSuccess(true);

    // Reset after success
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        phone: "",
        city: offerCity || "",
        dates: "",
        notes: "",
      });
      setIsSuccess(false);
    }, 5000);
  };

  const inputClasses = "w-full bg-input border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";
  const labelClasses = "block text-sm font-medium text-foreground mb-2";
  const errorClasses = "text-destructive text-xs mt-1";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className={`
        ${variant === "hero" ? "luxury-card p-8 md:p-10" : ""}
        ${variant === "compact" ? "space-y-4" : "space-y-5"}
      `}
    >
      {variant !== "compact" && (
        <div className="mb-6">
          <h3 className="heading-card text-foreground mb-2">Request Access</h3>
          <p className="text-muted-foreground text-sm">
            Complete the form below and our concierge team will reach out within 24 hours.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={labelClasses}>Full Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Smith"
            className={inputClasses}
            required
          />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className={labelClasses}>Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClasses}
            required
          />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClasses}>Phone *</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            className={inputClasses}
            required
          />
          {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="city" className={labelClasses}>Your City *</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Miami"
            className={inputClasses}
            required
          />
          {errors.city && <p className={errorClasses}>{errors.city}</p>}
        </div>
      </div>

      {variant !== "compact" && (
        <>
          <div>
            <label htmlFor="dates" className={labelClasses}>Preferred Dates</label>
            <input
              type="text"
              id="dates"
              name="dates"
              value={formData.dates}
              onChange={handleChange}
              placeholder="e.g., March 15-20, 2025"
              className={inputClasses}
            />
          </div>

          <div>
            <label htmlFor="notes" className={labelClasses}>Additional Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tell us about your requirements..."
              rows={4}
              className={inputClasses}
            />
          </div>
        </>
      )}

      <button
        type="submit"
        disabled={isSubmitting || isSuccess}
        className="w-full luxury-btn-primary disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Submitting...
          </>
        ) : isSuccess ? (
          <>
            <Check className="w-5 h-5" />
            Request Received
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Request
          </>
        )}
      </button>

      {isSuccess && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-sm text-gold"
        >
          Thank you! Our concierge team will contact you shortly.
        </motion.p>
      )}
    </motion.form>
  );
};

export default LeadForm;
