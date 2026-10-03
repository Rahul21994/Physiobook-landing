const HINDI_APPOINTMENT_LABELS: Record<string, string> = {
  "General Consultation": "सामान्य परामर्श",
  "Clinical Assessment & Evaluation": "क्लिनिकल आकलन और मूल्यांकन",
  "Homecare Physiotherapy Session": "घर पर फिजियोथेरेपी सत्र",
  "Cardiopulmonary Rehabilitation": "हृदय-फेफड़ों से जुड़ा पुनर्वास",
  "Advanced Complex Case Recovery": "जटिल मामले में उन्नत रिकवरी",
  "Sports Enhancement Consultation": "खेल प्रदर्शन परामर्श",
  "Nutritional Consultation": "पोषण परामर्श",
  "Rehabilitation Program": "पुनर्वास कार्यक्रम",
  "Antenatal/postpartum physiotherapy": "गर्भावस्था से पहले/बाद की फिजियोथेरेपी",
  "Pregnancy/postpartum nutrition support": "गर्भावस्था से पहले/बाद के पोषण में सहायता",
  "Pregnancy/postpartum exercise support": "गर्भावस्था से पहले/बाद के व्यायाम में सहायता",
  "Infant/pediatric physiotherapy enquiry": "शिशु/बच्चे की फिजियोथेरेपी पूछताछ",
  "Pediatric disability rehabilitation": "बच्चों की दिव्यांगता से जुड़ा पुनर्वास",
  "Telehealth — Initial Assessment": "टेलीहेल्थ — प्रारंभिक आकलन",
  "Telehealth — Follow-up Consultation": "टेलीहेल्थ — अनुवर्ती परामर्श",
  "Telehealth — Exercise Programme Review": "टेलीहेल्थ — व्यायाम कार्यक्रम की समीक्षा",
  "Telehealth — Post-Surgery Guidance": "टेलीहेल्थ — सर्जरी के बाद मार्गदर्शन",
  "Telehealth — Second Opinion / Case Review": "टेलीहेल्थ — दूसरी राय / केस समीक्षा",
};

export function getHindiAppointmentLabel(value: string): string {
  const label = HINDI_APPOINTMENT_LABELS[value];
  if (!label) {
    throw new Error(`No approved Hindi booking label exists for appointment type: ${value}`);
  }
  return label;
}