// notewall.js: V06 "One Note A Day" shared pieces: the night bedroom wall (deep teal + warm lamp), the yellow note,
// the wall clock, hands and paper scraps. Reuse in every V06 clip so the note always looks the same.
//   noteWall(g, t, { hour, minute, lamp })   note(g, x, y, s, { text, rot, curl, torn, age })   clockOn(g, x, y, r, h, m)
import { E, ease, clamp, prog, rr, seg, circle, glow, alpha, text, rng } from '/engine/core.js';

export const INK = '#1d1418', NOTE = '#ffd64a', NOTE_SH = '#e8ab24';
const W = () => E.W, H = () => E.H;
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const poly = (g, p) => { g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };

export function clockOn(g, x, y, r, h, m) {
  circle(g, x + 8, y + 12, r + 14, 'rgba(0,0,0,.28)'); circle(g, x, y, r + 14, INK); circle(g, x, y, r + 5, '#c8744a'); circle(g, x, y, r - 8, '#fff4dc');
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; seg(g, [[x + Math.cos(a) * r * 0.66, y + Math.sin(a) * r * 0.66], [x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78]], i % 3 ? 4 : 8, INK); }
  const ha = ((h % 12) + m / 60) / 12 * Math.PI * 2 - Math.PI / 2, ma = m / 60 * Math.PI * 2 - Math.PI / 2;
  seg(g, [[x, y], [x + Math.cos(ha) * r * 0.44, y + Math.sin(ha) * r * 0.44]], 12, INK); seg(g, [[x, y], [x + Math.cos(ma) * r * 0.66, y + Math.sin(ma) * r * 0.66]], 7, '#d0342a'); circle(g, x, y, 10, INK);
}

// The wall: striped teal paper, moonlit window, shelf, plant, lamp pool, wooden floor line at y = 0.9 H.
export function noteWall(g, t = 0, o = {}) {
  const gr = g.createLinearGradient(0, 0, 0, H()); gr.addColorStop(0, '#0e2f3c'); gr.addColorStop(0.7, '#1d5560'); gr.addColorStop(1, '#123a46'); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3);
  for (let x = -W(); x < W() * 2; x += 130) { g.fillStyle = 'rgba(255,255,255,.028)'; g.fillRect(x, -H(), 60, H() * 3); }
  // window
  box(g, 120, 150, 380, 440, '#0a1630', 12, 0); circle(g, 400, 250, 52, '#f2f0d6'); glow(g, 400, 250, 260, '#bfe4ff', 0.3);
  const r = rng(8); for (let i = 0; i < 28; i++) circle(g, 135 + r() * 350, 165 + r() * 300, 1.5 + r() * 2.2, alpha('#ffffff', 0.35 + 0.35 * Math.sin(t * 1.6 + i)));
  for (let i = 0; i < 5; i++) { const h = 60 + ((i * 47) % 90); box(g, 128 + i * 74, 590 - h, 66, h, '#10223a', 4, 0); box(g, 148 + i * 74, 610 - h, 12, 16, '#ffd98a', 2, 0); }
  g.strokeStyle = '#e9dcc4'; g.lineWidth = 20; g.strokeRect(120, 150, 380, 440); seg(g, [[310, 150], [310, 590]], 12, '#e9dcc4'); seg(g, [[120, 370], [500, 370]], 12, '#e9dcc4'); g.strokeStyle = INK; g.lineWidth = 6; g.strokeRect(108, 138, 404, 464);
  box(g, 90, 600, 440, 34, '#e9dcc4', 10);
  // shelf with books and a plant
  box(g, 1370, 560, 430, 30, '#9a6240', 10); [['#e8643c', 40, 150], ['#f2c14a', 34, 120], ['#5ab0a0', 46, 168], ['#d8d0c0', 30, 110]].reduce((x, [c, w, h]) => { box(g, x, 560 - h, w, h, c, 6, 5); return x + w + 6; }, 1400);
  box(g, 1660, 490, 90, 70, '#c8744a', 14); for (const [dx, dy, a] of [[-30, -60, -0.7], [10, -85, 0], [45, -55, 0.7]]) { g.save(); g.translate(1705 + dx, 490 + dy); g.rotate(a + Math.sin(t + dx) * 0.03); g.beginPath(); g.ellipse(0, 0, 24, 52, 0, 0, 7); g.fillStyle = '#4f9a62'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore(); }
  // floor + bed edge
  const f = H() * 0.9; g.fillStyle = '#4a2c24'; g.fillRect(-W(), f, W() * 3, H()); seg(g, [[-W(), f], [W() * 2, f]], 8, INK);
  // lamp (right) and its warm pool
  const lamp = o.lamp ?? 1; seg(g, [[1800, f], [1800, 760]], 16, INK); poly(g, [[1730, 770], [1870, 770], [1838, 670], [1762, 670]]); g.fillStyle = '#ffcf7a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  glow(g, 1800, 740, 620, '#ffb45a', 0.34 * lamp); glow(g, W() / 2, 470, 700, '#ffe0a0', 0.16 * lamp);
}

// A sticky note centred at (x, y); s = 1 is 330 px wide. text: lines drawn in handwriting, k = writing progress 0..1.
export function note(g, x, y, s = 1, o = {}) {
  const Wn = 330, Hn = 330, curl = o.curl ?? 0.12, age = o.age ?? 0;
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.035); g.scale(s * (o.sx ?? 1), s);
  const body = [[-Wn / 2, -Hn / 2], [Wn / 2, -Hn / 2], [Wn / 2, Hn / 2 - 90 * curl * 3], [Wn / 2 - 90 * curl * 3, Hn / 2], [-Wn / 2, Hn / 2]];
  g.save(); g.translate(14, 22); poly(g, body); g.fillStyle = 'rgba(0,0,0,.3)'; g.fill(); g.restore();
  const gr = g.createLinearGradient(0, -Hn / 2, 0, Hn / 2); gr.addColorStop(0, age ? '#e8c260' : '#ffe27a'); gr.addColorStop(1, age ? '#c89838' : NOTE);
  poly(g, body); g.fillStyle = gr; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.lineJoin = 'round'; g.stroke();
  g.fillStyle = alpha(NOTE_SH, 0.55); g.fillRect(-Wn / 2 + 4, -Hn / 2 + 4, Wn - 8, 44);
  poly(g, [[Wn / 2, Hn / 2 - 90 * curl * 3], [Wn / 2 - 90 * curl * 3, Hn / 2], [Wn / 2 - 90 * curl * 3 + 8, Hn / 2 - 90 * curl * 3 + 8]]); g.fillStyle = NOTE_SH; g.fill(); g.stroke();
  if (age) { const r = rng(3); for (let i = 0; i < 5; i++) seg(g, [[-140 + r() * 280, -100 + r() * 220], [-120 + r() * 260, -90 + r() * 210]], 3, alpha('#7a5010', 0.35)); }
  const lines = [].concat(o.text || []), k = o.k ?? 1; let used = 0; const total = lines.join('').length || 1;
  lines.forEach((line, i) => { const n = Math.max(0, Math.min(line.length, Math.round(k * total) - used)); used += line.length;
    if (n) text(g, line.slice(0, n), 0, (i - (lines.length - 1) / 2) * 70 + 20, { size: o.size || 62, color: '#33231c', family: 'Caveat', weight: 700 }); });
  g.restore();
}

// A cartoon hand + sleeve reaching in from `from` to (x, y)
export function hand(g, x, y, from = [0, 400], o = {}) {
  const s = o.s ?? 1, a = Math.atan2(from[1], from[0]);
  g.save(); g.translate(x, y); g.rotate(a - Math.PI / 2); g.scale(s, s);
  box(g, -62, 130, 124, 900, o.sleeve || '#303950', 54, 7);
  box(g, -58, 10, 116, 160, '#ffdab9', 52, 7);
  for (let i = 0; i < 4; i++) box(g, -58 + i * 29, -62 + Math.abs(i - 1.5) * 10, 29, 100, '#ffdab9', 15, 6);
  box(g, o.flip ? -92 : 44, 40, 48, 106, '#ffdab9', 23, 6);
  g.restore();
}

// "SLAP" impact ticks around a point, p = 0..1
export function slapLines(g, x, y, p, r = 260) { if (p <= 0 || p >= 1) return; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2 + 0.2, r0 = r * (0.75 + 0.35 * ease.out(p)), r1 = r0 + 70 * (1 - p); seg(g, [[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], 10 * (1 - p) + 2, '#fff4d0'); } }
