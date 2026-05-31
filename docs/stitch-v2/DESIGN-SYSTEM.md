# Stitch v2 — "Kuwaiti Artisans / Souqna" design system

Source: user's Stitch project "LocalKW: Kuwait Business Discovery" (7 screens).
This is the reference for the full visual overhaul.

## Palette (the big change from navy-only)
| Token | Hex | Role |
|---|---|---|
| secondary | `#415c9d` | **MAIN ACCENT** — buttons, headings, links, active states |
| secondary-container | `#9db7ff` | light-blue chips, active nav bg |
| on-secondary-container | `#2a4686` | text on light-blue |
| on-secondary-fixed-variant | `#274484` | button hover |
| background / surface | `#faf8ff` | app canvas (near-white, faint cool tint) |
| surface-container-lowest | `#ffffff` | card surface |
| surface-container-low | `#f2f3ff` | inset fields, subtle panels |
| surface-container | `#ecedf9` | icon circle bg |
| surface-container-high | `#e6e7f3` | hover |
| surface-variant | `#e0e2ed` | dividers |
| on-surface | `#181b24` | primary text |
| on-surface-variant | `#46464c` | secondary text |
| outline / outline-variant | `#76777d` / `#c6c6cd` | borders |
| tertiary-container | `#001a41` | deep-navy hero bg (onboarding) |
| whatsapp | `#25D366` | WhatsApp order CTA (green) |
| error | `#ba1a1a` | destructive / sign out |
| primary | `#000000` | reserved, rare |

## Type — single family
- **Inter** everywhere. Weights 400/500/600/700.
- display-lg 48 / headline-xl 32 / headline-xl-mobile 28 / headline-md 24 / body-lg 18 / body-md 16 / label-md 14 (600, +0.01em) / label-sm 12 (500).
- For Arabic we still need a fallback (Inter doesn't shape Arabic well) — keep IBM Plex Sans Arabic as the Arabic fallback in the font stack.

## Radius / spacing
- radius: default 4 / lg 8 / xl 12 / 2xl 16 / full 9999
- spacing: base 8 / stack-sm 12 / stack-md 24 / stack-lg 48 / gutter 24 / margin-mobile 20
- Shadows: soft `0 4px 20px rgba(10,16,32,0.08)`, elevated `0 12px 40px rgba(10,16,32,0.15)`

## Icons
Material Symbols Outlined (FILL 0 default, FILL 1 for active). In RN we map to Ionicons equivalents.

## Screens (7)
1. **Onboarding** — full-bleed hero image + dark gradient (tertiary-container), headline + sub, 3 pagination dots, "Get Started" (secondary, pill, arrow), divider "or select role", 2-up role cards (Customer shopping_bag / Vendor storefront).
2. **Product Detail** — image gallery + 4 thumbnails, title + price (display-lg secondary), vendor trust card (logo, name + verified, 4.9★ 120+, chevron), bento 2-up (Serves / Prep Time), description + allergens, delivery radio options, **big WhatsApp "Order via WhatsApp" CTA** + "opens pre-filled message" caption. Top app bar: location / title / search. Bottom nav.
3. **Home Discovery** — top bar (location pill "Salmiya, Kuwait" / "Kuwaiti Artisans" / search). Search field. Category chips (All active = secondary). "Available Today" horizontal carousel of tall product cards (image, price badge top-right, vendor name + verified, title). "Gathering Tonight?" 4-up square grid. Bottom nav (Home active = secondary-container pill).
4. **Vendor Mini-Store** — cover image + gradient, circular logo overlap, name + verified, "Artisanal Cakes • Kuwait City", stats (4.9 / ~1h response / Since 2023), "Accepting Orders Today" pill + Instagram, filter tabs (Best Sellers active), 2-col product grid (aspect 4/5, Best Seller badge, title, serves, price), floating green "Contact on WhatsApp".
5. **Login / Sign Up** — phone-OTP based: phone (+965 prefix) → Send OTP → 4-digit OTP. Google + Apple social buttons. Register has Customer/Vendor segmented toggle + Full Name + phone + (vendor: Store Name). Dot-pattern bg.
6. **Settings / Profile** — profile summary card (avatar w/ camera overlay, name, email, Edit Profile). Account section (Personal Info, Saved Addresses). Preferences (Language En/Ar toggle, Push Notifications toggle). Support & About (Help, Privacy, Terms). Sign Out (error). Icon-circle rows w/ chevrons.
7. **Legal** — Back bar, "Legal & Policy Center", prose article (Privacy Policy + Terms of Service + Trust & Safety callout).

## Bottom nav (THIS design): Home · Categories · Orders · Profile
NOTE mismatch: we don't process orders (browse + WhatsApp only). Keep "Favorites" instead of "Orders", or relabel. Decide.

## Naming
Stitch shows brand names "Kuwaiti Artisans" / "Souqna" — our app is "Mshro3e / مشروعي". Keep Mshro3e unless told otherwise.
