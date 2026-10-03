import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const DIST_DIR = join(
  fileURLToPath(new URL(".", import.meta.url)),
  "..",
  "dist",
  "public",
);
const CITY_DIR = join(DIST_DIR, "physiotherapist-at-home");
const cityRoutes = readdirSync(CITY_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

assert.ok(cityRoutes.length >= 40, "The city route catalog should contain at least 40 cities");

for (const slug of cityRoutes) {
  const html = readFileSync(join(CITY_DIR, slug, "index.html"), "utf8");
  assert.match(
    html,
    /data-cta="city-booking"/,
    `${slug} should include a direct city booking CTA`,
  );
  const cityBookingAnchors = [...html.matchAll(/<a\b[^>]*data-cta="city-booking"[^>]*>/g)]
    .map(([anchor]) => anchor);
  assert.ok(
    cityBookingAnchors.some(
      (anchor) =>
        anchor.includes(`data-booking-city="${slug}"`) &&
        anchor.includes('data-booking-mode="home"') &&
        anchor.includes('href="/booking"'),
    ),
    `${slug} should use a clean booking URL and preserve city context on its CTA`,
  );
  assert.match(
    html,
    new RegExp(
      `data-testid="(?:city-journal-(?:${slug}|guide-${slug})|card-city-journal-${slug}-india-guide)"`,
    ),
    `${slug} should show a city article or a relevant Journal fallback`,
  );
}

console.log(`City coverage checks passed for ${cityRoutes.length} routes.`);