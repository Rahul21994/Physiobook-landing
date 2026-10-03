export function MoradabadCoordinator() {
  return (
    <section
      className="border-t border-border bg-accent/20 py-16 md:py-20"
      aria-labelledby="moradabad-coordinator-title"
      data-testid="moradabad-coordinator"
    >
      <div className="container mx-auto grid max-w-5xl items-center gap-10 px-4 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-16 md:px-6">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
          <img
            src="/images/dr-krishna-raj-moradabad.jpg"
            alt="Dr. Krishna Raj, Moradabad city coordinator and local physiotherapist"
            width="596"
            height="918"
            loading="lazy"
            decoding="async"
            className="aspect-[3/4.6] w-full object-cover object-top"
          />
        </div>

        <div>
          <p className="mb-2 font-semibold text-primary">Your Moradabad coordinator</p>
          <h2
            id="moradabad-coordinator-title"
            className="mb-5 font-serif text-3xl font-bold text-foreground md:text-5xl"
          >
            Local care, coordinated close to home
          </h2>
          <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              <strong className="text-foreground">Dr. Krishna Raj (PT)</strong>
              <br />
              City Coordinator &amp; Local Physiotherapist
            </p>
            <div className="border-l-2 border-primary/40 pl-5 text-base leading-relaxed">
              <p>BPT — Oxford Medical College, Bengaluru</p>
              <p>MPT (Orthopaedics) — Teerthanker Medical College</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}