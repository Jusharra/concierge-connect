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
import PageHead from "@/components/seo/PageHead";

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
    title: `About ${SITE_NAME}`,
    items: [
      {
        question: `What is ${SITE_NAME}?`,
        answer:
          `${SITE_NAME} lets you book private jet charter, yacht charter and exotic car rental with vetted operators, and request private introductions for luxury properties and business acquisitions. Choose a package and reserve with a deposit, or request a quote for a custom trip.`,
      },
      {
        question: `Is ${SITE_NAME} a marketplace or booking platform?`,
        answer:
          "For private jets, yachts and exotic cars you can reserve online with a deposit or request a quote. The aircraft, vessels and vehicles are owned and operated by independent operators, and the operator confirms availability for your dates. Properties and business acquisitions are handled by private introduction, and those transactions occur directly between the parties.",
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
          `Browse our offerings, choose a category and city, then reserve a package with a deposit or request a quote. For properties and business acquisitions, complete the inquiry form and a ${SITE_NAME} representative will contact you within 24 hours.`,
      },
      {
        question: "What happens after I submit an inquiry?",
        answer:
          "For jets, yachts and exotic cars: if you reserve, you pay a deposit and the operator confirms your trip; if you request a quote, we return with confirmed pricing and options and send a secure payment link for the deposit if you would like to proceed. The remaining balance is paid directly to the operator. For properties and business acquisitions: we review your inquiry, reach out to understand your needs and arrange a private introduction, then you work directly with the other party to finalize details.",
      },
      {
        question: "How long does it take?",
        answer:
          "Most initial responses occur within 24 hours during business days. The complete timeline depends on the complexity of your request, availability, and the specific service category. Urgent requests can often be expedited—please mention any time constraints in your inquiry.",
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
          "Although the remaining balance is paid directly to the operator, we value your experience. If you encounter any issues, please contact us immediately. We will work to mediate the situation and, if necessary, remove partners who do not meet our quality standards from our network.",
      },
      {
        question: `Can I become a partner with ${SITE_NAME}?`,
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
          `For jets, yachts and exotic cars, you pay a deposit online when you reserve; the deposit is our booking fee and is shown before you pay. The remaining balance is paid directly to the operator when you meet. Prices shown are starting-at figures and the final price is confirmed before you pay. Properties and business acquisitions are transacted directly between the parties, and ${SITE_NAME} does not take payment for them.`,
      },
      {
        question: `Does ${SITE_NAME} charge a fee for its services?`,
        answer:
          "The deposit you pay when you reserve a jet, yacht or exotic car is our booking fee, and it is shown before you pay. The rest of the price is paid to the operator. For properties and business acquisitions, terms are explained before you commit.",
      },
      {
        question: "What is your refund policy?",
        answer:
          "Each package states its refund terms before you pay, and you acknowledge them at checkout. Cancellation terms for the remaining balance are set by the operator and shared with you before you commit.",
      },
      {
        question: "Are there deposits required?",
        answer:
          "Reserving a jet, yacht or exotic car takes a deposit, shown on the package before you pay. The remaining balance is paid directly to the operator. Property transactions follow standard real estate practices, and any financial requirements are explained in your conversation with our team.",
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
        question: `How can I contact ${SITE_NAME}?`,
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
      <PageHead
        title={`Frequently Asked Questions | ${SITE_NAME}`}
        description={`Find answers to common questions about ${SITE_NAME} luxury concierge services, partner verification, transactions, and more.`}
        path="/faq"
      />

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
