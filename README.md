# Concierge Connect

A booking asset for high-ticket luxury services (private jets, yachts, exotic cars). Every city × service
page is generated from Airtable, pre-rendered to real HTML, and ends in two paths: **reserve with a
deposit** or **get a quote**. Independent operators deliver the service.

```
Airtable (system of record) ──build──▶ data/*.json ──▶ vite-react-ssg ──▶ static HTML (Netlify)
        ▲                                                                   │
        └──── Netlify Functions (server-side PAT): quote-request, create-checkout, stripe-webhook
                     │                         │
                     └─▶ Make.com alerts       └─▶ Stripe Checkout (deposit)
```

Stack: Vite + React 18 + react-router v6, pre-rendered with `vite-react-ssg`, Netlify Functions, Airtable, Stripe.

## Commands

| | |
|---|---|
| `npm run dev` | Vite dev server (client-rendered, fast) |
| `npm run build` | Sync Airtable → `data/*.json`, export citations, pre-render, write sitemap/robots/404/redirects |
| `npm run build:offline` | Same without the Airtable sync (uses the committed `data/*.json`) |
| `node scripts/serve-dist.mjs` | Serve `dist/` like Netlify (real 404s, 301s). `MOCK_API=1` logs form posts |
| `npm run readiness` | Which bookable pages are published, and exactly why each blocked one is not |
| `npm test` / `npm run typecheck` | Unit tests / type-check the app and the server code |
| `npm run report:monthly` | Write last month's quote/deposit numbers per city × asset to Airtable |

If `AIRTABLE_PAT` is missing or Airtable is unreachable, the build uses the committed `data/*.json` and says so.

## Data (Airtable base `appzlBMrvpJRpKKQq`)

Pages read **only** `data/*.json`, which `scripts/sync-airtable.ts` derives from Airtable by **field ID** (renaming a
column does not break anything). Public-safety is built in: partners are names only (no contact details), internal
Notes are never pulled, and Compliance Rule text/registration numbers reach the bundle only when Status = Live.

Text-field formats:

| Field | Format |
|---|---|
| Locations › Hub Points | one airport / marina / neighborhood per line |
| Locations › Local FAQs, Asset Types › FAQs | blocks separated by a blank line: first line the question, then the answer (`Q:`/`A:` prefixes optional) |
| Packages › Page Copy | paragraphs separated by a blank line. First paragraph should contain the keyword and city |
| Packages › Included Items | one per line; add a dollar value as `Item \| 1200` to build the value stack |
| Packages › How It Works, Nearby Areas | one per line |
| Packages › Package Slug | **empty** = the city × asset page itself (`/{category}/{Offer Slug}/`). Filled = a nested package page (`.../{Package Slug}/`) |

### Publishing gate (a bookable page is built only when all hold)

`Ready to Publish = Ready` (Package Active + a Partner linked + Location Live) **and** the Asset Type is Active **and**
the Location has Hub Points **and** at least 3 Local FAQs **and** Country (and State for the US). A nested package also
needs its parent offer to be publishable. Everything else is **not built**: its URL returns a real HTTP 404 and it is not
in the sitemap. `npm run readiness` prints the reason for every blocked page. Properties and business acquisitions are not
bookable and keep rendering from `src/lib/constants.ts`, untouched.

### Pay gate (the "Reserve with a deposit" button exists only when all hold)

Booking Mode = Pay, a Deposit Amount, a Currency Code, Risk Reversal Text (the refund terms), and **every applicable
Compliance Rule is Live with text**, and at least one applies. Otherwise the page offers Quote only, and `create-checkout`
refuses server-side. A rule applies when it is linked to the asset type and either lists the location or its Jurisdiction
covers it (US → `US Federal` + the state's rule, or `US - Other`; UAE, UK, France / Monaco, Spain, Bahamas). A rule with
Jurisdiction `Other` applies only to locations it lists.

### Add a city or an asset type = a data entry

1. Locations: City, Slug, State / Region, Country, Latitude, Longitude, GBP URL, Map Embed URL, Hub Points, 3+ Local FAQs.
2. Partners: link the partner's Asset Types and Locations Served.
3. Packages: Package Name, Offer Slug (`yacht-charter-{city}`), Asset Type, Location, Partner, copy, price, deposit, refund text.
4. GBP Listings: one row per city × service with Landing Page URL = the page URL. NAP on the page is read from this row.
5. Tick Location › Live and Package › Active, then trigger a rebuild (below). No code change.

## Environment variables (Netlify › Site configuration › Environment variables)

| Variable | Required | Purpose |
|---|---|---|
| `AIRTABLE_PAT` | yes | Personal access token, scopes `data.records:read` + `data.records:write` on the Concierge Connect base. Server-side only |
| `AIRTABLE_BASE_ID` | yes | `appzlBMrvpJRpKKQq` |
| `MAKE_WEBHOOK_URL` | yes | Existing Make.com scenario: alerts, follow-ups, partner confirmation |
| `STRIPE_SECRET_KEY` | for payments | `sk_test_...` first |
| `STRIPE_WEBHOOK_SECRET` | for payments | `whsec_...` from the webhook endpoint below |
| `INDEXNOW_KEY` | optional | Notifies Bing/Yandex after a deploy; the build writes `/{key}.txt` |
| `SITE_URL_OVERRIDE` | optional | Origin for Stripe return URLs on previews; defaults to `src/config/site.ts` |

Nothing secret is prefixed `VITE_`, so none of it can reach the browser bundle. `.env` is git-ignored; copy `.env.example`.

## Deploy on Netlify

1. Netlify › **Add new site › Import an existing project** › GitHub › `Jusharra/concierge-connect`. Build settings come from `netlify.toml`
   (`npm run build`, publish `dist`, functions `netlify/functions`).
2. Add the environment variables above. Deploy.
3. **Domain**: Domain management › Add a custom domain (default `luxconnoisseurs.com`; if you choose another, change
   `src/config/site.ts` first). Add the apex and `www`, choose the primary, and let Netlify issue HTTPS.
4. **DNS**: at your registrar either set the nameservers Netlify shows (Netlify DNS), or add an `A` record `@ → 75.2.60.5` and a
   `CNAME` `www → <your-site>.netlify.app`. The old Lovable hosting stops receiving traffic once DNS changes.
5. **Rebuild on data change**: Site configuration › Build & deploy › Build hooks › create one, then call it from an Airtable
   automation (or Make) when a Live checkbox, price or deposit changes. Price changes then need no code deploy.
6. **Stripe**: Developers › Webhooks › Add endpoint `https://<domain>/api/stripe-webhook`, events `checkout.session.completed`,
   `checkout.session.async_payment_succeeded`, `charge.refunded`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.
7. **Search Console**: add the property, paste the HTML-tag token into `searchConsoleVerification` in `src/config/site.ts`, then submit
   `https://<domain>/sitemap.xml`. (Google retired its sitemap "ping" endpoint in 2023, so submission is a one-time step. IndexNow covers Bing.)
8. **Analytics**: put the GA4 ID in `ga4MeasurementId` in `src/config/site.ts`. Events: `phone_click`, `quote_submit`, `begin_checkout`,
   each with `city` and `asset`. Analytics storage stays denied until the visitor accepts the cookie banner (Consent Mode v2).

## Payments

Stripe Checkout (hosted). The customer pays a **deposit**, which is our booking fee; the **balance is paid to the operator directly**.
The server takes price, currency, refund terms and disclosure from `data/*.json`, never from the browser. The checkout cannot start
without the acknowledgment (deposit is a booking fee; balance paid directly; refund terms; the Live compliance disclosure for the
package), and the booking row logs Disclosure Shown / Shown At / Version **before** the redirect. `checkout.session.completed` marks the
booking Deposit Paid / Paid and alerts Make; `charge.refunded` marks it Refunded. Replays are idempotent.

Payment code sits behind `PaymentProvider` (`createDepositSession`, `handlePaymentEvent`) in `netlify/functions/lib/payments/`. To use another
processor, implement that interface and return it from `getPaymentProvider()`.

> **Heads-up on underwriting:** Stripe (like most processors) can apply extra review to high-ticket travel, charter and brokerage
> businesses, may ask for a reserve or delay payouts, and expects an explicit, easy-to-find refund policy. Apply early, describe the
> deposit-plus-direct-balance model accurately, and keep the Risk Reversal Text on each package specific and honest. You have not chosen a
> processor yet; nothing here locks you into Stripe.

Quote-mode leads are paid later through a link you send; the on-site acknowledgment flow only covers reservations made on `/book/`.

## Measurement

`data/citations.json` (rebuilt every build) lists each live page's canonical NAP, landing URL, GBP URL and anchor text for consistent
citations. Build output warns when a GBP row is missing or its Landing Page URL differs from the page. Link building and posting stay manual.
Every quote and deposit stores Source Page URL and UTM values; `npm run report:monthly` rolls them up per city × asset into **City Performance**
(GBP calls/clicks and ranks are entered by hand and never overwritten).

## Copy rules

Prices always read "starting at". No "free" for anything with a cost. Never the word "dispatch", and no public description of the brokering structure,
fee or partner terms. Availability is never promised before the operator confirms.

## Realistic expectations

Ranking, local-pack visibility and Google's AI results depend on content quality and relevance, Google Business Profile completeness, reviews,
citations and links. The site can be technically ideal and still take weeks or months, and no ranking is guaranteed. Expect early bookings from
direct outreach, GBP activity and any ads you run, not organic search.

## Repo map

`src/config/site.ts` brand / domain / NAP / GA4 / Search Console · `data/` Airtable-derived JSON · `shared/` schema, types and gate rules ·
`scripts/` sync, seed, citations, monthly report, postbuild · `netlify/functions/` server logic · `src/lib/catalog.ts` published offers ·
`src/lib/seo-templates.ts` titles, descriptions, JSON-LD · `supabase/` legacy `submit-lead` function (retire after the quote flow is verified live).
