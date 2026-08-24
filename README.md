# Tanner Johnson Media — Conversion Landing Page

A single-page, no-build landing page for real estate photography and video, built to turn
existing clicks and impressions into booked shoots.

```
index.html     markup + copy + pricing tables
styles.css     design system (colors, type, layout) — photo slots at the top
script.js      Build Your Shoot recommender, pricing tabs, nav, CTA tracking
favicon.svg    tab icon
assets/        drop your photography here
```

No framework, no build step, no dependencies. Open `index.html` or drop the folder on
Netlify / Vercel / GitHub Pages / any host.

---

## The funnel

Every section has one job: move the visitor toward a phone call.

| # | Section | Job |
|---|---------|-----|
| 1 | Hero | Promise + two CTAs (Build Your Shoot / Call) above the fold |
| 2 | Proof strip | Instant credibility before the visitor evaluates price |
| 3 | Why agents rebook | Handle the "is this worth it" objection |
| 4 | Recent work | Show, don't tell — then push back into the funnel |
| 5 | Video | Showcases the high-ticket product right before pricing |
| 6 | **Build Your Shoot** | Mid-page conversion engine: self-qualifies the lead and captures contact info |
| 7 | Pricing | Transparency kills the "request a quote" drop-off |
| 8 | How it works | Removes friction/uncertainty about the process |
| 9 | Testimonials | Social proof right before the final ask |
| 10 | FAQ | Handles the last objections (weather, prep, usage rights) |
| 11 | Final CTA | Call / text / email |
| — | Sticky mobile bar | Call button always one tap away after 560px of scroll |

Phone (`720-587-9516`) and email (`tannerjohnsonmedia@gmail.com`) appear in the header,
hero, every pricing card, the builder result, the final CTA, the footer, and the sticky
mobile bar — **17 tap-to-call/text/email links total**.

---

## Build Your Shoot

Four questions — square footage → media type → add-ons → contact info — then an instant
package recommendation with a real price, plus Call / Email / Text buttons pre-filled with
the visitor's answers.

Why it converts: it replaces "request a quote" (a dead end that requires you to reply
before anything happens) with an answer on the spot, and it captures the lead's name,
phone, email, and address on the way there.

**Recommendation logic** (all in `script.js`, top of file):

| Property size | Photos only | Photos + video | Video only |
|---|---|---|---|
| Under 2,000 sq ft | Basic Photography $245 | Basic Photo & Video $500 | Walkthrough Video $350 |
| 2,001–4,000 | Premium Photography $325 | Premium Photo & Video $750 | Premium Cinematic $500 |
| 4,001–6,000 | Ultimate Photography $500 | Ultimate Photo & Video $1,100 | Ultimate Cinematic $700 |
| 6,001–8,000 | Ultimate Photography $525 | Ultimate Photo & Video $1,200 | Ultimate Cinematic $700 |
| 8,001–10,000 | Ultimate Photography $550 | Ultimate Photo & Video $1,300 | Ultimate Cinematic $700 |
| 10,000+ | Custom quote | Ultimate Photo & Video $1,500 | Ultimate Cinematic $700 |

Selecting **aerial/drone** upgrades to the tier that includes it. **Twilight** adds $250 to
the total. **Rush** adds a note rather than a price, so you keep that conversation on the call.

To change pricing, edit the constants at the top of `script.js` **and** the matching
numbers in the Pricing section of `index.html`.

---

## Adding your photos

The page is already wired to five specific photos. Save each file into `assets/`
with the **exact filename** below and it drops straight into place — no code changes.

| Filename | Which photo | Where it appears |
|---|---|---|
| `assets/hero-twilight.jpg` | White farmhouse at twilight, windows glowing, sunset sky | Full-bleed hero background |
| `assets/great-room.jpg` | Vaulted great room, stone fireplace, open kitchen | Gallery — large tile, top left |
| `assets/primary-bath.jpg` | Primary bath, wood vanity, soaking tub, window to the pines | Gallery — top right |
| `assets/townhomes.jpg` | Modern stone townhomes with rooftop decks | Gallery — bottom left |
| `assets/aerial-foothills.jpg` | Aerial of the mountain home above the pine valley | Gallery — bottom right |
| `assets/og-image.jpg` | Any strong shot, cropped to 1200×630 | Link preview when the page is shared |

The twilight exterior is the hero on purpose: warm windows against a dusk sky is the
single most stopping image in the set, and it doubles as proof for the $250 twilight
add-on. The aerial does the same job for the drone claim in the trust bar.

**Before you upload:** resize to about 2000px on the long edge and compress (Squoosh,
ImageOptim, or TinyJPG). Straight-off-the-camera files are 8–15MB each and will make the
page slow, which costs you conversions — the exact opposite of the point.

Until the files exist, each tile shows a dark gradient with its caption. No broken image
icons, no collapsed layout — it just looks unfinished rather than broken.

To swap a photo later, either overwrite the file or change the `src` in the gallery
markup in `index.html`. The hero is a CSS background — its path is the `--photo-hero`
variable at the top of `styles.css`.

---

## Adding your videos

Three players are already wired up. Save each file into `assets/` with the exact
filename below — same as the photos.

| Filename | What it is | Behavior on the page |
|---|---|---|
| `assets/video-featured.mp4` | Your best horizontal video | Large player at the top. Click to play, with controls |
| `assets/video-listing.mp4` | Your second horizontal video | Smaller player below left. Click to play, with controls |
| `assets/video-vertical.mp4` | The vertical social cut | Phone-shaped player, loops silently while on screen, with an unmute button |
| `assets/video-featured-poster.jpg` | A still frame from the featured video | The image shown before play is pressed |
| `assets/video-listing-poster.jpg` | A still frame from the second video | Same |
| `assets/video-vertical-poster.jpg` | A still frame from the vertical | Same |

**Posters matter.** Without them the players sit as black rectangles until someone
clicks. Export one good frame from each video as a JPG — it's the thumbnail that
decides whether anyone presses play at all.

The captions on each player currently read "Cinematic listing film," "Walkthrough
video," and "Social vertical cut." Edit them in the `<figcaption>` tags in `index.html`
so they name what you actually shot.

### Compress before you upload — this one is not optional

Straight-from-the-editor exports are 200MB–2GB. GitHub **hard-blocks any file over
100MB**, and even a 60MB video will make the page unusable on an agent's phone.

Target: **under 25MB per video.** Under 10MB for the vertical.

Easiest route is [HandBrake](https://handbrake.fr) (free, Mac/Windows):

1. Open your video → Preset: **Web → Vimeo YouTube HQ 1080p60** (or 720p if the file is still large)
2. Video tab → set **Constant Quality to RF 24** (higher number = smaller file)
3. Web Optimized → **checked**. This is what lets the video start playing before it fully downloads.
4. Format: **MP4**
5. Start Encode, check the output size, raise RF and re-run if it's still over 25MB.

If you're comfortable in a terminal, this does the same thing:

```
ffmpeg -i input.mov -c:v libx264 -crf 24 -preset slow -vf "scale=-2:1080" \
       -c:a aac -b:a 128k -movflags +faststart output.mp4
```

Export a poster frame at the same time:

```
ffmpeg -i output.mp4 -ss 3 -frames:v 1 -q:v 3 output-poster.jpg
```

### If a video won't get under 25MB

Your Ultimate Cinematic package is a 3–5 minute film — that will not compress to 25MB
at a quality worth showing. For anything over roughly 90 seconds, host it on **Vimeo**
rather than in this repo, and embed it.

Use Vimeo, not YouTube: when a YouTube embed finishes it shows recommended videos,
including your competitors', on your own landing page. Vimeo's paid tiers let you turn
branding and suggestions off entirely.

Ask and the players can be swapped to Vimeo embeds — the layout stays the same.

Until the files exist, each player shows its gradient frame and caption. No broken
controls, no black boxes.

---

## Before you launch — verify these

I wrote conversion copy around industry-standard claims. **Confirm each one is true for
your business, or edit it.** Every item below is a specific promise a client can hold you to.

- [ ] **"Next-business-day delivery" / "24-hr"** — hero, value props, every package, FAQ. Change if your turnaround differs.
- [ ] **"FAA licensed drone"** — hero trust bar and FAQ. Remove if you aren't Part 107 certified.
- [ ] **Service area** — "Denver Metro & Front Range" appears in the hero, footer, and schema. Update to your actual market.
- [ ] **Brokerage logos** (Compass, RE/MAX, etc.) in the proof strip — these are placeholders. Only display brokerages you've actually shot for, and check their brand-usage rules first.
- [ ] **Testimonials** — the three quotes are placeholder copy. Replace with real, permission-granted reviews before launch. Fabricated reviews are an FTC problem, not just a credibility one.
- [ ] **Basic Photography package contents** — your product list didn't show the image count, so the card says "professionally edited HDR images." Add the number.
- [ ] **"Unlimited listing-marketing usage" / usage rights FAQ** — confirm this matches your actual license terms.
- [ ] **Weather reshoot policy** (FAQ) — confirm you offer free rescheduling.
- [ ] **Video captions** — the three player labels are guesses. Rename them to match what you actually shot.
- [ ] **Package tiers vs. your booking platform** — the builder maps small/standard/large homes to Basic/Premium/Ultimate. If you'd route a 3,000 sq ft listing differently than the table above, adjust `recommend()` in `script.js`.

---

## Tracking conversions

Every call, text, and email button carries a `data-cta` attribute, and `script.js` fires
events to `dataLayer` (Google Tag Manager) and `gtag` (GA4) if either is installed — and
does nothing harmful if neither is:

| Event | Fires when |
|---|---|
| `contact_call` | Any tap-to-call button |
| `contact_text` | Any SMS button |
| `contact_email` | Any mailto button |
| `cta_click` | In-page CTA (e.g. hero → builder) |
| `builder_step` | Each builder step completed — shows you where people drop off |
| `builder_complete` | Builder finished, with package name, value, sq ft, and media type |

Add your GA4 or GTM snippet to `<head>` in `index.html` and mark `contact_call` and
`builder_complete` as conversions. `builder_step` is the one to watch: if most people quit
at step 4, the contact form is the friction point.

---

## Notes

- Responsive from 320px up; no horizontal scroll at any width.
- Keyboard accessible, `prefers-reduced-motion` respected, skip link, ARIA on tabs/nav/steps.
- `LocalBusiness` structured data in `<head>` — update `areaServed` and add your real address if you have a public one.
- The builder runs entirely in the browser. Nothing is submitted to a server; the lead
  reaches you when the visitor taps Call, Text, or Email. If you'd rather have submissions
  land in your inbox automatically, wire the form to Formspree, Netlify Forms, or your CRM.
