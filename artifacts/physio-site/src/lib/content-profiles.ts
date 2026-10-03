export type BlogAuthorProfile = {
  name: string;
  role: string;
  credential: string;
  bio: string;
};

export const BLOG_AUTHOR_PROFILE = {
  name: "Dr. Rahul Goswami, PT",
  role: "Senior Physiotherapist",
  credential: "Exercise Physiologist",
  bio: "Dr. Rahul Goswami is a Senior Physiotherapist and Exercise Physiologist. He writes about home-based rehabilitation, movement, exercise, and practical recovery support.",
} as const;

export const BLOG_NUTRITION_AUTHOR_PROFILE = {
  name: "Dr. Rahul Goswami, PT",
  role: "Nutritionist",
  credential: "Nutrition and recovery guidance",
  bio: "Dr. Rahul Goswami is the nutritionist responsible for this practical guide. His work connects nutrition guidance with rehabilitation, exercise, and safe recovery support.",
} as const;

export const BLOG_REVIEWER_PROFILE = {
  name: "Dr. Prakriti Sharma",
} as const;

export const BLOG_AUTHOR = BLOG_AUTHOR_PROFILE.name;