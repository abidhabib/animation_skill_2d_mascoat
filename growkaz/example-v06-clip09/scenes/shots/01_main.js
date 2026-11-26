// V06 Clip 9: the midpoint twist on the rooftop (gold + teal evening, not the usual purple sunset).
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, jar, popIn, note, bed } from '/engine/v06.js';

const WORDS = ['sheets', 'water', 'chair', 'food', 'walk', 'sleep', 'early', 'book', 'message', 'app', 'desk', 'socks'];
// evening rooftop: teal-to-gold sky, city, water tank, parapet, string lights, crates and plants
function roof(g, t, o = {}) { grad(g, [[0, '#14485a'], [0.45, '#3f9a8a'], [0.72, '#ffd07a'], [1, '#ffb050']]); circle(g, 1450, 600, 90, '#fff2b8'); glow(g, 1450, 600, 520, '#ffd98a', 0.5);
  for (let i = 0; i < 4; i++) { const x = ((i * 560 + t * 18) % 2300) - 200; for (const [dx, r] of [[0, 44], [52, 58], [108, 40]]) circle(g, x + dx, 170 + (i % 2) * 130, r, alpha('#fff0d8', 0.55)); }
  const r = rng(7); for (let x = -100, i = 0; x < 2100; i++) { const w = 110 + r() * 130, h = 120 + r() * 250; box(g, x, 780 - h, w, h, ['#1f5260', '#2a6470', '#174450'][i % 3], 6, 4); for (let yy = 800 - h; yy < 740; yy += 52) for (let xx = x + 22; xx < x + w - 24; xx += 40) if (r() < 0.3) box(g, xx, yy, 16, 24, '#ffd98a', 3, 0); x += w + 8; }
  if (o.tank !== false) { for (const d of [-60, 60]) seg(g, [[220 + d, 800], [220 + d * 0.7, 560]], 16, INK); box(g, 110, 340, 220, 230, '#a8744a', 24); for (let i = 1; i < 5; i++) seg(g, [[110 + i * 44, 345], [110 + i * 44, 565]], 4, alpha(INK, 0.5)); g.beginPath(); g.moveTo(90, 345); g.lineTo(220, 260); g.lineTo(350, 345); g.closePath(); g.fillStyle = '#7a4a30'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); }
  box(g, -40, 740, 2000, 110, '#8a5a4a', 6); box(g, -40, 718, 2000, 34, '#c89070', 8); floor(g, 850, '#6a4a48');
  g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-20, 90); g.quadraticCurveTo(960, 240, 1940, 60); g.stroke(); for (let i = 1; i < 13; i++) { const u = i / 13, x = -20 + u * 1960, y = (1 - u) * (1 - u) * 90 + 2 * (1 - u) * u * 240 + u * u * 60 + 18; circle(g, x, y, 12, '#ffd84a'); glow(g, x, y, 60, '#ffd98a', 0.35 + 0.15 * Math.sin(t * 2 + i)); }
  D.plant(g, 1790, 860, 1.2, { kind: 'leafy', t }); }
const deck = (g, t) => { grad(g, [[0, '#7a5250'], [1, '#4a3034']]); for (let i = 0; i < 9; i++) seg(g, [[-100, i * 140 + 30], [2100, i * 140 + 50]], 5, alpha(INK, 0.3)); glow(g, 1500, 200, 900, '#ffd07a', 0.35); D.plant(g, 130, 1060, 1.3, { kind: 'leafy', t }); D.mug(g, 1800, 1050, 1.1, { t }); };
const card = (g, i, x, y, s, rot) => note(g, x, y, s, { rot, text: WORDS[i], size: WORDS[i].length > 6 ? 78 : 96 });
const slot = (i) => [430 + (i % 4) * 355, 235 + Math.floor(i / 4) * 305];

// a: that evening, you carry the jar onto the roof
reg('a', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.16, 0.5, 0.55], () => { roof(g, t); const x = lerp(300, 900, ease.out(prog(t, 0, 2.2))); drawToon(g, { x, y: 990, s: 2.6, cast: HERO, actions: [[0, 'walk'], [2.2, 'idle']], t, facing: 1, yaw: 0.6, expr: 'hopeful' }); jar(g, x + 150, 760 + Math.sin(t * 8) * 6, 0.42, 12); D.sneaker(g, 1500, 975, 0.8, {}); }); vig(g, 0.35); } });

// b: you empty it and read every note
reg('b', { draw(g, t, info) { const te = at(info, 'empty', 0.2) + 0.15; cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.14, 0.5, 0.58], () => { deck(g, t); const tip = ease.inOut(prog(t, te - 0.1, te + 0.5));
    for (let i = 0; i < 12; i++) { const k = ease.out(prog(t, te + 0.25 + i * 0.07, te + 0.9 + i * 0.07)); if (k <= 0) continue; const [sx, sy] = slot(i); card(g, i, lerp(620, sx + 90, k), lerp(420, sy + 80, k) - Math.sin(k * Math.PI) * 160, 0.55, (1 - k) * 4 + ((i * 7) % 5 - 2) * 0.09); }
    if (t < te + 1.3) { g.save(); g.translate(430, 420); g.rotate(tip * 1.9); g.globalAlpha = 1 - prog(t, te + 0.9, te + 1.3); jar(g, 0, 200, 0.85, Math.max(0, 12 - Math.floor(prog(t, te + 0.2, te + 1.1) * 12))); g.restore(); } }); vig(g, 0.35); } });

// c: the twelve notes, one per word
reg('c', { draw(g, t, info) { const ts = WORDS.map((w, i) => at(info, w, i * 0.86 + 0.1)); let cur = 0; ts.forEach((s, i) => { if (t >= s - 0.05) cur = i; });
  const k = ease.inOut(prog(t, ts[cur] - 0.05, ts[cur] + 0.35)); const prev = Math.max(0, cur - 1); const fx = lerp(slot(prev)[0], slot(cur)[0], k), fy = lerp(slot(prev)[1], slot(cur)[1], k);
  g.save(); g.translate(960, 540); g.scale(1.22, 1.22); g.translate(-lerp(960, fx, 0.35), -lerp(540, fy, 0.35)); deck(g, t);
  for (let i = 0; i < 12; i++) { const [x, y] = slot(i), on = i === cur, done = t >= ts[i] - 0.05; const p = on ? ease.outBack(prog(t, ts[i] - 0.05, ts[i] + 0.25)) : 0; if (on) glow(g, x, y, 280, '#ffe27a', 0.5);
    g.save(); g.globalAlpha = done ? 1 : 0.45; card(g, i, x, y, 0.72 + 0.16 * p, ((i * 7) % 5 - 2) * 0.05); g.restore(); if (done && !on) D.tick(g, x + 95, y + 90, 0.5, {}); }
  g.restore(); vig(g, 0.4); } });

// d: twelve things. twelve little victories.
reg('d', { draw(g, t, info) { const tv = at(info, 'victories', 2.2) - 0.5; cam(g, t, info.dur, [1.2, 0.5, 0.5], [1.0, 0.5, 0.5], () => { roof(g, t, { tank: false });
    for (let i = 0; i < 12; i++) card(g, i, 330 + (i % 6) * 255, 330 + Math.floor(i / 6) * 270 + Math.sin(t * 2 + i) * 8, 0.55, ((i * 7) % 5 - 2) * 0.06);
    popIn(g, 960, 880, prog(t, 0.1, 0.4), -0.02, () => { box(g, -260, -80, 520, 160, '#fffaf0', 30); text(g, '12 / 12', 0, 6, { size: 100, color: INK }); });
    if (t > tv) { popIn(g, 330, 870, prog(t, tv, tv + 0.35), -0.1, () => D.trophy(g, 0, 100, 1.4, { t })); popIn(g, 1590, 870, prog(t, tv + 0.15, tv + 0.5), 0.1, () => D.trophy(g, 0, 100, 1.4, { t })); for (let i = 0; i < 30; i++) { const p = clamp((t - tv) * 0.6 - (i % 7) * 0.03); box(g, 150 + ((i * 197) % 1650), lerp(-60, 700, p) + (i % 5) * 50, 20, 34, ['#ffd84a', '#ff7a4a', '#3fc0a0', '#fffaf0'][i % 4], 5, 3); } } }); vig(g, 0.35); } });

// e: you read them again, looking for your new life
reg('e', { draw(g, t, info) { const tl = at(info, 'looking', 4.0, 1) - 0.2;
  if (t < tl) cam(g, t, tl, [1.04, 0.5, 0.5], [1.22, 0.48, 0.55], () => { deck(g, t); for (let i = 0; i < 12; i++) { const [x, y] = slot(i); card(g, i, x, y, 0.68, ((i * 7) % 5 - 2) * 0.07); } const lx = 430 + Math.sin(t * 1.3) * 520 + 520, ly = 520 + Math.sin(t * 2.1) * 260; g.strokeStyle = INK; g.lineWidth = 34; g.beginPath(); g.arc(lx, ly, 150, 0, 7); g.stroke(); g.strokeStyle = '#e8c060'; g.lineWidth = 20; g.stroke(); circle(g, lx, ly, 140, 'rgba(200,240,255,.2)'); seg(g, [[lx + 110, ly + 110], [lx + 300, ly + 300]], 50, INK); seg(g, [[lx + 120, ly + 120], [lx + 290, ly + 290]], 28, '#a8704a'); });
  else { const u = t - tl; cam(g, u, info.dur - tl, [1.0, 0.5, 0.55], [1.2, 0.55, 0.5], () => { roof(g, t); drawToon(g, { x: 760, y: 990, s: 2.65, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.7, expr: 'hopeful', look: [1, -0.15] }); jar(g, 1100, 850, 0.4, 0); for (let i = 0; i < 6; i++) card(g, i, 1260 + (i % 3) * 140, 930 + Math.floor(i / 3) * 80, 0.24, i * 0.7); }); }
  vig(g, 0.4); } });

// f: and it isn't there
reg('f', { draw(g, t, info) { roof(g, t * 0.4); veil(g, '#08242c', 0.4);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.45], () => bigToonFace(g, 960, 600, 275, { cast: HERO, expr: t < 0.5 ? 'hopeful' : 'sad', t, look: [0.4, -0.1] })); vig(g, 0.65); } });

// g: it's the same life. it just smells better.
reg('g', { draw(g, t, info) { const ts = at(info, 'smells', 2.0) - 0.15; cam(g, t, info.dur, [1.16, 0.5, 0.55], [1.0, 0.5, 0.5], () => {
    const side = (x0, label, fresh) => { g.save(); g.beginPath(); g.rect(x0, 0, 960, 1080); g.clip(); grad(g, [[0, '#24505a'], [1, '#0e2830']]); floor(g, 900, '#5a3a30', false); bed(g, x0 + 480, 920, fresh ? '#4a8ab0' : '#6a7a80'); popIn(g, x0 + 480, 200, 1, 0, () => { box(g, -200, -60, 400, 120, '#fffaf0', 30); hw(g, label, 0, 28, 80); }); D.deskLamp(g, x0 + 120, 900, 0.9, {}); D.plant(g, x0 + 860, 900, 0.9, { kind: 'leafy', t }); g.restore(); };
    side(0, 'day 1', false); side(960, 'day 12', true); seg(g, [[960, -50], [960, 1150]], 16, INK);
    if (t > ts) for (let i = 0; i < 12; i++) { const p = (t * 0.5 + i / 12) % 1; D.star(g, 1150 + ((i * 131) % 620), 700 - p * 380, 0.28 * Math.sin(p * Math.PI) * prog(t, ts, ts + 0.3), { t }); } }); vig(g, 0.4); } });

// h: none of these things were useless. clean sheets are wonderful.
reg('h', { draw(g, t, info) { const tc = at(info, 'clean', 2.3) - 0.2;
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.15, 0.5, 0.52], () => { roof(g, t);
    seg(g, [[430, 330], [1500, 330]], 8, INK); for (const x of [430, 1500]) seg(g, [[x, 320], [x, 850]], 20, INK); const sw = Math.sin(t * 2) * 26;
    g.beginPath(); g.moveTo(560, 330); g.lineTo(1360, 330); g.quadraticCurveTo(1390 + sw, 560, 1350 + sw, 780); g.quadraticCurveTo(960 + sw, 840, 570 + sw, 780); g.quadraticCurveTo(540 + sw, 560, 560, 330); g.closePath(); g.fillStyle = '#eaf6ff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); for (const x of [640, 1280]) box(g, x - 16, 300, 32, 70, '#e8a050', 8, 5);
    if (t > tc) for (let i = 0; i < 8; i++) D.star(g, 620 + i * 100 + sw, 440 + (i % 3) * 120, 0.35 * ease.outBack(prog(t, tc + i * 0.05, tc + 0.35 + i * 0.05)), { t });
    drawToon(g, { x: 300, y: 990, s: 2.4, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.55, expr: t < tc ? 'thinking' : 'relieved' }); }); vig(g, 0.35); } });

// i: twelve things fixed, and the one thing you've feared for two years isn't among them
reg('i', { draw(g, t, info) { const to = at(info, 'one', 2.9) - 0.15, tt = at(info, 'two', 5.4) - 0.2; const d = prog(t, to, to + 0.8);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.18, 0.5, 0.52], () => { deck(g, t); veil(g, '#06161c', 0.55 * d);
    let n = 0; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { if ((r === 1 && c === 2) || (c === 2 && r !== 1) ) continue; if (n >= 12) break; g.save(); g.globalAlpha = 1 - 0.55 * d; card(g, n, 330 + c * 315, 240 + r * 300, 0.6, ((n * 7) % 5 - 2) * 0.06); g.restore(); n++; }
    const x = 960, y = 540, k = ease.outBack(prog(t, to, to + 0.35)); if (k > 0) { glow(g, x, y, 420, '#ffd64a', 0.35 + 0.1 * Math.sin(t * 5)); g.save(); g.translate(x, y); g.scale(k, k); g.setLineDash([34, 24]); g.lineDashOffset = -t * 40; g.strokeStyle = '#ffe27a'; g.lineWidth = 14; g.strokeRect(-135, -135, 270, 270); g.setLineDash([]); text(g, '?', 0, 8, { size: 200, color: '#ffe27a', stroke: 14, strokeColor: INK }); g.restore(); }
    popIn(g, 960, 880, prog(t, tt, tt + 0.35), -0.02, () => { box(g, -240, -62, 480, 124, '#fff3d6', 30); hw(g, '2 years', 0, 30, 100, '#a82a1c'); }); }); vig(g, 0.55); } });
