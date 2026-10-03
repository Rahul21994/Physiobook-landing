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
  tvmParkinsonGuideline: source("Physical therapist management of Parkinson disease", "American Physical Therapy Association", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9046970/"),
  tvmFreezing: source("Freezing", "Parkinson's UK", "https://www.parkinsons.org.uk/information/symptoms/motor/freezing"),
  tvmFalls: source("Prevention of falls in Parkinson's disease", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10585979/"),
  tvmParkinsonFalls: source("Fall prevention in Parkinson's", "Parkinson's Foundation", "https://www.parkinson.org/library/fact-sheets/fall-prevention"),
  tvmFreezingReview: source("Exercise and training interventions for freezing of gait", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8433229/"),
  tvmParkinsonDiet: source("Diet and nutrition", "Parkinson's Foundation", "https://www.parkinson.org/living-with-parkinsons/management/diet-nutrition"),
  tvmParkinsonNutrition: source("Nutrition and Parkinson's disease", "Parkinson's Foundation", "https://www.parkinson.org/library/fact-sheets/nutrition"),
  tvmDietitians: source("Best practice guidelines for dietitians on Parkinson's", "Parkinson's UK", "https://www.parkinsons.org.uk/professionals/resources/best-practice-guidelines-dietitians-management-parkinsons"),
  tvmDysphagia: source("Management of dysphagia in Parkinson's disease", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6995701/"),
  tvmDysphagiaGuideline: source("Dysphagia nutrition guideline", "Alberta Health Services", "https://www.albertahealthservices.ca/assets/info/nutrition/if-nfs-ng-dysphagia.pdf"),
  tvmDualReview: source("Dual-task training in Parkinson's disease", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10046387/"),
  tvmDualAdvances: source("Cognitive-motor dual-task advances in Parkinson's disease", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC11478396/"),
  tvmExerciseGuideline: source("Parkinson's exercise guidelines for exercise professionals", "Parkinson's Foundation", "https://www.parkinson.org/sites/default/files/documents/Parkinsons-Exercise-Guidelines-1025.pdf"),
  tvmMotorFluctuations: source("Motor fluctuations and OFF times", "Stanford Medicine", "https://med.stanford.edu/parkinsons/treating-living/motor-fluctuations.html"),
  tvmExerciseMeta: source("Exercise for Parkinson's disease", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9815433/"),

  kozhikodePulmonary: source("Pulmonary rehabilitation", "National Heart, Lung, and Blood Institute", "https://www.nhlbi.nih.gov/health/pulmonary-rehabilitation"),
  kozhikodeAts: source("Pulmonary rehabilitation for adults with chronic respiratory disease", "American Thoracic Society", "https://www.thoracic.org/patients/patient-resources/resources/pulmonary-rehab.pdf"),
  kozhikodeCopd: source("Chronic obstructive pulmonary disease", "NHS", "https://www.nhs.uk/conditions/chronic-obstructive-pulmonary-disease-copd/"),
  kozhikodeDailyTasks: source("Around the clock with chronic lung disease", "American Lung Association", "https://www.lung.org/getmedia/cc4b4f1f-4248-48f1-82bc-b3ad59dbb89f/Around-the-Clock-With-Chronic-Lung-Disease.pdf"),
  kozhikodeAtsGuideline: source("Pulmonary rehabilitation clinical practice guideline", "American Thoracic Society", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10449064/"),
  kozhikodeDysphagia: source("Dysphagia", "NHS", "https://www.nhs.uk/conditions/swallowing-problems-dysphagia/"),
  kozhikodeNutritionNice: source("If you have problems eating", "NICE", "https://www.nice.org.uk/guidance/cg32/ifp/chapter/If-you-have-problems-eating"),
  kozhikodeEspen: source("Clinical nutrition and hydration in geriatrics", "ESPEN", "https://www.espen.org/files/ESPEN-Guidelines/ESPEN_practical_guideline_Clinical_nutrition_and_hydration_in_geriatrics.pdf"),
  kozhikodeMalnutrition: source("Malnutrition symptoms", "NHS", "https://www.nhs.uk/conditions/malnutrition/symptoms/"),
  kozhikodeBda: source("Malnutrition in older people", "British Dietetic Association", "https://www.bda.uk.com/resource/malnutrition-in-older-people.html"),
  kozhikodeAcs: source("Prehabilitation", "American College of Surgeons", "https://www.facs.org/for-patients/preparing-for-surgery/strong-for-surgery/prehabilitation"),
  kozhikodePrehabNhs: source("Getting fit for surgery", "NHS Inform", "https://www.nhsinform.scot/waiting-well/getting-fit-for-surgery"),
  kozhikodePrehabReview: source("Prehabilitation before surgery", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9924929"),
  kozhikodeOrthoPrehab: source("Prehabilitation before orthopaedic surgery", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10102876"),
  kozhikodeCpoc: source("Exercise in preparation for surgery", "Centre for Perioperative Care", "https://cpoc.org.uk/blog/exercise-preparation-surgery"),

  vizagGbsGuideline: source("Guidelines for physical and occupational therapy", "GBS/CIDP Foundation International", "https://www.gbs-cidp.org/wp-content/uploads/2019/12/GBSCIDP-Guidelines-for-PT-and-OT-Booklet_Final.pdf"),
  vizagGbsReview: source("Physical exercise in Guillain-Barré syndrome", "Journal of Clinical Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12028042/"),
  vizagApta: source("Guillain-Barré syndrome clinical summary", "American Physical Therapy Association", "https://www.apta.org/patient-care/evidence-based-practice-resources/clinical-summaries/guillain-barre-syndrome"),
  vizagGbsTreatment: source("Treatment guidelines for Guillain-Barré syndrome", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC3152164/"),
  vizagMayo: source("Guillain-Barré syndrome: diagnosis and treatment", "Mayo Clinic", "https://www.mayoclinic.org/diseases-conditions/guillain-barre-syndrome/diagnosis-treatment/drc-20363006"),
  vizagGbsCare: source("Guidelines for treatment", "GBS/CIDP Foundation International", "https://www.gbs-cidp.org/guidelines-for-treatment"),
  vizagSupportive: source("Supportive care for patients with Guillain-Barré syndrome", "JAMA Neurology", "https://jamanetwork.com/journals/jamaneurology/fullarticle/789059"),
  vizagRespiratory: source("Respiratory involvement in Guillain-Barré syndrome", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC5488546/"),
  vizagSwallowing: source("Swallowing screening", "American Speech-Language-Hearing Association", "https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/swallowing-screening/"),
  vizagNiceSwallowing: source("Diet and nutrition, eating and swallowing", "NICE", "https://www.nice.org.uk/guidance/ng42/ifp/chapter/diet-and-nutrition-eating-and-swallowing"),
  vizagRespiratoryReview: source("Respiratory muscle involvement in Guillain-Barré syndrome", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6193329"),
  vizagCriticalReview: source("Respiratory rehabilitation after neuromuscular illness", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC9724913"),
  vizagNeuromuscularReview: source("Respiratory care in neuromuscular disease", "National Library of Medicine", "https://pmc.ncbi.nlm.nih.gov/articles/PMC11446296"),
  vizagGbsRespiratory: source("Guillain-Barré syndrome", "NIH Genetic and Rare Diseases Information Center", "https://rarediseases.info.nih.gov/diseases/6554/guillain-barre-syndrome"),

  nagpurDeconditioning: source("Towards a common definition of acquired deconditioning in hospital", "BMJ Open", "https://bmjopen.bmj.com/content/bmjopen/15/1/e086976.full.pdf"),
  nagpurAhrq: source("Best practices for identifying and managing deconditioning", "Agency for Healthcare Research and Quality", "https://www.ahrq.gov/sites/default/files/wysiwyg/nursing-home/best-practices-managing-deconditioning.pdf"),
  nagpurNiceCritical: source("Rehabilitation after critical illness in adults", "NICE", "https://www.nice.org.uk/guidance/cg83/chapter/Recommendations"),
  nagpurWhoRehab: source("Rehabilitation", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/rehabilitation"),
  nagpurBgs: source("The evidence to help end deconditioning in hospital", "British Geriatrics Society", "https://www.bgs.org.uk/blog/what%E2%80%99s-the-evidence-to-help-end-deconditioning-in-hospital"),
  nagpurEspen: source("Clinical nutrition and hydration in geriatrics", "ESPEN", "https://www.espen.org/files/ESPEN-Guidelines/ESPEN_practical_guideline_Clinical_nutrition_and_hydration_in_geriatrics.pdf"),
  nagpurNutritionNice: source("Nutrition support for adults", "NICE", "https://www.nice.org.uk/guidance/cg32/chapter/Recommendations"),
  nagpurMust: source("MUST malnutrition universal screening tool", "BAPEN", "https://www.bapen.org.uk/pdfs/must/must_full.pdf"),
  nagpurHealthyDiet: source("Healthy diet", "World Health Organization", "https://www.who.int/news-room/fact-sheets/detail/healthy-diet"),
  nagpurMalnutrition: source("Malnutrition", "NHS", "https://www.nhs.uk/conditions/malnutrition/"),
  nagpurStrokeExercise: source("Exercise after stroke", "American Heart Association", "https://www.heart.org/-/media/Stroke-Files/Stroke-Resource-Center/Recovery/Patient-Focused/Exercise-After-Stroke.pdf?sc_lang=en"),
  nagpurAerobicStroke: source("Aerobic exercise after stroke", "Heart and Stroke Foundation", "https://www.heartandstroke.ca/stroke/recovery-and-support/stroke-care/stroke-rehabilitation/aerobic-exercise"),
  nagpurStrokeEvidence: source("Optimizing activity and community participation after stroke", "Canadian Stroke Best Practices", "https://www.strokebestpractices.ca/-/media/1-stroke-best-practices/rrcp-part-3/evidence_table4a.pdf?rev=30631b5bf43e4df48dfaf5f6a30a6e8a"),
  nagpurStrokeNice: source("Stroke rehabilitation in adults", "NICE", "https://www.nice.org.uk/guidance/ng236/chapter/Recommendations"),
  nagpurStrokeNhs: source("Recovering from a stroke", "NHS", "https://www.nhs.uk/conditions/stroke/recovery/"),
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

### What a physiotherapist assesses

${assessment}

The assessment is not a formality before an exercise sheet. It is how the clinician separates a familiar rehabilitation problem from a new medical change, identifies the task that matters to the person, and decides what requires supervision or another professional. The person’s discharge records, medicines, precautions, equipment, fatigue pattern, and family observations are part of the clinical picture.

### How rehabilitation can progress

${progression}

Progress is not the same as adding distance, repetitions, weight, or intensity on a calendar. It can mean better control, less assistance, safer decision-making, improved recovery, or greater confidence in one meaningful task. The clinician should explain what to watch during the activity and after it, and when a change means the plan needs review.

### What to expect from a home physiotherapy session

${homeSession}

A home visit may include observation of a real route, chair, bed, bathroom, dining area, or family routine. It may also include education, coordination with the treating team, and a written plan for tasks that are independent, supervised, or not yet appropriate. A home session does not authorize changing medication, oxygen, food texture, weight-bearing restrictions, or a surgical precaution.

### Do

- ${dos}
- Keep a short record of the symptom, task, assistance, food or swallowing concern, and later response that the clinician asked you to observe.
- Share discharge summaries, medication changes, restrictions, equipment, and new symptoms before a programme is progressed.

### Don’t

- ${donts}
- Do not copy another person's protocol or use one good day as proof that a larger workload is safe.
- Do not delay medical review for a new or rapidly changing symptom because it appears during rehabilitation.

### Safety and when to seek medical advice

${safety}

${commonBooking}`;
}

const thiruvananthapuramParkinsonPhysio = articleContent({
  opening: "Freezing can make a first step, a turn, or a doorway feel unexpectedly unavailable even when a person was walking a moment earlier. Parkinson's freezing is not a test of effort or courage. A focused physiotherapy assessment can identify the situations that trigger it, practise safer responses, and reduce the chance that a family member rushes or pulls the person.",
  context: "Thiruvananthapuram's authored profile includes Parkinson's physiotherapy and neurological rehabilitation. The article uses the city as the home setting for a focused movement question, not as evidence of a local prevalence or outcome. A route through a bedroom, bathroom, gate, lift, or familiar neighbourhood may reveal a different problem from walking in an uncluttered room.",
  assessment: "The therapist asks when the feet feel stuck, whether it happens at gait initiation, turns, narrow spaces, dual-task moments, or medication OFF periods, and what the person does next. They observe posture, step length, foot clearance, turning strategy, balance, attention, vision, footwear, walking aid use, and the family's guarding technique. They also screen for new weakness, fainting, injury, confusion, or a sudden change that is not typical freezing.",
  progression: "Practice may begin with one predictable trigger and a simple external cue selected by the clinician, such as a visual target, a rhythmic prompt, a weight-shift instruction, or a deliberate turn strategy. The route, support, attention demand, and supervision can change one at a time. A successful practice block is one in which the person retains control and can explain the stop rule, not one that ends in exhaustion or a near-fall.",
  homeSession: "A home visit can map the doorway, bathroom turn, bed-to-standing transition, or lift lobby where freezing creates risk. The therapist can show a caregiver how to give one calm cue, wait, and avoid pulling from the arm. They may discuss a walking aid, lighting, clutter, footwear, and the person's medication diary with the relevant clinician. The family should leave knowing which situations are independent, supervised, or deferred.",
  dos: "Pause when the feet freeze, use the assessed cue, widen the turn rather than pivoting abruptly, and keep the route clear.",
  donts: "Do not shout repeated instructions, pull the person through a stuck step, practise near stairs without the agreed supervision, or assume a cue that helped once is safe in every setting.",
  safety: "Any of these urgent signs requires medical assessment: a fall with significant injury, new one-sided weakness, new speech or vision change, fainting, severe headache, chest pain, or inability to walk. If freezing is rapidly increasing, falls are repeated, medication-related changes appear, confusion is marked, or gait suddenly changes from the person's usual pattern, arrange prompt review.",
});

const thiruvananthapuramParkinsonNutrition = articleContent({
  opening: "Parkinson's rehabilitation can raise nutrition questions that are easy to oversimplify. Appetite may change, constipation may become troublesome, swallowing may be less safe, and the timing or composition of meals may interact with a prescribed medicine plan. The useful question is not which universal diet to follow; it is which changes need a dietitian, swallowing clinician, neurologist, doctor, or pharmacist to review.",
  context: "A Thiruvananthapuram family may be helping with shopping, cooking, eating, medicines, and therapy in the same home. Parkinson's disease, other medical conditions, dentition, alertness, movement difficulty, and the person's preferences all affect the appropriate plan. No city profile can establish an individual calorie, protein, fluid, texture, supplement, or medication-timing prescription.",
  assessment: "The clinical conversation may cover appetite, unintentional weight change, constipation, nausea, chewing, coughing, wet voice, fatigue during meals, ability to sit upright, food access, medicines, and whether symptoms fluctuate through the day. A swallowing assessment may be needed when airway protection is uncertain. The treating team should also know about kidney, heart, diabetes, or fluid restrictions before any nutrition change is suggested.",
  progression: "Nutrition support can progress by clarifying one unanswered question at a time: making the meal environment safer, reducing avoidable fatigue, coordinating a medicine and food review, or arranging a formal swallowing assessment. Texture, fluid, protein distribution, supplements, and bowel treatments are options only when the responsible professionals have considered the whole person. Review is needed when symptoms, weight, intake, alertness, or medicines change.",
  homeSession: "A home physiotherapy session may identify whether the dining chair, transfer, posture, tremor, or fatigue makes eating harder. The therapist can help the family write down questions and coordinate them with the dietitian, speech-language or swallowing clinician, prescriber, and caregiver. The visit does not authorize thickening fluids, changing levodopa timing, starting supplements, or altering a prescribed diet.",
  dos: "Record meaningful changes in appetite, weight, bowel pattern, coughing, voice, meal duration, and assistance, then bring the record and medicine list to the clinical team.",
  donts: "Do not change food texture, restrict or increase fluids, rearrange protein, start supplements, or change a Parkinson's medicine schedule from an online suggestion.",
  safety: "Any of these concerns needs prompt medical, dietetic, and swallowing review: coughing or choking, a wet or gurgly voice, recurrent chest infections, unexplained weight loss, dehydration concern, inability to maintain intake, or suspected aspiration. If the person cannot breathe, handle secretions, or remain responsive, or has severe breathing difficulty, seek emergency care.",
});

const thiruvananthapuramParkinsonExercise = articleContent({
  opening: "Talking while walking, carrying a light item, answering a question, or changing attention can make movement less reliable for a person with Parkinson's disease. This is a cognitive-motor dual-task problem, not a competition. Exercise physiology can help the rehabilitation team decide when divided attention is relevant, how to measure the change in movement quality, and when a person should return to a single task.",
  context: "Thiruvananthapuram's Parkinson's and neurological rehabilitation profile provides the clinical context. The article is not a claim about local disease patterns. A dual-task demand may occur while walking to a bathroom, carrying a plate, speaking with family, or navigating a gate; the safest practice depends on freezing, balance, cognition, vision, hearing, medication fluctuations, and the environment.",
  assessment: "The professional compares a meaningful movement in a single-task condition with the same movement when a carefully selected second task is introduced. They look for shortened steps, hesitation, reduced foot clearance, loss of balance, slower responses, confusion, freezing, or a change in breathing and fatigue. The assessment also considers falls, medication ON/OFF periods, footwear, support, and whether the person can stop when attention or control deteriorates.",
  progression: "A plan may begin with a stable, well-understood single task, then add one simple cognitive or carrying demand under supervision. The clinician can alter the route, support, object, attention demand, or recovery one at a time. The target is not to keep adding distractions; it is to identify which everyday situations are safe, which need a strategy, and which should remain single-task activities.",
  homeSession: "A home visit can recreate a doorway, dining route, conversation while walking, or a safe carrying task. The therapist teaches the family to remove hazards, give one instruction, allow time, and guard without pulling. The person may practise in a quiet area before trying a more complex setting. The plan should state whether the task is independent, supervised, or not yet suitable.",
  dos: "Practise only the assessed task, use stable support, keep the secondary demand simple, and return attention to walking when movement quality changes.",
  donts: "Do not add hot drinks near stairs, practise alone after a near-fall, treat a dual-task score as a prediction of all community safety, or continue when the person is confused or visibly less steady.",
  safety: "Any of these urgent signs requires medical assessment: sudden weakness, new facial drooping, speech or vision change, collapse, severe headache, chest symptoms, or inability to walk. If near-falls repeat, confusion is new, freezing rapidly worsens, or movement clearly changes across medication states, arrange prompt neurological or rehabilitation review.",
});

const kozhikodeCopdPhysio = articleContent({
  opening: "Bathing, dressing, cooking, and household movement can become difficult when COPD makes ordinary effort feel breathless. The physiotherapy question is not how to push through the symptom. It is how to observe the task, reduce avoidable effort, coordinate breathing and movement, use appropriate support, and recognise when a change needs respiratory review.",
  context: "Kozhikode's authored profile includes COPD and pulmonary rehabilitation. The home setting may show a low bathroom seat, a long route to the kitchen, heat, stairs, carrying, or a family member who helps too quickly. Those are possible task factors, not claims about every Kozhikode home or a local COPD outcome. Diagnosis, medicines, oxygen instructions, comorbidities, and recent exacerbations determine the plan.",
  assessment: "The therapist asks which part of bathing or dressing creates the largest demand, whether breathlessness settles as expected, and whether cough, sputum, pain, dizziness, fatigue, or anxiety changes the task. They may observe sitting, standing, reaching, turning, clothing management, a short route, and the person's use of inhalers or prescribed equipment. New or changed respiratory symptoms are referred rather than explained away as deconditioning.",
  progression: "The clinician may change the order of a task, the height of a seat, the location of supplies, the amount carried, the pause pattern, or the assistance provided. Breathing coordination and energy conservation can be practised within a previously assessed activity. Progress means completing a meaningful task with better control and acceptable recovery, not meeting an online distance, oxygen, heart-rate, or repetition target.",
  homeSession: "A home session can watch the bathroom route, clothing setup, kitchen counter, chair, stairs, and caregiver technique. The therapist may suggest a safer arrangement, practise a recovery position, and explain the stop rule already agreed with the respiratory team. A teleconsultation can review a stable plan, but it should not clear an acute flare, change oxygen, or replace a pulmonary rehabilitation assessment.",
  dos: "Prepare supplies before starting, sit for tasks when advised, use the prescribed respiratory support, pace the sequence, and report a changed response.",
  donts: "Do not hold the breath during effort, rush to finish a task, alter oxygen or inhaler instructions, or treat severe breathlessness as a normal training sensation.",
  safety: "Stop and seek urgent care for severe or rapidly worsening breathlessness, chest pain or pressure, fainting, blue or grey lips, new confusion, inability to speak normally because of breathlessness, or a marked change in sputum and alertness. Seek prompt respiratory review for fever, coughing blood, repeated near-falls, a new symptom pattern, or activity intolerance that does not settle.",
});

const kozhikodeGeriatricNutrition = articleContent({
  opening: "Nutrition risk in older-adult rehabilitation is not always obvious from one meal or a single weight measurement. A person may be eating less, tiring during meals, struggling to chew, losing interest in food, or needing more help while also becoming weaker. Families can notice the pattern and ask for assessment without turning a screening tool into a diagnosis or a fixed diet.",
  context: "Kozhikode's authored profile includes geriatric rehabilitation. In a home, appetite and intake may be affected by pain, medicines, dentition, mood, cognition, swallowing, fatigue, food access, or the effort of reaching the dining area. The city does not determine an individual's calorie, protein, fluid, sodium, texture, or supplement requirement. Existing kidney, heart, diabetes, and swallowing advice must be respected.",
  assessment: "The clinical team may ask about unintentional weight change, reduced food or drink, chewing pain, dentures, coughing, wet voice, constipation, vomiting, repeated illness, fatigue during a meal, ability to sit upright, and the assistance needed. A screening result indicates that more assessment may be appropriate; it does not prescribe a menu. Dietitians, doctors, nurses, dental professionals, and swallowing clinicians may each answer different parts of the question.",
  progression: "A safe plan may improve access to familiar foods, protect dignity during assistance, address oral or dental barriers, coordinate a swallowing assessment, and review the response. The team may discuss fortification, supplements, texture, or fluids when clinically appropriate, but these choices depend on the person's risks and preferences. Progress can be a more reliable meal, safer swallowing, better participation, or earlier referral—not a universal weight target.",
  homeSession: "A physiotherapy visit can examine sitting balance, transfer effort, fatigue, reaching for a plate or cup, and the route to the dining area. The therapist can help the family record observations for the medical and nutrition team. They should not diagnose malnutrition, prescribe a supplement, thicken a drink, or change a fluid or texture plan without the responsible clinician.",
  dos: "Note changes in intake, weight, chewing, swallowing, alertness, and assistance, keep the medicine list available, and ask which professional should review each concern.",
  donts: "Do not force food, start a high-protein or high-fibre plan, restrict fluids, thicken drinks, or use a screening score as permission to ignore medical conditions.",
  safety: "Any of these concerns needs prompt professional assessment: repeated coughing or choking, wet voice, recurrent chest infections, marked intake reduction, dehydration concern, persistent vomiting, rapid weight change, or new confusion. If the person cannot swallow saliva, has severe breathing difficulty, collapses, or appears to be deteriorating after aspiration, seek urgent care.",
});

const kozhikodePrehabExercise = articleContent({
  opening: "Preparing for surgery can include more than arranging transport and reading the discharge sheet. When the surgical team says exercise or prehabilitation is appropriate, the aim is to understand the person's current reserve, practise useful movement, and coordinate nutrition, smoking, medicines, and medical conditions without promising a particular operation or recovery result.",
  context: "Kozhikode's authored profile includes post-surgery rehabilitation, so this article focuses on the period before a planned procedure and the questions that should be answered by the surgical and rehabilitation team. The appropriate activity depends on the operation, urgency, wound or pain status, heart and lung conditions, neurological symptoms, frailty, and the person's starting function. It is not a universal pre-surgery workout.",
  assessment: "The professional reviews the proposed operation and restrictions, recent symptoms, walking and transfer ability, stairs, strength, balance, breathlessness, fatigue, nutrition concerns, smoking or alcohol questions, medicines, and support at home. A short functional observation may be useful when safe. The team also checks whether a new symptom needs medical investigation before any conditioning plan begins.",
  progression: "A prehabilitation plan may use meaningful walking, strength, breathing, education, or daily-task practice selected after assessment. The clinician can adjust support, task order, surface, duration, recovery, and supervision rather than adding a fixed number of repetitions. The plan should connect to the first safe post-operative tasks and be revised if the operation, symptoms, or surgeon's instructions change.",
  homeSession: "A home session can examine the bed, toilet, stairs, chair, entrance, and caregiver support that will matter after discharge. Before surgery, the therapist may practise a safe transfer, discuss equipment questions, and identify what the family should ask the surgical team. The session does not clear a person for surgery or replace anaesthetic, medical, dietetic, or surgical assessment.",
  dos: "Bring the operation plan and medication list to the rehabilitation appointment, practise only the agreed activity, prepare the home route, and report a changed symptom response.",
  donts: "Do not start strenuous training, fasting, supplements, breathing drills, or a smoking or medicine change based on a generic prehabilitation article.",
  safety: "Pause and contact the surgical or medical team for chest symptoms, new breathlessness, fainting, fever, infection concerns, rapidly worsening pain, new neurological symptoms, or a sudden drop in function. Urgent assessment is needed for severe breathing difficulty, collapse, chest pain, new one-sided weakness, or confusion. Exercise must wait when the person's medical status is unstable.",
});

const visakhapatnamGbsPhysio = articleContent({
  opening: "After Guillain-Barré syndrome, a person may be able to complete a movement by borrowing effort from stronger muscles while the weaker muscles remain vulnerable. More exercise is not automatically better. Physiotherapy should reassess strength, fatigue, sensation, breathing, posture, and function so that practice rebuilds useful movement without treating exhaustion or compensation as progress.",
  context: "Visakhapatnam's authored profile includes Guillain-Barré and neurological rehabilitation. The city is the home setting for this focused question, not evidence of local prevalence, outcome, or service availability. The person's course, respiratory history, hospital records, sensation, pain, autonomic symptoms, and current medical advice matter more than a generic recovery timetable.",
  assessment: "The therapist reviews the onset and course of weakness, recent medical changes, breathing and swallowing history, fatigue after tasks, pain, sensation, joint range, skin, posture, transfers, walking, and the quality of motor control. They look for substitution, tremor, breath-holding, loss of form, and delayed deterioration. A new or progressive neurological symptom is not labelled ordinary post-GBS weakness without medical review.",
  progression: "Practice may start with positioning, supported movement, a functional transition, or a short task in which the person can keep control. Assistance, leverage, surface, task complexity, and recovery can change one at a time. The team may use later and next-day response as information, while avoiding universal repetitions, intensity, or a promised recovery timeline. A plateau or decline is a reason to reassess.",
  homeSession: "A home visit can identify the safest bed exit, chair transfer, bathroom route, walking aid, and caregiver position. The therapist can teach the family to support without pulling a weak limb, watch for quality loss, and record what happens after practice. Respiratory, swallowing, pain, skin, or autonomic concerns are coordinated with the medical team rather than managed by exercise alone.",
  dos: "Use the assessed support, stop before control deteriorates, allow the agreed recovery, and report delayed fatigue or a new weakness pattern.",
  donts: "Do not train to exhaustion, repeatedly test maximum strength, stretch a numb limb aggressively, or treat a stronger muscle's compensation as recovery of the affected one.",
  safety: "Any of these urgent signs requires medical assessment: new or worsening weakness, breathing difficulty, inability to handle secretions, new swallowing change, fainting, chest pain, collapse, or rapidly changing neurological function. If exhaustion is unusual or prolonged, falls repeat, severe pain is new, function is lost, or rehabilitation clearly deteriorates after stability, arrange prompt review.",
});

const visakhapatnamGbsNutrition = articleContent({
  opening: "Weakness after Guillain-Barré syndrome can make chewing, swallowing, sitting upright, and completing a meal unexpectedly tiring. Families need a way to describe the problem and ask for the right assessment. The safe message is not a fixed high-protein menu or a texture change from the internet; it is coordinated review of airway protection, intake, fatigue, and the person's medical plan.",
  context: "Visakhapatnam's neurological and Guillain-Barré care profile provides the context. During or after hospital care, the home may involve a caregiver, modified assistance, medicines, a feeding plan, or a person who cannot communicate fatigue easily. Respiratory weakness, facial weakness, alertness, dentition, posture, and medical restrictions all change the appropriate nutrition pathway.",
  assessment: "The team may ask about coughing or choking, wet voice, saliva, chewing, fatigue through a meal, breathlessness while eating, alertness, nausea, bowel function, weight or intake change, and the ability to sit safely. A swallowing screen is not the same as a full assessment, and a nutrition-risk concern is not a diagnosis. The doctor, dietitian, nurse, speech-language or swallowing clinician, and rehabilitation team may each contribute.",
  progression: "The plan may progress by improving posture and assistance, arranging a formal swallowing review, coordinating the feeding route, reducing avoidable mealtime fatigue, or reviewing medicines and bowel concerns. Texture, fluid, supplement, calorie, protein, and feeding-route decisions must be individualized. The goal is safe participation and adequate clinical support, not a universal meal plan or a deadline for normal eating.",
  homeSession: "A home physiotherapy visit may assess the chair, transfer, head and trunk support, fatigue, and the route to the dining area. The therapist can help the family make a clear referral note and identify which tasks need supervision. They should not change a tube-feeding plan, thicken fluids, recommend supplements, or override a prescribed restriction.",
  dos: "Record coughing, voice change, meal fatigue, intake concerns, alertness, and assistance needs, and share them promptly with the treating team.",
  donts: "Do not offer food or drink when the person is too drowsy to manage it, alter texture or tube feeding without review, or assume a cough is harmless because it happens only at the end of a meal.",
  safety: "Any of these concerns needs prompt clinical and swallowing review: new choking, wet or gurgly voice, inability to swallow saliva, breathlessness during eating, recurrent chest symptoms, dehydration concern, rapidly reduced intake, or altered alertness. If the person cannot breathe, turns blue or grey, collapses, or has severe airway difficulty, seek emergency care.",
});

const visakhapatnamGbsBreathingExercise = articleContent({
  opening: "Breathing-focused exercise after Guillain-Barré syndrome is not a routine extension of a walking programme. When respiratory muscles, cough, swallowing, or ventilatory support have been affected, the first question is whether the medical and rehabilitation team has assessed airway protection, secretion clearance, respiratory reserve, and the reason for any new breathlessness.",
  context: "Visakhapatnam's cardiopulmonary and Guillain-Barré conditions make respiratory review a useful patient question, but the city does not establish a local pathway or outcome. A person's history of ventilation, intensive care, aspiration, weak cough, autonomic symptoms, infection, or current oxygen and equipment instructions must be reviewed before any breathing-focused exercise is considered.",
  assessment: "The clinician reviews breathing at rest and with a safe task, cough strength, secretion handling, voice, swallowing, fatigue, posture, chest symptoms, previous ventilatory support, medicines, and the medical team's instructions. They consider whether a respiratory physiotherapist, pulmonologist, neurologist, speech-language clinician, or other specialist needs to assess the person. A home exercise article cannot determine respiratory muscle weakness from symptoms alone.",
  progression: "If the treating team approves a plan, progression is based on the person's measured response, technique, recovery, airway protection, and changing medical status. A clinician may alter position, support, task demand, rest, or supervision, but the article must not prescribe breath holds, inspiratory loads, repetitions, oxygen targets, or a recovery timeline. Any new respiratory symptom changes the question from progression to review.",
  homeSession: "A home session can examine posture, transfers, cough-related effort, equipment placement, and the family's understanding of the stop rule. It may help the person communicate with the respiratory and neurological team. It does not replace respiratory testing, medical clearance, airway assessment, or the team managing oxygen, ventilation, suction, or feeding.",
  dos: "Keep respiratory instructions and equipment guidance available, report changes in cough or swallowing, and use only the breathing plan explicitly assessed by the treating team.",
  donts: "Do not start resistance breathing, breath holds, oxygen changes, airway-clearance manoeuvres, or strenuous exercise because a general rehabilitation article recommends them.",
  safety: "Any of these urgent symptoms requires medical assessment: new or worsening breathlessness, inability to clear secretions, choking or swallowing difficulty, blue or grey lips, confusion, fainting, chest pain, collapse, rapidly worsening weakness, or inability to speak normally because of breathing difficulty. These symptoms are not a home exercise progression problem.",
});

const nagpurDeconditioningPhysio = articleContent({
  opening: "An older person may return home from hospital weaker, slower, less steady, or less confident without one single injury explaining every difficulty. Home physiotherapy can identify what changed, assess the real daily tasks, and coordinate a safe rebuilding plan. It should not assume that every post-hospital decline is simple deconditioning or that a generic exercise sheet is appropriate.",
  context: "Nagpur's authored profile includes geriatric physiotherapy and post-surgery rehabilitation. The home may reveal a low bed, a difficult toilet route, a new walking aid, stairs, caregiver strain, or medication-related dizziness. These are assessment questions, not claims about local hospital outcomes. The discharge diagnosis, weight-bearing status, wounds, cognition, infection risk, heart and lung conditions, and family support guide the plan.",
  assessment: "The therapist reviews the hospital course and observes alertness, bed mobility, transfers, standing, walking, turning, toileting, stairs, pain, breathlessness, fatigue, cognition, balance, skin, equipment, and caregiver technique when safe. They ask what was possible before admission and what is now different. Fever, acute confusion, new weakness, chest symptoms, or a sudden decline requires medical assessment rather than a harder rehabilitation session.",
  progression: "A plan may rebuild one meaningful transition, route, or self-care task with support matched to risk. Surface, assistance, walking aid, distance, task order, and recovery can change one at a time. The team can coordinate with the discharging service and review whether function later that day or the next morning is stable. Improvement is not promised on a fixed timeline, and a plateau can signal a new problem.",
  homeSession: "A home visit can practise the bed-to-chair transfer, bathroom route, chair rise, doorway, lift, or short walk that the person actually needs. The therapist can label independent, supervised, and deferred tasks, show a caregiver where to stand, and check that equipment is being used as assessed. They may recommend medical, occupational, nursing, or dietetic review when the barrier is not primarily movement.",
  dos: "Keep discharge instructions visible, clear the route, use the assessed aid, allow recovery, and tell the team when function is worse than the person's recent baseline.",
  donts: "Do not pull a person by the arms, remove a prescribed restriction, practise stairs alone after a new admission, or call sudden deterioration ordinary weakness.",
  safety: "Seek urgent assessment for chest pain, severe breathlessness, fainting, new confusion, new focal weakness, sudden inability to stand or walk, fever with rapid decline, or a fall with injury. Contact the treating team promptly for worsening wound symptoms, new pain, repeated near-falls, persistent dizziness, or functional decline that does not settle.",
});

const nagpurOlderNutrition = articleContent({
  opening: "Chewing, swallowing, poor appetite, and the effort of sitting through a meal can make older-adult rehabilitation harder. Families can help by noticing the pattern and asking the clinical team the right questions. A screening tool or a general healthy-diet page cannot decide an individual's calories, protein, fluids, texture, sodium, supplements, or feeding route.",
  context: "Nagpur's profile includes geriatric physiotherapy and post-surgery rehabilitation. After illness or hospitalisation, eating may be affected by dentures, mouth pain, medicines, constipation, fatigue, cognition, mood, swallowing, or the distance to the dining area. These factors need individualized assessment, particularly when kidney, heart, diabetes, fluid, or post-operative instructions are also present.",
  assessment: "A professional may ask about unintentional weight change, interest in food and drink, chewing pain, denture fit, coughing, wet voice, repeated chest infections, nausea, vomiting, bowel changes, meal duration, alertness, posture, and assistance. BAPEN-style screening can flag risk but is not a self-diagnosis. A dietitian, doctor, dental professional, nurse, or swallowing clinician may need to review different parts of the problem.",
  progression: "Support can progress by improving access, treating oral barriers, arranging a swallowing assessment, protecting dignity during assistance, and coordinating a practical plan with medical restrictions. Foods, supplements, fluid or texture changes should be selected by the responsible team. A useful outcome may be safer eating, less fatigue at meals, more reliable intake, or earlier escalation rather than a target weight or a copied menu.",
  homeSession: "A home physiotherapy visit can review sitting posture, the transfer to the dining chair, reaching for a plate, fatigue after mobility practice, and caregiver positioning. The therapist can help the family document questions for the nutrition and medical team. The session does not diagnose malnutrition or authorize a supplement, fluid restriction, texture change, or feeding-plan alteration.",
  dos: "Record what changed, when it changed, the assistance needed, and any cough or voice change, then bring the record and medicine list to the treating team.",
  donts: "Do not force food, start supplements, impose a high-protein or high-fibre plan, thicken fluids, or restrict drinks without checking the person's swallowing and medical conditions.",
  safety: "Any of these concerns needs prompt clinical review: coughing or choking, wet voice, recurrent chest infections, inability to swallow saliva, persistent vomiting, dehydration concern, rapid intake or weight decline, or new confusion. If breathing becomes severely difficult, the person collapses, or aspiration-related deterioration is suspected, seek urgent care.",
});

const nagpurStrokeExercise = articleContent({
  opening: "After a stroke, aerobic activity may be part of rebuilding participation, but it is not a stand-alone test of fitness. The person may need help with walking, communication, balance, cognition, vision, fatigue, or cardiac and respiratory conditions. Exercise physiology should connect aerobic work to the stroke team's assessment and to a meaningful activity goal.",
  context: "Nagpur's authored profile includes stroke rehabilitation and neurological physiotherapy. The home setting may be a short corridor, courtyard, building entrance, or community route. This article does not promise a local outcome or set a universal pulse, oxygen, intensity, repetition, hydration, or recovery target. Stroke type, time since stroke, medicines, falls, and comorbidities must be reviewed.",
  assessment: "The clinician considers the stroke history, new neurological symptoms, walking or wheelchair mobility, balance, communication, attention, vision, fatigue, pain, blood-pressure symptoms, heart and lung status, and the support available. A safe functional observation may compare the effort and quality of a meaningful route. The team also checks whether a person can understand the stop rule and communicate a symptom.",
  progression: "A plan may begin with an assessed task and change support, surface, route, duration, recovery, or supervision one at a time. Aerobic work can be paired with education and task practice when the stroke team considers it appropriate. The response during the task, later that day, and the next day helps guide review. A copied video or a calendar-based progression cannot replace individualized assessment.",
  homeSession: "A home visit can map the route to the gate, lift, bathroom, or chair and identify whether the barrier is endurance, balance, weakness, communication, fatigue, or the environment. The therapist can teach the family how to guard and when to stop. The person may need coordinated review by a doctor, neurologist, cardiac or respiratory clinician, occupational therapist, or speech-language professional.",
  dos: "Use the assessed support, communicate symptoms early, keep the route clear, and connect practice to a meaningful daily or community task.",
  donts: "Do not exercise alone after a recent neurological change, chase a heart-rate target copied online, or interpret one easier walk as clearance for a longer route.",
  safety: "Any of these urgent signs requires assessment: new facial droop, one-sided weakness or numbness, speech or vision change, sudden severe headache, chest pain, fainting, severe breathlessness, confusion, or a fall with injury. If near-falls repeat, palpitations are new, fatigue is unusual, or recovery declines, contact the treating team promptly.",
});

const posts: BatchCityJournalPost[] = [
  {
    id: "city-journal-thiruvananthapuram-parkinson-freezing",
    slug: "parkinsons-freezing-turning-home-physiotherapy-thiruvananthapuram",
    title: "Parkinson's Freezing and Turning in Thiruvananthapuram: Safer Home Physiotherapy",
    metaTitle: "Parkinson's Freezing Physiotherapy in Thiruvananthapuram",
    metaDescription: "A Thiruvananthapuram guide to Parkinson’s freezing at starts, turns, and doorways, with assessment, cueing, home practice, and urgent review boundaries.",
    excerpt: "How families in Thiruvananthapuram can respond to Parkinson's freezing at starts, turns, and doorways without rushing or pulling the person.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "thiruvananthapuram",
    discipline: "physiotherapy",
    content: thiruvananthapuramParkinsonPhysio,
    sources: [refs.tvmParkinsonGuideline, refs.tvmFreezing, refs.tvmFalls, refs.tvmParkinsonFalls, refs.tvmFreezingReview],
  },
  {
    id: "city-journal-thiruvananthapuram-parkinson-nutrition",
    slug: "parkinsons-rehabilitation-nutrition-appetite-swallowing-medicines-thiruvananthapuram",
    title: "Nutrition Questions in Parkinson's Rehabilitation in Thiruvananthapuram",
    metaTitle: "Parkinson's Rehabilitation Nutrition in Thiruvananthapuram",
    metaDescription: "A cautious Thiruvananthapuram guide to appetite, swallowing, constipation, food and medicines, and the questions families should take to the care team.",
    excerpt: "What families can ask when Parkinson's symptoms affect appetite, swallowing, constipation, or the relationship between food and medicines.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "thiruvananthapuram",
    discipline: "nutrition",
    content: thiruvananthapuramParkinsonNutrition,
    sources: [refs.tvmParkinsonDiet, refs.tvmParkinsonNutrition, refs.tvmDietitians, refs.tvmDysphagia, refs.tvmDysphagiaGuideline],
  },
  {
    id: "city-journal-thiruvananthapuram-parkinson-dual-task",
    slug: "dual-task-exercise-parkinsons-rehabilitation-thiruvananthapuram",
    title: "Dual-Task Exercise in Parkinson's Rehabilitation in Thiruvananthapuram",
    metaTitle: "Dual-Task Exercise for Parkinson's in Thiruvananthapuram",
    metaDescription: "A safety-first Thiruvananthapuram guide to cognitive-motor dual-task exercise, attention, balance, supervision, and when to return to single-task movement.",
    excerpt: "How Parkinson's rehabilitation can assess talking, carrying, and attention while moving without treating divided attention as a test of willpower.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "thiruvananthapuram",
    discipline: "exercise-physiology",
    content: thiruvananthapuramParkinsonExercise,
    sources: [refs.tvmDualReview, refs.tvmDualAdvances, refs.tvmExerciseGuideline, refs.tvmMotorFluctuations, refs.tvmExerciseMeta],
  },
  {
    id: "city-journal-kozhikode-copd-tasks",
    slug: "copd-physiotherapy-everyday-tasks-kozhikode",
    title: "COPD Physiotherapy in Kozhikode: Making Everyday Tasks Safer When Breathlessness Limits Activity",
    metaTitle: "COPD Physiotherapy for Daily Tasks in Kozhikode",
    metaDescription: "A practical Kozhikode guide to COPD physiotherapy for bathing, dressing, household tasks, pacing, breathing coordination, and respiratory review today.",
    excerpt: "How Kozhikode families can connect COPD rehabilitation with bathing, dressing, and household tasks without pushing through unsafe breathlessness.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Cardiopulmonary Rehabilitation",
    image: "/images/journal/journal_cardiopulmonary-rehabilitation.jpg",
    citySlug: "kozhikode",
    discipline: "physiotherapy",
    content: kozhikodeCopdPhysio,
    sources: [refs.kozhikodePulmonary, refs.kozhikodeAts, refs.kozhikodeCopd, refs.kozhikodeDailyTasks, refs.kozhikodeAtsGuideline],
  },
  {
    id: "city-journal-kozhikode-geriatric-nutrition",
    slug: "nutrition-risk-geriatric-rehabilitation-kozhikode",
    title: "Nutrition Risk During Geriatric Rehabilitation in Kozhikode",
    metaTitle: "Nutrition Risk During Geriatric Rehabilitation in Kozhikode",
    metaDescription: "A cautious Kozhikode guide to reduced intake, weight change, chewing, swallowing, fatigue, screening, and when older adults need nutrition review today.",
    excerpt: "What Kozhikode families should notice when appetite or intake changes during older-adult rehabilitation, and what to ask the clinical team.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "kozhikode",
    discipline: "nutrition",
    content: kozhikodeGeriatricNutrition,
    sources: [refs.kozhikodeDysphagia, refs.kozhikodeNutritionNice, refs.kozhikodeEspen, refs.kozhikodeMalnutrition, refs.kozhikodeBda],
  },
  {
    id: "city-journal-kozhikode-surgery-prehab",
    slug: "prehabilitation-exercise-before-surgery-kozhikode",
    title: "Prehabilitation Exercise Before Surgery in Kozhikode: Assessment and Safe Preparation",
    metaTitle: "Prehabilitation Exercise Before Surgery in Kozhikode",
    metaDescription: "A careful Kozhikode guide to prehabilitation before planned surgery, including assessment, daily function, coordination, progression, and stop signs apply.",
    excerpt: "How Kozhikode patients can ask whether prehabilitation is appropriate before planned surgery without copying a universal workout.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "kozhikode",
    discipline: "exercise-physiology",
    content: kozhikodePrehabExercise,
    sources: [refs.kozhikodeAcs, refs.kozhikodePrehabNhs, refs.kozhikodePrehabReview, refs.kozhikodeOrthoPrehab, refs.kozhikodeCpoc],
  },
  {
    id: "city-journal-visakhapatnam-gbs-physio",
    slug: "guillain-barre-physiotherapy-overwork-weakness-visakhapatnam",
    title: "Guillain-Barré Physiotherapy in Visakhapatnam: Rebuilding Movement Without Overwork Weakness",
    metaTitle: "Guillain-Barré Physiotherapy in Visakhapatnam",
    metaDescription: "A safety-first Visakhapatnam guide to Guillain-Barré physiotherapy, motor substitution, fatigue, functional assessment, and clinician-led progression.",
    excerpt: "How Visakhapatnam families can rebuild movement after Guillain-Barré syndrome while watching for overwork weakness and changing neurological symptoms.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Neuro Rehabilitation",
    image: "/images/journal/journal_neurological-rehabilitation.jpg",
    citySlug: "visakhapatnam",
    discipline: "physiotherapy",
    content: visakhapatnamGbsPhysio,
    sources: [refs.vizagGbsGuideline, refs.vizagGbsReview, refs.vizagApta, refs.vizagGbsTreatment, refs.vizagMayo],
  },
  {
    id: "city-journal-visakhapatnam-gbs-nutrition",
    slug: "nutrition-swallowing-after-guillain-barre-visakhapatnam",
    title: "Nutrition and Swallowing Questions After Guillain-Barré Syndrome in Visakhapatnam",
    metaTitle: "Nutrition & Swallowing After Guillain-Barré | Goswami Rehab",
    metaDescription: "A cautious Visakhapatnam guide to chewing, swallowing, meal fatigue, aspiration risk, and coordinated nutrition questions after Guillain-Barré syndrome.",
    excerpt: "What families should ask when Guillain-Barré weakness affects chewing, swallowing, or the energy needed to eat.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "visakhapatnam",
    discipline: "nutrition",
    content: visakhapatnamGbsNutrition,
    sources: [refs.vizagGbsCare, refs.vizagSupportive, refs.vizagRespiratory, refs.vizagSwallowing, refs.vizagNiceSwallowing],
  },
  {
    id: "city-journal-visakhapatnam-gbs-breathing",
    slug: "breathing-focused-exercise-after-guillain-barre-visakhapatnam",
    title: "Breathing-Focused Exercise After Guillain-Barré Syndrome in Visakhapatnam",
    metaTitle: "Breathing Exercise After Guillain-Barré | Goswami Rehab",
    metaDescription: "A Visakhapatnam guide to respiratory-muscle assessment, cough, swallowing, ventilatory history, clearance, and new urgent symptoms after Guillain-Barré.",
    excerpt: "What families should ask before breathing-focused exercise is considered after Guillain-Barré-related breathing weakness or ventilatory support.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "visakhapatnam",
    discipline: "exercise-physiology",
    content: visakhapatnamGbsBreathingExercise,
    sources: [refs.vizagRespiratoryReview, refs.vizagCriticalReview, refs.vizagNeuromuscularReview, refs.vizagGbsRespiratory, refs.vizagRespiratory],
  },
  {
    id: "city-journal-nagpur-deconditioning-physio",
    slug: "older-adult-deconditioning-home-physiotherapy-nagpur",
    title: "After Hospitalisation in Nagpur: Home Physiotherapy for Older-Adult Deconditioning",
    metaTitle: "Home Physiotherapy for Older-Adult Deconditioning in Nagpur",
    metaDescription: "A practical Nagpur guide to post-hospital deconditioning, transfers, walking, daily function, caregiver technique, and when new weakness needs review.",
    excerpt: "How Nagpur families can assess and practise daily function when an older adult comes home weaker or less steady after hospitalisation.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Geriatric Rehabilitation",
    image: "/images/journal/journal_geriatric-rehabilitation.jpg",
    citySlug: "nagpur",
    discipline: "physiotherapy",
    content: nagpurDeconditioningPhysio,
    sources: [refs.nagpurDeconditioning, refs.nagpurAhrq, refs.nagpurNiceCritical, refs.nagpurWhoRehab, refs.nagpurBgs],
  },
  {
    id: "city-journal-nagpur-older-nutrition",
    slug: "older-adult-rehabilitation-nutrition-chewing-swallowing-nagpur",
    title: "Nutrition Questions for Older-Adult Rehabilitation in Nagpur",
    metaTitle: "Older-Adult Rehabilitation Nutrition in Nagpur",
    metaDescription: "A cautious Nagpur guide to appetite, chewing, swallowing, eating fatigue, malnutrition screening, and questions for the clinical team. Review matters.",
    excerpt: "What Nagpur families can ask when chewing, swallowing, poor appetite, or eating fatigue makes older-adult rehabilitation harder.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    authorProfile: BLOG_NUTRITION_AUTHOR_PROFILE,
    category: "Nutrition & Clinical Guidance",
    presentation: "nutrition-guidance",
    image: "/images/journal/journal_nutrition.jpg",
    citySlug: "nagpur",
    discipline: "nutrition",
    content: nagpurOlderNutrition,
    sources: [refs.nagpurEspen, refs.nagpurNutritionNice, refs.nagpurMust, refs.nagpurHealthyDiet, refs.nagpurMalnutrition],
  },
  {
    id: "city-journal-nagpur-stroke-aerobic",
    slug: "aerobic-exercise-after-stroke-nagpur",
    title: "Aerobic Exercise After Stroke in Nagpur: Building Capacity Around Real-World Function",
    metaTitle: "Aerobic Exercise After Stroke in Nagpur",
    metaDescription: "A safety-first Nagpur guide to post-stroke aerobic exercise, assessment, communication, balance, community routes, and urgent neurological stop signs.",
    excerpt: "How Nagpur patients can connect post-stroke aerobic exercise with a meaningful daily or community task without copying an intensity target.",
    date: "September 22, 2026",
    isoDate: "2026-09-22",
    author: "Dr. Rahul Goswami, PT",
    category: "Exercise Physiology",
    image: "/images/journal/journal_exercise-physiology.jpg",
    citySlug: "nagpur",
    discipline: "exercise-physiology",
    content: nagpurStrokeExercise,
    sources: [refs.nagpurStrokeExercise, refs.nagpurAerobicStroke, refs.nagpurStrokeEvidence, refs.nagpurStrokeNice, refs.nagpurStrokeNhs],
  },
];

export const cityJournalBatch4Posts = posts;