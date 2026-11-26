// V06 "What If You Could Only Fix One Thing a Day?" Clip 1: the hook. Night teal wall + butter-yellow note.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, note, hand, clockOn, slapLines, INK } from '/engine/notewall.js';

const W = () => E.W, H = () => E.H;
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const hw = (g, s, x, y, size, color = '#fff3d6') => text(g, s, x, y, { size, color, family: 'Caveat', weight: 700, stroke: 10, strokeColor: '#0a1a22' });
// local time when a script word is spoken
const at = (info, word, dflt) => { const w = E.words.find((w) => w.start >= info.shot.start - 0.1 && w.word.toLowerCase().replace(/[^a-z]/g, '') === word); return w ? w.start - info.shot.start : dflt; };
// a note slapping onto the wall at time t0: drops in big, squashes, settles
function slapNote(g, x, y, s, t, t0, o = {}) { const k = prog(t, t0, t0 + 0.14); if (t < t0) return; const q = t - t0, sq = Math.exp(-q * 12) * Math.sin(q * 38) * 0.09;
  note(g, x, y, s * lerp(1.8, 1, ease.in(k)) * (1 + sq), { ...o }); slapLines(g, x, y, prog(t, t0 + 0.12, t0 + 0.5), 230 * s); }
// 2D bed: headboard, pillow, duvet. sit = hero sitting up in it
function bed(g, x, y, t, who) { box(g, x - 430, y - 360, 70, 360, '#8a5636', 28); box(g, x - 390, y - 180, 760, 120, '#f4efe6', 30);
  box(g, x - 355, y - 250, 200, 100, '#ffffff', 46); if (who) who(); box(g, x - 170, y - 190, 560, 170, '#e8704a', 60); box(g, x - 190, y - 195, 90, 175, '#f4a070', 40);
  box(g, x - 410, y - 70, 820, 80, '#6a3f28', 20); for (const d of [-370, 340]) box(g, x + d, y, 40, 50, '#4a2a1a', 8); }
function darkness(g, a) { if (a > 0) veil(g, '#03070c', a); }

// a: black, SLAP, the clock turns to midnight
reg('a', { draw(g, t, info) { const sl = 0.55;
  if (t < sl) { grad(g, [[0, '#02060a'], [1, '#02060a']]); clockOn(g, W() / 2, H() / 2, 170, 11, 59); darkness(g, 0.25); return; }
  const sh = Math.exp(-(t - sl) * 9) * Math.sin(t * 90) * 16;
  cam(g, t, info.dur, [1.06, 0.5, 0.48], [1.16, 0.52, 0.46], () => { g.translate(sh, 0); noteWall(g, t); clockOn(g, 640, 300, 105, 12, 0); slapNote(g, 1070, 470, 1.15, t, sl); });
  motes(g, t, '#ffd98a', 18); vig(g, 0.55); darkness(g, 1 - prog(t, sl, sl + 0.12)); } });

// b: you wake up and see it
reg('b', { draw(g, t, info) { const tw = at(info, 'wall', 1.1), tj = at(info, 'job', 2.4);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.2, 0.52, 0.55], () => { noteWall(g, t); clockOn(g, 700, 230, 70, 12, 0);
    note(g, 1180, 430, 0.72, { rot: -0.04 + (t > tj ? Math.sin((t - tj) * 18) * 0.12 * Math.exp(-(t - tj) * 5) : 0) }); glow(g, 1180, 430, 300, '#ffd64a', 0.2 + 0.25 * prog(t, tw, tw + 0.4));
    const y = H() * 0.9; bed(g, 620, y, t, () => drawToon(g, { x: 590, y: y + 40, s: 2.2, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.5, expr: t < tw ? 'sleepy' : t < tj ? 'surprised' : 'confused', look: t < tw ? [0, 0] : [0.8, -0.15] })); });
  motes(g, t, '#ffd98a', 14); vig(g, 0.55); } });

// c: one yellow note / one thing to fix / every single day
reg('c', { draw(g, t, info) { const t1 = at(info, 'one', 0.1), t2 = Math.max(t1 + 0.8, at(info, 'thing', 1.7) - 0.3), t3 = at(info, 'every', 3.1);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.5], () => { noteWall(g, t); veil(g, '#06141c', 0.35);
    const p3 = ease.inOut(prog(t, t3, t3 + 0.35));
    // days: notes line up across the wall
    for (let i = 0; i < 6; i++) { const k = ease.outBack(prog(t, t3 + 0.12 * i, t3 + 0.12 * i + 0.3)); if (k <= 0 || i === 2) continue; note(g, 330 + i * 255, 500, 0.62 * k, { rot: ((i % 3) - 1) * 0.07, text: 'day ' + (i + 1), size: 70 }); }
    const x = lerp(960, 330 + 2 * 255, p3), s = lerp(1.35, 0.62, p3);
    note(g, x, lerp(500, 500, p3), s * (1 + 0.1 * Math.exp(-Math.max(0, t - t2) * 8) * (t > t2 ? 1 : 0)), { rot: -0.05, text: p3 > 0.6 ? 'day 3' : t > t2 ? ['fix', '1 thing'] : [], k: prog(t, t2, t2 + 0.5), size: p3 > 0.6 ? 70 : 82 }); });
  motes(g, t, '#ffd98a', 16); vig(g, 0.55); } });

// d: you pull it off, another appears
reg('d', { draw(g, t, info) { const tp = at(info, 'pull', 0.2), ta = at(info, 'another', 1.2);
  cam(g, t, info.dur, [1.02, 0.55, 0.5], [1.14, 0.56, 0.48], () => { noteWall(g, t);
    drawToon(g, { x: 640, y: H() * 0.95, s: 2.65, cast: HERO, actions: [[0, 'reach'], [tp + 0.45, 'idle'], [ta, 'recoil']], t, facing: 1, yaw: 0.7, expr: t < ta ? 'determined' : 'shocked', look: [0.8, -0.2] });
    const p = ease.inOut(prog(t, tp + 0.15, tp + 0.75)); const nx = lerp(1150, 1560, p), ny = lerp(450, 700, p);
    note(g, nx, ny, 0.8, { rot: -0.04 + p * 0.5, curl: 0.12 + p * 0.2 }); hand(g, nx + 90, ny + 100, [330, 520], { s: 0.9 });
    slapNote(g, 1150, 450, 0.8, t, ta); });
  vig(g, 0.5); } });

// e: you tear it in half... it's back
reg('e', { draw(g, t, info) { const tt = at(info, 'tear', 0.15) + 0.25, tb = at(info, 'back', 1.9) - 0.35;
  const sh = t > tb ? Math.exp(-(t - tb) * 9) * Math.sin(t * 90) * 14 : 0;
  cam(g, t, info.dur, [1.12, 0.5, 0.5], [1.02, 0.5, 0.5], () => { g.translate(sh, 0); noteWall(g, t); veil(g, '#06141c', 0.25);
    const p = ease.out(prog(t, tt, tt + 0.55)), fall = ease.in(prog(t, tt + 0.55, tt + 1.25)) * 800;
    for (const d of [-1, 1]) { const cx = 960 + d * 230 * p, cy = 560 + fall; g.save(); g.translate(cx, cy); g.rotate(d * 0.28 * p); g.translate(-cx, -cy); g.beginPath();
      const zig = [[cx, cy - 260]]; for (let i = 1; i < 9; i++) zig.push([cx + (i % 2 ? 20 : -20) * (p > 0.02 ? 1 : 0), cy - 260 + i * 60]); zig.push([cx, cy + 280]);
      zig.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.lineTo(cx + d * 420, cy + 280); g.lineTo(cx + d * 420, cy - 260); g.closePath(); g.clip(); note(g, cx, cy, 1.15, { rot: 0 }); g.restore();
      if (t < tt + 1.2) hand(g, cx + d * 150, cy + 90, [d * 420, 480], { s: 1.05, flip: d > 0 }); }
    slapNote(g, 960, 420, 1.15, t, tb); });
  vig(g, 0.55); } });

// f: perfectly straight, completely blank -> your face
reg('f', { draw(g, t, info) { const tc = at(info, 'completely', 1.5);
  if (t < tc) { cam(g, t, tc, [1.0, 0.5, 0.45], [1.5, 0.5, 0.42], () => { noteWall(g, t); note(g, 960, 450, 1.05, { rot: 0, curl: 0.06 });
      const k = ease.out(prog(t, 0.1, 0.6)); seg(g, [[960 - 260 * k, 670], [960 + 260 * k, 670]], 8, '#fff3d6'); for (const d of [-1, 1]) seg(g, [[960 + d * 260 * k, 645], [960 + d * 260 * k, 695]], 8, '#fff3d6'); }); }
  else { const u = t - tc; grad(g, [[0, '#123a46'], [1, '#061820']]); glow(g, W() * 0.8, H() * 0.35, 800, '#ffd64a', 0.28);
    cam(g, u, info.dur - tc, [1.0, 0.5, 0.5], [1.16, 0.5, 0.45], () => bigToonFace(g, W() / 2, H() * 0.5, 285, { cast: HERO, expr: 'confused', t, look: [0.5, 0] })); }
  motes(g, t, '#ffd98a', 14); vig(g, 0.6); } });

// g: four words appear underneath: Fix one thing. Only.
reg('g', { draw(g, t, info) { const times = [at(info, 'fix', 2.35), at(info, 'one', 2.9), at(info, 'thing', 3.45), at(info, 'only', 4.1)], words = ['Fix', 'one', 'thing.', 'Only.'];
  cam(g, t, info.dur, [1.0, 0.5, 0.48], [1.32, 0.5, 0.62], () => { noteWall(g, t); veil(g, '#04101a', 0.45 * prog(t, 0.2, 1.6)); note(g, 960, 360, 0.95, { rot: -0.02 }); glow(g, 960, 360, 360, '#ffd64a', 0.25);
    const xs = [600, 810, 1050, 1330]; words.forEach((w, i) => { const k = prog(t, times[i], times[i] + 0.28); if (k <= 0) return; g.save(); g.translate(xs[i], 730); g.rotate((i % 2 ? 1 : -1) * 0.025); const s = 0.9 + 0.1 * ease.outBack(k); g.scale(s, s);
      g.beginPath(); g.rect(-220, -110, 440 * k, 220); g.clip(); glow(g, 0, 0, 170, i === 3 ? '#ff7a4a' : '#ffe9b0', 0.22); hw(g, w, 0, 0, 130, i === 3 ? '#ff9a5a' : '#fff3d6'); g.restore(); }); });
  motes(g, t, '#ffe9b0', 24); vig(g, 0.65); } });

// h: at first, the best thing ever
reg('h', { draw(g, t, info) { grad(g, [[0, '#8fe0cc'], [0.65, '#d8f6e8'], [1, '#6ab8a4']]); glow(g, W() / 2, H() * 0.35, 900, '#fff8d8', 0.6); const tb = at(info, 'best', 1.7);
  for (let i = 0; i < 14; i++) { const p = (t * 0.28 + i * 0.077) % 1; note(g, W() * (((i * 61) % 100) / 100), lerp(H() + 120, -140, p), 0.22, { rot: Math.sin(t * 2 + i) * 0.4 }); }
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.5, 0.46], () => bigToonFace(g, W() / 2, H() * 0.5 - (t > tb ? Math.abs(Math.sin((t - tb) * 6)) * 18 : 0), 290, { cast: HERO, expr: t < tb ? 'friendly' : 'excited', t }));
  vig(g, 0.25); } });

// i: twelve days later: day counter, jar fills, tidy and bright
reg('i', { draw(g, t, info) { const p = ease.inOut(prog(t, 0.15, info.dur * 0.7)), n = Math.max(1, Math.min(12, 1 + Math.floor(p * 11.99))), tl = at(info, 'looks', 1.8);
  cam(g, t, info.dur, [1.12, 0.45, 0.5], [1.0, 0.5, 0.5], () => { grad(g, [[0, '#bfeee0'], [1, '#f4ffe8']]); box(g, -100, H() * 0.86, W() + 200, 400, '#c9a172', 0);
    glow(g, 420, 260, 600, '#fff6c8', 0.7); box(g, 150, 130, 420, 400, '#8fd0f4', 20, 10); circle(g, 440, 240, 60, '#ffe27a'); seg(g, [[360, 130], [360, 530]], 12, '#ffffff'); seg(g, [[150, 330], [570, 330]], 12, '#ffffff');
    // tear-off calendar
    box(g, 700, 170, 330, 360, '#fffaf0', 24); box(g, 700, 170, 330, 90, '#e8643c', 24); text(g, 'DAY', 865, 217, { size: 54, color: '#fffaf0' }); const bump = 1 + 0.12 * Math.max(0, 1 - ((p * 11.99) % 1) * 4); g.save(); g.translate(865, 395); g.scale(bump, bump); text(g, String(n), 0, 0, { size: 190, color: INK }); g.restore();
    // the jar of finished notes
    const jx = 1330, jb = H() * 0.86; for (let i = 0; i < n; i++) { const c = i % 4, row = Math.floor(i / 4); note(g, jx - 120 + c * 80 + (row % 2) * 18, jb - 60 - row * 88, 0.26, { rot: ((i * 7) % 5 - 2) * 0.16 }); }
    rr(g, jx - 210, jb - 420, 420, 420, 70); g.fillStyle = 'rgba(190,235,250,.22)'; g.fill(); g.strokeStyle = INK; g.lineWidth = 9; g.stroke(); box(g, jx - 170, jb - 470, 340, 60, '#c8744a', 18); seg(g, [[jx - 160, jb - 350], [jx - 160, jb - 110]], 18, 'rgba(255,255,255,.75)');
    drawToon(g, { x: 1690, y: H() * 0.93, s: 2.3, cast: HERO, actions: [[0, 'idle'], [tl, 'handsHips']], t, facing: -1, yaw: 0.55, expr: t < tl ? 'friendly' : 'confident' }); });
  motes(g, t, '#ffffff', 14); vig(g, 0.2); } });

// j: but on day thirteen, you write six words -> the old curled note
reg('j', { draw(g, t, info) { const t13 = at(info, 'thirteen', 0.95), tw = at(info, 'write', 1.5), t6 = at(info, 'six', 2.05), flash = Math.max(t6 + 0.75, info.dur - 0.85);
  if (t < flash) { cam(g, t, flash, [1.0, 0.5, 0.5], [1.2, 0.5, 0.52], () => { noteWall(g, t, { lamp: 0.45 }); veil(g, '#02080e', 0.5);
      const k13 = ease.outBack(prog(t, t13, t13 + 0.3)); if (k13 > 0) { g.save(); g.translate(960, 150); g.scale(k13, k13); hw(g, 'Day 13', 0, 0, 150, '#ff9a5a'); g.restore(); }
      note(g, 960, 570, 1.5, { rot: -0.015 });
      // six words get scratched in, one stroke each, unreadable on purpose
      for (let i = 0; i < 6; i++) { const s = tw + 0.12 + i * 0.17, k = prog(t, s, s + 0.15); if (k <= 0) continue; const x = 790 + (i % 3) * 125, y = 540 + Math.floor(i / 3) * 110; g.strokeStyle = '#33231c'; g.lineWidth = 9; g.lineCap = 'round'; g.beginPath(); g.moveTo(x, y); for (let j = 1; j <= Math.ceil(k * 8); j++) g.lineTo(x + j * 12, y + (j % 2 ? -22 : 8)); g.stroke(); }
      const hi = clamp((t - tw - 0.12) / 1.02), hx = 790 + ((hi * 5.99) % 3) * 125 + 60, hy = 560 + Math.floor(hi * 1.999) * 110; const inK = ease.out(prog(t, tw - 0.4, tw));
      if (inK > 0) { const px = lerp(1900, hx, inK), py = lerp(1200, hy, inK); seg(g, [[px, py], [px + 120, py + 120]], 26, INK); seg(g, [[px + 6, py + 6], [px + 114, py + 114]], 14, '#4a78b8'); hand(g, px + 110, py + 120, [420, 380], { s: 1 }); } }); vig(g, 0.7); }
  else { const u = t - flash; grad(g, [[0, '#1a1208'], [1, '#060402']]); glow(g, 960, 540, 700, '#ffb030', 0.3); cam(g, u, info.dur - flash, [1.05, 0.5, 0.5], [1.3, 0.5, 0.52], () => note(g, 960, 540, 1.9, { rot: 0.07, curl: 0.32, age: 1 })); veil(g, '#fff2c8', Math.max(0, 0.7 - u * 4)); vig(g, 0.7); } } });
