# WWE Travel CY · Trust banner

A compact trust and credibility slider for the WWE Travel CY home page. It is embedded with Wix **Embed a site** (an iframe) between **"For Travel Agencies"** and **"Why Choose WWE Travel CY"**.

Its message: WWE Travel CY is an officially licensed, award-winning, well-reviewed Cyprus company you can safely book and pay with. It deliberately does not repeat the "Why Choose" points, and it makes no "no deposit" or "free cancellation" claims.

Published with GitHub Pages at **`https://ibos-cy-digital.github.io/cyprus-map/trust-banner/`**.

## Slides

| # | Slide | Content | Button (opens in the full window, `target="_top"`) |
|---|---|---|---|
| 1 | Licensed & regulated | "Licensed by the Cyprus Deputy Ministry of Tourism" · Registered Cyprus company · glass card with a blue shield and the official ministry logo (no licence number shown) | Licence details → `/legal-disclaimer` |
| 2 | Trusted by travel agencies | "Partners who already work with us" · seven partner logos on white tiles | Become a partner → `/become-a-b2b-partner` |
| 3 | Award-winning | "Best Bespoke Travel Company · Cyprus 2025" · European Travel Awards 2025 · EU Business News · round glass medallion with "2025" in Instrument Serif | Read About Our Award → the award article in the WWE Travel CY magazine (`/post/wwe-travel-celebrates-european-travel-award-as-best-bespoke-travel-company-in-cyprus-2025`) |
| 4 | Rated 5.0 on Google | 5 white stars, two verbatim Google reviews on a glass card (the second is hidden below 900 px) (Yiannis Korfiotis, Katerina Eftychiou) | Read our reviews → Google Maps |
| 5 | Book with confidence | Secure payments · SSL encrypted · GDPR compliant · glass card with a blue shield, Visa, Mastercard, American Express, PayPal | Browse hotels → `/hotels` |

**Behaviour:**
- **Autoplay:** every 6 s, with a thin progress bar along the bottom of the card.
- **Pausing:** on hover, while keyboard focus is inside, when the tab is hidden, and when the banner is off screen.
- **Navigation:** arrows and dots, swipe on touch screens, and ←/→ keys.
- **Reduced motion:** with `prefers-reduced-motion`, slides only change when the visitor chooses one, and nothing animates.

## Iframe heights (set these in Wix)

The banner never scrolls inside the frame: inside an iframe it fills the frame exactly. Set the Embed element to **100% width (stretched)** with these heights:

| Wix breakpoint | Frame width | Iframe height | Card | Layout |
|---|---|---|---|---|
| Desktop | ≥ 1024 px | **384 px** | 360 px tall, max 1216 px wide | copy left, visual right, 32 px side padding |
| Tablet | 768–1023 px (also Wix's 751–767 px) | **344 px** | 320 px tall | copy left, smaller visual right, 24 px side padding |
| Mobile | < 768 px | **480 px** | 456 px tall | compact visual at the top, copy below, controls centred at the bottom, 16 px side padding |

- The iframe height is the card plus 8 px above it and 16 px below it, which leaves room for the card's soft shadow.
- **Width:** the card is never wider than **1216 px** and is centred, so on wide screens it lines up with the page content grid. Below 1280 px it keeps 32 / 24 / 16 px from the frame edges.
- Wix Studio's tablet breakpoint starts at 751 px. A frame 750–767 px wide that is less than 381 px tall keeps the tablet layout, so 344 px is always right there.
- Tested on all five slides at 320–1920 px. Nothing overflows at these heights.
- **Background:** inside the iframe the page is **transparent**, so the sand section (`#EFE9E0`) shows through. Opened on its own, the page shows `#EFE9E0`. Remove the Wix section's padding around the embed.

## Design

One design, used by default. No URL parameter is needed; an old `?v=…` parameter is simply ignored.

- **Card:** radius 24 px (20 px on tablet and mobile), soft shadow. There is no black and no orange anywhere.
- **Photo and overlay:** each slide's photo is full-bleed under a deep sea blue gradient, `linear-gradient(90deg, rgba(13,34,54,.96) 0%, rgba(13,34,54,.86) 38%, rgba(13,34,54,.35) 72%, rgba(13,34,54,.18) 100%)`. On mobile the same gradient runs top to bottom, with the photo above and the copy below. To use warm ink instead, change `--sea` at the top of `css/banner.css` to `26, 26, 26`.
- **Copy:**
  - Eyebrow: white at 62% opacity, uppercase, 11 px.
  - Headline: white, 32 px on desktop, 25 px on tablet, 23 px on mobile.
  - Line: white at 80%.
  - Button: white with `#1A1A1A` text, radius 8 px.
- **Controls:** one glass pill at the bottom right, centred on mobile. It is white at 10% with blur and a 1 px border of white at 20%.
  - Arrows: 36 px circles with white chevrons. On hover they turn white with a dark chevron.
  - Dots: the active dot is a 22 px white pill; inactive dots are 6 px, white at 40%.
  - Progress bar: 2 px, white at 75%, on a track of white at 12%.
- **Right-side visuals:**
  - Glass cards: white at 10%, blur, a fine border.
  - Logos sit in white tiles: radius 12, a soft shadow, and a lift on hover.
  - The licence and payment cards have a blue shield icon box (`#185FA5` on `#E6F1FB`).
  - The award is a round glass medallion with "2025" in Instrument Serif.
- **Mobile visuals:** one compact row at the top of the card, over the photo.
  - Licence: the ministry logo in a small white tile.
  - Partners: the seven logos in small white tiles, in a slow endless row. It pauses on touch; with reduced motion it stands still and can be swiped sideways.
  - Award: a small "2025" medallion.
  - Payments: Visa, Mastercard, American Express and PayPal in small white tiles.
  - Reviews: no visual; the white stars in the eyebrow carry it.
- **Motion:**
  - Crossfade between slides: 0.8 s.
  - Slow zoom-out on the photo: scale 1.08 → 1 over 7 s.
  - The copy fades up line by line.
  - Partner tiles appear one after another.
  - Nothing moves with `prefers-reduced-motion`.

Embed URL for Wix: `https://ibos-cy-digital.github.io/cyprus-map/trust-banner/`

## The ministry logo

Slide 1 shows **`assets/deputy-ministry-logo.png`**: the Deputy Ministry of Tourism crest with "Deputy Ministry of Tourism · Republic of Cyprus", **without** the "Love Cyprus" mark. It is a transparent PNG, 720 × 323 px. It was made from the logo supplied by the owner: cropped before the divider line, the baked-in checkerboard removed, and the white dove and "1960" inside the shield kept.

It shows in a white tile on the licence glass card, at about 205 × 92 px on desktop, 165 × 74 px on tablet and 111 × 50 px on mobile. To replace it, overwrite the file with a transparent PNG of a similar shape (about 2.2:1). If the file is ever missing, the slide falls back to a plain text badge ("Deputy Ministry of Tourism · Republic of Cyprus").

## Partner logos (slide 2)

Seven partners are shown in a 4 + 3 grid (second row centred) of equal white tiles, so each logo keeps its original colours. The tiles fade in one after another when the slide appears and lift on hover. On tablet the tiles are smaller. On mobile the logos run in a slow endless row at the top of the card (`js/banner.js` doubles the list for the loop; the copies are hidden from screen readers).

| Tile | File in `assets/partners/` | Status |
|---|---|---|
| Buena Vista Travel Agency | `buena-vista.png` | logo, white background removed (the white letter fills inside the blue outline are kept) |
| Rapsody Travel & Events | `rhapsody.png` | logo, grey background removed |
| Allegra Cruises | `allegra.png` | logo (from the SVG; the English "Cruises" version) |
| Ventura Travel Agency | `ventura.png` | logo, white background removed |
| Prometheus Holiday & Business | `prometheus.png` | logo on its own navy brand square |
| Sol Azur Travel & Events | `sol-azur.png` | logo (already transparent) |
| Moj Kipar | `moj-kipar.png` | logo (already transparent, original colours) |

- **Adding or replacing a logo:** save a PNG with a transparent background (about 200 px tall) under the exact file name above. It appears automatically, with no code change.
- **Missing logo:** if a logo file is missing or fails to load, its tile shows the company name in clean text instead.
- **Visual balance:** each logo's width in its tile is set with `--w` in `index.html`, for example `style="--w:70%"`. The values are worked out so wide and square marks carry the same visual weight. For a new logo, start at about 70% for a ~1.5:1 mark, 90% for a very wide one, and 60% for a square one.

## Editing

- **Texts, links, reviews:** in `index.html`. Each slide is one `<article class="sl">` block with its eyebrow, headline, line, button, and visual. Keep the reviews verbatim.
- **Timing:** `DURATION` in `js/banner.js` (6000 ms).
- **Colours and sizes:** `css/banner.css`. The palette and layout variables are at the top (`--sea`, `--overlay`, `--glass`, `--blue`, `--max`, `--card-h`), and the breakpoints are at the end.
- **Photos** (full-bleed behind each slide): `assets/photos/`. Photos 1200 px wide or more look sharpest full-bleed. They are copies of the map section's photos, so the banner doesn't depend on that folder.
- **Payment logos:** `assets/pay/*.svg`, from [Simple Icons](https://simpleicons.org) (CC0), coloured with each brand's colour. Use them only to show accepted payment methods, as the brands' guidelines allow.

## Files

```
trust-banner/
├── index.html          the banner (all five slides)
├── css/banner.css      layout, sea blue theme, breakpoints, motion
├── js/banner.js        slider: autoplay, progress, pause, arrows, dots, swipe, keys
└── assets/
    ├── deputy-ministry-logo.png   official logo, transparent PNG
    ├── partners/       partner logos (transparent PNG)
    ├── pay/            visa, mastercard, americanexpress, paypal, google (SVG)
    └── photos/         5 Cyprus photos
```

Plain HTML, CSS and vanilla JS: no build step and no libraries, with Inter and Instrument Serif from Google Fonts. All paths are relative, so it works on GitHub Pages and also by double-clicking `index.html`.
