// strip of in-between frames: action timeline (row 1, 2) and old posesAt (row 3)
import { E, registerShot, text } from '/engine/core.js';
import { posesAt } from '/engine/rig2d.js';
import { drawToon, HERO, SAM } from '/engine/toon2d.js';
registerShot('M1', { draw(g) { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H);
  [[['idle', 'wave'], 300], [['wave', 'celebrate'], 650]].forEach(([[a, b], y]) => { for (let i = 0; i < 9; i++) { const t = 2 + i * 0.07; drawToon(g, { x: 130 + i * 207, y, s: 1.0, cast: HERO, actions: [[0, a], [2, b]], t, expr: 'friendly' }); } text(g, a + ' > ' + b, 150, y + 30, { size: 22, color: '#1b1424' }); });
  for (let i = 0; i < 9; i++) drawToon(g, { x: 130 + i * 207, y: 1010, s: 1.0, cast: SAM, pose: posesAt(1 + i * 0.065, [[0, 'relaxed'], [1, 'explain']]), expr: 'happy' }); text(g, 'old posesAt', 150, 1040, { size: 22, color: '#1b1424' }); } });
