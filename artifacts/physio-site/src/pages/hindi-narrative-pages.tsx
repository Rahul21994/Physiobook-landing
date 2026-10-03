import "@/hindi-static.css";
import { ArrowRight, Clock3, ShieldCheck } from "lucide-react";
import { Link } from "wouter";
import { HindiRouteHead } from "@/components/HindiRouteHead";
import { Button } from "@/components/ui/button";
import { BUSINESS_CONFIG } from "@/config/business";
import { BLOG_AUTHOR_PROFILE } from "@/lib/data";
import { getHindiStaticRoute } from "@/lib/hindi-static-routes";
import { pricing } from "@/lib/pricing";

const aboutRoute = getHindiStaticRoute("about");
const homePhysiotherapyRoute = getHindiStaticRoute("home-physiotherapy");
const onlineCareRoute = getHindiStaticRoute("online-care");

const sectionClass = "mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-18";
const cardClass = "rounded-2xl border border-border/70 bg-card p-6 shadow-sm md:p-8";

export function HindiAboutPage() {
  const office = BUSINESS_CONFIG.headOffice;

  return (
    <>
      <HindiRouteHead route={aboutRoute} />
      <main lang="hi" data-no-translate className="min-h-[100dvh] bg-background text-foreground">
        <section className="border-b border-border/70 bg-accent/35">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
              Goswami Rehab के बारे में
            </p>
            <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              घर पर फिजियोथेरेपी, स्पष्ट क्लिनिकल उद्देश्य के साथ।
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Goswami Rehab दिल्ली NCR सहित सूचीबद्ध 45 शहरों में घर पर फिजियोथेरेपी उपलब्ध कराता है। मुलाक़ात से पहले सही इलाके और स्थानीय फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है। ऑनलाइन परामर्श दुनिया भर में उपलब्ध है।
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                संस्थापक और क्लिनिकल नेतृत्व
              </p>
              <h2 className="font-serif text-3xl font-bold">Dr. Rahul Goswami</h2>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                {BLOG_AUTHOR_PROFILE.role} · {BLOG_AUTHOR_PROFILE.credential}
              </p>
            </div>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Dr. Rahul Goswami PT, वरिष्ठ फिजियोथेरेपिस्ट और व्यायाम-शरीरक्रिया विशेषज्ञ हैं तथा IIM Madras से जुड़े हैं। उनका काम फिजियोथेरेपी, चिकित्सकीय व्यायाम, गतिविधि-अभ्यास और व्यावहारिक पोषण मार्गदर्शन को जोड़ता है। यह उन लोगों के लिए है जो बेहतर कार्यक्षमता और स्वतंत्रता की दिशा में काम कर रहे हैं।
            </p>
          </div>
        </section>

        <section className="border-y border-border/70 bg-muted/20">
          <div className={sectionClass}>
            <h2 className="max-w-3xl font-serif text-3xl font-bold md:text-4xl">
              Goswami Rehab क्या करता है
            </h2>
            <p className="mt-5 max-w-4xl text-lg leading-relaxed text-muted-foreground">
              यह सेवा व्यक्ति की ज़रूरत के अनुसार घर पर फिजियोथेरेपी पर केंद्रित है। इसमें न्यूरोलॉजिकल पुनर्वास, सर्जरी के बाद पुनर्वास, हृदय-फेफड़ों से जुड़ा पुनर्वास, हड्डी-जोड़ों की रिकवरी, जटिल मामलों का पुनर्वास और रोज़मर्रा के कामकाज का प्रशिक्षण शामिल हो सकता है। देखभाल शुरू होने से पहले उपयुक्त पेशेवर, सेवा का दायरा, उपलब्धता और अपॉइंटमेंट का विवरण पुष्टि किया जाता है।
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              पहला कदम समझने के लिए{" "}
              <Link className="font-semibold text-primary underline underline-offset-4" href="/services/clinical-assessment-evaluation">
                क्लिनिकल आकलन का तरीका
              </Link>{" "}
              पढ़ें, या{" "}
              <Link className="font-semibold text-primary underline underline-offset-4" href="/cities">
                शहर के अनुसार घर पर मुलाक़ात की उपलब्धता
              </Link>{" "}
              देखें।
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                "घर पर फिजियोथेरेपी",
                "न्यूरोलॉजिकल पुनर्वास",
                "सर्जरी के बाद पुनर्वास",
                "हृदय-फेफड़ों से जुड़ा पुनर्वास",
                "रोज़मर्रा के कामकाज का प्रशिक्षण",
                "पोषण परामर्श",
              ].map((service) => (
                <li key={service} className="rounded-xl border border-border/70 bg-background px-4 py-3 font-medium">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <h2 className="mb-3 font-serif text-3xl font-bold">
                प्रशिक्षित होम-विज़िट नेटवर्क
              </h2>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                {office.branchName}, {BUSINESS_CONFIG.name} का जयपुर स्थित मुख्य कार्यालय और डॉक्टर प्रशिक्षण केंद्र है। यह केवल अपॉइंटमेंट पर संचालन और क्लिनिशियन प्रशिक्षण के लिए उपयोग किया जाता है; यह मरीज़ों का क्लिनिक या बिना अपॉइंटमेंट आने की उपचार-स्थली नहीं है। Goswami Rehab के देखभाल नेटवर्क में शामिल होने से पहले फिजियोथेरेपिस्ट को टीम की आकलन, संवाद और घर पर देखभाल की प्रक्रिया के अनुसार प्रशिक्षण दिया जाता है। स्थानीय उपलब्धता की पुष्टि अलग से की जाती है।
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                ऑनलाइन परामर्श 24/7 उपलब्ध हैं। प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से होती है। घर पर मुलाक़ात मरीज़ के पते पर तय होती है, मुख्य कार्यालय में नहीं। उपयुक्त देखभाल का प्रकार तय करने से पहले टीम व्यक्ति का स्थान, क्लिनिकल ज़रूरत, पेशेवर दायरा और उपलब्धता जाँचती है।
              </p>
            </div>
            <address className={`${cardClass} not-italic`}>
              <p className="font-semibold text-foreground">
                Goswami Rehab (मुख्य कार्यालय: {office.branchName})
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                मुख्य कार्यालय और डॉक्टर प्रशिक्षण केंद्र — केवल अपॉइंटमेंट से
              </p>
              <p className="mt-4 leading-relaxed">{office.address.displayAddress}</p>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                यह संचालन और क्लिनिशियन प्रशिक्षण का कार्यालय है; मरीज़ों का क्लिनिक या बिना अपॉइंटमेंट आने की उपचार-स्थली नहीं।
              </p>
              {office.googleMapsUrl && (
                <a
                  className="mt-5 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4"
                  href={office.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  मुख्य कार्यालय का नक्शा देखें
                </a>
              )}
            </address>
          </div>
        </section>

        <section className="border-y border-border/70 bg-muted/20">
          <div className={sectionClass}>
            <h2 className="mb-3 font-serif text-3xl font-bold">पुनर्वास जर्नल</h2>
            <p className="mt-5 max-w-4xl leading-relaxed text-muted-foreground">
              जर्नल में फिजियोथेरेपी, व्यायाम, रिकवरी और घर पर देखभाल के बारे में सामान्य जानकारी दी जाती है। लेख निदान नहीं हैं और प्रत्यक्ष आकलन का विकल्प नहीं हैं। हर व्यक्ति की उपचार योजना और परिणाम अलग हो सकते हैं; अपनी स्थिति के बारे में किसी उपयुक्त स्वास्थ्य पेशेवर से बात करें।
            </p>
            <Link
              href="/blog"
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-primary underline underline-offset-4"
            >
              स्थिति और रिकवरी से जुड़े मार्गदर्शकों के लिए पुनर्वास जर्नल देखें
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="max-w-4xl">
            <h2 className="mb-3 font-serif text-3xl font-bold">समन्वित और व्यावहारिक देखभाल</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              हर अनुरोध में व्यक्ति का स्थान, स्वास्थ्य संबंधी चिंता, लक्ष्य और पसंदीदा देखभाल का प्रकार समझा जाता है। टीम समीक्षा करती है कि घर पर मुलाक़ात या ऑनलाइन परामर्श उपयुक्त है या नहीं, स्थानीय पेशेवर की उपलब्धता की पुष्टि करती है, और उपचार शुरू होने से पहले सत्र का विवरण साझा करती है। पुनर्वास के दौरान फिजियोथेरेपिस्ट व्यायामों को घर के वातावरण के अनुसार बदल सकते हैं और ज़रूरत पड़ने पर मरीज़ की मेडिकल टीम से समन्वय कर सकते हैं।
            </p>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Goswami Rehab किसी निश्चित परिणाम या सभी के लिए एक जैसी समय-सीमा का वादा नहीं करता। प्रगति निदान, चिकित्सकीय सलाह, नियमित अभ्यास, घर के सहयोग और कई अन्य बातों पर निर्भर करती है। उद्देश्य है स्पष्ट संवाद, मापे जा सकने वाले कार्यात्मक लक्ष्य और रोज़मर्रा के जीवन के लिए सुरक्षित तथा व्यावहारिक योजना।
            </p>
            <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-6">
              <p className="font-semibold text-primary">45 सूचीबद्ध शहर।</p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                दिल्ली NCR सहित सूचीबद्ध शहरों में घर पर मुलाक़ात का समन्वय किया जाता है। सही इलाके और स्थानीय पेशेवर की उपलब्धता की पुष्टि ज़रूरी है। ऑनलाइन परामर्श दुनिया भर के लोगों के लिए उपलब्ध हैं।
              </p>
              <h3 className="mt-5 font-serif text-2xl font-bold">देखभाल पर बात करना चाहते हैं?</h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                अपना स्थान और रिकवरी से जुड़ी ज़रूरत बताएँ। टीम पुष्टि करेगी कि अनुरोधित सेवा आपके लिए उपलब्ध है या नहीं।
              </p>
            </div>
            <div className="mt-8">
              <Button asChild size="lg" className="min-h-12 rounded-full px-6">
                <Link href="/hi/booking">अपॉइंटमेंट बुक करें।</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export function HindiHomePhysiotherapyPage() {
  return (
    <>
      <HindiRouteHead route={homePhysiotherapyRoute} />
      <main lang="hi" data-no-translate className="min-h-[100dvh] bg-background text-foreground">
        <section className="border-b border-border/70 bg-accent/35">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <p className="mb-4 text-sm font-semibold tracking-wide text-primary">
              Goswami Rehab के बारे में
            </p>
            <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              घर पर फिजियोथेरेपी, स्पष्ट क्लिनिकल उद्देश्य के साथ।
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Goswami Rehab दिल्ली NCR सहित सूचीबद्ध 45 शहरों में घर पर फिजियोथेरेपी उपलब्ध कराता है। मुलाक़ात से पहले सही इलाके और स्थानीय फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है। ऑनलाइन परामर्श दुनिया भर में उपलब्ध है।
            </p>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="max-w-4xl">
            <h2 className="mb-3 font-serif text-3xl font-bold">Goswami Rehab क्या करता है</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              यह सेवा व्यक्ति की ज़रूरत के अनुसार घर पर फिजियोथेरेपी पर केंद्रित है। इसमें न्यूरोलॉजिकल पुनर्वास, सर्जरी के बाद पुनर्वास, हृदय-फेफड़ों से जुड़ा पुनर्वास, हड्डी-जोड़ों की रिकवरी, जटिल मामलों का पुनर्वास और रोज़मर्रा के कामकाज का प्रशिक्षण शामिल हो सकता है। देखभाल शुरू होने से पहले उपयुक्त पेशेवर, सेवा का दायरा, उपलब्धता और अपॉइंटमेंट का विवरण पुष्टि किया जाता है।
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              <li className={cardClass}>घर पर फिजियोथेरेपी</li>
              <li className={cardClass}>न्यूरोलॉजिकल पुनर्वास</li>
              <li className={cardClass}>सर्जरी के बाद पुनर्वास</li>
              <li className={cardClass}>हृदय-फेफड़ों से जुड़ा पुनर्वास</li>
              <li className={cardClass}>रोज़मर्रा के कामकाज का प्रशिक्षण</li>
              <li className={cardClass}>पोषण परामर्श</li>
            </ul>
          </div>
        </section>

        <section className="border-y border-border/70 bg-muted/20">
          <div className={sectionClass}>
            <div className="max-w-4xl rounded-2xl border border-primary/15 bg-primary/5 p-6 md:p-8">
              <p className="font-semibold text-primary">45 सूचीबद्ध शहर।</p>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                दिल्ली NCR सहित सूचीबद्ध शहरों में घर पर मुलाक़ात का समन्वय किया जाता है। सही इलाके और स्थानीय पेशेवर की उपलब्धता की पुष्टि ज़रूरी है। ऑनलाइन परामर्श दुनिया भर के लोगों के लिए उपलब्ध हैं।
              </p>
              <h2 className="mt-5 font-serif text-2xl font-bold">देखभाल पर बात करना चाहते हैं?</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                अपना स्थान और रिकवरी से जुड़ी ज़रूरत बताएँ। टीम पुष्टि करेगी कि अनुरोधित सेवा आपके लिए उपलब्ध है या नहीं।
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button asChild size="lg" className="min-h-12 rounded-full px-6">
                  <Link href="/hi/booking" data-booking-mode="home">
                    अपॉइंटमेंट बुक करें।
                  </Link>
                </Button>
                <Link
                  href="/hi"
                  className="inline-flex min-h-12 items-center font-semibold text-primary underline underline-offset-4"
                >
                  45 सूचीबद्ध शहर।
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export function HindiOnlineCarePage() {
  return (
    <>
      <HindiRouteHead route={onlineCareRoute} />
      <main lang="hi" data-no-translate className="min-h-[100dvh] bg-background text-foreground">
        <section className="border-b border-border/70 bg-accent/35">
          <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-primary">
              <Clock3 className="h-4 w-4" aria-hidden="true" />
              ऑनलाइन परामर्श · दुनिया भर में
            </p>
            <h1 className="max-w-4xl font-serif text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              स्पष्ट और व्यावहारिक रिकवरी मार्गदर्शन के लिए ऑनलाइन फिजियोथेरेपी परामर्श
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Goswami Rehab के फिजियोथेरेपिस्ट से वीडियो पर मिलें। जहाँ भी आप हों, गतिशीलता का आकलन, आपके लिए चुने गए व्यायाम, पुनर्वास योजना और प्रगति पर मार्गदर्शन पाएँ। जब दूर से आकलन करना क्लिनिकली उपयुक्त हो, तब ऑनलाइन देखभाल दुनिया भर में उपलब्ध है।
            </p>
            <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
              यदि घर पर प्रत्यक्ष उपचार अधिक उपयुक्त हो, तो{" "}
              <Link className="font-semibold text-primary underline underline-offset-4" href="/physiotherapist-at-home/jaipur">
                घर पर फिजियोथेरेपी
              </Link>{" "}
              और{" "}
              <Link className="font-semibold text-primary underline underline-offset-4" href="/cities">
                अपने शहर में उपलब्ध विकल्प
              </Link>{" "}
              देखें।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="min-h-12 rounded-full px-6">
                <Link href="/hi/booking" data-booking-mode="telehealth">
                  ऑनलाइन परामर्श बुक करें
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <a
                href="#consultation"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background px-6 font-semibold"
              >
                परामर्श में क्या शामिल है, देखें
              </a>
            </div>
          </div>
        </section>

        <section id="consultation" className={sectionClass}>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                दूरस्थ परामर्श—सिर्फ सामान्य वीडियो कॉल नहीं
              </p>
              <h2 className="font-serif text-3xl font-bold">ऑनलाइन परामर्श में क्या होता है?</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                फिजियोथेरेपिस्ट पहले आपके लक्षणों, निदान, मिली हुई चिकित्सकीय सलाह, लक्ष्यों और रोज़मर्रा की गतिविधियों को समझते हैं। फिर वे ज़रूरी गतिविधियों को देखते हैं, बताते हैं कि वे क्या जाँच रहे हैं, और आपके घर, उपलब्ध उपकरण, समय तथा सहजता के अनुसार योजना बनाते हैं। यह योजना सभी के लिए एक जैसी दिनचर्या से नहीं ली जाती; आपकी स्थिति और कामकाज के अनुसार इसकी समीक्षा और प्रगति की जाती है।
              </p>
            </div>
            <aside className={`${cardClass} self-start`}>
              <h3 className="font-semibold">ऑनलाइन परामर्श</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                दुनिया भर में · WhatsApp / Google Meet / Zoom
              </p>
              <p className="mt-5 text-2xl font-bold text-primary">
                {pricing.telehealth.displayAmount} प्रति परामर्श
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                अलग-अलग समय क्षेत्रों के अनुसार समय तय किया जा सकता है। अंतिम शुल्क और सत्र का विवरण अपॉइंटमेंट से पहले पुष्टि किया जाता है।
              </p>
            </aside>
          </div>
        </section>

        <section className="border-y border-border/70 bg-muted/20">
          <div className={sectionClass}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">क्लिनिकल दायरा</p>
            <h2 className="font-serif text-3xl font-bold">ऑनलाइन फिजियोथेरेपी में किन बातों पर काम हो सकता है?</h2>
            <p className="mt-4 max-w-4xl leading-relaxed text-muted-foreground">
              दूरस्थ फिजियोथेरेपी तब अधिक उपयोगी होती है जब व्यक्ति परामर्श में भाग ले सके, आसपास का वातावरण पर्याप्त सुरक्षित हो, और बातचीत तथा गतिविधि देखकर लक्ष्यों का आकलन किया जा सके।
            </p>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {[
                "वीडियो के माध्यम से गतिविधि, मुद्रा, ताकत, संतुलन और रोज़मर्रा के कामकाज का आकलन।",
                "दर्द, गतिशीलता, शारीरिक क्षमता और रिकवरी के लक्ष्यों के अनुसार व्यायाम।",
                "सर्जरी या चोट के बाद मार्गदर्शन, जब इलाज कर रही मेडिकल टीम ने सुरक्षित सावधानियाँ तय हों।",
                "न्यूरोलॉजिकल पुनर्वास की जानकारी, देखभाल करने वाले व्यक्ति के लिए मार्गदर्शन और प्रगति की समीक्षा।",
                "घर पर किए जाने वाले व्यायामों में क्रमिक बदलाव, गतिविधियों की गति तय करना, एर्गोनॉमिक्स और गतिविधियों पर लौटने की योजना।",
              ].map((item) => (
                <li key={item} className="rounded-xl border border-border/70 bg-background p-4 leading-relaxed">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={sectionClass}>
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">हम कैसे काम करते हैं</p>
              <h2 className="font-serif text-3xl font-bold">ऑनलाइन परामर्श के व्यावहारिक तरीके</h2>
              <ul className="mt-5 space-y-3 leading-relaxed text-muted-foreground">
                <li>वीडियो पर व्यवस्थित रूप से स्वास्थ्य-इतिहास और लक्षणों की समीक्षा।</li>
                <li>घर में उपलब्ध जगह और उपकरणों का उपयोग करके गतिविधि का अवलोकन।</li>
                <li>स्पष्ट प्रदर्शन और आपसे दोहराकर समझ की पुष्टि, ताकि व्यायाम सुरक्षित तरीके से समझ आएँ।</li>
                <li>आपके लक्षणों, कामकाज और आत्मविश्वास में बदलाव के अनुसार ढलने वाली व्यक्तिगत योजना।</li>
                <li>सहमति के अनुसार WhatsApp, Google Meet या Zoom के माध्यम से आगे का मार्गदर्शन।</li>
              </ul>
            </div>
            <aside className="rounded-2xl border border-amber-300/50 bg-amber-50/70 p-6 dark:bg-amber-950/20">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
                <div>
                  <h2 className="font-serif text-2xl font-bold">जब ऑनलाइन देखभाल पर्याप्त न हो</h2>
                  <p className="mt-3 leading-relaxed text-muted-foreground">
                    सुरक्षा को लेकर अनिश्चितता हो तो वीडियो परामर्श आपातकालीन देखभाल, प्रत्यक्ष जाँच या चिकित्सकीय समीक्षा का विकल्प नहीं है। नीचे दी गई स्थितियों में अपने क्षेत्र की उपयुक्त चिकित्सकीय सहायता लें:
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3 leading-relaxed text-muted-foreground">
                <li>कोई मेडिकल इमरजेंसी या ऐसे लक्षण जिनमें तुरंत प्रत्यक्ष जाँच ज़रूरी हो।</li>
                <li>नया सीने का दर्द, बहुत ज़्यादा साँस फूलना, बेहोशी, अचानक कमजोरी या भ्रम।</li>
                <li>फ्रैक्चर की आशंका, गंभीर संक्रमण, अनियंत्रित रक्तस्राव या तेज़ी से बिगड़ती स्थिति।</li>
                <li>ऐसी कोई स्थिति जिसमें चिकित्सक दूर से सुरक्षा का आकलन न कर सके।</li>
              </ul>
            </aside>
          </div>
        </section>

        <section className="border-y border-border/70 bg-muted/20">
          <div className={sectionClass}>
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">अपने सत्र से पहले</p>
            <h2 className="font-serif text-3xl font-bold">शुरू करने के तीन आसान कदम</h2>
            <ol className="mt-6 grid gap-4 md:grid-cols-3">
              {[
                ["अपने लक्ष्य बताएँ।", "अपना स्थान, समस्या, पसंदीदा तारीख और यह बताएँ कि क्या आप ऑनलाइन देखभाल चाहते हैं।"],
                ["जगह तैयार रखें।", "एक स्थिर कुर्सी, चलने-फिरने के लिए पर्याप्त जगह और उपलब्ध रिपोर्ट, दवाओं की सूची या घर के उपकरण पास रखें।"],
                ["जुड़ें और अभ्यास करें।", "पुष्टि किया गया WhatsApp, Google Meet या Zoom लिंक खोलें। योजना का अभ्यास करते समय सवाल पूछें।"],
              ].map(([title, body]) => (
                <li key={title} className={`${cardClass} list-none`}>
                  <h3 className="font-semibold">{title}</h3>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={sectionClass}>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-primary">अपनी देखभाल चुनें</p>
          <h2 className="font-serif text-3xl font-bold">आपकी रिकवरी योजना के अनुसार देखभाल</h2>
          <p className="mt-4 text-muted-foreground">
            उपलब्ध विकल्प देखें, शुल्क समझें और अपना अनुरोध ऑनलाइन भेजें।
          </p>
          <div className="mt-7 grid gap-5 lg:grid-cols-2">
            <article className={cardClass}>
              <h3 className="font-serif text-2xl font-bold">घर पर मुलाक़ात</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                भारत के सूचीबद्ध शहरों में घर पर मुलाक़ात की व्यवस्था की जाती है। बुकिंग से पहले आपके सही इलाके और स्थानीय फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि की जाती है।
              </p>
              <ul className="mt-4 space-y-2 leading-relaxed text-muted-foreground">
                <li>शुल्क: {pricing.homeVisit.amount} प्रति सत्र।</li>
                <li>आपकी स्थिति के अनुसार उपयुक्त विशेषज्ञ का मिलान।</li>
                <li>आपके अपने घर पर देखभाल।</li>
                <li>पुष्टि: अनुरोध की समीक्षा के बाद, अपॉइंटमेंट से पहले टीम समय और उपलब्धता की पुष्टि करती है।</li>
              </ul>
              <Button asChild className="mt-6 min-h-11 rounded-full px-5">
                <Link href="/hi/booking">घर पर मुलाक़ात बुक करें</Link>
              </Button>
            </article>
            <article className={`${cardClass} border-primary/30`}>
              <h3 className="font-serif text-2xl font-bold">ऑनलाइन परामर्श</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">ऑनलाइन परामर्श दुनिया भर में उपलब्ध है।</p>
              <ul className="mt-4 space-y-2 leading-relaxed text-muted-foreground">
                <li>शुल्क: {pricing.telehealth.displayAmount} प्रति परामर्श।</li>
                <li>वीडियो आकलन और व्यायाम संबंधी मार्गदर्शन।</li>
                <li>Google Meet, Zoom या WhatsApp वीडियो में से चुनें।</li>
                <li>उसी दिन पुष्टि—आमतौर पर 6 घंटे के भीतर और अधिकतम 12 घंटे में।</li>
              </ul>
              <Button asChild className="mt-6 min-h-11 rounded-full px-5">
                <Link href="/hi/booking" data-booking-mode="telehealth">ऑनलाइन परामर्श बुक करें</Link>
              </Button>
            </article>
          </div>
          <p className="mt-6 max-w-4xl leading-relaxed text-muted-foreground">
            अंतिम शुल्क अपॉइंटमेंट से पहले बताया जाएगा। यह सत्र के प्रकार, विशेषज्ञ और पुनर्वास योजना के अनुसार अलग हो सकता है।
          </p>
          <Link href="/hi/contact" className="mt-4 inline-flex min-h-11 items-center font-semibold text-primary underline underline-offset-4">
            कोई सवाल है? हमें संदेश भेजें।
          </Link>
          <div className="mt-8 rounded-2xl border border-primary/15 bg-primary/5 p-6">
            <h2 className="font-serif text-2xl font-bold">क्या आप अपनी रिकवरी पर बात करना चाहते हैं?</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
              ऑनलाइन बुकिंग करते समय वह जानकारी दें जिससे टीम तय कर सके कि वीडियो परामर्श आपके लिए उपयुक्त है या नहीं।
            </p>
            <Button asChild className="mt-5 min-h-11 rounded-full px-5">
              <Link href="/hi/booking" data-booking-mode="telehealth">ऑनलाइन परामर्श बुक करें</Link>
            </Button>
          </div>
        </section>
      </main>
    </>
  );
}