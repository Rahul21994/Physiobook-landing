import { hindiCityRoutes, getHindiCityPath } from "./hindi-city-routes";
import { hindiStaticRouteRegistry } from "./hindi-static-routes";

export { HINDI_CITY_ROUTE_PATTERN } from "./hindi-static-routes";
export { hindiStaticRouteRegistry } from "./hindi-static-routes";

export const hindiRouteRegistry = [
  ...hindiStaticRouteRegistry,
  ...hindiCityRoutes.map((city) => ({
    path: getHindiCityPath(city.slug),
    englishPath: `/physiotherapist-at-home/${city.slug}`,
    page: "city" as const,
    citySlug: city.slug,
    title: city.title,
    description: city.description,
    revision: city.revision,
    sourceFiles: [
      "src/pages/hindi-city/index.tsx",
      "src/lib/hindi-city-routes.generated.json",
      "src/lib/cities.ts",
      "src/lib/city-journal.ts",
      "src/lib/blog-index.ts",
      "src/lib/data.ts",
      "src/lib/location-services.ts",
      "src/lib/pricing.ts",
    ],
  })),
];