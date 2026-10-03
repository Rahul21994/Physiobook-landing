import assert from "node:assert/strict";
import { test } from "node:test";
import { pricing } from "@workspace/pricing";
import { homeFaqs } from "./home-faqs";

test("homepage current-pricing FAQ uses shared formatted prices", () => {
  const pricingFaq = homeFaqs.find(
    ({ q }) => q === "Why are introductory prices currently available?",
  );

  assert.ok(pricingFaq, "the current-pricing FAQ should be present");
  assert.ok(pricingFaq.a.includes(pricing.homeVisit.amount));
  assert.ok(pricingFaq.a.includes(pricing.homeVisit.regularAmount));
  assert.ok(pricingFaq.a.includes(pricing.telehealth.amount));
  assert.ok(pricingFaq.a.includes(pricing.telehealth.regularAmount));
  assert.doesNotMatch(pricingFaq.a, /\{\{[^}]*\}\}/u);
});