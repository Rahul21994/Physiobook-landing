export interface ReviewCandidate {
  name: string;
  city?: string | null;
  body: string;
}

function normalizeReviewValue(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLocaleLowerCase();
}

export function normalizeReviewText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/**
 * Static verified reviews are rendered immediately. Approved API reviews are
 * appended after hydration, so known copies must be removed before combining
 * the two sources.
 */
export function filterDuplicateApprovedReviews<T extends ReviewCandidate>(
  seedReviews: readonly ReviewCandidate[],
  approvedReviews: readonly T[],
): T[] {
  return approvedReviews.filter((approvedReview) => {
    const approvedName = normalizeReviewValue(approvedReview.name);
    const approvedCity = normalizeReviewValue(approvedReview.city ?? "");

    return !seedReviews.some((seedReview) => {
      const sameName = normalizeReviewValue(seedReview.name) === approvedName;
      const sameBody =
        normalizeReviewText(seedReview.body) === normalizeReviewText(approvedReview.body);

      // Preet's approved record was previously stored under "Home physiotherapy"
      // rather than Faridabad, so name + the known source label identifies the
      // same verified experience even when the copy has formatting differences.
      const samePreetExperience =
        sameName &&
        approvedName === "preet" &&
        (approvedCity === "faridabad" || approvedCity === "home physiotherapy");

      return sameBody || samePreetExperience;
    });
  });
}