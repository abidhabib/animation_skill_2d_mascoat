// V06 Clip 12: the trap: busy, the bad hand, researching everything, new style, new pens.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, hand, fairyLights } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, nightRoom, morning, jar, dayCard, popIn, note, rug, sideTable, tableTop, folder, page } from '/engine/v06.js';

// a: day fourteen. you're busy. you're not.
reg('a', { draw(g, t, info) { const tn = at(info, 'not', 2.7) - 0.15, tc = at(info, 'confidence', 4.4);
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.14, 0.5, 0.52], () => { morning(g, t); note(g, 740, 330, 0.5, { rot: -0.05, text: ['take the', 'folder'], size: 66, age: 1 });
    box(g, 1220, 700, 480, 200, '#4a8a8a', 60); box(g, 1250, 900, 36, 80, '#3a2a20', 8); box(g, 1640, 900, 36, 80, '#3a2a20', 8); D.plant(g, 1790, 975, 1.2, { kind: 'tall', t }); D.mug(g, 330, 975, 0.8, {});
    drawToon(g, { x: 820, y: 985, s: 2.6, cast: HERO, actions: [[0, 'phone'], [tn, 'idle'], [tc, 'handsHips']], t, facing: 1, yaw: 0.35, expr: t < tn ? 'focused' : t < tc ? 'deadpan' : 'confident' });
    popIn(g, 1140, 300, prog(t, 1.2, 1.5), 0.04, () => { box(g, -190, -90, 380, 180, '#fffaf0', 90); hw(g, "busy!", 0, 34, 110); if (t > tn) { seg(g, [[-130, 20], [-130 + 260 * prog(t, tn, tn + 0.25), -10]], 16, '#d0342a'); } }); });
  dayCard(g, 14, prog(t, 0.05, 0.35), 250, 220); vig(g, 0.3); } });

function drawDesk(g, t, bad, redraw = 0) { tableTop(g, t, '#2a4a62', '#101c2a'); D.deskLamp(g, 1500, 920, 1.5, { on: true }); page(g, 960, 540, 1.75, 2, { rot: -0.03, bad }); }
// b: day fifteen. one drawing has a bad hand.
reg('b', { draw(g, t, info) { const th = at(info, 'bad', 2.8) - 0.1;
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.25, 0.5, 0.45], () => { drawDesk(g, t, 1); const k = ease.outBack(prog(t, th, th + 0.35)); if (k > 0) { g.strokeStyle = '#d0342a'; g.lineWidth = 16; g.beginPath(); g.ellipse(960, 430, 300 * k, 270 * k, -0.1, 0, 6.6); g.stroke(); } });
  dayCard(g, 15, prog(t, 0.05, 0.35), 250, 220); vig(g, 0.45); } });

// c: you can't submit a bad hand. so you redraw it.
reg('c', { draw(g, t, info) { const tr = at(info, 'redraw', 1.9) - 0.2;
  cam(g, t, info.dur, [1.15, 0.5, 0.48], [1.0, 0.5, 0.5], () => { const erase = prog(t, tr, tr + 0.6); drawDesk(g, t, erase > 0.9 ? 2 : 1); if (t < tr) { popIn(g, 1420, 350, prog(t, 0.15, 0.45), 0.12, () => { g.strokeStyle = '#d0342a'; g.lineWidth = 14; g.strokeRect(-170, -80, 340, 160); text(g, 'NO WAY', 0, 8, { size: 70, color: '#ff6a4a', stroke: 8, strokeColor: INK }); }); }
    else { const px = 960 + Math.sin(t * 24) * 180, py = 480 + Math.cos(t * 17) * 90; box(g, px - 90, py - 45, 180, 90, '#f4a0b0', 22); hand(g, px + 80, py + 60, [420, 360], {}); const r = rng(Math.floor(t * 12)); for (let i = 0; i < 10; i++) circle(g, 760 + r() * 420, 640 + r() * 160, 6 + r() * 8, '#f4a0b0'); } });
  vig(g, 0.45); } });

// d: now the other hand looks worse
reg('d', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.2, 0.52, 0.45], () => { tableTop(g, t, '#2a4a62', '#101c2a'); page(g, 630, 540, 1.35, 2, { rot: -0.06, bad: 1 }); page(g, 1290, 540, 1.35, 2, { rot: 0.05, bad: 4 });
    popIn(g, 1290, 150, prog(t, 0.9, 1.2), -0.06, () => { box(g, -170, -62, 340, 124, '#ffd64a', 30); hw(g, 'worse', 0, 30, 100); }); D.tick(g, 300, 880, 0.001, {}); });
  vig(g, 0.45); } });

// e: day sixteen. you research the studio.
reg('e', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.15, 0.5, 0.52], () => { nightRoom(g, t); sideTable(g, 1060, 975, 760, 260); D.laptop(g, 1060, 715, 2.0, {}); glow(g, 1060, 560, 420, '#9fd8ff', 0.4); D.mug(g, 760, 715, 0.8, { t }); D.mug(g, 1360, 715, 0.8, {});
    drawToon(g, { x: 480, y: 985, s: 2.6, cast: HERO, actions: [[0, 'reach'], [1.6, 'think']], t, facing: 1, yaw: 0.65, expr: 'focused', look: [0.8, 0.1] }); });
  dayCard(g, 16, prog(t, 0.05, 0.35)); vig(g, 0.5); } });

// the research board
function board(g, t, items) { grad(g, [[0, '#2a3a42'], [1, '#121a20']]); box(g, 160, 90, 1600, 900, '#c08a5a', 24, 14); items.forEach(([x, y, k, rot, fn]) => popIn(g, x, y, k, rot, () => { box(g, -170, -180, 340, 360, '#fffaf0', 12); circle(g, 0, -178, 20, '#d0342a'); fn(); })); }
// f: favourite movie, previous jobs, what they ate at a festival
reg('f', { draw(g, t, info) { const a = at(info, 'movie', 1.6) - 0.35, b = at(info, 'jobs', 3.3) - 0.35, c = at(info, 'ate', 4.2) - 0.1;
  const movie = () => { box(g, -110, -60, 220, 150, '#2a2a36', 14); box(g, -110, -100, 220, 44, '#fffaf0', 8); for (let i = 0; i < 4; i++) box(g, -100 + i * 58, -100, 28, 44, INK, 4, 0); hw(g, 'fave film', 0, 150, 60); };
  const jobs = () => { D.briefcase(g, 0, 70, 1.4, {}); hw(g, 'old jobs', 0, 150, 60); };
  const food = () => { circle(g, 0, -30, 95, '#e8a04a'); for (let i = 0; i < 5; i++) circle(g, -40 + i * 22, -60 + (i % 2) * 50, 18, '#c0442c'); hw(g, 'lunch, 3 yrs ago', 0, 150, 52); };
  cam(g, t, info.dur, [1.12, 0.4, 0.5], [1.12, 0.6, 0.5], () => { board(g, t, [[470, 520, prog(t, a, a + 0.3), -0.06, movie], [960, 470, prog(t, b, b + 0.3), 0.04, jobs], [1450, 540, prog(t, c, c + 0.3), -0.03, food]]);
    if (t > b) seg(g, [[470, 342], [960, 292]], 6, '#d0342a'); if (t > c) seg(g, [[960, 292], [1450, 362]], 6, '#d0342a'); });
  vig(g, 0.45); } });

// g: everything except what they'd think of your drawings
reg('g', { draw(g, t, info) { const te = at(info, 'except', 1.2);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.3, 0.5, 0.5], () => { board(g, t, []); for (let i = 0; i < 10; i++) { const x = [330, 330, 330, 620, 620, 1300, 1300, 1590, 1590, 1590][i], y = [250, 540, 830, 330, 760, 330, 760, 250, 540, 830][i]; note(g, x, y, 0.48, { rot: ((i * 3) % 5 - 2) * 0.08 }); seg(g, [[x, y], [960, 540]], 4, alpha('#d0342a', 0.55)); }
    const k = ease.outBack(prog(t, te, te + 0.35)); if (k > 0) { g.save(); g.translate(960, 540); g.scale(k, k); box(g, -220, -250, 440, 500, '#241a26', 20); glow(g, 0, 0, 300, '#ffe27a', 0.25); text(g, '?', 0, 10, { size: 300, color: '#ffe27a' }); g.restore(); } });
  vig(g, 0.55); } });

// h: day seventeen. a completely new style.
reg('h', { draw(g, t, info) { const tn = at(info, 'new', 4.0) - 0.4; const i = t < tn ? 0 : 1 + Math.floor((t - tn) * 3) % 3;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.15, 0.55, 0.52], () => { morning(g, t, { frames: false }); for (let k = 0; k < 4; k++) { const x = 820 + k * 250, y = 330 + (k % 2) * 90; page(g, x, y, 0.55, (k + i) % 4, { rot: ((k % 3) - 1) * 0.08 }); if (i && k === i) { g.save(); g.globalAlpha = 0.45; circle(g, x, y, 90, ['#ff5aa0', '#3ac8e8', '#ffd23a'][i % 3]); g.restore(); } }
    sideTable(g, 1280, 975, 700, 240); D.glass(g, 1500, 735, 0.7, { fill: 0.5 }); D.bookStack(g, 1100, 735, 0.8, {});
    drawToon(g, { x: 430, y: 985, s: 2.6, cast: HERO, actions: [[0, 'think'], [tn, 'explain']], t, facing: 1, yaw: 0.55, expr: t < tn ? 'thinking' : 'excited', look: [0.7, -0.3] }); });
  dayCard(g, 17, prog(t, 0.05, 0.35), 250, 220); vig(g, 0.25); } });

// i: so you buy new pens
reg('i', { draw(g, t, info) { const to = at(info, 'buy', 0.4) - 0.1; const k = ease.inOut(prog(t, to, to + 0.6));
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.2, 0.5, 0.52], () => { tableTop(g, t, '#3a2a62', '#120a28'); folder(g, 1620, 1000, 0.4, { rot: 0.1 });
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 9; i++) { const a = -Math.PI / 2 + (i - 4) * 0.22 + Math.sin(t + i) * 0.03; g.beginPath(); g.moveTo(960, 760); g.lineTo(960 + Math.cos(a - 0.06) * 1200, 760 + Math.sin(a - 0.06) * 1200); g.lineTo(960 + Math.cos(a + 0.06) * 1200, 760 + Math.sin(a + 0.06) * 1200); g.closePath(); g.fillStyle = alpha('#ffe9a0', 0.13 * k); g.fill(); } g.restore();
    box(g, 560, 680, 800, 230, '#2a1a22', 26); ['#e0442c', '#f2862a', '#ffd23a', '#7ac04a', '#2fb0a0', '#3a78d0', '#6a52c8', '#c052a8'].forEach((c, i) => { const y = 700 - k * (30 + (i % 2) * 24); box(g, 615 + i * 90, y, 56, 170, c, 22); g.beginPath(); g.moveTo(615 + i * 90, y + 6); g.lineTo(643 + i * 90, y - 56); g.lineTo(671 + i * 90, y + 6); g.closePath(); g.fillStyle = '#f4d8a8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); });
    g.save(); g.translate(560, 680 - k * 240); g.rotate(-k * 0.35); box(g, 0, -30, 800, 60, '#4a2a3a', 18); g.restore(); glow(g, 960, 640, 560, '#fff2b0', 0.4 * k); for (let i = 0; i < 12; i++) D.star(g, 480 + i * 90, 340 + (i % 3) * 80, 0.3 * k * (0.6 + 0.4 * Math.sin(t * 6 + i)), { t }); });
  vig(g, 0.45); } });
