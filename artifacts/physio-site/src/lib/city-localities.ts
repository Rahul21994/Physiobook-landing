import { hasVerifiedHomecareCoverage, type CityData } from "@/lib/cities";
import { getExpansionProfile } from "@/lib/city-expansion";

export interface CityLocality {
  name: string;
  id: string;
  description: string;
}

function slugifyLocality(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getCityLocalities(
  city: CityData,
): CityLocality[] {
  const usedIds = new Map<string, number>();
  const expansionProfile = hasVerifiedHomecareCoverage(city)
    ? undefined
    : getExpansionProfile(city);

  const localities = city.localities?.length
    ? city.localities
    : city.nearby.map((name) => ({
        name,
        description:
          expansionProfile?.localityDescription(name) ??
          `Home physiotherapy availability for patients and families in ${name}.`,
      }));

  return localities.map(({ name, description }) => {
    const baseId = slugifyLocality(name) || "locality";
    const occurrence = (usedIds.get(baseId) ?? 0) + 1;
    usedIds.set(baseId, occurrence);

    return {
      name,
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      description,
    };
  });
}