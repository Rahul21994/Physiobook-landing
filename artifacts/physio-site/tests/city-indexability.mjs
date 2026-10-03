import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve("dist/public");
const cityDistDir = path.join(distDir, "physiotherapist-at-home");
const sitemap = fs.readFileSync(path.join(distDir, "sitemap.xml"), "utf8");
const richSchemaTypes = ["Service", "FAQPage", "BreadcrumbList"];
const jsonLdScript = /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi;
const citySlugs = fs.readdirSync(cityDistDir).filter((slug) =>
  fs.existsSync(path.join(cityDistDir, slug, "index.html")),
);

assert.equal(citySlugs.length, 45, "every authored city should have a prerendered route");
const indexableCitySlugs = new Set(citySlugs);

for (const slug of citySlugs) {
  const html = fs.readFileSync(
    path.join(cityDistDir, slug, "index.html"),
    "utf8",
  );
  const expectedIndexable = indexableCitySlugs.has(slug);
  const expectedRobots = expectedIndexable
    ? "index, follow"
    : "noindex, follow, noai, noimageai";
  const robotsMatch = html.match(
    /<meta\s+name="robots"\s+content="([^"]+)"/i,
  );
  assert.equal(robotsMatch?.[1], expectedRobots, `${slug} robots policy`);
  assert.match(
    html,
    new RegExp(
      `<link\\s+rel="canonical"\\s+href="https://goswamirehab\\.in/physiotherapist-at-home/${slug}"`,
      "i",
    ),
    `${slug} canonical URL`,
  );

  const jsonLd = html.match(jsonLdScript) ?? [];
  const emittedRichSchemaTypes = richSchemaTypes.filter((type) =>
    jsonLd.some((block) =>
      new RegExp(`"@type"\\s*:\\s*"${type}"`).test(block),
    ),
  );

  if (expectedIndexable) {
    for (const type of richSchemaTypes) {
      assert.ok(
        emittedRichSchemaTypes.includes(type),
        `${slug} should emit ${type} schema`,
      );
    }
    assert.match(
      sitemap,
      new RegExp(`<loc>https://goswamirehab\\.in/physiotherapist-at-home/${slug}</loc>`),
      `${slug} should be in the sitemap`,
    );
  }
}

assert.ok(
  citySlugs.includes("bengaluru") && citySlugs.includes("mumbai"),
  "Bengaluru and Mumbai must keep their existing canonical routes",
);
assert.ok(!citySlugs.includes("bangalore"), "Bangalore must not become a duplicate route");

console.log(
  `City indexability checks passed for all ${citySlugs.length} generated routes.`,
);