# Handoff — مجمع دي براكسس الطبي / Dpraxis Beauty Clinic (De Praxes Clinic)

Niche: multi-department clinic — dentistry + dermatology/aesthetics + laser (cosmetic surgery removed in v9 at the client's request)
Primary language: Arabic (Arabic-first, full AR/EN toggle)
Old site: **none — Instagram-only.** No business website exists anywhere. The bio link resolves
to a Google Maps pin and a Linktree; the Linktree holds only social profiles plus a WhatsApp
click-to-chat shortener (`iwtsp.com/966543333647`). Confirmed by resolving the bio link all the
way down, per the hidden-website rule.
New demo (local): demos-depraxis/index.html
GitHub repo: https://github.com/Aymean/depraxis-demo (public)
Intended live URL: https://depraxis.zaylogear.com/
Real WhatsApp: +966543333657
Real phones: +966 54 333 3657 and +966 54 333 3647
Real email: **none found anywhere** (Instagram, Linktree, Facebook, Google)
Socials: [IG](https://www.instagram.com/dpraxisclinics.sa) (verified, 14,508 followers, 680 posts) ·
[TikTok](https://www.tiktok.com/@dpraxis.clinics) (3,762 followers, 878 videos) ·
Snapchat `dpraxisclinics` · [Facebook](https://www.facebook.com/p/Dpraxis-Beauty-Clinics-61570277572734/)

---

## v9 — multi-page site, cosmetic surgery removed, client profile content (2026-10-17, branch `v9-multipage`)

Client meeting asks (owner: Aymean): no scroll-to-section — every link opens its own page;
remove cosmetic surgery; add a Partners page; add the profile's machines to a Technology page;
use the client's PDF profile content to the max; **do not touch the doctors**.
**Not pushed. `main` untouched.** Push to `main` = live for the client.

### Page map (static files at the repo root)

| Page | What's on it |
|---|---|
| `index.html` | video hero (3 departments), department/technology strip, figures, About teaser, department cards, technology teaser (4 device photos), explore cards (cases / doctors / reviews / partners), booking CTA |
| `about.html` | profile tagline, About Us, Mission, Vision, the clinic-tour video band (old `#inside`), the profile's closing statement |
| `departments.html` | the old numbered dark rail, 3 departments, index column + "See cases" + "department page" links |
| `dental.html` · `dermatology.html` · `laser.html` | page header with photo, department text, profile intro + services, "from published cases" list, cross-links |
| `technology.html` | the profile's 8 devices (photo cards) + the 6 existing techniques |
| `cases.html` | before/after grid; `cases.html?filter=dental\|derm\|laser` opens pre-filtered, at the top |
| `doctors.html` | the 10 doctor cards — **byte-identical to v8** (verified by string compare); only the section header moved into the page header |
| `reviews.html` | score panel + scrolling review columns, unchanged |
| `partners.html` | 9 logos + names, nothing else |
| `book.html` | the same 3-step booking flow + Apps Script bridge + WhatsApp fallback + shader |
| `contact.html` | old `#visit`: address, hours, phones, parking, access, map |
| `404.html` | served by Cloudflare for unknown paths (`not_found_handling: "404-page"` added to `wrangler.jsonc`) |

Also new: `robots.txt`, `sitemap.xml` (extensionless URLs — Cloudflare's default html handling
serves `/about.html` as `/about`; canonicals use the same form).

### How to rebuild

```
python build.py
```

- Edit **`src/`**, never the root `.html` files (they are generated and committed, because
  Cloudflare serves the repo as-is).
- `src/pages/<name>.html` = one page body. First line is a JSON front-matter comment:
  title AR/EN, meta description, active nav key, breadcrumbs, and which JS modules to load.
- `src/partials/` = head (meta/OG, early language script), header + nav (current page gets
  `aria-current="page"`), footer, WhatsApp bubble + mobile bar, icon sprite, JSON-LD (home only).
- `src/css/site.css` (v8 CSS, smooth-scroll removed) + `src/css/v9.css` (page header, cards,
  device cards, partner grid) are inlined into every page; Tailwind is compiled/purged from the
  generated pages and inlined into `<style id="tw">`.
- `src/js/core.js` on every page (language, WhatsApp prefill, nav, mobile menu, mobile bar,
  GSAP reveals); per-page: `home.js` (hero video), `cases.js`, `booking.js` (form + shader),
  `inside.js` (about video), `deptindex.js`. GSAP/ScrollTrigger load on every page (cached);
  the booking shader only on `book.html`; `three.module.min.js` is still unreferenced.
- `BOOKING_API_URL` (v7 calendar bridge) now lives at the top of `src/js/booking.js`, not in
  `index.html` — change it there and rebuild.
- Language: saved in `localStorage["dpx-lang"]`; a tiny inline script in `<head>` sets
  `dir`/`lang` before first paint, so no flash of the wrong language between pages.
- `.assetsignore` keeps `src/`, `build/`, `build.py`, HANDOFF etc. out of the deploy.

### Content decisions (flag to the client if any matter)

- **Cosmetic surgery is gone everywhere** (hero, strip, rail, booking option, footer, meta,
  JSON-LD). The only remaining "surgery" string is Dr. Kazim's own title "Oral & dental
  medicine and surgery" inside the untouchable doctor cards.
- Hero now reads **"Three departments. Ten specialists."** The profile itself has 2
  departments (Aesthetics/Dermatology/Laser + Dental); the site keeps its 3 pages as the spec says.
- Device names are the profile's own: Splendor X, DEKA, PicoWay, **Spectra QS** (the photo
  label actually says Spectra XT), **Genius** (p6 of the profile says "Laser Genesis"),
  **Ultraformer III** (p9 says "4th generation"), Fractional Laser, HydraFacial (p6 says
  "HydraFacial Elite"). Not our job to reconcile — but the client may want to.
- **Fractional Laser has a typographic card, no photo**: the profile reuses the Spectra photo
  for it, so showing it would put the same machine on the page twice.
- Small fixes to the profile text: mission EN now says "Dermatology, Aesthetics and Dentistry"
  (matching her Arabic — her English dropped "Aesthetics"); vision got its missing full stops;
  "وفع الحواجب" → "رفع الحواجب"; PicoWay EN "fine hair peeling" → "fine hair bleaching" (her
  Arabic says تشقير); conclusion EN "At D-Praxis" → "At De Praxes" (site's brand spelling);
  "ميزوثيرابي تذويب الدهن المزدوجة" → "…تذويب الدهون للذقن المزدوجة".
- PDF extra doctors (13 dental in the profile) **not added** — doctors untouched as instructed.
- Profile illustrations (AI/stock-looking) are used only as small unlabelled illustrative
  images on the dermatology/dental pages, with the note "Illustrative images from the clinic's
  own profile". Hero/large slots use the real clinic photos. Device photos are crops from the
  profile (`images/machines/`).
- Partners: Umm Al-Qura University, Zahid Group, Dar Al-Hekma University (wordmark), Alshaya
  Group, UBT, alinma bank, Saudi Ground Services Company, Lamasat, sela (Latin name only).
  **Two logos left out** (palm-tree charity, nFit): only blurry poster crops exist — ask the
  client for the files. No discounts, no percentages, no dates. Logos grayscale at rest,
  colour on hover. sela's file is a third-party copy upscaled 3× — ask for an official one.

### Verified this session (see the session report for the raw output)

- local server: every page 200; Playwright sweep 14 pages × 1440/390 × AR/EN = 56 renders:
  0 console errors, 0 horizontal overflow, 0 language leaks, 0 broken images
- link audit over every `href`/`src`/`poster` in the 14 pages: 0 missing internal targets;
  only `#` links left are the skip-link `#main` (every page) and the two step-4 buttons on
  `book.html` whose `href` JS sets before they are shown
- grep: no `جراحة التجميل` / `dept-surgery` / `scroll-behavior` / "four departments" anywhere
- booking flow driven to step 3 (department → day → slot → Next → details filled), submit
  **not** clicked; booking API route was blocked in the test so nothing could reach the calendar
- language toggled on home → persists on the next page with `dir` already set at load;
  pages open at `scrollY 0`; `cases.html?filter=dental` shows exactly the 17 dental cases

---

## v8 — Doctors section reverted to its pre-accordion layout (2026-08-23)

**The client asked for the image-accordion hover effect on `#team` to go.** That one section is
back to exactly how it stood in v4 (`8d8eeb6`) — its markup is byte-identical to that commit's.
Removed with it: the ten-panel accordion strip, its hover/swipe hint line, the whole `.dacc*`
CSS block, the `#team article[id]{scroll-margin-top:7rem}` rule, and the `id="dr-*"` anchors the
accordion links pointed at. No dead code left behind (`grep dacc` → 0 hits, no `#team` CSS rules
remain). The ten doctor cards themselves are untouched — same photos, bios, credentials, IG
handles and per-doctor Google ratings — back to the plain 1 / 2 / 3-column grid.

**Nothing else was reverted.** Everything from v5 onward stands exactly as it was: the
background-video hero, the two deleted sections (`#showcase`, `#standard`), the Testimonials
Columns effect on the reviews, and the Interactive Hover Button on the five scoped buttons. The
v5 notes below are kept for history — §"3. Doctors — Tailwind Image Accordion" now describes an
effect that is no longer in the build.

Tailwind was re-purged after the cut, which dropped the one utility (`sm:mt-14`) the accordion
was the only user of.

### QA re-run after the revert

375 / 768 / 1440 widths, Arabic and English both ways:

- doctor grid falls to 1 / 2 / 3 columns as it did in v4; `h3` spacing back to `sm:mt-16` (64px)
- all ten doctor photos load (640×640, none broken), card heights even across each row
- no horizontal overflow at any of the three widths
- lang-leak sweep both directions: 306 opposite-language nodes, 0 visible leaks, 0 wrongly
  hidden same-language nodes — clean in AR→EN and EN→AR
- no console errors; no CSS class collision — the removed classes were all `.dacc*`-prefixed and
  the reverted markup only uses utilities the rest of the page already uses
- the untouched sections verified live: hero video playing, `tcol-scroll` review columns still
  animating, five `.ihb` buttons, four booking steps, `#showcase`/`#standard` still absent

Measured from the live page (computed layout, geometry and network), not screenshots — the
preview pane could not composite frames this session.

---

## v7 — the booking form itself writes straight onto the calendar; v6 reverted (2026-08-23)

**v6 (below) was the wrong shape and was reverted wholesale** (`git checkout` of the pre-v6
commit) — it added a *second, parallel* booking path (Google's own Appointment Schedule
widget, embedded or linked, sitting beside the existing form). Aymean's actual ask: keep the
one form that's already there, make its own submit write directly onto the calendar, and
keep WhatsApp only as a secondary option — not a second competing flow. `_preview-calendar.html`
(a throwaway demo of the v6 widget) was deleted; it was never meant to ship.

**STUBBED — waiting on Aymean to deploy the bridge script and paste one URL. Ships as
WhatsApp-only, byte-identical to pre-v6, until then.**

### What was actually built

The existing 3-step form (department → day/time → name/mobile) is unchanged. What changes is
what submit *does*:

- **`BOOKING_API_URL` empty (what ships today):** exactly the old behavior — Next opens
  WhatsApp with the request pre-written, "not booked yet" copy, personal add-to-calendar
  reminder. Verified byte-for-byte identical to the pre-v6 build (same WhatsApp message
  text, same flow) via a scripted run through the whole form.
- **`BOOKING_API_URL` set:** this becomes the *default* path, not a second option —
  - Step 2's time slots are checked live against the real calendar (`fetchBusyTimes`, a GET
    to the URL with `?date=`) and busy hours are disabled before the visitor ever sees them.
  - Submitting step 3 POSTs the booking to the same URL. On success the appointment is
    **actually on the calendar already** — step 4 shows the honest confirmed-booking copy
    (`#step4direct`) instead of the "not booked yet" copy, with a WhatsApp link underneath
    for anyone who still wants to ask something or change it.
  - If the slot was taken between the availability check and the submit (a real race, however
    rare), the API returns `{ok:false}` and the visitor is sent back to step 2 with a "just
    taken, pick another" message and a re-fetched availability list — no half-booked state.
  - If the API is unreachable at all (network blip, bad URL), the submit **falls back to the
    exact old WhatsApp flow** rather than losing the request or showing a dead end —
    `#step4wa`, the honest "not booked yet" copy.
  - A **"Prefer WhatsApp instead?" link** (`#waAltBtn`) sits under the submit button whenever
    the API is configured, for anyone who'd rather ask something first — it skips the API
    entirely and goes straight to the same WhatsApp path.
  - Heading, intro copy, the step-2 note and the submit button's own label all switch to
    calendar-appropriate wording the moment the API is configured (`applyBookingMode()`,
    called once at load) — nothing reads "WhatsApp" as the default action once it's live.
  - The personal "add to your calendar" reminder button (pre-existing, unrelated to this)
    is untouched either way — it was always just a reminder for the visitor's own calendar,
    true regardless of which path actually booked the appointment.

### The one-time setup Aymean needs to do (his Google account, his OAuth — Claude can't do
this part; it needs to run under his own login)

1. **Create a calendar just for this** (not his personal one) — Google Calendar → Settings →
   "Add calendar" → "Create new calendar" → e.g. "De Praxes — Bookings". Open its settings →
   "Integrate calendar" → copy the **Calendar ID** (looks like
   `abc123...@group.calendar.google.com`).
2. **Create the bridge script** — go to script.google.com → New project → delete the
   placeholder code → paste in `demos-depraxis/booking-apps-script.gs` (in this folder) →
   fill in `CALENDAR_ID` at the top with what you copied in step 1.
3. **Deploy it** — Deploy → New deployment → type **Web app** → Execute as **Me** → Who has
   access **Anyone** → Deploy → authorize it when Google asks (it's your own script asking
   for permission to touch your own calendar) → copy the URL ending in `/exec`.
4. **Paste that URL** into `index.html`, `var BOOKING_API_URL = "";` near the top of the
   script block — paste it between the quotes. Save. Nothing else to touch.

Free (Apps Script's free quota is 20,000 requests/day — far more than a clinic needs), no
server to host or maintain, and it's Google's own infrastructure end to end.

### Tested this session (with a mocked bridge, since no real deployment exists yet)

- **Default/unconfigured path:** scripted a full run (department → day → slot → details →
  submit) and confirmed it's identical to the pre-v6 build — same WhatsApp message text
  byte-for-byte, `#step4wa` shown, `#step4direct` hidden, personal-reminder link unaffected.
- **Live-mode copy swap:** with a URL set, confirmed the heading, intro, step-2 note, submit
  label and form note all switch to the calendar-aware wording, and `#waAltBtn` un-hides.
- **Real availability check:** mocked the GET to return one busy hour; confirmed exactly that
  slot renders `disabled` with `data-taken="1"`, every other hour stays clickable.
- **Successful booking:** mocked the POST to return `{ok:true}`; confirmed WhatsApp is
  **not** opened, `#step4direct` shows, `#step4wa` stays hidden, the add-to-calendar link
  carries the confirmed-booking wording, and the POST body carries the right department/date/
  time/name/phone/note fields.
- **Slot-taken race:** mocked `{ok:false}`; confirmed the visitor lands back on step 2 with
  the "just taken" message, submit button re-enabled, no dead-end.
- **API unreachable:** mocked a rejected fetch; confirmed the honest WhatsApp fallback fires
  (message opens, `#step4wa` shown) rather than the request silently vanishing.
- **"Prefer WhatsApp instead?" link:** confirmed it never calls the API at all — it goes
  straight to the WhatsApp path, bypassing availability/booking entirely.
- No console errors in any of the above.

**Not yet tested for real** (can't be, until Aymean deploys the actual script): the genuine
Apps Script Web App round-trip, cross-origin behavior against the real deployed URL, and
whatever calendar timezone/DST edge cases only show up against a live Google Calendar. Worth
a real end-to-end pass the first time a genuine URL is pasted in.

---

## v6 — live Google Calendar booking as a second path (2026-08-23) — REVERTED, kept for history only

**This whole approach was wrong and was reverted.** Left here only so nobody re-discovers the
same dead end. See v7 above for what actually shipped instead.

Added a second, parallel booking path in `#book`, below the existing three-step flow and
behind a hairline — an embedded/linked Google Appointment Schedule widget. Aymean's actual
ask, once clarified, was for the *existing* form's own submit to write to the calendar, with
WhatsApp staying secondary rather than a second competing flow — not a second widget next to
the first. The `_preview-calendar.html` file built alongside this to demo it was also removed.

---

## v5 — hero fix, two sections cut, three 21st.dev effects ported (2026-08-23)

A fixed, fully-specified list. Nothing outside it was touched. Still one self-contained
`index.html`, no framework, no CDN tag.

### Sources — all read from the real public upstreams, not 21st.dev

`benchmark/component_library_21st.md`'s 2026-08-21 note holds: every `Component.tsx` tab on
21st.dev is behind an account wall. Each effect below was ported from the genuine upstream:

| Effect | Real source fetched | What came back |
|---|---|---|
| Interactive Hover Button | `magicui.design/r/interactive-hover-button.json` | Full `.tsx` — the dot / label-out / label-in mechanism verbatim |
| Tailwind Image Accordion | `ui-layouts.com/r/tailwind-image-accordion.json` | Full `.tsx` — every `group-hover` utility, both pseudo-layers, both stagger delays |
| Testimonials Columns | 21st.dev usage tab only (`Component.tsx` locked, `ui.efferd.com/r/...` returns 404) | Mask, 740px cap and the 15s/19s/17s column offsets are the source's; the duplicated-track + `translateY(-50%)` loop is the standard technique rebuilt in CSS |

### 1. Hero — scroll-expansion mechanic removed, real background video in its place

The v3/v4 hero tied the footage panel's width to scroll position (`--hx`, a 200vh sticky
stage). On a phone that collapsed to a static image card with nothing to expand into, and on
desktop it only paid off once the visitor scrolled. **Reverting to the earlier commit was not
an option either — that hero used the same mechanism.**

- `media/clinic-tour.mp4` is now simply the field the hero stands on: `autoplay muted loop
  playsinline`, `src` in the markup, playing from the first frame. No sticky stage, no
  `--hx`, no seam split. `.hero-stage` / `.hero-sticky` / `.hero-media` / `.hero-overline`
  and the whole scroll-driver JS block are gone; `.hero-shell` / `.hero-bg` / `.hero-scrim` /
  `.hero-inner` replace them.
- Copy, CTAs and the `4.7 · 270 Google reviews` line are unchanged word for word. Only their
  colours moved to cream/sand, because the ground under them is now footage rather than a
  flat cream field.
- Fallbacks: the `<img class="hero-poster">` sits under the video and the video carries its
  own `poster`, so no frame is ever empty. On Save-Data or `prefers-reduced-motion` the JS
  strips the `src` and sets `hidden` on the video — the still carries the hero (verified with
  Chrome's `--force-prefers-reduced-motion`).
- **Regression caught and fixed in the same pass:** shipping the video in the markup means it
  can hold `window.load` open on a slow line, and `initMotion()` — which reveals the headline
  and every `.reveal` — was gated on `load`. A `setTimeout(initMotionOnce, 1200)` fallback now
  runs alongside it so the copy never waits on the footage.

### 2. Two sections deleted outright

- `#showcase` — "غرفة علاج حقيقية / A real treatment room". Section, its
  `.showcase-stage`/`.showcase-card` CSS and JS §5c (the Container Scroll port) all removed.
- `#standard` — "مبنى واحد / One building — no case told twice", the gold twisted-ring 3D.
  Section, `.std-*`/`#std3d` CSS, the whole `initStandard3D()` Three.js scene and its
  IntersectionObserver mount all removed. **This closes the open question about swapping that
  3D for a real Spline scene — it is gone, not replaced.**
- `gpuCapable()` was shared with the `#book` shader, so it stays (comment updated).
- Nothing referenced either section: no nav anchor, no JS selector, no footer link. Verified
  by resolving every `a[href^="#"]` on the live page — zero dangling anchors.
- Two images fell out of use as a result and were **kept, not deleted**:
  `images/clinic-treatment.webp` and `images/derm-editorial-1.webp`.
  `vendor/three.module.min.js` (670 KB) is likewise now unreferenced — kept, but it can be
  dropped from the deploy whenever you want the weight back.

### 3. Doctors — Tailwind Image Accordion

> **REVERTED 2026-08-23 (v8) — this accordion is no longer in the build.**
> Kept below for history only; see the v8 note at the top of this file.

Added above the existing doctor cards; **no real content was removed** — the ten detailed
bios, credentials, IG handles and per-doctor Google ratings all stay. The accordion is the
"ten at a glance" strip, and each panel links to that doctor's full card below (every card
got an `id`, plus `scroll-margin-top:7rem` so the fixed nav does not cover it).

Ported intact from the ui-layouts source: hovering/focusing one panel expands it while every
sibling collapses and takes a translucent blur veil (`after`), the panel's own bottom scrim
fades up (`before`), and the two text lines rise in on the source's 300ms / 500ms stagger
with its `cubic-bezier(.5,.85,.25,1.8)`. Colours are ours — the veil is cream, not white.

Two ratios changed because this shows ten real doctors, not the source's three demo panels:
sibling collapse is expressed as `flex-grow` (1 → 5 on the open panel) rather than the
source's `w-full`/`w-[20%]`, and **below 1024px the row becomes a swipeable snap rail with
the names already showing** — ten panels stacked into a column is unreadable, and at 768px ten
of them collapse to ~60px slivers. The hint line under it changes wording with the breakpoint
(hover vs swipe) so it is never telling a phone to hover.

### 4. Reviews — Testimonials Columns

The static two-up card grid is now auto-scrolling columns: each column holds its set twice and
runs a linear infinite `translateY(-50%)`, so the second copy lands exactly where the first
started and the loop never seams. The container keeps the source's own
`mask-image:linear-gradient(to bottom,transparent,black 25%,black 75%,transparent)` and its
740px cap. framer-motion's animate/transition became one CSS keyframe.

Same eight real Google reviews, same text, same reviewer names, same dates — Arabic, English
and French each kept in their own language and direction. **No reviewer photos exist, so none
were invented**; the source's avatar slot is simply left out. The score panel (4.7, the real
star distribution, Google's own keyword tags, the Maps link) is untouched.

**Two columns of four, not three of 3/3/2.** With eight reviews a three-column split leaves one
column holding two cards, whose single copy measured 531px against the 740px band — so that
column visibly showed the same reviewer twice at once. At four cards each, both copies measure
~940-960px, comfortably past the band. Durations are the source's 15s and 19s. Second column
hides below `md`; on a phone it is one column.

### 5. Interactive Hover Button — five buttons, exactly as scoped

The Magic UI mechanism verbatim: a 0.5rem dot scaling ×100.8 until it floods the button, the
resting label sliding 3rem out and fading, a second label + arrow sliding in — all on the
source's 300ms `cubic-bezier(.4,0,.2,1)`. Every X translation runs through `--ihb-x` so the
label leaves and arrives on the correct side in Arabic. One deliberate change: the source lands
its incoming layer at `-1.25rem` rather than 0; on our tighter square buttons that overshoot
clipped the label, so it settles centred.

Applied to:
1. nav `Book a visit` (solid) — matches the rule "every solid/filled Book a visit instance";
   it was not in the brief's parenthetical list, flagging it here
2. hero `Book a visit`
3. sticky mobile CTA bar `احجز / Book` — no hover exists on a phone, so it also fires on
   `:active`; its dot is hidden at rest (`scale(0)`) since that cell already carries an icon
4. booking step 2 `Next` (`#to3`)
5. booking form submit — `أرسل الطلب عبر واتساب / Send the request on WhatsApp`

Confirmed **not** applied (checked on the live page, all false): `#langbtn`, `#menubtn`,
`[data-cf]` case filters, `[data-dept]` pills, `.bnav-back`, `#wprev`/`#wnext`, `.daybtn`,
`.slot`, `#bookagain`. The `Book a visit` in `#visit` and in the mobile nav are outlined/text
links, not solid buttons, so they were left alone too.

### 6. QA run this session

- **Mobile hero verified for real at a true 390×844 viewport** (headless-new clamps windows to
  500px wide, so the page was rendered inside a 390px iframe to get an honest layout): video
  `paused:false`, `currentTime` advancing, `opacity:1`, filling 390×844, hero shell exactly
  `100svh`. Screenshots taken at 390 / 768 / 1440 in both languages.
- Booking flow driven end to end after the `#to3` rebuild: department → day → slot → Next →
  step 3 with the correct summary → Back → step 2. Submit stays bound to the form, not the
  button.
- All ten accordion links resolve to a real card; zero dangling `#` anchors page-wide.
- Horizontal overflow scan with `overflow-x` forced visible at 390 / 768 / 1440, both
  languages: clean. (The `.dacc` rail and the `.ihb-go` layer sit outside their own boxes by
  design; both are clipped by their own `overflow:hidden`.)
- Bidirectional AR/EN leak sweep over every visible text node: clean. The only cross-script
  text left is intentional and pre-existing — the toggle's own `EN`/`عربي` label, the clinic's
  real English tagline "Where Beauty Meets Precision", the real non-Arabic reviews, and
  `sr-only` Arabic labels in `#visit`.
- Console: no errors. Tailwind rebuilt and re-inlined via `build.py`.

### Note for the next pass — not acted on

Cutting `#showcase` and `#standard` flattened the page's light/dark rhythm: `#departments` and
`#inside` are now two dark sections back to back, and `#tech → #cases → #team → #reviews` is
four light ones in a row. It reads fine, but if you want the alternation back that is where to
put anything new.

---

## v4 — reference-driven visual polish pass (2026-08-21)

Scope was fixed in advance: typography, the video/3D hero, scroll motion, and the
before/after treatment. Booking, reviews and doctors were left alone for their own pass.
Still one self-contained `index.html` — no framework, no CDN tag ships (CLAUDE.md).

### 0. The 21st.dev component sources — what actually happened

The brief said to open each component's link and read the full `Component.tsx` tab, on the
basis that these are public pages. **They are not, any more.** Every `Component.tsx` tab on
21st.dev now renders *"Component source is locked — Unlock to view the full implementation.
Members get unlimited access; free accounts get a few unlocks each day"* behind a padlock,
and clicking it opens a "Create your free account" modal. Verified directly by driving the
real page (screenshot kept at `scratchpad/shots/21st-comp-tab.png` during the session).
Creating an account was not on the table, so the v3 session's claim that only the Usage tab
is reachable was correct — but its conclusion (hand-build the effect anyway) was not the
only option.

**What was done instead: went to each component's genuine upstream, all of which are public.**
That is strictly better than reading 21st.dev's copy — these are the canonical originals:

| Library entry | Real source used | How |
|---|---|---|
| Container Scroll Animation | Aceternity's own public shadcn registry, `ui.aceternity.com/registry/container-scroll-animation.json` | Full `container-scroll-animation.tsx` recovered verbatim |
| Warmth Ripple | `paper-design/shaders` → `packages/shaders/src/shaders/warp.ts` (Apache-2.0) — the library behind the 21st.dev Shader Builder that generated it | Full GLSL recovered |
| Liquid Metal | same repo, `liquid-metal.ts` (30 KB of real GLSL) | Fetched and read; **not shipped** — see §4 |
| Background Paths | `kokonutui.com/r/background-paths.json` | Fetched; **not shipped** — see §4 |
| Spline Scene embed | pattern only | See §3 for why no Spline scene ships |

### 1. Hero — rebuilt as a split field with seam-crossing display type
**Compared against: Aventura Dental Arts (hero) + Sky Clinics (department-split copy).**

Aventura's hero is a hard vertical split — flat light field on one side, full-bleed clinical
footage on the other — with the display headline ranged *into* the seam so its last words land
on the footage in white italic, and the footage then growing to full bleed on scroll. That last
part is the same thing 21st.dev's Scroll Media Expansion Hero does; Aventura ships it natively.
So the two asks collapse into one move, and that is what the hero now is.

- The real `media/clinic-tour.mp4` is the inline-end half of the split, expanding to full bleed
  across a 200vh sticky stage. One driver, `--hx` (0→1), runs the panel width, the copy fade,
  and the overline reveal.
- Headline: `Four departments. / Ten specialists. / One standard of **precision.**` — the last
  two words in cream Fraunces italic, sitting on the footage. The split point is a grid column
  that terminates exactly on the seam, so the italic half is on the video at every viewport
  width rather than depending on luck. RTL mirrors it (`ومعيارٌ واحد / للدقّة.`).
- Sky Clinics' device added underneath: the four departments each get a one-line promise rather
  than a bare label row.
- The old pale-slab Three.js hero scene was removed — none of the six approved sites put 3D in
  the hero, and it was reading as muddy beige boxes. That effort moved to §3.

**Round 1 → round 4 progression (each round: screenshot ours, screenshot Aventura, name gaps, fix):**
- **R1:** split + expansion working, but the crossing word was cream-on-near-white and
  unreadable, the copy left a 3% ghost over the cream sliver mid-scroll, and the footage was a
  bright gray wall where Aventura's is dark and high-contrast.
- **R2:** found a real bug by measuring against the reference — percentage padding resolves
  against the *containing block*, so the copy side's `46%` was 46% of the 1240px shell while the
  media's `46%` was 46% of the viewport. The seam was silently split in two, ~120px apart.
  Moved every seam offset to `vw`. Also: media graded (`contrast 1.1 / saturate .82 /
  brightness .72`), scrim doubled with a seam-edge gradient, copy fade sharpened to `1 - hx*3.1`,
  text-shadow on the crossing word, bottom corners anchored (address + footage provenance) the
  way Aventura anchors both of its corners.
- **R3:** the split line's first grid column was `54vw` wide but started *after* the page pad,
  so it ended one pad-width past the seam and pushed `of` / `واحد` onto the footage as
  dark-on-dark — fixed to `calc(54vw - var(--hpad) - .2em)`. Headline scale retuned (the longest
  line was wrapping and eating a whole line of vertical budget). Corner block became a single
  bottom rule after it collided with the copy in both directions.
- **R4:** the address rule was rendering 6px below the fold — the section's own `pt-86px` was
  stacking on top of a `100svh` sticky and pushing its bottom past the viewport. Removed it and
  gave the copy its own nav clearance, which also lets the footage run to y=0 like Aventura's.
  That exposed a regression — dark nav links now sat on dark video — so the nav is opaque from
  the start instead of only after 40px of scroll.

### 2. Departments — numbered rail on a near-black ground
**Compared against: Clinique 7's 01–06 services rail + Aventura's numbered technology showcase.**

Was a flat light card-grid that read as a spec sheet. Now Aventura's rail: near-black warm ground
(`#151310`, sand/bronze accents — warm-dark, not cold gray, per design_learnings' note on Dr
Grigoriak's warm-brown-on-black recipe), structural numerals with a `／04` fraction, treatment
lists as hairline rows with a `↗` corner arrow instead of a bulleted checklist, and a pinned
index column where the department in view carries the highlight. Moving this section dark also
gives the page the light/near-black scroll rhythm Clinique 7 alternates between.

**R1 → R4:** R1 rebuilt dark with the rail + index. R2 fixed `04` breaking across two lines in
the index and pinned the identity column, which had been leaving a dead ~300px well under every
department name. R3 hoisted each department's "See N cases" link into that column so it carries
content down its height, and swapped the CSS-border corner mark (it rendered as a caret, not a
diagonal). R4 caught that `\2197` in a Python heredoc had been eaten as an **octal escape**
(`\21` = 0x11), shipping a control character plus the literal `97` — replaced with real glyphs —
and restored the column to 4/6 after 3/7 forced the department names to wrap.

### 3. The 3D moment — its own section, self-hosted
**Compared against: LAVA Dental Studio + Dr Grigoriak (warm-dark, restrained motion).**

New `#standard` section built on the **splite** entry's *pattern* — dark card, split layout with
copy on one half and the 3D on the other, a spotlight cone over the field, and the scene mounted
lazily rather than on page load.

**No Spline community scene ships, deliberately.** Two reasons, both hard: `<spline-viewer>` needs
an external CDN tag, which CLAUDE.md forbids in what ships; and a community scene is a stranger's
3D asset, which runs against this build's real-content rule for a client demo. The 3D is our own
self-hosted Three.js instead — a single brushed-bronze torus knot on warm black, one material
studied and lit, motion slow enough to read as still. The old hero scene's budget went here.

Bug caught in QA: the stage collapsed to 0×0 and the scene was rendering into a zero-size canvas —
both its children are absolutely positioned, so `margin-inline:auto` made the grid item
shrink-to-fit nothing. Fixed with an explicit `width:100%`. Then the camera was pulled back and the
knot shrunk so the form sits inside its frame with air rather than cropping against the mask.

### 4. Shader — the real Warp GLSL
**Compared against: LAVA Dental + Dr Grigoriak.**

The v3 shader was four stacked sines — improvised. Replaced with a step-for-step port of
paper-design's `warp.ts`: their `t = 0.0625 * (time + 118)` first-frame offset, `n1/n2` value
noise, `angle = n1 * TWO_PI` then `uv += 4*distortion*n2*(cos,sin)(angle)`, the iterative swirl
loop, their "stripes" base pattern, and their per-stop softness/step colour mixing. Two
adaptations, both documented in the source comment: their randomiser samples a shipped noise
texture (replaced with a hash value-noise so nothing extra has to ship), and their `fwidth()`
antialias term needs `OES_standard_derivatives` on WebGL1 (a small constant here). Palette is our
locked char/bronze/sand/cream in place of their `#160B0B/#C2402A/#F49D37/#FFE8C2` — same warm-dark
family, tuned toward warm brown rather than terracotta red. Opacity dropped `.55 → .4` and the
scrim strengthened so it reads as material under the copy, not as the subject.

**Liquid Metal and Background Paths were fetched and read but not shipped** — the section already
had its motion accent, and a second shader would have been decoration rather than a decision.

### 5. Before/after — exactly the spec'd interaction
**Compared against: Clinique 7's "Simply *Sculpted*" rail.**

Grayscale at rest → full colour on hover (fine pointers) or scroll-into-view/tap (coarse
pointers), animated `filter` transition over 1.15s. No slider, no drag. **Removed the 27 identical
"Hover to reveal" badges** — Clinique 7 states the interaction *once* for the whole rail and leaves
every photo clean; that is now a single small-caps line above the filters. Grid staggers (Clinique
7's cards sit at different vertical offsets, which is most of why theirs reads as a spread and a
3-up grid reads as a catalogue), cards got a 14px radius, and the rest state was re-graded — it had
`contrast(.97)`, i.e. contrast pulled *down*, which read as a faded photo rather than a deliberate
black-and-white. Now `grayscale(1) contrast(1.14) brightness(.94)`.

Verified programmatically, per tile: rest `grayscale(1)` → hover `grayscale(0)` → leave
`grayscale(1)`, veil `1 → 0 → 1`, and `.ba-hint` count = 0. (Note for future QA: headless Chromium
applies `:hover` styling but `Element.matches(':hover')` returns false, so assert on
`getComputedStyle`, not on `matches`.)

### 6. Typography — Fraunces put to work
Fraunces was already self-hosted from v3 but was only doing headline duty. Added the device that
4 of the 6 approved sites actually win on and that we were not using anywhere: **Clinique 7's
heading accent** — a clean roman first line with a much larger serif-italic second line stepped
down and inward (`We love / *your face*`, `Simply / *Sculpted*`). Applied as `.h-accent` to the
departments, showcase, cases and standard headings. LTR gets real Fraunces italic at
`opsz 72`; RTL has no italic cut for Arabic, so it takes the same step-in plus a sand/bronze tint —
the hierarchy reads, the mechanism differs. Fraunces stays gated to `[dir="ltr"]` throughout.

### 7. QA — what was actually run

- **Lang-leak sweep, bidirectional, 3 viewports** (390 / 768 / 1440, AR and EN, scrolling the full
  page so lazy content mounts): **0 leaks, 0px horizontal overflow, 0 console errors** in all six
  combinations.
- **Mobile bugs found and fixed:** the hero stacked footage-first, pushing the headline below the
  fold — copy now leads via flex `order`; and `.hl-split` is only a grid at ≥1024px, so below that
  the two halves ran together with no word space (`واحدللدقّة` / `ofprecision`) — fixed with a
  generated space.
- **Fallbacks, verified by simulation, not assumed:**
  - low-end device (`deviceMemory 2` / 2 cores) → three.js **not requested** (saves 655 KB),
    3D canvas stays off, static still visible
  - `Save-Data` on → three.js **and** the hero video both skipped
  - `prefers-reduced-motion` → both skipped, `--hx` pinned at 0, showcase `transform: none`
- **Payload:** 870 KB / 14 requests above the fold (index.html 210 KB — nginx gzips `text/html`
  by default, so ~35 KB on the wire; video 153 KB; fonts ~230 KB). Full-page-scrolled worst case
  2.4 MB, dominated by the 40+ lazy case/doctor photos.
- **Frame rate** (SwiftShader software GL in headless — a floor, not a phone-accurate number; a
  real GPU is far faster): mobile 60/60/60 fps idle / 3D / shader. Desktop 60 / 57 / 49.
  The shader's backing store is now capped at 0.85 DPR under 700px and 1.15 above, since it is a
  soft gradient field that does not need the pixels. Hero scroll handler: 200 steps in ~1 ms.

---

## v3 — typography, hero, motion, before/after (2026-08-21)

Aymean scored v2 6/10: competent but flat. `benchmark/design_learnings_multispecialty-clinic.md`'s
"Font + 3D decision" addendum named the two specific gaps — font pairing and 3D/motion effort —
and this pass is scoped to exactly that plus the before/after interaction, which the same file
flagged as built wrong (a drag slider instead of a hover/tap grayscale reveal). Scope stayed
inside the single `index.html` convention throughout — no framework, no CDN script tags. All new
CSS is hand-written into the second `<style>` block rather than new Tailwind utility classes, so
**`python build.py` was not needed this session** (verified: no new bracket-notation utility
classes were added to the markup, only pre-existing ones).

### 1. Typography — Fraunces added as the display face
Per the steal-list's single strongest signal (4 of 6 reference sites pair a serif display face
with a clean sans body). Self-hosted the same variable-opsz-axis Fraunces files this agency's own
site already uses (`agency-site/node_modules/@fontsource-variable/fraunces/files/`, copied — not
re-downloaded — into `fonts/`): `fraunces-latin-opsz-normal.woff2` +
`fraunces-latin-ext-opsz-normal.woff2` (+ the two italic cuts for the kicker). Wired with the
exact same pattern as `agency-site/src/index.css`: `font-optical-sizing:auto`,
`font-variation-settings:"opsz" …` tuned up further at headline sizes, gated to `[dir="ltr"] .display`
only — Arabic stays on IBM Plex Sans Arabic at 700 weight, per the addendum's own instruction (no
Arabic cut exists for Fraunces). `.kicker` runs Fraunces italic in **both** language modes because
its text (`Where Beauty Meets Precision`) is already Latin-only regardless of the active language.
The hero `<h1>` specifically got its own size ramp (`#top h1.display`, 2.55rem → 6.3rem across
breakpoints) — the sitewide `.display` utility sizes read as "clean" rather than "premium" at true
hero scale; Aventura/Clinique 7 both run hero type near full-viewport-height letterforms and the
old size didn't get near that register. Verified live: Fraunces' real stroke-contrast ball
terminals render correctly in EN mode; AR mode correctly stays on IBM Plex Sans Arabic bold.

### 2. Hero — real scroll-expansion video + kept the 3D ambient scene as a secondary layer
Added a new element below the hero copy: the real `media/clinic-tour.mp4` footage in a small
rounded card (`min(620px,84vw)`) that grows toward full shell width as the visitor scrolls, via a
CSS custom property (`--hx`, 0→1) driven by a scroll listener computing progress from the card's
own `getBoundingClientRect()` — ported from 21st.dev's **Scroll Media Expansion Hero**
(`@arunachalam/scroll-expansion-hero`). The component's Component.tsx tab is gated behind
in-page interaction that WebFetch cannot reach (confirmed — only the Usage.tsx demo snippet is
fetchable), so the scroll-progress-driven interpolation was hand-built rather than literally
copied; same underlying technique (scroll position → interpolated size/radius), not an improvised
unrelated effect. The existing Three.js fins-and-rings scene stays as the ambient background layer
behind the hero headline, unchanged — the two now read as one hero moment (abstract ambient motion
behind the copy, real footage breaking through below it) rather than two competing effects.
Gating: video `src` only requested when the card nears the viewport (same `IntersectionObserver`
pattern as the existing `#inside` video), skipped entirely on Save-Data/reduced-motion; the `--hx`
scroll-math loop is skipped on `prefers-reduced-motion:reduce`, and a CSS fallback under that same
media query pins the card at its resting size so nothing is left half-expanded.
**Bug caught and fixed during iteration:** the first version centered the card with
`position:relative;left:50%;transform:translateX(-50%)`, which only centers relative to the
viewport for *absolutely* positioned elements — for a `position:relative` block it shifts from the
element's own static position instead, so in RTL the card sat pinned to the right edge rather than
centered. Fixed by switching to real block centering (`margin:0 auto`, width computed against
`100%` of the parent rather than `100vw`).

### 3. Interior showcase — new section, real 3D tilt-on-scroll
Added a section between Departments and Inside showcasing `images/clinic-treatment.webp` (a real,
previously-unused clinic photo) with a scroll-driven `rotateX` + `scale` tilt, ported from
Aceternity/21st.dev's **Container Scroll Animation** (`@manuarora700/container-scroll-animation`)
technique — scroll progress through the section drives the card from a tilted-back resting state
to flat-and-full-scale, the same underlying mechanism as the well-known open-source component
(exact Component.tsx also not fetchable for the same SPA-tab-gating reason; rebuilt the documented
rotateX/scale-on-scroll-progress technique directly). Skipped on `prefers-reduced-motion`.

### 4. `#book` section — real WebGL shader background
Added a hand-written raw-GLSL ripple/plasma shader (`#bookshader`, no Three.js, no dependency),
ported from 21st.dev's **Warmth Ripple** (`@serafimcloud/warmth-ripple`) technique and retinted
from its demo red/amber palette to this site's own locked char/bronze/sand/cream values. Sits
behind the booking flow at low opacity with a scrim for text contrast — decorative only, the
booking flow's own markup/logic was not touched (out of scope this pass). Shares the same
`gpuCapable()` gate as the hero 3D (renamed from `heroCapable()` since it's now used by both),
plus its own `IntersectionObserver` so the render loop only runs while the section is on screen.
Spline (`@serafimcloud/splite`) was considered for a third 3D moment but **deliberately not
used**: its `<spline-viewer>` web component requires loading a script from an external CDN
(unpkg/jsdelivr), which breaks this build's own "no CDN tag ships" rule (see v2 §3) — not a time
shortcut, a real constraint. Background Paths was skipped as redundant once the shader already
filled the dark-section motion-accent role.

### 5. Before/after — rebuilt from a drag slider to the spec'd hover/tap grayscale reveal
v2 shipped a draggable divider, which `design_learnings`' before/after section explicitly says is
wrong. Rebuilt per spec: each of the 27 real cases now shows only the **after** (result) photo,
`grayscale(1)` at rest, animating to `grayscale(0)` with a `1.15s` filter transition on
`:hover`/`:focus-visible` (desktop) or on scroll-into-view for touch/coarse-pointer devices (an
`IntersectionObserver` at 55% threshold adds a `.ba-seen` class, only wired up for pointers that
fail the `(hover:hover) and (pointer:fine)` media query, so desktop keeps the deliberate
hover-to-reveal and touch gets scroll-triggered reveal) — plus a CSS `:active` fallback for any
device that supports neither hover nor `IntersectionObserver`. Removed: the `.ba-handle`/`.ba-grip`
drag markup, the `#i-drag` SVG symbol, the `pointerdown`/`pointermove`/keyboard-arrow drag JS, the
visible "Before"/"After" labels, and the "Drag the divider…" copy in both languages (replaced with
"hover/tap to reveal" copy). Doctor credit and treatment-category metadata per case is unchanged.
Verified programmatically (Playwright): `filter` reads `grayscale(1)` at rest, `grayscale(0)`
mid-hover, and back to `grayscale(1)` on mouse-leave — the reveal is a hover state, not a permanent
toggle, on fine-pointer devices as specified.

### 6. Departments — numbered rail upgraded from a corner tag to a structural device
Per the steal list's second-strongest device (Aventura/Clinique 7/Dr Grigoriak numbered
sequences). Numerals went from `text-[.8rem]` corner tags to `clamp(2.5rem,5.5vw,4.25rem)`
Fraunces-on-LTR/IBM-Plex-Serif-on-RTL numerals with a `／04` fraction suffix (echoing Aventura's
"01-06" rail), plus a continuous bronze connecting spine (`.dept-grid::before`, desktop only)
running top-to-bottom through all four department blocks at the numeral column's x-position. Real
4 departments used, not padded to a round number — the clinic genuinely has 4 (dentistry,
dermatology/aesthetics, laser, cosmetic-surgery-by-consultation) and the surgery entry's honest
"by consultation" framing was left untouched.

### Iteration record (screenshots via a throwaway Playwright script — the Browser pane's
screenshot compositor was intermittently unavailable this session, matching the known issue noted
in the brief)
- **Hero, round 1:** built the scroll-expansion video + kept 3D scene. Screenshot showed the video
  card pinned to the right edge (RTL) instead of centered, and the headline reading merely "clean"
  next to Aventura/Clinique 7 screenshots at the same viewport width — their display type runs
  roughly 2× the size ours did.
- **Round 2:** bumped `#top h1.display` to a dedicated size ramp (2.55rem→6.3rem), added
  box-shadow/rounded-corner polish and more top margin to the video card. Screenshot showed the
  headline now reading at real editorial confidence — but the video card was still off-center.
- **Round 3:** found and fixed the `left:50%`/`position:relative` centering bug (see §2 above).
  Re-shot in EN mode specifically to confirm Fraunces was actually rendering (it was — visible
  ball-terminal stroke contrast on the headline) and that the real video frame (not just the
  poster) loads and plays inside the expanding card.
- **Round 4:** tightened bottom spacing so the card doesn't crowd the department strip below it;
  confirmed no horizontal overflow and no console errors at 375/768/1440/1920px.
- **Departments, round 1:** built the numeral rail; already read close to the Aventura/Clinique 7
  register on first pass.
- **Round 2:** enlarged the icon (1.55rem→1.9rem, thicker stroke) since the giant serif numeral
  made the original thin small icon look mismatched in weight next to it.
- **Rounds 3–4:** verified at mobile width (rail correctly hidden below `lg:`, no overflow) and
  re-confirmed against the EN screenshot alongside the hero fixes — no further changes needed.
- **Cases (before/after), round 1:** built the hover/tap grayscale rebuild; grid read correctly
  desaturated with the hint label.
- **Round 2:** added a subtle `scale(1.015)` + veil-fade on reveal so the color transition reads as
  a deliberate "coming into focus" moment rather than a flat filter flip.
- **Round 3:** verified real hover behavior programmatically (grayscale 1→0→1 across
  hover/hover/mouse-leave) rather than trusting the CSS by inspection alone.
- **Round 4:** verified the mobile scroll-reveal path separately — cases scrolled past during a
  full-page pass correctly kept their `.ba-seen` class (color stays revealed once scrolled into
  view, matching "scroll-into-view" not "in-view-only").

### QA — run for real this session, all passing
- **Responsive sweep** at 375/768/1440/1920px (Playwright): `scrollWidth === innerWidth` at every
  width, 0 console/page errors.
- **Bidirectional AR/EN lang-leak sweep**, same method as v2: 0 leaked `[lang-en]` nodes in AR
  mode, 0 leaked `[lang-ar]` nodes in EN mode, 315 lang-tagged nodes visible on each side
  (symmetric).
- **Capability gating, verified live (not just asserted) for every new heavy element:**
  - `prefers-reduced-motion:reduce`: `#hero3d` never activates, `#bookshader` never activates,
    `#heroVid.src` and `#clinicvid.src` both stay unset, and `.reveal` content computes
    `opacity:1` (nothing left invisible).
  - Simulated low-end device (`navigator.deviceMemory=2`, `hardwareConcurrency=2`):
    `#hero3d`/`#bookshader` never activate, `#herostill` (the static fallback) stays on screen.
  - Both new elements reuse the renamed shared `gpuCapable()` gate (was `heroCapable()`) rather
    than duplicating the device/connection checks.
- **Before/after:** hover-to-reveal confirmed on desktop via Playwright (`filter` transitions
  grayscale↔color on hover/mouse-leave); scroll-into-view reveal confirmed on a 375px viewport via
  a full-page scroll pass (cases keep `.ba-seen` once scrolled past, matching spec).

---

## v2 — what changed vs the 6/10 version (2026-08-20)

Aymean reviewed v1 live and scored it 6/10: competent but flat. Everything below is an
in-place upgrade of the same file, not a rebuild.

### 1. Google reviews — were effectively invisible, now a section of their own
The 4.7★ / 270 rating existed in v1 but only as one line near the bottom of the contact block,
which is why it read as "not there at all." **Re-verified independently this session** via the
Apify Google Maps scraper — place ID `ChIJYZGQte3RwxURJOWYE4-NkP0`, whose `fid`
(`0x15c3d1edb5909161:0xfd908d8f1398e524`) matches the `ftid` in the clinic's own Google short
link, so it is definitively the same listing. It is real, not carried over on trust.

Now: a rating badge above the fold in the hero, a figure in the stats band, and a full
`#reviews` section carrying the **real star distribution** (242 / 7 / 4 / 3 / 14 — the fourteen
1★ reviews included, not hidden), eight real reviews with real reviewer names and dates, and
Google's own auto-generated keyword tags with their counts.

### 2. Booking system — built (v1 had only a flat contact form)
Three steps: department → day + preferred time → name and mobile, with a running summary.
- Days come from the clinic's **real** opening days; Friday is disabled because they are
  genuinely closed, and today is disabled once the 21:00 slot has passed.
- Slots span their real 10:00–22:00 window.
- **Honesty, deliberately:** step 2 says in both languages that this is *your preferred time,
  not the clinic's calendar*. On submit it opens a real WhatsApp chat to +966543333657 with the
  request written out — nothing auto-sends. The confirmation screen states plainly
  **"لم يُحجز الموعد بعد" / "The appointment is not booked yet"** and that it is only confirmed
  once the clinic replies.
- The "add to calendar" button is framed as a **personal reminder in the visitor's own
  calendar**, explicitly disclaiming any link to the clinic's calendar. Google Calendar template
  link, `ctz=Asia/Riyadh`, real address in the location field.

### 3. Motion — real 3D plus scroll-driven animation
- **Three.js (self-hosted, `vendor/three.module.min.js`)** drives the hero: eleven vertical
  fins in bone/cream tones with two brass rings and a warm light bar travelling across them,
  plus pointer parallax. It is a deliberate abstraction of *their own reception* — the backlit
  onyx panels, the slatted wood, and the framed brass sign above the desk.
- **GSAP + ScrollTrigger (self-hosted)** handle section reveals, parallax on the clinic
  footage, and the stat counters. Counters carry their real values in the raw HTML; JS only
  animates up to them.
- Both libraries are local files. No CDN tag ships.

### 4. Instagram video — used (v1 ignored it)
`media/clinic-tour.mp4`, 5s, **153 KB**, muted/looping with a poster fallback. Cut from the
clinic's own reel: exterior at night → slow pan across the reception with the brass sign →
the door plate of room 03. Slowed 2.5× with motion interpolation so it reads as a deliberate
camera move. The branded header, phone-number footer strip and doctor-name badge were cropped
off. No patient faces appear in it.

### 5. Doctor photos — real, and verified one by one
v1 used typographic initial cards. All ten now carry the doctor's **own Instagram profile
photo**, which is the only name-to-face match that can be verified with certainty (the account
*is* the person). Dr. Muaz's was cropped to remove his Invisalign branding strip; Dr. Baraa's
was cropped tighter to read as a portrait.

### 6. Before/after — grayscale-to-colour reveal
Replaced v1's hover-swap with a draggable divider: the "before" photo renders desaturated and
the "after" returns to full colour as it is uncovered. Drag, hover-scrub on a fine pointer, and
arrow-key support. RTL-aware — "before" sits on the right in Arabic, on the left in English,
matching its own label in each direction. Same 27 real cases, each still credited to the doctor
the clinic itself credited.

### 7. Deeper research — new real facts found this session
All of these were missing from v1 and are now on the site:
- **Opening hours: Sat–Thu 10:00–22:00, closed Friday.** v1 left hours out as unverifiable;
  they are on the clinic's Google Business listing (updated by them ~8 weeks ago).
- **Al-Humaidhi Plaza (الحميضي بلازا)** — the actual building, from the Google `locatedIn`
  field and corroborated by a neighbouring listing's address.
- **Valet parking** — mentioned by name in roughly ten reviews and surfaced by Google as its
  own keyword tag (6). It appears nowhere on their Instagram. Probably the single most
  "built-for-them" detail on the page.
- **Wheelchair accessible** entrance, seating, restroom and parking (Google attributes).
- **Registered on Google as a woman-owned business** (Google attribute).
- **Official sponsor of the "لمسة ملكة" beauty expo, Hilton Jeddah, March 2025** — from their
  own TikTok, 556K plays.
- **Payments:** mada, credit, NFC, plus tabby / tamara / Madfu instalments.
- **Real credentials per doctor**, from each doctor's own verified account — NYU and the Royal
  College of Surgeons in Ireland (Kazim), Invisalign Platinum Elite and training in France
  (Al-Zahrawi), ICOI fellow and DGZI member (Baraa), CPHQ (Tharaa), a Barcelona master's
  (Eman), American Academy of Aesthetic Medicine board (Sally).
- **Individual Google ratings** for the doctors who hold their own listings: Dr. Muaz
  5.0★/188, Dr. Abir 4.9★/67.
- **Splendor X** named as the laser platform — from a patient's own Google review.

### 8. Copy — rewritten throughout
Register per `benchmark/design_learnings_multispecialty-clinic.md`: informative, non-salesy,
credential-forward. Doctor bios are written with real voice off real facts rather than "meet
our team" filler — e.g. Dr. Fatma's notes that patients describe her talking them *out* of
procedures they asked for, which is what her reviews actually say. Headline is built on the
clinic's own tagline ("Where Beauty Meets Precision") rather than a generic service list.

---

## Deliberately left out — could not be verified, do not invent on the call

- **Commercial registration number (سجل تجاري).** Genuinely searched: three web searches, the
  Facebook page's About, Maroof, and the footer graphics baked into their own posts. Not
  publicly findable. Left out rather than guessed. **Worth asking the client directly** — it is
  a one-line footer addition once they supply it.
- **Email address.** None exists publicly anywhere.
- **Founding / opening date.** Their Instagram feed only reaches back to 2026-03; the opening
  was earlier (a third-party TikTok of the opening event dates to around Oct 2024) but no
  date is stated by them, so none is claimed.
- **Cosmetic surgery procedures.** The department is real (it is in their own bio) but they have
  never published a surgical case or named a surgeon, so it is described only at the level their
  bio supports, with a consultation CTA.
- **Dr. Mahi Khalil** has a Google listing inside the complex (3.3★/6) but the clinic never
  features her, so she is not on the team roster.

---

## QA — run for real on 2026-08-20, all passing

Automated through a real Chromium browser (Playwright), not a code re-read.

- **Responsive at 375 / 768 / 1440 / 1920 px:** no horizontal overflow at any width, no JS or
  console errors, every scroll reveal fires, no broken images.
- **Bidirectional language sweep:** 0 leaked `[lang-en]` nodes in AR mode and 0 leaked
  `[lang-ar]` nodes in EN mode, 339 visible nodes on each side (symmetric). Title, placeholders,
  day names and slot labels all swap.
- **Images:** all 10 doctor photos load at 640×640 and all 54 case images load; 0 broken.
- **Links:** all WhatsApp links resolve to the real +966543333657; both `tel:` links are the
  two real numbers; every `target="_blank"` carries `rel="noopener"`; 0 dead internal anchors.
- **Booking flow completed end-to-end as a patient:** empty submit is rejected with a message
  and fires no popup; a filled form opens a real WhatsApp chat carrying department, preferred
  day, preferred time, name, mobile and enquiry; the Google Calendar link carries the correct
  date/time, `ctz=Asia/Riyadh` and the real address.
- **Before/after:** verified the grayscale half and its label sit on the same side in *both*
  directions (this was inverted on first build and was fixed).
- **Video:** not requested until the band nears the viewport, then plays muted and looping at
  608×770 with the poster fading out.
- **Map:** the embed URL was fetched directly and resolves to 21.5662954, 39.1427256 — the exact
  coordinates on their Google place — and contains both "براكسس" and "Dpraxis".

### Performance — measured, given the new 3D and video weight

| | |
|---|---|
| First Contentful Paint | **272 ms** |
| Largest Contentful Paint | **272 ms** |
| DOMContentLoaded / load | 236 ms / 338 ms |
| Transfer at load | **521 KB** (document 176, fonts 171, script 113, images 60) |
| After idle, capable device | 1,176 KB (three.js 655 KB lazily added) |
| Text assets gzipped | 945 KB → **249 KB** (nginx gzip now shipped in the Dockerfile) |

The 3D never blocks first paint — it is dynamically imported on `requestIdleCallback`, behind
the static hero image, and only swapped in once it is actually rendering.

**Capability gating, verified live:**
- Low-end mobile (deviceMemory 2, 2 cores): three.js **never requested**, canvas never
  activates, the static hero image stays.
- `prefers-reduced-motion: reduce`: three.js not requested, video not requested, and all
  content is revealed rather than left invisible.
- Slow connections (`effectiveType` 2g/3g) and Save-Data: 3D skipped.
- If GSAP fails to load at all, a 2.5s failsafe reveals everything rather than leaving a blank
  page.

---

## Notes for whoever picks this up

- Build step: `python build.py` recompiles Tailwind from `src/input.css` + `tailwind.config.js`
  and re-inlines it into the `<style id="tw">` block. The shipped `index.html` is self-contained
  apart from `vendor/`, `images/`, `fonts/` and `media/`, all local.
- `Dockerfile` now also copies `media/` and `vendor/`, and installs `nginx-gzip.conf` — without
  it nginx ships the 655 KB three.js and the 177 KB HTML uncompressed.
- The hero fallback `images/hero-still.webp` is a render of the actual Three.js scene, captured
  from the live canvas, so the static and animated versions match. If the scene is ever changed,
  re-capture it rather than leaving the old still.
- Every case image is a crop of a photo the clinic published itself; the gold branded frame,
  doctor-name strip and contact footer were cropped off, with the clinical photograph itself
  untouched.
- An earlier session on 2026-08-20 wrote a **wrong** CLAIMED.md here identifying this business
  as Dr. Ameer Al-Zahrawi's orthodontic practice — a different business that merely lists
  "مجمع دي براكسس" as its building address. Corrected. Dr. Ameer does genuinely practise at
  De Praxes (the clinic's own account credits him on published cases), so he is on the roster
  on that basis.
