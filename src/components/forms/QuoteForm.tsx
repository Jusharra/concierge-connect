import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Send } from "lucide-react";
import { DATA, findOffer, liveLocations } from "@/lib/catalog";
import { getAttribution } from "@/lib/attribution";
import { track } from "@/lib/analytics";
import { PHONE_HREF, PHONE_NUMBER } from "@/lib/constants";

const inputClasses =
  "w-full bg-input border border-border rounded px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors";
const labelClasses = "block text-sm font-medium text-foreground mb-2";
const errorClasses = "text-destructive text-xs mt-1";

interface Values {
  category: string;
  city: string;
  startDate: string;
  endDate: string;
  partySize: string;
  route: string;
  notes: string;
  name: string;
  email: string;
  phone: string;
  smsOptIn: boolean;
  emailOptIn: boolean;
  website: string; // honeypot
}

const empty: Values = {
  category: "", city: "", startDate: "", endDate: "", partySize: "", route: "", notes: "",
  name: "", email: "", phone: "", smsOptIn: false, emailOptIn: false, website: "",
};

/** Field wording that fits the asset being requested. */
const wording = (slug: string | undefined) => {
  if (slug === "private-jet-charter") return { route: "Route or airports", routeHint: "e.g. Van Nuys to Las Vegas", party: "Passengers" };
  if (slug === "yacht-charter") return { route: "Departure marina or area", routeHint: "e.g. Marina del Rey", party: "Guests" };
  if (slug === "exotic-car-rental") return { route: "Pickup location", routeHint: "e.g. Beverly Hills", party: "Drivers or passengers" };
  return { route: "Departure point or route", routeHint: "Where would you start?", party: "Party size" };
};

const QuoteForm = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [v, setV] = useState<Values>(empty);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const bookable = useMemo(() => DATA.assetTypes.filter((a) => a.bookable && a.active), []);
  const cities = useMemo(() => liveLocations().map((l) => l.location.city), []);
  const offerSlug = params.get("offer") || "";
  const packageSlug = params.get("package") || "";
  const categoryParam = params.get("category") || "";

  // Prefill from ?category=&offer=&package= after mount, so the pre-rendered HTML stays generic.
  useEffect(() => {
    const offer = categoryParam && offerSlug ? findOffer(categoryParam, offerSlug) : undefined;
    setV((prev) => ({
      ...prev,
      category: categoryParam || prev.category,
      city: offer?.location.city || prev.city,
    }));
  }, [categoryParam, offerSlug]);

  const asset = bookable.find((a) => a.categorySlug === v.category);
  const words = wording(asset?.slug);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validateStep1 = () => {
    const e: Partial<Record<keyof Values, string>> = {};
    if (!v.category) e.category = "Please choose a service";
    if (!v.city.trim()) e.city = "Please tell us the city";
    if (v.partySize && (!/^\d+$/.test(v.partySize) || Number(v.partySize) < 1 || Number(v.partySize) > 500)) e.partySize = "Enter a number from 1 to 500";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<Record<keyof Values, string>> = {};
    if (v.name.trim().length < 2) e.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = "Please enter a valid email";
    if (v.phone.replace(/\D/g, "").length < 7) e.phone = "Please enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (step === 1) {
      if (validateStep1()) setStep(2);
      return;
    }
    if (!validateStep2()) return;
    setSubmitting(true);
    setServerError("");

    const attribution = getAttribution();
    const dates = v.startDate ? (v.endDate ? `${v.startDate} to ${v.endDate}` : v.startDate) : "";
    const payload = {
      name: v.name,
      email: v.email,
      phone: v.phone,
      category: v.category,
      offer: offerSlug,
      package: packageSlug,
      city: v.city,
      dates,
      partySize: v.partySize ? Number(v.partySize) : "",
      route: v.route,
      notes: v.notes,
      smsOptIn: v.smsOptIn,
      emailOptIn: v.emailOptIn,
      website: v.website,
      ...attribution,
      // The page the visitor came from is the useful source, not /quote/ itself.
      ...(categoryParam && offerSlug ? { sourcePageUrl: `${window.location.origin}/${categoryParam}/${offerSlug}/` } : {}),
    };

    try {
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Request failed (${res.status})`);
      }
      track("quote_submit", { city: v.city, asset: asset?.name, category: v.category, offer: offerSlug, package: packageSlug, form: "quote_page" });
      navigate("/thank-you/?mode=quote");
    } catch (err) {
      setServerError((err as Error).message || "We could not submit your request.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="luxury-card p-8 md:p-10 space-y-6" noValidate>
      <div>
        <p className="text-xs uppercase tracking-widest text-gold mb-1">Step {step} of 2</p>
        <h2 className="heading-card text-foreground">{step === 1 ? "Trip details" : "Your contact details"}</h2>
        <div className="mt-3 h-1 w-full rounded bg-border/60" aria-hidden="true">
          <div className="h-1 rounded bg-gold transition-all" style={{ width: step === 1 ? "50%" : "100%" }} />
        </div>
      </div>

      {/* Bot trap: hidden from people and assistive tech; real visitors never fill it */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="q-website">Website</label>
        <input id="q-website" type="text" tabIndex={-1} autoComplete="off" value={v.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="q-category" className={labelClasses}>Service *</label>
              <select id="q-category" className={inputClasses} value={v.category} onChange={(e) => set("category", e.target.value)}>
                <option value="">Select a service</option>
                {bookable.map((a) => (
                  <option key={a.id} value={a.categorySlug}>{a.name}</option>
                ))}
              </select>
              {errors.category && <p className={errorClasses}>{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="q-city" className={labelClasses}>City *</label>
              <input id="q-city" list="q-cities" className={inputClasses} value={v.city} onChange={(e) => set("city", e.target.value)} placeholder="Los Angeles" autoComplete="off" />
              <datalist id="q-cities">
                {cities.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              {errors.city && <p className={errorClasses}>{errors.city}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="q-start" className={labelClasses}>Start date</label>
              <input id="q-start" type="date" className={inputClasses} value={v.startDate} onChange={(e) => set("startDate", e.target.value)} />
            </div>
            <div>
              <label htmlFor="q-end" className={labelClasses}>End date</label>
              <input id="q-end" type="date" className={inputClasses} value={v.endDate} min={v.startDate || undefined} onChange={(e) => set("endDate", e.target.value)} />
            </div>
            <div>
              <label htmlFor="q-party" className={labelClasses}>{words.party}</label>
              <input id="q-party" inputMode="numeric" className={inputClasses} value={v.partySize} onChange={(e) => set("partySize", e.target.value)} placeholder="4" />
              {errors.partySize && <p className={errorClasses}>{errors.partySize}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="q-route" className={labelClasses}>{words.route}</label>
            <input id="q-route" className={inputClasses} value={v.route} onChange={(e) => set("route", e.target.value)} placeholder={words.routeHint} />
          </div>

          <div>
            <label htmlFor="q-notes" className={labelClasses}>Anything else we should know?</label>
            <textarea id="q-notes" rows={4} maxLength={2000} className={inputClasses} value={v.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Occasion, preferences, flexibility on dates..." />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="q-name" className={labelClasses}>Full name *</label>
              <input id="q-name" autoComplete="name" className={inputClasses} value={v.name} onChange={(e) => set("name", e.target.value)} />
              {errors.name && <p className={errorClasses}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="q-email" className={labelClasses}>Email *</label>
              <input id="q-email" type="email" autoComplete="email" className={inputClasses} value={v.email} onChange={(e) => set("email", e.target.value)} />
              {errors.email && <p className={errorClasses}>{errors.email}</p>}
            </div>
          </div>
          <div>
            <label htmlFor="q-phone" className={labelClasses}>Phone *</label>
            <input id="q-phone" type="tel" autoComplete="tel" className={inputClasses} value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 (555) 000-0000" />
            {errors.phone && <p className={errorClasses}>{errors.phone}</p>}
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" checked={v.emailOptIn} onChange={(e) => set("emailOptIn", e.target.checked)} />
              <span>Email me my quote and occasional offers. You can unsubscribe at any time.</span>
            </label>
            <label className="flex items-start gap-3">
              <input type="checkbox" className="mt-1" checked={v.smsOptIn} onChange={(e) => set("smsOptIn", e.target.checked)} />
              <span>Text me updates about my request. Message and data rates may apply; reply STOP to opt out.</span>
            </label>
          </div>
        </div>
      )}

      {serverError && (
        <p role="alert" className="text-destructive text-sm">
          {serverError} You can also call{" "}
          <a href={PHONE_HREF} className="underline">
            {PHONE_NUMBER}
          </a>
          .
        </p>
      )}

      <div className="flex items-center justify-between gap-4">
        {step === 2 ? (
          <button type="button" onClick={() => setStep(1)} className="text-sm text-muted-foreground hover:text-foreground">
            Back
          </button>
        ) : (
          <span />
        )}
        <button type="submit" disabled={submitting} className="luxury-btn-primary disabled:opacity-70 disabled:cursor-not-allowed">
          {submitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending...
            </>
          ) : step === 1 ? (
            "Continue"
          ) : (
            <>
              <Send className="w-5 h-5" /> Get my quote
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        Prices are starting-at figures. Your quote is confirmed with the operator for your dates before any payment is requested.
      </p>
    </form>
  );
};

export default QuoteForm;
