// V02 Clip 22 "paying it back" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM } from '/engine/toon2d.js';
import { blink, headNum, numChange, camEase } from '/engine/storyfx.js';
import { cafe, cafeGround, tableSpot, cup } from '/engine/sets/cafe.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const S = () => V(1.6, 1.6), HX = () => tableSpot().x - 270, SX = () => tableSpot().x + 270;
const samHead = () => cafeGround() - 292 * S();                 // seated head-top height
function envelope(g, x, y, s, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  for (let i = 0; i < 3; i++) { rr(g, -70 + i * 8, -60 - i * 6, 130, 60, 6); g.fillStyle = '#7ab87a'; g.fill(); g.strokeStyle = '#2f6a3a'; g.lineWidth = 3; g.stroke(); circle(g, -5 + i * 8, -30 - i * 6, 14, '#5a9a5a'); }
  rr(g, -90, -40, 180, 110, 8); g.fillStyle = '#f4ead2'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 5; g.stroke();
  seg(g, [[-90, -40], [0, 20], [90, -40]], 4, '#c8b890'); g.restore();
}
function tablePair(g, t, M, o = {}) {
  FX.chair(g, HX() - 30, cafeGround(), 1.6, '#3a2a22'); FX.chair(g, SX() + 30, cafeGround(), 1.6, '#3a2a22');
  drawToon(g, { x: HX(), y: cafeGround(), s: S(), facing: 1, cast: HERO, pose: breathe(o.hp || POSES.sit, t, 0.6), expr: o.he || 'smile', blink: blink(t), rim: rim(M) });
  drawToon(g, { x: SX(), y: cafeGround(), s: S(), facing: -1, cast: SAM, pose: breathe(o.sp || POSES.sit, t, 0.6, 2), expr: o.se || 'neutral', talk: o.talk, blink: blink(t, 3.4), rim: rim(M) });
  const ts = tableSpot(); envelope(g, ts.x + 60, ts.y - 4, 0.5, 0.1); cup(g, ts.x - 60, ts.y, 0.8, 1, t);
}

// k01 "You pay back the two hundred dollars,"  table top close: his hand slides the envelope of bills across to Sam
registerShot('k01', { draw(g, t, info) {
  const ts = tableSpot(), cam = camEase(t, info.dur, { z0: 1.0, z1: 1.06 });
  blurLayer(g, 12, (g) => cafe(g, t, { z: 1.35, x: (ts.x - E.W / 2) / 0.85, y: -40 })); veil(g, '#120a10', 0.15);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(cam.z, cam.z); g.translate(-E.W / 2, -E.H / 2);
  g.fillStyle = '#8a5a3a'; g.beginPath(); g.ellipse(E.W / 2, E.H * 0.78, 1100, 200, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
  const k = ease.inOut(prog(t, 0.1, 1.2)), ex = lerp(E.W * 0.2, E.W * 0.58, k);
  envelope(g, ex, E.H * 0.72, 2.0, 0.05);
  g.fillStyle = HERO.top; g.beginPath(); g.ellipse(ex - 330 - (1 - k) * 60, E.H * 0.76, 170, 60, 0.05, 0, 7); g.fill();
  g.fillStyle = HERO.skin; g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.beginPath(); g.ellipse(ex - 170, E.H * 0.73, 70, 46, 0, 0, 7); g.fill(); g.stroke();
  g.restore();
} });

// k02 "plus a coffee."  a steaming cup slides in beside the envelope with a little settle; steam curls up
registerShot('k02', { draw(g, t, info) {
  const ts = tableSpot(), cam = camEase(t, info.dur, { z0: 1.06, z1: 1.1 });
  blurLayer(g, 12, (g) => cafe(g, t, { z: 1.35, x: (ts.x - E.W / 2) / 0.85, y: -40 })); veil(g, '#120a10', 0.15);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(cam.z, cam.z); g.translate(-E.W / 2, -E.H / 2);
  g.fillStyle = '#8a5a3a'; g.beginPath(); g.ellipse(E.W / 2, E.H * 0.78, 1100, 200, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
  envelope(g, E.W * 0.58, E.H * 0.72, 2.0, 0.05);
  const k = ease.outBack(prog(t, 0.05, 0.6)); cup(g, lerp(-200, E.W * 0.36, k), E.H * 0.76, 2.2, prog(t, 0.5, 1.2), t);
  g.restore();
} });

// k03 "Forty-nine."  two-shot at the little table, Sam's 49 glowing on his head
registerShot('k03', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.16, x0: 30, x1: 50, y0: -50, y1: -50 });
  const { M } = cafe(g, t, cam);
  layer(g, cam, 0.85, (g) => { tablePair(g, t, M, { se: 'surprised' }); headNum(g, SX(), samHead(), '49', t, 0.1, { size: 56 }); });
} });

// k04 "Fifty-three."  Sam picks up the coffee and smiles; 49 -> 53 (+4)
registerShot('k04', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.16, z1: 1.22, x0: 80, x1: 110, y0: -60, y1: -60 });
  const { M } = cafe(g, t, cam);
  layer(g, cam, 0.85, (g) => { tablePair(g, t, M, { se: t < 0.15 ? 'surprised' : 'smile' }); numChange(g, SX(), samHead(), '49', '53', t, 0.15, { size: 56 }); });
} });

// k05 SAM: "You're actually listening this time."  over the hero's shoulder: Sam talks, warm and a little teasing
registerShot('k05', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.25, z1: 1.32, x0: (SX() - E.W / 2) / 0.85 - 120, x1: (SX() - E.W / 2) / 0.85 - 100, y0: -80, y1: -90 });
  const { M } = cafe(g, t, cam);
  const talk = talkAmount(info.start + t, 5.5, 8.1);
  layer(g, cam, 0.85, (g) => { drawToon(g, { x: SX(), y: cafeGround(), s: S(), facing: -1, cast: SAM, pose: breathe(posesAt(t, [[0, 'sit'], [0.6, 'explain'], [2.2, 'sit']]), t, 0.6), expr: 'smug', talk, blink: blink(t, 3.4), rim: rim(M) });
    headNum(g, SX(), samHead(), '53', t, -1, { size: 50 }); });
  blurLayer(g, 18, (g) => bigToonFace(g, E.W * 0.12, E.H * 0.95, 300, { cast: HERO, expr: 'smile' }));
} });

// k06 "Fifty-three."  giant Sam face, soft smile, the 53 glowing warm over him
registerShot('k06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => cafe(g, t, { z: 1.3, x: 300, y: -80 })); veil(g, '#120a10', 0.15);
  const M = mood('golden'), r = V(220, 250) * camEase(t, info.dur, { z0: 1.0, z1: 1.05 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.58, r, { cast: SAM, expr: 'smile', blink: blink(t, 3.4), rimColor: M.rim });
  headNum(g, E.W / 2, E.H * 0.58 - r * 1.55, '53', t, -1, { size: 90 });
} });

// k07 "Not a miracle. A start."  wide: they laugh together at the table as the sun sets; slow crane-style pull-out
registerShot('k07', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.22, z1: 1.0, x0: 40, x1: -40, y0: -60, y1: 0 });
  const { M } = cafe(g, t, cam);
  layer(g, cam, 0.85, (g) => { tablePair(g, t, M, { he: t > 0.6 ? 'laugh' : 'smile', se: t > 0.4 ? 'laugh' : 'smile', sp: posesAt(t, [[0, 'sit'], [0.5, 'sitBack']]) });
    headNum(g, SX(), samHead() - 10, '53', t, -1, { size: 44 }); });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });
