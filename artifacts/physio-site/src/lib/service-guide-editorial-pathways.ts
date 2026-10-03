import type { ServiceGuide } from "./service-guides";
import { journalDiscoveryIndex as blogIndex } from "./blog-index";

export type ServiceGuideEditorialLink = {
  href: string;
  label: string;
  excerpt: string;
};

export type ServiceGuideEditorialPathway = Record<
  string,
  Array<[slug: string, label: string]>
>;

function shortenLabel(label: string, maxLength = 48): string {
  const characters = Array.from(label.trim());
  if (characters.length <= maxLength) return characters.join("");
  const cut = characters.slice(0, maxLength - 1).join("");
  const wordBoundary = cut.lastIndexOf(" ");
  const readableCut = cut.slice(
    0,
    wordBoundary > maxLength * 0.55 ? wordBoundary : cut.length,
  );
  return `${readableCut.trimEnd()}…`;
}

const topicStopWords = new Set([
  "and", "the", "for", "with", "from", "into", "after", "before", "when", "what",
  "your", "you", "can", "may", "should", "that", "this", "their", "they", "them",
  "about", "around", "within", "where", "which", "while", "through", "based",
  "home", "online", "service", "services", "care", "guide", "rehabilitation", "rehab",
  "physiotherapy", "physio", "recovery", "support", "program", "programs", "treatment",
  "everyday", "daily", "movement", "strength", "functional", "function", "mobility",
  "task", "tasks", "routine", "routines", "programme", "plan", "plans", "activity",
  "activities", "practice", "monitoring", "capacity", "safe", "safely", "options",
  "readers", "goal", "goals",
]);

const topicTokenAliases: Record<string, string> = {
  parkinsons: "parkinson",
  developmental: "development",
  children: "child",
  childrens: "child",
  pediatric: "child",
  paediatric: "child",
  cervical: "neck",
  lumbar: "back",
  postnatal: "postpartum",
  childbirth: "postpartum",
  osteoarthritis: "arthritis",
  physiology: "physiologist",
  telerehabilitation: "online",
  telehealth: "online",
  preterm: "infant",
};

const broadTopicTokens = new Set([
  "assessment", "consultation", "management", "pain", "support", "exercise",
]);

const curatedEditorialSlugs: Record<string, string[]> = {
  "homecare-physiotherapy": [
    "physiotherapist-at-home-lucknow",
    "physiotherapist-at-home-mysuru",
    "physiotherapist-at-home-kochi",
  ],
  "clinical-assessment-evaluation": [
    "first-physiotherapy-assessment-guide",
    "dizziness-balance-assessment-physiotherapy-lucknow",
    "physiotherapy-for-low-back-pain",
  ],
  "back-pain-physiotherapy": [
    "sciatica-physiotherapy-treatment-guide",
    "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1",
  ],
  "knee-pain-physiotherapy": [
    "knee-replacement-recovery-guide",
    "knee-replacement-swelling-load-tolerance-exercise-surat",
  ],
  "stroke-rehabilitation": [
    "stroke-physiotherapy-assessment-home-ahmedabad",
    "upper-limb-task-retraining-after-stroke-hyderabad",
    "stroke-rehabilitation-home-practical-progress-lucknow",
  ],
  "post-surgery-rehabilitation": [
    "post-surgery-stairs-community-mobility-pune",
  ],
  "pain-management-physiotherapy": [
    "neck-pain-cervical-stiffness-physiotherapy",
    "tfcc-overuse-pain-rehabilitation-guide",
    "physiotherapy-for-low-back-pain",
  ],
  "pregnancy-postpartum-support": [
    "moving-during-pregnancy-exercise-screening-bengaluru",
    "pelvic-floor-physiotherapy-after-childbirth-delhi",
    "first-physiotherapy-assessment-guide",
  ],
  "infant-early-development-physiotherapy": [
    "preterm-birth-developmental-follow-up-questions-bengaluru",
    "home-physiotherapy-developmental-motor-delay-tigaon",
    "child-disability-rehabilitation-play-routines-participation-bengaluru",
  ],
  "pediatric-disability-rehabilitation": [
    "child-disability-rehabilitation-play-routines-participation-bengaluru",
    "home-physiotherapy-developmental-motor-delay-tigaon",
    "preterm-birth-developmental-follow-up-questions-bengaluru",
  ],
  "online-physiotherapy": [
    "stroke-telerehabilitation-caregiver-coaching-chennai",
    "first-physiotherapy-assessment-guide",
    "physiotherapy-for-low-back-pain",
  ],
  "neck-pain": [
    "neck-pain-cervical-stiffness-physiotherapy",
    "physiotherapy-for-low-back-pain",
    "first-physiotherapy-assessment-guide",
  ],
  sciatica: [
    "sciatica-physiotherapy-treatment-guide",
    "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1",
    "physiotherapy-for-low-back-pain",
  ],
  "arthritis-osteoarthritis": [
    "knee-osteoarthritis-physiotherapy-guide",
    "knee-replacement-recovery-guide",
    "hip-replacement-homecare-physiotherapy",
  ],
  "weight-management": [
    "diet-and-fat-loss",
    "geriatric-rehabilitation-appetite-chewing-weight-questions-madurai",
    "pulmonary-rehabilitation-meal-fatigue-weight-change-mangaluru",
  ],
};

function getTopicTokens(value: string): Set<string> {
  return new Set(
    value
      .toLowerCase()
      .replace(/&/g, " ")
      .split(/[^a-z0-9]+/)
      .map((token) => topicTokenAliases[token] ?? token)
      .filter((token) => token.length > 2 && !topicStopWords.has(token)),
  );
}

function getSharedTopicScore(left: Set<string>, right: Set<string>, weight: number): number {
  return [...left].reduce((score, token) => {
    if (!right.has(token)) return score;
    return score + weight * (broadTopicTokens.has(token) ? 0.2 : 1);
  }, 0);
}

export function getServiceGuideEditorialPathway(
  guide: ServiceGuide,
): ServiceGuideEditorialLink[] {
  const authoredPosts = (guide.relatedLinks ?? [])
    .filter((link) => link.href.startsWith("/blog/"))
    .map((link) => {
      const slug = link.href.slice("/blog/".length).split(/[?#]/)[0];
      const post = blogIndex.find((candidate) => candidate.slug === slug);
      return post ? { href: link.href, label: link.label, excerpt: post.excerpt } : null;
    })
    .filter((link): link is ServiceGuideEditorialLink => Boolean(link));
  const preferredPosts = (curatedEditorialSlugs[guide.slug] ?? [])
    .map((slug) => {
      const post = blogIndex.find((candidate) => candidate.slug === slug);
      return post ? { href: `/blog/${post.slug}`, label: post.title, excerpt: post.excerpt } : null;
    })
    .filter((link): link is ServiceGuideEditorialLink => Boolean(link));
  const preferredHrefs = new Set([...authoredPosts, ...preferredPosts].map((link) => link.href));
  const primaryGuideTokens = getTopicTokens(
    `${guide.slug} ${guide.title} ${guide.shortTitle} ${guide.breadcrumbParent ?? ""}`,
  );
  const coverTokens = getTopicTokens(guide.covers.join(" "));
  const summaryTokens = getTopicTokens(guide.summary);
  const scoredPosts = blogIndex
    .filter((post) => !preferredHrefs.has(`/blog/${post.slug}`))
    .map((post) => {
      const titleTokens = getTopicTokens(`${post.slug} ${post.title}`);
      const detailTokens = getTopicTokens(`${post.excerpt} ${post.category}`);
      const score =
        getSharedTopicScore(primaryGuideTokens, titleTokens, 6) +
        getSharedTopicScore(primaryGuideTokens, detailTokens, 0.25) +
        getSharedTopicScore(coverTokens, titleTokens, 2) +
        getSharedTopicScore(coverTokens, detailTokens, 0.15) +
        getSharedTopicScore(summaryTokens, titleTokens, 0.5) +
        getSharedTopicScore(summaryTokens, detailTokens, 0.05);
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.isoDate.localeCompare(a.post.isoDate) ||
        a.post.slug.localeCompare(b.post.slug),
    )
    .map(({ post }) => ({
      href: `/blog/${post.slug}`,
      label: post.title,
      excerpt: post.excerpt,
    }));

  return [...authoredPosts, ...preferredPosts, ...scoredPosts]
    .filter((link, index, links) => links.findIndex((candidate) => candidate.href === link.href) === index)
    .slice(0, 3);
}

export function createServiceGuideEditorialPathways(
  guides: ServiceGuide[],
): ServiceGuideEditorialPathway {
  return Object.fromEntries(guides.map((guide) => [
    guide.slug,
    getServiceGuideEditorialPathway(guide).map(({ href, label }) => [
      href.slice("/blog/".length),
      shortenLabel(label),
    ] as [string, string]),
  ]));
}