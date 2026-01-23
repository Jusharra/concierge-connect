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
import businessNewYork from "@/assets/offers/business-new-york.jpg";
import businessSanFrancisco from "@/assets/offers/business-san-francisco.jpg";
import businessChicago from "@/assets/offers/business-chicago.jpg";
import businessDallas from "@/assets/offers/business-dallas.jpg";
import businessLondon from "@/assets/offers/business-london.jpg";

// Map offer slugs to their images
export const offerImages: Record<string, string> = {
  // Private Air
  "private-jet-charter-los-angeles": jetLosAngeles,
  "private-jet-charter-miami": jetMiami,
  "private-jet-charter-new-york": jetNewYork,
  "private-jet-charter-las-vegas": jetLasVegas,
  "private-jet-charter-aspen": jetAspen,
  
  // Yachts
  "day-yacht-charter-miami": yachtMiami,
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
  "waste-management-business-columbus-ohio": businessNewYork,
  "hospice-senior-care-business-tampa-florida": businessSanFrancisco,
  "hvac-refrigeration-business-riverside-california": businessChicago,
  "cold-storage-logistics-business-allentown-pennsylvania": businessDallas,
  "commercial-cleaning-business-kansas-city-missouri": businessLondon,
};

// Get image for an offer by slug
export const getOfferImage = (slug: string): string | undefined => {
  return offerImages[slug];
};
