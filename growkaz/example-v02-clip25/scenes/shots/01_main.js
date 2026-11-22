// V02 Clip 25 "the lie" (3D Dad's kitchen + our 2D cast). Smooth eased cameras; a dolly-zoom for "the distance".
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, glow, alpha, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater, camEase } from '/engine/storyfx.js';
import { cam3, moves, pin } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';

const GOLD = '#ffe28a', RIM = { color: '#ffc68a', dir: [-0.7, -0.7], w: 3.5 }, RIMR = { color: '#ffc68a', dir: [0.7, -0.7], w: 3.5 };
const TT = window.__C25 || {};
const init = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
const DAD_AT = (st) => st.spots.chairOld, YOU_AT = (st) => st.spots.chairNew;
function dad(g, st, t, o = {}) { const q = pin(st, DAD_AT(st), 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: DAD, pose: o.pose || breathe(POSES.sit, t, 0.6), expr: o.expr || 'smile', talk: o.talk, blink: blink(t, 3.2), rim: RIM }); return q; }
function you(g, st, t, o = {}) { const q = pin(st, YOU_AT(st), 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: -1, cast: HERO, pose: o.pose || breathe(POSES.sit, t, 0.5), expr: o.expr || 'neutral', talk: o.talk, look: o.look, blink: o.blink ?? blink(t, 2.8), rim: RIMR }); return q; }
const numAt = (g, q, s, t, t0 = -1, col = GOLD) => headNum(g, q.x, q.y - 300 * q.s, s, t, t0, { size: Math.max(32, 44 * q.s), color: col });
const nChange = (g, q, a, b, t, ts) => numChange(g, q.x, q.y - 300 * q.s, a, b, t, ts, { size: Math.max(32, 44 * q.s) });

// h01 DAD: "How's university going, kiddo?"  over your shoulder: Dad leans in, warm and proud, 100 glowing
registerShot('h01', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.8, 1.45, 2.5], look: [-1.1, 1.15, 0.3], fov: 34 }, to: { pos: [1.5, 1.45, 2.2], look: [-1.15, 1.17, 0.3], fov: 33 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { pose: breathe(posesAt(t, [[0, 'sit'], [0.4, 'explain']]), t, 0.6), expr: 'happy', talk: talkAmount(info.globalT, info.shot.start, info.shot.end) }); numAt(g, q, '100', t);
    blurLayer(g, 18, (g) => bigToonFace(g, E.W * 0.86, E.H * 1.02, 320, { cast: HERO, expr: 'neutral' })); } });

// h02 [silence]  you: frozen. A long beat, the camera barely creeping in; only the clock ticks
registerShot('h02', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-1.3, 1.35, 2.7], look: [0.4, 1.05, 0.3], fov: 32 }, to: { pos: [-1.15, 1.33, 2.4], look: [0.4, 1.07, 0.3], fov: 30 } }); },
  overlay(g, t, info, st) { you(g, st, t, { expr: 'awkward', look: [0.4, 0.6], blink: false }); } });

// h03 "It's fine, you say."  giant face: the fake smile goes on
registerShot('h03', { draw(g, t, info) {
  g.fillStyle = '#3a2418'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.25, E.H * 0.2, 900, '#ffc070', 0.45); glow(g, E.W * 0.8, E.H * 0.7, 700, '#ff9a5a', 0.25);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.05 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: t < 0.3 ? 'awkward' : 'fake', talk: talkAmount(info.globalT, info.shot.start, info.shot.start + 0.8), blink: blink(t), rimColor: '#ffc68a' });
} });

// h04 "Ninety-eight."  Dad's smile holds, his number slips 100 -> 98
registerShot('h04', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.2, 1.6, 3.2], look: [-1.15, 1.36, 0.3], fov: 31 }, to: { pos: [1.1, 1.6, 3.0], look: [-1.15, 1.38, 0.3], fov: 30 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'smile' }); nChange(g, q, '100', '98', t, 0.5); } });

// h05 "Ninety-six."  closer: 98 -> 96
registerShot('h05', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.0, 1.6, 2.9], look: [-1.15, 1.4, 0.3], fov: 28 }, to: { pos: [0.9, 1.6, 2.7], look: [-1.15, 1.42, 0.3], fov: 27 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'neutral' }); nChange(g, q, '98', '96', t, 0.27); } });

// h06 "Every word, the number falls."  DOLLY ZOOM across the table: the camera pulls back while zooming in, the space between you stretches; 96 -> 95 -> 94
registerShot('h06', { kind: '3d', init,
  draw(st, t, info) { const k = ease.inOut(prog(t, 0, info.dur)), d = lerp(2.4, 5.2, k), fov = 2 * Math.atan(1.25 / d) * 180 / Math.PI;
    st.camera.position.set(-0.4, 1.25, 0.3 + d); st.camera.lookAt(-0.4, 0.95, 0.3); st.camera.fov = fov; st.camera.updateProjectionMatrix(); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'smile' }); you(g, st, t, { expr: 'fake', talk: t < 0.4 ? 0.35 * Math.abs(Math.sin(t * 9)) : 0 });
    const n = t < 0.55 ? '96' : t < 1.75 ? '95' : '94'; numAt(g, q, n, t, -1, '#ff8a7a'); if (t > 0.55) floater(g, q.x + 90, q.y - 300 * q.s, '-1', t, t < 1.75 ? 0.55 : 1.75, '#ff5a5a'); } });

// h07 "Not because he knows."  Dad sips his sweet tea, content, unaware; 93
registerShot('h07', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.orbit([-1.15, 1.1, 0.3], -0.35, -0.1, 3.4, 1.45)); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { pose: breathe(POSES.holdFront, t, 0.6), expr: 'happy' }); numAt(g, q, '93', t, -1, '#ff8a7a'); } });

// h08 "Because he feels the distance."  high crane: the two of you small at opposite sides of the table, warm lamp on him, you in shade
registerShot('h08', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.4, 2.0, 4.4], look: [-0.4, 0.85, 0.3], fov: 36 }, to: { pos: [-0.4, 3.7, 3.7], look: [-0.4, 0.55, 0.2], fov: 38 } }); },
  overlay(g, t, info, st) { const q = dad(g, st, t, { expr: 'neutral' }); you(g, st, t, { expr: 'sad', look: [0, 0.8] }); numAt(g, q, '92', t, -1, '#ff8a7a');
    g.save(); g.globalCompositeOperation = 'multiply'; const gr = g.createLinearGradient(E.W * 0.35, 0, E.W * 0.85, 0); gr.addColorStop(0, 'rgba(40,30,60,0)'); gr.addColorStop(1, 'rgba(40,30,60,0.45)'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); g.restore(); } });
