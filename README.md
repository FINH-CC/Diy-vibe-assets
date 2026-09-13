# DIY Vibes — Prototype Library

A dashboard of DIY UI prototypes: a playable Capybara Obby demo, plus a set of real,
editable UI animations. Every card opens the real thing full-screen — nothing here is
a video recording or an embed of someone else's site.

## Structure

```
index.html          Dashboard — reads assets/items.js and renders all cards
assets/
  items.js           Single source of truth for what shows up on the dashboard
  site.css            Shared dashboard styles
  videos/             Short .mp4s — hover-play preview on each card
  posters/            One still frame per video — the card's at-rest thumbnail
  game/                Capybara Obby (self-contained, needs internet for Three.js CDN)
interactions/         Real, editable Vite + React app — the 17 UI animations.
                       See interactions/README.md (also linked from the dashboard's
                       "Instructions" button) for structure, pulling updates from
                       GitHub, and duplicating or adding a page.
```

## Adding a new animation

1. Build the real interactive page in `interactions/` (see `interactions/README.md`)
   and `npm run build` there.
2. Drop a short `.mp4` into `assets/videos/`, then generate its poster (the
   at-rest thumbnail — no `ffmpeg` needed, macOS's own QuickLook does it):
   ```bash
   qlmanage -t -s 600 -o assets/posters assets/videos/18-my-new-thing.mp4
   mv assets/posters/18-my-new-thing.mp4.png assets/posters/18-my-new-thing.png
   ```
3. Add one entry to the `CLIPS` array in `assets/items.js`:
   ```js
   { file: "18-my-new-thing.mp4", title: "My new thing", desc: "One line about what it shows.", live: 18 }
   ```
4. Done — it appears on the dashboard and opens `interactions/dist/#/18`
   full-screen in a new tab, the same way the game card does.

## Changing the featured demo

Edit the `GAME` object at the top of `assets/items.js` (title, tags, description, cover
image, and link).

## Running it locally

`index.html` uses a plain `<script src>` (no `fetch`/modules), so it works opened
directly from disk. The Capybara Obby game and the `interactions/` app both need an
actual HTTP server (not `file://`) — the game imports Three.js as an ES module from a
CDN, and `interactions/` is nested under a path that isn't the server root:

```bash
npx serve .
```
