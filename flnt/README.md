# FLNT Films — landing page

**Concept: "Strike."** Flint throws a spark when struck, so the visitor does the striking. Every click
throws physics-driven sparks, and those sparks are the light source that reveals the wordmark. The whole
site is framed as a camera viewfinder, and scrolling is the playhead.

```
index.html    markup + copy
styles.css    design system + every section
main.js       sparks, light, cursor, scroll-scrubbed scenes, slate form
favicon.svg   spark mark
netlify.toml  deploy settings (base directory: flnt/)
```

No framework, no build step. Open `index.html` through any static server.

## Scenes

| # | Section | The idea |
|---|---------|----------|
| — | Film leader | 3-2-1 countdown, then a flash. Click or any key skips it. |
| 01 | Hero | Giant FLNT, dark until light hits it. Click to strike, swipe fast to throw sparks. The wordmark "desqueezes" from 62% to 125% width like anamorphic footage. |
| 02 | Rack focus | The manifesto starts out of focus and pulls sharp word by word as you scroll. |
| 03 | The reel | Pinned film strip with sprocket holes that scrolls sideways. Letterbox bars close in to 2.39:1. |
| 04 | Lens dial | Scroll turns a lens barrel: 24 / 35 / 50 / 85 / 135mm, one service per focal length. |
| 05 | Process | Strike → Kindle → Burn → Glow, lit by a burning fuse. |
| 06 | Credits | End credits, rolling. |
| 07 | The slate | The contact form is a clapperboard. "Call Action" snaps the clapper shut and throws sparks. |

The HUD runs the whole time: REC light, timecode tied to scroll position, f-stop that changes per
scene, a scrubber, and the scene name.

## Before launch — replace the placeholders

- **Email:** `hello@flntfilms.com` in `index.html` (contact section).
- **Social links:** the `href="#"` Instagram / Vimeo / YouTube links in the footer.
- **Projects:** the five reel frames (Ember Hour, Salt & Iron, …) are placeholder titles over
  CSS-painted plates. Replace them with real projects. To use real footage, add a
  `<video muted loop playsinline preload="none" src="…">` inside `.frame-art`; it plays on hover.
- **Hero reel (optional):** uncomment the `<video class="hero-reel">` line in the hero and point it at a
  short, muted loop. It plays dimmed behind the wordmark.
- **Social share image:** add an `og:image` once there's a still worth sharing.

## Form

The slate posts to Netlify Forms as `flnt-inquiry`. Submissions show up under **Forms** in the Netlify
dashboard once the site is deployed. Served locally, the form shows its fallback "email us" message.

## Accessibility

- `prefers-reduced-motion` turns off the leader, sparks, grain, pinned scroll scenes and the custom
  cursor, and lays every section out as plain, readable content.
- Touch devices get tap-to-strike and no custom cursor.
