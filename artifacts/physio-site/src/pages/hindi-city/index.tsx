import { useParams, Link } from "wouter";
import "@/hindi-city.css";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  MessageCircle,
} from "lucide-react";
import { getHindiCityFaqs, getHindiCityRoute, hindiCityRoutes, getHindiCityPath } from "@/lib/hindi-city-routes";
import { journalDiscoveryIndex } from "@/lib/blog-index";
import { getCityBySlug } from "@/lib/cities";
import { getCityServiceThemes } from "@/lib/location-services";
import { states } from "@/lib/states";
import { pricing } from "@/lib/pricing";
import { BUSINESS_WHATSAPP_URL } from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { HindiRouteHead } from "@/components/HindiRouteHead";

const categoryLabels: Record<string, string> = {
  "Cardiopulmonary Rehabilitation": "हृदय और फेफड़ों का पुनर्वास",
  "Exercise Physiology": "व्यायाम-शरीरक्रिया",
  "Functional Rehabilitation": "कार्यक्षमता का पुनर्वास",
  "Geriatric Rehabilitation": "उम्रदराज़ लोगों का पुनर्वास",
  "Homecare Guide": "घर पर देखभाल की मार्गदर्शिका",
  "Neuro Rehabilitation": "न्यूरोलॉजिकल पुनर्वास",
  "Nutrition & Clinical Guidance": "पोषण और क्लिनिकल मार्गदर्शन",
  "Ortho Rehabilitation": "हड्डी-जोड़ों का पुनर्वास",
  "Orthopaedic Rehabilitation": "हड्डी-जोड़ों का पुनर्वास",
  "Paediatric Rehabilitation": "बच्चों का पुनर्वास",
  "Pulmonary Rehabilitation": "फेफड़ों का पुनर्वास",
  "Sports Rehabilitation": "खेल-पुनर्वास",
  "Women's Health": "महिलाओं का स्वास्थ्य",
};

function homeBooking(_slug: string) {
  return "/hi/booking";
}

function onlineBooking(_slug: string) {
  return "/hi/booking";
}

function JournalArticleCard({
  city,
  teaser,
  special = false,
}: {
  city: NonNullable<ReturnType<typeof getHindiCityRoute>>;
  teaser: { slug: string; title: string; excerpt: string };
  special?: boolean;
}) {
  const source = journalDiscoveryIndex.find((post) => post.slug === teaser.slug);
  if (!source) return null;
  const category = categoryLabels[source.category] ?? source.category;
  const isNew = source.isoDate.startsWith("2026");

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1">
      <div className="h-2 bg-primary" aria-hidden="true" />
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <span className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-foreground">
            {category}
          </span>
          <time
            dateTime={source.isoDate}
            aria-label={`प्रकाशित होने की तारीख: ${source.date}`}
            className="pt-1 text-right text-xs font-medium text-muted-foreground"
          >
            {isNew ? "नया · " : "प्रकाशित · "}
            {source.date}
          </time>
        </div>
        <h3 className="mb-3 font-serif text-xl font-bold leading-snug text-foreground md:text-2xl">
          {teaser.title}
        </h3>
        <p className="mb-5 flex-1 leading-relaxed text-muted-foreground">
          {teaser.excerpt}
        </p>
        <p className="mb-5 border-l-2 border-primary/40 pl-3 text-sm font-medium text-foreground">
          पूरा लेख अंग्रेज़ी में है।
        </p>
        <Link
          href={`/blog/${teaser.slug}`}
          onClick={() =>
            trackEvent("journal_article_click", {
              source: "city_journal",
              article_slug: teaser.slug,
              city: city.slug,
              special,
            })
          }
          className="inline-flex min-h-11 items-center justify-between gap-3 border-t border-border pt-4 text-sm font-semibold text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          अंग्रेज़ी में पूरा मार्गदर्शक पढ़ें।
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function HindiCityPage() {
  const params = useParams<{ city?: string; slug?: string }>();
  const city = getHindiCityRoute(params.city ?? params.slug);

  if (!city) {
    return <main data-no-translate className="min-h-[60vh] bg-background" aria-label="Goswami Rehab" />;
  }

  const bookingHref = homeBooking(city.slug);
  const hindiPath = getHindiCityPath(city.slug);
  const state = states.find((candidate) => candidate.citySlugs.includes(city.slug));
  const sourceCity = getCityBySlug(city.slug);
  const serviceLinks = new Map(
    sourceCity
      ? getCityServiceThemes(sourceCity).map((theme) => [theme.title, theme.href])
      : [],
  );
  const articleTeasers = city.journalCards;
  const allFaqs = getHindiCityFaqs(city);
  const focusLines = city.focusCopy ? city.focusCopy.split("\n") : [];

  return (
    <>
    <HindiRouteHead
      route={{
        path: hindiPath,
        englishPath: `/physiotherapist-at-home/${city.slug}`,
        title: city.title,
        description: city.description,
      }}
    />
    <main lang="hi" data-no-translate className="min-h-[100dvh] bg-background text-foreground">
      <section className="relative overflow-hidden border-b border-border/70 bg-accent/35">
        <div className="absolute inset-y-0 right-0 hidden w-[38%] border-l border-primary/15 bg-primary/5 lg:block" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-7 md:px-8 md:pb-20 md:pt-9">
          <nav aria-label="Breadcrumb" className="mb-10 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/hi" className="rounded-sm underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              होम
            </Link>
            <span aria-hidden="true">/</span>
            <span>शहर</span>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-foreground">{city.displayName}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-primary">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {city.displayName}, {city.stateName}
                {city.slug === "jaipur" && (
                  <span className="ml-2 rounded-full border border-primary/25 bg-background/80 px-3 py-1 text-xs">
                    संचालन केंद्र
                  </span>
                )}
              </p>
              <h1 className="font-serif text-4xl font-bold leading-[1.12] tracking-tight text-foreground md:text-6xl">
                {city.h1}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
                {city.displayName} में घर पर मुलाक़ात का अनुरोध किया जा सकता है। अपनी सही स्थानीय जगह और देखभाल की ज़रूरत बताएँ; बुकिंग से पहले टीम फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करेगी।
              </p>
              <p className="mt-5 flex max-w-2xl items-start gap-3 rounded-xl border border-primary/15 bg-background/75 p-4 text-sm leading-relaxed text-foreground">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                इस शहर में घर पर मुलाक़ात उपलब्ध है। बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
              </p>
              <Link
                href={bookingHref}
                data-booking-mode="home"
                data-booking-city={city.slug}
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                ऑनलाइन अनुरोध भेजें
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <aside className="relative rounded-2xl border border-primary/15 bg-background p-6 shadow-sm md:p-7">
              <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-primary">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                स्थानीय रिकवरी सहायता
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                इस शहर में घर पर मुलाक़ात उपलब्ध है। बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
              </p>
              <div className="mt-6 border-t border-border pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">पुष्टि की समय-सीमा</p>
                <p className="mt-2 font-serif text-2xl font-bold text-foreground">{city.confirmationWindow}</p>
              </div>
              <Link href={onlineBooking(city.slug)} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                दुनिया भर में ऑनलाइन परामर्श उपलब्ध है।
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-border/70 py-14 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:px-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="mb-3 text-sm font-semibold text-primary">स्थानीय रिकवरी सहायता</p>
            <h2 className="font-serif text-3xl font-bold leading-tight md:text-4xl">आपकी रोज़मर्रा की ज़िंदगी के अनुसार पुनर्वास</h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {city.localFocus && <p>{city.localFocus}</p>}
            {city.careContext && <p>{city.careContext}</p>}
            {focusLines.length > 0 && (
              <div className="border-l-2 border-primary/35 pl-5">
                <p className="mb-3 font-semibold text-foreground">स्थानीय इलाकों के संदर्भ</p>
                <ul className="space-y-3">
                  {focusLines.map((line, index) => <li key={`${city.slug}-focus-${index}`}>{line}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {(state || city.relatedCitySlugs.length > 0) && (
        <section className="bg-accent/25 py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            {state && (
              <p className="mb-7 max-w-3xl">
                <Link
                  href={`/physiotherapist-at-home-in/${state.slug}`}
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {city.displayName} से आगे के विकल्प देख रहे हैं? {city.stateName} में फिजियोथेरेपी विकल्प देखें।
                </Link>
              </p>
            )}
            {city.relatedCitySlugs.length > 0 && (
              <>
                <p className="mb-2 text-sm font-semibold text-primary">संबंधित शहरों के पेज</p>
                <h2 className="mb-3 font-serif text-3xl font-bold">आसपास के स्थानों की तुलना करें</h2>
                <p className="mb-7 max-w-3xl leading-relaxed text-muted-foreground">
                  हर शहर के लिंक की अपनी home-visit उपलब्धता है। पास के शहरों के पेज एक साझा टीम या सेवा-क्षेत्र का संकेत नहीं देते।
                </p>
                <div className="flex flex-wrap gap-3">
                  {city.relatedCitySlugs.map((slug) => {
                    const related = getHindiCityRoute(slug);
                    if (!related) return null;
                    return (
                      <Link key={slug} href={`/hi/physiotherapist-at-home/${slug}`} className="group inline-flex min-h-12 items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm font-semibold hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        <span>{related.displayName}</span>
                        <span className="text-xs font-normal text-muted-foreground">घर पर मुलाक़ात उपलब्ध; इलाके की पुष्टि आवश्यक।</span>
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section id="localities" className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><MapPin className="h-4 w-4" aria-hidden="true" />इलाकों के संदर्भ</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">{city.displayName} में फिजियोथेरेपी का अनुरोध</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              नीचे दिए गए इलाके आपके स्थान का वर्णन करने में मदद के लिए हैं। इस शहर में घर पर मुलाक़ात उपलब्ध है; बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
            </p>
            <div className="mt-6 border-t border-border pt-5">
              <h3 className="font-serif text-2xl font-bold">स्थान और उपलब्धता</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                 {city.localityReferences.slice(0, 3).join(", ")} इलाके बताने के लिए संदर्भ हैं, पक्के सेवा-क्षेत्र नहीं। इस शहर में घर पर मुलाक़ात उपलब्ध है; बुकिंग से पहले सही पते और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
              </p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {city.localities.map((locality) => {
              const whatsappMessage = `नमस्ते Goswami Rehab, मैं ${locality}, ${city.displayName} में घर पर फिजियोथेरेपी की उपलब्धता जानना चाहता/चाहती हूँ।`;
              return (
                <article key={locality} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
                  <h3 className="font-serif text-xl font-bold">{locality} में घर पर मुलाक़ात का अनुरोध</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    अपना सही स्थान बताते समय {locality} को इलाके के संदर्भ के रूप में लिखें। केवल इस नाम से घर पर मुलाक़ात की उपलब्धता की पुष्टि नहीं होती।
                  </p>
                  <p className="mb-3 mt-5 text-xs font-semibold text-muted-foreground">अपने लिए उपयुक्त विकल्प चुनें</p>
                  <Link
                    href={bookingHref}
                    data-booking-mode="home"
                    data-booking-city={city.slug}
                    onClick={() => trackEvent("locality_cta_click", { route: "hindi-city", city: city.slug, locality, channel: "booking" })}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <CalendarDays className="h-4 w-4" aria-hidden="true" />
                    घर पर मुलाक़ात की उपलब्धता जाँचें
                  </Link>
                  {BUSINESS_WHATSAPP_URL && (
                    <a
                      href={`${BUSINESS_WHATSAPP_URL}?text=${encodeURIComponent(whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("locality_cta_click", { route: "hindi-city", city: city.slug, locality, channel: "whatsapp" })}
                      className="mt-2 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      WhatsApp पर तुरंत सहायता
                    </a>
                  )}
                  <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
                    अपना सही इलाका और पसंदीदा समय बताएँ; बुकिंग से पहले टीम फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करेगी।
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-border/70 bg-accent/20 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-primary">सरल और तेज़</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">घर पर फिजियोथेरेपी कैसे काम करती है?</h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-2">
            {[
              ["अपना स्थान बताएँ।", "इलाके के संदर्भ का उपयोग करें और घर पर मुलाक़ात के अनुरोध में अपना सही पता दें।"],
              ["अपनी देखभाल चुनें।", "घर पर मुलाक़ात और ऑनलाइन परामर्श की तुलना करें और मौजूदा शुल्क देखें।"],
              ["अनुरोध भेजें।", "टीम को अपनी चिंता और पसंदीदा तारीख बताएँ।"],
              ["उपलब्धता की पुष्टि।", "बुकिंग से पहले टीम सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करती है।"],
            ].map(([title, description], index) => (
              <li key={title} className="flex gap-4 rounded-xl border border-border/70 bg-background p-5 md:p-6">
                <span className="font-mono text-sm font-bold text-primary">0{index + 1}</span>
                <p className="leading-relaxed"><strong>{title}</strong> {description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-primary">अपनी देखभाल चुनें</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">{city.displayName} के लिए उपयुक्त देखभाल</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">उपलब्ध विकल्प देखें, शुल्क समझें और अपना अनुरोध ऑनलाइन भेजें।</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-2">
            <article className="flex flex-col rounded-2xl border border-primary/25 bg-card p-6 md:p-8">
              <p className="text-sm font-semibold text-primary">घर पर मुलाक़ात</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {city.displayName} में घर पर मुलाक़ात उपलब्ध है; बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
              </p>
              <p className="mt-6 font-serif text-3xl font-bold">{pricing.homeVisit.amount}</p>
              <p className="text-sm text-muted-foreground">प्रति सत्र।</p>
              <ul className="my-6 space-y-3 text-sm leading-relaxed">
                <li>आपकी स्थिति के अनुसार विशेषज्ञ का मिलान।</li>
                <li>आपके अपने घर पर देखभाल।</li>
                <li>पुष्टि: {city.confirmationWindow} के भीतर पुष्टि।</li>
              </ul>
              <Link href={bookingHref} data-booking-mode="home" data-booking-city={city.slug} className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                घर पर मुलाक़ात बुक करें <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
            <article className="flex flex-col rounded-2xl border border-border bg-accent/25 p-6 md:p-8">
              <p className="text-sm font-semibold text-primary">ऑनलाइन परामर्श</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">दुनिया भर में ऑनलाइन परामर्श उपलब्ध है।</p>
              <p className="mt-6 font-serif text-3xl font-bold">{pricing.telehealth.displayAmount}</p>
              <p className="text-sm text-muted-foreground">प्रति परामर्श।</p>
              <ul className="my-6 space-y-3 text-sm leading-relaxed">
                <li>वीडियो आकलन और व्यायाम मार्गदर्शन।</li>
                <li>Google Meet, Zoom या WhatsApp वीडियो चुनें।</li>
                <li>उसी दिन पुष्टि: आमतौर पर 6 घंटे के भीतर, अधिकतम 12 घंटे में।</li>
              </ul>
              <Link href={onlineBooking(city.slug)} data-booking-mode="telehealth" data-booking-city={city.slug} className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/30 bg-background px-5 py-3 font-semibold text-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                ऑनलाइन परामर्श बुक करें <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </article>
          </div>
          <p className="mt-6 max-w-4xl text-sm leading-relaxed text-muted-foreground">
            अंतिम शुल्क अपॉइंटमेंट से पहले पुष्टि किया जाएगा; यह सत्र के प्रकार, विशेषज्ञ और पुनर्वास योजना के अनुसार अलग हो सकता है।
          </p>
          <div className="mt-7 rounded-xl border border-border bg-card px-5 py-4 text-sm leading-relaxed text-muted-foreground">
            <p className="font-semibold text-foreground">अनुरोध से देखभाल तक का स्पष्ट रास्ता।</p>
            <p className="mt-1">अनुरोध की समीक्षा होगी; टीम से बात होने तक अपॉइंटमेंट की पुष्टि नहीं होती। अनुरोध भेजने पर कोई शुल्क नहीं लगता। भुगतान आवश्यक हो तो अनुरोध की समीक्षा के बाद टीम उस पर बात करेगी।</p>
          </div>
        </div>
      </section>

      <section className="bg-accent/25 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-primary">हम क्या सेवाएँ देते हैं</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">{city.displayName} में घर पर फिजियोथेरेपी सेवाएँ</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              इस सेवा में {city.displayName} के लिए चुने गए पुनर्वास विषय शामिल हैं। देखभाल आकलन के बाद चुनी जाती है; बुकिंग से पहले सही home-visit locality और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {city.serviceThemes.map((theme) => (
              <article key={theme.sourceTitle} className="rounded-xl border border-border bg-background p-5">
                <h3 className="font-serif text-xl font-bold">{theme.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {theme.title} पर विशेषज्ञ से चर्चा करें। इस शहर में घर पर मुलाक़ात उपलब्ध है; बुकिंग से पहले सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
                </p>
                <p className="mt-4 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">
                  <strong className="text-foreground">साक्ष्य का आधार (स्रोत का मूल अंग्रेज़ी शीर्षक):</strong> {theme.sourceTitle}
                </p>
                <Link href={serviceLinks.get(theme.sourceTitle) ?? "/services/clinical-assessment-evaluation"} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                  सेवा के बारे में जानें <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <p className="mt-7 text-sm leading-relaxed text-muted-foreground">
            {city.displayName} में केंद्रित रिकवरी योजना के लिए <Link href="/home-physiotherapy" className="font-semibold text-primary underline-offset-4 hover:underline">घर पर फिजियोथेरेपी</Link> या <Link href="/services/clinical-assessment-evaluation" className="font-semibold text-primary underline-offset-4 hover:underline">क्लिनिकल आकलन</Link> देखें।
          </p>
          <Link href={bookingHref} className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline-offset-4 hover:underline">
            घर पर मुलाक़ात की उपलब्धता जाँचें <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {articleTeasers.length > 0 && (
        <section className="border-t border-border py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-9 max-w-3xl">
              <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary"><BookOpen className="h-4 w-4" aria-hidden="true" />पुनर्वास जर्नल से</p>
              <h2 className="font-serif text-3xl font-bold md:text-4xl">आपकी रिकवरी के लिए पुनर्वास मार्गदर्शिकाएँ</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                {city.displayName} में घर पर जिन स्वास्थ्य और पुनर्वास सवालों पर मरीज़ और परिवार विचार कर रहे हों, उनके लिए व्यावहारिक और साक्ष्य-आधारित जानकारी पढ़ें।
              </p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {articleTeasers.map((teaser) => (
                <JournalArticleCard key={teaser.slug} city={city} teaser={teaser} />
              ))}
            </div>
          </div>
        </section>
      )}

      {city.specialJournalSection && (
        <section className="border-t border-border bg-accent/20 py-14 md:py-16">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="mb-8 max-w-3xl">
              <p className="mb-3 text-sm font-semibold text-primary">{city.specialJournalSection.eyebrow}</p>
              <h2 className="font-serif text-3xl font-bold">{city.specialJournalSection.heading}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{city.specialJournalSection.introduction}</p>
            </div>
            <div className="max-w-xl">
              <JournalArticleCard
                city={city}
                special
                teaser={{
                  slug: city.specialJournalSection.slug,
                  title: city.specialJournalSection.title,
                  excerpt: city.specialJournalSection.excerpt,
                }}
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-primary">पुनर्वास सहायता</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">{city.displayName} में आपकी रिकवरी के लिए फिजियोथेरेपी-आधारित पुनर्वास</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              हमारे फिजियोथेरेपिस्ट नीचे दी गई पुनर्वास ज़रूरतों वाले लोगों को रिकवरी, गतिशीलता, ताकत, साँस, संतुलन और रोज़मर्रा के कामकाज में सहायता देते हैं। आपकी योजना आपके आकलन, घर के वातावरण और रिकवरी के लक्ष्यों के अनुसार बनाई जाती है।
            </p>
          </div>
          <ul className="flex flex-wrap gap-2.5">
            {city.conditionLabels.map((condition) => (
              <li key={condition} className="rounded-full border border-primary/20 bg-accent/40 px-4 py-2 text-sm font-semibold">{condition}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-y border-border bg-accent/20 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-9 max-w-3xl">
            <p className="mb-3 text-sm font-semibold text-primary">मरीज़ हमें क्यों चुनते हैं</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">आपके घर पर सही फिजियोथेरेपिस्ट</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Goswami Rehab {city.displayName} में घर पर फिजियोथेरेपी देता है, सही इलाके और फिजियोथेरेपिस्ट की पुष्टि के अधीन। 35+ विशेषज्ञ फिजियोथेरेपिस्ट में न्यूरोलॉजिकल, हृदय-फेफड़ों और हड्डी-जोड़ों के पुनर्वास विशेषज्ञ शामिल हैं।
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr]">
            <ul className="space-y-3">
              {[
                "सामान्य सेवाप्रदाता नहीं, वरिष्ठ विशेषज्ञ फिजियोथेरेपिस्ट।",
                `${city.displayName} में घर पर मुलाक़ात उपलब्ध; बुकिंग से पहले सही इलाके की पुष्टि।`,
                "मरीज़-केंद्रित पुनर्वास।",
                "पुष्टि हुई उपलब्धता के अधीन, ज़रूरी उपकरणों के साथ घर पर सत्र।",
                "नियमित प्रगति की निगरानी और दोबारा आकलन।",
                "अपने फिजियोथेरेपिस्ट से सीधे WhatsApp पर संपर्क।",
                "दुनिया भर में टेलीहेल्थ अनुवर्ती सहायता उपलब्ध।",
              ].map((text) => (
                <li key={text} className="flex items-start gap-3 rounded-lg border border-border/70 bg-background p-4 text-sm leading-relaxed">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />{text}
                </li>
              ))}
            </ul>
            <div className="grid grid-cols-2 gap-3 self-start">
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-serif text-3xl font-bold text-primary">35+</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">विशेषज्ञ फिजियोथेरेपिस्ट</p>
              </div>
              <div className="rounded-xl border border-border bg-background p-5">
                <p className="font-serif text-3xl font-bold text-primary">15+</p><p className="mt-1 text-sm leading-relaxed text-muted-foreground">भारत के राज्य</p>
              </div>
              <div className="col-span-2 rounded-xl border border-border bg-background p-5">
                <p className="font-semibold">जटिल मामलों के लिए सहायता उपलब्ध</p>
              </div>
            </div>
          </div>
          {city.testimonials.length > 0 && (
            <div className="mt-12">
                <h3 className="mb-5 font-serif text-2xl font-bold">
                  {city.reviewMode === "city" ? "मरीज़ों द्वारा साझा अनुभव" : "टीम के बारे में साझा अनुभव"}
                </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {city.testimonials.map((testimonial, index) => (
                  <figure key={`${testimonial.author}-${index}`} className="rounded-2xl border border-border bg-background p-6 md:p-7">
                    <blockquote className="font-serif text-lg leading-relaxed text-foreground">“{testimonial.quote}”</blockquote>
                    <figcaption className="mt-5 border-t border-border pt-4">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{testimonial.label}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="city-faq" className="py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <div className="mb-9">
            <p className="mb-2 text-sm font-semibold text-primary">{city.displayName} में घर पर फिजियोथेरेपी</p>
            <h2 className="font-serif text-3xl font-bold md:text-4xl">अक्सर पूछे जाने वाले प्रश्न</h2>
          </div>
          <div className="space-y-3">
            {allFaqs.map((faq, index) => (
              <details key={`${faq.question}-${index}`} className="group rounded-xl border border-border bg-card">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  {faq.question}
                  <span className="text-xl font-normal text-primary transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="border-t border-border px-5 py-4 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-primary/15 bg-accent/40 py-14 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="rounded-3xl border border-border bg-background p-7 shadow-sm md:p-12">
            <p className="mb-3 text-sm font-semibold text-primary">Goswami Rehab · {city.displayName}</p>
            <h2 className="max-w-3xl font-serif text-3xl font-bold leading-tight md:text-5xl">आज ही {city.displayName} में घर पर फिजियोथेरेपिस्ट बुक करें</h2>
            <p className="mt-5 max-w-3xl leading-relaxed text-muted-foreground">
              अपनी देखभाल चुनें और बुकिंग अनुरोध ऑनलाइन भेजें। घर पर मुलाक़ात के लिए हम {city.confirmationWindow} में सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करते हैं। ऑनलाइन परामर्श की पुष्टि उसी दिन—आमतौर पर 6 घंटे के भीतर और अधिकतम 12 घंटे में—की जाती है।
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href={bookingHref} data-booking-mode="home" data-booking-city={city.slug} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2">
                ऑनलाइन अनुरोध भेजें <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              {BUSINESS_WHATSAPP_URL && (
                <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-border px-6 py-3 font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  कोई सवाल है? WhatsApp पर पूछें <MessageCircle className="h-4 w-4" aria-hidden="true" />
                </a>
              )}
            </div>
            <p className="mt-6 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
              घर पर मुलाक़ात {pricing.homeVisit.amount} · ऑनलाइन परामर्श {pricing.telehealth.amount} · घर पर मुलाक़ात की उपलब्धता की पुष्टि {city.confirmationWindow} में · ऑनलाइन पुष्टि उसी दिन (आमतौर पर 6 घंटे, अधिकतम 12 घंटे में)।
            </p>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}