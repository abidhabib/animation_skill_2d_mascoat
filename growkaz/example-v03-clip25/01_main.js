// V03 Clip 25 "which story are you in?": semi-3D on the road of years (lifeRoad3d): the 2000 you at the RETIRE arch with $10,000 back, the 2026 you at NOW with about $6,000, then HOLD / SELL / BUY MORE signposts and the comment question.
import { E, registerShot, ease, prog, clamp, lerp, text } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink, headNum } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { lifeRoad3d } from '/engine/sets3d/lifeRoad3d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, GOLD, pop, greyed } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initR = (T) => { const r = lifeRoad3d(T); Object.assign(r.st, { ageX: r.ageX, tape: r.tape }); return r.st; };
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', blink: blink(t), rim: RIM, talk: o.talk }); return q; };
const lab = (g, x, y, str, t, t0, o = {}) => { const k = pop(t, t0, 0.35); if (k <= 0) return; const fs = o.fs || 40, w = Math.max(240, str.length * fs * 0.62 + 70), cx = clamp(x, w / 2 + 20, E.W - w / 2 - 20), cy = clamp(y, 70, E.H - 70);
  g.save(); g.translate(cx, cy); g.scale(k, k); FP.glass(g, -w / 2, -fs * 0.95, w, fs * 1.9, { r: 22, fill: o.fill || 'rgba(14,20,44,.94)', border: o.border || 'rgba(140,170,255,.5)' }); text(g, str, 0, 3, { size: fs, color: o.col || '#ffffff', stroke: 0 }); g.restore(); };
const GRN = { col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.55)' }, RED = { col: '#ff8a7a', fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }, YEL = { col: '#ffd24a', fill: 'rgba(40,32,10,.95)', border: 'rgba(255,210,74,.55)' };

// y01 "The two thousand you got your ten thousand dollars back at sixty-five."
registerShot('y01', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [27.0, 1.7, 5.2], look: [31, 1.5, 0], fov: 40 }, to: { pos: [28.6, 1.8, 4.2], look: [31, 1.5, 0], fov: 36 } }); },
  overlay(g, t, info, st) { const q = person(g, st, [st.ageX(65) - 1.2, 0, 0.6], t, { cast: greyed(HERO, 0.9), pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'point']]), t), expr: 'smile', talk: t < 3 });
    headNum(g, q.x, q.y - 300 * q.s, '$10,000', t, 0.8, { size: Math.max(44, 56 * q.s), color: GOLD });
    lab(g, E.W / 2, 110, 'THE 2000 YOU: MONEY BACK AT 65', t, 0.3, { ...GRN, fs: 44 }); } });

// y02 "The twenty twenty-six you is sitting at about six thousand, and nobody can tell you yet which story you're in."
registerShot('y02', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.8, 1.6, 5.6], look: [2.6, 1.5, 0], fov: 40 }, to: { pos: [0.6, 1.8, 4.2], look: [2.8, 1.5, 0], fov: 36 } }); },
  overlay(g, t, info, st) { const q = person(g, st, [2.4, 0, 0.6], t, { expr: t > 2.6 ? 'worried' : 'neutral', talk: t < 5 });
    headNum(g, q.x, q.y - 300 * q.s, '~$6,000', t, 0.2, { size: Math.max(44, 56 * q.s), color: '#ff8a7a' });
    lab(g, E.W / 2, 110, 'THE 2026 YOU', t, 0.2, { ...YEL, fs: 46 });
    lab(g, E.W * 0.72, 300, 'STORY A  ?', t, 2.6, { ...RED, fs: 46 }); lab(g, E.W * 0.72, 430, 'STORY B  ?', t, 3.4, { ...GRN, fs: 46 }); } });

// y03 "So tell me, if you were holding Nvidia today, would you hold, sell, or buy more? And why?"
registerShot('y03', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [2.0, 1.9, 6.0], look: [7, 1.4, 0], fov: 42 }, to: { pos: [6.0, 4.4, 6.6], look: [9.5, 0.8, 0], fov: 50 } }); },
  overlay(g, t, info, st) { person(g, st, [st.ageX(44) - 0.6, 0, 0.7], t, { h: 1.6, expr: 'smile', pose: breathe(posesAt(t, [[0, 'stand'], [1.2, 'handsOnHead']]), t) });
    const y = 300; lab(g, E.W * 0.22, y, 'HOLD', t, 1.6, { ...GRN, fs: 62 }); lab(g, E.W * 0.5, y, 'SELL', t, 2.4, { ...RED, fs: 62 }); lab(g, E.W * 0.78, y, 'BUY MORE', t, 3.1, { ...YEL, fs: 62 });
    const k = pop(t, 4.4, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H - 150); g.scale(k, k); FP.glass(g, -380, -62, 760, 124, { r: 30 }); text(g, 'AND WHY?  TELL ME BELOW', 0, 4, { size: 54, color: '#ffffff', stroke: 0 }); g.restore(); } } });
