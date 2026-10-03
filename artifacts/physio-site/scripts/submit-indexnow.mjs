import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  parseIndexNowBuildManifest,
  validateSitemapFingerprint,
} from "./indexnow-build-manifest.mjs";

export const SITE_ORIGIN = "https://goswamirehab.in";
export const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
export const MAX_URLS_PER_REQUEST = 10_000;
export const REQUEST_TIMEOUT_MS = 15_000;
export const VERIFICATION_PROPAGATION_RETRY_MS = 60_000;

const KEY_PATTERN = /^[A-Za-z0-9-]{8,128}$/;
const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(SCRIPT_DIRECTORY, "..");
const PUBLIC_DIRECTORY = path.join(SITE_ROOT, "public");

function decodeXmlText(value) {
  const entities = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&apos;": "'",
  };
  return value.replace(/&(amp|lt|gt|quot|apos);/g, (entity) => entities[entity]);
}

function isCanonicalIndexableUrl(value, origin = SITE_ORIGIN) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (
    url.origin !== origin ||
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  ) {
    return false;
  }

  const canonicalValue = `${origin}${url.pathname}`;
  if (
    value !== canonicalValue ||
    !/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*)?$/.test(url.pathname) ||
    (url.pathname !== "/" && url.pathname.endsWith("/")) ||
    url.pathname === "/feedback"
  ) {
    return false;
  }

  return true;
}

export function parseSitemapUrls(xml, origin = SITE_ORIGIN) {
  if (!/<urlset\b[^>]*>/i.test(xml)) {
    throw new Error("Published sitemap is missing its XML urlset element.");
  }

  const locations = [...xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)];
  if (locations.length === 0) {
    throw new Error("Published sitemap contains no URL locations.");
  }

  const urls = [];
  const seen = new Set();
  let rejectedCount = 0;

  for (const [, rawLocation] of locations) {
    const location = decodeXmlText(rawLocation.trim());
    if (!isCanonicalIndexableUrl(location, origin) || seen.has(location)) {
      rejectedCount += 1;
      continue;
    }

    seen.add(location);
    urls.push(location);
  }

  return { urls, rejectedCount };
}

export function fingerprintSitemapDocument(xml) {
  if (!/<urlset\b[^>]*>/i.test(xml)) {
    throw new Error("Sitemap fingerprint requires an XML urlset.");
  }

  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)];
  if (entries.length === 0) throw new Error("Sitemap fingerprint requires at least one URL.");

  const seen = new Set();
  const records = entries.map(([, entry]) => {
    const locations = [...entry.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)];
    const lastmods = [...entry.matchAll(/<lastmod>([\s\S]*?)<\/lastmod>/gi)];
    if (locations.length !== 1 || lastmods.length !== 1) {
      throw new Error("Every sitemap URL must have exactly one <loc> and one <lastmod>.");
    }

    const url = decodeXmlText(locations[0][1].trim());
    const lastmod = lastmods[0][1].trim();
    if (!isCanonicalIndexableUrl(url)) {
      throw new Error(`Sitemap fingerprint found a noncanonical or non-indexable URL: ${url}`);
    }
    const date = new Date(`${lastmod}T00:00:00.000Z`);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(lastmod) ||
      !Number.isFinite(date.valueOf()) ||
      date.toISOString().slice(0, 10) !== lastmod
    ) {
      throw new Error(`Sitemap fingerprint found an invalid <lastmod> date for ${url}: ${lastmod}`);
    }
    if (seen.has(url)) throw new Error(`Sitemap fingerprint found a duplicate URL: ${url}`);
    seen.add(url);
    return [url, lastmod];
  });

  const canonicalRecords = records
    .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
    .map(([url, lastmod]) => `${url}\t${lastmod}`)
    .join("\n");
  return createHash("sha256").update(canonicalRecords).digest("hex");
}

export function chunkUrls(urls, limit = MAX_URLS_PER_REQUEST) {
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_URLS_PER_REQUEST) {
    throw new Error(`IndexNow batch size must be between 1 and ${MAX_URLS_PER_REQUEST}.`);
  }

  const chunks = [];
  for (let index = 0; index < urls.length; index += limit) {
    chunks.push(urls.slice(index, index + limit));
  }
  return chunks;
}

export function readPublicIndexNowKey(publicDirectory = PUBLIC_DIRECTORY) {
  const keyFiles = readdirSync(publicDirectory)
    .filter((filename) => /^indexnow-[A-Za-z0-9-]{8,128}\.txt$/.test(filename))
    .sort();

  if (keyFiles.length !== 1) {
    throw new Error(
      `Expected exactly one public IndexNow key file in ${publicDirectory}; found ${keyFiles.length}.`,
    );
  }

  const filename = keyFiles[0];
  const key = filename.slice(0, -".txt".length);
  const fileContents = readFileSync(path.join(publicDirectory, filename), "utf8").trim();
  if (!KEY_PATTERN.test(key) || fileContents !== key) {
    throw new Error(`IndexNow key file ${filename} must contain exactly its basename.`);
  }

  return {
    key,
    keyLocation: `${SITE_ORIGIN}/${filename}`,
  };
}

export function createIndexNowPayload({ key, keyLocation, urls }) {
  if (!KEY_PATTERN.test(key ?? "")) {
    throw new Error("IndexNow key must be 8–128 characters using letters, numbers, and hyphens.");
  }
  if (keyLocation !== `${SITE_ORIGIN}/${key}.txt`) {
    throw new Error("IndexNow keyLocation must point to the matching public root key file.");
  }
  if (!Array.isArray(urls) || urls.length === 0 || urls.length > MAX_URLS_PER_REQUEST) {
    throw new Error(`IndexNow payload must contain 1–${MAX_URLS_PER_REQUEST} URLs.`);
  }
  if (urls.some((url) => !isCanonicalIndexableUrl(url))) {
    throw new Error("IndexNow payload contains a noncanonical or non-indexable URL.");
  }
  if (new Set(urls).size !== urls.length) {
    throw new Error("IndexNow payload must not contain duplicate URLs.");
  }

  return {
    host: new URL(SITE_ORIGIN).host,
    key,
    keyLocation,
    urlList: urls,
  };
}

async function requestText(fetchImpl, url, options = {}, timeoutMs = REQUEST_TIMEOUT_MS) {
  if (typeof fetchImpl !== "function") {
    throw new Error("This Node.js runtime does not provide fetch().");
  }

  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timed out after ${timeoutMs} ms`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      (async () => {
        const response = await fetchImpl(url, {
          ...options,
          signal: controller.signal,
        });
        const body = await response.text();
        return { response, body };
      })(),
      timeout,
    ]);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Request timed out after ${timeoutMs} ms: ${url}`, { cause: error });
    }
    throw new Error(`Request failed for ${url}: ${error?.message ?? String(error)}`, {
      cause: error,
    });
  } finally {
    clearTimeout(timer);
  }
}

function requireStatus(response, body, acceptedStatuses, description) {
  if (acceptedStatuses.includes(response.status)) return;

  const detail = body.trim().slice(0, 300);
  const suffix = detail ? ` — ${detail}` : "";
  throw new Error(
    `${description} returned HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}${suffix}`,
  );
}

export async function submitPublishedSitemap({
  fetchImpl = globalThis.fetch,
  keyInfo = readPublicIndexNowKey(),
  sitemapUrl = SITEMAP_URL,
  expectedSitemapXml,
  expectedSitemapFingerprint,
  timeoutMs = REQUEST_TIMEOUT_MS,
  waitImpl = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds)),
  logger = console,
} = {}) {
  const requestedSitemap = new URL(sitemapUrl);
  if (
    requestedSitemap.origin !== SITE_ORIGIN ||
    requestedSitemap.pathname !== "/sitemap.xml" ||
    requestedSitemap.search ||
    requestedSitemap.hash
  ) {
    throw new Error(`Only the published ${SITEMAP_URL} sitemap may be submitted.`);
  }
  const hasExpectedXml = typeof expectedSitemapXml === "string";
  const hasExpectedFingerprint = typeof expectedSitemapFingerprint === "string";
  if (hasExpectedXml === hasExpectedFingerprint) {
    throw new Error("Provide exactly one built sitemap or validated build-manifest fingerprint.");
  }
  const expectedFingerprint = hasExpectedXml
    ? fingerprintSitemapDocument(expectedSitemapXml)
    : validateSitemapFingerprint(expectedSitemapFingerprint);

  if (
    !KEY_PATTERN.test(keyInfo?.key ?? "") ||
    keyInfo.keyLocation !== `${SITE_ORIGIN}/${keyInfo.key}.txt`
  ) {
    throw new Error("The local IndexNow key must match its public root-file URL.");
  }

  logger.log(`[IndexNow] Checking that the public key is live at ${keyInfo.keyLocation}`);
  const keyResult = await requestText(
    fetchImpl,
    keyInfo.keyLocation,
    { headers: { Accept: "text/plain" } },
    timeoutMs,
  );
  requireStatus(keyResult.response, keyResult.body, [200], "Public key check");
  if (keyResult.body.trim() !== keyInfo.key) {
    throw new Error("The live IndexNow key file does not match the local public key; publish first.");
  }

  logger.log(`[IndexNow] Fetching the published sitemap: ${requestedSitemap.href}`);
  const sitemapResult = await requestText(
    fetchImpl,
    requestedSitemap.href,
    {
      headers: {
        Accept: "application/xml, text/xml",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    },
    timeoutMs,
  );
  requireStatus(sitemapResult.response, sitemapResult.body, [200], "Published sitemap fetch");
  const liveFingerprint = fingerprintSitemapDocument(sitemapResult.body);
  if (liveFingerprint !== expectedFingerprint) {
    throw new Error(
      "The live sitemap does not match this build's URL and lastmod snapshot; no IndexNow URLs were submitted.",
    );
  }

  const { urls, rejectedCount } = parseSitemapUrls(sitemapResult.body);
  if (urls.length === 0) {
    throw new Error("Published sitemap contains no valid canonical indexable URLs to submit.");
  }

  const chunks = chunkUrls(urls);
  logger.log(
    `[IndexNow] Validated ${urls.length} canonical URLs; skipped ${rejectedCount} duplicate, noncanonical, or non-indexable entries.`,
  );

  for (let index = 0; index < chunks.length; index += 1) {
    const payload = createIndexNowPayload({
      ...keyInfo,
      urls: chunks[index],
    });
    const result = await requestText(
      fetchImpl,
      INDEXNOW_ENDPOINT,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      },
      timeoutMs,
    );
    let submissionResult = result;
    if (
      submissionResult.response.status === 403 &&
      submissionResult.body.includes("SiteVerificationNotCompleted")
    ) {
      logger.log(
        `[IndexNow] Host verification has not propagated yet; waiting ${VERIFICATION_PROPAGATION_RETRY_MS / 1000} seconds before one retry.`,
      );
      await waitImpl(VERIFICATION_PROPAGATION_RETRY_MS);
      submissionResult = await requestText(
        fetchImpl,
        INDEXNOW_ENDPOINT,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        },
        timeoutMs,
      );
    }
    requireStatus(
      submissionResult.response,
      submissionResult.body,
      [200, 202],
      `IndexNow batch ${index + 1}/${chunks.length}`,
    );
    logger.log(
      `[IndexNow] Accepted batch ${index + 1}/${chunks.length} (${chunks[index].length} URLs; HTTP ${submissionResult.response.status}).`,
    );
  }

  logger.log(`[IndexNow] Submitted ${urls.length} published sitemap URLs.`);
  return { urlCount: urls.length, rejectedCount, batchCount: chunks.length };
}

function printUsage() {
  console.log([
    "Post-deploy IndexNow submission for goswamirehab.in.",
    "Run only after the new deployment is Live:",
    "  pnpm run notify:indexnow",
    "The command verifies the public key file, reads https://goswamirehab.in/sitemap.xml,",
    "filters to unique canonical indexable URLs, and submits batches to IndexNow.",
    "Manual runs compare against dist/public/sitemap.xml; CI can set",
    "INDEXNOW_BUILD_MANIFEST_PATH to use a frozen public build-manifest snapshot.",
  ].join("\n"));
}

export function resolveExpectedSitemapSnapshot({
  manifestPath = process.env.INDEXNOW_BUILD_MANIFEST_PATH,
  siteRoot = SITE_ROOT,
} = {}) {
  if (typeof manifestPath === "string" && manifestPath.length > 0) {
    const manifest = parseIndexNowBuildManifest(readFileSync(manifestPath, "utf8"));
    return {
      expectedSitemapFingerprint: manifest.sitemapFingerprint,
      buildId: manifest.buildId,
    };
  }

  const builtSitemapPath = path.join(siteRoot, "dist", "public", "sitemap.xml");
  if (!existsSync(builtSitemapPath)) {
    throw new Error(`Built sitemap not found at ${builtSitemapPath}; build first.`);
  }
  return { expectedSitemapXml: readFileSync(builtSitemapPath, "utf8") };
}

async function main(args) {
  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    return;
  }
  if (args.length > 0) {
    throw new Error("This post-deploy command accepts no arguments; use --help for usage.");
  }

  console.log("[IndexNow] Post-deploy notification for the live goswamirehab.in site.");
  const expectedSnapshot = resolveExpectedSitemapSnapshot();
  if (expectedSnapshot.buildId) {
    console.log(`[IndexNow] Using frozen build manifest ${expectedSnapshot.buildId}.`);
  }
  await submitPublishedSitemap(expectedSnapshot);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`[IndexNow] ${error.message}`);
    process.exitCode = 1;
  });
}