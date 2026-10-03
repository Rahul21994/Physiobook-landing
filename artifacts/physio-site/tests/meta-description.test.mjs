import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMetaDescription } from "../scripts/meta-description.mjs";

const descriptionOfLength = (length) => `${"a".repeat(length - 1)}.`;

test("accepts the 150- and 155-code-point boundaries", () => {
  assert.equal(
    normalizeMetaDescription(descriptionOfLength(150), "/valid-150"),
    descriptionOfLength(150),
  );
  assert.equal(
    normalizeMetaDescription(descriptionOfLength(155), "/valid-155"),
    descriptionOfLength(155),
  );
});

test("rejects descriptions immediately outside the approved range", () => {
  for (const length of [149, 156]) {
    assert.throws(
      () => normalizeMetaDescription(descriptionOfLength(length), `/invalid-${length}`),
      new RegExp(`/invalid-${length}.*measured ${length} Unicode code points`),
    );
  }
});

test("normalizes whitespace before counting visible code points", () => {
  const input = `${"a".repeat(149)}\n\t.`;
  const normalized = `${"a".repeat(149)} .`;
  assert.equal(normalizeMetaDescription(input, "/whitespace"), normalized);
  assert.equal(Array.from(normalized).length, 151);
});

test("counts Unicode code points rather than UTF-16 code units", () => {
  const description = `${"a".repeat(148)}😀.`;
  assert.equal(description.length, 151);
  assert.equal(Array.from(description).length, 150);
  assert.equal(normalizeMetaDescription(description, "/unicode"), description);
});

test("accepts Hindi sentence-ending punctuation", () => {
  const description = `${"क".repeat(149)}।`;
  assert.equal(Array.from(description).length, 150);
  assert.equal(normalizeMetaDescription(description, "/hindi"), description);
});

test("rejects missing punctuation, ellipses, and dangling endings", () => {
  const validPrefix = "a".repeat(145);
  for (const ending of [" unfinished", " and.", " …", " ..."]) {
    const candidate = `${validPrefix}${ending}`;
    assert.throws(() => normalizeMetaDescription(candidate, "/unfinished"));
  }
});