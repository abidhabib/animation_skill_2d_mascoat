// V02 Clip 28 "the mirror: 31" (GrowKaz engine + our cast). Night bathroom, mirror reflection, bar-chart comparison, quiet inserts.
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, shake, rr, seg, circle, glow, alpha, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, MOM, DAD, SAM, ROOMMATE, STRANGER } from '/engine/toon2d.js';
import { blink, headNum, camEase } from '/engine/storyfx.js';
import { bathroom, mirrorRect, mirrorGlass } from '/engine/sets/bathroom.js';
import { bedroom, bedGround } from '/engine/sets/bedroom.js';

const RED = '#ff8a7a', GREEN = '#8dffc8', GOLD = '#ffe28a';
const W = { k09: 1.84 };
const night = (g) => { g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(70,80,130,0.55)'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.restore(); };
// the mirror scene: your reflection in the glass (+ optional number above it), you in the foreground from behind-ish
function mirror(g, t, info, o = {}) {
  const cam = camEase(t, info.dur, o.cam || { z0: 1.0, z1: 1.06 });
  const { GY, m } = bathroom(g, t, cam);
  const s = V(1.6, 1.6), rs = s * 1.35, rx = E.W / 2 + 60, ry = m.y + m.h + 230, hy = ry - 300 * rs;
  layer(g, cam, 0.6, (g) => {
    g.save(); g.beginPath(); g.rect(m.x, m.y, m.w, m.h); g.clip();
    drawToon(g, { x: rx, y: ry, s: rs, facing: -1, cast: HERO, pose: o.rpose || POSES.stand, expr: o.expr || 'neutral', look: o.look, talk: o.talk, blink: o.blink ?? blink(t), rim: false, shadow: false, alpha: 0.9 });
    if (o.brush) { const bx = rx - 50, by = ry - 228 * rs + Math.sin(t * 16) * 6; seg(g, [[bx, by], [bx - 70, by + 50]], 12, '#4a9ae0'); for (let i = 0; i < 6; i++) circle(g, bx + 10 + (i % 3) * 10, by + 14 + Math.floor(i / 3) * 10, 8, '#ffffff'); }
    if (o.num) o.num(g, rx, hy);
    mirrorGlass(g, m); g.restore();
  });
  layer(g, cam, 1, (g) => drawToon(g, { x: E.W / 2 - 330, y: GY + 190, s: s * 1.5, facing: 1, cast: HERO, pose: o.fpose || POSES.stand, expr: o.expr || 'neutral', rim: false, shadow: false }));
  night(g); glow(g, E.W / 2, m.y - 40, 520, '#fff2c8', 0.25);
  return { m, rx, hy };
}

// k01 "That night, you brush your teeth."  night bathroom: brushing, the reflection brushes too
registerShot('k01', { draw(g, t, info) { mirror(g, t, info, { brush: true, expr: 'tired', blink: blink(t, 2.4), cam: { z0: 1.0, z1: 1.04, x0: -30, x1: 10 } }); } });
// k02 "You look up."  closer on the mirror: the reflection's eyes lift
registerShot('k02', { draw(g, t, info) { mirror(g, t, info, { brush: true, expr: 'neutral', look: t < 0.3 ? [0, 0.6] : [0, -0.3], cam: { z0: 1.15, z1: 1.2, y0: -60, y1: -70 } }); } });
// k03 "And above your own head, in the mirror, there's a number."  a soft blurred glow forms above the reflection
registerShot('k03', { draw(g, t, info) { mirror(g, t, info, { expr: 'surprised', look: [0, -0.8], cam: { z0: 1.2, z1: 1.3, y0: -90, y1: -130 },
  num: (g, x, y) => { const k = ease.inOut(prog(t, 0.6, info.dur)); glow(g, x, y, 200 * k, RED, 0.5 * k); g.save(); g.filter = 'blur(10px)'; g.globalAlpha = k; text(g, '??', x, y + 10, { size: 70, color: RED, stroke: 0 }); g.restore(); } }); } });
// k04 "You never thought you'd see yourself."  giant face, the realisation, red glow from above
registerShot('k04', { draw(g, t, info) {
  g.fillStyle = '#1c2030'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, -80, 800, RED, 0.35);
  const r = V(230, 260) * camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z;
  bigToonFace(g, E.W / 2, E.H * 0.55, r, { cast: HERO, expr: 'shocked', look: [0, -0.7], blink: false, rimColor: RED });
} });
// k05 "But everyone, includes you."  the faces from this week flash by in a row with their numbers... and the last slot is you
registerShot('k05', { draw(g, t, info) {
  g.fillStyle = '#161322'; g.fillRect(0, 0, E.W, E.H);
  const row = [[MOM, '99', GREEN], [ROOMMATE, '62', GREEN], [DAD, '96', GREEN], [SAM, '53', GREEN], [STRANGER, '50', GREEN], [HERO, '?', RED]];
  const slide = camEase(t, info.dur, { x0: 0, x1: -420 }).x;
  row.forEach(([c, n, col], i) => { const x = E.W * 0.15 + i * 330 + slide, p = ease.outBack(prog(t, 0.1 + i * 0.22, 0.4 + i * 0.22)); if (p <= 0) return;
    g.save(); g.translate(x, E.H * 0.58); g.scale(p, p); if (i === 5) glow(g, 0, 0, 260, RED, 0.35); bigToonFace(g, 0, 0, 95, { cast: c, expr: i === 5 ? 'worried' : 'neutral', blink: blink(t + i) }); g.restore();
    headNum(g, x, E.H * 0.58 - 200, n, t, 0.2 + i * 0.22, { size: 54, color: col }); });
} });
// k06 [silence]  the mirror, very still: the blurred number above your reflection slowly comes into focus; heartbeat
registerShot('k06', { draw(g, t, info) { mirror(g, t, info, { expr: 'worried', look: [0, -0.8], blink: false, cam: { z0: 1.32, z1: 1.38, y0: -140, y1: -150 },
  num: (g, x, y) => { const k = ease.inOut(prog(t, 0, info.dur)); glow(g, x, y, 220, RED, 0.5); g.save(); g.filter = `blur(${(10 * (1 - k)).toFixed(1)}px)`; text(g, k > 0.85 ? '31' : '??', x, y + 10, { size: 74, color: RED, stroke: 0 }); g.restore(); } }); } });
// k07 "Thirty-one."  sharp red 31 above your reflection, a small jolt
registerShot('k07', { draw(g, t, info) { const [sx, sy] = t < 0.4 ? shake(t, 5 * (1 - t / 0.4), 30) : [0, 0];
  g.save(); g.translate(sx, sy); mirror(g, t, info, { expr: 'sad', look: [0, -0.8], blink: false, cam: { z0: 1.38, z1: 1.42, y0: -150, y1: -155 },
    num: (g, x, y) => { glow(g, x, y, 240, RED, 0.55); headNum(g, x, y, '31', t, -1, { size: 80, color: RED }); } }); g.restore(); } });
// k08 "The lowest number you've seen all week."  a bar chart of the week's people; yours is the shortest, red
const BARS = [[MOM, 99], [DAD, 96], [ROOMMATE, 62], [SAM, 53], [STRANGER, 50], [HERO, 31]];
function bars(g, t, dur, focus) {
  g.fillStyle = '#161322'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H, 900, '#2a2040', 0.6);
  const base = E.H * 0.82, bw = 170, gap = 90, x0 = E.W / 2 - (BARS.length * (bw + gap) - gap) / 2;
  seg(g, [[x0 - 40, base], [x0 + BARS.length * (bw + gap), base]], 4, alpha('#ffffff', 0.3));
  BARS.forEach(([c, v], i) => { const k = ease.out(prog(t, 0.05 + i * 0.1, 0.6 + i * 0.1)), h = v * 5.6 * k, x = x0 + i * (bw + gap), me = i === 5, dim = focus && !focus.includes(i) ? 0.25 : 1;
    g.save(); g.globalAlpha = dim; rr(g, x, base - h, bw, h, 14); g.fillStyle = me ? '#d24a3a' : '#4fae8a'; g.fill(); if (me) glow(g, x + bw / 2, base - h / 2, 200, RED, 0.3);
    bigToonFace(g, x + bw / 2, base + 80, 46, { cast: c, expr: me ? 'sad' : 'neutral' }); if (k > 0.5) text(g, String(Math.round(v * k)), x + bw / 2, base - h - 40, { size: 50, color: me ? RED : '#ffffff', stroke: 0 }); g.restore(); });
}
registerShot('k08', { draw(g, t, info) { const k = camEase(t, info.dur, { z0: 1.0, z1: 1.04 }).z; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2); bars(g, t, info.dur); g.restore(); } });
// k09 "Lower than the stranger. Lower than Sam."  same chart: the stranger's bar lights, then Sam's, each next to yours
registerShot('k09', { draw(g, t, info) { const k = camEase(t, info.dur, { z0: 1.15, z1: 1.3 }).z, fx = E.W * 0.66, fy = E.H * 0.62; g.save(); g.translate(fx, fy); g.scale(k, k); g.translate(-fx, -fy);
  bars(g, 10, info.dur, t < W.k09 ? [4, 5] : [3, 5]); g.restore(); } });
// k10 "Every workout you skipped."  under the bed: dusty dumbbells, a gym bag with the tag still on; dust drifts
registerShot('k10', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.65, z1: 1.75, x0: 140 / 0.85, x1: 190 / 0.85, y0: (bedGround() - 60 - E.H / 2) / 0.85, y1: (bedGround() - 60 - E.H / 2) / 0.85 });
  bedroom(g, t, cam, { mood: 'night' });
  layer(g, cam, 0.85, (g) => { const y = bedGround() + 80, x = E.W / 2 - 60;
    for (const dx of [0, 160]) { seg(g, [[x + dx - 50, y - 26], [x + dx + 50, y - 26]], 14, '#6a6a78'); for (const e of [-1, 1]) rr(g, x + dx + e * 50 - 18, y - 60, 36, 68, 10), g.fillStyle = '#3a3a48', g.fill(); }
    rr(g, x + 300, y - 120, 260, 120, 30); g.fillStyle = '#c0563a'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 5; g.stroke(); seg(g, [[x + 560, y - 100], [x + 600, y - 60]], 3, '#1b1424'); rr(g, x + 590, y - 70, 40, 54, 6); g.fillStyle = '#f4f0e6'; g.fill();
    g.fillStyle = alpha('#d8d4c8', 0.35); g.fillRect(x - 80, y - 66, 720, 8); });
  FX.dust(g, t, { count: 50, color: '#d8d4c8', a: 0.35 });
} });
// k11 "Every I'll start Monday."  a calendar: Monday circled, crossed out, circled again... week after week
registerShot('k11', { draw(g, t, info) {
  g.fillStyle = '#1e1c2a'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H * 0.4, 800, '#3a3050', 0.6);
  const k = camEase(t, info.dur, { z0: 1.0, z1: 1.06 }).z; g.save(); g.translate(E.W / 2, E.H / 2); g.scale(k, k); g.translate(-E.W / 2, -E.H / 2);
  const cx = E.W / 2, cy = E.H * 0.52, w = 900, h = 620; rr(g, cx - w / 2, cy - h / 2, w, h, 16); g.fillStyle = '#f4efe4'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 7; g.stroke();
  rr(g, cx - w / 2, cy - h / 2, w, 90, 16); g.fillStyle = '#5a6a9a'; g.fill();
  for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++) { rr(g, cx - w / 2 + 20 + i * 124, cy - h / 2 + 110 + r * 122, 110, 108, 8); g.fillStyle = i === 0 ? '#fde8dc' : '#ebe5d8'; g.fill(); }
  for (let r = 0; r < 4; r++) { const t0 = 0.15 + r * 0.45, p = prog(t, t0, t0 + 0.25), q = prog(t, t0 + 0.28, t0 + 0.42); if (p <= 0) continue; const x = cx - w / 2 + 75, y = cy - h / 2 + 164 + r * 122;
    g.strokeStyle = '#e0562f'; g.lineWidth = 7; g.beginPath(); g.ellipse(x, y, 50, 44, 0, 0, Math.PI * 2 * p); g.stroke(); if (q > 0) { seg(g, [[x - 45, y - 40], [x - 45 + 90 * q, y - 40 + 80 * q]], 8, '#1b1424'); } }
  g.restore();
} });
// k12 "Every promise to yourself, broken quietly, where nobody saw."  back to the mirror: just you and your 31, the light dims; slow pull-out
registerShot('k12', { draw(g, t, info) { mirror(g, t, info, { expr: 'sad', look: [0, 0.4], cam: { z0: 1.3, z1: 1.0, y0: -120, y1: 0 },
  num: (g, x, y) => { glow(g, x, y, 200, RED, 0.45); headNum(g, x, y, '31', t, -1, { size: 70, color: RED }); } });
  veil(g, '#05050c', 0.35 * ease.inOut(prog(t, info.dur * 0.4, info.dur))); } });
