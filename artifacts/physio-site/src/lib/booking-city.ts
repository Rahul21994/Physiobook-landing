import { cities, getCityBySlug } from "./cities";
import { getCityLocalities } from "./city-localities";

export function getBookingCitySlugFromLabel(label: string): string | undefined {
  const normalizedLabel = label.trim().toLowerCase();
  if (!normalizedLabel) return undefined;

  return (
    getCityBySlug(normalizedLabel)?.slug ??
    cities.find((city) => city.name.trim().toLowerCase() === normalizedLabel)?.slug
  );
}

/**
 * Resolve the optional booking city query parameter to a known city slug.
 * Invalid, blank, and unknown values intentionally return undefined so a
 * generic booking link never gets an accidental city selection.
 */
export function getBookingCityFromSearch(search: string): string | undefined {
  const citySlug = new URLSearchParams(search).get("city")?.trim().toLowerCase();
  return citySlug && getCityBySlug(citySlug) ? citySlug : undefined;
}

/**
 * Resolve a locality query parameter only when it belongs to the selected
 * known city. Locality IDs keep the booking links readable and stable while
 * preventing arbitrary query text from being presented as a service area.
 */
export function getBookingLocalityFromSearch(
  search: string,
  citySlug: string | undefined,
): string | undefined {
  if (!citySlug) return undefined;

  const city = getCityBySlug(citySlug);
  const localityId = new URLSearchParams(search).get("locality")?.trim().toLowerCase();
  if (!city || !localityId) return undefined;

  return getCityLocalities(city).find((locality) => locality.id === localityId)?.name;
}

export function getBookingLocalityFromContext(
  citySlug: string | undefined,
  localityId: string | undefined,
): string | undefined {
  if (!citySlug || !localityId) return undefined;

  const city = getCityBySlug(citySlug);
  if (!city) return undefined;

  return getCityLocalities(city).find((locality) => locality.id === localityId)?.name;
}

export function getBookingModeFromSearch(search: string): "home" | "telehealth" {
  return new URLSearchParams(search).get("mode")?.trim().toLowerCase() === "telehealth"
    ? "telehealth"
    : "home";
}