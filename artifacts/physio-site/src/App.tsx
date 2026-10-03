import { lazy, Suspense, type ComponentType } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/layout";
import { RouteScrollManager } from "@/components/RouteScrollManager";
import { LanguageProvider } from "@/lib/language";
import { serviceGuideRootPaths } from "@/lib/service-guide-map";
import {
  HINDI_CITY_ROUTE_PATTERN,
  hindiStaticRoutePages,
  type HindiStaticPage,
} from "@/lib/hindi-static-route-pages";

// Eagerly loaded (tiny, needed on every page)
import NotFound from "@/pages/not-found";

// Lazily loaded pages — each gets its own JS chunk
const Home = lazy(() => import("@/pages/home"));
const Reviews = lazy(() => import("@/pages/reviews"));
const Booking = lazy(() => import("@/pages/booking"));
const Contact = lazy(() => import("@/pages/contact"));
const About = lazy(() => import("@/pages/about"));
const Feedback = lazy(() => import("@/pages/feedback"));
const BlogList = lazy(() => import("@/pages/blog-list"));
const BlogPost = lazy(() => import("@/pages/blog-post"));
const BlogCategory = lazy(() => import("@/pages/blog-category"));
const HindiHome = lazy(() => import("@/pages/hindi-home"));
const CityPage = lazy(() => import("@/pages/city"));
const Privacy = lazy(() => import("@/pages/privacy"));
const Terms = lazy(() => import("@/pages/terms"));
const Admin = lazy(() => import("@/pages/admin"));
const Cities = lazy(() => import("@/pages/cities"));
const StatePage = lazy(() => import("@/pages/state"));
const ServiceGuide = lazy(() => import("@/pages/service-guide"));
const OnlineCare = lazy(() => import("@/pages/online-care"));
const HindiAboutPage = lazy(() =>
  import("@/pages/hindi-narrative-pages").then((module) => ({
    default: module.HindiAboutPage,
  })),
);
const HindiHomePhysiotherapyPage = lazy(() =>
  import("@/pages/hindi-narrative-pages").then((module) => ({
    default: module.HindiHomePhysiotherapyPage,
  })),
);
const HindiOnlineCarePage = lazy(() =>
  import("@/pages/hindi-narrative-pages").then((module) => ({
    default: module.HindiOnlineCarePage,
  })),
);
const HindiCityPage = lazy(() => import("@/pages/hindi-city"));

const hindiStaticPageComponents: Record<HindiStaticPage, ComponentType> = {
  booking: Booking,
  "online-care": HindiOnlineCarePage,
  contact: Contact,
  about: HindiAboutPage,
  "home-physiotherapy": HindiHomePhysiotherapyPage,
};

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdmin = location === "/admin";

  if (isAdmin) {
    return (
      <Suspense fallback={null}>
        <Admin />
      </Suspense>
    );
  }

  return (
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
          <Route path="/blog" component={BlogList} />
          <Route path="/blog/category/:name" component={BlogCategory} />
          <Route path="/blog/:slug" component={BlogPost} />
          <Route path="/hi" component={HindiHome} />
          {hindiStaticRoutePages.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              component={hindiStaticPageComponents[route.page]}
            />
          ))}
          <Route path={HINDI_CITY_ROUTE_PATTERN} component={HindiCityPage} />
          {serviceGuideRootPaths.map((path) => (
            <Route key={path} path={path} component={ServiceGuide} />
          ))}
          <Route path="/services/:slug" component={ServiceGuide} />
          <Route path="/cities" component={Cities} />
          <Route path="/physiotherapist-at-home/:city" component={CityPage} />
          <Route path="/physiotherapist-at-home-in/:state" component={StatePage} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </Layout>
  );
}

function App() {
  const pathname =
    typeof window === "undefined"
      ? ""
      : window.location.pathname.replace(/\/+$/, "");
  const initialLanguage =
    pathname === "/hi" || pathname.startsWith("/hi/") ? "hi" : "en";

  return (
    <LanguageProvider initialLanguage={initialLanguage}>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <RouteScrollManager />
            <Router />
          </WouterRouter>
        </QueryClientProvider>
      </HelmetProvider>
    </LanguageProvider>
  );
}

export default App;
