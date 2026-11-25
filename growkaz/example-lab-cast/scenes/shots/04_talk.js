// mouth shapes while talking (QC)
import { E, registerShot, text } from '/engine/core.js';
import { bigToonFace, HERO, DAD } from '/engine/toon2d.js';
const P = ['rest', 'A', 'E', 'O', 'U', 'M'];
registerShot('P1', { draw(g) { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H); [HERO, DAD].forEach((c, r) => P.forEach((p, i) => { bigToonFace(g, 180 + i * 310, 250 + r * 480, 120, { cast: c, expr: 'friendly', phoneme: p, clip: true }); text(g, p, 180 + i * 310, 490 + r * 480, { size: 30, color: '#1b1424' }); })); } });
registerShot('P2', { draw(g) { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H); ['shocked', 'laugh', 'surprised', 'furious', 'crying', 'sleepy'].forEach((n, i) => { bigToonFace(g, 180 + i * 310, 330, 120, { cast: HERO, expr: n, clip: true }); text(g, n, 180 + i * 310, 580, { size: 30, color: '#1b1424' }); bigToonFace(g, 180 + i * 310, 810, 120, { cast: DAD, expr: n, clip: true }); }); } });
