import { test } from "node:test";
import assert from "node:assert/strict";
import { parseArticleBlocks, parseInlineMarkdown } from "./article-markdown";

test("inline Markdown converts links, bold text, and emphasis into tokens", () => {
  assert.deepEqual(
    parseInlineMarkdown(
      "Use **graded exercise**, *safe pacing*, and [home physiotherapy](/home-physiotherapy).",
    ),
    [
      { type: "text", value: "Use " },
      { type: "strong", value: "graded exercise" },
      { type: "text", value: ", " },
      { type: "emphasis", value: "safe pacing" },
      { type: "text", value: ", and " },
      { type: "link", label: "home physiotherapy", href: "/home-physiotherapy" },
      { type: "text", value: "." },
    ],
  );
});

test("article blocks render headings and lists even without blank lines", () => {
  assert.deepEqual(parseArticleBlocks("Intro paragraph.\n### Booking and follow-up\n- First step\n- Second step"), [
    { type: "paragraph", text: "Intro paragraph." },
    { type: "heading", level: 2, text: "Booking and follow-up" },
    { type: "list", ordered: false, items: ["First step", "Second step"] },
  ]);
});