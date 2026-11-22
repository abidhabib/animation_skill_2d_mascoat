// V02 Clip 31 "what zero means" - the ending begins. Rich 3D train car (train3d) + our 2D cast; the zero stranger sits beside you.
import { E, V, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SHOPPER, STRANGER } from '/engine/toon2d.js';
import { blink, headNum, numChange, camEase, handPhone } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { train3d } from '/engine/sets3d/train3d.js';

const RED = '#ff8a7a', GREEN = '#8dffc8';
const ZERO = { ...STRANGER, skin: '#a89a9e', top: '#2a2a33', topDark: '#1a1a22', collar: '#1a1a22', hair: 'short', hairColor: '#1a1a22', legs: '#22222a', shoes: '#22222a' };
const RIM = { color: '#e8f0ff', dir: [0.6, -0.8], w: 3.2 }, ZRIM = { color: '#ff8a7a', dir: [0, -1], w: 3 };
const init = (T) => { const tr = train3d(T); Object.assign(tr.st, { spots: tr.spots, update: tr.update, setLights: tr.setLights }); return tr.st; };
const PASS = [[3, 0], [5, 2], [10, 4], [12, 5], [14, 1]];   // [seat index, shopper cast]
const YOU = [-0.75, 0, 1.5], NEXT = [-0.75, 0, 0.4];
const TWO = { pos: [1.15, 1.3, 2.7], look: [-0.75, 1.0, 0.95], fov: 44 };   // side-on two-shot across the aisle: you left, stranger right
function people(g, st, t, o = {}) {
  const all = [...st.spots.seatsL.map(p => [p, 1]), ...st.spots.seatsR.map(p => [p, -1])];
  PASS.forEach(([si, ci], k) => { const [p, f] = all[si] || all[0]; const q = pin(st, p, 1.7); if (q.s < 0.05 || q.s > (o.maxS ?? 9)) return;
    drawToon(g, { x: q.x, y: q.y, s: q.s, facing: f, cast: SHOPPER(ci), pose: breathe(POSES.sit, t + k, 0.5), expr: k % 2 ? 'neutral' : 'tired', blink: blink(t + k, 3 + k * 0.3), rim: RIM });
    if (o.zeros) { const t0 = o.zeros[k]; if (t0 != null) headNum(g, q.x, q.y - 240 * q.s, '0', t, t0, { size: Math.max(26, 44 * q.s), color: RED }); } });
}
const you = (g, st, t, o = {}) => { const q = pin(st, o.at || YOU, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: HERO, pose: o.pose || breathe(POSES.sit, t, 0.5), expr: o.expr || 'neutral', look: o.look, talk: o.talk, blink: o.blink ?? blink(t), rim: RIM }); return q; };
function zero(g, st, t, o = {}) { const q = pin(st, o.at || NEXT, 1.75);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? -1, cast: ZERO, pose: o.pose || breathe(POSES.sit, t, 0.4), expr: o.expr || 'tired', look: o.look || [0, 0.4], talk: o.talk, blink: o.blink ?? blink(t + 1.3, 3.6), rim: ZRIM });
  if (o.num !== false) { const hy = q.y - (o.standing ? 300 : 240) * q.s; glow(g, q.x, hy, 200 * q.s + 40, '#ff5a4a', o.glowA ?? 0.22); headNum(g, q.x, hy, '0', t, -1, { size: Math.max(34, 54 * q.s), color: o.col || RED }); }
  return q; }
const talk = (t, a, b) => (t > a && t < b ? 0.35 + 0.45 * Math.abs(Math.sin(t * 15)) : 0);
const bgTrain = (g, t, tint = '#2a3440') => { g.fillStyle = tint; g.fillRect(0, 0, E.W, E.H); for (let i = 0; i < 4; i++) { const x = ((t * 420 + i * 560) % (E.W + 600)) - 300; glow(g, x, E.H * 0.35, 380, '#bcd4e0', 0.12); } };

// p01 "They sit down right next to you."  side-on two-shot: the stranger steps out of the aisle and drops into the seat beside you; you freeze
registerShot('p01', { kind: '3d', init,
  draw(st, t, info) { st.update(t); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [1.25, 1.4, 3.1], look: [-0.7, 1.0, 0.8], fov: 48 }, to: { ...TWO, fov: 45 } }); },
  overlay(g, t, info, st) { const k = ease.inOut(prog(t, 0, 0.75)); const at = [lerp(0.15, NEXT[0], k), 0, lerp(0.1, NEXT[2], k)];
    zero(g, st, t, { at, pose: breathe(posesAt(t, [[0, 'stand'], [0.55, 'sit']]), t, 0.4), standing: t < 0.55, facing: 1, look: [0, 0.3] });
    you(g, st, t, { expr: t < 0.6 ? 'surprised' : 'nervous', look: [0.9, 0], blink: false }); } });
// p02 "Up close, they don't look dangerous."  slow push past you onto the stranger: slumped, eyes on the floor
registerShot('p02', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 2); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [0.9, 1.3, 2.2], look: [-0.75, 1.05, 0.4], fov: 38 }, to: { pos: [0.6, 1.3, 1.65], look: [-0.75, 1.1, 0.4], fov: 34 } }); },
  overlay(g, t, info, st) { zero(g, st, t, { expr: 'tired', look: [-0.2, 0.7] }); you(g, st, t, { expr: 'worried', look: [0.9, 0.1] }); } });
// p03 "They look tired."  giant face: heavy lids, grey skin, a slow blink, window light sliding past
registerShot('p03', { draw(g, t, info) { bgTrain(g, t); glow(g, E.W / 2, E.H * 0.2, 500, '#ff5a4a', 0.12);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.07 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.56, r, { cast: ZERO, expr: 'tired', look: [-0.3, 0.6], blink: (t % 1.4) > 1.2, rimColor: '#ff8a7a' }); } });
// p04 "Zero doesn't mean they hate you."  over your shoulder: a little angry face pops beside their 0... and gets crossed out
registerShot('p04', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 4); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [0.7, 1.35, 2.95], look: [-0.75, 1.2, 0.4], fov: 38 }, to: { pos: [0.55, 1.35, 2.65], look: [-0.75, 1.22, 0.4], fov: 36 } }); },
  overlay(g, t, info, st) { const q = zero(g, st, t, { expr: 'tired', look: [0.2, 0.6] }); you(g, st, t, { expr: 'worried', look: [-0.6, -0.1] });
    const p = ease.outBack(prog(t, 0.2, 0.55)), fade = 1 - prog(t, 1.5, 1.9); if (p <= 0 || fade <= 0) return;
    const x = q.x + 230 * q.s + 120, y = q.y - 260 * q.s; g.save(); g.globalAlpha = fade; g.translate(x, y); g.scale(p, p);
    circle(g, 0, 0, 92, 'rgba(20,16,36,0.85)'); bigToonFace(g, 0, 18, 56, { cast: ZERO, expr: 'angry' });
    const x1 = ease.out(prog(t, 0.95, 1.15)), x2 = ease.out(prog(t, 1.1, 1.3)); if (x1 > 0) seg(g, [[-70, -70], [-70 + 140 * x1, -70 + 140 * x1]], 16, '#ff4a3a'); if (x2 > 0) seg(g, [[70, -70], [70 - 140 * x2, -70 + 140 * x2]], 16, '#ff4a3a'); g.restore(); } });
// p05 "Zero means they've stopped trusting everyone."  fast pull back down the aisle: the stranger small, arms in, everyone around them far away
registerShot('p05', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 6); st.setLights(0.9); cam3(st, t, info.dur, { from: { pos: [0.3, 1.45, -0.9], look: [-0.75, 1.0, 0.45], fov: 36 }, to: { pos: [0.1, 2.0, -3.6], look: [-0.6, 0.85, 0.7], fov: 42 } }); },
  overlay(g, t, info, st) { people(g, st, t, { maxS: 2.6 }); you(g, st, t, { expr: 'neutral', look: [0.4, 0.2] }); zero(g, st, t, { expr: 'sad', look: [0, 0.8], facing: 1 }); } });
// p06 "People let them down so many times,"  memory, dusk-sepia: three people turn and walk away one by one; their number drops 60 > 40 > 20 > 0
registerShot('p06', { draw(g, t, info) {
  g.fillStyle = '#2a2230'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.85, 900, '#c08a6a', 0.25); FX.dust(g, t, { color: '#e8c8a8' });
  const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }); g.save(); g.translate(E.W / 2, E.H / 2); g.scale(c.z, c.z); g.translate(-E.W / 2, -E.H / 2);
  const gy = E.H * 0.9, s = 2.0;
  [[-560, 0], [560, 2], [-300, 4]].forEach(([dx, ci], i) => { const tl = 0.3 + i * 0.6, k = prog(t, tl, tl + 0.9); const dir = dx < 0 ? -1 : 1;
    drawToon(g, { x: E.W / 2 + dx + dir * 420 * ease.in(k), y: gy - (i === 2 ? 40 : 0), s: s * 0.85, facing: k > 0 ? dir : -dir, cast: SHOPPER(ci), pose: k > 0 ? walkPose(t * 6, { stride: 16 }) : breathe(POSES.talk, t + i), expr: k > 0 ? 'neutral' : 'smile', alpha: 0.75 * (1 - k), rim: { color: '#ffc8a0' } }); });
  drawToon(g, { x: E.W / 2, y: gy, s, facing: 1, cast: ZERO, pose: breathe(t > 1.5 ? POSES.sad : POSES.stand, t), expr: t < 0.3 ? 'neutral' : t < 1.5 ? 'sad' : 'tired', blink: blink(t), rim: ZRIM });
  const hy = gy - 300 * s, seq = ['60', '40', '20', '0'], i = t < 0.3 ? 0 : t < 0.9 ? 1 : t < 1.5 ? 2 : 3;
  if (i === 0) headNum(g, E.W / 2, hy, '60', t, -1, { size: 70, color: GREEN }); else numChange(g, E.W / 2, hy, seq[i - 1], seq[i], t, [0.3, 0.9, 1.5][i - 1], { size: 70, t0: -1 });
  g.restore(); veil(g, '#1a1020', 0.15); } });
// p07 "the whole world reads zero."  their point of view down the aisle: a red 0 pops above every single passenger
registerShot('p07', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 8); st.setLights(0.85); cam3(st, t, info.dur, { from: { pos: [-0.45, 1.15, 0.2], look: [0.35, 1.0, -8], fov: 44 }, to: { pos: [-0.4, 1.2, -0.3], look: [0.3, 1.05, -8], fov: 40 } }); },
  overlay(g, t, info, st) { people(g, st, t, { zeros: [0.3, 0.6, 0.9, 1.2, 1.5], maxS: 3 }); veil(g, '#3a0a10', 0.18 * prog(t, 1.6, 2.2)); } });
// p08 "Sorry. Can you tell me when we reach Central?"  two-shot: they turn to you and speak, quiet and awkward
registerShot('p08', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 10); st.setLights(1); cam3(st, t, info.dur, { from: { ...TWO, fov: 44 }, to: { pos: [1.0, 1.28, 2.4], look: [-0.75, 1.02, 0.95], fov: 42 } }); },
  overlay(g, t, info, st) { zero(g, st, t, { expr: t < 0.9 ? 'awkward' : 'tired', look: [-0.9, 0], talk: talk(t, 0.05, 0.7) || talk(t, 0.95, 2.6) }); you(g, st, t, { expr: 'surprised', look: [0.9, 0] }); } });
// p09 "My phone's dead."  their phone in grey hands: black screen, an empty red battery blinking
registerShot('p09', { draw(g, t, info) { bgTrain(g, t, '#262c36');
  const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08 });
  handPhone(g, E.W / 2, E.H * 0.58, 0.95 * c.z, (g2, x, y, w, h) => { const on = (t % 0.6) < 0.36; g2.save(); g2.translate(x + w / 2, y + h / 2);
    rr(g2, -70, -36, 130, 72, 12); g2.strokeStyle = on ? '#ff4a3a' : '#5a2a2a'; g2.lineWidth = 8; g2.stroke(); rr(g2, 64, -14, 14, 28, 4); g2.fillStyle = on ? '#ff4a3a' : '#5a2a2a'; g2.fill();
    if (on) { rr(g2, -60, -26, 14, 52, 4); g2.fillStyle = '#ff4a3a'; g2.fill(); } g2.restore(); }, { skin: ZERO.skin, sleeve: ZERO.top, glowColor: (t % 0.6) < 0.36 ? '#ff4a3a' : null }); } });
// p10 "It's the smallest promise you could ever make."  the route map above the window: you are here... eleven stops... Central
function routeMap(g, t, lit = 0, o = {}) {
  g.fillStyle = '#dfe4e8'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 12; i++) g.fillRect(0, i * 96, E.W, 2);
  const x0 = 260, x1 = E.W - 260, y = E.H * 0.52; rr(g, x0 - 120, y - 210, x1 - x0 + 240, 420, 36); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#9aa4ae'; g.lineWidth = 6; g.stroke();
  seg(g, [[x0, y], [x1, y]], 22, '#3fa7a0');
  for (let i = 0; i <= 11; i++) { const x = lerp(x0, x1, i / 11), on = i <= lit, end = i === 11;
    circle(g, x, y, end ? 34 : 22, '#ffffff'); g.strokeStyle = on ? '#2f8a57' : '#1b1424'; g.lineWidth = 8; g.beginPath(); g.arc(x, y, end ? 34 : 22, 0, 7); g.stroke();
    if (on) circle(g, x, y, end ? 20 : 12, '#2f8a57'); if (i === (o.here ?? lit)) glow(g, x, y, 90, GREEN, 0.5 + 0.3 * Math.sin(t * 8)); }
  text(g, 'CENTRAL', x1, y - 90, { size: 54, color: '#1b1424', stroke: 0 });
}
registerShot('p10', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.25, z1: 1.12, x0: 520, x1: -380 });
  g.save(); g.translate(E.W / 2 + c.x, E.H / 2); g.scale(c.z, c.z); g.translate(-E.W / 2, -E.H / 2); routeMap(g, t, 0, { here: 0 }); g.restore(); veil(g, '#0a1020', 0.06); } });
// p11 '"Sure," you say.'  two-shot: you nod and smile; for a breath, their 0 dims to a softer glow
registerShot('p11', { kind: '3d', init,
  draw(st, t, info) { st.update(t + 13); st.setLights(1); cam3(st, t, info.dur, { from: { pos: [1.0, 1.28, 2.4], look: [-0.75, 1.02, 0.95], fov: 42 }, to: { pos: [0.9, 1.28, 2.2], look: [-0.75, 1.05, 0.95], fov: 39 } }); },
  overlay(g, t, info, st) { const soft = ease.inOut(prog(t, 0.5, 1.3));
    zero(g, st, t, { expr: t < 0.6 ? 'tired' : 'neutral', look: [-0.9, 0], glowA: 0.22 - 0.12 * soft, col: soft > 0.5 ? '#ffb8a8' : RED });
    you(g, st, t, { expr: 'smile', look: [0.9, 0], talk: talk(t, 0.0, 0.45), pose: breathe(POSES.sit, t, 0.5) }); } });
