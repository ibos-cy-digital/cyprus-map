# WWE Travel CY · Trust banner

A compact trust and credibility slider for the WWE Travel CY home page. It is embedded with Wix **Embed a site** (an iframe) between **"For Travel Agencies"** and **"Why Choose WWE Travel CY"**.

Its message: WWE Travel CY is an officially licensed, award-winning, well-reviewed Cyprus company you can safely book and pay with. It deliberately does not repeat the "Why Choose" points, and it makes no "no deposit" or "free cancellation" claims.

Published with GitHub Pages at **`https://ibos-cy-digital.github.io/cyprus-map/trust-banner/`**.

## Slides

| # | Slide | Content | Button (opens in the full window, `target="_top"`) |
|---|---|---|---|
| 1 | Licensed & regulated | "Licensed by the Cyprus Deputy Ministry of Tourism" · CTO Licence No. 7732 · Registered Cyprus company · official ministry logo | Licence details → `/legal-disclaimer` |
| 2 | Trusted by travel agencies | "Partners who already work with us" · seven partner logos on light glass tiles | Become a partner → `/become-a-b2b-partner` |
| 3 | Award-winning | "EU Business Award Winner 2025" · Best bespoke travel · laurel badge | Plan your trip → `/tailored-program-package-request` |
| 4 | Rated 5.0 on Google | 5 gold stars, two verbatim Google reviews (Yiannis Korfiotis, Katerina Eftychiou) | Read our reviews → Google Maps |
| 5 | Book with confidence | Secure payments · SSL encrypted · GDPR compliant · shield, Visa, Mastercard, American Express, PayPal | Browse hotels → `/hotels` |

**Behaviour:**
- **Autoplay:** every 6 s, with a thin progress bar.
- **Pausing:** on hover, while keyboard focus is inside, when the tab is hidden, and when the banner is off screen.
- **Navigation:** arrows and dots, swipe on touch screens, and ←/→ keys.
- **Reduced motion:** with `prefers-reduced-motion`, slides only change when the visitor chooses one, and nothing animates.

## Iframe heights (set these in Wix)

The banner never scrolls inside the frame: inside an iframe it fills the frame exactly. Set the Embed element to **100% width (stretched)** with these heights:

| Wix breakpoint | Frame width | Iframe height | Layout |
|---|---|---|---|
| Desktop | ≥ 1024 px | **260 px** | text + visual side by side, 32 px side padding |
| Tablet | 768–1023 px (also Wix's 751–767 px) | **220 px** | side by side, compact, 24 px side padding |
| Mobile | < 768 px | **420 px** | stacked: visual on top, text below, 16 px side padding |

- Wix Studio's tablet breakpoint starts at 751 px. A frame 750–767 px wide that is at most 300 px tall keeps the tablet layout, so 220 px is always right there.
- Tested on all five slides at 320–1440 px. Nothing overflows at these heights.
- The page background is `#F8F7F4`. Use the same colour on the Wix section behind the embed, and remove that section's padding.

## Design

One design, used by default. No URL parameter is needed; an old `?v=…` parameter is simply ignored.

- **Card:** the brand near-black, a soft gradient from `#1A1A1A` to `#242424`, with fine grain for depth. Radius 16 px and a soft shadow, on the page background `#F8F7F4`.
- **Text:** headings white (24–26 px, weight 600), body `#BDBDBD` (14 px), eyebrows and buttons in accent `#E8593C`, button radius 8 px.
- **Photo:** on the right, at 60% opacity and faded into the dark card by a mask, so there is no visible edge (on mobile it fades downward into the text).
- **Badges:** dark-grey glass (translucent white, fine border, blur) for the award, review, payment and licence-number badges. The ministry crest sits on a **light** glass badge so its colours stay true.
- **Motion:** crossfade between slides, a gentle text reveal, a slow zoom on the photo, and small icon details (stars, laurel, shield tick). Nothing moves with `prefers-reduced-motion`.

Embed URL for Wix: `https://ibos-cy-digital.github.io/cyprus-map/trust-banner/`

## The ministry logo

Slide 1 shows **`assets/deputy-ministry-logo.png`**: the Deputy Ministry of Tourism crest with "Deputy Ministry of Tourism · Republic of Cyprus", **without** the "Love Cyprus" mark. It is a transparent PNG, 720 × 323 px. It was made from the logo supplied by the owner: cropped before the divider line, the baked-in checkerboard removed, and the white dove and "1960" inside the shield kept.

It shows at about 232 × 104 px on desktop, 174 × 78 px on tablet and 214 × 96 px on mobile, on the light glass badge. To replace it, overwrite the file with a transparent PNG of a similar shape (about 2.2:1). If the file is ever missing, the slide falls back to a plain text badge ("Deputy Ministry of Tourism · Republic of Cyprus").

## Partner logos (slide 2)

Seven partners are shown in a 4 + 3 grid (second row centred) of equal light-glass tiles (the same style as the ministry badge), so each logo keeps its original colours. The tiles fade in one after another when the slide appears, and the grid stays 4 + 3 at every size; on tablet and mobile the tiles are simply smaller.

| Tile | File in `assets/partners/` | Status |
|---|---|---|
| Buena Vista | `buena-vista.png` | **Not yet supplied:** shows the name as a clean text tile |
| Rapsody Travel & Events | `rhapsody.png` | logo, grey background removed |
| Allegra Cruises | `allegra.png` | logo (from the SVG; the English "Cruises" version) |
| Ventura Travel Agency | `ventura.png` | logo, white background removed |
| Prometheus Holiday & Business | `prometheus.png` | logo on its own navy brand square |
| Sol Azur Travel & Events | `sol-azur.png` | logo (already transparent) |
| Moj Kipar | `moj-kipar.png` | logo (already transparent, original colours) |

- **Adding or replacing a logo:** save a PNG with a transparent background (about 200 px tall) under the exact file name above. It replaces the text tile automatically, with no code change.
- **Missing logo:** if a logo file is missing or fails to load, its tile shows the company name in clean text instead.
- **Visual balance:** each logo's width in its tile is set with `--w` in `index.html`, for example `style="--w:70%"`. The values are worked out so wide and square marks carry the same visual weight. For a new logo, start at about 70% for a ~1.5:1 mark, 90% for a very wide one, and 60% for a square one.

## Editing

- **Texts, links, reviews:** in `index.html`. Each slide is one `<article class="sl">` block with its eyebrow, headline, line, button, and visual. Keep the reviews verbatim.
- **Timing:** `DURATION` in `js/banner.js` (6000 ms).
- **Colours and sizes:** `css/banner.css`. The palette variables are at the top (`--dark-1`, `--dark-2`, `--on-dark`, `--on-dark-2`, `--glass`), the dark theme block follows the components, and the breakpoints are at the end.
- **Photos** (behind the visuals, on the right): `assets/photos/`. They are copies of the map section's photos, so the banner doesn't depend on that folder.
- **Payment logos:** `assets/pay/*.svg`, from [Simple Icons](https://simpleicons.org) (CC0), coloured with each brand's colour. Use them only to show accepted payment methods, as the brands' guidelines allow.

## Files

```
trust-banner/
├── index.html          the banner (all five slides)
├── css/banner.css      layout, dark theme, breakpoints, motion
├── js/banner.js        slider: autoplay, progress, pause, arrows, dots, swipe, keys
└── assets/
    ├── deputy-ministry-logo.png   official logo, transparent PNG
    ├── partners/       partner logos (transparent PNG; buena-vista.png still to come)
    ├── pay/            visa, mastercard, americanexpress, paypal, google (SVG)
    └── photos/         5 Cyprus photos
```

Plain HTML, CSS and vanilla JS: no build step and no libraries, with Inter from Google Fonts. All paths are relative, so it works on GitHub Pages and also by double-clicking `index.html`.
