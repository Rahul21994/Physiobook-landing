import {
  HINDI_CITY_ROUTE_PATTERN,
  hindiStaticRoutePages,
  type HindiStaticPage,
} from "./hindi-static-route-pages";

export { HINDI_CITY_ROUTE_PATTERN } from "./hindi-static-route-pages";

const hindiStaticRouteMetadata: Record<
  HindiStaticPage,
  {
    englishPath: string;
    title: string;
    description: string;
    revision: string;
    sourceFiles: readonly string[];
  }
> = {
  booking: {
    englishPath: "/booking",
    title: "घर पर फिजियोथेरेपिस्ट बुक करें",
    description:
      "घर पर मुलाक़ात और ऑनलाइन परामर्श सूचीबद्ध सभी 45 शहरों में उपलब्ध हैं; ऑनलाइन परामर्श दुनिया भर में भी उपलब्ध हैं।",
    revision: "booking-r1",
    sourceFiles: [
      "src/pages/booking.tsx",
      "src/lib/booking-index.ts",
      "src/lib/site-data.generated.ts",
      "src/lib/pricing.ts",
      "src/lib/hindi-city-routes.generated.json",
    ],
  },
  "online-care": {
    englishPath: "/online-care",
    title: "ऑनलाइन फिजियोथेरेपी परामर्श | Goswami Rehab",
    description:
      "दुनिया में कहीं से भी ऑनलाइन फिजियोथेरेपी परामर्श लें—गतिशीलता का आकलन, व्यक्तिगत व्यायाम, पुनर्वास योजना और प्रगति पर मार्गदर्शन।",
    revision: "online-care-r1",
    sourceFiles: [
      "src/pages/hindi-narrative-pages.tsx",
      "src/lib/pricing.ts",
      "src/lib/hindi-static-routes.ts",
    ],
  },
  contact: {
    englishPath: "/contact",
    title: "Goswami Rehab से संपर्क करें | परामर्श अनुरोध",
    description:
      "ऑनलाइन या प्रत्यक्ष फिजियोथेरेपी और पुनर्वास के लिए Goswami Rehab से संपर्क करें। ऑनलाइन परामर्श 24/7 उपलब्ध हैं; प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से है।",
    revision: "contact-r1",
    sourceFiles: [
      "src/pages/contact.tsx",
      "src/lib/contact-page-content.ts",
      "src/config/business.ts",
      "src/lib/hindi-static-routes.ts",
    ],
  },
  about: {
    englishPath: "/about",
    title: "घर पर फिजियोथेरेपी, स्पष्ट क्लिनिकल उद्देश्य के साथ।",
    description:
      "Goswami Rehab दिल्ली NCR सहित सूचीबद्ध 45 शहरों में घर पर फिजियोथेरेपी उपलब्ध कराता है। ऑनलाइन परामर्श दुनिया भर में उपलब्ध है।",
    revision: "about-r1",
    sourceFiles: [
      "src/pages/hindi-narrative-pages.tsx",
      "src/lib/data.ts",
      "src/config/business.ts",
      "src/lib/hindi-static-routes.ts",
    ],
  },
  "home-physiotherapy": {
    englishPath: "/home-physiotherapy",
    title: "घर पर फिजियोथेरेपी",
    description: "यह सेवा व्यक्ति की ज़रूरत के अनुसार घर पर फिजियोथेरेपी पर केंद्रित है।",
    revision: "about-r1",
    sourceFiles: [
      "src/pages/hindi-narrative-pages.tsx",
      "src/lib/hindi-static-route-pages.ts",
      "src/lib/hindi-static-routes.ts",
    ],
  },
};

export const hindiStaticRouteRegistry = hindiStaticRoutePages.map((route) => ({
  ...route,
  ...hindiStaticRouteMetadata[route.page],
}));

export function getHindiStaticRoute(page: HindiStaticPage) {
  return hindiStaticRouteRegistry.find((route) => route.page === page)!;
}