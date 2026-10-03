export type ServiceGuideEditorial = {
  sections: Array<{ heading: string; paragraphs: string[] }>;
  faqs: Array<{ question: string; answer: string }>;
};

export const serviceGuideEditorial: Record<string, ServiceGuideEditorial> = {
  "online-physiotherapy": {
    sections: [
      { heading: "A useful first conversation", paragraphs: [
        "Online physiotherapy can help when travel is difficult, when you live away from a suitable service, or when you need guidance between in-person appointments. A video consultation gives you time to describe your symptoms, show relevant movements, and explain the activities you want to resume. It is an educational and rehabilitation service, not a way to confirm a diagnosis from a screen. The clinician may recommend an in-person examination or another healthcare professional if the presentation cannot be assessed safely online.",
        "Before a session, choose a quiet, well-lit space and wear clothing that permits comfortable movement. Keep any discharge letters, imaging reports, medication list, walking aid, or exercise equipment nearby, but do not feel you need to interpret a scan yourself. Tell the physiotherapist what makes the problem better or worse, how it affects sleep and daily tasks, and what you have already tried. Honest information is more useful than performing a movement repeatedly to prove that you can do it."
      ] },
      { heading: "What a session may include", paragraphs: [
        "The session may cover a history, a visual movement assessment, functional questions, education, pacing, and a small number of exercises. You might demonstrate walking, a sit-to-stand task, shoulder movement, balance, or a sport-specific position if the space and safety allow. Exercises should be explained in terms of purpose, dosage, and how to respond if symptoms change. A plan can include reminders about breaks, workstation setup, sleep routines, or gradual activity rather than exercise alone.",
        "Remote care works best when the goals are specific and observable: walking to the bathroom, tolerating a desk shift, climbing stairs, or returning to a modified training session. Progress can be reviewed through function, confidence, movement quality, and symptom behaviour. Technology should not become a barrier; if the connection, camera angle, language, hearing, or cognition makes communication unreliable, ask about an alternative format or referral. Family support can be helpful, but the patient should remain involved in decisions whenever possible."
      ] },
      { heading: "Limits and safety", paragraphs: [
        "Online physiotherapy cannot replace urgent assessment, physical examination, wound review, hands-on assistance, or medical management when those are needed. Seek urgent local care for chest pain, severe breathlessness, fainting, a major injury, new loss of bladder or bowel control, rapidly worsening weakness, a new facial droop or speech problem, or confusion. After surgery, follow the operating team’s restrictions even if an online exercise suggestion appears reasonable. Do not alter medication, oxygen, braces, or weight-bearing instructions without the responsible clinician.",
        "The right plan depends on the condition, medical history, environment, and response over time. A general video or written routine cannot account for every risk. Stop an exercise that causes alarming symptoms, marked loss of balance, or a sustained and unusual deterioration, and contact an appropriate healthcare professional. Educational information on this page is not individual medical advice, and an online consultation does not promise a particular outcome or timeline."
      ] },
      { heading: "Preparing for follow-up", paragraphs: [
        "Between sessions, record the tasks that mattered to you rather than only a pain number. Note how long you walked, whether you needed help, how fatigue behaved later that day, and whether the exercise was manageable the next morning. These observations help a physiotherapist adjust the amount, speed, or complexity of practice. Recovery is rarely perfectly linear, and a quieter day may be appropriate after a demanding activity. Ask for clarification whenever an instruction is unclear instead of guessing.",
        "A follow-up should revisit the original goal, check safety, and decide whether the plan remains suitable. Referral may be recommended if symptoms do not behave as expected, if a medical issue becomes more likely, or if another profession is better placed to help. Online care is one part of coordinated healthcare. It should support informed participation and practical function, not encourage someone to delay necessary assessment."
      ] }
    ],
    faqs: [
      { question: "Can online physiotherapy diagnose me?", answer: "No. It can provide education, movement guidance, and rehabilitation planning, but some problems require an in-person examination or medical assessment." },
      { question: "What equipment do I need?", answer: "Usually a stable internet connection, a camera, and enough safe space to move. Use furniture or exercise equipment only when it is stable and appropriate." },
      { question: "When should I seek urgent care instead?", answer: "Seek local urgent help for chest pain, severe breathing difficulty, fainting, sudden neurological change, major trauma, or rapidly worsening weakness." }
    ]
  },
  "home-physiotherapy": {
    sections: [
      { heading: "Care in the place where life happens", paragraphs: [
        "Home physiotherapy brings assessment and rehabilitation into the environment that shapes everyday function. A therapist can see the route to the bathroom, the height of a chair, the stairs, the bed, or the space available for practice. This context can make goals more practical than a generic exercise list. The purpose is not to label a person from a home visit or promise a result; it is to understand movement, safety, and participation well enough to agree on a sensible next step.",
        "A first visit may include questions about health history, medicines, recent hospital care, pain, fatigue, falls, and the tasks that matter most. The therapist may observe transfers, walking, balance, reaching, or household activities. Tell them about assistance already provided and any restrictions from a doctor or surgeon. A family member or caregiver can contribute useful information, but consent, dignity, and the patient’s preferences should guide the visit."
      ] },
      { heading: "Building a practical programme", paragraphs: [
        "A home programme may combine movement practice, strengthening, balance work, breathing or endurance guidance, positioning, pacing, and education. The dosage should fit the person’s current capacity and the demands of the home. A useful exercise is one that can be performed safely and repeated consistently, not necessarily the most difficult exercise available. The plan may start with a small task, such as standing with controlled support, and progress when the response remains acceptable.",
        "Caregivers can learn safer ways to set up a transfer, encourage practice, and recognise fatigue without pulling, lifting, or doing every task for the person. Equipment suggestions should be individual and should not be purchased solely from a general webpage. Keep pathways clear, use prescribed walking aids correctly, and discuss footwear, lighting, and bathroom safety when falls are a concern. Rehabilitation should support independence while respecting the help a person genuinely needs."
      ] },
      { heading: "Medical coordination and boundaries", paragraphs: [
        "Home physiotherapy does not replace a doctor, nurse, occupational therapist, speech and language professional, dietitian, or surgeon when their input is required. A therapist may recommend referral when symptoms suggest infection, fracture, uncontrolled heart or lung disease, a new neurological event, or a problem outside physiotherapy scope. Post-operative care must follow the operating team’s wound, lifting, and weight-bearing instructions. Never change prescribed medicines or medical devices because an exercise feels difficult.",
        "Get urgent medical help for chest pain, severe breathlessness, collapse, sudden weakness, a new facial or speech change, confusion, uncontrolled bleeding, or a serious fall. A hot swollen joint with fever, new calf swelling, or rapidly worsening pain also needs prompt review. These warnings are not diagnoses, and absence of a warning sign does not make a home programme automatically suitable. Assessment and ongoing communication remain important."
      ] },
      { heading: "Measuring meaningful change", paragraphs: [
        "Progress can be measured in ways that matter to the person: fewer pauses on a walk, safer transfers, better tolerance of washing and dressing, improved confidence on stairs, or more participation in family life. Pain may change slowly or fluctuate while function improves, so it is not the only measure. Share delayed fatigue, increased swelling, sleep disruption, or symptoms that persist into the next day. The therapist can then adjust repetitions, resistance, rest, or the task itself.",
        "There is no universal home-visit timeline. Healing, diagnosis, strength, cognition, medical stability, support, and practice all affect the course. A good plan includes review points and a clear way to ask for help between visits. Educational material cannot account for an individual home or health history. The person and treating team should decide whether care should continue at home, move online, or be coordinated with another service."
      ] }
    ],
    faqs: [
      { question: "What should I prepare for a home visit?", answer: "Have relevant medical instructions available, clear a safe area, and think about the daily task you most want to improve." },
      { question: "Can a caregiver join?", answer: "Yes, with the patient’s agreement. Caregivers can learn safer support, but should not lift or pull without instruction." },
      { question: "Is home physiotherapy suitable after surgery?", answer: "It may be, but the programme must follow the surgeon’s restrictions and any concerns should be reviewed by the medical team." }
    ]
  },
  "nutritionist-dietitian-online": {
    sections: [
      { heading: "What online nutrition guidance can do", paragraphs: [
        "Online nutrition guidance can help you examine eating patterns, appetite, hydration, food access, activity, and practical routines from your own environment. A conversation may identify a manageable goal such as adding regular meals, planning food around exercise, or improving variety. It is not a substitute for medical nutrition therapy, diagnosis, or a physical assessment. Use the service to support informed choices, not to obtain a universal diet that ignores your health history.",
        "Before an appointment, consider a typical day of food and drink, recent weight changes, allergies, digestive symptoms, medicines, supplements, cultural preferences, budget, and the people who prepare meals. You do not need perfect records. Honest detail about skipped meals, stress eating, low appetite, or difficulty shopping helps the discussion stay realistic. A plan should fit your life and should be revised when it proves impractical rather than treated as a test of willpower."
      ] },
      { heading: "Recovery, energy, and strength", paragraphs: [
        "Food can support energy for rehabilitation, muscle maintenance, hydration, bowel regularity, and recovery after illness. Guidance may discuss meal timing, protein-containing foods, fluids, fibre, and ways to make meals easier when appetite or fatigue is low. The right balance differs with age, activity, symptoms, and medical conditions. Nutrition advice should work alongside physiotherapy, medical treatment, sleep, and social support; it cannot independently repair an injury or reverse every cause of weight change.",
        "People with kidney, liver, heart, metabolic, swallowing, gastrointestinal, or eating-related conditions may need individual medical nutrition care. A person using tube feeding, insulin, anticoagulants, or other significant medication should not make major changes without the responsible team. Do not start concentrated supplements, restrictive diets, fasting, or high-protein plans because of a social-media claim. A dietitian or doctor may need laboratory information and a fuller history before offering specific therapeutic advice."
      ] },
      { heading: "Safety, respect, and referral", paragraphs: [
        "Seek medical review for unintentional weight loss, persistent vomiting or diarrhoea, repeated choking, blood in stool or vomit, severe dehydration, new swelling, or an inability to eat and drink adequately. A sudden change in appetite can have medical or emotional causes. Nutrition conversations should avoid shame and should not assume that body size reveals health, habits, or motivation. Weight is one possible measure, not a verdict on a person’s effort or worth.",
        "Online care has limits when communication, privacy, cognition, safeguarding, or technology prevents a reliable conversation. Referral may be appropriate for suspected eating disorders, severe malnutrition, swallowing concerns, complex medical diets, or symptoms outside the service’s scope. This page offers general education rather than a prescription. Your doctor, registered dietitian, or relevant healthcare team should guide treatment decisions that carry medical risk."
      ] },
      { heading: "Turning advice into a routine", paragraphs: [
        "Small experiments are often more useful than an ambitious list of rules. You might prepare a convenient breakfast, keep water available, add a familiar protein source to one meal, or plan food for a therapy day. Review hunger, energy, digestion, enjoyment, affordability, and the ability to continue. If a change worsens symptoms or creates anxiety around food, pause and discuss it. The aim is a sustainable routine that supports participation in life and rehabilitation.",
        "Follow-up can look at what changed, what did not, and what barriers appeared. The plan may need coordination with caregivers, a medical team, or a physiotherapist. No responsible consultation can promise a particular weight, body shape, performance result, or recovery speed. Clear goals, consent, privacy, and appropriate referral are more important than an impressive-sounding programme."
      ] }
    ],
    faqs: [
      { question: "Is online nutrition advice a medical diet prescription?", answer: "Not by itself. Complex medical conditions may require a doctor or registered dietitian with access to your full clinical information." },
      { question: "Should I take protein or vitamin supplements?", answer: "Do not start supplements solely from general advice. Check medical conditions, medicines, diet, and the product with an appropriate clinician." },
      { question: "Can nutrition support physiotherapy?", answer: "Adequate energy, fluids, and suitable food can support participation, but nutrition does not replace assessment or rehabilitation." }
    ]
  },
  "exercise-physiologist": {
    sections: [
      { heading: "Exercise matched to your starting point", paragraphs: [
        "Exercise physiology guidance focuses on how your body responds to movement and how activity can be made more manageable. A conversation may explore your goals, current activity, fatigue, sleep, health history, medicines, previous injuries, and confidence. The purpose is to find a safe starting point, not to prove fitness or promise a transformation. A person returning after illness may need a very different plan from someone preparing for a sporting demand.",
        "An initial discussion can use simple functional observations such as walking tolerance, sit-to-stand, perceived effort, recovery, or the demands of work and recreation. More formal testing is considered only when suitable and safe. Tell the professional about dizziness, chest symptoms, unusual breathlessness, fainting, palpitations, or recent changes in health. Do not hide symptoms to obtain a harder programme; accurate information protects the quality of the plan."
      ] },
      { heading: "Progressive activity in real life", paragraphs: [
        "A programme may include aerobic activity, resistance exercise, mobility, balance, recovery strategies, and education about effort and rest. Progression can change one element at a time: duration, frequency, resistance, speed, terrain, or complexity. Everyday options such as walking, stairs, household tasks, or a bicycle may be more useful than specialised equipment. Rest is part of training, particularly when illness, pain, poor sleep, or a neurological condition affects recovery.",
        "Exercise should be connected to a meaningful purpose: carrying groceries, returning to work, managing a flight of stairs, or participating in a favourite activity. Track how you feel during activity and later that day or the next morning. A plan that repeatedly causes a prolonged setback needs review. Adaptations are not failure; they are a way to keep practice safe and consistent while capacity changes."
      ] },
      { heading: "When medical clearance matters", paragraphs: [
        "Exercise physiology guidance does not diagnose heart, lung, metabolic, neurological, or musculoskeletal disease. Medical clearance or coordination may be needed after a significant cardiac event, uncontrolled symptoms, recent surgery, serious infection, unexplained exercise intolerance, or a major change in medication. Follow prescribed limits for oxygen, heart rate, blood pressure, weight bearing, or fluid intake. Never substitute an online intensity target for instructions from your medical team.",
        "Stop and seek urgent help for chest pressure, severe breathlessness, fainting, blue lips, new confusion, collapse, or a sudden neurological change. Seek prompt review for repeated dizziness, new swelling, unusual palpitations, or symptoms that are worsening rather than settling. These examples are safety guidance, not a diagnosis. The right referral depends on your circumstances and local emergency arrangements."
      ] },
      { heading: "Reviewing the plan", paragraphs: [
        "Capacity is shaped by health, sleep, nutrition, stress, environment, previous training, and the consistency of practice. A review should ask whether the activity is safe, whether it helps the chosen task, and whether the dose is realistic. Use simple measures that you can repeat, such as a walk duration or number of comfortable sit-to-stands, while remembering that one measure cannot describe your whole health.",
        "There is no guaranteed rate of progress and no single programme for everyone. A responsible professional may reduce, pause, or redirect training when new information appears. Referral to a doctor, physiotherapist, dietitian, or another service is part of good care when the goal exceeds the scope of exercise guidance. General education on this page should not be used to design a demanding programme without assessment."
      ] }
    ],
    faqs: [
      { question: "Do I need to be fit before seeking exercise guidance?", answer: "No. The starting point should reflect your current capacity, symptoms, goals, and safety needs." },
      { question: "Can exercise replace medical treatment?", answer: "No. Exercise may support function and health, but it does not replace diagnosis, medicines, surgery, or medical monitoring." },
      { question: "What if I feel worse after a session?", answer: "Stop or reduce the activity and seek advice, especially if symptoms are severe, unusual, persistent, or associated with chest or neurological warning signs." }
    ]
  },
  "back-pain": {
    sections: [
      { heading: "Understanding a back-pain assessment", paragraphs: [
        "Back pain can affect sitting, lifting, sleep, work, walking, and confidence. An assessment looks at the whole pattern rather than treating a scan or one painful movement in isolation. You may be asked about onset, previous episodes, leg symptoms, general health, work demands, sleep, and what you hope to do again. The aim is to identify a safe rehabilitation direction, not to provide a diagnosis from a webpage or guarantee that pain will disappear.",
        "Many people benefit from staying gently active within tolerance and gradually rebuilding useful capacity. That may involve walking, changing positions, trunk and hip strengthening, mobility, pacing, and education about flare-ups. The best starting exercise depends on irritability, strength, neurological findings, and medical history. Avoid comparing your plan with somebody else’s routine, even when the labels sound similar."
      ] },
      { heading: "A gradual return to activity", paragraphs: [
        "A flare does not always mean that damage has occurred, but a meaningful change in symptoms deserves attention. Break prolonged sitting with comfortable movement, use lifting strategies that feel controlled, and build activity in small steps. A therapist may link exercise to a task such as placing a child in a chair, completing a work shift, or walking to a shop. Progress can include improved confidence and function, not only a lower pain score.",
        "Recovery often has good and difficult days. Record what happened before a flare, how long it lasted, and whether sleep or fatigue changed. This information helps distinguish a dose that needs adjusting from a task that needs assessment. Do not force through new weakness, worsening numbness, severe night symptoms, or a pattern that feels substantially different from previous episodes."
      ] },
      { heading: "Warning signs and referral", paragraphs: [
        "Seek urgent medical assessment for new bladder or bowel control changes, numbness around the groin, rapidly worsening leg weakness, major trauma, fever with severe back pain, unexplained weight loss, or severe pain with feeling systemically unwell. A sudden inability to walk or a new widespread neurological change also needs prompt attention. These signs do not identify one condition, but delaying assessment can be unsafe.",
        "Physiotherapy is not the right sole service for every presentation. Referral may be needed for suspected fracture, infection, cancer, inflammatory disease, significant neurological compromise, or uncontrolled medical illness. Imaging and medication decisions belong with the appropriate clinician. General education cannot account for pregnancy, osteoporosis, anticoagulation, recent surgery, or other factors that alter risk."
      ] },
      { heading: "Planning meaningful progress", paragraphs: [
        "A plan should name the activity you want to regain and the signs that tell you the dose is appropriate. Start with a tolerable amount, allow recovery, and progress only when the response is acceptable. Breathing, sleep, stress, work setup, and fear of movement may all influence the experience of pain. Addressing them is not dismissing the symptom; it is recognising that recovery involves the person’s whole context.",
        "There is no reliable universal timetable for back pain. Some episodes settle quickly, while recurring or complex symptoms need a longer programme and medical coordination. A review is an opportunity to reassess rather than simply increase exercises. This page is educational and does not replace an individual examination or advice from a qualified healthcare professional."
      ] }
    ],
    faqs: [
      { question: "Should I rest completely with back pain?", answer: "Complete bed rest is not generally a useful default, but activity should be adapted to symptoms and medical advice." },
      { question: "Do I need a scan before physiotherapy?", answer: "Not necessarily. A clinician decides whether imaging is appropriate based on history, examination, and warning signs." },
      { question: "When is back pain an emergency?", answer: "New bladder or bowel changes, groin numbness, rapidly worsening weakness, major trauma, fever, or severe systemic illness needs urgent assessment." }
    ]
  },
  "neck-pain": {
    sections: [
      { heading: "Looking beyond the painful spot", paragraphs: [
        "Neck pain may change how you turn your head, work at a screen, sleep, drive, lift, or take part in recreation. An assessment considers the symptom pattern, movement, strength, sensation, headaches, arm symptoms, recent injury, and general health. It should not assume that posture, a scan, or one tight muscle explains everything. The goal is a safe plan for function and confidence, not a promise of instant correction.",
        "Comfortable movement is often more useful than guarding the neck all day, but the appropriate amount varies. A plan may include gentle range of motion, shoulder and upper-back strengthening, breaks from static tasks, sleep-position experiments, and graded return to normal activity. Exercises should be selected after considering dizziness, nerve symptoms, trauma, and medical history. Stop guessing if a movement produces a new or spreading symptom."
      ] },
      { heading: "Work, sleep, and everyday habits", paragraphs: [
        "Screen work rarely has one perfect posture. Changing position, bringing work to a comfortable height, supporting the forearms, and taking brief movement breaks can reduce prolonged loading. Sleep advice should focus on comfort and adequate rest rather than expensive equipment. A therapist can help adapt lifting, driving, phone use, or exercise without suggesting that every symptom is caused by poor posture.",
        "Headaches associated with neck discomfort need careful history, particularly when they are new or unusually severe. Arm pain, pins and needles, or weakness may change the examination and referral decision. Keep a record of what brings symptoms on and how long they last. A manageable routine should leave room for daily life and should be changed if it repeatedly causes a delayed flare."
      ] },
      { heading: "Safety and scope", paragraphs: [
        "Urgent assessment is appropriate after significant trauma, sudden severe headache, fainting, new weakness, new speech or vision changes, loss of balance, confusion, fever with a very unwell feeling, or chest symptoms. Seek prompt review for progressive arm weakness, widespread numbness, or severe pain unlike your usual pattern. These warnings are not a diagnosis and local emergency guidance should be followed.",
        "Physiotherapy may not be the first step when vascular, neurological, infectious, inflammatory, or other medical problems are possible. Do not perform forceful neck manipulation from an online video. Medication, imaging, collars, and work restrictions require appropriate clinical advice. The information here supports questions for a healthcare professional; it cannot replace examination."
      ] },
      { heading: "Building confidence carefully", paragraphs: [
        "Neck recovery is influenced by injury, symptom sensitivity, sleep, stress, work demands, general conditioning, and prior episodes. Use meaningful goals such as checking a blind spot, completing a meeting, or carrying a light bag. Progress may be seen as smoother movement, fewer interruptions, or better tolerance even before symptoms are absent. A cautious, repeatable dose is more helpful than occasional forceful stretching.",
        "Review the plan when symptoms change, progress stalls, or the task becomes more demanding. A clinician may coordinate with a doctor, occupational health service, or another professional. No page can promise a fixed recovery period. Patient education should encourage safe participation while respecting warning signs and personal medical advice."
      ] }
    ],
    faqs: [
      { question: "Is neck pain always caused by posture?", answer: "No. Many factors can contribute, including injury, joint or muscle sensitivity, nerves, sleep, stress, and medical conditions." },
      { question: "Can I exercise with neck pain?", answer: "Often activity can be adapted, but new neurological symptoms, significant trauma, or severe unusual pain needs assessment first." },
      { question: "Should I try forceful neck manipulation?", answer: "Do not use forceful techniques from a video or unassessed advice. Ask an appropriate clinician about safe options." }
    ]
  },
  "knee-pain": {
    sections: [
      { heading: "Making sense of knee symptoms", paragraphs: [
        "Knee pain may affect stairs, squatting, walking, standing from a chair, work, or sport. An assessment considers swelling, movement, strength, balance, gait, the way symptoms respond to load, and any injury or operation. A painful knee is not automatically arthritis, and an image does not describe a person’s function by itself. The purpose is to plan safe activity and identify when another clinician needs to review the knee.",
        "Rehabilitation commonly addresses quadriceps, hip, calf, and whole-leg strength alongside mobility and task practice. The starting dose should reflect irritability and swelling. A little effort during exercise may be acceptable for some people, but a marked increase in swelling or function loss later suggests that the plan needs adjustment. Do not progress weight bearing beyond surgical or medical instructions."
      ] },
      { heading: "Load, confidence, and daily tasks", paragraphs: [
        "Knee care becomes more useful when it is connected to a chosen task. Practise a controlled sit-to-stand if chairs are difficult, step work if stairs matter, or gradual walking if endurance is limited. Pacing can distribute demanding activities across the day. Footwear, terrain, sleep, body weight, previous injury, and fear of movement may influence the experience, but no single factor explains every knee problem.",
        "A symptom diary can include activity, swelling, stiffness on waking, and the response later that day and the following morning. This helps identify a manageable training load without making pain the only measure. Strength and confidence often require regular practice. Short, repeatable sessions are preferable to a large effort followed by several days of avoidance."
      ] },
      { heading: "When to obtain medical review", paragraphs: [
        "Seek urgent care for a hot, very swollen knee with fever, a serious injury with inability to bear weight, a locked knee after trauma, sudden calf swelling, chest pain, new breathlessness, or rapidly worsening function. A painful knee with unexplained illness, repeated giving way, or progressive swelling also deserves appropriate review. These signs do not establish a diagnosis; they indicate that self-directed exercise may be unsafe.",
        "Physiotherapy should coordinate with a surgeon after reconstruction or replacement and with a doctor when inflammatory, infectious, vascular, or unexplained symptoms are possible. Do not change medication, braces, injections, or weight-bearing status from general online information. A referral can be a useful part of rehabilitation, not a failure of the exercise plan."
      ] },
      { heading: "Keeping progress realistic", paragraphs: [
        "Knee function is influenced by tissue healing, strength, range, balance, health, recovery, and the demands placed on it. Some people aim to walk around the house, while others want to return to running; those are different rehabilitation questions. Progression should follow examination findings and functional milestones. A quieter week may be appropriate after illness or a change in symptoms.",
        "There is no guaranteed timetable for knee pain. Review the plan when it stops helping, when swelling persists, or when the target activity changes. Patient-facing education can help you prepare questions, but only an individual assessment can decide whether a particular exercise, brace, or activity is suitable."
      ] }
    ],
    faqs: [
      { question: "Does knee pain mean I should stop all activity?", answer: "Not automatically. Activity can often be modified, but severe swelling, trauma, locking, or rapid loss of function needs assessment." },
      { question: "Can strengthening help knee osteoarthritis?", answer: "Strength and activity programmes may support function for some people, but the plan should be individual and does not guarantee symptom relief." },
      { question: "When should I seek urgent help?", answer: "Fever with a hot swollen knee, major injury, sudden calf swelling, chest symptoms, or inability to bear weight warrants prompt care." }
    ]
  },
  "sciatica": {
    sections: [
      { heading: "Leg symptoms need careful assessment", paragraphs: [
        "People use the word sciatica for back-related pain, tingling, numbness, or weakness that travels into the leg, but similar symptoms can have different causes. Assessment considers the distribution, onset, strength, sensation, reflexes, movement, cough or strain response, and the effect on walking and sleep. A webpage cannot determine the source. The aim is to decide what can be managed with rehabilitation and what needs medical review.",
        "When appropriate, a plan may include comfortable movement, walking, graded strengthening, education about positions, and pacing. Some people find that certain movements reduce leg symptoms while others increase them; the response matters more than a generic rule. Avoid repeatedly testing a painful movement or stretching aggressively. Share any change in weakness, sensation, balance, bladder, or bowel control promptly."
      ] },
      { heading: "Living while symptoms settle", paragraphs: [
        "Long periods in one position can be difficult, so change posture and take brief, tolerable movement breaks when safe. Adjust lifting, sitting, sleep, and work tasks rather than assuming you must stop everything. A therapist can help choose a starting level and explain how to progress. Function may improve before symptoms fully settle, and a flare does not automatically prove that damage has worsened.",
        "Track walking tolerance, sleep, leg strength, and the area affected, not just pain intensity. Notice whether symptoms are becoming more widespread, whether weakness affects a task, or whether recovery after activity is changing. A plan that causes progressive neurological symptoms is not a normal training response and needs review."
      ] },
      { heading: "Red flags and urgent referral", paragraphs: [
        "New bladder or bowel control changes, numbness around the groin, rapidly worsening weakness in one or both legs, severe trauma, fever with severe pain, or feeling acutely unwell requires urgent medical assessment. New foot drop, repeated falls, or inability to walk also warrants prompt review. These warning signs do not identify one diagnosis, but they should not be managed through an online exercise routine alone.",
        "Medical referral may be appropriate for suspected fracture, infection, inflammatory disease, significant nerve compromise, or symptoms that do not follow an expected pattern. Medication and imaging decisions belong to the appropriate clinician. Physiotherapy can support function when suitable, but it cannot replace neurological examination or emergency care."
      ] },
      { heading: "A cautious route back to activity", paragraphs: [
        "Progress depends on neurological findings, irritability, sleep, general health, work, confidence, and the activity you want to resume. Start with a tolerable task and build gradually, allowing time to observe the response. A plan may need several adjustments. Do not measure success against another person’s recovery or a promised deadline.",
        "Education should help you recognise what is safe to discuss and when to seek help. If symptoms worsen, new weakness appears, or the plan repeatedly causes a setback, pause and contact a qualified healthcare professional. This guide is general information, not a diagnosis or personal treatment prescription."
      ] }
    ],
    faqs: [
      { question: "Is every shooting leg pain sciatica?", answer: "No. Similar symptoms can have different causes, so an assessment is important, especially with weakness or numbness." },
      { question: "Should I stretch the nerve?", answer: "Do not use aggressive stretching without assessment. The appropriate movement depends on symptoms and neurological findings." },
      { question: "What symptoms need emergency care?", answer: "New bladder or bowel changes, groin numbness, rapidly worsening weakness, major trauma, fever, or inability to walk needs urgent review." }
    ]
  },
  "arthritis-osteoarthritis": {
    sections: [
      { heading: "Living with an arthritic joint", paragraphs: [
        "Arthritis and osteoarthritis can affect pain, stiffness, strength, confidence, and participation, but symptoms and daily impact differ widely. An assessment considers the joint involved, swelling, movement, function, health history, activity, sleep, and goals. A scan or label does not tell you exactly what you can do. Rehabilitation aims to support useful movement and self-management without claiming to cure a joint condition.",
        "Education may cover pacing, regular movement, strengthening, balance, walking, and ways to adapt demanding tasks. Exercise can be performed in different forms, including chair-based, water-based, home, or gym activity when appropriate. Begin at a level you can repeat and progress gradually. A temporary increase in effort is not necessarily harmful, but persistent swelling, severe pain, or deteriorating function should prompt review."
      ] },
      { heading: "Strength and participation", paragraphs: [
        "Strength supports everyday tasks such as rising from a chair, carrying, stairs, and walking. A programme can target the muscles around a joint while also building whole-body capacity. The best activity is one that matches your health, access, preferences, and goals. Pacing means planning activity and recovery, not avoiding movement indefinitely. Supportive footwear, walking aids, or environmental changes may help some people after individual advice.",
        "Weight, sleep, mood, work, previous injury, and other medical conditions can influence symptoms, but respectful care should not reduce the person to a number on a scale. Discuss barriers openly. A sustainable plan may include enjoyable movement, practical meal support, rest, and coordination with a doctor rather than an extreme programme."
      ] },
      { heading: "When the joint needs review", paragraphs: [
        "Seek urgent advice for a hot and very swollen joint with fever, sudden inability to bear weight, a major injury, a new locked joint, or rapidly worsening pain. New calf swelling, chest pain, or breathlessness also needs urgent care. Unexplained widespread symptoms or prolonged morning stiffness should be discussed with a doctor. These examples are not diagnostic; they indicate that general exercise advice is not enough.",
        "A physiotherapist may refer to a doctor, rheumatology service, orthopaedic team, dietitian, or another professional depending on the findings. Do not stop prescribed medicines or start supplements because of a general arthritis article. Injections, surgery, braces, and assistive devices need individual decisions."
      ] },
      { heading: "Reviewing change over time", paragraphs: [
        "Useful measures include walking distance, stair confidence, grip or leg function where relevant, sleep, participation, and the time needed to recover from activity. Symptoms may fluctuate with weather, illness, stress, and load, so one difficult day does not define progress. Likewise, a good day should not lead to an abrupt increase that causes a setback.",
        "There is no fixed course for arthritis or osteoarthritis. Review the plan when goals change, symptoms become unusual, or exercises are no longer manageable. This page provides conservative education only. Your treating team should account for your diagnosis, medicines, other health conditions, and preferences before recommending a programme."
      ] }
    ],
    faqs: [
      { question: "Should arthritis mean I avoid exercise?", answer: "Not generally. Appropriate movement may support function, but the type and dose should reflect your symptoms and health." },
      { question: "Can exercise cure osteoarthritis?", answer: "Exercise can support strength and function for some people, but it does not guarantee cure or remove every symptom." },
      { question: "When is a swollen joint urgent?", answer: "Fever with a hot swollen joint, major injury, sudden inability to bear weight, or rapid deterioration needs prompt medical review." }
    ]
  },
  "sports-injury-rehabilitation": {
    sections: [
      { heading: "From injury to a considered return", paragraphs: [
        "Sports injury rehabilitation starts with understanding what happened, what you can do now, the demands of your sport, and any medical assessment already completed. Pain alone does not identify the tissue or determine readiness to compete. The plan may need a physiotherapy examination, imaging, medical clearance, or coordination with a coach. The goal is a safe return to meaningful participation, not a promised date or a test of toughness.",
        "Early care may focus on protection, comfortable movement, swelling management, and maintaining suitable conditioning. Later stages can include strength, landing, running, change of direction, throwing, contact preparation, or sport-specific skill. Progression should match healing and control. Avoid copying a professional athlete’s programme or returning because a calendar deadline is approaching."
      ] },
      { heading: "Loading, recovery, and confidence", paragraphs: [
        "Training load includes practice, competition, gym work, commuting, sleep, and other stressors. Increase demands gradually and monitor symptoms during training and later that day or the next morning. Strength, range, balance, speed, and confidence should be considered together. A body part that feels fine in a quiet drill may still need preparation for fatigue, unpredictable movement, or contact.",
        "Rehabilitation also addresses the reason the sport matters. Someone may need to return to a team, a job, recreation, or a specific position, and each goal changes the testing process. Nutrition, hydration, sleep, and communication with a coach can support consistency, but they cannot override tissue healing or medical restrictions."
      ] },
      { heading: "Clearance and warning signs", paragraphs: [
        "Stop training and seek assessment for significant swelling, instability, deformity, inability to bear weight, locking, worsening weakness, numbness, severe pain, or symptoms after a head, neck, chest, or abdominal injury. Urgent care is needed for collapse, severe breathing difficulty, confusion, or a suspected fracture. These warnings are not a diagnosis and should be interpreted with local emergency guidance.",
        "After surgery, fracture, concussion, or a significant ligament or tendon injury, follow the responsible medical team’s clearance process. Physiotherapy does not replace a doctor, surgeon, or concussion clinician. Do not use a painkiller to hide symptoms and meet a training target. Referral is appropriate whenever the injury exceeds the service’s scope or recovery behaves unexpectedly."
      ] },
      { heading: "Testing a return responsibly", paragraphs: [
        "A return plan can move from daily tasks to controlled drills, then to faster, more complex, and more competitive demands. The exact steps depend on the sport and injury. A review should ask whether the relevant strength and movement quality are adequate, whether fatigue changes technique, and whether the person can recover between sessions. Passing one test does not guarantee that every competitive situation is safe.",
        "There is no universal rehabilitation timeline. Progress may pause for medical reasons, scheduling, fear, or a change in sport demands. Use open communication and adjust the programme rather than treating a setback as failure. Educational content cannot clear anyone for sport; an appropriate clinician must make that decision with the athlete."
      ] }
    ],
    faqs: [
      { question: "Can I train through sports injury pain?", answer: "Pain, swelling, instability, or loss of function should be assessed rather than ignored. Load may need modification." },
      { question: "When can I return to competition?", answer: "Return depends on the injury, healing, examination, sport demands, and relevant clearance; time alone is not enough." },
      { question: "Does this replace medical clearance?", answer: "No. Significant injuries, surgery, fractures, and concussion require the appropriate medical team." }
    ]
  },
  "post-surgery-rehab": {
    sections: [
      { heading: "Starting with the surgeon’s plan", paragraphs: [
        "Post-surgery rehabilitation should begin with the operation, discharge instructions, restrictions, wound information, medicines, and the goals agreed with the surgical team. Different operations have different precautions, even when they involve the same body region. A physiotherapist can translate instructions into transfers, walking, exercises, and daily tasks, but cannot replace the surgeon’s review or change a restriction independently.",
        "Tell the therapist about pain, swelling, sleep, dizziness, medication effects, home support, and the layout of your space. Early goals may include getting in and out of bed, using the bathroom, managing stairs, or using a walking aid safely. The programme should protect healing tissue while preventing unnecessary inactivity. Do not rush because one movement feels easy."
      ] },
      { heading: "Progressive function at home", paragraphs: [
        "As the medical plan allows, rehabilitation may progress range of motion, strength, gait, balance, endurance, and tasks such as dressing or lifting. The dose should be increased according to examination findings and the response later that day and the next morning. A caregiver can help prepare the environment and learn safe support, but should not lift, pull, or alter equipment without instruction.",
        "Recovery includes rest, nutrition, sleep, wound care, and follow-up appointments. Fatigue is common after illness or surgery and can make technique less safe. Plan demanding tasks, use prescribed aids, and keep pathways clear. A home exercise routine is not a substitute for returning to the surgeon when a wound, fever, pain pattern, or function changes."
      ] },
      { heading: "Complications need medical attention", paragraphs: [
        "Seek urgent medical review for fever, wound drainage, spreading redness, sudden swelling, severe calf pain, chest pain, new breathlessness, fainting, uncontrolled bleeding, or sudden loss of function. Follow the discharge plan for less urgent concerns too. A new or rapidly worsening symptom should not be explained away as normal recovery without checking.",
        "The rehabilitation service may refer back to the surgeon, doctor, nursing team, or another professional when the course differs from expectations. Do not change dressings, anticoagulants, pain medication, weight-bearing, or movement precautions based on general online information. These boundaries protect healing and help the right clinician respond quickly."
      ] },
      { heading: "Milestones without promises", paragraphs: [
        "Milestones can include safer transfers, improved walking, a particular range of movement, managing stairs, returning to work tasks, or tolerating daily activity. They are guides, not guarantees. Healing, the operation, complications, previous health, strength, home support, and consistency all affect progress. A slow week does not necessarily mean failure, while a quick improvement does not remove restrictions.",
        "Reviews should confirm what is allowed, what remains difficult, and which activity deserves the next small progression. Complex or neurological surgery may need coordinated long-term care. This page offers general education only and cannot determine whether a specific exercise or timeline is suitable for you."
      ] }
    ],
    faqs: [
      { question: "When should rehabilitation begin after surgery?", answer: "It depends on the operation and the surgeon’s instructions. Follow the discharge plan and ask if it is unclear." },
      { question: "Can I change weight-bearing if I feel better?", answer: "No. Weight-bearing and movement restrictions must be changed only by the responsible medical team." },
      { question: "Which post-operative symptoms are urgent?", answer: "Fever, wound drainage, sudden swelling, severe calf pain, chest symptoms, bleeding, or sudden loss of function need prompt review." }
    ]
  },
  "stroke-rehab": {
    sections: [
      { heading: "Rehabilitation after stroke", paragraphs: [
        "Stroke rehabilitation is shaped by the person’s movement, sensation, vision, communication, cognition, swallowing, fatigue, mood, medical stability, and goals. An assessment may look at bed mobility, transfers, sitting, standing, walking, arm use, and meaningful daily tasks. The goal is participation and safety, not a promise of a particular milestone. Stroke care often needs a coordinated team rather than physiotherapy alone.",
        "Practice is most useful when it has a clear purpose and can be repeated safely. A person might practise turning in bed, reaching for a cup, standing for grooming, or walking to a familiar room. Instructions should match attention, communication, and fatigue. Family members can support repetition, but should not pull on a weak arm or attempt a transfer without being taught."
      ] },
      { heading: "Supporting movement and independence", paragraphs: [
        "A programme may include task-specific practice, strength, balance, walking, endurance, positioning, falls prevention, and education about fatigue. The home environment can be adapted to reduce hazards and make useful practice possible. Progress may be seen in safer transfers, better confidence, more consistent arm use, or participation in a routine even when impairment remains.",
        "Fatigue after stroke can be substantial and may appear later rather than during an activity. Schedule practice around alertness, allow recovery, and monitor blood pressure or other limits advised by the medical team. Communication aids, carers, and occupational or speech and language professionals may be important. The person should be included in decisions as far as communication and capacity allow."
      ] },
      { heading: "Recognising a new emergency", paragraphs: [
        "Sudden new weakness or numbness, facial droop, speech or vision change, severe headache, new confusion, or abrupt loss of balance requires emergency stroke assessment. Do not wait to see whether it improves and do not drive if emergency services are needed. New chest pain, severe breathlessness, collapse, or a seizure also requires urgent help.",
        "Rehabilitation does not replace medical review, swallowing assessment, medication management, or emergency care. Refer back to the stroke or medical team for new symptoms, repeated falls, worsening alertness, poor intake, or concerns about seizures or blood pressure. Caregivers should receive individual instruction for transfers and equipment rather than relying on a general video."
      ] },
      { heading: "A person-centred longer view", paragraphs: [
        "Stroke recovery can change over weeks, months, and longer, and the pattern differs with the stroke and the person’s health and support. Avoid measuring recovery by one movement or comparing one person with another. Set goals around communication, self-care, mobility, work, hobbies, and relationships, then revisit them as priorities change. Small gains in safety and participation matter.",
        "A review should consider medical stability, practice quality, fatigue, mood, home safety, and what the person can do with less help. Some needs may require equipment, occupational therapy, speech and language therapy, psychology, nursing, or social support. This guide is educational and does not predict recovery or replace the person’s stroke team."
      ] }
    ],
    faqs: [
      { question: "Can stroke rehabilitation happen at home?", answer: "It may be appropriate when medically safe, with a plan adapted to the home and coordinated with the stroke team." },
      { question: "How can a caregiver help safely?", answer: "Follow individual transfer and positioning instruction. Do not pull a weak arm or lift a person without training." },
      { question: "What is a new stroke emergency?", answer: "Sudden weakness, facial droop, speech or vision change, severe headache, confusion, or abrupt balance loss needs emergency care." }
    ]
  },
  "parkinsons-rehab": {
    sections: [
      { heading: "Movement goals in Parkinson’s disease", paragraphs: [
        "Parkinson’s disease can affect speed, amplitude, balance, turning, walking, coordination, voice, fatigue, and confidence, but every person’s pattern is different. Rehabilitation begins with the activities that matter: getting out of a chair, turning in bed, walking outdoors, writing, working, or staying involved with family. A physiotherapist does not replace a neurologist or diagnose a change from a webpage.",
        "Assessment should consider medication timing, fluctuations, freezing, falls, dizziness, cognition, mood, sleep, vision, and other health conditions. Ask the treating team how exercise should fit around medicines and blood-pressure concerns. Clear instructions, external cues, rhythm, larger deliberate movements, strength, balance, and aerobic activity may be considered when suitable, but the programme must match the person’s abilities."
      ] },
      { heading: "Practice for daily independence", paragraphs: [
        "Practice can focus on starting movement, changing direction, stepping over a threshold, reaching, transfers, and safe walking in the actual home. Reduce clutter, improve lighting, and keep frequently used items accessible. A caregiver can offer a cue agreed with the therapist, but should avoid rushing or physically pulling someone through a freeze. Allow time and preserve dignity.",
        "Energy varies with medication cycles, sleep, stress, illness, and the task itself. Short, purposeful practice may be more effective than a long session that causes exhaustion. Track falls, near falls, freezing, dizziness, and the time of day symptoms occur. Share patterns with the medical team; they may affect medication or referral decisions."
      ] },
      { heading: "Falls, swallowing, and referral limits", paragraphs: [
        "Urgent medical care is needed for a serious fall, head injury, sudden new weakness, fainting, chest pain, severe breathlessness, or an abrupt change in speech or awareness. Repeated falls, new swallowing or choking concerns, hallucinations, severe confusion, or rapid decline need prompt communication with the responsible team. These signs are not simply exercise problems.",
        "Parkinson’s rehabilitation may need coordination with neurology, occupational therapy, speech and language therapy, nursing, dietetics, or mental health support. Do not change Parkinson’s medicines, start supplements, or use a walking aid differently without appropriate advice. General education cannot account for fluctuations, orthostatic symptoms, or cognitive changes."
      ] },
      { heading: "Keeping the plan responsive", paragraphs: [
        "Progress may mean fewer unsafe transfers, better turning, more confidence outdoors, or greater participation rather than a normal movement pattern. Review the goal when symptoms, medication, or living arrangements change. Practise strategies in the contexts where they are needed and make the home environment support success. A slower day can be a reason to adapt, not a reason to abandon activity.",
        "There is no guaranteed Parkinson’s timeline and no exercise plan that suits everyone. A clinician should reassess unexplained changes and decide when another service is needed. This page provides conservative education, not a personal prescription, diagnosis, or prediction of independence."
      ] }
    ],
    faqs: [
      { question: "Can exercise help someone with Parkinson’s disease?", answer: "Appropriate exercise may support movement and function, but the type and intensity should reflect symptoms, medicines, falls risk, and medical advice." },
      { question: "What should I do during a freezing episode?", answer: "Use the cueing strategy taught to the person and prioritise safety. Do not pull them; seek advice if freezing is new or worsening." },
      { question: "When should the medical team be contacted?", answer: "Report repeated falls, choking, fainting, severe confusion, rapid decline, or new neurological symptoms promptly." }
    ]
  },
  "weight-management": {
    sections: [
      { heading: "A function-first approach", paragraphs: [
        "Weight management is personal and influenced by health, medicines, sleep, stress, food access, movement, culture, and previous experiences. A responsible discussion starts with what you want to improve: energy, mobility, blood sugar support, confidence, fitness, or participation. Body weight alone cannot describe health, and no service should promise a particular number or body shape. The aim is a safe, respectful plan that fits real life.",
        "An assessment may explore eating patterns, activity, appetite, medical history, medications, emotional wellbeing, and barriers. It should not assume that weight reflects motivation or that one diet works for everyone. Movement can be adapted for pain, disability, fatigue, or limited access. Nutrition support and medical care may be needed alongside exercise rather than treating exercise as punishment for eating."
      ] },
      { heading: "Building sustainable habits", paragraphs: [
        "A plan may begin with regular meals, enjoyable movement, sleep routines, hydration, strength, walking, or a practical change in the home environment. Choose a small action that can be repeated and reviewed. Progress can include easier stairs, improved endurance, better mood, or more confidence even when weight does not change. Avoid extreme restriction, unmonitored fasting, or demanding exercise that repeatedly causes injury or exhaustion.",
        "Use measures that serve your goal and your wellbeing. A food or activity record should be optional and non-judgmental; it should not increase anxiety or disordered eating. Weight can fluctuate for many reasons. Discuss a strategy that causes distress, compulsive checking, dizziness, or loss of control with an appropriate professional."
      ] },
      { heading: "Medical and eating-related safety", paragraphs: [
        "Medical review is important for unexplained weight change, severe fatigue, thirst or urination changes, fainting, chest symptoms, persistent vomiting, dehydration, or a new exercise intolerance. People with diabetes, kidney or heart disease, pregnancy, eating disorders, significant joint problems, or medicines affected by food or activity need individual guidance. Do not stop medicines or start weight-loss products from general online advice.",
        "Referral may be appropriate to a doctor, registered dietitian, psychologist, eating-disorder service, or another professional. Physiotherapy or exercise guidance cannot provide comprehensive treatment for complex metabolic, hormonal, emotional, or eating-related concerns. Seek urgent help for self-harm risk, severe dehydration, collapse, or other immediate danger. This page is educational and does not prescribe calories, supplements, or a target weight."
      ] },
      { heading: "Reviewing health rather than chasing promises", paragraphs: [
        "A useful follow-up asks whether the plan is safe, affordable, enjoyable enough to continue, and helping the chosen activity. Adjust the dose when pain, fatigue, work, caregiving, or illness changes. Celebrate skills and participation rather than treating the scale as the only feedback. Support from family or professionals should respect privacy and consent.",
        "There is no universal timetable for weight or fitness change. A sustainable plan may involve plateaus and revisions. Coordinate with the healthcare team when a medical condition or medication affects the goal. Honest education should leave room for uncertainty and referral, not pressure a person into an unsafe promise."
      ] }
    ],
    faqs: [
      { question: "Does weight management require a strict diet?", answer: "No single diet suits everyone. A safe approach considers health, access, preferences, eating history, and medical advice." },
      { question: "Can I exercise if I have pain or low fitness?", answer: "Often activity can be adapted, but the starting point should follow assessment and respect symptoms and medical limits." },
      { question: "When should weight change be medically reviewed?", answer: "Unintentional or rapid change, severe fatigue, dehydration, persistent vomiting, or new exercise intolerance needs medical advice." }
    ]
  }
};