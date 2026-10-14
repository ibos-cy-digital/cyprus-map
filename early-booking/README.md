# WWE Travel CY · Early booking 2027

The early booking section for the **English Home page**, embedded with Wix **Embed a site** (an iframe), as the last commercial section of the page.

Published with GitHub Pages at **`https://ibos-cy-digital.github.io/cyprus-map/early-booking/`** once merged.

## What it shows

- **Headline:** "Cyprus 2027 / rates *are open.*" in Instrument Serif, with a short line and a white button "Request a 2027 offer" (inquiry form).
- **Trust points:** Licensed Cyprus company · Best Bespoke Travel · 2025 · For travellers, groups and agencies.
- **Glass countdown** (days, hours, minutes, seconds) to **30 November 2026, 23:59 Cyprus time**, with flip digits.
- **Four offers:**

| Card | Discount | Button → link |
|---|---|---|
| Hotels & Stays | Up to 20% off | View hotel offers → `/cyprus-hotels` |
| Tours & Experiences | 10% off | Explore tours → `/tours-excursions` |
| Group Programmes | 10% off | View group offers → `/tailored-program-package-request` |
| Weddings & Special Events | 10% off | Plan your event → `/tailored-program-package-request` |

- **Small print:** "Discounts apply to new 2027 bookings confirmed by the deadline. Conditions apply."

**After the deadline** the section changes by itself: the countdown, the discounts and the small print disappear, the eyebrow reads "Cyprus 2027 season", and the line under the countdown reads "Early booking for 2027 has ended. Ask us for current 2027 rates." The date is `DEADLINE` at the top of `js/early-booking.js`.

## Motion

- **Entrance:** when the section scrolls into view, the headline lines rise in turn, the photo settles from a slow zoom, and the four cards are dealt in one after another.
- **Desktop, cards:** the card under the pointer tilts in 3D towards it, lifts, and catches a soft light reflection. Its photo, icon and discount move in depth (parallax), and the other three step back slightly.
- **Desktop, background:** the photo drifts gently with the pointer.
- **Countdown:** each changing digit flips.
- **Tablet and mobile:** the cards become a swipe deck with dots. On mobile the card in the middle is in focus and the neighbours are smaller and softer.
- **Reduced motion:** with `prefers-reduced-motion`, nothing moves; the countdown still counts.

## Iframe heights (set these in Wix)

Set the Embed element to **100% width (stretched)** and remove the Wix section's padding.

| Wix breakpoint | Frame width | Iframe height |
|---|---|---|
| Desktop | ≥ 1024 px | **1000 px** |
| Tablet | 768–1023 px (also Wix's 751–767 px) | **1110 px** |
| Mobile | < 768 px | **1180 px** |

The section's own height is 947–988 px on desktop, 1086–1105 px on tablet and 1105–1174 px on mobile; any extra frame height is plain page colour below it.

**Edges:** the photo fades in from the section above and out into the section below. Both edge colours are white by default. To match other section colours, add them to the embed URL without `#`, for example `…/early-booking/?top=f8f7f4&bottom=ffffff`.

## Photos and fonts

- `assets/photos/`: `background.webp` (Limassol resort at dusk) and the four card photos. Card photos look best at about 900 × 600 px; which part stays in view is set with `--focus` in `index.html`.
- `assets/fonts/`: Inter and Instrument Serif, hosted with the section (SIL Open Font Licence, see the `OFL-*.txt` files), so the section does not depend on Google Fonts.

## Files

```
early-booking/
├── index.html               the section: headline, countdown, trust points, four offers
├── css/early-booking.css    layout, glass countdown, cards, 3D tilt, breakpoints, motion
├── js/early-booking.js      countdown and deadline, entrance, tilt, swipe deck
└── assets/
    ├── fonts/               Inter and Instrument Serif (woff2) with their licences
    └── photos/              background and the four card photos (WebP)
```

Plain HTML, CSS and vanilla JS: no build step and no libraries. All paths are relative.
