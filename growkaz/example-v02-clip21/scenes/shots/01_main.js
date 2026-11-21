// V02 Clip 21 "the night you almost cancel" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, rr, seg, circle, glow, alpha, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM } from '/engine/toon2d.js';
import { blink, headNum, numChange, camEase, handPhone } from '/engine/storyfx.js';
import { bedroom, bedGround, bedSpot, standSpot, clockSpot } from '/engine/sets/bedroom.js';
import { street, streetGround, doorSpot, streetClock, umbrella } from '/engine/sets/street.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
const T = window.__C21 || {};
// chat screen: Sam's thread, a draft in the input box (chars = how many letters are visible), a send button
function chat(g, x, y, w, h, t, chars) {
  g.fillStyle = '#f3efe8'; g.fillRect(x, y, w, h);
  rr(g, x, y, w, 90, 0); g.fillStyle = '#2f6a5a'; g.fill(); bigToonFace(g, x + 50, y + 50, 22, { cast: SAM, expr: 'smile' });
  text(g, 'Sam', x + 120, y + 52, { size: 30, color: '#ffffff', align: 'left', stroke: 0 });
  const bub = (by, bw, mine) => { rr(g, mine ? x + w - bw - 16 : x + 16, by, bw, 46, 20); g.fillStyle = mine ? '#bfe6c8' : '#ffffff'; g.fill(); seg(g, [[mine ? x + w - bw : x + 32, by + 23], [mine ? x + w - 36 : x + 16 + bw - 20, by + 23]], 6, '#c8c0b4'); };
  bub(y + 120, 170, false); bub(y + 180, 130, true); bub(y + 240, 200, false);
  rr(g, x + 12, y + h - 96, w - 90, 70, 26); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#c8c0b4'; g.lineWidth = 3; g.stroke();
  const msg = "Can't make it, sorry.".slice(0, Math.max(0, Math.round(chars)));
  g.save(); g.beginPath(); g.rect(x + 20, y + h - 96, w - 106, 70); g.clip();
  text(g, msg, x + 30, y + h - 58, { size: 24, color: '#1b1424', align: 'left', stroke: 0, font: 'Nunito', weight: 700 }); g.restore();
  circle(g, x + w - 42, y + h - 61, 30, chars > 0 ? '#2f8a57' : '#b8c0b8'); seg(g, [[x + w - 54, y + h - 61], [x + w - 30, y + h - 61], [x + w - 40, y + h - 71]], 5, '#ffffff');
}

// r01 "So you do the slow thing."  his bedroom wall: a calendar, a red marker circles TUESDAY (slow, deliberate)
registerShot('r01', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.06 });
  blurLayer(g, 10, (g) => bedroom(g, t, { z: 1.3, x: 300, y: -120 })); veil(g, '#120a10', 0.15);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(cam.z, cam.z); g.translate(-E.W / 2, -E.H / 2);
  const cx = E.W / 2, cy = E.H * 0.5, w = 640, h = 520;
  rr(g, cx - w / 2, cy - h / 2, w, h, 12); g.fillStyle = '#fbf8f0'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
  rr(g, cx - w / 2, cy - h / 2, w, 90, 12); g.fillStyle = '#e0562f'; g.fill(); for (const d of [-1, 1]) circle(g, cx + d * 200, cy - h / 2, 12, '#1b1424');
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  for (let i = 0; i < 7; i++) text(g, days[i], cx - w / 2 + 50 + i * 90, cy - h / 2 + 130, { size: 30, color: i === 1 ? '#e0562f' : '#6a6070', stroke: 0 });
  for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { rr(g, cx - w / 2 + 16 + i * 88, cy - h / 2 + 160 + r * 84, 76, 70, 8); g.fillStyle = i === 1 ? '#fde8dc' : '#f0ece2'; g.fill(); }
  const tx = cx - w / 2 + 16 + 88 + 38, ty = cy - h / 2 + 160 + 1 * 84 + 35, k = ease.inOut(prog(t, 0.2, 1.3));
  g.strokeStyle = '#e0562f'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.ellipse(tx, ty, 56, 46, -0.2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2.1 * k); g.stroke();
  const a = -Math.PI / 2 + Math.PI * 2.1 * k, mx = tx + Math.cos(a) * 56, my = ty + Math.sin(a) * 46;   // the marker
  if (t < 1.5) { g.save(); g.translate(mx, my); g.rotate(0.6); rr(g, -10, -110, 20, 110, 6); g.fillStyle = '#e0562f'; g.fill(); rr(g, -12, -150, 24, 50, 6); g.fillStyle = '#2a2030'; g.fill(); g.restore(); }
  g.restore();
} });

// r02 "Tuesday, seven p.m. It's raining. You're tired."  rainy night bedroom, clock at 7, he slumps on the bed edge
registerShot('r02', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.04, x0: -80, x1: 20 });
  const { M } = bedroom(g, t, cam, { mood: 'night', clockT: 2100 + t });
  layer(g, cam, 0.55, (g) => { g.save(); g.beginPath(); g.rect(E.W / 2 - 120, bedGround() - V(700, 1000), 560, V(400, 560)); g.clip(); FX.rain(g, t, { count: 140, color: '#cfe0ff', a: 0.45 }); g.restore(); });
  const b = bedSpot(), s = V(1.6, 1.6), hx = b.x - 250;
  layer(g, cam, 0.85, (g) => drawToon(g, { x: hx, y: bedGround() - 20, s, facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'sit'], [info.dur * 0.6, 'sitBack']]), t, 0.6), expr: 'tired', blink: blink(t, 2.4), rim: { color: '#a9b8ff', dir: [0.6, -0.8], w: 3.5 } }));
  FX.drops(g, t, { count: 0 });
} });

// r03 "Your thumb is already on the message. Can't make it, sorry."  POV: the excuse already typed, thumb hovering over send
registerShot('r03', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.2, x: -100, y: 40 }, { mood: 'night' })); veil(g, '#0a0a1a', 0.4);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.12 }).z;
  handPhone(g, E.W / 2, E.H * 0.5 + 60 * (k - 1), V(1.05, 1.1) * k, (g, x, y, w, h) => chat(g, x, y, w, h, t, 30), { glowColor: '#cfe0ff' });
  const sc = V(1.05, 1.1) * k, bx = E.W / 2 + (150 - 42) * sc, by = E.H * 0.5 + 60 * (k - 1) + (300 - 61) * sc, hov = 14 + 8 * Math.sin(t * 2.4);
  g.fillStyle = HERO.skin; g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.beginPath(); g.ellipse(bx + 30, by + hov + 50, 34, 60, -0.5, 0, 7); g.fill(); g.stroke();
} });

// r04 "You look at it for a long time."  giant face lit blue by the screen, rain shadows sliding on it; long slow push
registerShot('r04', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.3, x: 120, y: -40 }, { mood: 'night' })); veil(g, '#0a0a1a', 0.35);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.08 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: 'tired', look: [0, 0.5], blink: blink(t, 3.8), rimColor: '#9fd8ff' });
  glow(g, E.W / 2, E.H * 0.95, 600, '#9fd8ff', 0.25);
  g.save(); g.globalAlpha = 0.12; FX.rain(g, t * 0.25, { count: 40, len: 120, w: 6, color: '#0a0a1a', a: 1 }); g.restore();
} });

// r05 "Then you delete it,"  POV: the message erases letter by letter, send button goes grey
registerShot('r05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.2, x: -100, y: 40 }, { mood: 'night' })); veil(g, '#0a0a1a', 0.4);
  const k = camEase(t, info.dur, { z0: 1.12, z1: 1.16 }).z, chars = 21 * (1 - ease.inOut(prog(t, 0.1, info.dur * 0.85)));
  handPhone(g, E.W / 2, E.H * 0.5 + 60 * (k - 1), V(1.05, 1.1) * k, (g, x, y, w, h) => chat(g, x, y, w, h, t, chars), { glowColor: '#cfe0ff' });
} });

// r06 "and you go."  rainy street: he walks under an umbrella toward Sam's door (purposeful walk), camera tracks
registerShot('r06', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.04, x0: -260, x1: -60 });
  const { M } = street(g, t, cam, { rain: 1 });
  const s = V(1.6, 1.6), hx = lerp(E.W * 0.12, E.W * 0.38, ease.out(prog(t, 0, info.dur)));
  layer(g, cam, 1, (g) => { drawToon(g, { x: hx, y: streetGround(), s, facing: 1, cast: HERO, pose: walkPose(t * 6.5), expr: 'determined', blink: blink(t), rim: rim(M) });
    umbrella(g, hx + 30 * s, streetGround() - 150 * s, s, '#2f5a8a', -0.08); });
} });

// r07 "On time. Phone in your pocket."  at Sam's door: the street clock says 7:00 sharp, he slides the phone into his pocket, door opens
registerShot('r07', { draw(g, t, info) {
  const c = streetClock(), d = doorSpot();
  const cam = camEase(t, info.dur, { z0: 1.25, z1: 1.12, x0: (c.x - E.W / 2) / 0.6, x1: (d.x - E.W / 2 - 120) / 0.85, y0: (c.y - E.H / 2) / 0.6 * 0.6, y1: -40 });
  const { M } = street(g, t, cam, { rain: 0.8, clockT: 2100 });
  const s = V(1.6, 1.6), hx = d.x - 240;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: hx, y: streetGround(), s, facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'phone'], [info.dur * 0.55, 'relaxed']]), t), prop: t < info.dur * 0.55 ? 'phone' : null, expr: 'smile', blink: blink(t), rim: rim(M) });
    umbrella(g, hx - 20 * s, streetGround() - 150 * s, s, '#2f5a8a', -0.15);
    const op = ease.inOut(prog(t, info.dur * 0.6, info.dur));
    if (op > 0) { glow(g, d.x, streetGround() - 140, 260 * op, '#ffd59a', 0.4); drawToon(g, { x: d.x, y: streetGround(), s, facing: -1, cast: SAM, pose: breathe(POSES.wave, t), expr: 'surprised', blink: blink(t, 3.4), rim: rim(M), alpha: op }); }
  });
} });

// r08 "Then the next Tuesday."  same door, a clear dusk this time: Sam smiles, his number edges up 44 -> 46
registerShot('r08', { draw(g, t, info) {
  const d = doorSpot(), cam = camEase(t, info.dur, { z0: 1.1, z1: 1.16, x0: (d.x - E.W / 2 - 120) / 0.85, x1: (d.x - E.W / 2 - 100) / 0.85 });
  const { M } = street(g, t, cam, { mood: 'dusk', clockT: 2100 + t });
  const s = V(1.6, 1.6);
  layer(g, cam, 1, (g) => { drawToon(g, { x: d.x - 240, y: streetGround(), s, facing: 1, cast: HERO, pose: breathe(POSES.relaxed, t), expr: 'smile', blink: blink(t), rim: rim(M) });
    drawToon(g, { x: d.x, y: streetGround(), s, facing: -1, cast: SAM, pose: breathe(POSES.talk, t), expr: 'smile', blink: blink(t, 3.4), rim: rim(M) });
    numChange(g, d.x, streetGround() - 300 * s, '44', '46', t, 0.35, { size: 56 }); });
} });

// r09 "Then the next."  night again, dry: they laugh at the door, 46 -> 49; slow pull-out as the street lamps glow
registerShot('r09', { draw(g, t, info) {
  const d = doorSpot(), cam = camEase(t, info.dur, { z0: 1.16, z1: 1.0, x0: (d.x - E.W / 2 - 120) / 0.85, x1: 80 });
  const { M } = street(g, t, cam, { mood: 'night', clockT: 2100 + t });
  const s = V(1.6, 1.6);
  layer(g, cam, 1, (g) => { drawToon(g, { x: d.x - 240, y: streetGround(), s, facing: 1, cast: HERO, pose: breathe(POSES.talk, t), expr: 'laugh', blink: blink(t), rim: rim(M) });
    drawToon(g, { x: d.x, y: streetGround(), s, facing: -1, cast: SAM, pose: breathe(POSES.relaxed, t), expr: 'laugh', blink: blink(t, 3.4), rim: rim(M) });
    numChange(g, d.x, streetGround() - 300 * s, '46', '49', t, 0.3, { size: 56 }); });
} });
