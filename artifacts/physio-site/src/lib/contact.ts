import { BUSINESS_CONFIG } from "@/config/business";

const phoneDigits = BUSINESS_CONFIG.contact.phone.replace(/\D/g, "");
export const BUSINESS_NAME = BUSINESS_CONFIG.name;
export const BUSINESS_PHONE_DISPLAY = BUSINESS_CONFIG.contact.phone;
export const BUSINESS_PHONE_E164 = phoneDigits ? `+${phoneDigits}` : "";
export const BUSINESS_PHONE_TEL = BUSINESS_PHONE_E164 ? `tel:${BUSINESS_PHONE_E164}` : "";
export const BUSINESS_EMAIL = BUSINESS_CONFIG.contact.email;
export const BUSINESS_WHATSAPP_URL = BUSINESS_CONFIG.contact.whatsapp;
export const BUSINESS_GBP_URL = BUSINESS_CONFIG.headOffice.googleMapsUrl;
export const BUSINESS_HQ_MAP_URL = BUSINESS_GBP_URL;

// Compatibility aliases for older page imports. The UI should use the generic
// service-area profile list from BUSINESS_CONFIG, not infer a city from a map URL.
export const BUSINESS_GURUGRAM_GBP_URL =
  BUSINESS_CONFIG.serviceAreaProfiles[0]?.googleMapsUrl ?? "";
export const BUSINESS_SISTER_GBP_URL =
  BUSINESS_CONFIG.serviceAreaProfiles[1]?.googleMapsUrl ?? "";
export const BUSINESS_HQ_ADDRESS = {
  streetAddress: BUSINESS_CONFIG.headOffice.address.streetAddress,
  localityLine: BUSINESS_CONFIG.headOffice.address.localityLine,
  displayAddress: BUSINESS_CONFIG.headOffice.address.displayAddress,
  addressLocality: BUSINESS_CONFIG.headOffice.address.addressLocality,
  addressRegion: BUSINESS_CONFIG.headOffice.address.addressRegion,
  postalCode: BUSINESS_CONFIG.headOffice.address.postalCode,
  addressCountry: BUSINESS_CONFIG.headOffice.address.addressCountry,
};
