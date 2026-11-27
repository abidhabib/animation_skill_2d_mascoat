// V06 Clip 19: the climax at the mail slot. Restrained: slow moves, rain, silence, then "You let go."
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, popIn, folder, page, studioFront, paperSign, rain, dadShop, shopCounter, SHOP_COUNTER } from '/engine/v06.js';

// close-up of the studio door with its brass mail slot (slot centre 960, 560)
function door(g, t) { grad(g, [[0, '#35505c'], [1, '#1c2c34']]); box(g, 330, -60, 1260, 1220, '#2f5a4a', 30, 14); for (const y of [40, 760]) box(g, 430, y, 1060, 290, '#284d40', 22);
  box(g, 600, 480, 720, 160, '#e8b84a', 30, 10); box(g, 660, 535, 600, 50, '#2a1c0a', 18, 8); for (const x of [630, 1290]) circle(g, x, 510, 14, '#8a6a22'); circle(g, 1420, 640, 34, '#e8b84a'); paperSign(g, 960, 220, 0.85, 1); for (const [x, y] of [[150, 700], [1760, 640]]) D.plant(g, x, y + 400, 1.3, { kind: 'leafy', t }); }
function grip(g, x, y, s = 1, tremble = 0, t = 0) { const j = Math.sin(t * 34) * tremble; g.save(); g.translate(x + j, y); g.scale(s, s); box(g, -90, 70, 180, 700, '#303950', 66); box(g, -84, -50, 168, 170, '#ffdab9', 62); for (let i = 0; i < 4; i++) box(g, -82 + i * 41, -120 + Math.abs(i - 1.5) * 12, 42, 120, '#ffdab9', 20, 6); box(g, 60, 20, 62, 120, '#ffdab9', 30, 6); g.restore(); }
const drops = (g, t, n = 14) => { const r = rng(21); for (let i = 0; i < n; i++) { const x = 360 + r() * 1200, y = (r() * 900 + t * (60 + r() * 90)) % 1000; g.beginPath(); g.ellipse(x, y, 6, 11, 0, 0, 7); g.fillStyle = alpha('#cfe8ff', 0.5); g.fill(); } };

// a: then you remember a receipt that feels like cloth
reg('a', { draw(g, t, info) { grad(g, [[0, '#3a4a5c'], [1, '#141c28']]); rain(g, t, 110, 0.35); const k = ease.inOut(prog(t, 0.5, 1.5));
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.1, 0.5, 0.5], () => { glow(g, 960, 540, 700, '#ffc870', 0.45 * k); g.save(); g.globalAlpha = k; g.translate(960, 540); g.rotate(-0.05 + Math.sin(t) * 0.02); g.scale(1.7, 1.7); box(g, -230, -150, 460, 300, '#efd37a', 8); seg(g, [[-76, -150], [-70, 150]], 5, 'rgba(150,110,30,.35)'); seg(g, [[80, -150], [74, 150]], 5, 'rgba(150,110,30,.35)'); hw(g, 'Ask for the', 0, -6, 76, '#4a3020'); hw(g, 'bigger shop.', 0, 80, 76, '#4a3020'); g.restore(); }); vig(g, 0.65); } });
// b: you look back
reg('b', { draw(g, t, info) { studioFront(g, t, { grey: true, lights: false }); veil(g, '#08101c', 0.4); rain(g, t, 110, 0.35); cam(g, t, info.dur, [1.05, 0.5, 0.48], [1.16, 0.5, 0.46], () => bigToonFace(g, 960, 610, 265, { cast: HERO, expr: 'determined', t, look: [lerp(-0.8, 0.8, ease.inOut(prog(t, 0.1, 0.7))), 0] })); vig(g, 0.6); } });
// c: there's a brass mail slot in the door
reg('c', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.5, 0.5, 0.52], () => { door(g, t); glow(g, 960, 560, 360, '#ffd98a', 0.3 + 0.15 * Math.sin(t * 3)); }); drops(g, t); vig(g, 0.55); } });
// d: you write your name and number on the folder
reg('d', { draw(g, t, info) { const k = prog(t, 0.4, 2.1); cam(g, t, info.dur, [1.05, 0.5, 0.52], [1.2, 0.5, 0.52], () => { grad(g, [[0, '#2a3c48'], [1, '#121c24']]); folder(g, 960, 560, 2.0, { lace: false }); box(g, 600, 400, 720, 330, '#fffaf0', 20); const a = 'name: ___', len = Math.round(clamp(k * 1.6) * 7); for (let i = 0; i < 7; i++) if (i < len) seg(g, [[660 + i * 84, 500 + (i % 2) * 10], [700 + i * 84, 470], [730 + i * 84, 505]], 9, '#33231c'); const len2 = Math.round(clamp(k * 1.6 - 0.6) * 9); for (let i = 0; i < len2; i++) circle(g, 668 + i * 70, 640, 14, '#33231c'); const px = k < 0.62 ? lerp(660, 1260, k / 0.62) : lerp(668, 1230, (k - 0.62) / 0.38), py = k < 0.62 ? 500 : 640; seg(g, [[px, py], [px + 170, py + 170]], 30, INK); seg(g, [[px + 10, py + 10], [px + 160, py + 160]], 15, '#4a78b8'); grip(g, px + 190, py + 230, 0.9, 3, t); }); drops(g, t, 10); vig(g, 0.55); } });
// the folder entering the slot: k = how far in (0 outside, 0.5 halfway, 1 gone)
function atSlot(g, t, k, hand = true, tremble = 0) { door(g, t); const y = lerp(900, 320, k); g.save(); g.beginPath(); g.rect(0, 560, 1920, 800); g.clip(); folder(g, 960, y, 1.25, { rot: Math.PI / 2, lace: true }); g.restore(); if (hand) grip(g, 1000, y + 300, 1.15, tremble, t); box(g, 660, 535, 600, 26, '#2a1c0a', 8, 0); }
// e: you slide it halfway inside
reg('e', { draw(g, t, info) { cam(g, t, info.dur, [1.2, 0.5, 0.55], [1.34, 0.5, 0.56], () => atSlot(g, t, 0.5 * ease.inOut(prog(t, 0.2, 1.5)))); drops(g, t); vig(g, 0.55); } });
// f: and your fingers won't open
reg('f', { draw(g, t, info) { cam(g, t, info.dur, [1.7, 0.5, 0.68], [2.0, 0.51, 0.72], () => atSlot(g, t, 0.5, true, 5)); vig(g, 0.65); } });
// g: because while it's in your hand, you might still be brilliant
reg('g', { draw(g, t, info) { const tb = at(info, 'might', 1.8) - 0.1; grad(g, [[0, '#4a3a72'], [1, '#160c28']]); const k = ease.inOut(prog(t, tb, tb + 0.9));
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.48], () => { glow(g, 960, 520, 820, '#ffe9a0', 0.55 * k); for (const [x, y, kind] of [[420, 430, 3], [960, 480, 0], [1500, 430, 1]]) { g.save(); g.translate(x, y + Math.sin(t * 1.5 + x) * 12); box(g, -200, -250, 400, 500, k > 0.4 ? '#e8b84a' : '#5a5068', 20, 10); page(g, 0, 0, 1.05, kind, {}); g.restore(); } for (let i = 0; i < 18; i++) D.star(g, 180 + i * 95, 170 + (i % 4) * 230, 0.3 * k * (0.6 + 0.4 * Math.sin(t * 5 + i)), { t }); }); vig(g, 0.5); } });
// h: once you let go, somebody else gets to decide
reg('h', { draw(g, t, info) { const ts = at(info, 'somebody', 1.4) - 0.2; cam(g, t, info.dur, [1.15, 0.5, 0.5], [1.0, 0.5, 0.5], () => { grad(g, [[0, '#26343c'], [1, '#0c1216']]); box(g, 560, 120, 800, 820, '#ffe0a0', 20, 14); glow(g, 960, 500, 620, '#ffc870', 0.35);
    g.beginPath(); g.ellipse(960, 420, 150, 170, 0, 0, 7); g.fillStyle = '#2a1c18'; g.fill(); g.beginPath(); g.moveTo(640, 940); g.quadraticCurveTo(700, 600, 960, 590); g.quadraticCurveTo(1220, 600, 1280, 940); g.fill(); folder(g, 960, 760, 0.7, {}); if (t > ts) popIn(g, 1560, 300, prog(t, ts, ts + 0.35), 0.1, () => { box(g, -150, -110, 300, 220, '#fffaf0', 30); text(g, '?', 0, 12, { size: 180, color: INK }); }); }); vig(g, 0.65); } });
// i: three seconds of rain and breathing
reg('i', { draw(g, t, info) { const br = Math.sin(t * 2.6) * 0.012; cam(g, t, info.dur, [2.0 + br, 0.51, 0.72], [2.2 + br, 0.51, 0.72], () => atSlot(g, t, 0.5, true, 2)); drops(g, t, 24); vig(g, 0.75); } });
// j: you let go.
reg('j', { draw(g, t, info) { const tg = at(info, 'go', 0.6) + 0.05; const k = ease.in(prog(t, tg, tg + 0.3));
  if (t < tg + 0.45) { cam(g, t, info.dur, [1.6, 0.5, 0.66], [1.6, 0.5, 0.66], () => { atSlot(g, t, 0.5 + 0.55 * k, false); const o = ease.out(prog(t, tg - 0.15, tg + 0.15)); grip(g, 1000 + o * 160, lerp(900, 320, 0.5) + 300 + o * 130, 1.15, 0, t); }); vig(g, 0.65); }
  else veil(g, '#000000', 1); } });
