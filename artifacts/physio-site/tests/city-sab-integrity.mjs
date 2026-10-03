import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const siteDirectory = fileURLToPath(new URL("..", import.meta.url));
const publicDirectory = join(siteDirectory, "dist", "public");
const cityDirectory = join(publicDirectory, "physiotherapist-at-home");
const organizationId = "https://goswamirehab.in/#organization";
const cityPages = readdirSync(cityDirectory, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => ({
    slug: entry.name,
    filePath: join(cityDirectory, entry.name, "index.html"),
  }))
  .filter(({ filePath }) => existsSync(filePath));

assert.ok(cityPages.length > 0, "Prerendered city pages should exist before the SAB checks run");
assert.equal(cityPages.length, 45, "all existing city routes should remain prerendered");

function readEntities(html) {
  return [...html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )]
    .map((match) => JSON.parse(match[1]))
    .flatMap((schema) => schema["@graph"] ?? [schema]);
}

function hasType(entity, type) {
  return Array.isArray(entity["@type"])
    ? entity["@type"].includes(type)
    : entity["@type"] === type;
}

const homepageHtml = readFileSync(join(publicDirectory, "index.html"), "utf8");
const canonicalOrganizations = readEntities(homepageHtml).filter(
  (entity) => entity["@id"] === organizationId,
);
assert.equal(
  canonicalOrganizations.length,
  1,
  "The homepage should publish one canonical organization entity",
);
assert.ok(
  hasType(canonicalOrganizations[0], "Organization") &&
    !hasType(canonicalOrganizations[0], "ProfessionalService") &&
    !hasType(canonicalOrganizations[0], "Store"),
  "The canonical entity should describe the organization without implying a physical service location",
);
for (const property of [
  "address",
  "geo",
  "openingHoursSpecification",
  "areaServed",
  "hasMap",
  "priceRange",
]) {
  assert.equal(
    canonicalOrganizations[0][property],
    undefined,
    `The root Organization should not publish "${property}"`,
  );
}

function readVisibleText(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? html;
  return body
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

for (const { slug, filePath } of cityPages) {
  const html = readFileSync(filePath, "utf8");
  const visibleText = readVisibleText(html);
  const entities = readEntities(html);
  const hasVerifiedHomecare = true;

  assert.equal(
    entities.some((entity) =>
      ["LocalBusiness", "MedicalBusiness", "HealthAndBeautyBusiness"].some((type) =>
        hasType(entity, type),
      ),
    ),
    false,
    `${slug} should not publish storefront business markup`,
  );
  assert.equal(
    entities.some((entity) =>
      entity.address !== undefined ||
      entity.geo !== undefined ||
      entity.openingHoursSpecification !== undefined,
    ),
    false,
    `${slug} should not publish a physical location or storefront hours in JSON-LD`,
  );

  const services = entities.filter((entity) => hasType(entity, "Service"));
  assert.equal(services.length, 1, `${slug} should publish exactly one city Service`);
  assert.deepEqual(
    services[0].provider,
    { "@id": organizationId },
    `${slug} Service should reference the canonical organization`,
  );
  assert.equal(
    services[0].areaServed?.["@type"],
    "City",
    `${slug} Service should declare one city as its service area`,
  );
  assert.ok(
    services[0].areaServed?.name &&
      services[0].name.includes(services[0].areaServed.name),
    `${slug} Service should identify the city in both its name and areaServed`,
  );
  assert.equal(services[0].address, undefined, `${slug} Service should not publish a street address`);
  assert.equal(services[0].geo, undefined, `${slug} Service should not publish coordinates`);
  assert.equal(
    services[0].serviceType,
    hasVerifiedHomecare ? "Home Physiotherapy" : "Online Physiotherapy Consultation",
    `${slug} Service should match the city's current home-visit status`,
  );
  assert.equal(
    services[0].name,
    hasVerifiedHomecare
      ? `Physiotherapy at Home in ${services[0].areaServed.name}`
      : `Online Physiotherapy Consultation in ${services[0].areaServed.name}`,
    `${slug} Service name should describe the currently available care`,
  );

  const availabilityTag = html.match(/<p\b[^>]*data-sab-availability[^>]*>/i)?.[0] ?? "";
  assert.match(
    availabilityTag,
    new RegExp(`data-coverage-status="${hasVerifiedHomecare ? "active" : "placement"}"`),
    `${slug} should render its explicit coverage status`,
  );
  assert.match(visibleText, /Home visits are active at city level/i, `${slug} should state active city-level coverage`);
  assert.match(visibleText, /exact locality and clinician availability are confirmed before booking/i, `${slug} should require locality confirmation`);
  assert.doesNotMatch(visibleText, /future team placement/i, `${slug} should not render expansion-only placement copy`);
  assert.match(visibleText, /locality reference/i, `${slug} should frame neighborhoods as references`);
  assert.doesNotMatch(visibleText, /most enquiries are resolved through homecare/i, `${slug} should not imply a likely home visit outside active cities`);

  const nearbyStatuses = [...html.matchAll(
    /data-nearby-city="([^"]+)"[^>]*data-coverage-status="(active|placement)"/gi,
  )];
  for (const [, nearbySlug, status] of nearbyStatuses) {
    assert.equal(
      status,
      "active",
      `${slug} nearby link to ${nearbySlug} should show that destination's status`,
    );
  }
  assert.doesNotMatch(visibleText, /the same team covers|one shared homecare hub/i, `${slug} should not claim a shared nearby-city team`);

  assert.doesNotMatch(
    visibleText,
    /\bclinic\s+in\b|\bour\s+office\b|\bvisit\s+us\s+at\b/i,
    `${slug} should not imply a walk-in clinic or public office`,
  );
}

console.log(`SAB integrity checks passed for ${cityPages.length} prerendered city pages.`);