import generatedRoutes from "./hindi-city-routes.generated.json";

export type HindiCityTestimonial = {
  citySlug: string;
  author: string;
  service: string;
  label: string;
  quote: string;
};

export type HindiCityRoute = {
  slug: string;
  displayName: string;
  stateName: string;
  h1: string;
  title: string;
  description: string;
  conditions: string[];
  conditionLabels: string[];
  localFocus: string;
  careContext: string;
  primaryCondition: string;
  localityReferences: string[];
  localities: string[];
  relatedCitySlugs: string[];
  serviceThemes: Array<{ sourceTitle: string; title: string }>;
  journalCards: Array<{ slug: string; title: string; excerpt: string }>;
  specialJournalSection: null | {
    eyebrow: string;
    heading: string;
    introduction: string;
    slug: string;
    title: string;
    excerpt: string;
  };
  focusCopy: string;
  localityFaqs: string[];
  nearMeQuestion: string;
  faqs: Array<{ question: string; answer: string }>;
  confirmationWindow: string;
  reviewNames: string[];
  reviewMode: "city" | "provider-team";
  testimonials: HindiCityTestimonial[];
  revision: {
    template: string;
    route: string;
    journal: string;
    testimonials: string;
  };
};

export const hindiCityRoutes = generatedRoutes as HindiCityRoute[];
export const hindiCityRouteBySlug = new Map(
  hindiCityRoutes.map((route) => [route.slug, route]),
);

export function getHindiCityRoute(slug: string | undefined): HindiCityRoute | undefined {
  return slug ? hindiCityRouteBySlug.get(slug) : undefined;
}

function conditionList(values: string[]) {
  if (values.length < 2) return values[0] ?? "";
  return `${values.slice(0, -1).join(", ")} और ${values[values.length - 1]}`;
}

export function getHindiCityFaqs(
  city: HindiCityRoute,
): Array<{ question: string; answer: string }> {
  const references = city.localityReferences.slice(0, 3).join(", ");
  const replacements: Record<string, string> = {
    "[शहर]": city.displayName,
    "[primary condition]": city.primaryCondition,
    "[localFocus]": city.localFocus,
    "[careContext]": city.careContext,
    "[पहले तीन nearby locality references]": references,
    "[conditions की हिन्दी सूची]": conditionList(city.conditionLabels),
    "[confirmationWindowText]": city.confirmationWindow,
  };
  const generalFaqs = city.faqs.map(({ question, answer }) => {
    let filledQuestion = question;
    let filledAnswer = answer;
    for (const [placeholder, value] of Object.entries(replacements)) {
      filledQuestion = filledQuestion.replaceAll(placeholder, value);
      filledAnswer = filledAnswer.replaceAll(placeholder, value);
    }
    if (!city.localFocus) {
      filledAnswer = filledAnswer.replace("[localFocus]। ", "");
    }
    return { question: filledQuestion, answer: filledAnswer };
  });
  const localityFaqs = city.localityFaqs.slice(0, 4).map((locality) => ({
    question: `क्या ${city.displayName} के ${locality} के पास घर पर मुलाक़ात का अनुरोध कर सकता/सकती हूँ?`,
    answer: `${locality} इलाके की पहचान बताने के लिए एक संदर्भ है, पक्का सेवा-क्षेत्र नहीं। ${city.displayName} में घर पर मुलाक़ात उपलब्ध है; बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की पुष्टि होती है। अपना सही स्थान, मुख्य चिंता और पसंदीदा समय बताएँ।`,
  }));
  const nearMeFaq = city.nearMeQuestion
    ? [{
        question: city.nearMeQuestion,
        answer: "इस शहर में घर पर मुलाक़ात उपलब्ध है; बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।",
      }]
    : [];
  return [...generalFaqs, ...localityFaqs, ...nearMeFaq];
}

export function getHindiCityDisplayName(
  slug: string | undefined,
  fallback = "",
): string {
  return getHindiCityRoute(slug)?.displayName ?? fallback;
}

export function getHindiCityPath(slug: string): string {
  return `/hi/physiotherapist-at-home/${slug}`;
}