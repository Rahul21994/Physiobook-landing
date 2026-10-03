type Service = {
  id: string;
  title: string;
  description: string;
};

import { cityJournalPosts } from "./city-journal";
import { resolveArticlePricing } from "./article-pricing";
import {
  BLOG_AUTHOR,
  BLOG_AUTHOR_PROFILE,
  BLOG_NUTRITION_AUTHOR_PROFILE,
  BLOG_REVIEWER_PROFILE,
  type BlogAuthorProfile,
} from "./content-profiles";

export {
  BLOG_AUTHOR,
  BLOG_AUTHOR_PROFILE,
  BLOG_NUTRITION_AUTHOR_PROFILE,
  BLOG_REVIEWER_PROFILE,
};
export type { BlogAuthorProfile } from "./content-profiles";

export type ClinicalSource = {
  title: string;
  publisher: string;
  url: string;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  excerpt: string;
  date: string;
  isoDate: string;
  dateModified?: string;
  updatedAt?: string;
  updated?: string;
  author: string;
  category: string;
  image: string;
  content: string;
  sources?: ClinicalSource[];
  authorProfile?: BlogAuthorProfile;
  presentation?: "nutrition-guidance";
};

export function getBlogArticleTitle(post: Pick<BlogPost, "title">): string {
  return post.title.replace(/\s+/g, " ").trim();
}

export function getBlogAuthorProfile(post: Pick<BlogPost, "authorProfile">): BlogAuthorProfile {
  return post.authorProfile ?? BLOG_AUTHOR_PROFILE;
}

// Article content uses ### for top-level sections and #### for nested subsections.
// The blog renderer maps these markers to H2 and H3 respectively.
const serviceAndNewBlogCatalog: Array<Service | BlogPost> = [
  {
    id: "physio-session",
    title: "Homecare Physiotherapy",
    description: "Expert one-on-one physiotherapy at your home in 45 listed cities for pain relief, injury recovery, and restoring full movement. Exact-locality and clinician availability are confirmed before visits."
  },
  {
    id: "cardiopulmonary-rehab",
    title: "Cardiopulmonary Rehabilitation",
    description: "Specialised breathing, cardiac, and pulmonary rehabilitation for COPD, post-bypass recovery, heart failure, and respiratory conditions — delivered at home."
  },
  {
    id: "advanced-complex-recovery",
    title: "Advanced Complex Case Recovery",
    description: "Comprehensive rehabilitation for complex neurological, multi-system, and post-ICU cases. Expert physiotherapy support for stroke rehabilitation, brain injury rehabilitation, Guillain-Barré rehabilitation, and spinal rehabilitation."
  },
  {
    id: "assessment-protocols",
    title: "Clinical Assessment & Evaluation",
    description: "Standardised physiotherapy assessments including functional movement screening, neurological evaluation, musculoskeletal grading, and outcome tracking."
  },
  {
    id: "sports-enhancement",
    title: "Sports Enhancement Consultation",
    description: "Optimise your athletic performance through biomechanical analysis, movement screening, and sport-specific conditioning programs."
  },
  {
    id: "functional-training",
    title: "Functional Training",
    description: "Build strength and movement patterns that carry over to everyday life and sport. Train the way your body is designed to move."
  },
  {
    id: "nutritional-consultation",
    title: "Nutritional Consultation",
    description: "Fuel your recovery and performance with personalised nutrition guidance aligned with your rehabilitation and training goals."
  },
  {
    id: "general-consultation",
    title: "General Consultation",
    description: "Not sure where to start? A comprehensive initial assessment to understand your condition and map out the right path forward."
  },
  {
    id: "rehabilitation",
    title: "Rehabilitation Programs",
    description: "Structured, progressive physiotherapy rehabilitation programmes for post-surgery and injury recovery — designed around safe mobility, strength, and everyday function."
  },
  {
    id: "pregnancy-postpartum-support",
    title: "Pregnancy and Postpartum Support",
    description: "Individualised physiotherapy, general nutrition education, and exercise support during pregnancy and after birth, with appropriate clinical coordination."
  },
  {
    id: "infant-early-development-physiotherapy",
    title: "Infant and Early-Development Physiotherapy Enquiry",
    description: "A clinician-reviewed enquiry pathway for infant and early-development physiotherapy, with suitability and matching considered first."
  },
  {
    id: "pediatric-disability-rehabilitation",
    title: "Pediatric Disability Rehabilitation",
    description: "Family-centred physiotherapy around movement, play, daily routines, and participation, with individual goals and coordination."
  },
  {
    id: "21",
    slug: "physiotherapy-for-low-back-pain",
    title: "Low Back Pain: How Physiotherapy Assessment and Treatment Help",
    excerpt: "A practical guide to assessment, exercise, pacing, and warning signs for people using physiotherapy to manage low back pain.",
    date: "August 26, 2026",
    isoDate: "2026-08-26",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Low back pain can come from irritated joints, muscles, discs, reduced conditioning, or several factors together. A physiotherapist does not treat an MRI report alone: the assessment connects your symptoms with movement, strength, nerve function, daily activities, and your goals.

### What Happens in an Assessment?

Your physiotherapist will ask when the pain began, what makes it better or worse, whether it travels into the leg, and how it affects sleep, walking, lifting, and work. They may check spinal movement, hip movement, lower-limb strength, sensation, reflexes, balance, and functional tasks such as sitting-to-standing.

### How Physiotherapy Helps

Treatment is usually active and progressive. It may include education about staying safely active, graded mobility exercises, trunk and hip strengthening, movement retraining, manual techniques when appropriate, and a home program matched to your current ability. The correct exercise depends on your examination; a painful exercise should not be continued simply because it is popular online.

### Managing Activity Between Sessions

Short, regular walks and changing position frequently are often more useful than prolonged bed rest. Start with a tolerable amount, monitor how you feel later that day and the next morning, and increase gradually. Your physiotherapist can modify lifting, sleep, and work positions without asking you to avoid normal movement forever.

Seek urgent medical assessment for new bladder or bowel changes, numbness around the groin, rapidly worsening leg weakness, fever with severe back pain, major trauma, or unexplained weight loss. This guide is educational and does not replace an examination.

**Textbook basis:** Principles are synthesised from Kisner & Colby’s *Therapeutic Exercise*, O’Sullivan’s *Physical Rehabilitation*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  },
  {
    id: "22",
    slug: "sciatica-physiotherapy-treatment-guide",
    title: "Sciatica: What Physiotherapy Can and Cannot Treat",
    excerpt: "Understand leg pain related to the lower back, what a physiotherapist checks, and how treatment is progressed safely.",
    date: "August 24, 2026",
    isoDate: "2026-08-24",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Sciatica describes pain or altered sensation travelling from the lower back or buttock into the leg, commonly along the distribution of a lumbar nerve root. Not every leg pain is sciatica, so an accurate examination is important before choosing exercises.

### What Your Physiotherapist Checks

Assessment may include the pattern of pain, pins and needles or numbness, muscle strength, reflexes, sensation, walking, spinal movement, and nerve sensitivity tests. The physiotherapist also checks whether symptoms are improving, stable, or becoming more neurologically concerning.

### Treatment Goals

The early goals are to reduce irritability, maintain safe movement, protect strength, and help you return to ordinary activities. Depending on the findings, treatment can include education, comfortable positions, repeated movements, walking, trunk and hip conditioning, neural mobility, and gradual functional loading. Exercises are adjusted according to your response rather than prescribed as a fixed list.

### What It Cannot Do

Physiotherapy cannot promise that every disc change will disappear or that pain will stop immediately. It can help many people improve movement, function, confidence, and symptom control, but persistent or worsening neurological signs need medical review.

Urgent assessment is needed for new bladder or bowel difficulty, saddle numbness, severe or progressive weakness, or symptoms in both legs. Do not delay care while trying online exercises.

**Textbook basis:** Principles are synthesised from O’Sullivan’s *Physical Rehabilitation*, Magee’s *Orthopedic Physical Assessment*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  },
  {
    id: "23",
    slug: "neck-pain-cervical-stiffness-physiotherapy",
    title: "Neck Pain and Cervical Stiffness: A Safe Physiotherapy Guide",
    excerpt: "Learn how physiotherapy assesses neck pain, builds movement and strength, and adapts treatment for work and daily activities.",
    date: "August 22, 2026",
    isoDate: "2026-08-22",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Neck pain may be related to muscle loading, joint stiffness, sustained positions, headache disorders, nerve irritation, or injury. The same exercise is not suitable for every cause, which is why assessment comes before a home program.

### Physiotherapy Assessment

Your physiotherapist may review pain behaviour, headaches, arm symptoms, posture during real tasks, neck and upper-back movement, shoulder function, strength, sensation, and reflexes. They also screen for signs that require medical referral.

### Treatment and Home Practice

A plan may combine comfortable range-of-motion work, deep neck and shoulder-blade strengthening, upper-back mobility, breathing and relaxation strategies, manual treatment when appropriate, and gradual exposure to work or household tasks. Short movement breaks are usually more useful than trying to hold one “perfect” posture all day.

Avoid forceful self-manipulation and exercises that cause spreading arm pain, increasing numbness, or new weakness. Seek urgent care after significant trauma or with severe headache, dizziness, visual or speech changes, difficulty walking, fever, or progressive arm weakness.

**Textbook basis:** Principles are synthesised from Kisner & Colby’s *Therapeutic Exercise*, Magee’s *Orthopedic Physical Assessment*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  },
  {
    id: "24",
    slug: "knee-osteoarthritis-physiotherapy-guide",
    title: "Knee Osteoarthritis: Exercise-Based Physiotherapy and Rehabilitation",
    excerpt: "A clear guide to strengthening, walking, pacing, and function-focused physiotherapy for knee osteoarthritis.",
    date: "August 20, 2026",
    isoDate: "2026-08-20",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Knee osteoarthritis can cause pain, stiffness, swelling, and reduced confidence with stairs or walking. Physiotherapy focuses on improving what you can do, not only on the appearance of an X-ray.

### What Is Assessed?

The physiotherapist checks pain and swelling, knee movement, quadriceps and hip strength, walking, balance, stairs, footwear, activity levels, and barriers in your home. Goals might include walking to the bathroom safely, climbing stairs, or returning to a valued activity.

### Why Exercise Matters

Progressive strengthening helps the muscles support daily tasks. Programs commonly use quadriceps and hip strengthening, mobility work, balance practice, and graded walking or cycling. The starting level may be seated or assisted; resistance and repetitions increase as control improves.

Some discomfort during exercise can be acceptable, but marked swelling, sharp pain, or a clear worsening that does not settle should be reported. Weight management, sleep, pacing, and suitable walking aids may also support treatment. Surgery is not the only treatment option, but medical review is appropriate when pain or function continues to deteriorate.

**Textbook basis:** Principles are synthesised from Kisner & Colby’s *Therapeutic Exercise*, O’Sullivan’s *Physical Rehabilitation*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  },
  {
    id: "25",
    slug: "frozen-shoulder-physiotherapy-treatment",
    title: "Frozen Shoulder: Restoring Movement in Each Recovery Stage",
    excerpt: "Understand the painful, stiff, and recovery stages of frozen shoulder and how physiotherapy adjusts treatment over time.",
    date: "August 18, 2026",
    isoDate: "2026-08-18",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Frozen shoulder, or adhesive capsulitis, commonly causes gradually increasing pain followed by substantial loss of shoulder movement. Reaching overhead, dressing, fastening clothing, and sleeping on the affected side may become difficult.

### Assessment

Your physiotherapist compares active and assisted movement, checks the neck and shoulder blade, measures functional limits, and asks about diabetes, thyroid disease, injury, or surgery. Similar symptoms can come from other shoulder conditions, so diagnosis should not be assumed from stiffness alone.

### How Treatment Changes

When pain is highly irritable, treatment usually prioritises comfortable movement, sleep and activity advice, and avoiding repeated forceful stretching. As irritability settles, longer gentle stretches, assisted movement, and progressive strengthening can be introduced. Later treatment focuses on reaching, lifting, dressing, and work tasks.

Recovery can be gradual. Pushing aggressively into sharp pain can increase irritability, while doing too little may maintain fear and stiffness. A physiotherapist can coordinate care with a doctor if pain control or diagnosis needs review.

**Textbook basis:** Principles are synthesised from Kisner & Colby’s *Therapeutic Exercise*, Magee’s *Orthopedic Physical Assessment*, and O’Sullivan’s *Physical Rehabilitation*.`
  },
  {
    id: "26",
    slug: "ankle-sprain-rehabilitation-guide",
    title: "Ankle Sprain Rehabilitation: When to Rest, Move, and Strengthen",
    excerpt: "A step-by-step physiotherapy guide for swelling, walking, strength, balance, and return to activity after an ankle sprain.",
    date: "August 16, 2026",
    isoDate: "2026-08-16",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `An ankle sprain damages one or more ligaments, often after the foot rolls inward. Severity varies from a mild stretch to a significant tear. Early treatment aims to protect the injury while avoiding unnecessary loss of movement and strength.

### Early Rehabilitation

Your physiotherapist checks weight-bearing, swelling, bruising, ankle movement, tenderness, and whether a fracture or more serious injury needs medical assessment. Depending on severity, support such as a brace or crutches may be used temporarily. Gentle movement and walking within the advised limits help prevent stiffness.

### Progressing Treatment

As walking becomes easier, treatment usually progresses to calf and ankle strengthening, controlled single-leg loading, balance, and task-specific drills. Returning to running or sport should follow strength, movement, balance, and symptom criteria rather than a calendar date alone.

Seek medical assessment if you cannot take four steps, pain is directly over a bone, swelling or pain is severe, the foot is numb or cold, or recovery is not progressing. Repeated sprains may need a longer balance and strength program.

**Textbook basis:** Principles are synthesised from Magee’s *Orthopedic Physical Assessment*, Kisner & Colby’s *Therapeutic Exercise*, and O’Sullivan’s *Physical Rehabilitation*.`
  },
  {
    id: "27",
    slug: "plantar-fasciitis-physiotherapy-guide",
    title: "Plantar Fasciitis: Physiotherapy for Heel Pain and Walking Comfort",
    excerpt: "Learn how physiotherapy approaches first-step heel pain with load management, calf flexibility, strength, and footwear advice.",
    date: "August 14, 2026",
    isoDate: "2026-08-14",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Plantar heel pain is often worst with the first steps after sleep or rest and may ease as you move. The plantar fascia, calf complex, foot strength, footwear, activity changes, and body weight can all influence the load on the heel.

### What Physiotherapy Checks

Assessment includes the exact pain location, walking and standing demands, ankle and big-toe movement, calf strength and flexibility, foot control, footwear, training errors, and medical factors that may mimic heel pain.

### Treatment Plan

A physiotherapist may recommend temporary load modification, calf and plantar-foot mobility, progressive calf and foot strengthening, comfortable footwear, and a gradual return to longer walks or exercise. Consistency matters more than aggressive stretching. Improvement is commonly measured by easier first steps, longer comfortable walking, and improved strength.

Numbness, burning, marked night pain, unexplained swelling, sudden injury, or failure to improve should prompt reassessment because not all heel pain is plantar fasciitis.

**Textbook basis:** Principles are synthesised from Magee’s *Orthopedic Physical Assessment*, Kisner & Colby’s *Therapeutic Exercise*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  },
  {
    id: "28",
    slug: "physiotherapy-after-fracture-recovery",
    title: "Physiotherapy After a Fracture: Regaining Range, Strength, and Function",
    excerpt: "What to expect from physiotherapy after a fracture, including protection, stiffness management, strength, and return to daily tasks.",
    date: "August 12, 2026",
    isoDate: "2026-08-12",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Fracture rehabilitation depends on the bone involved, alignment, fixation, soft-tissue injury, healing on imaging, and the restrictions set by the orthopaedic team. Physiotherapy must respect those restrictions; strengthening or weight-bearing is progressed only when medically appropriate.

### Stages of Rehabilitation

During protection, treatment may focus on swelling control, safe transfers, maintaining movement in unaffected joints, and using a prescribed sling, brace, walker, or crutches. Once movement is allowed, the focus expands to restoring range, reducing stiffness, rebuilding muscle, and relearning useful tasks.

### Making Progress Safely

Progress can be measured through movement, grip or leg strength, walking distance, stairs, dressing, work, and confidence. Pain, swelling, wound changes, altered sensation, or sudden loss of function should be reported rather than pushed through. A home visit can identify barriers such as stairs, low chairs, or unsafe bathroom transfers.

Do not remove a cast, change weight-bearing, or begin resistance exercises without the treating medical team’s instructions.

**Textbook basis:** Principles are synthesised from O’Sullivan’s *Physical Rehabilitation*, Kisner & Colby’s *Therapeutic Exercise*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  },
  {
    id: "29",
    slug: "walking-aids-walker-cane-crutches-guide",
    title: "Walking Aids Explained: Using a Walker, Cane, or Crutches Safely",
    excerpt: "A practical guide to choosing, fitting, and using common walking aids during physiotherapy and recovery at home.",
    date: "August 10, 2026",
    isoDate: "2026-08-10",
    author: "Goswami Rehab",
    category: "Homecare Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Walking aids reduce load, improve balance, or provide confidence while strength and control return. The correct aid depends on your weight-bearing restriction, balance, arm strength, home layout, and the task you need to perform.

### Fitting and Safety

Handles are generally positioned so the elbow is slightly bent when you stand upright, but a physiotherapist should fit the aid to you. Check rubber tips, locks, wheels, and height regularly. Wear supportive footwear, keep floors clear, and avoid carrying objects in your hands while using a walker or crutches.

### Basic Principles

Use the sequence taught by your physiotherapist. A cane is commonly held on the side opposite a painful or weak leg, while a walker or crutches may be needed when more support or reduced weight-bearing is required. Stairs require specific instruction; never guess the sequence after surgery or fracture.

Increasing pain, repeated near-falls, numbness, shoulder or wrist pain, or a device that feels unstable means the aid or technique needs review. The goal is safe independence, not using the aid for longer than necessary.

**Textbook basis:** Principles are synthesised from O’Sullivan’s *Physical Rehabilitation*, Kisner & Colby’s *Therapeutic Exercise*, and Magee’s *Orthopedic Physical Assessment*.`
  },
  {
    id: "30",
    slug: "first-physiotherapy-assessment-guide",
    title: "Your First Physiotherapy Assessment: Tests, Goals, and Home Exercises",
    excerpt: "Know what happens in a first physiotherapy visit and how assessment findings become a practical treatment plan.",
    date: "August 8, 2026",
    isoDate: "2026-08-08",
    author: "Goswami Rehab",
    category: "Homecare Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `A first physiotherapy assessment is more than a painful area check. It connects your symptoms, medical history, movement, strength, function, environment, and personal goals so treatment can be safe and measurable.

### What to Prepare

Bring medication and investigation details, surgery or hospital discharge papers, a list of concerns, and the activities you want to regain. At home, show the physiotherapist the bed, bathroom, stairs, chair, and walking route that matter in daily life.

### Common Assessment Areas

Depending on your condition, the physiotherapist may assess pain behaviour, range of motion, muscle strength, sensation, reflexes, breathing, balance, transfers, walking, stairs, and task-specific function. You should understand what is being tested and why.

### Turning Findings Into Treatment

The plan may include education, hands-on treatment where appropriate, exercises, walking or transfer practice, equipment advice, caregiver training, and a schedule for review. Good goals describe function—for example, standing from a chair independently—not only a pain score.

Ask how often to practise, what level of discomfort is acceptable, what symptoms require a call, and how progress will be measured. A home program should be specific to your assessment, not copied from a generic video.

**Textbook basis:** Principles are synthesised from O’Sullivan’s *Physical Rehabilitation*, Kisner & Colby’s *Therapeutic Exercise*, and Goodman & Fuller’s *Pathology for the Physical Therapist*.`
  }
];

export const services = serviceAndNewBlogCatalog.filter(
  (item): item is Service => !("slug" in item),
);
export const additionalBlogPosts = serviceAndNewBlogCatalog.filter(
  (item): item is BlogPost => "slug" in item,
);

export const appointmentTypes = [
  "General Consultation",
  "Clinical Assessment & Evaluation",
  "Homecare Physiotherapy Session",
  "Cardiopulmonary Rehabilitation",
  "Advanced Complex Case Recovery",
  "Sports Enhancement Consultation",
  "Nutritional Consultation",
  "Rehabilitation Program",
  "Antenatal/postpartum physiotherapy",
  "Pregnancy/postpartum nutrition support",
  "Pregnancy/postpartum exercise support",
  "Infant/pediatric physiotherapy enquiry",
  "Pediatric disability rehabilitation"
];

export const telehealthAppointmentTypes = [
  "Telehealth — Initial Assessment",
  "Telehealth — Follow-up Consultation",
  "Telehealth — Exercise Programme Review",
  "Telehealth — Post-Surgery Guidance",
  "Telehealth — Second Opinion / Case Review",
  "Antenatal/postpartum physiotherapy",
  "Pregnancy/postpartum nutrition support",
  "Pregnancy/postpartum exercise support",
  "Infant/pediatric physiotherapy enquiry",
  "Pediatric disability rehabilitation"
];

const clinicalSourcesBySlug: Record<string, ClinicalSource[]> = {
  "physiotherapy-for-low-back-pain": [
    {
      title: "Low back pain and sciatica in over 16s: assessment and management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng59",
    },
    {
      title: "Back pain",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/back-pain/",
    },
  ],
  "sciatica-physiotherapy-treatment-guide": [
    {
      title: "Low back pain and sciatica in over 16s: assessment and management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng59",
    },
    {
      title: "Sciatica",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/sciatica/",
    },
  ],
  "neck-pain-cervical-stiffness-physiotherapy": [
    {
      title: "Neck pain",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/neck-pain/",
    },
  ],
  "knee-osteoarthritis-physiotherapy-guide": [
    {
      title: "Osteoarthritis in over 16s: diagnosis and management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng226",
    },
    {
      title: "Osteoarthritis",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/osteoarthritis/",
    },
  ],
  "frozen-shoulder-physiotherapy-treatment": [
    {
      title: "Frozen shoulder",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/frozen-shoulder/",
    },
  ],
  "ankle-sprain-rehabilitation-guide": [
    {
      title: "Sprains and strains",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/sprains-and-strains/",
    },
  ],
  "plantar-fasciitis-physiotherapy-guide": [
    {
      title: "Plantar fasciitis",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/plantar-fasciitis/",
    },
  ],
  "physiotherapy-after-fracture-recovery": [
    {
      title: "Fractures (broken bones)",
      publisher: "American Academy of Orthopaedic Surgeons (AAOS)",
      url: "https://medlineplus.gov/fractures.html",
    },
    {
      title: "Broken arm or wrist",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/broken-arm-or-wrist/",
    },
  ],
  "walking-aids-walker-cane-crutches-guide": [
    {
      title: "Physiotherapy",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/physiotherapy/",
    },
  ],
  "first-physiotherapy-assessment-guide": [
    {
      title: "Physiotherapy",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/physiotherapy/",
    },
  ],
  "stroke-rehabilitation-at-home": [
    {
      title: "Stroke rehabilitation in adults",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng236",
    },
    {
      title: "Stroke recovery",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/stroke/recovery/",
    },
  ],
  "knee-replacement-recovery-guide": [
    {
      title: "Knee replacement: recovery",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/knee-replacement/recovery/",
    },
  ],
  "parkinsons-physiotherapy-guide": [
    {
      title: "Parkinson’s disease in adults",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng71",
    },
    {
      title: "Physical therapy and Parkinson’s",
      publisher: "Parkinson’s Foundation",
      url: "https://www.parkinson.org/library/fact-sheets/physical-therapy",
    },
  ],
  "hip-replacement-homecare-physiotherapy": [
    {
      title: "Hip replacement: recovery",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/hip-replacement/recovery/",
    },
  ],
  "neurological-physiotherapy-brain-injury": [
    {
      title: "Head injury: assessment and early management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng232",
    },
    {
      title: "Minor traumatic brain injury",
      publisher: "North Bristol NHS Trust",
      url: "https://www.nbt.nhs.uk/our-services/a-z-services/emergency-department/ed-miu-patient-information/minor-traumatic-brain-injury-mtbi",
    },
  ],
  "occupational-therapy-homecare": [
    {
      title: "Occupational therapy",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/occupational-therapy/",
    },
  ],
  "guillain-barre-syndrome-recovery": [
    {
      title: "Guillain-Barré syndrome",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/guillain-barre-syndrome/",
    },
    {
      title: "Guillain-Barré syndrome",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/guillain-barre-syndrome/",
    },
  ],
  "copd-physiotherapy-management": [
    {
      title: "Chronic obstructive pulmonary disease in over 16s: diagnosis and management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng115",
    },
    {
      title: "Chronic obstructive pulmonary disease (COPD): treatment",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/chronic-obstructive-pulmonary-disease-copd/treatment/",
    },
  ],
  "rotator-cuff-surgery-rehabilitation": [
    {
      title: "Anatomy, Rotator Cuff",
      publisher: "NCBI Bookshelf (StatPearls)",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK441844/",
    },
  ],
  "cardiopulmonary-rehab-at-home": [
    {
      title: "Chronic obstructive pulmonary disease in over 16s: diagnosis and management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/ng115",
    },
    {
      title: "What is cardiac rehabilitation?",
      publisher: "American Heart Association",
      url: "https://www.heart.org/en/health-topics/cardiac-rehab/what-is-cardiac-rehabilitation",
    },
  ],
  "complex-case-recovery-physiotherapy": [
    {
      title: "Rehabilitation after critical illness in adults",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/cg83",
    },
  ],
  "physiotherapist-at-home-india-guide": [
    {
      title: "Physiotherapy",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/physiotherapy/",
    },
  ],
  "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1": [
    {
      title: "Lumbar Disc Herniation",
      publisher: "NCBI Bookshelf, National Library of Medicine",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK560878/",
    },
    {
      title: "Where do patients with MRI-confirmed single-level radiculopathy experience pain?",
      publisher: "Chiropractic & Manual Therapies / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6778979/",
    },
    {
      title: "Accuracy of physical examination for chronic lumbar radiculopathy",
      publisher: "BMC Musculoskeletal Disorders / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3716914/",
    },
    {
      title: "ACR Appropriateness Criteria® Low Back Pain: 2021 Update",
      publisher: "American College of Radiology / PubMed",
      url: "https://pubmed.ncbi.nlm.nih.gov/34794594/",
    },
    {
      title: "Low back pain and sciatica in over 16s: assessment and management",
      publisher: "National Institute for Health and Care Excellence (NICE)",
      url: "https://www.nice.org.uk/guidance/NG59",
    },
    {
      title: "Slipped disc",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/slipped-disc/",
    },
    {
      title: "The Essence of Clinical Practice Guidelines for Lumbar Disc Herniation, 2021: 4. Treatment",
      publisher: "Spine Surgery and Related Research / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9381073/",
    },
    {
      title: "Prognostic factors for treatment success of conservative management and role for physiotherapy in radicular pain caused by a lumbar disc herniation",
      publisher: "Systematic review / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC12657478/",
    },
  ],
  "diet-requirements-after-stroke": [
    {
      title: "Guidelines for Adult Stroke Rehabilitation and Recovery",
      publisher: "American Heart Association / American Stroke Association",
      url: "https://www.ahajournals.org/doi/full/10.1161/STR.0000000000000098",
    },
    {
      title: "European Stroke Organisation (ESO) guideline on diagnosis and management of post-stroke dysphagia",
      publisher: "European Stroke Organisation",
      url: "https://eso-stroke.org/wp-content/uploads/Manuscript_PSD_ESO_guideline_03092021.pdf",
    },
    {
      title: "Hydration and nutrition after stroke",
      publisher: "National Clinical Guideline for Stroke",
      url: "https://www.strokeguideline.org/chapter/activity-and-participation/hydration-and-nutrition",
    },
    {
      title: "Dysphagia and Stroke",
      publisher: "American Stroke Association",
      url: "https://www.stroke.org/en/about-stroke/effects-of-stroke/physical-effects/dysphagia",
    },
    {
      title: "Swallowing problems after a stroke",
      publisher: "Stroke Association",
      url: "https://www.stroke.org.uk/sites/default/files/publications/jn_2021-311.2_-_f05_swallowing_problems_after_a_stroke_a5_web.pdf",
    },
    {
      title: "Swallowing problems (dysphagia)",
      publisher: "NHS",
      url: "https://www.nhs.uk/symptoms/swallowing-problems-dysphagia",
    },
    {
      title: "Dietary Guidelines for Indians 2024",
      publisher: "ICMR–National Institute of Nutrition",
      url: "https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
    },
    {
      title: "My Plate for the Day",
      publisher: "ICMR–National Institute of Nutrition",
      url: "https://www.nin.res.in/downloads/My_Plate_English.pdf",
    },
    {
      title: "Nutrition and Kidney Disease (Stages 1–5, Not on Dialysis)",
      publisher: "National Kidney Foundation",
      url: "https://www.kidney.org/kidney-topics/nutrition-and-kidney-disease-stages-1-5-not-dialysis",
    },
    {
      title: "Considerations for people taking anticoagulants",
      publisher: "NHS",
      url: "https://www.nhs.uk/medicines/anticoagulants/considerations",
    },
  ],
  "diet-and-fat-loss": [
    {
      title: "Healthy diet",
      publisher: "World Health Organization",
      url: "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
    },
    {
      title: "Dietary Guidelines for Indians 2024",
      publisher: "ICMR–National Institute of Nutrition",
      url: "https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
    },
    {
      title: "My Plate for the Day",
      publisher: "ICMR–National Institute of Nutrition",
      url: "https://www.nin.res.in/downloads/My_Plate_English.pdf",
    },
    {
      title: "Steps for Losing Weight",
      publisher: "Centers for Disease Control and Prevention",
      url: "https://www.cdc.gov/healthy-weight-growth/losing-weight",
    },
    {
      title: "Healthy Eating and Physical Activity for Life",
      publisher: "National Institute of Diabetes and Digestive and Kidney Diseases",
      url: "https://www.niddk.nih.gov/health-information/weight-management/healthy-eating-physical-activity-for-life",
    },
    {
      title: "Physical activity",
      publisher: "World Health Organization",
      url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
    },
    {
      title: "Physical activity and diet | Overweight and obesity management",
      publisher: "National Institute for Health and Care Excellence",
      url: "https://www.nice.org.uk/guidance/NG246/chapter/physical-activity-and-diet",
    },
    {
      title: "Recommendations | Chronic pain in over 16s",
      publisher: "National Institute for Health and Care Excellence",
      url: "https://www.nice.org.uk/guidance/NG193/chapter/Recommendations",
    },
    {
      title: "WHO guidelines on physical activity and sedentary behaviour",
      publisher: "World Health Organization",
      url: "https://www.who.int/publications/i/item/9789240015128",
    },
  ],
  "skin-inflammation-vasculitis-diet-guide": [
    {
      title: "Cutaneous vasculitis",
      publisher: "British Association of Dermatologists Patient Hub",
      url: "https://www.skinhealthinfo.org.uk/condition/cutaneous-vasculitis",
    },
    {
      title: "Vasculitis - Symptoms",
      publisher: "National Heart, Lung, and Blood Institute (NIH)",
      url: "https://www.nhlbi.nih.gov/health/vasculitis/symptoms",
    },
    {
      title: "Cutaneous vasculitis: an algorithmic approach to diagnosis",
      publisher: "Frontiers in Medicine / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9532537",
    },
    {
      title: "Purpura: MedlinePlus Medical Encyclopedia",
      publisher: "U.S. National Library of Medicine",
      url: "https://medlineplus.gov/ency/article/003232.htm",
    },
    {
      title: "Dietary Elimination for the Treatment of Atopic Dermatitis: A Systematic Review and Meta-Analysis",
      publisher: "Journal of Allergy and Clinical Immunology / PubMed",
      url: "https://pubmed.ncbi.nlm.nih.gov/35987995",
    },
    {
      title: "Controversies in allergy: food testing and dietary avoidance in atopic dermatitis",
      publisher: "Journal of Allergy and Clinical Immunology in Practice / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC6312729",
    },
    {
      title: "Herb-Drug Interactions",
      publisher: "National Center for Complementary and Integrative Health (NIH)",
      url: "https://www.nccih.nih.gov/health/providers/digest/herb-drug-interactions",
    },
    {
      title: "Stevens-Johnson syndrome",
      publisher: "NHS",
      url: "https://www.nhs.uk/conditions/stevens-johnson-syndrome",
    },
    {
      title: "A Framework-Driven Systematic Review of the Barriers and Facilitators to Teledermatology Implementation",
      publisher: "JMIR Dermatology / PubMed Central",
      url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7658914",
    },
  ],
};

const BLOG_SEO_BY_SLUG: Record<string, Pick<BlogPost, "metaTitle" | "metaDescription">> = {
  "stroke-rehabilitation-at-home": { metaTitle: "Stroke Rehabilitation at Home Guide | Goswami Rehab", metaDescription: "Home physiotherapy can support movement, communication goals and independence after stroke. Learn what recovery may involve alongside your medical team." },
  "knee-replacement-recovery-guide": { metaTitle: "Knee Replacement Recovery Guide | Goswami Rehab", metaDescription: "Learn about staged physiotherapy, symptom monitoring and safe recovery after total knee replacement. Covers assessment, preparation, and safe next steps." },
  "parkinsons-physiotherapy-guide": { metaTitle: "Parkinson's Physiotherapy Guide | Goswami Rehab", metaDescription: "Physiotherapy can support movement, balance and daily participation for people with Parkinson's disease. Explore a structured homecare approach. Review." },
  "hip-replacement-homecare-physiotherapy": { metaTitle: "Hip Replacement Recovery | Goswami Rehab", metaDescription: "Home physiotherapy after hip replacement can support safe mobility, transfers and daily activities while following surgical precautions. Stay cautious." },
  "neurological-physiotherapy-brain-injury": { metaTitle: "Brain Injury Physiotherapy | Goswami Rehab", metaDescription: "Learn how homecare neurological physiotherapy can support recovery after traumatic brain injury alongside medical and neuropsychological care. Review." },
  "rotator-cuff-surgery-rehabilitation": { metaTitle: "Rotator Cuff Repair Rehab | Goswami Rehab", metaDescription: "Understand the staged physiotherapy phases after rotator cuff repair, including protection, mobility and questions for your care team. Note warning signs." },
  "occupational-therapy-homecare": { metaTitle: "Occupational Therapy at Home | Goswami Rehab", metaDescription: "See how occupational therapy at home can help neurological and orthopaedic patients rebuild daily-living skills and independence. Keep goals practical." },
  "guillain-barre-syndrome-recovery": { metaTitle: "Guillain-Barré Rehabilitation Guide | Goswami Rehab", metaDescription: "Learn how physiotherapy may support recovery from Guillain-Barré syndrome alongside medical management after weakness or ICU care. Keep goals practical." },
  "copd-physiotherapy-management": { metaTitle: "COPD Pulmonary Physiotherapy | Goswami Rehab", metaDescription: "Home pulmonary physiotherapy may support breathlessness management, pacing and daily activity for people living with COPD. Review pacing and symptoms." },
  "cardiopulmonary-rehab-at-home": { metaTitle: "Cardiopulmonary Rehab at Home | Goswami Rehab", metaDescription: "Learn how home cardiopulmonary rehabilitation may support breathing, cardiac recovery and safe activity alongside medical care. Review pacing and symptoms." },
  "complex-case-recovery-physiotherapy": { metaTitle: "Complex Case Physiotherapy | Goswami Rehab", metaDescription: "Explore advanced home physiotherapy for post-ICU weakness, multi-system conditions and complex neurological recovery. Review recovery goals and safety." },
  "physiotherapist-at-home-india-guide": { metaTitle: "Book Home Physiotherapy in India | Goswami Rehab", metaDescription: "Learn how to choose and book home physiotherapy in India, including sessions, costs, payment and what to expect. Check service fit before booking safely." },
  "physiotherapist-at-home-mumbai": { metaTitle: "Home Physiotherapy in Mumbai | Goswami Rehab", metaDescription: "What to know when booking home physiotherapy in Mumbai, including services, sessions and how to get started. Review practical safety steps before booking." },
  "physiotherapist-at-home-delhi": { metaTitle: "Post-Surgery Physiotherapy in Delhi | Goswami Rehab", metaDescription: "How home physiotherapy supports post-surgery recovery in Delhi when a home visit is appropriate. Ask about locality, visit details, and safe next steps." },
  "physiotherapist-at-home-bengaluru": { metaTitle: "Home Physiotherapy in Bengaluru | Goswami Rehab", metaDescription: "Explore home physiotherapy in Bengaluru for surgery recovery or neurological conditions when travel is difficult. Check service fit before booking safely." },
  "physiotherapist-at-home-hyderabad": { metaTitle: "Home Physiotherapy in Hyderabad | Goswami Rehab", metaDescription: "Learn what to expect from home physiotherapy in Hyderabad after discharge and how specialist rehabilitation can help. Review preparation before booking." },
  "physiotherapist-at-home-chennai": { metaTitle: "Home Physiotherapy in Chennai | Goswami Rehab", metaDescription: "Home physiotherapy in Chennai can reduce travel after surgery or for neurological rehabilitation when clinically appropriate. Review preparation steps." },
  "physiotherapist-at-home-kolkata": { metaTitle: "Home Physiotherapy in Kolkata | Goswami Rehab", metaDescription: "Explore specialist home physiotherapy in Kolkata for stroke, surgery and complex neurological recovery. Consider symptoms, pacing, and medical advice." },
  "physiotherapist-at-home-pune": { metaTitle: "Home Physiotherapy in Pune | Goswami Rehab", metaDescription: "Learn how home physiotherapy in Pune may support recovery after surgery, stroke or injury when travel is difficult. Review preparation before booking." },
  "physiotherapist-at-home-jaipur": { metaTitle: "Home Physiotherapy in Jaipur | Goswami Rehab", metaDescription: "Explore specialist home physiotherapy in Jaipur for neuro, orthopaedic and cardiopulmonary rehabilitation at home. Check service fit before booking safely." },
  "physiotherapy-for-low-back-pain": { metaTitle: "Low Back Pain Physiotherapy Guide | Goswami Rehab", metaDescription: "Learn how physiotherapy assesses low back pain and uses exercise, pacing and safety advice to support daily function. Review recovery goals and safety." },
  "sciatica-physiotherapy-treatment-guide": { metaTitle: "Sciatica Physiotherapy Guide | Goswami Rehab", metaDescription: "Understand what physiotherapy checks for sciatica, what it can treat and how care progresses safely. Covers assessment, preparation, and safe next steps." },
  "neck-pain-cervical-stiffness-physiotherapy": { metaTitle: "Neck Pain Physiotherapy Guide | Goswami Rehab", metaDescription: "Learn how physiotherapy assesses neck pain and cervical stiffness and builds movement for work and daily life. Review breathing and activity tolerance." },
  "knee-osteoarthritis-physiotherapy-guide": { metaTitle: "Knee Osteoarthritis Physiotherapy | Goswami Rehab", metaDescription: "A clear guide to exercise, pacing and function-focused physiotherapy for knee osteoarthritis without surgery. Review practical safety steps before booking." },
  "frozen-shoulder-physiotherapy-treatment": { metaTitle: "Frozen Shoulder Physiotherapy | Goswami Rehab", metaDescription: "Understand frozen shoulder recovery stages and how physiotherapy adapts treatment as movement returns. Covers assessment, preparation, and safe next steps." },
  "ankle-sprain-rehabilitation-guide": { metaTitle: "Ankle Sprain Rehabilitation | Goswami Rehab", metaDescription: "A step-by-step guide to physiotherapy after an ankle sprain, from swelling and walking to strength and balance. Review breathing and activity tolerance." },
  "plantar-fasciitis-physiotherapy-guide": { metaTitle: "Plantar Fasciitis Physiotherapy | Goswami Rehab", metaDescription: "Learn how physiotherapy approaches plantar fasciitis with load management, calf flexibility, strength and footwear advice. Review pacing and symptoms." },
  "physiotherapy-after-fracture-recovery": { metaTitle: "Physiotherapy After a Fracture | Goswami Rehab", metaDescription: "What to expect from physiotherapy after a fracture, including stiffness management, strength and return to daily tasks. Review recovery goals and safety." },
  "walking-aids-walker-cane-crutches-guide": { metaTitle: "Walking Aids Guide | Goswami Rehab", metaDescription: "Learn how to choose, fit and use a walker, cane or crutches safely during recovery at home. Covers fitting, safe technique, and warning signs for review." },
  "first-physiotherapy-assessment-guide": { metaTitle: "First Physiotherapy Assessment | Goswami Rehab", metaDescription: "Know what happens in a first physiotherapy assessment and how findings shape a practical treatment plan. Review practical safety steps before booking." },
  "hand-wrist-rehabilitation-tool-workers-faridabad": { metaTitle: "Hand & Wrist Rehab for Faridabad Workers | Goswami Rehab", metaDescription: "A physiotherapy guide to grip fatigue, wrist loading, work modification and safe return to tool-based tasks in Faridabad. Review goals with your team." },
  "balance-recovery-after-fall-faridabad": { metaTitle: "Balance Recovery After a Fall in Faridabad | Goswami Rehab", metaDescription: "Learn how physiotherapy, strength practice and a home safety review can support safer movement after a fall in Faridabad. Review goals with your team." },
  "wheelchair-skills-pressure-relief-faridabad": { metaTitle: "Wheelchair Skills at Home in Faridabad | Goswami Rehab", metaDescription: "A home rehabilitation guide to wheelchair positioning, transfers and pressure relief for people in Faridabad. Review practical safety steps before booking." },
  "vestibular-rehabilitation-dizziness-gurugram": { metaTitle: "Dizziness & Vestibular Rehab in Gurugram | Goswami Rehab", metaDescription: "What vestibular physiotherapy assesses, how balance exercises progress and which dizziness symptoms need review in Gurugram. Review pacing and symptoms." },
  "returning-to-running-after-acl-injury-gurugram": { metaTitle: "ACL Injury Running Rehab in Gurugram | Goswami Rehab", metaDescription: "A staged physiotherapy guide to strength, landing control and safe return-to-running decisions after ACL injury in Gurugram. Review pacing and symptoms." },
  "tennis-elbow-recovery-racquet-gym-gurugram": { metaTitle: "Tennis Elbow Recovery in Gurugram | Goswami Rehab", metaDescription: "A physiotherapy guide to outer-elbow pain, grip loading and returning to racquet or gym training in Gurugram. Review practical safety steps before booking." },
  "exercise-safely-jaipur-heat-rehabilitation": { metaTitle: "Safe Rehabilitation Exercise in Jaipur Heat | Goswami Rehab", metaDescription: "Plan rehabilitation around heat, hydration, exertion and warning signs when exercising at home in Jaipur. Review practical safety steps before booking." },
  "fall-proofing-home-balance-older-adults-jaipur": { metaTitle: "Fall Prevention & Balance Training in Jaipur | Goswami Rehab", metaDescription: "A practical guide to balance exercise, lighting, bathroom safety and confidence-building for older adults in Jaipur. Review recovery goals and safety." },
  "lymphedema-self-management-cancer-treatment-jaipur": { metaTitle: "Lymphedema Rehab After Cancer Care in Jaipur | Goswami Rehab", metaDescription: "A careful guide to swelling awareness, movement, skin care and compression conversations after cancer treatment in Jaipur. Review pacing and symptoms." },
  "tfcc-overuse-pain-rehabilitation-guide": { metaTitle: "TFCC Overuse Pain Rehab Guide | Goswami Rehab", metaDescription: "Learn how physiotherapy can assess TFCC-related wrist pain, settle irritability and progressively rebuild wrist strength for daily tasks, work or sport." },
  "pelvic-floor-physiotherapy-after-childbirth-delhi": { metaTitle: "Postnatal Pelvic Floor Physio in Delhi | Goswami Rehab", metaDescription: "A respectful guide to postnatal movement, pelvic-floor symptoms, breathing and gradual activity after childbirth in Delhi. Review pacing and symptoms." },
  "safer-patient-transfers-caregiver-delhi": { metaTitle: "Safer Patient Transfers at Home in Delhi | Goswami Rehab", metaDescription: "Learn safer bed-to-chair transfers, repositioning, equipment decisions and caregiver body mechanics at home in Delhi. Review recovery goals and safety." },
  "spinal-cord-injury-rehabilitation-home-delhi": { metaTitle: "Spinal Cord Injury Rehab at Home in Delhi | Goswami Rehab", metaDescription: "A practical guide to transfers, wheelchair mobility, skin protection and independence after spinal cord injury in Delhi. Review recovery goals and safety." },
  "keyboard-mouse-mobile-hand-pain-bengaluru-tech": { metaTitle: "Hand Pain Rehab for Bengaluru Tech Workers | Goswami Rehab", metaDescription: "A physiotherapy guide to hand and forearm loading, workstation changes and strengthening for Bengaluru tech workers. Review recovery goals and safety." },
  "returning-running-cycling-after-injury-bengaluru": { metaTitle: "Running & Cycling Injury Rehab in Bengaluru | Goswami Rehab", metaDescription: "How load, strength, terrain, bike position and recovery can be assessed when returning to sport in Bengaluru. Review practical safety steps before booking." },
  "hip-fracture-rehabilitation-home-bengaluru": { metaTitle: "Hip Fracture Rehab in Bengaluru | Goswami Rehab", metaDescription: "A homecare guide to transfers, walking progression, confidence, fall prevention and caregiver support after hip fracture in Bengaluru. Note warning signs." },
  "amputation-rehabilitation-home-tigaon": { metaTitle: "Amputation Rehabilitation at Home in Tigaon | Goswami Rehab", metaDescription: "A home rehabilitation guide to transfers, residual-limb care, prosthetic preparation and confidence after amputation in Tigaon. Review pacing and symptoms." },
  "home-physiotherapy-developmental-motor-delay-tigaon": { metaTitle: "Child Development Physiotherapy in Tigaon | Goswami Rehab", metaDescription: "How family routines, play-based movement and functional goals can support a child with motor delay in Tigaon. Review practical safety steps before booking." },
  "safer-squatting-lifting-floor-to-stand-tigaon": { metaTitle: "Safer Lifting & Squatting Rehab in Tigaon | Goswami Rehab", metaDescription: "A task-focused rehabilitation guide to squatting, lifting, floor-to-stand movement, pacing and physical work in Tigaon. Review recovery goals and safety." },
  "hand-injury-grip-rehabilitation-brass-workers-moradabad": { metaTitle: "Hand Injury & Grip Rehab in Moradabad | Goswami Rehab", metaDescription: "A staged physiotherapy guide to hand injury recovery, grip rebuilding, stiffness care and graded work re-entry in Moradabad. Review pacing and symptoms." },
  "breathing-work-endurance-metalworkers-moradabad": { metaTitle: "Breathing & Work Endurance in Moradabad | Goswami Rehab", metaDescription: "A safety-first physiotherapy guide to pacing, breathing strategies, endurance and medical review for metalworkers in Moradabad. Review pacing and symptoms." },
  "shoulder-elbow-load-management-craft-workers-moradabad": { metaTitle: "Shoulder & Elbow Rehab in Moradabad | Goswami Rehab", metaDescription: "A practical guide to shoulder and elbow capacity, repeated craft positions, micro-breaks and strengthening in Moradabad. Review recovery goals and safety." },
  "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1": { metaTitle: "Lumbar Disc Guide: L3-L4, L4-L5 & L5-S1 | Goswami Rehab", metaDescription: "A clinical guide to lumbar slipped-disc symptoms, common L3-L4, L4-L5 and L5-S1 patterns, assessment, rehabilitation and red flags. Keep goals practical." },
  "diet-requirements-after-stroke": { metaTitle: "Diet Requirements After Stroke | Goswami Rehab", metaDescription: "An evidence-informed guide to eating and drinking after stroke, swallowing safety, Indian food options, medical variation, and when to ask the care team." },
  "diet-and-fat-loss": { metaTitle: "Diet & Fat Loss Guide for Indian Households | Goswami Rehab", metaDescription: "A flexible, evidence-informed guide to diet and fat loss using familiar Indian foods, repeatable habits, movement, and individualized personal advice." },
  "skin-inflammation-vasculitis-diet-guide": { metaTitle: "Vasculitis & Skin Inflammation Nutrition | Goswami Rehab", metaDescription: "Nutritionist-led guidance on skin inflammation and vasculitis symptoms, balanced diet, supplement cautions, red flags, and when to seek clinical care." },
};

type CityGuideSeed = {
  slug: string;
  name: string;
  localities: string;
  focus: string;
};

// These guides give the remaining city pages a useful, cautious local reading link.
// Availability is intentionally described as something to confirm, not as a blanket coverage claim.
const CITY_GUIDE_SEEDS: CityGuideSeed[] = [
  { slug: "noida", name: "Noida", localities: "Sector 18, Noida Extension, and the expressway corridor", focus: "planning post-discharge rehabilitation around apartment access and family support" },
  { slug: "chandigarh", name: "Chandigarh", localities: "Sector 17, Sector 34, Manimajra, and nearby Tricity areas", focus: "organising home rehabilitation after surgery, stroke, or a hospital discharge" },
  { slug: "amritsar", name: "Amritsar", localities: "Ranjit Avenue, Majitha Road, and the areas around the city centre", focus: "making a practical recovery plan when clinic travel is tiring" },
  { slug: "ludhiana", name: "Ludhiana", localities: "Sarabha Nagar, Model Town, and the industrial belt", focus: "balancing recovery with household, work, and caregiver routines" },
  { slug: "kochi", name: "Kochi", localities: "Kakkanad, Edappally, Vyttila, and nearby Ernakulam areas", focus: "continuing mobility and daily-activity practice in the home environment" },
  { slug: "thiruvananthapuram", name: "Thiruvananthapuram", localities: "Kowdiar, Kazhakkoottam, and the city’s suburban areas", focus: "choosing safe next steps after neurological or orthopaedic care" },
  { slug: "kozhikode", name: "Kozhikode", localities: "Nadakkavu, Kottooli, and surrounding Kozhikode neighbourhoods", focus: "preparing for a first assessment and a measurable home exercise plan" },
  { slug: "visakhapatnam", name: "Visakhapatnam", localities: "MVP Colony, Gajuwaka, Madhurawada, and nearby areas", focus: "supporting function at home after surgery or a neurological event" },
  { slug: "nagpur", name: "Nagpur", localities: "Dharampeth, Manish Nagar, Wardha Road, and nearby neighbourhoods", focus: "building a paced rehabilitation routine around fatigue, transport, and daily tasks" },
  { slug: "guwahati", name: "Guwahati", localities: "Dispur, Beltola, Six Mile, and nearby city areas", focus: "making home practice relevant to transfers, walking, and household routines" },
  { slug: "coimbatore", name: "Coimbatore", localities: "RS Puram, Saibaba Colony, Peelamedu, and surrounding areas", focus: "returning to everyday mobility with an assessment-led home programme" },
  { slug: "madurai", name: "Madurai", localities: "KK Nagar, Anna Nagar, Tallakulam, and nearby neighbourhoods", focus: "understanding what families should prepare before a home physiotherapy visit" },
  { slug: "mysuru", name: "Mysuru", localities: "Vijayanagar, Kuvempunagar, Jayalakshmipuram, and nearby areas", focus: "working on balance, strength, and safe daily movement after discharge" },
  { slug: "mangaluru", name: "Mangaluru", localities: "Kadri, Bejai, Kottara, and nearby coastal neighbourhoods", focus: "coordinating home rehabilitation with hospital follow-up and family care" },
  { slug: "ahmedabad", name: "Ahmedabad", localities: "Satellite, Vastrapur, Bopal, and the wider Ahmedabad area", focus: "reducing avoidable travel while keeping rehabilitation linked to medical advice" },
  { slug: "surat", name: "Surat", localities: "Adajan, Vesu, Katargam, and nearby Surat neighbourhoods", focus: "turning a home assessment into clear, realistic daily goals" },
  { slug: "vadodara", name: "Vadodara", localities: "Alkapuri, Gotri, Manjalpur, and surrounding areas", focus: "supporting mobility and independence in the spaces a person uses every day" },
  { slug: "lucknow", name: "Lucknow", localities: "Gomti Nagar, Aliganj, Indira Nagar, and nearby areas", focus: "planning post-surgery and neurological rehabilitation without overpromising timelines" },
  { slug: "kanpur", name: "Kanpur", localities: "Swaroop Nagar, Kakadeo, Civil Lines, and nearby areas", focus: "deciding what information and equipment may help at the first visit" },
  { slug: "varanasi", name: "Varanasi", localities: "Lanka, Sigra, Mahmoorganj, and surrounding neighbourhoods", focus: "connecting rehabilitation exercises with walking, transfers, and daily routines" },
  { slug: "agra", name: "Agra", localities: "Sanjay Place, Kamla Nagar, Sikandra, and nearby areas", focus: "supporting recovery at home when stairs, transport, or fatigue make travel difficult" },
  { slug: "prayagraj", name: "Prayagraj", localities: "Civil Lines, George Town, Naini, and nearby areas", focus: "setting safe, reviewable goals for mobility and functional recovery" },
  { slug: "jodhpur", name: "Jodhpur", localities: "Sardarpura, Ratanada, Pal Road, and nearby neighbourhoods", focus: "adapting home exercises to the person’s space, routine, and energy" },
  { slug: "udaipur", name: "Udaipur", localities: "Hiran Magri, Shobhagpura, Fatehpura, and nearby areas", focus: "helping families prepare for transfers, walking practice, and caregiver guidance" },
  { slug: "ajmer", name: "Ajmer", localities: "Vaishali Nagar, Civil Lines, Panchsheel Nagar, and nearby areas", focus: "understanding when home physiotherapy may be a suitable format to discuss" },
  { slug: "bhopal", name: "Bhopal", localities: "Arera Colony, Kolar Road, Shahpura, and nearby areas", focus: "building a consistent rehabilitation routine after hospital-based care" },
  { slug: "indore", name: "Indore", localities: "Vijay Nagar, Saket, Rau, and nearby neighbourhoods", focus: "combining home practice with specialist review for surgery, stroke, or pain" },
  { slug: "patna", name: "Patna", localities: "Kankarbagh, Rajendra Nagar, Bailey Road, and nearby areas", focus: "making recovery goals clear for the patient and the people supporting them" },
  { slug: "ranchi", name: "Ranchi", localities: "Morabadi, Harmu, Bariatu, and nearby areas", focus: "planning safe movement practice around the home and the person’s current ability" },
  { slug: "bhubaneswar", name: "Bhubaneswar", localities: "Sahid Nagar, Patia, Khandagiri, and nearby areas", focus: "using the home environment to practise meaningful daily activities" },
  { slug: "dehradun", name: "Dehradun", localities: "Rajpur Road, Jakhan, Ballupur, and nearby areas", focus: "preparing a paced plan for strength, balance, and independence" },
  { slug: "haridwar", name: "Haridwar", localities: "Jwalapur, Kankhal, Ranipur, and nearby areas", focus: "supporting older adults and families with practical home mobility goals" },
  { slug: "jammu", name: "Jammu", localities: "Gandhi Nagar, Trikuta Nagar, Channi Himmat, and nearby areas", focus: "organising post-discharge rehabilitation with local availability checked first" },
];

function getCityGuideMetaDescription(cityName: string): string {
  const base = `A practical guide to home physiotherapy in ${cityName}, including first-visit preparation, local availability, and safe recovery planning.`;
  const additions = [
    " Ask.",
    " Review safety.",
    " Ask questions.",
    " Plan safely.",
    " Review care.",
    " Review safe care.",
    " Review safe care now.",
    " Consider safety.",
    " Includes safety planning.",
    " Includes practical safety steps.",
    " Covers preparation and safety.",
    " Covers preparation, safety, and review.",
  ];
  const result = [base, ...additions]
    .map((addition) => `${base}${addition}`)
    .find((description) => {
      const length = Array.from(description).length;
      return length >= 150 && length <= 155;
    });
  if (!result) {
    throw new Error(`Unable to author a 150–155 character city guide description for ${cityName}.`);
  }
  return result;
}

const additionalCityGuidePosts: BlogPost[] = CITY_GUIDE_SEEDS.map((city, index) => ({
  id: `city-guide-${city.slug}`,
  slug: `physiotherapist-at-home-${city.slug}`,
  title: `Physiotherapy at Home in ${city.name}: ${city.focus[0].toUpperCase()}${city.focus.slice(1)}`,
  metaTitle: `Physiotherapy at Home in ${city.name} | Goswami Rehab`,
  metaDescription: getCityGuideMetaDescription(city.name),
  excerpt: `A practical guide to ${city.focus} in ${city.name}, including what to prepare, what a first assessment may cover, and how availability is confirmed.`,
  date: "September 17, 2026",
  isoDate: "2026-09-17",
  author: "Goswami Rehab",
  category: "City Guide",
  image: "https://goswamirehab.in/opengraph.jpg",
  content: `Families in ${city.name} may consider home physiotherapy when pain, weakness, fatigue, or reduced mobility makes every clinic journey difficult. A home visit is not automatically the right format for every person, so the first conversation should include the diagnosis, recent procedures, current symptoms, and any instructions from the treating team.

This guide focuses on ${city.focus}. Local enquiries may include ${city.localities}. The team confirms the exact location, professional availability, and whether a home visit or an online consultation is the safer and more useful next step.

### What to share before a home physiotherapy assessment

Share the person’s main concern, recent medical or surgical history, medicines that affect exercise or alertness, walking or transfer support, and the goals that matter at home. Useful goals might include getting from bed to a chair, walking to the bathroom, using stairs, managing fatigue, or returning to a valued activity.

Bring discharge papers, scan or test reports that the treating team has shared, and a list of current exercises if available. The physiotherapist can then assess movement, strength, balance, breathing tolerance, pain behaviour, and the tasks that are difficult in the actual home environment.

### What a first session may involve

The first visit usually begins with an assessment rather than a fixed exercise routine. Treatment and advice depend on the findings, the person’s response, and any precautions set by the medical team. A plan may include graded movement, transfers, walking practice, breathing or pacing strategies, caregiver guidance, and a small set of exercises to practise between reviews.

Progress is individual. A physiotherapist should explain what to monitor, when to pause an exercise, and when a change in symptoms needs medical review. New severe breathlessness, chest pain, fainting, sudden weakness, new confusion, or rapidly worsening symptoms need urgent medical attention rather than routine home exercise.

### Checking home physiotherapy availability in ${city.name}

Home visit availability depends on the exact locality, the person’s needs, and the professional match. Send the neighbourhood or pin code, the main rehabilitation concern, and preferred dates through the booking form. Goswami Rehab will confirm the next available option before an appointment is scheduled.

[→ View the ${city.name} home physiotherapy page for local details and availability](/physiotherapist-at-home/${city.slug})`,
}));

const authoredBlogPosts: BlogPost[] = [
  ...additionalBlogPosts,
  ...cityJournalPosts,
  ...additionalCityGuidePosts,
  {
    id: "53",
    slug: "lumbar-slipped-disc-l3-l4-l4-l5-l5-s1",
    title: "Lumbar Slipped Disc: L3–L4, L4–L5, L5–S1 Symptoms and Rehabilitation",
    excerpt: "A deep, safety-first guide to lumbar slipped-disc symptoms, common lower-back pain patterns, assessment, imaging, rehabilitation, and when urgent medical review is needed.",
    date: "September 11, 2026",
    isoDate: "2026-09-11",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `“Slipped disc” is the everyday phrase people often use for a disc bulge, protrusion, extrusion, or prolapse in the spine. The disc is a cushion between two vertebrae. If part of the disc irritates or compresses a nearby nerve root, a person may feel back pain with pain, tingling, numbness, or weakness in the leg. But a disc finding on a scan is not automatically the source of pain, and some disc changes cause no symptoms at all.

This matters because searches for “L3–L4 slipped disc symptoms” or “L5–S1 disc pain” can make a level sound like a diagnosis. Pain maps overlap, disc shape and location change which root is contacted, and other conditions can produce very similar symptoms. This guide explains the common patterns without trying to diagnose a particular person from a symptom checklist.

### What people mean by a lumbar slipped disc

The lumbar spine is the lower part of the back. Its five vertebrae are commonly labelled L1 to L5, followed by the sacrum. The discs are named for the vertebrae above and below them: L3–L4 sits between the third and fourth lumbar vertebrae, L4–L5 between the fourth and fifth, and L5–S1 between L5 and the top of the sacrum.

A posterolateral or paracentral disc herniation usually affects the nerve root travelling past that disc level. In that common pattern, an L3–L4 herniation may affect the traversing L4 root, L4–L5 may affect L5, and L5–S1 may affect S1. A foraminal or far-lateral herniation can affect the exiting root instead. The position of the disc material therefore matters as much as the disc label.

Pain can also come from irritated tissues around the disc without a clear nerve-root deficit. Some people have mostly local back pain; others have leg pain that is more troublesome than the back pain. A clinician should separate these patterns from hip, sacroiliac, muscle, facet-joint, spinal-stenosis, fracture, infection, inflammatory, or visceral causes.

### What L3–L4, L4–L5, and L5–S1 patterns can look like

These are teaching patterns, not self-diagnosis rules. Symptoms may be incomplete, mixed, on both sides, or different from a textbook diagram.

- **L3–L4 disc level:** A typical paracentral herniation may irritate L4. Symptoms can include back pain travelling toward the front of the thigh or medial knee and leg, altered sensation in a similar area, difficulty with knee extension, or a change in the patellar reflex. A far-lateral L3–L4 herniation may instead affect the exiting L3 root and produce a different pattern.
- **L4–L5 disc level:** A typical paracentral herniation may irritate L5. Pain or tingling may travel through the buttock and outer thigh or calf toward the top of the foot or big toe. Weakness may affect ankle or big-toe lifting, and heel-walking may become difficult. L4 symptoms are possible when the herniation is foraminal or far lateral.
- **L5–S1 disc level:** A typical paracentral herniation may irritate S1. Symptoms may travel from the buttock through the back or outer part of the thigh and calf toward the outer or sole of the foot. Weakness may affect pushing the foot down or repeated toe raises, and the Achilles reflex may change.

These patterns overlap substantially. Research on MRI-confirmed L5 and S1 radiculopathy found that pain distributions were not reliably specific enough to identify the affected root from a pain drawing alone. The useful question is not “Which level does my pain prove?” but “Do the history, neurological examination, and—when needed—imaging fit together?”

### Other common lower-back and lumbar disc pain patterns

Lumbar disc-related problems do not all produce classic sciatica. Common presentations include:

- **Local mechanical low-back pain:** aching, stiffness, guarding, or pain with particular movements without clear numbness or weakness in a nerve-root pattern.
- **Radicular leg pain:** sharp, burning, electric, or shooting pain that travels below the buttock and may be accompanied by tingling or altered sensation.
- **Radiculopathy:** radicular symptoms plus objective neurological change such as measurable weakness, sensory loss, or a reflex difference. This requires clinical examination.
- **Referred leg or buttock pain:** pain that spreads away from the back but does not behave like a nerve-root problem. Muscles, joints, the hip, sacroiliac region, and other structures can refer pain.
- **Pain aggravated by sitting, bending, coughing, or sneezing:** this can occur with disc-related irritation, but it is not specific enough to confirm a disc herniation.
- **Walking-related leg symptoms:** pain, heaviness, or numbness that changes with standing or walking can also reflect spinal stenosis or another condition, particularly in older adults.

A scan may show degeneration, bulging, or a herniation in someone who has no pain. The finding becomes clinically useful when its location and severity fit the symptoms and examination and when knowing about it would change management.

### What a physiotherapist assesses

The assessment starts with the person’s story: when symptoms began, whether there was a lift, fall, or gradual change, where the pain travels, what happens with sitting or walking, and how symptoms behave later that day and the next morning. The therapist also asks about sleep, work, driving, lifting, exercise, previous episodes, surgery, medication, fever, unexplained weight loss, cancer history, infection risk, steroid or immune-suppressing treatment, and recent trauma.

The physical assessment may include walking, sit-to-stand, spinal movement, hip movement, strength, sensation, reflexes, balance, and a safe version of a task that matters to the person. Depending on the presentation, a clinician may use straight-leg raise or femoral-nerve tension testing. These tests are not magic level detectors. Individual examination findings can have limited accuracy, so the clinician combines several findings with the history and decides whether medical review or imaging is needed.

The assessment should also look for reasons not to treat the problem as a routine musculoskeletal episode. New bladder or bowel change, saddle-area numbness, progressive weakness, fever, a history of cancer, major trauma, or systemic illness changes the urgency of the plan.

### Imaging and other tests

An MRI can show discs, nerve roots, and other soft tissues, but an MRI report should not be read in isolation. Common age-related findings can be present without symptoms. NICE advises against routine imaging for low-back pain or sciatica in a non-specialist setting; specialist imaging is considered when the result is likely to change management. The American College of Radiology similarly supports imaging when red flags raise concern for serious disease or when symptoms persist despite an appropriate trial of care.

Imaging becomes more important when there is a progressive neurological deficit, suspected cauda equina syndrome, serious trauma, infection or cancer risk, or persistent disabling leg symptoms where an injection or surgical opinion is being considered. The appropriate test and timing belong to the medical team. A normal or non-matching scan does not mean the symptoms are imaginary, and an abnormal scan does not prove that every symptom comes from the disc.

### How rehabilitation can progress

#### Phase 1: understand irritability and protect useful movement

When symptoms are highly irritable, the first aim is to reduce the loads that repeatedly flare the back or leg while keeping safe movement in the day. That may mean shorter sitting periods, changing position, reducing repeated bending and twisting, temporarily modifying heavy lifting, and using brief, comfortable walks if walking is tolerated. Prolonged bed rest is not a routine treatment. If a position or movement increases electric pain, numbness, or weakness, stop testing it repeatedly and ask for an assessment.

Pain relief, anti-inflammatory medicine, or other medication decisions should be discussed with a doctor or pharmacist because suitability depends on age, pregnancy, kidney, stomach, heart, liver, and other health factors. Do not use someone else’s prescription or assume that a medicine is safe because it helped another person.

#### Phase 2: restore comfortable movement and confidence

Once symptoms are calm enough, a physiotherapist may select comfortable spinal or hip movement, breathing and relaxation strategies, walking, gentle trunk or hip activation, and task practice. There is no single “best” exercise for every disc level. NICE recommends exercise and movement matched to the person’s needs, preferences, and capabilities. Manual therapy, if used, should be part of a wider package that includes exercise and education rather than a stand-alone promise of correction.

Neural-mobility exercises may be appropriate for some people, but they should be taught and adjusted by a clinician. They should not be forced into sharp, electric, or increasingly distant symptoms. Traction, belts, corsets, electrotherapy, and a named online programme should not be presented as universal solutions.

#### Phase 3: rebuild capacity for daily life

Later rehabilitation can gradually increase walking time, strength, trunk and hip control, lifting tolerance, stairs, work tasks, and exercise. Change one or two variables at a time—such as duration, load, range, speed, or frequency—and observe the response during the task, later that day, and the next morning. A mild, settling response may be manageable; steadily worsening leg pain, spreading numbness, new weakness, or a clear loss of function needs review rather than a harder workout.

The goal is not to force a disc back into place. The goal is to help the person move more safely and confidently, restore capacity, and participate in the activities that matter while the medical team monitors the clinical picture.

#### Work, sitting, lifting, and sleep

There is no universal sitting limit, mattress, sleeping position, lifting weight, or return-to-work date for every lumbar disc problem. A practical plan can use position changes, short movement breaks, a temporary reduction in repeated bending or twisting, load held close to the body, help with heavier objects, and a staged return to work when the job allows it. A person who drives, works at a desk, lifts at work, cares for a child, or works on the floor may need a different progression.

Sleep advice should focus on comfort and enough recovery to function. Pillows, side-lying, back-lying, heat, or cold can be discussed as comfort options if they are safe for the person’s skin and medical situation, but none should be described as a way to repair a disc. If night pain is new, severe, or worsening, medical review is more important than changing the mattress.

### What to expect from a home physiotherapy session

A home session begins with a review of medical history, reports, medication changes, red flags, symptom behaviour, and the tasks the person needs to do at home. The physiotherapist may observe getting out of bed, sitting, walking to the bathroom, climbing stairs, lifting a light object, or setting up a workstation. The assessment is adapted to irritability; a person with severe leg pain does not need to repeatedly perform provocative tests.

The plan may include education, a small number of exercises, walking or position-change practice, task modification, and a clear rule for what to do if symptoms flare. Follow-up should track function as well as pain: walking distance, sitting tolerance, sleep, work, strength, confidence, and whether numbness or weakness is changing. An online consultation may help with education or review of an existing plan, but it cannot replace urgent care or an in-person neurological assessment when that is needed.

### Do

- Keep moving within a tolerable range and change position regularly rather than staying in bed for long periods without medical advice.
- Take reports, medication lists, and the timeline of symptoms to a doctor or physiotherapist.
- Notice whether symptoms are settling, spreading, becoming more intense, or accompanied by new weakness or numbness.
- Ask for a work, lifting, driving, or home plan that matches the actual tasks you need to perform.
- Seek a clinician’s guidance before progressing a nerve-mobility exercise, heavy lifting, running, or contact sport.

### Don’t

- Do not diagnose the disc level from the location of leg pain or a social-media dermatome chart.
- Do not repeatedly force a painful bend, stretch, nerve glide, or “disc relocation” exercise.
- Do not stay completely inactive because a scan uses alarming words, and do not push through progressive neurological symptoms because movement is usually encouraged.
- Do not assume that traction, a brace, massage, injection, supplement, or operation is appropriate without a clinical discussion.
- Do not delay urgent assessment while waiting for a home physiotherapy appointment or online exercise plan.

### Safety and when to seek medical advice

Go to emergency care now for back pain with numbness around the genitals or saddle area, new difficulty passing urine or urinary retention, loss of bladder or bowel control, rapidly worsening weakness, major loss of feeling in one or both legs, or symptoms after a serious accident. These can indicate a time-sensitive problem such as cauda equina syndrome or serious spinal injury.

Arrange prompt medical review for progressive weakness or numbness, fever or feeling systemically unwell, unexplained weight loss, pain that is severe or worse at night, a new swelling, a history of cancer, significant infection risk, or pain that is not improving as expected. A doctor may decide that blood tests, imaging, medication review, specialist referral, or another diagnosis needs consideration.

Physiotherapy is not a substitute for emergency or specialist care. Rehabilitation can be useful when the assessment supports it, but the plan must change when the neurological or medical picture changes.

### When specialist or surgical review may be discussed

Most uncomplicated episodes are initially managed without surgery, using education, symptom management, activity modification, and an individualized rehabilitation plan. The time course varies, so a general statistic should not be turned into a promise for one person. If disabling leg pain or functional loss persists despite appropriate non-surgical care, and imaging matches the clinical findings, a medical team may discuss injections or spinal decompression.

Earlier specialist or surgical review may be needed for severe or progressive motor weakness or cauda equina symptoms. Surgery can provide faster relief for selected patients, while longer-term results and the need for surgery depend on the diagnosis, duration, severity, imaging, preferences, and risks. This decision belongs with the appropriate doctor or spine team—not with an online symptom score.

### Booking and follow-up

Home physiotherapy is arranged after the team understands the person’s symptoms, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when an exercise plan needs review, but it does not replace emergency or specialist medical care.

This article is educational information only. It does not diagnose a condition or replace advice from a doctor, spine specialist, pharmacist, or treating physiotherapist. Individual plans, timelines, and outcomes vary.

### Further reading

The clinical sources below include national guidance, an imaging guideline, peer-reviewed diagnostic research, and a review of lumbar disc-herniation treatment guidance. They are included so readers can check the evidence directly.`,
  },
  {
    id: "54",
    slug: "skin-inflammation-vasculitis-diet-guide",
    title: "Skin Inflammation and Vasculitis: Nutrition, Symptoms, and Care",
    excerpt: "A nutrition-led, safety-first guide to inflammatory skin symptoms, vasculitis warning signs, balanced dietary support, supplement cautions, and the right care pathway.",
    date: "September 11, 2026",
    isoDate: "2026-09-11",
    author: "Goswami Rehab",
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition-skin.jpg",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    presentation: "nutrition-guidance" as const,
    content: `Skin spots, itching, bruising, redness, swelling, or ulcers can be frightening. People sometimes search for “blood-vessel inflammation” when they see purple marks or a rash, and then look for foods that might control it. The important first step is not a restrictive diet. It is finding out what the skin change represents.

Vasculitis means inflammation of blood-vessel walls. It is an umbrella term for several conditions, and it can affect the skin alone or occur with inflammation in organs such as the kidneys, lungs, eyes, nerves, joints, or digestive system. A rash or food association cannot diagnose vasculitis. Common skin conditions, infections, bruising, medicine reactions, and circulation problems can look similar.

Diet can support general health, energy, recovery, and medication safety. It has not been shown to replace diagnosis or prescribed treatment for vasculitis. This guide explains what can reasonably help, what should not be tried without supervision, and which symptoms need prompt or emergency medical care.

### What blood-vessel inflammation means

Blood vessels carry blood through the body. When their walls become inflamed, they may leak, swell, thicken, narrow, or become blocked. The effects depend on the size and location of the vessels and which organs are involved. Some forms mainly affect small vessels in the skin; other forms can involve larger vessels or several body systems.

Cutaneous small-vessel vasculitis often appears on the lower legs as red, purple, or brown spots that do not fade when pressed. The spots may be flat or raised, and the skin may itch, burn, swell, blister, or become painful. Ulcers, nodules, net-like colour changes, and dark marks after healing can also occur. These descriptions are useful for explaining why a person needs assessment, not for making a diagnosis at home.

Some skin-limited episodes follow an infection, a medicine, or another immune trigger; sometimes no cause is found. A clinician may also need to consider autoimmune disease, blood disorders, infection, circulation problems, or another inflammatory condition. Do not stop a prescribed medicine on your own because you suspect it caused a rash. Contact the prescriber promptly, and seek emergency care if the reaction is severe.

### Why a skin symptom is not enough to diagnose vasculitis

Purpura means that blood has leaked into the skin or mucosa. It is a finding, not a diagnosis. Purpura can be related to platelet or clotting problems, infection, medicines, fragile vessels, pressure, trauma, or vasculitis. A non-blanching spot should not be labelled “allergy” or “vasculitis” from a photograph.

Other inflammatory or irritated skin conditions may cause red or scaly patches, itch, swelling, blisters, or broken skin:

- **Eczema or contact dermatitis** can cause itch, dryness, scaling, cracking, or oozing after irritant or allergic exposure.
- **Psoriasis** can cause well-defined, scaly plaques and may occur with nail or joint symptoms.
- **Hives** usually produce raised, itchy wheals that come and go, but a painful or bruising-like eruption needs medical review.
- **Infection** may cause warmth, tenderness, swelling, fever, pus, rapidly spreading redness, or wound breakdown.
- **Medicine reactions** can range from mild rashes to severe skin injury involving blisters, peeling, mouth, eyes, or breathing.
- **Venous or arterial circulation problems, pressure, neuropathy, trauma, and fragile skin** can cause ulcers, colour changes, bruising, or delayed healing.

These categories overlap in real life. The safe approach is to describe when the change began, what it feels like, recent infections or new medicines, and any other symptoms rather than trying to match it to an online image.

### Symptoms outside the skin that change the urgency

Skin findings deserve faster medical review when they occur with symptoms suggesting that more than the skin may be involved. Tell the clinician about:

- fever, marked fatigue, unexplained weight loss, or feeling acutely unwell;
- new joint or muscle pain, swelling, or difficulty walking because of pain;
- dark, bloody, foamy, or noticeably reduced urine;
- breathlessness, chest pain, persistent cough, or coughing blood;
- eye pain, a red eye, blurred vision, or sudden change in vision;
- severe or persistent abdominal pain, vomiting, or blood in the stool;
- new numbness, weakness, severe headache, confusion, or another neurological change;
- painful ulcers, black or grey skin, rapidly worsening pain, or loss of feeling around a wound.

These signs do not prove vasculitis. They are reasons not to manage the problem with food experiments or a routine online exercise appointment.

### What clinical assessment may involve

A doctor or dermatologist may ask about the timeline, distribution, pain or itch, fever, recent infections, travel or exposures, new medicines, supplements, allergies, autoimmune symptoms, cancer history, and other illnesses. They may examine whether spots blanch, whether they are raised or tender, whether there are ulcers or blisters, and whether the skin pattern is limited to one area or more widespread.

Depending on the presentation, assessment may include blood pressure, a blood count, kidney and liver tests, inflammation markers, urinalysis, and other targeted tests. Chest imaging or organ-specific testing may be considered when the history or examination suggests lung, kidney, nerve, eye, or digestive involvement. The precise tests depend on the person; a generic online panel is not a safe substitute for care.

A skin biopsy can help identify the type and timing of inflammation when cutaneous vasculitis is suspected. A biopsy is not needed for every rash, and its usefulness depends on choosing the right lesion and timing. A remote photograph cannot provide palpation, blood pressure, urine testing, or a biopsy. Teleconsultation can help collect history, review existing reports, and decide the next contact, but urgent or diagnostically uncertain cases may need in-person examination.

### What dietary changes can reasonably support

There is no established food plan that treats or reverses vasculitis. The most defensible nutrition advice is ordinary but important: eat enough, keep meals varied, include protein and fibre, and choose foods that are practical, affordable, culturally familiar, and compatible with your medical advice.

For many adults, a balanced pattern may include vegetables and fruit, pulses or other protein foods, whole grains or other carbohydrate sources, nuts or seeds when safe, and dairy or alternatives according to tolerance and clinical needs. Fish or other sources of unsaturated fats may fit some people’s eating pattern. This is general health support, not a prescription for lowering vessel inflammation.

Hydration should be guided by thirst and the treating team. People with kidney, heart, liver, or other conditions may have specific fluid, salt, potassium, or protein advice that differs from general guidance. Someone taking steroids may need medical advice about glucose, bone health, weight, and other risks. If appetite is low, weight is falling, swallowing is difficult, or food access is limited, ask for a clinician or registered dietitian rather than attempting a restrictive plan.

Food and symptom notes can be useful when they record timing, ingredients, medicines, infections, stress, sleep, and the skin change without assuming that one caused another. A diary is a prompt for clinical discussion, not proof of a food allergy or a way to diagnose vasculitis.

### What diet cannot safely promise

Research on dietary patterns and general inflammatory markers does not establish that a particular food, spice, juice, supplement, or elimination diet controls vasculitis. Studies of elimination diets in atopic dermatitis are not studies of vasculitis, and any improvement reported in those studies is modest or uncertain. A food that is nutritious for one person may be unsuitable for another because of allergy, kidney disease, diabetes, pregnancy, medication, or another condition.

Do not describe turmeric, ginger, garlic, omega-3 capsules, vitamin D, probiotics, fasting, gluten avoidance, dairy avoidance, or a “detox” as a treatment for blood-vessel inflammation. Some foods can be part of a varied diet, but a food’s reputation on social media is not evidence that it changes a diagnosed vasculitis condition.

### Don’t

- **Do not start a broad elimination diet** because a rash appeared. Removing several foods can reduce energy, protein, calcium, iron, or other nutrients and can make it harder to interpret what is happening.
- **Do not treat a positive food-allergy test as proof** that a food caused eczema, purpura, or vasculitis. Some tests have false positives and need to be interpreted with the history by an allergy clinician.
- **Do not stop eating previously tolerated foods without a clear clinical reason.** Unnecessary avoidance can create nutritional problems and, in some circumstances, may contribute to new food allergy.
- **Do not start high-dose vitamins, fish-oil capsules, herbal mixtures, or immune “boosters” without checking** with the treating doctor or pharmacist. Supplements can interact with medicines, cause toxicity, or contain undeclared ingredients.
- **Do not stop steroids, immunosuppressants, antibiotics, blood thinners, or another prescribed medicine** because you believe a food or supplement will control the condition.
- **Do not fast through fever, poor intake, diarrhoea, vomiting, or a suspected serious skin reaction.** The immediate priority is medical assessment and safe hydration or treatment advice.
- **Do not apply strong, unknown, or borrowed creams to broken or infected-looking skin** and do not cover an ulcer in a way that hides worsening colour, pain, discharge, or spreading redness.
- **Do not wait for a diet experiment to finish** if purpura is spreading, skin is blistering or turning dark, or you have breathing, eye, urine, abdominal, or neurological symptoms.
- **Do not assume a home physiotherapy or teleconsultation appointment can assess internal-organ involvement.** It cannot replace urgent medical, dermatology, or rheumatology care.

### Safety and when to seek medical advice

Seek emergency help now for a rapidly spreading or rapidly worsening rash, painful blistering or peeling skin, mouth or eye involvement, wheezing, throat or chest tightness, difficulty breathing or talking, faintness, or severe illness after a new medicine. These symptoms can occur with severe drug reactions or other emergencies. They should not be labelled “vasculitis” at home.

Arrange prompt medical assessment for new non-blanching purpura, painful ulcers, black or grey skin, fever, marked illness, new eye symptoms, breathlessness, coughing blood, dark or bloody urine, noticeably reduced urine, severe abdominal pain, blood in stool, new numbness or weakness, or rapidly increasing pain. If you are unsure how urgent a skin change is, contact local emergency services or a medical service rather than relying on an online food or rash guide.

Take a clear list of medicines and supplements, the date the skin change began, recent infections or new products, and photographs showing how it has changed. Do not delay care to collect a perfect food diary.

### How rehabilitation fits—and where it does not

Physiotherapy is not a treatment for vasculitis itself. It may be considered later when a medical team has clarified the diagnosis and the person needs help with fatigue and deconditioning management, joint or muscle function, safe walking, or return to daily activity. The plan should respect pain, skin integrity, fatigue, medication effects, bone health, and any organ precautions.

Do not exercise through fever, severe breathlessness, chest pain, faintness, rapidly worsening weakness, an open or infected wound, or unexplained severe pain. A physiotherapist should coordinate with the medical team when systemic inflammation, steroid treatment, significant fatigue, neuropathy, kidney disease, or a new diagnosis affects activity.

### What to expect from a home physiotherapy or online session

If a doctor has cleared rehabilitation, a home session can focus on the person’s actual tasks: transfers, walking, stairs, pacing, gentle strength, joint movement, or a graded return to activity. The physiotherapist may ask about the medical diagnosis, current medicines, fatigue, dizziness, skin integrity, and activity response. Any open wound, dressing, line, or painful skin area should be protected and managed according to the treating team’s instructions.

An online session may be useful for education, reviewing an established exercise plan, discussing pacing, or deciding whether an in-person visit is appropriate. It is not suitable as the only assessment for a new widespread rash, suspected vasculitis, rapidly changing skin, or symptoms suggesting organ involvement. The correct next step may be a doctor, dermatologist, rheumatologist, emergency service, or registered dietitian rather than physiotherapy.

### Further care and follow-up

Follow-up depends on the diagnosis and which organs, if any, are involved. Some people need dermatology review; others need rheumatology, nephrology, respiratory, ophthalmology, gastroenterology, neurology, allergy, or wound-care input. Ask who is coordinating the plan, which symptoms should trigger a same-day call, which medicines or supplements need review, and whether diet restrictions are actually necessary.

If a suspected medicine or supplement may be involved, do not make an independent stop-or-restart decision unless an urgent clinician tells you to. Keep the packaging or a photograph of the product and share the full list, including herbal and over-the-counter products.

### Booking and follow-up

Goswami Rehab’s physiotherapy team can discuss mobility, fatigue, safe activity, and home function after the relevant medical assessment. Home visits are {{price.homeVisit.introductory}} and online consultation is {{price.telehealth.introductory}}. Send the booking request with the main concern, city, current medical guidance, and preferred dates. The team confirms the appropriate next step within 24 hours. For a new or worsening rash with systemic symptoms, contact medical or emergency services first.

This article is educational information only. It does not diagnose vasculitis, eczema, psoriasis, allergy, infection, or any other skin condition. It does not replace advice from a doctor, dermatologist, rheumatologist, pharmacist, registered dietitian, or treating physiotherapist. Individual dietary needs, treatment plans, and outcomes vary.

### Further reading

The clinical sources below include dermatology and NIH guidance, peer-reviewed diagnostic research, diet and elimination-diet evidence, supplement safety information, and urgent severe-rash guidance. They are included so readers can review the evidence directly.`,
  },
  {
    id: "55",
    slug: "diet-requirements-after-stroke",
    title: "Diet Requirements After Stroke: Swallowing Safety, Food, and Recovery",
    excerpt: "A careful guide to eating and drinking after stroke, including swallowing assessment, familiar Indian food options, hydration and nutrition questions, medical variation, and when to seek help.",
    date: "September 13, 2026",
    isoDate: "2026-09-13",
    author: "Goswami Rehab",
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition-skin.jpg",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    presentation: "nutrition-guidance" as const,
    content: `After a stroke, families often ask what the person should eat, how much water they need, and whether certain foods will speed recovery. Those are important questions, but the first diet decision is usually not the menu. It is whether swallowing is safe and what the person’s clinical team has recommended.

A stroke can affect swallowing, appetite, attention, movement, communication, self-feeding, and the ability to sit upright. Nutrition and hydration needs also vary with body size, illness, activity, medicines, kidney or heart disease, diabetes, and the stage of recovery. This guide offers questions and practical household principles, not a universal post-stroke prescription.

### Swallowing safety comes first

Swallowing difficulty after stroke is called dysphagia. It can affect chewing, moving food through the mouth, protecting the airway, or coordinating a swallow. Some people cough or choke during a meal. Others may aspirate food or drink without an obvious cough. A new wet or gurgly voice, food remaining in the mouth, breathlessness after eating, repeated chest infections, or a sudden drop in intake should be reported to the treating team.

Screening and, when needed, a fuller swallowing assessment help the team decide what is safe. Depending on the person, the plan may include changes to posture, supervision, bite size, pace, food texture, or drink thickness. A plan can change as recovery changes.

Do not independently decide that a person needs thickened water, only pureed food, a feeding tube, fasting, or a high-calorie supplement because of an online checklist. These decisions depend on assessment. Ask the doctor, nurse, speech and swallowing specialist, dietitian, or rehabilitation team:

- Was swallowing assessed, and what signs should make us call again?
- Which food and drink forms are safe today?
- Does the person need help with positioning, feeding, pacing, or oral care?
- How should we respond if coughing, fatigue, or wet voice appears during a meal?

If the person is struggling to breathe, has a sudden new neurological symptom, becomes difficult to wake, or appears acutely unwell, seek emergency medical help rather than trying a different diet.

### What a balanced plan may include

Once the clinical team has clarified swallowing safety, the general aim is adequate and varied intake that supports energy, hydration, weight maintenance, and participation in rehabilitation. There is no single calorie, protein, fluid, or sodium number that applies to every person after stroke. A dietitian or medical team may set different goals when there is malnutrition risk, weight loss, kidney disease, heart failure, diabetes, infection, pressure injury, or another complication.

For an Indian household, familiar food groups can be adapted to the assessed texture and the person’s preferences:

- pulses and beans such as dal, chana, rajma, or other protein foods;
- vegetables and fruit in the form and consistency that has been recommended;
- rice, roti, oats, poha, idli, dosa, or millets according to tolerance and the meal plan;
- curd, milk, paneer, eggs, fish, or meat when suitable for the person’s culture, appetite, swallowing plan, and medical advice;
- nuts, seeds, or their safe alternatives when they fit the person’s swallowing and allergy guidance.

These are options, not a fixed recovery menu. A food that is nutritious in general may still be unsafe in a particular texture, difficult to swallow, unsuitable for kidney disease, or inconsistent with a medication plan. The safest meal is the one that fits the person’s assessment and can be eaten with adequate support.

Hydration deserves the same individual approach. A person may be at risk of dehydration because drinking is tiring or unsafe, while another person may have a fluid restriction for heart or kidney disease. Do not use a universal “drink this many glasses” rule when the treating team has given different advice.

### Medical conditions and medicines change the advice

Stroke recovery commonly overlaps with other conditions. Tell the care team about:

- diabetes, glucose readings, and medicines that can cause low blood sugar when appetite or meal size changes;
- kidney disease, dialysis, heart failure, liver disease, or advice about fluid, salt, potassium, phosphorus, or protein;
- blood thinners such as warfarin, especially before making major changes to leafy-green or supplement intake;
- steroids, antibiotics, herbal products, vitamins, and over-the-counter medicines;
- reduced appetite, depression, fatigue, nausea, constipation, unexplained weight loss, or difficulty shopping and cooking.

Do not stop a prescribed medicine because a food or supplement is said to help stroke recovery. Do not start megadose vitamins, herbal mixtures, protein powders, or “brain recovery” products without checking the full list with a doctor or pharmacist. Supplements can interact with medicines or add risks that are not obvious from the label.

If eating is taking too long, the person becomes exhausted, or weight keeps falling, ask for an individualized nutrition review. The answer may involve changes to meal timing, assistance, food texture, an oral nutrition supplement, swallowing rehabilitation, a feeding plan, or treatment of another medical problem. It should not be guessed from a standard online menu.

### Making meals easier at home

The household can make the agreed plan easier to follow without inventing a new clinical plan. Keep the person as upright and alert as advised. Reduce distractions if attention is poor. Offer the recommended consistency, small manageable amounts, and the pace the team has taught. Stay nearby if supervision has been recommended. Follow instructions about oral care and what to do after meals.

Keep a simple note of what the team may need to know: how much was eaten or drunk, how long meals take, coughing or wet voice, fatigue, bowel changes, weight trend, and any new symptom. A note should help a clinician see a pattern; it should not be used to diagnose aspiration or prove that one food caused a symptom.

Families can also ask for practical help with shopping, cooking, feeding equipment, plate and cup choices, positioning, and caregiver workload. A [stroke and neurological rehabilitation assessment](/stroke-rehab) can support movement and daily function after the medical team has clarified the person’s precautions, but it does not replace swallowing or nutrition care.

### When to seek prompt help

Arrange prompt clinical review for repeated coughing or choking during meals, wet or gurgly voice, food remaining in the mouth, new difficulty swallowing tablets, breathlessness after eating or drinking, repeated chest infections, dehydration, a major reduction in food or fluid intake, or ongoing unintentional weight loss.

Seek emergency help for severe breathing difficulty, blue or grey lips, a sudden new facial droop or weakness, new trouble speaking, collapse, severe chest symptoms, or a person who is difficult to wake. These are not problems to manage by changing the family menu.

### Further reading

The clinical sources below include stroke rehabilitation guidance, dysphagia guidance, Indian food-pattern guidance, kidney nutrition information, and anticoagulant safety advice. They are included so readers can check the evidence directly.`,
  },
  {
    id: "56",
    slug: "diet-and-fat-loss",
    title: "Diet and Fat Loss: A Practical Guide for Indian Households",
    excerpt: "A flexible, evidence-informed approach to diet and fat loss using familiar Indian foods, repeatable habits, movement, sleep, and individualized medical advice.",
    date: "September 13, 2026",
    isoDate: "2026-09-13",
    author: "Goswami Rehab",
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition-skin.jpg",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    presentation: "nutrition-guidance" as const,
    content: `Fat loss is often presented as a simple calculation or a test of willpower. Real households are more complicated. Work schedules, family meals, food budgets, sleep, pain, disability, medicines, stress, culture, and medical conditions all affect what can be repeated.

A useful plan is not the most extreme plan. It is a pattern that supports health, feels culturally familiar, and can be adjusted when progress is slow. This guide uses common Indian foods and practical questions without assigning a universal calorie target, promising a rate of loss, or treating physiotherapy as a weight-loss cure.

### A sustainable pattern beats a quick fix

Healthy-diet guidance supports adequacy, balance, moderation, and variety. That does not require one named diet or one forbidden food. Rice, roti, dosa, idli, poha, potatoes, oats, and millets can all appear in different household patterns. The useful question is how the overall meal and the day’s routine fit the person’s health, hunger, activity, and goals.

Start with changes that are small enough to repeat:

- keep a regular meal structure that reduces long periods of automatic grazing;
- include a filling protein food when it suits the person, such as dal, beans, curd, paneer, eggs, fish, or meat;
- add vegetables or fruit in forms the household enjoys and can afford;
- notice sugary drinks, frequent fried snacks, packaged foods, and cooking oil without turning food into a moral score;
- use water or another suitable unsweetened drink when that fits the person’s medical advice.

These are flexible examples, not a prescription. A person with kidney disease, diabetes, food allergy, pregnancy, an eating disorder, or another medical condition may need a different plan. A clinician or registered dietitian can adapt the pattern safely.

### A flexible Indian plate

An everyday meal can be built from the foods already used at home. One person may have dal with vegetables and rice; another may have rajma with roti; another may prefer idli with sambar, curd, and a vegetable side. Eggs, fish, chicken, paneer, tofu, chana, or other protein foods may fit different diets and budgets.

Portion needs vary. Instead of copying a number from an article, try asking:

- Does this meal keep me reasonably satisfied until the next planned eating time?
- Is there a food I enjoy that adds protein, fibre, or volume without making the meal difficult to prepare?
- Are drinks, second helpings, or eating directly from a packet happening without much awareness?
- What change could the whole household support for the next two weeks?

Smaller plates, serving food before sitting down, eating more slowly, and keeping snack foods less visible may help some people notice portions. They are tools, not rules. If they increase anxiety, guilt, or restrictive behaviour, stop and seek appropriate support.

Avoid promising that a particular spice, juice, tea, supplement, fasting window, gluten-free plan, or dairy-free plan will cause fat loss. Some people need a medical review of thyroid or other conditions, medicines, sleep, mood, appetite, or eating concerns before changing food substantially.

### Portions, progress, and plateaus

Weight can change for many reasons, and progress is not always visible on a day-to-day scale. A plateau is not evidence that a person has failed or needs a detox. Review the pattern calmly: meals, drinks, snacks, movement, sleep, stress, pain, medicines, menstrual or hormonal factors, and changes in work or routine may all matter.

Public-health guidance supports gradual, steady changes and expecting setbacks. It does not justify promising a fixed weekly rate for every body. Do not turn a population statistic into an individual target without understanding the person’s medical and nutritional context.

If the person is losing weight without trying, fainting, repeatedly vomiting, becoming very weak, avoiding food from fear, or having a history of disordered eating, fat loss should not be the immediate goal. Ask a doctor or qualified nutrition professional for individual advice. Do not reduce food further while waiting.

### Movement, sleep, and rehabilitation

Movement can support cardiovascular health, strength, balance, mood, sleep, confidence, and independence even when weight does not change. WHO and NICE use an ability-sensitive approach: some activity may be better than none, but the right amount depends on current fitness, disability, pain, rehabilitation status, and medical conditions.

There is no safe universal exercise programme for every reader of this article. Someone recovering from stroke, surgery, heart or lung disease, a fracture, severe pain, or a long hospital stay may need a graded plan and medical clearance. A [clinical assessment](/services/clinical-assessment-evaluation) can help identify what movement is currently realistic; [home physiotherapy](/home-physiotherapy) may then support function, pacing, strength, balance, or confidence.

Physiotherapy can make movement more achievable. It does not promise fat loss, replace nutrition care, or prescribe a calorie deficit simply because a person wants to change weight. Health benefits from movement still matter even when the scale is unchanged.

Sleep and stress are worth treating as parts of the routine, not as promises of fat loss. Protect a regular sleep opportunity where possible, and seek help when pain, mood, medicines, caregiving, shift work, or disability make rest difficult. The research does not support claiming that sleep alone causes a particular amount of weight change.

### When to ask for individual help

Ask for medical or nutrition review before making major changes if you have kidney disease, diabetes, heart or liver disease, take medicines affected by food or weight change, are pregnant or breastfeeding, recently had surgery, have swallowing difficulty, or have unexplained weight change.

Ask for help if pain or disability makes activity difficult, if exercise causes concerning symptoms, or if you are unsure whether a goal is appropriate during rehabilitation. New chest pain, severe breathlessness, fainting, sudden weakness, or another acute neurological symptom needs urgent medical attention, not a new exercise plan.

The most useful goal may be better stamina, easier stairs, less pain, improved glucose control, more confidence, or participation in family life rather than a specific number on the scale. A plan can pursue those outcomes while leaving room for weight to change at its own pace.

### Further reading

The clinical sources below include WHO and ICMR–NIN healthy-diet guidance, public-health weight-management advice, physical-activity guidance, and ability-sensitive rehabilitation boundaries. They are included so readers can check the evidence directly.`,
  },
  {
    id: "1",
    slug: "stroke-rehabilitation-at-home",
    title: "Stroke Rehabilitation at Home: A Physiotherapy Recovery Guide",
    excerpt: "Recovery after a stroke can take time and varies from person to person. Homecare physiotherapy supports movement, communication goals alongside the wider care team, and independence — here's what the journey may look like.",
    date: "January 10, 2025",
    isoDate: "2025-01-10",
    author: "Goswami Rehab",
    category: "Neuro Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `A stroke is one of the most disorienting events a person and their family can face. In an instant, movement, speech, or memory can be affected. The brain can adapt after injury through a process called neuroplasticity, and physiotherapy is one part of a coordinated rehabilitation plan that can support this adaptation.

Homecare physiotherapy after stroke may be useful when travel is difficult or when daily tasks at home are the main goals. Familiar surroundings can make practice more relevant, and family members can participate when the treating team considers this appropriate.

### How Stroke Rehabilitation Uses Task Practice

When a stroke damages brain tissue, the brain and body may adapt in different ways. Repetitive, task-specific movement is commonly used in rehabilitation to practise useful skills. Progress is often faster early on, but improvement can continue beyond the first few months and varies with the stroke, health, support, and rehabilitation plan.

### The Four Pillars of Stroke Rehabilitation

**1. Mobility and Transfers**
Re-learning to roll, sit up, stand, and walk safely is the foundation. Our physiotherapists work on bed mobility, sit-to-stand transfers, and progressive gait training using the patient's home environment as the therapy space.

**2. Upper Limb Function**
Arm and hand recovery may differ from leg recovery. We use task-specific training — reaching for objects, gripping cups, turning pages — because practising meaningful activities helps connect exercises with everyday goals.

**3. Balance and Safer Mobility**
Falls can interrupt stroke rehabilitation. We assess the person's balance and use graded, supported challenges to practise safer transfers and mobility.

**4. Spasticity Management**
Increased muscle tone (spasticity) in the affected limbs is common. Positioning, stretching, and movement techniques help manage spasticity and prevent the development of contractures.

### What to Expect Over Time

- **Weeks 1–4**: Focus on basic mobility, preventing complications, and establishing a daily routine
- **Months 2–3**: Progressive loading, functional tasks, and increasing independence
- **Months 3–6**: Higher-level activities, community mobility, return to hobbies
- **Beyond 6 months**: Continued improvement is possible — neuroplasticity does not have a hard stop date

### The Family's Role

Stroke rehabilitation is a team effort. We coach family members on safe handling, positioning, and how to encourage practice between sessions without overloading the patient. Your involvement can support carryover between visits.

At Goswami Rehab, we provide structured homecare neuro-rehabilitation programs designed around each patient's specific needs, goals, and home environment. Early assessment, appropriate practice, and regular review can help guide the next step — contact us to begin.`
  },
  {
    id: "2",
    slug: "knee-replacement-recovery-guide",
    title: "Knee Replacement Recovery: A Week-by-Week Rehabilitation Guide",
    excerpt: "Total knee replacement is a common orthopaedic surgery in India. The weeks after surgery involve staged physiotherapy, symptom monitoring, and guidance from the surgical team — here's a general overview of what to discuss with your clinicians.",
    date: "February 3, 2025",
    isoDate: "2025-02-03",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Total knee replacement (TKR) surgery replaces a damaged knee joint with an artificial implant. Recovery and rehabilitation usually continue for months, with the pace shaped by the surgery, the person's health, the surgeon's instructions, and physiotherapy goals.

Homecare physiotherapy after TKR can help when travel is difficult. Patients often return home while still in the early stages of recovery, so a physiotherapist can review movement, transfers, walking, and the home setup within the precautions provided by the surgical team.

### Week 1–2: Protection and Early Movement

The first two weeks often focus on managing swelling and pain while beginning gentle movement. Some swelling is common after surgery, but a sudden increase, marked redness, wound changes, fever, calf pain, or breathlessness should be reported promptly to the surgical or medical team.

Key goals:
- Achieve full knee extension (straightening) — this protects the joint
- Begin gentle flexion (bending) exercises
- Practice safe bed transfers and standing with support
- Walking short distances with a walker or crutches

Cold therapy may be suggested during this phase, if it is safe for you and permitted by the surgical team. Follow their instructions for duration, skin protection, and frequency rather than using a fixed schedule.

### Week 3–6: Restoring Range of Motion

By week 3, the goal is progressing knee flexion toward 90 degrees. Most daily activities — sitting comfortably, climbing stairs, getting in and out of a car — require at least 90–100 degrees of flexion.

Exercises at this stage include:
- Heel slides and wall slides for flexion
- Straight leg raises for quadriceps strength
- Short arc quads
- Seated knee flexion and extension

Walking distance gradually increases. Most patients transition from a walker to a cane around weeks 4–6 depending on strength and balance.

### Week 6–12: Strengthening and Function

This phase is about rebuilding the muscle strength that was lost before and after surgery. The quadriceps and gluteal muscles are the primary focus.

- Step-ups and mini squats
- Leg press (low resistance, high repetitions)
- Balance and proprioception training
- Stair climbing with increasing confidence

Return to driving depends on the operated side, medication, strength, reaction time, insurance, and local guidance. Ask the surgeon or physiotherapist when an emergency stop and other driving tasks can be performed safely.

### Month 3–6: Return to Full Activity

By month 3, most patients are walking without any aid. The focus shifts to building endurance, returning to recreational activities, and achieving the full range of motion the implant allows.

### The Most Common Mistakes

1. **Skipping physiotherapy**: Missing planned sessions or home practice can make it harder to review movement and progress. Discuss barriers with the treating team rather than stopping without advice.
2. **Pushing through sharp pain**: Discomfort during exercise is normal. Sharp, acute pain is a signal to stop.
3. **Neglecting the extension**: Patients often focus on bending but lose extension. Full extension is actually more important — a bent knee at rest causes long-term problems.

Goswami Rehab provides dedicated post-TKR homecare programs across India. We come to you, work within your home environment, and build the program around your surgical instructions, assessment findings, and goals.`
  },
  {
    id: "3",
    slug: "parkinsons-physiotherapy-guide",
    title: "Physiotherapy for Parkinson's Disease: Supporting Movement and Quality of Life",
    excerpt: "Parkinson's disease is progressive, and physiotherapy can support movement, balance, and everyday participation. Here's how a structured homecare program may fit into wider care.",
    date: "February 28, 2025",
    isoDate: "2025-02-28",
    author: "Goswami Rehab",
    category: "Neuro Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Parkinson's disease is a progressive neurological condition that affects movement, balance, and coordination. While medication manages the biochemical aspects of the disease, physiotherapy addresses the functional consequences — how the person actually moves, falls, and lives day to day.

Physiotherapy may support mobility, balance, confidence, and participation for people with Parkinson's disease. Homecare can be useful when transport and fatigue make clinic visits difficult, and it allows practice in the environment where everyday tasks happen. Results vary, and physiotherapy complements rather than replaces neurological and medical care.

### How Parkinson's Can Affect Movement

The core movement challenges in Parkinson's include:

- **Rigidity**: Increased muscle stiffness that makes movement slow and effortful
- **Bradykinesia**: Slowness of movement, affecting tasks like buttoning shirts or walking
- **Postural instability**: Impaired balance reflexes that can increase fall risk
- **Festination**: A shuffling, forward-leaning gait where the person takes many small, rapid steps
- **Freezing**: Sudden episodes where the feet feel glued to the floor, often at doorways or when turning

### What Physiotherapy Addresses

**Gait Training**
We may use auditory and visual cues — rhythmic beats or floor markers — to support step timing and walking practice. The choice of cue and its effect varies, so it is reviewed against the person's symptoms and goals.

**Balance Training**
Graded balance challenges, starting from safe supported positions and progressing to more dynamic activities, improve the postural reflexes that protect against falls. We also assess the home for fall hazards and recommend modifications.

**Big Movement Training (LSVT BIG)**
The LSVT BIG program, developed specifically for Parkinson's disease, trains patients to make intentionally large movements. Because Parkinson's causes movements to become smaller over time, training the brain to make big, exaggerated movements recalibrates perception and improves functional movement quality.

**Flexibility and Rigidity Management**
Stretching programs targeting the common areas of rigidity — trunk rotation, hip extension, shoulder mobility — reduce discomfort and improve posture.

### Frequency and Consistency

Parkinson's disease is an ongoing condition, so some people benefit from periodic review and continued practice. The frequency depends on symptoms, goals, medication timing, fatigue, and access to care; there is no single schedule that suits everyone.

We also work closely with the patient's neurologist and family so the physiotherapy program can complement medication timing. The treating team can decide whether sessions are best planned during a medication "on" period.

Goswami Rehab provides specialist neuro-rehabilitation homecare for Parkinson's patients across India. Our programs are evidence-based, practically focused, and built around each patient's current stage of the disease.`
  },
  {
    id: "4",
    slug: "hip-replacement-homecare-physiotherapy",
    title: "Hip Replacement Recovery: A Homecare Physiotherapy Guide",
    excerpt: "After total hip replacement, homecare physiotherapy can support safe mobility, transfers, and daily activities while you follow the surgical team's precautions.",
    date: "March 20, 2025",
    isoDate: "2025-03-20",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Total hip replacement (THR) is an orthopaedic surgery that replaces the damaged joint with a prosthetic implant. Rehabilitation after surgery focuses on the strength, coordination, confidence, and daily tasks needed to use it safely, with progress shaped by the operation and each person's health.

Structured homecare physiotherapy after hip replacement can help a person practise walking, transfers, and household tasks in context. It should be adapted to the surgical approach, precautions, symptoms, and guidance from the orthopaedic team rather than treated as a substitute for follow-up.

### Understanding the Surgery and Its Demands

In a total hip replacement, the damaged ball-and-socket joint is replaced with a prosthetic implant. Depending on the surgical approach (posterior, anterior, or lateral), specific muscles are cut or moved during the procedure. These muscles need to be carefully rehabilitated — not just rested.

The key muscles involved are the hip abductors (particularly gluteus medius), hip extensors (gluteus maximus), and the hip flexors. Weakness in these groups is the primary driver of the limp that persists long after surgery if rehabilitation is incomplete.

### Hip Precautions: Important During Early Rehabilitation

Depending on the surgical approach, your surgeon will specify precautions to prevent dislocation of the new joint. The most common posterior approach precautions are:

- Do not bend the hip beyond 90 degrees
- Do not cross your legs or ankles
- Do not rotate your foot inward

Our physiotherapists are trained in hip precautions and will guide all exercises and daily activities within these constraints. We also assess your home setup — chair heights, toilet risers, bed height — and make practical recommendations.

### Week-by-Week Recovery

**Week 1–2**: Walking with a frame or crutches, bed exercises, managing swelling and pain, practising safe transfers (bed, chair, toilet).

**Week 3–6**: Progressing to one crutch or stick, increasing walking distance, beginning gentle hip strengthening within precautions.

**Week 6–12**: Discontinuing walking aids (when safe), strengthening the hip abductors and extensors progressively, addressing the limp.

**Month 3–6**: Returning to driving, recreational walking, stairs without support, light recreational activities.

### How Homecare Physiotherapy Can Support Hip Replacement Recovery

The home environment presents the real challenges of recovery — the specific heights of your chairs, your stairs, your bathroom setup. Practising in this context means the exercises are immediately functional. There is no transfer learning required from a gym to daily life.

Family members can observe techniques and assist safely when needed — an advantage that a clinic session cannot replicate.

Goswami Rehab's post-THR homecare program is structured around your surgical notes, your home environment, and your personal goals. We coordinate with your orthopaedic surgeon and provide written progress reports on request.`
  },
  {
    id: "5",
    slug: "neurological-physiotherapy-brain-injury",
    title: "Neurological Physiotherapy After Traumatic Brain Injury: What Families Need to Know",
    excerpt: "Traumatic brain injury affects every patient differently. Homecare neurological physiotherapy provides consistent, environment-specific rehabilitation that drives meaningful recovery.",
    date: "April 12, 2025",
    isoDate: "2025-04-12",
    author: "Goswami Rehab",
    category: "Neuro Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Traumatic brain injury (TBI) is one of the most complex conditions in rehabilitation medicine. No two injuries are identical — the location and severity of the brain injury determine an entirely unique pattern of physical, cognitive, and emotional consequences.

What is consistent across TBI cases is that rehabilitation is individualised and may involve early, ongoing physiotherapy alongside medical and neuropsychological care. The pace and extent of change vary, and progress is reviewed over time.

### The Physical Consequences of TBI

Depending on the location and extent of injury, physical challenges after TBI may include:

- **Hemiplegia or hemiparesis**: Weakness or paralysis on one side of the body
- **Ataxia**: Problems with coordination and balance from cerebellar involvement
- **Spasticity**: Increased muscle tone causing stiffness and abnormal postures
- **Fatigue**: Neurological fatigue is different from ordinary tiredness — it is profound and poorly understood by those who haven't experienced it
- **Cognitive-motor impairments**: Difficulty planning, initiating, and sequencing movements

### Goals of Neurological Physiotherapy

**Restoring Safe Mobility**
Beginning with bed mobility, transfers, and standing tolerance, progressing to walking with appropriate aids, and then reducing or eliminating those aids over time.

**Managing Spasticity**
Positioning programs, passive stretching, and active movement may help manage stiffness and the risk of contractures (shortening of muscles and tendons) while maintaining tissue health in affected limbs.

**Rebuilding Motor Control**
Specific, repetitive task training using the affected limbs can connect practice with daily goals. The balance between active and assisted practice should be guided by the person's ability, fatigue, safety, and rehabilitation plan.

**Balance and Falls Prevention**
TBI frequently disrupts the cerebellum and vestibular pathways. Structured balance training, starting from supported positions and progressing to dynamic and dual-task conditions, is a core component.

### The Role of the Family

Family members are often the primary caregivers after TBI. Our approach involves teaching family members safe handling, positioning, and how to encourage the patient to use their affected side in daily activities. Learned non-use — where the person habitually uses only their unaffected side — can make daily tasks harder. Families can support safe use of the affected side when advised by the treating team.

### Long-Term Outlook

Recovery after TBI is often slow and non-linear, with good days and hard days. Some people continue to change over months or years, but the trajectory and goals are individual. A rehabilitation team can review progress and update the plan over time.

Goswami Rehab provides homecare neuro-rehabilitation for TBI patients at all stages of recovery — from early post-acute through to long-term community rehabilitation. Our team works with your medical team and adapts the program as your recovery evolves.`
  },
  {
    id: "7",
    slug: "occupational-therapy-homecare",
    title: "Occupational Therapy at Home: Rebuilding Independence After Illness or Injury",
    excerpt: "Occupational therapy bridges the gap between clinical recovery and real life. Here's how homecare OT helps neurological and orthopaedic patients regain the skills of daily living.",
    date: "May 20, 2025",
    isoDate: "2025-05-20",
    author: "Goswami Rehab",
    category: "Occupational Therapy",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `When a patient leaves hospital after a stroke, brain injury, or major orthopaedic surgery, the clinical team often declares them "medically stable." But medically stable is not the same as functionally independent. The patient may still be unable to dress themselves, prepare a cup of tea, manage their medication, or use the toilet without help.

This is precisely the gap that occupational therapy (OT) fills.

Occupational therapy focuses on restoring the ability to perform the meaningful activities of daily life — not just isolated movement, but purposeful function in context. Homecare OT is uniquely powerful because it works within the actual environment where the patient lives, using their real objects, their real kitchen, their real bathroom.

### What Occupational Therapy Addresses

**Activities of Daily Living (ADL)**
The foundational OT goal is independence in basic self-care: bathing, dressing, grooming, eating, and toileting. After neurological events like stroke or brain injury, these tasks are often the most immediately impaired and the most important to restore.

**Instrumental Activities of Daily Living (IADL)**
Higher-level tasks — cooking, managing finances, using a phone, shopping, driving — are addressed once basic ADL are established. Returning to these activities represents true reintegration into life.

**Cognitive Rehabilitation**
After stroke or brain injury, cognitive impairments (memory, attention, planning, problem-solving) can be as disabling as physical ones. OT uses structured, real-world tasks to rehabilitate these functions — cooking a meal exercises planning and sequencing; managing a shopping list exercises memory and attention.

**Home Modification and Assistive Equipment**
Our OT team assesses the home environment and recommends practical modifications:
- Grab rails in bathroom and beside the toilet
- Raised toilet seats and shower chairs
- Non-slip mats and threshold ramps
- Adapted cutlery, dressing aids, and long-handled tools
- Appropriate wheelchair or walking aid specification

### OT After Stroke

Stroke often affects one side of the body disproportionately, creating a pattern of weakness and sensory loss that impacts virtually every daily task. OT after stroke focuses heavily on:

- Re-learning one-handed techniques for dressing, cooking, and personal care
- Restoring bilateral hand use through task-specific upper limb training
- Addressing neglect (a condition where the patient ignores one side of their environment)
- Compensatory strategies for vision and cognitive changes

### OT After Orthopaedic Surgery

Following hip or knee replacement, joint precautions create immediate practical challenges. Patients cannot bend past 90 degrees, cannot cross their legs, and must not use low furniture. OT ensures:

- The patient can perform all daily activities within their precautions
- The home is modified appropriately before discharge
- The patient and family understand safe techniques for every relevant task
- Return to driving is assessed and planned

### The OT-Physiotherapy Partnership

Occupational therapy and physiotherapy work best together. Physiotherapy rebuilds the underlying movement capacity. Occupational therapy ensures that capacity translates into functional independence. At Goswami Rehab, our homecare programs integrate both disciplines — each session is purposeful, coordinated, and building toward the patient's specific life goals.`
  },
  {
    id: "8",
    slug: "guillain-barre-syndrome-recovery",
    title: "Guillain-Barré Syndrome: What It Is and How Physiotherapy Supports Recovery",
    excerpt: "GBS can involve rapid weakness, hospital or ICU care, and a long rehabilitation process. This guide explains how physiotherapy may support recovery alongside medical management.",
    date: "June 2, 2025",
    isoDate: "2025-06-02",
    author: "Goswami Rehab",
    category: "Neuro Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Guillain-Barré Syndrome (GBS) is one of the most acutely terrifying neurological conditions a person can face. Within days — sometimes hours — an otherwise healthy person can go from mild leg weakness to complete paralysis and respiratory failure requiring mechanical ventilation.

Recovery from GBS varies widely. Medical management and rehabilitation can support movement, breathing, function, and participation, but the pace and eventual level of independence cannot be predicted for an individual. Physiotherapy is coordinated with the medical team from the acute phase onward.

### GBS and Physiotherapy Rehabilitation

GBS is an autoimmune condition in which the body's immune system mistakenly attacks the peripheral nervous system — the network of nerves outside the brain and spinal cord. This demyelination (damage to the nerve's insulating sheath) disrupts the signals travelling between the brain and the muscles.

The condition typically follows an infection (respiratory or gastrointestinal) by 2–4 weeks. The ascending pattern of weakness — starting in the legs and moving upward — is characteristic. At its peak, 25–30% of patients require respiratory support.

Once the acute immune process settles, nerves may begin to recover, but the timing varies. Physiotherapy focuses on protecting the body during the acute phase and supporting safe activity as strength and sensation change.

### Phase 1 — Acute Phase (ICU/Hospital)

During the acute phase, physiotherapy may help reduce the risks associated with immobility:

- **Chest physiotherapy**: Airway clearance techniques may be considered for people on ventilators or at risk of aspiration, as directed by the medical team
- **Passive movement**: Regular gentle ranging of the limbs may help manage joint stiffness and maintain soft-tissue length
- **Positioning**: Careful positioning can help reduce pressure, contracture, and nerve-compression risks
- **Sensory stimulation**: Touch and proprioceptive input supports neurological awareness even when movement is absent

### Phase 2 — Recovery Phase (Hospital and Homecare)

As nerve function begins to return, the rehabilitation intensifies. GBS recovery follows the reverse of the disease progression — function typically returns proximally (shoulders, hips) before distally (hands, feet).

Key physiotherapy goals:
- **Progressive strengthening**: As muscles recover from weakness, carefully graded strengthening can build capacity. Fatigue needs to be monitored because excessive loading may worsen symptoms
- **Gait retraining**: Walking is relearned from supported standing to independent ambulation, often requiring temporary aids
- **Fatigue management**: Post-GBS fatigue is profound and poorly understood. Pacing strategies are essential — both during sessions and across the day
- **Balance rehabilitation**: Proprioceptive loss (impaired sense of body position) can affect balance; structured balance training may be included when safe
- **Fine motor retraining**: Hand function may take time to return; task-specific practice for writing, dressing, and daily tasks can support participation

### What Families Need to Know

GBS recovery takes time and may continue for months or longer. The pattern is non-linear, so goals and session intensity should be reviewed as symptoms, strength, fatigue, and medical advice change.

The emotional dimension is significant. Patients who were fully independent adults, often in the prime of their lives, face complete physical dependence. Acknowledging this, supporting psychological wellbeing, and celebrating every milestone is part of comprehensive GBS rehabilitation.

At Goswami Rehab, our homecare GBS programs are designed to meet the patient at whatever stage of recovery they are in — from early post-discharge to long-term community rehabilitation.`
  },
  {
    id: "9",
    slug: "copd-physiotherapy-management",
    title: "COPD and Pulmonary Physiotherapy: Breathing Better, Living More",
    excerpt: "COPD affects breathing, activity tolerance, and daily life. Pulmonary physiotherapy at home may support breathlessness management, pacing, and confidence with daily activity alongside medical care.",
    date: "June 16, 2025",
    isoDate: "2025-06-16",
    author: "Goswami Rehab",
    category: "Pulmonary Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Chronic Obstructive Pulmonary Disease (COPD) can affect breathing, activity tolerance, and participation in daily life. Pulmonary rehabilitation combines education, breathing strategies, exercise, and pacing, and should be planned with the person's medical team.

Pulmonary physiotherapy at home may make rehabilitation more accessible when travel, fatigue, or breathlessness make clinic visits difficult. The program can include breathing rehabilitation, airway-clearance guidance, and graded exercise adapted to the person's symptoms and medical advice.

### COPD and Pulmonary Physiotherapy

COPD is an umbrella term for progressive lung conditions — primarily chronic bronchitis and emphysema — characterised by airflow limitation that is not fully reversible. The primary causes are long-term smoking and occupational dust or chemical exposure.

The central symptom is breathlessness (dyspnoea) — initially on exertion, and in advanced disease, at rest. Chronic cough, sputum production, and repeated chest infections (exacerbations) are common. A sudden or severe change in symptoms needs medical assessment rather than an exercise adjustment alone.

### What Pulmonary Physiotherapy Does

**1. Breathing Retraining**

Most COPD patients develop inefficient breathing patterns — rapid, shallow breathing that uses the accessory muscles (neck and shoulder muscles) rather than the diaphragm. This is exhausting and less effective at moving air.

Pulmonary physiotherapy re-establishes diaphragmatic breathing:

- **Pursed-lip breathing**: Breathing out through pursed lips can slow exhalation and may make breathlessness feel more manageable for some people
- **Diaphragmatic breathing**: Breathing practice may help some people coordinate their breathing, but it should be individualised rather than forced
- **Positions of ease**: Forward-lean positions that fix the shoulder girdle allow the accessory muscles to assist breathing more efficiently during acute breathlessness

**2. Airway Clearance Techniques**

Excessive mucus production is a hallmark of chronic bronchitis. Retained secretions increase infection risk and block airflow. Physiotherapy teaches and supervises:

- **Active Cycle of Breathing Technique (ACBT)**: A structured sequence of breathing exercises that mobilises secretions from small to large airways for expectoration
- **Autogenic drainage**: A self-management technique using controlled breathing at different lung volumes to shift secretions
- **Positioning**: Gravity-assisted drainage positions for patients with significant sputum retention

**3. Exercise Training**

Exercise training is an important part of pulmonary rehabilitation and can support breathlessness management, exercise capacity, and quality of life in COPD when progressed safely.

The physiological logic: COPD patients become breathless with exertion, so they reduce activity, which leads to deconditioning, which makes them more breathless with less exertion — a vicious cycle. Exercise training breaks this cycle.

Homecare exercise programs include:
- Walking programs with structured progression
- Lower limb strengthening (the most evidence-supported component)
- Upper limb training (important for tasks like washing hair and reaching shelves)
- Interval training for patients who cannot sustain continuous exercise

**4. Energy Conservation**

Fatigue and breathlessness limit the amount of energy available for daily activities. Occupational therapy principles applied within physiotherapy teach patients to:

- Prioritise and sequence activities to manage energy across the day
- Use breathing techniques during specific activities (stairs, bending, lifting)
- Pace household tasks and plan rest periods

### Managing Exacerbations

Acute exacerbations are periods of worsening symptoms, often triggered by infection or other factors. During an exacerbation, medical assessment takes priority; our homecare team may support rehabilitation after the acute phase:

- Increased airway clearance to manage excess secretions
- Supervised breathing techniques during acute breathlessness
- Monitoring for deterioration requiring medical escalation
- Post-exacerbation rehabilitation to restore function lost during the acute period

### What Evidence Supports Pulmonary Rehabilitation?

Pulmonary rehabilitation is supported by clinical research for improving exercise capacity, breathlessness, and quality of life for many people with COPD. The size and duration of benefit vary, so a clinician should help decide whether a program is suitable.

At Goswami Rehab, we provide homecare pulmonary physiotherapy for COPD patients across India. Our programs are tailored to disease severity, comorbidities, and each patient's daily life demands.`
  },
  {
    id: "6",
    slug: "rotator-cuff-surgery-rehabilitation",
    title: "Rotator Cuff Repair Rehabilitation: A Stage-by-Stage Recovery Plan",
    excerpt: "Rotator cuff surgery is followed by months of staged physiotherapy. This guide explains the usual rehabilitation phases, protection of the repair, and questions to discuss with your surgeon and physiotherapist.",
    date: "May 5, 2025",
    isoDate: "2025-05-05",
    author: "Goswami Rehab",
    category: "Ortho Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `The rotator cuff is a group of four muscles and their tendons that surround the shoulder joint, providing stability and enabling the wide range of arm movement the shoulder is capable of. When one or more of these tendons tear — through injury or degeneration — surgery may be required to reattach them.

Rotator cuff repair is an anchor-based procedure that reattaches the torn tendon to the bone. The biology of tendon-to-bone healing is slow: it takes approximately 12 weeks for the repaired tissue to develop meaningful strength. The entire rehabilitation process spans 6–12 months depending on tear size and patient factors.

This is not a quick recovery. Physiotherapy aims to support safe movement and function, but the outcome depends on the tear, repair, healing, symptoms, and the wider rehabilitation plan.

### Why Homecare Physiotherapy Suits Shoulder Rehab

Shoulder rehabilitation requires precise, pain-free movement in multiple planes — activities that map directly onto daily life tasks. Reaching for a glass, getting dressed, washing hair — these are the functional targets. Homecare physiotherapy works on exactly these tasks in exactly the environment where they occur.

### Phase 1 — Passive Range of Motion (Weeks 1–6)

The repaired tendon must be protected while it heals. During this phase, the arm may be kept in a sling and the physiotherapist may perform passive movements — moving the arm through range without muscle contraction from the patient — according to the surgeon's protocol. This can support movement without placing unnecessary load on the healing repair.

Key points:
- The sling is worn at all times except during exercises and hygiene
- No active use of the operated arm
- Pendulum exercises in gravity-eliminated positions are introduced early
- Elbow, wrist, and hand exercises maintain circulation and prevent stiffness below the repair

### Phase 2 — Active-Assisted and Active Range of Motion (Weeks 6–12)

As the repair gains biological strength, the patient begins to actively assist movement with the operated arm. Movements progress gradually from gravity-eliminated to gravity-resisted positions.

Goals:
- Achieve forward flexion and abduction to 90 degrees by week 8–10
- Begin gentle isometric strengthening (muscle contraction without joint movement)
- Progress to active overhead reaching by weeks 10–12

### Phase 3 — Strengthening (Months 3–6)

The focus shifts to rebuilding the strength and endurance of the rotator cuff and the shoulder stabilisers (particularly the lower trapezius and serratus anterior). Light resistance training progresses to moderate resistance as tissue strength develops.

Common exercises:
- External rotation with resistance band
- Prone Y, T, and W exercises for scapular control
- Progressive pushing and pulling patterns

### Phase 4 — Return to Full Function (Months 6–12)

For patients who use their arms for sport, heavy work, or overhead activities, the final phase involves sports-specific loading, power development, and return-to-activity testing. Full clearance for overhead sport typically occurs at 9–12 months for large tears.

### Protecting the Repair

The most important principle throughout rehabilitation: **never push through sharp or catching pain in the shoulder**. Discomfort from the surrounding muscles working hard is normal. Pain at the repair site is a warning signal. Our physiotherapists teach patients to distinguish between the two.

Goswami Rehab delivers post-rotator cuff repair homecare programs with structured progression, regular reassessment, and close coordination with your orthopaedic surgeon throughout your recovery.`
  },
  {
    id: "12",
    slug: "cardiopulmonary-rehab-at-home",
    title: "Cardiopulmonary Rehabilitation at Home: COPD, Heart Failure & Post-Bypass Recovery",
    excerpt: "Homecare cardiopulmonary rehabilitation brings specialised respiratory and cardiac physiotherapy to people across India who may find repeated clinic travel difficult.",
    date: "June 30, 2025",
    isoDate: "2025-06-30",
    author: "Goswami Rehab",
    category: "Cardiopulmonary Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Cardiopulmonary rehabilitation is a structured program of exercise, breathing retraining, and education for people with heart and lung conditions. Access can be difficult when someone is short of breath or recovering from cardiac surgery, especially if the program requires repeated trips to a hospital or clinic.

Homecare cardiopulmonary rehabilitation may make some parts of a program more accessible. Our physiotherapists can adapt exercise, breathing practice, and education to the person's symptoms, medical advice, and home environment.

### Who May Be Suitable?

**COPD (Chronic Obstructive Pulmonary Disease)**
COPD can involve persistent breathlessness, reduced exercise capacity, and exacerbations. Structured pulmonary rehabilitation may improve exercise tolerance and breathlessness for some people; the suitability and expected benefit should be reviewed with a clinician.

**Post-Cardiac Bypass Surgery**
After coronary artery bypass grafting (CABG), patients may face a long recovery involving sternal wound healing, deconditioning, respiratory symptoms, and fear of exertion. Cardiac rehabilitation can include breathing exercises, progressive walking, and guidance on returning to activity under the surgical or cardiac team's advice.

**Heart Failure**
Some people with stable heart failure may be suitable for carefully graded exercise, but the program must be cleared and monitored according to the cardiac team's advice. Goals can include activity tolerance, symptom management, and daily function.

**Post-Cardiac Event Recovery**
After myocardial infarction or another acute cardiac event, supervised rehabilitation may support a gradual return to activity and daily function. Timing and intensity must be determined with the treating cardiac team.

### What Can a Session Include?

**Breathing Retraining** — Pursed-lip breathing, diaphragmatic breathing, and paced breathing techniques reduce breathlessness and improve breathing efficiency. Particularly valuable for COPD patients during exertion and for post-bypass patients managing sternal discomfort.

**Airway Clearance** — Active cycle of breathing, huffing, and postural drainage help clear secretions — common in COPD, bronchiectasis, and post-operative states.

**Graded Exercise** — Starting from the patient's current baseline and progressively increasing intensity. Walking programs, cycling, and functional movement tasks chosen based on goals and home environment.

**Respiratory Muscle Training** — Specific exercises to strengthen the diaphragm and accessory breathing muscles.

**Energy Conservation and Pacing** — Teaching patients to organise daily tasks, use rest breaks effectively, and sequence activities to reduce breathlessness.

### The Evidence

Clinical reviews support pulmonary rehabilitation as an option for improving exercise capacity, breathlessness, and quality of life for many people with COPD. Cardiac rehabilitation may also support safe activity and daily function, but individual results vary.

Access to cardiopulmonary rehabilitation can be limited. Homecare is one delivery option for people who cannot easily travel, but it is not suitable for every condition or stage of recovery and should be coordinated with medical care.

Goswami Rehab provides homecare cardiopulmonary rehabilitation across 15 Indian states. Contact us to discuss whether our programme is right for your condition.`
  },
  {
    id: "10",
    slug: "complex-case-recovery-physiotherapy",
    title: "Advanced Physiotherapy for Complex Cases: Post-ICU, Multi-System & Neurological Recovery",
    excerpt: "Post-ICU syndrome, multi-system conditions, and complex neurological cases demand a different level of rehabilitation expertise. Here's how advanced homecare physiotherapy addresses the hardest cases.",
    date: "July 10, 2025",
    isoDate: "2025-07-10",
    author: "Goswami Rehab",
    category: "Neuro Rehabilitation",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Some patients have needs that span more than one area of rehabilitation. They may have spent weeks in the ICU or have neurological, cardiac, or respiratory complications. Recovery is non-linear, needs can change, and a standard post-discharge pathway may need to be adapted to the individual.

These are complex cases. And they are what Goswami Rehab's advanced recovery team is built for.

### What Can Complex Rehabilitation Involve?

A complex case typically involves one or more of the following:

- **ICU-acquired weakness** — the profound muscle weakness that develops during prolonged intensive care admission
- **Post-ICU syndrome** — a cluster of physical, cognitive, and psychological problems persisting after ICU discharge
- **Multi-system involvement** — neurological deficits alongside cardiac, respiratory, or metabolic complications
- **Traumatic brain injury (TBI)** with associated physical impairments
- **Guillain-Barré syndrome (GBS)** requiring intensive, prolonged rehabilitation
- **Post-sepsis rehabilitation** — addressing widespread muscle and organ damage from severe infection
- **Complex stroke** with severe deficits affecting multiple systems

### Why These Cases Require a Specialist Approach

Standard physiotherapy protocols are designed for single-system conditions. A post-TKR patient follows a well-mapped 12-week pathway. A complex neurological case does not.

Complex cases require:

**Comprehensive Assessment** — Before any treatment, a full evaluation across motor function, sensation, cognition, respiratory capacity, swallowing, skin integrity, and functional independence. This assessment informs what to prioritise, what to defer, and what to monitor.

**Dynamic Goal-Setting** — Goals should be realistic, regularly reviewed, and adjusted as the patient's condition evolves. A patient recovering from GBS may progress from severe weakness toward improved mobility, but the rate is unpredictable. The program should be reviewed as symptoms, fatigue, and function change.

**Multi-Domain Treatment** — A post-ICU patient may need respiratory physiotherapy alongside limb strengthening and cognitive retraining. Our physiotherapists hold expertise across these domains.

**Family and Carer Training** — Complex patients require support between sessions. Training family members in safe positioning, passive movements, transfers, and skin care extends therapy into every day, not just session days.

### Post-ICU Syndrome: Common Rehabilitation Needs

Post-ICU syndrome (PICS) is one of the most underrecognised conditions in Indian healthcare. Patients who survive prolonged ICU admissions face:

- **ICU-acquired weakness** — muscle wasting so severe that some patients cannot lift their limbs against gravity on discharge
- **Respiratory compromise** — impaired lung function, respiratory muscle weakness
- **Cognitive impairment** — memory, concentration, and processing speed deficits
- **Psychological effects** — PTSD, depression, and anxiety relating to the ICU experience

Rehabilitation after ICU may address several of these domains, progress at the patient's pace, and be delivered at home when that setting is safe and appropriate.

### Advanced Neurological Rehabilitation

For patients with TBI, GBS, or severe stroke, neurological recovery takes place over months and years. Neuroplasticity — the brain's ability to rewire itself — is maximised by intensive, task-specific, repetitive practice.

Key principles:
- High-repetition, task-specific training targeting personal goals
- Constraint-induced movement therapy (CIMT) principles in the home environment
- Progressive difficulty with appropriate challenge to drive neuroplasticity
- Regular reassessment using standardised outcome measures (Barthel Index, BERG Balance Scale, MRC Scale)
- Close coordination with the treating neurologist and medical team

Goswami Rehab accepts complex case referrals from families, medical teams, and discharge coordinators across India. Contact us to discuss your case.`
  },
  {
    id: "13",
    slug: "physiotherapist-at-home-mumbai",
    title: "Physiotherapist at Home in Mumbai — What to Expect",
    excerpt: "Mumbai's traffic makes clinic visits difficult during recovery. Here's everything you need to know about booking expert homecare physiotherapy in Mumbai — conditions treated, what happens in a session, and how to get started.",
    date: "July 21, 2025",
    isoDate: "2025-07-21",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Recovering from surgery, a stroke, or a neurological condition is hard enough without adding a long commute across Mumbai to the equation. Homecare physiotherapy brings expert rehabilitation directly to your home in Mumbai — whether you're in Bandra, Andheri, Powai, Thane, Navi Mumbai, or South Mumbai.

At Goswami Rehab, our specialist physiotherapists travel to you, work within your home environment, and build a treatment program around your specific condition and goals.

### Homecare Physiotherapy Services in Mumbai

Mumbai's homecare physiotherapy team manages a wide range of conditions:

- **Stroke rehabilitation** — early and long-term neuro rehab to restore movement, balance, and independence
- **Post-surgery recovery** — knee replacement, hip replacement, rotator cuff repair, spinal surgery
- **Cardiopulmonary rehabilitation** — COPD, post-cardiac bypass, heart failure, post-COVID respiratory rehab
- **Guillain-Barré syndrome (GBS)** — intensive progressive rehab from flaccid paralysis to walking
- **Parkinson's disease** — gait training, balance, LSVT BIG, fall prevention
- **Post-ICU complex recovery** — ICU-acquired weakness, multi-system conditions, post-sepsis
- **Neurological physiotherapy** — traumatic brain injury, spinal cord conditions, neuro rehab
- **Back, neck, and joint pain** — musculoskeletal physiotherapy at home

### What Happens in a Homecare Physiotherapy Session?

Your first session is a 60–90 minute assessment visit. Our physiotherapist will review your medical history and investigations, assess your strength, balance, range of motion, and functional ability, and map out a personalised treatment plan with clear goals.

Subsequent sessions (typically 45–60 minutes) follow the plan, with regular reassessment built in. We track your progress using standardised outcome measures — Barthel Index, BERG Balance Scale, MRC Scale — and adapt the program as your condition improves.

### When Homecare Physiotherapy May Be Helpful in Mumbai

For stroke patients, a familiar home environment may make practice more relevant and comfortable. For post-surgical patients, working with the actual chairs, stairs, and bathroom can help connect exercises with daily tasks. For COPD and cardiac patients, avoiding unnecessary travel may make consistent rehabilitation easier when the medical team considers homecare appropriate.

### Cost of Homecare Physiotherapy in Mumbai

Standard rates for specialist homecare physiotherapy in Mumbai are ₹2,500–₹3,000 per session. Goswami Rehab currently offers introductory pricing of {{price.homeVisit.introductory}} while it expands coordinated home-visit coverage and gathers early patient feedback. Online telehealth consultations are available at {{price.telehealth.introductory}} per session.

### How to Book

Booking is straightforward: fill in our online form with your name, location in Mumbai, condition, and preferred dates. Our team will contact you within 24 hours.

[→ View our Mumbai physiotherapy page for full details and availability](/physiotherapist-at-home/mumbai)`
  },
  {
    id: "14",
    slug: "physiotherapist-at-home-delhi",
    title: "Post-Surgery Home Physiotherapy in Delhi — A Complete Guide",
    excerpt: "After surgery in Delhi, the real recovery happens at home. Expert homecare physiotherapy brings specialist rehabilitation directly to you — no traffic, no waiting rooms, no compromises.",
    date: "July 22, 2025",
    isoDate: "2025-07-22",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Delhi's hospitals provide joint replacement, cardiac, and neurological care to patients from across the region. After surgery, rehabilitation helps people work toward their own mobility and daily-life goals. Homecare physiotherapy can make that rehabilitation easier to access when clinic travel is difficult.

Whether you're in South Delhi, North Delhi, Dwarka, Rohini, or the broader NCR region, Goswami Rehab's specialist physiotherapists come to you.

### Why Homecare Physiotherapy Makes Sense in Delhi

Post-surgery, even a short car journey may be painful, tiring, or unsuitable at a particular stage. Delhi's traffic adds considerable time to clinic visits. Homecare physiotherapy reduces that travel burden when a home visit is clinically appropriate; your physiotherapist works with the equipment and environment available at home.

For stroke and neurological patients, rehabilitation in the home setting can be directly relevant to daily life — the same corridors, bathroom, and stairs they may need to navigate every day.

### Homecare Physiotherapy Services in Delhi

Our Delhi homecare team specialises in:

- **Post-surgery physiotherapy** — knee replacement, hip replacement, cardiac bypass, spinal surgery, rotator cuff repair
- **Stroke rehabilitation** — acute and long-term neuro rehab, upper limb function, gait retraining
- **Neurological rehabilitation** — Parkinson's disease, traumatic brain injury, GBS, spinal cord conditions
- **Cardiopulmonary rehabilitation** — COPD, post-bypass cardiac rehab, heart failure, post-COVID lung rehab
- **Complex post-ICU recovery** — ICU-acquired weakness, multi-system conditions
- **Musculoskeletal physiotherapy** — back pain, neck pain, joint conditions

### What to Expect: Week by Week After Knee or Hip Replacement

**Weeks 1–2**: Pain and swelling management, early mobility exercises, and safe transfers. Visit frequency depends on the surgical team's advice, the person's needs, and local availability.

**Weeks 3–6**: Progressive strengthening, walking with decreasing support, restoring range of motion. Most patients transition from a walker to a cane in this phase.

**Months 2–3**: Building the muscle strength needed for stairs, driving, and returning to daily activities. Sessions reduce to 2–3 per week as independence grows.

### Cost of Homecare Physiotherapy in Delhi

Expert homecare physiotherapy in Delhi typically costs ₹2,500–₹3,000 per session. Goswami Rehab's introductory pricing is {{price.homeVisit.introductory}} per home visit while it expands coordinated coverage and gathers early patient feedback. Online telehealth consultations for follow-up and exercise review cost {{price.telehealth.introductory}} per session.

### How to Book a Home Visit in Delhi

Submit your details through our booking form — name, Delhi locality or pin code, condition, and preferred dates — and our team will confirm within 24 hours.

[→ View our Delhi physiotherapy page for locations and availability](/physiotherapist-at-home/delhi)`
  },
  {
    id: "15",
    slug: "physiotherapist-at-home-bengaluru",
    title: "Physiotherapist at Home in Bengaluru — Expert Rehab Without the Commute",
    excerpt: "Bengaluru's traffic is legendary. For patients recovering from surgery or managing a neurological condition, adding a clinic commute to daily life is often impossible. Homecare physiotherapy solves this.",
    date: "July 23, 2025",
    isoDate: "2025-07-23",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `For anyone in Bengaluru who has experienced the city's traffic, regular clinic visits during recovery from knee replacement, stroke, or cardiac surgery can be daunting. Homecare physiotherapy is one option for supporting consistent rehabilitation when travel is difficult and a home visit is clinically appropriate.

Goswami Rehab serves patients across Bengaluru — from Whitefield and Sarjapur to Jayanagar, Indiranagar, Yelahanka, and beyond.

### How Homecare Physiotherapy May Help

Rehabilitation delivered in the patient's own environment can make exercises more relevant to daily tasks. The patient can practise in the spaces they use every day, and family members may observe and assist when advised by the treating team.

For stroke patients: navigating your own bathroom, climbing your own stairs, reaching your own shelves. For post-surgical patients: sitting in your own chairs, using your own toilet. This specificity is not possible in a clinic.

### Homecare Physiotherapy Services in Bengaluru

Our Bengaluru physiotherapy team covers:

- **Stroke rehabilitation** — neuro physiotherapy, upper limb recovery, gait retraining, spasticity management
- **Sports injury rehabilitation** — Bengaluru's active population means sports injuries are common; rehab at home means no gym visits during recovery
- **Post-surgery physiotherapy** — knee replacement, hip replacement, rotator cuff, spinal surgery
- **Neurological conditions** — Parkinson's disease, traumatic brain injury, GBS, multiple sclerosis
- **Cardiopulmonary rehabilitation** — COPD, post-cardiac bypass, heart failure
- **Post-ICU complex recovery** — ICU-acquired weakness, multi-system rehabilitation

### The First Session: What Happens

Your first homecare physiotherapy session in Bengaluru is an assessment visit of 60–90 minutes. The physiotherapist reviews your medical records, performs a comprehensive physical assessment, identifies your goals, and begins initial treatment. You leave the session with a clear understanding of your program, session frequency, and expected trajectory.

Progress is measured at regular intervals using standardised tools so improvements are objective, not just subjective.

### Neurological Rehabilitation at Home in Bengaluru

Bengaluru has a high concentration of neurologists and neurosurgeons — patients often come from across Karnataka and neighbouring states for hospital care. Post-discharge homecare neurological rehabilitation can help continue appropriate practice at home, with progress reviewed against the hospital and rehabilitation team's plan.

For Parkinson's disease patients, regular homecare physiotherapy may support mobility, balance, and safer daily activity in the person's living environment. For stroke patients, repetitive, task-specific practice may help connect rehabilitation with daily goals; the plan and response vary by person.

### Cost and Booking in Bengaluru

Standard homecare physiotherapy rates in Bengaluru are ₹2,500–₹3,000 per session. Goswami Rehab currently offers introductory pricing of {{price.homeVisit.introductory}} per session for home visits while it expands coordinated coverage and gathers early patient feedback, and {{price.telehealth.introductory}} for online telehealth consultations.

To book, fill in our online form with your Bengaluru locality, condition, and preferred dates. Our team will confirm availability.

[→ View our Bengaluru physiotherapy page for full service details](/physiotherapist-at-home/bengaluru)`
  },
  {
    id: "16",
    slug: "physiotherapist-at-home-hyderabad",
    title: "Physiotherapist at Home in Hyderabad — Specialist Rehabilitation Delivered to You",
    excerpt: "Hyderabad's growing population and hospital infrastructure mean many people need post-discharge rehabilitation. Homecare physiotherapy brings that rehabilitation to your doorstep when a home visit is appropriate.",
    date: "July 24, 2025",
    isoDate: "2025-07-24",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Hyderabad is home to some of India's finest hospitals — Apollo, Yashoda, KIMS, Continental — where patients from across Telangana and Andhra Pradesh come for complex surgeries, neurological interventions, and cardiac procedures. The challenge begins at discharge: accessing quality rehabilitation while managing recovery at home.

Goswami Rehab provides specialist homecare physiotherapy across Hyderabad — from Banjara Hills and Jubilee Hills to Kukatpally, Secunderabad, Madhapur, and HITEC City.

### Who Needs Homecare Physiotherapy in Hyderabad?

**Post-surgical patients**: After knee replacement, hip replacement, cardiac bypass, rotator cuff repair, or spinal surgery, the timing of physiotherapy should follow the surgical team's instructions. The journey to a clinic may be painful or tiring in the first weeks, so homecare physiotherapy can reduce travel when it is clinically appropriate.

**Stroke and neurological patients**: Neurological rehabilitation after stroke, TBI, or GBS requires consistency — frequent sessions, daily home practice, and environment-specific therapy. Homecare makes this possible in a way that clinic visits cannot.

**COPD and cardiac patients**: For patients who are breathless on minimal exertion, the idea of travelling to a clinic for respiratory physiotherapy is counterproductive. Bringing the rehab to the patient solves this precisely.

### Homecare Physiotherapy Services in Hyderabad

- **Stroke rehabilitation** — from early post-acute through long-term neuro rehab
- **Cardiopulmonary rehabilitation** — COPD management, post-bypass cardiac rehab, heart failure
- **GBS (Guillain-Barré syndrome)** — progressive rehabilitation for weakness, mobility, and daily activities
- **Post-surgery physiotherapy** — knee and hip replacement, rotator cuff, spinal and cardiac surgery
- **Parkinson's disease** — gait training, balance, rigidity management, fall prevention
- **Post-ICU syndrome** — ICU-acquired weakness, multi-system complex recovery

### What Hyderabad Patients Need to Know About Sessions

Each homecare physiotherapy session in Hyderabad begins with a brief review of how you've been since the last visit — any changes in symptoms, any difficulties with home exercises. Treatment follows, targeted at your current stage of recovery. Sessions conclude with clear guidance on what to practice before the next visit.

Our physiotherapists carry portable assessment and therapy equipment. For most conditions, no specialist equipment is needed at the patient's home — the body and its environment are the primary tools of rehabilitation.

### Cost of Homecare Physiotherapy in Hyderabad

Standard rates for specialist homecare physiotherapy in Hyderabad are ₹2,500–₹3,000 per session. Goswami Rehab introductory pricing is {{price.homeVisit.introductory}} per home visit while coordinated coverage expands, and {{price.telehealth.introductory}} for online telehealth consultations.

### Booking a Physiotherapist at Home in Hyderabad

Fill in our booking form with your Hyderabad locality, your condition, and your preferred dates. Our team confirms your appointment within 24 hours and assigns a specialist physiotherapist suited to your condition.

[→ See our full Hyderabad homecare physiotherapy service](/physiotherapist-at-home/hyderabad)`
  },
  {
    id: "17",
    slug: "physiotherapist-at-home-chennai",
    title: "Physiotherapist at Home in Chennai — Post-Surgery & Neuro Rehabilitation",
    excerpt: "Chennai's hospitals manage post-surgical and neurological care for patients who need rehabilitation after discharge. Homecare physiotherapy in Chennai can continue that support without requiring every visit to involve clinic travel.",
    date: "July 25, 2025",
    isoDate: "2025-07-25",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Chennai is home to hospitals such as Apollo, Fortis Malar, MIOT, and MGM, serving patients from across Tamil Nadu, Andhra Pradesh, and neighbouring states. After complex surgery or a neurological event, people return home needing rehabilitation that follows their hospital and medical team's guidance.

Goswami Rehab provides homecare physiotherapy across Chennai — from T. Nagar, Adyar, and Mylapore to Anna Nagar, Velachery, Porur, and OMR.

### How Homecare Physiotherapy Can Support Discharge Recovery

The timing of discharge varies with the procedure, medical status, and hospital protocol. After discharge, rehabilitation may continue in the community through a combination of home practice, follow-up, and physiotherapy. The plan should be set with the treating team.

For elderly patients in Chennai, the logistics of regular clinic visits (transport, stairs, waiting rooms) can be a physical challenge. For neurological patients, travel may add fatigue. Homecare physiotherapy is one option when a clinician considers a home visit safe and suitable.

### Homecare Physiotherapy Services in Chennai

Our Chennai homecare team provides:

- **Stroke rehabilitation** — comprehensive neuro physio targeting mobility, upper limb function, balance, and independence
- **Post-surgery physiotherapy** — knee replacement, hip replacement, cardiac bypass, rotator cuff, spinal surgery
- **Cardiopulmonary rehabilitation** — COPD, post-cardiac surgery, heart failure, post-COVID respiratory rehab
- **Neurological physiotherapy** — Parkinson's disease, traumatic brain injury, GBS, spinal cord conditions
- **Post-ICU complex recovery** — ICU-acquired weakness, multi-system conditions
- **Orthopaedic physiotherapy** — back and neck pain, joint conditions, fracture rehabilitation

### Stroke Rehabilitation at Home in Chennai

Stroke is one reason families in Chennai seek homecare physiotherapy. Rehabilitation needs can change over the first months and beyond, so the treating team can set priorities and review progress rather than relying on a fixed recovery window.

At home, the physiotherapist can work in the patient's own environment: walking along the actual corridor, using the actual bathroom, and sitting in the actual chairs. This can make practice more relevant to daily routines, without promising a particular rate of recovery.

### Cardiopulmonary Rehabilitation at Home in Chennai

Chennai's climate — hot and humid — can make breathlessness harder to manage for some people with COPD. Travelling to a clinic for pulmonary rehabilitation may add physical stress. Homecare pulmonary rehabilitation can bring breathing retraining, airway-clearance guidance, and graded exercise into the home environment when appropriate.

### Cost and Booking in Chennai

Homecare physiotherapy in Chennai costs ₹2,500–₹3,000 per session at standard rates. Goswami Rehab introductory pricing is {{price.homeVisit.introductory}} per home visit while the service expands coordinated coverage. Online telehealth consultations are {{price.telehealth.introductory}} per session.

To book, fill in our form with your Chennai locality, condition, and preferred dates. Our team will confirm within 24 hours.

[→ Full details on our Chennai homecare physiotherapy service](/physiotherapist-at-home/chennai)`
  },
  {
    id: "18",
    slug: "physiotherapist-at-home-kolkata",
    title: "Physiotherapist at Home in Kolkata — Expert Rehabilitation Delivered to Your Door",
    excerpt: "Kolkata's patients recovering from stroke, surgery, or complex neurological conditions deserve specialist rehabilitation without the stress of travel. Homecare physiotherapy in Kolkata brings that expertise home.",
    date: "July 26, 2025",
    isoDate: "2025-07-26",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Kolkata's established medical infrastructure — SSKM, Apollo Gleneagles, Fortis, Medica — handles complex neurological, cardiac, and orthopaedic cases from across West Bengal and the eastern states. After discharge, patients return home needing rehabilitation that continues the progress made in hospital.

Goswami Rehab provides specialist homecare physiotherapy across Kolkata — from Salt Lake and New Town to Ballygunge, Alipore, Behala, and Howrah.

### The Case for Homecare Physiotherapy in Kolkata

For some older people in Kolkata, regular clinic visits after surgery or stroke can be physically demanding. Homecare physiotherapy reduces the travel and waiting-room burden when a home visit is safe and appropriate.

For stroke patients, rehabilitation in the actual home environment can help connect practice with the skills needed there. Progress still depends on the person, the stroke, and the wider rehabilitation plan.

### Homecare Physiotherapy Services in Kolkata

Our Kolkata team specialises in:

- **Stroke rehabilitation** — neuro physiotherapy for mobility, upper limb, balance, and activities of daily living
- **GBS (Guillain-Barré syndrome)** — progressive rehabilitation for weakness, mobility, and daily activities, coordinated with the medical team
- **Post-surgery physiotherapy** — knee replacement, hip replacement, cardiac bypass, rotator cuff surgery
- **Cardiopulmonary rehabilitation** — COPD, heart failure, post-cardiac event recovery, post-COVID rehab
- **Parkinson's disease** — gait training, balance, rigidity management, cueing strategies
- **Post-ICU complex recovery** — ICU-acquired weakness, multi-system conditions, post-sepsis rehab
- **Neurological physiotherapy** — traumatic brain injury, spinal cord conditions

### What Families Need to Know About Homecare Physiotherapy

Family members are essential partners in homecare rehabilitation. Our physiotherapists train family members in safe patient handling — how to assist with transfers, how to support walking practice, how to encourage the patient to use their affected limb in daily activities.

Family involvement can help carry safe practice into daily routines between sessions when advised by the physiotherapist.

### Geriatric Physiotherapy at Home in Kolkata

For Kolkata's older patients, physiotherapy at home can address the person's condition while supporting mobility, strength, and balance. Our geriatric physiotherapy program is tailored to age, comorbidities, and the home environment, with attention to fall-risk reduction.

### Cost of Homecare Physiotherapy in Kolkata

Standard rates for specialist homecare physiotherapy in Kolkata are ₹2,500–₹3,000 per session. Goswami Rehab offers introductory pricing of {{price.homeVisit.introductory}} per home visit while it expands coordinated coverage and gathers early patient feedback, and {{price.telehealth.introductory}} for online telehealth consultations.

### How to Book in Kolkata

Fill in our booking form with your Kolkata locality, condition, and preferred dates. Our team responds within 24 hours to confirm your appointment and assign the right physiotherapist for your condition.

[→ View our full Kolkata homecare physiotherapy service page](/physiotherapist-at-home/kolkata)`
  },
  {
    id: "19",
    slug: "physiotherapist-at-home-pune",
    title: "Physiotherapist at Home in Pune — What Patients and Families Need to Know",
    excerpt: "Pune is home to a large, health-conscious population and some of Maharashtra's best hospitals. After surgery, stroke, or injury, expert homecare physiotherapy in Pune gets recovery back on track from day one of discharge.",
    date: "July 27, 2025",
    isoDate: "2025-07-27",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Pune's residents have access to hospitals including Ruby Hall, Jehangir, Sahyadri, and KEM, and many people need rehabilitation after discharge. Accessing consistent physiotherapy in the community can still be difficult for people managing pain, fatigue, or reduced mobility.

Goswami Rehab provides specialist homecare physiotherapy across Pune — from Shivajinagar and Koregaon Park to Kothrud, Hadapsar, Wakad, Baner, and Hinjewadi.

### What Conditions Benefit from Homecare Physiotherapy in Pune?

**Post-surgery rehabilitation**: Following knee or hip replacement, rotator cuff repair, spinal surgery, or cardiac bypass, the timing of physiotherapy should follow the surgical team's instructions. Travelling to a clinic in the early weeks may be difficult or painful, so homecare can bring the physiotherapist to the patient when appropriate.

**Neurological rehabilitation**: Stroke, traumatic brain injury, Parkinson's disease, and GBS may involve ongoing physiotherapy. Homecare is one way to support regular practice when clinic travel is difficult; frequency depends on the person and the rehabilitation plan.

**Cardiopulmonary conditions**: COPD and post-cardiac patients in Pune often cannot manage the exertion of clinic visits. Homecare pulmonary and cardiac rehabilitation removes this barrier.

**Sports injuries**: Pune has an active sports culture — running, cycling, football, cricket. Sports injury rehabilitation at home means athletes can continue conditioning the uninjured parts of their bodies while the injury heals, with physiotherapy guiding what's safe and what isn't.

### A Week-by-Week Overview: What Homecare Physiotherapy Looks Like

**Week 1**: The physiotherapist visits for an assessment, establishes a baseline, sets short-term goals, and begins treatment. For post-surgical patients, daily or alternate-day visits are typical.

**Weeks 2–4**: Sessions progress according to the treatment plan. The physiotherapist adjusts based on the patient's response. A home exercise program is established and refined.

**Month 2 onwards**: Session frequency typically reduces as the patient becomes more independent. Goals shift from basic function to full activity restoration.

### The Sports Physiotherapy Angle in Pune

Pune's population skews younger and more active than many Indian cities. Sports injuries — runners' knee, shoulder impingement, ankle sprains, muscle tears — are common, and athletes often resist clinic-based rehabilitation because of scheduling conflicts. Homecare sports physiotherapy fits around work and training schedules: the physiotherapist arrives at a time that works, assesses progress, and guides the next phase of rehabilitation.

### Post-Surgery Physiotherapy in Pune: What to Expect

After knee replacement, the most common post-surgical physiotherapy request in Pune, the homecare program follows a structured path:

- **Weeks 1–2**: Swelling management, early quadriceps activation, safe walking with support, and reducing stiffness risk
- **Weeks 3–6**: Progressive knee flexion, strength training, reducing walking aid dependence
- **Months 2–3**: Stair climbing, functional strength, return to driving and daily activities

### Cost and Booking in Pune

Homecare physiotherapy in Pune costs ₹2,500–₹3,000 per session at standard rates. Goswami Rehab's introductory pricing is {{price.homeVisit.introductory}} per home visit while it expands coordinated coverage. Online telehealth consultations cost {{price.telehealth.introductory}} per session.

To book, complete our online form with your Pune locality, condition, and preferred appointment dates. Our team confirms within 24 hours.

[→ View our Pune homecare physiotherapy service page](/physiotherapist-at-home/pune)`
  },
  {
    id: "20",
    slug: "physiotherapist-at-home-jaipur",
    title: "Physiotherapist at Home in Jaipur — Expert Rehabilitation Across the Pink City",
    excerpt: "Jaipur is home to Goswami Rehab's main base and some of Rajasthan's leading hospitals. Homecare physiotherapy in Jaipur brings specialist neuro, ortho, and cardiopulmonary rehabilitation directly to your door.",
    date: "July 28, 2025",
    isoDate: "2025-07-28",
    author: "Goswami Rehab",
    category: "City Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Jaipur is Goswami Rehab's home city — which means patients in Jaipur benefit from direct access to our most experienced physiotherapists, fastest response times, and deepest familiarity with local hospitals and their discharge protocols.

We provide homecare physiotherapy across Jaipur — from Malviya Nagar, C-Scheme, and Vaishali Nagar to Mansarovar, Jagatpura, Murlipura, and Tonk Road.

### Why Jaipur Patients Choose Homecare Physiotherapy

Jaipur's leading hospitals — SMS Medical College, Fortis Escorts, Manipal, Narayana — manage a high volume of orthopaedic surgeries, cardiac procedures, and neurological cases. After discharge, the rehabilitation journey begins at home.

Many Jaipur patients — particularly older residents or those with reduced mobility — find that clinic-based physiotherapy adds physical stress during recovery. Homecare can reduce that travel burden when a home visit is safe and appropriate.

### Homecare Physiotherapy Services in Jaipur

As our base city, Goswami Rehab's Jaipur team covers the widest range of conditions:

- **Stroke rehabilitation** — from early post-acute neuro physio through long-term community rehabilitation
- **Parkinson's disease** — gait training, cueing techniques, LSVT BIG, balance, fall prevention
- **Knee and hip replacement rehabilitation** — the most common post-surgical request in Jaipur
- **Cardiopulmonary rehabilitation** — COPD, post-cardiac bypass, heart failure
- **GBS (Guillain-Barré syndrome)** — intensive progressive rehabilitation
- **Post-ICU complex recovery** — ICU-acquired weakness, multi-system conditions
- **COPD and pulmonary rehabilitation** — breathing retraining, airway clearance, exercise training
- **Back, neck, and joint pain** — musculoskeletal physiotherapy at home
- **Geriatric physiotherapy** — fall prevention, mobility maintenance, strength and balance for older adults

### Knee Replacement Rehabilitation in Jaipur: The Homecare Advantage

Jaipur's orthopaedic teams perform knee and hip replacements at hospitals including SMS and private facilities. After surgery, the timing and intensity of homecare physiotherapy should follow the discharge plan and the surgeon's instructions.

Working in the patient's own home means the physiotherapist can assess the specific layout — the height of chairs, the configuration of the bathroom, the number of stairs — and build a rehabilitation program that addresses real, daily challenges rather than generic exercises.

### COPD and Pulmonary Rehabilitation in Jaipur

Jaipur's dry, dusty climate is particularly challenging for patients with COPD and chronic respiratory conditions. Homecare pulmonary physiotherapy removes the need to go outside during pollution episodes: breathing retraining, airway clearance techniques, and graded exercise happen in the controlled home environment.

### Cost and Booking in Jaipur

As our base city, Jaipur patients benefit from the same rates as all our other locations: ₹2,500–₹3,000 per session at standard rates, or {{price.homeVisit.introductory}} at our introductory rate while coordinated home-visit coverage expands. Online consultations are {{price.telehealth.introductory}} per session.

To book, fill in our form with your Jaipur locality, condition, and preferred dates. We respond within 24 hours — and in Jaipur, often much faster.

[→ View our full Jaipur homecare physiotherapy service page](/physiotherapist-at-home/jaipur)`
  },
  {
    id: "11",
    slug: "physiotherapist-at-home-india-guide",
    title: "How to Book a Physiotherapist at Home in India: Cost, Process & What to Expect",
    excerpt: "A practical guide to booking homecare physiotherapy across India — from cost and how sessions work, to which rehabilitation needs may be suitable for home visits and how to choose a provider.",
    date: "July 15, 2025",
    isoDate: "2025-07-15",
    author: "Goswami Rehab",
    category: "Homecare Guide",
    image: "https://goswamirehab.in/opengraph.jpg",
    content: `Homecare physiotherapy is where a qualified physiotherapist visits you at home rather than requiring every session to take place at a clinic. For people recovering from surgery, managing a chronic neurological condition, or living with pain or disability, a home visit may make rehabilitation easier to access when it is clinically appropriate.

### Which Rehabilitation Needs May Be Suitable for Home Visits?

**Neurological physiotherapy:** Stroke rehabilitation, Parkinson's disease, traumatic brain injury, Guillain-Barré syndrome, multiple sclerosis, and post-ICU neurological recovery may be considered after an assessment and medical review.

**Orthopaedic physiotherapy:** Knee replacement (TKR), hip replacement (THR), rotator cuff surgery, spinal surgery recovery, fracture rehabilitation, back and neck pain.

**Cardiopulmonary rehabilitation:** COPD, post-cardiac bypass, heart failure, and post-COVID respiratory rehabilitation may require clearance and coordination with the medical team.

**Complex rehabilitation:** Post-ICU syndrome, sepsis recovery, and multi-system injury rehabilitation require an individual safety assessment.

**General physiotherapy:** Sports injuries, muscle and joint pain, functional training, and post-operative rehabilitation can be discussed during an initial assessment.

### How Does Booking Work?

1. **Submit your details** — fill in the online form with your name, location, condition, and preferred dates
2. **Assessment call** — our team contacts you within 24 hours to understand your condition
3. **Appointment confirmation** — a specialist physiotherapist is assigned based on their expertise and your location
4. **First session** — assessment visit (60–90 minutes) at your home
5. **Treatment plan** — personalised program based on assessment findings and your goals

### How Much Does Homecare Physiotherapy Cost in India?

Typical rates at established specialist providers:
- **Standard homecare session**: ₹2,500 – ₹3,000 per session
- **Complex neurological or cardiopulmonary cases**: ₹3,000 – ₹4,000 per session
- **Online telehealth consultation**: ₹1,650 per session

**Goswami Rehab introductory rates:**
- Home visit: {{price.homeVisit.introductory}} per session (introductory rate)
- Online: {{price.telehealth.introductory}} per session (introductory rate)

### Payment Methods

We accept UPI (GPay, PhonePe, Paytm, BHIM), bank transfer (NEFT/IMPS/RTGS), and debit and credit cards. Payment instructions are provided after booking confirmation.

### What Happens in the First Session?

The first session is an assessment visit lasting 60–90 minutes. The physiotherapist will review your medical history and investigations, assess your strength, range of motion, balance, sensation, and functional ability, set short- and medium-term goals, begin initial treatment, and explain the proposed program and session frequency.

### How Many Sessions Might I Need?

- **Acute back or joint pain**: the number and spacing of sessions depend on assessment findings and response
- **Post-knee or hip replacement**: a staged plan reviewed with the surgical and physiotherapy teams
- **Stroke rehabilitation**: a plan that may change over weeks or months as goals and function change
- **COPD pulmonary rehab**: a medically supervised program with frequency set to symptoms and tolerance
- **Post-ICU complex recovery**: a longer plan with review as activity and independence change

Goswami Rehab operates across 15 Indian states with 35+ specialist physiotherapists. To book or confirm availability in your city, fill in our booking form.`
  }
].map((post) => ({
  ...post,
  author: BLOG_AUTHOR,
  ...(BLOG_SEO_BY_SLUG[post.slug] ?? {}),
  ...(clinicalSourcesBySlug[post.slug]
    ? { sources: clinicalSourcesBySlug[post.slug] }
    : {}),
}));

export const blogPosts: BlogPost[] = authoredBlogPosts.map((post) => ({
  ...post,
  content: resolveArticlePricing(post.content, post.slug),
}));

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function getBlogCatalogValidationErrors(posts: BlogPost[]): string[] {
  const seen = new Set<string>();
  const errors: string[] = [];

  for (const post of posts) {
    if (!post.slug.trim()) errors.push(`empty slug (post id ${post.id})`);
    if (seen.has(post.slug)) errors.push(`duplicate slug "${post.slug}"`);
    seen.add(post.slug);
    if (!post.metaTitle?.trim()) errors.push(`missing metaTitle for "${post.slug}"`);
    if (!post.metaDescription?.trim()) errors.push(`missing metaDescription for "${post.slug}"`);
    if (!isValidIsoDate(post.isoDate)) {
      errors.push(`invalid ISO date "${post.isoDate}" for "${post.slug}"`);
    }
  }

  return errors;
}

export function getBlogSlugParityErrors(
  authoredSlugs: string[],
  generatedSlugs: string[],
  surface = "generated article route",
): string[] {
  const authored = new Set(authoredSlugs);
  const generated = new Set(generatedSlugs);
  return [
    ...authoredSlugs
      .filter((slug) => !generated.has(slug))
      .map((slug) => `missing ${surface} for "${slug}"`),
    ...generatedSlugs
      .filter((slug) => !authored.has(slug))
      .map((slug) => `unexpected ${surface} for "${slug}"`),
  ];
}
