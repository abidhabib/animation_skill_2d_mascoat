// V02 Clip 4 "the promise" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, rr, seg, circle, glow, alpha, text, rng } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SHOPPER, MOM, SAM, DAD } from '/engine/toon2d.js';
import { blink, headNum, numChange, camEase } from '/engine/storyfx.js';
import { mall, mallGround } from '/engine/sets/mall.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const NUMS = ['72', '48', '91', '55', '63', '30', '84', '51'];
// shoppers strolling across the concourse; numbers pop on their heads one after another from tPop
function shoppers(g, t, M, o = {}) {
  const s = V(1.45, 1.45), n = o.n || 6;
  for (let i = 0; i < n; i++) {
    const dir = i % 2 ? -1 : 1, x = ((i * 337 + dir * t * 70 + 2000) % (E.W + 400)) - 200, y = mallGround() - (i % 3) * 18;
    drawToon(g, { x, y, s: s * (1 - (i % 3) * 0.06), facing: dir, cast: SHOPPER(i), pose: walkPose(t * 4 + i, { stride: 18, arm: 10 }), expr: ['smile', 'neutral', 'happy', 'neutral'][i % 4], blink: blink(t + i, 3 + i * 0.2), rim: rim(M) });
    if (o.tPop != null) headNum(g, x, y - 300 * s, NUMS[i % NUMS.length], t, o.tPop + i * (o.step || 0.25), { size: 58 });
  }
}
function bubble(g, x, y, t, t0, t1, icon) {                       // speech bubble with an icon that pops, then bursts at t1
  const pin = ease.outBack(prog(t, t0, t0 + 0.3)), burst = prog(t, t1, t1 + 0.35);
  if (pin <= 0) return;
  if (burst > 0) { for (let k = 0; k < 10; k++) { const a = k * 0.63; circle(g, x + Math.cos(a) * 140 * ease.out(burst), y + Math.sin(a) * 140 * ease.out(burst), 12 * (1 - burst), '#ffffff'); } return; }
  g.save(); g.translate(x, y); g.scale(pin, pin);
  rr(g, -90, -80, 180, 150, 40); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(-20, 68); g.lineTo(-50, 110); g.lineTo(10, 68); g.closePath(); g.fill(); g.stroke();
  icon(g); g.restore();
}
const thumb = (g) => { g.fillStyle = '#4a78b8'; rr(g, -40, -20, 30, 60, 8); g.fill(); rr(g, -10, -30, 54, 70, 14); g.fill(); rr(g, 0, -64, 22, 44, 10); g.fill(); };
const heart = (g) => { g.fillStyle = '#e0466a'; g.beginPath(); g.moveTo(0, 40); g.bezierCurveTo(-70, -10, -40, -60, 0, -28); g.bezierCurveTo(40, -60, 70, -10, 0, 40); g.fill(); };

// f01 "From today, you can see"  wide golden mall, gentle drone push in, shoppers stroll; numbers begin to appear
registerShot('f01', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 0.95, z1: 1.02, y0: -60, y1: -20 });
  const { M } = mall(g, t, cam);
  layer(g, cam, 1, (g) => shoppers(g, t, M, { tPop: 0.7, step: 0.18 }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// f02 "exactly how much every person trusts you."  slide along the crowd: every head has its number, they pop in a rolling wave
registerShot('f02', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.06, z1: 1.1, x0: -180, x1: 160 });
  const { M } = mall(g, t, cam, { crowd: true });
  layer(g, cam, 1, (g) => shoppers(g, t + 3, M, { n: 8, tPop: -3 + 0.1, step: 0.1 }));
} });

// f03 "Not how much they like you."  a shopper smiles; a thumbs-up bubble pops above her... and bursts
registerShot('f03', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.15, z1: 1.2, x0: 60, x1: 80, y0: 50, y1: 40 });
  const { M } = mall(g, t, cam);
  const s = V(1.7, 1.7), x = E.W / 2 + 40;
  layer(g, cam, 1, (g) => { drawToon(g, { x, y: mallGround(), s, facing: -1, cast: SHOPPER(0), pose: breathe(POSES.wave, t), expr: 'happy', blink: blink(t), rim: rim(M) });
    bubble(g, x + 230, mallGround() - 330 * s, t, 0.1, 1.05, thumb); });
} });

// f04 "Not how much they love you."  another: a heart bubble pops... and bursts
registerShot('f04', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.15, z1: 1.2, x0: -60, x1: -80, y0: 50, y1: 40 });
  const { M } = mall(g, t, cam);
  const s = V(1.7, 1.7), x = E.W / 2 - 40;
  layer(g, cam, 1, (g) => { drawToon(g, { x, y: mallGround(), s, facing: 1, cast: SHOPPER(3), pose: breathe(POSES.handsOnHead, t), expr: 'joy', blink: blink(t), rim: rim(M) });
    bubble(g, x - 230, mallGround() - 330 * s, t, 0.1, 1.05, heart); });
} });

// f05 "How much they trust you."  same shopper, the bubble gone: a single clean glowing number lands on her head
registerShot('f05', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.2, z1: 1.28, x0: -60, x1: -60, y0: 30, y1: 0 });
  const { M } = mall(g, t, cam);
  const s = V(1.7, 1.7), x = E.W / 2 - 40;
  layer(g, cam, 1, (g) => { drawToon(g, { x, y: mallGround(), s, facing: 1, cast: SHOPPER(3), pose: breathe(POSES.stand, t), expr: 'neutral', blink: blink(t), rim: rim(M) });
    headNum(g, x, mallGround() - 300 * s, '72', t, 0.15, { size: 72 }); if (t > 0.15 && t < 0.9) FX.rings(g, x, mallGround() - 300 * s, t, { color: '#8dffc8', r0: 50, r1: 200, a: 0.5 }); });
} });

// f06 "And by the end of this video, you'll see one number you can never un-see."  dark: you, lit red by one huge blurred number behind you; slow push
registerShot('f06', { draw(g, t, info) {
  g.fillStyle = '#0c0a14'; g.fillRect(0, 0, E.W, E.H);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.12 }).z, pulse = 0.5 + 0.2 * Math.sin(t * 2.5);
  blurLayer(g, 22, (g) => { glow(g, E.W * 0.7, E.H * 0.38, 600, '#ff5a5a', pulse); text(g, '??', E.W * 0.7, E.H * 0.42, { size: 360, color: '#ff8a7a', stroke: 0 }); });
  FX.dust(g, t, { count: 40, color: '#ff9a8a', a: 0.25 });
  bigToonFace(g, E.W * 0.34, E.H * 0.58, V(210, 240) * k, { cast: HERO, expr: 'nervous', look: [0.8, -0.3], blink: blink(t, 3.6), rimColor: '#ff6a5a' });
} });

// f07 "It's lower than you think."  the blurred red number sinks and dims; heartbeat
registerShot('f07', { draw(g, t, info) {
  g.fillStyle = '#0a0810'; g.fillRect(0, 0, E.W, E.H);
  const d = ease.inOut(prog(t, 0.1, info.dur)), [sx, sy] = shake(t, 4 * (1 - d), 8);
  blurLayer(g, 18, (g) => { glow(g, E.W / 2, E.H * (0.4 + 0.2 * d), 700, '#ff3a3a', 0.6 - 0.25 * d); text(g, '??', E.W / 2 + sx, E.H * (0.44 + 0.2 * d) + sy, { size: 420, color: '#ff6a5a', stroke: 0 }); });
  for (let i = 0; i < 6; i++) seg(g, [[E.W / 2 - 300 + i * 120, E.H * 0.2], [E.W / 2 - 300 + i * 120, E.H * 0.2 + 900 * d]], 3, alpha('#ff6a5a', 0.15 * (1 - d)));
} });

// f08 "And it's not who you expect."  three silhouettes (the people in your life) in a row; a red light sweeps across them, hiding which one
registerShot('f08', { draw(g, t, info) {
  g.fillStyle = '#0c0a14'; g.fillRect(0, 0, E.W, E.H);
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.06 });
  layer(g, cam, 1, (g) => { [[MOM, -420], [SAM, 0], [DAD, 420]].forEach(([c, dx], i) => {
    drawToon(g, { x: E.W / 2 + dx, y: E.H * 0.88, s: V(1.8, 1.8), facing: dx < 0 ? 1 : -1, cast: { ...c, skin: '#140f1c', top: '#140f1c', topDark: '#140f1c', legs: '#140f1c', hairColor: '#140f1c', shoes: '#140f1c', collar: '#140f1c' }, pose: breathe(POSES.stand, t + i), expr: 'neutral', rim: { color: '#ff6a5a', dir: [0.6, -0.8], w: 4 }, shadow: false });
    text(g, '?', E.W / 2 + dx, E.H * 0.88 - 560, { size: 90, color: alpha('#ff8a7a', 0.8), stroke: 0 }); }); });
  const sx = lerp(-200, E.W + 200, ease.inOut(prog(t, 0, info.dur)));
  g.save(); g.globalCompositeOperation = 'lighter'; FX.lightCone(g, sx, -40, { angle: Math.PI / 2, spread: 0.35, len: 1300, color: '#ff6a5a', a: 0.18 }); g.restore();
} });

// f09 "Stay with me."  giant face, warm light returns: a small knowing smile, he leans in
registerShot('f09', { draw(g, t, info) {
  blurLayer(g, 14, (g) => mall(g, t, { z: 1.3, x: 200, y: -80 })); veil(g, '#120a10', 0.2);
  const M = mood('golden'), r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.1 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: 'smug', look: [0, 0], blink: blink(t), rimColor: M.rim });
} });
