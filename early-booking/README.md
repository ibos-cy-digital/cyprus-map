# WWE Travel CY · Early booking 2027

A compact promotional section for the **English Home page** (**380 px** tall on desktop), embedded with Wix **Embed a site** (an iframe). The photo sits in a rounded panel (radius 24, soft shadow) and the offer card in front reaches about 23% past the panel's bottom edge.

Published with GitHub Pages at **`https://ibos-cy-digital.github.io/cyprus-map/early-booking/`** once merged.

## Layout

**Left: the promotion**
- Eyebrow "Early booking · Cyprus 2027".
- Headline "Cyprus 2027 / rates *are open.*" in Instrument Serif, 30 px.
- Button "Request 2027 offers" → inquiry form.
- Three points: Early Booking Advantage · Flexible Booking Conditions · For Groups & Agencies.
- Small print: "Discounts on request for new 2027 bookings confirmed by the deadline. Conditions apply."

**Right: countdown and carousel**
- A slim glass countdown (days, hours, minutes, seconds, with flip digits) to **30 November 2026, 23:59 Cyprus time**, with the deadline line next to it.
- A 3D orbit of four concave offer cards (236 × 260 px on desktop):

| Card | Discount | Main button | Second link |
|---|---|---|---|
| Hotels & Stays | Up to 20% off | Explore Hotels → `/cyprus-hotels` | Request 2027 Offer → form |
| Tours & Experiences | 10% off | Explore Tours → `/tours-excursions` | Request 2027 Offer → form |
| Group Programmes | 10% off | Explore Programmes → `/tours-excursions` | Request 2027 Offer → form |
| Weddings & Special Events | 10% off | Request 2027 Offer → form | (none) |

The form is `https://www.wwe-cy.com/tailored-program-package-request`. The second link is there because the discounts are given on request, not automatically on the listing pages.

## The sequence

1. **Base:** the section's own photo, with no card in front. Lasts 2.8 s.
2. **Arrival:** the orbit turns and the first card comes to the front.
3. **Reveal:** the card opens (description and buttons) and its photo fades into the section background, while the headline and countdown stay readable. Lasts 6.5 s.
4. **Next offer:** the card closes, the orbit turns, and the background changes to the next photo.
5. **Return to base:** after the fourth offer, the base photo comes back, there is a pause, and the sequence repeats.

**Control:**
- **Navigation:** arrows, a click on a side card, swipe on touch screens, and ←/→ keys.
- **Progress:** four small bars show which offer is playing.
- **Pausing:** autoplay pauses on hover, while focus is inside, when the tab is hidden and when the section is off screen. After the visitor uses the controls, it waits 9 s before continuing.
- **Reduced motion:** with `prefers-reduced-motion`, the first offer is shown open and nothing moves by itself.
- **Timings:** set at the top of `js/early-booking.js` (`BASE_HOLD`, `CARD_HOLD`, `TURN`, `RESUME`).

**The concave cards:** each card's photo is split into three vertical slices, and the outer two turn slightly towards the viewer. Light and shade on the slices make the curve read. The copy sits on a flat plane just in front of the photo.

**After the deadline** the countdown, the discounts and the small print disappear, the eyebrow reads "Cyprus 2027 season", and the deadline line reads "Early booking for 2027 has ended. Ask us for current 2027 rates."

## Iframe heights (set these in Wix)

| Wix breakpoint | Frame width | Iframe height | Layout |
|---|---|---|---|
| Desktop | ≥ 1024 px | **380 px** | two columns; the three points on one row from 1280 px |
| Tablet | 768–1023 px (also Wix's 751–767 px) | **360 px** | two columns, smaller cards (206 × 238), arrows only below 900 px |
| Mobile | < 768 px | **810 px** | stacked: promotion, countdown, then the carousel |

- **Fit:** inside the iframe the section fills the frame height exactly, so a few pixels more or less never leave a gap. On mobile any extra height is empty page below.
- **Width:** the panel keeps **16 px** from the frame's left and right edges (12 px on tablet and mobile), so its side shadow shows. Set the page padding in Wix Studio; to add more inside the embed, use `?pad=24` in the URL.
- **Background:** inside the iframe everything around the panel is transparent, so the page colour (white) shows. The panel has a soft deep-blue shade along its top and bottom edges.
- **Navigation:** the arrows and progress bars sit under the panel, on the page, at the bottom right (centred under the card on mobile).

## Photos and fonts

- **`assets/photos/`:**
  - `background.webp`: the base photo, Limassol at dusk.
  - `hotels.webp` (pool in a Cyprus resort), `tours.webp` (pirate-ship cruise), `groups.webp` (a group at a water park), `weddings.webp` (beach ceremony): one per offer, used both on the card and as the background while that card is open. They are 1500–1920 px wide.
  - Which part of a photo shows on its card is set with `--fx` (0 left … 1 right) on the card in `index.html`.
- **`assets/fonts/`:** Inter and Instrument Serif, hosted with the section (SIL Open Font Licence, see the `OFL-*.txt` files).

## Files

```
early-booking/
├── index.html               promotion, countdown, the four offer cards, navigation
├── css/early-booking.css    layout, glass countdown, concave cards, orbit, breakpoints
├── js/early-booking.js      countdown, orbit and sequence, autoplay, controls
└── assets/
    ├── fonts/               Inter and Instrument Serif (woff2) with their licences
    └── photos/              base background and the four offer photos (WebP)
```

Plain HTML, CSS and vanilla JS: no build step and no libraries. All paths are relative.
