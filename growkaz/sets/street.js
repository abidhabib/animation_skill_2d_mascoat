// sets/street.js: a city street outside Sam's building. Brick facades with warm windows, a lit doorway with a small awning,
// a mounted street clock, lamp posts, wet ground with reflections + puddles.
// o.mood: 'night' (default) | 'dusk' ; o.rain: 0..1 (drops + streaks + ripples) ; o.clockT: seconds for the street clock (7pm = 2100)
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, mix, rng } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const streetGround = () => E.H * V(0.84, 0.7);
export const doorSpot = () => ({ x: E.W / 2 + 260, y: streetGround() });          // Sam's door (stand here)
export const streetClock = () => ({ x: E.W / 2 - 430, y: streetGround() - V(470, 700), r: 50 });
export function umbrella(g, x, y, s, col = '#2f5a8a', tilt = 0) {                 // x,y = hand; canopy above the head
  g.save(); g.translate(x, y); g.rotate(tilt); g.scale(s, s);
  seg(g, [[0, 0], [0, -150]], 5, '#1b1424'); seg(g, [[0, 0], [0, 10], [-12, 16]], 5, '#1b1424');
  g.fillStyle = col; g.strokeStyle = '#1b1424'; g.lineWidth = 5; g.beginPath(); g.moveTo(-120, -150);
  g.quadraticCurveTo(0, -250, 120, -150); for (let i = 3; i >= 0; i--) g.quadraticCurveTo(-120 + i * 60 + 30, -168, -120 + i * 60, -150); g.closePath(); g.fill(); g.stroke();
  g.restore();
}
export function street(g, t, cam, o = {}) {
  const night = (o.mood || 'night') === 'night', M = mood(night ? 'night' : 'dusk'), GY = streetGround(), CX = E.W / 2, rain = o.rain ?? 0;
  const sky = night ? ['#0d1330', '#1e2652', '#33386a'] : ['#3d3360', '#8a5a86', '#e8956b'];
  layer(g, cam, 0.12, (g) => { backdrop(g, sky); if (night) FX.stars(g, t, { count: rain > 0 ? 0 : 60 });
    FX.skyline(g, { x: -E.W, y: GY - V(420, 700), w: E.W * 3, minH: 120, maxH: V(360, 560), color: night ? '#151a36' : '#4a3650', windowColor: alpha('#ffd98a', 0.5), lit: 0.3, seed: 12 }); });
  layer(g, cam, 0.6, (g) => {
    const brick = night ? '#5a3a3a' : '#8a5048';
    FX.facade(g, { x: CX - 1500, y: GY, w: 700, h: V(620, 900), color: shade(brick, -0.1), win: '#ffcf8a', dark: '#241a24', cols: 6, rows: 4, lit: 0.4, seed: 3 });
    FX.facade(g, { x: CX - 800, y: GY, w: 900, h: V(560, 820), color: brick, win: '#ffcf8a', dark: '#241a24', cols: 7, rows: 4, lit: 0.4, seed: 5 });
    FX.facade(g, { x: CX + 100, y: GY, w: 1400, h: V(640, 920), color: shade(brick, 0.05), win: '#ffd59a', dark: '#241a24', cols: 10, rows: 4, lit: 0.35, seed: 8 });
    const c = streetClock(); seg(g, [[c.x, c.y + c.r], [c.x, c.y + c.r + 40]], 8, '#1b1424'); seg(g, [[c.x - 60, c.y + c.r + 40], [c.x + 60, c.y + c.r + 40]], 8, '#1b1424');
    FX.clock(g, c.x, c.y, c.r, o.clockT ?? 2100 + t, {}); glow(g, c.x, c.y, 120, '#fff2c8', 0.2);
  });
  layer(g, cam, 0.85, (g) => {                                                   // Sam's door + awning, sidewalk, lamps
    const d = doorSpot();
    rr(g, d.x - 80, GY - 260, 160, 260, 6); g.fillStyle = '#3a2a36'; g.fill(); rr(g, d.x - 66, GY - 246, 132, 246, 4); g.fillStyle = '#6a3a2a'; g.fill();
    rr(g, d.x - 56, GY - 236, 112, 90, 4); g.fillStyle = '#ffd59a'; g.fill(); glow(g, d.x, GY - 190, 220, '#ffd59a', 0.35); circle(g, d.x + 44, GY - 120, 7, '#e0b05a');
    g.fillStyle = '#2f6a5a'; g.beginPath(); g.moveTo(d.x - 130, GY - 280); g.lineTo(d.x + 130, GY - 280); g.lineTo(d.x + 150, GY - 320); g.lineTo(d.x - 150, GY - 320); g.closePath(); g.fill();
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, night ? ['#2a2a3e', '#121422'] : ['#5a4a5a', '#2a2230']); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    seg(g, [[-E.W, GY + 70], [E.W * 2, GY + 70]], 6, alpha('#000', 0.3));
    for (const lx of [CX - 700, CX + 900]) { FX.lampPost(g, lx, GY, V(420, 520), { light: '#ffd59a', a: 0.18 }); FX.pool(g, lx + 37, GY + 30, 220, 40, '#ffd59a', 0.3); }
    g.save(); g.globalAlpha = 0.25; g.globalCompositeOperation = 'lighter';                              // wet reflections of the windows/lamps
    const r = rng(7); for (let i = 0; i < 26; i++) { const x = -E.W * 0.5 + r() * E.W * 2, w = 18 + r() * 30; g.fillStyle = linGrad(g, 0, GY, 0, GY + 220, [alpha('#ffd59a', 0.6), alpha('#ffd59a', 0)]); g.fillRect(x, GY + 4, w, 120 + r() * 120); }
    g.restore();
    if (rain > 0) { const r2 = rng(9); for (let i = 0; i < 16; i++) { const px = -200 + r2() * (E.W + 400), py = GY + 30 + r2() * 260, ph = (t * 1.3 + r2()) % 1;
      g.strokeStyle = alpha('#cfe0ff', 0.5 * (1 - ph) * rain); g.lineWidth = 2; g.beginPath(); g.ellipse(px, py, 10 + ph * 50, (10 + ph * 50) * 0.25, 0, 0, 7); g.stroke(); } }
  });
  if (rain > 0) FX.rain(g, t, { count: Math.round(260 * rain), color: '#cfe0ff', a: 0.35 * rain });
  return { GY, CX, M };
}
