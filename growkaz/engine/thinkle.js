// thinkle.js: Thinkle Show brand pieces (yellow identity, 2026-11-27). badge(g, x, y, r, t, { expr }) = the round logo:
// yellow disc, ink ring, the Mooch face and a "?" note.
import { rr, circle, text, alpha } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';

export const YELLOW = '#ffd21e', YELLOW_HI = '#ffe768', YELLOW_LO = '#ffae12', INK = '#1c1424', CREAM = '#fffaf0';

export function sunburst(g, x, y, R, rot = 0, a = 0.16, n = 18) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = alpha('#ffffff', a); for (let i = 0; i < n; i++) { g.rotate((Math.PI * 2) / n); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, R, -Math.PI / n / 2, Math.PI / n / 2); g.closePath(); g.fill(); } g.restore(); }

export function qNote(g, x, y, s = 1, rot = 0.16) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); rr(g, -62 + 8, -62 + 12, 124, 124, 18); g.fillStyle = 'rgba(0,0,0,.25)'; g.fill(); rr(g, -62, -62, 124, 124, 18); g.fillStyle = CREAM; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); text(g, '?', 0, 6, { size: 104, color: '#e8541e' }); g.restore(); }

export function badge(g, x, y, r, t = 0, o = {}) { circle(g, x + r * 0.03, y + r * 0.06, r * 1.05, 'rgba(0,0,0,.22)'); circle(g, x, y, r * 1.06, INK); circle(g, x, y, r, YELLOW);
  g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip(); const gr = g.createRadialGradient(x, y - r * 0.3, r * 0.1, x, y, r); gr.addColorStop(0, YELLOW_HI); gr.addColorStop(1, YELLOW_LO); g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); sunburst(g, x, y, r * 1.2, 0.15, 0.18);
  bigToonFace(g, x, y + r * 0.13, r * 0.6, { cast: HERO, expr: o.expr || 'curious', t, look: o.look || [0.45, -0.55] }); g.restore();
  if (o.q !== false) qNote(g, x + r * 0.7, y - r * 0.68, r / 340); }
