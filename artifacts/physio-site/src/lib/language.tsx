import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation, useSearch } from "wouter";
import { trackEvent } from "@/lib/analytics";
import { pricing } from "@/lib/pricing";

export type Language = "en" | "hi";

const phraseTranslations: Record<string, string> = {
  Home: "मुखपृष्ठ",
  Cities: "सेवा-क्षेत्र",
  "Patient Reviews": "मरीज़ों के अनुभव",
  Journal: "स्वास्थ्य-जर्नल",
  Contact: "संपर्क करें",
  "Book an Appointment": "अपॉइंटमेंट बुक करें",
  "Open navigation menu": "नेविगेशन मेन्यू खोलें",
  "Chat with us": "हमसे बात करें",
  "Quick Links": "त्वरित लिंक",
  "Cities We Serve": "हमारे सेवा-क्षेत्र",
  "Our Services": "हमारी सेवाएँ",
  "Physiotherapy Sessions": "फिजियोथेरेपी सत्र",
  "Sports Enhancement": "खेल प्रदर्शन सुधार",
  "Functional Training": "कार्यात्मक प्रशिक्षण",
  "Nutritional Consultation": "पोषण परामर्श",
  "Rehabilitation Programs": "पुनर्वास कार्यक्रम",
  "One place for complete recovery and wellness.": "सम्पूर्ण स्वास्थ्य और पुनर्वास के लिए एक विश्वसनीय स्थान।",
  Nutrition: "पोषण",
  "Physiotherapy • Nutrition • Exercise Physiology": "फिजियोथेरेपी • पोषण • व्यायाम फिजियोलॉजी",
  "Homecare Physiotherapy": "घर पर फिजियोथेरेपी",
  "Homecare Physiotherapy in 45 Listed Cities.": "45 सूचीबद्ध शहरों में घर पर फिजियोथेरेपी।",
  "Physiotherapist at Home · 45 Cities Across India": "घर पर फिजियोथेरेपी · भारत के 45 शहर",
  Homecare: "घर पर",
  Physiotherapy: "फिजियोथेरेपी",
  "Across India.": "पूरे भारत में।",
  "Exercise Physiology": "व्यायाम फिजियोलॉजी",
  "Goswami Rehab brings certified homecare physiotherapy across India — Rajasthan, Delhi NCR, Punjab, Karnataka, Maharashtra, Kerala, Assam, Uttarakhand, Jammu & more. 35+ specialist physios. Stroke rehabilitation, cardiopulmonary rehabilitation, post-surgery rehabilitation, neurological rehabilitation & complex case recovery.": "Goswami Rehab 45 सूचीबद्ध शहरों में प्रमाणित घर पर फिजियोथेरेपी उपलब्ध कराता है। सटीक स्थान और चिकित्सक की उपलब्धता की पुष्टि के बाद विज़िट तय होती है। हमारी 35+ विशेषज्ञ टीम स्ट्रोक पुनर्वास, कार्डियोपल्मोनरी पुनर्वास, सर्जरी के बाद के पुनर्वास और जटिल मामलों में रिकवरी के लिए सहायता प्रदान करती है।",
  "Learn More": "अधिक जानकारी लें",
  "Read Article": "लेख पढ़ें",
  "Get Started": "शुरुआत करें",
  "View All Services": "सभी सेवाएँ देखें",
  "View All Cities": "सभी शहर देखें",
  "Share Your Feedback": "अपनी प्रतिक्रिया साझा करें",
  "Submit Feedback": "प्रतिक्रिया भेजें",
  "Booking Request Received": "बुकिंग अनुरोध प्राप्त हुआ",
  "Book Another Appointment": "एक और अपॉइंटमेंट बुक करें",
  "Confirm Booking": "बुकिंग की पुष्टि करें",
  Submitting: "भेजा जा रहा है",
  "Home Visit": "घर पर फिजियोथेरेपी",
  "Online Consultation": "ऑनलाइन परामर्श",
  "Home Visit or Online": "घर पर सेवा या ऑनलाइन परामर्श",
  "Privacy Policy": "गोपनीयता नीति",
  "Terms & Conditions": "नियम और शर्तें",
  "Patient Safety": "मरीज़ों की सुरक्षा",
  "Share Your Experience": "अपना अनुभव साझा करें",
  "Your name": "आपका नाम",
  City: "शहर",
  State: "राज्य",
  Email: "ईमेल",
  Phone: "फ़ोन",
  Message: "संदेश",
  Address: "पता",
  "Select a city": "शहर चुनें",
  "Select a state": "राज्य चुनें",
  "Choose a service": "सेवा चुनें",
  Required: "आवश्यक",
  Optional: "वैकल्पिक",
  "No results found": "कोई परिणाम नहीं मिला",
  "Not found": "नहीं मिला",
  "Page not found": "पृष्ठ नहीं मिला",
  "Go back home": "मुखपृष्ठ पर वापस जाएँ",
  "4.9/5 Average Rating": "औसत रेटिंग 4.9/5",
  "35+ Specialist Physios": "35+ विशेषज्ञ फिजियोथेरेपिस्ट",
  "45 Cities · India-wide network": "45 शहर · भारत-व्यापी नेटवर्क",
  "Compassionate Care": "संवेदनशील देखभाल",
  "Homecare Physiotherapy Services": "घर पर फिजियोथेरेपी सेवाएँ",
  "Expert homecare physiotherapy and rehabilitation, tailored to your condition and delivered to your doorstep.": "आपकी स्थिति के अनुरूप विशेषज्ञ फिजियोथेरेपी और पुनर्वास सेवाएँ, आपके घर तक।",
  "Expert one-on-one physiotherapy at your home for pain relief, injury recovery, and restoring full movement. Available across India.": "दर्द में राहत, चोट के बाद रिकवरी और सहज गतिशीलता के लिए 45 सूचीबद्ध शहरों में आपके घर पर व्यक्तिगत फिजियोथेरेपी। विज़िट से पहले सटीक स्थान और चिकित्सक की उपलब्धता की पुष्टि की जाती है।",
  "Specialised breathing, cardiac, and pulmonary rehabilitation for COPD, post-bypass recovery, heart failure, and respiratory conditions — delivered at home.": "सीओपीडी, बायपास सर्जरी के बाद रिकवरी, हृदय-विफलता और श्वसन संबंधी स्थितियों के लिए विशेष श्वसन, हृदय और फेफड़ों का पुनर्वास—घर पर उपलब्ध।",
  "Cardiopulmonary Rehabilitation": "कार्डियोपल्मोनरी पुनर्वास",
  "Comprehensive rehabilitation for complex neurological, multi-system, and post-ICU cases. Expert physiotherapy support for stroke rehabilitation, brain injury rehabilitation, Guillain-Barré rehabilitation, and spinal rehabilitation.": "जटिल न्यूरोलॉजिकल, मल्टी-सिस्टम और आईसीयू के बाद के मामलों के लिए व्यापक पुनर्वास। स्ट्रोक, मस्तिष्क की चोट, गिलेन-बैरे सिंड्रोम और रीढ़ संबंधी पुनर्वास के लिए विशेषज्ञ फिजियोथेरेपी सहायता।",
  "Advanced Complex Case Recovery": "जटिल मामलों में उन्नत रिकवरी",
  "Standardised physiotherapy assessments including functional movement screening, neurological evaluation, musculoskeletal grading, and outcome tracking.": "कार्यात्मक गतिशीलता की जाँच, न्यूरोलॉजिकल मूल्यांकन, मस्कुलोस्केलेटल ग्रेडिंग और प्रगति की निगरानी सहित मानकीकृत फिजियोथेरेपी मूल्यांकन।",
  "Clinical Assessment & Evaluation": "क्लिनिकल मूल्यांकन और परीक्षण",
  "Optimise your athletic performance through biomechanical analysis, movement screening, and sport-specific conditioning programs.": "बायोमैकेनिकल विश्लेषण, गतिशीलता की जाँच और खेल-विशिष्ट कंडीशनिंग कार्यक्रमों के माध्यम से अपने खेल प्रदर्शन को बेहतर बनाएँ।",
  "Sports Enhancement Consultation": "खेल प्रदर्शन सुधार परामर्श",
  "Build strength and movement patterns that carry over to everyday life and sport. Train the way your body is designed to move.": "ऐसी शक्ति और गतिशीलता विकसित करें जो रोज़मर्रा के जीवन और खेल में उपयोगी हो। अपने शरीर की प्राकृतिक गति के अनुसार प्रशिक्षण लें।",
  "Fuel your recovery and performance with personalised nutrition guidance aligned with your rehabilitation and training goals.": "अपने पुनर्वास और प्रशिक्षण लक्ष्यों के अनुरूप व्यक्तिगत पोषण मार्गदर्शन से रिकवरी और प्रदर्शन को बेहतर समर्थन दें।",
  "Not sure where to start? A comprehensive initial assessment to understand your condition and map out the right path forward.": "शुरुआत कहाँ से करें, यह स्पष्ट नहीं है? व्यापक प्रारंभिक मूल्यांकन से आपकी स्थिति को समझकर आगे की सही दिशा तय करें।",
  "General Consultation": "सामान्य परामर्श",
  "Structured, progressive physiotherapy rehabilitation programmes for post-surgery and injury recovery — designed around safe mobility, strength, and everyday function.": "सर्जरी या चोट के बाद रिकवरी के लिए सुरक्षित गतिशीलता, शक्ति और रोज़मर्रा की कार्यक्षमता पर आधारित क्रमिक फिजियोथेरेपी पुनर्वास कार्यक्रम।",
  "Expert care delivered to your home.": "विशेषज्ञ देखभाल आपके घर तक।",
  "Goswami Rehab is built on one belief: that real recovery should happen where you are most comfortable — at home. With 35+ specialist physiotherapists across 15 Indian states, we bring professional physiotherapy, cardiopulmonary rehabilitation, complex case rehabilitation, and nutrition guidance directly to your doorstep.": "Goswami Rehab का मानना है कि वास्तविक रिकवरी वहीं होनी चाहिए जहाँ आप सबसे सहज महसूस करें—अपने घर पर। भारत के 15 राज्यों में 35+ विशेषज्ञ फिजियोथेरेपिस्टों के साथ, हम पेशेवर फिजियोथेरेपी, कार्डियोपल्मोनरी पुनर्वास, जटिल मामलों का पुनर्वास और पोषण संबंधी मार्गदर्शन सीधे आपके घर तक पहुँचाते हैं।",
  "35+ specialist physios across Rajasthan, Delhi, Punjab, Karnataka, Maharashtra, Kerala, Assam, Uttarakhand & Jammu": "राजस्थान, दिल्ली, पंजाब, कर्नाटक, महाराष्ट्र, केरल, असम, उत्तराखंड और जम्मू में 35+ विशेषज्ञ फिजियोथेरेपिस्ट",
  "Expert rehabilitation physiotherapy for stroke rehabilitation, Parkinson's physiotherapy, post-surgery rehabilitation, cardiopulmonary rehabilitation & complex cases": "स्ट्रोक पुनर्वास, पार्किंसन फिजियोथेरेपी, सर्जरी के बाद पुनर्वास, कार्डियोपल्मोनरी पुनर्वास और जटिल मामलों के लिए विशेषज्ञ पुनर्वास फिजियोथेरेपी",
  "Standardised clinical assessment protocols with evidence-based, personalised rehabilitation pathways": "साक्ष्य-आधारित और व्यक्तिगत पुनर्वास मार्गों के साथ मानकीकृत क्लिनिकल मूल्यांकन प्रोटोकॉल",
  "Dedicated physiotherapists in your city — no long wait, no travel hassle": "आपके शहर में समर्पित फिजियोथेरेपिस्ट—लंबे इंतज़ार और यात्रा की परेशानी के बिना",
  "Start Your Journey": "अपनी रिकवरी की शुरुआत करें",
  "Take the first step towards recovery. Book a homecare physiotherapy session anywhere in India — our team will confirm your appointment within 24 hours. Introductory service pricing is currently available while we expand home-visit coverage.": "रिकवरी की दिशा में पहला कदम उठाएँ। 45 सूचीबद्ध शहरों में घर पर फिजियोथेरेपी सत्र बुक करें—सटीक स्थान साझा करें और टीम विज़िट से पहले चिकित्सक की उपलब्धता की पुष्टि करेगी। प्रारंभिक शुल्क उपलब्ध है।",
  "Transparent Pricing": "पारदर्शी शुल्क",
  "Simple, Honest Fees": "सरल और स्पष्ट शुल्क",
  "All sessions are conducted by certified specialists at your home. Pricing varies based on your needs, location, and rehabilitation plan.": "सभी सत्र प्रमाणित विशेषज्ञ आपके घर पर प्रदान करते हैं। शुल्क आपकी आवश्यकताओं, स्थान और पुनर्वास योजना के अनुसार अलग-अलग हो सकता है।",
  "Introductory service pricing": "प्रारंभिक सेवा शुल्क",
  "55% off while we expand home-visit coverage": "घर पर सेवाओं का विस्तार होने तक 55% की छूट",
  "We are keeping introductory rates available while we expand coordinated home visits and gather early patient feedback. There is no artificial booking limit.": "घर पर समन्वित सेवाओं का विस्तार और शुरुआती मरीज़ों की प्रतिक्रिया एकत्र करने के दौरान प्रारंभिक शुल्क उपलब्ध रहेगा। बुकिंग पर कोई कृत्रिम सीमा नहीं है।",
  "Home Visit — 45 Listed Cities": "घर पर सेवा — 45 सूचीबद्ध शहर",
  "Rajasthan, Delhi, Punjab, Karnataka, Maharashtra, Kerala & more": "राजस्थान, दिल्ली, पंजाब, कर्नाटक, महाराष्ट्र, केरल और अन्य क्षेत्र",
  "Available worldwide · WhatsApp / Google Meet / Zoom": "दुनियाभर में उपलब्ध · WhatsApp / Google Meet / Zoom",
  "introductory service price": "प्रारंभिक सेवा शुल्क",
  [`Regular: ${pricing.homeVisit.regularAmount}`]: `नियमित शुल्क: ${pricing.homeVisit.regularAmount}`,
  [`Regular: ${pricing.homeVisit.regularAmount} per session`]: `नियमित शुल्क: ${pricing.homeVisit.regularAmount} प्रति सत्र`,
  [`Regular: ${pricing.telehealth.regularDisplayAmount}`]: `नियमित शुल्क: ${pricing.telehealth.regularDisplayAmount}`,
  [`Regular: ${pricing.telehealth.regularDisplayAmount} per session`]: `नियमित शुल्क: ${pricing.telehealth.regularDisplayAmount} प्रति सत्र`,
  "Regular:": "नियमित शुल्क:",
  [`${pricing.homeVisit.regularAmount} per session`]: `${pricing.homeVisit.regularAmount} प्रति सत्र`,
  [`${pricing.telehealth.regularDisplayAmount} per session`]: `${pricing.telehealth.regularDisplayAmount} प्रति सत्र`,
  "Pay After Your Session": "सत्र के बाद भुगतान करें",
  "Scan & Pay — any UPI app": "स्कैन करें और भुगतान करें — किसी भी UPI ऐप से",
  "Scan the QR or type the UPI ID directly. Payment is collected after your first session — not upfront.": "QR कोड स्कैन करें या UPI ID सीधे दर्ज करें। भुगतान पहले सत्र के बाद लिया जाएगा—पहले से नहीं।",
  "Thank you,": "धन्यवाद,",
  ". Our team will contact you within 24 hours to confirm your appointment time. A summary has been sent to": "। अपॉइंटमेंट का समय पक्का करने के लिए हमारी टीम 24 घंटे के भीतर आपसे संपर्क करेगी। इसका सारांश भेज दिया गया है:",
  "Bank Transfer": "बैंक ट्रांसफ़र",
  Cards: "कार्ड",
  "WhatsApp Pay": "WhatsApp Pay",
  "Details on confirmation": "पुष्टि के बाद विवरण साझा किए जाएँगे",
  "Not sure which plan is right for you? Book a free 15-minute consultation and we'll recommend the right rehabilitation path.": "आपके लिए सही विकल्प को लेकर असमंजस है? 15 मिनट का निःशुल्क परामर्श बुक करें। हम आपकी स्थिति के अनुसार उपयुक्त पुनर्वास योजना सुझाएँगे।",
  "Online Consultations": "ऑनलाइन परामर्श",
  "Expert Physio. Any Country. Any Device.": "विशेषज्ञ फिजियोथेरेपी। किसी भी देश में, किसी भी डिवाइस पर।",
  "Can't get a home visit? Our online physiotherapy consultation brings professional assessment, exercise prescription, and rehabilitation guidance directly to your screen — wherever you are in the world.": "घर पर सत्र संभव नहीं है? हमारा ऑनलाइन फिजियोथेरेपी परामर्श पेशेवर मूल्यांकन, व्यायाम योजना और पुनर्वास मार्गदर्शन सीधे आपकी स्क्रीन तक पहुँचाता है—आप दुनिया में कहीं भी हों।",
  "Available worldwide — no geographical restrictions": "दुनियाभर में उपलब्ध — भौगोलिक सीमा के बिना",
  "Video call via WhatsApp, Google Meet, or Zoom": "WhatsApp, Google Meet या Zoom के माध्यम से वीडियो कॉल",
  "Movement assessment, exercise prescription & rehabilitation planning": "गतिशीलता का मूल्यांकन, व्यायाम योजना और पुनर्वास की योजना",
  "Same certified physiotherapists, remote format": "वही प्रमाणित फिजियोथेरेपिस्ट, अब ऑनलाइन माध्यम में",
  "Flexible scheduling across all time zones": "सभी समय क्षेत्रों के अनुसार सुविधाजनक समय",
  "Book Online Consultation": "ऑनलाइन परामर्श बुक करें",
  "Initial Assessment · Worldwide": "प्रारंभिक मूल्यांकन · दुनियाभर में",
  "per consultation · available to everyone globally": "प्रति परामर्श · दुनियाभर के लोगों के लिए उपलब्ध",
  "30–45 min video session": "30–45 मिनट का वीडियो सत्र",
  "Movement & posture assessment": "गतिशीलता और मुद्रा का मूल्यांकन",
  "Personalised exercise prescription": "व्यक्तिगत व्यायाम योजना",
  "Condition-specific rehabilitation plan": "आपकी स्थिति के अनुरूप पुनर्वास योजना",
  "WhatsApp follow-up support": "WhatsApp पर आगे की सहायता",
  [`Book now — ${pricing.telehealth.displayAmount}`]: `अभी बुक करें — ${pricing.telehealth.displayAmount}`,
  "Thank you!": "धन्यवाद!",
  "Appointment Summary": "अपॉइंटमेंट का विवरण",
  Reference: "संदर्भ",
  Name: "नाम",
  "Session Type": "सत्र का प्रकार",
  Appointment: "अपॉइंटमेंट",
  "Preferred Date": "पसंदीदा तारीख",
  "Session Fee": "सत्र शुल्क",
  "Pay in Advance via UPI": "UPI के माध्यम से अग्रिम भुगतान",
  "Tap on mobile to open UPI app": "मोबाइल पर टैप करके UPI ऐप खोलें",
  "Pay to": "भुगतान प्राप्तकर्ता",
  "UPI ID": "UPI ID",
  Amount: "राशि",
  "We also accept bank transfer (NEFT/IMPS/RTGS) and WhatsApp Pay. Details will be shared when our team contacts you.": "हम बैंक ट्रांसफ़र (NEFT/IMPS/RTGS) और WhatsApp Pay भी स्वीकार करते हैं। हमारी टीम आपसे संपर्क करते समय विवरण साझा करेगी।",
  "Personal Details": "व्यक्तिगत विवरण",
  "Appointment Details": "अपॉइंटमेंट का विवरण",
  "Physiotherapy Assessment": "फिजियोथेरेपी मूल्यांकन",
  "What is the main problem or reason for treatment?": "उपचार का मुख्य कारण या समस्या क्या है?",
  "Please briefly describe the main problem": "कृपया मुख्य समस्या का संक्षेप में वर्णन करें",
  "Please avoid sharing information unrelated to this appointment.": "कृपया इस अपॉइंटमेंट से असंबंधित जानकारी साझा न करें।",
  "Which area is affected?": "कौन-सा अंग या क्षेत्र प्रभावित है?",
  "Select an area": "क्षेत्र चुनें",
  "Back or neck": "पीठ या गर्दन",
  "Shoulder or arm": "कंधा या बाँह",
  "Hip or knee": "कूल्हा या घुटना",
  "Ankle or foot": "टखना या पैर",
  "Balance, walking, or movement": "संतुलन, चलना या गतिशीलता",
  "More than one area": "एक से अधिक क्षेत्र",
  Other: "अन्य",
  "Pain level, if relevant": "दर्द का स्तर, यदि लागू हो",
  "Select 0–10": "0–10 चुनें",
  "No pain / not relevant": "दर्द नहीं है / लागू नहीं",
  "0 means no pain; 10 means the worst pain you can imagine.": "0 का अर्थ दर्द नहीं; 10 का अर्थ आपकी कल्पना के अनुसार सबसे अधिक दर्द है।",
  "When did the problem begin?": "समस्या कब शुरू हुई?",
  "Select timing": "समय चुनें",
  Today: "आज",
  "Within the last 2 weeks": "पिछले 2 सप्ताह में",
  "2–6 weeks ago": "2–6 सप्ताह पहले",
  "More than 6 weeks ago": "6 सप्ताह से अधिक पहले",
  "Ongoing or unsure": "जारी है या निश्चित नहीं",
  "What would you like to achieve?": "आप क्या सुधार प्राप्त करना चाहते हैं?",
  "Share a discharge summary or medical history": "डिस्चार्ज सारांश या चिकित्सीय इतिहास साझा करें",
  "Choose document": "दस्तावेज़ चुनें",
  "Change document": "दस्तावेज़ बदलें",
  "Reason for Visit / Notes": "मुलाक़ात का कारण / अतिरिक्त जानकारी",
  "First Name": "पहला नाम",
  "Last Name": "उपनाम",
  "Email Address": "ईमेल पता",
  "Phone Number": "फ़ोन नंबर",
  "Type of Appointment": "अपॉइंटमेंट का प्रकार",
  "City / Location": "शहर / स्थान",
  "Select your city": "अपना शहर चुनें",
  "Select appointment type": "अपॉइंटमेंट का प्रकार चुनें",
  "Preferred appointment date": "अपॉइंटमेंट की पसंदीदा तारीख",
  Notes: "अतिरिक्त जानकारी",
  "Any additional information you'd like to share...": "कोई अतिरिक्त जानकारी साझा करना चाहते हैं...",
  "Submit Booking Request": "बुकिंग अनुरोध भेजें",
  "Your review goes live only after we confirm it by email.": "आपकी समीक्षा की पुष्टि ईमेल से करने के बाद ही प्रकाशित की जाएगी।",
  "Your review has been received. It will appear here once we've reviewed it — usually within 24 hours.": "आपकी समीक्षा प्राप्त हो गई है। जाँच पूरी होने के बाद, सामान्यतः 24 घंटे के भीतर, यह यहाँ दिखाई देगी।",
  "Submit Review": "समीक्षा भेजें",
  "Your review": "आपकी समीक्षा",
  "Tell us about your experience with our physiotherapist…": "हमारे फिजियोथेरेपिस्ट के साथ अपने अनुभव के बारे में बताएँ…",
  "What Our Patients Say": "हमारे मरीज़ों के अनुभव",
  "Every review is read by us before it goes live — no bots, no fake testimonials.": "हर समीक्षा प्रकाशित होने से पहले हमारी टीम पढ़ती है—न बॉट, न नकली प्रशंसापत्र।",
  "Hemant Choudhary’s Recovery After a Major Road Accident": "हेमंत चौधरी की गंभीर सड़क दुर्घटना के बाद रिकवरी",
  "Hemant Choudhary": "हेमंत चौधरी",
  "Road Traffic Accident — Post-Surgery Rehabilitation": "सड़क दुर्घटना — सर्जरी के बाद पुनर्वास",
  "Category Not Found": "श्रेणी नहीं मिली",
  "This category doesn't exist or has been renamed.": "यह श्रेणी मौजूद नहीं है या इसका नाम बदल दिया गया है।",
  "Back to Journal": "जर्नल पर वापस जाएँ",
  Category: "श्रेणी",
  "Other Categories": "अन्य श्रेणियाँ",
};

function translateText(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return value;

  const normalized = trimmed.replace(/\s+/g, " ");
  const exact = phraseTranslations[trimmed] ?? phraseTranslations[normalized];
  if (exact) {
    const leading = value.match(/^\s*/)?.[0] ?? "";
    const trailing = value.match(/\s*$/)?.[0] ?? "";
    return `${leading}${exact}${trailing}`;
  }
  return value;
}

type OriginalTextStore = WeakMap<Text, string>;
type OriginalAttributeStore = WeakMap<Element, Map<string, string>>;

function translateDocument(
  language: Language,
  originalText: OriginalTextStore,
  originalAttributes: OriginalAttributeStore,
) {
  if (typeof document === "undefined") return;

  document.documentElement.lang = language === "hi" ? "hi" : "en";
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;

  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent || parent.closest("script, style, noscript, [data-no-translate]")) continue;
    textNodes.push(node as Text);
  }

  for (const textNode of textNodes) {
    const current = textNode.nodeValue ?? "";
    const previous = originalText.get(textNode);
    if (!previous || (language === "hi" && current !== translateText(previous))) {
      originalText.set(textNode, current);
    }
    const source = originalText.get(textNode) ?? current;
    textNode.nodeValue = language === "hi" ? translateText(source) : source;
  }

  const elements = document.querySelectorAll<HTMLElement>(
    "input, textarea, select, button, [aria-label], [title], [placeholder]",
  );
  for (const element of elements) {
    if (element.closest("[data-no-translate]")) continue;
    const attributes = ["placeholder", "aria-label", "title"];
    for (const attribute of attributes) {
      const value = element.getAttribute(attribute);
      if (value === null) continue;
      let source = originalAttributes.get(element)?.get(attribute);
      if (!source || (language === "hi" && value !== translateText(source))) {
        source = value;
        const stored = originalAttributes.get(element) ?? new Map<string, string>();
        stored.set(attribute, source);
        originalAttributes.set(element, stored);
      }
      element.setAttribute(attribute, language === "hi" ? translateText(source) : source);
    }
  }
}

export function getExistingHindiTranslation(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return phraseTranslations[trimmed] ?? phraseTranslations[trimmed.replace(/\s+/g, " ")] ?? null;
}

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({
  children,
  initialLanguage = "en",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const originalText = useMemo<OriginalTextStore>(() => new WeakMap(), []);
  const originalAttributes = useMemo<OriginalAttributeStore>(() => new WeakMap(), []);
  const hasTranslatedDocument = useRef(false);

  const setLanguage = useCallback((nextLanguage: Language) => {
    setLanguageState(nextLanguage);
  }, []);

  useEffect(() => {
    if (language === "en") {
      document.documentElement.lang = "en";
      // The SSR shell is already English. Avoid walking and rewriting the
      // entire document during the first hydration pass. Restore the original
      // strings only when the user has previously switched to Hindi.
      if (hasTranslatedDocument.current) {
        translateDocument("en", originalText, originalAttributes);
        hasTranslatedDocument.current = false;
      }
      return;
    }

    translateDocument("hi", originalText, originalAttributes);
    hasTranslatedDocument.current = true;
    let frame = 0;
    const scheduleTranslation = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        translateDocument("hi", originalText, originalAttributes);
      });
    };
    const observer = new MutationObserver(() => {
      scheduleTranslation();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    return () => {
      observer.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [language, originalAttributes, originalText]);

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

export function LanguageToggle({ mobile = false }: { mobile?: boolean }) {
  const { language } = useLanguage();
  const [location] = useLocation();
  const search = useSearch();
  const trackLanguageLink = (nextLanguage: Language) => {
    trackEvent("language_switch", {
      route: typeof window === "undefined" ? "/" : window.location.pathname,
      language: nextLanguage,
    });
  };
  const targetPath = (nextLanguage: Language) => {
    const pathname = location.split(/[?#]/, 1)[0].replace(/\/+$/, "") || "/";
    const searchSuffix = search ? (search.startsWith("?") ? search : `?${search}`) : "";

    if (nextLanguage === "hi") {
      if (pathname === "/hi" || pathname.startsWith("/hi/")) {
        return `${pathname}${searchSuffix}`;
      }
      if (["/booking", "/online-care", "/contact", "/about"].includes(pathname)) {
        return `/hi${pathname}${searchSuffix}`;
      }
      const city = pathname.match(/^\/physiotherapist-at-home\/([a-z0-9-]+)$/);
      if (city) return `/hi/physiotherapist-at-home/${city[1]}${searchSuffix}`;
      return `/hi${searchSuffix}`;
    }

    if (pathname === "/hi") return `/${searchSuffix}`;
    if (pathname.startsWith("/hi/")) {
      const localizedPath = pathname.slice(3) || "/";
      if (
        ["/booking", "/online-care", "/contact", "/about"].includes(localizedPath) ||
        /^\/physiotherapist-at-home\/[a-z0-9-]+$/.test(localizedPath)
      ) {
        return `${localizedPath}${searchSuffix}`;
      }
      return `/${searchSuffix}`;
    }
    return `${pathname}${searchSuffix}`;
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border border-border bg-background/80 p-0.5 text-xs font-medium shadow-sm ${
        mobile ? "w-full justify-center" : ""
      }`}
      role="group"
      aria-label="Choose language"
      data-language-control
      data-no-translate
    >
      <a
        href={targetPath("en")}
        onClick={() => trackLanguageLink("en")}
        aria-current={language === "en" ? "page" : undefined}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          language === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        English
      </a>
      <a
        href={targetPath("hi")}
        onClick={() => trackLanguageLink("hi")}
        aria-current={language === "hi" ? "page" : undefined}
        className={`rounded-full px-3 py-1.5 transition-colors ${
          language === "hi" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
        }`}
      >
        हिंदी
      </a>
    </div>
  );
}
