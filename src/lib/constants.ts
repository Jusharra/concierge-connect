// Site-wide constants
export const SITE_NAME = "Luxe Concierge";
export const PHONE_NUMBER = "+1 (888) 555-0199";
export const PHONE_HREF = "tel:+18885550199";
export const EMAIL = "concierge@luxe.com";

// Type definitions for enhanced SEO content
export interface OfferSEO {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  subheading: string;
}

export interface OfferHowItWorks {
  step: string;
  title: string;
}

export interface Offer {
  city: string;
  slug: string;
  title: string;
  seo?: OfferSEO;
  pageCopy?: string[];
  includedAccess?: string[];
  howItWorks?: OfferHowItWorks[];
  nearbyAreas?: string[];
}

export interface Category {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  offers: Offer[];
}

// Categories with their metadata
export const CATEGORIES: Category[] = [
  {
    id: "private-air",
    name: "Private Air",
    tagline: "Transcend Commercial Travel",
    description: "Access elite private aviation partners for charter flights, jet cards, and fractional ownership opportunities across North America and beyond.",
    href: "/private-air",
    offers: [
      {
        city: "Miami",
        slug: "private-jet-charter-miami",
        title: "Private Jet Charter Miami",
        seo: {
          metaTitle: "Luxury Private Jet Charter in Miami | Verified Concierge Access",
          metaDescription: "Private jet and helicopter charter in Miami. Discreet access to verified operators. Request availability and pricing today.",
          h1: "Luxury Private Jet Charter in Miami",
          subheading: "Discreet, concierge-coordinated access to private jets and helicopter charter throughout South Florida."
        },
        pageCopy: [
          "Miami is one of the world's most active private aviation hubs. We coordinate private air access in Miami through verified operators, matching aircraft availability to your timing, routing, and preferences.",
          "This service is designed for clients who value discretion, efficiency, and accuracy — not public listings or mass-market charter platforms.",
          "We do not publish aircraft inventory. All access is coordinated privately."
        ],
        includedAccess: [
          "Light, midsize, and heavy private jets",
          "Helicopter transfers and charters",
          "Domestic and international routing",
          "Same-day and multi-day itineraries",
          "Crew, catering, and ground coordination"
        ],
        howItWorks: [
          { step: "01", title: "Request availability for Miami" },
          { step: "02", title: "We verify feasibility and match operators" },
          { step: "03", title: "You receive confirmed pricing and options" },
          { step: "04", title: "Payment and execution occur directly with the operator" }
        ],
        nearbyAreas: ["Miami Beach", "Fort Lauderdale", "Palm Beach"]
      },
      {
        city: "Los Angeles",
        slug: "private-jet-charter-los-angeles",
        title: "Private Jet Charter Los Angeles",
        seo: {
          metaTitle: "Luxury Private Jet Charter in Los Angeles | Verified Concierge Access",
          metaDescription: "Private jet and helicopter charter in Los Angeles. Access verified operators without public marketplaces. Request availability today.",
          h1: "Luxury Private Jet Charter in Los Angeles",
          subheading: "Private aviation access coordinated discreetly across Southern California."
        },
        pageCopy: [
          "Los Angeles requires precision when it comes to private aviation. We coordinate private jet and helicopter access through licensed operators across Southern California, ensuring accurate availability and discreet execution.",
          "This service is ideal for executive travel, entertainment, and time-sensitive routing where privacy and efficiency matter.",
          "No public aircraft listings. No speculative pricing."
        ],
        includedAccess: [
          "Private jet charter (short-haul and long-range)",
          "Helicopter transfers across LA metro",
          "Multi-city and interstate routing",
          "Executive and entertainment travel coordination"
        ],
        howItWorks: [
          { step: "01", title: "Submit your Los Angeles request" },
          { step: "02", title: "We verify aircraft availability" },
          { step: "03", title: "Confirm pricing and routing" },
          { step: "04", title: "Operator executes directly" }
        ],
        nearbyAreas: ["Beverly Hills", "Santa Monica", "Burbank", "Van Nuys"]
      },
      {
        city: "New York",
        slug: "private-jet-charter-new-york",
        title: "Private Jet Charter New York",
        seo: {
          metaTitle: "Luxury Private Jet Charter in New York | Verified Concierge Access",
          metaDescription: "Private jet and helicopter charter in New York City. Discreet access to licensed operators. Request availability and pricing.",
          h1: "Luxury Private Jet Charter in New York",
          subheading: "Concierge-coordinated private aviation across NYC and surrounding airports."
        },
        pageCopy: [
          "Private aviation in New York requires advanced coordination. We arrange private jet and helicopter access through verified operators serving the New York metropolitan area.",
          "This service prioritizes discretion, accurate availability, and professional execution — without public booking platforms or inventory browsing."
        ],
        includedAccess: [
          "Private jet charter (domestic & international)",
          "Helicopter transfers within NYC",
          "Business and executive aviation",
          "Short-notice and scheduled itineraries"
        ],
        howItWorks: [
          { step: "01", title: "Request New York availability" },
          { step: "02", title: "We confirm routing and aircraft" },
          { step: "03", title: "Receive verified pricing" },
          { step: "04", title: "Operator handles execution" }
        ],
        nearbyAreas: ["Manhattan", "Long Island", "Westchester", "Teterboro"]
      },
      {
        city: "Dubai",
        slug: "private-jet-charter-dubai",
        title: "Private Jet Charter Dubai",
        seo: {
          metaTitle: "Luxury Private Jet Charter in Dubai | Verified Concierge Access",
          metaDescription: "Private jet charter in Dubai. Access long-range and regional aircraft through verified operators. Request availability today.",
          h1: "Luxury Private Jet Charter in Dubai",
          subheading: "Global private aviation access coordinated discreetly in the UAE."
        },
        pageCopy: [
          "Dubai is a global hub for long-range private aviation. We coordinate private jet access in Dubai through licensed operators offering regional and intercontinental routing.",
          "This service is designed for clients requiring discretion, international reach, and verified execution — without public listings."
        ],
        includedAccess: [
          "Long-range private jets",
          "Regional and international routing",
          "Executive and VIP aviation",
          "Crew, catering, and ground coordination"
        ],
        howItWorks: [
          { step: "01", title: "Submit Dubai routing request" },
          { step: "02", title: "Aircraft availability is verified" },
          { step: "03", title: "Pricing and schedules confirmed" },
          { step: "04", title: "Operator executes directly" }
        ],
        nearbyAreas: ["Dubai International", "Al Maktoum International", "Abu Dhabi"]
      },
      {
        city: "London",
        slug: "private-jet-charter-london",
        title: "Private Jet Charter London",
        seo: {
          metaTitle: "Luxury Private Jet Charter in London | Verified Concierge Access",
          metaDescription: "Private jet charter in London with discreet access to licensed operators. Request availability and pricing today.",
          h1: "Luxury Private Jet Charter in London",
          subheading: "Concierge-coordinated private aviation throughout the UK and Europe."
        },
        pageCopy: [
          "London is one of Europe's most active private aviation markets. We coordinate private jet access through verified operators serving London and surrounding regions.",
          "This service is built for discretion, efficiency, and accurate coordination — not public aircraft listings."
        ],
        includedAccess: [
          "Private jet charter across the UK and Europe",
          "Short-haul and long-range aircraft",
          "Executive and corporate aviation",
          "International routing coordination"
        ],
        howItWorks: [
          { step: "01", title: "Request London availability" },
          { step: "02", title: "We confirm aircraft and routing" },
          { step: "03", title: "Pricing is verified" },
          { step: "04", title: "Operator executes directly" }
        ],
        nearbyAreas: ["Heathrow", "Farnborough", "Biggin Hill"]
      }
    ]
  },
  {
    id: "yachts",
    name: "Yachts",
    tagline: "Command the Seas",
    description: "Charter world-class motor yachts, sailing vessels, and superyachts in the most coveted destinations from the Caribbean to the Mediterranean.",
    href: "/yachts",
    offers: [
      { city: "Miami", slug: "day-yacht-charter-miami", title: "Day Yacht Charter Miami" },
      { city: "Monaco", slug: "superyacht-charter-monaco", title: "Superyacht Charter Monaco" },
      { city: "St. Tropez", slug: "yacht-charter-st-tropez", title: "Yacht Charter St. Tropez" },
      { city: "Bahamas", slug: "yacht-charter-bahamas", title: "Yacht Charter Bahamas" },
      { city: "Ibiza", slug: "yacht-charter-ibiza", title: "Yacht Charter Ibiza" }
    ]
  },
  {
    id: "exotic-cars",
    name: "Exotic Cars",
    tagline: "Drive the Exceptional",
    description: "Experience the world's most exclusive automobiles through curated rentals, driving experiences, and acquisition services.",
    href: "/exotic-cars",
    offers: [
      { city: "Los Angeles", slug: "exotic-car-rental-los-angeles", title: "Exotic Car Rental Los Angeles" },
      { city: "Miami", slug: "exotic-car-rental-miami", title: "Exotic Car Rental Miami" },
      { city: "Dubai", slug: "exotic-car-rental-dubai", title: "Exotic Car Rental Dubai" },
      { city: "Monaco", slug: "exotic-car-rental-monaco", title: "Exotic Car Rental Monaco" },
      { city: "New York", slug: "exotic-car-rental-new-york", title: "Exotic Car Rental New York" }
    ]
  },
  {
    id: "properties",
    name: "Properties",
    tagline: "Exceptional Residences",
    description: "Access off-market luxury homes, vacation estates, and investment properties in the world's most prestigious locations.",
    href: "/properties",
    offers: [
      { city: "New York", slug: "off-market-luxury-homes-new-york", title: "Off-Market Luxury Homes New York" },
      { city: "Beverly Hills", slug: "luxury-estates-beverly-hills", title: "Luxury Estates Beverly Hills" },
      { city: "Malibu", slug: "beachfront-homes-malibu", title: "Beachfront Homes Malibu" },
      { city: "Palm Beach", slug: "luxury-properties-palm-beach", title: "Luxury Properties Palm Beach" },
      { city: "Aspen", slug: "mountain-estates-aspen", title: "Mountain Estates Aspen" }
    ]
  },
  {
    id: "business-acquisitions",
    name: "Business Acquisitions",
    tagline: "Strategic Opportunities",
    description: "Discreet access to off-market business acquisition opportunities, private equity deals, and exclusive investment introductions.",
    href: "/business-acquisitions",
    offers: [
      { city: "New York", slug: "business-acquisitions-new-york", title: "Business Acquisitions New York" },
      { city: "San Francisco", slug: "tech-acquisitions-san-francisco", title: "Tech Acquisitions San Francisco" },
      { city: "Chicago", slug: "business-acquisitions-chicago", title: "Business Acquisitions Chicago" },
      { city: "Dallas", slug: "business-acquisitions-dallas", title: "Business Acquisitions Dallas" },
      { city: "London", slug: "business-acquisitions-london", title: "Business Acquisitions London" }
    ]
  }
];
