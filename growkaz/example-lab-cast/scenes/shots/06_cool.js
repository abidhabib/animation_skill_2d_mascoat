// Ordinary Mind cool looks
import { E, registerShot, text, rr } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
const V = [['A  SHADES', 'om_shades'], ['B  SMIRK', 'om_smirk'], ['C  WINK', 'om_wink']];
const cast = (id) => ({ ...HERO, c19: [id, 'rebel'] });
registerShot('K1', { draw(g) { V.forEach(([n, id], i) => { const x = i * 640; const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, ['#23304e', '#3a2038', '#17413f'][i]); gr.addColorStop(1, '#0e0c18'); g.fillStyle = gr; g.fillRect(x, 0, 641, E.H);
  bigToonFace(g, x + 270, 330, 155, { cast: cast(id), expr: 'confident', clip: true, t: 1 }); drawToon(g, { x: x + 500, y: 960, s: 1.7, cast: cast(id), action: i === 1 ? 'handsPockets' : i === 2 ? 'thumbsUp' : 'idle', t: 1, expr: 'smirk' });
  rr(g, x + 40, 960, 300, 76, 14); g.fillStyle = '#f4ecdc'; g.fill(); text(g, n, x + 190, 1000, { size: 40, color: '#17121c' }); }); } });
const EX = ['neutral', 'friendly', 'smirk', 'shocked', 'angry', 'thinking', 'sad', 'laugh'];
registerShot('K2', { draw(g) { g.fillStyle = '#1c2640'; g.fillRect(0, 0, E.W, E.H); V.forEach(([n, id], r) => { const y = 170 + r * 340; text(g, n, 120, y, { size: 30, color: '#f4ecdc' }); EX.forEach((ex, i) => { bigToonFace(g, 330 + i * 207, y, 82, { cast: cast(id), expr: ex, clip: true, t: 1 }); if (r === 2) text(g, ex, 330 + i * 207, y + 180, { size: 24, color: '#f4ecdc' }); }); }); } });
