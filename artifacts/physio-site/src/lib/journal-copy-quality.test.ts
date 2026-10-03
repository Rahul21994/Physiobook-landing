import assert from "node:assert/strict";
import test from "node:test";
import { BUSINESS_CONFIG } from "../config/business.js";
import { blogPosts } from "./data.js";

test("Journal copy uses correctly paired double quotation marks", () => {
  const unbalancedQuotes = blogPosts.flatMap((post) => {
    const openingCurlyQuotes = (post.content.match(/“/g) ?? []).length;
    const closingCurlyQuotes = (post.content.match(/”/g) ?? []).length;
    const straightQuotes = (post.content.match(/"/g) ?? []).length;

    return openingCurlyQuotes !== closingCurlyQuotes || straightQuotes % 2 !== 0
      ? [post.slug]
      : [];
  });

  assert.deepEqual(unbalancedQuotes, []);
});

test("Journal copy does not expose an unconfigured WhatsApp contact channel", () => {
  if (BUSINESS_CONFIG.contact.whatsapp.trim()) return;

  const articlesMentioningWhatsApp = blogPosts
    .filter((post) => /\bWhatsApp\b/i.test(post.content))
    .map((post) => post.slug);

  assert.deepEqual(articlesMentioningWhatsApp, []);
});

test("city address copy uses the correct indefinite article", () => {
  const mismatches = blogPosts.flatMap((post) =>
    [...post.content.matchAll(/\b(A|An)\s+([A-Z][A-Za-z-]*) address\b/g)]
      .filter(([, article, place]) => {
        const expectedArticle = /^[aeiou]/i.test(place) ? "An" : "A";
        return article !== expectedArticle;
      })
      .map(([, article, place]) => `${post.slug}: ${article} ${place} address`),
  );

  assert.deepEqual(mismatches, []);
});