import "@/legal.css";
import { motion } from "@/lib/motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { BUSINESS_CONFIG } from "@/config/business";

export default function Terms() {
  return (
    <div className="bg-background min-h-screen py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6 max-w-3xl">
        <motion.div
          suppressHydrationWarning
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors mb-10">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Terms &amp; Conditions</h1>
          <p className="text-sm text-muted-foreground mb-5">Last updated: 26 August 2026</p>
          <p className="rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm leading-relaxed text-foreground/80 mb-12">
            These terms are written for Goswami Rehab, the public brand of Goswami Institute of Functional Training, an Indian sole-proprietorship service. They are intended as plain-language website terms and should be reviewed by an Indian lawyer before being relied on as a complete legal contract.
          </p>

          <div className="legal-prose">

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the website at <a href="https://goswamirehab.in" className="text-primary hover:underline">goswamirehab.in</a> (the "Site") or by requesting a service from Goswami Rehab (the public brand of Goswami Institute of Functional Training; "Goswami Rehab", "Goswami Institute", "we", "us", or "our"), you agree to these Terms &amp; Conditions. Goswami Institute is operated as a sole proprietorship from Jaipur, Rajasthan. If you do not agree, please do not use the Site or our services.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">2. Our Services</h2>
              <p>
                Goswami Rehab provides homecare physiotherapy, functional training, rehabilitation programmes, sports enhancement consultation, and nutritional consultation delivered to clients' premises where a suitable professional is available. Services are provided by qualified professionals appropriate to the service requested; availability and scope are confirmed before an appointment.
              </p>
              <p className="mt-3">
                The information published on this Site, including journal articles, is for general education only and is not a diagnosis, emergency service, medical prescription, or substitute for an in-person clinical assessment. Do not delay emergency care because of anything on this Site. Always consult a qualified healthcare professional regarding your condition before starting physiotherapy, exercise, or nutrition changes.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">3. Booking and Appointments</h2>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Submitting a booking request through the Site does not guarantee an appointment. We will contact you to confirm availability and finalise the appointment time.</li>
                <li>Sessions are subject to therapist availability and geographic coverage at the time of booking.</li>
                 <li>The applicable session fee, including any introductory rate shown at booking, will be confirmed before the appointment. Payment is due as communicated by our team, normally at or before the session.</li>
                <li>Please provide accurate contact details and health information to enable us to deliver the appropriate service safely.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">4. Cancellations and Rescheduling</h2>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Please notify us at least 24 hours in advance if you need to cancel or reschedule an appointment, via WhatsApp or email.</li>
                 <li>Late cancellations (less than 4 hours before the session) or no-shows may be subject to a reasonable cancellation fee if this was communicated before confirmation. Any refund or rescheduling decision will be explained by our team.</li>
                <li>We reserve the right to cancel or reschedule a session due to unforeseen circumstances. We will give you as much notice as possible and offer an alternative time.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">5. Health and Safety</h2>
              <p>
                You acknowledge that physiotherapy and exercise involve physical activity and may carry risks including pain, fatigue, falls, or injury. Before treatment, tell the professional about relevant diagnoses, medicines, allergies, recent surgery, pregnancy, implanted devices, and symptoms. You agree to follow safety instructions, use prescribed aids, and stop and report new or worsening symptoms. Chest pain, severe breathlessness, fainting, sudden weakness, or other emergency symptoms require immediate local emergency care, not a website booking.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
              <p>
                All content on this Site — including text, images, blog articles, graphics, and the Site's design — is the property of Goswami Institute of Functional Training and is protected by applicable copyright laws. You may not reproduce, distribute, or create derivative works from any content on this Site without our prior written permission.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
              <p>
                The Site and its educational content are provided on an “as available” basis. We take reasonable care to keep information accurate and current but do not promise uninterrupted access or a particular clinical result. Recovery depends on the individual, diagnosis, medical advice, participation, and other factors; no article, timeline, discount, or testimonial guarantees an outcome.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>
                Nothing in these Terms excludes or limits a right or remedy that cannot lawfully be excluded under Indian law, including applicable consumer-protection rights. Subject to that limitation, and to the extent permitted by law, liability for a particular paid session is limited to the amount paid for that session, except where loss results from our fraud, wilful misconduct, or legally non-excludable negligence.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">9. Privacy</h2>
              <p>
                Your use of the Site is also governed by our <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which is incorporated into these Terms by reference.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">10. Changes to These Terms</h2>
              <p>
                We reserve the right to update these Terms of Service at any time. The revised terms will be posted on this page with an updated "Last updated" date. Your continued use of the Site after any changes constitutes acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">11. Governing Law</h2>
              <p>
                 These Terms are governed by the laws of India, including applicable provisions of the Indian Contract Act, 1872, the Consumer Protection Act, 2019, the Consumer Protection (E-Commerce) Rules, 2020, the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023 where applicable to the service or transaction. We will first try to resolve complaints directly. Subject to any mandatory consumer forum or other statutory remedy available to you, disputes are subject to the courts of Jaipur, Rajasthan.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">12. Reviews and User Content</h2>
              <p>
                If you submit feedback or a review, you confirm that it is your own experience, does not contain another person’s private health information, and is not unlawful, defamatory, or misleading. You grant us permission to display approved feedback for service information and moderation purposes. We may edit for length or privacy, decline publication, or remove content that does not meet these standards. We do not publish a review as proof that a particular result is typical or guaranteed.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">13. Grievance and Contact</h2>
              <p>
                If you have any questions about these Terms, use our <Link href="/contact" className="text-primary hover:underline">contact form</Link>.
              </p>
              <address className="mt-3 not-italic">
                <strong>{BUSINESS_CONFIG.headOffice.displayName}</strong><br />
                {BUSINESS_CONFIG.headOffice.description}<br />
                {BUSINESS_CONFIG.headOffice.address.displayAddress}<br />
                Online consultations available 24/7; in-person care is by appointment only.<br />
                Not a patient clinic or walk-in location.
              </address>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
