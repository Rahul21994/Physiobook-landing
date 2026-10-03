"use strict";

(() => {
  let loaded = false;
  const IDLE_LOAD_DELAY_MS = 12000;

  function loadGtm() {
    if (loaded) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      "gtm.start": Date.now(),
      event: "gtm.js",
    });

    const gtmScript = document.createElement("script");
    gtmScript.async = true;
    gtmScript.src = "https://www.googletagmanager.com/gtm.js?id=GTM-KVDF36QN";
    document.head.appendChild(gtmScript);
  }

  for (const eventName of ["pointerdown", "keydown", "touchstart", "scroll"]) {
    window.addEventListener(eventName, loadGtm, { once: true, passive: true });
  }

  function scheduleIdleLoad() {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(
        () => window.setTimeout(loadGtm, IDLE_LOAD_DELAY_MS),
        { timeout: 4000 },
      );
    } else {
      window.setTimeout(loadGtm, IDLE_LOAD_DELAY_MS + 4000);
    }
  }

  if (document.readyState === "complete") {
    scheduleIdleLoad();
  } else {
    window.addEventListener("load", scheduleIdleLoad, { once: true });
  }
})();