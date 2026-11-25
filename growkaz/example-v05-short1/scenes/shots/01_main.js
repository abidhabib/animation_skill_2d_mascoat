// V05 Short "What If You Got Paid to Ignore Your Phone?" (9:16). Mouths follow the dialogue edit (cine.speaker); listeners react.
import { E, registerShot as reg0, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng } from '/engine/core.js';
import { drawToon, bigToonFace, HERO, DAD } from '/engine/toon2d.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';
import { D } from '/engine/props2d.js';
import { speaker, capt, cam, grad, motes, vig } from '/engine/cine.js';
import { LINES } from './00_lines.js';

const W = () => E.W, H = () => E.H, INK = '#1d1418';
const say = speaker(LINES);
const reg = (id, def) => reg0(id, def.kind === '3d' ? { ...def, overlay(g, t, info, st) { def.overlay && def.overlay(g, t, info, st); capt(g, info.globalT); } } : { ...def, draw(g, t, info) { def.draw(g, t, info); capt(g, info.globalT); } });
// seconds (local) when a script word is spoken
const at = (info, word, dflt) => { const w = E.words.find((w) => w.start >= info.shot.start - 0.05 && w.word.toLowerCase().replace(/[^a-z]/g, '').startsWith(word)); return w ? w.start - info.shot.start : dflt; };
// the money counter pill
function counter(g, y, str, col, t, pop = 1) { const k = 0.82 + 0.18 * ease.outBack(clamp(pop)); g.save(); g.translate(W() / 2, y); g.scale(k, k); glow(g, 0, 0, 420, col, 0.35);
  rr(g, -310, -105, 620, 210, 105); g.fillStyle = 'rgba(14,8,34,.88)'; g.fill(); g.strokeStyle = col; g.lineWidth = 10; g.stroke(); text(g, str, 0, 6, { size: str.length > 7 ? 92 : 150, color: col, stroke: 10, strokeColor: '#0b0620' }); g.restore(); }
function wallClock(g, x, y, r, hours) { circle(g, x, y, r + 14, INK); circle(g, x, y, r, '#fff6e8'); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; seg(g, [[x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8], [x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92]], 6, INK); }
  const h = (hours % 12) / 12 * Math.PI * 2 - Math.PI / 2, m = (hours % 1) * Math.PI * 2 - Math.PI / 2; seg(g, [[x, y], [x + Math.cos(h) * r * 0.5, y + Math.sin(h) * r * 0.5]], 12, INK); seg(g, [[x, y], [x + Math.cos(m) * r * 0.76, y + Math.sin(m) * r * 0.76]], 7, '#d0342a'); circle(g, x, y, 10, INK); }
// living room: wall, window with the time of day, couch, lamp, floor
function room(g, mode, t) { const P = { day: ['#d9b48c', '#b98a6a', '#7ab8e8', '#ffe2b0'], eve: ['#8a5a78', '#6a4262', '#e8806a', '#ffc070'], night: ['#34305e', '#26224a', '#101a46', '#2a2a6a'], morning: ['#cfa98e', '#a97f70', '#f0a8a0', '#ffe0b0'] }[mode];
  const base = H() * 0.68; grad(g, [[0, P[1]], [0.55, P[0]], [1, P[1]]]);
  rr(g, 90, 330, 400, 470, 18); const gr = g.createLinearGradient(0, 330, 0, 800); gr.addColorStop(0, P[2]); gr.addColorStop(1, P[3]); g.fillStyle = gr; g.fill(); g.strokeStyle = '#fff0dc'; g.lineWidth = 20; g.stroke(); seg(g, [[290, 330], [290, 800]], 12, '#fff0dc'); seg(g, [[90, 560], [490, 560]], 12, '#fff0dc');
  if (mode === 'night') { circle(g, 390, 420, 44, '#f4f0d8'); const r = rng(2); for (let i = 0; i < 26; i++) circle(g, 100 + r() * 380, 345 + r() * 420, 2 + r() * 2, alpha('#ffffff', 0.5 + 0.4 * Math.sin(t * 2 + i))); } else glow(g, 290, 600, 460, P[3], 0.3);
  rr(g, 790, 400, 200, 260, 12); g.fillStyle = '#fff0dc'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); circle(g, 890, 490, 40, '#f4a860'); g.fillStyle = '#4f9a55'; g.beginPath(); g.moveTo(805, 645); g.lineTo(880, 540); g.lineTo(975, 645); g.fill();
  g.fillStyle = '#5a3a2e'; g.fillRect(-W(), base, W() * 3, H()); for (let i = -2; i < 10; i++) seg(g, [[i * 170, base], [i * 170 - 220, H() * 1.1]], 4, alpha(INK, 0.3)); seg(g, [[-W(), base], [W() * 2, base]], 8, INK); }
function couch(g, x, y) { const c = '#3f6a8a'; const box = (a, b, w, h, col) => { rr(g, a, b, w, h, 46); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); };
  box(x - 370, y - 470, 740, 330, '#355a78'); box(x - 440, y - 300, 150, 300, c); box(x + 290, y - 300, 150, 300, c); box(x - 330, y - 190, 660, 160, c); seg(g, [[x, y - 182], [x, y - 40]], 6, alpha(INK, 0.5)); for (const d of [-330, 330]) { rr(g, x + d - 22, y - 8, 44, 46, 10); g.fillStyle = '#2a1a14'; g.fill(); } }
// the drawer: open 0..1 reveals the phone
function drawer(g, x, y, open, screenFn, t, has = true) { const wood = '#8a5636', box = (a, b, w, h, col, r = 22) => { rr(g, a, b, w, h, r); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); };
  box(x - 440, y - 330, 880, 800, '#6a3f28'); box(x - 400, y - 290, 800, 330, '#2a160e', 14); const d = open * 330;
  g.fillStyle = '#4a2a1a'; g.beginPath(); g.moveTo(x - 400, y - 270); g.lineTo(x + 400, y - 270); g.lineTo(x + 400, y - 270 + d); g.lineTo(x - 400, y - 270 + d); g.closePath(); g.fill();
  if (open > 0.05 && has) { g.save(); g.beginPath(); g.rect(x - 400, y - 290, 800, 330 + d); g.clip(); D.phone(g, x, y - 260 + d * 0.62, 1.55, { screen: screenFn, t, rot: Math.PI / 2 + 0.05 }); g.restore(); }
  box(x - 400, y - 270 + d, 800, 300, wood); rr(g, x - 90, y - 150 + d, 180, 44, 22); g.fillStyle = '#e0b84a'; g.fill(); g.stroke(); box(x - 400, y + 80, 800, 330, '#7a4a30'); rr(g, x - 90, y + 200, 180, 44, 22); g.fillStyle = '#c89a38'; g.fill(); g.stroke(); }

// N1 the rule: a phone, a wristband and a $0 counter
reg('s01', { draw(g, t, info) { grad(g, [[0, '#171442'], [0.6, '#4a2a6a'], [1, '#150c28']]); motes(g, t, '#8dffc8', 26);
  const td = at(info, 'dollar', 1.2), ti = at(info, 'ignore', 2.6);
  cam(g, t, info.dur, [1.18, 0.5, 0.5], [1.0, 0.5, 0.5], () => { D.phone(g, W() / 2, H() * 0.47, 2.6, { screen: 'lock', time: '8:00', date: 'Today', note: t > ti ? 'Ignore me. Get paid.' : '', t, rot: Math.sin(t * 1.4) * 0.03 });
    for (let i = 0; i < 9; i++) { const p = (t * 0.55 + i * 0.117) % 1; if (t < td) break; D.coin(g, W() * (0.12 + ((i * 37) % 80) / 100), lerp(H() * 0.95, H() * 0.05, p), 0.55, { spin: true, t: t + i, a: Math.sin(p * Math.PI) }); } });
  counter(g, H() * 0.17, t < td ? '$0' : '$1', '#6dff9a', t, prog(t, td, td + 0.35)); vig(g); } });
// Y1 "Easy money. I'm going to be rich!"
reg('s02', { draw(g, t, info) { grad(g, [[0, '#e0a24a'], [0.6, '#e8704a'], [1, '#6a2a3a']]); glow(g, W() / 2, H() * 0.4, 800, '#fff0c0', 0.45);
  for (let i = 0; i < 14; i++) { const p = (t * 0.9 + i * 0.071) % 1; D.cash(g, W() * (((i * 53) % 100) / 100), lerp(-100, H() * 0.9, p), 0.7, { rot: p * 5 + i, text: '1' }); }
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.18, 0.5, 0.45], () => bigToonFace(g, W() / 2, H() * 0.43 - Math.abs(Math.sin(t * 7)) * 12, 270, { cast: HERO, expr: 'excited', t, ...say(info.globalT, 'you') })); vig(g, 0.4); } });
// N2 sit on the couch and stare at the wall
reg('s03', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.22, 0.5, 0.56], () => { room(g, 'day', t); couch(g, W() / 2, H() * 0.72);
    drawToon(g, { x: W() * 0.55, y: H() * 0.74, s: 2.35, cast: HERO, action: 'sit', t, facing: 1, yaw: 0.35, expr: t < 1.4 ? 'confident' : 'bored', look: [0, -0.2] }); wallClock(g, W() * 0.6, H() * 0.2, 90, 8 + t * 0.06); }); motes(g, t, '#fff0d0', 14); vig(g, 0.45); } });
// N3 nine minutes, nine dollars
reg('s04', { draw(g, t, info) { const n = Math.min(9, 1 + Math.floor(prog(t, 0.05, 1.25) * 8.99)); cam(g, t, info.dur, [1.05, 0.5, 0.5], [1.15, 0.5, 0.44], () => { room(g, 'day', t); couch(g, W() / 2, H() * 0.76); bigToonFace(g, W() / 2, H() * 0.5, 215, { cast: HERO, expr: t < 1.3 ? 'focused' : 'smugAside', t }); });
  counter(g, H() * 0.17, '$' + n, '#6dff9a', t, ((prog(t, 0.05, 1.25) * 8.99) % 1) * 3); vig(g, 0.45); } });
// N4 it buzzes... you grab it... zero
reg('s05', { draw(g, t, info) { const tb = at(info, 'buzz', 0.5), tg = at(info, 'grab', 1.4), tz = at(info, 'zero', 3.2); grad(g, [[0, t > tz ? '#4a1420' : '#2a2a58'], [1, '#0e0a1c']]);
  const buzz = t > tb && t < tg ? Math.sin(t * 80) * 14 : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.22, 0.5, 0.52], () => { if (t < tg) { rr(g, -100, H() * 0.58, W() + 200, 500, 30); g.fillStyle = '#6a4430'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); D.phone(g, W() / 2 + buzz, H() * 0.56, 2.0, { screen: t > tb ? 'lock' : 'off', note: 'You WON a prize!!', t, rot: 1.35 + buzz * 0.004 }); if (t > tb) FX_rings(g, W() / 2, H() * 0.56, t); }
      else D.handPhone(g, W() / 2, lerp(H() * 0.8, H() * 0.48, ease.out(prog(t, tg, tg + 0.35))), 2.9, { screen: 'lock', note: 'You WON a prize!!', t }); });
  counter(g, H() * 0.14, t < tz ? '$9' : '$0', t < tz ? '#6dff9a' : '#ff5a4a', t, t < tz ? 1 : prog(t, tz, tz + 0.3)); if (t >= tz && t < tz + 0.35) veil(g, '#ff2a2a', 0.35 * (1 - (t - tz) / 0.35)); vig(g); } });
function FX_rings(g, x, y, t) { for (let i = 0; i < 3; i++) { const p = (t * 1.8 + i / 3) % 1; g.strokeStyle = alpha('#9fd8ff', 0.6 * (1 - p)); g.lineWidth = 8; g.beginPath(); g.arc(x, y, 180 + p * 320, 0, 7); g.stroke(); } }
// Y2 "It was a spam message!"
reg('s06', { draw(g, t, info) { grad(g, [[0, '#7a2a30'], [0.6, '#46182a'], [1, '#140812']]); const sh = Math.sin(t * 34) * 9 * Math.max(0, 1 - t);
  cam(g, t, info.dur, [1.12, 0.5, 0.45], [1.0, 0.5, 0.48], () => { g.translate(sh, 0); bigToonFace(g, W() / 2, H() * 0.43, 275, { cast: HERO, expr: 'furious', t, ...say(info.globalT, 'you') }); }); counter(g, H() * 0.14, '$0', '#ff5a4a', t); vig(g, 0.6); } });
// N5 lock the phone in a drawer... Dad asks you to cook
reg('s07', { draw(g, t, info) { const td = at(info, 'drawer', 1.8), tdad = at(info, 'dad', 2.6);
  if (t < tdad) { grad(g, [[0, '#3a2248'], [1, '#160c1e']]); glow(g, W() / 2, H() * 0.2, 700, '#ffc890', 0.3);
    cam(g, t, tdad, [1.0, 0.5, 0.5], [1.15, 0.5, 0.48], () => { const open = 1 - ease.inOut(prog(t, td - 0.1, td + 0.45)); drawer(g, W() / 2, H() * 0.5, open, 'lock', t);
      const hy = t < td ? H() * 0.38 : lerp(H() * 0.44, H() * 0.52, ease.out(prog(t, td, td + 0.4))); for (const x of [-240, 240]) { circle(g, W() / 2 + x, hy + (open * 120), 58, '#ffdab9'); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); } }); }
  else { cam(g, t - tdad, info.dur - tdad, [1.22, 0.62, 0.52], [1.04, 0.5, 0.52], () => { room(g, 'eve', t);
      drawToon(g, { x: W() * 0.25, y: H() * 0.73, s: 2.4, cast: HERO, action: 'idle', t, facing: 1, yaw: 0.6, expr: 'curious' });
      drawToon(g, { x: lerp(W() * 1.1, W() * 0.74, ease.out(prog(t, tdad, tdad + 0.7))), y: H() * 0.73, s: 2.45, cast: DAD, actions: [[tdad, 'walk'], [tdad + 0.75, 'wave']], t, facing: -1, yaw: 0.65, expr: 'friendly' }); }); }
  motes(g, t, '#ffd8a0', 18); vig(g, 0.45); } });
// kitchen helpers: two people at the stove
const initK = (T) => { const k = kitchen3d(T, { time: 'evening' }); k.st.spots = k.spots; return k.st; };
const person = (g, st, p, o) => { const q = pin(st, p, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, ...o }); return q; };
const DPOS = [2.98, 0, -1.72], YPOS = [1.9, 0, -1.55];
function smoke(g, st, t, k) { const s = screenOf(st, st.spots.kettle); for (let i = 0; i < 9; i++) { const p = (t * 0.55 + i / 9) % 1; circle(g, s.x - 40 + Math.sin(t * 2 + i) * 34 * p, s.y - p * 480, 22 + p * 70, alpha('#b8b0b8', 0.38 * k * (1 - p))); } }
// D1 "Careful, you're burning the onions."
reg('s08', { kind: '3d', init: initK, draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.35, 1.65, 2.7], look: [2.4, 1.15, -1.8], fov: 50 }, to: { pos: [1.6, 1.58, 2.0], look: [2.45, 1.15, -1.8], fov: 47 } }); },
  overlay(g, t, info, st) { smoke(g, st, t, prog(t, 0, 0.6));
    person(g, st, YPOS, { cast: HERO, actions: [[0, 'carry'], [0.9, 'recoil'], [1.9, 'reach']], t, facing: 1, yaw: 0.5, expr: t < 0.9 ? 'focused' : 'caughtOut', look: [0.7, 0] });
    person(g, st, DPOS, { cast: DAD, actions: [[0, 'point'], [1.6, 'handsHips']], t, facing: -1, yaw: 0.55, expr: 'teasing', ...say(info.globalT, 'dad') }); vig(g, 0.35); } });
// N6 you laugh; he tells you how he met your mom
reg('s09', { kind: '3d', init: initK, draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.7, 1.6, 2.3], look: [2.45, 1.15, -1.8], fov: 48 }, to: { pos: [2.6, 1.55, 1.7], look: [2.4, 1.15, -1.8], fov: 46 } }); },
  overlay(g, t, info, st) { const th = at(info, 'he', 0.9), ta = at(info, 'asking', 3.3);
    person(g, st, YPOS, { cast: HERO, actions: [[0, 'idle'], [th + 0.2, 'think'], [ta - 0.3, 'explain']], t, facing: 1, yaw: 0.55, expr: t < th ? 'laugh' : t < ta ? 'curious' : 'excited', look: [0.7, -0.1] });
    const q = person(g, st, DPOS, { cast: DAD, actions: [[0, 'idle'], [th, 'explain'], [ta, 'laugh' === 'x' ? 'idle' : 'shrug']], t, facing: -1, yaw: 0.55, expr: t < th ? 'laugh' : 'happy' });
    const b = ease.outBack(prog(t, th + 0.35, th + 0.75)) * (1 - prog(t, ta, ta + 0.3)); if (b > 0) { D.thought(g, W() * 0.58, H() * 0.2, 1.0 * b, { w: 460, tail: [0.35, 0.9] }); D.heart(g, W() * 0.58, H() * 0.2, 0.6 * b, { beat: true, t }); } vig(g, 0.35); } });
// D2 "You haven't stayed this long in years."
reg('s10', { draw(g, t, info) { grad(g, [[0, '#8a4a3a'], [0.55, '#c8744a'], [1, '#3a1a1e']]); glow(g, W() * 0.75, H() * 0.3, 800, '#ffd090', 0.45); motes(g, t, '#ffd8a0', 22);
  cam(g, t, info.dur, [1.0, 0.5, 0.48], [1.14, 0.5, 0.43], () => bigToonFace(g, W() / 2, H() * 0.43, 270, { cast: DAD, expr: 'grateful', t, ...say(info.globalT, 'dad') })); vig(g, 0.55); } });
// Y3 "I know. I'm sorry, Dad."
reg('s11', { draw(g, t, info) { grad(g, [[0, '#2a2252'], [0.55, '#5a3a62'], [1, '#150e24']]); glow(g, W() * 0.2, H() * 0.35, 800, '#ffb878', 0.3);
  cam(g, t, info.dur, [1.04, 0.5, 0.46], [1.2, 0.5, 0.43], () => bigToonFace(g, W() / 2, H() * 0.43 + 16 * ease.inOut(prog(t, 0.2, 1.2)), 280, { cast: HERO, expr: t < 1.2 ? 'embarrassed' : t < 2.4 ? 'sad' : 'hopeful', t, tilt: 0.05 * ease.inOut(prog(t, 0.3, 1.3)), ...say(info.globalT, 'you') })); vig(g, 0.65); } });
// N7 midnight: the drawer: $240
reg('s12', { draw(g, t, info) { const td = at(info, 'drawer', 1.4), tn = at(info, 'two', 2.3); grad(g, [[0, '#0c1236'], [1, '#080614']]);
  cam(g, t, info.dur, [1.0, 0.5, 0.52], [1.16, 0.5, 0.46], () => { const open = ease.inOut(prog(t, td - 0.25, td + 0.5)); drawer(g, W() / 2, H() * 0.55, open, (g2, x, y, w, h) => { g2.fillStyle = '#0c1a14'; g2.fillRect(x, y, w, h); }, t); if (open > 0.3) glow(g, W() / 2, H() * 0.52, 600, '#6dff9a', 0.35 * open); wallClock(g, W() * 0.5, H() * 0.13, 105, 12); });
  const p = prog(t, tn, tn + 0.7); if (t >= tn - 0.05) counter(g, H() * 0.29, '$' + Math.round(240 * ease.out(p)), '#6dff9a', t, p); vig(g, 0.5); } });
// N8 four hours: the clock runs from 8 to 12 while you two sit at the table
reg('s13', { kind: '3d', init: initK, draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.4, 1.7, 5.0], look: [-0.4, 1.05, 0.3], fov: 50 }, to: { pos: [-0.5, 1.5, 4.2], look: [-0.45, 1.05, 0.3], fov: 47 } }); },
  overlay(g, t, info, st) { for (const [spot, cast, facing, expr, act] of [['chairOld', DAD, 1, 'laugh', 'sit'], ['chairNew', HERO, -1, 'joy', 'sit']]) person(g, st, st.spots[spot], { cast, action: act, t: t + (facing > 0 ? 0 : 1), facing, expr });
    wallClock(g, W() / 2, H() * 0.17, 150, 8 + 4 * ease.inOut(prog(t, 0.15, info.dur - 0.5))); motes(g, t, '#ffd8a0', 18); vig(g, 0.4); } });
// N9 game over... you put the phone away anyway
reg('s14', { draw(g, t, info) { const to = at(info, 'over', 1.5), ty = at(info, 'you', 3.2), tw = at(info, 'drawer', 4.4);
  grad(g, [[0, '#7a4a62'], [1, '#241222']]); glow(g, W() / 2, H() * 0.18, 760, '#ffc080', 0.35);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.14, 0.5, 0.52], () => { const open = 1 - ease.inOut(prog(t, tw - 0.1, tw + 0.5)); drawer(g, W() / 2, H() * 0.54, open, 'lock', t, t >= tw - 0.1);
    const p = ease.inOut(prog(t, ty, tw - 0.15)); if (t < tw - 0.1) { const y = lerp(H() * 0.31, H() * 0.47, p); D.phone(g, W() / 2, y, lerp(2.0, 1.5, p), { screen: 'lock', note: '', t, rot: lerp(0, Math.PI / 2, p) }); for (const d of [-1, 1]) { circle(g, W() / 2 + d * lerp(175, 270, p), y + 60, 60, '#ffdab9'); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); } } });
  if (t > to - 0.1 && t < ty + 0.2) counter(g, H() * 0.1, 'GAME OVER', '#ffb0a0', t, prog(t, to - 0.1, to + 0.25)); vig(g, 0.45); } });
// D3 + Y4 at the kitchen door
reg('s15', { kind: '3d', init: initK, draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [1.9, 1.62, 2.3], look: [2.45, 1.15, -1.8], fov: 50 }, to: { pos: [1.7, 1.58, 2.0], look: [2.4, 1.15, -1.8], fov: 47 } }); },
  overlay(g, t, info, st) { const ty = 1.9; const walkIn = ease.out(prog(t, 0, 0.9));
    person(g, st, [lerp(0.9, YPOS[0], walkIn), 0, YPOS[2]], { cast: HERO, actions: [[0, 'walk'], [0.85, 'idle'], [ty + 0.1, 'talk'], [ty + 1.7, 'thumbsUp']], t, facing: 1, yaw: 0.55, expr: t < ty ? 'shy' : 'happy', ...say(info.globalT, 'you') });
    person(g, st, DPOS, { cast: DAD, actions: [[0, 'handsHips'], [1.4, 'idle'], [ty + 1.2, 'celebrate']], t, facing: -1, yaw: 0.55, expr: t < ty ? 'teasing' : 'joy', ...say(info.globalT, 'dad') }); vig(g, 0.35); } });
// N10 the ending: through the window, the two of you cooking; pull back into the night
reg('s16', { draw(g, t, info) { grad(g, [[0, '#0b1030'], [0.6, '#2a2458'], [1, '#0a0818']]); const r = rng(8); for (let i = 0; i < 60; i++) circle(g, r() * W(), r() * H() * 0.4, 1.5 + r() * 2.5, alpha('#ffffff', 0.4 + 0.4 * Math.sin(t * 2 + i)));
  cam(g, t, info.dur, [1.45, 0.5, 0.5], [0.94, 0.5, 0.5], () => { g.fillStyle = '#4a3250'; rr(g, 40, H() * 0.2, W() - 80, H() * 0.75, 30); g.fill(); g.strokeStyle = INK; g.lineWidth = 10; g.stroke(); g.fillStyle = '#35223c'; g.beginPath(); g.moveTo(0, H() * 0.21); g.lineTo(W() / 2, H() * 0.07); g.lineTo(W(), H() * 0.21); g.closePath(); g.fill(); g.stroke();
    const x = 170, y = H() * 0.31, w = W() - 340, h = H() * 0.37; g.save(); rr(g, x, y, w, h, 26); g.clip(); const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#ffd08a'); gr.addColorStop(1, '#e8804a'); g.fillStyle = gr; g.fillRect(x, y, w, h); glow(g, W() / 2, y + 90, 420, '#fff2c8', 0.6);
    drawToon(g, { x: W() * 0.36, y: y + h + 130, s: 2.3, cast: HERO, actions: [[0, 'talk'], [2.2, 'idle']], t, facing: 1, yaw: 0.65, expr: 'joy' }); drawToon(g, { x: W() * 0.66, y: y + h + 130, s: 2.35, cast: DAD, actions: [[0, 'idle'], [1.8, 'talk']], t, facing: -1, yaw: 0.65, expr: 'laugh' }); g.restore();
    rr(g, x, y, w, h, 26); g.strokeStyle = '#fff0dc'; g.lineWidth = 26; g.stroke(); seg(g, [[W() / 2, y], [W() / 2, y + h]], 14, alpha('#fff0dc', 0.8)); rr(g, x - 34, y + h, w + 68, 40, 14); g.fillStyle = '#fff0dc'; g.fill(); glow(g, W() / 2, y + h / 2, 800, '#ffb060', 0.22); });
  motes(g, t, '#ffd8a0', 20); vig(g, 0.5); const lp = prog(t, info.dur - 0.45, info.dur); if (lp > 0) veil(g, '#05030c', lp); } });
