# FLNT Films: flntfilms.com

Cinematic promo video for independent restaurants in Denver, Colorado.
Plain HTML, CSS and JavaScript. No framework, no build step, no dependencies.

```
index.html     markup, copy, intro gate (inline in <head>), business details for search engines
styles.css     design tokens (colors, fonts, spacing) in :root, then every section
main.js        intro, mobile menu, scroll reveal, Build your shoot estimate, copy-email button
favicon.svg    stroke flame on warm black (plus favicon-32/48, apple-touch-icon, icon-192/512 PNGs)
og-image.jpg   1200x630 link-preview image
netlify.toml   Netlify settings (base directory: flnt/)
brand/         earlier circle-logo files, kept for reference
```

## Page

Header · Hero · Work (showreel) · Pricing · Monthly content · Build your shoot · Contact · Footer

## Intro

Ember glow, rising sparks, the flame draws itself, the wordmark fades in, then the overlay fades out
(about 3.5 seconds). Click, tap, any key or a scroll skips it.

- Plays once per browser session (sessionStorage). Add `#intro` to the URL to replay it.
- Skipped entirely with prefers-reduced-motion, and never shown without JavaScript.
- Scrolling is locked only while it plays. The inline script in `<head>` releases the lock after
  6 seconds even if `main.js` fails to load.

## Things to update

- **Prices**: in the Pricing and Monthly sections of `index.html` and in `PRICES` in `main.js`.
  Keep the two in step; the estimate is calculated from `main.js`.
- **Showreel**: replace the `.reel-placeholder` div in `index.html` with a `<video>` or a Vimeo or
  YouTube `<iframe>`. The comment above it has both snippets. The frame stays 16:9.
- **Email**: `hello@flntfilms.com` appears in the contact section, its mailto link and `EMAIL` in
  `main.js`. Every inquiry and estimate is sent there, so it must be a working inbox.

## Accessibility

Landmarks and skip link, visible focus states, real radio buttons and checkboxes in the estimate,
live-region announcements for the total and the copy button, and the intro overlay hidden from
screen readers.
