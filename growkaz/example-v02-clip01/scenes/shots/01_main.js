// V02 Clip 1 "the alarm and 99" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, rr, seg, circle, glow, alpha, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, MOM } from '/engine/toon2d.js';
import { blink, headNum, camEase, handPhone } from '/engine/storyfx.js';
import { bedroom, bedGround, bedSpot, standSpot, clockSpot } from '/engine/sets/bedroom.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const to = (px, py, d = 1) => ({ x: (px - E.W / 2) / d, y: (py - E.H / 2) / d });   // d = layer depth of the target   // camera offset that centres a world point
// lock screen: warm photo of mom + the time; num = {str, size, t0} glows above her head
function lockScreen(g, x, y, w, h, t, num) {
  g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#f7c58e', '#e88a6a', '#8a5a86']); g.fillRect(x, y, w, h);
  glow(g, x + w * 0.7, y + h * 0.3, 200, '#fff0c8', 0.4);
  bigToonFace(g, x + w / 2, y + h * 0.5, 84, { cast: MOM, expr: 'happy', blink: blink(t, 3.6) });
  text(g, '7:00', x + w / 2, y + 80, { size: 64, color: '#ffffff', stroke: 0 });
  if (num) headNum(g, x + w / 2, y + h * 0.5 - 165, num.str, t, num.t0, { size: num.size, color: '#8dffc8' });
}

// a01 "Your alarm goes off."  pre-dawn: the phone on the nightstand buzzes and lights the dark room
registerShot('a01', { draw(g, t, info) {
  const s = standSpot(), c = to(s.x, s.y - 60, 0.85);
  const cam = camEase(t, info.dur, { z0: 1.35, z1: 1.45, x0: c.x, x1: c.x, y0: c.y, y1: c.y });
  bedroom(g, t, cam, { mood: 'night' });
  layer(g, cam, 0.85, (g) => {
    const [bx, by] = t > 0.15 ? shake(t * 6, 3, 9) : [0, 0];
    g.save(); g.translate(s.x + 20 + bx, s.y - 6 + by); rr(g, -46, -10, 92, 14, 5); g.fillStyle = '#1e1c26'; g.fill();
    rr(g, -42, -9, 84, 9, 3); g.fillStyle = t > 0.15 ? '#bfe6ff' : '#22283a'; g.fill(); g.restore();
    if (t > 0.15) { glow(g, s.x + 20, s.y - 20, 240, '#9fd8ff', 0.45 + 0.1 * Math.sin(t * 20)); FX.rings(g, s.x + 20, s.y - 10, t, { color: '#cfeaff', r0: 40, r1: 160, a: 0.45 }); }
  });
} });

// a02 "Seven a.m."  the mounted wall clock: hands sweep to 7:00 sharp, first light on the wall
registerShot('a02', { draw(g, t, info) {
  const c0 = clockSpot(), c = to(c0.x, c0.y, 0.55);
  const cam = camEase(t, info.dur, { z0: 1.4, z1: 1.5, x0: c.x, x1: c.x, y0: c.y, y1: c.y });
  bedroom(g, t, cam, { mood: 'golden', clockT: 2100 - 60 + 60 * ease.out(prog(t, 0, 0.5)) + t });
} });

// a03 "You roll over, you grab your phone, and you freeze."  wide: he sits up, reaches for the phone, then freezes in shock
registerShot('a03', { draw(g, t, info) {
  const fz = 2.68, punch = ease.inOut(prog(t, fz, fz + 0.35));
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.05, x0: -60, x1: -100 }); cam.z += 0.08 * punch;
  const { M } = bedroom(g, t, cam);
  const b = bedSpot(), s = V(1.6, 1.6), hx = b.x - 250;
  layer(g, cam, 0.85, (g) => drawToon(g, { x: hx, y: bedGround() - 20, s, facing: -1, cast: HERO,
    pose: breathe(posesAt(t, [[0, 'sit'], [0.9, 'reach'], [1.6, 'phone']]), t), prop: t > 1.5 ? 'phone' : null,
    expr: t < 1.0 ? 'tired' : t < fz ? 'neutral' : 'shocked', blink: t < fz && blink(t), rim: rim(M) }));
  if (t > fz) glow(g, E.W / 2, E.H / 2, 900, '#ffffff', 0.12 * (1 - prog(t, fz, fz + 0.5)));
} });

// a04 "Because floating above the photo on your lock screen, your mom's smiling face,"  POV: the phone in his hands, mom's photo
registerShot('a04', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.2, x: -100, y: 40 })); veil(g, '#120a10', 0.3);
  const k = camEase(t, info.dur, { z0: 0.92, z1: 1.0 });
  handPhone(g, E.W / 2, E.H * 0.5 + 40 * (1 - ease.out(prog(t, 0, 0.6))), V(1.05, 1.1) * k.z, (g, x, y, w, h) => lockScreen(g, x, y, w, h, t, null), { glowColor: '#ffd2a0' });
} });

// a05 "there's a tiny glowing number."  same phone, a tiny glow appears above her head; slow push
registerShot('a05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.2, x: -100, y: 40 })); veil(g, '#120a10', 0.35);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.12 });
  handPhone(g, E.W / 2, E.H * 0.5 + 60 * (k.z - 1), V(1.05, 1.1) * k.z, (g, x, y, w, h) => {
    lockScreen(g, x, y, w, h, t, { str: '99', size: 26, t0: 1.0 });
    if (t > 1.0) FX.sparkle(g, x + w / 2 + 30, y + h * 0.5 - 185, 14 * Math.abs(Math.sin(t * 5)), '#d8ffe8', 0.8);
  }, { glowColor: '#ffd2a0' });
} });

// a06 "Ninety-nine."  extreme close-up of the screen: 99 glows big over mom's photo
registerShot('a06', { draw(g, t, info) {
  blurLayer(g, 16, (g) => bedroom(g, t, { z: 1.3, x: -100, y: 40 })); veil(g, '#120a10', 0.45);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z, sc = V(1.7, 1.7) * k;
  handPhone(g, E.W / 2, E.H / 2 + 165 * sc - 40, sc, (g, x, y, w, h) => lockScreen(g, x, y, w, h, t, { str: '99', size: 40, t0: -1 }), { glowColor: '#8dffc8' });
  FX.dust(g, t, { count: 24, color: '#d8ffe8', a: 0.3 });
} });

// a07 "You rub your eyes."  giant face: he rubs his eyes with both fists
registerShot('a07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.3, x: 120, y: -40 })); veil(g, '#120a10', 0.2);
  const M = mood('golden'), r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.04 }).z, cx = E.W / 2, cy = E.H * 0.52;
  bigToonFace(g, cx, cy, r, { cast: HERO, expr: 'tired', blink: true, rimColor: M.rim });
  const rub = Math.sin(t * 12) * 14 * (1 - prog(t, info.dur - 0.4, info.dur));
  for (const d of [-1, 1]) { g.fillStyle = HERO.skin; g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.beginPath(); g.ellipse(cx + d * r * 0.42 + rub * d, cy - r * 0.05 + rub * 0.5, r * 0.26, r * 0.22, 0, 0, 7); g.fill(); g.stroke();
    g.fillStyle = HERO.top; g.beginPath(); g.ellipse(cx + d * r * 0.62, cy + r * 0.55, r * 0.24, r * 0.5, d * -0.5, 0, 7); g.fill(); }
} });

// a08 "You shake the phone."  POV again: the phone shakes hard, the 99 stays put on screen
registerShot('a08', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.2, x: -100, y: 40 })); veil(g, '#120a10', 0.3);
  const amp = 26 * Math.sin(Math.PI * prog(t, 0.05, info.dur - 0.2)), sx = Math.sin(t * 28) * amp, sy = Math.cos(t * 23) * amp * 0.5;
  handPhone(g, E.W / 2 + sx, E.H * 0.5 + sy, V(1.05, 1.1), (g, x, y, w, h) => lockScreen(g, x, y, w, h, t, { str: '99', size: 30, t0: -1 }), { rot: sx * 0.004, glowColor: '#ffd2a0' });
} });

// a09 "It doesn't go away."  wide: he sits on the bed staring at the phone, its green glow on his face; slow pull-out
registerShot('a09', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.18, z1: 1.02, x0: 60, x1: 0 });
  const { M } = bedroom(g, t, cam);
  const b = bedSpot(), s = V(1.6, 1.6), hx = b.x - 250;
  layer(g, cam, 0.85, (g) => {
    drawToon(g, { x: hx, y: bedGround() - 20, s, facing: -1, cast: HERO, pose: breathe(POSES.phone, t, 0.5), prop: 'phone', expr: 'worried', blink: blink(t), rim: rim(M) });
    glow(g, hx - 30 * s, bedGround() - 20 - 175 * s, 140, '#8dffc8', 0.3 + 0.08 * Math.sin(t * 3));
  });
} });
