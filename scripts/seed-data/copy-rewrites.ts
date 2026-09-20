/**
 * Rewritten editorial copy for the 15 bookable offers (jets, yachts, exotic cars).
 *
 * The original copy in src/lib/constants.ts described "concierge-coordinated access" and said
 * "Payment and execution occur directly with the operator". That contradicts the reserve-with-a-deposit
 * model, so the seed script writes these versions to Airtable instead. Local facts (places, vessel
 * types, routes) are kept from the original; brokering language and pricing promises are removed.
 *
 * Rules applied: prices are always "starting at", availability is confirmed by the operator, no
 * "free", no "dispatch", no description of fees or partner terms.
 */

export interface RewrittenCopy {
  subheading: string;
  pageCopy: string[];
}

export const HOW_IT_WORKS: Record<"private-air" | "yachts" | "exotic-cars", string[]> = {
  "private-air": [
    "Choose a package and reserve with a deposit, or request a quote for a custom trip",
    "The operator confirms aircraft and availability for your dates",
    "You receive confirmed pricing and trip details",
    "Pay the remaining balance directly to the operator",
  ],
  yachts: [
    "Choose a package and reserve with a deposit, or request a quote for a custom charter",
    "The operator confirms the vessel, crew and availability for your dates",
    "You receive confirmed pricing and your itinerary",
    "Pay the remaining balance directly to the operator",
  ],
  "exotic-cars": [
    "Choose a package and reserve with a deposit, or request a quote for a custom rental",
    "The rental partner confirms the vehicle and availability for your dates",
    "You receive confirmed pricing and rental terms",
    "Pay the remaining balance directly to the rental partner",
  ],
};

/** Included-access lines that used "coordination" wording. */
export const INCLUDED_REWRITES: Record<string, string> = {
  "Executive and entertainment travel coordination": "Executive and entertainment travel",
  "Crew, catering, and ground coordination": "Crew, catering, and ground transportation",
  "International routing coordination": "International routing",
  "Event and Grand Prix hospitality coordination": "Event and Grand Prix hospitality",
  "Beach club and restaurant coordination": "Beach club and restaurant arrangements",
  "Beach club and nightlife coordination": "Beach club and nightlife access",
};

export const COPY: Record<string, RewrittenCopy> = {
  "private-jet-charter-miami": {
    subheading:
      "Private jets and helicopters from Miami, Fort Lauderdale and Palm Beach. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Private jet charter in Miami runs through one of the world's busiest private aviation hubs. Choose a package and reserve with a deposit, or request a quote for a custom itinerary. Routing, timing and aircraft are confirmed by the operator before you pay the balance.",
      "Light, midsize and heavy jets are available for same-day and multi-day trips, along with helicopter transfers across South Florida. Every trip is priced to your route and dates, so any price shown is a starting-at figure.",
      "We do not publish aircraft inventory. Availability is confirmed by the operator for your dates.",
    ],
  },
  "private-jet-charter-los-angeles": {
    subheading:
      "Private jets and helicopters across Southern California. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Private jet charter in Los Angeles covers executive travel, entertainment schedules and time-sensitive routing across Southern California. Reserve with a deposit or request a quote, and the operator confirms aircraft and availability for your dates.",
      "Helicopter transfers across the LA metro and departures from airports such as Van Nuys and Burbank keep ground time short when privacy and efficiency matter.",
      "Prices are shown as starting-at figures. Your confirmed price reflects your route, aircraft and timing.",
    ],
  },
  "private-jet-charter-new-york": {
    subheading:
      "Private jets and helicopters across New York City and the surrounding airports. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Private jet charter in New York serves business and executive travel across the metropolitan area, with departures from airports including Teterboro. Reserve with a deposit or request a quote and the operator confirms your routing and aircraft.",
      "Short-notice and scheduled itineraries are both supported, with helicopter transfers within the city. There is no public inventory to browse: availability is confirmed for your dates.",
    ],
  },
  "private-jet-charter-dubai": {
    subheading:
      "Long-range and regional private jets from Dubai. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Private jet charter in Dubai gives access to long-range aircraft for regional and intercontinental routing, with departures from Dubai International and Al Maktoum International. Request a quote for your route and the operator confirms availability.",
      "Trips are built around discretion, international reach and reliable execution. Any price shown is a starting-at figure and is confirmed once the operator has your route and dates.",
    ],
  },
  "private-jet-charter-london": {
    subheading:
      "Private jets from London to the UK and Europe. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Private jet charter in London covers short-haul and long-range travel across the UK and Europe, with departures from airports such as Farnborough and Biggin Hill. Reserve with a deposit or request a quote and the operator confirms aircraft and routing.",
      "Executive and corporate itineraries are supported with international routing. Prices are starting-at figures, confirmed against your route and dates.",
    ],
  },
  "yacht-charter-miami": {
    subheading:
      "Motor yachts and crewed charters across Biscayne Bay and South Florida. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Yacht charter in Miami puts you on the water in one of the world's premier yachting destinations. Reserve with a deposit or request a quote, and the operator confirms the vessel, crew and availability for your date and guest count.",
      "Motor yachts and sailing vessels are available for day charters and multi-day itineraries, with crewed and captained options, catering and water toys. Prices are starting-at figures.",
      "We do not publish vessel inventory. Availability is confirmed by the operator for your dates.",
    ],
  },
  "superyacht-charter-monaco": {
    subheading:
      "Superyachts and luxury vessels on the Côte d'Azur. Request a quote for your dates.",
    pageCopy: [
      "Superyacht charter in Monaco offers vessels from 30 to 100+ meters with full crew and chef service, in the centre of the Mediterranean superyacht scene. Request a quote and the operator confirms vessel availability and itinerary for your dates.",
      "Day charters, weekly itineraries, tender boats and event hospitality including Grand Prix week are available. Prices are starting-at figures and depend heavily on season and vessel.",
    ],
  },
  "yacht-charter-st-tropez": {
    subheading:
      "Motor yachts, sailing vessels and superyachts along the Côte d'Azur. Request a quote for your dates.",
    pageCopy: [
      "Yacht charter in St. Tropez is the classic Mediterranean experience: motor yachts, sailing vessels and superyachts anchored off Pampelonne and along the Côte d'Azur. Request a quote and the operator confirms vessel and crew for your dates.",
      "Day trips and extended charters are crewed by local specialists, with water sports and tender service on board. Prices are starting-at figures.",
    ],
  },
  "yacht-charter-bahamas": {
    subheading:
      "Crewed yachts and catamarans across the Bahamian islands. Request a quote for your dates.",
    pageCopy: [
      "Yacht charter in the Bahamas opens up more than 700 islands and cays, with operators based in Nassau, the Exumas and beyond. Request a quote for your island-hopping, diving or fishing itinerary and the operator confirms the vessel and route.",
      "Crewed motor yachts and catamarans are available for multi-day trips with local captains, provisioning and water sports. Prices are starting-at figures, and vessels are not listed publicly.",
    ],
  },
  "yacht-charter-ibiza": {
    subheading:
      "Day charters, sunset cruises and multi-day itineraries around Ibiza and Formentera. Request a quote for your dates.",
    pageCopy: [
      "Yacht charter in Ibiza covers day charters, sunset cruises and multi-day itineraries around the Balearic Islands, including Formentera day trips. Request a quote and the operator confirms the vessel and your itinerary.",
      "Motor yachts and sailing vessels are crewed by local specialists, with beach club and nightlife access available on request. Prices are starting-at figures.",
    ],
  },
  "exotic-car-rental-miami": {
    subheading:
      "Supercars, luxury sedans and SUVs across Miami and South Florida. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Exotic car rental in Miami covers supercars and high-performance vehicles as well as luxury sedans and SUVs, for short-term and multi-day rentals. Reserve with a deposit or request a quote, and the rental partner confirms the vehicle and your dates.",
      "Chauffeur or self-drive options are available where permitted. Vehicles are not listed publicly, and prices are starting-at figures.",
    ],
  },
  "exotic-car-rental-los-angeles": {
    subheading:
      "Exotic supercars and luxury vehicles across Southern California. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Exotic car rental in Los Angeles offers supercars, hypercars, luxury sedans and SUVs for daily, weekend and extended rentals, suited to entertainment, executive travel and special occasions. Reserve with a deposit or request a quote and the rental partner confirms the vehicle and dates.",
      "Chauffeur services are available on request. Prices are starting-at figures.",
    ],
  },
  "exotic-car-rental-new-york": {
    subheading:
      "Exotic and luxury vehicles across New York City. Reserve with a deposit or request a quote.",
    pageCopy: [
      "Exotic car rental in New York provides premium and high-performance vehicles for short-term and multi-day rentals, without the friction of public rental platforms. Request a quote and the rental partner confirms availability and terms.",
      "Executive and event transportation is supported across Manhattan, Brooklyn and Long Island. Prices are starting-at figures.",
    ],
  },
  "exotic-car-rental-dubai": {
    subheading:
      "Exotic supercars and luxury vehicles across Dubai. Request a quote for your dates.",
    pageCopy: [
      "Exotic car rental in Dubai gives access to supercars and luxury vehicles for daily and extended rentals, with chauffeur or self-drive options and VIP event transportation. Request a quote and the rental partner confirms the vehicle and dates.",
      "From Downtown Dubai to Palm Jumeirah and Dubai Marina, vehicles are matched to your plans. Prices are starting-at figures.",
    ],
  },
  "exotic-car-rental-london": {
    subheading:
      "Exotic and luxury vehicles across London and the UK. Request a quote for your dates.",
    pageCopy: [
      "Exotic car rental in London covers exotic and luxury vehicles for executive and leisure use, on short-term and extended rentals, with chauffeur services available. Request a quote and the rental partner confirms availability and terms.",
      "Vehicles are available across central London including Mayfair, Kensington and Canary Wharf. Prices are starting-at figures.",
    ],
  },
};
