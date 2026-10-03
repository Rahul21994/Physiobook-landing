export type BlogPostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  isoDate: string;
  category: string;
  image: string;
  author: string;
};

export { blogIndex, journalDiscoveryIndex } from "./blog-index.generated";