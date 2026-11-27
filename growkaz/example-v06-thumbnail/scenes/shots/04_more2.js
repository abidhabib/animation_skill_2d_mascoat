// V06 thumbnails F (buried in notes), G (it's back, banana), H (the giant note says DO IT).
import { E, registerShot as reg, rr, seg, circle, glow, alpha, text, rng } from '/engine/core.js';
import { bigToonFace, drawToon, HERO } from '/engine/toon2d.js';

const INK = '#170f1a';
const poly = (g, p) => { g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
const box = (g, x, y, w, h, fill, r = 20, lw = 10) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const drop = (g, x, y, s, a) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.beginPath(); g.moveTo(0, -46); g.quadraticCurveTo(34, 4, 28, 20); g.arc(0, 20, 28, 0, Math.PI); g.quadraticCurveTo(-34, 4, 0, -46); g.closePath(); g.fillStyle = '#bfeaff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); circle(g, -9, 20, 7, '#ffffff'); g.restore(); };
const rays = (g, x, y, a, n = 20) => { g.save(); g.translate(x, y); g.fillStyle = alpha('#ffffff', a); for (let i = 0; i < n; i++) { g.rotate((Math.PI * 2) / n); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 2400, -0.07, 0.07); g.closePath(); g.fill(); } g.restore(); };
const ticks = (g, x, y, r, angs, col = '#fff4c0') => angs.forEach((a) => seg(g, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + 90), y + Math.sin(a) * (r + 90)]], 22, col));
const words = (g, s, x, y, size, color, rot = -0.05) => { g.save(); g.translate(x, y); g.rotate(rot); text(g, s, 0, 0, { size, color, stroke: size * 0.17, strokeColor: INK }); g.restore(); };
const vignette = (g, a) => { const v = g.createRadialGradient(960, 540, 560, 960, 540, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = v; g.fillRect(0, 0, E.W, E.H); };
function sheet(g, x, y, W, rot, o = {}) { g.save(); g.translate(x, y); g.rotate(rot); const c = W * 0.26, body = [[-W / 2, -W / 2], [W / 2 - W * 0.012, -W / 2 + W * 0.016], [W / 2, W / 2 - c], [W / 2 - c, W / 2], [-W / 2 + W * 0.015, W / 2 - W * 0.008]], lw = Math.max(6, Math.min(15, W * 0.028));
  g.save(); g.translate(W * 0.035, W * 0.05); poly(g, body); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill(); g.restore(); const n = g.createLinearGradient(0, -W / 2, 0, W / 2); n.addColorStop(0, o.top || '#fff17c'); n.addColorStop(1, o.bot || '#ffc01e'); poly(g, body); g.fillStyle = n; g.fill(); g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = lw; g.stroke();
  g.beginPath(); g.moveTo(W / 2, W / 2 - c); g.quadraticCurveTo(W / 2 - c * 0.15, W / 2 - c * 0.9, W / 2 - c * 0.95, W / 2 - c * 0.82); g.quadraticCurveTo(W / 2 - c * 0.7, W / 2 - c * 0.35, W / 2 - c, W / 2); g.quadraticCurveTo(W / 2 - c * 0.25, W / 2 - c * 0.2, W / 2, W / 2 - c); g.closePath(); g.fillStyle = '#c8820e'; g.fill(); g.lineWidth = lw * 0.8; g.stroke();
  if (o.lines) for (let i = 0; i < 3; i++) seg(g, [[-W * 0.3, -W * 0.18 + i * W * 0.17], [W * 0.28 - i * W * 0.1, -W * 0.18 + i * W * 0.17]], W * 0.05, 'rgba(60,35,10,.65)'); g.restore(); }

// F: buried under every note you did not want
reg('thumbF', { draw(g) { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#1b1450'); gr.addColorStop(1, '#4a1c6a'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); rays(g, 640, 700, 0.07);
  const r = rng(7); for (let i = 0; i < 16; i++) sheet(g, 80 + r() * 1800, 340 + r() * 330, 90 + r() * 90, r() * 2 - 1, { lines: true });
  for (let i = 0; i < 26; i++) sheet(g, -40 + i * 80 + r() * 60, 760 + r() * 130, 230 + r() * 90, r() * 1.2 - 0.6, { lines: i % 3 === 0 });
  glow(g, 640, 700, 520, '#ffd24a', 0.35);
  bigToonFace(g, 625, 765, 300, { cast: HERO, expr: 'worried', t: 0.5, look: [0.1, -0.7], rimColor: '#ffd98a' });
  for (const [x, y, w, a] of [[170, 1010, 330, -0.3], [430, 1075, 300, 0.2], [700, 1055, 340, -0.15], [960, 1030, 300, 0.35], [1220, 990, 360, -0.2], [1520, 1040, 330, 0.25], [1800, 960, 350, -0.35]]) sheet(g, x, y, w, a, { lines: true });
  sheet(g, 1390, 690, 470, 0.12); g.save(); g.translate(1390, 690); g.rotate(0.12); text(g, 'DAY', 0, -108, { size: 150, color: INK }); text(g, '13.', -6, 72, { size: 230, color: '#e0220f', stroke: 16, strokeColor: INK }); g.restore();
  drop(g, 180, 470, 1.35, -0.4); drop(g, 1020, 520, 1.1, 0.4); words(g, 'NO ESCAPE', 960, 175, 220, '#ffffff', -0.03); vignette(g, 0.4); } });

// G: you threw it away. it is back, with a banana skin
reg('thumbG', { draw(g) { const gr = g.createLinearGradient(0, 0, E.W, E.H); gr.addColorStop(0, '#08303a'); gr.addColorStop(1, '#1d6a6a'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); for (let x = 0; x < E.W; x += 150) { g.fillStyle = 'rgba(255,255,255,.035)'; g.fillRect(x, 0, 70, E.H); }
  glow(g, 1300, 420, 820, '#ffd24a', 0.5); sheet(g, 1300, 440, 640, 0.09, { top: '#f4d860', bot: '#d89a14', lines: true });
  ticks(g, 1300, 440, 430, [-1.9, -0.9, -0.45, 0.05, 2.4]);
  // banana skin draped over the note: stem nub on top, four floppy peels with pale insides
  g.save(); g.translate(1460, 400); g.rotate(-0.12); g.scale(1.25, 1.25); g.lineJoin = 'round';
  const peel = (c1x, c1y, tx, ty, c2x, c2y, col) => { g.beginPath(); g.moveTo(-34, -6); g.quadraticCurveTo(c1x, c1y, tx, ty); g.quadraticCurveTo(c2x, c2y, 34, -6); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); };
  peel(-70, -90, -45, 175, 20, 80, '#fff3b0');
  peel(-210, -80, -215, 150, -90, 20, '#ffd91e');
  peel(210, -80, 225, 130, 85, 25, '#ffd91e');
  peel(-40, 90, 75, 250, 125, 60, '#ffe83a');
  g.beginPath(); g.moveTo(-34, -4); g.quadraticCurveTo(-22, -46, -12, -88); g.lineTo(22, -94); g.quadraticCurveTo(20, -48, 36, -6); g.quadraticCurveTo(0, 18, -34, -4); g.closePath(); g.fillStyle = '#ffd91e'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); box(g, -16, -108, 40, 30, '#6a4a14', 8, 8);
  for (const [x, y] of [[-130, 40], [140, 30], [50, 140]]) circle(g, x, y, 7, '#8a6a14'); g.restore();
  for (let i = 0; i < 3; i++) { g.strokeStyle = '#b8e03a'; g.lineWidth = 18; g.lineCap = 'round'; g.beginPath(); const x = 1650 + i * 80; g.moveTo(x, 330 - i * 20); for (let j = 1; j <= 5; j++) g.lineTo(x + Math.sin(j * 1.4 + i) * 30, 330 - i * 20 - j * 48); g.stroke(); }
  bigToonFace(g, 430, 750, 330, { cast: HERO, expr: 'worried', t: 0.5, look: [0.9, -0.4], rimColor: '#ffd98a' }); drop(g, 95, 480, 1.25, -0.4); drop(g, 800, 470, 1.0, 0.4);
  words(g, "IT'S BACK.", 520, 180, 205, '#ffffff'); vignette(g, 0.45); } });

// H: the note is enormous now, and it is waiting
reg('thumbH', { draw(g) { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#12081c'); gr.addColorStop(1, '#4a101c'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); rays(g, 1290, 480, 0.06, 24);
  glow(g, 1290, 470, 960, '#ff9a1e', 0.55);
  g.fillStyle = '#241018'; g.fillRect(0, 930, E.W, 200); seg(g, [[0, 930], [E.W, 930]], 12, INK);
  // long shadow from the tiny hero, away from the note
  poly(g, [[330, 965], [470, 965], [-40, 1100], [-420, 1100]]); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill();
  sheet(g, 1290, 490, 900, -0.07, { top: '#fff17c', bot: '#ffab14' });
  g.save(); g.translate(1290, 490); g.rotate(-0.07);
  for (const d of [-1, 1]) { g.beginPath(); g.ellipse(d * 170, -150, 112, 90, 0, 0, 7); g.fillStyle = '#fffdf2'; g.fill(); g.strokeStyle = INK; g.lineWidth = 14; g.stroke(); circle(g, d * 170 - 56, -122, 40, INK); circle(g, d * 170 - 68, -136, 11, '#ffffff'); seg(g, [[d * 320, -305], [d * 62, -212]], 46, INK); }
  text(g, 'DO IT.', -20, 150, { size: 245, color: '#e0220f', stroke: 20, strokeColor: INK });
  g.restore();
  drawToon(g, { x: 400, y: 968, s: 2.35, cast: HERO, action: 'idle', t: 0.5, facing: 1, yaw: 0.6, expr: 'worried', look: [0.9, -0.7] });
  drop(g, 225, 380, 0.95, -0.4); drop(g, 585, 420, 0.8, 0.4); vignette(g, 0.5); } });
