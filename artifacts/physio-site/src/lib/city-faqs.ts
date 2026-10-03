import type { CityData } from "./cities";
import { getConfirmationWindowText, hasVerifiedHomecareCoverage, rehabilitationLabel } from "./cities";
import { getExpansionProfile } from "./city-expansion";

export interface CityFaqEntry {
  q: string;
  a: string;
  localityId?: string;
  localityName?: string;
}

function getCityLocalityFaqs(city: CityData): CityFaqEntry[] {
  const availability = hasVerifiedHomecareCoverage(city)
    ? `Home visits are active at city level in ${city.name}; exact locality and clinician availability are confirmed before booking.`
    : `Online consultation is available now from ${city.name}; a home visit depends on future team placement and exact-locality confirmation.`;

  return (city.localities ?? []).slice(0, 4).map((locality) => ({
    q: `Can I request a home visit near ${locality.name}, ${city.name}?`,
    a: `${locality.name} is a locality reference, not a confirmed service area. ${availability} Share the exact location, the person's main concern, and a preferred time.`,
    localityId: locality.name.toLowerCase().replace(/\s+/g, "-"),
    localityName: locality.name,
  }));
}

export function getCityFaqs(city: CityData): CityFaqEntry[] {
  const primaryCondition = rehabilitationLabel(city.conditions[0] ?? "movement and mobility").toLowerCase();
  const isExpansionCity = !hasVerifiedHomecareCoverage(city);

  if (isExpansionCity) {
    const expansionProfile = getExpansionProfile(city);
    const localityReferences = city.nearby.slice(0, 3).join(", ");
    return [
      {
        q: `Which physiotherapy option is available now from ${city.name}?`,
        a: `Online consultation is available now from ${city.name}. You can also send a home-visit enquiry; any in-person service depends on future team placement and confirmed local availability.`,
      },
      {
        q: `What should I include in a ${city.name} rehabilitation enquiry?`,
        a: `Share your exact ${city.name} locality, main concern, and preferred date. The team uses those details to assess demand for future placement. Online consultation is available while no local home-visit team is placed.`,
      },
      {
        q: `Can I choose an online consultation from ${city.name}?`,
        a: `Yes. Online consultation is available now from ${city.name}. You can choose Google Meet, Zoom, or WhatsApp video. A home visit is not confirmed until a team is placed and checks your exact locality.`,
      },
      {
        q: `Which ${city.name} locality names can I use in an enquiry?`,
        a: `${localityReferences} are locality references to help describe your area, not verified service zones. Share your exact address so the team can review whether future placement is possible.`,
      },
      {
        q: `Which rehabilitation needs can I discuss from ${city.name}?`,
        a: `You can ask about ${city.conditions.map((condition) => rehabilitationLabel(condition).toLowerCase()).join(", ")}. Online consultation is available now; home visits depend on team placement and clinician availability.`,
      },
      expansionProfile.faq,
      ...getCityLocalityFaqs(city),
    ];
  }

  const localFocus = city.localFocus
    ?? `A ${city.name} home programme can be shaped around ${primaryCondition} and the person's daily movement goals.`;
  const careContext = city.careContext
    ?? `The first ${city.name} visit should consider the person's home setting, current function, and the tasks they need to practise safely.`;
  const localityReferences = city.nearby.slice(0, 3).join(", ");
  const localCoverage =
    `${localityReferences} are locality references, not guaranteed service zones. Home visits are active at city level in ${city.name}; the team confirms exact locality and clinician availability before booking.`;
  const confirmationWindow = getConfirmationWindowText(city.slug);

  return [
    {
      q: `How can home physiotherapy in ${city.name} support ${primaryCondition}?`,
      a: `${localFocus} The programme is confirmed after an assessment and adapted to the person's goals rather than using the same routine for every patient. Exact locality and clinician availability are confirmed before booking.`,
    },
    {
      q: `How can a ${city.name} home session fit the person's daily routine?`,
      a: `${careContext} Exact locality and clinician availability are confirmed before booking.`,
    },
    {
      q: `What should I share before requesting a ${city.name} home visit?`,
      a: `Share the person's ${primaryCondition} concern, exact locality, home setting, and preferred timing. This helps the team review the right physiotherapy option and confirm the next step ${confirmationWindow}.`,
    },
    {
      q: `Which ${city.name} areas can I mention in a booking request?`,
      a: localCoverage,
    },
    {
      q: `Can I start with online physiotherapy from ${city.name}?`,
      a: `Yes. Online consultation is available from ${city.name} when a video assessment is a suitable first step. Home visits are active at city level, but the exact locality and clinician must be confirmed before booking.`,
    },
    {
      q: `Which rehabilitation goals can I discuss with a ${city.name} physiotherapist?`,
      a: `The ${city.name} pathway includes ${city.conditions.map((condition) => rehabilitationLabel(condition).toLowerCase()).join(", ")}. A clinician can help decide which goals and care setting are appropriate after understanding the person's history and current function.`,
    },
    ...getCityLocalityFaqs(city),
    ...(city.nearMeFaq
      ? [{
          q: city.nearMeFaq.q,
          a: `${localCoverage} Share your exact location and recovery goal so the team can confirm whether a home visit can be arranged.`,
        }]
      : []),
  ];
}