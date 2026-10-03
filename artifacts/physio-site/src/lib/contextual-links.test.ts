import assert from "node:assert/strict";
import test from "node:test";
import { blogPosts } from "./data";
import {
  getArticleServiceLink,
  getRelatedJournalPosts,
} from "./contextual-links";

test("related Journal links exclude the current article and stay capped", () => {
  const post = blogPosts.find((candidate) => candidate.slug === "stroke-rehabilitation-at-home");
  assert.ok(post);

  const related = getRelatedJournalPosts(post, blogPosts, 3);

  assert.equal(related.length, 3);
  assert.ok(related.every((candidate) => candidate.id !== post.id));
  assert.equal(new Set(related.map((candidate) => candidate.id)).size, related.length);
  assert.ok(related.some((candidate) => candidate.category === post.category));
});

test("article service links use the existing care routes", () => {
  const nutritionPost = blogPosts.find((post) => post.presentation === "nutrition-guidance");
  const kneePost = blogPosts.find(
    (post) => post.slug.includes("knee") && !post.slug.includes("osteoarthritis"),
  );

  assert.ok(nutritionPost);
  assert.ok(kneePost);
  assert.equal(getArticleServiceLink(nutritionPost).href, "/nutritionist-dietitian-online");
  assert.equal(getArticleServiceLink(kneePost).href, "/knee-pain");
});

test("selected Journal articles link directly to their matching service pages", () => {
  const mappings = [
    ["lumbar-slipped-disc-l3-l4-l4-l5-l5-s1", "/online-physiotherapy"],
    ["exercise-physiology-home-space-energy-jodhpur", "/exercise-physiologist"],
    ["neck-pain-cervical-stiffness-physiotherapy", "/neck-pain"],
    ["sciatica-physiotherapy-treatment-guide", "/sciatica"],
    ["knee-osteoarthritis-physiotherapy-guide", "/arthritis-osteoarthritis"],
    ["parkinsons-physiotherapy-guide", "/parkinsons-rehab"],
    ["diet-and-fat-loss", "/weight-management"],
  ] as const;

  for (const [slug, expectedHref] of mappings) {
    const post = blogPosts.find((candidate) => candidate.slug === slug);
    assert.ok(post, `expected authored Journal article "${slug}"`);
    assert.equal(getArticleServiceLink(post).href, expectedHref, `${slug} should link to ${expectedHref}`);
  }
});

test("city Journal articles expose a local and service pathway", () => {
  const post = blogPosts.find(
    (candidate) => candidate.slug === "hip-fracture-rehabilitation-home-bengaluru",
  );
  assert.ok(post);
  assert.equal((post as { citySlug?: string }).citySlug, "bengaluru");
  assert.equal(getArticleServiceLink(post).href, "/post-surgery-rehab");
});