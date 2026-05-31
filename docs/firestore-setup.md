# Firestore setup

Mshro3e mobile reads/writes from a Firebase project in the `me-central1` region.
Config lives in `shared/firebase.config.ts` (gitignored). `shared/firebase.ts`
provides lazy singletons `firebaseAuth()`, `firebaseDb()`, `firebaseStorage()`.

## Collections

| Collection      | Doc shape (see `shared/types.ts`) | Notes                            |
| --------------- | --------------------------------- | -------------------------------- |
| `categories`    | `Category`                        | ordered by `order` asc           |
| `vendors`       | `Vendor`                          | filtered by `status == 'active'` |
| `products`      | `Service` (renamed)               | child by `vendorId`              |
| `reviews`       | `Review`                          | child by `vendorId`              |
| `users`         | `{ uid, name, email, phone, preferredCategoryIds[], createdAt }` | one doc per Auth user |
| `subscriptions` | `Subscription`                    | per-vendor billing               |
| `_meta/seed`    | `{ _seeded: true, ... }`          | seed idempotency marker          |

Centralized in `shared/firestore-paths.ts` via the `COL` constant.

## First-time seed (one-shot)

The mock arrays in `src/data/seed.ts` are the source. They are copied into
Firestore by `seedFirestore()` in `src/lib/seed-firestore.ts`.

To run it:

1. Sign up in the app (creates a Firebase Auth account + `users/{uid}` doc).
2. Tap the user avatar → Settings.
3. Scroll to the **DEV** section at the bottom → tap **Seed Firestore (dev)**.
4. Wait for the confirmation alert with the counts.

The seed writes a marker doc at `_meta/seed` after success, so subsequent taps
short-circuit instead of re-writing. To re-seed: delete `_meta/seed` in the
Firebase Console, then tap the button again.

The seed row only appears when `__DEV__` is true (Expo dev client / debug
builds). It is hidden from production builds.

## End-to-end first run

1. Launch app → Splash routes to Sign In (no auth yet).
2. Tap "Sign up" → fill name, email, phone, password ≥ 6 chars.
3. Pick ≥ 3 categories → Continue (writes `preferredCategoryIds` to your user doc).
4. You land on Home — it will be empty until seeded.
5. Open Settings → tap **Seed Firestore (dev)**.
6. Pull-to-refresh Home / re-open the app — vendors, products, reviews now load
   live via `onSnapshot`.

## Auth state

`App.tsx` registers an `onAuthStateChanged` listener that hydrates
`useUserStore` from the Firestore `users/{uid}` doc on sign-in and clears it on
sign-out. The splash screen routes based on `useUserStore.user`:

- non-null → `MainTabs`
- null → `SignIn`

To revert to the original dev bypass (skip auth entirely), change the route in
`src/screens/SplashScreen.tsx` back to `navigation.replace('MainTabs')`.
