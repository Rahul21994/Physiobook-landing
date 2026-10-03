import { useId, useState } from "react";
import { Quote, Star } from "lucide-react";
import type { PublishedReview } from "@/lib/review-catalog";

const COLLAPSIBLE_CHARACTER_LIMIT = 480;
const COLLAPSIBLE_LINE_LIMIT = 5;

function slugify(value: string): string {
  return value.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5 text-primary" role="img" aria-label={`${value} star review`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${index < value ? "fill-current" : "text-muted-foreground/30"}`}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function ReviewCard({ review }: { review: PublishedReview }) {
  const [expanded, setExpanded] = useState(false);
  const generatedId = useId();
  const bodyId = `review-body-${slugify(review.id)}-${generatedId.replace(/:/g, "")}`;
  const isLong = review.body.length > COLLAPSIBLE_CHARACTER_LIMIT ||
    review.body.split("\n").length > COLLAPSIBLE_LINE_LIMIT;
  const excerpt = `${review.body.slice(0, 360).trimEnd()}…`;
  const location = [review.city, review.state].filter(Boolean).join(", ");

  return (
    <article
      className="flex flex-col gap-4 rounded-2xl border border-border bg-accent/20 p-6"
      data-testid={`review-card-${slugify(review.id)}`}
    >
      {location && (
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {location}
        </p>
      )}
      <Quote className="h-6 w-6 text-primary/40" aria-hidden="true" />
      <div id={bodyId} className="flex-1" role="region" aria-label={`Review from ${review.name}`}>
        <p className="whitespace-pre-line leading-relaxed text-foreground" data-no-translate>
          &quot;{isLong && !expanded ? excerpt : review.body}&quot;
        </p>
        {isLong && (
          <button
            type="button"
            className="feedback-control mt-3 rounded-md font-semibold text-primary underline-offset-4 hover:underline"
            aria-expanded={expanded}
            aria-controls={bodyId}
            onClick={() => setExpanded((current) => !current)}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
      </div>
      <div className="mt-auto border-t border-border pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-semibold text-foreground text-sm">{review.name}</p>
            {review.condition && (
              <p className="mt-0.5 text-xs text-muted-foreground">{review.condition}</p>
            )}
          </div>
          {typeof review.rating === "number" && <StarRating value={review.rating} />}
        </div>
        {review.source === "submitted" && (
          <p className="mt-2 text-xs text-muted-foreground">Published after review by our team</p>
        )}
      </div>
    </article>
  );
}