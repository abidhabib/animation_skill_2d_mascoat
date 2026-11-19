# NEXT LEVEL: honest weaknesses and upgrade brief (written 2026-11-19 for a stronger model, e.g. Opus 5.5)

Goal: animation that looks like a professional 2D explainer / Short, not a slideshow. The user's own words about earlier versions: "feels like presentation switching images", "generic", "old 2010", "character on the very bottom of the screen looks weird". Judge every result against that.

## Read first
`START_HERE.md`, `LIBRARY.md` (esp. "Cinematic shots, not slides", "YouTube Shorts", "Number tags"), `STYLE_RULES.md`, `PACKAGING_PLAYBOOK.md`, `VOICES.md`, the skill `cartoon-explainer-clip`, and the working example `specs/short_trust.json` + `renders/Short 1.mp4`. Project rules: `../CLAUDE.md` (token-light, never generate voice without a go-ahead, never delete clips/renders, no copying other creators' art).

## Known weaknesses (fix in this order)
1. **Vertical safe zone (user complaint).** In Shorts/Reels the bottom ~20% and top ~12% are covered by the app UI. Our Short 1 puts feet at stage y=1040 (screen bottom edge). Rule: in portrait keep feet at stage y about 860-880 (use `cam.fy` about 700 at k=1 so the ground line lands higher), captions in the top safe band, nothing important in the bottom 20% or the right 15% (buttons). Bake this into `new-clip.sh S<k>` defaults and a lint in `scene.py` that warns when a char's feet or a text block falls outside the safe box.
2. **Still too slide-like.** Only 3 shots, simple pans. Add: parallax foreground layers (blurred lamp posts / railings passing at 1.6x speed), depth-of-field blur on background, speed-ramped push-ins, whip-pans that carry motion blur and match the next shot, match cuts (the glowing number stays and moves to the next head), camera orbit feel using layered x-shifts, light changes, dust/particles, screen-edge vignette pulses on beats.
3. **Character acting is thin.** No smooth body turn or back-view turn, no anticipation/overshoot on gestures, no weight shift, mouths flap without audio-driven lip sync. Build: audio-loudness lip sync from `assets/vo.mp3` (RMS per frame -> mouth open), anticipation + follow-through on arms, a real body turn, eye darts, blink variety, breathing, secondary motion on hoodie strings and the curl.
4. **Cast collisions.** Crossing walkers overlap hero and each other; stagger depths/scales (smaller + higher y for far extras), z-order by y, and add shadows. Pear characters have no side/back views; the mascot has them. Keep the hero yellow, extras varied by age/skin/shirt/accessories; add more costume/hair options (hats, scarves, backpacks, uniforms) so a dad, boss, kid, cashier, doctor look different at a glance.
5. **Environments are 2-3 layer.** Add richer layered streets/rooms with lit windows, moving traffic, pedestrians in the far layer, weather and time-of-day shifts inside one shot, reflections on wet roads, interior props that respond (door opens, lamp flickers).
6. **Typography/graphics.** Captions are plain outlined text. Add kinetic-type presets (word-by-word pop with spring, underline wipes, number counters), animated icons, lower-third styles, and the number tag variants (count up/down, shake on drop, color shift with value). No boxes behind numbers (user rule).
7. **Audio is missing from the pipeline.** Plan (do not generate voice without the user's go-ahead): music bed with ducking, whooshes on whips, hit sounds on number pops and slams, room tone changes per shot; captions burned in from `vo.words.json`.
8. **Vertical mode gaps.** Only a centre crop of the 16:9 stage (x 656..1264). Consider a true portrait stage (native 1080x1920 environments) so backgrounds are composed for portrait instead of cropped.
9. Untested: the skill `video-script-writer` in a brand-new session; vehicle/machine motion only checked in single frames.

## Hard rules learned (do not repeat these mistakes)
- Number tags = glowing number only, never a pill/box/background.
- Centre text blocks vertically in the safe area; never push text to the bottom; keep text off faces.
- Every side character must look like its role/age and different from the others.
- Never reuse a scene's char ids (`<sid>-c0`) in your own element ids (an id clash hid the hero).
- GSAP: never tween a transform on an element that has a transform attribute (wrap it); seek-safe code only (no Math.random, finite repeats).
- Captions that must stay on screen go in `overlay` (outside the camera group).

## How to verify (token-light but honest)
Render, then build contact sheets with ffmpeg (16 frames across the clip, plus 3-4 larger frames at the moments that matter) and LOOK at them: safe zones, overlaps, motion between frames (compare frame pairs 0.3 s apart). Fix, re-render, repeat max 3 loops. Send the final with SendUserFile.

## Definition of done for the next Short
No element in the bottom 20%; at least 5 distinct camera behaviours; parallax foreground in every shot; synced mouth to audio (when the voice-over exists); sound design list written; the user says it no longer feels like slides.
