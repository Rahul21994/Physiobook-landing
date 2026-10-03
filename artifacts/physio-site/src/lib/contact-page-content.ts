import { BUSINESS_CONFIG } from "../config/business.ts";

export const CONTACT_PAGE_DESCRIPTION =
  `Contact Goswami Rehab for online or in-person physiotherapy and rehabilitation. ${BUSINESS_CONFIG.availability.online}; ${BUSINESS_CONFIG.availability.inPerson.toLowerCase()}.`;

export const CONTACT_FAQS = [
  {
    q: "Is Gift Rehab Center a walk-in clinic?",
    a: "No. Gift Rehab Center is Goswami Rehab’s Head Office and Doctor Training Centre. Visits are by appointment only; it is not a patient clinic or walk-in location.",
  },
  {
    q: "When can I request an online consultation?",
    a: "Online consultations are available 24/7. In-person care is by appointment only, and the team confirms appointment availability after reviewing your request.",
  },
  {
    q: "What happens after I submit the form?",
    a: "Your request is saved for review. Share only the information needed to respond; do not use this form for emergencies or urgent medical symptoms.",
  },
] as const;