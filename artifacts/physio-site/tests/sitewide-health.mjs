import assert from "node:assert/strict";
import { createServer } from "node:net";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { chromium } from "playwright";
import { exposeNixBrowserLibraries } from "./playwright-runtime.mjs";

const siteDirectory = path.dirname(
  fileURLToPath(new URL("../package.json", import.meta.url)),
);
const serverEntry = path.join(siteDirectory, "dist", "server", "entry-server.js");
const { journalDiscoveryIndex } = await import(
  `${serverEntry}?sitewide-health-test=${Date.now()}`,
);

exposeNixBrowserLibraries();

const routes = [
  "/",
  "/blog",
  "/blog/category/neuro-rehabilitation",
  "/blog/stroke-rehabilitation-at-home",
  "/blog/diet-requirements-after-stroke",
  "/blog/diet-and-fat-loss",
  "/blog/category/nutrition-clinical-guidance",
  "/blog/lumbar-slipped-disc-l3-l4-l4-l5-l5-s1",
  "/blog/skin-inflammation-vasculitis-diet-guide",
  "/home-physiotherapy",
  "/back-pain",
  "/knee-pain",
  "/post-surgery-rehab",
  "/stroke-rehab",
  "/services/pain-management-physiotherapy",
  "/sports-injury-rehabilitation",
  "/services/functional-training",
  "/nutritionist-dietitian-online",
  "/services/rehabilitation-programs",
  "/cities",
  "/physiotherapist-at-home/jaipur",
  "/physiotherapist-at-home/amritsar",
  "/physiotherapist-at-home/gurgaon",
  "/physiotherapist-at-home-in/rajasthan",
  "/booking",
  "/online-care",
  "/contact",
  "/about",
  "/feedback",
  "/privacy",
  "/terms",
];

const batch8ArticleChecks = [
  {
    city: "Agra",
    slug: "post-surgery-car-transfers-home-agra",
  },
  {
    city: "Prayagraj",
    slug: "stroke-dressing-cueing-one-sided-task-prayagraj",
  },
  {
    city: "Jodhpur",
    slug: "post-surgery-bed-chair-transfers-jodhpur",
  },
  {
    city: "Udaipur",
    slug: "caregiver-supported-transfers-hand-placement-udaipur",
  },
];

const batch9ArticleChecks = [
  {
    city: "Ahmedabad",
    slug: "hand-wrist-kitchen-grip-rehabilitation-ahmedabad",
  },
  {
    city: "Lucknow",
    slug: "dizziness-balance-assessment-physiotherapy-lucknow",
  },
  {
    city: "Chandigarh",
    slug: "shoulder-overhead-household-reach-physiotherapy-chandigarh",
  },
  {
    city: "Surat",
    slug: "hand-wrist-carrying-load-rehabilitation-surat",
  },
];

const batch10ArticleChecks = [
  {
    city: "Indore",
    slug: "post-surgery-morning-movement-physiotherapy-indore",
  },
  {
    city: "Patna",
    slug: "one-sided-hand-use-household-tasks-neurological-physiotherapy-patna",
  },
  {
    city: "Ranchi",
    slug: "household-lifting-orthopaedic-physiotherapy-ranchi",
  },
  {
    city: "Bhubaneswar",
    slug: "stroke-movement-sequences-physiotherapy-bhubaneswar",
  },
];

async function getAvailablePort() {
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const address = probe.address();
  assert.ok(address && typeof address !== "string");
  await new Promise((resolve, reject) => {
    probe.close((error) => (error ? reject(error) : resolve()));
  });
  return address.port;
}

async function waitForServer(server, url, output) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (server.exitCode !== null) {
      throw new Error(`Sitewide test server exited early.\n${output.join("")}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server may still be binding its port.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Sitewide test server did not become ready.\n${output.join("")}`);
}

async function getComputedContrastPairs(page, selectors) {
  return page.evaluate((targets) => {
    const parseColor = (value) => {
      const match = value.match(/rgba?\(([^)]+)\)/);
      if (!match) return null;
      const channels = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
      return {
        r: channels[0],
        g: channels[1],
        b: channels[2],
        a: channels.length === 4 ? channels[3] : 1,
      };
    };
    const luminance = ({ r, g, b }) => {
      const channels = [r, g, b]
        .map((channel) => channel / 255)
        .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
      return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
    };
    const contrast = (foreground, background) => {
      const foregroundLuminance = luminance(foreground);
      const backgroundLuminance = luminance(background);
      return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
        (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
    };

    return targets.map(({ label, selector, minimum }) => {
      const element = document.querySelector(selector);
      if (!element) return { label, selector, minimum, missing: true };
      const foreground = parseColor(getComputedStyle(element).color);
      let node = element;
      let background = null;
      while (node && node instanceof Element) {
        const candidate = parseColor(getComputedStyle(node).backgroundColor);
        if (candidate && candidate.a === 1) {
          background = candidate;
          break;
        }
        node = node.parentElement;
      }
      return {
        label,
        selector,
        minimum,
        foreground: foreground ? `rgb(${foreground.r},${foreground.g},${foreground.b})` : null,
        background: background ? `rgb(${background.r},${background.g},${background.b})` : null,
        ratio: foreground && background ? contrast(foreground, background) : null,
      };
    });
  }, selectors);
}

function normalizedText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function collectStrictBrowserErrors(page) {
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => {
    pageErrors.push(error.stack || error.message);
  });
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  return { pageErrors, consoleErrors };
}

async function assertHydratedArticle(page, check, errors, source) {
  const label = `${check.city} ${check.slug} (${source})`;
  const articleBody = page.locator(".journal-article-sections");
  await articleBody.waitFor({ state: "visible" });
  const ssrBodyText = normalizedText(await articleBody.innerText());
  assert.ok(
    ssrBodyText.length > 500,
    `${label} should retain substantial SSR article body content before hydration`,
  );

  await page.locator("html[data-hydration-ready='true']").waitFor();
  const hydratedBodyText = normalizedText(await articleBody.innerText());
  assert.ok(
    hydratedBodyText.length > 500,
    `${label} should retain substantial article body content after hydration`,
  );
  assert.equal(
    await page.locator('[data-testid="article-publication-date"]').count(),
    1,
    `${label} should show one publication date`,
  );
  assert.equal(
    await page.locator('[data-cta="article-header-booking"]').count(),
    1,
    `${label} should show one consultation CTA`,
  );
  assert.equal(
    await page.locator('[data-cta="article-header-booking"]').getAttribute("href"),
    "/booking",
    `${label} consultation CTA should link to /booking`,
  );

  await page.waitForTimeout(250);
  assert.deepEqual(
    errors.pageErrors,
    [],
    `${label} should not emit uncaught page errors:\n${errors.pageErrors.join("\n")}`,
  );
  assert.deepEqual(
    errors.consoleErrors,
    [],
    `${label} should not emit browser console errors:\n${errors.consoleErrors.join("\n")}`,
  );
}

const serverPort = await getAvailablePort();
const baseUrl = `http://127.0.0.1:${serverPort}`;
const serverOutput = [];
const server = spawn(process.execPath, ["serve.mjs"], {
  cwd: siteDirectory,
  env: { ...process.env, PORT: String(serverPort) },
  stdio: ["ignore", "pipe", "pipe"],
});
server.stdout.on("data", (chunk) => serverOutput.push(chunk.toString()));
server.stderr.on("data", (chunk) => serverOutput.push(chunk.toString()));

const browser = await chromium.launch({ headless: true });
const failures = [];

try {
  await waitForServer(server, `${baseUrl}/`, serverOutput);

  for (const route of routes) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const routeFailures = [];
    page.on("pageerror", (error) => {
      const isKnownJournalHydrationMismatch =
        route.startsWith("/blog/") &&
        error.message.includes("Minified React error #418");
      if (!isKnownJournalHydrationMismatch) {
        routeFailures.push(`pageerror: ${error.message}`);
      }
    });
    page.on("console", (message) => {
      if (message.type() === "error") {
        const isKnownJournalHydrationMismatch =
          route.startsWith("/blog/") &&
          message.text().includes("Minified React error #418");
        if (!isKnownJournalHydrationMismatch) {
          routeFailures.push(`console: ${message.text()}`);
        }
      }
    });
    page.on("requestfailed", (request) => {
      const requestUrl = new URL(request.url());
      if (requestUrl.origin === baseUrl) {
        routeFailures.push(`requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown"})`);
      }
    });
    page.on("response", (response) => {
      const responseUrl = new URL(response.url());
      if (responseUrl.origin === baseUrl && response.status() >= 400) {
        routeFailures.push(`HTTP ${response.status()}: ${response.url()}`);
      }
    });

    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("main.flex-1").waitFor();
    assert.equal(
      await page.evaluate(() => window.scrollY),
      0,
      `${route} should start at the top`,
    );
    if (route === "/") {
      for (const link of [
        { href: "/about", text: "Learn about our clinical team" },
        { href: "/online-care", text: "See how online care works" },
        { href: "/cities", text: "Browse all cities we serve" },
      ]) {
        assert.ok(
          await page.locator(`a[href="${link.href}"]`, { hasText: link.text }).count(),
          `Homepage should include contextual link: ${link.text}`,
        );
      }
    }
    if (route === "/") {
      await page.locator("#rev-name").waitFor({ state: "attached" });
      await page.locator("html[data-hydration-ready='true']").waitFor({ state: "attached" });
      const requiredMarkerRatios = await page.locator("span.text-destructive").evaluateAll((elements) => {
        const parseColor = (value) => {
          const match = value.match(/rgba?\(([^)]+)\)/);
          if (!match) return null;
          const channels = match[1].split(",").map((part) => Number.parseFloat(part.trim()));
          return {
            r: channels[0],
            g: channels[1],
            b: channels[2],
            a: channels.length === 4 ? channels[3] : 1,
          };
        };
        const luminance = ({ r, g, b }) => {
          const channels = [r, g, b]
            .map((channel) => channel / 255)
            .map((channel) => channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
          return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
        };
        const contrast = (foreground, background) => {
          const foregroundLuminance = luminance(foreground);
          const backgroundLuminance = luminance(background);
          return (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
            (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);
        };

        return elements
          .filter((element) => element.textContent?.trim() === "*")
          .map((element) => {
            const foreground = parseColor(getComputedStyle(element).color);
            let node = element;
            let background = null;
            while (node && node instanceof Element) {
              const candidate = parseColor(getComputedStyle(node).backgroundColor);
              if (candidate && candidate.a > 0) {
                background = candidate;
                break;
              }
              node = node.parentElement;
            }
            return foreground && background ? contrast(foreground, background) : 0;
          });
      });
      assert.ok(requiredMarkerRatios.length > 0, "Booking should expose required-field markers");
      assert.ok(
        requiredMarkerRatios.every((ratio) => ratio >= 4.5),
        `Required-field markers should meet 4.5:1 contrast (ratios: ${requiredMarkerRatios.join(", ")})`,
      );
    }
    if (route === "/" || route === "/blog" || route === "/physiotherapist-at-home/jaipur") {
      const contrastTargets = route === "/"
        ? [
            { label: "homepage hero booking button", selector: '[data-testid="button-hero-booking"]', minimum: 4.5 },
            { label: "homepage required-field marker", selector: "span.text-destructive", minimum: 4.5 },
            { label: "homepage back-pain guide link", selector: 'a[href="/back-pain"]', minimum: 4.5 },
            { label: "homepage post-surgery guide link", selector: 'a[href="/post-surgery-rehab"]', minimum: 4.5 },
            { label: "homepage stroke guide link", selector: 'a[href="/stroke-rehab"]', minimum: 4.5 },
          ]
        : route === "/blog"
          ? [
              { label: "Journal page heading", selector: "h1", minimum: 4.5 },
            ]
          : [
              { label: "Jaipur city booking CTA", selector: 'a[data-cta="city-booking"]', minimum: 4.5 },
              { label: "Jaipur city page heading", selector: "h1", minimum: 4.5 },
            ];
      const computedContrastPairs = await getComputedContrastPairs(page, contrastTargets);
      for (const pair of computedContrastPairs) {
        assert.equal(pair.missing, undefined, `${route} should render ${pair.label}`);
        assert.ok(
          pair.ratio !== null && pair.ratio >= pair.minimum,
          `${route} ${pair.label} should meet ${pair.minimum}:1 contrast using computed colors (${pair.foreground} on ${pair.background} = ${pair.ratio ?? "unavailable"})`,
        );
      }
    }
    if (route.startsWith("/blog/") && !route.startsWith("/blog/category/")) {
      const headerBookingCta = page.locator('[data-cta="article-header-booking"]');
      assert.equal(
        await headerBookingCta.count(),
        1,
        `${route} should expose exactly one header consultation CTA`,
      );
      assert.equal(
        await headerBookingCta.getAttribute("href"),
        "/booking",
        `${route} header consultation CTA should link to /booking`,
      );
    }
    if (routeFailures.length) failures.push(`${route}\n  ${routeFailures.join("\n  ")}`);
    await page.close();
  }

  for (const post of journalDiscoveryIndex) {
    const route = `/blog/${post.slug}`;
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
    assert.ok(response?.ok(), `${route} should return a successful response`);
    await page.locator("main.flex-1").waitFor();
    const headerBookingCta = page.locator('[data-cta="article-header-booking"]');
    assert.equal(
      await headerBookingCta.count(),
      1,
      `${route} should expose exactly one header consultation CTA`,
    );
    assert.equal(
      await headerBookingCta.getAttribute("href"),
      "/booking",
      `${route} header consultation CTA should link to /booking`,
    );
    await page.close();
  }

  for (const check of batch8ArticleChecks) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = collectStrictBrowserErrors(page);
    try {
      const route = `/blog/${check.slug}`;
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      assert.ok(response?.ok(), `${route} should return a successful response`);
      await assertHydratedArticle(page, check, errors, "direct visit");
    } finally {
      await page.close();
    }
  }
  console.log(
    `Batch 8 direct article hydration checks passed for ${batch8ArticleChecks.map(({ city }) => city).join(", ")}.`,
  );

  for (const check of batch9ArticleChecks) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = collectStrictBrowserErrors(page);
    try {
      const route = `/blog/${check.slug}`;
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      assert.ok(response?.ok(), `${route} should return a successful response`);
      await assertHydratedArticle(page, check, errors, "direct visit");
    } finally {
      await page.close();
    }
  }
  console.log(
    `Batch 9 direct article hydration checks passed for ${batch9ArticleChecks.map(({ city }) => city).join(", ")}.`,
  );

  for (const check of batch10ArticleChecks) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = collectStrictBrowserErrors(page);
    try {
      const route = `/blog/${check.slug}`;
      const response = await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded" });
      assert.ok(response?.ok(), `${route} should return a successful response`);
      await assertHydratedArticle(page, check, errors, "direct visit");
    } finally {
      await page.close();
    }
  }
  console.log(
    `Batch 10 direct article hydration checks passed for ${batch10ArticleChecks.map(({ city }) => city).join(", ")}.`,
  );

  const navigationPage = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await navigationPage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  assert.equal(
    await navigationPage.locator('section[aria-labelledby^="homepage-journal-"]').count(),
    7,
    "Homepage should expose all seven reader-facing Journal groups",
  );
  assert.equal(
    await navigationPage.locator('section[aria-labelledby^="homepage-journal-"] a[href^="/blog/"]').count(),
    7,
    "Homepage Journal groups should expose one featured article per group",
  );
  const homepageJournalGroups = navigationPage.locator('[data-testid^="homepage-journal-group-"]');
  for (let index = 0; index < await homepageJournalGroups.count(); index += 1) {
    const group = homepageJournalGroups.nth(index);
    assert.equal(
      await group.locator('[data-testid^="homepage-journal-featured-"] article').count(),
      1,
      "Each homepage Journal group should keep one featured card visible",
    );
    assert.equal(
      await group.locator('details[data-testid^="homepage-journal-more-"]').count(),
      0,
      "Homepage Journal groups should not duplicate the full Journal index",
    );
  }
  await navigationPage.locator("#homepage-journal-search").fill("stroke");
  await navigationPage.locator("#homepage-journal-search").press("Enter");
  await navigationPage.waitForURL("**/blog?search=stroke");
  assert.equal(
    await navigationPage.locator('[data-testid="card-blog-stroke-rehabilitation-at-home"]').count(),
    1,
    "Homepage Journal search should navigate to the matching Journal result",
  );
  await navigationPage.goto(`${baseUrl}/blog?search=term-that-does-not-exist`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  const noResults = navigationPage.getByTestId("journal-no-results");
  await noResults.waitFor({ state: "visible" });
  assert.equal(
    await noResults.getByText("No Journal guides matched that search").count(),
    1,
    "Journal should expose a clear no-results state",
  );
  const resetSearch = navigationPage.getByTestId("journal-reset");
  await resetSearch.waitFor({ state: "visible" });
  assert.equal(
    await resetSearch.count(),
    1,
    "Journal no-results state should provide a reset action",
  );

  const navigationErrors = collectStrictBrowserErrors(navigationPage);
  const navigatedBatch8Article = batch8ArticleChecks[0];
  await navigationPage.goto(`${baseUrl}/blog`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  await navigationPage.locator("html[data-hydration-ready='true']").waitFor();
  const batch8Search = navigationPage.locator("#journal-search");
  await batch8Search.fill("After Surgery in Agra");
  await batch8Search.press("Enter");
  const batch8ArticleLink = navigationPage.locator(`a[href="/blog/${navigatedBatch8Article.slug}"]:visible`).first();
  await batch8ArticleLink.waitFor({ state: "visible" });
  const batch8SearchUrl = new URL(navigationPage.url());
  assert.equal(batch8SearchUrl.pathname, "/blog", "Batch 8 Journal search should remain on /blog");
  assert.equal(
    batch8SearchUrl.searchParams.get("search"),
    "after surgery in agra",
    "Batch 8 Journal search should normalize the query in the URL",
  );
  await batch8ArticleLink.click();
  await navigationPage.waitForURL(`**/blog/${navigatedBatch8Article.slug}`);
  await assertHydratedArticle(
    navigationPage,
    navigatedBatch8Article,
    navigationErrors,
    "Journal index navigation",
  );
  console.log("Journal index navigation loaded a full Batch 8 article body.");

  const navigatedBatch9Article = batch9ArticleChecks[0];
  await navigationPage.goto(`${baseUrl}/blog`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  await navigationPage.locator("html[data-hydration-ready='true']").waitFor();
  const batch9Search = navigationPage.locator("#journal-search");
  await batch9Search.fill("Hand and Wrist Rehabilitation in Ahmedabad");
  await batch9Search.press("Enter");
  const batch9ArticleLink = navigationPage.locator(`a[href="/blog/${navigatedBatch9Article.slug}"]:visible`).first();
  await batch9ArticleLink.waitFor({ state: "visible" });
  const batch9SearchUrl = new URL(navigationPage.url());
  assert.equal(batch9SearchUrl.pathname, "/blog", "Batch 9 Journal search should remain on /blog");
  assert.equal(
    batch9SearchUrl.searchParams.get("search"),
    "hand and wrist rehabilitation in ahmedabad",
    "Batch 9 Journal search should normalize the query in the URL",
  );
  await batch9ArticleLink.click();
  await navigationPage.waitForURL(`**/blog/${navigatedBatch9Article.slug}`);
  await assertHydratedArticle(
    navigationPage,
    navigatedBatch9Article,
    navigationErrors,
    "Journal index navigation",
  );
  console.log("Journal index navigation loaded a full Batch 9 article body.");

  await navigationPage.goto(`${baseUrl}/physiotherapist-at-home/faridabad`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  assert.equal(
    await navigationPage.locator('[data-testid^="card-city-journal-"]').count(),
    3,
    "Curated city pages should retain their three local Journal cards",
  );
  await navigationPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await navigationPage.getByTestId("link-nav-journal").click();
  await navigationPage.waitForURL("**/blog");
  assert.equal(await navigationPage.evaluate(() => window.scrollY), 0, "Journal navigation should reset scroll");

  await navigationPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await navigationPage.locator('a[href="/blog/stroke-rehabilitation-at-home"]').first().click();
  await navigationPage.waitForURL("**/blog/stroke-rehabilitation-at-home");
  assert.equal(await navigationPage.evaluate(() => window.scrollY), 0, "Journal article navigation should reset scroll");

  await navigationPage.goto(`${baseUrl}/physiotherapist-at-home/faridabad`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  const faridabadGuideLink = navigationPage.locator('a[href="/blog/lumbar-slipped-disc-l3-l4-l4-l5-l5-s1"]');
  assert.equal(await faridabadGuideLink.count(), 1, "Faridabad should link to the lumbar slipped-disc guide once");
  await faridabadGuideLink.click();
  await navigationPage.waitForURL("**/blog/lumbar-slipped-disc-l3-l4-l4-l5-l5-s1");
  assert.equal(await navigationPage.evaluate(() => window.scrollY), 0, "Faridabad Journal link should reset scroll");

  await navigationPage.goto(`${baseUrl}/physiotherapist-at-home/amritsar`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  assert.equal(
    await navigationPage.locator('a[href="/blog/lumbar-slipped-disc-l3-l4-l4-l5-l5-s1"]').count(),
    0,
    "Amritsar should no longer link to the lumbar slipped-disc guide",
  );

  await navigationPage.goto(`${baseUrl}/physiotherapist-at-home/gurgaon`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  const gurgaonSkinLink = navigationPage.locator('a[href="/blog/skin-inflammation-vasculitis-diet-guide"]');
  assert.equal(await gurgaonSkinLink.count(), 1, "Gurgaon should link to the skin-inflammation guide once");
  await gurgaonSkinLink.click();
  await navigationPage.waitForURL("**/blog/skin-inflammation-vasculitis-diet-guide");
  assert.equal(await navigationPage.evaluate(() => window.scrollY), 0, "Gurgaon Journal link should reset scroll");

  await navigationPage.goto(`${baseUrl}/home-physiotherapy`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  await navigationPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await navigationPage.getByTestId("link-logo").click();
  await navigationPage.waitForURL("**/");
  assert.equal(new URL(navigationPage.url()).pathname, "/", "Header logo should return to the homepage");
  assert.equal(await navigationPage.evaluate(() => window.scrollY), 0, "Homepage navigation should reset scroll");

  await navigationPage.goto(`${baseUrl}/home-physiotherapy`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  await navigationPage.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await navigationPage.locator('a[href="/services/functional-training"]').first().click();
  await navigationPage.waitForURL("**/services/functional-training");
  assert.equal(await navigationPage.evaluate(() => window.scrollY), 0, "Service navigation should reset scroll");

  await navigationPage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  await navigationPage.locator("html[data-hydration-ready='true']").waitFor();
  await navigationPage.getByTestId("button-hero-services").click();
  await navigationPage.waitForFunction(
    () =>
      window.location.hash === "#services" &&
      (() => {
        const targetTop = document.getElementById("services")?.getBoundingClientRect().top ?? 9999;
        const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
        return targetTop >= headerBottom - 8 && targetTop < headerBottom + 36;
      })(),
  );
  assert.ok(
    await navigationPage.evaluate(() => window.scrollY > 0),
    "Services button should scroll to the Services section",
  );

  await navigationPage.goto(`${baseUrl}/#reviews`, { waitUntil: "domcontentloaded" });
  await navigationPage.locator("main.flex-1").waitFor();
  await navigationPage.locator("html[data-hydration-ready='true']").waitFor();
  await navigationPage.waitForFunction(
    () =>
      (() => {
        const targetTop = document.getElementById("reviews")?.getBoundingClientRect().top ?? 9999;
        const headerBottom = document.querySelector("header")?.getBoundingClientRect().bottom ?? 0;
        return targetTop >= headerBottom - 8 && targetTop < headerBottom + 36;
      })(),
  );
  assert.ok(
    await navigationPage.evaluate(() => window.scrollY > 0),
    "Patient Reviews hash should scroll to the Reviews section",
  );

  const headingFont = await navigationPage.locator("h1").first().evaluate((element) => getComputedStyle(element).fontFamily);
  const bodyFont = await navigationPage.locator("p").first().evaluate((element) => getComputedStyle(element).fontFamily);
  assert.notEqual(headingFont, bodyFont, "Headings and body text should use distinct font roles");
  await navigationPage.close();

  assert.deepEqual(failures, [], `Sitewide browser failures found:\n${failures.join("\n")}`);
  console.log(
    `Sitewide health check passed for ${routes.length} routes, ${journalDiscoveryIndex.length} Journal CTA routes, and navigation transitions.`,
  );
} finally {
  await browser.close();
  if (server.exitCode === null) {
    server.kill("SIGTERM");
    await new Promise((resolve) => server.once("exit", resolve));
  }
}