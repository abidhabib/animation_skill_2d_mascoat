// V06 thumbnails C (note on forehead), D (Day 12 vs Day 13), E (mail slot, "LET GO?"). Thirds: x 640/1280, y 360/720.
import { E, registerShot as reg, rr, seg, circle, glow, alpha, text } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';
import { clockOn, hand } from '/engine/notewall.js';
import { jar, folder } from '/engine/v06.js';

const INK = '#170f1a';
const poly = (g, p) => { g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
const box = (g, x, y, w, h, fill, r = 20, lw = 10) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const drop = (g, x, y, s, a) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.beginPath(); g.moveTo(0, -46); g.quadraticCurveTo(34, 4, 28, 20); g.arc(0, 20, 28, 0, Math.PI); g.quadraticCurveTo(-34, 4, 0, -46); g.closePath(); g.fillStyle = '#bfeaff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); circle(g, -9, 20, 7, '#ffffff'); g.restore(); };
const rays = (g, x, y, a, n = 20) => { g.save(); g.translate(x, y); g.fillStyle = alpha('#ffffff', a); for (let i = 0; i < n; i++) { g.rotate((Math.PI * 2) / n); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 2400, -0.07, 0.07); g.closePath(); g.fill(); } g.restore(); };
const ticks = (g, x, y, r, angs, col = '#fff4c0') => angs.forEach((a) => seg(g, [[x + Math.cos(a) * r, y + Math.sin(a) * r], [x + Math.cos(a) * (r + 90), y + Math.sin(a) * (r + 90)]], 22, col));
function sheet(g, x, y, W, rot) { g.save(); g.translate(x, y); g.rotate(rot); const c = W * 0.26, body = [[-W / 2, -W / 2], [W / 2 - 8, -W / 2 + 10], [W / 2, W / 2 - c], [W / 2 - c, W / 2], [-W / 2 + 10, W / 2 - 5]];
  g.save(); g.translate(22, 32); poly(g, body); g.fillStyle = 'rgba(0,0,0,.35)'; g.fill(); g.restore(); const n = g.createLinearGradient(0, -W / 2, 0, W / 2); n.addColorStop(0, '#fff17c'); n.addColorStop(1, '#ffc01e'); poly(g, body); g.fillStyle = n; g.fill(); g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 14; g.stroke();
  g.beginPath(); g.moveTo(W / 2, W / 2 - c); g.quadraticCurveTo(W / 2 - c * 0.15, W / 2 - c * 0.9, W / 2 - c * 0.95, W / 2 - c * 0.82); g.quadraticCurveTo(W / 2 - c * 0.7, W / 2 - c * 0.35, W / 2 - c, W / 2); g.quadraticCurveTo(W / 2 - c * 0.25, W / 2 - c * 0.2, W / 2, W / 2 - c); g.closePath(); g.fillStyle = '#c8820e'; g.fill(); g.lineWidth = 11; g.stroke(); g.restore(); }
const vignette = (g, a) => { const v = g.createRadialGradient(960, 540, 560, 960, 540, 1300); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${a})`); g.fillStyle = v; g.fillRect(0, 0, E.W, E.H); };

// C: the note has slapped itself onto your forehead, at midnight
reg('thumbC', { draw(g) { const gr = g.createLinearGradient(0, 0, E.W, E.H); gr.addColorStop(0, '#ff6a2a'); gr.addColorStop(1, '#b8142e'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); rays(g, 700, 420, 0.1);
  bigToonFace(g, 690, 790, 455, { cast: HERO, expr: 'worried', t: 0.5, look: [0.05, -1] });
  sheet(g, 700, 305, 480, -0.09); g.save(); g.translate(700, 305); g.rotate(-0.09); text(g, 'DAY', 0, -108, { size: 150, color: INK }); text(g, '13.', -6, 74, { size: 235, color: '#e0220f', stroke: 16, strokeColor: INK }); g.restore();
  ticks(g, 700, 305, 345, [-2.95, -2.45, -0.7, -0.2], '#fff4c0');
  glow(g, 1510, 360, 420, '#fff0b0', 0.5); clockOn(g, 1510, 360, 230, 12, 0);
  drop(g, 150, 560, 1.5, -0.4); drop(g, 1180, 640, 1.2, 0.4); vignette(g, 0.4); } });

// D: day 12 (life is great) against day 13 (it is not)
reg('thumbD', { draw(g) { const L = g.createLinearGradient(0, 0, 0, E.H); L.addColorStop(0, '#7fd8ff'); L.addColorStop(1, '#ffe9a8'); g.fillStyle = L; g.fillRect(0, 0, E.W, E.H); rays(g, 420, 640, 0.22);
  jar(g, 790, 1010, 0.8, 12); bigToonFace(g, 405, 720, 290, { cast: HERO, expr: 'excited', t: 0.5, look: [0.2, 0] });
  const cut = [[1060, -20], [1960, -20], [1960, 1100], [880, 1100], [990, 640], [900, 560]];
  g.save(); poly(g, cut); g.clip(); const R = g.createLinearGradient(0, 0, 0, E.H); R.addColorStop(0, '#0a0e2c'); R.addColorStop(1, '#3a1030'); g.fillStyle = R; g.fillRect(0, 0, E.W, E.H); glow(g, 1500, 640, 700, '#ff3a2a', 0.45);
  bigToonFace(g, 1520, 720, 290, { cast: HERO, expr: 'worried', t: 0.5, look: [-0.9, 0] }); drop(g, 1830, 470, 1.4, 0.4); drop(g, 1215, 450, 1.1, -0.4); g.restore();
  seg(g, [[1060, -20], [900, 560], [990, 640], [880, 1100]], 44, INK); seg(g, [[1060, -20], [900, 560], [990, 640], [880, 1100]], 22, '#ffd21e');
  text(g, 'DAY 12', 460, 175, { size: 215, color: '#ffffff', stroke: 34, strokeColor: INK }); text(g, 'DAY 13', 1470, 175, { size: 215, color: '#ff2a14', stroke: 34, strokeColor: INK }); } });

// E: the folder is halfway into the mail slot and your fingers will not open
reg('thumbE', { draw(g) { const gr = g.createLinearGradient(0, 0, E.W, E.H); gr.addColorStop(0, '#12333a'); gr.addColorStop(1, '#2f6a56'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); box(g, 810, -80, 1240, 1250, '#9a3038', 40, 16); box(g, 900, 40, 940, 190, '#842630', 24, 10);
  glow(g, 1330, 460, 760, '#ffd24a', 0.55);
  box(g, 900, 345, 860, 210, '#f0bc4a', 44, 15); box(g, 975, 420, 710, 62, '#241606', 26, 10); for (const x of [938, 1722]) circle(g, x, 450, 18, '#8a6418');
  g.save(); g.beginPath(); g.rect(0, 452, E.W, E.H); g.clip(); folder(g, 1330, 650, 1.45, { rot: Math.PI / 2, lace: true }); g.restore(); box(g, 975, 430, 710, 24, '#241606', 8, 0);
  hand(g, 1315, 790, [-170, 380], { s: 1.75 }); ticks(g, 1315, 830, 270, [-0.35, 0.05, 2.9, 3.35], '#fff4c0');
  bigToonFace(g, 420, 800, 300, { cast: HERO, expr: 'worried', t: 0.5, look: [0.95, -0.2], rimColor: '#ffd98a' }); drop(g, 105, 560, 1.2, -0.4); drop(g, 760, 520, 1.0, 0.4);
  g.save(); g.translate(440, 215); g.rotate(-0.06); text(g, 'LET GO?', 0, 0, { size: 205, color: '#ffffff', stroke: 36, strokeColor: INK }); g.restore(); vignette(g, 0.45); } });
