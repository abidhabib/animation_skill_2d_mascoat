// V02 Short 2 (reel, 9:16): the whole story in ~45 s. 3D sets + 2D props library (props2d.js) + clean faces. Captions burned by the player.
import { E, registerShot as reg0, ease, FONTS, prog, clamp, lerp, rr, circle, glow, alpha, text, veil, wordTime } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, DAD, ROOMMATE, SHOPPER } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';
import { park3d } from '/engine/sets3d/park3d.js';
import { bedroom3d } from '/engine/sets3d/bedroom3d.js';
import { D, avatar } from '/engine/props2d.js';

const RED = '#ff8a7a', GREEN = '#8dffc8', GOLD = '#ffe28a', AMBER = '#ffc070', RIM = { color: '#ffd2a0', dir: [0.7, -0.7], w: 3.5 };
const W = () => E.W, H = () => E.H;
const initK = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
const initP = (T) => { const p = park3d(T, { time: 'sunrise' }); p.st.spots = p.spots; return p.st; };
const initB = (made) => (T) => { const b = bedroom3d(T, { time: 'morning', made }); Object.assign(b.st, { spots: b.spots, setBed: b.setBed, mirCorners: b.mirCorners, mirNormal: b.mirNormal }); return b.st; };
const at = (g, st, p, t, o = {}) => { const q = pin(st, p, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', look: o.look, blink: o.blink ?? blink(t + (o.seed || 0)), rim: RIM, talk: o.talk, alpha: o.alpha, shadow: o.shadow }); return q; };
const numY = (q, sit) => q.y - (sit ? 262 : 305) * q.s;
const numOn = (g, q, s, t, col = GREEN, t0 = -1, sit = false) => headNum(g, q.x, numY(q, sit), s, t, t0, { size: Math.max(40, 50 * q.s), color: col });
const wt = (info, w, after = 0) => { const x = wordTime(w, info.shot.start + after); return x == null ? null : x - info.shot.start; };
const bg2 = (g, c1, c2) => { const gr = g.createLinearGradient(0, 0, 0, H()); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); };
const zoom = (g, k, cx, cy, fn) => { g.save(); g.translate(cx, cy); g.scale(k, k); g.translate(-cx, -cy); fn(); g.restore(); };
// captions (own, measured with the real font): 1-3 words, active word gold, on a soft dark pill, low-middle of the 9:16 frame (above the Shorts UI)
function capt(g, gt) { const ws = E.words; let i = -1; for (let k = ws.length - 1; k >= 0; k--) if (gt >= ws[k].start - 0.05) { if (gt <= ws[k].end + 0.4) i = k; break; } if (i < 0) return;
  let st = i; while (st > 0 && i - st < 2 && !/[.,?!]$/.test(ws[st - 1].word)) st--; const grp = []; for (let k = st; k < ws.length && grp.length < 3; k++) { grp.push(k); if (/[.,?!]$/.test(ws[k].word)) break; } if (!grp.includes(i)) { grp.length = 0; grp.push(i); }
  const sz = 70; g.save(); g.font = `700 ${sz}px "${FONTS.title}"`; const strs = grp.map(k => ws[k].word.replace(/[.,!]$/, '').toUpperCase()), wd = strs.map(s => g.measureText(s).width + 10), gap = 34, tot = wd.reduce((a, b) => a + b, 0) + gap * (strs.length - 1);
  const y = E.H * 0.76; g.fillStyle = 'rgba(11,6,32,.55)'; rr(g, E.W / 2 - tot / 2 - 34, y - 58, tot + 68, 116, 40); g.fill(); g.restore();
  let x = E.W / 2 - tot / 2; strs.forEach((s, j) => { const cur = grp[j] === i, p = cur ? 1 + 0.1 * ease.out(prog(gt, ws[grp[j]].start, ws[grp[j]].start + 0.12)) : 1; g.save(); g.translate(x + wd[j] / 2, y + 2); g.scale(p, p); text(g, s, 0, 0, { size: sz, color: cur ? '#ffd84a' : '#ffffff', stroke: 10, strokeColor: '#0b0620' }); g.restore(); x += wd[j] + gap; }); }
const registerShot = (id, def) => reg0(id, def.kind === '3d' ? { ...def, overlay(g, t, info, st) { def.overlay && def.overlay(g, t, info, st); capt(g, info.globalT); } } : { ...def, draw(g, t, info) { def.draw(g, t, info); capt(g, info.globalT); } });
const talkK = (info, t) => clamp(0.25 + 0.75 * Math.abs(Math.sin((info.shot.start + t) * 17)));

// s01 HOOK "You wake up, and everyone has a number above their head."  sunrise park: a number pops in the FIRST frames, then on everyone
const CROWD = [[-0.95, 0.1, SHOPPER(0), '72'], [0.95, -0.2, SHOPPER(1), '48'], [-0.45, -1.2, ROOMMATE, '62'], [0.5, -1.4, SHOPPER(3), '88'], [0, 0.9, HERO, null]];
registerShot('s01', { kind: '3d', init: initP,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [0, 1.7, 5.6], look: [0, 1.15, -0.3], fov: 52 }, to: { pos: [0, 1.55, 4.4], look: [0, 1.2, -0.3], fov: 48 } }); },
  overlay(g, t, info, st) { const items = CROWD.map(([x, z, c, n], i) => ({ x, z, c, n, i })).sort((a, b) => a.z - b.z);
    for (const it of items) { const q = at(g, st, [it.x, 0, it.z], t, { cast: it.c, facing: it.x < 0 ? 1 : -1, expr: it.n ? 'neutral' : 'shocked', seed: it.i, look: it.n ? [0, 0] : [0, -0.6] });
      if (it.n) numOn(g, q, it.n, t, GREEN, [0.05, 0.45, 0.8, 1.15][it.i]); } } });
// s02 "It's how much they trust you."  push into one glowing number above your stunned face
registerShot('s02', { draw(g, t, info) { bg2(g, '#1a1238', '#3a2a5a'); FX.stars(g, t, { count: 80, area: [0, 0, W(), H() * 0.5] }); const k = ease.inOut(prog(t, 0, info.dur));
  bigToonFace(g, W() / 2, H() * 0.56, 250, { cast: HERO, expr: 'surprised', look: [0, -0.8], blink: blink(t) });
  headNum(g, W() / 2, lerp(H() * 0.26, H() * 0.2, k), '62', t, 0.05, { size: lerp(120, 230, k), color: GREEN }); FX.rings(g, W() / 2, H() * 0.22, t, { color: GREEN, a: 0.35 }); } });
// s03 "Your roommate, sixty-two."  kitchen: roommate burning toast, 62
registerShot('s03', { kind: '3d', init: initK,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [2.0, 1.6, 1.4], look: [2.7, 1.1, -1.9], fov: 50 }, to: { pos: [2.2, 1.55, 0.6], look: [2.7, 1.2, -1.9], fov: 46 } }); },
  overlay(g, t, info, st) { const q = at(g, st, [2.7, 0, -1.75], t, { cast: ROOMMATE, facing: -1, pose: breathe(POSES.holdFront, t), expr: t < 0.6 ? 'neutral' : 'awkward', look: [-0.6, -0.2] }); numOn(g, q, '62', t, GREEN, 0.15);
    for (let i = 0; i < 3; i++) { const p = (t * 0.5 + i / 3) % 1; g.fillStyle = alpha('#555555', 0.35 * (1 - p)); g.beginPath(); g.arc(q.x - 110 * q.s + Math.sin(t * 2 + i) * 20, q.y - 140 * q.s - p * 260, 30 + p * 50, 0, 7); g.fill(); } } });
// s04 "Your dad, one hundred."  Dad on a video call, too close to the camera, 100 glowing over the phone
registerShot('s04', { draw(g, t, info) { bg2(g, '#f4d8b0', '#e0a878'); glow(g, W() / 2, H() * 0.45, 700, '#fff0c8', 0.5);
  const s = lerp(1.0, 1.08, ease.inOut(prog(t, 0, info.dur)));
  D.handPhone(g, W() / 2, H() * 0.5, s * 1.9, { t, screen: (g2, x, y, w, h) => { g2.fillStyle = '#f0e0c8'; g2.fillRect(x, y, w, h); bigToonFace(g2, x + w / 2, y + h * 0.62, w * 0.62, { cast: DAD, expr: 'happy', talk: talkK(info, t) * 0.6, blink: blink(t) }); } });
  headNum(g, W() / 2, H() * 0.12, '100', t, 0.2, { size: 150, color: GOLD }); } });
// s05 "Your best friend of twelve years, forty-one."  Sam's big smile... then 41 drops in, the frame goes cold
registerShot('s05', { draw(g, t, info) { const tn = wt(info, 'forty') ?? info.dur * 0.6, fr = prog(t, tn, tn + 0.25);
  bg2(g, '#ffd8a0', '#e88a70'); glow(g, W() / 2, H() * 0.5, 800, '#fff0c8', 0.4 * (1 - fr));
  zoom(g, 1 + 0.05 * ease.out(fr), W() / 2, H() * 0.55, () => { bigToonFace(g, W() / 2, H() * 0.5, 290, { cast: SAM, expr: 'happy', blink: blink(t) }); });
  if (fr > 0) veil(g, '#1a2a4a', 0.35 * fr, 'multiply');
  if (t >= tn - 0.05) headNum(g, W() / 2, H() * 0.17, '41', t, tn, { size: 210, color: AMBER }); } });
// s06 "Four cancelled plans. Two hundred dollars you forgot to pay back."  four "Can't make it" bubbles, then the cash flies off
registerShot('s06', { draw(g, t, info) { bg2(g, '#e8eef8', '#c8d4e8'); const tc = wt(info, 'two') ?? info.dur * 0.5;
  avatar(g, W() / 2, H() * 0.17, 90, SAM, '#ffd08a'); headNum(g, W() / 2 + 150, H() * 0.12, '41', t, 0, { size: 90, color: AMBER });
  for (let i = 0; i < 4; i++) { const p = prog(t, 0.08 + i * 0.28, 0.3 + i * 0.28); if (p <= 0) continue; D.chatBubble(g, W() / 2 + (i % 2 ? 50 : -50), H() * (0.3 + i * 0.085), 1.7 * ease.outBack(p), { text: "Can't make it, sorry", side: 'right', a: t > tc + 0.4 ? 0.6 : 1 }); }
  if (t > tc - 0.1) { const p = ease.in(prog(t, tc + 0.5, info.dur)); D.cash(g, lerp(W() / 2, W() * 1.1, p), lerp(H() * 0.72, H() * 0.18, p), 1.5 * (1 - p * 0.5), { rot: p * 2.5, text: '200' }); floater(g, W() / 2, H() * 0.64, '-$200', t, tc + 0.4, '#ff5a5a'); } } });
// s07 "Not betrayal. Just small things, piling up."  little letdowns fall into a pile; 41 hangs above it
const PILE = ['cross', 'calendar', 'cash', 'chatBubble', 'gift', 'clock', 'cross', 'battery', 'envelope', 'chatBubble'];
registerShot('s07', { draw(g, t, info) { bg2(g, '#f4ecdc', '#e0d0b8'); const n = PILE.length, base = H() * 0.66;
  for (let i = 0; i < n; i++) { const t0 = 0.1 + i * (info.dur - 0.6) / n, p = prog(t, t0, t0 + 0.35); if (p <= 0) continue; const row = Math.floor(i / 4), col = i % 4, tx = W() / 2 + (col - 1.5) * 200 + (row % 2) * 70, ty = base - row * 150;
    D[PILE[i]](g, tx, lerp(-200, ty, ease.out(p)), 1.0, { t, text: PILE[i] === 'chatBubble' ? 'next time' : undefined, rot: (i % 3 - 1) * 0.2, level: 0.1, month: 'SAT', day: 14 }); }
  headNum(g, W() / 2, H() * 0.13, '41', t, 0, { size: 170, color: AMBER }); } });
// s08 "Then Dad asks how university is going. And you lie."  Dad's kitchen, his 100; your smile goes fake
const KCAM = { pos: [-0.4, 1.55, 4.6], look: [-0.4, 1.0, 0.3], fov: 50 };
const dadAt = (g, st, t, o = {}) => at(g, st, st.spots.chairOld, t, { cast: DAD, facing: 1, pose: breathe(POSES.sit, t, 0.6), expr: o.expr || 'smile', talk: o.talk });
const youAt = (g, st, t, o = {}) => at(g, st, st.spots.chairNew, t, { cast: HERO, facing: -1, pose: breathe(POSES.sit, t, 0.6), expr: o.expr || 'smile', talk: o.talk, look: [-0.6, 0] });
registerShot('s08', { kind: '3d', init: initK,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { ...KCAM, pos: [-0.4, 1.6, 5.2] }, to: KCAM }); },
  overlay(g, t, info, st) { const tl = wt(info, 'lie') ?? info.dur * 0.8; const d = dadAt(g, st, t, { talk: t < tl - 0.6 ? talkK(info, t) * 0.7 : 0 }); youAt(g, st, t, { expr: t > tl - 0.1 ? 'fake' : 'smile' }); numOn(g, d, '100', t, GOLD, 0.2, true); } });
// s09 "Every word, his number falls. Ninety-eight. Ninety-six."
registerShot('s09', { draw(g, t, info) { bg2(g, '#3a2a3a', '#1a1424'); glow(g, W() / 2, H() * 0.55, 700, '#ffb070', 0.25);
  const a = wt(info, 'ninety') ?? info.dur * 0.5, b = wt(info, 'ninety', a + 0.3) ?? info.dur * 0.8;
  bigToonFace(g, W() / 2, H() * 0.5, 270, { cast: DAD, expr: t > b ? 'sad' : 'neutral', blink: blink(t) });
  const x = W() / 2, y = H() * 0.17, o = { size: 190 }; if (t < a) headNum(g, x, y, '100', t, -1, { ...o, color: GOLD }); else if (t < b) numChange(g, x, y, '100', '98', t, a, o); else numChange(g, x, y, '98', '96', t, b, o); } });
// s10 "So you tell him the truth."
registerShot('s10', { draw(g, t, info) { bg2(g, '#3a2a3a', '#2a1a2a'); glow(g, W() / 2, H() * 0.5, 600, '#ffd8a0', 0.2 + 0.1 * prog(t, 0, info.dur));
  zoom(g, lerp(1, 1.08, ease.inOut(prog(t, 0, info.dur))), W() / 2, H() * 0.55, () => bigToonFace(g, W() / 2, H() * 0.5, 290, { cast: HERO, expr: 'determined', talk: talkK(info, t) * 0.8, blink: blink(t) })); } });
// s11 DAD "Thank you for telling me."  warm light floods in
registerShot('s11', { draw(g, t, info) { bg2(g, '#ffd8a8', '#e8a070'); glow(g, W() / 2, H() * 0.45, 900, '#fff2c8', 0.5);
  bigToonFace(g, W() / 2, H() * 0.5, 290, { cast: DAD, expr: 'smile', talk: talkK(info, t) * 0.7, blink: blink(t) }); headNum(g, W() / 2, H() * 0.17, '74', t, -1, { size: 170, color: AMBER }); } });
// s12 "And the number climbs back up."  the old table; 74 -> 83 -> 91 green
registerShot('s12', { kind: '3d', init: initK,
  draw(st, t, info) { cam3(st, t, info.dur, { from: KCAM, to: { ...KCAM, pos: [-0.4, 1.5, 4.0] } }); },
  overlay(g, t, info, st) { const d = dadAt(g, st, t, { expr: 'happy' }); youAt(g, st, t, { expr: 'smile' }); const k = info.dur, x = d.x, y = numY(d, true), o = { size: Math.max(40, 50 * d.s) };
    glow(g, x, y, 300, '#fff0c0', 0.2); if (t < k * 0.35) numChange(g, x, y, '74', '83', t, 0.15, o); else if (t < k * 0.7) numChange(g, x, y, '83', '91', t, k * 0.35, o); else headNum(g, x, y, '91', t, -1, { ...o, color: GREEN }); } });
// s13 "But the lowest number all week was the one above your own head."  bedroom mirror: your reflection, a hand hides the number
function reflection(g, st, P, t, o = {}) {
  const n = st.mirNormal, M = st.spots.mirror, d = (P[0] - M[0]) * n[0] + (P[2] - M[2]) * n[2], R = [P[0] - 2 * d * n[0], 0, P[2] - 2 * d * n[2]];
  const c = st.mirCorners.map(p => screenOf(st, p)); g.save(); g.beginPath(); c.forEach((p, i) => i ? g.lineTo(p.x, p.y) : g.moveTo(p.x, p.y)); g.closePath(); g.clip(); g.fillStyle = 'rgba(190,215,230,0.25)'; g.fill();
  const q = at(g, st, R, t, { facing: -(o.facing ?? 1), expr: o.expr, look: o.look, alpha: 0.9, shadow: false }); g.restore(); if (o.num) o.num(q); return q;
}
const MCAM = { pos: [2.1, 1.6, 0.5], look: [1.05, 1.2, -2.45], fov: 40 };
registerShot('s13', { kind: '3d', init: initB(0),
  draw(st, t, info) { cam3(st, t, info.dur, { from: MCAM, to: { ...MCAM, pos: [2.0, 1.58, 0.1], fov: 37 } }); },
  overlay(g, t, info, st) { reflection(g, st, st.spots.mirrorFront, t, { facing: 1, expr: 'worried', num: (q) => { const y = numY(q); glow(g, q.x, y, 160, RED, 0.35 + 0.15 * Math.sin(t * 6));
    D.mark(g, q.x, y, Math.max(0.45, 0.42 * q.s), { ch: '?', color: '#e0302a', rot: Math.sin(t * 4) * 0.12 }); } }); } });
// s14 "In the mirror, thirty-one."  the hand drops: 31, red
registerShot('s14', { kind: '3d', init: initB(0),
  draw(st, t, info) { cam3(st, t, info.dur, { from: { ...MCAM, pos: [2.0, 1.58, 0.1], fov: 37 }, to: { ...MCAM, pos: [1.8, 1.55, -0.5], fov: 32 } }); },
  overlay(g, t, info, st) { const tn = wt(info, 'thirty') ?? info.dur * 0.5; reflection(g, st, st.spots.mirrorFront, t, { facing: 1, expr: t > tn ? 'sad' : 'worried', num: (q) => { if (t > tn - 0.05) headNum(g, q.x, numY(q), '31', t, tn, { size: Math.max(60, 64 * q.s), color: RED }); } }); } });
// s15 "So you make your bed. Thirty-two. One point, slow, but real."
registerShot('s15', { kind: '3d', init: initB(0),
  draw(st, t, info) { st.setBed(ease.inOut(prog(t, 0.1, 1.1))); cam3(st, t, info.dur, { from: { pos: [0.9, 1.9, 2.6], look: [-0.4, 0.75, -2.0], fov: 52 }, to: { pos: [0.6, 1.7, 2.0], look: [-0.3, 0.9, -2.0], fov: 48 } }); },
  overlay(g, t, info, st) { const tn = wt(info, 'thirty') ?? 1.4; const q = at(g, st, [0.55, 0, -1.1], t, { facing: -1, pose: breathe(posesAt(t, [[0, 'reach'], [0.7, 'holdFront'], [1.3, 'relaxed']]), t), expr: t > tn ? 'smile' : 'determined' });
    const o = { size: Math.max(44, 52 * q.s) }; if (t < tn) headNum(g, q.x, numY(q), '31', t, -1, { ...o, color: RED }); else numChange(g, q.x, numY(q), '31', '32', t, tn, o); } });
// s16 "Whose number would you check first?"  three portraits; each number pops; flashes into the opening green (loop)
const TRIO = [[SAM, '41', AMBER, '#ffd08a'], [DAD, '96', GOLD, '#bfe2ff'], [HERO, '32', GREEN, '#c8f0d8']];
registerShot('s16', { draw(g, t, info) { bg2(g, '#2a1e48', '#4a3a6a'); FX.stars(g, t, { count: 60, area: [0, 0, W(), H() * 0.4] });
  TRIO.forEach(([c, n, col, bgc], i) => { const p = ease.outBack(prog(t, 0.1 + i * 0.25, 0.45 + i * 0.25)); if (p <= 0) return; const x = W() / 2, y = H() * (0.2 + i * 0.2);
    g.save(); g.translate(x - 90, y); g.scale(p, p); avatar(g, 0, 0, 130, c, bgc); g.restore(); headNum(g, x + 170, y, n, t, 0.2 + i * 0.25, { size: 110, color: col }); });
  D.mark(g, W() * 0.8, H() * 0.1, 0.8, { ch: '?', rot: Math.sin(t * 3) * 0.1 }); const lp = prog(t, info.dur - 0.35, info.dur); if (lp > 0) veil(g, '#8dffc8', 0.5 * lp, 'lighter'); } });
