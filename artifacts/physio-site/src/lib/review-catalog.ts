import { cities, getCityBySlug } from "./cities";
import { cityReviewSlugs, getCityReviews } from "./city-reviews";
import { normalizeReviewText } from "./review-deduplication";

export interface ApprovedReview {
  id: number;
  name: string;
  city: string | null;
  rating: number;
  body: string;
  createdAt: string;
}

export type ReviewSource = "homepage" | "city" | "submitted";

export interface PublishedReview {
  id: string;
  name: string;
  city?: string;
  state?: string;
  condition?: string;
  rating?: number;
  body: string;
  datePublished?: string;
  source: ReviewSource;
}

export interface PublishedReviewFilters {
  city: string;
  careNeed: string;
}

export interface PublishedReviewFilterOptions {
  cities: string[];
  careNeeds: string[];
}

export const HOMEPAGE_REVIEWS: PublishedReview[] = [
  {
    id: "homepage-hemant-choudhary",
    name: "Hemant Choudhary",
    city: "Tigaon",
    state: "Haryana",
    condition: "Road Traffic Accident — Post-Surgery Rehabilitation",
    rating: 5,
    body: "After a major road accident and surgery, I struggled to walk on both legs. With consistent post-surgery physiotherapy and rehabilitation, I gradually rebuilt my strength, balance, and confidence. I have now returned to normal daily movement and am deeply grateful to the team for their patient, focused care throughout my recovery.",
    source: "homepage",
  },
  {
    id: "homepage-anjali-taneja",
    name: "Dr. Anjali Taneja",
    city: "Hyderabad",
    state: "Telangana",
    condition: "Complex Neurological Rehabilitation (GBS)",
    rating: 5,
    body: "My husband was discharged from ICU after GBS — totally paralysed. As a doctor I'd rarely seen a team handle such a complex case so well. He's walking with a walker now. Cannot recommend them highly enough.",
    source: "homepage",
  },
  {
    id: "homepage-meena-rajput",
    name: "Meena Rajput",
    city: "Jaipur",
    state: "Rajasthan",
    condition: "Post-Knee Replacement Rehabilitation",
    rating: 5,
    body: "After my total knee replacement, I was nervous about recovery at home. The physiotherapist came daily, brought all equipment, and guided me through every exercise. My surgeon was impressed by my recovery speed at my 6-week check-up.",
    source: "homepage",
  },
  {
    id: "homepage-arun-paliwal",
    name: "Arun Paliwal",
    city: "Mumbai",
    state: "Maharashtra",
    condition: "COPD & Cardiopulmonary Rehabilitation",
    rating: 5,
    body: "I have COPD and managing breathlessness was becoming impossible. The cardiopulmonary physio taught me proper breathing techniques and an exercise routine. The difference in 4 weeks was remarkable — I can now climb stairs without stopping.",
    source: "homepage",
  },
  {
    id: "homepage-preet",
    name: "Preet",
    city: "Faridabad",
    state: "Haryana",
    condition: "Elbow and heel pain home physiotherapy",
    rating: 5,
    body: `In February ,2026,  I had been suffering from immense pain in my right elbow, so much so, that it was difficult to even raise my hand or hold anything in my hand.
I was unable to do my simple daily chores like brushing my teeth, cooking food , eating food etc.
My husband consulted Dr Rahul Goswami,for the same on his mobile and requested for a physiotherapy session at our home .During his visit , It turned out that there had been some ligament tear near the elbow joint. 
On understanding the pain level , his first concern was immediate and effective pain management.
He used electrotherapy to reduce the pain . It provided magical relief from tremendous pain to a more tolerable pain level.
Subsequently , he meticulously planned the target specific exercise regime, to resolve the root cause for the elbow pain.
Once the pain was stabilized, the new set of endurance movements involving the right hand, elbow and arm, were added .
Throughout the treatment ,he made sure I did the exercises everyday by staying in touch with me on whatsapp.
It took almost a week or two, but my elbow pain was successfully and completely resolved , with no need for any painkillers.

Recently, in July 2026, I experienced immense heel pain in my right foot. I presumed, that since I had gained a lot of weight so maybe due to this, my heel  had started paining while walking or rather even on standing.
I tried going for walk so as to help reduce my weight but due to severe heel pain I could not do so. It rather made the heel pain worse . Pain was almost 9 on the scale of 10.
By August, I contacted Dr Rahul , again , as he had previously managed my elbow pain really well with physiotherapy.
As a first line of action , He recommended the correct footwear which were to be worn to cushion the heel and also sent across the heel stretching exercises to take care of heel pain to some extent , with immediate effect. 
I was advised to get my fasting sugar test done , to rule out diabetes as a cause for the above.The results came out normal.
Hence , further to judge the root cause for the heel pain ,he shared a few links via WhatsApp ,where certain heel pain assessment movements were suggested.
I was told to share the observations regarding pain location and pain level on doing respective foot / heel movement as given in the links shared.
With the help of this, he understood the reasons responsible for my heel pain .
To my surprise, the pain in heel was not only because of weight gain but also due to issues in my hip alignment, calf stiffness and long sitting hours.
Keeping all this in mind he planned my regime, addressing not only heel stretches but also for hip , calf and strength training . The soreness I felt due to weight training or other exercises , was strictly advised to be managed with natural remedies only and not with any medicines.
It has been almost a month , where in Dr Rahul, has suggested multiple progressive workout regimes ,targetting various aspects responsible for the pain , as he is guiding me through the recovery for the heel pain and for healthy weight management.
He makes it a point that the regime is not overburdening and yet effective enough to show Good progress in recovery.
He not only prescribed the workout plan but also takes regular WhatsApp updates if the regime is completed or not and feedback if I am getting any pain due to the workout . Based on my feedback , he either resolves the issue with alternative exercise/ natural remedy or modifies the regime if required.
My heel pain has already started to improve.
I am sure with persistence and his continued guidance , I shall heal my heel pain, very soon .

I highly recommend Dr Rahul Goswami ,for immaculate diagnosis of the root cause behind any kind of pain , efficient planning of the target specific physiotherapy and for his perseverance to guide the patient through the process to complete recovery.`,
    source: "homepage",
  },
];

function normalizeLocation(value: string | undefined | null): string {
  return (value ?? "").replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

function resolveSubmittedLocation(value: string | null): Pick<PublishedReview, "city" | "state"> {
  const supplied = value?.replace(/\s+/g, " ").trim();
  if (!supplied) return {};

  const [firstPart, ...rest] = supplied.split(",").map((part) => part.trim()).filter(Boolean);
  if (rest.length > 0) {
    return { city: firstPart, state: rest.join(", ") };
  }

  const knownCity = cities.find(
    (city) =>
      normalizeLocation(city.name) === normalizeLocation(supplied) ||
      normalizeLocation(city.slug) === normalizeLocation(supplied),
  );
  return knownCity ? { city: knownCity.name, state: knownCity.state } : { city: supplied };
}

function cityReviewsAsPublished(): PublishedReview[] {
  return cityReviewSlugs.flatMap((citySlug) => {
    const city = getCityBySlug(citySlug);
    if (!city) return [];

    return getCityReviews(citySlug).map((review, index) => ({
      id: `city-${citySlug}-${review.name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      name: review.name,
      city: city.name,
      state: city.state,
      condition: review.condition,
      body: review.body,
      datePublished: review.datePublished,
      source: "city" as const,
    }));
  });
}

function isDuplicateReview(existing: PublishedReview, candidate: PublishedReview): boolean {
  const sameBody =
    normalizeReviewText(existing.body).toLocaleLowerCase() ===
    normalizeReviewText(candidate.body).toLocaleLowerCase();
  if (sameBody) return true;

  const sameName =
    normalizeLocation(existing.name) !== "" &&
    normalizeLocation(existing.name) === normalizeLocation(candidate.name);
  const samePreetLocation =
    sameName &&
    normalizeLocation(candidate.name) === "preet" &&
    ["faridabad", "home physiotherapy"].includes(normalizeLocation(candidate.city));

  return samePreetLocation;
}

function deduplicateReviews(reviews: readonly PublishedReview[]): PublishedReview[] {
  return reviews.reduce<PublishedReview[]>((unique, review) => {
    if (!unique.some((existing) => isDuplicateReview(existing, review))) {
      unique.push(review);
    }
    return unique;
  }, []);
}

export function getPublishedReviewCatalogue(
  approvedReviews: readonly ApprovedReview[] = [],
): PublishedReview[] {
  const submittedReviews = approvedReviews.map((review) => ({
    id: `submitted-${review.id}`,
    name: review.name,
    ...resolveSubmittedLocation(review.city),
    rating: review.rating,
    body: review.body,
    datePublished: review.createdAt,
    source: "submitted" as const,
  }));

  return deduplicateReviews([
    ...HOMEPAGE_REVIEWS,
    ...cityReviewsAsPublished(),
    ...submittedReviews,
  ]);
}

function sortFilterValues(values: Iterable<string>): string[] {
  return [...values].sort((left, right) => {
    const normalizedLeft = normalizeLocation(left);
    const normalizedRight = normalizeLocation(right);
    if (normalizedLeft === normalizedRight) return left < right ? -1 : left > right ? 1 : 0;
    return normalizedLeft < normalizedRight ? -1 : 1;
  });
}

function uniqueFilterValues(values: readonly (string | undefined)[]): string[] {
  const unique = new Map<string, string>();
  for (const value of values) {
    const trimmed = value?.replace(/\s+/g, " ").trim();
    if (!trimmed) continue;
    const normalized = normalizeLocation(trimmed);
    if (!unique.has(normalized)) unique.set(normalized, trimmed);
  }
  return sortFilterValues(unique.values());
}

export function getPublishedReviewFilterOptions(
  reviews: readonly PublishedReview[],
): PublishedReviewFilterOptions {
  return {
    cities: uniqueFilterValues(reviews.map((review) => review.city)),
    careNeeds: uniqueFilterValues(reviews.map((review) => review.condition)),
  };
}

export function filterPublishedReviews(
  reviews: readonly PublishedReview[],
  filters: PublishedReviewFilters,
): PublishedReview[] {
  const city = normalizeLocation(filters.city);
  const careNeed = normalizeLocation(filters.careNeed);

  return reviews.filter((review) => {
    const matchesCity = !city || normalizeLocation(review.city) === city;
    const matchesCareNeed = !careNeed || normalizeLocation(review.condition) === careNeed;
    return matchesCity && matchesCareNeed;
  });
}