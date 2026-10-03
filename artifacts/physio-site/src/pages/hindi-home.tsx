import { ArrowRight, Globe, MapPin } from "lucide-react";
import { services } from "@/lib/site-data";
import { serviceGuidePaths } from "@/lib/service-guide-map";
import { getExistingHindiTranslation } from "@/lib/language";

function translatedPhrase(source: string): string {
  const translation = getExistingHindiTranslation(source);
  if (!translation) {
    throw new Error(`Hindi homepage phrase has no authored translation: "${source}".`);
  }
  return translation;
}

export default function HindiHome() {
  const translatedServices = services.flatMap((service) => {
    const title = getExistingHindiTranslation(service.title);
    const description = getExistingHindiTranslation(service.description);
    if (!title || !description) return [];

    return [{
      id: service.id,
      title,
      description,
      href: service.id === "general-consultation"
        ? "/booking"
        : serviceGuidePaths[service.id] ?? "/contact",
    }];
  });

  return (
    <div data-no-translate>
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30 py-20 md:py-28">
        <div className="container mx-auto max-w-5xl px-4 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm font-semibold text-primary">
              <Globe className="h-4 w-4" aria-hidden="true" />
              {translatedPhrase("Physiotherapist at Home · 45 Cities Across India")}
            </p>
            <h1 className="font-serif text-4xl font-bold leading-tight text-foreground md:text-6xl">
              {translatedPhrase("Homecare Physiotherapy in 45 Listed Cities.")}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              {translatedPhrase(
                "Goswami Rehab brings certified homecare physiotherapy across India — Rajasthan, Delhi NCR, Punjab, Karnataka, Maharashtra, Kerala, Assam, Uttarakhand, Jammu & more. 35+ specialist physios. Stroke rehabilitation, cardiopulmonary rehabilitation, post-surgery rehabilitation, neurological rehabilitation & complex case recovery.",
              )}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="/hi/booking"
                data-booking-mode="home-visit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
              >
                {translatedPhrase("Start Your Journey")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/cities"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-background px-6 py-3 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {translatedPhrase("View All Cities")}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-accent/10 py-16 md:py-20">
        <div className="container mx-auto max-w-6xl px-4 md:px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="font-serif text-3xl font-bold text-foreground md:text-4xl">
              {translatedPhrase("Homecare Physiotherapy Services")}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              {translatedPhrase(
                "Expert homecare physiotherapy and rehabilitation, tailored to your condition and delivered to your doorstep.",
              )}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            <a
              href="/hi/home-physiotherapy"
              className="group rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                घर पर फिजियोथेरेपी
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                यह सेवा व्यक्ति की ज़रूरत के अनुसार घर पर फिजियोथेरेपी पर केंद्रित है।
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                {translatedPhrase("Learn More")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </a>
            {translatedServices.map((service) => (
              <a
                key={service.id}
                href={service.id === "physio-session" ? "/hi/home-physiotherapy" : service.href}
                className="group rounded-2xl border border-border/60 bg-background p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
              >
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {translatedPhrase("Learn More")}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="/hi/online-care" className="font-semibold text-primary underline underline-offset-4">
              {translatedPhrase("Online Consultations")}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}