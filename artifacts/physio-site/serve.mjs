/**
 * Production server for goswamirehab.in & goswamirehab.com
 *
 * Handles:
 *  - Per-route prerendered HTML (directory-index routing)
 *  - .com/www.* → primary .in host redirect (301)
 *  - HTTP → HTTPS redirect (301, via X-Forwarded-Proto)
 *  - Proper 404 for non-existent blog/city pattern routes
 *  - Gzip compression
 *  - Immutable cache for fingerprinted assets and revalidated cache for HTML
 */
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import zlib from "zlib";
import serviceGuideRouteData from "./src/lib/service-guide-routes.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir   = path.join(__dirname, "dist/public");
const PORT      = Number(process.env.PORT);

if (!PORT || Number.isNaN(PORT)) throw new Error(`PORT required. Got: "${process.env.PORT}"`);
if (!fs.existsSync(distDir))     throw new Error(`dist/public not found at ${distDir}. Run build first.`);

const bookingVariantManifestPath = path.join(distDir, ".booking-variants", "manifest.json");
if (!fs.existsSync(bookingVariantManifestPath)) {
  throw new Error(`Booking variant manifest not found at ${bookingVariantManifestPath}. Run build first.`);
}
const bookingVariantManifest = JSON.parse(
  fs.readFileSync(bookingVariantManifestPath, "utf8"),
);
if (!Array.isArray(bookingVariantManifest)) {
  throw new Error("Booking variant manifest must be an array.");
}
const cityGuideRedirectManifestPath = path.join(__dirname, "dist", "city-guide-redirects.json");
if (!fs.existsSync(cityGuideRedirectManifestPath)) {
  throw new Error(`City-guide redirect manifest not found at ${cityGuideRedirectManifestPath}. Run build first.`);
}
const cityGuideRedirects = JSON.parse(fs.readFileSync(cityGuideRedirectManifestPath, "utf8"));
if (!cityGuideRedirects || typeof cityGuideRedirects !== "object" || Array.isArray(cityGuideRedirects)) {
  throw new Error("City-guide redirect manifest must be an object.");
}
for (const [sourcePath, targetPath] of Object.entries(cityGuideRedirects)) {
  if (
    !/^\/blog\/physiotherapist-at-home-[a-z0-9-]+$/.test(sourcePath) ||
    !/^\/physiotherapist-at-home\/[a-z0-9-]+$/.test(targetPath) ||
    sourcePath === targetPath
  ) {
    throw new Error(`City-guide redirect manifest contains an invalid route: ${sourcePath} → ${targetPath}.`);
  }
}
const bookingVariantPaths = new Map(
  bookingVariantManifest.map(({ query, path: variantPath }) => {
    if (
      typeof query !== "string" ||
      typeof variantPath !== "string" ||
      !variantPath.startsWith("/.booking-variants/") ||
      variantPath.includes("..")
    ) {
      throw new Error("Booking variant manifest contains an invalid route.");
    }
    return [query, variantPath];
  }),
);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml":  "application/xml; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
  ".md":   "text/markdown; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".zip":  "application/zip",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
};
const REVALIDATED_EXTS = new Set([".html", ".xml", ".txt"]);
const REVALIDATED      = "public, max-age=300, stale-while-revalidate=86400";
const IMMUTABLE     = "public, max-age=31536000, immutable";
const NO_STORE_PATHS = new Set(["/indexnow-build-manifest.json"]);
const fileCache = new Map();
const gzipCache = new Map();
const SECURITY_HEADERS = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Content-Security-Policy":
    "default-src 'self'; base-uri 'self'; form-action 'self'; object-src 'none'; script-src 'self' https://www.googletagmanager.com; style-src 'self'; font-src 'self' data:; img-src 'self' data: https:; connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com; frame-src https://www.google.com https://www.googletagmanager.com; frame-ancestors 'self'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
};

function headers(extra = {}) {
  return { ...SECURITY_HEADERS, ...extra };
}

// These URL patterns SHOULD have a prerendered index.html.
// If they don't, return 404 instead of silently serving the home page.
const PRERENDERED_PATTERNS = [
  /^\/blog\/(?!category\/)[^/]+$/,           // /blog/:slug
  /^\/blog\/category\/[^/]+$/,               // /blog/category/:name
  /^\/physiotherapist-at-home\/[^/]+$/,      // /physiotherapist-at-home/:city
  /^\/physiotherapist-at-home-in\/[^/]+$/,  // /physiotherapist-at-home-in/:state
  ...serviceGuideRouteData.rootPaths.map((routePath) => new RegExp(`^${routePath}$`)),
];

const LEGACY_REDIRECTS = new Map([
  ...Object.entries(serviceGuideRouteData.legacyRedirects),
  ...Object.entries(cityGuideRedirects),
  ["/blog/post-surgery-rehab-what-to-expect", "/post-surgery-rehab"],
]);
const GURUGRAM_ALIAS_PATH = "/physiotherapist-at-home/gurugram";
const GURUGRAM_CANONICAL_PATH = "/physiotherapist-at-home/gurgaon";
const CANONICAL_HOST = "goswamirehab.in";
const REPLIT_DEV_HOST = getRequestHostname(process.env.REPLIT_DEV_DOMAIN ?? "");

function isPrerenderedPattern(urlPath) {
  return PRERENDERED_PATTERNS.some(p => p.test(urlPath));
}

function normalizePathCaseAndSlash(urlPath) {
  const lowerCasePath = urlPath.toLowerCase();
  if (lowerCasePath === "/") return lowerCasePath;
  return lowerCasePath.replace(/\/+$/, "") || "/";
}

function getCanonicalRedirectPath(urlPath) {
  // Build output filenames can contain case-sensitive hashes; only canonicalize route paths.
  if (/\.[^/]+$/.test(urlPath)) return urlPath;
  const normalizedPath = normalizePathCaseAndSlash(urlPath);
  if (normalizedPath === GURUGRAM_ALIAS_PATH) return GURUGRAM_CANONICAL_PATH;
  return LEGACY_REDIRECTS.get(normalizedPath) ?? normalizedPath;
}

function getRequestHostname(hostHeader) {
  try {
    return new URL(`http://${hostHeader}`).hostname.toLowerCase().replace(/^\[|\]$/g, "");
  } catch {
    return "";
  }
}

function shouldRedirectToCanonicalHost(req, hostname) {
  if (
    ["localhost", "127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(hostname) ||
    (REPLIT_DEV_HOST && hostname === REPLIT_DEV_HOST)
  ) {
    return false;
  }
  const hostHeader = String(req.headers.host ?? "");
  const forwardedProtocol = String(req.headers["x-forwarded-proto"] ?? "")
    .split(",")[0]
    .trim()
    .toLowerCase();
  const protocol = forwardedProtocol || (req.socket.encrypted ? "https" : "http");
  let requestPort = "";
  try {
    requestPort = new URL(`http://${hostHeader}`).port;
  } catch {
    return true;
  }
  return (
    hostname !== CANONICAL_HOST ||
    protocol !== "https" ||
    (requestPort !== "" && requestPort !== "443")
  );
}

/** Resolve a URL path → absolute file path inside distDir, or null for 404. */
function resolveFile(urlPath) {
  let decodedPath;
  try {
    decodedPath = decodeURIComponent(urlPath);
  } catch {
    return null;
  }
  if (decodedPath.includes("\0")) return null;
  const relativePath = decodedPath.replace(/^\/+/, "");
  const insideDist = (candidate) =>
    candidate === distDir || candidate.startsWith(`${distDir}${path.sep}`);
  const exact = path.resolve(distDir, relativePath);
  if (!insideDist(exact)) return null;

  // 1. Exact file match (assets, robots.txt, sitemap.xml, images, fonts…)
  if (fs.existsSync(exact) && fs.statSync(exact).isFile()) return exact;

  // 2. Directory index — the prerendered page for this route
  const index = path.resolve(exact, "index.html");
  if (!insideDist(index)) return null;
  if (fs.existsSync(index)) return index;

  // 3. Known-pattern paths (blog/city/category) that have NO prerendered file
  //    must 404 — do NOT fall back to home page (that confuses Google)
  if (isPrerenderedPattern(decodedPath)) return null;

  // 4. The production build prerenders every application route. An unknown
  //    path must not receive the homepage with HTTP 200 (a soft 404).
  //    Client-side navigation still renders App's NotFound route after a
  //    successful navigation; direct requests get the correct HTTP status.
  return null;
}

const NOT_FOUND_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Page Not Found | Goswami Institute of Functional Training</title>
  <meta name="robots" content="noindex" />
  <style>
    body { font-family: system-ui, sans-serif; text-align: center; padding: 4rem 1rem; color: #1a1a1a; }
    h1 { font-size: 2rem; margin-bottom: 0.5rem; }
    p  { color: #555; margin-bottom: 1.5rem; }
    a  { color: #2563eb; text-decoration: underline; }
  </style>
</head>
<body>
  <h1>404 — Page Not Found</h1>
  <p>This page doesn't exist or has been moved.</p>
  <a href="/">← Go back to home</a>
</body>
</html>`;

const API_PORT = 8099;

function proxyToApi(req, res) {
  const options = {
    hostname: "127.0.0.1",
    port: API_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `127.0.0.1:${API_PORT}` },
  };
  const proxy = http.request(options, (apiRes) => {
    res.writeHead(apiRes.statusCode, apiRes.headers);
    apiRes.pipe(res, { end: true });
  });
  proxy.on("error", () => {
    res.writeHead(502, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "API unavailable" }));
  });
  req.pipe(proxy, { end: true });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[character]));
}

function readableSlug(value) {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getCachedFile(filePath, stat) {
  const cacheKey = `${filePath}:${stat.size}:${stat.mtimeMs}`;
  const cached = fileCache.get(filePath);
  if (cached?.key === cacheKey) return cached.content;

  const content = fs.readFileSync(filePath);
  fileCache.set(filePath, { key: cacheKey, content });
  if (fileCache.size > 256) {
    const oldestKey = fileCache.keys().next().value;
    if (oldestKey) fileCache.delete(oldestKey);
  }
  return content;
}

function getCachedGzip(filePath, stat, content) {
  const cacheKey = `${filePath}:${stat.size}:${stat.mtimeMs}`;
  const cached = gzipCache.get(filePath);
  if (cached?.key === cacheKey) return cached.content;

  const compressed = zlib.gzipSync(content);
  gzipCache.set(filePath, { key: cacheKey, content: compressed });
  if (gzipCache.size > 256) {
    const oldestKey = gzipCache.keys().next().value;
    if (oldestKey) gzipCache.delete(oldestKey);
  }
  return compressed;
}

const TRACKING_QUERY_KEYS = new Set([
  "gclid",
  "fbclid",
  "msclkid",
  "wbraid",
  "gbraid",
  "ref",
  "source",
]);

function isTrackingQueryKey(key) {
  const normalized = key.toLowerCase();
  return normalized.startsWith("utm_") || TRACKING_QUERY_KEYS.has(normalized);
}

function getBookingVariantPath(search) {
  const params = new URLSearchParams(search);
  const allowedKeys = new Set(["city", "locality", "mode"]);
  const controlValues = new Map();

  for (const [key, value] of params) {
    const normalizedKey = key.toLowerCase();
    if (!allowedKeys.has(normalizedKey)) {
      if (isTrackingQueryKey(normalizedKey)) continue;
      return null;
    }
    if (controlValues.has(normalizedKey)) return null;
    controlValues.set(normalizedKey, value);
  }

  const city = controlValues.get("city")?.trim().toLowerCase();
  const locality = controlValues.get("locality")?.trim().toLowerCase();
  const mode = controlValues.get("mode")?.trim().toLowerCase();
  if ((controlValues.has("mode") && !mode) || (mode && mode !== "telehealth")) return null;
  if (city && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(city)) return null;
  if (locality && (!city || mode)) return null;
  if (!city && (locality || mode !== "telehealth")) return null;
  if ((controlValues.has("city") && !city) || (controlValues.has("locality") && !locality)) {
    return null;
  }

  const normalized = new URLSearchParams();
  if (city) normalized.set("city", city);
  if (locality) normalized.set("locality", locality);
  if (mode) normalized.set("mode", mode);
  return bookingVariantPaths.get(normalized.toString()) ?? null;
}

const server = http.createServer((req, res) => {
  const raw     = req.url ?? "/";
  const queryIndex = raw.indexOf("?");
  const requestPath = queryIndex === -1 ? raw : raw.slice(0, queryIndex);
  const qs = queryIndex === -1 ? "" : raw.slice(queryIndex + 1);
  const querySuffix = queryIndex === -1 ? "" : raw.slice(queryIndex);

  // ── 0. Proxy /api/* to the API server ────────────────────────────────────
  if (requestPath.startsWith("/api/") || requestPath === "/api") {
    proxyToApi(req, res);
    return;
  }

  // ── 1. Single-hop canonicalization ────────────────────────────────────────
  // Normalize aliases, case, trailing slashes, protocol, host, and port
  // together. Never reflect the request Host header in a redirect target.
  const hostname = getRequestHostname(req.headers.host ?? "");
  const canonicalPath = getCanonicalRedirectPath(requestPath);
  const needsHostRedirect = shouldRedirectToCanonicalHost(req, hostname);
  const needsPathRedirect = canonicalPath !== requestPath;
  if (needsHostRedirect || needsPathRedirect) {
    res.writeHead(301, headers({
      Location: `https://${CANONICAL_HOST}${canonicalPath}${querySuffix}`,
      "Cache-Control": REVALIDATED,
    }));
    res.end();
    return;
  }
  const urlPath = canonicalPath;
  const hasQueryString = queryIndex !== -1;
  const hasBookingContext = urlPath === "/booking" && hasQueryString;
  const hasBlogQuery = urlPath === "/blog" && hasQueryString;
  const bookingVariantPath = hasBookingContext ? getBookingVariantPath(qs) : null;
  const hasNoindexContext = hasBlogQuery || hasBookingContext;
  const hasFeedbackNoindex = urlPath === "/feedback";
  const noindexResponseHeaders = hasBookingContext || hasFeedbackNoindex
    ? { "X-Robots-Tag": "noindex, follow" }
    : hasBlogQuery
      ? { "X-Robots-Tag": "noindex, follow, noai, noimageai" }
      : {};

  // ── 2. Retired duplicate sitemap ───────────────────────────────────────────
  // Return a deliberate non-success response rather than letting the SPA
  // fallback serve a misleading 200 page for an old submitted sitemap.
  if (urlPath === "/sitemap-com.xml") {
     res.writeHead(410, headers({ "Content-Type": "text/plain; charset=utf-8", "Cache-Control": REVALIDATED }));
    res.end("This sitemap has been retired. Use https://goswamirehab.in/sitemap.xml");
    return;
  }

  let decodedPathForGuard = urlPath;
  try {
    decodedPathForGuard = decodeURIComponent(urlPath);
  } catch {
    decodedPathForGuard = urlPath;
  }
  const normalizedPathForGuard = path.posix.normalize(decodedPathForGuard);
  if (
    normalizedPathForGuard === "/.booking-variants" ||
    normalizedPathForGuard.startsWith("/.booking-variants/")
  ) {
    res.writeHead(404, headers({
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": REVALIDATED,
      "X-Robots-Tag": "noindex",
    }));
    res.end(NOT_FOUND_HTML);
    return;
  }

  // ── 3. Resolve to a file ──────────────────────────────────────────────────
  const filePath = resolveFile(bookingVariantPath ?? urlPath);

  if (!filePath) {
    // Unknown or known-pattern path with no prerendered file → proper 404.
    res.writeHead(404, headers({
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": REVALIDATED,
      "X-Robots-Tag": "noindex",
    }));
    res.end(NOT_FOUND_HTML);
    return;
  }

  // ── 4. Serve file ─────────────────────────────────────────────────────────
  const ext   = path.extname(filePath).toLowerCase();
  const acceptsMarkdown = ext === ".html" &&
    String(req.headers.accept ?? "").toLowerCase().includes("text/markdown");
  const mime  = acceptsMarkdown
    ? "text/markdown; charset=utf-8"
    : (MIME[ext] ?? "application/octet-stream");
  const cache = NO_STORE_PATHS.has(urlPath)
    ? "no-store"
    : REVALIDATED_EXTS.has(ext)
      ? REVALIDATED
      : IMMUTABLE;

  try {
    const stat = fs.statSync(filePath);
    const markdownPath = path.join(distDir, "llms.txt");
    const markdownStat = acceptsMarkdown ? fs.statSync(markdownPath) : null;
    const responseStat = markdownStat ?? stat;
    const etag = `W/"${responseStat.size.toString(16)}-${Math.floor(responseStat.mtimeMs).toString(16)}"`;
    const lastModified = responseStat.mtime.toUTCString();
    const validatorHeaders = {
      "Cache-Control": cache,
      ETag: etag,
      "Last-Modified": lastModified,
      ...(acceptsMarkdown ? { Vary: "Accept" } : {}),
      ...(ext === ".zip"
        ? { "Content-Disposition": `attachment; filename="${path.basename(filePath)}"` }
        : {}),
    };

    if (
      req.headers["if-none-match"] === etag ||
      (req.headers["if-modified-since"] &&
        new Date(req.headers["if-modified-since"]).getTime() >= stat.mtime.getTime())
    ) {
      res.writeHead(304, headers({ ...validatorHeaders, ...noindexResponseHeaders }));
      res.end();
      return;
    }

    let content = acceptsMarkdown
      ? getCachedFile(markdownPath, markdownStat)
      : getCachedFile(filePath, stat);
    const canUseCachedGzip = !acceptsMarkdown &&
      (ext !== ".html" || (!hasNoindexContext && (!hasBookingContext || Boolean(bookingVariantPath))));

    if (ext === ".html" && !acceptsMarkdown) {
      let html = content.toString("utf8");
      if (hasNoindexContext) {
         html = html.replace(
           /<meta name="robots" content="[^"]*"\s*\/?>/i,
            '<meta name="robots" content="noindex, follow" />',
         );
      }
      if (hasBookingContext) {
        html = html.replace(
          /<link rel="canonical" href="[^"]*"\s*\/?>/i,
          '<link rel="canonical" href="https://goswamirehab.in/booking" />',
        );
      }
      if (hasBookingContext && !bookingVariantPath) {
        html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "");
      }
      content = Buffer.from(html, "utf8");
    }

    const acceptsGzip    = (req.headers["accept-encoding"] ?? "").includes("gzip");
    const shouldCompress = acceptsGzip && content.length > 860;

    if (shouldCompress && canUseCachedGzip) {
      const body = getCachedGzip(filePath, stat, content);
      const hdrs = headers({
        "Content-Type": mime,
        ...validatorHeaders,
        ...noindexResponseHeaders,
        "Content-Encoding": "gzip",
        "Vary": "Accept-Encoding",
      });
      res.writeHead(200, hdrs);
      res.end(body);
    } else if (shouldCompress) {
      zlib.gzip(content, (err, gz) => {
        const body = err ? content : gz;
        const hdrs = headers({
          "Content-Type": mime,
          ...validatorHeaders,
          ...noindexResponseHeaders,
        });
        if (!err) { hdrs["Content-Encoding"] = "gzip"; hdrs["Vary"] = "Accept-Encoding"; }
        res.writeHead(200, hdrs);
        res.end(body);
      });
    } else {
       res.writeHead(200, headers({
         "Content-Type": mime,
         ...validatorHeaders,
          ...noindexResponseHeaders,
       }));
      res.end(content);
    }
  } catch (err) {
    console.error(`Error serving ${urlPath}:`, err.message);
    res.writeHead(500, headers({ "Content-Type": "text/plain" }));
    res.end("Server error");
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`✓ Serving ${distDir}`);
  console.log(`✓ Port ${PORT} — canonical .in host | HTTP→HTTPS | 404 for missing routes`);
});

// Graceful shutdown — exit cleanly on SIGTERM so the port is released
// before the next process tries to bind it (avoids EADDRINUSE on restart)
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
