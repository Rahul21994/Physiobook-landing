import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const TESTS_DIR = fileURLToPath(new URL(".", import.meta.url));
const DIST_DIR = join(TESTS_DIR, "..", "dist", "public");
const PUBLIC_BRAND = "Goswami Rehab";
const LEGACY_NAME = "Goswami Institute";
const REGISTERED_NAME = "Goswami Institute of Functional Training";
const PUBLIC_TOOLING_MARKERS = [
  /\b(?:built|made|generated|created)\s+(?:with|by)\s+(?:ai|artificial intelligence|chatgpt|claude|gemini|openai)\b/i,
  /\b(?:chatgpt|claude|gemini|openai)\b/i,
  /\b(?:lorem ipsum|placeholder text|sample content|coming soon)\b/i,
];

const metadataKeys = new Set([
  "description",
  "og:title",
  "og:description",
  "og:site_name",
  "twitter:title",
  "twitter:description",
]);

function findHtmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findHtmlFiles(entryPath);
    return entry.name === "index.html" ? [entryPath] : [];
  });
}

function parseAttributes(tag) {
  return Object.fromEntries(
    [...tag.matchAll(/([:\w-]+)\s*=\s*["']([^"']*)["']/g)].map((match) => [
      match[1].toLowerCase(),
      match[2],
    ]),
  );
}

function readMetadata(html) {
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "";
  const meta = {};

  for (const match of html.matchAll(/<meta\b[^>]*>/gi)) {
    const attrs = parseAttributes(match[0]);
    const key = attrs.name ?? attrs.property;
    if (key && metadataKeys.has(key.toLowerCase())) {
      meta[key.toLowerCase()] = attrs.content ?? "";
    }
  }

  return { title, meta };
}

function visibleBody(html) {
  return (html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? "")
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    // The registered name in the footer is an explicit copyright context.
    .replace(/<footer\b[\s\S]*?<\/footer>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

assert.ok(existsSync(DIST_DIR), `Built output is missing: ${DIST_DIR}`);

const htmlFiles = findHtmlFiles(DIST_DIR);
assert.ok(htmlFiles.length > 10, "Expected the prerender build to produce route HTML files");

for (const filePath of htmlFiles) {
  const route = `/${relative(DIST_DIR, filePath).replace(/\/index\.html$/, "")}`.replace(
    "//",
    "/",
  );
  const html = readFileSync(filePath, "utf8");
  const { title, meta } = readMetadata(html);
  const legalRoute = route === "/privacy" || route === "/terms";

  for (const [key, value] of Object.entries({ title, ...meta })) {
    assert.ok(value, `${route} is missing ${key}`);
    if (!legalRoute || key === "title" || key.endsWith(":title")) {
      assert.doesNotMatch(
        value,
        new RegExp(LEGACY_NAME, "i"),
        `${route} ${key} must not expose the legacy brand`,
      );
    }
  }

  assert.equal(
    meta["og:site_name"],
    PUBLIC_BRAND,
    `${route} must identify the public brand in its site metadata`,
  );

  for (const [key, value] of Object.entries(meta)) {
    if (!legalRoute) {
      assert.doesNotMatch(
        value,
        new RegExp(LEGACY_NAME, "i"),
        `${route} ${key} must not expose the legacy brand`,
      );
      assert.doesNotMatch(
        value,
        new RegExp(REGISTERED_NAME, "i"),
        `${route} ${key} must not expose the registered business name outside legal pages`,
      );
    }
  }

  if (!legalRoute) {
    assert.doesNotMatch(
      visibleBody(html),
      new RegExp(LEGACY_NAME, "i"),
      `${route} body copy must not expose the legacy brand`,
    );
    assert.doesNotMatch(
      visibleBody(html),
      new RegExp(REGISTERED_NAME, "i"),
      `${route} body copy must not expose the registered business name`,
    );

    const publicSurface = [
      title,
      ...Object.values(meta),
      visibleBody(html),
    ].join(" ");
    for (const marker of PUBLIC_TOOLING_MARKERS) {
      assert.doesNotMatch(
        publicSurface,
        marker,
        `${route} public output must not expose accidental generator or placeholder text`,
      );
    }
  }
}

assert.ok(existsSync(join(DIST_DIR, "llms.txt")), "public llms.txt must be generated");

console.log(`Public-branding check passed for ${htmlFiles.length} generated pages.`);