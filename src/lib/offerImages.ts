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
import propertyNewYork from "@/assets/offers/property-new-york.jpg";
import propertyBeverlyHills from "@/assets/offers/property-beverly-hills.jpg";
import propertyMalibu from "@/assets/offers/property-malibu.jpg";
import propertyPalmBeach from "@/assets/offers/property-palm-beach.jpg";
import propertyAspen from "@/assets/offers/property-aspen.jpg";

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
  "off-market-luxury-homes-new-york": propertyNewYork,
  "luxury-estates-beverly-hills": propertyBeverlyHills,
  "beachfront-homes-malibu": propertyMalibu,
  "luxury-properties-palm-beach": propertyPalmBeach,
  "mountain-estates-aspen": propertyAspen,
  
  // Business Acquisitions
  "business-acquisitions-new-york": businessNewYork,
  "tech-acquisitions-san-francisco": businessSanFrancisco,
  "business-acquisitions-chicago": businessChicago,
  "business-acquisitions-dallas": businessDallas,
  "business-acquisitions-london": businessLondon,
};

// Get image for an offer by slug
export const getOfferImage = (slug: string): string | undefined => {
  return offerImages[slug];
};
