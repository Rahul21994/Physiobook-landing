import { pricing } from "@workspace/pricing";
import sourceHomeFaqs from "./home-faqs.json";

const priceTokens: Record<string, string> = {
  homeVisitAmount: pricing.homeVisit.amount,
  homeVisitRegularAmount: pricing.homeVisit.regularAmount,
  telehealthAmount: pricing.telehealth.amount,
  telehealthRegularAmount: pricing.telehealth.regularAmount,
};

function renderFaqAnswer(answer: string): string {
  const rendered = answer.replace(/\{\{([A-Za-z]+)\}\}/gu, (_token, key: string) => {
    const value = priceTokens[key];
    if (!value) {
      throw new Error(`Unknown homepage FAQ pricing token: ${key}`);
    }
    return value;
  });

  if (rendered.includes("{{")) {
    throw new Error("Homepage FAQ contains an unresolved pricing token.");
  }

  return rendered;
}

export const homeFaqs = sourceHomeFaqs.map(({ q, a }) => ({
  q,
  a: renderFaqAnswer(a),
}));