import { cities, CityData, AdministrativeType, rehabilitationLabel } from "./cities";
import { stateProfiles, StateProfile } from "./state-profiles";

export interface StateData {
  slug: string;
  name: string;
  administrativeType?: AdministrativeType;
  citySlugs: string[];
  indexable?: boolean;
  profile?: StateProfile;
}

export const states: StateData[] = [
  { slug: "rajasthan",      name: "Rajasthan",           citySlugs: ["jaipur", "jodhpur", "udaipur", "ajmer"], indexable: true, profile: stateProfiles.rajasthan },
  { slug: "uttar-pradesh",  name: "Uttar Pradesh",       citySlugs: ["noida", "lucknow", "moradabad", "kanpur", "varanasi", "agra", "prayagraj"], indexable: true, profile: stateProfiles["uttar-pradesh"] },
  { slug: "delhi",          name: "Delhi",               administrativeType: "nct", citySlugs: ["delhi"], indexable: true, profile: stateProfiles.delhi },
  { slug: "haryana",        name: "Haryana",             citySlugs: ["gurgaon", "faridabad", "tigaon"], indexable: true, profile: stateProfiles.haryana },
  { slug: "chandigarh",     name: "Chandigarh",          administrativeType: "union-territory", citySlugs: ["chandigarh"], indexable: true, profile: stateProfiles.chandigarh },
  { slug: "punjab",         name: "Punjab",              citySlugs: ["amritsar", "ludhiana"], indexable: true, profile: stateProfiles.punjab },
  { slug: "maharashtra",    name: "Maharashtra",         citySlugs: ["mumbai", "pune", "nagpur"], indexable: true, profile: stateProfiles.maharashtra },
  { slug: "karnataka",      name: "Karnataka",           citySlugs: ["bengaluru", "mysuru", "mangaluru"], indexable: true, profile: stateProfiles.karnataka },
  { slug: "tamil-nadu",     name: "Tamil Nadu",          citySlugs: ["chennai", "coimbatore", "madurai"], indexable: true, profile: stateProfiles["tamil-nadu"] },
  { slug: "kerala",         name: "Kerala",              citySlugs: ["kochi", "thiruvananthapuram", "kozhikode"], indexable: true, profile: stateProfiles.kerala },
  { slug: "gujarat",        name: "Gujarat",             citySlugs: ["ahmedabad", "surat", "vadodara"], indexable: true, profile: stateProfiles.gujarat },
  { slug: "madhya-pradesh", name: "Madhya Pradesh",      citySlugs: ["bhopal", "indore"], indexable: true, profile: stateProfiles["madhya-pradesh"] },
  { slug: "telangana",      name: "Telangana",           citySlugs: ["hyderabad"], indexable: true, profile: stateProfiles.telangana },
  { slug: "andhra-pradesh", name: "Andhra Pradesh",      citySlugs: ["visakhapatnam"], indexable: true, profile: stateProfiles["andhra-pradesh"] },
  { slug: "west-bengal",    name: "West Bengal",         citySlugs: ["kolkata"], indexable: true, profile: stateProfiles["west-bengal"] },
  { slug: "odisha",         name: "Odisha",              citySlugs: ["bhubaneswar"], indexable: true, profile: stateProfiles.odisha },
  { slug: "jharkhand",      name: "Jharkhand",            citySlugs: ["ranchi"], indexable: true, profile: stateProfiles.jharkhand },
  { slug: "bihar",          name: "Bihar",               citySlugs: ["patna"], indexable: true, profile: stateProfiles.bihar },
  { slug: "assam",          name: "Assam",               citySlugs: ["guwahati"], indexable: true, profile: stateProfiles.assam },
  { slug: "uttarakhand",    name: "Uttarakhand",          citySlugs: ["dehradun", "haridwar"], indexable: true, profile: stateProfiles.uttarakhand },
  { slug: "jammu-kashmir",  name: "Jammu & Kashmir",      administrativeType: "union-territory", citySlugs: ["jammu"], indexable: true, profile: stateProfiles["jammu-kashmir"] },
];

export function getStateDisplayName(state: Pick<StateData, "name" | "administrativeType">): string {
  if (state.administrativeType === "union-territory") return `${state.name} (Union Territory)`;
  if (state.administrativeType === "nct") return `${state.name} (National Capital Territory)`;
  return state.name;
}

export function getStateBySlug(slug: string): StateData | undefined {
  return states.find((s) => s.slug === slug);
}

export function getCitiesForState(state: StateData): CityData[] {
  return state.citySlugs
    .map((slug) => cities.find((c) => c.slug === slug))
    .filter(Boolean) as CityData[];
}

export function getStatePageServiceThemes(
  citiesInState: readonly Pick<CityData, "name" | "conditions">[],
) {
  const cityLabel = citiesInState.length === 1
    ? citiesInState[0].name
    : `${citiesInState.slice(0, -1).map((city) => city.name).join(", ")} and ${citiesInState.at(-1)?.name}`;
  const uniqueConditions = [...new Set(citiesInState.flatMap((city) => city.conditions))].slice(0, 6);
  return uniqueConditions.map((condition) => {
    const title = rehabilitationLabel(condition);
    const value = title.toLowerCase();
    const href = /cardiac|cardiopulmonary|copd|pulmonary/.test(value)
      ? "/services/cardiopulmonary-rehabilitation"
      : /stroke|neurological|parkinson|guillain|spinal|brain/.test(value)
        ? "/stroke-rehab"
        : /surgery|replacement/.test(value)
          ? "/post-surgery-rehab"
          : /sports/.test(value)
            ? "/sports-injury-rehabilitation"
            : "/services/functional-training";
    return {
      title,
      href,
      description: `${title} across ${cityLabel}; assess.`,
    };
  });
}

export function isStateIndexable(state: StateData): boolean {
  const profile = state.profile;
  return Boolean(
    state.indexable === true &&
    state.citySlugs.length > 0 &&
    profile?.intro.trim() &&
    profile.coverageNote.trim() &&
    profile.careFocus.trim() &&
    profile.bookingNote.trim() &&
    profile.faq.q.trim() &&
    profile.faq.a.trim() &&
    profile.localResources.length >= 2
  );
}

export function getStateSeoDescription(state: StateData): string {
  const source = state.profile?.careFocus
    ?? `Online physiotherapy consultations are available across ${state.name}.`;
  const authoredSentence = source.split(/(?<=[.!?])\s+/u)[0].trim();
  const prefix = `${state.name}: `;
  const sentence = `${prefix}${authoredSentence}`;
  if (Array.from(sentence).length >= 150 && Array.from(sentence).length <= 155) {
    return sentence;
  }
  if (Array.from(sentence).length < 150) {
    const additions = [
      `${sentence} Local pathways guide care.`,
      `${sentence} Share your goals for care.`,
      `${sentence} Choose the right local pathway.`,
      `${sentence} Local pathways guide the next step here.`,
    ];
    const valid = additions.find((value) => {
      const length = Array.from(value).length;
      return length >= 150 && length <= 155;
    });
    if (valid) return valid;
  }

  const words = authoredSentence.split(/\s+/u);
  const endings = [
    "Local pathways guide the next step.",
    "Local pathways guide the next step here.",
    "City pathways explain the next step.",
    "Share your goals for a local pathway.",
    "Choose a city pathway for next steps.",
    "Local pathways guide care.",
    "Share goals for care.",
    "Choose local care.",
    "Local pathways explain the next step for care.",
    "Choose a local pathway and share your goals.",
    "Local pathways explain the next step for your care.",
  ];
  for (let wordCount = words.length; wordCount >= 1; wordCount -= 1) {
    const shortened = `${prefix}${words.slice(0, wordCount).join(" ")}`;
    for (const ending of endings) {
      const completed = `${shortened.replace(/[.!?]+$/u, "")}. ${ending}`;
      const length = Array.from(completed).length;
      if (length >= 150 && length <= 155) return completed;
    }
  }

  throw new Error(`State SEO description could not reach 150–155 characters: ${state.slug}`);
}
