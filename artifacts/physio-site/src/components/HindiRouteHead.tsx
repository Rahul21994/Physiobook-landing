import { Helmet } from "react-helmet-async";
import { BUSINESS_CONFIG } from "@/config/business";

export type HindiRouteHeadRecord = {
  path: string;
  englishPath: string;
  title: string;
  description: string;
};

export function HindiRouteHead({
  route,
  structuredData = [],
}: {
  route: HindiRouteHeadRecord;
  structuredData?: readonly unknown[];
}) {
  const siteUrl = BUSINESS_CONFIG.siteUrl.replace(/\/$/, "");
  const canonical = `${siteUrl}${route.path}`;
  const englishUrl = `${siteUrl}${route.englishPath}`;

  return (
    <Helmet>
      <title>{route.title}</title>
      <meta name="description" content={route.description} />
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={canonical} />
      <link rel="canonical" href={canonical} />
      <link rel="alternate" hrefLang="hi-IN" href={canonical} />
      <link rel="alternate" hrefLang="en-IN" href={englishUrl} />
      <link rel="alternate" hrefLang="x-default" href={englishUrl} />
      {structuredData.map((schema, index) => (
        <script key={`hindi-route-schema-${index}`} type="application/ld+json">
          {JSON.stringify(schema).replace(/</g, "\\u003c")}
        </script>
      ))}
    </Helmet>
  );
}