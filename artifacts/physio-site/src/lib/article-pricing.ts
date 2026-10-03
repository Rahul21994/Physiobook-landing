import { pricing } from "@workspace/pricing";

const priceByMarker = {
  "{{price.homeVisit.introductory}}": pricing.homeVisit.amount,
  "{{price.homeVisit.regular}}": pricing.homeVisit.regularAmount,
  "{{price.telehealth.introductory}}": pricing.telehealth.amount,
  "{{price.telehealth.regular}}": pricing.telehealth.regularAmount,
} as const;

type ArticlePriceMarker = keyof typeof priceByMarker;

const articlePriceMarkerPattern = /\{\{price\.[^{}]*\}\}/g;

export function resolveArticlePricing(content: string, postSlug?: string): string {
  const resolved = content.replace(articlePriceMarkerPattern, (marker) => {
    if (!Object.prototype.hasOwnProperty.call(priceByMarker, marker)) {
      const location = postSlug ? ` in post "${postSlug}"` : "";
      throw new Error(`Unknown Journal pricing marker "${marker}"${location}.`);
    }

    return priceByMarker[marker as ArticlePriceMarker];
  });

  if (resolved.includes("{{price.")) {
    const location = postSlug ? ` in post "${postSlug}"` : "";
    throw new Error(`Unresolved or malformed Journal pricing marker${location}.`);
  }

  return resolved;
}