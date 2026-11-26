// V06 Clip 7: midnight delivery, the "blink" loophole, the jar spits it back, then days 7-9.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, SAM } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { slapLines, noteWall, clockOn, hand, fairyLights } from '/engine/notewall.js';
import { place, floorY, fg } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, morning, nightRoom, bed, jar, dayCard, tableTop, popIn, note, rug, sideTable } from '/engine/v06.js';

// a: your wall delivers stationery at midnight
reg('a', { draw(g, t, info) { const t0 = Math.max(0.4, at(info, 'wall', 2.4) - 0.1);
  const sh = t > t0 ? Math.exp(-(t - t0) * 8) * Math.sin(t * 80) * 16 : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.15, 0.5, 0.5], () => { g.translate(sh, 0); nightRoom(g, t); clockOn(g, 1180, 240, 100, t < t0 ? 11 : 12, t < t0 ? 59 : 0); const up = t > t0;
    bed(g, 660, 960, '#4a8ab0', () => drawToon(g, { x: 470, y: 1000 - (up ? Math.abs(Math.sin((t - t0) * 7)) * 60 * Math.exp(-(t - t0) * 3) : 0), s: 2.1, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: up ? 'shocked' : 'sleeping' }));
    if (up) { note(g, 800, 430, 0.62 * lerp(1.8, 1, ease.in(prog(t, t0, t0 + 0.14))), { rot: -0.06 }); slapLines(g, 800, 430, prog(t, t0 + 0.12, t0 + 0.5), 170); }
    sideTable(g, 1400, 975, 250, 200); D.alarmClock(g, 1400, 775, 0.7, { ring: up, t }); D.sneaker(g, 1700, 985, 0.9, {}); });
  vig(g, 0.55); } });

// b: you discover a potential loophole
reg('b', { draw(g, t, info) { const tl = at(info, 'loophole', 2.2) - 0.1; noteWall(g, t); fairyLights(g, t, 50); veil(g, '#06101a', 0.25); D.plant(g, 230, 1050, 1.3, { kind: 'leafy', t }); jar(g, 1640, 1010, 0.7, 6); D.bookStack(g, 430, 1060, 1.0, {});
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.2, 0.5, 0.45], () => { bigToonFace(g, 960, 600, 260, { cast: HERO, expr: t < tl ? 'suspicious' : 'smugAside', t, look: [t < tl ? 0.6 : 0, -0.2] }); popIn(g, 960, 150, prog(t, tl, tl + 0.3), 0, () => { glow(g, 0, 0, 260, '#ffe27a', 0.6); D.bulb(g, 0, 20, 1.2, { on: true, t }); }); });
  vig(g, 0.5); } });

// c: you write "blink". you blink.
reg('c', { draw(g, t, info) { const tw = at(info, 'blink', 0.6), tb = at(info, 'blink', 2.2, 1); const split = at(info, 'you', 1.8, 1) - 0.1;
  if (t < split) { cam(g, t, split, [1.05, 0.5, 0.5], [1.18, 0.5, 0.52], () => { tableTop(g, t, '#1d5560', '#0a1c26'); note(g, 960, 540, 1.65, { rot: -0.03, text: ['blink'], k: prog(t, 0.1, tw + 0.4), size: 120 }); const k = prog(t, 0.1, tw + 0.4), px = 800 + k * 300, py = 640; seg(g, [[px, py], [px + 140, py + 140]], 28, INK); seg(g, [[px + 8, py + 8], [px + 132, py + 132]], 14, '#4a78b8'); hand(g, px + 130, py + 140, [420, 360], {}); }); }
  else { const shut = (t > tb && t < tb + 0.22) || (t > tb + 0.4 && t < tb + 0.52); grad(g, [[0, '#17404c'], [1, '#0a1620']]); fairyLights(g, t, 60); D.deskLamp(g, 280, 1050, 1.5, { on: true }); note(g, 1630, 520, 0.55, { rot: 0.08, text: 'blink', size: 100 }); jar(g, 1640, 1030, 0.55, 6);
    cam(g, t - split, info.dur - split, [1.1, 0.5, 0.45], [1.25, 0.5, 0.43], () => bigToonFace(g, 960, 580, 280, { cast: HERO, expr: shut ? 'relieved' : t < tb ? 'focused' : 'smugAside', t, blink: shut })); }
  vig(g, 0.5); } });

// d: the note folds, flies to the jar, spat back at your forehead
reg('d', { draw(g, t, info) { const tf = at(info, 'folds', 0.5), tl = at(info, 'flies', 1.3), tg = at(info, 'gets', 2.7), th = at(info, 'forehead', 4.8);
  const hitT = th - 0.1; const sh = t > hitT ? Math.exp(-(t - hitT) * 8) * Math.sin(t * 70) * 14 : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.52], [1.12, 0.5, 0.5], () => { g.translate(sh, 0); nightRoom(g, t); rug(g, 960, 1005, 460); sideTable(g, 1420, 975, 340, 220); const bulge = t > tg - 0.2 && t < tg + 0.3 ? Math.sin(prog(t, tg - 0.2, tg + 0.3) * Math.PI) * 0.18 : 0; g.save(); g.translate(1420, 755); g.scale(1 + bulge, 1 - bulge * 0.5); jar(g, 0, 0, 0.8, 6); g.restore(); D.plant(g, 1750, 975, 1.0, { kind: 'leafy', t });
    drawToon(g, { x: 520, y: 985, s: 2.6, cast: HERO, actions: [[0, 'idle'], [hitT, 'recoil']], t, facing: 1, yaw: 0.55, expr: t < tg ? 'smugAside' : t < hitT ? 'surprised' : 'annoyed', look: [0.8, -0.1] });
    const hx = 560, hy = 480; let x = 900, y = 520, s = 0.7, r = -0.05;
    if (t >= tf && t < tl) { const k = prog(t, tf, tl); s = lerp(0.7, 0.28, k); r = k * 6.28; }
    else if (t >= tl && t < tg) { const k = ease.inOut(prog(t, tl, tl + 0.8)); x = lerp(900, 1420, k); y = lerp(520, 640, k) - Math.sin(k * Math.PI) * 330; s = 0.26; r = k * 9; if (k >= 1) s = 0; }
    else if (t >= tg && t < hitT) { const k = ease.in(prog(t, tg, hitT)); x = lerp(1420, hx, k); y = lerp(400, hy, k) - Math.sin(k * Math.PI) * 200; s = 0.28; r = -k * 14; seg(g, [[x + 60, y], [x + 220, y - 20]], 10, alpha('#fff4d0', 0.7)); }
    else if (t >= hitT) { x = hx + 40; y = hy; s = 0.34; r = 0.25; }
    if (s > 0) note(g, x, y, s, { rot: r, curl: 0.2 }); if (t > hitT) { slapLines(g, hx + 40, hy, prog(t, hitT, hitT + 0.45), 120); popIn(g, 860, 280, prog(t, hitT, hitT + 0.25), -0.12, () => hw(g, 'nope.', 0, 0, 160, '#ff9a5a', 10)); } });
  vig(g, 0.5); } });

// e: the task has to fix something that needs fixing
reg('e', { draw(g, t, info) { const tf = at(info, 'fix', 1.8);
  cam(g, t, info.dur, [1.16, 0.5, 0.5], [1.0, 0.5, 0.5], () => { noteWall(g, t); fairyLights(g, t, 50); rug(g, 960, 1015, 470); sideTable(g, 320, 975, 300, 170); jar(g, 320, 806, 0.42, 6); D.backpack(g, 1600, 975, 0.9, {});
    note(g, 960, 460, 1.25, { rot: -0.03 }); const fade = prog(t, 0.2, 1.0); g.save(); g.globalAlpha = 1 - fade; hw(g, 'blink', 960, 490, 130); g.restore();
    popIn(g, 960, 760, prog(t, tf - 0.1, tf + 0.25), -0.02, () => { box(g, -420, -70, 840, 140, '#fff3d6', 30); hw(g, 'it must need fixing', 0, 28, 88); }); });
  vig(g, 0.55); } });

// f: fine. you can work with that.
reg('f', { draw(g, t, info) { nightRoom(g, t); jar(g, 1650, 940, 0.65, 6); D.mug(g, 300, 940, 1.0, { t }); veil(g, '#06101a', 0.2);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.45], () => bigToonFace(g, 960, 580, 270, { cast: HERO, expr: t < 0.8 ? 'deadpan' : 'determined', t })); vig(g, 0.5); } });

// g: day seven, you arrive early (classroom)
reg('g', { draw(g, t, info) { const f = floorY('classroom'); cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.15, 0.5, 0.55], () => { place(g, 'classroom', t, { look: 'snow' });
    drawToon(g, { x: lerp(250, 760, ease.out(prog(t, 0, 1.4))), y: f + 20, s: 2.4, cast: HERO, actions: [[0, 'walk'], [1.4, 'wave']], t, facing: 1, yaw: 0.55, expr: 'friendly' }); fg(g, 'classroom', t, { look: 'snow' }); clockOn(g, 1640, 250, 95, 7, 45); });
  dayCard(g, 7, prog(t, 0.05, 0.35), 250, 220); vig(g, 0.25); } });

// h: haircut? you haven't. you've just slept.
reg('h', { draw(g, t, info) { const f = floorY('classroom'), th = at(info, 'haircut', 1.3), tn = at(info, 'havent', 2.3), ts = at(info, 'slept', 3.6);
  cam(g, t, info.dur, [1.18, 0.5, 0.55], [1.04, 0.5, 0.55], () => { place(g, 'classroom', t, { look: 'snow' });
    drawToon(g, { x: 560, y: f + 30, s: 2.6, cast: HERO, actions: [[0, 'idle'], [tn, 'shrug']], t, facing: 1, yaw: 0.5, expr: t < tn ? 'curious' : t < ts ? 'awkward' : 'confident', look: [0.7, 0] });
    drawToon(g, { x: 1340, y: f + 30, s: 2.55, cast: SAM, actions: [[0, 'idle'], [0.4, 'point'], [tn, 'think']], t, facing: -1, yaw: 0.55, expr: t < tn ? 'surprised' : 'confused' });
    if (t < tn) popIn(g, 1220, 260, prog(t, th - 0.4, th - 0.1), 0.05, () => { box(g, -170, -110, 340, 220, '#fffaf0', 100); seg(g, [[-70, -30], [60, 40]], 14, INK); seg(g, [[-70, 40], [60, -30]], 14, INK); for (const d of [-1, 1]) { g.strokeStyle = '#d0442c'; g.lineWidth = 14; g.beginPath(); g.arc(-96, d * 44, 28, 0, 7); g.stroke(); } hw(g, '?', 110, 34, 120); });
    if (t > ts - 0.15) popIn(g, 600, 230, prog(t, ts - 0.15, ts + 0.15), -0.05, () => { box(g, -180, -100, 360, 200, '#233a6a', 90); circle(g, -60, 0, 52, '#ffe27a'); circle(g, -36, -14, 46, '#233a6a'); text(g, 'Zzz', 60, 8, { size: 80, color: '#fffaf0' }); }); fg(g, 'classroom', t, { look: 'snow' }); });
  vig(g, 0.25); } });

// i: day eight, return the library book. day nine.
reg('i', { draw(g, t, info) { const t9 = at(info, 'nine', 3.2) - 0.3;
  if (t < t9) { cam(g, t, t9, [1.0, 0.5, 0.5], [1.14, 0.5, 0.52], () => { grad(g, [[0, '#caa070'], [1, '#e8cca0']]); for (let r = 0; r < 3; r++) { box(g, 80, 130 + r * 220, 1760, 26, '#7a4a30', 8); for (let i = 0; i < 26; i++) { const h = 110 + ((i * 41 + r * 17) % 60); box(g, 110 + i * 66, 130 + r * 220 - h, 52, h, ['#4a78b8', '#e8704a', '#5ab0a0', '#d8d0c0', '#8a5ac0'][(i + r) % 5], 6, 4); } } floor(g, 920, '#8a5a38', false); box(g, 700, 720, 760, 210, '#a8704a', 18); const k = ease.out(prog(t, 0.5, 1.3)); D.book(g, lerp(380, 1050, k), 720, 1.8, { title: 'DUE' }); drawToon(g, { x: 440, y: 985, s: 2.5, cast: HERO, actions: [[0, 'reach'], [1.4, 'handsHips']], t, facing: 1, yaw: 0.55, expr: 'awkward' }); D.bell(g, 1340, 640, 0.7, {}); }); dayCard(g, 8, prog(t, 0.05, 0.35), 1670, 820); }
  else { const u = t - t9; morning(g, u); sideTable(g, 960, 975, 600, 260); D.phone(g, 960, 560, 0.8, { screen: 'chat', name: 'old friend', msgs: ['you ok?'], t: u }); D.mug(g, 760, 715, 0.8, { t }); dayCard(g, 9, prog(u, 0, 0.3), 1650, 640); }
  vig(g, 0.25); } });
