// lab-cast: QC gallery of the Character 19 cast in our engine (cast, emotions, actions, close-ups, old-pose compatibility).
import { E, registerShot, text } from '/engine/core.js';
import { POSES, walkPose, breathe } from '/engine/rig2d.js';
import { drawToon, bigToonFace, HERO, SAM, DAD, MOM, ROOMMATE, STRANGER, CASHIER, KID, YOUNG_DAD, SHOPPER, ACTIONS, EMOTION_NAMES } from '/engine/toon2d.js';
const bg = (g) => { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H); };
const L = (g, s, x, y, n = 22) => text(g, s, x, y, { size: n, color: '#1b1424' });
const CAST = { HERO, SAM, DAD, MOM, ROOMMATE, STRANGER, CASHIER, KID, YOUNG_DAD, 'SHOPPER 2': SHOPPER(2) };
registerShot('C1', { draw(g) { bg(g); Object.entries(CAST).forEach(([n, c], i) => { const x = 200 + (i % 5) * 380, y = 460 + Math.floor(i / 5) * 500; drawToon(g, { x, y, s: 1.45, cast: c, pose: POSES.stand, expr: 'smile', t: 1 }); L(g, n, x, y + 45, 28); }); } });
registerShot('C2', { draw(g) { bg(g); ACTIONS.forEach((a, i) => { const x = 100 + (i % 11) * 172, y = 245 + Math.floor(i / 11) * 265; drawToon(g, { x, y, s: 0.68, cast: HERO, action: a, t: a === 'jump' ? 0.9 : 1.1, expr: 'friendly' }); L(g, a, x, y + 22, 18); }); } });
registerShot('C3', { draw(g) { bg(g); EMOTION_NAMES.forEach((n, i) => { const x = 100 + (i % 10) * 191, y = 120 + Math.floor(i / 10) * 205; bigToonFace(g, x, y, 58, { cast: HERO, expr: n, clip: true }); L(g, n, x, y + 118, 18); }); } });
const OLD = ['stand', 'relaxed', 'talk', 'explain', 'point', 'wave', 'cheer', 'crossArms', 'think', 'shrug', 'holdFront', 'phone', 'reach', 'sad', 'facepalm', 'crouch', 'sit', 'kneel', 'jump', 'handsOnHead'];
registerShot('C4', { draw(g) { bg(g); OLD.forEach((n, i) => { const x = 130 + (i % 7) * 275, y = 300 + Math.floor(i / 7) * 345; if (POSES[n]) drawToon(g, { x, y, s: 0.95, cast: i % 2 ? SAM : HERO, pose: breathe(POSES[n], 1), prop: n === 'phone' ? 'phone' : null }); L(g, n, x, y + 28); });
  drawToon(g, { x: 1780, y: 990, s: 0.95, cast: DAD, pose: walkPose(2), facing: -1 }); L(g, 'walkPose', 1780, 1018); } });
registerShot('C5', { draw(g) { bg(g); [HERO, SAM, DAD, MOM].forEach((c, i) => bigToonFace(g, 260 + i * 460, 360, 190, { cast: c, expr: ['shocked', 'laugh', 'sad', 'friendly'][i] }));
  drawToon(g, { x: 500, y: 1050, s: 1.2, cast: HERO, action: 'talk', t: 1, facing: 1, expr: 'teasing' }); drawToon(g, { x: 900, y: 1050, s: 1.2, cast: SAM, action: 'wave', t: 1, facing: -1, expr: 'joy' }); drawToon(g, { x: 1350, y: 1050, s: 1.2, cast: DAD, action: 'sit', t: 1, facing: -1, alpha: 0.7 }); } });
