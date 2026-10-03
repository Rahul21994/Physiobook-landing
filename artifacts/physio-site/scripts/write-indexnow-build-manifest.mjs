import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fingerprintSitemapDocument } from "./submit-indexnow.mjs";
import { createIndexNowBuildManifest } from "./indexnow-build-manifest.mjs";

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_SITE_ROOT = path.resolve(SCRIPT_DIRECTORY, "..");

export function writeIndexNowBuildManifest({
  siteRoot = DEFAULT_SITE_ROOT,
  buildId,
} = {}) {
  const publicDirectory = path.join(siteRoot, "dist", "public");
  const sitemapPath = path.join(publicDirectory, "sitemap.xml");
  if (!existsSync(sitemapPath)) {
    throw new Error(
      `Completed sitemap not found at ${sitemapPath}; the manifest was not written.`,
    );
  }

  const sitemapXml = readFileSync(sitemapPath, "utf8");
  const manifest = createIndexNowBuildManifest({
    buildId,
    sitemapFingerprint: fingerprintSitemapDocument(sitemapXml),
  });
  const manifestPath = path.join(
    publicDirectory,
    "indexnow-build-manifest.json",
  );
  const temporaryPath = `${manifestPath}.${process.pid}.tmp`;

  try {
    writeFileSync(temporaryPath, `${JSON.stringify(manifest, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
    });
    renameSync(temporaryPath, manifestPath);
  } catch (error) {
    try {
      unlinkSync(temporaryPath);
    } catch {}
    throw new Error(
      `Could not write IndexNow build manifest at ${manifestPath}: ${error.message}`,
    );
  }

  return { manifest, manifestPath };
}

async function main(args) {
  if (args.length !== 0) {
    throw new Error("The build-manifest writer accepts no arguments.");
  }

  const { manifest, manifestPath } = writeIndexNowBuildManifest();
  console.log(
    `[IndexNow] Wrote build manifest ${manifest.buildId} (${manifest.sitemapFingerprint}) to ${manifestPath}`,
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  main(process.argv.slice(2)).catch((error) => {
    console.error(
      `[IndexNow] Build manifest generation failed: ${error.message}`,
    );
    process.exitCode = 1;
  });
}
