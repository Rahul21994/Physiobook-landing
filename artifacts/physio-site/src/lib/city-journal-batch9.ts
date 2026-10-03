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
  niceStroke: source(
    "Stroke rehabilitation in adults",
    "NICE",
    "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations",
  ),
  niceCopd: source(
    "Chronic obstructive pulmonary disease",
    "NICE",
    "https://www.nice.org.uk/guidance/ng115/chapter/recommendations",
  ),
  nicePostop: source(
    "Joint replacement: postoperative rehabilitation",
    "NICE",
    "https://www.nice.org.uk/guidance/qs206/chapter/statement-5-postoperative-rehabilitation",
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
  nhsVertigo: source(
    "Vertigo",
    "NHS",
    "https://www.nhs.uk/conditions/vertigo/",
  ),
  nhsNausea: source(
    "Feeling sick (nausea)",
    "NHS",
    "https://www.nhs.uk/conditions/feeling-sick-nausea/",
  ),
  nhsTaste: source(
    "How to cope with changing food tastes caused by your treatment or condition",
    "Royal Free London NHS Foundation Trust",
    "https://www.royalfree.nhs.uk/patients-and-visitors/patient-information-leaflets/how-to-cope-with-changing-food-tastes-caused-your-treatment-or-condition",
  ),
  ahmedabadProfile: source(
    "Ahmedabad District",
    "Government of Gujarat",
    "https://ahmedabad.nic.in/",
  ),
  lucknowProfile: source(
    "Lucknow District",
    "Government of Uttar Pradesh",
    "https://lucknow.nic.in/",
  ),
  chandigarhProfile: source(
    "Chandigarh Administration",
    "Government of India",
    "https://chandigarh.gov.in/",
  ),
  suratProfile: source(
    "Surat District",
    "Government of Gujarat",
    "https://surat.nic.in/",
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

const ahmedabadKitchenGrip = articleContent({
  city: "Ahmedabad",
  opening:
    "Opening a jar, holding a cup, cutting soft food, or reaching for a shelf can expose a hand and wrist problem that a simple squeeze test misses. Pain, swelling, tendon irritation, nerve symptoms, reduced movement, and fear of dropping an object can all change the task. An Ahmedabad physiotherapy assessment can break the routine into safe parts instead of treating grip strength as the only goal.",
  context:
    "The useful setting is the person's actual kitchen or daily task: the height of the counter, weight and shape of objects, dominant hand, affected side, work surface, pace, and whether another person can assist. A city profile does not prove that a particular occupation caused the problem or that every household needs the same adaptation. The starting point is the task the person wants to regain and the medical advice already received.",
  assessment:
    "The therapist may ask about the injury or operation, swelling, numbness, night symptoms, neck or elbow symptoms, dropping objects, skin changes, and the response after repeated use. They may inspect movement of the fingers, thumb, wrist, and forearm; test sensation and strength when appropriate; and observe a light, safe version of reaching, holding, or releasing. A cold or pale hand, rapidly increasing swelling, new weakness, or spreading sensory loss requires medical review rather than more grip practice.",
  progression:
    "Early practice may use an empty cup, a light container, or a supported reach with the wrist in a comfortable position. The clinician can then change one demand at a time: duration, object shape, reach height, release control, or the number of kitchen steps. Progress might mean fewer compensatory movements, a more reliable release, less symptom recovery time, or completing one useful task with appropriate support. It does not mean repeatedly testing the painful grip or lifting a heavy pan to prove readiness.",
  homeSession:
    "A home visit can examine the counter, shelf, chair, handles, storage position, and the sequence that causes uncertainty. The therapist can suggest temporary placement changes, a safer way to carry an item, or a short capacity routine linked to the assessed problem. They can also identify when occupational therapy, hand surgery, or medical review is more appropriate than a general strengthening plan.",
  questions:
    "Ask which movements or loads are allowed, whether a splint or dressing should remain during the task, what swelling or numbness should be recorded, and how much help is safe. Ask whether the goal is movement, tendon loading, nerve review, strength, or task adaptation, and what change should stop practice and prompt a clinical call.",
  dos:
    "Use light, stable objects first, keep the work surface clear, respect the prescribed range or protection, and note symptoms during the task and later that day.",
  donts:
    "Do not test recovery with a heavy pan, force a stiff thumb or wrist, ignore increasing numbness, or keep repeating a grip that causes a delayed flare.",
  safety:
    "Any of these symptoms needs prompt clinical review: rapidly increasing swelling, wound or skin change, persistent numbness, new loss of grip, or pain that changes sharply. Any of these situations needs emergency help: a cold or pale hand, severe trauma, uncontrolled bleeding, collapse, or sudden neurological symptoms.",
});

const ahmedabadHeatNutrition = articleContent({
  city: "Ahmedabad",
  opening:
    "Warm conditions can change thirst, appetite, meal timing, and the effort a person feels during rehabilitation, but thirst alone does not determine a safe fluid plan. Heart, kidney, liver, diabetes, swallowing, and medicine instructions may change what is appropriate. An Ahmedabad nutrition review can connect the person's actual symptoms and routine with the clinician who is responsible for fluid and food advice.",
  context:
    "Relevant details include when the person is active, how much is eaten and drunk, sweating, nausea, dizziness, urine changes, weight trend, medicines, medical restrictions, and who prepares or offers food. The city setting can explain why families are asking about heat and hydration; it cannot prove dehydration, prescribe a volume, or support a universal summer menu. The first question is whether the change is environmental, medical, nutritional, or several factors together.",
  assessment:
    "A dietitian or doctor may review intake records, weight, blood pressure symptoms, kidney or heart instructions, diabetes management, vomiting, diarrhoea, and medicines. Physiotherapy may examine whether heat and fatigue change posture, mobility, and safe access to meals. A speech-language clinician may assess swallowing when coughing, a wet voice, or food residue appears. The team should distinguish a dry mouth from dehydration and thirst from a condition that needs urgent assessment.",
  progression:
    "A useful first step may be a short record of time, activity, food, drinks, symptoms, and recovery rather than a forced target. The responsible team may then adjust timing, access, food texture, rest, or referral while preserving any fluid restriction. Progress can mean more consistent meal participation or earlier recognition of a concerning change. It is not a reason to start electrolyte products, stop prescribed medicines, or increase fluids without the clinician who manages the medical condition.",
  homeSession:
    "A home session can review the route to the kitchen, the place where drinks are kept, the stability of the cup, meal posture, fan or shade access, and the movements that make a person postpone eating or drinking. The therapist can document functional barriers for the dietitian or doctor. The home review cannot replace blood tests, a swallowing assessment, or medical decisions about fluid restriction.",
  questions:
    "Ask whether the person has a fluid, salt, sugar, kidney, or heart restriction; which symptoms should be tracked; whether nausea or dizziness changes the plan; and which professional should decide on oral rehydration or supplements. Ask what degree of reduced intake requires a same-day call.",
  dos:
    "Keep the agreed instructions visible, make safe drinks accessible, record symptoms with timing, and plan meals or activity around the person's assessed energy and supervision.",
  donts:
    "Do not impose a fixed litre target, use sports drinks as a treatment, stop a prescribed restriction, or assume every dizziness episode is caused by heat.",
  safety:
    "Any of these symptoms needs prompt clinical review: persistent vomiting, rapidly falling intake, worsening dizziness, confusion, very reduced urine, a significant weight change, or a new swallowing sign. Any of these situations needs emergency help: collapse, severe breathing difficulty, chest pain, blue lips, or an acute neurological change.",
});

const ahmedabadStandingWork = articleContent({
  city: "Ahmedabad",
  opening:
    "Standing for work is not the same as completing a step target. A person may tolerate five minutes at a counter but struggle with repeated reaching, carrying, turning, or the recovery after a shift. Exercise physiology can help an Ahmedabad patient examine the whole work demand and build capacity without pretending that one number is safe for everyone.",
  context:
    "The relevant context is the person's actual work or household role: standing surface, footwear, leaning options, lifting demands, breaks, commute, sleep, pain, breathlessness, and what happens later that day. Ahmedabad's city profile does not establish one work pattern or local occupational risk. A plan should describe the task and response rather than label the person by a job or promise a return date.",
  assessment:
    "The clinician may map a short work sequence, observe sit-to-stand, standing posture, reaching, turning, light carrying when permitted, and the transition to rest. They ask about swelling, pain, dizziness, breathlessness, weakness, sleep, and delayed symptoms. Strength, balance, blood-pressure response, exertion, and recovery may be assessed when clinically indicated. New neurological signs, fainting, or chest symptoms change the pathway before conditioning is progressed.",
  progression:
    "The first dose may be a brief, supported part of the real task with a planned pause and a next-day check. One feature can then change at a time: standing duration, reach frequency, surface, carrying, or the length of the recovery interval. Progress may mean completing a work block with stable technique, using a planned pause before symptoms escalate, or recovering predictably. It does not mean ignoring pain or adding a full shift because a short trial felt acceptable.",
  homeSession:
    "A home or work-setting review can examine the counter, chair, floor, footwear, safe place to pause, and the route between tasks. The therapist can help separate a strength problem from an equipment, pacing, balance, or medical issue and document independent, supervised, and not-yet-appropriate demands. Work clearance and medication decisions remain with the responsible clinical team.",
  questions:
    "Ask which work task should be tested first, how to record delayed symptoms, whether sitting or leaning is allowed, what load is safe, and what would require a medical review. Ask how the plan will change if sleep, pain, breathlessness, or swelling worsens.",
  dos:
    "Choose one representative task, plan a pause before fatigue becomes unsafe, use suitable footwear and support, and record the next-day response.",
  donts:
    "Do not use a fixed step count as a prescription, add standing and lifting together, work through chest symptoms, or treat a single good shift as proof of full capacity.",
  safety:
    "Any of these symptoms needs prompt medical review: persistent swelling, new weakness, repeated dizziness, worsening pain, or a delayed decline after ordinary activity. Any of these situations needs emergency help: chest pain, severe breathlessness, fainting, collapse, or sudden neurological symptoms.",
});

const lucknowDizzinessAssessment = articleContent({
  city: "Lucknow",
  opening:
    "Dizziness can mean spinning, light-headedness, unsteadiness, visual discomfort, or a fear of moving. Those experiences do not all call for the same exercise. A Lucknow physiotherapy assessment can first clarify when the symptom appears, what movement provokes it, and which medical or vestibular review is needed before someone practises turning or walking.",
  context:
    "The useful details are the person's description of the sensation, hearing or vision changes, headache, medication changes, recent illness, falls, neck symptoms, position changes, and the exact home or community task that has become difficult. A city address does not establish a cause or a shared balance problem. Dizziness after standing, dizziness with head movement, and unsteadiness from weakness may require different pathways.",
  assessment:
    "The therapist may ask about onset, duration, triggers, nausea, hearing, vision, fainting, palpitations, falls, and neurological symptoms. They may observe eye and head movement, sitting and standing transitions, walking, turning, and the person's response to a carefully selected task, stopping when the findings are unsafe. A new severe headache, double vision, speech change, one-sided weakness, fainting, or severe chest symptom needs urgent medical assessment rather than a home vestibular drill.",
  progression:
    "If the assessment supports practice, it may begin with an agreed movement in a stable position and a clear stop rule. The clinician may then vary head position, visual environment, turning, walking, or the amount of support one at a time. Progress can mean better confidence, fewer pauses, a clearer recovery pattern, or safer completion of one route. It does not mean repeatedly provoking severe dizziness or assuming that habituation is appropriate before the cause has been reviewed.",
  homeSession:
    "A home visit can examine the bed, bathroom, doorway, lighting, floor surface, and route where dizziness occurs. The therapist can teach how to record the trigger and recovery and can identify when a medical, ear, eye, neurological, or medication review is needed. The home session is not a substitute for emergency assessment or a diagnosis from a symptom description alone.",
  questions:
    "Ask what type of dizziness is being investigated, which movements are safe to practise, whether someone should guard, how long recovery should be observed, and which symptoms require urgent medical help. Ask whether medication, hearing, vision, blood pressure, or neurological review is part of the plan.",
  dos:
    "Describe the sensation in plain language, clear the route, use the agreed support, and record triggers, duration, associated symptoms, and recovery.",
  donts:
    "Do not practise near stairs alone, drive while symptoms are uncontrolled, force head movements, or label every dizzy spell as an inner-ear problem.",
  safety:
    "Any of these symptoms needs prompt medical assessment: repeated falls, new hearing loss, persistent vomiting, fainting, or a rapidly changing dizziness pattern. Any of these situations needs emergency help: sudden weakness, speech or vision change, severe headache, collapse, chest pain, or severe breathing difficulty.",
});

const lucknowProteinMeals = articleContent({
  city: "Lucknow",
  opening:
    "When strength is returning unevenly, families often ask whether protein should be added to every meal or supplied through a supplement. The right answer depends on appetite, kidney and liver function, diabetes, swallowing, medicines, food access, and the reason strength changed. A Lucknow nutrition review can turn that broad question into a safe record for the responsible clinical team.",
  context:
    "The useful context is how much is offered and eaten at each meal, meal size, chewing or swallowing, weight trend, nausea, bowel pattern, mobility, sleep, medical restrictions, and who shops or cooks. The city setting does not establish one diet or one protein requirement. A person's usual foods and cultural preferences matter, but they must be considered alongside clinical advice rather than replaced by a generic list.",
  assessment:
    "A dietitian or doctor may assess intake, weight change, muscle or functional decline, illness burden, kidney or liver instructions, diabetes management, medicines, and access to food. A speech-language clinician may assess swallowing when coughing or a wet voice appears. Physiotherapy may examine whether transfers, fatigue, hand function, or access to the dining area reduce intake. The team should distinguish low intake from a problem that needs medical investigation before setting a target.",
  progression:
    "A first step may be a time-limited record of portions, symptoms, assistance, and what is left, without weighing every ingredient. The responsible team may then adjust meal structure, preparation support, referral, or a medically appropriate supplement. Progress can mean more reliable participation in meals, a clearer intake pattern, or improved function with safe recovery. It is not a reason to start a high-protein product or restrict ordinary foods without advice.",
  homeSession:
    "A home session can observe meal access, seating, utensil use, the route from the kitchen, and the fatigue caused by preparing or eating. The therapist can identify functional barriers and send a focused handover to the dietitian or doctor. They cannot independently prescribe protein, change kidney or diabetes advice, or replace a swallowing assessment.",
  questions:
    "Ask whether the concern is total intake, meal distribution, swallowing, strength, weight change, or a medical condition; what should be recorded; and who should decide on supplements. Ask what bowel, fluid, kidney, liver, or diabetes symptoms require earlier review.",
  dos:
    "Record ordinary portions and symptoms, keep the person's preferred foods visible to the team, arrange practical help for preparation, and report persistent intake or weight change.",
  donts:
    "Do not force food, begin a concentrated supplement, remove carbohydrates, change fluid advice, or use a protein target copied from an unrelated person.",
  safety:
    "Any of these symptoms needs prompt clinical review: repeated coughing during meals, rapidly falling intake, unplanned weight change, persistent vomiting, severe constipation, dehydration concern, or new confusion. Any of these situations needs emergency help: severe breathing difficulty, collapse, blue lips, or an airway emergency.",
});

const lucknowMorningConditioning = articleContent({
  city: "Lucknow",
  opening:
    "After a prolonged hospital stay, a person may have enough strength for one task but not enough reserve to wash, dress, prepare a drink, and recover without a long setback. Exercise physiology can study the sequence of a morning rather than treating one chair rise as a complete fitness test. The plan should be built around medical clearance and the person's actual recovery response.",
  context:
    "Relevant details include the reason for admission, current restrictions, sleep, nutrition, pain, breathlessness, dizziness, medication timing, walking aid, bathroom route, and who is available in the morning. A Lucknow address does not predict deconditioning or a return timeline. The aim is to understand which part of the routine consumes the most reserve and whether the response is stable enough for a small progression.",
  assessment:
    "The clinician may map the routine from waking to sitting, washing, dressing, and resting. They can observe position changes, walking, breathing recovery, alertness, balance, communication, and the later effect, while asking about near-falls, fever, pain, swelling, chest symptoms, and delayed exhaustion. Clinical measures may be used when appropriate; this article does not create home thresholds or clear a person for work, driving, or strenuous exercise.",
  progression:
    "The first plan may separate the routine into one task, one planned pause, and one recovery observation. The clinician can then vary order, duration, assistance, route, or rest one at a time. Progress may mean completing a necessary step with less help, recovering before the next task, or recognizing when to stop early. A shorter routine is useful information when it prevents a delayed decline; it is not a failure.",
  homeSession:
    "A home visit can observe the bathroom route, bed and chair height, clothing access, walking aid, and the place where the person can rest safely. The therapist can write a morning sequence with independent, supervised, and paused steps and coordinate medical or occupational therapy review when the barrier is not conditioning alone. Family members can bring the discharge summary and a record of symptoms across the day.",
  questions:
    "Ask which task should be practised first, how long recovery should be observed, whether bathing or stairs require separate clearance, what symptoms should stop the routine, and how the next-day response changes the plan.",
  dos:
    "Use a small meaningful sequence, prepare equipment before starting, build in a real pause, and record the response later that day and the next morning.",
  donts:
    "Do not test the whole routine at once, add stairs because a room feels familiar, exercise through fever or chest symptoms, or use a calendar deadline to override a restriction.",
  safety:
    "Any of these symptoms needs prompt clinical review: fever, worsening wound change, repeated dizziness, new swelling, falling intake, or a delayed decline after ordinary care. Any of these situations needs emergency help: chest pain, severe breathlessness, fainting, collapse, or sudden neurological symptoms.",
});

const chandigarhShoulderReach = articleContent({
  city: "Chandigarh",
  opening:
    "Reaching into a cupboard or lifting an arm to arrange clothing can be limited by pain, weakness, stiffness, nerve symptoms, or a recent injury. Shoulder pain alone does not identify the cause, and repeatedly forcing overhead movement can make an uncertain problem harder to interpret. A Chandigarh physiotherapy assessment can connect the symptom with the exact household task and the person's medical history.",
  context:
    "The setting may include shelf height, wall support, chair position, the weight of the object, the affected side, sleep position, work demands, and whether the task is repeated. A city profile does not establish a shared shoulder condition or prove that a movement is safe. The plan should respect surgery, fracture, neurological, cardiac, and inflammatory precautions when any are present.",
  assessment:
    "The therapist may ask about onset, trauma, neck symptoms, numbness, night pain, weakness, swelling, clicking, and what happens after the arm is used. They may examine shoulder and neck movement, strength, sensation, trunk control, scapular movement, and a light version of the reaching task when appropriate. A sudden loss of power, deformity, severe trauma, fever, or chest-related arm pain requires medical assessment rather than strengthening.",
  progression:
    "Practice may begin below shoulder height with a light object, a supported reach, or a change in storage position while the diagnosis and precautions are clear. The clinician can then alter height, distance, load, repetitions, or speed one at a time. Progress might mean smoother control, less compensation, better recovery, or completing a useful reach without a delayed flare. It does not mean repeatedly reaching into pain to measure improvement.",
  homeSession:
    "A home review can inspect the shelf, wardrobe, chair, wall, and objects that the person actually needs to handle. The therapist can suggest temporary placement changes and teach an assessed movement or strengthening routine. The session can also identify when an orthopaedic, neurological, or medical opinion is needed before the home plan changes.",
  questions:
    "Ask what range and load are allowed, whether sleep or work positions matter, which symptom suggests nerve or joint review, how often to practise, and what delayed response means the dose was too high.",
  dos:
    "Move frequently within the assessed range, store essential items at a manageable height during early recovery, and record the next-day response to a changed task.",
  donts:
    "Do not force a painful overhead stretch, repeatedly lift a heavy object to test the shoulder, ignore night weakness, or borrow a resistance band plan without assessment.",
  safety:
    "Any of these symptoms needs prompt clinical review: persistent night pain, increasing weakness, numbness, swelling, fever, or pain after a change in load. Any of these situations needs emergency help: severe trauma, deformity, chest pain, sudden neurological symptoms, or collapse.",
});

const chandigarhTasteNutrition = articleContent({
  city: "Chandigarh",
  opening:
    "A medicine change, illness, nausea, dry mouth, or altered taste can turn familiar food into an exhausting decision. The solution is not always a new diet, and a person may lose intake even when the family offers nutritious choices. A Chandigarh nutrition review can document what changed and connect food tolerance with the clinician who can address the cause.",
  context:
    "Useful details include when taste or nausea began, medicines, mouth symptoms, appetite, smell, swallowing, weight trend, bowel pattern, preferred foods, meal duration, and who prepares food. The city setting helps describe the person's care routine but does not establish a local dietary problem. A sudden change after a new medicine, operation, infection, or treatment deserves a medical review rather than a list of flavour tricks alone.",
  assessment:
    "A dietitian or doctor may review intake, weight, medicines, hydration instructions, oral health, nausea, reflux, and the reason food has become difficult. A speech-language clinician may assess swallowing when coughing, wet voice, or food residue occurs. Physiotherapy may examine posture, fatigue, hand access, and the effort required to reach or sit for a meal. The team should separate taste preference from a wider illness or medication effect.",
  progression:
    "A short record can compare food offered, amount eaten, taste or nausea response, mouth symptoms, and later recovery. The responsible team may then adjust food temperature, texture, timing, seasoning, preparation support, or medication review when clinically appropriate. Progress can mean maintaining intake, finding a tolerable ordinary meal, or identifying a referral need early. It is not a reason to stop essential foods or change medicines without advice.",
  homeSession:
    "A home visit can observe the dining position, kitchen route, utensil use, food access, and fatigue during the meal routine. The therapist can identify a mobility or setup barrier and communicate it to the dietitian or doctor. A home review cannot diagnose a medicine reaction, prescribe a supplement, or authorize a change in texture or fluid consistency.",
  questions:
    "Ask whether the priority is taste, nausea, mouth care, swallowing, intake, or a medicine effect; what should be recorded; and which clinician should review the change. Ask which signs mean that a same-day call is needed.",
  dos:
    "Keep portions manageable, record the actual response to food, maintain the instructions already given, and offer practical help without pressuring the person to finish.",
  donts:
    "Do not stop a medicine, force food, hide a supplement in a meal without consent, or assume that a taste change is harmless when intake and weight are falling.",
  safety:
    "Any of these symptoms needs prompt clinical review: persistent vomiting, rapidly falling intake, mouth sores, dehydration concern, new swallowing signs, or a significant weight change. Any of these situations needs emergency help: severe breathing difficulty, collapse, blue lips, or an acute allergic or neurological change.",
});

const chandigarhRecoveryActivity = articleContent({
  city: "Chandigarh",
  opening:
    "Someone returning to a walk, class, park activity, or group routine may judge readiness only by whether the first few minutes feel manageable. Recovery afterwards, sleep that night, symptoms the next day, and the ability to communicate a pause can matter just as much. Exercise physiology can help a Chandigarh patient use those observations without turning the talk test into a universal clearance rule.",
  context:
    "The relevant routine may involve walking, light games, a class, gardening, or another personally meaningful activity. The clinician needs the person's diagnosis, medicines, restrictions, baseline activity, sleep, nutrition, pain, balance, breathlessness, and access to help. Chandigarh's setting does not establish one outdoor condition or group intensity. The chosen activity and the person's response remain the centre of the plan.",
  assessment:
    "The clinician may review a low-risk part of the activity, speaking comfort, breathing recovery, movement quality, balance, symptoms, and what happens later. Heart rate, blood pressure, exertion, or oxygen measures may be used when clinically indicated, but no home number in this article clears a person for exercise. Chest symptoms, fainting, new neurological change, severe breathlessness, or a serious fall require a medical pathway first.",
  progression:
    "The plan may begin with a shorter duration, a simpler route, a known pause location, and a recovery check. One demand can then change at a time: duration, terrain, social distraction, speed, or frequency. Progress may mean recognizing a manageable effort, recovering predictably, and communicating a pause before symptoms escalate. It does not mean chasing a class pace or adding intensity because the first session was comfortable.",
  homeSession:
    "A home or online review can map the starting route, footwear, aid, warm-up, exit plan, and the first activity segment. The therapist can help the person and family record effort and delayed response and can coordinate with the treating medical team when the activity involves a cardiac, respiratory, neurological, or postoperative restriction.",
  questions:
    "Ask which part of the activity is safest to test, what the person should say when pausing, how long recovery should be watched, whether the next-day response matters, and what symptom means the activity should stop and be medically reviewed.",
  dos:
    "Choose one familiar activity demand, keep an easy exit and pause available, use the agreed monitoring method, and record sleep and next-day response.",
  donts:
    "Do not use the talk test as a diagnosis, add speed and duration together, exercise through chest symptoms, or compare recovery with another participant.",
  safety:
    "Any of these symptoms needs prompt medical review: repeated unusual fatigue, worsening swelling, new dizziness, a changed breathing pattern, or symptoms that persist into the next day. Any of these situations needs emergency help: chest pain, severe breathlessness, fainting, collapse, or sudden neurological symptoms.",
});

const suratCarryingLoad = articleContent({
  city: "Surat",
  opening:
    "Carrying a small bag, opening a tool, or moving an object between surfaces can expose a hand, wrist, or forearm loading problem that is not explained by the object's weight alone. Grip position, repetition, reach, vibration, pain, and recovery all change the demand. A Surat physiotherapy assessment can examine the task without assuming that a person's work or household role is the diagnosis.",
  context:
    "The therapist needs the actual object, handle, distance, surface height, dominant hand, affected side, pace, footwear, and the symptoms that appear during and after the task. A city profile does not prove a shared repetitive-work exposure or a particular local occupation. The goal is to identify the smallest safe version of the activity and the medical boundaries that must be respected.",
  assessment:
    "The assessment may cover the injury or operation, swelling, grip release, thumb and wrist motion, elbow and neck symptoms, numbness, skin changes, and delayed pain. The therapist may observe a light unloaded sequence before adding a permitted object and assess whether the person compensates through the shoulder or trunk. New weakness, a cold or pale hand, progressive numbness, or severe trauma requires medical review.",
  progression:
    "Practice may begin with a stable object close to the body and a short carry or controlled release. The clinician can then change one factor at a time: handle, distance, reach height, repetition, speed, or rest. Progress may mean a more neutral wrist, fewer symptom spikes, better release control, or predictable recovery. It does not mean testing the maximum load or returning to repeated work because one lift felt acceptable.",
  homeSession:
    "A home visit can look at the storage area, table height, handles, tools, chair, and route where the task occurs. The therapist can suggest temporary changes, teach an assessed loading exercise, and document when hand therapy, occupational therapy, surgery, or medical review is needed. The session cannot remove a surgical restriction or decide work fitness without the responsible team.",
  questions:
    "Ask what load and wrist position are permitted, whether a splint or dressing changes the task, how to record delayed symptoms, and which change should stop practice. Ask whether the goal is strength, movement, nerve review, task adaptation, or a different referral.",
  dos:
    "Start with a light stable object, keep it close when instructed, use the assessed grip, and record the response later that day and the next morning.",
  donts:
    "Do not repeatedly test maximum grip, force a stiff joint, ignore numbness, use vibrating tools before review, or continue a task that causes progressive swelling.",
  safety:
    "Any of these symptoms needs prompt clinical review: increasing swelling, wound change, persistent numbness, new loss of grip, or pain that changes sharply. Any of these situations needs emergency help: a cold or pale hand, severe trauma, uncontrolled bleeding, collapse, or sudden neurological symptoms.",
});

const suratShiftMeals = articleContent({
  city: "Surat",
  opening:
    "A changing workday can make a person skip breakfast, delay lunch, eat quickly, or arrive at rehabilitation without enough energy. The answer is not to assume that every worker needs the same meal plan. A Surat nutrition review can examine food access and timing alongside diagnosis, medicines, appetite, swallowing, weight, and the person's actual schedule.",
  context:
    "Relevant context includes the person's usual work and commute pattern, available meal breaks, cooking and storage access, appetite, nausea, bowel pattern, hydration instructions, diabetes or kidney advice, medicines, and who can help prepare food. The city does not establish a shared work pattern or a local nutritional deficit. A schedule change can expose a clinical problem, but it can also be a practical access barrier that needs a different solution.",
  assessment:
    "A dietitian or doctor may review what is offered, what is eaten, meal gaps, weight trend, symptoms, medical restrictions, and whether medicines are linked to food. A speech-language clinician may assess swallowing when coughing or a wet voice appears. Physiotherapy may examine whether pain, mobility, fatigue, or carrying containers affects access to meals. The team should distinguish a missed meal from malnutrition risk and identify when an acute medical change is present.",
  progression:
    "A useful first step is a short schedule-linked record of food, drinks, symptoms, meal duration, assistance, and recovery. The responsible team may then adjust preparation, storage, timing, portion size, or referral while preserving clinical restrictions. Progress can mean a more reliable routine and earlier communication when intake changes. It is not a reason to rely on supplements, skip prescribed meals, or change medicine timing without advice.",
  homeSession:
    "A home session can review food storage, carrying, kitchen reach, seating, and the time and energy required to prepare a meal. The therapist can identify functional barriers and provide a focused handover to the dietitian or doctor. They cannot prescribe a workday diet, change fluid or diabetes instructions, or replace a swallowing and medical assessment.",
  questions:
    "Ask whether the priority is access, appetite, nausea, swallowing, meal timing, weight change, or a medical restriction; who should review it; and what record will be most useful. Ask what missed-intake pattern requires a same-day call.",
  dos:
    "Plan around the person's actual available break, keep approved food accessible, record symptoms without blame, and report persistent changes in intake or weight.",
  donts:
    "Do not make a universal shift-work menu, hide food or supplements, skip a restriction, alter medicine timing, or treat repeated missed meals as a motivation problem.",
  safety:
    "Any of these symptoms needs prompt clinical review: repeated vomiting, rapidly falling intake, dehydration concern, new swallowing signs, severe abdominal symptoms, or a significant weight change. Any of these situations needs emergency help: collapse, severe breathing difficulty, chest pain, blue lips, or an airway emergency.",
});

const suratEnduranceRoutine = articleContent({
  city: "Surat",
  opening:
    "Returning to a meaningful walking or cycling routine after illness requires more than choosing a distance. Mounting or starting, turning, stopping, changing surface, carrying essentials, and recovering later are separate demands. Exercise physiology can help a Surat patient rebuild that sequence without promising a fixed pace or assuming that a familiar route is automatically safe.",
  context:
    "The relevant details are the diagnosis, medical clearance, current strength, balance, pain, breathlessness, sleep, nutrition, footwear, aid, route surface, traffic or supervision, and the delayed response after activity. Surat's city profile does not establish a universal cycling or walking culture, terrain, or training dose. The person's chosen routine and safety boundaries should determine the first step.",
  assessment:
    "The clinician may observe a low-demand start, stop, turn, short route, or safe stationary alternative and ask about symptoms during and after the activity. They may assess balance, leg and trunk control, breathing recovery, footwear, device fit, confidence, and whether the person can recognize a stop signal. Chest symptoms, fainting, new neurological change, severe breathlessness, or a fall with injury require medical assessment before progression.",
  progression:
    "The first plan may use a short familiar segment with a planned return point and a next-day review. The clinician can then change duration, route, surface, speed, carrying, or frequency one at a time. Progress may mean a predictable response, safer stopping, improved control, or completing an important part of the route without delayed deterioration. It does not mean increasing distance every session or using another person's training plan.",
  homeSession:
    "A home or online review can examine the starting area, footwear, aid, bicycle setup when appropriate, doorway, first turn, and recovery place. The therapist can help record the route demands and coordinate restrictions with the treating medical team. A home review does not clear road riding, independent outdoor travel, or exercise after a new symptom.",
  questions:
    "Ask which route segment is safe to test, whether a walking aid or stationary alternative is preferred, how long recovery should be observed, and which symptoms mean the activity should stop. Ask how the plan changes after a poor night's sleep or a delayed symptom.",
  dos:
    "Use the assessed device and route, keep a clear return plan, change one training demand at a time, and record next-day response as well as the activity itself.",
  donts:
    "Do not ride in traffic before the task is assessed, add hills and distance together, carry a heavy bag during early practice, or exercise through chest or neurological symptoms.",
  safety:
    "Any of these symptoms needs prompt medical review: repeated near-falls, new swelling, unusual delayed fatigue, changing pain, or a new dizziness pattern. Any of these situations needs emergency help: chest pain, severe breathlessness, fainting, collapse, or sudden neurological symptoms.",
});

export const cityJournalBatch9Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-ahmedabad-kitchen-grip",
    slug: "hand-wrist-kitchen-grip-rehabilitation-ahmedabad",
    title: "Hand and Wrist Rehabilitation in Ahmedabad: Safer Kitchen Grip After Injury",
    metaTitle: "Hand and Wrist Kitchen Grip Rehabilitation in Ahmedabad",
    metaDescription: "A practical Ahmedabad guide to hand and wrist assessment, kitchen grip, reaching, release control, pacing, and safer rehabilitation after injury. Review.",
    excerpt: "How physiotherapy can connect hand and wrist recovery with the kitchen task that matters without treating grip strength as the only goal.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "ahmedabad",
    discipline: "physiotherapy",
    content: ahmedabadKitchenGrip,
    sources: [refs.whoRehab, refs.whoPostop, refs.nicePostop, refs.niceRehab, refs.ahmedabadProfile],
  },
  {
    id: "city-journal-ahmedabad-heat-nutrition",
    slug: "heat-hydration-appetite-rehabilitation-nutrition-ahmedabad",
    title: "Nutrition in Ahmedabad: Heat, Hydration, and Appetite During Rehabilitation",
    metaTitle: "Heat, Hydration, and Rehabilitation Nutrition in Ahmedabad",
    metaDescription: "A cautious Ahmedabad guide to heat, hydration questions, appetite, medical restrictions, meal access, and nutrition review during rehabilitation. Review.",
    excerpt: "What to record when warm conditions change thirst, appetite, meal timing, and rehabilitation effort without creating a universal fluid target.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "ahmedabad",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: ahmedabadHeatNutrition,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoRehab, refs.ahmedabadProfile],
  },
  {
    id: "city-journal-ahmedabad-standing-work",
    slug: "standing-work-tolerance-exercise-physiology-ahmedabad",
    title: "Exercise Physiology in Ahmedabad: Rebuilding Standing Work Tolerance",
    metaTitle: "Standing Work Tolerance and Exercise Physiology in Ahmedabad",
    metaDescription: "A safety-first Ahmedabad guide to standing work, planned breaks, reaching, carrying, recovery, and individualized exercise progression. Review guides care.",
    excerpt: "How exercise physiology can review a real standing-work sequence without treating a fixed step count as a prescription.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "ahmedabad",
    discipline: "exercise-physiology",
    content: ahmedabadStandingWork,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceRehab, refs.nicePostop, refs.ahmedabadProfile],
  },
  {
    id: "city-journal-lucknow-dizziness-assessment",
    slug: "dizziness-balance-assessment-physiotherapy-lucknow",
    title: "Balance Physiotherapy in Lucknow: What a Dizziness Assessment Can Separate",
    metaTitle: "Dizziness and Balance Physiotherapy Assessment in Lucknow",
    metaDescription: "A practical Lucknow guide to dizziness descriptions, balance assessment, turning, triggers, safety boundaries, and appropriate clinical review. Needs vary.",
    excerpt: "How a physiotherapy assessment can distinguish different dizziness and balance questions before home turning or walking practice.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "lucknow",
    discipline: "physiotherapy",
    content: lucknowDizzinessAssessment,
    sources: [refs.nhsVertigo, refs.niceStroke, refs.whoRehab, refs.niceRehab, refs.lucknowProfile],
  },
  {
    id: "city-journal-lucknow-protein-meals",
    slug: "protein-distribution-strength-recovery-nutrition-lucknow",
    title: "Nutrition in Lucknow: Protein Questions When Strength Recovery Is Uneven",
    metaTitle: "Protein and Strength-Recovery Nutrition Questions in Lucknow",
    metaDescription: "A cautious Lucknow guide to protein questions, meal portions, appetite, medical restrictions, swallowing, and safe strength-recovery nutrition. Needs vary.",
    excerpt: "What families can record when meal size, appetite, and uneven strength recovery raise protein questions without a universal target.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "lucknow",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: lucknowProteinMeals,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoRehab, refs.lucknowProfile],
  },
  {
    id: "city-journal-lucknow-morning-conditioning",
    slug: "morning-routine-conditioning-after-hospital-stay-lucknow",
    title: "Exercise Physiology in Lucknow: Rebuilding a Morning Routine After Hospital Stay",
    metaTitle: "Morning-Routine Conditioning After Hospital Stay in Lucknow",
    metaDescription: "A safety-first Lucknow guide to rebuilding morning routines after hospital stay, with pacing, recovery observation, medical boundaries, and progression.",
    excerpt: "How exercise physiology can separate washing, dressing, walking, and recovery demands after a prolonged hospital stay.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "lucknow",
    discipline: "exercise-physiology",
    content: lucknowMorningConditioning,
    sources: [refs.niceRehab, refs.whoActivity, refs.whoRehab, refs.nicePostop, refs.lucknowProfile],
  },
  {
    id: "city-journal-chandigarh-shoulder-reach",
    slug: "shoulder-overhead-household-reach-physiotherapy-chandigarh",
    title: "Shoulder Physiotherapy in Chandigarh: Safer Overhead Household Reaching",
    metaTitle: "Shoulder Physiotherapy for Overhead Reaching in Chandigarh",
    metaDescription: "A practical Chandigarh guide to shoulder assessment, overhead household tasks, load changes, recovery, precautions, and safer physiotherapy progression.",
    excerpt: "How shoulder assessment can connect pain or weakness with an actual household reaching task without assuming the cause.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "chandigarh",
    discipline: "physiotherapy",
    content: chandigarhShoulderReach,
    sources: [refs.whoRehab, refs.whoPostop, refs.nicePostop, refs.niceRehab, refs.chandigarhProfile],
  },
  {
    id: "city-journal-chandigarh-taste-nutrition",
    slug: "taste-change-nausea-meal-intake-nutrition-chandigarh",
    title: "Nutrition in Chandigarh: Taste Change, Nausea, and Meal Intake",
    metaTitle: "Taste Change & Nausea in Chandigarh | Goswami Rehab",
    metaDescription: "A cautious Chandigarh guide to taste change, nausea, appetite, meal intake, medicines, swallowing questions, and nutrition review. Review guides care.",
    excerpt: "What to record when altered taste or nausea makes familiar food difficult during rehabilitation.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "chandigarh",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: chandigarhTasteNutrition,
    sources: [refs.nhsTaste, refs.nhsNausea, refs.niceNutrition, refs.niceMalnutrition, refs.chandigarhProfile],
  },
  {
    id: "city-journal-chandigarh-recovery-activity",
    slug: "talk-test-recovery-monitoring-chosen-activity-chandigarh",
    title: "Exercise Physiology in Chandigarh: Using Recovery to Scale a Chosen Activity",
    metaTitle: "Recovery Monitoring for Chosen Activity in Chandigarh",
    metaDescription: "A safety-first Chandigarh guide to talk-test limits, recovery, symptom monitoring, outdoor or group activity, and individualized exercise progression.",
    excerpt: "How recovery, sleep, and symptom monitoring can guide a return to a chosen activity without acting as universal exercise clearance.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "chandigarh",
    discipline: "exercise-physiology",
    content: chandigarhRecoveryActivity,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceRehab, refs.niceCopd, refs.chandigarhProfile],
  },
  {
    id: "city-journal-surat-carrying-load",
    slug: "hand-wrist-carrying-load-rehabilitation-surat",
    title: "Hand and Wrist Rehabilitation in Surat: Assessing Everyday Carrying Loads",
    metaTitle: "Hand and Wrist Carrying-Load Rehabilitation in Surat",
    metaDescription: "A practical Surat guide to hand, wrist, and forearm assessment for carrying, tool use, grip, swelling, pacing, and safer rehabilitation. Review helps.",
    excerpt: "How physiotherapy can assess an everyday carrying task without assuming a person's work or household role is the diagnosis.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Orthopaedic Rehabilitation",
    image: "/images/journal/journal_orthopaedic-rehabilitation.jpg",
    citySlug: "surat",
    discipline: "physiotherapy",
    content: suratCarryingLoad,
    sources: [refs.whoRehab, refs.whoPostop, refs.nicePostop, refs.niceRehab, refs.suratProfile],
  },
  {
    id: "city-journal-surat-shift-meals",
    slug: "meal-timing-food-access-rehabilitation-nutrition-surat",
    title: "Nutrition in Surat: Meal Timing and Food Access During Rehabilitation",
    metaTitle: "Meal Timing and Food Access During Rehabilitation in Surat",
    metaDescription: "A cautious Surat guide to changing workday schedules, meal access, appetite, medical restrictions, intake records, and nutrition review. Review helps.",
    excerpt: "How a schedule-linked record can separate food access from appetite, swallowing, medication, and medical nutrition questions.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "surat",
    discipline: "nutrition",
    presentation: "nutrition-guidance",
    content: suratShiftMeals,
    sources: [refs.niceNutrition, refs.niceMalnutrition, refs.icmrDiet, refs.whoRehab, refs.suratProfile],
  },
  {
    id: "city-journal-surat-endurance-routine",
    slug: "walking-cycling-endurance-recovery-exercise-physiology-surat",
    title: "Exercise Physiology in Surat: Rebuilding a Meaningful Walking or Cycling Routine",
    metaTitle: "Walking and Cycling Endurance Recovery in Surat",
    metaDescription: "A safety-first Surat guide to rebuilding walking or cycling endurance, route demands, stopping, recovery, and response-based progression. Review helps.",
    excerpt: "How exercise physiology can rebuild a meaningful route after illness without prescribing a fixed pace, distance, or training plan.",
    date: "September 23, 2026",
    isoDate: "2026-09-23",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "surat",
    discipline: "exercise-physiology",
    content: suratEnduranceRoutine,
    sources: [refs.whoActivity, refs.whoRehab, refs.niceRehab, refs.nicePostop, refs.suratProfile],
  },
];