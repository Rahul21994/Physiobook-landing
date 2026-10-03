import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const publicDir = path.join(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".."),
  "dist",
  "public",
);

function readRoute(route) {
  return fs.readFileSync(path.join(publicDir, route, "index.html"), "utf8");
}

function headOf(html) {
  return html.slice(0, html.indexOf("</head>"));
}

function assertStylesheetsPrecedeModuleScript(html, route) {
  const head = headOf(html);
  const moduleScriptIndex = head.indexOf('<script type="module"');
  const stylesheetIndex = head.indexOf('<link rel="stylesheet"');

  assert.ok(moduleScriptIndex >= 0, `${route} should include its module script`);
  assert.ok(
    stylesheetIndex >= 0 && stylesheetIndex < moduleScriptIndex,
    `${route} should discover its stylesheet before the module script`,
  );
  assert.doesNotMatch(
    head,
    /<link\b[^>]*\brel="modulepreload"/i,
    `${route} should not preload the deferred hydration runtime`,
  );
}

const routePerformanceBudgets = [
  {
    route: "/",
    pageEntry: "src/pages/home.tsx",
    reason: "Homepage shell and conversion entry point.",
    maxJavaScriptBytes: 1_000_000,
    maxImageBytes: 5_700_000,
    maxInitialReviewCards: 6,
    reviewSurface: "homepage",
  },
  {
    route: "/reviews",
    pageEntry: "src/pages/reviews.tsx",
    reason: "Published review directory with filters and incremental card rendering.",
    maxJavaScriptBytes: 750_000,
    maxImageBytes: 250_000,
    maxInitialReviewCards: 12,
    reviewSurface: "review directory",
  },
  {
    route: "/blog",
    pageEntry: "src/pages/blog-list.tsx",
    reason: "Journal discovery route with the broadest editorial image set.",
    maxJavaScriptBytes: 1_000_000,
    maxImageBytes: 5_500_000,
  },
  {
    route: "/blog/diet-requirements-after-stroke",
    pageEntry: "src/pages/blog-post.tsx",
    reason: "Representative long-form article route with a single editorial hero; expanded source-backed Journal catalog through Batch 7.",
    maxJavaScriptBytes: 1_150_000,
    maxImageBytes: 200_000,
  },
  {
    route: "/physiotherapist-at-home/jaipur",
    pageEntry: "src/pages/city.tsx",
    reason: "Curated city conversion route with local Journal recommendations.",
    maxJavaScriptBytes: 1_050_000,
    maxImageBytes: 450_000,
  },
  {
    route: "/booking",
    pageEntry: "src/pages/booking.tsx",
    reason: "Transaction route with the booking form, date controls, payment, and document flow.",
    maxJavaScriptBytes: 1_150_000,
    maxImageBytes: 200_000,
  },
  {
    route: "/stroke-rehab",
    pageEntry: "src/pages/service-guide.tsx",
    reason: "Hindi route matching and language-switch support add a small shared bootstrap cost; keep the added allowance scoped to this representative guide.",
    maxJavaScriptBytes: 595_000,
    maxImageBytes: 250_000,
  },
  {
    route: "/physiotherapist-at-home-in/rajasthan",
    pageEntry: "src/pages/state.tsx",
    reason: "Representative state coverage route with state, city, FAQ, care-option data, Batch 10 Journal summaries, shared review route table, and the global care-path launcher.",
    maxJavaScriptBytes: 574_000,
    maxImageBytes: 250_000,
  },
];

function formatBytes(bytes) {
  return `${bytes.toLocaleString("en-IN")} bytes (${(bytes / 1024).toFixed(1)} KiB)`;
}

function routeFilePath(route) {
  const segments = route === "/" ? [] : route.replace(/^\/|\/$/g, "").split("/");
  return path.join(publicDir, ...segments, "index.html");
}

function readRouteHtml(route) {
  const filePath = routeFilePath(route);
  assert.ok(fs.existsSync(filePath), `production build should prerender ${route}`);
  return fs.readFileSync(filePath, "utf8");
}

function countReviewCards(html) {
  return (html.match(/data-testid="review-card-/g) ?? []).length;
}

function parseTagAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)]
      .map((match) => [match[1].toLowerCase(), match[2]]),
  );
}

function candidateUrls(value) {
  return (value ?? "")
    .split(",")
    .map((candidate) => candidate.trim().split(/\s+/)[0])
    .filter((candidate) => candidate.startsWith("/"))
    .map((candidate) => candidate.split("?")[0]);
}

function imageAsset(url, route, source) {
  const pathname = new URL(url, "https://goswamirehab.in").pathname;
  if (!pathname.startsWith("/")) {
    throw new Error(`${route} ${source} references a non-local image: ${url}`);
  }
  const assetPath = path.resolve(publicDir, `.${pathname}`);
  const publicRoot = path.resolve(publicDir);
  assert.ok(
    assetPath === publicRoot || assetPath.startsWith(`${publicRoot}${path.sep}`),
    `${route} ${source} image escapes the production public directory: ${url}`,
  );
  assert.ok(fs.existsSync(assetPath), `${route} ${source} image is missing: ${pathname}`);
  return {
    url: pathname,
    path: assetPath,
    bytes: fs.statSync(assetPath).size,
  };
}

function selectPictureCandidate(pictureHtml, route, source) {
  const sourceTags = [...pictureHtml.matchAll(/<source\b[^>]*>/gi)]
    .map((match) => parseTagAttributes(match[0]));
  const imageTag = pictureHtml.match(/<img\b[^>]*>/i)?.[0];
  const imageAttributes = imageTag ? parseTagAttributes(imageTag) : {};
  const selectedAttributes = sourceTags[0] ?? imageAttributes;
  const candidates = [
    ...candidateUrls(selectedAttributes.srcset),
    ...candidateUrls(selectedAttributes.src),
  ];
  assert.ok(candidates.length > 0, `${route} ${source} picture should expose an image URL`);
  return candidates
    .map((url) => imageAsset(url, route, source))
    .sort((a, b) => b.bytes - a.bytes)[0];
}

function collectRouteImages(route, html) {
  const allImages = new Map();
  const criticalImages = new Map();
  const addImage = (image, target) => target.set(image.path, image);

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    const attributes = parseTagAttributes(match[0]);
    if (attributes.rel === "preload" && attributes.as === "image" && attributes.href) {
      const image = imageAsset(attributes.href, route, "image preload");
      addImage(image, allImages);
      addImage(image, criticalImages);
    }
  }

  const withoutPictures = html.replace(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi, "");
  for (const match of html.matchAll(/<picture\b[^>]*>[\s\S]*?<\/picture>/gi)) {
    const pictureHtml = match[0];
    const image = selectPictureCandidate(pictureHtml, route, "picture");
    addImage(image, allImages);
    const imageTag = pictureHtml.match(/<img\b[^>]*>/i)?.[0] ?? "";
    if (!/\bloading=["']lazy["']/i.test(imageTag)) addImage(image, criticalImages);
  }

  for (const match of withoutPictures.matchAll(/<img\b[^>]*>/gi)) {
    const attributes = parseTagAttributes(match[0]);
    const candidates = [
      ...candidateUrls(attributes.srcset),
      ...candidateUrls(attributes.src),
    ];
    assert.ok(candidates.length > 0, `${route} img should expose an image URL`);
    const image = candidates
      .map((url) => imageAsset(url, route, "img"))
      .sort((a, b) => b.bytes - a.bytes)[0];
    addImage(image, allImages);
    if (!attributes.loading || attributes.loading.toLowerCase() !== "lazy") {
      addImage(image, criticalImages);
    }
  }

  const sum = (images) => [...images.values()].reduce((total, image) => total + image.bytes, 0);
  return {
    allBytes: sum(allImages),
    criticalBytes: sum(criticalImages),
    files: [...allImages.values()].sort((a, b) => b.bytes - a.bytes),
  };
}

function readManifest() {
  const manifestPath = path.join(publicDir, "manifest.json");
  assert.ok(fs.existsSync(manifestPath), "production build should emit manifest.json");
  return JSON.parse(fs.readFileSync(manifestPath, "utf8"));
}

function collectRouteJavaScript(manifest, route) {
  const visited = new Set();
  const visit = (entryKey) => {
    if (visited.has(entryKey)) return;
    const entry = manifest[entryKey];
    assert.ok(entry, `${route.route} manifest entry is missing: ${entryKey}`);
    visited.add(entryKey);
    for (const importedEntry of entry.imports ?? []) visit(importedEntry);
  };

  // The client shell and the route's lazy page entry are the initial route graph.
  visit("index.html");
  visit(route.pageEntry);

  const files = [...visited]
    .map((entryKey) => ({ entryKey, entry: manifest[entryKey] }))
    .filter(({ entry }) => entry.file?.endsWith(".js"))
    .map(({ entryKey, entry }) => {
      const assetPath = path.join(publicDir, entry.file);
      assert.ok(fs.existsSync(assetPath), `${route.route} manifest asset is missing: ${entry.file}`);
      return {
        entryKey,
        file: entry.file,
        bytes: fs.statSync(assetPath).size,
      };
    })
    .sort((a, b) => b.bytes - a.bytes);

  return {
    totalBytes: files.reduce((total, file) => total + file.bytes, 0),
    files,
  };
}

const homeHead = headOf(readRoute(""));
assertStylesheetsPrecedeModuleScript(readRoute(""), "/");
assertStylesheetsPrecedeModuleScript(
  readRoute("blog/category/neuro-rehabilitation"),
  "/blog/category/neuro-rehabilitation",
);
assert.match(
  homeHead,
  /<link rel="preload" as="image"[^>]+hero-clinic-1408\.avif/,
  "homepage should preload its hero image",
);
assert.equal(
  (readRoute("").match(/fetchPriority="high"/g) ?? []).length,
  1,
  "homepage should keep high image priority on the hero only",
);

const cityHtml = readRoute("physiotherapist-at-home/jaipur");
assert.doesNotMatch(
  headOf(cityHtml),
  /<link rel="preload" as="image"[^>]+journal_/,
  "city pages should not preload below-the-fold Journal cards",
);
assert.doesNotMatch(
  cityHtml,
  /<img[^>]+loading="eager"[^>]+journal_/i,
  "city Journal cards should remain lazy",
);

const blogHtml = readRoute("blog");
const blogHead = headOf(blogHtml);
const journalPreloads = blogHead.match(/<link rel="preload" as="image"[^>]+journal_[^>]+>/g) ?? [];
assert.equal(journalPreloads.length, 1, "Journal index should preload only its first card image");
assert.match(blogHtml, /<img[^>]+loading="eager"[^>]+fetchPriority="high"/i);
assert.doesNotMatch(
  blogHtml,
  /<img[^>]+loading="eager"[^>]+fetchPriority="high"[\s\S]*?<img[^>]+loading="eager"[^>]+fetchPriority="high"/i,
  "Journal index should not eagerly load multiple card images",
);

const articleHtml = readRoute("blog/ankle-sprain-rehabilitation-guide");
const articleHead = headOf(articleHtml);
assert.match(
  articleHead,
  /<link rel="preload" as="image"[^>]+journal_ankle-sprain_unique\.webp[^>]+type="image\/webp"/,
  "Journal articles should preload the actual WebP hero image",
);
assert.match(
  articleHtml,
  /<source type="image\/webp" srcSet="\/images\/journal\/journal_ankle-sprain_unique\.webp"\/>/,
  "Journal article hero should offer the matching WebP source",
);
assert.match(
  articleHtml,
  /<img[^>]+src="\/images\/journal\/journal_ankle-sprain_unique\.jpg"/,
  "Journal article hero should retain its JPEG fallback",
);
assert.doesNotMatch(
  articleHead,
  /journal_ankle-sprain_unique_card\.webp/,
  "Journal article preloads should not point at the card thumbnail",
);

const assetsDir = path.join(publicDir, "assets");
const cssFiles = fs.readdirSync(assetsDir).filter((file) => file.endsWith(".css"));
const manifest = readManifest();
const globalCssAsset = manifest["index.html"]?.css?.find((file) => file.endsWith(".css"));
const globalCss = globalCssAsset ? path.basename(globalCssAsset) : undefined;
assert.ok(globalCss, "production build should emit a global stylesheet");
assert.ok(
  fs.statSync(path.join(assetsDir, globalCss)).size < 140_000,
  `global stylesheet should be below 140 KB after the route split (${globalCss})`,
);
assert.ok(cssFiles.some((file) => file.startsWith("journal-")), "Journal CSS should be split into a route chunk");
assert.ok(cssFiles.some((file) => file.startsWith("legal-")), "legal CSS should be split into a route chunk");

const hindiCityHtml = readRoute("hi/physiotherapist-at-home/jaipur");
const hindiCityStylesheet = readManifest()["src/pages/hindi-city/index.tsx"]?.css?.find(
  (file) => file.endsWith(".css"),
);
assert.ok(hindiCityStylesheet, "Hindi city routes should emit a route-specific stylesheet");
assert.notEqual(
  path.basename(hindiCityStylesheet),
  globalCss,
  "Hindi city styles should not be included in the global stylesheet",
);
assert.ok(
  fs.statSync(path.join(publicDir, hindiCityStylesheet)).size > 0,
  "Hindi city route stylesheet should contain generated styles",
);
assert.match(
  headOf(hindiCityHtml),
  new RegExp(`<link rel="stylesheet" href="/${hindiCityStylesheet.replaceAll("/", "\\/")}">`),
  "Hindi city pages should link their route stylesheet in prerendered HTML",
);
assertStylesheetsPrecedeModuleScript(
  hindiCityHtml,
  "/hi/physiotherapist-at-home/jaipur",
);

const hindiStaticHtml = readRoute("hi/booking");
const hindiStaticStylesheet = manifest["src/pages/hindi-narrative-pages.tsx"]?.css?.find(
  (file) => file.endsWith(".css"),
);
assert.ok(hindiStaticStylesheet, "Hindi static routes should emit a route-specific stylesheet");
assert.notEqual(
  path.basename(hindiStaticStylesheet),
  globalCss,
  "Hindi static page styles should not be included in the global stylesheet",
);
assert.ok(
  fs.statSync(path.join(publicDir, hindiStaticStylesheet)).size > 0,
  "Hindi static route stylesheet should contain generated styles",
);
assert.ok(
  headOf(hindiStaticHtml).includes(`href="/${hindiStaticStylesheet}"`),
  "Hindi static pages should link their route stylesheet in prerendered HTML",
);
assertStylesheetsPrecedeModuleScript(hindiStaticHtml, "/hi/booking");

const budgetResults = routePerformanceBudgets.map((budget) => {
  const html = readRouteHtml(budget.route);
  const javascript = collectRouteJavaScript(manifest, budget);
  const images = collectRouteImages(budget.route, html);
  const initialReviewCards =
    budget.maxInitialReviewCards === undefined ? undefined : countReviewCards(html);
  assert.ok(
    javascript.totalBytes <= budget.maxJavaScriptBytes,
    `${budget.route} JavaScript budget exceeded (${budget.reason}): ${formatBytes(javascript.totalBytes)} > ${formatBytes(budget.maxJavaScriptBytes)}\n${javascript.files.map((file) => `  ${file.file}: ${formatBytes(file.bytes)}`).join("\n")}`,
  );
  assert.ok(
    images.allBytes <= budget.maxImageBytes,
    `${budget.route} image budget exceeded (${budget.reason}): ${formatBytes(images.allBytes)} > ${formatBytes(budget.maxImageBytes)}\n${images.files.map((file) => `  ${file.url}: ${formatBytes(file.bytes)}`).join("\n")}`,
  );
  if (budget.maxInitialReviewCards !== undefined) {
    assert.ok(
      initialReviewCards <= budget.maxInitialReviewCards,
      `${budget.route} ${budget.reviewSurface} should render no more than ${budget.maxInitialReviewCards} review cards before the user asks for more; found ${initialReviewCards}`,
    );
    assert.match(
      html,
      /data-testid="review-grid-load-more"/,
      `${budget.route} ${budget.reviewSurface} should expose an incremental review control`,
    );
  }
  return {
    route: budget.route,
    javascriptBytes: javascript.totalBytes,
    imageBytes: images.allBytes,
    criticalImageBytes: images.criticalBytes,
    initialReviewCards,
  };
});

console.log(
  [
    `Performance budgets passed; global CSS is ${formatBytes(fs.statSync(path.join(assetsDir, globalCss)).size)}.`,
    ...budgetResults.map(
      (result) =>
        `  ${result.route}: JS ${formatBytes(result.javascriptBytes)}, images ${formatBytes(result.imageBytes)} (${formatBytes(result.criticalImageBytes)} critical)${result.initialReviewCards === undefined ? "" : `, initial review cards ${result.initialReviewCards}`}`,
    ),
  ].join("\n"),
);