// V03 Clip 7 "the full bill": rich version. The bill at dinner, prices from 2000 to 2026 in a supermarket, the half-full cart, the long road, the empty seat.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, HERO, SAM, ROOMMATE, DAD, MOM, CASHIER, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { cam3, pin } from '/engine/three-toon.js';
import { office2000 } from '/engine/sets3d/office2000.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, Y2K, greyed, mix, zoomed, pop, money, backdrop } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const OLD = greyed(Y2K, 1);
const PRICES = [2.78, 0.99, 0.91, 3.55, 2.89, 0.62];      // year-2000 shelf prices (illustrative), x1.97 = today
const initE = (T) => { const o = office2000(T, { time: 'evening' }); Object.assign(o.st, { spots: o.spots, upd: o.update }); return o.st; };

// g01 "But even that isn't the full bill."  a restaurant table at night: candle, plates; a waiter's hand slides the bill folder in
registerShot('g01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 40, x1: -20 });
  zoomed(g, c, () => { const cloth = g.createRadialGradient(E.W / 2, E.H * 0.6, 100, E.W / 2, E.H * 0.6, E.W); cloth.addColorStop(0, '#f4ede0'); cloth.addColorStop(1, '#8a7a68'); g.fillStyle = cloth; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 24; i++) { g.fillStyle = 'rgba(120,90,60,.05)'; g.fillRect(-E.W, i * 60, E.W * 3, 2); }
    glow(g, E.W * 0.2, E.H * 0.3, 380, '#ffb050', 0.35); seg(g, [[E.W * 0.2, E.H * 0.42], [E.W * 0.2, E.H * 0.25]], 26, '#f8f0e0'); g.fillStyle = '#ffb030'; g.beginPath(); g.ellipse(E.W * 0.2, E.H * 0.22 + Math.sin(t * 9) * 2, 12, 26, 0, 0, 7); g.fill();
    for (const [x, y, r] of [[E.W * 0.42, E.H * 0.28, 170], [E.W * 0.78, E.H * 0.32, 150]]) { circle(g, x, y, r, '#ffffff'); g.strokeStyle = '#d8d0c0'; g.lineWidth = 8; g.beginPath(); g.arc(x, y, r * 0.75, 0, 7); g.stroke(); }
    D.glass(g, E.W * 0.6, E.H * 0.42, 1.0, { fill: 0.35 }); seg(g, [[E.W * 0.32, E.H * 0.18], [E.W * 0.3, E.H * 0.42]], 10, '#b8bec8'); seg(g, [[E.W * 0.53, E.H * 0.16], [E.W * 0.55, E.H * 0.4]], 10, '#b8bec8');
    const k = ease.out(prog(t, 0.15, 0.9)), bx = lerp(E.W * 1.1, E.W * 0.55, k), by = E.H * 0.72; g.save(); g.translate(bx, by); g.rotate(-0.06);
    rr(g, -200, -130, 400, 260, 16); g.fillStyle = '#2a1e1a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, -150, -100, 300, 200, 6); g.fillStyle = '#fbf8f0'; g.fill();
    text(g, 'THE BILL', 0, -60, { size: 38, color: INK, stroke: 0 }); for (let i = 0; i < 3; i++) seg(g, [[-120, -10 + i * 34], [60, -10 + i * 34]], 7, '#c8ccd4'); text(g, '???', 100, 60, { size: 34, color: '#c8202a', stroke: 0 });
    g.fillStyle = '#e8b892'; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.ellipse(230, 30, 70, 46, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#1a1a22'; rr(g, 280, -10, 400, 90, 20); g.fill(); g.fillStyle = '#ffffff'; g.fillRect(280, 60, 400, 12); g.restore(); }); } });

// g02 "Ten thousand dollars from two thousand needs about nineteen thousand seven hundred today to buy the same things."
//   a supermarket aisle; every price label flips from its 2000 price to today's; shoppers pass; the basket total climbs 10,000 -> 19,700
registerShot('g02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.06, z1: 1.0, x0: 120, x1: -120 });
  zoomed(g, c, () => { g.fillStyle = '#eef0f2'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 8; i++) { g.fillStyle = '#fffbe8'; g.fillRect(-E.W + i * 520, 20, 300, 26); glow(g, -E.W + i * 520 + 150, 40, 260, '#ffffff', 0.25); }
    g.fillStyle = '#d8dce2'; g.fillRect(-E.W, E.H * 0.9, E.W * 3, E.H); rr(g, 60, 120, E.W - 120, 760, 16); g.fillStyle = '#c8ccd4'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    const flip = ease.inOut(prog(t, 1.6, 3.0)), mult = lerp(1, 1.97, flip);
    FP.shelf(g, 120, 470, E.W - 240, { prices: PRICES, mult, tagCol: flip > 0.5 ? '#ffb84a' : '#ffe24a' }); FP.shelf(g, 120, 800, E.W - 240, { prices: PRICES.map(p => p * 1.4), mult, tagCol: flip > 0.5 ? '#ffb84a' : '#ffe24a', prods: [['JUICE', '#ffb030', '#2f8a57'], ['PASTA', '#f4d890', '#c0302a'], ['SOUP', '#e0302a', '#f4f0e6'], ['TEA', '#2f8a57', '#f4e0a0'], ['SOAP', '#9ad0f0', '#ffffff'], ['OIL', '#f0d050', '#2a6a3a']] });
    [[SHOPPER(0), 0.3, 1], [DAD, 1.2, -1], [SHOPPER(2), 2.6, 1]].forEach(([cast, d, dir], i) => { const p = prog(t, d, d + 3.2); if (p <= 0 || p >= 1) return; drawToon(g, { x: lerp(dir > 0 ? -150 : E.W + 150, dir > 0 ? E.W + 150 : -150, p), y: E.H * 1.02, s: 1.25, facing: dir, cast, pose: walkPose(t * 6 + i), expr: 'neutral', blink: blink(t + i) }); });
    FP.glass(g, E.W * 0.33, 150, 640, 150); const tot = Math.round(lerp(10000, 19700, ease.inOut(prog(t, 1.6, 3.1))) / 100) * 100;
    text(g, flip > 0.5 ? 'SAME BASKET, 2026' : 'SAME BASKET, 2000', E.W * 0.33 + 320, 195, { size: 26, color: '#a8b0c0', stroke: 0 }); text(g, '$' + tot.toLocaleString('en-US'), E.W * 0.33 + 320, 255, { size: 66, color: flip > 0.5 ? '#ffd24a' : '#ffffff', stroke: 0 }); }); } });

// g03 "So on the day you finally break even, you're still short by almost half."  checkout: old 2000-you hands over $10,000; the cart is only half full; buying power 51%
registerShot('g03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: -30, x1: 30 });
  zoomed(g, c, () => { g.fillStyle = '#e8ecf0'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 6; i++) { g.fillStyle = '#d0d6de'; g.fillRect(i * 360, 0, 200, E.H * 0.6); }
    rr(g, E.W * 0.52, E.H * 0.58, 760, 120, 14); g.fillStyle = '#3a4a5a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, E.W * 0.52, E.H * 0.58 + 120, 760, 300, 0); g.fillStyle = '#5a6a7a'; g.fill(); g.stroke();
    rr(g, E.W * 0.82, E.H * 0.4, 150, 110, 10); g.fillStyle = '#1e2230'; g.fill(); g.stroke(); text(g, t > 1.4 ? '$10,000' : '$0.00', E.W * 0.82 + 75, E.H * 0.4 + 55, { size: 28, color: '#5aff8a', stroke: 0 });
    drawToon(g, { x: E.W * 0.9, y: E.H * 0.98, s: 1.35, facing: -1, cast: CASHIER, pose: breathe(posesAt(t, [[0, 'stand'], [1.2, 'reach'], [1.8, 'stand']]), t), expr: 'smile', blink: blink(t + 2) });
    const cx = E.W * 0.36, cy = E.H * 0.92; seg(g, [[cx - 200, cy - 300], [cx + 170, cy - 300]], 10, '#9aa4ae'); seg(g, [[cx - 200, cy - 300], [cx - 160, cy - 60], [cx + 150, cy - 60], [cx + 170, cy - 300]], 10, '#9aa4ae');
    for (let i = 0; i < 8; i++) seg(g, [[cx - 190 + i * 45, cy - 300], [cx - 155 + i * 40, cy - 60]], 4, '#b8c0c8'); circle(g, cx - 120, cy - 20, 26, INK); circle(g, cx + 110, cy - 20, 26, INK);
    [['MILK', '#f4f4f8', '#4a78b8'], ['BREAD', '#d89a5a', '#a0602a'], ['EGGS', '#f4e4c4', '#c89a5a']].forEach(([n, b, a], i) => { rr(g, cx - 160 + i * 100, cy - 220, 84, 150, 10); g.fillStyle = b; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); rr(g, cx - 152 + i * 100, cy - 170, 68, 44, 6); g.fillStyle = a; g.fill(); });
    g.save(); g.setLineDash([14, 12]); g.strokeStyle = alpha('#e0302a', 0.8); g.lineWidth = 5; for (let i = 0; i < 3; i++) { rr(g, cx + 50 + (i % 2) * 70 - 40, cy - 230 - i * 40, 84, 150, 10); g.stroke(); } g.restore();
    drawToon(g, { x: E.W * 0.58, y: E.H * 0.98, s: 1.45, facing: 1, cast: OLD, pose: breathe(posesAt(t, [[0, 'stand'], [1.1, 'reach'], [2.0, 'stand'], [3.5, 'shrug']]), t), expr: t > 3.5 ? 'sad' : 'smile', blink: blink(t), rim: RIM });
    if (t > 1.1 && t < 1.9) { g.save(); g.translate(E.W * 0.68, E.H * 0.52); g.rotate(-0.2); D.cash(g, 0, 0, 0.8, { text: '' }); g.restore(); }
    const bk = ease.out(prog(t, 2.2, 3.5)); FP.glass(g, 90, 80, 640, 170); text(g, 'WHAT $10,000 BUYS NOW', 410, 125, { size: 26, color: '#a8b0c0', stroke: 0 }); rr(g, 130, 160, 560, 46, 23); g.fillStyle = '#2a2e3c'; g.fill(); rr(g, 130, 160, 560 * 0.51 * bk + 1, 46, 23); g.fillStyle = '#ffb84a'; g.fill(); text(g, Math.round(51 * bk) + '%', 130 + 560 * 0.51 * bk + 50, 184, { size: 30, color: '#ffffff', stroke: 0 }); }); } });

// g04 "That's what being the next Cisco really means. Not just a crash. A wait."  a long road of years; the price line crashes, then a long flat walk while seasons change
registerShot('g04', { draw(g, t, info) { const k = prog(t, 0, info.dur), season = (t / info.dur) * 3, skyA = ['#7ab8f0', '#f0a860', '#8a9ab0', '#a8d8f0'][Math.floor(season) % 4], skyB = ['#7ab8f0', '#f0a860', '#8a9ab0', '#a8d8f0'][(Math.floor(season) + 1) % 4];
  const c = camEase(t, info.dur, { z0: 1.05, z1: 1.0, x0: 0, x1: -300 }); zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, mix(skyA, skyB, season % 1)); sky.addColorStop(1, '#f4ecdc'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 4, E.H * 3);
    FX.hills(g, { y: E.H * 0.62, amp: 60, color: '#9ab08a' }); g.fillStyle = '#c8b898'; g.beginPath(); g.moveTo(-E.W, E.H * 0.78); g.lineTo(E.W * 3, E.H * 0.74); g.lineTo(E.W * 3, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill();
    if (Math.floor(season) % 4 === 2) FX.snow(g, t, { count: 80 }); for (let i = 0; i < 9; i++) FX.tree(g, -200 + i * 360, E.H * 0.7, 1.4, Math.floor(season) % 4 === 1 ? '#a0602a' : '#3a5a3a');
    const x0 = 180, xc = 520, xe = E.W + 250, top = E.H * 0.18, low = E.H * 0.52, ck = ease.in(prog(t, 3.2, 3.6)), we = ease.inOut(prog(t, 3.6, info.dur));
    g.strokeStyle = '#ff4d5e'; g.lineWidth = 10; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x0, top + 40); g.lineTo(xc - 120, top); g.lineTo(lerp(xc - 120, xc, ck), lerp(top, low, ck)); g.stroke();
    if (we > 0) { g.setLineDash([18, 14]); g.strokeStyle = '#ffd24a'; g.beginPath(); g.moveTo(xc, low); for (let i = 0; i <= 30 * we; i++) g.lineTo(xc + i * (xe - xc) / 30, low - Math.sin(i * 0.9) * 14 - i * i * 0.28); g.stroke(); g.setLineDash([]); }
    for (let i = 0; i < 6; i++) { const sx = xc + 120 + i * 260; g.save(); g.translate(sx, E.H * 0.78); D.sign(g, 0, 0, 0.45, { text: String(2002 + i * 4), color: '#4a6a8a', size: 60 }); g.restore(); }
    const hx = lerp(xc + 40, xe - 160, we); drawToon(g, { x: hx, y: E.H * 0.86, s: 0.9, facing: 1, cast: greyed(Y2K, we), pose: we > 0 ? walkPose(t * 4) : breathe(POSES.stand, t), expr: t > 3.4 ? 'tired' : 'shocked', blink: blink(t), rim: RIM });
    if (t > 3.3) { const kk = pop(t, 3.3, 0.3); g.save(); g.translate(xc - 60, low - 140); g.scale(kk, kk); text(g, 'CRASH', 0, 0, { size: 64, color: '#ff4d5e', stroke: 8, strokeColor: INK }); g.restore(); }
    if (t > 4.2) { const kk = pop(t, 4.2, 0.3); g.save(); g.translate(hx, E.H * 0.42); g.scale(kk, kk); text(g, 'THE WAIT', 0, 0, { size: 70, color: '#ffd24a', stroke: 8, strokeColor: INK }); g.restore(); } }); } });

// g05 "So, is Nvidia really sitting in the same seat?"  the 2000 office at dusk, one empty chair in a spotlight; 2026-you walks in and looks at it
registerShot('g05', { kind: '3d', init: initE,
  draw(st, t, info) { st.upd(t); const h = st.spots.heroChair; cam3(st, t, info.dur, { from: { pos: [h[0] + 2.8, 1.6, h[2] + 4.2], look: [h[0], 0.8, h[2]], fov: 40 }, to: { pos: [h[0] + 1.6, 1.3, h[2] + 2.8], look: [h[0], 0.8, h[2]], fov: 34 } }); },
  overlay(g, t, info, st) { veil(g, '#0a0820', 0.45); const h = st.spots.heroChair, sc = pin(st, [h[0], 0.5, h[2]], 1.7);
    g.save(); g.globalCompositeOperation = 'lighter'; const cone = g.createLinearGradient(sc.x, 0, sc.x, sc.y); cone.addColorStop(0, 'rgba(255,236,190,0)'); cone.addColorStop(1, 'rgba(255,236,190,.35)'); g.fillStyle = cone; g.beginPath(); g.moveTo(sc.x - 30, 0); g.lineTo(sc.x + 30, 0); g.lineTo(sc.x + 260 * sc.s, sc.y + 40); g.lineTo(sc.x - 260 * sc.s, sc.y + 40); g.closePath(); g.fill(); g.restore();
    glow(g, sc.x, sc.y, 300 * sc.s, '#ffe8b0', 0.3);
    const p = ease.out(prog(t, 0, 1.9)), q = pin(st, [lerp(h[0] + 3.2, h[0] + 1.15, p), 0, h[2] - 0.35], 1.7);
    drawToon(g, { x: q.x, y: q.y, s: q.s, facing: -1, cast: HERO, pose: p < 1 ? walkPose(t * 5) : breathe(POSES.think, t), expr: t > 1.9 ? 'thinking' : 'neutral', look: [-0.8, 0.4], blink: blink(t), rim: { color: '#9fc8ff', dir: [0.7, -0.7], w: 3.5 } });
    if (t > 2.2) { const k = pop(t, 2.2, 0.4); g.save(); g.translate(sc.x, sc.y - 330 * sc.s); g.scale(k, k); D.mark(g, 0, 0, 0.8, { ch: '?' }); g.restore(); } } });
