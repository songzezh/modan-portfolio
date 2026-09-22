# MODAN visual foundation

White paper, forest-green ink, photography. The light theme is the default;
set `data-theme="dark"` on the root HTML element for the nighttime palette.
Typography, spacing, widths, and motion values live alongside colors in
`tokens.css`. `global.css` imports them through the shared Astro layout.

## Typography

The site uses local-first book faces: a readable old-style serif stack for body copy, a more expressive editorial serif stack for display text, and a dedicated Song-style CJK stack. Latin italics use real italic faces rather than synthetic obliques. Simplified Chinese remains upright and uses sesame emphasis marks for semantic emphasis. Regular, medium, and strong weights are limited to 400, 500, and 600 so hierarchy remains quiet and print-like.

Kerning, optical sizing, and common ligatures are enabled globally. Dates, tables, and code use lining tabular numerals. Code retains a separate local monospace stack.

## Color roles

- `--color-bg`: dominant page canvas. Most content sits directly on it.
- `--color-surface`: occasional secondary sections, not repeated cards.
- `--color-text`: primary typography.
- `--color-text-muted`: captions, dates, locations, image numbers, metadata,
  and inactive navigation on the page canvas.
- `--color-primary` and `--color-primary-hover`: small interactive details.
- `--color-primary-soft`: sparse selected/hover backgrounds. Dark mode reuses
  its surface token rather than inheriting the light green fill.
- `--color-link`, `--color-link-hover`, and `--color-link-decoration`: semantic
  inline-link ink and underline colors for each theme.
- `--color-border`: decorative separators; not the sole indicator of a control.
- `--color-overlay`: the supplied theme-specific overlay palette.
- `--color-lightbox-overlay`: the brief's explicit lightbox background,
  `rgba(2, 7, 5, 0.97)`, in both themes. Future lightbox backdrops should use
  this token, with `--color-lightbox-text` and `--color-lightbox-text-muted`
  for controls. Do not place controls on panels or reduce text opacity.

Photographs retain natural proportions without filters or automatic color
extraction. Do not introduce decorative colors, shadows, gradients, rounded
cards, textures, or large green panels.

## Accessible pairings and states

The exact light muted color has 4.81:1 contrast on white, but only 4.44:1 on
the surface and 4.09:1 on primary-soft. Use `--color-text` or
`--color-primary` for text on those two light backgrounds; do not use muted
captions there. Primary text and interactive text exceed 4.5:1 on all three
light backgrounds. Dark muted text exceeds 6.9:1 on both dark backgrounds.

Inline links use a quiet underline that strengthens on hover and keyboard
focus; high-contrast preferences always receive a solid ink underline.
Navigation uses an underline on hover, keyboard focus, and `aria-current`.
Filter buttons can opt into `.filter` and indicate
selection using `aria-pressed="true"`, underlining, and weight as well as color.
Keyboard focus uses a visible outline. Motion honors reduced-motion settings.

## Interaction rhythm

Color, background, and control borders transition over 150ms with `ease`;
topic-card borders use 200ms. Hover feedback is restricted to fine pointers
that support hover. Press feedback changes the button background immediately,
and keyboard focus never waits for a transition. Reduced motion sets these
durations to zero. Avoid `transition: all`, image fades, zoom, lift, stagger,
and animated result reordering. Gallery filters and lightbox navigation update
immediately. Theme changes do not fade the page or its photographs.

These files establish foundations only; no pages, filter controls, theme toggle,
or lightbox behavior are implemented here. Future components must use tokens
and verify contrast on their actual backgrounds, particularly over photography.
