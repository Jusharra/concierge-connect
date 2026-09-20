import { Link } from "react-router-dom";
import { SITE_NAME } from "@/lib/constants";

interface ComplianceDisclaimerProps {
  /**
   * "booking" for the bookable categories (jets, yachts, exotic cars) where a deposit can be taken.
   * The default keeps the original wording for properties and business acquisitions, which are unchanged.
   */
  variant?: "default" | "booking";
}

const ComplianceDisclaimer = ({ variant = "default" }: ComplianceDisclaimerProps) => {
  if (variant === "booking") {
    return (
      <div className="mt-12 pt-8 border-t border-border/50">
        <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
          Services are delivered by independent operators; {SITE_NAME} does not own or operate the aircraft, vessels
          or vehicles. A deposit is a booking fee and the remaining balance is paid directly to the operator. Prices
          are starting-at figures and availability is confirmed by the operator before any balance is due. See{" "}
          <Link to="/trust/" className="text-primary hover:text-primary/80 underline">
            Trust &amp; Compliance
          </Link>{" "}
          for the disclosures that apply to your booking.
        </p>
      </div>
    );
  }
  return (
    <div className="mt-12 pt-8 border-t border-border/50">
      <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
        {SITE_NAME} provides concierge coordination and introductions only.
        We do not own, operate, or guarantee third-party services.
        All transactions occur directly with verified partners.
      </p>
    </div>
  );
};

export default ComplianceDisclaimer;
