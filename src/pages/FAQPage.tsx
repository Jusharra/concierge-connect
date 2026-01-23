import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { SITE_NAME, PHONE_NUMBER, PHONE_HREF, EMAIL } from "@/lib/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Phone, Mail } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const faqSections: FAQSection[] = [
  {
    title: "About Lux Connoisseurs",
    items: [
      {
        question: "What is Lux Connoisseurs?",
        answer:
          "Lux Connoisseurs is a premier luxury concierge service that connects discerning clients with exclusive experiences and assets. We specialize in Private Air charters, Yacht charters, Exotic Car rentals, Luxury Properties, and Business Acquisitions. Our role is to coordinate introductions between verified clients and our network of trusted partners.",
      },
      {
        question: "Is Lux Connoisseurs a marketplace or booking platform?",
        answer:
          "No. We are a concierge coordination service, not a marketplace. We do not own or operate any of the luxury assets featured on our platform. Instead, we facilitate introductions between qualified clients and our verified partner network. All transactions occur directly between you and the service provider.",
      },
      {
        question: "What categories of luxury services do you offer?",
        answer:
          "We provide access to five exclusive categories: Private Air (jet charters and aviation services), Yachts (charter vessels worldwide), Exotic Cars (luxury and supercar rentals), Properties (luxury real estate for sale or lease), and Business Acquisitions (investment opportunities and business purchases).",
      },
      {
        question: "Where do you operate?",
        answer:
          "Our services are available globally, with a strong presence in major luxury destinations including Miami, New York, Los Angeles, Monaco, Dubai, Ibiza, St. Tropez, Aspen, Palm Beach, and many more. If you have a specific destination in mind, reach out to discuss availability.",
      },
    ],
  },
  {
    title: "How It Works",
    items: [
      {
        question: "How do I request access to a service?",
        answer:
          "Simply browse our offerings, select your desired category and location, and complete the inquiry form. A Lux Connoisseurs representative will contact you within 24 hours to discuss your requirements, verify your request, and coordinate the introduction to our partner.",
      },
      {
        question: "What happens after I submit an inquiry?",
        answer:
          "After you submit your request: (1) Our team reviews your inquiry and reaches out to understand your specific needs. (2) We verify your requirements and match you with the ideal partner from our network. (3) We coordinate an introduction and facilitate communication. (4) You work directly with the partner to finalize details and complete the transaction.",
      },
      {
        question: "How long does the coordination process take?",
        answer:
          "Most initial responses occur within 24 hours during business days. The complete coordination timeline depends on the complexity of your request, availability, and the specific service category. Urgent requests can often be expedited—please mention any time constraints in your inquiry.",
      },
      {
        question: "Can I request custom or bespoke experiences?",
        answer:
          "Absolutely. Our concierge service excels at curating personalized experiences. Whether you need a specific aircraft configuration, a multi-destination yacht itinerary, or a custom property search, our team works with our partners to accommodate unique requirements.",
      },
    ],
  },
  {
    title: "Partner Verification",
    items: [
      {
        question: "How do you verify your partners?",
        answer:
          "Every partner in our network undergoes a rigorous vetting process. We verify business credentials, licensing, insurance coverage, safety records, and reputation within the industry. We also conduct ongoing reviews to ensure our partners maintain the highest standards of service and professionalism.",
      },
      {
        question: "Are the assets (jets, yachts, cars, properties) inspected?",
        answer:
          "Our partners are responsible for maintaining their assets to industry and regulatory standards. We work exclusively with established operators who have proven track records. For aviation and maritime services, our partners hold all required certifications and undergo regular safety audits.",
      },
      {
        question: "What if I have an issue with a partner?",
        answer:
          "While transactions occur directly between you and the partner, we value your experience. If you encounter any issues, please contact us immediately. We will work to mediate the situation and, if necessary, remove partners who do not meet our quality standards from our network.",
      },
      {
        question: "Can I become a partner with Lux Connoisseurs?",
        answer: (
          <>
            Yes, we welcome inquiries from qualified luxury service providers,
            asset owners, and operators. Visit our{" "}
            <Link
              to="/partners"
              className="text-gold hover:text-gold-light underline underline-offset-2"
            >
              Partners page
            </Link>{" "}
            to learn more about joining our network and submit your application.
          </>
        ),
      },
    ],
  },
  {
    title: "Transactions & Payments",
    items: [
      {
        question: "How do payments work?",
        answer:
          "All financial transactions occur directly between you and the service partner. Lux Connoisseurs does not process payments, hold funds, or act as an intermediary in financial matters. Payment terms, methods, and schedules are established between you and the partner during the booking process.",
      },
      {
        question: "Does Lux Connoisseurs charge a fee for its services?",
        answer:
          "Our coordination and introduction services are complimentary to clients. We receive compensation through our partner network, which does not affect the pricing you receive. This model ensures our interests align with providing you the best possible experience.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Since transactions occur directly with our partners, refund policies are determined by each individual service provider. We recommend reviewing cancellation and refund terms carefully before finalizing any booking. Our team can help clarify partner policies during the coordination process.",
      },
      {
        question: "Are there deposits required?",
        answer:
          "Deposit requirements vary by service category and partner. Private aviation and yacht charters typically require deposits to secure bookings. Property transactions follow standard real estate practices. Your Lux Connoisseurs representative will provide clarity on any financial requirements during coordination.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      {
        question: "How is my personal information protected?",
        answer: (
          <>
            We take privacy seriously. Your information is encrypted, stored
            securely, and only shared with partners as necessary to fulfill your
            requests. We never sell your data to third parties. For complete
            details, please review our{" "}
            <Link
              to="/privacy"
              className="text-gold hover:text-gold-light underline underline-offset-2"
            >
              Privacy Policy
            </Link>
            .
          </>
        ),
      },
      {
        question: "Is my inquiry confidential?",
        answer:
          "Yes. All client inquiries and communications are treated with the utmost discretion. We understand that our clientele values privacy, and we maintain strict confidentiality protocols. Information is shared only on a need-to-know basis with relevant partners.",
      },
      {
        question: "Do you conduct background checks on clients?",
        answer:
          "For certain high-value services, our partners may require identity verification or background screening. This is standard practice in luxury aviation, maritime, and real estate sectors. Any such requirements will be communicated clearly during the coordination process.",
      },
    ],
  },
  {
    title: "Contact & Support",
    items: [
      {
        question: "How can I contact Lux Connoisseurs?",
        answer: (
          <>
            You can reach us by phone at{" "}
            <a
              href={PHONE_HREF}
              className="text-gold hover:text-gold-light underline underline-offset-2"
            >
              {PHONE_NUMBER}
            </a>{" "}
            or by email at{" "}
            <a
              href={`mailto:${EMAIL}`}
              className="text-gold hover:text-gold-light underline underline-offset-2"
            >
              {EMAIL}
            </a>
            . You can also use the inquiry forms throughout our website, and our
            team will respond promptly.
          </>
        ),
      },
      {
        question: "What are your hours of operation?",
        answer:
          "Our team is available Monday through Friday, 9:00 AM to 6:00 PM EST. For urgent matters outside business hours, please leave a voicemail or send an email, and we will respond as soon as possible. Time-sensitive requests are given priority.",
      },
      {
        question: "Can I schedule a call to discuss my needs?",
        answer:
          "Absolutely. We encourage direct conversations to better understand your requirements. Submit an inquiry through our website or call us directly to schedule a consultation with one of our luxury specialists.",
      },
    ],
  },
];

const FAQPage = () => {
  return (
    <Layout>
      <Helmet>
        <title>Frequently Asked Questions | {SITE_NAME}</title>
        <meta
          name="description"
          content="Find answers to common questions about Lux Connoisseurs luxury concierge services, partner verification, transactions, and more."
        />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-black via-obsidian to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-widest text-gold uppercase bg-gold/10 rounded-full border border-gold/20">
              Support
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-champagne-muted text-lg max-w-2xl mx-auto">
              Everything you need to know about our luxury concierge services,
              partner network, and how we facilitate exceptional experiences.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-12">
            {faqSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: sectionIndex * 0.1 }}
              >
                <h2 className="text-2xl font-display font-bold text-gold mb-6 pb-2 border-b border-gold/20">
                  {section.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <AccordionItem
                      key={itemIndex}
                      value={`${sectionIndex}-${itemIndex}`}
                      className="bg-card/50 border border-border rounded-lg px-6 data-[state=open]:border-gold/30 transition-colors"
                    >
                      <AccordionTrigger className="text-left text-champagne hover:text-gold py-5 text-base font-medium hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-champagne-muted leading-relaxed pb-5">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="max-w-4xl mx-auto mt-16"
          >
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/20 rounded-xl p-8 md:p-10 text-center">
              <h3 className="text-2xl font-display font-bold text-champagne mb-3">
                Still Have Questions?
              </h3>
              <p className="text-champagne-muted mb-8 max-w-xl mx-auto">
                Our team is ready to assist you with any inquiries. Reach out
                directly for personalized assistance.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-black font-semibold rounded-lg transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  {PHONE_NUMBER}
                </a>
                <a
                  href={`mailto:${EMAIL}`}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-gold/50 hover:border-gold text-gold hover:bg-gold/5 font-semibold rounded-lg transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Email Us
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
