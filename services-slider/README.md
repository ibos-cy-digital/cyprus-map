# WWE Travel CY · "Cyprus, made to measure" · services slider

A cover-flow slider for the **English Home page**, embedded with Wix **Embed a site** (an iframe), right after the hero. It shows everything WWE Travel CY does in one calm section: the active card sits in the middle and the neighbours step back on both sides.

Published with GitHub Pages at **`https://ibos-cy-digital.github.io/cyprus-map/services-slider/`**.

## Cards

| # | Card | Tag | Button → link (opens in the full window, `target="_top"`) | Photo |
|---|---|---|---|---|
| 1 | Accommodation | Hotels · Villas · Apartments | Browse hotels → `/hotels` | `stay.webp` |
| 2 | Transfers | Airport · Private · Group | Book a transfer → `/transfers` | `transfers.webp` (number plate blurred) |
| 3 | Tours & excursions | Boat trips · Day tours | See tours → `/tours` | `tours.webp` |
| 4 | Tailor-made packages | Built around you | Plan your trip → inquiry form | `packages.webp` (**temporary**: Paphos harbour) |
| 5 | Weddings in Cyprus | Ceremony · Guests · Every detail | Plan your wedding → inquiry form | `weddings.webp` |
| 6 | Cultural Cyprus | Kourion · Paphos · Nicosia | Plan a cultural tour → inquiry form | `culture.webp` |
| 7 | Pilgrimage routes | Kykkos · Stavrovouni · St Lazarus | Plan a pilgrimage → inquiry form | `pilgrimage.webp` (**temporary**: 450 px, too small) |
| 8 | Group tours | Coaches · Guides · Programmes | Plan a group tour → inquiry form | `groups.webp` |

The inquiry form is `https://www.wwe-cy.com/tailored-program-package-request`.

**Early booking badge** on cards 5 and 8: "Early booking 2027 · Save 10% · Book by 30 November". It disappears by itself after **30 November 2026, 23:59 Cyprus time** (`OFFER_END` at the top of `js/slider.js`). For a new offer, change the text in `index.html` and the date in `js/slider.js`.

## Behaviour

- **Autoplay:** every 5.5 s. The active dot fills while the card plays.
- **Pausing:** on hover, while keyboard focus is inside, when the tab is hidden, and when the slider is off screen.
- **Navigation:** arrows and dots, a click on a side card, swipe on touch screens, and ←/→ keys.
- **Motion:** cards glide into place (0.75 s), and the photo in the middle zooms out slowly. With `prefers-reduced-motion`, cards switch instantly, nothing zooms, and there is no autoplay.

## Iframe heights (set these in Wix)

Set the Embed element to **100% width (stretched)**. Inside the iframe the background is transparent, so the Wix section colour shows through. Opened on its own, the page shows sand `#EFE9E0`.

| Wix breakpoint | Frame width | Iframe height | Layout |
|---|---|---|---|
| Desktop | ≥ 1024 px | **640 px** | five cards visible (2 + active + 2), 32 px side padding, max 1216 px content |
| Tablet | 768–1023 px (also Wix's 751–767 px) | **560 px** | the same, smaller cards, 24 px side padding |
| Mobile | < 768 px | **660 px** | one large card, the neighbours peek from the sides, 16 px side padding |

- Inside the iframe the cards take whatever height is left under the heading, so a few pixels more or less never overflows.
- Wix Studio's tablet breakpoint starts at 751 px. A frame 750–767 px wide that is less than 601 px tall keeps the tablet layout, so 560 px is always right there.
- Tested on all eight cards at 320–1920 px.

## Photos

`assets/photos/*.webp`, at most 1600 px wide. For a new photo, use a landscape image at least 1600 × 1100 px with the subject in the middle (on mobile the card is cropped to portrait), then overwrite the file with the same name. Which part of the photo stays in view is set per card with `--focus` in `index.html`, for example `style="--focus:50% 40%"` (horizontal, vertical).

Use only photos you have the right to use. Photos of real guests (weddings, groups) need their consent.

## Files

```
services-slider/
├── index.html          the section: heading and the eight cards (texts, links, photos)
├── css/slider.css      layout, cards, controls, breakpoints, motion
├── js/slider.js        cover-flow geometry, autoplay, dots, swipe, keys, offer deadline
└── assets/photos/      the eight card photos (WebP)
```

Plain HTML, CSS and vanilla JS: no build step and no libraries, with Inter from Google Fonts. All paths are relative.
