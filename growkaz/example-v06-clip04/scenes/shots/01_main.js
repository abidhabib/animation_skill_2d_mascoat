// V06 Clip 4: the rules. Ink is permanent, the note folds into the jar, the old one stays; "become rich" -> "Start where?"
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, note, hand, clockOn, slapLines, sideTable, rug, fairyLights, INK } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';

const W = () => E.W, H = () => E.H;
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const hw = (g, s, x, y, size, color = '#33231c') => text(g, s, x, y, { size, color, family: 'Caveat', weight: 700 });
const at = (info, word, dflt) => { const w = E.words.find((w) => w.start >= info.shot.start - 0.15 && w.start <= info.shot.end && w.word.toLowerCase().replace(/[^a-z]/g, '') === word); return w ? w.start - info.shot.start : dflt; };
function pen(g, x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, 0], [150, 150]], 28, INK); seg(g, [[8, 8], [142, 142]], 14, '#4a78b8'); g.restore(); }
// wooden desk seen from above, with supporting objects round the edges
function desk(g, t, tint = '#ffd98a') { grad(g, [[0, '#6a4430'], [1, '#34180f']]); for (let i = 0; i < 8; i++) seg(g, [[-100, i * 150 + 40], [2100, i * 150 + 60]], 5, alpha(INK, 0.3)); glow(g, 960, 420, 760, tint, 0.35);
  D.deskLamp(g, 250, 690, 1.6, { on: true }); D.mug(g, 1650, 500, 1.5, { t }); D.bookStack(g, 1660, 960, 1.2, {}); D.plant(g, 300, 1040, 1.15, { kind: 'round', t }); }
// the glass jar; n folded notes inside
function jar(g, x, y, s, n) { g.save(); g.translate(x, y); g.scale(s, s); for (let i = 0; i < n; i++) note(g, -110 + (i % 4) * 74 + (Math.floor(i / 4) % 2) * 16, -55 - Math.floor(i / 4) * 80, 0.24, { rot: ((i * 7) % 5 - 2) * 0.18 });
  rr(g, -200, -400, 400, 400, 66); g.fillStyle = 'rgba(190,235,250,.2)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); box(g, -165, -445, 330, 56, 'rgba(190,235,250,.35)', 16); seg(g, [[-160, -330], [-160, -100]], 18, 'rgba(255,255,255,.75)'); g.restore(); }
function nightShelf(g, t) { noteWall(g, t); fairyLights(g, t, 50); rug(g, 960, 1015, 470); }

// a: once the ink dries, it is permanent
reg('a', { draw(g, t, info) { const tp = at(info, 'permanent', 2.4);
  cam(g, t, info.dur, [1.05, 0.5, 0.5], [1.2, 0.5, 0.52], () => { desk(g, t); note(g, 960, 540, 1.65, { rot: -0.03, text: ['1 thing'], size: 88 });
    // shine sweeping across the wet ink, then it goes matte
    const sw = prog(t, 0.2, 1.3); if (sw > 0 && sw < 1) { g.save(); g.globalAlpha = 0.55; seg(g, [[700 + sw * 520, 360], [620 + sw * 520, 720]], 30, '#ffffff'); g.restore(); }
    const k = prog(t, tp - 0.1, tp + 0.18); if (k > 0) { const s = lerp(2.2, 1, ease.in(k)); g.save(); g.translate(1130, 700); g.rotate(-0.2); g.scale(s, s); g.globalAlpha = k; g.strokeStyle = '#c0281c'; g.lineWidth = 12; g.strokeRect(-230, -70, 460, 140); text(g, 'PERMANENT', 0, 6, { size: 70, color: '#c0281c' }); g.restore(); } });
  vig(g, 0.5); } });

// b: no crossing out. no changing your mind.
reg('b', { draw(g, t, info) { const t2 = at(info, 'no', 0) , tc = at(info, 'changing', 1.6);
  cam(g, t, info.dur, [1.18, 0.5, 0.52], [1.04, 0.5, 0.5], () => { desk(g, t, '#ffb070'); note(g, 960, 540, 1.65, { rot: -0.03, text: ['1 thing'], size: 88 }); D.alarmClock(g, 1360, 300, 0.9, { t });
    const k = prog(t, 0.35, 0.9); if (k > 0) { const px = lerp(760, 1180, k), py = 560 + Math.sin(k * 20) * 26; // the line refuses to stick
      g.save(); g.globalAlpha = 1 - prog(t, 0.9, 1.2); g.setLineDash([26, 30]); seg(g, [[760, 560], [px, py]], 12, '#4a78b8'); g.setLineDash([]); g.restore(); pen(g, px, py); hand(g, px + 140, py + 150, [420, 360], {}); }
    if (t > tc) { const u = t - tc, y = 340 - Math.sin(clamp(u / 0.5) * Math.PI) * 90; box(g, 1150, y - 55, 250, 110, '#f4a0b0', 28); box(g, 1150, y - 55, 90, 110, '#4a78b8', 28); }
    const x = ease.outBack(prog(t, tc + 0.35, tc + 0.65)); if (x > 0) for (const d of [-1, 1]) seg(g, [[960 - 260 * x, 540 - d * 220 * x], [960 + 260 * x, 540 + d * 220 * x]], 34, alpha('#d0342a', 0.92)); });
  vig(g, 0.55); } });

// c: rule three
reg('c', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.46], () => { nightShelf(g, t); sideTable(g, 290, 975, 300, 170); D.mug(g, 290, 805, 0.7, { t }); D.backpack(g, 1590, 975, 0.95, {});
    note(g, 960, 480, 1.5 * lerp(1.7, 1, prog(t, 0.05, 0.2)), { rot: -0.02 }); text(g, '3', 840, 360, { size: 110, color: '#33231c' }); D.tick(g, 975, 510, 1.8 * ease.outBack(prog(t, 0.3, 0.65)), {}); slapLines(g, 960, 480, prog(t, 0.17, 0.6), 330); });
  vig(g, 0.55); } });

// d: finish the task -> it folds into a square and drops into the jar
reg('d', { draw(g, t, info) { const tf = at(info, 'folds', 1.6), td = at(info, 'drops', 3.6), tj = at(info, 'jar', 5.1);
  cam(g, t, info.dur, [1.12, 0.45, 0.45], [1.0, 0.5, 0.52], () => { grad(g, [[0, '#17404c'], [1, '#0a1c26']]); fairyLights(g, t, 60); g.fillStyle = '#7a4a30'; g.fillRect(-W(), 900, W() * 3, H()); seg(g, [[-W(), 900], [W() * 2, 900]], 8, INK); glow(g, 960, 400, 760, '#ffd98a', 0.3);
    D.deskLamp(g, 250, 900, 1.5, { on: true }); D.bookStack(g, 560, 905, 1.0, {}); D.plant(g, 1730, 905, 1.2, { kind: 'leafy', t }); D.mug(g, 1020, 915, 0.9, { t });
    const k = ease.inOut(prog(t, tf, tf + 1.2)), fly = ease.inOut(prog(t, td - 0.55, td + 0.35)), sink = ease.in(prog(t, td + 0.35, tj + 0.1));
    jar(g, 1400, 900, 1.15, 3 + (sink >= 1 ? 1 : 0));
    if (sink < 1) { const s = lerp(1.3, 0.34, k), x = lerp(700, 1400, fly), y = lerp(450, 330, fly) - Math.sin(fly * Math.PI) * 220 + sink * 450; note(g, x, y, s * (1 - 0.25 * Math.sin(k * Math.PI)), { rot: k * 6.28 + fly, curl: 0.12 + k * 0.2, sx: 1 - 0.6 * Math.abs(Math.sin(k * Math.PI * 2)) }); if (k <= 0) D.tick(g, 700, 480, 1.4 * ease.outBack(prog(t, 0.4, 0.8)), {}); }
    if (t > tj) { slapLines(g, 1400, 780, prog(t, tj, tj + 0.45), 190); const c = ease.outBack(prog(t, tj, tj + 0.3)); g.save(); g.translate(1400, 270); g.rotate(-0.08); g.scale(c, c); hw(g, 'clink!', 0, 0, 120, '#ffe27a'); g.restore(); } });
  vig(g, 0.5); } });

// e: at midnight you get another
reg('e', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.55, 0.5], [1.15, 0.52, 0.45], () => { noteWall(g, t); fairyLights(g, t, 50); rug(g, 960, 1015, 470); clockOn(g, 720, 330, 120, t < 0.5 ? 11 : 12, t < 0.5 ? 59 : 0); sideTable(g, 330, 975, 300, 170); jar(g, 330, 806, 0.42, 4); D.backpack(g, 1590, 975, 0.95, {});
    const t0 = 0.85; if (t > t0) { note(g, 1140, 480, 1.0 * lerp(1.8, 1, ease.in(prog(t, t0, t0 + 0.14))), { rot: -0.04 }); slapLines(g, 1140, 480, prog(t, t0 + 0.12, t0 + 0.5), 250); } });
  vig(g, 0.55); } });

// f: if you don't finish it, the old note stays
reg('f', { draw(g, t, info) { const ts = at(info, 'stays', 2.4); const days = 1 + Math.floor(prog(t, 0.3, info.dur - 0.4) * 5.99);
  cam(g, t, info.dur, [1.05, 0.5, 0.5], [1.2, 0.56, 0.45], () => { noteWall(g, t, { lamp: 0.6 }); veil(g, '#06101a', 0.25); sideTable(g, 330, 975, 300, 170); D.mug(g, 330, 805, 0.7, {}); D.plant(g, 1580, 975, 1.0, { kind: 'leafy', t: t * 0.3 });
    note(g, 1140, 480, 1.05, { rot: -0.04 + Math.sin(t * 1.2) * 0.012, age: days > 2 ? 1 : 0, curl: 0.12 + days * 0.03 });
    box(g, 640, 280, 250, 270, '#fffaf0', 20); box(g, 640, 280, 250, 70, '#7a6a8a', 20); text(g, 'DAY', 765, 318, { size: 42, color: '#fffaf0' }); text(g, String(days), 765, 458, { size: 140, color: INK });
    if (t > ts - 0.1) D.pin(g, 1140, 330, 1.1 * ease.outBack(prog(t, ts - 0.1, ts + 0.2)), { color: '#e0302a' }); });
  vig(g, 0.6); } });

// g: you can still do other things throughout your day
reg('g', { draw(g, t, info) { cam(g, t, info.dur, [1.14, 0.45, 0.5], [1.0, 0.5, 0.5], () => { grad(g, [[0, '#ffe2b0'], [0.8, '#fff2d8'], [1, '#fff2d8']]); glow(g, 400, 250, 700, '#fff8c8', 0.7); g.fillStyle = '#c08a5a'; g.fillRect(-W(), 920, W() * 3, H()); seg(g, [[-W(), 920], [W() * 2, 920]], 8, INK);
    box(g, 160, 150, 380, 360, '#8fd0f4', 20, 10); circle(g, 420, 250, 58, '#ffe27a'); seg(g, [[350, 150], [350, 510]], 12, '#fff'); seg(g, [[160, 330], [540, 330]], 12, '#fff');
    D.book(g, 640, 930, 1.3, {}); D.bottle(g, 820, 925, 1.2, {}); D.sneaker(g, 1060, 935, 1.4, {}); D.laptop(g, 1620, 930, 1.3, {}); D.plant(g, 270, 925, 1.2, { kind: 'tall', t });
    drawToon(g, { x: 1340, y: 945, s: 2.5, cast: HERO, actions: [[0, 'idle'], [1.0, 'explain']], t, facing: -1, yaw: 0.5, expr: 'friendly' }); });
  motes(g, t, '#ffffff', 16); vig(g, 0.25); } });

// h: they just don't count toward the jar
reg('h', { draw(g, t, info) { const tc = at(info, 'count', 0.7);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.55, 0.52], () => { grad(g, [[0, '#17404c'], [1, '#0a1c26']]); fairyLights(g, t, 60); g.fillStyle = '#7a4a30'; g.fillRect(-W(), 900, W() * 3, H()); seg(g, [[-W(), 900], [W() * 2, 900]], 8, INK); D.deskLamp(g, 1700, 900, 1.4, { on: true }); jar(g, 1180, 900, 1.2, 4);
    [['book', 420], ['bottle', 570], ['sneaker', 740]].forEach(([n, x], i) => { const q = prog(t, 0.1 + i * 0.22, 0.75 + i * 0.22); const y = 880 - Math.sin(clamp(q) * Math.PI) * 340, xx = lerp(x, 900 - i * 40, Math.sin(clamp(q) * Math.PI) * 0.9); D[n](g, xx, y, 0.9, {}); });
    const k = ease.outBack(prog(t, tc, tc + 0.3)); if (k > 0) D.cross(g, 1180, 600, 2.2 * k, {}); });
  vig(g, 0.55); } });

// i: naturally, you try to become rich
reg('i', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.55, 0.45], () => { nightShelf(g, t); for (let i = 0; i < 6; i++) { const p = (t * 0.45 + i * 0.17) % 1; D.coin(g, 300 + i * 270, lerp(-60, 880, p), 0.55, { spin: true, t: t + i }); }
    note(g, 1120, 450, 1.1, { rot: -0.03, text: ['become', 'RICH'], k: prog(t, 0.7, 1.7), size: 80 }); drawToon(g, { x: 560, y: 975, s: 2.6, cast: HERO, actions: [[0, 'reach'], [1.7, 'handsHips']], t, facing: 1, yaw: 0.65, expr: t < 1.7 ? 'focused' : 'smugAside' }); D.cash(g, 1560, 940, 1.1, { rot: -0.1 }); });
  vig(g, 0.45); } });

// j: the ink disappears
reg('j', { draw(g, t, info) { cam(g, t, info.dur, [1.1, 0.5, 0.45], [1.28, 0.5, 0.45], () => { desk(g, t, '#ffd98a'); D.cash(g, 1380, 330, 0.9, { rot: 0.2 });
    const fade = prog(t, 0.2, 1.0); note(g, 960, 520, 1.65, { rot: -0.03 }); g.save(); g.globalAlpha = 1 - fade; g.translate(960, 540); hw(g, 'become', 0, -55, 130); hw(g, 'RICH', 0, 90, 150); g.restore();
    if (fade > 0 && fade < 1) for (let i = 0; i < 18; i++) circle(g, 760 + ((i * 53) % 400), 540 - fade * (100 + (i % 5) * 40) + (i % 3) * 40, 9 * (1 - fade), alpha('#33231c', 0.7)); });
  vig(g, 0.55); } });

// k: two words appear on the wall: Start where?
reg('k', { draw(g, t, info) { const ts = at(info, 'start', 2.0), tw = at(info, 'where', 2.45);
  cam(g, t, info.dur, [1.0, 0.5, 0.48], [1.24, 0.5, 0.58], () => { noteWall(g, t); fairyLights(g, t, 50); veil(g, '#04101a', 0.35); note(g, 960, 370, 0.95, { rot: -0.02 }); sideTable(g, 330, 975, 300, 170); D.mug(g, 330, 805, 0.7, { t }); D.backpack(g, 1590, 975, 0.9, {});
    [['Start', 780, ts], ['where?', 1130, tw]].forEach(([w, x, t0]) => { const k = prog(t, t0, t0 + 0.3); if (k <= 0) return; g.save(); g.translate(x, 720); g.beginPath(); g.rect(-230, -120, 460 * k, 240); g.clip(); glow(g, 0, 0, 190, '#ffe9b0', 0.25); text(g, w, 0, 0, { size: 150, color: '#fff3d6', family: 'Caveat', weight: 700, stroke: 10, strokeColor: '#0a1a22' }); g.restore(); }); });
  motes(g, t, '#ffe9b0', 20); vig(g, 0.62); } });

// l: even supernatural stationery has standards
reg('l', { draw(g, t, info) { grad(g, [[0, '#1d5560'], [1, '#0a1c26']]); fairyLights(g, t, 60); for (const [x, y, r] of [[330, 420, -0.1], [1610, 380, 0.12]]) note(g, x, y, 0.55, { rot: r + Math.sin(t * 1.4 + x) * 0.04 }); D.plant(g, 260, 1040, 1.3, { kind: 'leafy', t }); D.deskLamp(g, 1660, 1040, 1.5, { on: true }); D.bookStack(g, 1400, 1050, 1.0, {}); glow(g, 960, 420, 700, '#ffd98a', 0.2);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.5, 0.45], () => bigToonFace(g, 960, 560, 270, { cast: HERO, expr: t < 1.4 ? 'confused' : 'deadpan', t, look: [t < 1.4 ? 0.6 : 0, 0] }));
  vig(g, 0.5); } });
