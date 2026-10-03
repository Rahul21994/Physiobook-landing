import { Link, useLocation } from "wouter";
import { ChevronRight } from "lucide-react";
import {
  legacyServiceBreadcrumbs,
  serviceGuideBreadcrumbs,
} from "@/lib/service-guide-map";

const knownLabels: Record<string, string> = {
  booking: "Book an Appointment",
  contact: "Contact",
  feedback: "Patient Feedback",
  cities: "Cities We Serve",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
  blog: "Journal",
  services: "Treatment Services",
  "physiotherapist-at-home": "Physiotherapy by City",
  "physiotherapist-at-home-in": "Physiotherapy by State",
  gurgaon: "Gurugram",
};

// These are the only breadcrumb parents that have a real route. Collection
// prefixes such as "/services" and "/blog/category" are not standalone pages,
// so rendering them as links creates crawlable 404s.
const linkableBreadcrumbPaths = new Set([
  "/",
  "/booking",
  "/contact",
  "/feedback",
  "/cities",
  "/blog",
  "/privacy",
  "/terms",
]);

function humanize(value: string) {
  return decodeURIComponent(value)
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function buildItems(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const items: Array<{ label: string; href?: string }> = [{ label: "Home", href: "/" }];
  if (segments[0] === "services" && segments[1]) {
    const guide = legacyServiceBreadcrumbs[segments[1]];
    items.push({ label: "Treatment Services" });
    if (guide?.breadcrumbParent) {
      items.push({ label: guide.breadcrumbParent });
    }
    items.push({
      label: guide?.shortTitle ?? humanize(segments[1]),
      href: guide?.routePath ?? pathname,
    });
    return items;
  }
  const rootGuide = serviceGuideBreadcrumbs[pathname];
  if (rootGuide) {
    items.push({ label: "Treatment Services" });
    if (rootGuide.breadcrumbParent) {
      items.push({ label: rootGuide.breadcrumbParent });
    }
    items.push({ label: rootGuide.shortTitle, href: pathname });
    return items;
  }

  let path = "";

  segments.forEach((segment, index) => {
    path += `/${segment}`;
    const parent = segments[index - 1];
    let label = knownLabels[segment] ?? humanize(segment);

    if (parent === "blog" && index === 1 && !knownLabels[segment]) label = humanize(segment);
    if (parent === "services" && index === 1 && !knownLabels[segment]) label = humanize(segment);
    if (
      (parent === "physiotherapist-at-home" || parent === "physiotherapist-at-home-in") &&
      !knownLabels[segment]
    ) {
      label = humanize(segment);
    }

    items.push({
      label,
      href: linkableBreadcrumbPaths.has(path) || index === segments.length - 1 ? path : undefined,
    });
  });

  return items;
}

export function Breadcrumbs() {
  const [location] = useLocation();
  const items = buildItems(location.split("?")[0]);

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-7xl pt-5">
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
          {items.map((item, index) => {
            const current = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                {index > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" aria-hidden="true" />}
                {current ? (
                  <span aria-current="page" className="font-medium text-foreground/75">{item.label}</span>
                ) : (
                  item.href ? (
                    <Link href={item.href} className="hover:text-primary transition-colors">{item.label}</Link>
                  ) : (
                    <span>{item.label}</span>
                  )
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}