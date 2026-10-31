# Yedok' Sport Cup — Next.js scoreboard

The original single-file broadcast scoreboard, rebuilt as a real Next.js app.

**Next.js 16 (App Router) + React 19 + TypeScript, no database.** The scoreboard is the product: two live fixtures, four goal signatures, a ticker and a design studio — all running in the browser with the state kept in `localStorage`.

## Routes

| Route | Type | What it is |
|---|---|---|
| `/` | static | Site home — hero, next kick-off, latest result, clubs, signatures, standings, stills |
| `/fixtures` | static | Schedule by matchday, results and a computed table |
| `/teams` | static | The four clubs |
| `/teams/[slug]` | SSG (4 pages) | Club page: record, fixtures, palette, signature, form |
| `/board` | dynamic | **The scoreboard** — the ported original, full-bleed |

## The scoreboard

`/board` is the original `liga-malaysia-scoreboard.html` concept, ported to React:

- **Two fixture rails** side by side — crest, team, subtitle, live scoreplate, clock and status.
- **Four goal signatures** — Tiger Slash, City Pulse, Red Tide, Tidal Shift — one CSS block each, unchanged from the original artwork.
- **A full-screen takeover per goal.** The overlay reuses the same `<MatchRail>` component as the live board, so the celebration always shows the real score and clock, then wipes away to reveal the updated rail underneath.
- **Ticker** running underneath, plus the stadium background stack (aurora, halftone, crowd, field, grain, vignette).
- **Particles, sound and auto-demo** — confetti from each team's own palette, a Web Audio impact/noise/chime synthesiser, and an optional auto demo that cycles the signatures.

The stage is authored at a fixed **1600 × 900** and scaled with a transform to fit the viewport, exactly like the original. The stylesheet is the original CSS, extracted verbatim into `app/board/scoreboard.css`, so the design is identical rather than a reinterpretation. Only the font stacks are mapped onto the site's self-hosted faces.

### Controls

`1`–`4` trigger a goal · `Space` next signature · `A` auto demo · `M` sound · `R` reset · `D` design studio · `Esc` closes it.

### Design Studio

`D`, or the sliders button bottom-right, opens the local control room:

- **Brand** — interface accent (colour, hex, five presets), title lines, tagline, with the accent recolouring every line, highlight and the league mark.
- **Teams** — code, display name, subtitle, primary/deep/accent rail colours, crest replacement (scaled to 512 px and stored as a data URL), reset to the supplied crest, and a per-team goal preview.
- **Type** — display, broadcast and interface faces, plus team-name size.
- **Motion** — takeover hold, auto-demo gap, particles on/off, live goal preview.
- **Export config / Import / Reset** — the whole design as JSON; everything is saved to `localStorage` as you edit.

### Capture and embed modes

- `?capture=jdt` (or `klc`, `sel`, `tfc`) freezes a takeover mid-animation — `&t=1200` picks the millisecond. The page pauses every animation through `document.getAnimations()`.
- `?autoplay=0` opens with the auto demo paused.
- `?studio=1` opens with the Design Studio already up.
- `?chrome=0` hides the site-side buttons for clean stills and embeds.

## Local development

```powershell
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # production build
pnpm typecheck    # tsc --noEmit
```

Node 20+ is required. On this machine Node and pnpm are not on `PATH`; the harness runtime provides them:

```powershell
$node = "C:\Users\Mar Faiz\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\node\bin\node.exe"
$pnpm = "C:\Users\Mar Faiz\.dsh\dsh-runtimes\dsh-primary-runtime\dependencies\pnpm\bin\pnpm.mjs"
& $node $pnpm install --node-linker=hoisted
& $node "node_modules\next\dist\bin\next" build
```

Two notes about that environment:

- `--node-linker=hoisted` is required locally: pnpm's Windows junctions break Turbopack module resolution. Vercel uses its own default linker and is unaffected.
- Set `NEXT_SKIP_TYPE_CHECK=1` when building here. Next runs its type checker in a child process, which the sandbox blocks; run `pnpm typecheck` separately. Vercel never sets this, so CI keeps full type checking.

## Deploying

`vercel.json` pins the framework and the pnpm commands, so the project does not depend on whatever preset the dashboard has stored. A push to `main` promotes production; any other branch gives a preview URL. `.vercelignore` keeps `unedited/` and `production/` out of the upload.

## Stylesheets are route-scoped

Global CSS is split on purpose: the site chrome lives in `app/(site)/site.css`, imported only by the site layout, and the scoreboard brings `app/board/scoreboard.css`. Neither route inherits the other's layout rules — which matters, because the original stage positions `.hero`, `.fixtures` and `.ticker` absolutely at fixed 1600 × 900 coordinates.

## `production/` — the film-making material

Not part of the site and not deployed. It holds the original static scoreboard and ad-production pages plus their masters, kept because they are how the films were cut:

- `liga-malaysia-scoreboard.html` — the original single-file board this port is based on.
- `pitch-ad.html`, `short-ad.html` — the 60s and 30s production beds.
- `yedok-sport-cup-30s.mp4`, `hari-bola-scoreboard-ad.mp4`, `liga-malaysia-motion-reel.mp4`, posters, `.srt` captions.
- `stills/`, `assets/` — original crests, goal stills and device art used by those pages.

`unedited/` sits alongside it: raw screen recordings and soundtrack audio, git-ignored and never deployed.

## Notes

- Crest artwork was supplied for this concept; all club marks and trademarks remain the property of their respective owners. This is not an official league or club broadcast.
- Type is Anton (display), Barlow Condensed (labels) and JetBrains Mono (numerals), loaded through `next/font` so it self-hosts.
