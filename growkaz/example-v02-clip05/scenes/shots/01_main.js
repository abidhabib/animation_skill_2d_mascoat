// V02 Clip 5 "the three rules" (GrowKaz engine + our cast). Rules are shown as big glowing 1 / 2 / 3 badges + a live demo of each.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, ring, glow, alpha, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SHOPPER, STRANGER } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater, camEase } from '/engine/storyfx.js';
import { mall, mallGround } from '/engine/sets/mall.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const GOLD = '#ffe28a';
// big round rule badge (1/2/3), pops in with a ring, then rides top-left; screen space
function badgeN(g, n, t, t0 = 0.05, big = 1) {
  const p = ease.outBack(prog(t, t0, t0 + 0.4)); if (p <= 0) return;
  const settle = ease.inOut(prog(t, t0 + 0.7, t0 + 1.2)), x = lerp(E.W / 2, 190, settle), y = lerp(E.H * 0.42, 170, settle), r = lerp(170 * big, 90, settle);
  g.save(); g.translate(x, y); g.scale(p, p); glow(g, 0, 0, r * 2.4, GOLD, 0.35);
  circle(g, 0, 0, r * 1.06, '#1b1424'); circle(g, 0, 0, r, '#2a2040'); ring(g, 0, 0, r * 0.86, r * 0.06, GOLD);
  text(g, String(n), 0, r * 0.08, { size: r * 1.15, color: '#ffffff', glow: 18, glowColor: GOLD, stroke: 0 }); g.restore();
  if (t < t0 + 0.8) FX.rings(g, x, y, t - t0, { color: GOLD, r0: r, r1: r * 2.2, a: 0.5 });
}

// g01 "There are three rules."  dark stage: three empty badge slots light up one by one, 1 2 3
registerShot('g01', { draw(g, t, info) {
  g.fillStyle = '#120e1c'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.5, 900, '#3a2a5a', 0.5);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  for (let i = 0; i < 3; i++) { const x = E.W / 2 + (i - 1) * 420, y = E.H * 0.5, p = ease.outBack(prog(t, 0.2 + i * 0.22, 0.6 + i * 0.22));
    circle(g, x, y, 132, '#1b1424'); circle(g, x, y, 124, '#221a34'); if (p > 0) { g.save(); g.translate(x, y); g.scale(p, p); glow(g, 0, 0, 280, GOLD, 0.3); ring(g, 0, 0, 108, 7, GOLD);
      text(g, String(i + 1), 0, 12, { size: 140, color: '#ffffff', glow: 16, glowColor: GOLD, stroke: 0 }); g.restore(); } }
  g.restore(); FX.dust(g, t, { count: 30, color: GOLD, a: 0.2 });
} });

// g02 "First, every person gets a number, from zero to one hundred."  badge 1; three shoppers' numbers count up: 0, 50, 100
registerShot('g02', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.02, z1: 1.08, y0: 40, y1: 30 });
  const { M } = mall(g, t, cam);
  const s = V(1.6, 1.6), xs = [E.W / 2 - 480, E.W / 2, E.W / 2 + 480], targets = [0, 50, 100];
  layer(g, cam, 1, (g) => xs.forEach((x, i) => { drawToon(g, { x, y: mallGround(), s, facing: i === 2 ? -1 : 1, cast: SHOPPER(i + 1), pose: breathe(POSES.stand, t + i), expr: ['sad', 'neutral', 'happy'][i], blink: blink(t + i), rim: rim(M) });
    const c = Math.round(targets[i] * ease.out(prog(t, 1.5 + i * 0.35, 3.0 + i * 0.35))); if (t > 1.2 + i * 0.35) headNum(g, x, mallGround() - 300 * s, String(c), t, 1.2 + i * 0.35, { size: 64, color: i === 0 ? '#ff8a7a' : i === 2 ? GOLD : '#8dffc8' }); }));
  badgeN(g, 1, t);
} });

// g03 "Second, it changes live, based on what you say and what you do."  badge 2; you hold a door (+4)... then cut in line (-6)
registerShot('g03', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.1, z1: 1.16, x0: 60, x1: 90, y0: 30, y1: 20 });
  const { M } = mall(g, t, cam);
  const s = V(1.7, 1.7), hx = E.W / 2 - 220, sx = E.W / 2 + 200, t1 = 1.6, t2 = 3.2;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: hx, y: mallGround(), s, facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'talk'], [2.2, 'point'], [3.0, 'shrug']]), t), expr: t < t2 ? 'smile' : 'smug', talk: t > 1.0 && t < 1.8 ? 0.5 * Math.abs(Math.sin(t * 9)) : 0, blink: blink(t), rim: rim(M) });
    drawToon(g, { x: sx, y: mallGround(), s, facing: -1, cast: STRANGER, pose: breathe(POSES.stand, t), expr: t < t1 ? 'neutral' : t < t2 ? 'happy' : 'angry', blink: blink(t, 3.4), rim: rim(M) });
    const hy = mallGround() - 300 * s; if (t < t2) numChange(g, sx, hy, '54', '58', t, t1, { size: 60 }); else numChange(g, sx, hy, '58', '52', t, t2, { size: 60, t0: -1 });
  });
  badgeN(g, 2, t);
} });

// g04 "Third, only you can see it."  badge 3; the stranger looks up above his own head, sees nothing, shrugs. You see it glowing.
registerShot('g04', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.16, z1: 1.22, x0: 160, x1: 180, y0: 20, y1: 10 });
  const { M } = mall(g, t, cam);
  const s = V(1.7, 1.7), sx = E.W / 2 + 200;
  layer(g, cam, 1, (g) => { drawToon(g, { x: sx, y: mallGround(), s, facing: -1, cast: STRANGER, pose: breathe(posesAt(t, [[0, 'stand'], [0.8, 'shrug']]), t), expr: t < 0.8 ? 'confused' : 'neutral', look: t < 1.6 ? [0, -1] : [0, 0], blink: blink(t, 3.4), rim: rim(M) });
    headNum(g, sx, mallGround() - 300 * s, '52', t, -1, { size: 60 }); });
  blurLayer(g, 16, (g) => bigToonFace(g, E.W * 0.14, E.H * 0.9, 300, { cast: HERO, expr: 'smug' }));
  badgeN(g, 3, t);
} });

// g05 "Strangers start around fifty."  slide along a queue of strangers: 48, 51, 50, 52, 49
registerShot('g05', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.05, z1: 1.08, x0: -200, x1: 120, y0: 30, y1: 30 });
  const { M } = mall(g, t, cam);
  const s = V(1.45, 1.45), ns = ['48', '51', '50', '52', '49'];
  layer(g, cam, 1, (g) => ns.forEach((n, i) => { const x = E.W / 2 - 760 + i * 380; drawToon(g, { x, y: mallGround(), s, facing: 1, cast: SHOPPER(i + 2), pose: breathe(POSES.stand, t + i), expr: 'neutral', blink: blink(t + i * 0.7), rim: rim(M) });
    headNum(g, x, mallGround() - 300 * s, n, t, 0.1 + i * 0.12, { size: 54 }); }));
} });

// g06 "They don't trust you yet."  one stranger, arms crossed, cool 50
registerShot('g06', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.2, z1: 1.26, y0: 10, y1: 0 });
  const { M } = mall(g, t, cam);
  const s = V(1.8, 1.8);
  layer(g, cam, 1, (g) => { drawToon(g, { x: E.W / 2, y: mallGround(), s, facing: -1, cast: SHOPPER(5), pose: breathe(POSES.crossArms, t), expr: 'neutral', look: [-0.5, 0], blink: blink(t), rim: rim(M) }); headNum(g, E.W / 2, mallGround() - 300 * s, '50', t, -1, { size: 64 }); });
} });

// g07 "They don't doubt you either."  same stranger uncrosses, a small easy shrug and smile, still 50
registerShot('g07', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.26, z1: 1.3, y0: 0, y1: -10 });
  const { M } = mall(g, t, cam);
  const s = V(1.8, 1.8);
  layer(g, cam, 1, (g) => { drawToon(g, { x: E.W / 2, y: mallGround(), s, facing: -1, cast: SHOPPER(5), pose: breathe(posesAt(t, [[0, 'crossArms'], [0.3, 'shrug']]), t), expr: 'smile', blink: blink(t), rim: rim(M) }); headNum(g, E.W / 2, mallGround() - 300 * s, '50', t, -1, { size: 64 }); });
} });

// g08 "You're just a face."  you stand still in the flowing crowd, faces blur past; slow pull-out
registerShot('g08', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.2, z1: 1.02 });
  const { M } = mall(g, t, cam);
  const s = V(1.6, 1.6);
  layer(g, cam, 1, (g) => drawToon(g, { x: E.W / 2, y: mallGround(), s, facing: 1, cast: HERO, pose: breathe(POSES.stand, t), expr: 'neutral', blink: blink(t), rim: rim(M) }));
  blurLayer(g, 10, (g) => { for (let i = 0; i < 6; i++) { const dir = i % 2 ? -1 : 1, x = ((i * 380 + dir * t * 420 + 3000) % (E.W + 600)) - 300;
    drawToon(g, { x, y: E.H * 1.08, s: V(2.6, 2.6), facing: dir, cast: SHOPPER(i), pose: walkPose(t * 6 + i), expr: 'neutral', rim: false, shadow: false }); } });
} });

// g09 "Which means, you can play this."  giant face: a slow sly grin, eyebrows up
registerShot('g09', { draw(g, t, info) {
  blurLayer(g, 14, (g) => mall(g, t, { z: 1.3, x: 200, y: -80 })); veil(g, '#120a10', 0.2);
  const M = mood('golden'), r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: t < 0.5 ? 'thinking' : 'smug', blink: blink(t), rimColor: M.rim });
  if (t > 0.6) FX.sparkle(g, E.W / 2 + r * 0.9, E.H * 0.53 - r * 0.6, 22 * Math.abs(Math.sin(t * 4)), GOLD, 0.9);
} });

// g10 "And for a while, it feels like a game you're winning."  he strolls through the mall, numbers around him tick up with +2 +3 floaters; crane up
registerShot('g10', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.0, x0: -80, x1: 80, y0: 40, y1: -40 });
  const { M } = mall(g, t, cam);
  const s = V(1.55, 1.55), hx = lerp(E.W * 0.38, E.W * 0.56, ease.inOut(prog(t, 0, info.dur)));
  layer(g, cam, 1, (g) => {
    [[E.W * 0.16, 2, '50', '52', 0.6], [E.W * 0.78, 3, '51', '54', 1.2], [E.W * 0.92, 4, '49', '52', 1.9]].forEach(([x, c, a, b, ts], i) => {
      drawToon(g, { x, y: mallGround(), s, facing: x < E.W / 2 ? 1 : -1, cast: SHOPPER(c), pose: breathe(POSES.wave, t + i), expr: 'happy', blink: blink(t + i), rim: rim(M) }); numChange(g, x, mallGround() - 300 * s, a, b, t, ts, { size: 52 }); });
    drawToon(g, { x: hx, y: mallGround(), s, facing: 1, cast: HERO, pose: walkPose(t * 4.5, { bob: 5, arm: 20 }), expr: 'happy', blink: blink(t), rim: rim(M) });
  });
  FX.dust(g, t, { count: 40, color: GOLD, a: 0.3 });
} });
