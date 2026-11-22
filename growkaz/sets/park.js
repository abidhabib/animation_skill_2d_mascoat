// sets/park.js: a sunny neighbourhood park path with a wooden picket fence (childhood memory). Soft warm "memory" look:
// o.memory (0..1) adds a warm haze + soft vignette + light leaks. fenceX() = where the fence stands (crash point).
// Also exports bike(g, x, y, s, o) = a kid's bicycle (wheels spin with o.spin, o.tilt for wobble/crash).
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, linGrad, radGrad, glow, alpha, shade, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const parkGround = () => E.H * V(0.84, 0.72);
export const fenceX = () => E.W / 2 + 520;
export function bike(g, x, y, s = 1, o = {}) {           // x,y = ground under the bike centre; ~200 units long at s=1
  const { spin = 0, tilt = 0, color = '#e0562f', ink = '#1b1424' } = o;
  g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s);
  for (const wx of [-70, 70]) { ring(g, wx, -38, 36, 7, ink); for (let k = 0; k < 4; k++) { const a = spin + k * Math.PI / 4; seg(g, [[wx - Math.cos(a) * 34, -38 - Math.sin(a) * 34], [wx + Math.cos(a) * 34, -38 + Math.sin(a) * 34]], 2, alpha(ink, 0.6)); } }
  seg(g, [[-70, -38], [-10, -38], [40, -90], [-30, -90], [-10, -38]], 8, color); seg(g, [[40, -90], [70, -38]], 8, color);
  seg(g, [[-30, -90], [-38, -108]], 6, ink); rr(g, -60, -116, 46, 12, 6); g.fillStyle = ink; g.fill();            // seat
  seg(g, [[40, -90], [46, -122], [30, -128]], 6, ink); seg(g, [[46, -122], [60, -126]], 6, ink);                  // handlebar
  circle(g, -10, -38, 10, ink);
  g.restore();
}
export function park(g, t, cam, o = {}) {
  const M = mood('golden'), GY = parkGround(), CX = E.W / 2, mem = o.memory ?? 1;
  layer(g, cam, 0.12, (g) => { backdrop(g, ['#9ec4e8', '#f6d9a8', '#ffe9c4']); FX.sun(g, CX - 500, GY - V(620, 980), 60, '#fffaf0', '#ffe0a0', 4); FX.clouds(g, { y: E.H * 0.15, a: 0.35, count: 7 }); });
  layer(g, cam, 0.4, (g) => { FX.hills(g, { y: GY - 120, amp: 110, color: '#9cc48a', seed: 3 }); for (let i = 0; i < 9; i++) FX.tree(g, CX - 1300 + i * 330, GY - 110, 1.4 + (i % 3) * 0.2, '#6aa36a'); });
  layer(g, cam, 0.7, (g) => { FX.hills(g, { y: GY - 20, amp: 50, color: '#8cbf78', seed: 8 }); for (const x of [CX - 900, CX - 250, CX + 900]) FX.tree(g, x, GY - 10, 2.4, '#4f8f55'); });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY - 20, 0, GY + 400, ['#7ab86a', '#5a9a50']); g.fillRect(-E.W, GY - 20, E.W * 3, E.H * 2);
    g.fillStyle = '#e8d2a8'; g.beginPath(); g.moveTo(-E.W, GY + 10); g.lineTo(E.W * 2, GY + 10); g.lineTo(E.W * 2, GY + 110); g.lineTo(-E.W, GY + 110); g.closePath(); g.fill();   // path
    const fx = fenceX(); for (let i = 0; i < 9; i++) { const px = fx + i * 46; g.fillStyle = '#f6efe0'; g.beginPath(); g.moveTo(px - 16, GY + 20); g.lineTo(px - 16, GY - 150); g.lineTo(px, GY - 172); g.lineTo(px + 16, GY - 150); g.lineTo(px + 16, GY + 20); g.closePath(); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 4; g.stroke(); }
    rr(g, fx - 30, GY - 120, 9 * 46 + 20, 16, 4); g.fillStyle = '#f6efe0'; g.fill(); g.stroke(); rr(g, fx - 30, GY - 50, 9 * 46 + 20, 16, 4); g.fill(); g.stroke();
    const r = rng(5); for (let i = 0; i < 40; i++) circle(g, -200 + r() * (E.W + 400), GY + 140 + r() * 200, 4 + r() * 4, ['#ffe08a', '#ffffff', '#f4a8b8'][i % 3]);   // flowers
  });
  if (mem > 0) {                                              // memory look: warm haze, soft edges, gentle light leak
    g.save(); g.globalAlpha = 0.18 * mem; g.fillStyle = '#ffd8a0'; g.fillRect(0, 0, E.W, E.H); g.restore();
    g.save(); g.fillStyle = radGrad(g, E.W / 2, E.H / 2, E.H * 0.45, E.W * 0.75, [alpha('#000', 0), alpha('#3a2010', 0.35 * mem)]); g.fillRect(0, 0, E.W, E.H); g.restore();
    glow(g, E.W * (0.1 + 0.05 * Math.sin(t * 0.7)), E.H * 0.1, 600, '#ffb070', 0.25 * mem);
  }
  return { GY, CX, M };
}
