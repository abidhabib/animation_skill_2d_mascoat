// v06.js: shared sets and props for V06 "One Note A Day" (rooms, jar, day card, bed, chair) so every clip matches.
import { E, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { note, frameArt, shelfBoard, sideTable, rug, INK } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';
export { INK, note, frameArt, shelfBoard, sideTable, rug };

export const W = () => E.W, H = () => E.H;
export const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
export const hw = (g, s, x, y, size, color = '#33231c', stroke = 0) => text(g, s, x, y, { size, color, family: 'Caveat', weight: 700, stroke, strokeColor: '#0a1a22' });
export const at = (info, word, dflt, nth = 0) => { const w = E.words.filter((w) => w.start >= info.shot.start - 0.15 && w.start <= info.shot.end && w.word.toLowerCase().replace(/[^a-z]/g, '') === word)[nth]; return w ? w.start - info.shot.start : dflt; };
export const floor = (g, y, col, planks = true) => { g.fillStyle = col; g.fillRect(-W(), y, W() * 3, H()); seg(g, [[-W(), y], [W() * 2, y]], 8, INK); if (planks) for (let i = -2; i < 12; i++) seg(g, [[i * 200, y], [i * 200 - 90, H()]], 3, alpha(INK, 0.25)); };

// sunny morning bedroom
export function morning(g, t, o = {}) { const gr = g.createLinearGradient(0, 0, 0, H()); gr.addColorStop(0, '#ffdca8'); gr.addColorStop(0.8, '#fff0d4'); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); for (let x = -W(); x < W() * 2; x += 150) { g.fillStyle = 'rgba(232,150,90,.07)'; g.fillRect(x, -H(), 70, H() * 2); }
  if (o.window !== false) { box(g, 140, 130, 400, 400, '#8fd0f4', 18, 10); circle(g, 420, 240, 62, '#ffe27a'); glow(g, 420, 240, 420, '#fff6c8', 0.6); for (let i = 0; i < 2; i++) circle(g, 230 + ((t * 12 + i * 190) % 250), 390 - i * 100, 34, '#ffffff'); seg(g, [[340, 130], [340, 530]], 12, '#fff'); seg(g, [[140, 330], [540, 330]], 12, '#fff'); box(g, 100, 120, 70, 440, '#e8704a', 30); box(g, 510, 120, 70, 440, '#e8704a', 30); }
  if (o.frames !== false) { frameArt(g, 860, 280, 170, 210, 2); frameArt(g, 1070, 320, 130, 160, 0); }
  if (o.shelf !== false) { shelfBoard(g, 1590, 400, 420); D.bookStack(g, 1500, 400, 0.75, {}); D.plant(g, 1690, 400, 0.7, { kind: 'leafy', t }); }
  floor(g, H() * 0.87, '#c8905e'); }

// night version of the same room
export function nightRoom(g, t, o = {}) { const gr = g.createLinearGradient(0, 0, 0, H()); gr.addColorStop(0, '#0e2238'); gr.addColorStop(0.8, '#204a5c'); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); for (let x = -W(); x < W() * 2; x += 140) { g.fillStyle = 'rgba(255,255,255,.028)'; g.fillRect(x, -H(), 64, H() * 2); }
  box(g, 140, 130, 380, 400, '#0a1630', 14, 10); circle(g, 400, 240, 50, '#f2f0d6'); glow(g, 400, 240, 260, '#bfe4ff', 0.3); seg(g, [[330, 130], [330, 530]], 12, '#e9dcc4'); seg(g, [[140, 330], [520, 330]], 12, '#e9dcc4');
  frameArt(g, 820, 270, 160, 200, 1); shelfBoard(g, 1590, 400, 420); D.bookStack(g, 1500, 400, 0.75, {}); D.plant(g, 1690, 400, 0.7, { kind: 'leafy', t }); floor(g, H() * 0.87, '#4a2c24'); glow(g, 1500, 520, 520, '#ffb45a', 0.18 * (o.lamp ?? 1)); }

export function bed(g, x, y, sheet = '#e8704a', who) { box(g, x - 420, y - 360, 70, 360, '#8a5636', 28); box(g, x - 390, y - 180, 760, 120, '#f4efe6', 30); box(g, x - 350, y - 255, 200, 100, '#ffffff', 46); if (who) who(); box(g, x - 170, y - 195, 560, 175, sheet, 60); box(g, x - 410, y - 70, 820, 80, '#6a3f28', 20); for (const d of [-370, 340]) box(g, x + d, y, 40, 50, '#4a2a1a', 8); }

export function jar(g, x, y, s, n) { g.save(); g.translate(x, y); g.scale(s, s); for (let i = 0; i < n; i++) note(g, -105 + (i % 4) * 70 + (Math.floor(i / 4) % 2) * 14, -52 - Math.floor(i / 4) * 80, 0.24, { rot: ((i * 7) % 5 - 2) * 0.18 }); rr(g, -200, -400, 400, 400, 66); g.fillStyle = 'rgba(190,235,250,.24)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); box(g, -165, -445, 330, 56, 'rgba(190,235,250,.5)', 16); seg(g, [[-160, -330], [-160, -100]], 18, 'rgba(255,255,255,.8)'); g.restore(); }

export function dayCard(g, n, k, x = 1650, y = 220) { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(0.05); const s = ease.outBack(clamp(k)); g.scale(s, s); box(g, -130, -130, 260, 260, '#fffaf0', 22); box(g, -130, -130, 260, 70, '#e8643c', 22); text(g, 'DAY', 0, -93, { size: 44, color: '#fffaf0' }); text(g, String(n), 0, 40, { size: 150, color: INK }); g.restore(); }

// a table-top close-up backdrop with supporting objects
export function tableTop(g, t, a = '#17606a', b = '#0a2a32') { const gr = g.createLinearGradient(0, 0, 0, H()); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); glow(g, 960, 460, 760, '#ffd98a', 0.3); floor(g, 920, '#a8704a', false); D.plant(g, 270, 920, 1.35, { kind: 'leafy', t }); D.bookStack(g, 1650, 925, 1.2, {}); D.mug(g, 480, 930, 0.9, { t }); }

// pop-in scale helper
export const popIn = (g, x, y, k, rot, fn) => { if (k <= 0) return; g.save(); g.translate(x, y); g.rotate(rot); const s = ease.outBack(clamp(k)); g.scale(s, s); fn(); g.restore(); };

// the green folder tied with a shoelace; s = 1 is 460 x 340
export function folder(g, x, y, s = 1, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot ?? 0); g.scale(s, s); box(g, -230 + 14, -170 + 20, 460, 340, 'rgba(0,0,0,.3)', 18, 0); box(g, -210, -200, 170, 60, '#2f7a52', 16); box(g, -230, -170, 460, 340, '#3a9464', 18); seg(g, [[-190, -140], [-190, 140]], 6, '#2f7a52');
  if (o.lace !== false) { seg(g, [[-230, 20], [230, 20]], 16, INK); seg(g, [[-230, 20], [230, 20]], 8, '#f4e6c8'); for (const d of [-1, 1]) { g.strokeStyle = INK; g.lineWidth = 14; g.beginPath(); g.ellipse(d * 44, -8, 46, 24, d * -0.5, 0, 7); g.stroke(); g.strokeStyle = '#f4e6c8'; g.lineWidth = 7; g.stroke(); } circle(g, 0, 18, 18, '#f4e6c8'); seg(g, [[0, 20], [-50, 110]], 9, '#f4e6c8'); seg(g, [[0, 20], [60, 100]], 9, '#f4e6c8'); } g.restore(); }
// one page of the hero's drawings: kind 0 dragon, 1 portrait, 2 hand (bad 0..1 adds wrong fingers), 3 city
export function page(g, x, y, s, kind = 0, o = {}) { g.save(); g.translate(x, y); g.rotate(o.rot ?? 0); g.scale(s, s); box(g, -150 + 10, -200 + 14, 300, 400, 'rgba(0,0,0,.25)', 8, 0); box(g, -150, -200, 300, 400, '#fffaf0', 8);
  const L = (p, w = 7, c = '#33283a') => seg(g, p, w, c);
  if (kind === 0) { L([[-90, 90], [-40, 20], [20, 40], [70, -40], [40, -90], [90, -100]]); L([[-40, 20], [-90, -60], [-10, -30], [20, 40]]); for (let i = 0; i < 4; i++) L([[-60 + i * 35, 55], [-70 + i * 35, 120]]); circle(g, 66, -86, 8, INK); }
  if (kind === 1) { g.strokeStyle = '#33283a'; g.lineWidth = 7; g.beginPath(); g.ellipse(0, -30, 80, 100, 0, 0, 7); g.stroke(); circle(g, -28, -45, 9, INK); circle(g, 28, -45, 9, INK); L([[-30, 20], [0, 32], [32, 16]]); L([[-80, 150], [-40, 80], [40, 80], [80, 150]]); }
  if (kind === 2) { const n = 5 + (o.bad ?? 0); L([[-60, 130], [-65, 20]]); L([[60, 130], [55, 30]]); for (let i = 0; i < n; i++) { const a = -0.85 + (i / (n - 1)) * 1.7 + (o.bad ? Math.sin(i * 3) * 0.25 : 0), len = 130 + (i % 3) * 22; L([[a * 50, 30], [a * 120, 30 - len * Math.cos(a * 0.8)]], 22, '#33283a'); L([[a * 50, 30], [a * 120, 30 - len * Math.cos(a * 0.8)]], 10, '#fffaf0'); } }
  if (kind === 3) { for (let i = 0; i < 5; i++) { const h = 80 + ((i * 67) % 170); g.strokeStyle = '#33283a'; g.lineWidth = 6; g.strokeRect(-120 + i * 48, 120 - h, 40, h); } L([[-130, 125], [130, 125]]); circle(g, 80, -130, 30, '#ffd64a'); }
  g.restore(); }
// the tiny animation studio front with the paper sign and brass mail slot. o: { night, lights, rain }
export function studioFront(g, t, o = {}) { const gr = g.createLinearGradient(0, 0, 0, H()); const sk = o.grey ? ['#4a5a6c', '#8a98a6'] : ['#6ac0e8', '#e0f4ff']; gr.addColorStop(0, sk[0]); gr.addColorStop(0.8, sk[1]); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3);
  box(g, 380, 60, 1160, 860, o.grey ? '#8a5a52' : '#c8745a', 10); for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) seg(g, [[390 + c * 120 + (r % 2) * 60, 100 + r * 60], [450 + c * 120 + (r % 2) * 60, 100 + r * 60]], 4, alpha(INK, 0.18));
  box(g, 470, 110, 980, 130, '#2f5a6a', 24); text(g, 'TINY FRAME STUDIO', 960, 178, { size: 66, color: '#fff3d6' });
  const lit = o.lights !== false; box(g, 460, 330, 440, 380, lit ? '#ffe0a0' : '#2a3440', 16, 10); seg(g, [[680, 330], [680, 710]], 10, INK); if (lit) { glow(g, 680, 500, 380, '#ffd98a', 0.4); page(g, 570, 470, 0.4, 0, { rot: -0.06 }); page(g, 790, 520, 0.4, 3, { rot: 0.05 }); }
  box(g, 1020, 330, 340, 590, '#2f5a4a', 20, 10); box(g, 1070, 380, 240, 190, lit ? '#ffe0a0' : '#1f2a34', 12, 6); box(g, 1110, 760, 160, 40, '#e8b84a', 10, 6); box(g, 1130, 774, 120, 12, '#3a2a10', 5, 0); circle(g, 1315, 660, 16, '#e8b84a');
  g.fillStyle = o.grey ? '#5a6470' : '#b8a890'; g.fillRect(-W(), 920, W() * 3, H()); seg(g, [[-W(), 920], [W() * 2, 920]], 8, INK); D.plant(g, 1480, 920, 1.1, { kind: 'leafy', t }); seg(g, [[220, 920], [220, 380]], 18, INK); circle(g, 220, 370, 34, '#fff2b0'); }
// the paper sign on the door
export function paperSign(g, x, y, s = 1, faded = 0) { g.save(); g.translate(x, y); g.rotate(-0.03); g.scale(s, s); box(g, -230, -130, 460, 260, faded ? '#e8dcb0' : '#fffaf0', 10); for (const d of [-1, 1]) box(g, d * 200 - 40, -148, 80, 36, 'rgba(255,214,74,.8)', 6, 3); const c = faded ? '#6a5a4a' : '#2a1c16'; hw(g, 'We read every folder.', 0, -20, 56, c); hw(g, 'Bring it in person.', 0, 64, 56, c); g.restore(); }

// the clothes chair; alive 0..1 gives it eyes and teeth
export function chair(g, x, y, s, t, alive = 0, shirts = 0) { g.save(); g.translate(x, y); g.scale(s, s); box(g, -170, -520, 40, 520, '#8a5636', 18); box(g, 130, -300, 40, 300, '#8a5636', 18); box(g, -190, -320, 380, 56, '#a8704a', 18); const br = 1 + Math.sin(t * 3) * 0.025 * alive; g.save(); g.translate(0, -320); g.scale(br, br * (1 + alive * 0.12));
  const heap = [[-120, -50, 130, '#4a78b8'], [80, -60, 150, '#e8704a'], [-30, -150, 150, '#5ab0a0'], [90, -190, 100, '#d8d0c0'], [-90, -230, 100, '#8a5ac0'], [10, -270, 90, '#f2c14a']]; for (let i = 0; i < shirts; i++) heap.push([[160, -110, -180][i % 3], [-170, -330, -150][i % 3], 85, ['#c052a8', '#7ac04a', '#e0442c'][i % 3]]);
  for (const [dx, dy, r, c] of heap) { g.beginPath(); g.ellipse(dx, dy, r, r * 0.62, dx * 0.002, 0, 7); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); }
  box(g, -250, -40, 90, 200, '#4a78b8', 40); box(g, 175, -90, 80, 170, '#e8704a', 36);
  if (alive > 0) { for (const d of [-1, 1]) { circle(g, d * 62, -170, 40 * alive, '#fffdf6'); g.strokeStyle = INK; g.lineWidth = 7; g.beginPath(); g.arc(d * 62, -170, 40 * alive, 0, 7); g.stroke(); circle(g, d * 62 + Math.sin(t * 2) * 8, -166, 15 * alive, INK); }
    g.beginPath(); g.ellipse(0, -70, 90 * alive, (30 + Math.abs(Math.sin(t * 6)) * 22) * alive, 0, 0, 7); g.fillStyle = '#3a1418'; g.fill(); g.stroke(); for (let i = -2; i <= 2; i++) box(g, i * 30 - 10, -100 * alive - 2, 20, 24 * alive, '#fffaf0', 6, 3); } g.restore(); g.restore(); }
// rain streaks over the whole frame (or inside the current clip)
export function rain(g, t, n = 110, a = 0.4) { const r = rng(11); for (let i = 0; i < n; i++) { const x = r() * W() * 1.2, y = (r() * H() + t * 1500) % H(); seg(g, [[x, y], [x - 14, y + 52]], 3, alpha('#dff0ff', a)); } }
function radio(g, x, y, s, t, on) { g.save(); g.translate(x, y); g.scale(s, s); seg(g, [[60, -150], [150, -270]], 9, INK); box(g, -140, -160, 280, 160, '#a8503a', 30); circle(g, -62, -80, 48, '#3a2420'); for (let i = -2; i <= 2; i++) seg(g, [[-100, -80 + i * 16], [-24, -80 + i * 16]], 5, '#c8a070'); box(g, 20, -130, 94, 46, on ? '#ffe9a0' : '#c8bca0', 10, 5); circle(g, 44, -45, 20, '#e8dcc0'); circle(g, 96, -45, 20, '#e8dcc0'); if (on) for (let i = 0; i < 3; i++) { const p = (t * 0.8 + i / 3) % 1; text(g, '♪', -60 + i * 80, -200 - p * 160, { size: 70, color: alpha('#ffe27a', 1 - p) }); } g.restore(); }
export { radio };
// Dad's tiny repair shop: warm tungsten, rainy window, pegboard of tools, shelves of old things. counterY = where the counter top is.
export const SHOP_COUNTER = 770;
export function dadShop(g, t, o = {}) { const gr = g.createLinearGradient(0, 0, 0, H()); gr.addColorStop(0, '#4a2e22'); gr.addColorStop(1, '#7a4a30'); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3);
  for (let x = -200; x < 2200; x += 120) seg(g, [[x, -100], [x, 1100]], 4, alpha(INK, 0.22));
  box(g, 100, 150, 460, 420, '#2a3a52', 16, 12); g.save(); g.beginPath(); g.rect(106, 156, 448, 408); g.clip(); rain(g, t, 130, 0.55); circle(g, 420, 300, 90, alpha('#9fc0e0', 0.12)); g.restore(); seg(g, [[330, 150], [330, 570]], 12, '#c89a6a'); seg(g, [[100, 360], [560, 360]], 12, '#c89a6a');
  box(g, 690, 140, 560, 330, '#c89a6a', 16); for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) circle(g, 720 + i * 62, 170 + j * 68, 4, '#8a6240'); seg(g, [[770, 200], [770, 390]], 22, '#6a7078'); circle(g, 770, 200, 34, '#6a7078'); circle(g, 770, 200, 12, '#c89a6a'); seg(g, [[890, 210], [890, 300]], 14, '#c8ccd4'); box(g, 868, 300, 44, 110, '#e0642c', 16); box(g, 970, 210, 120, 56, '#6a7078', 12); box(g, 1018, 260, 24, 150, '#a8744a', 10); g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.arc(1170, 280, 50, 0, 7); g.stroke(); g.strokeStyle = '#3a3e48'; g.lineWidth = 8; g.stroke();
  for (let r = 0; r < 2; r++) { box(g, 1350, 270 + r * 210, 520, 24, '#8a5a38', 8); radio(g, 1480, 270 + r * 210, 0.6, t, false); D.alarmClock(g, 1650, 270 + r * 210, 0.6, { t }); D.bookStack(g, 1790, 270 + r * 210, 0.55, {}); }
  seg(g, [[960, -20], [960, 70]], 8, INK); poly(g, [[890, 110], [1030, 110], [1000, 60], [920, 60]]); glow(g, 960, 130, 760, '#ffc870', 0.42 * (o.lamp ?? 1)); g.fillStyle = '#3a2418'; g.fillRect(-W(), 900, W() * 3, H()); }
const poly = (g, p) => { g.beginPath(); p.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); g.fillStyle = '#e8b04a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); };
// counter drawn AFTER the people standing behind it
export function shopCounter(g, t) { box(g, -60, SHOP_COUNTER, 2040, 60, '#b87a4a', 14); box(g, -60, SHOP_COUNTER + 55, 2040, 400, '#8a5636', 6); for (let x = 100; x < 1900; x += 360) box(g, x, SHOP_COUNTER + 110, 290, 170, '#7a4a2e', 14); }
