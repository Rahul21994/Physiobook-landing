import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  fingerprintHindiRouteCopy,
  parseHindiApprovalLedger,
} from "../scripts/hindi-copy-fingerprint.mjs";

const PUBLIC_DIR = path.resolve("dist/public");
const DIST_DIR = path.resolve("dist");
const WORKSPACE_ROOT = path.resolve("../..");
const BASE_URL = "https://goswamirehab.in";
const STATIC_ROUTE_PAIRS = [
  ["/hi/booking", "/booking"],
  ["/hi/online-care", "/online-care"],
  ["/hi/contact", "/contact"],
  ["/hi/about", "/about"],
  ["/hi/home-physiotherapy", "/home-physiotherapy"],
];

function fileForRoute(routePath) {
  return path.join(PUBLIC_DIR, routePath.replace(/^\/+|\/+$/gu, ""), "index.html");
}

function attribute(tag, name) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return tag.match(new RegExp(`\\b${escapedName}\\s*=\\s*(["'])(.*?)\\1`, "iu"))?.[2];
}

function linkTags(html) {
  return html.match(/<link\b[^>]*>/giu) ?? [];
}

function alternateFor(html, language) {
  return linkTags(html).find(
    (tag) =>
      (attribute(tag, "rel") ?? "").split(/\s+/u).includes("alternate") &&
      attribute(tag, "hreflang") === language,
  );
}

function structuredDataTypes(html) {
  const scripts = html.match(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/giu,
  ) ?? [];
  return scripts.flatMap((script) => {
    const json = script.replace(/^<script\b[^>]*>/iu, "").replace(/<\/script>$/iu, "");
    const schema = JSON.parse(json);
    return Array.isArray(schema) ? schema.map((entry) => entry["@type"]) : [schema["@type"]];
  });
}

async function collectIndexFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectIndexFiles(fullPath));
    else if (entry.name === "index.html") files.push(fullPath);
  }
  return files;
}

const cityRoot = path.join(PUBLIC_DIR, "hi", "physiotherapist-at-home");
const cityFiles = await collectIndexFiles(cityRoot);
assert.equal(cityFiles.length, 45, `Expected 45 Hindi city pages, found ${cityFiles.length}.`);

const cityPaths = cityFiles
  .map((filePath) => {
    const relative = path.relative(cityRoot, path.dirname(filePath));
    return `/hi/physiotherapist-at-home/${relative.split(path.sep).join("/")}`;
  })
  .sort();
assert.equal(new Set(cityPaths).size, 45, "Hindi city route paths must be unique.");
for (const cityPath of cityPaths) {
  assert.match(cityPath, /^\/hi\/physiotherapist-at-home\/[^/]+$/u);
}

const routePairs = [
  ...STATIC_ROUTE_PAIRS,
  ...cityPaths.map((hindiPath) => [
    hindiPath,
    hindiPath.replace("/hi/physiotherapist-at-home/", "/physiotherapist-at-home/"),
  ]),
];
assert.equal(routePairs.length, 50);

const ledgerText = await readFile(path.join(WORKSPACE_ROOT, "docs/hindi-review/README.md"), "utf8");
const approvalLedger = parseHindiApprovalLedger(ledgerText);
const approvedCopy = JSON.parse(
  await readFile(
    path.join(WORKSPACE_ROOT, "docs/hindi-review/approved-copy-fingerprints.json"),
    "utf8",
  ),
);
assert.equal(approvedCopy.version, 1, "Hindi copy fingerprint manifest version must be supported.");
assert.ok(approvedCopy.revisionSets && approvedCopy.routes, "Hindi copy fingerprint manifest is incomplete.");
assert.equal(Object.keys(approvedCopy.routes).length, 50, "Expected fingerprints for exactly 50 Hindi subroutes.");

const { hindiRouteRegistry, hindiStaticRouteRegistry } = await import(
  pathToFileURL(path.join(DIST_DIR, "server", "entry-server.js")).href
);
assert.equal(hindiRouteRegistry.length, 50, "Expected 50 current Hindi route records.");
assert.equal(hindiStaticRouteRegistry.length, 5, "Expected five reviewed Hindi static routes.");
const routeRegistryByPath = new Map(hindiRouteRegistry.map((route) => [route.path, route]));
assert.deepEqual(
  [...routeRegistryByPath.keys()].sort(),
  routePairs.map(([hindiPath]) => hindiPath).sort(),
  "Rendered route set must match the registered route set.",
);
assert.deepEqual(
  [...approvalLedger.keys()].sort(),
  routePairs.map(([hindiPath]) => hindiPath).sort(),
  "Review ledger must approve exactly the rendered Hindi subroutes.",
);
assert.deepEqual(
  Object.keys(approvedCopy.routes).sort(),
  routePairs.map(([hindiPath]) => hindiPath).sort(),
  "Copy fingerprint manifest must cover exactly the rendered Hindi subroutes.",
);

function currentRevisions(route) {
  return typeof route.revision === "string" ? [route.revision] : Object.values(route.revision);
}

for (const [hindiPath] of routePairs) {
  const route = routeRegistryByPath.get(hindiPath);
  const ledgerApproval = approvalLedger.get(hindiPath);
  const fingerprintRecord = approvedCopy.routes[hindiPath];
  const manifestRevisions = approvedCopy.revisionSets[fingerprintRecord?.revisionSet];
  assert.ok(route, `${hindiPath}: route registry record is missing.`);
  assert.ok(ledgerApproval, `${hindiPath}: review ledger record is missing.`);
  assert.ok(Array.isArray(manifestRevisions), `${hindiPath}: fingerprint revision set is missing.`);
  assert.deepEqual(
    currentRevisions(route),
    ledgerApproval.revisions,
    `${hindiPath}: current route revision does not match the approved review ledger.`,
  );
  assert.deepEqual(
    ledgerApproval.revisions,
    manifestRevisions,
    `${hindiPath}: fingerprint revision set does not match the approved review ledger.`,
  );
  assert.match(fingerprintRecord.sha256 ?? "", /^[a-f\d]{64}$/iu, `${hindiPath}: invalid copy fingerprint.`);
}

const mainSitemap = await readFile(path.join(PUBLIC_DIR, "sitemap.xml"), "utf8");
const supplementalSitemap = await readFile(path.join(PUBLIC_DIR, "sitemap-in.xml"), "utf8");
for (const [hindiPath] of routePairs) {
  const canonical = `${BASE_URL}${hindiPath}`;
  assert.ok(
    mainSitemap.includes(`<loc>${canonical}</loc>`),
    `Main sitemap is missing ${hindiPath}.`,
  );
}
for (const cityPath of cityPaths) {
  const canonical = `${BASE_URL}${cityPath}`;
  assert.ok(
    supplementalSitemap.includes(`<loc>${canonical}</loc>`),
    `Supplemental sitemap is missing ${cityPath}.`,
  );
}

for (const [hindiPath, englishPath] of routePairs) {
  const hindiHtml = await readFile(fileForRoute(hindiPath), "utf8");
  const englishHtml = await readFile(fileForRoute(englishPath), "utf8");
  const hindiCanonical = `${BASE_URL}${hindiPath}`;
  const englishCanonical = `${BASE_URL}${englishPath}`;
  const actualFingerprint = fingerprintHindiRouteCopy(hindiHtml);
  const approvedFingerprint = approvedCopy.routes[hindiPath].sha256;
  assert.equal(
    actualFingerprint,
    approvedFingerprint,
    `${hindiPath}: rendered patient-facing copy differs from the approved fingerprint. Renew reviewer approval and revisions; do not only replace the fingerprint.`,
  );

  assert.match(hindiHtml, /<html\b[^>]*\blang="hi"/iu, `${hindiPath}: expected Hindi document language.`);
  const canonicalLinks = linkTags(hindiHtml).filter(
    (tag) => (attribute(tag, "rel") ?? "").split(/\s+/u).includes("canonical"),
  );
  assert.equal(canonicalLinks.length, 1, `${hindiPath}: expected one canonical link.`);
  assert.equal(attribute(canonicalLinks[0], "href"), hindiCanonical);

  for (const [html, language, href, pagePath] of [
    [hindiHtml, "en-IN", englishCanonical, hindiPath],
    [hindiHtml, "hi-IN", hindiCanonical, hindiPath],
    [hindiHtml, "x-default", englishCanonical, hindiPath],
    [englishHtml, "en-IN", englishCanonical, englishPath],
    [englishHtml, "hi-IN", hindiCanonical, englishPath],
    [englishHtml, "x-default", englishCanonical, englishPath],
  ]) {
    const link = alternateFor(html, language);
    assert.ok(link, `${pagePath}: missing ${language} alternate.`);
    assert.equal(attribute(link, "href"), href, `${pagePath}: incorrect ${language} alternate.`);
  }

  const robotsTags = (hindiHtml.match(/<meta\b[^>]*>/giu) ?? [])
    .filter((tag) => attribute(tag, "name") === "robots");
  assert.equal(robotsTags.length, 1, `${hindiPath}: expected one robots directive.`);
  assert.doesNotMatch(attribute(robotsTags[0], "content") ?? "", /\bnoindex\b/iu);

  if (hindiPath.startsWith("/hi/physiotherapist-at-home/")) {
    const types = structuredDataTypes(hindiHtml);
    for (const requiredType of ["Service", "FAQPage", "BreadcrumbList"]) {
      assert.ok(types.includes(requiredType), `${hindiPath}: missing ${requiredType} structured data.`);
    }
    assert.match(
      hindiHtml,
      /href="\/physiotherapist-at-home-in\/[^"]+"/u,
      `${hindiPath}: missing its state or union-territory discovery link.`,
    );
    assert.match(
      hindiHtml,
      /href="\/hi\/booking(?:\?[^"]*)?"/u,
      `${hindiPath}: missing its Hindi booking link.`,
    );
  }
}

assert.ok(
  structuredDataTypes(await readFile(fileForRoute("/hi/contact"), "utf8")).includes("FAQPage"),
  "/hi/contact must emit the reviewed Hindi FAQ schema.",
);
assert.ok(
  structuredDataTypes(await readFile(fileForRoute("/hi/online-care"), "utf8")).includes("Service"),
  "/hi/online-care must emit its service schema.",
);

console.log("Validated all 50 Hindi subroutes, reciprocal hreflang, city discovery links, schema, and sitemap coverage.");