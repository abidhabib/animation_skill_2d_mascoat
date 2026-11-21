// sets/kitchen.js: a warm morning kitchen. Window with morning sun, upper cabinets, a long counter, fridge, a toaster that can smoke.
// o.smoke (0..1) = burnt-toast smoke from the toaster; o.mood 'golden' (default) | 'day'.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, mix, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const kitGround = () => E.H * V(0.86, 0.72);
export const counterTop = () => kitGround() - 190;
export const toasterSpot = () => ({ x: E.W / 2 + 330, y: counterTop() });
export function kitchen(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = kitGround(), CX = E.W / 2, CT = counterTop();
  const wx = CX - 200, wy = GY - V(720, 1000), ww = 420, wh = V(300, 420);
  layer(g, cam, 0.12, (g) => { backdrop(g, ['#9ab8d8', '#f3c38e', '#ffe2b0']); FX.sun(g, wx + ww * 0.3, wy + wh * 0.5, 36, '#fff6e0', '#ffd59a', 4); FX.tree(g, wx + ww * 0.8, wy + wh + 60, 1.6, '#6a8a5a'); });
  layer(g, cam, 0.55, (g) => {
    const top = GY - V(800, 1200), wall = '#c9a27a';
    g.save(); g.beginPath(); g.rect(-E.W, top, E.W * 3, GY - top + 4); g.rect(wx, wy, ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.1), wall, shade(wall, -0.25)]); g.fillRect(-E.W, top, E.W * 3, GY - top + 4); g.restore();
    g.strokeStyle = '#2a2030'; g.lineWidth = 14; g.strokeRect(wx, wy, ww, wh); g.lineWidth = 8; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.stroke();
    for (let y = CT - 200; y < CT; y += 40) for (let x = -E.W; x < E.W * 2; x += 60) { g.strokeStyle = 'rgba(255,255,255,.18)'; g.lineWidth = 2; g.strokeRect(x + ((y / 40) % 2) * 30, y, 60, 40); }  // backsplash tiles
    for (const x0 of [CX - 900, CX - 620, CX + 300, CX + 580]) { rr(g, x0, GY - V(760, 1100), 260, 220, 8); g.fillStyle = '#e9e1d2'; g.fill(); g.strokeStyle = '#2a2030'; g.lineWidth = 5; g.stroke(); circle(g, x0 + 230, GY - V(560, 900), 7, '#2a2030'); }
    g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffd59a', 0.12); g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx + ww, wy + wh); g.lineTo(wx + ww + 200, CT); g.lineTo(wx - 360, CT); g.closePath(); g.fill(); g.restore();
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#a8805e', '#5a4030']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    for (let x = -E.W; x < E.W * 2; x += 120) { g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, GY); g.lineTo(x + (x - CX) * 0.6, GY + 500); g.stroke(); }
    rr(g, -E.W, CT, E.W * 3, GY - CT, 0); g.fillStyle = '#4a6a7a'; g.fill();                               // cabinets under counter
    for (let x = -E.W; x < E.W * 2; x += 200) { g.strokeStyle = '#2f4a58'; g.lineWidth = 4; g.strokeRect(x + 10, CT + 30, 180, GY - CT - 40); }
    rr(g, -E.W, CT - 14, E.W * 3, 22, 6); g.fillStyle = '#efe8dc'; g.fill();
    rr(g, CX - 1000, GY - 620, 260, 620, 14); g.fillStyle = '#e8eef0'; g.fill(); g.strokeStyle = '#2a2030'; g.lineWidth = 6; g.stroke();   // fridge
    seg(g, [[CX - 760, GY - 520], [CX - 760, GY - 420]], 8, '#9aa4ae'); seg(g, [[CX - 1000, GY - 400], [CX - 740, GY - 400]], 4, '#2a2030');
    const ts = toasterSpot();                                                                                  // toaster
    rr(g, ts.x - 70, ts.y - 90, 140, 90, 20); g.fillStyle = '#c0c8d0'; g.fill(); g.strokeStyle = '#2a2030'; g.lineWidth = 5; g.stroke();
    seg(g, [[ts.x - 35, ts.y - 88], [ts.x - 5, ts.y - 88]], 8, '#2a2030'); seg(g, [[ts.x + 10, ts.y - 88], [ts.x + 40, ts.y - 88]], 8, '#2a2030');
    if (o.smoke > 0) { const r = rng(3); for (let i = 0; i < 14; i++) { const ph = (t * 0.45 + r()) % 1; circle(g, ts.x + (r() - 0.5) * 60 + Math.sin(t * 2 + i) * 30 * ph, ts.y - 100 - ph * 420, 22 + ph * 60, alpha('#4a4048', 0.38 * (1 - ph) * o.smoke)); } }
    rr(g, CX - 520, CT - 70, 90, 70, 10); g.fillStyle = '#d06a4a'; g.fill(); rr(g, CX - 430, CT - 50, 26, 30, 8); g.strokeStyle = '#d06a4a'; g.lineWidth = 7; g.stroke();    // mug
    FX.pool(g, CX - 100, GY + 30, 520, 60, '#ffd59a', 0.22);
  });
  return { GY, CX, M, CT };
}
