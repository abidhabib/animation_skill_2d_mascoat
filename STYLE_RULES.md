# Style rules — measured from the reference videos (not copied)

Source of numbers: 4 segments of "Why Google Hired a Chinese Spy" (01:49–01:56, 02:57–03:10, 05:20–05:26, 16:52–17:08), one segment of the IQ video (05:37–06:00), the two screenshots you sent, and my own Clip 92 and Clip 25 measured the same way. Measured with ffmpeg + a small Node script (frame differences, brute-force zoom/pan search, brightness grids). Visual points are marked (seen) — those are my reading of frames, not a measurement.

## 1. Cuts
| Rule | Measured |
|---|---|
| Cut rate (Google video) | 40–46 cuts/min. Mean shot 1.2 s, median 0.8–1.5 s |
| Shot length range | 0.6–2.5 s typical; holds of 3–5.7 s only for reading text or an emotional beat |
| Fast stretches | 02:57–03:10 listing facts: 11 shots in 13 s, none over 2.4 s |
| IQ video | 35 cuts/min, mean 1.6 s |
| Transition fragments (<0.4 s) | about one every 4–5 s. Clip 25 has about one per second (too frantic) |
| Cut timing vs voice | Cuts land in voice pauses: loudness dips to −29…−38 dB against a −13…−20 dB voice, a pause every 1–2 s |
| Shot pattern (seen) | wide → closer/insert (prop, note, label) → wide. New place = new shot, never mid-sentence |
| Read time | Text on screen holds ≥ 1 s per 3 words |
**Target for new clips: 40–48 cuts/min; at most 1 transition fragment per 4 s.**

## 2. Camera
| Rule | Measured |
|---|---|
| Camera moves | Nearly every shot over 1 s has a slow move (Google video). IQ video: zero movement |
| Direction | Push-in most common (about 70% of moving shots); pull-out used on reveals (cloud scene) |
| Speed | Typical 2%/s of zoom, range 0.3–7%/s. Total per shot 2–11% |
| Pan | Tiny: 0–7 px/s on a 320 px frame (≤ 2% of width per second) |
| Easing | Smooth in-out, no jerk (seen) |
| Close-ups | Done by cutting to a tighter framing, not by zooming past 11% (seen) |
**Target: push-in 1.5–3%/s on every shot ≥ 1.2 s; pans under 2% of width/s; close-up = new framing with softened background.**

## 3. Light — where it comes from
| Rule | Measured |
|---|---|
| Glow centre | Brightest 4% of pixels sits at x 0.42–0.58, y 0.35–0.55 in all 7 reference frames: near the middle, never at an edge |
| Falloff | Soft vignette: corners 8–27% darker than centre in Google video (ratio 0.73–0.92). IQ video stronger: 0.53 (tension) |
| Direction | Not a hard directional light. Ambient glow from an object in the scene: lamp, window, sun, floodlight (seen) |
| Warm / cool | Interiors and dusk are warm (R−B ≈ +50 to +100). Daytime sky is cool (R−B ≈ −66) |
| Your office screenshot | Brightest at (0.57, 0.35); bottom-left and corners darkest (63–81) against 144 at top centre |
| Your construction screenshot | Bright sky behind at top; board in the middle is darkest (61); warm glow R−B = +102 |
| On characters (seen) | Warm glow on faces and tops, a light pool on the floor under feet, soft shadow ellipse (~20% black) |
| Light objects (seen) | Every source is drawn: glow disk 40–60% opacity; lamp gets a soft cone ~20–25% |
**Target: put the main glow in the middle third of the frame; vignette 10–25% (up to 45% for tension); add warm floor pool and top-light to each character.**

## 4. Colour and surface
| Rule | Measured |
|---|---|
| Saturation | Google video average 0.27–0.45. Clip 92: 0.48. Clip 25: 0.68 (too strong) |
| Cause of strong colour | `index.html` applies `saturate(1.35) contrast(1.06)` to every scene |
| Flat fill share | Reference 13–37% of frame area. Clip 25: 52% (the "solid colour" problem). Clip 92: 32% |
| Gradient / shaded share | Reference 21–42%. Clip 25: 11%. Clip 92: 34% |
| Detail and edges | Reference 27–54% |
| Dominant colours | Cream/beige walls (#e8d8a8, #d8c898), navy darks (#182838), soft sky blues (#88c8f8), pale yellow. Brand colours only as small accents |
| Dark pixels (ink and night) | 2–40%, depends on scene. Daytime sky 2%, night interiors 20–40% |
| Outline (seen) | Thin and even, about 3 px at 1080p. Mine is about 6 px |
**Target: saturation 0.30–0.45; filter saturate 1.0–1.08; flat fills under 35% of the frame; every background has a gradient and at least 3 depth layers.**

## 5. Environment (seen)
1. Three layers: far (sky, skyline, window view), mid (furniture, buildings, scaffolding), near (character, foreground plant or table edge).
2. Every room has small story props (microwave clock, magnets, stools, mugs, ID badge reader).
3. Brand colours appear as small repeated details, never as full backgrounds.
4. Clouds are soft overlapping circles with a pale blue underside.
5. Night scenes keep a visible window with trees; interior stays warm.

## 6. Characters (seen)
1. Egg or pear body, thin line legs, thin line arms with small hand circles.
2. Eyes: small white ovals with dot pupils, glasses on some; mouth is one simple shape.
3. Expression held for a beat then snapped, with eyebrows doing most of the acting.
4. Idle bob and blink every 2–4 s; one gesture per line of dialogue.
5. Scale: full body about 20–28% of frame height in wide shots, about half the frame in medium, head about a third of the frame in close-up.
6. Crowd characters are simple, repeated, slightly offset in timing.

## 7. Text and graphics (seen)
1. Handwritten font, 1–3 words, in a rounded dark pill or white card.
2. Pops in with a small bounce on the key word.
3. Counters roll up fast and slow at the end.
4. Highlighter sweeps lines as they are spoken.
5. Dates and numbers appear as stickers or boards.

## 8. Sound (measured, not heard)
1. Voice steady at −13 to −20 dB, pauses every 1–2 s.
2. Cuts sit on the pauses.
3. No loud spikes found: effects, if any, are mixed quietly under the voice.

## 9. Second reference set: Paris 1925 office (3 screenshots, measured + seen)
Measured on the three frames: dark pixels (brightness < 55 of 255) 60–73% of the frame; vignette (corner / centre brightness) 0.53–0.55 wide, 0.27 close-up; saturation 0.39–0.48; flat fill only 5–10% in wide shots (gradient/shaded 51–52%, detail 38–44%); brightest area at x 0.42–0.64, y 0.44–0.53.

### Light
1. Dark and moody: about two thirds of the frame is dark. Light exists only where a source is drawn.
2. One practical light drives the room: the green desk lamp. It has a warm glow disk, a bright shade rim and thin light rays fanning down (seen).
3. A second, cool light from the window: a moon with two soft halo rings, a large faint disk behind the tower (seen).
4. Warm (lamp) against cool (moon): two colour temperatures in one frame.
5. The subject is the brightest thing: in the close-up the face and chest measure 136 against 28–71 for everything around. Hierarchy rule: subject at least 2x brighter than the surroundings.
6. Walls fade darker toward the top and corners; the floor fades darker toward the far left and bottom corners (seen).
7. Strong vignette 45–50% on wide shots, 70% on close-ups.

### Close-up (shot 2)
1. Background is heavily blurred (large soft blur, roughly 25–30 px at 1150 px wide) but still readable as colour shapes: calendar, clock, chair, plant.
2. Background is also darkened; the character stays crisp with full outline.
3. Head fills about 45% of frame height; the body is cropped at chest.
4. Mouth opens with a visible tongue and teeth for speech; one hand waves into frame.
5. The hair carries a soft light arc (a thin pale highlight on the dark hair, seen) so the head reads as round and lit from above.

### Main character (seen)
1. Egg or pear body in a suit (navy), red tie, white pocket square, thin black legs, thin arm line ending in a small hand circle.
2. Round head, soft two-tone shading: lighter skin on top, slightly darker toward the lower edge. Not a flat disc.
3. Half-closed eyelids (flat lines with short eyebrow dashes, no white eye), moustache, a small smug smile. Personality comes from the lids and brows.
4. Body has a faint lighter band on the lit side and a darker side opposite.
5. Outline is thin and uniform, about 2–3 px at 1280 wide.
6. Placement: standing in the right third, full body about 55–60% of frame height, soft ellipse shadow on the rug.

### Supporting characters (seen)
1. Six men in a line, same pear body, each different: hat (bowler, fedora), glasses, moustache, hair, jacket colour (muted green, purple, brown, teal, grey), tie colour.
2. Smaller than the main character (about 70% of his height), so scale shows importance.
3. Plain neutral faces with tiny dot eyes; they sit in front of the window on the left, slightly staggered up and down and overlapping.
4. Muted jacket colours, so the main character still stands out.

### Environment (seen)
1. Place and time are told by props, not captions: Eiffel Tower through the window, a calendar reading MAI 1925, vintage microphone, banker lamp, wood desk with brass knobs.
2. Layers: window view (moon, stars, houses with lit windows, tower), red curtains with vertical shading, wallpaper with vertical stripes, wood panelling, planked floor, oval rug with a gold ring.
3. Every surface has a gradient or pattern: stripes, panels, planks, folds. Nothing is a plain fill.
4. Small ordinary objects add life: framed picture, clock, books, plant, red chair.
5. Composition: window on the left, desk on the right, the character between them in the empty floor area, with the rug anchoring his feet.

### What our kit is missing against this set
1. A practical lamp with rays and a window light with halo rings.
2. Dark overall exposure: ours is bright and evenly lit.
3. Soft shading on heads and bodies and a hair highlight.
4. Heavy blurred, darkened background on close-ups.
5. Size hierarchy for supporting characters and varied accessories (hats, moustaches).
6. Period props and patterned surfaces (wallpaper stripes, wainscot, floor planks, rug).
