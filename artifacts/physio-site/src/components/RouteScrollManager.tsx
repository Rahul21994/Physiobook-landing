import { useEffect } from "react";
import { useLocation } from "wouter";

export function RouteScrollManager() {
  const [location] = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    let frameId: number | null = null;
    let timeoutId: number | null = null;
    const resetScroll = () => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };
    const scrollToHashTarget = () => {
      const hash = window.location.hash.slice(1);
      if (!hash) {
        resetScroll();
        return;
      }

      let targetId: string;
      try {
        targetId = decodeURIComponent(hash);
      } catch {
        resetScroll();
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) {
        resetScroll();
        return;
      }

      const headerOffset =
        document.querySelector("header")?.getBoundingClientRect().height ?? 0;
      const top =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset -
        12;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
    };
    const resetRouteScroll = () => {
      // Fragment scrolling can run before React hydrates the server-rendered
      // page. Re-apply the target after the browser and layout have settled.
      if (!window.location.hash) {
        resetScroll();
        return;
      }

      scrollToHashTarget();
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        scrollToHashTarget();
        timeoutId = window.setTimeout(() => {
          timeoutId = null;
          scrollToHashTarget();
        }, 50);
      });
    };

    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    resetRouteScroll();
    window.addEventListener("hashchange", resetRouteScroll);

    return () => {
      window.history.scrollRestoration = previousRestoration;
      window.removeEventListener("hashchange", resetRouteScroll);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [location]);

  return null;
}