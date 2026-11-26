// V06 Clip 5: something specific -> Day 1 bed sheets, Day 2 water vs phone, Day 3 the chair that stopped being furniture.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { note, slapLines, frameArt, shelfBoard, sideTable, rug, INK } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';

const W = () => E.W, H = () => E.H;
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const hw = (g, s, x, y, size, color = '#33231c') => text(g, s, x, y, { size, color, family: 'Caveat', weight: 700 });
const at = (info, word, dflt) => { const w = E.words.find((w) => w.start >= info.shot.start - 0.15 && w.start <= info.shot.end && w.word.toLowerCase().replace(/[^a-z]/g, '') === word); return w ? w.start - info.shot.start : dflt; };

// sunny morning bedroom: window, frames, shelf, plant, wooden floor
function morning(g, t, o = {}) { grad(g, [[0, '#ffdca8'], [0.8, '#fff0d4'], [1, '#fff0d4']]); for (let x = -W(); x < W() * 2; x += 150) { g.fillStyle = 'rgba(232,150,90,.07)'; g.fillRect(x, -H(), 70, H() * 2); }
  box(g, 140, 130, 400, 400, '#8fd0f4', 18, 10); circle(g, 420, 240, 62, '#ffe27a'); glow(g, 420, 240, 420, '#fff6c8', 0.6); for (let i = 0; i < 2; i++) circle(g, 230 + ((t * 12 + i * 190) % 250), 390 - i * 100, 34, '#ffffff'); seg(g, [[340, 130], [340, 530]], 12, '#fff'); seg(g, [[140, 330], [540, 330]], 12, '#fff'); box(g, 100, 120, 70, 440, '#e8704a', 30); box(g, 510, 120, 70, 440, '#e8704a', 30);
  if (o.frames !== false) { frameArt(g, 860, 280, 170, 210, 2); frameArt(g, 1070, 320, 130, 160, 0); }
  shelfBoard(g, 1590, 400, 420); D.bookStack(g, 1500, 400, 0.75, {}); D.plant(g, 1690, 400, 0.7, { kind: 'leafy', t });
  g.fillStyle = '#c8905e'; g.fillRect(-W(), H() * 0.87, W() * 3, H()); seg(g, [[-W(), H() * 0.87], [W() * 2, H() * 0.87]], 8, INK); for (let i = -2; i < 12; i++) seg(g, [[i * 200, H() * 0.87], [i * 200 - 90, H()]], 3, alpha(INK, 0.25)); }
// bed with a sheet that can be pulled off (k 0..1)
function bed(g, x, y, k = 0, sheet = '#9ab0b8') { box(g, x - 420, y - 360, 70, 360, '#8a5636', 28); box(g, x - 390, y - 180, 760, 120, '#f4efe6', 30); box(g, x - 350, y - 255, 200, 100, '#ffffff', 46);
  if (k < 1) { g.save(); g.translate(k * 380, -Math.sin(k * Math.PI) * 120); g.rotate(k * 0.25); box(g, x - 170 + k * 120, y - 200, 560 * (1 - k * 0.45), 180, sheet, 60); circle(g, x + 40, y - 120, 30, alpha('#7a6a40', 0.5)); circle(g, x + 200, y - 90, 18, alpha('#7a6a40', 0.45)); g.restore(); }
  box(g, x - 410, y - 70, 820, 80, '#6a3f28', 20); for (const d of [-370, 340]) box(g, x + d, y, 40, 50, '#4a2a1a', 8); }
// day card hung top-right
function dayCard(g, n, k, x = 1640, y = 640) { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(0.05); const s = ease.outBack(clamp(k)); g.scale(s, s); box(g, -130, -130, 260, 260, '#fffaf0', 22); box(g, -130, -130, 260, 70, '#e8643c', 22); text(g, 'DAY', 0, -93, { size: 44, color: '#fffaf0' }); text(g, String(n), 0, 40, { size: 150, color: INK }); g.restore(); }
function jar(g, x, y, s, n) { g.save(); g.translate(x, y); g.scale(s, s); for (let i = 0; i < n; i++) note(g, -100 + (i % 4) * 70, -55 - Math.floor(i / 4) * 80, 0.26, { rot: ((i * 7) % 5 - 2) * 0.18 }); rr(g, -200, -400, 400, 400, 66); g.fillStyle = 'rgba(190,235,250,.25)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); box(g, -165, -445, 330, 56, 'rgba(190,235,250,.5)', 16); seg(g, [[-160, -330], [-160, -100]], 18, 'rgba(255,255,255,.8)'); g.restore(); }
// close table: glass of water and the phone
function glass(g, x, y, s, fill) { g.save(); g.translate(x, y); g.scale(s, s); const w = 150, h = 250; if (fill > 0.02) { box(g, -w / 2 + 10, -h * fill, w - 20, h * fill - 8, '#6ac8f0', 20, 0); } rr(g, -w / 2, -h, w, h, 26); g.fillStyle = 'rgba(220,245,255,.28)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); seg(g, [[-w / 2 + 24, -h + 36], [-w / 2 + 24, -60]], 12, 'rgba(255,255,255,.85)'); g.restore(); }

// a: something specific, something you can actually do
reg('a', { draw(g, t, info) { cam(g, t, info.dur, [1.15, 0.42, 0.5], [1.0, 0.5, 0.5], () => { morning(g, t); rug(g, 1000, 1000, 440, '#3f9a8a'); note(g, 1200, 520, 0.95, { rot: -0.04, text: ['something', 'real'], k: prog(t, 0.6, 2.6), size: 70 }); sideTable(g, 330, 975, 320, 190); D.mug(g, 330, 785, 0.75, { t });
    drawToon(g, { x: 760, y: 975, s: 2.5, cast: HERO, actions: [[0, 'think'], [2.2, 'idle']], t, facing: 1, yaw: 0.5, expr: t < 2.2 ? 'focused' : 'hopeful', look: [0.7, -0.1] }); D.backpack(g, 1620, 975, 1.0, {}); });
  motes(g, t, '#ffffff', 16); vig(g, 0.25); } });

// b: you look around your bedroom. this shouldn't be difficult
reg('b', { draw(g, t, info) { const td = at(info, 'this', 1.7); const p = ease.inOut(prog(t, 0, info.dur));
  g.save(); g.translate(lerp(120, -120, p), 0); morning(g, t, { frames: true }); bed(g, 700, 950, 0); const r = rng(8); for (let i = 0; i < 9; i++) { g.save(); g.translate(1180 + r() * 520, 960 - r() * 40); g.rotate(r() * 2 - 1); box(g, -80, -30, 160, 60, ['#4a78b8', '#e8704a', '#5ab0a0', '#f4efe6'][i % 4], 28); g.restore(); } D.sneaker(g, 1750, 985, 1.0, {}); D.mug(g, 1250, 940, 0.7, {}); D.bottle(g, 1400, 970, 0.7, {});
  drawToon(g, { x: 1520, y: 985, s: 2.4, cast: HERO, actions: [[0, 'idle'], [td, 'shrug']], t, facing: -1, yaw: 0.4, expr: t < td ? 'curious' : 'smugAside', look: [t < td ? Math.sin(t * 4) : 0, 0] }); g.restore();
  motes(g, t, '#ffffff', 16); vig(g, 0.25); } });

// c: day one. wash the bed sheets
reg('c', { draw(g, t, info) { const tw = at(info, 'wash', 1.0);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.45, 0.56], () => { morning(g, t); const k = ease.inOut(prog(t, tw + 0.4, tw + 1.6)); bed(g, 760, 960, k);
    box(g, 1560, 760, 220, 210, '#c8a060', 30); for (let i = 1; i < 5; i++) seg(g, [[1560 + i * 44, 775], [1560 + i * 44, 955]], 5, alpha(INK, 0.4)); if (k > 0.8) box(g, 1550, 720, 240, 80, '#9ab0b8', 40);
    drawToon(g, { x: 1290, y: 975, s: 2.45, cast: HERO, actions: [[0, 'idle'], [tw + 0.2, 'reach'], [tw + 1.7, 'handsHips']], t, facing: -1, yaw: 0.6, expr: t < tw + 1.7 ? 'determined' : 'confident' }); });
  dayCard(g, 1, prog(t, 0.05, 0.4), 1650, 220); motes(g, t, '#ffffff', 14); vig(g, 0.25); } });

// d: avoiding it for a month
reg('d', { draw(g, t, info) { cam(g, t, info.dur, [1.18, 0.45, 0.55], [1.04, 0.5, 0.5], () => { morning(g, t); bed(g, 720, 960, 0, '#8a98a0');
    for (let i = 0; i < 3; i++) { g.strokeStyle = alpha('#6a8a3a', 0.65); g.lineWidth = 10; g.beginPath(); const x = 640 + i * 150; g.moveTo(x, 720); for (let j = 1; j <= 8; j++) g.lineTo(x + Math.sin(j * 1.3 + t * 4 + i) * 26, 720 - j * 30); g.stroke(); }
    box(g, 1180, 150, 520, 520, '#fffaf0', 26); box(g, 1180, 150, 520, 100, '#7a6a8a', 26); text(g, 'LAST MONTH', 1440, 203, { size: 48, color: '#fffaf0' }); const n = Math.floor(prog(t, 0.1, 1.4) * 30);
    for (let i = 0; i < 30; i++) { const x = 1230 + (i % 6) * 84, y = 300 + Math.floor(i / 6) * 72; box(g, x - 28, y - 26, 56, 52, '#eee6d8', 8, 3); if (i < n) { seg(g, [[x - 18, y - 16], [x + 18, y + 16]], 8, '#d0342a'); seg(g, [[x + 18, y - 16], [x - 18, y + 16]], 8, '#d0342a'); } } D.sneaker(g, 1500, 975, 1.0, {}); });
  vig(g, 0.35); } });

// e: it takes an hour. and when you're done
reg('e', { draw(g, t, info) { const td = at(info, 'done', 2.3);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.15, 0.55, 0.5], () => { morning(g, t, { frames: false }); bed(g, 720, 960, 0, '#f4a85a'); const h = ease.inOut(prog(t, 0.1, 1.3));
    circle(g, 960, 270, 140, INK); circle(g, 960, 270, 126, '#fffaf0'); g.beginPath(); g.moveTo(960, 270); g.arc(960, 270, 110, -Math.PI / 2, -Math.PI / 2 + h * Math.PI * 2); g.closePath(); g.fillStyle = alpha('#3f9a8a', 0.55); g.fill(); seg(g, [[960, 270], [960 + Math.sin(h * 6.283) * 100, 270 - Math.cos(h * 6.283) * 100]], 12, INK); circle(g, 960, 270, 12, INK);
    if (t > td - 0.1) { for (let i = 0; i < 7; i++) D.star(g, 440 + i * 100, 690 + Math.sin(i * 2) * 50, 0.4 * ease.outBack(prog(t, td - 0.1 + i * 0.04, td + 0.3 + i * 0.04)), { t }); }
    drawToon(g, { x: 1400, y: 975, s: 2.45, cast: HERO, actions: [[0, 'reach'], [td - 0.2, 'handsHips']], t, facing: -1, yaw: 0.55, expr: t < td ? 'focused' : 'relieved' }); D.plant(g, 1760, 975, 1.1, { kind: 'tall', t }); });
  vig(g, 0.25); } });

// f: clink. that's surprisingly satisfying
reg('f', { draw(g, t, info) { const ts = at(info, 'thats', 1.0);
  if (t < ts) { cam(g, t, ts, [1.1, 0.5, 0.55], [1.2, 0.5, 0.55], () => { grad(g, [[0, '#17606a'], [1, '#0a2a32']]); glow(g, 960, 480, 760, '#ffd98a', 0.35); g.fillStyle = '#a8704a'; g.fillRect(-W(), 920, W() * 3, H()); seg(g, [[-W(), 920], [W() * 2, 920]], 8, INK); D.plant(g, 300, 920, 1.4, { kind: 'leafy', t }); D.bookStack(g, 1580, 925, 1.3, {}); D.mug(g, 560, 930, 1.0, { t });
      const q = ease.in(prog(t, 0, 0.32)); jar(g, 960, 920, 1.25, q >= 1 ? 1 : 0); if (q < 1) note(g, 960, lerp(60, 830, q), 0.32, { rot: q * 5 }); else { slapLines(g, 960, 760, prog(t, 0.32, 0.8), 250); const c = ease.outBack(prog(t, 0.32, 0.6)); g.save(); g.translate(960, 230); g.rotate(-0.08); g.scale(c, c); hw(g, 'clink!', 0, 0, 190, '#ffe27a'); g.restore(); } }); }
  else { const u = t - ts; grad(g, [[0, '#ffc878'], [1, '#e8785a']]); glow(g, 960, 420, 800, '#fff0c0', 0.5); D.plant(g, 260, 1040, 1.4, { kind: 'tall', t }); jar(g, 1630, 1030, 0.75, 1); D.alarmClock(g, 480, 1040, 1.1, { t }); for (let i = 0; i < 9; i++) D.star(g, 200 + i * 200, 180 + (i % 3) * 90, 0.35 + 0.1 * Math.sin(t * 5 + i), { t });
    cam(g, u, info.dur - ts, [1.0, 0.5, 0.5], [1.15, 0.5, 0.45], () => bigToonFace(g, 960, 560, 270, { cast: HERO, expr: u < 0.5 ? 'surprised' : 'relieved', t })); }
  vig(g, 0.4); } });

// g: day two. drink water before touching your phone
reg('g', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.55], () => { morning(g, t); sideTable(g, 960, 975, 900, 260); glass(g, 780, 715, 1.15, prog(t, 0.9, 1.7)); D.phone(g, 1160, 560, 0.52, { screen: 'lock', time: '7:02', date: 'Day 2', note: '14 new', t, rot: 0.06 }); D.bottle(g, 600, 715, 1.0, {}); D.alarmClock(g, 1340, 715, 0.8, { t });
    drawToon(g, { x: 1610, y: 975, s: 2.35, cast: HERO, actions: [[0, 'idle'], [1.2, 'reach']], t, facing: -1, yaw: 0.6, expr: 'sleepy', look: [0.8, 0.3] }); D.backpack(g, 250, 975, 1.0, {}); });
  dayCard(g, 2, prog(t, 0.05, 0.4), 1650, 220); vig(g, 0.25); } });

// h: you stare at the phone. the phone stares back.
reg('h', { draw(g, t, info) { const tb = at(info, 'stares', 2.4) - 0.25; const left = t < tb;
  g.save(); grad(g, [[0, '#ffb86a'], [1, '#c8604a']]); D.plant(g, 150, 1060, 1.3, { kind: 'leafy', t }); g.restore();
  if (left) cam(g, t, tb, [1.0, 0.5, 0.45], [1.25, 0.5, 0.42], () => { glow(g, 960, 460, 700, '#fff0c0', 0.35); D.mug(g, 330, 1000, 1.2, {}); glass(g, 1620, 1020, 1.3, 1); bigToonFace(g, 960, 560, 280, { cast: HERO, expr: 'suspicious', t, look: [0, 0.35] }); });
  else { const u = t - tb; grad(g, [[0, '#223a6a'], [1, '#0a1228']]); glow(g, 960, 500, 700, '#7ac8ff', 0.35); D.bookStack(g, 330, 1020, 1.2, {}); glass(g, 1630, 1020, 1.3, 1); cam(g, u, info.dur - tb, [1.0, 0.5, 0.5], [1.22, 0.5, 0.45], () => { box(g, 680, 90, 560, 940, '#141218', 80, 10); box(g, 715, 150, 490, 820, '#2a4a8a', 44, 5);
      for (const d of [-1, 1]) { const cx = 960 + d * 110, bl = u > 1.0 && u < 1.12 ? 0.1 : 1; g.beginPath(); g.ellipse(cx, 430, 80, 95 * bl, 0, 0, 7); g.fillStyle = '#fffdf6'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); if (bl === 1) circle(g, cx - d * 8, 445, 30, INK); seg(g, [[cx - 80, 290 + d * -22], [cx + 80, 290 + d * 22]], 20, INK); }
      seg(g, [[850, 650], [1070, 650]], 16, INK); const b = ease.outBack(prog(u, 0.4, 0.7)); circle(g, 1180, 170, 56 * b, '#e0342a'); if (b > 0.2) text(g, '14', 1180, 174, { size: 52 * b, color: '#fff' }); }); }
  vig(g, 0.45); } });

// i: you drink. clink.
reg('i', { draw(g, t, info) { const tc = at(info, 'clink', 1.2);
  cam(g, t, info.dur, [1.08, 0.5, 0.5], [1.0, 0.5, 0.5], () => { morning(g, t); sideTable(g, 520, 975, 460, 240); D.phone(g, 430, 730, 0.28, { screen: 'off', rot: 1.4, t }); glass(g, 620, 735, 0.9, 1 - prog(t, 0.2, 1.0));
    drawToon(g, { x: 1030, y: 975, s: 2.55, cast: HERO, actions: [[0, 'reach'], [0.4, 'handsHips']], t, facing: -1, yaw: 0.55, expr: t < tc ? 'determined' : 'confident' });
    jar(g, 1540, 975, 0.85, t > tc ? 2 : 1); if (t > tc) { slapLines(g, 1540, 780, prog(t, tc, tc + 0.45), 190); const c = ease.outBack(prog(t, tc, tc + 0.3)); g.save(); g.translate(1540, 520); g.scale(c, c); hw(g, 'clink!', 0, 0, 130, '#c8502a'); g.restore(); } });
  vig(g, 0.25); } });

// the chair under its pile; alive 0..1 gives it eyes and a mouth
function chair(g, x, y, s, t, alive = 0) { g.save(); g.translate(x, y); g.scale(s, s); box(g, -170, -520, 40, 520, '#8a5636', 18); box(g, 130, -300, 40, 300, '#8a5636', 18); box(g, -190, -320, 380, 56, '#a8704a', 18); const br = 1 + Math.sin(t * 3) * 0.025 * alive; g.save(); g.translate(0, -320); g.scale(br, br * (1 + alive * 0.12));
  const heap = [[-120, -50, 130, '#4a78b8'], [80, -60, 150, '#e8704a'], [-30, -150, 150, '#5ab0a0'], [90, -190, 100, '#d8d0c0'], [-90, -230, 100, '#8a5ac0'], [10, -270, 90, '#f2c14a']]; for (const [dx, dy, r, c] of heap) { g.beginPath(); g.ellipse(dx, dy, r, r * 0.62, dx * 0.002, 0, 7); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); }
  box(g, -250, -40, 90, 200, '#4a78b8', 40); box(g, 175, -90, 80, 170, '#e8704a', 36);
  if (alive > 0) { for (const d of [-1, 1]) { circle(g, d * 62, -170, 40 * alive, '#fffdf6'); g.strokeStyle = INK; g.lineWidth = 7; g.beginPath(); g.arc(d * 62, -170, 40 * alive, 0, 7); g.stroke(); circle(g, d * 62 + Math.sin(t * 2) * 8, -166, 15 * alive, INK); }
    g.beginPath(); g.ellipse(0, -70, 90 * alive, (30 + Math.abs(Math.sin(t * 6)) * 22) * alive, 0, 0, 7); g.fillStyle = '#3a1418'; g.fill(); g.stroke(); for (let i = -2; i <= 2; i++) box(g, i * 30 - 10, -100 * alive - 2, 20, 24 * alive, '#fffaf0', 6, 3); } g.restore(); g.restore(); }

// j: day three. clear the chair. you know the chair.
reg('j', { draw(g, t, info) { const tk = at(info, 'know', 2.9);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [t > tk - 1 ? 1.2 : 1.1, 0.56, 0.52], () => { morning(g, t); chair(g, 1180, 975, 1.15, t, 0); D.sneaker(g, 1520, 985, 0.9, {}); D.mug(g, 900, 975, 0.7, {}); D.backpack(g, 1700, 975, 0.9, {});
    drawToon(g, { x: 520, y: 975, s: 2.5, cast: HERO, actions: [[0, 'idle'], [1.7, 'point'], [tk, 'crossArms']], t, facing: 1, yaw: 0.6, expr: t < tk ? 'determined' : 'worried', look: [0.8, 0] }); });
  dayCard(g, 3, prog(t, 0.05, 0.4), 1650, 220); vig(g, 0.3); } });

// k: the one that stopped being furniture sometime last summer
reg('k', { draw(g, t, info) { const a = ease.outBack(prog(t, 0.5, 1.1)), ts = at(info, 'summer', 2.9);
  const sh = Math.exp(-Math.max(0, t - 0.5) * 5) * Math.sin(t * 60) * (t > 0.5 ? 10 : 0);
  cam(g, t, info.dur, [1.05, 0.52, 0.55], [1.3, 0.55, 0.48], () => { g.translate(sh, 0); morning(g, t, { frames: false }); veil(g, '#1a0a2a', 0.45 * prog(t, 0.3, 1.0)); glow(g, 1080, 560, 600, '#b86aff', 0.3 * prog(t, 0.5, 1.2)); chair(g, 1080, 975, 1.35, t, clamp(a));
    if (t > ts - 0.2) { const k = ease.outBack(prog(t, ts - 0.2, ts + 0.15)); g.save(); g.translate(1560, 360); g.rotate(0.08); g.scale(k, k); box(g, -190, -85, 380, 170, '#fffaf0', 22); circle(g, -115, 0, 42, '#ffcf3a'); text(g, 'SUMMER', 50, 4, { size: 50, color: INK }); g.restore(); }
    D.sneaker(g, 1600, 985, 0.9, {}); drawToon(g, { x: 340, y: 975, s: 2.2, cast: HERO, actions: [[0, 'idle'], [0.7, 'recoil']], t, facing: 1, yaw: 0.6, expr: t < 0.7 ? 'worried' : 'shocked', look: [0.8, 0] }); });
  vig(g, 0.55); } });
