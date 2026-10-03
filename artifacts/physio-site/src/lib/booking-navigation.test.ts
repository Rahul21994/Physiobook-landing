import assert from "node:assert/strict";
import { test } from "node:test";
import {
  consumePendingBookingContext,
  consumePendingBookingMode,
  setPendingBookingContext,
  setPendingBookingMode,
} from "./booking-navigation";

test("booking mode navigation state is consumed once", () => {
  setPendingBookingMode("telehealth");

  assert.equal(consumePendingBookingMode(), "telehealth");
  assert.equal(consumePendingBookingMode(), null);
});

test("the latest booking mode replaces a pending mode", () => {
  setPendingBookingMode("telehealth");
  setPendingBookingMode("home");

  assert.equal(consumePendingBookingMode(), "home");
  assert.equal(consumePendingBookingMode(), null);
});

test("booking navigation carries mode, city, and locality together", () => {
  setPendingBookingContext({
    mode: "home",
    citySlug: "jaipur",
    localityId: "vaishali-nagar",
  });

  assert.deepEqual(consumePendingBookingContext(), {
    mode: "home",
    citySlug: "jaipur",
    localityId: "vaishali-nagar",
  });
  assert.equal(consumePendingBookingContext(), null);
});