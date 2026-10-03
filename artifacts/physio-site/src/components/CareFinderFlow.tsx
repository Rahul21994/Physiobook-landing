import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Globe2, House } from "lucide-react";
import { AccessibleSelect } from "@/components/AccessibleSelect";
import { Button } from "@/components/ui/button";
import {
  cities,
  getCityBySlug,
  hasVerifiedHomecareCoverage,
} from "@/lib/cities";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

type CareMode = "home" | "online";
type CareFinderPlacement = "header" | "homepage";

interface CareFinderFlowProps {
  citySlug?: string;
  placement: CareFinderPlacement;
  testIdPrefix: "care-finder" | "care-path";
  onContinue?: () => void;
}

export function CareFinderFlow({
  citySlug = "",
  placement,
  testIdPrefix,
  onContinue,
}: CareFinderFlowProps) {
  const [selectedMode, setSelectedMode] = useState<CareMode>("home");
  const [selectedCitySlug, setSelectedCitySlug] = useState(citySlug);
  const selectedCity = getCityBySlug(selectedCitySlug);
  const homecareIsActive = selectedCity
    ? hasVerifiedHomecareCoverage(selectedCity)
    : false;

  const description =
    selectedMode === "online"
      ? selectedCity
        ? `Online consultation is available from anywhere. ${selectedCity.name} will be prefilled in your request.`
        : "Online consultation is available from anywhere. A city is optional."
      : !selectedCity
        ? "Choose a city to prefill a home-visit request. The team confirms exact locality, clinician availability, and timing before an appointment."
        : homecareIsActive
          ? `Home visits are active at city level in ${selectedCity.name}. Exact locality, clinician availability, and timing are confirmed before booking.`
          : `Online consultation is available from ${selectedCity.name}. A home-visit enquiry can be reviewed for local team placement, exact locality, and clinician availability.`;

  const canContinue = selectedMode === "online" || Boolean(selectedCity);
  const continueLabel =
    selectedMode === "online"
      ? "Continue to online booking"
      : !selectedCity
        ? "Choose a city to continue"
        : !homecareIsActive
        ? "Send a home-visit enquiry"
        : "Continue to home-visit request";

  function selectMode(mode: CareMode) {
    setSelectedMode(mode);
    trackEvent("care_path_select", {
      route: placement === "homepage" ? "/" : "global",
      care_path: mode,
      placement,
    });
  }

  return (
    <div className="space-y-4" data-testid={`${testIdPrefix}-flow`}>
      <div
        className="grid gap-2 sm:grid-cols-2"
        role="group"
        aria-label="Choose a care path"
      >
        <button
          type="button"
          aria-pressed={selectedMode === "home"}
          onClick={() => selectMode("home")}
          data-testid={`${testIdPrefix}-choice-home`}
          className={cn(
            "flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none",
            selectedMode === "home"
              ? "border-primary bg-primary/10 text-foreground shadow-sm"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent/40",
          )}
        >
          <House
            className={cn(
              "h-5 w-5 flex-shrink-0",
              selectedMode === "home" ? "text-primary" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold">Home visit</span>
        </button>
        <button
          type="button"
          aria-pressed={selectedMode === "online"}
          onClick={() => selectMode("online")}
          data-testid={`${testIdPrefix}-choice-online`}
          className={cn(
            "flex min-h-16 items-center gap-3 rounded-2xl border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none",
            selectedMode === "online"
              ? "border-primary bg-primary/10 text-foreground shadow-sm"
              : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:bg-accent/40",
          )}
        >
          <Globe2
            className={cn(
              "h-5 w-5 flex-shrink-0",
              selectedMode === "online" ? "text-primary" : "text-muted-foreground",
            )}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold">Online consultation</span>
        </button>
      </div>

      <div>
        <label
          htmlFor={`${testIdPrefix}-city`}
          className="mb-2 block text-sm font-medium text-foreground"
        >
          City{" "}
          <span className="font-normal text-muted-foreground">
            ({selectedMode === "home" ? "required for home visits" : "optional"})
          </span>
        </label>
        <AccessibleSelect
          id={`${testIdPrefix}-city`}
          data-testid={`${testIdPrefix}-city`}
          value={selectedCitySlug}
          onChange={(event) => setSelectedCitySlug(event.target.value)}
          placeholder="Choose a city"
          required={selectedMode === "home"}
          options={cities.map((city) => ({
            value: city.slug,
            label: `${city.name}, ${city.state}`,
          }))}
          aria-describedby={`${testIdPrefix}-description`}
          className="h-11 rounded-xl bg-background"
        />
      </div>

      <p
        id={`${testIdPrefix}-description`}
        className="rounded-2xl border border-primary/15 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/80"
        aria-live="polite"
        role="status"
        data-testid={`${testIdPrefix}-description`}
      >
        {description}
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {canContinue ? (
          <Button
            asChild
            variant="booking"
            className="min-h-11 rounded-full px-5"
          >
            <Link
              href="/booking"
              data-booking-mode={selectedMode === "online" ? "telehealth" : "home"}
              data-booking-city={selectedCity?.slug}
              data-testid={`${testIdPrefix}-continue`}
              onClick={onContinue}
            >
              {continueLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        ) : (
          <Button
            type="button"
            variant="booking"
            className="min-h-11 rounded-full px-5"
            disabled
            data-testid={`${testIdPrefix}-continue`}
          >
            {continueLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        )}
        <Link
          href="/cities"
          data-testid={`${testIdPrefix}-cities`}
          onClick={onContinue}
          className="inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold text-primary underline-offset-4 transition-colors hover:bg-primary/5 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          Browse all cities
        </Link>
      </div>
    </div>
  );
}