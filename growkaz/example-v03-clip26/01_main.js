// V03 Clip 26 outro (30 s): subscribe line, then a calm music-only recap in semi-3D (verdict stage + road of years) that ends on the comment question.
import { E, registerShot, ease, prog, clamp, lerp, text, rr } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { lifeRoad3d } from '/engine/sets3d/lifeRoad3d.js';
import { verdict3d } from '/engine/sets3d/verdict3d.js';
import { FP } from '/engine/finprops.js';
import { pop, greyed } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initR = (T) => { const r = lifeRoad3d(T); Object.assign(r.st, { ageX: r.ageX, tape: r.tape }); return r.st; };
const initV = (T) => verdict3d(T).st;
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'smile', blink: blink(t), rim: RIM, talk: o.talk }); return q; };
const lab = (g, x, y, str, t, t0, o = {}) => { const k = pop(t, t0, 0.4); if (k <= 0) return; const fs = o.fs || 46, w = Math.max(260, str.length * fs * 0.62 + 80), cx = clamp(x, w / 2 + 20, E.W - w / 2 - 20), cy = clamp(y, 70, E.H - 70);
  g.save(); g.translate(cx, cy); g.scale(k, k); FP.glass(g, -w / 2, -fs * 0.95, w, fs * 1.9, { r: 24, fill: o.fill || 'rgba(14,20,44,.94)', border: o.border || 'rgba(140,170,255,.5)' }); text(g, str, 0, 3, { size: fs, color: o.col || '#ffffff', stroke: 0 }); g.restore(); };
const GRN = { col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.55)' }, RED = { col: '#ff8a7a', fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }, YEL = { col: '#ffd24a', fill: 'rgba(40,32,10,.95)', border: 'rgba(255,210,74,.55)' };

// z01 "If this helped you see past the headlines, subscribe. It's free, and it really helps."
registerShot('z01', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.6, 1.5, 5.2], look: [3.2, 1.5, 0], fov: 40 }, to: { pos: [0.8, 1.6, 4.2], look: [3.4, 1.5, 0], fov: 36 } }); },
  overlay(g, t, info, st) { person(g, st, [2.6, 0, 0.6], t, { pose: breathe(posesAt(t, [[0, 'stand'], [0.4, 'point']]), t), talk: t < 4.6 });
    const k = pop(t, 0.6, 0.4), press = prog(t, 2.2, 2.4) * (1 - prog(t, 2.6, 2.9)); if (k > 0) { g.save(); g.translate(E.W * 0.7, 300); const sc = k * (1 - 0.08 * press); g.scale(sc, sc);
      rr(g, -250, -62, 500, 124, 62); g.fillStyle = press > 0.3 ? '#8a1a22' : '#e0262e'; g.fill(); g.lineWidth = 6; g.strokeStyle = '#1b1424'; g.stroke(); text(g, 'SUBSCRIBE', 0, 6, { size: 62, color: '#ffffff', stroke: 0 }); g.restore(); }
    lab(g, E.W * 0.3, E.H - 130, 'FREE. IT REALLY HELPS.', t, 3.0, { ...YEL, fs: 44 }); } });

// z02 recap: the verdict stage, slow orbit; three lines appear one by one
registerShot('z02', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('L', 10); st.setCoins('R', 8); st.setTilt(0.08); st.chain.scale.x = Math.max(0.001, ease.out(prog(t, 0.6, 2.0))); cam3(st, t, info.dur, { from: { pos: [-3.5, 2.4, 8.6], look: [0, 1.5, -0.8], fov: 38 }, to: { pos: [3.5, 2.2, 7.6], look: [0, 1.5, -0.8], fov: 38 } }); },
  overlay(g, t, info, st) { lab(g, E.W / 2, 110, 'THE SHORT VERSION', t, 0.2, { fs: 50 });
    lab(g, E.W / 2, E.H - 330, 'SAME SEAT: THE BIG BUILD-OUT SUPPLIER', t, 0.8, { ...GRN, fs: 42 });
    lab(g, E.W / 2, E.H - 230, "NOT THE SAME PRICE: NOT 100x PROFIT", t, 3.4, { ...YEL, fs: 42 });
    lab(g, E.W / 2, E.H - 130, 'WATCH: SPENDING  ·  MARGINS  ·  DEBT', t, 6.0, { ...RED, fs: 42 }); } });

// z03 calm walk along the road of years
registerShot('z03', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { e: 'linear', from: { pos: [8.0, 1.6, 4.8], look: [11.4, 1.4, 0], fov: 38 }, to: { pos: [17.0, 1.7, 4.8], look: [20.4, 1.4, 0], fov: 38 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0, info.dur), hx = lerp(10.6, 19.6, k); person(g, st, [hx, 0, 0.6], t, { cast: greyed(HERO, 0.55), pose: walkPose(t * 3.6), expr: 'neutral' });
    lab(g, E.W / 2, 120, 'THE CRASH IS THE HEADLINE', t, 0.6, { fs: 50 }); lab(g, E.W / 2, 240, 'THE WAITING IS THE DAMAGE', t, 3.4, { ...RED, fs: 50 }); } });

// z04 the closing question
registerShot('z04', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('L', 8); st.setCoins('R', 8); st.setTilt(0); st.chain.scale.x = 0.001; cam3(st, t, info.dur, { from: { pos: [0.4, 2.0, 5.2], look: [0.4, 1.5, -0.5], fov: 36 }, to: { pos: [0, 2.6, 9.4], look: [0, 1.5, -0.5], fov: 38 } }); },
  overlay(g, t, info, st) { lab(g, E.W / 2, 120, 'IF YOU HELD NVIDIA TODAY?', t, 0.4, { fs: 56 });
    lab(g, E.W * 0.22, 330, 'HOLD', t, 0.9, { ...GRN, fs: 64 }); lab(g, E.W * 0.5, 330, 'SELL', t, 1.9, { ...RED, fs: 64 }); lab(g, E.W * 0.78, 330, 'BUY MORE', t, 2.9, { ...YEL, fs: 64 });
    lab(g, E.W / 2, E.H - 150, 'AND WHY?  TELL ME BELOW', t, 4.4, { fs: 54 }); } });
