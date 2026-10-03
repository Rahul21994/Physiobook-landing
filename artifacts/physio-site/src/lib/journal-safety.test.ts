import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./data.js";

const unsafeClaims = [
  /\bsuperior option\b/i,
  /\bonly realistic (?:way|option)\b/i,
  /\bcompletely inadequate\b/i,
  /\bhighly effective\b/i,
  /\bexcellent (?:long-term )?outcomes?\b/i,
  /\bdramatically (?:improves?|reduces?|accelerates?)\b/i,
  /\bsignificantly (?:improves?|reduces?|accelerates?)\b/i,
  /\breduces? hospitali[sz]ation by\b/i,
  /\breduces? (?:cardiovascular )?mortality\b/i,
  /\bfull recovery\b/i,
  /\bmost effective\b/i,
  /\bresearch consistently\b/i,
  /\bevidence is clear\b/i,
  /\bstrongly recommended\b/i,
  /\bexactly what to expect\b/i,
  /\bguarante(?:e|ed|es)\b/i,
  /\bensures? recovery\b/i,
  /\bdetermines whether\b/i,
  /\bwhat conditions can be treated at home\b/i,
  /\bconditions (?:we )?treat at home\b/i,
  /\bresponds? to .* good outcomes\b/i,
  /\bmust begin within\b/i,
  /\bonly achievable through homecare\b/i,
];

test("published journal copy avoids absolute or unsupported outcome claims", () => {
  const findings: string[] = [];

  for (const post of blogPosts) {
    const publishedCopy = [post.title, post.excerpt, post.content].join("\n");

    for (const pattern of unsafeClaims) {
      const match = publishedCopy.match(pattern);
      if (match) {
        findings.push(`${post.slug}: "${match[0]}"`);
      }
    }
  }

  assert.deepEqual(
    findings,
    [],
    `Journal copy contains claims that need cautious, sourced wording:\n  ${findings.join("\n  ")}`,
  );
});

test("published journal titles and excerpts identify a service or clinical guidance domain", () => {
  const missingServiceLanguage = blogPosts
    .filter((post) => !/(physio|rehab|therapy|homecare|recovery|assessment|exercise|nutrition|diet|skin)/i.test(
      `${post.title} ${post.excerpt}`,
    ))
    .map((post) => post.slug);

  assert.deepEqual(
    missingServiceLanguage,
    [],
    `Journal titles and excerpts should identify a service or clinical guidance domain:\n  ${missingServiceLanguage.join("\n  ")}`,
  );
});

test("clinical journal articles include reputable further-reading sources", () => {
  const missingSources = blogPosts
    .filter((post) => post.category !== "City Guide" && (!post.sources || post.sources.length === 0))
    .map((post) => post.slug);

  assert.deepEqual(
    missingSources,
    [],
    `Clinical journal articles should include at least one further-reading source:\n  ${missingSources.join("\n  ")}`,
  );
});

test("journal source links use complete HTTPS URLs and identify their publisher", () => {
  const invalidSources = blogPosts.flatMap((post) =>
    (post.sources ?? [])
      .filter((source) => !source.url.startsWith("https://") || !source.title || !source.publisher)
      .map((source) => `${post.slug}: ${source.url}`),
  );

  assert.deepEqual(
    invalidSources,
    [],
    `Journal source links should include HTTPS URLs, titles, and publishers:\n  ${invalidSources.join("\n  ")}`,
  );
});

test("journal sources do not attribute an external page to the wrong publisher", () => {
  const rotatorCuffSource = blogPosts
    .find((post) => post.slug === "rotator-cuff-surgery-rehabilitation")
    ?.sources?.[0];

  assert.deepEqual(rotatorCuffSource, {
    title: "Anatomy, Rotator Cuff",
    publisher: "NCBI Bookshelf (StatPearls)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK441844/",
  });
});