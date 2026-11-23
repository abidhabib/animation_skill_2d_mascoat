// finfx.js: shared helpers for the FINANCE channel clips (V03 on, 2026-11-22). Same look in every clip.
//   import { GREEN, RED, GOLD, INK, Y2K, zoomed, pop, money, backdrop, chart, faceShot, rack2d, badge, box, bars, coinStack } from '/engine/finfx.js';
import { E, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';
import { blink, headNum, camEase } from '/engine/storyfx.js';

export const GREEN = '#8dffc8', RED = '#ff8a7a', GOLD = '#ffe28a', INK = '#1b1424';
export const Y2K = { ...HERO, top: '#f4f0e6', topDark: '#d8d0c0', collar: '#c8c0b0', legs: '#3a3a4a', sleeves: null };   // the 2000 you (white office shirt)
export const greyed = (cast, k) => ({ ...cast, hairColor: mix(cast.hairColor, '#c8c8cc', k), stache: cast.stache, beardColor: mix(cast.hairColor, '#d8d8dc', k) });
export function mix(a, b, k) { const p = (c) => [1, 3, 5].map(i => parseInt(c.slice(i, i + 2), 16)); const A = p(a), B = p(b); return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k, 0, 1)).toString(16).padStart(2, '0')).join(''); }
export const zoomed = (g, c, fn) => { g.save(); g.translate(E.W / 2 + c.x, E.H / 2 + c.y); g.scale(c.z, c.z); g.translate(-E.W / 2, -E.H / 2); fn(); g.restore(); };
export const pop = (t, t0, d = 0.35) => ease.outBack(prog(t, t0, t0 + d));
// big glowing money number (same look as the trust numbers)
export const money = (g, x, y, s, t, t0, col = GREEN, size = 64) => headNum(g, x, y, s, t, t0, { size, color: col });
// textured gradient backdrop for 2D inserts (never a flat colour); o.bokeh = [colours]
export function backdrop(g, top, bot, t, o = {}) {
  const gr = g.createLinearGradient(0, -E.H, 0, E.H * 2); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.fillStyle = 'rgba(255,255,255,.025)'; for (let i = 0; i < 40; i++) g.fillRect(-E.W + i * 120, -E.H, 2, E.H * 3);
  if (o.bokeh) for (let i = 0; i < 14; i++) { const x = (i * 263) % E.W, y = 120 + (i * 151) % (E.H - 240); glow(g, x, y + Math.sin(t + i) * 8, 60 + (i % 3) * 30, o.bokeh[i % o.bokeh.length], 0.18); }
}
// stock chart line inside a rect; k = how much is drawn 0..1
export function chart(g, x, y, w, h, k, up, col) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(x, y + i * h / 6); g.lineTo(x + w, y + i * h / 6); g.stroke(); }
  const n = 40, pts = []; for (let i = 0; i <= n * k; i++) { const u = i / n, base = up ? 1 - u * 0.85 : 0.15 + u * 0.7; pts.push([x + u * w, y + h * clamp(base + Math.sin(i * 1.3) * 0.04 + Math.sin(i * 0.37) * 0.05, 0.04, 0.96)]); }
  if (pts.length > 1) { g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.lineTo(pts[pts.length - 1][0], y + h); g.lineTo(x, y + h); g.closePath(); g.fillStyle = alpha(col, 0.15); g.fill();
    g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.strokeStyle = col; g.lineWidth = 7; g.lineJoin = 'round'; g.stroke(); const [lx, ly] = pts[pts.length - 1]; glow(g, lx, ly, 40, col, 0.6); circle(g, lx, ly, 9, '#ffffff'); }
  g.restore();
}
// giant face shot: dark room + screen glow from below + number above. bg = [top, bottom, bokehColours]
export function faceShot(g, t, info, cast, glowCol, num, bg, o = {}) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.06 });
  zoomed(g, c, () => { backdrop(g, bg[0], bg[1], t, { bokeh: bg[2] }); glow(g, E.W / 2, E.H + 80, 900, glowCol, 0.45);
    bigToonFace(g, E.W / 2 + (o.dx || 0), E.H * 0.6, 250, { cast, expr: typeof o.expr === 'function' ? o.expr(t) : (o.expr || (t < 0.25 ? 'smile' : 'smug')), blink: blink(t + 1), look: o.look || [0, 0.1] });
    if (num) money(g, E.W / 2 + (o.dx || 0), E.H * 0.12, num, t, 0.15, o.numCol || GREEN, 88); if (o.extra) o.extra(g, t); }); }
// 2D server/router rack (lit = LEDs blinking)
export function rack2d(g, x, y, s, t, lit) { rr(g, x - 50 * s, y - 210 * s, 100 * s, 210 * s, 10 * s); g.fillStyle = '#1e2230'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  for (let i = 0; i < 7; i++) { rr(g, x - 40 * s, y - 200 * s + i * 28 * s, 80 * s, 20 * s, 4 * s); g.fillStyle = '#3a4258'; g.fill(); for (let j = 0; j < 4; j++) if (lit && Math.sin(t * 10 + i * 3 + j * 7 + x) > -0.3) circle(g, x - 28 * s + j * 12 * s, y - 190 * s + i * 28 * s, 3.5 * s, ['#5aff8a', '#5ab4ff', '#ffb43a'][(i + j) % 3]); } }
// numbered round badge (how we show numbered points): big glowing circle with a number
export function badge(g, x, y, n, k, col = GOLD) { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); glow(g, 0, 0, 160, col, 0.4); circle(g, 0, 0, 74, INK); circle(g, 0, 0, 66, col); text(g, String(n), 0, 4, { size: 84, color: INK, stroke: 0 }); g.restore(); }
// cardboard order box
export function box(g, x, y, s, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); rr(g, -60, -50, 120, 100, 8); g.fillStyle = o.color || '#c8945a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(-60, -50, 120, 22); seg(g, [[0, -50], [0, -28]], 10, '#e8d0a8'); if (o.label) text(g, o.label, 0, 14, { size: 26, color: INK, stroke: 0 }); g.restore(); }
// rising bar chart: vals 0..1, k grow 0..1
export function bars(g, x, y, w, h, vals, k, col = '#5aff8a') { seg(g, [[x, y], [x + w, y]], 6, '#ffffff'); const bw = w / vals.length * 0.62;
  vals.forEach((v, i) => { const p = ease.outBack(clamp(k * vals.length - i, 0, 1)), bh = h * v * p, bx = x + (i + 0.5) * w / vals.length - bw / 2; if (bh <= 0) return; rr(g, bx, y - bh, bw, bh, 10); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(bx + 8, y - bh + 8, 10, Math.max(0, bh - 16)); }); }
// stack of gold coins (n coins)
export function coinStack(g, x, y, n, s = 1) { for (let i = 0; i < n; i++) { const cy = y - i * 16 * s; g.beginPath(); g.ellipse(x, cy, 60 * s, 18 * s, 0, 0, 7); g.fillStyle = i % 2 ? '#f0b020' : '#ffc83a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); } }

// smooth camera sway for a shot: even shots push in while drifting right, odd shots pull out while drifting left (user 2026-11-23: slight zoom in/out, left/right, scenes flowing into each other).
// use with camEase: camEase(t, info.dur, sway(i)); pair with the "zoom" transition in the spec so each shot pushes through into the next.
export const sway = (i, o = {}) => { const p = o.pan ?? 50, z = o.z ?? 0; return i % 2 === 0 ? { z0: 1.0, z1: 1.12 + z, x0: -p, x1: p, y0: 8, y1: -8 } : { z0: 1.12 + z, z1: 1.02, x0: p, x1: -p, y0: -8, y1: 8 }; };

// proper cartoon clouds (replaces the smeared FX.clouds ellipses; user 2026-11-23): fluffy cluster of round puffs, flat soft-shaded bottom, a little highlight, slow drift.
//   clouds(g, { seed, count, y, h, a, t })   a = opacity (0.5 default), t = time for the drift
export function clouds(g, o = {}) { const { seed = 10, count = 6, y = E.H * 0.2, h = 120, a = 0.9, t = 0 } = o; let s = seed * 9301 + 49297; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280; const al = Math.min(1, 0.55 + a * 0.6);
  for (let i = 0; i < count; i++) { const w = 170 + r() * 190, cx = (((r() * (E.W + 400)) + t * (6 + (i % 3) * 3)) % (E.W + 400)) - 200, cy = y + r() * h, u = w / 2;
    const puffs = [[-0.62, 0.1, 0.34], [-0.28, -0.14, 0.46], [0.12, -0.26, 0.5], [0.5, -0.08, 0.4], [0.78, 0.12, 0.3]];
    g.save(); g.globalAlpha = al; g.translate(cx, cy);
    g.fillStyle = '#c7d6ea'; for (const [px, py, pr] of puffs) { g.beginPath(); g.arc(px * u + 5, py * u + 12, pr * u, 0, Math.PI * 2); g.fill(); } g.beginPath(); g.roundRect ? g.roundRect(-0.9 * u + 5, 0 * u + 12, 1.95 * u, 0.42 * u, 0.2 * u) : g.rect(-0.9 * u + 5, 12, 1.95 * u, 0.42 * u); g.fill();
    g.fillStyle = '#ffffff'; for (const [px, py, pr] of puffs) { g.beginPath(); g.arc(px * u, py * u, pr * u, 0, Math.PI * 2); g.fill(); } g.beginPath(); g.roundRect ? g.roundRect(-0.9 * u, 0, 1.95 * u, 0.4 * u, 0.2 * u) : g.rect(-0.9 * u, 0, 1.95 * u, 0.4 * u); g.fill();
    g.fillStyle = 'rgba(210,225,245,.55)'; g.beginPath(); g.ellipse(0.05 * u, 0.3 * u, 0.85 * u, 0.12 * u, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,.9)'; g.beginPath(); g.arc(0.02 * u, -0.34 * u, 0.12 * u, 0, Math.PI * 2); g.fill(); g.restore(); } }
