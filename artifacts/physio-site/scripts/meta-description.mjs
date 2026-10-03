const MIN_DESCRIPTION_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 155;
const DANGLING_ENDINGS = new Set([
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "from",
  "in",
  "including",
  "of",
  "on",
  "or",
  "to",
  "with",
]);

export function normalizeMetaDescription(value, routePath, field = "description") {
  const clean = String(value ?? "").replace(/\s+/gu, " ").trim();
  const length = Array.from(clean).length;
  const fail = (reason) => {
    throw new Error(
      `Invalid ${field} for ${routePath}: ${reason} (measured ${length} Unicode code points).`,
    );
  };

  if (length < MIN_DESCRIPTION_LENGTH || length > MAX_DESCRIPTION_LENGTH) {
    fail(`expected ${MIN_DESCRIPTION_LENGTH}–${MAX_DESCRIPTION_LENGTH} characters`);
  }
  if (/(?:\.{3}|…)\s*$/u.test(clean)) {
    fail("must not end with an ellipsis");
  }
  if (!/[.!?\u0964]$/u.test(clean)) {
    fail("must end with complete sentence punctuation");
  }

  const finalWord = clean
    .replace(/[.!?\u0964]+$/u, "")
    .match(/[\p{L}]+$/u)?.[0]
    .toLowerCase();
  if (finalWord && DANGLING_ENDINGS.has(finalWord)) {
    fail(`ends with a dangling word: ${finalWord}`);
  }

  return clean;
}