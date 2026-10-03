import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST_DIR = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "dist",
  "public",
);
const BASE_URL = "https://goswamirehab.in";

const topicPages = [
  {
    route: "/back-pain",
    h1: "Low Back Pain Physiotherapy: Assessment and Recovery",
    breadcrumb: "Back Pain Physiotherapy",
    related: "/blog/physiotherapy-for-low-back-pain",
  },
  {
    route: "/knee-pain",
    h1: "Knee Pain Physiotherapy: Strength, Mobility and Function",
    breadcrumb: "Knee Pain Physiotherapy",
    related: "/blog/knee-osteoarthritis-physiotherapy-guide",
  },
  {
    route: "/post-surgery-rehab",
    h1: "Post-Surgery Rehabilitation: Safe Recovery and Mobility",
    breadcrumb: "Post-Surgery Rehabilitation",
    related: "/blog/knee-replacement-recovery-guide",
  },
  {
    route: "/stroke-rehab",
    h1: "Stroke Rehabilitation at Home: Mobility and Independence",
    breadcrumb: "Stroke Rehabilitation",
    related: "/blog/stroke-rehabilitation-at-home",
  },
  {
    route: "/services/pain-management-physiotherapy",
    h1: "Pain-Management Physiotherapy: Safer Movement and Recovery",
    breadcrumb: "Pain-Management Physiotherapy",
    visibleBreadcrumb: "Pain Management Physiotherapy",
    related: "/back-pain",
  },
  {
    route: "/services/pregnancy-postpartum-support",
    h1: "Pregnancy and Postpartum Support: Individualised Movement Guidance",
    breadcrumb: "Pregnancy and Postpartum Support",
    visibleBreadcrumb: "Pregnancy Postpartum Support",
    related: "/booking",
  },
  {
    route: "/services/infant-early-development-physiotherapy",
    h1: "Infant and Early-Development Physiotherapy Enquiry",
    breadcrumb: "Infant and Early-Development Physiotherapy",
    visibleBreadcrumb: "Infant Early Development Physiotherapy",
    related: "/booking",
  },
  {
    route: "/services/pediatric-disability-rehabilitation",
    h1: "Physiotherapy for Children with Disabilities",
    breadcrumb: "Pediatric Disability Rehabilitation",
    related: "/booking",
  },
];

function readHtml(route) {
  return readFileSync(join(DIST_DIR, route, "index.html"), "utf8");
}

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function readSchemas(html) {
  return [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]))
    .flatMap((schema) => schema["@graph"] ?? [schema]);
}

for (const page of topicPages) {
  const route = page.route;
  const html = readHtml(page.route.slice(1));
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
  assert.equal(headings.filter((level) => level === 1).length, 1, `${route} should have one H1`);
  assert.match(html, new RegExp(`<h1[^>]*>${page.h1.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</h1>`));
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.match(html, new RegExp(`<link rel="canonical" href="${BASE_URL}${route}"`));
  assert.match(
    html,
    new RegExp(`<span[^>]*aria-current="page"[^>]*>${page.visibleBreadcrumb ?? page.breadcrumb}</span>`),
  );
  assert.match(html, /<span[^>]*>Treatment Services<\/span>/);
  assert.match(html, /Goswami Rehab (?:Rehabilitation|Pain &amp; Mobility) Guide/);
  assert.match(html, new RegExp(`href="${page.related}"`));

  const breadcrumbSchemas = readSchemas(html).filter((schema) => schema["@type"] === "BreadcrumbList");
  assert.equal(breadcrumbSchemas.length, 1, `${route} should publish one BreadcrumbList`);
  const breadcrumbNames = breadcrumbSchemas[0].itemListElement.map((item) => item.name);
  for (const item of breadcrumbSchemas[0].itemListElement) {
    assert.ok(item.item, `${route} breadcrumb item ${item.position} should include an item URL`);
  }
  assert.equal(breadcrumbNames.at(-1), page.breadcrumb);
  assert.equal(breadcrumbNames[1], "Treatment Services");
  assert.equal(
    ["Rehabilitation", "Pain & Mobility", "Women's Health", "Paediatric Rehabilitation"].includes(breadcrumbNames[2]),
    true,
    `${route} should expose its clinical hierarchy`,
  );
  assert.equal(
    readSchemas(html).filter((schema) => schema["@type"] === "Service").length,
    1,
    `${route} should publish one Service entity`,
  );
}

const sitemap = readFileSync(join(DIST_DIR, "sitemap.xml"), "utf8");
for (const page of topicPages) {
  assert.match(sitemap, new RegExp(`<loc>${BASE_URL}${page.route}</loc>`));
}

console.log(`Topic page SEO checks passed for ${topicPages.length} focused service pages.`);