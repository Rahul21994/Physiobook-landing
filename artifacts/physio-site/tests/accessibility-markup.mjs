import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const publicCtaFiles = [
  "src/pages/home.tsx",
  "src/pages/booking.tsx",
  "src/pages/contact.tsx",
  "src/pages/city.tsx",
  "src/pages/state.tsx",
  "src/pages/service-guide.tsx",
  "src/components/layout.tsx",
];

const bookingSource = await readFile(
  new URL("../src/pages/booking.tsx", import.meta.url),
  "utf8",
);
const reviewCardSource = await readFile(
  new URL("../src/components/ReviewCard.tsx", import.meta.url),
  "utf8",
);
const homeSource = await readFile(
  new URL("../src/pages/home.tsx", import.meta.url),
  "utf8",
);

assert.match(
  bookingSource,
  /role="group"\s+aria-label=\{t\("Choose session type",\s*"देखभाल का प्रकार चुनें"\)\}/,
  "The session-mode controls must have an accessible group label.",
);
assert.match(
  bookingSource,
  /aria-pressed=\{sessionMode === "home"\}/,
  "The Home Visit control must expose its selected state.",
);
assert.match(
  bookingSource,
  /aria-pressed=\{sessionMode === "telehealth"\}/,
  "The Online Consultation control must expose its selected state.",
);
assert.match(
  reviewCardSource,
  /role="img"\s+aria-label=\{`\$\{value\} star review`\}/,
  "Published review ratings must expose a valid accessible image role.",
);
assert.match(
  homeSource,
  /href=\{`\/physiotherapist-at-home\/\$\{city\.slug\}`\}[\s\S]{0,300}min-h-12 min-w-12/,
  "Homepage city links must provide a 48px touch target.",
);
assert.match(
  homeSource,
  /<svg[^>]*aria-hidden="true"[^>]*focusable="false"[^>]*>[\s\S]*?\{BUSINESS_PHONE_DISPLAY\}/,
  "The homepage phone icon must be hidden from assistive technology.",
);
assert.match(
  homeSource,
  /href=\{BUSINESS_GBP_URL\}[\s\S]*?<svg[^>]*aria-hidden="true"[^>]*focusable="false"/,
  "The homepage Google Maps icon must be hidden from assistive technology.",
);
assert.match(
  (await readFile(new URL("../src/components/layout.tsx", import.meta.url), "utf8")),
  /aria-label="Chat with us on WhatsApp"[\s\S]*?<svg[^>]*aria-hidden="true"[^>]*focusable="false"/,
  "The floating WhatsApp icon must be hidden from assistive technology.",
);
for (const [serviceSlug, servicePath] of [
  ["back-pain-physiotherapy", "/back-pain"],
  ["post-surgery-rehabilitation", "/post-surgery-rehab"],
  ["stroke-rehabilitation", "/stroke-rehab"],
]) {
  assert.match(
    homeSource,
    new RegExp(
      `href="${servicePath}"[\\s\\S]{0,220}text-foreground`,
    ),
    `Homepage ${serviceSlug} guide link must use the high-contrast text color.`,
  );
}

for (const relativePath of publicCtaFiles) {
  const source = await readFile(
    new URL(`../${relativePath}`, import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(
    source,
    /<(?:Link|a)\b[^>]*>\s*<Button\b(?![^>]*\basChild\b)/s,
    `${relativePath} must not place a native Button inside a link.`,
  );
}

console.log(
  "Accessibility markup checks passed: session state is announced and public CTAs do not nest native buttons inside links.",
);