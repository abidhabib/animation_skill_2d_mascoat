// V06 thumbnail B, rule of thirds (grid x 640/1280, y 360/720): the hero hides under the blanket with eyes on the
// lower-left point; the glowing note, the only light, sits on the upper-right point. The gaze makes one diagonal.
import { E, registerShot, rr, seg, circle, glow, alpha, text, rng } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';

const INK = '#150f1c';
const poly = (g, p) => { g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
const box = (g, x, y, w, h, fill, r = 20, lw = 10) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const drop = (g, x, y, s, a) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.beginPath(); g.moveTo(0, -46); g.quadraticCurveTo(34, 4, 28, 20); g.arc(0, 20, 28, 0, Math.PI); g.quadraticCurveTo(-34, 4, 0, -46); g.closePath(); g.fillStyle = '#bfeaff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); circle(g, -9, 20, 7, '#ffffff'); g.restore(); };
// fist gripping the blanket edge: four fingers curled over it
function grip(g, x, y, a) { g.save(); g.translate(x, y); g.rotate(a); for (let i = 0; i < 4; i++) box(g, -92 + i * 46, -42 + Math.abs(i - 1.5) * 8, 48, 112, '#ffd9ae', 24, 9); g.restore(); }

registerShot('thumb2', { draw(g) {
  // deep blue night room
  const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#0b1030'); gr.addColorStop(1, '#1a2a5c'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  for (let x = 0; x < E.W; x += 140) { g.fillStyle = 'rgba(255,255,255,.022)'; g.fillRect(x, 0, 62, E.H); }
  // small moon window, top left (quiet negative space)
  box(g, 90, 70, 270, 260, '#24407a', 18, 12); circle(g, 270, 150, 46, '#e8f0ff'); glow(g, 270, 150, 200, '#9fc4ff', 0.35); seg(g, [[225, 70], [225, 330]], 10, INK); seg(g, [[90, 200], [360, 200]], 10, INK);
  // light thrown by the note: a warm cone falling on the face
  g.save(); g.globalCompositeOperation = 'lighter'; const cone = g.createLinearGradient(1280, 360, 560, 760); cone.addColorStop(0, 'rgba(255,205,80,.34)'); cone.addColorStop(1, 'rgba(255,205,80,.02)'); g.fillStyle = cone; poly(g, [[1010, 90], [1500, 660], [900, 1180], [60, 560]]); g.fill(); g.restore();
  glow(g, 1290, 370, 900, '#ffc83a', 0.62);
  // headboard behind the hero
  box(g, 60, 560, 1130, 700, '#5a3444', 130, 14); for (const x of [250, 450, 650, 850]) seg(g, [[x, 640], [x, 1080]], 10, alpha(INK, 0.45));
  box(g, 150, 780, 940, 330, '#cfd8f4', 150, 12);
  // the hero: only hair, huge eyes and moustache above the blanket
  bigToonFace(g, 615, 752, 330, { cast: HERO, expr: 'worried', t: 0.5, look: [0.95, -0.75], rimColor: '#ffd36a' });
  // blanket pulled up to the moustache
  g.beginPath(); g.moveTo(-40, 985); g.bezierCurveTo(220, 905, 420, 868, 620, 890); g.bezierCurveTo(840, 912, 1010, 850, 1270, 905); g.bezierCurveTo(1520, 960, 1740, 900, 1960, 940); g.lineTo(1960, 1140); g.lineTo(-40, 1140); g.closePath();
  const b = g.createLinearGradient(1280, 860, 200, 1080); b.addColorStop(0, '#ff8a4a'); b.addColorStop(1, '#b8402e'); g.fillStyle = b; g.fill(); g.strokeStyle = INK; g.lineWidth = 14; g.stroke();
  for (const [x0, y0, cx, cy, x1, y1] of [[330, 960, 380, 1030, 330, 1090], [900, 950, 860, 1010, 930, 1090], [1320, 975, 1390, 1020, 1370, 1090]]) { g.strokeStyle = alpha(INK, 0.35); g.lineWidth = 10; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke(); }
  grip(g, 300, 915, -0.2); grip(g, 935, 893, 0.1);
  drop(g, 215, 470, 1.15, -0.4); drop(g, 975, 760, 0.85, 0.35);
  // the note on the upper-right point, tilted, old, curling
  g.save(); g.translate(1305, 392); g.rotate(0.1);
  const W = 690, c = 185, body = [[-W / 2, -W / 2], [W / 2 - 10, -W / 2 + 12], [W / 2, W / 2 - c], [W / 2 - c, W / 2], [-W / 2 + 12, W / 2 - 6]];
  g.save(); g.translate(26, 38); poly(g, body); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); g.restore();
  const n = g.createLinearGradient(0, -W / 2, 0, W / 2); n.addColorStop(0, '#fff07a'); n.addColorStop(1, '#ffbe1e'); poly(g, body); g.fillStyle = n; g.fill(); g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 15; g.stroke();
  for (const [x0, y0, x1, y1] of [[-340, 30, -190, 62], [210, 80, 335, 52], [120, -270, 320, -225]]) { seg(g, [[x0, y0], [x1, y1]], 6, 'rgba(138,90,8,.25)'); seg(g, [[x0, y0 + 8], [x1, y1 + 8]], 4, 'rgba(255,255,255,.35)'); }
  g.beginPath(); g.moveTo(W / 2, W / 2 - c); g.quadraticCurveTo(W / 2 - c * 0.15, W / 2 - c * 0.9, W / 2 - c * 0.95, W / 2 - c * 0.82); g.quadraticCurveTo(W / 2 - c * 0.7, W / 2 - c * 0.35, W / 2 - c, W / 2); g.quadraticCurveTo(W / 2 - c * 0.25, W / 2 - c * 0.2, W / 2, W / 2 - c); g.closePath(); g.fillStyle = '#c8820e'; g.fill(); g.strokeStyle = INK; g.lineWidth = 12; g.stroke();
  text(g, 'DAY', 0, -150, { size: 215, color: INK });
  text(g, '13.', -4, 120, { size: 350, color: '#e0220f', stroke: 20, strokeColor: INK });
  g.save(); g.translate(-8, -W / 2 + 4); g.rotate(-0.05); box(g, -118, -40, 236, 80, 'rgba(255,245,215,.75)', 8, 5); g.restore();
  g.restore();
  // impact ticks: it has just slapped onto the wall
  for (const [a, r0] of [[-2.75, 470], [-2.35, 500], [-0.75, 500], [-0.35, 470], [0.1, 455]]) seg(g, [[1305 + Math.cos(a) * r0, 392 + Math.sin(a) * r0], [1305 + Math.cos(a) * (r0 + 85), 392 + Math.sin(a) * (r0 + 85)]], 20, '#fff0b0');
  const v = g.createRadialGradient(1050, 520, 520, 960, 540, 1280); v.addColorStop(0, 'rgba(0,0,10,0)'); v.addColorStop(1, 'rgba(0,0,10,.6)'); g.fillStyle = v; g.fillRect(0, 0, E.W, E.H); } });
