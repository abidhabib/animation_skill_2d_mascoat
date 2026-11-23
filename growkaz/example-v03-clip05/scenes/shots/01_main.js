// V03 Clip 5 "the first drop": rich version (user 2026-11-22: no lone hero, real objects, modern UI, varied camera).
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, ROOMMATE, DAD, MOM, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { office2000 } from '/engine/sets3d/office2000.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, Y2K, zoomed, pop, money, backdrop } from '/engine/finfx.js';

const RIM2K = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM, SHOPPER(0), SAM, SHOPPER(2)];
const initO = (T) => { const o = office2000(T, { time: 'day' }); Object.assign(o.st, { spots: o.spots, upd: o.update }); return o.st; };
const person = (g, st, p, t, cast, o = {}) => { const q = pin(st, p, 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast, pose: o.pose, expr: o.expr || 'happy', look: o.look, blink: blink(t + (o.ph || 0)), rim: RIM2K, talk: o.talk }); return q; };
// the whole floor: every seat filled; mode 'cheer' | 'work' | 'flicker'
function floor(g, st, t, mode, o = {}) { st.spots.deskSeats.forEach((p, i) => { if (o.skip && o.skip(p, i)) return; const ph = i * 0.37, cheer = mode === 'cheer' && t > 0.2 + (i % 4) * 0.12;
  const pose = cheer ? breathe(posesAt(t + ph, [[0, 'cheer'], [0.6, 'pointUp'], [1.2, 'cheer']]), t + ph) : breathe(POSES.stand, t + ph);
  person(g, st, [p[0] + (i % 2 ? 0.15 : -0.1), 0, p[2] + 0.05], t, i === 9 ? Y2K : CROWD[i % CROWD.length], { pose, expr: cheer ? (i % 3 ? 'joy' : 'laugh') : (o.expr || 'smile'), facing: i % 3 ? -1 : 1, ph, talk: cheer && i % 2 === 0 }); }); }
function confetti(g, t, n = 90) { for (let i = 0; i < n; i++) { const x = ((i * 211.7) % E.W) + Math.sin(t * 2 + i) * 30, y = ((i * 97 + t * (140 + (i % 5) * 30)) % (E.H + 100)) - 50, c = ['#ffd03a', '#5aff8a', '#5ab4ff', '#ff6a8a', '#ffffff'][i % 5];
  g.save(); g.translate(x, y); g.rotate(t * 4 + i); g.scale(1, Math.abs(Math.sin(t * 6 + i))); g.fillStyle = c; g.fillRect(-7, -4, 14, 8); g.restore(); } }
const CISCO = [62, 64, 63, 66, 68, 67, 70, 72, 71, 74, 76, 75, 78, 80, 79, 77, 74, 72, 73, 69, 66, 67, 63, 60, 61, 58, 57, 56];
const BOUNCE = CISCO.concat([58, 60, 59, 62, 64, 63, 66, 65, 67, 68]);

// e01 "Nobody cared, because the story was true. The internet really did change everything."  the floor celebrates; confetti; crane up past the crowd to the ticker
registerShot('e01', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t); cam3(st, t, info.dur, { from: { pos: [-2.8, 1.3, 5.4], look: [0.0, 1.2, 0.0], fov: 48 }, to: { pos: [1.2, 2.6, 4.2], look: [0.0, 2.3, -3.9], fov: 44 } }); },
  overlay(g, t, info, st) { floor(g, st, t, 'cheer'); confetti(g, t); } });

// e02 "The story was right. The price was wrong."  breakfast table, morning light: the newspaper headline gets a green tick; then a red 100x PROFIT sticker slaps on
registerShot('e02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.1, x0: 60, x1: -40, y0: 20, y1: -10 });
  zoomed(g, c, () => { const wood = g.createLinearGradient(0, 0, E.W, E.H); wood.addColorStop(0, '#8a5a3a'); wood.addColorStop(1, '#5a3824'); g.fillStyle = wood; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 18; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.06)' : 'rgba(255,255,255,.03)'; g.fillRect(-E.W, i * 70 - 100, E.W * 3, 34); }
    FX.pool(g, E.W * 0.3, E.H * 0.2, 900, 500, '#fff0c8', 0.25);
    D.mug(g, E.W * 0.82, E.H * 0.42, 1.5, { color: '#f4f0e6', t }); D.glass(g, E.W * 0.12, E.H * 0.9, 1.2, { fill: 0.7 });
    g.save(); g.translate(E.W * 0.85, E.H * 0.82); g.rotate(0.3); rr(g, -90, -45, 180, 90, 18); g.fillStyle = '#2a2a33'; g.fill(); rr(g, -70, -30, 90, 40, 6); g.fillStyle = '#9ad8a0'; g.fill(); text(g, '555-0123', -25, -10, { size: 16, color: '#1a3a20', stroke: 0 }); g.restore();   // a pager
    FP.newspaper(g, E.W * 0.47, E.H * 0.52, 1.18, { rot: -0.05, photo: (g, x, y, w, h) => { g.fillStyle = '#e8e2d0'; g.fillRect(x, y, w, h); g.strokeStyle = '#222'; g.lineWidth = 5; g.beginPath(); for (let i = 0; i <= 12; i++) g.lineTo(x + 14 + i * (w - 28) / 12, y + h - 20 - i * i * 1.25 - Math.sin(i) * 8); g.stroke(); } });
    const tk = pop(t, 0.95, 0.4); if (tk > 0) { g.save(); g.translate(E.W * 0.66, E.H * 0.17); g.scale(tk, tk); D.tick(g, 0, 0, 1, {}); g.restore(); text(g, 'RIGHT', E.W * 0.66, E.H * 0.29, { size: 40, color: '#ffffff', stroke: 7, strokeColor: INK }); }
    const sk = prog(t, 2.55, 2.75); if (sk > 0) { const k = sk < 1 ? 1.6 - 0.6 * ease.out(sk) : 1; g.save(); g.translate(E.W * 0.47 + (t > 2.75 ? Math.sin(t * 60) * 4 * (1 - prog(t, 2.75, 3.1)) : 0), E.H * 0.62); g.rotate(-0.14); g.scale(k, k);
      rr(g, -230, -70, 460, 140, 20); g.fillStyle = '#e0302a'; g.fill(); g.strokeStyle = '#ffffff'; g.lineWidth = 8; g.stroke(); text(g, 'PRICE: 100x PROFIT', 0, 4, { size: 44, color: '#ffffff', stroke: 0 }); g.restore(); } }); } });

// e03 "Then the first drop came. In about five weeks, Cisco fell roughly thirty percent."  over the shoulders of two traders: the amber terminal; candles turn red
function shoulders(g, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.ellipse(0, 210, 260, 150, 0, Math.PI, 0); g.fill(); g.fillStyle = '#1a1210'; g.beginPath(); g.ellipse(0, 0, 105, 125, 0, 0, 7); g.fill(); g.fillStyle = '#2a1a14'; for (let i = 0; i < 9; i++) { g.beginPath(); g.arc(-80 + i * 20, -70 + Math.sin(i) * 14, 34, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(255,190,80,.55)'; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 108, -2.6, -0.6); g.stroke(); g.restore(); }
registerShot('e03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.12, x0: 0, x1: 40 }), sh = t > 4.2 ? Math.sin(t * 50) * 6 * (1 - prog(t, 4.2, 4.7)) : 0;
  zoomed(g, { ...c, x: c.x + sh }, () => { g.fillStyle = '#0b0a0a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.45, 900, '#ffb000', 0.12);
    rr(g, 230, 40, E.W - 460, 820, 50); g.fillStyle = '#d8d0bc'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); rr(g, 270, 80, E.W - 540, 740, 30); g.fillStyle = '#1a1a1a'; g.fill();
    const k = clamp(0.5 + t * 0.12, 0, 1); FP.term2000(g, 290, 100, E.W - 580, 700, t, { data: CISCO, k, date: t > 2 ? '05/01/00 16:00' : '03/27/00 16:00', table: [['LAST', (CISCO[Math.floor(CISCO.length * k) - 1]).toFixed(2), ''], ['HIGH', '80.06', ''], ['CHG', '', t > 4.2 ? '-30.1%' : '-12.4%'], ['VOL', '182.4M', ''], ['P/E', '131x', '']] });
    if (t > 4.2) { const fk = pop(t, 4.2, 0.35); g.save(); g.translate(E.W * 0.36, E.H * 0.3); g.scale(fk, fk); money(g, 0, 0, '-30%', t, -1, RED, 120); g.restore(); }
    shoulders(g, E.W * 0.2, E.H * 1.02, 1.05, '#4a5a7a'); shoulders(g, E.W * 0.86, E.H * 1.06, 1.15, '#7a3a3a'); }); } });

// e04 "And people said exactly what you're hearing today. It's a dip. Buy it."  2000: living-room TV news "BUY THE DIP" | 2026: phone feed, same words
registerShot('e04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.04, z1: 1.0 });
  zoomed(g, c, () => { const W = E.W / 2;
    // left: a 2000 living room
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, W + E.W, E.H * 3); g.clip(); g.fillStyle = '#c8a878'; g.fillRect(-E.W, -E.H, W + E.W, E.H * 3); for (let i = 0; i < 20; i++) { g.fillStyle = 'rgba(120,70,40,.12)'; g.fillRect(i * 48, 0, 20, E.H); }
    g.fillStyle = '#6a4a30'; g.fillRect(-E.W, E.H * 0.82, W + E.W, E.H); FX.pool(g, W * 0.5, E.H * 0.45, 500, 300, '#9fd0ff', 0.2);
    FP.tv2000(g, W * 0.46, E.H * 0.46, 0.78, (g2, x, y, w, h) => { const gr = g2.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#1a3a7a'); gr.addColorStop(1, '#0a1a3a'); g2.fillStyle = gr; g2.fillRect(x, y, w, h);
      g2.fillStyle = 'rgba(255,255,255,.08)'; for (let i = 0; i < 8; i++) g2.fillRect(x + i * 90, y, 40, h); bigToonFace(g2, x + w * 0.5, y + h * 0.62, 105, { cast: { ...STRANGER, top: '#2a2a3a', topDark: '#1a1a2a', collar: '#c03030' }, expr: 'happy', talk: t > 0.3 && Math.sin(t * 14) > 0, blink: blink(t) });
      FP.newsBanner(g2, x + 10, y + h - 130, w - 20, t > 2.7 ? "IT'S A DIP. BUY IT." : 'TECH SELLOFF: OPPORTUNITY?', t, { tag: 'MARKETS' }); }, t);
    D.plant(g, W * 0.1, E.H * 0.86, 1.2, { kind: 'tall', t }); D.deskLamp(g, W * 0.88, E.H * 0.84, 0.9, { on: 1 }); text(g, '2000', W * 0.5, E.H * 0.08, { size: 60, color: '#ffffff', stroke: 8, strokeColor: INK }); g.restore();
    // right: 2026, a phone in the dark with the feed
    g.save(); g.beginPath(); g.rect(W, -E.H, W + E.W, E.H * 3); g.clip(); g.fillStyle = '#0c1020'; g.fillRect(W, -E.H, W + E.W, E.H * 3); for (let i = 0; i < 12; i++) glow(g, W + (i * 173) % W, (i * 241) % E.H, 80, ['#5ab4ff', '#ff6a8a', '#ffd08a'][i % 3], 0.12);
    FP.phone(g, W * 1.5, E.H * 0.53, 1.05, (g2, x, y, w, h) => { g2.fillStyle = '#0c0e14'; g2.fillRect(x, y, w, h); text(g2, 'Following', x + w / 2, y + 80, { size: 22, color: '#ffffff', stroke: 0 });
      const posts = [[2.72, 'Alex', "It's a dip.", SAM, '#4fb286', ['12K', '1.9K', '']], [3.28, 'Jordan', 'Buy it. \u{1F680}', ROOMMATE, '#e0743a', ['31K', '4.4K', '']], [0.4, 'Priya', 'Never selling.', MOM, '#c96f8a', ['8.1K', '920', '']]];
      posts.forEach(([t0, n, tx, cast, col, likes], i) => { const k = ease.out(prog(t, t0, t0 + 0.35)); if (k <= 0) return; g2.save(); g2.globalAlpha = k; FP.post(g2, x + 12, y + 110 + i * 200 - 30 * (1 - k), w - 24, { name: n, handle: '@' + n.toLowerCase(), text: tx, cast, color: col, likes, h: 180, size: 26, ago: i === 2 ? '1h' : 'now' }); g2.restore(); }); }, { time: '9:41' });
    text(g, '2026', W * 1.5, E.H * 0.08, { size: 60, color: '#ffffff', stroke: 8, strokeColor: INK }); g.restore();
    seg(g, [[W, 0], [W, E.H]], 10, INK); }); } });

// e05 "Even better, it bounced. Three months after the peak, Cisco was down less than twenty percent."  the terminal bounces green; a glass card counts the gap
registerShot('e05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.12, z1: 1.0, x0: -40, x1: 20 });
  zoomed(g, c, () => { g.fillStyle = '#0b0a0a'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.45, 900, '#35e06a', 0.1);
    rr(g, 230, 40, E.W - 460, 820, 50); g.fillStyle = '#d8d0bc'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); rr(g, 270, 80, E.W - 540, 740, 30); g.fillStyle = '#1a1a1a'; g.fill();
    const k = lerp(CISCO.length / BOUNCE.length, 1, ease.inOut(prog(t, 0.6, 4.4))); FP.term2000(g, 290, 100, E.W - 580, 700, t, { data: BOUNCE, k, date: '06/27/00 16:00', title: 'GP  Price Graph  (3 months)' });
    const gk = ease.out(prog(t, 4.4, 4.9)); if (gk > 0) { g.save(); g.globalAlpha = gk; FP.glass(g, E.W * 0.62, E.H * 0.16 - 20 * (1 - gk), 420, 170); text(g, 'FROM THE PEAK', E.W * 0.62 + 210, E.H * 0.16 + 45, { size: 26, color: '#a8b0c0', stroke: 0 });
      text(g, '-16%', E.W * 0.62 + 210, E.H * 0.16 + 110, { size: 72, color: '#ffd24a', stroke: 0 }); g.restore(); }
    shoulders(g, E.W * 0.16, E.H * 1.04, 1.1, '#3a6a4a'); shoulders(g, E.W * 0.9, E.H * 1.02, 1.0, '#4a5a7a'); }); } });

// e06 "The dip buyers felt like geniuses. But that bounce was a trap."  the floor cheers, 2000-you grins in sunglasses... then the lights flicker red
registerShot('e06', { kind: '3d', init: initO,
  draw(st, t, info) { st.upd(t + 4); const h = st.spots.heroChair; cam3(st, t, info.dur, { from: { pos: [h[0] + 3.0, 1.5, h[2] + 3.4], look: [h[0] - 0.3, 1.15, h[2] - 1.0], fov: 44 }, to: { pos: [h[0] + 1.5, 1.4, h[2] + 2.2], look: [h[0] - 0.1, 1.2, h[2] - 0.6], fov: 34 } }); },
  overlay(g, t, info, st) { const trap = t > 3.55; floor(g, st, trap ? 0 : t, trap ? 'stand' : 'cheer', { expr: 'worried', skip: (p, i) => i === 9 });
    const q = person(g, st, st.spots.heroChair, t, Y2K, { facing: -1, pose: breathe(posesAt(t, [[0, 'cheer'], [1.2, 'crossArms'], [3.6, 'stand']]), t), expr: trap ? 'shocked' : 'smug' });
    if (!trap) { const gx = q.x, gy = q.y - 252 * q.s, s = q.s; g.fillStyle = '#111'; rr(g, gx - 50 * s, gy - 10 * s, 44 * s, 24 * s, 8 * s); g.fill(); rr(g, gx + 6 * s, gy - 10 * s, 44 * s, 24 * s, 8 * s); g.fill(); seg(g, [[gx - 6 * s, gy], [gx + 6 * s, gy]], 4 * s, '#111'); }
    if (trap) { const f = Math.sin(t * 40) > 0.2 ? 0.45 : 0.15; veil(g, '#4a0008', f * (1 - 0.3 * prog(t, 3.6, 4.2))); } } });

// e07 "Traders call it a sucker's rally, a rise that pulls people back in right before the real damage starts."
//   a dark trading-floor wall; a mousetrap baited with a glowing green up-arrow; little investors walk in... SNAP
registerShot('e07', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.14, x0: 0, x1: -60, y0: 0, y1: 30 }), snap = prog(t, 5.0, 5.12), sh = t > 5.04 ? Math.sin(t * 70) * 10 * (1 - prog(t, 5.04, 5.6)) : 0;
  zoomed(g, { ...c, x: c.x + sh }, () => { backdrop(g, '#2a1e18', '#120c0a', t, { bokeh: ['#ffb000', '#ff5a3a'] });
    g.fillStyle = '#3a2a20'; g.fillRect(-E.W, E.H * 0.72, E.W * 3, E.H); for (let i = 0; i < 30; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.12)' : 'rgba(255,255,255,.03)'; g.fillRect(-E.W + i * 110, E.H * 0.72, 54, E.H); }
    rr(g, 120, 90, E.W - 240, 90, 12); g.fillStyle = '#050505'; g.fill(); const tick = 'CSCO 66.13 ▲  NASDAQ 3,966 ▲  "THE BOTTOM IS IN"  INTC 64.25 ▲  ORCL 78.00 ▲  '; g.save(); g.beginPath(); g.rect(120, 90, E.W - 240, 90); g.clip(); for (let k = 0; k < 3; k++) text(g, tick, 140 - (t * 160) % 1500 + k * 1500, 137, { size: 40, color: t > 5.04 ? '#ff4a3a' : '#35e06a', stroke: 0, align: 'left' }); g.restore();
    const tx = E.W * 0.62, ty = E.H * 0.8; FP.mousetrap(g, tx, ty, 1.9, snap, { bait: (g2, bx, by) => { glow(g2, bx, by, 120, '#5aff8a', 0.5 + 0.2 * Math.sin(t * 5)); g2.fillStyle = '#2fd67a'; g2.strokeStyle = INK; g2.lineWidth = 5; g2.beginPath(); g2.moveTo(bx, by - 60); g2.lineTo(bx + 46, by); g2.lineTo(bx + 18, by); g2.lineTo(bx + 18, by + 40); g2.lineTo(bx - 18, by + 40); g2.lineTo(bx - 18, by); g2.lineTo(bx - 46, by); g2.closePath(); g2.fill(); g2.stroke(); } });
    const walkers = [[SHOPPER(1), 0.0], [SAM, 0.5], [SHOPPER(3), 1.0], [ROOMMATE, 1.6], [Y2K, 2.2]];
    walkers.forEach(([cast, d], i) => { const p = ease.inOut(prog(t, 0.6 + d * 0.5, 4.9)), x = lerp(-160 - i * 190, tx - 430 - i * 170, p), caught = t > 5.04;
      drawToon(g, { x: caught ? x - 40 * prog(t, 5.04, 5.4) : x, y: E.H * 0.92, s: 1.05, facing: caught ? -1 : 1, cast, pose: caught ? breathe(POSES.handsOnHead, t) : walkPose(t * 6 + i), expr: caught ? 'shocked' : 'happy', blink: blink(t + i), rim: { color: '#ffb000', dir: [0.7, -0.7], w: 3 } }); });
    if (t > 5.04) { veil(g, '#5a0008', 0.3 * (1 - prog(t, 5.04, 6.0))); const k = pop(t, 5.1, 0.3); g.save(); g.translate(tx, E.H * 0.45); g.scale(k, k); text(g, 'SNAP', 0, 0, { size: 130, color: '#ffffff', stroke: 12, strokeColor: '#c01a1a' }); g.restore(); } }); } });
