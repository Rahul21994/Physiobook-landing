export type AdministrativeType = "state" | "union-territory" | "nct";

export function getAdministrativeAreaLabel(
  name: string,
  type: AdministrativeType = "state",
): string {
  if (type === "union-territory") return `${name} (Union Territory)`;
  if (type === "nct") return `${name} (National Capital Territory)`;
  return name;
}

export interface CityData {
  slug: string;
  name: string;
  state: string;
  administrativeType?: AdministrativeType;
  region: string;
  nearby: string[];
  localities?: Array<{ name: string; description: string }>;
  nearbyCities: string[];
  conditions: string[];
  isHQ?: boolean;
  indexable?: boolean;
  heroHeading?: string;
  seoTitle?: string;
  seoDescription?: string;
  localIntro?: string;
  localFocus?: string;
  careContext?: string;
  localCoverage?: string;
  nearMeFaq?: { q: string; a: string };
  reviewMode?: "city" | "provider-team";
}

const rehabilitationLabels: Record<string, string> = {
  "stroke rehabilitation": "Stroke Rehabilitation",
  "stroke recovery": "Stroke Rehabilitation",
  "stroke rehab": "Stroke Rehabilitation",
  "neuro rehab": "Neurological Rehabilitation",
  "neuro physiotherapy": "Neurological Physiotherapy",
  "neuro rehabilitation": "Neurological Rehabilitation",
  "knee replacement": "Knee Replacement Rehabilitation",
  "knee replacement recovery": "Knee Replacement Rehabilitation",
  "knee replacement rehabilitation": "Knee Replacement Rehabilitation",
  "hip replacement": "Hip Replacement Rehabilitation",
  "hip replacement recovery": "Hip Replacement Rehabilitation",
  "hip replacement rehabilitation": "Hip Replacement Rehabilitation",
  "joint replacement recovery": "Joint Replacement Rehabilitation",
  "joint replacement rehabilitation": "Joint Replacement Rehabilitation",
  "post-surgery recovery": "Post-Surgery Rehabilitation",
  "post-surgery rehab": "Post-Surgery Rehabilitation",
  "post-surgery physiotherapy": "Post-Surgery Rehabilitation",
  "post-surgery rehabilitation": "Post-Surgery Rehabilitation",
  "post-ICU physiotherapy": "Post-ICU Rehabilitation",
  "post-ICU rehabilitation": "Post-ICU Rehabilitation",
  "COPD pulmonary rehab": "COPD & Pulmonary Rehabilitation",
  "COPD pulmonary rehabilitation": "COPD & Pulmonary Rehabilitation",
  "COPD management": "COPD & Pulmonary Rehabilitation",
  "cardiac rehab": "Cardiac Rehabilitation",
  "cardiac rehabilitation": "Cardiac Rehabilitation",
  "cardiopulmonary rehab": "Cardiopulmonary Rehabilitation",
  "cardiopulmonary rehabilitation": "Cardiopulmonary Rehabilitation",
  "ortho rehab": "Orthopaedic Rehabilitation",
  "ortho rehabilitation": "Orthopaedic Rehabilitation",
  "orthopaedic rehabilitation": "Orthopaedic Rehabilitation",
  "geriatric rehab": "Geriatric Rehabilitation",
  "geriatric physio": "Geriatric Physiotherapy",
  "geriatric physiotherapy": "Geriatric Physiotherapy",
  "sports injury": "Sports Injury Physiotherapy",
  "sports injury physiotherapy": "Sports Injury Physiotherapy",
  "spinal cord injury": "Spinal Cord Injury Rehabilitation",
  "spinal cord injury rehabilitation": "Spinal Cord Injury Rehabilitation",
  "brain injury": "Brain Injury Rehabilitation",
  "brain injury rehabilitation": "Brain Injury Rehabilitation",
  "parkinson's disease": "Parkinson's Physiotherapy",
  "parkinson's physiotherapy": "Parkinson's Physiotherapy",
  "gbs rehab": "Guillain-Barré Rehabilitation",
  "gbs rehabilitation": "Guillain-Barré Rehabilitation",
  "guillain-barré rehabilitation": "Guillain-Barré Rehabilitation",
  "spine physiotherapy": "Spinal Physiotherapy",
};

export function rehabilitationLabel(label: string): string {
  return rehabilitationLabels[label.toLowerCase()] ?? label;
}

const authoredCities: CityData[] = [
  {
    slug: "jaipur",
    name: "Jaipur",
    state: "Rajasthan",
    region: "Rajasthan",
    nearby: ["Murlipura", "Vaishali Nagar", "Mansarovar", "Malviya Nagar", "Tonk Road", "C-Scheme"],
    localities: [
      { name: "Murlipura", description: "Home physiotherapy for Jaipur families managing mobility, strength, or recovery at home." },
      { name: "Vaishali Nagar", description: "Convenient home sessions for post-surgery, neurological, and everyday movement goals." },
      { name: "Mansarovar", description: "A practical option when travel to a clinic makes regular rehabilitation harder." },
      { name: "Malviya Nagar", description: "Specialist homecare support shaped around your assessment and daily routine." },
      { name: "Tonk Road", description: "Ask about a home visit for recovery after surgery, injury, or hospital discharge." },
      { name: "C-Scheme", description: "Home physiotherapy that fits around family, work, and ongoing recovery needs." },
    ],
    nearbyCities: ["ajmer", "jodhpur", "udaipur"],
    conditions: ["Stroke Rehabilitation", "Knee Replacement Rehabilitation", "Parkinson's Physiotherapy", "COPD & Pulmonary Rehabilitation", "Post-Surgery Rehabilitation"],
    isHQ: true,
    indexable: true,
    heroHeading: "Recovery Planning with Home Physiotherapy in Jaipur",
    seoTitle: "Home Physiotherapy Recovery Plans in Jaipur | Goswami Rehab",
    seoDescription: "Home physiotherapy in Jaipur for stroke, knee or post-surgery recovery. Share your location to check visits in Murlipura, Vaishali Nagar, and Mansarovar.",
    localIntro: "Jaipur families can book home physiotherapy after surgery, stroke, or complex illness, with the first assessment shaped around the person's safety, goals, and home routine.",
    localFocus: "Jaipur is our operations HQ and training base. We coordinate neurological, orthopaedic, and cardiopulmonary rehabilitation professionals for people continuing recovery after discharge.",
    careContext: "A Jaipur home assessment can examine a bedroom transfer, family stairway, or walking route. The therapist agrees safe priorities and measurable daily goals with the patient and caregiver.",
    localCoverage: "Home visits cover Murlipura, Vaishali Nagar, Mansarovar, Malviya Nagar, Tonk Road, C-Scheme, and surrounding Jaipur neighbourhoods. If you are searching for a physiotherapist near me in Jaipur, we can arrange a home visit after confirming your location.",
    nearMeFaq: {
      q: "How do I book physiotherapy at home in Jaipur?",
      a: "Share your Jaipur neighbourhood and recovery needs. The team can confirm a home visit in Murlipura, Mansarovar, Vaishali Nagar, or nearby areas.",
    },
  },
  {
    slug: "delhi",
    name: "Delhi",
    state: "Delhi",
    administrativeType: "nct",
    region: "Delhi NCR",
    nearby: ["South Delhi", "North Delhi", "East Delhi", "West Delhi", "Dwarka", "Rohini", "Vasant Kunj"],
    localities: [
      { name: "South Delhi", description: "Home rehabilitation support for families across South Delhi neighbourhoods." },
      { name: "North Delhi", description: "Specialist physiotherapy at home when regular travel is difficult." },
      { name: "East Delhi", description: "Practical home sessions for mobility, balance, breathing, and daily function." },
      { name: "West Delhi", description: "Recovery-focused physiotherapy arranged around your home environment." },
      { name: "Dwarka", description: "Ask about homecare after surgery, stroke, joint replacement, or hospital discharge." },
      { name: "Rohini", description: "One-to-one physiotherapy at home with exercises matched to your recovery goals." },
      { name: "Vasant Kunj", description: "Home visits for patients who need structured rehabilitation without a difficult commute." },
    ],
    nearbyCities: ["noida", "gurgaon", "faridabad"],
    conditions: ["Stroke Rehabilitation", "Neurological Physiotherapy", "Knee Replacement Rehabilitation", "Hip Replacement Rehabilitation", "Cardiopulmonary Rehabilitation"],
    indexable: true,
    heroHeading: "Post-Hospital Physiotherapy at Home in Delhi",
    seoTitle: "Post-Hospital Home Physiotherapy in Delhi | Goswami Rehab",
    seoDescription: "Home physiotherapy in Delhi after stroke, joint replacement, or hospital discharge. Share your area to check South Delhi, Dwarka, and Rohini visit options.",
    localIntro: "Delhi families can request home physiotherapy after hospital discharge, stroke, joint replacement, or cardiopulmonary illness. Share the locality and recovery goal first.",
    localFocus: "Home sessions across Delhi can reduce travel during rehabilitation while keeping the plan tied to assessment, precautions, medical advice, and the patient's daily function.",
    careContext: "A Delhi visit can practise transfers, stairs, walking routes, and caregiver technique where those tasks happen. The plan changes as confidence and function improve.",
    localCoverage: "We serve South Delhi, North Delhi, East Delhi, West Delhi, Dwarka, Rohini, Vasant Kunj, and nearby NCR locations. People searching for a physiotherapist near me in Delhi can contact us to confirm a home visit.",
    nearMeFaq: {
      q: "How do I book a physiotherapist home visit in Delhi?",
      a: "Share your Delhi area and recovery needs. The team can confirm a physiotherapist home visit across South Delhi, Dwarka, Rohini, Vasant Kunj, and nearby NCR locations.",
    },
  },
  {
    slug: "noida",
    name: "Noida",
    state: "Uttar Pradesh",
    region: "Delhi NCR",
    nearby: ["Sector 18", "Sector 62", "Sector 137", "Greater Noida", "Indirapuram"],
    nearbyCities: ["delhi", "gurgaon", "faridabad"],
    conditions: ["Post-Surgery Rehabilitation", "Spinal Physiotherapy", "Stroke Rehabilitation", "COPD & Pulmonary Rehabilitation", "Neurological Rehabilitation"],
    indexable: false,
    heroHeading: "Online Physiotherapy and Homecare Requests in Noida",
    seoTitle: "Online Physiotherapy & Homecare Requests in Noida",
    seoDescription: "Start online physiotherapy from Noida for spinal, stroke, or post-surgery recovery. Homecare requests are checked by sector across Noida and Greater Noida.",
    localIntro: "Online physiotherapy is available now for Noida families. Share your sector, recovery goal, and preferred date so the team can check a suitable home-care professional.",
    localFocus: "Noida enquiries may involve post-surgery, spinal, stroke, or respiratory rehabilitation. Home visits are availability-confirmed by sector; online consultation remains available if local matching is not possible.",
    localCoverage: "Submit a request from Sector 18, Sector 62, Sector 137, Greater Noida, Indirapuram, or nearby Noida locations. The team confirms the appropriate care option.",
  },
  {
    slug: "gurgaon",
    name: "Gurugram",
    state: "Haryana",
    region: "Delhi NCR",
    nearby: ["DLF", "Sohna Road", "Golf Course Road", "Sector 56", "Palam Vihar", "Manesar"],
    localities: [
      { name: "DLF", description: "Home physiotherapy for professionals, families, and patients recovering in DLF communities." },
      { name: "Sohna Road", description: "Specialist rehabilitation at home for post-surgery, sports, and mobility needs." },
      { name: "Golf Course Road", description: "Convenient one-to-one sessions that fit around work and family routines." },
      { name: "Sector 56", description: "Homecare physiotherapy for strength, balance, pain, and everyday movement." },
      { name: "Palam Vihar", description: "Ask about a home visit after injury, surgery, or a recent hospital discharge." },
      { name: "Manesar", description: "Recovery support at home when a long journey to a clinic is not practical." },
    ],
    nearbyCities: ["delhi", "noida", "faridabad"],
    conditions: ["Sports Injury Physiotherapy", "Back Pain Physiotherapy", "Knee Replacement Rehabilitation", "Hip Replacement Rehabilitation", "Stroke Rehabilitation", "Post-ICU Rehabilitation"],
    indexable: true,
    heroHeading: "Return-to-Work Physiotherapy at Home in Gurugram (Gurgaon)",
    seoTitle: "Physiotherapy at Home in Gurugram (Gurgaon) | Goswami Rehab",
    seoDescription: "Physiotherapy at home in Gurugram (Gurgaon) for back pain, sports injury, stroke, or surgery recovery. Check DLF, Sohna Road, and Golf Course Road by locality.",
    localIntro: "Gurugram (Gurgaon) families can request home physiotherapy across DLF, Sohna Road, Golf Course Road, Sector 56, Palam Vihar, and Manesar.",
    localFocus: "Home rehabilitation can support sports injury, back pain, joint replacement, stroke, and post-ICU recovery while the patient stays near family, work, and daily routines.",
    careContext: "A Gurugram plan may practise a return-to-work task, safe apartment movement, or graded strength. It is shaped by assessment rather than a generic exercise sheet.",
    localCoverage: "Physiotherapy at home in Gurugram (Gurgaon) is available across DLF, Sohna Road, Golf Course Road, Sector 56, Palam Vihar, Manesar, and nearby areas. If you searched for a physiotherapist near me in Gurgaon, contact us to check availability.",
    nearMeFaq: {
      q: "How can I find a physiotherapist near me in Gurugram (Gurgaon)?",
      a: "If you need a physiotherapist near you in Gurugram, also known as Gurgaon, WhatsApp your locality and recovery needs. We will confirm homecare availability across DLF, Sohna Road, Golf Course Road, Sector 56, Palam Vihar, Manesar, and nearby areas.",
    },
  },
  {
    slug: "faridabad",
    name: "Faridabad",
    state: "Haryana",
    region: "Delhi NCR",
    nearby: ["HUDA Colony", "Sector 16", "NIT Faridabad", "Ballabhgarh", "Sector 46", "Greater Faridabad"],
    localities: [
      { name: "HUDA Colony", description: "Home physiotherapy for stroke, post-surgery, neurological, and mobility recovery." },
      { name: "Sector 16", description: "Regular home sessions built around safe movement and everyday independence." },
      { name: "NIT Faridabad", description: "Specialist support at home when clinic travel adds strain to recovery." },
      { name: "Ballabhgarh", description: "Ask about homecare after surgery, stroke, fracture, or hospital discharge." },
      { name: "Sector 46", description: "One-to-one rehabilitation matched to your condition, assessment, and routine." },
      { name: "Greater Faridabad", description: "Convenient home visits for patients and families managing recovery locally." },
    ],
    nearbyCities: ["delhi", "noida", "gurgaon"],
    conditions: ["Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Stroke Rehabilitation", "COPD & Pulmonary Rehabilitation", "Joint Replacement Rehabilitation"],
    indexable: true,
    heroHeading: "Everyday Mobility Physiotherapy at Home in Faridabad",
    seoTitle: "Home Physiotherapy for Mobility in Faridabad | Goswami Rehab",
    seoDescription: "Physiotherapy at home in Faridabad for post-surgery, stroke, joint and neurological recovery. Request visits in HUDA Colony, Sector 16 or Ballabhgarh.",
    localIntro: "Faridabad patients can request home physiotherapy across HUDA Colony, Sector 16, NIT Faridabad, Ballabhgarh, and Greater Faridabad, subject to local professional matching.",
    localFocus: "Our Jaipur operations hub trains and onboards the provider network. Faridabad homecare is coordinated by availability, not a Faridabad clinic, for post-surgery, stroke, neurological, pulmonary, and joint recovery.",
    careContext: "A Faridabad plan can connect clinical goals with standing from a chair, bathroom safety, outdoor walking, or fatigue management after discharge.",
    localCoverage: "Physiotherapy at home in Faridabad is available by request across HUDA Colony, Sector 16, NIT Faridabad, Ballabhgarh, Sector 46, Greater Faridabad, and nearby areas. If you searched for a physiotherapist near me in Faridabad, share your locality to confirm a visit.",
    nearMeFaq: {
      q: "How can I find a physiotherapist near me in Faridabad?",
      a: "Share your Faridabad neighbourhood and recovery needs on WhatsApp. We can confirm a home physiotherapy visit in HUDA Colony, Ballabhgarh, NIT Faridabad, Greater Faridabad, or nearby areas.",
    },
  },
  {
    slug: "tigaon",
    name: "Tigaon",
    state: "Haryana",
    region: "Delhi NCR",
    nearby: ["Tigaon", "Bhatola", "Basantpur", "Greater Faridabad", "Ballabhgarh", "Sector 86"],
    localities: [
      { name: "Tigaon", description: "Home physiotherapy support for mobility, strength, balance, and recovery at home." },
      { name: "Bhatola", description: "Ask about a home visit when regular travel to a clinic is difficult." },
      { name: "Basantpur", description: "One-to-one rehabilitation planned around daily movement and family support." },
      { name: "Greater Faridabad", description: "Homecare physiotherapy for post-surgery, neurological, and functional recovery needs." },
      { name: "Ballabhgarh", description: "Practical rehabilitation at home after injury, surgery, or hospital discharge." },
      { name: "Sector 86", description: "Home sessions coordinated around your condition, assessment, and recovery goals." },
    ],
    nearbyCities: ["faridabad", "delhi", "gurgaon"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Orthopaedic Rehabilitation", "Geriatric Physiotherapy"],
    indexable: true,
    heroHeading: "Family-Centred Home Physiotherapy in Tigaon",
    seoTitle: "Family-Centred Home Physiotherapy Care in Tigaon",
    seoDescription: "Home physiotherapy in Tigaon for stroke, surgery, neurological or geriatric recovery. Share your area to check Tigaon, Bhatola, and Basantpur visit options.",
    reviewMode: "provider-team",
    localIntro: "Tigaon families can request home physiotherapy after surgery, stroke, injury, or complex illness. The provider team first checks the locality, goals, and professional availability.",
    localFocus: "Tigaon homecare enquiries are coordinated around movement, strength, balance, breathing, and everyday function, with the right professional confirmed before a visit.",
    careContext: "A Tigaon request begins by matching the patient's needs and home setting with an appropriate professional, so follow-up expectations remain realistic for the family.",
    localCoverage: "Home physiotherapy enquiries can be arranged across Tigaon, Bhatola, Basantpur, Greater Faridabad, Ballabhgarh, Sector 86, and nearby areas after confirming your location and the appropriate professional.",
    nearMeFaq: {
      q: "How can I find a physiotherapist near me in Tigaon?",
      a: "Send your Tigaon locality and recovery needs on WhatsApp. We will confirm whether a home visit can be arranged in Tigaon, Bhatola, Basantpur, Greater Faridabad, or nearby areas.",
    },
  },
  {
    slug: "chandigarh",
    name: "Chandigarh",
    state: "Chandigarh",
    administrativeType: "union-territory",
    region: "Chandigarh",
    nearby: ["Sector 17", "Sector 22", "Mohali", "Panchkula", "Zirakpur"],
    nearbyCities: ["amritsar", "ludhiana"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Parkinson's Physiotherapy", "Orthopaedic Rehabilitation", "Cardiopulmonary Rehabilitation"],
    heroHeading: "Video Physiotherapy for Chandigarh Recovery",
    seoTitle: "Video Physiotherapy and Recovery in Chandigarh",
    seoDescription: "Choose online physiotherapy from Chandigarh for stroke, surgery, or mobility guidance. Home-visit requests are reviewed by sector as local availability expands.",
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    state: "Punjab",
    region: "Punjab",
    nearby: ["Ranjit Avenue", "Lawrence Road", "GT Road", "Majitha Road", "Batala Road"],
    nearbyCities: ["chandigarh", "ludhiana"],
    conditions: ["Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Stroke Rehabilitation", "COPD & Pulmonary Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Stroke and Mobility Physiotherapy in Amritsar",
    seoTitle: "Stroke & Mobility Physiotherapy Care in Amritsar",
    seoDescription: "Get online physiotherapy from Amritsar for stroke, surgery, mobility, or daily function. Share your locality to check whether a home visit can be arranged.",
  },
  {
    slug: "ludhiana",
    name: "Ludhiana",
    state: "Punjab",
    region: "Punjab",
    nearby: ["Model Town", "BRS Nagar", "Sarabha Nagar", "Dugri", "Civil Lines"],
    nearbyCities: ["chandigarh", "amritsar"],
    conditions: ["Post-Surgery Rehabilitation", "Knee Replacement Rehabilitation", "Stroke Rehabilitation", "Spinal Cord Injury Rehabilitation", "Guillain-Barré Rehabilitation"],
    heroHeading: "Physiotherapy Guidance for Ludhiana Families",
    seoTitle: "Physiotherapy Guidance and Care for Ludhiana Families",
    seoDescription: "Access online physiotherapy from Ludhiana for stroke, surgery, mobility, or daily function. Homecare requests are checked with your locality and preferred date.",
  },
  {
    slug: "bengaluru",
    name: "Bengaluru",
    state: "Karnataka",
    region: "South India",
    nearby: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Jayanagar", "Malleswaram", "Yelahanka"],
    localities: [
      { name: "Indiranagar", description: "Home physiotherapy that fits around work, family, and active daily routines." },
      { name: "Koramangala", description: "Specialist support at home for injury, surgery, neurological, and mobility recovery." },
      { name: "Whitefield", description: "A practical homecare option when Bengaluru traffic makes regular travel difficult." },
      { name: "HSR Layout", description: "One-to-one sessions for strength, balance, pain, and return to activity." },
      { name: "Jayanagar", description: "Home rehabilitation shaped around your assessment and everyday movement goals." },
      { name: "Malleswaram", description: "Ask about a home visit after surgery, fracture, or hospital discharge." },
      { name: "Yelahanka", description: "Recovery-focused physiotherapy at home for patients and caregivers." },
    ],
    nearbyCities: ["mysuru", "mangaluru"],
    conditions: ["Stroke Rehabilitation", "Neurological Physiotherapy", "Post-Surgery Rehabilitation", "Sports Injury Physiotherapy", "Cardiopulmonary Rehabilitation"],
    indexable: true,
    heroHeading: "Home Physiotherapy for Work in Bengaluru (Bangalore)",
    seoTitle: "Home Physiotherapy in Bangalore (Bengaluru) | Goswami Rehab",
    seoDescription: "Home physiotherapy in Bengaluru (Bangalore) for stroke, post-surgery and sports recovery. Check home visits in Indiranagar, Koramangala or Whitefield.",
    localIntro: "Bengaluru (Bangalore) families can request home physiotherapy across Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, Malleswaram, and Yelahanka.",
    localFocus: "Home sessions can support stroke, neurological, post-surgery, sports injury, and cardiopulmonary rehabilitation, guided by assessment, precautions, and daily goals.",
    careContext: "A Bengaluru visit can use the patient's desk, stairs, bathroom route, or walking plan when these affect recovery, while remaining connected to the treating team.",
    localCoverage: "Home-visit requests are considered across Indiranagar, Koramangala, Whitefield, HSR Layout, Jayanagar, Malleswaram, Yelahanka, and surrounding areas. If you are looking for a physiotherapist at home in Bangalore, share your locality and recovery needs so the team can confirm availability.",
    nearMeFaq: {
      q: "How can I find a physiotherapist near me in Bengaluru?",
      a: "If you are looking for a physiotherapist near you in Bengaluru or Bangalore, send your locality and recovery needs on WhatsApp. We will confirm homecare availability across Whitefield, Koramangala, Indiranagar, HSR Layout, Jayanagar, and nearby areas.",
    },
  },
  {
    slug: "mumbai",
    name: "Mumbai",
    state: "Maharashtra",
    region: "Maharashtra",
    nearby: ["Andheri", "Bandra", "Powai", "Thane", "Navi Mumbai", "Borivali", "Goregaon"],
    localities: [
      { name: "Andheri", description: "Home physiotherapy for stroke, post-surgery, neurological, and everyday mobility recovery." },
      { name: "Bandra", description: "One-to-one rehabilitation arranged around family routines, building access, and daily movement goals." },
      { name: "Powai", description: "Ask about a physiotherapist at home when traffic or fatigue makes clinic travel difficult." },
      { name: "Thane", description: "Practical homecare support for recovery after hospital discharge, surgery, or neurological illness." },
      { name: "Navi Mumbai", description: "Recovery-focused sessions planned around the person's home, caregivers, and available follow-up." },
      { name: "Borivali", description: "Home visits for strength, balance, walking, and safe return to everyday activities." },
    ],
    nearbyCities: ["pune"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Rehabilitation", "Cardiac Rehabilitation", "Guillain-Barré Rehabilitation"],
    indexable: true,
    heroHeading: "Home Physiotherapy After Hospital Care in Mumbai",
    seoTitle: "Home Physiotherapy in Mumbai for Recovery | Goswami Rehab",
    seoDescription: "Home physiotherapy after hospital care in Mumbai for stroke, surgery, neurological, or cardiac recovery. Check visit options in Andheri, Bandra, and Powai.",
    localIntro: "Mumbai families can request home physiotherapy in Andheri, Bandra, Powai, Thane, Navi Mumbai, Borivali, and Goregaon when travel makes regular care difficult.",
    localFocus: "We coordinate stroke, post-surgery, neurological, cardiac, and Guillain-Barré rehabilitation around assessment, precautions, caregivers, and consistent follow-up.",
    careContext: "A Mumbai assessment considers traffic, building access, family schedules, and post-hospital fatigue to identify a safe starting point and useful daily activities.",
    localCoverage: "Our Mumbai service area includes Andheri, Bandra, Powai, Thane, Navi Mumbai, Borivali, Goregaon, and surrounding neighbourhoods. If you are searching for a physiotherapist at home in Mumbai, share your locality and recovery needs so the team can confirm availability.",
    nearMeFaq: {
      q: "How can I find a physiotherapist near me in Mumbai?",
      a: "For home physiotherapy in Mumbai, share your locality and recovery needs on WhatsApp. The team can confirm availability in Andheri, Bandra, Powai, Thane, Navi Mumbai, Borivali, Goregaon, or nearby.",
    },
  },
  {
    slug: "pune",
    name: "Pune",
    state: "Maharashtra",
    region: "Maharashtra",
    nearby: ["Kothrud", "Viman Nagar", "Hinjawadi", "Baner", "Aundh", "Koregaon Park", "Hadapsar"],
    nearbyCities: ["mumbai"],
    conditions: ["Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Stroke Rehabilitation", "Sports Injury Physiotherapy", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Online Sports and Recovery Physiotherapy in Pune",
    seoTitle: "Online Sports & Recovery Physiotherapy in Pune",
    seoDescription: "Choose online physiotherapy from Pune for sports injury, stroke, surgery, mobility, or breathing goals. Homecare requests are checked by locality and date.",
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    state: "Telangana",
    region: "South India",
    nearby: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Kondapur", "Secunderabad", "Uppal"],
    nearbyCities: ["visakhapatnam", "bengaluru"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Physiotherapy", "Cardiopulmonary Rehabilitation", "Guillain-Barré Rehabilitation"],
    indexable: false,
    heroHeading: "Online Neurological Physiotherapy from Hyderabad",
    seoTitle: "Online Neurological Physiotherapy from Hyderabad",
    seoDescription: "Start online physiotherapy from Hyderabad for neurological, stroke, surgery, or cardiopulmonary recovery. Homecare requests are checked by locality now.",
    localIntro: "Online physiotherapy is available now for Hyderabad patients. Share your locality, recovery goal, and preferred date so the team can check a suitable home-care professional.",
    localFocus: "Hyderabad enquiries may involve post-surgery, stroke, neurological, cardiopulmonary, or complex rehabilitation. Home visits are availability-confirmed by locality, not guaranteed.",
    localCoverage: "Submit a request from Banjara Hills, Jubilee Hills, Gachibowli, Kondapur, Secunderabad, Uppal, or nearby Hyderabad communities. Online care remains available if local matching is not possible.",
  },
  {
    slug: "kochi",
    name: "Kochi",
    state: "Kerala",
    region: "Kerala",
    nearby: ["Ernakulam", "Kakkanad", "Edapally", "Aluva", "Thrippunithura", "Marine Drive"],
    nearbyCities: ["thiruvananthapuram", "kozhikode"],
    conditions: ["Neurological Physiotherapy", "Stroke Rehabilitation", "Post-Surgery Rehabilitation", "COPD & Pulmonary Rehabilitation", "Geriatric Rehabilitation"],
    heroHeading: "Video Physiotherapy Support for Kochi Families",
    seoTitle: "Video Physiotherapy Support for Kochi Families",
    seoDescription: "Request online physiotherapy from Kochi for stroke, surgery, neurological, or breathing recovery. Homecare enquiries are checked by locality for families.",
  },
  {
    slug: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    state: "Kerala",
    region: "Kerala",
    nearby: ["Pattom", "Kowdiar", "Vanchiyoor", "Sasthamangalam", "Kazhakkoottam", "Attingal"],
    nearbyCities: ["kochi", "kozhikode"],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "Parkinson's Physiotherapy", "Cardiopulmonary Rehabilitation"],
    heroHeading: "Online Physiotherapy Care in Thiruvananthapuram",
    seoTitle: "Home Physiotherapy in Thiruvananthapuram | Goswami Rehab",
    seoDescription: "Choose online physiotherapy from Thiruvananthapuram for stroke, surgery, mobility, Parkinson's, or heart recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "kozhikode",
    name: "Kozhikode",
    state: "Kerala",
    region: "Kerala",
    nearby: ["Calicut", "Mavoor Road", "Palayam", "Nadakkavu", "Westhill", "Feroke"],
    nearbyCities: ["kochi", "thiruvananthapuram"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Physiotherapy", "Geriatric Rehabilitation", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Stroke and Breathing Physiotherapy from Kozhikode",
    seoTitle: "Stroke & Breathing Physiotherapy from Kozhikode",
    seoDescription: "Access online physiotherapy from Kozhikode for stroke, surgery, neurological, ageing, or breathing needs. Homecare requests are checked by locality and date.",
  },
  {
    slug: "visakhapatnam",
    name: "Visakhapatnam",
    state: "Andhra Pradesh",
    region: "South India",
    nearby: ["Vizag", "MVP Colony", "Rushikonda", "Gajuwaka", "Bheemunipatnam"],
    nearbyCities: ["hyderabad", "bhubaneswar"],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "Cardiopulmonary Rehabilitation", "Guillain-Barré Rehabilitation"],
    heroHeading: "Coastal Mobility Physiotherapy in Visakhapatnam",
    seoTitle: "Mobility Physiotherapy Support in Visakhapatnam",
    seoDescription: "Start online physiotherapy from Visakhapatnam for stroke, surgery, neurological, or heart recovery. Homecare requests are checked by locality today now.",
  },
  {
    slug: "nagpur",
    name: "Nagpur",
    state: "Maharashtra",
    region: "Maharashtra",
    nearby: ["Dharampeth", "Sadar", "Civil Lines", "Pratap Nagar", "Manewada", "Wardha Road"],
    nearbyCities: ["bhopal"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Physiotherapy", "COPD & Pulmonary Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Post-Surgery Physiotherapy and Ageing Care from Nagpur",
    seoTitle: "Post-Surgery & Ageing Physiotherapy from Nagpur",
    seoDescription: "Choose online physiotherapy from Nagpur for surgery, stroke, neurological, breathing, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "guwahati",
    name: "Guwahati",
    state: "Assam",
    region: "North East India",
    nearby: ["Dispur", "Paltan Bazaar", "Basistha", "Zoo Road", "Noonmati", "Beltola"],
    nearbyCities: [],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "Guillain-Barré Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Neurological Physiotherapy and Mobility Care from Guwahati",
    seoTitle: "Neurological & Mobility Physiotherapy from Guwahati",
    seoDescription: "Get online physiotherapy from Guwahati for stroke, neurological, surgery, Guillain-Barré, or ageing recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "kolkata",
    name: "Kolkata",
    state: "West Bengal",
    region: "East India",
    nearby: ["Salt Lake", "Park Street", "Ballygunge", "Alipore", "Dum Dum", "New Town", "Howrah"],
    nearbyCities: ["ranchi", "bhubaneswar"],
    conditions: ["Stroke Rehabilitation", "Neurological Physiotherapy", "Post-Surgery Rehabilitation", "Cardiopulmonary Rehabilitation", "Guillain-Barré Rehabilitation"],
    heroHeading: "Home-Setting Physiotherapy Guidance for Kolkata",
    seoTitle: "Physiotherapy Guidance for Kolkata Home Settings",
    seoDescription: "Request online physiotherapy from Kolkata for stroke, surgery, neurological, heart, or Guillain-Barré recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "chennai",
    name: "Chennai",
    state: "Tamil Nadu",
    region: "South India",
    nearby: ["Anna Nagar", "T. Nagar", "Adyar", "Velachery", "Porur", "Tambaram", "OMR"],
    nearbyCities: ["coimbatore", "madurai", "bengaluru"],
    conditions: ["Stroke Rehabilitation", "Neurological Physiotherapy", "Post-Surgery Rehabilitation", "Cardiopulmonary Rehabilitation", "Knee Replacement Rehabilitation"],
    heroHeading: "Knee and Post-Surgery Physiotherapy from Chennai",
    seoTitle: "Knee & Post-Surgery Physiotherapy from Chennai",
    seoDescription: "Choose online physiotherapy from Chennai for stroke, surgery, neurological, heart, or knee recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "coimbatore",
    name: "Coimbatore",
    state: "Tamil Nadu",
    region: "South India",
    nearby: ["RS Puram", "Gandhipuram", "Saibaba Colony", "Peelamedu", "Singanallur", "Hopes College"],
    nearbyCities: ["chennai", "madurai", "bengaluru"],
    conditions: ["Stroke Rehabilitation", "Neurological Physiotherapy", "Post-Surgery Rehabilitation", "Knee Replacement Rehabilitation", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Breathing and Mobility Physiotherapy from Coimbatore",
    seoTitle: "Breathing & Mobility Physiotherapy from Coimbatore",
    seoDescription: "Start online physiotherapy from Coimbatore for stroke, surgery, knee, mobility, or breathing recovery. Homecare requests are checked by locality today.",
  },
  {
    slug: "madurai",
    name: "Madurai",
    state: "Tamil Nadu",
    region: "South India",
    nearby: ["Anna Nagar", "KK Nagar", "Vishwanathapuram", "Bypass Road", "Mattuthavani", "Tallakulam"],
    nearbyCities: ["chennai", "coimbatore"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Rehabilitation", "Geriatric Physiotherapy", "Orthopaedic Rehabilitation"],
    heroHeading: "Everyday Function Physiotherapy from Madurai",
    seoTitle: "Everyday Function Physiotherapy Care from Madurai",
    seoDescription: "Access online physiotherapy from Madurai for stroke, surgery, neurological, ageing, or orthopaedic recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "mysuru",
    name: "Mysuru",
    state: "Karnataka",
    region: "South India",
    nearby: ["Jayalakshmipuram", "Kuvempunagar", "Nazarbad", "Saraswathipuram", "Hebbal", "Vijayanagar"],
    nearbyCities: ["bengaluru", "mangaluru"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Parkinson's Physiotherapy", "Geriatric Rehabilitation"],
    heroHeading: "Parkinson's and Ageing Physiotherapy from Mysuru",
    seoTitle: "Parkinson's & Ageing Physiotherapy from Mysuru",
    seoDescription: "Choose online physiotherapy from Mysuru for stroke, surgery, Parkinson's, neurological, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "mangaluru",
    name: "Mangaluru",
    state: "Karnataka",
    region: "South India",
    nearby: ["Hampankatta", "Kadri", "Kankanady", "Bejai", "Attavar", "Balmatta"],
    nearbyCities: ["bengaluru", "mysuru"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Physiotherapy", "Geriatric Rehabilitation", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Coastal Breathing Physiotherapy and Mobility Care from Mangaluru",
    seoTitle: "Breathing & Mobility Physiotherapy from Mangaluru",
    seoDescription: "Request online physiotherapy from Mangaluru for stroke, surgery, neurological, ageing, or breathing recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "ahmedabad",
    name: "Ahmedabad",
    state: "Gujarat",
    region: "West India",
    nearby: ["Navrangpura", "Satellite", "Vastrapur", "Bopal", "Chandkheda", "Maninagar"],
    nearbyCities: ["surat", "vadodara"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Physiotherapy", "Cardiac Rehabilitation", "Orthopaedic Rehabilitation"],
    heroHeading: "Orthopaedic and Cardiac Physiotherapy in Ahmedabad",
    seoTitle: "Orthopaedic & Cardiac Physiotherapy in Ahmedabad",
    seoDescription: "Choose online physiotherapy from Ahmedabad for surgery, stroke, neurological, heart, or orthopaedic recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "surat",
    name: "Surat",
    state: "Gujarat",
    region: "West India",
    nearby: ["Vesu", "Adajan", "Piplod", "Pal", "Katargam", "Udhna"],
    nearbyCities: ["ahmedabad", "vadodara"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Knee Replacement Rehabilitation", "Neurological Rehabilitation", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Knee and Pulmonary Physiotherapy from Surat",
    seoTitle: "Knee & Breathing Physiotherapy Care from Surat",
    seoDescription: "Start online physiotherapy from Surat for surgery, stroke, knee, neurological, or breathing recovery. Homecare requests are checked by locality today.",
  },
  {
    slug: "vadodara",
    name: "Vadodara",
    state: "Gujarat",
    region: "West India",
    nearby: ["Alkapuri", "Fatehgunj", "Manjalpur", "Gotri", "Vasna", "Gorwa"],
    nearbyCities: ["ahmedabad", "surat"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Rehabilitation", "Orthopaedic Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Orthopaedic Physiotherapy and Ageing Care from Vadodara",
    seoTitle: "Orthopaedic & Ageing Physiotherapy from Vadodara",
    seoDescription: "Access online physiotherapy from Vadodara for stroke, surgery, neurological, orthopaedic, or ageing recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "lucknow",
    name: "Lucknow",
    state: "Uttar Pradesh",
    region: "North India",
    nearby: ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Jankipuram", "Alambagh"],
    nearbyCities: ["kanpur", "agra", "prayagraj", "varanasi"],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "Knee Replacement Rehabilitation", "Cardiopulmonary Rehabilitation"],
    heroHeading: "Heart and Mobility Physiotherapy from Lucknow",
    seoTitle: "Heart & Mobility Physiotherapy Care from Lucknow",
    seoDescription: "Choose online physiotherapy from Lucknow for stroke, surgery, knee, neurological, or cardiopulmonary recovery. Homecare requests are checked locally now.",
  },
  {
    slug: "moradabad",
    name: "Moradabad",
    state: "Uttar Pradesh",
    region: "North India",
    nearby: ["Civil Lines", "Ram Ganga Vihar", "Buddhi Vihar", "Kanth Road", "Majhola", "Pakbara"],
    localities: [
      { name: "Civil Lines", description: "Home physiotherapy support for mobility, strength, and recovery at home." },
      { name: "Ram Ganga Vihar", description: "One-to-one rehabilitation arranged around daily movement and family routines." },
      { name: "Buddhi Vihar", description: "Ask about a home visit when regular clinic travel is difficult." },
      { name: "Kanth Road", description: "Homecare support for post-surgery, neurological, and functional recovery." },
      { name: "Majhola", description: "Practical physiotherapy at home after injury, surgery, or hospital discharge." },
      { name: "Pakbara", description: "Recovery-focused sessions coordinated after location and professional availability are confirmed." },
    ],
    nearbyCities: ["delhi", "lucknow", "agra"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Knee Replacement Rehabilitation", "Cardiopulmonary Rehabilitation"],
    indexable: true,
    heroHeading: "Neurological Home Physiotherapy in Moradabad",
    seoTitle: "Neurological Home Physiotherapy Care in Moradabad",
    seoDescription: "Request home physiotherapy in Moradabad after stroke, surgery, or neurological change. The team reviews Civil Lines, Ram Ganga Vihar, and Buddhi Vihar visits.",
    reviewMode: "provider-team",
    localIntro: "Moradabad families can request home physiotherapy for stroke, post-surgery, neurological, orthopaedic, or cardiopulmonary recovery after local availability is confirmed.",
    localFocus: "Our provider team coordinates rehabilitation around the home environment, recovery goals, and everyday function, with a suitable local professional confirmed first.",
    careContext: "A Moradabad enquiry starts with location, current mobility, and support between sessions so the plan can address transfers, walking, strength, or breathing safely.",
    localCoverage: "Home physiotherapy enquiries can be arranged across Civil Lines, Ram Ganga Vihar, Buddhi Vihar, Kanth Road, Majhola, Pakbara, and nearby Moradabad areas after confirming your location.",
    nearMeFaq: {
      q: "How can I find a physiotherapist near me in Moradabad?",
      a: "If you need a physiotherapist near you in Moradabad, WhatsApp your locality and recovery needs. We will confirm whether a suitable professional can visit in Civil Lines, Ram Ganga Vihar, Buddhi Vihar, Kanth Road, Majhola, Pakbara, or nearby.",
    },
  },
  {
    slug: "kanpur",
    name: "Kanpur",
    state: "Uttar Pradesh",
    region: "North India",
    nearby: ["Civil Lines", "Swaroop Nagar", "Kakadeo", "Kidwai Nagar", "Armapur", "Kalyanpur"],
    nearbyCities: ["lucknow", "agra", "prayagraj"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Rehabilitation", "COPD & Pulmonary Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Breathing and Ageing Physiotherapy from Kanpur",
    seoTitle: "Breathing & Ageing Physiotherapy Care from Kanpur",
    seoDescription: "Start online physiotherapy from Kanpur for stroke, surgery, neurological, breathing, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    region: "North India",
    nearby: ["Sigra", "Lanka", "Assi", "Cantt", "Orderly Bazar", "Shivpur"],
    nearbyCities: ["lucknow", "prayagraj"],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "Geriatric Physiotherapy", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Ageing Physiotherapy and Breathing Care from Varanasi",
    seoTitle: "Ageing & Breathing Physiotherapy from Varanasi",
    seoDescription: "Choose online physiotherapy from Varanasi for stroke, surgery, neurological, ageing, or breathing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "agra",
    name: "Agra",
    state: "Uttar Pradesh",
    region: "North India",
    nearby: ["Kamla Nagar", "Bodla", "Shahganj", "Civil Lines", "Sikandra", "Taj Nagri"],
    nearbyCities: ["lucknow", "kanpur"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Knee Replacement Rehabilitation", "Neurological Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Knee and Mobility Physiotherapy from Agra",
    seoTitle: "Online Knee & Mobility Physiotherapy Care in Agra",
    seoDescription: "Access online physiotherapy from Agra for surgery, stroke, knee, neurological, or ageing recovery. Homecare requests are checked by locality right now.",
  },
  {
    slug: "prayagraj",
    name: "Prayagraj",
    state: "Uttar Pradesh",
    region: "North India",
    nearby: ["Civil Lines", "George Town", "Naini", "Jhunsi", "Phaphamau", "Karchhana"],
    nearbyCities: ["lucknow", "kanpur", "varanasi"],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "Geriatric Physiotherapy", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Neurological Physiotherapy Support from Prayagraj",
    seoTitle: "Neurological & Breathing Physiotherapy from Prayagraj",
    seoDescription: "Request online physiotherapy from Prayagraj for stroke, surgery, neurological, ageing, or breathing recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "jodhpur",
    name: "Jodhpur",
    state: "Rajasthan",
    region: "Rajasthan",
    nearby: ["Ratanada", "Sardarpura", "Paota", "Pal Road", "Shastri Nagar", "Chopasni Housing Board"],
    nearbyCities: ["jaipur", "udaipur", "ajmer"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Physiotherapy", "COPD & Pulmonary Rehabilitation", "Orthopaedic Rehabilitation"],
    heroHeading: "Orthopaedic Physiotherapy and Breathing Care from Jodhpur",
    seoTitle: "Orthopaedic & Breathing Physiotherapy from Jodhpur",
    seoDescription: "Choose online physiotherapy from Jodhpur for stroke, surgery, neurological, breathing, or orthopaedic recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "udaipur",
    name: "Udaipur",
    state: "Rajasthan",
    region: "Rajasthan",
    nearby: ["Sukhadia Circle", "Hiran Magri", "Sector 11", "Fatehpura", "Shobhagpura", "Bhupalpura"],
    nearbyCities: ["jaipur", "jodhpur", "ajmer"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Rehabilitation", "Geriatric Physiotherapy", "Knee Replacement Rehabilitation"],
    heroHeading: "Knee and Ageing Physiotherapy from Udaipur",
    seoTitle: "Knee & Ageing Physiotherapy Care from Udaipur",
    seoDescription: "Start online physiotherapy from Udaipur for surgery, stroke, neurological, knee, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "ajmer",
    name: "Ajmer",
    state: "Rajasthan",
    region: "Rajasthan",
    nearby: ["Vaishali Nagar", "Civil Lines", "Nasirabad Road", "Anasagar", "Pushkar Road", "Station Road"],
    nearbyCities: ["jaipur", "jodhpur", "udaipur"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Geriatric Physiotherapy", "COPD & Pulmonary Rehabilitation"],
    heroHeading: "Stroke Physiotherapy and Breathing Care from Ajmer",
    seoTitle: "Stroke & Breathing Physiotherapy Care from Ajmer",
    seoDescription: "Access online physiotherapy from Ajmer for stroke, surgery, neurological, ageing, or breathing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "bhopal",
    name: "Bhopal",
    state: "Madhya Pradesh",
    region: "Central India",
    nearby: ["MP Nagar", "Arera Colony", "Kolar Road", "Shyamla Hills", "Habibganj", "Ayodhya Nagar"],
    nearbyCities: ["indore", "nagpur"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "COPD & Pulmonary Rehabilitation", "Knee Replacement Rehabilitation"],
    heroHeading: "Knee and Breathing Physiotherapy from Bhopal",
    seoTitle: "Knee & Breathing Physiotherapy Care from Bhopal",
    seoDescription: "Choose online physiotherapy from Bhopal for stroke, surgery, neurological, knee, or breathing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "indore",
    name: "Indore",
    state: "Madhya Pradesh",
    region: "Central India",
    nearby: ["Vijay Nagar", "Scheme 78", "AB Road", "Palasia", "Bhanwarkuan", "Rau"],
    nearbyCities: ["bhopal"],
    conditions: ["Post-Surgery Rehabilitation", "Stroke Rehabilitation", "Neurological Physiotherapy", "Cardiopulmonary Rehabilitation", "Geriatric Rehabilitation"],
    heroHeading: "Heart and Ageing Physiotherapy from Indore",
    seoTitle: "Heart & Ageing Physiotherapy Care from Indore",
    seoDescription: "Request online physiotherapy from Indore for surgery, stroke, neurological, heart, mobility, or ageing recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "patna",
    name: "Patna",
    state: "Bihar",
    region: "East India",
    nearby: ["Boring Road", "Patliputra Colony", "Kankarbagh", "Rajendra Nagar", "Fraser Road", "Bailey Road"],
    nearbyCities: ["ranchi"],
    conditions: ["Stroke Rehabilitation", "Neurological Rehabilitation", "Post-Surgery Rehabilitation", "COPD & Pulmonary Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Post-Surgery Physiotherapy and Breathing Care from Patna",
    seoTitle: "Post-Surgery & Breathing Physiotherapy from Patna",
    seoDescription: "Start online physiotherapy from Patna for stroke, surgery, neurological, breathing, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "ranchi",
    name: "Ranchi",
    state: "Jharkhand",
    region: "East India",
    nearby: ["Doranda", "Kanke Road", "Harmu", "Bariatu", "Lalpur", "Ashok Nagar"],
    nearbyCities: ["kolkata", "patna", "bhubaneswar"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Orthopaedic Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Orthopaedic Physiotherapy and Functional Ageing Care from Ranchi",
    seoTitle: "Orthopaedic & Ageing Physiotherapy from Ranchi",
    seoDescription: "Choose online physiotherapy from Ranchi for stroke, surgery, neurological, orthopaedic, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "bhubaneswar",
    name: "Bhubaneswar",
    state: "Odisha",
    region: "East India",
    nearby: ["Saheed Nagar", "Patia", "Nayapalli", "Chandrasekharpur", "Acharya Vihar", "Unit 4"],
    nearbyCities: ["kolkata", "ranchi", "visakhapatnam"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Physiotherapy", "COPD & Pulmonary Rehabilitation", "Geriatric Rehabilitation"],
    heroHeading: "Breathing Physiotherapy and Ageing Care from Bhubaneswar",
    seoTitle: "Breathing & Ageing Physiotherapy from Bhubaneswar",
    seoDescription: "Access online physiotherapy from Bhubaneswar for stroke, surgery, neurological, breathing, or ageing recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "dehradun",
    name: "Dehradun",
    state: "Uttarakhand",
    region: "North India",
    nearby: ["Rajpur Road", "Prem Nagar", "Raipur Road", "Clement Town", "Ballupur", "Chakrata Road"],
    nearbyCities: ["haridwar"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "COPD & Pulmonary Rehabilitation", "Geriatric Physiotherapy"],
    heroHeading: "Parkinson's and Post-Surgery Physiotherapy in Dehradun",
    seoTitle: "Neurological & Breathing Physiotherapy from Dehradun",
    seoDescription: "Request online physiotherapy from Dehradun for stroke, surgery, neurological, breathing, or ageing recovery. Homecare requests are checked by locality and date.",
  },
  {
    slug: "haridwar",
    name: "Haridwar",
    state: "Uttarakhand",
    region: "North India",
    nearby: ["Jwalapur", "Shivalik Nagar", "Sidcul", "Ranipur", "Kankhal", "Roshnabad"],
    nearbyCities: ["dehradun"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Physiotherapy", "Geriatric Rehabilitation", "Orthopaedic Rehabilitation"],
    heroHeading: "Orthopaedic Physiotherapy and Balance Care from Haridwar",
    seoTitle: "Orthopaedic & Ageing Physiotherapy from Haridwar",
    seoDescription: "Choose online physiotherapy from Haridwar for stroke, surgery, neurological, ageing, or orthopaedic recovery. Homecare requests are checked by locality.",
  },
  {
    slug: "jammu",
    name: "Jammu",
    state: "Jammu & Kashmir",
    region: "North India",
    nearby: ["Gandhi Nagar", "Trikuta Nagar", "Bakshi Nagar", "Sainik Colony", "Talab Tillo", "Nanak Nagar"],
    nearbyCities: ["chandigarh"],
    conditions: ["Stroke Rehabilitation", "Post-Surgery Rehabilitation", "Neurological Rehabilitation", "Orthopaedic Rehabilitation", "Cardiopulmonary Rehabilitation"],
    heroHeading: "Heart Physiotherapy and Orthopaedic Care from Jammu",
    seoTitle: "Heart & Orthopaedic Physiotherapy Care from Jammu",
    seoDescription: "Start online physiotherapy from Jammu for stroke, surgery, neurological, heart, or orthopaedic recovery. Homecare requests are checked by locality and date.",
  },
];

// City-level home visits and online consultations are available in every
// listed city. This is intentionally independent of indexability and of the
// response window, which remains based on the established routing network.
const HOMECARE_CITY_SLUGS = new Set(authoredCities.map((city) => city.slug));
const TWELVE_HOUR_HOMECARE_CITY_SLUGS = new Set([
  "bengaluru",
  "jaipur",
  "faridabad",
  "gurgaon",
  "mumbai",
  "moradabad",
  "tigaon",
  "delhi",
]);
export const cities: CityData[] = authoredCities.map((city) => ({
  ...city,
  indexable: true,
}));

export function hasVerifiedHomecareCoverage(
  city: Pick<CityData, "slug">,
): boolean {
  return HOMECARE_CITY_SLUGS.has(city.slug);
}

export function getIndexableCitySlugs(cityList: readonly CityData[] = cities): string[] {
  return cityList
    .filter((city) => city.indexable === true)
    .map((city) => city.slug);
}

export function getCityIndexabilityValidationErrors(
  cityList: readonly CityData[] = cities,
): string[] {
  const errors: string[] = [];
  const seenSlugs = new Set<string>();

  for (const city of cityList) {
    if (!city.slug.trim()) {
      errors.push("city has an empty slug");
    } else if (seenSlugs.has(city.slug)) {
      errors.push(`duplicate city slug "${city.slug}"`);
    } else {
      seenSlugs.add(city.slug);
    }

    if (!city.name.trim()) {
      errors.push(`city "${city.slug}" is missing a name`);
    }
    if (!city.state.trim()) {
      errors.push(`city "${city.slug}" is missing a state`);
    }
    if (city.administrativeType === "union-territory" && city.state === "Punjab") {
      errors.push(`city "${city.slug}" incorrectly uses Punjab for a Union Territory`);
    }
    if (city.nearby.length === 0) {
      errors.push(`city "${city.slug}" is missing nearby areas`);
    }
    if (city.conditions.length === 0) {
      errors.push(`city "${city.slug}" is missing conditions`);
    }
  }

  return errors;
}

export function getCityBySlug(slug: string): CityData | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getCitySeoMetadata(
  city: Pick<CityData, "slug" | "name" | "nearby" | "seoTitle">,
): { title: string; description: string } {
  const hasHomecareCoverage = hasVerifiedHomecareCoverage(city);
  const baseDescription = `Home visits and online physiotherapy are available in ${city.name}. Share your exact locality; clinician availability is confirmed before booking.`;
  const cityDescriptionOptions = [
    `${baseDescription} Ask about care.`,
    `${baseDescription} Enquire.`,
    `${baseDescription} Ask first.`,
    `${baseDescription} Now.`,
    baseDescription,
  ];
  const activeDescription =
    cityDescriptionOptions.find((value) => {
      const length = Array.from(value).length;
      return length >= 150 && length <= 155;
    }) ?? baseDescription;

  return {
    title: hasHomecareCoverage
      ? city.seoTitle && !/^online physiotherapy/i.test(city.seoTitle)
        ? city.seoTitle
        : `Physiotherapist at Home in ${city.name} | Goswami Rehab`
      : `Home Physiotherapy and Online Care in ${city.name} | Goswami Rehab`,
    description: activeDescription,
  };
}

export type BookingSessionMode = "home" | "telehealth";

export function getCityConfirmationWindowHours(slug?: string): 12 | 24 {
  return TWELVE_HOUR_HOMECARE_CITY_SLUGS.has(slug ?? "") ? 12 : 24;
}

export function getConfirmationWindowText(
  slug?: string,
  mode: BookingSessionMode = "home",
): string {
  if (mode === "telehealth") {
    return "the same day, usually within 6 hours and no later than 12 hours";
  }

  return `within ${getCityConfirmationWindowHours(slug)} hours`;
}
