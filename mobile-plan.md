# Mobile and Tablet Plan: Hero Logo Scrolling and Topographic Background

## Scope
- Restore native vertical page scrolling when a touch starts on the hero ASCII logo, its transparent canvas, or surrounding artwork.
- Show both the lower and vertically/horizontally flipped upper topographic layers on every screen size, with consistent section dimming and responsive performance settings.
- Add Instagram to the existing footer social links and keep the link group legible and touch-friendly at phone, tablet, and desktop widths.

## Implementation
- Make the mobile touch contract explicit on the deck, slides, hero artwork, and canvas; keep mouse hover interaction desktop-only and ensure the canvas cannot capture touch gestures.
- Load both terrain layers on touch/tablet layouts with desktop-matching composition and responsive DPR/animation settings. Apply section dimming once through shared layer opacity rules on every screen; keep animated WebGL disabled when reduced motion is requested.
- Match Instagram's footer button styling to the existing social links and allow the footer links to wrap cleanly at compact widths.
- Retain desktop composition and avoid introducing layout shifts or forced WebGL context loss.

## Verification
- Check representative widths around 375, 430, 768, 820, 1024, and 1440 CSS pixels.
- Confirm a vertical swipe beginning over the logo and surrounding empty artwork scrolls the page; verify tap/click behavior remains intact.
- Confirm both flipped and lower topography layers, matching section dimming, crop, and contrast at phone, tablet, and desktop sizes, plus reduced-motion and coarse-pointer modes.
- Run typecheck, lint, and production build; report when visual device verification is unavailable.
