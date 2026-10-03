import "./index.css";

type IdleWindow = Window & {
  requestIdleCallback?: (
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
  ) => number;
};

function loadHydrationModule() {
  void import("./hydrate-client").catch((error) => {
    console.error("Client hydration failed to load.", error);
  });
}

function scheduleHydration() {
  const idleWindow = window as IdleWindow;
  if (idleWindow.requestIdleCallback) {
    idleWindow.requestIdleCallback(loadHydrationModule, { timeout: 1500 });
    return;
  }

  window.setTimeout(loadHydrationModule, 0);
}

// Give the browser one paint for the SSR content before loading the hydration
// runtime. The timeout inside requestIdleCallback prevents indefinite delay.
window.requestAnimationFrame(() => {
  window.setTimeout(scheduleHydration, 0);
});
