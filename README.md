# YEDOK' SPORT CUP — Motion Scoreboard

A 16:9 broadcast-scoreboard concept for the Yedok' Sport Cup, built around four teams and four different goal reactions:

| Code | Team | Detail | Goal signature | Motion language |
|---|---|---|---|---|
| ULT | Ultimate Titan | Kejor Yeop Kejor | **Tiger Slash** | Hard diagonal cuts, comet sparks, a warped-in rail |
| YD | Yedok FC | The Huzz Hunter | **City Pulse** | Blue ring pulses, scanlines, glitch-lock |
| AVR | Avernus FC | Kuantan Golden Boy | **Red Tide** | Warm ribbon waves, flare, spring-bounce |
| ISB | ISBA FC | Islamic Finance Association | **Tidal Shift** | Gold tile field, hex shell, 3D flip |

Every goal is a full broadcast takeover: a new score, a unique motion cut, a live ticker update and a stamped scoreboard rail when the takeover wipes away.

> **Line-up note:** the live scoreboard and the new 30-second short use ULT / YD / AVR / ISB. The original 60-second film, silent reel and older preview files in this folder are the original Hari Bola cut, kept as completed examples of the system.

## Files

- `index.html` — the landing page served at `/` on Vercel; links the board, both films, the stills and the downloads.
- `.vercelignore` — keeps `unedited/` raw source and this README out of the public deployment.
- `liga-malaysia-scoreboard.html` — the interactive scoreboard.
- `assets/logos/` — current team crests (`ultimate-titan.png`, `yedok.png`, `avernus.png`, `isba.png`) plus the original supplied crests.
- `yedok-sport-cup-preview.png` — current Yedok' Sport Cup board at 1600×900.
- `yedok-sport-cup-goal-preview.png` — current ULT / Tiger Slash goal still.
- `yedok-sport-cup-signatures.png` — current four-team goal contact sheet.
- `yedok-sport-cup-studio-preview.png` — current Design Studio with the new line-up.
- `stills-yedok/` — current full-resolution goal stills: ULT, YD, AVR and ISB.
- `yedok-sport-cup-30s.mp4` — the current **30-second short**: 1600×900, 30fps, H.264 with stereo voiceover and music, 3D device mockups and a YD developer credit.
- `short-ad.html` — the 30-second film's production page: the 3D MacBook / iPad / iPhone scene, device screen art and the 30-second timeline.
- `yedok-sport-cup-30s-poster.jpg` — 16:9 poster / thumbnail frame from the 3D device scene.
- `yedok-sport-cup-30s.srt` — English captions for the 30-second short.
- `assets/short-ad/` — the recorded ULT goal clip and mobile screen art used by `short-ad.html`.
- `hari-bola-scoreboard-ad.mp4` — the original **60-second system film**: 1600×900, 30fps, H.264 with a stereo voiceover, music and sound-design mix.
- `pitch-ad.html` — the original ad's 1600×900 composition bed. It drives the live scoreboard inside an iframe and is useful as a starting point for a new cut.
- `hari-bola-scoreboard-ad-poster.jpg` — 16:9 poster / thumbnail from the original film's four-signatures montage.
- `hari-bola-scoreboard-ad.srt` — English captions for the original film.
- `liga-malaysia-motion-reel.mp4` — original 18.9s, 1600×900, 30fps silent motion reel.
- `goal-preview.webp` — original short animated preview of the JDT goal.
- `preview-scoreboard.png` — original clean 1600×900 Hari Bola board still.
- `studio-preview.png` — original Design Studio screenshot.
- `goal-signatures.png` — original four-up contact sheet.
- `stills/` — original full-resolution goal stills for JDT, KLC, SEL and TFC.

## The 30-second short

`yedok-sport-cup-30s.mp4` is the current fast-cut pitch for the Yedok' Sport Cup system:

1. **0–2.2s — Hook.** Yedok' Sport Cup / a bigger stage.
2. **2.2–5s — Board.** The live matchday board, then a quick title/team-rail zoom.
3. **5–8.25s — Goal.** ULT's Tiger Slash takeover, recorded from the real system.
4. **8.25–9.55s — Four signatures.** A one-second four-up of ULT, YD, AVR and ISB.
5. **9.55–13.95s — 3D devices.** MacBook, iPad and iPhone on a 3D stage, with the live board, a goal and the mobile social cut.
6. **13.95–17.15s — Design Studio.** The MacBook close-up shows the live customisation UI.
7. **17.15–20.15s — Workflow.** No After Effects, no render queue, one click.
8. **20.15–23.35s — Finale.** One system, every screen.
9. **23.35–26.55s — End card.** Yedok' Sport Cup. Own the moment.
10. **26.55–30s — Developer credit.** The supplied YD mark signs the film.

The short is mastered at 1600×900/30fps with stereo audio at roughly −14.4 LUFS and −1 dBFS true peak. The 3D device stage is authored in CSS; the ULT goal on the screens is a screen-recorded clip from the live scoreboard.

### Replaying or re-cutting the short

Open `short-ad.html` directly in a browser (local assets only), or serve the folder over HTTP if you prefer:

```powershell
python -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/short-ad.html
```

- The page auto-starts the 30-second timeline after load.
- `?record=1` waits for `window.ShortAd.start()` instead of auto-starting.
- `?still=hook`, `?still=board`, `?still=goal`, `?still=sigs`, `?still=devices`, `?still=studio`, `?still=features`, `?still=finale`, `?still=end` or `?still=credit` freeze a layout for screenshots.
- The developer credit uses the supplied `assets/logos/yedok.png` mark.

## The original 60-second Hari Bola film

This is the completed original cut, produced before the switch to the Yedok' Sport Cup line-up. It remains in the folder as a system-film reference; the live scoreboard uses the new teams.

`hari-bola-scoreboard-ad.mp4` is a one-minute pitch for the scoreboard system, cut around the live interface rather than a mock-up:

1. **0–5s — Hook.** Malaysian football deserves a bigger stage.
2. **5–13s — Reveal.** Meet Hari Bola; the broadcast board is shown live.
3. **13–16s — JDT.** Tiger Slash takes over the broadcast.
4. **16–21s — Four signatures.** JDT, KLC, Selangor and Terengganu in one four-up.
5. **21–28s — TFC + rail.** Tidal Shift and the live rail close-up.
6. **28–36s — Design Studio.** Colour, crest, type and timing controls are changed on camera.
7. **36–44s — Workflow.** No After Effects, no render queue, one click.
8. **44–51s — Outputs.** One match feed, broadcast / big screen / club channels.
9. **51–60s — End card.** Hari Bola. Own the moment.

The film is mastered at 1600×900/30fps with stereo audio at roughly −14.6 LUFS and −1 dBFS true peak. The voiceover was generated with an Edge TTS neural voice; the music and impacts are an original synthesised bed. The `.srt` is a matching caption sidecar.

### Replaying or re-cutting the ad page

`pitch-ad.html` is the production bed used to render the original film. It loads the live scoreboard in an iframe and runs the ten-scene timeline around it. Because it calls the scoreboard's JavaScript API, serve the folder over HTTP (or any local static server you already use) rather than opening the page from `file://`:

```powershell
python -m http.server 8765 --bind 127.0.0.1
# open http://127.0.0.1:8765/pitch-ad.html
```

- `?record=1` holds the page at the slate and waits for `window.Ad.start()` (used by the frame capture).
- `?smooth=1` is the capture-safe visual mode used for the final render: it keeps the live scoreboard painted at a stable scale, removes a few of the heaviest decorative filters, and holds the camera instead of re-scaling the iframe during the take. Without it, the page uses the richer camera moves.
- The scoreboard API is `window.HariBola` with `triggerGoal`, `resetDemo`, `openStudio`, `closeStudio` and `setStudioTab`.

> The ad page was built around the original Hari Bola line-up. Its iframe now loads the Yedok' Sport Cup defaults, so use it as a starting point for a new cut rather than a shot-for-shot rebuild of the existing film.

## Open and use

Open `liga-malaysia-scoreboard.html` in a current version of Chrome, Edge or another modern browser. Keep the `assets/logos/` folder beside the HTML file so the crest artwork loads. No internet connection or libraries are required.

**Controls**
- Click a team crest or one of the four **Goal Signatures** cards to score.
- `1` ULT · `2` YD · `3` AVR · `4` ISB
- `Space` trigger the next signature
- `A` toggle auto demo
- `M` toggle sound (synthesised with the Web Audio API; starts muted)
- `R` reset the scoreboard
- `D` open / close the Design Studio · `Esc` close it

Auto demo is on by default. The stage is authored at 1600×900 and scales to the browser window; it is best viewed in landscape or full-screen.

## Design Studio — edit without new prompts

Most routine art-direction changes can now be done directly in the page:

- Open the file and click the small sliders button in the bottom-right corner, or press `D`.
- Alternatively, open `liga-malaysia-scoreboard.html?studio=1` to launch with the panel already open.

**The four tabs**
- **Brand** — interface accent colour, title wording, tagline wording, hex input and accent presets.
- **Teams** — team code, display name, subtitle, primary/deep rail colours, signature accent, crest replacement/reset, and a live goal preview.
- **Type** — display face, broadcast face, interface face and team-name size.
- **Motion** — goal takeover hold, auto-demo gap, particles on/off, auto-demo control and live goal preview.

Changes update the scoreboard immediately. They are saved in this browser's local storage. The panel also includes:

- **Export config** — downloads a JSON file containing your current settings and any uploaded crests.
- **Import** — restores a previously exported JSON on this or another machine.
- **Reset** — clears the locally saved settings and returns to the original design.

Auto demo pauses while the studio is open and resumes when it closes. The stage slides left and scales down so the artwork stays visible next to the controls. See [studio-preview.png](studio-preview.png) for the layout.

**Important:** the studio saves to the browser, not into the HTML file itself. To archive or hand off a version, use **Export config** and import it where needed, or bake the values into the source when producing a final build.

## Editing the source directly

If you want permanent defaults or something the panel does not cover, search for these in `liga-malaysia-scoreboard.html`:

- `BASE_DESIGN` — the default accent, titles, tagline, fonts, team names/colours and motion timing.
- `FONT_PRESETS` — the faces listed in the Type tab. For a new custom typeface, add an `@font-face` rule in the CSS and add an option with that family stack.
- `.goal--jdt`, `.goal--klc`, `.goal--sel`, `.goal--tfc` — the four motion backgrounds and their palettes.
- `.match`, `.team`, `.scoreplate`, `.hero` — layout and size recipes.
- `assets/logos/` — default crest files. Replace a file while keeping its filename to change the default crest without touching the HTML.

The panel deliberately does not change the underlying layout or motion choreography — those are the parts that define the design. It handles the pieces you are likely to iterate on most: colour, typography, copy, crests, team identity and timing.

## Freeze frames / capture mode

Useful for exporting stills without timing the animation:

- `?capture=jdt&t=1000` — freeze the ULT / Tiger Slash goal at 1000ms into the takeover.
- Swap `jdt` for `klc`, `sel`, `tfc` or `idle`.
- The internal motion slots keep their original ids: `jdt` = ULT, `klc` = Yedok, `sel` = Avernus, `tfc` = ISBA.
- `?autoplay=0` — open with auto demo off.
- `?capture=jdt&t=700` etc. — the `t` value is in milliseconds.

Capture mode pauses all page animations at the chosen point, so it is deterministic for screenshots.

## Deploying to Vercel

This is a static site: **no build step, no framework and no `npm install`**. Vercel's "no framework detected" message is expected and harmless — it serves the files exactly as they sit in the repo.

- **Framework preset:** Other · **Build command:** empty · **Output directory:** empty (repo root).
- `index.html` is the entry point, so `/` resolves. Without it the deployment is live but the root path 404s, even though every `.html` file already works by name.
- `.vercelignore` drops `unedited/` (raw recordings and the soundtrack MP3) and `README.md` from the upload.
- Any push to `main` redeploys production; a push to another branch gives a preview URL.

## Design notes

- Custom vector league mark, scoreboard rails and background are all drawn in HTML/SVG/CSS; the four team crests are supplied transparent PNG/WebP artwork.
- Current team palettes: ULT red/gold, Yedok black/white with a cyan City Pulse accent, Avernus burgundy/gold, ISBA gold/maroon.
- Club crest artwork was supplied for this concept; all club marks and trademarks remain the property of their respective owners. The package is not an official league or club broadcast.
- The goal effect system lives in one CSS block per team; the board takeover is built from a clone of the live rail, so the score and clock are always in sync.
- The original 18.9-second scoreboard reel is silent. The original 60-second system film and the current 30-second short each have their own voiceover, music and sound design; the interactive page has optional synthesised goal audio.

Concept and motion study using the supplied team crests.
