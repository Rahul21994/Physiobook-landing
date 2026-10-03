import { test } from "node:test";
import assert from "node:assert/strict";
import { pricing } from "@workspace/pricing";
import { cityJournalPosts, getCityJournalPosts } from "./city-journal.js";
import {
  blogPosts,
  getBlogCatalogValidationErrors,
  getBlogSlugParityErrors,
} from "./data.js";
import {
  cities,
  getCityIndexabilityValidationErrors,
  getIndexableCitySlugs,
} from "./cities.js";
import { stateJournalIndex } from "./state-journal-index.js";
import { states } from "./states.js";

const targetCities = [
  "faridabad",
  "gurgaon",
  "jaipur",
  "delhi",
  "bengaluru",
  "tigaon",
  "moradabad",
  "chandigarh",
  "ahmedabad",
  "lucknow",
  "mumbai",
  "pune",
  "hyderabad",
  "noida",
  "amritsar",
  "ludhiana",
  "kochi",
  "thiruvananthapuram",
  "kozhikode",
  "visakhapatnam",
  "nagpur",
  "vadodara",
  "kanpur",
  "varanasi",
  "bhopal",
  "agra",
  "prayagraj",
  "jodhpur",
  "udaipur",
  "surat",
  "indore",
  "patna",
  "ranchi",
  "bhubaneswar",
];

test("all authored city pages are eligible for search visibility", () => {
  assert.deepEqual(
    getIndexableCitySlugs(cities).sort(),
    cities.map((city) => city.slug).sort(),
  );
  assert.deepEqual(getCityIndexabilityValidationErrors(cities), []);
  assert.equal(cities.filter((city) => city.indexable !== true).length, 0);
});

test("city Journal contains 139 distinct posts", () => {
  assert.equal(cityJournalPosts.length, 139);
  assert.equal(new Set(cityJournalPosts.map((post) => post.id)).size, 139);
  assert.equal(new Set(cityJournalPosts.map((post) => post.slug)).size, 139);
  assert.equal(new Set(cityJournalPosts.map((post) => post.title)).size, 139);
});

test("each target city has at least three editorially ordered posts", () => {
  for (const citySlug of targetCities) {
    const posts = getCityJournalPosts(citySlug);
    assert.ok(posts.length >= 3, citySlug);
    assert.ok(posts.every((post) => post.citySlug === citySlug));
  }
});

test("the first expansion batch has one article for each discipline per city", () => {
  for (const citySlug of ["chandigarh", "ahmedabad", "lucknow"]) {
    const disciplines = getCityJournalPosts(citySlug)
      .slice(0, 3)
      .map((post) => post.discipline);
    assert.deepEqual(disciplines, ["physiotherapy", "nutrition", "exercise-physiology"]);
  }
});

test("the first expansion batch is curated on its matching state pages", () => {
  for (const citySlug of ["chandigarh", "ahmedabad", "lucknow"]) {
    const city = cities.find((candidate) => candidate.slug === citySlug);
    assert.ok(city);
    const state = states.find((candidate) => candidate.citySlugs.includes(citySlug));
    assert.ok(state);
    const posts = stateJournalIndex
      .filter((post) => post.citySlug === citySlug)
      .slice(0, 3);

    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => state.citySlugs.includes(post.citySlug)), citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the second expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["mumbai", "pune", "hyderabad"]) {
    const posts = getCityJournalPosts(citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the second expansion batch is curated on its matching state pages", () => {
  for (const citySlug of ["mumbai", "pune", "hyderabad"]) {
    const city = cities.find((candidate) => candidate.slug === citySlug);
    assert.ok(city);
    const state = states.find((candidate) => candidate.citySlugs.includes(citySlug));
    assert.ok(state);
    const posts = stateJournalIndex.filter((post) => post.citySlug === citySlug);

    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => state.citySlugs.includes(post.citySlug)), citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the second expansion batch does not repeat an existing Journal title or slug", () => {
  const batch2Posts = cityJournalPosts.filter((post) =>
    ["mumbai", "pune", "hyderabad"].includes(post.citySlug),
  );
  assert.equal(new Set(batch2Posts.map((post) => post.title)).size, batch2Posts.length);
  assert.equal(new Set(batch2Posts.map((post) => post.slug)).size, batch2Posts.length);
  assert.equal(
    batch2Posts.filter((post) =>
      blogPosts.some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the third expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["noida", "amritsar", "ludhiana", "kochi"]) {
    const posts = getCityJournalPosts(citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the third expansion batch is curated on its matching state pages", () => {
  for (const citySlug of ["noida", "amritsar", "ludhiana", "kochi"]) {
    const city = cities.find((candidate) => candidate.slug === citySlug);
    assert.ok(city);
    const state = states.find((candidate) => candidate.citySlugs.includes(citySlug));
    assert.ok(state);
    const posts = stateJournalIndex.filter((post) => post.citySlug === citySlug);

    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => state.citySlugs.includes(post.citySlug)), citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the third expansion batch does not repeat an existing Journal title or slug", () => {
  const batch3Posts = cityJournalPosts.filter((post) =>
    ["noida", "amritsar", "ludhiana", "kochi"].includes(post.citySlug),
  );
  assert.equal(new Set(batch3Posts.map((post) => post.title)).size, batch3Posts.length);
  assert.equal(new Set(batch3Posts.map((post) => post.slug)).size, batch3Posts.length);
  assert.equal(
    batch3Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the fourth expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["thiruvananthapuram", "kozhikode", "visakhapatnam", "nagpur"]) {
    const posts = getCityJournalPosts(citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the fourth expansion batch does not repeat an existing Journal title or slug", () => {
  const batch4Posts = cityJournalPosts.filter((post) =>
    ["thiruvananthapuram", "kozhikode", "visakhapatnam", "nagpur"].includes(post.citySlug),
  );
  assert.equal(new Set(batch4Posts.map((post) => post.title)).size, batch4Posts.length);
  assert.equal(new Set(batch4Posts.map((post) => post.slug)).size, batch4Posts.length);
  assert.equal(
    batch4Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the fifth expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["guwahati", "kolkata", "chennai", "coimbatore"]) {
    const posts = getCityJournalPosts(citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the fifth expansion batch does not repeat an existing Journal title or slug", () => {
  const batch5Posts = cityJournalPosts.filter((post) =>
    ["guwahati", "kolkata", "chennai", "coimbatore"].includes(post.citySlug),
  );
  assert.equal(new Set(batch5Posts.map((post) => post.title)).size, batch5Posts.length);
  assert.equal(new Set(batch5Posts.map((post) => post.slug)).size, batch5Posts.length);
  assert.equal(
    batch5Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the fifth expansion batch keeps city profile references aligned", () => {
  const kolkataPost = cityJournalPosts.find(
    (post) => post.slug === "bed-to-bathroom-sequencing-cardiac-thoracic-surgery-kolkata",
  );
  const chennaiPost = cityJournalPosts.find(
    (post) => post.slug === "stroke-telerehabilitation-caregiver-coaching-chennai",
  );
  const nutritionPost = cityJournalPosts.find(
    (post) => post.slug === "preoperative-nutrition-screening-knee-replacement-chennai",
  );

  assert.ok(kolkataPost);
  assert.ok(chennaiPost);
  assert.ok(nutritionPost);
  assert.ok(kolkataPost.sources?.some((source) => source.url.includes("kolkatacollectorate.wb.gov.in")));
  assert.equal(kolkataPost.sources?.some((source) => source.url.includes("chennai.nic.in")), false);
  assert.ok(chennaiPost.sources?.some((source) => source.url.includes("chennai.nic.in")));
  assert.ok(
    nutritionPost.sources?.some((source) =>
      source.url === "https://www.espen.org/files/ESPEN-guideline-on-clinical-nutrition-in-surgery-Update-2025.pdf",
    ),
  );
});

test("the sixth expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["madurai", "mysuru", "mangaluru", "surat"]) {
    const posts = getCityJournalPosts(citySlug).slice(0, 3);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the sixth expansion batch does not repeat an existing Journal title or slug", () => {
  const batch6Posts = cityJournalPosts.filter((post) =>
    ["madurai", "mysuru", "mangaluru", "surat"].includes(post.citySlug),
  );
  assert.equal(new Set(batch6Posts.map((post) => post.title)).size, batch6Posts.length);
  assert.equal(new Set(batch6Posts.map((post) => post.slug)).size, batch6Posts.length);
  assert.equal(
    batch6Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the sixth expansion batch keeps city profile references aligned", () => {
  const expectedProfileHosts = {
    madurai: "madurai.nic.in",
    mysuru: "mysore.nic.in",
    mangaluru: "dk.nic.in",
    surat: "surat.nic.in",
  };

  for (const [citySlug, profileHost] of Object.entries(expectedProfileHosts)) {
    const posts = getCityJournalPosts(citySlug).slice(0, 3);
    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => post.sources?.some((source) => source.url.includes(profileHost))), citySlug);
    assert.ok(
      posts.every((post) => !post.sources?.some((source) =>
        Object.values(expectedProfileHosts)
          .filter((host) => host !== profileHost)
          .some((host) => source.url.includes(host)),
      )),
      citySlug,
    );
  }
});

test("the seventh expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["vadodara", "kanpur", "varanasi", "bhopal"]) {
    const posts = getCityJournalPosts(citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the seventh expansion batch does not repeat an existing Journal title or slug", () => {
  const batch7Posts = cityJournalPosts.filter((post) =>
    ["vadodara", "kanpur", "varanasi", "bhopal"].includes(post.citySlug),
  );
  assert.equal(new Set(batch7Posts.map((post) => post.title)).size, batch7Posts.length);
  assert.equal(new Set(batch7Posts.map((post) => post.slug)).size, batch7Posts.length);
  assert.equal(
    batch7Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the seventh expansion batch keeps city profile references aligned", () => {
  const expectedProfileHosts = {
    vadodara: "vadodara.nic.in",
    kanpur: "kanpurnagar.nic.in",
    varanasi: "varanasi.nic.in",
    bhopal: "bhopal.nic.in",
  };

  for (const [citySlug, profileHost] of Object.entries(expectedProfileHosts)) {
    const posts = cityJournalPosts.filter((post) => post.citySlug === citySlug);
    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => post.sources?.some((source) => source.url.includes(profileHost))), citySlug);
    assert.ok(
      posts.every((post) => !post.sources?.some((source) =>
        Object.values(expectedProfileHosts)
          .filter((host) => host !== profileHost)
          .some((host) => source.url.includes(host)),
      )),
      citySlug,
    );
  }
});

test("the eighth expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["agra", "prayagraj", "jodhpur", "udaipur"]) {
    const posts = getCityJournalPosts(citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the eighth expansion batch does not repeat an existing Journal title or slug", () => {
  const batch8Posts = cityJournalPosts.filter((post) =>
    ["agra", "prayagraj", "jodhpur", "udaipur"].includes(post.citySlug),
  );
  assert.equal(new Set(batch8Posts.map((post) => post.title)).size, batch8Posts.length);
  assert.equal(new Set(batch8Posts.map((post) => post.slug)).size, batch8Posts.length);
  assert.equal(
    batch8Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
});

test("the eighth expansion batch keeps city profile references aligned", () => {
  const expectedProfileHosts = {
    agra: "agra.nic.in",
    prayagraj: "prayagraj.nic.in",
    jodhpur: "jodhpur.rajasthan.gov.in",
    udaipur: "udaipur.rajasthan.gov.in",
  };

  for (const [citySlug, profileHost] of Object.entries(expectedProfileHosts)) {
    const posts = cityJournalPosts.filter((post) => post.citySlug === citySlug);
    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => post.sources?.some((source) => source.url.includes(profileHost))), citySlug);
    assert.ok(
      posts.every((post) => !post.sources?.some((source) =>
        Object.values(expectedProfileHosts)
          .filter((host) => host !== profileHost)
          .some((host) => source.url.includes(host)),
      )),
      citySlug,
    );
  }
});

test("the ninth expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["ahmedabad", "lucknow", "chandigarh", "surat"]) {
    const posts = getCityJournalPosts(citySlug).slice(-3);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the ninth expansion batch does not repeat titles, slugs, or article bodies", () => {
  const batch9Posts = ["ahmedabad", "lucknow", "chandigarh", "surat"].flatMap((citySlug) =>
    getCityJournalPosts(citySlug).slice(-3),
  );
  assert.equal(new Set(batch9Posts.map((post) => post.title)).size, batch9Posts.length);
  assert.equal(new Set(batch9Posts.map((post) => post.slug)).size, batch9Posts.length);
  assert.equal(
    batch9Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
  const cityNeutralBodies = batch9Posts.map((post) =>
    post.content
      .replace(/\b(?:ahmedabad|lucknow|chandigarh|surat)\b/gi, "city")
      .replace(/\s+/g, " ")
      .trim(),
  );
  assert.equal(new Set(cityNeutralBodies).size, batch9Posts.length);
});

test("the ninth expansion batch keeps city profile references aligned", () => {
  const expectedProfileHosts = {
    ahmedabad: "ahmedabad.nic.in",
    lucknow: "lucknow.nic.in",
    chandigarh: "chandigarh.gov.in",
    surat: "surat.nic.in",
  };

  for (const [citySlug, profileHost] of Object.entries(expectedProfileHosts)) {
    const posts = getCityJournalPosts(citySlug).slice(-3);
    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => post.sources?.some((source) => source.url.includes(profileHost))), citySlug);
    assert.ok(
      posts.every((post) => !post.sources?.some((source) =>
        Object.values(expectedProfileHosts)
          .filter((host) => host !== profileHost)
          .some((host) => source.url.includes(host)),
      )),
      citySlug,
    );
  }
});

test("the ninth expansion batch is curated on its matching state pages", () => {
  for (const citySlug of ["ahmedabad", "lucknow", "chandigarh", "surat"]) {
    const city = cities.find((candidate) => candidate.slug === citySlug);
    assert.ok(city);
    const state = states.find((candidate) => candidate.citySlugs.includes(citySlug));
    assert.ok(state);
    const posts = stateJournalIndex
      .filter((post) => post.citySlug === citySlug)
      .slice(-3);

    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => state.citySlugs.includes(post.citySlug)), citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the tenth expansion batch has one distinct discipline article per city", () => {
  for (const citySlug of ["indore", "patna", "ranchi", "bhubaneswar"]) {
    const posts = getCityJournalPosts(citySlug).slice(-3);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("the tenth expansion batch does not repeat titles, slugs, or article bodies", () => {
  const batch10Posts = ["indore", "patna", "ranchi", "bhubaneswar"].flatMap((citySlug) =>
    getCityJournalPosts(citySlug).slice(-3),
  );
  assert.equal(new Set(batch10Posts.map((post) => post.title)).size, batch10Posts.length);
  assert.equal(new Set(batch10Posts.map((post) => post.slug)).size, batch10Posts.length);
  assert.equal(
    batch10Posts.filter((post) =>
      [...blogPosts, ...cityJournalPosts].some((existing) =>
        existing.slug === post.slug && existing.id !== post.id,
      ),
    ).length,
    0,
  );
  const cityNeutralBodies = batch10Posts.map((post) =>
    post.content
      .replace(/\b(?:indore|patna|ranchi|bhubaneswar)\b/gi, "city")
      .replace(/\s+/g, " ")
      .trim(),
  );
  assert.equal(new Set(cityNeutralBodies).size, batch10Posts.length);
});

test("the tenth expansion batch keeps city profile references aligned", () => {
  const expectedProfileHosts = {
    indore: "indore.nic.in",
    patna: "patna.nic.in",
    ranchi: "ranchi.nic.in",
    bhubaneswar: "khordha.odisha.gov.in",
  };

  for (const [citySlug, profileHost] of Object.entries(expectedProfileHosts)) {
    const posts = getCityJournalPosts(citySlug).slice(-3);
    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => post.sources?.some((source) => source.url.includes(profileHost))), citySlug);
    assert.ok(
      posts.every((post) => !post.sources?.some((source) =>
        Object.values(expectedProfileHosts)
          .filter((host) => host !== profileHost)
          .some((host) => source.url.includes(host)),
      )),
      citySlug,
    );
  }
});

test("the tenth expansion batch is curated on its matching state pages", () => {
  for (const citySlug of ["indore", "patna", "ranchi", "bhubaneswar"]) {
    const city = cities.find((candidate) => candidate.slug === citySlug);
    assert.ok(city);
    const state = states.find((candidate) => candidate.citySlugs.includes(citySlug));
    assert.ok(state);
    const posts = stateJournalIndex
      .filter((post) => post.citySlug === citySlug)
      .slice(-3);

    assert.equal(posts.length, 3, citySlug);
    assert.ok(posts.every((post) => state.citySlugs.includes(post.citySlug)), citySlug);
    assert.deepEqual(
      posts.map((post) => post.discipline),
      ["physiotherapy", "nutrition", "exercise-physiology"],
      citySlug,
    );
  }
});

test("every city Journal article has deep-content markers and five references", () => {
  for (const post of cityJournalPosts) {
    const publishedPost = blogPosts.find((publishedPost) => publishedPost.slug === post.slug);
    assert.equal(publishedPost?.author, "Dr. Rahul Goswami, PT", post.slug);
    assert.ok(post.content.length >= 3500, `${post.slug} should be long-form`);
    assert.match(post.content, /### What a physiotherapist assesses/);
    assert.match(post.content, /### How rehabilitation can progress/);
    assert.match(post.content, /### What to expect from a home physiotherapy session/);
    assert.match(post.content, /### Do/);
    assert.match(post.content, /### Don’t/);
    assert.match(post.content, /### Safety and when to seek medical advice/);
    assert.ok(
      publishedPost?.content.includes(pricing.homeVisit.amount),
      `${post.slug} should use the shared introductory home-visit price`,
    );
    assert.ok((post.sources?.length ?? 0) >= 5, `${post.slug} needs at least five sources`);
  }
});

test("city safety lists use a singular quantifier before singular urgent-care verbs", () => {
  const findings = cityJournalPosts.flatMap((post) => {
    const safety = post.content.match(/### Safety and when to seek medical advice\n\n([\s\S]*?)(?:\n\n###|$)/)?.[1] ?? "";
    return safety
      .split(/[.!?]\s+/)
      .some((sentence) =>
        /^(?!Any of these\b)(?!If\b)(?!Urgent assessment is needed for\b)(?!Urgent medical assessment is needed after\b)[A-Z][^.?!]*,\s+or\s+[^.?!]+\s+(?:is|needs|requires)\b/.test(sentence.trim()),
      )
      ? [post.slug]
      : [];
  });

  assert.deepEqual(
    findings,
    [],
    `City safety copy should introduce comma-separated urgent-care lists with "any of these" wording:\n  ${findings.join("\n  ")}`,
  );
});

test("published Journal catalog has 206 unique posts with complete SEO metadata", () => {
  assert.equal(blogPosts.length, 206);
  assert.equal(new Set(blogPosts.map((post) => post.slug)).size, blogPosts.length);
  assert.deepEqual(getBlogCatalogValidationErrors(blogPosts), []);
});

test("the lumbar slipped-disc article is general Journal content with deep clinical coverage", () => {
  const post = blogPosts.find((candidate) => candidate.slug === "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1");
  assert.ok(post);
  assert.equal("citySlug" in post, false);
  assert.ok(post.content.length >= 7000);
  assert.match(post.content, /L3–L4/);
  assert.match(post.content, /L4–L5/);
  assert.match(post.content, /L5–S1/);
  assert.match(post.content, /cauda equina/i);
  assert.match(post.content, /### Further reading/);
  assert.ok((post.sources?.length ?? 0) >= 8);
});

test("the vasculitis and skin-inflammation article is nutrition-led with bounded rehabilitation guidance", () => {
  const post = blogPosts.find((candidate) => candidate.slug === "skin-inflammation-vasculitis-diet-guide");
  assert.ok(post);
  assert.equal("citySlug" in post, false);
  assert.ok(post.content.length >= 8500);
  assert.equal(post.title, "Skin Inflammation and Vasculitis: Nutrition, Symptoms, and Care");
  assert.equal(post.category, "Nutrition & Clinical Guidance");
  assert.equal(post.presentation, "nutrition-guidance");
  assert.equal(post.authorProfile?.role, "Nutritionist");
  assert.match(post.authorProfile?.bio ?? "", /nutritionist/i);
  assert.match(post.content, /vasculitis/i);
  assert.match(post.content, /### What dietary changes can reasonably support/);
  assert.match(post.content, /### Don’t/);
  assert.match(post.content, /### Safety and when to seek medical advice/);
  assert.match(post.content, /### How rehabilitation fits—and where it does not/);
  assert.match(post.content, /Physiotherapy is not a treatment for vasculitis itself/i);
  assert.match(post.content, /fatigue and deconditioning/i);
  assert.match(post.content, /supplement/i);
  assert.match(post.content, /teleconsultation/i);
  assert.ok((post.sources?.length ?? 0) >= 8);
});

test("Journal catalog validation reports empty and duplicate slugs exactly", () => {
  const firstPost = blogPosts[0];
  assert.ok(firstPost);

  assert.deepEqual(
    getBlogCatalogValidationErrors([
      { ...firstPost, slug: "" },
    ]),
    [`empty slug (post id ${firstPost.id})`],
  );
  assert.deepEqual(
    getBlogCatalogValidationErrors([
      firstPost,
      { ...firstPost, id: "duplicate" },
    ]),
    [`duplicate slug "${firstPost.slug}"`],
  );
});

test("Journal catalog validation requires calendar-valid ISO publication dates", () => {
  const firstPost = blogPosts[0];
  assert.ok(firstPost);

  assert.deepEqual(
    getBlogCatalogValidationErrors([
      { ...firstPost, isoDate: "September 22, 2026" },
    ]),
    [`invalid ISO date "September 22, 2026" for "${firstPost.slug}"`],
  );
  assert.deepEqual(
    getBlogCatalogValidationErrors([
      { ...firstPost, isoDate: "2026-02-30" },
    ]),
    [`invalid ISO date "2026-02-30" for "${firstPost.slug}"`],
  );
});

test("Journal route parity reports exact missing and extra slugs", () => {
  assert.deepEqual(
    getBlogSlugParityErrors(
      ["kept", "missing"],
      ["kept", "extra"],
    ),
    [
      'missing generated article route for "missing"',
      'unexpected generated article route for "extra"',
    ],
  );
});