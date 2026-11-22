// V02 Clip 32 "eleven stops" - the kept promise. 3D train (train3d) + our 2D cast; the stranger's 0 flickers and becomes a green 1.
import { E, V, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SHOPPER, STRANGER } from '/engine/toon2d.js';
import { blink, headNum, numChange, camEase } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { train3d } from '/engine/sets3d/train3d.js';

const RED = '#ff8a7a', GREEN = '#8dffc8';
const ZERO = { ...STRANGER, skin: '#a89a9e', top: '#2a2a33', topDark: '#1a1a22', collar: '#1a1a22', hair: 'short', hairColor: '#1a1a22', legs: '#22222a', shoes: '#22222a' };
const WARM = { ...ZERO, skin: '#c8a894' };   // after the 1: a little colour back in their face
const RIM = { color: '#e8f0ff', dir: [0.6, -0.8], w: 3.2 }, ZRIM = { color: '#ff8a7a', dir: [0, -1], w: 3 }, GRIM = { color: '#8dffc8', dir: [0, -1], w: 3 };
const init = (T) => { const tr = train3d(T); Object.assign(tr.st, { spots: tr.spots, update: tr.update, setLights: tr.setLights }); return tr.st; };
const PASS = [[3, 0], [5, 2], [10, 4], [12, 5], [14, 1]];
const YOU = [-0.75, 0, 1.5], NEXT = [-0.75, 0, 0.4];
const TWO = { pos: [1.15, 1.3, 2.7], look: [-0.75, 1.0, 0.95], fov: 44 };
function people(g, st, t, o = {}) {
  const all = [...st.spots.seatsL.map(p => [p, 1]), ...st.spots.seatsR.map(p => [p, -1])];
  PASS.forEach(([si, ci], k) => { if (o.gone && o.gone > k) return; const [p, f] = all[si] || all[0]; const q = pin(st, p, 1.7); if (q.s < 0.05 || q.s > (o.maxS ?? 9)) return;
    drawToon(g, { x: q.x, y: q.y, s: q.s, facing: f, cast: SHOPPER(ci), pose: breathe(POSES.sit, t + k, 0.5), expr: k % 2 ? 'neutral' : 'tired', blink: blink(t + k, 3 + k * 0.3), rim: RIM }); });
}
const you = (g, st, t, o = {}) => { const q = pin(st, o.at || YOU, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: HERO, pose: o.pose || breathe(POSES.sit, t, 0.5), expr: o.expr || 'neutral', look: o.look, talk: o.talk, blink: o.blink ?? blink(t), rim: RIM }); return q; };
function zero(g, st, t, o = {}) { const q = pin(st, o.at || NEXT, 1.75);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? -1, cast: o.cast || ZERO, pose: o.pose || breathe(POSES.sit, t, 0.4), expr: o.expr || 'tired', look: o.look || [0, 0.4], talk: o.talk, blink: o.blink ?? blink(t + 1.3, 3.6), rim: o.rim || ZRIM });
  q.hy = q.y - (o.standing ? 305 : 262) * q.s; q.ns = Math.max(34, 54 * q.s);
  if (o.num !== false) { glow(g, q.x, q.hy, 200 * q.s + 40, o.col === GREEN ? '#4affa0' : '#ff5a4a', 0.22); headNum(g, q.x, q.hy, o.num || '0', t, -1, { size: q.ns, color: o.col || RED }); }
  return q; }
const talk = (t, a, b) => (t > a && t < b ? 0.35 + 0.45 * Math.abs(Math.sin(t * 15)) : 0);
const bgTrain = (g, t, tint = '#2a3440') => { g.fillStyle = tint; g.fillRect(0, 0, E.W, E.H); for (let i = 0; i < 4; i++) { const x = ((t * 420 + i * 560) % (E.W + 600)) - 300; glow(g, x, E.H * 0.35, 380, '#bcd4e0', 0.12); } };
function routeMap(g, t, lit = 0, o = {}) {
  g.fillStyle = '#dfe4e8'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 12; i++) g.fillRect(0, i * 96, E.W, 2);
  const x0 = 260, x1 = E.W - 260, y = E.H * 0.52; rr(g, x0 - 120, y - 210, x1 - x0 + 240, 420, 36); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#9aa4ae'; g.lineWidth = 6; g.stroke();
  seg(g, [[x0, y], [x1, y]], 22, '#3fa7a0'); if (lit > 0) seg(g, [[x0, y], [lerp(x0, x1, Math.min(lit, 11) / 11), y]], 22, '#2f8a57');
  for (let i = 0; i <= 11; i++) { const x = lerp(x0, x1, i / 11), on = i <= lit, end = i === 11;
    circle(g, x, y, end ? 34 : 22, '#ffffff'); g.strokeStyle = on ? '#2f8a57' : '#1b1424'; g.lineWidth = 8; g.beginPath(); g.arc(x, y, end ? 34 : 22, 0, 7); g.stroke();
    if (on) circle(g, x, y, end ? 20 : 12, '#2f8a57'); if (i === (o.here ?? Math.floor(lit))) glow(g, x, y, end ? 160 : 90, GREEN, 0.5 + 0.3 * Math.sin(t * 8)); }
  text(g, 'CENTRAL', x1, y - 90, { size: 54, color: '#1b1424', stroke: 0 }); return { x0, x1, y };
}
const zoomed = (g, c, fn) => { g.save(); g.translate(E.W / 2 + c.x, E.H / 2 + c.y); g.scale(c.z, c.z); g.translate(-E.W / 2, -E.H / 2); fn(); g.restore(); };

// q01 "Eleven stops."  the route map: a fast glide along all eleven dots to Central
registerShot('q01', { draw(g, t, info) { zoomed(g, camEase(t, info.dur, { z0: 1.5, z1: 1.0, x0: 900, x1: 0 }), () => routeMap(g, t, 0, { here: 0 })); } });
// q02 "You don't touch your phone."  low on the bench: your phone buzzes face-down beside you; you keep looking ahead
registerShot('q02', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 2); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [0.7, 1.1, 3.2], look: [-0.75, 0.85, 1.75], fov: 44 }, to: { pos: [0.55, 1.05, 2.95], look: [-0.75, 0.85, 1.75], fov: 41 } }); },
  overlay(g, t, info, st) { you(g, st, t, { expr: 'determined', look: [1, -0.2] });
    const p = screenOf(st, [-0.72, 0.5, 2.15]), bz = (t % 0.6) < 0.3, sh = bz ? Math.sin(t * 90) * 4 : 0, sc = 1.1;
    g.save(); g.translate(p.x + sh, p.y); g.scale(sc, sc * 0.45); rr(g, -60, -110, 120, 220, 20); g.fillStyle = '#1e1c26'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke(); g.restore();
    if (bz) { glow(g, p.x, p.y, 120, '#8ab8ff', 0.25); for (const d of [-1, 1]) seg(g, [[p.x + d * 90, p.y - 20], [p.x + d * 110, p.y - 40]], 5, '#1b1424'); } } });
// q03 "You don't close your eyes."  giant face: the lids droop... and snap wide open
registerShot('q03', { draw(g, t, info) { bgTrain(g, t, '#283040');
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z, awake = t > 0.6;
  bigToonFace(g, E.W / 2, E.H * 0.56, r, { cast: HERO, expr: awake ? 'determined' : 'tired', blink: !awake && (t % 0.5) > 0.3, look: [0, 0], rimColor: '#bcd4e0', tilt: awake ? 0 : 0.06 * Math.sin(t * 3) }); } });
// q04 "You count every station."  time-lapse two-shot: city racing past, light sweeping; they fall asleep; a stop bar ticks to 10
registerShot('q04', { kind: '3d', init,
  draw(st, t, info) { st.update(t * 9 + 4, 1); st.setLights(0.75 + 0.25 * Math.sin(t * 5)); cam3(st, t, info.dur, { from: { ...TWO, fov: 46 }, to: { pos: [1.05, 1.35, 2.35], look: [-0.75, 1.0, 0.95], fov: 42 } }); },
  overlay(g, t, info, st) { const sleep = t > 0.9;
    zero(g, st, t, { expr: sleep ? 'tired' : 'tired', blink: sleep, pose: breathe(POSES.sit, t, 0.6), look: [0, 0.5] });
    you(g, st, t, { expr: 'determined', look: [0.3, -0.4] });
    const n = Math.min(10, Math.floor(prog(t, 0.1, 1.95) * 10 + 0.0001) + (t > 0.15 ? 1 : 0)), bx = E.W / 2 - 330, by = 70;
    rr(g, bx - 40, by - 34, 740, 68, 34); g.fillStyle = 'rgba(20,24,36,0.7)'; g.fill();
    for (let i = 0; i < 11; i++) circle(g, bx + i * 66, by, i < n ? 16 : 11, i < n ? GREEN : 'rgba(255,255,255,0.35)'); } });
// q05 "Central."  the last dot fills and flashes
registerShot('q05', { draw(g, t, info) { zoomed(g, camEase(t, info.dur, { z0: 1.6, z1: 1.75, x0: -1050, x1: -1150 }), () => routeMap(g, t, 11, { here: 11 })); if (t < 0.25) veil(g, '#ffffff', 0.5 * (1 - t / 0.25)); } });
// q06 "You tap their shoulder."  you lean over and tap; they're asleep against the window
registerShot('q06', { kind: '3d', init,
  draw(st, t, info) { st.update(20); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [1.05, 1.3, 2.4], look: [-0.75, 1.02, 0.95], fov: 40 }, to: { pos: [0.9, 1.28, 2.1], look: [-0.75, 1.05, 0.85], fov: 37 } }); },
  overlay(g, t, info, st) { const q = zero(g, st, t, { blink: true, look: [0, 0.5] }); you(g, st, t, { expr: 'smile', look: [1, 0], pose: breathe(posesAt(t, [[0, 'sit'], [0.45, 'reach'], [1.0, 'reach']]), t, 0.4) });
    if (t > 0.6 && t < 1.1) FX.rings(g, q.x + 20 * q.s, q.y - 175 * q.s, t - 0.6, { r0: 10, r1: 70, color: '#ffffff' }); } });
// q07 '"This is you."'  you say it with a small smile; they wake with a start
registerShot('q07', { kind: '3d', init,
  draw(st, t, info) { st.update(20.5); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [0.9, 1.28, 2.1], look: [-0.75, 1.05, 0.85], fov: 37 }, to: { pos: [0.85, 1.28, 2.0], look: [-0.75, 1.07, 0.85], fov: 35 } }); },
  overlay(g, t, info, st) { zero(g, st, t, { expr: t < 0.25 ? 'tired' : 'surprised', blink: t < 0.25, look: [-0.9, 0] }); you(g, st, t, { expr: 'smile', look: [1, 0], talk: talk(t, 0.0, 0.9) }); } });
// q08 "They look at you for a second, like they're not used to this."  giant face, looking right at you: surprise... softening; warm light creeps in
registerShot('q08', { draw(g, t, info) { bgTrain(g, t * 0.3, '#2a3040'); glow(g, E.W * 0.15, E.H * 0.4, 900, '#ffc070', 0.08 + 0.22 * ease.inOut(prog(t, 0.8, 3.0)));
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.1 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.56, r, { cast: ZERO, expr: t < 1.2 ? 'surprised' : t < 2.3 ? 'confused' : 'neutral', look: [-0.2, 0], blink: blink(t + 0.4, 2.2), rimColor: '#ffc68a' }); } });
// q09 "Above their head, the zero flickers."  close on their head: the red 0 stutters, white, red, white; lights stutter with it
registerShot('q09', { kind: '3d', init,
  draw(st, t, info) { st.update(21); const fl = t > 1.5 && (Math.sin(t * 31) > 0.6 || Math.sin(t * 11.7) > 0.9); st.setLights(fl ? 0.7 : 1); st._fl = fl;
    cam3(st, t, info.dur, { from: { pos: [0.55, 1.35, 1.9], look: [-0.75, 1.25, 0.45], fov: 34 }, to: { pos: [0.2, 1.42, 1.3], look: [-0.75, 1.38, 0.42], fov: 30 } }); },
  overlay(g, t, info, st) { const q = zero(g, st, t, { expr: 'neutral', look: [-0.9, -0.1], num: false }); you(g, st, t, { expr: 'surprised', look: [0.9, -0.6] });
    const on = !(Math.sin(t * (6 + t * 6)) > 0.55), white = st._fl || (t > 2.4 && (t * 10 | 0) % 2 === 0);
    glow(g, q.x, q.hy, 200 * q.s + 60, white ? '#ffffff' : '#ff5a4a', on ? 0.3 : 0.08); g.save(); g.globalAlpha = on ? 1 : 0.35; headNum(g, q.x, q.hy, '0', t, -1, { size: q.ns, color: white ? '#ffffff' : RED }); g.restore(); } });
// q10 "One."  it snaps to a green 1: rings, sparkle, warm light
registerShot('q10', { kind: '3d', init,
  draw(st, t, info) { st.update(22); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [0.45, 1.42, 1.95], look: [-0.75, 1.3, 0.42], fov: 34 }, to: { pos: [0.35, 1.45, 1.75], look: [-0.75, 1.35, 0.42], fov: 32 } }); },
  overlay(g, t, info, st) { const q = zero(g, st, t, { cast: t > 0.1 ? WARM : ZERO, expr: t < 0.4 ? 'surprised' : 'smile', look: [-0.9, -0.4], num: false, rim: t > 0.1 ? GRIM : ZRIM });
    numChange(g, q.x, q.hy, '0', '1', t, 0.08, { size: q.ns, t0: -1 }); if (t > 0.08) { glow(g, q.x, q.hy, 150 * q.s + 60, '#4affa0', 0.3 * (1 - prog(t, 0.1, 1.4)) + 0.12); FX.rings(g, q.x, q.hy, t - 0.08, { color: GREEN, r0: 30, r1: 200, a: 0.5 }); }
    for (let i = 0; i < 6; i++) { const a = i * 1.05 + t, d = 120 + 60 * prog(t, 0.1, 1.2); if (t > 0.1) FX.sparkle(g, q.x + Math.cos(a) * d, q.hy + Math.sin(a) * d * 0.6, 14, GREEN, 0.8 * (1 - prog(t, 0.6, 1.5))); } } });
// q11 "Thanks."  they stand in the aisle, a small real smile, the green 1 above
registerShot('q11', { kind: '3d', init,
  draw(st, t, info) { st.update(22.5); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [1.2, 1.45, 3.1], look: [-0.4, 1.25, 0.8], fov: 52 }, to: { pos: [1.15, 1.45, 2.9], look: [-0.4, 1.28, 0.8], fov: 50 } }); },
  overlay(g, t, info, st) { zero(g, st, t, { at: [0.05, 0, 0.55], standing: true, pose: breathe(POSES.stand, t, 0.4), cast: WARM, rim: GRIM, expr: 'smile', look: [-0.9, 0.1], talk: talk(t, 0.1, 0.55), num: '1', col: GREEN });
    you(g, st, t, { expr: 'smile', look: [0.8, -0.6] }); } });
// q12 "And then they're gone."  slow pull back: the empty seat beside you, a last green sparkle fading where they sat; you smile to yourself
registerShot('q12', { kind: '3d', init,
  draw(st, t, info) { st.update(23 + t); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [1.05, 1.3, 2.4], look: [-0.75, 1.0, 0.95], fov: 42 }, to: { pos: [1.1, 1.7, 3.4], look: [-0.5, 0.9, 0.2], fov: 48 } }); },
  overlay(g, t, info, st) { people(g, st, t, { maxS: 2.6 }); const p = screenOf(st, [-0.75, 1.0, 0.4]), a = 1 - prog(t, 0, 1.6);
    if (a > 0) { glow(g, p.x, p.y, 140, '#4affa0', 0.3 * a); FX.sparkle(g, p.x, p.y - 20, 18, GREEN, a); }
    you(g, st, t, { expr: t < 0.7 ? 'neutral' : 'smile', look: [0.9, 0.2] }); } });
