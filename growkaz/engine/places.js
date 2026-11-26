// places.js: reusable LOCATIONS with swappable LOOKS, so videos stop looking alike (user 2026-11-26).
// Works in 9:16 and 16:9. Ground line = floorY() (put characters' feet there).
//   import { place, floorY, PLACES, LOOKS } from '/engine/places.js';
//   place(g, 'busNight', t, { look: 'neon' });  then draw characters at y = floorY('busNight') (+ a few px)
//   fg(g, 'classroom', t)  draws the optional foreground layer (desks, counter...) AFTER the characters.
import { E, rr, seg, circle, glow, alpha, text, rng, shade } from '/engine/core.js';

const INK = '#1d1418', W = () => E.W, H = () => E.H, V = () => E.H > E.W;
export const floorY = (name) => H() * ((V() ? { street: 0.72, classroom: 0.72, busNight: 0.74, supermarket: 0.72, rooftop: 0.72 } : { street: 0.86, classroom: 0.87, busNight: 0.9, supermarket: 0.87, rooftop: 0.86 })[name] || 0.75);
// LOOKS: one per video. sky = 3 stops, wall/floor/accent, light = glow colour, dim = overall darkening
export const LOOKS = {
  noon: { sky: ['#4aa8e8', '#9fd6f4', '#e8f6ff'], wall: '#f4e8d2', floor: '#c9b79a', accent: '#e8643c', alt: '#2f8f7a', light: '#fff6d8', dim: 0 },
  mint: { sky: ['#7fd0c0', '#c4eee0', '#f4fff6'], wall: '#d8efe4', floor: '#9ab8a8', accent: '#f08a5a', alt: '#3f6a8a', light: '#ffffff', dim: 0 },
  snow: { sky: ['#8aa4c4', '#c4d4e6', '#eef4fa'], wall: '#dde4ee', floor: '#b8c4d4', accent: '#c0394a', alt: '#33507a', light: '#ffffff', dim: 0, snow: true },
  rain: { sky: ['#34465a', '#56697c', '#8494a2'], wall: '#8a98a4', floor: '#4a5864', accent: '#e8b83c', alt: '#2f4a5a', light: '#cfe0ee', dim: 0.1, rain: true },
  neon: { sky: ['#06081c', '#141048', '#34106a'], wall: '#1e2250', floor: '#12142e', accent: '#ff3ca6', alt: '#27e0d0', light: '#6ad8ff', dim: 0.12 },
  sunset: { sky: ['#4a2a78', '#e86a5a', '#ffc872'], wall: '#d89a78', floor: '#7a4a48', accent: '#ffb03c', alt: '#5a3a7a', light: '#ffd8a0', dim: 0 },
};
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const sky = (g, L, y1) => { const gr = g.createLinearGradient(0, 0, 0, y1); L.sky.forEach((c, i) => gr.addColorStop(i / 2, c)); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() + y1); };
const floor = (g, y, c) => { g.fillStyle = c; g.fillRect(-W(), y, W() * 3, H() * 2); seg(g, [[-W(), y], [W() * 2, y]], 7, INK); };
function weather(g, t, L) { const r = rng(11);
  if (L.rain) for (let i = 0; i < 90; i++) { const x = r() * W() * 1.2, y = (r() * H() + t * 1500) % H(); seg(g, [[x, y], [x - 14, y + 52]], 3, alpha('#dff0ff', 0.4)); }
  if (L.snow) for (let i = 0; i < 80; i++) { const x = r() * W() + Math.sin(t + i) * 26, y = (r() * H() + t * (70 + r() * 90)) % H(); circle(g, x, y, 4 + r() * 6, alpha('#ffffff', 0.85)); } }
const skyline = (g, base, col, t, off = 0, lit = null, seed = 5, hmax = 520) => { const r = rng(seed); for (let x = -300, i = 0; x < W() + 600; i++) { const w = 110 + r() * 150, h = hmax * (0.35 + r() * 0.65); box(g, x + off % 220, base - h, w, h, shade(col, (i % 3) * 0.07 - 0.05), 8, 4);
  for (let wy = base - h + 30; wy < base - 40; wy += 62) for (let wx = x + 22; wx < x + w - 30; wx += 44) { const on = lit && r() < 0.35; g.fillStyle = on ? lit : alpha('#ffffff', 0.14); g.fillRect(wx + off % 220, wy, 20, 30); } x += w + 8; } };

const DRAW = {
  // a daytime shopping street: far buildings, shopfronts with striped awnings, lamp post, tree, passing car
  street(g, t, L) { const f = floorY('street'); sky(g, L, f); for (let i = 0; i < 4; i++) { const x = ((i * 380 + t * 14) % (W() + 400)) - 200, y = H() * (0.08 + (i % 2) * 0.07); for (const [dx, rr2] of [[0, 54], [60, 70], [128, 48]]) circle(g, x + dx, y, rr2, alpha('#ffffff', L.dim ? 0.18 : 0.7)); }
    skyline(g, f - 250, shade(L.alt, 0.35), t, -t * 6, L.dim ? '#ffd98a' : null, 9, V() ? 620 : 360);
    const n = Math.ceil(W() / 380) + 1; for (let i = 0; i < n; i++) { const x = i * 390 - 80, h = V() ? 560 : 420, c = [L.wall, shade(L.accent, 0.45), shade(L.alt, 0.5)][i % 3]; box(g, x, f - h, 372, h, c, 10);
      for (let j = 0; j < 2; j++) box(g, x + 40 + j * 166, f - h + 40, 126, 120, L.dim ? '#ffd98a' : '#bfe4f4', 8, 5);
      const ay = f - 300; for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#fff6ea' : (i % 2 ? L.accent : L.alt); g.beginPath(); g.moveTo(x + 14 + k * 58, ay); g.lineTo(x + 72 + k * 58, ay); g.lineTo(x + 66 + k * 58, ay + 74); g.quadraticCurveTo(x + 40 + k * 58, ay + 100, x + 14 + k * 58, ay + 74); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }
      box(g, x + 30, f - 200, 190, 170, shade(c, -0.45), 8); box(g, x + 246, f - 210, 96, 210, '#5a3a30', 8); circle(g, x + 322, f - 100, 7, '#ffd84a'); }
    floor(g, f, L.floor); for (let i = -2; i < 12; i++) seg(g, [[i * 190, f], [i * 190 - 140, f + 190]], 3, alpha(INK, 0.25)); const road = f + 210; g.fillStyle = '#4a4a58'; g.fillRect(-W(), road, W() * 3, H()); seg(g, [[-W(), road], [W() * 2, road]], 7, INK); for (let i = -2; i < 9; i++) box(g, i * 260 - (t * 60) % 260, road + 150, 140, 18, '#ffe6a0', 8, 0);
    const lx = W() * 0.9; seg(g, [[lx, f], [lx, f - 620]], 18, INK); seg(g, [[lx, f - 620], [lx - 90, f - 650]], 14, INK); circle(g, lx - 96, f - 640, 30, L.dim ? '#fff2b0' : '#e8e8ee'); if (L.dim) glow(g, lx - 96, f - 640, 220, L.light, 0.5);
    const tx = W() * 0.07; seg(g, [[tx, f], [tx, f - 230]], 26, '#6a4430'); for (const [dx, dy, r] of [[0, -330, 110], [-70, -260, 80], [75, -265, 78]]) { circle(g, tx + dx, f + dy, r + 6, INK); circle(g, tx + dx, f + dy, r, L.snow ? '#e8f0f8' : '#4f9a55'); } },
  // school classroom: board, windows, clock, map, bookshelf; desks come from fg()
  classroom(g, t, L) { const f = floorY('classroom'); g.fillStyle = L.wall; g.fillRect(-W(), -H(), W() * 3, H() * 3);
    g.fillStyle = shade(L.wall, -0.12); g.fillRect(-W(), f - 260, W() * 3, 260); seg(g, [[-W(), f - 260], [W() * 2, f - 260]], 6, alpha(INK, 0.5));
    const bw = Math.min(W() * 0.86, 1180), bx = W() / 2 - bw / 2, by = H() * (V() ? 0.22 : 0.16), bh = V() ? 520 : 480; box(g, bx - 22, by - 22, bw + 44, bh + 44, '#8a5a38', 18); box(g, bx, by, bw, bh, '#24493c', 8);
    g.strokeStyle = alpha('#ffffff', 0.75); g.lineWidth = 6; g.beginPath(); g.moveTo(bx + 60, by + bh - 90); g.quadraticCurveTo(bx + bw * 0.35, by + bh - 130, bx + bw * 0.5, by + bh * 0.45); g.quadraticCurveTo(bx + bw * 0.65, by + 40, bx + bw - 70, by + 90); g.stroke(); seg(g, [[bx + 60, by + 60], [bx + 60, by + bh - 60], [bx + bw - 60, by + bh - 60]], 6, alpha('#ffffff', 0.6)); box(g, bx + 40, by + bh + 20, bw - 80, 22, '#a8744a', 8); for (let i = 0; i < 4; i++) box(g, bx + 90 + i * 70, by + bh + 8, 44, 14, ['#ffffff', '#ffd84a', '#ff8a8a', '#9fd8ff'][i], 6, 3);
    const cy = by - (V() ? 130 : 80); circle(g, W() / 2, cy, 66, INK); circle(g, W() / 2, cy, 56, '#fffaf0'); seg(g, [[W() / 2, cy], [W() / 2 + Math.sin(t * 0.4) * 40, cy - Math.cos(t * 0.4) * 40]], 7, INK); seg(g, [[W() / 2, cy], [W() / 2 + 28, cy + 10]], 10, INK);
    for (let i = 0; i < Math.ceil(W() / 150); i++) { const x = i * 150 + 10; g.fillStyle = [L.accent, L.alt, '#ffd84a'][i % 3]; g.beginPath(); g.moveTo(x, 40); g.lineTo(x + 120, 40); g.lineTo(x + 60, 130); g.closePath(); g.fill(); } seg(g, [[-20, 40], [W() + 20, 40]], 7, INK);
    floor(g, f, L.floor); for (let i = -4; i < 14; i++) seg(g, [[i * 160, f], [W() / 2 + (i * 160 - W() / 2) * 1.9, H()]], 3, alpha(INK, 0.22)); },
  // night bus: windows with the city sliding past, hanging straps, a row of seats
  busNight(g, t, L) { const f = floorY('busNight'), wy = H() * (V() ? 0.2 : 0.14), wh = V() ? 660 : 520; sky(g, { sky: L.sky }, wy + wh);
    skyline(g, wy + wh - 30, '#1a1c40', t, -t * 260, '#ffd98a', 3, wh * 0.75); skyline(g, wy + wh + 10, '#0e1028', t, -t * 520, L.accent, 7, wh * 0.4);
    for (let i = 0; i < 9; i++) { const x = ((i * 300 - t * 700) % (W() + 600) + W() + 600) % (W() + 600) - 300; glow(g, x, wy + 80 + (i % 3) * 90, 90, [L.accent, L.alt, L.light][i % 3], 0.5); }
    const body = shade(L.wall, -0.15); g.fillStyle = body; g.fillRect(-W(), -H(), W() * 3, H() + wy); g.fillRect(-W(), wy + wh, W() * 3, H() * 2); seg(g, [[-W(), wy], [W() * 2, wy]], 10, INK); seg(g, [[-W(), wy + wh], [W() * 2, wy + wh]], 10, INK);
    const step = V() ? 520 : 600; for (let x = -40; x < W() + step; x += step) { box(g, x, wy - 12, 54, wh + 24, shade(body, 0.1), 10); }
    seg(g, [[-20, wy - 46], [W() + 20, wy - 46]], 16, '#d8dce8'); for (let i = 0; i < 6; i++) { const x = i * (W() / 5) + 40, sw = Math.sin(t * 2.2 + i) * 14; seg(g, [[x, wy - 40], [x + sw, wy + 60]], 10, INK); g.strokeStyle = L.accent; g.lineWidth = 12; g.beginPath(); g.arc(x + sw * 1.2, wy + 96, 34, 0, 7); g.stroke(); }
    box(g, -40, wy - 190, W() + 80, 34, L.light, 17, 0); glow(g, W() / 2, wy - 170, W() * 0.7, L.light, 0.28);
    for (let x = 40; x < W(); x += V() ? 360 : 330) { box(g, x, f - 500, 260, 330, L.alt, 60); box(g, x + 22, f - 480, 216, 90, shade(L.alt, 0.15), 40, 0); box(g, x - 10, f - 200, 290, 80, shade(L.alt, -0.12), 30); seg(g, [[x + 20, f - 120], [x + 20, f]], 18, INK); seg(g, [[x + 250, f - 120], [x + 250, f]], 18, INK); }
    floor(g, f, L.floor); box(g, -40, f + 60, W() + 80, 26, L.accent, 6, 0); },
  // supermarket aisle in one-point perspective: stocked shelves, hanging sign, ceiling lights
  supermarket(g, t, L) { const f = floorY('supermarket'), vx = W() / 2, hz = H() * 0.4; g.fillStyle = shade(L.wall, -0.04); g.fillRect(-W(), -H(), W() * 3, H() * 3);
    box(g, vx - 150, hz - 230, 300, f - hz + 60, shade(L.alt, 0.55), 8); floor(g, f, shade(L.floor, 0.25)); for (let i = -6; i <= 6; i++) seg(g, [[vx + i * 40, hz + 260], [vx + i * 330, H()]], 3, alpha(INK, 0.2));
    const cols = [L.accent, L.alt, '#ffd84a', '#7ac86a', '#e86a9a', '#6ab0e8'];
    for (const side of [-1, 1]) { const xn = side < 0 ? -40 : W() + 40, xf = vx + side * 150;
      for (let row = 0; row < 4; row++) { const yn = f - 40 - row * (V() ? 330 : 200), yf = hz + 250 - row * 118;
        g.fillStyle = '#e8e0d4'; g.beginPath(); g.moveTo(xn, yn); g.lineTo(xf, yf); g.lineTo(xf, yf + 16); g.lineTo(xn, yn + 40); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke();
        const r = rng(20 + row + (side > 0 ? 50 : 0)); for (let i = 0; i < 9; i++) { const k = Math.pow(i / 9, 0.8), k2 = k + 0.07, x = xn + (xf - xn) * k, y = yn + (yf - yn) * k, w = (xf - xn) * (k2 - k) * 0.86, h = (V() ? 230 : 140) * (1 - k * 0.74) * (0.7 + r() * 0.3); box(g, Math.min(x, x + w), y - h, Math.abs(w), h, cols[Math.floor(r() * 6)], 8, 3); g.fillStyle = alpha('#ffffff', 0.65); g.fillRect(Math.min(x, x + w) + Math.abs(w) * 0.18, y - h * 0.62, Math.abs(w) * 0.64, h * 0.24); } } }
    for (let i = 0; i < 4; i++) { const k = i / 4, y = 60 + (hz - 150) * k, w = 460 * (1 - k * 0.7); box(g, vx - w / 2, y, w, 30 * (1 - k * 0.5), '#ffffff', 12, 3); glow(g, vx, y + 20, w, L.light, 0.35); }
    const sy = hz - 120 + Math.sin(t * 1.3) * 4; seg(g, [[vx - 120, sy - 90], [vx - 120, sy]], 5, INK); seg(g, [[vx + 120, sy - 90], [vx + 120, sy]], 5, INK); box(g, vx - 170, sy, 340, 110, L.accent, 18); text(g, 'AISLE 7', vx, sy + 58, { size: 56, color: '#ffffff', stroke: 6, strokeColor: INK }); },
  // rooftop: wide sky, distant city, water tank, parapet, string lights
  rooftop(g, t, L) { const f = floorY('rooftop'); sky(g, L, f); const night = L.dim > 0; if (night) { const r = rng(4); for (let i = 0; i < 70; i++) circle(g, r() * W(), r() * H() * 0.4, 1.5 + r() * 2.5, alpha('#ffffff', 0.4 + 0.4 * Math.sin(t * 2 + i))); }
    circle(g, W() * 0.78, H() * 0.18, 90, night ? '#f4f0d8' : '#fff2b8'); glow(g, W() * 0.78, H() * 0.18, 420, L.light, 0.4);
    skyline(g, f - 120, shade(L.alt, -0.1), t, -t * 4, night ? '#ffd98a' : null, 13, V() ? 560 : 330); skyline(g, f - 40, shade(L.alt, -0.4), t, -t * 9, night ? L.accent : null, 17, V() ? 330 : 220);
    const tx = W() * 0.14; for (const d of [-70, 70]) seg(g, [[tx + d, f - 100], [tx + d * 0.7, f - 330]], 16, INK); box(g, tx - 120, f - 570, 240, 250, '#a8744a', 24); for (let i = 1; i < 5; i++) seg(g, [[tx - 120 + i * 48, f - 565], [tx - 120 + i * 48, f - 325]], 4, alpha(INK, 0.5)); g.fillStyle = '#7a4a30'; g.beginPath(); g.moveTo(tx - 140, f - 565); g.lineTo(tx, f - 660); g.lineTo(tx + 140, f - 565); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    box(g, -40, f - 130, W() + 80, 130, shade(L.wall, -0.25), 6); box(g, -40, f - 160, W() + 80, 40, L.wall, 8); floor(g, f, L.floor);
    const y0 = H() * (V() ? 0.3 : 0.2); g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-20, y0); g.quadraticCurveTo(W() / 2, y0 + 150, W() + 20, y0 - 30); g.stroke(); for (let i = 1; i < 12; i++) { const u = i / 12, x = -20 + u * (W() + 40), y = (1 - u) * (1 - u) * y0 + 2 * (1 - u) * u * (y0 + 150) + u * u * (y0 - 30); circle(g, x, y + 20, 14, i % 2 ? '#ffd84a' : L.accent); glow(g, x, y + 20, 70, '#ffd98a', night ? 0.55 : 0.2); } },
};
const FG = {
  classroom(g, t, L) { const y = floorY('classroom') + (V() ? 150 : 70); for (let x = -60; x < W() + 200; x += V() ? 460 : 480) { box(g, x, y, 340, 46, '#c89060', 12); seg(g, [[x + 30, y + 46], [x + 20, y + 300]], 18, INK); seg(g, [[x + 310, y + 46], [x + 320, y + 300]], 18, INK); box(g, x + 60, y - 26, 110, 26, L.accent, 6, 4); box(g, x + 210, y - 40, 40, 40, L.alt, 8, 4); } },
};
export const PLACES = Object.keys(DRAW);
export function place(g, name, t = 0, o = {}) { const L = LOOKS[o.look] || LOOKS.noon; DRAW[name](g, t, L); if (o.weather !== false && name !== 'classroom' && name !== 'supermarket') weather(g, t, L); if (L.dim) { g.fillStyle = `rgba(8,6,26,${L.dim})`; g.fillRect(-W(), -H(), W() * 3, H() * 3); } }
export function fg(g, name, t = 0, o = {}) { if (FG[name]) FG[name](g, t, LOOKS[o.look] || LOOKS.noon); }
