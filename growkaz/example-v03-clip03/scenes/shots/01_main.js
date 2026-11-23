// V03 Clip 3 "who is paying?": a heap of AI chips with a long receipt (PAID BY: ?), the uncomfortable face, back to the 2000 floor,
// the whole world wiring in, and the router rack ("Cisco made the best ones").
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, HERO, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { office2000 } from '/engine/sets3d/office2000.js';
import { D } from '/engine/props2d.js';
import { GREEN, GOLD, INK, Y2K, zoomed, pop, money, backdrop, faceShot } from '/engine/finfx.js';

const RIM2K = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initO = (T) => { const o = office2000(T, { time: 'day' }); Object.assign(o.st, { spots: o.spots, upd: o.update }); return o.st; };
const at = (g, st, p, t, o = {}) => { const q = pin(st, p, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || Y2K, pose: o.pose || breathe(POSES.sit, t), expr: o.expr || 'smile', look: o.look, blink: blink(t), rim: RIM2K }); return q; };
function chip(g, x, y, s, t, ph = 0) { g.save(); g.translate(x, y); g.scale(s, s); glow(g, 0, 0, 120, '#5affb0', 0.18 + 0.08 * Math.sin(t * 4 + ph)); g.fillStyle = '#e0b05a'; for (let i = 0; i < 5; i++) for (const [dx, dy, w, h] of [[-50 + i * 22, -70, 10, 16], [-50 + i * 22, 54, 10, 16], [-70, -50 + i * 22, 16, 10], [54, -50 + i * 22, 16, 10]]) g.fillRect(dx, dy, w, h);
  rr(g, -56, -56, 112, 112, 12); g.fillStyle = '#20262e'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); rr(g, -34, -34, 68, 68, 8); g.strokeStyle = '#5affb0'; g.lineWidth = 3; g.stroke(); g.restore(); }

// b01 "...who is really paying for all these chips?"  a glowing heap of AI chips; a long receipt unrolls; "PAID BY: ?" stamps on
registerShot('b01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: 0, x1: -60 });
  zoomed(g, c, () => { backdrop(g, '#0e1a26', '#06101a', t, { bokeh: ['#5affb0', '#a0e0ff'] });
    for (let i = 0; i < 26; i++) { const row = Math.floor(Math.sqrt(i * 2)), x = E.W * 0.36 + ((i * 97) % 9 - 4) * 70 + Math.sin(i) * 20, y = E.H * 0.9 - row * 90 - (i % 3) * 20, d = prog(t, i * 0.05, i * 0.05 + 0.4);
      if (d > 0) chip(g, x, y - 300 * (1 - ease.outBack(d)), 0.9 - row * 0.05, t, i); }
    const k = ease.out(prog(t, 0.6, 2.6)), rx = E.W * 0.74, top = E.H * 0.12, len = lerp(0, E.H * 0.7, k);
    rr(g, rx - 170, top, 340, len + 40, 10); g.fillStyle = '#fbf8f0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
    g.save(); g.beginPath(); g.rect(rx - 170, top, 340, len + 40); g.clip(); text(g, 'AI CHIPS', rx, top + 50, { size: 38, color: INK, stroke: 0 });
    for (let i = 0; i < 9; i++) { const y = top + 110 + i * 56; seg(g, [[rx - 140, y], [rx + 40, y]], 8, '#c8ccd4'); text(g, '$' + (90 + i * 37) + 'B', rx + 100, y + 2, { size: 28, color: '#4a4a5a', stroke: 0 }); }
    g.restore();
    const s = pop(t, 3.35, 0.35); if (s > 0) { g.save(); g.translate(rx, top + len - 40); g.rotate(-0.12); g.scale(s, s); rr(g, -190, -60, 380, 120, 16); g.fillStyle = alpha('#e0302a', 0.12); g.fill(); g.strokeStyle = '#e0302a'; g.lineWidth = 8; g.stroke(); text(g, 'PAID BY: ?', 0, 4, { size: 58, color: '#e0302a', stroke: 0 }); g.restore(); } }); } });

// b02 "That's where this gets uncomfortable."  2026-you, giant nervous face; the light dims; a sweat drop
registerShot('b02', { draw(g, t, info) { faceShot(g, t, info, HERO, '#9fc8ff', null, ['#1a2240', '#0a0d1c', ['#a0e0ff']], { expr: (t) => 'worried', look: [-0.3, 0.1],
  extra: (g, t) => { const d = prog(t, 0.9, 2.2); if (d > 0) { const x = E.W / 2 + 170, y = E.H * 0.42 + 160 * ease.in(d); g.save(); g.globalAlpha = 1 - d * 0.5; g.fillStyle = '#9fd8ff'; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y - 34); g.quadraticCurveTo(x + 22, y, x, y + 14); g.quadraticCurveTo(x - 22, y, x, y - 34); g.fill(); g.stroke(); g.restore(); }
    veil(g, '#05040c', 0.35 * ease.inOut(prog(t, 0.6, 2.0))); } }); } });

// b03 "Start with the two thousand version of you, because we already know how that story ends."  the 2000 floor: you at the beige CRT, push in
registerShot('b03', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t + 10); const h = st.spots.heroChair; cam3(st, t, info.dur, { from: { pos: [h[0] - 2.4, 1.7, h[2] + 3.4], look: [h[0] + 0.2, 1.1, h[2] - 0.8], fov: 42 }, to: { pos: [h[0] - 1.5, 1.5, h[2] + 2.4], look: [h[0] + 0.1, 1.1, h[2] - 0.7], fov: 38 } }); },
  overlay(g, t, info, st) { st.spots.deskSeats.forEach((p, i) => { if (i > 7 || i % 2 === 0) return; at(g, st, p, t + i, { cast: SHOPPER(i % 4), facing: 1, expr: 'happy' }); });
    at(g, st, st.spots.heroChair, t, { cast: Y2K, facing: 1, pose: breathe(posesAt(t, [[0, 'sit'], [2.6, 'reach'], [3.2, 'sit']]), t), expr: 'happy', look: [0.4, 0.2] }); } });

// b04 "In the late nineties, every company on Earth had to get online."  a globe; little office buildings around it light up one by one and wire in
registerShot('b04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.1, z1: 1.0 });
  zoomed(g, c, () => { backdrop(g, '#1c1a3a', '#0c0a1c', t, { bokeh: ['#ffd08a', '#a0c0ff'] }); FX.stars(g, t, { count: 80, area: [0, 0, E.W, E.H] });
    const gx = E.W / 2, gy = E.H * 0.5, R = 210; glow(g, gx, gy, 420, '#6ab8ff', 0.22);
    const N = 10; for (let i = 0; i < N; i++) { const a = -Math.PI / 2 + i * Math.PI * 2 / N, bx = gx + Math.cos(a) * 640, by = gy + Math.sin(a) * 380, on = t > 1.45 + i * 0.12;
      g.strokeStyle = on ? '#7affc0' : alpha('#ffffff', 0.12); g.lineWidth = on ? 6 : 3; g.setLineDash(on ? [] : [10, 12]); g.beginPath(); g.moveTo(gx + Math.cos(a) * R, gy + Math.sin(a) * R); g.lineTo(bx, by); g.stroke(); g.setLineDash([]);
      if (on) { const p = ((t * 0.9 + i * 0.13) % 1); circle(g, lerp(bx, gx + Math.cos(a) * R, p), lerp(by, gy + Math.sin(a) * R, p), 8, '#ffffff'); }
      g.save(); g.translate(bx, by + 90); g.scale(0.42, 0.42); D.house(g, 0, 0, 1, { color: ['#f4d0a0', '#a8c8f0', '#f0b8c8', '#c8e8b0'][i % 4], roof: ['#c0563a', '#4a78b8', '#7a4e8a', '#2f8a57'][i % 4] }); g.restore(); if (on) glow(g, bx, by, 90, '#ffe28a', 0.35); }
    circle(g, gx, gy, R + 8, INK); circle(g, gx, gy, R, '#3a8ad8'); g.save(); g.beginPath(); g.arc(gx, gy, R, 0, 7); g.clip(); const off = (t * 70) % 700; g.fillStyle = '#5ac46a';
    for (let i = -1; i < 3; i++) { const bx = gx - 450 + i * 350 + off; g.beginPath(); g.ellipse(bx, gy - 60, 95, 60, 0.4, 0, 7); g.fill(); g.beginPath(); g.ellipse(bx + 120, gy + 60, 70, 90, -0.3, 0, 7); g.fill(); } g.restore();
    text(g, "'90s", gx, gy - R - 60, { size: 64, color: '#ffffff', stroke: 8, strokeColor: INK }); }); } });

// b05 "To get online, you needed routers and switches, and Cisco made the best ones."  the router rack in the 2000 office; 'best' = a gold star
registerShot('b05', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t + 14); const r = st.spots.rack; cam3(st, t, info.dur, { from: { pos: [r[0] - 1.6, 1.6, r[2] + 3.0], look: [r[0], 1.05, r[2]], fov: 44 }, to: { pos: [r[0] - 1.0, 1.35, r[2] + 2.0], look: [r[0], 1.0, r[2]], fov: 40 } }); },
  overlay(g, t, info, st) { const s = screenOf(st, [st.spots.rack[0], 2.0, st.spots.rack[2]]);
    g.save(); g.globalCompositeOperation = 'lighter'; FX.rings(g, s.x, s.y + 160, t, { color: '#5ab4ff', a: 0.22 }); g.restore();
    const k = pop(t, 3.88, 0.45); if (k > 0) { g.save(); g.translate(clamp(s.x + 40, 200, E.W - 200), clamp(s.y - 90, 180, E.H - 200)); g.scale(0.9 * k, 0.9 * k); D.star(g, 0, 0, 1, { glow: true }); g.restore(); } } });
