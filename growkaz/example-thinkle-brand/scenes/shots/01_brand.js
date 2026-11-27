// Thinkle Show brand art (yellow): logo (centre square of the frame, safe for the round crop) and 2560x1440 banner.
// Banner: all text and the logo sit in the centre strip (x 380..1540, y 381..699 in 1920x1080 units), visible on every device.
import { E, registerShot, rr, seg, circle, text, alpha } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';
import { badge, sunburst, qNote, YELLOW_HI, YELLOW_LO, INK, CREAM } from '/engine/thinkle.js';

const yellow = (g, x, y, R) => { const gr = g.createRadialGradient(x, y, 80, x, y, R); gr.addColorStop(0, YELLOW_HI); gr.addColorStop(0.55, '#ffd21e'); gr.addColorStop(1, YELLOW_LO); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); };
function sticky(g, x, y, s, rot, col, mark) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -80, -74, 180, 180, 14); g.fillStyle = 'rgba(120,60,0,.22)'; g.fill(); rr(g, -90, -90, 180, 180, 14); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); if (mark === '?') text(g, '?', 0, 10, { size: 130, color: INK }); else for (let i = 0; i < 3; i++) seg(g, [[-52, -34 + i * 38], [52 - i * 22, -34 + i * 38]], 12, alpha(INK, 0.75)); g.restore(); }

registerShot('logo', { draw(g) { yellow(g, 960, 480, 900); sunburst(g, 960, 560, 1300, 0.12, 0.17);
  circle(g, 960, 590, 400, 'rgba(255,255,255,.34)');
  bigToonFace(g, 940, 640, 325, { cast: HERO, expr: 'curious', t: 0.5, look: [0.55, -0.6] });
  qNote(g, 1285, 265, 1.35); } });

registerShot('banner', { draw(g) { yellow(g, 960, 540, 1250); sunburst(g, 545, 540, 2000, 0.06, 0.13, 26);
  // decoration outside the safe strip (TV and desktop only)
  for (const [x, y, s, r, c, m] of [[150, 170, 1.1, -0.2, CREAM, '?'], [470, 925, 0.9, 0.16, '#ff8a4a', 'l'], [790, 150, 0.75, 0.12, '#5ad0c0', 'l'], [1230, 930, 1.0, -0.12, CREAM, '?'], [1490, 150, 0.95, -0.08, '#ff8a4a', '?'], [1790, 300, 1.15, 0.18, CREAM, 'l'], [1760, 850, 0.9, -0.18, '#5ad0c0', '?'], [120, 780, 0.85, 0.1, '#5ad0c0', 'l']]) sticky(g, x, y, s, r, c, m);
  badge(g, 545, 540, 142, 0.5);
  const cx = 1130; text(g, 'THINKLE SHOW', cx + 6, 505 + 10, { size: 100, color: alpha(INK, 0.22) }); text(g, 'THINKLE SHOW', cx, 505, { size: 100, color: INK });
  rr(g, cx - 360, 585, 720, 78, 39); g.fillStyle = INK; g.fill(); text(g, 'Every story starts with one question.', cx, 626, { size: 34, color: CREAM, weight: 700 }); } });
