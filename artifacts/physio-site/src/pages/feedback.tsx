import { useEffect, useRef, useState } from "react";
import { CheckCircle2, ExternalLink, Heart, Send, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import {
  countReviewCharacters,
  countReviewWords,
  getReviewLimitError,
  MAX_REVIEW_CHARACTERS,
  MAX_REVIEW_WORDS,
  MIN_REVIEW_CHARACTERS,
} from "@/lib/review-validation";
import { BUSINESS_GBP_URL, BUSINESS_SISTER_GBP_URL } from "@/lib/contact";
import { getFormAntiSpamToken } from "@/lib/form-anti-spam";

const services = [
  "Home physiotherapy",
  "Online consultation",
  "Stroke rehabilitation",
  "Post-surgery rehabilitation",
  "Cardiopulmonary rehabilitation",
  "Antenatal/postpartum physiotherapy",
  "Pregnancy/postpartum nutrition support",
  "Pregnancy/postpartum exercise support",
  "Infant/pediatric physiotherapy enquiry",
  "Pediatric disability rehabilitation",
  "Other",
];

function StarRating({
  value,
  onChange,
  name = "feedback-rating",
  required = false,
  labelId = "feedback-rating-label",
}: {
  value: number;
  onChange: (value: number) => void;
  name?: string;
  required?: boolean;
  labelId?: string;
}) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <label
          key={star}
          className="feedback-control cursor-pointer rounded-lg p-1.5 transition-transform hover:scale-110"
        >
          <input
            type="radio"
            name={name}
            value={star}
            checked={value === star}
            required={required}
            onChange={() => onChange(star)}
            aria-labelledby={`${labelId} ${name}-option-${star}`}
            className="feedback-control sr-only"
          />
          <span id={`${name}-option-${star}`} className="sr-only">
            {star} star{star === 1 ? "" : "s"}
          </span>
          <Star
            aria-hidden="true"
            className={`h-8 w-8 ${
              star <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"
            }`}
          />
        </label>
      ))}
    </div>
  );
}

export default function Feedback() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [antiSpamToken, setAntiSpamToken] = useState<string | null>(null);
  const [honeypotValue, setHoneypotValue] = useState("");
  const formStartedRef = useRef(false);
  const reviewWordCount = countReviewWords(body);
  const reviewCharacterCount = countReviewCharacters(body);
  const reviewCharacterCountWithoutSpaces = countReviewCharacters(body, false);
  const reviewLimitError = getReviewLimitError(body);

  useEffect(() => {
    void getFormAntiSpamToken().then(setAntiSpamToken);
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (body.trim().length < MIN_REVIEW_CHARACTERS) {
      trackEvent("feedback_form_error", {
        route: "feedback",
        error_type: "too_short",
      });
      setError(`Please share at least ${MIN_REVIEW_CHARACTERS} characters about your experience.`);
      return;
    }
    if (reviewLimitError) {
      trackEvent("feedback_form_error", {
        route: "feedback",
        error_type: "length_limit",
      });
      setError(reviewLimitError);
      return;
    }
    if (!antiSpamToken) {
      setError("Please refresh this page before submitting your feedback.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          city: city.trim() || undefined,
          service: service || undefined,
          rating,
          body: body.trim(),
          antiSpamToken,
          website: honeypotValue,
        }),
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error ?? "We could not send your feedback. Please try again.");
      }

      trackEvent("feedback_request_received", {
        route: "feedback",
        rating,
        service: service || "unspecified",
        has_city: Boolean(city.trim()),
      });
      setSubmitted(true);
    } catch (submissionError) {
      trackEvent("feedback_form_error", {
        route: "feedback",
        error_type: "submission_failed",
      });
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-[80vh] bg-accent/10 px-4 py-12 md:py-20">
      <div className="mx-auto max-w-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-8 w-8 fill-primary/10" />
          </div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-primary">Goswami Rehab</p>
          <h1 className="font-serif text-3xl font-bold text-foreground md:text-4xl">How was your experience?</h1>
          <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
            Your feedback helps us improve the care we provide to every patient.
          </p>
        </div>

        <div className="rounded-3xl border border-border/60 bg-background p-6 shadow-sm md:p-8">
          {submitted ? (
            <div className="py-4 text-center">
              <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
              <h2 className="font-serif text-2xl font-bold text-foreground">Thank you for your feedback</h2>
              <p className="mx-auto mt-3 max-w-sm leading-relaxed text-muted-foreground">
                We have received your review. We read every submission before it appears on our website.
              </p>
              <div className="mt-8 border-t border-border/60 pt-8">
                <p className="mb-4 font-medium text-foreground">Would you also share your experience on Google?</p>
                <Button
                  asChild
                  className="feedback-control w-full rounded-full"
                  size="lg"
                >
                  <a
                    href={BUSINESS_GBP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackEvent("google_review_click", {
                        route: "feedback",
                        placement: "confirmation",
                      })
                    }
                  >
                    Leave a Google Review
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                 <p className="mt-3 text-xs text-muted-foreground">
                   This opens the Goswami Rehab Google Business listing. If your appointment was with Gift rehab center, use its{" "}
                   <a
                     href={BUSINESS_SISTER_GBP_URL}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="font-medium text-primary underline underline-offset-2"
                   >
                     sister listing
                   </a>
                   .
                 </p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-xl font-bold text-foreground">Share your experience</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Private feedback is reviewed by our team before any review is published on the website.
                </p>
              </div>

              <div
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
              >
                <label htmlFor="feedback-website">Website</label>
                <input
                  id="feedback-website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypotValue}
                  onChange={(event) => setHoneypotValue(event.target.value)}
                />
              </div>

              <form
                onFocus={() => {
                  if (formStartedRef.current) return;
                  formStartedRef.current = true;
                  trackEvent("feedback_form_start", { route: "feedback" });
                }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label htmlFor="feedback-name" className="mb-1.5 block text-sm font-medium text-foreground">
                    Your name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="feedback-name"
                    required
                    maxLength={100}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Priya Sharma"
                     className="feedback-control h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
                  />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="feedback-city" className="mb-1.5 block text-sm font-medium text-foreground">
                      City <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <input
                      id="feedback-city"
                      maxLength={100}
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      placeholder="e.g. Jaipur"
                       className="feedback-control h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor="feedback-service" className="mb-1.5 block text-sm font-medium text-foreground">
                      Service <span className="font-normal text-muted-foreground">(optional)</span>
                    </label>
                    <select
                      id="feedback-service"
                      value={service}
                      onChange={(event) => setService(event.target.value)}
                       className="feedback-control h-12 w-full rounded-xl border border-input bg-background px-3 text-sm"
                    >
                      <option value="">Select a service</option>
                      {services.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                </div>

                <fieldset className="m-0 border-0 p-0">
                  <legend id="feedback-rating-label" className="mb-2 block text-sm font-medium text-foreground">
                    Your rating <span className="text-destructive">*</span>
                  </legend>
                  <StarRating value={rating} onChange={setRating} required />
                </fieldset>

                <div>
                  <label htmlFor="feedback-body" className="mb-1.5 block text-sm font-medium text-foreground">
                    Your feedback <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="feedback-body"
                    required
                    minLength={MIN_REVIEW_CHARACTERS}
                    rows={5}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Tell us about your experience with our physiotherapist…"
                     className="feedback-control w-full resize-none rounded-xl border border-input bg-background px-3 py-3 text-sm"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Please describe your service experience without including a child’s diagnosis, pregnancy history, or other detailed health information.
                  </p>
                  <p className="mt-1 text-right text-xs text-muted-foreground" aria-live="polite">
                    {reviewWordCount}/{MAX_REVIEW_WORDS} words · {reviewCharacterCount}/{MAX_REVIEW_CHARACTERS} characters
                    {" "}({reviewCharacterCountWithoutSpaces}/{MAX_REVIEW_CHARACTERS} without spaces)
                  </p>
                </div>

                {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

                <Button
                  type="submit"
                  disabled={
                    submitting ||
                    !antiSpamToken ||
                    !name.trim() ||
                    body.trim().length < MIN_REVIEW_CHARACTERS ||
                    Boolean(reviewLimitError)
                  }
                   className="feedback-control w-full rounded-full"
                  size="lg"
                >
                  {submitting ? "Sending feedback…" : <><Send className="mr-2 h-4 w-4" /> Send Feedback</>}
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
          Goswami Rehab · Your feedback is used to improve our service.
        </p>
      </div>
    </div>
  );
}