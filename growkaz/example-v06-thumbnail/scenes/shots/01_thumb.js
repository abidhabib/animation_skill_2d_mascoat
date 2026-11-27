// V06 thumbnail: anxious hero (left) staring at a huge, aged note with a curled corner that says DAY 13. Nothing else.
import { E, registerShot, rr, seg, circle, glow, alpha, text } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';

const INK = '#1d1418';
const poly = (g, p) => { g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
const drop = (g, x, y, s, a) => { g.save(); g.translate(x, y); g.rotate(a); g.scale(s, s); g.beginPath(); g.moveTo(0, -46); g.quadraticCurveTo(34, 4, 28, 20); g.arc(0, 20, 28, 0, Math.PI); g.quadraticCurveTo(-34, 4, 0, -46); g.closePath(); g.fillStyle = '#9fe0ff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); circle(g, -9, 20, 7, '#ffffff'); g.restore(); };

registerShot('thumb', { draw(g) {
  // cold night wall so the warm yellow note jumps out
  const gr = g.createLinearGradient(0, 0, E.W, E.H); gr.addColorStop(0, '#0a1c2c'); gr.addColorStop(0.55, '#14465a'); gr.addColorStop(1, '#0a2230'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  for (let x = 0; x < E.W; x += 150) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(x, 0, 70, E.H); }
  glow(g, 1310, 520, 1000, '#ffd24a', 0.55);
  // the note: 860 px, tilted, old, bottom-right corner curling up
  g.save(); g.translate(1320, 525); g.rotate(0.06);
  const W = 880, H = 880, c = 230, body = [[-W / 2, -H / 2], [W / 2 - 14, -H / 2 + 10], [W / 2, H / 2 - c], [W / 2 - c, H / 2], [-W / 2 + 12, H / 2 - 8]];
  g.save(); g.translate(30, 44); poly(g, body); g.fillStyle = 'rgba(0,0,0,.45)'; g.fill(); g.restore();
  const n = g.createLinearGradient(0, -H / 2, 0, H / 2); n.addColorStop(0, '#ffe66a'); n.addColorStop(1, '#f4b81e'); poly(g, body); g.fillStyle = n; g.fill(); g.lineJoin = 'round'; g.strokeStyle = INK; g.lineWidth = 16; g.stroke();
  g.save(); poly(g, body); g.clip();
  for (const [x0, y0, x1, y1] of [[-440, -40, -150, 20], [250, 70, 440, 30], [-420, 190, -250, 150], [180, -330, 420, -290]]) { seg(g, [[x0, y0], [x1, y1]], 6, alpha('#8a5a08', 0.22)); seg(g, [[x0, y0 + 8], [x1, y1 + 8]], 4, 'rgba(255,255,255,.28)'); }
  for (const [x, y, rad] of [[-310, 300, 105]]) { g.strokeStyle = alpha('#8a5a08', 0.25); g.lineWidth = 16; g.beginPath(); g.arc(x, y, rad, 0.3, 5.4); g.stroke(); }
  g.restore();
  // the curled corner
  g.beginPath(); g.moveTo(W / 2, H / 2 - c); g.quadraticCurveTo(W / 2 - c * 0.15, H / 2 - c * 0.9, W / 2 - c * 0.95, H / 2 - c * 0.82); g.quadraticCurveTo(W / 2 - c * 0.7, H / 2 - c * 0.35, W / 2 - c, H / 2); g.quadraticCurveTo(W / 2 - c * 0.25, H / 2 - c * 0.2, W / 2, H / 2 - c); g.closePath(); g.fillStyle = '#c88a14'; g.fill(); g.strokeStyle = INK; g.lineWidth = 14; g.stroke();
  // old tape
  g.save(); g.translate(-10, -H / 2 + 6); g.rotate(-0.04); rr(g, -150, -48, 300, 96, 8); g.fillStyle = 'rgba(255,245,215,.72)'; g.fill(); g.strokeStyle = alpha(INK, 0.6); g.lineWidth = 6; g.stroke(); g.restore();
  text(g, 'DAY', 0, -185, { size: 270, color: INK });
  text(g, '13.', 12, 165, { size: 440, color: '#d6261a', stroke: 22, strokeColor: INK });
  g.restore();
  // the hero: big, anxious, eyes locked on the note, warm rim from it
  glow(g, 560, 700, 520, '#ffb84a', 0.2);
  bigToonFace(g, 440, 690, 345, { cast: HERO, expr: 'worried', t: 0.5, look: [0.95, -0.15], rimColor: '#ffd98a' });
  drop(g, 100, 330, 1.35, -0.35); drop(g, 155, 520, 0.95, -0.2); drop(g, 800, 300, 1.05, 0.45);
  const v = g.createRadialGradient(960, 540, 520, 960, 540, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = v; g.fillRect(0, 0, E.W, E.H); } });
