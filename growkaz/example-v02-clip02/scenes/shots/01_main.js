// V02 Clip 2 "the roommate's 62" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, ROOMMATE } from '/engine/toon2d.js';
import { blink, headNum, camEase } from '/engine/storyfx.js';
import { kitchen, kitGround, counterTop, toasterSpot } from '/engine/sets/kitchen.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const RX = () => toasterSpot().x - 170;                          // roommate stands left of the toaster, facing it
const roommate = (g, t, o = {}) => drawToon(g, { x: RX(), y: kitGround(), s: V(1.6, 1.6), facing: o.facing ?? 1, cast: ROOMMATE,
  pose: o.pose || breathe(POSES.stand, t, 1, 2), expr: o.expr || 'neutral', talk: o.talk, look: o.look, blink: blink(t, 3.3), rim: o.rim });
const headY = () => kitGround() - 300 * V(1.6, 1.6);
function toast(g, x, y, burnt = 1) { rr(g, x - 30, y - 50, 60, 56, 14); g.fillStyle = burnt > 0.5 ? '#3a2418' : '#d8a060'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 4; g.stroke(); }

// b01 "You walk into the kitchen."  wide warm morning kitchen, he steps in from the left (short walk, then settles)
registerShot('b01', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.06, z1: 1.0, x0: -160, x1: -60 });
  const { M } = kitchen(g, t, cam, { smoke: 0.5 });
  const k = ease.out(prog(t, 0, info.dur * 0.85)), walking = k < 0.97;
  layer(g, cam, 1, (g) => {
    roommate(g, t, { rim: rim(M) });
    drawToon(g, { x: lerp(E.W * 0.08, E.W * 0.3, k), y: kitGround(), s: V(1.6, 1.6), facing: 1, cast: HERO, pose: walking ? walkPose(t * 7) : breathe(POSES.stand, t), expr: 'tired', blink: blink(t), rim: rim(M) });
  });
} });

// b02 "Your roommate is burning toast, as usual."  closer: smoke pours out, black toast pops, he fans it away
registerShot('b02', { draw(g, t, info) {
  const ts = toasterSpot(), c = { x: ts.x - 80 - E.W / 2, y: ts.y - 120 - E.H / 2 };
  const cam = camEase(t, info.dur, { z0: 1.25, z1: 1.32, x0: c.x - 60, x1: c.x + 20, y0: c.y * 0.6, y1: c.y * 0.6 });
  const { M } = kitchen(g, t, cam, { smoke: 1 });
  layer(g, cam, 0.85, (g) => { const p = ease.outBack(prog(t, 1.2, 1.5)); toast(g, ts.x - 20, ts.y - 80 - 70 * p); toast(g, ts.x + 25, ts.y - 80 - 60 * p); });
  layer(g, cam, 1, (g) => roommate(g, t, { pose: posesAt(t, [[0, 'stand'], [1.3, 'wave'], [1.6, 'talk'], [1.9, 'wave'], [2.2, 'talk']]), expr: t < 1.2 ? 'neutral' : 'nervous', rim: rim(M) }));
} });

// b03 "And above his head, floating in the air like a video game,"  slow tilt up from his face to the air above his head; pixel sparkles gather
registerShot('b03', { draw(g, t, info) {
  const c = { x: RX() - E.W / 2, y: headY() - E.H / 2 };
  const cam = camEase(t, info.dur, { z0: 1.35, z1: 1.4, x0: c.x, x1: c.x, y0: c.y + 60, y1: c.y - 90 });
  const { M } = kitchen(g, t, cam, { smoke: 0.7 });
  layer(g, cam, 1, (g) => {
    roommate(g, t, { expr: 'nervous', pose: breathe(POSES.stand, t), rim: rim(M) });
    const k = prog(t, 1.0, info.dur);
    for (let i = 0; i < 10; i++) { const a = i * 0.63 + t * 1.5, rr0 = 130 * (1 - k) + 18; g.fillStyle = alpha(['#8dffc8', '#ffe28a', '#9fd8ff'][i % 3], 0.85 * k);
      g.fillRect(RX() + Math.cos(a) * rr0 - 6, headY() - 30 + Math.sin(a) * rr0 * 0.6 - 6, 12, 12); }
    glow(g, RX(), headY() - 30, 120, '#8dffc8', 0.3 * k);
  });
} });

// b04 "sixty-two."  the 62 pops above his head, game-style
registerShot('b04', { draw(g, t, info) {
  const c = { x: RX() - E.W / 2, y: headY() - E.H / 2 };
  const cam = camEase(t, info.dur, { z0: 1.3, z1: 1.36, x0: c.x, x1: c.x, y0: c.y - 20, y1: c.y - 30 });
  const { M } = kitchen(g, t, cam, { smoke: 0.6 });
  layer(g, cam, 1, (g) => { roommate(g, t, { expr: 'neutral', rim: rim(M) }); headNum(g, RX(), headY(), '62', t, 0.2, { size: 72 });
    if (t > 0.2 && t < 1.0) FX.rings(g, RX(), headY(), t, { color: '#8dffc8', r0: 50, r1: 200, a: 0.5 * (1 - prog(t, 0.2, 1.0)) }); });
} });

// b05 "No label. No unit."  tight on the number: two empty dashed slots (where a label / unit would be) pop in, stay empty
registerShot('b05', { draw(g, t, info) {
  blurLayer(g, 12, (g) => kitchen(g, t, { z: 1.4, x: RX() - E.W / 2, y: headY() - E.H / 2 + 60 }, { smoke: 0.5 })); veil(g, '#120a10', 0.3);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z, cx = E.W / 2, cy = E.H / 2;
  g.save(); g.translate(cx, cy); g.scale(k, k);
  headNum(g, 0, 0, '62', t, -1, { size: 150 });
  const slot = (x, y, w, t0) => { const p = ease.outBack(prog(t, t0, t0 + 0.3)); if (p <= 0) return; g.save(); g.translate(x, y); g.scale(p, p);
    g.setLineDash([16, 12]); g.strokeStyle = alpha('#ffffff', 0.7); g.lineWidth = 5; rr(g, -w / 2, -45, w, 90, 18); g.stroke(); g.setLineDash([]);
    if (Math.floor(t * 2.5) % 2) seg(g, [[-w / 2 + 30, -25], [-w / 2 + 30, 25]], 5, alpha('#ffffff', 0.8)); g.restore(); };
  slot(0, 150, 330, 0.08); slot(260, 0, 170, 0.96);
  g.restore();
} });

// b06 "Just sixty-two, and a feeling that it means something."  giant face: he studies it, the green glow on his face
registerShot('b06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.3, x: -200, y: -60 }, { smoke: 0.3 })); veil(g, '#120a10', 0.2);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z;
  bigToonFace(g, E.W / 2 - 120, E.H * 0.53, r, { cast: HERO, expr: 'thinking', look: [0.7, -0.5], blink: blink(t), rimColor: '#8dffc8' });
  glow(g, E.W * 0.85, E.H * 0.2, 380, '#8dffc8', 0.22 + 0.05 * Math.sin(t * 3));
} });

// b07 "He looks up."  the roommate turns from the toaster and looks straight at us, toast in hand
registerShot('b07', { draw(g, t, info) {
  const c = { x: RX() - E.W / 2 + 60, y: headY() - E.H / 2 + 120 };
  const cam = camEase(t, info.dur, { z0: 1.2, z1: 1.25, x0: c.x, x1: c.x, y0: c.y, y1: c.y });
  const { M } = kitchen(g, t, cam, { smoke: 0.3 });
  layer(g, cam, 1, (g) => { roommate(g, t, { facing: t < 0.4 ? 1 : -1, pose: breathe(POSES.holdFront, t), expr: t < 0.4 ? 'neutral' : 'surprised', look: t < 0.4 ? [0.6, 0.4] : [-0.2, -0.3], rim: rim(M) });
    headNum(g, RX(), headY(), '62', t, -1, { size: 56 }); });
} });

// b08 "Why are you staring at my hair?"  he pats his hair, puzzled, talking (narrator voices him)
registerShot('b08', { draw(g, t, info) {
  const c = { x: RX() - E.W / 2 + 60, y: headY() - E.H / 2 + 120 };
  const cam = camEase(t, info.dur, { z0: 1.25, z1: 1.3, x0: c.x, x1: c.x, y0: c.y, y1: c.y });
  const { M } = kitchen(g, t, cam, { smoke: 0.2 });
  layer(g, cam, 1, (g) => { roommate(g, t, { facing: -1, pose: breathe(posesAt(t, [[0, 'talk'], [0.5, 'handsOnHead']]), t), expr: 'confused', talk: talkAmount(info.start + t), rim: rim(M) });
    headNum(g, RX(), headY() - 30, '62', t, -1, { size: 56 }); });
} });

// b09 "You don't answer."  giant face: blank stare, eyes locked up on the number
registerShot('b09', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.3, x: -200, y: -60 }, {})); veil(g, '#120a10', 0.2);
  const r = V(240, 270) * camEase(t, info.dur, { z0: 1.0, z1: 1.05 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: 'neutral', look: [0.5, -0.8], blink: false, rimColor: '#8dffc8' });
} });

// b10 "You can't stop looking."  over-the-shoulder: his blurred shoulder in front, the roommate + glowing 62 in focus; slow push
registerShot('b10', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.22, x0: RX() - E.W / 2 - 80, x1: RX() - E.W / 2 - 40, y0: -40, y1: -80 });
  const { M } = kitchen(g, t, cam, { smoke: 0.2 });
  layer(g, cam, 1, (g) => { roommate(g, t, { facing: -1, pose: breathe(POSES.crossArms, t), expr: 'awkward', rim: rim(M) }); headNum(g, RX(), headY(), '62', t, -1, { size: 60 }); });
  blurLayer(g, 18, (g) => drawToon(g, { x: E.W * 0.1, y: E.H * 1.35, s: V(4.2, 4.4), facing: 1, cast: HERO, pose: POSES.stand, expr: 'neutral', rim: false, shadow: false }));
} });
