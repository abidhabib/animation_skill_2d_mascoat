// V03 Clip 23 "the customers are still paying": 3D data-center hall. Fly down the aisle of server racks, two revenue bars (+110%), a $130B target over a pile of GPU order crates.
import { E, registerShot, ease, prog, clamp, lerp, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { dataCenter3d } from '/engine/sets3d/dataCenter3d.js';
import { FP } from '/engine/finprops.js';
import { pop } from '/engine/finfx.js';

const RIM = { color: '#9fd0ff', dir: [-0.7, -0.7], w: 3.5 };
const initD = (T) => dataCenter3d(T).st;
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'smile', blink: blink(t), rim: RIM, talk: o.talk }); return q; };
const lab = (g, x, y, str, t, t0, o = {}) => { const k = pop(t, t0, 0.35); if (k <= 0) return; const fs = o.fs || 44, w = Math.max(240, str.length * fs * 0.62 + 70), cx = clamp(x, w / 2 + 20, E.W - w / 2 - 20), cy = clamp(y, 70, E.H - 70);
  g.save(); g.translate(cx, cy); g.scale(k, k); FP.glass(g, -w / 2, -fs * 0.95, w, fs * 1.9, { r: 22, fill: o.fill || 'rgba(10,22,44,.94)', border: o.border || 'rgba(120,180,255,.5)' }); text(g, str, 0, 3, { size: fs, color: o.col || '#ffffff', stroke: 0 }); g.restore(); };

// x01 "And right now, the customers are still paying."
registerShot('x01', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); cam3(st, t, info.dur, { e: 'linear', from: { pos: [0.2, 1.5, 4.2], look: [0, 1.4, -4], fov: 40 }, to: { pos: [0.1, 1.5, -0.2], look: [0, 1.4, -8], fov: 40 } }); },
  overlay(g, t, info, st) { const z = lerp(0.2, -3.6, prog(t, 0, info.dur)); person(g, st, [0, 0, z], t, { pose: walkPose(t * 5.0), talk: true });
    lab(g, E.W / 2, 120, 'DATA CENTERS: STILL BUYING', t, 0.4, { fs: 50 }); } });

// x02 "Data-center sales were up one hundred and ten percent last quarter,"
registerShot('x02', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); st.setBars(ease.out(prog(t, 0.1, 0.8)), ease.out(prog(t, 0.9, 2.3))); cam3(st, t, info.dur, { from: { pos: [-0.8, 1.8, -3.0], look: [0, 1.3, -11], fov: 40 }, to: { pos: [0.8, 2.3, -3.4], look: [0.1, 1.6, -11], fov: 40 } }); },
  overlay(g, t, info, st) { const a = screenOf(st, [-1.5, 1.9, -11]), b = screenOf(st, [1.5, 3.3, -11]);
    lab(g, a.x, a.y, 'BEFORE', t, 0.5, { fs: 36, col: '#cfe0ff' }); lab(g, b.x, b.y - 10, '+110%', t, 2.1, { fs: 64, col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.6)' });
    person(g, st, [3.8, 0, -8.8], t, { h: 1.5, facing: -1, pose: breathe(posesAt(t, [[0, 'stand'], [2.0, 'point']]), t) }); } });

// x03 "and Nvidia expects about one hundred and thirty billion dollars in sales next quarter."
registerShot('x03', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); st.setBars(1, 1); st.setCrates(Math.round(18 * ease.out(prog(t, 1.2, 4.0)))); cam3(st, t, info.dur, { from: { pos: [0.8, 2.3, -3.4], look: [0.1, 1.6, -11], fov: 40 }, to: { pos: [0.3, 4.6, -4.6], look: [0, 1.0, -12.6], fov: 42 } }); },
  overlay(g, t, info, st) { const k = pop(t, 0.6, 0.5); if (k > 0) { g.save(); g.translate(E.W / 2, 160); g.scale(k, k); FP.glass(g, -380, -70, 760, 140, { r: 32, fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.6)' }); text(g, '~$130B NEXT QUARTER', 0, 4, { size: 64, color: '#5affb0', stroke: 0 }); g.restore(); } } });

// x04 "So far, the orders are real."
registerShot('x04', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); st.setBars(1, 1); st.setCrates(18); cam3(st, t, info.dur, { from: { pos: [0.3, 4.6, -4.6], look: [0, 1.0, -12.6], fov: 42 }, to: { pos: [0, 2.2, -2.6], look: [0, 1.0, -12.6], fov: 38 } }); },
  overlay(g, t, info, st) { person(g, st, [-1.6, 0, -9.0], t, { h: 1.5, expr: 'smile', pose: breathe(posesAt(t, [[0, 'stand'], [0.9, 'point']]), t) });
    FP.stamp(g, E.W * 0.5, 190, 0.9, 'ORDERS: REAL', '#2fd07a', prog(t, 0.7, 1.0), { fs: 96, rot: -0.05 }); } });
