import type { StateData } from "./states";

export interface StateFaqEntry {
  q: string;
  a: string;
}

function titleFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getRenderedStateCopy(text: string, stateName: string): string {
  const normalized = text
    .replace(/expansion(?:-stage)?\s+(?:enquiry|context|pathway|rollout)/gi, "city-level home-visit pathway")
    .replace(/home-visit requests? (?:are|is) reviewed city by city/gi, "home visits are available at city level")
    .replace(/home visits? (?:are|is) reviewed city by city/gi, "home visits are available at city level")
    .replace(/(?:home-visit enquiries|home visits?) (?:are|is) reviewed city by city/gi, "home visits are available at city level")
    .replace(/reviewed city by city/gi, "reviewed by exact locality and clinician availability")
    .replace(/home visits? (?:are|is) confirmed by city/gi, "home visits are available at city level")
    .replace(/before booking/gi, "before booking");
  const confirmation =
    ` Home visits are available at city level across ${stateName}; exact locality and clinician availability are confirmed before booking.`;
  return /exact locality and clinician availability are confirmed before booking/i.test(normalized)
    ? normalized
    : `${normalized}${confirmation}`;
}

export function getStateFaqs(state: StateData): StateFaqEntry[] {
  const profile = state.profile;
  const cityNames = state.citySlugs.map(titleFromSlug);
  const cityList = cityNames.join(", ");
  const profileQuestion = profile?.faq.q ?? `What should I include in a ${state.name} physiotherapy enquiry?`;
  const primaryQuestion = profileQuestion.includes(state.name)
    ? profileQuestion
    : profileQuestion.replace(/\?$/, ` in ${state.name}?`);

  return [
    {
      q: primaryQuestion,
      a: getRenderedStateCopy(
        profile?.faq.a ?? `Share your city, locality, main concern, and preferred date. Online consultation is available across ${state.name}.`,
        state.name,
      ),
    },
    {
      q: `How do the ${state.name} city routes differ?`,
      a: getRenderedStateCopy(
        profile?.intro ?? `${state.name} enquiries can begin from ${cityList}. The city page provides the most specific route for the person's home setting.`,
        state.name,
      ),
    },
    {
      q: `What location details matter for a ${state.name} homecare enquiry?`,
      a: getRenderedStateCopy(
        profile?.coverageNote ?? `Choose the relevant city from ${cityList} and share the exact locality and preferred date so the team can review the appropriate home-visit route.`,
        state.name,
      ),
    },
    {
      q: `Which rehabilitation needs can I discuss in ${state.name}?`,
      a: getRenderedStateCopy(
        profile?.careFocus ?? `The ${state.name} city pages describe the rehabilitation pathways currently represented in ${cityList}. The suitable plan depends on an individual assessment.`,
        state.name,
      ),
    },
    {
      q: `How should I choose a ${state.name} booking route?`,
      a: getRenderedStateCopy(
        profile?.bookingNote ?? `Choose the city where the person lives, include the locality and recovery goal, and select online consultation or a city-specific home-visit enquiry as appropriate.`,
        state.name,
      ),
    },
    {
      q: `Can I request online physiotherapy from anywhere in ${state.name}?`,
      a: getRenderedStateCopy(
        `Online consultation is available across ${state.name}. For homecare, start with the city page for ${cityList} and share the locality so the team can confirm the appropriate next step.`,
        state.name,
      ),
    },
  ];
}