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
  niceStroke: source("Stroke rehabilitation in adults", "NICE", "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations"),
  niceNeuro: source("Rehabilitation for chronic neurological disorders", "NICE", "https://www.nice.org.uk/guidance/ng252/chapter/Rehabilitation-to-maintain-improve-or-support-function"),
  ahaStrokeHome: source("Adult Stroke Rehabilitation and Recovery Guideline", "American Heart Association/American Stroke Association", "https://www.ahajournals.org/doi/10.1161/strokeaha.116.011309"),
  ahaStrokeAssessment: source("Adult Stroke Rehabilitation and Recovery: Assessment", "American Stroke Association", "https://www.stroke.org/en/-/media/Stroke-Files/Stroke-Resource-Center/Recovery/Provider-Focused/Adult-Rehabilitation-and-Recovery-Assessment.pdf"),
  whoRehab: source("Rehabilitation", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/rehabilitation"),
  niceFalls: source("Falls: assessment and prevention", "NICE", "https://www.nice.org.uk/guidance/ng249/chapter/recommendations"),
  whoFalls: source("Falls", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/falls"),
  nhsDysphagia: source("Swallowing problems (dysphagia)", "NHS", "https://www.nhs.uk/conditions/swallowing-problems-dysphagia/"),
  asaDysphagia: source("Trouble swallowing after stroke", "American Stroke Association", "https://www.stroke.org/en/about-stroke/effects-of-stroke/physical-effects/dysphagia"),
  niceNutrition: source("Nutrition support for adults", "NICE", "https://www.nice.org.uk/guidance/cg32/chapter/Recommendations"),
  whoDiet: source("Healthy diet", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/healthy-diet"),
  icmrDiet: source("Dietary Guidelines for Indians 2024", "National Institute of Nutrition, ICMR", "https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf"),
  whoActivity: source("Physical activity", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/physical-activity"),
  niceCritical: source("Rehabilitation after critical illness in adults", "NICE", "https://www.nice.org.uk/guidance/cg83/chapter/Recommendations"),
  whoPostop: source("Post-operative care", "World Health Organization", "https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/surgical-care/imeesc-toolkit/best-practice-safety-protocols/post-operative-care.pdf"),
  ahaCardiac: source("Cardiac rehabilitation", "American Heart Association", "https://www.heart.org/en/health-topics/cardiac-rehab"),
  atsPulmonary: source("Pulmonary rehabilitation", "American Thoracic Society", "https://www.thoracic.org/patients/patient-resources/resources/pulmonary-rehab.pdf"),
  niceCopd: source("Chronic obstructive pulmonary disease", "NICE", "https://www.nice.org.uk/guidance/ng115/chapter/recommendations"),
  btsPulmonary: source("Pulmonary rehabilitation in adults", "British Thoracic Society", "https://www.brit-thoracic.org.uk/document-library/guidelines/pulmonary-rehabilitation/bts-guideline-for-pulmonary-rehabilitation-in-adults"),
  nhlbiPulmonary: source("Pulmonary rehabilitation", "National Heart, Lung, and Blood Institute", "https://www.nhlbi.nih.gov/health/pulmonary-rehabilitation"),
  cdcHeat: source("About heat and your health", "Centers for Disease Control and Prevention", "https://www.cdc.gov/heat-health/about/index.html"),
  aaosKnee: source("Activities after total knee replacement", "American Academy of Orthopaedic Surgeons", "https://www.orthoinfo.org/recovery/activities-after-knee-replacement/"),
  niceKnee: source("Postoperative rehabilitation after joint replacement", "NICE", "https://www.nice.org.uk/guidance/QS206/chapter/statement-5-postoperative-rehabilitation"),
  aaosKneeExercise: source("Total knee replacement exercise guide", "American Academy of Orthopaedic Surgeons", "https://www.orthoinfo.org/recovery/total-knee-replacement-exercise-guide/"),
  espenSurgery: source("ESPEN guideline: clinical nutrition in surgery", "European Society for Clinical Nutrition and Metabolism", "https://15.espen.org/files/ESPEN-guideline_Clinical-nutrition-in-surgery.pdf"),
  espenSurgery2025: source("ESPEN guideline on clinical nutrition in surgery — Update 2025", "European Society for Clinical Nutrition and Metabolism", "https://www.espen.org/files/ESPEN-guideline-on-clinical-nutrition-in-surgery-Update-2025.pdf"),
  diabetesNutrition: source("Nutrition and diabetes", "American Diabetes Association", "https://diabetes.org/food-nutrition"),
  kidneyNutrition: source("Nutrition and Kidney Disease, Stages 1-5 (Not on Dialysis)", "National Kidney Foundation", "https://www.kidney.org/kidney-topics/nutrition-and-kidney-disease-stages-1-5-not-dialysis"),
  assamProfile: source("National Health Mission Assam", "Government of Assam", "https://nhm.assam.gov.in/"),
  kolkataProfile: source("Kolkata Collectorate", "Government of West Bengal", "https://kolkatacollectorate.wb.gov.in/"),
  chennaiProfile: source("Chennai District", "Government of Tamil Nadu", "https://chennai.nic.in/"),
  coimbatoreProfile: source("Coimbatore District", "Government of Tamil Nadu", "https://coimbatore.nic.in/"),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person's condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when an exercise plan needs review, but it does not replace emergency or specialist medical care.

The article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, neurologist, dietitian, speech-language clinician, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
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

City context is used here only to make the home setting understandable. A Guwahati, Kolkata, Chennai, or Coimbatore address does not establish a local prevalence, outcome, neighbourhood risk, or service availability. The same clinical question can require a different plan for two people in the same city.

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

${dos}

### Don’t

${donts}

### Safety and when to seek medical advice

${safety}

Urgent symptoms take priority over a home programme. If the person has a sudden neurological change, severe breathing difficulty, chest pain, fainting, collapse, a serious fall, rapidly worsening weakness, or a new swallowing problem, contact the appropriate emergency or medical service. Do not wait for a routine physiotherapy review to decide whether an emergency is occurring.
${commonBooking}`;
}

const guwahatiVisualScanning = articleContent({
  opening: "After a stroke, a person may appear able to walk in a quiet room yet miss a doorframe, chair, or person on one side when the home route becomes busy. Visual scanning physiotherapy is not a generic balance routine. It asks how seeing, attention, head movement, turning, and walking interact during the route the person actually needs.",
  context: "The Guwahati city pathway includes stroke and neurological rehabilitation, but the city name does not explain why one person misses objects or turns unsafely. A home review might use a doorway, a narrow passage, a dining chair, or the route to the bathroom as an assessment setting. The purpose is to understand the task, not to label a neighbourhood or assume that every stroke survivor has a visual field or neglect problem.",
  assessment: "The physiotherapist may ask what the person notices, whether the difficulty is present when sitting as well as walking, and whether fatigue or distraction changes it. They may observe eye and head movements, response to objects on different sides, turning, reaching, foot placement, visual field concerns, attention, communication, sensation, balance, and the effect of lighting or clutter. A new loss of vision, sudden confusion, new weakness, or a new speech change is not a cue to practise harder; it needs medical assessment.",
  progression: "Practice may begin with a stable seated or standing task so the person can learn what to look for without also losing balance. The clinician may then connect scanning to one route, with cueing that is clear and consistent. A later step might add a turn, a change in direction, or a familiar object, but only when the earlier task is reliable. Progress can be fewer missed obstacles or less caregiver cueing, not simply a longer walk.",
  homeSession: "The therapist may walk the route with the family, identify the locations where a missed object becomes dangerous, and agree on how a caregiver should cue without pulling the person. They may review lighting, furniture placement, footwear, walking aid use, and whether another professional should assess vision, cognition, or communication. The family can bring a short record of where the person looked, what was missed, and whether the result changed with rest.",
  dos: "Keep the route simple while it is being learned, use the agreed cue, improve lighting where possible, and tell the team when scanning changes with fatigue or a new symptom.",
  donts: "Do not hide obstacles as a surprise test, walk beside a person without the agreed guarding plan, assume a missed object is carelessness, or make the person practise an unsafe route alone.",
  safety: "Any of these symptoms needs urgent medical assessment: a sudden change in vision, balance, alertness, speech, facial movement, or limb strength. After a fall, head impact, fainting episode, or new severe headache, seek appropriate medical help before resuming route practice.",
});

const guwahatiMealUncertainty = articleContent({
  opening: "A neurological rehabilitation meal can become difficult for more than one reason. A person may cough, sound wet, tire before finishing, sit poorly, forget the sequence, lose appetite, or drink less because eating feels like work. The safe question is not which universal texture or supplement to choose. It is what the person and family should observe and record before the clinical team changes food, fluids, medicines, or rehabilitation.",
  context: "Guwahati's authored pathway includes neurological, stroke, Guillain–Barré, post-surgery, and geriatric rehabilitation. That context supports a referral-and-observation article, not a claim that one local food pattern suits every household. Familiar foods can be discussed with the dietitian and swallowing clinician after assessment, while the family records what happens during a meal rather than trying to diagnose aspiration at home.",
  assessment: "The team may ask about coughing or choking, a wet or gurgly voice, food sticking, drooling, chewing effort, posture, alertness, fatigue, mouth care, appetite, weight change, hydration concerns, and the timing of symptoms. They may review the neurological diagnosis, medicines, respiratory history, and the person's ability to follow instructions. A speech-language clinician may need to assess swallowing; a dietitian may assess intake and clinical nutrition risk. One symptom alone does not prove aspiration.",
  progression: "The first step may be making the meal observation safer and more consistent: the person is alert, positioned as advised, and supported by the right trained caregiver. The team may then review whether the person can manage a particular food or drink, whether rest breaks are needed, and whether the meal plan is meeting needs. Any texture modification, thickened liquid, supplement, tube-feeding decision, or medication timing belongs to the relevant clinical team.",
  homeSession: "A home session may review the dining chair, table height, posture, utensils, caregiver language, and what the person does when tired. The family can bring a simple record of meal time, foods or fluids that caused difficulty, coughing or voice change, amount left uneaten, and how the person felt afterwards. This record supports a professional assessment; it is not a home swallowing test.",
  dos: "Write down observable events, report weight or intake change promptly, keep the person as positioned and supervised as advised, and ask which professional should review each concern.",
  donts: "Do not force a meal, silently thicken every drink, remove whole food groups, add supplements, crush medicines, or change medication timing without the prescribing and swallowing teams.",
  safety: "Any of these symptoms needs prompt clinical review: repeated choking, a wet voice after swallowing, breathing difficulty during or after meals, fever, chest symptoms, dehydration concern, or rapidly falling intake. If severe breathing difficulty, cyanosis, collapse, or an airway emergency occurs, seek immediate help.",
});

const guwahatiOrthostatic = articleContent({
  opening: "Standing after a hospital stay can reveal a different problem from ordinary weakness. A person may feel light-headed when moving from lying to sitting, unsteady after standing, or unusually slow to recover after a transfer. An early return-home exercise plan in Guwahati should record the position change and the response so the team can distinguish a rehabilitation challenge from a medical or medication-related concern.",
  context: "Guwahati's care profile spans neurological, post-surgery, Guillain–Barré, stroke, and geriatric rehabilitation. Those labels do not predict how a particular person will respond to standing. The useful information is the sequence: what position the person started in, what assistance was needed, what symptoms appeared, how long recovery seemed to take, and whether the next task was different.",
  assessment: "A clinician may review recent illness, surgery, fluid and food intake, medicines, anaemia or cardiac history, neurological signs, falls, sleep, and the person's usual function. They may observe rolling, sitting, feet placement, sit-to-stand, standing tolerance, walking aid use, breathing, alertness, and symptom recovery. Blood pressure or oxygen measurements may be used when clinically indicated, but the article does not establish a home cut-off or invite self-adjustment of medicines.",
  progression: "Progress may begin with a safer position-change sequence and a clear assistance plan rather than an endurance target. The clinician may alter timing, rest, chair height, task order, or supervision before adding walking. The response later in the day and the next day matters. If symptoms are new, stronger, or less predictable, the correct progression may be reassessment or referral instead of more activity.",
  homeSession: "The therapist may observe a real bed-to-chair transfer, note where the person reports symptoms, and teach the caregiver how to pause and communicate. They may help create a short log with position, task, symptoms, assistance, recovery, and any later change in function. The log is for discussion with the treating team, not a substitute for orthostatic or cardiac evaluation.",
  dos: "Change position deliberately, use the assessed guarding plan, record what happened in context, and share new or changing symptoms with the medical team.",
  donts: "Do not stand suddenly to test tolerance, walk alone after a warning symptom, use another person's blood-pressure or oxygen target, or stop prescribed medicines because a log looks abnormal.",
  safety: "Any of these symptoms needs urgent medical assessment: fainting, chest pain, severe breathlessness, new neurological signs, a fall with injury, collapse, a racing or irregular heartbeat with symptoms, or rapidly worsening weakness. Persistent light-headedness or repeated near-falls deserves prompt review before the activity plan is advanced.",
});

const kolkataCardiacTransitions = articleContent({
  opening: "After cardiac or thoracic surgery, the route from bed to bathroom is a rehabilitation task with several moving parts. Sit-to-stand, breathing coordination, a wound or chest precaution, an aid, and a caregiver’s position can all affect safety. A Kolkata home article on this topic should not become a generic post-surgery exercise list; it should show how the sequence is assessed and how a changed response is escalated.",
  context: "Kolkata's authored profile includes post-surgery and cardiopulmonary rehabilitation. The supplied city localities are not evidence of local outcomes or access, so the city is only the setting for a home transition question. The correct sequence depends on the operation, surgeon’s precautions, lines or drains, breathing status, balance, orthostatic symptoms, and the person’s prior function.",
  assessment: "The physiotherapist may review the discharge summary, weight-bearing or chest precautions, wound concerns, breathing pattern, cough, pain, dizziness, alertness, strength, balance, chair height, bed height, walking aid, and the caregiver’s ability to guard. They may observe rolling, sitting, standing, turning, and the bathroom route as one sequence. New wound drainage, fever, severe pain, chest pain, faintness, or neurological change belongs with the medical team.",
  progression: "The plan may first change the order and support of the transfer: pause after sitting, place feet and equipment, coordinate breathing without breath-holding, stand with the assessed assistance, and turn only when control is present. Later, the clinician may reduce assistance or alter the route. Stairs, longer walks, lifting, and return to household work are separate decisions, not automatic next steps from a successful bathroom transfer.",
  homeSession: "A home session may map the bed, chair, bathroom doorway, grab points, floor surface, and the place where the caregiver can stand without blocking the person. The therapist can rehearse the agreed sequence, explain what the family should say, and record which step is not yet safe. They should also tell the family whom to contact if the wound, breathing, pain, or dizziness changes.",
  dos: "Keep the discharge precautions available, clear the route, use the assessed aid and guarding position, pause when instructed, and report a changed response rather than hiding it.",
  donts: "Do not pull on a healing arm or chest, hold the breath to force a movement, improvise a transfer belt or aid, or treat a single good transfer as permission for unsupervised stairs.",
  safety: "Any of these symptoms needs urgent medical assessment: chest pain, severe or new breathlessness, fainting, collapse, new neurological weakness, uncontrolled bleeding, fever with wound change, rapidly increasing wound drainage, or sudden loss of function.",
});

const kolkataMealRecord = articleContent({
  opening: "When cardiopulmonary recovery makes meals exhausting, families often want to change food or fluids immediately. A safer first step is to record what happens: breathlessness before or during eating, pauses, coughing, voice change, appetite, intake, weight trend, posture, and recovery. This Kolkata article is about the questions that make a clinical review useful, not a heart-healthy menu or a fixed pulmonary nutrition prescription.",
  context: "Kolkata's profile supports cardiopulmonary and post-surgery rehabilitation, but it does not establish that any locality has a particular food problem or service outcome. Breathlessness during a meal can have several explanations, including the meal texture, swallowing safety, posture, fatigue, lung or heart status, pain, anxiety, or medication effects. A record helps the team decide which professional needs to review the person.",
  assessment: "The team may ask whether breathlessness starts before eating, after a few mouthfuls, with liquids, or when the person talks; whether there is coughing, wet voice, food sticking, fever, swelling, orthopnoea, appetite change, or unintentional weight loss; and which medicines or restrictions apply. A swallowing clinician, dietitian, doctor, or pulmonary/cardiac team may each answer a different part of the problem. No single symptom confirms the cause.",
  progression: "The first change may be a safer setup and shorter observation period, not a smaller meal by rule. The clinical team may review posture, rest, pacing, food and fluid consistency, energy adequacy, sodium or fluid restrictions, and whether a supplement is appropriate. Those choices depend on the person's examination, diagnosis, medicines, kidney function, swallowing result, and goals. Progress means more reliable intake and recovery, not meeting a universal number.",
  homeSession: "A home visit may look at the dining position, table height, route to the kitchen, oxygen or device safety where prescribed, and the caregiver’s way of offering help. The family can bring a log with time, symptoms, what was attempted, coughing or voice change, amount left, and recovery. The log should never be used to alter oxygen, fluid restriction, anticoagulation, or medicines without the responsible team.",
  dos: "Record patterns in plain language, ask which restriction is active and who manages it, report poor intake or weight change early, and bring the record to the next review.",
  donts: "Do not force food, remove fluids, start a supplement, use a thickener, change salt or medication timing, or assume that one breathless meal proves aspiration or heart failure.",
  safety: "Any of these symptoms needs prompt or urgent medical review: new severe breathlessness, chest pain, fainting, blue lips, confusion, repeated choking, wet voice with respiratory symptoms, fever, swelling with rapid deterioration, or inability to maintain prescribed intake.",
});

const kolkataRecoveryLog = articleContent({
  opening: "A recovery log after cardiopulmonary discharge should help a person and care team communicate, not turn the home into an unsupervised stress test. The useful record links an activity with symptoms, assistance, recovery, and the next-day effect. In Kolkata, this can support a conversation about whether the plan needs review after cardiac, pulmonary, or mixed medical recovery.",
  context: "A cardiology or pulmonary team may use formal assessment and medically supervised rehabilitation; a home physiotherapist may observe function and help the family describe it. These are different roles. The city profile is context only. It cannot establish a local pathway, and a diary cannot replace an ECG, pulmonary assessment, wound review, or a clinician’s decision about exercise clearance.",
  assessment: "The clinician may ask about the diagnosis and discharge date, precautions, oxygen or device instructions, medicines, chest symptoms, neurological symptoms, sleep, swelling, cough, sputum, dizziness, and the person's baseline task. They may choose an ordinary activity such as a transfer, washing, or a short household route to observe quality and recovery. Heart-rate, oxygen, blood-pressure, or exertion measures are interpreted in context; this article does not set universal cut-offs.",
  progression: "The log can move from vague statements such as “bad day” to specific observations: activity, assistance, symptom, pause, recovery, and later function. The treating team may then change one part of the plan, such as supervision, timing, route, or referral, rather than increasing intensity automatically. A stable response can support a reviewed plan; it does not grant permission to add distance, stairs, resistance, or oxygen changes independently.",
  homeSession: "A session may help the person choose a simple, repeatable activity and a short record that a family member can complete without guessing. The therapist can identify which signs mean pause, which require a same-day call, and which need emergency help. The log should be shared with the cardiac, pulmonary, surgical, or neurological team when the response changes.",
  dos: "Record the activity and context, include symptoms and recovery, share repeated or changed patterns, and keep formal team instructions with the log.",
  donts: "Do not chase a better number, compare the log with another person, alter oxygen or medicines, or continue through chest pain, faintness, severe breathlessness, or new neurological symptoms.",
  safety: "Any of these symptoms needs urgent assessment: chest pain, severe breathlessness, fainting, collapse, new confusion or weakness, coughing blood, a rapidly changing wound, or a sustained deterioration. A repeated but less severe change should still be reported before the plan progresses.",
});

const chennaiTelerehab = articleContent({
  opening: "Stroke telerehabilitation can be useful when a person and therapist agree that remote support fits the rehabilitation goal. It is not simply a video call followed by a generic exercise sheet. The clinician must decide what can be observed safely through the available device, what the caregiver can support, and when an in-person review is more appropriate.",
  context: "Chennai's authored profile includes stroke and neurological rehabilitation, but the city's long travel corridors do not prove that telerehabilitation is suitable for every person. NICE describes telerehabilitation as an option when the person agrees and it aligns with goals. A home connection may be used for coaching, review, and problem-solving while some assessments or hands-on care still require an in-person clinician.",
  assessment: "The therapist may assess communication, cognition, vision, hearing, attention, trunk control, transfers, walking, upper-limb use, fatigue, safety awareness, camera position, internet reliability, and caregiver availability. They may ask the person to demonstrate a familiar task rather than a difficult exercise. New neurological symptoms, unsafe falls, severe confusion, or inability to follow safety instructions can change the route to in-person or medical review.",
  progression: "A remote plan may start with one meaningful task, a clear camera view, and a caregiver who knows when to stop rather than physically lifting the person. Feedback can then refine cueing, setup, timing, or assistance. Progress may be better carryover between sessions or safer decision-making. It is not measured by completing a harder exercise on video without the clinician being able to assess the whole environment.",
  homeSession: "The family may be asked to show the chair, bed, walking route, device, and the place where practice occurs. The therapist can coach positioning and cueing, review a short recording made with consent, and document what was independent, supervised, or not yet safe. The family should have a backup plan for technical failure and a clear contact route for symptoms that cannot be assessed remotely.",
  dos: "Agree on the goal, test the camera and space before starting, keep a capable adult nearby when advised, use the agreed cue, and tell the therapist what the camera cannot show.",
  donts: "Do not treat remote review as clearance for stairs or unsupported transfers, ask a caregiver to lift beyond their ability, record or share video without consent, or continue when the person is confused or medically unwell.",
  safety: "Any of these symptoms needs urgent medical help rather than a video appointment: a new facial droop, speech or vision change, one-sided weakness, severe headache, collapse, chest pain, or severe breathlessness. If a technical problem hides the person's feet, aid, or guarding position, stop and redesign the session.",
});

const chennaiPreopNutrition = articleContent({
  opening: "Nutrition questions before knee replacement are often framed as “what should I eat?” A safer preoperative conversation starts earlier: has appetite changed, has weight changed without trying, is chewing or swallowing difficult, are diabetes or kidney instructions already in place, and does the surgical team know about the person's intake and medicines? Screening is not a promise that one diet improves every operation.",
  context: "Chennai's care profile includes knee replacement rehabilitation. The city and its localities do not provide evidence for a shared menu or surgical outcome. ESPEN guidance supports nutritional risk assessment and individualized support around major surgery, while ICMR guidance provides population-level food-pattern principles. The clinical team must translate those principles for the operation, medical conditions, fasting instructions, and the person's actual intake.",
  assessment: "A clinician may review unintentional weight change, appetite, recent illness, usual meals, chewing and swallowing, gastrointestinal symptoms, diabetes, kidney or heart disease, medicines, mobility, and the planned operation. They may use a formal nutrition screening tool or refer to a dietitian. The assessment can also identify when a swallowing clinician, diabetes team, renal team, or surgeon should answer a question before an operation is scheduled.",
  progression: "The plan may begin with recording intake and identifying barriers, then making an individualized food or supplement decision with the dietitian and surgical team. It may include practical preparation for shopping, cooking, assistance, fasting, and the first days after discharge. A high-protein, low-salt, diabetic, renal, or supplement plan is not interchangeable between people. The safe progression is reviewed against symptoms, intake, laboratory or medical context, and surgical instructions.",
  homeSession: "A home or online review may focus on the real kitchen, who prepares meals, whether the person can stand safely, and what help will be available after surgery. A physiotherapist can connect nutrition concerns with function and equipment, but cannot prescribe a clinical diet. The family should carry the screening questions and any current diet or fasting instructions to the surgeon and dietitian.",
  dos: "Tell the team about weight or appetite change, bring a medication and medical-condition list, ask who owns each nutrition decision, and plan practical help for shopping and meals.",
  donts: "Do not start a supplement, stop a food group, fast longer than instructed, change diabetes or kidney medicines, or treat a population plate graphic as an individualized surgical prescription.",
  safety: "Any of these symptoms needs prompt clinical review before elective rehabilitation planning continues: rapid unintentional weight loss, inability to eat or drink, repeated vomiting, choking, dehydration concern, confusion, severe high or low glucose symptoms, or a new medical deterioration.",
});

const chennaiCriticalExercise = articleContent({
  opening: "After critical illness, weakness and breathlessness can appear together but do not always have the same explanation. Exercise physiology can help the team ask what limits a task: muscle force, balance, breathing, cognition, pain, anxiety, oxygenation, medication effect, or a new medical problem. The Chennai article is about assessment and handover, not a self-directed post-ICU workout.",
  context: "Chennai's authored profile includes post-surgery and cardiopulmonary rehabilitation. NICE recommends functional reassessment, shared goals, structured handover, and follow-up after critical illness. The city name does not imply a local ICU pathway or outcome. A person's discharge summary, critical-care history, current precautions, and family observations are more important than a generic recovery calendar.",
  assessment: "The clinician may ask about the critical illness, ventilation, muscle weakness, cognition, sleep, mood, pain, breathlessness, cough, swallowing, nutrition, medicines, falls, and daily activities. They may observe rolling, sitting, standing, walking, speaking during activity, recovery, and the effect of assistance. A slow recovery can require referral rather than a harder exercise. The assessment may involve medical, respiratory, neurological, psychological, nutrition, and rehabilitation professionals.",
  progression: "The first goal may be a safe handover and a repeatable functional task. The team may alter the chair, aid, supervision, rest, breathing coordination, or task order before adding resistance or endurance work. Later progress is reviewed against control, recovery, participation, and symptoms. No universal oxygen, heart-rate, blood-pressure, repetition, or timeline target can be safely copied from this article.",
  homeSession: "A home session may compare the discharge plan with the actual bed, bathroom, chair, stairs, and family support. The therapist can help the person record which task caused weakness or breathlessness and whether recovery changed later. They can also identify missing referrals and explain what the caregiver should report. A home session cannot diagnose a new respiratory or cardiac problem.",
  dos: "Keep the discharge handover, describe the limiting symptom precisely, allow recovery, and ask the team to review a slower-than-expected or changing response.",
  donts: "Do not label every symptom as deconditioning, push through severe breathlessness, change oxygen, or use a generic post-ICU programme without considering the person's medical history.",
  safety: "Any of these symptoms needs urgent medical assessment: severe or new breathlessness, chest pain, fainting, confusion, blue lips, coughing blood, new neurological weakness, inability to swallow safely, fever, or rapidly worsening function.",
});

const coimbatoreAirwayClearance = articleContent({
  opening: "Sputum can change how a person with COPD moves, rests, speaks, and recovers. Airway-clearance physiotherapy is not the same as a general daily-task pacing article, and it is not a device recommendation for everyone. The clinical question is whether secretion retention, cough effectiveness, breathing pattern, and the person's medical status call for a reviewed airway-clearance approach.",
  context: "Coimbatore's authored profile includes COPD and pulmonary rehabilitation. The city is not evidence of local disease prevalence or climate-related outcomes. A physiotherapist may consider the person's diagnosis, sputum, cough, fatigue, inhalers, exacerbation history, chest symptoms, swallowing, and ability to use a technique. Some devices or techniques are appropriate only for selected people and after instruction.",
  assessment: "The therapist may ask about colour and amount of sputum, change from usual, fever, wheeze, chest pain, cough strength, breathlessness, fatigue, posture, hydration instructions, inhaler technique, and recent exacerbation or admission. They may observe breathing control, huff or cough, positioning, secretion movement, and recovery. A new or rapidly worsening sputum change may need medical treatment before airway-clearance practice is progressed.",
  progression: "The plan may first improve the person's understanding of when to use an assessed technique and how to rest between efforts. The clinician may then review cough effectiveness, posture, device use if prescribed, and the effect on function. Progress can be easier secretion clearance with less distress, not a fixed number of blows, cycles, or minutes. The treating team decides whether a technique should change during an exacerbation.",
  homeSession: "A home session may look at the chair, bed, bathroom, room ventilation, device cleaning, and the person's ability to follow the sequence. The therapist can coordinate questions with the respiratory team and identify a safe place for practice. A caregiver may learn how to support communication and observation, but should not perform chest techniques or suction without the relevant training.",
  dos: "Report a change from usual sputum, keep prescribed devices clean, use only the technique taught for the person, and allow recovery between efforts.",
  donts: "Do not borrow a device, force a cough until exhausted, use percussion or drainage positions without assessment, or treat a sudden sputum change as a reason to exercise harder.",
  safety: "Any of these symptoms needs prompt or urgent medical assessment: severe breathlessness, chest pain, blue lips, confusion, coughing blood, fainting, high fever, rapidly increasing sputum, or inability to clear secretions.",
});

const coimbatoreNutritionRestrictions = articleContent({
  opening: "Rehabilitation nutrition becomes more complicated when diabetes or kidney disease is part of the picture. A person may hear “eat more for recovery” and “limit something for kidney health” at the same time. The safe response is not to choose a high-protein, low-salt, low-carbohydrate, or high-fluid plan from the internet. It is to bring the competing instructions to the clinical team and ask which decision belongs to whom.",
  context: "Coimbatore's care profile includes neurological, post-surgery, knee-replacement, and pulmonary rehabilitation. Diabetes and kidney disease are not a city claim; they are examples of medical variation that can change nutrition advice during rehabilitation. ICMR and WHO describe broad food-pattern principles, while diabetes and kidney teams may need to individualize carbohydrate, sodium, potassium, protein, fluid, or medicine-related decisions.",
  assessment: "A dietitian or medical team may review appetite, weight change, glucose pattern, kidney function, blood pressure, swelling, urine changes, medicines, swallowing, activity, wound status, and the person's usual household food. The team may coordinate with the surgeon, nephrologist, diabetes clinician, and rehabilitation professional. A physiotherapist can explain how fatigue or function affects meals, but cannot replace a renal or diabetes nutrition assessment.",
  progression: "The first step may be a shared list of current instructions and the problem that makes them hard to follow. The plan can then address food access, preparation, timing around therapy, appetite, safe activity, and monitoring agreed by the clinical team. Improvement may mean adequate intake and more consistent function without worsening the medical condition. Universal protein, fluid, calorie, sodium, potassium, or meal-timing targets are unsafe here.",
  homeSession: "A home visit may identify whether the person can shop, cook, sit at the table, open containers, or swallow safely after exercise. The therapist can help the family describe fatigue and task demands to the dietitian. They may also review a recovery routine, but any change to food, fluid, supplement, or medicine instructions must be confirmed by the responsible team.",
  dos: "Bring all condition-specific instructions together, record relevant symptoms or intake changes, ask what to do on therapy days, and seek review when the current plan becomes difficult to follow.",
  donts: "Do not combine advice from different conditions into a formula, start protein powders or herbal products, change diabetes or kidney medicines, or assume that more food is always safer during rehabilitation.",
  safety: "Any of these symptoms needs prompt medical review: very high or low glucose symptoms, repeated vomiting, dehydration concern, new swelling or breathlessness, confusion, markedly reduced urine, choking, rapid weight change, or inability to maintain prescribed intake.",
});

const coimbatoreHeatPulmonary = articleContent({
  opening: "Heat can change how a person with COPD experiences a familiar exercise task, but a hot day is not a reason to copy a universal indoor or outdoor intensity rule. Heat-aware pulmonary exercise physiology asks whether the environment, symptoms, hydration instructions, medication, clothing, air quality, and recovery plan make the planned activity appropriate that day.",
  context: "Coimbatore is the setting for this environmental-planning question, not evidence of a local heat burden or a city-specific pulmonary outcome. Pulmonary rehabilitation is supervised and individualized. A clinician may help the person choose a cooler space or time, but kidney, heart, fluid-restriction, oxygen, and medication considerations can make apparently simple advice unsafe.",
  assessment: "The team may review COPD severity, usual breathlessness, sputum, exacerbations, cardiac or kidney conditions, prescribed oxygen, medicines, hydration restrictions, heat exposure, sleep, and recovery. They may observe a familiar activity indoors or outdoors when safe, including posture, pacing, communication, sweating, dizziness, breathing, and next-day function. Temperature alone does not determine readiness; a symptom change from usual matters.",
  progression: "The plan may first change the environment, route, clothing, supervision, rest, or time of day before changing the exercise itself. The clinician may then review whether the person can recover predictably and whether the same activity remains appropriate. Progress is a reviewed combination of function and recovery, not a fixed distance, oxygen target, heart-rate range, or number of minutes.",
  homeSession: "A home session may inspect the exercise space, fan or cooling options, stairs, outdoor route, access to water as prescribed, and the place where the person can stop safely. The therapist can help write a plan for normal, caution, and stop situations and can coordinate with the respiratory team. Heat advice must respect any fluid or salt restriction.",
  dos: "Check the day's symptoms and environment, use the prescribed respiratory support, choose the assessed setting, plan recovery, and stop early when the response is not usual.",
  donts: "Do not exercise through dizziness, confusion, severe breathlessness, or chest symptoms, increase fluids against a restriction, change oxygen settings, or treat a cooler room as permission for unreviewed intensity.",
  safety: "Any of these symptoms needs urgent medical attention: confusion, fainting, collapse, severe breathlessness, chest pain, blue lips, inability to cool down, suspected heat illness, or rapidly worsening sputum. A repeated change in recovery should be reported before the next progression.",
});

const posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-guwahati-visual-scanning",
    slug: "visual-scanning-safe-route-finding-after-stroke-guwahati",
    title: "After Stroke in Guwahati: Visual Scanning and Safer Route-Finding at Home",
    metaTitle: "Visual Scanning After Stroke in Guwahati",
    metaDescription: "A focused Guwahati guide to visual scanning, attention, turning, doorways, caregiver cueing, and safer stroke rehabilitation routes at home. Risks vary.",
    excerpt: "How families can make stroke rehabilitation routes safer when a person misses objects, turns, or doorways without assuming the cause.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "guwahati",
    discipline: "physiotherapy",
    content: guwahatiVisualScanning,
    sources: [refs.niceStroke, refs.ahaStrokeHome, refs.ahaStrokeAssessment, refs.whoRehab, refs.niceFalls, refs.assamProfile],
  },
  {
    id: "city-journal-guwahati-meal-uncertainty",
    slug: "neurological-meal-fatigue-swallowing-uncertainty-guwahati",
    title: "Neurological Rehabilitation in Guwahati: When Meal Fatigue and Swallowing Uncertainty Need Review",
    metaTitle: "Meal Fatigue and Swallowing Questions in Guwahati",
    metaDescription: "A Guwahati guide to meal fatigue, coughing, wet voice, intake change, swallowing review, and nutrition questions during neurological recovery. Review.",
    excerpt: "What families can observe and record when neurological fatigue or swallowing uncertainty makes meals difficult during rehabilitation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "guwahati",
    discipline: "nutrition",
    content: guwahatiMealUncertainty,
    sources: [refs.nhsDysphagia, refs.asaDysphagia, refs.niceNutrition, refs.whoDiet, refs.icmrDiet, refs.whoRehab],
  },
  {
    id: "city-journal-guwahati-orthostatic",
    slug: "orthostatic-symptoms-early-return-home-guwahati",
    title: "Early Return Home in Guwahati: Monitoring Orthostatic Symptoms After Discharge",
    metaTitle: "Orthostatic Symptoms During Home Recovery in Guwahati",
    metaDescription: "A safety-first Guwahati guide to recording position-change symptoms, transfers, standing tolerance, recovery, and when medical review is needed promptly.",
    excerpt: "How to describe light-headedness and recovery during early home activity after neurological or post-surgical discharge.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "guwahati",
    discipline: "exercise-physiology",
    content: guwahatiOrthostatic,
    sources: [refs.niceCritical, refs.niceNeuro, refs.whoRehab, refs.whoActivity, refs.niceFalls, refs.whoPostop],
  },
  {
    id: "city-journal-kolkata-cardiac-transitions",
    slug: "bed-to-bathroom-sequencing-cardiac-thoracic-surgery-kolkata",
    title: "After Cardiac or Thoracic Surgery in Kolkata: Bed-to-Bathroom Sequencing",
    metaTitle: "Bed-to-Bathroom Physiotherapy After Surgery in Kolkata",
    metaDescription: "A focused Kolkata guide to bed-to-bathroom sequencing after cardiac or thoracic surgery, breathing coordination, caregiver guarding, and wound safety.",
    excerpt: "How a cardiac or thoracic surgery transfer can be assessed as a sequence rather than treated as a generic post-surgery exercise.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Cardiopulmonary Rehabilitation",
    image: "/images/journal/journal_cardiopulmonary-rehabilitation.jpg",
    citySlug: "kolkata",
    discipline: "physiotherapy",
    content: kolkataCardiacTransitions,
    sources: [refs.niceCritical, refs.whoRehab, refs.whoPostop, refs.ahaCardiac, refs.ahaStrokeAssessment, refs.kolkataProfile],
  },
  {
    id: "city-journal-kolkata-meal-record",
    slug: "record-before-changing-food-fluids-cardiopulmonary-meal-exhaustion-kolkata",
    title: "When Cardiopulmonary Recovery Makes Meals Exhausting in Kolkata: What to Record First",
    metaTitle: "Cardiopulmonary Meal Exhaustion in Kolkata | Goswami Rehab",
    metaDescription: "A cautious Kolkata guide to recording breathlessness, coughing, intake, posture, weight change, and referral questions before changing food or fluids.",
    excerpt: "What families should record before changing food, fluids, supplements, or medication timing when meals feel exhausting after cardiopulmonary illness.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "kolkata",
    discipline: "nutrition",
    content: kolkataMealRecord,
    sources: [refs.niceNutrition, refs.nhsDysphagia, refs.whoDiet, refs.atsPulmonary, refs.ahaCardiac, refs.asaDysphagia],
  },
  {
    id: "city-journal-kolkata-recovery-log",
    slug: "cardiopulmonary-recovery-log-after-discharge-kolkata",
    title: "After Cardiopulmonary Discharge in Kolkata: A Recovery Log to Share With the Care Team",
    metaTitle: "Cardiopulmonary Recovery Log After Discharge in Kolkata",
    metaDescription: "A focused Kolkata guide to logging activity, symptoms, recovery, assistance, and next-day response without copying oxygen or intensity limits. Review.",
    excerpt: "How a symptom-and-function log can improve conversations with cardiac, pulmonary, surgical, or neurological teams after discharge.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "kolkata",
    discipline: "exercise-physiology",
    content: kolkataRecoveryLog,
    sources: [refs.ahaCardiac, refs.atsPulmonary, refs.niceCritical, refs.whoActivity, refs.whoRehab, refs.niceCopd],
  },
  {
    id: "city-journal-chennai-telerehab",
    slug: "stroke-telerehabilitation-caregiver-coaching-chennai",
    title: "Stroke Telerehabilitation in Chennai: Caregiver Coaching and Safer Home Practice",
    metaTitle: "Stroke Telerehabilitation and Caregiver Coaching in Chennai",
    metaDescription: "A practical Chennai guide to stroke telerehabilitation, shared goals, camera setup, caregiver cueing, home practice, and when in-person review is needed.",
    excerpt: "How remote stroke rehabilitation can support a shared goal without pretending that every transfer or walking route is safe to assess by video.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "chennai",
    discipline: "physiotherapy",
    content: chennaiTelerehab,
    sources: [refs.niceStroke, refs.ahaStrokeHome, refs.ahaStrokeAssessment, refs.whoRehab, refs.niceNeuro, refs.chennaiProfile],
  },
  {
    id: "city-journal-chennai-knee-nutrition",
    slug: "preoperative-nutrition-screening-knee-replacement-chennai",
    title: "Before Knee Replacement in Chennai: Nutrition Screening and Questions for the Team",
    metaTitle: "Nutrition Screening Before Knee Replacement in Chennai",
    metaDescription: "A Chennai guide to appetite, weight change, diabetes, kidney considerations, swallowing, and nutrition screening before knee replacement. Review matters.",
    excerpt: "What to discuss with the surgical and nutrition teams before knee replacement when appetite, weight, diabetes, or kidney instructions complicate preparation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "chennai",
    discipline: "nutrition",
    content: chennaiPreopNutrition,
    sources: [refs.espenSurgery2025, refs.espenSurgery, refs.niceNutrition, refs.icmrDiet, refs.niceKnee, refs.nhsDysphagia],
  },
  {
    id: "city-journal-chennai-critical-exercise",
    slug: "exercise-assessment-after-critical-illness-chennai",
    title: "After Critical Illness in Chennai: Separating Weakness, Breathlessness, and Recovery Needs",
    metaTitle: "Exercise Assessment After Critical Illness in Chennai",
    metaDescription: "A safety-first Chennai guide to post-critical-illness exercise assessment, weakness, breathlessness, recovery, and referral boundaries. Review matters.",
    excerpt: "How exercise assessment after critical illness can separate functional weakness from breathlessness without copying a post-ICU workout.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "chennai",
    discipline: "exercise-physiology",
    content: chennaiCriticalExercise,
    sources: [refs.niceCritical, refs.whoRehab, refs.whoActivity, refs.ahaCardiac, refs.atsPulmonary, refs.niceCopd],
  },
  {
    id: "city-journal-coimbatore-airway-clearance",
    slug: "copd-airway-clearance-physiotherapy-coimbatore",
    title: "COPD Airway-Clearance Physiotherapy in Coimbatore: When Sputum Changes Activity",
    metaTitle: "COPD Airway-Clearance Physiotherapy in Coimbatore",
    metaDescription: "A focused Coimbatore guide to sputum change, cough effectiveness, airway-clearance assessment, device safety, recovery, and respiratory review. Risks vary.",
    excerpt: "How airway-clearance physiotherapy differs from generic COPD pacing when sputum and cough begin to affect activity.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Cardiopulmonary Rehabilitation",
    image: "/images/journal/journal_cardiopulmonary-rehabilitation.jpg",
    citySlug: "coimbatore",
    discipline: "physiotherapy",
    content: coimbatoreAirwayClearance,
    sources: [refs.niceCopd, refs.btsPulmonary, refs.nhlbiPulmonary, refs.atsPulmonary, refs.whoRehab, refs.coimbatoreProfile],
  },
  {
    id: "city-journal-coimbatore-restrictions-nutrition",
    slug: "diabetes-kidney-rehabilitation-nutrition-questions-coimbatore",
    title: "Nutrition Questions When Diabetes or Kidney Restrictions Meet Rehabilitation in Coimbatore",
    metaTitle: "Diabetes, Kidney, and Rehabilitation Nutrition in Coimbatore",
    metaDescription: "A Coimbatore guide to coordinating diabetes or kidney nutrition instructions with rehabilitation without universal protein, fluid, or calorie targets.",
    excerpt: "How families can coordinate competing diabetes, kidney, and rehabilitation nutrition instructions without choosing a formula from the internet.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "coimbatore",
    discipline: "nutrition",
    content: coimbatoreNutritionRestrictions,
    sources: [refs.diabetesNutrition, refs.kidneyNutrition, refs.icmrDiet, refs.whoDiet, refs.niceNutrition, refs.whoRehab],
  },
  {
    id: "city-journal-coimbatore-heat-pulmonary",
    slug: "copd-exercise-physiology-heat-pacing-coimbatore",
    title: "COPD Exercise Physiology in Coimbatore: Heat-Aware Pacing, Breathlessness, and Recovery",
    metaTitle: "Heat-Aware COPD Exercise Physiology in Coimbatore",
    metaDescription: "A focused Coimbatore guide to heat-aware COPD exercise planning, breathlessness, cooling, recovery, prescribed support, and when to stop. Review matters.",
    excerpt: "How environmental planning can be part of COPD exercise review without creating a universal heat, oxygen, hydration, or intensity rule.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "coimbatore",
    discipline: "exercise-physiology",
    content: coimbatoreHeatPulmonary,
    sources: [refs.niceCopd, refs.btsPulmonary, refs.nhlbiPulmonary, refs.cdcHeat, refs.whoActivity, refs.atsPulmonary],
  },
];

export const cityJournalBatch5Posts = posts;