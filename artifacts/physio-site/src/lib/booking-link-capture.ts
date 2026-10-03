const SESSION_STORAGE_KEY = "goswami.pending-booking-context";

export function installPendingBookingModeClickCapture(documentRoot: Document) {
  documentRoot.addEventListener(
    "click",
    (event) => {
      if (
        !(event instanceof MouseEvent) ||
        event.button !== 0 ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>(
        "a[data-booking-mode], a[data-booking-city], a[data-booking-locality]",
      );
      if (!link || link.hasAttribute("download")) return;
      if (link.target && link.target.toLowerCase() !== "_self") return;
      if (
        link.origin !== window.location.origin ||
        !["/booking", "/hi/booking"].includes(link.pathname)
      ) {
        return;
      }

      const context = {
        mode: link.dataset.bookingMode,
        citySlug: link.dataset.bookingCity,
        localityId: link.dataset.bookingLocality,
      };
      if (!context.mode && !context.citySlug && !context.localityId) return;
      try {
        window.sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ context, savedAt: Date.now() }),
        );
      } catch {
        // The booking page remains available if session storage is disabled.
      }
    },
    true,
  );
}