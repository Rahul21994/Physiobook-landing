export interface CityReview {
  name: string;
  condition: string;
  body: string;
  status: "published" | "pending" | "rejected";
  locality?: string;
  datePublished?: string;
  rating?: number;
}

const CITY_REVIEWS: Record<string, CityReview[]> = {
  jaipur: [
    {
      status: "published",
      name: "Kavita Parmar",
      condition: "Post-knee replacement rehabilitation",
      body: "After my knee replacement, I needed help with walking, stairs, and following my exercise routine at home. The physiotherapy sessions were adjusted to my progress, and I gradually regained strength, confidence, and independence in my daily movement.",
    },
    {
      status: "published",
      name: "Savitri Agarwal",
      condition: "Frozen shoulder rehabilitation",
      body: "Frozen shoulder had made dressing, reaching, and many simple household tasks uncomfortable. The home sessions focused on gradual mobility and strengthening rather than pushing too hard. Over time, my shoulder movement improved and I was able to return to my normal routine.",
    },
    {
      status: "published",
      name: "Reyansh Agarwal",
      condition: "Lower-limb fracture rehabilitation",
      body: "After treatment for a lower-limb fracture, I was unsure how to safely rebuild my strength and walking ability. The physiotherapist guided me through each stage, from controlled exercises to balance and functional movement, until I felt ready to manage my everyday activities again.",
    },
  ],
  faridabad: [
    {
      status: "published",
      name: "Preet",
      condition: "Elbow and heel pain home physiotherapy",
      body: `In February ,2026,  I had been suffering from immense pain in my right elbow, so much so, that it was difficult to even raise my hand or hold anything in my hand.
I was unable to do my simple daily chores like brushing my teeth, cooking food , eating food etc.
My husband consulted Dr Rahul Goswami,for the same on his mobile and requested for a physiotherapy session at our home .During his visit , It turned out that there had been some ligament tear near the elbow joint. 
On understanding the pain level , his first concern was immediate and effective pain management.
He used electrotherapy to reduce the pain . It provided magical relief from tremendous pain to a more tolerable pain level.
Subsequently , he meticulously planned the target specific exercise regime, to resolve the root cause for the elbow pain.
Once the pain was stabilized, the new set of endurance movements involving the right hand, elbow and arm, were added .
Throughout the treatment ,he made sure I did the exercises everyday by staying in touch with me on whatsapp.
It took almost a week or two, but my elbow pain was successfully and completely resolved , with no need for any painkillers.

Recently, in July 2026, I experienced immense heel pain in my right foot. I presumed, that since I had gained a lot of weight so maybe due to this, my heel  had started paining while walking or rather even on standing.
I tried going for walk so as to help reduce my weight but due to severe heel pain I could not do so. It rather made the heel pain worse . Pain was almost 9 on the scale of 10.
By August, I contacted Dr Rahul , again , as he had previously managed my elbow pain really well with physiotherapy.
As a first line of action , He recommended the correct footwear which were to be worn to cushion the heel and also sent across the heel stretching exercises to take care of heel pain to some extent , with immediate effect. 
I was advised to get my fasting sugar test done , to rule out diabetes as a cause for the above.The results came out normal.
Hence , further to judge the root cause for the heel pain ,he shared a few links via WhatsApp ,where certain heel pain assessment movements were suggested.
I was told to share the observations regarding pain location and pain level on doing respective foot / heel movement as given in the links shared.
With the help of this, he understood the reasons responsible for the heel pain .
To my surprise, the pain in heel was not only because of weight gain but also due to issues in my hip alignment, calf stiffness and long sitting hours.
Keeping all this in mind he planned my regime, addressing not only heel stretches but also for hip , calf and strength training . The soreness I felt due to weight training or other exercises , was strictly advised to be managed with natural remedies only and not with any medicines.
It has been almost a month , where in Dr Rahul, has suggested multiple progressive workout regimes ,targetting various aspects responsible for the pain , as he is guiding me through the recovery for the heel pain and for healthy weight management.
He makes it a point that the regime is not overburdening and yet effective enough to show Good progress in recovery.
He not only prescribed the workout plan but also takes regular WhatsApp updates if the regime is completed or not and feedback if I am getting any pain due to the workout . Based on my feedback , he either resolves the issue with alternative exercise/ natural remedy or modifies the regime if required.
My heel pain has already started to improve.
I am sure with persistence and his continued guidance , I shall heal my heel pain, very soon .

I highly recommend Dr Rahul Goswami ,for immaculate diagnosis of the root cause behind any kind of pain , efficient planning of the target specific physiotherapy and for his perseverance to guide the patient through the process to complete recovery.`,
    },
    {
      status: "published",
      name: "Sukhpreet",
      condition: "Stroke rehabilitation",
      body: "After my stroke, walking and managing everyday movements became difficult. Regular home physiotherapy gave me a structured routine for balance, strength, and mobility practice. With consistent support, I made steady progress and became much more confident with my daily activities.",
    },
    {
      status: "published",
      name: "Poonam Tewatia",
      condition: "Post-knee replacement rehabilitation",
      body: "Recovering from knee replacement at home felt overwhelming at first. The physiotherapist explained each exercise clearly, monitored my movement, and helped me work safely towards walking, using stairs, and completing daily tasks. My recovery became more manageable with every session.",
    },
    {
      status: "published",
      name: "Lavanya Bansal",
      condition: "Sciatica rehabilitation",
      body: "Sciatica was affecting my sitting, walking, and routine at home. The treatment plan combined movement advice, exercises, and practical changes for daily activities. I gradually became more comfortable moving and returned to the activities I had been avoiding.",
    },
  ],
  bengaluru: [
    {
      status: "published",
      name: "Aditya Kapoor",
      condition: "Neck pain and posture-related stiffness",
      body: "Long hours at a desk had left me with persistent neck pain and stiffness. The physiotherapist helped me understand my posture, improve my neck and upper-back movement, and build a routine I could follow around work. I gradually returned to comfortable, everyday movement.",
    },
    {
      status: "published",
      name: "Rohan Talavar",
      condition: "Runner's ankle injury rehabilitation",
      body: "An ankle injury interrupted my running routine and made me cautious about putting weight through the leg. My rehabilitation progressed from mobility and strength work to balance and running-specific exercises. I was able to rebuild my confidence and return to activity in a controlled way.",
    },
    {
      status: "published",
      name: "Bhumi Nayka",
      condition: "Post-fracture rehabilitation",
      body: "After my fracture treatment, stiffness and weakness made normal movement difficult. Home physiotherapy made it easier to practise the exercises regularly and focus on the movements I needed for daily life. My strength and confidence improved steadily throughout the rehabilitation process.",
    },
  ],
  gurgaon: [
    {
      status: "published",
      name: "Sunita Rani",
      condition: "Post-hip replacement rehabilitation",
      body: "After my hip replacement, I needed support with walking, transfers, and rebuilding strength safely. The physiotherapist worked around my home environment and explained how to practise each movement. With regular sessions, I regained confidence and returned to my usual daily activities.",
    },
    {
      status: "published",
      name: "Ritu Singh",
      condition: "Desk-related shoulder pain",
      body: "Shoulder pain from long desk hours was affecting my work and sleep. The sessions focused on shoulder mobility, upper-back strength, and small changes I could make during the working day. My pain settled gradually and I became much more comfortable with normal movement.",
    },
    {
      status: "published",
      name: "Ankit Verma",
      condition: "Hamstring injury rehabilitation",
      body: "A hamstring injury made walking quickly, exercising, and returning to sport feel uncertain. My physiotherapy plan progressed carefully through flexibility, strength, control, and activity-specific work. I was able to rebuild trust in the leg and resume my routine with better confidence.",
    },
  ],
  delhi: [
    {
      status: "published",
      name: "Suresh Patnayak",
      condition: "Parkinson's physiotherapy",
      body: "Parkinson's symptoms were affecting my balance, walking, and confidence at home. The physiotherapist used practical gait and balance exercises and showed my family how to support safe practice. I became more confident with everyday movement and managing my routine.",
    },
    {
      status: "published",
      name: "Vikram Sharma",
      condition: "COPD pulmonary rehabilitation",
      body: "Breathlessness and low stamina were making ordinary activities tiring. The pulmonary rehabilitation sessions taught me pacing, breathing control, and gradual exercise suited to my ability. Over time, I felt more prepared for daily activity and more confident managing exertion.",
    },
    {
      status: "published",
      name: "Sushila Devi",
      condition: "Knee osteoarthritis rehabilitation",
      body: "Knee osteoarthritis had made walking, standing, and using stairs increasingly difficult. The physiotherapist built a practical strengthening and mobility routine around my daily needs. I gradually became more comfortable moving and more independent with regular activities.",
    },
  ],
};

export function getCityReviews(citySlug: string): CityReview[] {
  const published = (CITY_REVIEWS[citySlug] ?? []).filter(
    (review) => review.status === "published",
  );
  if (citySlug !== "faridabad") return published;

  return [
    ...published.filter((review) => review.name !== "Preet"),
    ...published.filter((review) => review.name === "Preet"),
  ];
}

export function getProviderTeamReviews(citySlug: string): CityReview[] {
  const reviews = Object.values(CITY_REVIEWS)
    .flat()
    .filter((review) => review.status === "published");
  if (reviews.length === 0) return [];

  const offset = [...citySlug].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  ) % reviews.length;

  return Array.from({ length: Math.min(3, reviews.length) }, (_, index) =>
    reviews[(offset + index) % reviews.length],
  );
}

export const cityReviewSlugs = Object.keys(CITY_REVIEWS);