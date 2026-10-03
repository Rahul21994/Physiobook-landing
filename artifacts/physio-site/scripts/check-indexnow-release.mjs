import {
  appendFileSync,
  mkdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  SITE_ORIGIN,
  SITEMAP_URL,
  fingerprintSitemapDocument,
} from "./submit-indexnow.mjs";
import { parseIndexNowBuildManifest } from "./indexnow-build-manifest.mjs";

export const INDEXNOW_BUILD_MANIFEST_URL = `${SITE_ORIGIN}/indexnow-build-manifest.json`;
export const RELEASE_POLL_TIMEOUT_MS = 15_000;

async function requestText(fetchImpl, url, headers, timeoutMs) {
  const controller = new AbortController();
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error(`Request timed out after ${timeoutMs} ms: ${url}`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([
      (async () => {
        const response = await fetchImpl(url, {
          headers,
          signal: controller.signal,
        });
        const body = await response.text();
        if (response.status !== 200) {
          const statusText = response.statusText
            ? ` ${response.statusText}`
            : "";
          throw new Error(
            `Request to ${url} returned HTTP ${response.status}${statusText}.`,
          );
        }
        return body;
      })(),
      timeout,
    ]);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error(`Request timed out after ${timeoutMs} ms: ${url}`, {
        cause: error,
      });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

function writeSnapshotAtomically(snapshotPath, manifestText) {
  const directory = path.dirname(snapshotPath);
  mkdirSync(directory, { recursive: true });
  const temporaryPath = `${snapshotPath}.${process.pid}.tmp`;

  try {
    writeFileSync(temporaryPath, manifestText, {
      encoding: "utf8",
      flag: "wx",
    });
    renameSync(temporaryPath, snapshotPath);
  } catch (error) {
    try {
      unlinkSync(temporaryPath);
    } catch {}
    throw error;
  }
}

export async function pollPublishedRelease({
  fetchImpl = globalThis.fetch,
  snapshotPath,
  timeoutMs = RELEASE_POLL_TIMEOUT_MS,
  logger = console,
} = {}) {
  if (typeof fetchImpl !== "function") {
    throw new Error(
      "A fetch implementation is required to poll the public release.",
    );
  }
  if (typeof snapshotPath !== "string" || snapshotPath.length === 0) {
    throw new Error(
      "A temporary snapshot path is required to poll the public release.",
    );
  }

  try {
    const manifestText = await requestText(
      fetchImpl,
      INDEXNOW_BUILD_MANIFEST_URL,
      {
        Accept: "application/json",
        "Cache-Control": "no-cache, no-store",
        Pragma: "no-cache",
      },
      timeoutMs,
    );
    const manifest = parseIndexNowBuildManifest(manifestText);
    const sitemapXml = await requestText(
      fetchImpl,
      SITEMAP_URL,
      {
        Accept: "application/xml, text/xml",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      timeoutMs,
    );
    const liveFingerprint = fingerprintSitemapDocument(sitemapXml);
    if (liveFingerprint !== manifest.sitemapFingerprint) {
      throw new Error(
        "The public sitemap does not match the build manifest's URL and lastmod fingerprint.",
      );
    }

    writeSnapshotAtomically(snapshotPath, manifestText);
    logger.log(
      `[IndexNow poll] Release is ready: build ${manifest.buildId}, fingerprint ${manifest.sitemapFingerprint}.`,
    );
    return { ready: true, manifest, snapshotPath };
  } catch (error) {
    logger.log(
      `[IndexNow poll] Release is not ready; no submission will run: ${error.message}`,
    );
    return { ready: false, reason: error.message };
  }
}

function appendWorkflowOutputs(outputPath, result) {
  const lines = [`ready=${result.ready}`];
  if (result.ready) {
    lines.push(
      `build_id=${result.manifest.buildId}`,
      `fingerprint=${result.manifest.sitemapFingerprint}`,
      `snapshot_path=${result.snapshotPath}`,
    );
  }
  appendFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
}

async function main(args) {
  if (args.length !== 2) {
    throw new Error(
      "Usage: node check-indexnow-release.mjs <snapshot-path> <github-output-path>",
    );
  }

  const [snapshotPath, outputPath] = args;
  const result = await pollPublishedRelease({ snapshotPath });
  appendWorkflowOutputs(outputPath, result);
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(`[IndexNow poll] Fatal: ${error.message}`);
    process.exitCode = 1;
  });
}
