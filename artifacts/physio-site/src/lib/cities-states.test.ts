import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cities,
  CityData,
  getAdministrativeAreaLabel,
  getConfirmationWindowText,
  getCitySeoMetadata,
  hasVerifiedHomecareCoverage,
  rehabilitationLabel,
} from "./cities.js";
import { getCityFaqs } from "./city-faqs.js";
import { getRenderedStateCopy, getStateFaqs } from "./state-faqs.js";
import {
  getCityServiceThemes,
  getLocationServiceSources,
  getStateServiceThemes,
} from "./location-services.js";
import { legacyServicePathRedirects, serviceGuideRootPaths } from "./service-guide-map.js";
import { getCitiesForState, getStateBySlug, getStateDisplayName, StateData, isStateIndexable, states } from "./states.js";

function getMissingCityMappings(cityFixture: readonly CityData[], stateFixture: readonly StateData[]) {
  const allStateSlugs = new Set(stateFixture.flatMap((state) => state.citySlugs));
  return cityFixture
    .filter((city) => !allStateSlugs.has(city.slug))
    .map((city) => `City "${city.name}" (${city.slug}) is not mapped to any state`);
}

function getOrphanedStateMappings(cityFixture: readonly CityData[], stateFixture: readonly StateData[]) {
  const allCitySlugs = new Set(cityFixture.map((city) => city.slug));
  const orphaned: string[] = [];
  for (const state of stateFixture) {
    for (const slug of state.citySlugs) {
      if (!allCitySlugs.has(slug)) {
        orphaned.push(`State "${state.name}" references unknown city slug "${slug}"`);
      }
    }
  }
  return orphaned;
}

function getDuplicateCityMappings(stateFixture: readonly StateData[]) {
  const slugStateNames: Record<string, string[]> = {};
  for (const state of stateFixture) {
    for (const slug of state.citySlugs) {
      if (!slugStateNames[slug]) slugStateNames[slug] = [];
      slugStateNames[slug].push(state.name);
    }
  }

  return Object.entries(slugStateNames)
    .filter(([, stateNames]) => stateNames.length > 1)
    .map(([slug, stateNames]) => `City slug "${slug}" is mapped to multiple states: ${stateNames.join(", ")}`);
}

const cityNameAliases: Record<string, string[]> = {
  gurgaon: ["Gurgaon", "Gurugram"],
  bengaluru: ["Bengaluru", "Bangalore"],
  mysuru: ["Mysuru", "Mysore"],
  mangaluru: ["Mangaluru", "Mangalore"],
  kozhikode: ["Kozhikode", "Calicut"],
  thiruvananthapuram: ["Thiruvananthapuram", "Trivandrum"],
  visakhapatnam: ["Visakhapatnam", "Vizag"],
  varanasi: ["Varanasi", "Banaras"],
};

function getCityNames(city: CityData) {
  return cityNameAliases[city.slug] ?? [city.name];
}

function normalizeCitySpecificText(city: CityData, text: string) {
  let normalized = text.toLowerCase();
  for (const name of [...getCityNames(city)].sort((left, right) => right.length - left.length)) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    normalized = normalized.replace(new RegExp(`\\b${escapedName}\\b`, "gi"), " ");
  }
  return normalized.replace(/[^a-z0-9]+/g, " ").trim();
}

function getCityStateMismatches(cityFixture: readonly CityData[], stateFixture: readonly StateData[]) {
  const slugToStateName: Record<string, string> = {};
  for (const state of stateFixture) {
    for (const slug of state.citySlugs) {
      slugToStateName[slug] = state.name;
    }
  }

  return cityFixture
    .filter((city) => slugToStateName[city.slug] && slugToStateName[city.slug].toLowerCase().trim() !== city.state.toLowerCase().trim())
    .map((city) => `City "${city.name}" (${city.slug}) declares state "${city.state}" but is mapped to "${slugToStateName[city.slug]}"`);
}

function getAdministrativeTypeMismatches(cityFixture: readonly CityData[], stateFixture: readonly StateData[]) {
  const slugToState: Record<string, StateData> = {};
  for (const state of stateFixture) {
    for (const slug of state.citySlugs) {
      slugToState[slug] = state;
    }
  }

  return cityFixture
    .filter((city) => {
      const state = slugToState[city.slug];
      return state && (city.administrativeType ?? "state") !== (state.administrativeType ?? "state");
    })
    .map((city) => {
      const state = slugToState[city.slug];
      return `City "${city.name}" (${city.slug}) has administrative type "${city.administrativeType ?? "state"}" but its hub uses "${state.administrativeType ?? "state"}"`;
    });
}

function getCityStateIntegrityErrors(cityFixture: readonly CityData[], stateFixture: readonly StateData[]) {
  return [
    ...getMissingCityMappings(cityFixture, stateFixture),
    ...getOrphanedStateMappings(cityFixture, stateFixture),
    ...getDuplicateCityMappings(stateFixture),
    ...getCityStateMismatches(cityFixture, stateFixture),
    ...getAdministrativeTypeMismatches(cityFixture, stateFixture),
  ];
}

function assertCityStateIntegrity(cityFixture: readonly CityData[], stateFixture: readonly StateData[]) {
  const errors = getCityStateIntegrityErrors(cityFixture, stateFixture);
  assert.deepEqual(errors, [], `City/state integrity check failed:\n  ${errors.join("\n  ")}`);
}

function cloneCityStateFixture() {
  return {
    cities: cities.map((city) => ({ ...city })),
    states: states.map((state) => ({ ...state, citySlugs: [...state.citySlugs] })),
  };
}

test("every city slug appears in at least one state's citySlugs", () => {
  const missing = getMissingCityMappings(cities, states);

  assert.deepEqual(
    missing,
    [],
    `The following cities are not mapped to any state: ${missing.join(", ")}`
  );
});

test("every slug in a state's citySlugs matches a real city", () => {
  const orphaned = getOrphanedStateMappings(cities, states);

  assert.deepEqual(
    orphaned,
    [],
    `The following state mappings have no matching city: ${orphaned.join(", ")}`
  );
});

test("every city slug appears in exactly one state (no duplicates)", () => {
  const duplicates = getDuplicateCityMappings(states);

  assert.deepEqual(
    duplicates,
    [],
    `City slugs mapped to more than one state (breadcrumb would resolve to wrong state):\n  ${duplicates.join("\n  ")}`
  );
});

test("state mapped in citySlugs matches the city's own state field", () => {
  const mismatches = getCityStateMismatches(cities, states);

  assert.deepEqual(
    mismatches,
    [],
    `City state field does not match its mapped state in states.ts:\n  ${mismatches.join("\n  ")}`
  );
});

test("Chandigarh and Delhi use their correct administrative models", () => {
  const chandigarh = cities.find((city) => city.slug === "chandigarh");
  const delhi = cities.find((city) => city.slug === "delhi");
  const chandigarhHub = getStateBySlug("chandigarh");
  const punjabHub = getStateBySlug("punjab");
  const delhiHub = getStateBySlug("delhi");

  assert.ok(chandigarh);
  assert.ok(delhi);
  assert.ok(chandigarhHub);
  assert.ok(punjabHub);
  assert.ok(delhiHub);

  assert.equal(chandigarh.state, "Chandigarh");
  assert.equal(chandigarh.administrativeType, "union-territory");
  assert.equal(chandigarhHub.administrativeType, "union-territory");
  assert.deepEqual(chandigarhHub.citySlugs, ["chandigarh"]);
  assert.ok(!punjabHub.citySlugs.includes("chandigarh"));
  assert.equal(
    getAdministrativeAreaLabel(chandigarh.state, chandigarh.administrativeType),
    "Chandigarh (Union Territory)",
  );
  assert.equal(getStateDisplayName(chandigarhHub), "Chandigarh (Union Territory)");

  assert.equal(delhi.state, "Delhi");
  assert.equal(delhi.administrativeType, "nct");
  assert.equal(delhiHub.administrativeType, "nct");
  assert.equal(getStateDisplayName(delhiHub), "Delhi (National Capital Territory)");
});

test("city and state pages publish unique, location-specific FAQ sets", () => {
  const cityFaqSignatures = new Set<string>();

  for (const city of cities) {
    const faqs = getCityFaqs(city);
    assert.ok(faqs.length >= 5, `${city.name} should publish at least five FAQs`);
    assert.equal(
      new Set(faqs.map((faq) => faq.q)).size,
      faqs.length,
      `${city.name} should not repeat an FAQ question`,
    );
    assert.equal(
      new Set(faqs.map((faq) => faq.a)).size,
      faqs.length,
      `${city.name} should not repeat an FAQ answer`,
    );
    assert.ok(
      faqs.every((faq) => faq.q.includes(city.name)),
      `${city.name} FAQ questions should identify the city`,
    );
    cityFaqSignatures.add(faqs.map((faq) => `${faq.q}|${faq.a}`).join("\n"));
  }

  assert.equal(
    cityFaqSignatures.size,
    cities.length,
    "Every city should have a distinct FAQ set",
  );

  const stateFaqSignatures = new Set<string>();
  for (const state of states) {
    const faqs = getStateFaqs(state);
    assert.ok(faqs.length >= 5, `${state.name} should publish at least five FAQs`);
    assert.equal(
      new Set(faqs.map((faq) => faq.q)).size,
      faqs.length,
      `${state.name} should not repeat an FAQ question`,
    );
    assert.equal(
      new Set(faqs.map((faq) => faq.a)).size,
      faqs.length,
      `${state.name} should not repeat an FAQ answer`,
    );
    assert.ok(
      faqs.every((faq) => faq.q.includes(state.name)),
      `${state.name} FAQ questions should identify the state`,
    );
    stateFaqSignatures.add(faqs.map((faq) => `${faq.q}|${faq.a}`).join("\n"));
  }

  assert.equal(
    stateFaqSignatures.size,
    states.length,
    "Every state should have a distinct FAQ set",
  );
});

test("city and state pages publish distinct evidence-informed service mixes", () => {
  const indexableCities = cities.filter((city) => city.indexable === true);
  const cityFingerprints = new Map<string, string[]>();

  for (const city of indexableCities) {
    const themes = getCityServiceThemes(city);
    assert.ok(themes.length >= 4, `${city.name} needs at least four local service themes`);
    assert.equal(
      new Set(themes.map((theme) => theme.id)).size,
      themes.length,
      `${city.name} should not repeat a service theme`,
    );
    assert.ok(
      themes.every((theme) =>
        serviceGuideRootPaths.includes(theme.href) ||
        (theme.href.startsWith("/services/") && !legacyServicePathRedirects[theme.href])
      ),
      `${city.name} service themes should use canonical roots or active distinct service guides`,
    );
    assert.ok(
      themes.every((theme) => theme.source.href.startsWith("https://")),
      `${city.name} service themes should cite a public research source`,
    );
    assert.ok(
      themes.every((theme) => !/\b(prevalence|most common|highest|maximum|majority)\b/i.test(theme.description)),
      `${city.name} service themes must not make unsupported prevalence claims`,
    );

    const fingerprint = themes.map((theme) => theme.id).join("|");
    cityFingerprints.set(fingerprint, [...(cityFingerprints.get(fingerprint) ?? []), city.slug]);
  }

  const duplicateCityMixes = [...cityFingerprints.values()].filter((slugs) => slugs.length > 1);
  assert.deepEqual(
    duplicateCityMixes,
    [],
    `Indexable city pages should not reuse the same service mix: ${duplicateCityMixes.map((slugs) => slugs.join(", ")).join("; ")}`,
  );

  const genericStateMix = [
    "homecare-physiotherapy",
    "neurological-rehabilitation",
    "cardiopulmonary-rehabilitation",
    "orthopaedic-rehabilitation",
    "complex-case-rehabilitation",
    "clinical-assessment",
  ].join("|");
  const stateFingerprints = new Map<string, string[]>();

  for (const state of states.filter(isStateIndexable)) {
    const stateThemes = getStateServiceThemes(state.name, getCitiesForState(state));
    assert.ok(stateThemes.length >= 4, `${state.name} needs at least four regional service themes`);
    assert.notEqual(
      stateThemes.map((theme) => theme.id).join("|"),
      genericStateMix,
      `${state.name} should not use the former generic state service mix`,
    );

    const cityThemeIds = new Set(
      getCitiesForState(state).flatMap((city) => getCityServiceThemes(city).map((theme) => theme.id)),
    );
    assert.ok(
      stateThemes.every((theme) => cityThemeIds.has(theme.id)),
      `${state.name} service themes should be represented by its city directory`,
    );

    const fingerprint = stateThemes.map((theme) => theme.id).join("|");
    stateFingerprints.set(fingerprint, [...(stateFingerprints.get(fingerprint) ?? []), state.slug]);
  }

  const duplicateStateMixes = [...stateFingerprints.values()].filter((slugs) => slugs.length > 1);
  assert.deepEqual(
    duplicateStateMixes,
    [],
    `State pages should not reuse the same service mix: ${duplicateStateMixes.map((slugs) => slugs.join(", ")).join("; ")}`,
  );
});

test("location service source inventory is deduplicated and preserves affected themes", () => {
  const sources = getLocationServiceSources();
  const allCityThemeIds = new Set(
    cities.flatMap((city) => getCityServiceThemes(city).map((theme) => theme.id)),
  );

  assert.ok(sources.length > 0, "Location service sources should not be empty");
  assert.equal(
    new Set(sources.map((source) => source.href)).size,
    sources.length,
    "Each location service URL should be checked once",
  );
  assert.ok(
    sources.every(
      (source) =>
        source.title &&
        source.href.startsWith("https://") &&
        source.themeIds.length > 0 &&
        source.themeTitles.length === source.themeIds.length,
    ),
    "Every location source should identify its affected themes",
  );
  assert.ok(
    [...allCityThemeIds].every((themeId) =>
      sources.some((source) => source.themeIds.includes(themeId)),
    ),
    "Every city service theme should have a source inventory entry",
  );
});

test("broken city/state fixtures fail before prerendering and name the affected city", () => {
  const missingCityFixture = cloneCityStateFixture();
  const rajasthan = missingCityFixture.states.find((state) => state.slug === "rajasthan");
  assert.ok(rajasthan);
  rajasthan.citySlugs = rajasthan.citySlugs.filter((slug) => slug !== "jaipur");

  let prerenderReached = false;
  let missingCityFailureMessage = "";
  assert.throws(
    () => {
      assertCityStateIntegrity(missingCityFixture.cities, missingCityFixture.states);
      prerenderReached = true;
    },
    (error) => {
      missingCityFailureMessage = error instanceof Error ? error.message : String(error);
      return true;
    },
  );

  assert.equal(prerenderReached, false, "Prerendering must not continue after an integrity failure");
  assert.match(
    missingCityFailureMessage,
    /City "Jaipur" \(jaipur\) is not mapped to any state/,
    "The unmapped city should be named in the integrity failure",
  );

  const mismatchedCityFixture = cloneCityStateFixture();
  const mismatchedCity = mismatchedCityFixture.cities.find((city) => city.slug === "jaipur");
  assert.ok(mismatchedCity);
  mismatchedCity.state = "Haryana";

  let mismatchedCityFailureMessage = "";
  assert.throws(
    () => {
      assertCityStateIntegrity(mismatchedCityFixture.cities, mismatchedCityFixture.states);
    },
    (error) => {
      mismatchedCityFailureMessage = error instanceof Error ? error.message : String(error);
      return true;
    },
  );

  assert.match(
    mismatchedCityFailureMessage,
    /City "Jaipur" \(jaipur\) declares state "Haryana" but is mapped to "Rajasthan"/,
    "The mismatched city should be named in the integrity failure",
  );
});

test("indexable state hubs have curated, distinct profile content", () => {
  const indexableStates = states.filter(isStateIndexable);
  const profileFields = [
    "intro",
    "coverageNote",
    "careFocus",
    "bookingNote",
    "faq",
  ] as const;

  for (const field of profileFields) {
    const values = indexableStates.map((state) => {
      const profile = state.profile;
      return field === "faq" ? profile?.faq.q : profile?.[field];
    });
    assert.equal(
      values.filter(Boolean).length,
      indexableStates.length,
      `Every indexable state needs a ${field} profile field`,
    );
    assert.equal(
      new Set(values).size,
      indexableStates.length,
      `Indexable state ${field} content must be distinct`,
    );
  }

  for (const state of indexableStates) {
    const resources = state.profile?.localResources ?? [];
    assert.ok(resources.length >= 2, `${state.name} needs at least two local pathways`);
    assert.ok(
      resources.every((resource) => resource.href.startsWith("/")),
      `${state.name} resources should use internal links`,
    );
  }
});

test("all state hubs remain indexable with curated pathways", () => {
  const actualIndexableSlugs = states
    .filter(isStateIndexable)
    .map((state) => state.slug)
    .sort();

  assert.deepEqual(actualIndexableSlugs, states.map((state) => state.slug).sort());
});

test("every city condition is named as a physiotherapy or rehabilitation service", () => {
  const bareLabels = cities.flatMap((city) =>
    city.conditions
      .filter((condition) => !/(rehabilitation|physiotherapy)/i.test(rehabilitationLabel(condition)))
      .map((condition) => `${city.name}: ${condition}`),
  );

  assert.deepEqual(
    bareLabels,
    [],
    `City condition labels must describe the physiotherapy service provided:\n  ${bareLabels.join("\n  ")}`,
  );
});

test("home-visit coverage is explicit and separate from indexability", () => {
  const activeHomecareSlugs = cities
    .filter(hasVerifiedHomecareCoverage)
    .map((city) => city.slug)
    .sort();

  assert.equal(cities.length, 45, "all authored city routes remain in the catalog");
  assert.deepEqual(activeHomecareSlugs, cities.map((city) => city.slug).sort());
  assert.ok(cities.every((city) => city.indexable === true), "coverage changes must not alter indexability");
});

test("confirmation windows distinguish online consultations from home visits", () => {
  assert.equal(getConfirmationWindowText("jaipur"), "within 12 hours");
  assert.equal(getConfirmationWindowText("hyderabad"), "within 24 hours");
  assert.equal(
    getConfirmationWindowText("hyderabad", "telehealth"),
    "the same day, usually within 6 hours and no later than 12 hours",
  );
});

test("rendered state copy uses active city-level coverage safeguards", () => {
  for (const state of states) {
    const renderedFaqs = getStateFaqs(state);
    for (const faq of renderedFaqs) {
      assert.match(faq.a, /home visits are available at city level/i, `${state.slug} FAQ coverage`);
      assert.match(faq.a, /exact locality and clinician availability are confirmed before booking/i, `${state.slug} FAQ confirmation`);
      assert.doesNotMatch(faq.a, /expansion(?:-stage)?\s+(?:enquiry|context|pathway|rollout)|reviewed city by city/i, `${state.slug} FAQ should not expose dormant expansion copy`);
    }
    assert.match(
      getRenderedStateCopy(state.profile?.bookingNote ?? "Choose a city and share the locality.", state.name),
      /exact locality and clinician availability are confirmed before booking/i,
    );
  }
});

test("city availability copy retains locality and clinician confirmation", () => {
  for (const city of cities) {
    const faqs = getCityFaqs(city);
    assert.ok(
      faqs.some((faq) => /exact locality and clinician availability/i.test(faq.a)),
      `${city.slug} FAQs must require exact locality and clinician confirmation`,
    );
  }
});

test("all authored city pages have distinct, keyword-relevant metadata and headings", () => {
  assert.equal(cities.length, 45, "all authored city routes remain in the catalog");

  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const normalizedHeadings = new Set<string>();

  for (const city of cities) {
    const metadata = getCitySeoMetadata(city);
    const heading = city.heroHeading ?? "";
    const names = getCityNames(city);
    const cityNamePattern = new RegExp(
      names.map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"),
      "i",
    );

    assert.ok(heading, `${city.slug} needs a city-specific H1`);
    assert.match(heading, /physiotherap(?:y|ist)/i, `${city.slug} H1 should name the service`);
    assert.match(metadata.title, /physiotherap(?:y|ist)/i, `${city.slug} title should name the service`);
    assert.match(heading, cityNamePattern, `${city.slug} H1 should name the city`);
    assert.match(metadata.title, cityNamePattern, `${city.slug} title should name the city`);
    assert.ok(metadata.title.length >= 45 && metadata.title.length <= 65, `${city.slug} title length`);
    assert.ok(metadata.description.length >= 130 && metadata.description.length <= 170, `${city.slug} description length`);
    assert.ok(cityNamePattern.test(metadata.description), `${city.slug} description should name the city`);
     assert.match(metadata.description, /Home visits/i, `${city.slug} description should state home-visit coverage`);
    assert.ok(!titles.has(metadata.title), `${city.slug} title should be unique`);
    assert.ok(!descriptions.has(metadata.description), `${city.slug} description should be unique`);

    const normalizedHeading = normalizeCitySpecificText(city, heading);
    assert.ok(normalizedHeading, `${city.slug} heading should retain a care angle after removing its city`);
    assert.ok(
      !normalizedHeadings.has(normalizedHeading),
      `${city.slug} heading should be more than a city-name swap`,
    );
    titles.add(metadata.title);
    descriptions.add(metadata.description);
    normalizedHeadings.add(normalizedHeading);
  }
});

test("all listed cities render active coverage rather than expansion placement copy", () => {
  for (const city of cities) {
    assert.equal(hasVerifiedHomecareCoverage(city), true, `${city.slug} city-level homecare`);
    const faqs = getCityFaqs(city);
    assert.ok(!faqs.some((faq) => /future team placement/i.test(faq.a)), `${city.slug} must not render placement-only FAQs`);
    assert.ok(faqs.some((faq) => /locality reference/i.test(faq.a)), `${city.slug} must retain locality safeguards`);
  }
});
