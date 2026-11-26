// V06 Clip 10: safe wins vs the thing that can judge you; the folder under the bed; the studio flashback.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, nightRoom, morning, bed, jar, popIn, note, rug, sideTable, tableTop, folder, page, studioFront, paperSign } from '/engine/v06.js';

// a: most of your victories were things you could control
reg('a', { draw(g, t, info) { cam(g, t, info.dur, [1.15, 0.5, 0.5], [1.0, 0.5, 0.5], () => { tableTop(g, t, '#24505a', '#0c222a');
    ['sheets', 'water', 'chair', 'food', 'walk', 'sleep'].forEach((w, i) => { const x = 520 + (i % 3) * 440, y = 270 + Math.floor(i / 3) * 330; note(g, x, y, 0.7 * ease.outBack(prog(t, 0.05 + i * 0.08, 0.35 + i * 0.08)), { rot: ((i % 3) - 1) * 0.05, text: w }); D.tick(g, x + 105, y + 95, 0.9 * ease.outBack(prog(t, 1.2 + i * 0.12, 1.5 + i * 0.12)), {}); }); });
  vig(g, 0.45); } });

// b: things that couldn't look at your work and say it wasn't good enough
reg('b', { draw(g, t, info) { const tl = at(info, 'look', 1.0), tg = at(info, 'good', 3.0) - 0.3;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.16, 0.5, 0.5], () => { nightRoom(g, t); veil(g, '#08040c', 0.45 * prog(t, tl - 0.3, tl + 0.3));
    // a giant faceless critic's eyes above
    const k = ease.out(prog(t, tl - 0.1, tl + 0.4)); for (const d of [-1, 1]) { g.beginPath(); g.ellipse(960 + d * 190, 230, 130, 70 * k, 0, 0, 7); g.fillStyle = '#fff6e0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); if (k > 0.5) circle(g, 960 + d * 190 + Math.sin(t * 1.5) * 24, 250, 34, INK); seg(g, [[960 + d * 330, 120], [960 + d * 70, 180]], 22 * k, INK); }
    sideTable(g, 960, 975, 620, 230); page(g, 960, 640, 0.62, 0, { rot: -0.05 }); D.mug(g, 760, 745, 0.7, { t }); D.deskLamp(g, 1180, 745, 0.8, {});
    drawToon(g, { x: 330, y: 985, s: 2.4, cast: HERO, actions: [[0, 'idle'], [tl, 'recoil']], t, facing: 1, yaw: 0.6, expr: t < tl ? 'friendly' : 'worried', look: [0.7, -0.5] });
    popIn(g, 1470, 600, prog(t, tg, tg + 0.2), 0.14, () => { g.strokeStyle = '#e0442c'; g.lineWidth = 14; g.strokeRect(-260, -85, 520, 170); text(g, 'NOT GOOD?', 0, 8, { size: 80, color: '#ff6a4a', stroke: 8, strokeColor: INK }); }); });
  vig(g, 0.6); } });

// c: you weren't just choosing what was easy, you were choosing what felt safe
reg('c', { draw(g, t, info) { const ts = at(info, 'safe', 3.6) - 0.3;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.15, 0.5, 0.55], () => { nightRoom(g, t); rug(g, 960, 1010, 520, '#c8604a');
    // blanket fort
    seg(g, [[560, 975], [820, 420]], 22, '#a8744a'); seg(g, [[1360, 975], [1100, 420]], 22, '#a8744a'); g.beginPath(); g.moveTo(480, 975); g.quadraticCurveTo(640, 640, 960, 380); g.quadraticCurveTo(1280, 640, 1440, 975); g.closePath(); g.fillStyle = '#4a8ab0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke();
    g.beginPath(); g.moveTo(760, 975); g.quadraticCurveTo(830, 700, 960, 600); g.quadraticCurveTo(1090, 700, 1160, 975); g.closePath(); g.fillStyle = '#2a1a22'; g.fill(); g.stroke(); glow(g, 960, 840, 280, '#ffd98a', 0.6);
    drawToon(g, { x: 960, y: 1000, s: 1.7, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.2, expr: 'relieved' }); jar(g, 1260, 985, 0.42, 12);
    popIn(g, 960, 200, prog(t, ts, ts + 0.3), -0.04, () => { box(g, -200, -80, 400, 160, '#fffaf0', 30); hw(g, 'safe', 0, 38, 130); }); if (t < ts) popIn(g, 960, 200, prog(t, 1.2, 1.5), 0.04, () => { box(g, -200, -80, 400, 160, '#fffaf0', 30); hw(g, 'easy', 0, 38, 130); seg(g, [[-130, 10], [-130 + 260 * prog(t, ts - 0.4, ts - 0.1), 0]], 14, '#d0342a'); }); });
  vig(g, 0.55); } });

// under-bed view: legs of the bed, boards, dust
function underBed(g, t, reveal = 1) { grad(g, [[0, '#1a0e14'], [1, '#3a2020']]); box(g, -60, 60, 2040, 210, '#6a3f28', 30); box(g, -40, -80, 2000, 190, '#4a8ab0', 70); for (const x of [150, 1770]) box(g, x - 60, 260, 120, 660, '#5a3422', 20); floor(g, 900, '#7a4a30'); glow(g, 1500, 700, 700, '#ffd98a', 0.3 * reveal);
  const r = rng(6); for (let i = 0; i < 30; i++) circle(g, r() * 1920, 300 + r() * 600 + Math.sin(t * 1.4 + i) * 20, 3 + r() * 5, alpha('#ffe9b0', 0.35 * reveal)); }

// d: and suddenly you remember something under your bed
reg('d', { draw(g, t, info) { const tu = at(info, 'something', 2.8, 1) - 0.2;
  if (t < tu) cam(g, t, tu, [1.0, 0.5, 0.45], [1.2, 0.5, 0.42], () => { nightRoom(g, t); veil(g, '#06101a', 0.2); bigToonFace(g, 960, 580, 260, { cast: HERO, expr: t < 0.9 ? 'thinking' : 'surprised', t, look: [-0.3, t < 1.4 ? -0.5 : 0.7] }); });
  else { const u = t - tu; cam(g, u, info.dur - tu, [1.0, 0.5, 0.45], [1.5, 0.45, 0.72], () => { nightRoom(g, t, { lamp: 0.4 }); bed(g, 860, 960, '#4a8ab0'); veil(g, '#05080e', 0.35); box(g, 520, 885, 700, 90, '#120a10', 20, 0); glow(g, 760, 930, 220, '#7affa8', 0.45 * prog(u, 0.2, 0.9)); folder(g, 760, 940, 0.34); }); }
  vig(g, 0.6); } });

// e: behind a shoe box, tied with an old shoelace, a green folder
reg('e', { draw(g, t, info) { const tf = at(info, 'green', 3.6) - 0.3, tl = at(info, 'shoelace', 2.7);
  cam(g, t, info.dur, [1.05, 0.5, 0.65], [1.18, 0.55, 0.65], () => { underBed(g, t, prog(t, 0, 1.5)); const k = ease.inOut(prog(t, 1.0, 2.6));
    folder(g, 1120, 730, 1.15, { rot: -0.03 }); D.shoeBox(g, lerp(1080, 460, k), 900, 2.6, {}); D.sneaker(g, 1650, 900, 1.2, {}); if (t > tl && t < tf + 1) { g.strokeStyle = '#ffe27a'; g.lineWidth = 8; g.beginPath(); g.arc(1120, 740, 150 + Math.sin(t * 8) * 8, 0, 7); g.stroke(); }
    if (t > tf) for (let i = 0; i < 8; i++) D.star(g, 860 + i * 75, 520 + (i % 2) * 40, 0.32 * ease.outBack(prog(t, tf + i * 0.04, tf + 0.4 + i * 0.04)), { t }); });
  vig(g, 0.65); } });

// f: your drawings. thirty-two pages.
reg('f', { draw(g, t, info) { const tp = at(info, 'thirtytwo', 1.5) - 0.2;
  cam(g, t, info.dur, [1.12, 0.5, 0.55], [1.0, 0.5, 0.5], () => { tableTop(g, t, '#4a3a2a', '#1c140e'); folder(g, 960, 720, 1.2, { lace: false });
    for (let i = 0; i < 9; i++) { const k = ease.outBack(prog(t, 0.1 + i * 0.09, 0.55 + i * 0.09)); if (k <= 0) continue; const a = (i - 4) * 0.19; page(g, 960 + Math.sin(a) * 720 * k, 820 - Math.cos(a) * 400 * k, 0.72, i % 4, { rot: a * k }); }
    popIn(g, 960, 840, prog(t, tp, tp + 0.3), -0.03, () => { box(g, -250, -75, 500, 150, '#ffd64a', 30); text(g, '32 pages', 0, 6, { size: 92, color: INK }); }); });
  vig(g, 0.4); } });

// g: two years ago you walked past a tiny studio; a handwritten sign on its door
reg('g', { draw(g, t, info) { const ts = at(info, 'sign', 5.7) - 1.1;
  if (t < ts) cam(g, t, ts, [1.0, 0.5, 0.55], [1.12, 0.55, 0.55], () => { studioFront(g, t); box(g, 1130, 590, 120, 80, '#fffaf0', 6, 4); drawToon(g, { x: lerp(60, 880, ease.inOut(prog(t, 0.2, ts))), y: 990, s: 2.35, cast: HERO, actions: [[0, 'walk'], [ts - 0.7, 'idle']], t, facing: 1, expr: t < ts - 0.8 ? 'friendly' : 'surprised', look: [0.8, -0.2] }); folder(g, lerp(90, 900, ease.inOut(prog(t, 0.2, ts))), 760, 0.25, { rot: -0.1 }); });
  else { const u = t - ts; cam(g, u, info.dur - ts, [1.0, 0.58, 0.55], [1.25, 0.62, 0.58], () => { studioFront(g, t); paperSign(g, 1190, 620, 1.25 * ease.outBack(prog(u, 0, 0.35))); glow(g, 1190, 620, 420, '#fff6c8', 0.25); }); }
  // memory haze
  veil(g, '#ffcf8a', 0.1); vig(g, 0.45); if (t < 0.35) veil(g, '#fff6e0', 0.8 * (1 - t / 0.35)); } });
