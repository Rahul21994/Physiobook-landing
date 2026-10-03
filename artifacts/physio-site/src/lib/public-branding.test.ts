import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const PUBLIC_BRAND = "Goswami Rehab";
const REGISTERED_NAME = "Goswami Institute of Functional Training";
const LEGACY_NAME = "Goswami Institute";

type BrandingGuard = {
  label: string;
  relativePath: string;
  approvedContexts: string[];
};

const brandingGuards: BrandingGuard[] = [
  {
    label: "shared layout",
    relativePath: "../components/layout.tsx",
    approvedContexts: [`${PUBLIC_BRAND}™ · ${REGISTERED_NAME}`],
  },
  {
    label: "privacy page",
    relativePath: "../pages/privacy.tsx",
    approvedContexts: [
      `${PUBLIC_BRAND} is the public brand of ${REGISTERED_NAME}`,
      `Operated by ${REGISTERED_NAME}`,
    ],
  },
  {
    label: "terms page",
    relativePath: "../pages/terms.tsx",
    approvedContexts: [
      `public brand of ${REGISTERED_NAME}`,
      `"${LEGACY_NAME}"`,
      `${LEGACY_NAME} is operated as a sole proprietorship`,
      `property of ${REGISTERED_NAME}`,
      `Operated by ${REGISTERED_NAME}`,
    ],
  },
  {
    label: "city copy",
    relativePath: "./cities.ts",
    approvedContexts: [],
  },
  {
    label: "journal copy",
    relativePath: "./data.ts",
    approvedContexts: [],
  },
  {
    label: "city page",
    relativePath: "../pages/city.tsx",
    approvedContexts: [],
  },
  {
    label: "state page",
    relativePath: "../pages/state.tsx",
    approvedContexts: [],
  },
  {
    label: "prerender metadata",
    relativePath: "../../prerender.mjs",
    approvedContexts: [
      `public brand is "${PUBLIC_BRAND}"`,
    ],
  },
  {
    label: "fallback metadata",
    relativePath: "../../index.html",
    approvedContexts: [],
  },
];

function readSource(relativePath: string): string {
  return readFileSync(resolve(import.meta.dirname, relativePath), "utf8");
}

function findUnexpectedLegacyUses(
  source: string,
  approvedContexts: string[],
): string[] {
  const approvedRanges = approvedContexts.flatMap((context) => {
    const ranges: Array<[number, number]> = [];
    let start = source.indexOf(context);

    while (start !== -1) {
      ranges.push([start, start + context.length]);
      start = source.indexOf(context, start + context.length);
    }

    return ranges;
  });

  const unexpected: string[] = [];
  let match: RegExpExecArray | null;
  const legacyNamePattern = new RegExp(LEGACY_NAME, "gi");

  while ((match = legacyNamePattern.exec(source)) !== null) {
    const occurrenceStart = match.index;
    const occurrenceEnd = occurrenceStart + LEGACY_NAME.length;
    const isApproved = approvedRanges.some(
      ([contextStart, contextEnd]) =>
        occurrenceStart >= contextStart && occurrenceEnd <= contextEnd,
    );

    if (!isApproved) {
      const line = source.slice(0, occurrenceStart).split("\n").length;
      unexpected.push(`line ${line}: ${LEGACY_NAME}`);
    }
  }

  return unexpected;
}

test("trust pages preserve the public brand and registered business identity", () => {
  for (const guard of brandingGuards.filter(({ label }) =>
    label === "privacy page" || label === "terms page"
  )) {
    const source = readSource(guard.relativePath);

    assert.match(
      source,
      new RegExp(PUBLIC_BRAND),
      `${guard.label} must identify the public brand as "${PUBLIC_BRAND}"`,
    );
    assert.match(
      source,
      new RegExp(REGISTERED_NAME),
      `${guard.label} must identify the registered business as "${REGISTERED_NAME}"`,
    );
  }
});

test("public pages do not reintroduce the legacy brand outside approved legal contexts", () => {
  const violations = brandingGuards.flatMap((guard) => {
    const unexpectedUses = findUnexpectedLegacyUses(
      readSource(guard.relativePath),
      guard.approvedContexts,
    );

    return unexpectedUses.map((use) => `${guard.label} (${guard.relativePath}) ${use}`);
  });

  assert.deepEqual(
    violations,
    [],
    [
      `Unexpected "${LEGACY_NAME}" use found on a public page:`,
      ...violations.map((violation) => `  ${violation}`),
    ].join("\n"),
  );
});

test("structured data uses the public brand", () => {
  const structuredDataSources = [
    ["fallback homepage", readSource("../../index.html")],
    ["prerender schemas", readSource("../../prerender.mjs")],
    ["city schema", readSource("../pages/city.tsx")],
    ["state schema", readSource("../pages/state.tsx")],
  ] as const;

  for (const [label, source] of structuredDataSources) {
    assert.match(
      source,
      new RegExp(PUBLIC_BRAND),
      `${label} must expose "${PUBLIC_BRAND}"`,
    );
    assert.doesNotMatch(
      source,
      new RegExp(REGISTERED_NAME),
      `${label} must not expose the registered name as a public structured-data brand`,
    );
  }
});

test("shared branding carries the trademark review notice and approved positioning", () => {
  const layout = readSource("../components/layout.tsx");
  const homepage = readSource("../pages/home.tsx");

  assert.match(layout, /Goswami Rehab™/);
  assert.match(layout, /trademark application\/status under review/i);
  assert.match(homepage, /home visits and online physiotherapy in 45 listed Indian cities/i);
  assert.match(homepage, /35\+ specialist physiotherapists/i);
  assert.match(homepage, /a nutritionist/i);
  assert.match(homepage, /an exercise physiologist/i);
  assert.match(homepage, /clinician availability is confirmed before a home visit/i);
});