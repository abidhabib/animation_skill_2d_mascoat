// V02 Clip 3 "Dad's 100" (GrowKaz engine + our cast). Smooth eased camera (camEase) everywhere.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, rr, seg, circle, glow, alpha, linGrad, text, talkAmount } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD, MOM, ROOMMATE } from '/engine/toon2d.js';
import { blink, headNum, camEase, handPhone } from '/engine/storyfx.js';
import { kitchen, kitGround, counterTop } from '/engine/sets/kitchen.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
// dad's video call: his kitchen ceiling (lamp) + his face way too close; f = 0 (too close) .. 1 (backed off)
function dadCall(g, x, y, w, h, t, f, num) {
  g.fillStyle = linGrad(g, 0, y, 0, y + h, ['#efe4cf', '#d9c6a6']); g.fillRect(x, y, w, h);
  seg(g, [[x + w * 0.62, y], [x + w * 0.62, y + 70]], 4, '#2a2030'); g.fillStyle = '#f4d27a'; g.beginPath(); g.arc(x + w * 0.62, y + 96, 38, Math.PI, 0); g.fill(); glow(g, x + w * 0.62, y + 100, 120, '#fff0c0', 0.5);
  const r = lerp(420, 110, f), cy = lerp(y + h * 1.05, y + h * 0.66, f);
  bigToonFace(g, x + w / 2 + lerp(60, 0, f), cy, r, { cast: DAD, expr: f > 0.5 ? 'happy' : 'smile', talk: 0.35 * Math.abs(Math.sin(t * 8)), blink: blink(t, 3.2), tilt: lerp(-0.12, 0, f) });
  rr(g, x + w - 96, y + h - 150, 78, 110, 12); g.fillStyle = '#3a4a6a'; g.fill(); bigToonFace(g, x + w - 57, y + h - 98, 22, { cast: HERO, expr: 'neutral' });   // your little self-view
  if (num) headNum(g, x + w / 2, cy - r - 70, num.str, t, num.t0, { size: num.size, color: '#ffe28a' });
}

// c01 "Your phone rings."  the phone on the kitchen counter rings, buzzing towards the edge
registerShot('c01', { draw(g, t, info) {
  const px = E.W / 2 - 220, py = counterTop();
  const cam = camEase(t, info.dur, { z0: 1.4, z1: 1.5, x0: (px - E.W / 2) / 0.85, x1: (px - E.W / 2) / 0.85, y0: (py - E.H / 2 - 40) / 0.85, y1: (py - E.H / 2 - 40) / 0.85 });
  kitchen(g, t, cam, {});
  layer(g, cam, 0.85, (g) => { const [bx] = shake(t * 6, 3, 9); g.save(); g.translate(px + bx + t * 10, py - 6); rr(g, -50, -10, 100, 14, 5); g.fillStyle = '#1e1c26'; g.fill(); rr(g, -46, -9, 92, 9, 3); g.fillStyle = '#9fffb8'; g.fill(); g.restore();
    glow(g, px, py - 20, 220, '#9fffb8', 0.4); FX.rings(g, px, py - 14, t, { color: '#cfffe0', r0: 40, r1: 170, a: 0.5 }); });
} });

// c02 "Dad, on video, way too close to the camera, like always."  POV phone: dad's nose fills the screen
registerShot('c02', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.2, x: -60, y: 20 }, {})); veil(g, '#120a10', 0.25);
  const k = camEase(t, info.dur, { z0: 0.95, z1: 1.02 }).z;
  handPhone(g, E.W / 2, E.H * 0.5 + 40 * (1 - ease.out(prog(t, 0, 0.5))), V(1.05, 1.1) * k, (g, x, y, w, h) => dadCall(g, x, y, w, h, t, 0.45 + 0.04 * Math.sin(t * 2)), { glowColor: '#ffe2a8' });
} });

// c03 "You can see half his forehead and the kitchen ceiling."  closer on the screen: he tilts, all forehead + ceiling lamp
registerShot('c03', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.2, x: -60, y: 20 }, {})); veil(g, '#120a10', 0.3);
  const k = camEase(t, info.dur, { z0: 1.05, z1: 1.15 }).z;
  handPhone(g, E.W / 2, E.H * 0.5, V(1.05, 1.1) * k, (g, x, y, w, h) => { g.save(); g.translate(0, 120 * ease.inOut(prog(t, 0.2, 1.4))); dadCall(g, x, y, w, h, t, 0); g.restore(); }, { glowColor: '#ffe2a8' });
} });

// c04 "Above his face on the screen, one hundred."  he backs off, his face fits, a gold 100 glows above it
registerShot('c04', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.2, x: -60, y: 20 }, {})); veil(g, '#120a10', 0.3);
  const k = camEase(t, info.dur, { z0: 1.1, z1: 1.2 }).z, f = ease.inOut(prog(t, 0, 1.0));
  handPhone(g, E.W / 2, E.H * 0.5, V(1.05, 1.1) * k, (g, x, y, w, h) => { dadCall(g, x, y, w, h, t, f, { str: '100', size: 46, t0: 2.0 });
    if (t > 2.1) FX.sparkle(g, x + w / 2 + 70, y + 90, 16 * Math.abs(Math.sin(t * 5)), '#fff3c0', 0.9); }, { glowColor: '#ffe2a8' });
  if (t > 2.1) glow(g, E.W / 2, E.H * 0.3, 500, '#ffe28a', 0.15 * ease.out(prog(t, 2.1, 2.6)));
} });

// c05 "And that's when it clicks."  giant face: realisation, eyes widen; a quick bright beat
registerShot('c05', { draw(g, t, info) {
  blurLayer(g, 14, (g) => kitchen(g, t, { z: 1.3, x: -200, y: -60 }, {})); veil(g, '#120a10', 0.2);
  const pk = ease.out(prog(t, 0.75, 1.0)), r = V(230, 260) * (1 + 0.06 * pk);
  bigToonFace(g, E.W / 2, E.H * 0.53, r, { cast: HERO, expr: t < 0.8 ? 'thinking' : 'surprised', blink: t < 0.8 && blink(t), rimColor: '#ffe28a' });
  if (t > 0.8) { FX.rings(g, E.W / 2, E.H * 0.53, t, { color: '#fff3c0', r0: r * 1.2, r1: r * 2.2, a: 0.4 * (1 - prog(t, 0.8, 1.5)) }); }
} });

// c06 "These numbers aren't random."  dark void-ish kitchen: the three people's faces float around him with their numbers
registerShot('c06', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.08 });
  const { M } = kitchen(g, t, cam, {}); veil(g, '#120a20', 0.55);
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: E.W / 2, y: kitGround(), s: V(1.7, 1.7), facing: 1, cast: HERO, pose: breathe(POSES.think, t), expr: 'thinking', blink: blink(t), rim: { color: '#8dffc8', dir: [0.6, -0.8], w: 3.5 } });
    [[MOM, '99', '#8dffc8', -0.6], [ROOMMATE, '62', '#8dffc8', 0.0], [DAD, '100', '#ffe28a', 0.6]].forEach(([c, n, col, d], i) => {
      const p = ease.outBack(prog(t, 0.1 + i * 0.35, 0.5 + i * 0.35)); if (p <= 0) return;
      const ang = -Math.PI / 2 + d * 1.6 + t * 0.15, cx = E.W / 2 + Math.cos(ang) * 520, cy = E.H * 0.42 + Math.sin(ang) * 220 + 10 * Math.sin(t * 2 + i);
      g.save(); g.translate(cx, cy); g.scale(p, p); glow(g, 0, 0, 160, col, 0.25); bigToonFace(g, 0, 0, 62, { cast: c, expr: 'neutral', blink: blink(t + i) }); g.restore();
      headNum(g, cx, cy - 115 * p, n, t, 0.3 + i * 0.35, { size: 40, color: col });
    });
  });
} });

// c07 "They're about you."  all three numbers drift in and orbit him; push in to his stunned face
registerShot('c07', { draw(g, t, info) {
  const hy = kitGround() - 260 * V(1.7, 1.7);
  const cam = camEase(t, info.dur, { z0: 1.1, z1: 1.35, y0: -40, y1: hy - E.H / 2 + 80 });
  kitchen(g, t, cam, {}); veil(g, '#120a20', 0.55);
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: E.W / 2, y: kitGround(), s: V(1.7, 1.7), facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'think'], [0.5, 'shrug']]), t), expr: t < 0.5 ? 'surprised' : 'shocked', blink: false, rim: { color: '#8dffc8', dir: [0.6, -0.8], w: 3.5 } });
    ['99', '62', '100'].forEach((n, i) => { const k = ease.inOut(prog(t, 0, 1.2)), ang = i * 2.09 + t * 1.2, R = lerp(520, 240, k);
      headNum(g, E.W / 2 + Math.cos(ang) * R, hy + Math.sin(ang) * R * 0.35, n, t, -1, { size: 44, color: n === '100' ? '#ffe28a' : '#8dffc8' }); });
  });
} });
