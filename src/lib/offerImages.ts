// Private Air offer images
import jetLosAngeles from "@/assets/offers/jet-los-angeles.jpg";
import jetMiami from "@/assets/offers/jet-miami.jpg";
import jetNewYork from "@/assets/offers/jet-new-york.jpg";
import jetLasVegas from "@/assets/offers/jet-las-vegas.jpg";
import jetAspen from "@/assets/offers/jet-aspen.jpg";

// Yacht offer images
import yachtMiami from "@/assets/offers/yacht-miami.jpg";
import yachtMonaco from "@/assets/offers/yacht-monaco.jpg";
import yachtStTropez from "@/assets/offers/yacht-st-tropez.jpg";
import yachtBahamas from "@/assets/offers/yacht-bahamas.jpg";
import yachtIbiza from "@/assets/offers/yacht-ibiza.jpg";

// Exotic car offer images
import carLosAngeles from "@/assets/offers/car-los-angeles.jpg";
import carMiami from "@/assets/offers/car-miami.jpg";
import carDubai from "@/assets/offers/car-dubai.jpg";
import carMonaco from "@/assets/offers/car-monaco.jpg";
import carNewYork from "@/assets/offers/car-new-york.jpg";

// Property offer images
import propertyScottsdale from "@/assets/offers/property-scottsdale.jpg";
import propertyNewportBeach from "@/assets/offers/property-newport-beach.jpg";
import propertyNaperville from "@/assets/offers/property-naperville.jpg";
import propertyBocaRaton from "@/assets/offers/property-boca-raton.jpg";
import propertyBellevue from "@/assets/offers/property-bellevue.jpg";

// Business acquisitions offer images
import businessColumbus from "@/assets/offers/business-columbus.jpg";
import businessTampa from "@/assets/offers/business-tampa.jpg";
import businessRiverside from "@/assets/offers/business-riverside.jpg";
import businessAllentown from "@/assets/offers/business-allentown.jpg";
import businessKansasCity from "@/assets/offers/business-kansas-city.jpg";

// Category-level hero images (fallback when an offer has no image of its own)
import heroAir from "@/assets/hero-slide-air.jpg";
import heroYachts from "@/assets/hero-slide-yachts.jpg";
import heroCars from "@/assets/hero-slide-cars.jpg";
import heroProperties from "@/assets/hero-slide-properties.jpg";
import heroBusiness from "@/assets/category-business.jpg";

export const categoryHeroImages: Record<string, string> = {
  "private-air": heroAir,
  yachts: heroYachts,
  "exotic-cars": heroCars,
  properties: heroProperties,
  "business-acquisitions": heroBusiness,
  // Placeholder until a dedicated Private Islands photo exists
  "private-islands": heroProperties,
};

// Map offer slugs to their images
export const offerImages: Record<string, string> = {
  // Private Air
  "private-jet-charter-los-angeles": jetLosAngeles,
  "private-jet-charter-miami": jetMiami,
  "private-jet-charter-new-york": jetNewYork,
  "private-jet-charter-las-vegas": jetLasVegas,
  "private-jet-charter-aspen": jetAspen,
  
  // Yachts
  "yacht-charter-miami": yachtMiami,
  "superyacht-charter-monaco": yachtMonaco,
  "yacht-charter-st-tropez": yachtStTropez,
  "yacht-charter-bahamas": yachtBahamas,
  "yacht-charter-ibiza": yachtIbiza,
  
  // Exotic Cars
  "exotic-car-rental-los-angeles": carLosAngeles,
  "exotic-car-rental-miami": carMiami,
  "exotic-car-rental-dubai": carDubai,
  "exotic-car-rental-monaco": carMonaco,
  "exotic-car-rental-new-york": carNewYork,
  
  // Properties
  "luxury-homes-structured-terms-scottsdale": propertyScottsdale,
  "luxury-homes-private-terms-newport-beach": propertyNewportBeach,
  "executive-homes-structured-terms-naperville": propertyNaperville,
  "luxury-residences-flexible-terms-boca-raton": propertyBocaRaton,
  "luxury-homes-private-terms-bellevue": propertyBellevue,
  
  // Business Acquisitions
  "waste-management-business-columbus-ohio": businessColumbus,
  "hospice-senior-care-business-tampa-florida": businessTampa,
  "hvac-refrigeration-business-riverside-california": businessRiverside,
  "cold-storage-logistics-business-allentown-pennsylvania": businessAllentown,
  "commercial-cleaning-business-kansas-city-missouri": businessKansasCity,
};

// Get image for an offer by slug
export const getOfferImage = (slug: string): string | undefined => {
  return offerImages[slug];
};
