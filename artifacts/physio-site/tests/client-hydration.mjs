import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const bootstrapSource = await readFile(
  new URL("../src/main.tsx", import.meta.url),
  "utf8",
);
const hydrationSource = await readFile(
  new URL("../src/hydrate-client.tsx", import.meta.url),
  "utf8",
);

assert.doesNotMatch(
  bootstrapSource,
  /(?:from|import\s*\()\s*["']react-dom\/client["']/,
  "The initial client bootstrap must not statically load react-dom/client.",
);
assert.match(
  bootstrapSource,
  /requestAnimationFrame/,
  "Hydration must wait until after the first animation frame.",
);
assert.match(
  bootstrapSource,
  /requestIdleCallback/,
  "Hydration must be scheduled during browser idle time when supported.",
);
assert.match(
  bootstrapSource,
  /timeout:\s*1500/,
  "Idle hydration must have a bounded fallback timeout.",
);
assert.match(
  bootstrapSource,
  /import\(["']\.\/hydrate-client["']\)/,
  "The hydration runtime must load through a dynamic import.",
);
assert.match(
  hydrationSource,
  /from ["']react-dom\/client["']/,
  "The deferred hydration module must own the react-dom/client import.",
);
assert.match(
  hydrationSource,
  /hydrateRoot\(rootElement/,
  "SSR output must continue to hydrate.",
);
assert.match(
  hydrationSource,
  /createRoot\(rootElement\)/,
  "The empty-root client-render fallback must remain available.",
);

console.log("Client hydration checks passed: hydration runtime is deferred until idle time.");