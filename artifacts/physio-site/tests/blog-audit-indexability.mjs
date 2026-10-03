import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseBlogAuditCsv } from "../scripts/blog-audit.mjs";

const siteDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(siteDir, "dist", "public");
const auditPath = path.resolve(siteDir, "../../blog_audit.csv");
const rows = parseBlogAuditCsv(fs.readFileSync(auditPath, "utf8"));
const articleRows = rows.filter((row) => row.route_type === "article_post");
const categoryRows = rows.filter((row) => row.route_type === "category_archive");
const sitemap = fs.readFileSync(path.join(publicDir, "sitemap.xml"), "utf8");
const sitemapBlogSlugs = new Set(
  [...sitemap.matchAll(
    /<loc>https:\/\/goswamirehab\.in\/blog\/(?!category\/)([^/<]+)<\/loc>/gu,
  )].map((match) => match[1]),
);
const sitemapEntries = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/gu)]
  .map((match) => match[1]);
const noindexSlugs = new Set();

assert.equal(articleRows.length, 206, "the audit should cover every authored article");

for (const row of articleRows) {
  const slug = new URL(row.url).pathname.split("/").at(-1);
  const words = Number(row.visible_words);
  const similarity = Number(row.max_similarity_pct);
  const shouldNoindex = words < 500 && similarity > 70;
  const html = fs.readFileSync(path.join(publicDir, "blog", slug, "index.html"), "utf8");
  const robots = html.match(/<meta name="robots" content="([^"]+)"/u)?.[1];

  assert.match(html, /"@type":\s*"BlogPosting"/u, `${slug} should retain BlogPosting schema`);
  assert.equal(
    row.noindex_candidate === "yes",
    shouldNoindex,
    `${slug} should be flagged only when both audit thresholds are met`,
  );
  assert.equal(
    row.action,
    shouldNoindex ? "noindex" : "keep-indexable",
    `${slug} should state the action derived from both audit thresholds`,
  );

  if (shouldNoindex) {
    noindexSlugs.add(slug);
    assert.match(robots ?? "", /^noindex,\s*follow/u, `${slug} should be noindex`);
    assert.equal(sitemapBlogSlugs.has(slug), false, `${slug} should be omitted from the sitemap`);
  } else {
    assert.equal(robots, "index, follow", `${slug} should remain indexable`);
    assert.equal(sitemapBlogSlugs.has(slug), true, `${slug} should remain in the sitemap`);
  }
}

assert.equal(noindexSlugs.size, 33, "exactly 33 articles meet both noindex thresholds");
assert.equal(
  sitemapBlogSlugs.size,
  articleRows.length - noindexSlugs.size,
  "the blog sitemap should contain each indexable article exactly once",
);

for (const row of categoryRows) {
  const categoryUrl = new URL(row.url).href;
  const entries = sitemapEntries.filter((entry) => entry.includes(`<loc>${categoryUrl}</loc>`));
  assert.equal(row.action, "keep-indexable", `${categoryUrl} should remain indexable`);
  assert.equal(entries.length, 1, `${categoryUrl} should appear exactly once in the sitemap`);
  assert.match(entries[0], /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/u, `${categoryUrl} should include lastmod`);
}

console.log(
  `Validated ${articleRows.length} article routes: ${noindexSlugs.size} noindex candidates, ` +
  `${sitemapBlogSlugs.size} indexable sitemap entries, and ${categoryRows.length} dated category entries.`,
);