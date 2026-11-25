// meme face comparison for the hero
import { E, registerShot, text, rr } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
const EX = ['neutral', 'friendly', 'shocked', 'deadpan', 'angry', 'crying', 'smugAside', 'laugh'];
const V = [['CURRENT', 'lead'], ['A  MOOCH', 'lead_mooch'], ['B  POP-BROW', 'lead_popbrow'], ['C  GAP-TOOTH', 'lead_gaptooth']];
const cast = (id) => ({ ...HERO, c19: [id, 'original'] });
registerShot('F1', { draw(g) { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H);
  V.forEach(([n, id], r) => { const y = 130 + r * 262; text(g, n, 130, y, { size: 28, color: '#1b1424' }); EX.forEach((ex, i) => { bigToonFace(g, 350 + i * 208, y, 72, { cast: cast(id), expr: ex, clip: true }); if (r === 3) text(g, ex, 350 + i * 208, y + 150, { size: 22, color: '#1b1424' }); }); }); } });
V.slice(1).forEach(([n, id], k) => registerShot('F' + (k + 2), { draw(g) { g.fillStyle = ['#ffd45a', '#8fd0ff', '#c9b6f0'][k]; g.fillRect(0, 0, E.W, E.H);
  bigToonFace(g, 480, 440, 270, { cast: cast(id), expr: ['mockShock', 'shocked', 'smugAside'][k] });
  ['deadpan', 'angry', 'laugh'].forEach((ex, i) => bigToonFace(g, 1060 + (i % 2) * 400, 240 + Math.floor(i / 2) * 430, 120, { cast: cast(id), expr: ex, clip: true }));
  drawToon(g, { x: 1740, y: 1050, s: 1.4, cast: cast(id), action: 'shrug', t: 1, expr: 'confused' }); rr(g, 40, 960, 520, 90, 30); g.fillStyle = '#1b1424'; g.fill(); text(g, n, 300, 1005, { size: 50, color: '#ffffff' }); } }));
