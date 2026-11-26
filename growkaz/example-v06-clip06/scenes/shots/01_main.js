// V06 Clip 6: bottom of the pile, "a mountain", the feeling that becomes a problem, days 4-6.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { slapLines, noteWall, clockOn } from '/engine/notewall.js';
import { place, floorY } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, morning, nightRoom, bed, jar, dayCard, tableTop, popIn, note, rug, sideTable } from '/engine/v06.js';

function sock(g) { g.beginPath(); g.moveTo(-60, -130); g.lineTo(40, -130); g.lineTo(46, 20); g.quadraticCurveTo(150, 40, 140, 100); g.quadraticCurveTo(100, 150, 0, 110); g.quadraticCurveTo(-70, 80, -66, 10); g.closePath(); g.fillStyle = '#f4efe6'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); for (let i = 0; i < 3; i++) box(g, -62, -120 + i * 36, 100, 18, '#d0442c', 4, 0); }
function charger(g) { g.strokeStyle = INK; g.lineWidth = 30; g.beginPath(); g.moveTo(-40, 20); g.bezierCurveTo(-200, 130, 40, 200, 80, 90); g.bezierCurveTo(110, 20, 200, 40, 180, 120); g.stroke(); g.strokeStyle = '#e8ecf4'; g.lineWidth = 16; g.stroke(); box(g, -90, -110, 130, 140, '#e8ecf4', 26); for (const d of [-56, -6]) box(g, d, -150, 18, 44, '#b8c0cc', 6, 5); }
function sandwich(g) { const tri = (dy, c) => { g.beginPath(); g.moveTo(-150, 60 + dy); g.lineTo(130, 60 + dy); g.lineTo(-30, -100 + dy); g.closePath(); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); }; tri(50, '#d8a45a'); box(g, -160, 70, 300, 24, '#6aaa4a', 10, 5); tri(0, '#f0d08a'); circle(g, -50, 10, 20, '#7a9a4a'); circle(g, 30, 30, 13, '#6a8a3a'); }

// a: sock, charger, half a sandwich
reg('a', { draw(g, t, info) { const tt = [at(info, 'sock', 2.1) - 0.2, at(info, 'charger', 2.8), at(info, 'sandwich', 5.4) - 0.15];
  cam(g, t, info.dur, [1.15, 0.5, 0.55], [1.0, 0.5, 0.5], () => { morning(g, t, { frames: false }); const r = rng(5); for (let i = 0; i < 10; i++) { g.save(); g.translate(i < 5 ? 80 + r() * 260 : 1580 + r() * 280, 930 + r() * 50); g.rotate(r() * 2 - 1); box(g, -110, -45, 220, 90, ['#4a78b8', '#e8704a', '#5ab0a0', '#8a5ac0'][i % 4], 40); g.restore(); }
    [[sock, 510, 'sock'], [charger, 960, 'charger x3'], [sandwich, 1410, '???']].forEach(([f, x, label], i) => { popIn(g, x, 640, prog(t, tt[i], tt[i] + 0.3), (i - 1) * 0.06, () => { circle(g, 0, 0, 215, '#fffaf0'); g.strokeStyle = INK; g.lineWidth = 9; g.beginPath(); g.arc(0, 0, 215, 0, 7); g.stroke(); f(g); box(g, -150, 190, 300, 86, '#ffd64a', 18); hw(g, label, 0, 252, 62); }); });
    if (t > tt[2]) for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#5a7a2a', 0.7); g.lineWidth = 9; g.beginPath(); const x = 1330 + i * 80; g.moveTo(x, 420); for (let j = 1; j <= 6; j++) g.lineTo(x + Math.sin(j * 1.3 + t * 5 + i) * 22, 420 - j * 30); g.stroke(); } });
  vig(g, 0.35); } });

// b: clink
reg('b', { draw(g, t, info) { cam(g, t, info.dur, [1.12, 0.5, 0.55], [1.22, 0.5, 0.55], () => { tableTop(g, t); const q = ease.in(prog(t, 0, 0.18)); jar(g, 960, 920, 1.25, q >= 1 ? 3 : 2); if (q < 1) note(g, 1030, lerp(200, 780, q), 0.32, { rot: q * 5 }); slapLines(g, 960, 760, prog(t, 0.18, 0.7), 250); popIn(g, 960, 230, prog(t, 0.18, 0.42), -0.08, () => hw(g, 'clink!', 0, 0, 190, '#ffe27a')); }); vig(g, 0.4); } });

// c: breathing like someone who just climbed a mountain
reg('c', { draw(g, t, info) { const tm = at(info, 'climbed', 3.5) - 0.2; const m = ease.inOut(prog(t, tm, tm + 0.5));
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.15, 0.5, 0.48], () => { morning(g, t); rug(g, 960, 1005, 440, '#3f9a8a'); bed(g, 430, 960, '#4a8ab0'); D.plant(g, 1760, 965, 1.2, { kind: 'tall', t }); D.sneaker(g, 1500, 975, 0.9, {});
    if (m > 0) { g.save(); g.globalAlpha = m; grad(g, [[0, '#8fd0f4'], [1, '#e8f6ff']]); const tri = (x, y, w, h, c) => { g.beginPath(); g.moveTo(x - w, y); g.lineTo(x, y - h); g.lineTo(x + w, y); g.closePath(); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); g.beginPath(); g.moveTo(x - w * 0.22, y - h * 0.78); g.lineTo(x, y - h); g.lineTo(x + w * 0.22, y - h * 0.78); g.lineTo(x + w * 0.07, y - h * 0.72); g.lineTo(x - w * 0.06, y - h * 0.8); g.closePath(); g.fillStyle = '#fff'; g.fill(); }; tri(400, 1100, 520, 620, '#5a7a9a'); tri(1600, 1100, 560, 560, '#4a6a8a'); tri(960, 1180, 760, 460, '#6a8a6a'); for (let i = 0; i < 4; i++) circle(g, (i * 520 + t * 60) % 2100 - 80, 200 + (i % 2) * 130, 60, '#ffffff'); g.restore(); }
    const y = lerp(975, 725, m); drawToon(g, { x: 960, y: y + Math.sin(t * 7) * 6, s: 2.45, cast: HERO, actions: [[0, 'idle'], [0.6, 'handsHips']], t, facing: 1, yaw: 0.2, expr: t < tm ? 'tired' : 'confident' });
    if (m > 0.6) { seg(g, [[1130, y], [1130, y - 380]], 16, INK); g.beginPath(); g.moveTo(1130, y - 380); g.quadraticCurveTo(1230, y - 360 + Math.sin(t * 8) * 20, 1320, y - 330); g.lineTo(1130, y - 280); g.closePath(); g.fillStyle = '#ffd64a'; g.fill(); g.stroke(); } });
  vig(g, 0.25); } });

// d: it's only a bedroom, but it feels like progress
reg('d', { draw(g, t, info) { const tp = at(info, 'feels', 2.4);
  cam(g, t, info.dur, [1.16, 0.45, 0.55], [1.0, 0.5, 0.5], () => { morning(g, t); rug(g, 960, 1005, 460, '#c8604a'); bed(g, 720, 960, '#4a8ab0'); sideTable(g, 1330, 975, 250, 200); D.deskLamp(g, 1330, 775, 0.7, {}); D.plant(g, 1730, 975, 1.1, { kind: 'leafy', t });
    drawToon(g, { x: 1550, y: 985, s: 2.3, cast: HERO, actions: [[0, 'idle'], [tp, 'handsHips']], t, facing: -1, yaw: 0.45, expr: t < tp ? 'relieved' : 'excited' });
    popIn(g, 1000, 180, prog(t, tp - 0.1, tp + 0.25), 0, () => { box(g, -330, -62, 660, 124, '#fffaf0', 62); const k = ease.out(prog(t, tp, info.dur - 0.2)); box(g, -300, -32, 60 + 540 * k, 64, '#3aaa6a', 32, 0); });
    for (let i = 0; i < 6; i++) D.star(g, 430 + i * 220, 300 + (i % 2) * 80, 0.3 * prog(t, tp + i * 0.08, tp + 0.4 + i * 0.08), { t }); });
  vig(g, 0.25); } });

// e: and that feeling is about to become a problem
reg('e', { draw(g, t, info) { const tp = at(info, 'problem', 3.4) - 0.1; const d = prog(t, 0.6, info.dur - 0.5);
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.45, 0.5, 0.58], () => { tableTop(g, t, '#2a4a52', '#0a161e'); veil(g, '#12000e', 0.55 * d); jar(g, 960, 920, 1.15, 3); glow(g, 960, 700, 560, '#ff5a2a', 0.45 * d);
    drawToon(g, { x: 1500, y: 1180, s: 2.8, cast: HERO, action: 'idle', t, facing: -1, yaw: 0.65, expr: t < tp ? 'hopeful' : 'smugAside', look: [0.8, 0.1] }); });
  if (t > tp) veil(g, '#ff2a10', 0.16 * Math.exp(-(t - tp) * 4)); vig(g, 0.65); } });

// f: day four, cook real food (supermarket)
reg('f', { draw(g, t, info) { const f = floorY('supermarket'); cam(g, t, info.dur, [1.14, 0.5, 0.55], [1.0, 0.5, 0.5], () => { place(g, 'supermarket', t, { look: 'mint' });
    drawToon(g, { x: lerp(420, 900, ease.out(prog(t, 0, 1.6))), y: f + 30, s: 2.55, cast: HERO, actions: [[0, 'walk'], [1.6, 'idle']], t, facing: 1, yaw: 0.55, expr: 'confident' }); D.bag(g, lerp(560, 1040, ease.out(prog(t, 0, 1.6))), f - 90, 0.9, {}); });
  dayCard(g, 4, prog(t, 0.05, 0.4)); vig(g, 0.25); } });

// food plate that looks like wet cardboard
function plate(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.beginPath(); g.ellipse(0, 0, 330, 120, 0, 0, 7); g.fillStyle = '#fffaf0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); box(g, -170, -90, 220, 110, '#b89064', 22); seg(g, [[-150, -40], [30, -52]], 6, '#8a6a44'); seg(g, [[-140, -5], [20, -18]], 6, '#8a6a44'); circle(g, 120, -35, 55, '#7aa86a'); circle(g, 180, 5, 40, '#8ab87a'); circle(g, 70, 30, 30, '#e8a04a'); g.restore(); }

// g: you photograph it from three different angles
reg('g', { draw(g, t, info) { const t3 = at(info, 'three', 1.4); const shots = [t3 - 0.5, t3, t3 + 0.55]; const i = t >= shots[2] ? 2 : t >= shots[1] ? 1 : 0; const rot = [-0.12, 0.1, -0.02][i], zm = [1.0, 1.18, 1.35][i];
  tableTop(g, t, '#e8a05a', '#8a4a3a'); D.bottle(g, 1470, 940, 1.1, {}); cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.1, 0.5, 0.55], () => { g.save(); g.translate(960, 720); g.rotate(rot); g.scale(zm, zm); plate(g, 0, 0, 1, t); g.restore(); });
  g.strokeStyle = '#fffaf0'; g.lineWidth = 12; for (const [x, y, dx, dy] of [[420, 330, 1, 1], [1500, 330, -1, 1], [420, 930, 1, -1], [1500, 930, -1, -1]]) seg(g, [[x, y + dy * 100], [x, y], [x + dx * 100, y]], 12, '#fffaf0');
  for (const s of shots) if (t >= s && t < s + 0.2) veil(g, '#ffffff', 0.75 * (1 - (t - s) / 0.2)); text(g, String(i + 1) + '/3', 960, 180, { size: 90, color: '#fffaf0', stroke: 12, strokeColor: INK }); vig(g, 0.3); } });

// h: tastes like wet cardboard. still proud.
reg('h', { draw(g, t, info) { const tp = at(info, 'still', 2.3);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.48], () => { morning(g, t, { shelf: true }); sideTable(g, 1180, 975, 760, 270); plate(g, 1080, 690, 0.8, t); D.glass(g, 1420, 705, 0.9, { fill: 0.6 }); D.plant(g, 1760, 975, 1.0, { kind: 'round', t });
    drawToon(g, { x: 480, y: 985, s: 2.6, cast: HERO, actions: [[0, 'idle'], [tp, 'handsHips']], t, facing: 1, yaw: 0.55, expr: t < tp ? 'disgusted' : 'confident', look: [0.6, 0] });
    if (t < tp) popIn(g, 780, 260, prog(t, 0.5, 0.85), -0.05, () => { box(g, -190, -150, 380, 300, '#c89a64', 18); seg(g, [[-190, -60], [190, -60]], 8, '#8a6a44'); box(g, -40, -150, 80, 300, '#e0bc84', 0, 5); for (let k = 0; k < 4; k++) circle(g, -120 + k * 80, 190 + ((t * 120 + k * 30) % 70), 12, '#6ac0f0'); }); else popIn(g, 800, 260, prog(t, tp, tp + 0.3), 0.08, () => { D.trophy(g, 0, 140, 1.3, { t }); }); });
  vig(g, 0.25); } });

// i: day five, walk twenty minutes
reg('i', { draw(g, t, info) { const f = floorY('street'); const p = prog(t, 0, info.dur); place(g, 'street', t * 2.2, { look: 'mint' }); D.bike(g, 1620 - p * 260, f + 40, 1.0, {});
  drawToon(g, { x: lerp(480, 1050, p), y: f + 60, s: 2.5, cast: HERO, action: 'walk', t, facing: 1, expr: 'friendly' });
  popIn(g, 430, 250, prog(t, 0.5, 0.8), -0.04, () => { circle(g, 0, 0, 140, '#fffaf0'); g.strokeStyle = INK; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 140, 0, 7); g.stroke(); const k = ease.inOut(prog(t, 0.8, info.dur - 0.2)); g.strokeStyle = '#3aaa6a'; g.lineWidth = 26; g.beginPath(); g.arc(0, 0, 112, -Math.PI / 2, -Math.PI / 2 + k * 2.09); g.stroke(); text(g, String(Math.round(k * 20)), 0, -8, { size: 100, color: INK }); hw(g, 'min', 0, 72, 50); });
  dayCard(g, 5, prog(t, 0.05, 0.4)); vig(g, 0.25); } });

// j: day six. go to bed early.
reg('j', { draw(g, t, info) { const tb = at(info, 'bed', 1.5);
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.16, 0.42, 0.6], () => { nightRoom(g, t, { lamp: t < tb ? 1 : 0.4 }); clockOn(g, 1180, 260, 100, 9, 30); bed(g, 720, 960, '#4a8ab0', () => drawToon(g, { x: 520, y: 1000, s: 2.1, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: t < tb ? 'sleepy' : 'sleeping' })); sideTable(g, 1360, 975, 250, 200); D.alarmClock(g, 1360, 775, 0.7, { t });
    for (let i = 0; i < 3; i++) { const k = (t * 0.5 + i / 3) % 1; text(g, 'z', 620 + k * 200 + i * 20, 560 - k * 260, { size: 50 + k * 60, color: alpha('#bfe4ff', 1 - k) }); } });
  dayCard(g, 6, prog(t, 0.05, 0.4)); vig(g, 0.5); } });
