import { randomUUID } from "node:crypto";

export const INDEXNOW_BUILD_MANIFEST_SCHEMA_VERSION = 1;

const BUILD_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SITEMAP_FINGERPRINT_PATTERN = /^[0-9a-f]{64}$/;
const EXPECTED_FIELDS = ["buildId", "schemaVersion", "sitemapFingerprint"];

export function validateSitemapFingerprint(value) {
  if (typeof value !== "string" || !SITEMAP_FINGERPRINT_PATTERN.test(value)) {
    throw new Error(
      "IndexNow build manifest has an invalid sitemap fingerprint.",
    );
  }
  return value;
}

export function parseIndexNowBuildManifest(value) {
  let candidate = value;
  if (typeof candidate === "string") {
    try {
      candidate = JSON.parse(candidate);
    } catch {
      throw new Error("IndexNow build manifest is not valid JSON.");
    }
  }

  if (!candidate || typeof candidate !== "object" || Array.isArray(candidate)) {
    throw new Error("IndexNow build manifest must be a JSON object.");
  }

  const fields = Object.keys(candidate).sort();
  if (
    fields.length !== EXPECTED_FIELDS.length ||
    fields.some((field, index) => field !== EXPECTED_FIELDS[index])
  ) {
    throw new Error("IndexNow build manifest has an unexpected shape.");
  }
  if (candidate.schemaVersion !== INDEXNOW_BUILD_MANIFEST_SCHEMA_VERSION) {
    throw new Error(
      "IndexNow build manifest has an unsupported schema version.",
    );
  }
  if (
    typeof candidate.buildId !== "string" ||
    !BUILD_ID_PATTERN.test(candidate.buildId)
  ) {
    throw new Error("IndexNow build manifest has an invalid build ID.");
  }

  return {
    schemaVersion: candidate.schemaVersion,
    buildId: candidate.buildId,
    sitemapFingerprint: validateSitemapFingerprint(
      candidate.sitemapFingerprint,
    ),
  };
}

export function createIndexNowBuildManifest({
  buildId = randomUUID(),
  sitemapFingerprint,
} = {}) {
  return parseIndexNowBuildManifest({
    schemaVersion: INDEXNOW_BUILD_MANIFEST_SCHEMA_VERSION,
    buildId,
    sitemapFingerprint,
  });
}
