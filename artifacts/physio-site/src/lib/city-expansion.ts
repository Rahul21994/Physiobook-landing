import type { CityData } from "@/lib/cities";

export interface ExpansionProfile {
  intro: string;
  focus: string;
  coverage: string;
  localitySuffix: string;
  faqQuestion: string;
  faqAnswer: string;
}

/*
 * These are deliberately framed as rollout context, not promises of local
 * therapist availability. The neighbourhoods come from the authored city
 * directory and the copy gives each expansion page a distinct local angle.
 */
const profiles: Record<string, ExpansionProfile> = {
  noida: {
    intro: "Online physiotherapy is available from Noida for people managing spine, stroke, respiratory, or post-surgery recovery. A video assessment can be the first step; a home-visit request is reviewed by locality.",
    focus: "Noida requests need the sector or society, preferred date, and recovery goal. Share them to check whether a qualified physiotherapist can visit in Noida or Greater Noida.",
    coverage: "Share your exact locality and whether the priority is spine, stroke, respiratory, or post-surgery recovery. The team uses those details to review home-visit feasibility rather than assume local coverage.",
    localitySuffix: "Share your Noida sector or Greater Noida locality to check for a suitable home-visit professional.",
    faqQuestion: "How do I check for a home physiotherapist in Noida by sector?",
    faqAnswer: "Share your Noida sector and date; the team confirms home-visit availability within 24 hours.",
  },
  chandigarh: {
    intro: "Online physiotherapy from Chandigarh can help families discuss stroke, orthopaedic, cardiac, or post-surgery rehabilitation without an immediate commute. If home physiotherapy is preferred, local availability is checked after the enquiry.",
    focus: "Chandigarh’s sector layout makes the sector number and nearby landmark important when planning a home-care enquiry. Online consultation is available now while the local in-person network expands across Chandigarh and the Tricity area.",
    coverage: "Provide your exact locality, recovery goal, and preferred timing. A clinician visit is considered only after the request is reviewed; online care remains an available starting option.",
    localitySuffix: "A sector number and a nearby landmark help the team understand the part of the planned Chandigarh rollout you are enquiring about.",
    faqQuestion: "How do I request physiotherapy in Chandigarh during the expansion?",
    faqAnswer: "Submit the form with your Chandigarh sector, recovery need, and preferred date. The team will confirm whether a home visit can be arranged within 24 hours; online consultation can be requested immediately if travel or local availability is a concern.",
  },
  amritsar: {
    intro: "Online physiotherapy from Amritsar offers a practical starting point for neurological, respiratory, older-adult, or post-surgery rehabilitation. A home visit can be requested, subject to clinician availability at the stated locality.",
    focus: "Amritsar enquiries can look very different between the central city, Ranjit Avenue, and the edges toward Majitha Road. Tell us the neighbourhood and the person’s main recovery goal so the team can plan the next step while local home visits are being expanded.",
    coverage: "Tell us your exact locality and whether the need is neurological, respiratory, older-adult, or post-surgery rehabilitation. The address supports an availability check, not a guaranteed visit.",
    localitySuffix: "The central city, Ranjit Avenue, and Majitha Road represent different parts of the Amritsar rollout, so a precise neighbourhood helps the team respond accurately.",
    faqQuestion: "Is home physiotherapy available in Amritsar?",
    faqAnswer: "Amritsar is part of our expanding home-visit network, so availability must be confirmed from a submitted enquiry. Share your neighbourhood and preferred date in the form; online consultation is available now if you would prefer a video assessment.",
  },
  ludhiana: {
    intro: "Online physiotherapy from Ludhiana can support a conversation about movement after surgery, neurological change, joint recovery, or spinal injury. Home physiotherapy is a request that requires locality and clinician confirmation.",
    focus: "Ludhiana combines established residential areas with busy industrial and commercial corridors. A locality, nearby landmark, and the person’s daily movement goal give the team better context while home-visit coverage is being expanded.",
    coverage: "Include your exact locality, nearby access information, and whether the goal is movement after surgery, neurological recovery, joint care, or spinal rehabilitation. Availability is confirmed case by case.",
    localitySuffix: "Sarabha Nagar, Dugri, and the areas around Ferozepur Road can have different travel needs, so include the exact locality in your enquiry.",
    faqQuestion: "What should I include in a Ludhiana physiotherapy enquiry?",
    faqAnswer: "Include your Ludhiana locality, the main concern, the preferred date, and whether the person needs support after surgery, an injury, or a neurological condition. The team will confirm home-visit options within 24 hours, or you can choose online consultation now.",
  },
  pune: {
    intro: "Online physiotherapy from Pune can begin an assessment for post-surgery, neurological, stroke, sports, or breathing-related rehabilitation. People seeking home care can share their locality so current clinician availability can be checked.",
    focus: "Pune’s established neighbourhoods and expanding technology corridors can create very different travel patterns. Share whether you are in Hinjawadi, Baner, Kothrud, Viman Nagar, or another locality so the team can match the right qualified professional for homecare or online care.",
    coverage: "Share your exact locality and whether you are seeking post-surgery, neurological, stroke, sports, or breathing-related support. The team checks whether home care is practical for that request.",
    localitySuffix: "The locality helps distinguish Pune’s western, central, and eastern travel corridors, especially around Hinjawadi, Baner, Viman Nagar, and Hadapsar.",
    faqQuestion: "Can I choose online consultation from Pune?",
    faqAnswer: "Yes. Pune is in our home-visit expansion rollout, and online consultation can be requested now from any locality. Use the form to describe your concern, choose a preferred video platform, and the team will confirm the next step within 24 hours.",
  },
  hyderabad: {
    intro: "Online physiotherapy from Hyderabad is available for discussions about stroke, neurological, cardiopulmonary, post-surgery, or Guillain-Barré rehabilitation. A home visit can be requested and must be confirmed for the locality.",
    focus: "For a Hyderabad home-visit request, share your locality, preferred date, and recovery goal so the team can check qualified professional availability.",
    coverage: "Provide your exact locality, recovery goal, and preferred date for stroke, neurological, cardiopulmonary, post-surgery, or Guillain-Barré support. Home visits require clinician confirmation.",
    localitySuffix: "Share your Hyderabad locality and nearby landmark to check local home-visit availability.",
    faqQuestion: "Which Hyderabad recovery needs can start with online physiotherapy?",
    faqAnswer: "Share your Hyderabad locality and preferred date; the team confirms home-visit availability within 24 hours.",
  },
  kochi: {
    intro: "Online physiotherapy from Kochi can help families plan neurological, stroke, post-surgery, respiratory, or older-adult rehabilitation. Home physiotherapy is considered only after the locality and clinician availability are reviewed.",
    focus: "Kochi’s care enquiries may span Ernakulam, Kakkanad, Edapally, Aluva, and the water-linked communities around the city. Include the side of the urban area and your main goal so the expanding home-visit network can assess the request clearly.",
    coverage: "Tell us your exact locality and whether the enquiry concerns neurological, stroke, respiratory, post-surgery, or older-adult rehabilitation. The team reviews travel feasibility before confirming home care.",
    localitySuffix: "The Kochi locality is important because travel between Ernakulam, Kakkanad, Edapally, and Aluva can change the practical shape of a home-visit request.",
    faqQuestion: "How can I request rehabilitation support in Kochi?",
    faqAnswer: "Use the enquiry form with your Kochi locality and preferred date. The team will confirm whether a home visit can be arranged within 24 hours; online consultation is available now and lets you choose the video platform that suits you.",
  },
  thiruvananthapuram: {
    intro: "Online physiotherapy from Thiruvananthapuram can be used to discuss stroke, neurological, Parkinson’s, post-surgery, or cardiopulmonary rehabilitation. A home-visit request is reviewed separately for local availability.",
    focus: "Thiruvananthapuram enquiries can involve central neighbourhoods, the Kowdiar–Pattom area, or the growing Kazhakkoottam corridor. Tell us the locality and whether the priority is mobility, post-surgery recovery, or a video assessment.",
    coverage: "Share your exact locality and whether the priority is mobility, stroke, neurological, Parkinson’s, post-surgery, or cardiopulmonary rehabilitation. Any home visit remains subject to confirmation.",
    localitySuffix: "Pattom, Kowdiar, Vanchiyoor, and Kazhakkoottam sit in different parts of the city, so the locality helps us understand your intended care setting.",
    faqQuestion: "Is online physiotherapy available from Thiruvananthapuram?",
    faqAnswer: "Yes. Online consultation is available from Thiruvananthapuram now, with Google Meet, Zoom, or WhatsApp video as the preferred platform choices. Home visits are in expansion, so submit the form for a 24-hour availability confirmation.",
  },
  kozhikode: {
    intro: "Online physiotherapy from Kozhikode can start a careful discussion about stroke, post-surgery, neurological, respiratory, or older-adult rehabilitation. Home care remains a locality-based request awaiting clinician confirmation.",
    focus: "Kozhikode’s enquiry areas run from the beach and city centre toward Kottooli, Nadakkavu, and the medical-campus corridor. The exact locality and the person’s recovery goal help us keep the expansion information useful rather than generic.",
    coverage: "Give your exact locality and the person’s recovery goal, such as stroke, post-surgery, neurological, respiratory, or older-adult care. The locality helps determine whether a home visit can be arranged.",
    localitySuffix: "A locality such as Nadakkavu, Kottooli, or the medical-campus area gives more useful context than a city name alone for a Kozhikode enquiry.",
    faqQuestion: "Can families in Kozhikode request a video consultation?",
    faqAnswer: "Yes. Families in Kozhikode can request an online consultation through the form and select their preferred video platform. Home-visit availability is still being expanded, so the team confirms submitted requests within 24 hours.",
  },
  visakhapatnam: {
    intro: "Online physiotherapy from Visakhapatnam can support an initial discussion about stroke, neurological, post-surgery, cardiopulmonary, or complex recovery. Home physiotherapy may be requested after the locality is reviewed.",
    focus: "Visakhapatnam stretches between the coastal core, Madhurawada, Gajuwaka, and the north-south residential corridors. Share the locality and whether the request is for post-surgery, neurological, or mobility support while the in-person network grows.",
    coverage: "Provide your exact locality and whether the request concerns stroke, neurological, post-surgery, cardiopulmonary, or complex recovery. The team checks local feasibility before offering a home visit.",
    localitySuffix: "Madhurawada, Gajuwaka, and the central coastal neighbourhoods represent distinct parts of the Visakhapatnam rollout; name the locality in the form.",
    faqQuestion: "How does the Visakhapatnam expansion enquiry work?",
    faqAnswer: "Submit your Visakhapatnam locality, recovery concern, and preferred date. The team will confirm home-visit availability within 24 hours. An online consultation can be booked now if a video assessment is the better first step.",
  },
  nagpur: {
    intro: "Online physiotherapy from Nagpur can help families discuss post-surgery, stroke, neurological, respiratory, or older-adult rehabilitation. A home-visit request is assessed using the exact locality and current clinician availability.",
    focus: "Nagpur’s central areas and outer corridors such as Manish Nagar, Dharampeth, and Hingna can involve different travel distances. A precise locality makes a future home-visit enquiry easier to review, while online consultation remains available citywide.",
    coverage: "Tell us your exact locality, recovery goal, and preferred timing for post-surgery, stroke, neurological, respiratory, or older-adult rehabilitation. This enables an availability review.",
    localitySuffix: "Manish Nagar, Dharampeth, Wardha Road, and Hingna help identify the different travel corridors covered by the Nagpur expansion enquiry.",
    faqQuestion: "How does Goswami Rehab match care enquiries from Nagpur?",
    faqAnswer: "Submit the Nagpur form with the concern, locality, and preferred date. Most enquiries are resolved through homecare when a suitable qualified professional is available; if local availability is not possible, the same enquiry can proceed through online consultation on Google Meet, Zoom, or WhatsApp video.",
  },
  guwahati: {
    intro: "Online physiotherapy from Guwahati can begin a conversation about stroke, neurological, post-surgery, Guillain-Barré, or older-adult rehabilitation. Home care can be requested, with travel feasibility confirmed for the locality.",
    focus: "Guwahati enquiries may come from the central city, Six Mile, Beltola, Dispur, or the airport-side corridor. Naming the locality and the person’s daily movement challenge gives the team a genuine starting point for the expansion request.",
    coverage: "Share your exact locality and the person’s daily movement goal, with any stroke, neurological, post-surgery, Guillain-Barré, or older-adult context. Homecare is confirmed only if a suitable clinician is available.",
    localitySuffix: "Six Mile, Beltola, Dispur, and the airport-side corridor are useful locality markers for a Guwahati request because distance can affect home-visit planning.",
    faqQuestion: "Can I ask for online rehabilitation support from Guwahati?",
    faqAnswer: "Yes. Online rehabilitation support can be requested from Guwahati now, with a choice of video platform in the form. Home visits remain part of the expansion rollout and the team confirms a submitted locality request within 24 hours.",
  },
  kolkata: {
    intro: "Online physiotherapy from Kolkata can provide a first assessment conversation for stroke, neurological, post-surgery, cardiopulmonary, or complex rehabilitation. Home visits require a separate local availability check.",
    focus: "Kolkata’s established neighbourhoods, Salt Lake, New Town, and the south-city corridors each create different practical travel contexts. Tell us the locality and the recovery goal so an expansion enquiry can be reviewed on its own facts.",
    coverage: "Provide your exact locality and whether the enquiry is about stroke, neurological, post-surgery, cardiopulmonary, or complex rehabilitation. The team uses the information to assess a specific home setting.",
    localitySuffix: "Salt Lake, New Town, Ballygunge, and Garia identify different Kolkata care corridors and should be named in the enquiry instead of using only the city name.",
    faqQuestion: "How can I start physiotherapy support in Kolkata?",
    faqAnswer: "Start by submitting the Kolkata enquiry form with your locality, concern, and preferred date. The team will confirm home-visit options within 24 hours, or you can choose an online consultation and a preferred video platform immediately.",
  },
  chennai: {
    intro: "Online physiotherapy from Chennai can support an initial plan for stroke, neurological, post-surgery, Parkinson’s, or cardiopulmonary rehabilitation. Home physiotherapy is considered after local clinician availability is confirmed.",
    focus: "Chennai’s long north-south and coast-to-inland corridors make the exact locality important, from Adyar and Anna Nagar to Velachery and Tambaram. Online consultation is available while home-visit coverage is expanded.",
    coverage: "Tell us your exact locality and whether the priority is stroke, neurological, post-surgery, Parkinson’s, or cardiopulmonary rehabilitation. A home visit is offered only after local feasibility is confirmed.",
    localitySuffix: "Adyar, Anna Nagar, Velachery, and Tambaram sit on different Chennai travel corridors, so the locality is essential to a useful home-care enquiry.",
    faqQuestion: "Can I book an online consultation from Chennai?",
    faqAnswer: "Yes. Chennai residents can submit an online consultation request and choose their preferred platform—Google Meet, Zoom, or WhatsApp video. Home visits are expanding and a locality-based request is confirmed within 24 hours.",
  },
  coimbatore: {
    intro: "Online physiotherapy from Coimbatore can start guidance for movement, post-surgery, sports, breathing, or neurological rehabilitation. A home-visit request is reviewed by locality and clinician availability.",
    focus: "Coimbatore enquiries can differ between the city centre, Saibaba Colony, Peelamedu, and the Saravanampatti growth corridor. Include the locality and whether you need movement, post-surgery, sports, or breathing guidance.",
    coverage: "Share your exact locality and whether you need movement, post-surgery, sports, breathing, or neurological guidance. The team reviews the setting before confirming any home-visit option.",
    localitySuffix: "Peelamedu, Saibaba Colony, Race Course, and Saravanampatti give the team useful context about the part of Coimbatore involved in an enquiry.",
    faqQuestion: "What can I request from Coimbatore while home visits expand?",
    faqAnswer: "You can request an online consultation now or submit a home-visit enquiry with your Coimbatore locality and preferred date. The team confirms home-visit options within 24 hours and can use the video platform you prefer for online care.",
  },
  madurai: {
    intro: "Online physiotherapy from Madurai can begin a cautious conversation about mobility, post-surgery, stroke, neurological, or respiratory rehabilitation. Home physiotherapy is considered only after the locality and clinician availability are confirmed.",
    focus: "Madurai’s central areas, Anna Nagar, KK Nagar, and the airport-side corridor have different travel patterns. A locality-specific enquiry helps the team understand the practical setting while the local home-visit network is being developed.",
    coverage: "Give your exact locality and whether the goal is mobility, post-surgery, stroke, neurological, or respiratory rehabilitation. The team checks current clinician availability for the request.",
    localitySuffix: "Anna Nagar, KK Nagar, and the airport-side area are distinct Madurai reference points; include one in the form for a clearer response.",
    faqQuestion: "Can Madurai families request an online mobility assessment?",
    faqAnswer: "Submit the Madurai form with the concern, locality, and preferred date. Most enquiries are resolved through homecare when a suitable qualified professional is available; if local availability is not possible, the same enquiry can proceed through online consultation on your chosen video platform.",
  },
  mysuru: {
    intro: "Online physiotherapy from Mysuru can help families explore function goals after surgery, stroke, neurological change, or age-related loss of mobility. Home care can be requested with local availability checked first.",
    focus: "Mysuru care enquiries may come from Vijayanagar, Kuvempunagar, Hebbal, or the areas around the city centre. Sharing the neighbourhood and the person’s function goal keeps the expansion page grounded in the locality rather than broad claims.",
    coverage: "Share your exact locality and the person’s function goal, including any post-surgery, stroke, neurological, or older-adult concern. The address is used to review home-visit feasibility.",
    localitySuffix: "Vijayanagar, Kuvempunagar, Hebbal, and the central city are useful Mysuru locality markers for planning a future home visit.",
    faqQuestion: "How do I enquire about home physiotherapy in Mysuru?",
    faqAnswer: "Submit the Mysuru form with your neighbourhood, main concern, and preferred date. The team will confirm home-visit availability within 24 hours; online consultation is available immediately with a choice of video platform.",
  },
  mangaluru: {
    intro: "Online physiotherapy from Mangaluru can support discussion of neurological, post-surgery, stroke, or mobility rehabilitation. A home-visit request is reviewed for the person’s locality and a suitable clinician.",
    focus: "Mangaluru combines the city centre with coastal and inland corridors such as Bejai, Kadri, Kottara, and Kankanady. Include the locality and the recovery goal so the expansion request reflects the actual setting.",
    coverage: "Provide your exact locality and whether the need involves neurological, post-surgery, stroke, or mobility rehabilitation. A suitable clinician and home setting must be confirmed before a visit.",
    localitySuffix: "Bejai, Kadri, Kottara, and Kankanady help distinguish the Mangaluru localities involved in an enquiry.",
    faqQuestion: "Can someone in Mangaluru request a video assessment?",
    faqAnswer: "Yes. Request a video assessment from Mangaluru through the online consultation form and select the platform you prefer. Home-visit requests are also welcome and are confirmed from the locality within 24 hours.",
  },
  ahmedabad: {
    intro: "Online physiotherapy from Ahmedabad can be a first step for orthopaedic, neurological, post-surgery, or breathing-related rehabilitation. Families may request home care, with availability confirmed for their locality.",
    focus: "Ahmedabad enquiries may involve the older city, Navrangpura, Vastrapur, Satellite, or the Sabarmati-side neighbourhoods. Naming the locality and the person’s main goal helps distinguish a real expansion enquiry from a generic city request.",
    coverage: "Tell us your exact locality and whether the enquiry concerns orthopaedic, neurological, post-surgery, or breathing-related rehabilitation. The team checks availability without making a blanket local claim.",
    localitySuffix: "Navrangpura, Vastrapur, Satellite, and Shahibaug represent different Ahmedabad reference points that make the enquiry more precise.",
    faqQuestion: "What care can I request from Ahmedabad during the rollout?",
    faqAnswer: "You can request an online consultation from Ahmedabad now and choose Google Meet, Zoom, or WhatsApp video. For a home visit, submit your locality and preferred date; the team will confirm availability within 24 hours.",
  },
  surat: {
    intro: "Online physiotherapy from Surat can help discuss mobility, post-surgery, neurological, or sports-related rehabilitation before deciding on a care setting. Home visits depend on clinician availability at the submitted locality.",
    focus: "Surat’s established neighbourhoods and expanding western and southern corridors can create different access needs. Include the area, nearby landmark, and recovery goal so the team can review a home-visit request accurately.",
    coverage: "Share your exact locality, recovery goal, and preferred timing for mobility, post-surgery, neurological, or sports-related support. The team confirms whether home care is practical.",
    localitySuffix: "Adajan, Vesu, Varachha, and Katargam give useful locality context for a Surat enquiry, especially when a home visit is being planned.",
    faqQuestion: "How can I request physiotherapy from Surat?",
    faqAnswer: "Use the Surat form to share your locality, concern, and preferred date. The team will confirm a home-visit option within 24 hours; online consultation is available now and includes a preferred video-platform choice.",
  },
  vadodara: {
    intro: "Online physiotherapy from Vadodara can start a rehabilitation discussion around orthopaedic, post-surgery, neurological, or cardiopulmonary needs. Home physiotherapy can be requested after the local route is confirmed.",
    focus: "Vadodara enquiries commonly need a clear distinction between central neighbourhoods, Alkapuri, Manjalpur, and the Gotri side of the city. The locality and functional goal help shape a useful expansion response.",
    coverage: "Provide your exact locality and the rehabilitation goal, including orthopaedic, post-surgery, neurological, or cardiopulmonary needs. A home visit depends on clinician confirmation.",
    localitySuffix: "Alkapuri, Manjalpur, Gotri, and Karelibaug are specific Vadodara locality markers to include in a home-care request.",
    faqQuestion: "Can I start rehabilitation online from Vadodara?",
    faqAnswer: "Yes. Choose online consultation in the form, describe the rehabilitation goal, and select your preferred video platform. Home visits in Vadodara are expanding and submitted locality requests are confirmed within 24 hours.",
  },
  lucknow: {
    intro: "Online physiotherapy from Lucknow can provide an initial plan for mobility, post-surgery, neurological, or older-adult rehabilitation. Home care remains a request that needs locality-specific clinician confirmation.",
    focus: "Lucknow’s care context changes between Gomti Nagar, Hazratganj, Aliganj, and the newer outer corridors. A locality and recovery goal make an expansion enquiry more useful than a broad citywide availability claim.",
    coverage: "Tell us your exact locality and whether the person needs mobility, post-surgery, neurological, or older-adult support. The team reviews the request for a suitable care setting.",
    localitySuffix: "Gomti Nagar, Hazratganj, Aliganj, and Indira Nagar are useful Lucknow location markers for a precise enquiry.",
    faqQuestion: "What is available for a physiotherapy enquiry in Lucknow?",
    faqAnswer: "Submit your Lucknow locality and preferred date to request a home visit, and the team will confirm availability within 24 hours. Online consultation is available now and lets you select the video platform that fits your household.",
  },
  kanpur: {
    intro: "Online physiotherapy from Kanpur can begin careful guidance for mobility, post-surgery, neurological, or orthopaedic rehabilitation. A home visit is reviewed only after the locality and professional availability are checked.",
    focus: "Kanpur enquiries may come from Civil Lines, Swaroop Nagar, Kakadeo, Kidwai Nagar, or Kalyanpur. Naming the locality and whether the goal is mobility, post-surgery recovery, or neurological support helps the rollout stay locally useful.",
    coverage: "Give your exact locality and whether the goal is mobility, post-surgery, neurological, or orthopaedic rehabilitation. Homecare is considered only after the local route is checked.",
    localitySuffix: "Civil Lines, Swaroop Nagar, Kakadeo, Kidwai Nagar, and Kalyanpur are distinct Kanpur areas to name in a request.",
    faqQuestion: "How does the Kanpur home-visit enquiry work?",
    faqAnswer: "Complete the Kanpur form with your locality, concern, and preferred date. Most enquiries are resolved through homecare when a suitable qualified professional is available; if local availability is not possible, the same enquiry can proceed through online consultation on your chosen video platform.",
  },
  varanasi: {
    intro: "Online physiotherapy from Varanasi can support a first discussion about stroke, post-surgery, neurological, older-adult, or respiratory rehabilitation. Home physiotherapy is considered after local availability is confirmed.",
    focus: "Varanasi’s central areas, Assi, Lanka, Sigra, Cantt, and Shivpur can involve different travel and home settings. Tell us the locality and the person’s everyday function goal so the enquiry can be reviewed with real context.",
    coverage: "Share your exact locality and whether the enquiry concerns stroke, post-surgery, neurological, older-adult, or respiratory rehabilitation. The location helps assess a specific home-visit request.",
    localitySuffix: "Assi, Lanka, Sigra, Cantt, and Shivpur are useful Varanasi locality details for distinguishing an expansion request.",
    faqQuestion: "Can families in Varanasi choose online consultation?",
    faqAnswer: "Yes. Families in Varanasi can request an online consultation and choose Google Meet, Zoom, or WhatsApp video. Home visits are expanding, so include the locality and preferred date for a 24-hour availability confirmation.",
  },
  agra: {
    intro: "Online physiotherapy from Agra can help families discuss post-surgery, stroke, neurological, or mobility rehabilitation. A home-visit request is assessed against the exact locality and current clinician availability.",
    focus: "Agra enquiries can span the older city, Civil Lines, Kamla Nagar, Sikandra, and Taj Nagri. Include the locality and the person’s recovery goal so the page supports a specific request rather than promising blanket coverage.",
    coverage: "Provide your exact locality and the person’s recovery goal, especially after surgery or with stroke, neurological, or mobility needs. The team confirms whether a clinician can visit.",
    localitySuffix: "Kamla Nagar, Civil Lines, Sikandra, Bodla, and Taj Nagri are useful Agra locality references for the expanding service map.",
    faqQuestion: "How can I request care in Agra?",
    faqAnswer: "Submit the Agra form with your locality, recovery need, and preferred date. The team confirms home-visit options within 24 hours; online consultation is available now with your choice of video platform.",
  },
  prayagraj: {
    intro: "Online physiotherapy from Prayagraj can be a cautious first step for mobility, post-surgery, neurological, or older-adult rehabilitation. Home physiotherapy may be requested, subject to local clinician confirmation.",
    focus: "Prayagraj enquiries may involve Civil Lines, George Town, Naini, Jhunsi, or Phaphamau. A named locality and a clear recovery goal help the team review how an expansion request should move forward.",
    coverage: "Tell us your exact locality, recovery concern, and preferred date. Stroke, post-surgery, neurological, and older-adult requests are reviewed for online or locally confirmed home care.",
    localitySuffix: "Civil Lines, George Town, Naini, Jhunsi, and Phaphamau make a Prayagraj request more precise than a city name alone.",
    faqQuestion: "Is home physiotherapy already active in Prayagraj?",
    faqAnswer: "Prayagraj is currently in the expansion rollout, so home-visit availability is confirmed after you submit your locality and preferred date. Online consultation is available now and can use the video platform you select.",
  },
  jodhpur: {
    intro: "Online physiotherapy from Jodhpur can begin a conversation about mobility, post-surgery, neurological, or older-adult rehabilitation. Home care can be requested, with the local clinician route confirmed first.",
    focus: "Jodhpur’s care enquiries may come from Ratanada, Sardarpura, Paota, Pal Road, or Shastri Nagar. Naming the locality and the main mobility or recovery goal gives the team a genuine starting point for the expanding network.",
    coverage: "Give your exact locality and whether the priority is mobility, post-surgery, neurological, or older-adult rehabilitation. The team uses those facts to review home-visit feasibility.",
    localitySuffix: "Ratanada, Sardarpura, Paota, Pal Road, and Shastri Nagar are useful Jodhpur locality anchors for a home-care enquiry.",
    faqQuestion: "What is the online option for families in Jodhpur?",
    faqAnswer: "Families in Jodhpur can request an online consultation now and choose their preferred video platform. For a home visit, submit the locality and preferred date; the expansion team confirms availability within 24 hours.",
  },
  udaipur: {
    intro: "Online physiotherapy from Udaipur can help families discuss function, post-surgery, neurological, or mobility rehabilitation from home. A home visit is considered only after locality and clinician availability are checked.",
    focus: "Udaipur combines established neighbourhoods around Hiran Magri, Sector 11, Fatehpura, Shobhagpura, and Bhupalpura with wider travel distances. Locality details help us understand the home setting while coverage expands.",
    coverage: "Share your exact locality and the person’s function goal, with any post-surgery, neurological, or mobility context. A home visit is considered only after local availability is confirmed.",
    localitySuffix: "Hiran Magri, Sector 11, Fatehpura, Shobhagpura, and Bhupalpura are specific Udaipur areas to include in the request.",
    faqQuestion: "Can I request an online rehabilitation review from Udaipur?",
    faqAnswer: "Yes. Udaipur residents can request an online rehabilitation review through the form and select Google Meet, Zoom, or WhatsApp video. Home-visit enquiries are confirmed within 24 hours while the local network grows.",
  },
  ajmer: {
    intro: "Online physiotherapy from Ajmer can start a careful discussion about mobility, post-surgery, neurological, or older-adult rehabilitation. Families can request home care while the team confirms local feasibility.",
    focus: "Ajmer enquiries can differ between Civil Lines, Vaishali Nagar, Anasagar, Pushkar Road, and Station Road. Share the locality and the recovery goal so the expansion page reflects the practical details of the request.",
    coverage: "Provide your exact locality and whether the enquiry is about mobility, post-surgery, neurological, or older-adult rehabilitation. The address lets the team check whether home care can be arranged.",
    localitySuffix: "Civil Lines, Vaishali Nagar, Anasagar, Pushkar Road, and Station Road are useful Ajmer location details for planning an enquiry.",
    faqQuestion: "How do I submit an Ajmer home-care request?",
    faqAnswer: "Submit the Ajmer form with your locality, concern, and preferred date. The team will confirm whether a home visit can be arranged within 24 hours, and online consultation is available now through your selected video platform.",
  },
  bhopal: {
    intro: "Online physiotherapy from Bhopal can support an initial plan for stroke, post-surgery, Parkinson’s, orthopaedic, or cardiopulmonary rehabilitation. Home physiotherapy remains subject to local clinician availability.",
    focus: "Bhopal’s neighbourhoods stretch across older central areas, Arera Colony, MP Nagar, Kolar Road, and the lakeside side of the city. A locality and functional goal help the expansion team assess each request on its own details.",
    coverage: "Tell us your exact locality and whether the person needs stroke, post-surgery, Parkinson’s, orthopaedic, or cardiopulmonary rehabilitation. Home visits remain subject to clinician availability.",
    localitySuffix: "Arera Colony, MP Nagar, Kolar Road, and the old city are useful Bhopal locality markers for a precise request.",
    faqQuestion: "Can Bhopal patients request video physiotherapy for breathing support?",
    faqAnswer: "Yes. Request online consultation from Bhopal and choose the video platform that works for you. Home visits are in expansion, so submit your locality and preferred date for confirmation within 24 hours.",
  },
  indore: {
    intro: "Online physiotherapy from Indore can begin guidance around post-surgery, stroke, neurological, respiratory, or older-adult rehabilitation. A home-visit request needs an exact locality and availability confirmation.",
    focus: "Indore enquiries can involve Vijay Nagar, Palasia, Rau, and the Super Corridor, each with a different local travel pattern. Tell us the locality and the person’s recovery goal while home-visit coverage is expanded.",
    coverage: "Share your exact locality, main concern, and preferred timing for post-surgery, stroke, neurological, respiratory, or older-adult rehabilitation. The team reviews the appropriate care setting.",
    localitySuffix: "Vijay Nagar, Palasia, Rau, and the Super Corridor are useful Indore area references for an expansion enquiry.",
    faqQuestion: "What should I share when enquiring from Indore?",
    faqAnswer: "Share your Indore locality, main concern, preferred date, and whether online consultation would work. The team confirms a home-visit option within 24 hours and can arrange video care through your preferred platform.",
  },
  patna: {
    intro: "Online physiotherapy from Patna can provide a first discussion for neurological, post-surgery, stroke, or mobility rehabilitation. Home care may be requested and is confirmed only for the stated locality.",
    focus: "Patna’s enquiries may come from central neighbourhoods, Kankarbagh, Rajendra Nagar, Boring Road, or Danapur. Naming the locality helps the team understand the practical setting while the home-visit rollout expands.",
    coverage: "Give your exact locality and whether the goal is neurological, post-surgery, stroke, or mobility rehabilitation. The team checks whether a home visit is feasible before confirming it.",
    localitySuffix: "Kankarbagh, Rajendra Nagar, Boring Road, and Danapur are specific Patna locality markers to include in the form.",
    faqQuestion: "How can I get rehabilitation guidance from Patna?",
    faqAnswer: "You can request an online consultation from Patna now by choosing a video platform in the form. For a home visit, submit your locality and preferred date; the expansion team confirms availability within 24 hours.",
  },
  ranchi: {
    intro: "Online physiotherapy from Ranchi can help families explore neurological, stroke, post-surgery, or mobility rehabilitation. A home-visit request is reviewed for the address and a suitable available clinician.",
    focus: "Ranchi combines central neighbourhoods with corridors around Morabadi, Harmu, Lalpur, and Bariatu. A clear locality and recovery goal keep each expansion enquiry grounded in the person’s actual home setting.",
    coverage: "Provide your exact locality and recovery goal, including any neurological, stroke, post-surgery, or mobility concern. The team reviews the home setting and available clinician route.",
    localitySuffix: "Morabadi, Harmu, Lalpur, Bariatu, and the central city are useful Ranchi location details for a home-care request.",
    faqQuestion: "Can I request a video consultation from Ranchi?",
    faqAnswer: "Yes. Ranchi residents can submit an online consultation request and select Google Meet, Zoom, or WhatsApp video. Home visits are expanding and a submitted locality request is reviewed within 24 hours.",
  },
  bhubaneswar: {
    intro: "Online physiotherapy from Bhubaneswar can start a cautious plan for stroke, neurological, post-surgery, cardiopulmonary, or mobility rehabilitation. Home physiotherapy is considered after local availability is checked.",
    focus: "Bhubaneswar enquiries may involve Saheed Nagar, Patia, Khandagiri, Jayadev Vihar, or Old Town. Include the locality and the person’s daily function goal so the expansion page stays specific and useful.",
    coverage: "Tell us your exact locality and whether the person needs stroke, neurological, post-surgery, cardiopulmonary, or mobility rehabilitation. A home visit requires confirmation for that address.",
    localitySuffix: "Saheed Nagar, Patia, Khandagiri, Jayadev Vihar, and Old Town are useful Bhubaneswar area references for the rollout.",
    faqQuestion: "How do I ask about physiotherapy in Bhubaneswar?",
    faqAnswer: "Submit your Bhubaneswar locality, recovery concern, and preferred date in the form. The team confirms home-visit availability within 24 hours, while online consultation is available now with your preferred video platform.",
  },
  dehradun: {
    intro: "Online physiotherapy from Dehradun can support an initial conversation about stroke, neurological, post-surgery, Parkinson’s, or cardiopulmonary rehabilitation. Home visits require locality-specific confirmation.",
    focus: "Dehradun enquiries may run along the Rajpur Road, Prem Nagar, Raipur Road, Clement Town, and Ballupur corridors. Share the locality and recovery goal so the team can assess the request while local home visits expand.",
    coverage: "Share your exact locality and whether the priority is stroke, neurological, post-surgery, Parkinson’s, or cardiopulmonary rehabilitation. The team checks local clinician availability first.",
    localitySuffix: "Rajpur Road, Prem Nagar, Raipur Road, Clement Town, and Ballupur identify different Dehradun care corridors for a precise enquiry.",
    faqQuestion: "Is online consultation available from Dehradun?",
    faqAnswer: "Yes. Online consultation is available from Dehradun and you can select the video platform in the form. Home visits are part of the expansion rollout and are confirmed from the submitted locality within 24 hours.",
  },
  haridwar: {
    intro: "Online physiotherapy from Haridwar can begin discussion of mobility, post-surgery, neurological, or older-adult rehabilitation. A home-care request is reviewed against the exact area and available clinician.",
    focus: "Haridwar enquiries may involve Jwalapur, Shivalik Nagar, SIDCUL, Ranipur, Kankhal, or Roshnabad. Naming the locality and the main recovery goal helps distinguish a real request while in-person coverage is expanded.",
    coverage: "Provide your exact locality and the main mobility, post-surgery, neurological, or older-adult recovery need. The team reviews whether a suitable clinician can travel there.",
    localitySuffix: "Jwalapur, Shivalik Nagar, SIDCUL, Ranipur, Kankhal, and Roshnabad are useful Haridwar location details for an enquiry.",
    faqQuestion: "Does home physiotherapy travel to my area in Haridwar?",
    faqAnswer: "Use the Haridwar form to share your locality, concern, and preferred date. The team confirms home-visit options within 24 hours; online consultation can be requested now with a video platform of your choice.",
  },
  jammu: {
    intro: "Online physiotherapy from Jammu can help families discuss mobility, post-surgery, neurological, or cardiopulmonary rehabilitation. Home physiotherapy can be requested after local clinician availability is confirmed.",
    focus: "Jammu enquiries can differ between Gandhi Nagar, Trikuta Nagar, Bakshi Nagar, Sainik Colony, and Talab Tillo. Include the locality and whether the priority is mobility, post-surgery, neurological, or cardiopulmonary support.",
    coverage: "Tell us your exact locality and whether the priority is mobility, post-surgery, neurological, or cardiopulmonary rehabilitation. Homecare is confirmed only when a suitable clinician is available.",
    localitySuffix: "Gandhi Nagar, Trikuta Nagar, Bakshi Nagar, Sainik Colony, and Talab Tillo are useful Jammu locality markers for the expansion map.",
    faqQuestion: "Can I choose a video consultation from Jammu?",
    faqAnswer: "Yes. Choose online consultation from Jammu and select Google Meet, Zoom, or WhatsApp video in the form. Home-visit availability is confirmed within 24 hours after you share your locality and preferred date.",
  },
};

export function getExpansionProfile(city: CityData): ExpansionProfile & {
  intro: string;
  coverage: string;
  faq: { q: string; a: string };
  localityDescription: (area: string) => string;
} {
  const profile = profiles[city.slug];
  if (!profile) {
    throw new Error(`Missing expansion profile for ${city.slug}`);
  }
  const patientEnquiryMessage = `Online physiotherapy consultation is available now from ${city.name}. Home-visit enquiries help us assess demand for future team placement. A visit is not confirmed until a team is placed and exact-locality and clinician availability are checked.`;
  const faqAnswer = `Online consultation is available now from ${city.name}. Home-visit enquiries may support future team placement, but a visit is confirmed only after a clinician is placed and your exact locality is checked.`;
  return {
    ...profile,
    intro: `${patientEnquiryMessage} Share your exact locality, recovery goal, and preferred date so the team can review the enquiry within 24 hours.`,
    focus: `Online consultation is available now from ${city.name}. If you need an in-person visit, share your location so the team can assess whether demand supports future clinician placement.`,
    coverage: `Home-visit enquiries from ${city.name} help assess demand for a local team. Until a team is placed and confirms your exact locality and clinician availability, online consultation is the currently available option.`,
    faqAnswer,
    faq: {
      q: profile.faqQuestion,
      a: faqAnswer,
    },
    localityDescription: (area: string) =>
      `${area} is a locality reference for a ${city.name} enquiry, not a confirmed service area. Online consultation is available now; a home visit depends on team placement and exact-locality confirmation.`,
  };
}

export function getExpansionProfileSlugs(): string[] {
  return Object.keys(profiles);
}