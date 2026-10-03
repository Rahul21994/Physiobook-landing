export const HINDI_CITY_ROUTE_PATTERN = "/hi/physiotherapist-at-home/:city";

export const hindiStaticRoutePages = [
  { path: "/hi/booking", page: "booking" },
  { path: "/hi/online-care", page: "online-care" },
  { path: "/hi/contact", page: "contact" },
  { path: "/hi/about", page: "about" },
  { path: "/hi/home-physiotherapy", page: "home-physiotherapy" },
] as const;

export type HindiStaticPage = (typeof hindiStaticRoutePages)[number]["page"];