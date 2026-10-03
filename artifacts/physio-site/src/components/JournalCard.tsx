import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { JournalTileArt } from "@/components/JournalTileArt";
import { trackEvent } from "@/lib/analytics";

type JournalCardPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  isoDate: string;
  category: string;
  image: string;
};

type JournalCardProps = {
  post: JournalCardPost;
  priority?: boolean;
  testId?: string;
  analyticsSource?: string;
};

export function JournalCard({
  post,
  priority = false,
  testId,
  analyticsSource = "journal",
}: JournalCardProps) {
  return (
    <article
      className="journal-card group flex h-full flex-col overflow-hidden rounded-3xl border border-border/50 bg-background transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
      data-testid={testId}
    >
      <Link
        href={`/blog/${post.slug}`}
        className="flex h-full flex-col"
        onClick={() =>
          trackEvent("journal_article_click", {
            source: analyticsSource,
            article_slug: post.slug,
          })
        }
      >
        <JournalTileArt
          slug={post.slug}
          category={post.category}
          image={post.image}
          priority={priority}
        />

        <div className="flex flex-1 flex-col p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-wide text-primary">
              {post.category}
            </span>
            <time
              dateTime={post.isoDate}
              className="text-right text-sm text-muted-foreground"
              aria-label={`Published on ${post.date}`}
            >
              {post.isoDate.startsWith("2026") ? `New · ${post.date}` : `Published · ${post.date}`}
            </time>
          </div>

          <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          <p className="mb-6 line-clamp-3 flex-1 text-muted-foreground">{post.excerpt}</p>

          <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-5">
            <span className="text-sm font-medium text-foreground">Read the guide</span>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-background text-primary shadow-sm transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}