# DIY Vibes — Prototype Library

A dashboard of DIY UI prototypes: a playable Capybara Obby game, plus 17 real,
editable UI animations. Every card opens the real thing full-screen — nothing
here is a video recording or an embed of someone else's site. Full details in
[README.md](README.md) and [interactions/README.md](interactions/README.md);
this file is the fast-orientation summary.

## Structure

```
index.html            Dashboard (plain HTML/CSS/JS, no build step)
assets/items.js        Single source of truth for what's on the dashboard
assets/videos/         Hover-preview clips · assets/posters/ their still frames
assets/game/            Capybara Obby, self-contained
interactions/           Real Vite + React app — the 17 animations (has its own
                         package.json, build step, and README.md)
```

## Non-obvious things that will bite you

- **`interactions/dist/` is committed to git**, unlike a normal Vite project.
  The dashboard links straight to those static files; nothing builds them on
  deploy. **Run `npm run build` inside `interactions/` after any change there
  and commit the result**, or the live site keeps showing the old version.
- **Any absolute path in an `interactions/` page 404s.** `"/images/..."` and
  `"/videos/..."` resolve against the domain root, not this app's folder —
  breaks the moment it's nested under `/interactions/`. Always write
  `` `${import.meta.env.BASE_URL}images/...` `` instead.
- **Routing is hash-based** (`#/9`, not `/9`) on purpose — it survives static
  hosts that don't have rewrite rules, and page loads straight off disk.
  Page 1 is registered at *both* `/` and `/1` in `App.tsx` — don't remove
  the `/1` route, the dashboard links to `#/1` like every other card.
- **Dashboard cards use static posters, not live video, at rest.** Chrome
  caps how many `<video>` elements can hold an active decoder at once;
  eagerly loading all 17 (even staggered) leaves later ones stuck forever.
  Video only loads on hover and is released on `mouseleave`.
- **`index.html` self-heals a missing trailing slash** (some static servers
  serve the directory's `index.html` without redirecting to add `/`, which
  breaks every relative path on the page). Don't remove that inline script.
- **This project's own repo and the upstream `alexisbardini/diyvibes` repo
  are different things.** The 17 animations were ported *from* diyvibes;
  don't link back to it as if it were this project's source (footer/README
  should point at this repo).

## Common commands

```bash
# Rebuild the animations app after editing anything in interactions/src/
cd interactions && npm run build

# Generate a poster (still frame) for a new video — no ffmpeg needed
qlmanage -t -s 600 -o assets/posters assets/videos/18-my-new-thing.mp4
mv assets/posters/18-my-new-thing.mp4.png assets/posters/18-my-new-thing.png

# Preview the whole thing locally (index.html needs an HTTP server, not file://,
# once interactions/ is involved)
npx serve .
```

## Safe to allow without asking

Read-only or fully local/reversible — fine to auto-approve in a permissions
config: `npm run build` and `npm run dev` inside `interactions/`, `npm install`
inside `interactions/`, `qlmanage -t ...` (poster generation), `git status`,
`git diff`, `git log`, `git add`. Treat `git push` and any GitHub/Vercel API
call as needing a heads-up first — this repo lives under the FINH-CC org, not
a personal account.
