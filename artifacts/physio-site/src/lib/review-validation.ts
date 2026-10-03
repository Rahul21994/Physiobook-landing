export const MIN_REVIEW_CHARACTERS = 10;
export const MAX_REVIEW_WORDS = 1000;
export const MAX_REVIEW_CHARACTERS = 4000;

export function countReviewWords(value: string): number {
  const trimmed = value.trim();
  return trimmed ? trimmed.split(/\s+/u).length : 0;
}

export function countReviewCharacters(value: string, includeSpaces = true): number {
  return includeSpaces ? value.length : value.replace(/\s/gu, "").length;
}

export function getReviewLimitError(value: string): string | null {
  if (countReviewWords(value) > MAX_REVIEW_WORDS) {
    return `Please keep your review to ${MAX_REVIEW_WORDS} words or fewer.`;
  }
  if (countReviewCharacters(value) > MAX_REVIEW_CHARACTERS) {
    return `Please keep your review to ${MAX_REVIEW_CHARACTERS} characters or fewer, including spaces.`;
  }
  if (countReviewCharacters(value, false) > MAX_REVIEW_CHARACTERS) {
    return `Please keep your review to ${MAX_REVIEW_CHARACTERS} characters or fewer, excluding spaces.`;
  }
  return null;
}