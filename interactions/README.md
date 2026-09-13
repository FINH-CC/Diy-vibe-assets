# DIY Vibes — UI Animations (interactions)

A real, editable Vite + React + TypeScript app containing the actual DIY Vibes
prototype pages — not recordings or embeds. Source pulled from
[`alexisbardini/diyvibes`](https://github.com/alexisbardini/diyvibes) on
`origin/main`, under `src/app/ui-animations/`.

## Structure

```
src/
  App.tsx                        HashRouter + one <Route> per page number
  main.tsx                       Entry point, imports styles/globals.css
  styles/globals.css             Real diy.org design tokens, pulled from
                                  DIYVIBES/src/app/globals.css
  components/ui/Button/          The real shared Button component
  pages/ui-animations/
    page.tsx                     Page 1 (root — Publish button entry)
    2/ .. 17/                    Pages 2-17, each page.tsx + its .module.css
    PageNav.tsx                  The 1-17 page-number strip
    CursorScreen.tsx             The custom-cursor wrapper + on/off toggle
public/
  fonts/                         Real self-hosted Museo Sans Rounded woffs
  images/                        Real images (safetube, starters, QR codes)
  videos/                        Real mascot/demo video clips
```

Each numbered page matches the same number in the dashboard's
`assets/items.js` (`live: N`) one level up.

## Running it

```bash
npm install   # first time only
npm run dev   # live-reloading dev server
npm run build # regenerates dist/ — this is what the dashboard cards open
```

The dashboard's cards link straight to `interactions/dist/#/<N>`,
opened full-screen in a new tab (the same way the Capybara Obby game link
works). **Any time you change something here, run `npm run build`** or the
dashboard will keep showing the old version.

## Why Vite instead of Next.js

The original pages are Next.js (App Router). They were ported to plain
Vite + React because:
- No server is needed — `dist/` is static files, servable from anywhere
  (including nested under another site, which is what the dashboard does)
- Hash-based routing (`#/9` not `/9`) so it survives being opened from a
  path with no server rewrite rules configured, or straight off disk

The port only touched Next.js-specific APIs, nothing else:
- `next/link` + `usePathname` → `react-router-dom`'s `Link` + `useLocation`
- `next/image` → plain `<img>` (two `fill`-mode images got explicit
  `position: absolute; inset: 0` styles instead)
- `next/font/google` (Nunito) → a Google Fonts `@import` + a `.nunito`
  utility class in `globals.css`
- Any hardcoded absolute path (`"/images/..."`, `"/videos/..."`) →
  `` `${import.meta.env.BASE_URL}images/...` `` — this one matters: an
  absolute `/images/...` path resolves against the *domain* root, which
  breaks the moment this app is nested under `/diy-vibes-assets/interactions/`
  instead of served from `/`. If you add a new page and copy-paste an
  absolute asset path from the original source, it will 404 in exactly
  this way — always route it through `import.meta.env.BASE_URL`.

## Pulling a fresh copy of a page from GitHub

To resync one page with upstream (get a fix or new content without
re-doing the whole port), pull just that folder without touching your
local DIYVIBES checkout:

```bash
git -C /path/to/DIYVIBES archive origin/main -- src/app/ui-animations/9 \
  | tar -x -C /tmp/pull
cp /tmp/pull/src/app/ui-animations/9/* src/pages/ui-animations/9/
```

Then re-apply the fixes above to whatever changed, and rebuild.

## Duplicating a page / adding a new one

1. Copy a numbered folder, e.g. `src/pages/ui-animations/9/` → `.../18/`
2. Add `<Route path="/18" element={<Page18 />} />` in `src/App.tsx`
   (import it the same way the others are imported)
3. `npm run build`
4. Add a matching entry to `assets/items.js` one level up (`live: 18`)
