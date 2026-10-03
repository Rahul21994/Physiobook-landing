import { useState } from "react";
import { Star, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewGrid } from "@/components/ReviewGrid";
import { usePublishedReviews } from "@/hooks/use-published-reviews";
import {
  countReviewCharacters,
  countReviewWords,
  getReviewLimitError,
  MAX_REVIEW_CHARACTERS,
  MAX_REVIEW_WORDS,
  MIN_REVIEW_CHARACTERS,
} from "@/lib/review-validation";

function StarRating({
  value,
  onChange,
  name = "review-rating",
  required = false,
  labelId = "review-rating-label",
}: {
  value: number;
  onChange?: (v: number) => void;
  name?: string;
  required?: boolean;
  labelId?: string;
}) {
  const [hovered, setHovered] = useState(0);
  const isInteractive = Boolean(onChange);

  return (
    <div
      className="flex gap-1"
      role={isInteractive ? undefined : "img"}
      aria-label={isInteractive ? undefined : `${value} star review`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        isInteractive ? (
          <label
            key={s}
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            className="feedback-control cursor-pointer rounded-lg p-1 transition-transform hover:scale-110"
          >
            <input
              type="radio"
              name={name}
              value={s}
              checked={value === s}
              required={required}
              onChange={() => onChange?.(s)}
              aria-labelledby={`${labelId} ${name}-option-${s}`}
              className="feedback-control sr-only"
            />
            <span id={`${name}-option-${s}`} className="sr-only">
              {s} star{s > 1 ? "s" : ""}
            </span>
            <Star
              aria-hidden="true"
              className={`w-6 h-6 transition-colors ${
                s <= (hovered || value)
                  ? "fill-amber-400 text-amber-400"
                  : "fill-transparent text-muted-foreground/40"
              }`}
            />
          </label>
        ) : (
          <Star
            key={s}
            aria-hidden="true"
            className={`w-6 h-6 transition-colors ${
              s <= value
                ? "fill-amber-400 text-amber-400"
                : "fill-transparent text-muted-foreground/40"
            }`}
          />
        )
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const { reviews, error: reviewLoadError } = usePublishedReviews();

  // Form state
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const reviewWordCount = countReviewWords(body);
  const reviewCharacterCount = countReviewCharacters(body);
  const reviewCharacterCountWithoutSpaces = countReviewCharacters(body, false);
  const reviewLimitError = getReviewLimitError(body);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !body.trim()) return;
    if (body.trim().length < MIN_REVIEW_CHARACTERS) {
      setError(`Please share at least ${MIN_REVIEW_CHARACTERS} characters about your experience.`);
      return;
    }
    if (reviewLimitError) {
      setError(reviewLimitError);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), city: city.trim() || undefined, rating, body: body.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Submission failed");
      }
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="py-24 bg-background" id="reviews">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="text-primary font-semibold mb-2 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 fill-primary" /> Patient Reviews
          </p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            What Our Patients Say
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Every review is read by us before it goes live — no bots, no fake testimonials.
          </p>
          {reviewLoadError && (
            <p className="mt-3 text-sm text-muted-foreground" role="status">
              {reviewLoadError}
            </p>
          )}
        </div>

        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <h3 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
            Published patient experiences
          </h3>
          <a
            href="/reviews"
            className="feedback-control rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent"
          >
            Browse all reviews
          </a>
        </div>
        <div className="mb-16">
          <ReviewGrid reviews={reviews} pageSize={6} />
        </div>

        {/* Submission form */}
        <div className="max-w-lg mx-auto bg-accent/10 border border-border rounded-2xl p-8">
          {submitted ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-serif text-xl font-bold text-foreground mb-2">Thank you!</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Your review has been received. It will appear here once we've reviewed it — usually within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-xl font-bold text-foreground mb-1">Share Your Experience</h3>
              <p className="text-muted-foreground text-sm mb-6">
                Your review goes live only after we confirm it by email.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1" htmlFor="rev-name">
                    Your name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="rev-name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    enterKeyHint="next"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                     className="feedback-control w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                  />
                </div>

                {/* City (optional) */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1" htmlFor="rev-city">
                    City <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input
                    id="rev-city"
                    type="text"
                    maxLength={100}
                    autoComplete="address-level2"
                    enterKeyHint="next"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Jaipur"
                     className="feedback-control w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                  />
                </div>

                {/* Star rating */}
                <fieldset className="m-0 border-0 p-0">
                  <legend id="review-rating-label" className="mb-2 block text-sm font-medium text-foreground">
                    Rating <span className="text-destructive">*</span>
                  </legend>
                  <StarRating value={rating} onChange={setRating} required />
                </fieldset>

                {/* Review body */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1" htmlFor="rev-body">
                    Your review <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="rev-body"
                    required
                    minLength={MIN_REVIEW_CHARACTERS}
                    rows={4}
                    enterKeyHint="done"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    placeholder="Tell us about your experience with our physiotherapist…"
                     className="feedback-control w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right" aria-live="polite">
                    {reviewWordCount}/{MAX_REVIEW_WORDS} words · {reviewCharacterCount}/{MAX_REVIEW_CHARACTERS} characters
                    {" "}({reviewCharacterCountWithoutSpaces}/{MAX_REVIEW_CHARACTERS} without spaces)
                  </p>
                </div>

                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}

                <Button
                  type="submit"
                  disabled={
                    submitting ||
                    !name.trim() ||
                    body.trim().length < MIN_REVIEW_CHARACTERS ||
                    Boolean(reviewLimitError)
                  }
                   className="feedback-control rounded-full self-end"
                >
                  {submitting ? "Sending…" : (
                    <><Send className="w-4 h-4 mr-2" /> Submit Review</>
                  )}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
