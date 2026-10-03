import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseHindiApprovalLedger } from "./hindi-copy-fingerprint.mjs";

const artifactDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspaceRoot = path.resolve(artifactDir, "../..");
const packetDir = path.join(workspaceRoot, "docs/hindi-review");
const ledger = fs.readFileSync(path.join(packetDir, "README.md"), "utf8");
const routeCopy = fs.readFileSync(path.join(packetDir, "city-routes.md"), "utf8");
const templateCopy = fs.readFileSync(path.join(packetDir, "city-template.md"), "utf8");
const journalCopy = fs.readFileSync(path.join(packetDir, "city-journal-teasers.md"), "utf8");
const testimonialCopy = fs.readFileSync(path.join(packetDir, "testimonials.md"), "utf8");
const approvalLedger = parseHindiApprovalLedger(ledger);
const approvedCopy = JSON.parse(
  fs.readFileSync(path.join(packetDir, "approved-copy-fingerprints.json"), "utf8"),
);

const requiredRevisions = [
  "city-template-r1",
  "city-routes-r1",
  "city-journal-teasers-r1",
  "testimonials-r1",
];
if (
  !ledger.includes("The 49 original route entries are **APPROVED — OWNER-REPORTED**") ||
  !ledger.includes("`/hi/home-physiotherapy` reuses the exact approved `about-r1` copy")
) {
  throw new Error("Hindi city route generation is blocked: the original approvals or exact copy reuse are not recorded.");
}
for (const revision of requiredRevisions) {
  if (!ledger.includes(`\`${revision}\``)) {
    throw new Error(`Hindi city route generation is blocked: ${revision} is missing from the review ledger.`);
  }
}
if (
  approvedCopy.version !== 1 ||
  !approvedCopy.revisionSets ||
  !approvedCopy.routes ||
  Object.keys(approvedCopy.routes).length !== 50
) {
  throw new Error("Hindi city route generation is blocked: the approved-copy fingerprint manifest is invalid.");
}
for (const routePath of approvalLedger.keys()) {
  if (!approvedCopy.routes[routePath]) {
    throw new Error(`Hindi city route generation is blocked: ${routePath} has no approved copy fingerprint.`);
  }
}
for (const routePath of Object.keys(approvedCopy.routes)) {
  if (!approvalLedger.has(routePath)) {
    throw new Error(`Hindi city route generation is blocked: ${routePath} is missing from the review ledger.`);
  }
}

function validateApprovalLink(routePath, currentRevisions) {
  const ledgerRecord = approvalLedger.get(routePath);
  const fingerprintRecord = approvedCopy.routes[routePath];
  const approvedRevisions = approvedCopy.revisionSets[fingerprintRecord?.revisionSet];
  if (!ledgerRecord || !fingerprintRecord || !Array.isArray(approvedRevisions)) {
    throw new Error(`Hindi route ${routePath} is missing a complete approval record.`);
  }
  if (
    JSON.stringify(ledgerRecord.revisions) !== JSON.stringify(approvedRevisions) ||
    JSON.stringify(currentRevisions) !== JSON.stringify(approvedRevisions)
  ) {
    throw new Error(
      `Hindi route ${routePath} has mismatched current, ledger, and fingerprint revisions; renew approval before generation.`,
    );
  }
  if (!/^[a-f\d]{64}$/iu.test(fingerprintRecord.sha256)) {
    throw new Error(`Hindi route ${routePath} has an invalid approved-copy SHA-256 fingerprint.`);
  }
}

function tableCells(line) {
  if (!line.trim().startsWith("|")) return [];
  return line.split("|").slice(1, -1).map((cell) => cell.trim());
}

function parseAnyTable(section, minimumCells) {
  return section
    .split(/\r?\n/)
    .map(tableCells)
    .filter((cells) =>
      cells.length >= minimumCells &&
      cells[0] !== "---" &&
      !/^[-\s]+$/u.test(cells[0]),
    );
}

function parseTable(section, minimumCells) {
  return parseAnyTable(section, minimumCells).filter(([key]) =>
    /^[a-z][a-z0-9-]*$/.test(key),
  );
}

function sectionBetween(source, start, end) {
  const startAt = source.indexOf(start);
  if (startAt === -1) return "";
  const contentAt = startAt + start.length;
  const endAt = end ? source.indexOf(end, contentAt) : -1;
  return source.slice(contentAt, endAt === -1 ? undefined : endAt);
}

const glossarySection = sectionBetween(
  routeCopy,
  "## पुनर्वास-क्षेत्र नामावली",
  "## शहरों के लिए चुने गए सेवा-विषय",
);
const themeGlossarySection = sectionBetween(
  routeCopy,
  "## शहरों के लिए चुने गए सेवा-विषय",
  "### हर route के service-theme कार्ड",
);
const themesSection = sectionBetween(
  routeCopy,
  "### हर route के service-theme कार्ड",
  "## सभी route-विशिष्ट स्थितियाँ और स्थानीय संदर्भ",
);
const serviceLabelBySource = new Map(
  parseAnyTable(glossarySection, 2).map(([source, label]) => [source, label]),
);
const themeLabelBySource = new Map(
  parseAnyTable(themeGlossarySection, 2).map(([source, label]) => [source, label]),
);
const themesBySlug = new Map(
  parseTable(themesSection, 2).map(([slug, themes]) => [
    slug,
    themes.split(";").map((value) => value.trim()).filter(Boolean),
  ]),
);

const metadataSection = routeCopy.split("## शीर्षक और SEO कॉपी")[1]?.split("## पुनर्वास-क्षेत्र नामावली")[0];
const contextSection = routeCopy.split("## सभी route-विशिष्ट स्थितियाँ और स्थानीय संदर्भ")[1]
  ?.split("## शहर-विशेष focus और care context")[0];
const cityFaqContextSection = sectionBetween(
  routeCopy,
  "## शहर-विशेष focus और care context",
  "## स्थानीय कार्ड के विवरण",
);
const nearMeFaqSection = sectionBetween(
  routeCopy,
  "## अतिरिक्त “near me” FAQ — 8 शहर",
  "## समीक्षकों के लिए सीमाएँ",
);
if (!metadataSection || !contextSection) {
  throw new Error("Hindi city route generation failed: expected route metadata sections are missing.");
}

const metadataRows = parseTable(metadataSection, 4);
const contextRows = parseTable(contextSection, 7);
const contextsBySlug = new Map(contextRows.map((row) => [row[0], row]));
const faqContextBySlug = new Map(
  parseTable(cityFaqContextSection, 3).map(([slug, localFocus, careContext]) => [
    slug,
    {
      localFocus: localFocus.replace(/^साझा fallback:\s*/u, ""),
      careContext: careContext.replace(/^साझा fallback:\s*/u, ""),
    },
  ]),
);
const nearMeQuestionBySlug = new Map(
  parseTable(nearMeFaqSection, 2).map(([slug, question]) => [slug, question]),
);

if (metadataRows.length !== 45 || contextsBySlug.size !== 45) {
  throw new Error(
    `Hindi city route generation expected 45 metadata and context rows; found ${metadataRows.length} and ${contextsBySlug.size}.`,
  );
}

const journalCardSection = sectionBetween(
  journalCopy,
  "## अनुवादित कार्ड",
  "## Faridabad और Gurugram के अतिरिक्त Journal अनुभाग",
);
const journalCards = Object.fromEntries(
  journalCardSection
    .split(/\r?\n/)
    .map((line) =>
      line.match(/^\s*\d+\.\s+`([^`]+)`\s+—\s+(.+?)\s+\|\s+(.+?)\s*$/u),
    )
    .filter(Boolean)
    .map(([, slug, title, excerpt]) => [slug, { slug, title, excerpt }]),
);
if (Object.keys(journalCards).length !== 139) {
  throw new Error(`Expected 139 approved Hindi Journal cards, found ${Object.keys(journalCards).length}.`);
}

const extraJournalSections = {
  faridabad: {
    eyebrow: "पुनर्वास जर्नल से",
    heading: "कमर के निचले हिस्से और पैर के दर्द को समझना",
    introduction: "लम्बर डिस्क के लक्षणों, चेतावनी संकेतों और आकलन पर आधारित पुनर्वास की संरचित मार्गदर्शिका—फरीदाबाद में देखभाल की व्यवस्था कर रहे लोगों के लिए।",
    slug: "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1",
    title: "लम्बर स्लिप्ड डिस्क: L3–L4, L4–L5 और L5–S1 के लक्षण और पुनर्वास",
    excerpt: "लम्बर स्लिप्ड डिस्क के लक्षणों, कमर के निचले हिस्से के आम दर्द-पैटर्न, आकलन, इमेजिंग, पुनर्वास और तत्काल चिकित्सकीय जाँच की ज़रूरत कब हो सकती है—इस पर सुरक्षा-केंद्रित विस्तृत मार्गदर्शिका।",
  },
  gurgaon: {
    eyebrow: "पुनर्वास जर्नल से",
    heading: "त्वचा के लक्षण, सूजन और सुरक्षित अगले कदम",
    introduction: "त्वचा की सूजन के लक्षणों पर विचार करते हुए सहायता की व्यवस्था कर रहे लोगों के लिए पोषण और देखभाल संबंधी सुरक्षा-केंद्रित मार्गदर्शिका।",
    slug: "skin-inflammation-vasculitis-diet-guide",
    title: "त्वचा की सूजन और वैस्कुलाइटिस: पोषण, लक्षण और देखभाल",
    excerpt: "त्वचा की सूजन के लक्षण, वैस्कुलाइटिस के चेतावनी संकेत, संतुलित आहार सहायता, supplements को लेकर सावधानियाँ और सही देखभाल के रास्ते पर पोषण-केंद्रित, सुरक्षा-प्रथम मार्गदर्शिका।",
  },
};

const journalAssignmentsSection = sectionBetween(
  journalCopy,
  "## हर शहर route पर दिखने वाले Journal-card slugs",
  "",
);
const journalSlugsByCity = new Map(
  parseTable(journalAssignmentsSection, 2).map(([citySlug, slugs]) => [
    citySlug,
    /^No city Journal cards/u.test(slugs)
      ? []
      : slugs.split(";").map((value) => value.trim()).filter(Boolean),
  ]),
);

const cityFocusSection = sectionBetween(
  routeCopy,
  "## स्थानीय कार्ड के विवरण",
  "## अतिरिक्त “near me” FAQ — 8 शहर",
);
const cityFocus = {};
const citySlugByFocusHeading = new Map([
  ["Jaipur", "jaipur"],
  ["Delhi", "delhi"],
  ["Gurugram", "gurgaon"],
  ["Faridabad", "faridabad"],
  ["Tigaon", "tigaon"],
  ["Bengaluru", "bengaluru"],
  ["Mumbai", "mumbai"],
  ["Moradabad", "moradabad"],
]);
const citySlugsWithCustomLocalities = new Set(citySlugByFocusHeading.values());
for (const match of cityFocusSection.matchAll(/^###\s+([^\r\n]+)\s*$(.*?)(?=^###\s+|^##\s+|$(?![\s\S]))/gmsu)) {
  const [, cityName, body] = match;
  const citySlug = citySlugByFocusHeading.get(cityName.trim());
  if (citySlug) {
    cityFocus[citySlug] = body
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .join("\n");
  }
}

const citySlugByReviewHeading = new Map([
  ["Jaipur", "jaipur"],
  ["Delhi", "delhi"],
  ["Gurugram", "gurgaon"],
  ["Faridabad", "faridabad"],
  ["Bengaluru", "bengaluru"],
]);
const testimonials = [];
for (const sectionMatch of testimonialCopy.matchAll(/^##\s+([^\r\n]+)\s*$(.*?)(?=^##\s+|$(?![\s\S]))/gmsu)) {
  const [, sectionName, sectionBody] = sectionMatch;
  const citySlug = citySlugByReviewHeading.get(sectionName.trim());
  if (!citySlug) continue;
  for (const recordMatch of sectionBody.matchAll(/^###\s+(.+?)\s+—\s+(.+?)\s*$(.*?)(?=^###\s+|^##\s+|$(?![\s\S]))/gmsu)) {
    const [, author, service, recordBody] = recordMatch;
    const label = recordBody.match(/^\*\*हिन्दी स्थिति\/सेवा label:\*\*\s*(.+)$/mu)?.[1]?.trim();
    const approvedQuoteSection = recordBody.split("**प्रस्तावित हिन्दी अनुभव**")[1] ?? "";
    const quote = approvedQuoteSection
      .split(/\r?\n/)
      .filter((line) => line.trim().startsWith(">"))
      .map((line) => line.replace(/^\s*>\s?/u, "").trim())
      .join("\n");
    if (!label || !quote) {
      throw new Error(`Hindi testimonial ${author} is missing its approved label or quote.`);
    }
    testimonials.push({
      citySlug,
      author: author.trim(),
      service: service.trim(),
      label,
      quote,
    });
  }
}
if (testimonials.length !== 16) {
  throw new Error(`Expected 16 city-specific Hindi testimonials, found ${testimonials.length}.`);
}

const cityFaqSection = sectionBetween(templateCopy, "## शहर के FAQ", "## अंतिम CTA");
const sharedFaqTemplates = [...cityFaqSection.matchAll(
  /^\d+\.\s+\*\*(.*?)\*\*\s*\r?\n\s*(.*?)(?=^\d+\.\s+|\s*$)/gmsu,
)].map(([, question, answer]) => ({
  question: question.trim(),
  answer: answer.trim().replace(/`/gu, ""),
}));

const cityRoutes = metadataRows.map(([slug, displayName, stateName, h1]) => {
  const row = contextsBySlug.get(slug);
  if (!row) throw new Error(`Hindi city route ${slug} is missing its approved locality and care context.`);

  const conditions = row[1].split(";").map((value) => value.trim()).filter(Boolean);
  const localityReferences = row[2].split(";").map((value) => value.trim()).filter(Boolean);
  const localities = row[3].split(";").map((value) => value.trim()).filter(Boolean);
  const relatedCitySlugs = row[4]
    .split(";")
    .map((value) => value.trim())
    .filter((value) => /^[a-z][a-z0-9-]*$/.test(value));
  const reviews = row[6].includes("शहर-विशिष्ट testimonial उपलब्ध नहीं")
    ? []
    : row[6]
      .replace(/^provider-team:\s*/, "")
      .split(";")
      .map((value) => value.trim())
      .filter(Boolean);
  const sourceThemes = themesBySlug.get(slug);
  if (!sourceThemes?.length) throw new Error(`Hindi city route ${slug} is missing its service-theme assignments.`);
  const unlabelledThemes = sourceThemes.filter((theme) => !themeLabelBySource.has(theme));
  if (unlabelledThemes.length) {
    throw new Error(`Hindi service-theme labels are missing for ${slug}: ${unlabelledThemes.join(", ")}`);
  }
  const journalSlugs = journalSlugsByCity.get(slug) ?? [];
  const assignedCards = journalSlugs.map((journalSlug) => {
    const card = journalCards[journalSlug];
    if (!card) throw new Error(`Hindi Journal card ${journalSlug} assigned to ${slug} is missing.`);
    return card;
  });
  const routeTestimonials = reviews.map((author) => {
    const record = testimonials.find((item) => item.author === author);
    if (!record) {
      throw new Error(`Hindi route ${slug} references reviewer ${author} without an approved translated quote.`);
    }
    return record;
  });

  if (conditions.length < 2 || localities.length < 3) {
    throw new Error(`Hindi city route ${slug} is missing its approved conditions or locality references.`);
  }

  const title = `${displayName} में घर पर फिजियोथेरेपी | Goswami Rehab`;
  const description =
    `${displayName} में घर पर फिजियोथेरेपी—${conditions.slice(0, 2).join(" और ")} के पुनर्वास पर चर्चा करें। ` +
    "सही इलाका बताएँ; टीम मुलाक़ात से पहले फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करेगी।";

  return {
    slug,
    displayName,
    stateName,
    h1,
    title,
    description,
    conditions,
    conditionLabels: conditions,
    localFocus: faqContextBySlug.get(slug)?.localFocus ?? "",
    careContext:
      faqContextBySlug.get(slug)?.careContext ??
      "व्यक्ति के घर, मौजूदा कार्यक्षमता और सुरक्षित अभ्यास की ज़रूरत वाली गतिविधियों को ध्यान में रखें",
    primaryCondition: conditions[0],
    localityReferences,
    localities,
    relatedCitySlugs,
    serviceThemes: sourceThemes.map((sourceTitle) => ({
      sourceTitle,
      title: themeLabelBySource.get(sourceTitle),
    })),
    journalCards: assignedCards,
    specialJournalSection: extraJournalSections[slug] ?? null,
    focusCopy: cityFocus[slug] ?? "",
    localityFaqs: citySlugsWithCustomLocalities.has(slug) ? localities.slice(0, 4) : [],
    nearMeQuestion: nearMeQuestionBySlug.get(slug) ?? "",
    faqs: sharedFaqTemplates,
    testimonials: routeTestimonials,
    confirmationWindow: row[5],
    reviewNames: reviews,
    reviewMode: row[6].startsWith("provider-team:") ? "provider-team" : "city",
    revision: {
      template: "city-template-r1",
      route: "city-routes-r1",
      journal: "city-journal-teasers-r1",
      testimonials: "testimonials-r1",
    },
  };
});

const routesBySlug = new Map(cityRoutes.map((route) => [route.slug, route]));
if (routesBySlug.size !== 45) throw new Error("Hindi city route slugs must be unique.");
for (const route of cityRoutes) {
  validateApprovalLink(
    `/hi/physiotherapist-at-home/${route.slug}`,
    Object.values(route.revision),
  );
}

const destination = path.join(artifactDir, "src/lib/hindi-city-routes.generated.json");
fs.writeFileSync(destination, `${JSON.stringify(cityRoutes, null, 2)}\n`, "utf8");
console.log(`Generated ${cityRoutes.length} approved Hindi city route records.`);