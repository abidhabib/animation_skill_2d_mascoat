// V06 Clip 14: the escape plan: night bus, deep bin, it's back (banana), paint, poster, turned bed.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, hand, slapLines } from '/engine/notewall.js';
import { place, floorY } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, nightRoom, morning, bed, jar, dayCard, popIn, note, rug, sideTable } from '/engine/v06.js';

function bin(g, x, y, s = 1, lid = 0) { g.save(); g.translate(x, y); g.scale(s, s); box(g, -140, -330, 280, 330, '#3f8a72', 30); for (let i = -1; i <= 1; i++) seg(g, [[i * 70, -280], [i * 70, -50]], 12, '#2c6452'); g.save(); g.translate(-150, -340); g.rotate(-1.5 * (1 - lid)); box(g, 0, -44, 300, 52, '#2c6452', 20); box(g, 115, -72, 70, 32, '#2c6452', 12); g.restore(); g.restore(); }
function banana(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); for (const [a, l] of [[2.4, 120], [1.55, 140], [0.75, 115]]) { g.beginPath(); g.moveTo(-26, 0); g.quadraticCurveTo(Math.cos(a) * l * 0.5 - 20, Math.sin(a) * l * 0.5 + 20, Math.cos(a) * l, Math.sin(a) * l); g.quadraticCurveTo(Math.cos(a) * l * 0.4 + 30, Math.sin(a) * l * 0.4, 26, 0); g.closePath(); g.fillStyle = '#ffe04a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); } box(g, -22, -34, 44, 44, '#8a6a22', 12); g.restore(); }
const stink = (g, t, x, y) => { for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#c8d84a', 0.75); g.lineWidth = 9; g.beginPath(); const xx = x + i * 80; g.moveTo(xx, y); for (let j = 1; j <= 6; j++) g.lineTo(xx + Math.sin(j * 1.3 + t * 5 + i) * 22, y - j * 28); g.stroke(); } };
function wallRoom(g, t) { noteWall(g, t); rug(g, 960, 1015, 470); sideTable(g, 330, 975, 300, 180); D.mug(g, 330, 795, 0.7, { t }); D.backpack(g, 1620, 975, 0.9, {}); }

// a: day eighteen. you've had enough.
reg('a', { draw(g, t, info) { const tn = at(info, 'enough', 1.9) - 0.2; nightRoom(g, t); note(g, 1580, 420, 0.65, { rot: -0.05, text: ['take the', 'folder'], size: 66, age: 1 }); veil(g, '#1a0604', 0.25 * prog(t, tn, tn + 0.3)); cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.22, 0.5, 0.45], () => bigToonFace(g, 960, 590, 270, { cast: HERO, expr: t < tn ? 'tired' : 'furious', t, look: [0.7, -0.2] })); dayCard(g, 18, prog(t, 0.05, 0.35), 260, 220); vig(g, 0.55); } });

// b: you peel the note off the wall
reg('b', { draw(g, t, info) { cam(g, t, info.dur, [1.05, 0.55, 0.5], [1.18, 0.56, 0.46], () => { wallRoom(g, t); const p = ease.inOut(prog(t, 0.25, 0.9)); const nx = lerp(1160, 1480, p), ny = lerp(470, 640, p);
    drawToon(g, { x: 660, y: 985, s: 2.55, cast: HERO, action: 'reach', t, facing: 1, yaw: 0.65, expr: 'determined', look: [0.8, -0.1] }); note(g, nx, ny, 0.85, { rot: -0.04 + p * 0.45, curl: 0.15 + p * 0.25, age: 1, text: ['take the', 'folder'], size: 66 }); hand(g, nx + 100, ny + 110, [330, 520], { s: 0.9 }); }); vig(g, 0.5); } });

// c: take a bus to the very last stop
reg('c', { draw(g, t, info) { const f = floorY('busNight'), tl = at(info, 'last', 1.3) - 0.25; cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.15, 0.46, 0.55], () => { place(g, 'busNight', t, { look: 'neon' }); drawToon(g, { x: 860, y: f + 10, s: 2.35, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: 'determined' }); note(g, 1040, f - 260 + Math.sin(t * 9) * 4, 0.34, { rot: 0.2, age: 1 });
    popIn(g, 960, 150, prog(t, tl, tl + 0.3), 0, () => { box(g, -330, -62, 660, 124, '#141218', 20); text(g, 'LAST STOP', 0, 5, { size: 72, color: '#ffb03c' }); }); }); vig(g, 0.5); } });

// d: drop it into a public bin. a deep bin. with a lid.
reg('d', { draw(g, t, info) { const td = at(info, 'drop', 0.2) + 0.2, tdeep = at(info, 'deep', 2.4) - 0.1, tl = at(info, 'lid', 4.2) - 0.1;
  const sh = t > tl ? Math.exp(-(t - tl) * 8) * Math.sin(t * 70) * 14 : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [t > tdeep ? 1.3 : 1.12, 0.58, 0.6], () => { g.translate(sh, 0); place(g, 'street', t, { look: 'rain' }); veil(g, '#050a1c', 0.4); const y = 960; const q = ease.in(prog(t, td, td + 0.7)); const lid = ease.in(prog(t, tl - 0.15, tl));
    drawToon(g, { x: 700, y, s: 2.5, cast: HERO, actions: [[0, 'reach'], [tdeep, 'idle'], [tl - 0.3, 'push']], t, facing: 1, yaw: 0.65, expr: t < tl ? 'determined' : 'smugAside' });
    if (q < 1) note(g, lerp(920, 1180, q), lerp(620, 660, q) - Math.sin(q * Math.PI) * 190, 0.38 * (1 - q * 0.4), { rot: q * 5, age: 1 }); bin(g, 1180, y, 1.15, lid);
    if (t > tdeep && t < tl - 0.2) popIn(g, 1470, 560, prog(t, tdeep, tdeep + 0.3), 0, () => { seg(g, [[0, -180], [0, 180]], 12, '#fff3d6'); seg(g, [[-40, -180], [40, -180]], 12, '#fff3d6'); seg(g, [[-40, 180], [40, 180]], 12, '#fff3d6'); hw(g, 'deep', 150, 20, 100, '#fff3d6', 10); }); if (t > tl) slapLines(g, 1180, 560, prog(t, tl, tl + 0.45), 220); }); vig(g, 0.55); } });

// e: you travel forty minutes home feeling like a free man
reg('e', { draw(g, t, info) { const f = floorY('busNight'); cam(g, t, info.dur, [1.16, 0.46, 0.55], [1.0, 0.5, 0.5], () => { place(g, 'busNight', t * 1.3, { look: 'neon' }); drawToon(g, { x: 880, y: f + 10, s: 2.35, cast: HERO, action: 'sit', t, facing: -1, yaw: 0.4, expr: 'joy' });
    for (let i = 0; i < 4; i++) { const p = (t * 0.55 + i * 0.25) % 1; text(g, '♪', 1050 + i * 130, 520 - p * 260, { size: 80, color: alpha('#ffe27a', 1 - p) }); } popIn(g, 330, 190, prog(t, 0.4, 0.7), -0.04, () => { box(g, -200, -80, 400, 160, '#fffaf0', 30); text(g, '40 min', 0, 6, { size: 84, color: INK }); }); }); vig(g, 0.4); } });

// f: it's back. and now it smells like banana.
reg('f', { draw(g, t, info) { const tb = at(info, 'back', 0.5) - 0.2, tn = at(info, 'banana', 2.3) - 0.2; const sh = t > tb ? Math.exp(-(t - tb) * 8) * Math.sin(t * 80) * 16 : 0;
  cam(g, t, info.dur, [1.0, 0.55, 0.5], [1.22, 0.58, 0.48], () => { g.translate(sh, 0); wallRoom(g, t); if (t > tb) { note(g, 1140, 460, 1.0 * lerp(1.8, 1, ease.in(prog(t, tb, tb + 0.14))), { rot: -0.05, age: 1, text: ['take the', 'folder'], size: 66 }); slapLines(g, 1140, 460, prog(t, tb + 0.12, tb + 0.5), 250); banana(g, 1270, 340, ease.outBack(prog(t, tb + 0.3, tb + 0.6))); stink(g, t, 1040, 270); }
    drawToon(g, { x: 560, y: 985, s: 2.55, cast: HERO, actions: [[0, 'walk'], [tb, 'recoil']], t, facing: 1, yaw: 0.6, expr: t < tb ? 'relieved' : t < tn ? 'shocked' : 'disgusted', look: [0.8, -0.1] }); }); vig(g, 0.5); } });

// g: you paint over it. the paint slides off.
reg('g', { draw(g, t, info) { const ts = at(info, 'slides', 1.7) - 0.3; const paint = ease.inOut(prog(t, 0.1, 1.0)), slide = ease.in(prog(t, ts, ts + 1.1));
  cam(g, t, info.dur, [1.05, 0.55, 0.5], [1.18, 0.55, 0.55], () => { wallRoom(g, t); note(g, 1140, 470, 1.05, { rot: -0.05, age: 1, text: ['take the', 'folder'], size: 66 }); if (paint > 0) { g.save(); g.translate(0, slide * 520); g.globalAlpha = 1 - clamp(slide * 1.2 - 0.3); box(g, 930, 260, 420 * paint, 420, '#1d5560', 60, 0); for (let i = 0; i < 6; i++) box(g, 950 + i * 65, 640, 34, 60 + slide * 150 * ((i % 3) + 1) * 0.5, '#1d5560', 17, 0); g.restore(); }
    const rx = 930 + 420 * paint; if (t < 1.1) { seg(g, [[rx, 460], [rx + 180, 760]], 22, '#a8744a'); box(g, rx - 40, 300, 80, 280, '#2a6a78', 36); }
    drawToon(g, { x: 560, y: 985, s: 2.5, cast: HERO, actions: [[0, 'reach'], [1.1, 'idle']], t, facing: 1, yaw: 0.65, expr: t < ts ? 'focused' : 'annoyed' }); box(g, 760, 880, 120, 100, '#d8dce8', 16); box(g, 760, 874, 120, 26, '#1d5560', 10, 5); }); vig(g, 0.5); } });

// h: you cover it with a poster. one yellow corner sticks out, deliberately annoying you.
reg('h', { draw(g, t, info) { const to = at(info, 'one', 1.4) - 0.1, ta = at(info, 'annoying', 4.4) - 0.5;
  cam(g, t, info.dur, [1.0, 0.55, 0.5], [t > to ? 1.4 : 1.15, 0.62, 0.55], () => { wallRoom(g, t); const k = ease.out(prog(t, 0.1, 0.8)); const wig = t > to ? Math.sin(t * 10) * 0.08 : 0;
    g.save(); g.translate(1330, 700); g.rotate(0.5 + wig); box(g, -90, -90, 180, 180, '#ffd64a', 8); g.restore(); const py = lerp(-500, 460, k); box(g, 880, py - 270, 520, 540, '#e8704a', 16); circle(g, 1140, py - 60, 110, '#ffe27a'); hw(g, 'stay positive!', 1140, py + 170, 76, '#fffaf0'); for (const d of [-1, 1]) box(g, 1140 + d * 230 - 45, py - 288, 90, 40, 'rgba(255,250,224,.85)', 6, 3);
    if (t > to) { g.save(); g.translate(1405, 735); g.rotate(0.35 + wig); box(g, -45, -45, 90, 90, '#ffd64a', 8); g.restore(); } if (t > ta) popIn(g, 1560, 560, prog(t, ta, ta + 0.3), 0.1, () => hw(g, 'psst.', 0, 20, 100, '#ffe27a', 10));
    drawToon(g, { x: 500, y: 985, s: 2.5, cast: HERO, actions: [[0, 'idle'], [to, 'crossArms']], t, facing: 1, yaw: 0.6, expr: t < to ? 'confident' : t < ta ? 'suspicious' : 'annoyed', look: [0.9, 0.1] }); }); vig(g, 0.5); } });

// i: day nineteen. you turn your bed around so you don't have to look at it.
reg('i', { draw(g, t, info) { const tt = at(info, 'turn', 1.2) - 0.1; const k = ease.inOut(prog(t, tt, tt + 1.1)); const sc = Math.cos(k * Math.PI);
  cam(g, t, info.dur, [1.12, 0.5, 0.55], [1.0, 0.5, 0.5], () => { nightRoom(g, t, { lamp: 0.5 }); note(g, 1380, 440, 0.55, { rot: -0.05, age: 1 });
    g.save(); g.translate(760, 960); g.scale(Math.abs(sc) < 0.12 ? 0.12 : sc, 1); g.translate(-760, -960); bed(g, 760, 960, '#4a8ab0', k >= 1 ? () => drawToon(g, { x: 560, y: 1000, s: 2.0, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.5, expr: 'tired', look: [0, 0.2] }) : null); g.restore();
    if (k < 1) drawToon(g, { x: 1450, y: 985, s: 2.4, cast: HERO, actions: [[0, 'idle'], [tt - 0.2, 'push']], t, facing: -1, yaw: 0.65, expr: 'determined' }); sideTable(g, 1760, 975, 220, 190); D.alarmClock(g, 1760, 785, 0.65, { t }); });
  dayCard(g, 19, prog(t, 0.05, 0.35), 260, 220); vig(g, 0.6); } });
