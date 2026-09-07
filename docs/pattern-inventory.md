# Initial Pattern Inventory

This first inventory is derived from two reference projects:

- `amplified-expansion-coaching`
- `monkmagazine`

The goal is not to mirror those sites literally. The goal is to extract the reusable frontend structures underneath them.

## Section Patterns

- `hero`
  - large introductory section
  - supports CTA cluster and optional side panel
  - `title` supports an optional `accent` span (`.text-accent`, themeable) for a two-tone
    headline, e.g. `title: "AH Media"`, `accent: ".ai"`
  - `panel` (the side `aside` card) is optional — omit it for a single-column hero
    (`.hero-grid-solo`) instead of a hero with an empty card
  - `align: "right"` right-aligns the copy block (text + button row) and caps its width,
    for a hero that hugs the right edge instead of the left — the rest of the site's
    sections are unaffected
- `featureGrid`
  - compact multi-column feature summary
- `spotlight`
  - image-and-copy split section
  - useful for about, event, or featured-content blocks
- `articlePreviewList`
  - stacked content previews with media, kicker, copy, and link
- `promoPair`
  - two-up promotional feature blocks
  - good for events, press, products, or secondary offers
- `gallery`
  - standardized entry point for image gallery sections
  - set `layout: "carousel"` (default) for a sliding Bootstrap-backed carousel, or `layout: "thumbnails"` for a responsive thumbnail grid that opens a native `<dialog>` lightbox
  - both layouts take the same `items` array (`{ kicker, title, copy, media }`), so switching layout is a one-line change
  - dispatches internally to `carouselGallery` / `thumbnailGallery`; use those directly only if you need a layout-specific option not exposed on `gallery`
- `carouselGallery`
  - sliding/fading Bootstrap-backed carousel with captions, controls, indicators, and optional autoplay
  - prefer `gallery` with `layout: "carousel"` in new specs
- `thumbnailGallery`
  - responsive thumbnail grid; clicking a thumbnail opens a native `<dialog>` lightbox with prev/next and caption
  - no external dependency — small vanilla JS, browser handles focus/backdrop/Escape
  - prefer `gallery` with `layout: "thumbnails"` in new specs
- `splitContent`
  - editorial explanation section with title, copy, and bullets
- `quoteBand`
  - pull-quote or principle band
- `signupBand`
  - newsletter or network signup section
- `contactCards`
  - compact contact information grid (static label/value pairs)
- `contactForm`
  - name/email/message contact form, plain HTML `<form>` POST (no JS)
  - `formAction` (default `#` — set to the real endpoint when one exists), `buttonLabel`,
    and per-field placeholders are all optional
  - prefer this over `contactCards` when you want to actually collect submissions rather
    than just display contact details
- `cta`
  - general-purpose conversion section

## Utility Patterns

- `backToTop`
  - floating scroll-triggered utility
  - shared concept across both reference sites
  - supports SVG icon variants like `arrow`, `triangle`, `chevron`, and `caret`
  - `position: "left" | "right"` (default `"right"`) — use `"left"` when the right corner is
    already occupied (e.g. by `chatWidget`)
- `chatWidget`
  - floating reopen button + chat panel (messages list, input row, streaming NDJSON support)
  - posts to `config.endpoint` (default `/api/chat.php`)
  - auto-generates a `namespace` in `localStorage` on first load so it works standalone,
    without depending on any upload/file step
  - sourced from `ahmedia`'s chat widget

## Near-Term Additions

- `overlayNav`
  - inspired by Monk Magazine
- `issueGrid`
  - for magazine covers, products, or archive items
- `expandableBand`
  - for hidden or secondary content revealed inline
- Scroll-driven header behavior (research, not yet built)
  - inspired by `amplifiedexpansion.com`'s sticky header, which fades its background from
    transparent to opaque as you scroll — worth generalizing into a small set of
    lightweight, framework-free scroll behaviors for `.site-header`, e.g.:
    - background opacity/blur fade in as you scroll past a threshold (the
      amplifiedexpansion.com effect specifically)
    - hide-on-scroll-down / reveal-on-scroll-up
    - height/scale shrink on scroll (e.g. logo or padding shrinks past a threshold)
  - also worth a look: a generic "stick for the duration of its own scroll, then rejoin
    normal flow" behavior (not just a header) — an element pins for as long as its parent
    section is in view, then unpins and scrolls away with the page instead of staying
    fixed forever. Useful beyond headers (sidebars, sticky nav within a section, etc.)
  - goal is a small `scrollHeader`-style utility (same shape as `backToTop`) driven by
    `IntersectionObserver`/scroll listeners only — no scroll library, matching Codette's
    framework-free stance
