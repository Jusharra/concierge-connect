import { SITE_NAME } from "@/lib/constants";

const ComplianceDisclaimer = () => {
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
