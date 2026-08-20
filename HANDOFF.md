# Handoff — مجمع دي براكسس الطبي / Dpraxis Beauty Clinic (De Praxes Clinic)

Niche: multi-department clinic — dentistry + dermatology/aesthetics + laser + cosmetic surgery
Primary language: Arabic (Arabic-first, full AR/EN toggle)
Old site: **none — Instagram-only.** No business website exists anywhere. The bio link
resolves to a Google Maps pin and a Linktree, and the Linktree contains only social
profiles plus a WhatsApp click-to-chat shortener (`iwtsp.com/966543333647`) — no real
site behind it. Confirmed by resolving the bio link all the way down, per the
hidden-website rule. Reconstructed entirely from the clinic's own verified Instagram,
its Linktree, and its Google Maps place.
New demo (local): demos-depraxis/index.html
GitHub repo: https://github.com/Aymean/depraxis-demo (public, pushed)
Intended live URL: https://depraxis.zaylogear.com/
Real WhatsApp: +966543333657 (the number in the official Instagram bio's wa.me link — used for every WhatsApp CTA and the booking flow)
Real phone: +966 54 333 3657 and +966 54 333 3647 (both appear in every one of their posts and in their own post footers)
Real email: **none found** — no email address exists on Instagram, the Linktree, Facebook, or Google Maps
Socials:
- Instagram: https://www.instagram.com/dpraxisclinics.sa (verified badge, 14,506 followers, 680 posts)
- TikTok: https://www.tiktok.com/@dpraxis.clinics
- Snapchat: https://www.snapchat.com/add/dpraxisclinics
- Facebook: https://www.facebook.com/p/Dpraxis-Beauty-Clinics-61570277572734/

## Key real facts used

- **Google rating 4.7★ from 270 reviews** — read off Google's own place card for this
  exact listing ("عيادات دي براكسس | Dpraxis Clinics"). Also in the JSON-LD
  `aggregateRating`. This is the strongest trust signal they have and it is invisible
  to anyone who isn't already on Google Maps.
- **Four departments**, taken verbatim from their own Instagram bio:
  `أسنان | جلدية | ليزر | جراحة تجميل`. Their own tagline, also from the bio:
  *"Where Beauty Meets Precision"*.
- **10 named doctors**, each with the exact specialty the clinic itself writes in its
  case captions (dentistry: Ahmed Kazim, Muaz Lababidi, Ameer Al-Zahrawi, Baraa
  Lababidi, Abir Zandaki, Alaa Lotfy, Tharaa Ahmed Baath — dermatology/aesthetics:
  Eman Essam, Fatma Ahmed Youssef, Sally Mahmoud Hamdy). Each card links to that
  doctor's real Instagram handle.
- **27 documented before/after cases**, each credited to the doctor the clinic itself
  credited in the caption. Sourced from 80 of their real posts.
- **Address:** طريق الأمير سلطان، حي الخالدية، جدة 23423 (Prince Sultan Road,
  Al-Khalidiyyah). Confirmed from their posts and their Google place.
- **Instalment options:** tabby, tamara, Madfu — from their own post and their own post
  footer graphic.

## New sections added vs old site

They had no site at all, so everything is new. What matters most:

- **A real before/after case gallery (27 cases), filterable by department**, with the
  treating doctor named on every case. On Instagram these are buried in a 680-post
  grid; here they are one scroll and one click.
- **A proper department structure** — four departments with their own real service
  lists, rather than one flat "clinic" page.
- **A named medical team with credentials**, which currently exists nowhere except
  scattered across post captions.
- **The 4.7★ / 270-review rating surfaced**, which today only shows if someone happens
  to open Google Maps.
- **A numbered technology rail** (Invisalign, E-max, laser gum contouring, collagen
  stimulators, Hydrafacial/carbon laser, PicoWay) — all six named in their real posts.
- **A "how a visit works" section** and a booking form that opens a real WhatsApp chat
  to +966543333657 with the request pre-written (department, name, mobile, preferred
  time, enquiry). Nothing is auto-sent; the patient reviews and sends it themselves.
- Meta/OG/Twitter tags + `MedicalClinic` JSON-LD with the real name, address, phone,
  rating, and `sameAs` socials, so a link shared in a DM previews properly.

## Deliberately left out (could not be verified — do not invent on the call)

- **Opening hours.** Two search-engine summaries claimed 2:00 PM – 10:00 PM, but that
  is not stated on their Instagram, Linktree, or their Google place card, so it is not
  on the site. Worth asking the client directly and adding.
- **Email address.** None exists publicly anywhere.
- **Founding year / patient counts / years of experience.** Never stated by them.
- **Cosmetic surgery procedures.** The department is real (it is in their own bio), but
  they have never posted a surgical case or named a surgeon, so that department is
  described only at the level their bio supports, with a consultation CTA.
- **Doctor portraits.** Their posts credit a doctor by name but the person pictured is
  usually the *patient*, so no face on this site is labelled with a doctor's name.
  Team cards are typographic instead. If the client supplies real doctor headshots,
  those cards are the place to drop them in.

## Notes for whoever picks this up

- An earlier session on 2026-08-20 wrote a **wrong** CLAIMED.md here, identifying this
  business as Dr. Ameer Ghiath Al-Zahrawi's orthodontic practice. That was a different
  business that merely lists "مجمع دي براكسس" as its building address. Corrected.
  Separately: Dr. Ameer Al-Zahrawi *does* genuinely practise at De Praxes — the
  clinic's own verified account credits him on three published cases — so he is
  included in the team roster on that basis.
- Every image on the site is a crop of a photo the clinic published itself. The clinic
  posts before/after cases inside a gold branded frame with a doctor-name strip and a
  contact footer; those frames were cropped off so only the clinical photograph
  remains. Three cases were dropped on the way: two where the before/after showed no
  readable difference, and one where the clinic's own privacy bars covered the
  patient's eyes.
- Build step: `python build.py` recompiles Tailwind from `src/input.css` +
  `tailwind.config.js` and re-inlines it into the `<style id="tw">` block in
  `index.html`. The shipped `index.html` is fully self-contained (no CDN).

## QA — run for real on 2026-08-20, all passing

Checked in a real browser at 375 / 768 / 1440 px, in both Arabic and English:

- Bidirectional language sweep, scripted: 0 leaked `[lang-en]` nodes in AR mode and
  0 leaked `[lang-ar]` nodes in EN mode, 258 visible nodes on each side. Title,
  `<select>` options, and all form placeholders swap too.
- No horizontal scrollbar at any of the three widths in either language.
- All 62 images load (0 broken), no leftover watermark, baked-in text, or brand frame
  on any of them — every crop was reviewed visually, not just by code.
- 0 dead internal anchors, 0 JS/console errors, every `target="_blank"` carries
  `rel="noopener"`.
- Animated counters carry their real values (4 / 10 / 27) in the raw HTML.
- All 4 WhatsApp links point at the real +966543333657; both `tel:` links are the two
  real numbers.
- Booking flow completed end-to-end as a patient: empty form is rejected with a
  message; a filled form opens a real WhatsApp chat carrying name, mobile, department,
  preferred time, and enquiry.
- Case gallery: hover reveals the "after" image on desktop (verified visually), tap
  reveals it on a real touch context; department filters return 17 / 8 / 2 / 27.
- Mobile: bottom CTA bar docks to the viewport bottom and does not cover content, the
  floating WhatsApp bubble is correctly hidden at that width, the menu opens and closes
  on selection.
- Sticky nav turns solid cream on scroll and never covers the h1.
- Map: Google's own embed resolves to the correct place — the pin, the name, the
  address, and the 4.7★/270 rating all match.
