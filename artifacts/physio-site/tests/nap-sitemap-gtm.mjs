import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = path.resolve(here, "..");
const distRoot = path.join(siteRoot, "dist", "public");
const baseUrl = "https://goswamirehab.in";
assert.equal(
  existsSync(path.join(siteRoot, "public", "sitemap.xml")),
  false,
  "the sitemap template must not be exposed as a static public file",
);
assert.equal(
  existsSync(path.join(siteRoot, "client", "public", "sitemap.xml")),
  false,
  "a second client public directory must not serve a stale static sitemap",
);
for (const staleCopy of [
  path.join(siteRoot, "dist", "server", "sitemap.xml"),
  path.join(siteRoot, "dist", "server", "sitemap-com.xml"),
  path.join(distRoot, "sitemap-com.xml"),
]) {
  assert.equal(
    existsSync(staleCopy),
    false,
    `${path.relative(siteRoot, staleCopy)} must not remain as a stale sitemap copy`,
  );
}
const nap = JSON.parse(
  readFileSync(path.join(siteRoot, "src", "lib", "nap.generated.json"), "utf8"),
);
const apiNap = JSON.parse(
  readFileSync(path.resolve(siteRoot, "..", "api-server", "src", "lib", "nap.generated.json"), "utf8"),
);
assert.deepEqual(apiNap, nap, "site and API NAP payloads should match the shared business configuration");

function getSitemapUrls(filePath) {
  const xml = readFileSync(filePath, "utf8");
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<\/urlset>\s*$/);
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function assertCanonicalSitemap(filePath, label) {
  const xml = readFileSync(filePath, "utf8");
  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  const urls = [];
  const today = new Date().toISOString().slice(0, 10);
  assert.ok(entries.length > 0, `${label} should contain URL entries`);
  assert.doesNotMatch(xml, /<(?:changefreq|priority)\b/i, `${label} should omit changefreq and priority`);

  for (const entry of entries) {
    const locMatches = [...entry.matchAll(/<loc>([^<]+)<\/loc>/g)];
    assert.equal(locMatches.length, 1, `${label} entries should contain exactly one canonical loc`);
    const loc = locMatches[0][1];
    const url = new URL(loc);
    assert.equal(url.origin, baseUrl, `${label} loc should use the canonical HTTPS origin`);
    assert.equal(url.search, "", `${label} loc should not contain a query`);
    assert.equal(url.hash, "", `${label} loc should not contain a hash`);
    assert.equal(
      url.pathname === "/" || (url.pathname === url.pathname.toLowerCase() && !url.pathname.endsWith("/")),
      true,
      `${label} loc should use the lowercase slashless canonical path`,
    );
    assert.notEqual(url.pathname, "/physiotherapist-at-home/gurugram", `${label} must omit the Gurugram redirect alias`);
    assert.doesNotMatch(url.pathname, /^\/services\/(?:online-physiotherapy|homecare-physiotherapy|nutritional-consultation|sports-enhancement-consultation)$/, `${label} must omit redirected service aliases`);

    const lastmodMatches = [...entry.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)];
    assert.equal(lastmodMatches.length, 1, `${label} entries should contain exactly one lastmod`);
    const lastmod = lastmodMatches[0][1];
    assert.match(lastmod, /^\d{4}-\d{2}-\d{2}$/, `${label} lastmod should use an ISO calendar date`);
    const parsedLastmod = new Date(`${lastmod}T00:00:00.000Z`);
    assert.equal(
      Number.isNaN(parsedLastmod.getTime()) || parsedLastmod.toISOString().slice(0, 10) !== lastmod,
      false,
      `${label} lastmod should be a valid calendar date`,
    );
    assert.ok(lastmod <= today, `${label} lastmod must not be in the future`);
    urls.push(loc);
  }

  assert.equal(new Set(urls).size, urls.length, `${label} should not repeat canonical URLs`);
  assert.equal(
    urls.some((url) => new URL(url).pathname === "/booking" && new URL(url).search),
    false,
    `${label} should omit booking query variants`,
  );
}

function getHtml(routePath) {
  return readFileSync(path.join(distRoot, routePath, "index.html"), "utf8");
}

function getSchemas(html) {
  return [...html.matchAll(
    /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match) => JSON.parse(match[1]));
}

function flattenSchemas(schemas) {
  return schemas.flatMap((schema) =>
    Array.isArray(schema["@graph"]) ? schema["@graph"] : [schema],
  );
}

function getCanonical(html) {
  return html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
}

function hasType(entity, type) {
  return entity["@type"] === type ||
    (Array.isArray(entity["@type"]) && entity["@type"].includes(type));
}

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(entryPath);
    return entry.name === "index.html" ? [entryPath] : [];
  });
}

const fullSitemapUrls = getSitemapUrls(path.join(distRoot, "sitemap.xml"));
const supplementalUrls = getSitemapUrls(path.join(distRoot, "sitemap-in.xml"));
assertCanonicalSitemap(path.join(distRoot, "sitemap.xml"), "Main sitemap");
assertCanonicalSitemap(path.join(distRoot, "sitemap-in.xml"), "Supplemental sitemap");
const fullCityUrls = fullSitemapUrls.filter((url) =>
  /^https:\/\/goswamirehab\.in\/physiotherapist-at-home\/[^/]+$/.test(url),
);
const supplementalCityUrls = supplementalUrls.filter((url) =>
  /^https:\/\/goswamirehab\.in\/physiotherapist-at-home\/[^/]+$/.test(url),
);
const fullHindiCityUrls = fullSitemapUrls.filter((url) =>
  /^https:\/\/goswamirehab\.in\/hi\/physiotherapist-at-home\/[^/]+$/.test(url),
);
const supplementalHindiCityUrls = supplementalUrls.filter((url) =>
  /^https:\/\/goswamirehab\.in\/hi\/physiotherapist-at-home\/[^/]+$/.test(url),
);
const homeUrls = supplementalUrls.filter((url) =>
  url === `${baseUrl}/` || url === baseUrl,
);
const hindiHomeUrls = supplementalUrls.filter((url) => url === `${baseUrl}/hi`);
const robots = readFileSync(path.join(distRoot, "robots.txt"), "utf8");

assert.equal(homeUrls.length, 1, "the supplemental sitemap should contain the homepage once");
assert.equal(hindiHomeUrls.length, 1, "the supplemental sitemap should contain the Hindi homepage once");
assert.equal(
  supplementalUrls.length,
  supplementalCityUrls.length + supplementalHindiCityUrls.length + homeUrls.length + hindiHomeUrls.length,
);
assert.equal(new Set(supplementalUrls).size, supplementalUrls.length);
assert.deepEqual(
  new Set(supplementalCityUrls),
  new Set(fullCityUrls),
  "the supplemental sitemap should contain every indexable city URL from the full sitemap",
);
assert.equal(fullCityUrls.length, 45, "the full sitemap should contain all 45 authored city pages");
assert.deepEqual(
  new Set(supplementalHindiCityUrls),
  new Set(fullHindiCityUrls),
  "the supplemental sitemap should contain every indexable Hindi city URL from the full sitemap",
);
assert.equal(fullHindiCityUrls.length, 45, "the full sitemap should contain all 45 reviewed Hindi city pages");
const homepageSourceHtml = getHtml("");
const homepageCityPaths = [
  ...new Set(
    [...homepageSourceHtml.matchAll(
      /<a\b[^>]*\bhref="(\/physiotherapist-at-home\/[a-z0-9-]+)"[^>]*>/gi,
    )].map((match) => match[1]),
  ),
];
assert.equal(
  homepageCityPaths.length,
  45,
  "the homepage 45-City Network should link to all 45 city pages",
);
assert.deepEqual(
  new Set(homepageCityPaths.map((cityPath) => `${baseUrl}${cityPath}`)),
  new Set(fullCityUrls),
  "homepage city links should match the indexable city URLs in the full sitemap",
);
const categoryPageFiles = findHtmlFiles(path.join(distRoot, "blog", "category"));
const categoryCanonicalUrls = categoryPageFiles.map((filePath) =>
  getCanonical(readFileSync(filePath, "utf8")),
);
const categorySitemapUrls = fullSitemapUrls.filter((url) =>
  new URL(url).pathname.startsWith("/blog/category/"),
);
assert.ok(categoryCanonicalUrls.length > 0, "prerendered Journal category pages should exist");
assert.equal(
  new Set(categoryCanonicalUrls).size,
  categoryCanonicalUrls.length,
  "each Journal category page should have a unique canonical URL",
);
assert.deepEqual(
  new Set(categorySitemapUrls),
  new Set(categoryCanonicalUrls),
  "each Journal category should appear exactly once in the sitemap",
);
assert.equal(
  fullSitemapUrls.filter((url) => new URL(url).pathname === "/booking").length,
  1,
  "the sitemap should contain exactly one clean /booking URL",
);
assert.ok(
  supplementalUrls.every((url) =>
    url === homeUrls[0] ||
    url === hindiHomeUrls[0] ||
    /^https:\/\/goswamirehab\.in\/(?:hi\/)?physiotherapist-at-home\/[^/]+$/.test(url),
  ),
  "the supplemental sitemap should contain only the English and Hindi homepages and city pages",
);
assert.ok(fullSitemapUrls.some((url) => url.startsWith(`${baseUrl}/blog/`)));
const feedbackHtml = getHtml("feedback");
assert.match(
  feedbackHtml,
  /<meta name="robots" content="noindex, follow, noai, noimageai"/,
  "The private feedback form should not appear in search results",
);
assert.doesNotMatch(
  feedbackHtml,
  /<script\b[^>]*type="application\/ld\+json"/i,
  "The noindex feedback form should not publish structured data",
);
assert.equal(
  (feedbackHtml.match(/<main\b/gi) ?? []).length,
  1,
  "The feedback page should have one main landmark from the shared layout",
);
assert.equal(
  fullSitemapUrls.includes(`${baseUrl}/feedback`),
  false,
  "The private feedback form should not be listed in the XML sitemap",
);
const contactHtml = getHtml("contact");
assert.equal(
  (contactHtml.match(/<main\b/gi) ?? []).length,
  1,
  "The contact page should have one main landmark from the shared layout",
);
const mapLinkAttributes = [...contactHtml.matchAll(
  /<a\b(?=[^>]*\bhref="https:\/\/maps\.app\.goo\.gl\/[^"]+")(?=[^>]*\btarget="_blank")([^>]*)>/gi,
)].map((match) => match[1]);
assert.equal(
  mapLinkAttributes.filter((attributes) => /\baria-label="Open map for /.test(attributes)).length,
  3,
  "Each contact map profile should render one external map link",
);
for (const attributes of mapLinkAttributes) {
  assert.match(attributes, /\brel="[^"]*\bnoopener\b[^"]*"/, "External map links should prevent opener access");
  assert.match(attributes, /\brel="[^"]*\bnoreferrer\b[^"]*"/, "External map links should not send referrer details");
}
const contactDescriptionIds = [...contactHtml.matchAll(/\baria-describedby="([^"]+)"/g)]
  .flatMap((match) => match[1].split(/\s+/));
assert.ok(
  contactDescriptionIds.length > 0,
  "Contact form help text should remain associated with its controls",
);
for (const descriptionId of contactDescriptionIds) {
  assert.ok(
    contactHtml.includes(`id="${descriptionId}"`),
    `Contact aria-describedby target ${descriptionId} should exist in rendered HTML`,
  );
}
assert.match(robots, /Sitemap:\s*https:\/\/goswamirehab\.in\/sitemap\.xml/);
assert.match(robots, /Sitemap:\s*https:\/\/goswamirehab\.in\/sitemap-in\.xml/);

const indexableMetadata = findHtmlFiles(distRoot)
  .map((filePath) => {
    const html = readFileSync(filePath, "utf8");
    const robotsContent =
      html.match(/<meta name="robots" content="([^"]+)"/i)?.[1] ?? "index, follow";
    if (/\bnoindex\b/i.test(robotsContent)) return null;
    const title = html.match(/<title>([^<]+)<\/title>/i)?.[1];
    const description = html.match(/<meta name="description" content="([^"]*)"/i)?.[1];
    const canonical = getCanonical(html);
    const canonicalOrigin = canonical ? new URL(canonical).origin : null;
    assert.ok(title, `Indexable HTML must have a title: ${filePath}`);
    assert.ok(description, `Indexable HTML must have a description: ${filePath}`);
    assert.ok(
      canonicalOrigin === baseUrl,
      `Indexable canonical must stay on the .in domain: ${filePath}`,
    );
    return { filePath, title, description, canonical };
  })
  .filter(Boolean);
assert.ok(indexableMetadata.length > 1, "expected multiple indexable prerendered routes");
assert.equal(
  new Set(indexableMetadata.map((entry) => entry.title)).size,
  indexableMetadata.length,
  "each indexable prerendered route should have a unique title",
);
assert.equal(
  new Set(indexableMetadata.map((entry) => entry.description)).size,
  indexableMetadata.length,
  "each indexable prerendered route should have a unique description",
);

const homeHtml = getHtml("");
const jaipurHtml = getHtml("physiotherapist-at-home/jaipur");
const mumbaiHtml = getHtml("physiotherapist-at-home/mumbai");
assert.equal(getCanonical(homeHtml), `${baseUrl}/`);
assert.equal(
  getCanonical(jaipurHtml),
  `${baseUrl}/physiotherapist-at-home/jaipur`,
);
assert.equal(
  getCanonical(mumbaiHtml),
  `${baseUrl}/physiotherapist-at-home/mumbai`,
);
assert.match(homeHtml, /<title>[^<]*Goswami Rehab[^<]*<\/title>/);

const homeEntities = flattenSchemas(getSchemas(homeHtml));
const organization = homeEntities.find((entity) => entity["@id"] === `${baseUrl}/#organization`);
assert.ok(organization, "homepage should contain the canonical organization entity");
assert.equal(organization.name, nap.name);
assert.equal(organization.url, baseUrl);
if (nap.telephone) {
  assert.equal(organization.telephone, `+${nap.telephone.replace(/\D/g, "")}`);
} else {
  assert.equal(
    organization.telephone,
    undefined,
    "structured data should not invent a phone number when none is configured",
  );
}
const organizationTypes = Array.isArray(organization["@type"])
  ? organization["@type"]
  : [organization["@type"]];
assert.deepEqual(
  [...organizationTypes].sort(),
  ["Organization"],
  "the canonical business entity should not imply a physical LocalBusiness location",
);
for (const property of ["address", "geo", "openingHoursSpecification", "hasMap"]) {
  assert.equal(
    organization[property],
    undefined,
    `canonical Organization should not publish the storefront property "${property}"`,
  );
}
assert.ok(organization.sameAs.includes(nap.mapUrl));
assert.ok(
  !organization.sameAs.some((url) => url.includes("g_st=")),
  "the canonical Maps URL should not contain tracking parameters",
);

const jaipurEntities = flattenSchemas(getSchemas(jaipurHtml));
const jaipurService = jaipurEntities.find((entity) =>
  hasType(entity, "Service") && entity.provider?.["@id"] === `${baseUrl}/#organization`,
);
assert.ok(jaipurService, "the Jaipur city service should reference the canonical organization");
assert.deepEqual(
  jaipurService.areaServed,
  { "@type": "City", "name": "Jaipur" },
  "Jaipur's Service should be scoped to the city, not its operations HQ",
);
assert.deepEqual(
  flattenSchemas(getSchemas(mumbaiHtml)).filter((entity) => hasType(entity, "LocalBusiness")),
  [],
  "a service-area city page should not publish LocalBusiness schema",
);
assert.deepEqual(
  jaipurEntities.filter((entity) => hasType(entity, "LocalBusiness")),
  [],
  "the operations and training HQ should not be presented as a patient-facing LocalBusiness",
);

const indexHtml = readFileSync(path.join(distRoot, "index.html"), "utf8");
const gtmLoader = readFileSync(path.join(distRoot, "gtm-loader.js"), "utf8");
assert.match(indexHtml, /<script defer src="\/gtm-loader\.js"><\/script>/);
assert.match(
  indexHtml,
  /<!-- Google Tag Manager \(noscript\) -->\s*<noscript><iframe src="https:\/\/www\.googletagmanager\.com\/ns\.html\?id=GTM-KVDF36QN"\s+title="Google Tag Manager"\s+height="0" width="0" style="display:none;visibility:hidden"><\/iframe><\/noscript>\s*<!-- End Google Tag Manager \(noscript\) -->/,
);
assert.match(gtmLoader, /GTM-KVDF36QN/);
assert.match(gtmLoader, /https:\/\/www\.googletagmanager\.com\/gtm\.js/);
assert.match(gtmLoader, /requestIdleCallback/);
assert.match(gtmLoader, /pointerdown/);
assert.match(gtmLoader, /touchstart/);

function createGtmLoaderHarness() {
  const listeners = new Map();
  const idleCallbacks = [];
  const appendedScripts = [];
  const dataLayer = [];
  const window = {
    dataLayer,
    addEventListener(name, callback) {
      const current = listeners.get(name) ?? [];
      current.push(callback);
      listeners.set(name, current);
    },
    requestIdleCallback(callback, options) {
      idleCallbacks.push({ callback, options });
    },
     setTimeout(callback, delay) {
       idleCallbacks.push({ callback, options: { fallback: true, delay } });
    },
  };
  const document = {
    readyState: "complete",
    createElement(tagName) {
      return { tagName };
    },
    head: {
      appendChild(script) {
        appendedScripts.push(script);
      },
    },
  };

  runInNewContext(gtmLoader, { window, document, Date });
  return { listeners, idleCallbacks, appendedScripts, dataLayer };
}

const interactionGtm = createGtmLoaderHarness();
assert.equal(interactionGtm.appendedScripts.length, 0, "GTM must not load during initial page startup");
interactionGtm.listeners.get("pointerdown")[0]();
assert.equal(interactionGtm.appendedScripts.length, 1, "first interaction should load GTM");
assert.equal(interactionGtm.dataLayer[0]?.event, "gtm.js", "GTM should initialize its data layer on demand");
interactionGtm.idleCallbacks[0].callback();
assert.equal(interactionGtm.idleCallbacks[1].options.delay, 12000, "the idle fallback should be delayed");
interactionGtm.idleCallbacks[1].callback();
assert.equal(interactionGtm.appendedScripts.length, 1, "idle and interaction triggers must not load GTM twice");

const idleGtm = createGtmLoaderHarness();
idleGtm.idleCallbacks[0].callback();
assert.equal(idleGtm.idleCallbacks[1].options.delay, 12000, "the idle fallback should wait 12 seconds");
assert.equal(idleGtm.appendedScripts.length, 0, "the idle callback should not load GTM during startup");
idleGtm.idleCallbacks[1].callback();
assert.equal(idleGtm.appendedScripts.length, 1, "idle callback should load GTM when there is no interaction");
assert.equal(idleGtm.appendedScripts[0]?.async, true, "GTM script should remain asynchronous");

const inlineScriptBodies = [...indexHtml.matchAll(
  /<script\b([^>]*)>([\s\S]*?)<\/script>/gi,
)]
  .filter((match) => !/\bsrc\s*=/.test(match[1]))
  .map((match) => match[2])
  .join("\n");
assert.doesNotMatch(inlineScriptBodies, /GTM-KVDF36QN|gtm\.start|gtm\.js/i);

console.log(
  `NAP, canonical schema, GTM shell, and supplemental sitemap checks passed (${supplementalCityUrls.length} city pages).`,
);