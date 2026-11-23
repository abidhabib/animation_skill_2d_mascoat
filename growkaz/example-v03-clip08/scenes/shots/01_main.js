// V03 Clip 8 "the 2026 you": rich style. City at night, a 2000s gamer room, GPU -> AI network, the queue at the sold-out dock,
// the router/GPU swap in a museum case, Cisco vs Nvidia rise on glass, the 2026 trading-floor wall, 49x vs 44x.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, HERO, SAM, ROOMMATE, DAD, MOM, KID, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, zoomed, pop, money, backdrop, box } from '/engine/finfx.js';

const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM];
const SUIT = (c, col) => ({ ...c, top: col, topDark: '#1a1a24', collar: '#e8e8f0' });
const NV = [5, 6, 5.5, 7, 9, 12, 14, 13, 17, 21, 26, 22, 18, 14, 12, 11, 15, 24, 40, 48, 45, 62, 90, 110, 130, 120, 140, 175, 160, 190, 205, 230, 239];
function riseLine(g, x, y, w, h, pts, k, col, lw = 8) { const n = pts.length, mx = Math.max(...pts); g.beginPath(); for (let i = 0; i <= (n - 1) * k; i++) { const px = x + (i / (n - 1)) * w, py = y + h - (pts[i] / mx) * h; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round'; g.stroke(); }
const CS = [1, 1.2, 1.5, 1.4, 2, 2.6, 3.4, 3.1, 4.5, 6, 7.5, 7, 9.5, 12, 16, 15, 20, 26, 31, 36, 44];
const NVm = [1, 1.3, 1.8, 2.6, 3.4, 4.2, 6.6, 5.0, 3.4, 2.2, 2.6, 4.5, 8, 9.8, 12, 16, 20, 24, 30, 38, 49];

// h01 "Now the twenty twenty-six you."  a 2026 city at night; people walk past with glowing phones
registerShot('h01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.1, z1: 1.0, x0: 60, x1: -60 });
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#0c1030'); sky.addColorStop(1, '#3a2a5a'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FX.stars(g, t, { count: 60 });
    FX.skyline(g, { y: E.H * 0.72, color: '#1a1a3a' }); for (let i = 0; i < 6; i++) FX.facade(g, { x: -100 + i * 360, y: E.H * 0.82 - 420 - (i % 3) * 80, w: 300, h: 420 + (i % 3) * 80, color: '#221c3a', win: ['#ffcf8a', '#8ad8ff', '#ff8ad0'][i % 3] });
    g.fillStyle = '#16122a'; g.fillRect(-E.W, E.H * 0.82, E.W * 3, E.H); for (let i = 0; i < 12; i++) glow(g, (i * 190) % E.W, E.H * 0.84, 60, ['#ff6a8a', '#5ab4ff'][i % 2], 0.25);
    for (let i = 0; i < 6; i++) { const x = ((i * 330 + t * (i % 2 ? 160 : -140)) % (E.W + 400)) - 200, f = i % 2 ? 1 : -1; drawToon(g, { x, y: E.H * 0.97, s: 1.0, facing: f, cast: CROWD[i], pose: breathe(POSES.phone, t + i), expr: 'neutral', blink: blink(t + i), rim: { color: '#8ad8ff', dir: [0.7, -0.7], w: 3 } }); glow(g, x + f * 30, E.H * 0.97 - 175, 50, '#9fd8ff', 0.4); }
    const k = pop(t, 0.15, 0.4); if (k > 0) { g.save(); g.translate(E.W / 2, E.H * 0.3); g.scale(k, k); text(g, '2026', 0, 0, { size: 220, color: '#ffffff', stroke: 12, strokeColor: INK, glow: 30, glowColor: '#8a6aff' }); g.restore(); } }); } });

// h02 "Nvidia started with chips for video games."  a 2000s gamer bedroom: two kids on bean bags racing on a CRT; a graphics-card box on the desk
registerShot('h02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: -40, x1: 30 });
  zoomed(g, c, () => { g.fillStyle = '#3a4a7a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(-E.W + i * 120, 0, 50, E.H); }
    g.fillStyle = '#5a4a3a'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H); for (const [x, col] of [[180, '#e0562f'], [1560, '#2f8a57']]) { rr(g, x, 110, 220, 300, 6); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); circle(g, x + 110, 230, 60, '#ffd03a'); }
    rr(g, E.W * 0.62, E.H * 0.56, 560, 30, 6); g.fillStyle = '#7a4e34'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); seg(g, [[E.W * 0.64, E.H * 0.59], [E.W * 0.64, E.H * 0.8]], 14, '#5a3828'); seg(g, [[E.W * 0.9, E.H * 0.59], [E.W * 0.9, E.H * 0.8]], 14, '#5a3828');
    g.save(); g.translate(E.W * 0.82, E.H * 0.47); g.rotate(-0.08); rr(g, -150, -90, 300, 180, 10); g.fillStyle = '#1a1a1a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); glow(g, 0, 0, 140, '#76ff5a', 0.25); text(g, '3D GRAPHICS', 0, -40, { size: 30, color: '#76ff5a', stroke: 0 }); FP.gpu(g, 0, 30, 0.42, { t }); g.restore();
    const tvx = E.W * 0.38, tvy = E.H * 0.5; rr(g, tvx - 300, tvy - 230, 600, 460, 30); g.fillStyle = '#2a2a30'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke();
    g.save(); rr(g, tvx - 260, tvy - 200, 520, 360, 30); g.clip(); const sky = g.createLinearGradient(0, tvy - 200, 0, tvy); sky.addColorStop(0, '#ff8a5a'); sky.addColorStop(1, '#ffd08a'); g.fillStyle = sky; g.fillRect(tvx - 260, tvy - 200, 520, 360); g.fillStyle = '#3a8a4a'; g.fillRect(tvx - 260, tvy, 520, 160);
    g.fillStyle = '#4a4a52'; g.beginPath(); g.moveTo(tvx - 40, tvy); g.lineTo(tvx + 40, tvy); g.lineTo(tvx + 260, tvy + 160); g.lineTo(tvx - 260, tvy + 160); g.fill(); for (let i = 0; i < 6; i++) { const p = ((t * 2 + i / 6) % 1), yy = tvy + p * p * 160; g.fillStyle = '#ffffff'; g.fillRect(tvx - 4 - p * 10, yy, 8 + p * 20, 6 + p * 14); }
    rr(g, tvx - 50 + Math.sin(t * 3) * 60, tvy + 100, 100, 50, 12); g.fillStyle = '#e0302a'; g.fill(); rr(g, tvx + 110, tvy + 40, 70, 34, 10); g.fillStyle = '#4a78b8'; g.fill(); for (let y = tvy - 200; y < tvy + 160; y += 4) { g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(tvx - 260, y, 520, 1.5); } g.restore();
    for (const [x, cast, ex, d] of [[E.W * 0.22, KID, 'joy', 1], [E.W * 0.47, { ...SAM, stache: null, beard: null }, 'happy', -1]]) { g.fillStyle = d > 0 ? '#c0302a' : '#2f6ae0'; g.beginPath(); g.ellipse(x, E.H * 0.92, 160, 70, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
      drawToon(g, { x, y: E.H * 0.92, s: 1.25, facing: d > 0 ? 1 : -1, cast, pose: breathe(POSES.sit, t), expr: ex, look: [d > 0 ? 0.4 : -0.4, -0.3], blink: blink(t + x), rim: { color: '#ffd08a', dir: [0.7, -0.7], w: 3 } });
      rr(g, x - 50, E.H * 0.92 - 150, 100, 44, 18); g.fillStyle = '#2a2a33'; g.fill(); circle(g, x - 22, E.H * 0.92 - 128, 9, '#e0302a'); circle(g, x + 22, E.H * 0.92 - 128, 9, '#2fbf6a'); }
    D.plant(g, E.W * 0.08, E.H * 0.82, 1.1, { kind: 'leafy', t }); D.bottle(g, E.W * 0.66, E.H * 0.56, 0.7, {}); }); } });

// h03 "But those same chips turned out to be perfect for training AI."  the GPU turns in the dark, fans spinning; a glowing neural network grows from it; a training card fills
registerShot('h03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.12, z1: 1.0 });
  zoomed(g, c, () => { backdrop(g, '#0a1410', '#030806', t, {}); const gx = E.W * 0.3, gy = E.H * 0.58, grow = ease.inOut(prog(t, 0.6, 2.8));
    const layers = [3, 6, 8, 6, 3], nodes = layers.map((n, li) => Array.from({ length: n }, (_, j) => [E.W * 0.5 + li * 200, E.H * 0.5 + (j - (n - 1) / 2) * 92]));
    for (let li = 0; li < layers.length - 1; li++) for (const a of nodes[li]) for (const b of nodes[li + 1]) { const on = grow > li / (layers.length - 1); if (!on) continue; g.strokeStyle = alpha('#5affb0', 0.12 + 0.18 * Math.max(0, Math.sin(t * 6 - li + a[1] * 0.01))); g.lineWidth = 2; g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
    nodes.forEach((ln, li) => ln.forEach(([x, y], j) => { const k = pop(t, 0.6 + li * 0.4 + j * 0.03, 0.3); if (k <= 0) return; glow(g, x, y, 40, '#5affb0', 0.35); circle(g, x, y, 16 * k, '#c8ffe8'); circle(g, x, y, 9 * k, '#2fd67a'); }));
    for (let i = 0; i < 12; i++) { const p = ((t * 0.8 + i / 12) % 1); circle(g, lerp(gx + 200, E.W * 0.5, p), gy - 40 + Math.sin(i * 2) * 60 * (1 - p), 6, '#ffffff'); }
    glow(g, gx, gy, 360, '#76ff5a', 0.2); FP.gpu(g, gx, gy, 0.95, { t, rot: Math.sin(t * 0.8) * 0.08 });
    const pk = ease.out(prog(t, 1.4, 1.9)); if (pk > 0) { g.save(); g.globalAlpha = pk; FP.glass(g, E.W * 0.6, 70, 560, 150); text(g, 'TRAINING MODEL', E.W * 0.6 + 40, 115, { size: 24, color: '#a8b0c0', stroke: 0, align: 'left' }); const k = prog(t, 1.6, 3.4);
      rr(g, E.W * 0.6 + 40, 145, 480, 30, 15); g.fillStyle = '#20262e'; g.fill(); rr(g, E.W * 0.6 + 40, 145, Math.max(30, 480 * k), 30, 15); g.fillStyle = '#2fd67a'; g.fill(); text(g, Math.round(k * 100) + '%', E.W * 0.6 + 520, 115, { size: 26, color: '#ffffff', stroke: 0, align: 'right' }); g.restore(); } }); } });

// h04 "Therefore, when the AI race started, every big tech company on Earth needed as many as it could get, and Nvidia makes the best ones."
//   a loading dock: a long queue of buyers in suits with briefcases; trucks back in; crates of GPUs fly out; SOLD OUT lights up on "best ones"
registerShot('h04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.04, z1: 1.0, x0: 140, x1: -90 });
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#9ac8f0'); sky.addColorStop(1, '#f0e8d8'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    rr(g, -E.W * 0.4, 120, E.W * 1.0, E.H * 0.7, 0); g.fillStyle = '#c8ccd4'; g.fill(); for (let i = 0; i < 22; i++) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(-E.W * 0.4 + i * 90, 120, 4, E.H * 0.7); }
    rr(g, E.W * 0.05, 300, 560, 520, 8); g.fillStyle = '#2a2e38'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); glow(g, E.W * 0.05 + 280, 560, 380, '#76ff5a', 0.2);
    for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) { if (t > 6.3 && (r + k) % 2) continue; box(g, E.W * 0.05 + 90 + k * 125, 770 - r * 105, 1.0, { color: '#3a3e48', label: 'GPU' }); }
    rr(g, E.W * 0.05 + 80, 220, 400, 70, 12); g.fillStyle = t > 6.3 ? '#d81e2a' : '#1a1c22'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); text(g, t > 6.3 ? 'SOLD OUT' : 'AI CHIPS', E.W * 0.05 + 280, 257, { size: 46, color: '#ffffff', stroke: 0 }); if (t > 6.3) glow(g, E.W * 0.05 + 280, 255, 260, '#ff3a3a', 0.35 * (0.6 + 0.4 * Math.sin(t * 12)));
    g.fillStyle = '#8a8e98'; g.fillRect(-E.W, E.H * 0.84, E.W * 4, E.H); for (let i = 0; i < 30; i++) seg(g, [[-E.W + i * 140, E.H * 0.9], [-E.W + i * 140 + 70, E.H * 0.9]], 6, '#ffd03a');
    for (let i = 0; i < 4; i++) { const ft = (t * 0.9 + i * 0.25) % 1, bx = lerp(E.W * 0.05 + 300, E.W * 0.6 + i * 60, ease.inOut(ft)), by = lerp(560, E.H * 0.76, ft) - Math.sin(ft * Math.PI) * 160; box(g, bx, by, 0.8, { rot: ft * 3, color: '#3a3e48', label: 'GPU' }); }
    for (let i = 0; i < 2; i++) { const tx = lerp(E.W * 1.8, E.W * 0.95 + i * 460, ease.out(prog(t, 1.5 + i * 1.4, 3.0 + i * 1.4))); D.car(g, tx, E.H * 0.83, 1.1, { spin: t * 4 }); }
    for (let i = 0; i < 9; i++) { const x = E.W * 0.58 + i * 150 + Math.sin(t * 2 + i) * 6, cast = SUIT(CROWD[i % CROWD.length], ['#2a3a5a', '#3a2a3a', '#2a2a2a'][i % 3]);
      drawToon(g, { x, y: E.H * 0.98, s: 1.25, facing: -1, cast, pose: breathe(posesAt(t + i * 0.2, [[0, 'stand'], [1.0 + (i % 3) * 0.5, 'reach'], [1.8 + (i % 3) * 0.5, 'stand']]), t + i), expr: t > 6.3 ? 'shocked' : (i % 2 ? 'determined' : 'nervous'), blink: blink(t + i) }); D.briefcase(g, x + 40, E.H * 0.96 - 40, 0.32, { color: '#4a3020' }); }
  }); } });

// h05 "Swap routers for AI chips, and it's the same seat."  a museum hall: a glass case on a pedestal; the 2000 router spins... flash... a GPU; visitors; a spotlight on THE SEAT
registerShot('h05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, y0: 30, y1: 0 });
  zoomed(g, c, () => { g.fillStyle = '#2a2430'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 8; i++) { rr(g, i * 260, 60, 180, 280, 8); g.fillStyle = '#3a3240'; g.fill(); } g.fillStyle = '#4a3e3a'; g.fillRect(-E.W, E.H * 0.8, E.W * 3, E.H);
    const cx = E.W / 2, cy = E.H * 0.5; g.save(); g.globalCompositeOperation = 'lighter'; const cone = g.createLinearGradient(cx, 0, cx, E.H * 0.8); cone.addColorStop(0, 'rgba(255,236,190,.0)'); cone.addColorStop(1, 'rgba(255,236,190,.28)'); g.fillStyle = cone; g.beginPath(); g.moveTo(cx - 40, 0); g.lineTo(cx + 40, 0); g.lineTo(cx + 380, E.H * 0.82); g.lineTo(cx - 380, E.H * 0.82); g.fill(); g.restore();
    rr(g, cx - 260, cy + 140, 520, 260, 10); g.fillStyle = '#e8e0d0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, cx - 220, cy + 220, 440, 70, 8); g.fillStyle = '#c8a050'; g.fill(); text(g, 'THE SEAT', cx, cy + 257, { size: 44, color: INK, stroke: 0 });
    const sw = t > 1.25, ang = t * 1.4; g.save(); g.translate(cx, cy); g.scale(Math.cos(ang) * 0.25 + 0.75, 1); if (sw) FP.gpu(g, 0, 0, 0.8, { t }); else FP.router(g, 0, 0, 0.8, { t }); g.restore();
    rr(g, cx - 300, cy - 230, 600, 370, 14); g.fillStyle = 'rgba(200,230,255,.08)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 4; g.stroke(); seg(g, [[cx - 260, cy - 200], [cx - 140, cy - 80]], 6, 'rgba(255,255,255,.35)');
    text(g, sw ? '2026: AI CHIP' : '2000: ROUTER', cx, cy - 280, { size: 46, color: sw ? '#76ff5a' : '#ffb000', stroke: 7, strokeColor: INK });
    const fl = 1 - prog(t, 1.25, 1.6); if (t > 1.25 && fl > 0) veil(g, '#ffffff', fl * 0.9);
    [[E.W * 0.12, MOM, 1], [E.W * 0.24, DAD, 1], [E.W * 0.8, SAM, -1], [E.W * 0.92, SHOPPER(2), -1]].forEach(([x, cast, f], i) => drawToon(g, { x, y: E.H * 0.98, s: 1.2, facing: f, cast, pose: breathe(posesAt(t, [[0, 'stand'], [1.3, i % 2 ? 'point' : 'handsOnHead']]), t + i), expr: t > 1.3 ? 'surprised' : 'smile', look: [f * 0.6, -0.3], blink: blink(t + i), rim: { color: '#ffe2b0', dir: [0.7, -0.7], w: 3 } })); }); } });

// h06 "The rise looks the same too."  a glass chart: Cisco 1995-2000 (amber) and Nvidia 2020-2026 (green) draw in and lock together at the peak
function twoCharts(g, t, k, labels) { FP.glass(g, 200, 120, E.W - 400, 760); text(g, 'GROWTH MULTIPLE (x)', 260, 175, { size: 26, color: '#a8b0c0', stroke: 0, align: 'left' });
  for (let i = 1; i < 6; i++) { const y = 240 + i * 100; g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2; g.beginPath(); g.moveTo(260, y); g.lineTo(E.W - 280, y); g.stroke(); text(g, String(50 - i * 10) + 'x', E.W - 250, y, { size: 20, color: 'rgba(255,255,255,.4)', stroke: 0, align: 'left' }); }
  riseLine(g, 260, 240, E.W - 560, 500, CS, k, '#ffb000', 9); riseLine(g, 260, 240, E.W - 560, 500, NVm, k, '#2fd67a', 9);
  rr(g, 280, 790, 280, 50, 25); g.fillStyle = 'rgba(255,176,0,.18)'; g.fill(); text(g, 'CISCO 1995-2000', 420, 816, { size: 22, color: '#ffb000', stroke: 0 }); rr(g, 590, 790, 300, 50, 25); g.fillStyle = 'rgba(47,214,122,.18)'; g.fill(); text(g, 'NVIDIA 2020-2026', 740, 816, { size: 22, color: '#2fd67a', stroke: 0 }); if (labels) labels(); }
registerShot('h06', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.06, z1: 1.0 }); zoomed(g, c, () => { backdrop(g, '#10141e', '#05070c', t, { bokeh: ['#2fd67a', '#ffb000'] }); twoCharts(g, t, ease.inOut(prog(t, 0.1, 2.0))); }); } });

// h07 "From the COVID low in March twenty twenty to the peak this October, Nvidia went up about forty-nine times."
//   a 2026 trading floor: a giant wall screen of candles, rows of slim monitors, traders standing with coffee; the counter climbs 1x -> 49x
registerShot('h07', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.12, x0: -60, x1: 40, y0: 0, y1: -30 });
  zoomed(g, c, () => { g.fillStyle = '#0c0f18'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 10; i++) { g.fillStyle = 'rgba(255,255,255,.04)'; g.fillRect(-E.W + i * 400, 0, 3, E.H); }
    rr(g, 140, 50, E.W - 280, 560, 16); g.fillStyle = '#05070c'; g.fill(); g.strokeStyle = '#2a2e3a'; g.lineWidth = 10; g.stroke(); const k = ease.inOut(prog(t, 0.3, 5.2));
    FP.candles(g, 190, 110, E.W - 520, 460, NV, k, { dec: 0, prefix: '$' }); text(g, 'NVDA  ·  MAR 2020 → OCT 2026', 200, 85, { size: 26, color: '#a8b0c0', stroke: 0, align: 'left' });
    const m = Math.max(1, Math.round(lerp(1, 49, k))); FP.glass(g, E.W - 560, 140, 300, 160); text(g, m + 'x', E.W - 410, 225, { size: 90, color: k >= 0.99 ? '#76ff5a' : '#ffffff', stroke: 0 });
    for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const x = 160 + i * 300 + r * 150, y = 720 + r * 120; rr(g, x, y - 90, 170, 100, 8); g.fillStyle = '#1a1e28'; g.fill(); g.strokeStyle = '#3a3e4a'; g.lineWidth = 4; g.stroke(); g.save(); g.beginPath(); g.rect(x + 8, y - 82, 154, 84); g.clip(); riseLine(g, x + 10, y - 78, 150, 70, NV, k, (i + r) % 3 ? '#2fd67a' : '#5ab4ff', 3); g.restore(); seg(g, [[x + 85, y + 10], [x + 85, y + 30]], 8, '#3a3e4a'); }
    [[E.W * 0.1, MOM], [E.W * 0.3, SAM], [E.W * 0.74, DAD], [E.W * 0.9, ROOMMATE]].forEach(([x, cast], i) => drawToon(g, { x, y: E.H * 1.04, s: 1.3, facing: i < 2 ? 1 : -1, cast, pose: breathe(posesAt(t, [[0, i % 2 ? 'holdFront' : 'stand'], [5.1, 'cheer']]), t + i), expr: t > 5.1 ? 'joy' : 'thinking', look: [0, -0.7], blink: blink(t + i), rim: { color: '#5ab4ff', dir: [0.7, -0.7], w: 3 } })); }); } });

// h08 "Cisco did forty-four, in about five years."  back to the glass chart: badges 49x (6.5 yrs) vs 44x (5 yrs)
registerShot('h08', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }); zoomed(g, c, () => { backdrop(g, '#10141e', '#05070c', t, { bokeh: ['#2fd67a', '#ffb000'] });
  twoCharts(g, t, 1, () => { const a = pop(t, 0.6, 0.4), b = pop(t, 1.3, 0.4); if (b > 0) { g.save(); g.translate(E.W * 0.62, 300); g.scale(b, b); FP.glass(g, -170, -70, 340, 140); text(g, '44x', 0, -14, { size: 60, color: '#ffb000', stroke: 0 }); text(g, 'CISCO · ~5 YEARS', 0, 40, { size: 22, color: '#a8b0c0', stroke: 0 }); g.restore(); }
    if (a > 0) { g.save(); g.translate(E.W * 0.38, 300); g.scale(a, a); FP.glass(g, -170, -70, 340, 140); text(g, '49x', 0, -14, { size: 60, color: '#2fd67a', stroke: 0 }); text(g, 'NVIDIA · ~6.5 YEARS', 0, 40, { size: 22, color: '#a8b0c0', stroke: 0 }); g.restore(); } }); }); } });
