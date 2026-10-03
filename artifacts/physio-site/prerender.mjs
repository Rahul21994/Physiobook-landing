/**
 * Post-build prerender: injects route-specific metadata and structured data
 * into static HTML copies. Runs after `vite build` so social crawlers and
 * non-JS bots receive correct title/description/OG/JSON-LD per route.
 */

import fs from "fs";
import path from "path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "url";
import { normalizeMetaDescription } from "./scripts/meta-description.mjs";
import { getAuditedNoindexBlogSlugs } from "./scripts/blog-audit.mjs";
import { BUSINESS_CONFIG, BUSINESS_SCHEMA_SAME_AS } from "./src/config/business.ts";
import {
  CONTACT_FAQS,
  CONTACT_PAGE_DESCRIPTION,
} from "./src/lib/contact-page-content.ts";
import { pricing } from "./src/lib/pricing.ts";
import serviceGuideRouteData from "./src/lib/service-guide-routes.json" with { type: "json" };

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist/public");
const indexHtml = fs.readFileSync(path.join(distDir, "index.html"), "utf8");
const assetDir = path.join(distDir, "assets");
const viteManifest = JSON.parse(
  fs.readFileSync(path.join(distDir, "manifest.json"), "utf8"),
);

function findStylesheet(stem) {
  const filename = fs.readdirSync(assetDir).find(
    (candidate) =>
      candidate.endsWith(".css") &&
      (candidate === `${stem}.css` || candidate.startsWith(`${stem}-`)),
  );
  if (!filename) {
    throw new Error(`Could not find the ${stem} route stylesheet in ${assetDir}`);
  }
  return `/assets/${filename}`;
}

function findEntryStylesheet(entry) {
  const asset = viteManifest[entry]?.css?.find((filename) => filename.endsWith(".css"));
  if (!asset) {
    throw new Error(`Could not find a route stylesheet for ${entry} in the Vite manifest.`);
  }
  const assetPath = path.join(distDir, asset);
  if (!fs.existsSync(assetPath) || fs.statSync(assetPath).size === 0) {
    throw new Error(`The route stylesheet for ${entry} is missing or empty: ${asset}`);
  }
  return `/${asset.replace(/^\/+/, "")}`;
}

const ROUTE_STYLESHEETS = {
  journal: findStylesheet("journal"),
  legal: findStylesheet("legal"),
  "hindi-city": findEntryStylesheet("src/pages/hindi-city/index.tsx"),
  "hindi-static": findEntryStylesheet("src/pages/hindi-narrative-pages.tsx"),
};

// SSR bundle built by vite.ssr.config.ts — renders the React tree to HTML for each route
const {
  render,
  homeFaqs,
  blogPosts,
  BLOG_AUTHOR_PROFILE,
  BLOG_REVIEWER_PROFILE,
  getBlogAuthorProfile,
  getBlogArticleTitle,
  getBlogCatalogValidationErrors,
  getBlogSlugParityErrors,
  cities,
  getCityIndexabilityValidationErrors,
  getIndexableCitySlugs,
  hasVerifiedHomecareCoverage,
  getCitySeoMetadata,
  getCityJournalPosts,
  getJournalImagePath,
  getJournalWebpImagePath,
  getJournalCardImagePath,
  states,
  getCitiesForState,
  getStateSeoDescription,
  isStateIndexable,
  serviceGuides,
  getBookingVariantCatalog,
  getExistingHindiTranslation,
  hindiRouteRegistry,
  hindiStaticRouteRegistry,
  hindiCityRoutes,
  getHindiCityFaqs,
  HINDI_CONTACT_FAQS,
} = await import("./dist/server/entry-server.js");

const BASE_URL = BUSINESS_CONFIG.siteUrl;
const BASE_ORIGIN = new URL(BASE_URL).origin;
const sortedBlogPosts = [...blogPosts].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
const blogAuditPath = path.resolve(__dirname, "../../blog_audit.csv");
const noindexBlogSlugs = getAuditedNoindexBlogSlugs(
  fs.readFileSync(blogAuditPath, "utf8"),
  blogPosts,
);
const cityGuideRedirects = new Map();
for (const post of blogPosts.filter((candidate) => candidate.id.startsWith("city-guide-"))) {
  const candidateCitySlug = post.id.slice("city-guide-".length);
  const city = cities.find((candidate) => candidate.slug === candidateCitySlug);
  if (!city) {
    throw new Error(
      `Generated city guide "${post.slug}" has no matching city route for ${candidateCitySlug}.`,
    );
  }
  cityGuideRedirects.set(
    `/blog/${post.slug}`,
    `/physiotherapist-at-home/${city.slug}`,
  );
}

for (const [legacyCitySlug, citySlug] of [
  ["faridabad", "faridabad"],
  ["gurugram", "gurgaon"],
  ["moradabad", "moradabad"],
  ["tigaon", "tigaon"],
]) {
  const city = cities.find((candidate) => candidate.slug === citySlug);
  if (!city) {
    throw new Error(`Legacy city guide "${legacyCitySlug}" has no matching city route.`);
  }
  cityGuideRedirects.set(
    `/blog/physiotherapist-at-home-${legacyCitySlug}`,
    `/physiotherapist-at-home/${city.slug}`,
  );
}

if (cityGuideRedirects.size !== 37) {
  throw new Error(
    `Expected 37 retired city-guide redirects, found ${cityGuideRedirects.size}.`,
  );
}
const cityGuideRedirectPaths = new Set(cityGuideRedirects.keys());
const retainedBlogPosts = blogPosts.filter(
  (post) => !cityGuideRedirectPaths.has(`/blog/${post.slug}`),
);
const retainedCityGuidePaths = retainedBlogPosts
  .filter(
    (post) =>
      post.category === "City Guide" &&
      !noindexBlogSlugs.has(post.slug),
  )
  .map((post) => `/blog/${post.slug}`);
const indexableBlogPosts = retainedBlogPosts.filter((post) => !noindexBlogSlugs.has(post.slug));
if (retainedCityGuidePaths.some((routePath) => cityGuideRedirectPaths.has(routePath))) {
  throw new Error("A retained city-guide URL cannot also be redirected.");
}
const ORG_ID = `${BASE_URL}/#organization`;
const LOGO_URL = `${BASE_URL}/favicon.svg`;
const BUSINESS_PHONE_E164 = BUSINESS_CONFIG.contact.phone
  ? `+${BUSINESS_CONFIG.contact.phone.replace(/\D/g, "")}`
  : undefined;
const logoSvg = fs.readFileSync(path.join(distDir, "favicon.svg"), "utf8");
function readSvgDimension(attribute) {
  const match = logoSvg.match(
    new RegExp(`<svg\\b[^>]*\\b${attribute}="([0-9]+(?:\\.[0-9]+)?)"`),
  );
  if (!match) {
    throw new Error(`favicon.svg is missing its ${attribute} dimension`);
  }
  return Number(match[1]);
}
const LOGO_DIMENSIONS = {
  width: readSvgDimension("width"),
  height: readSvgDimension("height"),
};
const STRUCTURED_DATA_MARKER = "<!-- PRERENDER_STRUCTURED_DATA -->";
const JSON_LD_SCRIPT = /<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi;
const CITY_RICH_SCHEMA_TYPES = ["Service", "FAQPage", "BreadcrumbList"];
const STATE_RICH_SCHEMA_TYPES = ["Service", "FAQPage", "BreadcrumbList"];
const METADATA_LIMITS = {
  title: 65,
  description: 160,
};
const cityIndexabilityErrors = getCityIndexabilityValidationErrors(cities);
if (cityIndexabilityErrors.length > 0) {
  throw new Error(`City indexability validation failed:\n- ${cityIndexabilityErrors.join("\n- ")}`);
}
const INDEXABLE_CITY_SLUGS = new Set(getIndexableCitySlugs(cities));
const incompleteStateProfiles = states.filter((state) => !isStateIndexable(state));
if (incompleteStateProfiles.length > 0) {
  throw new Error(
    `Authored state pages must all be indexable. Complete these state profiles:\n- ${
      incompleteStateProfiles.map((state) => state.name).join("\n- ")
    }`,
  );
}
const bookingVariants = getBookingVariantCatalog();
const bookingVariantRoutes = bookingVariants.map((variant) => {
  const canonical = `${BASE_URL}/booking`;
  return {
    path: variant.path,
    outDir: variant.outDir,
    title: variant.title,
    description: variant.description,
    ogTitle: variant.title,
    ogDescription: variant.description,
    canonical,
    ogUrl: canonical,
    indexable: false,
    suppressBreadcrumbSchema: true,
    bookingVariantSearch: variant.query,
    bookingVariantHeading: variant.heading,
    bookingVariantMode: variant.mode,
    bookingVariantCitySlug: variant.citySlug,
    bookingVariantCityName: variant.cityName,
    bookingVariantLocalityId: variant.localityId,
    bookingVariantLocalityName: variant.localityName,
  };
});
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": homeFaqs.map(({ q, a }) => ({
    "@type": "Question",
    "name": q,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": a,
    },
  })),
};

const CANONICAL_ORGANIZATION = {
  "@type": "Organization",
  "@id": ORG_ID,
  "name": BUSINESS_CONFIG.name,
  "url": BASE_URL,
  "logo": LOGO_URL,
  "image": `${BASE_URL}/opengraph.jpg`,
  "description": `${BUSINESS_CONFIG.name} provides physiotherapy, rehabilitation, and online consultations. ${BUSINESS_CONFIG.headOffice.description}; the head office is not a patient clinic or walk-in location. ${BUSINESS_CONFIG.availability.online}. ${BUSINESS_CONFIG.availability.inPerson}.`,
  ...(BUSINESS_PHONE_E164 ? { "telephone": BUSINESS_PHONE_E164 } : {}),
  ...(BUSINESS_CONFIG.contact.email ? { "email": BUSINESS_CONFIG.contact.email } : {}),
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Homecare Physiotherapy Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Homecare Physiotherapy", "serviceType": "Physiotherapy" },
        "price": "1125", "priceCurrency": "INR",
        "priceSpecification": { "@type": "UnitPriceSpecification", "price": "1125", "priceCurrency": "INR", "unitText": "session" }
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Cardiopulmonary Rehabilitation", "serviceType": "Cardiopulmonary Rehabilitation" }
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Advanced Complex Case Recovery", "serviceType": "Neurological Rehabilitation" }
      },
      {
        "@type": "Offer",
        "itemOffered": { "@type": "Service", "name": "Online Telehealth Physiotherapy", "serviceType": "Telehealth" },
        "price": "742", "priceCurrency": "INR",
        "priceSpecification": { "@type": "UnitPriceSpecification", "price": "742", "priceCurrency": "INR", "unitText": "session" }
      }
    ]
  },
  "sameAs": BUSINESS_SCHEMA_SAME_AS
};

const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@graph": [
    CANONICAL_ORGANIZATION,
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "Goswami Rehab",
      "description": "Homecare physiotherapy and online consultations in 45 listed Indian cities, with exact-locality and clinician availability confirmed before home visits.",
      "publisher": { "@id": ORG_ID },
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${BASE_URL}/blog?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    }
  ]
};

const AUTHOR_ID = `${BASE_URL}/about#rahul-goswami`;
const AUTHOR_ENTITY = {
  "@type": "Person",
  "@id": AUTHOR_ID,
  "name": BLOG_AUTHOR_PROFILE.name,
  "jobTitle": BLOG_AUTHOR_PROFILE.role,
  "hasOccupation": {
    "@type": "Occupation",
    "name": BLOG_AUTHOR_PROFILE.credential,
  },
  "worksFor": { "@id": ORG_ID },
  "url": `${BASE_URL}/about`,
};
const REVIEWER_ENTITY = {
  "@type": "Person",
  "@id": `${BASE_URL}/about#prakriti-sharma`,
  "name": BLOG_REVIEWER_PROFILE.name,
};
const AUTHOR_SCHEMA = {
  "@context": "https://schema.org",
  ...AUTHOR_ENTITY,
};

const ABOUT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${BASE_URL}/about#webpage`,
  "url": `${BASE_URL}/about`,
  "name": "About Dr. Rahul Goswami and Goswami Rehab",
  "about": { "@id": AUTHOR_ID },
  "isPartOf": { "@id": `${BASE_URL}/#website` },
  "mainEntity": { "@id": AUTHOR_ID },
};

const JOURNAL_WEBPAGE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${BASE_URL}/blog#webpage`,
  "url": `${BASE_URL}/blog`,
  "name": "Physiotherapy & Rehabilitation Journal",
  "isPartOf": { "@id": `${BASE_URL}/#website` },
  "mainEntity": { "@id": `${BASE_URL}/blog#collection` },
};

const routes = [
  {
    path: "/",
    outDir: "",
    title: "Home Physiotherapy Across India | Goswami Rehab",
    description:
      "Book home physiotherapy in India for stroke, post-surgery, neurological, cardiopulmonary rehabilitation. Request care by sharing your location and needs.",
    ogTitle: "Home Physiotherapy & Rehabilitation Across India | Goswami Rehab",
    ogDescription:
      "Book home physiotherapy in India for stroke, post-surgery, neurological, cardiopulmonary rehabilitation. Request care by sharing your location and needs.",
    canonical: `${BASE_URL}/`,
    ogUrl: `${BASE_URL}/`,
    hreflangAlternates: {
      "en-IN": `${BASE_URL}/`,
      "hi-IN": `${BASE_URL}/hi`,
      "x-default": `${BASE_URL}/`,
    },
    faqSchema: FAQ_SCHEMA,
    organizationSchema: ORGANIZATION_SCHEMA,
     breadcrumbSchema: {
       "@context": "https://schema.org",
       "@type": "BreadcrumbList",
       "itemListElement": [
         { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` },
       ],
     },
     serviceSchema: {
       "@context": "https://schema.org",
       "@type": "Service",
       "@id": `${BASE_URL}/#home-physiotherapy`,
       "name": "Home Physiotherapy Across India",
       "url": `${BASE_URL}/`,
       "provider": { "@id": ORG_ID },
       "areaServed": { "@type": "Country", "name": "India" },
       "serviceType": "Home Physiotherapy",
     },
  },
  {
    path: "/booking",
    outDir: "booking",
    title: "Request Home or Online Physiotherapy | Goswami Rehab",
    description:
      "Request a home physiotherapy visit or online consultation. Share your location, preferred timing, and care needs so our team can confirm your appointment.",
    ogTitle: "Request Home or Online Physiotherapy | Goswami Rehab",
    ogDescription:
      "Request a home physiotherapy visit or online consultation. Share your location, preferred timing, and care needs so our team can confirm your appointment.",
    canonical: `${BASE_URL}/booking`,
    ogUrl: `${BASE_URL}/booking`,
  },
  ...bookingVariantRoutes,
  {
    path: "/online-care",
    outDir: "online-care",
    title: "Online Physiotherapy Consultation | Goswami Rehab",
    description:
      "Online physiotherapy consultation for movement assessment, personalised exercise, rehabilitation planning, and progress support through video sessions.",
    ogTitle: "Online Physiotherapy Consultation | Goswami Rehab",
    ogDescription:
      "Online physiotherapy consultation for movement assessment, personalised exercise, rehabilitation planning, and progress support through video sessions.",
    canonical: `${BASE_URL}/online-care`,
    ogUrl: `${BASE_URL}/online-care`,
    serviceSchema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${BASE_URL}/online-care#service`,
      "name": "Online Physiotherapy Consultation",
      "description":
        "Remote physiotherapy consultation for movement assessment, exercise guidance, rehabilitation planning, and progress support.",
      "url": `${BASE_URL}/online-care`,
      "provider": { "@id": ORG_ID },
      "areaServed": { "@type": "Place", "name": "Worldwide" },
      "serviceType": "Telehealth physiotherapy consultation",
      "offers": {
        "@type": "Offer",
        "price": "742",
        "priceCurrency": "INR",
        "description": "Introductory price per online consultation",
      },
    },
  },
  {
    path: "/contact",
    outDir: "contact",
    title: "Contact Goswami Rehab | Consultation Requests",
    description: CONTACT_PAGE_DESCRIPTION,
    ogTitle: "Contact Goswami Rehab | Consultation Requests",
    ogDescription: CONTACT_PAGE_DESCRIPTION,
    canonical: `${BASE_URL}/contact`,
    ogUrl: `${BASE_URL}/contact`,
    webPageSchema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": `${BASE_URL}/contact#webpage`,
      "url": `${BASE_URL}/contact`,
      "name": "Contact Goswami Rehab",
      "isPartOf": { "@id": `${BASE_URL}/#website` },
      "about": { "@id": ORG_ID },
      "mainEntity": { "@id": ORG_ID },
    },
    faqSchema: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": CONTACT_FAQS.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a },
      })),
    },
  },
  {
    path: "/about",
    outDir: "about",
    title: "About Dr. Rahul Goswami | Goswami Rehab",
    description:
      "Meet Dr. Rahul Goswami, PT, Exercise Physiologist and Nutritionist (IIM Madras). Learn about Goswami Rehab and its home physiotherapy approach in India.",
    ogTitle: "About Dr. Rahul Goswami | Goswami Rehab",
    ogDescription:
      "Meet Dr. Rahul Goswami, PT, Exercise Physiologist and Nutritionist (IIM Madras). Learn about Goswami Rehab and its home physiotherapy approach in India.",
    canonical: `${BASE_URL}/about`,
    ogUrl: `${BASE_URL}/about`,
    organizationSchema: ORGANIZATION_SCHEMA,
    aboutSchema: ABOUT_SCHEMA,
    authorSchema: AUTHOR_SCHEMA,
  },
  {
    path: "/feedback",
    outDir: "feedback",
    indexable: false,
    suppressBreadcrumbSchema: true,
    title: "Share Your Feedback | Goswami Rehab",
    description:
      "Share your experience with Goswami Rehab homecare physiotherapy. Send private feedback to our team or optionally leave a Google review about your care.",
    ogTitle: "Share Your Feedback | Goswami Rehab",
    ogDescription:
      "Share your experience with Goswami Rehab homecare physiotherapy. Send private feedback to our team or optionally leave a Google review about your care.",
    canonical: `${BASE_URL}/feedback`,
    ogUrl: `${BASE_URL}/feedback`,
  },
  {
    path: "/reviews",
    outDir: "reviews",
    title: "Patient Reviews | Goswami Rehab",
    description:
      "Read written experiences from Goswami Rehab home physiotherapy and rehabilitation services across India, covering communication, visits, and care support.",
    ogTitle: "Patient Reviews | Goswami Rehab",
    ogDescription:
      "Read written experiences from Goswami Rehab home physiotherapy and rehabilitation services across India, covering communication, visits, and care support.",
    canonical: `${BASE_URL}/reviews`,
    ogUrl: `${BASE_URL}/reviews`,
  },
  {
    path: "/admin",
    outDir: "admin",
    title: "Admin Dashboard | Goswami Rehab",
    description: "Secure administration dashboard for Goswami Rehab staff to review operational information and manage authorized internal workflows safely and privately.",
    ogTitle: "Admin Dashboard | Goswami Rehab",
    ogDescription: "Secure administration dashboard for Goswami Rehab staff to review operational information and manage authorized internal workflows safely and privately.",
    canonical: `${BASE_URL}/admin`,
    ogUrl: `${BASE_URL}/admin`,
    indexable: false,
    clientOnly: true,
  },
  {
    path: "/cities",
    outDir: "cities",
    title: "Cities We Serve | Goswami Rehab",
    description:
      "Find home physiotherapy in 40+ Indian cities. Browse locations, review care options, and request a specialist rehabilitation session near you online today.",
    ogTitle: "Cities We Serve | Goswami Rehab",
    ogDescription:
      "Find home physiotherapy in 40+ Indian cities. Browse locations, review care options, and request a specialist rehabilitation session near you online today.",
    canonical: `${BASE_URL}/cities`,
    ogUrl: `${BASE_URL}/cities`,
  },
  {
    path: "/blog",
    outDir: "blog",
    title: "Physiotherapy & Rehabilitation Journal | Goswami Rehab",
    description:
      "Practical physiotherapy guides on stroke, joint recovery, pain, breathing, and homecare rehabilitation from Goswami Rehab’s clinical team and authors.",
    ogTitle: "Physiotherapy & Rehabilitation Journal | Goswami Rehab",
    ogDescription:
      "Practical physiotherapy guides on stroke, joint recovery, pain, breathing, and homecare rehabilitation from Goswami Rehab’s clinical team and authors.",
    canonical: `${BASE_URL}/blog`,
    ogUrl: `${BASE_URL}/blog`,
    preloadImage: getJournalCardImagePath(sortedBlogPosts[0].slug),
    stylesheets: ["journal"],
    webPageSchema: JOURNAL_WEBPAGE_SCHEMA,
    collectionSchema: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${BASE_URL}/blog#collection`,
      "name": "Physiotherapy & Rehabilitation Journal",
      "url": `${BASE_URL}/blog`,
      "mainEntity": {
        "@type": "ItemList",
        "itemListElement": blogPosts.map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "url": `${BASE_URL}/blog/${post.slug}`,
          "name": post.title,
        })),
      },
    },
  },
  {
    path: "/privacy",
    outDir: "privacy",
    title: "Privacy Policy | Goswami Rehab",
    description:
      "Read Goswami Rehab’s Privacy Policy covering how we collect, use, store, and protect information shared for home physiotherapy enquiries and bookings.",
    ogTitle: "Privacy Policy | Goswami Rehab",
    ogDescription:
      "Read Goswami Rehab’s Privacy Policy covering how we collect, use, store, and protect information shared for home physiotherapy enquiries and bookings.",
    canonical: `${BASE_URL}/privacy`,
    ogUrl: `${BASE_URL}/privacy`,
    stylesheets: ["legal"],
  },
  {
    path: "/terms",
    outDir: "terms",
    title: "Terms & Conditions | Goswami Rehab",
    description:
      "Review the Goswami Rehab terms for home physiotherapy bookings, payments, cancellations, safety, patient experiences, privacy, communication expectations.",
    ogTitle: "Terms & Conditions | Goswami Rehab",
    ogDescription:
      "Review the Goswami Rehab terms for home physiotherapy bookings, payments, cancellations, safety, patient experiences, privacy, communication expectations.",
    canonical: `${BASE_URL}/terms`,
    ogUrl: `${BASE_URL}/terms`,
    stylesheets: ["legal"],
  },
  ...blogPosts.map((post) => ({
    path: `/blog/${post.slug}`,
    outDir: `blog/${post.slug}`,
    title: post.metaTitle,
    description: post.metaDescription,
    ogTitle: post.metaTitle,
    ogDescription: post.metaDescription,
    canonical: `${BASE_URL}/blog/${post.slug}`,
    ogUrl: `${BASE_URL}/blog/${post.slug}`,
    ogType: "article",
    stylesheets: ["journal"],
    preloadImage: getJournalWebpImagePath(post.slug, post.image),
    socialImage: new URL(getJournalImagePath(post.slug, post.image), BASE_URL).href,
    socialImageAlt: `Representative editorial image for ${getBlogArticleTitle(post)}`,
    socialImageWidth: "1024",
    socialImageHeight: "1024",
    blogPost: post,
    indexable:
      !noindexBlogSlugs.has(post.slug) &&
      !cityGuideRedirectPaths.has(`/blog/${post.slug}`),
  })),
  ...serviceGuides.map((guide) => {
    const title = guide.metaTitle ?? `${guide.shortTitle} | Goswami Rehab`;
    const description = guide.metaDescription ?? guide.summary;
    const servicePath = guide.routePath ?? `/services/${guide.slug}`;
    const namedServiceAreas = BUSINESS_CONFIG.serviceAreaProfiles
      .map((profile) => profile.areaName.trim())
      .filter(Boolean);
    const areaServed = namedServiceAreas.length
      ? namedServiceAreas.map((name) => ({ "@type": "AdministrativeArea", name }))
      : [{ "@type": "Country", "name": "India" }];
    return {
      path: servicePath,
      outDir: servicePath.slice(1),
      title,
      description,
      ogTitle: title,
      ogDescription: description,
      canonical: `${BASE_URL}${servicePath}`,
      ogUrl: `${BASE_URL}${servicePath}`,
      breadcrumbParent: guide.breadcrumbParent,
      breadcrumbName: guide.shortTitle,
      serviceSchema: {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${BASE_URL}${servicePath}#service`,
        "name": guide.title,
        "description": description,
        "url": `${BASE_URL}${servicePath}`,
        "provider": { "@id": ORG_ID },
        "areaServed": areaServed.length === 1 ? areaServed[0] : areaServed,
        "serviceType": guide.title,
      },
      ...(guide.editorial?.faqs.length
        ? {
            faqSchema: {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": guide.editorial.faqs.map(({ question, answer }) => ({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": { "@type": "Answer", "text": answer },
              })),
            },
          }
        : {}),
    };
  }),

  // City landing pages — one prerendered HTML file per city so Google indexes
  // exact-match searches like "physiotherapist at home in jaipur / faridabad / delhi".
  ...(() => {
    const cityConditions = {
      jaipur:           "Stroke Rehabilitation, Knee Replacement Rehabilitation, Parkinson's Physiotherapy, COPD & Pulmonary Rehabilitation, and Post-Surgery Rehabilitation",
      delhi:            "Stroke Rehabilitation, Neurological Physiotherapy, Knee Replacement Rehabilitation, Hip Replacement Rehabilitation, and Cardiopulmonary Rehabilitation",
      noida:            "Post-Surgery Rehabilitation, Spinal Physiotherapy, Stroke Rehabilitation, COPD & Pulmonary Rehabilitation, and Neurological Rehabilitation",
      gurgaon:          "Sports Injury Physiotherapy, Knee Replacement Rehabilitation, Hip Replacement Rehabilitation, Stroke Rehabilitation, and Post-ICU Rehabilitation",
      faridabad:        "Post-Surgery Rehabilitation, Neurological Rehabilitation, Stroke Rehabilitation, COPD & Pulmonary Rehabilitation, and Joint Replacement Rehabilitation",
      chandigarh:       "Stroke Rehabilitation, Post-Surgery Rehabilitation, Parkinson's Physiotherapy, Orthopaedic Rehabilitation, and Cardiopulmonary Rehabilitation",
      amritsar:         "Post-Surgery Rehabilitation, Neurological Rehabilitation, Stroke Rehabilitation, COPD & Pulmonary Rehabilitation, and Geriatric Physiotherapy",
      ludhiana:         "Post-Surgery Rehabilitation, Knee Replacement Rehabilitation, Stroke Rehabilitation, Spinal Cord Injury Rehabilitation, and Guillain-Barré Rehabilitation",
      bengaluru:        "Stroke Rehabilitation, Neurological Physiotherapy, Post-Surgery Rehabilitation, Sports Injury Physiotherapy, and Cardiopulmonary Rehabilitation",
      mumbai:           "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Rehabilitation, Cardiac Rehabilitation, and Guillain-Barré Rehabilitation",
      pune:             "Post-Surgery Rehabilitation, Neurological Rehabilitation, Stroke Rehabilitation, Sports Injury Physiotherapy, and COPD & Pulmonary Rehabilitation",
      hyderabad:        "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Physiotherapy, Cardiopulmonary Rehabilitation, and Guillain-Barré Rehabilitation",
      kochi:            "Neurological Physiotherapy, Stroke Rehabilitation, Post-Surgery Rehabilitation, COPD & Pulmonary Rehabilitation, and Geriatric Rehabilitation",
      thiruvananthapuram:"Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, Parkinson's Physiotherapy, and Cardiopulmonary Rehabilitation",
      kozhikode:        "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Physiotherapy, Geriatric Rehabilitation, and COPD & Pulmonary Rehabilitation",
      visakhapatnam:    "Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, Cardiopulmonary Rehabilitation, and Guillain-Barré Rehabilitation",
      nagpur:           "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Physiotherapy, COPD & Pulmonary Rehabilitation, and Geriatric Physiotherapy",
      guwahati:         "Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, Guillain-Barré Rehabilitation, and Geriatric Physiotherapy",
      kolkata:          "Stroke Rehabilitation, Neurological Physiotherapy, Post-Surgery Rehabilitation, Cardiopulmonary Rehabilitation, and Guillain-Barré Rehabilitation",
      chennai:          "Stroke Rehabilitation, Neurological Physiotherapy, Post-Surgery Rehabilitation, Cardiopulmonary Rehabilitation, and Knee Replacement Rehabilitation",
      coimbatore:       "Stroke Rehabilitation, Neurological Physiotherapy, Post-Surgery Rehabilitation, Knee Replacement Rehabilitation, and COPD & Pulmonary Rehabilitation",
      madurai:          "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Rehabilitation, Geriatric Physiotherapy, and Orthopaedic Rehabilitation",
      mysuru:           "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Rehabilitation, Parkinson's Physiotherapy, and Geriatric Rehabilitation",
      mangaluru:        "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Physiotherapy, Geriatric Rehabilitation, and COPD & Pulmonary Rehabilitation",
      ahmedabad:        "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Physiotherapy, Cardiac Rehabilitation, and Orthopaedic Rehabilitation",
      surat:            "Post-Surgery Rehabilitation, Stroke Rehabilitation, Knee Replacement Rehabilitation, Neurological Rehabilitation, and COPD & Pulmonary Rehabilitation",
      vadodara:         "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Rehabilitation, Orthopaedic Rehabilitation, and Geriatric Physiotherapy",
      lucknow:          "Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, Knee Replacement Rehabilitation, and Cardiopulmonary Rehabilitation",
      kanpur:           "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Rehabilitation, COPD & Pulmonary Rehabilitation, and Geriatric Physiotherapy",
      varanasi:         "Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, Geriatric Physiotherapy, and COPD & Pulmonary Rehabilitation",
      agra:             "Post-Surgery Rehabilitation, Stroke Rehabilitation, Knee Replacement Rehabilitation, Neurological Rehabilitation, and Geriatric Physiotherapy",
      prayagraj:        "Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, Geriatric Physiotherapy, and COPD & Pulmonary Rehabilitation",
      jodhpur:          "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Physiotherapy, COPD & Pulmonary Rehabilitation, and Orthopaedic Rehabilitation",
      udaipur:          "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Rehabilitation, Geriatric Physiotherapy, and Knee Replacement Rehabilitation",
      ajmer:            "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Rehabilitation, Geriatric Physiotherapy, and COPD & Pulmonary Rehabilitation",
      bhopal:           "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Rehabilitation, COPD & Pulmonary Rehabilitation, and Knee Replacement Rehabilitation",
      indore:           "Post-Surgery Rehabilitation, Stroke Rehabilitation, Neurological Physiotherapy, Cardiopulmonary Rehabilitation, and Geriatric Rehabilitation",
      patna:            "Stroke Rehabilitation, Neurological Rehabilitation, Post-Surgery Rehabilitation, COPD & Pulmonary Rehabilitation, and Geriatric Physiotherapy",
      ranchi:           "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Rehabilitation, Orthopaedic Rehabilitation, and Geriatric Physiotherapy",
      bhubaneswar:      "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Physiotherapy, COPD & Pulmonary Rehabilitation, and Geriatric Rehabilitation",
      dehradun:         "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Rehabilitation, COPD & Pulmonary Rehabilitation, and Geriatric Physiotherapy",
      haridwar:         "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Physiotherapy, Geriatric Rehabilitation, and Orthopaedic Rehabilitation",
      jammu:            "Stroke Rehabilitation, Post-Surgery Rehabilitation, Neurological Rehabilitation, Orthopaedic Rehabilitation, and Cardiopulmonary Rehabilitation",
    };
    const normalizeRehabilitationCopy = (text) => text
      .replace(/\bknee replacement(?: recovery)?(?! rehabilitation)\b/gi, "Knee Replacement Rehabilitation")
      .replace(/\bhip replacement(?: recovery)?(?! rehabilitation)\b/gi, "Hip Replacement Rehabilitation")
      .replace(/\bjoint replacement recovery\b/gi, "Joint Replacement Rehabilitation")
      .replace(/\bpost-surgery (?:recovery|rehab|physiotherapy|care)\b/gi, "Post-Surgery Rehabilitation")
      .replace(/\bpost-ICU physiotherapy\b/gi, "Post-ICU Rehabilitation")
      .replace(/\bParkinson's disease\b/gi, "Parkinson's Physiotherapy")
      .replace(/\bsports injuries?\b/gi, "Sports Injury Physiotherapy")
      .replace(/\bneuro rehabilitation\b/gi, "Neurological Rehabilitation")
      .replace(/\bneuro rehab\b/gi, "Neurological Rehabilitation")
      .replace(/\bneuro physiotherapy\b/gi, "Neurological Physiotherapy")
      .replace(/\bstroke recovery\b/gi, "Stroke Rehabilitation")
      .replace(/\bstroke rehab\b/gi, "Stroke Rehabilitation")
      .replace(/\bcardiopulmonary rehab\b/gi, "Cardiopulmonary Rehabilitation")
      .replace(/\bcardiac rehab\b/gi, "Cardiac Rehabilitation")
      .replace(/\bCOPD pulmonary rehab(?:ilitation)?\b/gi, "COPD & Pulmonary Rehabilitation")
      .replace(/\bCOPD management\b/gi, "COPD & Pulmonary Rehabilitation")
      .replace(/\bGBS(?: rehabilitation| rehab)?\b/gi, "Guillain-Barré Rehabilitation")
      .replace(/\bgeriatric rehab\b/gi, "Geriatric Rehabilitation")
      .replace(/\bgeriatric physio\b/gi, "Geriatric Physiotherapy")
      .replace(/\bortho rehab(?:ilitation)?\b/gi, "Orthopaedic Rehabilitation")
      .replace(/\bsports injury(?! physiotherapy)\b/gi, "Sports Injury Physiotherapy")
      .replace(/\bspinal cord injury(?! rehabilitation)\b/gi, "Spinal Cord Injury Rehabilitation");

    return cities.map((city) => {
      const seo = getCitySeoMetadata(city);
      return {
        path: `/physiotherapist-at-home/${city.slug}`,
        outDir: `physiotherapist-at-home/${city.slug}`,
        title: seo.title,
        description: seo.description,
        ogTitle: seo.title,
        ogDescription: seo.description,
        canonical: `${BASE_URL}/physiotherapist-at-home/${city.slug}`,
        ogUrl: `${BASE_URL}/physiotherapist-at-home/${city.slug}`,
        indexable: INDEXABLE_CITY_SLUGS.has(city.slug),
      };
    });
  })(),

  // State landing pages — targets searches like "physiotherapist at home in Rajasthan"
  ...(() => {
    return states.map((state) => {
      const citiesInState = getCitiesForState(state);
      const activeCities = citiesInState.filter((city) => hasVerifiedHomecareCoverage(city));
      const expansionCities = citiesInState.filter((city) => !hasVerifiedHomecareCoverage(city));
      const description = getStateSeoDescription(state);
      return {
        path: `/physiotherapist-at-home-in/${state.slug}`,
        outDir: `physiotherapist-at-home-in/${state.slug}`,
        title: `Online Physiotherapy in ${state.name} | Goswami Rehab`,
        description,
        ogTitle: `Online Physiotherapy in ${state.name} | Goswami Rehab`,
        ogDescription: description,
        canonical: `${BASE_URL}/physiotherapist-at-home-in/${state.slug}`,
        ogUrl: `${BASE_URL}/physiotherapist-at-home-in/${state.slug}`,
        indexable: isStateIndexable(state),
      };
    });
  })(),

  // Category pages — one prerendered HTML file per category so Google indexes
  // these useful filtered listing pages and can rank them for category searches.
  ...(() => {
    const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const categoryDescriptions = {
      "Neuro Rehabilitation":
        "Neuro Rehabilitation guides cover stroke, Parkinson's, brain injury, and neurological rehabilitation. Read practical safety and care guidance for families.",
      "Ortho Rehabilitation":
        "Ortho Rehabilitation guides cover joint replacement, rotator cuff, and post-surgery rehabilitation. Read practical safety and care guidance for families.",
      "Occupational Therapy":
        "Occupational Therapy guides cover daily-living skills and functional independence. Practical guidance on assessment, exercise, and home care for families.",
      "Pulmonary Rehabilitation":
        "Pulmonary Rehabilitation guides cover COPD, breathing exercises, and lung function. Practical guidance on assessment, exercise, and home care for families.",
      "Cardiopulmonary Rehabilitation":
        "Cardiopulmonary Rehabilitation guides cover cardiac, post-bypass, and pulmonary rehabilitation. Practical assessment, exercise, safety, and care guidance.",
      "Homecare Guide":
        "Homecare Guide articles explain finding and booking a physiotherapist at home. Practical guidance on assessment, exercise, and safer care for families.",
      "City Guide":
        "City Guide articles explain home physiotherapy in major Indian cities. Practical guidance on assessment, exercise, safety, and care planning for families.",
      "Exercise Physiology":
        "Exercise Physiology articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home now.",
      "Functional Rehabilitation":
        "Functional Rehabilitation articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home.",
      "Geriatric Rehabilitation":
        "Geriatric Rehabilitation articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home.",
      "Nutrition & Clinical Guidance":
        "Nutrition & Clinical Guidance articles provide practical physiotherapy guidance for assessment, exercise, safety, and rehabilitation planning at home.",
      "Orthopaedic Rehabilitation":
        "Orthopaedic Rehabilitation articles provide practical physiotherapy guidance for assessment, exercise, safety, and clear rehabilitation planning at home.",
      "Paediatric Rehabilitation":
        "Paediatric Rehabilitation articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home.",
      "Sports Rehabilitation":
        "Sports Rehabilitation articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home.",
      "Women's Health":
        "Women's Health articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home today.",
    };
    const categories = [...new Set(blogPosts.map((p) => p.category))];
    return categories.map((cat) => ({
      path: `/blog/category/${slugify(cat)}`,
      outDir: `blog/category/${slugify(cat)}`,
      title: `${cat} Articles | Goswami Rehab`,
      description: categoryDescriptions[cat] ?? `${cat} articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home.`,
      ogTitle: `${cat} | Goswami Rehab Journal`,
      ogDescription: categoryDescriptions[cat] ?? `${cat} articles provide practical physiotherapy guidance for assessment, exercise, safety, and informed rehabilitation planning at home.`,
      canonical: `${BASE_URL}/blog/category/${slugify(cat)}`,
      ogUrl: `${BASE_URL}/blog/category/${slugify(cat)}`,
      stylesheets: ["journal"],
      breadcrumbName: cat,
      breadcrumbCategory: true,
      collectionSchema: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/blog/category/${slugify(cat)}#collection`,
        "name": `${cat} Articles`,
        "url": `${BASE_URL}/blog/category/${slugify(cat)}`,
        "isPartOf": { "@id": `${BASE_URL}/blog#webpage` },
        "mainEntity": {
          "@type": "ItemList",
          "itemListElement": blogPosts
            .filter((post) => post.category === cat)
            .map((post, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `${BASE_URL}/blog/${post.slug}`,
              "name": post.title,
            })),
        },
      },
    }));
  })(),
];

const hindiHomeTitle = getExistingHindiTranslation(
  "Homecare Physiotherapy in 45 Listed Cities.",
);
const hindiHomeFullDescription = getExistingHindiTranslation(
  "Goswami Rehab brings certified homecare physiotherapy across India — Rajasthan, Delhi NCR, Punjab, Karnataka, Maharashtra, Kerala, Assam, Uttarakhand, Jammu & more. 35+ specialist physios. Stroke rehabilitation, cardiopulmonary rehabilitation, post-surgery rehabilitation, neurological rehabilitation & complex case recovery.",
);
const hindiHomeDescription = hindiHomeFullDescription
  ?.split(/(?<=।)\s*/u)
  .slice(0, 2)
  .join(" ");
if (!hindiHomeTitle || !hindiHomeDescription) {
  throw new Error("The Hindi homepage title and description must come from existing authored translations.");
}

routes.push({
  path: "/hi",
  outDir: "hi",
  title: `${hindiHomeTitle} | Goswami Rehab`,
  description: hindiHomeDescription,
  ogTitle: `${hindiHomeTitle} | Goswami Rehab`,
  ogDescription: hindiHomeDescription,
  canonical: `${BASE_URL}/hi`,
  ogUrl: `${BASE_URL}/hi`,
  lang: "hi",
  indexable: true,
  hreflangAlternates: {
    "en-IN": `${BASE_URL}/`,
    "hi-IN": `${BASE_URL}/hi`,
    "x-default": `${BASE_URL}/`,
  },
});

const expectedHindiStaticRevisions = new Map([
  ["/hi/booking", "booking-r1"],
  ["/hi/online-care", "online-care-r1"],
  ["/hi/contact", "contact-r1"],
  ["/hi/about", "about-r1"],
  ["/hi/home-physiotherapy", "about-r1"],
]);
if (hindiStaticRouteRegistry.length !== expectedHindiStaticRevisions.size) {
  throw new Error(
    `Expected ${expectedHindiStaticRevisions.size} reviewed Hindi static routes, found ${hindiStaticRouteRegistry.length}.`,
  );
}
for (const [routePath, revision] of expectedHindiStaticRevisions) {
  const route = hindiStaticRouteRegistry.find((candidate) => candidate.path === routePath);
  if (!route || route.revision !== revision) {
    throw new Error(
      `Hindi route ${routePath} must use the reviewed ${revision} copy revision before it can be published.`,
    );
  }
}
if (hindiCityRoutes.length !== 45) {
  throw new Error(`Expected 45 Hindi city routes, found ${hindiCityRoutes.length}.`);
}
if (new Set(hindiCityRoutes.map((city) => city.slug)).size !== hindiCityRoutes.length) {
  throw new Error("Hindi city route slugs must be unique.");
}
for (const city of hindiCityRoutes) {
  if (city.revision.template !== "city-template-r1") {
    throw new Error(
      `Hindi city route ${city.slug} must use the reviewed city-template-r1 revision.`,
    );
  }
}

const hindiRouteRecordsByPath = new Map(
  hindiRouteRegistry.map((route) => [route.path, route]),
);
if (hindiRouteRecordsByPath.size !== 50) {
  throw new Error(
    `Expected 50 reviewed Hindi routes (5 static and 45 city), found ${hindiRouteRecordsByPath.size}.`,
  );
}
const hindiCityRecordsBySlug = new Map(hindiCityRoutes.map((city) => [city.slug, city]));
const hindiRouteSourceFilesByPath = new Map(
  hindiRouteRegistry.map((route) => [route.path, route.sourceFiles]),
);

const hindiRoutes = hindiRouteRegistry.map((record) => {
  const canonical = `${BASE_URL}${record.path}`;
  const englishUrl = `${BASE_URL}${record.englishPath}`;
  const route = {
    path: record.path,
    outDir: record.path.slice(1),
    title: record.title,
    description: record.description,
    ogTitle: record.title,
    ogDescription: record.description,
    canonical,
    ogUrl: canonical,
    lang: "hi",
    indexable: true,
    revision: record.revision,
    sourceFiles: record.sourceFiles,
    stylesheets: record.page === "city" ? ["hindi-city"] : ["hindi-static"],
    hreflangAlternates: {
      "en-IN": englishUrl,
      "hi-IN": canonical,
      "x-default": englishUrl,
    },
    suppressBreadcrumbSchema: true,
    webPageSchema: {
      "@context": "https://schema.org",
      "@type": record.page === "about"
        ? "AboutPage"
        : record.page === "contact"
          ? "ContactPage"
          : "WebPage",
      "@id": `${canonical}#webpage`,
      "url": canonical,
      "name": record.title,
      "description": record.description,
      "isPartOf": { "@id": `${BASE_URL}/#website` },
      "about": { "@id": ORG_ID },
    },
  };

  if (record.page === "about") {
    route.organizationSchema = ORGANIZATION_SCHEMA;
    route.aboutSchema = {
      ...ABOUT_SCHEMA,
      "@id": `${canonical}#webpage`,
      "url": canonical,
      "name": record.title,
    };
  } else if (record.page === "online-care") {
    route.serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#service`,
      "name": "ऑनलाइन फिजियोथेरेपी परामर्श",
      "description": record.description,
      "url": canonical,
      "provider": { "@id": ORG_ID },
      "areaServed": { "@type": "Place", "name": "Worldwide" },
      "serviceType": "Telehealth physiotherapy consultation",
      "offers": {
        "@type": "Offer",
        "price": String(pricing.telehealth.amountInr),
        "priceCurrency": "INR",
        "description": `${pricing.telehealth.displayAmount} प्रति ऑनलाइन परामर्श`,
      },
    };
  } else if (record.page === "contact") {
    route.faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": HINDI_CONTACT_FAQS.map(({ q, a }) => ({
        "@type": "Question",
        "name": q,
        "acceptedAnswer": { "@type": "Answer", "text": a },
      })),
    };
  } else if (record.page === "city") {
    const city = hindiCityRecordsBySlug.get(record.citySlug);
    if (!city) {
      throw new Error(`Hindi city route ${record.path} has no matching reviewed city data.`);
    }
    const faqs = getHindiCityFaqs(city);
    const unresolvedFaqPlaceholders = faqs.filter(({ question, answer }) =>
      /\[[^\]]+\]/u.test(`${question} ${answer}`),
    );
    if (unresolvedFaqPlaceholders.length > 0) {
      throw new Error(`Hindi city route ${record.path} has unresolved FAQ copy placeholders.`);
    }
    route.serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${canonical}#home-physiotherapy`,
      "name": `घर पर फिजियोथेरेपी — ${city.displayName}`,
      "url": canonical,
      "provider": { "@id": ORG_ID },
      "areaServed": { "@type": "City", "name": city.displayName },
      "serviceType": "घर पर फिजियोथेरेपी",
    };
    route.faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(({ question, answer }) => ({
        "@type": "Question",
        "name": question,
        "acceptedAnswer": { "@type": "Answer", "text": answer },
      })),
    };
    route.breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "होम", "item": `${BASE_URL}/hi` },
        { "@type": "ListItem", "position": 2, "name": city.displayName, "item": canonical },
      ],
    };
    route.suppressBreadcrumbSchema = false;
    route.breadcrumbName = city.displayName;
  }

  const englishRoute = routes.find((candidate) => candidate.path === record.englishPath);
  if (!englishRoute) {
    throw new Error(
      `Hindi route ${record.path} has no English counterpart at ${record.englishPath}.`,
    );
  }
  englishRoute.hreflangAlternates = {
    ...englishRoute.hreflangAlternates,
    "en-IN": `${BASE_URL}${englishRoute.path}`,
    "hi-IN": canonical,
    "x-default": `${BASE_URL}${englishRoute.path}`,
  };
  return route;
});

routes.push(...hindiRoutes);

const blogCatalogErrors = getBlogCatalogValidationErrors(blogPosts);
if (blogCatalogErrors.length > 0) {
  throw new Error([
    "Published Journal catalog validation failed:",
    ...blogCatalogErrors.map((error) => `- ${error}`),
  ].join("\n"));
}

const authoredBlogSlugs = blogPosts.map((post) => post.slug);
const generatedBlogSlugs = routes
  .filter((route) => route.blogPost)
  .map((route) => route.blogPost.slug);
const blogRouteParityErrors = getBlogSlugParityErrors(
  authoredBlogSlugs,
  generatedBlogSlugs,
);
if (blogRouteParityErrors.length > 0) {
  throw new Error([
    "Journal article route parity validation failed:",
    ...blogRouteParityErrors.map((error) => `- ${error}`),
  ].join("\n"));
}

function buildBlogPostingSchema(post) {
  const authorProfile = getBlogAuthorProfile(post);
  const imageUrl = new URL(getJournalImagePath(post.slug, post.image), BASE_URL);
  if (imageUrl.protocol !== "https:" || imageUrl.origin !== BASE_ORIGIN) {
    throw new Error(
      `BlogPosting image for ${post.slug} must use the ${BASE_ORIGIN} HTTPS origin: ${imageUrl.href}`,
    );
  }

  const imagePath = decodeURIComponent(imageUrl.pathname).replace(/^\/+/, "");
  const imageFile = path.resolve(distDir, imagePath);
  const distRoot = `${path.resolve(distDir)}${path.sep}`;
  if (
    !imageFile.startsWith(distRoot) ||
    !fs.existsSync(imageFile) ||
    !fs.statSync(imageFile).isFile()
  ) {
    throw new Error(
      `BlogPosting image for ${post.slug} does not resolve to a public asset: ${imageUrl.href}`,
    );
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": getBlogArticleTitle(post),
    "description": post.excerpt,
    "image": imageUrl.href,
    "datePublished": post.isoDate,
    "author": {
      ...AUTHOR_ENTITY,
      "name": authorProfile.name,
      "jobTitle": authorProfile.role,
      "hasOccupation": {
        "@type": "Occupation",
        "name": authorProfile.credential,
      },
    },
    "reviewedBy": {
      ...REVIEWER_ENTITY,
    },
    "publisher": {
      "@id": ORG_ID,
       "name": "Goswami Rehab",
       "logo": {
         "@type": "ImageObject",
         "url": LOGO_URL,
         ...LOGO_DIMENSIONS,
       },
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
    "articleSection": post.category,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": "Journal", "item": `${BASE_URL}/blog` },
         { "@type": "ListItem", "position": 3, "name": getBlogArticleTitle(post), "item": `${BASE_URL}/blog/${post.slug}` },
      ],
    },
  };
}

function prioritizeCriticalLinks(markup) {
  const moduleScriptIndex = markup.indexOf('<script type="module"');
  if (moduleScriptIndex === -1) return markup;

  const criticalLinks = [];
  const withoutLateCriticalLinks = markup.replace(
    /<link\b[^>]*\brel="modulepreload"[^>]*>\s*/gi,
    "",
  ).replace(
    /<link\b[^>]*\brel="stylesheet"[^>]*>\s*/gi,
    (tag) => {
      criticalLinks.push(
        tag.trim().replace(
          /\s+\bcrossorigin\b(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?/i,
          "",
        ),
      );
      return "";
    },
  );
  const updatedModuleScriptIndex = withoutLateCriticalLinks.indexOf('<script type="module"');
  if (updatedModuleScriptIndex === -1 || criticalLinks.length === 0) return markup;

  return [
    withoutLateCriticalLinks.slice(0, updatedModuleScriptIndex),
    criticalLinks.join("\n"),
    withoutLateCriticalLinks.slice(updatedModuleScriptIndex),
  ].join("\n");
}

function buildHtml(route) {
  let html = indexHtml;
  const isReviewedHindiSubroute =
    route.lang === "hi" && route.path !== "/hi" && Boolean(route.revision);
  let description;
  let ogDescription;
  if (isReviewedHindiSubroute) {
    description = route.description;
    ogDescription = route.ogDescription ?? route.description;
    const descriptionLength = Array.from(description ?? "").length;
    const isHindiCityR1 = route.revision?.template === "city-template-r1";
    const maximum = isHindiCityR1 ? 183 : METADATA_LIMITS.description;
    if (
      !description ||
      description !== description.trim() ||
      descriptionLength > maximum ||
      (isHindiCityR1 && descriptionLength < 150) ||
      ogDescription !== description
    ) {
      throw new Error(
        `Reviewed Hindi metadata is invalid for ${route.path}; preserve the approved revision and matching Open Graph description.`,
      );
    }
  } else {
    description = normalizeMetaDescription(route.description, route.path);
    ogDescription = normalizeMetaDescription(
      route.ogDescription ?? route.description,
      route.path,
      "og:description",
    );
  }
  const socialImage = route.socialImage ?? `${BASE_URL}/opengraph.jpg`;
  const socialImageAlt = route.socialImageAlt ?? "Goswami Rehab — Homecare Physiotherapy";
  const socialImageWidth = route.socialImageWidth ?? "1280";
  const socialImageHeight = route.socialImageHeight ?? "720";
  const preloadImageMarkup = (image) => {
    const extension = path.extname(image).toLowerCase();
    const mimeType = extension === ".avif"
      ? "image/avif"
      : extension === ".png"
        ? "image/png"
        : extension === ".webp"
          ? "image/webp"
          : "image/jpeg";
    return `<link rel="preload" as="image" href="${image}" type="${mimeType}" fetchpriority="high">`;
  };
  const routePreload = route.path === "/"
    ? '<link rel="preload" as="image" href="/images/hero-clinic-1408.avif" type="image/avif" imagesrcset="/images/hero-clinic-640.avif 640w, /images/hero-clinic-1024.avif 1024w, /images/hero-clinic-1408.avif 1408w" imagesizes="(min-width: 768px) 50vw, 100vw" fetchpriority="high">'
    : route.preloadImages?.length
      ? route.preloadImages
        .map(preloadImageMarkup)
        .join("")
      : route.preloadImage
        ? preloadImageMarkup(route.preloadImage)
        : "";
  const routeStylesheets = (route.stylesheets ?? [])
    .map((stylesheet) => `<link rel="stylesheet" href="${ROUTE_STYLESHEETS[stylesheet]}">`)
    .join("");
  const languageAlternates = Object.entries(route.hreflangAlternates ?? {})
    .map(
      ([language, href]) =>
        `<link rel="alternate" hreflang="${escapeHtml(language)}" href="${escapeHtml(href)}">`,
    )
    .join("");
  const articleMeta = route.blogPost
    ? (() => {
        return [
          `<meta name="author" content="${escapeHtml(route.blogPost.author)}">`,
          `<meta property="article:published_time" content="${route.blogPost.isoDate}">`,
          `<meta property="article:section" content="${escapeHtml(route.blogPost.category)}">`,
          `<meta property="article:author" content="${escapeHtml(route.blogPost.author)}">`,
        ].join("");
      })()
    : "";
  html = html.replace(
    "</head>",
    `${articleMeta}${routeStylesheets}${routePreload}${languageAlternates}</head>`,
  );

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(route.title)}</title>`);
  html = html.replace(/<html\b([^>]*)>/i, (_match, attributes) => {
    const safeAttributes = attributes.replace(/\s+lang=(["']).*?\1/i, "");
    return `<html${safeAttributes} lang="${route.lang ?? "en"}">`;
  });
  html = html.replace(/(<meta name="description" content=")[^"]*(")/,  `$1${escapeHtml(description)}$2`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*(")/,        `$1${escapeHtml(route.canonical)}$2`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*(")/,       `$1${escapeHtml(route.ogTitle)}$2`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*(")/,  `$1${escapeHtml(ogDescription)}$2`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*(")/,        `$1${escapeHtml(socialImage)}$2`);
  html = html.replace(/(<meta property="og:image:alt" content=")[^"]*(")/,   `$1${escapeHtml(socialImageAlt)}$2`);
  html = html.replace(/(<meta property="og:image:width" content=")[^"]*(")/, `$1${socialImageWidth}$2`);
  html = html.replace(/(<meta property="og:image:height" content=")[^"]*(")/, `$1${socialImageHeight}$2`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*(")/,          `$1${escapeHtml(route.ogUrl)}$2`);
  html = html.replace(
    /(<meta property="og:locale" content=")[^"]*(")/,
    `$1${route.lang === "hi" ? "hi_IN" : "en_IN"}$2`,
  );
  html = html.replace(/(<meta name="twitter:title" content=")[^"]*(")/,       `$1${escapeHtml(route.ogTitle)}$2`);
  html = html.replace(/(<meta name="twitter:description" content=")[^"]*(")/,  `$1${escapeHtml(ogDescription)}$2`);
  html = html.replace(/(<meta name="twitter:image" content=")[^"]*(")/,       `$1${escapeHtml(socialImage)}$2`);
  html = html.replace(/(<meta name="twitter:image:alt" content=")[^"]*(")/,  `$1${escapeHtml(socialImageAlt)}$2`);
  if (route.indexable !== undefined) {
    html = html.replace(
      /(<meta name="robots" content=")[^"]*(")/,
      `$1${route.indexable ? "index, follow" : "noindex, follow, noai, noimageai"}$2`,
    );
  }

  if (route.ogType) {
    html = html.replace(/(<meta property="og:type" content=")[^"]*(")/,  `$1${route.ogType}$2`);
  }

  const structuredData = [];

  if (route.blogPost) {
    structuredData.push(buildBlogPostingSchema(route.blogPost));
  }

  if (route.faqSchema) {
    structuredData.push(route.faqSchema);
  }

  if (route.organizationSchema) {
    structuredData.push(route.organizationSchema);
  }

  if (route.aboutSchema) {
    structuredData.push(route.aboutSchema);
  }

  if (route.authorSchema) {
    structuredData.push(route.authorSchema);
  }

  if (route.webPageSchema) {
    structuredData.push(route.webPageSchema);
  }

  if (route.serviceSchema) {
    structuredData.push(route.serviceSchema);
  }

  if (route.collectionSchema) {
    structuredData.push(route.collectionSchema);
  }

  if (route.breadcrumbSchema) {
    structuredData.push(route.breadcrumbSchema);
  } else if (
    !route.suppressBreadcrumbSchema &&
    route.path !== "/" &&
    route.path !== "/admin" &&
    !route.path.startsWith("/physiotherapist-at-home/") &&
    !route.path.startsWith("/physiotherapist-at-home-in/")
  ) {
    structuredData.push(buildBreadcrumbSchema(route));
  }

  if (!html.includes(STRUCTURED_DATA_MARKER)) {
    throw new Error(`Missing structured-data marker while prerendering ${route.path}`);
  }

  const scriptBlocks = structuredData
    .map((schema) => `  <script type="application/ld+json">\n  ${JSON.stringify(schema, null, 2)}\n  </script>`)
    .join("\n");
  html = html.replace(STRUCTURED_DATA_MARKER, scriptBlocks);

  return prioritizeCriticalLinks(html);
}

function buildBreadcrumbSchema(route) {
  const parts = route.path.split("/").filter(Boolean);
  const items = [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": `${BASE_URL}/` },
  ];
  if (parts[0] === "blog") {
    items.push({ "@type": "ListItem", "position": 2, "name": "Journal", "item": `${BASE_URL}/blog` });
    if (route.breadcrumbCategory) {
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": "Category",
        "item": `${BASE_URL}/blog`,
      });
    }
  } else if (
    parts[0] === "services" ||
    serviceGuideRouteData.rootPaths.includes(route.path)
  ) {
    items.push({ "@type": "ListItem", "position": 2, "name": "Treatment Services", "item": `${BASE_URL}/#services` });
    if (route.breadcrumbParent) {
      items.push({
        "@type": "ListItem",
        "position": items.length + 1,
        "name": route.breadcrumbParent,
        "item": `${BASE_URL}/#services`,
      });
    }
  }
  items.push({
    "@type": "ListItem",
    "position": items.length + 1,
    "name": route.breadcrumbName ?? route.title.replace(/\s+\|\s+Goswami Rehab$/, ""),
    "item": route.canonical,
  });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items,
  };
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function validateLocationSchemaIndexability(route, html) {
  const isHindiCityRoute = route.path.startsWith("/hi/physiotherapist-at-home/");
  const isCityRoute =
    route.path.startsWith("/physiotherapist-at-home/") || isHindiCityRoute;
  const isStateRoute = route.path.startsWith("/physiotherapist-at-home-in/");
  if (!isCityRoute && !isStateRoute) return;
  const richSchemaTypes = isCityRoute ? CITY_RICH_SCHEMA_TYPES : STATE_RICH_SCHEMA_TYPES;

  const jsonLdBlocks = html.match(JSON_LD_SCRIPT) ?? [];
  const emittedTypes = richSchemaTypes.filter((type) =>
    jsonLdBlocks.some((block) =>
      new RegExp(`"@type"\\s*:\\s*"${type}"`).test(block),
    ),
  );

  if (route.indexable) {
    const missingTypes = richSchemaTypes.filter(
      (type) => !emittedTypes.includes(type),
    );
    if (missingTypes.length > 0) {
      throw new Error(`Indexable location ${route.path} is missing rich schema: ${missingTypes.join(", ")}`);
    }
  } else if (emittedTypes.length > 0) {
    throw new Error(`Non-indexable location ${route.path} emits rich schema: ${emittedTypes.join(", ")}`);
  }
}

function validateIndexableMetadata(routeList) {
  const fields = [
    ["title", METADATA_LIMITS.title],
    ["description", METADATA_LIMITS.description],
    ["ogTitle", METADATA_LIMITS.title],
    ["ogDescription", METADATA_LIMITS.description],
  ];
  const violations = routeList
    .filter((route) => route.indexable !== false)
    .flatMap((route) => fields
      .filter(([field, limit]) => {
        const approvedCityDescription =
          route.path.startsWith("/hi/physiotherapist-at-home/") &&
          route.revision?.template === "city-template-r1" &&
          (field === "description" || field === "ogDescription");
        return Array.from(route[field] ?? "").length >
          (approvedCityDescription ? 183 : limit);
      })
      .map(([field, limit]) =>
        `${route.path} ${field}=${Array.from(route[field] ?? "").length} (max ${
          route.path.startsWith("/hi/physiotherapist-at-home/") &&
          route.revision?.template === "city-template-r1" &&
          (field === "description" || field === "ogDescription")
            ? 183
            : limit
        })`
      ));

  if (violations.length > 0) {
    throw new Error([
      "Indexable route metadata exceeds search display limits:",
      ...violations.map((violation) => `- ${violation}`),
    ].join("\n"));
  }
}

validateIndexableMetadata(routes);

const cityRoutes = routes.filter((route) => route.path.startsWith("/physiotherapist-at-home/"));
const indexableCityRoutes = cityRoutes.filter((route) => route.indexable);
if (indexableCityRoutes.length !== INDEXABLE_CITY_SLUGS.size) {
  throw new Error(`Expected ${INDEXABLE_CITY_SLUGS.size} indexable city routes, found ${indexableCityRoutes.length}.`);
}
const indexableHindiCityRoutes = hindiRoutes.filter(
  (route) =>
    route.path.startsWith("/hi/physiotherapist-at-home/") &&
    route.indexable !== false,
);
if (indexableHindiCityRoutes.length !== 45) {
  throw new Error(
    `Expected all 45 Hindi city routes to remain indexable, found ${indexableHindiCityRoutes.length}.`,
  );
}
for (const route of cityRoutes) {
  const slug = route.path.split("/").pop();
  const shouldIndex = INDEXABLE_CITY_SLUGS.has(slug);
  if (route.indexable !== shouldIndex) {
    throw new Error(`City indexability mismatch for ${slug}: expected ${shouldIndex}.`);
  }
}
const stateRoutes = routes.filter((route) => route.path.startsWith("/physiotherapist-at-home-in/"));
const indexableStateRoutes = stateRoutes.filter((route) => route.indexable);
if (indexableStateRoutes.length !== states.length) {
  throw new Error(
    `Expected all ${states.length} authored state routes to be indexable, found ${indexableStateRoutes.length}.`,
  );
}
for (const route of stateRoutes) {
  const slug = route.path.split("/").pop();
  const state = states.find((candidate) => candidate.slug === slug);
  if (!state || !isStateIndexable(state) || route.indexable !== true) {
    throw new Error(`State indexability mismatch for ${slug}.`);
  }
}

const authoredBlogSourcePaths = [
  "src/lib/data.ts",
  "src/lib/city-journal.ts",
  ...fs.readdirSync(path.join(__dirname, "src", "lib"))
    .filter((filename) => /^city-journal-batch\d+\.ts$/.test(filename))
    .map((filename) => `src/lib/${filename}`),
];
const authoredBlogSourceText = new Map(
  authoredBlogSourcePaths.map((sourcePath) => [
    sourcePath,
    fs.readFileSync(path.join(__dirname, sourcePath), "utf8"),
  ]),
);
const blogSourcePathsBySlug = new Map();
const sourceLastmodByPath = new Map();
const sitemapCurrentDate = new Date().toISOString().slice(0, 10);
const SOURCE_FILES_BY_STATIC_ROUTE = new Map([
  [
    "/",
    [
      "src/pages/home.tsx",
      "src/lib/home-faqs.ts",
      "src/lib/cities.ts",
      "src/lib/blog-index.ts",
      "src/lib/review-catalog.ts",
      "src/lib/site-data.ts",
      "src/lib/pricing.ts",
      "src/lib/contact.ts",
      "src/lib/service-guide-map.ts",
    ],
  ],
  [
    "/hi",
    [
      "src/pages/hindi-home.tsx",
      "src/lib/language.tsx",
      "src/lib/site-data.ts",
      "src/lib/service-guide-map.ts",
    ],
  ],
  [
    "/booking",
    [
      "src/pages/booking.tsx",
      "src/lib/booking-city.ts",
      "src/lib/booking-index.ts",
      "src/lib/pricing.ts",
      "src/lib/site-data.ts",
      "src/lib/cities.ts",
      "src/lib/contact.ts",
    ],
  ],
  ["/online-care", ["src/pages/online-care.tsx"]],
  ["/contact", ["src/pages/contact.tsx", "src/lib/contact-page-content.ts"]],
  ["/about", ["src/pages/about.tsx", "src/lib/content-profiles.ts"]],
  ["/reviews", ["src/pages/reviews.tsx", "src/lib/review-catalog.ts"]],
  ["/cities", ["src/pages/cities.tsx", "src/lib/cities.ts"]],
  ["/blog", ["src/pages/blog-list.tsx", "src/lib/blog-index.ts"]],
  ["/privacy", ["src/pages/privacy.tsx"]],
  ["/terms", ["src/pages/terms.tsx"]],
]);

function validateSitemapDate(value, description) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`Invalid sitemap lastmod date for ${description}: "${value}".`);
  }
  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== value
  ) {
    throw new Error(`Invalid calendar date for sitemap lastmod ${description}: "${value}".`);
  }
  if (value > sitemapCurrentDate) {
    throw new Error(
      `Future sitemap lastmod date for ${description}: ${value} is later than ${sitemapCurrentDate}.`,
    );
  }
  return value;
}

function getSourceLastmodInfo(sourcePath) {
  if (sourceLastmodByPath.has(sourcePath)) return sourceLastmodByPath.get(sourcePath);

  const absolutePath = path.resolve(__dirname, sourcePath);
  if (!absolutePath.startsWith(`${__dirname}${path.sep}`) || !fs.existsSync(absolutePath)) {
    throw new Error(`Sitemap lastmod source file is missing or outside the site: ${sourcePath}.`);
  }

  let sourceDate;
  try {
    sourceDate = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", sourcePath],
      { cwd: __dirname, encoding: "utf8" },
    ).trim();
  } catch (error) {
    throw new Error(
      `Cannot read Git history for sitemap source ${sourcePath}; a trustworthy lastmod date is required. ${error.message}`,
    );
  }

  if (!sourceDate) {
    try {
      execFileSync(
        "git",
        ["ls-files", "--error-unmatch", "--", sourcePath],
        { cwd: __dirname, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
      );
    } catch {
      const info = {
        date: null,
        source: `${sourcePath} (uncommitted; no Git lastmod date)`,
      };
      sourceLastmodByPath.set(sourcePath, info);
      return info;
    }
    throw new Error(
      `No trustworthy Git-history date is available for tracked sitemap source ${sourcePath}.`,
    );
  }
  const validatedDate = validateSitemapDate(sourceDate, sourcePath);
  const info = {
    date: validatedDate,
    source: `${sourcePath} (last Git change)`,
  };
  sourceLastmodByPath.set(sourcePath, info);
  return info;
}

function getSourceLastmodDate(sourcePath) {
  return getSourceLastmodInfo(sourcePath).date;
}

function getBlogPostLastmodInfo(post) {
  const field = post.dateModified ? "dateModified" : "isoDate";
  const sourceDate = post[field];
  if (sourceDate < post.isoDate) {
    throw new Error(
      `Journal lastmod date for "${post.slug}" cannot precede its publish date ${post.isoDate}.`,
    );
  }
  return {
    date: validateSitemapDate(sourceDate, `Journal post ${post.slug}`),
    source: `/blog/${post.slug} ${field}`,
  };
}

function getBlogPostLastmodDate(post) {
  return getBlogPostLastmodInfo(post).date;
}

function getBlogPostSourcePaths(post) {
  if (blogSourcePathsBySlug.has(post.slug)) return blogSourcePathsBySlug.get(post.slug);
  if (
    post.category === "City Guide" &&
    post.slug.startsWith("physiotherapist-at-home-")
  ) {
    const sources = ["src/lib/data.ts"];
    blogSourcePathsBySlug.set(post.slug, sources);
    return sources;
  }
  const slugPattern = new RegExp(
    `\\bslug\\s*:\\s*["']${post.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
  );
  const matches = authoredBlogSourcePaths.filter((sourcePath) =>
    slugPattern.test(authoredBlogSourceText.get(sourcePath)),
  );
  if (matches.length === 0) {
    throw new Error(
      `No authored source file declares Journal slug "${post.slug}"; sitemap lastmod cannot be inferred.`,
    );
  }
  blogSourcePathsBySlug.set(post.slug, matches);
  return matches;
}

function getSitemapSourcePaths(route) {
  const hindiSources = hindiRouteSourceFilesByPath.get(route.path);
  if (hindiSources) {
    return [
      ...new Set([
        ...hindiSources,
        "src/lib/hindi-route-registry.ts",
        "src/lib/hindi-static-routes.ts",
        ...(route.path.startsWith("/hi/physiotherapist-at-home/")
          ? ["src/lib/hindi-city-routes.ts"]
          : []),
      ]),
    ];
  }

  if (route.path === "/blog") {
    return SOURCE_FILES_BY_STATIC_ROUTE.get("/blog");
  }

  if (route.path.startsWith("/blog/category/")) {
    const categoryPosts = blogPosts.filter((post) => post.category === route.breadcrumbName);
    if (categoryPosts.length === 0) {
      throw new Error(`No authored articles exist for Journal category ${route.breadcrumbName}.`);
    }
    return ["src/pages/blog-category.tsx", "src/lib/blog-index.ts"];
  }

  if (route.path.startsWith("/physiotherapist-at-home/")) {
    const citySlug = route.path.split("/").at(-1);
    const cityPosts = blogPosts.filter((post) => post.citySlug === citySlug);
    return [
      "src/pages/city.tsx",
      "src/lib/cities.ts",
      "src/lib/city-journal.ts",
    ];
  }

  if (route.path.startsWith("/physiotherapist-at-home-in/")) {
    const stateSlug = route.path.split("/").at(-1);
    const state = states.find((candidate) => candidate.slug === stateSlug);
    if (!state) throw new Error(`No authored state data exists for ${route.path}.`);
    const stateCityPosts = blogPosts.filter((post) =>
      post.citySlug && state.citySlugs.includes(post.citySlug),
    );
    return [
      "src/pages/state.tsx",
      "src/lib/states.ts",
      "src/lib/state-profiles.ts",
      "src/lib/state-faqs.ts",
      "src/lib/cities.ts",
      "src/lib/city-journal.ts",
      "src/lib/state-journal-index.ts",
    ];
  }

  const staticSources = SOURCE_FILES_BY_STATIC_ROUTE.get(route.path);
  if (staticSources) return staticSources;

  if (
    serviceGuides.some(
      (guide) => (guide.routePath ?? `/services/${guide.slug}`) === route.path,
    )
  ) {
    return [
      "src/pages/service-guide.tsx",
      "src/lib/service-guides.ts",
      "src/lib/service-guide-editorial.ts",
      "src/lib/service-guide-routes.json",
    ];
  }

  throw new Error(
    `No trustworthy source-date mapping exists for canonical indexable route ${route.canonical}.`,
  );
}

function getSitemapRouteLastmod(route) {
  return getSitemapRouteLastmodInfo(route).date;
}

function getSitemapRouteLastmodInfo(route) {
  if (route.blogPost) return getBlogPostLastmodInfo(route.blogPost);

  const sourcePaths = [...new Set(getSitemapSourcePaths(route))];
  if (sourcePaths.length === 0) {
    throw new Error(`No source files were found for canonical URL ${route.canonical}.`);
  }
  const candidates = sourcePaths.map(getSourceLastmodInfo);

  const addBlogPostCandidates = (posts) => {
    candidates.push(...posts.map(getBlogPostLastmodInfo));
  };
  if (route.path === "/blog") {
    addBlogPostCandidates(retainedBlogPosts);
  } else if (route.path.startsWith("/blog/category/")) {
    addBlogPostCandidates(
      retainedBlogPosts.filter((post) => post.category === route.breadcrumbName),
    );
  } else if (route.path.startsWith("/physiotherapist-at-home/")) {
    const citySlug = route.path.split("/").at(-1);
    addBlogPostCandidates(
      retainedBlogPosts.filter((post) => post.citySlug === citySlug),
    );
  } else if (route.path.startsWith("/physiotherapist-at-home-in/")) {
    const stateSlug = route.path.split("/").at(-1);
    const state = states.find((candidate) => candidate.slug === stateSlug);
    if (!state) throw new Error(`No authored state data exists for ${route.path}.`);
    addBlogPostCandidates(
      retainedBlogPosts.filter(
        (post) => post.citySlug && state.citySlugs.includes(post.citySlug),
      ),
    );
  }

  const datedCandidates = candidates.filter((candidate) => candidate.date);
  const undatedSources = [...new Set(
    candidates
      .filter((candidate) => !candidate.date)
      .map((candidate) => candidate.source),
  )];
  const date = datedCandidates.map((candidate) => candidate.date).sort().at(-1);
  if (!date) {
    throw new Error(`No source dates were found for canonical URL ${route.canonical}.`);
  }
  return {
    date,
    inputSources: [...new Set(candidates.map((candidate) => candidate.source))],
    sources: [...new Set(
      datedCandidates
        .filter((candidate) => candidate.date === date)
        .map((candidate) => candidate.source),
    )],
    ...(undatedSources.length > 0 ? { undatedSources } : {}),
  };
}

// Generate the blog and location portions of the sitemap from the same
// authoritative lists used to create those pages.
// Keep the template outside Vite's public directory so only this validated,
// generated document can be copied into the production web root.
const sitemapPath = path.join(__dirname, "sitemap-template.xml");
const sitemapTemplate = fs.readFileSync(sitemapPath, "utf8");
const CATEGORY_SITEMAP_START = "<!-- CATEGORY_SITEMAP_ENTRIES_START -->";
const CATEGORY_SITEMAP_END = "<!-- CATEGORY_SITEMAP_ENTRIES_END -->";
const CITY_SITEMAP_START = "<!-- CITY_SITEMAP_ENTRIES_START -->";
const CITY_SITEMAP_END = "<!-- CITY_SITEMAP_ENTRIES_END -->";
const HINDI_ROUTE_SITEMAP_START = "<!-- HINDI_ROUTE_SITEMAP_ENTRIES_START -->";
const HINDI_ROUTE_SITEMAP_END = "<!-- HINDI_ROUTE_SITEMAP_ENTRIES_END -->";
const BLOG_SITEMAP_START = "<!-- BLOG_SITEMAP_ENTRIES_START -->";
const BLOG_SITEMAP_END = "<!-- BLOG_SITEMAP_ENTRIES_END -->";
const STATE_SITEMAP_START = "<!-- STATE_SITEMAP_ENTRIES_START -->";
const STATE_SITEMAP_END = "<!-- STATE_SITEMAP_ENTRIES_END -->";
const categorySitemapEntries = routes
  .filter((route) => route.path.startsWith("/blog/category/"))
  .map((route) => {
    const latestArticleDate = retainedBlogPosts
      .filter((post) => post.category === route.breadcrumbName)
      .map(getBlogPostLastmodDate)
      .sort()
      .at(-1);
    if (!latestArticleDate) {
      throw new Error(`No authored articles were found for Journal category "${route.breadcrumbName}".`);
    }
    return `  <url>
    <loc>${route.canonical}</loc>
    <lastmod>${latestArticleDate}</lastmod>
  </url>`;
  })
  .join("\n");
const categoryStart = sitemapTemplate.indexOf(CATEGORY_SITEMAP_START);
const categoryEnd = sitemapTemplate.indexOf(CATEGORY_SITEMAP_END);
if (categoryStart === -1 || categoryEnd === -1 || categoryEnd < categoryStart) {
  throw new Error(
    `Sitemap template must contain ${CATEGORY_SITEMAP_START} and ${CATEGORY_SITEMAP_END}. Build aborted.`,
  );
}
const sitemapWithCategories = [
  sitemapTemplate.slice(0, categoryStart + CATEGORY_SITEMAP_START.length),
  "\n" + categorySitemapEntries + "\n  ",
  sitemapTemplate.slice(categoryEnd),
].join("");
const stateSitemapEntries = indexableStateRoutes
  .map((route) => `  <url>
    <loc>${route.canonical}</loc>
  </url>`)
  .join("\n");
const stateStart = sitemapWithCategories.indexOf(STATE_SITEMAP_START);
const stateEnd = sitemapWithCategories.indexOf(STATE_SITEMAP_END);
if (stateStart === -1 || stateEnd === -1 || stateEnd < stateStart) {
  throw new Error(
    `Sitemap template must contain ${STATE_SITEMAP_START} and ${STATE_SITEMAP_END}.`,
  );
}
const sitemapWithStates = [
  sitemapWithCategories.slice(0, stateStart + STATE_SITEMAP_START.length),
  "\n" + stateSitemapEntries + "\n  ",
  sitemapWithCategories.slice(stateEnd),
].join("");
const citySitemapEntries = indexableCityRoutes
  .map((route) => `  <url>
    <loc>${route.canonical}</loc>
  </url>`)
  .join("\n");
const cityStart = sitemapWithStates.indexOf(CITY_SITEMAP_START);
const cityEnd = sitemapWithStates.indexOf(CITY_SITEMAP_END);
if (cityStart === -1 || cityEnd === -1 || cityEnd < cityStart) {
  throw new Error(
    `Sitemap template must contain ${CITY_SITEMAP_START} and ${CITY_SITEMAP_END}.`,
  );
}
const sitemapWithCities = [
  sitemapWithStates.slice(0, cityStart + CITY_SITEMAP_START.length),
  "\n" + citySitemapEntries + "\n  ",
  sitemapWithStates.slice(cityEnd),
].join("");
const hindiRouteSitemapEntries = hindiRoutes
  .map((route) => `  <url>
    <loc>${route.canonical}</loc>
  </url>`)
  .join("\n");
const hindiRouteStart = sitemapWithCities.indexOf(HINDI_ROUTE_SITEMAP_START);
const hindiRouteEnd = sitemapWithCities.indexOf(HINDI_ROUTE_SITEMAP_END);
if (
  hindiRouteStart === -1 ||
  hindiRouteEnd === -1 ||
  hindiRouteEnd < hindiRouteStart
) {
  throw new Error(
    `Sitemap template must contain ${HINDI_ROUTE_SITEMAP_START} and ${HINDI_ROUTE_SITEMAP_END}.`,
  );
}
const sitemapWithHindiRoutes = [
  sitemapWithCities.slice(0, hindiRouteStart + HINDI_ROUTE_SITEMAP_START.length),
  "\n" + hindiRouteSitemapEntries + "\n  ",
  sitemapWithCities.slice(hindiRouteEnd),
].join("");
const blogSitemapEntries = indexableBlogPosts
  .map((post) => `  <url>
    <loc>${BASE_URL}/blog/${post.slug}</loc>
    <lastmod>${post.isoDate}</lastmod>
  </url>`)
  .join("\n");
const sitemapStart = sitemapWithHindiRoutes.indexOf(BLOG_SITEMAP_START);
const sitemapEnd = sitemapWithHindiRoutes.indexOf(BLOG_SITEMAP_END);
if (sitemapStart === -1 || sitemapEnd === -1 || sitemapEnd < sitemapStart) {
  throw new Error(
    `Sitemap template must contain ${BLOG_SITEMAP_START} and ${BLOG_SITEMAP_END}. Build aborted.`,
  );
}

let sitemapSource = [
  sitemapWithHindiRoutes.slice(0, sitemapStart + BLOG_SITEMAP_START.length),
  "\n" + blogSitemapEntries + "\n  ",
  sitemapWithHindiRoutes.slice(sitemapEnd),
].join("");
const sitemapBlogSlugs = [...sitemapSource.matchAll(
  new RegExp(`<loc>${BASE_URL}/blog/(?!category/)([^/<]+)</loc>`, "g"),
)].map((match) => match[1]);
const sitemapParityErrors = getBlogSlugParityErrors(
  indexableBlogPosts.map((post) => post.slug),
  sitemapBlogSlugs,
  "sitemap URL",
);
if (sitemapParityErrors.length > 0) {
  throw new Error([
    "Journal sitemap parity validation failed:",
    ...sitemapParityErrors.map((error) => `- ${error}`),
  ].join("\n"));
}
const sitemapRequiredUrls = [
  `${BASE_URL}/about`,
  `${BASE_URL}/hi`,
  ...hindiRoutes.map((route) => route.canonical),
  ...serviceGuides.map(
    (guide) => `${BASE_URL}${guide.routePath ?? `/services/${guide.slug}`}`,
  ),
  ...routes
    .filter((route) => route.path.startsWith("/blog/category/"))
    .map((route) => route.canonical),
  ...indexableCityRoutes.map((route) => `${BASE_URL}${route.path}`),
  ...indexableStateRoutes.map((route) => route.canonical),
  ...indexableBlogPosts.map((post) => `${BASE_URL}/blog/${post.slug}`),
];
const retiredServiceUrls = Object.keys(serviceGuideRouteData.legacyRedirects).map(
  (path) => `${BASE_URL}${path}`,
);
const staleServiceSitemapUrls = retiredServiceUrls.filter((url) =>
  sitemapSource.includes(`<loc>${escapeHtml(url)}</loc>`),
);
if (staleServiceSitemapUrls.length > 0) {
  throw new Error(`Sitemap contains ${staleServiceSitemapUrls.length} redirected service URLs: ${staleServiceSitemapUrls.join(", ")}`);
}
const missingSitemapUrls = sitemapRequiredUrls.filter(
  (url) => !sitemapSource.includes(`<loc>${escapeHtml(url)}</loc>`)
);
if (missingSitemapUrls.length > 0) {
  throw new Error(`Sitemap is missing ${missingSitemapUrls.length} required URLs: ${missingSitemapUrls.join(", ")}`);
}
const nonIndexableBlogSitemapUrls = [...noindexBlogSlugs]
  .map((slug) => `${BASE_URL}/blog/${slug}`)
  .filter((url) => sitemapSource.includes(`<loc>${escapeHtml(url)}</loc>`));
if (nonIndexableBlogSitemapUrls.length > 0) {
  throw new Error(
    `Sitemap contains noindex blog articles: ${nonIndexableBlogSitemapUrls.join(", ")}`,
  );
}
const bookingVariantSitemapUrls = bookingVariantRoutes
  .map((route) => `${BASE_URL}/booking?${route.bookingVariantSearch}`)
  .filter((url) => sitemapSource.includes(`<loc>${escapeHtml(url)}</loc>`));
if (bookingVariantSitemapUrls.length > 0) {
  throw new Error(
    `Sitemap contains booking query variants: ${bookingVariantSitemapUrls.join(", ")}`,
  );
}
const nonIndexableCitySitemapUrls = cityRoutes
  .filter((route) => !route.indexable)
  .map((route) => `${BASE_URL}${route.path}`)
  .filter((url) => sitemapSource.includes(`<loc>${url}</loc>`));
if (nonIndexableCitySitemapUrls.length > 0) {
  throw new Error([
    "Sitemap contains non-indexable city URLs:",
    ...nonIndexableCitySitemapUrls.map((url) => `- ${url}`),
  ].join("\n"));
}

const indexableSitemapRoutes = routes.filter((route) => route.indexable !== false);
const indexableSitemapUrls = indexableSitemapRoutes.map((route) => route.canonical);
if (new Set(indexableSitemapUrls).size !== indexableSitemapUrls.length) {
  throw new Error("Canonical indexable routes contain duplicate URLs before sitemap generation.");
}
const indexableRouteByCanonical = new Map(
  indexableSitemapRoutes.map((route) => [route.canonical, route]),
);
const lastmodInfoByCanonical = new Map(
  indexableSitemapRoutes.map((route) => [
    route.canonical,
    getSitemapRouteLastmodInfo(route),
  ]),
);
const lastmodByCanonical = new Map(
  [...lastmodInfoByCanonical].map(([canonical, info]) => [canonical, info.date]),
);
const legacyAliasPaths = new Set([
  ...Object.keys(serviceGuideRouteData.legacyRedirects),
  ...cityGuideRedirectPaths,
  "/blog/post-surgery-rehab-what-to-expect",
  "/physiotherapist-at-home/gurugram",
]);

function getSitemapAlternateTags(route) {
  return Object.entries(route.hreflangAlternates ?? {})
    .map(
      ([language, href]) =>
        `    <xhtml:link rel="alternate" hreflang="${escapeHtml(language)}" href="${escapeHtml(href)}" />`,
    )
    .join("\n");
}

function attachRouteLastmod(urlEntry) {
  const locMatch = urlEntry.match(/<loc>([^<]+)<\/loc>/);
  if (!locMatch) throw new Error(`Sitemap URL entry is missing a <loc>: ${urlEntry}`);
  const canonicalUrl = locMatch[1].replace(/&amp;/g, "&");
  const route = indexableRouteByCanonical.get(canonicalUrl);
  if (!route) {
    throw new Error(
      `Sitemap template contains a canonical URL with no indexable route: ${canonicalUrl}.`,
    );
  }
  const lastmod = lastmodByCanonical.get(canonicalUrl);
  if (!lastmod) {
    throw new Error(
      `Canonical indexable URL ${canonicalUrl} has no trustworthy source modification date.`,
    );
  }
  const alternateTags = getSitemapAlternateTags(route);
  const withLastmod = urlEntry
    .replace(/\s*<lastmod>[^<]*<\/lastmod>/g, "")
    .replace(/\s*<changefreq>[^<]*<\/changefreq>/g, "")
    .replace(/\s*<priority>[^<]*<\/priority>/g, "")
    .replace(/<\/loc>/, `</loc>\n    <lastmod>${lastmod}</lastmod>`);
  return alternateTags
    ? withLastmod.replace(/<\/url>/, `${alternateTags}\n  </url>`)
    : withLastmod;
}

sitemapSource = sitemapSource.replace(/<url>[\s\S]*?<\/url>/g, attachRouteLastmod);

function validateSitemapDocument(xml, label, expectedUrls) {
  if (/<(?:changefreq|priority)\b/i.test(xml)) {
    throw new Error(`${label} must not contain deprecated changefreq or priority tags.`);
  }

  const entries = [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((match) => match[1]);
  const locs = entries.map((entry) => {
    const locMatches = [...entry.matchAll(/<loc>([^<]+)<\/loc>/g)];
    if (locMatches.length !== 1) {
      throw new Error(`${label} entries must contain exactly one <loc>; found ${locMatches.length}.`);
    }
    const loc = locMatches[0][1].replace(/&amp;/g, "&");
    let parsedUrl;
    try {
      parsedUrl = new URL(loc);
    } catch {
      throw new Error(`${label} contains an invalid <loc>: ${loc}.`);
    }
    if (parsedUrl.origin !== BASE_ORIGIN || parsedUrl.protocol !== "https:") {
      throw new Error(`${label} <loc> must use the canonical HTTPS origin ${BASE_ORIGIN}: ${loc}.`);
    }
    if (parsedUrl.search || parsedUrl.hash) {
      throw new Error(`${label} <loc> must not contain a query or hash: ${loc}.`);
    }
    if (
      parsedUrl.pathname !== "/" &&
      (parsedUrl.pathname !== parsedUrl.pathname.toLowerCase() || parsedUrl.pathname.endsWith("/"))
    ) {
      throw new Error(`${label} <loc> is not a normalized canonical path: ${loc}.`);
    }
    if (legacyAliasPaths.has(parsedUrl.pathname)) {
      throw new Error(`${label} must not list redirected alias ${loc}.`);
    }

    const lastmodMatches = [...entry.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)];
    if (lastmodMatches.length !== 1) {
      throw new Error(`${label} entries must contain exactly one <lastmod>; ${loc} has ${lastmodMatches.length}.`);
    }
    validateSitemapDate(lastmodMatches[0][1], loc);
    return loc;
  });

  if (new Set(locs).size !== locs.length) {
    throw new Error(`${label} contains duplicate <loc> values.`);
  }
  const actualUrls = new Set(locs);
  const missingUrls = expectedUrls.filter((url) => !actualUrls.has(url));
  const unexpectedUrls = locs.filter((url) => !expectedUrls.includes(url));
  if (missingUrls.length > 0 || unexpectedUrls.length > 0) {
    throw new Error([
      `${label} route parity failed.`,
      ...missingUrls.map((url) => `- missing ${url}`),
      ...unexpectedUrls.map((url) => `- unexpected ${url}`),
    ].join("\n"));
  }
  if (locs.some((url) => url.startsWith(`${BASE_URL}/booking?`))) {
    throw new Error(`${label} must not contain booking query URLs.`);
  }
  return locs;
}

validateSitemapDocument(
  sitemapSource,
  "Generated sitemap",
  indexableSitemapUrls,
);
const sitemapUrlCount = [...sitemapSource.matchAll(/<url>/g)].length;
const sitemapByteLength = Buffer.byteLength(sitemapSource, "utf8");
if (sitemapUrlCount > 50_000 || sitemapByteLength > 50 * 1024 * 1024) {
  throw new Error(
    `Generated sitemap exceeds limits (${sitemapUrlCount} URLs, ${sitemapByteLength} bytes).`,
  );
}
fs.writeFileSync(path.join(distDir, "sitemap.xml"), sitemapSource, "utf8");
console.log(
  `✓ sitemap.xml generated with ${categorySitemapEntries ? categorySitemapEntries.split("<url>").length - 1 : 0} categories and ${indexableBlogPosts.length} indexable blog entries`,
);
const sitemapLastmodReport = {
  generatedAt: new Date().toISOString(),
  entries: Object.fromEntries(lastmodInfoByCanonical),
};
fs.writeFileSync(
  path.join(__dirname, "dist", "sitemap-lastmod-sources.json"),
  `${JSON.stringify(sitemapLastmodReport, null, 2)}\n`,
  "utf8",
);
const sampleLastmodPaths = [
  "/",
  "/booking",
  "/blog",
  "/blog/stroke-rehabilitation-at-home",
  "/blog/category/neuro-rehabilitation",
  "/services/clinical-assessment-evaluation",
  "/physiotherapist-at-home/jaipur",
  "/physiotherapist-at-home/noida",
  "/physiotherapist-at-home-in/rajasthan",
  "/hi",
];
console.log("Sitemap lastmod provenance samples:");
for (const samplePath of sampleLastmodPaths) {
  const sampleRoute = routes.find((route) => route.path === samplePath);
  if (!sampleRoute) continue;
  const info = lastmodInfoByCanonical.get(sampleRoute.canonical);
  if (!info) continue;
  console.log(
    `  ${sampleRoute.canonical}\t${info.date}\t${(info.sources ?? [info.source]).join("; ")}`,
  );
}
for (const [canonical, info] of lastmodInfoByCanonical) {
  if (!info.undatedSources?.length) continue;
  console.warn(
    `  ${canonical} includes uncommitted source(s) without a Git lastmod date: ${info.undatedSources.join("; ")}`,
  );
}

const homepageRoute = routes.find((route) => route.path === "/");
if (!homepageRoute || homepageRoute.indexable === false) {
  throw new Error("The supplemental sitemap requires an indexable homepage route.");
}
const hindiHomepageRoute = routes.find((route) => route.path === "/hi");
if (!hindiHomepageRoute || hindiHomepageRoute.indexable === false) {
  throw new Error("The supplemental sitemap requires the indexable Hindi homepage route.");
}
const sitemapInUrls = [
  homepageRoute.canonical,
  hindiHomepageRoute.canonical,
  ...indexableCityRoutes.map((route) => route.canonical),
  ...indexableHindiCityRoutes.map((route) => route.canonical),
];
if (new Set(sitemapInUrls).size !== sitemapInUrls.length) {
  throw new Error("The supplemental sitemap contains duplicate canonical URLs.");
}
for (const url of sitemapInUrls) {
  const parsedUrl = new URL(url);
  if (parsedUrl.origin !== BASE_ORIGIN || parsedUrl.search || parsedUrl.hash) {
    throw new Error(`Invalid canonical URL in the supplemental sitemap: ${url}`);
  }
}
for (const route of [...indexableCityRoutes, ...indexableHindiCityRoutes]) {
  if (
    !/^\/physiotherapist-at-home\/[^/]+$/.test(route.path) &&
    !/^\/hi\/physiotherapist-at-home\/[^/]+$/.test(route.path)
  ) {
    throw new Error(`Unexpected route in the supplemental city sitemap: ${route.path}`);
  }
}
const sitemapInEntries = sitemapInUrls
  .map((url) => {
    const route = indexableRouteByCanonical.get(url);
    const alternates = route ? getSitemapAlternateTags(route) : "";
    return [
      "  <url>",
      `    <loc>${escapeHtml(url)}</loc>`,
      `    <lastmod>${lastmodByCanonical.get(url)}</lastmod>`,
      alternates,
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  })
  .join("\n");
const sitemapInSource = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  sitemapInEntries,
  "</urlset>",
  "",
].join("\n");
validateSitemapDocument(sitemapInSource, "Supplemental sitemap", sitemapInUrls);
fs.writeFileSync(path.join(distDir, "sitemap-in.xml"), sitemapInSource, "utf8");
console.log(
  `✓ sitemap-in.xml generated with homepage and ${indexableCityRoutes.length + indexableHindiCityRoutes.length} indexable English and Hindi city pages`,
);

let count = 0;
for (const route of routes) {
  const outPath = route.outDir ? path.join(distDir, route.outDir) : distDir;
  if (route.outDir) fs.mkdirSync(outPath, { recursive: true });

  let html = buildHtml(route);

  // Render the full React component tree to HTML string using react-dom/server.
  // This ensures AI crawlers (GPTBot, ClaudeBot, PerplexityBot) and Google receive
  // the complete page body — service copy, article text, and internal links — in
  // the initial HTTP response, without requiring JavaScript execution.
  // The private admin dashboard is browser-only because it reads sessionStorage;
  // it receives a dedicated noindex shell instead of the homepage fallback.
  const rendered = route.clientOnly ? { html: "", head: "" } : render(route.path);
  // Preserve React's exact initial markup. The Hindi body is authored in Hindi;
  // shared-shell text is translated by LanguageProvider after client hydration.
  const appHtml = rendered.html;

  if (!route.clientOnly && (!appHtml || appHtml.trim().length < 100)) {
    throw new Error(`SSR render for ${route.path} produced no usable content (${appHtml?.length ?? 0} bytes). Build aborted.`);
  }

  if (!route.clientOnly) {
    const articleBootstrap = route.blogPost
      ? ` data-blog-post="${escapeHtml(JSON.stringify(route.blogPost))}"`
      : "";
    html = html.replace(`<div id="root"></div>`, `<div id="root"${articleBootstrap}>${appHtml}</div>`);
    if (rendered.head) {
      html = html.replace("</head>", `${rendered.head}\n</head>`);
    }
  }

  if (!route.clientOnly && html.includes('<div id="root"></div>')) {
    throw new Error(`SSR injection failed for ${route.path}: root div still empty after replace. Build aborted.`);
  }

  validateLocationSchemaIndexability(route, html);

  const fileSizeKb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(1);
  const bodyKb = (Buffer.byteLength(appHtml, "utf8") / 1024).toFixed(1);
  fs.writeFileSync(path.join(outPath, "index.html"), html, "utf8");
  const renderingMode = route.clientOnly ? "client-only shell" : `SSR body ${bodyKb} kB`;
  if (!route.bookingVariantSearch) {
    console.log(`✓ ${route.path}  (total ${fileSizeKb} kB, ${renderingMode})`);
  }
  count++;
}

console.log(`\nPrerendered ${count} routes — all pages ship full body HTML for crawlers.`);
const bookingVariantManifest = bookingVariantRoutes.map((route) => ({
  query: route.bookingVariantSearch,
  path: `/${route.outDir}`,
  title: route.title,
  description: route.description,
  heading: route.bookingVariantHeading,
  mode: route.bookingVariantMode,
  citySlug: route.bookingVariantCitySlug,
  cityName: route.bookingVariantCityName,
  localityId: route.bookingVariantLocalityId,
  localityName: route.bookingVariantLocalityName,
}));
fs.writeFileSync(
  path.join(distDir, ".booking-variants", "manifest.json"),
  JSON.stringify(bookingVariantManifest),
  "utf8",
);
console.log(`✓ Generated ${bookingVariantManifest.length} noindex booking variants.`);
fs.writeFileSync(
  path.join(__dirname, "dist", "city-guide-redirects.json"),
  JSON.stringify(Object.fromEntries([...cityGuideRedirects].sort(([left], [right]) => left.localeCompare(right))), null, 2),
  "utf8",
);
console.log(`✓ Generated ${cityGuideRedirects.size} retired city-guide redirects.`);

const llmsPath = path.join(distDir, "llms.txt");
if (!fs.existsSync(llmsPath)) {
  throw new Error("public/llms.txt was not copied into the production build");
}
console.log("✓ Published llms.txt content bundle");
