import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(TESTS_DIR, "..", "dist", "public");
const EXPECTED_IMAGE = "https://goswamirehab.in/opengraph.jpg";
const DEFAULT_ALT = "Goswami Rehab — Homecare Physiotherapy";

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(entryPath);
    return entry.name === "index.html" ? [entryPath] : [];
  });
}

function getMetaContent(html, selector) {
  const match = html.match(selector);
  return match?.[1] ?? "";
}

function getBlogPostingSchema(html) {
  const scripts = html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi);
  for (const match of scripts) {
    try {
      const schema = JSON.parse(match[1]);
      if (schema?.["@type"] === "BlogPosting") return schema;
    } catch {
      // Other JSON-LD blocks are validated by the structured-data check.
    }
  }
  return undefined;
}

const htmlFiles = findHtmlFiles(DIST_DIR);
assert.ok(htmlFiles.length > 10, "Expected prerendered HTML pages before checking social metadata");

for (const filePath of htmlFiles) {
  const route = `/${relative(DIST_DIR, filePath).replace(/\/index\.html$/, "")}`.replace("//", "/");
  const html = readFileSync(filePath, "utf8");
  const blogPosting = getBlogPostingSchema(html);
  const expectedImage = blogPosting?.image ?? EXPECTED_IMAGE;
  const expectedAlt = blogPosting ? "Representative editorial image for" : DEFAULT_ALT;
  assert.equal(
    getMetaContent(html, /<meta property="og:image" content="([^"]+)"/i),
    expectedImage,
    `${route} should align its Open Graph image with its canonical route image`,
  );
  assert.equal(
    getMetaContent(html, /<meta name="twitter:image" content="([^"]+)"/i),
    expectedImage,
    `${route} should align its Twitter image with its canonical route image`,
  );
  assert.equal(
    getMetaContent(html, /<meta property="og:image:alt" content="([^"]+)"/i),
    blogPosting ? getMetaContent(html, /<meta name="twitter:image:alt" content="([^"]+)"/i) : DEFAULT_ALT,
    `${route} should keep Open Graph and Twitter image alt text aligned`,
  );
  assert.match(
    getMetaContent(html, /<meta property="og:image:alt" content="([^"]+)"/i),
    new RegExp(expectedAlt),
    `${route} should describe the social image accurately`,
  );
  assert.equal(
    getMetaContent(html, /<meta property="og:image:width" content="([^"]+)"/i),
    blogPosting ? "1024" : "1280",
    `${route} should declare the image width served`,
  );
  assert.equal(
    getMetaContent(html, /<meta property="og:image:height" content="([^"]+)"/i),
    blogPosting ? "1024" : "720",
    `${route} should declare the image height served`,
  );
}

console.log(`Social metadata check passed for ${htmlFiles.length} generated pages.`);