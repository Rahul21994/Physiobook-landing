import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet-async";
import { ArrowRight, CheckCircle2, Clock3, MapPin, ShieldCheck } from "lucide-react";
import { useCreateConsultationLead } from "@workspace/api-client-react";

import { FAQList } from "@/components/FAQList";
import { AccessibleSelect } from "@/components/AccessibleSelect";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BUSINESS_CONFIG } from "@/config/business";
import {
  CONTACT_FAQS,
  CONTACT_PAGE_DESCRIPTION,
} from "@/lib/contact-page-content";
import { getFormAntiSpamToken } from "@/lib/form-anti-spam";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/lib/language";

const serviceOptions = [
  ["online-physiotherapy", "Online physiotherapy"],
  ["home-physiotherapy", "Home physiotherapy"],
  ["nutritionist-dietitian-online", "Online nutritionist or dietitian"],
  ["exercise-physiologist", "Exercise physiology"],
  ["back-pain", "Back pain"],
  ["neck-pain", "Neck pain"],
  ["knee-pain", "Knee pain"],
  ["sciatica", "Sciatica"],
  ["arthritis-osteoarthritis", "Arthritis or osteoarthritis"],
  ["sports-injury-rehabilitation", "Sports injury rehabilitation"],
  ["post-surgery-rehab", "Post-surgery rehabilitation"],
  ["stroke-rehab", "Stroke rehabilitation"],
  ["parkinsons-rehab", "Parkinson’s rehabilitation"],
  ["weight-management", "Weight-management support"],
  ["not-sure", "Not sure yet"],
] as const;

type ConsultationService = (typeof serviceOptions)[number][0];
const consultationServiceValues = serviceOptions.map(
  ([value]) => value,
) as [ConsultationService, ...ConsultationService[]];

const HINDI_SERVICE_LABELS: Record<ConsultationService, string> = {
  "online-physiotherapy": "ऑनलाइन फिजियोथेरेपी",
  "home-physiotherapy": "घर पर फिजियोथेरेपी",
  "nutritionist-dietitian-online": "ऑनलाइन पोषण विशेषज्ञ या आहार विशेषज्ञ",
  "exercise-physiologist": "व्यायाम-शरीरक्रिया",
  "back-pain": "पीठ का दर्द",
  "neck-pain": "गर्दन का दर्द",
  "knee-pain": "घुटने का दर्द",
  sciatica: "साइटिका",
  "arthritis-osteoarthritis": "गठिया या ऑस्टियोआर्थराइटिस",
  "sports-injury-rehabilitation": "खेल-चोट पुनर्वास",
  "post-surgery-rehab": "सर्जरी के बाद पुनर्वास",
  "stroke-rehab": "स्ट्रोक पुनर्वास",
  "parkinsons-rehab": "पार्किंसन पुनर्वास",
  "weight-management": "वज़न प्रबंधन में सहायता",
  "not-sure": "अभी निश्चित नहीं",
};

export const HINDI_CONTACT_FAQS = [
  {
    q: "क्या Gift Rehab Center बिना अपॉइंटमेंट आने वाला क्लिनिक है?",
    a: "नहीं। Gift Rehab Center, Goswami Rehab का मुख्य कार्यालय और डॉक्टर प्रशिक्षण केंद्र है। वहाँ केवल अपॉइंटमेंट से जाया जा सकता है; यह मरीज़ों का क्लिनिक या बिना अपॉइंटमेंट आने की जगह नहीं है।",
  },
  {
    q: "मैं ऑनलाइन परामर्श का अनुरोध कब कर सकता/सकती हूँ?",
    a: "ऑनलाइन परामर्श 24/7 उपलब्ध हैं। प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से होती है। आपका अनुरोध देखने के बाद टीम अपॉइंटमेंट की उपलब्धता की पुष्टि करती है।",
  },
  {
    q: "फ़ॉर्म भेजने के बाद क्या होगा?",
    a: "आपका अनुरोध समीक्षा के लिए सहेजा जाएगा। जवाब देने के लिए जितनी जानकारी ज़रूरी हो, उतनी ही साझा करें। आपातकाल या तत्काल चिकित्सकीय लक्षणों के लिए इस फ़ॉर्म का उपयोग न करें।",
  },
] as const;

function buildLeadFormSchema(isHindi: boolean) {
  const message = (english: string, hindi: string) => isHindi ? hindi : english;
  return z.object({
    name: z.string().trim().min(2, message("Enter your name.", "अपना नाम दर्ज करें।")).max(100, message("Enter your name.", "अपना नाम दर्ज करें।")),
    phone: z
      .string()
      .trim()
      .min(7, message("Enter a reachable phone number.", "ऐसा फ़ोन नंबर दर्ज करें जिस पर संपर्क किया जा सके।"))
      .max(24, message("Enter a reachable phone number.", "ऐसा फ़ोन नंबर दर्ज करें जिस पर संपर्क किया जा सके।"))
      .regex(
        /^[+0-9(). -]+$/,
        message("Use digits and common phone-number characters only.", "फ़ोन नंबर में केवल अंक और आम फ़ोन-नंबर चिह्न इस्तेमाल करें।"),
      ),
    email: z
      .string()
      .trim()
      .email(message("Enter a valid email address.", "मान्य ईमेल पता दर्ज करें।"))
      .max(254, message("Enter a valid email address.", "मान्य ईमेल पता दर्ज करें।")),
    service: z.enum(consultationServiceValues, {
      errorMap: () => ({ message: message("Choose a service or concern.", "अपनी सेवा या चिंता चुनें।") }),
    }),
    mode: z.enum(["online", "home-visit"], {
      errorMap: () => ({ message: message("Choose a preferred care format.", "पसंदीदा देखभाल का प्रकार चुनें।") }),
    }),
    city: z.string().trim().min(2, message("Enter your city or area.", "अपना शहर या इलाका दर्ज करें।")).max(120, message("Enter your city or area.", "अपना शहर या इलाका दर्ज करें।")),
    preferredTime: z.string().trim().min(2, message("Share a preferred time.", "संपर्क का पसंदीदा समय बताएँ।")).max(120, message("Share a preferred time.", "संपर्क का पसंदीदा समय बताएँ।")),
    message: z.string().max(2000, message("Keep your message under 2,000 characters.", "संदेश 2,000 अक्षरों से छोटा रखें।")),
    consent: z.boolean().refine(
      Boolean,
      message("Please agree before submitting.", "भेजने से पहले सहमति दें।"),
    ),
  });
}

const leadFormSchema = buildLeadFormSchema(false);

type LeadFormInput = z.input<typeof leadFormSchema>;
type LeadFormValues = z.output<typeof leadFormSchema>;

const description = CONTACT_PAGE_DESCRIPTION;

export default function Contact() {
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const t = (english: string, hindi: string) => isHindi ? hindi : english;
  const [antiSpamToken, setAntiSpamToken] = useState<string | null>(null);
  const [honeypotValue, setHoneypotValue] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [savedLeadId, setSavedLeadId] = useState<number | null>(null);
  const createLead = useCreateConsultationLead();
  const canonicalPath = isHindi ? "/hi/contact" : "/contact";
  const canonicalUrl = `${BUSINESS_CONFIG.siteUrl}${canonicalPath}`;
  const pageTitle = isHindi
    ? "Goswami Rehab से संपर्क करें | परामर्श अनुरोध"
    : "Contact Goswami Rehab | Consultation Requests";
  const pageDescription = isHindi
    ? "ऑनलाइन या प्रत्यक्ष फिजियोथेरेपी और पुनर्वास के लिए Goswami Rehab से संपर्क करें। ऑनलाइन परामर्श 24/7 उपलब्ध हैं; प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से है।"
    : description;
  const onlineAvailability = isHindi
    ? "ऑनलाइन परामर्श 24/7 उपलब्ध हैं"
    : BUSINESS_CONFIG.availability.online;
  const inPersonAvailability = isHindi
    ? "प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से है"
    : BUSINESS_CONFIG.availability.inPerson;
  const validationSchema = useMemo(() => buildLeadFormSchema(isHindi), [isHindi]);

  const form = useForm<LeadFormInput, unknown, LeadFormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service: "not-sure",
      mode: "online",
      city: "",
      preferredTime: "",
      message: "",
      consent: false,
    },
  });

  useEffect(() => {
    let mounted = true;
    void getFormAntiSpamToken().then((token) => {
      if (mounted) setAntiSpamToken(token);
    });
    return () => {
      mounted = false;
    };
  }, []);

  function onSubmit(values: LeadFormValues) {
    setSubmitError(null);
    if (!antiSpamToken) {
      setSubmitError(
        isHindi
          ? "अनुरोध फ़ॉर्म की सुरक्षा जाँच अभी लोड हो रही है। कृपया फिर कोशिश करें।"
          : "The request form is still loading its security check. Please try again.",
      );
      return;
    }

    createLead.mutate(
      {
        data: {
          name: values.name,
          phone: values.phone,
          email: values.email,
          service: values.service,
          mode: values.mode,
          city: values.city,
          preferredTime: values.preferredTime,
          message: values.message,
          consent: true,
          antiSpamToken,
          website: honeypotValue,
        },
      },
      {
        onSuccess: (result) => {
          setSavedLeadId(result.id);
          trackEvent("consultation_request_received", { route: "contact" });
          window.scrollTo({ top: 0, behavior: "smooth" });
        },
        onError: () => {
          setSubmitError(
            isHindi
              ? "आपका अनुरोध सहेजा नहीं जा सका। फ़ॉर्म की जाँच करके फिर कोशिश करें।"
              : "We could not save your request. Please review the form and try again.",
          );
          setAntiSpamToken(null);
          void getFormAntiSpamToken().then(setAntiSpamToken);
        },
      },
    );
  }

  const mapProfiles = [
    {
      label: isHindi
        ? `Goswami Rehab (मुख्य कार्यालय: ${BUSINESS_CONFIG.headOffice.branchName})`
        : BUSINESS_CONFIG.headOffice.displayName,
      description: isHindi
        ? "मुख्य कार्यालय और डॉक्टर प्रशिक्षण केंद्र — केवल अपॉइंटमेंट से"
        : BUSINESS_CONFIG.headOffice.description,
      address: BUSINESS_CONFIG.headOffice.address.displayAddress,
      mapUrl: BUSINESS_CONFIG.headOffice.googleMapsUrl,
      id: "head-office",
    },
    ...BUSINESS_CONFIG.serviceAreaProfiles.map((profile, index) => ({
      label: isHindi
        ? profile.areaName || "नक्शा प्रोफ़ाइल; क्षेत्र का नाम उपलब्ध नहीं है।"
        : profile.label,
      description: "",
      address: "",
      mapUrl: profile.googleMapsUrl,
      id: `service-area-${index + 1}`,
    })),
  ];

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en-IN" href={`${BUSINESS_CONFIG.siteUrl}/contact`} />
        <link rel="alternate" hrefLang="hi-IN" href={`${BUSINESS_CONFIG.siteUrl}/hi/contact`} />
        <link rel="alternate" hrefLang="x-default" href={`${BUSINESS_CONFIG.siteUrl}/contact`} />
      </Helmet>

      <div className="min-h-screen bg-background" data-no-translate={isHindi ? true : undefined}>
        <section className="border-b border-border/60 bg-gradient-to-b from-primary/5 to-background px-4 py-14 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="pt-3">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background px-4 py-2 text-sm font-semibold text-primary">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                {onlineAvailability}
              </p>
              <h1 className="max-w-2xl font-serif text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t("Contact Goswami Rehab", "Goswami Rehab से संपर्क करें")}
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
                {t(
                  `Tell us what support you are looking for. ${BUSINESS_CONFIG.availability.inPerson}; submitting a request does not confirm an appointment.`,
                  "आप किस सहायता की तलाश में हैं, हमें बताएँ। प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से है; अनुरोध भेजने से अपॉइंटमेंट की पुष्टि नहीं होती।",
                )}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="min-h-12 rounded-full px-6">
                  <a href="#consultation-request">
                    {t("Request a consultation", "परामर्श का अनुरोध करें")}
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </a>
                </Button>
                <a
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-background px-6 font-semibold text-foreground hover:bg-accent"
                  href="#locations"
                >
                  {t("View office and map profiles", "कार्यालय और नक्शे के प्रोफ़ाइल देखें")}
                </a>
              </div>

              <div className="mt-10 rounded-2xl border border-border/70 bg-background p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                  <div>
                    <h2 className="font-semibold text-foreground">
                      {t("Share only what we need", "केवल ज़रूरी जानकारी साझा करें")}
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {t(
                        "Your details are saved so the team can review your request. Do not use this form for emergencies or include highly sensitive medical information.",
                        "टीम आपके अनुरोध की समीक्षा करने और जवाब देने के लिए आपके विवरण सहेजती है। आपातकालीन स्थिति में इस फ़ॉर्म का उपयोग न करें और अत्यधिक संवेदनशील स्वास्थ्य जानकारी शामिल न करें।",
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <section
              id="consultation-request"
              aria-labelledby="consultation-form-title"
              className="rounded-3xl border border-border/70 bg-background p-6 shadow-xl shadow-primary/5 sm:p-8"
            >
              {savedLeadId !== null ? (
                <div className="flex min-h-[28rem] flex-col items-start justify-center" role="status" data-testid="consultation-success">
                  <CheckCircle2 className="h-12 w-12 text-primary" aria-hidden="true" />
                  <h2 className="mt-5 font-serif text-3xl font-bold text-foreground">
                    {t("Request saved", "अनुरोध सहेजा गया")}
                  </h2>
                  <p className="mt-3 max-w-lg leading-relaxed text-muted-foreground">
                    {t(
                      "Your consultation request has been saved for review. Reference: ",
                      "आपका परामर्श अनुरोध समीक्षा के लिए सहेज लिया गया है। संदर्भ संख्या: ",
                    )}
                    <span className="font-semibold text-foreground">#{savedLeadId}</span>.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {t(
                      "Please seek local urgent care for emergencies rather than waiting for a form response.",
                      "आपातकाल में फ़ॉर्म के जवाब की प्रतीक्षा न करें; अपने क्षेत्र की आपातकालीन देखभाल लें।",
                    )}
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {t("Consultation request", "परामर्श अनुरोध")}
                  </p>
                  <h2 id="consultation-form-title" className="mt-2 font-serif text-2xl font-bold text-foreground sm:text-3xl">
                    {t("Tell us how to reach you", "हमें बताएँ कि आपसे कैसे संपर्क करें")}
                  </h2>
                  <p className="mb-7 mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(
                      `${onlineAvailability}. ${inPersonAvailability}. The team will review your preferred time and confirm availability.`,
                      `${onlineAvailability}। ${inPersonAvailability}। टीम आपके पसंदीदा समय की समीक्षा कर उपलब्धता की पुष्टि करेगी।`,
                    )}
                  </p>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Full name", "पूरा नाम")}</FormLabel>
                              <FormControl>
                                <Input {...field} autoComplete="name" maxLength={100} data-testid="input-consultation-name" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Phone number", "फ़ोन नंबर")}</FormLabel>
                              <FormControl>
                                <Input {...field} type="tel" autoComplete="tel" maxLength={24} data-testid="input-consultation-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Email address", "ईमेल पता")}</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" autoComplete="email" maxLength={254} data-testid="input-consultation-email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="service"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Service or concern", "सेवा या चिंता")}</FormLabel>
                              <FormControl>
                                <AccessibleSelect
                                  {...field}
                                  value={field.value}
                                  placeholder={t("Choose a service", "सेवा चुनें")}
                                  options={serviceOptions.map(([value, label]) => ({
                                    value,
                                    label: isHindi ? HINDI_SERVICE_LABELS[value] : label,
                                  }))}
                                  className="h-12 bg-background"
                                  data-testid="select-consultation-service"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="mode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Preferred care format", "पसंदीदा देखभाल का प्रकार")}</FormLabel>
                            <FormControl>
                              <AccessibleSelect
                                {...field}
                                value={field.value}
                                placeholder={t("Choose a format", "देखभाल का प्रकार चुनें")}
                                options={[
                                  {
                                    value: "online",
                                    label: t("Online consultation", "ऑनलाइन परामर्श"),
                                  },
                                  {
                                    value: "home-visit",
                                    label: t(
                                      "In-person / home visit (by appointment)",
                                      "प्रत्यक्ष / घर पर मुलाक़ात (अपॉइंटमेंट से)",
                                    ),
                                  },
                                ]}
                                className="h-12 bg-background"
                                data-testid="select-consultation-mode"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-5 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("City or area", "शहर या इलाका")}</FormLabel>
                              <FormControl>
                                <Input {...field} autoComplete="address-level2" maxLength={120} data-testid="input-consultation-city" />
                              </FormControl>
                              <FormDescription>
                                {t(
                                  "Share your location so the team can review the request.",
                                  "अनुरोध की समीक्षा के लिए अपना स्थान बताएँ।",
                                )}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="preferredTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("Preferred time", "पसंदीदा समय")}</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  maxLength={120}
                                  placeholder={t(
                                    "For example, mornings or evenings",
                                    "उदाहरण: सुबह या शाम",
                                  )}
                                  data-testid="input-consultation-time"
                                />
                              </FormControl>
                              <FormDescription>
                                {t(
                                  "We will confirm appointment availability.",
                                  "अपॉइंटमेंट की उपलब्धता टीम पुष्टि करेगी।",
                                )}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t("Message", "संदेश")}{" "}
                              <span className="font-normal text-muted-foreground">
                                {t("(optional)", "(वैकल्पिक)")}
                              </span>
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                rows={4}
                                maxLength={2000}
                                placeholder={t(
                                  "Share a short note about the support you are looking for.",
                                  "आप किस सहायता की तलाश में हैं, इस बारे में संक्षेप में बताएँ।",
                                )}
                                className="resize-y bg-background"
                                data-testid="textarea-consultation-message"
                              />
                            </FormControl>
                            <FormDescription>
                              {t(
                                "Do not include emergency details or highly sensitive medical information.",
                                "आपातकाल की जानकारी या अत्यधिक संवेदनशील स्वास्थ्य जानकारी शामिल न करें।",
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="absolute -left-[10000px] h-px w-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="consultation-website">Leave this field empty</label>
                        <input
                          id="consultation-website"
                          name="website"
                          type="text"
                          tabIndex={-1}
                          autoComplete="off"
                          value={honeypotValue}
                          onChange={(event) => setHoneypotValue(event.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-foreground">
                          <input
                            type="checkbox"
                            className="mt-1 h-4 w-4 shrink-0 accent-primary"
                            {...form.register("consent")}
                            data-testid="checkbox-consultation-consent"
                          />
                          <span>
                            {isHindi
                              ? "मैं सहमत हूँ कि Goswami Rehab मेरे अनुरोध की समीक्षा करने और जवाब देने के लिए इन विवरणों का उपयोग कर सकता है। "
                              : "I agree that Goswami Rehab may use these details to review and respond to my request. Read the "}
                            <a href="/privacy" className="font-semibold text-primary underline underline-offset-4">
                              {t("Privacy Policy", "गोपनीयता नीति")}
                            </a>
                            {isHindi ? " पढ़ें।" : "."}
                          </span>
                        </label>
                        {form.formState.errors.consent && (
                          <p className="text-sm text-destructive" role="alert">
                            {form.formState.errors.consent.message}
                          </p>
                        )}
                      </div>

                      {submitError && (
                        <p role="alert" className="text-sm text-destructive" data-testid="text-consultation-error">
                          {submitError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        size="lg"
                        className="min-h-12 w-full rounded-full text-base"
                        disabled={createLead.isPending || !antiSpamToken}
                        data-testid="button-consultation-submit"
                      >
                        {createLead.isPending
                          ? t("Saving request…", "अनुरोध सहेजा जा रहा है…")
                          : antiSpamToken
                            ? t("Send consultation request", "परामर्श अनुरोध भेजें")
                            : t("Loading secure form…", "सुरक्षित फ़ॉर्म लोड हो रहा है…")}
                      </Button>

                      <p className="text-center text-xs leading-relaxed text-muted-foreground">
                        {t(
                          "This form uses an anti-spam security check and a hidden field. Submitting it does not confirm an appointment.",
                          "इस फ़ॉर्म में स्पैम-विरोधी सुरक्षा जाँच और एक छिपा हुआ फ़ील्ड है। फ़ॉर्म भेजने से अपॉइंटमेंट की पुष्टि नहीं होती।",
                        )}
                      </p>
                    </form>
                  </Form>
                </>
              )}
            </section>
          </div>
        </section>

        <section id="locations" className="px-4 py-14 sm:py-18">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                    {t("Locations and service profiles", "स्थान और सेवा-क्षेत्र के प्रोफ़ाइल")}
                  </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-foreground">
                {t("Office details and map links", "कार्यालय का विवरण और नक्शे के लिंक")}
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {t(
                  `${BUSINESS_CONFIG.availability.online}. ${BUSINESS_CONFIG.availability.inPerson}; the office below is not a patient clinic or walk-in location.`,
                  "ऑनलाइन परामर्श 24/7 उपलब्ध हैं। प्रत्यक्ष देखभाल केवल अपॉइंटमेंट से है; नीचे दिया गया कार्यालय मरीज़ों का क्लिनिक या बिना अपॉइंटमेंट आने की जगह नहीं है।",
                )}
              </p>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {mapProfiles.map((profile) => (
                <article
                  key={profile.id}
                  className="flex h-full flex-col rounded-2xl border border-border bg-card p-5"
                  data-testid={`contact-map-${profile.id}`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <MapPin className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold leading-snug text-foreground">{profile.label}</h3>
                  {profile.description && (
                    <p className="mt-2 text-sm text-muted-foreground">{profile.description}</p>
                  )}
                  {profile.address && (
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{profile.address}</p>
                  )}
                  {!profile.address && !profile.description && !isHindi && (
                    <p className="mt-2 text-sm text-muted-foreground">Map profile; area name not provided.</p>
                  )}
                  <a
                    className="mt-auto inline-flex min-h-11 items-center gap-2 pt-5 font-semibold text-primary underline-offset-4 hover:underline"
                    href={profile.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={
                      isHindi
                        ? `${profile.label} का नक्शा खोलें`
                        : `Open map for ${profile.label}`
                    }
                  >
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    {t("Open map", "नक्शा खोलें")}
                  </a>
                </article>
              ))}
            </div>

            <div className="mt-14 max-w-3xl">
              <h2 className="font-serif text-3xl font-bold text-foreground">
                {t("Contact questions", "संपर्क से जुड़े प्रश्न")}
              </h2>
              <div className="mt-6">
                <FAQList
                  faqs={
                    isHindi
                      ? HINDI_CONTACT_FAQS.map(({ q, a }) => ({ q, a }))
                      : CONTACT_FAQS.map(({ q, a }) => ({ q, a }))
                  }
                  testIdPrefix="contact-faq"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}