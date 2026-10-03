export type StateJournalPostSummary = {
  slug: string;
  title: string;
  citySlug: string;
  discipline: "physiotherapy" | "nutrition" | "exercise-physiology";
};

import { stateJournalIndex } from "./state-journal-index.generated";

export { stateJournalIndex };