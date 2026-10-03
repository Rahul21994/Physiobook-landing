import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import {
  INDEXNOW_BUILD_MANIFEST_URL,
  pollPublishedRelease,
} from "../scripts/check-indexnow-release.mjs";
import { createIndexNowBuildManifest } from "../scripts/indexnow-build-manifest.mjs";
import {
  SITEMAP_URL,
  SITE_ORIGIN,
  fingerprintSitemapDocument,
} from "../scripts/submit-indexnow.mjs";

const buildId = "22222222-2222-4222-8222-222222222222";
const sitemapXml = `<urlset><url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-10-04</lastmod></url></urlset>`;
const otherSitemapXml = `<urlset><url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-10-03</lastmod></url></urlset>`;
const manifest = createIndexNowBuildManifest({
  buildId,
  sitemapFingerprint: fingerprintSitemapDocument(sitemapXml),
});
const manifestText = `${JSON.stringify(manifest, null, 2)}\n`;

function response(status, body = "", statusText = "") {
  return { status, statusText, text: async () => body };
}

function createSnapshotPath(t) {
  const directory = mkdtempSync(
    path.join(os.tmpdir(), "indexnow-poller-test-"),
  );
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  return path.join(directory, "verified-manifest.json");
}

test("poller freezes the exact manifest only after both public fingerprints match", async (t) => {
  const snapshotPath = createSnapshotPath(t);
  const calls = [];
  const logs = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    if (url === INDEXNOW_BUILD_MANIFEST_URL) return response(200, manifestText);
    if (url === SITEMAP_URL) return response(200, sitemapXml);
    throw new Error(`Unexpected request: ${url}`);
  };

  const result = await pollPublishedRelease({
    fetchImpl,
    snapshotPath,
    logger: { log: (message) => logs.push(message) },
    timeoutMs: 100,
  });

  assert.equal(result.ready, true);
  assert.equal(result.manifest.buildId, buildId);
  assert.equal(result.snapshotPath, snapshotPath);
  assert.equal(readFileSync(snapshotPath, "utf8"), manifestText);
  assert.deepEqual(
    calls.map(({ url }) => url),
    [INDEXNOW_BUILD_MANIFEST_URL, SITEMAP_URL],
  );
  assert.equal(calls[0].options.headers["Cache-Control"], "no-cache, no-store");
  assert.equal(calls[1].options.headers["Cache-Control"], "no-cache");
  assert.ok(logs.some((message) => message.includes("Release is ready")));
});

test("poller stops on missing public manifest and creates no sender snapshot", async (t) => {
  const snapshotPath = createSnapshotPath(t);
  const calls = [];
  const result = await pollPublishedRelease({
    fetchImpl: async (url) => {
      calls.push(url);
      return response(404, "", "Not Found");
    },
    snapshotPath,
    logger: { log() {} },
    timeoutMs: 100,
  });

  assert.equal(result.ready, false);
  assert.match(result.reason, /HTTP 404/);
  assert.deepEqual(calls, [INDEXNOW_BUILD_MANIFEST_URL]);
  assert.throws(() => readFileSync(snapshotPath));
});

test("poller rejects malformed manifests before fetching the sitemap", async (t) => {
  const snapshotPath = createSnapshotPath(t);
  const calls = [];
  const result = await pollPublishedRelease({
    fetchImpl: async (url) => {
      calls.push(url);
      return response(200, "not-json");
    },
    snapshotPath,
    logger: { log() {} },
    timeoutMs: 100,
  });

  assert.equal(result.ready, false);
  assert.match(result.reason, /not valid JSON/);
  assert.deepEqual(calls, [INDEXNOW_BUILD_MANIFEST_URL]);
  assert.throws(() => readFileSync(snapshotPath));
});

test("poller rejects a sitemap that differs from the frozen manifest fingerprint", async (t) => {
  const snapshotPath = createSnapshotPath(t);
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === INDEXNOW_BUILD_MANIFEST_URL) return response(200, manifestText);
    if (url === SITEMAP_URL) return response(200, otherSitemapXml);
    throw new Error(`Unexpected request: ${url}`);
  };

  const result = await pollPublishedRelease({
    fetchImpl,
    snapshotPath,
    logger: { log() {} },
    timeoutMs: 100,
  });

  assert.equal(result.ready, false);
  assert.match(result.reason, /does not match the build manifest/);
  assert.deepEqual(calls, [INDEXNOW_BUILD_MANIFEST_URL, SITEMAP_URL]);
  assert.throws(() => readFileSync(snapshotPath));
});

test("poller logs public request timeouts and never creates a snapshot", async (t) => {
  const snapshotPath = createSnapshotPath(t);
  const logs = [];
  const result = await pollPublishedRelease({
    fetchImpl: () => new Promise(() => {}),
    snapshotPath,
    timeoutMs: 5,
    logger: { log: (message) => logs.push(message) },
  });

  assert.equal(result.ready, false);
  assert.match(result.reason, /timed out after 5 ms/);
  assert.ok(logs.some((message) => message.includes("no submission will run")));
  assert.throws(() => readFileSync(snapshotPath));
});
