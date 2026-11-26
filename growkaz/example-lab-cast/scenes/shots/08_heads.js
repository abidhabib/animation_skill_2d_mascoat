// Ordinary Mind: completely new heads
import { E, registerShot, text, rr } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
const V = [['A  THE CLOSER', 'om_closer'], ['B  THE STRATEGIST', 'om_strategist'], ['C  THE BOSS', 'om_boss']];
const cast = (id) => ({ ...HERO, c19: [id, 'rebel'] });
registerShot('N1', { draw(g) { V.forEach(([n, id], i) => { const x = i * 640; const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, ['#2a3a60', '#4a2844', '#1a4f4a'][i]); gr.addColorStop(1, '#0e0c18'); g.fillStyle = gr; g.fillRect(x, 0, 641, E.H);
  bigToonFace(g, x + 265, 350, 165, { cast: cast(id), expr: 'confident', clip: true, t: 1 }); drawToon(g, { x: x + 505, y: 960, s: 1.7, cast: cast(id), action: i === 2 ? 'thumbsUp' : 'idle', t: 1, expr: 'smirk' });
  rr(g, x + 30, 960, 390, 76, 14); g.fillStyle = '#f4ecdc'; g.fill(); text(g, n, x + 225, 1000, { size: 36, color: '#17121c' }); }); } });
const EX = ['neutral', 'smirk', 'shocked', 'angry', 'thinking', 'sad', 'laugh'];
registerShot('N2', { draw(g) { g.fillStyle = '#26314e'; g.fillRect(0, 0, E.W, E.H); V.forEach(([n, id], r) => { const y = 160 + r * 340; text(g, n.slice(3), 130, y, { size: 24, color: '#f4ecdc' }); EX.forEach((ex, i) => { bigToonFace(g, 340 + i * 204, y, 86, { cast: cast(id), expr: ex, clip: true, t: 1 }); if (r === 2) text(g, ex, 340 + i * 204, y + 188, { size: 24, color: '#f4ecdc' }); });
  bigToonFace(g, 340 + 7 * 204 + 20, y, 70, { cast: cast(id), expr: 'confident', yaw: 1.45, clip: true, t: 1 }); if (r === 2) text(g, 'side', 340 + 7 * 204 + 20, y + 188, { size: 24, color: '#f4ecdc' }); }); } });
