import type { BlogPostSummary } from "./blog-index";

export type CityJournalPostSummary = BlogPostSummary & {
  citySlug: string;
  discipline?: "physiotherapy" | "nutrition" | "exercise-physiology";
};

import { cityJournalIndex } from "./city-journal-index.generated";

export { cityJournalIndex };

export function getCityJournalPostSummaries(citySlug: string): CityJournalPostSummary[] {
  return cityJournalIndex.filter((post) => post.citySlug === citySlug);
}