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

const articleRoutes = [
  "blog",
  "blog/physiotherapy-for-low-back-pain",
  "blog/stroke-rehabilitation-at-home",
  "blog/diet-requirements-after-stroke",
  "blog/diet-and-fat-loss",
  "blog/physiotherapist-at-home-jaipur",
  "back-pain",
  "knee-pain",
  "post-surgery-rehab",
  "stroke-rehab",
  "services/pain-management-physiotherapy",
];

for (const route of articleRoutes) {
  const html = readFileSync(join(DIST_DIR, route, "index.html"), "utf8");
  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) =>
    Number(match[1]),
  );

  assert.ok(headings.includes(1), `${route} should include an article H1`);
  assert.ok(headings.includes(2), `${route} should include H2 section headings`);
  assert.equal(
    headings.filter((level) => level === 1).length,
    1,
    `${route} should include exactly one article H1`,
  );

  let previousSectionLevel = 1;
  for (const level of headings.slice(1)) {
    if (level === 2 || level === 3) {
      assert.ok(
        level <= previousSectionLevel + 1,
        `${route} should not skip from H1 to H3 or otherwise jump heading levels`,
      );
      previousSectionLevel = level;
    }
  }
}

console.log(`On-page heading hierarchy check passed for ${articleRoutes.length} articles.`);