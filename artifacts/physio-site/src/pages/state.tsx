import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { getStateBySlug, getCitiesForState, getStateDisplayName, getStatePageServiceThemes, getStateSeoDescription, isStateIndexable, states } from "@/lib/states";
import { hasVerifiedHomecareCoverage, rehabilitationLabel } from "@/lib/cities";
import { FAQList } from "@/components/FAQList";
import { CareOptions } from "@/components/CareOptions";
import { ContentAttribution } from "@/components/ContentAttribution";
import { getRenderedStateCopy, getStateFaqs } from "@/lib/state-faqs";
import { stateJournalIndex } from "@/lib/state-journal-index";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_WHATSAPP_URL,
} from "@/lib/contact";
import {
  ArrowRight, Phone, MapPin, Star, Shield, BookOpen,
  Clock, Users, CheckCircle2
} from "lucide-react";

const BASE_URL = "https://goswamirehab.in";
const ORG_ID   = `${BASE_URL}/#organization`;
const STATE_CARE_JOURNEY_STEPS = [
  ["Send a request", "Share your city, locality, care need, and date."],
  ["Our team reviews it", "We review the request and home-visit fit before confirming the next step."],
  ["Confirm the plan together", "We confirm the clinician, timing, care mode, and practical details."],
  ["Care and follow-up", "The appointment is followed by guidance and next-step recommendations."],
] as const;

export default function StatePage() {
  const params = useParams<{ state: string }>();
  const state  = getStateBySlug(params.state ?? "");

  if (!state) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">State Not Found</h1>
        <p className="text-muted-foreground mb-8">We may not cover this state yet — contact us to check availability.</p>
        <Button asChild className="rounded-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const citiesInState = getCitiesForState(state);
  const stateIndexable = isStateIndexable(state);
  const stateProfile = state.profile;
  const stateDisplayName = getStateDisplayName(state);
  const cityNames     = citiesInState.map((c) => c.name).join(", ");
  const activeCities = citiesInState.filter((city) => hasVerifiedHomecareCoverage(city));
  const activeCityNames = activeCities.map((city) => city.name).join(", ");
  const stateAvailability = activeCities.length > 0
      ? `Home visits are active at city level across ${activeCityNames}. Exact locality and clinician availability are confirmed before booking. Online consultation is also available if a video assessment is more convenient.`
    : `Home visits and online physiotherapy are available across ${state.name}. Exact locality and clinician availability are confirmed before booking.`;
  const stateIntro = stateProfile
    ? getRenderedStateCopy(`${stateProfile.intro} ${stateProfile.coverageNote}`, state.name)
    : stateAvailability;
  const stateCareFocus = getRenderedStateCopy(
    stateProfile?.careFocus
      ?? "Online consultation is available across the state; choose a city and share the exact locality for home-visit confirmation.",
    state.name,
  );
  const stateBookingNote = getRenderedStateCopy(
    stateProfile?.bookingNote
      ?? "Choose the city and care option that match the person's home setting, then include the locality and preferred date.",
    state.name,
  );
  const locationServices = getStatePageServiceThemes(citiesInState);
  const stateCityContext = citiesInState.map((city) => {
    const homecareIsVerified = hasVerifiedHomecareCoverage(city);
    const localityReferences = city.nearby.slice(0, 3).join(", ");
    const conditionFocus = city.conditions
      .slice(0, 3)
      .map((condition) => rehabilitationLabel(condition).toLowerCase())
      .join(", ");
    return {
      city,
      focus: homecareIsVerified
        ? city.localFocus ?? `${city.name} care planning is shaped around the person's goals and home setting.`
        : `Online physiotherapy from ${city.name} can address questions about ${conditionFocus}. Share the recovery goal to discuss suitable next steps.`,
      coverage: homecareIsVerified
        ? `Locality references: ${localityReferences}. Home visits are active at city level in ${city.name}; exact locality and clinician availability are confirmed before booking.`
        : `Online consultation is available now from ${city.name}. Home-visit enquiries may support future team placement; a visit requires local clinician placement and exact-locality confirmation.`,
    };
  });
  const stateJournalPosts = stateJournalIndex
    .filter((post) => state.citySlugs.includes(post.citySlug))
    .slice(0, 6);
  const stateIndex = states.findIndex((candidate) => candidate.slug === state.slug);
  const relatedStates = states
    .filter((candidate) => candidate.slug !== state.slug)
    .sort((a, b) =>
      Math.abs(states.indexOf(a) - stateIndex) - Math.abs(states.indexOf(b) - stateIndex),
    )
    .slice(0, 2);

  const faqs = getStateFaqs(state);

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/physiotherapist-at-home-in/${state.slug}#service`,
        "name": `Physiotherapy at Home in ${stateDisplayName}`,
    "url": `${BASE_URL}/physiotherapist-at-home-in/${state.slug}`,
    "provider": { "@id": ORG_ID },
    "areaServed": {
      "@type": "AdministrativeArea",
      "name": stateDisplayName,
       "additionalType": state.administrativeType ?? "state",
      "containedInPlace": { "@type": "Country", "name": "India" },
    },
    "serviceType": "Online Physiotherapy Consultation and Home-Visit Enquiry",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `${BASE_URL}/booking`,
      "name": "Online booking and city-by-city home-visit enquiry",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": `Physiotherapist at Home in ${stateDisplayName}`,
        "item": `${BASE_URL}/physiotherapist-at-home-in/${state.slug}`,
      },
    ],
  };

  const schemaJson = JSON.stringify(serviceSchema);
  const breadcrumbJson = JSON.stringify(breadcrumbSchema);
  const faqSchemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a },
    })),
  });

  const title       = `Online Physiotherapy in ${state.name} | Goswami Rehab`;
  const description = getStateSeoDescription(state);
  const canonical   = `${BASE_URL}/physiotherapist-at-home-in/${state.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        {typeof window === "undefined" && stateIndexable && (
          <>
            <script type="application/ld+json">{schemaJson}</script>
            <script type="application/ld+json">{breadcrumbJson}</script>
            <script type="application/ld+json">{faqSchemaJson}</script>
          </>
        )}
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-accent/30 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
            <MapPin className="w-4 h-4" />
            <span>{stateDisplayName}</span>
          </div>

          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
            {activeCities.length > 0
              ? <>Physiotherapist<br className="hidden md:block" /> at Home in</>
              : <>Online Physiotherapy<br className="hidden md:block" /> and Home Visits in</>}
            <br className="hidden md:block" /> {state.name}.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
            {stateIntro}
          </p>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Start with the{" "}
            <Link href="/home-physiotherapy" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              homecare physiotherapy guide
            </Link>
            {" "}then choose a city below, or{" "}
            <Link href="/cities" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              browse all city care options
            </Link>
            .
          </p>

          <ContentAttribution testId="state-attribution" className="mb-8" />

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="booking" size="lg" className="rounded-full px-8 py-6 text-base font-semibold">
              <Link href="/booking">
                Book online
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            {BUSINESS_PHONE_TEL && (
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold">
                <a href={BUSINESS_PHONE_TEL}>
                  <Phone className="mr-2 w-5 h-5" />
                  Call us
                </a>
              </Button>
            )}
            {BUSINESS_WHATSAPP_URL && (
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold">
                <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Questions? WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <section className="border-y border-border bg-background py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm">
            {[
              { icon: <Users className="w-5 h-5" />,  text: "35+ Specialist Physiotherapists" },
              { icon: <MapPin className="w-5 h-5" />,  text: `${citiesInState.length} cit${citiesInState.length === 1 ? "y" : "ies"} listed in ${state.name}` },
              { icon: <Star className="w-5 h-5" />,    text: "Patient-focused rehabilitation" },
              { icon: <Shield className="w-5 h-5" />,  text: "Care adapted to your goals" },
              { icon: <Clock className="w-5 h-5" />,   text: "Care options confirmed within 24 hours" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITIES GRID ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Cities served in {state.name}
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
             Select a city to review its current care option, local context, and booking path.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {citiesInState.map((city) => (
              <Link key={city.slug} href={`/physiotherapist-at-home/${city.slug}`}>
                <div className="group border border-border rounded-2xl p-5 hover:border-primary/50 hover:bg-accent/30 transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                        {city.name}
                        {city.isHQ && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">Operations base</span>
                        )}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-primary">Home visits and online consultation</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{city.nearby.slice(0, 2).join(", ")}&hellip;</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {city.conditions.slice(0, 2).map((cond, i) => (
                      <span key={i} className="text-xs bg-primary/8 text-primary px-2 py-0.5 rounded-full">
                        {rehabilitationLabel(cond)}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA if only 1-2 cities */}
          {citiesInState.length <= 2 && BUSINESS_WHATSAPP_URL && (
            <p className="text-muted-foreground mt-8 text-sm">
              Don't see your exact area?{" "}
              <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                WhatsApp us
              </a>{" "}
              — we are expanding coverage across {state.name}.
            </p>
          )}
        </div>
      </section>

      {/* ── STATE DISCOVERY ── */}
      <section className="border-t border-border bg-secondary/20 py-12 md:py-16">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-6 max-w-2xl">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Explore other state coverage
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Browse nearby regional guides to compare local availability, cities served,
              and booking options.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {relatedStates.map((relatedState) => (
              <Link
                key={relatedState.slug}
                href={`/physiotherapist-at-home-in/${relatedState.slug}`}
                className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 transition-colors hover:border-primary/50 hover:bg-primary/5"
              >
                <span>
                  <span className="block text-sm font-semibold text-foreground group-hover:text-primary">
                     Physiotherapy care in {relatedState.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                     {relatedState.citySlugs.length} {relatedState.citySlugs.length === 1 ? "city" : "cities"} listed
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-accent/10 py-16 md:py-20" data-testid={`state-local-context-${state.slug}`}>
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-8 max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Local care context across {state.name}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
              The right next step depends on the city, locality, recovery goal, and whether home-visit coverage is already active there. These city notes come from the local care directory rather than a generic state-wide promise.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {stateCityContext.map(({ city, focus, coverage }) => (
              <article key={city.slug} className="rounded-2xl border border-border bg-background p-6">
                <h3 className="font-serif text-2xl font-bold text-foreground">{city.name}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{focus}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{coverage}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {stateProfile && stateProfile.localResources.length > 0 && (
        <section className="border-t border-border bg-background py-12 md:py-16" data-testid={`state-profile-${state.slug}`}>
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              Local rehabilitation resources in {state.name}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {stateProfile.intro} {stateProfile.coverageNote}
            </p>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {stateProfile.localResources.map((resource) => (
                <a
                  key={resource.href}
                  href={resource.href}
                  className="rounded-2xl border border-border bg-secondary/20 p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <h3 className="font-semibold text-foreground">{resource.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {resource.description ?? `${resource.title} is a state-specific starting point for ${state.name} care planning.`}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {stateJournalPosts.length > 0 && (
        <section
          className="border-t border-border bg-secondary/20 py-12 md:py-16"
          data-testid={`state-journal-${state.slug}`}
        >
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 max-w-3xl">
              <p className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <BookOpen className="h-5 w-5" /> From the city Journal
              </p>
              <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
                Rehabilitation reading for {state.name}
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                These city-specific guides connect the rehabilitation issues already listed in
                the directory with practical questions about assessment, nutrition, exercise, and
                safe home practice. Choose the city that matches the person’s home.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stateJournalPosts.map((post) => {
                const city = citiesInState.find((candidate) => candidate.slug === post.citySlug);
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
                    data-testid={`state-journal-card-${post.slug}`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                      {city?.name ?? state.name} · {post.discipline.replace("-", " ")}
                    </p>
                    <h3 className="mt-3 font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Read the city guide <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section
        className="border-t border-border bg-primary/5 py-12 md:py-16"
        data-testid="progressive-care-journey"
      >
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <h2>A clear path from request to care</h2>
          <ol className="mt-6 space-y-3 text-sm">
            {STATE_CARE_JOURNEY_STEPS.map(([title, description], index) => (
              <li key={title}><strong>{index + 1}. {title}.</strong> {description}</li>
            ))}
          </ol>
          <p className="mt-6">
            Sending a request does not charge you. Payment is discussed after the request is reviewed.
          </p>
        </div>
      </section>

      <CareOptions
        locationLabel={`across ${state.name}`}
        homeCoverage={activeCities.length > 0
          ? `Home visits are active at city level across ${activeCityNames}. Exact locality and clinician availability are confirmed before booking.`
          : `Home visits and online consultation are available across ${state.name}; exact locality and clinician availability are confirmed before booking`}
        homeActionLabel="Check home-visit availability"
        homeConfirmationLabel="Home-visit requests receive a response within the applicable 12-hour or 24-hour window; a visit is confirmed only after locality and clinician checks"
        emphasizeOnline={false}
        bookingHref="/booking"
      />

      {/* ── SERVICES ── */}
      <section className="py-16 md:py-24 bg-accent/20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
             Regional Service Mix in {stateDisplayName}
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">
             {stateCareFocus} This mix is synthesised from the state’s city directory and evidence-informed care contexts, not from a generic statewide prevalence claim.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
             {locationServices.map((svc) => (
               <div key={svc.title} className="bg-background border border-border rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{svc.title}</h3>
                 <p className="text-muted-foreground text-sm leading-relaxed">{svc.description}</p>
                 <Link href={svc.href} className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
                   Explore service <ArrowRight className="h-4 w-4" />
                 </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-12 text-center">
            How to Book in {state.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose your location", desc: stateBookingNote },
              { step: "2", title: "Choose your care", desc: `Compare the ${state.name} city route with an online consultation available across India and see the current price.` },
              { step: "3", title: "Send your request", desc: "Complete the short intake form with your concern and preferred date." },
              { step: "4", title: "We confirm within 24 hours", desc: "Our team matches the right physiotherapist and confirms the appointment details." },
            ].map((s) => (
              <div key={s.step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold font-serif mb-4">
                  {s.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="booking" className="rounded-full px-8 py-6 text-base font-semibold">
              <Link href="/booking">
                Book online
              </Link>
            </Button>
            {BUSINESS_WHATSAPP_URL && (
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold">
                <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Questions? WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 md:py-24 bg-accent/20">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <FAQList faqs={faqs} testIdPrefix="state-faq" />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 md:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Recovery in {state.name}?
          </h2>
          <p className="text-primary-foreground/80 mb-8 text-lg">
            Send a booking request online. {BUSINESS_WHATSAPP_URL && "Questions can continue on WhatsApp."}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="booking" className="rounded-full px-8 py-6 text-base font-semibold">
              <Link href="/booking">
                Book online
              </Link>
            </Button>
            {BUSINESS_PHONE_TEL && (
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href={BUSINESS_PHONE_TEL} aria-label={`Call ${BUSINESS_PHONE_DISPLAY}`}>
                  <Phone className="mr-2 w-5 h-5" />
                  {BUSINESS_PHONE_DISPLAY}
                </a>
              </Button>
            )}
            {BUSINESS_WHATSAPP_URL && (
              <Button asChild size="lg" variant="outline" className="rounded-full px-8 py-6 text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  Questions? WhatsApp
                </a>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
