# translet-xnglo — orientation for Claude

Read this first. It's written so a new session can get productive in one
read instead of re-deriving the project from scratch.

## What this is

A Next.js 14 (App Router) app doing two things:

1. **Translator** (`/kilas6/translet_suzect/translet_lesson`, formerly the
   site's `/`): converts between English, Hindi (Devanagari), and two
   custom romanised scripts the user invented — **xnglo_inglish** and
   **xnglo_vinqi**. See "The xNglo scripts" below.
2. **K12** (`/`, the root page): a small tree of kid-facing lessons
   (kilas → subject → lesson), currently just the xNglo alphabet chart.

The user (repo owner) writes to Claude in their own phonetic-romanised
English/Hindi mix throughout chat and code comments — spellings like
`suzect` (subject), `vlp` (help), `qis` (this), `xnglo` are intentional,
not typos. Mirror it lightly if replying inline in the repo's own
style, but don't "fix" it.

## The xNglo scripts

Two custom alphabets, not standard transliteration schemes:

- **xnglo_inglish** — English romanised into a reduced 23-letter set
  (`v→w`, `j→z`, `q→k`, no capitals), then remapped onto a 38-character
  xNglo alphabet (`a-z` plus `B C D G J K N Q R S T Z`).
- **xnglo_vinqi** — the same 38-char xNglo alphabet, but as the direct
  target of Devanagari Hindi transliteration.

Pipeline (documented in `md/xngloBasae.md`):
```
English(52) -> english(23, lowercase, v/j/q substituted)
english(23) -> xNglo_inglish(38)
xNglo_inglish -> xNglo_vinqi(38)      [mapping #4 -- NOT YET WIRED]
हिंदी (Devanagari) -> xNglo_vinqi(38)  [working]
```

Status: Hindi→xnglo_vinqi and English→xnglo_inglish work. Mappings #3
(English→xnglo_vinqi direct) and #4 (xnglo_inglish→xnglo_vinqi) are
stubbed in the UI. Char maps live in `lib/mappings.ts` (also per-script
duplicates like `lib/vinqi_tu_xv38_mapping.ts`); conversion logic is in
`lib/transliterate.ts`. `lib/transliterate.ts`'s `hindiToXngloVinqi()` is
the **authoritative** mechanical transliteration function — if reasoning
about a Hindi conversion, read that function rather than reconstructing
rules from memory or from a chat description.

The xNglo digit alphabet (separate from the letter scripts, used
elsewhere in the user's other projects too, e.g. their `plong`/`cllong`
Rust numeric type) is hex `0123456789LYVWPF` (L=10 ... F=15).

Deeper notes: `md/*.md` (esp. `xngloBasae.md`, `xngloipa.md`), and the
shared Drive folder linked in `README.md`.

**Planned migration**: the user is improving a separate library,
[htrlib](https://github.com/zawa8/htrlib) (npm:
[htrlib](https://www.npmjs.com/package/htrlib)), and intends to switch
this app's transliteration over to it once it's ready. Until that
happens, `lib/mappings.ts` / `lib/transliterate.ts` remain the live
source of truth — don't assume htrlib is wired in yet unless told so,
but also don't invest heavily in expanding the current hand-rolled maps
without checking whether htrlib has since taken over.

## hscii font system

`components/hsciifp/` holds custom fonts (`englosoftw8`, etc.) that
visually render xNglo/Latin text as xNglo glyphs — a font substitution
trick, not a Unicode block. `LocalFontPicker.tsx` lets the user swap the
active font; `globals.css` forces `font-family: var(--current-active-font)
!important` onto most text elements (`div, h1, h2, button, p, span, ...`)
so **don't hardcode a font-family in page-level CSS** — it'll be
overridden anyway, and fighting that override wastes a turn. Also:
raw Unicode emoji can vanish under these custom fonts (no emoji glyphs),
so pictures in kid-facing pages should be real `<img>` files (Twemoji PNGs
or similar), never rendered emoji characters. See
`app/kilas1/charts/xNglo/CLAUDE.md` for how this played out concretely.

## Routes (current)

| Route | What |
|---|---|
| `/` | K12 tree page: 3 cascading `<select>`s (kilas → subject → lesson), navigates to the picked lesson's `href` on selection. Data is the `K12_TREE` object at the top of `app/page.tsx` — add a kilas/subject/lesson by adding a nested entry there, nothing else needed. |
| `/kilas1/charts/xNglo` | xNglo alphabet chart for kids — tappable letter tiles, swipeable multi-image popup. See its own `CLAUDE.md`. |
| `/kilas6/translet_suzect/translet_lesson` | The translator (formerly site root). |
| `/kilasall/subzectwords/lesson_wrdmining` | TSV dataset viewer (formerly `/tsv-view`). |

**Route naming isn't hierarchical by folder alone** — `kilas1`, `kilas6`,
`kilasall` are independent top-level route trees, not nested under a
common `kilas/` parent. Don't assume otherwise when adding new ones;
check `K12_TREE` in `app/page.tsx` for the canonical map of what actually
exists and where it points.

## Repo-specific gotchas (hit these already, don't re-discover them)

- **Dev environment is Windows + OneDrive-synced folder** (path looks
  like `~/OneDrive/Desktop/.../translet-xnglo`, git bash / MINGW64).
  OneDrive sync is a known source of stale/locked files confusing
  Next.js's dev-server file watcher — if a new route 404s despite the
  file existing, the fix is usually `rm -rf .next` + restart `pnpm dev`
  before anything more exotic.
- **Route folder casing matters**: `xNglo` (capital N, G) is a real,
  intentional folder name, not `xnglo`. Windows filesystems are
  case-insensitive so this is easy to typo without noticing locally.
- **No push access from a sandboxed Claude session** — if working from
  an ephemeral clone (e.g. Claude's own sandbox), you can commit locally
  but `git push` will fail (no stored credentials). Hand back changed
  files for the user to place manually, or a full `app.zip`, rather than
  claiming a push succeeded.
- **Git identity**: prior commits are authored as
  `xqijy pvuza pxhuza <heksadesiml@gmail.com>` — match it
  (`git config user.name/user.email`) rather than leaving `root@...`
  from a fresh sandbox.
- Current work branch: **`k12`**.

## Everything else in the repo

- `lib/` — mapping tables + transliteration logic (see above).
- `components/` — `TsvViewer.tsx`, `SpeechButton.tsx`, `hsciifp/` (fonts).
- `data/` — the TSV/CSV word-list actually used by the running app
  (`3k_local_copy.tsv`, `xNglofonetiks.csv`).
- `dxta/`, `pys/` — **scratch/working data + Python pipeline scripts**,
  not part of the deployed app. Large, messy, lots of `- Copy` duplicate
  files — this is the user's data-prep workspace for building out the
  word lists that eventually land in `data/`. Don't assume anything here
  is wired into the app; check `data/` for what's actually live.
- `md/` — the user's own working notes on the xNglo scheme (Hinglish,
  informal, written to self/Claude, not polished docs).
- `Linux_Language_Packs/` — a separate side-task (building an `e23`
  Linux Mint language pack), unrelated to the Next.js app.

## Build / run

```
pnpm install   # or npm install
pnpm dev       # http://localhost:3000
pnpm build     # verify before handing back any change
```

Always run `pnpm build` (or `npx next build`) after editing before
considering a change done — this repo has caught real bugs (missing
digit-width padding, wrong sign on split limbs, etc. in the sibling
`plong` project) that only surfaced by actually compiling/running, not
by reading the diff.
