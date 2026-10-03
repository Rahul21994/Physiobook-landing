import assert from "node:assert/strict";
import { test } from "node:test";
import { pricing } from "@workspace/pricing";
import { cityJournalPosts } from "./city-journal";
import { resolveArticlePricing } from "./article-pricing";
import { blogPosts } from "./data";

test("Journal price markers resolve from the shared pricing configuration", () => {
  const source = [
    "{{price.homeVisit.introductory}}",
    "{{price.homeVisit.regular}}",
    "{{price.telehealth.introductory}}",
    "{{price.telehealth.regular}}",
  ].join(" | ");
  const expected = [
    pricing.homeVisit.amount,
    pricing.homeVisit.regularAmount,
    pricing.telehealth.amount,
    pricing.telehealth.regularAmount,
  ].join(" | ");

  assert.equal(resolveArticlePricing(source), expected);
});

test("unknown and malformed Journal price markers fail with post context", () => {
  assert.throws(
    () => resolveArticlePricing("{{price.homeVisit.future}}", "sample-article"),
    /Unknown Journal pricing marker.*sample-article/,
  );
  assert.throws(
    () => resolveArticlePricing("{{price.homeVisit.introductory", "sample-article"),
    /Unresolved or malformed Journal pricing marker.*sample-article/,
  );
});

test("the published Journal catalog has resolved current prices and no markers", () => {
  for (const post of blogPosts) {
    assert.doesNotMatch(post.content, /\{\{price\./, post.slug);
  }

  for (const cityPost of cityJournalPosts) {
    const publishedPost = blogPosts.find((post) => post.slug === cityPost.slug);
    assert.ok(publishedPost, `${cityPost.slug} must be in the published catalog`);
    assert.ok(
      publishedPost.content.includes(pricing.homeVisit.amount),
      `${cityPost.slug} must use the shared home-visit introductory price`,
    );
    assert.ok(
      publishedPost.content.includes(pricing.telehealth.amount),
      `${cityPost.slug} must use the shared online introductory price`,
    );
  }
});