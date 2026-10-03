import { Link, useLocation } from "wouter";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { LanguageToggle } from "@/lib/language";
import { BUSINESS_CONFIG } from "@/config/business";
import {
  BUSINESS_EMAIL,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_WHATSAPP_URL,
  BUSINESS_GURUGRAM_GBP_URL,
  BUSINESS_HQ_ADDRESS,
} from "@/lib/contact";
import { trackEvent } from "@/lib/analytics";
import { getCityBySlug, hasVerifiedHomecareCoverage } from "@/lib/cities";
import { CarePathLauncher } from "@/components/CarePathLauncher";

function closeMobileMenu(e: React.MouseEvent) {
  const details = (e.currentTarget as HTMLElement).closest("details") as HTMLDetailsElement | null;
  if (details) details.open = false;
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const cityRouteMatch = location.match(/^\/physiotherapist-at-home\/([^/?#]+)/);
  const cityRoute = cityRouteMatch ? getCityBySlug(cityRouteMatch[1]) : undefined;
  const isExpansionCity =
    cityRoute !== undefined && !hasVerifiedHomecareCoverage(cityRoute);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/cities", label: "Cities" },
    { href: "/online-care", label: "Online Care" },
    { href: "/#reviews", label: "Patient Reviews", usesHash: true },
    { href: "/blog", label: "Journal" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 min-h-20 py-2 flex items-center justify-between gap-6">
          <div className="flex min-w-0 flex-col">
            <a
              href="/"
              className="flex items-center gap-2.5 group"
              data-testid="link-logo"
            >
              <span
                className="relative flex h-10 w-10 shrink-0 items-center justify-center transition-transform duration-300 group-hover:-rotate-3 group-focus-visible:-rotate-3"
                aria-hidden="true"
              >
              <svg
                className="h-10 w-10"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="header-brand-gradient" x1="4" y1="3" x2="20" y2="21" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#0F766E" />
                    <stop offset="1" stopColor="#164E63" />
                  </linearGradient>
                </defs>
                <circle cx="12" cy="12" r="10.5" fill="url(#header-brand-gradient)" />
                <path
                  d="M18.5 8.2A7.2 7.2 0 1 0 18.7 15"
                  stroke="#F8F3E7"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M6.1 12.3h2.8l1.45-3.1 2.25 5.9 1.7-3h3.45"
                  stroke="#F8F3E7"
                  strokeWidth="1.35"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="19.15" cy="5.1" r="1.35" fill="#D9F99D" />
              </svg>
              </span>
              <span className="flex min-w-0 flex-col leading-tight">
                <span className="whitespace-nowrap font-serif text-[1.05rem] font-semibold tracking-tight text-foreground sm:text-[1.15rem]">
                  Goswami Rehab™
                </span>
                <span className="mt-1 block max-w-[14rem] text-[0.55rem] font-semibold tracking-[0.06em] text-primary leading-[1.25] sm:max-w-[20rem] sm:text-[0.62rem]">
                  Physiotherapy <span className="text-primary/80" aria-hidden="true">•</span> Nutrition <span className="text-primary/80" aria-hidden="true">•</span> Exercise Physiology
                </span>
                <span className="mt-0.5 block max-w-[14rem] text-[0.5rem] tracking-[0.03em] text-muted-foreground leading-[1.2] sm:max-w-[20rem] sm:text-[0.56rem]">
                  One place for complete recovery and wellness.
                </span>
              </span>
            </a>
            <div className="hidden md:block ml-[3.25rem] mt-1" data-testid="brand-language-control">
              <LanguageToggle />
            </div>
            <div className="md:hidden ml-[3.25rem] mt-1" data-testid="mobile-brand-language-control">
              <LanguageToggle />
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              link.usesHash ? (
                <a
                  key={link.href}
                  href={link.href}
                   className="text-sm font-medium transition-colors hover:text-primary text-foreground"
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                     location === link.href ? "text-primary" : "text-foreground"
                  }`}
                  data-testid={`link-nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Link>
              )
            ))}
             <CarePathLauncher citySlug={cityRoute?.slug} compact />
             <Button
               asChild
               variant="booking"
               className="rounded-full px-6 shadow-sm hover:shadow transition-all font-medium"
             >
               <Link
               href="/booking"
               data-testid="link-nav-booking"
               data-cta="global-booking"
               onClick={() => trackEvent("booking_cta_click", { route: location, placement: "header" })}
             >
                Book an Appointment
              </Link>
            </Button>
          </nav>

          {/* Mobile Menu — native <details> so it works without JavaScript */}
          <details className="md:hidden relative" data-testid="mobile-menu">
            <summary
              className="p-2 text-foreground cursor-pointer list-none select-none"
              aria-label="Open navigation menu"
            >
              {/* Hamburger icon — pure SVG, no JS dependency */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="3" y1="6"  x2="21" y2="6"  />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </summary>
            {/* Dropdown — absolutely positioned so it overlays the page, never clipped */}
            <div
              data-testid="mobile-nav-panel"
              className="mobile-nav-panel absolute top-full right-0 mt-2 w-64 rounded-2xl border border-border bg-background shadow-xl overflow-hidden"
            >
              <nav className="flex flex-col p-3 gap-1">
                {navLinks.map((link) => (
                  link.usesHash ? (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="text-base font-medium px-4 py-3 rounded-xl transition-colors text-foreground hover:bg-accent"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      className={`text-base font-medium px-4 py-3 rounded-xl transition-colors ${
                        location === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  )
                ))}
                <div className="pt-2">
                  <CarePathLauncher citySlug={cityRoute?.slug} className="w-full" mobileMenu />
                </div>
                <div className="pt-2 border-t border-border mt-1">
                   <Button asChild variant="booking" className="w-full rounded-full" size="lg">
                     <Link
                     href="/booking"
                     onClick={(event) => {
                       trackEvent("booking_cta_click", { route: location, placement: "mobile-menu" });
                       closeMobileMenu(event);
                     }}
                   >
                      Book an Appointment
                    </Link>
                  </Button>
                </div>
              </nav>
            </div>
          </details>
        </div>
      </header>

      <main className="flex-1">
        <Breadcrumbs />
        {children}
      </main>

      {/* WhatsApp floating button is hidden on expansion city pages, where all booking starts with the form. */}
      {BUSINESS_WHATSAPP_URL && !isExpansionCity && <a
        href={`${BUSINESS_WHATSAPP_URL}?text=Hi%2C%20I%27d%20like%20to%20book%20an%20appointment%20at%20Goswami%20Rehab`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        data-cta="global-whatsapp"
        onClick={() => trackEvent("contact_cta_click", { route: location, channel: "whatsapp", placement: "floating" })}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
      >
        <span className="hidden group-hover:flex items-center bg-white text-gray-700 text-sm font-medium px-3 py-2 rounded-full shadow-lg border border-gray-100 whitespace-nowrap transition-all">
          Chat with us
        </span>
        <div className="whatsapp-float w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform group-hover:scale-110">
           <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.528 5.856L0 24l6.335-1.51A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.376l-.36-.214-3.732.889.934-3.617-.235-.372A9.818 9.818 0 1112 21.818z"/>
          </svg>
        </div>
      </a>}

      <footer className="bg-secondary/50 border-t border-border pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="font-serif font-semibold text-lg text-foreground">
                  Goswami Rehab
                </span>
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                 Specialist homecare physiotherapy in 45 listed cities, with exact-locality and clinician availability confirmed before visits. Our 35+ specialist physiotherapists, nutritionist, and exercise physiologist support coordinated care.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-foreground font-serif">Quick Links</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/cities" className="hover:text-primary transition-colors">Cities We Serve</Link></li>
                 <li><Link href="/online-care" className="hover:text-primary transition-colors">Online Consultation</Link></li>
                <li><Link href="/booking" className="hover:text-primary transition-colors">Book an Appointment</Link></li>
                <li><Link href="/blog" className="hover:text-primary transition-colors">Journal & Tips</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-foreground font-serif">Our Services</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/home-physiotherapy" className="hover:text-primary transition-colors">Home Physiotherapy</Link></li>
                <li><Link href="/sports-injury-rehabilitation" className="hover:text-primary transition-colors">Sports Injury Rehabilitation</Link></li>
                <li><Link href="/services/functional-training" className="hover:text-primary transition-colors">Functional Training</Link></li>
                <li><Link href="/nutritionist-dietitian-online" className="hover:text-primary transition-colors">Online Nutritionist &amp; Dietitian</Link></li>
                <li><Link href="/services/rehabilitation-programs" className="hover:text-primary transition-colors">Rehabilitation Programs</Link></li>
                <li><Link href="/online-physiotherapy" className="hover:text-primary transition-colors">Online Physiotherapy</Link></li>
                <li><Link href="/exercise-physiologist" className="hover:text-primary transition-colors">Exercise Physiology</Link></li>
                <li><Link href="/neck-pain" className="hover:text-primary transition-colors">Neck Pain</Link></li>
                <li><Link href="/sciatica" className="hover:text-primary transition-colors">Sciatica</Link></li>
                <li><Link href="/arthritis-osteoarthritis" className="hover:text-primary transition-colors">Arthritis &amp; Osteoarthritis</Link></li>
                <li><Link href="/parkinsons-rehab" className="hover:text-primary transition-colors">Parkinson’s Rehabilitation</Link></li>
                <li><Link href="/weight-management" className="hover:text-primary transition-colors">Weight Management</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-6 text-foreground font-serif">Contact</h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="leading-relaxed">
                  <span className="font-medium text-foreground">{BUSINESS_CONFIG.headOffice.displayName}</span><br />
                  {BUSINESS_CONFIG.headOffice.description}<br />
                    {BUSINESS_HQ_ADDRESS.streetAddress}<br />
                    {BUSINESS_HQ_ADDRESS.localityLine}
                  <p className="mt-2 leading-relaxed">
                    {BUSINESS_CONFIG.availability.online}. {BUSINESS_CONFIG.availability.inPerson}; this is not a patient clinic or walk-in location.
                  </p>
                </li>
                {(BUSINESS_PHONE_TEL || (BUSINESS_WHATSAPP_URL && !isExpansionCity)) && (
                  <li>
                    {BUSINESS_PHONE_TEL && (
                      <a href={BUSINESS_PHONE_TEL} className="hover:text-primary transition-colors">
                        {BUSINESS_PHONE_DISPLAY}
                      </a>
                    )}
                    {BUSINESS_WHATSAPP_URL && !isExpansionCity && (
                    <a href={BUSINESS_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                      WhatsApp
                    </a>
                    )}
                  </li>
                )}
                {BUSINESS_EMAIL && (
                  <li>
                    <a href={`mailto:${BUSINESS_EMAIL}`} className="break-all hover:text-primary transition-colors">
                      {BUSINESS_EMAIL}
                    </a>
                  </li>
                )}
                <li>
                  <a
                    href={BUSINESS_GURUGRAM_GBP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary transition-colors"
                  >
                    Service area profile
                  </a>
                </li>
                <li>
                  <a href="https://goswamirehab.in" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    goswamirehab.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-border/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
             <div className="max-w-2xl text-center md:text-left">
               <p>&copy; {new Date().getFullYear()} Goswami Rehab™ · Goswami Institute of Functional Training. All rights reserved.</p>
               <p className="mt-2">Goswami Rehab™ trademark application/status under review. Site content may not be copied or reused without permission.</p>
             </div>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
               <Link href="/terms" className="hover:text-primary transition-colors">Terms &amp; Conditions</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
