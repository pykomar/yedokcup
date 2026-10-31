# Yedok' Sport Cup — Next.js app

A broadcast scoreboard concept turned into a real site: **Next.js 16 (App Router) + React 19 + TypeScript**, no database.

The four clubs, their palettes and their goal signatures are content. The matchday board is a client component with browser-only state — trigger a goal, watch the takeover, reload and the score is exactly where you left it.

## Routes

| Route | Type | What it is |
|---|---|---|
| `/` | static | Home — hero, next kick-off, latest result, clubs, signatures, standings, stills |
| `/fixtures` | static | Schedule by matchday, results and a computed table |
| `/teams` | static | The four clubs |
| `/teams/[slug]` | SSG (4 pages) | Club page: record, fixtures, palette, signature, form |
| `/board` | dynamic | The live board and the four signature previews |

The standings, form strings and next/last fixture are derived from the seed results in `lib/data.ts` at request time — there is no CMS and no database.

## The board

`components/scoreboard/board-experience.tsx` owns the match state:

- **Goal buttons** for the two teams in the fixture (`1` / `2` on the keyboard).
- **Clock** that runs while live, `Space` toggles it.
- **Four signature takeovers** — Tiger Slash, City Pulse, Red Tide, Tidal Shift — one CSS block each in `globals.css`.
- **Persistence** in `localStorage` under `ysc:board:<home>-<away>:v1` (score, goal count, sound). No cookies, no server, nothing leaves the browser.
- **Sound** synthesised with the Web Audio API, muted until you turn it on.

The stage is authored at a fixed **1600 × 900** and scaled with a transform to fit its frame, the same way the original broadcast bed worked. That keeps every size exact at any width.

### Capture mode

- `/board?preview=ult` (or `yd`, `avr`, `isb`) plays that signature on load — handy for screenshots.
- `/board?embed=1` drops the page chrome and fills the viewport, so the board can be dropped into an OBS browser source or an iframe.

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

`vercel.json` pins the framework and the pnpm commands, so the project no longer depends on whatever preset the dashboard has stored. A push to `main` promotes production; any other branch gives a preview URL.

`.vercelignore` keeps `unedited/` and `production/` out of the upload entirely.

## `production/` — the film-making material

Not part of the site and not deployed. It holds the original static scoreboard and ad-production pages plus their masters, kept because they are how the films were cut:

- `liga-malaysia-scoreboard.html` — the original single-file board (Design Studio, capture modes).
- `pitch-ad.html`, `short-ad.html` — the 60s and 30s production beds.
- `yedok-sport-cup-30s.mp4`, `hari-bola-scoreboard-ad.mp4`, `liga-malaysia-motion-reel.mp4`, posters, `.srt` captions.
- `stills/`, `assets/` — original crests, goal stills and device art used by those pages.

`unedited/` sits alongside it: raw screen recordings and soundtrack audio, git-ignored and never deployed.

## Notes

- Crest artwork was supplied for this concept; all club marks and trademarks remain the property of their respective owners. This is not an official league or club broadcast.
- Type is Anton (display), Barlow Condensed (labels) and JetBrains Mono (numerals), loaded through `next/font` so it self-hosts.
