// Ordinary Mind hero: formal glasses
import { E, registerShot, text } from '/engine/core.js';
import { drawToon, bigToonFace, OM_HERO } from '/engine/toon2d.js';
registerShot('S1', { draw(g) { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#23304e'); gr.addColorStop(1, '#0e0c18'); g.fillStyle = gr; g.fillRect(0, 0, E.W, E.H);
  bigToonFace(g, 400, 330, 200, { cast: OM_HERO, expr: 'confident', clip: true, t: 1 }); drawToon(g, { x: 820, y: 900, s: 2.1, cast: OM_HERO, action: 'idle', t: 1, expr: 'smirk' });
  ['neutral', 'smirk', 'shocked', 'angry', 'thinking', 'sad', 'laugh', 'skeptical', 'happy'].forEach((n, i) => { const x = 1160 + (i % 3) * 270, y = 150 + Math.floor(i / 3) * 330; bigToonFace(g, x, y, 90, { cast: OM_HERO, expr: n, clip: true, t: 1 }); text(g, n, x, y + 190, { size: 26, color: '#f4ecdc' }); });
  text(g, 'ORDINARY MIND', 400, 1000, { size: 56, color: '#f4ecdc' }); } });
