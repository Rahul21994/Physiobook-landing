import serviceGuideRouteData from "./service-guide-routes.json";

export const serviceGuideSlugs: Record<string, string> = {
  "physio-session": "homecare-physiotherapy",
  "cardiopulmonary-rehab": "cardiopulmonary-rehabilitation",
  "advanced-complex-recovery": "advanced-complex-case-recovery",
  "assessment-protocols": "clinical-assessment-evaluation",
  "sports-enhancement": "sports-enhancement-consultation",
  "functional-training": "functional-training",
  "nutritional-consultation": "nutritional-consultation",
  "general-consultation": "clinical-assessment-evaluation",
  rehabilitation: "rehabilitation-programs",
  "pregnancy-postpartum-support": "pregnancy-postpartum-support",
  "infant-early-development-physiotherapy": "infant-early-development-physiotherapy",
  "pediatric-disability-rehabilitation": "pediatric-disability-rehabilitation",
};

const rootRouteByLegacySlug = Object.fromEntries(
  Object.entries(serviceGuideRouteData.legacyRedirects).map(([legacyPath, canonicalPath]) => [
    legacyPath.slice("/services/".length),
    canonicalPath,
  ]),
) as Record<string, string>;

export function getServiceGuideHrefForSlug(slug: string): string {
  return rootRouteByLegacySlug[slug] ?? `/services/${slug}`;
}

export const serviceGuidePaths: Record<string, string> = Object.fromEntries(
  Object.entries(serviceGuideSlugs).map(([serviceId, slug]) => [
    serviceId,
    getServiceGuideHrefForSlug(slug),
  ]),
);

export const serviceGuideRootPaths = serviceGuideRouteData.rootPaths as string[];
export const legacyServicePathRedirects =
  serviceGuideRouteData.legacyRedirects as Record<string, string>;
export const serviceGuideBreadcrumbs = serviceGuideRouteData.breadcrumbs as Record<
  string,
  { shortTitle: string; breadcrumbParent?: string }
>;
export const legacyServiceBreadcrumbs = serviceGuideRouteData.legacyBreadcrumbs as Record<
  string,
  { shortTitle: string; breadcrumbParent?: string; routePath?: string }
>;