import assert from "node:assert/strict";
import test from "node:test";
import { filterDuplicateApprovedReviews } from "./review-deduplication.js";

const preetSeed = {
  name: "Preet",
  city: "Faridabad",
  body: "A verified patient experience with consistent formatting.",
};

test("removes an approved copy when its review text matches a seeded review", () => {
  const result = filterDuplicateApprovedReviews([preetSeed], [
    { ...preetSeed, id: 1 },
    { name: "Another patient", city: "Delhi", body: "A different experience.", id: 2 },
  ]);

  assert.deepEqual(result.map((review) => review.id), [2]);
});

test("removes Preet's legacy Home physiotherapy copy despite formatting differences", () => {
  const result = filterDuplicateApprovedReviews([preetSeed], [
    {
      name: "preet",
      city: "Home physiotherapy",
      body: "A differently formatted copy of the same approved experience.",
      id: 7,
    },
  ]);

  assert.equal(result.length, 0);
});

test("keeps a different patient's review even when the name is reused", () => {
  const result = filterDuplicateApprovedReviews([preetSeed], [
    {
      name: "Preet",
      city: "Mumbai",
      body: "A separate patient experience.",
      id: 8,
    },
  ]);

  assert.equal(result.length, 1);
});