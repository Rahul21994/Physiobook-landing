import "@/legal.css";
import { motion } from "@/lib/motion";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { BUSINESS_CONFIG } from "@/config/business";

export default function Privacy() {
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

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground mb-12">Last updated: 27 September 2026</p>

          <div className="legal-prose">

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">1. Who We Are</h2>
              <p>
                Goswami Rehab is the public brand of Goswami Institute of Functional Training (“we”, “us”, or “our”), a homecare physiotherapy and functional training service operating across India, based at {BUSINESS_CONFIG.headOffice.address.streetAddress}, {BUSINESS_CONFIG.headOffice.address.localityLine}. {BUSINESS_CONFIG.availability.online}; {BUSINESS_CONFIG.availability.inPerson}. Use our <Link href="/contact" className="text-primary hover:underline">contact form</Link> to reach the team.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p>When you use our website or make a booking, we may collect:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Contact information</strong> — your name, phone number, and email address provided when you submit a booking, consultation, or contact request.</li>
                <li><strong>Health information</strong> — details about your condition or the type of service you are seeking, provided voluntarily in a consultation or booking request.</li>
                <li><strong>Usage data</strong> — standard web server logs including your IP address, browser type, and pages visited, collected automatically when you browse our website.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p>We use the information you provide solely to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Process and confirm your appointment booking.</li>
                <li>Review and respond to consultation and contact requests.</li>
                <li>Coordinate a homecare session or online consultation that you request.</li>
                <li>Send you service-related communications (e.g. appointment confirmations).</li>
              </ul>
              <p className="mt-3">We do not sell booking or contact details that you submit, or use those submitted details to target advertising.</p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">4. Health Information</h2>
              <p>
                Any health-related information you share with us is treated as sensitive personal data under the Digital Personal Data Protection Act, 2023 (DPDP Act). We collect this information only when you voluntarily provide it, use it exclusively to deliver the physiotherapy or training service you have requested, and do not disclose it to any third party without your explicit consent.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">5. Data Storage and Security</h2>
              <p>
                Consultation requests, bookings, and contact details are stored in a secure, password-protected database hosted on Replit's infrastructure. We apply reasonable technical measures to protect your data from unauthorised access, loss, or disclosure. We retain your data for as long as necessary to provide the service and meet any applicable legal obligations, typically no longer than two years from your last interaction with us.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">6. Sharing Your Information</h2>
              <p>We do not sell, rent, or trade your personal information. We may share it only in the following limited circumstances:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li><strong>Service delivery</strong> — with our own clinical staff who need it to provide your session.</li>
                <li><strong>Legal obligations</strong> — if required by law or a valid government authority.</li>
                <li><strong>Business transfer</strong> — in the unlikely event that the business is transferred, your data would transfer under the same privacy protections described here.</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">7. Subprocessor Disclosure and Service Providers</h2>
              <p>
                 We use a limited number of subprocessors and service providers to operate this
                 website and deliver requested services. The current categories and purposes are:
              </p>
               <ul className="list-disc pl-6 mt-3 space-y-2">
                 <li><strong>Replit</strong> — hosting, application runtime, and database infrastructure.</li>
                <li><strong>Google Gmail</strong> — delivery of consultation, booking, contact, feedback, and requested document notifications.</li>
                 <li><strong>Google Tag Manager</strong> — managing website tags; tags enabled in the container may send technical or usage information to Google or the relevant tag provider.</li>
               </ul>
              <p className="mt-3">
                  We review subprocessors for appropriate security and data-protection terms and
                  maintain data-processing agreements (DPAs) where applicable. We do not
                  authorise these providers to sell, advertise to, or independently profile you
                  using information sent through our website. This section is our current
                  subprocessor disclosure; contact us if you need more information about a
                  provider involved in a specific request.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">8. Your Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 mt-3 space-y-2">
                <li>Request access to the personal data we hold about you.</li>
                <li>Ask us to correct inaccurate information.</li>
                <li>Ask us to delete your information (subject to any legal retention obligations).</li>
                <li>Withdraw consent for us to contact you at any time.</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, use our <Link href="/contact" className="text-primary hover:underline">contact form</Link> and identify your message as a privacy request; do not include health details unless they are needed to locate the record. You can also review our <Link href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">9. Cookies</h2>
              <p>
                We use Google Tag Manager to manage website tags. Depending on the tags enabled in its container, those tags may use analytics cookies or similar storage and send page-usage or browser/device information to Google or the relevant tag provider. We do not use website tags to collect health details submitted in booking or contact forms. You can block cookies through your browser settings; some site features may then work differently.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">10. Third-Party Links</h2>
              <p>
                Our website may contain links to external sites such as Google Maps or WhatsApp. We are not responsible for the privacy practices of those services. We encourage you to review their privacy policies.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">11. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this page. Continued use of our website after any changes constitutes your acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl font-semibold text-foreground mb-3">12. Contact</h2>
              <p>
                If you have any questions or concerns about this Privacy Policy or how we handle your data, use our contact form and identify your message as a privacy request.
              </p>
              <address className="mt-3 not-italic">
                <strong>{BUSINESS_CONFIG.headOffice.displayName}</strong><br />
                {BUSINESS_CONFIG.headOffice.description}<br />
                {BUSINESS_CONFIG.headOffice.address.streetAddress}<br />
                {BUSINESS_CONFIG.headOffice.address.localityLine}<br />
                {BUSINESS_CONFIG.availability.online}. {BUSINESS_CONFIG.availability.inPerson}.<br />
                Not a patient clinic or walk-in location.
              </address>
            </section>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
