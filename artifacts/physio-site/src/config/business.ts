export const BUSINESS_CONFIG = {
  name: "Goswami Rehab",
  siteUrl: "https://goswamirehab.in",
  headOffice: {
    branchName: "Gift Rehab Center",
    displayName: "Goswami Rehab (Head Office: Gift Rehab Center)",
    description: "Head Office & Doctor Training Centre, by appointment only",
    walkInClinic: false,
    googleMapsUrl: "https://maps.app.goo.gl/3BGdMnA4RTsdhp4x7",
    address: {
      streetAddress: "E-60, Bank Colony, Murlipura Scheme, Murlipura",
      addressLocality: "Jaipur",
      addressRegion: "Rajasthan",
      postalCode: "302039",
      addressCountry: "IN",
      displayAddress:
        "Gift Rehab Center, E-60, Bank Colony, Murlipura Scheme, Murlipura, Jaipur, Rajasthan 302039",
      localityLine: "Murlipura, Jaipur, Rajasthan 302039",
    },
  },
  contact: {
    phone: "",
    whatsapp: "",
    email: "",
  },
  availability: {
    online: "Online consultations available 24/7",
    inPerson: "In-person care by appointment only",
  },
  serviceAreaProfiles: [
    {
      areaName: "",
      label: "Service area profile",
      googleMapsUrl: "https://maps.app.goo.gl/8cZ9zeHaKFL8jv6g6?g_st=ac",
    },
    {
      areaName: "",
      label: "Service area profile",
      googleMapsUrl: "https://maps.app.goo.gl/Tg9emgztKKgmXs67A?g_st=ac",
    },
  ],
  organizationProfileAlternateUrls: [
    "https://maps.app.goo.gl/9xV7ez6hS37Agkfa9",
  ],
  services: [
    "Online physiotherapy consultation",
    "Home physiotherapy",
    "Online nutritionist and dietitian consultation",
    "Exercise physiology",
    "Rehabilitation and physiotherapy",
  ],
} as const;

export const BUSINESS_SCHEMA_SAME_AS = [
  BUSINESS_CONFIG.headOffice.googleMapsUrl,
  ...BUSINESS_CONFIG.organizationProfileAlternateUrls,
];