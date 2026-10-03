import { hasVerifiedHomecareCoverage, type CityData } from "@/lib/cities";
import { FAQList, type FAQEntry } from "@/components/FAQList";
import { getCityFaqs } from "@/lib/city-faqs";

interface LocalFAQProps {
  city: CityData;
}

export function getLocalFaqs(city: CityData): FAQEntry[] {
  return getCityFaqs(city) as FAQEntry[];
}

export function LocalFAQ({ city }: LocalFAQProps) {
  return (
    <section className="bg-accent/20 py-20 md:py-24" id="local-faq">
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold text-foreground md:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            {hasVerifiedHomecareCoverage(city)
              ? `About home physiotherapy in ${city.name}`
              : `Online physiotherapy and home-visit enquiries in ${city.name}`}
          </p>
        </div>
        <FAQList faqs={getLocalFaqs(city)} testIdPrefix="city-faq" />
      </div>
    </section>
  );
}