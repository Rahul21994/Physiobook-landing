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
  niceStroke: source(
    "Stroke rehabilitation in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations",
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
  niceJoint: source(
    "Joint replacement: postoperative rehabilitation",
    "NICE",
    "https://www.nice.org.uk/guidance/QS206/chapter/statement-5-postoperative-rehabilitation",
  ),
  niceCopd: source(
    "Chronic obstructive pulmonary disease",
    "NICE",
    "https://www.nice.org.uk/guidance/ng115/chapter/recommendations",
  ),
  niceCritical: source(
    "Rehabilitation after critical illness in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg83/chapter/Recommendations",
  ),
  whoRehab: source(
    "Rehabilitation",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/rehabilitation",
  ),
  whoActivity: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  whoHealthyDiet: source(
    "Healthy diet",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/healthy-diet",
  ),
  whoPostop: source(
    "Post-operative care",
    "World Health Organization",
    "https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/surgical-care/imeesc-toolkit/best-practice-safety-protocols/post-operative-care.pdf",
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
  espensaSurgery: source(
    "ESPEN practical guideline: clinical nutrition in surgery",
    "European Society for Clinical Nutrition and Metabolism",
    "https://www.espen.org/files/ESPEN-Guidelines/ESPEN_practical_guideline_Clinical_nutrition_in_surgery.pdf",
  ),
  icmrDiet: source(
    "Dietary Guidelines for Indians 2024",
    "National Institute of Nutrition, ICMR",
    "https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
  ),
  diabetesNutrition: source(
    "Nutrition and diabetes",
    "American Diabetes Association",
    "https://diabetes.org/food-nutrition",
  ),
  vadodaraProfile: source(
    "Vadodara District",
    "Government of Gujarat",
    "https://vadodara.nic.in/",
  ),
  kanpurProfile: source(
    "Kanpur Nagar District",
    "Government of Uttar Pradesh",
    "https://kanpurnagar.nic.in/",
  ),
  varanasiProfile: source(
    "Varanasi District",
    "Government of Uttar Pradesh",
    "https://varanasi.nic.in/",
  ),
  bhopalProfile: source(
    "Bhopal District",
    "Government of Madhya Pradesh",
    "https://bhopal.nic.in/",
  ),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person's condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when an exercise plan needs review, but it does not replace emergency or specialist medical care.

The article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, neurologist, dietitian, speech-language clinician, respiratory team, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
`;

function articleContent({
  city,
  opening,
  context,
  assessment,
  progression,
  homeSession,
  dos,
  donts,
  safety,
}: {
  city: string;
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

City context is used here only to make the home setting understandable. A ${city} address does not establish local prevalence, neighbourhood risk, outcome, or confirmed service availability. The same clinical question can require a different plan for two people in the same city.

### What a physiotherapist assesses

${assessment}

The assessment is not a formality before an exercise sheet. It separates a familiar rehabilitation problem from a new medical change, identifies the task that matters to the person, and decides what requires supervision or another professional. Discharge records, medicines, precautions, equipment, fatigue pattern, and family observations are part of the clinical picture. Nutrition-led articles may also require a dietitian or speech-language clinician; cardiopulmonary articles may require the treating medical team.

### How rehabilitation can progress

${progression}

Progress is not the same as adding distance, repetitions, weight, or intensity on a calendar. It can mean better control, less assistance, safer decision-making, improved recovery, or greater confidence in one meaningful task. The clinician should explain what to watch during the activity and afterwards, and when a change means the plan needs review.

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

const vadodaraOrthopaedic = articleContent({
  city: "Vadodara",
  opening: "After orthopaedic surgery, reaching for a pan, lifting a light container, or carrying an item across the kitchen can expose a problem that a straight-line walk misses. The useful question is not whether a person can lift something once, but how the operated area, balance, grip, and surgical precautions behave during a real household sequence.",
  context: "Vadodara's profile includes post-surgery and orthopaedic rehabilitation. The relevant details are the operation, allowed load, movement restrictions, wound status, pain, balance, footwear, counter height, storage position, and whether another person is available to help. A familiar kitchen or household route is a setting for assessment, not evidence that one routine is safe for every patient.",
  assessment: "The physiotherapist may review the discharge summary and observe standing, reaching at different heights, turning, a light controlled lift, and a short carry without asking the person to test a maximum. They may check shoulder, elbow, wrist, hip, knee, or spine contribution; trunk control; walking-aid use; dizziness; and whether a caregiver can help without pulling the operated limb. Wound drainage, fever, calf symptoms, chest symptoms, or a sudden loss of function require medical review.",
  progression: "Practice may begin with stable sitting or standing and an empty-hand reach within the assessed range. The clinician may then add a lightweight object, a short carry, a turn, or a change of counter height one feature at a time. Progress can mean better control, fewer prompts, or completing one household step without compensating through another painful area. It does not automatically authorize lifting, overhead storage, floor-level tasks, or a return to heavier chores.",
  homeSession: "A home session can examine the actual counter, cupboard, chair, walking aid, and route where carrying occurs. The therapist may reorganize the sequence temporarily, teach where a family member should stand, and identify which items should stay within the assessed reach. The family should bring the operation details, restrictions, medicines, and a list of household tasks that cause hesitation.",
  dos: "Keep frequently used items at the assessed height, use the prescribed aid and guarding position, carry only what the treating team has cleared, and practise when the person is alert.",
  donts: "Do not lift a heavy container to prove readiness, twist while carrying, pull on an operated limb, climb onto a stool, or treat a less painful morning as permission to ignore a precaution.",
  safety: "Any of these symptoms needs prompt medical advice: increasing wound pain or drainage, fever, new calf swelling, uncontrolled pain, repeated dizziness, or a sudden inability to bear the previously allowed load. Any of these situations needs emergency help: chest pain, severe breathlessness, collapse, or sudden neurological symptoms.",
});

const vadodaraStrokeNutrition = articleContent({
  city: "Vadodara",
  opening: "After a stroke, eating may be difficult because one hand is weaker, attention changes, fatigue arrives early, or the person cannot organize the plate and utensils. A nutrition question is therefore sometimes also a positioning, communication, swallowing, or meal-setup question. The safest first step is to describe what happens and involve the right clinical team.",
  context: "Vadodara's stroke and neurological rehabilitation profile supports a coordinated meal review, not a universal stroke diet. Useful context includes the person's swallowing history, communication, vision, posture, alertness, appetite, weight change, medicines, usual foods, and who prepares and supervises meals. A city setting does not establish a shared nutrition problem.",
  assessment: "The team may ask whether food remains on one side of the mouth, whether coughing or a wet voice occurs, how long meals take, whether the person can see and reach the plate, and whether fatigue changes the last part of the meal. A speech-language clinician may assess swallowing, a dietitian may assess intake, and the physiotherapist may examine sitting balance, arm support, reach, and transfers to the dining chair. The article cannot establish a safe texture or fluid plan.",
  progression: "The first step may be a record of posture, food or fluid attempted, assistance, visible fatigue, coughing or voice change, and amount left. The team may then change seating, utensil setup, cueing, meal timing, food choice, or referral according to the assessment. Progress may mean staying positioned, participating in one part of meal setup, eating with fewer prompts, or completing a meal with a more predictable response. It is not a reason to force intake or change medicines.",
  homeSession: "A home visit can observe the dining chair, table height, lighting, plate position, kitchen route, and how a family member offers help. The therapist can separate a transfer or sitting problem from a swallowing or nutrition problem and coordinate questions for the appropriate professional. A simple record should support clinical review rather than become a home swallowing test.",
  dos: "Keep the person positioned and supervised as advised, record observable changes, report weight or swallowing concerns early, and bring the discharge and medication information to review.",
  donts: "Do not force food or drink, silently change fluid thickness, crush medicines, remove a food group, or change medicine timing without the responsible clinical team.",
  safety: "Any of these symptoms needs prompt clinical review: repeated choking, a wet voice, coughing during meals, breathing difficulty after eating, rapidly falling intake, dehydration concern, or new confusion. Any of these situations needs immediate help: severe breathing difficulty, blue lips, collapse, or an airway emergency.",
});

const vadodaraGeriatricExercise = articleContent({
  city: "Vadodara",
  opening: "Older-adult conditioning is more useful when it answers a household question: can the person stand, turn, carry a light item, and reach the next room without losing control or needing more help later? A Vadodara exercise-physiology review can build that sequence without reducing readiness to a fixed repetition target.",
  context: "Vadodara's geriatric rehabilitation profile can involve deconditioning, balance loss, pain, weakness, breathlessness, dizziness, fear of falling, or medication effects. The clinician needs the person's prior role, usual walking aid, sleep, nutrition, falls, medical restrictions, and the household route. The city does not predict a shared level of frailty or a universal training dose.",
  assessment: "The clinician may observe sit-to-stand, turning, reaching, a short carry with an appropriate object, breathing recovery, alertness, footwear, and the response later that day. They may ask about near-falls, dizziness, joint pain, blood-pressure symptoms, and whether assistance changes with fatigue. Heart rate, blood pressure, or exertion ratings may be used when indicated, but this article does not create a home cut-off.",
  progression: "The plan may begin with a stable transfer and a short supported route. It can then add a turn, a light carry, a doorway, or a longer recovery interval one change at a time. Progress can mean less assistance, more consistent control, or completing the household sequence without a delayed decline. The plan may reduce or pause when the response suggests a medical change rather than treating that response as a test of willpower.",
  homeSession: "The therapist can observe the preferred chair, route to the kitchen or bathroom, thresholds, walking aid, and the place where the person usually stops. They may teach a family member how to guard without pulling and how to record task, symptoms, assistance, pause, and later effect. A home assessment can also identify the need for medical, occupational therapy, vision, or falls review.",
  dos: "Use the assessed route and aid, change position deliberately, allow recovery, and record near-falls or delayed fatigue as well as successful practice.",
  donts: "Do not carry a hot or heavy item during early practice, add a second task to prove ability, exercise beside an unguarded step, or compare the person's endurance with another older adult.",
  safety: "Any of these warning signs needs urgent medical assessment: fainting, chest pain, severe breathlessness, new neurological signs, collapse, a fall with injury, or rapidly worsening weakness. Repeated near-falls or a new dizziness pattern should be reported before the plan advances.",
});

const kanpurNeurologicalWalking = articleContent({
  city: "Kanpur",
  opening: "A person with neurological weakness may manage a clear hallway but hesitate at a threshold, turn too quickly in a narrow passage, or lose balance when a door changes the walking route. A Kanpur home physiotherapy assessment can study those transitions directly instead of assuming that a straight-line walk represents safe household mobility.",
  context: "Kanpur's neurological and post-surgery pathways can involve weakness, sensory change, visual difficulty, neglect, pain, fatigue, or planning problems. The relevant home details are the width of the route, threshold height, door direction, lighting, footwear, walking aid, furniture, and where a caregiver can stand. The locality does not establish one home layout or one cause of unsteadiness.",
  assessment: "The therapist may observe turning, approaching a threshold, opening and closing a door, changing direction, stopping, and using an aid without asking the person to rush. They may assess strength, sensation, vision, attention, trunk control, communication, dizziness, and the person's response to a short cue. A sudden change in speech, vision, strength, alertness, or balance is an emergency concern.",
  progression: "Practice may start with one predictable doorway and a clear pause point. The clinician may then review a turn, a different surface, carrying an empty hand, or a busier route only when the earlier transition is consistent. Progress can mean better foot placement, fewer prompts, safer decision-making, or a reliable stop before the threshold. It does not mean practising near stairs without the agreed guarding plan.",
  homeSession: "A home visit can map the bed-to-bathroom or bed-to-chair route, check the aid and footwear, and teach a family member where to stand. The therapist may suggest moving one obstacle temporarily and write down which transitions are independent, supervised, or not yet appropriate. The record should describe what happened without asking the family to diagnose the neurological cause.",
  dos: "Keep the route clear and well lit, approach transitions slowly, use the assessed aid, and agree on one short cue that the person understands.",
  donts: "Do not pull the person through a turn, carry a distracting object during early practice, practise beside stairs without supervision, or use a borrowed walking aid without fitting.",
  safety: "Any of these changes needs immediate medical assessment: a sudden change in strength, speech, vision, alertness, or balance. Seek prompt advice after a fall, repeated near-falls, new severe pain, or a new pattern of dizziness.",
});

const kanpurSurgeryNutrition = articleContent({
  city: "Kanpur",
  opening: "After surgery, appetite and bowel changes can make a person eat less just when the family is trying to support recovery. Nausea, constipation, pain, medicines, reduced movement, chewing difficulty, and an unrelated medical restriction can all change the right next question. A Kanpur home review should document the pattern before anyone adds a supplement or removes familiar foods.",
  context: "Kanpur's post-surgery rehabilitation setting is a reason to coordinate nutrition and function, not evidence for one recovery menu. Relevant details include the operation, discharge instructions, appetite, vomiting, bowel pattern, weight trend, hydration advice, medicines, wound status, mobility, and who prepares meals. A dietitian, surgeon, doctor, or physiotherapist may each answer a different part.",
  assessment: "The team may ask what was eaten and left, how long meals take, whether nausea or constipation limits intake, whether swallowing or chewing is difficult, and whether pain prevents sitting or reaching the table. A dietitian may assess nutrition risk; the medical team manages medication, wound, bowel, diabetes, kidney, or fluid decisions; and physiotherapy may address transfers and meal preparation. No single symptom identifies the cause.",
  progression: "The first step may be a short record of intake, symptoms, bowel pattern, posture, assistance, and later response. The clinical team may then change meal setup, timing, food choice, mobility around meals, constipation management, or referral. Progress can mean more reliable participation and less fatigue during the routine, not achieving a universal calorie, protein, or fluid number.",
  homeSession: "A home session can examine the dining chair, kitchen route, standing tolerance, food storage, and the movement needed to prepare or carry a meal. The therapist can identify whether pain, weakness, dizziness, or equipment is the main functional barrier and coordinate questions for the surgical and nutrition teams. Families should bring discharge papers, medicines, weight history, and the intake record.",
  dos: "Report persistent poor intake, vomiting, constipation, or weight change early, keep the medical instructions accessible, and ask which professional should answer each restriction.",
  donts: "Do not start a supplement, use laxatives, change fluids, crush medicines, or alter a diabetes or kidney plan without the responsible clinical team.",
  safety: "Any of these symptoms needs prompt clinical review: repeated vomiting, severe constipation or abdominal pain, inability to maintain prescribed intake, dehydration concern, fever with wound change, or rapidly falling weight. Any of these situations needs emergency help: collapse, severe breathing difficulty, chest pain, or an acute medical change.",
});

const kanpurCopdExercise = articleContent({
  city: "Kanpur",
  opening: "With COPD, a short activity can be manageable while the recovery afterwards is unexpectedly long. The exercise question is therefore not only how far the person moved, but what happened during the task, how breathing settled, and whether the next routine became harder. A Kanpur exercise-physiology review can use that pattern to guide safer progression.",
  context: "Kanpur's profile includes COPD and pulmonary rehabilitation. The clinically useful context is the diagnosis, inhaler and oxygen instructions, cough or sputum pattern, sleep, nutrition, standing tolerance, usual route, and recent infection or exacerbation. A city does not establish a shared respiratory trigger or confirmed pulmonary service.",
  assessment: "The clinician may ask what changed from baseline, whether breathlessness starts before or after the task, how long recovery takes, and whether chest pain, wheeze, fever, swelling, dizziness, confusion, or blood is present. They may observe a familiar transfer, short route, breathing recovery, ability to talk or pause, and prescribed device safety. Oxygen flow, medication, and clinical thresholds remain with the treating team.",
  progression: "The plan may begin with a predictable task and a clear recovery observation rather than a fixed distance. The clinician may alter rest, route, posture, assistance, or task order before changing duration. When the response is stable, one feature can be reviewed at a time. Progress can mean calmer recovery, better planning, or completing an important routine without a delayed decline; it does not mean pushing through a flare.",
  homeSession: "A home visit can observe the route to the bathroom or entrance, chair placement, footwear, and the point where the person usually pauses. The therapist may review an agreed recovery-breathing strategy and energy-conservation choices while checking when the respiratory team should be contacted. The family should bring inhaler and oxygen instructions, discharge papers, and a record of task and recovery.",
  dos: "Keep prescribed respiratory instructions available, pause before severe breathlessness, record the recovery pattern, and report a response that is clearly different from baseline.",
  donts: "Do not alter oxygen or inhalers, hold the breath during movement, chase a target saturation without instruction, or treat a respiratory flare as conditioning practice.",
  safety: "Any of these symptoms needs urgent medical review: new or severe breathlessness, chest pain, blue lips, fainting, confusion, coughing blood, fever with worsening symptoms, or rapidly changing sputum and function. Follow the person's emergency respiratory plan rather than waiting for physiotherapy.",
});

const varanasiStrokeBathroom = articleContent({
  city: "Varanasi",
  opening: "After stroke, a bathroom routine may require more than walking: approaching the doorway, turning into a small space, managing clothing, sitting, standing, and communicating when help is needed. A Varanasi home physiotherapy review can break that sequence into safer decisions without assuming that every survivor needs the same aid or caregiver support.",
  context: "Varanasi's stroke and neurological rehabilitation profile makes daily-task sequencing clinically relevant. The assessment depends on strength, sensation, vision, language, attention, trunk control, continence, shoulder protection, pain, fatigue, bathroom layout, and the person's prior routine. The city or a familiar household custom does not prove that a floor-level or low-seat routine is safe after stroke.",
  assessment: "The therapist may observe the route, doorway, turning space, clothing management, transfer surface, hand support, and the person's ability to follow one short cue. They may coordinate with occupational therapy, speech-language services, nursing, or a medical team when the barrier is not only movement. New facial droop, speech change, visual loss, sudden weakness, or severe headache requires emergency assessment.",
  progression: "Practice may begin with a stable transfer and one agreed pause point. The clinician may then add the doorway, a turn, clothing management, or a change in surface when the earlier part is reliable. Progress can mean fewer prompts, safer hand placement, better problem-solving, or telling the caregiver when help is needed. Speed and independence are not the only measures.",
  homeSession: "A home visit can review the bed, chair, bathroom entrance, toilet height, grab points, clothing storage, and where a caregiver can guard without pulling. The therapist may document which steps are independent, supervised, or not yet appropriate and coordinate equipment questions. A session does not authorize changing a medical or continence plan.",
  dos: "Keep the route clear, use stable surfaces, allow the person time to initiate each step, and use the assessed guarding position.",
  donts: "Do not pull the affected arm, rush a turn, leave the person standing while reaching for clothing, or practise a bathroom transfer alone before it has been assessed.",
  safety: "Any of these changes needs immediate medical assessment: sudden change in strength, speech, vision, alertness, swallowing, or balance. Seek prompt advice after a fall, shoulder injury, new severe pain, repeated loss of balance, or a new continence change.",
});

const varanasiGeriatricNutrition = articleContent({
  city: "Varanasi",
  opening: "Older adults may drink less after illness because reaching a cup is difficult, the route to the bathroom feels unsafe, thirst is reduced, or the person becomes tired during meals. A nutrition review in Varanasi should ask what access and routine problem is present before suggesting a fixed fluid schedule or supplement.",
  context: "Varanasi's geriatric rehabilitation profile supports an observation-led meal and hydration review. Important context includes recent illness, medicines, heart or kidney instructions, swallowing, cognition, continence concerns, mobility, weight trend, oral health, and who prepares and offers food and fluids. A city setting does not establish a shared hydration risk.",
  assessment: "The team may ask what is offered, what is actually taken, whether drinks are reachable, whether the person coughs or has a wet voice, how often they need help, and whether dizziness or constipation has changed. A dietitian or doctor may address nutrition and fluid restrictions, a speech-language clinician may assess swallowing, and physiotherapy may examine sitting balance, transfers, reach, and the route to the dining area. The record is not a home swallowing test.",
  progression: "The first step may be a plain record of time, posture, food or fluid offered, amount taken, assistance, symptoms, and later response. The team may then change cup or utensil setup, seating, supervision, access, meal timing, food choice, or referral. Progress may mean more reliable participation and safer access rather than meeting a universal fluid target.",
  homeSession: "A home session can examine the dining chair, table height, cup placement, lighting, kitchen route, toilet route, and how a caregiver offers help. The therapist can identify whether mobility or posture is limiting intake and coordinate unresolved swallowing, medical, or nutrition questions. Families should bring fluid restrictions, medicines, weight information, and recent discharge notes.",
  dos: "Keep prescribed fluid restrictions visible, offer only the support agreed by the clinical team, record observable changes, and report reduced intake or swallowing concerns early.",
  donts: "Do not force fluids, silently thicken drinks, remove foods, start supplements, or change diuretic or other medicine timing without the responsible team.",
  safety: "Any of these symptoms needs prompt clinical review: repeated choking, a wet voice, new confusion, marked dizziness, dehydration concern, rapidly falling intake, or a significant weight change. Any of these situations needs emergency help: severe breathing difficulty, blue lips, collapse, or an airway emergency.",
});

const varanasiCopdExercise = articleContent({
  city: "Varanasi",
  opening: "A meaningful household route may include standing from a chair, walking to another room, carrying a light personal item, and returning to sit. For someone with COPD, the challenge may be organizing that sequence so breathlessness does not become panic or force the person to abandon every activity. Exercise physiology can review the route without prescribing a universal pace.",
  context: "Varanasi's profile includes COPD and pulmonary rehabilitation. The relevant details are the person's baseline, inhaler and oxygen instructions, cough or sputum, recent infection, sleep, nutrition, footwear, chair placement, route length, and available help. The city does not establish local respiratory prevalence, air-quality causation, or a common exercise response.",
  assessment: "The clinician may observe the route, transfers, carrying with an appropriate object, breathing pattern, talk or pause ability, recovery, and the response later in the day. They may ask about chest pain, wheeze, fever, swelling, dizziness, confusion, and a change in sputum. Medication, oxygen, and emergency thresholds remain the responsibility of the treating respiratory team.",
  progression: "The plan may start with the route divided into clear sections and a planned pause before severe breathlessness. The clinician may review posture, chair placement, order of tasks, assistance, and recovery before changing the route. Progress can mean completing one meaningful sequence with less panic, safer breathing recovery, or better self-pacing. It does not mean carrying heavier items or exercising through a flare.",
  homeSession: "A home session can map the route, identify a safe resting chair, and review where a family member can help without blocking. The therapist may teach an agreed recovery strategy and a simple record of task, symptoms, pause, recovery, and next-day effect. A changed respiratory response should be shared with the medical team.",
  dos: "Use prescribed respiratory equipment correctly, keep the route clear, pause early, and record a response that is different from the person's usual pattern.",
  donts: "Do not alter oxygen, carry heavy or hot items while breathless, hold the breath during a transfer, or use a good morning to justify an unreviewed harder route.",
  safety: "Any of these symptoms needs urgent medical assessment: new severe breathlessness, chest pain, blue lips, fainting, confusion, coughing blood, fever with worsening symptoms, or rapidly changing sputum. Stop activity and follow the respiratory plan when the response is not the person's usual pattern.",
});

const bhopalKneeStairs = articleContent({
  city: "Bhopal",
  opening: "After knee replacement, a person may manage a level hallway but hesitate at a doorway lip, short step, or building entrance. Stairs and thresholds are separate functional questions from walking distance. A Bhopal home physiotherapy review can practise the transition that matters while keeping the surgeon's precautions and the person's current control central.",
  context: "Bhopal's profile includes knee-replacement and post-surgery rehabilitation. The relevant factors are the operation, allowed loading, wound, swelling, range, quadriceps control, balance, aid, footwear, handrail, step height, and whether the person is preparing for a specific home or community entrance. The city does not establish a universal stair design or readiness timeline.",
  assessment: "The therapist may review walking, sit-to-stand, step strategy, handrail use, aid placement, knee control, pain, swelling, and the person's ability to stop safely. They may observe a low threshold before considering a larger step and coordinate with the surgeon when a restriction or wound concern changes the plan. Calf symptoms, fever, chest symptoms, or sudden loss of movement require medical assessment.",
  progression: "Practice may begin with weight shifting and a small, stable transition using the assessed support. The clinician may then review one step, a sequence of steps, a doorway, or a known entrance when the earlier task is reliable. Progress can mean safer foot placement, less assistance, controlled descent, or confidence to pause. It does not mean adding stairs, carrying, or community distance independently.",
  homeSession: "A home visit can examine the actual threshold, handrail, step, walking aid, footwear, and place where a family member should guard. The therapist can identify whether equipment or a temporary route change needs discussion with the treating team and document which transitions are safe, supervised, or not yet appropriate.",
  dos: "Use the assessed sequence and support, keep one hand available for the agreed rail or aid, pause before the transition, and record swelling or next-day change.",
  donts: "Do not practise a step while carrying an item, pull on the operated leg, use a loose stool as a step, or treat level walking as proof that every stair or entrance is safe.",
  safety: "Any of these symptoms needs urgent medical assessment: increasing calf pain or swelling, wound drainage, fever, a hot worsening knee, sudden loss of movement, chest pain, severe breathlessness, or collapse. Stop the programme and contact the responsible team when the response changes sharply.",
});

const bhopalKneeNutrition = articleContent({
  city: "Bhopal",
  opening: "After knee replacement, the nutrition challenge may be practical rather than a question about one food: shopping, standing long enough to prepare a meal, reaching storage, or getting safely to the dining chair. A Bhopal home review can connect mobility limits with nutrition questions while leaving medical and dietetic decisions to the responsible team.",
  context: "Bhopal's post-surgery and knee-replacement profile is the setting for a coordination question, not evidence of one local menu or recovery result. Relevant information includes appetite, weight change, nausea, constipation, wound status, pain, mobility, usual meals, diabetes or kidney advice, medicines, and who shops or cooks. Food guidance must be individualized when medical restrictions are present.",
  assessment: "The team may review intake, appetite, bowel pattern, weight trend, blood-glucose instructions, kidney or heart restrictions, supplements, and the surgeon's precautions. A dietitian or doctor manages nutrition and medical restrictions, while physiotherapy may assess safe meal preparation, carrying, transfers, and standing tolerance. The clinician should also ask whether the person can reach and sit at the dining area without a risky route.",
  progression: "The first step may be a record of meals, symptoms, assistance, and the parts of shopping or cooking that are no longer manageable. The team may then adjust seating, storage, help, meal preparation, food choice, or referral. Progress can mean safer participation in food routines and more reliable intake, not a universal protein or calorie target.",
  homeSession: "A home session can observe the kitchen route, counter height, storage, chair, dining area, and the movement needed to prepare or carry a meal. The therapist can separate a mobility barrier from a nutrition question and prepare a focused handover for the surgeon, dietitian, diabetes team, or renal team.",
  dos: "Keep discharge and medical instructions together, plan meal preparation around the assessed mobility, report poor intake or weight change, and ask before changing supplements.",
  donts: "Do not stand on an unsafe knee to cook, start a supplement, remove salt or fluids, change diabetes medicine timing, or crush medicines without clinical advice.",
  safety: "Any of these symptoms needs prompt clinical review: repeated vomiting, inability to maintain prescribed intake, severe dehydration, confusion, fever with wound change, or rapidly worsening swelling. Any of these situations needs emergency help: severe breathlessness, chest pain, collapse, or an acute medical change.",
});

const bhopalCopdExercise = articleContent({
  city: "Bhopal",
  opening: "Exercise with COPD is not only a question of effort. Cough, sputum, sleep, anxiety, medication timing, and recovery can change how a person responds to the same movement on different days. A Bhopal exercise-physiology review can use symptom and recovery observations to decide what needs medical review and what can be progressed carefully.",
  context: "Bhopal's profile includes COPD and pulmonary rehabilitation. The relevant context is the person's respiratory diagnosis, baseline, inhaler and oxygen instructions, sputum changes, recent infection, sleep, nutrition, usual activity, and the space available for practice. The city does not establish a shared respiratory trigger or a universal oxygen or exertion target.",
  assessment: "The clinician may ask what changed from baseline, whether cough or sputum is different, how breathlessness settles, and whether there is fever, chest pain, wheeze, swelling, dizziness, confusion, or blood. They may observe a familiar movement, a short route, breathing recovery, conversation, posture, and prescribed equipment safety. They do not set a new oxygen flow, medication dose, or saturation cut-off in an educational article.",
  progression: "The plan may begin with a predictable task and an agreed observation of symptoms and recovery. The clinician may change posture, rest, route, assistance, or timing before changing duration. One feature can be reviewed at a time when the response is stable. Progress can mean a calmer recovery, better self-pacing, or more reliable completion of a useful activity; it does not mean pushing through a flare.",
  homeSession: "A home visit can identify the clearest practice space, a safe chair, the route to the bathroom or entrance, and where a caregiver can help. The therapist may review an agreed breathing or recovery strategy, teach energy-conservation choices, and clarify when the respiratory team should be contacted. Families should bring inhaler and oxygen instructions, discharge notes, and the symptom record.",
  dos: "Follow prescribed respiratory instructions, observe the recovery pattern the clinician has chosen, pause before severe breathlessness, and report a changed cough or sputum pattern.",
  donts: "Do not change oxygen or inhalers, hold the breath during exertion, chase a target without instruction, or treat fever and worsening respiratory symptoms as an exercise challenge.",
  safety: "Any of these symptoms needs urgent medical assessment: new severe breathlessness, chest pain, blue lips, fainting, confusion, coughing blood, fever with worsening symptoms, or a rapid change in sputum and function. Follow the person's emergency respiratory plan rather than waiting for physiotherapy.",
});

export const cityJournalBatch7Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-vadodara-orthopaedic-carrying",
    slug: "orthopaedic-recovery-reaching-carrying-vadodara",
    title: "Orthopaedic Recovery in Vadodara: Safer Reaching and Carrying",
    metaTitle: "Orthopaedic Recovery Reaching and Carrying in Vadodara",
    metaDescription: "A practical Vadodara guide to reaching, lifting, carrying, surgical precautions, and safer household task progression after orthopaedic surgery. Review.",
    excerpt: "How home physiotherapy can connect post-orthopaedic recovery with reaching, light carrying, and real household tasks in Vadodara.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "vadodara",
    discipline: "physiotherapy",
    content: vadodaraOrthopaedic,
    sources: [refs.niceJoint, refs.whoPostop, refs.whoRehab, refs.aaosKnee, refs.vadodaraProfile, refs.niceCritical],
  },
  {
    id: "city-journal-vadodara-stroke-meal-setup",
    slug: "stroke-meal-setup-one-sided-weakness-vadodara",
    title: "Nutrition After Stroke in Vadodara: Safer Meal Setup",
    metaTitle: "Safer Meal Setup After Stroke in Vadodara",
    metaDescription: "A cautious Vadodara guide to stroke-related meal setup, posture, fatigue, swallowing questions, caregiver support, and nutrition referrals. Review helps.",
    excerpt: "What families can observe when weakness, fatigue, or swallowing uncertainty changes meal setup after stroke in Vadodara.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "vadodara",
    discipline: "nutrition",
    content: vadodaraStrokeNutrition,
    sources: [refs.niceStroke, refs.asaDailyLiving, refs.ahaStroke, refs.niceNutrition, refs.icmrDiet, refs.vadodaraProfile],
  },
  {
    id: "city-journal-vadodara-geriatric-endurance",
    slug: "geriatric-exercise-household-endurance-vadodara",
    title: "Geriatric Exercise in Vadodara: Building Household Endurance",
    metaTitle: "Geriatric Exercise and Household Endurance in Vadodara",
    metaDescription: "A safety-first Vadodara guide to useful household endurance, transfers, carrying, balance, delayed fatigue, and individualized exercise review. Needs vary.",
    excerpt: "How exercise physiology can turn standing, turning, carrying, and household endurance into assessed rehabilitation goals for older adults in Vadodara.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "vadodara",
    discipline: "exercise-physiology",
    content: vadodaraGeriatricExercise,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceCritical, refs.niceStroke, refs.icmrDiet, refs.vadodaraProfile],
  },
  {
    id: "city-journal-kanpur-neurological-routes",
    slug: "neurological-walking-thresholds-home-routes-kanpur",
    title: "Neurological Walking in Kanpur: Safer Home Routes",
    metaTitle: "Neurological Walking and Safer Home Routes in Kanpur",
    metaDescription: "A practical Kanpur guide to neurological walking, thresholds, turns, narrow routes, walking aids, caregiver guarding, and safety review. Review helps.",
    excerpt: "How a home physiotherapy assessment can break neurological walking into safer threshold, turning, and route decisions in Kanpur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "kanpur",
    discipline: "physiotherapy",
    content: kanpurNeurologicalWalking,
    sources: [refs.niceStroke, refs.ahaStroke, refs.whoRehab, refs.whoActivity, refs.kanpurProfile, refs.niceCritical],
  },
  {
    id: "city-journal-kanpur-surgery-nutrition",
    slug: "post-surgery-appetite-constipation-intake-kanpur",
    title: "After Surgery in Kanpur: Appetite, Constipation, and Intake",
    metaTitle: "Post-Surgery Appetite and Intake Questions in Kanpur",
    metaDescription: "A cautious Kanpur guide to appetite, constipation, poor intake, meal preparation, weight change, and nutrition questions after surgery. Review guides care.",
    excerpt: "What families can record when appetite, constipation, nausea, or mobility changes food intake during post-surgery recovery in Kanpur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "kanpur",
    discipline: "nutrition",
    content: kanpurSurgeryNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.whoPostop, refs.espensaSurgery, refs.icmrDiet, refs.kanpurProfile],
  },
  {
    id: "city-journal-kanpur-copd-recovery",
    slug: "copd-exercise-recovery-after-short-tasks-kanpur",
    title: "COPD Exercise in Kanpur: Recovery After Short Tasks",
    metaTitle: "COPD Exercise and Recovery After Short Tasks in Kanpur",
    metaDescription: "A safety-first Kanpur guide to COPD exercise, breathlessness recovery, short household tasks, respiratory review, and individualized progression. Review.",
    excerpt: "How exercise physiology can review the recovery pattern after short tasks rather than relying on a universal COPD exercise target in Kanpur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Pulmonary Rehabilitation",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "kanpur",
    discipline: "exercise-physiology",
    content: kanpurCopdExercise,
    sources: [refs.niceCopd, refs.atsPulmonary, refs.atsPulmonaryGuideline, refs.nhlbiPulmonary, refs.whoActivity, refs.kanpurProfile],
  },
  {
    id: "city-journal-varanasi-stroke-bathroom",
    slug: "stroke-bathroom-sequencing-home-physiotherapy-varanasi",
    title: "Stroke Rehabilitation in Varanasi: Safer Bathroom Sequencing",
    metaTitle: "Stroke Bathroom Sequencing in Varanasi",
    metaDescription: "A practical Varanasi guide to stroke rehabilitation for bathroom routes, transfers, clothing management, cueing, and caregiver guarding. Review helps.",
    excerpt: "How a home physiotherapy assessment can separate bathroom sequencing, balance, communication, and transfer questions after stroke in Varanasi.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "varanasi",
    discipline: "physiotherapy",
    content: varanasiStrokeBathroom,
    sources: [refs.niceStroke, refs.asaDailyLiving, refs.ahaStroke, refs.whoRehab, refs.varanasiProfile, refs.niceCritical],
  },
  {
    id: "city-journal-varanasi-geriatric-hydration",
    slug: "geriatric-hydration-meal-routines-varanasi",
    title: "Geriatric Nutrition in Varanasi: Hydration and Meal Routines",
    metaTitle: "Geriatric Hydration and Meal Routines in Varanasi",
    metaDescription: "A cautious Varanasi guide to hydration access, meal routines, posture, swallowing questions, fluid restrictions, and older-adult rehabilitation. Review.",
    excerpt: "What families can observe when mobility, fatigue, swallowing, or access to drinks changes hydration and meal routines after illness in Varanasi.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "varanasi",
    discipline: "nutrition",
    content: varanasiGeriatricNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.whoHealthyDiet, refs.icmrDiet, refs.whoRehab, refs.varanasiProfile],
  },
  {
    id: "city-journal-varanasi-copd-route",
    slug: "copd-exercise-meaningful-household-route-varanasi",
    title: "COPD Exercise in Varanasi: A Meaningful Home Route",
    metaTitle: "COPD Exercise for a Meaningful Home Route in Varanasi",
    metaDescription: "A practical Varanasi guide to COPD exercise, household routes, planned pauses, breathing recovery, equipment boundaries, and safety review. Review helps.",
    excerpt: "How an exercise plan can connect COPD pacing with a meaningful household route while keeping oxygen and medical decisions with the respiratory team.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Pulmonary Rehabilitation",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "varanasi",
    discipline: "exercise-physiology",
    content: varanasiCopdExercise,
    sources: [refs.niceCopd, refs.atsPulmonary, refs.atsPulmonaryGuideline, refs.nhlbiPulmonary, refs.whoActivity, refs.varanasiProfile],
  },
  {
    id: "city-journal-bhopal-knee-stairs",
    slug: "knee-replacement-stairs-thresholds-bhopal",
    title: "Knee Replacement in Bhopal: Safer Stairs and Thresholds",
    metaTitle: "Knee Replacement Stairs and Thresholds in Bhopal",
    metaDescription: "A practical Bhopal guide to knee-replacement stairs, thresholds, handrails, walking aids, loading precautions, and home-to-community preparation. Review.",
    excerpt: "How a home physiotherapy assessment can progress knee-replacement stairs and thresholds without treating level walking as universal readiness.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "bhopal",
    discipline: "physiotherapy",
    content: bhopalKneeStairs,
    sources: [refs.niceJoint, refs.aaosKnee, refs.aaosKneeExercise, refs.whoPostop, refs.whoRehab, refs.bhopalProfile],
  },
  {
    id: "city-journal-bhopal-knee-nutrition",
    slug: "knee-replacement-nutrition-shopping-cooking-bhopal",
    title: "Knee Replacement in Bhopal: Nutrition and Meal Preparation",
    metaTitle: "Knee Replacement Nutrition and Meal Preparation in Bhopal",
    metaDescription: "A cautious Bhopal guide to nutrition after knee replacement, shopping, cooking, intake, mobility limits, supplements, and medical restrictions. Needs vary.",
    excerpt: "What families can review when knee-replacement mobility makes shopping, cooking, dining, or reliable intake harder in Bhopal.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "bhopal",
    discipline: "nutrition",
    content: bhopalKneeNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.espensaSurgery, refs.icmrDiet, refs.whoPostop, refs.bhopalProfile],
  },
  {
    id: "city-journal-bhopal-copd-exercise",
    slug: "copd-exercise-symptoms-pacing-recovery-bhopal",
    title: "COPD Exercise in Bhopal: Symptoms, Pacing, and Recovery",
    metaTitle: "COPD Exercise Symptoms and Recovery in Bhopal",
    metaDescription: "A safety-first Bhopal guide to COPD exercise, symptom monitoring, pacing, recovery, respiratory-team boundaries, and home practice. Review guides care.",
    excerpt: "How exercise physiology can connect COPD symptoms and recovery observations to a safer progression plan in Bhopal.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Pulmonary Rehabilitation",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "bhopal",
    discipline: "exercise-physiology",
    content: bhopalCopdExercise,
    sources: [refs.niceCopd, refs.atsPulmonary, refs.atsPulmonaryGuideline, refs.nhlbiPulmonary, refs.whoActivity, refs.bhopalProfile],
  },
];