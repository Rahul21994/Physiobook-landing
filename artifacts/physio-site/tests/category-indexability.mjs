import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST_DIR = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "dist",
  "public",
);
const BASE_URL = "https://goswamirehab.in";
const categories = readdirSync(join(DIST_DIR, "blog", "category"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
assert.ok(categories.length > 0, "at least one Journal category should be prerendered");
const sitemap = readFileSync(join(DIST_DIR, "sitemap.xml"), "utf8");

for (const category of categories) {
  const route = `/blog/category/${category}`;
  const html = readFileSync(join(DIST_DIR, route.slice(1), "index.html"), "utf8");

  assert.match(
    html,
    /<meta name="robots" content="index, follow"/,
    `${route} should be indexable`,
  );
  assert.match(
    html,
    new RegExp(`<link rel="canonical" href="${BASE_URL}${route}"\\s*/?>`),
    `${route} should have a self-referencing canonical`,
  );
  assert.match(
    html,
    /"@type":\s*"CollectionPage"/,
    `${route} should emit collection structured data`,
  );
  const categoryLoc = `<loc>${BASE_URL}${route}</loc>`;
  const categoryEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gu)]
    .map((match) => match[1])
    .filter((entry) => entry.includes(categoryLoc));
  assert.equal(categoryEntries.length, 1, `${route} should appear exactly once in the sitemap`);
  assert.match(
    categoryEntries[0],
    /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/u,
    `${route} should have a lastmod date in the sitemap`,
  );
}

console.log(`Category indexability check passed for ${categories.length} categories.`);