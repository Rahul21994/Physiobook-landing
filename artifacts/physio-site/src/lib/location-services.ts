import type { CityData } from "./cities";
import { getServiceGuideHrefForSlug } from "./service-guide-map";

export type LocationEvidence = "context" | "prevalence";

export interface LocationServiceSource {
  title: string;
  href: string;
}

export interface LocationServiceSourceReference extends LocationServiceSource {
  themeIds: string[];
  themeTitles: string[];
}

export interface LocationServiceTheme {
  id: string;
  title: string;
  href: string;
  description: string;
  evidence: LocationEvidence;
  source: LocationServiceSource;
}

type SourceCode = "p" | "g" | "d" | "o" | "r" | "h" | "n";
type ThemeRow = [string, string, string, SourceCode, string];

/*
 * The source matrix deliberately supports care context, not city prevalence.
 * Local condition lists remain authored in cities.ts; these sources explain
 * why an exercise, nutrition, breathing, or home-practice theme is useful.
 */
const sourceCatalog: Record<SourceCode, LocationServiceSource> = {
  p: {
    title: "WHO India Physical Activity Profile 2024",
    href: "https://cdn.who.int/media/docs/default-source/searo/pa-factsheet2024/pa-factsheet-_india2024.pdf?sfvrsn=7a7e793f_2",
  },
  g: {
    title: "WHO physical activity and sedentary behaviour guidelines",
    href: "https://www.who.int/publications/i/item/9789240014886",
  },
  d: {
    title: "ICMR-NIN Dietary Guidelines for Indians 2024",
    href: "https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
  },
  o: {
    title: "WHO India: Ageing and health",
    href: "https://www.who.int/india/health-topics/ageing",
  },
  r: {
    title: "India NCDC Health Advisory on Air Pollution",
    href: "https://ncdc.mohfw.gov.in/uploads/pdf/air4.pdf",
  },
  h: {
    title: "India NCDC Public Health Advisory: Extreme Heat/Heatwave",
    href: "https://ncdc.mohfw.gov.in/uploads/pdf/5.%20Public%20Health%20Advisory_Extreme%20HeatHeatwave.pdf",
  },
  n: {
    title: "PubMed: Stroke Rehabilitation",
    href: "https://pubmed.ncbi.nlm.nih.gov/28157752/",
  },
};

const themeRows: ThemeRow[] = [
  ["nr", "Neurological Rehabilitation", "stroke-rehabilitation", "n", "Movement, balance, walking, fatigue, and daily tasks after neurological illness."],
  ["ps", "Post-Surgery Mobility", "post-surgery-rehabilitation", "g", "A staged route from discharge to transfers, walking, stairs, and independence."],
  ["cp", "Cardiopulmonary Endurance", "cardiopulmonary-rehabilitation", "r", "Paced breathing, symptom monitoring, and graded endurance after cardiac or respiratory limitation."],
  ["fn", "Functional Reconditioning", "functional-training", "g", "Task-focused strength, balance, walking, and conditioning for everyday independence."],
  ["cx", "Complex Recovery After Hospitalisation", "advanced-complex-case-recovery", "g", "Coordinated rehabilitation for weakness, fatigue, breathing, mobility, and caregiver needs."],
  ["ca", "Clinical Assessment and Goal Setting", "clinical-assessment-evaluation", "g", "A structured starting point for movement, strength, balance, gait, breathing, and daily goals."],
  ["sp", "Sports and Exercise Performance", "sports-enhancement-consultation", "p", "Sport-specific movement, strength, conditioning, recovery, and nutrition planning."],
  ["nu", "Nutrition for Recovery and Training", "nutritional-consultation", "d", "Practical guidance on energy, protein, hydration, appetite, and familiar foods."],
  ["ag", "Older-Adult Mobility and Independence", "functional-training", "o", "Strength, balance, walking, falls-risk awareness, and daily-task practice at home."],
  ["ht", "Heat-Aware Exercise Planning", "functional-training", "h", "Pacing, timing, hydration, rest, and symptom monitoring during hot conditions."],
  ["aq", "Breathing and Activity Pacing", "cardiopulmonary-rehabilitation", "r", "A practical route for breathlessness, reduced tolerance, and activity around respiratory triggers."],
  ["cg", "Caregiver-Guided Home Practice", "homecare-physiotherapy", "g", "Transfer, positioning, walking, safety, and exercise practice between visits."],
  ["pk", "Parkinson’s Mobility Support", "functional-training", "o", "Cueing, turning, balance, walking, transfers, and confidence-building practice."],
  ["sn", "Spinal and Neurological Recovery", "advanced-complex-case-recovery", "n", "Coordinated support for spinal, neurological, strength, sensation, and transfer goals."],
  ["cd", "Cardiac Conditioning and Recovery", "cardiopulmonary-rehabilitation", "p", "Medically guided activity progression, endurance, pacing, and symptom awareness."],
  ["jr", "Joint-Replacement Recovery", "post-surgery-rehabilitation", "g", "Range, strength, walking, stairs, and confidence work after joint replacement."],
  ["wm", "Work, Commute, and Mobility Planning", "back-pain-physiotherapy", "g", "Graded movement planning for sitting, lifting, commuting, work tasks, and return to activity."],
];

const conditionThemeIds: Record<string, string> = {
  "stroke rehabilitation": "nr",
  "neurological physiotherapy": "nr",
  "neurological rehabilitation": "nr",
  "post-surgery rehabilitation": "ps",
  "knee replacement rehabilitation": "jr",
  "hip replacement rehabilitation": "jr",
  "joint replacement rehabilitation": "jr",
  "copd & pulmonary rehabilitation": "cp",
  "cardiac rehabilitation": "cd",
  "cardiopulmonary rehabilitation": "cp",
  "orthopaedic rehabilitation": "fn",
  "geriatric physiotherapy": "ag",
  "geriatric rehabilitation": "ag",
  "parkinson's physiotherapy": "pk",
  "sports injury physiotherapy": "sp",
  "back pain physiotherapy": "wm",
  "spinal physiotherapy": "sn",
  "spinal cord injury rehabilitation": "sn",
  "guillain-barré rehabilitation": "cx",
  "post-icu rehabilitation": "cx",
};

const cityContextThemeIds: Record<string, string[]> = {
  jaipur: ["ht", "nu"], delhi: ["aq", "cg"], noida: ["wm", "nu"], gurgaon: ["sp", "wm"],
  faridabad: ["cg", "cx"], tigaon: ["cg", "ag"], chandigarh: ["pk", "aq"], amritsar: ["ag", "nu"],
  ludhiana: ["sn", "wm"], bengaluru: ["sp", "wm"], mumbai: ["cx", "cg"], pune: ["sp", "nu"],
  hyderabad: ["cx", "nu"], kochi: ["aq", "ag"], thiruvananthapuram: ["pk", "aq"],
  kozhikode: ["cg", "nu"], visakhapatnam: ["aq", "wm"], nagpur: ["ht", "ag"],
  guwahati: ["cg", "ag"], kolkata: ["aq", "cx"], chennai: ["ht", "aq"], coimbatore: ["sp", "ht"],
  madurai: ["ht", "nu"], mysuru: ["pk", "ag"], mangaluru: ["aq", "nu"], ahmedabad: ["ht", "cd"],
  surat: ["ht", "wm"], vadodara: ["ag", "nu"], lucknow: ["cg", "nu"], moradabad: ["cg", "cx"],
  kanpur: ["aq", "ag"], varanasi: ["ag", "cg"], agra: ["ag", "wm"], prayagraj: ["ht", "cg"],
  jodhpur: ["ht", "cg"], udaipur: ["ag", "ht"], ajmer: ["ag", "nu"], bhopal: ["aq", "ht"],
  indore: ["cd", "ag"], patna: ["cg", "aq"], ranchi: ["nu", "fn"], bhubaneswar: ["aq", "nu"],
  dehradun: ["ag", "aq"], haridwar: ["ag", "ht"], jammu: ["cg", "fn"],
};

const themeCatalog = new Map(
  themeRows.map(([id, title, slug, sourceCode, description]) => [
    id,
    {
      id,
      title,
      href: getServiceGuideHrefForSlug(slug),
      description,
      evidence: "context" as const,
      source: sourceCatalog[sourceCode],
    },
  ]),
);

export function getLocationServiceSources(): LocationServiceSourceReference[] {
  const sources = new Map<string, LocationServiceSourceReference>();

  for (const theme of themeCatalog.values()) {
    const existing = sources.get(theme.source.href);
    if (existing) {
      existing.themeIds.push(theme.id);
      existing.themeTitles.push(theme.title);
      continue;
    }

    sources.set(theme.source.href, {
      ...theme.source,
      themeIds: [theme.id],
      themeTitles: [theme.title],
    });
  }

  return [...sources.values()];
}

function unique<T>(values: T[]): T[] {
  return [...new Set(values)];
}

function getTheme(id: string): LocationServiceTheme {
  const theme = themeCatalog.get(id);
  if (!theme) throw new Error(`Unknown location service theme "${id}"`);
  return theme;
}

export function getCityServiceThemes(city: Pick<CityData, "slug" | "conditions">): LocationServiceTheme[] {
  const contextIds = cityContextThemeIds[city.slug] ?? ["ca", "fn"];
  const conditionIds = city.conditions
    .map((condition) => conditionThemeIds[condition.toLowerCase()])
    .filter((id): id is string => Boolean(id));
  return unique([...contextIds, ...conditionIds]).slice(0, 6).map(getTheme);
}

export function getStateServiceThemes(
  stateName: string,
  cities: readonly Pick<CityData, "name" | "slug" | "conditions">[],
): LocationServiceTheme[] {
  const themeCities = new Map<string, string[]>();
  for (const city of cities) {
    for (const theme of getCityServiceThemes(city)) {
      themeCities.set(theme.id, [...(themeCities.get(theme.id) ?? []), city.name]);
    }
  }

  return [...themeCities.entries()]
    .sort(([a, aCities], [b, bCities]) => bCities.length - aCities.length || a.localeCompare(b))
    .slice(0, 6)
    .map(([id, cityNames]) => {
      const theme = getTheme(id);
      const cityLabel = cityNames.length === 1
        ? cityNames[0]
        : `${cityNames.slice(0, -1).join(", ")} and ${cityNames.at(-1)}`;
      return {
        ...theme,
        description: `${theme.description} In ${stateName}, the directory connects this theme to ${cityLabel}.`,
      };
    });
}