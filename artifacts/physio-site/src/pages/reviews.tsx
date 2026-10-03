import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "wouter";
import { ArrowLeft, RotateCcw, Star } from "lucide-react";
import { ReviewGrid } from "@/components/ReviewGrid";
import { usePublishedReviews } from "@/hooks/use-published-reviews";
import { getBookingCitySlugFromLabel } from "@/lib/booking-city";
import {
  filterPublishedReviews,
  getPublishedReviewFilterOptions,
} from "@/lib/review-catalog";

export default function Reviews() {
  const { reviews, error } = usePublishedReviews();
  const [cityFilter, setCityFilter] = useState("");
  const [careNeedFilter, setCareNeedFilter] = useState("");
  const filterOptions = useMemo(() => getPublishedReviewFilterOptions(reviews), [reviews]);
  const filteredReviews = useMemo(
    () => filterPublishedReviews(reviews, { city: cityFilter, careNeed: careNeedFilter }),
    [reviews, cityFilter, careNeedFilter],
  );

  useEffect(() => {
    setCityFilter((current) =>
      current && !filterOptions.cities.includes(current) ? "" : current,
    );
    setCareNeedFilter((current) =>
      current && !filterOptions.careNeeds.includes(current) ? "" : current,
    );
  }, [filterOptions]);

  const hasFilters = Boolean(cityFilter || careNeedFilter);
  const bookingCitySlug = getBookingCitySlugFromLabel(cityFilter);

  function clearFilters() {
    setCityFilter("");
    setCareNeedFilter("");
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Patient Reviews | Goswami Rehab</title>
        <meta
          name="description"
          content="Read patient-shared experiences from Goswami Rehab home physiotherapy in 45 listed cities, with exact-locality and clinician confirmation."
        />
      </Helmet>

      <section className="border-b border-border bg-accent/20 pb-16 pt-16 md:pb-20 md:pt-24">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <Link href="/" className="feedback-control mb-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <p className="mb-3 flex items-center gap-2 font-semibold text-primary">
            <Star className="h-4 w-4 fill-current" aria-hidden="true" />
            Patient Reviews
          </p>
          <h1 className="max-w-3xl font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Experiences shared by patients and families
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Browse published experiences from our homepage, city pages, and approved patient submissions.
            Ratings are shown only where they were provided with the review.
          </p>
          {error && (
            <p className="mt-4 text-sm text-muted-foreground" role="status">
              {error}
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20" aria-labelledby="all-reviews-heading">
        <div
          className="mb-10 rounded-2xl border border-border bg-accent/10 p-5 md:p-6"
          data-testid="review-filters"
          aria-labelledby="review-filters-heading"
        >
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 id="review-filters-heading" className="font-serif text-xl font-bold text-foreground">
                Find a relevant experience
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Filter by the locality or care need named in each published review.
              </p>
            </div>
            {hasFilters && (
              <button
                type="button"
                className="feedback-control inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                onClick={clearFilters}
                data-testid="clear-review-filters"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Clear filters
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="review-city-filter"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                City
              </label>
              <select
                id="review-city-filter"
                data-testid="review-city-filter"
                className="feedback-control min-h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                value={cityFilter}
                onChange={(event) => setCityFilter(event.target.value)}
              >
                <option value="">All cities</option>
                {filterOptions.cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="review-care-need-filter"
                className="mb-1.5 block text-sm font-semibold text-foreground"
              >
                Care need
              </label>
              <select
                id="review-care-need-filter"
                data-testid="review-care-need-filter"
                className="feedback-control min-h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
                value={careNeedFilter}
                onChange={(event) => setCareNeedFilter(event.target.value)}
              >
                <option value="">All care needs</option>
                {filterOptions.careNeeds.map((careNeed) => (
                  <option key={careNeed} value={careNeed}>
                    {careNeed}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {filterOptions.careNeeds.length > 0 && (
            <div className="mt-5" role="group" aria-label="Quick care-need filters">
              <p className="mb-2 text-sm font-semibold text-foreground">Quick filter by care need</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={!careNeedFilter}
                  className={`feedback-control min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                    !careNeedFilter
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-foreground hover:bg-accent"
                  }`}
                  onClick={() => setCareNeedFilter("")}
                >
                  All care needs
                </button>
                {filterOptions.careNeeds.map((careNeed) => (
                  <button
                    key={careNeed}
                    type="button"
                    aria-pressed={careNeedFilter === careNeed}
                    className={`feedback-control min-h-10 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                      careNeedFilter === careNeed
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setCareNeedFilter(careNeed)}
                  >
                    {careNeed}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Published experiences</p>
            <h2 id="all-reviews-heading" className="mt-2 font-serif text-3xl font-bold text-foreground md:text-4xl">
              {filteredReviews.length} patient {filteredReviews.length === 1 ? "experience" : "experiences"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground" aria-live="polite" data-testid="review-result-count">
              {filteredReviews.length} published{" "}
              {filteredReviews.length === 1 ? "experience matches" : "experiences match"} the current filters
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/booking"
              data-booking-city={bookingCitySlug}
              data-booking-mode="home"
              data-testid="reviews-booking-cta"
              className="feedback-control rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Start a booking
            </Link>
            <Link href="/feedback" className="feedback-control rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-accent">
              Share your experience
            </Link>
          </div>
        </div>
        <ReviewGrid
          reviews={filteredReviews}
          pageSize={12}
          resetKey={`${cityFilter}|${careNeedFilter}`}
          emptyMessage="No published reviews match those filters."
          emptyAction={
            hasFilters ? (
              <button
                type="button"
                className="feedback-control inline-flex min-h-10 items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-accent"
                onClick={clearFilters}
              >
                Show all reviews
              </button>
            ) : undefined
          }
        />
        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-relaxed text-muted-foreground">
          Names, localities, and dates are shown only when the reviewer has agreed to share those details publicly.
          Experiences shared about the wider provider team are not attributed to a specific city.
        </p>
      </section>
    </div>
  );
}