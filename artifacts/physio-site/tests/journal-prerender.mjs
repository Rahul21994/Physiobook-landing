import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "dist", "public");
const serverEntry = path.join(rootDir, "dist", "server", "entry-server.js");
const cityGuideRedirects = JSON.parse(
  fs.readFileSync(path.join(rootDir, "dist", "city-guide-redirects.json"), "utf8"),
);
const retiredCityGuidePaths = new Set(Object.keys(cityGuideRedirects));
const { blogPosts } = await import(`${serverEntry}?journal-prerender-test=${Date.now()}`);

assert.ok(blogPosts.length > 0, "the published Journal catalog should not be empty");

const routeErrors = [];
const forbiddenRenderedPhrases = [
  { pattern: /MRI phrase/i, label: '"MRI phrase"' },
  { pattern: /matching pain to a diagram/i, label: '"matching pain to a diagram"' },
];

function hasAnchorLink(html, target) {
  return [...html.matchAll(/<a\b[^>]*>/gi)].some((match) => {
    const href = match[0].match(/\bhref\s*=\s*(?:"([^"]+)"|'([^']+)')/i);
    return (href?.[1] ?? href?.[2]) === target;
  });
}

for (const post of blogPosts) {
  const articlePath = path.join(publicDir, "blog", post.slug, "index.html");
  if (!fs.existsSync(articlePath)) {
    routeErrors.push(`missing prerendered article route for "${post.slug}"`);
    continue;
  }

  const html = fs.readFileSync(articlePath, "utf8");
  const body = html.slice(html.indexOf("<body"), html.indexOf("</body>"));
  const headerBookingCtas = body.match(
    /<a\b(?=[^>]*data-cta="article-header-booking")(?=[^>]*href="\/booking")[^>]*>/g,
  ) ?? [];
  if (headerBookingCtas.length !== 1) {
    routeErrors.push(
      `"${post.slug}" should contain exactly one header consultation CTA linked to "/booking" (found ${headerBookingCtas.length})`,
    );
  }
  for (const marker of [
    `"datePublished": "${post.isoDate}"`,
    "Dr. Rahul Goswami",
    "Dr. Prakriti Sharma",
    `/blog/${post.slug}`,
  ]) {
    if (!html.includes(marker)) {
      routeErrors.push(`"${post.slug}" is missing article marker "${marker}"`);
    }
  }
  if (
    !body.includes(`data-testid="article-publication-date"`) ||
    !body.includes(`dateTime="${post.isoDate}"`) ||
    !body.includes(`Published on ${post.date}`)
  ) {
    routeErrors.push(`"${post.slug}" should show its publication date in the rendered article body`);
  }
  if (post.content.includes("### ") && !body.includes("journal-contents-list")) {
    routeErrors.push(`"${post.slug}" should render a numbered contents index`);
  }
  if (post.content.includes("### ") && !body.includes("journal-section-number")) {
    routeErrors.push(`"${post.slug}" should render numbered article sections`);
  }
  for (const { pattern, label } of forbiddenRenderedPhrases) {
    if (pattern.test(body)) {
      routeErrors.push(`"${post.slug}" should not contain the unclear phrase ${label}`);
    }
  }
  const visibleText = body.replace(/<[^>]+>/g, " ");
  if (/(?:#{3,4}\s+|\*[^*]+\*)/.test(visibleText)) {
    routeErrors.push(`"${post.slug}" contains raw Markdown markers in visible article text`);
  }
}

for (const post of blogPosts.filter((candidate) => candidate.citySlug)) {
  const cityPath = path.join(publicDir, "physiotherapist-at-home", post.citySlug, "index.html");
  if (!fs.existsSync(cityPath)) {
    routeErrors.push(`missing prerendered city route for "${post.citySlug}"`);
    continue;
  }

  const html = fs.readFileSync(cityPath, "utf8");
  if (!hasAnchorLink(html, `/blog/${post.slug}`)) {
    routeErrors.push(`city "${post.citySlug}" is missing an anchor to Journal article "${post.slug}"`);
  }
    if (post.image.startsWith("journal_")) {
      const cardImage = post.image.replace(/\.(jpe?g)$/i, "_card.webp");
      if (!html.includes(`/images/journal/${cardImage}`)) {
        routeErrors.push(`city "${post.citySlug}" should use the declared photo card for "${post.slug}"`);
      }
    }
}

const curatedCitySlugs = new Set(
  blogPosts
    .filter((candidate) => candidate.citySlug)
    .map((candidate) => candidate.citySlug),
);
for (const post of blogPosts.filter(
  (candidate) =>
    candidate.slug.startsWith("physiotherapist-at-home-") &&
    candidate.slug !== "physiotherapist-at-home-india-guide",
)) {
  const citySlug = post.slug.replace("physiotherapist-at-home-", "");
  if (curatedCitySlugs.has(citySlug)) continue;

  const cityPath = path.join(publicDir, "physiotherapist-at-home", citySlug, "index.html");
  if (!fs.existsSync(cityPath)) {
    routeErrors.push(`missing prerendered city route for guide "${post.slug}"`);
    continue;
  }

  const html = fs.readFileSync(cityPath, "utf8");
  const cityGuidePath = `/blog/${post.slug}`;
  if (retiredCityGuidePaths.has(cityGuidePath)) {
    if (hasAnchorLink(html, cityGuidePath)) {
      routeErrors.push(`city "${citySlug}" should not link to retired city guide "${post.slug}"`);
    }
    if (!hasAnchorLink(html, "/blog/physiotherapist-at-home-india-guide")) {
      routeErrors.push(`city "${citySlug}" should link to the India-wide homecare guide instead`);
    }
  } else if (!hasAnchorLink(html, cityGuidePath)) {
    routeErrors.push(`city "${citySlug}" is missing an anchor to city guide "${post.slug}"`);
  }
}

assert.deepEqual(routeErrors, [], routeErrors.join("\n"));
console.log(
  `Journal prerender regression passed for ${blogPosts.length} articles and ${blogPosts.filter((post) => post.citySlug).length} city-linked articles.`,
);