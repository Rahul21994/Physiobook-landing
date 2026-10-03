import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  INDEXNOW_ENDPOINT,
  MAX_URLS_PER_REQUEST,
  SITE_ORIGIN,
  SITEMAP_URL,
  VERIFICATION_PROPAGATION_RETRY_MS,
  chunkUrls,
  createIndexNowPayload,
  fingerprintSitemapDocument,
  parseSitemapUrls,
  readPublicIndexNowKey,
  resolveExpectedSitemapSnapshot,
  submitPublishedSitemap,
} from "../scripts/submit-indexnow.mjs";
import { createIndexNowBuildManifest } from "../scripts/indexnow-build-manifest.mjs";

const validKey = "indexnow-0123456789abcdef0123456789abcdef";
const validKeyInfo = {
  key: validKey,
  keyLocation: `${SITE_ORIGIN}/${validKey}.txt`,
};
const matchingSitemapXml = `<urlset><url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-09-17</lastmod></url></urlset>`;

function response(status, body = "", statusText = "") {
  return {
    status,
    statusText,
    text: async () => body,
  };
}

test("public key filename and file contents match", () => {
  const keyInfo = readPublicIndexNowKey();
  assert.match(keyInfo.key, /^[A-Za-z0-9-]{8,128}$/);
  assert.equal(keyInfo.keyLocation, `${SITE_ORIGIN}/${keyInfo.key}.txt`);
});

test("sitemap parser keeps unique canonical indexable URLs only", () => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>${SITE_ORIGIN}/</loc></url>
      <url><loc>${SITE_ORIGIN}/blog/healthy-guide</loc></url>
      <url><loc>${SITE_ORIGIN}/cities/</loc></url>
      <url><loc>${SITE_ORIGIN}/Blog/Uppercase</loc></url>
      <url><loc>${SITE_ORIGIN}/booking?city=jaipur&amp;mode=telehealth</loc></url>
      <url><loc>https://goswamirehab.com/contact</loc></url>
      <url><loc>${SITE_ORIGIN}/contact#form</loc></url>
      <url><loc>${SITE_ORIGIN}/</loc></url>
      <url><loc>${SITE_ORIGIN}/feedback</loc></url>
    </urlset>`;

  const result = parseSitemapUrls(xml);
  assert.deepEqual(result.urls, [
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/blog/healthy-guide`,
  ]);
  assert.equal(result.rejectedCount, 7);
});

test("sitemap parser rejects malformed or empty URL sets", () => {
  assert.throws(() => parseSitemapUrls("<html></html>"), /urlset/);
  assert.throws(() => parseSitemapUrls("<urlset></urlset>"), /no URL locations/);
});

test("sitemap fingerprints ignore URL order but include URL dates", () => {
  const first = `<urlset>
    <url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-09-17</lastmod></url>
    <url><loc>${SITE_ORIGIN}/blog/healthy-guide</loc><lastmod>2026-09-18</lastmod></url>
  </urlset>`;
  const reordered = `<urlset>
    <url><loc>${SITE_ORIGIN}/blog/healthy-guide</loc><lastmod>2026-09-18</lastmod></url>
    <url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-09-17</lastmod></url>
  </urlset>`;
  const changedDate = first.replace("2026-09-17", "2026-09-19");

  assert.equal(fingerprintSitemapDocument(first), fingerprintSitemapDocument(reordered));
  assert.notEqual(fingerprintSitemapDocument(first), fingerprintSitemapDocument(changedDate));
});

test("URL chunking stays within the IndexNow request maximum", () => {
  const urls = Array.from({ length: MAX_URLS_PER_REQUEST + 1 }, (_, index) =>
    `${SITE_ORIGIN}/city-${index}`,
  );
  const chunks = chunkUrls(urls);
  assert.deepEqual(chunks.map((chunk) => chunk.length), [MAX_URLS_PER_REQUEST, 1]);
  assert.ok(chunks.every((chunk) => chunk.length <= MAX_URLS_PER_REQUEST));
});

test("payload follows the official bulk submission shape and validates URLs", () => {
  const urlList = [`${SITE_ORIGIN}/`, `${SITE_ORIGIN}/blog/healthy-guide`];
  const payload = createIndexNowPayload({
    ...validKeyInfo,
    urls: urlList,
  });

  assert.deepEqual(payload, {
    host: "goswamirehab.in",
    key: validKey,
    keyLocation: validKeyInfo.keyLocation,
    urlList,
  });
  assert.throws(
    () => createIndexNowPayload({ ...validKeyInfo, urls: [`${SITE_ORIGIN}/booking?city=jaipur`] }),
    /noncanonical or non-indexable/,
  );
  assert.throws(
    () => createIndexNowPayload({ ...validKeyInfo, urls: [`${SITE_ORIGIN}/`, `${SITE_ORIGIN}/`] }),
    /duplicate URLs/,
  );
});

test("post-deploy flow verifies the public key, reads the public sitemap, and submits JSON", async () => {
  const calls = [];
  const logs = [];
  const sitemapXml = `<urlset>
    <url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-09-17</lastmod></url>
    <url><loc>${SITE_ORIGIN}/blog/healthy-guide</loc><lastmod>2026-09-18</lastmod></url>
  </urlset>`;
  const fetchImpl = async (url, options = {}) => {
    calls.push({ url, options });
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, sitemapXml);
    if (url === INDEXNOW_ENDPOINT) return response(202, "", "Accepted");
    throw new Error(`Unexpected request: ${url}`);
  };

  const result = await submitPublishedSitemap({
    fetchImpl,
    keyInfo: validKeyInfo,
    expectedSitemapXml: sitemapXml,
    logger: { log: (message) => logs.push(message) },
    timeoutMs: 100,
  });

  assert.deepEqual(result, { urlCount: 2, rejectedCount: 0, batchCount: 1 });
  assert.deepEqual(calls.map(({ url }) => url), [
    validKeyInfo.keyLocation,
    SITEMAP_URL,
    INDEXNOW_ENDPOINT,
  ]);
  assert.equal(calls[0].options.method, undefined);
  assert.equal(calls[1].options.method, undefined);
  assert.equal(calls[2].options.method, "POST");
  assert.equal(calls[2].options.headers["Content-Type"], "application/json; charset=utf-8");
  assert.deepEqual(JSON.parse(calls[2].options.body), {
    host: "goswamirehab.in",
    key: validKey,
    keyLocation: validKeyInfo.keyLocation,
    urlList: [`${SITE_ORIGIN}/`, `${SITE_ORIGIN}/blog/healthy-guide`],
  });
  assert.ok(logs.some((message) => message.includes("Submitted 2 published sitemap URLs")));
});

test("post-deploy flow refuses to submit if the public key is not live", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    return response(404, "Not found", "Not Found");
  };

  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl,
      keyInfo: validKeyInfo,
      expectedSitemapXml: matchingSitemapXml,
      logger: { log() {} },
      timeoutMs: 100,
    }),
    /Public key check returned HTTP 404/,
  );
  assert.deepEqual(calls, [validKeyInfo.keyLocation]);
});

test("CI snapshot mode accepts a validated manifest fingerprint and keeps the sender guards", async () => {
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, matchingSitemapXml);
    if (url === INDEXNOW_ENDPOINT) return response(202);
    throw new Error(`Unexpected request: ${url}`);
  };

  const result = await submitPublishedSitemap({
    fetchImpl,
    keyInfo: validKeyInfo,
    expectedSitemapFingerprint: fingerprintSitemapDocument(matchingSitemapXml),
    logger: { log() {} },
    timeoutMs: 100,
  });

  assert.equal(result.urlCount, 1);
  assert.deepEqual(calls, [validKeyInfo.keyLocation, SITEMAP_URL, INDEXNOW_ENDPOINT]);
});

test("CI snapshot mode rejects a changed public sitemap before submitting URLs", async () => {
  const calls = [];
  const changedSitemap = matchingSitemapXml.replace("2026-09-17", "2026-09-18");
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, changedSitemap);
    if (url === INDEXNOW_ENDPOINT) return response(202);
    throw new Error(`Unexpected request: ${url}`);
  };

  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl,
      keyInfo: validKeyInfo,
      expectedSitemapFingerprint: fingerprintSitemapDocument(matchingSitemapXml),
      logger: { log() {} },
      timeoutMs: 100,
    }),
    /does not match this build's URL and lastmod snapshot/,
  );
  assert.deepEqual(calls, [validKeyInfo.keyLocation, SITEMAP_URL]);
});

test("snapshot resolver reads and validates the frozen manifest file", (t) => {
  const directory = mkdtempSync(path.join(os.tmpdir(), "indexnow-sender-test-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const manifestPath = path.join(directory, "manifest.json");
  const manifest = createIndexNowBuildManifest({
    buildId: "33333333-3333-4333-8333-333333333333",
    sitemapFingerprint: fingerprintSitemapDocument(matchingSitemapXml),
  });
  writeFileSync(manifestPath, `${JSON.stringify(manifest)}\n`);

  assert.deepEqual(resolveExpectedSitemapSnapshot({ manifestPath }), {
    expectedSitemapFingerprint: manifest.sitemapFingerprint,
    buildId: manifest.buildId,
  });

  writeFileSync(manifestPath, '{"schemaVersion":1,"buildId":"invalid","sitemapFingerprint":"bad"}');
  assert.throws(
    () => resolveExpectedSitemapSnapshot({ manifestPath }),
    /invalid build ID/,
  );
});

test("snapshot resolver preserves manual mode with the local built sitemap", (t) => {
  const siteRoot = mkdtempSync(path.join(os.tmpdir(), "indexnow-local-sitemap-test-"));
  t.after(() => rmSync(siteRoot, { recursive: true, force: true }));
  const publicDirectory = path.join(siteRoot, "dist", "public");
  mkdirSync(publicDirectory, { recursive: true });
  writeFileSync(path.join(publicDirectory, "sitemap.xml"), matchingSitemapXml);

  assert.deepEqual(
    resolveExpectedSitemapSnapshot({ manifestPath: "", siteRoot }),
    { expectedSitemapXml: matchingSitemapXml },
  );
});

test("post-deploy flow reports endpoint rejection without hiding the status", async () => {
  const sitemapXml = `<urlset><url><loc>${SITE_ORIGIN}/</loc><lastmod>2026-09-17</lastmod></url></urlset>`;
  const fetchImpl = async (url) => {
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, sitemapXml);
    if (url === INDEXNOW_ENDPOINT) return response(403, "Key not found", "Forbidden");
    throw new Error(`Unexpected request: ${url}`);
  };

  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl,
      keyInfo: validKeyInfo,
      expectedSitemapXml: sitemapXml,
      logger: { log() {} },
      timeoutMs: 100,
    }),
    /IndexNow batch 1\/1 returned HTTP 403 Forbidden — Key not found/,
  );
});

test("sender retries only the exact IndexNow verification-propagation failure once", async () => {
  const calls = [];
  const waits = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, matchingSitemapXml);
    if (url === INDEXNOW_ENDPOINT) {
      return calls.filter((call) => call === INDEXNOW_ENDPOINT).length === 1
        ? response(403, '{"code":"SiteVerificationNotCompleted"}', "Forbidden")
        : response(202, "", "Accepted");
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  const result = await submitPublishedSitemap({
    fetchImpl,
    keyInfo: validKeyInfo,
    expectedSitemapXml: matchingSitemapXml,
    waitImpl: async (milliseconds) => waits.push(milliseconds),
    logger: { log() {} },
    timeoutMs: 100,
  });

  assert.equal(result.urlCount, 1);
  assert.deepEqual(waits, [VERIFICATION_PROPAGATION_RETRY_MS]);
  assert.equal(calls.filter((url) => url === INDEXNOW_ENDPOINT).length, 2);
});

test("sender limits a verification-propagation retry to one request", async () => {
  const calls = [];
  const waits = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, matchingSitemapXml);
    if (url === INDEXNOW_ENDPOINT) {
      return response(403, "SiteVerificationNotCompleted", "Forbidden");
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl,
      keyInfo: validKeyInfo,
      expectedSitemapXml: matchingSitemapXml,
      waitImpl: async (milliseconds) => waits.push(milliseconds),
      logger: { log() {} },
      timeoutMs: 100,
    }),
    /IndexNow batch 1\/1 returned HTTP 403 Forbidden/,
  );
  assert.deepEqual(waits, [VERIFICATION_PROPAGATION_RETRY_MS]);
  assert.equal(calls.filter((url) => url === INDEXNOW_ENDPOINT).length, 2);
});

test("post-deploy flow accepts only the canonical main sitemap URL", async () => {
  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl: async () => response(200, ""),
      keyInfo: validKeyInfo,
      sitemapUrl: `${SITE_ORIGIN}/sitemap-in.xml`,
      expectedSitemapXml: matchingSitemapXml,
      logger: { log() {} },
      timeoutMs: 100,
    }),
    /Only the published .*\/sitemap.xml sitemap/,
  );
});

test("post-deploy CLI help explains when to run without making requests", () => {
  const scriptPath = fileURLToPath(new URL("../scripts/submit-indexnow.mjs", import.meta.url));
  const result = spawnSync(process.execPath, [scriptPath, "--help"], {
    encoding: "utf8",
    timeout: 2_000,
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Run only after the new deployment is Live/);
  assert.match(result.stdout, /pnpm run notify:indexnow/);
});

test("post-deploy flow reports request timeouts clearly", async () => {
  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl: () => new Promise(() => {}),
      keyInfo: validKeyInfo,
      expectedSitemapXml: matchingSitemapXml,
      logger: { log() {} },
      timeoutMs: 5,
    }),
    /Request timed out after 5 ms/,
  );
});

test("post-deploy flow waits for the exact built sitemap dates before submitting", async () => {
  const liveSitemapXml = matchingSitemapXml.replace("2026-09-17", "2026-09-18");
  const calls = [];
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url === validKeyInfo.keyLocation) return response(200, validKey);
    if (url === SITEMAP_URL) return response(200, liveSitemapXml);
    if (url === INDEXNOW_ENDPOINT) return response(202);
    throw new Error(`Unexpected request: ${url}`);
  };

  await assert.rejects(
    submitPublishedSitemap({
      fetchImpl,
      keyInfo: validKeyInfo,
      expectedSitemapXml: matchingSitemapXml,
      logger: { log() {} },
      timeoutMs: 100,
    }),
    /does not match this build's URL and lastmod snapshot/,
  );
  assert.deepEqual(calls, [validKeyInfo.keyLocation, SITEMAP_URL]);
});