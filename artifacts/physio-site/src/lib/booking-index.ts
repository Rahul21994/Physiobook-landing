import { cities } from "./cities";
import { getCityLocalities } from "./city-localities";

export type BookingMode = "home" | "telehealth";

export interface BookingPageCopy {
  title: string;
  description: string;
  heading: string;
  introduction: string;
}

export interface BookingIndexVariant extends BookingPageCopy {
  query: string;
  path: string;
  outDir: string;
  mode: BookingMode;
  citySlug?: string;
  cityName?: string;
  localityId?: string;
  localityName?: string;
}

export interface BookingIndexContext {
  query: string;
  mode: BookingMode;
  citySlug?: string;
  cityName?: string;
  localityId?: string;
  localityName?: string;
}

const BOOKING_QUERY_KEYS = new Set(["city", "locality", "mode"]);
const TRACKING_QUERY_KEYS = new Set([
  "gclid",
  "fbclid",
  "msclkid",
  "wbraid",
  "gbraid",
  "ref",
  "source",
]);

export function getBookingIndexContextFromSearch(search: string): BookingIndexContext | undefined {
  const params = new URLSearchParams(search);
  const selected = new Map<string, string>();

  for (const [key, value] of params) {
    const normalizedKey = key.toLowerCase();
    if (!BOOKING_QUERY_KEYS.has(normalizedKey)) {
      if (normalizedKey.startsWith("utm_") || TRACKING_QUERY_KEYS.has(normalizedKey)) continue;
      return undefined;
    }
    if (selected.has(normalizedKey)) return undefined;
    selected.set(normalizedKey, value);
  }

  if (selected.size === 0) return undefined;

  const rawCity = selected.get("city")?.trim().toLowerCase();
  const rawLocality = selected.get("locality")?.trim().toLowerCase();
  const rawMode = selected.get("mode")?.trim().toLowerCase();
  if (
    (selected.has("city") && !rawCity) ||
    (selected.has("locality") && !rawLocality) ||
    (selected.has("mode") && !rawMode) ||
    (rawMode && rawMode !== "telehealth")
  ) {
    return undefined;
  }

  const city = rawCity
    ? cities.find((candidate) => candidate.slug === rawCity)
    : undefined;
  if (rawCity && !city) return undefined;

  const locality = rawLocality && city
    ? getCityLocalities(city).find((candidate) => candidate.id === rawLocality)
    : undefined;
  if (rawLocality && !locality) return undefined;
  if (locality && rawMode) return undefined;
  if (!city && (locality || rawMode !== "telehealth")) return undefined;

  const normalized = new URLSearchParams();
  if (city) normalized.set("city", city.slug);
  if (locality) normalized.set("locality", locality.id);
  if (rawMode) normalized.set("mode", "telehealth");

  return {
    query: normalized.toString(),
    mode: rawMode === "telehealth" ? "telehealth" : "home",
    citySlug: city?.slug,
    cityName: city?.name,
    localityId: locality?.id,
    localityName: locality?.name,
  };
}

export function getBookingPageCopy({
  cityName,
  localityName,
  mode,
}: {
  cityName?: string;
  localityName?: string;
  mode: BookingMode;
}): BookingPageCopy {
  const place = [localityName, cityName].filter(Boolean).join(", ");
  const titleBrand = " | Goswami Rehab";
  const titlePrefix = mode === "telehealth" ? "Online Physio in " : "Home Physio in ";
  const titleCandidates = [place, cityName]
    .filter((candidate): candidate is string => Boolean(candidate))
    .map((titlePlace) => `${titlePrefix}${titlePlace}${titleBrand}`);
  const title = titleCandidates.find((candidate) => Array.from(candidate).length <= 60) ??
    (mode === "telehealth"
      ? `Online Physio Consultation${titleBrand}`
      : `Home Physiotherapy Booking${titleBrand}`);

  // Name both the locality and city so repeated locality names in different
  // cities do not produce duplicate descriptions.
  const descriptionPlace =
    [localityName, cityName].filter(Boolean).join(", ") || undefined;
  const description = selectDescription(
    mode === "telehealth"
      ? [
          `Online physiotherapy for ${descriptionPlace ?? "your location"}: share your goals and preferred date. Worldwide video consultations provide assessment and exercise guidance from a physiotherapist.`,
          `Request an online physiotherapy assessment from ${descriptionPlace ?? "your location"}; share your goals and preferred date. Worldwide consultations include exercise guidance from a physiotherapist.`,
          `Online physiotherapy from ${descriptionPlace ?? "your location"} supports assessment and exercise planning. Share your goals and preferred date for clinician-led video guidance worldwide.`,
          `Online physiotherapy for ${descriptionPlace ?? "your location"}: share goals and date. Worldwide video assessment and exercise guidance are available.`,
          `Online physiotherapy from ${descriptionPlace ?? "your location"} supports assessment and exercise planning. Share your goals and preferred date for video guidance worldwide.`,
          `Online physiotherapy from ${descriptionPlace ?? "your location"} supports assessment and exercise planning. Share your goals and preferred date for video care guidance worldwide.`,
          `Online physiotherapy from ${descriptionPlace ?? "your location"} supports assessment and exercise planning. Share your goals and preferred date for video-based care guidance worldwide.`,
        ]
      : [
          `Home physiotherapy for ${descriptionPlace ?? "your location"}: share your care needs and preferred date. We confirm the locality and clinician before arranging a visit; online consultations are worldwide.`,
          `Request home physiotherapy for ${descriptionPlace ?? "your location"}; share your needs and preferred date. Our team confirms the exact locality and clinician before a visit, with online care worldwide.`,
          `Home physiotherapy requests for ${descriptionPlace ?? "your location"} are reviewed with your care needs and preferred date. We confirm the locality and clinician; online consultations remain worldwide.`,
          `Home physiotherapy for ${descriptionPlace ?? "your location"}: share needs and date. We confirm the locality and clinician before arranging a visit; online care is worldwide.`,
          `Home physiotherapy for ${descriptionPlace ?? "your location"}: share your needs and date. We confirm the locality and clinician before arranging a visit; online care is worldwide.`,
          `Home physiotherapy for ${descriptionPlace ?? "your location"}: share your care needs and date. We confirm the locality and clinician before arranging a visit; online care is worldwide.`,
          `Home physiotherapy for ${descriptionPlace ?? "your location"}: share your recovery needs and date. We confirm the locality and clinician before arranging a visit; online care is worldwide.`,
          `Home physiotherapy for ${descriptionPlace ?? "your location"}: share your needs and date. We confirm locality and clinician before arranging care; online care is global.`,
           `Home visit physiotherapy in ${descriptionPlace ?? "your location"}: share care needs and date. We confirm locality and clinician; online consultations are worldwide.`,
           `Home physiotherapy for ${descriptionPlace ?? "your location"}: share your needs and date. We confirm locality and clinician; online consultations are worldwide.`,
           `Home visit physiotherapy in ${descriptionPlace ?? "your location"}: share care needs and date. We confirm locality and clinician; online care is worldwide.`,
        ],
  );

  const heading = mode === "telehealth"
    ? place
      ? `Request Online Physiotherapy from ${place}`
      : "Book an Online Physiotherapy Consultation"
    : place
      ? `Request Home Physiotherapy in ${place}`
      : "Book a Physiotherapist at Home";

  const introduction = mode === "telehealth"
    ? place
      ? `Request an online physiotherapy consultation from ${place}. Online consultations are available everywhere; share your goals and preferred date for an assessment and rehabilitation plan.`
      : "Expert online physiotherapy is available everywhere. Request an assessment, personalised exercise guidance, and rehabilitation planning by video consultation."
    : place
      ? `Request a home physiotherapy visit for ${place}. Our team reviews every inquiry and confirms local clinician availability before arranging a visit. Online consultations are available everywhere.`
      : "Share your city, locality, care needs, and preferred date. Our team reviews each home-visit request and confirms local clinician availability before arranging a visit. Online consultations are available everywhere.";

  return { title, description, heading, introduction };
}

function selectDescription(candidates: string[]): string {
  const valid = candidates.find((candidate) => {
    const length = Array.from(candidate).length;
    return length >= 150 && length <= 155 && /[.!?]$/.test(candidate);
  });
  if (!valid) {
    throw new Error(
      `Booking description must be 150–155 characters: ${candidates.join(" | ")}`,
    );
  }
  return valid;
}

export function getBookingVariantCatalog(): BookingIndexVariant[] {
  const variants: BookingIndexVariant[] = [];
  const seenQueries = new Set<string>();

  const addVariant = (
    mode: BookingMode,
    city?: (typeof cities)[number],
    locality?: ReturnType<typeof getCityLocalities>[number],
  ) => {
    const params = new URLSearchParams();
    if (city) params.set("city", city.slug);
    if (locality) params.set("locality", locality.id);
    if (mode === "telehealth") params.set("mode", "telehealth");

    const query = params.toString();
    if (!query || seenQueries.has(query)) {
      throw new Error(`Duplicate or empty booking variant query: "${query}"`);
    }
    seenQueries.add(query);

    const id = [
      city?.slug,
      locality?.id,
      mode,
    ].filter(Boolean).join("-");
    const copy = getBookingPageCopy({
      cityName: city?.name,
      localityName: locality?.name,
      mode,
    });

    variants.push({
      query,
      path: `/booking?${query}`,
      outDir: `.booking-variants/${id}`,
      mode,
      citySlug: city?.slug,
      cityName: city?.name,
      localityId: locality?.id,
      localityName: locality?.name,
      ...copy,
    });
  };

  addVariant("telehealth");
  for (const city of cities) {
    addVariant("home", city);
    addVariant("telehealth", city);
    for (const locality of getCityLocalities(city)) {
      addVariant("home", city, locality);
    }
  }

  return variants;
}