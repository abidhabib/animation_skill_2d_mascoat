// V03 Clip 4 "what you paid": orders pour into Cisco, +50% a year, 44x, then the price: 100x profit, a century to earn one share back.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { cam3, pin } from '/engine/three-toon.js';
import { office2000 } from '/engine/sets3d/office2000.js';
import { D } from '/engine/props2d.js';
import { GREEN, RED, GOLD, INK, Y2K, greyed, zoomed, pop, money, backdrop, box, bars, coinStack } from '/engine/finfx.js';

const RIM2K = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initO = (T) => { const o = office2000(T, { time: 'day' }); Object.assign(o.st, { spots: o.spots, upd: o.update }); return o.st; };
const paper = (g, t) => { backdrop(g, '#f2e4cc', '#d8bf9a', t, {}); g.fillStyle = 'rgba(0,0,0,.04)'; for (let i = 0; i < 24; i++) g.fillRect(i * 80, 0, 2, E.H); for (let i = 0; i < 14; i++) g.fillRect(0, i * 80, E.W, 2); };

// c01 "Therefore, every new website, every office network, every phone company upgrade meant another order for Cisco."
//   three sources pop on the left (a browser window, an office, a phone tower); each fires a cardboard ORDER box into Cisco's growing stack
function browser(g, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -120, -90, 240, 180, 16); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.fillStyle = '#4a78b8'; g.fillRect(-117, -87, 234, 34); for (let i = 0; i < 3; i++) circle(g, -96 + i * 22, -70, 7, ['#ff6a5a', '#ffc83a', '#5ac46a'][i]); rr(g, -96, -36, 120, 70, 8); g.fillStyle = '#cfe0f4'; g.fill(); for (let i = 0; i < 4; i++) { rr(g, 36, -34 + i * 22, 60, 10, 5); g.fillStyle = '#c8ccd4'; g.fill(); } text(g, 'www', 0, 66, { size: 26, color: INK, stroke: 0 }); g.restore(); }
function tower(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[-60, 100], [0, -110], [60, 100]], 10, INK); for (let i = 0; i < 4; i++) seg(g, [[-48 + i * 12, 70 - i * 50], [48 - i * 12, 70 - i * 50]], 6, INK); circle(g, 0, -118, 14, '#e0302a');
  for (let r = 1; r <= 3; r++) { g.strokeStyle = alpha('#4a78b8', 0.8 - r * 0.2 + 0.2 * Math.sin(t * 6 - r)); g.lineWidth = 6; g.beginPath(); g.arc(0, -118, 26 * r, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(0, -118, 26 * r, Math.PI - 0.9, Math.PI + 0.9); g.stroke(); } g.restore(); }
registerShot('c01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }); zoomed(g, c, () => { paper(g, t);
  const srcT = [1.12, 2.48, 4.0], ys = [E.H * 0.22, E.H * 0.5, E.H * 0.8], sx = E.W * 0.18, stackX = E.W * 0.74, base = E.H * 0.9;
  srcT.forEach((t0, i) => { const k = pop(t, t0 - 0.1, 0.4); if (k <= 0) return; g.save(); g.translate(sx, ys[i]); g.scale(k, k);
    if (i === 0) browser(g, 0, 0, 1); if (i === 1) { D.house(g, 0, 110, 0.6, { color: '#a8c8f0', roof: '#4a78b8' }); for (let j = 0; j < 3; j++) { rr(g, -70 + j * 50, -10, 36, 26, 4); g.fillStyle = '#d8d0bc'; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); } } if (i === 2) tower(g, 0, 0, 0.9, t); g.restore(); });
  let landed = 0; const flights = [[1.4, 0], [1.6, 0], [2.8, 1], [3.0, 1], [4.3, 2], [4.5, 2], [4.7, 2], [5.2, 1], [5.35, 0]];
  flights.forEach(([t0, src], i) => { const p = prog(t, t0, t0 + 0.55); if (p <= 0) return; const slot = i, tx = stackX + ((slot % 3) - 1) * 125, ty = base - 50 - Math.floor(slot / 3) * 100;
    if (p >= 1) { landed++; box(g, tx, ty, 1, { label: 'ORDER' }); return; } const e = ease.inOut(p); box(g, lerp(sx + 140, tx, e), lerp(ys[src], ty, e) - Math.sin(e * Math.PI) * 220, 0.9, { rot: (1 - e) * 2, label: 'ORDER' }); });
  rr(g, stackX - 220, base, 440, 40, 10); g.fillStyle = '#7a4e34'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  text(g, 'CISCO', stackX, base + 90, { size: 56, color: INK, stroke: 0 }); if (landed) money(g, stackX, E.H * 0.16, landed + ' ORDERS', t, 1.95, GREEN, 60); }); } });

// c02 "Sales were growing more than fifty percent a year."  green bars climb on a dark board; +50% A YEAR pops
registerShot('c02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.06, z1: 1.0 }); zoomed(g, c, () => {
  backdrop(g, '#14202c', '#08101a', t, { bokeh: ['#5aff8a', '#ffe2b0'] }); D.plant(g, 150, E.H, 1.3, { kind: 'tall', t });
  bars(g, E.W * 0.2, E.H * 0.86, E.W * 0.56, E.H * 0.66, [0.12, 0.2, 0.32, 0.5, 0.78, 1.0], prog(t, 0.2, 1.7));
  ['95', '96', '97', '98', '99', '00'].forEach((y, i) => text(g, "'" + y, E.W * 0.2 + (i + 0.5) * E.W * 0.56 / 6, E.H * 0.92, { size: 34, color: '#ffffff', stroke: 0 }));
  money(g, E.W * 0.86, E.H * 0.3, '+50%', t, 1.78, GREEN, 110); const k = pop(t, 1.95); if (k > 0) text(g, 'A YEAR', E.W * 0.86, E.H * 0.42, { size: 44, color: '#ffffff', stroke: 6, strokeColor: INK }); }); } });

// c03 "From early nineteen ninety-five to the top, the stock rose about forty-four times."  a tiny coin stack grows into a tower; 1995 -> 2000; 44x
registerShot('c03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.12, y0: 0, y1: 60 }); zoomed(g, c, () => {
  backdrop(g, '#2a2040', '#120e22', t, { bokeh: ['#ffe28a', '#c0a0ff'] }); g.fillStyle = '#1a1430'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H);
  const k = ease.inOut(prog(t, 0.4, 3.8)), n = Math.round(lerp(1, 44, k)), x = E.W * 0.55; glow(g, x, E.H * 0.9 - n * 18, 260, GOLD, 0.25 * k);
  coinStack(g, E.W * 0.3, E.H * 0.9, 1, 1.1); text(g, '1995', E.W * 0.3, E.H * 0.96, { size: 40, color: '#ffffff', stroke: 0 });
  coinStack(g, x, E.H * 0.9, n, 1.1); text(g, String(Math.round(lerp(1995, 2000, k))), x, E.H * 0.96, { size: 40, color: '#ffffff', stroke: 0 });
  drawToon(g, { x: E.W * 0.8, y: E.H * 0.95, s: 1.6, facing: -1, cast: Y2K, pose: breathe(posesAt(t, [[0, 'stand'], [3.8, 'cheer']]), t), expr: t > 3.8 ? 'joy' : 'happy', look: [-0.4, -0.5], blink: blink(t), rim: RIM2K });
  money(g, E.W * 0.3, E.H * 0.35, '44x', t, 3.78, GOLD, 150); }); } });

// c04 "But here's what you actually paid."  the 2000 floor; 2000-you at his CRT, the room dims, he leans in
registerShot('c04', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t + 20); const h = st.spots.heroChair; cam3(st, t, info.dur, { from: { pos: [h[0] + 2.3, 1.6, h[2] + 3.2], look: [h[0] - 0.1, 1.0, h[2] - 0.6], fov: 40 }, to: { pos: [h[0] + 1.7, 1.5, h[2] + 2.5], look: [h[0] - 0.1, 1.05, h[2] - 0.6], fov: 38 } }); },
  overlay(g, t, info, st) { veil(g, '#0a0820', 0.35 * ease.inOut(prog(t, 0, 1.2)));
    const q = pin(st, st.spots.heroChair, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: -1, cast: Y2K, pose: breathe(posesAt(t, [[0, 'sit'], [0.8, 'think']]), t), expr: t > 0.8 ? 'thinking' : 'neutral', look: [-0.5, 0.1], blink: blink(t), rim: RIM2K }); } });

// c05 "At the peak, Cisco's price was more than one hundred times its yearly profit."  a balance: a giant price tag slams down against one small coin of profit
registerShot('c05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.06 }); zoomed(g, c, () => { paper(g, t);
  const cx = E.W / 2, py = E.H * 0.4, slam = ease.outBack(prog(t, 2.2, 2.7)), ang = -0.28 * slam;
  rr(g, cx - 18, py, 36, E.H * 0.5, 8); g.fillStyle = '#7a5a3a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); rr(g, cx - 160, E.H * 0.88, 320, 30, 10); g.fill(); g.stroke();
  g.save(); g.translate(cx, py); g.rotate(-ang); seg(g, [[-560, 0], [560, 0]], 22, INK); seg(g, [[-560, 0], [560, 0]], 12, '#c89a5a'); g.restore(); circle(g, cx, py, 24, GOLD);
  const L = [cx - Math.cos(ang) * 520, py + Math.sin(-ang) * -520 * -1], Rr = [cx + Math.cos(ang) * 520, py - Math.sin(-ang) * 520 * -1];
  const lx = cx - 520 * Math.cos(ang), ly = py - 520 * Math.sin(ang), rx = cx + 520 * Math.cos(ang), ry = py + 520 * Math.sin(ang);
  for (const [x, y] of [[lx, ly], [rx, ry]]) { seg(g, [[x, y], [x - 110, y + 170]], 4, INK); seg(g, [[x, y], [x + 110, y + 170]], 4, INK); g.beginPath(); g.ellipse(x, y + 175, 140, 26, 0, 0, Math.PI); g.fillStyle = '#d8c08a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); }
  const tagK = pop(t, 0.3, 0.4); if (tagK > 0) { g.save(); g.translate(lx, ly + 100 - 240 * (1 - prog(t, 2.2, 2.5))); g.scale(1.6 * tagK, 1.6 * tagK); D.priceTag(g, 0, 0, 1, { text: 'PRICE', color: '#ff8a5a' }); g.restore(); }
  const ck = pop(t, 0.9, 0.4); if (ck > 0) { g.save(); g.translate(rx, ry + 120); g.scale(0.6 * ck, 0.6 * ck); D.coin(g, 0, 0, 1, {}); g.restore(); text(g, 'PROFIT', rx, ry + 230, { size: 40, color: INK, stroke: 0 }); }
  if (t > 2.37) { money(g, cx, E.H * 0.14, '100x', t, 2.37, RED, 140); if (t < 2.9) FX.speedLines(g, t, { count: 30, color: '#ffffff', a: 0.3 }); } }); } });

// c06 "Think of it like this. If the profit never grew, you'd need more than a century of earnings just to earn back the price of one share."
//   one share certificate on a stand; a jar collects one coin a year; the year counter runs 1 -> 100+; you age beside it (hair to grey)
registerShot('c06', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: 30, x1: -30 }); zoomed(g, c, () => {
  backdrop(g, '#3a4a6a', '#1a2440', t, { bokeh: ['#ffe28a', '#a0c0ff'] }); g.fillStyle = '#24304e'; g.fillRect(-E.W, E.H * 0.88, E.W * 3, E.H);
  const k = ease.in(prog(t, 2.0, 6.4)), yr = Math.min(100, Math.round(1 + 99 * k)), sx = E.W * 0.24;
  rr(g, sx - 170, E.H * 0.28, 340, 240, 12); g.fillStyle = '#f8f0d8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, sx - 150, E.H * 0.28 + 20, 300, 200, 8); g.strokeStyle = '#c8a050'; g.lineWidth = 4; g.stroke();
  text(g, '1 SHARE', sx, E.H * 0.28 + 80, { size: 46, color: INK, stroke: 0 }); text(g, '= 100x PROFIT', sx, E.H * 0.28 + 150, { size: 38, color: '#a0302a', stroke: 0 }); seg(g, [[sx, E.H * 0.28 + 240], [sx, E.H * 0.88]], 10, '#7a5a3a');
  const jx = E.W * 0.52, jy = E.H * 0.86, fill = k; rr(g, jx - 120, jy - 320, 240, 320, 40); g.fillStyle = alpha('#cfe8ff', 0.25); g.fill(); g.save(); g.beginPath(); rr(g, jx - 120, jy - 320, 240, 320, 40); g.clip();
  for (let i = 0; i < Math.floor(fill * 40); i++) { const cx = jx - 90 + (i % 6) * 36, cy = jy - 20 - Math.floor(i / 6) * 40; circle(g, cx, cy, 20, i % 2 ? '#f0b020' : '#ffc83a'); } g.restore();
  rr(g, jx - 120, jy - 320, 240, 320, 40); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, jx - 90, jy - 350, 180, 40, 10); g.fillStyle = '#8a8a96'; g.fill(); g.stroke();
  const drop = (t * 1.6) % 1; if (t > 2.0 && yr < 100) { const cy = lerp(jy - 520, jy - 60 - fill * 240, ease.in(drop)); g.save(); g.translate(jx, cy); g.scale(0.3, 0.3); D.coin(g, 0, 0, 1, { spin: true, t }); g.restore(); }
  money(g, jx, E.H * 0.14, 'YEAR ' + yr + (yr >= 100 ? '+' : ''), t, 0.2, yr >= 100 ? GOLD : GREEN, 80);
  drawToon(g, { x: E.W * 0.8, y: E.H * 0.96, s: 1.65, facing: -1, cast: greyed(Y2K, k), pose: breathe(posesAt(t, [[0, 'explain'], [2.0, 'stand'], [6.0, 'shrug']]), t), expr: t > 6.0 ? 'tired' : (t > 3.6 ? 'worried' : 'neutral'), look: [-0.5, -0.2], blink: blink(t), rim: RIM2K }); }); } });
