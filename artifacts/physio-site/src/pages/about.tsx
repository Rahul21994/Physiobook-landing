import { Link } from "wouter";
import { BUSINESS_CONFIG } from "@/config/business";
import { ArrowRight, CheckCircle2, MapPin, UserRound } from "lucide-react";
import { motion } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { BLOG_AUTHOR, BLOG_AUTHOR_PROFILE } from "@/lib/content-profiles";

export default function About() {
  return (
    <div className="bg-background min-h-screen pb-24">
      <section className="bg-accent/20 border-b border-border pt-16 pb-20 md:pt-24 md:pb-24">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <motion.div
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-primary font-semibold tracking-wide uppercase text-sm mb-4">
              About Goswami Rehab
            </p>
            <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Home-based physiotherapy with a clear clinical focus.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Goswami Rehab provides homecare physiotherapy in 45 listed cities, including Delhi NCR, with exact-locality and clinician availability confirmed before a visit. Online consultations are also available worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 max-w-5xl py-16 md:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] items-start">
          <div className="space-y-10">
            <section aria-labelledby="rahul-heading">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <UserRound className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                   <p className="text-sm text-primary font-semibold">
                     {BLOG_AUTHOR_PROFILE.role} · {BLOG_AUTHOR_PROFILE.credential}
                   </p>
                  <h2 id="rahul-heading" className="font-serif text-3xl font-bold text-foreground">
                    {BLOG_AUTHOR}
                  </h2>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Dr. Rahul Goswami is a PT, Senior Physiotherapist, and Exercise Physiologist associated with IIM Madras. His work brings together physiotherapy, therapeutic exercise, movement practice, and practical nutrition guidance for people working towards better function and independence.
              </p>
            </section>

            <section aria-labelledby="care-heading">
              <h2 id="care-heading" className="font-serif text-3xl font-bold text-foreground mb-4">
                What Goswami Rehab does
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                The service focuses on individualised homecare physiotherapy for recovery needs such as neurological rehabilitation, post-surgery rehabilitation, cardiopulmonary rehabilitation, orthopaedic recovery, complex case rehabilitation, and functional training. The appropriate professional, scope, availability, and appointment details are confirmed before care begins.
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Read the{" "}
                <Link href="/services/clinical-assessment-evaluation" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                  clinical assessment approach
                </Link>
                {" "}to understand the first step, or{" "}
                <Link href="/cities" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                  check home-visit coverage by city
                </Link>
                .
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {[
                  "Physiotherapy at home",
                  "Neurological rehabilitation",
                  "Post-surgery rehabilitation",
                  "Cardiopulmonary rehabilitation",
                  "Functional training",
                  "Nutrition consultation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                    <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="network-heading">
              <h2 id="network-heading" className="font-serif text-3xl font-bold text-foreground mb-4">
                A trained home-visit care network
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {BUSINESS_CONFIG.headOffice.branchName} is the Jaipur head office and doctor training centre for {BUSINESS_CONFIG.name}. It is used for operations and clinician training by appointment only; it is not a patient clinic or walk-in treatment location. Physiotherapists join the Goswami Rehab care network and are trained around the team’s assessment, communication, and homecare process before local availability is confirmed.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                {BUSINESS_CONFIG.availability.online}. {BUSINESS_CONFIG.availability.inPerson}. Home visits are scheduled at the patient’s address, not at the head office. The team checks the person’s location, clinical need, professional scope, and availability before confirming the right format of care.
              </p>
              <address
                className="mt-5 rounded-2xl border border-border bg-card p-5 not-italic"
                data-testid="about-head-office"
              >
                <p className="font-semibold text-foreground">{BUSINESS_CONFIG.headOffice.displayName}</p>
                <p className="mt-1 text-sm text-muted-foreground">{BUSINESS_CONFIG.headOffice.description}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {BUSINESS_CONFIG.headOffice.address.displayAddress}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  This is an operations and clinician-training office, not a patient clinic or walk-in treatment location.
                </p>
                <a
                  className="mt-3 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                  href={BUSINESS_CONFIG.headOffice.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View the head office map
                </a>
              </address>
            </section>

            <section aria-labelledby="journal-heading">
              <h2 id="journal-heading" className="font-serif text-3xl font-bold text-foreground mb-4">
                About the rehabilitation journal
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                The journal shares general education about physiotherapy, exercise, recovery, and homecare. Articles are not a diagnosis or a substitute for an in-person assessment. Individual treatment plans and outcomes vary, so readers should speak with an appropriate healthcare professional about their own situation.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Browse the{" "}
                <Link href="/blog" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
                  rehabilitation journal
                </Link>
                {" "}for condition and recovery guides.
              </p>
            </section>

            <section aria-labelledby="care-process-heading">
              <h2 id="care-process-heading" className="font-serif text-3xl font-bold text-foreground mb-4">
                A practical, coordinated care process
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every request starts with the person’s location, health concern, goals, and preferred format of care. The team reviews whether a home visit or online consultation is appropriate, confirms local professional availability, and shares the session details before treatment begins. During rehabilitation, the physiotherapist can adapt exercises to the home environment and coordinate with the patient’s medical team when that is needed.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Goswami Rehab does not promise a fixed outcome or one-size-fits-all timeline. Progress depends on the diagnosis, medical advice, consistency, support at home, and many other factors. The aim is clear communication, measurable functional goals, and a plan that is safe and realistic for everyday life.
              </p>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-3xl border border-primary/15 bg-primary/5 p-7">
              <div className="flex items-center gap-2 text-primary font-semibold mb-4">
                <MapPin className="w-5 h-5" aria-hidden="true" />
                 45 listed cities
              </div>
              <p className="text-muted-foreground leading-relaxed">
                 Home visits are coordinated in the 45 listed cities, including Delhi NCR, subject to exact-locality and local professional availability. Online consultations can support people worldwide.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-background p-7 shadow-sm">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-3">
                Ready to discuss care?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Share your location and recovery needs. The team will confirm whether the requested service is available for you.
              </p>
              <Button asChild variant="booking" className="rounded-full">
                <Link href="/booking">
                  Book an appointment
                  <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}