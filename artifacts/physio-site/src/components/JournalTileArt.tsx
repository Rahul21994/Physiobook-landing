import {
  Activity, Apple, Brain, HeartPulse, PersonStanding,
  ShieldPlus, Stethoscope, Waves, Wind, type LucideIcon,
} from "lucide-react";
import { getJournalCardImagePath, getJournalImagePath } from "../lib/journal-images";
import "../journal-art.css";

export {
  getJournalCardImagePath,
  getJournalImagePath,
  getJournalWebpImagePath,
} from "../lib/journal-images";

type ArtTheme = {
  backgroundClass: string;
  icon: LucideIcon;
  label: string;
  image: string;
};

const themes: Record<string, ArtTheme> = {
  neuro: { backgroundClass: "journal-tile-art--neuro", icon: Brain, label: "Neuro recovery", image: "/images/journal/journal_neuro.jpg" },
  ortho: { backgroundClass: "journal-tile-art--ortho", icon: PersonStanding, label: "Movement care", image: "/images/journal/journal_ortho.jpg" },
  cardio: { backgroundClass: "journal-tile-art--cardio", icon: HeartPulse, label: "Heart & lungs", image: "/images/journal/journal_cardio.jpg" },
  pulmonary: { backgroundClass: "journal-tile-art--pulmonary", icon: Wind, label: "Breathing care", image: "/images/journal/journal_cardio.jpg" },
  occupation: { backgroundClass: "journal-tile-art--occupation", icon: Activity, label: "Daily function", image: "/images/journal/journal_functional.jpg" },
  home: { backgroundClass: "journal-tile-art--home", icon: ShieldPlus, label: "Home guidance", image: "/images/journal/journal_homecare.jpg" },
  city: { backgroundClass: "journal-tile-art--city", icon: Waves, label: "Care nearby", image: "/images/journal/journal_homecare.jpg" },
  general: { backgroundClass: "journal-tile-art--general", icon: Stethoscope, label: "Clinical guide", image: "/images/journal/journal_assessment.jpg" },
  nutrition: { backgroundClass: "journal-tile-art--nutrition", icon: Apple, label: "Nutrition & recovery", image: "/images/journal/journal_nutrition-skin.jpg" },
};

function getTheme(slug: string, category: string): ArtTheme {
  if (/skin-inflammation|vasculitis|nutrition/i.test(slug) || /Nutrition/i.test(category)) return themes.nutrition;
  if (/stroke|parkinson|brain|guillain|neuro/i.test(slug)) return themes.neuro;
  if (/knee|hip|rotator|ankle|plantar|fracture|back|sciatica|neck|shoulder|tfcc|wrist|hand|grip|forearm/i.test(slug)) return themes.ortho;
  if (/copd|cardiopulmonary|breathing/i.test(slug) || /Cardiopulmonary|Pulmonary/i.test(category)) return themes.cardio;
  if (/occupational/i.test(slug) || /Occupational/i.test(category)) return themes.occupation;
  if (/city|home/i.test(slug) || /Homecare|City/i.test(category)) return themes.home;
  if (/sports|walking|assessment/i.test(slug)) return themes.general;
  return themes.general;
}

export function JournalTileArt({
  slug,
  category,
  image,
  compact = false,
  priority = false,
}: {
  slug: string;
  category: string;
  image?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  const theme = { ...getTheme(slug, category), image: getJournalImagePath(slug, image) };
  const Icon = theme.icon;
  const webpImage = getJournalCardImagePath(slug, image);
  return (
    <div
      className={`journal-tile-art ${theme.backgroundClass} relative w-full overflow-hidden ${compact ? "h-full min-h-[170px]" : "h-48"}`}
    >
      <picture>
        <source type="image/webp" srcSet={webpImage} />
        <source type="image/jpeg" srcSet={theme.image} />
        <img src={webpImage} alt={`Representative ${theme.label.toLowerCase()} treatment scene`} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" width="480" height="480" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 motion-safe:group-hover:scale-105" />
      </picture>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/20" />
      <div className="absolute left-7 top-7 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] font-semibold text-white">
        <span className="w-2 h-2 rounded-full bg-white" />
        {theme.label}
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 motion-reduce:hidden transition-opacity">
        <Icon className="w-12 h-12 text-white" strokeWidth={1.4} />
      </div>
      <div className="absolute right-7 bottom-6 text-xs font-medium text-white/90">Representative image</div>
    </div>
  );
}