import assert from "node:assert/strict";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const siteDirectory = fileURLToPath(new URL("..", import.meta.url));
const serverEntry = join(siteDirectory, "dist", "server", "entry-server.js");
const { render } = await import(`${serverEntry}?ssr-city-schema-test=${Date.now()}`);
const ORG_ID = "https://goswamirehab.in/#organization";

function readJsonLd(head) {
  return [...head.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match) => JSON.parse(match[1]));
}

function readEntities(page) {
  return readJsonLd(page.head).flatMap((schema) => schema["@graph"] ?? [schema]);
}

for (const [slug, cityName] of [
  ["jaipur", "Jaipur"],
  ["delhi", "Delhi"],
]) {
  const page = render(`/physiotherapist-at-home/${slug}`);
  const entities = readEntities(page);
  const services = entities.filter((entity) => entity["@type"] === "Service");
  assert.equal(services.length, 1, `${slug} SSR head should contain exactly one city Service`);
  assert.deepEqual(
    services[0].provider,
    { "@id": ORG_ID },
    `${slug} Service should reference the canonical organization`,
  );
  assert.deepEqual(
    services[0].areaServed,
    { "@type": "City", "name": cityName },
    `${slug} Service should be scoped to its city`,
  );
  assert.equal(
    entities.some((entity) => entity["@type"] === "LocalBusiness"),
    false,
    `${slug} should not publish storefront LocalBusiness markup`,
  );
  assert.equal(
    page.html.includes('"@type":"LocalBusiness"'),
    false,
    `${slug} body should not contain LocalBusiness JSON-LD`,
  );
}

console.log("SSR city schema check passed: city Services are head-rendered without LocalBusiness markup.");