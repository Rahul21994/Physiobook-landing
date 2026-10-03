export type PriceRange = {
  minInr: number;
  maxInr: number;
};

export type TelehealthAmount = {
  inr: number;
  usd: number;
};

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
}

export function formatUsd(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

export function formatInrRange(range: PriceRange): string {
  return `${formatInr(range.minInr)} – ${formatInr(range.maxInr)}`;
}

export function formatTelehealthPair(amount: TelehealthAmount): string {
  return `${formatInr(amount.inr)} / ${formatUsd(amount.usd)}`;
}

function createHomeVisitPricing<
  const T extends {
    priceKey: string;
    mode: "home";
    label: string;
    introductory: PriceRange;
    regular: PriceRange;
    description: string;
  },
>(definition: T) {
  return {
    ...definition,
    amount: formatInrRange(definition.introductory),
    regularAmount: formatInrRange(definition.regular),
  };
}

function createTelehealthPricing<
  const T extends {
    priceKey: string;
    mode: "telehealth";
    label: string;
    introductory: TelehealthAmount;
    regular: TelehealthAmount;
    description: string;
  },
>(definition: T) {
  return {
    ...definition,
    amount: formatInr(definition.introductory.inr),
    displayAmount: formatTelehealthPair(definition.introductory),
    amountInr: definition.introductory.inr,
    regularAmount: formatInr(definition.regular.inr),
    regularDisplayAmount: formatTelehealthPair(definition.regular),
  };
}

export const pricing = {
  homeVisit: createHomeVisitPricing({
    priceKey: "home_visit_v1",
    mode: "home",
    label: "Home visit",
    introductory: { minInr: 1125, maxInr: 1350 },
    regular: { minInr: 2500, maxInr: 3000 },
    description: "Introductory price per session",
  }),
  telehealth: createTelehealthPricing({
    priceKey: "telehealth_v1",
    mode: "telehealth",
    label: "Online consultation",
    introductory: { inr: 742, usd: 7.91 },
    regular: { inr: 1650, usd: 17.59 },
    description: "Introductory price per consultation",
  }),
} as const;