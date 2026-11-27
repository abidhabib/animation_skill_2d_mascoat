// V06 Clip 21: the phone, "Pick up", cut to black, then the blank note and the final question.
import { E, registerShot as reg, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';
import { cam, grad, motes, vig } from '/engine/cine.js';
import { noteWall, hand, slapLines } from '/engine/notewall.js';
import { D } from '/engine/props2d.js';
import { INK, box, hw, at, popIn, jar, note, morning, sideTable, rug, tableTop } from '/engine/v06.js';

function phone(g, x, y, s, t, ring = true, answered = false) { const sh = ring ? Math.sin(t * 60) * 12 * (Math.sin(t * 6.5) > 0 ? 1 : 0) : 0; g.save(); g.translate(x + sh, y); g.rotate(sh * 0.003); g.scale(s, s); box(g, -180, -340, 360, 680, '#141218', 60, 9); box(g, -156, -308, 312, 616, answered ? '#1e6a46' : '#1d2a4a', 38, 0); text(g, answered ? 'connected' : 'incoming call', 0, -230, { size: 34, color: '#cfe0ff' }); circle(g, 0, -100, 78, '#5a6a8a'); text(g, '?', 0, -94, { size: 100, color: '#fff' }); text(g, 'Unknown', 0, 40, { size: 56, color: '#fff' }); text(g, 'number', 0, 100, { size: 40, color: '#cfe0ff' }); circle(g, -74, 220, 50, '#e0442c'); circle(g, 74, 220, 50, '#3aba6a'); g.restore(); if (ring) for (let i = 0; i < 3; i++) { const p = (t * 1.4 + i / 3) % 1; g.strokeStyle = alpha('#9fd8ff', 0.6 * (1 - p)); g.lineWidth = 9; g.beginPath(); g.arc(x, y, (240 + p * 280) * s, -0.5, 0.5); g.stroke(); g.beginPath(); g.arc(x, y, (240 + p * 280) * s, Math.PI - 0.5, Math.PI + 0.5); g.stroke(); } }

// a: at eight the next morning, your phone rings
reg('a', { draw(g, t, info) { const tr = at(info, 'phone', 1.8) - 0.1; cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.18, 0.5, 0.55], () => { morning(g, t); sideTable(g, 960, 975, 760, 260); phone(g, 960, 560, 0.45, t, t > tr); D.alarmClock(g, 700, 715, 0.9, { t }); D.mug(g, 1230, 715, 0.8, { t }); }); popIn(g, 960, 170, prog(t, 0.1, 0.4), -0.03, () => { box(g, -190, -70, 380, 140, '#141218', 26); text(g, '8:00', 0, 7, { size: 90, color: '#7affb0' }); }); vig(g, 0.3); } });
// b: an unknown number
reg('b', { draw(g, t, info) { tableTop(g, t, '#e8b070', '#a05a42'); cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.48], () => phone(g, 960, 540, 1.25, t, true)); vig(g, 0.35); } });
// c: it could be anyone. it rings once. twice.
reg('c', { draw(g, t, info) { const t1 = at(info, 'once', 2.6) - 0.15, t2 = at(info, 'twice', 3.5) - 0.1; grad(g, [[0, '#2a3a62'], [1, '#101626']]);
  if (t < at(info, 'it', 2.0, 1) - 0.1) cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.5], () => { for (let i = 0; i < 3; i++) popIn(g, 450 + i * 510, 560, prog(t, 0.05 + i * 0.25, 0.4 + i * 0.25), (i - 1) * 0.05, () => { box(g, -190, -260, 380, 520, '#fffaf0', 30); circle(g, 0, -80, 90, '#3a3048'); g.beginPath(); g.ellipse(0, 150, 140, 110, 0, Math.PI, 0); g.fill(); text(g, '?', 0, -72, { size: 110, color: '#ffe27a' }); }); });
  else { phone(g, 960, 560, 1.1, t, true); const n = t >= t2 ? 2 : t >= t1 ? 1 : 0; if (n) popIn(g, 1480, 300, prog(t, n === 2 ? t2 : t1, (n === 2 ? t2 : t1) + 0.25), 0.08, () => { circle(g, 0, 0, 120, '#ffd64a'); g.strokeStyle = INK; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 120, 0, 7); g.stroke(); text(g, String(n), 0, 8, { size: 140, color: INK }); }); }
  vig(g, 0.5); } });
// d: your thumb hovers over the screen
reg('d', { draw(g, t, info) { tableTop(g, t, '#e8b070', '#a05a42'); cam(g, t, info.dur, [1.15, 0.53, 0.65], [1.35, 0.54, 0.68], () => { phone(g, 960, 540, 1.25, t, false); const hx = 1080 + Math.sin(t * 2.4) * 22, hy = lerp(1000, 860, ease.out(prog(t, 0.1, 0.9))) + Math.sin(t * 9) * 5; g.save(); g.translate(hx, hy); g.rotate(-0.5); box(g, -48, -90, 96, 250, '#ffdab9', 46); box(g, -30, -78, 60, 60, '#f4c0a0', 26, 4); box(g, -100, 110, 220, 600, '#303950', 70); g.restore(); }); vig(g, 0.45); } });
// e: then you look at the wall
reg('e', { draw(g, t, info) { const k = ease.inOut(prog(t, 0.1, info.dur - 0.1)); g.save(); g.translate(lerp(520, 0, k), 0); noteWall(g, t, { lamp: 0.4 }); rug(g, 960, 1015, 470); sideTable(g, 330, 975, 300, 180); jar(g, 330, 795, 0.45, 12); g.save(); g.beginPath(); g.rect(900, 220, 480, 500); g.clip(); note(g, 1140, 470, 1.0, { rot: -0.04 }); g.restore(); g.restore(); veil(g, '#fff0c0', 0.12); vig(g, 0.45); } });
// f: PICK UP. -> answer -> black before anyone speaks
reg('f', { draw(g, t, info) { const cut = info.dur - 0.2, ans = Math.max(0.7, info.dur - 0.6);
  if (t < ans) cam(g, t, ans, [1.15, 0.5, 0.48], [1.45, 0.5, 0.48], () => { noteWall(g, t, { lamp: 0.5 }); note(g, 960, 500, 1.35, { rot: -0.03, text: ['PICK', 'UP.'], k: prog(t, 0, 0.35), size: 120 }); });
  else if (t < cut) { tableTop(g, t, '#e8b070', '#a05a42'); phone(g, 960, 540, 1.25, t, false, true); }
  else veil(g, '#000000', 1); vig(g, 0.35); } });
// g: your note is blank. what are you writing?  -> black
reg('g', { draw(g, t, info) { const end = info.dur - 0.35; grad(g, [[0, '#5a3a2a'], [1, '#22140e']]); glow(g, 960, 500, 900, '#ffc870', 0.4);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.12, 0.5, 0.5], () => { note(g, 860, 520, 1.9 * (0.92 + 0.08 * ease.outBack(prog(t, 0, 0.4))), { rot: -0.03 }); const k = ease.out(prog(t, 0.6, 1.6)), px = lerp(2100, 1360, k), py = lerp(1150, 760, k) + Math.sin(t * 1.8) * 6; seg(g, [[px - 190, py - 150], [px + 90, py + 80]], 34, INK); seg(g, [[px - 178, py - 140], [px + 80, py + 72]], 18, '#4a78b8'); hand(g, px + 80, py + 80, [460, 300], { s: 1.25 }); });
  vig(g, 0.5); if (t > end) veil(g, '#000000', clamp((t - end) / 0.25)); } });
