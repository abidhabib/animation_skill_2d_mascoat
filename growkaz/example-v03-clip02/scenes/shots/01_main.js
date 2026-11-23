// V03 Clip 2 "the deal": the 26-year wait on a park bench, "are you the next Cisco holder?", the two yous side by side, three promises.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { cam3, pin } from '/engine/three-toon.js';
import { park3d } from '/engine/sets3d/park3d.js';
import { D } from '/engine/props2d.js';
import { GREEN, RED, GOLD, INK, Y2K, greyed, zoomed, pop, money, backdrop, faceShot, badge } from '/engine/finfx.js';

const RIMW = { color: '#ffd2a0', dir: [0.7, -0.7], w: 3.5 };
const initP = (T) => { const p = park3d(T, { time: 'sunrise' }); p.st.spots = p.spots; return p.st; };

// a01 "That you waited almost twenty-six years just to see ten thousand dollars again."  park bench: the years tick 2000 -> 2025, his hair goes grey; $10,000 comes back
registerShot('a01', { kind: '3d', init: initP,
  draw(st, t, info) { const b = st.spots.bench; cam3(st, t, info.dur, { from: { pos: [b[0] + 1.2, 1.3, b[2] + 4.2], look: [b[0], 1.0, b[2]], fov: 38 }, to: { pos: [b[0] + 0.6, 1.2, b[2] + 3.1], look: [b[0], 1.0, b[2]], fov: 36 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0.3, 3.6), yr = Math.round(lerp(2000, 2025, ease.inOut(k)));
    const q = pin(st, [st.spots.bench[0], 0, st.spots.bench[2] + 0.15], 1.7);
    drawToon(g, { x: q.x, y: q.y, s: q.s, facing: 1, cast: greyed(Y2K, ease.inOut(k)), pose: breathe(POSES.sit, t), expr: t > 3.8 ? 'tired' : 'neutral', blink: blink(t), rim: RIMW, look: [0.2, -0.2] });
    g.save(); g.translate(E.W - 280, 200); D.calendar(g, 0, 0, 1.1, { month: 'YEAR', day: String(yr).slice(2), color: '#4a78b8' }); g.restore(); text(g, String(yr), E.W - 280, 370, { size: 56, color: '#ffffff', stroke: 7, strokeColor: INK });
    money(g, q.x, q.y - 262 * q.s, '$10,000', t, 3.8, GREEN, Math.max(40, 50 * q.s)); } });

// a02 "So, are you about to become the next Cisco holder?"  2026-you, giant worried face; a big ? pops
registerShot('a02', { draw(g, t, info) { faceShot(g, t, info, HERO, '#9fc8ff', null, ['#1a2240', '#0a0d1c', ['#ffd08a', '#a0e0ff']], { dx: -160, expr: (t) => t < 0.4 ? 'neutral' : 'worried', look: [0.35, 0],
  extra: (g, t) => { const k = pop(t, 0.25, 0.4); if (k > 0) { g.save(); g.translate(E.W * 0.72, E.H * 0.38); g.rotate(Math.sin(t * 3) * 0.08); g.scale(1.4 * k, 1.4 * k); D.mark(g, 0, 0, 1, { ch: '?' }); g.restore(); } } }); } });

// a03 "And if you are, how many years would you wait?"  you, small, under a giant clock spinning ever faster; "? YEARS" glows
registerShot('a03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.08, z1: 1.0, y0: -30, y1: 0 });
  zoomed(g, c, () => { backdrop(g, '#2a2040', '#120e22', t, { bokeh: ['#c0a0ff', '#ffd08a'] }); g.fillStyle = '#1a1430'; g.fillRect(-E.W, E.H * 0.88, E.W * 3, E.H);
    const sp = t * t * 2.2; g.save(); g.translate(E.W / 2, E.H * 0.38); g.scale(2.4, 2.4); D.clock(g, 0, 0, 1, { h: (12 + sp * 2) % 12, m: (sp * 60 * 4) % 60, rim: '#a08aff' }); g.restore(); glow(g, E.W / 2, E.H * 0.38, 400, '#a08aff', 0.2);
    drawToon(g, { x: E.W * 0.2, y: E.H * 0.95, s: 1.7, facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'stand'], [1.2, 'think']]), t), expr: t > 1.2 ? 'thinking' : 'worried', look: [0.6, -0.6], blink: blink(t), rim: RIMW });
    const k = pop(t, 1.9, 0.45); if (k > 0) { g.save(); g.translate(E.W * 0.76, E.H * 0.78); g.scale(k, k); money(g, 0, 0, '? YEARS', t, -1, GOLD, 92); g.restore(); } }); } });

// two side-by-side panels: 2000 (green CRT light) | 2026 (blue laptop light). k = slide-in 0..1
function split(g, t, k, drawL, drawR) { const w = E.W / 2, off = (1 - ease.out(k)) * w;
  g.save(); g.beginPath(); g.rect(-off, 0, w, E.H); g.clip(); g.translate(-off, 0); backdrop(g, '#26402e', '#0c1a10', t, { bokeh: ['#8affb0', '#ffe2b0'] }); glow(g, w / 2, E.H, 700, '#5aff8a', 0.35); drawL(g, w / 2); text(g, '2000', w / 2, 140, { size: 70, color: '#ffffff', stroke: 8, strokeColor: INK }); g.restore();
  g.save(); g.beginPath(); g.rect(w + off, 0, w, E.H); g.clip(); g.translate(w + off, 0); backdrop(g, '#1a2240', '#0a0d1c', t, { bokeh: ['#a0e0ff', '#ffd08a'] }); glow(g, w / 2, E.H, 700, '#9fc8ff', 0.35); drawR(g, w / 2); text(g, '2026', w / 2, 140, { size: 70, color: '#ffffff', stroke: 8, strokeColor: INK }); g.restore();
  seg(g, [[w, 0], [w, E.H]], 10, INK); seg(g, [[w, 0], [w, E.H]], 4, '#ffffff'); }
// a04 "Here's the deal. Two versions of you."  the split slides in: 2000-you | 2026-you, both faces
registerShot('a04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.04 }); zoomed(g, c, () => {
  split(g, t, prog(t, 0, 0.6), (g, cx) => bigToonFace(g, cx, E.H * 0.6, 200, { cast: Y2K, expr: t > 1.1 ? 'smile' : 'neutral', blink: blink(t), look: [0.3, 0] }),
    (g, cx) => bigToonFace(g, cx, E.H * 0.6, 200, { cast: HERO, expr: t > 1.1 ? 'smile' : 'neutral', blink: blink(t + 1.3), look: [-0.3, 0] })); }); } });

// a05 "Same ten thousand dollars, same reason, same kind of company, twenty-six years apart."  full bodies; a green tick pops on each 'same'; a 26 YEARS arrow joins them
registerShot('a05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }); zoomed(g, c, () => {
  const body = (cast, cx, t0) => { drawToon(g, { x: cx, y: E.H * 1.0, s: 1.75, facing: cast === Y2K ? 1 : -1, cast, pose: breathe(posesAt(t, [[0, 'stand'], [0.4, 'explain']]), t), expr: 'smile', blink: blink(t + t0), rim: RIMW });
    const k = pop(t, 0.4, 0.3); if (k > 0) { g.save(); g.translate(cx + (cast === Y2K ? 170 : -170), E.H * 0.6); g.rotate(cast === Y2K ? 0.2 : -0.2); g.scale(0.7 * k, 0.7 * k); D.cash(g, 0, 0, 1, { text: '' }); g.restore(); }
    money(g, cx, E.H * 0.23, '$10,000', t, 0.15, GREEN, 70); };
  split(g, t, 1, (g, cx) => body(Y2K, cx, 0), (g, cx) => body(HERO, cx, 1));
  [[1.2, 'MONEY'], [1.8, 'REASON'], [2.93, 'COMPANY']].forEach(([t0, lbl], i) => { const k = pop(t, t0, 0.3); if (k <= 0) return; const y = E.H * 0.36 + i * 150; g.save(); g.translate(E.W / 2, y); g.scale(0.75 * k, 0.75 * k); D.tick(g, 0, 0, 1, {}); g.restore();
    text(g, lbl, E.W / 2, y + 78, { size: 30, color: '#ffffff', stroke: 6, strokeColor: INK }); });
  const ak = ease.inOut(prog(t, 3.5, 4.2)); if (ak > 0) { const y = E.H * 0.88, x0 = E.W * 0.28, x1 = lerp(x0, E.W * 0.72, ak); seg(g, [[x0, y], [x1, y]], 18, INK); seg(g, [[x0, y], [x1, y]], 10, GOLD);
    if (ak > 0.95) { g.fillStyle = GOLD; g.strokeStyle = INK; g.lineWidth = 5; for (const [x, d] of [[x0, -1], [x1, 1]]) { g.beginPath(); g.moveTo(x + d * 34, y); g.lineTo(x, y - 24); g.lineTo(x, y + 24); g.closePath(); g.fill(); g.stroke(); } }
    rr(g, E.W / 2 - 160, y - 46, 320, 92, 46); g.fillStyle = INK; g.fill(); text(g, '26 YEARS', E.W / 2, y + 2, { size: 50, color: GOLD, stroke: 0 }); } }); } });

// a06 "By the end, you'll know where the two stories match, the one place they don't, and the three signals I'd watch from here."
//   three numbered badges pop on the beats: 1 = two matching puzzle halves, 2 = the one red X, 3 = three signal lights
function puzzle(g, x, y, s, col, flip) { g.save(); g.translate(x, y); g.scale(flip ? -s : s, s); g.beginPath(); g.moveTo(-70, -70); g.lineTo(70, -70); g.lineTo(70, -20); g.arc(90, 0, 26, Math.PI * 1.3, Math.PI * 0.7, false); g.lineTo(70, 70); g.lineTo(-70, 70); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); g.restore(); }
registerShot('a06', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }); zoomed(g, c, () => {
  backdrop(g, '#f2e4cc', '#d8bf9a', t, {}); g.fillStyle = 'rgba(0,0,0,.04)'; for (let i = 0; i < 24; i++) g.fillRect(i * 80, 0, 2, E.H); for (let i = 0; i < 14; i++) g.fillRect(0, i * 80, E.W, 2);
  D.plant(g, 120, E.H, 1.3, { kind: 'leafy', t }); D.mug(g, E.W - 140, E.H - 10, 1.1, { color: '#4a78b8' });
  const xs = [E.W * 0.22, E.W * 0.5, E.W * 0.78], t0s = [2.25, 3.45, 4.33];
  xs.forEach((x, i) => { const k = pop(t, t0s[i], 0.4); if (k <= 0) return; rr(g, x - 230, E.H * 0.2, 460, 640, 40); g.fillStyle = alpha('#ffffff', 0.85 * Math.min(1, k)); g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); badge(g, x, E.H * 0.2, i + 1, k);
    const cy = E.H * 0.55; g.save(); g.translate(x, cy); g.scale(k, k);
    if (i === 0) { const j = 1 - ease.out(prog(t, t0s[0] + 0.2, t0s[0] + 0.9)); puzzle(g, -60 - 30 * j, 0, 0.9, '#8ad8ff', false); puzzle(g, 60 + 30 * j, 0, 0.9, '#ffb08a', true); }
    if (i === 1) { D.cross(g, 0, 0, 1.4, {}); }
    if (i === 2) for (let j = 0; j < 3; j++) { const on = t > t0s[2] + 0.2 + j * 0.25 ? 1 : 0.1; g.save(); g.translate((j - 1) * 120, 30); g.scale(0.7, 0.7); D.bulb(g, 0, 0, 1, { on }); g.restore(); }
    g.restore(); text(g, ['MATCH', 'DIFFERENT', 'SIGNALS'][i], x, E.H * 0.73, { size: 52, color: INK, stroke: 0 }); }); }); } });
