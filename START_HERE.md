# START HERE - briefing for a new Claude session

Last updated 2026-11-19. If this file and the code disagree, trust the code and fix this file.

## 0. How the user starts a new session (read this if you are a fresh session)
- New video: `bash Animation/new-video.sh "Video 2"`, then the user opens Claude in that new folder. Memory is per folder, so a fresh folder has NO memory: everything you need is in `CLAUDE.md` (auto-loaded), this file, the skill `cartoon-explainer-clip` (global) and the docs listed below.
- Scripts/titles: use the skill `/video-script-writer` (it reads PACKAGING_PLAYBOOK.md + SCRIPT_TEMPLATE.md + VOICES.md, never writes a script until asked). Typical first messages from the user: "Plan a video: <premise>" (-> `PACKAGING_PLAYBOOK.md` + `SCRIPT_TEMPLATE.md`: 10 titles, thumbnail concept, script outline), "Make clip N" (-> workflow in section 2), "Make a thumbnail for <title>" (-> `PACKAGING_PLAYBOOK.md` thumbnail rules + mascot; use `python3 Animation/thumb.py specs/thumb_xxx.json name` (see LIBRARY.md Thumbnails section)).
- Read order: CLAUDE.md -> START_HERE.md -> LIBRARY.md (scenes, envs, props, mascot options) -> STYLE_RULES.md -> PACKAGING_PLAYBOOK.md -> VOICES.md. Pictures: LIBRARY_CATALOG.png and docs/.

## 1. What this project is
A 2D cartoon YouTube explainer made with HyperFrames (HTML rendered to video). 32 clips, one per voice-over chunk (~30 s each).
Clips 1-22 are hand-built (`clip-01`..`clip-22`); clips 23-32 were built from the scene library via `specs/clipN.json`. All rendered to `renders/Clip N.mp4`.
Inputs (one level up): `Voice-overs Chunks/Clip NN - Voice-over.mp3` (the user's own narration) paired by number with `Transcript Chunks/VO_NN.txt`.

## 2. Make a clip (the whole workflow)
```
bash Animation/new-clip.sh N                 # scaffolds clip-NN, copies the kit, times every word (vo.words.json)
# write Animation/specs/clipN.json (see LIBRARY.md; scene times can be spoken phrases)
python3 Animation/scene.py N Animation/specs/clipN.json
bash Animation/render-clip.sh N              # checks (errors only) and renders; run in background (~1-2 min)
```
Then send `Animation/renders/Clip N.mp4` with SendUserFile. `new-clip.sh` copies the latest `_kit/*.js`; if you change the kit later, copy `_kit/toon.js` / `scenes.js` into `clip-NN/assets/` before re-rendering.
Needs: Node (npx hyperframes), Python 3 (`python3` works in Git Bash), ffmpeg.

## 3. The library (`_kit/`)
- **Hero**: `style:"mascot"` - cream head with a curl, glossy eyes, yellow hoodie. Views `front|q3|side|back`, `dir:"left|right|away|toward"`, walking `walk:[t0,t1,dx]`. `vol:true` (semi-3D shading, off by default), `turns` (smooth head turn), `age` option (grey hair, wrinkles, glasses, stoop, cane; docs/MASCOT_AGES.png) for Day-N aging, 12 expressions via `say` (`happy joy love crying sad nervous scared angry dizzy mindblown shocked smug sleepy scream explain`). Pear characters (`style:"pear"`) = supporting cast (hats, moustache, glasses).
- **Talking close-ups**: `say:[{char,emotion,at:"spoken phrase"}]` -> face, brows, arms, mouth flaps, camera close-up with blurred+darkened background.
- **Environments (`bg`)**: street (day/dusk/night), railway, harbor, dayCloud, buildSite, neonNight, officeNight, office1925, serverHall, bedroom, kitchen, classroom, hospital, livingRoom (day/night), factory, lab, stadium.
- **Props**: car bus truck train plane bike boat (wheels spin), factoryLine robotArm serverRack labBench controlPanel.
- **Crowds / groups / weather**: `crowd`, `group`, `weather: rain|snow|fog|sunrise|stars`, `exposure`, `lights`, `camMoves`, `theme:"google"`.
Cheat sheet with JSON examples: `LIBRARY.md`. Picture catalog: `LIBRARY_CATALOG.png`. Mascot sheets: `docs/`.

## 4. Style (measured from the user's favourite videos)
`STYLE_RULES.md`: ~40-46 cuts/min, slow push-in ~2%/s, cuts on voice pauses, glow centred, vignette, muted-warm colour (saturation 0.3-0.45; `new-clip.sh` writes `saturate(0.85)`), <35% flat fills, thin outlines, subject brightest in close-ups, dark moody rooms. Never copy other creators' characters/art/audio.

## 5. Voices (Fish Audio) - nothing generated yet
`VOICES.md` has the 4 voice ids (mascot + 3 side voices), API cheat sheet, emotion-tag map. Other characters speak only a few short lines (<=8 words), so no more voices are needed. Do not generate audio without the user's go-ahead; API key only in env var `FISH_API_KEY`. Fish free plan is non-commercial; two voices imitate third-party IP - warn before monetised use.

## 6. Titles / thumbnails / script packaging
Full playbook: `PACKAGING_PLAYBOOK.md`; script outline with timings: `SCRIPT_TEMPLATE.md`. The channel is NOT about tech/news (Nvidia was just video 1); it tests hypothetical-premise videos for maximum reach, without "What If" in every title.
Skill section "Titles and thumbnails": rule + catch + specific number; title and thumbnail say different things; mascot big bottom-left, 2-4 giant words top (white + one yellow word), escalation split panels, one strong emotion, neon-purple/yellow palette (`neonNight`). Titles should not start with "What If".

## 7. GitHub backup
Repo: https://github.com/abidhabib/animation_skill_2d_mascoat (root = this `Animation/` folder). Excluded by .gitignore: renders, `clip-*/`, `thumbnail/`, media. Copy the live skill (`~/.claude/skills/cartoon-explainer-clip/SKILL.md`) into `skill/` before committing. Ask the user before pushing.

## 8. Not built yet (ideas, in rough priority)
1. Fish voice pipeline (tagged script -> per-line TTS -> mix with narration) - needs user go-ahead + API key.
2. Smooth turn animation between views; side/back views for pear characters.
3. Lip-sync from audio loudness (mouth flaps are a fixed open/closed pattern now).
4. Reusable thumbnail scene type (current sample was a one-off).
5. Re-render older clips in the new style only if the user asks.

## 9. Gotchas learned (save time)
- Never tween x/y/rotation on an element that has a `transform` attribute: wrap it in a plain `<g>`.
- `scene.py` copies `scenes.js` only; copy `toon.js` yourself when it changed.
- Seek-safe only: no `Math.random` (use `T.rng(seed)`), finite `repeat`, no timers.
- Windows: patch big files with a Python script saved via the Write tool (heredocs with quotes can break); ffmpeg `drawtext` breaks on `%` and `:` in text and needs `fontfile='C\:/Windows/Fonts/arial.ttf'`.
- Test clips: build as `clip-90+` and delete afterwards; use numbers 90+ inside any project.
- The lint warning about a template-literal selector in render output is old and harmless.
