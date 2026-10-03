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
  niceJoint: source(
    "Joint replacement: postoperative rehabilitation",
    "NICE",
    "https://www.nice.org.uk/guidance/QS206/chapter/statement-5-postoperative-rehabilitation",
  ),
  niceJointRecommendations: source(
    "Joint replacement: primary hip, knee and shoulder",
    "NICE",
    "https://www.nice.org.uk/guidance/ng157/chapter/Recommendations",
  ),
  aaosKnee: source(
    "Activities after total knee replacement",
    "American Academy of Orthopaedic Surgeons",
    "https://www.orthoinfo.org/recovery/activities-after-knee-replacement/",
  ),
  aaosKneeExercise: source(
    "Total knee replacement exercise guide",
    "American Academy of Orthopaedic Surgeons",
    "https://www.orthoinfo.org/recovery/total-knee-replacement-exercise-guide/",
  ),
  niceStroke: source(
    "Stroke rehabilitation in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations",
  ),
  asaDailyLiving: source(
    "Daily living after stroke",
    "American Stroke Association",
    "https://www.stroke.org/en/life-after-stroke/recovery/daily-living",
  ),
  ahaStroke: source(
    "Adult stroke rehabilitation and recovery guideline",
    "American Heart Association/American Stroke Association",
    "https://www.ahajournals.org/doi/10.1161/strokeaha.116.011309",
  ),
  whoRehab: source(
    "Rehabilitation",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/rehabilitation",
  ),
  niceNutrition: source(
    "Nutrition support for adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg32/chapter/Recommendations",
  ),
  niceMalnutrition: source(
    "Screening for the risk of malnutrition",
    "NICE",
    "https://www.nice.org.uk/guidance/qs24/chapter/Quality-statement-1-Screening-for-the-risk-of-malnutrition",
  ),
  whoHealthyDiet: source(
    "Healthy diet",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  ),
  whoActivity: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  icmrDiet: source(
    "Dietary Guidelines for Indians 2024",
    "National Institute of Nutrition, ICMR",
    "https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
  ),
  niceParkinson: source(
    "Parkinson's disease in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/ng71/chapter/Recommendations",
  ),
  parkinsonFoundationExercise: source(
    "Parkinson's exercise guidelines",
    "Parkinson's Foundation",
    "https://www.parkinson.org/sites/default/files/documents/Parkinsons-Exercise-Guidelines-Sept2025.pdf",
  ),
  parkinsonFoundationNutrition: source(
    "Nutrition and Parkinson's",
    "Parkinson's Foundation",
    "https://www.parkinson.org/library/fact-sheets/nutrition",
  ),
  parkinsonFoundationConstipation: source(
    "Constipation and Parkinson's",
    "Parkinson's Foundation",
    "https://www.parkinson.org/understanding-parkinsons/non-movement-symptoms/constipation",
  ),
  niceCopd: source(
    "Chronic obstructive pulmonary disease",
    "NICE",
    "https://www.nice.org.uk/guidance/ng115/chapter/recommendations",
  ),
  atsPulmonary: source(
    "Pulmonary rehabilitation",
    "American Thoracic Society",
    "https://www.thoracic.org/patients/patient-resources/resources/pulmonary-rehab.pdf",
  ),
  atsPulmonaryGuideline: source(
    "Pulmonary rehabilitation for adults with chronic respiratory disease",
    "American Thoracic Society",
    "https://www.thoracic.org/statements/guideline-implementation-tools/matrix-guidelines-and-derivatives-pulmonary-rehab-in-adults-08-23-23.php",
  ),
  nhlbiPulmonary: source(
    "Pulmonary rehabilitation",
    "National Heart, Lung, and Blood Institute",
    "https://www.nhlbi.nih.gov/health/pulmonary-rehabilitation",
  ),
  niceCritical: source(
    "Rehabilitation after critical illness in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg83/chapter/Recommendations",
  ),
  whoPostop: source(
    "Post-operative care",
    "World Health Organization",
    "https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/surgical-care/imeesc-toolkit/best-practice-safety-protocols/post-operative-care.pdf",
  ),
  espenSurgery: source(
    "ESPEN practical guideline: clinical nutrition in surgery",
    "European Society for Clinical Nutrition and Metabolism",
    "https://www.espen.org/files/ESPEN-Guidelines/ESPEN_practical_guideline_Clinical_nutrition_in_surgery.pdf",
  ),
  diabetesNutrition: source(
    "Nutrition and diabetes",
    "American Diabetes Association",
    "https://diabetes.org/food-nutrition",
  ),
  kidneyNutrition: source(
    "Nutrition and Kidney Disease, Stages 1-5 (Not on Dialysis)",
    "National Kidney Foundation",
    "https://www.kidney.org/kidney-topics/nutrition-and-kidney-disease-stages-1-5-not-dialysis",
  ),
  maduraiProfile: source(
    "Madurai District",
    "Government of Tamil Nadu",
    "https://madurai.nic.in/",
  ),
  mysuruProfile: source(
    "Mysuru District",
    "Government of Karnataka",
    "https://mysore.nic.in/",
  ),
  mangaluruProfile: source(
    "Dakshina Kannada District",
    "Government of Karnataka",
    "https://dk.nic.in/",
  ),
  suratProfile: source(
    "Surat District",
    "Government of Gujarat",
    "https://surat.nic.in/",
  ),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person's condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when an exercise plan needs review, but it does not replace emergency or specialist medical care.

The article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, neurologist, dietitian, speech-language clinician, respiratory team, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
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

City context is used here only to make the home setting understandable. A Madurai, Mysuru, Mangaluru, or Surat address does not establish a local prevalence, outcome, neighbourhood risk, or service availability. The same clinical question can require a different plan for two people in the same city.

### What a physiotherapist assesses

${assessment}

The assessment is not a formality before an exercise sheet. It is how the clinician separates a familiar rehabilitation problem from a new medical change, identifies the task that matters to the person, and decides what requires supervision or another professional. Discharge records, medicines, precautions, equipment, fatigue pattern, and family observations are part of the clinical picture. A nutrition-led article may also require a dietitian or speech-language clinician; a cardiopulmonary article may require the treating medical team.

### How rehabilitation can progress

${progression}

Progress is not the same as adding distance, repetitions, weight, or intensity on a calendar. It can mean better control, less assistance, safer decision-making, improved recovery, or greater confidence in one meaningful task. The clinician should explain what to watch during the activity and after it, and when a change means the plan needs review.

### What to expect from a home physiotherapy session

${homeSession}

A home visit may include observation of a real route, chair, bed, bathroom, dining area, device, or family routine. It may also include education, coordination with the treating team, and a written plan for tasks that are independent, supervised, or not yet appropriate. A home session does not authorize changing medication, oxygen, food texture, weight-bearing restrictions, or a surgical precaution.

### Do

- ${dos}
- Keep a plain-language record of the task, symptoms, assistance, and recovery that the team has asked you to observe.
- Share medical reports, medicine changes, surgeon restrictions, and any recent change in symptoms before the plan is progressed.

### Don’t

- ${donts}
- Do not copy an exercise from a video if it increases symptoms, requires equipment you cannot control, or conflicts with a medical restriction.
- Do not use pain, fatigue, or one good day as the only measure of readiness for a harder task.

### Safety and when to seek medical advice

${safety}

Urgent symptoms take priority over a home programme. If the person has a sudden neurological change, severe breathing difficulty, chest pain, fainting, collapse, a serious fall, rapidly worsening weakness, or a new swallowing problem, contact the appropriate emergency or medical service. Do not wait for a routine physiotherapy review to decide whether an emergency is occurring.
${commonBooking}`;
}

const maduraiOrthopaedicRoutines = articleContent({
  opening: "After orthopaedic surgery, the difficult part of returning home may be a sequence that never appeared in the hospital corridor: getting washed, changing clothes, turning in a small bathroom, or carrying a light item from one room to another. A Madurai home physiotherapy review can make those routines the clinical question instead of treating recovery as a generic list of exercises.",
  context: "Madurai's care profile includes post-surgery and orthopaedic rehabilitation. That profile does not predict which operation a person had or which home routine is unsafe. The relevant details are the operation, weight-bearing or movement precautions, wound status, pain, balance, fatigue, footwear, bathroom layout, available help, and what the person could do before surgery. Familiar low seating or floor-level routines may require a separate decision rather than an automatic return.",
  assessment: "The physiotherapist may review the discharge summary and observe bed mobility, standing, turning, clothing management, reaching, and the route to the bathing or toileting area. They may ask whether dizziness, pain, weakness, fear, or a surgical precaution is the main barrier. The assessment can include the height of the bed and chair, the direction of a door, grab points, walking aid use, and whether a caregiver can assist without pulling the operated limb. Wound drainage, fever, calf symptoms, chest symptoms, or a sudden loss of function require medical review.",
  progression: "Progress may begin with one part of the routine, such as moving from the bed to a stable chair while keeping the assessed precautions. The clinician may then practise clothing choices, turning, reaching for a towel, or stepping through a doorway. Assistance can change only when control and safety are consistent. A person may be ready for a supervised shower route but not for carrying a bucket, using a low seat, climbing stairs, or returning to floor-level tasks. Each is a separate functional decision.",
  homeSession: "The therapist can observe the actual bathroom entrance, bathing surface, toilet height, bed, chair, and places where a caregiver might stand. They can compare a planned routine with the person's strength and balance, suggest equipment for the treating team to consider, and rehearse communication such as when to pause. The family can prepare the operation details, restrictions, footwear, and a list of the steps that cause hesitation. A home assessment is not permission to remove a surgeon's precaution.",
  dos: "Keep the route clear, place frequently used items within the assessed reach, use the prescribed aid and guarding position, and practise one routine when the person is alert.",
  donts: "Do not pull an operated arm or leg, use a plastic stool or loose mat as an unreviewed solution, rush a turn because the bathroom is nearby, or treat an easier morning as permission to lift, squat, or sit on the floor.",
  safety: "Seek prompt medical advice for increasing wound pain or drainage, fever, new calf swelling, uncontrolled pain, repeated dizziness, or a sudden inability to bear the previously allowed load. Emergency help is needed for chest pain, severe breathlessness, collapse, or sudden neurological symptoms.",
});

const maduraiGeriatricNutrition = articleContent({
  opening: "In geriatric rehabilitation, a smaller meal can have several explanations. Appetite may be lower after illness, chewing may be tiring, dentures may not fit, a person may forget to drink, or fatigue may arrive before the meal is finished. In Madurai, the useful nutrition question is what the family should observe and share with the clinical team before adding supplements or removing familiar foods.",
  context: "Madurai's geriatric and neurological rehabilitation profile supports careful observation, not a universal older-adult menu. The clinically important context includes recent illness, mobility, oral health, swallowing, medicines, mood, cognition, bowel pattern, weight change, and who prepares or supervises meals. A city or locality does not prove a shared nutrition problem. Population dietary guidance must still be translated by the person's clinician.",
  assessment: "The team may ask about appetite, unintentional weight change, chewing, food sticking, coughing, voice change, denture comfort, nausea, constipation, alertness, fatigue, meal duration, and the amount left uneaten. A dietitian may assess malnutrition risk and intake, while a dentist, doctor, or speech-language clinician may address a different barrier. The physiotherapist may examine sitting balance, upper-limb reach, transfers to the dining chair, and whether the person can safely participate in the meal routine. One symptom does not establish the cause.",
  progression: "The first step may be a consistent record of what was offered, what was eaten, the person's position, symptoms, and how they felt afterwards. The clinical team may then change the environment, assistance, food choice, meal schedule, or supplement plan. The appropriate texture, fluid approach, protein advice, or diabetes and kidney adjustment depends on assessment and medical context. Progress may be more reliable intake, less fatigue during the routine, or greater independence with setup rather than meeting a fixed number.",
  homeSession: "A home session can examine the dining chair, table height, lighting, utensils, route to the kitchen, and the amount of help a family member gives. The therapist can separate a transfer or sitting problem from a swallowing or nutrition problem and coordinate a referral when needed. A simple record can include time, posture, foods or fluids attempted, coughing or voice change, amount left, and later symptoms. It should support professional review, not become a home swallowing test.",
  dos: "Record observable changes, report unintentional weight loss or repeated meal difficulty early, keep the person positioned and supervised as advised, and ask which professional should answer each question.",
  donts: "Do not force a meal, silently thicken every drink, start a supplement, remove a food group, crush medicines, or change medicine timing without the responsible clinical team.",
  safety: "Any of these symptoms needs prompt clinical review: repeated choking, a wet voice after swallowing, breathing difficulty during or after meals, dehydration concern, fever, rapidly falling intake, or new confusion. Any of these situations needs immediate help: severe breathing difficulty, blue lips, collapse, or an airway emergency.",
});

const maduraiWalkingReadiness = articleContent({
  opening: "After a hospital stay, a person may walk a short distance and still not be ready for an independent walking plan. Recovery can change between morning and evening, after a meal, after a poor night's sleep, or on the day following activity. A Madurai exercise-physiology review can examine the pattern across the day rather than turning one successful walk into a universal target.",
  context: "Madurai's post-surgery, neurological, and geriatric pathways can involve very different reasons for reduced walking: weakness, pain, balance loss, breathlessness, dizziness, fear, medication effects, or deconditioning. The city context does not identify the cause. A useful handover describes the starting task, assistance, symptoms, pause, recovery, and next-day response, alongside the diagnosis and medical precautions.",
  assessment: "The clinician may review the hospital course, surgery or neurological event, medicines, sleep, nutrition, falls, pain, breathing, swelling, and the person's prior walking role. They may observe sit-to-stand, turning, a short household route, aid use, breathing pattern, alertness, and recovery after the task. Heart rate, blood pressure, oxygen, or exertion ratings may be used when clinically indicated, but this article does not establish a home cut-off or authorise self-adjustment of medication or oxygen.",
  progression: "The plan may begin with a predictable task and a clear stop-and-contact plan. The clinician may change supervision, route, footwear, rest, chair height, timing, or aid before changing distance. When the response is consistent, one feature can be reviewed at a time. A person may tolerate walking but not a crowded route, stairs, carrying, or a second outing later that day. Progress is a reviewed pattern of safer function, not a race to accumulate steps.",
  homeSession: "A home session can observe the bed-to-chair route, the doorway, the bathroom, a preferred chair, and the places where the person tends to rush or stop. The therapist can help the family record task, assistance, symptom, pause, recovery, and later effect without asking them to diagnose the cause. If a response suggests a medical change, the appropriate next step is communication with the treating team rather than a harder exercise.",
  dos: "Use the assessed route and aid, change position deliberately, note the next-day effect, and bring the discharge instructions and medicine list to the review.",
  donts: "Do not set a universal step count, test walking alone after a warning symptom, compare recovery with another person, or stop prescribed treatment because a walking record looks different.",
  safety: "Any of these symptoms needs urgent medical assessment: fainting, chest pain, severe breathlessness, new neurological signs, collapse, a fall with injury, a racing heartbeat with symptoms, or rapidly worsening weakness. Repeated near-falls or a new pattern of dizziness should be reported before the plan advances.",
});

const mysuruStrokeDressing = articleContent({
  opening: "After stroke, dressing and reaching can expose a problem that is missed by a straight-line walk. A person may stand safely but lose balance while pulling on a sleeve, miss one side of the body, forget the order of the task, or tire before fastening clothing. In Mysuru, a home physiotherapy article on this question should focus on the real routine and the kind of cue that improves participation without turning the caregiver into a substitute for the person.",
  context: "Mysuru's stroke and neurological rehabilitation profile is a reason to examine daily tasks, not evidence that every survivor has the same weakness, visual difficulty, or attention problem. The clinician needs to know whether the barrier is strength, sensation, vision, language, planning, balance, pain, fatigue, or the clothing and chair setup. A task can be practised safely without claiming that one dressing method is right for every person.",
  assessment: "The therapist may observe sitting, standing, trunk control, shoulder movement, hand opening, reach across the body, visual attention, sensation, communication, sequencing, and the person's response to a single clear cue. They may examine the chair, bed, mirror, clothing fasteners, footwear, and the place where dressing occurs. New facial droop, speech change, visual loss, sudden weakness, or a severe headache is an emergency concern rather than a practice opportunity.",
  progression: "Practice may start with one stable position and one clothing step, using the person's stronger abilities while protecting the affected shoulder and preserving choice. The clinician may then add a sleeve, a fastening, a short standing step, or a change of surface when the earlier sequence is reliable. Progress can mean fewer prompts, safer balance, better problem-solving, or finishing one meaningful part of the task. Speed and independence are not the only measures.",
  homeSession: "The therapist can review the actual bed, chair, mirror, clothing storage, and floor space. They may teach the family how to give a short cue, wait, and offer physical help only within the assessed plan. A home session can also identify whether occupational therapy, vision review, speech-language support, or a medical review is needed. The family should note which step was difficult and whether fatigue or distraction changed the result.",
  dos: "Choose stable seating, lay out items in the agreed order, allow time for the person to initiate the step, and protect the affected arm according to the assessed plan.",
  donts: "Do not pull the affected arm through a sleeve, complete every step without waiting, hide an item as a surprise test, or practise standing dressing alone when balance has not been assessed.",
  safety: "Any of these changes needs immediate medical assessment: a sudden change in strength, speech, vision, alertness, or balance. Seek prompt advice after a fall, shoulder injury, new severe pain, repeated loss of balance, or a change in swallowing or breathing.",
});

const mysuruParkinsonNutrition = articleContent({
  opening: "Parkinson's rehabilitation nutrition questions are often reduced to a food list, but the practical problem may be constipation, low appetite, slow meals, fatigue, swallowing difficulty, or uncertainty about how food and medicines fit together. In Mysuru, a safe article starts with observation and coordination instead of telling every person to change protein, fluids, supplements, or medication timing in the same way.",
  context: "Mysuru's profile includes Parkinson's and geriatric rehabilitation. That context does not establish one local diet or one cause for a person's symptoms. The relevant questions include the Parkinson's treatment plan, swallowing, chewing, appetite, bowel pattern, mobility, hydration advice, weight change, sleep, cognition, and who supervises meals. A dietitian, neurologist, doctor, dentist, or speech-language clinician may each need to answer a different part.",
  assessment: "The team may ask when constipation began, whether the person strains, how long meals take, whether there is coughing or a wet voice, whether appetite varies with medication cycles, and whether weight or fluid intake has changed. They may review medicines, supplements, swallowing history, activity, abdominal symptoms, and a sample food record. The physiotherapist can also examine walking, turning, sitting posture, hand use, and the ability to reach and carry food safely. One symptom should not be used to diagnose a medicine interaction or aspiration.",
  progression: "The first step may be a brief record of meals, symptoms, bowel pattern, medication schedule as prescribed, movement, and recovery. The clinical team may then decide whether the next change concerns food texture, meal setup, fibre, fluid, activity, constipation management, or referral. People with kidney, heart, diabetes, swallowing, or other restrictions need individualized advice. Progress means a safer and more reliable meal routine, not following a fixed internet plan.",
  homeSession: "A home visit may review dining posture, chair height, utensils, kitchen access, the timing of movement around meals, and how the caregiver offers help. The therapist can identify whether a transfer, tremor, freezing, fatigue, or hand-control problem is making meals harder and can coordinate with the relevant clinician. A record of time, food, symptoms, bowel change, and recovery can make the next consultation more precise without becoming a prescription.",
  dos: "Keep the neurologist's medicine instructions available, record patterns rather than guessing causes, report weight or swallowing change promptly, and ask before changing supplements or meal timing.",
  donts: "Do not stop or retime Parkinson's medicines, force fluids, add fibre or supplements without checking restrictions, or assume constipation, coughing, or appetite loss has one explanation.",
  safety: "Any of these symptoms needs prompt medical review: repeated choking, a wet voice, breathing difficulty after meals, severe abdominal pain, vomiting, marked dehydration, sudden confusion, or rapidly worsening mobility. Any of these situations needs immediate help: collapse, severe breathing difficulty, or an airway emergency.",
});

const mysuruParkinsonExercise = articleContent({
  opening: "Movement in Parkinson's disease can vary with medication timing, fatigue, sleep, attention, anxiety, pain, and the environment. A person may manage a familiar route one day and freeze or lose confidence at a doorway the next. In Mysuru, exercise physiology should begin by understanding that variability and deciding what can be practised safely, rather than prescribing a harder routine from a single good performance.",
  context: "Mysuru's Parkinson's and geriatric rehabilitation profile supports a task-based review. The city does not predict whether a person has freezing, tremor, dyskinesia, weakness, falls, or cardiopulmonary limitations. The useful context is the person's medication plan, usual task, cueing response, footwear, surface, lighting, fatigue, and what happens later in the day. Exercise decisions must remain coordinated with the treating team.",
  assessment: "The clinician may ask when movement is better or worse, whether freezing occurs at turns or thresholds, how falls or near-falls happen, and whether pain, breathlessness, dizziness, or sleep changes the response. They may observe sit-to-stand, turning, step initiation, rhythm, dual-task demand, walking aid use, breathing, and recovery without asking the person to chase a maximum effort. A new severe headache, sudden weakness, chest pain, fainting, or abrupt confusion needs medical assessment.",
  progression: "The plan may begin with one predictable movement task and a cue that the person understands. The clinician may then review a turn, doorway, change of surface, or short household route while maintaining an agreed safety position. Progress can mean fewer freezing episodes, better self-cueing, more consistent recovery, or safer decision-making. It is not permission to add speed, stairs, resistance, or complex dual-task work independently.",
  homeSession: "A home session can show the bed, chair, doorway, bathroom, walking aid, and the place where freezing or hesitation occurs. The therapist may teach the caregiver to cue without pulling, identify when to pause, and create a short record of medication context, task, cue, symptom, and recovery. The clinician may recommend a neurology, occupational therapy, speech-language, vision, or falls review when the exercise question is not the whole problem.",
  dos: "Practise the assessed task when the person is alert, use the agreed cue, keep a clear route, and record whether the response changes with fatigue or medication timing.",
  donts: "Do not pull a person through a freeze, add a second task to prove ability, practise near stairs without the guarding plan, or change medicine timing to make exercise easier.",
  safety: "Any of these warning signs needs medical advice: a fall with injury, repeated near-falls, fainting, chest pain, severe breathlessness, sudden confusion, or a rapid change in speech, strength, or walking. Stop remote or home practice when the environment cannot be guarded safely.",
});

const mangaluruCopdPacing = articleContent({
  opening: "Bathing and meal preparation can become exercise tests when COPD-related breathlessness, cough, fatigue, or fear interrupts the routine. The goal is not to tell every person to move more or breathe in one special pattern. In Mangaluru, physiotherapy can examine how the task is organized, where pauses occur, and which symptoms need respiratory or medical review.",
  context: "Mangaluru's profile includes COPD and pulmonary rehabilitation. The city setting does not prove a local air-quality burden, prevalence, or identical access pathway. The clinically useful context is the person's diagnosis, inhaler and oxygen instructions, sputum pattern, bathroom and kitchen layout, standing tolerance, chair availability, heat or humidity exposure, and the tasks that matter to the household.",
  assessment: "The therapist may ask whether breathlessness begins before the task, during reaching, while standing, or after carrying; whether cough or sputum has changed; and whether there is chest pain, wheeze, fever, swelling, dizziness, or new confusion. They may observe sit-to-stand, walking to the bathroom, reaching for clothing, standing at a counter, breathing recovery, and device safety when prescribed. Oxygen flow, medication, and clinical thresholds remain the responsibility of the treating team.",
  progression: "The first change may be task design: sitting for part of bathing or food preparation, placing items within reach, separating heavy and light steps, and using planned pauses before severe breathlessness. A clinician may then review time, assistance, route, and recovery one feature at a time. Progress can mean finishing a meaningful routine with less panic, safer breathing recovery, or better planning. It does not mean pushing through a flare or copying a universal oxygen or exertion target.",
  homeSession: "The therapist can observe the bathroom, kitchen counter, chair, route, footwear, and where a caregiver can help without blocking. They may review pursed-lip or recovery breathing when appropriate, teach energy-conservation choices, and identify when the person needs the pulmonary team. The family can bring the inhaler list, oxygen instructions, discharge papers, and a short record of task, symptoms, pause, and recovery.",
  dos: "Keep prescribed inhalers and oxygen instructions available, sit for demanding parts of the routine when advised, pause before panic escalates, and report a changed cough or sputum pattern.",
  donts: "Do not alter oxygen, stop prescribed inhalers, hold the breath during a transfer, carry heavy items while breathless, or treat a new flare as a conditioning challenge.",
  safety: "Any of these symptoms needs urgent medical review: new or severe breathlessness, chest pain, blue lips, fainting, confusion, coughing blood, fever with worsening respiratory symptoms, or rapidly increasing swelling. Follow the person's emergency respiratory plan rather than waiting for physiotherapy.",
});

const mangaluruPulmonaryNutrition = articleContent({
  opening: "A person with chronic respiratory disease may finish a meal feeling more breathless than hungry. The effort of sitting, chewing, talking, coughing, and recovering can make intake difficult, while weight change may have several causes. A Mangaluru pulmonary rehabilitation nutrition article should help families record the pattern and ask the right team, not prescribe a universal high-calorie, high-protein, fluid, or supplement plan.",
  context: "Mangaluru's pulmonary rehabilitation context supports careful coordination between respiratory, nutrition, swallowing, and rehabilitation teams. It does not prove that every household has the same food access or that breathlessness during meals has one cause. The person’s diagnosis, medicines, oxygen instructions, swallowing, appetite, weight trend, bowel pattern, kidney or heart restrictions, and meal setup all matter.",
  assessment: "The team may ask whether breathlessness begins before eating, after a few mouthfuls, with liquids, while talking, or during recovery; whether cough, sputum, wet voice, fever, swelling, orthopnoea, appetite change, or unintentional weight loss is present; and what food or fluid restrictions have already been prescribed. A dietitian, speech-language clinician, doctor, or respiratory team may each assess a different risk. A meal record can describe events but cannot diagnose aspiration or respiratory failure.",
  progression: "The first step may be a short, consistent observation of posture, meal time, pauses, coughing, voice, amount eaten, and recovery. The team may then review dining position, texture, meal spacing, energy adequacy, supplement need, or referral. Any high-protein, sodium, fluid, renal, diabetic, or texture decision must match the person's medical assessment. Progress means more reliable intake and safer recovery, not meeting an internet target.",
  homeSession: "A home visit can examine the dining chair, table, oxygen or device safety where prescribed, route to the kitchen, and how help is offered. The therapist can identify whether standing, fatigue, hand use, or breathlessness is limiting meal preparation while the dietitian or swallowing clinician addresses nutrition and swallowing decisions. Families should bring the food and fluid record, medicine list, weight history, and respiratory instructions.",
  dos: "Record the sequence of symptoms in plain language, report falling intake or weight change early, keep the person positioned as advised, and ask which team manages each restriction.",
  donts: "Do not force a meal, remove fluids, add a supplement, use a thickener, change oxygen, or assume one breathless meal proves aspiration or heart failure.",
  safety: "Any of these symptoms needs prompt or urgent review: new severe breathlessness, chest pain, blue lips, fainting, repeated choking, wet voice with respiratory symptoms, fever, confusion, or inability to maintain prescribed intake. Follow emergency instructions for a serious breathing episode.",
});

const mangaluruCopdExercise = articleContent({
  opening: "Cough and sputum are not just background details when a person with COPD is deciding whether to exercise. A familiar walk may feel different during a flare, after poor sleep, or when recovery takes longer. In Mangaluru, exercise physiology can help connect the task to the respiratory pattern while keeping medication, oxygen, infection, and exacerbation decisions with the treating team.",
  context: "The Mangaluru profile includes COPD and pulmonary rehabilitation. The city name does not establish a local respiratory cause or a confirmed pulmonary service. Relevant context includes the person's diagnosis, usual sputum, cough, wheeze, inhaler plan, oxygen prescription, recent infection, sleep, nutrition, falls, and the home route where activity occurs.",
  assessment: "The clinician may ask what changed from the person's baseline, whether sputum volume or colour changed, how breathlessness settles, whether there is fever, chest pain, swelling, dizziness, or blood, and what the respiratory team has instructed. They may observe a familiar transfer or route, posture, walking aid, breathing recovery, and the ability to talk or pause. They do not set a new oxygen flow, medication dose, or universal saturation cut-off in an educational article.",
  progression: "A reviewed plan may begin with a task that can be stopped easily and a written response plan. The clinician may then adjust supervision, route, pacing, rest, or timing before increasing workload. A stable cough pattern does not make a flare safe to exercise through. Progress may be clearer recovery, safer pacing, or a return to one meaningful task after medical review rather than a longer walk every session.",
  homeSession: "The therapist can examine the route, chair, stairs, bathroom, walking aid, and place where the person rests. They may help the family record baseline versus changed cough or sputum, activity, symptoms, pause, recovery, and next-day response. The session can also identify when a respiratory review, medication check, infection assessment, or pulmonary rehabilitation referral is needed.",
  dos: "Keep the respiratory action plan available, describe changes from baseline, use the assessed route, allow recovery, and share repeated patterns with the treating team.",
  donts: "Do not exercise through a suspected exacerbation, change oxygen or inhalers independently, use another person's saturation target, or interpret sputum colour without the clinical context.",
  safety: "Any of these symptoms needs urgent medical assessment: new severe breathlessness, chest pain, blue lips, fainting, confusion, coughing blood, fever with worsening symptoms, or rapidly changing sputum and function. Stop activity and follow the respiratory plan when the person's response is not their usual pattern.",
});

const suratKneeVehicleMobility = articleContent({
  opening: "After knee replacement, getting into a car, stepping over a threshold, or reaching a community destination can be harder than walking a straight line in a hallway. The movement combines knee bend, balance, turning, seat height, door space, and the driver's or passenger's role. A Surat home physiotherapy review can make vehicle and community mobility a specific question instead of assuming that a hospital corridor proves readiness.",
  context: "Surat's profile includes knee replacement and post-surgery rehabilitation. The city and its localities do not establish a common recovery timeline or transport pattern. The plan depends on the operation, surgeon's restrictions, pain and swelling, strength, balance, walking aid, vehicle seat, door opening, traffic environment, and whether the person is a passenger or considering driving. Driving decisions belong to the responsible medical and legal framework, not a physiotherapy article alone.",
  assessment: "The therapist may review the discharge instructions, knee movement, swelling, wound, weight-bearing status, sit-to-stand, turning, step control, getting on and off a stable seat, and the caregiver's ability to guard. They may inspect a safe approximation of the vehicle transfer without asking the person to enter a moving vehicle or practise in traffic. Increasing calf pain or swelling, wound change, fever, chest symptoms, or a sudden loss of function needs medical review.",
  progression: "Practice may start with a stable chair and the exact order of turning, backing up, sitting, moving the legs, and standing, using the assessed aid. A later step may involve a supervised stationary vehicle with enough space and the treating team's permission. Community mobility adds thresholds, uneven ground, waiting, and fatigue; it is not automatically granted by a successful car transfer. Progress can mean better sequencing and less assistance rather than deeper knee flexion on demand.",
  homeSession: "A home session can review the path from the front door to the vehicle, the surface, a stable chair, the car seat height, door clearance, and where the caregiver can stand. The therapist may teach a pause-and-check sequence and document which part is not yet safe. They can also explain which questions need the surgeon, doctor, occupational therapist, or driving assessor.",
  dos: "Use the prescribed aid, clear the transfer space, choose the safest seat and time of day discussed with the team, and rehearse the sequence before a necessary appointment.",
  donts: "Do not twist on the operated leg, pull the person by the arms, practise beside moving traffic, carry luggage during the first attempts, or treat a car transfer as clearance to drive.",
  safety: "Seek prompt medical advice for increasing swelling, wound drainage, fever, severe pain, new calf symptoms, repeated giving way, or a sudden reduction in walking. Emergency help is needed for chest pain, severe breathlessness, collapse, or new neurological symptoms.",
});

const suratKneeNutrition = articleContent({
  opening: "Nutrition after knee replacement becomes more complicated when diabetes, kidney disease, heart advice, appetite change, or swallowing difficulty is also present. Families may hear conflicting suggestions about protein, salt, fluids, or supplements. A Surat article should help the person prepare questions for the surgical, medical, and nutrition teams without turning general recovery guidance into an individualized prescription.",
  context: "Surat's knee-replacement pathway is the setting for a coordination question, not evidence of a shared diet or surgical outcome. The relevant information includes the operation date, appetite, weight change, usual meals, diabetes or kidney instructions, bowel symptoms, medicines, chewing and swallowing, mobility, wound status, and who prepares food. ESPEN, NICE, diabetes, kidney, and Indian dietary guidance still require clinical translation for the individual.",
  assessment: "A clinician may review unintentional weight change, intake, nausea, constipation, blood-glucose plan, kidney or heart restrictions, supplements, medicine timing, mobility, and the surgeon's instructions. A dietitian may assess nutrition risk, while the medical team manages diabetes, renal, cardiac, or wound decisions. The physiotherapist can examine whether pain, transfers, or reduced mobility is making shopping, cooking, or dining difficult. No single food rule answers all of these questions.",
  progression: "The first step may be a record of intake, appetite, bowel pattern, symptoms, assistance, and what the person could manage before and after surgery. The team may then decide whether to change meal setup, food choice, supplement use, shopping help, or referral. A plan for a person with diabetes or kidney disease cannot be copied from a healthy peer. Progress may be adequate intake, safer food preparation, and better participation in recovery rather than a universal protein target.",
  homeSession: "A home visit may examine the dining chair, kitchen route, shopping and cooking tasks, standing tolerance, pain during meal preparation, and the person's ability to access food safely. The therapist can identify functional barriers and coordinate questions for the dietitian, surgeon, diabetes team, or renal team. Families can bring the medicine list, discharge instructions, weight history, and a short record of intake and symptoms.",
  dos: "Keep the surgical and medical instructions together, report poor intake or weight change early, ask who manages each restriction, and plan food preparation around the assessed mobility limits.",
  donts: "Do not start a supplement, remove salt or fluids, change diabetes medicine timing, crush medicines, or follow a high-protein plan without checking the responsible team.",
  safety: "Any of these symptoms needs prompt clinical review: repeated vomiting, inability to maintain prescribed intake, severe dehydration, confusion, repeated low or high glucose symptoms, fever with wound change, or rapidly worsening swelling. Any of these situations needs emergency help: severe breathlessness, chest pain, collapse, or an acute medical change.",
});

const suratKneeExercise = articleContent({
  opening: "Swelling after knee replacement can change how a person walks, sits, climbs, and responds later in the day. The useful exercise question is not whether the knee can be pushed through discomfort, but how the clinical team distinguishes an expected response from a wound, clot, infection, or load problem. In Surat, a reviewed plan can connect exercise to function and next-day recovery.",
  context: "Surat's profile includes knee replacement rehabilitation. The city context does not establish a common swelling pattern or recovery timeline. The relevant factors are the operation, surgeon's precautions, wound, pain, swelling trend, range, strength, gait, sleep, medication, walking aid, daily demands, and whether the person has a medical condition that changes exercise decisions.",
  assessment: "The clinician may ask when swelling appears, what activity preceded it, whether it settles with the agreed rest or elevation plan, and whether there is fever, wound drainage, calf pain, breathlessness, giving way, or a sudden loss of movement. They may observe walking, sit-to-stand, step control, knee movement, quadriceps use, aid technique, and recovery without assigning a universal repetition or pain threshold. The surgeon or medical team remains responsible for surgical and medication decisions.",
  progression: "The plan may change one variable at a time: exercise selection, assistance, route, rest, timing, or household demand. The clinician may use function and later response to decide whether to maintain, reduce, or progress the task. More repetitions are not automatically better, and a quiet knee during a session does not establish a good next-day response. Progress can mean a smoother transfer, safer walking, better confidence, and a stable recovery pattern.",
  homeSession: "A home session can observe the route from bed to bathroom, the preferred chair, a threshold, a step, and the place where exercises are done. The therapist may check the aid, footwear, swelling observation method, and how the family offers help. They can document which activities are independent, supervised, or not yet appropriate and identify when the surgeon or medical team should review the response.",
  dos: "Follow the agreed surgical precautions, record activity and later response, use the assessed aid, and report a swelling pattern that is new, escalating, or associated with other symptoms.",
  donts: "Do not chase a range or repetition number, add weights or stairs because swelling was lower one day, massage a wound without advice, or compare the knee with another person's recovery.",
  safety: "Any of these symptoms needs urgent medical assessment: increasing calf pain or swelling, wound drainage, fever, a hot worsening knee, sudden loss of movement, chest pain, severe breathlessness, or collapse. Stop the programme and contact the responsible team when the response differs sharply from the expected plan.",
});

export const cityJournalBatch6Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-madurai-orthopaedic-routines",
    slug: "orthopaedic-surgery-bathing-dressing-home-routines-madurai",
    title: "After Orthopaedic Surgery in Madurai: Bathing, Dressing, and Safer Home Routines",
    metaTitle: "Home Routines After Orthopaedic Surgery in Madurai",
    metaDescription: "A practical Madurai guide to bathing, dressing, transfers, surgical precautions, caregiver guarding, and safer home routines after orthopaedic surgery.",
    excerpt: "How a home physiotherapy assessment can turn bathing, dressing, and household routines into specific rehabilitation questions after orthopaedic surgery.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "madurai",
    discipline: "physiotherapy",
    content: maduraiOrthopaedicRoutines,
    sources: [refs.niceJoint, refs.niceJointRecommendations, refs.whoPostop, refs.whoRehab, refs.maduraiProfile, refs.aaosKnee],
  },
  {
    id: "city-journal-madurai-geriatric-nutrition",
    slug: "geriatric-rehabilitation-appetite-chewing-weight-questions-madurai",
    title: "Geriatric Rehabilitation in Madurai: Appetite, Chewing, and Weight-Change Questions",
    metaTitle: "Geriatric Rehabilitation Nutrition Questions in Madurai",
    metaDescription: "A cautious Madurai guide to appetite, chewing, meal fatigue, weight change, swallowing questions, and nutrition referrals during rehabilitation care plans.",
    excerpt: "What families can record when an older adult eats less, tires during meals, or has chewing and swallowing questions during rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "madurai",
    discipline: "nutrition",
    content: maduraiGeriatricNutrition,
    sources: [refs.niceMalnutrition, refs.niceNutrition, refs.whoHealthyDiet, refs.icmrDiet, refs.whoRehab, refs.maduraiProfile],
  },
  {
    id: "city-journal-madurai-walking-readiness",
    slug: "walking-readiness-after-hospitalisation-madurai",
    title: "Walking Readiness After Hospitalisation in Madurai: Reviewing Recovery Across the Day",
    metaTitle: "Walking Readiness After Hospitalisation in Madurai",
    metaDescription: "A safety-first Madurai guide to reviewing walking readiness, symptoms, assistance, recovery, and next-day response after hospitalisation. Review helps.",
    excerpt: "How exercise assessment can distinguish a useful walking progression from a medical change after neurological, surgical, or geriatric hospitalisation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "madurai",
    discipline: "exercise-physiology",
    content: maduraiWalkingReadiness,
    sources: [refs.niceCritical, refs.whoRehab, refs.whoPostop, refs.whoHealthyDiet, refs.niceJoint, refs.maduraiProfile],
  },
  {
    id: "city-journal-mysuru-stroke-dressing",
    slug: "stroke-dressing-reaching-home-practice-mysuru",
    title: "Stroke Rehabilitation in Mysuru: Rebuilding Dressing and Reaching Tasks at Home",
    metaTitle: "Stroke Dressing and Reaching Rehabilitation in Mysuru",
    metaDescription: "A practical Mysuru stroke guide to dressing, reaching, cueing, shoulder protection, balance, and safer home practice. The next step depends on symptoms.",
    excerpt: "How a home physiotherapy review can make dressing and reaching practice safer after stroke without treating every person’s movement problem as the same.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "mysuru",
    discipline: "physiotherapy",
    content: mysuruStrokeDressing,
    sources: [refs.niceStroke, refs.asaDailyLiving, refs.ahaStroke, refs.whoRehab, refs.niceCritical, refs.mysuruProfile],
  },
  {
    id: "city-journal-mysuru-parkinson-nutrition",
    slug: "parkinsons-constipation-appetite-meal-questions-mysuru",
    title: "Parkinson’s Rehabilitation in Mysuru: Constipation, Appetite, and Meal Questions",
    metaTitle: "Parkinson’s Nutrition & Rehab in Mysuru | Goswami Rehab",
    metaDescription: "A careful Mysuru guide to constipation, appetite, meal fatigue, swallowing, medicine questions, and nutrition referrals in Parkinson’s rehabilitation.",
    excerpt: "What to observe and discuss when constipation, appetite, swallowing, or meal fatigue complicates Parkinson’s rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "mysuru",
    discipline: "nutrition",
    content: mysuruParkinsonNutrition,
    sources: [refs.niceParkinson, refs.parkinsonFoundationNutrition, refs.parkinsonFoundationConstipation, refs.niceNutrition, refs.whoHealthyDiet, refs.mysuruProfile],
  },
  {
    id: "city-journal-mysuru-parkinson-exercise",
    slug: "parkinsons-exercise-movement-variability-mysuru",
    title: "Parkinson’s Exercise in Mysuru: What to Review When Movement Varies",
    metaTitle: "Parkinson’s Exercise and Movement Variability in Mysuru",
    metaDescription: "A safety-first Mysuru guide to Parkinson’s exercise assessment, medication context, cueing, freezing, falls risk, and recovery. Review guides next steps.",
    excerpt: "How exercise physiology can account for movement variability in Parkinson’s rehabilitation without turning one good session into a fixed prescription.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "mysuru",
    discipline: "exercise-physiology",
    content: mysuruParkinsonExercise,
    sources: [refs.niceParkinson, refs.parkinsonFoundationExercise, refs.niceCritical, refs.whoRehab, refs.whoActivity, refs.mysuruProfile],
  },
  {
    id: "city-journal-mangaluru-copd-pacing",
    slug: "copd-pacing-bathing-meal-preparation-mangaluru",
    title: "COPD Physiotherapy in Mangaluru: Pacing Bathing and Meal Preparation",
    metaTitle: "COPD Pacing for Bathing and Meal Preparation in Mangaluru",
    metaDescription: "A practical Mangaluru COPD guide to pacing bathing, meal preparation, breathlessness recovery, device safety, and when medical review comes first now.",
    excerpt: "How home physiotherapy can connect COPD breathlessness with the real routines of bathing and meal preparation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Pulmonary Rehabilitation",
    image: "/images/journal/journal_cardiopulmonary-rehabilitation.jpg",
    citySlug: "mangaluru",
    discipline: "physiotherapy",
    content: mangaluruCopdPacing,
    sources: [refs.niceCopd, refs.atsPulmonary, refs.nhlbiPulmonary, refs.whoRehab, refs.niceCritical, refs.mangaluruProfile],
  },
  {
    id: "city-journal-mangaluru-pulmonary-nutrition",
    slug: "pulmonary-rehabilitation-meal-fatigue-weight-change-mangaluru",
    title: "Pulmonary Rehab in Mangaluru: Meal Fatigue and Weight Change",
    metaTitle: "Meal Fatigue in Mangaluru Pulmonary Rehab",
    metaDescription: "A cautious Mangaluru guide to recording meal fatigue, breathlessness, weight change, swallowing questions, and pulmonary nutrition referrals. Review helps.",
    excerpt: "What families should record when chronic respiratory disease makes eating tiring or weight changes during pulmonary rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "mangaluru",
    discipline: "nutrition",
    content: mangaluruPulmonaryNutrition,
    sources: [refs.niceCopd, refs.atsPulmonary, refs.niceNutrition, refs.niceMalnutrition, refs.whoHealthyDiet, refs.mangaluruProfile],
  },
  {
    id: "city-journal-mangaluru-copd-exercise",
    slug: "copd-exercise-cough-sputum-recovery-mangaluru",
    title: "COPD Exercise in Mangaluru: Cough, Sputum, and Recovery",
    metaTitle: "COPD Exercise and Sputum Changes in Mangaluru",
    metaDescription: "A safety-first Mangaluru guide to COPD exercise assessment, cough, sputum, recovery, respiratory action plans, and when to pause. Review guides next steps.",
    excerpt: "How exercise physiology can connect COPD activity with cough and sputum changes without asking a person to exercise through an exacerbation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "mangaluru",
    discipline: "exercise-physiology",
    content: mangaluruCopdExercise,
    sources: [refs.niceCopd, refs.atsPulmonaryGuideline, refs.atsPulmonary, refs.nhlbiPulmonary, refs.whoRehab, refs.mangaluruProfile],
  },
  {
    id: "city-journal-surat-knee-vehicle",
    slug: "knee-replacement-vehicle-transfers-community-mobility-surat",
    title: "Knee Replacement Rehabilitation in Surat: Vehicle Transfers and Community Mobility",
    metaTitle: "Vehicle Transfers After Knee Replacement in Surat",
    metaDescription: "A practical Surat knee-replacement guide to vehicle transfers, thresholds, walking aids, community mobility, caregiver guarding, and driving boundaries.",
    excerpt: "How a home physiotherapy assessment can prepare a safer vehicle transfer and community route after knee replacement.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "surat",
    discipline: "physiotherapy",
    content: suratKneeVehicleMobility,
    sources: [refs.niceJoint, refs.niceJointRecommendations, refs.aaosKnee, refs.whoPostop, refs.whoRehab, refs.suratProfile],
  },
  {
    id: "city-journal-surat-knee-nutrition",
    slug: "knee-replacement-nutrition-diabetes-kidney-questions-surat",
    title: "Knee Replacement in Surat: Nutrition Questions When Diabetes or Kidney Advice Is Active",
    metaTitle: "Knee Replacement Nutrition Questions in Surat",
    metaDescription: "A careful Surat guide to nutrition questions after knee replacement when diabetes, kidney, heart, appetite, or swallowing advice is also active today.",
    excerpt: "How to prepare nutrition questions for the surgical, medical, diabetes, kidney, and dietetic teams around knee replacement recovery.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "surat",
    discipline: "nutrition",
    content: suratKneeNutrition,
    sources: [refs.espenSurgery, refs.niceNutrition, refs.diabetesNutrition, refs.kidneyNutrition, refs.icmrDiet, refs.suratProfile],
  },
  {
    id: "city-journal-surat-knee-exercise",
    slug: "knee-replacement-swelling-load-tolerance-exercise-surat",
    title: "After Knee Replacement in Surat: Monitoring Swelling and Load Tolerance",
    metaTitle: "Knee Replacement Exercise and Swelling Review in Surat",
    metaDescription: "A safety-first Surat guide to knee-replacement exercise, swelling, load tolerance, next-day response, surgical precautions, and escalation. Review helps.",
    excerpt: "How exercise assessment can connect knee swelling and later recovery with functional progress after knee replacement.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "surat",
    discipline: "exercise-physiology",
    content: suratKneeExercise,
    sources: [refs.niceJoint, refs.aaosKneeExercise, refs.aaosKnee, refs.whoPostop, refs.niceCritical, refs.suratProfile],
  },
];