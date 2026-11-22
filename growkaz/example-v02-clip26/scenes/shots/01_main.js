// V02 Clip 26 "the truth" (3D Dad's kitchen + our 2D cast, 2D graph/inserts). Smooth eased cameras.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, linGrad, text, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater, camEase } from '/engine/storyfx.js';
import { cam3, moves, pin } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';

const GOLD = '#ffe28a', RED = '#ff8a7a', GREEN = '#8dffc8', RIM = { color: '#ffc68a', dir: [-0.7, -0.7], w: 3.5 }, RIMR = { color: '#ffc68a', dir: [0.7, -0.7], w: 3.5 };
const W = { i07: [0.36, 1.6, 2.84], i10: [0.38, 1.5, 2.62] };   // word times (local to each shot), filled in after timing
const init = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
function dad(g, st, t, o = {}) { const q = pin(st, st.spots.chairOld, 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: DAD, pose: o.pose || breathe(POSES.sit, t, 0.6), expr: o.expr || 'neutral', talk: o.talk, look: o.look, blink: blink(t, 3.2), rim: RIM }); return q; }
function you(g, st, t, o = {}) { const q = pin(st, st.spots.chairNew, 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: -1, cast: HERO, pose: o.pose || breathe(POSES.sit, t, 0.5), expr: o.expr || 'neutral', talk: o.talk, look: o.look, blink: blink(t, 2.8), rim: RIMR }); return q; }
const NS = (q) => Math.max(34, 46 * q.s);
const num = (g, q, s, t, col) => headNum(g, q.x, q.y - 300 * q.s, s, t, -1, { size: NS(q), color: col });
// a chain of numbers that switch at given local times: [[t, '90'], [t2, '81'] ...]
function chain(g, q, t, start, steps) { let cur = start, prev = start, ts = -1; for (const [tt, v] of steps) if (t >= tt) { prev = cur; cur = v; ts = tt; }
  if (ts < 0) { num(g, q, cur, t, Number(cur) >= 90 ? GOLD : RED); return; } numChange(g, q.x, q.y - 300 * q.s, prev, cur, t, ts, { size: NS(q) }); }
// the "graph" panel: a dark board with a glowing line; fall: 'slow' | 'fast'
function graph(g, t, dur, fall) {
  g.fillStyle = '#140f1c'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H / 2, 900, '#2a2040', 0.6);
  const x0 = E.W * 0.12, x1 = E.W * 0.88, y0 = E.H * 0.25, y1 = E.H * 0.82;
  for (let i = 0; i <= 10; i++) seg(g, [[x0, lerp(y0, y1, i / 10)], [x1, lerp(y0, y1, i / 10)]], 1.5, alpha('#ffffff', 0.06));
  const k = ease.inOut(prog(t, 0.15, dur - 0.2)), N = 120, pts = [];
  for (let i = 0; i <= N * k; i++) { const u = i / N, v = fall === 'slow' ? 1 - 0.55 * u - 0.02 * Math.sin(u * 40) : (u < 0.18 ? 1 - 1.45 * u / 0.18 * 0.18 : 0.74 + 0.0 * u); pts.push([lerp(x0, x1, u), lerp(y1, y0, v)]); }
  if (pts.length > 1) { g.save(); g.shadowColor = fall === 'slow' ? RED : '#ffb070'; g.shadowBlur = 24; seg(g, pts, 8, fall === 'slow' ? RED : '#ffb070'); g.restore(); const p = pts[pts.length - 1]; circle(g, p[0], p[1], 14, '#ffffff'); glow(g, p[0], p[1], 90, fall === 'slow' ? RED : '#ffb070', 0.5); }
  if (fall === 'slow') for (let m = 0; m < 12; m++) { const u = m / 11; if (u <= k) text(g, '·', lerp(x0, x1, u), y1 + 50, { size: 60, color: alpha('#ffffff', 0.4), stroke: 0 }); }   // many months ticking by
}

// i01 "Now you have a choice."  giant face between two lights: cold blue on one side, warm gold on the other
registerShot('i01', { draw(g, t, info) {
  g.fillStyle = '#1a1420'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.08, E.H * 0.5, 900, '#6a8aff', 0.35); glow(g, E.W * 0.92, E.H * 0.5, 900, '#ffc070', 0.35);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: 'thinking', look: [Math.sin(t * 1.5) * 0.8, 0], blink: blink(t), rimColor: '#ffc68a' });
} });
// i02 "Keep lying, and watch it fall slowly."  graph: a long, slow, red slide across many months
registerShot('i02', { draw(g, t, info) { graph(g, t, info.dur, 'slow'); } });
// i03 "Or tell the truth, and watch it fall fast."  graph: one sharp drop... then it flattens
registerShot('i03', { draw(g, t, info) { graph(g, t, info.dur, 'fast'); } });
// i04 "You tell him."  3D: you lean in across the table, the camera eases in behind Dad's shoulder
registerShot('i04', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-2.6, 1.55, 2.4], look: [0.4, 1.2, 0.3], fov: 32 }, to: { pos: [-2.3, 1.55, 2.0], look: [0.4, 1.22, 0.3], fov: 30 } }); },
  overlay(g, t, info, st) { const d = dad(g, st, t, { expr: 'smile' }); num(g, d, '92', t, GOLD); you(g, st, t, { pose: breathe(posesAt(t, [[0, 'sit'], [0.4, 'holdFront']]), t), expr: 'nervous' }); } });
// i05 "I dropped out. Three months ago."  you talk, eyes down; Dad's smile fades as he listens
registerShot('i05', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-1.6, 1.5, 2.5], look: [0.4, 1.25, 0.3], fov: 28 }, to: { pos: [-1.4, 1.5, 2.2], look: [0.4, 1.28, 0.3], fov: 27 } }); },
  overlay(g, t, info, st) { you(g, st, t, { pose: breathe(POSES.holdFront, t), expr: 'sad', look: [0, 0.6], talk: talkAmount(info.globalT, info.shot.start, info.shot.end) }); } });
// i06 "I was scared to tell you."  giant face, tears welling
registerShot('i06', { draw(g, t, info) {
  g.fillStyle = '#2e1c16'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.3, E.H * 0.2, 900, '#ffc070', 0.35);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.07 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: t < info.dur * 0.6 ? 'sad' : 'cry', talk: talkAmount(info.globalT, info.shot.start, info.shot.end), blink: false, rimColor: '#ffc68a' });
} });
// i07 "Ninety. Eighty-one. Seventy-four."  Dad, hurt: his number tumbles 92 -> 90 -> 81 -> 74, slow push
registerShot('i07', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.2, 1.6, 3.2], look: [-1.15, 1.36, 0.3], fov: 31 }, to: { pos: [0.9, 1.6, 2.8], look: [-1.15, 1.4, 0.3], fov: 29 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: t < W.i07[0] ? 'surprised' : t < W.i07[1] ? 'sad' : 'sad', look: [0.3, 0.5] }); chain(g, q, t, '92', [[W.i07[0], '90'], [W.i07[1], '81'], [W.i07[2], '74']]); } });
// i08 [silence] "Then it stops."  wide and still: neither moves; the number holds at 74; only the lamp hums
registerShot('i08', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.4, 1.7, 4.2], look: [-0.4, 1.0, 0.3], fov: 34 }, to: { pos: [-0.4, 1.68, 4.0], look: [-0.4, 1.0, 0.3], fov: 34 }, breathe: 0.004 }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'sad', look: [0.4, 0.6] }); you(g, st, t, { expr: 'sad', look: [-0.2, 0.7] }); num(g, q, '74', t, RED); } });
// i09 DAD: "Thank you for telling me."  Dad looks up, reaches across the table, a small brave smile
registerShot('i09', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.4, 1.55, 3.0], look: [-1.0, 1.3, 0.3], fov: 31 }, to: { pos: [1.1, 1.55, 2.6], look: [-1.0, 1.32, 0.3], fov: 29 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { pose: breathe(posesAt(t, [[0, 'sit'], [0.5, 'reach']]), t), expr: t < 0.4 ? 'sad' : 'smile', look: [0.6, 0], talk: talkAmount(info.globalT, info.shot.start, info.shot.end) }); num(g, q, '74', t, RED); } });
// i10 "Seventy-eight. Eighty-three. Ninety-one."  slow orbit, warmth returns: 74 -> 78 -> 83 -> 91, gold sparkles
registerShot('i10', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.orbit([-0.4, 1.1, 0.3], -0.25, 0.25, 3.6, 1.6)); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'happy', pose: breathe(POSES.reach, t, 0.5) }); you(g, st, t, { expr: t < W.i10[1] ? 'sad' : 'smile', pose: breathe(POSES.reach, t, 0.5) });
    chain(g, q, t, '74', [[W.i10[0], '78'], [W.i10[1], '83'], [W.i10[2], '91']]); if (t > W.i10[2]) for (let i = 0; i < 4; i++) FX.sparkle(g, q.x - 80 + i * 55, q.y - 300 * q.s - 40 + (i % 2) * 30, 14 * Math.abs(Math.sin(t * 4 + i)), GOLD, 0.9); } });
// i11 "The truth hurt him once."  2D close: Dad's hand rests on yours on the table
registerShot('i11', { draw(g, t, info) {
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#5a3a28', '#2e1c14']); g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.1, 900, '#ffd08a', 0.45);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  g.fillStyle = '#a8724a'; g.beginPath(); g.ellipse(E.W / 2, E.H * 0.78, 1200, 320, 0, 0, 7); g.fill();
  const hand = (x, y, rot, skin, sleeve, sc = 1) => { g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.fillStyle = sleeve; rr(g, -520, -70, 360, 140, 60); g.fill();
    g.fillStyle = skin; g.strokeStyle = '#1b1424'; g.lineWidth = 7; rr(g, -200, -80, 230, 160, 70); g.fill(); g.stroke(); for (let i = 0; i < 4; i++) { rr(g, 10, -72 + i * 38, 110, 34, 17); g.fill(); g.stroke(); } g.restore(); };
  hand(E.W * 0.58, E.H * 0.66, Math.PI, HERO.skin, HERO.top);
  const p = ease.inOut(prog(t, 0.1, 0.9)); hand(lerp(E.W * 0.1, E.W * 0.55, p), E.H * 0.635, 0.03, DAD.skin, DAD.top, 1.05);
  g.restore();
} });
// i12 "The lie would have hurt him every single day."  calendar pages tear off one by one, each a small red -1
registerShot('i12', { draw(g, t, info) {
  g.fillStyle = '#1a1420'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.4, 800, '#3a2a4a', 0.6);
  const cx = E.W / 2, cy = E.H * 0.52, n = Math.floor(t / 0.16), ph = (t / 0.16) % 1;
  rr(g, cx - 240, cy - 290, 480, 560, 20); g.fillStyle = '#e8e0d0'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
  rr(g, cx - 240, cy - 290, 480, 110, 20); g.fillStyle = '#c0563a'; g.fill(); for (const d of [-1, 1]) circle(g, cx + d * 130, cy - 290, 14, '#1b1424');
  text(g, String(1 + (n % 30)), cx, cy + 40, { size: 220, color: '#2a2030', stroke: 0 });
  if (n > 0) { g.save(); g.translate(cx + ph * 500, cy - 60 + ph * ph * 700); g.rotate(ph * 2.5); g.globalAlpha = 1 - ph; rr(g, -240, -170, 480, 450, 16); g.fillStyle = '#f4ece0'; g.fill(); g.stroke(); g.restore();
    floater(g, cx + 300, cy - 200, '-1', t, n * 0.16, '#ff5a5a'); }
} });
