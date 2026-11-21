// sets/mall.js: a shopping-mall concourse at golden hour (user's V02 Clip 19). Skylight ceiling with a warm sky, glowing
// shop windows as practical lights, pillars, a glossy floor with light pools and reflections, a soft blurred crowd far back.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const mallGround = () => E.H * V(0.84, 0.7);
export function mall(g, t, cam, o = {}) {
  const M = mood(o.mood || 'golden'), GY = mallGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.15), wallDark = shade(M.wall, -0.5), warm = o.warm || '#ffcf8a';
  layer(g, cam, 0.15, (g) => {                                   // skylight: warm sky through a glass roof
    backdrop(g, M.sky);
    FX.sun(g, CX + V(520, 220), GY - V(760, 1200), 54, '#fff3dc', M.key, 4);
    g.strokeStyle = alpha(wallDark, 0.9); g.lineWidth = 14;
    for (let i = -6; i <= 6; i++) { g.beginPath(); g.moveTo(CX + i * 260, 0); g.lineTo(CX + i * 150, GY - V(620, 980)); g.stroke(); }
    g.lineWidth = 10; for (let k = 1; k <= 3; k++) { const y = (GY - V(620, 980)) * k / 4; g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); }
  });
  layer(g, cam, 0.5, (g) => {                                    // back wall with shop fronts
    const top = GY - V(620, 980), left = CX - 1800, w = 3600;
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.05), wall, wallDark]); g.fillRect(left, top, w, GY - top + 4);
    const cols = ['#e0562f', '#2f8a57', '#4a78b8', '#d9a000', '#a8508a', '#3fa7a0'];
    for (let i = -4; i <= 4; i++) {
      const sw = 330, sx = CX + i * 400 - sw / 2, sy = GY - V(430, 600), sh = V(400, 560);
      FX.windowFrame(g, { x: sx, y: sy, w: sw, h: sh, cols: 2, rows: 1, frame: wallDark, bar: 8 }, (g, x, y, w, h) => {
        g.fillStyle = linGrad(g, 0, y, 0, y + h, [shade(warm, 0.05), shade(warm, -0.35), shade(warm, -0.6)]); g.fillRect(x, y, w, h);
        for (let k = 0; k < 3; k++) { g.fillStyle = alpha(wallDark, 0.7); rr(g, x + 18 + k * (w - 36) / 3, y + h * 0.35, (w - 60) / 3, h * 0.5, 10); g.fill(); }
      });
      g.fillStyle = cols[(i + 8) % cols.length]; rr(g, sx - 10, sy - 70, sw + 20, 52, 10); g.fill();
      g.fillStyle = alpha('#fff', 0.85); rr(g, sx + sw / 2 - 60, sy - 56, 120, 22, 8); g.fill();
      glow(g, sx + sw / 2, sy + sh / 2, 280, warm, 0.12);
    }
    for (let i = -4; i <= 4; i++) { const px = CX + i * 400 + 200; g.fillStyle = shade(wall, -0.2); g.fillRect(px - 26, top, 52, GY - top); g.fillStyle = alpha('#fff', 0.06); g.fillRect(px - 26, top, 10, GY - top); }
    if (o.crowd !== false) FX.crowd(g, t, { x: CX - 1400, y: GY - 40, w: 2800, rows: 2, rowH: 18, size: 2.2, color: alpha(wallDark, 0.85), seed: 5 });
  });
  layer(g, cam, 0.9, (g) => {                                    // glossy floor
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 500, [shade(M.floor, 0.05), shade(M.dark, -0.1)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(255,230,190,.12)', 0.07);
    for (let i = -4; i <= 4; i++) FX.pool(g, CX + i * 400, GY + 40, 220, 30, warm, 0.18);
    g.fillStyle = alpha('#fff', 0.05); g.fillRect(-E.W, GY + 20, E.W * 3, 14);
  });
  return { GY, CX, M };
}
