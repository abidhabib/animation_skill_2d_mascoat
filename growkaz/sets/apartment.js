// sets/apartment.js: a cozy apartment living room at dusk (Sam's place). Big window with a dusk skyline, a warm floor lamp,
// a sofa, a shelf with plants, a rug, soft light pools. o.mood: 'dusk' (default) | 'night' | 'golden'.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, radGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const aptGround = () => E.H * V(0.84, 0.7);
export function apartment(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = aptGround(), CX = E.W / 2;
  const wall = o.wall || '#5b4a5e', wallDark = shade(wall, -0.35), lamp = '#ffd28a';
  layer(g, cam, 0.12, (g) => {                                     // what the window sees
    backdrop(g, M.sky);
    FX.sun(g, CX + 380, GY - V(520, 900), 46, '#fff0d0', M.key, 3);
    FX.skyline(g, { x: -E.W, y: GY - V(330, 560), w: E.W * 3, minH: 60, maxH: V(240, 380), color: mix(M.sky[1] || '#333', '#1a1420', 0.7), windowColor: alpha('#ffd98a', 0.6), lit: 0.25, seed: 4 });
  });
  layer(g, cam, 0.55, (g) => {                                     // wall with a big window
    const top = GY - V(680, 1100), wx = CX - 160, wy = GY - V(560, 900), ww = 760, wh = V(400, 620);
    g.save(); g.beginPath(); g.rect(-E.W, top, E.W * 3, GY - top + 4); g.rect(wx, wy, ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.08), wall, wallDark]); g.fillRect(-E.W, top, E.W * 3, GY - top + 4); g.restore();
    g.strokeStyle = '#2a2030'; g.lineWidth = 16; g.strokeRect(wx, wy, ww, wh); g.lineWidth = 9; g.beginPath(); g.moveTo(wx + ww / 2, wy); g.lineTo(wx + ww / 2, wy + wh); g.moveTo(wx, wy + wh / 2); g.lineTo(wx + ww, wy + wh / 2); g.stroke();
    g.fillStyle = alpha('#fff', 0.05); g.beginPath(); g.moveTo(wx, wy); g.lineTo(wx + ww * 0.4, wy); g.lineTo(wx, wy + wh * 0.7); g.closePath(); g.fill();
    // shelf with plants + books (left)
    const sx = CX - 760, sy = GY - V(420, 600);
    rr(g, sx, sy, 300, 18, 6); g.fillStyle = '#7a5038'; g.fill();
    for (let i = 0; i < 6; i++) { rr(g, sx + 20 + i * 26, sy - 70 + (i % 3) * 8, 20, 70 - (i % 3) * 8, 3); g.fillStyle = ['#e0562f', '#4a78b8', '#e0b05a', '#2f8a57', '#a8508a', '#3fa7a0'][i]; g.fill(); }
    rr(g, sx + 200, sy - 56, 50, 56, 8); g.fillStyle = '#c4643a'; g.fill(); circle(g, sx + 225, sy - 76, 34, '#4a9e4f'); circle(g, sx + 205, sy - 92, 22, '#5fb85a');
    // framed picture (right)
    rr(g, CX + 700, GY - V(560, 860), 200, 150, 6); g.fillStyle = '#2a2030'; g.fill(); rr(g, CX + 712, GY - V(548, 848), 176, 126, 4); g.fillStyle = '#e8c890'; g.fill();
  });
  layer(g, cam, 0.85, (g) => {                                     // floor, rug, sofa, floor lamp
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#6a4a3a', '#3a2620']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.2)', 0.06);
    g.fillStyle = '#8a3a3a'; g.beginPath(); g.ellipse(CX, GY + 60, 560, 60, 0, 0, Math.PI * 2); g.fill();
    if (o.sofa !== false) { const fx = CX + 520; rr(g, fx - 230, GY - 190, 460, 110, 30); g.fillStyle = '#3a5a8a'; g.fill(); rr(g, fx - 260, GY - 120, 520, 100, 24); g.fillStyle = '#4a6ea5'; g.fill();
      rr(g, fx - 270, GY - 150, 60, 150, 20); g.fill(); rr(g, fx + 210, GY - 150, 60, 150, 20); g.fill(); rr(g, fx - 140, GY - 170, 90, 70, 18); g.fillStyle = '#e0b05a'; g.fill(); }
    const lx = CX - 520; seg(g, [[lx, GY], [lx, GY - V(430, 640)]], 8, '#2a2030'); rr(g, lx - 30, GY - 6, 60, 10, 5); g.fillStyle = '#2a2030'; g.fill();
    g.fillStyle = '#ffe2a8'; g.beginPath(); g.moveTo(lx - 60, GY - V(430, 640)); g.lineTo(lx + 60, GY - V(430, 640)); g.lineTo(lx + 40, GY - V(500, 720)); g.lineTo(lx - 40, GY - V(500, 720)); g.closePath(); g.fill();
    glow(g, lx, GY - V(440, 650), 380, lamp, 0.35); FX.pool(g, lx, GY + 30, 300, 50, lamp, 0.35);
  });
  return { GY, CX, M };
}
