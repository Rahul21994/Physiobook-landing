import { Link } from "wouter";
import { Helmet } from "react-helmet-async";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  ShieldAlert,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CareOptions } from "@/components/CareOptions";
import { pricing } from "@/lib/pricing";

const consultationScope = [
  "Movement, posture, strength, balance, and functional assessment by video",
  "Exercise prescription for pain, mobility, conditioning, and recovery goals",
  "Guidance after surgery or injury when the treating medical team has set safe precautions",
  "Neurological rehabilitation education, caregiver guidance, and progress reviews",
  "Home exercise progression, pacing, ergonomics, and return-to-activity planning",
];

const consultationPractices = [
  "A structured video history and symptom review",
  "Movement observation using the space and equipment available at home",
  "Clear demonstrations with teach-back so exercises are understood safely",
  "A personalised plan that is adjusted as symptoms, function, and confidence change",
  "Follow-up guidance through WhatsApp, Google Meet, or Zoom as agreed",
];

const notSuitableFor = [
  "A medical emergency or symptoms needing immediate in-person assessment",
  "New chest pain, severe breathlessness, fainting, sudden weakness, or confusion",
  "A suspected fracture, serious infection, uncontrolled bleeding, or rapidly worsening condition",
  "Any situation where the clinician cannot assess safety remotely",
];

export default function OnlineCare() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <Helmet>
        <title>Online Physiotherapy Consultation | Goswami Rehab</title>
        <meta
          name="description"
          content="Online physiotherapy consultation worldwide for movement assessment, personalised exercise, rehabilitation planning, and progress support."
        />
        <link rel="canonical" href="https://goswamirehab.in/online-care" />
      </Helmet>
      <section className="border-b border-border bg-primary/5 pt-16 pb-20 md:pt-24 md:pb-24">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Globe2 className="h-4 w-4" aria-hidden="true" />
            Online consultation · worldwide
          </div>
          <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
            Online Physiotherapy Consultation for Clear, Practical Recovery Guidance
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Meet a Goswami Rehab physiotherapist by video for movement assessment,
            personalised exercises, rehabilitation planning, and progress support
            wherever you are. Online care is available worldwide when remote
            assessment is clinically appropriate.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            If hands-on care at home is more appropriate, check{" "}
            <Link href="/home-physiotherapy" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              homecare physiotherapy
            </Link>
            {" "}options and{" "}
            <Link href="/cities" className="font-semibold text-primary underline underline-offset-4 hover:text-primary/80">
              local city coverage
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="booking" size="lg" className="w-full rounded-full px-7 sm:w-auto">
            <Link href="/booking" data-booking-mode="telehealth">
                Book an online consultation
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full rounded-full px-7 sm:w-auto">
            <a href="#scope">
                See the consultation scope
            </a>
          </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
        <section className="mb-16 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="overview-heading">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              A remote format, not a generic video
            </p>
            <h2 id="overview-heading" className="mb-5 font-serif text-3xl font-bold text-foreground md:text-4xl">
              What happens in an online consultation?
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The physiotherapist first understands your symptoms, diagnosis,
              medical advice, goals, and daily activities. They then observe
              relevant movements, explain what they are looking for, and build a
              plan that fits your home, equipment, time, and confidence level.
              The plan is reviewed and progressed rather than copied from a
              one-size-fits-all routine.
            </p>
          </div>
          <div className="rounded-3xl border border-primary/15 bg-primary/5 p-7 md:p-8">
            <div className="mb-5 flex items-center gap-3 text-primary">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                <Video className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <p className="font-serif text-2xl font-bold text-foreground">Online consultation</p>
                <p className="text-sm text-muted-foreground">Worldwide · WhatsApp / Meet / Zoom</p>
              </div>
            </div>
            <div className="mb-5 flex items-end gap-2">
              <span className="text-4xl font-bold text-primary">{pricing.telehealth.amount}</span>
              <span className="mb-1 text-sm text-muted-foreground">per consultation</span>
            </div>
            <div className="flex items-start gap-3 border-t border-border/60 pt-5 text-sm leading-relaxed text-muted-foreground">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span>Flexible scheduling across time zones. The final fee and session details are confirmed before the appointment.</span>
            </div>
          </div>
        </section>

        <section id="scope" className="scroll-mt-28 border-t border-border pt-14" aria-labelledby="scope-heading">
          <div className="mb-8 max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Clinical scope</p>
            <h2 id="scope-heading" className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              What online physiotherapy can cover
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Remote physiotherapy works best when the person can participate,
              the environment is reasonably safe, and the goals can be assessed
              through conversation and movement observation.
            </p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {consultationScope.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-2xl border border-border bg-background p-5 text-foreground/90">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 grid gap-12 border-t border-border pt-14 md:grid-cols-2" aria-labelledby="practices-heading">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">How we practise</p>
            <h2 id="practices-heading" className="mb-6 font-serif text-3xl font-bold text-foreground">
              Practical online consultation methods
            </h2>
            <ul className="space-y-4">
              {consultationPractices.map((item) => (
                <li key={item} className="flex items-start gap-3 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-destructive/15 bg-destructive/5 p-7 md:p-8">
            <div className="mb-5 flex items-center gap-3">
              <ShieldAlert className="h-6 w-6 text-destructive" aria-hidden="true" />
              <h2 className="font-serif text-2xl font-bold text-foreground">When online care is not enough</h2>
            </div>
            <p className="mb-5 leading-relaxed text-muted-foreground">
              A video consultation cannot replace urgent care, hands-on
              examination, or medical review when safety is uncertain. Seek
              appropriate local medical help for:
            </p>
            <ul className="space-y-3">
              {notSuitableFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/80">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-16 rounded-3xl border border-border bg-accent/20 p-7 md:p-10" aria-labelledby="steps-heading">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-primary">Before your session</p>
          <h2 id="steps-heading" className="mb-8 font-serif text-3xl font-bold text-foreground md:text-4xl">
            Three simple steps to get started
          </h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {[
              ["1", "Share your goals", "Tell us your location, condition, preferred date, and whether online care is the format you need."],
              ["2", "Prepare your space", "Keep a stable chair, enough room to move, and any reports, medication list, or home equipment nearby."],
              ["3", "Join and practise", "Use the confirmed WhatsApp, Google Meet, or Zoom link and ask questions while practising the plan."],
            ].map(([number, title, description]) => (
              <li key={number}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {number}
                </div>
                <h3 className="mb-2 font-serif text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <CareOptions
          locationLabel="your recovery plan"
          homeCoverage="Home visits are coordinated across covered Indian cities; online care is worldwide."
          bookingHref="/booking"
        />

        <section className="mt-14 rounded-3xl bg-primary p-8 text-center text-primary-foreground md:p-12">
          <h2 className="mb-4 font-serif text-3xl font-bold md:text-4xl">Ready to discuss your recovery?</h2>
          <p className="mx-auto mb-7 max-w-2xl leading-relaxed opacity-90">
            Book online and share the context that will help the team decide
            whether a video consultation is suitable for you.
          </p>
          <Button asChild variant="booking" size="lg" className="rounded-full px-8">
            <Link href="/booking" data-booking-mode="telehealth">
              Book online consultation
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}