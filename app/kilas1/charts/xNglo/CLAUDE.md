# app/kilas1/charts/xNglo — orientation

Kid-facing tappable xNglo alphabet chart. Read the root `CLAUDE.md` first
for project-wide context (esp. "hscii font system").

## Data model

`TILES: Tile[]`, one entry per xNglo sound (swar/vowels + vyanjan/
consonants). Each tile has `examples: WordExample[]` — **not** a single
word. Tapping a tile opens a popup carousel over that array (swipe /
arrow buttons / dot indicator). Only `x` currently has a full 6-word
carousel (`xnt, xxpxl, xnar, xnda, xmruuq, xnanas`); every other letter
has a 1-item array via the `one(translit, gloss, emoji)` helper. That's
not a design limit — it's just that only `x` has been fully built out.
Extending another letter to multiple examples means adding more objects
to its `examples` array, same shape as `x`'s.

## Why pictures are real image files, not emoji characters or drawn icons

Two independent reasons, both hit during actual development, not
theoretical:

1. The site's font picker (`components/hsciifp/LocalFontPicker.tsx`)
   can swap the page's font-family to a custom hscii font with no emoji
   glyphs — raw emoji **characters** in the DOM would silently vanish.
2. The user explicitly rejected a hand-drawn SVG icon substitute for
   "pomegranate" — asked for a **real image**, not an icon. There is no
   Unicode emoji for pomegranate (checked) or guava, so those five (`x`
   group) use real CC-licensed photos from Wikimedia Commons via the
   `wm()` helper (`Special:FilePath` redirect — resolves regardless of
   the file's actual storage hash, more stable than hardcoding the
   `/thumb/.../hash/` path).

`tw()` (Twemoji PNGs, pinned to `@14.0.2` for stability) is used for
every other letter's single placeholder example — still a real picture
file, just simpler illustration than a photo. If extending a letter to
multiple real photos later, follow `x`'s pattern with `wm()`, not `tw()`.

## No Devanagari

Explicit user instruction: no Unicode Devanagari anywhere on this page.
Words are shown only as xNglo-romanised `translit` strings (e.g. `xnar`,
not `अनार`). Also consistent with the hscii font point above — Devanagari
Unicode wouldn't render as anything meaningful under a swapped hscii font
either.

## Font

No hardcoded `font-family` — deliberately removed. Relies entirely on
`globals.css`'s `!important` override to `var(--current-active-font)`,
which the user's `LocalFontPicker` controls globally. Don't reintroduce
a local font override here without checking with the user first — they
were explicit ("font thing do not worry").
