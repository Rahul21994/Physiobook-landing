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
const targetCities = {
  jaipur: ["Murlipura", "Vaishali Nagar", "Mansarovar"],
  delhi: ["South Delhi", "Dwarka", "Rohini"],
  gurgaon: ["DLF", "Sohna Road", "Golf Course Road"],
  faridabad: ["HUDA Colony", "Sector 16", "Ballabhgarh"],
  bengaluru: ["Indiranagar", "Koramangala", "Whitefield"],
  tigaon: ["Tigaon", "Bhatola", "Basantpur"],
  moradabad: ["Civil Lines", "Ram Ganga Vihar", "Buddhi Vihar"],
  mumbai: ["Andheri", "Bandra", "Powai"],
};

function readRoute(slug) {
  return readFileSync(join(DIST_DIR, "physiotherapist-at-home", slug, "index.html"), "utf8");
}

function headOf(html) {
  return html.slice(0, html.indexOf("</head>"));
}

function bodyOf(html) {
  return html.slice(html.indexOf("<body"), html.indexOf("</body>"));
}

for (const [slug, localities] of Object.entries(targetCities)) {
  const html = readRoute(slug);
  const head = headOf(html);
  const body = bodyOf(html);
  const description = head.match(/<meta name="description" content="([^"]+)"/i)?.[1] ?? "";

  assert.ok(description, `${slug} needs a meta description`);
  assert.match(
    description,
    /Home visits and online physiotherapy are available in/i,
    `${slug} meta description should state city-level coverage`,
  );
  assert.match(body, /Locality references/i, `${slug} should label neighborhoods as references`);
  assert.match(body, /This name alone does not confirm that a home visit can be arranged/i, `${slug} should not imply neighborhood-level guarantees`);
  assert.match(body, /Home<\/a>[\s\S]*Cities<\/a>[\s\S]*<span[^>]*>[^<]+<\/span>/, `${slug} should show Home > Cities > city breadcrumbs`);
  assert.match(head, /"@type":\s*"BreadcrumbList"/, `${slug} should publish breadcrumb schema`);
  assert.match(head, /"name":\s*"Cities"/, `${slug} breadcrumb schema should include Cities`);
  assert.ok(
    body.indexOf('id="city-pricing"') < body.indexOf("Physiotherapy Services at Home"),
    `${slug} should show pricing before services`,
  );
  assert.match(
    body,
    /bg-orange-500\/10[^>]*>[\s\S]*<svg/,
    `${slug} service cards should use the compact orange icon treatment`,
  );

  if (slug === "gurgaon") {
    assert.match(
      head,
      /<title>Physiotherapy at Home in Gurugram \(Gurgaon\) \| Goswami Rehab<\/title>/,
      "Gurugram page title should lead with the current name and retain the familiar alias",
    );
    assert.match(
      head,
      /<meta name="description" content="Home visits and online physiotherapy are available in Gurugram/,
      "Gurugram page description should state active city-level coverage",
    );
    assert.match(
      body,
      /Physiotherapy[\s\S]*at Home in[\s\S]*Gurugram \(Gurgaon\)/,
      "Gurugram page should use natural service wording and both local names in its hero",
    );
    assert.doesNotMatch(
      body,
      /Gurugram or Gurgaon|Gurgaon or Gurugram/,
      "Gurugram page should not present the local names as an either-or choice",
    );
  }

  if (slug === "mumbai") {
    assert.match(
      body,
      /How can I find a physiotherapist near me in Mumbai\?/,
      "Mumbai should publish the city-specific near-me FAQ",
    );
  }

  const localityIds = [...body.matchAll(/<article[^>]+id="([^"]+)"[^>]+data-locality=/g)].map((match) => match[1]);
  assert.ok(localityIds.length >= 3, `${slug} should render locality sections`);
  assert.equal(new Set(localityIds).size, localityIds.length, `${slug} locality section IDs should be unique`);
  for (const locality of localities) {
    assert.match(body, new RegExp(`data-locality="${locality}"`), `${slug} should render ${locality}`);
  }
  const neighborhoodNames = localities.filter((locality) => locality.toLowerCase() !== slug.toLowerCase());
  const localityListPattern = new RegExp(
    `Physiotherapist at home in (?:${neighborhoodNames.map((locality) => locality.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "i",
  );
  assert.doesNotMatch(body, localityListPattern, `${slug} should not present locality references as verified service zones`);
}

console.log("Local city structure checks passed for eight target pages.");