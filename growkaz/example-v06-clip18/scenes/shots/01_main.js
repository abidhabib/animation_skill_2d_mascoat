// V06 Clip 18: the brain's excuses, the studio, lights off, the perfect excuse, four steps away.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { place, floorY } from '/engine/places.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, popIn, folder, page, studioFront, paperSign, rain, bed, nightRoom, jar, note, sideTable } from '/engine/v06.js';

const greyStreet = (g, t) => { place(g, 'street', t, { look: 'rain' }); veil(g, '#101c30', 0.25); };
function robot(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[0, -190], [0, -240]], 10, INK); circle(g, 0, -250, 22, '#e0442c'); box(g, -120, -190, 240, 180, '#c8d0dc', 30); for (const d of [-1, 1]) { circle(g, d * 52, -115, 34, '#16242c'); circle(g, d * 52, -115, 14 + Math.sin(t * 8) * 4, '#5affc8'); } box(g, -60, -62, 120, 24, '#16242c', 8, 4); box(g, -90, 0, 180, 170, '#a8b4c4', 24); for (const d of [-1, 1]) box(g, d * 130 - 30, 10, 60, 130, '#c8d0dc', 24); g.restore(); }

// a: they probably only like robot drawings now
reg('a', { draw(g, t, info) { greyStreet(g, t); veil(g, '#0a1020', 0.3); const tr = at(info, 'robot', 1.1) - 0.3;
  drawToon(g, { x: 360, y: floorY('street') + 55, s: 2.5, cast: HERO, action: 'walk', t, facing: 1, expr: 'worried', look: [0.8, -0.5] }); popIn(g, 1180, 430, prog(t, tr, tr + 0.35), 0, () => { box(g, -520, -340, 1040, 680, '#fffaf0', 180, 9); robot(g, -190, 80, 1.15, t); g.save(); g.translate(250, 20); page(g, 0, 0, 1.0, 3, { rot: 0.08 }); g.restore(); for (let i = 0; i < 3; i++) D.star(g, 60 + i * 190, -250, 0.35, { t }); }); for (const [x, y, r] of [[640, 640, 34], [560, 710, 20]]) circle(g, x, y, r, '#fffaf0'); rain(g, t, 80, 0.35); vig(g, 0.5); } });
// b: did you lock your door? you should go back and check.
reg('b', { draw(g, t, info) { const tg = at(info, 'go', 1.5) - 0.2; grad(g, [[0, '#3a4a62'], [1, '#141c2c']]); rain(g, t, 80, 0.2);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.5], () => { box(g, 700, 90, 520, 940, '#8a5636', 24, 12); for (const y of [170, 580]) box(g, 780, y, 360, 330, '#7a4a2e', 18); circle(g, 1130, 560, 34, '#e8b84a'); circle(g, 1130, 560, 10, INK); D.padlock(g, 1450, 600, 1.7, { open: Math.sin(t * 6) > 0 }); popIn(g, 400, 420, prog(t, 0.1, 0.4), -0.1, () => text(g, '?', 0, 0, { size: 300, color: '#ffd64a', stroke: 20, strokeColor: INK }));
    if (t > tg) popIn(g, 400, 760, prog(t, tg, tg + 0.3), 0.04, () => { box(g, -230, -80, 460, 160, '#fffaf0', 30); hw(g, 'go check!', 0, 32, 100, '#d0442c'); }); }); vig(g, 0.55); } });
// c: and then you see it: the same building, the same door
reg('c', { draw(g, t, info) { cam(g, t, info.dur, [1.5, 0.35, 0.5], [1.0, 0.5, 0.5], () => { studioFront(g, t, { grey: true, lights: false }); paperSign(g, 1190, 640, 0.5, 1); drawToon(g, { x: lerp(-120, 330, ease.out(prog(t, 0, 2.6))), y: 995, s: 2.35, cast: HERO, actions: [[0, 'walk'], [2.6, 'idle']], t, facing: 1, expr: t < 1.2 ? 'determined' : 'surprised', look: [0.8, -0.3] }); rain(g, t, 120, 0.4); }); vig(g, 0.45); } });
// d: the same paper sign, faded by two summers: we read every folder
reg('d', { draw(g, t, info) { const tf = at(info, 'faded', 1.5) - 0.2, tw = at(info, 'we', 4.0) - 0.1;
  cam(g, t, info.dur, [1.25, 0.62, 0.62], [1.7, 0.62, 0.59], () => { studioFront(g, t, { grey: true, lights: false }); const fd = prog(t, tf, tf + 0.8); paperSign(g, 1190, 640, 1.15, fd > 0.5 ? 1 : 0); if (t > tw) { g.fillStyle = alpha('#ffe14a', 0.3); g.fillRect(940, 590, 500 * prog(t, tw, tw + 1.1), 60); } rain(g, t, 100, 0.35); });
  if (t > tf && t < tw) popIn(g, 330, 880, prog(t, tf, tf + 0.3), -0.05, () => { for (let i = 0; i < 2; i++) { circle(g, -90 + i * 180, 0, 62, '#ffd23a'); for (let k = 0; k < 8; k++) seg(g, [[-90 + i * 180 + Math.cos(k * 0.785) * 74, Math.sin(k * 0.785) * 74], [-90 + i * 180 + Math.cos(k * 0.785) * 100, Math.sin(k * 0.785) * 100]], 10, '#ffd23a'); } }); vig(g, 0.45); } });
// e: but the lights are off. nobody's inside.
reg('e', { draw(g, t, info) { const to = at(info, 'off', 1.1) - 0.15; cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.2, 0.42, 0.52], () => { studioFront(g, t, { grey: true, lights: t < to }); paperSign(g, 1190, 640, 0.5, 1); if (t > to) { box(g, 466, 336, 428, 368, '#10161e', 12, 0); seg(g, [[680, 330], [680, 710]], 10, INK); seg(g, [[520, 420], [640, 360]], 8, alpha('#bfe4ff', 0.25)); } rain(g, t, 130, 0.4); }); veil(g, '#050a14', 0.3 * prog(t, to, to + 0.3)); vig(g, 0.6); } });
// f: and there it is. the perfect excuse.
reg('f', { draw(g, t, info) { const tp = at(info, 'perfect', 1.4) - 0.2; studioFront(g, t, { grey: true, lights: false }); veil(g, '#08101c', 0.4); rain(g, t, 90, 0.3);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.46], () => bigToonFace(g, 960, 610, 265, { cast: HERO, expr: t < tp ? 'surprised' : 'relieved', t, look: [t < tp ? 0.7 : 0, 0] })); popIn(g, 960, 180, prog(t, tp, tp + 0.35), -0.04, () => { glow(g, 0, 0, 420, '#ffe27a', 0.4); box(g, -430, -95, 860, 190, '#ffd64a', 40); text(g, 'PERFECT EXCUSE', 0, 8, { size: 82, color: INK }); }); vig(g, 0.5); } });
// g: you can go home and honestly tell yourself you tried
reg('g', { draw(g, t, info) { const tt = at(info, 'tell', 1.6) - 0.2; cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.12, 0.45, 0.55], () => { nightRoom(g, t, { lamp: 0.8 }); bed(g, 720, 960, '#4a8ab0', () => drawToon(g, { x: 520, y: 1000, s: 2.1, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.45, expr: 'relieved' })); folder(g, 1050, 790, 0.3, { rot: 0.2 }); sideTable(g, 1420, 975, 260, 200); D.mug(g, 1420, 775, 0.8, { t });
    popIn(g, 1180, 330, prog(t, tt, tt + 0.3), 0.04, () => { box(g, -280, -90, 560, 180, '#fffaf0', 90); hw(g, 'I tried.', 0, 36, 120); }); }); veil(g, '#8ab0ff', 0.1); vig(g, 0.55); if (t < 0.3) veil(g, '#ffffff', 0.6 * (1 - t / 0.3)); } });
// h: you turn around. one step. two. three. four.
reg('h', { draw(g, t, info) { const ts = ['one', 'two', 'three', 'four'].map((w, i) => at(info, w, 1.5 + i * 1.1) - 0.1); const n = ts.filter((s) => t >= s).length; const x = 1150 - ts.reduce((a, s) => a + 170 * ease.inOut(prog(t, s, s + 0.55)), 0);
  cam(g, t, info.dur, [1.06, 0.52, 0.55], [1.0, 0.5, 0.55], () => { studioFront(g, t, { grey: true, lights: false }); paperSign(g, 1190, 640, 0.5, 1); for (let i = 0; i < n; i++) { g.beginPath(); g.ellipse(1150 - i * 170 - 60, 1005 - (i % 2) * 24, 44, 17, 0, 0, 7); g.fillStyle = alpha('#cfe4ff', 0.75); g.fill(); }
    const moving = ts.some((s) => t >= s && t < s + 0.55); drawToon(g, { x, y: 995, s: 2.4, cast: HERO, action: moving ? 'walk' : 'idle', t, facing: -1, yaw: moving ? 1.3 : 0.55, expr: 'sad' }); rain(g, t, 130, 0.4); });
  if (n) popIn(g, 330, 220, prog(t, ts[n - 1], ts[n - 1] + 0.25), -0.06, () => { circle(g, 0, 0, 120, '#fffaf0'); g.strokeStyle = INK; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 120, 0, 7); g.stroke(); text(g, String(n), 0, 8, { size: 140, color: INK }); }); vig(g, 0.5); } });
