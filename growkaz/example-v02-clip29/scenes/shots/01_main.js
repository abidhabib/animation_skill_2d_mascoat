// V02 Clip 29 "one point" - richer 3D (user 2026-11-21: more 3D, full frames, camera a bit faster).
// 3D bedroom (messy -> made bed, desk, mirror with your reflection), 3D sunrise park run. Our 2D cast pinned into 3D.
import { E, V, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater } from '/engine/storyfx.js';
import { cam3, moves, pin, screenOf } from '/engine/three-toon.js';
import { bedroom3d } from '/engine/sets3d/bedroom3d.js';
import { park3d } from '/engine/sets3d/park3d.js';

const RED = '#ff8a7a', GREEN = '#8dffc8', RIM = { color: '#ffd2a0', dir: [0.7, -0.7], w: 3.5 };
const initB = (time, made = 0) => (T) => { const b = bedroom3d(T, { time, made }); Object.assign(b.st, { spots: b.spots, setBed: b.setBed, setPhone: b.setPhone, setClock: b.setClock, mirCorners: b.mirCorners, bottle: b.bottle, mirNormal: b.mirNormal }); return b.st; };
const initP = (T) => { const p = park3d(T, { time: 'sunrise' }); p.st.spots = p.spots; return p.st; };
const me = (g, st, p, t, o = {}) => { const q = pin(st, p, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', look: o.look, blink: o.blink ?? blink(t), rim: RIM, prop: o.prop, alpha: o.alpha, shadow: o.shadow }); return q; };
const numOn = (g, q, s, t, col = GREEN, t0 = -1) => headNum(g, q.x, q.y - 300 * q.s, s, t, t0, { size: Math.max(32, 44 * q.s), color: col });
const chg = (g, q, a, b, t, ts) => numChange(g, q.x, q.y - 300 * q.s, a, b, t, ts, { size: Math.max(32, 44 * q.s) });
// your reflection inside the 3D mirror: mirror the foot point across the glass plane, draw facing the other way, clipped to the glass
function reflection(g, st, P, t, o = {}) {
  const n = st.mirNormal, M = st.spots.mirror, d = (P[0] - M[0]) * n[0] + (P[2] - M[2]) * n[2], R = [P[0] - 2 * d * n[0], 0, P[2] - 2 * d * n[2]];
  const c = st.mirCorners.map(p => screenOf(st, p)); g.save(); g.beginPath(); c.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath(); g.clip();
  g.fillStyle = 'rgba(190,215,230,0.25)'; g.fill();
  const q = me(g, st, R, t, { facing: -(o.facing ?? 1), pose: o.pose, expr: o.expr, look: o.look, alpha: 0.88, shadow: false });
  g.fillStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.moveTo(c[0].x + 20, c[0].y); g.lineTo(c[0].x + 70, c[0].y); g.lineTo(c[3].x + 10, c[3].y); g.lineTo(c[3].x - 40, c[3].y); g.closePath(); g.fill(); g.restore(); if (o.num) o.num(q); return q;
}

// m01 "So you do one tiny thing."  morning, messy room: clothes on the floor, crumpled duvet; camera swoops down from high
registerShot('m01', { kind: '3d', init: initB('morning', 0),
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [2.8, 2.9, 3.6], look: [0.2, 0.6, -1.6], fov: 40 }, to: { pos: [1.6, 1.7, 2.6], look: [-0.2, 0.7, -1.8], fov: 36 } }); },
  overlay(g, t, info, st) { me(g, st, [0.4, 0, -1.05], t, { facing: -1, expr: 'determined' }); } });
// m02 "You make your bed."  the duvet straightens, pillows settle, clothes gone: quick slide along the bed
registerShot('m02', { kind: '3d', init: initB('morning', 0),
  draw(st, t, info) { st.setBed(ease.inOut(prog(t, 0.15, 1.2))); cam3(st, t, info.dur, { from: { pos: [-2.2, 1.7, 2.6], look: [-0.5, 0.7, -2.0], fov: 36 }, to: { pos: [0.6, 1.8, 3.0], look: [-0.3, 0.7, -2.0], fov: 35 } }); },
  overlay(g, t, info, st) { me(g, st, [0.55, 0, -1.25], t, { facing: -1, pose: breathe(posesAt(t, [[0, 'reach'], [0.6, 'holdFront'], [1.2, 'relaxed']]), t), expr: 'smile' }); } });
// m03 "You set the alarm, and this time, you don't snooze it."  dawn: the phone buzzes... you sit straight up, alarm off; camera pulls from the nightstand
registerShot('m03', { kind: '3d', init: initB('dawn', 1),
  draw(st, t, info) { const off = t > 2.34; st.setPhone(off ? 0.25 : 0.8 + 0.2 * Math.sin(t * 18), off ? 0 : Math.sin(t * 60) * 0.006); const p = st.spots.phone;
    cam3(st, t, info.dur, { from: { pos: [p[0] - 0.5, 1.2, p[2] + 1.4], look: p, fov: 30 }, to: { pos: [0.9, 1.5, 2.4], look: [-1.0, 0.8, -1.8], fov: 36 } }); },
  overlay(g, t, info, st) { const up = t > 2.2; me(g, st, st.spots.bedEdge, t, { facing: -1, pose: breathe(posesAt(t, [[0, 'sit'], [2.2, 'reach'], [2.7, 'cheer']]), t), expr: up ? 'determined' : 'tired', prop: t > 2.2 && t < 2.8 ? 'phone' : null }); } });
// m04 "You look back."  you stop at the standing mirror; your reflection looks back at you
registerShot('m04', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [2.9, 1.55, 1.3], look: [0.8, 1.0, -2.2], fov: 36 }, to: { pos: [2.5, 1.5, 0.8], look: [0.85, 1.0, -2.3], fov: 34 } }); },
  overlay(g, t, info, st) { const P = st.spots.mirrorFront; reflection(g, st, P, t, { facing: 1, expr: 'neutral', look: [0.6, -0.2] }); me(g, st, P, t, { facing: 1, expr: 'neutral', look: [0.6, -0.2] }); } });
// m05 "Thirty-two."  in the glass: 31 above your reflection ticks to 32
registerShot('m05', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [2.2, 1.55, 0.4], look: [1.0, 1.2, -2.4], fov: 32 }, to: { pos: [2.1, 1.55, 0.15], look: [1.05, 1.25, -2.45], fov: 31 } }); },
  overlay(g, t, info, st) { const P = st.spots.mirrorFront; reflection(g, st, P, t, { facing: 1, expr: 'surprised', num: (q) => chg(g, q, '31', '32', t, 0.12) }); me(g, st, P, t, { facing: 1, expr: 'surprised' }); } });
// m06 "One point. Slow. But real."  push into the mirror: the small green 32, a +1 drifting up; you smile, a little
registerShot('m06', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [2.1, 1.55, 0.15], look: [1.05, 1.25, -2.45], fov: 31 }, to: { pos: [1.7, 1.5, -0.8], look: [1.2, 1.3, -2.6], fov: 29 } }); },
  overlay(g, t, info, st) { const P = st.spots.mirrorFront; reflection(g, st, P, t, { facing: 1, expr: t < 1.2 ? 'neutral' : 'smile', num: (q) => { numOn(g, q, '32', t); floater(g, q.x + 70, q.y - 300 * q.s, '+1', t, 0.2, '#6dff8a'); } }); } });
// m07 "The next morning, you go for the run you've been promising yourself since January."  3D sunrise park: you run along the path, camera tracks fast alongside
registerShot('m07', { kind: '3d', init: initP,
  draw(st, t, info) { const k = prog(t, 0, info.dur), hx = lerp(-7, 3, k); st._hx = hx; cam3(st, t, info.dur, { from: { pos: [-6.4, 1.3, 4.2], look: [-6.6, 1.0, 0], fov: 36 }, to: { pos: [3.8, 1.5, 3.4], look: [3.4, 1.0, 0], fov: 34 } }); },
  overlay(g, t, info, st) { const q = me(g, st, [st._hx, 0, 0.1], t, { facing: 1, pose: walkPose(t * 9, { run: true }), expr: 'determined' }); numOn(g, q, '32', t); } });
// m08 "Thirty-four."  still running, closer: 32 -> 34 pops, sun flare behind
registerShot('m08', { kind: '3d', init: initP,
  draw(st, t, info) { const hx = lerp(3, 5.2, prog(t, 0, info.dur)); st._hx = hx; cam3(st, t, info.dur, { from: { pos: [hx + 1.6, 1.3, 2.4], look: [hx - 0.2, 1.35, 0], fov: 36 }, to: { pos: [hx + 2.6, 1.45, 2.4], look: [hx + 0.4, 1.4, 0], fov: 35 } }); },
  overlay(g, t, info, st) { const q = me(g, st, [st._hx, 0, 0.1], t, { facing: 1, pose: walkPose(t * 9, { run: true }), expr: 'happy' }); chg(g, q, '32', '34', t, 0.2); FX.lensStreak(g, E.W * 0.3, E.H * 0.35, 900, '#ffe0b0', 0.3, 3); } });
// m09 "You drink the water instead of the third coffee."  at the desk: two empty coffee mugs, you reach past them for the water bottle and drink
registerShot('m09', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { st.bottle.visible = t < 1.3; const d = st.spots.desk; cam3(st, t, info.dur, { from: { pos: [d[0] - 2.2, 1.7, d[2] + 3.8], look: [d[0], 0.95, d[2] + 0.3], fov: 36 }, to: { pos: [d[0] - 1.5, 1.6, d[2] + 3.1], look: [d[0] - 0.1, 1.0, d[2] + 0.3], fov: 34 } }); },
  overlay(g, t, info, st) { const drink = t > 1.3, q = me(g, st, st.spots.deskChair, t, { facing: 1, pose: breathe(posesAt(t, [[0, 'sit'], [0.6, 'reach'], [1.3, 'phone']]), t), expr: drink ? 'happy' : 'thinking' });
    if (drink) { const hx = q.x + 28 * q.s, hy = q.y - 172 * q.s; g.save(); g.translate(hx, hy); g.rotate(-0.5); rr(g, -9 * q.s, -34 * q.s, 18 * q.s, 46 * q.s, 5 * q.s); g.fillStyle = 'rgba(159,216,240,0.9)'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 3; g.stroke(); g.restore(); } } });
// m10 "Thirty-five."  34 -> 35 over your head at the desk, camera eases up
registerShot('m10', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { st.bottle.visible = false; const d = st.spots.desk; cam3(st, t, info.dur, { from: { pos: [d[0] - 1.5, 1.6, d[2] + 3.1], look: [d[0] - 0.1, 1.05, d[2] + 0.3], fov: 34 }, to: { pos: [d[0] - 1.6, 1.9, d[2] + 3.4], look: [d[0] - 0.1, 1.4, d[2] + 0.3], fov: 34 } }); },
  overlay(g, t, info, st) { const q = me(g, st, st.spots.deskChair, t, { facing: 1, pose: breathe(POSES.sit, t), expr: 'smile' }); chg(g, q, '34', '35', t, 0.15); } });
// m11 "It turns out the number in the mirror works exactly like everyone else's."  orbit at the mirror: your 35, and the week's other numbers glow softly around the room
registerShot('m11', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { cam3(st, t, info.dur, moves.orbit([0.7, 1.1, -2.0], 0.15, 0.75, 3.9, 1.6)); },
  overlay(g, t, info, st) { const P = st.spots.mirrorFront; reflection(g, st, P, t, { facing: 1, expr: 'smile', num: (q) => numOn(g, q, '35', t) }); const q = me(g, st, P, t, { facing: 1, expr: 'smile' }); numOn(g, q, '35', t);
    [['99', -2.2, 2.2, -1.5], ['96', 3.0, 2.3, -1.0], ['62', -1.4, 2.5, 0.2], ['53', 2.2, 2.6, 0.4]].forEach(([n, x, y, z], i) => { const s = screenOf(st, [x, y, z]), a = 0.55 * ease.out(prog(t, 0.6 + i * 0.25, 1.2 + i * 0.25)); if (a > 0) { g.save(); g.globalAlpha = a; headNum(g, s.x, s.y + 6 * Math.sin(t * 2 + i), n, t, -1, { size: 40, color: GREEN }); g.restore(); } }); } });
// m12 "Small things. Kept. Every day."  quick dolly through the room past the made bed, the running shoes, the water bottle; pull out wide
registerShot('m12', { kind: '3d', init: initB('morning', 1),
  draw(st, t, info) { cam3(st, t, info.dur, { path: [[-1.4, 1.3, 0.8], [1.2, 1.0, 1.8], [2.6, 0.8, 2.2], [1.0, 2.4, 4.2]], look0: [-0.5, 0.6, -2.2], look1: [2.8, 0.4, -0.2], fov0: 36, fov1: 42, e: 'inOut' }); },
  overlay(g, t, info, st) {} });
