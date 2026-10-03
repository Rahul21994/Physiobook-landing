export type ProgressiveCareMode = "generic" | "home" | "telehealth";
export type ProgressiveCareLocationStatus = "generic" | "verified" | "expansion";

interface ProgressiveCareJourneyProps {
  mode?: ProgressiveCareMode;
  locationStatus?: ProgressiveCareLocationStatus;
  locationName?: string;
  locality?: string;
}

interface JourneyStep {
  title: string;
  description: string;
}

function getJourneySteps({
  mode,
  locationStatus,
  locationName,
  locality,
}: Required<Pick<ProgressiveCareJourneyProps, "mode" | "locationStatus">> &
  Pick<ProgressiveCareJourneyProps, "locationName" | "locality">): JourneyStep[] {
  const locationText = locality && locationName
    ? `${locality}, ${locationName}`
    : locationName
      ? locationName
      : "your location";

  const requestDescription = mode === "telehealth"
    ? "Share your care need, preferred date, and the video platform that suits you."
    : mode === "home"
      ? `Share your care need, preferred date, and ${locationName ? `location${locality ? `, including ${locality}` : ""}` : "home location"}.`
      : "Share your care need, preferred date, and location when relevant.";

  const reviewDescription = mode === "telehealth"
    ? "We review your concern and online-care request before arranging the next step."
    : locationStatus === "verified"
      ? `We review the request, ${locationText}, and clinician availability before confirming a home visit.`
      : locationStatus === "expansion"
        ? `We review demand and whether a local team can be placed in ${locationText}. A locality reference alone does not confirm a visit.`
        : mode === "home"
          ? "We review the request, locality, and home-visit fit before confirming the next step."
          : "We review the request and care setting before confirming the next step.";

  const confirmationDescription = mode === "telehealth"
    ? "The team contacts you to confirm the video assessment slot, platform, and practical details."
    : locationStatus === "expansion" && mode === "home"
      ? "The team confirms whether a clinician can be placed and whether your exact locality can be served before any home visit is booked."
    : "The team contacts you to confirm the clinician, timing, care mode, and practical details.";

  return [
    {
      title: "Send a request",
      description: requestDescription,
    },
    {
      title: "Our team reviews it",
      description: reviewDescription,
    },
    {
      title: "Confirm the plan together",
      description: confirmationDescription,
    },
    {
      title: "Care and follow-up",
      description: "The appointment takes place, followed by practical guidance and next-step recommendations.",
    },
  ];
}

export function ProgressiveCareJourney({
  mode = "generic",
  locationStatus = "generic",
  locationName,
  locality,
}: ProgressiveCareJourneyProps) {
  const steps = getJourneySteps({ mode, locationStatus, locationName, locality });

  return (
    <section
      aria-labelledby="progressive-care-journey-title"
      className="rounded-3xl border border-primary/15 bg-primary/5 p-6 md:p-8"
      data-testid="progressive-care-journey"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">What happens next</p>
        <h2 id="progressive-care-journey-title" className="mt-2 font-serif text-2xl font-semibold text-foreground">
          A clear path from request to care
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          A request starts a review. It is not a confirmed appointment until our team has spoken with you.
        </p>
      </div>

      <ol className="mt-6 grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3 rounded-2xl border border-border/70 bg-background/80 p-4">
            <span
              aria-hidden="true"
              className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 border-t border-primary/10 pt-4 text-sm font-medium leading-relaxed text-foreground/80">
        Sending a request does not charge you. If payment is needed, the team discusses it after the request is reviewed.
      </p>
    </section>
  );
}