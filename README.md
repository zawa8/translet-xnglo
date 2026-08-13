# translet-xnglo

conwerter bitwin English, Hindi (Devanagari), and the two xnglo romanisations.

## What's working now

- Hindi → xnglo_vinqi (full character mapping)
- English → xnglo_inglish (letter rules + word exceptions)

Mapping #3 (English → xnglo_vinqi) and #4 (xnglo_inglish → xnglo_vinqi) are stubbed —
the UI shows a "pending" note for those combinations until rules for them exist.
All rules live in `lib/mappings.ts`; the conversion logic is in `lib/transliterate.ts`.

## Run locally

```
pnpm install   # or npm install
pnpm dev       # or npm run dev
```

Open http://localhost:3000

## Push to GitHub

```
git init
git add .
git commit -m "initial translet-xnglo app"
git branch -M main
git remote add origin https://github.com/<your-username>/translet-xnglo.git
git push -u origin main
```

## Deploy to Vercel

1. Go to vercel.com, import the GitHub repo (same flow as the sanity_xnglo_skuul project).
2. Framework preset: Next.js (auto-detected). No env vars needed.
3. Deploy. Vercel gives a `*.vercel.app` URL by default — rename the project to `translet-xnglo`
   in project settings to get `translet-xnglo.vercel.app`, or add a custom domain if you own
   `translet.xnglo.com`-style domain.

## Next steps

- Finish mapping #3 and #4 in the source sheet, then add the rules to `lib/mappings.ts`.
- Wire `transliterate()` for those two pairs the same way the first two are wired.

## [claude](https://medium.com/@kumaran.isk/my-claude-code-setup-heres-what-i-learned-d0403b1b1fec)

## [gugxl draiw seyxrd folder for qis proz](https://drive.google.com/drive/folders/1F4S-hvAeYvQhPrZ8oYunqATdf2qyS409?usp=sharing) 
