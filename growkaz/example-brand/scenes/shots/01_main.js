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

// BACKGROUND PLATE for the thumbnail (no characters, no text): Sam's front door at dusk. Cold blue street on the left,
// warm light spilling from the open doorway on the right, soft depth. Left 55% kept calm for faces + number.
import { drawToon } from '/engine/toon2d.js';
registerShot('bg', { draw(g) {
  const gr = g.createLinearGradient(0, 0, E.W, 0); gr.addColorStop(0, '#141a3a'); gr.addColorStop(0.55, '#2a2350'); gr.addColorStop(1, '#4a2a40'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  // brick wall texture (very soft)
  for (let y = 0; y < E.H; y += 46) for (let x = (y / 46) % 2 ? -60 : 0; x < E.W; x += 120) { g.fillStyle = 'rgba(255,255,255,0.025)'; g.fillRect(x + 4, y + 4, 112, 38); }
  // doorway on the right, warm interior light
  const dx = 1500, dw = 380, dh = 820, dy = E.H - dh;
  glow(g, dx, E.H * 0.55, 900, '#ffb25a', 0.45);
  g.fillStyle = '#ffcf8a'; g.fillRect(dx - dw / 2, dy, dw, dh); const ig = g.createLinearGradient(0, dy, 0, E.H); ig.addColorStop(0, 'rgba(255,240,200,.9)'); ig.addColorStop(1, 'rgba(255,150,80,.6)'); g.fillStyle = ig; g.fillRect(dx - dw / 2, dy, dw, dh);
  g.fillStyle = '#2a1a22'; g.fillRect(dx - dw / 2 - 40, dy - 40, 40, dh + 40); g.fillRect(dx + dw / 2, dy - 40, 40, dh + 40); g.fillRect(dx - dw / 2 - 40, dy - 40, dw + 80, 40);
  // open door panel (angled), light spill on the floor
  g.fillStyle = '#5a3a2e'; g.beginPath(); g.moveTo(dx + dw / 2, dy); g.lineTo(dx + dw / 2 + 150, dy + 60); g.lineTo(dx + dw / 2 + 150, E.H + 40); g.lineTo(dx + dw / 2, E.H); g.closePath(); g.fill();
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = 'rgba(255,190,110,.18)'; g.beginPath(); g.moveTo(dx - dw / 2, E.H); g.lineTo(dx + dw / 2, E.H); g.lineTo(dx - 200, E.H + 10); g.lineTo(dx - 900, E.H); g.closePath(); g.fill(); g.restore();
  // wall lamp + house number plate (no text) + a plant by the door
  glow(g, dx - dw / 2 - 120, dy + 120, 220, '#ffd08a', 0.6); circle(g, dx - dw / 2 - 120, dy + 120, 26, '#fff0c0');
  // cold street light from the left
  glow(g, 120, 160, 700, '#5a8aff', 0.25);
  // soft floor
  g.fillStyle = 'rgba(10,8,24,.55)'; g.fillRect(0, E.H - 120, E.W, 120);
  // vignette
  const v = g.createRadialGradient(E.W * 0.55, E.H * 0.5, 300, E.W * 0.55, E.H * 0.5, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); g.fillStyle = v; g.fillRect(0, 0, E.W, E.H);
} });
// CHARACTER REFERENCE SHEET (for ChatGPT to copy the look): YOU and SAM, face + full body
registerShot('refs', { draw(g) { g.fillStyle = '#f4efe6'; g.fillRect(0, 0, E.W, E.H);
  const P = (c, x, label, ex1, ex2) => { bigToonFace(g, x - 200, 330, 150, { cast: c, expr: ex1 }); bigToonFace(g, x + 200, 330, 150, { cast: c, expr: ex2 }); drawToon(g, { x, y: 1050, s: 1.15, cast: c, expr: 'smile' }); text(g, label, x, 620, { size: 54, color: '#1b1424' }); };
  P(HERO, 480, 'YOU (main character)', 'smile', 'shocked'); P(SAM, 1440, 'SAM (best friend)', 'smile', 'happy'); seg(g, [[960, 60], [960, 1020]], 4, 'rgba(27,20,36,.25)'); } });
