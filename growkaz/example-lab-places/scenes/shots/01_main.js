// gallery of places x looks (9:16)
import { E, registerShot, text, rr } from '/engine/core.js';
import { place, fg, floorY, PLACES } from '/engine/places.js';
import { drawToon, HERO, DAD, MIA, SAM } from '/engine/toon2d.js';
const SETS = [['street', 'noon', 'idle', 'point'], ['classroom', 'mint', 'idle', 'explain'], ['busNight', 'neon', 'idle', 'wave'], ['supermarket', 'noon', 'carry', 'idle'], ['rooftop', 'sunset', 'idle', 'shrug'], ['street', 'rain', 'idle', 'celebrate'], ['rooftop', 'neon', 'think', 'thumbsUp'], ['street', 'snow', 'crossArms', 'handsHips']];
SETS.forEach(([n, look, a, b], i) => registerShot('G' + (i + 1), { draw(g, t) { place(g, n, 1.3, { look }); const y = floorY(n) + 14;
  drawToon(g, { x: E.W * 0.32, y, s: 2.2, cast: HERO, action: a, t: 1.2, facing: 1, yaw: 0.45, expr: 'friendly' }); drawToon(g, { x: E.W * 0.68, y, s: 2.25, cast: [DAD, MIA, SAM][i % 3], action: b, t: 1.2, facing: -1, yaw: 0.45, expr: 'happy' });
  fg(g, n, 1.3, { look }); rr(g, 60, E.H - 150, E.W - 120, 96, 40); g.fillStyle = 'rgba(10,6,28,.8)'; g.fill(); text(g, n + ' / ' + look + ' : ' + a + ', ' + b, E.W / 2, E.H - 102, { size: 40, color: '#ffffff' }); } }));
