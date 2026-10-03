import assert from "node:assert/strict";
import test from "node:test";
import { getCityBySlug } from "./cities.js";
import { getCityLocalities } from "./city-localities.js";

const targetCities = ["jaipur", "faridabad", "bengaluru", "gurgaon", "delhi", "tigaon", "moradabad"];

test("target city localities are individual, anchored, and non-empty", () => {
  for (const slug of targetCities) {
    const city = getCityBySlug(slug);
    assert.ok(city, `${slug} should exist`);

    const localities = getCityLocalities(city);
    assert.ok(localities.length >= 3, `${slug} should have at least three localities`);
    assert.equal(
      new Set(localities.map((locality) => locality.id)).size,
      localities.length,
      `${slug} locality IDs should be unique`,
    );
    assert.ok(
      localities.every(({ id, description }) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) && description.trim()),
      `${slug} locality anchors and copy should be usable`,
    );
  }
});

test("locality anchors preserve recognizable location names", () => {
  const gurgaon = getCityBySlug("gurgaon");
  assert.ok(gurgaon);
  assert.deepEqual(
    getCityLocalities(gurgaon).slice(0, 3).map((locality) => locality.id),
    ["dlf", "sohna-road", "golf-course-road"],
  );
});