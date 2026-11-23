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
