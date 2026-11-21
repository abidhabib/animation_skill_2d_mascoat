// sets/bathroom.js: a small bathroom with a big wall mirror over a sink, tiles, a vanity light bar.
// mirrorRect() gives the mirror area so a shot can draw the reflection inside it (clip + mirrored figure).
import { E, V, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const bathGround = () => E.H * V(0.9, 0.74);
export const mirrorRect = () => ({ x: E.W / 2 - 380, y: E.H * V(0.12, 0.2), w: 760, h: E.H * V(0.5, 0.36) });
export function bathroom(g, t, cam, o = {}) {
  const GY = bathGround(), CX = E.W / 2, m = mirrorRect();
  layer(g, cam, 0.6, (g) => {
    g.fillStyle = linGrad(g, 0, 0, 0, GY, ['#dfe9ec', '#b9cdd3']); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    g.strokeStyle = 'rgba(90,120,130,.25)'; g.lineWidth = 3;
    for (let x = -E.W; x < E.W * 2; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, GY); g.stroke(); }
    for (let y = 0; y < GY; y += 80) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
    rr(g, m.x - 22, m.y - 22, m.w + 44, m.h + 44, 18); g.fillStyle = '#e8e4da'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
    g.fillStyle = linGrad(g, m.x, m.y, m.x + m.w, m.y + m.h, ['#c7dde6', '#9fbccb']); g.fillRect(m.x, m.y, m.w, m.h);
    rr(g, CX - 260, m.y - 70, 520, 30, 15); g.fillStyle = '#fff6d8'; g.fill(); glow(g, CX, m.y - 55, 420, '#fff2c8', 0.35);
    rr(g, CX - 300, GY - V(260, 300), 600, 60, 14); g.fillStyle = '#f4f4f4'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke();
    seg(g, [[CX + 20, GY - V(300, 340)], [CX + 20, GY - V(270, 310)]], 10, '#9aa4ae');
    rr(g, CX - 240, GY - V(200, 240), 480, V(200, 240), 10); g.fillStyle = '#7a5a46'; g.fill();
  });
  layer(g, cam, 0.9, (g) => { g.fillStyle = '#8fa3ab'; g.fillRect(-E.W, GY, E.W * 3, E.H); });
  return { GY, CX, m };
}
// glass streaks + mist on top of the reflection
export function mirrorGlass(g, m) {
  g.save(); g.globalAlpha = 0.18; g.fillStyle = '#ffffff';
  g.beginPath(); g.moveTo(m.x + m.w * 0.1, m.y); g.lineTo(m.x + m.w * 0.35, m.y); g.lineTo(m.x + m.w * 0.05, m.y + m.h); g.lineTo(m.x - m.w * 0.2, m.y + m.h); g.closePath(); g.fill();
  g.restore();
}
