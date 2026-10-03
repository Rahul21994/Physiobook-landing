import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { journalDiscoveryIndex as blogIndex } from "@/lib/blog-index";
import { BookOpen, Search } from "lucide-react";
import { JournalCard } from "@/components/JournalCard";
import {
  normalizeJournalSearchTerm,
  searchJournalPosts,
  searchJournalSummaries,
} from "@/lib/journal-discovery";
import { trackEvent } from "@/lib/analytics";
import "@/journal.css";

// Derive sorted unique categories from post data
const allCategories = Array.from(new Set(blogIndex.map((p) => p.category))).sort();
const discoverySlugs = [
  "ankle-sprain-rehabilitation-guide",
  "frozen-shoulder-physiotherapy-treatment",
  "plantar-fasciitis-physiotherapy-guide",
  "physiotherapist-at-home-bengaluru",
  "physiotherapist-at-home-delhi",
  "physiotherapist-at-home-jaipur",
  "physiotherapist-at-home-india-guide",
] as const;

export default function BlogList() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const activeQuery = new URLSearchParams(search).get("search") ?? "";
  const [searchInput, setSearchInput] = useState(activeQuery);
  const [fullContentSearch, setFullContentSearch] = useState<{
    query: string;
    ids: Set<string>;
  } | null>(null);

  useEffect(() => {
    setSearchInput(activeQuery);
  }, [activeQuery]);

  useEffect(() => {
    if (!activeQuery) {
      setFullContentSearch(null);
      return;
    }

    let cancelled = false;
    setFullContentSearch(null);
    void import("@/lib/data").then(({ blogPosts }) => {
      if (cancelled) return;
      setFullContentSearch({
        query: activeQuery,
        ids: new Set(searchJournalPosts(blogPosts, activeQuery).map((post) => post.id)),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [activeQuery]);

  const sortedPosts = [...blogIndex].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
  const summarySearchedPosts = searchJournalSummaries(sortedPosts, activeQuery);
  const searchedPosts =
    activeQuery && fullContentSearch?.query === activeQuery
      ? sortedPosts.filter((post) => fullContentSearch.ids.has(post.id))
      : summarySearchedPosts;
  const filteredPosts = activeCategory
    ? searchedPosts.filter((p) => p.category === activeCategory)
    : searchedPosts;
  const showAllCards = Boolean(activeQuery || activeCategory);
  const initialCards = filteredPosts.slice(0, 8);
  const pinnedPost = filteredPosts.find((post) => post.slug === "stroke-rehabilitation-at-home");
  const visibleCards = showAllCards
    ? filteredPosts
    : pinnedPost && !initialCards.some((post) => post.id === pinnedPost.id)
      ? [...initialCards.slice(0, 7), pinnedPost]
      : initialCards;
  const visibleCardIds = new Set(visibleCards.map((post) => post.id));
   const compactPosts = showAllCards
     ? []
     : filteredPosts
         .filter((post) => !visibleCardIds.has(post.id))
         .slice(0, 24);
   const hiddenCompactPostCount = showAllCards
     ? 0
     : Math.max(filteredPosts.length - visibleCards.length - compactPosts.length, 0);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = normalizeJournalSearchTerm(searchInput);
    trackEvent("journal_search_submit", {
      route: "/blog",
      has_query: Boolean(query),
      result_count: searchJournalSummaries(sortedPosts, query).length,
    });
    setLocation(query ? `/blog?search=${encodeURIComponent(query)}` : "/blog");
  };

  const selectCategory = (category: string | null) => {
    const nextCategory = category === activeCategory ? null : category;
    trackEvent("journal_category_filter", {
      route: "/blog",
      category: nextCategory ?? "all",
      result_count: nextCategory
        ? searchedPosts.filter((post) => post.category === nextCategory).length
        : searchedPosts.length,
    });
    setActiveCategory(nextCategory);
  };

  return (
    <div className="min-h-screen bg-background py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        
        <div className="max-w-3xl mb-16">
          <div className="flex items-center gap-2 text-primary font-medium mb-4">
            <BookOpen className="w-5 h-5" />
            <span>Goswami Rehab Journal</span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            Physiotherapy & Rehabilitation — Expert Guides
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            New 2026 treatment guides and established evidence-based articles on pain, mobility, surgery recovery, neuro-rehabilitation, cardiopulmonary care, and home physiotherapy from our pan-India specialist team.
          </p>
          <form className="mt-8 flex flex-col gap-3 sm:flex-row" onSubmit={submitSearch} role="search">
            <label htmlFor="journal-search" className="sr-only">Search the Journal</label>
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <input
                id="journal-search"
                name="search"
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search pain, stroke, homecare, recovery..."
                className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button type="submit" className="h-12 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Search
            </button>
          </form>
        </div>

        {/* Category filter chips */}
        <section className="mb-10" aria-labelledby="journal-category-filters-heading">
          <h2 id="journal-category-filters-heading" className="sr-only">Filter Journal articles by category</h2>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            <button
              onClick={() => selectCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                   : "bg-background text-foreground border-border hover:border-primary/50 hover:text-primary"
              }`}
              aria-pressed={activeCategory === null}
            >
              All
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => selectCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                     : "bg-background text-foreground border-border hover:border-primary/50 hover:text-primary"
                }`}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-6 flex flex-wrap items-center justify-between gap-3" aria-live="polite">
          <p className="text-sm text-muted-foreground">
            {filteredPosts.length} article{filteredPosts.length === 1 ? "" : "s"}
            {activeQuery ? ` matching “${activeQuery}”` : ""}
            {activeCategory ? ` in ${activeCategory}` : ""}
          </p>
          {activeQuery && (
            <Link href="/blog" className="text-sm font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              Reset search
            </Link>
          )}
        </div>

        {filteredPosts.length > 0 ? (
          <section aria-labelledby="journal-articles-heading">
            <h2 id="journal-articles-heading" className="sr-only">Journal articles</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {visibleCards.map((post, index) => (
                <JournalCard
                  key={post.id}
                  post={post}
                  priority={index === 0}
                  testId={`card-blog-${post.slug}`}
                  analyticsSource="journal_list"
                />
              ))}
            </div>
            <section className="mt-10 rounded-2xl border border-border bg-background p-5" aria-labelledby="journal-starting-points-heading">
              <h2 id="journal-starting-points-heading" className="font-serif text-xl font-bold text-foreground">
                Useful starting points
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Explore a few focused guides before choosing the next step.
              </p>
              <ul className="mt-4 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                {discoverySlugs.map((slug) => {
                  const post = sortedPosts.find((candidate) => candidate.slug === slug);
                  if (!post) return null;
                  return (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                      >
                        {post.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
            {compactPosts.length > 0 && (
              <details className="mt-10 rounded-2xl border border-border bg-accent/10 px-5 py-4">
                <summary className="cursor-pointer font-semibold text-foreground">
                   Browse {compactPosts.length} more Journal guides
                   {hiddenCompactPostCount > 0 ? ` · search to find ${hiddenCompactPostCount} more` : ""}
                </summary>
                <ul className="mt-5 grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
                  {compactPosts.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/blog/${post.slug}`}
                        data-testid={`card-blog-${post.slug}`}
                        className="font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </section>
        ) : (
          <div
            className="rounded-3xl border border-dashed border-border bg-accent/10 px-6 py-12 text-center"
            data-testid="journal-no-results"
          >
            <h2 className="font-serif text-2xl font-bold text-foreground">No Journal guides matched that search</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Try a broader term such as pain, stroke, surgery, breathing, or homecare.
            </p>
              <Link
                href="/blog"
                data-testid="journal-reset"
                className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground"
              >
              Show all articles
            </Link>
          </div>
        )}

        <section className="mt-16 border-t border-border pt-10" aria-labelledby="journal-categories-heading">
          <h2 id="journal-categories-heading" className="font-serif text-2xl font-bold text-foreground mb-4">
            Browse rehabilitation topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                className="rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
              >
                {category}
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}