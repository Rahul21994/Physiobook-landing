import { CareFinderFlow } from "@/components/CareFinderFlow";

export function CarePathChooser() {
  return (
    <section
      className="border-b border-border bg-background py-10 md:py-12"
      aria-labelledby="care-path-heading"
      data-testid="care-path-chooser"
    >
      <div className="container mx-auto max-w-5xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Choose your next step</p>
            <h2 id="care-path-heading" className="mt-2 font-serif text-2xl font-bold text-foreground md:text-3xl">
              Find the care path that fits
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Choose how you would like to begin. Your city can be prefilled in the request; the team confirms home-visit details before an appointment.
            </p>
          </div>
          <CareFinderFlow placement="homepage" testIdPrefix="care-path" />
        </div>
      </div>
    </section>
  );
}