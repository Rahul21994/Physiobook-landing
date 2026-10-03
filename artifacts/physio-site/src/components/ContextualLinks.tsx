import { ArrowRight, BookOpen, CalendarDays, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "wouter";
import type { ContextualLink } from "@/lib/contextual-links";
import { trackEvent } from "@/lib/analytics";

type ContextualPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
};

type ContextualLinksProps = {
  relatedPosts?: ContextualPost[];
  serviceLink?: ContextualLink;
  title?: string;
  intro?: string;
  testId?: string;
  sourceRoute: string;
};

export function ContextualLinks({
  relatedPosts = [],
  serviceLink,
  title = "Choose your next step",
  intro = "Keep exploring with a focused guide, a relevant care option, or a direct enquiry.",
  testId = "contextual-links",
  sourceRoute,
}: ContextualLinksProps) {
  const uniquePosts = relatedPosts.filter(
    (post, index, posts) => posts.findIndex((candidate) => candidate.id === post.id) === index,
  );

  return (
    <section
      className="contextual-links mt-14 border-t border-border pt-10"
      aria-labelledby={`${testId}-heading`}
      data-testid={testId}
    >
      <div className="mb-6 max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-primary">
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          Continue exploring
        </p>
        <h2 id={`${testId}-heading`} className="font-serif text-3xl font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-3 leading-relaxed text-muted-foreground">{intro}</p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3" data-testid={`${testId}-trust-signals`}>
        <Link
          href="/about"
          className="flex items-start gap-3 rounded-xl border border-border/80 bg-background px-4 py-3 text-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <strong className="block text-foreground">Named clinical team</strong>
            <span className="text-muted-foreground">Author and reviewer details are visible.</span>
          </span>
        </Link>
        <div className="flex items-start gap-3 rounded-xl border border-border/80 bg-background px-4 py-3 text-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <strong className="block text-foreground">Safety-first guidance</strong>
            <span className="text-muted-foreground">Education is clearly separated from diagnosis.</span>
          </span>
        </div>
        <Link
          href="/booking"
          className="flex items-start gap-3 rounded-xl border border-border/80 bg-background px-4 py-3 text-sm transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
          <span>
            <strong className="block text-foreground">Care confirmed first</strong>
            <span className="text-muted-foreground">Location, fit, and availability are checked.</span>
          </span>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {uniquePosts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group rounded-2xl border border-border bg-background p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() =>
              trackEvent("contextual_link_click", {
                route: sourceRoute,
                destination: post.slug,
                kind: "journal",
              })
            }
          >
            <BookOpen className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Journal guide
            </span>
            <span className="mt-2 block font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Read the guide
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        ))}

        {serviceLink && (
          <Link
            href={serviceLink.href}
            className="group rounded-2xl border border-primary/20 bg-primary/5 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            onClick={() =>
              trackEvent("contextual_link_click", {
                route: sourceRoute,
                destination: serviceLink.href,
                kind: "service",
              })
            }
          >
            <Stethoscope className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
            <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              Relevant care
            </span>
            <span className="mt-2 block font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {serviceLink.label}
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
              {serviceLink.description}
            </span>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
              Explore care
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>
        )}

        <Link
          href="/booking"
          className="group rounded-2xl border border-border bg-accent/20 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          data-cta="contextual-booking"
          onClick={() =>
            trackEvent("booking_cta_click", {
              route: sourceRoute,
              placement: "contextual-links",
            })
          }
        >
          <CalendarDays className="mb-4 h-5 w-5 text-primary" aria-hidden="true" />
          <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Direct next step
          </span>
          <span className="mt-2 block font-serif text-xl font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            Discuss your recovery plan
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-muted-foreground">
            Share your location, concern, and preferred format so the team can confirm the right option.
          </span>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            Book an appointment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </Link>
      </div>
    </section>
  );
}