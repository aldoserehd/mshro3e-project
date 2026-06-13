# Deployment Guide (free-tier path)

## 1. Web (admin + vendor portal + /join) → Vercel — FREE
1. vercel.com → sign in with GitHub → Import `mshro3e-project` → **Root Directory: `admin`** (framework auto-detects Next.js).
2. Environment variables (copy values from `admin/.env.local`):
   - `NEXT_PUBLIC_FIREBASE_API_KEY`, `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`, `NEXT_PUBLIC_FIREBASE_PROJECT_ID`, `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`, `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`, `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `FIREBASE_ADMIN_SERVICE_ACCOUNT` (the single-line JSON)
   - `ANTHROPIC_API_KEY` (when AI goes live) · optional `AI_MODEL`
3. Deploy → you get `https://<name>.vercel.app`. Update `VENDOR_SITE_URL` flows: set `siteUrl`/`vendorJoinUrl` in `src/brand.ts` + `admin/src/lib/brand.ts` to the Vercel URL until the real domain is bought.
4. Firebase Console → Authentication → Settings → **Authorized domains** → add the vercel.app domain (vendor login needs it).

## 2. Firestore rules
`npx firebase-tools deploy --only firestore:rules --project mshro3e-app`
(auth via `npx firebase-tools login`, or set `GOOGLE_APPLICATION_CREDENTIALS` to a service-account JSON file). No composite indexes required yet — all queries are single-field.

## 3. Mobile app
- Dev/demo: Expo Go (free).
- Store builds: `npx eas-cli build` — needs Apple Developer ($99/yr) + Google Play ($25 once). Do this LAST, after rebrand (name/logo/app icon in `app.json`).

## 4. Payments (when an investor lands)
Phase 1 (today, no code): MyFatoorah account on the Kuwaiti company → create KNET payment links → vendor pays → owner activates tier in admin /subscriptions.
Phase 2 (integration sketch — automate the manual confirm step):
1. **Server action `startChekout(vendorId, tier, months)`** (server-only, never expose the MyFatoorah token to the client):
   - `POST https://api.myfatoorah.com/v2/SendPayment` with `Authorization: Bearer $MYFATOORAH_TOKEN`, amount from `TIER_PRICES[tier][months]`, `CallBackUrl` → `https://<domain>/api/payments/callback`, `ErrorUrl` → a failure page.
   - Persist a pending record (`vendorId`, `tier`, `months`, `myfatoorahInvoiceId`) keyed by `InvoiceId` so the callback can resolve it server-side (never trust amount/tier from the redirect query).
   - Return `IsDirectPayment ? PaymentURL : InvoiceURL` and redirect the vendor to it.
2. **Callback route `GET/POST /api/payments/callback`**:
   - Read `paymentId`/`Id` from the request, call `POST /v2/GetPaymentStatus` (`Key`, `KeyType: "PaymentId"`) to VERIFY server-side — do not trust the redirect.
   - On `InvoiceStatus === "Paid"`, look up the pending record by `InvoiceId`, then call the same write logic as `setVendorTier(vendorId, tier, months)` (Admin SDK) to set `tier` + `subscriptionUntil`. Mark the pending record consumed (idempotent — the callback can fire twice).
   - Store `myfatoorahInvoiceId` on the vendor doc for reconciliation.
3. **Env:** add `MYFATOORAH_TOKEN` (+ optional `MYFATOORAH_BASE_URL` to switch between `apitest.myfatoorah.com` for the demo portal and `api.myfatoorah.com` for production). Document both in `admin/.env.example` when this ships.

## 5. Going-live checklist
Run top to bottom before pointing real vendors at the app:
- [ ] **Deploy Firestore rules** — `npx firebase-tools deploy --only firestore:rules --project mshro3e-app`. Confirm in Console → Firestore → Rules that `aiUsage` is `read, write: if false` (server-only) and `categorySuggestions` is create-only.
- [ ] **Set Vercel env vars** (Project → Settings → Environment Variables) for every key in `admin/.env.example`: the six `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_ADMIN_SERVICE_ACCOUNT` (single-line JSON), `OWNER_UIDS`, `ANTHROPIC_API_KEY`, and optionally `AI_MODEL`. Mark the non-`NEXT_PUBLIC_` ones for the Production environment only.
- [ ] **Add the authorized domain** — Firebase Console → Authentication → Settings → Authorized domains → add the `*.vercel.app` (and later the real) domain, or vendor email+password login silently fails.
- [ ] **Set `BRAND.supportWhatsapp`** in both `admin/src/lib/brand.ts` and `src/brand.ts` to the real wa.me number (currently the `96550000000` placeholder) — this is the WhatsApp lead/attribution target.
- [ ] **Add `ANTHROPIC_API_KEY`** — without it the AI routes return 503 (`ai_not_configured`). Budget ~0.1–0.5 KWD/vendor/mo; the routes cap usage per tier (free 5 / basic 30 / pro 200 / managed 500 generations/month) and rate-limit per uid.
- [ ] **Smoke test** — sign in as a vendor, hit the AI storefront + describe features, confirm a counter doc appears under `aiUsage/<uid|vendorId>` and `used`/`limit` come back in the response.

## 6. Cost timeline
Everything above runs free except: Anthropic key (~$5 lasts months), domain (~$15/yr, buy after rebrand), MyFatoorah (per-transaction fees only), app stores ($124 total, last step).
