// brand: channel logo (centre square, crop) + channel banner (2560x1440; safe text strip in the middle). Rendered at 1440p.
import { E, registerShot, text, glow, circle, alpha } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { bigToonFace, HERO, SAM, MOM, DAD, ROOMMATE } from '/engine/toon2d.js';
import { headNum } from '/engine/storyfx.js';
import { D } from '/engine/props2d.js';

const NAME = 'WHAT IF ABID', TAG = 'Cartoon stories about the what-ifs of everyday life';
const sky = (g) => { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#1e1640'); gr.addColorStop(0.55, '#5a3a78'); gr.addColorStop(1, '#f08a6a'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H); };

// LOGO: the hero's face with a glowing green "?" number above, on a deep purple disc (reads at 98x98 px)
registerShot('logo', { draw(g, t) { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H); const cx = E.W / 2, cy = E.H / 2, R = 520;
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip(); const gr = g.createRadialGradient(cx, cy - 200, 50, cx, cy, R); gr.addColorStop(0, '#6a4a9a'); gr.addColorStop(1, '#1e1640'); g.fillStyle = gr; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  FX.stars(g, 1, { count: 50, area: [cx - R, cy - R, 2 * R, R] }); glow(g, cx, cy - 250, 380, '#8dffc8', 0.35);
  bigToonFace(g, cx, cy + 130, 250, { cast: HERO, expr: 'smile', look: [0, -0.6] });
  headNum(g, cx + 20, cy - 320, '?', 1, -1, { size: 210, color: '#8dffc8' }); g.restore();
  g.strokeStyle = '#ffd84a'; g.lineWidth = 22; g.beginPath(); g.arc(cx, cy, R - 11, 0, 7); g.stroke(); } });

// BANNER: sunset sky over a skyline; title + tagline in the middle (mobile-safe); cast with their numbers left and right (desktop strip)
const LEFT = [[SAM, '41', '#ffc070'], [MOM, '99', '#8dffc8']], RIGHT = [[DAD, '100', '#ffe28a'], [ROOMMATE, '62', '#8dffc8']];
registerShot('banner', { draw(g, t) { sky(g); FX.stars(g, 1, { count: 140, area: [0, 0, E.W, E.H * 0.4] });
  FX.skyline && FX.skyline(g, { y: E.H * 0.78, color: '#2a1e40' }); g.fillStyle = '#2a1e40'; g.fillRect(0, E.H * 0.78, E.W, E.H);
  glow(g, E.W / 2, E.H / 2, 700, '#ffd8a0', 0.25);
  const sy = E.H / 2;   // safe strip centre (desktop shows y 381..699 of 1080)
  LEFT.forEach(([c, n, col], i) => { const x = 140 + i * 190; bigToonFace(g, x, sy + 40, 70, { cast: c, expr: 'smile' }); headNum(g, x, sy - 85, n, 1, -1, { size: 52, color: col }); });
  RIGHT.forEach(([c, n, col], i) => { const x = E.W - 140 - i * 190; bigToonFace(g, x, sy + 40, 70, { cast: c, expr: i ? 'smile' : 'happy' }); headNum(g, x, sy - 85, n, 1, -1, { size: 52, color: col }); });
  bigToonFace(g, 560, sy + 20, 92, { cast: HERO, expr: 'surprised', look: [0.4, -0.6] }); headNum(g, 560, sy - 140, '?', 1, -1, { size: 70, color: '#8dffc8' });
  text(g, NAME, E.W / 2 + 90, sy - 30, { size: 118, color: '#ffffff', stroke: 16, strokeColor: '#1b1424', spacing: 4 });
  text(g, TAG, E.W / 2 + 90, sy + 62, { size: 34, color: '#ffe8c8', weight: 600, stroke: 6, strokeColor: '#1b1424' });
  text(g, 'NEW STORY EVERY WEEK', E.W / 2 + 90, sy + 120, { size: 26, color: '#8dffc8', stroke: 5, strokeColor: '#1b1424', spacing: 3 });
  } });
