// Site-wide constants
export const SITE_NAME = "Luxe Concierge";
export const PHONE_NUMBER = "+1 (888) 555-0199";
export const PHONE_HREF = "tel:+18885550199";
export const EMAIL = "concierge@luxe.com";

// Categories with their metadata
export const CATEGORIES = [
  {
    id: "private-air",
    name: "Private Air",
    tagline: "Transcend Commercial Travel",
    description: "Access elite private aviation partners for charter flights, jet cards, and fractional ownership opportunities across North America and beyond.",
    href: "/private-air",
    offers: [
      { city: "Los Angeles", slug: "private-jet-charter-los-angeles", title: "Private Jet Charter Los Angeles" },
      { city: "Miami", slug: "private-jet-charter-miami", title: "Private Jet Charter Miami" },
      { city: "New York", slug: "private-jet-charter-new-york", title: "Private Jet Charter New York" },
      { city: "Las Vegas", slug: "private-jet-charter-las-vegas", title: "Private Jet Charter Las Vegas" },
      { city: "Aspen", slug: "private-jet-charter-aspen", title: "Private Jet Charter Aspen" },
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
      { city: "Ibiza", slug: "yacht-charter-ibiza", title: "Yacht Charter Ibiza" },
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
      { city: "New York", slug: "exotic-car-rental-new-york", title: "Exotic Car Rental New York" },
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
      { city: "Aspen", slug: "mountain-estates-aspen", title: "Mountain Estates Aspen" },
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
      { city: "London", slug: "business-acquisitions-london", title: "Business Acquisitions London" },
    ]
  },
] as const;

export type Category = typeof CATEGORIES[number];
export type Offer = Category['offers'][number];
