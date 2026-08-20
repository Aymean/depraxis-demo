# Handoff — مجمع دي براكسس الطبي / Dpraxis Beauty Clinic (De Praxes Clinic)

Niche: multi-department clinic — dentistry + dermatology/aesthetics + laser + cosmetic surgery
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
