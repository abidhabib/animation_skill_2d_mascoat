// V06 Clip 20: the payoff. No applause; soaked walk; the old note is gone; a new note and two hidden words.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, clockOn, hand, slapLines } from '/engine/notewall.js';
import { place, floorY } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, popIn, jar, note, nightRoom, bed, rug, sideTable, tableTop, rain, folder } from '/engine/v06.js';

const street = (g, t) => { place(g, 'street', t, { look: 'rain' }); veil(g, '#101c30', 0.3); };
const wet = (g, t, x, y) => { for (let i = 0; i < 6; i++) { const p = (t * 1.3 + i / 6) % 1; g.beginPath(); g.ellipse(x - 110 + i * 44, y + p * 260, 6, 12, 0, 0, 7); g.fillStyle = alpha('#bfe4ff', 0.8 * (1 - p)); g.fill(); } };
const calmWall = (g, t) => { noteWall(g, t, { lamp: 0.6 }); veil(g, '#0a1a3a', 0.25); rug(g, 960, 1015, 470, '#4a6aa0'); sideTable(g, 330, 975, 300, 180); D.mug(g, 330, 795, 0.7, { t }); D.backpack(g, 1620, 975, 0.9, {}); };

// a: nobody claps. nobody tells you that was brave.
reg('a', { draw(g, t, info) { cam(g, t, info.dur, [1.15, 0.5, 0.6], [1.0, 0.5, 0.55], () => { street(g, t); drawToon(g, { x: 960, y: floorY('street') + 55, s: 2.4, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.2, expr: 'sad', look: [Math.sin(t * 1.4) * 0.7, 0] }); rain(g, t, 130, 0.4); }); vig(g, 0.55); } });
// b: you walk home soaked
reg('b', { draw(g, t, info) { street(g, t * 1.6); const x = lerp(500, 950, prog(t, 0, info.dur)); drawToon(g, { x, y: floorY('street') + 55, s: 2.5, cast: HERO, action: 'walk', t, facing: 1, expr: 'tired' }); wet(g, t, x, 420); rain(g, t, 180, 0.5); vig(g, 0.55); } });
// c: your drawings might come back with a no. they might never come back at all.
reg('c', { draw(g, t, info) { const tn = at(info, 'they', 3.0) - 0.15; const second = t >= tn; tableTop(g, t, '#2a3c52', '#0e1622');
  if (!second) cam(g, t, tn, [1.0, 0.5, 0.55], [1.14, 0.5, 0.55], () => { box(g, 620, 380, 680, 440, '#efe6d4', 20, 9); seg(g, [[620, 390], [960, 640], [1300, 390]], 9, INK); popIn(g, 960, 620, prog(t, 1.4, 1.7), -0.14, () => { g.globalAlpha = 0.75; g.strokeStyle = '#d0342a'; g.lineWidth = 14; g.strokeRect(-150, -80, 300, 160); text(g, 'NO?', 0, 8, { size: 100, color: '#d0342a' }); g.globalAlpha = 1; }); });
  else { const u = t - tn; cam(g, u, info.dur - tn, [1.14, 0.5, 0.52], [1.0, 0.5, 0.55], () => { box(g, 760, 360, 400, 300, '#3a6ac0', 120, 10); box(g, 830, 450, 260, 60, '#16203a', 20); box(g, 930, 660, 60, 260, '#6a4a32', 10); seg(g, [[1180, 560], [1180, 420]], 14, INK); box(g, 1180, 420, 80, 54, '#8a8a92', 8); for (let i = 0; i < 5; i++) circle(g, 600 + i * 190, 240 + Math.sin(u + i) * 14, 8, alpha('#ffffff', 0.35)); }); }
  vig(g, 0.55); } });
// d: but when you enter your room, the yellow note is gone
reg('d', { draw(g, t, info) { const tg = at(info, 'gone', 2.8) - 0.5; cam(g, t, info.dur, [1.0, 0.55, 0.5], [1.22, 0.56, 0.46], () => { calmWall(g, t);
    // a clean patch and two strips of old tape where the note hung
    const k = prog(t, tg, tg + 0.4); if (k > 0) { g.save(); g.globalAlpha = k; g.setLineDash([26, 22]); g.strokeStyle = '#cfe8ff'; g.lineWidth = 8; g.strokeRect(990, 310, 300, 300); g.setLineDash([]); for (const x of [1010, 1270]) box(g, x - 36, 295, 72, 30, 'rgba(255,240,200,.65)', 4, 3); g.restore(); }
    drawToon(g, { x: lerp(120, 560, ease.out(prog(t, 0, 1.8))), y: 985, s: 2.5, cast: HERO, actions: [[0, 'walk'], [1.8, 'idle']], t, facing: 1, yaw: 0.6, expr: t < tg ? 'tired' : 'surprised', look: [0.8, -0.1] }); }); vig(g, 0.55); } });
// e: that little square of paper feels heavier than the other twelve put together
reg('e', { draw(g, t, info) { const th = at(info, 'heavier', 2.8) - 0.1; const sq = t > th ? Math.exp(-(t - th) * 3) * Math.sin((t - th) * 22) * 14 : 0, bend = ease.out(prog(t, th, th + 0.4));
  cam(g, t, info.dur, [1.05, 0.5, 0.55], [1.2, 0.5, 0.56], () => { grad(g, [[0, '#17304a'], [1, '#0a1420']]); D.plant(g, 270, 1000, 1.3, { kind: 'leafy', t }); D.alarmClock(g, 1660, 1000, 1.2, { t }); glow(g, 960, 520, 700, '#ffd98a', 0.25);
    g.strokeStyle = INK; g.lineWidth = 56; g.beginPath(); g.moveTo(450, 810); g.quadraticCurveTo(960, 810 + bend * 90 + sq, 1470, 810); g.stroke(); g.strokeStyle = '#a8704a'; g.lineWidth = 40; g.stroke(); jar(g, 960, 780 + bend * 44 + sq, 1.05, 12);
    const q = ease.in(prog(t, 0.2, 1.1)); if (q < 1) note(g, 960, lerp(60, 640, q), 0.36, { rot: q * 4, age: 1 }); else note(g, 960, 690 + bend * 44 + sq, 0.4, { rot: 0.08, age: 1 }); if (t > th) slapLines(g, 960, 800, prog(t, th, th + 0.5), 360); }); vig(g, 0.55); } });
// f: that night, midnight comes
reg('f', { draw(g, t, info) { const sl = Math.max(0.5, info.dur - 0.85); const sh = t > sl ? Math.exp(-(t - sl) * 8) * Math.sin(t * 80) * 14 : 0; cam(g, t, info.dur, [1.15, 0.45, 0.4], [1.0, 0.5, 0.5], () => { g.translate(sh, 0); calmWall(g, t); clockOn(g, 760, 300, 130, t < sl - 0.4 ? 11 : 12, t < sl - 0.4 ? 59 : 0); }); vig(g, 0.6); } });
// g: a new note. for the first time in nine days, you're happy to see it.
reg('g', { draw(g, t, info) { const th = at(info, 'happy', 3.0) - 0.3; if (t < th) cam(g, t, th, [1.0, 0.55, 0.5], [1.16, 0.56, 0.46], () => { noteWall(g, t); rug(g, 960, 1015, 470); sideTable(g, 330, 975, 300, 180); jar(g, 330, 795, 0.45, 12); note(g, 1140, 470, 1.0 * lerp(1.8, 1, ease.in(prog(t, 0, 0.14))), { rot: -0.04 }); slapLines(g, 1140, 470, prog(t, 0.12, 0.55), 250); drawToon(g, { x: 580, y: 985, s: 2.5, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.6, expr: t < 1.4 ? 'curious' : 'hopeful', look: [0.8, -0.1] }); });
  else { const u = t - th; noteWall(g, t); veil(g, '#06101a', 0.2); note(g, 1620, 430, 0.6, { rot: 0.06 }); cam(g, u, info.dur - th, [1.0, 0.5, 0.47], [1.14, 0.5, 0.45], () => bigToonFace(g, 900, 590, 270, { cast: HERO, expr: u < 0.5 ? 'relieved' : 'joy', t, look: [0.5, -0.1] })); }
  vig(g, 0.45); } });
// h: you pick up the pen. write two words. and go to sleep.
reg('h', { draw(g, t, info) { const ts = at(info, 'and', 2.8) - 0.15; if (t < ts) cam(g, t, ts, [1.05, 0.5, 0.52], [1.2, 0.5, 0.52], () => { tableTop(g, t, '#1d4a5c', '#0a1a26'); note(g, 960, 540, 1.7, { rot: -0.02 }); const k = prog(t, 1.2, ts - 0.1), px = 760 + k * 360, py = 570 + Math.sin(t * 24) * 8 * (k > 0 && k < 1 ? 1 : 0);
      // the words stay hidden behind the writing hand
      for (let i = 0; i < 2; i++) if (k > i * 0.5) { const x = 790 + i * 190, w = 140 * clamp((k - i * 0.5) * 2.4); box(g, x, 535, w, 24, 'rgba(51,35,28,.35)', 12, 0); } seg(g, [[px, py], [px + 150, py + 150]], 28, INK); seg(g, [[px + 8, py + 8], [px + 142, py + 142]], 14, '#4a78b8'); hand(g, px + 140, py + 150, [260, 420], { s: 1.35 }); });
  else { const u = t - ts; cam(g, u, info.dur - ts, [1.0, 0.45, 0.58], [1.16, 0.42, 0.62], () => { nightRoom(g, t, { lamp: 0.25 }); veil(g, '#02060c', 0.35); note(g, 1380, 430, 0.5, { rot: -0.04 }); bed(g, 720, 960, '#4a8ab0', () => drawToon(g, { x: 520, y: 1000, s: 2.05, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: 'sleeping' })); for (let i = 0; i < 3; i++) { const p = (t * 0.45 + i / 3) % 1; text(g, 'z', 620 + p * 200 + i * 20, 560 - p * 260, { size: 50 + p * 60, color: alpha('#bfe4ff', 1 - p) }); } }); }
  vig(g, 0.55); } });
