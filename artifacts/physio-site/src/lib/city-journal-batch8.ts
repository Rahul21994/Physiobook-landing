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
  niceCritical: source(
    "Rehabilitation after critical illness in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/cg83/chapter/Recommendations",
  ),
  niceStroke: source(
    "Stroke rehabilitation in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations",
  ),
  ahaStroke: source(
    "Guidelines for adult stroke rehabilitation and recovery",
    "American Heart Association/American Stroke Association",
    "https://www.ahajournals.org/doi/10.1161/str.0000000000000098",
  ),
  asaLiving: source(
    "Daily living after stroke",
    "American Stroke Association",
    "https://www.stroke.org/en/life-after-stroke/recovery/daily-living",
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
  atsPulmonary: source(
    "Pulmonary rehabilitation for adults with chronic respiratory disease",
    "American Thoracic Society",
    "https://www.thoracic.org/statements/guideline-implementation-tools/matrix-guidelines-and-derivatives-pulmonary-rehab-in-adults-08-23-23.php",
  ),
  nhlbiPulmonary: source(
    "Pulmonary rehabilitation",
    "National Heart, Lung, and Blood Institute",
    "https://www.nhlbi.nih.gov/health/pulmonary-rehabilitation",
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
  agraProfile: source(
    "Agra District",
    "Government of Uttar Pradesh",
    "https://agra.nic.in/district-profile",
  ),
  prayagrajProfile: source(
    "Prayagraj District",
    "Government of Uttar Pradesh",
    "https://prayagraj.nic.in/",
  ),
  jodhpurProfile: source(
    "Jodhpur District",
    "Government of Rajasthan",
    "https://jodhpur.rajasthan.gov.in/pages/district-detail/30159",
  ),
  udaipurProfile: source(
    "Udaipur District",
    "Government of Rajasthan",
    "https://udaipur.rajasthan.gov.in/",
  ),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person's condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when a plan needs review, but it does not replace emergency or specialist medical care.

The article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, neurologist, respiratory team, dietitian, speech-language clinician, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
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
  questions,
}: {
  opening: string;
  context: string;
  assessment: string;
  progression: string;
  homeSession: string;
  dos: string;
  donts: string;
  safety: string;
  questions: string;
}) {
  return `${opening}

### The practical context in this city

${context}

City context is used here only to make the care setting understandable. An Agra, Prayagraj, Jodhpur, or Udaipur address does not establish local prevalence, neighbourhood risk, outcome, or confirmed service availability. Two people in the same city may need different plans because their diagnoses, precautions, home layouts, support, and recovery responses differ.

### What a physiotherapist assesses

${assessment}

The assessment is not a formality before an exercise sheet. It separates a familiar rehabilitation problem from a new medical change, identifies the task that matters to the person, and decides what requires supervision or another professional. Reports, medicines, precautions, equipment, fatigue pattern, family observations, and the person's own priorities are part of the clinical picture. Nutrition-led articles may require a dietitian or speech-language clinician; cardiopulmonary articles may require the treating medical team.

### How rehabilitation can progress

${progression}

Progress is not the same as adding distance, repetitions, weight, or intensity on a calendar. It can mean better control, less assistance, improved recovery, safer decision-making, or greater participation in one meaningful task. The clinician should explain what to watch during the activity and afterwards, and when a change means that the plan needs review. A plan may become easier, slower, more supported, or temporarily paused when the response suggests a medical change.

### What to expect from a home physiotherapy session

${homeSession}

A home visit may include observation of a real route, chair, bed, doorway, vehicle transfer, kitchen, dining area, device, or family routine. It may also include education, coordination with the treating team, and a written plan for tasks that are independent, supervised, or not yet appropriate. A home session does not authorize changing medication, oxygen, food texture, weight-bearing restrictions, fluid advice, or a surgical precaution.

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

const agraCarTransfer = articleContent({
  opening:
    "After surgery, the first car journey home can reveal a problem that a level hallway does not. Getting close to the seat, turning without twisting, lowering into the vehicle, and standing again are separate tasks. A home physiotherapy review for an Agra family can prepare those decisions without treating one successful transfer as proof that every journey is safe.",
  context:
    "Agra's profile includes post-surgery, knee-replacement, stroke, and neurological rehabilitation pathways. The useful context is the operation or diagnosis, allowed loading, wound status, pain, dizziness, the vehicle height, door opening, route from the entrance, footwear, walking aid, and who will provide help. Transport difficulty is a reason to plan and ask for review; it is not evidence that a particular local service or recovery outcome is assured.",
  assessment:
    "The therapist may first observe approach, turning, backing up, hand placement, and sitting on a stable chair before discussing the car. They may then look at the actual vehicle or a safe simulation: how far the person must turn, whether the operated limb can be positioned, whether the door can remain open, and where the caregiver can stand. Strength, balance, pain, dizziness, alertness, communication, and the use of an aid matter. A sudden loss of function, wound change, new calf symptoms, chest symptoms, or a fall changes the pathway to medical review.",
  progression:
    "Practice may begin with a stable chair and a rehearsed sequence: approach, pause, turn, reach for a stable support, lower with control, and reposition. The clinician may then review a higher or lower seat, a short vehicle approach, the return from sitting, and the route from the entrance one feature at a time. Progress may mean fewer prompts, safer hand placement, or a predictable recovery after the transfer. It does not automatically clear a long journey, a low vehicle, a crowded entrance, or carrying luggage.",
  homeSession:
    "A home visit can examine the entrance, steps, threshold, vehicle door, seat height, walking aid, and the place where the person will pause. The therapist can teach the caregiver where to stand and what not to pull, and can write down which parts of the journey are independent, supervised, or not yet appropriate. Families should bring the discharge summary, restrictions, medication list, and details of the planned journey.",
  questions:
    "Ask which movements are restricted, whether the person may use the car seat or a cushion, how the aid should be handled, what the caregiver should do if the person cannot stand, and which symptoms mean the journey should be postponed for medical advice. Ask whether a teleconsultation can review the plan or whether an in-person assessment is needed.",
  dos:
    "Plan the route and seat before the day, use the assessed aid and guarding position, allow pauses, and carry the written restrictions with the family member responsible for transport.",
  donts:
    "Do not pull the operated limb, twist quickly into a low seat, lift the person under the arms, place luggage where it blocks the exit, or treat a brief transfer as permission for an unreviewed trip.",
  safety:
    "Any of these symptoms needs prompt medical advice: increasing wound pain or drainage, fever, new calf swelling, uncontrolled pain, repeated dizziness, or a sudden inability to bear the previously allowed load. Any of these situations needs emergency help: chest pain, severe breathlessness, collapse, or sudden neurological symptoms.",
});

const agraRecoveryNutrition = articleContent({
  opening:
    "When recovery includes fatigue, pain, limited walking, or a planned follow-up trip, eating can become irregular even when the family is trying to help. The useful nutrition question is not which single food promises healing. It is what has changed in appetite, access, chewing, symptoms, assistance, and routine, and which professional should review that change.",
  context:
    "Agra's post-surgery and neurological rehabilitation profile provides a setting for coordinating nutrition with function. Relevant details include the operation or diagnosis, appetite, weight trend, nausea, bowel pattern, swallowing, medicines, diabetes or kidney instructions, usual foods, who prepares meals, and whether the person can reach the dining area safely. A district profile does not establish one local nutrition problem or one menu for recovery.",
  assessment:
    "A dietitian or doctor may ask what was offered, what was eaten, what was left, how long meals take, whether nausea or constipation is limiting intake, and whether a medical restriction is active. A speech-language clinician may assess swallowing when coughing, wet voice, or food residue is present. Physiotherapy may assess sitting balance, transfers, safe access to the table, and the energy cost of meal participation. Weight change can be important, but it does not identify the cause on its own.",
  progression:
    "The first step may be a short record of meals, drinks, symptoms, assistance, posture, and later fatigue. The team may then change the place or timing of a meal, the way help is offered, the route to the dining area, or the referral pathway. Progress may mean participating in part of a meal routine, completing a meal with less exhaustion, or producing a clearer report for the dietitian. It is not a reason to begin supplements, remove foods, or impose a universal protein or calorie target.",
  homeSession:
    "A home session can observe the route from bed or chair to the dining place, the chair height, lighting, table reach, kitchen access, and how the family offers help. The therapist can separate a mobility barrier from an intake or swallowing concern and coordinate questions for the surgeon, doctor, dietitian, or speech-language clinician. Families should bring discharge papers, medicines, recent weights if available, and the intake record.",
  questions:
    "Ask whether the concern is intake, swallowing, chewing, nausea, constipation, access, or fatigue; what should be recorded; whether any fluid, diabetes, kidney, or heart restriction applies; and which professional should decide on supplements or food texture. Ask what change would require a same-day call rather than a routine review.",
  dos:
    "Record observable changes without judging them, keep medical instructions accessible, arrange meals around the assessed mobility, and report persistent poor intake or weight change early.",
  donts:
    "Do not start a supplement, force food or drink, silently change food texture, remove a food group, crush medicines, or change medicine timing without the responsible clinical team.",
  safety:
    "Any of these symptoms needs prompt clinical review: repeated vomiting, coughing during meals, a wet voice, rapidly falling intake, dehydration concern, severe constipation, or a significant weight change. Any of these situations needs emergency help: severe breathing difficulty, blue lips, collapse, or an airway emergency.",
});

const agraTravelConditioning = articleContent({
  opening:
    "A travel or appointment day can contain more exertion than a planned walk: dressing, moving to the entrance, waiting, sitting, standing again, and recovering after the return home. Exercise physiology can help a person and family examine that whole sequence. The goal is not to promise that a person will tolerate a journey by a certain date.",
  context:
    "Agra's profile includes post-surgery, neurological, knee-replacement, and geriatric rehabilitation. The relevant context is the person's usual activity, recent discharge, sleep, nutrition, pain, balance, breathlessness, alertness, transport demands, seating, and access to help. A city or route does not provide a universal conditioning target, and the same distance can have different demands for two people.",
  assessment:
    "The clinician may map the day from bed to doorway, waiting area, vehicle, appointment chair, and return. They may observe sit-to-stand, turning, a short walk with the prescribed aid, carrying only a safe personal item, breathing recovery, and the response later that day. They ask about near-falls, dizziness, delayed fatigue, pain, chest symptoms, and whether the person can communicate a need to pause. Heart rate, blood pressure, or exertion ratings may be used when indicated, but this article does not create home cut-offs.",
  progression:
    "The plan may start with one part of the day and a planned recovery observation. The clinician can then change route length, waiting time, seating, assistance, or the order of tasks one at a time. Progress may mean more reliable preparation, fewer prompts, a safer pause, or no delayed decline after a meaningful outing. A reduction in activity can be the correct progression when a new symptom or medical change appears.",
  homeSession:
    "A home visit can observe dressing access, the entrance, steps or thresholds, the vehicle approach, the preferred chair, and where the person can recover. The therapist may help the family write a travel sequence with independent, supervised, and not-yet-appropriate steps. The plan should include what to do if the person becomes unwell rather than relying on willpower.",
  questions:
    "Ask what part of the day should be practised first, how much help is safe, where the person should pause, how later fatigue should be recorded, and which symptoms mean the appointment plan needs medical review. Ask whether the treating surgeon, neurologist, respiratory clinician, or physiotherapist should clear a specific demand.",
  dos:
    "Practise the smallest meaningful part of the planned day, keep recovery time visible, use prescribed equipment, and record the next-day response as well as the successful task.",
  donts:
    "Do not add distance, stairs, carrying, and waiting time all at once, skip prescribed recovery, exercise through chest or neurological symptoms, or use a travel deadline to override a medical restriction.",
  safety:
    "Any of these symptoms needs urgent medical assessment: fainting, chest pain, severe breathlessness, new neurological signs, collapse, a fall with injury, or rapidly worsening weakness. Repeated near-falls or a new dizziness pattern should be reported before the plan advances.",
});

const prayagrajDressing = articleContent({
  opening:
    "Dressing after a neurological injury can involve attention, sitting balance, one-sided weakness, vision, sensation, sequencing, and communication. A person may have enough strength for one part of the task but need help when a sleeve, fastener, or change of position interrupts the sequence. A Prayagraj home physiotherapy assessment can study that task without reducing independence to speed.",
  context:
    "Prayagraj's profile includes stroke, neurological, post-surgery, geriatric, and pulmonary rehabilitation. The useful home details are the chair or bed, clothing storage, lighting, mirror position, affected side, shoulder protection, continence needs, fatigue, communication method, and where the caregiver can stand. The district setting does not establish one pattern of neurological disability or one safe dressing method.",
  assessment:
    "The therapist may observe how the person chooses clothing, attends to both sides, sits, reaches, threads a sleeve, manages a fastener, stands, and communicates when help is needed. They may assess trunk control, shoulder movement, sensation, vision, attention, planning, language, balance, pain, and fatigue. Occupational therapy or speech-language input may be appropriate when the main barrier is task planning, communication, or self-care rather than strength. A sudden change in speech, vision, alertness, or one-sided strength needs emergency assessment.",
  progression:
    "Practice may begin with a stable seat, one garment, and a clear sequence using the person's strongest communication cue. The clinician may then change clothing position, add a sleeve or fastener, review a standing step, or reduce prompts only when the earlier part is consistent. Progress can mean safer shoulder positioning, better attention to the affected side, fewer prompts, or telling the caregiver what help is wanted. It does not mean rushing or leaving a person alone before the task has been assessed.",
  homeSession:
    "A home visit can examine the real bed, chair, wardrobe, floor surface, mirror, clothing, and route to the bathroom. The therapist can show a caregiver how to offer a cue without taking over and document which steps are independent, supervised, or not yet appropriate. Equipment and clothing changes should fit the person's clinical plan and not be treated as a substitute for a neurological review.",
  questions:
    "Ask which side should be protected, whether dressing should happen sitting or standing, what cue the person understands, how the caregiver should respond to a pause, and whether occupational therapy or speech-language review is needed. Ask what new weakness, pain, neglect, or confusion should trigger medical contact.",
  dos:
    "Lay out one manageable clothing sequence, allow time for the person to initiate, use the agreed cue, and protect the affected shoulder and balance during each position change.",
  donts:
    "Do not pull an affected arm through a sleeve, give several instructions at once, leave the person standing while searching for clothing, or treat a fast dressing attempt as a safe one.",
  safety:
    "Any of these changes needs immediate medical assessment: sudden change in strength, speech, vision, alertness, swallowing, or balance. Seek prompt advice after a fall, shoulder injury, new severe pain, repeated loss of balance, or a new continence change.",
});

const prayagrajMealTolerance = articleContent({
  opening:
    "A person recovering from a respiratory or neurological illness may stop a meal because breathing becomes effortful, attention fades, chewing takes longer, or sitting upright is tiring. Those observations do not identify the right diet by themselves. A Prayagraj nutrition review should first separate meal completion, posture, swallowing, breathlessness, and fatigue so the responsible professional can answer the correct question.",
  context:
    "Prayagraj's profile includes stroke, neurological rehabilitation, COPD and pulmonary rehabilitation, and post-surgery care. Relevant context includes the diagnosis, inhaler or oxygen instructions, swallowing history, communication, alertness, posture, appetite, weight trend, usual food, meal duration, medicines, and who supervises eating. The district portal does not establish a shared respiratory or nutrition risk.",
  assessment:
    "The team may ask whether breathlessness occurs before, during, or after eating, whether coughing or a wet voice appears, whether food remains in the mouth, how much is left, and whether fatigue changes the final part of the meal. A speech-language clinician may assess swallowing, a dietitian may assess intake and nutrition risk, and the physiotherapist may review sitting balance, reach, transfers, and the energy cost of the meal routine. The team should also know about fever, chest change, vomiting, dehydration, and rapid weight change.",
  progression:
    "The first step may be a record of posture, food or fluid attempted, assistance, interruptions, symptoms, and recovery. The team may then change seating, meal timing, supervision, utensil setup, breathing recovery, or referral according to the findings. Progress may mean remaining positioned, completing one part of the routine, or producing a clearer response pattern. It is not a reason to force intake, change fluid thickness, or assume that breathlessness during a meal is only a nutrition issue.",
  homeSession:
    "A home session can observe the dining chair, table height, lighting, plate position, kitchen route, and how the caregiver offers help. The therapist can identify whether transfers, sitting, or reach are limiting participation while coordinating unresolved swallowing and respiratory questions. A simple record supports review; it does not authorize a home swallowing test or changes to oxygen and medication.",
  questions:
    "Ask whether the priority is swallowing safety, nutrition risk, respiratory recovery, posture, or access; what symptoms should be recorded; whether a dietitian or speech-language clinician should review the person; and what change should prompt urgent medical advice. Ask which instructions must come from the respiratory or medical team.",
  dos:
    "Keep prescribed respiratory and swallowing instructions available, supervise as advised, record interruptions and recovery, and report a changed meal pattern early.",
  donts:
    "Do not force food or drink, silently thicken fluids, change oxygen, crush medicines, remove foods, or interpret a wet voice or repeated cough as a normal training response.",
  safety:
    "Any of these symptoms needs prompt clinical review: repeated choking, wet voice, coughing during meals, breathing difficulty after eating, rapidly falling intake, dehydration concern, or new confusion. Any of these situations needs immediate help: severe breathing difficulty, blue lips, collapse, or an airway emergency.",
});

const prayagrajNeuroConditioning = articleContent({
  opening:
    "Neurological conditioning may need to fit a useful household task rather than a gym-style test. Standing, turning to a surface, reaching for a light object, and sitting again can show how strength, attention, balance, and recovery interact. In Prayagraj, exercise physiology can study short bouts without turning one performance into a universal prescription.",
  context:
    "Prayagraj's neurological and stroke rehabilitation context may include weakness, sensory change, neglect, visual difficulty, fatigue, pain, communication changes, and fear of falling. The clinician needs the person's previous role, aid, footwear, route, sleep, medicines, nutrition, falls, and medical restrictions. A city or family routine does not predict a shared conditioning level.",
  assessment:
    "The clinician may observe a repeated but meaningful task with planned pauses, noting foot placement, trunk control, use of the stronger side, breathing, alertness, cue response, and the later effect. They may ask about dizziness, chest symptoms, pain, near-falls, new neurological signs, and whether the person can recognize when to stop. Heart rate, blood pressure, or exertion ratings may be considered when clinically indicated, but the article does not create a home threshold.",
  progression:
    "The plan may start with one short task and a stable support, followed by observation during recovery and later in the day. The clinician may then change the number of transitions, the route, the object, the pause location, or the amount of cueing one feature at a time. Progress can mean more reliable initiation, safer turns, less assistance, or participation without delayed deterioration. A pause or reduction is useful information, not failure.",
  homeSession:
    "A home visit can identify the chair, surface, route, aid, lighting, and place where a caregiver can guard without pulling. The therapist may teach the family how to record task, cue, pause, symptom, and later response, and may coordinate occupational therapy, speech-language, vision, or medical review when the barrier is not simply conditioning.",
  questions:
    "Ask which task is meaningful enough to practise, what should count as a pause, how the caregiver should guard, what later response matters, and whether a new symptom belongs with the neurologist or another clinician. Ask how the exercise plan will be reviewed rather than copied from a generic video.",
  dos:
    "Use a clear task and stable support, allow recovery between short bouts, use the agreed cue, and record changes that appear later rather than only counting successful repetitions.",
  donts:
    "Do not add speed and complexity together, practise near stairs without the guarding plan, hold the affected arm, or treat fatigue and loss of attention as problems to push through.",
  safety:
    "Any of these changes needs immediate medical assessment: sudden change in strength, speech, vision, alertness, or balance. Seek prompt advice after a fall, repeated near-falls, new severe pain, fainting, chest symptoms, or a new pattern of dizziness.",
});

const jodhpurBedChair = articleContent({
  opening:
    "After surgery, moving from lying to sitting and then from a chair to standing may be harder than a person expects. Pain, lines or dressings, weakness, dizziness, a low chair, and the position of a walking aid can alter the whole sequence. A Jodhpur home physiotherapy review can examine that transfer as a coordinated task rather than handing a family a generic lifting technique.",
  context:
    "Jodhpur's profile includes post-surgery, stroke, neurological, COPD, and orthopaedic rehabilitation. Useful context includes the operation, weight-bearing advice, wound, pain, blood-pressure symptoms, bed and chair heights, footwear, aid, floor surface, and who is available to help. A familiar home or district setting does not establish that a transfer is safe or that a caregiver should perform it without assessment.",
  assessment:
    "The therapist may observe rolling or repositioning, sitting at the edge of the bed, pausing for dizziness, placing the feet, rising from the chair, and turning to the next surface. They may assess leg and trunk control, upper-limb precautions, sensation, balance, alertness, breathing, pain, and the caregiver's position. They should also review whether the person can communicate a need to stop. A fall, wound change, sudden weakness, fainting, or new chest symptom requires a different pathway.",
  progression:
    "Practice may begin with a stable bed edge and a high, firm chair using the assessed support. The clinician may then review a lower surface, a turn, the route to the bathroom, or a different time of day when the first movement is consistent. Progress can mean better preparation, a safer pause, less pulling, or a predictable recovery after sitting and standing. It does not mean lifting the person, removing a restriction, or practising an unassessed floor transfer.",
  homeSession:
    "A home visit can examine the actual bed, chair, mat, walking aid, bathroom route, and caregiver position. The therapist can show how to offer contact without pulling an operated limb and can document which steps are independent, supervised, or not yet appropriate. Families should bring the operation note, restrictions, medication list, and any record of dizziness or near-falls.",
  questions:
    "Ask whether the person may roll, push through an arm, bear weight, or use a particular chair; how long to pause after sitting; where the caregiver should stand; and what to do if the person cannot rise. Ask whether the surgeon or medical team needs to review dizziness, pain, or wound changes before practice continues.",
  dos:
    "Prepare the surface and aid first, use the assessed sequence, pause after position changes, and let the person communicate before the caregiver adds help.",
  donts:
    "Do not lift under the arms, pull a walking aid toward the person, rush from lying to standing, use a low unstable chair, or practise a floor recovery without assessment.",
  safety:
    "Any of these symptoms needs prompt medical advice: increasing wound pain or drainage, fever, repeated dizziness, new calf swelling, uncontrolled pain, or a sudden inability to perform a previously allowed transfer. Any of these situations needs emergency help: chest pain, severe breathlessness, collapse, or sudden neurological symptoms.",
});

const jodhpurNutritionTiming = articleContent({
  opening:
    "When a person is recovering from surgery or respiratory illness, appetite and energy may vary across the day. A family may notice that breakfast is manageable but a later meal is not, or that medicines, nausea, fatigue, and mobility change the routine. A Jodhpur nutrition discussion should document that pattern before anyone changes supplements, food texture, or medication timing.",
  context:
    "Jodhpur's profile includes post-surgery, orthopaedic, neurological, and COPD or pulmonary rehabilitation. Relevant context includes diagnosis, medicines, appetite, nausea, bowel pattern, cough or sputum, weight trend, swallowing, diabetes or kidney advice, meal duration, and who shops or prepares food. A district profile does not establish a shared local nutrition pattern or a universal recovery menu.",
  assessment:
    "The dietitian or doctor may review intake, symptoms, weight change, medical restrictions, medicines, hydration advice, and the reason a meal is being missed. A speech-language clinician may assess swallowing when coughing or a wet voice is present. Physiotherapy may assess whether transfers, standing, reach, or breathlessness make the meal routine difficult. The team should distinguish an access problem from a nutrition problem and an acute medical change from an ordinary variation in appetite.",
  progression:
    "The first step may be a time-linked record of what was offered, what was taken, symptoms, assistance, posture, and recovery. The team may then change the place, timing, preparation support, or referral while preserving the medical instructions already given. Progress can mean a more predictable routine, clearer communication with the dietitian, or safer participation in one meal step. It is not a reason to set a fixed calorie, protein, fluid, or supplement target at home.",
  homeSession:
    "A home session can observe the route to the dining area, chair, table reach, kitchen access, storage, and the movement required to sit or carry a plate. The therapist can prepare a functional handover while the dietitian, doctor, surgeon, or respiratory team answers clinical nutrition and medication questions. Families should bring medicines, discharge papers, restrictions, and the time-linked record.",
  questions:
    "Ask whether the pattern suggests poor intake, nausea, constipation, swallowing difficulty, breathlessness, fatigue, or a medication issue; which professional should review it; what should be recorded; and which symptoms require same-day medical advice. Ask before changing a supplement or timing a medicine around meals.",
  dos:
    "Record timing and observable symptoms, keep restrictions visible, plan support for the hardest part of the day, and report a persistent change in intake or weight.",
  donts:
    "Do not add a supplement, use laxatives, change fluid advice, alter diabetes or respiratory medicines, or assume an appetite dip is safe without considering the wider clinical picture.",
  safety:
    "Any of these symptoms needs prompt clinical review: repeated vomiting, severe constipation or abdominal pain, rapidly falling intake, dehydration concern, new swallowing signs, fever with wound change, or a significant weight change. Any of these situations needs emergency help: collapse, severe breathing difficulty, chest pain, or an acute medical change.",
});

const jodhpurHomeSpaceExercise = articleContent({
  opening:
    "An exercise plan has to fit the space in which it will actually be used. A narrow route, a chair that is too low, a bed placed near a wall, or a family routine that changes through the day can alter the task more than the exercise name does. In Jodhpur, exercise physiology can adapt the setup while keeping the person's energy and medical boundaries visible.",
  context:
    "Jodhpur's rehabilitation profile includes neurological, post-surgery, orthopaedic, and pulmonary pathways. The useful details are the available floor space, chair and bed heights, walking aid, footwear, lighting, time of day, sleep, nutrition, pain, breathlessness, and who can supervise. The city does not establish one household size, climate response, energy level, or training dose.",
  assessment:
    "The clinician may observe the proposed movement in the real space, including how the person gets into position, reaches a support, turns, rests, and leaves the area. They may assess balance, joint control, breathing, alertness, communication, fatigue, pain, and the response later that day. When indicated, clinical measures may guide the plan, but a home article cannot set universal blood-pressure, oxygen, heart-rate, or exertion cut-offs.",
  progression:
    "The plan may begin with a safer setup rather than a harder movement: a higher chair, a clear route, a stable support, or a shorter practice window. The clinician can then review one change in task, duration, assistance, or recovery at a time. Progress can mean the person can prepare the space, use the support safely, and recover predictably. It does not mean filling every available space with exercises or progressing because the calendar changed.",
  homeSession:
    "A home visit can look at the preferred practice area, the route to a chair, the position of furniture, and the place where a caregiver can help. The therapist may provide a written plan with independent, supervised, and paused activities and explain how to record a delayed response. The family can bring the medical restrictions and the movements that have caused uncertainty.",
  questions:
    "Ask which space is safe, what should be moved temporarily, what support is acceptable, how much supervision is needed, and what later response should cause a review. Ask whether pain, breathlessness, dizziness, or a new neurological sign belongs with the treating medical team before exercise is changed.",
  dos:
    "Clear and test the practice space, use the assessed support, choose a time when the person is alert, and record the effect later rather than judging the plan by one session.",
  donts:
    "Do not exercise beside an unguarded step, use a loose piece of furniture, add complexity because the room feels familiar, or treat limited space as a reason to ignore balance and breathing responses.",
  safety:
    "Any of these symptoms needs urgent medical assessment: fainting, chest pain, severe breathlessness, new neurological signs, collapse, a fall with injury, or rapidly worsening weakness. Stop and seek prompt advice for a new dizziness pattern, repeated near-falls, or pain that changes sharply.",
});

const udaipurCaregiverTransfers = articleContent({
  opening:
    "Caregivers often ask where to place their hands when a person needs help to move from bed to chair or stand for a short task. The safest answer depends on the person's diagnosis, strength, weight-bearing advice, communication, and the exact transfer. A Udaipur home physiotherapy review can teach a shared sequence without turning the caregiver into a lifting device.",
  context:
    "Udaipur's profile includes post-surgery, stroke, neurological, geriatric, and knee-replacement rehabilitation. Relevant details include the person's affected side, shoulder or limb precautions, bed and chair heights, footwear, floor surface, aid, alertness, pain, dizziness, and how the person signals for help. A caregiver's good intention does not establish that a transfer is safe or that two people should lift without instruction.",
  assessment:
    "The therapist may observe communication, preparation, foot placement, forward movement, push from the surface, standing balance, turning, and controlled sitting. They may assess trunk and leg control, sensation, vision, attention, pain, fatigue, and the caregiver's ability to move without twisting or pulling. The clinician should identify whether an aid, occupational therapy input, equipment review, or medical assessment is needed. A sudden change in ability is not a routine handling problem.",
  progression:
    "Practice may begin with the person explaining the next step and the caregiver using one agreed cue. The clinician may then review a different chair height, a turn, a short route, or a time when fatigue is greater. Progress can mean clearer communication, better preparation, less pulling, or a controlled pause. It does not mean adding speed, carrying a person, or practising an unassessed transfer from the floor.",
  homeSession:
    "A home visit can examine the actual bed, chair, toilet route, aid, footwear, and space around the transfer. The therapist can demonstrate where the caregiver should stand, what contact is appropriate, and when to stop and seek more help. The family should bring discharge precautions and describe transfers that have led to pain, near-falls, or disagreement.",
  questions:
    "Ask what the person should do first, where the caregiver may make contact, whether the person may push from the surface, how many helpers are required, and what to do if the transfer stops halfway. Ask about equipment and occupational therapy if the space cannot support the agreed technique.",
  dos:
    "Prepare the route, explain one step at a time, use the assessed contact and aid, and agree on a stop word or signal before movement begins.",
  donts:
    "Do not pull an affected arm, lift under the armpits, twist while holding the person, improvise with an unstable chair, or continue after the caregiver loses control.",
  safety:
    "Any of these changes needs immediate medical assessment: sudden change in strength, speech, vision, alertness, swallowing, or balance. Seek prompt advice after a fall, new severe pain, shoulder injury, repeated near-falls, fainting, or a new inability to complete a previously assessed transfer.",
});

const udaipurGeriatricMealAccess = articleContent({
  opening:
    "For an older adult, a nutrition problem may begin before the first bite. Reaching the table, opening a container, chewing for a long time, staying upright, or asking for help can determine what is actually eaten. A Udaipur review should describe those access and chewing observations without assuming that every change is solved by a larger portion or a supplement.",
  context:
    "Udaipur's profile includes geriatric, post-surgery, stroke, neurological, and knee-replacement rehabilitation. Useful context includes oral health, chewing, swallowing history, medicines, cognition, appetite, weight trend, mobility, continence, fatigue, fluid advice, and who offers meals. The city does not establish a shared geriatric nutrition risk or a universal fluid and food plan.",
  assessment:
    "A dietitian or doctor may ask what is offered, what is taken, how long chewing takes, whether food is pocketed, whether the person coughs or has a wet voice, and whether assistance changes the amount eaten. A speech-language clinician may assess swallowing. Physiotherapy may examine sitting balance, reach, transfers, and the route to the dining area. Dental or medical review may be relevant when pain, loose teeth, dry mouth, or medicine effects change eating.",
  progression:
    "The first step may be a record of time, posture, food offered, chewing difficulty, assistance, symptoms, and amount taken. The team may then change access, seating, utensils, supervision, meal timing, or referral. Progress may mean the person can participate in serving, stay positioned, communicate a need for help, or complete a safer part of the routine. It is not permission to silently alter texture, force intake, or change fluid restrictions.",
  homeSession:
    "A home session can examine the chair, table, plate and cup position, lighting, food storage, route, and the way a caregiver offers help. The therapist can identify whether mobility and posture are limiting participation while the dietitian, doctor, dentist, or speech-language clinician answers nutrition, oral, and swallowing questions. Families should bring medicines, restrictions, recent weights, and the meal record.",
  questions:
    "Ask whether the concern is access, chewing, swallowing, appetite, cognition, or a medical restriction; which professional should assess it; what signs should be recorded; and whether the person should be supervised for the whole meal. Ask before changing food texture, fluids, supplements, or medicine timing.",
  dos:
    "Make the agreed support reachable, allow time for chewing and communication, record observable changes, and report a new or persistent intake pattern early.",
  donts:
    "Do not force a meal, silently thicken a drink, remove foods, start supplements, change fluid advice, or interpret coughing and pocketing as an ordinary part of ageing.",
  safety:
    "Any of these symptoms needs prompt clinical review: repeated choking, a wet voice, food pocketing, new confusion, marked dizziness, dehydration concern, rapidly falling intake, or a significant weight change. Any of these situations needs emergency help: severe breathing difficulty, blue lips, collapse, or an airway emergency.",
});

const udaipurWalkingRoute = articleContent({
  opening:
    "A walking aid can make a route possible, but confidence does not come from holding the aid once. The person must approach the aid, start, turn, pause, manage a doorway, and sit or recover without losing control. An Udaipur exercise-physiology review can connect aid use with one meaningful household route without prescribing a universal balance programme.",
  context:
    "Udaipur's profile includes geriatric, stroke, neurological, post-surgery, and knee-replacement rehabilitation. The relevant details are the diagnosis, weight-bearing advice, aid fit, footwear, vision, sensation, balance, pain, fatigue, route surface, doorway, chair, and caregiver position. The city or a familiar home route does not prove that the person's current aid and speed are safe.",
  assessment:
    "The clinician may observe standing with the aid, starting, stopping, turning, approaching a doorway, managing a change in surface, and returning to a stable chair. They may assess foot placement, trunk control, grip, vision, attention, breathing, dizziness, pain, and the response later in the day. They should check whether the aid is fitted and used according to the treating team's instructions rather than assuming a borrowed device is appropriate.",
  progression:
    "Practice may begin with one clear route and a planned pause point. The clinician may then add a turn, a doorway, a different surface, or a longer recovery observation one feature at a time. Progress can mean safer aid placement, fewer prompts, a deliberate stop, or more reliable communication when help is needed. It does not mean increasing distance, carrying items, or practising near stairs before the route is assessed.",
  homeSession:
    "A home visit can map the route from bed to chair, bathroom, or dining area; inspect the aid, footwear, thresholds, lighting, and chair; and teach a caregiver where to stand. The therapist can document which parts are independent, supervised, or not yet appropriate and can recommend an equipment or vision review when mobility is not the only barrier.",
  questions:
    "Ask whether the aid is fitted, which hand should hold it, where the person should pause, how to manage the doorway, and what the caregiver should do if balance is lost. Ask what symptoms or falls require medical review before the route is practised again.",
  dos:
    "Use the fitted aid and assessed route, pause before turns and thresholds, keep one hand available as instructed, and record near-falls and delayed fatigue.",
  donts:
    "Do not carry a hot or heavy item during early practice, use a borrowed aid without fitting, practise beside stairs alone, or compare the person's route with another older adult's ability.",
  safety:
    "Any of these warning signs needs urgent medical assessment: fainting, chest pain, severe breathlessness, new neurological signs, collapse, a fall with injury, or rapidly worsening weakness. Repeated near-falls, a new dizziness pattern, or a sudden change in aid use should be reported before the plan advances.",
});

export const cityJournalBatch8Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-agra-car-transfer",
    slug: "post-surgery-car-transfers-home-agra",
    title: "After Surgery in Agra: Safer Car Transfers and the First Trip Home",
    metaTitle: "Post-Surgery Car Transfers and Home Arrival in Agra",
    metaDescription: "A practical Agra guide to post-surgery car transfers, vehicle seats, doorway routes, caregiver guarding, precautions, and safer home arrival planning.",
    excerpt: "How a home physiotherapy assessment can separate a car transfer, entrance route, and recovery question after surgery in Agra.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "agra",
    discipline: "physiotherapy",
    content: agraCarTransfer,
    sources: [refs.nicePostop, refs.whoPostop, refs.whoRehab, refs.niceCritical, refs.agraProfile],
  },
  {
    id: "city-journal-agra-recovery-nutrition",
    slug: "recovery-nutrition-appetite-meal-participation-agra",
    title: "Recovery Nutrition in Agra: Appetite and Meal Participation",
    metaTitle: "Recovery Nutrition, Appetite, and Meal Participation in Agra",
    metaDescription: "A cautious Agra guide to appetite, meal participation, fatigue, mobility, swallowing questions, nutrition referrals, and recovery boundaries. Review helps.",
    excerpt: "What families can observe when fatigue, limited mobility, or a medical restriction changes meal participation during recovery in Agra.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "agra",
    discipline: "nutrition",
    content: agraRecoveryNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoPostop, refs.agraProfile],
  },
  {
    id: "city-journal-agra-travel-conditioning",
    slug: "exercise-physiology-travel-day-recovery-agra",
    title: "Exercise Physiology in Agra: Preparing for a Travel Day",
    metaTitle: "Exercise Physiology for Travel-Day Recovery in Agra",
    metaDescription: "A safety-first Agra guide to preparing for appointment travel, route planning, pauses, delayed fatigue, transfers, and individualized conditioning. Review.",
    excerpt: "How exercise physiology can review a full travel-day sequence without turning a deadline or distance into a universal exercise prescription in Agra.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "agra",
    discipline: "exercise-physiology",
    content: agraTravelConditioning,
    sources: [refs.whoActivity, refs.whoRehab, refs.nicePostop, refs.niceCritical, refs.agraProfile],
  },
  {
    id: "city-journal-prayagraj-dressing",
    slug: "stroke-dressing-cueing-one-sided-task-prayagraj",
    title: "After Stroke in Prayagraj: Dressing, Cueing, and One-Sided Tasks",
    metaTitle: "Stroke Dressing and One-Sided Task Practice in Prayagraj",
    metaDescription: "A practical Prayagraj guide to stroke dressing, cueing, sitting balance, shoulder protection, caregiver support, and safer task progression. Review helps.",
    excerpt: "How a home physiotherapy review can separate dressing, attention, balance, communication, and one-sided task questions after stroke in Prayagraj.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "prayagraj",
    discipline: "physiotherapy",
    content: prayagrajDressing,
    sources: [refs.niceStroke, refs.ahaStroke, refs.asaLiving, refs.whoRehab, refs.prayagrajProfile],
  },
  {
    id: "city-journal-prayagraj-meal-tolerance",
    slug: "nutrition-meal-tolerance-breathlessness-fatigue-prayagraj",
    title: "Nutrition in Prayagraj: When Breathlessness Interrupts Meals",
    metaTitle: "Breathlessness and Meal Nutrition Questions in Prayagraj",
    metaDescription: "A cautious Prayagraj guide to meal interruptions, breathlessness, fatigue, posture, swallowing questions, nutrition review, and respiratory boundaries.",
    excerpt: "What families can record when breathlessness, fatigue, attention, or posture changes meal completion during rehabilitation in Prayagraj.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "prayagraj",
    discipline: "nutrition",
    content: prayagrajMealTolerance,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.niceCopd, refs.nhlbiPulmonary, refs.prayagrajProfile],
  },
  {
    id: "city-journal-prayagraj-neuro-conditioning",
    slug: "short-bout-neurological-conditioning-prayagraj",
    title: "Neurological Exercise in Prayagraj: Building Capacity in Short Bouts",
    metaTitle: "Short-Bout Neurological Conditioning in Prayagraj",
    metaDescription: "A safety-first Prayagraj guide to short-bout neurological conditioning, meaningful tasks, pauses, recovery observation, and individualized progression.",
    excerpt: "How exercise physiology can use short, meaningful household tasks to review neurological conditioning without a fixed home target in Prayagraj.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "prayagraj",
    discipline: "exercise-physiology",
    content: prayagrajNeuroConditioning,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceStroke, refs.ahaStroke, refs.prayagrajProfile],
  },
  {
    id: "city-journal-jodhpur-bed-chair",
    slug: "post-surgery-bed-chair-transfers-jodhpur",
    title: "After Surgery in Jodhpur: Bed-to-Chair Transfers at Home",
    metaTitle: "Post-Surgery Bed-to-Chair Transfers in Jodhpur",
    metaDescription: "A practical Jodhpur guide to post-surgery bed-to-chair transfers, dizziness, chair height, caregiver position, precautions, and safer home movement safely.",
    excerpt: "How a home physiotherapy assessment can separate bed mobility, chair transfer, dizziness, and caregiver support questions after surgery in Jodhpur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "jodhpur",
    discipline: "physiotherapy",
    content: jodhpurBedChair,
    sources: [refs.nicePostop, refs.whoPostop, refs.whoRehab, refs.niceCritical, refs.jodhpurProfile],
  },
  {
    id: "city-journal-jodhpur-nutrition-timing",
    slug: "nutrition-recovery-meal-timing-symptoms-jodhpur",
    title: "Nutrition and Recovery in Jodhpur: When Meal Timing Changes",
    metaTitle: "Nutrition & Meal Timing in Jodhpur | Goswami Rehab",
    metaDescription: "A cautious Jodhpur guide to changing meal timing, appetite, nausea, breathlessness, medicines, nutrition referrals, and recovery care review now safely.",
    excerpt: "What families can record when appetite, symptoms, medicines, or energy vary across the day during rehabilitation in Jodhpur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "jodhpur",
    discipline: "nutrition",
    content: jodhpurNutritionTiming,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.niceCopd, refs.jodhpurProfile],
  },
  {
    id: "city-journal-jodhpur-home-space",
    slug: "exercise-physiology-home-space-energy-jodhpur",
    title: "Exercise Physiology in Jodhpur: Adapting Practice to Home Space",
    metaTitle: "Exercise Physiology, Home Space, and Energy in Jodhpur",
    metaDescription: "A safety-first Jodhpur guide to adapting exercise around home space, chair height, energy, breathing, supervision, and individualized progression. Review.",
    excerpt: "How exercise physiology can make a rehabilitation plan usable in the person's real space without mistaking familiarity for readiness in Jodhpur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "jodhpur",
    discipline: "exercise-physiology",
    content: jodhpurHomeSpaceExercise,
    sources: [refs.whoActivity, refs.whoRehab, refs.nicePostop, refs.niceCopd, refs.jodhpurProfile],
  },
  {
    id: "city-journal-udaipur-caregiver-transfers",
    slug: "caregiver-supported-transfers-hand-placement-udaipur",
    title: "Caregiver-Supported Transfers in Udaipur: Safer Hand Placement",
    metaTitle: "Caregiver-Supported Transfers and Hand Placement in Udaipur",
    metaDescription: "A practical Udaipur guide to caregiver-supported transfers, communication, hand placement, chair setup, neurological precautions, and safety checks now.",
    excerpt: "How a home physiotherapy review can teach a shared transfer sequence without turning a caregiver into a lifting device in Udaipur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "udaipur",
    discipline: "physiotherapy",
    content: udaipurCaregiverTransfers,
    sources: [refs.niceStroke, refs.ahaStroke, refs.nicePostop, refs.whoRehab, refs.udaipurProfile],
  },
  {
    id: "city-journal-udaipur-geriatric-meal-access",
    slug: "geriatric-nutrition-meal-access-chewing-udaipur",
    title: "Geriatric Nutrition in Udaipur: Meal Access and Chewing Questions",
    metaTitle: "Geriatric Nutrition, Meal Access, and Chewing in Udaipur",
    metaDescription: "A cautious Udaipur guide to older-adult meal access, chewing, assistance, posture, swallowing questions, nutrition review, and safety boundaries. Review.",
    excerpt: "What families can observe when reaching, chewing, fatigue, or assistance changes what an older adult actually eats in Udaipur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "udaipur",
    discipline: "nutrition",
    content: udaipurGeriatricMealAccess,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoRehab, refs.udaipurProfile],
  },
  {
    id: "city-journal-udaipur-walking-route",
    slug: "walking-aid-balance-household-route-udaipur",
    title: "Exercise Physiology in Udaipur: Walking-Aid Confidence on a Home Route",
    metaTitle: "Walking-Aid Confidence and Household Routes in Udaipur",
    metaDescription: "A safety-first Udaipur guide to walking-aid use, balance, turns, thresholds, recovery, caregiver guarding, and meaningful route progression. Needs review.",
    excerpt: "How exercise physiology can connect walking-aid confidence with one meaningful household route without prescribing a generic balance programme in Udaipur.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "udaipur",
    discipline: "exercise-physiology",
    content: udaipurWalkingRoute,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceStroke, refs.nicePostop, refs.udaipurProfile],
  },
];