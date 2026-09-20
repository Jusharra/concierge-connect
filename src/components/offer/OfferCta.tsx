import { Link } from "react-router-dom";
import { Check, Phone } from "lucide-react";
import type { PublishedOffer, PublishedPackage } from "@/lib/catalog";
import { formatMoney, riskReversalShort } from "@/lib/seo-templates";
import { PHONE_HREF, PHONE_NUMBER } from "@/lib/constants";
import type { PackageData } from "../../../shared/data-types";

export const bookHref = (offer: PublishedOffer, pkg?: PublishedPackage) =>
  `/book/?category=${offer.categoryId}&offer=${offer.offerSlug}${pkg ? `&package=${pkg.pkg.packageSlug}` : ""}`;
export const quoteHref = (offer: PublishedOffer, pkg?: PublishedPackage) =>
  `/quote/?category=${offer.categoryId}&offer=${offer.offerSlug}${pkg ? `&package=${pkg.pkg.packageSlug}` : ""}`;

interface OfferCtaProps {
  offer: PublishedOffer;
  pkg?: PublishedPackage;
  /** Result of payAvailability(): the Reserve button only exists when this is true. */
  canPay: boolean;
  /** The package whose price / value stack / refund wording applies (child package or the offer row). */
  data: PackageData;
}

/**
 * The offer block every page ends in: bold promise, "starting at" price, value stack with dollar
 * amounts, and the risk reversal restated inside the button. Two paths: reserve with a deposit, or
 * get a quote.
 */
const OfferCta = ({ offer, pkg, canPay, data }: OfferCtaProps) => {
  const reversal = riskReversalShort(data.riskReversalText);
  const stack = data.includedItems.filter((i) => i.value !== null);
  const stackTotal = data.valueStackTotal ?? (stack.length ? stack.reduce((n, i) => n + (i.value || 0), 0) : null);

  return (
    <div className="bg-card border border-border rounded-lg p-6" id="request-form">
      {data.boldPromise && <p className="text-lg font-display font-semibold text-foreground mb-3">{data.boldPromise}</p>}

      {data.startingPrice ? (
        <p className="mb-4">
          <span className="block text-xs uppercase tracking-widest text-muted-foreground">Starting at</span>
          <span className="text-3xl font-display font-bold text-primary">{formatMoney(data.startingPrice, data.currency)}</span>
          {data.priceUnit && <span className="text-muted-foreground"> {data.priceUnit}</span>}
        </p>
      ) : (
        <p className="mb-4 text-muted-foreground">Pricing is confirmed once the operator has your dates and route.</p>
      )}

      {stack.length > 0 && (
        <ul className="mb-4 space-y-2 text-sm">
          {stack.map((i) => (
            <li key={i.label} className="flex items-start justify-between gap-4">
              <span className="flex items-start gap-2 text-muted-foreground">
                <Check className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" aria-hidden="true" />
                {i.label}
              </span>
              <span className="text-foreground">{formatMoney(i.value as number, data.currency)}</span>
            </li>
          ))}
          {stackTotal ? (
            <li className="flex justify-between border-t border-border/50 pt-2 font-medium text-foreground">
              <span>Total value</span>
              <span>{formatMoney(stackTotal, data.currency)}</span>
            </li>
          ) : null}
        </ul>
      )}

      <div className="space-y-3">
        {canPay && (
          <Link
            to={bookHref(offer, pkg)}
            className="luxury-btn-primary w-full flex-col !items-center text-center"
            data-cta="reserve"
          >
            <span>Reserve with a deposit</span>
            {reversal && <span className="text-xs font-normal opacity-80">{reversal}</span>}
          </Link>
        )}
        <Link
          to={quoteHref(offer, pkg)}
          className={`${canPay ? "luxury-btn-outline" : "luxury-btn-primary"} w-full text-center`}
          data-cta="quote"
        >
          Get a Quote
        </Link>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Prices are starting-at figures. Availability is confirmed by the operator for your dates.
      </p>

      <a
        href={PHONE_HREF}
        className="mt-4 flex items-center justify-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors"
      >
        <Phone className="w-5 h-5" aria-hidden="true" />
        {PHONE_NUMBER}
      </a>
    </div>
  );
};

export default OfferCta;
