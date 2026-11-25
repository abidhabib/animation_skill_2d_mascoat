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
- **Style `cozy`** (natural colours, gentle warm cast, light vignette/grain). Never emerald/ember etc. `bars: "none"` (NOT null: null falls back to the 60 px "wide" letterbox, fixed 2026-11-22) unless asked.
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
- `/engine/sets/`: `mall.js` (golden mall), `apartment.js` (Sam's dusk living room, `{mood:'night', sofa:false, wall}`), `bathroom.js` (mirror; `mirrorRect()` + `mirrorGlass()` for reflections), `bedroom.js` (morning/night bedroom, mounted clock, `bedSpot/standSpot/clockSpot`), `kitchen.js` (morning kitchen, `{smoke}` burnt toast, `toasterSpot/counterTop`), `park.js` (sunny childhood-memory park with picket fence, `{memory}` warm haze, `bike()`), `cafe.js` (golden cafe, table for two `tableSpot`, `cup()` with steam), `street.js` (Sam's street, night/dusk, `{rain}` drops + ripples, mounted street clock, `doorSpot`, `umbrella()`).
- `handPhone(g,cx,cy,s,screenFn)` in storyfx = POV phone in both hands (screen 300x600, content clipped). Casts in toon2d: HERO, KID (young Abid), YOUNG_DAD, SAM, CASHIER, STRANGER, ROOMMATE, MOM, DAD, SHOPPER(i).
- Camera tip: a set layer at depth d moves cam.x*d, so to centre a point on that layer use cam.x = (px - E.W/2) / d. Add new places here once, then reuse.
- Reference builds: example-v02-clip01..03 (bedroom/kitchen/phone POV), example-v02-clip20 (props, mirror). Older: `_Studio Kit/growkaz/example-v02-clip20/` (gift + mirror speech: props, number changes on a beat, mirror reflection).

## Same result on any model / new session (the exact recipe, follow it literally)
1. Read this README, then the newest example folder (`example-v02-clip22`, `-21`, `-20`, `-01..03`) and copy its structure: one `registerShot` per narration beat, 1-4 s each, `camEase` on every shot, fades 0.3 s, a giant face (`bigToonFace`) every 3-4 shots, an insert/prop shot for objects, numbers ON heads (`headNum`/`numChange` at ground - 300*s standing, - 292*s seated).
2. Voice (Fish, browser tab, user logged in): open `https://fish.audio/app/text-to-speech/?modelId=<voice id>`, check the page says the voice name + "Speed 1x".
   For each line: focus `.ProseMirror` (if missing, click `div.whitespace-pre-wrap` first) -> `execCommand('selectAll')` + `execCommand('insertText', false, line)` -> CHECK `ed.innerText === line` -> read the credits number ("N credits left") -> click "Generate Speech" -> wait until credits DROP (= it really generated; retry up to 3x) -> wait 6 s. Without these checks a reload/click can silently skip every line. Never < 4 words per take. No tags.
   Then `/app/generation-history/`: hook `HTMLMediaElement.prototype.play` to collect `currentSrc`, click the "Play audio" buttons; newest first, 2 takes per line.
   curl each `https://platform.r2.fish.audio/tasks/<UTC date>/<id>.mp3` with `--max-time 25 --retry 3`; pick the OLDER take (Last-Modified), unless it is < 0.75x the other's length.
   Side characters: their own bookmarked voice, always the same one (Sam = Gregory f79c48d249324e599d3c2cd3302f3dd2, Dad = Venti e34c486929524d41b88646b4ac2f382f, 1.0x), joined in order with fishjoin.py.
3. `NOSLOW=1 python3 "../_Studio Kit/fishjoin.py" "Clip NN" "<full text>" "<mp3>::<text>" gap=0.5 ...` -> `gk-clip.sh init NN` -> write shots.json + 01_main.js -> `gk-clip.sh sheet NN` and LOOK at it (fix overlaps, faces that read wrong, numbers on hair) -> `gk-clip.sh render NN` -> SendUserFile + clickable path + Windows path.
4. Never leave the shell cd-ed inside a project build/ folder: Windows locks it and the next sheet/render hangs (EPERM). Run renders with `timeout`.
   Trimming a finished clip by hand? Trim `renders/<V> - Clip N.mp4` too: every render runs export-final.sh, which re-copies ALL renders/ into Final Clips/ (it undid a Clip 30 trim once).
   Shortcut for shots.json: write a compact `story/spec.json` and run `python3 "_Studio Kit/growkaz/mkshots.py" <project> <project>/story/spec.json` (format in the script header; examples 31-33).
   2D full-frame inserts that zoom/pan (camEase + translate): fill the background over -W..2W, or black edges show when panned.
   Seated numbers in 3D: `q.y - 262*q.s` (standing `- 305*q.s`). Train two-shot camera (you + seat beside you): pos [1.15,1.3,2.7] look [-0.75,1.0,0.95] fov 44; keep cameras in the aisle centre (poles at x = ±0.55).
5. Valid SFX names only (see audio/sfx.py LIB; e.g. there is no "thump", use "impact"). If mix fails, frames are kept: re-run `python3 audio/mix.py --project ...` and copy.
5. New place needed? Add `sets/<place>.js` here once (layers 0.12 sky / 0.55 wall / 0.85 floor+props), run setup-studio.sh, reuse forever. Commit + push the kit.

## 3D backgrounds (soft cartoon 3D + our 2D cast) - IN USE since V02 Clip 24 (user approved 2026-11-21)
- `engine/three-toon.js`: rounded shapes (`rbox` rounded box, `lathe` mugs/kettles/lamps, `ball`, `pill`, `disc`), toon shading (`toon(color)`), ink outlines (auto), `halo()` glows.
- Smooth camera: `cam3(st, t, dur, moves.push|pull|slide|crane|orbit(...))` = eased (smootherstep) + gentle breathing drift. Never jump.
- Characters: `pin(st, [x,0,z])` -> {x, y, s}: drawToon there in the shot's `overlay` so 2D figures stand in the 3D room and scale with distance. Seated: put feet ~0.78 m from the table centre (spots.chairOld).
- Sets: `sets3d/kitchen3d.js` (Dad's kitchen, evening/morning; spots stove, chairOld, chairNew, table, kettle, door), `sets3d/bedroom3d.js` (hero bedroom dawn/morning; `setClock(h,m)` real moving hands, `setPhone(glow, buzz)`; spots bedEdge, phone, clock, window).
- Rule badges (Clip 5): big glowing round 1 / 2 / 3 badges pop centre then settle top-left (`badgeN` in example-v02-clip05) = how we show numbered rules. Build each 3D place ONCE here, reuse forever.
- Shot pattern: `registerShot(id, { kind: '3d', init: (T) => {const k = kitchen3d(T); k.st.spots = k.spots; return k.st;}, draw(st,t,info){cam3(...)}, overlay(g,t,info,st){ pin + drawToon + headNum } })`. Example: `example-test3d`.
- 3D renders ~2x slower than 2D (computer time, not tokens).

## THE CAST: Character 19 rig (default since 2026-11-25) - pictures `docs/CAST19_*.png`
- Source: the user's reference kit `Documents/ChatGPT/YouTube-Ordinary Rules/Characters/Character 19`; `engine/cast19/rig.js` is the latest copy from `.../Trust Numbers/rig.js` (arm corrections, + conceal), `cast19/cast.js` verbatim; their notes in `cast19/SOURCE_NOTES.md`. Re-copy those two files to update; put our changes in `engine/char19.js` only.
- Same calls as before (`drawToon`, `bigToonFace`, avatar); old pose objects and expression names are translated. NEW: `drawToon(g, { cast, action: 'makeBed', t, expr: 'teasing', yaw, facing, phoneme, talk })`; 43 actions in `ACTIONS`, 46 emotions in `EMOTION_NAMES`. Pass `t` (seconds) with `action` so it moves.
- Cast ids: HERO=lead, SAM=sam, DAD=dad, YOUNG_DAD=youngdad, MOM=mom, KID=kid, ROOMMATE=ivo, STRANGER=ines, CASHIER=tess, SHOPPER(i). Others: niko, omar, mara, leon, june, alma. Outfits: original, workwear, blazer, cardigan, marine, uniform.
- Old per-cast colours (top, skin...) and `rim` are ignored by the new rig. `bigToonFace` shows the body below the head; pass `clip: true` for small portraits.
- Old round-head cast on request: `rig: 'classic'` (call or cast) or `"cast": "classic"` in config.json (use it when re-rendering a finished old video so characters stay consistent).
- QC gallery: `example-lab-cast`. Riverside world from the reference kit is NOT ported.

## SHORTS / REELS 9:16 in this engine (V02 Short 2, 2026-11-22) - example `example-v02-short2`
- Voice: Fish lines -> `fishjoin.py "Short N"` -> `bash new-clip.sh SN` (word timings, clip 90+N-1) -> `tools/new_project.py --aspect 9:16 --captions` + write_timeline (see example) -> spec.json + mkshots.py.
- Frame is 1080x1920 (E.W/E.H). 2D faces centre at y 0.5H, numbers at 0.12-0.2H, captions at 0.76H (above the Shorts UI); 3D cameras need fov 46-52 (narrow width).
- Use the example's OWN captions (`capt`, measured with the real font, 1-3 words, gold active word, dark pill; config captions:false): the engine's built-in captions run words together.
- Reel structure that works: number pops in frame 1 (hook), one beat = one picture, emotional peak with a side voice, ends on a comment question that loops to the opening.

## OBJECT LIBRARY `engine/props3d.js` (user 2026-11-22: "objects more real, proper library for future reuse") - USE IT, don't hand-build props
- Picture of everything: `docs/PROPS_3D.png`. Gallery project to re-check after changes: `example-lab-props` (copy to `projects/lab-props`, `node render.mjs --project projects/lab-props --sheet --scale 0.5`).
- `import { P, put, leafPlant } from '/engine/props3d.js'`; `S.add(put(P.mug({ color }), [x, y, z], rotY, scale))`. Every prop: base on y = 0, front faces +z, real sizes in metres.
- Small: mug, glass, bottle, phone (`setGlow`), laptop (`setOpen`), book, bookStack, bookRow, tableLamp (`setOn`), plant/leafPlant (kind leafy|tall|monstera|succulent|round), wallClock (`setTime(h,m,s)`), alarmClock, frame (art 0-2), sneaker(s), foldedClothes, clothesPile, pillow, kettle, backpack.
- Furniture: bed (made 0..1), nightstand, desk, chair, officeChair, table (rect|round|coffee), sofa, bookshelf, wardrobe, tv, tvUnit, rug, door (`setOpen`), window (sky day|sunset|night|dawn, curtains), mirror (standing|wall, reflective gradient glass), fridge, counter (sink, hob), pendant, floorLamp, wallShelf.
- Outdoor: bench (cast-iron), tree (lumpy two-tone crown), pine, bush, lampPost, fence, trashBin, bike (`spin`), car (`spin`).
- Building blocks for new props: `blob` (lumpy organic: foliage, cloth, rocks), `puffy` (stuffed: pillows, cushions, duvets), `tube` (handles, frames, cables), `tex2` (cached canvas textures).
- What made old objects look weird (avoid): spheres as leaves/clothes, plain white slabs as mirrors/screens, boxes as shoes/bags, missing handles/rims/seams. Real proportions + 2-3 small details (rim, handle, seam, label, sole) make an object read instantly.
- New prop needed? Add it to props3d.js ONCE (same conventions), add it to the lab gallery, render the sheet, look, then commit + push. The 3D sets (bedroom/kitchen/park/train) already use the library.

## 2D PROP LIBRARY `engine/props2d.js` (user 2026-11-22) - picture `docs/PROPS_2D.png` (+ PROPS_2D_L09..L12.png full size)
- `import { D } from '/engine/props2d.js'`; `D.<name>(g, x, y, s, o)`; options `rot, flip, t (time), a (alpha)`. Anchor: objects = bottom centre, icons/UI = centre.
- Screens/UI: phone (screen lock|home|chat|call|dead|off|fn; note, name, cast, msgs, typing), handPhone, chatBubble (side, typing), comment, toast, sendButton; `screen()` and `avatar(g,x,y,r,cast)` exported.
- Icons: heart, thumbsUp, tick, cross, battery (level, charging), bell (ring, count), envelope (open), calendar, clock (h,m | spin), pin, coin (spin), cash, gift (open), trophy, star, bulb (on), wand (k sparkle), paperPlane (trail), key, padlock (open), mark (? or !), plusBlock (+1).
- Info: routeMap (n, at, label), progressBar (k), thought (text), arrow (len, bend), sign (text), priceTag, receipt, notebook (k writing).
- Objects: mug (steam), glass (fill), bottle, book (title), bookStack, laptop, tv, alarmClock (ring), plant (leafy|tall|round), deskLamp (on), backpack, sneaker, shoeBox, briefcase, bag, car (spin), house (lit), bike, cup, umbrella.
- Never hand-draw these inside a clip again; add missing props here once (same look: flat colour + one shade band + one shine + 5 px ink), add to lab gallery L09-L12, check the sheet, push.

## CLEAN FACES (default since 2026-11-22, user: "make character minimal clear face") - `docs/FACES_CLEAN.png`
- toonFace now draws dark glossy eyes (like `docs/ABID_CHARACTER.png`), soft short brows, light blush, thin curled moustache clear of the mouth, soft head shading (no hard half-face line).
- Only shocked/surprised keep a white eye with a tiny pupil (so shock still reads). Features grow a little on small/far figures so faces stay readable.
- Heads are a slim egg (user 2026-11-22 "not fat face"): `HEAD_W = 0.84` width + tapered chin (`headShape`). Per character: `cast.headW` (1 = old round head).
- Old white-eye face if ever needed: `drawToon(g, {..., face: 'classic'})` / `bigToonFace(..., {face: 'classic'})` or `cast.face = 'classic'`.

- Mixing rule (Clip 24): 3D for real places (establishing, push/crane/orbit around characters), 2D for inserts (objects, stamps), giant faces and memories/flashbacks (warm `park(..., {memory:1})`). Fade 0.3-0.35 between them.
- 3D framing: keep the number on the head IN FRAME: look target ~0.3-0.4 m above the seated head (y 1.35-1.4 for seated Dad at 2.7-3.2 m), never closer than ~2.3 m. Dolly zoom (Clip 25 h06): move the camera back while narrowing fov = 2*atan(halfWidth/d) for 'the distance grows'.
- Expression fix (2026-11-21): sad/worried/nervous/cry brows now tilt UP at the middle (they read angry before). After any face change, check a big face on the sheet.
- Silence inside a take: generate the short line WITH its neighbour (never < 4 words), find the pause with ffmpeg silencedetect, split there, then join with gap=1.2.
- Mirror shots (Clip 28): reflection inside mirrorRect at ry = m.y + m.h + 230, scale s*1.35 (head + number fully in the glass); you in front at GY + 190, s*1.5; night = multiply rgba(70,80,130,.55).

## RICH 3D RULE (user 2026-11-21, from Clip 29 on)
- More 3D: every real place is a `sets3d/` set (bedroom3d, kitchen3d, park3d so far). 2D only for giant faces, graphs, tiny inserts (and give those a textured backdrop + props, never a flat colour).
- Frames must not feel empty: fill with story props + foreground/background (bedroom3d now has desk+laptop+mugs+water bottle, bookshelf, full-length mirror, running shoes, clothes pile, plant, fairy lights; `setBed(0..1)` messy->made).
- Camera slightly faster: ~1.3x the old travel per shot, shots 1-2.5 s, still eased (cam3). Keep the camera ~3.5-4.5 m from a standing person so the whole body + number fit.
- 3D mirror reflection: `reflection()` in example-v02-clip29 (mirror the foot point across the glass plane, draw facing the other way, clip to the glass via screenOf(mirCorners)); stand the hero BESIDE the mirror (spots.mirrorFront) so he doesn't block it.
- park3d: sunrise park, path along X (runFrom/runTo), trees, benches, lamps, fence, hills, skyline, flowers; track runners with the camera moving along X.
- train3d: commuter car, aisle along Z; `update(t)` scrolls the city past the windows + sways handles, `setLights(k)` dims/flickers; seatsL/seatsR for passengers (keep seats near the camera empty), youSeat, farEnd.
- Eerie stranger: grey skin + 'tired' stare + red rim + glowing number (example-v02-clip30). End-card subscribe pill: small, bottom-right, generic (no logos).

## V03 finance (2026-11-22): example-v03-clip01
- New props: `P.crt({screen:'chart'|'up'|'down'|'blue'})` (late-90s beige monitor + keyboard), `P.routerRack({units})` (`rack.update(t)` blinks LEDs).
- New set `sets3d/office2000.js`: March-2000 trading floor (rows of desks + CRTs + chairs, scrolling green ticker board, MAR 27 2000 calendar, router rack). `office2000(T)` -> {st, spots{heroChair, heroDesk, rack, ticker, deskSeats}, update(t)}; call `st.upd(t)` in draw.
- Finance clips: one narrator only; money numbers glow ON heads like trust numbers (`$10,000` green -> `$6,000` red + `-40%` floater). In 3D, only draw extra people at seats with z < 0 when the camera is near the front rows.
- `engine/finfx.js` (V03 Clip 2 on): shared finance helpers so every clip looks the same: GREEN/RED/GOLD/INK, `Y2K` (2000-you), `greyed(cast,k)` (hair goes grey = years passing), `zoomed`, `pop`, `money` (glowing $ number), `backdrop`, `chart`, `faceShot` (giant face + screen glow + number), `rack2d`, `badge` (numbered round badge), `box` (ORDER box), `bars`, `coinStack`. Examples: V03 clips 2-4 (projects v03-clip02..04).

## RICH FINANCE LOOK (user 2026-11-22 after V03 clips 1-4: "not repetitive, not hero alone, rich, real objects, no 2010 UI, better camera")
- `engine/finprops.js` = `FP.*` real finance objects + modern UI: `glass` (dark glass card), `candles` (real candlesticks + volume + MA + live price tag), `term2000` (amber year-2000 market terminal), `newspaper`, `tv2000` + `newsBanner`, `phone` (modern) + `post` (feed post), `statement` (brokerage statement, circled total), `mousetrap`, `shelf` (supermarket, price labels x mult), `commentCard`, `door` (lit, sign plate).
- `office2000(T, {crash:true})` = 2001 crash floor (red ticker, red CRTs, dim). Fill seats with people (`floor()` helper in example-v03-clip05) instead of a lone hero.
- Rules: every shot = a place + layers + other people; max one giant face per clip; over-the-shoulder shots (`shoulders()` in clip05) for screens; vary camera per shot (crane, dolly, orbit, pan, push); secondary motion (confetti, tickers scroll, walkers pass). Examples: example-v03-clip05..07.
- FP additions (V03 clips 9-11): `heatmap` (all-red AI stock treemap), `sheet` (modern spreadsheet card), `hourglass`, `report` (document cover), `vault` (bank vault door), plus `gpu`/`router`. Shot patterns in example-v03-clip09..11: tracing-paper overlay, stage with empty podium, talk-show panel, boardroom/earnings call, gear machine, analyst floor with flipping notes, pull-back reveal, money-trail pan, fine-print magnifier, construction site, hanging sign flip, bar comparison with people for scale.
- FP additions (V03 clips 12-14, the oven-shop story): `oven`, `bank`, `contract` (signature draws itself), `stamp` (slams: DENIED/APPROVED/PAID), `register`, `cheque`, `chain` (+ iron ball), backdrops `ovenShop(g,t,{ovens,glow,tags})` and `bankInterior`. Characters built in clip files: `chipChar` (the AI chip as a worried character with legs, example-v03-clip13), `cat`, `wallet`. Patterns: hub-and-spoke guarantee map, aerial campus, hook-and-limit gauge, balance scale with a crack. Examples: example-v03-clip12..14. SFX are trimmed -3.1 dB by mkshots.py.
- V03 clips 15-17: `FP.chipChar(g,x,y,s,t,{mood,label})` is now shared (the AI chip character). Patterns: kitchen-table thought bubble, phone-app donut + 100-coin grid, 500-tile index with six giant tiles, egg basket (a third turn green), bond press + institutions, two chips with flipping tags, 2001 living-room TV, cranes leaving + halving bars, cyber cafe, split online-vs-silent-sales, warehouse write-off, AI chat phone, empty orders dock. Examples: example-v03-clip15..17.

## TEXT MUST NEVER STICK OUT (user 2026-11-23) + SMOOTH CAMERA / SCENE FLOW
- Check before rendering: `node render.mjs --project projects/<slug> --overflow --scale 0.5` scans every shot (5 moments each) for text sticking out of its box/paper/screen and prints suspects (also build/overflow.json). Many suspects are false positives (small icons); verify the real ones with `--stills`.
- Built-in guards: `FP.stamp` grows its box to fit the text; `fitSz(g,str,maxW,size,weight,font)` shrinks fonts (used by newsBanner, commentCard, post, chain ball, cheque, newspaper headlines). For hand-built cards: measure with `g.measureText` or keep text 25% shorter than the box.
- Camera: `sway(i)` in finfx.js (even shots push in + drift right, odd shots pull out + drift left): `camEase(t, info.dur, sway(i))`; spec transition `"zoom"` (mkshots: fade|zoom|whipR|whipL|flash|cut) zooms through into the next scene. Examples: example-v03-clip18..20 (chalkboard, ladder world climbed by the camera).

- WARNING: `gk-clip.sh init N` deletes projects/<slug> (spec + shots). Re-init only before writing them; keep a copy in example-* (V03 clip 24 lost its files this way, 2026-11-23).
