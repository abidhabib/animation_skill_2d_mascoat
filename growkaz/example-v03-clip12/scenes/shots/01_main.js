// V03 Clip 12 "stretched, then the oven shop": a stretched wallet, the $220B construction site, the cash-flow control room,
// then the oven-shop analogy begins (you sell ovens, a baker can't afford them, the bank says no).
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, ROOMMATE, DAD, MOM, STRANGER, CASHIER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, zoomed, pop, money, backdrop, box } from '/engine/finfx.js';

const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM];
const SUIT = (c, col) => ({ ...c, top: col, topDark: '#1a1a24', collar: '#e8e8f0' });
const HARD = (c) => ({ ...c, cap: '#ffd03a', top: '#ff8a1a', topDark: '#c0600a', collar: '#c0600a' });
const BAKER = { ...CASHIER, cap: '#ffffff', apron: '#f4f4f8', top: '#fbf6ea', topDark: '#e0d8c4' };
const SHOPKEEP = { ...HERO, apron: '#c8452f' };
const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3 };

function cat(g, x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); const tail = Math.sin(t * 2.4) * 0.5; g.strokeStyle = INK; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(40, -20); g.quadraticCurveTo(100, -30 + tail * 40, 90, -90 + tail * 30); g.stroke(); g.strokeStyle = '#e8a050'; g.lineWidth = 14; g.stroke();
  g.beginPath(); g.ellipse(0, -30, 56, 36, 0, 0, 7); g.fillStyle = '#e8a050'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.beginPath(); g.arc(-52, -62, 30, 0, 7); g.fill(); g.stroke(); for (const d of [-1, 1]) { g.beginPath(); g.moveTo(-52 + d * 8, -86); g.lineTo(-52 + d * 28, -112); g.lineTo(-52 + d * 30, -80); g.closePath(); g.fill(); g.stroke(); }
  circle(g, -62, -64, 4, INK); circle(g, -42, -64, 4, INK); seg(g, [[-30, 0], [-30, 18]], 12, '#e8a050'); seg(g, [[20, 0], [20, 18]], 12, '#e8a050'); g.restore(); }
function wallet(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  rr(g, -250, -140, 500, 280, 28); F2(g, '#8a5a30'); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); rr(g, -230, -120, 460, 240, 20); g.strokeStyle = '#c8905a'; g.lineWidth = 3; g.setLineDash([12, 10]); g.stroke(); g.setLineDash([]);
  if (o.open) { rr(g, -250, -150, 500, 130, 28); F2(g, '#a0683a'); g.stroke(); }
  g.restore(); }
const F2 = (g, c) => { g.fillStyle = c; g.fill(); };

// m01 "And some buyers are stretched."  a bulging wallet held shut by a rubber band stretched to its limit; cash spills; a worried buyer; cranes behind
registerShot('m01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.14 }), tw = Math.sin(t * 44) * 5 * (t > 0.9 ? 1 : 0.3);
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#2a2060'); sky.addColorStop(1, '#e89a6a'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 6; i++) { const x = 160 + i * 330; seg(g, [[x, E.H * 0.8], [x, 220 + (i % 3) * 60]], 16, '#3a2a58'); seg(g, [[x - 180, 220 + (i % 3) * 60], [x + 90, 220 + (i % 3) * 60]], 12, '#3a2a58'); }
    g.fillStyle = '#2a1e44'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H);
    // wallet with cash and rubber band
    for (let i = 0; i < 5; i++) { g.save(); g.translate(760 + i * 90, 430 + Math.sin(i) * 20); g.rotate(-0.3 + i * 0.14); D.cash(g, 0, 0, 0.9, { text: '' }); g.restore(); }
    wallet(g, 960, 640, 1.15, { rot: Math.sin(t * 30) * 0.01 }); const bw = 14 + 10 * ease.out(prog(t, 0, 1.0));
    g.save(); g.translate(960, 640); g.scale(1.15, 1.15); g.strokeStyle = INK; g.lineWidth = bw + 8; g.beginPath(); g.moveTo(-70, -150); g.quadraticCurveTo(-96 - tw, 0, -70, 150); g.stroke(); g.beginPath(); g.moveTo(70, -150); g.quadraticCurveTo(96 + tw, 0, 70, 150); g.stroke(); g.strokeStyle = '#e8c070'; g.lineWidth = bw; g.beginPath(); g.moveTo(-70, -150); g.quadraticCurveTo(-96 - tw, 0, -70, 150); g.stroke(); g.beginPath(); g.moveTo(70, -150); g.quadraticCurveTo(96 + tw, 0, 70, 150); g.stroke(); g.restore();
    drawToon(g, { x: 1560, y: E.H * 1.02, s: 1.7, facing: -1, cast: SUIT(DAD, '#2a3a5a'), pose: breathe(posesAt(t, [[0, 'stand'], [0.4, 'handsOnHead']]), t), expr: 'worried', look: [-0.8, 0.1], blink: blink(t), rim: RIM });
    drawToon(g, { x: 360, y: E.H * 1.02, s: 1.7, facing: 1, cast: SUIT(MOM, '#5a2a3a'), pose: breathe(posesAt(t, [[0, 'stand'], [0.6, 'shrug']]), t), expr: 'nervous', look: [0.8, 0.1], blink: blink(t + 1), rim: RIM });
    const k = pop(t, 0.9, 0.3); if (k > 0) { g.save(); g.translate(960, 230); g.scale(k, k); text(g, 'STRETCHED', 0, 0, { size: 110, color: '#ffffff', stroke: 12, strokeColor: INK }); g.restore(); } }); } });

// m02 "Amazon now plans to spend about two hundred and twenty billion dollars this year on buildings and equipment,"
//   a mega construction site: cranes swing server racks, trucks arrive, a glass card counts to $220B
registerShot('m02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: 160, x1: -160 }), gy = E.H * 0.8;
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#6aa8e8'); sky.addColorStop(1, '#f4e8d0'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.clouds(g, { y: E.H * 0.12, count: 8, color: '#ffffff', a: 0.5 });
    for (let i = 0; i < 14; i++) { const h = 120 + (i * 83) % 200; g.fillStyle = '#a8c0d8'; g.fillRect(i * 180 - 200, gy - h, 120, h); }
    g.fillStyle = '#b8a888'; g.fillRect(-E.W, gy, E.W * 3, E.H); g.fillStyle = '#8a7a60'; g.fillRect(-E.W, gy + 90, E.W * 3, 90);
    for (const [bx, bw, fl] of [[-120, 560, 3], [620, 640, 4], [1420, 600, 3]]) { for (let f = 0; f < fl; f++) { const fy = gy - (f + 1) * 110; g.fillStyle = '#c8ccd4'; g.fillRect(bx, fy + 90, bw, 20); for (let q = 0; q <= 5; q++) seg(g, [[bx + q * bw / 5, fy + 110], [bx + q * bw / 5, fy + 6]], 10, '#a8acb8'); g.fillStyle = 'rgba(110,125,150,.3)'; g.fillRect(bx + 8, fy + 8, bw - 16, 82); } rr(g, bx + 40, gy - fl * 110 - 56, 300, 50, 10); g.fillStyle = '#1a1c22'; g.fill(); text(g, 'DATA CENTER', bx + 190, gy - fl * 110 - 31, { size: 28, color: '#76ff5a', stroke: 0 }); }
    for (const [cx, h, ph] of [[420, 760, 0], [1160, 820, 1.7], [1860, 740, 3.1]]) { seg(g, [[cx, gy], [cx, gy - h]], 24, '#e0a838'); for (let i = 0; i < 10; i++) seg(g, [[cx - 12, gy - i * 76], [cx + 12, gy - 76 - i * 76]], 4, '#a87820'); const jl = 340 + 40 * Math.sin(t * 0.7 + ph); seg(g, [[cx - jl, gy - h], [cx + 90, gy - h]], 18, '#e0a838'); const sw = Math.sin(t * 1.5 + ph) * 0.12, lx = cx - jl * 0.6 + Math.sin(sw) * 180; seg(g, [[cx - jl * 0.6, gy - h + 8], [lx, gy - h + 230]], 4, '#2a2e38'); box(g, lx, gy - h + 270, 1.05, { color: '#3a3e48', label: ph > 2 ? 'RACK' : 'GPU', rot: sw }); }
    for (let i = 0; i < 4; i++) { const x = ((t * 140 * (i % 2 ? 1 : -1) + i * 520) % (E.W + 600)) - 300; D.car(g, i % 2 ? x : E.W - x, gy + 150, 0.9, { spin: t * 5 }); }
    [[300, 1], [980, -1], [1700, -1], [1300, 1]].forEach(([x, f], i) => drawToon(g, { x, y: gy + 70, s: 0.85, facing: f, cast: HARD(CROWD[i * 2 + 1]), pose: breathe(posesAt(t, [[0, 'stand'], [0.5 * i, 'point'], [0.5 * i + 1.2, 'explain']]), t + i), expr: 'happy', blink: blink(t + i), rim: RIM }));
    const gk = ease.outBack(prog(t, 0.4, 0.9)); if (gk > 0) { g.save(); g.translate(E.W * 0.5, 190); g.scale(gk, gk); FP.glass(g, -380, -110, 760, 220, { r: 28 }); text(g, 'AMAZON · 2026 SPENDING PLAN', 0, -58, { size: 28, color: '#a8b0c8', stroke: 0 }); const n = Math.round(220 * ease.inOut(prog(t, 1.66, 3.0))); text(g, '$' + n + 'B', 0, 30, { size: 112, color: n >= 220 ? '#ffd24a' : '#ffffff', stroke: 0 }); g.restore(); } }); } });

// m03 "and its free cash flow has turned negative. It's spending more than its business brings in as cash."
//   a control room: the FREE CASH FLOW dial swings into the red; a tank gets a thin green inflow but a fat red outflow and drains below zero; alarms
registerShot('m03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.06, z1: 1.0, x0: -30, x1: 30 });
  zoomed(g, c, () => { const bg = g.createLinearGradient(0, 0, 0, E.H); bg.addColorStop(0, '#161c2c'); bg.addColorStop(1, '#0a0e18'); g.fillStyle = bg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 8; i++) { rr(g, 60 + i * 235, 40, 200, 120, 8); g.fillStyle = '#0c1020'; g.fill(); g.strokeStyle = '#2a3250'; g.lineWidth = 4; g.stroke(); g.save(); g.beginPath(); g.rect(70 + i * 235, 50, 180, 100); g.clip(); g.strokeStyle = i % 3 ? '#2fd67a' : '#ff4d5e'; g.lineWidth = 3; g.beginPath(); for (let q = 0; q < 9; q++) { const y = 100 + Math.sin(q * 0.9 + i + t) * 30 + (i % 3 ? -q * 4 : q * 4); q ? g.lineTo(70 + i * 235 + q * 22, y) : g.moveTo(70 + i * 235, y); } g.stroke(); g.restore(); }
    // dial
    const dx = 430, dy = 560; FP.glass(g, 120, 220, 620, 640, { r: 32 }); text(g, 'FREE CASH FLOW', dx, 280, { size: 34, color: '#ffffff', stroke: 0 });
    g.lineWidth = 44; for (const [a0, a1, col] of [[Math.PI, Math.PI * 1.5, '#ff4d5e'], [Math.PI * 1.5, Math.PI * 2, '#2fd67a']]) { g.strokeStyle = col; g.beginPath(); g.arc(dx, dy + 60, 220, a0, a1); g.stroke(); }
    const k = ease.inOut(prog(t, 0.4, 2.4)), ang = lerp(-0.45, 0.95, k) * (Math.PI / 2) * 1.0; const na = Math.PI * 1.5 + lerp(0.7, -0.85, k); g.save(); g.translate(dx, dy + 60); g.rotate(na - Math.PI * 1.5); seg(g, [[0, 0], [0, -190]], 14, INK); seg(g, [[0, 0], [0, -190]], 7, '#ffffff'); g.restore(); circle(g, dx, dy + 60, 22, '#ffffff'); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(dx, dy + 60, 22, 0, 7); g.stroke();
    text(g, '0', dx, dy + 8, { size: 30, color: '#ffffff', stroke: 0 }); text(g, '−', dx - 240, dy + 90, { size: 60, color: '#ff4d5e', stroke: 0 }); text(g, '+', dx + 240, dy + 90, { size: 60, color: '#2fd67a', stroke: 0 }); if (k > 0.85) { const nk = pop(t, 2.2, 0.3); g.save(); g.translate(dx, dy + 230); g.scale(nk, nk); text(g, 'NEGATIVE', 0, 0, { size: 76, color: '#ff6a6a', stroke: 0, glow: 18, glowColor: '#ff2a3a' }); g.restore(); }
    // tank + pipes
    const tx = 1140, ty = 260, tw = 360, th = 520; rr(g, tx, ty, tw, th, 26); g.fillStyle = 'rgba(200,230,255,.07)'; g.fill(); const lvl = lerp(0.62, 0.12, ease.inOut(prog(t, 2.6, 5.6)));
    g.save(); rr(g, tx, ty, tw, th, 26); g.clip(); g.fillStyle = lvl < 0.3 ? '#c8342a' : '#2fb866'; g.fillRect(tx, ty + th * (1 - lvl), tw, th * lvl + 4); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(tx, ty + th * (1 - lvl), tw, 8); g.restore(); rr(g, tx, ty, tw, th, 26); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    seg(g, [[tx - 20, ty + th * 0.7], [tx + tw + 20, ty + th * 0.7]], 4, '#ffe28a'); text(g, 'ZERO', tx + tw + 70, ty + th * 0.7, { size: 24, color: '#ffe28a', stroke: 0 });
    seg(g, [[tx + 60, ty - 120], [tx + 60, ty + 10]], 16, '#6a7484'); seg(g, [[tx + 60, ty - 120], [tx - 60, ty - 120]], 16, '#6a7484'); for (let i = 0; i < 6; i++) { const p = ((t * 0.9 + i / 6) % 1); circle(g, tx + 60, lerp(ty - 110, ty + 20, p), 7, '#5aff8a'); } text(g, 'CASH IN', tx - 130, ty - 150, { size: 28, color: '#5aff8a', stroke: 0 });
    seg(g, [[tx + tw - 40, ty + th - 30], [tx + tw - 40, ty + th + 60], [tx + tw + 160, ty + th + 60]], 44, '#6a3030'); seg(g, [[tx + tw - 40, ty + th - 30], [tx + tw - 40, ty + th + 60], [tx + tw + 160, ty + th + 60]], 30, '#3a1818'); for (let i = 0; i < 9; i++) { const p = ((t * 1.6 + i / 9) % 1); circle(g, lerp(tx + tw - 40, tx + tw + 160, p), ty + th + 60, 14, '#ff6a6a'); } text(g, 'CASH OUT', tx + tw - 10, ty + th + 128, { size: 34, color: '#ff6a6a', stroke: 0 });
    for (let i = 0; i < 3; i++) { const on = Math.sin(t * 10 + i * 2) > 0 && t > 2.4; circle(g, 1620 + i * 70, 110, 22, on ? '#ff3a3a' : '#4a1818'); if (on) glow(g, 1620 + i * 70, 110, 110, '#ff3a3a', 0.35); }
    [[1560, SUIT(MOM, '#2a3a5a'), 1], [1760, SUIT(SHOPPER(2), '#2a2a2a'), -1]].forEach(([x, cs, f], i) => drawToon(g, { x, y: E.H * 1.02, s: 1.5, facing: -1, cast: cs, pose: breathe(posesAt(t, [[0, 'stand'], [2.4 + i * 0.3, 'handsOnHead']]), t + i), expr: t > 2.4 ? 'shocked' : 'worried', look: [-0.7, -0.3], blink: blink(t + i), rim: { color: '#ff8a7a', dir: [0.7, -0.7], w: 3 } })); }); } });

// helper: the shopkeeper's counter (drawn over his lower body)
function counter(g, x, gy, w, t, o = {}) { rr(g, x, gy - 130, w, 150, 12); F2(g, '#8a5a38'); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(x + 8, gy - 124, w - 16, 14); for (let i = 0; i < 4; i++) { rr(g, x + 24 + i * (w - 48) / 4, gy - 96, (w - 48) / 4 - 14, 100, 8); g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 4; g.stroke(); }
  FP.register(g, x + w - 200, gy - 128, 0.78, o.open || 0, { amount: o.amount || '$0.00' }); cat(g, x + 130, gy - 128, 0.8, t); }

// m04 "But this is the part that made me stop. Imagine you sell ovens."  the oven shop: you behind the counter, ovens glowing, bread, the cat; pull back to reveal it
registerShot('m04', { draw(g, t, info) { const k = ease.inOut(prog(t, 0, info.dur)), c = { z: lerp(1.5, 1.0, k), x: lerp(-380, 0, k), y: lerp(-80, 0, k) };
  zoomed(g, c, () => { const sh = FP.ovenShop(g, t, { glow: true, ovens: 5, tags: ['$4k', '$4k', '$4k', '$4k', '$4k'] }); const gy = sh.gy;
    drawToon(g, { x: 500, y: gy + 60, s: 1.7, facing: 1, cast: SHOPKEEP, pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'explain'], [2.6, 'holdFront']]), t), expr: 'smile', talk: t > 1.0 && t < 3.0, blink: blink(t), rim: RIM }); counter(g, 150, gy, 760, t);
    const kk = pop(t, 2.3, 0.4); if (kk > 0) { g.save(); g.translate(E.W * 0.62, 280); g.scale(kk, kk); FP.glass(g, -280, -62, 560, 124, { r: 26 }); text(g, 'YOU SELL OVENS', 0, 4, { size: 66, color: '#ffe28a', stroke: 0 }); g.restore(); } }); } });

// m05 "A new bakery wants ten of your best ones, but it can't afford them,"  a baker walks in, points at the ovens (x2 each = ten); the wallet opens: empty, moths
registerShot('m05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 60, x1: -60 });
  zoomed(g, c, () => { const sh = FP.ovenShop(g, t, { glow: true, ovens: 5, tags: ['x2', 'x2', 'x2', 'x2', 'x2'] }), gy = sh.gy;
    drawToon(g, { x: 460, y: gy + 60, s: 1.7, facing: 1, cast: SHOPKEEP, pose: breathe(posesAt(t, [[0, 'explain'], [2.0, 'holdFront']]), t), expr: t > 2.4 ? 'worried' : 'happy', blink: blink(t + 1), rim: RIM }); counter(g, 120, gy, 700, t);
    const bx = lerp(E.W + 150, 1250, ease.out(prog(t, 0.0, 1.0))); drawToon(g, { x: bx, y: gy + 130, s: 1.8, facing: -1, cast: BAKER, pose: t < 1.0 ? walkPose(t * 6) : breathe(posesAt(t, [[1.0, 'point'], [2.2, 'sad']]), t), expr: t > 2.3 ? 'sad' : 'happy', look: [-0.6, -0.2], blink: blink(t), rim: RIM });
    const tk = pop(t, 1.3, 0.35); if (tk > 0) { g.save(); g.translate(1000, 190); g.scale(tk, tk); circle(g, 0, 0, 100, INK); circle(g, 0, 0, 90, GOLD); text(g, '10', 0, 4, { size: 100, color: INK, stroke: 0 }); g.restore(); text(g, 'OVENS', 1000, 300, { size: 36, color: '#ffffff', stroke: 6, strokeColor: INK }); }
    const wk = ease.out(prog(t, 2.3, 2.9)); if (wk > 0) { g.save(); g.translate(1330, gy - 360); g.scale(0.4 * wk, 0.4 * wk); wallet(g, 0, 0, 1, { open: true }); g.restore(); glow(g, 1330, gy - 380, 90, '#ffffff', 0.15);
      for (let i = 0; i < 2; i++) { const mx = 1330 + Math.sin(t * 5 + i * 3) * 70 + i * 30, my = gy - 440 - ((t - 2.4) * 80 + i * 40) % 160; g.fillStyle = '#e8e8f4'; g.strokeStyle = INK; g.lineWidth = 3; const fl = Math.sin(t * 30 + i) * 8; g.beginPath(); g.ellipse(mx - 10, my, 14, 8 + fl, -0.5, 0, 7); g.fill(); g.stroke(); g.beginPath(); g.ellipse(mx + 10, my, 14, 8 - fl, 0.5, 0, 7); g.fill(); g.stroke(); }
      text(g, '$0', 1330, gy - 520, { size: 70, color: '#ff6a6a', stroke: 8, strokeColor: INK }); } }); } });

// m06 "and no bank will lend to it."  a bank facade on the street; the banker at the door shakes his head; DENIED slams
registerShot('m06', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1 }), gy = E.H * 0.82;
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#8ac0e8'); sky.addColorStop(1, '#f4ecd8'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 12; i++) { const h = 200 + (i * 91) % 260; g.fillStyle = '#b8c8d8'; g.fillRect(i * 190 - 120, gy - h, 140, h); } g.fillStyle = '#c8c0a8'; g.fillRect(-E.W, gy, E.W * 3, E.H); g.fillStyle = '#a8a088'; g.fillRect(-E.W, gy + 70, E.W * 3, 14);
    FP.bank(g, E.W * 0.55, gy + 20, 1.9, { name: 'THE BANK' }); D.plant(g, 120, gy + 30, 1.3, { kind: 'tall', t });
    drawToon(g, { x: E.W * 0.55 + 120, y: gy + 20, s: 1.6, facing: -1, cast: SUIT(DAD, '#1f3a5f'), pose: breathe(posesAt(t, [[0, 'stand'], [0.3, 'crossArms']]), t), expr: 'neutral', look: [-0.4, 0], blink: blink(t), rim: RIM, talk: false });
    drawToon(g, { x: 560, y: gy + 100, s: 1.7, facing: 1, cast: BAKER, pose: breathe(posesAt(t, [[0, 'stand'], [1.1, 'sad']]), t), expr: t > 1.0 ? 'cry' : 'worried', look: [0.5, 0], blink: blink(t + 1), rim: RIM });
    FP.stamp(g, E.W * 0.3, 520, 1.1, 'DENIED', '#d81e2a', prog(t, 0.95, 1.25)); if (t > 0.98 && t < 1.4) FX.speedLines(g, t, { count: 24, color: '#ffffff', a: 0.25 }); }); } });
