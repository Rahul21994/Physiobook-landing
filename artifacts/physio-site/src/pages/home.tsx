import { motion } from "@/lib/motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { FAQList } from "@/components/FAQList";
import { services } from "@/lib/site-data";
import { journalDiscoveryIndex as blogIndex } from "@/lib/blog-index";
import { homeFaqs } from "@/lib/home-faqs";
import ReviewsSection from "@/components/ReviewsSection";
import { JournalCard } from "@/components/JournalCard";
import { CarePathChooser } from "@/components/CarePathChooser";
import { groupJournalPosts } from "@/lib/journal-discovery";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_GBP_URL,
  BUSINESS_SISTER_GBP_URL,
  BUSINESS_HQ_ADDRESS,
} from "@/lib/contact";
import { pricing } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { serviceGuidePaths } from "@/lib/service-guide-map";
import { cities, getAdministrativeAreaLabel } from "@/lib/cities";
import { ArrowRight, CheckCircle2, Activity, Heart, Shield, Award, Globe, Video, MapPin, Search } from "lucide-react";

const cityNetworkGroups = Array.from(
  cities.reduce((groups, city) => {
    const areaName = getAdministrativeAreaLabel(city.state, city.administrativeType);
    const areaCities = groups.get(areaName) ?? [];
    areaCities.push(city);
    groups.set(areaName, areaCities);
    return groups;
  }, new Map<string, typeof cities>()),
  ([state, links]) => ({
    state,
    links: [...links].sort((left, right) => left.name.localeCompare(right.name, "en")),
  }),
).sort((left, right) => left.state.localeCompare(right.state, "en"));

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const homepageJournalGroups = groupJournalPosts(blogIndex);

export default function Home() {
  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-accent/30 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-transparent z-10 md:w-3/5" />
        <picture
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat w-full md:w-1/2 md:right-0 md:left-auto opacity-40 md:opacity-100"
        >
          <source
            type="image/avif"
            srcSet="/images/hero-clinic-640.avif 640w, /images/hero-clinic-1024.avif 1024w, /images/hero-clinic-1408.avif 1408w"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
            <img
              src="/images/hero-clinic-1408.avif"
              alt="Physiotherapist guiding a person through a rehabilitation exercise"
            width={1408}
            height={768}
            sizes="(min-width: 768px) 50vw, 100vw"
            fetchPriority="high"
                    loading="eager"
            decoding="async"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        
        <div className="container mx-auto px-4 md:px-6 relative z-20">
          <div className="max-w-2xl">
            <motion.div
              suppressHydrationWarning
              initial={false}
              animate="visible"
              variants={staggerContainer}
            >
              <motion.div suppressHydrationWarning variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6">
                <Activity className="w-4 h-4" />
                <span>Physiotherapist at Home · 45 Cities Across India</span>
              </motion.div>
              <motion.h1 
                suppressHydrationWarning
                variants={fadeIn}
                className="font-serif text-5xl md:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6"
              >
                 Homecare <br className="hidden md:block"/> Physiotherapy <br className="hidden md:block"/> Across 45 Cities.
              </motion.h1>
              <motion.p 
                suppressHydrationWarning
                variants={fadeIn}
                className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-lg"
              >
                 Goswami Rehab provides home visits and online physiotherapy in 45 listed Indian cities, with 35+ specialist physiotherapists, a nutritionist, and an exercise physiologist. Share your exact locality and care needs; clinician availability is confirmed before a home visit.
              </motion.p>
              <motion.div suppressHydrationWarning variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="booking" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all">
                  <Link href="/booking" data-testid="button-hero-booking">
                    Book an Appointment
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-base h-14 px-8 rounded-full bg-background/50 backdrop-blur-sm border-border hover:bg-background">
                  <a
                  href="#services"
                  data-testid="button-hero-services"
                >
                    Our Services
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <CarePathChooser />

      {/* Trust Indicators */}
      <section className="py-12 bg-background border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Award, text: "35+ Specialist Physios" },
               { icon: MapPin, text: "45 Cities · India-wide network" },
              { icon: Heart, text: "Compassionate Care" }
            ].map((item, i) => (
              <div 
                key={i}
                className="flex items-center gap-3 text-foreground/80 font-medium"
              >
                <div className="bg-accent/50 p-2 rounded-lg text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm md:text-base">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-accent/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4 text-foreground">Homecare Physiotherapy Services</h2>
            <p className="text-muted-foreground text-lg">Expert homecare physiotherapy and rehabilitation, tailored to your condition and delivered to your doorstep.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
                 <Link
                   href={
                     service.id === "general-consultation"
                       ? "/booking"
                       : serviceGuidePaths[service.id] ?? "/contact"
                   }
                key={service.id}
                   className="group p-8 rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/20 hover:-translate-y-1 block"
                data-testid={`card-service-${service.id}`}
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                 </div>
                <h3 className="font-serif text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
               </Link>
            ))}
          </div>
          <nav aria-label="Focused service guides" className="mt-12 border-t border-border/60 pt-8 text-center">
            <h3 className="font-serif text-xl font-semibold text-foreground">More focused service guides</h3>
            <ul className="mt-5 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm">
              <li><Link href="/online-physiotherapy" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Online physiotherapy</Link></li>
              <li><Link href="/exercise-physiologist" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Exercise physiology</Link></li>
              <li><Link href="/neck-pain" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Neck pain</Link></li>
              <li><Link href="/sciatica" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Sciatica</Link></li>
              <li><Link href="/arthritis-osteoarthritis" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Arthritis and osteoarthritis</Link></li>
              <li><Link href="/parkinsons-rehab" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Parkinson’s rehabilitation</Link></li>
              <li><Link href="/weight-management" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">Weight management</Link></li>
            </ul>
          </nav>
          <p className="mx-auto mt-10 max-w-3xl text-center text-sm leading-relaxed text-muted-foreground">
            Looking for a focused guide? Read about{" "}
              <Link href="/back-pain" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
              back pain physiotherapy
            </Link>
            ,{" "}
              <Link href="/post-surgery-rehab" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
              post-surgery rehabilitation
            </Link>
            , or{" "}
              <Link href="/stroke-rehab" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
              stroke rehabilitation
            </Link>
            .
          </p>
        </div>
      </section>

      {/* About/Clinic Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl">
                <picture className="block w-full h-full">
                  <source
                    type="image/avif"
                    srcSet="/images/treatment-640.avif 640w, /images/treatment-1024.avif 1024w, /images/treatment-1408.avif 1408w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <source
                    type="image/webp"
                    srcSet="/images/treatment-640.webp 640w, /images/treatment-1024.webp 1024w, /images/treatment-1408.webp 1408w"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                  <img
                    src="/images/treatment-1408.webp"
                    alt="Physiotherapist treating a patient"
                    width={1408}
                    height={768}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    loading="lazy"
                    decoding="async"
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                  />
                </picture>
              </div>
            </div>
            
            <div className="lg:w-1/2 space-y-6">
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground">
                Expert care delivered to your home.
              </h2>
               <p className="text-lg text-muted-foreground leading-relaxed">
                  Goswami Rehab is built on one belief: that real recovery should happen where you are most comfortable — at home. With 35+ specialist physiotherapists serving a 45-city network, we bring professional physiotherapy, cardiopulmonary rehabilitation, complex case rehabilitation, and nutrition guidance directly to your doorstep. <Link href="/about" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">Learn about our clinical team</Link>.
              </p>
              <ul className="space-y-4 pt-4">
                {[
                  "35+ specialist physios across Rajasthan, Delhi, Punjab, Karnataka, Maharashtra, Kerala, Assam, Uttarakhand & Jammu",
                  "Expert rehabilitation physiotherapy for stroke rehabilitation, Parkinson's physiotherapy, post-surgery rehabilitation, cardiopulmonary rehabilitation & complex cases",
                  "Standardised clinical assessment protocols with evidence-based, personalised rehabilitation pathways",
                  "Dedicated physiotherapists in your city — no long wait, no travel hassle"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="pt-6">
                 <Button asChild variant="booking" size="lg" className="rounded-full px-8 h-12">
                   <Link
                    href="/booking"
                    data-booking-mode="telehealth"
                  >
                    Start Your Journey
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-background" id="pricing">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-4">Transparent Pricing</span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">Simple, Honest Fees</h2>
             <p className="text-muted-foreground text-lg">Home visits are available in all 45 listed cities; exact locality and clinician availability are confirmed for each request.</p>
          </div>

          <div className="max-w-3xl mx-auto mb-8 bg-primary text-primary-foreground rounded-2xl p-6 text-center">
            <p className="text-xs font-bold tracking-widest uppercase text-primary-foreground/70 mb-1">Introductory service pricing</p>
            <p className="font-serif text-2xl font-bold mb-2">55% off while we expand home-visit coverage</p>
            <p className="text-sm text-primary-foreground/80 max-w-xl mx-auto">We are keeping introductory rates available while we expand coordinated home visits and gather early patient feedback. There is no artificial booking limit.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-10">
            {[
              {
                 region: "Home Visit — 45 Listed Cities",
                flag: "🏥",
                 cities: "City-level availability; exact locality confirmed before booking",
                original: pricing.homeVisit.regularAmount,
                introPrice: pricing.homeVisit.amount,
              },
              {
                region: "Online Consultation",
                flag: "💻",
                cities: "Available worldwide · WhatsApp / Google Meet / Zoom",
                original: pricing.telehealth.regularDisplayAmount,
                introPrice: pricing.telehealth.displayAmount,
              },
            ].map((r, i) => (
              <div
                key={i}
                className="bg-accent/20 border border-border/60 rounded-3xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">55% OFF</div>
                <div className="text-3xl mb-3">{r.flag}</div>
                <h3 className="font-serif text-2xl font-bold text-foreground mb-1">{r.region}</h3>
                <p className="text-sm text-muted-foreground mb-5">{r.cities}</p>
                <div className="flex items-end gap-2 mb-1">
                  <span className="text-4xl font-bold text-primary">{r.introPrice}</span>
                </div>
                 <p className="text-xs text-primary font-semibold mb-1">introductory service price</p>
                 <p className="text-xs text-muted-foreground line-through">{`Regular: ${r.original} per session`}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground max-w-xl mx-auto">
               Not sure which plan is right for you? Book a free 15-minute consultation and we'll recommend the right rehabilitation path.
            </p>
          </div>
        </div>
      </section>

      {/* Telehealth / Online Consultation */}
      <section className="py-20 bg-primary/5 border-y border-border/40" id="telehealth">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary tracking-widest uppercase mb-4">
                  <Globe className="w-4 h-4" /> Online Consultations
                </span>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
                  Expert Physio. Any Country. Any Device.
                </h2>
                 <p className="text-muted-foreground text-lg mb-6">
                   Can't get a home visit? Our online physiotherapy consultation brings professional assessment, exercise prescription, and rehabilitation guidance directly to your screen — wherever you are in the world. <Link href="/online-care" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">See how online care works</Link>.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Available worldwide — no geographical restrictions",
                    "Video call via WhatsApp, Google Meet, or Zoom",
                    "Movement assessment, exercise prescription & rehabilitation planning",
                    "Same certified physiotherapists, remote format",
                    "Flexible scheduling across all time zones",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="booking" size="lg" className="rounded-full px-8 h-12">
                  <Link href="/booking" data-booking-mode="telehealth">
                     Book online consultation
                  </Link>
                </Button>
              </div>

              <div className="bg-background rounded-3xl p-8 border border-border/60 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Online Consultation</p>
                    <p className="text-sm text-muted-foreground">Initial Assessment · Worldwide</p>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex items-end gap-2 mb-1">
                    <span className="text-5xl font-bold text-primary">{pricing.telehealth.displayAmount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">per consultation · available to everyone globally</p>
                </div>
                <div className="space-y-3 pt-4 border-t border-border/50">
                  {[
                    "30–45 min video session",
                    "Movement & posture assessment",
                    "Personalised exercise prescription",
                    "Condition-specific rehabilitation plan",
                    "WhatsApp follow-up support",
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground/80">{feat}</span>
                    </div>
                  ))}
                </div>
                <Button asChild variant="booking" className="block mt-6 w-full rounded-full h-11">
                  <Link
                    href="/booking"
                    data-booking-mode="telehealth"
                  >
                     Book now — {pricing.telehealth.displayAmount}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {false && (<section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-4">Patient Stories</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Real Recoveries. Real Lives.</h2>
            <div className="flex items-center justify-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
              ))}
              <span className="ml-2 text-sm font-medium text-muted-foreground">Patient experiences shared with permission</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                name: "Hemant Choudhary",
                location: "Tigaon, Haryana",
                condition: "Road Traffic Accident — Post-Surgery Rehabilitation",
                review: "After a major road accident and surgery, I struggled to walk on both legs. With consistent post-surgery physiotherapy and rehabilitation, I gradually rebuilt my strength, balance, and confidence. I have now returned to normal daily movement and am deeply grateful to the team for their patient, focused care throughout my recovery.",
              },
              {
                name: "Ramesh N.",
                location: "Bengaluru, Karnataka",
                condition: "Post-Bypass Cardiac Rehabilitation",
                review: "After my bypass surgery I was scared to even walk. The cardiopulmonary rehab program at home was exactly what I needed. Six weeks later I was climbing stairs without breathlessness. Fantastic team.",
              },
              {
                name: "Priya M.",
                location: "Mumbai, Maharashtra",
                condition: "Knee Replacement Rehabilitation",
                review: "My 68-year-old mother had her knee replaced and the hospital physio was rushed. Goswami Rehab sent someone to our home the very next day. She was walking without support in 5 weeks.",
              },
              {
                name: "Dr. Anjali T.",
                location: "Hyderabad, Telangana",
                condition: "Complex Neurological Rehabilitation (GBS)",
                review: "My husband was discharged from ICU after GBS — totally paralysed. As a doctor I'd rarely seen a team handle such a complex case so well. He's walking with a walker now. Cannot recommend them highly enough.",
              },
              {
                name: "Vikram S.",
                location: "Delhi NCR",
                condition: "COPD Pulmonary Rehabilitation",
                review: "I was hospitalised twice last year for COPD flares. Three months into the home pulmonary rehab program and I haven't been back to hospital once. They covered everything — breathing, posture, pacing.",
              },
              {
                 name: "Moe Steven",
                location: "Kochi, Kerala",
                condition: "Rotator Cuff Surgery Rehabilitation",
                review: "Rotator cuff surgery left me unable to lift my arm past my waist. The home physio program was progressive, well-explained, and incredibly professional. Full range of motion restored in 10 weeks.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-accent/10 rounded-3xl p-6 flex flex-col gap-4 border border-border/40"
              >
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, si) => (
                    <svg key={si} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                  ))}
                </div>
                <p className="text-foreground text-sm leading-relaxed flex-1">"{t.review}"</p>
                <div className="border-t border-border/40 pt-4">
                  <p className="font-semibold text-foreground text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{t.condition} · {t.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>)}

      {/* Locations */}
      <section className="py-20 bg-accent/10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
             <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-4">45-City Network</span>
             <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">Home Visits Across 45 Listed Cities</h2>
             <p className="text-muted-foreground">
                Home visits and online consultation are available in all 45 listed cities. Named localities are references, not guaranteed service zones; share your exact address so the team can confirm clinician availability.{" "}
               <Link href="/cities" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">Browse all cities we serve</Link>
               {" "}or read our{" "}
               <Link href="/physiotherapist-at-home-in/kerala" className="font-medium text-primary underline underline-offset-4 hover:text-primary/80">Kerala coverage guide</Link>.
             </p>
          </div>

          {/* State and territory grid */}
          <div className="max-w-5xl mx-auto mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cityNetworkGroups.map(({ state, links }) => (
                <div
                  key={state}
                  className="bg-background border border-border/50 rounded-2xl p-5 flex items-start gap-3"
                >
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-foreground text-sm">{state}</p>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1.5">
                      {links.map((city) => (
                        <Link
                          key={city.slug}
                          href={`/physiotherapist-at-home/${city.slug}`}
                          className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-md px-2 py-3 text-xs text-primary hover:underline font-medium"
                        >
                          {city.slug === "gurgaon" ? "Gurugram (Gurgaon)" : city.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Jaipur operations hub */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-background rounded-3xl border border-border/60 shadow-sm overflow-hidden">
              <div className="bg-primary/5 px-6 py-4 border-b border-border/40 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-sm font-semibold text-foreground">Jaipur operations HQ — training &amp; onboarding base</span>
              </div>
              <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-foreground">{BUSINESS_HQ_ADDRESS.streetAddress}</p>
                  <p className="text-muted-foreground text-sm">{BUSINESS_HQ_ADDRESS.localityLine}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-xl">
                    This is our operations, physiotherapist training, and onboarding HQ—not a patient clinic or walk-in treatment location. Goswami Rehab arranges patient care at home where available.
                  </p>
                  <p className="text-sm text-primary font-medium mt-2 flex items-center gap-1">
                     <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                     {BUSINESS_PHONE_DISPLAY}
                  </p>
                </div>
                 <a
                   href={BUSINESS_GBP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors whitespace-nowrap flex-shrink-0"
                >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                   View Goswami Rehab on Google
                </a>
              </div>
               <div className="px-6 pb-6 text-sm text-muted-foreground">
                 Gift rehab center is a sister listing at the same Jaipur operations base.{" "}
                 <a
                   href={BUSINESS_SISTER_GBP_URL}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="font-medium text-primary underline underline-offset-4"
                 >
                   View its Google listing
                 </a>
                 .
               </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">Don't see your city? <a href="/contact" className="text-primary hover:underline font-medium">Contact us</a> — we're expanding rapidly.</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <span className="inline-block text-sm font-semibold text-primary tracking-widest uppercase mb-4">FAQ</span>
              <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">Common Questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know about booking homecare physiotherapy.</p>
            </div>
            <FAQList faqs={homeFaqs} testIdPrefix="home-faq" />
            <div className="mt-10 text-center">
              <Button asChild variant="booking" size="lg" className="rounded-full px-8 h-12">
                <Link href="/booking">
                  Book a Physiotherapist at Home
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Journal discovery */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-14 max-w-3xl">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-primary">Goswami Rehab Journal</p>
                <h2 className="font-serif text-3xl font-bold text-foreground md:text-5xl">Guides for safer recovery at home</h2>
              </div>
              <Link href="/blog" className="inline-flex items-center font-semibold text-primary hover:underline">
                View all articles <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="mt-4 text-lg text-muted-foreground">
              Read practical, evidence-informed articles about pain, mobility, rehabilitation, nutrition, and homecare.
            </p>
            <form action="/blog" method="get" className="mt-7 flex flex-col gap-3 sm:flex-row" role="search">
              <label htmlFor="homepage-journal-search" className="sr-only">Search the Journal</label>
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <input
                  id="homepage-journal-search"
                  name="search"
                  type="search"
                  placeholder="Search the Journal"
                  className="h-12 w-full rounded-full border border-border bg-background pl-12 pr-5 text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button type="submit" className="h-12 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Search
              </button>
            </form>
          </div>

          <div className="space-y-16">
            {homepageJournalGroups.map((group) => {
              const featuredPost = group.posts[0];
              if (!featuredPost) return null;

              return (
                <section
                  key={group.id}
                  aria-labelledby={`homepage-journal-${group.id}`}
                  data-testid={`homepage-journal-group-${group.id}`}
                >
                  <div className="mb-7 max-w-3xl">
                    <h3 id={`homepage-journal-${group.id}`} className="font-serif text-2xl font-bold text-foreground md:text-3xl">
                      {group.heading}
                    </h3>
                    <p className="mt-2 text-muted-foreground">{group.description}</p>
                  </div>
                  <div
                    className="homepage-journal-featured max-w-md"
                    data-testid={`homepage-journal-featured-${group.id}`}
                  >
                    <JournalCard
                      post={featuredPost}
                      analyticsSource="homepage_journal"
                    />
                  </div>
                </section>
              );
            })}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full rounded-full">
              <Link href="/blog">
                View All Articles
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Payment Methods — placed immediately before patient reviews */}
      <section className="py-16 bg-background" id="payment-methods" data-testid="payment-methods">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto bg-accent/10 border border-border/50 rounded-2xl p-6">
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">Payment Options</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Pay after your session using the method that is most convenient for you.</p>

            {/* QR + UPI */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 bg-background border border-border/60 rounded-2xl p-5">
              <img
                src="/images/payment-qr.jpg"
                alt="Goswami Rehab UPI QR Code — scan with any UPI app"
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="w-36 h-36 rounded-xl object-contain border border-border flex-shrink-0"
              />
              <div className="text-center sm:text-left">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Scan &amp; Pay — any UPI app</p>
                <p className="font-mono text-lg font-bold text-foreground mb-1">rgk21994-2@okhdfcbank</p>
                <p className="text-sm text-muted-foreground mb-3">PhonePe · Google Pay · Paytm · BHIM</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                   Scan the QR or type the UPI ID directly. Payment is collected after your first session — not upfront.
                </p>
              </div>
            </div>

            {/* Other methods */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              {[
                { icon: "🏦", label: "Bank Transfer", note: "NEFT / IMPS / RTGS" },
                { icon: "💳", label: "Cards", note: "Visa, Mastercard, RuPay" },
                { icon: "💬", label: "WhatsApp Pay", note: "Details on confirmation" },
              ].map((m, i) => (
                <div key={i} className="bg-background rounded-xl p-3 border border-border/40">
                  <div className="text-xl mb-1">{m.icon}</div>
                  <p className="text-xs font-semibold text-foreground">{m.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{m.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <ReviewsSection />

      {/* CTA Section */}
      <section className="py-24 bg-accent/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center max-w-3xl">
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            Ready to book a physiotherapist at home?
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
             Take the first step towards recovery. Book a homecare physiotherapy session in one of 45 listed cities — share your exact locality and our team will confirm clinician availability before the visit. Introductory service pricing is currently available.
          </p>
          <Button asChild variant="booking" size="lg" className="h-16 px-10 rounded-full text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            <Link href="/booking">
              Book a Physiotherapist at Home
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
