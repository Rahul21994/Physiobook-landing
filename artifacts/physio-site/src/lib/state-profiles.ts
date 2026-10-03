export interface StateProfile {
  intro: string;
  coverageNote: string;
  careFocus: string;
  bookingNote: string;
  faq: {
    q: string;
    a: string;
  };
  localResources: Array<{
    title: string;
    href: string;
    description?: string;
  }>;
}

/*
 * State hubs are intentionally written from the authored city directory,
 * rather than from a state-wide coverage claim. These profiles explain the
 * meaningful differences between the cities and give each hub a useful next
 * path into the city or service content.
 */
export const stateProfiles: Record<string, StateProfile> = {
  rajasthan: {
    intro: "Rajasthan enquiries often begin in Jaipur, the Goswami Rehab operations and training base, and extend to city-specific requests from Jodhpur, Udaipur, and Ajmer. Online consultation is available across the state.",
    coverageNote: "Home-visit enquiries for Jaipur, Jodhpur, Udaipur, and Ajmer are reviewed separately. Share your city, locality, and preferred date so the team can confirm the most suitable care option.",
    careFocus: "The Rajasthan city directory covers stroke and neurological rehabilitation, post-surgery and joint-replacement recovery, cardiopulmonary care, Parkinson's physiotherapy, and geriatric goals. Jaipur is the pathway for operations-base context; the other city pages explain their local enquiry routes.",
    bookingNote: "Choose the city that best matches the person's home setting, then decide between an online consultation and a city-specific home-visit enquiry. Include the locality and the main recovery goal in either case.",
    faq: {
      q: "What kind of rehabilitation can I discuss from Rajasthan?",
      a: "You can discuss stroke and neurological rehabilitation, post-surgery or joint-replacement recovery, cardiopulmonary rehabilitation, Parkinson's physiotherapy, and geriatric mobility goals. Online consultation is available across Rajasthan; home visits are reviewed city by city.",
    },
    localResources: [
      {
        title: "Jaipur operations base and home physiotherapy",
        href: "/physiotherapist-at-home/jaipur",
      },
      {
        title: "Complex recovery after hospitalisation",
        href: "/services/advanced-complex-case-recovery",
        description: "Use the complex-case guide when recovery involves post-ICU weakness, neurological illness, prolonged hospitalisation, or several care needs at once.",
      },
      {
        title: "Jodhpur neurological and post-surgery care",
        href: "/physiotherapist-at-home/jodhpur",
        description: "See the Jodhpur page for the city-specific route covering neurological, orthopaedic, respiratory, and post-surgery rehabilitation enquiries.",
      },
    ],
  },
  "uttar-pradesh": {
    intro: "Uttar Pradesh enquiries span the Delhi NCR route through Noida, established city pathways in Lucknow and Kanpur, and city-by-city requests from Moradabad, Varanasi, Agra, and Prayagraj. Online consultation is available across the state.",
    coverageNote: "Home-visit requests for each Uttar Pradesh city are reviewed from the submitted locality and date. Use the city pages to distinguish an active homecare pathway from an expansion enquiry before booking.",
    careFocus: "The directory's Uttar Pradesh pages cover stroke and neurological rehabilitation, post-surgery and joint-replacement recovery, spinal and cardiopulmonary care, geriatric rehabilitation, and respiratory support. The right starting point depends on the city and the person's recovery setting.",
    bookingNote: "Start with the relevant city page rather than a state-wide assumption. For an expansion city, submit the locality and preferred date for confirmation; online consultation remains available when a home visit is not the right first step.",
    faq: {
      q: "Which Uttar Pradesh city should I choose for a physiotherapy enquiry?",
      a: "Choose Noida for the Delhi NCR sector-based route, or select Lucknow, Moradabad, Kanpur, Varanasi, Agra, or Prayagraj according to the person's home. Each city page explains its local conditions and coverage wording. Online consultation is available throughout Uttar Pradesh.",
    },
    localResources: [
      {
        title: "Noida sector-based enquiry route",
        href: "/physiotherapist-at-home/noida",
      },
      {
        title: "Lucknow stroke and post-surgery pathway",
        href: "/physiotherapist-at-home/lucknow",
        description: "Review the Lucknow route for stroke, neurological, post-surgery, knee-replacement, and cardiopulmonary rehabilitation.",
      },
      {
        title: "Spinal and post-surgery physiotherapy",
        href: "/post-surgery-rehab",
        description: "Read the post-surgery guide before submitting an enquiry when recovery follows an operation, hospital discharge, or joint procedure.",
      },
    ],
  },
  delhi: {
    intro: "Delhi, the National Capital Territory, has one city pathway with a broad neighbourhood directory from South, North, East, and West Delhi to Dwarka, Rohini, and Vasant Kunj. Online consultation is available, and the local page explains how home rehabilitation fits around a Delhi home.",
    coverageNote: "Home-visit requests are confirmed from the Delhi locality rather than from the state name alone. Include the neighbourhood, recovery goal, and preferred date so the team can plan the practical route.",
    careFocus: "The Delhi pathway is especially relevant to stroke and neurological rehabilitation, knee and hip replacement recovery, cardiopulmonary rehabilitation, and post-hospital mobility work. The home setting can be used to practise transfers, stairs, walking routes, and caregiver technique.",
    bookingNote: "Select Delhi and include the neighbourhood in the booking form. Mention whether the priority is neurological recovery, joint replacement, cardiopulmonary endurance, or another functional goal so the request reaches the right care pathway.",
    faq: {
      q: "Why does the Delhi locality matter for a home physiotherapy request?",
      a: "As the National Capital Territory, Delhi enquiries can come from very different parts of the city, including Dwarka, Rohini, Vasant Kunj, and the South, North, East, and West Delhi areas. Sharing the exact locality helps the team review the home-visit route and plan care around the person's actual environment.",
    },
    localResources: [
      {
        title: "Delhi neighbourhood homecare pathway",
        href: "/physiotherapist-at-home/delhi",
      },
      {
        title: "Neurological rehabilitation guide",
        href: "/stroke-rehab",
        description: "Use the stroke rehabilitation guide for assessment-led information about movement, balance, walking, and recovery planning.",
      },
      {
        title: "Cardiopulmonary rehabilitation",
        href: "/services/cardiopulmonary-rehabilitation",
        description: "Read how breathing, endurance, symptom monitoring, and safe activity progression can be planned for medically stable patients.",
      },
    ],
  },
  chandigarh: {
    intro: "Chandigarh is a Union Territory; online care is available.",
    coverageNote: "Share sector, concern, date; Tricity areas require confirmation.",
    careFocus: "Neurological, post-surgery, Parkinson's, orthopaedic, cardiopulmonary rehabilitation is assessed.",
    bookingNote: "Enter sector; choose online consultation or home visit.",
    faq: {
      q: "Why does Chandigarh's sector matter?",
      a: "Chandigarh is a Union Territory; sector, goal, date identify the right route.",
    },
    localResources: [
      {
        title: "Chandigarh",
        href: "/physiotherapist-at-home/chandigarh",
      },
      {
        title: "Neurological rehab",
        href: "/stroke-rehab",
      },
    ],
  },
  haryana: {
    intro: "Haryana's directory separates the Delhi NCR homecare route in Gurugram and Faridabad from the Tigaon expansion enquiry pathway. Online consultation is available across Haryana while local home visits are confirmed city by city.",
    coverageNote: "Gurugram, Faridabad, and Tigaon have different locality and coverage contexts. Submit the exact area and preferred date so the team can distinguish an active homecare request from an expansion enquiry.",
    careFocus: "Gurugram's page focuses on sports injury, back pain, joint replacement, stroke, and post-ICU recovery. Faridabad and Tigaon add post-surgery, neurological, respiratory, orthopaedic, and geriatric pathways, making the city selection important.",
    bookingNote: "Choose Gurugram, Faridabad, or Tigaon according to the person's home. For active-city requests, include the neighbourhood and care goal; for Tigaon, use the expansion enquiry route or choose online consultation for immediate access.",
    faq: {
      q: "Is the Haryana home-visit route the same in every city?",
      a: "No. Gurugram and Faridabad have their own homecare pathways, while Tigaon is treated as an expansion enquiry. Share the exact locality and recovery goal so the team can confirm the appropriate option. Online consultation is available from anywhere in Haryana.",
    },
    localResources: [
      {
        title: "Gurugram sports and post-ICU pathway",
        href: "/physiotherapist-at-home/gurgaon",
      },
      {
        title: "Faridabad homecare coverage",
        href: "/physiotherapist-at-home/faridabad",
        description: "See how Faridabad requests are coordinated for post-surgery, neurological, stroke, respiratory, and joint-replacement rehabilitation.",
      },
      {
        title: "Sports injury consultation",
        href: "/sports-injury-rehabilitation",
        description: "Use the sports consultation guide when the Haryana enquiry involves movement quality, strength, workload, or return-to-sport planning.",
      },
    ],
  },
  punjab: {
    intro: "Punjab's city directory covers Amritsar's locality-led expansion route and Ludhiana's orthopaedic and neurological pathways. Online consultation is available across Punjab.",
    coverageNote: "Home-visit availability is reviewed separately for Amritsar and Ludhiana. Include the locality, the person's main concern, and a preferred date in the enquiry.",
    careFocus: "The Punjab pages cover stroke and neurological rehabilitation, with Ludhiana adding spinal-cord and Guillain-Barré rehabilitation and Amritsar adding respiratory and geriatric needs. Chandigarh has its own Union Territory route.",
    bookingNote: "Choose Amritsar or Ludhiana according to the person's home setting. Include the neighbourhood and whether the priority is neurological, orthopaedic, respiratory, or post-surgery recovery.",
    faq: {
      q: "How should I describe a Punjab home physiotherapy enquiry?",
      a: "Name the Punjab city first, then share the locality, the main recovery goal, and the preferred date. This helps distinguish Amritsar and Ludhiana city routes. Chandigarh is administered separately as a Union Territory, with its own city page and enquiry route.",
    },
    localResources: [
      {
        title: "Ludhiana neurological and orthopaedic care",
        href: "/physiotherapist-at-home/ludhiana",
        description: "See the Ludhiana pathway for knee replacement, stroke, spinal-cord, Guillain-Barré, and post-surgery rehabilitation enquiries.",
      },
      {
        title: "Neurological rehabilitation guide",
        href: "/stroke-rehab",
        description: "Read the stroke and neurological rehabilitation guide before booking care after a neurological event or hospital discharge.",
      },
    ],
  },
  maharashtra: {
    intro: "Maharashtra enquiries have three distinct city routes: Mumbai's broad homecare directory, Pune's technology-corridor expansion context, and Nagpur's locality-led home-visit enquiry. Online consultation is available across the state.",
    coverageNote: "Home-visit requests for Mumbai, Pune, and Nagpur are reviewed from the exact locality and preferred date. Use the city pages to understand the current route before submitting a booking request.",
    careFocus: "Mumbai's pathway includes stroke, cardiac, neurological, post-surgery, and Guillain-Barré rehabilitation. Pune adds sports injury and respiratory recovery, while Nagpur adds neurological, pulmonary, geriatric, and post-hospital goals.",
    bookingNote: "Select Mumbai, Pune, or Nagpur according to the home location. Mention whether the request follows surgery, neurological illness, cardiac or respiratory limitation, or a sports injury so the city pathway is clear.",
    faq: {
      q: "Which Maharashtra city page fits my rehabilitation need?",
      a: "Use Mumbai for its wider locality directory and complex post-hospital pathways, Pune for sports, neurological, post-surgery, and respiratory goals, or Nagpur for its central and outer-corridor enquiry route. Online consultation is available from every Maharashtra city.",
    },
    localResources: [
      {
        title: "Mumbai homecare and complex rehabilitation",
        href: "/physiotherapist-at-home/mumbai",
      },
      {
        title: "Pune sports and neurological recovery",
        href: "/physiotherapist-at-home/pune",
        description: "See how Pune's city page handles Hinjawadi, Baner, Kothrud, Viman Nagar, and other locality-led enquiries.",
      },
      {
        title: "Cardiopulmonary rehabilitation",
        href: "/services/cardiopulmonary-rehabilitation",
        description: "Use this guide for Maharashtra enquiries involving cardiac recovery, COPD, breathlessness, endurance, or post-hospital deconditioning.",
      },
    ],
  },
  karnataka: {
    intro: "Karnataka's city pathways distinguish Bengaluru's broad neurological and sports directory from Mysuru's Parkinson's and geriatric route and Mangaluru's coastal-city enquiry context. Online consultation is available across Karnataka.",
    coverageNote: "Home-visit requests for Bengaluru, Mysuru, and Mangaluru are reviewed using the locality, recovery goal, and preferred date. The city pages provide the most accurate next step for each route.",
    careFocus: "Bengaluru covers stroke, neurological, post-surgery, sports, and cardiopulmonary rehabilitation. Mysuru adds Parkinson's and geriatric rehabilitation, while Mangaluru combines neurological, post-surgery, geriatric, and respiratory pathways.",
    bookingNote: "Choose the Karnataka city where the patient lives and include a neighbourhood or landmark. Explain whether the priority is neurological recovery, post-surgery mobility, sports, breathing, or age-related function.",
    faq: {
      q: "What makes the Karnataka city routes different?",
      a: "Bengaluru has a broad neurological, sports, post-surgery, and cardiopulmonary directory; Mysuru's page highlights Parkinson's and geriatric rehabilitation; Mangaluru's route includes coastal and inland locality details with neurological, post-surgery, and respiratory care. Online consultation is available statewide.",
    },
    localResources: [
      {
        title: "Bengaluru neurological and sports pathway",
        href: "/physiotherapist-at-home/bengaluru",
      },
      {
        title: "Mysuru Parkinson's and geriatric care",
        href: "/physiotherapist-at-home/mysuru",
        description: "See the Mysuru pathway for Parkinson's, geriatric, neurological, and post-surgery rehabilitation enquiries.",
      },
      {
        title: "Home physiotherapy guide",
        href: "/home-physiotherapy",
        description: "Read how an assessment-led home programme can address mobility, strength, balance, daily function, and caregiver goals.",
      },
    ],
  },
  "tamil-nadu": {
    intro: "Tamil Nadu's authored routes separate Chennai's long city corridor from Coimbatore's sports and breathing context and Madurai's post-surgery, neurological, and geriatric pathway. Online consultation is available across the state.",
    coverageNote: "Home-visit requests for Chennai, Coimbatore, and Madurai are checked from the submitted locality and preferred date. Choose the city page that matches the home setting before booking.",
    careFocus: "Chennai and Coimbatore both cover stroke, neurological, post-surgery, knee-replacement, and cardiopulmonary needs, while Madurai adds geriatric and orthopaedic recovery. The locality changes the practical route, especially across Chennai's longer corridors.",
    bookingNote: "Select Chennai, Coimbatore, or Madurai and include the locality. Add whether the request is for stroke or neurological recovery, post-surgery mobility, joint replacement, sports, breathing, or geriatric function.",
    faq: {
      q: "Which Tamil Nadu city pathway should I use?",
      a: "Choose Chennai for its locality-led north-to-south city route, Coimbatore for its sports and breathing context, or Madurai for post-surgery, neurological, geriatric, and orthopaedic goals. Online consultation is available across Tamil Nadu while home visits are confirmed by city.",
    },
    localResources: [
      {
        title: "Chennai locality-led homecare",
        href: "/physiotherapist-at-home/chennai",
      },
      {
        title: "Coimbatore movement and breathing support",
        href: "/physiotherapist-at-home/coimbatore",
        description: "See the Coimbatore route for movement, post-surgery, sports, and pulmonary rehabilitation enquiries.",
      },
      {
        title: "Post-surgery rehabilitation guide",
        href: "/post-surgery-rehab",
        description: "Use this guide to understand assessment, staged loading, precautions, and home practice after surgery.",
      },
    ],
  },
  kerala: {
    intro: "Kerala's directory has separate routes for Kochi's connected urban areas, Thiruvananthapuram's central and technology-corridor enquiries, and Kozhikode's city and medical-campus context. Online consultation is available across Kerala.",
    coverageNote: "Home-visit requests for Kochi, Thiruvananthapuram, and Kozhikode are reviewed using the locality, recovery goal, and preferred date. The city pages explain the relevant homecare or expansion route.",
    careFocus: "The Kerala pathways cover stroke and neurological rehabilitation, post-surgery recovery, pulmonary care, geriatric rehabilitation, Parkinson's physiotherapy, and cardiopulmonary goals. City selection helps match the request to the right practical context.",
    bookingNote: "Choose the Kerala city where the patient lives, then include the neighbourhood or side of the urban area. Mention whether the priority is mobility, post-surgery recovery, breathing, Parkinson's, or geriatric function.",
    faq: {
      q: "What locality details help with a Kerala enquiry?",
      a: "Kochi enquiries benefit from the distinction between Ernakulam, Kakkanad, Edapally, and Aluva; Thiruvananthapuram enquiries can name Pattom, Kowdiar, Vanchiyoor, or Kazhakkoottam; Kozhikode enquiries can name Nadakkavu, Kottooli, or the medical-campus area. Online consultation is available statewide.",
    },
    localResources: [
      {
        title: "Kochi rehabilitation pathway",
        href: "/physiotherapist-at-home/kochi",
      },
      {
        title: "Thiruvananthapuram city route",
        href: "/physiotherapist-at-home/thiruvananthapuram",
        description: "See how the city page handles central, Kowdiar–Pattom, and Kazhakkoottam locality context.",
      },
      {
        title: "Pulmonary rehabilitation guide",
        href: "/services/cardiopulmonary-rehabilitation",
        description: "Use the cardiopulmonary guide for Kerala enquiries involving COPD, breathlessness, endurance, or post-hospital recovery.",
      },
    ],
  },
  gujarat: {
    intro: "Gujarat's city directory separates Ahmedabad's established-city enquiry context from Surat's western and southern corridors and Vadodara's central locality route. Online consultation is available across Gujarat.",
    coverageNote: "Home-visit enquiries for Ahmedabad, Surat, and Vadodara are reviewed city by city from the exact locality and preferred date. Use the city pages to choose the most accurate pathway.",
    careFocus: "Ahmedabad covers post-surgery, stroke, neurological, cardiac, and orthopaedic rehabilitation. Surat adds knee replacement and pulmonary care, while Vadodara adds geriatric rehabilitation and a locality-led orthopaedic route.",
    bookingNote: "Choose Ahmedabad, Surat, or Vadodara according to the home location. Include the neighbourhood and whether the request concerns post-surgery recovery, stroke, cardiac or pulmonary care, joint replacement, or geriatric function.",
    faq: {
      q: "How do I choose between Gujarat's city pathways?",
      a: "Choose Ahmedabad for post-surgery, stroke, neurological, cardiac, and orthopaedic needs; Surat for knee replacement and pulmonary recovery; or Vadodara for orthopaedic, geriatric, and neurological enquiries. Online consultation is available across Gujarat.",
    },
    localResources: [
      {
        title: "Ahmedabad neurological and cardiac route",
        href: "/physiotherapist-at-home/ahmedabad",
      },
      {
        title: "Surat joint-replacement pathway",
        href: "/physiotherapist-at-home/surat",
        description: "See the Surat route for post-surgery, knee-replacement, stroke, neurological, and pulmonary rehabilitation enquiries.",
      },
      {
        title: "Clinical assessment guide",
        href: "/services/clinical-assessment-evaluation",
        description: "Read how movement, strength, balance, gait, breathing, and meaningful daily goals are assessed before a programme is planned.",
      },
    ],
  },
  "madhya-pradesh": {
    intro: "Madhya Pradesh has two authored city pathways: Bhopal's stroke, pulmonary, and post-surgery route and Indore's neurological, cardiopulmonary, and geriatric route. Online consultation is available across the state.",
    coverageNote: "Home-visit requests for Bhopal and Indore are reviewed from the locality and preferred date. Choose the city page that matches the patient's home and current recovery needs.",
    careFocus: "Bhopal's directory focuses on stroke, post-surgery, neurological, COPD, and knee-replacement rehabilitation. Indore adds neurological physiotherapy, cardiopulmonary care, and geriatric recovery, so the city selection provides useful clinical context.",
    bookingNote: "Select Bhopal or Indore and share the locality, main concern, and preferred date. If the patient needs immediate guidance while homecare is being confirmed, choose an online consultation.",
    faq: {
      q: "What should I include in a Madhya Pradesh booking request?",
      a: "Name Bhopal or Indore, include the locality, and describe whether the main need is stroke or neurological recovery, post-surgery mobility, pulmonary care, joint replacement, cardiopulmonary endurance, or geriatric function. Online consultation is available across Madhya Pradesh.",
    },
    localResources: [
      {
        title: "Bhopal stroke and pulmonary pathway",
        href: "/physiotherapist-at-home/bhopal",
      },
      {
        title: "Indore neurological and cardiopulmonary care",
        href: "/physiotherapist-at-home/indore",
        description: "See the Indore page for neurological, post-surgery, cardiopulmonary, and geriatric rehabilitation enquiries.",
      },
      {
        title: "Home physiotherapy guide",
        href: "/home-physiotherapy",
        description: "Use the homecare guide to understand assessment-led treatment, progressive exercise, and caregiver support at home.",
      },
    ],
  },
  telangana: {
    intro: "Telangana has one authored city route in Hyderabad, with locality-specific pathways from Banjara Hills and Jubilee Hills to Gachibowli, Kondapur, Secunderabad, and Uppal. Online consultation is available across the state.",
    coverageNote: "Hyderabad home-visit requests are reviewed from the exact locality and preferred date. Include the neighbourhood and main recovery goal rather than relying on a state-wide availability assumption.",
    careFocus: "The Hyderabad directory covers stroke, post-surgery, neurological, cardiopulmonary, and Guillain-Barré rehabilitation. The city page is the most useful route for matching those goals to a home setting.",
    bookingNote: "Select Hyderabad, name the neighbourhood, and describe the person's main concern. Choose online consultation for a video assessment or submit the locality and preferred date for a home-visit enquiry.",
    faq: {
      q: "Which Hyderabad details help with a Telangana enquiry?",
      a: "Name the Hyderabad locality—such as Banjara Hills, Jubilee Hills, Gachibowli, Kondapur, Secunderabad, or Uppal—and describe the recovery goal. The city route covers neurological, post-surgery, cardiopulmonary, and complex rehabilitation; online consultation is available statewide.",
    },
    localResources: [
      {
        title: "Hyderabad neurological and complex recovery",
        href: "/physiotherapist-at-home/hyderabad",
      },
      {
        title: "Complex case recovery guide",
        href: "/services/advanced-complex-case-recovery",
        description: "Use this guide when weakness, breathing, cognition, movement, or independence changed after critical illness or prolonged hospitalisation.",
      },
    ],
  },
  "andhra-pradesh": {
    intro: "Andhra Pradesh's authored location route is Visakhapatnam, where coastal, central, Madhurawada, and Gajuwaka enquiries are distinguished by locality. Online consultation is available across the state.",
    coverageNote: "Visakhapatnam home-visit requests are reviewed from the exact locality and preferred date. Include the recovery goal and area so the team can assess the city-specific route accurately.",
    careFocus: "The Visakhapatnam pathway covers stroke, neurological, post-surgery, cardiopulmonary, and Guillain-Barré rehabilitation. The city's north-south and coastal corridors make the locality important to any homecare request.",
    bookingNote: "Select Visakhapatnam and include the locality—such as the central coastal area, Madhurawada, or Gajuwaka—along with the main recovery goal and preferred date.",
    faq: {
      q: "How does a Visakhapatnam enquiry work?",
      a: "Submit the Visakhapatnam locality, recovery concern, and preferred date. The team will review the home-visit route city by city; online consultation is available now across Andhra Pradesh if a video assessment is the better first step.",
    },
    localResources: [
      {
        title: "Visakhapatnam locality pathway",
        href: "/physiotherapist-at-home/visakhapatnam",
      },
      {
        title: "Stroke rehabilitation guide",
        href: "/stroke-rehab",
        description: "Read the stroke rehabilitation guide for assessment-led work on movement, balance, walking, and daily function.",
      },
    ],
  },
  "west-bengal": {
    intro: "West Bengal's authored city route is Kolkata, with separate care corridors through the established neighbourhoods, Salt Lake, New Town, Ballygunge, and Garia. Online consultation is available across the state.",
    coverageNote: "Kolkata home-visit requests are reviewed from the submitted locality and preferred date. The city page explains how to provide useful context rather than relying on a blanket city-wide claim.",
    careFocus: "The Kolkata pathway covers stroke, neurological, post-surgery, cardiopulmonary, and Guillain-Barré rehabilitation. Locality details help the team understand the practical home setting for each request.",
    bookingNote: "Select Kolkata, name the neighbourhood, and describe the recovery goal. Choose online consultation for a video assessment or submit the locality and preferred date for a home-visit review.",
    faq: {
      q: "Which Kolkata locality should I include in a West Bengal request?",
      a: "Name the part of Kolkata involved, such as Salt Lake, New Town, Ballygunge, Garia, or another neighbourhood, and describe the recovery goal. This helps the team review a home-visit request accurately while online consultation remains available across West Bengal.",
    },
    localResources: [
      {
        title: "Kolkata complex rehabilitation route",
        href: "/physiotherapist-at-home/kolkata",
      },
      {
        title: "Cardiopulmonary rehabilitation guide",
        href: "/services/cardiopulmonary-rehabilitation",
        description: "Use this guide for breathlessness, reduced endurance, cardiac recovery, COPD, and medically stable post-hospital rehabilitation.",
      },
    ],
  },
  odisha: {
    intro: "Odisha's authored location route is Bhubaneswar, where the city directory focuses on stroke, post-surgery, neurological, pulmonary, and geriatric rehabilitation. Online consultation is available across the state.",
    coverageNote: "Bhubaneswar home-visit requests are reviewed from the exact locality and preferred date. Include the person's home area and recovery goal so the city-specific route can be assessed.",
    careFocus: "The Bhubaneswar pathway combines neurological and stroke recovery with post-surgery, COPD and pulmonary, and geriatric rehabilitation. It is the most useful starting point for an Odisha homecare enquiry.",
    bookingNote: "Select Bhubaneswar, share the locality and main concern, and choose between an online consultation and a home-visit enquiry. Include a preferred date if a home visit is needed.",
    faq: {
      q: "What rehabilitation needs can I discuss from Odisha?",
      a: "The Bhubaneswar route covers stroke and neurological rehabilitation, post-surgery recovery, COPD and pulmonary rehabilitation, and geriatric goals. Online consultation is available across Odisha; home visits are reviewed from the submitted locality.",
    },
    localResources: [
      {
        title: "Bhubaneswar neurological and geriatric route",
        href: "/physiotherapist-at-home/bhubaneswar",
      },
      {
        title: "Homecare physiotherapy guide",
        href: "/home-physiotherapy",
        description: "Read how home assessment and progressive practice can support mobility, strength, balance, and daily activities.",
      },
    ],
  },
  jharkhand: {
    intro: "Jharkhand's authored location route is Ranchi, with a city-specific focus on stroke, post-surgery, neurological, orthopaedic, and geriatric rehabilitation. Online consultation is available across the state.",
    coverageNote: "Ranchi home-visit requests are reviewed from the locality and preferred date. Share the person's recovery goal and home setting so the team can assess the practical next step.",
    careFocus: "The Ranchi pathway is designed around stroke and neurological recovery, post-surgery mobility, orthopaedic rehabilitation, and geriatric physiotherapy. City-specific details keep the enquiry grounded in the person's home.",
    bookingNote: "Select Ranchi and include the locality, main concern, and preferred date. Choose online consultation when a video assessment is more convenient, or submit the city-specific home-visit enquiry.",
    faq: {
      q: "How should I start a Ranchi rehabilitation enquiry?",
      a: "Name the Ranchi locality, describe whether the priority is stroke or neurological recovery, post-surgery mobility, orthopaedic rehabilitation, or geriatric function, and add a preferred date. Online consultation is available across Jharkhand.",
    },
    localResources: [
      {
        title: "Ranchi home rehabilitation route",
        href: "/physiotherapist-at-home/ranchi",
      },
      {
        title: "Clinical assessment and evaluation",
        href: "/services/clinical-assessment-evaluation",
        description: "Use the assessment guide to understand how movement, strength, balance, gait, breathing, and goals shape a programme.",
      },
    ],
  },
  bihar: {
    intro: "Bihar's authored location route is Patna, where the city directory focuses on stroke, neurological, post-surgery, pulmonary, and geriatric rehabilitation. Online consultation is available across the state.",
    coverageNote: "Patna home-visit requests are reviewed from the submitted locality and preferred date. Include the person's main recovery goal so the enquiry can be matched to the appropriate care option.",
    careFocus: "The Patna pathway combines neurological and stroke recovery with post-surgery mobility, COPD and pulmonary rehabilitation, and geriatric physiotherapy. These city-specific themes provide a clearer starting point than a generic state promise.",
    bookingNote: "Select Patna, name the locality, and describe the main concern. Choose online consultation for immediate video-based planning or submit a preferred date for the home-visit review.",
    faq: {
      q: "What can a Patna physiotherapy enquiry include?",
      a: "A Patna enquiry can cover stroke and neurological rehabilitation, post-surgery recovery, COPD and pulmonary care, or geriatric mobility. Share the locality and preferred date for a home-visit review; online consultation is available across Bihar.",
    },
    localResources: [
      {
        title: "Patna neurological and pulmonary pathway",
        href: "/physiotherapist-at-home/patna",
      },
      {
        title: "Pulmonary rehabilitation guide",
        href: "/services/cardiopulmonary-rehabilitation",
        description: "Read the breathing and endurance guide for COPD, cardiac recovery, reduced exercise tolerance, and safe progression.",
      },
    ],
  },
  assam: {
    intro: "Assam's authored location route is Guwahati, where central, Six Mile, Beltola, Dispur, and airport-side enquiries are distinguished by locality. Online consultation is available across the state.",
    coverageNote: "Guwahati home-visit requests are reviewed from the exact locality and preferred date. Include the person's daily movement challenge or rehabilitation goal so the team can understand the request clearly.",
    careFocus: "The Guwahati pathway covers stroke, neurological, post-surgery, Guillain-Barré, and geriatric rehabilitation. Locality details make the city route more useful for families planning care at home.",
    bookingNote: "Select Guwahati, include the locality and main recovery goal, and choose online consultation or a home-visit enquiry. Add a preferred date when requesting local availability.",
    faq: {
      q: "Can I discuss neurological rehabilitation from Assam?",
      a: "Yes. The Guwahati route covers stroke, neurological, post-surgery, Guillain-Barré, and geriatric rehabilitation. Share the locality and preferred date for a home-visit review, or choose online consultation from anywhere in Assam.",
    },
    localResources: [
      {
        title: "Guwahati neurological recovery route",
        href: "/physiotherapist-at-home/guwahati",
      },
      {
        title: "Complex neurological recovery guide",
        href: "/services/advanced-complex-case-recovery",
        description: "Use the complex recovery guide for post-ICU weakness, Guillain-Barré, neurological illness, and loss of independence.",
      },
    ],
  },
  uttarakhand: {
    intro: "Uttarakhand's directory separates Dehradun's pulmonary and post-surgery route from Haridwar's neurological and geriatric pathway. Online consultation is available across the state.",
    coverageNote: "Home-visit requests for Dehradun and Haridwar are reviewed from the city, locality, and preferred date. Choose the relevant city page before submitting a local enquiry.",
    careFocus: "Dehradun's pathway covers stroke, post-surgery, neurological, pulmonary, and geriatric rehabilitation. Haridwar adds neurological physiotherapy, geriatric rehabilitation, and orthopaedic recovery, making the city choice clinically useful.",
    bookingNote: "Select Dehradun or Haridwar according to the home location and include the locality. Explain whether the priority is stroke, surgery recovery, breathing, neurological function, or orthopaedic mobility.",
    faq: {
      q: "Which Uttarakhand city route should I use?",
      a: "Use Dehradun for the stroke, post-surgery, pulmonary, and geriatric pathway, or Haridwar for neurological, geriatric, orthopaedic, and post-surgery enquiries. Online consultation is available across Uttarakhand while home visits are confirmed by city.",
    },
    localResources: [
      {
        title: "Dehradun stroke and pulmonary route",
        href: "/physiotherapist-at-home/dehradun",
      },
      {
        title: "Haridwar neurological and orthopaedic route",
        href: "/physiotherapist-at-home/haridwar",
        description: "See the Haridwar pathway for neurological physiotherapy, post-surgery, geriatric, and orthopaedic recovery.",
      },
      {
        title: "Post-surgery rehabilitation guide",
        href: "/post-surgery-rehab",
        description: "Use the post-surgery guide for staged recovery, precautions, home practice, and functional goals after an operation.",
      },
    ],
  },
  "jammu-kashmir": {
    intro: "Jammu & Kashmir's authored location route is Jammu, with a city-specific focus on stroke, post-surgery, neurological, orthopaedic, and cardiopulmonary rehabilitation. Online consultation is available across the region.",
    coverageNote: "Jammu home-visit requests are reviewed from the exact locality and preferred date. Include the recovery goal and home setting so the team can assess the practical care option.",
    careFocus: "The Jammu pathway combines stroke and neurological rehabilitation with post-surgery, orthopaedic, and cardiopulmonary recovery. The city page is the clearest route for a local enquiry without implying blanket regional home-visit coverage.",
    bookingNote: "Select Jammu, share the locality and main concern, and choose online consultation or a city-specific home-visit enquiry. Add the preferred date when requesting local availability.",
    faq: {
      q: "What rehabilitation support can I request from Jammu & Kashmir?",
      a: "The Jammu route covers stroke and neurological rehabilitation, post-surgery recovery, orthopaedic mobility, and cardiopulmonary care. Online consultation is available across Jammu & Kashmir; home visits are reviewed from the submitted Jammu locality.",
    },
    localResources: [
      {
        title: "Jammu neurological and orthopaedic route",
        href: "/physiotherapist-at-home/jammu",
      },
      {
        title: "Cardiopulmonary rehabilitation guide",
        href: "/services/cardiopulmonary-rehabilitation",
        description: "Use this guide for medically stable cardiac or respiratory recovery, reduced endurance, and safe activity progression.",
      },
    ],
  },
};