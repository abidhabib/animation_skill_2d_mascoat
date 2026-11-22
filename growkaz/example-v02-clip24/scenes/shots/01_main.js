// V02 Clip 24 "Dad's kitchen: one hundred". FIRST 3D CLIP: soft cartoon 3D kitchen (three-toon) + our 2D cast pinned in,
// 2D inserts (sugar, stamp), and a warm 2D childhood memory (bike + fence). Smooth eased cameras everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD, KID, YOUNG_DAD } from '/engine/toon2d.js';
import { blink, headNum, camEase } from '/engine/storyfx.js';
import { cam3, moves, pin, screenOf } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';
import { park, parkGround, fenceX, bike } from '/engine/sets/park.js';
import { apartment, aptGround } from '/engine/sets/apartment.js';

const GOLD = '#ffe28a', RIM = { color: '#ffc68a', dir: [-0.7, -0.7], w: 3.5 };
const init = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
function at(g, st, t, p, o) {                                   // a 2D cast member standing/sitting at a 3D spot
  const q = pin(st, p, 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', talk: o.talk, look: o.look, blink: blink(t, o.bp || 3.2), rim: RIM, prop: o.prop });
  return q;
}
const dadNum = (g, q, t, t0 = -1) => headNum(g, q.x, q.y - 300 * q.s, '100', t, t0, { size: Math.max(30, 40 * q.s), color: GOLD });

// e01 "Dad's kitchen."  3D: slow glide in from the hallway door, the whole warm room revealed
registerShot('e01', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [3.6, 1.65, 3.4], look: [-0.4, 1.0, -1.2], fov: 38 }, to: { pos: [2.6, 1.6, 2.4], look: [-0.6, 0.95, -1.0], fov: 36 } }); },
  overlay(g, t, info, st) {} });

// e02 "The same table. The same old chair."  3D: low push across the table top toward the worn old chair
registerShot('e02', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.4, 1.05, 2.2], look: [-0.4, 0.8, 0.3], fov: 34 }, to: { pos: [0.5, 0.95, 1.2], look: [-1.25, 0.6, 0.3], fov: 32 } }); },
  overlay(g, t, info, st) {} });

// e03 "He's making tea the way he always does,"  3D: Dad at the counter by the kettle, camera pushes in
registerShot('e03', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.push([2.6, 1.15, -1.9], 5.0, 3.6, 1.6, [-0.35, 0, 0.94])); },
  overlay(g, t, info, st) { at(g, st, t, st.spots.stove, { cast: DAD, facing: -1, pose: breathe(posesAt(t, [[0, 'holdFront'], [1.2, 'reach'], [1.8, 'holdFront']]), t), expr: 'smile' }); } });

// e04 "with too much sugar."  2D insert: one, two, three, four, five sugar cubes plop into the mug, splash
registerShot('e04', { draw(g, t, info) {
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z;
  g.fillStyle = linGrad(g, 0, 0, 0, E.H, ['#e6c49a', '#c89a6e']); g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.3, E.H * 0.2, 700, '#ffd08a', 0.35);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  rr(g, -100, E.H * 0.74, E.W + 200, E.H, 0); g.fillStyle = '#f2ead8'; g.fill();
  const mx = E.W / 2, my = E.H * 0.76;
  g.fillStyle = '#5a8ab8'; g.strokeStyle = '#1b1424'; g.lineWidth = 8; g.beginPath(); g.moveTo(mx - 190, my - 330); g.lineTo(mx + 190, my - 330); g.lineTo(mx + 160, my); g.lineTo(mx - 160, my); g.closePath(); g.fill(); g.stroke();
  g.beginPath(); g.ellipse(mx + 210, my - 180, 60, 80, 0, -1.3, 1.3); g.lineWidth = 22; g.stroke(); g.lineWidth = 8;
  g.fillStyle = '#b87a4a'; g.beginPath(); g.ellipse(mx, my - 330, 186, 30, 0, 0, 7); g.fill(); g.stroke();
  for (let i = 0; i < 5; i++) { const t0 = 0.05 + i * 0.22, p = prog(t, t0, t0 + 0.25); if (p <= 0) continue; if (p >= 1) { const sp = prog(t, t0 + 0.25, t0 + 0.6); if (sp < 1) for (let d = -1; d <= 1; d += 2) circle(g, mx + d * (30 + 60 * sp), my - 340 - 70 * Math.sin(sp * Math.PI), 9 * (1 - sp), '#d8a070'); continue; }
    const y = lerp(-80, my - 340, ease.in(p)); rr(g, mx - 30 + (i % 2) * 20, y - 30, 56, 56, 8); g.fillStyle = '#ffffff'; g.fill(); g.lineWidth = 5; g.stroke(); }
  g.restore();
} });

// e05 "Above his head, one hundred."  3D: crane up behind Dad as he turns; the gold 100 pops on his head
registerShot('e05', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.crane([2.5, 1.25, -1.9], 1.25, 2.2, 4.6)); },
  overlay(g, t, info, st) { const q = at(g, st, t, st.spots.stove, { cast: DAD, facing: -1, pose: breathe(POSES.holdFront, t), expr: 'happy' }); if (t > 1.3) glow(g, q.x, q.y - 300 * q.s, 260 * q.s, GOLD, 0.3); dadNum(g, q, t, 1.3); } });

// e06 "Not a single point lost, in all your years."  3D: slow orbit around Dad in his old chair with his tea, 100 steady
registerShot('e06', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.orbit([-1.1, 1.0, 0.3], -0.6, 0.3, 4.2, 1.55)); },
  overlay(g, t, info, st) { const q = at(g, st, t, st.spots.chairOld, { cast: DAD, facing: 1, pose: breathe(POSES.sit, t, 0.6), expr: 'smile' }); dadNum(g, q, t); } });

// --- memory (2D, warm haze) ---
// e07 "You remember when he taught you to ride a bike."  park: young Dad runs behind, holding kid Abid's seat
registerShot('e07', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.05, x0: -260, x1: 120 });
  const { M } = park(g, t, cam);
  const bx = lerp(E.W * 0.15, E.W * 0.5, ease.inOut(prog(t, 0, info.dur))), s = V(1.5, 1.5), ks = s * 0.62;
  layer(g, cam, 1, (g) => {
    bike(g, bx, parkGround() + 60, 1.15, { spin: t * 9, tilt: Math.sin(t * 5) * 0.05 });
    drawToon(g, { x: bx - 10, y: parkGround() + 60 - 112 * 1.15 + 100 * ks, s: ks, facing: 1, cast: KID, pose: POSES.sit, expr: 'nervous', blink: blink(t), rim: false });
    drawToon(g, { x: bx - 150, y: parkGround() + 60, s, facing: 1, cast: YOUNG_DAD, pose: walkPose(t * 7, { run: true }), expr: 'happy', blink: blink(t, 3.2), rim: false });
  });
} });

// e08 "You crashed into the fence, eleven times."  same fence, crash after crash (fast), chalk tally marks pile up to 11
registerShot('e08', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.18, x0: fenceX() - E.W / 2 - 200, x1: fenceX() - E.W / 2 - 160, y0: 40, y1: 40 });
  const { M } = park(g, t, cam);
  const n = Math.min(11, Math.floor(1 + t / (info.dur / 11.5))), ph = (t / (info.dur / 11.5)) % 1, s = V(1.5, 1.5) * 0.62, fx = fenceX() - 70;
  layer(g, cam, 0.9, (g) => { for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, x0 = fenceX() + 10 + grp * 120;           // tally marks
    if (j < 4) seg(g, [[x0 + j * 22, parkGround() - 110], [x0 + j * 22, parkGround() - 60]], 6, alpha('#ffffff', 0.95)); else seg(g, [[x0 - 10, parkGround() - 70], [x0 + 80, parkGround() - 100]], 6, '#ffffff'); }
    for (let i = 0; i < n; i++) { const grp = Math.floor(i / 5), j = i % 5, x0 = fenceX() + 10 + grp * 120; if (j < 4) seg(g, [[x0 + j * 22, parkGround() - 110], [x0 + j * 22, parkGround() - 60]], 2, '#1b1424'); } });
  layer(g, cam, 1, (g) => {
    const crash = ph > 0.6, bxx = lerp(fx - 420, fx, ease.in(Math.min(1, ph / 0.6)));
    bike(g, crash ? fx - 20 : bxx, parkGround() + 60, 1.15, { spin: t * 12, tilt: crash ? -0.9 * ease.out(prog(ph, 0.6, 0.8)) : 0 });
    drawToon(g, { x: crash ? fx - 90 : bxx - 10, y: crash ? parkGround() + 60 : parkGround() + 60 - 112 * 1.15 + 100 * s, s, facing: 1, cast: KID, pose: crash ? POSES.sit : POSES.sit, expr: crash ? 'shocked' : 'determined', blink: false, rim: false });
    if (crash && ph < 0.75) FX.rings(g, fx, parkGround() - 40, ph * 4, { color: '#ffffff', r0: 20, r1: 120, a: 0.6 });
  });
} });

// e09 "And every time, he said, Again."  young Dad crouches, lifts the bike, a big thumbs-up grin
registerShot('e09', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.15, z1: 1.22, x0: fenceX() - E.W / 2 - 360, x1: fenceX() - E.W / 2 - 330, y0: 60, y1: 60 });
  const { M } = park(g, t, cam);
  const s = V(1.5, 1.5), dx = fenceX() - 360;
  layer(g, cam, 1, (g) => {
    bike(g, dx + 160, parkGround() + 60, 1.15, { tilt: -0.9 + 0.9 * ease.inOut(prog(t, 0.4, 1.6)) });
    drawToon(g, { x: dx + 300, y: parkGround() + 60, s: s * 0.62, facing: -1, cast: KID, pose: breathe(POSES.stand, t), expr: t < 2 ? 'sad' : 'determined', blink: blink(t), rim: false });
    drawToon(g, { x: dx, y: parkGround() + 60, s, facing: 1, cast: YOUNG_DAD, pose: posesAt(t, [[0, 'crouch'], [1.9, 'pointUp']]), expr: 'happy', talk: t > 2.0 && t < 2.6 ? 0.6 : 0, blink: blink(t, 3.2), rim: false });
  });
} });

// e10 "He never stopped believing you'd make it."  kid rides off steady into the sun, young Dad cheering; slow pull-out
registerShot('e10', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.0, x0: 0, x1: 160 });
  const { M } = park(g, t, cam);
  const s = V(1.5, 1.5), ks = s * 0.62, bx = lerp(E.W * 0.45, E.W * 0.95, ease.in(prog(t, 0.2, info.dur)));
  layer(g, cam, 1, (g) => {
    bike(g, bx, parkGround() + 60, 1.15, { spin: t * 10 });
    drawToon(g, { x: bx - 10, y: parkGround() + 60 - 112 * 1.15 + 100 * ks, s: ks, facing: 1, cast: KID, pose: POSES.sit, expr: 'joy', blink: blink(t), rim: false });
    drawToon(g, { x: E.W * 0.3, y: parkGround() + 60, s, facing: 1, cast: YOUNG_DAD, pose: breathe(POSES.cheer, t), expr: 'laugh', blink: blink(t, 3.2), rim: false });
  });
} });

// e11 "And you've been hiding something."  back to 3D now: you sit across from Dad at the table, he smiles, you can't
registerShot('e11', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.2, 1.55, 3.9], look: [-0.4, 0.95, 0.3], fov: 36 }, to: { pos: [0.9, 1.5, 3.3], look: [-0.4, 0.95, 0.3], fov: 34 } }); },
  overlay(g, t, info, st) { const d = at(g, st, t, st.spots.chairOld, { cast: DAD, facing: 1, pose: breathe(POSES.sit, t, 0.6), expr: 'smile' }); dadNum(g, d, t);
    at(g, st, t, st.spots.chairNew, { cast: HERO, facing: -1, pose: breathe(POSES.sit, t, 0.5), expr: 'awkward', look: [0.3, 0.6], bp: 2.6 }); } });

// e12 "Three months ago, you dropped out of the course he's been paying for."  2D insert: student card in a drawer, red DROPPED stamp slams down
registerShot('e12', { draw(g, t, info) {
  blurLayer(g, 12, (g) => apartment(g, t, { z: 1.3, x: -200, y: -60 }, { mood: 'night', wall: '#3e3550' })); veil(g, '#0a0a1a', 0.35);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.1 }).z;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  rr(g, E.W / 2 - 520, E.H * 0.25, 1040, 640, 24); g.fillStyle = '#5a3a2a'; g.fill(); rr(g, E.W / 2 - 480, E.H * 0.25 + 30, 960, 580, 16); g.fillStyle = '#3a2418'; g.fill();   // open drawer
  g.save(); g.translate(E.W / 2, E.H * 0.55); g.rotate(-0.06);
  rr(g, -300, -180, 600, 360, 24); g.fillStyle = '#f4f0e6'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
  rr(g, -300, -180, 600, 80, 24); g.fillStyle = '#4a78b8'; g.fill(); bigToonFace(g, -170, 40, 70, { cast: HERO, expr: 'smile' });
  for (let i = 0; i < 4; i++) seg(g, [[-50, -20 + i * 44], [220 - i * 30, -20 + i * 44]], 12, '#c8c0b4');
  const sp = prog(t, 1.3, 1.48); if (sp > 0) { const sc = lerp(1.8, 1, ease.out(sp)); g.save(); g.translate(70, 20); g.rotate(-0.2); g.scale(sc, sc); g.globalAlpha = Math.min(1, sp * 2);
    rr(g, -230, -60, 460, 120, 14); g.strokeStyle = '#d23a2a'; g.lineWidth = 12; g.stroke(); text(g, 'DROPPED', 0, 6, { size: 86, color: '#d23a2a', stroke: 0 }); g.restore(); }
  g.restore(); g.restore();
  if (t > 1.48) glow(g, E.W / 2, E.H * 0.1, 900, GOLD, 0.12 * Math.sin(Math.PI * prog(t, info.dur * 0.5, info.dur)));
} });
