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
  niceStroke: source("Stroke rehabilitation in adults", "NICE", "https://www.nice.org.uk/guidance/ng236"),
  niceStrokeRecommendations: source("Stroke rehabilitation in adults: recommendations", "NICE", "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations"),
  niceParkinsons: source("Parkinson’s disease in adults", "NICE", "https://www.nice.org.uk/guidance/ng71/chapter/Recommendations"),
  ahaStroke: source("Guidelines for Adult Stroke Rehabilitation and Recovery", "American Heart Association/American Stroke Association", "https://www.ahajournals.org/doi/10.1161/STR.0000000000000098"),
  nicePostoperative: source("Postoperative rehabilitation", "NICE", "https://www.nice.org.uk/guidance/QS206/chapter/statement-5-postoperative-rehabilitation"),
  niceDietActivity: source("Physical activity and diet", "NICE", "https://www.nice.org.uk/guidance/NG246/chapter/physical-activity-and-diet"),
  whoActivity: source("Physical activity", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/physical-activity"),
  whoDiet: source("Healthy diet", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/healthy-diet"),
  bdaSportNutrition: source("Sport and exercise", "British Dietetic Association", "https://www.bda.uk.com/resource/sport-exercise-nutrition.html"),
  icmrDietaryGuidelines: source("Dietary Guidelines for Indians 2024", "ICMR–National Institute of Nutrition", "https://nin.res.in/dietaryguidelines/pdfjs/locale/DGI_2024.pdf"),
  icmrMyPlate: source("My Plate for the Day", "ICMR–National Institute of Nutrition", "https://www.nin.res.in/downloads/My_Plate_English.pdf"),
  nhsDysphagia: source("Dysphagia (swallowing problems)", "NHS", "https://www.nhs.uk/symptoms/swallowing-problems-dysphagia/"),
  asaDysphagia: source("Trouble swallowing after stroke", "American Stroke Association", "https://www.stroke.org/en/about-stroke/effects-of-stroke/physical-effects/dysphagia"),
  espEnSurgery: source("ESPEN guideline: Clinical nutrition in surgery", "European Society for Clinical Nutrition and Metabolism", "https://15.espen.org/files/ESPEN-guideline_Clinical-nutrition-in-surgery.pdf"),
  nhsKneeComplications: source("Complications of a knee replacement", "NHS", "https://www.nhs.uk/tests-and-treatments/knee-replacement/complications/"),
  ahaActivityPlan: source("Develop a physical activity plan for you", "American Heart Association", "https://www.heart.org/en/health-topics/cardiac-rehab/getting-physically-active/develop-a-physical-activity-plan-for-you"),
  acsmExercise: source("Exercise testing and prescription", "American College of Sports Medicine", "https://www.acsm.org/education-resources/books/exercise-testing-prescription"),
  cdcActivity: source("Guidelines and recommended strategies for physical activity", "Centers for Disease Control and Prevention", "https://www.cdc.gov/physical-activity/php/guidelines-recommendations/index.html"),
  strokeHomeCare: source("The principles of home care for patients with stroke: an integrative review", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC11521122"),
  ahmedabadDistrict: source("Ahmedabad district: official district information", "District Administration, Ahmedabad", "https://ahmedabad.nic.in/"),
  chandigarhAdministration: source("Chandigarh administration: official information", "Chandigarh Administration", "https://chandigarh.gov.in/"),
  lucknowDistrict: source("Lucknow district: official district information", "District Administration, Lucknow", "https://lucknow.nic.in/"),
};

const commonBooking = `
### Booking and follow-up

Home physiotherapy is arranged after the team understands the person’s condition, location, current precautions, and preferred care. Goswami Rehab offers home visits at {{price.homeVisit.introductory}} and online consultation at {{price.telehealth.introductory}}. Send the online booking request with the main concern, city, and preferred dates; the team confirms the appropriate next step within 24 hours. A teleconsultation can be useful when travel is difficult or when an exercise plan needs review, but it does not replace emergency or specialist medical care.

This article is educational information only. It does not diagnose a condition or replace advice from a doctor, surgeon, dietitian, speech and language therapist, or treating physiotherapist. Individual plans, timelines, and outcomes vary.
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
- Keep a simple record of symptoms, activity, sleep, and the tasks that are becoming easier or harder.
- Share medical reports, medication changes, surgeon restrictions, and any recent change in symptoms before exercise is progressed.

### Don’t

- ${donts}
- Do not copy an exercise from a video if it increases symptoms, requires equipment you cannot control, or conflicts with a medical restriction.
- Do not use pain, fatigue, or a single good day as the only measure of readiness for a harder task.

### Safety and when to seek medical advice

${safety}

${commonBooking}`;
}

const chandigarhStroke = articleContent({
  opening: "Stroke rehabilitation in Chandigarh should be built around the person, not around a standard list of exercises. A stroke can affect strength, balance, sensation, vision, speech, thinking, mood, swallowing, and confidence in different combinations. The first useful question is therefore not “Which exercise should we do?” but “Which activities have changed, what is safe today, and what matters most to this person?”",
  context: "Chandigarh’s directory describes neurological and stroke rehabilitation alongside post-surgery, Parkinson’s, orthopaedic, and cardiopulmonary care. That mix is a reason to make an assessment specific to the person’s current pathway; it is not evidence that every resident has the same stroke pattern or recovery need. A city home visit can make the plan practical by looking at the actual bed-to-chair route, bathroom, stairs, doorway, and caregiver setup.",
  assessment: "NICE recommends a needs-based, goal-oriented stroke rehabilitation assessment. A physiotherapist may examine sitting and standing balance, strength, range of movement, tone, coordination, transfers, walking, endurance, sensation, and the effect of vision or neglect. The wider team may also need to consider communication, cognition, mood, fatigue, swallowing, continence, and the person’s ability to practise safely. The family’s observations matter: a task that looks possible in a quiet clinic may become unsafe when the person is tired, distracted, or moving around furniture.",
  progression: "Progression is usually task-specific. It might begin with controlled rolling, sitting balance, a supported sit-to-stand, or a safe transfer, then move toward standing tasks, stepping, turning, reaching, and walking to a meaningful destination. Repetition is useful when the task is appropriate and the person can maintain quality and safety. The therapist may change the amount of support, the surface, the distance, the speed, or the amount of attention required. Progress is not a race to remove every aid; a walking aid or caregiver support can be part of a safer stage while strength and control develop.",
  homeSession: "A home session may start with a check of alertness, pain, fatigue, medication changes, and any new symptoms. The therapist watches a relevant task in the real environment, such as getting out of bed, moving to a chair, using the bathroom route, or reaching for a kitchen surface. They then teach the person and caregiver how to set up the task, where to stand, when to pause, and how much help to give without pulling on an arm. A written plan should identify what to practise, how to recognise a poor response, and when the plan needs review.",
  dos: "Choose one or two meaningful daily tasks, clear the route before practice, use the assistance and equipment taught by the team, and allow recovery between efforts.",
  donts: "Do not make a person practise unsupported standing, transfers, or stairs because they managed once, and do not treat a home programme as a substitute for assessment after a new neurological event.",
  safety: "Seek urgent medical help for new facial drooping, new one-sided weakness or numbness, sudden speech or vision change, new confusion, collapse, or a sudden severe headache. Arrange prompt clinical review for repeated falls, unsafe transfers, rapidly worsening function, new swallowing difficulty, or a marked change in alertness. A home exercise plan should be paused when the person cannot follow it safely or when symptoms are different from the usual pattern.",
});

const chandigarhNutrition = articleContent({
  opening: "Recovery nutrition after stroke, surgery, Parkinson’s disease, or cardiopulmonary illness is not a competition for the “best” food. It is a clinical support question: can the person swallow safely, take enough fluid and food for their situation, manage fatigue and medication changes, and participate in rehabilitation? A useful plan is flexible and reviewed when the condition changes.",
  context: "Chandigarh’s authored care profile includes neurological, post-surgery, Parkinson’s, orthopaedic, and cardiopulmonary rehabilitation. Those pathways can have different nutrition risks. A person after stroke may need a swallowing assessment; a person after surgery may have pain, nausea, altered appetite, or surgeon-specific restrictions; a person with heart, lung, kidney, or metabolic disease may have fluid, salt, or medication considerations. The city page helps a family choose a rehabilitation conversation, but it cannot determine a diet from location alone.",
  assessment: "Before changing texture, fluid thickness, supplements, or meal timing, the treating team needs to know about coughing or choking, food sticking, wet or gurgly voice, breathlessness during meals, repeated chest infections, appetite, weight change, vomiting, bowel symptoms, diabetes, kidney disease, heart disease, and current medicines. Swallowing problems can be silent, so absence of a dramatic cough does not prove that eating is safe. A dietitian, doctor, speech and language therapist, or swallowing-trained clinician may be needed depending on the concern.",
  progression: "A general household framework is variety rather than a fixed menu. When clinically suitable, meals can draw from familiar foods such as dal or other pulses, vegetables, fruit, cereals or millets, curd or other dairy, nuts or oilseeds, eggs, fish, or meat. The form, texture, portion, salt, fluid, and preparation must follow the person’s plan. If exercise volume is higher, carbohydrate-containing foods can help provide fuel and fluids support hydration; protein contributes to tissue and muscle repair. These are principles to discuss, not a universal calorie, protein, sodium, or fluid prescription.",
  homeSession: "A home rehabilitation visit does not replace nutrition assessment, but it can show how fatigue, mobility, hand function, posture, or breathlessness affect eating. The therapist may help the person sit safely, conserve energy, position the body for an activity, or plan a manageable routine around meals and exercise. Families can bring a medication list, recent reports, a short record of intake and symptoms, and questions for the dietitian or doctor. If the person is losing weight unintentionally or cannot maintain intake, referral should not wait for a routine exercise review.",
  dos: "Keep a simple record of appetite, fluids, swallowing symptoms, weight changes, and energy; ask the clinical team which foods and textures fit the person’s restrictions.",
  donts: "Do not start thickened liquids, supplements, fasting, a very low-calorie diet, or a disease-treatment menu from an online article, and do not abruptly remove or add foods that may interact with medicines.",
  safety: "Prompt review is needed for coughing or choking with food or drink, a wet voice after swallowing, repeated chest infections, persistent vomiting, dehydration concern, severe appetite loss, or unintentional weight loss. Ask before making major diet changes if the person has kidney disease, diabetes, heart disease, a fluid or sodium restriction, or takes medicines whose effect can change with food. Nutrition cannot treat a stroke, infection, surgical complication, or cardiopulmonary deterioration on its own.",
});

const chandigarhExercise = articleContent({
  opening: "Exercise physiology in Chandigarh rehabilitation is less about finding a universal target and more about matching movement to the person’s diagnosis, baseline function, symptoms, and recovery setting. Someone rebuilding walking after stroke, managing Parkinson’s balance changes, returning after surgery, or recovering from cardiopulmonary illness may all need exercise, but not the same mode, dose, monitoring, or supervision.",
  context: "The Chandigarh care profile combines neurological, post-surgery, orthopaedic, Parkinson’s, and cardiopulmonary pathways. General physical-activity guidance is useful background, but it does not prove that unsupervised exercise is safe for each pathway. Weather, indoor space, stairs, equipment, fatigue, and caregiver availability can also affect the practical plan. These factors are reasons to adapt the programme, not reasons to claim that one neighbourhood or season creates a specific clinical risk.",
  assessment: "An exercise-focused assessment may review the medical history, recent procedures, medications, symptoms, balance, gait, strength, range, breathing, functional capacity, falls, fatigue, and the person’s goals. Depending on the condition, the medical team may need to determine whether further cardiac or pulmonary evaluation is required before progression. The therapist or exercise professional observes how the person responds during and after a task, rather than relying only on a resting measurement or an age-based formula.",
  progression: "A plan can use different components for different goals: mobility and balance for safe daily movement, strengthening for task capacity, and appropriately selected aerobic work for endurance. Progression may change one variable at a time—support, duration, distance, complexity, resistance, or recovery—while watching the next-day response. A written activity log can record what was attempted, symptoms, rest, and function. Calendar time alone should not decide when to advance after surgery, stroke, or a cardiopulmonary event.",
  homeSession: "At home, the professional may observe walking from the chair to the doorway, stepping, turning, transfers, or a short bout of activity that reflects the person’s real goal. They can check whether the floor, footwear, chair height, walking aid, oxygen or other equipment, and caregiver position are suitable. The session should leave the family with a clear stop rule and a review point. A remote review can help refine a previously assessed plan, but it should not be used to clear a new or unstable symptom without the appropriate medical pathway.",
  dos: "Begin with the assessed level, use the prescribed support, allow recovery, and record symptoms and function rather than chasing a generic number of steps or minutes.",
  donts: "Do not publish or follow universal heart-rate, oxygen-saturation, blood-pressure, repetition, or intensity cut-offs without condition-specific clinical context, and do not exercise through alarming symptoms.",
  safety: "Stop and seek urgent medical care for chest pain or pressure, fainting or near-fainting, severe unexpected breathlessness, blue lips, severe palpitations, or sudden neurological symptoms. Request clinical review for repeated falls, new swelling, a major change in exercise tolerance, rapidly worsening fatigue, or symptoms after a procedure. Exercise progression should wait for medical clearance when the treating team has identified an unstable cardiac, pulmonary, neurological, or postoperative concern.",
});

const ahmedabadStroke = articleContent({
  opening: "After a stroke, physiotherapy in Ahmedabad should connect clinical assessment with the person’s real daily tasks. A plan that only measures a limb in isolation may miss difficulty with attention, vision, communication, transfers, fatigue, or the layout of the home. Rehabilitation is more useful when goals are meaningful, shared with the person and family, and reviewed as needs change.",
  context: "Ahmedabad’s city profile includes post-surgery, stroke, neurological, cardiac, and orthopaedic rehabilitation. That combination is a reminder that two people asking for “stroke physiotherapy” may have very different precautions and priorities. The home environment may include a bathroom threshold, stairs, a lift, a narrow passage, or a caregiver who works during the day. A home visit can test the actual task while keeping the city context practical, without claiming a city-specific stroke rate or outcome.",
  assessment: "NICE describes stroke rehabilitation as needs-based and goal-oriented. The assessment may include cognition, communication, vision, hearing, tone, strength, sensation, balance, coordination, transfers, walking, upper-limb use, fatigue, and ability to complete daily activities. It should also consider the person’s own goals, carer needs, equipment, and whether the environment supports practice. If a person has pain, new swallowing symptoms, medication changes, or a sudden drop in function, those findings can change the referral pathway before exercise is progressed.",
  progression: "Progression should be linked to a function such as standing to dress, reaching for a cup, walking to the bathroom, or getting in and out of a chair. Repetitive, task-specific practice can be included when it matches the person’s deficits and tolerance. The therapist may adjust the amount of assistance, the number of decisions, the distance, the surface, or the speed. A walking aid or caregiver support is not a failure; it may let the person practise more safely while control develops.",
  homeSession: "The therapist may begin by asking what has changed since the last review and watching a short functional sequence. They can then teach safe positioning, transfers, guarding, and a small set of clinician-selected tasks. The family should learn where to stand and when to stop rather than lifting or pulling through the affected arm. A good plan states what the person can practise independently, what needs supervision, and what should be reviewed at the next visit.",
  dos: "Choose a meaningful goal, practise in a cleared route, follow the current assistance level, and tell the team about near-falls and tasks that are becoming more difficult.",
  donts: "Do not promise a fixed recovery timeline, force a weak arm through a transfer, or continue a generic exercise when attention, balance, alertness, or symptoms have changed.",
  safety: "Urgent help is needed for new facial drooping, new one-sided weakness or numbness, sudden speech or vision change, new confusion, collapse, or a sudden severe headache. Seek prompt reassessment for repeated falls, new swallowing difficulty, worsening weakness, unsafe transfers, or rapidly declining function. The article cannot determine whether a new symptom is another stroke; a medical service must do that.",
});

const ahmedabadNutrition = articleContent({
  opening: "Nutrition can support rehabilitation and training in Ahmedabad without becoming a one-size-fits-all meal prescription. The useful questions are practical: is the person eating and drinking safely, is intake meeting the demands of the current recovery, are medicines or medical conditions changing the advice, and can the routine be sustained at home? Food should support care, not replace it.",
  context: "Ahmedabad’s authored rehabilitation issues include stroke, neurological, post-surgery, cardiac, and orthopaedic recovery. Each may change the nutrition conversation. Swallowing, nausea, pain, fatigue, diabetes, kidney disease, fluid limits, and cardiac restrictions are not solved by the same food list. ICMR–NIN guidance supports variety across food groups and household flexibility, but its population framework should not be turned into a personal prescription from a city page.",
  assessment: "A clinician may ask about appetite, recent weight change, swallowing, food tolerance, hydration, bowel symptoms, activity, sleep, and the medicines being taken. A person who coughs or chokes with food or drink, has a wet voice, becomes breathless during meals, or develops repeated chest infections needs swallowing review; these signs do not prove aspiration but should not be ignored. A dietitian or doctor may need to adapt the advice for diabetes, kidney disease, heart disease, surgery, or anticoagulant treatment.",
  progression: "For a generally well-tolerated diet, familiar options can include pulses, vegetables, fruit, cereals or millets, dairy or curd, nuts or oilseeds, eggs, fish, or meat according to household preference and clinical safety. Carbohydrate-containing foods can provide exercise fuel, protein contributes to muscle repair, and fluids support hydration; needs vary with the person and the training or rehabilitation load. If repeated exercise sessions are planned, the team may discuss timing and recovery foods, but the public article should not assign gram targets, calorie limits, or supplement doses.",
  homeSession: "A home physiotherapy session may reveal that reaching, standing, breathlessness, pain, or hand weakness makes meal preparation difficult. The therapist can help with posture, energy conservation, safe movement, and a realistic activity routine around meals. Families should bring the food and medicine questions to the appropriate professional rather than asking a physiotherapist to override a surgical, cardiac, kidney, diabetes, or swallowing plan. A brief intake and symptom record can make that consultation more useful.",
  dos: "Build a repeatable household pattern around foods the person can safely chew and swallow, record changes in appetite and energy, and ask for a dietitian review when intake or weight is falling.",
  donts: "Do not treat a supplement, detox, fasting plan, or named diet as a treatment for stroke, heart disease, surgery, or orthopaedic recovery, and do not copy sports-nutrition quantities into a rehabilitation plan.",
  safety: "Ask for prompt review after coughing or choking with meals, wet or gurgly voice, repeated chest infections, persistent vomiting, dehydration concern, severe appetite loss, or unintentional weight loss. Major changes need clinical advice when kidney disease, diabetes, heart disease, fluid or sodium restrictions, or medicine interactions are present. Food cannot diagnose or correct a surgical infection, cardiac deterioration, or new neurological event.",
});

const ahmedabadExercise = articleContent({
  opening: "Cardiac and orthopaedic rehabilitation can both benefit from exercise, but they do not share one automatic progression. In Ahmedabad, a safer plan begins by identifying whether the person is returning after a cardiac event or procedure, rebuilding after orthopaedic surgery, or managing a mixture of pain, weakness, and deconditioning. Assessment and monitoring come before a generic target.",
  context: "Ahmedabad’s care profile includes cardiac and orthopaedic rehabilitation as well as stroke, neurological, and post-surgery pathways. That makes it important to state the pathway clearly in a booking or follow-up conversation. A cardiac plan may require medical clearance or cardiac rehabilitation input; a post-operative plan may include weight-bearing, wound, or range restrictions; a neurological plan may need balance and supervision. Locality and city identify the enquiry route, not the safe intensity.",
  assessment: "The assessment may review the procedure or event, current restrictions, medications, pain, swelling, wound status, breathing, dizziness, falls, strength, range, walking, and the response to a simple functional task. For some cardiac patients, the medical team may decide whether an exercise test or additional monitoring is appropriate. For orthopaedic recovery, the clinician considers the surgeon’s instructions and whether the person can control the joint through the needed daily task. The goal is to understand response and readiness, not to label someone by age alone.",
  progression: "Aerobic work, strengthening, mobility, and balance can serve different purposes. The plan may start with supported transfers or short walking, then add duration, distance, resistance, or complexity one variable at a time. The person’s symptoms during the task and later that day or the next day help guide progression. An activity log can record the task, perceived effort, rest, pain or breathlessness, and function. A calendar promise is not a safe substitute for this feedback after a cardiac event or orthopaedic procedure.",
  homeSession: "At home, the professional can observe how the person moves from a chair, uses a stair or corridor, turns, carries a light object, or prepares for an ordinary daily task. The environment is checked for trip hazards, stable furniture, footwear, and the correct use of any aid. The family should leave knowing what is allowed, what needs supervision, what symptoms mean stop, and when the team will reassess. Remote review is useful for a previously assessed plan, not for ignoring new chest symptoms or a worsening wound.",
  dos: "Keep the medical clearance and surgeon restrictions available, progress only the variable the clinician has selected, and record recovery as well as performance.",
  donts: "Do not set a universal heart-rate, oxygen, blood-pressure, load, or return-to-exercise date, and do not assume that a pain-free day means the joint or heart is ready for a larger workload.",
  safety: "Stop and seek urgent medical assessment for chest pain or pressure, fainting or near-fainting, severe unexpected breathlessness, new neurological symptoms, or a rapidly worsening symptom. After surgery, seek review for marked swelling, wound discharge, fever, calf pain, or a sudden loss of function. Exercise should not be started or progressed through an unstable cardiac, pulmonary, neurological, or postoperative concern.",
});

const lucknowStroke = articleContent({
  opening: "Stroke rehabilitation at home in Lucknow should turn assessment into safe, practical progress. The strongest home programme is not the longest list; it is the one that the person understands, can perform at the correct assistance level, and can connect to a meaningful daily task. Goals should be shared and revisited as function, fatigue, communication, and confidence change.",
  context: "Lucknow’s authored page includes stroke and neurological rehabilitation alongside post-surgery, knee-replacement, and cardiopulmonary care. A home plan therefore has to respect the person’s exact medical route. A bedroom-to-bathroom transfer, a turn in a corridor, a step at the entrance, and a caregiver’s available time may matter more than a generic exercise count. The Lucknow context supports practical home teaching; it does not support claims about local prevalence, outcome, or access beyond the directory’s stated enquiry process.",
  assessment: "NICE recommends structured assessment, individualized goals, shared decisions, and coordinated rehabilitation. The physiotherapist may examine movement, tone, strength, sensation, balance, coordination, transfers, gait, upper-limb use, communication or cognition as they affect practice, and participation in daily activities. The home review also considers footwear, furniture, bathroom safety, equipment, caregiver technique, and when fatigue changes performance. If there is a new neurological symptom, a sudden decline, or an unsafe transfer, medical reassessment takes priority over adding exercises.",
  progression: "A practical sequence might move from bed mobility and supported sitting to sit-to-stand, standing balance, stepping, turning, and a short route that matters to the person. Repetition should be purposeful and matched to tolerance. Support can be reduced only when the person can control the task safely; distance, complexity, speed, or dual-task demand can then be adjusted gradually. If knee-replacement recovery is also part of the household’s concern, sharp pain or a surgeon’s restriction must not be overridden by a stroke exercise plan.",
  homeSession: "The therapist may observe a real transfer or walking route, explain where a caregiver should stand, and practise how to give the smallest safe amount of assistance. They may review a walking aid, chair height, lighting, footwear, and the route to the bathroom. The family should receive a short written plan with independent, supervised, and not-yet-safe tasks. Follow-up checks the next-day response and any change in communication, swallowing, balance, pain, or fatigue.",
  dos: "Practise one meaningful task at a time, use the taught guarding position, clear the route, and report near-falls or a change in function before increasing the workload.",
  donts: "Do not pull a person by the affected arm, make them walk alone because they managed once, or borrow an exercise dosage from another stroke survivor.",
  safety: "Urgent help is needed for new facial or limb weakness, sudden speech or vision change, altered consciousness, collapse, or a sudden severe headache. Any of these changes, including new falls, unsafe transfers, new swallowing difficulty, sudden fatigue, or a marked functional decline, require prompt review. Urgent medical assessment is needed after knee replacement or other surgery for wound concerns, fever, calf pain, or sharp persistent pain rather than self-progression.",
});

const lucknowNutrition = articleContent({
  opening: "After surgery, nutrition is one part of recovery alongside medical review, wound care, pain control, physiotherapy, and safe movement. For a Lucknow household, the practical goal is not to find a miracle food. It is to notice poor intake early, understand what the surgical and rehabilitation teams have advised, and get individualized help when appetite, swallowing, hydration, or weight becomes a concern.",
  context: "Lucknow’s directory describes post-surgery and knee-replacement rehabilitation as well as stroke, neurological, and cardiopulmonary care. Nutrition needs can differ according to the operation, complications, intake, swallowing, activity, diabetes, kidney or heart disease, and medicines. ESPEN guidance supports nutritional assessment before and after major surgery and prompt clinical support when a person is malnourished or cannot maintain intake. This is a reason to ask the clinical team early, not permission to copy a numerical diet plan.",
  assessment: "The care team may ask about appetite, nausea, vomiting, swallowing, food tolerance, hydration, bowel function, weight change, wound concerns, pain, mobility, and what the person can prepare or feed themselves. Coughing or choking, a wet voice, breathlessness during meals, or repeated chest infections need swallowing review. Kidney, heart, and metabolic conditions can change fluid, salt, protein, or carbohydrate advice. Medicines can also affect appetite or interact with major dietary changes, so the medication list belongs in the discussion.",
  progression: "A recovery pattern can be built from foods that are culturally familiar, affordable, available, and safe for the person’s assessed texture and medical plan. Depending on the individual, meals may include pulses, cereals or millets, vegetables, fruit, curd or other dairy, nuts or oilseeds, eggs, fish, or meat. Adequate energy and protein may matter, but an exact target belongs to the dietitian or medical team. Supplements are not automatically needed and cannot replace treatment for infection, bleeding, poor wound healing, or a surgical complication.",
  homeSession: "A home physiotherapy session can identify barriers that look like nutrition problems but are partly movement problems: difficulty sitting upright, reaching a plate, opening containers, standing safely in the kitchen, or managing fatigue. The therapist can help with posture, energy conservation, and a safe routine around meals. Families should share the therapist’s functional observations with the dietitian or surgeon, especially when the person cannot maintain intake or is losing weight without intending to.",
  dos: "Bring questions about appetite, fluid intake, swallowing, weight, bowel changes, and supplements to the clinical team, and keep foods in the form and texture that the person has been assessed to tolerate.",
  donts: "Do not prescribe calories, protein, supplements, fasting, or a rigid menu from this article, and do not use a food change to manage a wound, fever, clot symptom, or other possible complication.",
  safety: "Any of these concerns require prompt clinical review: persistent vomiting, dehydration concern, severe appetite loss, unintentional weight loss, inability to maintain intake, coughing or choking with meals, or a wet voice after swallowing. After surgery, escalate wound discharge, fever, new severe pain, calf swelling or pain, and sudden breathlessness. The treating team must decide whether the next step is nutrition support, swallowing therapy, or urgent medical treatment.",
});

const lucknowExercise = articleContent({
  opening: "A safer exercise plan for cardiopulmonary and joint-replacement recovery begins with clearance, monitoring, and a realistic goal. Someone recovering after a heart or lung problem may need a condition-specific programme, while someone after knee replacement may need to follow weight-bearing, wound, range, and pain guidance. Both benefit from progression that follows response rather than a fixed calendar.",
  context: "Lucknow’s authored issues include cardiopulmonary rehabilitation and knee-replacement rehabilitation, alongside stroke, neurological, and post-surgery care. These pathways can overlap in one household but should not be merged into one generic workout. A home visit can account for the chair, toilet, stairs, walking route, footwear, equipment, and caregiver support. The city context helps identify the relevant care conversation; it does not establish a universal exercise prescription.",
  assessment: "The professional reviews the cardiac or pulmonary history, operation and restrictions, medications, pain, wound, swelling, breathing, dizziness, falls, strength, range, walking, and ability to recover after a simple task. The medical team may decide whether cardiac rehabilitation input, an exercise test, or additional monitoring is needed before progression. For a knee replacement, sharp pain, wound change, fever, or sudden calf symptoms are not conditioning problems to train through.",
  progression: "Depending on clearance and goals, a plan may combine gentle mobility, strengthening, balance, and aerobic activity. The first change might be a little more time or distance, better control, less support, or a more functional task; it should not be every variable at once. An activity log can record what was completed, symptoms during the session, recovery, and the next-day response. The plan is reviewed when the response changes, not only when a calendar milestone arrives.",
  homeSession: "At home, the therapist or exercise professional may observe a chair transfer, short walk, turn, step, breathing response, or a practical task such as reaching for a countertop. They check the floor, furniture, walking aid, footwear, and how a caregiver assists. The session should end with clear stop rules, a safe starting level, and a follow-up point. Online review can refine an already assessed programme, but it is not an emergency service or a substitute for postoperative or cardiac clearance.",
  dos: "Keep the discharge and clearance instructions accessible, use the agreed support, make one planned change at a time, and record both symptoms and recovery.",
  donts: "Do not start or progress exercise without required clinical clearance, chase a universal intensity zone, or interpret pain, breathlessness, or fatigue as something that must always be pushed through.",
  safety: "Stop and seek urgent medical advice for chest pressure or pain, fainting or near-fainting, severe unexpected breathlessness, blue lips, severe palpitations, or a sudden neurological symptom. After knee replacement, seek urgent review for possible clot symptoms, wound infection signs, sudden calf swelling or pain, or rapid loss of function. A new or worsening response should be assessed before the plan resumes.",
});

export const cityJournalBatch1Posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-chandigarh-stroke-home-practice",
    slug: "stroke-rehabilitation-safer-home-practice-chandigarh",
    title: "Stroke Rehabilitation in Chandigarh: From Clinical Assessment to Safer Home Practice",
    metaTitle: "Stroke Rehabilitation in Chandigarh | Safer Home Practice",
    metaDescription: "An evidence-informed Chandigarh guide to stroke assessment, meaningful goals, caregiver practice, home safety, and when to seek medical review. Risks vary.",
    excerpt: "A practical Chandigarh guide to individualized stroke assessment, task-specific practice, caregiver education, home safety, and clinical review.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "chandigarh",
    discipline: "physiotherapy",
    content: chandigarhStroke,
    sources: [refs.niceStroke, refs.ahaStroke, refs.niceParkinsons, refs.chandigarhAdministration, refs.strokeHomeCare, refs.whoActivity],
  },
  {
    id: "city-journal-chandigarh-recovery-nutrition",
    slug: "nutrition-support-during-rehabilitation-chandigarh",
    title: "Nutrition Support During Rehabilitation in Chandigarh: What to Discuss After Stroke or Surgery",
    metaTitle: "Rehabilitation Nutrition in Chandigarh | Practical Guidance",
    metaDescription: "A cautious Chandigarh guide to swallowing safety, recovery nutrition, Indian household food choices, and when dietitian or medical review is required.",
    excerpt: "How Chandigarh families can discuss food, fluids, swallowing, appetite, and medical restrictions during rehabilitation without relying on a one-size-fits-all diet.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "chandigarh",
    discipline: "nutrition",
    content: chandigarhNutrition,
    sources: [refs.ahaStroke, refs.nhsDysphagia, refs.asaDysphagia, refs.icmrDietaryGuidelines, refs.icmrMyPlate, refs.whoDiet, refs.chandigarhAdministration],
  },
  {
    id: "city-journal-chandigarh-exercise-monitoring",
    slug: "exercise-monitoring-rehabilitation-chandigarh",
    title: "Exercise Monitoring in Chandigarh Rehabilitation: Planning, Progression, and When to Stop",
    metaTitle: "Exercise Monitoring in Chandigarh Rehabilitation",
    metaDescription: "Learn how exercise professionals adapt monitoring and progression for neurological, post-surgery, orthopaedic, and cardiopulmonary care in Chandigarh.",
    excerpt: "A safety-first Chandigarh guide to assessment, activity logs, progression, supervision, and stop rules across rehabilitation pathways.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "chandigarh",
    discipline: "exercise-physiology",
    content: chandigarhExercise,
    sources: [refs.acsmExercise, refs.cdcActivity, refs.niceParkinsons, refs.niceStroke, refs.whoActivity, refs.chandigarhAdministration],
  },
  {
    id: "city-journal-ahmedabad-stroke-assessment",
    slug: "stroke-physiotherapy-assessment-home-ahmedabad",
    title: "After a Stroke in Ahmedabad: How Physiotherapy Assessment Becomes Safer Home Practice",
    metaTitle: "Stroke Physiotherapy Assessment in Ahmedabad",
    metaDescription: "An Ahmedabad guide to post-stroke physiotherapy assessment, meaningful goals, home safety, caregiver education, and safer daily practice. Review matters.",
    excerpt: "How Ahmedabad families can connect post-stroke assessment with safer transfers, walking, daily tasks, and home practice.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "ahmedabad",
    discipline: "physiotherapy",
    content: ahmedabadStroke,
    sources: [refs.niceStrokeRecommendations, refs.nicePostoperative, refs.ahaStroke, refs.ahmedabadDistrict, refs.strokeHomeCare, refs.niceStroke],
  },
  {
    id: "city-journal-ahmedabad-rehabilitation-nutrition",
    slug: "eating-for-rehabilitation-and-training-ahmedabad",
    title: "Eating for Rehabilitation and Training in Ahmedabad: Practical Nutrition Without a One-Size-Fits-All Plan",
    metaTitle: "Nutrition for Rehabilitation and Training in Ahmedabad",
    metaDescription: "Evidence-informed Ahmedabad guidance on food, fluids, exercise fuel, recovery, swallowing safety, and individualized clinical boundaries. Review matters.",
    excerpt: "A practical Ahmedabad nutrition guide for rehabilitation and training that avoids rigid meal plans, supplement promises, and unsafe medical assumptions.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "ahmedabad",
    discipline: "nutrition",
    content: ahmedabadNutrition,
    sources: [refs.bdaSportNutrition, refs.icmrDietaryGuidelines, refs.icmrMyPlate, refs.whoDiet, refs.nhsDysphagia, refs.ahaStroke, refs.ahmedabadDistrict],
  },
  {
    id: "city-journal-ahmedabad-cardiac-orthopaedic-exercise",
    slug: "cardiac-orthopaedic-rehabilitation-exercise-ahmedabad",
    title: "Building Exercise Safely in Cardiac and Orthopaedic Rehabilitation in Ahmedabad",
    metaTitle: "Cardiac and Orthopaedic Exercise Rehabilitation in Ahmedabad",
    metaDescription: "A safety-first Ahmedabad guide to clearance, monitoring, progression, and home exercise boundaries after cardiac or orthopaedic recovery. Review matters.",
    excerpt: "How Ahmedabad patients can approach exercise after cardiac events or orthopaedic procedures with assessment, monitoring, and gradual progression.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "ahmedabad",
    discipline: "exercise-physiology",
    content: ahmedabadExercise,
    sources: [refs.ahaActivityPlan, refs.acsmExercise, refs.cdcActivity, refs.nicePostoperative, refs.niceDietActivity, refs.ahmedabadDistrict],
  },
  {
    id: "city-journal-lucknow-stroke-home-progress",
    slug: "stroke-rehabilitation-home-practical-progress-lucknow",
    title: "Stroke Rehabilitation at Home in Lucknow: From Assessment to Safe, Practical Progress",
    metaTitle: "Stroke Rehabilitation at Home in Lucknow",
    metaDescription: "A Lucknow guide to structured stroke assessment, caregiver teaching, meaningful home practice, safety planning, and clinical review. Follow-up matters.",
    excerpt: "A practical Lucknow guide to turning stroke assessment into safe daily tasks, caregiver support, and reviewed home progress.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "lucknow",
    discipline: "physiotherapy",
    content: lucknowStroke,
    sources: [refs.niceStrokeRecommendations, refs.ahaStroke, refs.strokeHomeCare, refs.nicePostoperative, refs.lucknowDistrict, refs.niceStroke],
  },
  {
    id: "city-journal-lucknow-post-surgery-nutrition",
    slug: "nutrition-post-surgery-recovery-lucknow",
    title: "Nutrition as Part of Post-Surgery Recovery in Lucknow: Questions to Ask Your Clinical Team",
    metaTitle: "Post-Surgery Recovery Nutrition in Lucknow",
    metaDescription: "A cautious Lucknow guide to nutrition assessment after surgery, appetite and swallowing concerns, food choices, and referral boundaries. Review matters.",
    excerpt: "What Lucknow families should ask about appetite, fluids, swallowing, weight, supplements, and nutrition support after surgery.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "lucknow",
    discipline: "nutrition",
    content: lucknowNutrition,
    sources: [refs.espEnSurgery, refs.nhsKneeComplications, refs.nhsDysphagia, refs.icmrDietaryGuidelines, refs.ahaStroke, refs.lucknowDistrict, refs.strokeHomeCare],
  },
  {
    id: "city-journal-lucknow-cardiopulmonary-joint-exercise",
    slug: "cardiopulmonary-joint-replacement-exercise-lucknow",
    title: "A Safer Exercise Plan for Cardiopulmonary and Joint-Replacement Recovery in Lucknow",
    metaTitle: "Cardiopulmonary and Joint-Replacement Exercise in Lucknow",
    metaDescription: "A Lucknow guide to clearance, monitoring, progression, activity logs, and stop rules during cardiopulmonary or knee-replacement recovery. Review matters.",
    excerpt: "How Lucknow patients can approach cardiopulmonary and joint-replacement exercise with clearance, monitoring, and symptom-led progression.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "lucknow",
    discipline: "exercise-physiology",
    content: lucknowExercise,
    sources: [refs.ahaActivityPlan, refs.nhsKneeComplications, refs.acsmExercise, refs.cdcActivity, refs.nicePostoperative, refs.niceStroke, refs.lucknowDistrict],
  },
];