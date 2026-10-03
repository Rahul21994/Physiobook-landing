import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_DIR = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const SOURCE_ROOTS = ["src/pages", "src/components", "src/lib"];
const DIST_DIR = join(SITE_DIR, "dist", "public");

const BAD_COPY_PATTERNS = [
  {
    label: "service link should use an action such as check or explore",
    pattern: /\bcompare\s+homecare\s+physiotherapy\b/i,
  },
  {
    label: "online consultation should include an article",
    pattern: /\b(?:with|and)\s+worldwide\s+online\s+consultation\b/i,
  },
  {
    label: "Jaipur operations HQ must not be described as a patient clinic",
    pattern: /(?:clinic and team base for operations|coordinated from its Jaipur headquarters and clinic|clinic visits? (?:are|should be) (?:by appointment|arranged in advance)|clinic access by appointment|sent securely to the clinic by email)/i,
  },
];

function findFiles(directory, predicate) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) return findFiles(entryPath, predicate);
    return predicate(entryPath) ? [entryPath] : [];
  });
}

function findAuthoredCopyFiles() {
  return SOURCE_ROOTS.flatMap((root) =>
    findFiles(join(SITE_DIR, root), (filePath) =>
      /\.(?:tsx?|json)$/.test(filePath) && !/\.test\./.test(filePath),
    ),
  );
}

function findGeneratedHtmlFiles() {
  assert.ok(existsSync(DIST_DIR), `Built output is missing: ${DIST_DIR}`);
  return findFiles(DIST_DIR, (filePath) => filePath.endsWith("index.html"));
}

const files = [...findAuthoredCopyFiles(), ...findGeneratedHtmlFiles()];
const failures = [];

for (const filePath of files) {
  const content = readFileSync(filePath, "utf8");
  for (const { label, pattern } of BAD_COPY_PATTERNS) {
    const match = content.match(pattern);
    if (match) {
      failures.push(
        `${relative(SITE_DIR, filePath)}: ${label} (${JSON.stringify(match[0])})`,
      );
    }
  }
}

assert.deepEqual(
  failures,
  [],
  `Copy regression patterns found:\n${failures.join("\n")}`,
);

const contactSource = readFileSync(join(SITE_DIR, "src/pages/contact.tsx"), "utf8");
const contactConstants = readFileSync(join(SITE_DIR, "src/lib/contact.ts"), "utf8");
const businessConfigSource = readFileSync(join(SITE_DIR, "src/config/business.ts"), "utf8");
assert.match(contactSource, /BUSINESS_CONFIG\.availability\.online/);
assert.match(contactSource, /BUSINESS_CONFIG\.availability\.inPerson/);
assert.match(contactSource, /BUSINESS_CONFIG\.headOffice\.googleMapsUrl/);
assert.match(contactSource, /BUSINESS_CONFIG\.serviceAreaProfiles/);
assert.match(contactSource, /contact-map-\$\{profile\.id\}/);
assert.match(contactSource, /useCreateConsultationLead/);
assert.match(contactSource, /getFormAntiSpamToken/);
assert.match(contactSource, /setSavedLeadId\(result\.id\)/);
assert.match(contactSource, /data-testid="consultation-success"/);
assert.match(contactSource, /data-testid="checkbox-consultation-consent"/);
assert.doesNotMatch(
  contactSource,
  /BUSINESS_CONFIG\.contact\.(?:phone|whatsapp|email)|BUSINESS_PHONE(?:_DISPLAY|_E164|_TEL)?|BUSINESS_EMAIL|BUSINESS_WHATSAPP_URL/,
  "the Contact page should not display unconfigured business contact details",
);
assert.match(contactConstants, /BUSINESS_EMAIL\s*=\s*BUSINESS_CONFIG\.contact\.email/);
assert.match(contactConstants, /BUSINESS_GURUGRAM_GBP_URL\s*=\s*BUSINESS_CONFIG\.serviceAreaProfiles\[0\]\?\.googleMapsUrl/);
assert.match(contactConstants, /BUSINESS_HQ_ADDRESS\s*=\s*\{[\s\S]*?BUSINESS_CONFIG\.headOffice\.address\.streetAddress/);
assert.match(businessConfigSource, /phone:\s*""/);
assert.match(businessConfigSource, /whatsapp:\s*""/);
assert.match(businessConfigSource, /email:\s*""/);

console.log(
  `Copy regression check passed for ${findAuthoredCopyFiles().length} authored files and ${findGeneratedHtmlFiles().length} prerendered pages.`,
);