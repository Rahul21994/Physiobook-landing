import { Quote } from "lucide-react";
import { getCityReviews } from "@/lib/city-reviews";

interface CityReviewsProps {
  cityName: string;
  citySlug: string;
}

export function CityReviews({ cityName, citySlug }: CityReviewsProps) {
  const reviews = getCityReviews(citySlug);

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 md:py-24 border-t border-border" id="city-reviews">
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <div className="text-center mb-12">
          <p className="text-primary font-semibold mb-2">Patient-shared experiences</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
            Recovery support in {cityName}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            These patient experiences describe physiotherapy-led recovery at home.
            Every person’s condition and progress is different.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <article
              key={review.name}
              className="bg-accent/20 border border-border rounded-2xl p-6 flex flex-col gap-5"
            >
              <Quote className="w-7 h-7 text-primary/40" aria-hidden="true" />
              <p className="text-foreground leading-relaxed flex-1" data-no-translate>
                &quot;{review.body}&quot;
              </p>
              <div className="border-t border-border pt-4">
                <p className="font-semibold text-foreground">{review.name}</p>
                <p className="text-sm text-muted-foreground">{review.condition}</p>
                <p className="text-xs text-muted-foreground mt-1">{cityName}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}