import { test } from "node:test";
import assert from "node:assert/strict";
import { blogPosts } from "./data";
import { blogIndex, journalDiscoveryIndex } from "./blog-index";
import {
  getJournalGroup,
  getJournalGroupMatches,
  getNeutralJournalFallback,
  groupJournalPosts,
  searchJournalPosts,
} from "./journal-discovery";

test("retired generated city guides are absent from Journal discovery", () => {
  assert.equal(blogIndex.length, blogPosts.length);
  assert.equal(journalDiscoveryIndex.some((post) => post.id.startsWith("city-guide-")), false);
  assert.equal(journalDiscoveryIndex.filter((post) => post.category === "City Guide").length, 8);
  assert.ok(journalDiscoveryIndex.some((post) => post.slug === "physiotherapist-at-home-india-guide"));
});

test("every published article belongs to exactly one homepage Journal group", () => {
  for (const post of blogPosts) {
    assert.equal(getJournalGroupMatches(post).length, 1, post.slug);
    assert.ok(getJournalGroup(post).heading.length > 0, post.slug);
  }

  const groupedPosts = groupJournalPosts(blogPosts).flatMap((group) => group.posts);
  assert.equal(groupedPosts.length, blogPosts.length);
  assert.deepEqual(
    new Set(groupedPosts.map((post) => post.slug)),
    new Set(blogPosts.map((post) => post.slug)),
  );
  assert.ok(groupJournalPosts(blogPosts).every((group) => group.posts.length > 0));
});

test("Journal search matches title, category, excerpt, and full article content", () => {
  const titlePost = blogPosts.find((post) => post.slug === "stroke-rehabilitation-at-home")!;
  const categoryPost = blogPosts.find((post) => post.category === "Nutrition & Clinical Guidance")!;
  const excerptPost = blogPosts.find((post) => post.excerpt.split(/\s+/).length > 4)!;
  const contentPost = blogPosts.find((post) => post.content.toLowerCase().includes("cauda equina"))!;

  assert.ok(searchJournalPosts(blogPosts, "stroke recovery").some((post) => post.slug === titlePost.slug));
  assert.ok(searchJournalPosts(blogPosts, "nutrition clinical").some((post) => post.slug === categoryPost.slug));
  assert.ok(searchJournalPosts(blogPosts, excerptPost.excerpt.split(/\s+/).slice(0, 4).join(" ")).some((post) => post.slug === excerptPost.slug));
  assert.ok(searchJournalPosts(blogPosts, "cauda equina").some((post) => post.slug === contentPost.slug));
});

test("empty and no-result Journal searches are deterministic", () => {
  assert.equal(searchJournalPosts(blogPosts, "").length, blogPosts.length);
  assert.equal(searchJournalPosts(blogPosts, "   ").length, blogPosts.length);
  assert.deepEqual(searchJournalPosts(blogPosts, "term-that-does-not-exist"), []);
});

test("cities without curated local posts use the India-wide homecare guide", () => {
  assert.equal(getNeutralJournalFallback(blogPosts)?.slug, "physiotherapist-at-home-india-guide");
});