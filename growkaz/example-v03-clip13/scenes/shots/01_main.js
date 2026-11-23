// V03 Clip 13 "the co-signer": you guarantee the bakery's loan at the bank, the ovens ship, your sales soar, then the chain and ball clamp on.
// Then the same thing at Nvidia scale: the chip wears the chain, hub-and-spoke guarantees to $118B, the Ohio campus ($105B), and the hook.
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
const BAKER = { ...CASHIER, cap: '#ffffff', apron: '#f4f4f8', top: '#fbf6ea', topDark: '#e0d8c4' };
const SHOPKEEP = { ...HERO, apron: '#c8452f' };
const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3 };
const F2 = (g, c) => { g.fillStyle = c; g.fill(); };
function sky(g, a, b) { const s = g.createLinearGradient(0, 0, 0, E.H); s.addColorStop(0, a); s.addColorStop(1, b); g.fillStyle = s; g.fillRect(-E.W, -E.H, E.W * 4, E.H * 3); }
function chipChar(g, x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); const bob = Math.sin(t * 3) * 4;
  for (const d of [-1, 1]) { seg(g, [[d * 50, -40 + bob], [d * 60, 30]], 24, INK); seg(g, [[d * 50, -40 + bob], [d * 60, 30]], 15, '#e0b05a'); rr(g, d * 60 - 26, 22, 52, 20, 8); F2(g, '#3a3e48'); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }
  g.fillStyle = '#e0b05a'; for (let i = 0; i < 5; i++) { g.fillRect(-100 + i * 50 - 8, -262 + bob, 16, 34); g.fillRect(-142, -200 + i * 38 + bob, 34, 14); g.fillRect(108, -200 + i * 38 + bob, 34, 14); }
  rr(g, -130, -232 + bob, 260, 200, 26); F2(g, '#20262e'); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); rr(g, -104, -206 + bob, 208, 148, 16); F2(g, '#2f3a44'); g.strokeStyle = '#5affb0'; g.lineWidth = 4; g.stroke(); glow(g, 0, -132 + bob, 150, '#5affb0', 0.12);
  text(g, 'AI', 0, -176 + bob, { size: 34, color: '#d8ffee', stroke: 0 }); for (const d of [-1, 1]) { circle(g, d * 44, -128 + bob, 24, '#ffffff'); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(d * 44, -128 + bob, 24, 0, 7); g.stroke(); circle(g, d * 44 + (o.look || 0) * 8, -126 + bob, 10, INK); }
  g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); if (o.mood === 'worried') { g.moveTo(-30, -78 + bob); g.quadraticCurveTo(0, -96 + bob, 30, -78 + bob); } else { g.moveTo(-30, -84 + bob); g.quadraticCurveTo(0, -66 + bob, 30, -84 + bob); } g.stroke();
  if (o.mood === 'worried') { seg(g, [[-70, -164 + bob], [-20, -152 + bob]], 5, INK); seg(g, [[70, -164 + bob], [20, -152 + bob]], 5, INK); } g.restore(); }
const chipFoot = (x, y, s) => [x + 60 * s, y + 40 * s];

// n01 "So you tell the bank, if the bakery fails, I'll cover it."  the bank interior: you and the banker across the desk, the guarantee signs itself; the baker waits
registerShot('n01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.14, x0: 0, x1: 0, y0: 0, y1: -30 });
  zoomed(g, c, () => { const bi = FP.bankInterior(g, t, { sign: 'LOANS' }), gy = bi.gy;
    drawToon(g, { x: 180, y: gy + 150, s: 1.6, facing: 1, cast: BAKER, pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'think']]), t), expr: 'worried', look: [0.6, 0.1], blink: blink(t + 1), rim: RIM });
    drawToon(g, { x: 640, y: gy + 120, s: 1.8, facing: 1, cast: SHOPKEEP, pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'explain'], [2.4, 'point']]), t), expr: 'smile', talk: t > 0.3 && t < 3.0, blink: blink(t), rim: RIM });
    drawToon(g, { x: 1480, y: gy + 120, s: 1.8, facing: -1, cast: SUIT(DAD, '#1f3a5f'), pose: breathe(posesAt(t, [[0, 'stand'], [3.0, 'crossArms']]), t), expr: t > 3.0 ? 'smile' : 'neutral', look: [-0.4, 0.1], blink: blink(t + 2), rim: RIM });
    rr(g, 520, gy - 40, 1120, 120, 12); F2(g, '#7a4e2e'); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); g.fillStyle = 'rgba(255,255,255,.1)'; g.fillRect(528, gy - 34, 1104, 12);
    const kk = ease.out(prog(t, 0.2, 0.8)); FP.contract(g, E.W / 2 + 10, gy - 130 + (1 - kk) * 120, 0.62 * kk, ease.inOut(prog(t, 2.1, 3.2)), { title: 'GUARANTEE', rot: -0.03, lines: ['If the bakery fails to pay,', 'the guarantor will cover it.'] });
    const pk = prog(t, 2.1, 3.2); if (pk > 0 && pk < 1.05) { g.save(); g.translate(E.W / 2 + lerp(-110, 90, pk), gy - 70 + Math.sin(pk * 14) * 10); g.rotate(-0.8); rr(g, -8, -90, 16, 110, 6); F2(g, '#1a3aa0'); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); g.restore(); }
    if (t > 3.1) { const k = pop(t, 3.1, 0.3); g.save(); g.translate(E.W / 2, 150 + 0); g.scale(k, k); } if (t > 3.1) g.restore(); }); } });

// n02 "The bank lends, the bakery buys your ovens,"  one wide street: the bank stamps APPROVED, a cheque flies to the baker, the ovens ride off on a truck
registerShot('n02', { draw(g, t, info) { const camX = lerp(0, 980, ease.inOut(prog(t, 0.1, 2.4))), gy = E.H * 0.8; sky(g, '#8ac0e8', '#f4ecd8'); g.save(); g.translate(-camX * 0.4, 0); for (let i = 0; i < 18; i++) { const h = 200 + (i * 91) % 260; g.fillStyle = '#b8c8d8'; g.fillRect(i * 190 - 120, gy - h, 140, h); } g.restore();
  g.save(); g.translate(-camX, 0); g.fillStyle = '#c8c0a8'; g.fillRect(-300, gy, 3800, E.H); g.fillStyle = '#a8a088'; g.fillRect(-300, gy + 80, 3800, 14);
  FP.bank(g, 420, gy + 20, 1.5, { name: 'THE BANK' }); drawToon(g, { x: 640, y: gy + 40, s: 1.4, facing: 1, cast: SUIT(DAD, '#1f3a5f'), pose: breathe(posesAt(t, [[0, 'stand'], [0.4, 'cheer']]), t), expr: 'happy', blink: blink(t), rim: RIM }); FP.stamp(g, 330, 250, 0.8, 'APPROVED', '#1f9a5a', prog(t, 0.3, 0.55), { fs: 70, rot: -0.1 });
  const cp = prog(t, 0.7, 1.6), cx = lerp(720, 1520, ease.inOut(cp)), cy = lerp(gy - 160, gy - 200, cp) - Math.sin(cp * Math.PI) * 220; if (cp < 1) FP.cheque(g, cx, cy, 0.35, { amount: '$250,000', pay: 'THE BAKERY', rot: cp * 1.2 });
  drawToon(g, { x: 1620, y: gy + 60, s: 1.5, facing: -1, cast: BAKER, pose: breathe(posesAt(t, [[0, 'stand'], [1.5, 'cheer']]), t), expr: t > 1.5 ? 'joy' : 'smile', blink: blink(t + 1), rim: RIM });
  const tp = ease.in(prog(t, 1.5, 2.5)), tx = lerp(1800, 2650, tp); rr(g, tx - 20, gy - 250, 480, 250, 14); F2(g, '#e8e2d0'); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); for (let i = 0; i < 5; i++) FP.oven(g, tx + 40 + i * 80, gy - 20, 0.34, { glow: false, tag: null }); rr(g, tx + 460, gy - 170, 150, 170, 18); F2(g, '#c8452f'); g.stroke(); rr(g, tx + 510, gy - 150, 80, 60, 8); F2(g, '#bfe4f4'); g.stroke(); circle(g, tx + 80, gy + 8, 36, INK); circle(g, tx + 520, gy + 8, 36, INK); text(g, 'OVENS x10', tx + 220, gy - 200, { size: 40, color: INK, stroke: 0 });
  g.restore(); } });

// n03 "and your sales look amazing."  the oven shop erupts: the register pops open, a sales chart surges, confetti, customers cheer
registerShot('n03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 50, x1: -40 });
  zoomed(g, c, () => { const sh = FP.ovenShop(g, t, { glow: true, ovens: 5, tags: ['SOLD', 'SOLD', 'SOLD', 'SOLD', 'SOLD'] }), gy = sh.gy;
    FP.glass(g, 560, 70, 740, 330, { r: 26 }); text(g, 'YOUR SALES', 700, 118, { size: 30, color: '#a8b0c8', stroke: 0 }); const k = ease.inOut(prog(t, 0.1, 1.9)); g.save(); g.beginPath(); g.rect(600, 140, 660, 230); g.clip(); g.beginPath(); for (let i = 0; i <= 30 * k; i++) { const v = Math.pow(i / 30, 2.2); i ? g.lineTo(610 + i * 21, 350 - 200 * v + Math.sin(i) * 5) : g.moveTo(610, 350); } g.strokeStyle = '#2fd67a'; g.lineWidth = 9; g.lineJoin = 'round'; g.stroke(); g.restore(); money(g, 1160, 170, '+300%', t, 1.0, GREEN, 70);
    drawToon(g, { x: 480, y: gy + 60, s: 1.7, facing: 1, cast: SHOPKEEP, pose: breathe(posesAt(t, [[0, 'stand'], [0.3, 'cheer']]), t), expr: 'joy', talk: true, blink: blink(t), rim: RIM });
    rr(g, 130, gy - 130, 760, 150, 12); F2(g, '#8a5a38'); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); FP.register(g, 690, gy - 128, 0.78, ease.outBack(prog(t, 0.3, 0.6)), { amount: '$40,000' });
    [[1130, SHOPPER(0), 'joy'], [1290, SAM, 'laugh'], [1450, MOM, 'joy'], [1610, ROOMMATE, 'happy']].forEach(([x, cs, ex], i) => drawToon(g, { x, y: gy + 110, s: 1.6, facing: -1, cast: cs, pose: breathe(posesAt(t + i * 0.1, [[0, 'cheer'], [0.4, 'jump'], [0.8, 'cheer']]), t + i), expr: ex, blink: blink(t + i), rim: RIM }));
    for (let i = 0; i < 70; i++) { const x = (i * 197.3) % E.W, y = ((i * 89 + t * (150 + (i % 5) * 30)) % (E.H + 80)) - 40; g.save(); g.translate(x, y); g.rotate(t * 4 + i); g.scale(1, Math.abs(Math.sin(t * 6 + i))); g.fillStyle = ['#ffd03a', '#5aff8a', '#5ab4ff', '#ff6a8a', '#ffffff'][i % 5]; g.fillRect(-7, -4, 14, 8); g.restore(); }
    for (let i = 0; i < 6; i++) { const p = ((t * 0.9 + i / 6) % 1); g.save(); g.translate(lerp(1000, 700, p), lerp(gy - 300, gy - 200, p) - Math.sin(p * Math.PI) * 160); g.rotate(p * 6); D.coin(g, 0, 0, 0.5, { spin: true, t }); g.restore(); } }); } });

// n04 "But you're not just the seller anymore. You're the co-signer."  a SELLER pill over you; then the bakery's contract drops its chain: an iron ball GUARANTEE clamps your ankle
registerShot('n04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.05, z1: 1.0, x0: 0, x1: 0, y0: 20, y1: 0 });
  zoomed(g, c, () => { const sh = FP.ovenShop(g, t, { glow: true, ovens: 5 }), gy = sh.gy, hx = 900;
    drawToon(g, { x: hx, y: gy + 130, s: 2.1, facing: 1, cast: SHOPKEEP, pose: breathe(posesAt(t, [[0, 'stand'], [0.1, 'explain'], [2.2, 'shrug']]), t), expr: t > 2.3 ? 'shocked' : 'smile', talk: t < 2.0, blink: blink(t), rim: RIM });
    const pk = pop(t, 0.2, 0.35); const co = t > 2.42; g.save(); g.translate(hx, 150); g.scale(pk, pk); const w = co ? 700 : 340; FP.glass(g, -w / 2, -52, w, 104, { r: 30, fill: co ? 'rgba(60,14,18,.95)' : 'rgba(18,22,34,.9)', border: co ? 'rgba(255,100,110,.7)' : 'rgba(255,255,255,.16)' }); text(g, co ? 'SELLER + CO-SIGNER' : 'SELLER', 0, 4, { size: co ? 52 : 62, color: co ? '#ff8a7a' : '#ffffff', stroke: 0 }); g.restore();
    const dp = ease.in(prog(t, 1.9, 2.25)); if (t > 1.9) { const ky = lerp(-200, 340, dp); g.save(); g.translate(1500, ky); g.rotate(Math.sin(t * 30) * 0.03 * (1 - dp)); FP.contract(g, 0, 0, 0.3, 1, { title: 'LOAN', lines: ['Borrower: the bakery', 'Guarantor: YOU'] }); g.restore(); const f = chipFoot(hx - 20, gy + 40, 0.0); FP.chain(g, 1500, ky + 100, hx + 30, gy + 80, { sag: 40 + 80 * (1 - dp), links: 16, ball: dp >= 1 ? 'GUARANTEE' : null }); if (dp < 1) { circle(g, hx + 30, gy + 80 + 46, 56, '#2a2e38'); } }
    if (t > 2.25 && t < 2.7) { glow(g, hx + 30, gy + 120, 260, '#ff6a6a', 0.4 * (1 - prog(t, 2.25, 2.7))); }
    D.plant(g, 160, gy + 20, 1.1, { kind: 'leafy', t }); }); } });

// n05 "That's roughly what Nvidia has done."  the AI chip (a little character) in front of a glass campus, wearing the same chain and ball
registerShot('n05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.12 }), gy = E.H * 0.82;
  zoomed(g, c, () => { sky(g, '#1a1a4a', '#8a4a6a'); FX.stars(g, t, { count: 40, area: [0, 0, E.W, E.H * 0.4] });
    for (const [x, w, h] of [[80, 380, 640], [520, 300, 520], [1260, 440, 700], [1760, 260, 480]]) { rr(g, x, gy - h, w, h, 8); const bg2 = g.createLinearGradient(x, 0, x + w, 0); bg2.addColorStop(0, '#2a4a7a'); bg2.addColorStop(1, '#4a7ab0'); g.fillStyle = bg2; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); for (let r = 0; r < Math.floor(h / 70); r++) for (let q = 0; q < Math.floor(w / 70); q++) { rr(g, x + 18 + q * 66, gy - h + 20 + r * 64, 46, 40, 4); g.fillStyle = (r * 7 + q) % 5 ? '#ffe8a8' : '#9fd0ff'; g.fill(); } }
    rr(g, 600, 120, 320, 62, 12); g.fillStyle = '#12161e'; g.fill(); text(g, 'NVIDIA', 760, 152, { size: 42, color: '#76ff5a', stroke: 0 }); g.fillStyle = '#2a1e3a'; g.fillRect(-E.W, gy, E.W * 3, E.H);
    const cx = 960, cy = gy + 20; chipChar(g, cx, cy, 1.5, t, { mood: 'worried', look: 0.3 }); const f = chipFoot(cx, cy, 1.5); const k = ease.outBack(prog(t, 0.5, 1.0)); if (k > 0) FP.chain(g, f[0] + 170 * (1 - k), f[1] - 20 - 120 * (1 - k), f[0] + 200, f[1] + 10, { sag: 30, links: 8, ball: 'GUARANTEE' });
    [[420, SUIT(MOM, '#3a3a5a'), 1], [1560, SUIT(DAD, '#2a3a4a'), -1]].forEach(([x, cs, fc], i) => drawToon(g, { x, y: gy + 120, s: 1.5, facing: fc, cast: cs, pose: breathe(posesAt(t, [[0, 'stand'], [0.8, 'shrug']]), t + i), expr: 'worried', blink: blink(t + i), rim: RIM })); }); } });

// n06 "As of late October, it reported guarantees of up to one hundred and eighteen billion dollars for customers and partners."
//   hub and spoke: the chip in the middle, chains to customer + partner buildings, the counter climbs to $118B
registerShot('n06', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.12, z1: 1.0 }); zoomed(g, c, () => { backdrop(g, '#0e1420', '#05070c', t, { bokeh: ['#5affb0', '#5ab4ff'] });
  const hx = E.W / 2, hy = E.H * 0.55, N = 8; const nodes = Array.from({ length: N }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / N + 0.2; return [hx + Math.cos(a) * 640, hy + Math.sin(a) * 330, i]; });
  nodes.forEach(([x, y, i]) => { const tk = prog(t, 1.0 + i * 0.22, 1.5 + i * 0.22); if (tk <= 0) return; FP.chain(g, hx, hy, lerp(hx, x, ease.out(tk)), lerp(hy, y, ease.out(tk)), { sag: 24, links: 12 }); const bk = pop(t, 1.3 + i * 0.22, 0.3); g.save(); g.translate(x, y); g.scale(bk, bk);
    rr(g, -86, -64, 172, 128, 14); g.fillStyle = i < 5 ? '#2a3a5a' : '#3a2a5a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); for (let q = 0; q < 4; q++) { rr(g, -66 + q * 34, -42, 24, 60, 4); g.fillStyle = Math.sin(t * 3 + q + i) > -0.4 ? '#5aff8a' : '#2a6a4a'; g.fill(); } text(g, i < 5 ? 'CUSTOMER' : 'PARTNER', 0, 46, { size: 20, color: '#c8d0e0', stroke: 0 }); g.restore(); });
  glow(g, hx, hy, 280, '#5affb0', 0.25); g.save(); g.translate(hx, hy); g.scale(0.7, 0.7); chipChar(g, 0, 130, 1.0, t, { mood: 'worried' }); g.restore();
  const ck = ease.out(prog(t, 0.2, 0.7)); g.save(); g.globalAlpha = ck; FP.glass(g, E.W / 2 - 400, 40, 800, 190, { r: 28 }); text(g, 'GUARANTEES REPORTED · AS OF OCT 25', E.W / 2, 82, { size: 26, color: '#a8b0c8', stroke: 0 }); const n = Math.round(118 * ease.inOut(prog(t, 2.8, 4.6))); text(g, 'UP TO $' + n + 'B', E.W / 2, 160, { size: 100, color: n >= 118 ? '#ffd24a' : '#ffffff', stroke: 0 }); g.restore();
  [[260, MOM], [1660, DAD]].forEach(([x, cs], i) => drawToon(g, { x, y: E.H * 1.02, s: 1.4, facing: i ? -1 : 1, cast: SUIT(cs, '#2a3a5a'), pose: breathe(posesAt(t, [[0, 'stand'], [4.6, 'handsOnHead']]), t + i), expr: t > 4.6 ? 'shocked' : 'neutral', blink: blink(t + i), rim: { color: '#5ab4ff', dir: [0.7, -0.7], w: 3 } })); }); } });

// n07 "About one hundred and five billion of that is tied to data centers in Ohio leased to OpenAI."
//   a drone view of a nine-building campus; OHIO pin drops; the lease is stamped; $105B counts up
registerShot('n07', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.28, z1: 1.0, x0: 60, x1: 0 }); zoomed(g, c, () => { g.fillStyle = '#7aa85a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 24; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.05)'; g.fillRect(-E.W + i * 160, -E.H, 80, E.H * 3); }
  g.fillStyle = '#6a6a72'; g.fillRect(300, 120, 1320, 840); g.fillStyle = '#8a8a92'; g.fillRect(300, 536, 1320, 8); g.fillRect(736, 120, 8, 840); g.fillRect(1176, 120, 8, 840);
  for (let r = 0; r < 3; r++) for (let q = 0; q < 3; q++) { const i = r * 3 + q, bk = ease.outBack(prog(t, 2.0 + i * 0.14, 2.35 + i * 0.14)), x = 360 + q * 440, y = 160 + r * 270; if (bk <= 0) continue; g.save(); g.translate(x + 180, y + 110); g.scale(bk, bk); rr(g, -180, -100, 360, 200, 12); g.fillStyle = '#c8ccd4'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); for (let f = 0; f < 6; f++) { circle(g, -140 + f * 56, -50, 20, '#2a2e38'); g.save(); g.translate(-140 + f * 56, -50); g.rotate(t * 8 + f); for (let b = 0; b < 3; b++) { g.rotate(Math.PI * 2 / 3); seg(g, [[0, 0], [0, -15]], 5, '#c8d0dc'); } g.restore(); } for (let f = 0; f < 6; f++) { circle(g, -140 + f * 56, 30, 20, '#2a2e38'); } text(g, String(i + 1), 0, 72, { size: 40, color: INK, stroke: 0 }); g.restore(); }
  g.fillStyle = '#4a4a52'; g.fillRect(1700, 220, 160, 120); for (let i = 0; i < 4; i++) seg(g, [[1710 + i * 40, 220], [1710 + i * 40, 160]], 6, '#8a8e98'); seg(g, [[1780, 180], [1000, 100]], 3, '#2a2a33');
  const ck = ease.out(prog(t, 0.2, 0.6)); g.save(); g.globalAlpha = ck; FP.glass(g, 330, 8, 620, 180, { r: 26 }); text(g, 'TIED TO ONE CAMPUS', 640, 52, { size: 24, color: '#a8b0c8', stroke: 0 }); const n = Math.round(105 * ease.inOut(prog(t, 0.2, 1.7))); text(g, '$' + n + 'B', 640, 126, { size: 96, color: n >= 105 ? '#ffd24a' : '#ffffff', stroke: 0 }); g.restore();
  const pk = ease.in(prog(t, 3.0, 3.35)); if (t > 3.0) { const py = lerp(-200, 560, pk); g.save(); g.translate(960, py); g.fillStyle = '#e0302a'; g.beginPath(); g.arc(0, -70, 46, Math.PI, 0); g.lineTo(0, 0); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); circle(g, 0, -70, 16, '#ffffff'); g.restore(); if (pk >= 1) text(g, 'OHIO', 960, 640, { size: 80, color: '#ffffff', stroke: 10, strokeColor: INK }); }
  FP.stamp(g, E.W * 0.72, 760, 0.9, 'LEASED TO OPENAI', '#1f5ae0', prog(t, 3.8, 4.1), { fs: 52, rot: -0.08 }); }); } });

// n08 "If the tenant can't pay, Nvidia can be on the hook, up to that limit."  a tenant shrugs with empty pockets; a big hook lowers, catches the chip by its chain; a LIMIT line
registerShot('n08', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 40, x1: -30 }), gy = E.H * 0.84;
  zoomed(g, c, () => { sky(g, '#2a2060', '#c86a8a'); FX.stars(g, t, { count: 30, area: [0, 0, E.W, E.H * 0.35] }); g.fillStyle = '#2a1e3a'; g.fillRect(-E.W, gy, E.W * 3, E.H);
    rr(g, 140, gy - 360, 520, 360, 10); g.fillStyle = '#8a92a4'; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); text(g, 'DATA CENTER', 400, gy - 320, { size: 30, color: '#1a1c22', stroke: 0 }); for (let i = 0; i < 4; i++) { circle(g, 220 + i * 100, gy - 220, 36, '#2a2e38'); }
    drawToon(g, { x: 760, y: gy + 100, s: 1.9, facing: -1, cast: STRANGER, pose: breathe(posesAt(t, [[0, 'stand'], [0.7, 'shrug']]), t), expr: t > 0.7 ? 'awkward' : 'neutral', blink: blink(t), rim: RIM });
    for (const d of [-1, 1]) { const px = 760 + d * 60, py = gy - 70; g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(px - 12, py); g.lineTo(px + 12, py); g.lineTo(px + d * 14, py + 52); g.lineTo(px - d * 6, py + 44); g.closePath(); if (t > 0.9) { g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); } }
    const bk = pop(t, 0.5, 0.3); if (bk > 0) { g.save(); g.translate(760, gy - 540); g.scale(bk, bk); rr(g, -120, -44, 240, 88, 12); g.fillStyle = '#fbf6ea'; g.fill(); g.strokeStyle = '#c8202a'; g.lineWidth = 6; g.stroke(); text(g, 'RENT DUE', 0, 4, { size: 40, color: '#c8202a', stroke: 0 }); g.restore(); }
    const cx = 1230, hook = ease.inOut(prog(t, 1.4, 2.4)), hy = lerp(-120, gy - 560, hook), cyy = gy + 30 - (hook >= 1 ? 90 * ease.out(prog(t, 2.4, 2.8)) : 0);
    seg(g, [[cx, -60], [cx, hy]], 10, '#8a8e98'); g.save(); g.translate(cx, hy); g.strokeStyle = INK; g.lineWidth = 22; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 120); g.arc(-50, 120, 50, 0, Math.PI * 1.1); g.stroke(); g.strokeStyle = '#c8ced8'; g.lineWidth = 12; g.stroke(); g.restore();
    const chipY = cyy; chipChar(g, cx - 50, chipY, 1.2, t, { mood: 'worried', look: -0.5 }); if (hook >= 1) FP.chain(g, cx - 50, hy + 150, cx - 50, chipY - 250, { sag: 0, links: 6 });
    const lx = 1700; seg(g, [[lx, gy - 760], [lx, gy]], 14, '#c8ced8'); for (let i = 0; i <= 6; i++) { seg(g, [[lx - 30, gy - i * 126], [lx + 30, gy - i * 126]], 4, INK); } const lk = pop(t, 3.0, 0.3); seg(g, [[lx - 330, gy - 640], [lx + 120, gy - 640]], 10, '#ff4d5e'); if (lk > 0) { g.save(); g.translate(lx - 400, gy - 640); g.scale(lk, lk); rr(g, -10, -56, 320, 112, 16); g.fillStyle = '#c8202a'; g.fill(); text(g, 'LIMIT', 150, -14, { size: 38, color: '#ffffff', stroke: 0 }); text(g, '$118B', 150, 28, { size: 50, color: '#ffffff', stroke: 0 }); g.restore(); } }); } });
