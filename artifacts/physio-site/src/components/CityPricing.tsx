import { CareOptions } from "@/components/CareOptions";
import { ProgressiveCareJourney } from "@/components/ProgressiveCareJourney";

interface CityPricingProps {
  cityName: string;
  citySlug: string;
  isExpansion?: boolean;
}

export function CityPricing({ cityName, citySlug, isExpansion = false }: CityPricingProps) {
  return (
    <div id="city-pricing">
      <CareOptions
        locationLabel={`in ${cityName}`}
        homeCoverage={
          isExpansion
            ? `Online consultation is available now in ${cityName}. Home visits depend on future team placement and local confirmation.`
            : `Home visits are active at city level in ${cityName}; exact locality and clinician availability are confirmed before booking.`
        }
        bookingHref="/booking"
        bookingCitySlug={citySlug}
        confirmationWindowHours={isExpansion ? 24 : 12}
        homeActionLabel={isExpansion ? "Enquire about a home visit" : "Check home-visit availability"}
        homeConfirmationLabel={
          isExpansion
            ? "A visit is confirmed only after a team is placed and local availability is checked"
            : "Exact locality and clinician availability confirmed before booking"
        }
        hideWhatsApp={isExpansion}
        emphasizeOnline={isExpansion}
        progressiveJourney={
          <ProgressiveCareJourney
            mode="home"
            locationStatus={isExpansion ? "expansion" : "verified"}
            locationName={cityName}
          />
        }
      />
    </div>
  );
}