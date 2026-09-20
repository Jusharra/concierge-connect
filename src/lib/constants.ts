import { SITE } from "@/config/site";
import { buildCategories } from "./catalog";

// Site-wide constants (values live in src/config/site.ts)
export const SITE_NAME = SITE.brand;
export const PHONE_NUMBER = SITE.phone.display;
export const PHONE_HREF = `tel:${SITE.phone.e164}`;
export const EMAIL = SITE.email;

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
// Original hand-written catalogue. Kept as the seed/export source and as the content for the
// non-bookable categories (properties, business acquisitions). Bookable categories are driven by
// Airtable via data/*.json; see src/lib/catalog.ts.
export const LEGACY_CATEGORIES: Category[] = [
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
      {
        city: "Miami",
        slug: "yacht-charter-miami",
        title: "Yacht Charter Miami",
        seo: {
          metaTitle: "Luxury Yacht Charter in Miami | Verified Concierge Access",
          metaDescription: "Private yacht and day charter in Miami. Discreet access to verified vessels. Request availability and pricing today.",
          h1: "Luxury Yacht Charter in Miami",
          subheading: "Concierge-coordinated access to motor yachts and crewed charters throughout South Florida."
        },
        pageCopy: [
          "Miami is one of the world's premier yachting destinations. We coordinate private yacht access in Miami through verified operators, matching vessel availability to your timing, guest count, and preferences.",
          "This service is designed for clients who value discretion, quality, and accuracy — not public listing platforms or mass-market brokers.",
          "We do not publish vessel inventory. All access is coordinated privately."
        ],
        includedAccess: [
          "Motor yachts and sailing vessels",
          "Day charters and multi-day itineraries",
          "Crewed and captained options",
          "Catering, provisioning, and water toys",
          "Dockside pickup throughout South Florida"
        ],
        howItWorks: [
          { step: "01", title: "Request availability for Miami" },
          { step: "02", title: "We verify vessel options and crew" },
          { step: "03", title: "You receive confirmed pricing and itineraries" },
          { step: "04", title: "Charter executes directly with the operator" }
        ],
        nearbyAreas: ["Miami Beach", "Fort Lauderdale", "Biscayne Bay", "Key Biscayne"]
      },
      {
        city: "Monaco",
        slug: "superyacht-charter-monaco",
        title: "Superyacht Charter Monaco",
        seo: {
          metaTitle: "Superyacht Charter in Monaco | Verified Concierge Access",
          metaDescription: "Superyacht and luxury vessel charter in Monaco. Access verified operators throughout the French Riviera. Request availability today.",
          h1: "Superyacht Charter in Monaco",
          subheading: "Discreet, concierge-coordinated access to superyachts and luxury vessels on the Côte d'Azur."
        },
        pageCopy: [
          "Monaco is the global epicenter of superyacht culture. We coordinate private yacht access in Monaco through licensed operators offering vessels from 30 to 100+ meters.",
          "This service is built for clients requiring discretion, world-class crew, and verified execution — without public brokers or speculative listings.",
          "All charters are coordinated privately through trusted maritime partners."
        ],
        includedAccess: [
          "Superyachts and mega yachts",
          "Day charters and weekly itineraries",
          "Full crew, chef, and concierge service",
          "Helicopter transfers and tender boats",
          "Event and Grand Prix hospitality coordination"
        ],
        howItWorks: [
          { step: "01", title: "Submit your Monaco request" },
          { step: "02", title: "We verify vessel availability" },
          { step: "03", title: "Confirm pricing and itinerary" },
          { step: "04", title: "Operator executes the charter directly" }
        ],
        nearbyAreas: ["Monte Carlo", "Nice", "Cannes", "Antibes"]
      },
      {
        city: "St. Tropez",
        slug: "yacht-charter-st-tropez",
        title: "Yacht Charter St. Tropez",
        seo: {
          metaTitle: "Luxury Yacht Charter in St. Tropez | Verified Concierge Access",
          metaDescription: "Private yacht charter in St. Tropez. Discreet access to verified vessels on the French Riviera. Request availability and pricing.",
          h1: "Luxury Yacht Charter in St. Tropez",
          subheading: "Concierge-coordinated yacht access across the French Riviera's most iconic destination."
        },
        pageCopy: [
          "St. Tropez defines Mediterranean yachting. We coordinate private yacht access through verified operators offering motor yachts, sailing vessels, and superyachts along the Côte d'Azur.",
          "This service prioritizes discretion, experienced crew, and seamless execution — without public platforms or inventory browsing.",
          "No public vessel listings. No speculative pricing."
        ],
        includedAccess: [
          "Motor yachts and sailing yachts",
          "Day trips and extended charters",
          "Crewed service with local expertise",
          "Beach club and restaurant coordination",
          "Water sports and tender service"
        ],
        howItWorks: [
          { step: "01", title: "Request St. Tropez availability" },
          { step: "02", title: "We confirm vessel and crew" },
          { step: "03", title: "Receive verified pricing" },
          { step: "04", title: "Charter operator handles execution" }
        ],
        nearbyAreas: ["Pampelonne Beach", "Ramatuelle", "Port Grimaud", "Sainte-Maxime"]
      },
      {
        city: "Bahamas",
        slug: "yacht-charter-bahamas",
        title: "Yacht Charter Bahamas",
        seo: {
          metaTitle: "Luxury Yacht Charter in the Bahamas | Verified Concierge Access",
          metaDescription: "Private yacht charter in the Bahamas. Access verified vessels for island-hopping and extended cruises. Request availability today.",
          h1: "Luxury Yacht Charter in the Bahamas",
          subheading: "Discreet, concierge-coordinated access to crewed yachts across the Bahamian islands."
        },
        pageCopy: [
          "The Bahamas offers unmatched cruising across 700 islands and cays. We coordinate private yacht access through verified operators based in Nassau, the Exumas, and beyond.",
          "This service is designed for clients seeking island-hopping itineraries, diving expeditions, and secluded anchorages — coordinated with discretion and precision.",
          "We do not publish vessel inventory. All access is arranged privately."
        ],
        includedAccess: [
          "Motor yachts and catamarans",
          "Multi-day island-hopping itineraries",
          "Crewed service with local captains",
          "Diving, fishing, and water sports",
          "Provisioning and private island access"
        ],
        howItWorks: [
          { step: "01", title: "Submit your Bahamas request" },
          { step: "02", title: "We verify vessel and routing" },
          { step: "03", title: "Pricing and itinerary confirmed" },
          { step: "04", title: "Operator executes directly" }
        ],
        nearbyAreas: ["Nassau", "Exumas", "Harbour Island", "Abacos"]
      },
      {
        city: "Ibiza",
        slug: "yacht-charter-ibiza",
        title: "Yacht Charter Ibiza",
        seo: {
          metaTitle: "Luxury Yacht Charter in Ibiza | Verified Concierge Access",
          metaDescription: "Private yacht charter in Ibiza. Discreet access to verified vessels across the Balearic Islands. Request availability and pricing.",
          h1: "Luxury Yacht Charter in Ibiza",
          subheading: "Concierge-coordinated yacht access across Ibiza and the Balearic Islands."
        },
        pageCopy: [
          "Ibiza is the Mediterranean's most dynamic yachting destination. We coordinate private yacht access through verified operators offering day charters, sunset cruises, and multi-day itineraries.",
          "This service is built for clients who value discretion, quality vessels, and seamless coordination — not public booking platforms.",
          "All charters are arranged privately through trusted partners."
        ],
        includedAccess: [
          "Motor yachts and sailing vessels",
          "Day charters and sunset cruises",
          "Crewed service with local expertise",
          "Beach club and nightlife coordination",
          "Formentera day trips and island tours"
        ],
        howItWorks: [
          { step: "01", title: "Request Ibiza availability" },
          { step: "02", title: "We confirm vessel options" },
          { step: "03", title: "Receive verified pricing" },
          { step: "04", title: "Operator handles charter execution" }
        ],
        nearbyAreas: ["Ibiza Town", "San Antonio", "Formentera", "Es Vedrà"]
      }
    ]
  },
  {
    id: "exotic-cars",
    name: "Exotic Cars",
    tagline: "Drive the Exceptional",
    description: "Experience the world's most exclusive automobiles through curated rentals, driving experiences, and acquisition services.",
    href: "/exotic-cars",
    offers: [
      {
        city: "Miami",
        slug: "exotic-car-rental-miami",
        title: "Exotic Car Rental Miami",
        seo: {
          metaTitle: "Luxury Exotic Car Rental in Miami | Private Concierge Access",
          metaDescription: "Exotic and luxury car rentals in Miami. Verified access to supercars and premium vehicles. Request availability today.",
          h1: "Luxury Exotic Car Rental in Miami",
          subheading: "Private access to exotic and luxury vehicles coordinated discreetly across South Florida."
        },
        pageCopy: [
          "Miami is one of the premier markets for exotic and luxury vehicles. We coordinate private access to high-performance and luxury cars in Miami through verified partners, ensuring availability aligns with your timing and preferences.",
          "This service is designed for clients who want premium vehicles without public listings, peer-to-peer platforms, or uncertain availability.",
          "Vehicles are not listed publicly. Access is coordinated privately."
        ],
        includedAccess: [
          "Supercars and high-performance vehicles",
          "Luxury sedans and SUVs",
          "Short-term and multi-day rentals",
          "Chauffeur or self-drive options (where permitted)",
          "Event, leisure, and executive use"
        ],
        howItWorks: [
          { step: "01", title: "Request exotic vehicle availability in Miami" },
          { step: "02", title: "We verify vehicle fit and timing" },
          { step: "03", title: "Pricing and rental terms are confirmed" },
          { step: "04", title: "Vehicle is provided directly by the partner" }
        ],
        nearbyAreas: ["Miami Beach", "Brickell", "Fort Lauderdale"]
      },
      {
        city: "Los Angeles",
        slug: "exotic-car-rental-los-angeles",
        title: "Exotic Car Rental Los Angeles",
        seo: {
          metaTitle: "Luxury Exotic Car Rental in Los Angeles | Private Concierge Access",
          metaDescription: "Exotic and luxury car rentals in Los Angeles. Access verified supercars discreetly. Request availability today.",
          h1: "Luxury Exotic Car Rental in Los Angeles",
          subheading: "Concierge-coordinated access to exotic vehicles throughout Southern California."
        },
        pageCopy: [
          "Los Angeles is a global hub for exotic and luxury automobiles. We coordinate private access to premium and high-performance vehicles through verified partners serving the Los Angeles area.",
          "This service is ideal for entertainment, executive travel, and special occasions where presentation and reliability matter.",
          "No public marketplaces. No speculative listings."
        ],
        includedAccess: [
          "Exotic supercars and hypercars",
          "Luxury sedans and SUVs",
          "Daily, weekend, and extended rentals",
          "Chauffeur services available upon request"
        ],
        howItWorks: [
          { step: "01", title: "Submit a Los Angeles vehicle request" },
          { step: "02", title: "Vehicle availability is verified" },
          { step: "03", title: "Pricing and rental terms confirmed" },
          { step: "04", title: "Partner executes directly" }
        ],
        nearbyAreas: ["Beverly Hills", "Hollywood", "Santa Monica"]
      },
      {
        city: "New York",
        slug: "exotic-car-rental-new-york",
        title: "Exotic Car Rental New York",
        seo: {
          metaTitle: "Luxury Exotic Car Rental in New York | Private Concierge Access",
          metaDescription: "Exotic and luxury car rentals in New York City. Discreet access to premium vehicles. Request availability today.",
          h1: "Luxury Exotic Car Rental in New York",
          subheading: "Private access to exotic vehicles coordinated across New York City."
        },
        pageCopy: [
          "New York requires precision when it comes to luxury transportation. We coordinate exotic and luxury vehicle access in New York through verified partners serving the metropolitan area.",
          "This service is designed for clients seeking premium vehicles without the friction of public rental platforms."
        ],
        includedAccess: [
          "Exotic and high-performance vehicles",
          "Luxury sedans and SUVs",
          "Short-term and multi-day rentals",
          "Executive and event transportation"
        ],
        howItWorks: [
          { step: "01", title: "Request vehicle access in New York" },
          { step: "02", title: "We verify availability and terms" },
          { step: "03", title: "Pricing is confirmed" },
          { step: "04", title: "Vehicle is delivered or arranged" }
        ],
        nearbyAreas: ["Manhattan", "Brooklyn", "Long Island"]
      },
      {
        city: "Dubai",
        slug: "exotic-car-rental-dubai",
        title: "Exotic Car Rental Dubai",
        seo: {
          metaTitle: "Luxury Exotic Car Rental in Dubai | Private Concierge Access",
          metaDescription: "Exotic and luxury car rentals in Dubai. Access verified supercars discreetly. Request availability today.",
          h1: "Luxury Exotic Car Rental in Dubai",
          subheading: "Exclusive access to exotic vehicles coordinated across Dubai."
        },
        pageCopy: [
          "Dubai is one of the world's leading markets for exotic automobiles. We coordinate private access to high-performance and luxury vehicles in Dubai through verified partners operating across the UAE.",
          "This service prioritizes discretion, vehicle quality, and professional execution — without public listings."
        ],
        includedAccess: [
          "Exotic supercars and luxury vehicles",
          "Daily and extended rentals",
          "Chauffeur or self-drive options",
          "VIP and event transportation"
        ],
        howItWorks: [
          { step: "01", title: "Submit a Dubai vehicle request" },
          { step: "02", title: "Vehicle availability is verified" },
          { step: "03", title: "Pricing and rental terms confirmed" },
          { step: "04", title: "Partner executes directly" }
        ],
        nearbyAreas: ["Downtown Dubai", "Palm Jumeirah", "Dubai Marina"]
      },
      {
        city: "London",
        slug: "exotic-car-rental-london",
        title: "Exotic Car Rental London",
        seo: {
          metaTitle: "Luxury Exotic Car Rental in London | Private Concierge Access",
          metaDescription: "Exotic and luxury car rentals in London. Verified access to premium vehicles. Request availability today.",
          h1: "Luxury Exotic Car Rental in London",
          subheading: "Concierge-coordinated access to exotic vehicles across London and the UK."
        },
        pageCopy: [
          "London offers premium access to exotic and luxury vehicles for executive and leisure use. We coordinate private vehicle access through verified partners serving London and surrounding regions.",
          "This service is designed for discretion, reliability, and accurate coordination — without public rental platforms."
        ],
        includedAccess: [
          "Exotic and luxury vehicles",
          "Short-term and extended rentals",
          "Chauffeur services available",
          "Executive and private transport"
        ],
        howItWorks: [
          { step: "01", title: "Request vehicle availability in London" },
          { step: "02", title: "We verify availability and terms" },
          { step: "03", title: "Pricing is confirmed" },
          { step: "04", title: "Vehicle is arranged directly" }
        ],
        nearbyAreas: ["Mayfair", "Kensington", "Canary Wharf"]
      }
    ]
  },
  {
    id: "properties",
    name: "Properties",
    tagline: "Flexible Paths to Ownership",
    description: "Private access to luxury homes through structured terms. A refined alternative for buyers and owners seeking flexibility.",
    href: "/properties",
    offers: [
      {
        city: "Scottsdale",
        slug: "luxury-homes-structured-terms-scottsdale",
        title: "Luxury Property Access Scottsdale",
        seo: {
          metaTitle: "Scottsdale Luxury Homes for Rent-to-Own or Terms-Based Purchase",
          metaDescription: "Explore luxury homes in Scottsdale available through structured terms. Private arrangements for buyers and owners seeking flexibility.",
          h1: "Luxury Property Access in Scottsdale Through Structured Terms",
          subheading: "A private alternative for buying or transitioning high-quality homes"
        },
        pageCopy: [
          "Scottsdale is home to some of the most desirable residential properties in the Southwest — custom homes, estates, and luxury residences often owned outright or with significant equity.",
          "We work privately with property owners and qualified buyers to create structured, terms-based arrangements that allow homes to be occupied, controlled, and ultimately purchased over time — without relying solely on traditional bank financing.",
          "This model is ideal for owners who want income, relief from management, or a gradual exit — and for buyers who want access to premium homes without immediate full financing.",
          "We are not a brokerage and we do not list properties publicly. We specialize in control and placement, acting as the facilitator who aligns both sides under clearly defined terms."
        ],
        includedAccess: [
          "Luxury single-family homes",
          "Executive residences",
          "High-end vacation or second homes"
        ],
        howItWorks: [
          { step: "01", title: "Submit a property access or transition inquiry" },
          { step: "02", title: "We assess alignment and terms fit" },
          { step: "03", title: "Structured arrangement is negotiated privately" },
          { step: "04", title: "Agreement executed directly between parties" }
        ],
        nearbyAreas: ["Paradise Valley", "Cave Creek", "Fountain Hills", "Mesa"]
      },
      {
        city: "Newport Beach",
        slug: "luxury-homes-private-terms-newport-beach",
        title: "Luxury Home Access Newport Beach",
        seo: {
          metaTitle: "Newport Beach Luxury Homes | Flexible Purchase & Rent-to-Own Options",
          metaDescription: "Private access to Newport Beach luxury homes through structured terms. Buy or transition property without traditional constraints.",
          h1: "Newport Beach Luxury Homes — Access Without Traditional Barriers",
          subheading: "Coastal luxury available through private, terms-based arrangements"
        },
        pageCopy: [
          "Newport Beach properties are often held by long-term owners with significant equity. Many are open to alternative arrangements that preserve value, reduce friction, and maintain discretion.",
          "We create private, structured agreements that allow qualified occupants to live in and work toward ownership of luxury homes while providing owners with income, protection, and a defined exit.",
          "This approach allows control without immediate ownership transfer, time-based purchase paths, and privacy for both parties."
        ],
        includedAccess: [
          "Coastal luxury homes",
          "Executive residences",
          "High-end condos and estates"
        ],
        howItWorks: [
          { step: "01", title: "Start a confidential conversation about access or transition" },
          { step: "02", title: "We verify alignment and property fit" },
          { step: "03", title: "Private terms are structured" },
          { step: "04", title: "Agreement executed between parties" }
        ],
        nearbyAreas: ["Laguna Beach", "Corona del Mar", "Irvine", "Huntington Beach"]
      },
      {
        city: "Naperville",
        slug: "executive-homes-structured-terms-naperville",
        title: "Executive Home Access Naperville",
        seo: {
          metaTitle: "Naperville Luxury Homes | Alternative Paths to Ownership",
          metaDescription: "Explore executive homes in Naperville available through private, structured terms. Ideal for buyers and owners seeking flexibility.",
          h1: "Naperville Executive Homes — Private, Terms-Based Access",
          subheading: "Large family homes available through structured purchase paths"
        },
        pageCopy: [
          "Naperville is known for large, well-maintained executive homes often owned by families approaching retirement or transition.",
          "We specialize in structured agreements that allow owners to step back without selling outright — and buyers to secure high-quality homes with time-based purchase options.",
          "This is not a rental model. It is a pathway to ownership built around clarity, control, and alignment."
        ],
        includedAccess: [
          "Executive single-family homes",
          "Large family residences",
          "High-end suburban properties"
        ],
        howItWorks: [
          { step: "01", title: "Request details about available properties or transitions" },
          { step: "02", title: "We assess buyer-owner alignment" },
          { step: "03", title: "Structured terms are negotiated" },
          { step: "04", title: "Agreement executed privately" }
        ],
        nearbyAreas: ["Wheaton", "Downers Grove", "Aurora", "Oak Brook"]
      },
      {
        city: "Boca Raton",
        slug: "luxury-residences-flexible-terms-boca-raton",
        title: "Luxury Residence Access Boca Raton",
        seo: {
          metaTitle: "Boca Raton Luxury Homes | Rent-to-Own & Terms-Based Access",
          metaDescription: "Private access to Boca Raton luxury homes through flexible purchase structures. Designed for buyers and sellers seeking alternatives.",
          h1: "Boca Raton Luxury Property Access Without Immediate Financing",
          subheading: "Flexible ownership structures for discerning buyers and owners"
        },
        pageCopy: [
          "Many Boca Raton homeowners prefer flexibility, income continuity, and simplicity over traditional listings.",
          "We work behind the scenes to structure terms-based property arrangements that benefit both sides: Owners receive relief and predictable income. Buyers gain access to premium homes while preparing for final purchase."
        ],
        includedAccess: [
          "Luxury single-family homes",
          "Waterfront properties",
          "High-end condominiums"
        ],
        howItWorks: [
          { step: "01", title: "Explore private property access opportunities" },
          { step: "02", title: "We verify alignment and terms fit" },
          { step: "03", title: "Structured arrangement is negotiated" },
          { step: "04", title: "Agreement executed between parties" }
        ],
        nearbyAreas: ["Delray Beach", "Palm Beach Gardens", "Parkland", "Wellington"]
      },
      {
        city: "Bellevue",
        slug: "luxury-homes-private-terms-bellevue",
        title: "Luxury Home Access Bellevue",
        seo: {
          metaTitle: "Bellevue Luxury Homes | Flexible Purchase Structures",
          metaDescription: "Bellevue luxury homes available through structured, private purchase terms. A refined alternative to traditional buying.",
          h1: "Bellevue Luxury Homes — A Smarter Path to Ownership",
          subheading: "Premium homes accessible through private, terms-based arrangements"
        },
        pageCopy: [
          "Bellevue's housing market is competitive, high-priced, and often inaccessible through conventional financing alone.",
          "Our model allows qualified buyers to secure and control premium homes while working toward ownership over time — and provides owners with a clean, structured exit.",
          "This is ideal for tech professionals, executives, and owners seeking privacy and flexibility."
        ],
        includedAccess: [
          "Luxury single-family homes",
          "Waterfront estates",
          "Modern executive residences"
        ],
        howItWorks: [
          { step: "01", title: "Request access to current opportunities" },
          { step: "02", title: "We assess buyer qualifications and owner alignment" },
          { step: "03", title: "Private terms are structured" },
          { step: "04", title: "Agreement executed directly" }
        ],
        nearbyAreas: ["Kirkland", "Redmond", "Mercer Island", "Medina"]
      }
    ]
  },
  {
    id: "business-acquisitions",
    name: "Business Acquisitions",
    tagline: "Seller-Financed Transitions",
    description: "Private, off-market acquisition of established businesses. Seller financing only. Quiet transitions focused on continuity.",
    href: "/business-acquisitions",
    offers: [
      {
        city: "Columbus",
        slug: "waste-management-business-columbus-ohio",
        title: "Waste Management Business Acquisitions Columbus",
        seo: {
          metaTitle: "Sell or Buy a Waste Management Business in Columbus, OH | Seller Financing",
          metaDescription: "Private acquisition of waste management and recycling businesses in Columbus, Ohio. Seller financing only. Quiet, off-market transitions.",
          h1: "Waste Management & Recycling Business Acquisitions in Columbus, Ohio",
          subheading: "Quiet transitions for established operators — seller financing only"
        },
        pageCopy: [
          "Columbus is home to a large number of long-standing waste management and recycling businesses built over decades by owner-operators. Many of these businesses are profitable, contract-driven, and operationally stable — but succession planning is often overlooked.",
          "We work with owners who are considering retirement, partial exit, or a structured transition and prefer a seller-financed acquisition rather than a public sale or broker-driven auction.",
          "Our approach is simple and private: We acquire or place businesses using seller financing. We prioritize continuity for employees, customers, and municipalities. We avoid public listings and speculative buyers.",
          "This is not a brokerage service. We are a principal buyer and structured intermediary working with aligned capital partners when appropriate."
        ],
        includedAccess: [
          "Waste hauling",
          "Recycling facilities",
          "Transfer stations",
          "Industrial waste services"
        ],
        howItWorks: [
          { step: "01", title: "Request a confidential conversation" },
          { step: "02", title: "We assess fit and transition structure" },
          { step: "03", title: "Seller financing terms are negotiated" },
          { step: "04", title: "Ownership transitions with continuity focus" }
        ],
        nearbyAreas: ["Dublin", "Westerville", "Grove City", "Reynoldsburg"]
      },
      {
        city: "Tampa",
        slug: "hospice-senior-care-business-tampa-florida",
        title: "Hospice & Senior Care Business Acquisitions Tampa",
        seo: {
          metaTitle: "Sell a Hospice or Senior Care Business in Tampa, FL | Seller Financing",
          metaDescription: "Private acquisition of hospice and senior care businesses in Tampa. Seller-financed transitions focused on continuity and legacy.",
          h1: "Hospice & Senior Care Business Transitions in Tampa, Florida",
          subheading: "Preserving care, staff, and legacy through structured acquisition"
        },
        pageCopy: [
          "Tampa is one of the most active senior-care markets in the country, and many hospice and home care businesses were founded by owners who are now approaching retirement.",
          "We work with licensed, established operators seeking a quiet, seller-financed transition that preserves patient care standards and staff relationships.",
          "Our model prioritizes regulatory continuity, operational stability, gradual ownership transitions, and seller participation when desired.",
          "We are not a listing service and do not solicit public bids."
        ],
        includedAccess: [
          "Hospice care providers",
          "Home health agencies",
          "Senior care services"
        ],
        howItWorks: [
          { step: "01", title: "Start a confidential review" },
          { step: "02", title: "We assess regulatory and operational fit" },
          { step: "03", title: "Seller financing structure is negotiated" },
          { step: "04", title: "Transition preserves care continuity" }
        ],
        nearbyAreas: ["St. Petersburg", "Clearwater", "Brandon", "Sarasota"]
      },
      {
        city: "Riverside",
        slug: "hvac-refrigeration-business-riverside-california",
        title: "HVAC & Refrigeration Business Acquisitions Riverside",
        seo: {
          metaTitle: "Sell an HVAC Business in Riverside, CA | Seller Financing Only",
          metaDescription: "Private acquisition of HVAC and refrigeration companies in the Inland Empire. Seller financing required. Quiet, direct transitions.",
          h1: "HVAC & Refrigeration Business Acquisitions in Riverside & Inland Empire",
          subheading: "Owner-built service businesses seeking structured transition"
        },
        pageCopy: [
          "The Inland Empire has one of the largest concentrations of HVAC and refrigeration service companies in California. Many were built by founders who now want to reduce operational burden without dismantling what they've built.",
          "We focus on seller-financed acquisitions that allow gradual transitions, continued customer service quality, technology and operational improvements, and revenue growth post-transition."
        ],
        includedAccess: [
          "HVAC service companies",
          "Commercial refrigeration",
          "Industrial cooling services"
        ],
        howItWorks: [
          { step: "01", title: "Request a private discussion" },
          { step: "02", title: "We evaluate operational fit" },
          { step: "03", title: "Seller financing terms are structured" },
          { step: "04", title: "Transition supports business continuity" }
        ],
        nearbyAreas: ["San Bernardino", "Ontario", "Corona", "Fontana"]
      },
      {
        city: "Allentown",
        slug: "cold-storage-logistics-business-allentown-pennsylvania",
        title: "Cold Storage & Logistics Business Acquisitions Allentown",
        seo: {
          metaTitle: "Sell a Logistics or Cold Storage Business in Allentown, PA",
          metaDescription: "Private seller-financed acquisition of logistics and cold storage companies in the Lehigh Valley. Confidential, off-market.",
          h1: "Logistics & Cold Storage Business Transitions in the Lehigh Valley",
          subheading: "Family-owned logistics assets seeking structured transition"
        },
        pageCopy: [
          "The Lehigh Valley is a critical logistics corridor, home to family-owned freight, warehousing, and cold storage businesses serving the Northeast.",
          "We work with owners seeking liquidity without disruption, seller-financed exits, and continued involvement if desired."
        ],
        includedAccess: [
          "Cold storage facilities",
          "Freight logistics",
          "Warehouse operations"
        ],
        howItWorks: [
          { step: "01", title: "Explore a confidential transition discussion" },
          { step: "02", title: "We assess operational and asset fit" },
          { step: "03", title: "Seller financing is negotiated" },
          { step: "04", title: "Ownership transitions with minimal disruption" }
        ],
        nearbyAreas: ["Bethlehem", "Easton", "Reading", "Quakertown"]
      },
      {
        city: "Kansas City",
        slug: "commercial-cleaning-business-kansas-city-missouri",
        title: "Commercial Cleaning Business Acquisitions Kansas City",
        seo: {
          metaTitle: "Sell a Commercial Cleaning Business in Kansas City | Seller Financing",
          metaDescription: "Private acquisition of commercial cleaning and facility maintenance companies in Kansas City. Seller-financed only.",
          h1: "Commercial Cleaning & Facility Maintenance Business Transitions in Kansas City",
          subheading: "Recurring-revenue service businesses seeking succession"
        },
        pageCopy: [
          "Commercial cleaning and facility maintenance businesses are among the most stable recurring-revenue operations — and many are owned by operators ready to step back.",
          "We acquire or place these businesses using seller financing, ensuring client continuity, staff retention, and operational improvements."
        ],
        includedAccess: [
          "Commercial cleaning",
          "Facility maintenance",
          "Janitorial services"
        ],
        howItWorks: [
          { step: "01", title: "Begin a private conversation about your transition" },
          { step: "02", title: "We assess client base and operations" },
          { step: "03", title: "Seller financing terms are structured" },
          { step: "04", title: "Transition ensures client and staff continuity" }
        ],
        nearbyAreas: ["Overland Park", "Olathe", "Independence", "Lee's Summit"]
      }
    ]
  }
];

// What the site actually shows: bookable categories list only the offers that pass the publishing
// gate (data/*.json from Airtable); the rest are unchanged.
export const CATEGORIES: Category[] = buildCategories(LEGACY_CATEGORIES);
