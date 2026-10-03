import { Suspense } from "react";
import { renderToString } from "react-dom/server";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { RouteScrollManager } from "@/components/RouteScrollManager";
import Home from "@/pages/home";
import Reviews from "@/pages/reviews";
import Booking from "@/pages/booking";
import Contact, { HINDI_CONTACT_FAQS } from "@/pages/contact";
import About from "@/pages/about";
import Feedback from "@/pages/feedback";
import BlogList from "@/pages/blog-list";
import BlogPost from "@/pages/blog-post";
import BlogCategory from "@/pages/blog-category";
import HindiHome from "@/pages/hindi-home";
import CityPage from "@/pages/city";
import Cities from "@/pages/cities";
import StatePage from "@/pages/state";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import ServiceGuide from "@/pages/service-guide";
import OnlineCare from "@/pages/online-care";
import {
  HindiAboutPage,
  HindiHomePhysiotherapyPage,
  HindiOnlineCarePage,
} from "@/pages/hindi-narrative-pages";
import HindiCityPage from "@/pages/hindi-city";
import { LanguageProvider } from "@/lib/language";
import { serviceGuideRootPaths } from "@/lib/service-guide-map";
import {
  HINDI_CITY_ROUTE_PATTERN,
  hindiStaticRouteRegistry,
} from "@/lib/hindi-route-registry";
import { setServerBlogPosts } from "./lib/blog-post-runtime";
import { blogPosts } from "./lib/data";

setServerBlogPosts(blogPosts);

export {
  blogPosts,
  BLOG_AUTHOR_PROFILE,
  BLOG_REVIEWER_PROFILE,
  getBlogAuthorProfile,
  getBlogArticleTitle,
  getBlogCatalogValidationErrors,
  getBlogSlugParityErrors,
} from "./lib/data";
export { journalDiscoveryIndex } from "./lib/blog-index";
export {
  cities,
  hasVerifiedHomecareCoverage,
  getCityIndexabilityValidationErrors,
  getIndexableCitySlugs,
  getCitySeoMetadata,
} from "./lib/cities";
export { getCityJournalPosts } from "./lib/city-journal";
export {
  getBookingPageCopy,
  getBookingVariantCatalog,
} from "./lib/booking-index";
export {
  getJournalImagePath,
  getJournalWebpImagePath,
  getJournalCardImagePath,
} from "./components/JournalTileArt";
export {
  states,
  getStateBySlug,
  getCitiesForState,
  getStateSeoDescription,
  isStateIndexable,
} from "./lib/states";
export { serviceGuides } from "./lib/service-guides";
export { getExistingHindiTranslation } from "./lib/language";
export { HINDI_CONTACT_FAQS };
export {
  getHindiCityFaqs,
  getHindiCityRoute,
  hindiCityRoutes,
} from "./lib/hindi-city-routes";
export {
  hindiRouteRegistry,
  hindiStaticRouteRegistry,
  HINDI_CITY_ROUTE_PATTERN,
} from "./lib/hindi-route-registry";

/**
 * Minimal static location hook for SSR.
 * wouter's built-in memoryLocation uses useSyncExternalStore without
 * getServerSnapshot, which React 19's SSR renderer rejects. This hook
 * just returns the URL from a closure — no subscription needed in SSR.
 */
function makeStaticHook(url: string) {
  const queryStart = url.indexOf("?");
  const pathname = queryStart === -1 ? url : url.slice(0, queryStart);
  const search = queryStart === -1 ? "" : url.slice(queryStart + 1).split("#", 1)[0];
  const hook = (): [string, (to: string) => void] => [pathname, () => undefined];
  // wouter inherits searchHook from the location hook when present
  const searchHook = (): string => search;
  return Object.assign(hook, { searchHook });
}

const JSON_LD_SCRIPT = /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi;

function splitHeadMarkup(renderedHtml: string, helmetHead: string) {
  const headScripts = renderedHtml.match(JSON_LD_SCRIPT) ?? [];
  const html = renderedHtml
    .replace(JSON_LD_SCRIPT, "")
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>/gi, "")
    .replace(/<meta\b[^>]*\/?>/gi, "")
    .replace(/<link\b[^>]*\/?>/gi, "");

  return {
    html,
    head: headScripts.length > 0 ? headScripts.join("\n") : helmetHead,
  };
}

export function render(url: string): { html: string; head: string } {
  const queryClient = new QueryClient();
  const helmetContext: Record<string, unknown> = {};
  const pathname = url.split(/[?#]/, 1)[0].replace(/\/+$/, "");
  const initialLanguage =
    pathname === "/hi" || pathname.startsWith("/hi/") ? "hi" : "en";

  const renderedHtml = renderToString(
    <LanguageProvider initialLanguage={initialLanguage}>
      <HelmetProvider context={helmetContext}>
        <QueryClientProvider client={queryClient}>
          <WouterRouter hook={makeStaticHook(url)}>
            <RouteScrollManager />
            <Layout>
              <Suspense fallback={null}>
                <Switch>
                  <Route path="/" component={Home} />
                  <Route path="/reviews" component={Reviews} />
                  <Route path="/booking" component={Booking} />
                  <Route path="/online-care" component={OnlineCare} />
                  <Route path="/contact" component={Contact} />
                  <Route path="/about" component={About} />
                  <Route path="/feedback" component={Feedback} />
                  <Route path="/cities" component={Cities} />
                  <Route path="/blog" component={BlogList} />
                  <Route path="/blog/category/:name" component={BlogCategory} />
                  <Route path="/blog/:slug" component={BlogPost} />
                  <Route path="/hi" component={HindiHome} />
                  {hindiStaticRouteRegistry.map((route) => {
                    const component = {
                      booking: Booking,
                      "online-care": HindiOnlineCarePage,
                      contact: Contact,
                      about: HindiAboutPage,
                      "home-physiotherapy": HindiHomePhysiotherapyPage,
                    }[route.page];
                    return (
                      <Route
                        key={route.path}
                        path={route.path}
                        component={component}
                      />
                    );
                  })}
                  <Route path={HINDI_CITY_ROUTE_PATTERN} component={HindiCityPage} />
                  {serviceGuideRootPaths.map((path) => (
                    <Route key={path} path={path} component={ServiceGuide} />
                  ))}
                  <Route path="/services/:slug" component={ServiceGuide} />
                  <Route path="/physiotherapist-at-home/:city" component={CityPage} />
                  <Route path="/physiotherapist-at-home-in/:state" component={StatePage} />
                  <Route path="/privacy" component={Privacy} />
                  <Route path="/terms" component={Terms} />
                </Switch>
              </Suspense>
            </Layout>
          </WouterRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </LanguageProvider>
  );

  const helmet = helmetContext.helmet as { script?: { toString: () => string } } | undefined;
  return splitHeadMarkup(renderedHtml, helmet?.script?.toString() ?? "");
}

export { homeFaqs } from "./lib/home-faqs";
