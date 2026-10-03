import { blogPosts } from "./data.js";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_CONCURRENCY = 4;

export type JournalSource = {
  slug: string;
  title: string;
  url: string;
};

export type LinkHealthState = "verified" | "unverified" | "broken";

export type LinkHealthResult = {
  source: JournalSource;
  state: LinkHealthState;
  status?: number;
  finalUrl?: string;
  reason?: string;
};

export function getJournalSources(): JournalSource[] {
  return blogPosts.flatMap((post) =>
    (post.sources ?? []).map((source) => ({
      slug: post.slug,
      title: source.title,
      url: source.url,
    })),
  );
}

function normalizedHostname(url: string): string {
  return new URL(url).hostname.toLowerCase().replace(/^www\./, "");
}

export function classifyLinkResponse(
  source: JournalSource,
  response: Pick<Response, "ok" | "status" | "url" | "redirected">,
): LinkHealthResult {
  const finalUrl = response.url || source.url;

  if (normalizedHostname(source.url) !== normalizedHostname(finalUrl)) {
    return {
      source,
      state: "broken",
      status: response.status,
      finalUrl,
      reason: `unexpected redirect to ${finalUrl}`,
    };
  }

  if (response.status === 404 || response.status === 410) {
    return {
      source,
      state: "broken",
      status: response.status,
      finalUrl,
      reason: `HTTP ${response.status}`,
    };
  }

  if (!response.ok) {
    const reason =
      response.status === 401 || response.status === 403
        ? `HTTP ${response.status}; source blocks automated checks`
        : response.status === 429
          ? "HTTP 429; source rate limited the request"
          : `HTTP ${response.status}`;
    return {
      source,
      state: "unverified",
      status: response.status,
      finalUrl,
      reason,
    };
  }

  return {
    source,
    state: "verified",
    status: response.status,
    finalUrl,
  };
}

export function classifyLinkError(
  source: JournalSource,
  error: unknown,
): LinkHealthResult {
  const reason =
    error instanceof Error && error.name === "AbortError"
      ? "request timed out"
      : error instanceof Error
        ? error.message
        : String(error);

  return {
    source,
    state: "unverified",
    reason: `request failed: ${reason}`,
  };
}

export async function checkJournalSource(
  source: JournalSource,
  options: {
    fetchFn?: typeof fetch;
    timeoutMs?: number;
  } = {},
): Promise<LinkHealthResult> {
  const fetchFn = options.fetchFn ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetchFn(source.url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "user-agent": "Goswami-Rehab-Journal-Link-Health/1.0",
      },
    });

    return classifyLinkResponse(source, response);
  } catch (error) {
    return classifyLinkError(source, error);
  } finally {
    clearTimeout(timeout);
  }
}

export async function checkJournalSources(
  sources: JournalSource[] = getJournalSources(),
  options: {
    fetchFn?: typeof fetch;
    timeoutMs?: number;
    concurrency?: number;
  } = {},
): Promise<LinkHealthResult[]> {
  const results: LinkHealthResult[] = [];
  const concurrency = Math.max(
    1,
    Math.min(options.concurrency ?? DEFAULT_CONCURRENCY, sources.length || 1),
  );
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < sources.length) {
      const source = sources[nextIndex++];
      results.push(await checkJournalSource(source, options));
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker()),
  );

  return results;
}

function formatResult(result: LinkHealthResult): string {
  return `${result.source.slug} — ${result.source.title} — ${
    result.reason ?? "unknown result"
  } (${result.source.url})`;
}

type LinkHealthLogger = Pick<Console, "log" | "warn" | "error">;

export async function runJournalLinkHealthCheck(options: {
  sources?: JournalSource[];
  fetchFn?: typeof fetch;
  timeoutMs?: number;
  concurrency?: number;
  logger?: LinkHealthLogger;
} = {}): Promise<number> {
  const {
    sources: configuredSources,
    logger = console,
    ...checkOptions
  } = options;
  const sources = configuredSources ?? getJournalSources();
  const results = await checkJournalSources(sources, checkOptions);
  const broken = results.filter((result) => result.state === "broken");
  const unverified = results.filter((result) => result.state === "unverified");
  const verified = results.filter((result) => result.state === "verified");

  if (broken.length > 0) {
    logger.error(
      `Journal source link check found ${broken.length} broken source${broken.length === 1 ? "" : "s"}.`,
    );
    for (const result of broken) {
      logger.error(`Broken source: ${formatResult(result)}`);
    }
  }

  for (const result of unverified) {
    logger.warn(`Unverified source: ${formatResult(result)}`);
  }

  logger.log(
    `Journal source link check complete: ${sources.length} sources checked (${verified.length} verified, ${unverified.length} unverified, ${broken.length} broken).`,
  );
  return broken.length > 0 ? 1 : 0;
}
