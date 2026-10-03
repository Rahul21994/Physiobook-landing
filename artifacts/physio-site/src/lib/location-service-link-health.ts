import {
  checkJournalSource,
  classifyLinkError,
  classifyLinkResponse,
  type JournalSource,
  type LinkHealthResult,
} from "./journal-link-health.js";
import {
  getLocationServiceSources,
  type LocationServiceSourceReference,
} from "./location-services.js";

const DEFAULT_CONCURRENCY = 4;

export type LocationServiceLinkHealthResult = Omit<LinkHealthResult, "source"> & {
  source: LocationServiceSourceReference;
};

function asJournalSource(source: LocationServiceSourceReference): JournalSource {
  return {
    slug: source.href,
    title: source.title,
    url: source.href,
  };
}

export function classifyLocationServiceLinkResponse(
  source: LocationServiceSourceReference,
  response: Pick<Response, "ok" | "status" | "url" | "redirected">,
): LocationServiceLinkHealthResult {
  return {
    ...classifyLinkResponse(asJournalSource(source), response),
    source,
  };
}

export function classifyLocationServiceLinkError(
  source: LocationServiceSourceReference,
  error: unknown,
): LocationServiceLinkHealthResult {
  return {
    ...classifyLinkError(asJournalSource(source), error),
    source,
  };
}

export async function checkLocationServiceSource(
  source: LocationServiceSourceReference,
  options: {
    fetchFn?: typeof fetch;
    timeoutMs?: number;
  } = {},
): Promise<LocationServiceLinkHealthResult> {
  const result = await checkJournalSource(asJournalSource(source), options);
  return { ...result, source };
}

export async function checkLocationServiceSources(
  sources: LocationServiceSourceReference[] = getLocationServiceSources(),
  options: {
    fetchFn?: typeof fetch;
    timeoutMs?: number;
    concurrency?: number;
  } = {},
): Promise<LocationServiceLinkHealthResult[]> {
  const results: LocationServiceLinkHealthResult[] = [];
  const concurrency = Math.max(
    1,
    Math.min(options.concurrency ?? DEFAULT_CONCURRENCY, sources.length || 1),
  );
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < sources.length) {
      const source = sources[nextIndex++];
      results.push(await checkLocationServiceSource(source, options));
    }
  }

  await Promise.all(
    Array.from({ length: concurrency }, () => worker()),
  );

  return results;
}

export function formatLocationServiceLinkResult(
  result: LocationServiceLinkHealthResult,
): string {
  const finalUrl =
    result.finalUrl && result.finalUrl !== result.source.href
      ? `; final URL: ${result.finalUrl}`
      : "";
  return `${result.source.title} — affected themes: ${result.source.themeTitles.join(", ")} — ${
    result.reason ?? "unknown result"
  } (${result.source.href}${finalUrl})`;
}