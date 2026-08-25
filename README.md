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
| 9 | Book online | Self-serve path for agents who don't want to call |
| 10 | Testimonials | Social proof right before the final ask |
| 11 | FAQ | Handles the last objections (weather, prep, usage rights) |
| 12 | Final CTA | Call / text / email |
| — | Sticky mobile bar | Call button always one tap away after 560px of scroll |

Two conversion paths run in parallel:

- **Call / text / email** — header, hero, builder result, booking section, final CTA,
  footer, and the sticky mobile bar.
- **Book online** — the portal at `portal.tjohnsonmedia.com/portal`, linked from the
  header, every pricing card, the builder result, its own section, the final CTA, and the
  footer (11 links). All open in a new tab so the landing page stays behind them.

Pricing cards point at the portal rather than the phone, since the button says "Book this
package" — clicking it should book the package. The phone number stays prominent
everywhere else.

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

Package *contents* live in two places too: the `<ul class="ticks">` lists in the Pricing
section of `index.html`, and the `r.includes` arrays in `recommend()` in `script.js`.
Change both, or the builder will promise something different from the pricing card.

---

## Photos

All nine uploaded photos are in use. Current placement:

| Position | File | Label shown |
|---|---|---|
| Hero background | `hero-twilight.jpg` | — |
| Gallery, lead tile | `twilight-backyard.jpg` | Twilight |
| Gallery | `great-room.jpg` | Interior HDR |
| Gallery | `primary-bathroom-1.jpg` | — |
| Gallery | `twilight-front.jpg` | Twilight |
| Gallery, triple row | `kitchen.jpg`, `living-room.jpg`, `primary-bathroom.jpg` | — |
| Gallery | `condos.jpg` | Condo & multifamily |
| Gallery | `aerial-foothills.jpg` | Aerial & drone |
| Social preview | `og-image.jpg` | generated from `twilight-backyard.jpg` |

Only five tiles carry a label, and they're the ones that sell an add-on — twilight,
aerial, and the condo work. Labelling every interior would just be noise.

To swap a photo, either overwrite the file or change the `src` in the gallery markup in
`index.html`. Update the `alt` text at the same time — it's what Google Images reads and
what a screen reader announces. The hero is a CSS background: its path is the
`--photo-hero` variable at the top of `styles.css`.

Adding more later: each tile is a `<figure class="shot g-x">` with a grid column defined
in the gallery block of `styles.css`. Keep the alternating wide/narrow rhythm rather than
making every tile the same size.

Resize to about 2000px on the long edge and compress before uploading — the current
batch is 230–400KB each, which is the right range.

---

## Videos

The three videos are hosted on YouTube and embedded click-to-play.

| Player | Video ID | Source |
|---|---|---|
| Featured (large, top) | `BbEcHWOQ2Ws` | youtu.be/BbEcHWOQ2Ws |
| Walkthrough (below left) | `nl0M-cyh24c` | youtu.be/nl0M-cyh24c |
| Social vertical cut | `tXBJVYaexcM` | youtube.com/shorts/tXBJVYaexcM |

To swap a video, change the `data-yt` attribute on that player in `index.html` to the
new video's ID — the part after `youtu.be/` or `/shorts/`, not the whole URL.

### Why click-to-play instead of a normal embed

Three live YouTube iframes load well over a megabyte of Google's player JavaScript on
every single visit, including for the majority of visitors who never press play. That's
the difference between a landing page that feels instant and one that doesn't, which
directly affects conversions.

So each player shows a thumbnail with a play button, and the real embed loads only when
someone clicks. Same result, none of the weight.

### How the thumbnails work

Each player tries three sources in order and uses the first that loads:

1. `assets/video-featured-poster.jpg` (or `-listing-`, `-vertical-`) — a still you upload
2. YouTube's `maxresdefault.jpg`
3. YouTube's `hqdefault.jpg`

You don't have to do anything — YouTube's thumbnail will be used automatically. But
uploading your own still gives you a sharper frame and control over which moment
represents the video, and it removes an external request. Worth doing for the featured
player at least.

### Embed settings applied

- `youtube-nocookie.com` — no tracking cookies until someone actually plays a video
- `rel=0` — end-screen suggestions are limited to your own channel, so competitors' videos
  don't appear on your landing page when a video finishes
- `modestbranding=1`, `playsinline=1` — minimal chrome, plays inline on iOS instead of
  hijacking to fullscreen
- The vertical Short also gets `loop=1` so it repeats like it would in a social feed

### One tradeoff worth knowing

The vertical player originally auto-looped silently as visitors scrolled to it, the way a
Reel does. That isn't possible with a YouTube embed without loading the player on page
load, which defeats the point of the facade.

If you want that effect back, the vertical is the one video worth self-hosting — a Short
is under 60 seconds and compresses to a few MB, well within limits. Drop
`assets/video-vertical.mp4` in and say the word, and I'll switch that one player back to a
native silent loop while the two long videos stay on YouTube.

### Check these render

I couldn't load YouTube from my environment, so confirm on the live site:

- [ ] All three videos are set to **Public** or **Unlisted** (Private won't embed, even for you)
- [ ] Embedding is allowed — YouTube Studio → each video → Advanced → "Allow embedding" ticked
- [ ] The thumbnails appear and the right video plays in each player

---

## Before you launch — verify these

I wrote conversion copy around industry-standard claims. **Confirm each one is true for
your business, or edit it.** Every item below is a specific promise a client can hold you to.

- [ ] **"Next-business-day delivery" / "24-hr"** — hero, value props, every package, FAQ. Change if your turnaround differs.
- [ ] **"FAA licensed drone"** — hero trust bar and FAQ. Remove if you aren't Part 107 certified.
- [ ] **Service area** — "Denver Metro & Front Range" appears in the hero, footer, and schema. Update to your actual market.
- [ ] **Brokerage logos** (Compass, RE/MAX, etc.) in the proof strip — these are placeholders. Only display brokerages you've actually shot for, and check their brand-usage rules first.
- [ ] **More reviews** — the section shows the one real Google review. As you collect more, the layout can go back to a multi-column grid; ask and I'll switch it.
- [ ] **"Unlimited listing-marketing usage" / usage rights FAQ** — confirm this matches your actual license terms.
- [ ] **Booking portal copy** — the section says agents can choose a package and pick a date. If the portal also takes payment or confirms instantly, tell me and I'll say so; those are strong conversion points I left out because I couldn't verify them.
- [ ] **Weather reshoot policy** (FAQ) — confirm you offer free rescheduling.
- [ ] **Photo & Video package contents** — the three combo packages still describe their photo half generically ("Premium HDR photography"). If Premium Photo & Video now includes the floor plan and property website that Premium Photography does, tell me and I'll spell those out on those cards too.
- [ ] **Video captions** — the player labels ("Cinematic listing film", "Walkthrough video", "Social vertical cut") are guesses. Rename them in the `<figcaption>` tags to match what you actually shot.
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
| `contact_booking` | Any link into the booking portal |
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
