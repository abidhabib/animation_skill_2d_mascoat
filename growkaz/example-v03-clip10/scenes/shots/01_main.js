// V03 Clip 10 "earn more, worth less": the earnings-call boardroom, the BEAT cards, the gear machine (profit up -> target up), 21 analysts cutting,
// the spreadsheet that pulls back to a baffled analyst, the hourglass beside the steady profit.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, ROOMMATE, DAD, MOM, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, zoomed, pop, money, backdrop, coinStack, box } from '/engine/finfx.js';

const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM];
const SUIT = (c, col) => ({ ...c, top: col, topDark: '#1a1a24', collar: '#e8e8f0' });
const COAT = (c) => ({ ...c, top: '#f4f4f8', topDark: '#d0d0d8', collar: '#c0c0c8' });
const RIM = { color: '#9fc8ff', dir: [0.7, -0.7], w: 3 };

// ---- boardroom (j01, j02) ----
function boardroom(g, t, o = {}) { const grow = o.grow ?? 1, cheer = o.cheer ?? 0;
  const bg = g.createLinearGradient(0, 0, 0, E.H); bg.addColorStop(0, '#162040'); bg.addColorStop(1, '#0c1226'); g.fillStyle = bg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  for (const x of [60, E.W - 360]) { rr(g, x, 70, 300, 420, 10); g.fillStyle = '#0a1030'; g.fill(); g.strokeStyle = '#3a4880'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#1a2a60'; for (let i = 0; i < 9; i++) g.fillRect(x + 14 + (i * 37) % 260, 470 - 40 - (i * 53) % 250, 22, 40 + (i * 53) % 250); for (let i = 0; i < 26; i++) { g.fillStyle = (i % 3) ? '#ffcf8a' : '#8ad8ff'; g.fillRect(x + 16 + (i * 41) % 270, 90 + (i * 67) % 380, 5, 7); } }
  // big wall screen: revenue bars
  rr(g, 430, 70, 1060, 440, 14); g.fillStyle = '#05070f'; g.fill(); g.strokeStyle = '#4a5890'; g.lineWidth = 8; g.stroke(); text(g, 'QUARTERLY REVENUE', 480, 118, { size: 30, color: '#a8b0c8', stroke: 0, align: 'left' });
  const bx = [640, 1000], vals = [0.5, 0.5 * (1 + 1.03 * grow)], labs = ['LAST YEAR', 'THIS YEAR'];
  [0, 1].forEach((i) => { const h = 300 * vals[i], col = i ? '#2fd67a' : '#6a7490'; rr(g, bx[i], 470 - h, 220, h, 14); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.fillStyle = 'rgba(255,255,255,.18)'; g.fillRect(bx[i] + 14, 470 - h + 12, 18, Math.max(0, h - 24)); text(g, labs[i], bx[i] + 110, 494, { size: 22, color: '#a8b0c8', stroke: 0 }); });
  if (grow > 0.9) { const k = pop(t, 5.55, 0.35); g.save(); g.translate(1330, 250); g.scale(k, k); text(g, '+103%', 0, 0, { size: 100, color: '#5aff8a', stroke: 0, glow: 22, glowColor: '#2fd67a' }); g.restore(); }
  // people behind the table
  const ppl = [[330, SUIT(MOM, '#3a3a5a')], [610, SUIT(SAM, '#2a2a2a')], [890, SUIT(SHOPPER(3), '#5a2a3a')], [1170, SUIT(DAD, '#2a3a4a')], [1450, SUIT(ROOMMATE, '#3a4a3a')], [1730, SUIT(SHOPPER(0), '#4a3a5a')]];
  ppl.forEach(([x, cs], i) => { const ch = cheer > 0 && t > cheer + i * 0.1; drawToon(g, { x, y: 1000, s: 1.5, facing: i < 3 ? 1 : -1, cast: cs, pose: ch ? breathe(posesAt(t + i * 0.2, [[0, 'cheer'], [0.5, 'pointUp'], [1.0, 'cheer']]), t + i) : breathe(POSES.stand, t + i), expr: ch ? 'joy' : 'neutral', blink: blink(t + i), rim: RIM, talk: !ch && i === 2 }); });
  // table (wide, wood) + laptops + speakerphone
  rr(g, 120, 760, E.W - 240, 110, 30); const tg = g.createLinearGradient(0, 760, 0, 870); tg.addColorStop(0, '#9a6a48'); tg.addColorStop(1, '#6a4430'); g.fillStyle = tg; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); g.fillStyle = '#3a2418'; g.fillRect(150, 870, E.W - 300, 110); g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(130, 766, E.W - 260, 10);
  for (let i = 0; i < 6; i++) { const x = 330 + i * 280 - (i < 3 ? 40 : 0); rr(g, x - 60, 722, 120, 58, 8); g.fillStyle = '#b8bec8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); circle(g, x, 750, 7, '#d8dce4'); }
  const sp = E.W / 2; const pul = 0.5 + 0.5 * Math.sin(t * 5); g.beginPath(); g.ellipse(sp, 820, 130, 36, 0, 0, 7); g.fillStyle = '#2a2e38'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.beginPath(); g.ellipse(sp, 818, 98, 24, 0, 0, 7); g.strokeStyle = `rgba(90,255,176,${0.5 + 0.5 * pul})`; g.lineWidth = 6; g.stroke(); glow(g, sp, 820, 200, '#5affb0', 0.18 + 0.1 * pul);
  D.mug(g, 220, 770, 0.8, { color: '#f4f0e6', t }); D.bottle(g, E.W - 200, 770, 0.65, {}); }

// j01 "Then something even stranger happened. On November seventeenth, Nvidia reported revenue more than double the year before."
registerShot('j01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: -80, x1: 80, y0: 0, y1: -20 });
  zoomed(g, c, () => { boardroom(g, t, { grow: ease.inOut(prog(t, 3.7, 5.7)) }); const k = pop(t, 0.2, 0.4); if (k > 0) { g.save(); g.translate(170, 150); g.scale(0.85 * k, 0.85 * k); D.calendar(g, 0, 0, 1, { month: 'NOV', day: 17, color: '#e0302a' }); g.restore(); } }); } });

// j02 "It beat forecasts, and it said next quarter would be even bigger."  the room cheers; two glass cards slide in: BEAT, NEXT QUARTER
registerShot('j02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.18, x0: 0, x1: 0, y0: 0, y1: 40 });
  zoomed(g, c, () => { boardroom(g, t, { grow: 1, cheer: 0.7 });
    [[0.25, 90, 'RESULTS', 'BEAT FORECASTS', '✓', GREEN], [1.45, E.W - 590, 'NEXT QUARTER', 'EVEN BIGGER', '▲', '#7affc0']].forEach(([t0, x, a, b, ic, col]) => { const k = ease.outBack(prog(t, t0, t0 + 0.4)); if (k <= 0) return; g.save(); g.translate(x + 250, 330); g.scale(k, k); FP.glass(g, -250, -110, 500, 220, { r: 26 }); circle(g, -170, 0, 46, col); text(g, ic, -170, 4, { size: 56, color: '#0a1a10', stroke: 0 }); text(g, a, 70, -44, { size: 26, color: '#a8b0c8', stroke: 0 }); text(g, b, 60, 20, { size: 44, color: '#ffffff', stroke: 0 }); g.restore(); }); }); } });

// j03 "Normally, that means a higher price target. That's how the math is supposed to work."  a gear machine: PROFIT up goes in, PRICE TARGET up comes out
function gear(g, x, y, r, n, rot, col) { g.save(); g.translate(x, y); g.rotate(rot); g.beginPath(); for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n, w = Math.PI / n * 0.5; for (const [da, rr_] of [[-1.7, 0.8], [-0.8, 1], [0.8, 1], [1.7, 0.8]]) g.lineTo(Math.cos(a + da * w) * r * rr_, Math.sin(a + da * w) * r * rr_); } g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); circle(g, 0, 0, r * 0.38, '#2a2e38'); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); for (let i = 0; i < 3; i++) { g.rotate(Math.PI * 2 / 3); circle(g, r * 0.6, 0, r * 0.09, '#2a2e38'); } g.restore(); }
function tag(g, x, y, s, label, col, arrow) { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -130, -50, 260, 100, 14); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); text(g, label, -18, -4, { size: 32, color: '#ffffff', stroke: 0 }); g.fillStyle = '#ffffff'; g.beginPath(); g.moveTo(88, -26); g.lineTo(114, 8); g.lineTo(98, 8); g.lineTo(98, 28); g.lineTo(78, 28); g.lineTo(78, 8); g.lineTo(62, 8); g.closePath(); g.fill(); g.restore(); }
registerShot('j03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 40, x1: -40 });
  zoomed(g, c, () => { const bg = g.createLinearGradient(0, 0, 0, E.H); bg.addColorStop(0, '#2a6a8a'); bg.addColorStop(1, '#14384a'); g.fillStyle = bg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(i * 170, 0, 80, E.H); }
    g.fillStyle = '#1a2830'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H);
    // machine body
    rr(g, 560, 190, 800, 560, 36); g.fillStyle = '#e0a838'; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); rr(g, 600, 240, 720, 400, 24); g.fillStyle = '#1c2a34'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    const spin = t * 1.6; gear(g, 760, 460, 130, 12, spin, '#c8d0dc'); gear(g, 990, 380, 92, 9, -spin * 1.43 + 0.2, '#a8b4c8'); gear(g, 1160, 500, 110, 11, spin * 1.18 + 0.1, '#d8dee8'); gear(g, 1050, 570, 60, 7, -spin * 2.2, '#8a96aa');
    rr(g, 800, 170, 320, 70, 14); g.fillStyle = '#1a1c22'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); text(g, 'THE MATH MACHINE', 960, 207, { size: 36, color: '#ffe28a', stroke: 0 });
    for (let i = 0; i < 5; i++) circle(g, 620 + i * 36, 700, 12, Math.sin(t * 8 + i * 1.3) > 0 ? '#5aff8a' : '#2a4a34'); seg(g, [[1280, 700], [1280, 770]], 12, '#8a8e98'); circle(g, 1280, 700, 26, '#e0302a'); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
    for (let i = 0; i < 4; i++) { const p = ((t * 0.6 + i * 0.27) % 1); g.fillStyle = `rgba(255,255,255,${0.35 * (1 - p)})`; g.beginPath(); g.arc(1010 + i * 40 + Math.sin(p * 6) * 12, 170 - p * 140, 14 + p * 26, 0, 7); g.fill(); }
    // conveyors + boxes
    const belt = (x0, x1) => { rr(g, x0, 780, x1 - x0, 46, 12); g.fillStyle = '#3a3e48'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); for (let x = x0 + (t * 120) % 60; x < x1; x += 60) seg(g, [[x, 790], [x - 18, 816]], 4, '#5a5e68'); };
    belt(300, 580); belt(1340, 1640);
    const ip = prog(t, 0.0, 1.5); if (ip < 1) tag(g, lerp(330, 560, ease.inOut(ip)), 735, 0.62 * (1 - 0.3 * prog(ip, 0.85, 1)), 'PROFIT', '#2fa86a');
    const op = prog(t, 1.65, 3.6); if (op > 0) { const k = ease.outBack(prog(t, 1.65, 2.0)); tag(g, lerp(1380, 1580, ease.out(op)), 735 - 20 * (1 - k), 0.7 * k, 'TARGET', '#2f6ae0'); }
    if (t > 1.65 && t < 2.1) glow(g, 1340, 740, 220, '#ffe28a', 0.5 * (1 - prog(t, 1.65, 2.1)));
    const sh = (t > 1.5 && t < 1.8) ? Math.sin(t * 70) * 3 : 0; g.save(); g.translate(sh, 0); g.restore();
    [[130, STRANGER, 1, 0.3, 'happy'], [1790, SHOPPER(2), -1, 1.3, 'joy']].forEach(([x, cs, f, t0, ex]) => drawToon(g, { x, y: E.H * 1.0, s: 1.4, facing: f, cast: COAT(cs), pose: breathe(posesAt(t, [[0, 'stand'], [t0, 'point'], [t0 + 1.4, 'cheer']]), t), expr: ex, blink: blink(t + x), rim: { color: '#ffe2b0', dir: [0.7, -0.7], w: 3 } })); }); } });

// j04 "But in those same days, more than twenty analysts cut what they think the stock is worth."  21 analysts at desks, price-target notes flip $300 -> $220 in red
registerShot('j04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.1, z1: 1.0, x0: 0, x1: 0, y0: 50, y1: -20 });
  zoomed(g, c, () => { const bg = g.createLinearGradient(0, 0, 0, E.H); bg.addColorStop(0, '#2a3a5a'); bg.addColorStop(1, '#161e34'); g.fillStyle = bg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 7; i++) { rr(g, 40 + i * 270, 40, 220, 280, 8); g.fillStyle = '#1a2a50'; g.fill(); for (let q = 0; q < 14; q++) { g.fillStyle = q % 3 ? '#ffcf8a' : '#8ad8ff'; g.fillRect(52 + i * 270 + (q * 37) % 190, 56 + (q * 59) % 240, 6, 8); } }
    g.fillStyle = '#2a2230'; g.fillRect(-E.W, E.H * 0.5, E.W * 3, E.H); let n = 0; const flips = [];
    for (let r = 0; r < 3; r++) for (let q = 0; q < 7; q++) flips.push([r, q, 1.2 + (r * 7 + q) * 0.12]);
    flips.forEach(([r, q, tf]) => { const x = 160 + q * 265 + (r % 2) * 60, y = 600 + r * 190, s = 0.58 + r * 0.04; const flipped = t > tf; if (flipped) n++; const ci = (r * 7 + q) % CROWD.length;
      rr(g, x - 88 * s * 1.5, y - 4, 176 * s * 1.5, 52 * s * 1.5, 8); g.fillStyle = '#6a4a30'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); rr(g, x - 44, y - 78, 88, 56, 6); g.fillStyle = '#10141c'; g.fill(); g.strokeStyle = '#4a5060'; g.lineWidth = 3; g.stroke(); riseSpark(g, x - 36, y - 70, 72, 40, flipped, t + q);
      drawToon(g, { x, y: y + 14, s, facing: q % 2 ? 1 : -1, cast: SUIT(CROWD[ci], ['#2a3a5a', '#3a2a3a', '#2a2a2a'][(q + r) % 3]), pose: breathe(POSES.stand, t + q * 0.3), expr: flipped ? 'worried' : 'smile', blink: blink(t + q + r), rim: RIM });
      const kk = ease.outBack(prog(t, tf - 0.25, tf)), kf = ease.inOut(prog(t, tf, tf + 0.18)); g.save(); g.translate(x, y - 250 - 8 * Math.sin(t * 2 + q)); g.scale(kk, kk * ((kf > 0 && kf < 1) ? Math.max(0.05, Math.abs(Math.cos(kf * Math.PI))) : 1)); rr(g, -64, -34, 128, 68, 10); g.fillStyle = flipped ? '#ffd0d4' : '#fff6a8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
      text(g, flipped ? '$220' : '$300', -8, -2, { size: 34, color: flipped ? '#c8202a' : INK, stroke: 0 }); if (flipped) { g.fillStyle = '#c8202a'; g.beginPath(); g.moveTo(42, -10); g.lineTo(54, -10); g.lineTo(48, 12); g.closePath(); g.fill(); } g.restore(); });
    FP.glass(g, E.W - 520, 60, 450, 150, { r: 22 }); text(g, 'ANALYSTS CUTTING TARGETS', E.W - 295, 100, { size: 22, color: '#a8b0c8', stroke: 0 }); text(g, n + (n >= 21 ? '  (20+)' : ''), E.W - 295, 160, { size: 62, color: '#ff8a7a', stroke: 0 });
    text(g, 'illustrative', 90, E.H - 30, { size: 20, color: '#6a7080', stroke: 0, align: 'left' }); }); } });
function riseSpark(g, x, y, w, h, down, ph) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.beginPath(); for (let i = 0; i <= 8; i++) { const v = down ? 0.15 + i * 0.09 + Math.sin(i + ph) * 0.05 : 0.9 - i * 0.09 + Math.sin(i + ph) * 0.05; i ? g.lineTo(x + i * w / 8, y + h * v) : g.moveTo(x, y + h * v); } g.strokeStyle = down ? '#ff4d5e' : '#2fd67a'; g.lineWidth = 3; g.stroke(); g.restore(); }

// j05 "Earn more. Worth less. In the same spreadsheet."  the sheet fills the frame; EARNINGS up (green), TARGET down (red); pull back to a baffled analyst
registerShot('j05', { draw(g, t, info) { const k = ease.inOut(prog(t, 1.7, 3.4)), z = lerp(1.55, 1.0, k), c = { z, x: lerp(279, 0, k), y: lerp(318, 0, k) };
  zoomed(g, c, () => { const wall = g.createLinearGradient(0, 0, 0, E.H); wall.addColorStop(0, '#3a4258'); wall.addColorStop(1, '#232a3c'); g.fillStyle = wall; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 6; i++) { rr(g, 40 + i * 320, 30, 240, 90, 6); g.fillStyle = '#1a2038'; g.fill(); }
    g.fillStyle = '#5a3c28'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H); g.fillStyle = '#7a5238'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, 14);
    rr(g, 120, 60, 1320, 770, 26); g.fillStyle = '#12151c'; g.fill(); g.strokeStyle = '#3a3f50'; g.lineWidth = 10; g.stroke(); seg(g, [[780, 830], [780, 930]], 40, '#2a2e3a'); rr(g, 600, 920, 360, 26, 10); g.fillStyle = '#2a2e3a'; g.fill();
    const cells = [['', 'LAST YEAR', 'NEXT YEAR'], ['EARNINGS', '$100', t > 0.12 ? '$140' : ''], ['PRICE TARGET', '$300', t > 1.06 ? '$220' : '']]; const hi = [];
    if (t > 0.12) hi.push([1, 2, '#c8f0d8', '#0f6a3a']); if (t > 1.06) hi.push([2, 2, '#ffd0d4', '#c8202a']);
    FP.sheet(g, 160, 100, 1240, cells, { rowH: 118, fs: 42, hi, title: 'Analyst model — v7_FINAL.xlsx' });
    const a = pop(t, 0.1, 0.3); if (a > 0) { g.save(); g.translate(1330, 330); g.scale(a, a); g.fillStyle = '#2fd67a'; g.beginPath(); g.moveTo(0, -34); g.lineTo(34, 8); g.lineTo(12, 8); g.lineTo(12, 34); g.lineTo(-12, 34); g.lineTo(-12, 8); g.lineTo(-34, 8); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); g.restore(); }
    const b = pop(t, 1.06, 0.3); if (b > 0) { g.save(); g.translate(1330, 448); g.scale(b, b); g.fillStyle = '#ff4d5e'; g.beginPath(); g.moveTo(0, 34); g.lineTo(34, -8); g.lineTo(12, -8); g.lineTo(12, -34); g.lineTo(-12, -34); g.lineTo(-12, -8); g.lineTo(-34, -8); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); g.restore(); }
    for (const [x, y, col, rot] of [[1250, 70, '#ffe66a', 0.1], [1310, 40, '#ff9ac8', -0.08]]) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.fillRect(-46, -46, 92, 92); g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 3; g.strokeRect(-46, -46, 92, 92); text(g, '??', 0, 4, { size: 40, color: '#2a2a33', stroke: 0 }); g.restore(); }
    D.mug(g, 1560, E.H * 0.86, 1.3, { color: '#e0562f', t }); D.deskLamp(g, 80, E.H * 0.86, 1.1, { on: 1 }); D.plant(g, 1850, E.H * 0.86, 1.1, { kind: 'round', t });
    drawToon(g, { x: 1640, y: E.H * 1.0, s: 1.5, facing: -1, cast: COAT(MOM), pose: breathe(posesAt(t, [[0, 'stand'], [2.0, 'think'], [2.9, 'facepalm']]), t), expr: t > 2.9 ? 'tired' : (t > 2.0 ? 'confused' : 'neutral'), look: [-0.7, 0], blink: blink(t), rim: { color: '#9fc8ff', dir: [0.7, -0.7], w: 3 } });
    const qk = pop(t, 2.5, 0.35); if (qk > 0) { g.save(); g.translate(1500, 360); g.scale(qk * 0.9, qk * 0.9); D.mark(g, 0, 0, 1, { ch: '?' }); g.restore(); } }); } });

// j06 "That only makes sense if the worry isn't today's profit. The worry is how long that profit lasts."
//   a steady pile of profit coins; a big hourglass drains beside it; three investors watch the sand; HOW LONG? glows
registerShot('j06', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.12, x0: 50, x1: -60, y0: 0, y1: -20 });
  zoomed(g, c, () => { const bg = g.createLinearGradient(0, 0, 0, E.H); bg.addColorStop(0, '#18204a'); bg.addColorStop(1, '#0c1128'); g.fillStyle = bg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    rr(g, 620, 60, 700, 420, 12); g.fillStyle = '#0a1030'; g.fill(); g.strokeStyle = '#3a4880'; g.lineWidth = 8; g.stroke(); for (let i = 0; i < 40; i++) { g.fillStyle = i % 3 ? '#ffcf8a' : '#8ad8ff'; g.fillRect(640 + (i * 53) % 660, 90 + (i * 71) % 370, 6, 8); }
    g.fillStyle = '#1a1830'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H); g.fillStyle = '#2a2644'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, 12);
    // today's profit: steady coin pillars
    FP.glass(g, 120, 130, 520, 90, { r: 20 }); text(g, "TODAY'S PROFIT", 380, 176, { size: 38, color: GOLD, stroke: 0 });
    for (const [x, n] of [[230, 20], [380, 26], [530, 17]]) { glow(g, x, E.H * 0.86 - n * 8, 120, GOLD, 0.15); coinStack(g, x, E.H * 0.86, n, 0.9); }
    D.cash(g, 300, E.H * 0.86 - 10, 0.5, { text: '' });
    const k = prog(t, 0.3, 5.3); FP.hourglass(g, 1010, 560, 2.0, k, { sand: '#f0b020' }); glow(g, 1010, 560, 360, '#f0b020', 0.12);
    const lk = pop(t, 3.7, 0.4); if (lk > 0) { g.save(); g.translate(1010, 150); g.scale(lk, lk); FP.glass(g, -230, -60, 460, 120, { r: 26, fill: 'rgba(40,10,14,.92)', border: 'rgba(255,100,110,.6)' }); text(g, 'HOW LONG?', 0, 4, { size: 76, color: '#ff8a7a', stroke: 0, glow: 18, glowColor: '#ff3a4a' }); g.restore(); }
    [[1500, MOM, 0.2], [1680, DAD, 0.6], [1840, SAM, 1.0]].forEach(([x, cs, d], i) => drawToon(g, { x, y: E.H * 1.0, s: 1.4, facing: -1, cast: SUIT(cs, ['#2a3a5a', '#3a2a3a', '#2a2a2a'][i]), pose: breathe(posesAt(t, [[0, 'stand'], [d + 0.5, i === 1 ? 'crossArms' : 'think'], [4.0, 'handsOnHead']]), t + i), expr: t > 3.7 ? 'worried' : 'neutral', look: [-0.8, -0.1], blink: blink(t + i), rim: RIM })); }); } });
