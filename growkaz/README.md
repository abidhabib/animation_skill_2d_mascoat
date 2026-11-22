# NEW DEFAULT ENGINE (user 2026-11-21): GrowKaz engine + our own cast

From **V02 Clip 19 on**, every clip is made with the GrowKaz Stickman Studio engine (canvas 2D + Three.js, rendered
frame by frame in the user's Chrome) **but with the user's own cartoon characters** (`engine/toon2d.js`), not stick figures.
Clips 1-18 of V02 stay as they are (old HyperFrames kit). Reference build: `example-v02-clip19/` -> `V02 - Trust Numbers/Final Clips/Clip 19.mp4`.

## Setup (any new session / model / machine)
```bash
cd "YouTube Content"
bash "_Studio Kit/growkaz/setup-studio.sh"     # copies the plugin kit, overlays OUR patches, npm install, checks python + Chrome
```
Needs: the GrowKaz plugin installed as skills (`~/.claude/skills/make-2d-video` etc.; the .plugin file was in Downloads),
Node, ffmpeg, Python 3 with numpy/scipy (+ faster-whisper, optional), Google Chrome at `C:/Program Files/Google/Chrome/Application/chrome.exe`
(or `CHROME_PATH`). Whisper on Windows needs the VC++ runtime (`winget install Microsoft.VCRedist.2015+.x64`).
Our patches live HERE and are copied over the studio: `engine/toon2d.js`, `engine/styles.js` (+ "cozy" style), `render.mjs` (uses Chrome), `sets/*.js`.
**Never edit the studio copy only: change the file here, then re-run setup-studio.sh** (so a new session gets identical output).

## Per clip (from inside the video folder)
1. Voice: Fish browser workflow (VOICES.md): narrator "Abid's Fav" 1.0x, side characters bookmarked voices, one sentence/group per take,
   1st take (pick script in VOICES.md), join with `NOSLOW=1 python3 "../_Studio Kit/fishjoin.py" "Clip NN" "<text>" part::text gap=.. ...`.
2. `bash "../_Studio Kit/growkaz/gk-clip.sh" init NN`  -> word timings + studio project `growkaz-stickman-studio/projects/v02-clipNN`.
3. Write `story/shots.json` (shot ids, start/end from the printed word times, `in` transitions, sfx cues, music sections) and
   `scenes/shots/01_main.js` (one `registerShot` per shot). Copy patterns from `example-v02-clip19/`. Sets: `import { mall } from '/engine/sets/mall.js'` or write a new set file in `_Studio Kit/growkaz/sets/` (then re-run setup).
4. `gk-clip.sh sheet NN` -> look at the contact sheet PNG, fix, repeat.
5. `gk-clip.sh render NN` -> full render (1080p, 30 fps) + generated music/SFX mix -> `renders/V02 - Clip NN.mp4` + `Final Clips/Clip NN.mp4`.

## Look rules (keep every clip identical in style)
- **Style `cozy`** (natural colours, gentle warm cast, light vignette/grain). Never emerald/ember etc. `bars: null` (no letterbox) unless asked.
- **Characters = `drawToon(g, {x, y, s, facing, cast, pose, expr, talk, blink, look, rim})`** and close-ups `bigToonFace(g, cx, cy, r, {...})`
  from `/engine/toon2d.js`. Cast presets: `HERO` (the user: curly hair, curled moustache, goatee, denim shirt, beige chinos), `SAM`, `CASHIER`,
  `STRANGER`, `SHOPPER(i)`; make new ones as plain objects (skin, hair: curly|short|swoop|ponytail|long|bun, hairColor, top, topDark, legs, shoes, apron, cap, glasses, lashes).
- **Expressions on the beat of the words** (`TOON_EXPR`): neutral smile happy joy laugh smug fake awkward angry furious sad cry worried nervous shocked surprised thinking confused determined tired.
  Poses from the engine: `posesAt(t, [[0,'stand'],[0.5,'explain']])`, `breathe(...)`, `walkPose(phase)`; poses: stand relaxed talk explain point pointUp wave cheer handsOnHead crossArms think shrug holdFront phone reach sad facepalm ready crouch sit kneel jump fall.
- **Trust numbers glow ON heads** (`headNum` helper in the example), drops shown with a red floating `-N`.
- **Camera: smooth, never jumpy (user 2026-11-21).** Every shot moves, always eased: `z: 1 + 0.06 * ease.inOut(t / info.dur)`,
  lateral drift `x: -30 + 60 * ease.inOut(p)`, pull-outs for reveals. Zoom range inside a shot 1.0-1.12 (close-ups via framing/bigToonFace,
  not deep zoom); no linear starts/stops, no sudden punches except a deliberate `shake()` on an impact.
- **Transitions:** `{"type":"fade","dur":0.3}` by default (smooth); `flash` only into a freeze-frame / big realisation; no dip-to-black.
- Atmosphere: `FX.dust`, `FX.lensStreak`, light pools, blurred backgrounds (`blurLayer` + `veil`) for close-ups; one signature moment per clip
  (freeze-frame with `FX.drops`, a prop that cracks, money bouncing, a spotlight...).
- Sound: music sections per clip (moods: mystery tension action wonder hopeful sad triumph playful calm dark epic; music gain -22 dB),
  SFX per shot (pop blip ding swish whoosh hit impact freeze heartbeat shimmer applause murmur phonering clock tick...).
- Mix light and dark shots; diegetic objects over captions; minimal on-screen text (see LIBRARY.md rules, they still apply).

## Shared helpers + sets (import in every shots file)
- `/engine/storyfx.js`: `blink(t)`, `headNum(g,x,y,str,t,t0)` (glowing number ON the head, y = ground - 300*s), `numChange(g,x,y,from,to,t,tSwitch)` (old pops out, new pops in, +/- floater), `floater()`, `camEase(t, dur, {z0,z1,x0,x1,y0,y1})` = the smooth eased camera: use it for EVERY shot.
- `/engine/sets/`: `mall.js` (golden mall), `apartment.js` (Sam's dusk living room, `{mood:'night', sofa:false, wall}`), `bathroom.js` (mirror; `mirrorRect()` + `mirrorGlass()` for reflections), `bedroom.js` (morning/night bedroom, mounted clock, `bedSpot/standSpot/clockSpot`), `kitchen.js` (morning kitchen, `{smoke}` burnt toast, `toasterSpot/counterTop`), `cafe.js` (golden cafe, table for two `tableSpot`, `cup()` with steam), `street.js` (Sam's street, night/dusk, `{rain}` drops + ripples, mounted street clock, `doorSpot`, `umbrella()`).
- `handPhone(g,cx,cy,s,screenFn)` in storyfx = POV phone in both hands (screen 300x600, content clipped). Casts in toon2d: HERO, SAM, CASHIER, STRANGER, ROOMMATE, MOM, DAD, SHOPPER(i).
- Camera tip: a set layer at depth d moves cam.x*d, so to centre a point on that layer use cam.x = (px - E.W/2) / d. Add new places here once, then reuse.
- Reference builds: example-v02-clip01..03 (bedroom/kitchen/phone POV), example-v02-clip20 (props, mirror). Older: `_Studio Kit/growkaz/example-v02-clip20/` (gift + mirror speech: props, number changes on a beat, mirror reflection).

## Same result on any model / new session (the exact recipe, follow it literally)
1. Read this README, then the newest example folder (`example-v02-clip22`, `-21`, `-20`, `-01..03`) and copy its structure: one `registerShot` per narration beat, 1-4 s each, `camEase` on every shot, fades 0.3 s, a giant face (`bigToonFace`) every 3-4 shots, an insert/prop shot for objects, numbers ON heads (`headNum`/`numChange` at ground - 300*s standing, - 292*s seated).
2. Voice (Fish, browser tab, user logged in): open `https://fish.audio/app/text-to-speech/?modelId=<voice id>`, check the page says the voice name + "Speed 1x".
   For each line: click `div.whitespace-pre-wrap` (editor mounts lazily) -> focus `.ProseMirror` -> `execCommand('selectAll')` + `execCommand('insertText', false, line)` -> click the "Generate Speech" button -> wait ~11 s. Never < 4 words per take (join short lines). No tags.
   Then `/app/generation-history/`: hook `HTMLMediaElement.prototype.play` to collect `currentSrc`, click the "Play audio" buttons; newest first, 2 takes per line.
   curl each `https://platform.r2.fish.audio/tasks/<UTC date>/<id>.mp3` with `--max-time 25 --retry 3`; pick the OLDER take (Last-Modified), unless it is < 0.75x the other's length.
   Side characters: their own bookmarked voice (Sam = Gregory f79c48d249324e599d3c2cd3302f3dd2, 1.0x), joined in order with fishjoin.py.
3. `NOSLOW=1 python3 "../_Studio Kit/fishjoin.py" "Clip NN" "<full text>" "<mp3>::<text>" gap=0.5 ...` -> `gk-clip.sh init NN` -> write shots.json + 01_main.js -> `gk-clip.sh sheet NN` and LOOK at it (fix overlaps, faces that read wrong, numbers on hair) -> `gk-clip.sh render NN` -> SendUserFile + clickable path + Windows path.
4. Never leave the shell cd-ed inside a project build/ folder: Windows locks it and the next sheet/render hangs (EPERM). Run renders with `timeout`.
5. Valid SFX names only (see audio/sfx.py LIB; e.g. there is no "thump", use "impact"). If mix fails, frames are kept: re-run `python3 audio/mix.py --project ...` and copy.
5. New place needed? Add `sets/<place>.js` here once (layers 0.12 sky / 0.55 wall / 0.85 floor+props), run setup-studio.sh, reuse forever. Commit + push the kit.

## 3D backgrounds (soft cartoon 3D + our 2D cast) - TEST STAGE (2026-11-21)
- `engine/three-toon.js`: rounded shapes (`rbox` rounded box, `lathe` mugs/kettles/lamps, `ball`, `pill`, `disc`), toon shading (`toon(color)`), ink outlines (auto), `halo()` glows.
- Smooth camera: `cam3(st, t, dur, moves.push|pull|slide|crane|orbit(...))` = eased (smootherstep) + gentle breathing drift. Never jump.
- Characters: `pin(st, [x,0,z])` -> {x, y, s}: drawToon there in the shot's `overlay` so 2D figures stand in the 3D room and scale with distance. Seated: put feet ~0.78 m from the table centre (spots.chairOld).
- Sets: `sets3d/kitchen3d.js` (Dad's kitchen, evening/morning; spots stove, chairOld, chairNew, table, kettle, door). Build each 3D place ONCE here, reuse forever.
- Shot pattern: `registerShot(id, { kind: '3d', init: (T) => {const k = kitchen3d(T); k.st.spots = k.spots; return k.st;}, draw(st,t,info){cam3(...)}, overlay(g,t,info,st){ pin + drawToon + headNum } })`. Example: `example-test3d`.
- 3D renders ~2x slower than 2D (computer time, not tokens).
