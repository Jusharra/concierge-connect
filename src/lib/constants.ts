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
