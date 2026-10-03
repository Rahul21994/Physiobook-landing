import { test } from "node:test";
import assert from "node:assert/strict";
import {
  checkJournalSource,
  checkJournalSources,
  classifyLinkResponse,
  getJournalSources,
  runJournalLinkHealthCheck,
  type JournalSource,
} from "./journal-link-health.js";

const source: JournalSource = {
  slug: "example-article",
  title: "Example clinical guidance",
  url: "https://clinical.example/guidance",
};

test("journal source catalog covers every source attached to published posts", () => {
  const sources = getJournalSources();

  assert.ok(sources.length > 0);
  assert.ok(sources.every((item) => item.slug && item.title && item.url));
});

test("successful same-host response is verified", () => {
  const result = classifyLinkResponse(source, {
    ok: true,
    status: 200,
    url: source.url,
    redirected: false,
  });

  assert.deepEqual(result, {
    source,
    state: "verified",
    status: 200,
    finalUrl: source.url,
  });
});

test("same-host 404 and 410 responses are broken", () => {
  for (const status of [404, 410]) {
    const result = classifyLinkResponse(source, {
      ok: false,
      status,
      url: source.url,
      redirected: false,
    });

    assert.equal(result.state, "broken");
    assert.equal(result.reason, `HTTP ${status}`);
    assert.equal(result.status, status);
  }
});

test("other HTTP error responses are unverified", () => {
  const expectations = new Map([
    [401, "HTTP 401; source blocks automated checks"],
    [403, "HTTP 403; source blocks automated checks"],
    [429, "HTTP 429; source rate limited the request"],
    [500, "HTTP 500"],
    [503, "HTTP 503"],
  ]);

  for (const [status, reason] of expectations) {
    const result = classifyLinkResponse(source, {
      ok: false,
      status,
      url: source.url,
      redirected: false,
    });

    assert.equal(result.state, "unverified");
    assert.equal(result.reason, reason);
    assert.equal(result.status, status);
  }
});

test("same-host canonical redirect passes", () => {
  const result = classifyLinkResponse(source, {
    ok: true,
    status: 200,
    url: "https://www.clinical.example/guidance/",
    redirected: true,
  });

  assert.equal(result.state, "verified");
  assert.equal(result.finalUrl, "https://www.clinical.example/guidance/");
});

test("cross-host redirect fails with destination", () => {
  const result = classifyLinkResponse(source, {
    ok: true,
    status: 200,
    url: "https://unrelated.example/guidance",
    redirected: true,
  });

  assert.equal(result.state, "broken");
  assert.equal(result.reason, "unexpected redirect to https://unrelated.example/guidance");
  assert.equal(result.finalUrl, "https://unrelated.example/guidance");
});

test("cross-host final URL fails even when redirect metadata is absent", () => {
  const result = classifyLinkResponse(source, {
    ok: true,
    status: 200,
    url: "https://unrelated.example/guidance",
    redirected: false,
  });

  assert.equal(result.state, "broken");
  assert.equal(result.reason, "unexpected redirect to https://unrelated.example/guidance");
});

test("cross-host final URL is broken even when the destination denies access", () => {
  const result = classifyLinkResponse(source, {
    ok: false,
    status: 403,
    url: "https://unrelated.example/guidance",
    redirected: true,
  });

  assert.equal(result.state, "broken");
  assert.equal(result.reason, "unexpected redirect to https://unrelated.example/guidance");
  assert.equal(result.finalUrl, "https://unrelated.example/guidance");
});

test("request failures including DNS, TLS, and timeout are unverified", async () => {
  const failures = [
    { error: new Error("DNS lookup failed"), expected: "request failed: DNS lookup failed" },
    {
      error: new Error("TLS certificate verification failed"),
      expected: "request failed: TLS certificate verification failed",
    },
    {
      error: Object.assign(new Error("aborted"), { name: "AbortError" }),
      expected: "request failed: request timed out",
    },
  ];

  for (const { error, expected } of failures) {
    const result = await checkJournalSource(source, {
      fetchFn: async () => {
        throw error;
      },
    });

    assert.equal(result.state, "unverified");
    assert.equal(result.reason, expected);
  }
});

test("source checks can run concurrently without changing coverage", async () => {
  const sources = [
    source,
    { ...source, slug: "second-article", title: "Second guidance" },
  ];
  const checkedUrls: string[] = [];
  const results = await checkJournalSources(sources, {
    concurrency: 2,
    fetchFn: async (url) => {
      checkedUrls.push(String(url));
      return new Response(null, {
        status: 204,
        headers: { location: String(url) },
      });
    },
  });

  assert.equal(results.length, sources.length);
  assert.deepEqual(checkedUrls.sort(), sources.map(({ url }) => url).sort());
  assert.ok(results.every((result) => result.state === "verified"));
});

test("unverified-only checks report URL and reason without failing", async () => {
  const networkSource = {
    ...source,
    slug: "network-error-article",
    title: "Temporarily unreachable guidance",
    url: "https://clinical.example/network-error",
  };
  const output = {
    logs: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  const result = await runJournalLinkHealthCheck({
    sources: [source, networkSource],
    fetchFn: async (url) => {
      if (String(url) === networkSource.url) {
        throw new Error("DNS lookup failed");
      }
      return new Response(null, { status: 429 });
    },
    logger: {
      log: (message) => output.logs.push(message),
      warn: (message) => output.warnings.push(message),
      error: (message) => output.errors.push(message),
    },
  });

  assert.equal(result, 0);
  assert.match(output.warnings.join("\n"), /Unverified source:.*HTTP 429/);
  assert.ok(output.warnings.some((line) => line.includes(source.url)));
  assert.ok(
    output.warnings.some(
      (line) =>
        line.includes(networkSource.url) && line.includes("request failed: DNS lookup failed"),
    ),
  );
  assert.match(
    output.logs.join("\n"),
    /2 sources checked \(0 verified, 2 unverified, 0 broken\)/,
  );
  assert.deepEqual(output.errors, []);
});

test("broken sources fail the check while unverified sources remain separately reported", async () => {
  const rateLimitedSource = {
    ...source,
    slug: "rate-limited-article",
    title: "Rate-limited guidance",
    url: "https://clinical.example/rate-limited",
  };
  const brokenSource = {
    ...source,
    slug: "broken-article",
    title: "Unavailable guidance",
    url: "https://clinical.example/missing",
  };
  const output = {
    logs: [] as string[],
    warnings: [] as string[],
    errors: [] as string[],
  };
  const result = await runJournalLinkHealthCheck({
    sources: [brokenSource, rateLimitedSource],
    fetchFn: async (url) =>
      new Response(null, { status: String(url).endsWith("/missing") ? 404 : 503 }),
    logger: {
      log: (message) => output.logs.push(message),
      warn: (message) => output.warnings.push(message),
      error: (message) => output.errors.push(message),
    },
  });

  assert.equal(result, 1);
  assert.ok(
    output.errors.some(
      (line) => line.includes("HTTP 404") && line.includes(brokenSource.url),
    ),
  );
  assert.ok(
    output.warnings.some(
      (line) =>
        line.includes("HTTP 503") && line.includes(rateLimitedSource.url),
    ),
  );
  assert.match(output.logs.join("\n"), /2 sources checked \(0 verified, 1 unverified, 1 broken\)/);
});

test("articles cite current authoritative pages for the three confirmed dead links", () => {
  const sources = getJournalSources();
  const replacements = [
    {
      slug: "diabetes-kidney-rehabilitation-nutrition-questions-coimbatore",
      title: "Nutrition and Kidney Disease, Stages 1-5 (Not on Dialysis)",
      url: "https://www.kidney.org/kidney-topics/nutrition-and-kidney-disease-stages-1-5-not-dialysis",
    },
    {
      slug: "knee-replacement-nutrition-diabetes-kidney-questions-surat",
      title: "Nutrition and Kidney Disease, Stages 1-5 (Not on Dialysis)",
      url: "https://www.kidney.org/kidney-topics/nutrition-and-kidney-disease-stages-1-5-not-dialysis",
    },
    {
      slug: "taste-change-nausea-meal-intake-nutrition-chandigarh",
      title: "How to cope with changing food tastes caused by your treatment or condition",
      url: "https://www.royalfree.nhs.uk/patients-and-visitors/patient-information-leaflets/how-to-cope-with-changing-food-tastes-caused-your-treatment-or-condition",
    },
    {
      slug: "copd-exercise-breathlessness-monitoring-noida",
      title: "Quality statement 4: Pulmonary rehabilitation for stable COPD and exercise limitation",
      url: "https://www.nice.org.uk/guidance/qs10/chapter/quality-statement-4-pulmonary-rehabilitation-for-stable-copd-and-exercise-limitation",
    },
  ];

  for (const replacement of replacements) {
    assert.ok(
      sources.some((item) =>
        item.slug === replacement.slug &&
        item.title === replacement.title &&
        item.url === replacement.url
      ),
      `${replacement.slug} should cite its verified current source`,
    );
  }

  const retiredUrls = new Set([
    "https://www.kidney.org/kidney-topics/nutrition-and-kidney-disease",
    "https://www.nhs.uk/conditions/taste-problems/",
    "https://www.nice.org.uk/guidance/qs10/chapter/Quality-statement-3-pulmonary-rehabilitation",
  ]);
  assert.equal(
    sources.some((item) => retiredUrls.has(item.url)),
    false,
    "Journal sources should not retain the three confirmed 404 URLs",
  );
});

test("AAOS citations use canonical publisher URLs instead of redirect aliases", () => {
  const sources = getJournalSources();
  const canonicalUrls = [
    "https://www.orthoinfo.org/recovery/activities-after-hip-replacement/",
    "https://www.orthoinfo.org/recovery/activities-after-knee-replacement/",
    "https://www.orthoinfo.org/recovery/low-back-surgery-exercise-guide/",
    "https://www.orthoinfo.org/recovery/total-knee-replacement-exercise-guide/",
  ];

  for (const url of canonicalUrls) {
    assert.ok(
      sources.some((item) => item.url === url),
      `Journal sources should cite the canonical AAOS page: ${url}`,
    );
  }

  assert.equal(
    sources.some((item) => item.url.startsWith("https://orthoinfo.aaos.org/")),
    false,
    "Journal sources should not retain AAOS redirect aliases",
  );
});
