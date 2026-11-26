// V06 Clip 13: beautiful pens, nothing is stopping you, no clink, the chair comes back.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { slapLines, noteWall, fairyLights } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, morning, nightRoom, bed, jar, popIn, note, rug, sideTable, tableTop, folder, chair } from '/engine/v06.js';

function pens(g, x, y, s, up) { g.save(); g.translate(x, y); g.scale(s, s); box(g, -400, -40, 800, 230, '#2a1a22', 26); ['#e0442c', '#f2862a', '#ffd23a', '#7ac04a', '#2fb0a0', '#3a78d0', '#6a52c8', '#c052a8'].forEach((c, i) => { const py = -20 - up * (30 + (i % 2) * 26); box(g, -345 + i * 90, py, 56, 170, c, 22); g.beginPath(); g.moveTo(-345 + i * 90, py + 6); g.lineTo(-317 + i * 90, py - 56); g.lineTo(-289 + i * 90, py + 6); g.closePath(); g.fillStyle = '#f4d8a8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); }); g.restore(); }

// a: beautiful pens. incredible pens.
reg('a', { draw(g, t, info) { const t2 = at(info, 'incredible', 1.4); cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.22, 0.5, 0.55], () => { tableTop(g, t, '#3a2a62', '#120a28'); glow(g, 960, 640, 620, '#fff2b0', 0.45); pens(g, 960, 690, 1 + 0.12 * ease.outBack(prog(t, t2, t2 + 0.3)), ease.out(prog(t, 0, 0.8)));
    for (let i = 0; i < 12; i++) D.star(g, 480 + i * 90, 310 + (i % 3) * 90, 0.32 * (0.6 + 0.4 * Math.sin(t * 6 + i)), { t }); if (t > t2) slapLines(g, 960, 640, prog(t, t2, t2 + 0.5), 480); }); vig(g, 0.45); } });

// b: the folder stays under the bed
reg('b', { draw(g, t, info) { cam(g, t, info.dur, [1.1, 0.5, 0.65], [1.35, 0.45, 0.76], () => { nightRoom(g, t, { lamp: 0.4 }); bed(g, 860, 960, '#4a8ab0'); veil(g, '#05080e', 0.3); box(g, 520, 885, 700, 90, '#120a10', 20, 0); folder(g, 780, 940, 0.34); sideTable(g, 1450, 975, 260, 200); D.mug(g, 1450, 775, 0.7, {});
    for (let i = 0; i < 16; i++) circle(g, 540 + ((i * 97) % 640), 890 + ((i * 37) % 70), 3, alpha('#fff0c0', 0.3 + 0.3 * Math.sin(t * 2 + i))); }); vig(g, 0.65); } });

// c: and the strange part?
reg('c', { draw(g, t, info) { morning(g, t); sideTable(g, 330, 975, 280, 200); D.mug(g, 330, 775, 0.8, { t }); veil(g, '#12243a', 0.2); cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.18, 0.5, 0.45], () => bigToonFace(g, 960, 590, 270, { cast: HERO, expr: 'curious', t, look: [0.5, -0.2] })); vig(g, 0.45); } });

// d: nothing is stopping you from washing, exercising, cleaning
reg('d', { draw(g, t, info) { const ts = [at(info, 'washing', 1.3) - 0.35, at(info, 'exercising', 2.8) - 0.35, at(info, 'cleaning', 4.1) - 0.25];
  cam(g, t, info.dur, [1.0, 0.5, 0.52], [1.1, 0.5, 0.52], () => { morning(g, t, { frames: false, window: false, shelf: false }); const card = (x, k, label, fn) => popIn(g, x, 520, k, 0, () => { box(g, -250, -300, 500, 600, '#fffaf0', 36); box(g, -250, -300, 500, 110, '#4a8ab0', 36); text(g, label, 0, -244, { size: 54, color: '#fff' }); fn(); });
    card(390, prog(t, ts[0], ts[0] + 0.3), 'SHEETS', () => { box(g, -160, -40, 320, 220, '#e8ecf4', 40); circle(g, 0, 70, 80, '#6ac0e8'); for (let i = 0; i < 6; i++) circle(g, Math.sin(t * 4 + i) * 60, 70 + Math.cos(t * 4 + i) * 50, 14, '#ffffff'); });
    card(960, prog(t, ts[1], ts[1] + 0.3), 'EXERCISE', () => { for (const d of [-1, 1]) box(g, d * 130 - 40, -50, 80, 180, '#3a3e52', 24); box(g, -110, 20, 220, 40, '#c8ccd8', 16); D.sneaker(g, 0, 250, 0.9, {}); });
    card(1530, prog(t, ts[2], ts[2] + 0.3), 'CLEAN', () => { const a = Math.sin(t * 5) * 0.2; g.save(); g.translate(0, -70); g.rotate(a); seg(g, [[0, 0], [0, 220]], 24, '#a8744a'); box(g, -80, 200, 160, 90, '#ffcf4a', 20); g.restore(); }); });
  vig(g, 0.25); } });

// e: you just don't.
reg('e', { draw(g, t, info) { morning(g, t); box(g, 1230, 700, 480, 200, '#4a8a8a', 60); box(g, 1260, 900, 36, 80, '#3a2a20', 8); box(g, 1650, 900, 36, 80, '#3a2a20', 8); D.plant(g, 1790, 975, 1.1, { kind: 'tall', t }); rug(g, 960, 1010, 460); cam(g, t, info.dur, [1.05, 0.5, 0.55], [1.18, 0.5, 0.55], () => drawToon(g, { x: 960, y: 985, s: 2.65, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.2, expr: 'bored' })); vig(g, 0.4); } });

// f: no note for those things anymore. no square of paper. no clink.
reg('f', { draw(g, t, info) { const a = at(info, 'little', 2.8) - 0.4, b = at(info, 'clink', 4.5) - 0.35; const i = t >= b ? 2 : t >= a ? 1 : 0, u = t - [0, a, b][i];
  tableTop(g, t, '#1d4a56', '#081a22');
  cam(g, u, 1.8, [1.0, 0.5, 0.5], [1.1, 0.5, 0.5], () => { if (i === 2) jar(g, 960, 920, 1.25, 12); else { g.setLineDash([34, 26]); g.strokeStyle = '#ffe27a'; g.lineWidth = 12; g.strokeRect(i ? 830 : 760, i ? 400 : 340, i ? 260 : 400, i ? 260 : 400); g.setLineDash([]); }
    const k = ease.outBack(prog(u, 0.25, 0.55)); if (k > 0) D.cross(g, 960, i === 2 ? 640 : 540, 2.6 * k, {}); });
  popIn(g, 960, 170, prog(u, 0.05, 0.3), -0.03, () => hw(g, ['no note', 'no paper', 'no clink'][i], 0, 40, 150, '#fff3d6')); vig(g, 0.55); } });

// g: you stopped doing things unless the wall clapped for you
reg('g', { draw(g, t, info) { const tc = at(info, 'wall', 3.6) - 0.2; cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.16, 0.55, 0.5], () => { noteWall(g, t, { lamp: t > tc ? 1 : 0.5 }); veil(g, '#06101a', t > tc ? 0 : 0.35); rug(g, 960, 1015, 470);
    drawToon(g, { x: 520, y: 985, s: 2.55, cast: HERO, actions: [[0, 'idle'], [tc, 'bow']], t, facing: 1, yaw: 0.6, expr: t < tc ? 'bored' : 'relieved', look: [0.8, -0.2] }); sideTable(g, 1560, 975, 300, 180); jar(g, 1560, 795, 0.45, 12);
    if (t > tc) { const clap = Math.abs(Math.sin((t - tc) * 12)); for (const d of [-1, 1]) { const x = 1120 + d * (40 + clap * 120); g.save(); g.translate(x, 470); g.rotate(d * 0.25); box(g, -50, -90, 100, 180, '#ffd64a', 44); for (let i = 0; i < 4; i++) box(g, -48 + i * 25, -150, 24, 80, '#ffd64a', 12, 5); g.restore(); } if (clap < 0.3) slapLines(g, 1120, 450, 0.5, 190); popIn(g, 1120, 200, prog(t, tc, tc + 0.3), -0.08, () => hw(g, 'clap! clap!', 0, 30, 120, '#ffe27a', 10)); } }); vig(g, 0.5); } });

// h: your bedroom starts looking familiar again
reg('h', { draw(g, t, info) { const p = ease.inOut(prog(t, 0, info.dur)); g.save(); g.translate(lerp(100, -100, p), 0); morning(g, t); veil(g, '#4a3a4a', 0.22 * p); bed(g, 700, 950, '#8a98a0'); const r = rng(8); const n = 3 + Math.floor(p * 16); for (let i = 0; i < n; i++) { g.save(); g.translate(150 + r() * 1650, 955 + r() * 60); g.rotate(r() * 2 - 1); box(g, -80, -30, 160, 60, ['#4a78b8', '#e8704a', '#5ab0a0', '#f4efe6'][i % 4], 28); g.restore(); } chair(g, 1450, 975, 0.75, t, 0); D.mug(g, 1180, 975, 0.7, {}); D.sneaker(g, 1770, 985, 0.9, {}); g.restore(); vig(g, 0.35); } });

// i: the chair has eaten three more shirts. it looks pleased.
reg('i', { draw(g, t, info) { const t3 = at(info, 'three', 1.2) - 0.2, tl = at(info, 'looks', 3.3) - 0.15; const n = t < t3 ? 0 : Math.min(3, 1 + Math.floor((t - t3) / 0.35));
  cam(g, t, info.dur, [1.02, 0.52, 0.55], [1.3, 0.55, 0.5], () => { morning(g, t, { frames: false }); veil(g, '#1a0a2a', 0.3); glow(g, 1060, 560, 600, '#b86aff', 0.25); chair(g, 1060, 975, 1.35, t, 1, n);
    for (let i = 0; i < 3; i++) { const k = prog(t, t3 + i * 0.35 - 0.3, t3 + i * 0.35); if (k > 0 && k < 1) { g.save(); g.translate(lerp(1800, 1060, k), lerp(300, 780, k) - Math.sin(k * Math.PI) * 150); g.rotate(k * 6); box(g, -70, -50, 140, 100, ['#c052a8', '#7ac04a', '#e0442c'][i], 30); g.restore(); } }
    if (t > tl) { for (let i = 0; i < 5; i++) D.heart(g, 760 + i * 150, 330 + (i % 2) * 70 - (t - tl) * 40, 0.35 * ease.outBack(prog(t, tl + i * 0.07, tl + 0.35 + i * 0.07)), { t }); }
    drawToon(g, { x: 330, y: 985, s: 2.2, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.6, expr: t < tl ? 'worried' : 'deadpan', look: [0.8, 0] }); }); vig(g, 0.5); } });
