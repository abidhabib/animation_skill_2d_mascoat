// V03 Clip 1 "two yous": 2026-you buys Nvidia at the top (night bedroom 3D), the drop, REWIND to March 2000, 2000-you buys Cisco
// on a 3D trading floor (sets3d/office2000), the router rack, mirrored "You can't lose" faces. Finance channel: one narrator.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, ROOMMATE, DAD, SHOPPER } from '/engine/toon2d.js';
import { blink, headNum, floater, camEase } from '/engine/storyfx.js';
import { cam3, pin } from '/engine/three-toon.js';
import { bedroom3d } from '/engine/sets3d/bedroom3d.js';
import { office2000 } from '/engine/sets3d/office2000.js';
import { D } from '/engine/props2d.js';

const GREEN = '#8dffc8', RED = '#ff8a7a', GOLD = '#ffe28a', INK = '#1b1424';
const RIM = { color: '#9fc8ff', dir: [0.7, -0.7], w: 3.5 }, RIM2K = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const Y2K = { ...HERO, top: '#f4f0e6', topDark: '#d8d0c0', collar: '#c8c0b0', legs: '#3a3a4a', sleeves: null };   // the 2000 you: white office shirt
const initB = (T) => { const b = bedroom3d(T, { time: 'dawn', made: 0.4 }); b.setClock(23, 40); Object.assign(b.st, { spots: b.spots }); return b.st; };
const initO = (T) => { const o = office2000(T, { time: 'day' }); Object.assign(o.st, { spots: o.spots, upd: o.update }); return o.st; };
const at = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'smile', look: o.look, blink: o.blink ?? blink(t), rim: o.rim || RIM, talk: o.talk }); return q; };
const zoomed = (g, c, fn) => { g.save(); g.translate(E.W / 2 + c.x, E.H / 2 + c.y); g.scale(c.z, c.z); g.translate(-E.W / 2, -E.H / 2); fn(); g.restore(); };
const pop = (t, t0, d = 0.35) => ease.outBack(prog(t, t0, t0 + d));
// a big glowing money number with an outline (same look as the trust numbers)
const money = (g, x, y, s, t, t0, col = GREEN, size = 64) => headNum(g, x, y, s, t, t0, { size, color: col });
// warm/dark textured backdrop for 2D inserts (never a flat colour)
function backdrop(g, top, bot, t, o = {}) {
  const gr = g.createLinearGradient(0, -E.H, 0, E.H * 2); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
  g.fillStyle = 'rgba(255,255,255,.025)'; for (let i = 0; i < 40; i++) g.fillRect(-E.W + i * 120, -E.H, 2, E.H * 3);
  if (o.bokeh) for (let i = 0; i < 14; i++) { const x = (i * 263) % E.W, y = 120 + (i * 151) % (E.H - 240); glow(g, x, y + Math.sin(t + i) * 8, 60 + (i % 3) * 30, o.bokeh[i % o.bokeh.length], 0.18); }
}
// a stock chart line (up or down) inside a rect
function chart(g, x, y, w, h, k, up, col) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2; for (let i = 1; i < 6; i++) { g.beginPath(); g.moveTo(x, y + i * h / 6); g.lineTo(x + w, y + i * h / 6); g.stroke(); }
  const n = 40, pts = []; for (let i = 0; i <= n * k; i++) { const u = i / n, base = up ? 1 - u * 0.85 : 0.15 + u * 0.7; pts.push([x + u * w, y + h * clamp(base + Math.sin(i * 1.3) * 0.04 + Math.sin(i * 0.37) * 0.05, 0.04, 0.96)]); }
  if (pts.length > 1) { g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.lineTo(pts[pts.length - 1][0], y + h); g.lineTo(x, y + h); g.closePath(); g.fillStyle = alpha(col, 0.15); g.fill();
    g.beginPath(); pts.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); g.strokeStyle = col; g.lineWidth = 7; g.lineJoin = 'round'; g.stroke(); const [lx, ly] = pts[pts.length - 1]; glow(g, lx, ly, 40, col, 0.6); circle(g, lx, ly, 9, '#ffffff'); }
  g.restore();
}

// s01 "October sixth, twenty twenty-six."  night bedroom; the camera pushes in to you at the desk, laptop glowing; a calendar pops: OCT 6
registerShot('s01', { kind: '3d', init: initB,
  draw(st, t, info) { const d = st.spots.desk; cam3(st, t, info.dur, { from: { pos: [d[0] - 2.6, 1.6, d[2] + 4.2], look: [d[0] - 0.4, 1.0, d[2] + 0.4], fov: 40 }, to: { pos: [d[0] - 1.7, 1.45, d[2] + 3.0], look: [d[0] - 0.2, 1.05, d[2] + 0.4], fov: 37 } }); },
  overlay(g, t, info, st) { const q = at(g, st, st.spots.deskChair, t, { facing: 1, pose: breathe(POSES.sit, t), expr: 'neutral', look: [0.6, 0.1] });
    glow(g, q.x + 120 * q.s, q.y - 200 * q.s, 260 * q.s, '#9fc8ff', 0.35);
    const k = pop(t, 0.55, 0.45); if (k > 0) { g.save(); g.translate(250, 250); g.scale(k * 1.1, k * 1.1); D.calendar(g, 0, 0, 1, { month: 'OCT', day: 6, color: '#4a78b8' }); g.restore(); text(g, '2026', 250, 400, { size: 44, color: '#ffffff', stroke: 6, strokeColor: INK }); } } });

// s02 "You put ten thousand dollars into Nvidia."  the laptop screen: a green chart climbing, the cursor clicks BUY, cash flies in, $10,000
registerShot('s02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.07, x0: 0, x1: -30 });
  zoomed(g, c, () => { backdrop(g, '#1a2238', '#0c0f1c', t, { bokeh: ['#ffd08a', '#a0e0ff', '#ffb0a0'] });
    D.mug(g, 1640, 1010, 1.0, { color: '#e0562f' }); D.plant(g, 230, 1010, 1.1, { kind: 'leafy', t });
    const X = 360, Y = 120, W = 1200, H = 760; rr(g, X - 30, Y - 30, W + 60, H + 90, 30); g.fillStyle = '#b8bec8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
    g.save(); rr(g, X, Y, W, H, 12); g.clip(); g.fillStyle = '#0e1424'; g.fillRect(X, Y, W, H);
    g.fillStyle = '#1a2236'; g.fillRect(X, Y, W, 70); text(g, 'NVDA', X + 110, Y + 37, { size: 40, color: '#ffffff', stroke: 0 }); text(g, '$239.24  ▲', X + 380, Y + 37, { size: 36, color: GREEN, stroke: 0 });
    chart(g, X + 40, Y + 110, W - 380, H - 160, Math.min(1, 0.55 + t * 0.4), true, '#5aff8a');
    const pressed = t > 1.55 && t < 1.8, bk = pressed ? 0.92 : 1; g.save(); g.translate(X + W - 170, Y + H / 2); g.scale(bk, bk); rr(g, -130, -60, 260, 120, 30); g.fillStyle = t > 1.55 ? '#2fbf6a' : '#28a85a'; g.fill(); g.strokeStyle = '#0b0620'; g.lineWidth = 6; g.stroke(); text(g, 'BUY', 0, 2, { size: 58, color: '#ffffff', stroke: 0 }); g.restore();
    if (t > 1.6) { glow(g, X + W - 170, Y + H / 2, 260, '#5aff8a', 0.35 * (1 - prog(t, 1.6, 2.4))); }
    g.restore();
    // cursor glides to BUY and clicks
    const k = ease.inOut(prog(t, 0.3, 1.5)), cx = lerp(X + 500, X + W - 150, k), cy = lerp(Y + 560, Y + H / 2 + 20, k);
    g.save(); g.translate(cx, cy); g.fillStyle = '#ffffff'; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, 54); g.lineTo(14, 42); g.lineTo(26, 66); g.lineTo(36, 60); g.lineTo(24, 38); g.lineTo(42, 38); g.closePath(); g.fill(); g.stroke(); g.restore();
    // cash flies from the bottom into the screen
    for (let i = 0; i < 6; i++) { const p = ease.in(prog(t, 1.65 + i * 0.07, 2.25 + i * 0.07)); if (p <= 0 || p >= 1) continue; g.save(); g.globalAlpha = 1 - p * 0.6; g.translate(lerp(560 + i * 150, X + W - 170, p), lerp(1180, Y + H / 2, p)); g.rotate((i - 2.5) * 0.3 * (1 - p)); g.scale(1 - p * 0.6, 1 - p * 0.6); D.cash(g, 0, 0, 1, { text: '' }); g.restore(); }
    money(g, X + 400, Y + H - 150, '$10,000', t, 1.9, GREEN, 96); }); } });

// s03 "It's the most valuable company on Earth,"  a turning globe; a gold #1 trophy rises over it, stars pop
registerShot('s03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.06, z1: 1.0, y0: 20, y1: -10 });
  zoomed(g, c, () => { backdrop(g, '#2a1f4a', '#120c24', t, { bokeh: ['#ffd08a', '#c0a0ff'] }); FX.stars(g, t, { count: 90, area: [0, 0, E.W, E.H] });
    const gx = E.W / 2, gy = E.H * 0.7, R = 300; glow(g, gx, gy, 520, '#6ab8ff', 0.25); circle(g, gx, gy, R + 8, INK); circle(g, gx, gy, R, '#3a8ad8');
    g.save(); g.beginPath(); g.arc(gx, gy, R, 0, 7); g.clip(); const off = (t * 90) % 900; g.fillStyle = '#5ac46a';
    for (let i = -1; i < 3; i++) { const bx = gx - 600 + i * 450 + off; g.beginPath(); g.ellipse(bx, gy - 90, 130, 80, 0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(bx + 160, gy + 80, 90, 120, -0.3, 0, 7); g.fill(); g.beginPath(); g.ellipse(bx - 120, gy + 160, 70, 40, 0, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(gx - 110, gy - 140, 90, 40, -0.5, 0, 7); g.fill(); g.restore();
    const k = ease.outBack(prog(t, 0.25, 1.0)), ty = lerp(gy, E.H * 0.33, k); g.save(); g.translate(gx, ty); g.scale(1.5 * Math.max(0.01, k), 1.5 * Math.max(0.01, k)); glow(g, 0, -20, 220, GOLD, 0.45); D.trophy(g, 0, 0, 1, {}); g.restore();
    if (k > 0.5) text(g, '#1', gx, ty - 6, { size: 74, color: '#7a4e1a', stroke: 0 });
    for (let i = 0; i < 6; i++) { const p = pop(t, 1.2 + i * 0.12); if (p <= 0) continue; const a = -Math.PI / 2 + (i - 2.5) * 0.45, d = 330; g.save(); g.translate(gx + Math.cos(a) * d, ty + 30 + Math.sin(a) * d * 0.6); g.scale(0.35 * p, 0.35 * p); D.star(g, 0, 0, 1, { glow: true }); g.restore(); } }); } });

// s04 "it sells the chips the whole AI boom runs on,"  a giant chip; light runs out along its traces into rows of server racks
function rack2d(g, x, y, s, t, lit) { rr(g, x - 50 * s, y - 210 * s, 100 * s, 210 * s, 10 * s); g.fillStyle = '#1e2230'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  for (let i = 0; i < 7; i++) { rr(g, x - 40 * s, y - 200 * s + i * 28 * s, 80 * s, 20 * s, 4 * s); g.fillStyle = '#3a4258'; g.fill(); for (let j = 0; j < 4; j++) if (lit && Math.sin(t * 10 + i * 3 + j * 7 + x) > -0.3) circle(g, x - 28 * s + j * 12 * s, y - 190 * s + i * 28 * s, 3.5 * s, ['#5aff8a', '#5ab4ff', '#ffb43a'][(i + j) % 3]); } }
registerShot('s04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.12, z1: 1.0 });
  zoomed(g, c, () => { backdrop(g, '#0e1a26', '#06101a', t, {}); const cx = E.W / 2, cy = E.H * 0.42;
    const racks = []; for (let i = 0; i < 9; i++) { const x = 180 + i * 195, y = E.H - 60 - (i % 2) * 40; racks.push([x, y]); }
    racks.forEach(([x, y], i) => { const lp = prog(t, 0.35 + i * 0.09, 0.75 + i * 0.09); g.strokeStyle = '#2a3a40'; g.lineWidth = 8; g.beginPath(); g.moveTo(cx, cy + 150); g.lineTo(cx, cy + 230); g.lineTo(x, cy + 230); g.lineTo(x, y - 210); g.stroke();
      if (lp > 0) { const segs = [[cx, cy + 150], [cx, cy + 230], [x, cy + 230], [x, y - 210]]; g.strokeStyle = '#7affc0'; g.lineWidth = 6; g.shadowColor = '#7affc0'; g.shadowBlur = 18; g.beginPath(); g.moveTo(...segs[0]); const L = segs.reduce((a, p, j) => j ? a + Math.hypot(p[0] - segs[j - 1][0], p[1] - segs[j - 1][1]) : 0, 0); let rem = L * lp;
        for (let j = 1; j < 4 && rem > 0; j++) { const [ax, ay] = segs[j - 1], [bx, by] = segs[j], l = Math.hypot(bx - ax, by - ay), f = Math.min(1, rem / l); g.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f); rem -= l; } g.stroke(); g.shadowBlur = 0; }
      rack2d(g, x, y, 0.9, t, lp >= 1); });
    glow(g, cx, cy, 420, '#5affb0', 0.25 + 0.1 * Math.sin(t * 4)); rr(g, cx - 190, cy - 190, 380, 380, 34); g.fillStyle = '#20262e'; g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke();
    for (let i = 0; i < 9; i++) for (const [dx, dy, w, h] of [[-160 + i * 40, -214, 14, 30], [-160 + i * 40, 184, 14, 30], [-214, -160 + i * 40, 30, 14], [184, -160 + i * 40, 30, 14]]) { g.fillStyle = '#e0b05a'; g.fillRect(cx + dx, cy + dy, w, h); }
    rr(g, cx - 120, cy - 120, 240, 240, 20); g.fillStyle = '#2f3a44'; g.fill(); g.strokeStyle = '#5affb0'; g.lineWidth = 4; g.stroke(); text(g, 'AI', cx, cy + 4, { size: 110, color: '#d8ffee', stroke: 0, glow: 20, glowColor: '#5affb0' }); }); } });

// s05 "and everyone you know says the same thing."  your friends, each with a bubble showing the same green up-arrow
function upBubble(g, x, y, k, t) { if (k <= 0) return; g.save(); g.translate(x, y); g.scale(k, k); rr(g, -95, -70, 190, 130, 36); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
  g.beginPath(); g.moveTo(-30, 58); g.lineTo(-50, 100); g.lineTo(5, 58); g.closePath(); g.fill(); g.stroke(); const b = Math.sin(t * 6) * 4;
  g.fillStyle = '#2fbf6a'; g.beginPath(); g.moveTo(0, -50 + b); g.lineTo(45, 0 + b); g.lineTo(17, 0 + b); g.lineTo(17, 40 + b); g.lineTo(-17, 40 + b); g.lineTo(-17, 0 + b); g.lineTo(-45, 0 + b); g.closePath(); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore(); }
registerShot('s05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05, x0: 40, x1: -40 });
  zoomed(g, c, () => { backdrop(g, '#f2d6b8', '#d9a888', t, {}); g.fillStyle = '#c98a68'; g.fillRect(-E.W, E.H * 0.86, E.W * 3, E.H); FX.pool(g, E.W / 2, E.H * 0.4, 900, 300, '#fff0d0', 0.25);
    D.plant(g, 140, E.H * 0.86, 1.4, { kind: 'tall', t }); D.deskLamp(g, E.W - 160, E.H * 0.86, 1.0, { on: 1 });
    const ppl = [[SAM, E.W * 0.25, 0.3], [ROOMMATE, E.W * 0.5, 0.6], [DAD, E.W * 0.75, 0.9]];
    ppl.forEach(([cast, x, t0], i) => { drawToon(g, { x, y: E.H * 0.95, s: 1.6, facing: i === 2 ? -1 : 1, cast, pose: breathe(posesAt(t, [[0, 'stand'], [t0, 'pointUp']]), t + i), expr: t > t0 ? 'happy' : 'smile', talk: t > t0 && t < t0 + 0.6, blink: blink(t + i), rim: { color: '#fff0d0', dir: [0.7, -0.7], w: 3 } });
      upBubble(g, x + 150, E.H * 0.95 - 590, pop(t, t0), t); }); }); } });

// big-face helper: dark room + screen glow from below; number above the head
function faceShot(g, t, info, cast, glowCol, num, bg) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.06 });
  zoomed(g, c, () => { backdrop(g, bg[0], bg[1], t, { bokeh: bg[2] }); glow(g, E.W / 2, E.H + 80, 900, glowCol, 0.45);
    bigToonFace(g, E.W / 2, E.H * 0.6, 250, { cast, expr: t < 0.25 ? 'smile' : 'smug', blink: blink(t + 1), look: [0, 0.1] });
    money(g, E.W / 2, E.H * 0.12, num, t, 0.15, GREEN, 88); }); }
// s06 "You can't lose."  your giant smug face lit by the laptop, $10,000 glowing above
registerShot('s06', { draw(g, t, info) { faceShot(g, t, info, HERO, '#9fc8ff', '$10,000', ['#1a2240', '#0a0d1c', ['#ffd08a', '#a0e0ff', '#ffb0a0']]); } });

// s07 "Six weeks later, your ten thousand dollars is worth about six thousand."  same room, later: NOV 17; the number drains to $6,000
registerShot('s07', { kind: '3d', init: initB,
  draw(st, t, info) { const d = st.spots.desk; cam3(st, t, info.dur, { from: { pos: [d[0] - 2.5, 1.55, d[2] + 4.1], look: [d[0] - 0.3, 1.15, d[2] + 0.4], fov: 38 }, to: { pos: [d[0] - 2.0, 1.5, d[2] + 3.4], look: [d[0] - 0.2, 1.2, d[2] + 0.45], fov: 36 } }); },
  overlay(g, t, info, st) { const T0 = 3.15, after = t > T0;
    veil(g, '#0a0820', 0.25 + 0.2 * prog(t, T0, T0 + 0.8));
    const q = at(g, st, st.spots.deskChair, t, { facing: 1, pose: breathe(posesAt(t, [[0, 'sit'], [T0 + 0.2, 'sit']]), t), expr: after ? (t > T0 + 0.6 ? 'worried' : 'shocked') : 'neutral', look: [0.6, 0.1] });
    glow(g, q.x + 120 * q.s, q.y - 200 * q.s, 260 * q.s, after ? '#ff8a7a' : '#9fc8ff', 0.3);
    const nx = q.x, ny = Math.max(120, q.y - 300 * q.s), sz = Math.max(40, 52 * q.s);
    if (!after) money(g, nx, ny, '$10,000', t, 0.2, GREEN, sz); else { const out = 1 - ease.in(prog(t, T0, T0 + 0.15)); if (out > 0) { g.save(); g.globalAlpha = out; money(g, nx, ny, '$10,000', t, -1, GREEN, sz); g.restore(); } money(g, nx, ny, '$6,000', t, T0 + 0.1, RED, sz); floater(g, nx + 200, ny, '-40%', t, T0, '#ff5a5a'); }
    // calendar flips from OCT 6 to NOV 17
    const flip = prog(t, 0.2, 0.9); g.save(); g.translate(250, 250); g.scale(1.1, 1.1 * Math.abs(Math.cos(flip * Math.PI))); D.calendar(g, 0, 0, 1, flip < 0.5 ? { month: 'OCT', day: 6, color: '#4a78b8' } : { month: 'NOV', day: 17, color: '#e0302a' }); g.restore(); } });

// s08 "Now rewind twenty-six years. March twenty-seventh, two thousand."  VHS-style rewind: the year counts 2026 -> 2000, a clock spins backwards, pages fly
registerShot('s08', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08 });
  zoomed(g, c, () => { const land = prog(t, 2.6, 3.3); backdrop(g, '#20183a', '#0c0a1c', t, {}); FX.speedLines(g, t, { count: 50, color: '#c0b0ff', a: 0.18 * (1 - land) });
    for (let i = 0; i < 10; i++) { const p = ((t * 0.9 + i * 0.1) % 1); if (land > 0.9) break; g.save(); g.globalAlpha = 0.8 * (1 - land); g.translate(lerp(E.W + 200, -200, p), E.H * (0.2 + (i * 0.37) % 0.6)); g.rotate(p * 4 + i); g.scale(0.6, 0.6); D.calendar(g, 0, 0, 1, { month: ['JAN', 'MAY', 'SEP', 'DEC'][i % 4], day: 1 + (i * 7) % 28 }); g.restore(); }
    g.save(); g.translate(E.W * 0.22, E.H * 0.5); g.scale(1.3, 1.3); D.clock(g, 0, 0, 1, { h: 12 - (t * 40) % 12, m: (60 - (t * 480) % 60) % 60, t }); g.restore();
    const yr = Math.round(lerp(2026, 2000, ease.inOut(prog(t, 0.1, 2.6)))); text(g, String(yr), E.W * 0.62, E.H * 0.42, { size: 240, color: '#ffffff', stroke: 12, strokeColor: INK, glow: 30, glowColor: '#a08aff' });
    g.fillStyle = '#ffffff'; for (const dx of [0, 70]) { g.beginPath(); g.moveTo(E.W * 0.47 + dx, E.H * 0.72); g.lineTo(E.W * 0.47 + dx - 60, E.H * 0.76); g.lineTo(E.W * 0.47 + dx, E.H * 0.8); g.closePath(); g.globalAlpha = (1 - land) * (0.5 + 0.5 * Math.sin(t * 10)); g.fill(); } g.globalAlpha = 1;
    const k = pop(t, 3.0, 0.45); if (k > 0) { g.save(); g.translate(E.W * 0.62, E.H * 0.74); g.scale(1.2 * k, 1.2 * k); D.calendar(g, 0, 0, 1, { month: 'MAR', day: 27, color: '#d8302a' }); g.restore(); }
    for (let y = 0; y < E.H; y += 6) { g.fillStyle = `rgba(0,0,0,${0.12 * (1 - land)})`; g.fillRect(0, y, E.W, 2); }
    const band = (t * 700) % (E.H + 200) - 100; g.fillStyle = alpha('#ffffff', 0.08 * (1 - land)); g.fillRect(0, band, E.W, 40); }); } });

// s09 "A different you puts ten thousand dollars into Cisco."  the 2000 trading floor: you in a white office shirt at a beige CRT; click -> $10,000
registerShot('s09', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t); const h = st.spots.heroChair; cam3(st, t, info.dur, { from: { pos: [h[0] + 2.6, 1.7, h[2] + 3.6], look: [h[0] - 0.2, 1.0, h[2] - 0.6], fov: 42 }, to: { pos: [h[0] + 1.7, 1.55, h[2] + 2.6], look: [h[0] - 0.1, 1.05, h[2] - 0.5], fov: 38 } }); },
  overlay(g, t, info, st) {
    st.spots.deskSeats.forEach((p, i) => { if (i === 5 || i > 8 || i % 2) return; at(g, st, p, t + i, { cast: SHOPPER(i % 4), facing: i % 3 ? -1 : 1, pose: breathe(POSES.sit, t + i), expr: 'happy', rim: RIM2K }); });
    const q = at(g, st, st.spots.heroChair, t, { cast: Y2K, facing: -1, pose: breathe(posesAt(t, [[0, 'sit'], [2.1, 'reach'], [2.5, 'sit']]), t), expr: t > 2.4 ? 'happy' : 'smile', look: [-0.5, 0.2], rim: RIM2K });
    money(g, q.x, q.y - 292 * q.s, '$10,000', t, 2.4, GREEN, Math.max(40, 52 * q.s)); } });

// s10 "Most valuable company on Earth."  crane up to the glowing ticker; the office cheers
registerShot('s10', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t + 3); cam3(st, t, info.dur, { from: { pos: [0.6, 1.6, 5.2], look: [0.0, 1.3, -2.0], fov: 46 }, to: { pos: [0.2, 2.1, 3.4], look: [0.0, 2.45, -3.9], fov: 44 } }); },
  overlay(g, t, info, st) { st.spots.deskSeats.forEach((p, i) => { if (p[2] < 0 && i % 2 === 0) at(g, st, [p[0], 0, p[2]], t + i, { cast: i === 9 ? Y2K : SHOPPER(i % 4), facing: i % 3 ? -1 : 1, pose: breathe(posesAt(t, [[0, 'stand'], [0.3 + (i % 3) * 0.1, 'cheer']]), t + i), expr: 'joy', rim: RIM2K }); });
    const s = screenOf3(st, st.spots.ticker); const k = pop(t, 0.7, 0.5); if (k > 0) { g.save(); g.translate(s.x, s.y - 150); g.scale(1.2 * k, 1.2 * k); D.trophy(g, 0, 0, 1, {}); g.restore(); if (k > 0.6) text(g, '#1', s.x, s.y - 156, { size: 70, color: '#7a4e1a', stroke: 0 }); } } });
import { screenOf } from '/engine/three-toon.js';
const screenOf3 = (st, p) => screenOf(st, p);

// s11 "Sells the boxes the internet runs on."  slide past the router rack: blinking lights, cables
registerShot('s11', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t + 6); const r = st.spots.rack; cam3(st, t, info.dur, { from: { pos: [r[0] - 1.5, 1.5, r[2] + 3.3], look: [r[0], 1.0, r[2]], fov: 40 }, to: { pos: [r[0] - 0.8, 1.25, r[2] + 2.4], look: [r[0], 0.95, r[2]], fov: 37 } }); },
  overlay(g, t, info, st) { const s = screenOf3(st, [st.spots.rack[0], 2.15, st.spots.rack[2]]); g.save(); g.globalCompositeOperation = 'lighter'; FX.rings(g, s.x, s.y + 200, t, { color: '#5ab4ff', a: 0.25 }); g.restore(); } });

// s12 "You can't lose."  2000-you's giant smug face, green CRT glow, $10,000 above (mirrors s06)
registerShot('s12', { draw(g, t, info) { faceShot(g, t, info, Y2K, '#5aff8a', '$10,000', ['#2a3a2e', '#0c140e', ['#ffe2b0', '#8affb0']]); veil(g, '#000000', ease.in(prog(t, info.dur - 0.35, info.dur)) * 0.6); } });
