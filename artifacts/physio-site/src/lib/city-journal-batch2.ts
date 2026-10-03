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
  niceNeuroFunction: source(
    "Rehabilitation to maintain, improve or support function",
    "NICE",
    "https://www.nice.org.uk/guidance/ng252/chapter/Rehabilitation-to-maintain-improve-or-support-function",
  ),
  niceFatigue: source(
    "Multiple sclerosis in adults: recommendations",
    "NICE",
    "https://www.nice.org.uk/guidance/ng220/chapter/recommendations",
  ),
  strokeArm: source(
    "National Clinical Guideline for Stroke: arm function",
    "Intercollegiate Stroke Working Party",
    "https://www.strokeguideline.org/chapter/motor-recovery-and-physical-effects-of-stroke/arm-function",
  ),
  cochraneArm: source(
    "Interventions to improve arm and hand function after stroke",
    "Cochrane",
    "https://www.cochrane.org/evidence/CD010820_interventions-improve-arm-and-hand-function-people-after-stroke",
  ),
  energyConservation: source(
    "Energy conservation strategies in motor neuron disease",
    "National Library of Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC9860213",
  ),
  gbsReview: source(
    "Physical exercise in Guillain–Barré syndrome: a scoping review",
    "Journal of Clinical Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC12028042/",
  ),
  gbsFatigue: source(
    "Prevalence of fatigue in Guillain–Barré syndrome",
    "Indian Journal of Psychological Medicine",
    "https://pmc.ncbi.nlm.nih.gov/articles/PMC4162023/",
  ),
  gbsNinds: source(
    "Guillain–Barré syndrome",
    "National Institute of Neurological Disorders and Stroke",
    "https://www.ninds.nih.gov/publications/guillain-barre-syndrome",
  ),
  gbsNhs: source(
    "Guillain–Barré syndrome",
    "NHS",
    "https://www.nhs.uk/conditions/guillain-barre-syndrome",
  ),
  gbsTraining: source(
    "Physical training and fatigue, fitness, and quality of life in GBS and CIDP",
    "Neurology",
    "https://pubmed.ncbi.nlm.nih.gov/15623709/",
  ),
  cardiacRehab: source(
    "Cardiac rehabilitation",
    "American Heart Association",
    "https://www.heart.org/en/health-topics/cardiac-rehab",
  ),
  cardiacEating: source(
    "Eating well and losing weight",
    "American Heart Association",
    "https://www.heart.org/en/health-topics/cardiac-rehab/taking-care-of-yourself/eating-well-and-losing-weight",
  ),
  icmrDiet: source(
    "Dietary Guidelines for Indians 2024",
    "ICMR–National Institute of Nutrition",
    "https://www.nin.res.in/dietaryguidelines2024.html",
  ),
  cardiacCore: source(
    "Core components of cardiac rehabilitation and secondary prevention programs",
    "American Heart Association/American Association of Cardiovascular and Pulmonary Rehabilitation",
    "https://pubmed.ncbi.nlm.nih.gov/17513578",
  ),
  poorAppetite: source(
    "Heart healthy diet for poor appetites",
    "University Hospitals Sussex NHS Foundation Trust",
    "https://www.uhsussex.nhs.uk/resources/heart-healthy-diet-for-poor-appetites",
  ),
  niceCritical: source(
    "Rehabilitation after critical illness in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg83/chapter/recommendations",
  ),
  niceTrauma: source(
    "Rehabilitation after traumatic injury",
    "NICE",
    "https://www.nice.org.uk/guidance/ng211/chapter/Recommendations",
  ),
  niceJoint: source(
    "Postoperative rehabilitation after primary joint replacement",
    "NICE",
    "https://www.nice.org.uk/guidance/QS206/chapter/statement-5-postoperative-rehabilitation",
  ),
  aaosHip: source(
    "Activities after total hip replacement",
    "American Academy of Orthopaedic Surgeons",
    "https://www.orthoinfo.org/recovery/activities-after-hip-replacement/",
  ),
  nhsStairs: source(
    "Taking a patient onto the stairs",
    "NHS Lothian",
    "https://staff.nhslothian.scot/ahp/wp-content/uploads/sites/19/2025/09/PTWB-10.-Taking-a-patient-onto-the-stairs.pdf",
  ),
  postOpSpine: source(
    "Post-operative spinal surgery physiotherapy",
    "NHS Greater Glasgow and Clyde",
    "https://www.nhsggc.scot/wp-content/uploads/2025/02/Post-Spinal-Surgery-Physiotherapy-A4-Print-Version.pdf",
  ),
  returnSport: source(
    "Consensus statement on return to sport from the First World Congress in Sports Physical Therapy",
    "British Journal of Sports Medicine",
    "https://bjsm.bmj.com/content/50/14/853.full.pdf",
  ),
  sportLoad: source(
    "How much is too much? Load in sport and risk of injury",
    "British Journal of Sports Medicine / International Olympic Committee",
    "https://bjsm.bmj.com/content/50/17/1030.full",
  ),
  sportIllness: source(
    "Acute respiratory infections and return to sport",
    "British Journal of Sports Medicine / International Olympic Committee",
    "https://bjsm.bmj.com/content/56/19/1066",
  ),
  btsPulmonary: source(
    "Guideline for pulmonary rehabilitation in adults",
    "British Thoracic Society",
    "https://www.brit-thoracic.org.uk/document-library/guidelines/pulmonary-rehabilitation/bts-guideline-for-pulmonary-rehabilitation-in-adults",
  ),
  niceCopd: source(
    "Chronic obstructive pulmonary disease in over 16s",
    "NICE",
    "https://www.nice.org.uk/guidance/ng115/chapter/recommendations",
  ),
  ahaExercise: source(
    "Cardiac rehabilitation",
    "American Heart Association",
    "https://www.heart.org/en/health-topics/cardiac-rehab",
  ),
  aacvpr: source(
    "Pulmonary rehabilitation patient resources",
    "American Association of Cardiovascular and Pulmonary Rehabilitation",
    "https://www.aacvpr.org/Pulmonary-Patient-Resources",
  ),
  whoActivity: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  mumbaiDistrict: source(
    "Mumbai City district: official information",
    "District Administration, Mumbai City",
    "https://mumbaicity.gov.in/",
  ),
  puneDistrict: source(
    "Pune district: official information",
    "District Administration, Pune",
    "https://pune.gov.in/",
  ),
  hyderabadDistrict: source(
    "Hyderabad district: official information",
    "District Administration, Hyderabad",
    "https://hyderabad.telangana.gov.in/",
  ),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person’s condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can help review a previously assessed plan, but it does not replace emergency or specialist medical care.

This article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, cardiologist, neurologist, dietitian, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
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
- Keep a short record of symptoms, sleep, activity, and the daily task that is becoming easier or harder.
- Share discharge summaries, medication changes, restrictions, and new symptoms before a programme is progressed.

### Don’t

- ${donts}
- Do not copy a protocol from another person or use a good day as proof that a larger workload is safe.
- Do not delay medical review for a new or rapidly changing symptom because it appears during rehabilitation.

### Safety and when to seek medical advice

${safety}

${commonBooking}`;
}

const mumbaiNeuro = articleContent({
  opening: "Neurological fatigue can make an ordinary Mumbai household route feel unpredictable. A person may manage a shower one morning and struggle with the same task after a poor night, a long appointment, pain, medication changes, or too many decisions. Rehabilitation is not about avoiding all activity. It is about understanding the pattern, protecting essential tasks, and building capacity without treating exhaustion as a test of willpower.",
  context: "Mumbai is the setting for this article, not a reason to claim a local fatigue rate or an assured service pathway. A home assessment can account for the person’s actual room layout, lift or stairs, bathroom route, work demands, family support, and the energy cost of leaving home for follow-up. The same neurological diagnosis can create different practical problems, so a plan should begin with the task that matters rather than a generic daily exercise list.",
  assessment: "The clinician asks when fatigue appears, what happens later that day or the next day, how sleep and pain affect it, and whether weakness, dizziness, breathlessness, mood, cognition, or medication changes are contributing. They may observe a short household sequence such as washing, dressing, preparing tea, walking to the doorway, or moving between a chair and bed. Assessment also includes the difference between effort-related tiredness and a new loss of strength or function. A neurologist or physician review may be needed when the pattern changes.",
  progression: "A useful plan separates essential, optional, and recovery activities. The person may practise one meaningful task when alert, alternate demanding and lighter activities, sit for parts of a routine, gather equipment before starting, and stop before control deteriorates. Progress can mean completing the same task with fewer pauses, better quality, or less next-day disruption; it does not have to mean adding more minutes every week. Energy-conservation education can support independence while strength and endurance are being assessed.",
  homeSession: "A home session may map the energy cost of a morning routine and identify where a chair, grab point, trolley, rest area, or change in task order would help. The therapist can observe transfers, walking, reaching, and the person’s ability to follow a two-step task without rushing. Family members learn when to supervise and when to let the person complete a task independently. The written plan should include a review trigger for worsening fatigue rather than only a target for doing more.",
  dos: "Plan the priority task for the person’s better period, use seated preparation where it is safe, build in rest before exhaustion, and review the next-day response with the clinician.",
  donts: "Do not label every episode of exhaustion as deconditioning, push through new weakness, or reduce all movement for weeks without an assessment of what remains safe and useful.",
  safety: "Seek urgent medical help for sudden one-sided weakness, new facial drooping, sudden speech or vision change, collapse, severe chest symptoms, or severe unexpected breathlessness. Any of these changes need urgent assessment rather than pacing advice. If a neurological deficit worsens, falls repeat, swallowing changes, confusion appears, alertness changes, or fatigue comes with a loss of function, arrange prompt clinical review rather than treating it as the established pattern.",
});

const mumbaiCardiacNutrition = articleContent({
  opening: "Food questions during cardiac rehabilitation are often more complicated than choosing a “heart-healthy” list. Appetite may be poor after hospital treatment, weight may be changing unintentionally, medicines may raise questions, and a person may have diabetes, kidney disease, swallowing difficulty, or a clinician-set fluid or salt boundary. Nutrition can support rehabilitation, but cardiac recovery needs coordinated medical, exercise, and dietetic care.",
  context: "Mumbai’s cardiac rehabilitation setting may involve a hospital discharge, a home-based programme, or a remote review between appointments. The city does not determine the right diet. A useful conversation records what the person can eat, how symptoms affect meals, what the cardiology team has restricted or encouraged, and which food or medicine question is still unresolved. The American Heart Association describes cardiac rehabilitation as a multidisciplinary programme rather than exercise alone.",
  assessment: "A dietitian or doctor may ask about appetite, unintentional weight change, nausea, vomiting, swallowing, breathlessness during meals, swelling, thirst, bowel changes, blood glucose, kidney function, and medicines. The team may need to know whether the person is following a fluid or sodium instruction and whether that instruction has changed. Food–medicine concerns should be checked with the prescribing clinician or pharmacist; a general article should not infer an interaction from one food or supplement.",
  progression: "At a pattern level, meals can include familiar combinations of vegetables, fruit, pulses, whole grains or other cereals, nuts or seeds where safe, and suitable protein foods. The emphasis is a sustainable pattern rather than a rigid menu, a crash diet, or a promise that one ingredient repairs the heart. If appetite is low, the team may discuss nourishing options and practical meal frequency, but the portion, fluid, sodium, protein, and calorie advice must follow the person’s diagnosis and treatment.",
  homeSession: "A physiotherapy visit may reveal that fatigue, breathlessness, weakness, or difficulty standing makes food preparation unsafe. The therapist can help plan a movement routine around meals, practise safe kitchen transfers, or suggest energy-conservation questions for the wider team. The visit does not authorize a supplement, change a prescribed fluid limit, or replace a cardiac or dietetic review. A short record of meals, symptoms, weight trend, and medication questions can make that referral more useful.",
  dos: "Bring the current medicine list and discharge instructions to nutrition appointments, record appetite and symptoms without trying to diagnose them, and ask which restrictions still apply.",
  donts: "Do not start a supplement, detox, fasting plan, very low-salt or very low-calorie programme, or “heart cure” food routine without checking the person’s cardiac, kidney, diabetes, and medicine context.",
  safety: "Seek prompt clinical advice for persistent vomiting, dehydration concern, new swallowing difficulty, repeated coughing during meals, rapidly worsening breathlessness, new swelling, fainting, severe chest symptoms, or unintentional weight loss. A cardiac team should review any new or worsening exercise intolerance. Do not self-adjust a prescribed fluid or sodium restriction because thirst or appetite has changed.",
});

const mumbaiGbsExercise = articleContent({
  opening: "Exercise after Guillain–Barré syndrome needs a different question from ordinary fitness training: how can activity return without overlooking neurological fatigue, residual weakness, breathing history, pain, or autonomic symptoms? Research supports rehabilitation, but it does not provide one universal home dose for every person. The useful plan is assessed, supervised when needed, and adjusted from the response over time.",
  context: "A Mumbai home programme can be shaped around the person’s current walking route, transfers, work or household role, equipment, and access to follow-up. The city does not establish a recovery date or a safe intensity. A person who had ventilation, severe weakness, pain, balance problems, or autonomic instability may need a different medical and rehabilitation pathway from someone with a milder course.",
  assessment: "The clinician reviews the original illness, current strength, sensation, balance, breathing, pain, fatigue, sleep, falls, medicines, and any new symptoms. They may observe a functional task, such as rising from a chair, walking a short route, reaching, or using a step, while noting quality rather than chasing a score. The person can describe what happens during activity and later that day or the next morning. A neurologist or physician should reassess a new pattern of weakness instead of assuming it is ordinary exercise fatigue.",
  progression: "Rehabilitation may combine functional practice, range-of-motion work, strengthening, endurance activity, breathing work, and rest according to the assessment. One variable can be changed at a time, such as support, distance, task complexity, or recovery, while the team watches whether function remains stable. The aim is not to feel exhausted after every session. A disproportionate or sustained deterioration is a reason to pause the progression and ask for review, not a reason to train harder.",
  homeSession: "The professional may observe how the person moves between the bed, chair, bathroom, and doorway, then select a small number of tasks that fit the current level. The therapist checks guarding, walking-aid use, footwear, surface, breathing, and the family’s ability to assist without pulling. A home plan should state which activity is independent, which requires supervision, what response should be recorded, and when contact with the clinical team is needed.",
  dos: "Use the assessed support, note symptoms and next-day function, allow recovery, and tell the team about changes in strength, sensation, breathing, sleep, pain, or autonomic symptoms.",
  donts: "Do not use a generic heart-rate zone, repetition target, online recovery timeline, or another person’s GBS programme as clearance for harder exercise.",
  safety: "Stop and seek urgent medical assessment for new or worsening weakness, new difficulty breathing or swallowing, fainting, severe palpitations, a sudden sensory change, collapse, or rapidly worsening neurological symptoms. Prompt review is also needed when fatigue becomes markedly different, function drops after a previously stable period, or falls increase. Exercise progression should wait while an unstable medical or neurological concern is being assessed.",
});

const puneMobility = articleContent({
  opening: "Getting from a Pune home to work, a family errand, or a follow-up appointment after surgery is a functional rehabilitation problem, not simply a question of whether the person can walk indoors. Stairs, a lift, uneven ground, a vehicle transfer, waiting, carrying a small item, and fatigue may all change the task. Readiness should be discussed with the surgical and rehabilitation team rather than decided by a calendar date.",
  context: "Pune is used here as the practical setting for community mobility, not as evidence of a local outcome or transport risk. A home visit can examine the route the person actually needs: bedroom to bathroom, one floor to another, the building entrance, a vehicle, or a short work-related path. Operation type, weight-bearing status, wound status, pain, equipment, job demands, and the surgeon’s restrictions determine what can be practised.",
  assessment: "The physiotherapist reviews the discharge summary and restrictions before observing transfers, standing, walking, turning, step control, and the use of a railing or walking aid. The assessment may include the person’s confidence, attention, vision, dizziness, pain response, footwear, and ability to manage a pause. Work and travel questions should be specific: How long is the route? Is there a seat? Are stairs unavoidable? Can the person carry anything? A general article cannot answer those questions without an individual assessment.",
  progression: "Practice can move from a controlled indoor task to the next safe part of the route, with the clinician deciding how much support is appropriate. A stair task is taught according to the procedure and weight-bearing instruction, not a universal sequence copied online. Community readiness may involve managing a doorway, a lift, a vehicle transfer, a short wait, and recovery afterward. Progress is demonstrated by safer control and repeatability, not by completing a difficult route once.",
  homeSession: "The therapist may set up a rail, chair, walking aid, lighting, or rest point and then teach the person and caregiver where to stand. They can rehearse the exact turn, threshold, stair, or vehicle movement that matters. The plan should distinguish tasks that are safe alone, safe with supervision, and not yet appropriate. Follow-up can then review wound changes, swelling, pain, confidence, and the response after community practice.",
  dos: "Keep the surgeon’s restrictions available, clear the route, practise the real task at the assessed assistance level, and plan a recovery period after community travel.",
  donts: "Do not use a stair video to override weight-bearing or movement restrictions, carry a bag before the team has assessed it, or promise a return-to-work date from walking ability alone.",
  safety: "Seek urgent medical review for wound discharge, fever, sudden loss of function, marked swelling, new calf pain, chest pain, fainting, severe breathlessness, or a new neurological symptom. Pause community practice when dizziness, pain, or instability makes the route unsafe. A sudden change after surgery needs medical assessment rather than a harder home exercise session.",
});

const punePulmonaryNutrition = articleContent({
  opening: "Eating during pulmonary rehabilitation can be tiring when breathlessness, cough, fatigue, poor appetite, or the work of preparing food competes with the meal itself. The aim is not to prescribe a COPD diet. It is to identify what is making intake difficult, support a sustainable routine, and know when a respiratory clinician or dietitian needs to review the problem.",
  context: "A Pune pulmonary-rehabilitation conversation may happen around a home exercise plan, a hospital discharge, or a review of chronic respiratory symptoms. The city does not determine calorie, protein, fluid, or supplement needs. The British Thoracic Society and NICE describe pulmonary rehabilitation as individualized care that includes assessment, tailored exercise, education, and review when symptoms or function change.",
  assessment: "The team may ask about appetite, weight trend, coughing during meals, swallowing, breathlessness while chewing or speaking, fatigue, nausea, bowel symptoms, medicines, oxygen or other equipment, and the practical time required to prepare food. A person who becomes breathless during meals may need a medical review rather than a new food rule. Persistent poor intake or unintentional weight change should be shared with a dietitian or treating clinician.",
  progression: "At a general level, meals can use familiar household foods that the person can safely chew and swallow, with the preparation and portion shaped by clinical advice. A person may discuss easier-to-manage textures, rest before meals, smaller practical tasks, or timing around a rehabilitation session with the relevant team. These are questions for personalization, not a universal plan. Supplements, thickened fluids, or major changes in salt and fluid intake should be recommended only after assessment.",
  homeSession: "A physiotherapy visit can show whether standing at the counter, carrying a plate, reaching into a cupboard, or recovering after a meal affects the day’s activity. The therapist may help position a chair, arrange equipment safely, or coordinate a manageable movement routine. They should not diagnose malnutrition, change oxygen instructions, or provide a disease-treatment menu. Families can bring a food-and-symptom record to the respiratory or nutrition appointment.",
  dos: "Record appetite, breathlessness, swallowing symptoms, fluids, weight changes, and energy, and ask the clinical team how meals should fit around the assessed rehabilitation plan.",
  donts: "Do not buy a high-protein supplement, force fluids, begin fasting, or copy a social-media COPD meal plan without checking respiratory, kidney, heart, diabetes, and medicine considerations.",
  safety: "Seek prompt medical advice for worsening breathlessness, blue lips, chest pain, confusion, repeated choking, a wet voice after swallowing, persistent vomiting, dehydration concern, or rapidly falling intake. A sudden change in respiratory symptoms is not a nutrition problem to solve at home. Oxygen, fluid, sodium, and supplement decisions belong with the treating team.",
});

const puneSports = articleContent({
  opening: "Cross-training after a sports injury is not a loophole for ignoring the injured structure. It is a way to preserve a suitable part of conditioning while the tissue, joint, or movement pattern is being assessed. The alternative activity must fit the injury, the sport, the person’s symptoms, and the clinician’s restrictions. The safest choice may change as recovery changes.",
  context: "Pune’s sports and active-work setting can include training, commuting, recreational play, or a return to a specific job task. This article does not assume a particular sport, local injury rate, or return date. Running, cycling, swimming, strength work, and other alternatives place different demands on the recovering area and on the rest of the body; an approved option for one person can be unsuitable for another.",
  assessment: "The clinician identifies the injured structure, irritability, swelling, range, strength, balance, coordination, load already tolerated, and the demands of the desired sport. They ask about sleep, stress, illness, training history, and the response later that day or the next day. Readiness is broader than pain during one drill: it includes control, confidence, repeatability, sport-specific tasks, and the ability to recover. A medical review may be required when the injury mechanism or symptoms are unclear.",
  progression: "An alternative activity can be selected to maintain a useful component of fitness without reproducing the movement or load that is currently restricted. The team may adjust support, surface, duration, resistance, range, speed, or decision-making one at a time. A training log can record the activity, symptoms, swelling, fatigue, sleep, and next-day function. Cross-training is reduced or changed when the injured area reacts or the person develops a whole-body response that was not expected.",
  homeSession: "A home session may examine a squat, step, controlled landing, balance task, or equipment setup that connects to the person’s sport, but only after the relevant injury restrictions are clear. The therapist can help distinguish conditioning work from a test of return-to-sport readiness. A plan should say what can be done, what needs supervision, which response ends the session, and what assessment is required before sport-specific loading returns.",
  dos: "Choose an alternative approved by the clinician, record local and whole-body responses, protect recovery and sleep, and change only one training variable at a time.",
  donts: "Do not use cross-training to hide swelling or instability, chase a pre-injury workload, apply a universal load ratio, or treat one pain-free drill as clearance for competition.",
  safety: "Stop and seek medical assessment for a new deformity, sudden loss of strength, a locked joint, rapidly increasing swelling, severe pain, chest pain, fainting, severe breathlessness, or a new neurological symptom. Review is needed when the injury is worsening, recovery is not behaving as expected, or an alternative activity produces a lasting decline in function.",
});

const hyderabadUpperLimb = articleContent({
  opening: "After a stroke, upper-limb rehabilitation becomes meaningful when it helps a person reach for a cup, steady a garment, open a container, use a phone, or take part in a familiar household task. Hyderabad families do not need another list of isolated movements copied from the internet. They need an assessment of the task, the affected arm, the environment, and the amount of help that keeps practice safe.",
  context: "Hyderabad is the setting for planning practical home practice, not evidence of a local recovery rate or specialist availability. A therapist may need to see a kitchen surface, bathroom, bed, table, doorway, or work area. The same arm weakness can create different problems depending on sensation, vision, neglect, tone, pain, cognition, communication, and the person’s usual responsibilities.",
  assessment: "The clinician looks at posture, shoulder protection, active movement, sensation, tone, coordination, reach, grasp, release, bilateral use, fatigue, and the person’s ability to understand and repeat a task. Pain or a feeling of instability may change the plan. The therapist also checks whether an object, surface, chair, or utensil can be adapted. A new sudden neurological symptom is not a practice problem; it needs urgent medical assessment.",
  progression: "Task-specific practice may begin with positioning and supported reach, then include a simple object, a two-handed activity, or a familiar sequence. The clinician can adjust the object’s size, weight, distance, height, speed, or the amount of assistance. Repetition is useful when the movement remains controlled and the shoulder is protected, but the article cannot prescribe a universal count or restraint schedule. Practice should be reviewed when fatigue, pain, tone, attention, or quality changes.",
  homeSession: "The therapist may watch the person make tea, fold clothing, reach to a shelf, use a phone, or manage a personal-care step. They teach the family how to support the forearm and avoid pulling the affected arm. The home plan should label tasks as independent, supervised, or not yet safe, and should explain how to stop without turning every difficult movement into a failure. Follow-up can refine the task as control improves.",
  dos: "Choose one meaningful task, protect the shoulder, use stable surfaces, give the smallest safe assistance, and record what helps the person complete the task with better control.",
  donts: "Do not pull through the affected arm, force a painful overhead reach, immobilize the arm indefinitely without a clinical plan, or compare the person’s repetitions with another survivor’s programme.",
  safety: "Urgent help is needed for new facial or limb weakness, sudden speech or vision change, collapse, altered consciousness, or a sudden severe headache. Prompt review is needed for new shoulder pain, swelling, loss of movement, repeated falls, marked fatigue, worsening neglect or confusion, or a change in swallowing. Practice should pause when the person cannot maintain safe control.",
});

const hyderabadCardioNutrition = articleContent({
  opening: "When cardiopulmonary illness makes eating tiring, nutrition advice has to start with the meal experience rather than a generic food chart. Breathlessness, coughing, fatigue, poor appetite, swelling, nausea, swallowing difficulty, and the effort of sitting upright can all affect intake. A useful article can help a family notice the problem and ask for the right review without pretending to diagnose it.",
  context: "A Hyderabad recovery plan may involve cardiac, pulmonary, neurological, or post-hospital care. Those pathways can have different medicine, fluid, salt, texture, and monitoring instructions. The district setting is included only to make the booking and home-assessment question practical; it does not support claims about local prevalence, outcomes, or access. A home therapist can observe movement around meals, while nutrition decisions remain with the medical and dietetic team.",
  assessment: "The team may ask how long meals take, whether talking or chewing causes breathlessness, whether coughing or a wet voice follows swallowing, whether appetite or weight has changed, and whether the person can shop, prepare food, sit safely, and recover afterward. Kidney disease, diabetes, heart failure, medicines, oxygen use, and recent hospital events can change the advice. Persistent poor intake is a clinical concern even when a family has found one food that is easy to tolerate.",
  progression: "The practical conversation may cover safe posture, manageable preparation, familiar foods, timing around activity, and which symptoms should trigger a referral. A dietitian may adapt the pattern, texture, portion, fluid, or supplement plan after assessment. This article does not assign a calorie, protein, sodium, or fluid target, and it does not recommend thickened liquids or supplements without the appropriate evaluation.",
  homeSession: "A physiotherapist may observe the route to the dining area, a chair-to-standing transfer, reaching for a plate, or the recovery needed after sitting for a meal. They can help with safe positioning and energy conservation while the family takes the food questions to a dietitian, physician, speech and language therapist, or respiratory team as appropriate. A food-and-symptom record can include appetite, coughing, breathlessness, fatigue, bowel symptoms, and weight trend without becoming a self-diagnosis.",
  dos: "Bring the discharge papers and medication list to review, record meal symptoms, use only the texture and fluid plan already recommended, and ask when nutrition or swallowing review should happen.",
  donts: "Do not force food or fluid through breathlessness, start a supplement because it is advertised for recovery, or assume a healthy food list is safe when kidney, heart, diabetes, or swallowing instructions differ.",
  safety: "Seek prompt medical advice for worsening breathlessness, blue lips, chest pain, fainting, confusion, repeated choking, a wet voice after swallowing, dehydration concern, persistent vomiting, or rapidly worsening intake. A new swallowing or breathing problem needs its own clinical pathway. Do not wait for a routine physiotherapy visit to address an acute cardiopulmonary change.",
});

const hyderabadDischargeExercise = articleContent({
  opening: "The first weeks after hospital discharge can make exercise feel uncertain when a person is recovering from a cardiac, neurological, or mixed medical event. A symptom-led plan begins with what the treating team has cleared, what the person can do today, and what response needs review. It does not turn a public activity target into a home prescription or treat a resting number as proof of readiness.",
  context: "Hyderabad is used as the home setting for planning the next safe question after discharge. The route may be from bed to bathroom, chair to doorway, or a short task that matters to the family. Cardiac symptoms, neurological weakness, medication changes, balance, breathing, sleep, and confidence can all affect the response. Formal exercise-capacity testing and medical clearance belong to the appropriate clinical service.",
  assessment: "The professional reviews the discharge diagnosis, procedures, precautions, medicines, symptoms, falls, cognition, strength, balance, breathing, and the response to a simple functional task. The person can record what was attempted, how symptoms changed during it, how much recovery was needed, and whether the next day was different. This information helps the team decide whether to continue, modify, or reassess; it does not establish a universal heart-rate, oxygen, blood-pressure, or intensity threshold.",
  progression: "When the plan is stable, progression may change one factor such as support, distance, duration, resistance, complexity, or rest. A person may work on transfers, walking, balance, strengthening, or carefully selected aerobic activity according to the condition and clearance. The next-day response matters, but there is no safe universal timeline after a hospital stay. New or changing cardiac, pulmonary, or neurological symptoms take priority over progression.",
  homeSession: "A home session can connect the discharge plan to the actual chair, corridor, stairs, walking aid, footwear, oxygen or other equipment, and caregiver position. The professional may teach a symptom log and a clear stop rule. Remote review can refine a previously assessed activity, but it should not be used to clear a new chest symptom, worsening wound, sudden neurological change, or unexplained decline in tolerance.",
  dos: "Keep the discharge instructions visible, use the cleared support, record symptoms and recovery, and contact the treating team when the response is different from the agreed pattern.",
  donts: "Do not restart strenuous exercise because a resting measurement looks normal, borrow a post-hospital timeline, or progress through chest symptoms, faintness, severe breathlessness, or new neurological change.",
  safety: "Stop and seek urgent medical care for chest pain or pressure, fainting or near-fainting, severe unexpected breathlessness, blue lips, severe palpitations, sudden weakness, new speech or vision change, collapse, or confusion. Any of these symptoms need urgent assessment rather than a home progression. If falls repeat, swelling appears, wound symptoms worsen, tolerance declines, or fatigue takes on a new pattern, arrange prompt review. Exercise should wait while the treating team assesses a concern that may be unstable.",
});

export const cityJournalBatch2Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-mumbai-neurological-fatigue",
    slug: "neurological-fatigue-pacing-household-tasks-mumbai",
    title: "Neurological Fatigue Physiotherapy in Mumbai: Pacing Household Tasks Without Losing Independence",
    metaTitle: "Neurological Fatigue Physiotherapy in Mumbai",
    metaDescription: "A practical Mumbai guide to neurological fatigue, household-task pacing, energy conservation, home assessment, and when changing symptoms need review.",
    excerpt: "How Mumbai families can plan meaningful household tasks around neurological fatigue without treating exhaustion as a test of willpower.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "mumbai",
    discipline: "physiotherapy",
    content: mumbaiNeuro,
    sources: [refs.niceNeuroFunction, refs.niceFatigue, refs.energyConservation, refs.mumbaiDistrict, refs.whoActivity],
  },
  {
    id: "city-journal-mumbai-cardiac-nutrition",
    slug: "cardiac-rehabilitation-nutrition-appetite-medicines-mumbai",
    title: "Eating During Cardiac Rehabilitation in Mumbai: Appetite, Medicines, and Recovery Questions",
    metaTitle: "Cardiac Rehabilitation Nutrition in Mumbai",
    metaDescription: "A cautious Mumbai guide to appetite, food and medicine questions, hydration boundaries, and dietitian referral during cardiac rehabilitation. Risks vary.",
    excerpt: "What Mumbai families can ask about food, appetite, medicines, and hydration while cardiac rehabilitation is coordinated with medical care.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "mumbai",
    discipline: "nutrition",
    content: mumbaiCardiacNutrition,
    sources: [refs.cardiacRehab, refs.cardiacEating, refs.icmrDiet, refs.cardiacCore, refs.poorAppetite, refs.mumbaiDistrict],
  },
  {
    id: "city-journal-mumbai-gbs-exercise",
    slug: "exercise-after-guillain-barre-fatigue-mumbai",
    title: "Exercise After Guillain–Barré in Mumbai: Monitoring Fatigue as Activity Returns",
    metaTitle: "Exercise After Guillain–Barré in Mumbai",
    metaDescription: "A safety-first Mumbai guide to exercise after Guillain–Barré syndrome, fatigue monitoring, graded activity, and neurological review. Follow-up matters.",
    excerpt: "How activity can return after Guillain–Barré syndrome with assessment, fatigue monitoring, recovery logs, and clear medical stop rules.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "mumbai",
    discipline: "exercise-physiology",
    content: mumbaiGbsExercise,
    sources: [refs.gbsReview, refs.gbsFatigue, refs.gbsNinds, refs.gbsNhs, refs.gbsTraining, refs.mumbaiDistrict],
  },
  {
    id: "city-journal-pune-community-mobility",
    slug: "post-surgery-stairs-community-mobility-pune",
    title: "Post-Surgery Physiotherapy for Stairs and Community Mobility in Pune",
    metaTitle: "Post-Surgery Physiotherapy for Mobility in Pune",
    metaDescription: "A practical Pune guide to post-surgery stairs, walking routes, vehicle transfers, work demands, home assessment, and safe readiness decisions need review.",
    excerpt: "How Pune patients can prepare for stairs, a building entrance, transport, work, and daily travel after surgery without relying on a fixed return date.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Functional Rehabilitation",
    image: "/images/journal/journal_post-surgery.jpg",
    citySlug: "pune",
    discipline: "physiotherapy",
    content: puneMobility,
    sources: [refs.niceCritical, refs.niceTrauma, refs.niceJoint, refs.aaosHip, refs.nhsStairs, refs.postOpSpine, refs.puneDistrict],
  },
  {
    id: "city-journal-pune-pulmonary-nutrition",
    slug: "nutrition-pulmonary-rehabilitation-appetite-breathlessness-pune",
    title: "Nutrition During Pulmonary Rehabilitation in Pune: Appetite, Breathlessness, and Hydration Questions",
    metaTitle: "Pulmonary Rehabilitation Nutrition in Pune",
    metaDescription: "A cautious Pune guide to appetite, breathlessness during meals, hydration questions, and dietitian referral during pulmonary rehabilitation. Risks vary.",
    excerpt: "What Pune families can ask about eating, breathlessness, appetite, hydration, and recovery during pulmonary rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "pune",
    discipline: "nutrition",
    content: punePulmonaryNutrition,
    sources: [refs.btsPulmonary, refs.niceCopd, refs.icmrDiet, refs.aacvpr, refs.puneDistrict],
  },
  {
    id: "city-journal-pune-sports-cross-training",
    slug: "cross-training-after-sports-injury-pune",
    title: "Cross-Training After Sports Injury in Pune: Maintaining Fitness While Tissue Recovers",
    metaTitle: "Cross-Training After Sports Injury in Pune",
    metaDescription: "A Pune guide to choosing clinician-approved cross-training, monitoring local and whole-body responses, and avoiding premature return to sport. Risks vary.",
    excerpt: "How Pune athletes and active adults can preserve suitable conditioning after injury without using cross-training to bypass recovery restrictions.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Sports Rehabilitation",
    image: "/images/journal/journal_sports-rehabilitation.jpg",
    citySlug: "pune",
    discipline: "exercise-physiology",
    content: puneSports,
    sources: [refs.returnSport, refs.sportLoad, refs.sportIllness, refs.whoActivity, refs.puneDistrict],
  },
  {
    id: "city-journal-hyderabad-upper-limb",
    slug: "upper-limb-task-retraining-after-stroke-hyderabad",
    title: "Upper-Limb Physiotherapy After Stroke in Hyderabad: Reaching, Grasping, and Home Practice",
    metaTitle: "Upper-Limb Stroke Physiotherapy in Hyderabad",
    metaDescription: "A practical Hyderabad guide to upper-limb task retraining after stroke, shoulder protection, meaningful practice, and caregiver boundaries. Risks vary.",
    excerpt: "How Hyderabad families can turn reaching, grasping, dressing, and kitchen tasks into safer, individualized upper-limb practice after stroke.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "hyderabad",
    discipline: "physiotherapy",
    content: hyderabadUpperLimb,
    sources: [refs.strokeArm, refs.cochraneArm, refs.niceNeuroFunction, refs.hyderabadDistrict, refs.whoActivity],
  },
  {
    id: "city-journal-hyderabad-cardiopulmonary-nutrition",
    slug: "nutrition-when-cardiopulmonary-illness-makes-eating-tiring-hyderabad",
    title: "When Cardiopulmonary Illness Makes Eating Tiring in Hyderabad: Nutrition Questions for Recovery",
    metaTitle: "Nutrition During Cardiopulmonary Recovery in Hyderabad",
    metaDescription: "A cautious Hyderabad guide to breathlessness during meals, appetite, swallowing, food preparation, and appropriate nutrition referral. Review matters.",
    excerpt: "What Hyderabad families can ask when breathlessness, fatigue, or cardiopulmonary symptoms make eating and food preparation tiring.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "hyderabad",
    discipline: "nutrition",
    content: hyderabadCardioNutrition,
    sources: [refs.btsPulmonary, refs.niceCopd, refs.cardiacRehab, refs.icmrDiet, refs.hyderabadDistrict],
  },
  {
    id: "city-journal-hyderabad-discharge-exercise",
    slug: "post-discharge-exercise-monitoring-neurological-cardiac-hyderabad",
    title: "After Hospital Discharge in Hyderabad: Symptom-Led Exercise Monitoring for Neuro and Cardiac Recovery",
    metaTitle: "Post-Discharge Exercise Monitoring in Hyderabad",
    metaDescription: "A safety-first Hyderabad guide to post-discharge exercise monitoring, symptom logs, medical clearance, and when progression must wait. Review matters.",
    excerpt: "How Hyderabad patients and families can connect post-discharge activity with clearance, symptom monitoring, recovery logs, and clinical review.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "hyderabad",
    discipline: "exercise-physiology",
    content: hyderabadDischargeExercise,
    sources: [refs.ahaExercise, refs.aacvpr, refs.whoActivity, refs.niceNeuroFunction, refs.hyderabadDistrict],
  },
];