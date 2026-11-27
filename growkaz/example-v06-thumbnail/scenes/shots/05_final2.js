// V06 thumbnail H2: same as H on a bright blue wall, spotlight behind a bigger hero.
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

// H: the note is enormous now, and it is waiting
reg('thumbH2', { draw(g) { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#0f4fc4'); gr.addColorStop(1, '#2fb4f0'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); rays(g, 1290, 480, 0.12, 24);
  glow(g, 1290, 470, 820, '#fff2a0', 0.45);
  g.fillStyle = '#123a7a'; g.fillRect(0, 930, E.W, 200); seg(g, [[0, 930], [E.W, 930]], 12, INK);
  // spotlight: soft cone, bright halo behind the hero, pool of light on the floor
  const sp = g.createLinearGradient(0, 0, 0, 990); sp.addColorStop(0, 'rgba(255,255,255,.08)'); sp.addColorStop(1, 'rgba(255,255,255,.42)'); g.beginPath(); g.moveTo(300, -20); g.lineTo(520, -20); g.lineTo(770, 995); g.ellipse(410, 995, 360, 50, 0, 0, Math.PI); g.closePath(); g.fillStyle = sp; g.fill();
  glow(g, 410, 540, 470, '#ffffff', 0.85);
  g.beginPath(); g.ellipse(410, 995, 360, 50, 0, 0, 7); g.fillStyle = 'rgba(255,255,255,.3)'; g.fill();
  // long shadow from the hero, away from the note
  poly(g, [[320, 998], [500, 998], [60, 1100], [-380, 1100]]); g.fillStyle = 'rgba(0,20,60,.35)'; g.fill();
  sheet(g, 1290, 490, 900, -0.07, { top: '#fff17c', bot: '#ffab14' });
  g.save(); g.translate(1290, 490); g.rotate(-0.07);
  for (const d of [-1, 1]) { g.beginPath(); g.ellipse(d * 170, -150, 112, 90, 0, 0, 7); g.fillStyle = '#fffdf2'; g.fill(); g.strokeStyle = INK; g.lineWidth = 14; g.stroke(); circle(g, d * 170 - 56, -122, 40, INK); circle(g, d * 170 - 68, -136, 11, '#ffffff'); seg(g, [[d * 320, -305], [d * 62, -212]], 46, INK); }
  text(g, 'DO IT.', -20, 150, { size: 245, color: '#e0220f', stroke: 20, strokeColor: INK });
  g.restore();
  drawToon(g, { x: 410, y: 998, s: 2.85, cast: HERO, action: 'idle', t: 0.5, facing: 1, yaw: 0.6, expr: 'worried', look: [0.9, -0.7] });
  drop(g, 175, 300, 1.15, -0.4); drop(g, 650, 340, 0.95, 0.4); vignette(g, 0.2); } });
