import { useParams, Link } from "wouter";
import { motion } from "@/lib/motion";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import {
  getCityBySlug,
  getCitySeoMetadata,
  hasVerifiedHomecareCoverage,
  getCityConfirmationWindowHours,
  getAdministrativeAreaLabel,
  rehabilitationLabel,
  cities,
} from "@/lib/cities";
import { pricing } from "@/lib/pricing";
import { getCityServiceThemes } from "@/lib/location-services";
import { journalDiscoveryIndex as blogPosts } from "@/lib/blog-index";
import { getCityJournalPostSummaries } from "@/lib/city-journal-index";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_WHATSAPP_URL,
} from "@/lib/contact";
import { CityPricing } from "@/components/CityPricing";
import { LocalityGrid } from "@/components/LocalityGrid";
import { LocalReviews } from "@/components/LocalReviews";
import { LocalFAQ, getLocalFaqs } from "@/components/LocalFAQ";
import { MoradabadCoordinator } from "@/components/MoradabadCoordinator";
import { JournalTileArt } from "@/components/JournalTileArt";
import { JournalCard } from "@/components/JournalCard";
import { ContentAttribution } from "@/components/ContentAttribution";
import { getCityReviews } from "@/lib/city-reviews";
import { getNeutralJournalFallback } from "@/lib/journal-discovery";
import { states } from "@/lib/states";
import { trackEvent } from "@/lib/analytics";
import {
  ArrowRight, CheckCircle2, Phone, MapPin, Star, Shield,
  Activity, Clock, Users, Award, BookOpen, ChevronRight
} from "lucide-react";

const focusedGuidesByCity: Record<string, Array<{ href: string; label: string }>> = {
  jaipur: [
    { href: "/stroke-rehab", label: "stroke rehabilitation" },
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
    { href: "/services/cardiopulmonary-rehabilitation", label: "cardiopulmonary service" },
  ],
  delhi: [
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
    { href: "/stroke-rehab", label: "stroke rehabilitation" },
    { href: "/services/cardiopulmonary-rehabilitation", label: "cardiopulmonary care guide" },
  ],
  gurgaon: [
    { href: "/back-pain", label: "back pain physiotherapy in Gurugram (Gurgaon)" },
    { href: "/services/pain-management-physiotherapy", label: "pain-management physiotherapy in Gurugram (Gurgaon)" },
    { href: "/services/clinical-assessment-evaluation", label: "clinical assessment in Gurugram (Gurgaon)" },
  ],
  faridabad: [
    { href: "/knee-pain", label: "knee pain physiotherapy" },
    { href: "/stroke-rehab", label: "stroke rehabilitation" },
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
  ],
  tigaon: [
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
    { href: "/stroke-rehab", label: "stroke rehabilitation" },
    { href: "/services/clinical-assessment-evaluation", label: "clinical assessment" },
  ],
  bengaluru: [
    { href: "/stroke-rehab", label: "stroke rehabilitation" },
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
    { href: "/services/cardiopulmonary-rehabilitation", label: "home cardiopulmonary rehab" },
  ],
  mumbai: [
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
    { href: "/stroke-rehab", label: "stroke rehabilitation" },
    { href: "/services/cardiopulmonary-rehabilitation", label: "cardiopulmonary recovery support" },
  ],
  moradabad: [
    { href: "/services/pain-management-physiotherapy", label: "pain-management physiotherapy" },
    { href: "/post-surgery-rehab", label: "post-surgery rehabilitation" },
    { href: "/services/clinical-assessment-evaluation", label: "clinical assessment" },
  ],
};

const defaultFocusedGuides = [
    { href: "/home-physiotherapy", label: "homecare physiotherapy" },
  { href: "/services/clinical-assessment-evaluation", label: "clinical assessment" },
];

const activeHomecareSteps = [
  { step: "1", title: "Share your location", desc: "Use a locality reference and provide your exact address for a home-visit request." },
  { step: "2", title: "Choose your care", desc: "Compare a home visit with an online consultation and see the current price." },
  { step: "3", title: "Send your request", desc: "Tell the team about your concern and preferred date." },
  { step: "4", title: "Confirm availability", desc: "The team confirms exact-locality and clinician availability before booking." },
];

const placementReviewSteps = [
  { step: "1", title: "Start online", desc: "Online physiotherapy consultation is available now from this city." },
  { step: "2", title: "Share your location", desc: "Use a locality reference and include your exact address in a home-visit enquiry." },
  { step: "3", title: "Review placement", desc: "The team assesses demand and whether a local clinician can be placed." },
  { step: "4", title: "Confirm the next step", desc: "A home visit is confirmed only after team placement and local availability checks." },
];

export default function CityPage() {
  const params = useParams<{ city: string }>();
  const city = getCityBySlug(params.city ?? "");

  if (!city) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">City Not Found</h1>
        <p className="text-muted-foreground mb-8">We may not serve this city yet — contact us to check availability.</p>
        <Button asChild className="rounded-full">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  const cityJournalPosts = getCityJournalPostSummaries(city.slug);
  const cityGuidePost = blogPosts.find(
    (post) => post.slug === `physiotherapist-at-home-${city.slug}`,
  );
  const indiaHomecarePost = getNeutralJournalFallback(blogPosts);
  const faridabadLumbarPost = blogPosts.find(
    (post) => post.slug === "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1",
  );
  const gurgaonSkinPost = blogPosts.find(
    (post) => post.slug === "skin-inflammation-vasculitis-diet-guide",
  );
  const reviewMode = city.reviewMode ?? "city";
  const cityReviews = reviewMode === "city" ? getCityReviews(city.slug) : [];
  const stateLanding = states.find((state) => state.citySlugs.includes(city.slug));
  const isExpansionCity = !hasVerifiedHomecareCoverage(city);
  const confirmationWindowHours = getCityConfirmationWindowHours(city.slug);
  const steps = isExpansionCity ? placementReviewSteps : activeHomecareSteps;
  const localityReferences = city.nearby.slice(0, 3).join(", ");
  const nearbyCityLinks = city.nearbyCities
    .map((slug) => cities.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is (typeof cities)[number] => Boolean(candidate))
    .slice(0, 3);
  const focusedGuides = focusedGuidesByCity[city.slug] ?? defaultFocusedGuides;
  const isGurgaon = city.slug === "gurgaon";
  const visibleCityName = isGurgaon ? "Gurugram (Gurgaon)" : city.name;
  const localIntro = isExpansionCity
    ? `Online physiotherapy consultation is available now from ${visibleCityName}. Home-visit enquiries may support future team placement based on demand; a visit is confirmed only after a team is placed and exact-locality and clinician availability are checked.`
    : `Home visits are active at city level in ${visibleCityName}. Share your exact locality and care needs; the team confirms clinician availability before booking.`;
  const localFocus = isExpansionCity
    ? `Online care can support guided assessment and recovery planning now. In-person visits are considered only after a local team is placed and availability is confirmed.`
    : `A home rehabilitation plan is shaped around each person's assessment, goals, and living environment. Exact locality and clinician availability are confirmed before a visit is promised.`;
  const localCoverage = isExpansionCity
    ? `${localityReferences} are locality references for an enquiry, not verified service zones. Online consultation is available now; home visits depend on future team placement and local confirmation.`
    : `${localityReferences} are locality references, not a guaranteed service map. Home visits are active at city level in ${city.name}; exact address and clinician availability are confirmed before booking.`;
  const cityHeroHeading =
    city.heroHeading && !/^online physiotherapy/i.test(city.heroHeading)
      ? city.heroHeading
      : `Physiotherapy at Home in ${visibleCityName}`;
  const citySeo = getCitySeoMetadata(city);
  const locationServices = getCityServiceThemes(city);

  const BASE_URL = "https://goswamirehab.in";
  const ORG_ID = `${BASE_URL}/#organization`;

  const breadcrumbSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": `${BASE_URL}/`,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Cities",
        "item": `${BASE_URL}/cities`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": city.name,
        "item": `${BASE_URL}/physiotherapist-at-home/${city.slug}`,
      },
    ],
  });

  const schemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE_URL}/physiotherapist-at-home/${city.slug}#service`,
    "name": isExpansionCity
      ? `Online Physiotherapy Consultation in ${city.name}`
      : `Physiotherapy at Home in ${city.name}`,
    "url": `${BASE_URL}/physiotherapist-at-home/${city.slug}`,
    "provider": { "@id": ORG_ID },
    "areaServed": { "@type": "City", "name": city.name },
    "serviceType": isExpansionCity
      ? "Online Physiotherapy Consultation"
      : "Home Physiotherapy",
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Physiotherapy Services",
      "itemListElement": locationServices.map((svc) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": isExpansionCity ? `${svc.title} — Online consultation` : svc.title,
          "description": isExpansionCity
            ? `Discuss ${svc.title.toLowerCase()} by online consultation. Home visits require team placement and local confirmation.`
              : `Home visits are active at city level in ${city.name}; exact locality and clinician availability are confirmed before booking.`,
        },
      })),
    },
  });
  const faqSchemaJson = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": getLocalFaqs(city).map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  });

  return (
    <div className="min-h-screen bg-background overflow-hidden">

      <Helmet>
        <title>{citySeo.title}</title>
        <meta name="description" content={citySeo.description} />
        <meta property="og:title" content={citySeo.title} />
        <meta property="og:description" content={citySeo.description} />
        <meta property="og:url" content={`${BASE_URL}/physiotherapist-at-home/${city.slug}`} />
        <meta
          name="robots"
          content={city.indexable ? "index, follow" : "noindex, follow"}
        />
        {city.indexable && typeof window === "undefined" && (
          <script type="application/ld+json">{schemaJson}</script>
        )}
        {city.indexable && typeof window === "undefined" && breadcrumbSchema && (
          <script type="application/ld+json">{breadcrumbSchema}</script>
        )}
        {city.indexable && typeof window === "undefined" && (
          <script type="application/ld+json">{faqSchemaJson}</script>
        )}
      </Helmet>

      {/* ── HERO ── */}
      <section className="bg-accent/30 pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div suppressHydrationWarning initial={false} animate={{ opacity: 1, y: 0 }}>
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-5 flex-wrap">
                <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                <Link href="/cities" className="hover:text-primary transition-colors">Cities</Link>
                <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-foreground font-medium">{city.name}</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
              <MapPin className="w-4 h-4" />
              <span>{city.name}, {getAdministrativeAreaLabel(city.state, city.administrativeType)}</span>
              {city.isHQ && <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs ml-1">Operations base</span>}
            </div>

            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6">
              {isExpansionCity ? (
                <>Online Physiotherapy<br className="hidden md:block" /> from {visibleCityName}</>
              ) : cityHeroHeading ?? (isGurgaon ? (
                <>Physiotherapy<br className="hidden md:block" /> at Home in<br className="hidden md:block" /> {visibleCityName}</>
              ) : (
                <>Physiotherapist<br className="hidden md:block" /> at Home in<br className="hidden md:block" /> {visibleCityName}.</>
              ))}
            </h1>

            <p
              data-sab-availability
              data-coverage-status={isExpansionCity ? "placement" : "active"}
              className="mb-6 max-w-2xl text-sm font-medium text-primary"
            >
              {isExpansionCity
                ? "Online consultation is available now. Home visits require team placement and confirmation of exact-locality and clinician availability."
                : "Home visits are active at city level. Exact locality and clinician availability are confirmed before booking."}
            </p>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              {localIntro}
            </p>
            {isExpansionCity && (
              <p className="mb-8 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary">
                Online consultation available now from {city.name}
              </p>
            )}

            <ContentAttribution testId="city-attribution" className="mb-8" />

            <div className="flex flex-wrap gap-4">
              {isExpansionCity ? (
                <Button
                  asChild
                  variant="booking"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold"
                >
                  <Link
                  href="/booking"
                  data-booking-mode="telehealth"
                  data-booking-city={city.slug}
                  data-cta="city-online-consultation"
                  data-city={city.slug}
                  onClick={() =>
                    trackEvent("booking_cta_click", {
                      route: "city",
                      city: city.slug,
                      placement: "hero-online-consultation",
                    })
                  }
                >
                    Start online consultation
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="booking"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold"
                >
                  <Link
                    href="/booking"
                    data-booking-mode="home"
                    data-booking-city={city.slug}
                    data-cta="city-booking"
                    data-city={city.slug}
                    onClick={() =>
                      trackEvent("booking_cta_click", {
                        route: "city",
                        city: city.slug,
                        placement: "hero",
                      })
                    }
                  >
                    Book online
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              )}
              {isExpansionCity ? (
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold"
                >
                  <Link
                    href="/booking"
                    data-booking-mode="home"
                    data-booking-city={city.slug}
                    data-cta="city-booking"
                    data-city={city.slug}
                    onClick={() =>
                      trackEvent("booking_cta_click", {
                        route: "city",
                        city: city.slug,
                        placement: "hero",
                      })
                    }
                  >
                    Send a home-visit enquiry
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
              ) : BUSINESS_PHONE_TEL ? (
                <Button
                  asChild
                  variant="booking"
                  size="lg"
                  className="rounded-full px-8 py-6 text-base font-semibold"
                >
                  <a
                    href={BUSINESS_PHONE_TEL}
                    aria-label={`Call ${BUSINESS_PHONE_DISPLAY}`}
                    data-cta="city-phone"
                    data-city={city.slug}
                    onClick={() =>
                      trackEvent("contact_cta_click", {
                        route: "city",
                        city: city.slug,
                        channel: "phone",
                        placement: "hero",
                      })
                    }
                  >
                    <Phone className="mr-2 w-5 h-5" />
                    {BUSINESS_PHONE_DISPLAY}
                  </a>
                </Button>
              ) : null}
            </div>
          </motion.div>
        </div>
      </section>

      {localFocus && (
        <section className="py-16 md:py-20 border-b border-border/50">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-3xl bg-primary/5 border border-primary/10 p-7 md:p-9">
                <p className="text-primary font-semibold mb-3">
                  {isExpansionCity ? "Online recovery support" : "Local recovery support"}
                </p>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Rehabilitation designed around your daily life
                </h2>
                <p className="text-muted-foreground leading-relaxed">{localFocus}</p>
                  {!isExpansionCity && city.careContext && (
                   <p className="mt-4 border-t border-primary/10 pt-4 text-sm leading-relaxed text-foreground/80">
                     {city.careContext}
                   </p>
                 )}
              </div>
              {localCoverage && (
                <div className="rounded-3xl bg-accent/30 border border-border p-7 md:p-9">
                  <p className="text-primary font-semibold mb-3">
                    Locality references
                  </p>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
                    Location and availability
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{localCoverage}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <LocalityGrid city={city} />

      {stateLanding && (
        <section className="border-b border-border/50 bg-background py-8">
          <div className="container mx-auto flex flex-col gap-3 px-4 md:flex-row md:items-center md:justify-between md:px-6 max-w-5xl">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Looking beyond {city.name}? Browse physiotherapy options across {stateLanding.name}.
            </p>
            <Link
              href={`/physiotherapist-at-home-in/${stateLanding.slug}`}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View {stateLanding.name} options
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      )}

      {nearbyCityLinks.length > 0 && (
        <section className="border-b border-border/50 bg-accent/10 py-10">
          <div className="container mx-auto flex flex-col gap-5 px-4 md:flex-row md:items-center md:justify-between md:px-6 max-w-5xl">
            <div>
              <p className="text-sm font-semibold text-primary">Related city pages</p>
              <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
                Compare nearby locations
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Each link has its own home-visit status. Nearby city pages do not imply a shared team or service area.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 md:max-w-sm md:justify-end">
              {nearbyCityLinks.map((nearbyCity) => (
                <Link
                  key={nearbyCity.slug}
                  href={`/physiotherapist-at-home/${nearbyCity.slug}`}
                  data-testid={`nearby-city-link-${nearbyCity.slug}`}
                  data-nearby-city={nearbyCity.slug}
                  data-coverage-status={hasVerifiedHomecareCoverage(nearbyCity) ? "active" : "placement"}
                  className="inline-flex flex-col items-start gap-1 rounded-2xl border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-primary transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <span className="inline-flex items-center gap-1">
                    {nearbyCity.name}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {hasVerifiedHomecareCoverage(nearbyCity)
                      ? "Active home visits; locality confirmed"
                      : "Online now; home visits by placement enquiry"}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── TRUST BAR ── */}
      <section className="border-y border-border bg-background py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-6 text-sm">
            {[
              { icon: <Users className="w-5 h-5" />, text: "35+ Specialist Physiotherapists" },
              { icon: <MapPin className="w-5 h-5" />, text: isExpansionCity ? "Online consultation available now" : `Home visits active in ${city.name}` },
              { icon: <Shield className="w-5 h-5" />, text: "Patient-focused rehabilitation" },
              { icon: <Clock className="w-5 h-5" />, text: isExpansionCity ? "Home visits depend on team placement" : `Home visits confirmed within ${confirmationWindowHours} hours` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-muted-foreground">
                <span className="text-primary">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-24 bg-accent/20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-primary font-semibold mb-2 flex items-center justify-center gap-2">
              <Activity className="w-5 h-5" /> Simple &amp; Fast
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
              {isExpansionCity
                ? "Online Care and Home-Visit Enquiries"
                : "How Home Physiotherapy Works"}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <motion.div
            suppressHydrationWarning
                key={s.step}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="bg-background rounded-3xl p-8 border border-border"
              >
                <div
                  className="city-process-step w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-primary mb-6"
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-3">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CityPricing cityName={city.name} citySlug={city.slug} isExpansion={isExpansionCity} />

      {/* ── SERVICES ── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-14">
            <p className="text-primary font-semibold mb-2 flex items-center gap-2">
              <Award className="w-5 h-5" /> What We Offer
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
               {isExpansionCity
                 ? `Online Physiotherapy Topics for ${city.name}`
                 : `Physiotherapy Services at Home in ${city.name}`}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {isExpansionCity
                ? `Online rehabilitation guidance is available now from ${city.name}. These topics can be discussed online; home visits depend on future team placement and local confirmation.`
                : `This evidence-informed service mix reflects ${city.name}'s recovery contexts. Care is selected after assessment, and exact home-visit locality and clinician availability are confirmed before booking.`}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {locationServices.map((svc) => (
               <div key={svc.id} className="group bg-background rounded-3xl p-6 border border-border hover:border-primary/30 hover:shadow-md transition-all">
                <div
                   className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-600 transition-all group-hover:bg-orange-500 group-hover:text-white"
                 >
                   <Activity className="h-5 w-5" aria-hidden="true" />
                 </div>
                 <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{svc.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {isExpansionCity
                        ? `Discuss ${svc.title.toLowerCase()} by online consultation from ${city.name}. Home visits depend on future team placement and local confirmation.`
                        : `Discuss ${svc.title.toLowerCase()} with a specialist. Home visits are active at city level; exact locality and clinician availability are confirmed before booking.`}
                    </p>
                 <span className="mt-3 block text-xs leading-relaxed text-muted-foreground">
                   Evidence basis:{" "}
                   <a
                     href={svc.source.href}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline underline-offset-2 hover:text-primary"
                   >
                     {svc.source.title}
                   </a>
                 </span>
                  <Link
                    href={svc.href}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    onClick={() =>
                      trackEvent("service_card_click", {
                        city: city.slug,
                        theme: svc.id,
                      })
                    }
                  >
                    Explore service <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
            For focused recovery planning in {city.name}, explore{" "}
            {focusedGuides.map((guide, index) => (
              <span key={guide.href}>
                {index > 0 && (index === focusedGuides.length - 1 ? ", or " : ", ")}
                <Link href={guide.href} className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
                  {guide.label}
                </Link>
              </span>
            ))}
            .
          </p>
          <div className="mt-10 text-center">
            <Button asChild size="lg" variant="booking" className="rounded-full px-10">
              <Link
                href="/booking"
                data-booking-mode={isExpansionCity ? "telehealth" : "home"}
                data-booking-city={city.slug}
                data-cta="city-booking"
                data-city={city.slug}
                onClick={() =>
                  trackEvent("booking_cta_click", {
                    route: "city",
                    city: city.slug,
                    placement: "services",
                  })
                }
              >
                {isExpansionCity ? "Start an Online Consultation" : "Check Home-Visit Availability"}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── CITY JOURNAL ── */}
      {cityJournalPosts.length > 0 && (
        <section
          id={`city-journal-${city.slug}`}
          className="py-16 md:py-20 border-t border-border"
          data-testid={`city-journal-${city.slug}`}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="mb-10 max-w-3xl">
              <p className="text-primary font-semibold mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> From the Journal
              </p>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-3">
                Rehabilitation guides for your recovery
              </h2>
              <p className="text-muted-foreground text-base leading-relaxed">
                Practical, evidence-informed reading for the health and rehabilitation questions
                patients and families may be working through at home in {city.name}.
              </p>
              {cityGuidePost &&
                !cityJournalPosts.some((post) => post.slug === cityGuidePost.slug) && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    For a broader overview, read{" "}
                    <Link
                      href={`/blog/${cityGuidePost.slug}`}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      our guide to arranging physiotherapy in {city.name}
                    </Link>
                    .
                  </p>
                )}
            </div>
             <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {cityJournalPosts.map((post, index) => (
                 <JournalCard
                  key={post.id}
                   post={post}
                    priority={index === 0}
                   testId={`card-city-journal-${post.slug}`}
                   analyticsSource="city_journal"
                 />
              ))}
            </div>
          </div>
        </section>
      )}

      {city.slug === "faridabad" && faridabadLumbarPost && (
        <section
          className="border-t border-border bg-accent/10 py-14 md:py-16"
          data-testid="faridabad-lumbar-journal-link"
        >
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                From the Journal
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-foreground md:text-3xl">
                Understanding lower-back and leg pain
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                A structured guide to lumbar disc symptoms, warning signs, and
                assessment-led rehabilitation for people arranging care in Faridabad.
              </p>
            </div>
            <div className="max-w-sm">
              <JournalCard
                post={faridabadLumbarPost}
                priority
                testId="card-faridabad-lumbar-journal"
                analyticsSource="city_journal"
              />
            </div>
          </div>
        </section>
      )}

      {city.slug === "gurgaon" && gurgaonSkinPost && (
        <section
          className="border-t border-border bg-accent/10 py-14 md:py-16"
          data-testid="gurgaon-skin-inflammation-journal-link"
        >
          <div className="container mx-auto max-w-5xl px-4 md:px-6">
            <div className="mb-8 max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                From the Journal
              </p>
              <h2 className="mt-3 font-serif text-2xl font-bold text-foreground md:text-3xl">
                Skin symptoms, inflammation, and safe next steps
              </h2>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                A safety-first nutrition and care guide for people comparing
                inflammatory skin symptoms while arranging support in Gurugram.
              </p>
            </div>
            <div className="max-w-sm">
              <JournalCard
                post={gurgaonSkinPost}
                priority
                testId="card-gurgaon-skin-journal"
                analyticsSource="city_journal"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── CONDITIONS ── */}
      <section className="py-20 md:py-24 bg-accent/20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="mb-10 max-w-3xl">
            <p className="text-primary font-semibold mb-2 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Rehabilitation Support
            </p>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
               Physiotherapy-led rehabilitation for your recovery in {city.name}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Our physiotherapists support recovery, mobility, strength, breathing,
              balance, and everyday function for people living with the following
              rehabilitation needs. Your plan is shaped around your assessment,
              home environment, and recovery goals.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
             {city.conditions.map((condition) => (
              <div
                 key={condition}
                className="flex min-h-12 items-center gap-2 bg-background rounded-xl p-3 border border-border"
              >
                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                 <span className="text-sm font-medium leading-snug text-foreground">{rehabilitationLabel(condition)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-primary font-semibold mb-2 flex items-center gap-2">
                <Star className="w-5 h-5" /> Why Patients Choose Us
              </p>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
                {isExpansionCity
                  ? `Specialist Physiotherapy from ${city.name}`
                  : "The Right Physio, at Your Door"}
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                {isExpansionCity
                  ? `Online consultations are available now from ${city.name}. Home-visit enquiries may support future team placement; a visit is not confirmed until a clinician is placed and your locality is checked.`
                  : `Goswami Rehab provides home physiotherapy in ${city.name}, subject to exact-locality and clinician confirmation. Our 35+ specialist physiotherapists include neurological, cardiopulmonary, and orthopaedic rehabilitation specialists.`}
              </p>
              <div className="space-y-4">
                {[
                  "Senior specialist physiotherapists — not generalists",
                  isExpansionCity
                    ? "Online consultations are available now from this city"
                    : `Home visits active in ${city.name}; exact locality confirmed before booking`,
                  isExpansionCity
                    ? "Home visits considered only after team placement and local confirmation"
                    : "Fully equipped home sessions, subject to confirmed availability",
                  "Regular progress tracking and reassessment",
                  isExpansionCity
                    ? "Choose Google Meet, Zoom, or WhatsApp video"
                    : "Direct WhatsApp access to your physiotherapist",
                  "Telehealth follow-up available worldwide",
                ].map((point) => (
                  <div key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { label: "Specialist Physiotherapists", value: "35+" },
                { label: "States Served Across India", value: "15+" },
                { label: "Complex Case Support", value: "Available" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-accent/40 rounded-2xl p-6 border border-border"
                >
                  <div className="font-serif text-4xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {city.slug === "moradabad" && <MoradabadCoordinator />}

      <LocalReviews city={city} mode={reviewMode} />

      <LocalFAQ city={city} />

      {cityJournalPosts.length === 0 && cityGuidePost && (
        <section
          className="py-16 md:py-20 border-t border-border"
          data-testid={`city-journal-guide-${city.slug}`}
        >
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="mb-8 max-w-3xl">
              <p className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <BookOpen className="h-5 w-5" /> From the Journal
              </p>
              <h2 className="mb-3 font-serif text-2xl font-bold text-foreground md:text-3xl">
                A practical physiotherapy guide for {city.name}
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                Read a city-specific guide before you enquire. It covers what to share with the
                team, what a first assessment may involve, and how local availability is confirmed.
              </p>
            </div>
            <div className="max-w-md">
              <JournalCard
                post={cityGuidePost}
                testId={`card-city-journal-guide-${city.slug}`}
                analyticsSource="city_journal"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── INDIA-WIDE JOURNAL GUIDE FOR CITIES WITHOUT CURATED LOCAL POSTS ── */}
      {cityJournalPosts.length === 0 && !cityGuidePost && indiaHomecarePost && (
        <section className="py-16 md:py-20 border-t border-border">
          <div className="container mx-auto px-4 md:px-6 max-w-5xl">
            <div className="mb-8 max-w-3xl">
              <p className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <BookOpen className="h-5 w-5" /> From the Journal
              </p>
              <h2 className="mb-3 font-serif text-2xl font-bold text-foreground md:text-3xl">
                Home physiotherapy guidance for patients across India
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                This practical guide explains what to expect from home physiotherapy and how to
                send an enquiry. Local availability, professional matching, and the right care
                format are confirmed after you share your location and recovery needs.
              </p>
            </div>
            <div className="max-w-md">
              <JournalCard
                post={indiaHomecarePost}
                testId={`card-city-journal-${city.slug}-india-guide`}
                analyticsSource="city_journal"
              />
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl text-center">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
            {isExpansionCity
              ? `Start Online Physiotherapy from ${city.name}`
              : `Book a Physiotherapist at Home in ${city.name} Today`}
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            {isExpansionCity
              ? `Choose a video platform and send an online consultation request. Online consultations are confirmed the same day—usually within 6 hours and no later than 12 hours. If you request a home visit, the team reviews demand for future placement; a visit is confirmed only after a team is placed and local availability is checked.`
              : `Choose your care and send a booking request online. We confirm exact-locality and clinician availability for home visits within ${confirmationWindowHours} hours; online consultations are confirmed the same day—usually within 6 hours and no later than 12 hours.`}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              asChild
              size="lg"
              variant="booking"
              className="rounded-full px-10 py-6 text-base font-semibold"
            >
              <Link
                href="/booking"
                data-booking-mode="home"
                data-booking-city={city.slug}
                data-cta="city-booking"
                data-city={city.slug}
                onClick={() =>
                  trackEvent("booking_cta_click", {
                    route: "city",
                    city: city.slug,
                    placement: "final",
                  })
                }
              >
                {isExpansionCity ? "Enquire about a home visit" : "Book online"}
              </Link>
            </Button>
            {isExpansionCity ? (
              <Button
                asChild
                size="lg"
                variant="booking"
                className="rounded-full px-10 py-6 text-base font-semibold"
              >
                <Link
                href="/booking"
                data-booking-mode="telehealth"
                data-booking-city={city.slug}
                data-cta="city-online-consultation"
                data-city={city.slug}
              >
                  Book online consultation
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            ) : BUSINESS_WHATSAPP_URL ? (
              <Button
                asChild
                size="lg"
                className="rounded-full px-10 py-6 text-base font-semibold"
              >
                <a
                href={BUSINESS_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                data-cta="city-whatsapp"
                data-city={city.slug}
                onClick={() =>
                  trackEvent("contact_cta_click", {
                    route: "city",
                    city: city.slug,
                    channel: "whatsapp",
                    placement: "final",
                  })
                }
              >
                  Questions? WhatsApp
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            ) : null}
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            {isExpansionCity
              ? `Home visit price if a team is placed: ${pricing.homeVisit.amount} · Online consultation ${pricing.telehealth.amount} · Home-visit placement depends on demand and local confirmation`
              : `Home visits ${pricing.homeVisit.amount} · Online ${pricing.telehealth.amount} · Home visits confirmed within ${confirmationWindowHours} hours · Online confirmation same day (usually within 6 hours, no later than 12 hours)`}
          </p>
        </div>
      </section>

    </div>
  );
}
