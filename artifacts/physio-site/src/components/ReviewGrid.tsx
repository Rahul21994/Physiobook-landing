import { useEffect, useState, type ReactNode } from "react";
import type { PublishedReview } from "@/lib/review-catalog";
import { ReviewCard } from "@/components/ReviewCard";

export function ReviewGrid({
  reviews,
  emptyMessage = "No published reviews are available right now.",
  emptyAction,
  pageSize,
  resetKey,
}: {
  reviews: readonly PublishedReview[];
  emptyMessage?: string;
  emptyAction?: ReactNode;
  pageSize?: number;
  resetKey?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(() =>
    pageSize ? Math.min(pageSize, reviews.length) : reviews.length,
  );

  useEffect(() => {
    if (pageSize) {
      setVisibleCount(Math.min(pageSize, reviews.length));
    }
  }, [pageSize, resetKey]);

  if (reviews.length === 0) {
    return (
      <div
        className="rounded-2xl border border-dashed border-border bg-accent/10 px-6 py-12 text-center"
        data-testid="review-empty-state"
        role="status"
      >
        <p className="font-serif text-xl font-bold text-foreground">{emptyMessage}</p>
        {emptyAction && <div className="mt-5">{emptyAction}</div>}
      </div>
    );
  }

  const visibleReviews = pageSize ? reviews.slice(0, visibleCount) : reviews;
  const hasMoreReviews = visibleReviews.length < reviews.length;

  return (
    <>
      <div
        id="review-grid-list"
        className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        data-testid="review-grid"
      >
        {visibleReviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      {pageSize && (
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p
            className="text-sm text-muted-foreground"
            aria-live="polite"
            data-testid="review-grid-visible-count"
          >
            Showing {visibleReviews.length} of {reviews.length} published{" "}
            {reviews.length === 1 ? "experience" : "experiences"}
          </p>
          {hasMoreReviews && (
            <button
              type="button"
              className="feedback-control min-h-11 rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
              aria-controls="review-grid-list"
              data-testid="review-grid-load-more"
              onClick={() => setVisibleCount((current) => Math.min(current + pageSize, reviews.length))}
            >
              Show more reviews
            </button>
          )}
        </div>
      )}
    </>
  );
}