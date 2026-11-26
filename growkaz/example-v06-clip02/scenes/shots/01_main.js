// V06 Clip 2: nine days of avoiding it, the bus-bin flash, then the forty things in your head.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, note, hand, clockOn, INK } from '/engine/notewall.js';
import { place, floorY } from '/engine/places.js';
import { D } from '/engine/props2d.js';

const W = () => E.W, H = () => E.H;
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const hw = (g, s, x, y, size, color = '#33231c') => text(g, s, x, y, { size, color, family: 'Caveat', weight: 700 });
const at = (info, word, dflt) => { const w = E.words.find((w) => w.start >= info.shot.start - 0.15 && w.start <= info.shot.end && w.word.toLowerCase().replace(/[^a-z]/g, '') === word); return w ? w.start - info.shot.start : dflt; };
// a paper slip with a handwritten word, popping in
function slip(g, x, y, s, word, k, rot = 0, col = '#fff4dc') { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); const p = s * ease.outBack(clamp(k)); g.scale(p, p);
  box(g, -150 + 10, -62 + 14, 300, 124, 'rgba(0,0,0,.28)', 18, 0); box(g, -150, -62, 300, 124, col, 18); box(g, -45, -80, 90, 34, 'rgba(255,214,74,.85)', 6, 3); hw(g, word, 0, 6, word.length > 8 ? 68 : 82); g.restore(); }
function lampRoom(g, c = ['#101c3a', '#27345e']) { grad(g, [[0, c[0]], [0.75, c[1]], [1, '#0b1024']]); g.fillStyle = '#3a2420'; g.fillRect(-W(), H() * 0.88, W() * 3, H()); seg(g, [[-W(), H() * 0.88], [W() * 2, H() * 0.88]], 8, INK); }
function bin(g, x, y) { box(g, x - 120, y - 270, 240, 270, '#3f8a72', 26); for (let i = -1; i <= 1; i++) seg(g, [[x + i * 60, y - 230], [x + i * 60, y - 40]], 10, '#2c6452'); }

// a: nine days, calendar pages fly, you look away from the note
reg('a', { draw(g, t, info) { const tn = at(info, 'nine', 0.8), ta = at(info, 'avoid', 3.4); const n = Math.max(1, Math.min(9, 1 + Math.floor(prog(t, tn, ta) * 8.99)));
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.55, 0.5], () => { noteWall(g, t, { lamp: 0.7 }); note(g, 1230, 430, 0.85, { rot: -0.04, curl: 0.12 + n * 0.025, age: n > 5 ? 1 : 0 });
    for (let i = 1; i < n; i++) { const q = prog(t, tn + (i - 1) * ((ta - tn) / 9), tn + (i - 1) * ((ta - tn) / 9) + 0.6); if (q < 1) { g.save(); g.translate(760 - q * 420, 330 + q * q * 760); g.rotate(-q * 2.2); box(g, -110, -120, 220, 240, alpha('#fffaf0', 1 - q * 0.5), 16); g.restore(); } }
    box(g, 640, 190, 240, 270, '#fffaf0', 20); box(g, 640, 190, 240, 70, '#e8643c', 20); text(g, 'DAY', 760, 227, { size: 42, color: '#fffaf0' }); text(g, String(n), 760, 365, { size: 140, color: INK });
    drawToon(g, { x: 360, y: H() * 0.95, s: 2.5, cast: HERO, actions: [[0, 'idle'], [ta - 0.4, 'crossArms']], t, facing: t < ta - 0.4 ? 1 : -1, yaw: 0.55, expr: t < ta - 0.4 ? 'nervous' : 'awkward' }); });
  vig(g, 0.55); } });

// b: the bus across town, just to throw it away
reg('b', { draw(g, t, info) { const tj = at(info, 'just', 2.1), tp = at(info, 'paper', 3.7);
  if (t < tj) { const f = floorY('busNight'); cam(g, t, tj, [1.0, 0.5, 0.5], [1.16, 0.45, 0.58], () => { place(g, 'busNight', t, { look: 'neon' }); drawToon(g, { x: 860, y: f + 10, s: 2.3, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: 'determined' }); note(g, 1030, f - 260 + Math.sin(t * 9) * 4, 0.34, { rot: 0.2, age: 1 }); }); }
  else { const u = t - tj, dur = info.dur - tj; cam(g, u, dur, [1.18, 0.55, 0.55], [1.0, 0.5, 0.5], () => { place(g, 'street', t, { look: 'rain' }); veil(g, '#050a1c', 0.35); const y = H() * 0.88;
      bin(g, 1150, y); drawToon(g, { x: 700, y, s: 2.5, cast: HERO, actions: [[tj, 'idle'], [tj + 0.35, 'reach'], [tp + 0.35, 'handsHips']], t, facing: 1, yaw: 0.65, expr: t < tp + 0.35 ? 'determined' : 'smugAside' });
      const q = ease.in(prog(t, tp - 0.25, tp + 0.3)); if (q < 1) note(g, lerp(900, 1150, q), lerp(y - 360, y - 250, q) - Math.sin(q * Math.PI) * 150, 0.4 * (1 - q * 0.35), { rot: q * 4, age: 1 });
      bin(g, 1150, y + (q >= 1 ? 0 : 0)); if (q >= 1) box(g, 1010, y - 300, 280, 44, '#2c6452', 18); }); }
  vig(g, 0.6); } });

// c: and honestly, you could probably use this
reg('c', { draw(g, t, info) { grad(g, [[0, '#14385a'], [0.7, '#2a6a7a'], [1, '#0c1c30']]); glow(g, W() * 0.3, H() * 0.4, 800, '#9fe8ff', 0.25);
  cam(g, t, info.dur, [1.16, 0.5, 0.46], [1.0, 0.5, 0.5], () => bigToonFace(g, W() / 2, H() * 0.5, 290, { cast: HERO, expr: t < 1.0 ? 'teasing' : 'smugAside', t, look: [0, 0] }));
  if (t < 0.3) veil(g, '#fff2c8', 0.7 * (1 - t / 0.3)); vig(g, 0.55); } });

// d: inside your head, about forty things
reg('d', { draw(g, t, info) { const tf = at(info, 'forty', 3.2), th = at(info, 'head', 1.5); const n = Math.min(40, Math.floor(prog(t, th, tf + 0.4) * 40));
  cam(g, t, info.dur, [1.2, 0.5, 0.45], [1.0, 0.5, 0.5], () => { grad(g, [[0, '#1a1848'], [1, '#090818']]); glow(g, 960, 520, 700, '#8a7aff', 0.28);
    const r = rng(14); for (let i = 0; i < n; i++) { const a = r() * 7 + t * (0.18 + r() * 0.2) * (i % 2 ? 1 : -1), rx = 420 + r() * 460, ry = 230 + r() * 260; note(g, 960 + Math.cos(a) * rx, 540 + Math.sin(a) * ry, 0.2 + r() * 0.08, { rot: Math.sin(t + i) * 0.4 }); }
    bigToonFace(g, 960, 560, 220, { cast: HERO, expr: t < tf ? 'confused' : 'worried', t, look: [Math.sin(t * 2.4), -0.4] });
    if (t > tf) { const k = ease.outBack(prog(t, tf, tf + 0.3)); g.save(); g.translate(960, 150); g.scale(k, k); text(g, '40', 0, 0, { size: 200, color: '#ffd64a', stroke: 18, strokeColor: INK }); g.restore(); } });
  vig(g, 0.55); } });

// e: your sleep. your room. your money.
reg('e', { draw(g, t, info) { const ts = [at(info, 'sleep', 0.4) - 0.25, at(info, 'room', 1.4) - 0.25, at(info, 'money', 2.4) - 0.25]; const i = t >= ts[2] ? 2 : t >= ts[1] ? 1 : 0, u = t - Math.max(0, ts[i]);
  grad(g, [[0, ['#232a66', '#7a4a38', '#1e5a46'][i]], [1, ['#0c0e28', '#2a1612', '#082018'][i]]]); glow(g, 960, 480, 720, ['#9fb0ff', '#ffbe7a', '#8affb8'][i], 0.3);
  cam(g, u, 1.2, [1.0, 0.5, 0.5], [1.1, 0.5, 0.5], () => { if (i === 0) { D.alarmClock(g, 960, 760, 3.2, { ring: true, t }); }
    else if (i === 1) { const r = rng(6); box(g, 560, 700, 800, 90, '#6a3f28', 30); for (let j = 0; j < 14; j++) { g.save(); g.translate(660 + r() * 600, 690 - r() * 210); g.rotate(r() * 3 - 1.5); box(g, -110, -45, 220, 90, ['#4a78b8', '#e8704a', '#f4efe6', '#5ab0a0'][j % 4], 40); g.restore(); } D.sneaker(g, 1420, 800, 1.8, {}); }
    else { D.cash(g, 960, 640, 2.4, { rot: -0.15 }); for (let j = 0; j < 7; j++) { const p = (t * 0.8 + j * 0.14) % 1; D.coin(g, 600 + j * 125, lerp(300, 1150, p), 0.8, { spin: true, t: t + j }); } }
    slip(g, 960, 200, 1.25, ['sleep', 'room', 'money'][i], prog(u, 0.05, 0.3), -0.03); });
  vig(g, 0.5); } });

// f: that message you never answered
reg('f', { draw(g, t, info) { grad(g, [[0, '#26485e'], [1, '#0a1620']]); glow(g, 960, 540, 620, '#8fd8ff', 0.3);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.18, 0.5, 0.46], () => { D.phone(g, 960 + Math.sin(t * 40) * 5 * (t < 0.5 ? 1 : 0), 540, 1.55, { screen: 'lock', time: '2:14', date: '3 weeks ago', note: 'hey, are you free?', t, rot: -0.05 });
    hand(g, 1130, 760, [380, 420], { s: 1.15 }); });
  vig(g, 0.55); } });

// g: that thing you were definitely going to start in January
reg('g', { draw(g, t, info) { const tj = at(info, 'january', 2.4); grad(g, [[0, '#a9c8dc'], [1, '#e6eef4']]); g.fillStyle = '#b89678'; g.fillRect(-W(), H() * 0.82, W() * 3, H()); seg(g, [[-W(), H() * 0.82], [W() * 2, H() * 0.82]], 8, INK);
  cam(g, t, info.dur, [1.14, 0.45, 0.55], [1.0, 0.5, 0.5], () => { D.sneaker(g, 600, 900, 3.2, {}); const r = rng(5); for (let i = 0; i < 40; i++) circle(g, 450 + r() * 330, 640 + r() * 180, 3 + r() * 7, alpha('#8a8478', 0.5));
    g.strokeStyle = alpha(INK, 0.55); g.lineWidth = 3; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(360, 560); g.quadraticCurveTo(450 + i * 30, 640 + i * 6, 480 + i * 55, 560 + i * 45); g.stroke(); }
    const k = ease.outBack(prog(t, tj - 0.2, tj + 0.15)); g.save(); g.translate(1320, 440); g.rotate(0.04); box(g, -270, -280, 540, 560, '#fffaf0', 30); box(g, -270, -280, 540, 130, '#3a6ac0', 30); text(g, 'JANUARY', 0, -213, { size: 72, color: '#fffaf0' });
    for (let i = 0; i < 20; i++) box(g, -225 + (i % 5) * 95, -110 + Math.floor(i / 5) * 88, 66, 62, '#e6ecf4', 10, 3); if (k > 0) { g.strokeStyle = '#d0342a'; g.lineWidth = 14; g.beginPath(); g.ellipse(-192, -79, 62 * k, 54 * k, -0.1, 0, 6.6); g.stroke(); hw(g, 'start!', 60, 215, 100 * k, '#d0342a'); } g.restore(); });
  motes(g, t, '#ffffff', 22); vig(g, 0.3); } });

// h: every night, all forty at once
reg('h', { draw(g, t, info) { const ta = at(info, 'all', 1.5); cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.18, 0.4, 0.58], () => { lampRoom(g); clockOn(g, 1560, 240, 100, 1, 10 + t * 14);
    const y = H() * 0.9; box(g, 260, y - 360, 70, 360, '#8a5636', 28); box(g, 300, y - 180, 800, 120, '#f4efe6', 30); box(g, 340, y - 255, 210, 100, '#ffffff', 46);
    drawToon(g, { x: 560, y: y + 40, s: 2.2, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: t < ta ? 'tired' : 'worried', look: [0.3, -0.7] }); box(g, 520, y - 190, 590, 175, '#e8704a', 60); box(g, 280, y - 70, 840, 80, '#6a3f28', 20); glow(g, 640, y - 300, 260, '#9fd8ff', 0.35);
    const words = ['sleep', 'room', 'money', 'gym', 'call back', 'study', 'taxes', 'water', 'emails', 'laundry', 'dentist', 'portfolio', 'budget', 'cook', 'read']; words.forEach((w, i) => { const k = prog(t, ta + i * 0.075, ta + i * 0.075 + 0.25); slip(g, 780 + (i % 5) * 230 + Math.sin(t * 2 + i) * 14, 180 + Math.floor(i / 5) * 175 + (i % 2) * 40, 0.62, w, k, Math.sin(i * 3) * 0.14); }); });
  vig(g, 0.6); } });

// i: you make a plan. a massive one. with colours.
reg('i', { draw(g, t, info) { const tm = at(info, 'massive', 1.7), tc = at(info, 'colours', 3.1), grow = ease.outBack(prog(t, tm - 0.1, tm + 0.4));
  cam(g, t, info.dur, [1.1, 0.55, 0.5], [1.0, 0.5, 0.5], () => { grad(g, [[0, '#2a3a72'], [1, '#101530']]); glow(g, 1050, 450, 800, '#ffd98a', 0.25); g.fillStyle = '#3a2420'; g.fillRect(-W(), H() * 0.9, W() * 3, H());
    const pw = lerp(620, 1220, grow), ph = lerp(440, 760, grow), px = 1130 - pw / 2, py = 480 - ph / 2; box(g, px + 16, py + 22, pw, ph, 'rgba(0,0,0,.3)', 20, 0); box(g, px, py, pw, ph, '#fffaf0', 20, 8); hw(g, 'THE PLAN', px + pw / 2, py + 75, 100);
    const cols = ['#e8503c', '#f2a024', '#3aa86a', '#3a78d0', '#9a52c8'], col = prog(t, tc - 0.15, tc + 0.5); for (let i = 0; i < 20; i++) { const k = prog(t, 0.2 + i * 0.1, 0.5 + i * 0.1); if (k <= 0) continue; const x = px + 55 + (i % 4) * (pw - 110) / 4, y = py + 150 + Math.floor(i / 4) * (ph - 200) / 5, w = (pw - 110) / 4 - 30, c = col > i / 20 ? cols[i % 5] : '#d8d2c4'; box(g, x, y, w * k, (ph - 200) / 5 - 28, c, 14, 5); if (i % 4 < 3 && k >= 1) seg(g, [[x + w + 4, y + 30], [x + w + 28, y + 30]], 7, INK); }
    drawToon(g, { x: 330, y: H() * 0.95, s: 2.5, cast: HERO, actions: [[0, 'think'], [tm, 'point'], [tc, 'handsHips']], t, facing: 1, yaw: 0.6, expr: t < tm ? 'focused' : 'excited' });
    if (t > tc) for (let i = 0; i < 24; i++) { const p = (t - tc) * 0.9 + (i % 6) * 0.04, a = i * 0.9; circle(g, 1130 + Math.cos(a) * p * 760, 460 + Math.sin(a) * p * 520, 10 * clamp(1.3 - p), cols[i % 5]); } });
  vig(g, 0.4); } });
