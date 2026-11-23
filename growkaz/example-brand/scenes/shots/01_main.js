// brand (v2, minimal): channel logo + banner. Clean flat colours, one icon (thought bubble with "?"), the name, one tagline.
// Banner 2560x1440 (rendered at 1440p, 1920x1080 units): everything inside the centre strip y 381..699 and x 380..1540 (visible on every device).
import { E, registerShot, text, rr, circle } from '/engine/core.js';

const NAME = 'WHAT IF TALES', TAG = 'Animated stories that start with one question';
const NAVY = '#1c1a33', CREAM = '#f6efe4', GOLD = '#ffc94a', SOFT = '#a9a3c8';
// thought bubble with a "?" (the channel icon). r = bubble radius
function icon(g, x, y, r, fill = CREAM, ink = NAVY) {
  g.fillStyle = fill; g.beginPath(); for (const [dx, dy, k] of [[0, 0, 1], [-0.62, 0.18, 0.62], [0.62, 0.14, 0.66], [-0.3, -0.42, 0.62], [0.32, -0.44, 0.6]]) { g.moveTo(x + dx * r + k * r, y + dy * r); g.arc(x + dx * r, y + dy * r, k * r, 0, Math.PI * 2); } g.fill();
  circle(g, x - r * 0.95, y + r * 1.0, r * 0.2, fill); circle(g, x - r * 1.28, y + r * 1.35, r * 0.11, fill);
  text(g, '?', x + r * 0.02, y + r * 0.02, { size: r * 1.25, color: ink, weight: 700 }); circle(g, x + r * 1.05, y - r * 0.72, r * 0.12, GOLD);
}
registerShot('logo', { draw(g) { g.fillStyle = NAVY; g.fillRect(0, 0, E.W, E.H); icon(g, E.W / 2 + 30, E.H / 2 - 20, 270); } });
registerShot('banner', { draw(g) { g.fillStyle = NAVY; g.fillRect(0, 0, E.W, E.H);
  const cy = E.H / 2; icon(g, 545, cy - 6, 56);
  text(g, NAME, 1040, cy - 30, { size: 90, color: CREAM, spacing: 6, align: 'center' });
  g.fillStyle = GOLD; rr(g, 1040 - 40, cy + 22, 80, 6, 3); g.fill();
  text(g, TAG, 1040, cy + 70, { size: 30, color: SOFT, weight: 600 }); } });

// THUMBNAIL for "What If You Could See How Much Everyone Trusts You?": you, shocked, bottom-left; your best friend smiling with a LOW 41 glowing over his head.
import { bigToonFace, HERO, SAM } from '/engine/toon2d.js';
import { headNum } from '/engine/storyfx.js';
import { glow, alpha, seg } from '/engine/core.js';
registerShot('thumb', { draw(g) {
  // sunset sky: deep purple top (text + number sit here, max contrast) -> pink -> orange -> gold at the horizon
  const gr = g.createLinearGradient(0, 0, 0, E.H); [['#2a1450', 0], ['#7a2a78', 0.32], ['#e0566a', 0.55], ['#ff9a50', 0.72], ['#ffd27a', 0.86]].forEach(([c, k]) => gr.addColorStop(k, c)); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  // big setting sun between the two of them + god rays
  const sx = 960, sy = 820; glow(g, sx, sy, 900, '#ffcf7a', 0.55); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 14; i++) { const a = Math.PI + i * Math.PI / 13; g.fillStyle = 'rgba(255,220,150,.07)'; g.beginPath(); g.moveTo(sx, sy); g.arc(sx, sy, 1400, a - 0.04, a + 0.04); g.closePath(); g.fill(); } g.restore();
  g.fillStyle = '#fff1c8'; g.beginPath(); g.arc(sx, sy, 210, 0, 7); g.fill();
  for (let i = 0; i < 6; i++) { g.fillStyle = 'rgba(255,190,140,.35)'; g.beginPath(); g.ellipse(200 + i * 330, 430 + (i % 2) * 60, 170, 26, 0, 0, 7); g.fill(); }
  // skyline silhouette
  g.fillStyle = '#3a1a48'; for (let i = 0; i < 24; i++) { const w = 60 + (i * 37) % 70, h = 140 + (i * 97) % 230; g.fillRect(i * 84 - 30, E.H - h, w, h); } g.fillRect(0, E.H - 90, E.W, 90);
  // best friend, smiling, sun rim on the left side of his head
  bigToonFace(g, 1450, 800, 220, { cast: SAM, expr: 'smile', look: [-0.6, 0], rimColor: '#ffe0a0' });
  // the number: low, red, over his head, on the dark sky
  glow(g, 1450, 290, 330, '#ff3a3a', 0.45);
  text(g, '41', 1450, 300, { size: 330, color: '#ff4033', stroke: 30, strokeColor: '#1b1424', glow: 40, glowColor: 'rgba(255,70,50,.9)' });
  g.fillStyle = '#ff4033'; g.strokeStyle = '#1b1424'; g.lineWidth = 10; g.beginPath(); g.moveTo(1670, 250); g.lineTo(1750, 250); g.lineTo(1710, 320); g.closePath(); g.fill(); g.stroke();
  // you, shocked, big, bottom-left, warm rim
  bigToonFace(g, 470, 800, 285, { cast: HERO, expr: 'shocked', look: [0.9, -0.5], rimColor: '#ffd08a' });
  // arrow from you to the number
  g.lineCap = 'round'; g.strokeStyle = '#1b1424'; g.lineWidth = 34; g.beginPath(); g.moveTo(830, 520); g.quadraticCurveTo(1000, 330, 1190, 320); g.stroke(); g.strokeStyle = '#ffd84a'; g.lineWidth = 20; g.stroke();
  g.fillStyle = '#ffd84a'; g.strokeStyle = '#1b1424'; g.lineWidth = 8; g.beginPath(); g.moveTo(1250, 318); g.lineTo(1180, 278); g.lineTo(1180, 358); g.closePath(); g.fill(); g.stroke();
  // 2 words that ADD to the title (12 years of friendship), white + yellow
  text(g, '12', 230, 160, { size: 190, color: '#ffffff', stroke: 28, strokeColor: '#1b1424', align: 'center' });
  text(g, 'YEARS.', 470, 320, { size: 180, color: '#ffd84a', stroke: 28, strokeColor: '#1b1424', align: 'center' });
} });
