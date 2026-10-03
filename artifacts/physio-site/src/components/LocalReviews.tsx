import { Quote } from "lucide-react";
import type { CityData } from "@/lib/cities";
import { getCityReviews, getProviderTeamReviews } from "@/lib/city-reviews";

interface LocalReviewsProps {
  city: CityData;
  mode?: "city" | "provider-team";
}

export function LocalReviews({ city, mode = city.reviewMode ?? "city" }: LocalReviewsProps) {
  const isProviderTeam = mode === "provider-team";
  const reviews = isProviderTeam
    ? getProviderTeamReviews(city.slug)
    : getCityReviews(city.slug);

  if (reviews.length === 0) return null;

  return (
    <section className="border-t border-border py-20 md:py-24" id="city-reviews">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 font-semibold text-primary">
            {isProviderTeam ? "Experiences with the Goswami Rehab team" : "Patient-shared experiences"}
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-5xl">
            {isProviderTeam
              ? "Recovery support from our provider team"
              : `Recovery support in ${city.name}`}
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            {isProviderTeam
              ? "These authentic patient experiences were shared about the wider Goswami Rehab provider team. They are not presented as reviews originating specifically in this locality."
              : "These patient experiences describe physiotherapy-led recovery at home. Every person’s condition and progress is different."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <article
              key={`${review.name}-${review.condition}`}
              className="flex flex-col gap-5 rounded-2xl border border-border bg-accent/20 p-6"
            >
              <Quote className="h-7 w-7 text-primary/40" aria-hidden="true" />
              <p className="flex-1 leading-relaxed text-foreground" data-no-translate>
                &quot;{review.body}&quot;
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.condition}</p>
                {review.locality && !isProviderTeam && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {review.locality}, {city.name}
                  </p>
                )}
                {review.datePublished && (
                  <time
                    className="mt-1 block text-xs text-muted-foreground"
                    dateTime={review.datePublished}
                  >
                    Shared {new Intl.DateTimeFormat("en-IN", {
                      month: "long",
                      year: "numeric",
                    }).format(new Date(`${review.datePublished}T00:00:00`))}
                  </time>
                )}
              </div>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
          Names, localities, and dates are shown only when the reviewer has agreed to
          share those details publicly. Ratings are not displayed unless they have
          been independently verified.
          {isProviderTeam && " These experiences are shared by the wider provider team, not attributed to a specific city."}
        </p>
      </div>
    </section>
  );
}