---
name: cartoon-explainer-clip
description: Make the next numbered clip of the user's 2D cartoon explainer video (bean/pear-character style measured from their favourite reference videos) in HyperFrames, timed to their own voice-over chunk. Use when the user asks to make, continue, redo or edit "clip N" / the next clip / a scene of their YouTube explainer, or runs /cartoon-explainer-clip.
---

# Cartoon explainer clip

## START HERE (new session checklist)
1. Read `Animation/START_HERE.md` (project briefing, workflow, library map, voices, gotchas) and, if you will draw anything, `Animation/STYLE_RULES.md` + `Animation/LIBRARY.md` (cheat sheet; pictures in `LIBRARY_CATALOG.png`). The project `CLAUDE.md` in the `First Video` folder holds the user's working rules.
2. Hero = `style:"mascot"` (yellow hoodie, curl). Build clips from a short JSON spec with `scene.py`; reuse the library; add new assets to `_kit` once.
3. Narration = the user's own voice-over. Character voices = Fish Audio (`Animation/VOICES.md`); NEVER generate audio or ask for an API key without the user's go-ahead.
4. Token-light: no screenshot review unless asked; send finished clips with SendUserFile; ask before pushing to GitHub (repo https://github.com/abidhabib/animation_skill_2d_mascoat, root = `Animation/`; sync this skill into `Animation/skill/` before committing).
5. **Video 1 (32 clips) is finished.** For a new video run `bash Animation/new-video.sh "Video 2"` (new folder, clips restart at 1, kit cloned), then open the session in that folder. Sections below that talk about a 32-clip video describe Video 1.
5. Sections below are the detailed reference. Where an older section disagrees with `STYLE_RULES.md`/`LIBRARY.md`, the newer files win (the old "flat/vibrant" look rules were replaced).

The user makes a ~32-clip YouTube explainer, one clip per voice-over chunk. Each clip is its own HyperFrames
project rendered to `Animation/renders/Clip N.mp4`. Clip 1 (`Animation/clip-01`) is the reference build: copy its
patterns, not its scenes.

Project root (example): `C:\Users\Abid .H\Documents\YouTube Content\First Video\`
- `Voice-overs Chunks/` and `Transcript Chunks/`: paired **by number only** (`Clip 02 - Voice-over.mp3` ↔ `VO_02.txt`, or `2.mp3` ↔ `2.txt`).
- `References/`: the style. `Animation/_kit/`: shared `toon.js` (rig, camera, map, flag, chip), `world.js` (Natural Earth outlines, projected 1920×1080, city points), Kalam font.
- `Animation/new-clip.sh N` scaffolds; `Animation/render-clip.sh N` checks (errors only) and renders.

## Token budget (the user asked for this)

- Default: do **not** render-then-screenshot-then-analyze. Exception: when the user asks for a screenshot, storyboard image or a style test, extract frames with ffmpeg and send them (SendUserFile).
- Do **not** render-then-screenshot-then-analyze otherwise. Do **not** run `snapshot` or read frames unless the user reports a problem
  or a scene is brand-new kind of geometry you can't reason about. The user reviews the final video.
- Don't re-read the hyperframes skill references each clip; this file is the brief. Read `_kit/toon.js` only if you need an API detail.
- One pass: plan → write scenes → `render-clip.sh` (run it in the background) → hand over the path.
- Fix only what `render-clip.sh` prints as an error.

## Work loop for clip N

1. `bash Animation/new-clip.sh N` → prints the duration and every word as `word@seconds`. Read 1–2 neighbouring scripts only if the context is unclear.
2. Plan scenes anchored on spoken words. Measured reference rhythm: 40–46 cuts/min (average shot ~1.2 s, 0.6–2.5 s typical, hold 3–5 s only to read text or for an emotional beat), cuts land in voice pauses, wide -> close-up -> wide. Every scene a different place and layout from the previous clip's too. Write them straight into `compositions/sK-name.html` and mount them in `index.html` at `<!-- SCENES -->`:
   `<div id="sK" data-composition-id="sK" data-composition-src="compositions/sK-name.html" data-start=".." data-duration=".." data-track-index="1|2" data-track-kind="graphics" data-width="1920" data-height="1080" style="z-index:K"></div>`
   Scenes overlap 0.3 s; the incoming (higher z) plays the transition. Last scene ends at the root duration (voice + 0.5 s).
3. Mount with `python3 Animation/mount.py N sK-name:start:dur ...`, then `bash Animation/render-clip.sh N` in the background (≈2 min render). Give the user `Animation/renders/Clip N.mp4`.

## Look (from the references)

Look: **read `Animation/STYLE_RULES.md` first** (measured from the user's favourite videos; supersedes the old flat/vibrant rules). Summary:
- Layered worlds (far / mid / near), every surface has a gradient or pattern; flat fill under ~35% of the frame. Soft glow from drawn light sources (lamp, window, sun), vignette 10-25% (45-50% for night/tension), warm vs cool light, subject at least 2x brighter than surroundings in close-ups.
- Colour muted-warm: saturation 0.30-0.45. `new-clip.sh` now writes `saturate(0.85)` (old clips used 1.35, too strong). Brand colours only as small accents.
- Camera: slow push-in ~2%/s on shots over 1.2 s, pans under 2% width/s; close-up = new framing, blurred + darkened background.
- Characters: use the **pear style** (`style:"pear"`): pear body, white eyes with dot pupils, soft head/body shading, hair highlight, 3.5 px outline, accessories `hat:'bowler|fedora'`, `stache`, `lids` (half-closed eyes), `suit`+`tie`+pocket square. Supporting characters ~70% of the lead's height, varied hats/colours.
- Text only as hand-lettered signs/cards/labels (Kalam 700, max ~3 words).
Never a tiny object in an empty frame: hero ≥ 40% of the frame, backgrounds fully dressed (shelves, windows, skyline, props).
A country mentioned → real map (`T.map`) zoom/flight or its flag. Travel → plane/route/vehicle moving between places.
No real people's likeness (show the role: empty chair, nameplate, silhouette); no traced real logos: use the simplified stylised marks in the kit (`S.ICONS.gmark`, `theme:"google"`) or plain text.

## Motion (clip 2 onward: slightly slower)

- `_kit/toon.js` has `SLOW = 1.15`: helper moves already last 15% longer. For hand-written tweens use `T.d(x)` for the duration.
  Keep start times on the words; just don't snap. Prefer one hero move per shot, arrivals `expo.out`/`back.out(1.4)`, camera `power2.inOut`.
- Characters never freeze: `T.idle`, `T.blink` every 2–3 s, `T.look`, mood takes (`T.mood`), offset limbs.
- Transitions: use 4–6 kinds per clip, each caused by something on screen: object flies into lens and becomes the next world,
  whip pan (svg `x` ±700 + `filter: blur(16px)`), iris (`clipPath: circle()` on the scene's own svg), zoom-out/pull-back continuity,
  colour flood (clip-path circle grows from an object), vertical whip, red/gold panel wipe. Never crossfade worlds.

## toon.js API (window.T)

`char({id,x,y,scale,face(-1..1),flip,skin,shirt|suit,tie,vest,hair:'short|side|bald|grey|bun|helmet|long',hairCol,glasses,stubble,mood,prop:{side:'l|r',svg}})` → SVG string. Ids: `<id>-pos` (move this), `<id>`, `-head`, `-body`, `-al/-ar` arms, `-ll/-lr`, `-eyes`, `-pupils`, `-m-<flat|smile|grin|open|frown|shock>`, `-prop`.
`armSet(tl,id,'l|r',deg)`, `armTo(tl,id,side,deg,t,dur,ease)` (right arm: negative = toward screen right/up; mirrored when `flip`), `mood(tl,id,t,m)`, `brows(tl,id,t,'calm|up|angry|worried')`, `blink(tl,id,[t..])`, `look(tl,id,t,dx,dy)`, `talk(tl,id,t0,t1,rest)`, `idle(tl,id,t0,t1,amt)`, `walk(tl,id,t0,t1,dx,x0)`.
`cam(tl,'#sK-cam',{fx,fy,k,r}).to(t,dur,{fx,fy,k,r},ease).shake(t,amp)`: shows point (fx,fy) at frame centre with zoom k. **Use this for every camera**, never GSAP scale/svgOrigin on a camera group.
`map({prefix,sw,palette:[..],highlight:{Country:'#hex'}})` country paths (use inside a group; outlines don't scale). `pt('singapore'|'beijing'|'santaclara'|'taipei'|'hongkong'|'shenzhen'|'kualalumpur'|'dubai'|'washington'|...)` projected point. Map view to centre a point at zoom k: `x: 960-k*mx, y: 540-k*my, scale: k, svgOrigin: '0 0'`. `pt('shanghai')` exists too. Need another city: add it to `_kit/world.js` pts (projection: geoNaturalEarth1 fitExtent [[40,60],[1880,1060]], Antarctica removed; generator in the scratchpad is gone — compute via d3-geo in a temp dir if needed).
`flagSG(w)`, `flagCN(w)`, `flagUS(w)`, `calendar(top,big,w)`, `nameplate(text,w,fs)`, `stamp(text,col,fs)`, `bubble(text,fs,col,tx,ty)`, `badge(name,role,col)` (all SVG strings; add other flags as small functions in `_kit/toon.js`, accurate colours), `chip(size,id)`, `rng(seed)`.

## Scene file skeleton

```html
<template>
  <style>
    @font-face { font-family: "Kalam"; src: url("assets/fonts/kalam-700.woff2") format("woff2"); font-weight: 700; }
    #root { position: absolute; inset: 0; overflow: hidden; background: #HEX; }
    #root svg { position: absolute; inset: 0; }
    #root text { font-family: "Kalam"; font-weight: 700; }
  </style>
  <div id="root" data-composition-id="sK" data-width="1920" data-height="1080">
    <svg id="sK-svg" viewBox="0 0 1920 1080" width="1920" height="1080">
      <g id="sK-cam"> …world… <g id="sK-chars"></g></g>
    </svg>
  </div>
  <script>
    (function () {
      const T = window.T, $ = (s) => document.querySelector(s);
      $("#sK-chars").innerHTML = T.char({ id: "sK-a", x: 600, y: 1040, scale: 1.75, face: 1, suit: "#2f3e5c", tie: "#b8443b", hair: "side" });
      const tl = gsap.timeline({ paused: true });
      const C = T.cam(tl, "#sK-cam", { k: 1.05 }).to(0, 2.5, { k: 1.1, fx: 1000 });
      // …tweens at scene-local times = word time − scene start…
      window.__timelines["sK"] = tl;
    })();
  </script>
</template>
```

## Rules that broke clip 1 (don't repeat)

- **Never tween x/y on an element that has a `transform` attribute**: GSAP replaces the translate. Wrap: `<g transform="translate(..)"><g id="moving">`. Rotation/scale-only tweens on it are fine.
- Every id unique across the whole clip: prefix `sK-`. Every scene root is `#root`, so never select `#root` in script; target `#sK-svg`.
- Seek-safe only: no `Math.random` (use `T.rng(seed)`), no timers, no `tl.call` for visual state. Changing text: stack layers and toggle opacity, or a proxy tween with `onUpdate` writing `textContent`.
- Things revealed later: `tl.set(el,{opacity:0},0)` then `tl.set(el,{opacity:1},t)`; use `fromTo` with `immediateRender:false` when a second tween on the same prop starts later.
- Characters behind desks: draw the desk after the characters. Keep key heads/labels out of each other's way (labels inside screens, above heads).
- Inside a scene file, `<script>` runs after `toon.js`/`world.js` (loaded in `index.html`'s head). Don't add `<script src>` in scenes.

- Real people named in the script: never a face/likeness. Show names as text on cards, nameplates, badges; allegations get a visible REPORTED tag or a dashed "?" link, never drawn as fact.
- Don't use CSS `clip-path: inset(%)` on SVG groups (percent is of the whole viewport): reveal with `scaleX` from `transformOrigin: "0% 50%"` or a sliding cover rect.
- Calendar big number fits ~3 characters at w=340 (use `calendar("2025","AUG",340)`, not "2025" as the big line).

## Scene library (built, 2026-11-17/18)

`Animation/_kit/scenes.js` (window.S) + `Animation/scene.py N specs/clipN.json` (writes compositions + mounts; copies scenes.js, but copy `toon.js` into `clip-NN/assets/` yourself when it changed). Spec = JSON list of `{"name","start","dur","type","bg",...}`, times scene-local.

Types: docStamp, calFlip, mapTo, compare, counter, barTo, deskPlate, building, reactRow, dropList, pop, lineChart, highlightNote, dimCards, spotlight, iconRow, and **stage** (environment + characters, the workhorse).
Backgrounds: old flat ones (sunset/night/sky/yellow/red/teal/purple/blue) and rich layered ones: `officeNight`, `dayCloud`, `buildSite`, `serverHall` (not used yet), `office1925` (dark, lamp rays, moon halo), `street` (`time:"day|dusk|night"`, lane dashes scroll).
Scene options: `exposure` (0-.4 darken), `lights:[[x,y,r,opacity]]` (glow disks above the darkening), `theme:"google"` (rainbow stripe, bunting, balloons), `cam:{fx,fy,k}` start + `camMoves:[{t,dur,fx,fy,k}]`, `board:{text,sub}`, `platform:"cloud"`, `in:{kind}` transitions.
Characters: `chars:[{name,style:"pear",x,y,scale,face,flip,shirt,suit,tie,hair,hairCol,skin,hat,hatCol,glasses,stache,lids,walk:[t0,t1,dx]}]` or `group:{n,x,dx,y,scale,walk,hats,seed,flip,face}` for crowds/marches.
**Talking characters:** `say:[{char:"name",emotion,from,to,k,blur,zoom}]` - face + brows + gesture + mouth flaps + close-up with blurred/darkened background + pull-back. Emotions: neutral happy shocked scared nervous sad angry smug explain. `from/to` are scene-local seconds; fill them from the per-word times printed by `new-clip.sh` (not auto-linked to audio yet).
Reference tests: Clip 91 (Google theme), 92 (rich envs + say), 93/94 (Paris + site), 95 (10 s montage with day/night/walk/group/camera). Don't count them as video clips; delete `clip-9x` folders when done.

## Titles and thumbnails (from the user's reference channel, 2026-11-19)

Use when the user asks for a title, hook or thumbnail. Evidence is a small sample (9 thumbnails, views 14K to 394K), so present as patterns, not guarantees.
- Best performers give the viewer something personal that grows under a repeating rule ("every day", "every night"). One-off science/danger topics did worst. Pick a **rule**, add a **catch/cost**, use a **specific number**.
- Title formulas that avoid "What if": number + rule; you-are-the-character; day-count challenge; the catch; forbidden/secret; contrast of two places or people; question without "what if"; bold claim then proof; timeline (Day 1 to Day 30). Always offer ~10 options when asked.
- Title and thumbnail say different things: title = the rule, thumbnail = the result. Never repeat the same words.
- Thumbnail layout: one recurring mascot; 2-4 giant words (yellow/white, thick black outline); escalation split panels (Day 1 / 7 / 15 / 30, each panel bigger and glowing more); one strong face emotion; dark character on bright glowing gradient with rim light; one helper (red arrow + "YOU", red tag, duration badge); scale shown by the picture. Build thumbnails in the pear style from `Animation/_kit` (existing reference: `Thumbnail.jpg` in the project root).
- Script trick: open at the dramatic moment, then explain how we got there; a mini-twist every 60-90 s.

## Mascot style (2026-11-19, user said the pear character was boring)

`style:"mascot"` in `_kit/toon.js` (`mascotChar`): cream-white head with a signature curl, big glossy eyes with highlights, blush, soft head gradient, cyan rim light, yellow hoodie (`shirt`, `hoodDark`) with drawstrings + pocket + thick sleeves, dark pants, white sneakers. Same ids/rig as `char`, so `say`, `walk`, moods and brows work. Options: `skin`, `shirt`, `hoodDark`, `pants`, `glasses`, `curl:false`. Environment `neonNight` (purple-pink gradient, bokeh, lit skyline) is the thumbnail look. Thumbnails: mascot scale ~3.3 at bottom-left, second mascot right, text top (white word + yellow word, heavy dark stroke via `extra` SVG), one clear emotion. Test: Clip 96. Pear style stays for supporting cast.

Mascot expressions (2026-11-19): `T.expr(tl,id,t,name,dur)` and `say` emotions for mascots: neutral happy joy(closed happy eyes) love(heart eyes+hearts) crying(tears) sad nervous(sweat) scared angry(red tint+marks+gritted teeth) dizzy(spiral eyes) mindblown(bulging eyes) shocked smug(half-lids+smirk) sleepy(Zzz) scream(sound rings) explain. `silent:true` ones (dizzy, mindblown, sleepy, scream) skip mouth flapping. Test: Clip 97 chart.

Batch 1 (2026-11-19) — views + auto timing:
- Mascot `view:"front|q3|side|back"` (side faces right; `flip:true` mirrors for left). Direction shortcuts: `dir:"left|right"` (side view + mirror), `"away"` (back view, shrinks toward the horizon), `"toward"` (front view, grows); a mascot with `walk:[t0,t1,dx]` and no `dir` picks left/right from the sign of dx. `away/toward` accept `farScale` (default .5) and `depth` (default 80 px up). No turn animation yet (swap views between scenes).
- `scene.py` reads `clip-NN/assets/vo.words.json` (list of {w,s,e}): `"start":"first words of the scene"` (+`lead`, default .15 s earlier), `"end":"last words"` (sets `dur`, +`tail` .35 s), and in `say`: `"at":"phrase"` (sets from/to from the spoken words) or `"from":"phrase"` / `"to":"phrase"`. Phrase = consecutive spoken words, punctuation ignored, searched after the previous scene start. Fails loudly if not found. Test: Clip 98.

Library batches 2-5 (2026-11-19): read `Animation/LIBRARY.md` (cheat sheet) and look at `Animation/LIBRARY_CATALOG.png`. Environments: bedroom kitchen classroom hospital livingRoom (`time` day|night), factory, lab, stadium, harbor, railway. Props via `props:[{type,x,y,scale,dir,move:[t0,t1,dx]}]`: car bus truck train plane bike boat (wheels spin with distance) and machines factoryLine robotArm serverRack labBench controlPanel. `crowd:{n,x0,x1,y,scale,walk,seed}` = varied walking mascots; `weather` = rain|snow|fog|sunrise|stars. Never tween a transform on an element that has a transform attribute: wrap it (done for wheels/arms).

Aging + packaging (2026-11-19): mascot `age:0..70` (lines from 15, glasses + grey tufts from 30, grey brows/spots 50, cane 55+, white hair 60+, stoop in side/q3 views; `cane` true/false overrides) - use for Day-N thumbnails/scenes. Channel is not tech/news; packaging rules and timed script outline are in `Animation/PACKAGING_PLAYBOOK.md` and `Animation/SCRIPT_TEMPLATE.md` (read before writing titles/scripts). Other characters speak <= 8 words, <= 10% of words.

Semi-3D + head turn (2026-11-19): mascot option `vol:true` adds form shading, specular highlights, stronger rim lights, chin/ground shadows (off by default, no cost in clip spec size); `turns:[[t,dur,yaw,fromYaw]]` / `T.turn(tl,id,t,dur,yaw)` turns the head smoothly (yaw -1 left .. 0 front .. 1 right; nose appears in profile). Pictures in `Animation/docs/`.
