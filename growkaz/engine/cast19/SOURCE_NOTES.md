# Reusable animated cast

Start here when creating a film scene or improving a performer. Open index.html in a browser to audition the cast. Treat the characters and motions in this folder as the starting point for future scenes. Keep this guide and its companion (AGENTS.md for Codex, CLAUDE.md for Claude Code) in sync when the workflow changes.

## Pick the performer

Choose the character, wardrobe, expression, action and facing in the viewer. Bookmark the resulting address to recall that combination. Keep the same character ID across shots so the face, hair, skin tone, height and build stay recognizable when clothes change. The lead has a rounded face, dark curls, chin stubble and a crooked smile. Use Main Character - Sunset Train v3.png for illustrated style and the live viewer for the current code rendering.

Cast and wardrobe definitions live in cast.js. Browse Cast.people and Cast.outfits for valid IDs. Each rig exposes POSE_NAMES, EMOTIONS and PHONEMES. Add new identities and costumes to the shared cast when needed. Make shared movement and anatomy improvements in rig.js so the whole cast benefits.

## Place characters in a scene

Load rig.js followed by cast.js as ordinary browser scripts. These two files can travel together into another project. Create a canvas, choose a character with Cast.rig(personId, outfitId), then call its draw method each frame using elapsed seconds. A character's x and y place its ground origin. The scale controls its size. Clear or repaint the background once per frame before drawing the actors, from farthest to nearest.

This example draws the lead walking left on a 1200-pixel-wide stage. Call it every frame. The gait's own travel distance keeps planted feet in step with the crossing.

~~~js
const lead = Cast.rig('lead', 'original');

function drawLead(ctx, seconds) {
  const pose = lead.motion('walk', seconds, { yaw: -Math.PI / 2 });
  const scale = 0.72;
  const x = 1050 - pose.travelX * scale;
  lead.draw(ctx, { x, y: 680, scale, pose, time: seconds, emotion: 'teasing' });
}
~~~

For other body proportions, also multiply the horizontal travel by (rig.look.height || 1) and (rig.look.build || 1). For a crowd shot, call Cast.rush(ctx, seconds, seed) on a 1200 by 960 canvas. Save the seed with the shot to reproduce the casting, costumes and timing.

## Direct the performance

Yaw is in radians. Use 0 for front, negative or positive PI/2 for left or right profile, and PI for back. The intermediate angles give three-quarter views. For lateral travel, turn the whole body into profile. In conversation, angle the shoulders toward the partner and let the eyes lead the reaction. Give jokes a setup, a short hold and a response. A deadpan glance, suppressed laugh or delayed eyebrow lift can carry the beat. Use the expression IDs deadpan, teasing, stifledLaugh, mockShock, caughtOut or smugAside.

Time a speaking character's mouth to the recorded dialogue with the phoneme option. Use blendEmotion for a gradual reaction. In seated shots place the chair under the pelvis, as in the viewer. Choose actions that make contact with the actual props in the scene.

## Check the result

Preview at normal speed, then slow playback to inspect foot planting, elbow direction, hand contact, chair contact and the overlap of near and far limbs. Check the requested costume and camera angle. After rig edits, run node check-rig.cjs from this folder. It checks bone lengths and planted-foot drift. Some extreme poses reach the rig's limits, so inspect the frames as well.

index.html provides local previews, transparent character PNGs, pose sheets and expression sheets. render.mjs uses this workspace's Playwright installation and a machine-specific browser path for offline rendering. The interactive viewer and the two reusable runtime scripts work independently of that renderer.

## Stage a scene in Riverside

Open world.html to audition the printworks office, market road, willow promenade or lantern terrace with any cast member. Pick one of four day or four night looks. The terrace defaults to sitting on the bench. Choose Play four-shot sequence to see the lead move between locations over one day.

Use the recurring clock tower, bridge and river as landmarks. Cut to the office for a decision, use the pavement for an errand, give an emotional beat space on the promenade, or bring two ideas together in the quiet at the bench. Choose the setting and time of day that fit the actual narration. The desk lamp, shopfront light and terrace lantern motivate warmer night shots.

For a new HyperFrames project, copy world-hyperframes.html into the new project as index.html. Place rig.js, cast.js, world.js and the world-assets directory beside it. Keep the existing cast studio index.html in this kit. Edit Riverside.example in the project copy or pass your own shot array to Riverside.sequence(ctx, seconds, shots). Each shot has duration in seconds, place, look, camera, person, outfit, action, emotion and optional yaw, x, y, scale. For dialogue, pass a time-specific phoneme to Riverside.draw. Camera options are wide, follow and detail. The look and place IDs are listed in Riverside.looks and Riverside.locations. Set composition, clip and timeline durations to the sum of shot durations. The example is sixteen seconds. Seek the timeline to check the first frame, cuts and last frame before rendering.
