// sets/bedroom.js: the hero's bedroom at early morning. Window with half-open blinds and a sunrise, bed with a duvet,
// nightstand + little lamp, a mounted wall clock. o.mood: 'golden' (default) | 'night' (pre-dawn blue) ; o.clockT = seconds for FX.clock.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const bedGround = () => E.H * V(0.86, 0.72);
export const bedSpot = () => ({ x: E.W / 2 + 160, y: bedGround() - 110 });       // top of the mattress (sit here)
export const standSpot = () => ({ x: E.W / 2 - 300, y: bedGround() - 150 });     // top of the nightstand (phone here)
export const clockSpot = () => ({ x: E.W / 2 - 620, y: bedGround() - V(560, 820), r: 70 });
export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = bedGround(), CX = E.W / 2, night = o.mood === 'night';
  const wall = o.wall || (night ? '#2c3050' : '#6a5866');
  const wx = CX - 120, wy = GY - V(700, 1000), ww = 560, wh = V(400, 560);
  layer(g, cam, 0.12, (g) => {                                     // sky through the window
    backdrop(g, night ? ['#0e1430', '#26305a', '#4a4a80'] : ['#7a6a9e', '#f0a070', '#ffd9a0']);
    if (!night) FX.sun(g, wx + ww * 0.7, wy + wh * 0.8, 40, '#fff4d8', '#ffc880', 4);
    FX.skyline(g, { x: -E.W, y: wy + wh + 40, w: E.W * 3, minH: 40, maxH: 200, color: night ? '#141832' : '#7a5a70', windowColor: alpha('#ffd98a', night ? 0.5 : 0.2), lit: 0.2, seed: 9 });
  });
  layer(g, cam, 0.55, (g) => {
    const top = GY - V(760, 1200);
    g.save(); g.beginPath(); g.rect(-E.W, top, E.W * 3, GY - top + 4); g.rect(wx, wy, ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.08), wall, shade(wall, -0.3)]); g.fillRect(-E.W, top, E.W * 3, GY - top + 4); g.restore();
    for (let i = 0; i < 7; i++) { const y = wy + 10 + i * 26; rr(g, wx, y, ww, 14, 3); g.fillStyle = night ? '#3a3e60' : '#efe6d6'; g.fill(); }   // blinds (top half)
    g.strokeStyle = '#2a2030'; g.lineWidth = 16; g.strokeRect(wx, wy, ww, wh);
    if (!night) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffcf8f', 0.12);           // light shafts on the wall
      g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx + ww, wy + wh); g.lineTo(wx + ww - 300, GY); g.lineTo(wx - 420, GY); g.closePath(); g.fill(); g.restore(); }
    const c = clockSpot(); rr(g, c.x - 6, c.y - c.r - 18, 12, 18, 3); g.fillStyle = '#2a2030'; g.fill();          // mounted clock hook
    FX.clock(g, c.x, c.y, c.r, o.clockT ?? 2100 + t, {});
    rr(g, CX + 560, GY - V(600, 900), 170, 220, 6); g.fillStyle = '#2a2030'; g.fill(); rr(g, CX + 572, GY - V(588, 888), 146, 196, 4); g.fillStyle = '#8ab0c8'; g.fill();  // poster
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, night ? ['#2a2838', '#14121c'] : ['#7a5a46', '#3e2a22']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.2)', 0.06);
    const b = bedSpot(), bx = b.x - 330;                                                                    // bed
    rr(g, bx - 30, GY - 300, 40, 300, 10); g.fillStyle = '#5a3a2a'; g.fill();
    rr(g, bx, GY - 110, 700, 80, 14); g.fillStyle = '#6a4a36'; g.fill();
    rr(g, bx + 10, GY - 150, 680, 60, 24); g.fillStyle = '#f2ece2'; g.fill();
    rr(g, bx + 30, GY - 196, 170, 56, 24); g.fillStyle = '#ffffff'; g.fill();
    rr(g, bx + 220, GY - 166, 480, 70, 30); g.fillStyle = night ? '#3a4a8a' : '#e08a5a'; g.fill();
    const s = standSpot();                                                                                  // nightstand + lamp
    rr(g, s.x - 80, s.y, 160, GY - s.y, 8); g.fillStyle = '#6a4a36'; g.fill(); seg(g, [[s.x - 50, s.y + 60], [s.x + 50, s.y + 60]], 5, '#3e2a22');
    seg(g, [[s.x - 40, s.y], [s.x - 40, s.y - 70]], 5, '#2a2030'); g.fillStyle = night ? '#6a6a7a' : '#ffe2a8';
    g.beginPath(); g.moveTo(s.x - 76, s.y - 70); g.lineTo(s.x - 4, s.y - 70); g.lineTo(s.x - 20, s.y - 120); g.lineTo(s.x - 60, s.y - 120); g.closePath(); g.fill();
    if (!night) FX.pool(g, CX, GY + 40, 500, 60, '#ffcf8f', 0.25);
  });
  return { GY, CX, M };
}
