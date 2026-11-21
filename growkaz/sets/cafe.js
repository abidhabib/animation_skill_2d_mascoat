// sets/cafe.js: a cozy cafe at golden hour. Big front window with the street outside, warm pendant lamps, a counter with an
// espresso machine + menu board, a small round table for two in the middle (tableSpot), plants. o.mood 'golden' (default) | 'night'.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const cafeGround = () => E.H * V(0.86, 0.72);
export const tableSpot = () => ({ x: E.W / 2 + 40, y: cafeGround() - 150 });       // table top centre (cups/money go here)
export function cup(g, x, y, s = 1, steam = 0, t = 0) {                                // coffee cup on its saucer, optional steam
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#f4efe6'; g.beginPath(); g.ellipse(0, 0, 46, 9, 0, 0, 7); g.fill();
  g.beginPath(); g.moveTo(-30, -48); g.lineTo(30, -48); g.lineTo(24, -4); g.lineTo(-24, -4); g.closePath(); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 4; g.stroke();
  g.beginPath(); g.ellipse(38, -30, 12, 14, 0, -1.4, 1.4); g.stroke(); g.fillStyle = '#6a3a22'; g.beginPath(); g.ellipse(0, -48, 30, 6, 0, 0, 7); g.fill();
  for (let i = 0; i < 2 && steam > 0; i++) { g.strokeStyle = alpha('#ffffff', 0.35 * steam); g.lineWidth = 4; g.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -56 - k * 7; const xx = (i ? 10 : -10) + Math.sin(t * 3 + k * 0.6 + i) * 6; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  g.restore();
}
export function cafe(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), night = o.mood === 'night', GY = cafeGround(), CX = E.W / 2;
  const wx = CX - 1000, wy = GY - V(720, 1050), ww = 760, wh = V(560, 800);
  layer(g, cam, 0.12, (g) => { backdrop(g, night ? ['#0d1330', '#26305a'] : ['#6b5a8e', '#e89a6a', '#f9d49c']); if (!night) FX.sun(g, wx + ww * 0.5, wy + wh * 0.55, 40, '#fff4d8', '#ffc880', 4);
    FX.skyline(g, { x: -E.W, y: wy + wh * 0.95, w: E.W * 3, minH: 120, maxH: 380, color: night ? '#151a36' : '#8a5a5a', windowColor: alpha('#ffd98a', 0.5), lit: 0.3, seed: 21 }); });
  layer(g, cam, 0.55, (g) => {
    const top = GY - V(820, 1200), wall = night ? '#3a2a36' : '#7a4a3a';
    g.save(); g.beginPath(); g.rect(-E.W, top, E.W * 3, GY - top + 4); g.rect(wx, wy, ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.1), wall, shade(wall, -0.3)]); g.fillRect(-E.W, top, E.W * 3, GY - top + 4); g.restore();
    g.strokeStyle = '#2a1a1a'; g.lineWidth = 18; g.strokeRect(wx, wy, ww, wh); g.lineWidth = 9; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.stroke();
    if (!night) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffcf8f', 0.1); g.beginPath(); g.moveTo(wx, wy + wh); g.lineTo(wx + ww, wy + wh); g.lineTo(wx + ww + 700, GY); g.lineTo(wx + 300, GY); g.closePath(); g.fill(); g.restore(); }
    rr(g, CX + 380, GY - V(700, 1000), 420, 240, 10); g.fillStyle = '#1e2420'; g.fill(); g.strokeStyle = '#8a6a4a'; g.lineWidth = 10; g.stroke();     // menu board
    for (let i = 0; i < 5; i++) seg(g, [[CX + 420, GY - V(650, 950) + i * 40], [CX + 420 + 200 + (i * 37) % 120, GY - V(650, 950) + i * 40]], 6, alpha('#f4efe6', 0.6));
    rr(g, CX + 300, GY - 260, 900, 260, 0); g.fillStyle = '#5a3a2a'; g.fill(); rr(g, CX + 290, GY - 274, 920, 20, 6); g.fillStyle = '#d8c8a8'; g.fill();   // counter
    rr(g, CX + 820, GY - 420, 200, 146, 14); g.fillStyle = '#b8c0c8'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke(); circle(g, CX + 920, GY - 350, 26, '#3a3a44');  // espresso machine
    for (const lx of [CX - 200, CX + 40, CX + 600]) { seg(g, [[lx, top], [lx, GY - V(640, 940)]], 4, '#1b1424'); g.fillStyle = '#e0a040'; g.beginPath(); g.arc(lx, GY - V(620, 920), 46, Math.PI, 0); g.fill(); glow(g, lx, GY - V(600, 900), 240, '#ffd59a', 0.4); }
    rr(g, CX - 1180, GY - 200, 110, 200, 10); g.fillStyle = '#c4643a'; g.fill(); circle(g, CX - 1125, GY - 240, 80, '#4a8a4f'); circle(g, CX - 1160, GY - 300, 54, '#5fa85a');
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#6a4632', '#36241c']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    for (let x = -E.W; x < E.W * 2; x += 140) { g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, GY); g.lineTo(x + (x - CX) * 0.5, GY + 500); g.stroke(); }
    const ts = tableSpot(); seg(g, [[ts.x, ts.y], [ts.x, GY]], 12, '#2a1a1a'); seg(g, [[ts.x - 70, GY], [ts.x + 70, GY]], 10, '#2a1a1a');
    g.fillStyle = '#8a5a3a'; g.beginPath(); g.ellipse(ts.x, ts.y, 190, 26, 0, 0, 7); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 5; g.stroke();
    FX.pool(g, ts.x, GY + 30, 420, 60, '#ffd59a', 0.25);
  });
  return { GY, CX, M };
}
