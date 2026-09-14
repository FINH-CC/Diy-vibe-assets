# DIY Vibes — Prototype Library

A dashboard of DIY UI prototypes: a playable Capybara Obby demo, plus a set of real,
editable UI animations. Every card opens the real thing full-screen — nothing here is
a video recording or an embed of someone else's site.

Picking this up with an AI coding assistant? Read [CLAUDE.md](CLAUDE.md) (or its
identical twin [AGENTS.md](AGENTS.md) for Codex) first — it's a short list of the
non-obvious gotchas this project has already hit once.

## Quick start

Requires [Node.js](https://nodejs.org) (any recent version — this was built and
tested on Node 24).

```bash
git clone git@github.com:FINH-CC/Diy-vibe-assets.git
cd Diy-vibe-assets
npx serve .
```

(A real server, not double-clicking `index.html` — the game and animations
both need one.)

Open the URL it prints. Everything — the game and all 17 animations — works
immediately; nothing needs to be built first, since the animations' built
output (`interactions/dist/`) is committed to the repo.

**To customize an animation** (not just browse it), you additionally need:

```bash
cd interactions
npm install
npm run dev      # live-reloading editor preview
```

See [interactions/README.md](interactions/README.md) for what to edit.

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
