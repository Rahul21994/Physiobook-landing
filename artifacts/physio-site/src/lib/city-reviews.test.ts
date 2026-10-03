import assert from "node:assert/strict";
import test from "node:test";
import { cityReviewSlugs, getCityReviews, getProviderTeamReviews } from "./city-reviews.js";

const targetCities = ["jaipur", "faridabad", "bengaluru", "gurgaon", "delhi"];

test("each requested city has three named review experiences", () => {
  for (const slug of targetCities) {
    const reviews = getCityReviews(slug);
    assert.equal(reviews.length, slug === "faridabad" ? 4 : 3, `${slug} should have the expected published reviews`);
    assert.ok(reviews.every((review) => review.status === "published"), `${slug} reviews should be published`);
    assert.ok(reviews.every((review) => review.name.trim()), `${slug} reviews need names`);
    assert.ok(reviews.every((review) => review.condition.trim()), `${slug} reviews need conditions`);
    assert.ok(reviews.every((review) => review.body.length >= 120), `${slug} reviews need meaningful copy`);
  }
});

test("Faridabad includes Preet's approved patient experience", () => {
  const reviews = getCityReviews("faridabad");
  const review = reviews.find((candidate) => candidate.name === "Preet");
  assert.ok(review);
  assert.equal(reviews.at(-1)?.name, "Preet");
  assert.equal(review?.condition, "Elbow and heel pain home physiotherapy");
  assert.match(review?.body ?? "", /right elbow/);
  assert.match(review?.body ?? "", /heel pain/);
});

test("city review names are unique across the requested pages", () => {
  const names = targetCities.flatMap((slug) => getCityReviews(slug).map((review) => review.name));
  assert.equal(new Set(names).size, names.length);
});

test("review data covers only the requested city pages", () => {
  assert.deepEqual(cityReviewSlugs.sort(), targetCities.sort());
});

test("provider-team experiences remain published but are not city-specific", () => {
  for (const slug of ["tigaon", "moradabad"]) {
    const reviews = getProviderTeamReviews(slug);
    assert.equal(reviews.length, 3, `${slug} should show three authentic provider-team experiences`);
    assert.ok(reviews.every((review) => review.status === "published"));
  }
});