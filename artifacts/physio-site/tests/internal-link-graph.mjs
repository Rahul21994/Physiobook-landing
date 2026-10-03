import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import serviceRouteData from "../src/lib/service-guide-routes.json" with { type: "json" };

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "dist", "public");
const siteOrigin = "https://goswamirehab.in";
const cityGuideRedirects = JSON.parse(
  fs.readFileSync(path.join(rootDir, "dist", "city-guide-redirects.json"), "utf8"),
);
const retiredCityGuidePaths = new Set(Object.keys(cityGuideRedirects));

function collectRoutes(directory, relativeDirectory = "") {
  const routes = [];

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.join(relativeDirectory, entry.name);

    if (entry.isDirectory()) {
      routes.push(...collectRoutes(absolutePath, relativePath));
      continue;
    }

    if (entry.name !== "index.html") continue;

    const route = relativeDirectory
      ? `/${relativeDirectory.split(path.sep).join("/")}`
      : "/";
    routes.push({ route, filePath: absolutePath });
  }

  return routes;
}

function readHtml(routeMap, route) {
  const page = routeMap.get(route);
  assert.ok(page, `Expected prerendered route ${route} to exist`);
  return fs.readFileSync(page.filePath, "utf8");
}

function normalizePathname(pathname) {
  if (!pathname || pathname === "/") return "/";
  const decoded = decodeURIComponent(pathname);
  return decoded.replace(/\/+$/, "") || "/";
}

function normalizeInternalHref(rawHref, sourceRoute) {
  const trimmed = rawHref.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("//") ||
    /^(?:mailto|tel|javascript|data):/i.test(trimmed)
  ) {
    return null;
  }

  let url;
  try {
    url = new URL(
      trimmed,
      `${siteOrigin}${sourceRoute === "/" ? "/" : `${sourceRoute}/`}`,
    );
  } catch {
    return null;
  }

  if (url.origin !== siteOrigin) return null;
  if (path.extname(url.pathname)) return null;
  return normalizePathname(url.pathname);
}

function extractHrefs(html) {
  return [...html.matchAll(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)]
    .map((match) => match[1] ?? match[2])
    .filter(Boolean);
}

function extractAnchors(html) {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)]
    .map((match) => {
      const href = match[1].match(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/i);
      return href
        ? { href: href[1] ?? href[2], markup: match[2] }
        : null;
    })
    .filter(Boolean);
}

function visibleAnchorText(markup) {
  return markup
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSerializedBlogPost(html, route) {
  const rootTag = html.match(/<div\b(?=[^>]*\bid="root")[^>]*>/i)?.[0];
  const attribute = rootTag?.match(/\bdata-blog-post="([^"]*)"/i)?.[1];
  assert.ok(attribute, `${route} should serialize its article data for SSR hydration`);
  const json = attribute
    .replace(/&quot;/g, "\"")
    .replace(/&#39;|&#x27;/gi, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
  return JSON.parse(json);
}

function assertContainsAll(routeMap, route, expectedTargets, label = route) {
  const html = readHtml(routeMap, route);
  for (const target of expectedTargets) {
    assert.ok(
      html.includes(`href="${target}"`) || html.includes(`href='${target}'`),
      `${label} should link to ${target}`,
    );
  }
}

const routes = collectRoutes(publicDir);
const routeMap = new Map(routes.map((page) => [page.route, page]));
assert.ok(routeMap.size > 100, "Expected the prerender build to produce the full route inventory");
for (const target of Object.values(cityGuideRedirects)) {
  assert.ok(routeMap.has(target), `Retired city guide target ${target} should be prerendered`);
}
const canonicalServiceRoutes = new Set([
  ...serviceRouteData.rootPaths,
  ...routes
    .map(({ route }) => route)
    .filter(
      (route) =>
        route.startsWith("/services/") &&
        !Object.hasOwn(serviceRouteData.legacyRedirects, route),
    ),
]);

const serviceGuidePages = routes
  .map(({ route }) => ({ route, html: readHtml(routeMap, route) }))
  .filter(({ html }) => html.includes('data-testid="service-guide-related-services"'));
assert.ok(
  serviceGuidePages.length >= 23,
  "Every published service guide should render related-service pathways",
);
for (const { route, html } of serviceGuidePages) {
  for (const [marker, label] of [
    ["service-guide-related-services", "related services"],
    ["service-guide-related-guides", "related guides"],
  ]) {
    const section = html.match(
      new RegExp(`<section\\b[^>]*data-testid="${marker}"[\\s\\S]*?</section>`, "i"),
    )?.[0];
    assert.ok(section, `${route} should render its ${label} section`);
    const targets = extractAnchors(section)
      .map(({ href }) => normalizeInternalHref(href, route))
      .filter(Boolean);
    assert.equal(targets.length, 3, `${route} should render exactly three ${label} links`);
    assert.equal(
      new Set(targets).size,
      3,
      `${route} should render three distinct ${label} destinations`,
    );
  }
}

const brokenLinks = [];
const redirectedInternalLinks = [];
for (const { route, filePath } of routes) {
  if (retiredCityGuidePaths.has(route)) continue;
  const html = fs.readFileSync(filePath, "utf8");
  for (const rawHref of extractHrefs(html)) {
    const target = normalizeInternalHref(rawHref, route);
    if (target && retiredCityGuidePaths.has(target)) {
      redirectedInternalLinks.push(
        `${route} -> ${rawHref} (redirects to ${cityGuideRedirects[target]})`,
      );
      brokenLinks.push(
        `${route} -> ${rawHref} (retired city guide; use ${cityGuideRedirects[target]})`,
      );
    } else if (target && !routeMap.has(target)) {
      brokenLinks.push(`${route} -> ${rawHref} (normalized: ${target})`);
    }
  }
}

let internalAnchorCount = 0;
const bookingQueryLinks = [];
const redirectedServiceLinks = [];
const noncanonicalInternalLinks = [];
for (const { route, filePath } of routes) {
  if (route.startsWith("/.booking-variants/")) continue;
  const html = fs.readFileSync(filePath, "utf8");
  for (const { href } of extractAnchors(html)) {
    const target = normalizeInternalHref(href, route);
    if (target) internalAnchorCount += 1;
    if (target === "/physiotherapist-at-home/gurugram") {
      redirectedInternalLinks.push(`${route} -> ${href} (Gurugram alias)`);
    }
    if (/^\/(?:hi\/)?booking\?/i.test(href.trim())) {
      bookingQueryLinks.push(`${route} -> ${href}`);
    }
    if (target && Object.hasOwn(serviceRouteData.legacyRedirects, target)) {
      redirectedServiceLinks.push(
        `${route} -> ${href} (redirects to ${serviceRouteData.legacyRedirects[target]})`,
      );
    }
    if (target) {
      const url = new URL(
        href.trim(),
        `${siteOrigin}${route === "/" ? "/" : `${route}/`}`,
      );
      if (
        url.pathname !== target ||
        /[A-Z]/u.test(url.pathname) ||
        url.search ||
        (url.hostname === "www.goswamirehab.in") ||
        (url.hostname === "goswamirehab.in" && url.protocol !== "https:")
      ) {
        noncanonicalInternalLinks.push(`${route} -> ${href}`);
      }
    }
  }
}
console.log(
  `[internal-link-audit] anchors=${internalAnchorCount} 404=${brokenLinks.length} redirects=${redirectedInternalLinks.length + redirectedServiceLinks.length} noncanonical=${noncanonicalInternalLinks.length} bookingQuery=${bookingQueryLinks.length}`,
);
assert.deepEqual(brokenLinks, [], `Broken internal page links:\n${brokenLinks.join("\n")}`);
assert.deepEqual(
  redirectedInternalLinks,
  [],
  `Internal links should not target redirects:\n${redirectedInternalLinks.join("\n")}`,
);
assert.deepEqual(
  redirectedServiceLinks,
  [],
  `Internal anchors should use canonical service destinations:\n${redirectedServiceLinks.join("\n")}`,
);
assert.deepEqual(
  bookingQueryLinks,
  [],
  `Internal booking anchors should use clean /booking or /hi/booking URLs with mode data attributes:\n${bookingQueryLinks.join("\n")}`,
);
assert.deepEqual(
  noncanonicalInternalLinks,
  [],
  `Internal anchors should use canonical URLs:\n${noncanonicalInternalLinks.join("\n")}`,
);

assertContainsAll(
  routeMap,
  "/",
  [
    "/back-pain",
    "/post-surgery-rehab",
    "/stroke-rehab",
    "/physiotherapist-at-home/moradabad",
    "/physiotherapist-at-home/tigaon",
    "/physiotherapist-at-home-in/kerala",
  ],
  "Homepage",
);

assertContainsAll(routeMap, "/hi", ["/hi/home-physiotherapy"], "Hindi homepage");

assertContainsAll(
  routeMap,
  "/cities",
  ["/home-physiotherapy", "/online-care"],
  "Cities hub",
);

const cityGuideTargets = {
  jaipur: [
    "/stroke-rehab",
    "/post-surgery-rehab",
    "/services/cardiopulmonary-rehabilitation",
  ],
  delhi: [
    "/post-surgery-rehab",
    "/stroke-rehab",
    "/services/cardiopulmonary-rehabilitation",
  ],
  gurgaon: [
    "/back-pain",
    "/services/pain-management-physiotherapy",
    "/services/clinical-assessment-evaluation",
  ],
  faridabad: [
    "/knee-pain",
    "/stroke-rehab",
    "/post-surgery-rehab",
  ],
  tigaon: [
    "/post-surgery-rehab",
    "/stroke-rehab",
    "/services/clinical-assessment-evaluation",
  ],
  bengaluru: [
    "/stroke-rehab",
    "/post-surgery-rehab",
    "/services/cardiopulmonary-rehabilitation",
  ],
  moradabad: [
    "/post-surgery-rehab",
    "/services/pain-management-physiotherapy",
    "/services/clinical-assessment-evaluation",
  ],
  mumbai: [
    "/post-surgery-rehab",
    "/stroke-rehab",
    "/services/cardiopulmonary-rehabilitation",
  ],
};

for (const [citySlug, targets] of Object.entries(cityGuideTargets)) {
  assertContainsAll(
    routeMap,
    `/physiotherapist-at-home/${citySlug}`,
    targets,
    `Indexable city page ${citySlug}`,
  );
}

const gurgaonServiceTargets = [
  "/home-physiotherapy",
  "/back-pain",
  "/services/pain-management-physiotherapy",
];
for (const route of gurgaonServiceTargets) {
  assertContainsAll(
    routeMap,
    route,
    ["/physiotherapist-at-home/gurgaon"],
    `Gurgaon service discovery from ${route}`,
  );
}

const stateRoutes = routes
  .map(({ route }) => route)
  .filter((route) => route.startsWith("/physiotherapist-at-home-in/"));
assert.ok(stateRoutes.length > 0, "Expected prerendered state routes");
for (const route of stateRoutes) {
  assertContainsAll(
    routeMap,
    route,
    ["/home-physiotherapy", "/cities"],
    `State page ${route}`,
  );
}

const priorityServiceRoutes = [
  "/back-pain",
  "/knee-pain",
  "/post-surgery-rehab",
  "/stroke-rehab",
];
for (const route of priorityServiceRoutes) {
  assertContainsAll(
    routeMap,
    route,
    priorityServiceRoutes.filter((target) => target !== route),
    `Focused service page ${route}`,
  );
}

assertContainsAll(
  routeMap,
  "/contact",
  ["/cities"],
  "Contact page",
);

const articleRoutes = routes
  .map(({ route }) => route)
  .filter((route) => route.startsWith("/blog/") && !route.startsWith("/blog/category/"));
assert.ok(articleRoutes.length >= 50, "Expected the full Journal article catalog");

const articlePathwayFailures = [];
for (const route of articleRoutes) {
  const html = readHtml(routeMap, route);
  const articleHtml = html.match(/<article\b[\s\S]*?<\/article>/i)?.[0];
  assert.ok(articleHtml, `${route} should render its article body`);
  const post = getSerializedBlogPost(html, route);
  const authoredCityRoute =
    typeof post.citySlug === "string" && post.citySlug.trim()
      ? `/physiotherapist-at-home/${post.citySlug}`
      : null;
  const expectedLocationRoute =
    authoredCityRoute && routeMap.has(authoredCityRoute) ? authoredCityRoute : "/cities";
  const articleAnchors = extractAnchors(articleHtml);
  const locationAnchors = articleAnchors.filter(
    ({ href }) => normalizeInternalHref(href, route) === expectedLocationRoute,
  );
  const serviceAnchors = articleAnchors.filter(({ href }) => {
    const target = normalizeInternalHref(href, route);
    return target && canonicalServiceRoutes.has(target);
  });
  const locationLabel = locationAnchors[0] ? visibleAnchorText(locationAnchors[0].markup) : "";
  const locationLabelIsDescriptive =
    locationLabel.length >= 14 &&
    !/^(?:read more|learn more|more info|click here|here)$/i.test(locationLabel);
  const cityNameAppearsInAnchor =
    !authoredCityRoute || !routeMap.has(authoredCityRoute) ||
    locationLabel.toLowerCase().includes(post.citySlug.replace(/-/g, " "));
  const locationLabelIsSpecific =
    expectedLocationRoute === "/cities"
      ? /cit(?:y|ies)/i.test(locationLabel) && /physiotherap/i.test(locationLabel)
      : cityNameAppearsInAnchor && /physiotherap/i.test(locationLabel);
  const serviceLabelsAreDescriptive = serviceAnchors.every(({ markup }) => {
    const label = visibleAnchorText(markup);
    return label.length >= 12 && !/^(?:read more|learn more|more info|click here|here)$/i.test(label);
  });
  const contextualBlocks = [...articleHtml.matchAll(/data-testid="article-contextual-links"/g)].length;

  if (
    locationAnchors.length !== 1 ||
    !locationLabelIsDescriptive ||
    !locationLabelIsSpecific ||
    serviceAnchors.length === 0 ||
    !serviceLabelsAreDescriptive ||
    contextualBlocks !== 1
  ) {
    articlePathwayFailures.push(
      `${route} (location=${locationAnchors.length}, descriptive=${locationLabelIsDescriptive}, service=${serviceAnchors.length}, service labels=${serviceLabelsAreDescriptive}, contextual blocks=${contextualBlocks})`,
    );
  }
}
assert.deepEqual(
  articlePathwayFailures,
  [],
  `Journal articles need one descriptive, data-backed location link and a service link in one contextual block:\n${articlePathwayFailures.join("\n")}`,
);

const serviceGuideRoutes = [...new Set(
  serviceRouteData.rootPaths.filter((route) => routeMap.has(route)),
)];
assert.ok(serviceGuideRoutes.length > 0, "Expected the service-guide route inventory");
const serviceGuidePathwayFailures = [];
for (const route of serviceGuideRoutes) {
  const html = readHtml(routeMap, route);
  const serviceSection = html.match(
    /<section\b(?=[^>]*data-testid="service-guide-related-services")[\s\S]*?<\/section>/i,
  )?.[0];
  const editorialSection = html.match(
    /<section\b(?=[^>]*data-testid="service-guide-related-guides")[\s\S]*?<\/section>/i,
  )?.[0];
  const serviceLinks = serviceSection
    ? extractAnchors(serviceSection).filter(({ href }) => {
        const target = normalizeInternalHref(href, route);
        return target && canonicalServiceRoutes.has(target);
      })
    : [];
  const editorialLinks = editorialSection
    ? extractAnchors(editorialSection).filter(({ href }) => {
        const target = normalizeInternalHref(href, route);
        return target?.startsWith("/blog/") && routeMap.has(target);
      })
    : [];
  const serviceLabelsAreDescriptive = serviceLinks.every(
    ({ markup }) => visibleAnchorText(markup).length >= 12,
  );
  const editorialLabelsAreDescriptive = editorialLinks.every(
    ({ markup }) => visibleAnchorText(markup).length >= 12,
  );

  if (
    serviceLinks.length < 3 ||
    new Set(serviceLinks.map(({ href }) => href)).size !== serviceLinks.length ||
    !serviceLabelsAreDescriptive ||
    editorialLinks.length < 3 ||
    new Set(editorialLinks.map(({ href }) => href)).size !== editorialLinks.length ||
    !editorialLabelsAreDescriptive
  ) {
    serviceGuidePathwayFailures.push(
      `${route} (service=${serviceLinks.length}, editorial=${editorialLinks.length}, descriptive=${serviceLabelsAreDescriptive && editorialLabelsAreDescriptive})`,
    );
  }
}
assert.deepEqual(
  serviceGuidePathwayFailures,
  [],
  `Service/condition guides need at least three distinct related service and Journal links:\n${serviceGuidePathwayFailures.join("\n")}`,
);

const focusedArticlePathways = {
  "/blog/ankle-sprain-rehabilitation-guide": "/services/clinical-assessment-evaluation",
  "/blog/copd-physiotherapy-management": "/services/clinical-assessment-evaluation",
  "/blog/frozen-shoulder-physiotherapy-treatment": "/services/pain-management-physiotherapy",
  "/blog/guillain-barre-syndrome-recovery": "/services/clinical-assessment-evaluation",
  "/blog/neurological-physiotherapy-brain-injury": "/services/clinical-assessment-evaluation",
};
for (const [articleRoute, target] of Object.entries(focusedArticlePathways)) {
  assertContainsAll(routeMap, articleRoute, [target], `Focused Journal pathway ${articleRoute}`);
}

const contextualArticlePathways = {
  "/blog/hip-fracture-rehabilitation-home-bengaluru": [
    "/physiotherapist-at-home/bengaluru",
    "/post-surgery-rehab",
  ],
  "/blog/breathing-work-endurance-metalworkers-moradabad": [
    "/physiotherapist-at-home/moradabad",
    "/services/cardiopulmonary-rehabilitation",
  ],
  "/blog/home-physiotherapy-developmental-motor-delay-tigaon": [
    "/physiotherapist-at-home/tigaon",
    "/services/rehabilitation-programs",
  ],
  "/blog/lumbar-slipped-disc-l3-l4-l4-l5-l5-s1": [
    "/online-physiotherapy",
  ],
  "/blog/exercise-physiology-home-space-energy-jodhpur": [
    "/exercise-physiologist",
  ],
  "/blog/neck-pain-cervical-stiffness-physiotherapy": [
    "/neck-pain",
  ],
  "/blog/sciatica-physiotherapy-treatment-guide": [
    "/sciatica",
  ],
  "/blog/knee-osteoarthritis-physiotherapy-guide": [
    "/arthritis-osteoarthritis",
  ],
  "/blog/parkinsons-physiotherapy-guide": [
    "/parkinsons-rehab",
  ],
  "/blog/diet-and-fat-loss": [
    "/weight-management",
  ],
};
for (const [articleRoute, targets] of Object.entries(contextualArticlePathways)) {
  assertContainsAll(
    routeMap,
    articleRoute,
    targets,
    `Visible contextual pathways ${articleRoute}`,
  );
}

const orphanServiceRoutes = [
  "/online-physiotherapy",
  "/exercise-physiologist",
  "/neck-pain",
  "/sciatica",
  "/arthritis-osteoarthritis",
  "/parkinsons-rehab",
  "/weight-management",
];
const homepageServices = readHtml(routeMap, "/").match(
  /<section id="services"[\s\S]*?<\/section>/u,
)?.[0];
assert.ok(homepageServices, "the homepage should render its Services section");
const getServiceCardHref = (serviceId) => {
  const card = homepageServices.match(
    new RegExp(`<a\\b(?=[^>]*data-testid="card-service-${serviceId}")[^>]*>`, "u"),
  )?.[0];
  return card?.match(/\bhref="([^"]+)"/u)?.[1] ?? null;
};
assert.equal(
  getServiceCardHref("general-consultation"),
  "/booking",
  "General Consultation should link directly to the clean booking route",
);
assert.equal(
  getServiceCardHref("assessment-protocols"),
  "/services/clinical-assessment-evaluation",
  "Clinical Assessment should retain its separate service-guide destination",
);
for (const target of orphanServiceRoutes) {
  assert.ok(
    homepageServices.includes(`href="${target}"`) || homepageServices.includes(`href='${target}'`),
    `the homepage Services section should link to ${target}`,
  );
}

const homepageHtml = readHtml(routeMap, "/");
const cityGroupBlocks = [
  ...homepageHtml.matchAll(
    /<p class="font-semibold text-foreground text-sm">([^<]+)<\/p>\s*<div class="flex flex-wrap gap-x-2 gap-y-1 mt-1\.5">([\s\S]*?)<\/div>/gu,
  ),
];
const groupedCityLinks = cityGroupBlocks.flatMap(([, , markup]) =>
  extractAnchors(markup).map(({ href }) => href),
);
const groupedCityTargets = groupedCityLinks
  .map((href) => normalizeInternalHref(href, "/"))
  .filter((target) => target?.startsWith("/physiotherapist-at-home/"));
assert.equal(
  new Set(groupedCityTargets).size,
  45,
  "The homepage should group and link to all 45 listed cities",
);
assert.equal(
  groupedCityTargets.length,
  45,
  "Each city should appear once in the homepage state groups",
);
assert.ok(
  cityGroupBlocks.length >= 10,
  "Homepage city links should appear under state or territory labels",
);

const missingFooterServiceLinks = [];
for (const { route } of routes) {
  if (route === "/admin") continue;
  const html = readHtml(routeMap, route);
  const footer = html.match(/<footer\b[\s\S]*?<\/footer>/iu)?.[0];
  if (!footer) {
    missingFooterServiceLinks.push(`${route} (missing public footer)`);
    continue;
  }
  for (const target of orphanServiceRoutes) {
    if (!footer.includes(`href="${target}"`) && !footer.includes(`href='${target}'`)) {
      missingFooterServiceLinks.push(`${route} -> ${target}`);
    }
  }
}
assert.deepEqual(
  missingFooterServiceLinks,
  [],
  `Public footers missing orphan service links:\n${missingFooterServiceLinks.join("\n")}`,
);

const cityRoutes = routes
  .map(({ route }) => route)
  .filter((route) => route.startsWith("/physiotherapist-at-home/"));

console.log(
  `Internal link graph checks passed for ${routes.length} prerendered routes, ${articleRoutes.length} Journal articles, and ${cityRoutes.length} city routes.`,
);