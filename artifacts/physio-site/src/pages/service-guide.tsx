import { Link, useLocation, useParams } from "wouter";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock3, ShieldAlert, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CareOptions } from "@/components/CareOptions";
import { FAQList } from "@/components/FAQList";
import { BUSINESS_CONFIG } from "@/config/business";
import {
  serviceGuideByPath,
  serviceGuideBySlug,
  serviceGuides,
  type ServiceGuide,
} from "@/lib/service-guides";
import generatedEditorialPathways from "@/lib/service-guide-editorial-pathways.generated.json";
import { trackEvent } from "@/lib/analytics";

type GuideLink = { href: string; label: string };
const editorialPathways = generatedEditorialPathways as unknown as Record<
  string,
  Array<[slug: string, label: string]>
>;

const serviceGuidePaths = new Set(
  serviceGuides.map((candidate) => candidate.routePath ?? `/services/${candidate.slug}`),
);

const serviceTopicGroups: Array<{ match: RegExp; slugs: string[] }> = [
  {
    match: /nutrition|weight|diet/,
    slugs: [
      "nutritional-consultation",
      "weight-management",
      "exercise-physiologist",
      "clinical-assessment-evaluation",
      "homecare-physiotherapy",
    ],
  },
  {
    match: /pregnan|postpartum|pelvic|women/,
    slugs: [
      "pregnancy-postpartum-support",
      "functional-training",
      "nutritional-consultation",
      "clinical-assessment-evaluation",
      "homecare-physiotherapy",
    ],
  },
  {
    match: /paediatric|pediatric|infant|development|child/,
    slugs: [
      "infant-early-development-physiotherapy",
      "pediatric-disability-rehabilitation",
      "advanced-complex-case-recovery",
      "rehabilitation-programs",
      "functional-training",
    ],
  },
  {
    match: /neurolog|stroke|parkinson|brain|spinal|complex/,
    slugs: [
      "stroke-rehabilitation",
      "parkinsons-rehab",
      "advanced-complex-case-recovery",
      "functional-training",
      "clinical-assessment-evaluation",
    ],
  },
  {
    match: /cardio|pulmonary|copd|breath|heart|lung/,
    slugs: [
      "cardiopulmonary-rehabilitation",
      "exercise-physiologist",
      "functional-training",
      "clinical-assessment-evaluation",
      "homecare-physiotherapy",
    ],
  },
  {
    match: /sport|athlet|running|exercise|conditioning/,
    slugs: [
      "sports-enhancement-consultation",
      "exercise-physiologist",
      "functional-training",
      "pain-management-physiotherapy",
      "rehabilitation-programs",
    ],
  },
  {
    match: /online|telehealth|remote/,
    slugs: [
      "online-physiotherapy",
      "clinical-assessment-evaluation",
      "exercise-physiologist",
      "rehabilitation-programs",
      "homecare-physiotherapy",
    ],
  },
  {
    match: /back|knee|neck|sciatica|arthritis|orthopaedic|orthopedic|fracture|surgery|joint|pain|injury|shoulder|hip|ankle|spine/,
    slugs: [
      "back-pain-physiotherapy",
      "knee-pain-physiotherapy",
      "pain-management-physiotherapy",
      "post-surgery-rehabilitation",
      "rehabilitation-programs",
      "clinical-assessment-evaluation",
    ],
  },
];

const generalServiceSlugs = [
  "clinical-assessment-evaluation",
  "homecare-physiotherapy",
  "rehabilitation-programs",
  "functional-training",
  "advanced-complex-case-recovery",
];

const priorityRelatedServicePaths: Record<string, string[]> = {
  "/back-pain": ["/knee-pain", "/post-surgery-rehab", "/stroke-rehab"],
  "/knee-pain": ["/back-pain", "/post-surgery-rehab", "/stroke-rehab"],
  "/post-surgery-rehab": ["/back-pain", "/knee-pain", "/stroke-rehab"],
  "/stroke-rehab": ["/back-pain", "/knee-pain", "/post-surgery-rehab"],
};

function getServicePathway(guide: ServiceGuide): GuideLink[] {
  const guidePath = guide.routePath ?? `/services/${guide.slug}`;
  const authoredLabels = new Map(
    (guide.relatedLinks ?? [])
      .filter((link) => serviceGuidePaths.has(link.href))
      .map((link) => [link.href, link.label]),
  );
  const topicText = `${guide.slug} ${guide.title} ${guide.shortTitle} ${guide.breadcrumbParent ?? ""}`.toLowerCase();
  const topicGroup = serviceTopicGroups.find(({ match }) => match.test(topicText));
  const groupedSlugs = topicGroup?.slugs ?? generalServiceSlugs;
  const sameParentSlugs = serviceGuides
    .filter(
      (candidate) =>
        candidate.slug !== guide.slug &&
        Boolean(guide.breadcrumbParent) &&
        candidate.breadcrumbParent === guide.breadcrumbParent,
    )
    .map((candidate) => candidate.slug);
  const candidates = [
    ...(priorityRelatedServicePaths[guidePath] ?? []),
    ...authoredLabels.keys(),
    ...groupedSlugs.map((slug) => {
      const candidate = serviceGuides.find((item) => item.slug === slug);
      return candidate?.routePath ?? (candidate ? `/services/${candidate.slug}` : "");
    }),
    ...sameParentSlugs.map((slug) => {
      const candidate = serviceGuides.find((item) => item.slug === slug);
      return candidate?.routePath ?? (candidate ? `/services/${candidate.slug}` : "");
    }),
    ...generalServiceSlugs.map((slug) => {
      const candidate = serviceGuides.find((item) => item.slug === slug);
      return candidate?.routePath ?? (candidate ? `/services/${candidate.slug}` : "");
    }),
  ];

  const uniquePaths = Array.from(new Set(candidates)).filter(
    (href) => href && href !== guidePath && serviceGuidePaths.has(href),
  );

  return uniquePaths.slice(0, 3).map((href) => {
    const candidate = serviceGuides.find(
      (item) => (item.routePath ?? `/services/${item.slug}`) === href,
    );
    return {
      href,
      label: authoredLabels.get(href) ?? `Explore ${candidate?.shortTitle ?? "related rehabilitation"}`,
    };
  });
}

const serviceCoverageLinks: Record<string, Array<{ href: string; label: string }>> = {
  "homecare-physiotherapy": [
    { href: "/physiotherapist-at-home/jaipur", label: "Home physiotherapy in Jaipur" },
    { href: "/physiotherapist-at-home/delhi", label: "Home physiotherapy in Delhi" },
    { href: "/physiotherapist-at-home/gurgaon", label: "Home physiotherapy in Gurugram (Gurgaon)" },
    { href: "/physiotherapist-at-home/tigaon", label: "Home physiotherapy in Tigaon" },
    { href: "/physiotherapist-at-home/faridabad", label: "Home physiotherapy in Faridabad" },
    { href: "/physiotherapist-at-home/mumbai", label: "Home physiotherapy in Mumbai" },
  ],
  "back-pain-physiotherapy": [
    { href: "/physiotherapist-at-home/jaipur", label: "Home physiotherapy in Jaipur" },
    { href: "/physiotherapist-at-home/delhi", label: "Home physiotherapy in Delhi" },
    { href: "/physiotherapist-at-home/bengaluru", label: "Home physiotherapy in Bengaluru" },
    { href: "/physiotherapist-at-home/gurgaon", label: "Back pain physiotherapy in Gurugram (Gurgaon)" },
  ],
  "knee-pain-physiotherapy": [
    { href: "/physiotherapist-at-home/jaipur", label: "Knee rehabilitation in Jaipur" },
    { href: "/physiotherapist-at-home/faridabad", label: "Knee rehabilitation in Faridabad" },
    { href: "/physiotherapist-at-home/mumbai", label: "Knee rehabilitation in Mumbai" },
  ],
  "post-surgery-rehabilitation": [
    { href: "/physiotherapist-at-home/delhi", label: "Post-surgery home physiotherapy in Delhi" },
    { href: "/physiotherapist-at-home/tigaon", label: "Post-surgery home physiotherapy in Tigaon" },
    { href: "/physiotherapist-at-home/moradabad", label: "Post-surgery home physiotherapy in Moradabad" },
  ],
  "stroke-rehabilitation": [
    { href: "/physiotherapist-at-home/faridabad", label: "Stroke rehabilitation in Faridabad" },
    { href: "/physiotherapist-at-home/bengaluru", label: "Stroke rehabilitation in Bengaluru" },
    { href: "/physiotherapist-at-home/mumbai", label: "Stroke rehabilitation in Mumbai" },
  ],
  "pain-management-physiotherapy": [
    { href: "/physiotherapist-at-home/jaipur", label: "Pain physiotherapy in Jaipur" },
    { href: "/physiotherapist-at-home/gurgaon", label: "Pain physiotherapy in Gurugram (Gurgaon)" },
    { href: "/physiotherapist-at-home/delhi", label: "Pain physiotherapy in Delhi" },
  ],
};

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-muted-foreground leading-relaxed">
          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function ServiceGuide() {
  const { slug } = useParams();
  const [location] = useLocation();
  const currentPath = location.replace(/\/+$/, "") || "/";
  const guide = serviceGuideByPath[currentPath] ?? (slug ? serviceGuideBySlug[slug] : undefined);

  if (!guide) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="font-serif text-5xl font-bold mb-4">Service Not Found</h1>
        <p className="text-muted-foreground mb-8 text-lg">Choose a service to learn more about physiotherapy, rehabilitation, and recovery.</p>
        <Button asChild className="rounded-full">
          <Link href="/#services">Back to Services</Link>
        </Button>
      </div>
    );
  }

  const resolvedGuide = guide;
  const canonicalPath = guide.routePath ?? `/services/${guide.slug}`;
  const canonicalUrl = `${BUSINESS_CONFIG.siteUrl}${canonicalPath}`;
  const relatedServiceLinks = getServicePathway(guide);
  const relatedEditorialLinks = (editorialPathways[guide.slug] ?? []).map(
    ([slug, label]) => ({ href: `/blog/${slug}`, label }),
  );

  function trackServiceBooking(placement: "hero" | "final") {
    trackEvent("service_booking_cta_click", {
      route: "service",
      service: resolvedGuide.slug,
      placement,
    });
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>{guide.metaTitle ?? `${guide.shortTitle} | Goswami Rehab`}</title>
        <meta
          name="description"
          content={guide.metaDescription ?? guide.summary}
        />
        <meta property="og:title" content={guide.metaTitle ?? `${guide.shortTitle} | Goswami Rehab`} />
        <meta property="og:description" content={guide.metaDescription ?? guide.summary} />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <section className="bg-accent/20 border-b border-border pt-16 pb-20">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <Link href="/#services" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary font-medium mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to Services
          </Link>
          <div className="flex items-center gap-3 text-primary font-semibold mb-5">
            <BookOpen className="w-5 h-5" /> Goswami Rehab Rehabilitation Guide
          </div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight max-w-4xl mb-6">{guide.title}</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed">{guide.summary}</p>
          {guide.careContext && (
            <p className="mt-6 max-w-3xl border-l-2 border-primary/30 pl-5 text-base leading-relaxed text-foreground/80">
              {guide.careContext}
            </p>
          )}
          <Button asChild variant="booking" size="lg" className="mt-8 rounded-full px-7">
            <Link href="/contact" onClick={() => trackServiceBooking("hero")}>
              Request a consultation <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {guide.editorial && (
        <section className="container mx-auto mt-12 max-w-5xl px-4 md:px-6" aria-label={`${guide.shortTitle} information`}>
          <div className="mx-auto max-w-3xl space-y-8">
            {guide.editorial.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-8 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      )}

      <div className="container mx-auto px-4 md:px-6 max-w-5xl mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
          <div className="lg:col-span-2 rounded-3xl border border-primary/15 bg-primary/5 p-7 md:p-9">
            <div className="flex items-center gap-3 text-primary font-semibold mb-4"><Target className="w-5 h-5" /> Expected prognosis</div>
            <p className="text-foreground text-lg leading-relaxed">{guide.prognosis}</p>
          </div>
          <div className="rounded-3xl border border-border bg-accent/20 p-7 md:p-9">
            <div className="flex items-center gap-3 text-primary font-semibold mb-4"><Clock3 className="w-5 h-5" /> Approximate time</div>
            <p className="text-foreground leading-relaxed">{guide.timeline}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <section>
            <h2 className="font-serif text-3xl font-bold mb-6">What this service covers</h2>
            <BulletList items={guide.covers} />
          </section>
          <section>
            <h2 className="font-serif text-3xl font-bold mb-6">Physiotherapy &amp; rehabilitation methods</h2>
            <BulletList items={guide.methods} />
          </section>
          <section>
            <h2 className="font-serif text-3xl font-bold mb-6">What affects recovery?</h2>
            <BulletList items={guide.factors} />
          </section>
          <section className="rounded-3xl border border-destructive/15 bg-destructive/5 p-7">
            <h2 className="font-serif text-3xl font-bold mb-6 flex items-center gap-3"><ShieldAlert className="w-6 h-6 text-destructive" /> Safety notes</h2>
            <BulletList items={guide.precautions} />
          </section>
        </div>

        <section className="mt-14 border-t border-border pt-8">
           <p className="text-sm text-muted-foreground leading-relaxed"><strong className="text-foreground">Clinical note:</strong> Timelines are approximate educational ranges, not an individual prognosis. The treating physiotherapist adjusts the rehabilitation plan after assessment and coordinates with the medical team when needed.</p>
          {guide.textbookBasis && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-3">
              <strong className="text-foreground">Further reading:</strong> {guide.textbookBasis}
            </p>
          )}
        </section>

        <CareOptions
          locationLabel="your recovery plan"
          homeCoverage="Home visits in 45 listed cities; locality confirmed"
          bookingHref="/contact"
          analyticsService={guide.slug}
        />

        {guide.editorial?.faqs.length ? (
          <section className="mt-14 border-t border-border pt-10" aria-labelledby="service-faq-heading">
            <h2 id="service-faq-heading" className="font-serif text-3xl font-bold mb-6">
              Frequently asked questions
            </h2>
            <FAQList
              faqs={guide.editorial.faqs.map(({ question, answer }) => ({
                q: question,
                a: answer,
              }))}
              testIdPrefix={`service-${guide.slug}-faq`}
            />
          </section>
        ) : null}

        {relatedServiceLinks.length > 0 && (
          <section
            className="mt-14 border-t border-border pt-10"
            aria-labelledby="related-services-heading"
            data-testid="service-guide-related-services"
          >
            <h2 id="related-services-heading" className="font-serif text-3xl font-bold mb-6">
              Related services
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {relatedServiceLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-border bg-background p-5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="mt-3 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {relatedEditorialLinks.length > 0 && (
          <section
            className="mt-12 border-t border-border pt-10"
            aria-labelledby="related-guides-heading"
            data-testid="service-guide-related-guides"
          >
            <h2 id="related-guides-heading" className="font-serif text-3xl font-bold mb-6">
              Related guides
            </h2>
            <div className="grid gap-3 md:grid-cols-3">
              {relatedEditorialLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-border bg-background p-5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="mt-3 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {(serviceCoverageLinks[guide.slug] ?? []).length > 0 && (
          <section className="mt-12 border-t border-border pt-10" aria-labelledby="service-locations-heading">
            <h2 id="service-locations-heading" className="font-serif text-3xl font-bold mb-3">
              Where to arrange this care
            </h2>
            <p className="mb-6 max-w-3xl text-muted-foreground leading-relaxed">
              Home-visit availability is confirmed by locality and professional fit. These location pages explain the local coverage and the next step for an enquiry.
            </p>
            <div className="grid gap-3 md:grid-cols-3">
              {(serviceCoverageLinks[guide.slug] ?? []).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-border bg-background p-5 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="mt-3 h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-14 rounded-3xl bg-primary text-primary-foreground p-8 md:p-12 text-center">
           <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Need a rehabilitation plan?</h2>
          <p className="opacity-90 max-w-2xl mx-auto mb-7">Send a request so the team can review your preferred care format and next steps. In-person care is by appointment only.</p>
            <Button asChild variant="booking" size="lg" className="rounded-full">
              <Link href="/contact" onClick={() => trackServiceBooking("final")}>
                Contact Goswami Rehab <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
        </section>
      </div>
    </div>
  );
}