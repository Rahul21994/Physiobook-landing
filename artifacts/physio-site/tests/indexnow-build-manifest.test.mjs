import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  INDEXNOW_BUILD_MANIFEST_SCHEMA_VERSION,
  createIndexNowBuildManifest,
  parseIndexNowBuildManifest,
} from "../scripts/indexnow-build-manifest.mjs";
import {
  fingerprintSitemapDocument,
  SITE_ORIGIN,
} from "../scripts/submit-indexnow.mjs";
import { writeIndexNowBuildManifest } from "../scripts/write-indexnow-build-manifest.mjs";

const sitemapXml = `<urlset>
  <url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-10-04</lastmod></url>
  <url><loc>${SITE_ORIGIN}/blog/healthy-guide</loc><lastmod>2026-10-03</lastmod></url>
</urlset>`;
const fixedBuildId = "11111111-1111-4111-8111-111111111111";
const fixedFingerprint = fingerprintSitemapDocument(sitemapXml);

function createTemporarySite(t) {
  const siteRoot = mkdtempSync(
    path.join(os.tmpdir(), "indexnow-manifest-test-"),
  );
  t.after(() => rmSync(siteRoot, { recursive: true, force: true }));
  return siteRoot;
}

test("build writer writes a versioned manifest beside the completed sitemap", (t) => {
  const siteRoot = createTemporarySite(t);
  const publicDirectory = path.join(siteRoot, "dist", "public");
  mkdirSync(publicDirectory, { recursive: true });
  writeFileSync(path.join(publicDirectory, "sitemap.xml"), sitemapXml);

  const result = writeIndexNowBuildManifest({
    siteRoot,
    buildId: fixedBuildId,
  });
  const serialized = readFileSync(result.manifestPath, "utf8");
  const parsed = parseIndexNowBuildManifest(serialized);

  assert.equal(parsed.schemaVersion, INDEXNOW_BUILD_MANIFEST_SCHEMA_VERSION);
  assert.equal(parsed.buildId, fixedBuildId);
  assert.equal(parsed.sitemapFingerprint, fixedFingerprint);
  assert.equal(
    result.manifestPath,
    path.join(publicDirectory, "indexnow-build-manifest.json"),
  );
  assert.match(serialized, /\n$/);
});

test("completed builds receive distinct build IDs even when sitemap content is unchanged", (t) => {
  const siteRoot = createTemporarySite(t);
  const publicDirectory = path.join(siteRoot, "dist", "public");
  mkdirSync(publicDirectory, { recursive: true });
  writeFileSync(path.join(publicDirectory, "sitemap.xml"), sitemapXml);

  const first = writeIndexNowBuildManifest({ siteRoot }).manifest;
  const second = writeIndexNowBuildManifest({ siteRoot }).manifest;

  assert.notEqual(first.buildId, second.buildId);
  assert.equal(first.sitemapFingerprint, second.sitemapFingerprint);
});

test("build writer fails explicitly if the completed sitemap is missing", (t) => {
  const siteRoot = createTemporarySite(t);
  assert.throws(
    () => writeIndexNowBuildManifest({ siteRoot }),
    /Completed sitemap not found/,
  );
});

test("build writer does not leave a manifest when the sitemap cannot be fingerprinted", (t) => {
  const siteRoot = createTemporarySite(t);
  const publicDirectory = path.join(siteRoot, "dist", "public");
  mkdirSync(publicDirectory, { recursive: true });
  writeFileSync(
    path.join(publicDirectory, "sitemap.xml"),
    "<html>not a sitemap</html>",
  );

  assert.throws(() => writeIndexNowBuildManifest({ siteRoot }), /XML urlset/);
  assert.throws(() =>
    readFileSync(path.join(publicDirectory, "indexnow-build-manifest.json")),
  );
});

test("manifest parser rejects malformed, unsupported, and unexpected data", () => {
  assert.throws(() => parseIndexNowBuildManifest("{"), /not valid JSON/);
  assert.throws(
    () =>
      createIndexNowBuildManifest({
        buildId: fixedBuildId,
        sitemapFingerprint: "bad",
      }),
    /invalid sitemap fingerprint/,
  );
  assert.throws(
    () =>
      parseIndexNowBuildManifest({
        schemaVersion: 2,
        buildId: fixedBuildId,
        sitemapFingerprint: fixedFingerprint,
      }),
    /unsupported schema version/,
  );
  assert.throws(
    () =>
      parseIndexNowBuildManifest({
        schemaVersion: 1,
        buildId: fixedBuildId,
        sitemapFingerprint: fixedFingerprint,
        extra: "not allowed",
      }),
    /unexpected shape/,
  );
});
