// V03 Clip 24 "three signals": SEMI-3D = 3D sets (data-center hall, verdict stage) with 2D glass UI panels, 2D cast and stamps on top.
import { E, registerShot, ease, prog, clamp, lerp, text } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { dataCenter3d } from '/engine/sets3d/dataCenter3d.js';
import { verdict3d } from '/engine/sets3d/verdict3d.js';
import { FP } from '/engine/finprops.js';
import { pop, greyed } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initD = (T) => dataCenter3d(T).st, initV = (T) => verdict3d(T).st;
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', blink: blink(t), rim: RIM, talk: o.talk }); return q; };
const lab = (g, x, y, str, t, t0, o = {}) => { const k = pop(t, t0, 0.35); if (k <= 0) return; const fs = o.fs || 40, w = Math.max(240, str.length * fs * 0.62 + 70), cx = clamp(x, w / 2 + 20, E.W - w / 2 - 20), cy = clamp(y, 70, E.H - 70);
  g.save(); g.translate(cx, cy); g.scale(k, k); FP.glass(g, -w / 2, -fs * 0.95, w, fs * 1.9, { r: 22, fill: o.fill || 'rgba(14,20,44,.94)', border: o.border || 'rgba(140,170,255,.5)' }); text(g, str, 0, 3, { size: fs, color: o.col || '#ffffff', stroke: 0 }); g.restore(); };
const RED = { col: '#ff8a7a', fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }, GRN = { col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.55)' }, YEL = { col: '#ffd24a', fill: 'rgba(40,32,10,.95)', border: 'rgba(255,210,74,.55)' };

// s01 "So here are the three signals I'd watch."  three numbered chips pop in over the hall
registerShot('s01', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); cam3(st, t, info.dur, { from: { pos: [-1.2, 1.2, -0.6], look: [0.3, 1.4, -6], fov: 42 }, to: { pos: [-0.5, 1.5, -1.8], look: [0.2, 1.4, -6], fov: 38 } }); },
  overlay(g, t, info, st) { person(g, st, [0.3, 0, -4.4], t, { h: 1.6, expr: 'smile', pose: breathe(posesAt(t, [[0, 'stand'], [0.5, 'point']]), t), talk: t < 1.7 });
    [['1ST', 'SPENDING', 0.3, GRN], ['2ND', 'MARGINS', 1.0, YEL], ['3RD', 'DEBT', 1.7, RED]].forEach(([n, s, t0, c], i) => lab(g, E.W / 2 + (i - 1) * 520, 150, n + '  ' + s, t, t0, { ...c, fs: 44 })); } });

// s02 "One, spending. ... do they raise their plans, or pause?"  the plans bar rises (RAISE) then stalls (PAUSE)
registerShot('s02', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); st.setBars(ease.out(prog(t, 0.2, 1.4)), 0.7 * ease.out(prog(t, 3.8, 4.6))); cam3(st, t, info.dur, { from: { pos: [-0.8, 1.8, -3.0], look: [0, 1.3, -11], fov: 40 }, to: { pos: [0.8, 2.3, -3.6], look: [0.1, 1.6, -11], fov: 40 } }); },
  overlay(g, t, info, st) { const k = pop(t, 1.3, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, 135); g.scale(k, k); FP.glass(g, -450, -62, 900, 124, { r: 30 }); text(g, "BIG TECH: NEXT YEAR'S PLANS", 0, 4, { size: 52, color: '#ffffff', stroke: 0 }); g.restore(); }
    const a = screenOf(st, [-1.5, 1.7, -11]), b = screenOf(st, [1.5, 3.0, -11]); lab(g, a.x, a.y, 'THIS YEAR', t, 0.9, { fs: 32 });
    lab(g, b.x, b.y - 10, 'RAISE?', t, 3.8, { ...GRN, fs: 40 });
    FP.stamp(g, E.W * 0.5, 330, 0.9, 'PAUSE?', '#ff4d5e', prog(t, 5.3, 5.6), { fs: 96, rot: -0.05 });
    person(g, st, [3.8, 0, -8.8], t, { h: 1.5, facing: -1, expr: t > 5.2 ? 'worried' : 'neutral' }); } });

// s03 "Two, margins. Nvidia already expects to keep a little less of each dollar next quarter."
registerShot('s03', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setTilt(0); st.setCoins('L', 4); st.setCoins('R', t < 3.6 ? 8 : 6); st.chain.scale.x = 0.001; cam3(st, t, info.dur, { from: { pos: [1.6, 2.2, 6.2], look: [0.6, 1.6, 0], fov: 38 }, to: { pos: [0.4, 2.0, 4.4], look: [0.4, 1.4, 0.4], fov: 36 } }); },
  overlay(g, t, info, st) { const rp = screenOf(st, [2.3, 3.7, 0.5]), lp = screenOf(st, [-2.3, 3.7, 0.5]);
    lab(g, lp.x, lp.y - 40, 'COSTS', t, 2.0, { ...RED, fs: 34 }); lab(g, rp.x, rp.y - 40, t < 3.6 ? 'EACH DOLLAR KEPT' : 'A LITTLE LESS KEPT', t, 2.4, { ...GRN, fs: 34 });
    const k = pop(t, 0.2, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, 80); g.scale(k, k); FP.glass(g, -300, -58, 600, 116, { r: 28 }); text(g, '2ND  MARGINS', 0, 4, { size: 58, color: '#ffd24a', stroke: 0 }); g.restore(); } } });

// s04 "If that keeps slipping, prices or competition are starting to bite."
registerShot('s04', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setTilt(0.12 * ease.out(prog(t, 1.2, 2.6))); st.setCoins('L', 5); st.setCoins('R', Math.round(lerp(6, 3, prog(t, 0.8, 2.4)))); st.chain.scale.x = 0.001; cam3(st, t, info.dur, { from: { pos: [-0.6, 2.4, 4.6], look: [1.4, 1.5, 0.4], fov: 36 }, to: { pos: [1.2, 2.0, 4.8], look: [2.2, 1.5, 0.4], fov: 34 } }); },
  overlay(g, t, info, st) { const a = 0.12 * ease.out(prog(t, 1.2, 2.6)), rp = screenOf(st, [2.3 * Math.cos(a), 2.7 + 2.3 * Math.sin(a) + 0.6, 0.5]);
    const k = ease.out(prog(t, 0.4, 1.4)); if (k > 0) { g.save(); g.globalAlpha = k; const x = rp.x + 150, y = rp.y - 160 + (1 - k) * -40; g.strokeStyle = '#ff4d5e'; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 210); g.stroke(); g.fillStyle = '#ff4d5e'; g.beginPath(); g.moveTo(x - 60, y + 180); g.lineTo(x + 60, y + 180); g.lineTo(x, y + 270); g.closePath(); g.fill(); g.restore(); }
    lab(g, E.W * 0.28, 300, 'PRICES', t, 2.0, { ...RED, fs: 46 }); lab(g, E.W * 0.28, 420, 'COMPETITION', t, 2.6, { ...RED, fs: 46 });
    person(g, st, [-1.4, 0, 3.0], t, { h: 1.5, expr: t > 2.0 ? 'worried' : 'neutral', cast: greyed(HERO, ease.inOut(prog(t, 1.5, 3.8))) }); } });

// s05 "Three, debt. The more of the buying that's borrowed, the closer this gets to Cisco."  the debt chain grows from Nvidia toward Cisco
registerShot('s05', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setTilt(0.1); st.setCoins('L', 6); st.setCoins('R', 6); st.chain.scale.x = Math.max(0.001, ease.inOut(prog(t, 1.6, 5.2))); cam3(st, t, info.dur, { from: { pos: [3.8, 2.2, 5.6], look: [3.9, 1.7, -1.5], fov: 36 }, to: { pos: [-1.6, 2.0, 5.2], look: [-3.0, 1.6, -1.5], fov: 36 } }); },
  overlay(g, t, info, st) { const n = screenOf(st, [3.9, 2.9, -1.5]), c = screenOf(st, [-3.9, 2.9, -1.5]);
    const k = pop(t, 0.2, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, 80); g.scale(k, k); FP.glass(g, -300, -58, 600, 116, { r: 28 }); text(g, '3RD  DEBT', 0, 4, { size: 58, color: '#ff8a7a', stroke: 0 }); g.restore(); }
    lab(g, n.x, n.y - 10, 'BORROWED BUYING', t, 1.0, { ...RED, fs: 36 }); lab(g, c.x, c.y - 10, 'CISCO', t, 3.8, { ...YEL, fs: 40 });
    const m = pop(t, 3.4, 0.4); if (m > 0) { g.save(); g.translate(E.W / 2, E.H - 120); g.scale(m, m); FP.glass(g, -430, -50, 860, 100, { r: 26, fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }); text(g, 'MORE BORROWED = CLOSER TO CISCO', 0, 4, { size: 44, color: '#ff8a7a', stroke: 0 }); g.restore(); } } });
