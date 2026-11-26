// V06 Clip 17: "small repairs", the cheerful radio, the shoelace, "Go before you get good at waiting", the walk begins.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { cam, grad, motes, vig, speaker } from '/engine/cine.js';
import { place, floorY } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, popIn, jar, folder, page, dadShop, shopCounter, radio, rain, SHOP_COUNTER } from '/engine/v06.js';

const say = speaker([{ who: 'dad', s: 3.92, e: 6.0 }, { who: 'dad', s: 21.68, e: 23.9 }]);
const warm = (g, t) => { grad(g, [[0, '#4a2a1e'], [1, '#1e100c']]); glow(g, 1350, 300, 800, '#ffc870', 0.4); D.bookStack(g, 260, 1050, 1.2, {}); radio(g, 1670, 1050, 1.0, t, false); };
const hand = (g, x, y, rot, col = '#eebd98', sleeve = '#6b7f5a') => { g.save(); g.translate(x, y); g.rotate(rot); box(g, -75, 70, 150, 700, sleeve, 56); box(g, -66, -60, 132, 165, col, 52); for (let i = 0; i < 3; i++) seg(g, [[-28 + i * 28, -52], [-28 + i * 28, 2]], 6, alpha(INK, 0.6)); g.restore(); };
function slip(g, x, y, s) { g.save(); g.translate(x, y); g.rotate(-0.06); g.scale(s, s); box(g, -230, -140, 460, 280, '#efd37a', 8); seg(g, [[-76, -140], [-70, 140]], 5, 'rgba(150,110,30,.35)'); seg(g, [[80, -140], [74, 140]], 5, 'rgba(150,110,30,.35)'); hw(g, 'Ask for the', 0, -6, 76, '#4a3020'); hw(g, 'bigger shop.', 0, 80, 76, '#4a3020'); g.restore(); }
const two = (g, t, o = {}) => { dadShop(g, t, o); drawToon(g, { x: 1300, y: 940, s: 2.5, cast: DAD, action: o.dact || 'idle', t, facing: -1, yaw: 0.45, expr: o.dexpr || 'relieved', look: o.dlook }); drawToon(g, { x: 560, y: 960, s: 2.45, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.5, expr: o.hexpr || 'sad', look: o.hlook }); shopCounter(g, t); D.mug(g, 1720, SHOP_COUNTER, 0.9, { t }); };

// a: he keeps looking at that receipt a little too long
reg('a', { draw(g, t, info) { warm(g, t); cam(g, t, info.dur, [1.0, 0.5, 0.48], [1.1, 0.5, 0.52], () => { bigToonFace(g, 900, 520, 250, { cast: DAD, expr: 'sad', t, look: [0.5, 0.8] }); slip(g, 1360, 830, 0.85); hand(g, 1500, 960, -0.5); }); vig(g, 0.65); } });
// b: "I got really good at small repairs."
reg('b', { draw(g, t, info) { warm(g, t); cam(g, t, info.dur, [1.05, 0.5, 0.47], [1.1, 0.5, 0.46], () => bigToonFace(g, 960, 570, 270, { cast: DAD, expr: 'relieved', t, look: [0.2, 0.3], ...say(info.globalT, 'dad') })); vig(g, 0.65); } });
// c: neither of you says anything (hold on his hands)
reg('c', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.05, 0.5, 0.57], () => { dadShop(g, t, { lamp: 0.85 }); shopCounter(g, t); slip(g, 1260, 800, 0.55); hand(g, 780, 830, 0.35); hand(g, 1040, 825, -0.25); seg(g, [[900, 770], [980, 700]], 18, '#c8ccd4'); radio(g, 360, SHOP_COUNTER, 1.0, t, false); D.mug(g, 1680, SHOP_COUNTER, 0.9, { t }); }); vig(g, 0.55); } });
// d: the radio suddenly works and plays something ridiculously cheerful
reg('d', { draw(g, t, info) { const tw = at(info, 'working', 1.6) - 0.2; const on = t > tw; const b = on ? Math.abs(Math.sin(t * 9)) : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.18, 0.5, 0.52], () => { two(g, t, { hexpr: on ? 'surprised' : 'sad', dexpr: on ? 'surprised' : 'relieved', hlook: [0.9, 0], dlook: [0.9, 0] }); radio(g, 940, SHOP_COUNTER - b * 26, 1.2 + b * 0.05, t, on);
    if (on) { const cols = ['#ff5aa0', '#ffd23a', '#3ac8e8', '#7ac04a']; for (let i = 0; i < 16; i++) { const p = ((t - tw) * 0.7 + i / 16) % 1; text(g, i % 2 ? '♪' : '♫', 940 + Math.cos(i * 2.4) * p * 760, 640 - Math.abs(Math.sin(i * 1.7)) * p * 520, { size: 70 + p * 60, color: alpha(cols[i % 4], 1 - p) }); } } }); vig(g, on ? 0.25 : 0.5); } });
// e: terrible timing. he switches it off.
reg('e', { draw(g, t, info) { const to = at(info, 'off', 2.6) - 0.1; const on = t < to; cam(g, t, info.dur, [1.25, 0.5, 0.65], [1.4, 0.5, 0.66], () => { dadShop(g, t); shopCounter(g, t); radio(g, 940, SHOP_COUNTER, 1.5, t, on); const k = ease.inOut(prog(t, to - 0.7, to)); hand(g, lerp(1500, 1090, k), lerp(900, 745, k), -0.8); if (on) for (let i = 0; i < 6; i++) { const p = (t * 0.8 + i / 6) % 1; text(g, '♪', 700 + i * 90, 520 - p * 260, { size: 80, color: alpha('#ffd23a', 1 - p) }); } }); if (!on) veil(g, '#08040a', 0.18); vig(g, 0.5); } });
// f: closes your folder, and ties the shoelace around it
reg('f', { draw(g, t, info) { const ta = at(info, 'ties', 1.7) - 0.15; const close = ease.inOut(prog(t, 0.1, 0.9)), tie = ease.inOut(prog(t, ta, ta + 1.3));
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.14, 0.5, 0.57], () => { warm(g, t); g.fillStyle = '#b87a4a'; g.fillRect(-100, 760, 2200, 400); seg(g, [[-100, 760], [2100, 760]], 9, INK); folder(g, 960, 660, 1.5, { lace: false }); if (close < 1) { g.save(); g.translate(615, 660); g.scale(1 - close, 1); box(g, 0, -255, 690, 510, '#4aa874', 18); g.restore(); }
    if (tie > 0) { const L = 345 * tie; for (const d of [-1, 1]) seg(g, [[960 + d * 345, 690], [960 + d * (345 - L), 690]], 22, INK); for (const d of [-1, 1]) seg(g, [[960 + d * 345, 690], [960 + d * (345 - L), 690]], 11, '#f4e6c8'); const bw = ease.outBack(prog(t, ta + 1.2, ta + 1.6)); if (bw > 0) { for (const d of [-1, 1]) { g.strokeStyle = INK; g.lineWidth = 20; g.beginPath(); g.ellipse(960 + d * 70 * bw, 650, 72 * bw, 36 * bw, d * -0.5, 0, 7); g.stroke(); g.strokeStyle = '#f4e6c8'; g.lineWidth = 10; g.stroke(); } circle(g, 960, 690, 28, '#f4e6c8'); } hand(g, 960 - 345 + L - 40, 780, 0.6); hand(g, 960 + 345 - L + 40, 780, -0.6); } else hand(g, lerp(500, 1100, close), 800, 0.4); }); vig(g, 0.55); } });
// g: "Go before you get good at waiting."
reg('g', { draw(g, t, info) { warm(g, t); folder(g, 1650, 760, 0.45, { rot: 0.08 }); cam(g, t, info.dur, [1.04, 0.47, 0.47], [1.1, 0.47, 0.46], () => bigToonFace(g, 900, 570, 270, { cast: DAD, expr: 'friendly', t, look: [0, 0], ...say(info.globalT, 'dad') })); vig(g, 0.65); } });
const greyStreet = (g, t, speed = 1) => { place(g, 'street', t * speed, { look: 'rain' }); veil(g, '#101c30', 0.2); };
const walker = (g, t, x, expr = 'determined') => { const f = floorY('street'); drawToon(g, { x, y: f + 55, s: 2.55, cast: HERO, action: 'walk', t, facing: 1, expr }); folder(g, x + 30, f - 280, 0.22, { rot: -0.12 }); };
// h: the next morning, you walk. it's forty minutes.
reg('h', { draw(g, t, info) { const tf = at(info, 'forty', 2.4) - 0.2; greyStreet(g, t, 2); walker(g, t, lerp(350, 900, prog(t, 0, info.dur))); popIn(g, 1560, 220, prog(t, tf, tf + 0.3), 0.05, () => { box(g, -200, -80, 400, 160, '#fffaf0', 30); text(g, '40 min', 0, 6, { size: 84, color: INK }); }); popIn(g, 330, 220, prog(t, 0.1, 0.4), -0.05, () => { box(g, -170, -80, 340, 160, '#ffd64a', 30); text(g, 'DAY 21', 0, 6, { size: 74, color: INK }); }); vig(g, 0.45); } });
function thought(g, x, y, s, k, str) { popIn(g, x, y, k, Math.sin(x) * 0.05, () => { g.scale(s, s); box(g, -300, -80, 600, 160, '#fffaf0', 80); for (const [dx, dy, r] of [[-150, 105, 24], [-185, 150, 14]]) circle(g, dx, dy, r, '#fffaf0'); hw(g, str, 0, 26, 74); }); }
// i: your brain spends every single one of them negotiating
reg('i', { draw(g, t, info) { greyStreet(g, t, 1.2); veil(g, '#0a1020', 0.35); cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.48], () => bigToonFace(g, 960, 610, 260, { cast: HERO, expr: 'worried', t, look: [Math.sin(t * 3), -0.2] })); ['but...', 'maybe later?', 'what if?', 'tomorrow?'].forEach((w, i) => thought(g, [330, 1590, 360, 1570][i], [220, 260, 720, 760][i], 0.75, prog(t, 0.6 + i * 0.55, 0.9 + i * 0.55), w)); rain(g, t, 80, 0.35); vig(g, 0.55); } });
// j: come back when you're better. they're probably closed. they've probably moved.
reg('j', { draw(g, t, info) { const tc = at(info, 'theyre', 1.9) - 0.2, tm = at(info, 'theyve', 3.5) - 0.2; greyStreet(g, t); walker(g, t, 330 + t * 60, 'worried');
  thought(g, 1050, 190, 1.0, prog(t, 0.05, 0.35), "come back better"); if (t > tc) popIn(g, 1180, 470, prog(t, tc, tc + 0.3), 0.07, () => { box(g, -270, -100, 540, 200, '#e0442c', 30); text(g, 'CLOSED', 0, 6, { size: 110, color: '#fffaf0' }); }); if (t > tm) popIn(g, 1560, 720, prog(t, tm, tm + 0.3), -0.06, () => { box(g, -230, -90, 460, 180, '#3a6ac0', 30); text(g, 'MOVED →', 0, 6, { size: 86, color: '#fff' }); }); vig(g, 0.5); } });
