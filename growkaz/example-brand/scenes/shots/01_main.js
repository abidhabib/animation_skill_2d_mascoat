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
  const gr = g.createLinearGradient(0, 0, E.W, E.H); gr.addColorStop(0, '#2a1458'); gr.addColorStop(0.55, '#6a2a7a'); gr.addColorStop(1, '#ff7a4a'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  for (let i = 0; i < 22; i++) { const x = (i * 337) % E.W, y = 120 + (i * 211) % 700, r = 30 + (i * 17) % 60; g.fillStyle = alpha(['#ffb070', '#c080ff', '#ff6a9a'][i % 3], 0.12); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(20,8,40,.55)'; for (let i = 0; i < 18; i++) { const w = 70 + (i * 37) % 60, h = 160 + (i * 97) % 260; g.fillRect(i * 110 - 20, E.H - h, w, h); }
  // friend + the number (the reason to click)
  glow(g, 1430, 330, 420, '#ff6a3a', 0.55);
  bigToonFace(g, 1430, 760, 215, { cast: SAM, expr: 'smile', look: [-0.6, 0], rimColor: '#ffb070' });
  text(g, '41', 1430, 300, { size: 330, color: '#ff4033', stroke: 30, strokeColor: '#1b1424', glow: 40, glowColor: 'rgba(255,80,50,.9)' }); g.fillStyle = '#ff4033'; g.strokeStyle = '#1b1424'; g.lineWidth = 10; g.beginPath(); g.moveTo(1660, 250); g.lineTo(1740, 250); g.lineTo(1700, 320); g.closePath(); g.fill(); g.stroke();
  // you, shocked, big, bottom-left
  glow(g, 470, 700, 500, '#8fd0ff', 0.25);
  bigToonFace(g, 470, 800, 285, { cast: HERO, expr: 'shocked', look: [0.9, -0.5], rimColor: '#8fd0ff' });
  // arrow from you to the number
  g.lineCap = 'round'; g.strokeStyle = '#1b1424'; g.lineWidth = 34; g.beginPath(); g.moveTo(830, 520); g.quadraticCurveTo(1000, 330, 1180, 330); g.stroke(); g.strokeStyle = '#ffd84a'; g.lineWidth = 20; g.stroke();
  g.fillStyle = '#ffd84a'; g.strokeStyle = '#1b1424'; g.lineWidth = 8; g.beginPath(); g.moveTo(1240, 330); g.lineTo(1170, 290); g.lineTo(1170, 370); g.closePath(); g.fill(); g.stroke();
  // 2 words, top-left, white + yellow, heavy outline
  text(g, 'BEST', 330, 150, { size: 170, color: '#ffffff', stroke: 26, strokeColor: '#1b1424', align: 'center' });
  text(g, 'FRIEND?', 470, 300, { size: 170, color: '#ffd84a', stroke: 26, strokeColor: '#1b1424', align: 'center' });
} });
