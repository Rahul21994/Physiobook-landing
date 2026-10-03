import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST_DIR = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "dist",
  "public",
);

function readRoute(route) {
  return readFileSync(join(DIST_DIR, route, "index.html"), "utf8");
}

function bodyOf(html) {
  return html.slice(html.indexOf("<body"), html.indexOf("</body>"));
}

function headOf(html) {
  return html.slice(0, html.indexOf("</head>"));
}

function countMatches(value, pattern) {
  return (value.match(pattern) ?? []).length;
}

for (const route of [
  "cities",
  "physiotherapist-at-home/jaipur",
]) {
  const html = readRoute(route);
  const head = headOf(html);
  const body = bodyOf(html);

  assert.equal(
    countMatches(head, /<title\b/gi),
    1,
    `${route} should have one title in the document head`,
  );
  assert.equal(
    countMatches(head, /<meta\b[^>]*name="description"/gi),
    1,
    `${route} should have one description in the document head`,
  );
  assert.equal(
    countMatches(head, /<link\b[^>]*rel="canonical"/gi),
    1,
    `${route} should have one canonical in the document head`,
  );
  assert.match(
    head,
    /<script[^>]*type="application\/ld\+json"[^>]*>/,
    `${route} structured data should be emitted in the document head`,
  );
  assert.doesNotMatch(
    body,
    /<title\b|<meta\b|<link\b[^>]*canonical|<script[^>]*type="application\/ld\+json"/i,
    `${route} should not put document signals in the body`,
  );
}

const bookingBody = bodyOf(readRoute("booking"));
assert.equal(
  countMatches(bookingBody, /data-testid="progressive-care-journey"/g),
  1,
  "Booking should render one visible progressive care journey in SSR HTML",
);
for (const stepTitle of [
  "Send a request",
  "Our team reviews it",
  "Confirm the plan together",
  "Care and follow-up",
]) {
  assert.match(
    bookingBody,
    new RegExp(stepTitle),
    `Booking SSR HTML should include the ${stepTitle.toLowerCase()} journey step`,
  );
}
assert.match(
  bookingBody,
  /Sending a request does not charge you/,
  "Booking SSR HTML should explain that sending a request does not charge the visitor",
);
assert.doesNotMatch(
  bookingBody,
  /Pay in Advance via UPI/,
  "Payment UI should remain after request submission rather than appearing in the initial booking form",
);

for (const { route, expectedText } of [
  {
    route: "physiotherapist-at-home/jaipur",
    expectedText: /clinician availability before confirming a home visit/,
  },
  {
    route: "physiotherapist-at-home/hyderabad",
    expectedText: /clinician availability before confirming a home visit/,
  },
  {
    route: "physiotherapist-at-home-in/rajasthan",
    expectedText: /home-visit fit before confirming/,
  },
]) {
  const body = bodyOf(readRoute(route));
  assert.equal(
    countMatches(body, /data-testid="progressive-care-journey"/g),
    1,
    `${route} should render one progressive care journey`,
  );
  assert.match(
    body,
    expectedText,
    `${route} should render its resolved location-context journey copy`,
  );
}

for (const route of [
  "physiotherapist-at-home/jaipur",
  "physiotherapist-at-home-in/rajasthan",
]) {
  const body = bodyOf(readRoute(route));
  assert.match(
    body,
    /data-testid="(?:city|state)-faq-content-0"[^>]*>[\s\S]*?(?:online consultation|home visit|availability|cities)/i,
    `${route} should include an availability-related first FAQ answer in initial HTML`,
  );
}

const stateHead = headOf(readRoute("physiotherapist-at-home-in/rajasthan"));
assert.equal(
  countMatches(stateHead, /"@type":\s*"BreadcrumbList"/g),
  1,
  "indexable state pages should publish breadcrumb schema",
);
assert.match(
  stateHead,
  /<script[^>]*type="application\/ld\+json"[^>]*>/,
  "indexable state pages should emit JSON-LD",
);

const bengaluruHead = headOf(readRoute("physiotherapist-at-home/bengaluru"));
assert.match(
  bengaluruHead,
  /<title>Home Physiotherapy in Bangalore \(Bengaluru\) \| Goswami Rehab<\/title>/,
  "Bengaluru title should include both recognized city names",
);
assert.match(
  bengaluruHead,
  /<meta name="description" content="Home visits and online physiotherapy are available in Bengaluru\./,
  "Bengaluru description should state city-level home-visit status",
);

const mumbaiHead = headOf(readRoute("physiotherapist-at-home/mumbai"));
assert.match(
  mumbaiHead,
  /<title>Home Physiotherapy in Mumbai for Recovery \| Goswami Rehab<\/title>/,
  "Mumbai title should keep a concise home-physiotherapy recovery title",
);

const hyderabadBody = bodyOf(readRoute("physiotherapist-at-home/hyderabad"));
assert.match(
  hyderabadBody,
  /Home visits are active at city level/,
  "All listed city pages should lead with active city-level home visits",
);
assert.doesNotMatch(
  hyderabadBody,
  /future team placement/,
  "All listed city pages should not render expansion placement copy",
);

for (const { route, testId } of [
  { route: "blog/stroke-rehabilitation-at-home", testId: "article" },
  { route: "blog/category/neuro-rehabilitation", testId: "category-attribution" },
  { route: "physiotherapist-at-home/jaipur", testId: "city-attribution" },
  { route: "physiotherapist-at-home-in/rajasthan", testId: "state-attribution" },
]) {
  const body = bodyOf(readRoute(route));
  assert.match(
    body,
    new RegExp(
      `data-testid="${testId}-author"[^>]*>[\\s\\S]*?data-testid="${testId}-author-name"[^>]*>Dr\\. Rahul Goswami, PT</`,
    ),
    `${route} should visibly identify the content author`,
  );
  assert.match(
    body,
    new RegExp(`data-testid="${testId}-reviewer"[^>]*>Dr\\. Prakriti Sharma</`),
    `${route} should visibly identify the content reviewer`,
  );
}

console.log("Rendered HTML checks passed for location metadata and FAQ visibility.");
