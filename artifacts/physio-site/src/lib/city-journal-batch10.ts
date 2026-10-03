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
  nicePostop: source(
    "Joint replacement: postoperative rehabilitation",
    "NICE",
    "https://www.nice.org.uk/guidance/qs206/chapter/statement-5-postoperative-rehabilitation",
  ),
  niceStroke: source(
    "Stroke rehabilitation in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations",
  ),
  niceRehab: source(
    "Rehabilitation after critical illness in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg83/chapter/Recommendations",
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
  niceCopd: source(
    "Chronic obstructive pulmonary disease",
    "NICE",
    "https://www.nice.org.uk/guidance/ng115/chapter/recommendations",
  ),
  whoActivity: source(
    "Physical activity",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/physical-activity",
  ),
  whoRehab: source(
    "Rehabilitation",
    "World Health Organization",
    "https://www.who.int/news-room/fact-sheets/detail/rehabilitation",
  ),
  whoPostop: source(
    "Post-operative care",
    "World Health Organization",
    "https://cdn.who.int/media/docs/default-source/integrated-health-services-(ihs)/csy/surgical-care/imeesc-toolkit/best-practice-safety-protocols/post-operative-care.pdf",
  ),
  icmrDiet: source(
    "Dietary Guidelines for Indians 2024",
    "National Institute of Nutrition, ICMR",
    "https://www.nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf",
  ),
  nhsBreathlessness: source(
    "Shortness of breath",
    "NHS",
    "https://www.nhs.uk/conditions/shortness-of-breath/",
  ),
  nhsConstipation: source(
    "Constipation",
    "NHS",
    "https://www.nhs.uk/conditions/constipation/",
  ),
  indoreProfile: source(
    "Indore District",
    "Government of Madhya Pradesh",
    "https://indore.nic.in/",
  ),
  patnaProfile: source(
    "Patna District",
    "Government of Bihar",
    "https://patna.nic.in/",
  ),
  ranchiProfile: source(
    "Ranchi District",
    "Government of Jharkhand",
    "https://ranchi.nic.in/",
  ),
  bhubaneswarProfile: source(
    "Khordha District",
    "Government of Odisha",
    "https://khordha.odisha.gov.in/",
  ),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person's condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when a plan needs review, but it does not replace emergency or specialist medical care.

The article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, neurologist, respiratory team, dietitian, speech-language clinician, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
`;

function articleContent({
  city,
  opening,
  context,
  assessment,
  progression,
  homeSession,
  questions,
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
  questions: string;
  dos: string;
  donts: string;
  safety: string;
}) {
  return `${opening}

### The practical context in this city

${context}

City context is used here only to make the care setting understandable. An address in ${city} does not establish local prevalence, neighbourhood risk, outcome, or confirmed service availability. Two people in the same city may need different plans because their diagnoses, precautions, home layouts, support, and recovery responses differ.

### What a physiotherapist assesses

${assessment}

The assessment is not a formality before an exercise sheet. It separates a familiar rehabilitation problem from a new medical change, identifies the task that matters to the person, and decides what requires supervision or another professional. Reports, medicines, precautions, equipment, fatigue pattern, family observations, and the person's own priorities are part of the clinical picture. Nutrition-led articles may require a dietitian or speech-language clinician; cardiopulmonary articles may require the treating medical team.

### How rehabilitation can progress

${progression}

Progress is not the same as adding distance, repetitions, weight, or intensity on a calendar. It can mean better control, less assistance, improved recovery, safer decision-making, or greater participation in one meaningful task. The clinician should explain what to watch during the activity and afterwards, and when a change means that the plan needs review. A plan may become easier, slower, more supported, or temporarily paused when the response suggests a medical change.

### What to expect from a home physiotherapy session

${homeSession}

A home visit may include observation of a real route, chair, bed, doorway, kitchen, dining area, device, or family routine. It may also include education, coordination with the treating team, and a written plan for tasks that are independent, supervised, or not yet appropriate. A home session does not authorize changing medication, oxygen, food texture, weight-bearing restrictions, fluid advice, or a surgical precaution.

### Questions to take to the care team

${questions}

The most useful record is usually specific and plain-language: what task was attempted, what support was used, what symptoms appeared, how long recovery took, and what happened later that day or the next morning. A record should help the team decide what to examine. It should not become a home diagnostic test or a reason to delay urgent medical care.

### Do

- ${dos}
- Keep a simple record of the task, symptoms, assistance, pause, and recovery that the team has asked you to observe.
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

const indoreMorningMovement = articleContent({
  city: "Indore",
  opening:
    "The first hour after waking can be the hardest part of recovery. A person may need to roll, sit, stand, reach for a walking aid, use the bathroom, and start washing or dressing before stiffness and dizziness have settled. Post-surgery physiotherapy in Indore can turn that morning sequence into separate, reviewable tasks rather than treating it as a single test of strength.",
  context:
    "Useful details include the operation, allowed weight-bearing, wound status, sleep position, pain and swelling overnight, bed height, bathroom route, footwear, walking aid, and who is available to help. An Indore location gives the team a setting for planning but does not prove that every home has the same floor, stairs, furniture, or professional availability. The plan should follow the surgeon's precautions and the person's actual morning.",
  assessment:
    "The therapist may ask how the person slept, whether symptoms change on sitting up, and which movement causes the most uncertainty. They can observe rolling, sitting at the edge of the bed, standing, turning, reaching for the aid, and a short route when permitted. Alertness, blood-pressure symptoms, pain, balance, leg control, and the caregiver's hand position all matter. A wound change, new calf symptom, fainting, or sudden loss of function needs medical review.",
  progression:
    "Practice may begin with one transfer and a pause, using the prescribed aid and a stable surface. The clinician can then add the bathroom route, clothing management, or a short standing task one feature at a time. Progress may mean fewer prompts, safer hand placement, a more predictable response after standing, or a calmer start to the day. It does not mean rushing because the person managed one morning well or changing a restriction without the surgical team.",
  homeSession:
    "A home visit can examine bed height, the route to the bathroom, loose mats, lighting, chair arms, clothing storage, and where the walking aid is placed overnight. The therapist can teach a caregiver how to guard without pulling and can label which steps are independent, supervised, or not yet appropriate. Bring the discharge summary, precautions, medicine list, and any record of overnight symptoms.",
  questions:
    "Ask which movement is protected, whether the person should sit before standing, where the aid should be placed, what the caregiver should do if dizziness appears, and which wound, swelling, or pain change needs a same-day call. Ask whether a video review is enough for a routine check or whether the home needs an in-person assessment.",
  dos:
    "Prepare the route before waking, use the assessed aid and footwear, pause after position changes, and follow the written weight-bearing and wound instructions.",
  donts:
    "Do not pull the operated arm or leg, stand on a slippery floor, hide dizziness to finish the routine, or add stairs and bathing demands before they are assessed.",
  safety:
    "Prompt clinical review is needed for increasing wound drainage, fever, new calf swelling, repeated dizziness, uncontrolled pain, or a new inability to complete a previously allowed transfer. Emergency help is needed for chest pain, severe breathlessness, collapse, or sudden neurological symptoms.",
});

const indoreMedicationNutrition = articleContent({
  city: "Indore",
  opening:
    "A new medicine, a changed dose, nausea, constipation, sleepiness, or a shift in appetite can alter rehabilitation without being a simple nutrition problem. Families in Indore may ask what to add to meals, but the safer first question is what changed, when it changed, and which doctor or dietitian should review the pattern.",
  context:
    "Record the medicine name and timing, appetite, food and drink offered, what was actually eaten, nausea, bowel pattern, alertness, weight trend, swallowing, diabetes or kidney instructions, and the activity that follows a meal. The Indore setting may shape shopping and family routines, but it cannot prescribe a menu or identify a drug effect. The person's discharge papers and current medical instructions remain more important than a generic recovery food list.",
  assessment:
    "A dietitian or doctor may review intake, weight, hydration concerns, constipation, vomiting, blood-sugar instructions, kidney or heart restrictions, and whether a medicine change coincided with the problem. A physiotherapist may assess whether weakness, transfers, or fatigue reduce access to meals. A speech-language clinician may need to review coughing, a wet voice, or food residue. The team should distinguish low appetite from sedation, pain, infection, swallowing difficulty, or another medical change.",
  progression:
    "A useful first step is a short record of timing rather than immediately adding a supplement. The responsible team may adjust meal size, texture, positioning, activity timing, constipation management, or referral while preserving medical restrictions. Progress may mean more reliable meal participation, better communication about side effects, or earlier recognition of a concern. It is not a reason to stop a prescribed medicine, double a supplement, or force food.",
  homeSession:
    "A home session can review the route to the dining place, chair stability, posture, cup and plate access, the time needed to prepare food, and the fatigue that follows a meal. The therapist can document functional barriers for the dietitian or doctor and teach safe positioning within the assessed plan. The visit cannot replace blood tests, medication review, or a swallowing assessment.",
  questions:
    "Ask whether poor appetite may relate to a medicine, pain, constipation, swallowing, infection, or mood; which symptoms should be recorded; whether fluid, salt, sugar, kidney, or heart restrictions apply; and who should decide on a supplement. Ask what degree of reduced intake requires a same-day call.",
  dos:
    "Keep the medicine and meal record together, use the agreed position and assistance, offer familiar foods within the clinical plan, and report a persistent pattern early.",
  donts:
    "Do not stop or change a medicine, start an unreviewed supplement, force food, crush a tablet, or assume every appetite change is a normal part of recovery.",
  safety:
    "Prompt clinical review is needed for repeated vomiting, rapidly falling intake, new swallowing signs, severe constipation, marked sleepiness, confusion, or a significant weight change. Emergency help is needed for choking, severe breathing difficulty, collapse, chest pain, or an acute neurological change.",
});

const indoreOutdoorWalking = articleContent({
  city: "Indore",
  opening:
    "A person may walk safely inside and still feel uncertain at the gate, on an uneven surface, near a parked vehicle, or when stopping to speak. Exercise physiology can help an Indore patient rebuild outdoor walking confidence by examining the whole route, not by assigning a distance that is assumed to be safe for everyone.",
  context:
    "The relevant details are the person's diagnosis, balance, strength, vision, footwear, walking aid, pain, breathlessness, sleep, route surface, traffic or supervision, and the response later that day. A city route may contain several different demands, but an Indore address does not establish a universal terrain or exercise dose. The starting point should be a meaningful short route with a clear return plan.",
  assessment:
    "The clinician may observe the doorway, first turn, stopping, restarting, a change in surface, and a safe alternative when outdoor practice is not appropriate. They ask whether the person can see obstacles, communicate a need to pause, manage the aid, and recover after the effort. Balance, leg control, breathing, exertion, and delayed fatigue may be reviewed when clinically indicated. A fall, fainting, chest symptom, or new neurological sign changes the pathway.",
  progression:
    "The first plan may use a familiar segment with a planned pause and a next-day check. The clinician can then vary route length, surface, carrying, speed, or supervision one at a time. Progress may mean safer stopping, fewer prompts, a predictable recovery, or completing one necessary route without a delayed decline. It does not mean adding distance after every successful walk or exercising through a new symptom.",
  homeSession:
    "A home or online review can examine the threshold, footwear, walking aid, first turn, seating, lighting, and place to recover. A home visit can help the family decide which part of the route is independent, supervised, or not yet appropriate. It does not clear road travel, cycling, or independent outdoor activity after a new medical change.",
  questions:
    "Ask which route segment should be tested first, whether a walking aid or indoor alternative is preferred, how long recovery should be watched, who should supervise, and which symptoms mean the outing should stop. Ask how poor sleep, pain, or a delayed flare changes the next session.",
  dos:
    "Choose a familiar route, keep a planned return point, use the assessed aid, change one demand at a time, and record the next-day response.",
  donts:
    "Do not practise beside traffic alone, add hills and distance together, carry a heavy bag during early practice, or treat confidence as proof that balance risk has resolved.",
  safety:
    "Prompt clinical review is needed for repeated near-falls, new swelling, unusual delayed fatigue, changing pain, or a new dizziness pattern. Emergency help is needed for chest pain, severe breathlessness, fainting, collapse, or sudden neurological symptoms.",
});

const patnaHandUse = articleContent({
  city: "Patna",
  opening:
    "After a neurological event, one hand may be weak, slow, numb, painful, or difficult to position even when the person can move the arm. Opening a container, stabilising a plate, holding clothing, or releasing an object can expose the real problem. Neurological physiotherapy in Patna can connect practice with a household task without treating grip force as the only measure of recovery.",
  context:
    "The useful context is the person's affected side, vision, sensation, shoulder comfort, sitting balance, object shape, table height, dominant hand, and the amount of help a family member gives. A Patna home provides a place to observe the task, not evidence of a shared local outcome. The plan should also account for communication, attention, fatigue, and any advice from the neurologist or stroke team.",
  assessment:
    "The therapist may observe reaching, placing the hand, holding a light object, releasing it, and using both hands for a simple task. They may examine shoulder protection, trunk position, sensation, visual attention, tone, coordination, and the response after repetition. New facial weakness, speech change, severe headache, sudden loss of movement, or a painful swollen shoulder needs urgent medical or specialist review rather than more practice.",
  progression:
    "Practice may begin with a stable object on a supported surface and a clear cue to stop. The clinician can then change object size, reach direction, visual attention, release control, or the number of steps one at a time. Progress may mean less assistance, better timing, safer placement, or completing one meaningful task without a delayed increase in tone or fatigue. It does not mean forcing the hand open or repeating a task after quality has deteriorated.",
  homeSession:
    "A home visit can examine the table, kitchen, clothing area, chair height, object weight, and the caregiver's cueing. The therapist can show how to protect the shoulder, position the arm, and offer only the help that the assessed task needs. They can also identify when occupational therapy, speech-language support, or medical review should be added.",
  questions:
    "Ask which objects are safe, whether the shoulder needs support, how much cueing is useful, what sensation changes to report, and when fatigue means practice should stop. Ask whether the goal is reach, grasp, release, bilateral use, attention, or adapting the task.",
  dos:
    "Use light stable objects, support the arm as instructed, give one clear cue at a time, and stop while movement quality remains safe.",
  donts:
    "Do not pull a weak arm, lift the shoulder overhead without instruction, hide a new sensory change, or use a heavy object to prove that recovery is progressing.",
  safety:
    "Prompt clinical review is needed for increasing shoulder pain, swelling, new numbness, repeated dropping, or a sudden change in attention or movement. Emergency help is needed for facial droop, speech change, severe headache, collapse, chest pain, or sudden one-sided weakness.",
});

const patnaMealAccess = articleContent({
  city: "Patna",
  opening:
    "A person can have enough food available and still be unable to eat reliably after discharge. The barrier may be sitting balance, hand weakness, fatigue, nausea, swallowing, the distance to the kitchen, or the timing of family help. Nutrition planning in Patna should start with what happens before, during, and after the meal rather than with a universal recovery menu.",
  context:
    "Record who shops and cooks, where meals are offered, how the person reaches the table, what assistance is needed, how long eating takes, what is left, coughing or chewing difficulty, medicines, weight trend, and any fluid, diabetes, kidney, or heart instruction. Patna's family routines can shape access, but the city does not establish a single nutrition problem. Medical and discharge advice remains the boundary for changes.",
  assessment:
    "A dietitian or doctor may review intake, weight, appetite, symptoms, restrictions, and the effect of medicines. A physiotherapist may assess transfers, sitting posture, hand access, fatigue, and the route to the dining place. A speech-language clinician may assess swallowing if there is coughing, a wet voice, repeated throat clearing, or food residue. The team should separate access from appetite and both from an acute medical change.",
  progression:
    "The first change may be practical: safer seating, a shorter route, a planned rest, a stable cup, or a different time when the person is more alert. The team may then review portion size, assistance, texture, or referral within the relevant clinical plan. Progress can mean completing part of a meal with less exhaustion or producing a clearer record for the dietitian. It is not a reason to force intake or silently alter food texture.",
  homeSession:
    "A home visit can observe the bed-to-table route, chair stability, lighting, utensil access, kitchen demands, and the way family members offer help. The therapist can document functional barriers and coordinate questions for the doctor, dietitian, or speech-language clinician. A home review cannot decide a fluid restriction, prescribe supplements, or replace a swallowing assessment.",
  questions:
    "Ask whether the main issue is access, posture, fatigue, chewing, swallowing, nausea, constipation, or appetite; what should be recorded; and which professional should decide on texture, supplements, or fluid advice. Ask what change requires same-day review.",
  dos:
    "Keep the meal and symptom record simple, arrange the route and chair before food is served, follow the assessed assistance plan, and report persistent poor intake.",
  donts:
    "Do not force food or drink, change texture without advice, crush medicines into food without checking, or assume that a family member finishing the meal means swallowing was safe.",
  safety:
    "Prompt clinical review is needed for repeated coughing during meals, wet voice, falling intake, vomiting, severe constipation, dehydration concern, or significant weight change. Emergency help is needed for choking, blue lips, severe breathing difficulty, collapse, or an acute neurological change.",
});

const patnaInterruptedSleep = articleContent({
  city: "Patna",
  opening:
    "A poor night's sleep can change balance, attention, pain, breathlessness, appetite, and how much effort a person feels during a familiar exercise. Exercise physiology can help a Patna patient plan activity around recovery without turning sleep loss into a reason to abandon all movement or to push through unsafe fatigue.",
  context:
    "The useful record includes sleep timing, night-time care, pain, toileting, medicines, snoring or breathlessness, food and drink, the planned activity, symptoms during it, and the response later that day. A Patna household may have real caregiving demands, but the city does not identify the cause of poor sleep. New sleep change may need review by the responsible medical team before exercise is progressed.",
  assessment:
    "The clinician may compare a familiar low-demand task on a rested and a poorly rested day, while checking alertness, balance, breathing, pain, exertion, and the ability to follow a stop instruction. They may ask about falls, dizziness, medication changes, mood, and delayed fatigue. A new confusion, fainting, chest symptom, severe breathlessness, or sudden neurological change needs medical assessment rather than conditioning.",
  progression:
    "A plan may begin with mobility, breathing, or a short functional task at the person's most reliable time of day. The clinician can then vary duration, rest, supervision, or task complexity rather than increasing everything together. Progress may mean choosing a safer dose, recovering predictably, or maintaining useful movement during a difficult week. It does not mean using exercise to compensate for unexplained sleep loss or treating one energetic morning as a new baseline.",
  homeSession:
    "A home visit can review the route, lighting, chair, bathroom access, walking aid, night-time obstacles, and where the person rests after activity. The therapist can help the family separate a routine movement plan from a symptom that needs medical or sleep review. The visit cannot diagnose sleep apnoea, change sedating medicine, or clear strenuous exercise.",
  questions:
    "Ask which activity is appropriate after poor sleep, whether supervision should change, how long recovery should be observed, and which night symptoms need medical review. Ask how pain, breathlessness, medicine timing, or repeated toileting changes the plan.",
  dos:
    "Use the day's assessed level of alertness, reduce complexity before removing all movement, plan extra supervision when needed, and record delayed symptoms.",
  donts:
    "Do not exercise near stairs when drowsy, drive while unsafe, use caffeine or supplements to override warning signs, or increase intensity because the person feels briefly better.",
  safety:
    "Prompt clinical review is needed for repeated falls, new confusion, severe daytime sleepiness, worsening breathlessness at night, or a new medicine-related change. Emergency help is needed for chest pain, severe breathing difficulty, fainting, collapse, or sudden neurological symptoms.",
});

const ranchiHouseholdLifting = articleContent({
  city: "Ranchi",
  opening:
    "Returning home after an injury or operation often means lifting a saucepan, laundry basket, pillow, or small package before formal work begins. The question is not simply how many kilograms are safe. Orthopaedic physiotherapy in Ranchi can examine the object, height, reach, turning, repetition, and recovery that make a household load difficult.",
  context:
    "Useful details include the diagnosis or operation, allowed loading, pain, swelling, grip, balance, floor and counter height, object handles, carrying distance, and who can share the task. Ranchi's household context helps identify a real activity but does not prove an occupational cause or establish local home-visit availability. The plan should follow surgical restrictions and the person's assessed control.",
  assessment:
    "The therapist may begin with an empty container or a stable household object and observe squatting or hinging only if permitted, hand placement, trunk control, turning, walking, and setting the object down. They may examine joint movement, strength, balance, sensation, and the response later that day. New deformity, severe swelling, wound change, sudden weakness, or a fall needs medical review before load practice.",
  progression:
    "One demand can change at a time: object shape, height, distance, number of repetitions, speed, or the amount of help. Progress may mean keeping the load close, using a safer route, setting an object down with control, or recovering without a delayed flare. It does not mean testing the maximum load or combining lifting, stairs, and speed because one light object was manageable.",
  homeSession:
    "A home visit can examine shelves, counters, storage height, floor surfaces, handles, baskets, and the place where an object is put down. The therapist can suggest temporary rearrangement and teach a family member how to share a load without pulling or twisting the recovering person. Work clearance, weight limits, and medication decisions remain with the responsible team.",
  questions:
    "Ask which load and movement are allowed, whether the person should use both hands, what turning or reaching is restricted, how to share the task, and what symptom means practice should stop. Ask when the team expects a review before adding weight or repetition.",
  dos:
    "Keep objects close, clear the route, use the prescribed movement pattern, change one load demand at a time, and record the next-day response.",
  donts:
    "Do not lift from a deep or twisted position without assessment, carry a load on stairs to test readiness, hold breath during effort, or ignore delayed swelling or pain.",
  safety:
    "Prompt clinical review is needed for increasing swelling, wound or skin change, new numbness, persistent night pain, or loss of previously allowed movement. Emergency help is needed for chest pain, severe breathlessness, collapse, or sudden neurological symptoms.",
});

const ranchiMealFatigue = articleContent({
  city: "Ranchi",
  opening:
    "Chewing can take effort, and a long meal may expose fatigue that is not obvious during a short clinical conversation. A person may start eating well but become slow, stop early, cough, or need more help as the meal continues. Nutrition review in Ranchi can connect meal pace with swallowing, posture, alertness, appetite, and recovery rather than assuming that the problem is pickiness.",
  context:
    "Record how long meals take, what texture is offered, whether chewing is tiring, coughing or wet voice, posture, mouth care, medicines, appetite, weight trend, and the help available. The Ranchi setting can help the team understand kitchen and family routines, but it does not identify a common local cause. Food texture, fluid, supplements, and swallowing strategies must follow the responsible clinician.",
  assessment:
    "A dietitian or doctor may review intake, weight, illness, medicines, constipation, nausea, and energy needs. A speech-language clinician may assess chewing, oral control, swallowing safety, and the need for texture guidance. Physiotherapy may assess sitting balance, fatigue, head and trunk position, hand function, and the route to the table. A wet voice or repeated cough is a clinical sign to share, not a home test to interpret alone.",
  progression:
    "The first step may be a shorter observed meal or a record of when fatigue appears. The team can then review posture, pacing, rest, assistance, food texture, or referral according to the assessment. Progress may mean participating safely for longer, recognising a stop signal earlier, or giving the clinician better information. It is not a reason to prolong a tiring meal or change texture without advice.",
  homeSession:
    "A home visit can observe the chair, table height, lighting, utensil access, oral-care routine, and the point in the meal where fatigue changes participation. The therapist can coordinate functional observations with the dietitian or speech-language clinician and identify whether transfers or posture are part of the problem. The visit cannot replace a formal swallowing evaluation.",
  questions:
    "Ask whether fatigue is related to chewing, swallowing, posture, breathlessness, medicine, appetite, or another medical issue; what signs to record; and which professional should decide on texture or supplements. Ask what meal change requires same-day review.",
  dos:
    "Use the assessed posture, allow the planned pace and rest, record when symptoms appear, and keep the clinical instructions visible to everyone offering food.",
  donts:
    "Do not rush the meal, force another bite, silently change food texture, offer water as a cure for every cough, or assume a normal-looking appetite proves swallowing is safe.",
  safety:
    "Prompt clinical review is needed for repeated cough, wet voice, food residue, falling intake, weight change, or increasing meal duration. Emergency help is needed for choking, blue lips, severe breathing difficulty, collapse, or an acute neurological change.",
});

const ranchiRoomTurning = articleContent({
  city: "Ranchi",
  opening:
    "Older adults may manage a straight walk but become unsafe when turning from a bedroom toward a bathroom, changing direction around furniture, or responding to a family member calling from another room. Geriatric exercise in Ranchi can practise the decision to slow, look, turn, and recover without treating speed as the goal.",
  context:
    "The relevant details are vision, hearing, footwear, walking aid, dizziness, pain, strength, attention, lighting, floor surface, furniture, urgency, and the person's usual route. A Ranchi home offers a meaningful setting for assessment, but a city address does not establish fall risk or a universal home layout. Medication and medical changes should be shared with the clinician.",
  assessment:
    "The therapist may observe starting, stopping, a wide or narrow turn, backing up, reaching for support, and responding to a simple cue. They may check balance, leg control, vision, sensation, confidence, blood-pressure symptoms, and the use of the walking aid. A new fall, fainting, one-sided weakness, severe dizziness, or sudden confusion requires medical assessment before a turning programme.",
  progression:
    "Practice may start with a large, uncluttered turn and one clear cue, then add a doorway, a change of direction, or a divided-attention demand only when safe. Progress may mean fewer hurried steps, better aid placement, a pause before turning, or completing a route with appropriate supervision. It does not mean making the turn faster or practising alone beside stairs.",
  homeSession:
    "A home visit can examine the bed, bathroom, doorway, furniture, lighting, floor, handholds, footwear, and the place where the person tends to rush. The therapist can help the family agree on a consistent cue and identify which route is independent, supervised, or not yet appropriate. Loose mats and furniture changes should be handled as part of the wider plan, not as a substitute for clinical assessment.",
  questions:
    "Ask which route and aid are safe, whether someone should guard, what cue should be used, how dizziness or urgency changes the plan, and which fall or medication change needs review. Ask what should happen if the person becomes tired halfway through the route.",
  dos:
    "Clear the route, pause before changing direction, use the assessed aid, keep lighting adequate, and practise only at the supervision level agreed with the team.",
  donts:
    "Do not pull the person around a corner, rush because the bathroom is urgent, practise beside stairs alone, or remove the aid to test confidence.",
  safety:
    "Prompt clinical review is needed for repeated near-falls, new dizziness, a medication-related alertness change, increasing weakness, or a new change in walking. Emergency help is needed for a serious fall, head injury, fainting, chest pain, severe breathlessness, or sudden neurological symptoms.",
});

const bhubaneswarMovementSequences = articleContent({
  city: "Bhubaneswar",
  opening:
    "After a stroke, a person may know the goal of a task but lose the sequence: reach before stabilising, turn before moving the feet, or sit without checking the chair. Stroke physiotherapy in Bhubaneswar can break a meaningful task into safe movement decisions without reducing recovery to a list of repetitions.",
  context:
    "The useful setting is the actual task, such as moving from bed to chair, preparing to wash, standing at a counter, or walking to a family space. Observe the affected side, vision, attention, communication, footwear, aid, fatigue, and the support available. A Bhubaneswar address gives a home context but does not establish a shared stroke pattern or confirmed local coverage.",
  assessment:
    "The therapist may observe how the person starts, attends to both sides, places the feet, reaches for support, turns, and responds to a cue. They may examine trunk control, strength, sensation, tone, balance, communication, and the response after repetition. New facial or speech change, sudden weakness, severe headache, collapse, or a new swallowing problem needs urgent medical assessment.",
  progression:
    "Practice may begin with one stable sequence and one cue in a quiet setting. The clinician can then change the object, direction, distance, visual distraction, or amount of help one at a time. Progress may mean starting with less prompting, checking the chair before sitting, using the affected side more safely, or recovering predictably after the task. It does not mean adding speed or distraction before the sequence is reliable.",
  homeSession:
    "A home visit can examine the bed, chair, bathroom, doorway, counter, walking aid, and the place where the sequence breaks down. The therapist can coach family members to give time and one useful cue rather than several competing instructions. Occupational therapy, speech-language support, or medical review may be needed alongside physiotherapy.",
  questions:
    "Ask which part of the task should be practised first, how to cue without taking over, whether the shoulder needs support, what fatigue signs matter, and which change requires urgent review. Ask which steps are independent, supervised, or not yet appropriate.",
  dos:
    "Use one clear task, reduce distractions, give time for the person to respond, protect the affected shoulder, and record which cue or support helped.",
  donts:
    "Do not rush the sequence, pull the weak arm, give several instructions at once, or practise a transfer beside an unstable chair or cluttered route.",
  safety:
    "Prompt clinical review is needed for increasing shoulder pain, repeated near-falls, new coughing with meals, a sudden change in attention, or a new sensory or movement problem. Emergency help is needed for facial droop, speech change, severe headache, collapse, chest pain, or sudden one-sided weakness.",
});

const bhubaneswarRoutineNutrition = articleContent({
  city: "Bhubaneswar",
  opening:
    "Recovery can disrupt the routine that made eating possible. A person may wake later, depend on a different caregiver, miss shopping, eat at an unusual time, or have less energy for cooking and sitting. Nutrition planning in Bhubaneswar should ask which part of the routine changed and whether the barrier is access, appetite, symptoms, or a medical restriction.",
  context:
    "Record meal timing, who prepares and offers food, food and drink actually taken, nausea, bowel pattern, swallowing, weight trend, medicines, activity, and the route to the kitchen or dining place. Bhubaneswar's household and care routines provide context but do not justify a universal menu or supplement. Any fluid, salt, sugar, kidney, heart, or texture instruction must be confirmed with the responsible professional.",
  assessment:
    "A dietitian or doctor may review intake, weight, appetite, medicines, illness, constipation, and the reason the routine changed. A physiotherapist may assess transfers, sitting tolerance, hand function, fatigue, and access to food. A speech-language clinician may assess swallowing when coughing, wet voice, or residue appears. The team should distinguish a schedule problem from a medical change before proposing a nutrition intervention.",
  progression:
    "The first step may be to restore one predictable meal opportunity or make the route and seating safer. The team can then review portion, timing, assistance, texture, shopping support, or referral within the clinical plan. Progress may mean completing a meal with less exhaustion or communicating a problem earlier. It is not a reason to force intake, stop a prescribed restriction, or replace a medical review with a recipe.",
  homeSession:
    "A home visit can examine meal preparation, storage access, the route to the table, chair stability, posture, lighting, and how help is offered. The therapist can separate mobility barriers from swallowing or appetite concerns and share observations with the dietitian, doctor, or speech-language clinician. The visit cannot prescribe fluid, food texture, or medicine changes.",
  questions:
    "Ask which part of the routine needs attention, what should be recorded, whether the person's position or swallowing needs assessment, and who should decide on supplements or texture. Ask what change in intake, weight, alertness, or bowel pattern requires a same-day call.",
  dos:
    "Keep the routine record simple, prepare the route and chair first, follow the assessed assistance plan, and report persistent changes before they become severe.",
  donts:
    "Do not force food, silently change texture, add a supplement because a meal was missed, crush medicines without checking, or assume a family recipe is suitable for every medical restriction.",
  safety:
    "Prompt clinical review is needed for repeated vomiting, falling intake, coughing during meals, wet voice, severe constipation, dehydration concern, or significant weight change. Emergency help is needed for choking, blue lips, severe breathing difficulty, collapse, or an acute neurological change.",
});

const bhubaneswarCardiopulmonaryActivity = articleContent({
  city: "Bhubaneswar",
  opening:
    "After a cardiac or respiratory illness, a familiar activity may become difficult because of breathlessness, fatigue, fear, weakness, or a delayed recovery later in the day. Exercise physiology can help a Bhubaneswar patient monitor the whole response without turning one symptom number into permission to exercise or a reason to stop all movement.",
  context:
    "Relevant details include the diagnosis, medical clearance, oxygen or medication instructions, sleep, food and drink, heat or humidity exposure, route, pace, posture, symptoms during activity, and recovery afterwards. A Bhubaneswar setting may affect comfort, but it does not prescribe a dose or prove that every person's breathlessness has the same cause. The treating medical team sets the boundaries.",
  assessment:
    "The clinician may observe a familiar low-demand task, breathing pattern, posture, speaking ability, pauses, recovery, and the next-day response when appropriate. They ask about chest symptoms, wheeze, cough, swelling, dizziness, fainting, and medicine or oxygen changes. Tests or monitoring may be needed through the medical team. New or rapidly worsening symptoms require medical review before an exercise plan is advanced.",
  progression:
    "The first plan may use a short task with a planned pause, a breathing strategy already approved by the team, and a clear stop rule. One demand can then change at a time: duration, pace, route, posture, rest, or supervision. Progress may mean a more predictable recovery, better pacing, or completing a meaningful task without delayed deterioration. It does not mean pushing through chest symptoms or increasing intensity because a single day felt easier.",
  homeSession:
    "A home visit can examine the route between rooms, chair height, fan or shade access, stairs, walking aid, and the place where the person rests. The therapist can coordinate observations with the respiratory or cardiac team and distinguish a mobility barrier from a new medical symptom. The session does not change oxygen, medication, fluid advice, or exercise clearance.",
  questions:
    "Ask which activity is appropriate, what symptoms require an immediate stop, how long recovery should be observed, whether heat or poor sleep changes the dose, and when the medical team should review the plan. Ask whether an online review is sufficient or whether examination is needed.",
  dos:
    "Use the prescribed medication and equipment plan, choose a controllable task, pause before symptoms escalate, and record both activity and recovery.",
  donts:
    "Do not change oxygen or medicines, train through chest pain or faintness, add heat and distance together, or use a home saturation or pulse reading as a diagnosis.",
  safety:
    "Prompt clinical review is needed for a new cough, wheeze, swelling, unusual fatigue, changing breathlessness, or a longer recovery than usual. Emergency help is needed for chest pain, severe breathing difficulty, blue lips, fainting, collapse, or sudden neurological symptoms.",
});

export const cityJournalBatch10Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-indore-morning-movement",
    slug: "post-surgery-morning-movement-physiotherapy-indore",
    title: "Post-Surgery Physiotherapy in Indore: Making Morning Movement Safer",
    metaTitle: "Post-Surgery Morning Movement Physiotherapy in Indore",
    metaDescription: "A practical Indore guide to safer morning movement after surgery, including bed transfers, bathroom routes, walking aids, precautions, and recovery now.",
    excerpt: "How a home physiotherapy review can break the first hour after surgery into safer, manageable movement decisions.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "indore",
    discipline: "physiotherapy",
    content: indoreMorningMovement,
    sources: [refs.nicePostop, refs.whoPostop, refs.whoRehab, refs.niceRehab, refs.indoreProfile],
  },
  {
    id: "city-journal-indore-medication-nutrition",
    slug: "appetite-medication-changes-rehabilitation-nutrition-indore",
    title: "Nutrition in Indore: Appetite and Medication Changes During Rehabilitation",
    metaTitle: "Appetite & Medication Changes in Indore | Goswami Rehab",
    metaDescription: "A cautious Indore guide to appetite, medicine timing, nausea, constipation, swallowing, meal records, and nutrition review during recovery. Review helps.",
    excerpt: "What to record when a medicine change and altered appetite affect rehabilitation meals without assuming the answer is a supplement.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "indore",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: indoreMedicationNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.nhsConstipation, refs.whoRehab, refs.indoreProfile],
  },
  {
    id: "city-journal-indore-outdoor-walking",
    slug: "outdoor-walking-confidence-exercise-physiology-indore",
    title: "Exercise Physiology in Indore: Rebuilding Confidence on Outdoor Walking Routes",
    metaTitle: "Outdoor Walking Confidence and Exercise Physiology in Indore",
    metaDescription: "A safety-first Indore guide to outdoor walking routes, stopping, walking aids, recovery, supervision, and response-based exercise progression. Needs vary.",
    excerpt: "How exercise physiology can rebuild outdoor walking confidence without prescribing a fixed distance or promising a return date.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "indore",
    discipline: "exercise-physiology",
    content: indoreOutdoorWalking,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceRehab, refs.nicePostop, refs.indoreProfile],
  },
  {
    id: "city-journal-patna-hand-use",
    slug: "one-sided-hand-use-household-tasks-neurological-physiotherapy-patna",
    title: "Neurological Physiotherapy in Patna: One-Sided Hand Use at Home",
    metaTitle: "One-Sided Hand Use and Neurological Physiotherapy in Patna",
    metaDescription: "A practical Patna guide to one-sided hand use, reaching, grasping, release control, shoulder protection, cueing, and safer home practice. Review helps.",
    excerpt: "How neurological physiotherapy can connect one-sided hand recovery with the household task that matters.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "patna",
    discipline: "physiotherapy",
    content: patnaHandUse,
    sources: [refs.niceStroke, refs.whoRehab, refs.niceRehab, refs.whoActivity, refs.patnaProfile],
  },
  {
    id: "city-journal-patna-meal-access",
    slug: "meal-access-after-discharge-rehabilitation-nutrition-patna",
    title: "Nutrition in Patna: Making Meals Accessible After Discharge",
    metaTitle: "Meal Access After Discharge in Patna | Goswami Rehab",
    metaDescription: "A cautious Patna guide to meal access after discharge, posture, fatigue, swallowing, family help, intake records, and nutrition review. Review guides care.",
    excerpt: "How families can separate access, appetite, fatigue, and swallowing questions when meals become difficult after discharge.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "patna",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: patnaMealAccess,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoRehab, refs.patnaProfile],
  },
  {
    id: "city-journal-patna-interrupted-sleep",
    slug: "exercise-planning-interrupted-sleep-rehabilitation-patna",
    title: "Exercise Physiology in Patna: Planning Activity After Interrupted Sleep",
    metaTitle: "Exercise Planning After Interrupted Sleep in Patna",
    metaDescription: "A safety-first Patna guide to activity after interrupted sleep, alertness, balance, recovery monitoring, pacing, and medical boundaries. Review helps.",
    excerpt: "How exercise physiology can adjust activity around poor sleep without overtraining or removing all useful movement.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "patna",
    discipline: "exercise-physiology",
    content: patnaInterruptedSleep,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceRehab, refs.nicePostop, refs.patnaProfile],
  },
  {
    id: "city-journal-ranchi-household-lifting",
    slug: "household-lifting-orthopaedic-physiotherapy-ranchi",
    title: "Orthopaedic Physiotherapy in Ranchi: Returning to Household Lifting",
    metaTitle: "Household Lifting and Orthopaedic Physiotherapy in Ranchi",
    metaDescription: "A practical Ranchi guide to graded household lifting, object height, carrying, turning, load progression, precautions, and recovery. Review guides care.",
    excerpt: "How orthopaedic physiotherapy can assess household lifting without reducing recovery to a single weight limit.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "ranchi",
    discipline: "physiotherapy",
    content: ranchiHouseholdLifting,
    sources: [refs.nicePostop, refs.whoPostop, refs.whoRehab, refs.niceRehab, refs.ranchiProfile],
  },
  {
    id: "city-journal-ranchi-meal-fatigue",
    slug: "chewing-pace-meal-fatigue-rehabilitation-nutrition-ranchi",
    title: "Nutrition in Ranchi: Chewing Pace and Meal Fatigue in Recovery",
    metaTitle: "Chewing Pace & Meal Fatigue in Ranchi | Goswami Rehab",
    metaDescription: "A cautious Ranchi guide to chewing fatigue, meal pace, posture, swallowing questions, intake records, and nutrition review during recovery. Review helps.",
    excerpt: "What families can observe when a person starts a meal well but becomes tired, slow, or unsafe as eating continues.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "ranchi",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: ranchiMealFatigue,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.niceStroke, refs.whoRehab, refs.ranchiProfile],
  },
  {
    id: "city-journal-ranchi-room-turning",
    slug: "safer-room-to-room-turning-geriatric-exercise-ranchi",
    title: "Geriatric Exercise in Ranchi: Safer Turning Between Rooms",
    metaTitle: "Safer Room-to-Room Turning and Geriatric Exercise in Ranchi",
    metaDescription: "A safety-first Ranchi guide to turning between rooms, walking aids, rushing, supervision, fall prevention, and individualized exercise. Review guides care.",
    excerpt: "How geriatric exercise can practise safe turning decisions without treating speed as the goal.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Geriatric Rehabilitation",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "ranchi",
    discipline: "exercise-physiology",
    content: ranchiRoomTurning,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceRehab, refs.niceStroke, refs.ranchiProfile],
  },
  {
    id: "city-journal-bhubaneswar-movement-sequences",
    slug: "stroke-movement-sequences-physiotherapy-bhubaneswar",
    title: "Stroke Physiotherapy in Bhubaneswar: Rebuilding Movement Sequences",
    metaTitle: "Stroke Movement Sequences and Physiotherapy in Bhubaneswar",
    metaDescription: "A practical Bhubaneswar guide to stroke movement sequences, cueing, transfers, affected-side protection, fatigue, and safer home practice. Review helps.",
    excerpt: "How stroke physiotherapy can break a meaningful home task into safe movement decisions rather than a list of repetitions.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "bhubaneswar",
    discipline: "physiotherapy",
    content: bhubaneswarMovementSequences,
    sources: [refs.niceStroke, refs.whoRehab, refs.niceRehab, refs.whoActivity, refs.bhubaneswarProfile],
  },
  {
    id: "city-journal-bhubaneswar-routine-nutrition",
    slug: "daily-routine-change-rehabilitation-nutrition-bhubaneswar",
    title: "Nutrition in Bhubaneswar: When Daily Routines Change During Recovery",
    metaTitle: "Daily Routine & Nutrition in Bhubaneswar | Goswami Rehab",
    metaDescription: "A cautious Bhubaneswar guide to changed routines, meal timing, access, appetite, swallowing, medical restrictions, and nutrition review. Review helps.",
    excerpt: "How to identify whether a changed recovery routine is affecting food access, appetite, symptoms, or the need for clinical review.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "bhubaneswar",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: bhubaneswarRoutineNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoRehab, refs.bhubaneswarProfile],
  },
  {
    id: "city-journal-bhubaneswar-cardiopulmonary-activity",
    slug: "cardiopulmonary-activity-monitoring-exercise-physiology-bhubaneswar",
    title: "Exercise Physiology in Bhubaneswar: Monitoring Activity During Cardiopulmonary Recovery",
    metaTitle: "Cardiopulmonary Activity Monitoring in Bhubaneswar",
    metaDescription: "A safety-first Bhubaneswar guide to activity monitoring after cardiac or respiratory illness, pacing, recovery, symptoms, and clinical boundaries now.",
    excerpt: "How exercise physiology can monitor activity and recovery after cardiopulmonary illness without creating a home clearance rule.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "bhubaneswar",
    discipline: "exercise-physiology",
    content: bhubaneswarCardiopulmonaryActivity,
    sources: [refs.niceCopd, refs.niceRehab, refs.whoActivity, refs.whoRehab, refs.bhubaneswarProfile],
  },
];