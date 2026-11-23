// V03 Clip 11 "follow the money": coins flow big tech -> data center -> chip factory (pan upstream), the fine-print magnifier, the vault funding a
// construction site, the sign flipping to BORROWED with the Fed report and the $680B counter, the 5x bars.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, ROOMMATE, DAD, MOM, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, zoomed, pop, money, backdrop, coinStack, box, mix } from '/engine/finfx.js';

const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM];
const SUIT = (c, col) => ({ ...c, top: col, topDark: '#1a1a24', collar: '#e8e8f0' });
const HARD = (c) => ({ ...c, cap: '#ffd03a', top: '#ff8a1a', topDark: '#c0600a', collar: '#c0600a' });
const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3 };

// k01 "So what could make it stop? ... follow the money back to the buyer."  one long world; coins flow tower -> data center -> chip factory; the camera pans UPSTREAM to the buyer
registerShot('k01', { draw(g, t, info) { const camX = lerp(1290, -420, ease.inOut(prog(t, 0.4, 4.9))), gy = E.H * 0.8;
  const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#2a2060'); sky.addColorStop(0.55, '#c86a8a'); sky.addColorStop(1, '#ffb878'); g.fillStyle = sky; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.72, gy - 60, 520, '#ffd08a', 0.35); FX.stars(g, t, { count: 40, area: [0, 0, E.W, E.H * 0.35] });
  g.save(); g.translate(-camX * 0.5, 0); for (let i = 0; i < 14; i++) { const h = 160 + (i * 97) % 220; g.fillStyle = '#3a2a58'; g.fillRect(i * 230 - 200, gy - h, 160, h); } g.restore();
  g.save(); g.translate(-camX, 0);
  g.fillStyle = '#3a3a48'; g.fillRect(-800, gy, 4600, E.H); g.fillStyle = '#4a4a58'; g.fillRect(-800, gy + 16, 4600, 120); for (let x = -800; x < 3800; x += 110) seg(g, [[x, gy + 76], [x + 56, gy + 76]], 6, '#ffd03a');
  // BUYER: glass tower
  rr(g, 230, 140, 380, gy - 140, 10); const tg = g.createLinearGradient(230, 0, 610, 0); tg.addColorStop(0, '#3a6aa8'); tg.addColorStop(1, '#6aa0d8'); g.fillStyle = tg; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  for (let r = 0; r < 12; r++) for (let q = 0; q < 5; q++) { rr(g, 256 + q * 68, 176 + r * 62, 50, 42, 4); g.fillStyle = (r * 5 + q) % 4 ? '#ffe8a8' : '#bfe0ff'; g.fill(); }
  seg(g, [[420, 140], [420, 60]], 8, '#8a8e98'); circle(g, 420, 56, 10, '#ff3a3a'); rr(g, 270, 100, 300, 52, 10); g.fillStyle = '#1a1c22'; g.fill(); text(g, 'BIG TECH', 420, 128, { size: 38, color: '#ffffff', stroke: 0 });
  rr(g, 40, 300, 160, gy - 300, 8); g.fillStyle = '#2a4a7a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, 650, 380, 130, gy - 380, 8); g.fillStyle = '#2a4a7a'; g.fill(); g.stroke();
  const pk = pop(t, 3.6, 0.5); if (pk > 0) { g.save(); g.translate(830, 250); g.scale(pk, pk); text(g, 'THE BUYER', 0, 0, { size: 64, color: '#ffffff', stroke: 9, strokeColor: INK }); seg(g, [[640 - 830 + 20, 0], [-150, 0]], 8, '#ffffff'); g.restore(); }
  // DATA CENTER
  rr(g, 1060, gy - 260, 640, 260, 10); g.fillStyle = '#9aa4b4'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); for (let i = 0; i < 4; i++) { rr(g, 1100 + i * 140, gy - 210, 110, 150, 8); g.fillStyle = '#6a7484'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); circle(g, 1155 + i * 140, gy - 135, 44, '#2a2e38'); g.save(); g.translate(1155 + i * 140, gy - 135); g.rotate(t * 9 + i); for (let b = 0; b < 3; b++) { g.rotate(Math.PI * 2 / 3); seg(g, [[0, 0], [0, -36]], 10, '#c8d0dc'); } g.restore(); }
  for (let i = 0; i < 3; i++) { rr(g, 1110 + i * 200, gy - 300, 120, 44, 6); g.fillStyle = '#7a8494'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); } rr(g, 1180, gy - 60 - 70, 500, 50, 8); g.fillStyle = '#1a1c22'; g.fill(); text(g, 'AI DATA CENTER', 1430, gy - 105, { size: 34, color: '#76ff5a', stroke: 0 });
  for (const x of [980, 1760]) { seg(g, [[x, gy], [x, gy - 360]], 12, '#4a3a2a'); seg(g, [[x - 60, gy - 330], [x + 60, gy - 330]], 8, '#4a3a2a'); } g.strokeStyle = '#2a2a33'; g.lineWidth = 3; g.beginPath(); g.moveTo(980, gy - 326); g.quadraticCurveTo(1370, gy - 250, 1760, gy - 326); g.stroke();
  // CHIP FACTORY
  rr(g, 1960, gy - 300, 680, 300, 10); g.fillStyle = '#d8c8b0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); for (const x of [2060, 2260]) { rr(g, x, gy - 520, 70, 230, 6); g.fillStyle = '#a89888'; g.fill(); g.stroke(); for (let i = 0; i < 4; i++) { const p = ((t * 0.5 + i * 0.25) % 1); g.fillStyle = `rgba(255,255,255,${0.5 * (1 - p)})`; g.beginPath(); g.arc(x + 35 + Math.sin(p * 5 + i) * 20, gy - 540 - p * 160, 24 + p * 36, 0, 7); g.fill(); } }
  rr(g, 2380, gy - 480, 270, 230, 16); g.fillStyle = '#20262e'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); glow(g, 2515, gy - 365, 200, '#5affb0', 0.3); rr(g, 2440, gy - 440, 150, 150, 12); g.fillStyle = '#2f3a44'; g.fill(); g.strokeStyle = '#5affb0'; g.lineWidth = 4; g.stroke(); text(g, 'AI', 2515, gy - 365, { size: 70, color: '#d8ffee', stroke: 0, glow: 16, glowColor: '#5affb0' });
  for (let i = 0; i < 5; i++) { rr(g, 2000 + i * 120, gy - 160, 90, 110, 6); g.fillStyle = '#3a4a5a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); } text(g, 'CHIP MAKER', 2300, gy - 20, { size: 30, color: INK, stroke: 0 });
  // the money trail: coins run along the road from the buyer to the chip maker; trucks too
  g.setLineDash([22, 16]); g.lineDashOffset = -t * 120; seg(g, [[600, gy + 60], [2400, gy + 60]], 8, 'rgba(255,226,138,.8)'); g.setLineDash([]);
  for (let i = 0; i < 12; i++) { const p = ((t * 0.38 + i / 12) % 1), x = lerp(600, 2400, p), y = gy + 60 - Math.abs(Math.sin(p * 40)) * 34; glow(g, x, y, 40, GOLD, 0.35); circle(g, x, y, 20, '#ffc83a'); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 20, 0, 7); g.stroke(); text(g, '$', x, y + 2, { size: 22, color: '#a86a10', stroke: 0 }); }
  for (let i = 0; i < 2; i++) D.car(g, lerp(500, 2300, ((t * 0.16 + i * 0.5) % 1)), gy + 118, 0.9, { spin: t * 5 });
  [[860, SAM, 1], [1860, MOM, -1]].forEach(([x, cs, f], i) => drawToon(g, { x, y: gy + 30, s: 0.7, facing: f, cast: cs, pose: walkPose(t * 6 + i), expr: 'smile', blink: blink(t + i), rim: RIM }));
  g.restore(); } });

// k02 "Here's the part most people skip."  a magnifier slides over a page of fine print and reveals: AI data centers will be funded by DEBT
const DOCL = ['1.1  Definitions. In this Agreement the following terms shall have the meanings given below,', '1.2  The Borrower shall cause the Facility to be operated in accordance with applicable standards,', '2.1  Payments under Schedule B are due on the dates stated therein, subject to Clause 9,', '2.4  Any amount not paid when due shall bear interest at the rate specified in Schedule C,', '3.1  Construction of the AI data centers described in Schedule A', '3.2  Representations. Each party represents that it has full power and authority,', '4.1  Notices shall be in writing and delivered to the addresses set out above,', '4.3  This Agreement is governed by the laws of the State of New York,', '5.2  The parties acknowledge that the terms set out in Annex D form part of this Agreement,', '6.1  Counterparts. This Agreement may be executed in any number of counterparts,'];
function doc(g, x0, y0, hot) { DOCL.forEach((l, i) => { const y = y0 + i * 62; g.save(); g.font = '600 19px Georgia, serif'; g.textBaseline = 'middle'; g.textAlign = 'left'; g.fillStyle = '#5a5648'; if (i === 4) { g.fillText('3.1  Construction of the AI data centers described in Schedule A is funded by', x0, y); const w = g.measureText('3.1  Construction of the AI data centers described in Schedule A is funded by ').width; g.font = '900 21px Georgia, serif'; g.fillStyle = hot ? '#d81e2a' : '#5a5648'; g.fillText('DEBT', x0 + w, y); } else g.fillText(l, x0, y); g.restore(); }); }
registerShot('k02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1 });
  zoomed(g, c, () => { const wood = g.createLinearGradient(0, 0, E.W, E.H); wood.addColorStop(0, '#8a5a3a'); wood.addColorStop(1, '#5a3824'); g.fillStyle = wood; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.03)'; g.fillRect(-E.W, i * 66 - 100, E.W * 3, 32); }
    const px = 330, py = 70, pw = 1260, ph = 940; g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 40; g.shadowOffsetY = 20; rr(g, px, py, pw, ph, 6); g.fillStyle = '#f8f4e8'; g.fill(); g.restore();
    text(g, 'FINANCING AGREEMENT', px + 60, py + 70, { size: 46, color: '#2a2a33', stroke: 0, align: 'left' }); seg(g, [[px + 60, py + 110], [px + pw - 60, py + 110]], 4, '#2a2a33'); doc(g, px + 60, py + 190, false);
    const lk = ease.inOut(prog(t, 0.2, 1.5)), hotY = py + 190 + 4 * 62, lx = lerp(px + 360, px + 700, lk), ly = lerp(py + 360, hotY, lk) + Math.sin(t * 3) * 3, R = 210, Z = 2.6;
    g.save(); g.beginPath(); g.arc(lx, ly, R, 0, 7); g.clip(); g.fillStyle = '#fffcf0'; g.fillRect(lx - R, ly - R, R * 2, R * 2); g.translate(lx, ly); g.scale(Z, Z); g.translate(-lx, -ly); doc(g, px + 60, py + 190, t > 1.45); g.restore();
    glow(g, lx, ly, R + 60, '#ffffff', 0.06); circle(g, lx, ly, R + 10, 'rgba(0,0,0,0)'); g.strokeStyle = '#b8862a'; g.lineWidth = 22; g.beginPath(); g.arc(lx, ly, R + 10, 0, 7); g.stroke(); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(lx, ly, R + 22, 0, 7); g.stroke(); g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 10; g.beginPath(); g.arc(lx, ly, R - 20, 3.6, 4.5); g.stroke();
    g.save(); g.translate(lx + R * 0.72, ly + R * 0.72); g.rotate(0.78); rr(g, 0, -18, 260, 36, 18); g.fillStyle = '#5a3a20'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.restore();
    const kk = pop(t, 1.5, 0.35); if (kk > 0) { g.save(); g.translate(px + pw - 170, py + 90); g.rotate(-0.12); g.scale(kk, kk); rr(g, -150, -50, 300, 100, 14); g.fillStyle = 'rgba(216,30,42,.1)'; g.fill(); g.strokeStyle = '#d81e2a'; g.lineWidth = 9; g.stroke(); text(g, 'DEBT', 0, 4, { size: 78, color: '#d81e2a', stroke: 0 }); g.restore(); }
    D.mug(g, 150, 880, 1.5, { color: '#f4f0e6', t }); g.save(); g.translate(1760, 800); g.rotate(-0.5); rr(g, -150, -14, 300, 28, 14); g.fillStyle = '#2a4a8a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore(); }); } });

// k03 "At first, the big tech companies paid for their AI data centers out of their own profits."  the vault opens; cash arcs into a data center under construction; a crane swings
registerShot('k03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: 130, x1: -110 }), gy = E.H * 0.82;
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#6aa8e8'); sky.addColorStop(1, '#f4ecd8'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.clouds(g, { y: E.H * 0.14, count: 7, color: '#ffffff', a: 0.5 });
    for (let i = 0; i < 12; i++) { const h = 140 + (i * 83) % 200; g.fillStyle = '#a8c0d8'; g.fillRect(i * 200 - 120, gy - h, 130, h); }
    g.fillStyle = '#9a8a70'; g.fillRect(-E.W, gy, E.W * 3, E.H); g.fillStyle = '#b8a888'; g.fillRect(-E.W, gy, E.W * 3, 20);
    // vault
    rr(g, 60, gy - 520, 560, 520, 24); g.fillStyle = '#d8dce4'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); const open = ease.inOut(prog(t, 0.3, 1.4)); FP.vault(g, 340, gy - 260, 1.0, open, {}); rr(g, 140, gy - 600, 400, 64, 12); g.fillStyle = '#1a1c22'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); text(g, 'OWN PROFITS', 340, gy - 566, { size: 40, color: '#5aff8a', stroke: 0 });
    // the building going up
    const bx = 1040, bw = 620, floors = 4, fk = prog(t, 0.6, 4.2);
    for (let f = 0; f < floors; f++) { const fy = gy - (f + 1) * 120, fl = clamp(fk * floors - f, 0, 1); g.fillStyle = '#c8ccd4'; g.fillRect(bx, fy + 100, bw * fl, 20); if (fl > 0) { for (let q = 0; q <= 5; q++) if (q / 5 <= fl) seg(g, [[bx + q * bw / 5, fy + 120], [bx + q * bw / 5, fy + 6]], 10, '#a8acb8'); } if (fl > 0.9) { g.fillStyle = 'rgba(120,130,150,.35)'; g.fillRect(bx + 10, fy + 8, bw - 20, 92); } }
    for (let f = 0; f < floors; f++) { g.strokeStyle = '#8a6a30'; g.lineWidth = 4; const y0 = gy - f * 120, y1 = y0 - 120; g.beginPath(); g.moveTo(bx - 30, y0); g.lineTo(bx - 30, y1); g.moveTo(bx - 30, y0); g.lineTo(bx + 20, y1); g.moveTo(bx - 30, y1); g.lineTo(bx + 20, y0); g.stroke(); }
    if (fk > 0.95) { rr(g, bx + 100, gy - 520, 420, 70, 12); g.fillStyle = '#1a1c22'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); text(g, 'AI DATA CENTER', bx + 310, gy - 484, { size: 36, color: '#76ff5a', stroke: 0 }); }
    // crane
    seg(g, [[1760, gy], [1760, gy - 700]], 26, '#e0a838'); for (let i = 0; i < 10; i++) seg(g, [[1747, gy - i * 70], [1773, gy - 70 - i * 70]], 5, '#a87820'); seg(g, [[1760, gy - 700], [1100, gy - 700]], 20, '#e0a838'); seg(g, [[1760, gy - 700], [1840, gy - 700]], 20, '#e0a838'); rr(g, 1820, gy - 700, 60, 50, 6); g.fillStyle = '#5a5e68'; g.fill();
    const sw = Math.sin(t * 1.6) * 0.1; seg(g, [[1300, gy - 690], [1300 + Math.sin(sw) * 220, gy - 690 + 300]], 4, '#2a2e38'); box(g, 1300 + Math.sin(sw) * 220, gy - 690 + 340, 1.0, { color: '#3a3e48', label: 'GPU', rot: sw });
    // cash flying from the vault into the site
    for (let i = 0; i < 9; i++) { const p = ((Math.max(0, t - 1.0) * 0.55 + i / 9) % 1); if (t < 1.0) break; const x = lerp(420, 1250, p), y = lerp(gy - 260, gy - 250, p) - Math.sin(p * Math.PI) * 380; g.save(); g.translate(x, y); g.rotate(p * 5 + i); D.cash(g, 0, 0, 0.42, { text: '' }); g.restore(); }
    [[820, 1, 0.0], [920, -1, 0.7], [1760, -1, 1.2]].forEach(([x, f, d], i) => drawToon(g, { x, y: gy + 40, s: 0.95, facing: f, cast: HARD(CROWD[i * 2 + 1]), pose: breathe(posesAt(t, [[0, 'stand'], [d, 'point'], [d + 1.4, 'explain']]), t + i), expr: 'happy', blink: blink(t + i), rim: RIM }));
    D.plant(g, 700, gy + 30, 1.0, { kind: 'round', t }); }); } });

// k04 "But that's changing. The Federal Reserve estimates ... six hundred and eighty billion dollars of AI-related debt this year, through October."
//   dusk data centers; the hanging sign flips OWN PROFITS -> BORROWED; the report slides in; the counter climbs to $680B; bond papers fall
registerShot('k04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 30, x1: -30 }), gy = E.H * 0.84;
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#0a0a24'); sky.addColorStop(0.6, '#3a1a4a'); sky.addColorStop(1, '#8a3a4a'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 50, area: [0, 0, E.W, E.H * 0.5] });
    for (let i = 0; i < 12; i++) { const h = 150 + (i * 89) % 250; g.fillStyle = '#1c1030'; g.fillRect(i * 190 - 100, gy - h, 140, h); for (let q = 0; q < 6; q++) { g.fillStyle = (i + q) % 4 ? '#ff8a5a' : '#ffd08a'; g.fillRect(i * 190 - 90 + (q % 3) * 40, gy - h + 20 + Math.floor(q / 3) * 50, 20, 26); } }
    g.fillStyle = '#16102a'; g.fillRect(-E.W, gy, E.W * 3, E.H);
    for (let i = 0; i < 3; i++) { const x = 620 + i * 420; rr(g, x, gy - 230, 360, 230, 8); g.fillStyle = '#2a2e44'; g.fill(); g.strokeStyle = '#0a0a18'; g.lineWidth = 6; g.stroke(); for (let q = 0; q < 6; q++) { rr(g, x + 24 + q * 54, gy - 190, 36, 110, 4); g.fillStyle = Math.sin(t * 3 + q + i) > -0.4 ? '#ff5a5a' : '#6a2a2a'; g.fill(); } }
    // hanging sign
    const fk = prog(t, 0.1, 0.9), sy = Math.abs(Math.cos(fk * Math.PI)), sw = Math.sin(t * 1.6) * 0.03; g.save(); g.translate(E.W * 0.62, 70); g.rotate(sw); seg(g, [[-250, 0], [-250, 90]], 6, '#8a8e98'); seg(g, [[250, 0], [250, 90]], 6, '#8a8e98'); g.translate(0, 90); g.scale(1, fk > 0 && fk < 1 ? Math.max(0.05, sy) : 1);
    rr(g, -280, 0, 560, 150, 18); g.fillStyle = fk >= 0.5 ? '#6a1018' : '#1a4a2a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); text(g, 'PAID BY:', 0, 38, { size: 30, color: '#c8d0dc', stroke: 0 }); text(g, fk >= 0.5 ? 'BORROWED' : 'OWN PROFITS', 0, 98, { size: 62, color: fk >= 0.5 ? '#ff6a6a' : '#76ff9a', stroke: 0 }); g.restore();
    // bond papers falling
    for (let i = 0; i < 26; i++) { if (t < 2.8 + i * 0.08) continue; const p = ((t - 2.8 - i * 0.08) * 0.35) % 1.4, x = 960 + ((i * 193) % 900), y = -80 + p * (E.H + 200); g.save(); g.translate(x, y); g.rotate(Math.sin(p * 6 + i) * 0.5); g.globalAlpha = 0.9; rr(g, -50, -34, 100, 68, 4); g.fillStyle = '#f8f0d8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); circle(g, 24, 0, 14, '#c8202a'); text(g, 'BOND', -12, -6, { size: 18, color: INK, stroke: 0 }); g.restore(); }
    // the report slides in
    const rk = ease.out(prog(t, 1.0, 1.9)); FP.report(g, lerp(-300, 340, rk), E.H * 0.56, 0.95, { rot: lerp(-0.25, -0.05, rk) });
    // the counter
    const ck = ease.out(prog(t, 1.3, 2.0)); if (ck > 0) { g.save(); g.globalAlpha = ck; FP.glass(g, E.W - 830, E.H * 0.42, 700, 270, { r: 28 }); text(g, 'AI-RELATED DEBT ISSUED', E.W - 480, E.H * 0.42 + 56, { size: 30, color: '#a8b0c8', stroke: 0 }); text(g, '2026, THROUGH OCTOBER', E.W - 480, E.H * 0.42 + 96, { size: 22, color: '#6a7080', stroke: 0 });
      const n = Math.round(680 * ease.inOut(prog(t, 3.69, 4.9))); text(g, '$' + n + 'B', E.W - 480, E.H * 0.42 + 190, { size: 124, color: n >= 680 ? '#ff6a6a' : '#ffffff', stroke: 0, glow: n >= 680 ? 22 : 0, glowColor: '#ff3a3a' }); g.restore(); }
    [[1610, SAM, 'worried'], [1780, MOM, 'shocked']].forEach(([x, cs, ex], i) => drawToon(g, { x, y: E.H * 1.0, s: 1.3, facing: -1, cast: SUIT(cs, ['#2a2a2a', '#3a2a3a'][i]), pose: breathe(posesAt(t, [[0, 'stand'], [4.8, 'handsOnHead']]), t + i), expr: t > 3.7 ? ex : 'neutral', look: [-0.6, -0.2], blink: blink(t + i), rim: { color: '#ff8a7a', dir: [0.7, -0.7], w: 3 } })); }); } });

// k05 "That's about five times all of twenty twenty-three."  two bars: 2023 ($130B) and 2026 ($680B+); small people look up; a 5x badge pops
registerShot('k05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: 0, x1: -30 }), gy = E.H * 0.86;
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#0a0a24'); sky.addColorStop(0.6, '#3a1a4a'); sky.addColorStop(1, '#8a3a4a'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 40, area: [0, 0, E.W, E.H * 0.5] });
    for (let i = 0; i < 12; i++) { const h = 150 + (i * 89) % 250; g.fillStyle = '#1c1030'; g.fillRect(i * 190 - 100, gy - h, 140, h); } g.fillStyle = '#16102a'; g.fillRect(-E.W, gy, E.W * 3, E.H);
    FP.glass(g, 260, 70, E.W - 520, 860, { r: 30 }); text(g, 'AI-RELATED DEBT ISSUED PER YEAR', E.W / 2, 128, { size: 34, color: '#ffffff', stroke: 0 });
    const x23 = 620, x26 = 1160, bw = 250, base = gy - 20, k1 = ease.outBack(prog(t, 0.1, 0.8)), k2 = ease.outBack(prog(t, 0.6, 1.6)), h23 = 100 * k1, h26 = 520 * k2;
    seg(g, [[330, base], [E.W - 330, base]], 6, '#ffffff'); rr(g, x23, base - h23, bw, h23, 12); g.fillStyle = '#8a90a8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, x26, base - h26, bw, h26, 12); const gr2 = g.createLinearGradient(0, base - h26, 0, base); gr2.addColorStop(0, '#ff6a6a'); gr2.addColorStop(1, '#c02a3a'); g.fillStyle = gr2; g.fill(); g.stroke();
    text(g, '2023', x23 + bw / 2, base + 40, { size: 38, color: '#ffffff', stroke: 0 }); text(g, '2026', x26 + bw / 2, base + 40, { size: 38, color: '#ffffff', stroke: 0 }); text(g, '$130B', x23 + bw / 2, base - h23 - 34, { size: 46, color: '#c8d0e0', stroke: 0 }); if (k2 > 0.5) text(g, '$680B+', x26 + bw / 2, base - h26 - 34, { size: 60, color: '#ff8a7a', stroke: 0 });
    [[x23 - 70, SAM, 0], [x23 - 170, MOM, 0.3], [x23 - 270, DAD, 0.6]].forEach(([x, cs, d], i) => drawToon(g, { x, y: base + 10, s: 0.95, facing: 1, cast: SUIT(cs, '#2a3a5a'), pose: breathe(posesAt(t, [[0, 'stand'], [d + 0.8, 'handsOnHead']]), t + i), expr: t > 1.2 ? 'shocked' : 'neutral', look: [0.2, -1], blink: blink(t + i), rim: { color: '#ff8a7a', dir: [0.7, -0.7], w: 3 } }));
    const bk = ease.outBack(prog(t, 1.84, 2.3)); if (bk > 0) { g.save(); g.translate((x23 + x26) / 2 + bw / 2, base - 430); g.scale(bk, bk); g.rotate(-0.1); circle(g, 0, 0, 120, INK); circle(g, 0, 0, 108, GOLD); text(g, '5x', 0, 6, { size: 130, color: INK, stroke: 0 }); g.restore(); seg(g, [[x23 + bw + 20, base - h23 - 10], [x26 - 20, base - h26 + 40]], 8, GOLD); text(g, '', 0, 0, {}); } }); } });
