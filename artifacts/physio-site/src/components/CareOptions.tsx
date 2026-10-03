import { Link } from "wouter";
import { CheckCircle2, Globe, House, MessageCircle, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BUSINESS_WHATSAPP_URL } from "@/lib/contact";
import { pricing, pricingNote } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import type { ReactNode } from "react";

interface CareOptionsProps {
  locationLabel: string;
  homeCoverage: string;
  bookingHref?: string;
  bookingCitySlug?: string;
  bookingLocalityId?: string;
  confirmationWindowHours?: 12 | 24;
  homeActionLabel?: string;
  homeConfirmationLabel?: string;
  hideWhatsApp?: boolean;
  emphasizeOnline?: boolean;
  analyticsService?: string;
  progressiveJourney?: ReactNode;
}

export function CareOptions({
  locationLabel,
  homeCoverage,
  bookingHref = "/booking",
  bookingCitySlug,
  bookingLocalityId,
  confirmationWindowHours = 24,
  homeActionLabel = "Book a home visit",
  homeConfirmationLabel = `Confirmation within ${confirmationWindowHours} hours`,
  hideWhatsApp = false,
  emphasizeOnline = false,
  analyticsService,
  progressiveJourney,
}: CareOptionsProps) {
  function trackServiceBooking(sessionMode: "home" | "telehealth") {
    trackEvent("care_option_click", {
      route: typeof window === "undefined" ? "/" : window.location.pathname,
      location: locationLabel,
      session_mode: sessionMode,
      placement: "care-options",
    });
    if (!analyticsService) return;
    trackEvent("service_booking_cta_click", {
      route: "service",
      service: analyticsService,
      placement: "care-options",
      session_mode: sessionMode,
    });
  }

  return (
    <section className="border-y border-border bg-accent/20 py-20 md:py-24" id="care-options">
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Choose your care
          </p>
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-5xl">
            Care that fits {locationLabel}
          </h2>
          <p className="text-lg text-muted-foreground">
            {emphasizeOnline
              ? "Online consultation is available now worldwide. Choose your video platform and request a focused assessment from home."
              : "See the available options, understand the price, and send your request online."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <article className="rounded-3xl border border-border bg-background p-7 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <House className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Home visit
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{homeCoverage}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                In person
              </span>
            </div>
            <p className="mb-1 text-3xl font-bold text-primary">{pricing.homeVisit.amount}</p>
            <p className="mb-5 text-sm text-muted-foreground">{pricing.homeVisit.description}</p>
            <ul className="mb-7 space-y-2 text-sm text-foreground/80">
              {["Specialist matched to your condition", "Care in your own home", homeConfirmationLabel].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="booking"
              className="w-full rounded-full"
            >
              <Link
                href={bookingHref}
                data-booking-mode="home"
                data-booking-city={bookingCitySlug}
                data-booking-locality={bookingLocalityId}
                onClick={() => trackServiceBooking("home")}
              >
                {homeActionLabel}
              </Link>
            </Button>
          </article>

          <article className="rounded-3xl border border-primary/25 bg-background p-7 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Video className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-foreground">
                  Online consultation
                </h3>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                  Available worldwide
                </p>
              </div>
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                Teleconsultation
              </span>
            </div>
            <p className="mb-1 text-3xl font-bold text-primary">{pricing.telehealth.displayAmount}</p>
            <p className="mb-5 text-sm text-muted-foreground">
              {emphasizeOnline
                ? "A focused video assessment, personalised exercise guidance, and a practical plan you can follow wherever you are."
                : pricing.telehealth.description}
            </p>
            <ul className="mb-7 space-y-2 text-sm text-foreground/80">
               {["Video assessment and exercise guidance", "Choose Google Meet, Zoom, or WhatsApp video", "Same-day confirmation: usually within 6 hours, no later than 12 hours"].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant="booking"
              className="w-full rounded-full"
            >
              <Link
                href={bookingHref}
                data-booking-mode="telehealth"
                data-booking-city={bookingCitySlug}
                data-booking-locality={bookingLocalityId}
                onClick={() => trackServiceBooking("telehealth")}
              >
                Book online consultation
              </Link>
            </Button>
          </article>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-muted-foreground">{pricingNote}</p>
          {!hideWhatsApp && BUSINESS_WHATSAPP_URL && (
            <Button asChild variant="outline" className="rounded-full">
              <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                Questions? Message us
              </a>
            </Button>
          )}
        </div>

        {progressiveJourney && (
          <div className="mt-12">
            {progressiveJourney}
          </div>
        )}
      </div>
    </section>
  );
}