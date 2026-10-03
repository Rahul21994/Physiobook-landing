import assert from "node:assert/strict";
import test from "node:test";
import {
  filterPublishedReviews,
  getPublishedReviewCatalogue,
  getPublishedReviewFilterOptions,
} from "./review-catalog.js";

test("builds one catalogue entry for each static experience", () => {
  const reviews = getPublishedReviewCatalogue();

  assert.equal(
    reviews.filter((review) => review.name === "Hemant Choudhary").length,
    1,
    "Hemant should not be repeated between the featured and catalogue sources",
  );
  assert.equal(
    reviews.filter((review) => review.name === "Preet").length,
    1,
    "Preet's homepage and Faridabad copies should be deduplicated",
  );

  const jaipurReview = reviews.find((review) => review.name === "Kavita Parmar");
  assert.deepEqual(
    { city: jaipurReview?.city, state: jaipurReview?.state },
    { city: "Jaipur", state: "Rajasthan" },
  );
  assert.ok(reviews.length >= 20, "The catalogue should include homepage and city experiences");
});

test("appends an approved submission and resolves a known city state", () => {
  const reviews = getPublishedReviewCatalogue([
    {
      id: 901,
      name: "New Patient",
      city: "Jaipur",
      rating: 4,
      body: "A new approved patient experience that is long enough to be displayed in the public catalogue.",
      createdAt: "2026-09-20T10:00:00.000Z",
    },
    {
      id: 902,
      name: "Hemant Choudhary",
      city: "Tigaon, Haryana",
      rating: 5,
      body: "After a major road accident and surgery, I struggled to walk on both legs. With consistent post-surgery physiotherapy and rehabilitation, I gradually rebuilt my strength, balance, and confidence. I have now returned to normal daily movement and am deeply grateful to the team for their patient, focused care throughout my recovery.",
      createdAt: "2026-09-20T10:00:00.000Z",
    },
  ]);

  const newReview = reviews.find((review) => review.name === "New Patient");
  assert.deepEqual(
    { city: newReview?.city, state: newReview?.state, source: newReview?.source },
    { city: "Jaipur", state: "Rajasthan", source: "submitted" },
  );
  assert.equal(
    reviews.filter((review) => review.name === "Hemant Choudhary").length,
    1,
    "An approved copy of a static review must not be appended twice",
  );
});

test("derives exact city and care-need filters from the published catalogue", () => {
  const reviews = getPublishedReviewCatalogue();
  const options = getPublishedReviewFilterOptions(reviews);

  assert.ok(options.cities.includes("Jaipur"));
  assert.ok(options.careNeeds.includes("Post-Knee Replacement Rehabilitation"));

  const jaipurReviews = filterPublishedReviews(reviews, { city: "jaipur", careNeed: "" });
  assert.ok(jaipurReviews.length > 0);
  assert.equal(jaipurReviews.every((review) => review.city === "Jaipur"), true);

  const kneeReviews = filterPublishedReviews(reviews, {
    city: "",
    careNeed: "post-knee replacement rehabilitation",
  });
  assert.ok(kneeReviews.length > 0);
  assert.equal(
    kneeReviews.every((review) =>
      review.condition?.toLocaleLowerCase().includes("knee replacement"),
    ),
    true,
  );
});

test("filtering includes an approved review after it is appended to the catalogue", () => {
  const reviews = getPublishedReviewCatalogue([
    {
      id: 903,
      name: "Noida Patient",
      city: "Noida",
      rating: 4,
      body: "An approved review with a unique locality for filter coverage.",
      createdAt: "2026-09-20T10:00:00.000Z",
    },
  ]);

  const noidaReviews = filterPublishedReviews(reviews, { city: "Noida", careNeed: "" });
  assert.deepEqual(noidaReviews.map((review) => review.name), ["Noida Patient"]);
});