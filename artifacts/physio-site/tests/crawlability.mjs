import assert from "node:assert/strict";
import http from "node:http";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { AI_CRAWLER_TOKENS } from "../crawler-policy.mjs";
import serviceRouteData from "../src/lib/service-guide-routes.json" with { type: "json" };

const siteDirectory = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);
const cityGuideRedirects = JSON.parse(
  readFileSync(path.join(siteDirectory, "dist", "city-guide-redirects.json"), "utf8"),
);

function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      return sourceFiles(entryPath);
    }
    return /\.(tsx?|jsx?)$/.test(entry.name) ? [entryPath] : [];
  });
}

const inlineStyleSources = sourceFiles(path.join(siteDirectory, "src"))
  .filter((filePath) => /style=\s*\{/.test(readFileSync(filePath, "utf8")))
  .map((filePath) => path.relative(siteDirectory, filePath));
assert.deepEqual(
  inlineStyleSources,
  [],
  "application source should not emit inline React style attributes",
);

const applicationRoutes = [
  "/",
  "/booking",
  "/online-care",
  "/contact",
  "/feedback",
  "/blog",
  "/blog/category/neuro-rehabilitation",
  "/blog/stroke-rehabilitation-at-home",
  ...serviceRouteData.rootPaths,
  "/services/pain-management-physiotherapy",
  "/services/pregnancy-postpartum-support",
  "/services/infant-early-development-physiotherapy",
  "/services/pediatric-disability-rehabilitation",
  "/cities",
  "/physiotherapist-at-home/jaipur",
  "/physiotherapist-at-home-in/rajasthan",
  "/privacy",
  "/terms",
  "/admin",
];

const missingRoutes = [
  "/does-not-exist",
  "/blog/not-a-real-post",
  "/blog/category/not-a-real-category",
  "/services/not-a-real-service",
  "/physiotherapist-at-home/not-a-real-city",
  "/physiotherapist-at-home-in/not-a-real-state",
];

async function getAvailablePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });

  const address = probe.address();
  assert.ok(address && typeof address !== "string", "Could not determine a free port");
  await new Promise((resolve, reject) => {
    probe.close((error) => (error ? reject(error) : resolve()));
  });
  return address.port;
}

async function waitForServer(server, url, output) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Crawlability test server exited early.\n${output.join("")}`);
    }

    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be binding its port.
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Crawlability test server did not become ready.\n${output.join("")}`);
}

function requestWithHeaders(serverPort, requestPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const request = http.request({
      hostname: "127.0.0.1",
      port: serverPort,
      path: requestPath,
      method: "GET",
      headers,
    }, (response) => {
      response.resume();
      response.once("end", () => resolve(response));
    });
    request.once("error", reject);
    request.end();
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlText(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function robotsGroup(robotsText, token) {
  const tokenPattern = escapeRegExp(token);
  const match = robotsText.match(
    new RegExp(
      `User-agent:\\s*${tokenPattern}\\s*\\n([\\s\\S]*?)(?=\\n\\s*User-agent:|\\n\\s*Sitemap:|$)`,
      "i",
    ),
  );
  assert.ok(match, `robots.txt should define a policy for ${token}`);
  return match[1];
}

const serverPort = await getAvailablePort();
const baseUrl = `http://127.0.0.1:${serverPort}`;
const bookingVariantManifest = JSON.parse(
  readFileSync(
    path.join(siteDirectory, "dist", "public", ".booking-variants", "manifest.json"),
    "utf8",
  ),
);
assert.ok(Array.isArray(bookingVariantManifest), "booking variant catalog should be generated as a list");
assert.ok(bookingVariantManifest.length > 0, "booking variant catalog should not be empty");
assert.equal(
  new Set(bookingVariantManifest.map((variant) => variant.query)).size,
  bookingVariantManifest.length,
  "each normalized booking query should appear exactly once",
);
const serverOutput = [];
const server = spawn(process.execPath, ["serve.mjs"], {
  cwd: siteDirectory,
  env: {
    ...process.env,
    PORT: String(serverPort),
    REPLIT_DEV_DOMAIN: "physio-preview.replit.dev",
  },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", (chunk) => serverOutput.push(chunk.toString()));
server.stderr.on("data", (chunk) => serverOutput.push(chunk.toString()));

try {
  await waitForServer(server, `${baseUrl}/`, serverOutput);

  const robotsResponse = await fetch(`${baseUrl}/robots.txt`, {
    headers: { "User-Agent": "GPTBot/1.0" },
  });
  assert.equal(robotsResponse.status, 200, "AI crawlers should be able to read robots.txt");
  const robotsText = await robotsResponse.text();
  assert.match(robotsText, /User-agent:\s*Googlebot[\s\S]*Allow:\s*\//);
  assert.doesNotMatch(robotsText, /Disallow:\s*\/booking\b/i, "clean booking landing page must remain crawlable");
  assert.doesNotMatch(
    robotsText,
    /Disallow:\s*\/physiotherapist-at-home-in\//i,
    "state hubs must remain crawlable so search engines can process their indexable signals",
  );
  assert.match(robotsText, /Sitemap:\s*https:\/\/goswamirehab\.in\/sitemap\.xml/);
  assert.match(robotsText, /Sitemap:\s*https:\/\/goswamirehab\.in\/sitemap-in\.xml/);

  for (const token of AI_CRAWLER_TOKENS) {
    const policy = robotsGroup(robotsText, token);
    assert.match(policy, /Allow:\s*\//i, `${token} should be allowed to crawl public pages`);

    const aiCrawlerResponse = await fetch(`${baseUrl}/blog`, {
      headers: { "User-Agent": `Mozilla/5.0 ${token}/1.0` },
    });
    assert.equal(aiCrawlerResponse.status, 200, `${token} should receive public page content`);
    assert.match(
      aiCrawlerResponse.headers.get("content-type") ?? "",
      /^text\/html/i,
      `${token} should receive normal HTML`,
    );
    assert.equal(
      aiCrawlerResponse.headers.get("x-robots-tag"),
      null,
      `${token} should be able to retrieve and cite public page content`,
    );
    assert.match(
      await aiCrawlerResponse.text(),
      /<title>[^<]*Goswami Rehab[^<]*<\/title>/,
      `${token} should receive the public page HTML`,
    );
  }

  const csp = (await fetch(`${baseUrl}/blog`)).headers.get("content-security-policy") ?? "";
  assert.match(
    csp,
    /script-src 'self' https:\/\/www\.googletagmanager\.com(?:;| )/,
    "CSP should allow the same-origin loader and Google Tag Manager",
  );
  assert.doesNotMatch(csp, /script-src[^;]*'unsafe-(?:inline|eval)'/, "CSP should not allow inline or eval scripts");
  assert.match(csp, /style-src 'self'(?:;|$)/, "CSP should restrict styles to same-origin resources");
  assert.doesNotMatch(csp, /style-src[^;]*'unsafe-inline'/, "CSP should not allow inline styles");
  assert.match(csp, /connect-src[^;]*https:\/\/www\.google-analytics\.com/);
  assert.match(csp, /frame-src[^;]*https:\/\/www\.googletagmanager\.com/);

  const llmsResponse = await fetch(`${baseUrl}/llms.txt`);
  assert.equal(llmsResponse.status, 200, "llms.txt should be publicly available");
  assert.match(
    llmsResponse.headers.get("content-type") ?? "",
    /^text\/plain/i,
    "llms.txt should be served as plain text",
  );
  assert.match(
    await llmsResponse.text(),
    /# Goswami Rehab[\s\S]*## Services[\s\S]*## Citation Guidance/,
    "llms.txt should contain the maintained public content guidance",
  );

  for (const userAgent of ["Googlebot/2.1", "Mozilla/5.0 (compatible; bingbot/2.0)"]) {
    const searchResponse = await fetch(`${baseUrl}/blog`, {
      headers: { "User-Agent": userAgent },
    });
    assert.equal(searchResponse.status, 200, `${userAgent} should retain normal indexing access`);
    assert.equal(searchResponse.headers.get("x-robots-tag"), null);
    assert.match(
      searchResponse.headers.get("vary") ?? "",
      /Accept-Encoding/,
      "static HTML should vary only on response-changing encoding negotiation",
    );
  }

  const searchTemplateResponse = await fetch(
    `${baseUrl}/blog?q=${encodeURIComponent("{search_term_string}")}`,
    { headers: { "User-Agent": "Googlebot/2.1" } },
  );
  assert.equal(searchTemplateResponse.status, 200, "blog search variants should still resolve");
  assert.equal(
    searchTemplateResponse.headers.get("x-robots-tag"),
    "noindex, follow, noai, noimageai",
    "blog search variants should not be indexable",
  );
  const searchTemplateHtml = await searchTemplateResponse.text();
  assert.match(
    searchTemplateHtml,
    /<meta name="robots" content="noindex, follow"/,
    "blog search variants should carry a noindex meta directive",
  );
  assert.match(
    searchTemplateHtml,
    /<link rel="canonical" href="https:\/\/goswamirehab\.in\/blog"/,
    "blog search variants should canonicalize to the Journal index",
  );

  for (const route of applicationRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    assert.equal(response.status, 200, `${route} should return HTTP 200`);
  }

  for (const [legacyRoute, canonicalRoute] of Object.entries(serviceRouteData.legacyRedirects)) {
    const query = "?source=service-route-test";
    const response = await fetch(`${baseUrl}${legacyRoute}${query}`, {
      redirect: "manual",
    });
    assert.equal(response.status, 301, `${legacyRoute} should permanently redirect`);
    assert.equal(
      response.headers.get("location"),
      `https://goswamirehab.in${canonicalRoute}${query}`,
      `${legacyRoute} should preserve the query while redirecting to ${canonicalRoute}`,
    );
  }

  assert.equal(Object.keys(cityGuideRedirects).length, 37, "all retired city-guide URLs should have redirect targets");
  const checkedCityTargets = new Set();
  for (const [legacyRoute, canonicalRoute] of Object.entries(cityGuideRedirects)) {
    const query = "?source=city-guide-test&campaign=redirect";
    const response = await fetch(`${baseUrl}${legacyRoute}${query}`, { redirect: "manual" });
    assert.equal(response.status, 301, `${legacyRoute} should permanently redirect`);
    assert.equal(
      response.headers.get("location"),
      `https://goswamirehab.in${canonicalRoute}${query}`,
      `${legacyRoute} should redirect directly to ${canonicalRoute} and preserve its query`,
    );

    if (!checkedCityTargets.has(canonicalRoute)) {
      checkedCityTargets.add(canonicalRoute);
      const targetResponse = await fetch(`${baseUrl}${canonicalRoute}`);
      assert.equal(targetResponse.status, 200, `${canonicalRoute} should be a live city destination`);
    }
  }

  const combinedCanonicalRedirect = await requestWithHeaders(
    serverPort,
    "/BLOG/STROKE-REHABILITATION-AT-HOME/?source=seo%3Fcase&campaign=route-test",
    { host: "www.goswamirehab.in", "x-forwarded-proto": "http" },
  );
  assert.equal(
    combinedCanonicalRedirect.statusCode,
    301,
    "host, protocol, uppercase path, and trailing slash should canonicalize in one hop",
  );
  assert.equal(
    combinedCanonicalRedirect.headers.location,
    "https://goswamirehab.in/blog/stroke-rehabilitation-at-home?source=seo%3Fcase&campaign=route-test",
    "the combined redirect should use the fixed canonical host and preserve the raw query",
  );

  const secureWwwRedirect = await requestWithHeaders(
    serverPort,
    "/?source=host-test",
    { host: "www.goswamirehab.in", "x-forwarded-proto": "https" },
  );
  assert.equal(secureWwwRedirect.statusCode, 301);
  assert.equal(
    secureWwwRedirect.headers.location,
    "https://goswamirehab.in/?source=host-test",
    "HTTPS www should redirect directly to the HTTPS apex host",
  );

  const insecureApexRedirect = await requestWithHeaders(
    serverPort,
    "/?source=host-test",
    { host: "goswamirehab.in", "x-forwarded-proto": "http" },
  );
  assert.equal(insecureApexRedirect.statusCode, 301);
  assert.equal(
    insecureApexRedirect.headers.location,
    "https://goswamirehab.in/?source=host-test",
    "HTTP apex should redirect directly to HTTPS apex",
  );

  for (const { host, protocol, label } of [
    { host: "www.goswamirehab.in", protocol: "http", label: "HTTP www" },
    { host: "www.goswamirehab.in", protocol: "https", label: "HTTPS www" },
    { host: "goswamirehab.in", protocol: "http", label: "HTTP apex" },
  ]) {
    const response = await requestWithHeaders(
      serverPort,
      "/about?source=single-hop-test",
      { host, "x-forwarded-proto": protocol },
    );
    assert.equal(response.statusCode, 301, `${label} should redirect permanently`);
    assert.equal(
      response.headers.location,
      "https://goswamirehab.in/about?source=single-hop-test",
      `${label} should redirect in one hop to the HTTPS apex while preserving the query`,
    );
  }

  const previewHostResponse = await requestWithHeaders(
    serverPort,
    "/",
    { host: "physio-preview.replit.dev", "x-forwarded-proto": "https" },
  );
  assert.equal(
    previewHostResponse.statusCode,
    200,
    "the configured Replit preview host should serve the local build instead of redirecting to production",
  );

  const gurugramAliasResponse = await requestWithHeaders(
    serverPort,
    "/PHYSIOTHERAPIST-AT-HOME/GURUGRAM/?source=alias-test&campaign=redirect",
    { host: "goswamirehab.com", "x-forwarded-proto": "https" },
  );
  assert.equal(gurugramAliasResponse.statusCode, 301, "Gurugram should permanently redirect to Gurgaon");
  assert.equal(
    gurugramAliasResponse.headers.location,
    "https://goswamirehab.in/physiotherapist-at-home/gurgaon?source=alias-test&campaign=redirect",
    "the Gurugram redirect should combine canonicalization and preserve the query",
  );

  const hostInjectionResponse = await requestWithHeaders(
    serverPort,
    "/about",
    { host: "attacker.example", "x-forwarded-proto": "https" },
  );
  assert.equal(hostInjectionResponse.statusCode, 301);
  assert.equal(
    hostInjectionResponse.headers.location,
    "https://goswamirehab.in/about",
    "redirect targets must never reflect an untrusted Host header",
  );

  const apiResponse = await requestWithHeaders(
    serverPort,
    "/api",
    { host: "www.goswamirehab.in", "x-forwarded-proto": "http" },
  );
  assert.notEqual(apiResponse.statusCode, 301, "/api requests must still reach the API proxy before SEO redirects");
  assert.equal(apiResponse.headers.location, undefined, "/api requests must not be rewritten as website redirects");

  const feedbackResponse = await fetch(`${baseUrl}/feedback`);
  assert.equal(feedbackResponse.status, 200, "the feedback page should remain available");
  assert.equal(
    feedbackResponse.headers.get("x-robots-tag"),
    "noindex, follow",
    "the private feedback page should send an explicit noindex response header",
  );

  const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200, "generated sitemap should be available");
  const sitemapText = await sitemapResponse.text();
  assert.ok(
    sitemapText.includes("<loc>https://goswamirehab.in/booking</loc>"),
    "the primary booking page should remain in the sitemap",
  );
  for (const variant of bookingVariantManifest) {
    const escapedVariantUrl = escapeHtml(
      `https://goswamirehab.in/booking?${variant.query}`,
    );
    assert.equal(
      sitemapText.includes(`<loc>${escapedVariantUrl}</loc>`),
      false,
      `${variant.query} should be omitted from the sitemap`,
    );
  }

  const contactTelehealthResponse = await fetch(`${baseUrl}/contact?mode=telehealth`);
  assert.equal(contactTelehealthResponse.status, 200, "the telehealth contact query should still work");
  const contactTelehealthHtml = await contactTelehealthResponse.text();
  assert.match(
    contactTelehealthHtml,
    /<link rel="canonical" href="https:\/\/goswamirehab\.in\/contact"\s*\/?>/,
    "the telehealth contact query should canonicalize to /contact",
  );
  assert.match(
    contactTelehealthHtml,
    /<meta name="robots" content="index, follow"/,
    "the contact telehealth query should remain indexable",
  );
  assert.equal(
    sitemapText.includes("<loc>https://goswamirehab.in/contact?mode=telehealth</loc>"),
    false,
    "the telehealth contact query should not be listed in the sitemap",
  );

  const cleanBookingResponse = await fetch(`${baseUrl}/booking`);
  assert.equal(cleanBookingResponse.status, 200);
  assert.equal(
    cleanBookingResponse.headers.get("x-robots-tag"),
    null,
    "the clean booking route should remain indexable",
  );
  const cleanBookingHtml = await cleanBookingResponse.text();
  assert.match(cleanBookingHtml, /<meta name="robots" content="index, follow"/);
  assert.match(
    cleanBookingHtml,
    /<link rel="canonical" href="https:\/\/goswamirehab\.in\/booking"\s*\/?>/,
  );

  const representativeCityHome = bookingVariantManifest.find(
    (variant) => variant.mode === "home" && variant.citySlug && !variant.localityId,
  );
  const bookingVariantSamples = [
    bookingVariantManifest.find((variant) => variant.mode === "telehealth" && !variant.citySlug),
    bookingVariantManifest.find((variant) => variant.mode === "telehealth" && variant.citySlug),
    representativeCityHome,
    bookingVariantManifest.find((variant) => variant.mode === "home" && variant.localityId),
    bookingVariantManifest.find(
      (variant) => variant.mode === "home" &&
        variant.citySlug &&
        !variant.localityId &&
        variant.citySlug !== representativeCityHome?.citySlug,
    ),
  ].filter(Boolean);
  assert.equal(
    new Set(bookingVariantSamples.map((variant) => variant.query)).size,
    5,
    "five distinct booking contexts should be available for response verification",
  );

  for (const [index, variant] of bookingVariantSamples.entries()) {
    const response = await fetch(`${baseUrl}/booking?${variant.query}`, {
      headers: { "User-Agent": "Googlebot/2.1" },
    });
    assert.equal(response.status, 200, `${variant.query} should return HTTP 200`);
    assert.equal(
      response.headers.get("x-robots-tag"),
      "noindex, follow",
      `${variant.query} should receive a noindex response header`,
    );

    const html = await response.text();
    assert.match(html, /<meta name="robots" content="noindex, follow/, `${variant.query} should be noindex`);
    assert.ok(
      html.includes(`<title>${escapeHtml(variant.title)}</title>`),
      `${variant.query} should receive its prerendered title`,
    );
    assert.ok(
      html.includes(`content="${escapeHtml(variant.description)}"`),
      `${variant.query} should receive its prerendered description`,
    );
    assert.ok(
      html.includes(escapeHtmlText(variant.heading)),
      `${variant.query} should render location-specific context before JavaScript`,
    );

    assert.match(
      html,
      /<link rel="canonical" href="https:\/\/goswamirehab\.in\/booking"\s*\/?>/,
      `${variant.query} should canonicalize to /booking`,
    );
    assert.doesNotMatch(
      html,
      /<script\b[^>]*type="application\/ld\+json"/i,
      `${variant.query} should not emit structured data because it is intentionally noindex`,
    );

    if (index === 0) {
      const etag = response.headers.get("etag");
      assert.ok(etag, "booking variant responses should include an ETag");
      const conditionalResponse = await fetch(`${baseUrl}/booking?${variant.query}`, {
        headers: { "If-None-Match": etag },
      });
      assert.equal(conditionalResponse.status, 304, "matching booking ETags should return 304");
      assert.equal(
        conditionalResponse.headers.get("x-robots-tag"),
        "noindex, follow",
        "304 responses should retain the booking noindex header",
      );
    }
  }

  const cityHomeVariant = bookingVariantManifest.find(
    (variant) => variant.mode === "home" && variant.citySlug && !variant.localityId,
  );
  const localityVariant = bookingVariantManifest.find(
    (variant) => variant.mode === "home" && variant.citySlug && variant.localityId,
  );
  assert.ok(cityHomeVariant, "catalog should include city home-visit requests");
  assert.ok(localityVariant, "catalog should include locality home-visit requests");

  const invalidBookingQueries = [
    "city=not-a-real-city",
    `city=${cityHomeVariant.citySlug}&mode=home`,
    `city=${cityHomeVariant.citySlug}&mode=`,
    `city=${localityVariant.citySlug}&locality=${localityVariant.localityId}&mode=telehealth`,
    `city=${cityHomeVariant.citySlug}&locality=not-a-real-locality`,
    `city=${cityHomeVariant.citySlug}&unsupported=value`,
  ];
  for (const query of invalidBookingQueries) {
    const response = await fetch(`${baseUrl}/booking?${query}`);
    assert.equal(response.status, 200, `${query} should remain safe for visitors`);
    assert.equal(
      response.headers.get("x-robots-tag"),
      "noindex, follow",
      `${query} should not be indexable`,
    );
    const html = await response.text();
    assert.match(html, /<meta name="robots" content="noindex, follow"/);
    assert.match(html, /<link rel="canonical" href="https:\/\/goswamirehab\.in\/booking"/);
  }

  const trackedBookingResponse = await fetch(
    `${baseUrl}/booking?${cityHomeVariant.query}&utm_source=crawlability-test`,
  );
  assert.equal(trackedBookingResponse.status, 200, "tracking parameters should not break a valid booking context");
  assert.equal(
    trackedBookingResponse.headers.get("x-robots-tag"),
    "noindex, follow",
  );
  const trackedBookingHtml = await trackedBookingResponse.text();
  assert.match(trackedBookingHtml, /<meta name="robots" content="noindex, follow/);
  assert.match(
    trackedBookingHtml,
    /<link rel="canonical" href="https:\/\/goswamirehab\.in\/booking"\s*\/?>/,
    "tracking variants should canonicalize to /booking",
  );

  const internalBookingFileResponse = await fetch(`${baseUrl}/.booking-variants/manifest.json`);
  assert.equal(internalBookingFileResponse.status, 404, "internal prerender files should not be public routes");

  const adminResponse = await fetch(`${baseUrl}/admin`);
  const adminHtml = await adminResponse.text();
  assert.match(adminHtml, /<meta name="robots" content="noindex, follow, noai, noimageai"/);
  assert.match(adminHtml, /<link rel="canonical" href="https:\/\/goswamirehab\.in\/admin"/);
  assert.doesNotMatch(adminHtml, /<div id="root">[\s\S]+<\/div>/);

  const legacyArticleResponse = await fetch(
    `${baseUrl}/blog/post-surgery-rehab-what-to-expect?source=search-console`,
    { redirect: "manual" },
  );
  assert.equal(
    legacyArticleResponse.status,
    301,
    "the legacy post-surgery Journal URL should permanently redirect",
  );
  assert.equal(
    legacyArticleResponse.headers.get("location"),
    "https://goswamirehab.in/post-surgery-rehab?source=search-console",
    "the legacy Journal URL should redirect to the canonical post-surgery service page",
  );

  for (const route of missingRoutes) {
    const response = await fetch(`${baseUrl}${route}`);
    const html = await response.text();
    assert.equal(response.status, 404, `${route} should return HTTP 404`);
    assert.equal(
      response.headers.get("x-robots-tag"),
      "noindex",
      `${route} should send an explicit noindex response header`,
    );
    assert.match(html, /Page Not Found/, `${route} should return the 404 document`);
  }

  console.log(
    `Crawlability and AI crawler protection checks passed for ${applicationRoutes.length} application routes and ${missingRoutes.length} missing routes.`,
  );
} finally {
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
}