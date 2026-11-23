// V03 Clip 6 "the long hold": rich version. 2001 crash floor, the 2002 statement, SELL/HOLD doors, comments, the 2010 HQ, life passing on the bench.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, HERO, SAM, ROOMMATE, DAD, MOM, KID, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { cam3, pin } from '/engine/three-toon.js';
import { office2000 } from '/engine/sets3d/office2000.js';
import { park3d } from '/engine/sets3d/park3d.js';
import { bike } from '/engine/sets/park.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, Y2K, greyed, zoomed, pop, money, backdrop, box } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM];
const initC = (T) => { const o = office2000(T, { time: 'evening', crash: true }); Object.assign(o.st, { spots: o.spots, upd: o.update }); return o.st; };
const initP = (T) => { const p = park3d(T, { time: 'day' }); p.st.spots = p.spots; return p.st; };

// f01 "One year after the peak, Cisco was down about eighty percent."  the 2001 floor: red screens, half the desks empty, people carry boxes out
registerShot('f01', { kind: '3d', init: initC,
  draw(st, t, info) { st.upd(t); cam3(st, t, info.dur, { from: { pos: [3.2, 2.4, 5.0], look: [0.0, 1.0, -1.0], fov: 46 }, to: { pos: [1.6, 1.5, 4.0], look: [-0.6, 1.1, -1.2], fov: 42 } }); },
  overlay(g, t, info, st) { const S = st.spots.deskSeats;
    [[S[1], 'sad', 'sit'], [S[6], 'worried', 'facepalm'], [S[4], 'sad', 'sit']].forEach(([p, ex, ps], i) => { const q = pin(st, p, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: i % 2 ? -1 : 1, cast: CROWD[i + 2], pose: breathe(POSES[ps], t + i), expr: ex, blink: blink(t + i), rim: RIM }); });
    [[-4.2, 0.4, 0], [-3.0, -1.1, 1]].forEach(([x0, z, i]) => { const x = x0 + t * 0.55, q = pin(st, [x, 0, z], 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: CROWD[i * 3], pose: walkPose(t * 5 + i), expr: 'sad', blink: blink(t), rim: RIM }); box(g, q.x + 40 * q.s, q.y - 150 * q.s, 0.9 * q.s, { label: '' }); });
    const k = pop(t, 2.8, 0.35); if (k > 0) { g.save(); g.translate(E.W * 0.75, E.H * 0.2); g.scale(k, k); money(g, 0, 0, '-80%', t, -1, RED, 130); g.restore(); text(g, 'MARCH 2001', E.W * 0.75, E.H * 0.31, { size: 36, color: '#ffffff', stroke: 6, strokeColor: INK }); } } });

// f02 "By October two thousand and two, your ten thousand dollars was worth around one thousand one hundred."  kitchen table: the envelope opens, the statement slides out, the total gets circled
registerShot('f02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.22, x0: 0, x1: -160, y0: 0, y1: -150 });
  zoomed(g, c, () => { const wood = g.createLinearGradient(0, 0, E.W, E.H); wood.addColorStop(0, '#9a6a48'); wood.addColorStop(1, '#6a4430'); g.fillStyle = wood; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 18; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.03)'; g.fillRect(-E.W, i * 70 - 100, E.W * 3, 34); }
    FX.pool(g, E.W * 0.6, E.H * 0.3, 900, 500, '#ffe8c0', 0.2);
    D.mug(g, E.W * 0.12, E.H * 0.5, 1.4, { color: '#4a78b8', t }); D.key(g, E.W * 0.88, E.H * 0.86, 0.8, { rot: 0.4 }); D.calendar(g, E.W * 0.86, E.H * 0.2, 0.9, { month: 'OCT', day: 9 }); text(g, '2002', E.W * 0.86, E.H * 0.33, { size: 34, color: '#ffffff', stroke: 6, strokeColor: INK });
    const ek = ease.out(prog(t, 0.2, 0.9)); g.save(); g.translate(E.W * 0.38, E.H * 0.78); g.rotate(-0.08); g.scale(1.6, 1.6); D.envelope(g, 0, 0, 1, { open: ek }); g.restore();
    const sk = ease.inOut(prog(t, 0.6, 2.0)); FP.statement(g, lerp(E.W * 0.38, E.W * 0.52, sk), lerp(E.H * 0.95, E.H * 0.5, sk), 0.95, { rot: lerp(-0.08, 0.03, sk), circle: ease.inOut(prog(t, 4.1, 4.9)), total: t > 3.4 ? '$1,070.00' : '$10,000.00', rows: [['Symbol', 'Shares', 'Cost', 'Value'], ['CSCO', '125', '$10,000', t > 3.4 ? '$1,070' : '$10,000']] }); }); } });

// f03 "So, be honest. At one thousand one hundred dollars, would you have sold, or held on?"  a hallway with two lit doors; people choose; 2000-you stands between them
registerShot('f03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.07, y0: -20, y1: 10 });
  zoomed(g, c, () => { const gr = g.createLinearGradient(0, 0, 0, E.H); gr.addColorStop(0, '#3a3450'); gr.addColorStop(1, '#1e1a2e'); g.fillStyle = gr; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    g.fillStyle = '#2a2438'; g.beginPath(); g.moveTo(-E.W, E.H * 0.78); g.lineTo(E.W * 2, E.H * 0.78); g.lineTo(E.W * 2, E.H * 2); g.lineTo(-E.W, E.H * 2); g.fill(); for (let i = -10; i < 20; i++) seg(g, [[E.W / 2 + i * 40, E.H * 0.78], [E.W / 2 + i * 220, E.H * 1.2]], 2, 'rgba(255,255,255,.05)');
    for (let i = 0; i < 4; i++) { const lx = E.W * (0.15 + i * 0.23); seg(g, [[lx, 0], [lx, 60]], 4, '#555'); circle(g, lx, 70, 18, '#fff2c8'); glow(g, lx, 70, 160, '#fff2c8', 0.25); }
    const open = ease.inOut(prog(t, 0.3, 1.0)); FP.door(g, E.W * 0.27, E.H * 0.8, 1.0, 'SELL', open, { color: '#8a3a2a', light: '#ffd0c0', plate: '#e0302a', plateText: '#ffffff' }); FP.door(g, E.W * 0.73, E.H * 0.8, 1.0, 'HOLD', open, { color: '#2a4a8a', light: '#c8e0ff', plate: '#2f6ae0', plateText: '#ffffff' });
    [[SHOPPER(0), 0.2, -1], [SAM, 0.9, 1], [SHOPPER(2), 1.6, -1], [DAD, 2.3, 1]].forEach(([cast, d, dir], i) => { const p = ease.inOut(prog(t, d, d + 1.6)); if (p <= 0 || p >= 1) return; const tx = dir < 0 ? E.W * 0.27 : E.W * 0.73, x = lerp(E.W / 2 + dir * 60, tx, p), s = lerp(1.0, 0.7, p);
      g.save(); g.globalAlpha = 1 - prog(p, 0.85, 1); drawToon(g, { x, y: lerp(E.H * 0.97, E.H * 0.8, p), s, facing: dir, cast, pose: walkPose(t * 6 + i), expr: 'neutral', blink: blink(t + i), rim: RIM }); g.restore(); });
    drawToon(g, { x: E.W / 2, y: E.H * 0.98, s: 1.5, facing: t > 3.4 && t < 4.0 ? -1 : 1, cast: Y2K, pose: breathe(posesAt(t, [[0, 'stand'], [1.0, 'think'], [3.3, 'shrug']]), t), expr: t > 3.3 ? 'confused' : 'thinking', look: [t > 3.38 && t < 4.0 ? -0.7 : 0.7, -0.2], blink: blink(t), rim: RIM });
    money(g, E.W / 2, E.H * 0.16, '$1,070', t, 0.3, RED, 90); }); } });

// f04 "Tell me in the comments. Because holding meant this."  a phone in hand on a desk at night; comment cards slide in
registerShot('f04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08 });
  zoomed(g, c, () => { backdrop(g, '#14182a', '#080a14', t, { bokeh: ['#ffd08a', '#5ab4ff', '#ff6a8a'] }); FX.pool(g, E.W * 0.5, E.H * 0.6, 900, 400, '#5ab4ff', 0.12);
    D.laptop(g, E.W * 0.17, E.H * 0.95, 1.3, { on: true }); D.mug(g, E.W * 0.86, E.H * 0.95, 1.3, { color: '#e0562f', t }); D.plant(g, E.W * 0.95, E.H * 0.95, 1.1, { kind: 'round', t });
    FP.phone(g, E.W * 0.5, E.H * 0.56, 1.1, (g2, x, y, w, h) => { text(g2, 'Comments', x + 30, y + 90, { size: 26, color: '#ffffff', stroke: 0, align: 'left' }); text(g2, '1,284', x + w - 40, y + 90, { size: 22, color: '#8a90a0', stroke: 0, align: 'right' });
      const cm = [[0.3, '@sam_invests', 'Sold at $1,070. Regret it.', SAM, '#4fb286'], [0.6, '@grandpa_dale', 'Held. Waited 25 years.', DAD, '#6b7f5a'], [0.9, '@priya.m', 'Would have bought more.', MOM, '#c96f8a'], [1.2, '@j.ro', 'Honestly? Panic sold.', ROOMMATE, '#e0743a']];
      cm.forEach(([t0, n, tx, cast, col], i) => { const k = ease.out(prog(t, t0, t0 + 0.3)); if (k <= 0) return; g2.save(); g2.globalAlpha = k; g2.translate(30 * (1 - k), 0); FP.commentCard(g2, x + 10, y + 130 + i * 160, w - 20, { name: n, text: tx, cast, color: col, ago: ['2m', '5m', '11m', '1h'][i], likes: ['842', '2.1K', '311', '97'][i] }); g2.restore(); }); });
    const out = ease.in(prog(t, 2.4, 3.1)); if (out > 0) veil(g, '#ffffff', out * 0.8); }); } });

// f05 "Cisco didn't go bankrupt. By twenty ten, its sales had more than doubled."  a busy tech campus at day; a glass revenue card grows 18.9B -> 40.0B
registerShot('f05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.06, z1: 1.0, x0: -80, x1: 40 });
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#7ab8f0'); sky.addColorStop(1, '#e8f2fa'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.clouds(g, { y: E.H * 0.15, count: 6, color: '#ffffff', a: 0.5 });
    FX.skyline(g, { y: E.H * 0.7, color: '#a8c0d8' });
    for (const [x, w, h, col] of [[E.W * 0.08, 360, 420, '#d8e4f0'], [E.W * 0.36, 560, 560, '#c8dcec'], [E.W * 0.7, 420, 470, '#d0e0ee']]) { rr(g, x, E.H * 0.8 - h, w, h, 10); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
      for (let r = 0; r < Math.floor(h / 70); r++) for (let k = 0; k < Math.floor(w / 70); k++) { rr(g, x + 20 + k * 68, E.H * 0.8 - h + 24 + r * 66, 48, 44, 4); g.fillStyle = (r + k) % 4 ? '#8ab8e0' : '#ffe8a8'; g.fill(); } }
    g.fillStyle = '#8ac068'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H); g.fillStyle = '#c8c0b0'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, 60);
    for (let i = 0; i < 7; i++) { const x = ((i * 290 + t * (i % 2 ? 90 : -80)) % (E.W + 300)) - 150; drawToon(g, { x, y: E.H * 0.93, s: 0.62, facing: i % 2 ? 1 : -1, cast: CROWD[i % CROWD.length], pose: walkPose(t * 6 + i), expr: 'smile', blink: blink(t + i) }); }
    D.plant(g, E.W * 0.04, E.H * 0.88, 1.3, { kind: 'tall', t }); D.car(g, E.W * 0.9, E.H * 0.92, 0.7, { spin: t * 3 });
    const gk = ease.out(prog(t, 0.6, 1.1)); if (gk > 0) { g.save(); g.globalAlpha = gk; const gx = E.W * 0.57, gy = E.H * 0.1; FP.glass(g, gx, gy, 640, 330); text(g, 'CISCO ANNUAL SALES', gx + 40, gy + 50, { size: 26, color: '#a8b0c0', stroke: 0, align: 'left' });
      const k = ease.outBack(prog(t, 1.1, 3.7)); [['FY2000', 18.9, '#8a90a0'], ['FY2010', 40.0, '#2fd67a']].forEach(([lab, v, col], i) => { const bw = 520 * (v / 40) * (i ? k : 1); rr(g, gx + 40, gy + 100 + i * 100, Math.max(10, bw), 64, 14); g.fillStyle = col; g.fill();
        text(g, lab, gx + 60, gy + 132 + i * 100, { size: 24, color: '#0b0f18', stroke: 0, align: 'left' }); text(g, '$' + (i ? (18.9 + (40 - 18.9) * k).toFixed(1) : v.toFixed(1)) + 'B', gx + 40 + Math.max(10, bw) - 20, gy + 132 + i * 100, { size: 28, color: '#0b0f18', stroke: 0, align: 'right' }); }); g.restore(); } }); } });

// f06 "The business won. And you still waited almost twenty-six years to get back to ten thousand dollars."
//   the park: life passes by (a jogger, a kid on a bike, a couple, a dog walker); 2000-you on the bench goes grey; the years tick; $10,000 returns
registerShot('f06', { kind: '3d', init: initP,
  draw(st, t, info) { const b = st.spots.bench; cam3(st, t, info.dur, { from: { pos: [b[0] - 2.2, 1.4, b[2] + 4.8], look: [b[0], 1.0, b[2]], fov: 40 }, to: { pos: [b[0] + 1.4, 1.3, b[2] + 3.6], look: [b[0], 1.0, b[2]], fov: 37 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0.6, 4.9), yr = Math.round(lerp(2002, 2025, ease.inOut(k))), b = st.spots.bench;
    const q = pin(st, [b[0], 0, b[2] + 0.15], 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: greyed(Y2K, ease.inOut(k)), pose: breathe(POSES.sit, t), expr: t > 5.0 ? 'tired' : 'neutral', blink: blink(t), rim: RIM, look: [0.3, -0.1] });
    const passers = [[SAM, 0.0, 0.9, 1, true], [MOM, 0.8, 1.3, -1, false], [STRANGER, 1.8, 1.0, 1, false], [ROOMMATE, 2.9, 1.2, -1, true], [DAD, 3.8, 0.9, 1, false]];
    passers.forEach(([cast, d, z, dir, run], i) => { const p = prog(t, d, d + (run ? 1.6 : 2.6)); if (p <= 0 || p >= 1) return; const x = lerp(-dir * 5.5, dir * 5.5, p), qq = pin(st, [x, 0, z], 1.7); drawToon(g, { x: qq.x, y: qq.y, s: qq.s, facing: dir, cast: i === 4 ? greyed(cast, 1) : cast, pose: walkPose(t * (run ? 10 : 6) + i, { run }), expr: 'smile', blink: blink(t + i), rim: RIM }); });
    const kb = prog(t, 2.2, 3.6); if (kb > 0 && kb < 1) { const qb = pin(st, [lerp(5.5, -5.5, kb), 0, 1.6], 1.7); bike(g, qb.x, qb.y, qb.s * 0.95, { spin: -t * 9 }); drawToon(g, { x: qb.x - 6 * qb.s, y: qb.y - 70 * qb.s, s: qb.s * 0.62, facing: -1, cast: KID, pose: breathe(POSES.sit, t), expr: 'joy', blink: blink(t), rim: RIM }); }
    g.save(); g.translate(E.W - 230, 190); D.calendar(g, 0, 0, 1.0, { month: 'YEAR', day: String(yr).slice(2), color: '#4a78b8' }); g.restore(); text(g, String(yr), E.W - 230, 345, { size: 50, color: '#ffffff', stroke: 7, strokeColor: INK });
    money(g, q.x, q.y - 262 * q.s, '$10,000', t, 5.0, GREEN, Math.max(40, 50 * q.s)); } });
