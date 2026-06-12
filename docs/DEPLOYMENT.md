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
Phase 2 (integration sketch):
- `POST https://api.myfatoorah.com/v2/SendPayment` from a server action when the vendor taps a plan (amount from `TIER_PRICES`), `CallBackUrl` → `/api/payments/callback`.
- Webhook verifies `InvoiceId` via `GetPaymentStatus`, then calls the same logic as `setVendorTier()` to write `tier` + `subscriptionUntil`.
- Store `myfatoorahInvoiceId` on the vendor doc for reconciliation. Test with their demo portal (`apitest.myfatoorah.com`).

## 5. Cost timeline
Everything above runs free except: Anthropic key (~$5 lasts months), domain (~$15/yr, buy after rebrand), MyFatoorah (per-transaction fees only), app stores ($124 total, last step).
