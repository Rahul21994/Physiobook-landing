import { test } from "node:test";
import assert from "node:assert/strict";
import { trackEvent } from "./analytics.js";
import { services } from "./data.js";
import { serviceGuideBySlug } from "./service-guides.js";
import { serviceGuideSlugs } from "./service-guide-map.js";

test("service card clicks send only the city slug and theme ID", () => {
  const events: Array<{ name: string; data?: Record<string, string | number | boolean> }> = [];
  const previousWindow = (globalThis as { window?: unknown }).window;

  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      umami: {
        track(name: string, data?: Record<string, string | number | boolean>) {
          events.push({ name, data });
        },
      },
    },
  });

  try {
    trackEvent("service_card_click", { city: "jaipur", theme: "ht" });
    assert.deepEqual(events, [
      {
        name: "service_card_click",
        data: { city: "jaipur", theme: "ht" },
      },
    ]);
  } finally {
    if (previousWindow === undefined) {
      Reflect.deleteProperty(globalThis, "window");
    } else {
      Object.defineProperty(globalThis, "window", {
        configurable: true,
        value: previousWindow,
      });
    }
  }
});

test("every homepage service card resolves to a service guide", () => {
  for (const service of services) {
    const slug = serviceGuideSlugs[service.id];
    assert.ok(slug, `${service.id} should have a guide slug`);
    assert.ok(serviceGuideBySlug[slug], `${service.id} should resolve to ${slug}`);
  }
});