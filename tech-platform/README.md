# Travel Tech Platform: iBOS dashboard style

The `/travel-tech-platform` page as seven Wix embeds, in the iBOS dashboard style:

- near-black base with frosted glass cards and hairline borders;
- deep royal violet (`#4A3FC4` → `#322A8F`) for the buttons, violet for interaction, teal for data;
- no orange.

Every embed loads the same page, and `?s=` picks the section.

Live: `https://ibos-cy-digital.github.io/cyprus-map/tech-platform/` (without `?s=` it shows all seven sections stacked, for preview).

## Wix embeds (Embed a site), top to bottom

| # | Section | URL | Desktop | Tablet | Mobile |
|---|---|---|---|---|---|
| 1 | Hero | `…/tech-platform/?s=hero` | 730 | 1060 | 1060 |
| 2 | Who it's for | `…/tech-platform/?s=audience` | 640 | 720 | 1010 |
| 3 | Platform modules | `…/tech-platform/?s=modules` | 1250 | 1670 | 2930 |
| 4 | Results | `…/tech-platform/?s=results` | 625 | 905 | 1375 |
| 5 | AI co-pilots | `…/tech-platform/?s=ai` | 790 | 1240 | 1605 |
| 6 | Pricing | `…/tech-platform/?s=pricing` | 875 | 1325 | 1790 |
| 7 | Final CTA | `…/tech-platform/?s=cta` | 760 | 670 | 890 |

### Placing the embeds in Wix

- Stretch each embed to full width.
- Leave no gap between the embeds.
- Set the page background to `#0A0B0F`, so the sections meet without seams.

### How the heights hold up

The heights fit the usual widths:

- desktop: 1180–1920 px;
- tablet: 751–1000 px;
- phone: 360–430 px.

At other widths inside a breakpoint, for example a 1001 px desktop or a 320 px phone, the section first shrinks its top and bottom padding. If that is not enough, it zooms out slightly. Nothing is ever cut off.

## Links

All button targets are in `LINKS` at the top of `js/tech.js`:

| Buttons | Target |
|---|---|
| Book a free demo, View pricing, Contact us, Book a demo, Get started, Free consultation | the demo request form `https://www.wwe-cy.com/demo-request-platform` |
| WhatsApp us | `wa.me/35722420437` |
| Phone, email | the phone number and email address |

Links open in the top window. WhatsApp opens in a new tab.

## Motion

- Each card and heading reveals on its own once it is well on screen. The numbers and charts start only then, so a tall frame never finishes its animations before you reach them.
- The hero has a 3D orbit of the six modules around the "One login" core.
- Each module card has a live preview: payment toasts, dynamic prices, channel sync, AI typing, a daily checklist and a revenue chart.
- AI agent cards type out their activity logs.
- The Premium pricing card has a rotating light around its border.
- The final CTA ends in a dot-matrix wordmark ("ONE LOGIN"):
  - Blurred, scattered dots resolve into letters as a light sweeps across.
  - The colours run sea blue → indigo → violet.
  - To change the words, edit `data-word` and `data-word-phone` on the canvas in `index.html` (`|` makes a line break on phones).
- The final CTA background fades into the navy footer `#0D2236`.
- Star fields and a cursor light sit in the background.

Every loop runs only while its section is on screen. All motion is off with `prefers-reduced-motion`.

## Files

- `index.html`: markup, icons and the section switch (`?s=`)
- `css/tech.css`: styles (tokens follow `ibos-dashboard-v2`)
- `js/tech.js`: behaviour and links
