// V06 Clip 11: "We read every folder", which Monday, day thirteen, the six words.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, SAM, MOM } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { slapLines, noteWall, clockOn, hand, fairyLights } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, nightRoom, morning, jar, dayCard, popIn, note, rug, sideTable, tableTop, folder, page, studioFront, paperSign } from '/engine/v06.js';

// a: we read every folder. bring it in person.
reg('a', { draw(g, t, info) { const tb = at(info, 'bring', 2.0);
  cam(g, t, info.dur, [1.15, 0.62, 0.55], [1.42, 0.62, 0.57], () => { studioFront(g, t); paperSign(g, 1190, 620, 1.25);
    const y = t < tb ? 590 : 662; g.fillStyle = alpha('#ffe14a', 0.4); g.fillRect(920, y - 4, 540 * prog(t, t < tb ? 0.3 : tb, t < tb ? 1.4 : tb + 0.9), 54); });
  veil(g, '#ffcf8a', 0.1); vig(g, 0.45); } });

// b: you went home and started preparing
reg('b', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.14, 0.55, 0.55], () => { morning(g, t); sideTable(g, 1180, 975, 820, 260); page(g, 1000, 700, 0.5, 0, { rot: -0.2 }); page(g, 1200, 705, 0.5, 1, { rot: 0.1 }); page(g, 1400, 700, 0.5, 3, { rot: -0.05 }); D.mug(g, 840, 715, 0.8, { t }); D.deskLamp(g, 1540, 715, 0.8, {});
    drawToon(g, { x: 520, y: 985, s: 2.6, cast: HERO, actions: [[0, 'reach'], [1.2, 'handsHips']], t, facing: 1, yaw: 0.6, expr: 'excited', look: [0.7, 0.2] }); for (let i = 0; i < 5; i++) D.star(g, 900 + i * 150, 460 + (i % 2) * 60, 0.3 * prog(t, 0.4 + i * 0.1, 0.8 + i * 0.1), { t }); });
  vig(g, 0.25); } });

// c: you told everyone you'd go on Monday
reg('c', { draw(g, t, info) { const tm = at(info, 'monday', 1.8) - 0.1;
  cam(g, t, info.dur, [1.14, 0.5, 0.55], [1.0, 0.5, 0.5], () => { morning(g, t, { window: false }); box(g, 120, 150, 380, 360, '#8fd0f4', 18, 10);
    drawToon(g, { x: 960, y: 990, s: 2.55, cast: HERO, action: 'explain', t, facing: 1, yaw: 0.15, expr: 'confident' });
    drawToon(g, { x: 440, y: 990, s: 2.4, cast: MOM, action: 'clap', t, facing: 1, yaw: 0.6, expr: 'happy' }); drawToon(g, { x: 1480, y: 990, s: 2.45, cast: SAM, action: 'thumbsUp', t, facing: -1, yaw: 0.6, expr: 'excited' });
    popIn(g, 960, 230, prog(t, tm, tm + 0.3), -0.05, () => { box(g, -250, -105, 500, 210, '#fffaf0', 100); hw(g, 'Monday!', 0, 38, 120, '#d0442c'); }); });
  vig(g, 0.25); } });

// d: you never said which Monday
reg('d', { draw(g, t, info) { const tw = at(info, 'which', 1.2); const pan = ease.in(prog(t, 0, info.dur));
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.5], () => { grad(g, [[0, '#2a3a5a'], [1, '#121c30']]); D.plant(g, 120, 1060, 1.3, { kind: 'leafy', t });
    for (let i = 0; i < 14; i++) { const x = ((i * 330 - pan * 1700) % 4620 + 4620) % 4620 - 300; g.save(); g.translate(x, 520 + Math.sin(i) * 40); g.rotate(Math.sin(i * 2) * 0.05); box(g, -140, -180, 280, 360, '#fffaf0', 22); box(g, -140, -180, 280, 90, '#e8643c', 22); text(g, 'MON', 0, -133, { size: 54, color: '#fffaf0' }); text(g, String(((i * 7) % 28) + 1), 0, 45, { size: 130, color: INK }); g.restore(); }
    popIn(g, 960, 900, prog(t, tw, tw + 0.3), 0.03, () => { box(g, -340, -75, 680, 150, '#ffd64a', 30); hw(g, 'which one?', 0, 34, 110); }); });
  vig(g, 0.45); } });

// e: now it's day thirteen. you pick up the pen.
reg('e', { draw(g, t, info) { const td = at(info, 'day', 0.8), tp = at(info, 'pick', 2.0);
  const sh = t > 0.25 ? Math.exp(-(t - 0.25) * 8) * Math.sin(t * 80) * 14 : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.52, 0.48], () => { g.translate(sh, 0); noteWall(g, t, { lamp: 0.7 }); rug(g, 960, 1015, 470); clockOn(g, 720, 320, 100, 12, 0); jar(g, 1650, 975, 0.5, 12); sideTable(g, 330, 975, 300, 170); D.mug(g, 330, 805, 0.7, { t });
    if (t > 0.25) { note(g, 1140, 480, 1.0 * lerp(1.8, 1, ease.in(prog(t, 0.25, 0.39))), { rot: -0.04 }); slapLines(g, 1140, 480, prog(t, 0.37, 0.8), 250); }
    drawToon(g, { x: 680, y: 985, s: 2.5, cast: HERO, actions: [[0, 'idle'], [tp, 'reach']], t, facing: 1, yaw: 0.65, expr: t < tp ? 'nervous' : 'determined', look: [0.8, -0.1] }); });
  popIn(g, 960, 130, prog(t, td, td + 0.3), -0.03, () => hw(g, 'Day 13', 0, 40, 150, '#ff9a5a', 12)); vig(g, 0.6); } });

// f: you consider cleaning the windows
reg('f', { draw(g, t, info) { const tw = at(info, 'windows', 2.1) - 0.3, t2 = at(info, 'windows', 3.1, 1) - 0.3;
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.55, 0.45], () => { nightRoom(g, t); box(g, 640, 120, 900, 640, '#0a1630', 18, 14); circle(g, 1320, 260, 70, '#f2f0d6'); glow(g, 1320, 260, 340, '#bfe4ff', 0.35); seg(g, [[1090, 120], [1090, 760]], 14, '#e9dcc4'); seg(g, [[640, 440], [1540, 440]], 14, '#e9dcc4'); box(g, 600, 750, 980, 40, '#e9dcc4', 12);
    const r = rng(3); const wipe = prog(t, t2, info.dur); for (let i = 0; i < 26; i++) { const x = 680 + r() * 820, y = 160 + r() * 560; circle(g, x, y, 8 + r() * 22, alpha('#9a9a8a', x < 680 + wipe * 900 ? 0.04 : 0.4)); }
    box(g, 1560, 880, 130, 100, '#5ab0d8', 16); D.bottle(g, 1750, 975, 1.0, {});
    drawToon(g, { x: 430, y: 985, s: 2.5, cast: HERO, actions: [[0, 'think'], [t2, 'reach']], t, facing: 1, yaw: 0.65, expr: t < t2 ? 'curious' : 'excited', look: [0.8, -0.3] });
    if (t > tw) for (let i = 0; i < 6; i++) D.star(g, 760 + i * 130, 240 + (i % 3) * 150, 0.3 * ease.outBack(prog(t, tw + i * 0.1, tw + 0.4 + i * 0.1)), { t }); });
  vig(g, 0.5); } });

// g: instead, you write six words
reg('g', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.48], [1.2, 0.5, 0.45], () => { noteWall(g, t, { lamp: 0.5 }); veil(g, '#04101a', 0.45); D.plant(g, 230, 1060, 1.2, { kind: 'leafy', t }); jar(g, 1680, 1050, 0.55, 12); });
  cam(g, t, info.dur, [1.0, 0.5, 0.45], [1.18, 0.5, 0.42], () => bigToonFace(g, 960, 590, 270, { cast: HERO, expr: t < 1.0 ? 'nervous' : 'determined', t, look: [0, 0.3] })); vig(g, 0.65); } });

// h: "Take the folder to the studio." the ink dries
reg('h', { draw(g, t, info) { const words = ['Take', 'the', 'folder', 'to', 'the', 'studio.'], ts = [at(info, 'take', 0.1), at(info, 'the', 0.35), at(info, 'folder', 0.5), at(info, 'to', 0.9), at(info, 'the', 1.05, 1), at(info, 'studio', 1.25)];
  const ti = at(info, 'ink', 2.1); cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.18, 0.5, 0.52], () => { tableTop(g, t, '#1d5560', '#0a1c26'); note(g, 960, 540, 2.2, { rot: -0.02, curl: 0.08 });
    const pos = [[700, 400], [990, 400], [1180, 400], [740, 560], [900, 560], [1120, 560]];
    words.forEach((w, i) => { const k = prog(t, ts[i], ts[i] + 0.22); if (k <= 0) return; const [x, y] = [[760, 430], [960, 430], [1160, 430], [750, 580], [920, 580], [1130, 580]][i]; const n = Math.ceil(k * w.length); hw(g, w.slice(0, n), x, y, i === 5 ? 120 : 108); });
    const k = prog(t, ts[0], ts[5] + 0.3); if (t < ti) { const px = lerp(780, 1280, k), py = k < 0.5 ? 470 : 640; seg(g, [[px, py], [px + 140, py + 140]], 28, INK); seg(g, [[px + 8, py + 8], [px + 132, py + 132]], 14, '#4a78b8'); hand(g, px + 130, py + 140, [420, 360], {}); }
    else { const s = prog(t, ti, ti + 0.7); if (s < 1) { g.save(); g.globalAlpha = 0.45; seg(g, [[620 + s * 640, 300], [520 + s * 640, 780]], 36, '#ffffff'); g.restore(); } } });
  vig(g, 0.5); } });

// i: and immediately you wish you'd written something about the windows
reg('i', { draw(g, t, info) { const tw = at(info, 'wish', 1.2), tv = at(info, 'windows', 3.4) - 0.2;
  nightRoom(g, t); veil(g, '#06101a', 0.25); note(g, 1640, 520, 0.6, { rot: 0.06, text: ['take the', 'folder...'], size: 62 }); D.mug(g, 330, 1050, 1.1, { t });
  cam(g, t, info.dur, [1.05, 0.5, 0.45], [1.2, 0.46, 0.45], () => bigToonFace(g, 900, 580, 275, { cast: HERO, expr: t < tw ? 'shocked' : 'worried', t, look: [t > tv ? -0.8 : 0.5, 0] }));
  popIn(g, 270, 300, prog(t, tv, tv + 0.3), -0.08, () => { box(g, -170, -170, 340, 340, '#8fd0f4', 16, 12); seg(g, [[0, -170], [0, 170]], 12, '#fff'); seg(g, [[-170, 0], [170, 0]], 12, '#fff'); D.star(g, 80, -80, 0.6, { t }); }); vig(g, 0.5); } });
