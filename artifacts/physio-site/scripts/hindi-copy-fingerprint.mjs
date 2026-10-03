import { createHash } from "node:crypto";

const COPY_ATTRIBUTES = ["aria-label", "aria-description", "alt", "title", "placeholder"];
const BLOCK_TAGS = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "br",
  "caption",
  "dd",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "li",
  "main",
  "ol",
  "p",
  "section",
  "table",
  "tbody",
  "td",
  "tfoot",
  "th",
  "thead",
  "tr",
  "ul",
]);
const SKIP_TEXT_TAGS = new Set(["option", "script", "select", "style", "template", "textarea"]);
const ENTITY_VALUES = new Map([
  ["amp", "&"],
  ["apos", "'"],
  ["gt", ">"],
  ["lt", "<"],
  ["nbsp", " "],
  ["quot", '"'],
]);

function decodeHtmlEntities(value) {
  return value.replace(/&(#x[\da-f]+|#\d+|amp|apos|gt|lt|nbsp|quot);/giu, (match, entity) => {
    if (entity[0] !== "#") return ENTITY_VALUES.get(entity.toLowerCase()) ?? match;
    const hexadecimal = entity[1]?.toLowerCase() === "x";
    const codePoint = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
    return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : match;
  });
}

function attributeValue(tag, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const match = tag.match(
    new RegExp(`(?:^|\\s)${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "iu"),
  );
  return match?.slice(1).find((value) => value !== undefined);
}

function getMainContents(html) {
  const mainTags = [...html.matchAll(/<\/?main\b[^>]*>/giu)];
  const contents = [];
  let depth = 0;
  let contentStart = -1;

  for (const match of mainTags) {
    const isClosing = /^<\/main\b/iu.test(match[0]);
    if (!isClosing) {
      if (depth === 0) contentStart = match.index + match[0].length;
      depth += 1;
      continue;
    }

    if (depth === 0) throw new Error("Encountered a closing main tag without an opening tag.");
    depth -= 1;
    if (depth === 0) {
      contents.push(html.slice(contentStart, match.index));
      contentStart = -1;
    }
  }

  if (depth !== 0) throw new Error("The rendered Hindi route has an unclosed main tag.");
  if (contents.length === 0) throw new Error("The rendered Hindi route is missing main content.");
  return contents;
}

function extractMainCopy(mainHtml) {
  const tokens = mainHtml.match(/<!--[\s\S]*?-->|<\/?[a-z][^>]*>|[^<]+/giu) ?? [];
  const text = [];
  const skippedTags = [];

  for (const token of tokens) {
    if (token.startsWith("<!--")) continue;
    if (token.startsWith("<")) {
      const match = token.match(/^<\s*(\/?)\s*([a-z][\w:-]*)\b[^>]*>/iu);
      if (!match) continue;
      const [, slash, rawName] = match;
      const name = rawName.toLowerCase();
      const isClosing = slash === "/";

      if (isClosing) {
        const skipIndex = skippedTags.lastIndexOf(name);
        if (skipIndex !== -1) skippedTags.length = skipIndex;
        if (BLOCK_TAGS.has(name)) text.push(" ");
        continue;
      }

      if (skippedTags.length === 0) {
        for (const attributeName of COPY_ATTRIBUTES) {
          const value = attributeValue(token, attributeName);
          if (value !== undefined) text.push(decodeHtmlEntities(value), " ");
        }
      }
      if (BLOCK_TAGS.has(name)) text.push(" ");
      if (SKIP_TEXT_TAGS.has(name) && !/\/\s*>$/u.test(token)) {
        skippedTags.push(name);
      }
      continue;
    }

    if (skippedTags.length === 0) text.push(decodeHtmlEntities(token));
  }

  return text.join("").normalize("NFC").replace(/\s+/gu, " ").trim();
}

function normalizeMetadataText(value) {
  return decodeHtmlEntities(value).normalize("NFC").replace(/\s+/gu, " ").trim();
}

function metadataValue(html, attributeName, expectedValue) {
  const tags = html.match(/<meta\b[^>]*>/giu) ?? [];
  const tag = tags.find(
    (candidate) =>
      attributeValue(candidate, attributeName)?.toLowerCase() === expectedValue.toLowerCase(),
  );
  return tag ? attributeValue(tag, "content") : undefined;
}

export function extractHindiRouteCopy(html) {
  const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/iu)?.[1];
  const description = metadataValue(html, "name", "description");
  if (title === undefined || description === undefined) {
    throw new Error("Rendered Hindi route must include a title and meta description.");
  }

  return JSON.stringify({
    title: normalizeMetadataText(title),
    description: normalizeMetadataText(description),
    main: getMainContents(html).map(extractMainCopy),
  });
}

export function fingerprintHindiRouteCopy(html) {
  return createHash("sha256").update(extractHindiRouteCopy(html)).digest("hex");
}

export function parseHindiApprovalLedger(markdown) {
  const heading = "## Route-by-route review ledger";
  const start = markdown.indexOf(heading);
  if (start === -1) throw new Error("Hindi review ledger section is missing.");
  const sectionStart = start + heading.length;
  const sectionEnd = markdown.indexOf("\n## ", sectionStart);
  const section = markdown.slice(sectionStart, sectionEnd === -1 ? undefined : sectionEnd);
  const approvals = new Map();

  for (const line of section.split(/\r?\n/u)) {
    if (!line.trimStart().startsWith("|")) continue;
    const cells = line.split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 4) continue;
    const routeMatch = cells[0].match(/^`(\/hi\/[^`]+)`$/u);
    if (!routeMatch) continue;

    const route = routeMatch[1];
    const revisions = [...cells[1].matchAll(/`([^`]+)`/gu)].map((match) => match[1]);
    if (revisions.length === 0 || !cells[2] || !cells[3]) {
      throw new Error(`Hindi review ledger entry ${route} must include revisions and both reviewer approvals.`);
    }
    if (approvals.has(route)) throw new Error(`Hindi review ledger contains duplicate route ${route}.`);
    approvals.set(route, {
      revisions,
      hindiReviewer: cells[2],
      clinicalReviewer: cells[3],
    });
  }

  if (approvals.size !== 50) {
    throw new Error(`Expected 50 Hindi route approvals in the review ledger, found ${approvals.size}.`);
  }
  return approvals;
}