// shots/01_mall.js: V02 Clip 19 "the twist" in the GrowKaz engine, with the user's own cartoon hero (toon2d.js).
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, talkAmount, wordTime, seg, circle, rr, glow, alpha, shade, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawToon, bigToonFace, HERO, CASHIER, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { mall, mallGround } from '../sets/mall.js';

const blink = (t, p = 3.1) => (t % p) > p - 0.12;
// glowing trust number that pops on a head (the user's rule: numbers live ON the person)
function headNum(g, x, y, str, t, t0, o = {}) {
  const k = ease.outBack(prog(t, t0, t0 + 0.35)); if (k <= 0) return;
  const col = o.color || '#8dffc8';
  g.save(); g.translate(x, y - 8 * Math.sin(t * 2)); g.scale(k, k);
  glow(g, 0, 0, 90, col, 0.45);
  text(g, str, 0, 0, { size: o.size || 64, color: '#ffffff', glow: 18, glowColor: col, stroke: 8, strokeColor: '#0b0620' });
  g.restore();
}
function floater(g, x, y, str, t, t0, col) {   // "-3" drifting down and fading
  const p = prog(t, t0, t0 + 1.2); if (p <= 0 || p >= 1) return;
  g.save(); g.globalAlpha = 1 - p; text(g, str, x, y + 90 * ease.out(p), { size: 58, color: col, stroke: 7, strokeColor: '#0b0620' }); g.restore();
}
const GY = () => mallGround();
const rimW = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });

// s001 "You tell a stranger you love their haircut."  medium two-shot, warm mall, slow lateral drift
registerShot('s001', { draw(g, t, info) {
  const cam = { z: 1.04 + 0.05 * ease.inOut(t / info.dur), x: -30 + 60 * ease.inOut(t / info.dur) };
  const { M } = mall(g, t, cam);
  const s = V(1.55, 1.6), hx = E.W / 2 - 230, sx = E.W / 2 + 230;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: hx, y: GY(), s, facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'stand'], [0.5, 'explain']]), t), expr: 'fake', blink: blink(t), rim: rimW(M) });
    drawToon(g, { x: sx, y: GY(), s, facing: -1, cast: STRANGER, pose: breathe(posesAt(t, [[0, 'stand'], [0.9, 'handsOnHead']]), t, 1, 3), expr: t > 0.9 ? 'happy' : 'surprised', blink: blink(t, 3.7), rim: rimW(M) });
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
  FX.lensStreak(g, E.W / 2, E.H * 0.25, E.W * 1.2, '#ffe0b0', 0.14);
} });

// s002 "You don't."  giant face: the fake grin cracks, eyes slide away, a bead of sweat
registerShot('s002', { draw(g, t, info) {
  blurLayer(g, 14, (g) => mall(g, t, { z: 1.4, x: -200, y: -80 })); veil(g, '#120a10', 0.3);
  const M = mood('golden'), r = V(250, 290) * (1 + 0.04 * t);
  bigToonFace(g, E.W / 2, E.H * V(0.5, 0.48), r, { cast: HERO, expr: t < 0.45 ? 'fake' : 'awkward', look: [lerp(0, -0.8, prog(t, 0.4, 0.9)), 0.3], blink: blink(t), rimColor: M.rim });
} });

// s003 "Minus three."  the stranger's smile fades; the number on her head drops 54 -> 51 and a red -3 sinks away
registerShot('s003', { draw(g, t, info) {
  const cam = { z: 1.15 + 0.05 * t, x: 120 };
  const { M } = mall(g, t, cam);
  const s = V(1.8, 1.8), x = E.W / 2 + 40;
  let hy = 0;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x, y: GY(), s, facing: -1, cast: STRANGER, pose: breathe(POSES.stand, t, 1, 2), expr: t < 0.35 ? 'smile' : 'neutral', blink: blink(t, 2.9), rim: rimW(M) });
    hy = GY() - 300 * s;
    const sh = t > 0.3 ? shake(t, 6 * (1 - prog(t, 0.3, 0.7)), 30) : [0, 0];
    headNum(g, x + sh[0], hy + sh[1], t < 0.3 ? '54' : '51', t, 0.0, { color: t < 0.3 ? '#8dffc8' : '#ff8a7a' });
    floater(g, x + 120, hy, '-3', t, 0.3, '#ff5a5a');
  });
} });

// s004 "Okay, next, please."  over-the-shoulder: your blurred shoulder, the cashier waves the next customer on
registerShot('s004', { draw(g, t, info) {
  const cam = { z: 1.1, x: -60 };
  const { M } = mall(g, t, cam, { crowd: false });
  const s = V(1.55, 1.6), cx = E.W / 2 + 160;
  layer(g, cam, 1, (g) => {
    rr(g, cx - 260, GY() - 210, 520, 210, 14); g.fillStyle = '#4a2f26'; g.fill(); g.fillStyle = alpha('#ffcf8a', 0.25); g.fillRect(cx - 260, GY() - 210, 520, 8);
    rr(g, cx - 90, GY() - 330, 180, 120, 12); g.fillStyle = '#2a3a56'; g.fill(); glow(g, cx, GY() - 270, 120, '#8fd0ff', 0.25);
    drawToon(g, { x: cx, y: GY() - 120, s, facing: -1, cast: CASHIER, pose: posesAt(t, [[0, 'stand'], [0.25, 'wave']]), expr: 'tired',
      talk: talkAmount(info.globalT, info.shot.start, info.shot.end), blink: blink(t, 2.6), rim: rimW(M), shadow: false });
  });
  blurLayer(g, 18, (g) => drawToon(g, { x: E.W * 0.12, y: E.H * 1.35, s: V(4.2, 4.4), facing: 1, cast: HERO, pose: POSES.stand, expr: 'neutral', rim: false, shadow: false }));
} });

// s005 "She never found out."  you walk away through the concourse, the camera tracks with you
registerShot('s005', { draw(g, t, info) {
  const p = t / info.dur, cam = { z: 1.0, x: -260 + 520 * ease.inOut(p) };
  const { M } = mall(g, t, cam);
  const s = V(1.3, 1.4);
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: E.W / 2 - 300 + 600 * p, y: GY(), s, facing: 1, cast: HERO, pose: walkPose(t * 1.6), expr: 'smile', blink: blink(t), rim: rimW(M) });
    drawToon(g, { x: E.W / 2 - 520, y: GY() + 10, s: s * 0.9, facing: -1, cast: STRANGER, pose: breathe(POSES.stand, t), expr: 'neutral', rim: rimW(M) });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// s006 "Nobody did."  a high wide over the busy floor: every shopper carries a soft number, nobody looks at him
registerShot('s006', { draw(g, t, info) {
  const cam = { z: 0.92 + 0.08 * ease.inOut(t / info.dur), x: 40 * Math.sin(t * 0.5), y: -40 };
  const { M } = mall(g, t, cam);
  layer(g, cam, 1, (g) => {
    const xs = [-700, -420, -150, 150, 430, 700];
    xs.forEach((dx, i) => { const x = E.W / 2 + dx, s = V(1.05, 1.1);
      drawToon(g, { x, y: GY() + (i % 2) * 18, s, facing: i % 2 ? -1 : 1, cast: i === 2 ? HERO : SHOPPER(i), pose: i === 2 ? breathe(POSES.stand, t) : walkPose(t * 1.4 + i), expr: i === 2 ? 'worried' : 'neutral', blink: blink(t, 2.7 + i * 0.2), rim: rimW(M) });
      if (i !== 2) headNum(g, x, GY() - 300 * s, ['52', '61', '', '48', '57', '66'][i], t, 0.15 + i * 0.12, { size: 44 }); });
  });
} });

// s007 "It doesn't matter."  close on you: the smile fades into a small, uneasy frown
registerShot('s007', { draw(g, t, info) {
  blurLayer(g, 12, (g) => mall(g, t, { z: 1.3, x: 160, y: -60 })); veil(g, '#120a10', 0.25);
  const M = mood('golden');
  bigToonFace(g, E.W / 2 - 80, E.H * V(0.52, 0.5), V(230, 260) * (1 + 0.03 * t), { cast: HERO, expr: t < 0.5 ? 'smile' : 'sad', look: [0.4, 0.2], blink: blink(t), rimColor: M.rim });
} });

// s008 "People feel it, without knowing why."  FREEZE-FRAME: time stops, cool tint, drifting particles; thin threads link you to
// the people around; each one turns, frowning slightly, without knowing why
registerShot('s008', { draw(g, t, info) {
  const cam = { z: 1.02 + 0.03 * t, x: 0 };
  const { M } = mall(g, t, cam, { mood: 'interiorCool' });
  const s = V(1.25, 1.3), hx = E.W / 2, ppl = [[-560, 'SHOPPER0'], [-300, STRANGER], [320, CASHIER], [580, 'SHOPPER3']];
  layer(g, cam, 1, (g) => {
    ppl.forEach(([dx, c], i) => { const x = hx + dx, cast = typeof c === 'string' ? SHOPPER(+c.slice(-1)) : c;
      const k = prog(t, 0.6 + i * 0.25, 1.1 + i * 0.25);
      g.strokeStyle = alpha('#9fd8ff', 0.5 * k); g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.moveTo(hx, GY() - 250 * s); g.quadraticCurveTo((hx + x) / 2, GY() - 420 * s, x, GY() - 270 * s); g.stroke(); g.setLineDash([]);
      drawToon(g, { x, y: GY(), s, facing: dx < 0 ? 1 : -1, cast, pose: POSES.stand, expr: k > 0.5 ? 'confused' : 'neutral', look: [dx < 0 ? 0.6 : -0.6, 0], rim: { color: '#9fd8ff', dir: [0, -1], w: 3 } }); });
    drawToon(g, { x: hx, y: GY(), s: s * 1.1, facing: 1, cast: HERO, pose: breathe(POSES.stand, t), expr: 'nervous', blink: blink(t), rim: { color: '#9fd8ff', dir: [0, -1], w: 4 } });
  });
  veil(g, '#0a1830', 0.25);
  FX.drops(g, t, { count: 60, color: '#cfe0ff', drift: 2 });
  UI.badge(g, { str: 'FEEL IT', color: '#9fd8ff', size: V(34, 40) });
} });

// s009 "You can't fake it."  a smiling theatre mask slides off his face and cracks as it falls
registerShot('s009', { draw(g, t, info) {
  blurLayer(g, 12, (g) => mall(g, t, { z: 1.3, x: -160, y: -60 })); veil(g, '#120a10', 0.35);
  const M = mood('golden'), cx = E.W / 2, cy = E.H * V(0.5, 0.48), r = V(230, 260);
  bigToonFace(g, cx, cy, r, { cast: HERO, expr: 'tired', blink: blink(t), rimColor: M.rim });
  const drop = ease.in(prog(t, 0.4, 1.2)), crack = t > 1.0;
  g.save(); g.translate(cx, cy + drop * E.H * 0.9); g.rotate(drop * 0.6);
  g.fillStyle = '#fbf6ea'; g.strokeStyle = '#1b1424'; g.lineWidth = 8; g.beginPath(); g.ellipse(0, 0, r * 0.95, r * 1.05, 0, 0, Math.PI * 2); g.fill(); g.stroke();
  g.lineWidth = 10; g.beginPath(); g.arc(-r * 0.35, -r * 0.15, r * 0.16, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.beginPath(); g.arc(r * 0.35, -r * 0.15, r * 0.16, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  g.beginPath(); g.arc(0, r * 0.2, r * 0.42, 0.25, Math.PI - 0.25); g.stroke();
  if (crack) { g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.beginPath(); g.moveTo(-r * 0.1, -r); g.lineTo(r * 0.05, -r * 0.4); g.lineTo(-r * 0.12, r * 0.1); g.lineTo(r * 0.08, r * 0.6); g.stroke(); }
  g.restore();
} });

// s010 "You can't buy it."  bills fly at Sam's glowing 41 and bounce off it; the number does not move
registerShot('s010', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0 };
  const { M } = mall(g, t, cam, { mood: 'dusk' });
  const s = V(1.6, 1.6), x = E.W / 2 + 120, hy = GY() - 300 * s;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x, y: GY(), s, facing: -1, cast: { skin: '#b9825a', hair: 'curly', hairColor: '#1d1410', top: '#4fb286', topDark: '#2f7a5a', legs: '#3a4a6a', shoes: '#f4f4f4', eyes: 'dark' }, pose: breathe(POSES.stand, t), expr: 'neutral', blink: blink(t), rim: rimW(M) });
    headNum(g, x, hy, '41', t, 0.0, { color: '#ffd400', size: 70 });
    for (let i = 0; i < 5; i++) { const t0 = 0.2 + i * 0.25, p = prog(t, t0, t0 + 0.5), q = prog(t, t0 + 0.5, t0 + 1.3); if (p <= 0) continue;
      const bx = lerp(-200, x - 80, ease.in(p)) + q * (-260 - i * 40), by = lerp(hy - 200 + i * 30, hy, p) + q * q * 600;
      g.save(); g.translate(bx, by); g.rotate(-0.4 + q * 3 + i); rr(g, -60, -26, 120, 52, 6); g.fillStyle = '#8fd18f'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 4; g.stroke();
      circle(g, 0, 0, 14, '#6bb56b'); g.restore(); }
  });
} });

// s011 "You can't perform it."  a small stage, one spotlight: he bows, the audience silhouettes stand and leave; the light closes
registerShot('s011', { draw(g, t, info) {
  const p = t / info.dur;
  g.fillStyle = '#0d0a14'; g.fillRect(0, 0, E.W, E.H);
  const floorY = E.H * 0.72;
  g.fillStyle = '#2a1820'; g.fillRect(0, floorY, E.W, E.H - floorY); g.fillStyle = '#5a2a30'; rr(g, -40, 40, E.W * 0.18, floorY - 40, 30); g.fill(); rr(g, E.W * 0.86, 40, E.W * 0.2, floorY - 40, 30); g.fill();
  const spot = 1 - ease.in(prog(t, info.dur - 0.9, info.dur));
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffe9b0', 0.18 * spot); g.beginPath(); g.moveTo(E.W / 2 - 60, 0); g.lineTo(E.W / 2 + 60, 0); g.lineTo(E.W / 2 + 260, floorY + 40); g.lineTo(E.W / 2 - 260, floorY + 40); g.closePath(); g.fill(); g.restore();
  FX.pool(g, E.W / 2, floorY + 30, 280, 46, '#ffe9b0', 0.5 * spot);
  drawToon(g, { x: E.W / 2, y: floorY + 20, s: V(1.6, 1.7), facing: 1, cast: HERO, pose: posesAt(t, [[0, 'stand'], [0.3, 'cheer'], [1.2, 'sad']]), expr: t < 1.2 ? 'happy' : 'sad', blink: blink(t), rim: { color: '#ffe9b0', dir: [0, -1], w: 4 }, alpha: 0.3 + 0.7 * spot });
  for (let i = 0; i < 9; i++) { const x = E.W * (0.08 + i * 0.105), leave = ease.inOut(prog(t, 0.8 + i * 0.12, 1.6 + i * 0.12));
    g.fillStyle = '#05040a'; circle(g, x + leave * (i < 4 ? -300 : 300), E.H * 0.9 - 70 - leave * 40, 34, '#05040a'); rr(g, x - 46 + leave * (i < 4 ? -300 : 300), E.H * 0.9 - 40 - leave * 40, 92, 140, 30); g.fill(); }
} });
