// V06 Clip 16: Dad's question, the old receipt, "Ask for the bigger shop." Still, warm, no hard zooms.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { cam, grad, motes, vig, speaker } from '/engine/cine.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, popIn, jar, folder, page, dadShop, shopCounter, radio, SHOP_COUNTER } from '/engine/v06.js';

const say = speaker([{ who: 'dad', s: 0.16, e: 2.45 }, { who: 'dad', s: 24.32, e: 26.1 }]);
const hands = (g, x, y, s, col = '#eebd98', sleeve = '#6b7f5a') => { for (const d of [-1, 1]) { g.save(); g.translate(x + d * s, y); g.rotate(-d * 0.35); box(g, -80, 70, 160, 700, sleeve, 60); box(g, -70, -60, 140, 170, col, 56); for (let i = 0; i < 3; i++) seg(g, [[-30 + i * 30, -52], [-30 + i * 30, 4]], 6, alpha(INK, 0.6)); box(g, d > 0 ? -108 : 52, -10, 56, 110, col, 28); g.restore(); } };
function receipt(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.04); g.scale(s, s); box(g, -230 + 12, -150 + 18, 460, 300, 'rgba(0,0,0,.3)', 10, 0); g.beginPath(); g.moveTo(-230, -150); g.lineTo(230, -150); g.lineTo(230, 140); for (let i = 0; i <= 12; i++) g.lineTo(230 - i * (460 / 12), 140 + (i % 2) * 22); g.closePath(); g.fillStyle = '#efd37a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke();
  for (const [x0, y0, x1, y1] of [[-76, -150, -70, 140], [80, -150, 74, 140], [-230, -8, 230, 4]]) seg(g, [[x0, y0], [x1, y1]], 5, 'rgba(150,110,30,.35)'); seg(g, [[-180, -110], [-40, -110]], 8, 'rgba(110,80,40,.4)'); seg(g, [[60, -110], [180, -110]], 8, 'rgba(110,80,40,.4)');
  const k = o.k ?? 0; if (k > 0) { const a = 'Ask for the', b = 'bigger shop.', n = Math.round(k * (a.length + b.length)); hw(g, a.slice(0, n), 0, -6, 76, '#4a3020'); if (n > a.length) hw(g, b.slice(0, n - a.length), 0, 80, 76, '#4a3020'); } g.restore(); }
const shop2 = (g, t, o = {}) => { dadShop(g, t, o); drawToon(g, { x: o.dx ?? 1300, y: 940, s: 2.5, cast: DAD, action: o.dact || 'idle', t, facing: -1, yaw: 0.45, expr: o.dexpr || 'friendly', look: o.dlook, ...(o.gt !== undefined ? say(o.gt, 'dad') : {}) }); if (o.hero !== false) drawToon(g, { x: 520, y: 960, s: 2.45, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.5, expr: o.hexpr || 'worried', look: o.hlook }); shopCounter(g, t); D.mug(g, 1720, SHOP_COUNTER, 0.9, { t }); radio(g, 210, SHOP_COUNTER, 0.85, t, false); };
const warm = (g, t) => { grad(g, [[0, '#4a2a1e'], [1, '#1e100c']]); glow(g, 1350, 300, 800, '#ffc870', 0.42); D.bookStack(g, 260, 1050, 1.2, {}); D.alarmClock(g, 1690, 1050, 1.1, { t }); };

// a: "Is it finished, or are you scared?"
reg('a', { draw(g, t, info) { warm(g, t); cam(g, t, info.dur, [1.0, 0.5, 0.48], [1.08, 0.5, 0.46], () => bigToonFace(g, 960, 570, 270, { cast: DAD, expr: t < 2.6 ? 'curious' : 'friendly', t, look: [0, 0], ...say(info.globalT, 'dad') })); vig(g, 0.6); } });
// b: you tell him it still needs work. he nods.
reg('b', { draw(g, t, info) { const tn = at(info, 'nods', 3.0) - 0.15; const nod = t > tn && t < tn + 0.8 ? Math.sin((t - tn) * 14) * 12 : 0; cam(g, t, info.dur, [1.04, 0.5, 0.55], [1.12, 0.5, 0.55], () => { shop2(g, t, { hexpr: t < tn ? 'awkward' : 'sad', dexpr: t < tn ? 'curious' : 'relieved', dlook: [0.5, nod > 0 ? 0.8 : 0] }); folder(g, 920, 800, 0.55, { lace: false }); page(g, 900, 760, 0.4, 0, { rot: -0.08 }); }); vig(g, 0.45); } });
// c: he opens the cash drawer, and takes out an old yellow receipt
reg('c', { draw(g, t, info) { const to = at(info, 'opens', 0.8) - 0.2, tk = at(info, 'takes', 4.4) - 0.2; const open = ease.inOut(prog(t, to, to + 0.9)), lift = ease.inOut(prog(t, tk, tk + 1.6));
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.18, 0.5, 0.52], () => { warm(g, t); box(g, 380, 180, 1160, 330, '#8a5636', 24); box(g, 440, 230, 1040, 90, '#c89a58', 18); D.mug(g, 600, 180, 1.0, { t }); radio(g, 1300, 180, 0.9, t, false);
    const dy = 450 + open * 190; box(g, 450, 420, 1020, dy - 420 + 20, '#2a160e', 10); box(g, 450, dy, 1020, 380, '#a8704a', 22);
    for (let i = 0; i < 5; i++) box(g, 490 + i * 196, dy + 34, 168, 270, '#6a4028', 18, 5); const r = rng(4); for (let i = 0; i < 34; i++) { const x = 530 + r() * 880, y = dy + 120 + r() * 160; circle(g, x, y, 34, INK); circle(g, x, y, 28, i % 3 ? '#e8c060' : '#c8ccd4'); }
    const ry = lerp(dy + 210, 420, lift); if (t > tk - 0.4) { receipt(g, 960, ry, 0.35 + 0.55 * lift, {}); hands(g, 960, ry + 110 + 80 * lift, 150 + 90 * lift); } else hands(g, 960, dy + 130 - (1 - open) * 40 + 260, 330); }); vig(g, 0.55); } });
// d: folded so many times it feels like cloth
reg('d', { draw(g, t, info) { const sway = Math.sin(t * 1.6) * 0.04; cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.5, 0.5], () => { warm(g, t); g.save(); g.translate(960, 540); g.rotate(sway); g.scale(1 - 0.1 * Math.max(0, Math.sin(t * 2.2)), 1); receipt(g, 0, 0, 1.7, {}); g.restore(); hands(g, 960, 760, 420); }); vig(g, 0.55); } });
// e: five words, written in his handwriting
reg('e', { draw(g, t, info) { cam(g, t, info.dur, [1.1, 0.5, 0.52], [1.22, 0.5, 0.52], () => { warm(g, t); receipt(g, 960, 540, 1.75, {}); hands(g, 960, 780, 440); for (let i = 0; i < 5; i++) { const k = ease.outBack(prog(t, 0.2 + i * 0.12, 0.5 + i * 0.12)); circle(g, 720 + i * 120, 190, 26 * k, '#ffe27a'); } }); vig(g, 0.6); } });
// f: "Ask for the bigger shop."
reg('f', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.52], () => { warm(g, t); receipt(g, 960, 540, 2.1, { k: prog(t, 0.0, 1.35) }); hands(g, 960, 840, 520); }); vig(g, 0.65); } });
// g: "Wrote that the year you were born."
reg('g', { draw(g, t, info) { warm(g, t); receipt(g, 1620, 560, 0.55, { k: 1, rot: 0.08 }); cam(g, t, info.dur, [1.04, 0.45, 0.48], [1.1, 0.45, 0.46], () => bigToonFace(g, 860, 570, 265, { cast: DAD, expr: 'grateful', t, look: [0.4, 0.4], ...say(info.globalT, 'dad') })); vig(g, 0.65); } });
// h: you look around. his shop is about the size of a bus shelter.
reg('h', { draw(g, t, info) { const tb = at(info, 'bus', 2.9) - 0.5; const z = ease.inOut(prog(t, 0.3, info.dur - 0.4));
  g.save(); g.fillStyle = '#26303c'; g.fillRect(-100, -100, 2200, 1300); const s = lerp(1.05, 0.62, z); g.translate(960, 600); g.scale(s, s); g.translate(-960, -600);
  dadShop(g, t); drawToon(g, { x: 1300, y: 940, s: 2.5, cast: DAD, action: 'idle', t, facing: -1, yaw: 0.45, expr: 'friendly' }); drawToon(g, { x: 600, y: 960, s: 2.45, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.3, expr: 'curious', look: [Math.sin(t * 2.4), -0.3] }); shopCounter(g, t); radio(g, 990, SHOP_COUNTER, 0.9, t, false);
  const k = prog(t, tb, tb + 0.35); if (k > 0) { g.globalAlpha = k; g.strokeStyle = INK; g.lineWidth = 60; g.strokeRect(-60, -60, 2040, 1260); g.strokeStyle = '#c8d0dc'; g.lineWidth = 34; g.strokeRect(-60, -60, 2040, 1260); box(g, -100, -200, 2120, 150, '#3a6a8a', 50, 12); text(g, 'BUS STOP', 960, -122, { size: 90, color: '#fff' }); g.globalAlpha = 1; } g.restore(); vig(g, 0.45); } });
// i: he isn't unhappy here. he loves fixing things.
reg('i', { draw(g, t, info) { const tl = at(info, 'loves', 2.0) - 0.2; cam(g, t, info.dur, [1.1, 0.62, 0.55], [1.24, 0.62, 0.55], () => { dadShop(g, t); drawToon(g, { x: 1200, y: 940, s: 2.55, cast: DAD, action: 'reach', t, facing: -1, yaw: 0.4, expr: t < tl ? 'friendly' : 'joy', look: [0.4, 0.6] }); shopCounter(g, t); radio(g, 960, SHOP_COUNTER, 1.15, t, false); seg(g, [[1010 + Math.sin(t * 9) * 14, 640], [1130, 710]], 14, '#c8ccd4'); D.mug(g, 1560, SHOP_COUNTER, 0.9, { t });
    if (t > tl) for (let i = 0; i < 4; i++) { const p = ((t - tl) * 0.5 + i * 0.25) % 1; D.heart(g, 940 + i * 90, 520 - p * 240, 0.22 * Math.sin(p * Math.PI), { t }); } }); vig(g, 0.4); } });
