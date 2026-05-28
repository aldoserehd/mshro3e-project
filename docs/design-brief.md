# Mshro3e Design Brief — Agent 1 Output

> Source of truth for Agent 2 (mobile) and Agent 3 (admin web). Implementations MUST pull tokens (colors, type, spacing, radius, shadows) from `shared/theme.ts` rather than redefining them.

## 1. Color system

| Token | Hex | Usage |
|---|---|---|
| navy-950 | #05080F | App background (dark mode), deepest surfaces |
| navy-900 | #0A1020 | Primary brand, AppBar, primary buttons |
| navy-800 | #111A33 | Elevated dark surfaces, bottom sheets (dark) |
| navy-700 | #1B2A4E | Hover/pressed on navy-900, secondary buttons |
| navy-600 | #243B6B | Active tab, focused border |
| navy-500 | #2E4A8A | Links, interactive accent |
| navy-400 | #5B7AB8 | Disabled primary, secondary text on dark |
| navy-300 | #8FA4CC | Subtle icons on light, dividers on dark |
| navy-200 | #C2CFE3 | Light borders, chip backgrounds |
| navy-100 | #E2E8F2 | Hover states on white, skeleton base |
| navy-50  | #F4F6FB | App background (light), card alt-fill |
| black    | #000000 | Reserved for pure-contrast moments (rare) |
| white    | #FFFFFF | Primary light surface, on-navy text |
| neutral-900 | #14171F | Body text on light (slightly warmed black for Arabic readability) |
| neutral-500 | #6B7280 | Muted text, placeholder, helper copy |
| neutral-200 | #E5E7EB | Borders, hairlines, input outlines |

Contrast notes: navy-900 on white = 16.8:1 (AAA). neutral-900 on white = 17.4:1. Arabic glyphs render at higher visual density, so we standardize body text on neutral-900 (not pure black) to soften the page without losing AAA.

## 2. Typography

**Pairing**: Display = **Manrope** (Latin) + **Tajawal** (Arabic). Body = **Inter** (Latin) + **IBM Plex Sans Arabic** (Arabic). Justification: Manrope/Tajawal share generous open counters and a geometric humanist feel for marketing surfaces; Inter/Plex Arabic are the most legible Latin/Arabic pairing at small UI sizes and share x-height proportions so mixed-script lines (e.g., "iPhone 15 جديد") don't visually jitter.

| Role | Size / LH | Weight | Font |
|---|---|---|---|
| Hero | 40 / 46 | 700 | Manrope + Tajawal |
| Page title | 28 / 34 | 700 | Manrope + Tajawal |
| Section title | 22 / 28 | 600 | Manrope + Tajawal |
| Card title | 17 / 24 | 600 | Inter + Plex Arabic |
| Body | 15 / 22 | 400 | Inter + Plex Arabic |
| Label | 13 / 18 | 500 | Inter + Plex Arabic |
| Button | 15 / 20 | 600 | Inter + Plex Arabic |
| Caption | 12 / 16 | 400 | Inter + Plex Arabic |
| Microcopy | 11 / 14 | 500 (uppercase tracking +4%) | Inter + Plex Arabic |

Arabic-specific: bump line-height +2px when an element is detected as RTL/Arabic-dominant (descenders on letters like ج، ح، م extend further than Latin descenders).

## 3. Spacing, radius, shadow

**Spacing** (4px base): `s0=0, s1=4, s2=8, s3=12, s4=16, s5=24, s6=32, s7=48, s8=64`.

**Radius**: `r-sm=6, r-md=10, r-lg=16, r-xl=24, r-full=9999`. Cards default to r-lg. Buttons r-md. Pills r-full. Sheets r-xl on top corners only.

**Shadow** (light-mode tuned; on navy-950 backgrounds, use a navy-700 1px inner stroke instead of a drop shadow):
- `elev-1` (resting card): `0 1px 2px rgba(10,16,32,0.06), 0 1px 1px rgba(10,16,32,0.04)`
- `elev-2` (hovered card / sticky header): `0 4px 12px rgba(10,16,32,0.08), 0 2px 4px rgba(10,16,32,0.04)`
- `elev-3` (floating: FAB, bottom-sheet, popover): `0 12px 28px rgba(10,16,32,0.14), 0 4px 8px rgba(10,16,32,0.06)`
- `elev-4` (modals, command palette): `0 28px 60px rgba(10,16,32,0.22), 0 10px 20px rgba(10,16,32,0.10)`

Dark-mode replacement for `elev-1/2`: 1px `rgba(255,255,255,0.06)` inner top edge + 1px `rgba(0,0,0,0.5)` outer bottom edge. For `elev-3/4` on dark, use the same blur values but switch base color to `rgba(0,0,0,0.55)`.

## 4. Layout patterns

**1. Vendor Hero Card**
When: top of vendor profile, search result featured slot.
Anatomy: 16:9 cover image (with subtle navy-900 gradient bottom-overlay) → overlapping circular logo (72px, -36px margin-top, white 4px ring) → header row (vendor name 22/28, verified-tick) → meta row (rating dot, distance, response-time chip) → CTA row (primary "احجز الآن" + ghost "تواصل").
Interaction: cover image parallaxes -0.5x on scroll; logo scales 1→0.7 and pins to header as user scrolls past it.

**2. Service Tile Grid**
When: vendor profile services tab, category landing.
Anatomy: 2-column grid, 12px gutter. Each tile: square image (r-lg) → title (17/24, 2 lines max) → price row (price in 17/600, original price strikethrough if discount) → duration pill (e.g., "45 د").
Interaction: long-press reveals quick-action drawer (book, save, share, report) at the bottom of the tile without leaving the grid.

**3. Booking Time-Slot Picker**
When: service booking flow, step 2 of 3.
Anatomy: horizontal date strip (sticky, 7 days visible, swipe to advance week) → AM/PM segmented control → slot grid (3 cols, 44px tall pills) → footer summary bar (selected slot + total price + next button).
Interaction: tapping a slot triggers slot pill scale 1→1.04→1 spring + footer slides up 24px from below if it's the first selection of the session.

**4. Vendor Profile Sheet**
When: tap on map marker, tap on search row.
Anatomy: bottom sheet with three snap-points (peek 120px / half 50% / full 92%). Peek shows logo + name + rating + book button. Half adds gallery strip + key services. Full = entire profile.
Interaction: sheet drag handle hint-bounces once on first appearance per session; snap transitions use spring damping=18, stiffness=180.

**5. Search-with-Filter-Pills**
When: discover screen, category screen.
Anatomy: sticky search bar at top → horizontally scrollable pill row beneath (category / city / price / rating / "open now") → active filters show as filled navy-900 pills with X; inactive as navy-200 outline. Below: result list.
Interaction: applying a filter triggers a 200ms result-list crossfade; pill row scrolls the active pill into view automatically.

## 5. Micro-interactions

1. **Card press**: `onPressIn` → `withSpring(0.97, {damping: 18, stiffness: 300})` scale + `Haptics.impactAsync(Light)`. `onPressOut` → spring back to 1.
2. **Primary button press**: 150ms background interpolate navy-900 → navy-700 + scale 0.98, haptic medium on release.
3. **Tab bar switch**: active indicator translates with `withSpring(target, {damping: 22, stiffness: 220})`, icon color crossfades 180ms.
4. **Pull-to-refresh**: custom indicator — three navy-600 dots that scale-pulse on stretch; trigger threshold 80px; on release spring back with success haptic when data arrives.
5. **Snackbar/toast**: enter `translateY(80→0)` with spring(damping: 20, stiffness: 200) + opacity 0→1 over 220ms; auto-dismiss after 3.2s with reverse.
6. **Number ticker** (price, rating count): on mount or value change, animate each digit on a vertical strip with `withTiming(value, {duration: 600, easing: Easing.out(Easing.cubic)})`.
7. **Skeleton shimmer**: linear-gradient strip translates -100% → 100% width over 1100ms, `Easing.inOut(Easing.ease)`, loops.
8. **Bottom-sheet drag**: shared value `translateY` driven by `Gesture.Pan()`; on release `withSpring` to nearest snap. Sheet handle opacity = `interpolate(translateY, [start, mid], [0.6, 1])`.

## 6. Mobile screens

**Customer side**
- Splash — brand intro, auth check.
- Onboarding (3 slides) — value props, language pick (AR/EN), location permission.
- Auth (phone OTP) — sign-in/up via phone number.
- Home/Discover — hero carousel + categories + featured vendors + nearby.
- Search — query + filter pills + result list/map toggle.
- Category — vendor list filtered by category.
- Map view — pins of vendors, profile sheet on tap.
- Vendor profile — hero, about, services, products, reviews, gallery tabs.
- Service detail — full description, pricing, photos, book CTA.
- Booking flow (3 steps) — service confirm → date/time → confirm/pay.
- Booking confirmation — success state, calendar add, share.
- Product detail — gallery, variants, add-to-cart.
- Cart — line items, totals, checkout CTA.
- Checkout — address, payment, place order.
- Orders list — past + upcoming, status pills.
- Order detail — items, tracking, cancel/reorder.
- Bookings list — upcoming/past, with quick actions.
- Booking detail — vendor info, reschedule/cancel.
- Chat list — conversations with vendors.
- Chat thread — message bubbles, media share, book-from-chat.
- Favorites — saved vendors + saved services.
- Notifications — promo, booking, order, system tabs.
- Profile — user info, addresses, payment methods.
- Settings — language, notifications, privacy, logout.
- Help/Support — FAQ + contact owner.

**Vendor side** (same app, vendor mode)
- Vendor dashboard — today's bookings, revenue today, pending actions.
- Bookings calendar — week/day toggle, drag-to-reschedule.
- Booking detail (vendor) — customer info, accept/decline/complete.
- Services manager — list + add/edit service.
- Add/Edit service — photos, price, duration, availability.
- Products manager — list + add/edit product.
- Add/Edit product — photos, variants, stock.
- Orders (vendor) — list + status update.
- Order detail (vendor) — fulfill/ship.
- Customers — list of customers who've booked.
- Customer detail — history, notes.
- Analytics — bookings, revenue, top services charts.
- Vendor profile editor — cover, logo, bio, hours, location.
- Payouts — earnings, withdraw, history.
- Vendor settings — staff, working hours, notifications.

## 7. Admin web pages

**Owner view**
- Login.
- Overview dashboard — GMV, active vendors, bookings today, signups graph.
- Vendors list — searchable table, status filters, verify action.
- Vendor detail — full profile, services, bookings, revenue, suspend/verify.
- Vendor approval queue — pending vendors with submitted docs.
- Categories manager — CRUD categories + icons.
- Bookings (global) — all bookings table, filters.
- Orders (global) — all orders table.
- Users — customers list, ban/unban.
- Reviews moderation — flagged content queue.
- Reports — financial, vendor performance, category performance.
- Payouts — vendor payout requests, approve/reject.
- Promotions — create/manage banners + promo codes.
- Notifications composer — send push to segments.
- Audit log — admin actions trail.
- Settings — platform fee, currencies, languages, payment gateways.
- Staff/Admins — add admin users, role permissions.

**Vendor view** (same Next.js app, scoped)
- Login.
- Dashboard — own metrics: today bookings, revenue MTD, pending actions.
- Bookings calendar (week/month/day).
- Services CRUD.
- Products CRUD.
- Orders list + detail.
- Customers (only the ones who booked them).
- Reviews — read + reply.
- Analytics — own revenue/bookings charts.
- Payouts — own balance + withdraw.
- Storefront editor — cover, logo, bio, hours, gallery.
- Staff manager — invite team members with roles.
- Settings — notification prefs, payment methods.

## 8. Five 2026 design moves to steal

1. **Bento dashboards** — Admin overview & vendor analytics. Asymmetric grid where one large hero tile (e.g., revenue) sits beside two stacked mid tiles and three small KPI tiles. Implementation hint: CSS grid with `grid-template-areas`, tile heights in multiples of 88px, every tile uses the same r-lg radius for cohesion.

2. **Spatial bottom sheets with snap points** — Vendor profile, filter modal, booking confirm. Three-snap (peek/half/full) sheet that feels OS-native. Implementation hint: Reanimated `useSharedValue` for translateY, `Gesture.Pan()` from gesture-handler, `withSpring` to nearest snap on release; backdrop opacity interpolated from translateY.

3. **Live "fresh data" pills** — A small pulsating dot + label ("محدث الآن", "قبل 2 د") on vendor cards and dashboard tiles, showing the data is live. Builds trust on a marketplace. Implementation hint: small navy-500 dot with infinite scale 1→1.4→1 animation at 1.6s; timestamp re-renders every 30s via a `useElapsedTime` hook.

4. **Conversational booking confirmation** — Replace static success screen with a 3-bubble animated sequence ("تم تأكيد حجزك" → "أرسلنا إشعار للبائع" → "نراك يوم الأحد ٤ مساءً") that stagger-fade in over ~1.4s, ending with the calendar-add CTA. Implementation hint: each bubble has its own entering animation with `delay(index * 360)`.

5. **OS-style time picker wheels** — Vendor calendar reschedule + customer booking time. Vertically scrollable spinner columns (hour / minute / AM-PM) with magnetic snap, instead of a generic grid. Implementation hint: FlatList with `snapToInterval=44`, `decelerationRate="fast"`, items off-center scale to 0.85 with opacity 0.5 via `onScroll` shared value.

## 9. RTL considerations

- **Direction flag**: read I18nManager.isRTL on RN; on web set `dir="rtl"` on `<html>` when locale=ar.
- **Mirror these icons**: chevron-back/forward, arrow-left/right, send-plane, reply, undo/redo, list bullets with leading icons, breadcrumb separators, progress bars with directional fills, swipe-action affordances. Do NOT mirror: clock, search/magnifier, camera, play/pause, volume, checkmark, brand logos, numbers, latin-only typography (e.g., "iPhone 15").
- **Leading edge**: replace `marginLeft/Right` with `marginStart/End`; same for padding and absolute positioning. In Tailwind use `ms-*`/`me-*`/`ps-*`/`pe-*` and `start-*`/`end-*` utilities, never `ml-*`/`mr-*`.
- **flexDirection**: use `row` (RN auto-flips when isRTL) — do NOT manually set `row-reverse` or the flip will reverse twice. Exception: when the row contains a Latin-only sequence (price + currency code) that must stay LTR, wrap that sub-row in a forced-LTR view.
- **Numbers**: keep Western Arabic digits (0-9) for prices and ratings — easier scanning. Use Eastern Arabic digits (٠-٩) only for dates and counts where the surrounding copy is fully Arabic.
- **Font fallback chain**: `'IBM Plex Sans Arabic', 'Inter', system-ui, sans-serif` — Arabic font first so mixed strings pick correct glyph metrics.
- **Line-height**: +2px on any text element when locale is Arabic. Arabic descenders (ج، ح، خ، ع، غ، م، ه) drop further than Latin x-height baseline; tight line-height collides with the line below.
- **Letter-spacing**: never apply positive letter-spacing to Arabic text — it breaks ligatures. Use `letterSpacing: 0` and conditionally apply tracking only when language === 'en'.
- **Punctuation**: Arabic comma (،), question mark (؟), and semicolon (؛) are required. Build a `localizedPunctuation()` helper.
- **Input fields**: textAlign should be `right` for Arabic, but `auto` for fields that accept mixed input (e.g., email, URL, phone) so the cursor naturally follows what's typed.
- **Animations from edges**: any "enter from right" should become "enter from start"; use `I18nManager.isRTL ? -X : X` for translateX values, or use logical CSS (`inset-inline-start`) on web.
- **Form labels**: align labels to the start edge; helper text and error text inherit start alignment. Required-asterisk goes on the trailing edge of the label, not the leading.
- **Date/time formatting**: use `Intl.DateTimeFormat('ar-SA', { calendar: 'gregory' })` — explicit Gregorian, otherwise default may return Hijri on some devices, which confuses bookings.
- **Test string**: ship a `__rtl_canary` screen accessible only in dev that renders every component with the string "احجز خدمة iPhone 15 بـ 250 ر.س قبل ٢٠٢٦/٠٥/٢٨" to catch every mixed-script + mixed-numeral edge case in one glance.
