// V02 Clip 23 "the bigger problem" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { blink, headNum, camEase, handPhone } from '/engine/storyfx.js';
import { street, streetGround } from '/engine/sets/street.js';
import { apartment, aptGround } from '/engine/sets/apartment.js';
import { kitchen, kitGround } from '/engine/sets/kitchen.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const GOLD = '#ffe28a';
const W = window.__W || {};
// contact card: Dad's photo; cover = 0..1 how much of the top his thumb still hides
function dadContact(g, x, y, w, h, t, reveal) {
  g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#2a2440', '#14121e']); g.fillRect(x, y, w, h);
  text(g, 'Dad', x + w / 2, y + h * 0.7, { size: 46, color: '#ffffff', stroke: 0 });
  circle(g, x + w / 2, y + h * 0.42, 96, '#e8d8b8'); g.save(); g.beginPath(); g.arc(x + w / 2, y + h * 0.42, 92, 0, 7); g.clip();
  bigToonFace(g, x + w / 2, y + h * 0.46, 64, { cast: DAD, expr: 'happy', blink: blink(t, 3.2) }); g.restore();
  for (const [dx, c] of [[-70, '#2f8a57'], [70, '#e0562f']]) { circle(g, x + w / 2 + dx, y + h * 0.85, 34, c); }
  if (reveal > 0) { glow(g, x + w / 2, y + h * 0.18, 160 * reveal, GOLD, 0.5); headNum(g, x + w / 2, y + h * 0.18, '100', t, -1, { size: 50, color: GOLD }); }
}

// d01 "Walking home, you feel lighter than you have in weeks."  dusk street, a light bouncy walk, camera tracks alongside
registerShot('d01', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.05, x0: -300, x1: 100 });
  const { M } = street(g, t, cam, { mood: 'dusk', clockT: 2400 + t });
  const s = V(1.6, 1.6), hx = lerp(E.W * 0.1, E.W * 0.55, prog(t, 0, info.dur));
  layer(g, cam, 1, (g) => drawToon(g, { x: hx, y: streetGround() - 6 * Math.abs(Math.sin(t * 5)), s, facing: 1, cast: HERO, pose: walkPose(t * 5, { bob: 6, arm: 22 }), expr: 'happy', blink: blink(t), rim: rim(M) }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// d02 "You fixed it."  giant face: a relieved smile, warm sunset rim
registerShot('d02', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.3, x: 200, y: -80 }, { mood: 'dusk' })); veil(g, '#120a10', 0.15);
  const M = mood('dusk'), r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.04 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: 'happy', blink: blink(t), rimColor: M.rim });
} });

// d03 "Mostly."  same face: the smile slips to awkward, eyes slide aside
registerShot('d03', { draw(g, t, info) {
  blurLayer(g, 14, (g) => street(g, t, { z: 1.3, x: 200, y: -80 }, { mood: 'dusk' })); veil(g, '#120a10', 0.2);
  const M = mood('dusk'), r = V(230, 260) * camEase(t, info.dur, { z0: 1.04, z1: 1.08 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: t < 0.25 ? 'happy' : 'awkward', look: t < 0.25 ? [0, 0] : [-0.7, 0.2], blink: blink(t), rimColor: M.rim });
} });

// d04 "But there's one number you've been avoiding all week."  home at night: the phone lies FACE DOWN on the table, gold light leaking out
registerShot('d04', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.2, z1: 1.38, x0: 140, x1: 110, y0: 120, y1: 160 });
  const { M } = apartment(g, t, cam, { mood: 'night', wall: '#3e3550' });
  const s = V(1.6, 1.6), hx = E.W / 2 + 420, tx = E.W / 2 + 40, ty = aptGround() - 110;
  layer(g, cam, 0.85, (g) => {
    rr(g, tx - 200, ty, 400, 22, 8); g.fillStyle = '#7a5038'; g.fill(); seg(g, [[tx - 170, ty + 20], [tx - 170, aptGround()]], 10, '#5a3828'); seg(g, [[tx + 170, ty + 20], [tx + 170, aptGround()]], 10, '#5a3828');
    const pulse = 0.6 + 0.2 * Math.sin(t * 2.2); glow(g, tx, ty - 4, 420, GOLD, pulse); glow(g, tx, ty - 8, 140, '#fff6d0', pulse); FX.lensStreak(g, tx, ty - 4, 520, GOLD, pulse * 0.6, 3);
    rr(g, tx - 70, ty - 14, 140, 14, 5); g.fillStyle = '#1e1c26'; g.fill();
  });
  layer(g, cam, 1, (g) => drawToon(g, { x: hx, y: aptGround(), s, facing: -1, cast: HERO, pose: breathe(POSES.crossArms, t), expr: 'worried', look: [-0.4, 0.6], blink: blink(t), rim: { color: GOLD, dir: [-0.8, -0.3], w: 3.5 } }));
} });

// d05 "The one you were scared to look at too closely,"  POV: he turns the phone over; his thumb covers the top of Dad's card, gold glow leaking from under it
registerShot('d05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => apartment(g, t, { z: 1.2, x: 60, y: 40 }, { mood: 'night', wall: '#3e3550' })); veil(g, '#0a0a1a', 0.45);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.1 }).z, sc = V(1.05, 1.1) * k, cy = E.H * 0.5 + 40 * (1 - ease.out(prog(t, 0, 0.6)));
  handPhone(g, E.W / 2, cy, sc, (g, x, y, w, h) => dadContact(g, x, y, w, h, t, 0.35), { glowColor: GOLD });
  const th = ease.inOut(prog(t, info.dur * 0.55, info.dur)) * 80;                     // thumb starts to slide off
  g.save(); g.translate(E.W / 2, cy); g.scale(sc, sc);                    // his other hand cupped over the top of the screen, sliding away
  g.translate(th * 2.2, -190 - th * 0.8); g.rotate(-0.25);
  g.fillStyle = HERO.top; g.beginPath(); g.ellipse(200, -70, 80, 160, -0.95, 0, 7); g.fill();
  g.fillStyle = HERO.skin; g.strokeStyle = '#1b1424'; g.lineWidth = 7;
  rr(g, -110, -70, 250, 150, 60); g.fill(); g.stroke();
  for (let i = 0; i < 4; i++) { g.beginPath(); g.ellipse(-120, -48 + i * 34, 40, 18, 0, 0, 7); g.fill(); g.stroke(); }
  g.beginPath(); g.ellipse(20, 92, 44, 22, 0.5, 0, 7); g.fill(); g.stroke();
  g.restore();
} });

// d06 "because it was already perfect."  thumb gone: Dad's card with a big gold 100 and sparkles
registerShot('d06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => apartment(g, t, { z: 1.2, x: 60, y: 40 }, { mood: 'night', wall: '#3e3550' })); veil(g, '#0a0a1a', 0.5);
  const k = camEase(t, info.dur, { z0: 1.12, z1: 1.22 }).z;
  handPhone(g, E.W / 2, E.H * 0.55, V(1.05, 1.1) * k, (g, x, y, w, h) => { dadContact(g, x, y, w, h, t, 1);
    for (let i = 0; i < 4; i++) FX.sparkle(g, x + 60 + i * 60, y + 60 + (i % 2) * 70, 14 * Math.abs(Math.sin(t * 4 + i)), '#fff3c0', 0.9); }, { glowColor: GOLD });
} });

// d07 "Here's the bigger problem."  giant face in gold phone light, worry sets in; slow push
registerShot('d07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => apartment(g, t, { z: 1.3, x: -100, y: -60 }, { mood: 'night', wall: '#3e3550' })); veil(g, '#0a0a1a', 0.4);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: 'worried', look: [0, 0.4], blink: blink(t, 3.5), rimColor: GOLD });
  glow(g, E.W / 2, E.H * 1.05, 700, GOLD, 0.22);
} });

// d08 "The highest number in your life,"  drone shot: night city, a HUGE gold 100 hangs over the skyline, him tiny on the street below
registerShot('d08', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 0.92, y0: -120, y1: -200 });
  const { M } = street(g, t, cam, { mood: 'night' });
  layer(g, cam, 0.3, (g) => { glow(g, E.W / 2, E.H * 0.12, 700, GOLD, 0.35); headNum(g, E.W / 2, E.H * 0.14, '100', t, 0.1, { size: 220, color: GOLD }); });
  layer(g, cam, 1, (g) => drawToon(g, { x: E.W / 2 - 200, y: streetGround(), s: V(0.9, 0.9), facing: 1, cast: HERO, pose: breathe(POSES.stand, t), expr: 'worried', look: [0.2, -1], blink: blink(t), rim: { color: GOLD, dir: [0.2, -1], w: 3 } }));
} });

// d09 "belongs to the person you've been lying to the most."  Dad in his warm kitchen, 100 on his head, waving happily; your guilty shoulder blurred in front
registerShot('d09', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.05, z1: 1.22, x0: 140, x1: 200, y0: -40, y1: -90 });
  const { M } = kitchen(g, t, cam, {});
  const s = V(1.7, 1.7), dx = E.W / 2 + 200;
  layer(g, cam, 1, (g) => { drawToon(g, { x: dx, y: kitGround(), s, facing: -1, cast: DAD, pose: breathe(posesAt(t, [[0, 'stand'], [0.6, 'wave'], [2.2, 'relaxed']]), t), expr: 'happy', blink: blink(t, 3.2), rim: rim(M) });
    headNum(g, dx, kitGround() - 300 * s, '100', t, 0.2, { size: 64, color: GOLD }); });
  blurLayer(g, 18, (g) => drawToon(g, { x: E.W * 0.1, y: E.H * 1.35, s: V(4.2, 4.4), facing: 1, cast: HERO, pose: POSES.sad, expr: 'sad', rim: false, shadow: false }));
} });
