# WWE Travel CY · Home page services slider

A cover-flow slider of the five WWE Travel CY services for the **English Home page**, embedded with Wix **Embed a site** (an iframe), right after the hero. The active card sits in the middle and the neighbours step back on both sides.

The section heading (eyebrow, title, description) is **set in Wix, above the embed**, so it fits the page padding and search engines read it. The iframe holds only the cards and the navigation.

Published with GitHub Pages at **`https://ibos-cy-digital.github.io/cyprus-map/services-slider/`**.

## Cards

| # | Card | Tag | Button → link (opens in the full window, `target="_top"`) | Photo |
|---|---|---|---|---|
| 1 | Accommodation | Hotels · Villas · Apartments | Browse Accommodation → `/cyprus-hotels` | `accommodation.webp` |
| 2 | Transfers & Group Transport | Airport · Private · Groups | Explore Transfers → `/transfers` | `transfers.webp` |
| 3 | Tours & Experiences | Excursions · Boat Trips · Activities | Explore Tours & Experiences → `/tours-excursions` | `tours.webp` |
| 4 | Group Tours & Programmes | Groups · Guides · Itineraries | Plan a Group Tour → `/tailored-program-package-request` | `group-tours.webp` |
| 5 | Tailor-Made Travel Packages | Stays · Transfers · Tours | Plan Your Trip → `/tailored-program-package-request` | `tailor-made.webp` |

All links are on `https://www.wwe-cy.com`. On phones narrower than 400 px, the button on card 3 reads "Explore Tours" so it fits the card.

## Design

- **Cards:** landscape, 3 : 2, at most 480 × 320 px on desktop. They never stretch with the frame height. Radius 18 px.
- **Photos:** shown in their own colours. A dark gradient sits only in the lower part, behind the copy. Side cards are only slightly darker.
- **Depth:** soft, layered shadows. The middle card has the strongest shadow, and the side cards step back in size and shade.
- **Navigation:** neutral white arrows (ink on hover) and five dots. The active dot is a 22 px pill that fills while the card plays.
- **Background:** a warm horizontal gradient, sand `#F3ECE3` at the edges and `#FAF7F3` in the middle. On top of it, faint contour lines near the corners (the motif of the B2B section), fading out towards the middle (`assets/contours.svg`).
- **Motion:**
  - Cards glide into place in 0.75 s, and the photo in the middle zooms out slowly to full sharpness.
  - Autoplay runs every 5.5 s and pauses on hover, while focus is inside, when the tab is hidden and when the slider is off screen.
  - Navigation: arrows, dots, a click on a side card, swipe on touch, and ←/→ keys.
  - With `prefers-reduced-motion`, cards switch instantly, nothing zooms, and there is no autoplay.

## Iframe heights (set these in Wix)

Set the Embed element to **100% width (stretched)** and remove the Wix section's padding around it. The background is part of the embed.

| Wix breakpoint | Frame width | Iframe height | Layout |
|---|---|---|---|
| Desktop | ≥ 1024 px | **420 px** | five cards (2 + active + 2), 18 px side padding, content at most 1216 px wide |
| Tablet | 768–1023 px (also Wix's 751–767 px) | **380 px** | the same, smaller cards, 24 px side padding |
| Mobile | < 768 px | **520 px** | one large card, the neighbours peek from the sides, 16 px side padding |

- A taller frame does not stretch the cards; the extra height is just empty space.
- Wix Studio's tablet breakpoint starts at 751 px. A frame 750–767 px wide that is less than 451 px tall keeps the tablet layout, so 380 px is always right there.
- Tested on all five cards at 320–1920 px.

## Photos

`assets/photos/*.webp`, at most 1600 px wide. For a new photo, use a landscape image at least 1600 × 1100 px with the subject in the middle (on mobile the card is cropped to portrait), then overwrite the file with the same name. Which part of the photo stays in view is set per card with `--focus` in `index.html`, for example `style="--focus:50% 62%"` (horizontal, vertical).

Use only photos you have the right to use. Photos of real guests need their consent.

## Files

```
services-slider/
├── index.html          the five cards (texts, links, photos)
├── css/slider.css      background, cards, controls, breakpoints, motion
├── js/slider.js        cover-flow geometry, autoplay, dots, swipe, keys
└── assets/
    ├── contours.svg    background contour lines
    └── photos/         the five card photos (WebP)
```

Plain HTML, CSS and vanilla JS: no build step and no libraries, with Inter from Google Fonts. All paths are relative.
