// V06 Clip 8: days 9-12, the sock engineer, everything is working... so why isn't it enough?
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { slapLines, fairyLights } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, morning, nightRoom, bed, jar, dayCard, tableTop, popIn, note, rug, sideTable } from '/engine/v06.js';

// a: answer the old message
reg('a', { draw(g, t, info) { cam(g, t, info.dur, [1.05, 0.5, 0.5], [1.15, 0.5, 0.48], () => { morning(g, t); sideTable(g, 960, 975, 700, 240); D.phone(g, 960, 560, 0.85, { screen: 'chat', name: 'old friend', msgs: t > 0.8 ? ['you ok?', 'yes! sorry, hi'] : ['you ok?'], t }); D.mug(g, 720, 735, 0.8, { t }); D.bottle(g, 1220, 735, 0.8, {}); if (t > 0.9) D.tick(g, 1330, 440, 1.6 * ease.outBack(prog(t, 0.9, 1.2)), {}); }); dayCard(g, 9, 1, 1650, 640); vig(g, 0.25); } });

// b: day ten, cancel the subscription
reg('b', { draw(g, t, info) { const tc = at(info, 'cancel', 1.0);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.5], () => { tableTop(g, t, '#5a3a72', '#1c1030'); D.laptop(g, 960, 920, 3.4, {}); box(g, 700, 340, 520, 380, '#fffaf0', 24); box(g, 700, 340, 520, 86, '#8a5ac0', 24); text(g, 'APP+  never opened', 960, 386, { size: 40, color: '#fff' }); text(g, '$9 / month', 960, 500, { size: 66, color: INK });
    const press = t > tc + 0.4; box(g, 790, press ? 580 : 568, 340, 100, press ? '#3aaa6a' : '#e0442c', 50); text(g, press ? 'CANCELLED' : 'CANCEL', 960, press ? 632 : 620, { size: 50, color: '#fff' });
    const k = ease.out(prog(t, tc - 0.3, tc + 0.4)); const cx = lerp(1600, 1080, k), cy = lerp(900, 640, k); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 22, cy + 96); g.lineTo(cx + 44, cy + 68); g.lineTo(cx + 90, cy + 70); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); if (press) slapLines(g, 960, 630, prog(t, tc + 0.4, tc + 0.85), 250); });
  dayCard(g, 10, prog(t, 0.05, 0.35)); vig(g, 0.4); } });

// desk drawn from the front; wob = wobble angle
function deskFront(g, x, y, wob, t) { g.save(); g.translate(x - 330, y); g.rotate(wob); g.translate(-(x - 330), -y); box(g, x - 360, y - 330, 720, 50, '#a8704a', 14); box(g, x - 320, y - 280, 36, 280, '#7a4a30', 8); box(g, x + 284, y - 280, 36, wob ? 262 : 262, '#7a4a30', 8); D.mug(g, x + 180, y - 330, 0.8, { t }); D.bookStack(g, x - 190, y - 330, 0.8, {}); D.deskLamp(g, x + 20, y - 330, 0.8, {}); g.restore(); }
// c: day eleven, fix the wobbly desk with a bus ticket
reg('c', { draw(g, t, info) { const tf = at(info, 'fix', 1.2), tin = tf + 1.0; const wob = t < tin ? Math.sin(t * 14) * 0.022 : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.2, 0.55, 0.65], () => { morning(g, t, { frames: false }); deskFront(g, 1050, 975, wob, t);
    const k = ease.inOut(prog(t, tf, tin)); const x = lerp(1650, 1352, k), y = lerp(760, 968, k); g.save(); g.translate(x, y); g.rotate((1 - k) * -0.4); box(g, -70, -22, 140, 40, '#ffd64a', 8, 5); text(g, 'BUS', 0, 0, { size: 28, color: INK }); g.restore(); if (t > tin) { slapLines(g, 1352, 968, prog(t, tin, tin + 0.4), 110); D.tick(g, 1500, 560, 1.4 * ease.outBack(prog(t, tin, tin + 0.3)), {}); }
    drawToon(g, { x: 450, y: 985, s: 2.5, cast: HERO, actions: [[0, 'idle'], [tf, 'crouch'], [tin + 0.2, 'handsHips']], t, facing: 1, yaw: 0.6, expr: t < tin ? 'focused' : 'confident' }); });
  dayCard(g, 11, prog(t, 0.05, 0.35), 250, 220); vig(g, 0.25); } });

// d: you're basically an engineer now
reg('d', { draw(g, t, info) { grad(g, [[0, '#2a5a8a'], [1, '#12283a']]); g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 3; for (let x = 0; x < 2000; x += 90) seg(g, [[x, 0], [x, 1080]], 3, 'rgba(255,255,255,.12)'); for (let y = 0; y < 1100; y += 90) seg(g, [[0, y], [1920, y]], 3, 'rgba(255,255,255,.12)'); deskFront(g, 380, 1050, 0, t); D.briefcase(g, 1580, 1040, 1.5, {}); popIn(g, 1580, 300, prog(t, 0.5, 0.8), 0.08, () => { box(g, -190, -120, 380, 240, '#fffaf0', 24); D.trophy(g, -90, 70, 0.9, { t }); hw(g, 'Eng.', 80, 30, 80); });
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.5, 0.45], () => { bigToonFace(g, 960, 600, 260, { cast: HERO, expr: 'confident', t }); popIn(g, 960, 285, prog(t, 0.2, 0.55), -0.05, () => { g.beginPath(); g.arc(0, 40, 220, Math.PI, 0); g.closePath(); g.fillStyle = '#ffc82a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); box(g, -260, 24, 520, 56, '#ffc82a', 28, 9); box(g, -36, -188, 72, 214, '#ffda5a', 28, 8); }); });
  vig(g, 0.4); } });

// socks sorted by colour
function sock(g, x, y, c, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); g.moveTo(-34, -80); g.lineTo(28, -80); g.lineTo(32, 14); g.quadraticCurveTo(92, 26, 84, 62); g.quadraticCurveTo(54, 92, 0, 66); g.quadraticCurveTo(-40, 48, -38, 8); g.closePath(); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); box(g, -36, -78, 62, 24, '#fffaf0', 4, 4); g.restore(); }
// e: day twelve, socks by colour
reg('e', { draw(g, t, info) { const ta = at(info, 'arranging', 1.1);
  cam(g, t, info.dur, [1.14, 0.55, 0.55], [1.0, 0.5, 0.5], () => { morning(g, t); box(g, 640, 640, 1160, 320, '#8a5636', 24); box(g, 670, 668, 1100, 210, '#5a3422', 14); const cols = ['#e0442c', '#f2862a', '#ffd23a', '#7ac04a', '#2fb0a0', '#3a78d0', '#6a52c8', '#c052a8'];
    cols.forEach((c, i) => { const k = ease.out(prog(t, ta + i * 0.22, ta + i * 0.22 + 0.5)); const x = lerp(700 + ((i * 397) % 1000), 740 + i * 134, k), y = lerp(520 - ((i * 53) % 200), 770, k); sock(g, x, y, c, (1 - k) * (i - 3.5) * 0.5); });
    drawToon(g, { x: 360, y: 985, s: 2.5, cast: HERO, actions: [[0, 'idle'], [ta, 'reach'], [ta + 2.2, 'think']], t, facing: 1, yaw: 0.6, expr: 'focused', look: [0.8, 0.3] }); });
  dayCard(g, 12, prog(t, 0.05, 0.35)); vig(g, 0.25); } });

// f: using the word "system" in conversations nobody else is in
reg('f', { draw(g, t, info) { const ts = at(info, 'system', 0.2), tn = at(info, 'nobody', 1.4);
  cam(g, t, info.dur, [1.0, 0.45, 0.55], [1.16, 0.5, 0.5], () => { morning(g, t, { frames: true }); box(g, 1180, 640, 460, 240, '#4a8a8a', 60); box(g, 1210, 880, 40, 90, '#3a2a20', 8); box(g, 1570, 880, 40, 90, '#3a2a20', 8); D.plant(g, 1780, 975, 1.4, { kind: 'tall', t }); D.mug(g, 1720, 975, 0.8, {});
    drawToon(g, { x: 560, y: 985, s: 2.6, cast: HERO, actions: [[0, 'explain'], [tn + 1.2, 'idle']], t, facing: 1, yaw: 0.5, expr: t < tn + 1.2 ? 'excited' : 'awkward' });
    popIn(g, 960, 270, prog(t, ts - 0.1, ts + 0.25), -0.04, () => { box(g, -300, -100, 600, 200, '#fffaf0', 100); hw(g, '"my system"', 0, 30, 96); });
    if (t > tn) popIn(g, 1420, 520, prog(t, tn, tn + 0.3), 0, () => hw(g, '...', 0, 0, 150, '#7a5a48')); });
  vig(g, 0.25); } });

// g: room better, sleeping better, jar filling up
reg('g', { draw(g, t, info) { const a = at(info, 'sleeping', 1.5) - 0.3, b = at(info, 'jar', 3.1) - 0.3; const i = t >= b ? 2 : t >= a ? 1 : 0, u = t - [0, a, b][i];
  if (i === 0) cam(g, u, a, [1.0, 0.5, 0.55], [1.12, 0.5, 0.55], () => { morning(g, t); rug(g, 960, 1005, 460, '#3f9a8a'); bed(g, 720, 960, '#4a8ab0'); D.plant(g, 1380, 975, 1.2, { kind: 'leafy', t }); sideTable(g, 1640, 975, 260, 200); D.deskLamp(g, 1640, 775, 0.7, {}); for (let k = 0; k < 6; k++) D.star(g, 380 + k * 240, 620 + (k % 2) * 60, 0.3 + 0.1 * Math.sin(t * 6 + k), { t }); });
  else if (i === 1) cam(g, u, b - a, [1.0, 0.5, 0.55], [1.14, 0.45, 0.6], () => { nightRoom(g, t, { lamp: 0.4 }); bed(g, 720, 960, '#4a8ab0', () => drawToon(g, { x: 520, y: 1000, s: 2.1, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: 'sleeping' })); sideTable(g, 1360, 975, 250, 200); D.alarmClock(g, 1360, 775, 0.7, { t }); for (let k = 0; k < 3; k++) { const p = (t * 0.5 + k / 3) % 1; text(g, 'z', 620 + p * 200 + k * 20, 560 - p * 260, { size: 50 + p * 60, color: alpha('#bfe4ff', 1 - p) }); } });
  else cam(g, u, info.dur - b, [1.0, 0.5, 0.55], [1.18, 0.5, 0.55], () => { tableTop(g, t); const n = 7 + Math.min(4, Math.floor(u * 5)); jar(g, 960, 920, 1.3, n); });
  vig(g, i === 1 ? 0.5 : 0.25); } });

// h: everything is working
reg('h', { draw(g, t, info) { morning(g, t); jar(g, 1650, 960, 0.75, 11); for (let k = 0; k < 5; k++) { const y = 220 + k * 150; popIn(g, 260 + (k % 2) * 90, y, prog(t, 0.1 + k * 0.12, 0.4 + k * 0.12), 0, () => D.tick(g, 0, 0, 1.1, {})); }
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.45], () => bigToonFace(g, 960, 590, 265, { cast: HERO, expr: 'joy', t })); vig(g, 0.25); } });

// i: so why doesn't it feel like enough?
reg('i', { draw(g, t, info) { const d = ease.inOut(prog(t, 0, 1.4));
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.3, 0.55, 0.52], () => { tableTop(g, t, '#2a5a62', '#0a1a22'); jar(g, 1150, 920, 1.15, 11); veil(g, '#02080e', 0.55 * d); glow(g, 1150, 680, 420, '#ffd98a', 0.28 * (1 - d * 0.5)); drawToon(g, { x: 460, y: 1180, s: 2.9, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.65, expr: t < 0.8 ? 'friendly' : 'confused', look: [0.8, 0] }); });
  vig(g, 0.65); } });
