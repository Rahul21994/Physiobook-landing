import { Link } from "wouter";
import { motion } from "@/lib/motion";
import { Helmet } from "react-helmet-async";
import { MapPin, ArrowRight, Map } from "lucide-react";
import { cities } from "@/lib/cities";
import { states } from "@/lib/states";
import { trackEvent } from "@/lib/analytics";

// Region display order and icons
const REGION_ORDER = [
  "Rajasthan",
  "Delhi NCR",
  "Punjab",
  "North India",
  "Central India",
  "West India",
  "Maharashtra",
  "South India",
  "Kerala",
  "East India",
  "North East India",
];

// Group cities by region in the defined order
function groupByRegion(citiesList: typeof cities) {
  const map: Record<string, typeof cities> = {};
  for (const city of citiesList) {
    if (!map[city.region]) map[city.region] = [];
    map[city.region].push(city);
  }
  return REGION_ORDER.filter((r) => map[r]).map((region) => ({
    region,
    cities: map[region],
  }));
}

const grouped = groupByRegion(cities);

export default function CitiesPage() {
  return (
    <>
      <Helmet>
        <title>Cities We Serve | Goswami Rehab</title>
        <meta
          name="description"
          content="Goswami Rehab provides home visits and online physiotherapy in all 45 listed cities in India. Browse locations by region and confirm your exact locality."
        />
        <link rel="canonical" href="https://goswamirehab.in/cities" />
      </Helmet>

      {/* Hero */}
      <section className="relative bg-secondary/40 border-b border-border/50 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div
            suppressHydrationWarning
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-full mb-6">
              <MapPin className="w-4 h-4" />
               <span>45 Cities Across India</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              Cities We Serve
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">
              Home visits and online physiotherapy are available in all 45 listed cities across India.
              Find your city below and share your exact locality for clinician confirmation.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Choose a location to read about named locality references, rehabilitation
              needs, pricing, and the online booking process. A city listing does not guarantee
              every neighbourhood; exact locality and clinician availability are confirmed before booking.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              For the care format itself, read about{" "}
              <Link href="/home-physiotherapy" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
                homecare physiotherapy
              </Link>
              {" "}or{" "}
              <Link href="/online-care" className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">
                online physiotherapy consultation
              </Link>
              {" "}before choosing a location.
            </p>
          </motion.div>
        </div>
      </section>

      {/* City Grid by Region */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="space-y-16">
            {grouped.map(({ region, cities: regionCities }, groupIdx) => (
              <motion.div
                suppressHydrationWarning
                key={region}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: groupIdx * 0.07 }}
              >
                {/* Region heading */}
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-serif text-2xl font-bold text-foreground">
                    {region}
                  </h2>
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-sm text-muted-foreground tabular-nums">
                    {regionCities.length} {regionCities.length === 1 ? "city" : "cities"}
                  </span>
                </div>

                {/* City cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {regionCities.map((city) => (
                    <div
                      key={city.slug}
                      className="rounded-xl border border-border bg-background p-3 hover:border-primary/50 transition-all duration-150"
                    >
                      <Link
                        href={`/physiotherapist-at-home/${city.slug}`}
                        className="group flex items-center justify-between gap-2 px-1 py-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
                        onClick={() =>
                          trackEvent("city_discovery_click", {
                            source: "cities",
                            city: city.slug,
                            action: "view",
                          })
                        }
                      >
                        <span className="truncate">{city.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Link>
                      <span className="mt-2 block text-xs text-muted-foreground">
                         City-level home visits, locality references, and booking options
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-16 md:py-24 border-t border-border/50 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-10">
            <Map className="w-5 h-5 text-primary flex-shrink-0" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground">
              Browse by State
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {states.map((state, idx) => (
              <motion.div
                suppressHydrationWarning
                key={state.slug}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
              >
                <Link
                  href={`/physiotherapist-at-home-in/${state.slug}`}
                  className="group flex flex-col gap-1 rounded-xl border border-border bg-background px-4 py-3.5 hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all duration-150"
                >
                  <span className="text-sm font-medium text-foreground group-hover:text-primary truncate">
                    {state.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {state.citySlugs.length} {state.citySlugs.length === 1 ? "city" : "cities"}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-border/50 bg-secondary/30">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4">
             Need help choosing a locality?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
             Open a city page for locality references and booking options, or choose an online
             consultation available worldwide now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 bg-booking text-booking-foreground font-medium hover:bg-booking-hover transition-colors shadow-sm"
            >
              Send a home-visit request
            </Link>
            <Link
              href="/booking"
              data-booking-mode="telehealth"
              className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3 bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Start online consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
