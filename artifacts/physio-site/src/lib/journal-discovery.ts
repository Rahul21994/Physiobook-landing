import type { BlogPost } from "./data";

export type JournalGroupId =
  | "pain-movement"
  | "neurological-recovery"
  | "surgery-orthopaedic"
  | "heart-lungs-complex"
  | "nutrition-guidance"
  | "work-sport-function"
  | "homecare-city";

export type JournalPostIdentity = Pick<BlogPost, "category" | "slug">;

export type JournalGroupDefinition = {
  id: JournalGroupId;
  heading: string;
  description: string;
  matches: (post: JournalPostIdentity) => boolean;
};

const CITY_ARTICLE_SUFFIX = /(?:faridabad|gurugram|gurgaon|jaipur|delhi|bengaluru|tigaon|moradabad|chandigarh|ahmedabad|lucknow|mumbai|pune|hyderabad|noida|amritsar|ludhiana|kochi|thiruvananthapuram|kozhikode|visakhapatnam|nagpur|guwahati|kolkata|chennai|coimbatore|madurai|mysuru|mangaluru|surat|vadodara|kanpur|varanasi|bhopal|agra|prayagraj|jodhpur|udaipur|indore|patna|ranchi|bhubaneswar)$/i;
const INDIA_HOMECARE_SLUG = "physiotherapist-at-home-india-guide";

export const journalGroupDefinitions: JournalGroupDefinition[] = [
  {
    id: "pain-movement",
    heading: "Pain, posture & everyday movement",
    description: "Practical guides for understanding pain, mobility, posture, and comfortable everyday movement.",
    matches: (post) =>
      post.category === "Ortho Rehabilitation" &&
      !/(replacement|fracture|surgery|lumbar-slipped-disc)/i.test(post.slug) &&
      !CITY_ARTICLE_SUFFIX.test(post.slug),
  },
  {
    id: "neurological-recovery",
    heading: "Neurological recovery",
    description: "Rehabilitation guidance for stroke, balance, Parkinson’s disease, brain injury, and neurological recovery.",
    matches: (post) =>
      post.category === "Neuro Rehabilitation" &&
      post.slug !== "complex-case-recovery-physiotherapy" &&
      !CITY_ARTICLE_SUFFIX.test(post.slug),
  },
  {
    id: "surgery-orthopaedic",
    heading: "Surgery & orthopaedic recovery",
    description: "Recovery guides for surgery, fractures, joint replacement, and orthopaedic rehabilitation.",
    matches: (post) =>
      (post.category === "Orthopaedic Rehabilitation" ||
        (post.category === "Ortho Rehabilitation" &&
          /(replacement|fracture|surgery|lumbar-slipped-disc)/i.test(post.slug))) &&
      !CITY_ARTICLE_SUFFIX.test(post.slug),
  },
  {
    id: "heart-lungs-complex",
    heading: "Heart, lungs & complex recovery",
    description: "Evidence-informed reading about breathing, cardiopulmonary care, and recovery after complex illness.",
    matches: (post) =>
      !CITY_ARTICLE_SUFFIX.test(post.slug) &&
      (post.category === "Cardiopulmonary Rehabilitation" ||
        post.category === "Pulmonary Rehabilitation" ||
        post.slug === "complex-case-recovery-physiotherapy"),
  },
  {
    id: "nutrition-guidance",
    heading: "Nutrition & clinical guidance",
    description: "Practical nutrition and clinical guidance to help patients prepare better questions for their care team.",
    matches: (post) =>
      post.category === "Nutrition & Clinical Guidance" &&
      !CITY_ARTICLE_SUFFIX.test(post.slug),
  },
  {
    id: "work-sport-function",
    heading: "Work, sport & daily function",
    description: "Guides for work demands, sport, independence, and meaningful daily activities.",
    matches: (post) =>
      ["Functional Rehabilitation", "Occupational Therapy", "Sports Rehabilitation", "Women's Health", "Paediatric Rehabilitation"].includes(
        post.category,
      ) && !CITY_ARTICLE_SUFFIX.test(post.slug),
  },
  {
    id: "homecare-city",
    heading: "Homecare and city guides",
    description: "Learn how home physiotherapy works, what to expect from an assessment, and how local enquiries are coordinated.",
    matches: (post) =>
      post.category === "Homecare Guide" ||
      post.category === "City Guide" ||
      CITY_ARTICLE_SUFFIX.test(post.slug) ||
      (post.category === "Exercise Physiology" && CITY_ARTICLE_SUFFIX.test(post.slug)),
  },
];

export function normalizeJournalSearchTerm(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase().trim().replace(/\s+/g, " ");
}

export function getJournalSearchText(post: BlogPost): string {
  return normalizeJournalSearchTerm(
    [post.title, post.category, post.excerpt, post.content].join(" "),
  );
}

export function searchJournalPosts(posts: BlogPost[], query: string): BlogPost[] {
  const normalizedQuery = normalizeJournalSearchTerm(query);
  if (!normalizedQuery) return posts;

  const keywords = normalizedQuery.split(" ");
  return posts.filter((post) => {
    const searchableText = getJournalSearchText(post);
    return keywords.every((keyword) => searchableText.includes(keyword));
  });
}

export function getJournalGroupMatches(
  post: JournalPostIdentity,
): JournalGroupDefinition[] {
  return journalGroupDefinitions.filter((group) => group.matches(post));
}

export function getJournalGroup(
  post: JournalPostIdentity,
): JournalGroupDefinition {
  const matches = getJournalGroupMatches(post);
  if (matches.length !== 1) {
    throw new Error(
      `Expected exactly one homepage Journal group for "${post.slug}", found ${matches.length}`,
    );
  }
  return matches[0];
}

export function groupJournalPosts<T extends JournalPostIdentity>(
  posts: readonly T[],
): Array<JournalGroupDefinition & { posts: T[] }> {
  return journalGroupDefinitions.map((group) => ({
    ...group,
    posts: posts.filter((post) => group.matches(post)),
  }));
}

export function getNeutralJournalFallback<T extends JournalPostIdentity>(
  posts: readonly T[],
): T | null {
  return posts.find((post) => post.slug === INDIA_HOMECARE_SLUG) ?? null;
}

export function searchJournalSummaries<T extends JournalPostIdentity & Pick<BlogPost, "title" | "excerpt">>(
  posts: readonly T[],
  query: string,
): T[] {
  const normalizedQuery = normalizeJournalSearchTerm(query);
  if (!normalizedQuery) return [...posts];

  const keywords = normalizedQuery.split(" ");
  return posts.filter((post) => {
    const searchableText = normalizeJournalSearchTerm(
      [post.title, post.category, post.excerpt].join(" "),
    );
    return keywords.every((keyword) => searchableText.includes(keyword));
  });
}