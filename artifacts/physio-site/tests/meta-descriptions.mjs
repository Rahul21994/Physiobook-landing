import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { normalizeMetaDescription } from "../scripts/meta-description.mjs";

const PUBLIC_DIR = path.resolve("dist/public");
const EXPECTED_ROUTE_COUNT = 734;

function decodeHtmlEntities(value) {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos);/giu,
    (entity, code) => {
      if (code[0] === "#") {
        const numeric = code[1]?.toLowerCase() === "x"
          ? Number.parseInt(code.slice(2), 16)
          : Number.parseInt(code.slice(1), 10);
        return Number.isFinite(numeric) ? String.fromCodePoint(numeric) : entity;
      }
      return {
        amp: "&",
        lt: "<",
        gt: ">",
        quot: '"',
        apos: "'",
      }[code.toLowerCase()] ?? entity;
    },
  );
}

function attribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = tag.match(new RegExp(`\\b${escapedName}\\s*=\\s*(["'])([\\s\\S]*?)\\1`, "iu"));
  return match ? decodeHtmlEntities(match[2]) : undefined;
}

function metaValues(html, selectorAttribute, selectorValue) {
  return (html.match(/<meta\b[^>]*>/giu) ?? [])
    .filter((tag) => attribute(tag, selectorAttribute) === selectorValue)
    .map((tag) => attribute(tag, "content"));
}

async function collectHtmlFiles(directory) {
  const found = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      found.push(...await collectHtmlFiles(filePath));
    } else if (entry.name === "index.html") {
      found.push(filePath);
    }
  }
  return found;
}

const files = await collectHtmlFiles(PUBLIC_DIR);
assert.equal(
  files.length,
  EXPECTED_ROUTE_COUNT,
  `Expected ${EXPECTED_ROUTE_COUNT} prerendered route pages, found ${files.length}.`,
);

function routePathForFile(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  return relativePath === "index.html"
    ? "/"
    : `/${relativePath.slice(0, -"index.html".length)}`.replace(/\/$/u, "");
}

const serviceRouteManifest = JSON.parse(
  await readFile(path.resolve("src/lib/service-guide-routes.json"), "utf8"),
);
const prerenderedRoutePaths = new Set(files.map(routePathForFile));
for (const routePath of serviceRouteManifest.rootPaths) {
  assert.ok(
    prerenderedRoutePaths.has(routePath),
    `Missing prerendered service guide at ${routePath}.`,
  );
}

for (const filePath of files) {
  const routePath = routePathForFile(filePath);
  const html = await readFile(filePath, "utf8");
  const titleMatches = [...html.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/giu)];
  assert.equal(titleMatches.length, 1, `${routePath}: expected exactly one title element.`);
  const title = decodeHtmlEntities(titleMatches[0][1].trim());
  assert.ok(
    [...title].length <= 60,
    `${routePath}: title must be 60 characters or fewer; found ${[...title].length}: "${title}".`,
  );

  const descriptions = metaValues(html, "name", "description");

  assert.equal(descriptions.length, 1, `${routePath}: expected exactly one meta description.`);
  const description = descriptions[0];
  assert.equal(typeof description, "string", `${routePath}: missing meta description content.`);
  const isReviewedHindiRoute = routePath.startsWith("/hi/") && routePath !== "/hi";
  if (isReviewedHindiRoute) {
    const length = Array.from(description).length;
    const isHindiCityRoute = routePath.startsWith("/hi/physiotherapist-at-home/");
    assert.ok(length > 0, `${routePath}: reviewed Hindi description must not be empty.`);
    assert.ok(
      length <= (isHindiCityRoute ? 183 : 155),
      `${routePath}: reviewed Hindi description exceeds its approved length exception.`,
    );
    if (isHindiCityRoute) {
      assert.ok(
        length >= 150,
        `${routePath}: the city-template-r1 description is shorter than its approved range.`,
      );
    }
    assert.match(description, /[.!?\u0964]$/u, `${routePath}: description must end with sentence punctuation.`);
  } else {
    normalizeMetaDescription(description, routePath);
  }

  const openGraphDescriptions = metaValues(html, "property", "og:description");
  assert.equal(
    openGraphDescriptions.length,
    1,
    `${routePath}: expected exactly one Open Graph description.`,
  );
  assert.equal(
    openGraphDescriptions[0],
    description,
    `${routePath}: Open Graph description does not match the meta description.`,
  );

  if (routePath.startsWith("/.booking-variants/")) {
    const robots = metaValues(html, "name", "robots");
    assert.equal(robots.length, 1, `${routePath}: expected one robots directive.`);
    assert.equal(robots[0], "noindex, follow, noai, noimageai", `${routePath}: booking variant should be noindex.`);
    const canonicalLinks = (html.match(/<link\b[^>]*>/giu) ?? [])
      .filter((tag) => (attribute(tag, "rel") ?? "").split(/\s+/u).includes("canonical"));
    assert.equal(canonicalLinks.length, 1, `${routePath}: expected one canonical link.`);
    assert.equal(
      attribute(canonicalLinks[0], "href"),
      "https://goswamirehab.in/booking",
      `${routePath}: booking variants should canonicalize to /booking.`,
    );
  }
}

console.log(
  `Validated ${files.length} prerendered meta descriptions; ` +
  `${files.filter((filePath) => path.relative(PUBLIC_DIR, filePath).startsWith(".booking-variants/")).length} booking variants are noindex and canonicalized to /booking.`,
);