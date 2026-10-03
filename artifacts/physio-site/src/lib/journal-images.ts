const existingArticleImages: Record<string, string> = {
  "ankle-sprain-rehabilitation-guide": "journal_ankle-sprain_unique.jpg",
  "first-physiotherapy-assessment-guide": "journal_first-assessment_unique.jpg",
  "neurological-physiotherapy-brain-injury": "journal_brain-injury_unique.jpg",
  "breathing-work-endurance-metalworkers-moradabad": "journal_cardio.jpg",
  "cardiopulmonary-rehab-at-home": "journal_cardiopulmonary_unique.jpg",
  "complex-case-recovery-physiotherapy": "journal_complex-recovery_unique.jpg",
  "copd-physiotherapy-management": "journal_copd_unique.jpg",
  "physiotherapist-at-home-kozhikode": "journal_assessment.jpg",
  "physiotherapy-after-fracture-recovery": "journal_fracture-recovery_unique.jpg",
  "frozen-shoulder-physiotherapy-treatment": "journal_frozen-shoulder_unique.jpg",
  "post-surgery-stairs-community-mobility-pune": "journal_functional.jpg",
  "guillain-barre-syndrome-recovery": "journal_guillain-barre_unique.jpg",
  "hip-replacement-homecare-physiotherapy": "journal_hip-replacement_unique.jpg",
  "physiotherapist-at-home-bengaluru": "journal_home-bengaluru_unique.jpg",
  "physiotherapist-at-home-chennai": "journal_home-chennai_unique.jpg",
  "physiotherapist-at-home-delhi": "journal_home-delhi_unique.jpg",
  "physiotherapist-at-home-hyderabad": "journal_home-hyderabad_unique.jpg",
  "physiotherapist-at-home-india-guide": "journal_home-india_unique.jpg",
  "physiotherapist-at-home-jaipur": "journal_home-jaipur_unique.jpg",
  "physiotherapist-at-home-kolkata": "journal_home-kolkata_unique.jpg",
  "physiotherapist-at-home-mumbai": "journal_home-mumbai_unique.jpg",
  "physiotherapist-at-home-pune": "journal_home-pune_unique.jpg",
  "physiotherapist-at-home-noida": "journal_homecare.jpg",
  "knee-osteoarthritis-physiotherapy-guide": "journal_knee-osteoarthritis_unique.jpg",
  "knee-replacement-recovery-guide": "journal_knee-replacement_unique.jpg",
  "physiotherapy-for-low-back-pain": "journal_low-back-pain_unique.jpg",
  "neck-pain-cervical-stiffness-physiotherapy": "journal_neck-pain_unique.jpg",
  "stroke-rehabilitation-safer-home-practice-chandigarh": "journal_neuro.jpg",
  "skin-inflammation-vasculitis-diet-guide": "journal_nutrition-skin.jpg",
  "occupational-therapy-homecare": "journal_occupational-therapy_unique.jpg",
  "orthopaedic-recovery-reaching-carrying-vadodara": "journal_ortho.jpg",
  "parkinsons-physiotherapy-guide": "journal_parkinsons_unique.jpg",
  "plantar-fasciitis-physiotherapy-guide": "journal_plantar-fasciitis_unique.jpg",
  "rotator-cuff-surgery-rehabilitation": "journal_rotator-cuff_unique.jpg",
  "sciatica-physiotherapy-treatment-guide": "journal_sciatica_unique.jpg",
  "returning-to-running-after-acl-injury-gurugram": "journal_sports.jpg",
  "stroke-rehabilitation-at-home": "journal_stroke_unique.jpg",
  "knee-replacement-vehicle-transfers-community-mobility-surat": "journal_surgery.jpg",
  "walking-aids-walker-cane-crutches-guide": "journal_walking-aids_unique.jpg",
};

export function getJournalImageFilename(slug: string, _image?: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid Journal image slug: ${slug}`);
  }

  return existingArticleImages[slug] ?? `journal_${slug}_unique.jpg`;
}

export function getJournalImagePath(slug: string, image?: string): string {
  return `/images/journal/${getJournalImageFilename(slug, image)}`;
}

export function getJournalWebpImagePath(slug: string, image?: string): string {
  return getJournalImagePath(slug, image).replace(/\.jpe?g$/i, ".webp");
}

export function getJournalCardImagePath(slug: string, image?: string): string {
  return getJournalImagePath(slug, image).replace(/\.jpe?g$/i, "_card.webp");
}