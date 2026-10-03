import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import { motion } from "@/lib/motion";
import { CheckCircle2, Video, House, Copy, Check, FileText, MapPin, Upload } from "lucide-react";
import { format } from "date-fns";
import { useCreateBooking } from "@workspace/api-client-react";
import type { Booking } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AccessibleSelect } from "@/components/AccessibleSelect";
import { appointmentTypes, telehealthAppointmentTypes } from "@/lib/site-data";
import {
  cities,
  getCityBySlug,
  getCityConfirmationWindowHours,
  getConfirmationWindowText,
  hasVerifiedHomecareCoverage,
} from "@/lib/cities";
import {
  getBookingIndexContextFromSearch,
  getBookingPageCopy,
} from "@/lib/booking-index";
import { getBookingLocalityFromContext } from "@/lib/booking-city";
import { pricing } from "@/lib/pricing";
import {
  consumePendingBookingContext,
  type PendingBookingContext,
} from "@/lib/booking-navigation";
import { getHindiAppointmentLabel } from "@/lib/hindi-booking-copy";
import { getHindiCityDisplayName, getHindiCityPath } from "@/lib/hindi-city-routes";
import { getHindiStaticRoute } from "@/lib/hindi-static-routes";
import { HindiRouteHead } from "@/components/HindiRouteHead";
import { useLanguage } from "@/lib/language";
import { QRCodeSVG } from "qrcode.react";
import { trackEvent } from "@/lib/analytics";
import { BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL, BUSINESS_WHATSAPP_URL } from "@/lib/contact";
import { ProgressiveCareJourney } from "@/components/ProgressiveCareJourney";

const BUSINESS_UPI_ID = "7976044858@upi";
const BUSINESS_NAME = "Goswami Rehab";
const API_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function buildUpiLink(amount: number | undefined, bookingId: number) {
  const note = encodeURIComponent(`Physio Booking #${bookingId}`);
  const name = encodeURIComponent(BUSINESS_NAME);
  const amountParam = amount === undefined ? "" : `&am=${amount}`;
  return `upi://pay?pa=${BUSINESS_UPI_ID}&pn=${name}${amountParam}&cu=INR&tn=${note}`;
}

function buildBookingFormSchema(isHindi: boolean) {
  const message = (english: string, hindi: string) => isHindi ? hindi : english;
  return z.object({
    firstName: z.string().min(2, message("First name is required", "पहला नाम आवश्यक है।")),
    lastName: z.string().min(2, message("Last name is required", "उपनाम आवश्यक है।")),
    email: z.string().email(message("Invalid email address", "मान्य ईमेल पता दर्ज करें।")),
    phone: z.string().min(10, message("Valid phone number is required", "मान्य फ़ोन नंबर दर्ज करें।")),
    appointmentType: z.string().min(1, message("Please select an appointment type", "कृपया अपॉइंटमेंट का प्रकार चुनें।")),
    city: z.string().optional(),
    preferredDate: z.date({
      required_error: message("Please select a preferred date.", "कृपया अपनी पसंदीदा तारीख चुनें।"),
    }),
    mainConcern: z.string().min(5, message("Please briefly describe the main problem", "कृपया अपनी मुख्य समस्या संक्षेप में बताएँ।")),
    affectedArea: z.string().min(1, message("Please select the affected area", "कृपया प्रभावित क्षेत्र चुनें।")),
    painLevel: z.number().int().min(0).max(10).optional(),
    problemDuration: z.string().optional(),
    recoveryGoal: z.string().optional(),
    notes: z.string().optional(),
    videoPlatform: z.string().optional(),
    priceAccepted: z.boolean().refine((value) => value, {
      message: message(
        "Please acknowledge the displayed service price.",
        "दिखाए गए सेवा शुल्क को स्वीकार करने की पुष्टि करें।",
      ),
    }),
  });
}

const formSchema = buildBookingFormSchema(false);

type FormValues = z.infer<typeof formSchema>;

interface ConfirmationData {
  booking: Booking;
  formValues: FormValues;
  sessionMode: "home" | "telehealth";
  documentStatus?: "delivered" | "email-delivered" | "failed";
}

function displayConfirmationWindow(
  citySlug: string | undefined,
  mode: "home" | "telehealth",
  isHindi: boolean,
) {
  if (!isHindi) return getConfirmationWindowText(citySlug, mode);
  if (mode === "telehealth") {
    return "उसी दिन—आमतौर पर 6 घंटे के भीतर और अधिकतम 12 घंटे में";
  }
  return `${getCityConfirmationWindowHours(citySlug)} घंटे के भीतर`;
}

function ConfirmationPage({
  data,
  onBookAnother,
}: {
  data: ConfirmationData;
  onBookAnother: () => void;
}) {
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const t = (english: string, hindi: string) => isHindi ? hindi : english;
  const { booking, formValues, sessionMode, documentStatus } = data;
  const amount = sessionMode === "telehealth" ? pricing.telehealth.amountInr : undefined;
  const confirmationWindowText = displayConfirmationWindow(formValues.city, sessionMode, isHindi);
  const homecareIsActive = formValues.city
    ? hasVerifiedHomecareCoverage({ slug: formValues.city })
    : false;
  const cityName = formValues.city
    ? getHindiCityDisplayName(
        formValues.city,
        cities.find((city) => city.slug === formValues.city)?.name ?? formValues.city,
      )
    : "";
  const appointmentLabel = isHindi
    ? getHindiAppointmentLabel(formValues.appointmentType)
    : formValues.appointmentType;
  const upiLink = buildUpiLink(amount, booking.id);
  const [copied, setCopied] = useState(false);

  function copyUpiId() {
    navigator.clipboard.writeText(BUSINESS_UPI_ID).then(() => {
      setCopied(true);
      trackEvent("booking_confirmation_action", {
        route: "booking",
        action: "copy_upi",
        session_mode: sessionMode,
      });
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
    {isHindi && <HindiRouteHead route={getHindiStaticRoute("booking")} />}
    <div className="min-h-[80vh] bg-accent/10 py-16 px-4" data-no-translate={isHindi ? true : undefined}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-background rounded-3xl p-8 shadow-lg border border-border/50 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5 text-primary">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground mb-2">
            {t("Booking Request Received", "बुकिंग अनुरोध प्राप्त हुआ")}
          </h2>
          <p className="text-muted-foreground">
            {t("Thank you, ", "धन्यवाद, ")}
            <strong>{formValues.firstName}</strong>
            {isHindi ? "। " : ". "}
            {isHindi
              ? sessionMode === "telehealth"
                ? `हमारी टीम आपसे ${confirmationWindowText} संपर्क करेगी और आपके ऑनलाइन परामर्श स्लॉट की पुष्टि करेगी।`
                : homecareIsActive
                  ? `हमारी टीम आपसे ${confirmationWindowText} संपर्क करेगी और अनुरोधित घर पर मुलाक़ात के लिए आपके सही इलाके, फिजियोथेरेपिस्ट की उपलब्धता और समय की पुष्टि करेगी।`
                  : `हम आपके सही इलाके की समीक्षा करेंगे और ${confirmationWindowText} आपसे संपर्क करके बताएँगे कि घर पर मुलाक़ात की व्यवस्था हो सकती है या नहीं। टीम तैनात होने तथा सही इलाके और फिजियोथेरेपिस्ट की उपलब्धता जाँचने तक मुलाक़ात की पुष्टि नहीं होती; ऑनलाइन परामर्श अभी उपलब्ध है।`
              : sessionMode === "telehealth"
                ? `Our team will contact you ${confirmationWindowText} to confirm your online consultation slot.`
                : homecareIsActive
                  ? `Our team will contact you ${confirmationWindowText} to confirm your exact locality, clinician availability, and timing for the requested home visit.`
                  : `We will review your exact locality and contact you ${confirmationWindowText} to confirm whether a home visit can be arranged. A visit is not confirmed until a team is placed and exact-locality and clinician availability are checked; online consultation is available now.`}{" "}
            {isHindi ? "अनुरोध का सारांश " : "A summary has been sent to "}
            <strong>{formValues.email}</strong>
            {isHindi ? " पर भेजा गया है।" : "."}
          </p>
        </div>

        {/* Appointment Summary */}
        <div className="bg-background rounded-3xl p-8 shadow-lg border border-border/50">
          <h3 className="font-serif text-xl font-semibold mb-5 text-foreground">
            {t("Appointment Summary", "अपॉइंटमेंट सारांश")}
          </h3>
          <div className="space-y-3">
            {[
              { label: t("Reference", "संदर्भ संख्या"), value: `#${booking.id}` },
              { label: t("Name", "नाम"), value: `${formValues.firstName} ${formValues.lastName}` },
              {
                label: t("Session Type", "सत्र का प्रकार"),
                value: sessionMode === "home"
                  ? t("Home Visit", "घर पर मुलाक़ात")
                  : t("Online Consultation", "ऑनलाइन परामर्श"),
              },
              { label: t("Appointment", "अपॉइंटमेंट"), value: appointmentLabel },
              ...(formValues.city
                ? [{ label: t("City", "शहर"), value: cityName }]
                : []),
              { label: t("Preferred Date", "पसंदीदा तारीख"), value: format(formValues.preferredDate, "PPP") },
              { label: t("Phone", "फ़ोन"), value: formValues.phone },
              ...(formValues.notes ? [{ label: t("Notes", "टिप्पणी"), value: formValues.notes }] : []),
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-start gap-4 py-2 border-b border-border/40 last:border-0">
                <span className="text-sm text-muted-foreground flex-shrink-0 w-36">{label}</span>
                <span className="text-sm font-medium text-foreground text-right">{value}</span>
              </div>
            ))}
            {documentStatus && (
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-accent/20 px-4 py-3 text-sm text-muted-foreground">
                <FileText className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                <span>
                  {documentStatus === "delivered"
                    ? t(
                        "Your document was sent securely to the care team by email and WhatsApp.",
                        "आपका दस्तावेज़ ईमेल और WhatsApp से सुरक्षित रूप से देखभाल टीम को भेजा गया।",
                      )
                    : documentStatus === "email-delivered"
                    ? t(
                        "Your document was sent securely to the care team by email. WhatsApp delivery is not connected yet.",
                        "आपका दस्तावेज़ ईमेल से सुरक्षित रूप से भेजा गया। WhatsApp पर भेजने की सुविधा अभी जुड़ी नहीं है।",
                      )
                    : t(
                        "Your booking was received, but the document could not be delivered. Please share it with the care team by email or WhatsApp.",
                        "आपका अनुरोध मिल गया, लेकिन दस्तावेज़ नहीं भेजा जा सका। कृपया इसे ईमेल या WhatsApp से देखभाल टीम को भेजें।",
                      )}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2 mt-1">
              <span className="text-sm text-muted-foreground w-36">{t("Session Fee", "सत्र शुल्क")}</span>
              <span className="text-base font-bold text-primary">
                {sessionMode === "telehealth" ? pricing.telehealth.amount : pricing.homeVisit.amount}
              </span>
            </div>
          </div>
        </div>

        {/* UPI Payment */}
        <div className="bg-background rounded-3xl p-8 shadow-lg border border-border/50">
          <h3 className="font-serif text-xl font-semibold mb-2 text-foreground">
            {t("Pay in Advance via UPI", "UPI से अग्रिम भुगतान करें")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t(
              "Payment is optional at this stage. Use the QR code with any UPI app (GPay, PhonePe, Paytm, BHIM), or wait for our team to confirm the exact fee.",
              "इस चरण पर भुगतान वैकल्पिक है। किसी भी UPI ऐप (GPay, PhonePe, Paytm, BHIM) से QR कोड स्कैन करें, या हमारी टीम से सही शुल्क की पुष्टि होने तक प्रतीक्षा करें।",
            )}
          </p>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* QR Code */}
            <a
              href={upiLink}
              className="flex-shrink-0 block"
              data-testid="upi-qr-code"
              title={t("Tap to open in UPI app", "UPI ऐप में खोलने के लिए टैप करें।")}
              onClick={() =>
                trackEvent("booking_confirmation_action", {
                  route: "booking",
                  action: "open_upi",
                  session_mode: sessionMode,
                })
              }
            >
              <div className="p-3 bg-white rounded-2xl border border-border/40 shadow-sm">
                <QRCodeSVG
                  value={upiLink}
                  size={180}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  aria-label={
                    isHindi
                      ? `किसी भी UPI ऐप से ${BUSINESS_NAME} को भुगतान करने के लिए स्कैन करें।`
                      : `Scan to pay ${BUSINESS_NAME} via any UPI app`
                  }
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {t("Tap on mobile to open UPI app", "मोबाइल पर UPI ऐप खोलने के लिए यहाँ टैप करें।")}
              </p>
            </a>
            {/* Details */}
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {t("Pay to", "भुगतान पाने वाला")}
                </p>
                <p className="font-semibold text-foreground">{BUSINESS_NAME}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{t("UPI ID", "UPI ID")}</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono bg-accent/30 px-3 py-1.5 rounded-lg">{BUSINESS_UPI_ID}</code>
                  <button
                    type="button"
                    onClick={copyUpiId}
                    className="p-1.5 rounded-lg hover:bg-accent/50 transition-colors text-muted-foreground"
                    title={t("Copy UPI ID", "UPI ID कॉपी करें")}
                    aria-label={copied ? t("Copied", "कॉपी हो गया") : t("Copy UPI ID", "UPI ID कॉपी करें")}
                    data-testid="copy-upi-id"
                  >
                    {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{t("Amount", "राशि")}</p>
                 <p className="font-bold text-lg text-primary">
                   {amount === undefined ? pricing.homeVisit.amount : pricing.telehealth.displayAmount}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  {t("Reference", "संदर्भ संख्या")}
                </p>
                <p className="text-sm text-foreground">Physio Booking #{booking.id}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {amount === undefined
                  ? t(
                      "For home visits, the exact amount within the displayed range is confirmed before payment.",
                      "घर पर मुलाक़ात में भुगतान से पहले दिखाए गए दायरे के भीतर सही राशि की पुष्टि की जाएगी।",
                    )
                  : t(
                      "We also accept bank transfer (NEFT/IMPS/RTGS) and WhatsApp Pay. Details will be shared when our team contacts you.",
                      "हम बैंक ट्रांसफ़र (NEFT/IMPS/RTGS) और WhatsApp Pay भी स्वीकार करते हैं। हमारी टीम संपर्क करेगी तब विवरण साझा किए जाएँगे।",
                    )}
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => {
              trackEvent("booking_confirmation_action", {
                route: "booking",
                action: "book_another",
                session_mode: sessionMode,
              });
              onBookAnother();
            }}
            variant="booking"
            className="rounded-full"
            data-testid="button-book-another"
          >
            {t("Book Another Appointment", "एक और अपॉइंटमेंट बुक करें")}
          </Button>
          <p className="mt-5 text-sm text-muted-foreground">
            {t("For more information, visit ", "अधिक जानकारी के लिए ")}
            <Link
              href="/"
              className="font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              goswamirehab.in
            </Link>
            {t(".", " पर जाएँ।")}
          </p>
        </div>
      </div>
    </div>
    </>
  );
}

export default function Booking() {
  const { language } = useLanguage();
  const isHindi = language === "hi";
  const t = (english: string, hindi: string) => isHindi ? hindi : english;
  const validationSchema = useMemo(() => buildBookingFormSchema(isHindi), [isHindi]);
  const [confirmation, setConfirmation] = useState<ConfirmationData | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentError, setDocumentError] = useState<string | null>(null);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [antiSpamToken, setAntiSpamToken] = useState<string | null>(null);
  const [isLoadingAntiSpamToken, setIsLoadingAntiSpamToken] = useState(true);
  const [isClientReady, setIsClientReady] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState("");
  const formStartedRef = useRef(false);
  const search = useSearch();
  const bookingContext = getBookingIndexContextFromSearch(search);
  const [pendingBookingContext, setPendingBookingContext] =
    useState<PendingBookingContext | null>(null);
  const queryCitySlug = bookingContext?.citySlug ?? pendingBookingContext?.citySlug;
  const queryLocality =
    bookingContext?.localityName ??
    getBookingLocalityFromContext(queryCitySlug, pendingBookingContext?.localityId);
  const queryCity = queryCitySlug ? cities.find((city) => city.slug === queryCitySlug) : undefined;
  const [sessionMode, setSessionMode] = useState<"home" | "telehealth">(
    () => bookingContext?.mode ?? "home",
  );
  useEffect(() => {
    const pendingContext = consumePendingBookingContext();
    const query = new URLSearchParams(search.replace(/^\?/, ""));
    if (pendingContext && query.toString() === "") {
      setPendingBookingContext(pendingContext);
      if (pendingContext.mode) setSessionMode(pendingContext.mode);
    }
  }, [search]);
  const englishPageCopy = getBookingPageCopy({
    cityName: queryCity?.name,
    localityName: queryLocality,
    mode: sessionMode,
  });
  const locationName = queryLocality && queryCity
    ? `${queryLocality}, ${getHindiCityDisplayName(queryCity.slug, queryCity.name)}`
    : queryCity
      ? getHindiCityDisplayName(queryCity.slug, queryCity.name)
      : "";
  const hindiPageCopy = sessionMode === "telehealth"
    ? locationName
      ? {
          heading: `${locationName} से ऑनलाइन फिजियोथेरेपी का अनुरोध करें`,
          introduction: `${locationName} से ऑनलाइन फिजियोथेरेपी परामर्श का अनुरोध भेजें। ऑनलाइन परामर्श दुनिया भर में उपलब्ध हैं; आकलन और पुनर्वास योजना के लिए अपने लक्ष्य और पसंदीदा तारीख बताएँ।`,
        }
      : {
          heading: "ऑनलाइन फिजियोथेरेपी परामर्श बुक करें",
          introduction: "विशेषज्ञ ऑनलाइन फिजियोथेरेपी दुनिया भर में उपलब्ध है। वीडियो परामर्श के माध्यम से आकलन, व्यक्तिगत व्यायाम मार्गदर्शन और पुनर्वास योजना का अनुरोध करें।",
        }
    : locationName
      ? {
          heading: `${locationName} में घर पर फिजियोथेरेपी का अनुरोध करें`,
          introduction: `${locationName} के लिए घर पर फिजियोथेरेपी मुलाक़ात का अनुरोध भेजें। टीम हर अनुरोध की समीक्षा करेगी और मुलाक़ात तय करने से पहले स्थानीय फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करेगी। ऑनलाइन परामर्श दुनिया भर में उपलब्ध है।`,
        }
      : {
          heading: "घर पर फिजियोथेरेपिस्ट बुक करें",
          introduction: "अपना शहर, इलाका, देखभाल की ज़रूरत और पसंदीदा तारीख बताएँ। टीम हर घर-मुलाक़ात अनुरोध की समीक्षा करती है और मुलाक़ात तय करने से पहले स्थानीय फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि करती है। ऑनलाइन परामर्श दुनिया भर में उपलब्ध है।",
        };
  const pageCopy = isHindi ? hindiPageCopy : englishPageCopy;

  const createBooking = useCreateBooking();

  const loadAntiSpamToken = useCallback(async () => {
    setIsLoadingAntiSpamToken(true);
    try {
      const response = await fetch(`${API_BASE}/api/bookings/anti-spam-token`, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Could not prepare booking form");
      const result = (await response.json()) as { token?: unknown };
      setAntiSpamToken(typeof result.token === "string" ? result.token : null);
    } catch {
      setAntiSpamToken(null);
    } finally {
      setIsLoadingAntiSpamToken(false);
    }
  }, []);

  useEffect(() => {
    setIsClientReady(true);
    void loadAntiSpamToken();
  }, [loadAntiSpamToken]);

  const form = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      appointmentType: "",
      city: "",
      mainConcern: "",
      affectedArea: "",
      painLevel: undefined,
      problemDuration: "",
      recoveryGoal: "",
      notes: "",
      videoPlatform: "",
      priceAccepted: false,
    },
  });

  const selectedCitySlug = form.watch("city") || queryCitySlug || "";
  const selectedCity = getCityBySlug(selectedCitySlug);
  const confirmationWindowHours = getCityConfirmationWindowHours(selectedCitySlug);
  const confirmationWindowText = displayConfirmationWindow(
    selectedCitySlug,
    sessionMode,
    isHindi,
  );

  function selectSessionMode(mode: "home" | "telehealth") {
    setSessionMode(mode);
    form.setValue("appointmentType", "", { shouldValidate: false });
    form.setValue("videoPlatform", "", { shouldValidate: false });
    form.setValue("priceAccepted", false, { shouldValidate: true });
    trackEvent("booking_mode_select", {
      route: "booking",
      session_mode: mode,
    });
  }

  async function onSubmit(values: FormValues) {
    setSubmitError(null);
    setDocumentError(null);
    if (!antiSpamToken) {
      setSubmitError(
        isHindi
          ? "अनुरोध भेजने से पहले यह पेज रीफ़्रेश करें।"
          : "Please refresh this page before submitting your request.",
      );
      return;
    }
    const selectedCity = values.city || queryCitySlug;
    const submittedValues = {
      ...values,
      city: selectedCity,
      notes: [queryLocality ? `Requested locality: ${queryLocality}` : "", values.notes]
        .concat(
          sessionMode === "telehealth" && values.videoPlatform
            ? [`Preferred video platform: ${values.videoPlatform}`]
            : [],
        )
        .filter(Boolean)
        .join("\n"),
    };
    if (sessionMode === "telehealth" && !values.videoPlatform) {
      setSubmitError(
        isHindi
          ? "ऑनलाइन परामर्श के लिए कृपया पसंदीदा वीडियो प्लेटफ़ॉर्म चुनें।"
          : "Please choose a preferred video platform.",
      );
      return;
    }
    try {
      const booking = await createBooking.mutateAsync({
        data: {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          appointmentType: values.appointmentType,
          city: selectedCity || undefined,
          preferredDate: format(values.preferredDate, "yyyy-MM-dd"),
          mainConcern: values.mainConcern,
          affectedArea: values.affectedArea,
          painLevel: values.painLevel,
          problemDuration: values.problemDuration || undefined,
          recoveryGoal: values.recoveryGoal || undefined,
          notes: submittedValues.notes,
          antiSpamToken,
          website: honeypotValue,
           acceptedPriceMode: sessionMode,
           acceptedPriceKey:
             sessionMode === "telehealth"
               ? pricing.telehealth.priceKey
               : pricing.homeVisit.priceKey,
           priceAccepted: values.priceAccepted,
        },
      });

      let documentStatus: ConfirmationData["documentStatus"];
      if (documentFile) {
        setIsUploadingDocument(true);
        try {
          if (!booking.documentUploadToken) {
            throw new Error("Missing document upload token");
          }
          const body = new FormData();
          body.append("uploadToken", booking.documentUploadToken);
          body.append("file", documentFile);
          const response = await fetch(`${API_BASE}/api/bookings/documents`, {
            method: "POST",
            body,
          });
          if (!response.ok) {
            throw new Error("Document upload failed");
          }
          const result = (await response.json()) as {
            emailDelivered: boolean;
            whatsappDelivered: boolean;
          };
          documentStatus = result.emailDelivered
            ? result.whatsappDelivered
              ? "delivered"
              : "email-delivered"
            : "failed";
        } catch {
          documentStatus = "failed";
        } finally {
          setIsUploadingDocument(false);
        }
      }

      setConfirmation({ booking, formValues: submittedValues, sessionMode, documentStatus });
      trackEvent("booking_request_received", {
        route: "booking",
        city: selectedCity || "unspecified",
        locality: queryLocality || "unspecified",
        session_mode: sessionMode,
        document_status: documentStatus ?? "not_attached",
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        isHindi
          ? "अनुरोध भेजते समय कुछ समस्या हुई। कृपया फिर कोशिश करें।"
          : "Something went wrong submitting your request. Please try again.",
      );
    }
  }

  if (confirmation) {
    return (
      <ConfirmationPage
        data={confirmation}
        onBookAnother={() => {
          setConfirmation(null);
          setDocumentFile(null);
          setDocumentError(null);
          setHoneypotValue("");
          void loadAntiSpamToken();
          form.reset();
        }}
      />
    );
  }

  return (
    <>
    {isHindi && <HindiRouteHead route={getHindiStaticRoute("booking")} />}
    <div className="bg-accent/10 min-h-screen py-16 md:py-24" data-no-translate={isHindi ? true : undefined}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">

          <ol
            className="mx-auto mb-8 grid max-w-3xl grid-cols-2 gap-3 text-center text-xs sm:grid-cols-4"
            aria-label={t("Booking journey", "बुकिंग की प्रक्रिया")}
          >
            {[
              { label: t("Location", "स्थान"), active: Boolean(queryCity || form.watch("city")) },
              { label: t("Service & price", "सेवा और शुल्क"), active: true },
              { label: t("Patient details", "मरीज़ की जानकारी"), active: false },
              { label: t("Request received", "अनुरोध प्राप्त हुआ"), active: Boolean(confirmation) },
            ].map((step, index) => (
              <li key={step.label} className="flex items-center gap-2 text-left sm:flex-col sm:gap-1 sm:text-center">
                <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}>
                  {index + 1}
                </span>
                <span className="font-medium text-muted-foreground">{step.label}</span>
              </li>
            ))}
          </ol>

          {/* Session Mode Toggle */}
          <div className="flex justify-center mb-10">
            <div
              className="inline-flex bg-background rounded-full border border-border/60 p-1 shadow-sm"
              role="group"
              aria-label={t("Choose session type", "देखभाल का प्रकार चुनें")}
            >
              <button
                type="button"
                onClick={() => selectSessionMode("home")}
                data-testid="tab-home-visit"
                aria-pressed={sessionMode === "home"}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  sessionMode === "home"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:text-primary"
                }`}
              >
                <House className="w-4 h-4" />
                {t("Home Visit", "घर पर मुलाक़ात")}
              </button>
              <button
                type="button"
                onClick={() => selectSessionMode("telehealth")}
                data-testid="tab-online"
                aria-pressed={sessionMode === "telehealth"}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  sessionMode === "telehealth"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-foreground hover:text-primary"
                }`}
              >
                <Video className="w-4 h-4" />
                {t("Online Consultation", "ऑनलाइन परामर्श")}
              </button>
            </div>
          </div>

          <div
            className="mx-auto mb-8 flex max-w-3xl flex-col gap-4 rounded-2xl border border-primary/15 bg-primary/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            data-testid="booking-care-summary"
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                {t("Current care path", "यहाँ की देखभाल:")}
              </p>
              <p className="mt-1 font-semibold text-foreground">
                {sessionMode === "home"
                  ? t("Home visit", "घर पर मुलाक़ात")
                  : t("Online consultation", "ऑनलाइन परामर्श")}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {isHindi
                  ? sessionMode === "home"
                    ? selectedCitySlug && !hasVerifiedHomecareCoverage({ slug: selectedCitySlug })
                      ? "ऑनलाइन परामर्श अभी उपलब्ध है। घर पर मुलाक़ात के अनुरोध की समीक्षा संभावित टीम-तैनाती के लिए की जाएगी; स्थानीय टीम तैनात होने तक मुलाक़ात की पुष्टि नहीं होती।"
                      : "घर पर मुलाक़ात के लिए: अपनी सही स्थानीय जगह बताएँ, ताकि टीम बुकिंग से पहले फिजियोथेरेपिस्ट और आने-जाने के मार्ग की उपलब्धता की पुष्टि कर सके।"
                    : "ऑनलाइन परामर्श के लिए: वीडियो प्लेटफ़ॉर्म चुनें और कहीं से भी आकलन का अनुरोध भेजें।"
                  : sessionMode === "home"
                    ? hasVerifiedHomecareCoverage({ slug: selectedCitySlug })
                      ? "Share your exact locality so the team can confirm clinician and route availability before booking."
                      : "Online consultation is available now. Home-visit requests are reviewed for possible team placement and are not confirmed until a local team is placed."
                    : "Choose a video platform and request an assessment from anywhere."}
              </p>
            </div>
            {(BUSINESS_PHONE_TEL || BUSINESS_WHATSAPP_URL) && (
              <div className="flex flex-wrap gap-3 text-sm font-semibold">
                {BUSINESS_PHONE_TEL && (
                  <a
                    href={BUSINESS_PHONE_TEL}
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    data-testid="booking-help-phone"
                  >
                    {BUSINESS_PHONE_DISPLAY}
                  </a>
                )}
                {BUSINESS_WHATSAPP_URL && (
                  <a
                    href={BUSINESS_WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    data-testid="booking-help-whatsapp"
                  >
                    {t("Need help? WhatsApp", "सहायता चाहिए? WhatsApp पर संदेश भेजें।")}
                  </a>
                )}
              </div>
            )}
          </div>

          {isHindi ? (
            <section
              className="mx-auto mb-8 max-w-3xl rounded-2xl border border-border/70 bg-background px-5 py-5"
              data-testid="hindi-booking-next-steps"
              aria-labelledby="hindi-booking-next-steps-title"
            >
              <h2 id="hindi-booking-next-steps-title" className="font-serif text-xl font-semibold">
                अगले कदम
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                अनुरोध से देखभाल तक की प्रक्रिया स्पष्ट रखें। अनुरोध भेजने के बाद टीम उसकी समीक्षा करेगी। टीम से बात होने तक अपॉइंटमेंट की पुष्टि नहीं होती।
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed">
                <li>
                  <strong>अनुरोध भेजें।</strong> अपनी देखभाल की ज़रूरत, पसंदीदा तारीख और प्रासंगिक होने पर स्थान बताएँ।
                </li>
                <li>
                  <strong>टीम समीक्षा करेगी।</strong>{" "}
                  {sessionMode === "home"
                    ? `हम आपका अनुरोध, ${locationName || "आपका स्थान"} और फिजियोथेरेपिस्ट की उपलब्धता देखकर घर पर मुलाक़ात की पुष्टि करेंगे।`
                    : "ऑनलाइन अनुरोध में, हम आपकी चिंता और ऑनलाइन देखभाल के अनुरोध की समीक्षा करेंगे।"}
                </li>
                <li>
                  <strong>योजना की पुष्टि साथ करें।</strong> टीम फिजियोथेरेपिस्ट, समय, देखभाल का प्रकार और ज़रूरी व्यावहारिक जानकारी की पुष्टि करने के लिए आपसे संपर्क करेगी।
                </li>
                <li>
                  <strong>देखभाल और आगे का मार्गदर्शन।</strong> अपॉइंटमेंट के बाद व्यावहारिक सलाह और अगले कदम बताए जाएँगे।
                </li>
              </ol>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                अनुरोध भेजने पर कोई शुल्क नहीं लगता। भुगतान आवश्यक हो तो अनुरोध की समीक्षा के बाद टीम आपसे उस पर बात करेगी।
              </p>
            </section>
          ) : (
          <div className="mx-auto mb-8 max-w-3xl">
            <ProgressiveCareJourney
              mode={sessionMode}
              locationStatus={
                selectedCity
                  ? hasVerifiedHomecareCoverage(selectedCity)
                    ? "verified"
                    : "expansion"
                  : "generic"
              }
              locationName={selectedCity?.name}
              locality={selectedCitySlug === queryCitySlug ? queryLocality : undefined}
            />
          </div>
          )}

          <div className="text-center mb-10">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">
              {pageCopy.heading}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {pageCopy.introduction}
            </p>
            <section
              aria-labelledby="booking-care-options"
              className="mx-auto mb-8 max-w-3xl rounded-3xl border border-border/60 bg-background/70 p-6 text-left shadow-sm"
            >
              <h2 id="booking-care-options" className="font-serif text-2xl font-semibold text-foreground">
                {t("Physiotherapy booking for home visits and online care", "उपलब्ध देखभाल का विवरण")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(
                  "Home visits and online consultations are available in all 45 listed cities; online consultations are also available worldwide. For home visits, share your exact locality so the team can confirm clinician availability before the appointment.",
                  "घर पर मुलाक़ात और ऑनलाइन परामर्श सूचीबद्ध सभी 45 शहरों में उपलब्ध हैं; ऑनलाइन परामर्श दुनिया भर में भी उपलब्ध हैं। घर पर मुलाक़ात के लिए अपना सही इलाका बताएँ, ताकि टीम अपॉइंटमेंट से पहले फिजियोथेरेपिस्ट की उपलब्धता की पुष्टि कर सके।",
                )}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  href={isHindi ? "/hi/online-care" : "/online-care"}
                  className="rounded-2xl border border-primary/20 bg-primary/5 p-4 transition-colors hover:border-primary/40 hover:bg-primary/10"
                >
                  <span className="font-semibold text-foreground">
                    {t("Online physiotherapy consultation", "ऑनलाइन फिजियोथेरेपी परामर्श")}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {t(
                      "Video assessment, exercise guidance, and rehabilitation planning from anywhere.",
                      "वीडियो आकलन, व्यायाम मार्गदर्शन और कहीं से भी पुनर्वास योजना।",
                    )}
                  </span>
                </Link>
                <Link
                  href={isHindi && selectedCity ? getHindiCityPath(selectedCity.slug) : "/cities"}
                  className="rounded-2xl border border-border/70 bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-semibold text-foreground">
                    {t("Check city home-visit options", "शहर के घर-मुलाक़ात विकल्प देखें")}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                    {t(
                      "Review current city information before sending a home-visit enquiry.",
                      "घर-मुलाक़ात का अनुरोध भेजने से पहले शहर की मौजूदा जानकारी देखें।",
                    )}
                  </span>
                </Link>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
                {t(
                  "Our team reviews the clinical concern and location before confirming the appointment and the correct care option.",
                  "अपॉइंटमेंट और देखभाल का सही विकल्प तय करने से पहले टीम आपकी क्लिनिकल चिंता और स्थान की समीक्षा करती है।",
                )}
              </p>
            </section>
            {queryLocality && queryCity && (
              <div className="mx-auto mb-8 flex max-w-xl items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-left">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-foreground">
                    {t(
                      `Home visit area: ${queryLocality}, ${queryCity.name}`,
                      `घर पर मुलाक़ात का इलाका: ${queryLocality}, ${getHindiCityDisplayName(queryCity.slug, queryCity.name)}।`,
                    )}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {t(
                      "We’ll use this location to help confirm the right physiotherapy availability.",
                      "इस स्थान की मदद से टीम सही फिजियोथेरेपी उपलब्धता की पुष्टि करेगी।",
                    )}
                  </p>
                </div>
              </div>
            )}
            {sessionMode === "home" && (
              <div
                className="mb-4 flex flex-col items-center"
                aria-label={t("Home-visit pricing", "घर पर मुलाक़ात का शुल्क")}
              >
                <span className="text-xs font-semibold text-primary">
                  {t("introductory service price", "घर पर मुलाक़ात का दिखाया गया परिचयात्मक शुल्क")}
                </span>
                <strong
                  className="mt-1 text-2xl font-bold text-primary"
                  data-testid="text-home-visit-intro-price"
                >
                  {pricing.homeVisit.amount} {t("per session", "प्रति सत्र")}
                </strong>
                <span
                  className="mt-1 text-xs text-muted-foreground line-through"
                  data-testid="text-home-visit-regular-price"
                >
                  {t("Regular:", "नियमित शुल्क")} {pricing.homeVisit.regularAmount} {t("per session", "प्रति सत्र")}
                </span>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 mb-2">
              {(sessionMode === "home"
                ? [
                    t("45 listed cities", "45 सूचीबद्ध शहर"),
                    isHindi
                      ? `${confirmationWindowText} संपर्क किया जाएगा`
                      : `Confirmed ${confirmationWindowText}`,
                    t("Certified Physiotherapists", "प्रमाणित फिजियोथेरेपिस्ट."),
                  ]
                : [
                    `${pricing.telehealth.displayAmount} ${t("per consultation", "प्रति परामर्श")}`,
                    t("Available Worldwide", "दुनिया भर में उपलब्ध"),
                    t("Video via WhatsApp / Google Meet", "WhatsApp / Google Meet के माध्यम से वीडियो"),
                    isHindi
                      ? `${confirmationWindowText} टीम संपर्क करेगी`
                      : `Confirmed ${confirmationWindowText}`,
                  ]
              ).map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            {sessionMode === "telehealth" && (
              <p className="text-xs text-muted-foreground mt-4 max-w-lg mx-auto">
                {isHindi
                  ? `ऑनलाइन बुकिंग के बाद ${confirmationWindowText} टीम आपसे संपर्क करेगी और आपके समय क्षेत्र के अनुसार वीडियो प्लेटफ़ॉर्म तथा सत्र के समय की पुष्टि करेगी।`
                  : `After booking, our team will contact you ${confirmationWindowText} to confirm your preferred video platform and session time, adjusted for your time zone.`}
              </p>
            )}
          </div>

          <motion.div
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            className="bg-background rounded-3xl p-6 md:p-10 shadow-lg border border-border/50"
          >
            <Form {...form}>
              <form
                data-client-ready={isClientReady ? "true" : "false"}
                onFocus={() => {
                  if (formStartedRef.current) return;
                  formStartedRef.current = true;
                  trackEvent("booking_form_start", {
                    route: "booking",
                    city: queryCitySlug || "unspecified",
                    locality: queryLocality || "unspecified",
                    session_mode: sessionMode,
                  });
                }}
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  trackEvent("booking_form_error", {
                    route: "booking",
                    city: queryCitySlug || "unspecified",
                    locality: queryLocality || "unspecified",
                    session_mode: sessionMode,
                    field_count: Object.keys(errors).length,
                  });
                })}
                className="space-y-8"
              >
                <div
                  aria-hidden="true"
                  inert
                  className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden"
                >
                  <input
                    id="booking-website"
                    aria-hidden="true"
                    name="website"
                    type="hidden"
                    autoComplete="off"
                    value={honeypotValue}
                    onChange={(event) => setHoneypotValue(event.target.value)}
                  />
                </div>

                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-semibold border-b border-border/50 pb-2">
                    {t("Personal Details", "व्यक्तिगत जानकारी")}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t("First Name", "पहला नाम")}</FormLabel>
                          <FormControl>
                            <Input placeholder="Priya" autoComplete="given-name" enterKeyHint="next" className="bg-background/50 h-12" {...field} data-testid="input-firstname" />
                          </FormControl>
                        <FormDescription>
                          {t("Enter your first name.", "नीचे अपना पहला नाम लिखें।")}
                        </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t("Last Name", "उपनाम")}</FormLabel>
                          <FormControl>
                            <Input placeholder="Sharma" autoComplete="family-name" enterKeyHint="next" className="bg-background/50 h-12" {...field} data-testid="input-lastname" />
                          </FormControl>
                        <FormDescription>
                          {t("Enter your last name.", "नीचे अपना उपनाम लिखें।")}
                        </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t("Email Address", "ईमेल पता")}</FormLabel>
                          <FormControl>
                            <Input placeholder="priya@example.in" type="email" autoComplete="email" enterKeyHint="next" className="bg-background/50 h-12" {...field} data-testid="input-email" />
                          </FormControl>
                        <FormDescription>
                          {t(
                            "Enter an email address where our team can reach you.",
                            "वह ईमेल पता दर्ज करें जिस पर टीम आपसे संपर्क कर सके।",
                          )}
                        </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t("Phone Number", "फ़ोन नंबर")}</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 98765 43210" type="tel" autoComplete="tel" enterKeyHint="next" className="bg-background/50 h-12" {...field} data-testid="input-phone" />
                          </FormControl>
                        <FormDescription>
                          {t(
                            "Enter a reachable phone number, including the country code if needed.",
                            "ज़रूरत हो तो देश कोड सहित ऐसा नंबर दें जिस पर संपर्क किया जा सके।",
                          )}
                        </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="space-y-6 pt-4">
                  <h2 className="font-serif text-2xl font-semibold border-b border-border/50 pb-2">
                    {t("Appointment Details", "अपॉइंटमेंट की जानकारी")}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="appointmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t("Type of Appointment", "अपॉइंटमेंट का प्रकार")}</FormLabel>
                          <FormControl>
                            <AccessibleSelect
                              {...field}
                              value={field.value ?? ""}
                              placeholder={t("Select a service", "सेवा चुनें")}
                              options={(sessionMode === "home" ? appointmentTypes : telehealthAppointmentTypes).map((type) => ({
                                value: type,
                                label: isHindi ? getHindiAppointmentLabel(type) : type,
                                testId: `select-type-${type}`,
                              }))}
                              className="bg-background/50 h-12"
                              data-testid="select-type"
                            />
                          </FormControl>
                          <FormDescription>{t("Choose the service you want to book.", "सेवा चुनें।")}</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">{t("City / Location", "शहर / स्थान")}</FormLabel>
                          <FormControl>
                            <AccessibleSelect
                              {...field}
                              value={field.value || queryCitySlug || ""}
                              autoComplete="address-level2"
                              placeholder={t("Select your city", "अपना देखभाल वाला शहर चुनें")}
                              options={cities.map((city) => ({
                                value: city.slug,
                                label: city.slug === "gurgaon"
                                  ? isHindi
                                    ? getHindiCityDisplayName(city.slug, city.name)
                                    : "Gurugram (Gurgaon)"
                                  : isHindi
                                    ? getHindiCityDisplayName(city.slug, city.name)
                                    : city.name,
                                testId: `select-city-${city.slug}`,
                              }))}
                              className="bg-background/50 h-12"
                              data-testid="select-city"
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "Select the city where you need care. Optional for online consultations.",
                              "अपना देखभाल वाला शहर चुनें। ऑनलाइन परामर्श के लिए शहर देना वैकल्पिक है।",
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {sessionMode === "telehealth" && (
                      <FormField
                        control={form.control}
                        name="videoPlatform"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">{t("Preferred video platform", "पसंदीदा वीडियो प्लेटफ़ॉर्म")}</FormLabel>
                            <FormControl>
                              <AccessibleSelect
                                {...field}
                                value={field.value ?? ""}
                                placeholder={t("Choose a video platform", "वीडियो प्लेटफ़ॉर्म चुनें")}
                                options={[
                                  { value: "Google Meet", label: "Google Meet", testId: "select-platform-google-meet" },
                                  { value: "Zoom", label: "Zoom", testId: "select-platform-zoom" },
                                  { value: "WhatsApp video", label: t("WhatsApp video", "WhatsApp वीडियो"), testId: "select-platform-whatsapp" },
                                  { value: "No preference", label: t("No preference", "कोई प्राथमिकता नहीं"), testId: "select-platform-none" },
                                ]}
                                className="bg-background/50 h-12"
                                data-testid="select-video-platform"
                              />
                            </FormControl>
                            <FormDescription>
                              {t(
                                "Choose the video calling system that is easiest for you.",
                                "वह विकल्प चुनें जो आपके लिए आसान हो।",
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                      <FormField
                        control={form.control}
                        name="preferredDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col justify-end">
                            <FormLabel className="text-foreground mb-2">{t("Preferred Date", "पसंदीदा तारीख")}</FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                min={format(new Date(), "yyyy-MM-dd")}
                                value={field.value ? format(field.value, "yyyy-MM-dd") : ""}
                                onChange={(event) => {
                                  const value = event.target.value;
                                  field.onChange(value ? new Date(`${value}T00:00:00`) : undefined);
                                }}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                                enterKeyHint="next"
                                className="bg-background/50 h-12"
                                data-testid="input-preferred-date"
                              />
                            </FormControl>
                            <FormDescription>
                              {t(
                                "Choose your preferred appointment date. Past dates are not available.",
                                "अपनी पसंदीदा अपॉइंटमेंट तारीख चुनें। बीती तारीखें उपलब्ध नहीं हैं।",
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                  </div>

                  <div className="space-y-6 pt-4">
                    <h2 className="font-serif text-2xl font-semibold border-b border-border/50 pb-2">
                      {t("Physiotherapy Assessment", "फिजियोथेरेपी आकलन")}
                    </h2>

                    <FormField
                      control={form.control}
                      name="mainConcern"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">
                            {t(
                              "What is the main problem or reason for treatment?",
                              "मुख्य समस्या या उपचार का कारण क्या है?",
                            )}
                          </FormLabel>
                          <FormControl>
                             <Textarea
                              placeholder={t(
                                "For example: difficulty walking after a stroke, shoulder pain, or recovery after surgery",
                                "उदाहरण: स्ट्रोक के बाद चलने में कठिनाई, कंधे में दर्द या सर्जरी के बाद रिकवरी।",
                              )}
                              className="bg-background/50 min-h-[110px] resize-none"
                               enterKeyHint="next"
                              {...field}
                              data-testid="textarea-main-concern"
                            />
                          </FormControl>
                          <FormDescription>
                            {t(
                              "Keep this brief. Please do not include detailed pregnancy, birth, child, or other medical history here; a clinician can request relevant details privately if needed.",
                              "इसे संक्षेप में लिखें। यहाँ गर्भावस्था, प्रसव, बच्चे या अन्य स्वास्थ्य-इतिहास का विस्तृत विवरण न लिखें। ज़रूरत होने पर क्लिनिशियन आपसे प्रासंगिक जानकारी निजी रूप से माँग सकते हैं।",
                            )}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="affectedArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {t("Which area is affected?", "कौन-सा अंग या क्षेत्र प्रभावित है?")}
                            </FormLabel>
                          <FormControl>
                            <AccessibleSelect
                              {...field}
                              value={field.value ?? ""}
                              placeholder={t("Select an area", "प्रभावित क्षेत्र चुनें")}
                              options={[
                                ["back-neck", "Back or neck", "पीठ या गर्दन"],
                                ["shoulder-arm", "Shoulder or arm", "कंधा या बाँह"],
                                ["hip-knee", "Hip or knee", "कूल्हा या घुटना"],
                                ["ankle-foot", "Ankle or foot", "टखना या पैर"],
                                ["neurological-movement", "Balance, walking, or movement", "संतुलन, चलना या गतिविधि"],
                                ["multiple-areas", "More than one area", "एक से अधिक क्षेत्र"],
                                ["other", "Other", "अन्य"],
                              ].map(([value, englishLabel, hindiLabel]) => ({
                                value,
                                label: isHindi ? hindiLabel : englishLabel,
                              }))}
                              className="bg-background/50 h-12"
                              data-testid="select-affected-area"
                            />
                          </FormControl>
                          {!isHindi && <FormDescription>Choose the area related to your concern.</FormDescription>}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="painLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {t("Pain level, if relevant", "दर्द का स्तर, यदि लागू हो")}
                            </FormLabel>
                          <FormControl>
                            <AccessibleSelect
                              value={field.value === undefined ? "none" : String(field.value)}
                              onChange={(event) => field.onChange(event.target.value === "none" ? undefined : Number(event.target.value))}
                              name={field.name}
                              onBlur={field.onBlur}
                              ref={field.ref}
                              placeholder={t("Select 0–10", "0–10 में से चुनें")}
                              options={[
                                { value: "none", label: t("No pain / not relevant", "दर्द नहीं / लागू नहीं") },
                                ...Array.from({ length: 11 }, (_, level) => ({ value: String(level), label: `${level} / 10` })),
                              ]}
                              className="bg-background/50 h-12"
                              data-testid="select-pain-level"
                            />
                          </FormControl>
                            <FormDescription>
                              {t(
                                "0 means no pain; 10 means the worst pain you can imagine.",
                                "0 का अर्थ दर्द नहीं और 10 का अर्थ आपकी कल्पना में सबसे ज़्यादा दर्द है।",
                              )}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="problemDuration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {t("When did the problem begin?", "समस्या कब शुरू हुई?")}
                            </FormLabel>
                          <FormControl>
                            <AccessibleSelect
                              {...field}
                              value={field.value ?? ""}
                              placeholder={t("Select timing", "समय चुनें")}
                              options={[
                                { value: "today", label: t("Today", "आज") },
                                { value: "under-2-weeks", label: t("Within the last 2 weeks", "पिछले 2 सप्ताह में") },
                                { value: "2-to-6-weeks", label: t("2–6 weeks ago", "2–6 सप्ताह पहले") },
                                { value: "over-6-weeks", label: t("More than 6 weeks ago", "6 सप्ताह से अधिक पहले") },
                                { value: "ongoing", label: t("Ongoing or unsure", "जारी है या निश्चित नहीं") },
                              ]}
                              className="bg-background/50 h-12"
                              data-testid="select-problem-duration"
                            />
                          </FormControl>
                          {!isHindi && <FormDescription>Choose how long the problem has been present.</FormDescription>}
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="recoveryGoal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-foreground">
                              {t("What would you like to achieve?", "आप क्या हासिल करना चाहते हैं?")}
                            </FormLabel>
                            <FormControl>
                             <Input placeholder={t("For example: walk more independently", "उदाहरण: अधिक स्वतंत्रता से चलना")} enterKeyHint="next" className="bg-background/50 h-12" {...field} data-testid="input-recovery-goal" />
                            </FormControl>
                            <FormDescription>{t("Optional", "वैकल्पिक")}</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">{t("Additional Notes", "अतिरिक्त टिप्पणी")}</FormLabel>
                        <FormControl>
                           <Textarea
                            placeholder={t(
                              "Optional practical context, such as a preferred time to be contacted",
                              "वैकल्पिक व्यावहारिक जानकारी, जैसे संपर्क के लिए पसंदीदा समय",
                            )}
                            className="bg-background/50 min-h-[120px] resize-none"
                             enterKeyHint="done"
                            {...field}
                            data-testid="textarea-notes"
                          />
                        </FormControl>
                        <FormDescription>
                          {t(
                            "Optional. Do not include detailed pregnancy, birth, child, or other health information; a clinician can ask for relevant details privately.",
                            "गर्भावस्था, प्रसव, बच्चे या अन्य स्वास्थ्य-जानकारी का विस्तृत विवरण न दें; क्लिनिशियन ज़रूरी जानकारी आपसे निजी रूप से पूछ सकते हैं।",
                          )}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4 pt-4">
                  <h2 className="font-serif text-2xl font-semibold border-b border-border/50 pb-2">
                    {t("Optional Documents", "वैकल्पिक दस्तावेज़")}
                  </h2>
                    <div className="rounded-2xl border border-border/60 bg-accent/10 p-5">
                      <div className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                        <div className="min-w-0 flex-1">
                          <p id="medical-document-label" className="font-medium text-foreground">
                            {t(
                              "Share a discharge summary or medical history",
                              "डिस्चार्ज सारांश या स्वास्थ्य-इतिहास साझा करें।",
                            )}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {t(
                              "Optional. PDF, JPG, or PNG up to 10 MB. Your file is sent privately to the care team and is not published on this website.",
                              "वैकल्पिक। अधिकतम 10 MB की PDF, JPG या PNG फ़ाइल। फ़ाइल निजी तौर पर देखभाल टीम को भेजी जाती है; इस वेबसाइट पर प्रकाशित नहीं होती।",
                            )}
                          </p>
                          <label
                            htmlFor="medical-document"
                            className="mt-4 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-primary/30 bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
                          >
                            <Upload className="h-4 w-4 text-primary" />
                            {documentFile
                              ? t("Change document", "दस्तावेज़ बदलें")
                              : t("Choose document", "दस्तावेज़ चुनें")}
                          </label>
                          <input
                            id="medical-document"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                             aria-labelledby="medical-document-label"
                            className="sr-only"
                            onChange={(event) => {
                              const file = event.target.files?.[0] ?? null;
                              if (file && !["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
                                setDocumentFile(null);
                                setDocumentError(
                                  isHindi
                                    ? "अमान्य फ़ाइल: कृपया PDF, JPG या PNG फ़ाइल चुनें।"
                                    : "Please choose a PDF, JPG, or PNG file.",
                                );
                                event.target.value = "";
                                return;
                              }
                              if (file && file.size > 10 * 1024 * 1024) {
                                setDocumentFile(null);
                                setDocumentError(
                                  isHindi
                                    ? "फ़ाइल बहुत बड़ी है: दस्तावेज़ 10 MB या उससे छोटी होनी चाहिए।"
                                    : "The document must be 10 MB or smaller.",
                                );
                                event.target.value = "";
                                return;
                              }
                              setDocumentError(null);
                              setDocumentFile(file);
                            }}
                            data-testid="input-medical-document"
                          />
                          {documentFile && (
                            <p className="mt-3 text-sm font-medium text-foreground break-all">{documentFile.name}</p>
                          )}
                          {documentError && <p className="mt-2 text-sm text-destructive" data-testid="text-document-error">{documentError}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {submitError && (
                  <p className="text-destructive text-sm text-center" data-testid="text-submit-error">
                    {submitError}
                  </p>
                )}

                <FormField
                  control={form.control}
                  name="priceAccepted"
                  render={({ field }) => (
                    <FormItem className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                      <div className="flex items-start gap-3">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(event) => field.onChange(event.target.checked)}
                            onBlur={field.onBlur}
                            ref={field.ref}
                            className="mt-1 h-4 w-4"
                            data-testid="checkbox-price-acceptance"
                          />
                        </FormControl>
                        <div>
                          <FormLabel className="cursor-pointer text-foreground">
                            {isHindi
                              ? `मैं दिखाए गए ${sessionMode === "home" ? "घर-मुलाक़ात शुल्क" : "ऑनलाइन परामर्श शुल्क"} को देख और स्वीकार कर रहा/रही हूँ: `
                              : `I acknowledge the displayed ${sessionMode === "home" ? "home-visit range" : "online consultation price"}: `}
                            <strong>
                              {sessionMode === "home" ? pricing.homeVisit.amount : pricing.telehealth.displayAmount}
                            </strong>
                          </FormLabel>
                          <FormDescription>
                            {t(
                              "This acknowledgement records the price shown for your request. It is not a payment or UPI authorization.",
                              "यह स्वीकृति आपके अनुरोध में दिखाई गई कीमत दर्ज करती है। यह भुगतान या UPI से भुगतान की अनुमति नहीं है।",
                            )}
                          </FormDescription>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-6">
                  <Button
                    type="submit"
                    size="lg"
                    variant="booking"
                    className="w-full h-14 rounded-full text-lg shadow-lg"
                    disabled={isLoadingAntiSpamToken || createBooking.isPending || isUploadingDocument}
                    data-testid="button-submit-booking"
                  >
                    {isLoadingAntiSpamToken
                      ? t("Preparing secure form...", "सुरक्षित फ़ॉर्म तैयार किया जा रहा है…")
                      : createBooking.isPending
                      ? t("Submitting booking...", "बुकिंग अनुरोध भेजा जा रहा है…")
                      : isUploadingDocument
                        ? t("Sending document...", "दस्तावेज़ भेजा जा रहा है…")
                        : t("Confirm Booking", "बुकिंग अनुरोध भेजें")}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-4">
                    {isHindi
                      ? `हमारी टीम ${confirmationWindowText} आपसे संपर्क करेगी, सही अपॉइंटमेंट समय की पुष्टि करेगी और UPI भुगतान लिंक भेजेगी।`
                      : `Our team will contact you ${confirmationWindowText} to confirm your exact appointment time and send a UPI payment link.`}
                  </p>
                </div>

              </form>
            </Form>
          </motion.div>
        </div>
      </div>
    </div>
    </>
  );
}
