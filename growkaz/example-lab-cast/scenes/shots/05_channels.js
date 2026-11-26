// the two channel heroes side by side
import { E, registerShot, text } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, OM_HERO } from '/engine/toon2d.js';
registerShot('H1', { draw(g) { [[HERO, 0, '#ffd45a', 'THINKLE SHOW'], [OM_HERO, 1, '#1c2640', 'ORDINARY MIND']].forEach(([c, i, bg, n]) => { const x = i * 960; g.fillStyle = bg; g.fillRect(x, 0, 961, E.H);
  bigToonFace(g, x + 330, 420, 170, { cast: c, expr: i ? 'confident' : 'excited', clip: true }); drawToon(g, { x: x + 720, y: 920, s: 2.3, cast: c, action: 'idle', t: 1, expr: i ? 'focused' : 'friendly' });
  text(g, n, x + 480, 1000, { size: 56, color: i ? '#f4ecdc' : '#1b1424' }); }); } });
