// V02 Clip 27 "after the truth" (3D Dad's kitchen + our 2D cast, 2D inserts). Smooth eased cameras.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, linGrad, text, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { blink, headNum, numChange, camEase } from '/engine/storyfx.js';
import { cam3, moves, pin } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';

const GOLD = '#ffe28a', GREEN = '#8dffc8', RIM = { color: '#ffc68a', dir: [-0.7, -0.7], w: 3.5 }, RIMR = { color: '#ffc68a', dir: [0.7, -0.7], w: 3.5 };
const W = { j08: [0.1, 0.42, 1.86] };
const init = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
function dad(g, st, t, o = {}) { const q = pin(st, st.spots.chairOld, 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: DAD, pose: o.pose || breathe(POSES.sit, t, 0.6), expr: o.expr || 'smile', talk: o.talk, look: o.look, blink: blink(t, 3.2), rim: RIM }); return q; }
function you(g, st, t, o = {}) { const p = o.at || st.spots.chairNew, q = pin(st, p, 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? -1, cast: HERO, pose: o.pose || breathe(POSES.sit, t, 0.5), expr: o.expr || 'neutral', talk: o.talk, look: o.look, blink: blink(t, 2.8), rim: RIMR }); return q; }
const num = (g, q, s, t, col = GREEN, t0 = -1) => headNum(g, q.x, q.y - 300 * q.s, s, t, t0, { size: Math.max(34, 46 * q.s), color: col });
const tableTop = (g) => { g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#4a3020', '#2a1a12']); g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.05, 1000, '#ffd08a', 0.45);
  g.fillStyle = '#a8724a'; g.beginPath(); g.ellipse(E.W / 2, E.H * 0.8, 1250, 360, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke(); };
function mug(g, x, y, s, col, steam, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = '#1b1424'; g.lineWidth = 6;
  g.beginPath(); g.moveTo(-60, -130); g.lineTo(60, -130); g.lineTo(50, 0); g.lineTo(-50, 0); g.closePath(); g.fill(); g.stroke(); g.beginPath(); g.ellipse(70, -70, 26, 36, 0, -1.3, 1.3); g.lineWidth = 12; g.stroke();
  g.fillStyle = '#b87a4a'; g.beginPath(); g.ellipse(0, -130, 58, 12, 0, 0, 7); g.fill();
  if (steam) for (let i = 0; i < 2; i++) { g.strokeStyle = alpha('#ffffff', 0.4); g.lineWidth = 6; g.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -150 - k * 14, xx = (i ? 14 : -14) + Math.sin(t * 3 + k * 0.6 + i) * 10; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  g.restore(); }

// j01 "He doesn't yell."  3D: Dad, calm, a long breath out; no anger at all (91)
registerShot('j01', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.2, 1.6, 3.2], look: [-1.15, 1.36, 0.3], fov: 31 }, to: { pos: [1.0, 1.6, 2.9], look: [-1.15, 1.38, 0.3], fov: 30 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'neutral', look: [0.5, 0.3] }); num(g, q, '91', t); } });
// j02 "He doesn't ask why you waited so long."  3D: slow side slide, Dad's soft little smile
registerShot('j02', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [0.6, 1.6, 3.2], look: [-1.15, 1.34, 0.3], fov: 30 }, to: { pos: [1.5, 1.6, 2.9], look: [-1.0, 1.34, 0.3], fov: 30 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'smile', look: [0.6, 0] }); num(g, q, '91', t); } });
// j03 "He just pushes the sugar bowl toward you and says,"  2D insert: Dad's hand slides the sugar bowl across to you
registerShot('j03', { draw(g, t, info) {
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z; tableTop(g);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  const p = ease.inOut(prog(t, 0.2, 1.6)), bx = lerp(E.W * 0.25, E.W * 0.62, p), by = E.H * 0.72;
  g.fillStyle = '#f4f0e6'; g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.beginPath(); g.moveTo(bx - 110, by - 140); g.lineTo(bx + 110, by - 140); g.quadraticCurveTo(bx + 120, by, bx, by); g.quadraticCurveTo(bx - 120, by, bx - 110, by - 140); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(bx, by - 150, 118, 22, 0, 0, 7); g.fillStyle = '#e8d8c0'; g.fill(); g.stroke(); circle(g, bx, by - 175, 20, '#c0563a');
  g.fillStyle = DAD.top; rr(g, bx - 620, by - 120, 380, 120, 50); g.fill(); g.fillStyle = DAD.skin; g.beginPath(); g.ellipse(bx - 190, by - 60, 90, 60, 0, 0, 7); g.fill(); g.stroke();
  g.restore();
} });
// j04 DAD: "So. What do you actually want to do?"  3D: Dad leans in, curious, really asking
registerShot('j04', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.4, 1.55, 3.0], look: [-1.1, 1.32, 0.3], fov: 30 }, to: { pos: [1.1, 1.55, 2.6], look: [-1.1, 1.34, 0.3], fov: 29 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { pose: breathe(posesAt(t, [[0, 'sit'], [0.3, 'explain']]), t, 0.6), expr: 'happy', look: [0.6, 0], talk: talkAmount(info.globalT, info.shot.start, info.shot.end) }); num(g, q, '91', t); } });
// j05 "And for the first time in months, you tell him."  3D: you talk with your hands, lit up; Dad listening in soft focus
registerShot('j05', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-1.8, 1.55, 2.9], look: [0.4, 1.25, 0.3], fov: 30 }, to: { pos: [-1.4, 1.55, 2.5], look: [0.4, 1.27, 0.3], fov: 29 } }); },
  overlay(g, t, info, st) { you(g, st, t, { pose: breathe(posesAt(t, [[0, 'sit'], [0.4, 'explain'], [1.4, 'talk'], [2.2, 'explain']]), t), expr: 'happy', talk: 0.45 * Math.abs(Math.sin(t * 8)) }); } });
// j06 "The real plan. The scary one."  2D insert: your notebook, full of doodles and arrows, a lightbulb sketch that glows
registerShot('j06', { draw(g, t, info) {
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.1 }).z; tableTop(g);
  g.save(); g.translate(E.W / 2, E.H * 0.52); g.scale(k, k); g.rotate(-0.04);
  for (const d of [-1, 1]) { rr(g, d > 0 ? 0 : -560, -320, 560, 640, 12); g.fillStyle = '#fbf6ea'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke(); for (let i = 0; i < 12; i++) seg(g, [[d > 0 ? 20 : -540, -260 + i * 48], [d > 0 ? 540 : -20, -260 + i * 48]], 2, alpha('#6a8ab8', 0.35)); }
  const ink = '#2a3a6a', dr = (pts, w = 6) => seg(g, pts, w, ink);
  dr([[-480, -200], [-300, -200], [-300, -60], [-480, -60], [-480, -200]]); dr([[-300, -130], [-180, -130], [-200, -150]]); dr([[-180, -130], [-200, -110]]);   // box -> arrow
  for (let i = 0; i < 3; i++) dr([[-480, 40 + i * 70], [-200 + (i % 2) * 60, 40 + i * 70]], 5);
  const lp = ease.outBack(prog(t, 0.4, 0.9));                                                                     // lightbulb doodle
  g.save(); g.translate(270, -40); g.scale(lp, lp); if (t > 0.6) glow(g, 0, 0, 260, GOLD, 0.35 + 0.1 * Math.sin(t * 5));
  g.strokeStyle = ink; g.lineWidth = 8; g.beginPath(); g.arc(0, -20, 90, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(40, 110); g.lineTo(-40, 110); g.closePath(); g.stroke(); dr([[-40, 140], [40, 140]]); dr([[-30, 170], [30, 170]]);
  for (let i = 0; i < 7; i++) { const a = -Math.PI + i * Math.PI / 6; dr([[Math.cos(a) * 130, -20 + Math.sin(a) * 130], [Math.cos(a) * 170, -20 + Math.sin(a) * 170]], 5); } g.restore();
  g.restore();
} });
// j07 "You sit at that old table until midnight."  3D wide crane: you two talking, the evening slowly turns to deep night
registerShot('j07', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.4, 1.8, 4.3], look: [-0.4, 0.95, 0.3], fov: 36 }, to: { pos: [-0.4, 2.4, 3.9], look: [-0.4, 0.85, 0.3], fov: 36 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'laugh', talk: Math.sin(t * 3) > 0 ? 0.3 * Math.abs(Math.sin(t * 9)) : 0 }); you(g, st, t, { expr: 'happy', talk: Math.sin(t * 3) < 0 ? 0.3 * Math.abs(Math.sin(t * 9)) : 0 }); num(g, q, '91', t);
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = alpha('#2a3070', 0.45 * ease.inOut(prog(t, 0, info.dur))); g.fillRect(0, 0, E.W, E.H); g.restore(); } });
// j08 "Two cups of tea. Then three."  2D: table top, cups land one, two... then three
registerShot('j08', { draw(g, t, info) {
  tableTop(g); veil(g, '#1a1840', 0.3);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }).z; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  [[E.W * 0.32, W.j08[0], '#5a8ab8'], [E.W * 0.5, W.j08[1], '#c96f8a'], [E.W * 0.68, W.j08[2], '#e0b05a']].forEach(([x, t0, c]) => { const p = ease.outBack(prog(t, t0, t0 + 0.3)); if (p <= 0) return; mug(g, x, E.H * 0.78 - 40 * (1 - p), 1.4 * p, c, true, t); });
  g.restore();
} });
// j09 "When you finally stand up to leave,"  3D: you get up from the table, Dad stays seated, the room at night
registerShot('j09', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.2, 1.7, 4.0], look: [0.0, 1.05, 0.3], fov: 34 }, to: { pos: [0.2, 1.7, 3.7], look: [0.2, 1.1, 0.3], fov: 33 } }); },
  overlay(g, t, info, st) { const sp = st.spots.chairNew, up = ease.inOut(prog(t, 0.2, 1.2)); dad(g, st, t, { expr: 'smile' });
    you(g, st, t, { at: [sp[0] + 0.3 * up, 0, sp[2] + 0.25 * up], pose: breathe(posesAt(t, [[0, 'sit'], [0.6, 'stand']]), t), expr: 'smile' });
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = alpha('#2a3070', 0.45); g.fillRect(0, 0, E.W, E.H); g.restore(); } });
// j10 "you look up at his head one last time."  3D: over your shoulder down to Dad, the camera tilts up to his head
registerShot('j10', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [0.9, 1.75, 2.0], look: [-1.15, 0.9, 0.3], fov: 32 }, to: { pos: [0.8, 1.8, 2.0], look: [-1.15, 1.45, 0.3], fov: 30 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'smile', look: [0.5, -0.5] });
    g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = alpha('#2a3070', 0.4); g.fillRect(0, 0, E.W, E.H); g.restore(); } });
// j11 "Ninety-six."  close: 91 -> 96, green and warm
registerShot('j11', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [0.9, 1.6, 2.9], look: [-1.15, 1.4, 0.3], fov: 28 }, to: { pos: [0.8, 1.6, 2.7], look: [-1.15, 1.42, 0.3], fov: 27 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'happy' }); numChange(g, q.x, q.y - 300 * q.s, '91', '96', t, 0.24, { size: Math.max(34, 50 * q.s) }); if (t > 0.2 && t < 1) FX.rings(g, q.x, q.y - 300 * q.s, t, { color: GREEN, r0: 40, r1: 180, a: 0.5 }); } });
// j12 "Not one hundred. Not yet."  the 96 glows; above it a faint dotted ghost of "100" fades away
registerShot('j12', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [0.8, 1.6, 2.7], look: [-1.15, 1.45, 0.3], fov: 27 }, to: { pos: [0.75, 1.6, 2.6], look: [-1.15, 1.5, 0.3], fov: 26 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'smile' }); num(g, q, '96', t);
    const a = 0.45 * (1 - ease.inOut(prog(t, 0.6, info.dur))); if (a > 0) { g.save(); g.globalAlpha = a; text(g, '100', q.x + 170 * Math.max(1, q.s), q.y - 300 * q.s - 20, { size: Math.max(34, 50 * q.s), color: 'rgba(0,0,0,0)', stroke: 4, strokeColor: '#ffffff' }); g.restore(); } } });
// j13 "But this time, the number is about the real you."  giant face: your first real, easy smile; warm light
registerShot('j13', { draw(g, t, info) {
  g.fillStyle = '#3a2418'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.3, E.H * 0.25, 900, '#ffc070', 0.5); glow(g, E.W * 0.75, E.H * 0.8, 700, GREEN, 0.12);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.06, z1: 1.0 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: t < 0.6 ? 'smile' : 'happy', blink: blink(t), rimColor: '#ffc68a' });
  FX.dust(g, t, { count: 30, color: GOLD, a: 0.25 });
} });
