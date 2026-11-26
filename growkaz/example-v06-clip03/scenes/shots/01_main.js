// V06 Clip 3: six beautiful minutes, the 3 a.m. toaster, tomorrow, and the first rule. Fuller frames (supporting props).
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, note, hand, clockOn, slapLines, frameArt, shelfBoard, sideTable, rug, fairyLights, INK } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';

const W = () => E.W, H = () => E.H;
const box = (g, x, y, w, h, fill, r = 14, lw = 6) => { rr(g, x, y, w, h, r); g.fillStyle = fill; g.fill(); if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
const hw = (g, s, x, y, size, color = '#33231c') => text(g, s, x, y, { size, color, family: 'Caveat', weight: 700 });
const at = (info, word, dflt) => { const w = E.words.find((w) => w.start >= info.shot.start - 0.15 && w.start <= info.shot.end && w.word.toLowerCase().replace(/[^a-z]/g, '') === word); return w ? w.start - info.shot.start : dflt; };
// bedroom backdrop with a back wall of props and a floor line
function room(g, t, top, bot, o = {}) { grad(g, [[0, top], [0.8, bot], [1, bot]]); for (let x = -W(); x < W() * 2; x += 130) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(x, -H(), 60, H() * 2); }
  g.fillStyle = o.floor || '#4a2c24'; g.fillRect(-W(), H() * 0.88, W() * 3, H()); seg(g, [[-W(), H() * 0.88], [W() * 2, H() * 0.88]], 8, INK);
  frameArt(g, 260, 300, 190, 240, 0); frameArt(g, 480, 340, 140, 170, 1); shelfBoard(g, 1580, 420, 440); D.bookStack(g, 1480, 420, 0.8, {}); D.plant(g, 1680, 420, 0.75, { kind: 'leafy', t }); }
function table(g, t, x, y) { sideTable(g, x, y, 380, 200); D.deskLamp(g, x - 90, y - 200, 0.8, { on: true }); D.mug(g, x + 90, y - 200, 0.75, { t }); }

// a: six beautiful minutes as a different person
reg('a', { draw(g, t, info) { const td = at(info, 'completely', 2.4);
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.14, 0.5, 0.5], () => { room(g, t, '#ffd9a0', '#ffeccb', { floor: '#c08a5a' }); glow(g, 960, 300, 800, '#fff6c8', 0.6);
    rug(g, 960, 990, 480, '#3f9a8a'); D.laptop(g, 360, 940, 1.1, {}); D.backpack(g, 1500, 960, 1.2, {}); D.sneaker(g, 1230, 975, 0.9, {}); D.bottle(g, 1350, 965, 0.9, {}); D.trophy(g, 1580, 420, 0.5, { t });
    drawToon(g, { x: 900, y: 975, s: 2.55, cast: HERO, actions: [[0, 'handsHips'], [td, 'idle']], t, facing: 1, yaw: 0.35, expr: t < td ? 'confident' : 'excited' });
    clockOn(g, 960, 190, 90, 21, Math.min(6, t * 1.8)); for (let i = 0; i < 10; i++) { const p = (t * 0.4 + i * 0.1) % 1; D.star(g, 620 + ((i * 97) % 640), lerp(900, 200, p), 0.3 * Math.sin(p * Math.PI), { t }); } });
  motes(g, t, '#ffffff', 24); vig(g, 0.25); } });

// the rusty toaster restoration video (k = rust -> shine)
function toaster(g, x, y, s, k, t) { g.save(); g.translate(x, y); g.scale(s, s); const body = k > 0.5 ? '#d8e4ee' : '#a8603a'; box(g, -190, -150, 380, 230, body, 70, 8); box(g, -110, -176, 90, 40, '#3a2a24', 14); box(g, 20, -176, 90, 40, '#3a2a24', 14); box(g, 150, -60, 56, 30, '#2a2226', 10); circle(g, -110, 20, 26, '#2a2226'); box(g, -150, 80, 60, 30, '#2a2226', 8); box(g, 90, 80, 60, 30, '#2a2226', 8);
  if (k < 0.9) { const r = rng(4); for (let i = 0; i < 26; i++) circle(g, -160 + r() * 320, -110 + r() * 160, 5 + r() * 12, alpha('#5a2a10', 0.7 * (1 - k))); }
  const bx = Math.sin(t * 16) * 90; box(g, bx - 55, -60, 110, 46, '#ffd64a', 18, 6); if (k > 0.6) { seg(g, [[-140, -110], [-60, -118]], 14, '#ffffff'); D.star(g, 150, -130, 0.35, { t }); } g.restore(); }

// b: nearly three in the morning, watching a toaster
reg('b', { draw(g, t, info) { const tw = at(info, 'watching', 2.3), tt = at(info, 'toaster', 4.4);
  if (t < tw) { cam(g, t, tw, [1.05, 0.5, 0.55], [1.2, 0.42, 0.55], () => { room(g, t, '#101c3a', '#27345e'); clockOn(g, 960, 250, 110, 2, Math.min(55, 20 + t * 18));
      const y = H() * 0.88; box(g, 260, y - 360, 70, 360, '#8a5636', 28); box(g, 300, y - 180, 800, 120, '#f4efe6', 30); box(g, 340, y - 255, 210, 100, '#ffffff', 46);
      drawToon(g, { x: 560, y: y + 40, s: 2.2, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.5, expr: 'sleepy', look: [0.6, 0.2] }); box(g, 520, y - 190, 590, 175, '#e8704a', 60); box(g, 280, y - 70, 840, 80, '#6a3f28', 20);
      D.phone(g, 790, y - 320, 0.42, { screen: 'off', rot: -0.25, t }); glow(g, 720, y - 330, 300, '#9fd8ff', 0.45); table(g, t, 1400, y + 20); D.sneaker(g, 1700, y + 30, 0.9, {}); }); }
  else { const u = t - tw; cam(g, u, info.dur - tw, [1.0, 0.5, 0.5], [1.14, 0.5, 0.48], () => { room(g, t, '#0c1430', '#1a2448'); veil(g, '#02040c', 0.35);
      box(g, 480, 150, 960, 720, '#141218', 54, 10); box(g, 516, 186, 888, 590, '#5a7a8a', 20, 6); box(g, 516, 650, 888, 126, '#8a5a38', 0, 6); const k = clamp(prog(t, tt - 1.4, tt + 0.4));
      toaster(g, 960, 560, 1.35, k, t); box(g, 560, 806, 800, 18, '#4a4652', 9, 0); box(g, 560, 806, 800 * (0.2 + 0.7 * u / (info.dur - tw)), 18, '#ff4a3a', 9, 0);
      hand(g, 1360, 900, [420, 340], { s: 1.05 }); }); }
  vig(g, 0.55); } });

// c: and you've accomplished absolutely nothing
reg('c', { draw(g, t, info) { const tn = at(info, 'nothing', 2.2);
  cam(g, t, info.dur, [1.16, 0.46, 0.45], [1.0, 0.5, 0.5], () => { room(g, t, '#1c2a4a', '#35466a'); glow(g, 960, 420, 620, '#ffd98a', 0.2);
    box(g, 620, 130, 680, 640, '#c08a5a', 24, 10); box(g, 660, 170, 600, 560, '#fff8e8', 12, 5); circle(g, 960, 150, 18, '#d0342a'); hw(g, 'today', 960, 235, 92);
    ['sleep', 'room', 'money', 'reply', 'study'].forEach((w, i) => { const y = 340 + i * 82; box(g, 720, y - 28, 56, 56, '#fff', 10, 6); hw(g, w, 810, y + 18, 68, '#33231c'); });
    if (t > tn - 0.1) { const k = ease.outBack(prog(t, tn - 0.1, tn + 0.2)); g.save(); g.translate(1100, 530); g.rotate(-0.18); g.scale(k, k); box(g, -150, -80, 300, 160, 'rgba(255,248,232,0)', 20, 0); g.strokeStyle = '#d0342a'; g.lineWidth = 12; g.strokeRect(-150, -75, 300, 150); text(g, '0', 0, 6, { size: 130, color: '#d0342a' }); g.restore(); }
    table(g, t, 330, 970); D.laptop(g, 1620, 960, 1.15, {}); D.bookStack(g, 1340, 968, 0.8, {}); });
  vig(g, 0.55); } });

// d: tomorrow, though. tomorrow is going to be different.
reg('d', { draw(g, t, info) { const td = at(info, 'different', 3.4);
  room(g, t, '#2a3a72', '#6a5a8a'); fairyLights(g, t, 60); D.alarmClock(g, 260, 960, 1.4, { t }); D.mug(g, 520, 965, 1.0, { t }); D.bookStack(g, 1500, 965, 1.1, {}); D.plant(g, 1730, 965, 1.15, { kind: 'tall', t }); veil(g, '#0a0c22', 0.25); glow(g, 960, 480, 700, '#ffd98a', 0.25);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.5, 0.45], () => bigToonFace(g, 960, 560, 270, { cast: HERO, expr: t < 1.2 ? 'tired' : t < td ? 'hopeful' : 'confident', t }));
  vig(g, 0.5); } });

// e: a suspicious number of tomorrows
reg('e', { draw(g, t, info) { cam(g, t, info.dur, [1.2, 0.55, 0.45], [1.0, 0.5, 0.5], () => { room(g, t, '#17324a', '#2a5a6a');
    const n = Math.min(24, Math.floor(prog(t, 0.2, info.dur - 0.7) * 24)); for (let i = 0; i < n; i++) { const x = 620 + (i % 6) * 175, y = 150 + Math.floor(i / 6) * 175; g.save(); g.translate(x, y); g.rotate(((i * 7) % 5 - 2) * 0.05); box(g, -74, -70, 148, 150, '#fffaf0', 14, 5); box(g, -74, -70, 148, 40, '#e8643c', 14, 5); hw(g, 'tmrw', 0, 36, 56); g.restore(); }
    drawToon(g, { x: 330, y: 970, s: 2.4, cast: HERO, actions: [[0, 'idle'], [2.0, 'crossArms']], t, facing: 1, yaw: 0.6, expr: t < 2.0 ? 'awkward' : 'caughtOut', look: [0.8, -0.3] }); table(g, t, 1700, 975); });
  vig(g, 0.5); } });

// f: the wall has three rules. rule one.
reg('f', { draw(g, t, info) { const tr = at(info, 'three', 0.8), t1 = at(info, 'rule', 2.2) - 0.05;
  const sh = [0, 1, 2].reduce((a, i) => { const q = t - (tr + i * 0.28); return a + (q > 0 ? Math.exp(-q * 12) * Math.sin(q * 80) * 7 : 0); }, 0);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.42, 0.48], () => { g.translate(sh, 0); noteWall(g, t); fairyLights(g, t, 50); rug(g, 960, 1010, 460); sideTable(g, 280, 975, 300, 170); D.mug(g, 230, 805, 0.7, { t }); D.bookStack(g, 340, 805, 0.55, {}); D.backpack(g, 1590, 975, 0.95, {});
    [0, 1, 2].forEach((i) => { const t0 = tr + i * 0.28; if (t < t0) return; const hot = i === 0 && t > t1, k = ease.outBack(prog(t, t1, t1 + 0.3)); const x = 640 + i * 340, s = 0.72 + (hot ? 0.22 * k : 0); note(g, x, 460, s * lerp(1.7, 1, prog(t, t0, t0 + 0.14)), { rot: (i - 1) * 0.05, text: String(i + 1), size: 170 }); slapLines(g, x, 460, prog(t, t0 + 0.1, t0 + 0.45), 200); }); });
  vig(g, 0.55); } });

// g: you can write one thing
reg('g', { draw(g, t, info) { const tw = at(info, 'write', 0.4);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.15, 0.5, 0.5], () => { grad(g, [[0, '#6a4430'], [1, '#3a2018']]); for (let i = 0; i < 8; i++) seg(g, [[-100, i * 150 + 40], [2100, i * 150 + 60]], 5, alpha(INK, 0.3)); glow(g, 960, 420, 760, '#ffd98a', 0.4);
    D.deskLamp(g, 260, 700, 1.7, { on: true }); D.mug(g, 1620, 520, 1.6, { t }); D.bookStack(g, 1640, 940, 1.2, {}); D.plant(g, 320, 1040, 1.2, { kind: 'round', t }); D.alarmClock(g, 1330, 300, 0.9, { t });
    note(g, 960, 540, 1.7, { rot: -0.03, text: ['1 thing'], k: prog(t, tw, tw + 0.9), size: 86 }); const k = prog(t, tw, tw + 0.9), px = 830 + k * 270, py = 600 + Math.sin(t * 26) * 6 * (k < 1 ? 1 : 0); seg(g, [[px, py], [px + 130, py + 130]], 26, INK); seg(g, [[px + 6, py + 6], [px + 124, py + 124]], 14, '#4a78b8'); hand(g, px + 120, py + 130, [420, 360], { s: 1 }); });
  vig(g, 0.5); } });

// h: "clean the room and get fit" -> the ink slides off like water
reg('h', { draw(g, t, info) { const tc = at(info, 'clean', 1.0), tf = at(info, 'get', 2.0), ti = at(info, 'slides', 3.7);
  cam(g, t, info.dur, [1.05, 0.5, 0.48], [1.18, 0.5, 0.55], () => { noteWall(g, t); fairyLights(g, t, 50);
    // the two jobs as objects: broom + bucket / dumbbell
    seg(g, [[360, 940], [470, 480]], 24, '#a8744a'); box(g, 300, 900, 160, 110, '#ffcf4a', 22); box(g, 520, 880, 150, 130, '#5ab0d8', 24); for (const d of [-1, 1]) box(g, 1480 + d * 130 - 35, 860, 70, 150, '#3a3e52', 22); box(g, 1380, 915, 200, 36, '#c8ccd8', 14);
    note(g, 960, 480, 1.55, { rot: -0.025 }); const slide = ease.in(prog(t, ti - 0.1, ti + 1.0));
    [['clean room', 420, tc], ['+ get fit', 540, tf]].forEach(([s, y, t0], i) => { const k = prog(t, t0, t0 + 0.6); if (k <= 0) return; const n = Math.round(k * s.length); for (let c = 0; c < n; c++) { const ch = s[c]; const x = 960 - s.length * 22 + c * 44, d = slide * (300 + ((c * 53 + i * 31) % 260)); g.save(); g.globalAlpha = 1 - clamp(slide * 1.1 - 0.1); g.translate(x, y + d); g.scale(1 - slide * 0.35, 1 + slide * 1.4); hw(g, ch, 0, 0, 96); g.restore(); } });
    if (slide > 0.05) for (let i = 0; i < 16; i++) { const p = clamp(slide * 1.3 - (i % 5) * 0.08), x = 760 + ((i * 97) % 400); circle(g, x, 640 + p * (240 + (i % 4) * 60), 10 * (1 - p * 0.5), alpha('#2a1a14', 1 - p * 0.7)); } });
  vig(g, 0.55); } });

// i: rule two
reg('i', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.1, 0.5, 0.46], () => { noteWall(g, t); fairyLights(g, t, 50); rug(g, 960, 1010, 460); sideTable(g, 280, 975, 300, 170); D.mug(g, 280, 805, 0.7, { t });
    note(g, 960, 480, 1.5 * lerp(1.7, 1, prog(t, 0, 0.14)), { rot: 0.02 }); D.padlock(g, 960, 500, 1.4 * ease.outBack(prog(t, 0.2, 0.5)), { open: t < 0.7 }); text(g, '2', 840, 360, { size: 110, color: '#33231c' }); slapLines(g, 960, 480, prog(t, 0.12, 0.55), 330); });
  vig(g, 0.55); } });
