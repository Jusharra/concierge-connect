import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import type { PublishedOffer, PublishedPackage } from "@/lib/catalog";
import { payFor } from "@/lib/catalog";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { formatMoney, riskReversalShort } from "@/lib/seo-templates";
import { PHONE_HREF, PHONE_NUMBER } from "@/lib/constants";
import { quoteHref } from "@/components/offer/OfferCta";

const inputClasses =
  "w-full bg-input border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";
const labelClasses = "block text-sm font-medium text-foreground mb-2";
const errorClasses = "text-destructive text-xs mt-1";

interface Values {
  name: string;
  email: string;
  phone: string;
  startDate: string;
  endDate: string;
  partySize: string;
  route: string;
  aircraftPreference: string;
  vehiclePreference: string;
  duration: string;
  occasion: string;
  notes: string;
  smsOptIn: boolean;
  emailOptIn: boolean;
  website: string; // honeypot
}

const empty: Values = {
  name: "", email: "", phone: "", startDate: "", endDate: "", partySize: "", route: "",
  aircraftPreference: "", vehiclePreference: "", duration: "", occasion: "", notes: "",
  smsOptIn: false, emailOptIn: false, website: "",
};

interface BookingFormProps {
  offer: PublishedOffer;
  pkg?: PublishedPackage;
}

/**
 * Deposit checkout form. Shows the deposit, the refund terms and the Live compliance disclosure, and
 * will not start checkout until the acknowledgment box is ticked. The server re-checks everything.
 */
const BookingForm = ({ offer, pkg }: BookingFormProps) => {
  const data = pkg?.pkg ?? offer.pkg;
  const pay = payFor(data);
  const { asset, location } = offer;
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [ack, setAck] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [fallback, setFallback] = useState(false);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setV((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  if (!pay.allowed) {
    return (
      <div className="luxury-card p-8">
        <h2 className="heading-card text-foreground mb-3">Online reservation is not available yet</h2>
        <p className="text-muted-foreground mb-6">
          You can still get confirmed pricing for {asset.name.toLowerCase()} in {location.city}. Request a quote and we will come back to you with options.
        </p>
        <Link to={quoteHref(offer, pkg)} className="luxury-btn-primary">
          Get a Quote
        </Link>
      </div>
    );
  }

  const deposit = data.depositAmount as number;
  const depositLabel = formatMoney(deposit, data.currency);
  const reversal = riskReversalShort(data.riskReversalText);
  const slug = asset.slug;

  const validate = () => {
    const e: Partial<Record<keyof Values, string>> = {};
    if (v.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email";
    if (v.phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number";
    if (!v.startDate) e.startDate = "Please choose your date";
    if (v.partySize && (!/^\d+$/.test(v.partySize) || Number(v.partySize) < 1 || Number(v.partySize) > 500)) e.partySize = "Enter a number from 1 to 500";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setServerError("");
    if (!ack) {
      setServerError("Please read and accept the terms to continue.");
      return;
    }
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v.name,
          email: v.email,
          phone: v.phone,
          offer: offer.offerSlug,
          package: pkg?.pkg.packageSlug || "",
          dates: v.endDate ? `${v.startDate} to ${v.endDate}` : v.startDate,
          partySize: v.partySize ? Number(v.partySize) : "",
          route: v.route,
          aircraftPreference: v.aircraftPreference,
          vehiclePreference: v.vehiclePreference,
          duration: v.duration,
          occasion: v.occasion,
          notes: v.notes,
          smsOptIn: v.smsOptIn,
          emailOptIn: v.emailOptIn,
          website: v.website,
          acknowledged: ack,
          disclosureVersion: pay.compliance.disclosureVersion,
          pagePath: offer.path,
          ...getAttribution(),
          sourcePageUrl: `${window.location.origin}${offer.path}`,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.url) {
        if (body?.code === "pay_unavailable") setFallback(true);
        throw new Error(body?.error || "We could not start your reservation.");
      }
      track("begin_checkout", { city: location.city, asset: asset.name, category: offer.categoryId, offer: offer.offerSlug, value: deposit, currency: data.currency });
      window.location.assign(body.url as string);
    } catch (err) {
      setServerError((err as Error).message);
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="luxury-card p-8 md:p-10 space-y-8" noValidate>
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="b-website">Website</label>
        <input id="b-website" type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div>
        <h2 className="heading-card text-foreground mb-1">{data.name}</h2>
        <p className="text-muted-foreground text-sm">
          {asset.name} in {location.city}
          {data.startingPrice ? ` · starting at ${formatMoney(data.startingPrice, data.currency)}${data.priceUnit ? ` ${data.priceUnit}` : ""}` : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="b-name" className={labelClasses}>Full name *</label>
          <input id="b-name" autoComplete="name" className={inputClasses} value={v.name} onChange={(e) => set("name", e.target.value)} />
          {errors.name && <p className={errorClasses}>{errors.name}</p>}
        </div>
        <div>
          <label htmlFor="b-email" className={labelClasses}>Email *</label>
          <input id="b-email" type="email" autoComplete="email" className={inputClasses} value={v.email} onChange={(e) => set("email", e.target.value)} />
          {errors.email && <p className={errorClasses}>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="b-phone" className={labelClasses}>Phone *</label>
          <input id="b-phone" type="tel" autoComplete="tel" className={inputClasses} value={v.phone} onChange={(e) => set("phone", e.target.value)} />
          {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
        </div>
        <div>
          <label htmlFor="b-party" className={labelClasses}>{slug === "yacht-charter" ? "Guests" : slug === "private-jet-charter" ? "Passengers" : "Party size"}</label>
          <input id="b-party" inputMode="numeric" className={inputClasses} value={v.partySize} onChange={(e) => set("partySize", e.target.value)} />
          {errors.partySize && <p className={errorClasses}>{errors.partySize}</p>}
        </div>
        <div>
          <label htmlFor="b-start" className={labelClasses}>Start date *</label>
          <input id="b-start" type="date" className={inputClasses} value={v.startDate} onChange={(e) => set("startDate", e.target.value)} />
          {errors.startDate && <p className={errorClasses}>{errors.startDate}</p>}
        </div>
        <div>
          <label htmlFor="b-end" className={labelClasses}>End date</label>
          <input id="b-end" type="date" className={inputClasses} value={v.endDate} min={v.startDate || undefined} onChange={(e) => set("endDate", e.target.value)} />
        </div>
      </div>

      {/* Conditional fields per asset type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label htmlFor="b-route" className={labelClasses}>
            {slug === "private-jet-charter" ? "Route or airports" : slug === "yacht-charter" ? "Departure marina" : slug === "exotic-car-rental" ? "Pickup location" : "Departure point"}
          </label>
          <input id="b-route" className={inputClasses} value={v.route} onChange={(e) => set("route", e.target.value)} />
        </div>
        {slug === "private-jet-charter" && (
          <div>
            <label htmlFor="b-aircraft" className={labelClasses}>Aircraft preference</label>
            <input id="b-aircraft" className={inputClasses} value={v.aircraftPreference} onChange={(e) => set("aircraftPreference", e.target.value)} placeholder="Light, midsize, heavy, helicopter..." />
          </div>
        )}
        {slug === "yacht-charter" && (
          <>
            <div>
              <label htmlFor="b-duration" className={labelClasses}>Duration</label>
              <input id="b-duration" className={inputClasses} value={v.duration} onChange={(e) => set("duration", e.target.value)} placeholder="Half day, full day, weekend..." />
            </div>
            <div>
              <label htmlFor="b-occasion" className={labelClasses}>Occasion</label>
              <input id="b-occasion" className={inputClasses} value={v.occasion} onChange={(e) => set("occasion", e.target.value)} />
            </div>
          </>
        )}
        {slug === "exotic-car-rental" && (
          <div>
            <label htmlFor="b-vehicle" className={labelClasses}>Vehicle preference</label>
            <input id="b-vehicle" className={inputClasses} value={v.vehiclePreference} onChange={(e) => set("vehiclePreference", e.target.value)} />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="b-notes" className={labelClasses}>Notes</label>
        <textarea id="b-notes" rows={3} maxLength={2000} className={inputClasses} value={v.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>

      <div className="space-y-3 text-sm text-muted-foreground">
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1" checked={v.emailOptIn} onChange={(e) => set("emailOptIn", e.target.checked)} />
          <span>Email me updates about my booking and occasional offers.</span>
        </label>
        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1" checked={v.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} />
          <span>Text me updates about my booking. Message and data rates may apply; reply STOP to opt out.</span>
        </label>
      </div>

      {/* Acknowledgment: shown and logged before payment */}
      <fieldset className="rounded-lg border border-gold/30 bg-gold/5 p-6 space-y-4">
        <legend className="px-2 text-sm font-semibold uppercase tracking-widest text-gold">Before you pay</legend>
        <ul className="space-y-2 text-sm text-foreground">
          <li>
            <strong>Deposit: {depositLabel}.</strong> The deposit is our booking fee.
          </li>
          <li>The remaining balance is paid directly to the operator when you meet.</li>
          <li>
            <strong>Refund terms:</strong> {data.riskReversalText}
          </li>
        </ul>
        {pay.compliance.liveRules.length > 0 && (
          <div>
            <p className="mb-2 text-sm font-medium text-foreground">Required disclosure</p>
            <div className="max-h-56 overflow-y-auto rounded border border-border/60 bg-background/60 p-4 text-xs leading-relaxed text-muted-foreground whitespace-pre-line" tabIndex={0} aria-label="Required disclosure text">
              {pay.compliance.disclosureText}
            </div>
          </div>
        )}
        <label className="flex items-start gap-3 text-sm text-foreground">
          <input type="checkbox" className="mt-1" checked={ack} onChange={(e) => { setAck(e.target.checked); setServerError(""); }} data-testid="ack" />
          <span>
            I have read and agree to the above: the deposit is a booking fee, the remaining balance is paid directly to the operator, the refund terms apply, and I have read the disclosure.
          </span>
        </label>
      </fieldset>

      {serverError && (
        <p role="alert" className="text-destructive text-sm">
          {serverError}{" "}
          {fallback && (
            <Link to={quoteHref(offer, pkg)} className="underline">
              Request a quote instead.
            </Link>
          )}{" "}
          <a href={PHONE_HREF} className="underline">
            {PHONE_NUMBER}
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={!ack || submitting}
        className="luxury-btn-primary w-full flex-col !items-center text-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" /> Opening secure payment...
          </span>
        ) : (
          <>
            <span className="inline-flex items-center gap-2">
              <Lock className="w-4 h-4" aria-hidden="true" /> Pay {depositLabel} deposit
            </span>
            {reversal && <span className="text-xs font-normal opacity-80">{reversal}</span>}
          </>
        )}
      </button>
    </form>
  );
};

export default BookingForm;
