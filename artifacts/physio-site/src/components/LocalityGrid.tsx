import { ArrowRight, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { hasVerifiedHomecareCoverage, type CityData } from "@/lib/cities";
import { getCityLocalities } from "@/lib/city-localities";
import { BUSINESS_WHATSAPP_URL } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";

interface LocalityGridProps {
  city: CityData;
}

export function LocalityGrid({ city }: LocalityGridProps) {
  const localities = getCityLocalities(city);
  const hasHomecareCoverage = hasVerifiedHomecareCoverage(city);

  if (localities.length === 0) {
    return null;
  }

  return (
    <section id="localities" className="border-b border-border/50 py-16 md:py-20">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mb-9 max-w-3xl">
          <p className="mb-2 flex items-center gap-2 font-semibold text-primary">
            <MapPin className="h-5 w-5" aria-hidden="true" /> Locality references
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-5xl">
            Physiotherapy enquiries for {city.name}
          </h2>
          <p
            data-testid="city-locality-coverage-status"
            data-coverage-status={hasHomecareCoverage ? "active" : "placement"}
            className="text-lg leading-relaxed text-muted-foreground"
          >
            {hasHomecareCoverage
              ? "The areas below are references to help describe your location. Home visits are active at city level; exact locality and clinician availability are confirmed before booking."
              : "Online consultation is available now. Use an area below as a location reference for a home-visit enquiry; a visit depends on future team placement and exact-locality confirmation."}
          </p>
        </div>

        <nav aria-label={`${city.name} locality references`} className="mb-10 flex flex-wrap gap-2">
          {localities.map((locality) => (
            <a
              key={locality.id}
              href={`#${locality.id}`}
              data-city={city.slug}
              data-locality={locality.name}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {locality.name}
            </a>
          ))}
        </nav>

        <div className="grid gap-4 md:grid-cols-2">
          {localities.map((locality) => (
            <article
              key={locality.id}
              id={locality.id}
              data-city={city.slug}
              data-locality={locality.name}
              className="group scroll-mt-24 rounded-2xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              <h3 className="mb-2 font-serif text-2xl font-bold text-foreground">
                Home-visit enquiry for {locality.name}
              </h3>
              <p className="mb-5 leading-relaxed text-muted-foreground">
                Use {locality.name} as a locality reference when sharing your exact location. This name alone does not confirm that a home visit can be arranged.
              </p>
              <div className="rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-4">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Choose what works for you
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link
                    href="/booking"
                    data-booking-mode="home"
                    data-booking-city={city.slug}
                    data-booking-locality={locality.id}
                    data-cta="locality-booking"
                    data-city={city.slug}
                    data-locality={locality.name}
                    onClick={() =>
                      trackEvent("locality_cta_click", {
                        route: "city",
                        city: city.slug,
                        locality: locality.name,
                        channel: "booking",
                      })
                    }
                    className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    {hasHomecareCoverage ? "Check home-visit availability" : "Request a placement review"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                  {hasHomecareCoverage && BUSINESS_WHATSAPP_URL && (
                    <a
                      href={`${BUSINESS_WHATSAPP_URL}?text=${encodeURIComponent(`Hello Goswami Rehab, I would like to check home physiotherapy availability in ${locality.name}, ${city.name}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cta="locality-whatsapp"
                      data-city={city.slug}
                      data-locality={locality.name}
                      onClick={() =>
                        trackEvent("locality_cta_click", {
                          route: "city",
                          city: city.slug,
                          locality: locality.name,
                          channel: "whatsapp",
                        })
                      }
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-4 py-2.5 text-center text-sm font-semibold text-emerald-700 transition-all hover:-translate-y-0.5 hover:bg-emerald-500/10 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:text-emerald-300"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      WhatsApp quick help
                    </a>
                  )}
                </div>
                <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                  {hasHomecareCoverage
                    ? "Share your exact locality and preferred timing; the team confirms clinician availability before booking."
                    : "Online consultation is available now. A home visit depends on team placement and exact-locality confirmation."}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}