// V03 Clip 22 "so, is Nvidia the next Cisco?": 3D verdict stage (CISCO and NVIDIA pedestals, a chain for the shared SEAT, a balance scale for the PRICE, an hourglass for the WAIT).
import { E, registerShot, ease, prog, clamp, lerp, text } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { verdict3d } from '/engine/sets3d/verdict3d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, GOLD, pop, greyed } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initV = (T) => verdict3d(T).st;
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', blink: blink(t), rim: RIM, talk: o.talk }); return q; };
// a glass label that pops at (x,y) screen position
const lab = (g, x, y, str, t, t0, o = {}) => { const k = pop(t, t0, 0.35); if (k <= 0) return; const fs = o.fs || 40, w = Math.max(240, str.length * fs * 0.62 + 70), cx = clamp(x, w / 2 + 20, E.W - w / 2 - 20), cy = clamp(y, 70, E.H - 70);
  g.save(); g.translate(cx, cy); g.scale(k, k); FP.glass(g, -w / 2, -fs * 0.95, w, fs * 1.9, { r: 22, fill: o.fill || 'rgba(14,20,44,.94)', border: o.border || 'rgba(140,170,255,.5)' }); text(g, str, 0, 3, { size: fs, color: o.col || '#ffffff', stroke: 0 }); g.restore(); };

// w01 "So, is Nvidia the next Cisco?"
registerShot('w01', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); cam3(st, t, info.dur, { from: { pos: [-1.6, 2.0, 8.4], look: [0, 1.4, -0.5], fov: 40 }, to: { pos: [0.3, 1.9, 6.2], look: [0, 1.4, -0.5], fov: 36 } }); },
  overlay(g, t, info, st) { person(g, st, [0, 0, 3.4], t, { pose: breathe(posesAt(t, [[0, 'stand'], [0.6, 'point']]), t), expr: 'smile', talk: t < 1.6 });
    lab(g, E.W / 2, 110, 'NVIDIA  =  THE NEXT CISCO?', t, 0.3, { fs: 50 }); } });

// w02 "In its seat, yes. ... debt ... guarantees."
registerShot('w02', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.chain.scale.x = Math.max(0.001, ease.out(prog(t, 0.9, 1.9))); cam3(st, t, info.dur, { from: { pos: [0, 2.3, 7.8], look: [0, 1.4, -1.2], fov: 38 }, to: { pos: [0.8, 1.9, 3.8], look: [1.0, 1.5, -1.5], fov: 34 } }); },
  overlay(g, t, info, st) { person(g, st, [-1.5, 0, 2.6], t, { h: 1.5, expr: 'smile' });
    const c = screenOf(st, [0, 2.3, -1.5]); lab(g, c.x, c.y - 30, 'SAME SEAT:  YES', t, 1.1, { col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.55)', fs: 46 });
    const n = screenOf(st, [3.9, 2.6, -1.5]); lab(g, n.x, n.y, 'MORE AND MORE DEBT', t, 4.6, { col: '#ff9a7a', fill: 'rgba(40,16,14,.95)', border: 'rgba(255,130,100,.55)' });
    lab(g, n.x, n.y + 120, 'ITS OWN GUARANTEES', t, 6.3, { col: '#ffd24a', fill: 'rgba(40,32,10,.95)', border: 'rgba(255,210,74,.55)' }); } });

// w03 "In its price, no. You're not paying one hundred times profit."
registerShot('w03', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); const k = ease.out(prog(t, 0.5, 1.7)); st.setCoins('L', k > 0.1 ? 16 : 6); st.setCoins('R', k > 0.1 ? 4 : 6); st.setTilt(0.3 * k); cam3(st, t, info.dur, { from: { pos: [0, 2.1, 6.8], look: [0, 1.7, 0], fov: 38 }, to: { pos: [0.9, 2.0, 4.6], look: [0, 1.3, 0.3], fov: 36 } }); },
  overlay(g, t, info, st) { const a = 0.3 * ease.out(prog(t, 0.5, 1.7)), lp = screenOf(st, [-2.3 * Math.cos(a), 2.7 - 2.3 * Math.sin(a) + 1.0, 0.5]), rp = screenOf(st, [2.3 * Math.cos(a), 2.7 + 2.3 * Math.sin(a) + 1.0, 0.5]);
    lab(g, lp.x, lp.y - 60, 'CISCO: ~100x PROFIT', t, 1.4, { col: '#ff8a7a', fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)', fs: 36 });
    lab(g, rp.x, rp.y - 60, 'NVIDIA: NOT 100x', t, 2.6, { col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.55)', fs: 36 });
    FP.stamp(g, E.W * 0.5, 190, 0.9, 'NO', '#ff4d5e', prog(t, 1.2, 1.5), { fs: 110, rot: -0.07 }); } });

// w04 the twist: Cisco waited because of PRICE (hourglass), Nvidia would wait because the CUSTOMERS couldn't pay (coins drain)
registerShot('w04', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setTilt(0.3); st.setCoins('L', 16); const n = Math.round(lerp(4, 0, prog(t, 4.4, 7.0))); st.setCoins('R', n); st.hg.scale.setScalar(Math.max(0.001, ease.out(prog(t, 0.8, 1.5)))); st.setSand(prog(t, 1.4, 3.8));
    cam3(st, t, info.dur, { from: { pos: [-1.2, 2.3, 5.8], look: [-3.6, 2.0, -1.0], fov: 36 }, to: { pos: [1.6, 2.1, 4.8], look: [3.4, 1.7, -0.5], fov: 36 } }); },
  overlay(g, t, info, st) { const h = screenOf(st, [-3.9, 3.9, -1.5]); lab(g, h.x, h.y, 'CISCO WAITED: PRICE TOO HIGH', t, 1.4, { col: '#ff8a7a', fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)', fs: 36 });
    const r = screenOf(st, [2.3 * Math.cos(0.3), 2.7 + 2.3 * Math.sin(0.3) + 1.1, 0.5]); lab(g, r.x, Math.max(r.y - 20, 190), "NVIDIA WAITS: CUSTOMERS CAN'T PAY", t, 3.9, { col: '#ffd24a', fill: 'rgba(40,32,10,.95)', border: 'rgba(255,210,74,.55)', fs: 36 });
    if (t > 5.2) person(g, st, [1.2, 0, 2.6], t, { h: 1.5, cast: greyed(HERO, ease.inOut(prog(t, 5.2, 7.5))), pose: breathe(posesAt(t, [[5.2, 'stand'], [6.0, 'handsOnHead']]), t), expr: 'worried' }); } });
