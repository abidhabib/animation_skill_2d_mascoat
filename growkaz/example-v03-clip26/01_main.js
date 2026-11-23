// V03 Clip 26 call to action: semi-3D sunset road, a SUBSCRIBE button (pressed) and a NEXT VIDEO card slot for the end screen.
import { E, registerShot, ease, prog, clamp, lerp, text, rr } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink } from '/engine/storyfx.js';
import { cam3, pin } from '/engine/three-toon.js';
import { lifeRoad3d } from '/engine/sets3d/lifeRoad3d.js';
import { FP } from '/engine/finprops.js';
import { pop } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initR = (T) => { const r = lifeRoad3d(T); Object.assign(r.st, { ageX: r.ageX, tape: r.tape }); return r.st; };
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'smile', blink: blink(t), rim: RIM, talk: o.talk }); return q; };

// z01 "If this helped you see past the headlines, subscribe."  you wave; the SUBSCRIBE button pops, then gets pressed
registerShot('z01', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.6, 1.5, 5.2], look: [3.2, 1.5, 0], fov: 40 }, to: { pos: [0.8, 1.6, 4.2], look: [3.4, 1.5, 0], fov: 36 } }); },
  overlay(g, t, info, st) { person(g, st, [2.6, 0, 0.6], t, { pose: breathe(posesAt(t, [[0, 'stand'], [0.4, 'point']]), t), talk: true });
    const k = pop(t, 0.6, 0.4), press = prog(t, 1.9, 2.1) * (1 - prog(t, 2.3, 2.6)); if (k > 0) { g.save(); g.translate(E.W * 0.7, 300); const sc = k * (1 - 0.08 * press); g.scale(sc, sc);
      rr(g, -250, -62, 500, 124, 62); g.fillStyle = press > 0.3 ? '#8a1a22' : '#e0262e'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#1b1424'; g.stroke(); text(g, 'SUBSCRIBE', 0, 6, { size: 62, color: '#ffffff', stroke: 0 }); g.restore(); } } });

// z02 "It's free, and it really helps. And watch this one next."  the NEXT VIDEO card slot glows
registerShot('z02', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [0.8, 1.6, 4.2], look: [3.4, 1.5, 0], fov: 36 }, to: { pos: [2.4, 2.0, 5.4], look: [6.0, 1.4, 0], fov: 40 } }); },
  overlay(g, t, info, st) { person(g, st, [2.8, 0, 0.6], t, { pose: breathe(posesAt(t, [[0, 'stand'], [1.6, 'point']]), t), talk: t < 3.2 });
    const k = pop(t, 0.3, 0.4); if (k > 0) { g.save(); g.translate(E.W * 0.74, E.H * 0.42); g.scale(k, k); FP.glass(g, -330, -186, 660, 372, { r: 30, fill: 'rgba(10,16,34,.55)', border: 'rgba(255,255,255,.5)' }); text(g, 'WATCH THIS NEXT', 0, -230, { size: 46, color: '#ffffff', stroke: 0 }); g.restore(); }
    const f = pop(t, 0.5, 0.4); if (f > 0) { g.save(); g.translate(E.W * 0.3, E.H - 120); g.scale(f, f); FP.glass(g, -300, -50, 600, 100, { r: 26 }); text(g, 'FREE. IT REALLY HELPS.', 0, 4, { size: 44, color: '#ffd24a', stroke: 0 }); g.restore(); } } });
