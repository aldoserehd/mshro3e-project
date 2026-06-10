# Mshro3e (مشروعي) — Project Brief

> A Kuwait-only platform that helps small / home-based businesses get a professional
> online presence and get discovered — without handling payments or delivery.
> Customers browse for free and contact vendors over WhatsApp.

---

## 1. The one-line pitch

**Mshro3e is "Shopify-lite + a local marketplace" for Kuwaiti micro-businesses.**
Vendors pay a small monthly fee for a branded mini-store and discovery; customers
browse for free and reach the vendor on WhatsApp. We never touch money or logistics.

The name **مشروعي / "Mshro3e"** literally means *"my project / my business"* in Arabic.

---

## 2. Why this exists (the opportunity)

- Kuwait has a huge wave of **home-based and micro-businesses** — home bakeries,
  abaya makers, dessert boxes, handmade goods, small kitchens, gift shops — most of
  which sell entirely through **Instagram + WhatsApp** today.
- New Kuwaiti regulation is pushing small businesses toward having a **verified,
  legitimate e-commerce presence**. Most can't afford or operate a full Shopify /
  Salla setup, and don't want the complexity.
- Existing local options (e.g. "Booth / دليل المشاريع الصغيرة") are basically simple
  **directories** — a name and a phone number. Nobody gives these vendors a real
  **storefront + discovery + lightweight analytics** at a price they'll actually pay.
- WhatsApp is *already* how Kuwaitis buy from these vendors. So instead of fighting
  that behavior with in-app checkout, we **lean into it**: every "order" is a
  pre-filled, tagged WhatsApp message to the vendor.

**Positioning:** a *discovery + mini-store* app, **NOT** a delivery or payment
marketplace. No commission at launch. WhatsApp-powered leads.

---

## 3. What we deliberately do NOT build

These are hard scope boundaries (regulatory + focus reasons):

- ❌ **No in-app payments** — avoids Central Bank of Kuwait payment-licensing burden.
- ❌ **No delivery / logistics** — vendors handle their own fulfillment.
- ❌ **No appointment/booking engine** — everything is a product with a price, not a
  time-slot. (The project started as a booking app and was pivoted away from that.)
- ❌ **No long onboarding** — a vendor should be live in under ~5 minutes.

We make money from **subscriptions and promotion**, not from transactions.

---

## 4. Who it's for

**Vendors (paying customers):**
- Home bakers, dessert-box makers, home kitchens
- Abaya / fashion / handmade / accessories sellers
- Gift shops, florists, small specialty retailers
- Anyone currently running their "business" out of an Instagram account.

**Customers (free users):**
- Kuwaitis looking for local vendors for an occasion — a gathering tonight, a
  birthday, Ramadan/Eid, National Day, a wedding, a baby shower, a diwaniya.
- They browse with **no signup required** (like Facebook Marketplace).

---

## 5. How it works (core loop)

1. **Vendor signs up**, picks a plan, and builds a mini-store: logo, cover, bio,
   product listings (photo + price + description), area, Instagram, WhatsApp number.
2. **Customer browses** the marketplace for free — by category, by area
   (Salmiya, Hawally, Jabriya, Kuwait City, Farwaniya, …), by occasion, or via search.
3. Customer opens a product → taps **"Order via WhatsApp."**
4. We open WhatsApp with a **pre-filled, tagged message** (product, quantity, area,
   date, notes) that includes a marker like *"وصلتك من تطبيق مشروعي"* + a reference
   code (e.g. `MSH-7F3A`) so the vendor knows the lead came from us.
5. We log a **lead event** in the database for that vendor + product.
6. The vendor's dashboard shows **"N customers contacted you via Mshro3e this month"** —
   this is the concrete proof-of-value that justifies the subscription and drives
   upsells to higher tiers.

The **lead/attribution model** is the heart of the business: it's how we prove ROI to
vendors even though we never process the actual sale.

---

## 6. The three surfaces (all already built as a working prototype)

1. **Customer mobile app** (iOS/Android) — browse, search, filter by area, favorites,
   product detail, WhatsApp contact, "Requests" (your contact history), profile/settings.
   Arabic-first with an Arabic/English toggle, light + dark mode.
2. **Vendor portal** (web) — vendor self-serve: create/edit storefront, manage products,
   view leads/analytics. Vendors log in with the same identity as the app.
3. **Owner admin** (web) — platform operator console: approve/verify/suspend vendors,
   manage categories, see all vendors/products/subscriptions, moderation, overview KPIs.

There's also a public **marketing / sign-up website** (`/join`) with the value prop,
how-it-works, pricing, and FAQ — where a vendor lands when they tap "Become a vendor."

---

## 7. Vendor features (built or planned)

- Branded mini-store / storefront (`yourapp.com/@vendor` style)
- Product catalog with photos, prices, descriptions
- **Availability states**: available today / sold out / pre-order / this weekend
- **Verification badges**: phone, Instagram, license, "trusted" — only shown when truly verified
- **Basic analytics**: profile views, product clicks, WhatsApp clicks, top products, search terms
- Coupons / seasonal offers, QR code generator
- Paid **featured / boost** placement, seasonal campaign packages (Ramadan/Eid/National Day)
- (Later) vendor stories, reviews & ratings, "Top Vendors" leaderboard, bio-link page,
  wishlist + "back in stock" WhatsApp nudge, bulk photo upload

## 8. Customer features

- Browse by **category**, **area**, **occasion**, or curated collections
  ("best dessert boxes this weekend", "gifts under 10 KD", "new vendors this week")
- Delivery labels per vendor (vendor delivery / pickup only / customer arranges / via WhatsApp)
- Favorites / saves, "Requests" tab = WhatsApp contact history
- **Trust signals**: response time, verified phone, Instagram link, saves, "active since"
- No signup needed to browse.

---

## 9. Business model & pricing

Revenue = **vendor subscriptions + promotion add-ons**. No transaction commission.

**Subscription tiers (working model — exact KWD prices still being finalized):**

| Tier | Price (KWD/mo) | Highlights |
|------|----------------|-----------|
| **Starter / Free** | 0 (30–60 day trial) | A few products, watermark, get listed |
| **Basic** | ~5–7 | Branded storefront, ~30 products, WhatsApp + IG, basic analytics |
| **Pro** *(most popular)* | ~12–15 | Unlimited products, custom mini-site, priority listing, full analytics, verified badge, 1 featured slot/mo |
| **Business** | ~25–35 | Everything in Pro + top search, homepage banner, multi-branch, custom domain, priority support |

- Billing offered as **1-month and 3-month** options (deliberately not month-to-month-only).
  Annual ~15–20% discount under consideration.
- **Launch offer idea:** first ~50–100 vendors get a heavily discounted intro (e.g. ~10 KWD
  total for 3 months) to seed the marketplace.

**Additional revenue streams:**
- Paid boost / featured placement (~10–30 KWD)
- Custom subdomain add-on (~3–5 KWD/mo)
- Seasonal campaign packages (Ramadan / Eid / National Day)
- One-time verified-badge fee (~5–10 KWD)
- **Done-for-you services** (optional): product upload (~10–15 KWD), banner/graphic design
  (~15–30 KWD), monthly content management (~25–50 KWD/mo) — this is also the basis of a
  fully **"Managed"** offering where we run the technical side for the vendor.

> Note: pricing has gone through a few revisions and the **final numbers are not locked** —
> this is one of the things I want strategic input on (see open questions).

---

## 10. Go-to-market thinking (rough)

- **Beachhead categories:** Food / home kitchens, abayas, sweets/dessert boxes, handmade.
  These have the most active Instagram-based micro-vendors in Kuwait.
- **Phase 1 — seed supply:** free onboarding for the first ~50 vendors, concierge setup,
  focus on a couple of categories so the marketplace looks full, not empty.
- **Phase 2 — monetize:** introduce Basic + Pro, analytics, verified badges, priority
  listing; ~2-month grace period then convert trial vendors to paid.
- **Phase 3 — scale:** homepage banners, seasonal packages, vendor stories, wishlist,
  leaderboard, Business tier, possibly expand category coverage.
- **Growth levers:** vendors already have Instagram/WhatsApp audiences — give them a
  bio-link page and QR so *they* drive their existing customers onto the platform,
  which then exposes those customers to *other* vendors (marketplace flywheel).

---

## 11. Current status (what actually exists today)

This is **not just an idea** — there's a working, end-to-end prototype:

- ✅ Customer mobile app (React Native / Expo) — full browse → product → WhatsApp flow,
  Arabic/English, light/dark mode, favorites, lead logging.
- ✅ Vendor portal (web) — self-serve storefront + product CRUD + leads.
- ✅ Owner admin (web) — vendor approval/verification/moderation, categories, overview.
- ✅ Public marketing/sign-up site with pricing.
- ✅ Backend on Firebase (auth + database), Kuwait-localized (KWD, +965, ar-KW, areas).
- ✅ The WhatsApp lead-attribution system (tagged messages + reference codes + lead events).

**Tech stack (for context, not the focus of the strategy convo):**
React Native (Expo) mobile app · Next.js web for admin + vendor portal + marketing site ·
Firebase (Authentication + Firestore database) · hosted for the Kuwait region.

**Known gaps / not-yet-done:**
- Real subscription billing prices not finalized / not wired to a payment processor.
- Some admin pages still show sample data rather than live data.
- Analytics are basic; reviews, stories, leaderboard, seasonal mode are planned not built.
- Mobile "Requests" tab and a couple of polish items pending.

---

## 12. What I want help with (open strategic questions)

1. **Pricing & packaging:** Are the tiers and price points right for the Kuwaiti
   micro-business market? Should "done-for-you / Managed" be a tier or an add-on?
   1-month vs 3-month vs annual — what converts best and reduces churn?
2. **Cold-start / marketplace chicken-and-egg:** best way to seed both vendors and
   customers so neither side sees an empty app. Which category to dominate first?
3. **The core value proposition / moat:** since we don't take a cut and don't do
   delivery, is "storefront + discovery + WhatsApp lead attribution + analytics" a
   strong enough reason for a vendor to pay monthly? How do we make the
   "N leads this month" number undeniable?
4. **Monetization beyond subscriptions:** how much to lean on boosts/featured/seasonal
   vs keeping the core subscription simple.
5. **Positioning vs. Instagram itself:** our biggest "competitor" is the vendor's own
   Instagram. What's the sharpest argument for *also* being on Mshro3e?
6. **Regulatory framing:** how to position around the "verified e-commerce presence"
   regulation without overpromising or claiming to be a compliance product.
7. **Roadmap prioritization:** given a small team, what's the minimum set of features
   that gets us to paying vendors fastest?
8. **Metrics:** what are the right north-star and early traction metrics for this model
   (active vendors, leads per vendor, paid conversion, vendor retention…)?

---

*Market scope: Kuwait only (currency KWD, +965 phone numbers, Arabic-first, Kuwaiti
dialect). Brand name: مشروعي / Mshro3e.*
