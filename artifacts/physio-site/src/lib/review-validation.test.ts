import assert from "node:assert/strict";
import test from "node:test";
import {
  countReviewCharacters,
  countReviewWords,
  getReviewLimitError,
  MAX_REVIEW_CHARACTERS,
  MAX_REVIEW_WORDS,
} from "./review-validation";

test("counts review words across repeated whitespace", () => {
  assert.equal(countReviewWords("  Useful   review\nwith five words  "), 5);
  assert.equal(countReviewWords(""), 0);
});

test("counts characters with and without whitespace", () => {
  assert.equal(countReviewCharacters("one two\n"), 8);
  assert.equal(countReviewCharacters("one two\n", false), 6);
});

test("allows exactly 1000 words and identifies the first over-limit word", () => {
  const thousandWords = Array.from({ length: MAX_REVIEW_WORDS }, () => "a").join(" ");
  const thousandOneWords = `${thousandWords} a`;

  assert.equal(countReviewWords(thousandWords), MAX_REVIEW_WORDS);
  assert.equal(countReviewWords(thousandOneWords), MAX_REVIEW_WORDS + 1);
  assert.equal(getReviewLimitError(thousandWords), null);
  assert.match(getReviewLimitError(thousandOneWords) ?? "", /1000 words/);
});

test("rejects reviews over the 4000-character limit", () => {
  const withSpaces = "a ".repeat(MAX_REVIEW_CHARACTERS / 2 + 1);
  const overCharacters = "a".repeat(MAX_REVIEW_CHARACTERS + 1);

  assert.match(getReviewLimitError(overCharacters) ?? "", /including spaces/);
  assert.equal(countReviewCharacters(withSpaces, false), MAX_REVIEW_CHARACTERS / 2 + 1);
});