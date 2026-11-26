// V06 Clip 15: paper moving with no wind; day twenty at Dad's repair shop.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, hand } from '/engine/notewall.js';
import { place } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, floor, nightRoom, bed, jar, dayCard, popIn, note, rug, sideTable, folder, page, studioFront, paperSign, dadShop, shopCounter, radio, rain, SHOP_COUNTER } from '/engine/v06.js';

const flutter = (g, x, y, s, t) => { const f = Math.sin(t * 9) * 0.5 + Math.sin(t * 23) * 0.3; note(g, x, y, s, { rot: -0.04 + f * 0.07, sx: 1 - Math.abs(f) * 0.1, curl: 0.2 + Math.abs(f) * 0.15, age: 1, text: ['take the', 'folder'], size: 66 }); };

// a: at night, you can hear the paper moving
reg('a', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.25, 0.58, 0.5], () => { nightRoom(g, t, { lamp: 0.2 }); veil(g, '#02060c', 0.45); flutter(g, 1380, 430, 0.62, t); bed(g, 700, 960, '#4a8ab0', () => drawToon(g, { x: 500, y: 1000, s: 2.0, cast: HERO, action: 'sit', t, facing: -1, yaw: 0.45, expr: 'worried', look: [-0.8, 0] }));
    for (let i = 0; i < 3; i++) { const p = (t * 0.9 + i / 3) % 1; g.strokeStyle = alpha('#bfe4ff', 0.6 * (1 - p)); g.lineWidth = 8; g.beginPath(); g.arc(1380, 430, 140 + p * 260, Math.PI * 0.7, Math.PI * 1.3); g.stroke(); } popIn(g, 960, 200, prog(t, 1.6, 1.9), -0.08, () => hw(g, 'flip... flip...', 0, 30, 100, '#bfe4ff', 8)); }); vig(g, 0.7); } });

// b: there's no wind
reg('b', { draw(g, t, info) { noteWall(g, t, { lamp: 0.2 }); veil(g, '#02060c', 0.4);
  cam(g, t, info.dur, [1.1, 0.5, 0.5], [1.35, 0.55, 0.48], () => { // the window is shut and the curtain hangs dead still
    box(g, 220, 220, 440, 620, '#0a1630', 14, 12); seg(g, [[440, 220], [440, 840]], 14, '#e9dcc4'); box(g, 405, 520, 70, 30, '#e8c060', 10, 5); for (const x of [190, 620]) box(g, x, 200, 90, 670, '#7a3a42', 34); flutter(g, 1240, 480, 1.1, t); }); vig(g, 0.65); } });

// c: you could make all of this stop tomorrow
reg('c', { draw(g, t, info) { nightRoom(g, t, { lamp: 0.2 }); veil(g, '#02060c', 0.35); flutter(g, 1620, 420, 0.55, t); cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.22, 0.5, 0.45], () => bigToonFace(g, 900, 590, 275, { cast: HERO, expr: 'thinking', t, look: [0.8, -0.1] })); vig(g, 0.7); } });

// d: all you have to do is walk into a building
reg('d', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.3, 0.62, 0.55], () => { studioFront(g, t, { grey: true }); paperSign(g, 1190, 640, 0.5, 1); veil(g, '#0a1424', 0.25); for (let i = 0; i < 9; i++) { const k = prog(t, 0.2 + i * 0.22, 0.4 + i * 0.22); if (k > 0) { g.save(); g.globalAlpha = k; g.beginPath(); g.ellipse(300 + i * 105, 1010 - (i % 2) * 40, 34, 16, -0.2, 0, 7); g.fillStyle = '#ffe27a'; g.fill(); g.restore(); } } }); popIn(g, 960, 130, prog(t, 0.8, 1.1), -0.02, () => { box(g, -330, -62, 660, 124, '#fffaf0', 30); hw(g, 'just walk in', 0, 32, 100); }); vig(g, 0.5); } });

// e: somehow that feels harder than everything else you've done
reg('e', { draw(g, t, info) { cam(g, t, info.dur, [1.15, 0.5, 0.5], [1.0, 0.5, 0.5], () => { nightRoom(g, t, { lamp: 0.3 }); veil(g, '#02060c', 0.3); rug(g, 960, 1010, 520); const tilt = ease.inOut(prog(t, 0.6, 2.4)) * 0.16;
    g.beginPath(); g.moveTo(900, 975); g.lineTo(960, 820); g.lineTo(1020, 975); g.closePath(); g.fillStyle = '#8a5a38'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); g.save(); g.translate(960, 820); g.rotate(tilt); box(g, -720, -30, 1440, 44, '#b87a4a', 14);
    jar(g, -500, -34, 0.55, 12); D.bookStack(g, -270, -34, 0.8, {}); D.sneaker(g, -640, -34, 0.7, {}); box(g, 360, -260, 300, 230, '#c8745a', 14); box(g, 470, -170, 90, 140, '#2f5a4a', 12); text(g, 'STUDIO', 510, -220, { size: 44, color: '#fff3d6' }); g.restore();
    popIn(g, 960, 260, prog(t, 1.9, 2.2), 0.03, () => { box(g, -250, -70, 500, 140, '#ffd64a', 30); hw(g, 'harder', 0, 36, 120); }); }); vig(g, 0.55); } });

// f: day twenty, you end up at your dad's repair shop. it's raining.
reg('f', { draw(g, t, info) { const td = at(info, 'dads', 1.7) - 0.3, tr = at(info, 'raining', 3.5) - 0.3;
  if (t < tr) cam(g, t, tr, [1.0, 0.5, 0.55], [1.14, 0.5, 0.52], () => { dadShop(g, t); drawToon(g, { x: 1260, y: 940, s: 2.45, cast: DAD, action: 'reach', t, facing: -1, yaw: 0.4, expr: 'focused', look: [0.3, 0.5] }); shopCounter(g, t); radio(g, 1060, SHOP_COUNTER, 1.0, t, false); D.mug(g, 1560, SHOP_COUNTER, 0.9, { t }); D.deskLamp(g, 1760, SHOP_COUNTER, 1.0, {});
      drawToon(g, { x: lerp(-100, 420, ease.out(prog(t, td - 0.6, td + 0.9))), y: 1180, s: 2.9, cast: HERO, actions: [[0, 'walk'], [td + 0.9, 'idle']], t, facing: 1, yaw: 0.65, expr: 'tired' }); });
  else { const u = t - tr; cam(g, u, info.dur - tr, [1.2, 0.5, 0.5], [1.0, 0.5, 0.5], () => { place(g, 'street', t, { look: 'rain' }); veil(g, '#0a1424', 0.35); box(g, 560, 360, 800, 560, '#7a4a30', 12); box(g, 640, 470, 400, 330, '#ffd98a', 12, 10); glow(g, 840, 620, 420, '#ffc870', 0.5); box(g, 1100, 480, 200, 440, '#4a2a1a', 12); box(g, 620, 380, 680, 76, '#2f5a4a', 20); text(g, "DAD'S REPAIRS", 960, 420, { size: 52, color: '#fff3d6' }); radio(g, 840, 800, 0.8, t, false); rain(g, t, 150, 0.5); }); }
  dayCard(g, 20, prog(t, 0.05, 0.35), 260, 820); vig(g, 0.45); } });

// g: the one place nobody asks you to be impressive
reg('g', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.45, 0.5], () => { dadShop(g, t); drawToon(g, { x: 1350, y: 940, s: 2.45, cast: DAD, action: 'idle', t, facing: -1, yaw: 0.5, expr: 'friendly' }); drawToon(g, { x: 640, y: 960, s: 2.45, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.5, expr: t < 2.2 ? 'tired' : 'relieved', look: [0.7, 0] }); shopCounter(g, t); radio(g, 990, SHOP_COUNTER, 0.9, t, false); D.mug(g, 1650, SHOP_COUNTER, 0.9, { t }); D.mug(g, 330, SHOP_COUNTER, 0.9, { t }); }); vig(g, 0.4); } });

// h: you put the folder on his counter. he wipes his hands twice.
reg('h', { draw(g, t, info) { const tw = at(info, 'wipes', 2.1) - 0.15; const drop = ease.in(prog(t, 0.1, 0.8));
  cam(g, t, info.dur, [1.05, 0.5, 0.55], [1.2, 0.55, 0.6], () => { dadShop(g, t); drawToon(g, { x: 1280, y: 940, s: 2.5, cast: DAD, action: 'idle', t, facing: -1, yaw: 0.4, expr: 'curious', look: [0.4, 0.7] }); shopCounter(g, t); folder(g, lerp(500, 900, drop), lerp(420, 790, drop), 0.62, { rot: (1 - drop) * -0.4 }); D.mug(g, 1650, SHOP_COUNTER, 0.9, { t }); radio(g, 380, SHOP_COUNTER, 0.9, t, false);
    if (t > tw) { const q = t - tw; const wx = 1280 + Math.sin(q * 10) * 90; box(g, wx - 110, 690, 220, 90, '#e8e0d0', 40); for (const d of [-1, 1]) box(g, wx + d * 60 - 45, 660, 90, 80, '#f0c8a0', 36); popIn(g, 1580, 520, prog(t, tw + 0.2, tw + 0.45), 0.08, () => hw(g, q < 0.8 ? 'once' : 'twice', 0, 20, 100, '#ffe27a', 10)); } }); vig(g, 0.45); } });

// i: then he turns every page. slowly.
reg('i', { draw(g, t, info) { const ts = at(info, 'slowly', 2.5) - 0.15; const n = Math.floor(clamp(t / 1.3, 0, 2)); const flip = ease.inOut(clamp((t - n * 1.3) / 0.9));
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.25, 0.5, 0.55], () => { dadShop(g, t); veil(g, '#1a0c04', 0.2); shopCounter(g, t); folder(g, 960, 840, 1.05, { lace: false }); page(g, 740, 760, 1.0, (n + 3) % 4, { rot: -0.04 }); page(g, 1180, 760, 1.0, n % 4, { rot: 0.03 });
    if (t < ts) { g.save(); g.translate(960, 760); g.scale(Math.cos(flip * Math.PI) || 0.04, 1); page(g, 220, 0, 1.0, (n + 1) % 4); g.restore(); } const hx = lerp(1330, 620, flip); box(g, hx - 55, 880, 110, 190, '#eebd98', 48); box(g, hx - 80, 1040, 160, 240, '#6b7f5a', 50); }); vig(g, 0.55); } });
