import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const siteDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDirectory = path.join(siteDirectory, "dist", "public");
const englishHome = fs.readFileSync(path.join(publicDirectory, "index.html"), "utf8");
const hindiHome = fs.readFileSync(path.join(publicDirectory, "hi", "index.html"), "utf8");
const { getExistingHindiTranslation } = await import(
  pathToFileURL(path.join(siteDirectory, "dist", "server", "entry-server.js")).href
);

function getCanonical(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/u)?.[1] ?? null;
}

function getHreflangMap(html) {
  return new Map(
    [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)">/gu)]
      .map(([, language, href]) => [language, href]),
  );
}

function getSitemapEntries(xml) {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map(([, block]) => ({
    loc: block.match(/<loc>([^<]+)<\/loc>/u)?.[1]?.replace(/&amp;/g, "&") ?? null,
    markup: block,
  }));
}

const hindiTitle = getExistingHindiTranslation("Homecare Physiotherapy in 45 Listed Cities.");
const hindiFullDescription = getExistingHindiTranslation(
  "Goswami Rehab brings certified homecare physiotherapy across India — Rajasthan, Delhi NCR, Punjab, Karnataka, Maharashtra, Kerala, Assam, Uttarakhand, Jammu & more. 35+ specialist physios. Stroke rehabilitation, cardiopulmonary rehabilitation, post-surgery rehabilitation, neurological rehabilitation & complex case recovery.",
);
const hindiDescription = hindiFullDescription?.split(/(?<=।)\s*/u).slice(0, 2).join(" ");
assert.ok(hindiTitle && hindiDescription && hindiFullDescription, "Hindi metadata must come from existing authored translations");

assert.match(hindiHome, /<html\b[^>]*\blang="hi"/u, "The Hindi homepage must declare Hindi as its document language");
assert.match(englishHome, /<html\b[^>]*\blang="en"/u, "The English homepage must retain its English document language");
assert.equal(getCanonical(hindiHome), "https://goswamirehab.in/hi");
assert.equal(getCanonical(englishHome), "https://goswamirehab.in/");
assert.match(hindiHome, /<meta name="robots" content="index, follow"/u);
assert.match(hindiHome, /<title>45 सूचीबद्ध शहरों में घर पर फिजियोथेरेपी। \| Goswami Rehab<\/title>/u);
assert.ok(hindiHome.includes(hindiDescription), "The meta description should use complete authored Hindi sentences");
assert.ok(hindiHome.includes(hindiFullDescription), "The page body should retain the full authored Hindi translation");
assert.ok(hindiHome.includes(hindiTitle), "The prerendered page should include the translated primary heading");
assert.match(hindiHome, />Home<\/a>/u, "The prerendered shared shell should retain React's initial English markup");
assert.doesNotMatch(
  hindiHome,
  />मुखपृष्ठ<\/a>/u,
  "The prerenderer should not mutate React-owned shell text before hydration",
);
assert.match(
  hindiHome,
  /<a\b(?=[^>]*href="\/hi\/booking")(?=[^>]*data-booking-mode="home-visit")/u,
  "The Hindi booking CTA should use the localized clean route and its booking-mode data attribute",
);
assert.match(
  hindiHome,
  /href="\/hi\/online-care"/u,
  "The Hindi homepage should link to its localized online-care page",
);

const expectedAlternates = new Map([
  ["en-IN", "https://goswamirehab.in/"],
  ["hi-IN", "https://goswamirehab.in/hi"],
  ["x-default", "https://goswamirehab.in/"],
]);
for (const [label, html] of [
  ["English homepage", englishHome],
  ["Hindi homepage", hindiHome],
]) {
  assert.deepEqual(
    getHreflangMap(html),
    expectedAlternates,
    `${label} should declare reciprocal en-IN, hi-IN, and x-default URLs`,
  );
}

const sitemap = fs.readFileSync(path.join(publicDirectory, "sitemap.xml"), "utf8");
const sitemapEntries = getSitemapEntries(sitemap);
const sitemapByLoc = new Map(sitemapEntries.map((entry) => [entry.loc, entry.markup]));
assert.ok(sitemapByLoc.has("https://goswamirehab.in/"), "The English homepage should remain in the sitemap");
assert.ok(sitemapByLoc.has("https://goswamirehab.in/hi"), "The Hindi homepage should be in the sitemap");
for (const canonical of expectedAlternates.values()) {
  const entry = sitemapByLoc.get(canonical);
  assert.ok(entry, `${canonical} should be in the sitemap`);
  for (const [language, href] of expectedAlternates) {
    assert.ok(
      entry.includes(`hreflang="${language}" href="${href}"`),
      `${canonical} should include the ${language} sitemap alternate`,
    );
  }
}
const hindiCityRoutes = JSON.parse(
  fs.readFileSync(
    path.join(siteDirectory, "src", "lib", "hindi-city-routes.generated.json"),
    "utf8",
  ),
);
assert.equal(hindiCityRoutes.length, 45, "All 45 reviewed Hindi city routes should be generated");
const approvedHindiPaths = [
  "/hi/booking",
  "/hi/online-care",
  "/hi/contact",
  "/hi/about",
  "/hi/home-physiotherapy",
  ...hindiCityRoutes.map(({ slug }) => `/hi/physiotherapist-at-home/${slug}`),
].sort();
const indexedHindiPaths = sitemapEntries
  .map(({ loc }) => (loc?.startsWith("https://goswamirehab.in/hi/") ? new URL(loc).pathname : null))
  .filter(Boolean)
  .sort();
assert.deepEqual(
  indexedHindiPaths,
  approvedHindiPaths,
  "Only the five reviewed static routes and 45 reviewed city routes should be indexable under /hi/",
);

const indiaSitemap = fs.readFileSync(path.join(publicDirectory, "sitemap-in.xml"), "utf8");
assert.ok(indiaSitemap.includes("<loc>https://goswamirehab.in/hi</loc>"));
assert.ok(indiaSitemap.includes('hreflang="hi-IN" href="https://goswamirehab.in/hi"'));

console.log("Hindi homepage metadata, prerendered translation, and reciprocal sitemap alternates passed.");