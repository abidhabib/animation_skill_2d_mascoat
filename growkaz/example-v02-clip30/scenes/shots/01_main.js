// V02 Clip 30 "the train: zero" - final clip. Rich 3D train car (train3d), our 2D cast pinned in, faster camera, flickering lights.
import { E, V, registerShot, ease, prog, clamp, lerp, shake, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, DAD, SHOPPER, STRANGER } from '/engine/toon2d.js';
import { blink, headNum, camEase } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { train3d } from '/engine/sets3d/train3d.js';

const W = { n07: [1.98, 2.94, 3.98], n10: 0.12 };
const ZERO = { ...STRANGER, skin: '#a89a9e', top: '#2a2a33', topDark: '#1a1a22', collar: '#1a1a22', hair: 'short', hairColor: '#1a1a22', legs: '#22222a', shoes: '#22222a' };
const RIM = { color: '#e8f0ff', dir: [0.6, -0.8], w: 3.2 }, ZRIM = { color: '#ff6a5a', dir: [0, -1], w: 4 };
const init = (T) => { const tr = train3d(T); Object.assign(tr.st, { spots: tr.spots, update: tr.update, setLights: tr.setLights }); return tr.st; };
const PASS = [[3, 0], [5, 2], [10, 4], [12, 5], [14, 1]];   // [seat index, shopper cast]
function people(g, st, t, o = {}) {                         // seated passengers on both sides (+ optional numbers fading out)
  const all = [...st.spots.seatsL.map(p => [p, 1]), ...st.spots.seatsR.map(p => [p, -1])];
  PASS.forEach(([si, ci], k) => { const [p, f] = all[si] || all[0]; const q = pin(st, p, 1.7); if (q.s < 0.05) return;
    drawToon(g, { x: q.x, y: q.y, s: q.s, facing: f, cast: SHOPPER(ci), pose: breathe(POSES.sit, t + k, 0.5), expr: k % 2 ? 'neutral' : 'tired', blink: blink(t + k, 3 + k * 0.3), rim: RIM });
    if (o.numA != null && o.numA > 0) { g.save(); g.globalAlpha = o.numA; headNum(g, q.x, q.y - 300 * q.s * 0.8, String([72, 48, 55, 61, 50][k]), t, -1, { size: Math.max(26, 40 * q.s) }); g.restore(); } });
}
const you = (g, st, t, o = {}) => { const q = pin(st, st.spots.youSeat, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: HERO, pose: o.pose || breathe(POSES.sit, t, 0.5), expr: o.expr || 'neutral', look: o.look, blink: o.blink ?? blink(t), rim: RIM }); return q; };
function zero(g, st, t, z, o = {}) { const q = pin(st, [0, 0, z], 1.75); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: ZERO, pose: o.pose || breathe(POSES.stand, t, 0.4), expr: 'tired', look: [0, 0], blink: false, rim: ZRIM });
  const hy = q.y - 300 * q.s; glow(g, q.x, hy, 260 * q.s + 60, '#ff5a4a', 0.35 + 0.1 * Math.sin(t * 7)); headNum(g, q.x, hy, '0', t, o.t0 ?? -1, { size: Math.max(40, 70 * q.s), color: '#ff8a7a' }); return q; }
const flick = (t, base = 1) => base * (Math.sin(t * 37) > 0.75 || Math.sin(t * 13.3) > 0.92 ? 0.35 : 1);

// n01 "Next morning, the numbers are gone."  morning train: fast glide down the aisle; every passenger's number fades out
registerShot('n01', { kind: '3d', init,
  draw(st, t, info) { st.update(t); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [0.3, 1.55, 2.9], look: [0, 1.1, -8], fov: 40 }, to: { pos: [0.1, 1.5, 0.6], look: [0, 1.05, -9], fov: 38 } }); },
  overlay(g, t, info, st) { people(g, st, t, { numA: 1 - ease.inOut(prog(t, 0.3, info.dur - 0.2)) }); } });
// n02 "All of them."  you look around, surprised: nothing above anyone's head
registerShot('n02', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 3); st.setLights(1); const y = st.spots.youSeat; cam3(st, t, info.dur, { from: { pos: [0.9, 1.35, y[2] - 1.7], look: [y[0], 0.95, y[2]], fov: 36 }, to: { pos: [0.7, 1.35, y[2] - 1.4], look: [y[0], 1.0, y[2]], fov: 34 } }); },
  overlay(g, t, info, st) { people(g, st, t); you(g, st, t, { expr: 'surprised', look: [Math.sin(t * 3) * 0.8, -0.3] }); } });
// n03 "Except one."  the camera snaps its gaze down the aisle: far away, one red glow above a dark figure
registerShot('n03', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 5); st.setLights(flick(t, 0.85)); cam3(st, t, info.dur, { from: { pos: [-0.3, 1.45, 1.6], look: [0.4, 1.1, -4], fov: 40 }, to: { pos: [-0.2, 1.45, 1.4], look: [0, 1.2, -10], fov: 30 }, e: 'out' }); },
  overlay(g, t, info, st) { people(g, st, t); zero(g, st, t, st.spots.farEnd[2], { t0: 0.35 }); } });
// n04 "On the train, a stranger is staring at you."  fast push down the aisle toward the dark figure, staring straight back
registerShot('n04', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 7); st.setLights(flick(t, 0.8)); cam3(st, t, info.dur, { from: { pos: [0, 1.5, 1.2], look: [0, 1.25, -12], fov: 32 }, to: { pos: [0, 1.5, -4.5], look: [0, 1.3, -12], fov: 30 } }); },
  overlay(g, t, info, st) { people(g, st, t); zero(g, st, t, st.spots.farEnd[2]); } });
// n05 "Above their head, zero."  close: the 0 burns red, lights stutter
registerShot('n05', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 9); st.setLights(flick(t * 1.3, 0.7)); const z = st.spots.farEnd[2]; cam3(st, t, info.dur, { from: { pos: [0.3, 1.6, z + 3.2], look: [0, 1.6, z], fov: 30 }, to: { pos: [0.2, 1.7, z + 2.7], look: [0, 1.85, z], fov: 28 } }); },
  overlay(g, t, info, st) { const q = zero(g, st, t, st.spots.farEnd[2]); if (t < 0.5) FX.rings(g, q.x, q.y - 300 * q.s, t, { color: '#ff8a7a', r0: 40, r1: 220, a: 0.5 }); } });
// n06 "And they're walking toward you."  over your shoulder: they walk down the aisle toward you, growing, each step a light flicker
registerShot('n06', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 11); st.setLights(flick(t * 1.6, 0.65)); const y = st.spots.youSeat; cam3(st, t, info.dur, { from: { pos: [y[0] + 0.1, 1.25, y[2] + 1.3], look: [0, 1.2, -6], fov: 36 }, to: { pos: [y[0] + 0.2, 1.2, y[2] + 1.6], look: [0, 1.25, -4], fov: 38 } }); },
  overlay(g, t, info, st) { people(g, st, t); const z = lerp(st.spots.farEnd[2], -2.2, ease.inOut(prog(t, 0, info.dur))); zero(g, st, t, z, { pose: walkPose(t * 4, { stride: 18, arm: 8 }) });
    const y = you(g, st, t, { expr: 'nervous', look: [0.8, -0.2] }); } });
// n07 "Whose number would you check first, your best friend's, your dad's, or your own?"  the train freezes and dims; three glowing portraits pop up, one per name
registerShot('n07', { kind: '3d', init,
  draw(st, t, info) { st.update(13); st.setLights(0.45); cam3(st, t, info.dur, { from: { pos: [0, 1.5, 1.0], look: [0, 1.3, -8], fov: 38 }, to: { pos: [0, 1.5, 0.6], look: [0, 1.3, -8], fov: 37 }, breathe: 0.004 }); },
  overlay(g, t, info, st) { people(g, st, 0); zero(g, st, 0, -3.5); veil(g, '#0c0a18', 0.55);
    [[SAM, W.n07[0], '#8dffc8'], [DAD, W.n07[1], '#ffe28a'], [HERO, W.n07[2], '#ff8a7a']].forEach(([c, t0, col], i) => { const p = ease.outBack(prog(t, t0, t0 + 0.35)); if (p <= 0) return; const x = E.W / 2 + (i - 1) * 520, y = E.H * 0.5;
      g.save(); g.translate(x, y); g.scale(p, p); glow(g, 0, 0, 320, col, 0.35); rr(g, -190, -230, 380, 460, 40); g.fillStyle = 'rgba(20,16,36,0.85)'; g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
      bigToonFace(g, 0, 10, 120, { cast: c, expr: i === 2 ? 'nervous' : 'smile', blink: blink(t + i) }); text(g, '?', 0, -170, { size: 90, color: col, stroke: 0, glow: 16, glowColor: col }); g.restore(); }); } });
// n08 "Tell me in the comments."  three comment bubbles pop in with typing dots
registerShot('n08', { kind: '3d', init,
  draw(st, t, info) { st.update(14); st.setLights(0.45); cam3(st, t, info.dur, { from: { pos: [0, 1.5, 0.6], look: [0, 1.3, -8], fov: 37 }, to: { pos: [0, 1.5, 0.4], look: [0, 1.3, -8], fov: 36 }, breathe: 0.004 }); },
  overlay(g, t, info, st) { people(g, st, 0); zero(g, st, 0, -3.5); veil(g, '#0c0a18', 0.55);
    for (let i = 0; i < 3; i++) { const p = ease.outBack(prog(t, 0.1 + i * 0.25, 0.4 + i * 0.25)); if (p <= 0) continue; const x = E.W * (0.3 + i * 0.2), y = E.H * (0.42 + (i % 2) * 0.12);
      g.save(); g.translate(x, y); g.scale(p, p); rr(g, -150, -70, 300, 140, 40); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke();
      g.beginPath(); g.moveTo(-60, 68); g.lineTo(-100, 120); g.lineTo(-10, 68); g.closePath(); g.fill(); g.stroke(); for (let d = 0; d < 3; d++) circle(g, -50 + d * 50, 0, 16 * (0.7 + 0.3 * Math.abs(Math.sin(t * 6 - d))), '#4a78b8'); g.restore(); } } });
// n09 "Full story continues on my channel."  lights back, wide: the figure has stopped right beside your seat
registerShot('n09', { kind: '3d', init,
  draw(st, t, info) { st.update(15 + t); st.setLights(flick(t, 0.75)); const y = st.spots.youSeat; cam3(st, t, info.dur, { from: { pos: [1.0, 1.6, y[2] + 2.6], look: [-0.3, 1.1, y[2] - 0.8], fov: 38 }, to: { pos: [0.8, 1.6, y[2] + 2.2], look: [-0.3, 1.15, y[2] - 0.8], fov: 36 } }); },
  overlay(g, t, info, st) { people(g, st, t); const y = st.spots.youSeat; you(g, st, t, { expr: 'shocked', look: [0.6, -0.6], blink: false }); zero(g, st, t, y[2] - 0.9, { facing: -1 }); } });
// n10 "Subscribe, so you don't miss what zero means."  push into the burning 0 as the lights die; a small subscribe pill pops at the end
registerShot('n10', { kind: '3d', init,
  draw(st, t, info) { st.update(17 + t * 0.4); st.setLights(Math.max(0.1, flick(t, 0.7) * (1 - prog(t, 0.5, info.dur)))); const y = st.spots.youSeat;
    cam3(st, t, info.dur, { from: { pos: [0.6, 1.7, y[2] + 1.6], look: [0, 1.75, y[2] - 0.9], fov: 34 }, to: { pos: [0.25, 1.85, y[2] + 0.4], look: [0, 2.0, y[2] - 0.9], fov: 30 } }); },
  overlay(g, t, info, st) { const y = st.spots.youSeat; zero(g, st, t, y[2] - 0.9, { facing: -1 }); veil(g, '#000000', 0.45 * prog(t, 0.6, info.dur));
    const p = ease.outBack(prog(t, W.n10, W.n10 + 0.35)); if (p > 0) { g.save(); g.translate(E.W * 0.82, E.H * 0.88); g.scale(p * 0.8, p * 0.8); rr(g, -190, -46, 380, 92, 46); g.fillStyle = '#e04a3a'; g.fill(); g.strokeStyle = '#ffffff'; g.lineWidth = 5; g.stroke();
      text(g, 'SUBSCRIBE', 20, 4, { size: 40, color: '#ffffff', stroke: 0 }); g.fillStyle = '#ffffff'; g.beginPath(); g.arc(-140, -4, 16, Math.PI, 0); g.lineTo(-124, 14); g.lineTo(-156, 14); g.closePath(); g.fill(); circle(g, -140, 20, 5, '#ffffff'); g.restore(); } } });
