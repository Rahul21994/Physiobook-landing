export function parseBlogAuditCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) {
    throw new Error("blog_audit.csv contains an unterminated quoted field.");
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }

  if (rows.length < 2) {
    throw new Error("blog_audit.csv must contain a header and audit rows.");
  }

  const headers = rows[0].map((header) => header.replace(/^\uFEFF/, ""));
  return rows.slice(1)
    .filter((cells) => cells.some((cell) => cell.length > 0))
    .map((cells) => Object.fromEntries(
      headers.map((header, index) => [header, cells[index] ?? ""]),
    ));
}

export function getAuditedNoindexBlogSlugs(csvText, blogPosts) {
  const rows = parseBlogAuditCsv(csvText).filter((row) => row.route_type === "article_post");
  const requiredColumns = [
    "url",
    "visible_words",
    "max_similarity_pct",
    "under_500_words",
    "over_70_similarity",
    "noindex_candidate",
    "action",
  ];
  const headers = new Set(Object.keys(rows[0] ?? {}));
  const missingColumns = requiredColumns.filter((column) => !headers.has(column));
  if (missingColumns.length > 0) {
    throw new Error(`blog_audit.csv is missing required columns: ${missingColumns.join(", ")}`);
  }

  const auditedSlugs = new Set();
  const noindexSlugs = new Set();
  for (const row of rows) {
    let slug;
    try {
      const pathname = new URL(row.url).pathname;
      const match = pathname.match(/^\/blog\/([^/]+)$/);
      if (!match) throw new Error("not a blog article URL");
      slug = match[1];
    } catch {
      throw new Error(`blog_audit.csv has an invalid article URL: ${row.url}`);
    }

    if (auditedSlugs.has(slug)) {
      throw new Error(`blog_audit.csv contains duplicate article row for "${slug}".`);
    }
    auditedSlugs.add(slug);

    const visibleWords = Number(row.visible_words);
    const similarity = Number(row.max_similarity_pct);
    if (!Number.isFinite(visibleWords) || !Number.isFinite(similarity)) {
      throw new Error(`blog_audit.csv has invalid word-count or similarity data for "${slug}".`);
    }

    const under500 = visibleWords < 500;
    const over70 = similarity > 70;
    const candidate = under500 && over70;
    if (
      row.under_500_words !== (under500 ? "yes" : "no") ||
      row.over_70_similarity !== (over70 ? "yes" : "no") ||
      row.noindex_candidate !== (candidate ? "yes" : "no") ||
      row.action !== (candidate ? "noindex" : "keep-indexable")
    ) {
      throw new Error(
        `blog_audit.csv eligibility fields do not match the approved AND thresholds for "${slug}".`,
      );
    }

    if (candidate) noindexSlugs.add(slug);
  }

  const currentSlugs = new Set(blogPosts.map((post) => post.slug));
  const missingAuditRows = [...currentSlugs].filter((slug) => !auditedSlugs.has(slug));
  const staleAuditRows = [...auditedSlugs].filter((slug) => !currentSlugs.has(slug));
  if (missingAuditRows.length > 0 || staleAuditRows.length > 0) {
    throw new Error([
      "blog_audit.csv does not match the authored article catalog.",
      ...(missingAuditRows.length > 0 ? [`Missing: ${missingAuditRows.join(", ")}`] : []),
      ...(staleAuditRows.length > 0 ? [`Stale: ${staleAuditRows.join(", ")}`] : []),
    ].join("\n"));
  }

  return noindexSlugs;
}