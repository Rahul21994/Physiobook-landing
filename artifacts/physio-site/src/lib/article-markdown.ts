export type InlineMarkdownToken =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string }
  | { type: "strong"; value: string }
  | { type: "emphasis"; value: string };

export type ArticleBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

const INLINE_MARKDOWN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
const HEADING = /^(###|####)\s+(.+)$/;
const LIST_ITEM = /^([-*]|\d+\.)\s+(.+)$/;

export function parseInlineMarkdown(text: string): InlineMarkdownToken[] {
  const tokens: InlineMarkdownToken[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(INLINE_MARKDOWN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, index) });
    }

    if (match[1] && match[2]) {
      tokens.push({ type: "link", label: match[1], href: match[2] });
    } else if (match[3]) {
      tokens.push({ type: "strong", value: match[3] });
    } else if (match[4]) {
      tokens.push({ type: "emphasis", value: match[4] });
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }

  return tokens.length > 0 ? tokens : [{ type: "text", value: text }];
}

export function parseArticleBlocks(content: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];
  let paragraphLines: string[] = [];
  let listLines: Array<{ ordered: boolean; text: string }> = [];

  const flushParagraph = () => {
    if (paragraphLines.length === 0) return;
    blocks.push({
      type: "paragraph",
      text: paragraphLines.join(" ").replace(/\s+/g, " ").trim(),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (listLines.length === 0) return;
    blocks.push({
      type: "list",
      ordered: listLines[0].ordered,
      items: listLines.map(({ text }) => text),
    });
    listLines = [];
  };

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(HEADING);
    if (heading) {
      flushParagraph();
      flushList();
      blocks.push({
        type: "heading",
        level: heading[1] === "####" ? 3 : 2,
        text: heading[2],
      });
      continue;
    }

    const listItem = line.match(LIST_ITEM);
    if (listItem) {
      flushParagraph();
      const ordered = /^\d+\./.test(listItem[1]);
      if (listLines.length > 0 && listLines[0].ordered !== ordered) {
        flushList();
      }
      listLines.push({ ordered, text: listItem[2] });
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();
  return blocks.filter((block) => block.type !== "paragraph" || block.text.length > 0);
}