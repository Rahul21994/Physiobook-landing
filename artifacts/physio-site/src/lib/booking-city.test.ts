import { test } from "node:test";
import assert from "node:assert/strict";
import {
  getBookingCitySlugFromLabel,
  getBookingCityFromSearch,
  getBookingLocalityFromSearch,
  getBookingModeFromSearch,
} from "./booking-city";
import { getCityLocalities } from "./city-localities";
import { cities } from "./cities";
import { appointmentTypes, telehealthAppointmentTypes } from "./data";
import {
  getBookingIndexContextFromSearch,
  getBookingPageCopy,
  getBookingVariantCatalog,
} from "./booking-index";

test("resolves review city labels to canonical booking slugs", () => {
  assert.equal(getBookingCitySlugFromLabel("Noida"), "noida");
  assert.equal(getBookingCitySlugFromLabel("Gurugram"), "gurgaon");
  assert.equal(getBookingCitySlugFromLabel("  jaipur  "), "jaipur");
  assert.equal(getBookingCitySlugFromLabel("Unknown City"), undefined);
});

test("resolves a known city slug from the booking query string", () => {
  assert.equal(getBookingCityFromSearch("?city=bengaluru"), "bengaluru");
});

test("normalizes a known city slug before selecting it", () => {
  assert.equal(getBookingCityFromSearch("?city=%20Jaipur%20"), "jaipur");
});

test("ignores missing and unknown city query parameters", () => {
  assert.equal(getBookingCityFromSearch(""), undefined);
  assert.equal(getBookingCityFromSearch("?city=not-a-city"), undefined);
});

test("resolves a locality only when it belongs to the selected city", () => {
  assert.equal(
    getBookingLocalityFromSearch("?city=delhi&locality=rohini", "delhi"),
    "Rohini",
  );
  assert.equal(
    getBookingLocalityFromSearch("?city=delhi&locality=mansarovar", "delhi"),
    undefined,
  );
});

test("ignores locality context without a known city or locality", () => {
  assert.equal(getBookingLocalityFromSearch("?locality=rohini", undefined), undefined);
  assert.equal(
    getBookingLocalityFromSearch("?city=unknown&locality=rohini", "unknown"),
    undefined,
  );
});

test("opens the booking page in telehealth mode only for the explicit mode query", () => {
  assert.equal(getBookingModeFromSearch("?city=jaipur&mode=telehealth"), "telehealth");
  assert.equal(getBookingModeFromSearch("?mode=TELEHEALTH"), "telehealth");
  assert.equal(getBookingModeFromSearch("?mode=home"), "home");
  assert.equal(getBookingModeFromSearch(""), "home");
});

test("booking index catalog covers every public city, locality, and online link once", () => {
  const variants = getBookingVariantCatalog();
  const querySet = new Set(variants.map((variant) => variant.query));
  const expectedCount = 1 + cities.length * 2 +
    cities.reduce((count, city) => count + getCityLocalities(city).length, 0);

  assert.equal(variants.length, expectedCount);
  assert.equal(querySet.size, variants.length);
  assert.ok(querySet.has("mode=telehealth"));

  for (const city of cities) {
    assert.ok(querySet.has(`city=${city.slug}`), `${city.name} should have a home-visit request URL`);
    assert.ok(
      querySet.has(`city=${city.slug}&mode=telehealth`),
      `${city.name} should have an online consultation URL`,
    );
    for (const locality of getCityLocalities(city)) {
      assert.ok(
        querySet.has(`city=${city.slug}&locality=${locality.id}`),
        `${locality.name}, ${city.name} should have a home-visit request URL`,
      );
    }
  }

  assert.equal(
    new Set(variants.map((variant) => variant.outDir)).size,
    variants.length,
    "each prerendered variant should have its own private output directory",
  );
  assert.equal(
    new Set(variants.map((variant) => variant.description)).size,
    variants.length,
    "each booking variant should have a distinct description",
  );
  for (const variant of variants) {
    assert.ok(variant.title.length <= 65, `${variant.query} title should fit the metadata limit`);
    const descriptionLength = Array.from(variant.description).length;
    assert.ok(
      descriptionLength >= 150 && descriptionLength <= 155,
      `${variant.query} description should be 150–155 code points; got ${descriptionLength}`,
    );
    assert.match(variant.description, /[.!?]$/u, `${variant.query} description should end cleanly`);
    assert.doesNotMatch(variant.description, /(?:…|\.{3})$/u, `${variant.query} description should not end with an ellipsis`);
    assert.equal(variant.path, `/booking?${variant.query}`);
  }
});

test("booking page context accepts only supported linked combinations", () => {
  const variants = getBookingVariantCatalog();
  const cityHome = variants.find(
    (variant) => variant.citySlug && variant.mode === "home" && !variant.localityId,
  );
  const localityHome = variants.find(
    (variant) => variant.citySlug && variant.mode === "home" && variant.localityId,
  );
  assert.ok(cityHome);
  assert.ok(localityHome);

  assert.deepEqual(
    getBookingIndexContextFromSearch(`?${cityHome.query}`),
    {
      query: cityHome.query,
      mode: "home",
      citySlug: cityHome.citySlug,
      cityName: cityHome.cityName,
      localityId: undefined,
      localityName: undefined,
    },
  );
  assert.deepEqual(
    getBookingIndexContextFromSearch(`?utm_source=test&${cityHome.query}`),
    getBookingIndexContextFromSearch(`?${cityHome.query}`),
  );
  assert.equal(
    getBookingIndexContextFromSearch("?mode=telehealth")?.mode,
    "telehealth",
  );
  assert.equal(
    getBookingIndexContextFromSearch(`?${localityHome.query}`)?.localityName,
    localityHome.localityName,
  );

  const otherCity = cities.find(
    (city) =>
      city.slug !== localityHome.citySlug &&
      !getCityLocalities(city).some((locality) => locality.id === localityHome.localityId),
  );
  assert.ok(otherCity);
  for (const invalidSearch of [
    "?city=not-a-city",
    `?city=${localityHome.citySlug}&locality=${localityHome.localityId}&mode=telehealth`,
    `?city=${otherCity.slug}&locality=${localityHome.localityId}`,
    `?city=${cityHome.citySlug}&mode=home`,
    `?city=${cityHome.citySlug}&unknown=value`,
    `?city=${cityHome.citySlug}&city=${otherCity.slug}`,
  ]) {
    assert.equal(
      getBookingIndexContextFromSearch(invalidSearch),
      undefined,
      `${invalidSearch} should not create an indexable booking context`,
    );
  }
});

test("maternal, infant, and pediatric request categories are available in both booking modes", () => {
  const newCategories = [
    "Antenatal/postpartum physiotherapy",
    "Pregnancy/postpartum nutrition support",
    "Pregnancy/postpartum exercise support",
    "Infant/pediatric physiotherapy enquiry",
    "Pediatric disability rehabilitation",
  ];
  for (const category of newCategories) {
    assert.ok(appointmentTypes.includes(category), `${category} should be available for home requests`);
    assert.ok(telehealthAppointmentTypes.includes(category), `${category} should be available for telehealth requests`);
  }
});

test("home-visit booking copy confirms availability after inquiry", () => {
  const copy = getBookingPageCopy({
    cityName: "Ahmedabad",
    localityName: "Navrangpura",
    mode: "home",
  });

  assert.match(copy.heading, /Navrangpura, Ahmedabad/);
  assert.match(copy.description, /Navrangpura, Ahmedabad/);
  assert.match(copy.introduction, /confirms local clinician availability before arranging a visit/);
  assert.match(copy.introduction, /Online consultations are available everywhere/);
  assert.doesNotMatch(copy.introduction, /guaranteed|available today|confirmed appointment/i);
});