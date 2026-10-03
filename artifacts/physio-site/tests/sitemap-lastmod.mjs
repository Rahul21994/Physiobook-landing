import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const siteDirectory = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const publicDirectory = path.join(siteDirectory, "dist", "public");
const sitemapPath = path.join(publicDirectory, "sitemap.xml");
const reportPath = path.join(siteDirectory, "dist", "sitemap-lastmod-sources.json");

assert.ok(fs.existsSync(sitemapPath), "The main sitemap must exist after prerendering");
assert.ok(fs.existsSync(reportPath), "The build should emit its private lastmod provenance report");
assert.ok(
  !fs.existsSync(path.join(publicDirectory, "sitemap-lastmod-sources.json")),
  "Lastmod provenance details must stay out of the public sitemap directory",
);

const sitemap = fs.readFileSync(sitemapPath, "utf8");
const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const { blogPosts } = await import(
  pathToFileURL(path.join(siteDirectory, "dist", "server", "entry-server.js")).href
);
const entries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gu)].map(([, block]) => {
  const loc = block.match(/<loc>([^<]+)<\/loc>/u)?.[1]?.replace(/&amp;/g, "&");
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/u)?.[1];
  assert.ok(loc, "Every sitemap URL entry should contain a location");
  assert.ok(lastmod, `${loc} should have a lastmod date`);
  return { loc, lastmod };
});

assert.ok(entries.length > 200, "The sitemap should contain the complete indexable route set");
assert.equal(
  entries.length,
  Object.keys(report.entries).length,
  "The provenance report should cover every and only sitemap URL",
);

for (const entry of entries) {
  assert.match(entry.lastmod, /^\d{4}-\d{2}-\d{2}$/u, `${entry.loc} should use an ISO date`);
  const provenance = report.entries[entry.loc];
  assert.ok(provenance, `${entry.loc} should have an explicit lastmod source`);
  assert.equal(provenance.date, entry.lastmod, `${entry.loc} report and sitemap dates should match`);
  assert.ok(
    provenance.source || (Array.isArray(provenance.sources) && provenance.sources.length > 0),
    `${entry.loc} should name the data or source files behind its lastmod`,
  );

  const routePath = new URL(entry.loc).pathname;
  if (!routePath.startsWith("/blog/") || routePath.startsWith("/blog/category/")) continue;

  const slug = routePath.slice("/blog/".length);
  const post = blogPosts.find((candidate) => candidate.slug === slug);
  assert.ok(post, `Sitemap article ${routePath} should match an authored Journal post`);

  const expectedField = post.dateModified ? "dateModified" : "isoDate";
  const expectedDate = post[expectedField];
  assert.equal(entry.lastmod, expectedDate, `${routePath} should use ${expectedField}`);
  assert.equal(
    provenance.source,
    `${routePath} ${expectedField}`,
    `${routePath} should report the exact publication-date field used`,
  );
  if (!post.dateModified) {
    assert.equal(
      entry.lastmod,
      post.isoDate,
      `${routePath} must not use updatedAt or updated as its sitemap lastmod`,
    );
  }
}

const strokeArticle = entries.find(
  ({ loc }) => new URL(loc).pathname === "/blog/stroke-rehabilitation-at-home",
);
assert.ok(strokeArticle, "The stroke rehabilitation article should remain in the sitemap");
assert.equal(
  strokeArticle.lastmod,
  report.entries[strokeArticle.loc].date,
  "The stroke article should retain the authored publication/modified date, not the build date",
);

const hindiHomeProvenance = report.entries["https://goswamirehab.in/hi"];
assert.ok(hindiHomeProvenance, "The Hindi homepage should have lastmod provenance");
assert.ok(
  hindiHomeProvenance.undatedSources?.some((source) => source.includes("src/pages/hindi-home.tsx")) ||
    hindiHomeProvenance.inputSources?.some((source) => source.includes("src/pages/hindi-home.tsx")) ||
    hindiHomeProvenance.sources?.some((source) => source.includes("src/pages/hindi-home.tsx")),
  "The Hindi page component should either have a committed date or be explicitly reported as uncommitted",
);

console.log(
  `Sitemap lastmod provenance checks passed for ${entries.length} URLs and ${blogPosts.length} authored Journal posts.`,
);