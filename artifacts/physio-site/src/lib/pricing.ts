export { pricing } from "@workspace/pricing";

export const pricingNote =
  "The final fee is confirmed before the appointment and may vary with the session type, specialist, and rehabilitation plan.";

export function withBookingMode(href: string, mode: "home" | "telehealth") {
  const separator = href.includes("?") ? "&" : "?";
  return mode === "telehealth" ? `${href}${separator}mode=telehealth` : href;
}