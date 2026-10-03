import type { BlogPost, ClinicalSource } from "./data";
import { BLOG_NUTRITION_AUTHOR_PROFILE } from "./content-profiles";

type BatchCityJournalPost = BlogPost & {
  citySlug: string;
  discipline: "physiotherapy" | "nutrition" | "exercise-physiology";
};

const source = (title: string, publisher: string, url: string): ClinicalSource => ({
  title,
  publisher,
  url,
});

const refs = {
  noidaSpinePhysio: source(
    "Post-operative spinal surgery physiotherapy",
    "NHS Greater Glasgow and Clyde",
    "https://www.nhsggc.scot/wp-content/uploads/2025/02/Post-Spinal-Surgery-Physiotherapy-A4-Print-Version.pdf",
  ),
  noidaLumbarRecovery: source(
    "Lumbar decompression surgery: recovery",
    "NHS",
    "https://www.nhs.uk/tests-and-treatments/lumbar-decompression-surgery/recovery",
  ),
  noidaRnoh: source(
    "Exercises following spinal surgery",
    "Royal National Orthopaedic Hospital",
    "https://www.rnoh.nhs.uk/patients-and-visitors/patient-information-guides/exercises-following-spinal-surgery",
  ),
  noidaInform: source(
    "Lumbar decompression surgery",
    "NHS Inform",
    "https://www.nhsinform.scot/tests-and-treatments/surgical-procedures/lumbar-decompression-surgery",
  ),
  noidaAaos: source(
    "Low back surgery exercise guide",
    "American Academy of Orthopaedic Surgeons",
    "https://www.orthoinfo.org/recovery/low-back-surgery-exercise-guide/",
  ),
  noidaSpineFood: source(
    "Center for Spine Health pre- and post-op instructions",
    "Cleveland Clinic",
    "https://my.clevelandclinic.org/-/scassets/files/org/neurological/spine/main-campus-spine-surgery-pre-post-surgery-instructions.pdf",
  ),
  noidaBowel: source(
    "A standardized postoperative bowel regimen protocol after spine surgery",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC10063852",
  ),
  noidaPostOpNutrition: source(
    "Postoperative nutrition management: who needs what?",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC10642540",
  ),
  noidaHopkins: source(
    "Your guide to spine surgery",
    "Johns Hopkins Medicine",
    "https://www.hopkinsmedicine.org/-/media/neurology-neurosurgery/documents/spine/spine-surgery-guide-bayview.pdf",
  ),
  noidaRecoveryNutrition: source(
    "Nutrition for recovery",
    "Worcestershire Acute Hospitals NHS Trust",
    "https://www.wsh.nhs.uk/CMS-Documents/Patient-leaflets/NutritionandDieteticService/6022-5-Nutrition-for-recovery.pdf",
  ),
  noidaPulmonaryQs: source(
    "Quality statement 4: Pulmonary rehabilitation for stable COPD and exercise limitation",
    "NICE",
    "https://www.nice.org.uk/guidance/qs10/chapter/quality-statement-4-pulmonary-rehabilitation-for-stable-copd-and-exercise-limitation",
  ),
  noidaCopdExercise: source(
    "Exercising with COPD",
    "NHS Inform",
    "https://www.nhsinform.scot/illnesses-and-conditions/lungs-and-airways/copd/exercising-with-copd",
  ),
  noidaNhsEngland: source(
    "Pulmonary rehabilitation",
    "NHS England",
    "https://www.england.nhs.uk/ourwork/clinical-policy/respiratory-disease/pulmonary-rehabilitation",
  ),
  noidaBts: source(
    "Guideline for pulmonary rehabilitation in adults",
    "British Thoracic Society",
    "https://www.brit-thoracic.org.uk/document-library/guidelines/pulmonary-rehabilitation/bts-guideline-for-pulmonary-rehabilitation-in-adults",
  ),
  noidaCopdNice: source(
    "Chronic obstructive pulmonary disease in over 16s",
    "NICE",
    "https://www.nice.org.uk/guidance/ng115/chapter/recommendations",
  ),
  amritsarDualTask: source(
    "Locomotor-cognitive dual-tasking in older adults",
    "PubMed",
    "https://pubmed.ncbi.nlm.nih.gov/40262366/",
  ),
  amritsarDualReview: source(
    "Single-task, dual-task and analogy training for gait and balance",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC12780542/",
  ),
  amritsarFallsNice: source(
    "Falls: assessment and prevention",
    "NICE",
    "https://www.nice.org.uk/guidance/NG249/chapter/recommendations",
  ),
  amritsarFallsNhs: source("Falls", "NHS", "https://www.nhs.uk/conditions/falls/"),
  amritsarSteadi: source(
    "STEADI older adult fall prevention",
    "Centers for Disease Control and Prevention",
    "https://www.cdc.gov/steadi/",
  ),
  amritsarNutritionNice: source(
    "Nutrition support for adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg32/chapter/Recommendations",
  ),
  amritsarEspen: source(
    "Clinical nutrition and hydration in geriatrics",
    "European Society for Clinical Nutrition and Metabolism",
    "https://15.espen.org/files/ESPEN-Guidelines/ESPEN_guideline_on_clincal_nutrition_and_hydration_in_geriatrics.pdf",
  ),
  amritsarMalnutrition: source("Malnutrition", "NHS", "https://www.nhs.uk/conditions/malnutrition/"),
  amritsarIcmr: source(
    "Dietary Guidelines for Indians 2024",
    "ICMR–National Institute of Nutrition",
    "https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
  ),
  amritsarHealthyDiet: source(
    "Healthy diet",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  ),
  amritsarOlderNhs: source(
    "Physical activity guidelines for older adults",
    "NHS",
    "https://www.nhs.uk/live-well/exercise/physical-activity-guidelines-older-adults/",
  ),
  amritsarActivityWho: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  amritsarActivityCdc: source(
    "Older adult activity guidelines",
    "Centers for Disease Control and Prevention",
    "https://www.cdc.gov/physical-activity-basics/guidelines/older-adults.html",
  ),
  amritsarFrailtyReview: source(
    "The effectiveness of exercise interventions for the management of frailty",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC3092602/",
  ),
  ludhianaShoulderReview: source(
    "Conservative shoulder treatment in spinal cord injury",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC7364791/",
  ),
  ludhianaShoulderCare: source(
    "Models of care for musculoskeletal shoulder pain in spinal cord injury",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC11044743/",
  ),
  ludhianaTrauma: source(
    "Rehabilitation after traumatic injury",
    "NICE",
    "https://www.nice.org.uk/guidance/ng211/chapter/Recommendations",
  ),
  ludhianaSci: source(
    "Spinal cord injury",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/spinal-cord-injury",
  ),
  ludhianaBowel: source(
    "Guideline for neurogenic bowel dysfunction in spinal cord injury",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC8948006/",
  ),
  ludhianaDietetics: source(
    "Dietetics after spinal cord injury",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC7983636/",
  ),
  ludhianaNutrition: source(
    "Nutritional health considerations for persons with spinal cord injury",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC5562027/",
  ),
  ludhianaHealthyDiet: source(
    "Healthy diet",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  ),
  ludhianaActivity: source(
    "Physical activity after stroke and spinal cord injury",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC3498020/",
  ),
  ludhianaAutonomic: source(
    "Clinical practice guideline development for autonomic dysreflexia",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC10744198/",
  ),
  ludhianaAutonomicNsw: source(
    "Autonomic dysreflexia",
    "NSW Agency for Clinical Innovation",
    "https://aci.health.nsw.gov.au/networks/spinal-cord-injury/resources/autonomic-dysreflexia",
  ),
  ludhianaActivityWho: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  ludhianaNchpad: source(
    "Spinal cord injury",
    "National Center on Health, Physical Activity and Disability",
    "https://www.nchpad.org/resources/spinal-cord-injury",
  ),
  kochiFootDrop: source("Foot drop", "NHS", "https://www.nhs.uk/conditions/foot-drop"),
  kochiFes: source(
    "Functional electrical stimulation for drop foot of central neurological origin",
    "NICE",
    "https://www.nice.org.uk/guidance/htg178/chapter/1-recommendations",
  ),
  kochiLocomotor: source(
    "Clinical practice guideline to improve locomotor function",
    "PubMed",
    "https://pubmed.ncbi.nlm.nih.gov/31834165/",
  ),
  kochiNeuroprosthetic: source(
    "Advances in neuroprosthetic management of foot drop",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC7093967/",
  ),
  kochiPressureNice: source(
    "Pressure ulcers: prevention and management",
    "NICE",
    "https://www.nice.org.uk/guidance/CG179/chapter/recommendations",
  ),
  kochiIcmr: source(
    "Dietary Guidelines for Indians 2024",
    "ICMR–National Institute of Nutrition",
    "https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
  ),
  kochiPressureNhs: source(
    "Pressure ulcers",
    "NHS",
    "https://www.nhs.uk/conditions/pressure-sores",
  ),
  kochiPressureRnao: source(
    "Pressure injury management",
    "Registered Nurses' Association of Ontario",
    "https://rnao.ca/bpg/guidelines/pressure-injuries",
  ),
  kochiEspen: source(
    "ESPEN scientific guidelines",
    "European Society for Clinical Nutrition and Metabolism",
    "https://www.espen.org/guidelines/espen-scientific-guidelines-pdf-versions",
  ),
  kochiFrailtyBgs: source(
    "Managing frailty",
    "British Geriatrics Society",
    "https://www.bgs.org.uk/managing-frailty",
  ),
  kochiFrailtyEwgsop: source(
    "Sarcopenia: revised European consensus on definition and diagnosis",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC6322506/",
  ),
  kochiFrailtyReview: source(
    "Effects of exercise interventions on frailty",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC3634155/",
  ),
  kochiFrailtyMeta: source(
    "Effects of exercise on frailty in older people",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC11173309/",
  ),
  kochiActivity: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  noidaDistrict: source(
    "Gautam Buddh Nagar district: official information",
    "District Administration, Gautam Buddh Nagar",
    "https://gbnagar.nic.in/",
  ),
  amritsarDistrict: source(
    "Amritsar district: official information",
    "District Administration, Amritsar",
    "https://amritsar.nic.in/",
  ),
  ludhianaDistrict: source(
    "Ludhiana district: official information",
    "District Administration, Ludhiana",
    "https://ludhiana.nic.in/",
  ),
  ernakulamDistrict: source(
    "Ernakulam district: official information",
    "District Administration, Ernakulam",
    "https://ernakulam.nic.in/",
  ),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person’s condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can help review a previously assessed plan, but it does not replace emergency or specialist medical care.

This article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, neurologist, pulmonologist, dietitian, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
`;

function articleContent({
  opening,
  context,
  assessment,
  progression,
  homeSession,
  dos,
  donts,
  safety,
}: {
  opening: string;
  context: string;
  assessment: string;
  progression: string;
  homeSession: string;
  dos: string;
  donts: string;
  safety: string;
}) {
  return `${opening}

### The practical context in this city

${context}

### What a physiotherapist assesses

${assessment}

### How rehabilitation can progress

${progression}

### What to expect from a home physiotherapy session

${homeSession}

### Do

- ${dos}
- Keep a short record of symptoms, sleep, activity, food or bowel changes where relevant, and the task that is becoming easier or harder.
- Share discharge summaries, medication changes, restrictions, equipment, and new symptoms before a programme is progressed.

### Don’t

- ${donts}
- Do not copy another person’s protocol or use one good day as proof that a larger workload is safe.
- Do not delay medical review for a new or rapidly changing symptom because it appears during rehabilitation.

### Safety and when to seek medical advice

${safety}

${commonBooking}`;
}

const noidaSpinePhysio = articleContent({
  opening: "After spinal surgery, the first meaningful movement may be turning in bed, sitting at the edge, standing from a chair, or reaching the bathroom without losing control. Those tasks are not the same as proving that the back is strong. Physiotherapy should connect the surgeon’s restrictions with the person’s actual home route and teach movement that is safe for the operation and current neurological status.",
  context: "Noida is the setting for this home-movement question, not evidence of a local surgical outcome or a universal recovery pathway. A home assessment can look at the bed height, toilet route, chair support, lift or stairs, caregiver position, and the amount of sitting or walking needed during the day. The procedure, wound, neurological findings, brace or walking-aid instructions, and surgeon’s restrictions determine what can be practised.",
  assessment: "The therapist reviews the operation and discharge instructions before observing rolling, lying-to-sitting, sit-to-stand, short walking, turning, and the person’s use of a rail or walking aid. They ask about new leg symptoms, numbness, bladder or bowel changes, wound concerns, pain behaviour, sleep, and confidence. A movement may be modified because of a restriction rather than because it is universally dangerous; the team must explain that distinction.",
  progression: "Practice can begin with a controlled bed or chair transition and then connect to the real bathroom, kitchen, doorway, or lift route. Assistance, surface, support, distance, and task complexity can change one at a time while the clinician watches control and the later response. A good plan values a repeatable transfer and a calm recovery period over a difficult manoeuvre completed once.",
  homeSession: "A home visit may rehearse the exact bed exit, bathroom turn, chair height, or short corridor walk that matters. The therapist can position a walking aid, teach a caregiver where to stand without pulling, and identify which tasks are independent, supervised, or not yet appropriate. The written plan should state when the surgeon or rehabilitation team needs to be contacted.",
  dos: "Keep the surgeon’s restrictions visible, clear the route, use the assessed support, and practise one real transition with attention to breathing and control.",
  donts: "Do not force a twist, lift a heavy object, climb extra stairs, or treat a pain-free transfer as permission to ignore procedure-specific precautions.",
  safety: "Seek urgent medical review for new or worsening leg weakness, new loss of sensation, a change in bladder or bowel control, inability to walk, severe escalating pain, wound separation, fever, or sudden loss of function. If pain, numbness, balance, or walking changes after a previously stable period, pause progression and contact the treating team.",
});

const noidaSpineNutrition = articleContent({
  opening: "Nutrition questions after spine surgery are often about what is happening around food rather than finding a perfect menu. Pain medicines may affect nausea or bowel function, reduced movement may change appetite, and a person may be unsure whether constipation, abdominal symptoms, or poor intake are expected. The safest article can help families prepare questions without turning a bowel protocol into an individual prescription.",
  context: "A Noida home recovery may involve a family member preparing meals, a person sitting for only short periods, and a medication list that changes after discharge. The city does not determine fibre, fluid, protein, calorie, or supplement needs. The surgical team, pharmacist, and dietitian may need to coordinate when kidney disease, diabetes, heart disease, swallowing difficulty, or a prescribed fluid boundary is present.",
  assessment: "The clinical conversation can cover appetite, nausea, vomiting, pain medicines, bowel pattern, abdominal discomfort, ability to shop or cook, weight trend, hydration concern, wound healing, and the instructions supplied at discharge. The team should ask whether a person can pass stool and gas and whether symptoms are new or worsening. A dietitian can help when intake is persistently poor or food advice conflicts with another medical restriction.",
  progression: "A general recovery pattern can include familiar foods that are safe to chew and swallow, practical meal preparation, and review of the person’s response. The clinician may suggest questions about medication timing, movement, and bowel management, but the article cannot prescribe a laxative, fibre amount, fluid volume, or supplement. Nutrition support should be reassessed when the operation, symptoms, medicines, or laboratory concerns change.",
  homeSession: "A physiotherapy visit can identify whether pain, weakness, or a low chair makes eating and toileting difficult. The therapist may help arrange a safe kitchen route or movement break and then refer unanswered bowel, appetite, or medication questions to the appropriate clinician. The visit does not authorize changing a prescribed medication or fluid plan.",
  dos: "Bring the discharge sheet and medicine list to review, record appetite and bowel changes, and ask who should answer each food, medication, or hydration question.",
  donts: "Do not start a high-fibre, high-protein, fasting, laxative, or supplement routine without checking the operation, medicines, kidney or heart status, and the treating team’s instructions.",
  safety: "If persistent vomiting, inability to pass stool or gas, severe abdominal pain or distension, dehydration concern, fever, worsening wound symptoms, or unintentional weight loss appears, seek prompt medical advice. If sudden severe pain, collapse, or rapidly worsening weakness occurs, seek urgent assessment rather than trying a home nutrition experiment.",
});

const noidaCopdExercise = articleContent({
  opening: "Exercise during pulmonary rehabilitation for COPD is not a test of how much breathlessness a person can tolerate. It is a clinician-guided way to build useful activity while noticing recovery, symptom change, medication questions, oxygen instructions, and the difference between an expected response and a medical problem. The plan should be individualized rather than built from a universal target.",
  context: "Noida is used as the home setting for a symptom-led pulmonary-rehabilitation question. The relevant route may be a room, corridor, lift lobby, or building entrance, and the practical difficulty may include heat, traffic, equipment, or the effort of leaving home. The city does not establish a safe oxygen level, heart-rate zone, distance, or intensity.",
  assessment: "The professional reviews the respiratory diagnosis, recent exacerbations, medicines, inhaler technique, oxygen or other equipment, cough and sputum changes, chest symptoms, sleep, anxiety, strength, and the recovery after activity. They may observe a short functional task and ask what happens during it, later that day, and the next morning. A change in sputum, breathlessness pattern, confusion, or general function can require medical review instead of exercise progression.",
  progression: "Pulmonary rehabilitation can use tailored aerobic, strengthening, breathing, and functional work with rest and education. Support, surface, duration, recovery, and task complexity can be adjusted according to the assessment. The response is information, not a score to chase: a persistent decline, unusual fatigue, or symptom change should lead to contact with the clinical team.",
  homeSession: "A home session may check the space, walking route, chair, inhaler or oxygen setup, and the caregiver’s role. The clinician can rehearse a safe warm-up, pacing method, recovery position, and stop rule already suited to the person. A remote review can refine a previously assessed plan but should not clear a new or worsening respiratory symptom.",
  dos: "Use the prescribed respiratory support, record symptoms and recovery, keep the route clear, and tell the team when the usual response changes.",
  donts: "Do not increase exercise because a single day feels easier, alter oxygen or inhaler instructions yourself, or push through a chest symptom or unexplained breathlessness.",
  safety: "Stop and seek urgent medical help for chest pain, fainting, blue lips, confusion, severe or unexpected breathlessness, a fast or irregular heartbeat with symptoms, or a marked change in sputum or alertness. Exercise should wait while a respiratory clinician assesses a new or unstable pattern.",
});

const amritsarDualTask = articleContent({
  opening: "Walking may look safe in a quiet room and become less reliable when a person turns, carries a cup, talks, searches for a phone, or responds to a family member. This is a dual-task question: the challenge is not simply balance, and it is not a reason to add distractions without assessment. Physiotherapy can identify which everyday task is safe to practise and when attention should return fully to walking.",
  context: "Amritsar is the practical setting for this home assessment, not a claim about local falls or neurological outcomes. The route may include a bed, bathroom, courtyard, doorway, or a familiar short walk. Age, stroke or other neurological illness, vision, hearing, medication effects, confidence, and the home surface all influence whether a second task is appropriate.",
  assessment: "The therapist observes single-task walking, turning, stopping, sit-to-stand, and the person’s ability to follow a simple instruction. Only then might they consider a carefully selected attention or object-handling task. They look for reduced foot clearance, slowed reactions, freezing, loss of balance, confusion, or unsafe divided attention. A new neurological change needs medical review rather than dual-task practice.",
  progression: "The first goal may be to keep walking quality stable while the person responds to one simple cue. Progression can change the route, support, speed, or secondary task one at a time, with supervision selected for the person’s risk. The aim is useful everyday function, not a universal counting exercise or a test score that predicts safety everywhere.",
  homeSession: "A visit can recreate a meaningful doorway turn, bathroom route, or simple carrying task and teach the family how to guard without pulling. The therapist can mark which task is independent, which needs supervision, and which should wait. Practice should stop before attention or walking quality deteriorates.",
  dos: "Start with the assessed single task, use stable support, remove avoidable hazards, and add only the secondary task the clinician has selected.",
  donts: "Do not practise while carrying hot liquids near stairs, add distractions because another person can, or use a dual-task success as proof that every community route is safe.",
  safety: "Seek urgent assessment for sudden weakness, facial drooping, new speech or vision change, collapse, severe headache, or inability to walk. Stop the task and arrange prompt review for repeated near-falls, new confusion, marked freezing, or a sudden change in walking.",
});

const amritsarOlderNutrition = articleContent({
  opening: "A person can eat enough on paper and still struggle to participate in rehabilitation when appetite, fatigue, chewing, swallowing, or the need for mealtime help changes. Nutrition support for older adults begins with noticing risk and asking for assessment, not with a fixed high-protein menu. Families can help by describing what has changed and what assistance makes eating safer.",
  context: "In an Amritsar home, meals may be prepared by a family member, shared across generations, or affected by fatigue after therapy. The city does not determine a person’s calorie, protein, fluid, texture, or supplement needs. Age-related conditions, diabetes, kidney or heart disease, dental problems, medicines, cognition, and swallowing can change the appropriate plan.",
  assessment: "The team may ask about unintentional weight change, reduced interest in food or drink, chewing, coughing, wet voice, fatigue during a meal, ability to sit safely, food access, and the amount of help required. A positive nutrition screen needs individualized assessment, and suspected dysphagia needs referral to appropriately skilled professionals. A dietitian can help align familiar foods with the person’s medical boundaries.",
  progression: "A safe pattern may involve a pleasant eating environment, assistance that preserves dignity, foods the person can safely manage, and review of intake and function. The article can encourage families to discuss snacks, food fortification, or texture only as clinician-led options. Progress is seen in safer participation, stable function, and a plan that is reviewed when symptoms or weight change.",
  homeSession: "A physiotherapist can assess sitting posture, fatigue, transfers to the dining area, and the effort of reaching for a cup or plate. They may coordinate questions for the dietitian, nurse, doctor, or swallowing professional. They should not diagnose malnutrition, prescribe a supplement, or change a fluid or texture plan.",
  dos: "Record what the person can eat and drink, note the assistance needed, bring the medicine list to review, and protect a calm, upright mealtime when advised.",
  donts: "Do not force food, thicken drinks, start supplements, or impose a high-protein or high-fibre plan without checking swallowing, kidney, heart, diabetes, and medicine considerations.",
  safety: "If choking, repeated coughing, a wet voice after swallowing, repeated chest infections, persistent vomiting, dehydration concern, rapid weight or intake decline, or new confusion appears, seek prompt medical advice. If a sudden inability to swallow, severe breathlessness, collapse, or new neurological symptom occurs, seek urgent care.",
});

const amritsarFrailtyExercise = articleContent({
  opening: "For a person living with frailty, exercise planning is about preserving useful reserve for chair rises, walking to the bathroom, reaching a shelf, or recovering from an ordinary interruption. It is not a promise to reverse every limitation and not a fixed set of repetitions. The programme should be built around assessment, supervision, comorbidities, and the person’s response.",
  context: "Amritsar is the setting for a functional-strength question, not evidence of a local frailty rate or outcome. The home may reveal a low chair, narrow route, uneven surface, or family assistance that changes the task. Frailty, sarcopenia, pain, cognition, orthostatic symptoms, medicines, heart or lung disease, and recent illness all affect readiness.",
  assessment: "The exercise professional reviews falls and near-falls, transfers, gait, strength, balance, fatigue, nutrition concerns, cognition, blood-pressure symptoms, pain, breathlessness, and the person’s goals. They may observe a chair rise or short walk when safe, focusing on control and recovery rather than a universal score. A sudden decline needs medical assessment before exercise is advanced.",
  progression: "A plan may combine functional strengthening, balance, endurance, and movement practice with support matched to risk. The clinician can change the chair height, hand support, task complexity, walking route, recovery, or supervision one at a time. The person’s next-day function matters, and a lasting decline is a reason to review rather than train harder.",
  homeSession: "A home session can practise the actual chair rise, doorway turn, or short route that matters. The therapist teaches the family where to stand, how to allow active effort, and which symptoms end the session. The plan labels independent, supervised, and not-yet-safe tasks.",
  dos: "Choose a meaningful daily task, use the assessed support, allow recovery, and record how the person functions later and the next day.",
  donts: "Do not use a borrowed frailty routine, chase exhaustion, remove all activity because of fear, or progress after a fall or illness without reassessment.",
  safety: "Stop and seek urgent care for chest pain, fainting, severe unexpected breathlessness, acute confusion, new neurological symptoms, or sudden inability to bear weight. Arrange prompt review for repeated falls, a marked functional decline, or deterioration that persists after activity.",
});

const ludhianaShoulder = articleContent({
  opening: "For a person with spinal cord injury who uses a wheelchair or repeated assisted transfers, the shoulder can become the link between mobility and independence. Pain during propulsion, pressure relief, reaching, or transfers should not be treated as an unavoidable price of function. Physiotherapy can protect the upper limb while preserving the tasks the person actually needs.",
  context: "Ludhiana is the setting for a shoulder-preservation question, not a claim about local spinal cord injury outcomes. A home assessment can examine the chair, bed, bathroom, transfer board or support, floor surface, and the route used each day. Injury level, trunk control, hand function, sensation, skin status, equipment fit, and the amount of caregiver help shape the plan.",
  assessment: "The therapist asks when pain occurs, whether it is one-sided, what happens after propulsion or transfers, and whether strength, range, sensation, or daily reach has changed. They observe propulsion, brake use, pressure relief, bed-to-chair movement, and a functional reach when safe. Neck symptoms, new weakness, swelling, trauma, or a change in neurological status may require medical review.",
  progression: "The plan may alter the setup, technique, support, task order, or recovery before adding strengthening. Transfers and propulsion can be practised with attention to shoulder position and the smallest safe assistance. A task is progressed when control and recovery remain acceptable, not because pain has been ignored or because a universal chair configuration has been copied.",
  homeSession: "A visit can recreate the bed, chair, toilet, doorway, or surface that produces the highest load. The therapist may teach a caregiver how to assist without lifting under the arms and identify a safer route or equipment question for review. The written plan should distinguish independent, assisted, and deferred tasks.",
  dos: "Report shoulder pain early, keep the chair and transfer setup under review, use the assessed technique, and protect recovery between repeated upper-limb loads.",
  donts: "Do not normalize worsening shoulder pain, pull through an arm during transfer, test maximum pushing repeatedly, or change equipment without a fit and task assessment.",
  safety: "Seek prompt medical or rehabilitation review for new marked weakness, deformity, acute injury, severe loss of movement, rapidly worsening pain, swelling, or a new neurological change. Stop and seek urgent help for collapse, chest symptoms, or a fall with suspected injury.",
});

const ludhianaSciNutrition = articleContent({
  opening: "Nutrition after spinal cord injury may affect bowel routine, skin health, energy, weight, and participation in rehabilitation at the same time. That does not make a single high-fibre, high-protein, or high-fluid rule safe for everyone. A useful conversation maps the person’s symptoms and medical context so the spinal cord injury team and dietitian can individualize support.",
  context: "A Ludhiana home may include a wheelchair route, caregiver-assisted meals, pressure-relief needs, and a bowel routine that is part of the daily schedule. The city does not determine the correct food, fluid, fibre, protein, sodium, or supplement plan. Lesion level, activity, medicines, diabetes, kidney or heart disease, swallowing, weight trend, and skin condition all matter.",
  assessment: "The team may ask about stool pattern, abdominal symptoms, continence, appetite, chewing and swallowing, weight change, skin inspection, pressure areas, activity, sleep, and medication effects. Neurogenic bowel management requires an interdisciplinary plan that is implemented and reviewed rather than copied from a checklist. The nutrition assessment should also consider whether the person can shop, prepare, and reach food safely.",
  progression: "Families can discuss familiar food patterns, timing, safe textures, practical assistance, and the response to any clinician-approved change. Skin and bowel symptoms should be tracked with the rest of the rehabilitation plan. A new pressure injury, changing bowel pattern, or medicine change should trigger reassessment rather than automatic escalation of fibre, fluid, protein, or supplements.",
  homeSession: "A physiotherapy visit can examine sitting posture, pressure-relief technique, transfers, access to the dining space, and the effort required to prepare a meal. The therapist can coordinate questions for the spinal cord physician, nurse, dietitian, or wound team. It is not a substitute for bowel, skin, swallowing, or medication management.",
  dos: "Keep the bowel and skin record requested by the clinical team, inspect pressure areas as taught, and bring changes in medicines, weight, intake, or stool pattern to review.",
  donts: "Do not prescribe fibre, fluid, protein, calories, laxatives, supplements, or a texture change from an online article without the person’s spinal cord and medical context.",
  safety: "If severe constipation, vomiting, inability to pass stool or gas, blood, fever, dehydration concern, new or worsening skin breakdown, or unintentional weight loss appears, seek prompt review. If sudden severe headache, sweating or flushing with suspected autonomic symptoms, collapse, or new neurological loss occurs, seek urgent assessment.",
});

const ludhianaSciExercise = articleContent({
  opening: "Exercise after spinal cord injury needs more than a general fitness plan because autonomic symptoms, orthostatic changes, thermoregulation, skin protection, fatigue, and upper-limb loading can alter the response. The purpose of monitoring is not to find a universal blood-pressure or repetition target. It is to help the clinical team recognize when a session is appropriate, when it needs modification, and when it must stop.",
  context: "Ludhiana is the home setting for this SCI-specific monitoring question. A programme may involve a wheelchair, transfer surface, resistance equipment, or a short route, and the safe setup depends on injury level, trunk and arm function, skin status, bladder and bowel triggers, medicines, and supervision. The city does not determine clearance or exercise dose.",
  assessment: "The professional reviews injury level and completeness, autonomic history, orthostatic symptoms, pressure areas, pain, temperature sensitivity, fatigue, respiratory function, medicines, and the response to previous activity. They teach the person and caregiver which symptoms matter and how to communicate them. New headache, flushing, sweating, dizziness, weakness, chest symptoms, or a change in skin status may require an immediate pause and clinical pathway.",
  progression: "When the plan is stable, the team may change support, mode, resistance, duration, task complexity, or recovery one at a time. The response during the session and later in the day is recorded. Conditioning should not be advanced when the person is developing a pressure injury, repeated orthostatic symptoms, unexplained pain, overheating, or a sustained decline.",
  homeSession: "A session can check the transfer into equipment, wheelchair position, skin protection, caregiver placement, and access to cooling or rest. The professional can rehearse the agreed stop rule and help separate a normal effort response from an autonomic or medical warning. Follow-up should review the log rather than reward a person for training through danger.",
  dos: "Keep the agreed monitoring and emergency instructions accessible, check the setup and skin as taught, record symptoms, and change only one training factor after review.",
  donts: "Do not train through suspected autonomic dysreflexia, ignore orthostatic symptoms, use a universal blood-pressure or oxygen target, or treat a borrowed SCI programme as clearance.",
  safety: "Stop and seek urgent help for sudden severe headache, flushing or sweating with suspected autonomic dysreflexia, chest pain, fainting, severe breathlessness, new neurological weakness, collapse, or acute loss of function. Prompt review is needed for repeated dizziness, overheating, new pain, pressure injury, or sustained post-session deterioration.",
});

const kochiFootDrop = articleContent({
  opening: "Foot drop can make a toe catch the floor, a stair feel higher, or a familiar route suddenly unsafe. It is a movement sign with several possible causes rather than a diagnosis that can be treated with one exercise. Home physiotherapy starts by finding out what has changed, protecting the foot, and matching gait practice to the medical assessment.",
  context: "Kochi is the setting for a walking-task question, not evidence of a local cause or outcome. A home visit can examine the bedroom-to-bathroom route, thresholds, stairs, footwear, walking aid, lighting, and the person’s need to carry or turn. Nerve, spine, brain, muscle, diabetes, injury, and medication contexts can lead to different referrals and treatment choices.",
  assessment: "The therapist reviews onset, progression, back or leg symptoms, numbness, pain, strength, sensation, balance, vision, footwear, and falls. They observe toe clearance, turning, stairs, and the person’s response to a cue or support. An ankle-foot orthosis or functional electrical stimulation is not a universal purchase; selection depends on cause, assessment, clinical governance, and specialist review.",
  progression: "Practice may begin with a clear surface and a clinician-selected cue for foot placement, then connect to a threshold, turn, or step when control is adequate. Support, speed, surface, and task complexity can change one at a time. The goal is safer, repeatable function rather than forcing a high-knee pattern or hiding a worsening neurological problem.",
  homeSession: "The professional can map the route, adjust clutter and lighting, check footwear, and teach the family how to guard without pulling. They may coordinate an orthotic or neurological referral and label tasks as independent, supervised, or not yet safe. A remote review can refine a previously assessed walking plan but should not diagnose a new foot drop.",
  dos: "Report a new or changing foot drop, use the assessed support, clear the walking route, and record catches, near-falls, pain, numbness, and next-day function.",
  donts: "Do not tape, brace, or stimulate the foot without assessment, practise stairs while distracted, or assume a familiar back-pain explanation accounts for a new weakness.",
  safety: "A new or rapidly worsening foot drop needs medical assessment. Seek urgent help for sudden weakness, new numbness, severe back symptoms, inability to walk, loss of bladder or bowel control, a fall with injury, or new speech, vision, or facial changes.",
});

const kochiPressureNutrition = articleContent({
  opening: "Reduced mobility can change both skin risk and nutrition questions. A red area, reduced appetite, fatigue, or weight loss may be a sign that the rehabilitation plan needs review; it is not a reason to begin a fixed protein or fluid prescription from the internet. Families can learn what to observe and which clinician should coordinate the next step.",
  context: "A Kochi home may include a bed, wheelchair, recliner, bathroom route, and caregiver-assisted repositioning. The city does not establish pressure-injury risk or a universal food plan. Mobility, sensation, continence, age, diabetes, vascular disease, kidney or heart disease, swallowing, weight trend, and equipment fit all affect the assessment.",
  assessment: "The team may ask about skin colour that does not settle, pain, warmth, swelling, moisture, pressure points, sitting tolerance, appetite, weight change, chewing and swallowing, hydration concern, and the ability to shift position. NICE and wound-care guidance support documented risk assessment and reassessment when mobility or clinical status changes. Nutrition and wound advice should be coordinated rather than separated into unrelated checklists.",
  progression: "A general pattern can include safe movement or repositioning as taught, daily skin observation, comfortable food that the person can safely manage, and referral when intake or wounds are changing. Food fortification, supplements, fluid changes, and texture changes are individualized clinical options. Progress is measured by safer participation, stable skin, and a reviewed plan, not by a numerical nutrient target.",
  homeSession: "A physiotherapist can check transfers, pressure-relief technique, cushion or mattress questions, sitting posture, and the route to meals and toileting. They can help the family prepare a concise record for the dietitian, nurse, doctor, or wound team. The visit cannot diagnose an ulcer or prescribe a wound diet.",
  dos: "Follow the taught pressure-relief plan, inspect skin as advised, record intake and weight changes, and report equipment or positioning problems early.",
  donts: "Do not massage a persistent red area, apply an unreviewed cream or supplement, force fluids, or start a high-protein or high-calorie routine without the clinical context.",
  safety: "If persistent discoloration, broken skin, warmth, swelling, pus, fever, severe pain, dehydration concern, or unintentional weight loss appears, seek prompt medical advice. If a wound rapidly worsens, or confusion, collapse, or severe systemic illness develops, seek urgent assessment.",
});

const kochiFrailtyExercise = articleContent({
  opening: "Frailty and sarcopenia can make a small loss of strength affect chair rises, walking, carrying food, or recovering from an illness. Exercise physiology can help build capacity around those tasks, but the right plan depends on assessment and response. It should not promise a reversal, use a fixed set of repetitions, or treat fatigue as proof that the exercise worked.",
  context: "Kochi is the setting for planning strength around daily function, not a claim about local frailty or outcomes. A home assessment can identify a low chair, narrow doorway, uneven surface, or family assistance that changes the movement challenge. Frailty, muscle loss, cognition, falls, pain, orthostatic symptoms, medicines, heart or lung disease, and nutrition concerns need to be considered together.",
  assessment: "The professional asks about recent illness, falls and near-falls, walking, chair rises, grip or limb function, fatigue, appetite, weight change, dizziness, breathlessness, pain, medicines, and the person’s priorities. They may use a functional task when safe and note control, assistance, and recovery rather than relying on one number. A suspected acute illness or sudden decline needs medical review before progression.",
  progression: "A plan may combine resistance, balance, endurance, and task practice with support that matches risk. The clinician can adjust the chair, hand support, task order, route, recovery, or supervision one at a time. Evidence supports individualized multi-component work, not a single best programme; a lasting decline is a reason to reassess.",
  homeSession: "A home visit can practise standing from the person’s chair, walking to a meaningful destination, or handling a light daily task when cleared. The therapist teaches the family how to guard without lifting and how to recognize when a task is too demanding. The plan separates independent, supervised, and deferred activities.",
  dos: "Choose a daily task that matters, use the assessed support, protect sleep and recovery, and share changes in falls, appetite, pain, breathlessness, or next-day function.",
  donts: "Do not chase exhaustion, use a borrowed frailty routine, progress after an acute illness without review, or treat a single successful chair rise as clearance for a harder route.",
  safety: "Stop and seek urgent care for chest pain, fainting, severe unexpected breathlessness, acute confusion, new neurological symptoms, or sudden inability to bear weight. Arrange prompt review for repeated falls, marked weakness, or deterioration that persists after activity.",
});

export const cityJournalBatch3Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-noida-spine-physio",
    slug: "spinal-surgery-bed-mobility-transfers-noida",
    title: "Spinal Surgery Physiotherapy in Noida: Bed Mobility, Transfers, and Safer Home Movement",
    metaTitle: "Spinal Surgery Physiotherapy in Noida",
    metaDescription: "A practical Noida guide to bed mobility, sit-to-stand transfers, surgeon-specific restrictions, home setup, and warning signs after spinal surgery matter.",
    excerpt: "How Noida families can connect spinal-surgery precautions with safer bed, chair, bathroom, and doorway movement at home.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Functional Rehabilitation",
    image: "/images/journal/journal_post-surgery.jpg",
    citySlug: "noida",
    discipline: "physiotherapy",
    content: noidaSpinePhysio,
    sources: [refs.noidaSpinePhysio, refs.noidaLumbarRecovery, refs.noidaRnoh, refs.noidaInform, refs.noidaAaos, refs.noidaDistrict],
  },
  {
    id: "city-journal-noida-spine-nutrition",
    slug: "nutrition-after-spine-surgery-constipation-noida",
    title: "Nutrition After Spine Surgery in Noida: Appetite, Constipation, and Medication Questions",
    metaTitle: "Nutrition After Spine Surgery in Noida",
    metaDescription: "A cautious Noida guide to appetite, constipation, pain medicines, reduced activity, and when postoperative nutrition questions need review. Risks vary.",
    excerpt: "What Noida families can ask about appetite, bowel changes, medicines, and recovery food after spine surgery without using a fixed diet.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "noida",
    discipline: "nutrition",
    content: noidaSpineNutrition,
    sources: [refs.noidaSpineFood, refs.noidaBowel, refs.noidaPostOpNutrition, refs.noidaHopkins, refs.noidaRecoveryNutrition, refs.noidaDistrict],
  },
  {
    id: "city-journal-noida-copd-exercise",
    slug: "copd-exercise-breathlessness-monitoring-noida",
    title: "Exercising With COPD in Noida: Using Breathlessness and Recovery to Guide Pulmonary Rehabilitation",
    metaTitle: "COPD Exercise Monitoring in Noida",
    metaDescription: "A safety-first Noida guide to COPD exercise, breathlessness, recovery monitoring, pulmonary rehabilitation, and when symptoms need review. Risks vary.",
    excerpt: "How Noida patients can use clinician-guided symptom and recovery feedback during pulmonary rehabilitation without fixed intensity or oxygen targets.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "noida",
    discipline: "exercise-physiology",
    content: noidaCopdExercise,
    sources: [refs.noidaPulmonaryQs, refs.noidaCopdExercise, refs.noidaNhsEngland, refs.noidaBts, refs.noidaCopdNice, refs.noidaDistrict],
  },
  {
    id: "city-journal-amritsar-dual-task",
    slug: "dual-task-walking-neurological-rehabilitation-amritsar",
    title: "Dual-Task Walking Physiotherapy in Amritsar: Practising Safe Turns and Attention at Home",
    metaTitle: "Dual-Task Walking Physiotherapy in Amritsar",
    metaDescription: "A practical Amritsar guide to dual-task walking, safe turns, attention demands, home assessment, supervision, and neurological review. Review matters.",
    excerpt: "How Amritsar families can practise useful walking and attention tasks after neurological illness without adding unsafe distractions.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "amritsar",
    discipline: "physiotherapy",
    content: amritsarDualTask,
    sources: [refs.amritsarDualTask, refs.amritsarDualReview, refs.amritsarFallsNice, refs.amritsarFallsNhs, refs.amritsarSteadi, refs.amritsarDistrict],
  },
  {
    id: "city-journal-amritsar-older-nutrition",
    slug: "older-adult-nutrition-appetite-muscle-rehabilitation-amritsar",
    title: "Nutrition for Older Adults in Amritsar Rehabilitation: Supporting Appetite and Muscle Without a Fixed Diet",
    metaTitle: "Older Adult Rehabilitation Nutrition in Amritsar",
    metaDescription: "A cautious Amritsar guide to appetite, mealtime assistance, swallowing questions, weight change, and nutrition referral during rehabilitation. Risks vary.",
    excerpt: "What Amritsar families can notice when appetite, eating assistance, or weight change threatens participation in older-adult rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "amritsar",
    discipline: "nutrition",
    content: amritsarOlderNutrition,
    sources: [refs.amritsarNutritionNice, refs.amritsarEspen, refs.amritsarMalnutrition, refs.amritsarIcmr, refs.amritsarHealthyDiet, refs.amritsarDistrict],
  },
  {
    id: "city-journal-amritsar-frailty-exercise",
    slug: "frailty-exercise-strength-sit-to-stand-amritsar",
    title: "Frailty Exercise in Amritsar: Building Strength for Everyday Sit-to-Stand and Walking",
    metaTitle: "Frailty Exercise Physiology in Amritsar",
    metaDescription: "A safety-first Amritsar guide to frailty exercise, chair rises, walking capacity, supervision, recovery, and medical stop rules. Plans vary by person.",
    excerpt: "How Amritsar families can connect frailty exercise with chair rises and daily walking while adapting for comorbidities and response.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "amritsar",
    discipline: "exercise-physiology",
    content: amritsarFrailtyExercise,
    sources: [refs.amritsarOlderNhs, refs.amritsarActivityWho, refs.amritsarActivityCdc, refs.amritsarFrailtyReview, refs.amritsarFallsNice, refs.amritsarDistrict],
  },
  {
    id: "city-journal-ludhiana-shoulder-sci",
    slug: "shoulder-preservation-physiotherapy-spinal-cord-injury-ludhiana",
    title: "Shoulder-Preserving Physiotherapy After Spinal Cord Injury in Ludhiana: Propulsion, Transfers, and Daily Function",
    metaTitle: "Shoulder-Preserving SCI Physiotherapy in Ludhiana",
    metaDescription: "A practical Ludhiana guide to shoulder protection, wheelchair propulsion, transfers, upper-limb loading, and function after spinal cord injury. Review now.",
    excerpt: "How Ludhiana patients can protect shoulder function while practising wheelchair propulsion, transfers, pressure relief, and daily tasks after spinal cord injury.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_walking-aids_unique.jpg",
    citySlug: "ludhiana",
    discipline: "physiotherapy",
    content: ludhianaShoulder,
    sources: [refs.ludhianaShoulderReview, refs.ludhianaShoulderCare, refs.ludhianaTrauma, refs.ludhianaSci, refs.ludhianaDistrict],
  },
  {
    id: "city-journal-ludhiana-sci-nutrition",
    slug: "nutrition-spinal-cord-injury-bowel-skin-ludhiana",
    title: "Nutrition After Spinal Cord Injury in Ludhiana: Bowel Routine, Skin Health, and Questions for the Clinical Team",
    metaTitle: "Spinal Cord Injury Nutrition in Ludhiana",
    metaDescription: "A cautious Ludhiana guide to neurogenic bowel, skin health, appetite, weight change, and clinical nutrition questions after spinal cord injury. Risks vary.",
    excerpt: "What Ludhiana families can discuss about bowel routine, skin protection, food, fluids, and nutrition referral after spinal cord injury.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "ludhiana",
    discipline: "nutrition",
    content: ludhianaSciNutrition,
    sources: [refs.ludhianaBowel, refs.ludhianaDietetics, refs.ludhianaNutrition, refs.ludhianaTrauma, refs.ludhianaHealthyDiet, refs.ludhianaDistrict],
  },
  {
    id: "city-journal-ludhiana-sci-exercise",
    slug: "exercise-after-spinal-cord-injury-autonomic-monitoring-ludhiana",
    title: "Exercise After Spinal Cord Injury in Ludhiana: Monitoring Autonomic Symptoms and Building Capacity Safely",
    metaTitle: "SCI Exercise Monitoring in Ludhiana",
    metaDescription: "A safety-first Ludhiana guide to exercise after spinal cord injury, autonomic symptoms, orthostatic changes, skin protection, and stop rules. Risks vary.",
    excerpt: "How Ludhiana patients can plan exercise after spinal cord injury while monitoring autonomic symptoms, fatigue, skin, temperature, and recovery.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "ludhiana",
    discipline: "exercise-physiology",
    content: ludhianaSciExercise,
    sources: [refs.ludhianaActivity, refs.ludhianaAutonomic, refs.ludhianaAutonomicNsw, refs.ludhianaActivityWho, refs.ludhianaNchpad, refs.ludhianaDistrict],
  },
  {
    id: "city-journal-kochi-foot-drop",
    slug: "foot-drop-home-walking-kochi",
    title: "Foot Drop Physiotherapy at Home in Kochi: Toe Clearance, Stairs, and Safer Walking Practice",
    metaTitle: "Foot Drop Physiotherapy at Home in Kochi",
    metaDescription: "A practical Kochi guide to foot drop assessment, toe clearance, stairs, walking practice, orthotic questions, and urgent neurological review. Risks vary.",
    excerpt: "How Kochi families can respond to foot drop, toe catching, stairs, and walking risk without assuming one cause or one device.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "kochi",
    discipline: "physiotherapy",
    content: kochiFootDrop,
    sources: [refs.kochiFootDrop, refs.kochiFes, refs.kochiLocomotor, refs.kochiNeuroprosthetic, refs.kochiActivity, refs.ernakulamDistrict],
  },
  {
    id: "city-journal-kochi-pressure-nutrition",
    slug: "nutrition-pressure-injury-prevention-kochi",
    title: "Nutrition and Pressure-Injury Prevention During Home Rehabilitation in Kochi",
    metaTitle: "Nutrition and Pressure-Injury Prevention in Kochi",
    metaDescription: "A cautious Kochi guide to reduced mobility, skin checks, pressure-injury risk, appetite, weight change, and coordinated nutrition review. Review matters.",
    excerpt: "What Kochi families can ask when reduced mobility changes skin risk, appetite, weight, and the nutrition questions around home rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "kochi",
    discipline: "nutrition",
    content: kochiPressureNutrition,
    sources: [refs.kochiPressureNice, refs.kochiIcmr, refs.kochiPressureNhs, refs.kochiPressureRnao, refs.kochiEspen, refs.ernakulamDistrict],
  },
  {
    id: "city-journal-kochi-frailty-exercise",
    slug: "exercise-frailty-strength-kochi",
    title: "Exercise Physiology for Frailty in Kochi: Building Strength Around Daily Tasks",
    metaTitle: "Frailty Exercise Physiology in Kochi",
    metaDescription: "A safety-first Kochi guide to frailty and sarcopenia exercise, daily-task strength, assessment, supervision, and when progression must stop. Risks vary.",
    excerpt: "How Kochi families can connect frailty exercise with meaningful daily tasks while adapting for falls, comorbidities, fatigue, and recovery.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "kochi",
    discipline: "exercise-physiology",
    content: kochiFrailtyExercise,
    sources: [refs.kochiFrailtyBgs, refs.kochiFrailtyEwgsop, refs.kochiFrailtyReview, refs.kochiFrailtyMeta, refs.kochiActivity, refs.ernakulamDistrict],
  },
];