import type { BlogPost } from "./data";
import { getJournalGroupMatches } from "./journal-discovery";

export type ContextualLink = {
  href: string;
  label: string;
  description: string;
};

const categoryServiceLinks: Record<string, ContextualLink> = {
  "Neuro Rehabilitation": {
    href: "/stroke-rehab",
    label: "Stroke rehabilitation support",
    description: "See how assessment-led neurorehabilitation can be planned around home and daily function.",
  },
  "Cardiopulmonary Rehabilitation": {
    href: "/services/cardiopulmonary-rehabilitation",
    label: "Cardiopulmonary rehabilitation",
    description: "Learn how breathing, endurance, pacing, and safety checks fit into recovery.",
  },
  "Pulmonary Rehabilitation": {
    href: "/services/cardiopulmonary-rehabilitation",
    label: "Pulmonary rehabilitation",
    description: "Explore a structured approach to breathing, activity, and everyday confidence.",
  },
  "Nutrition & Clinical Guidance": {
    href: "/nutritionist-dietitian-online",
    label: "Nutritional consultation",
    description: "Discuss food, hydration, recovery, and safety questions with the right professional.",
  },
  "Sports Rehabilitation": {
    href: "/sports-injury-rehabilitation",
    label: "Sports enhancement consultation",
    description: "Plan a measured return to training with movement, workload, and recovery in view.",
  },
  "Functional Rehabilitation": {
    href: "/services/functional-training",
    label: "Functional training",
    description: "Build practical movement around the activities that matter in everyday life.",
  },
  "Occupational Therapy": {
    href: "/services/functional-training",
    label: "Functional training",
    description: "Connect rehabilitation with daily tasks, independence, and meaningful routines.",
  },
  "Women's Health": {
    href: "/services/functional-training",
    label: "Functional rehabilitation",
    description: "Discuss safe, respectful movement support around everyday function and recovery.",
  },
  "Paediatric Rehabilitation": {
    href: "/services/rehabilitation-programs",
    label: "Rehabilitation programmes",
    description: "Explore assessment-led support shaped around a child’s goals and wider care team.",
  },
  "Orthopaedic Rehabilitation": {
    href: "/services/rehabilitation-programs",
    label: "Orthopaedic rehabilitation",
    description: "Understand how mobility, strength, balance, and daily tasks can be progressed safely.",
  },
};

const fallbackServiceLink: ContextualLink = {
  href: "/home-physiotherapy",
  label: "Homecare physiotherapy",
  description: "See what an assessment-led home physiotherapy visit can include.",
};

const articleServiceLinkOverrides: Record<string, ContextualLink> = {
  "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1": {
    href: "/online-physiotherapy",
    label: "Online physiotherapy",
    description: "Discuss whether an online physiotherapy review fits your symptoms and current plan.",
  },
  "exercise-physiology-home-space-energy-jodhpur": {
    href: "/exercise-physiologist",
    label: "Exercise physiology",
    description: "Explore how exercise physiology can support movement, conditioning, and daily activity.",
  },
  "neck-pain-cervical-stiffness-physiotherapy": {
    href: "/neck-pain",
    label: "Neck pain physiotherapy",
    description: "Review assessment and movement options for neck pain and stiffness.",
  },
  "sciatica-physiotherapy-treatment-guide": {
    href: "/sciatica",
    label: "Sciatica physiotherapy",
    description: "Explore how physiotherapy assessment can guide sciatica-related symptoms.",
  },
  "knee-osteoarthritis-physiotherapy-guide": {
    href: "/arthritis-osteoarthritis",
    label: "Arthritis and osteoarthritis care",
    description: "Learn how exercise and functional goals can support osteoarthritis care.",
  },
  "parkinsons-physiotherapy-guide": {
    href: "/parkinsons-rehab",
    label: "Parkinson’s rehabilitation",
    description: "Explore rehabilitation support for movement, balance, and daily routines.",
  },
  "diet-and-fat-loss": {
    href: "/weight-management",
    label: "Weight management",
    description: "Discuss individualized movement and practical goals for weight management.",
  },
};

export function getArticleServiceLink(
  post: Pick<BlogPost, "category" | "slug">,
): ContextualLink {
  const articleOverride = articleServiceLinkOverrides[post.slug];
  if (articleOverride) return articleOverride;

  if (/knee/i.test(post.slug)) {
    return {
      href: "/knee-pain",
      label: "Knee pain physiotherapy",
      description: "Learn how knee symptoms, strength, walking, and daily activity can be assessed.",
    };
  }

  if (/back|lumbar|neck/i.test(post.slug)) {
    return {
      href: "/back-pain",
      label: "Back pain physiotherapy",
      description: "Understand how assessment and progressive movement can guide persistent pain care.",
    };
  }

  if (/surgery|replacement|fracture/i.test(post.slug)) {
    return {
      href: "/post-surgery-rehab",
      label: "Post-surgery rehabilitation",
      description: "Review how recovery can be paced around medical instructions and daily goals.",
    };
  }

  return categoryServiceLinks[post.category] ?? fallbackServiceLink;
}

export function getRelatedJournalPosts<T extends Pick<BlogPost, "id" | "category" | "slug" | "isoDate">>(
  post: Pick<BlogPost, "id" | "category" | "slug">,
  posts: readonly T[],
  limit = 3,
): T[] {
  const groupIds = new Set(getJournalGroupMatches(post).map((group) => group.id));

  return posts
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const candidateGroups = getJournalGroupMatches(candidate);
      const sameGroup = candidateGroups.some((group) => groupIds.has(group.id));
      const sameCategory = candidate.category === post.category;
      return {
        candidate,
        score: (sameGroup ? 2 : 0) + (sameCategory ? 1 : 0),
      };
    })
    .sort((a, b) => b.score - a.score || b.candidate.isoDate.localeCompare(a.candidate.isoDate))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}