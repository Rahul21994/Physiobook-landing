import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { homeFaqs } from "../dist/server/entry-server.js";
import nap from "../src/lib/nap.generated.json" with { type: "json" };

const TESTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(TESTS_DIR, "..", "dist", "public");
const SOURCE_INDEX = join(TESTS_DIR, "..", "index.html");
const BASE_URL = "https://goswamirehab.in";
const ORG_ID = `${BASE_URL}/#organization`;
const AUTHOR_ID = `${BASE_URL}/about#rahul-goswami`;
const REVIEWER_ID = `${BASE_URL}/about#prakriti-sharma`;
const STRUCTURED_DATA_MARKER = "<!-- PRERENDER_STRUCTURED_DATA -->";

function readRouteHtml(route) {
  const filePath = join(
    DIST_DIR,
    route ? route.replace(/^\/|\/$/g, "") : "",
    "index.html",
  );
  return readFileSync(filePath, "utf8");
}

function readSchemas(route) {
  const html = readRouteHtml(route);
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .flatMap((schema) => schema["@graph"] ?? [schema]);
}

function findByType(entities, type) {
  return entities.filter((entity) =>
    Array.isArray(entity["@type"])
      ? entity["@type"].includes(type)
      : entity["@type"] === type,
  );
}

function listHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return listHtmlFiles(path);
    return entry.isFile() && entry.name.endsWith(".html") ? [path] : [];
  });
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, codePoint) =>
      String.fromCodePoint(Number.parseInt(codePoint, 16)),
    )
    .replace(/&#(\d+);/g, (_, codePoint) =>
      String.fromCodePoint(Number.parseInt(codePoint, 10)),
    );
}

function readVisibleArticleHeading(html, route) {
  const match = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i);
  assert.ok(match, `${route} should include a visible H1`);
  return decodeHtmlEntities(match[1].replace(/<[^>]+>/g, "").trim());
}

const sourceIndex = readFileSync(SOURCE_INDEX, "utf8");
assert.equal(
  sourceIndex.includes(STRUCTURED_DATA_MARKER),
  true,
  "Source shell should expose exactly one structured-data insertion point",
);
assert.equal(
  (sourceIndex.match(/type="application\/ld\+json"/g) ?? []).length,
  0,
  "Source shell should not hard-code a second organization entity",
);

const homepageHtml = readRouteHtml("");
assert.equal(
  homepageHtml.includes(STRUCTURED_DATA_MARKER),
  false,
  "Prerendered homepage should not retain the structured-data marker",
);

const homepageEntities = readSchemas("");
const organizations = homepageEntities.filter((entity) => entity["@id"] === ORG_ID);
assert.equal(
  organizations.length,
  1,
  "Homepage should publish exactly one canonical organization entity",
);

const citiesHtml = readRouteHtml("cities");
assert.match(citiesHtml, /<h1[^>]*>Cities We Serve<\/h1>/, "Cities page should be present in generated page source");
assert.match(
  citiesHtml,
  /<link rel="canonical" href="https:\/\/goswamirehab\.in\/cities"/,
  "Cities page should publish its canonical URL in generated page source",
);
assert.ok(readSchemas("cities").length > 0, "Cities page should retain generated JSON-LD in page source");

const gurgaonHtml = readRouteHtml("physiotherapist-at-home/gurgaon");
assert.match(
  gurgaonHtml,
  /<title>Physiotherapy at Home in Gurugram \(Gurgaon\) \| Goswami Rehab<\/title>/,
  "Gurugram city title should lead with the current name and retain the familiar alias",
);
assert.match(
  gurgaonHtml,
  /<h1\b[^>]*>[\s\S]*?Gurugram \(Gurgaon\)[\s\S]*?<\/h1>/,
  "Gurugram city H1 should use the current name and familiar alias",
);
assert.match(
  gurgaonHtml,
  /Home visits are active at city level in Gurugram \(Gurgaon\)\./,
  "Gurugram city introduction should use the current name and familiar alias",
);
assert.match(
  homepageHtml,
  /href="\/physiotherapist-at-home\/gurgaon"[^>]*>Gurugram \(Gurgaon\)<\/a>/,
  "Homepage city directory should use the current name and familiar alias",
);

const organization = organizations[0];
assert.ok(
  organization["@type"] === "Organization",
  "The canonical business entity should be a non-storefront Organization",
);
assert.equal(
  organization.hasMap,
  undefined,
  "The organization schema should not imply a physical storefront with a map pin",
);
assert.ok(
  organization.sameAs.includes(nap.mapUrl),
  "Canonical organization sameAs should include the Goswami Rehab Google Business Profile",
);
assert.ok(
  organization.sameAs.includes("https://maps.app.goo.gl/9xV7ez6hS37Agkfa9"),
  "Canonical organization sameAs should include the alternate Goswami Rehab SAB profile URL",
);
assert.equal(
  organization.sameAs.includes("https://maps.app.goo.gl/Tg9emgztKKgmXs67A?g_st=ac"),
  false,
  "Sister business listing should remain a visible referral, not a second canonical organization identity",
);
for (const property of [
  "address",
  "geo",
  "openingHoursSpecification",
  "areaServed",
  "priceRange",
  "serviceType",
]) {
  assert.equal(
    organization[property],
    undefined,
    `The root Organization schema should not publish SAB storefront property "${property}"`,
  );
}
assert.deepEqual(
  organization.logo,
  `${BASE_URL}/favicon.svg`,
  "Canonical organization should publish one authoritative logo URL",
);
assert.equal(
  findByType(homepageEntities, "AggregateRating").length,
  0,
  "Homepage should not publish an unsupported aggregate rating",
);

const aboutEntities = readSchemas("about");
const aboutPages = findByType(aboutEntities, "AboutPage");
assert.equal(aboutPages.length, 1, "About page should publish one AboutPage entity");
assert.deepEqual(
  aboutPages[0].about,
  { "@id": AUTHOR_ID },
  "About page should reference the canonical author entity",
);
const authorEntities = findByType(aboutEntities, "Person");
assert.equal(authorEntities.length, 1, "About page should publish one author entity");
assert.equal(authorEntities[0]["@id"], AUTHOR_ID);
assert.equal(authorEntities[0].name, "Dr. Rahul Goswami, PT");
assert.equal(
  authorEntities[0].alumniOf,
  undefined,
  "About schema should not assert an unverified education relationship",
);

const faqPages = findByType(homepageEntities, "FAQPage");
assert.equal(faqPages.length, 1, "Homepage should publish one FAQPage entity");
assert.deepEqual(
  faqPages[0].mainEntity.map((question) => ({
    q: question.name,
    a: question.acceptedAnswer.text,
  })),
  homeFaqs,
  "Homepage FAQ JSON-LD should match the resolved FAQ data used by the visible UI",
);

for (const route of [
  "physiotherapist-at-home/jaipur",
]) {
  const entities = readSchemas(route);
  const services = findByType(entities, "Service");
  assert.equal(services.length, 1, `${route} should publish one service entity`);
  assert.deepEqual(
    services[0].provider,
    { "@id": ORG_ID },
    `${route} service should reference the canonical organization`,
  );
  assert.equal(
    findByType(entities, "AggregateRating").length,
    0,
    `${route} should not publish an unsupported aggregate rating`,
  );
}

const jaipurEntities = readSchemas("physiotherapist-at-home/jaipur");
const jaipurService = findByType(jaipurEntities, "Service")[0];
assert.equal(
  jaipurService.review?.length ?? 0,
  0,
  "Jaipur should not publish review schema without supplied ratings",
);
assert.equal(findByType(jaipurEntities, "FAQPage").length, 1, "City page should publish one FAQPage entity");

for (const route of [
  "physiotherapist-at-home/agra",
  "physiotherapist-at-home/ahmedabad",
]) {
  const html = readRouteHtml(route);
  assert.match(
    html,
    /<meta name="robots" content="index, follow"/,
    `${route} should remain discoverable for online consultation`,
  );
  assert.ok(
    findByType(readSchemas(route), "Service").length === 1 &&
      findByType(readSchemas(route), "FAQPage").length === 1 &&
      findByType(readSchemas(route), "BreadcrumbList").length === 1,
    `${route} should publish city schema while discoverable`,
  );
}

for (const route of [
  "physiotherapist-at-home/tigaon",
  "physiotherapist-at-home/moradabad",
]) {
  const entities = readSchemas(route);
  const service = findByType(entities, "Service")[0];
  assert.equal(service.review, undefined, `${route} must not attach provider-team experiences to local review schema`);
  assert.equal(findByType(entities, "Review").length, 0, `${route} must not publish Review schema for site-owned experiences`);
  assert.equal(findByType(entities, "AggregateRating").length, 0, `${route} must not publish AggregateRating schema`);
  assert.equal(findByType(entities, "FAQPage").length, 1, `${route} should publish one FAQPage entity`);
}

const cityRouteDirectory = join(DIST_DIR, "physiotherapist-at-home");
const cityRouteSlugs = readdirSync(cityRouteDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && existsSync(join(cityRouteDirectory, entry.name, "index.html")))
  .map((entry) => entry.name);
for (const slug of cityRouteSlugs) {
  const route = `physiotherapist-at-home/${slug}`;
  const service = findByType(readSchemas(route), "Service")[0];
  assert.ok(service, `${route} should publish one Service entity`);
  assert.equal(service.review, undefined, `${route} must not contain nested Review schema`);
  assert.equal(
    findByType(readSchemas(route), "AggregateRating").length,
    0,
    `${route} must not publish AggregateRating schema`,
  );
}

const stateRouteDirectory = join(DIST_DIR, "physiotherapist-at-home-in");
const stateRoutes = readdirSync(stateRouteDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => `physiotherapist-at-home-in/${entry.name}`);
assert.equal(stateRoutes.length, 21, "All state hubs should remain available as prerendered routes");
for (const route of stateRoutes) {
  const html = readRouteHtml(route);
  const schemas = readSchemas(route);
  assert.doesNotMatch(html, /<meta name="robots" content="noindex/i, `${route} should remain indexable`);
  assert.equal(findByType(schemas, "Service").length, 1, `${route} should publish one Service entity`);
  assert.equal(findByType(schemas, "FAQPage").length, 1, `${route} should publish one FAQPage entity`);
  assert.equal(findByType(schemas, "BreadcrumbList").length, 1, `${route} should publish one BreadcrumbList entity`);
}
const generatedSitemap = readFileSync(join(DIST_DIR, "sitemap.xml"), "utf8");
assert.match(
  generatedSitemap,
  /<loc>https:\/\/goswamirehab\.in\/cities<\/loc>/,
  "The sitemap should include the /cities discovery page",
);
for (const route of stateRoutes) {
  const absoluteUrl = `https://goswamirehab.in/${route}`;
  assert.match(
    generatedSitemap,
    new RegExp(`<loc>${absoluteUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>`),
    `${route} should be included in the sitemap`,
  );
}

const blogRoutes = readdirSync(join(DIST_DIR, "blog"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .filter((slug) => existsSync(join(DIST_DIR, "blog", slug, "index.html")));

for (const slug of blogRoutes) {
  const route = `blog/${slug}`;
  const html = readRouteHtml(route);
  const articleSchemas = findByType(readSchemas(route), "BlogPosting");
  assert.equal(
    articleSchemas.length,
    1,
    `${route} should publish exactly one BlogPosting entity`,
  );
  const isNutritionArticle = articleSchemas[0].articleSection === "Nutrition & Clinical Guidance";
  const expectedAuthorRole = isNutritionArticle ? "Nutritionist" : "Senior Physiotherapist";
  const expectedAuthorOccupation = isNutritionArticle
    ? "Nutrition and recovery guidance"
    : "Exercise Physiologist";
  assert.equal(
    articleSchemas[0].headline,
    readVisibleArticleHeading(html, route),
    `${route} JSON-LD headline should match the visible article H1`,
  );
  assert.equal(
    articleSchemas[0].dateModified,
    undefined,
    `${route} should not reuse its publication date as an unverified modification date`,
  );
  assert.doesNotMatch(
    html,
    /<meta property="article:modified_time"/,
    `${route} should not publish an unverified article modification date`,
  );
  assert.equal(
    typeof articleSchemas[0].image,
    "string",
    `${route} BlogPosting image should be a URL string`,
  );
  assert.match(
    articleSchemas[0].image,
    /^https:\/\/goswamirehab\.in\/[^/].*/,
    `${route} BlogPosting image should be an absolute Goswami Rehab URL`,
  );
  const articleImageUrl = new URL(articleSchemas[0].image);
  assert.equal(
    articleImageUrl.protocol,
    "https:",
    `${route} BlogPosting image should use HTTPS`,
  );
  assert.equal(
    articleImageUrl.origin,
    BASE_URL,
    `${route} BlogPosting image should stay on the canonical site origin`,
  );
  assert.ok(
    existsSync(join(DIST_DIR, articleImageUrl.pathname.replace(/^\/+/, ""))),
    `${route} BlogPosting image should resolve to a public asset`,
  );
  assert.equal(
    articleSchemas[0].author?.["@id"],
    AUTHOR_ID,
    `${route} should attribute the article to the named clinician`,
  );
  assert.equal(
    articleSchemas[0].author?.name,
    "Dr. Rahul Goswami, PT",
    `${route} should expose the clinician's name in JSON-LD`,
  );
  assert.equal(
    articleSchemas[0].author?.jobTitle,
    expectedAuthorRole,
    `${route} should expose the clinician's professional title in JSON-LD`,
  );
  assert.equal(
    articleSchemas[0].author?.hasOccupation?.name,
    expectedAuthorOccupation,
    `${route} should expose the clinician's qualification in JSON-LD`,
  );
  assert.equal(
    articleSchemas[0].reviewedBy?.["@id"],
    REVIEWER_ID,
    `${route} should identify the medical reviewer in JSON-LD`,
  );
  assert.equal(
    articleSchemas[0].reviewedBy?.name,
    "Dr. Prakriti Sharma",
    `${route} should expose the reviewer's name in JSON-LD`,
  );
  assert.equal(
    articleSchemas[0].publisher?.name,
    "Goswami Rehab",
    `${route} BlogPosting publisher should expose the organization name`,
  );
  assert.equal(
    articleSchemas[0].publisher?.logo?.url,
    `${BASE_URL}/favicon.svg`,
    `${route} BlogPosting publisher should expose the canonical logo`,
  );
  assert.match(
    html,
    new RegExp(
      `data-testid="article-author"[^>]*>[\\s\\S]*?data-testid="article-author-name"[^>]*>Dr\\. Rahul Goswami, PT</`,
    ),
    `${route} should visibly identify the clinician author`,
  );
  assert.match(
    html,
    /data-testid="article-reviewer"[^>]*>Dr\. Prakriti Sharma</,
    `${route} should visibly identify the medical reviewer`,
  );
}

for (const filePath of listHtmlFiles(DIST_DIR)) {
  const route = filePath
    .slice(DIST_DIR.length)
    .replace(/\/index\.html$/, "")
    .replace(/^\/+/, "") || "/";
  const html = readFileSync(filePath, "utf8");
  const breadcrumbSchemas = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .flatMap((schema) => schema["@graph"] ?? [schema])
    .filter((schema) => schema["@type"] === "BreadcrumbList");

  assert.ok(
    breadcrumbSchemas.length <= 1,
    `${route} should not publish duplicate BreadcrumbList entities`,
  );
  for (const schema of breadcrumbSchemas) {
    for (const item of schema.itemListElement ?? []) {
      assert.ok(item.name, `${route} breadcrumb position ${item.position} should have a name`);
      assert.ok(item.item, `${route} breadcrumb position ${item.position} should have an item URL`);
    }
  }
}

console.log("Structured-data integrity checks passed.");