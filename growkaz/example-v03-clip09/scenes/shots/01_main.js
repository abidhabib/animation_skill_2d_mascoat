// V03 Clip 9 "it's not about one man": tracing-paper chart overlay on a desk, the empty podium on the keynote stage, the talk-show panel,
// the candles with the NOV 12 line, the all-red AI heat-map. Rich style: other people, real objects, modern UI, varied camera.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, ROOMMATE, DAD, MOM, STRANGER, SHOPPER } from '/engine/toon2d.js';
import { blink, camEase } from '/engine/storyfx.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, zoomed, pop, money, backdrop } from '/engine/finfx.js';

const CROWD = [SHOPPER(0), SAM, SHOPPER(1), ROOMMATE, SHOPPER(2), DAD, SHOPPER(3), STRANGER, MOM];
const SUIT = (c, col) => ({ ...c, top: col, topDark: '#1a1a24', collar: '#e8e8f0' });

// i01 "Line the two charts up at the top, and the first weeks after the peak almost sit on top of each other."
//   a desk: the printed Cisco chart (amber) and a tracing-paper sheet with the Nvidia line (green) that slides over it until the peaks line up
const peak = (drop, seed) => Array.from({ length: 44 }, (_, i) => i <= 28 ? 0.06 + 0.94 * Math.pow(i / 28, 3.0) + Math.sin(i * 1.9 + seed) * 0.015 : 1 - drop * ease.out(clamp((i - 28) / 14, 0, 1)) + Math.sin(i * 2.3 + seed) * 0.012);
const CIS = peak(0.29, 0.4), NVD = peak(0.33, 2.1);
function polyline(g, x, y, w, h, arr, k, col, lw) { g.beginPath(); for (let i = 0; i <= (arr.length - 1) * k; i++) { const px = x + (i / (arr.length - 1)) * w, py = y + h * (1 - arr[i]); i ? g.lineTo(px, py) : g.moveTo(px, py); } g.strokeStyle = col; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); }
registerShot('i01', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.16, x0: 0, x1: -70, y0: 0, y1: 30 });
  zoomed(g, c, () => { const wood = g.createLinearGradient(0, 0, E.W, E.H); wood.addColorStop(0, '#9a6a48'); wood.addColorStop(1, '#5e3c28'); g.fillStyle = wood; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); for (let i = 0; i < 20; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.07)' : 'rgba(255,255,255,.03)'; g.fillRect(-E.W, i * 66 - 100, E.W * 3, 32); }
    FX.pool(g, E.W * 0.5, E.H * 0.25, 1000, 500, '#fff0c8', 0.22);
    // printed chart sheet (Cisco, amber)
    const px = E.W * 0.5 - 520, py = 120, pw = 1040, ph = 780; g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 40; g.shadowOffsetY = 18; rr(g, px, py, pw, ph, 6); g.fillStyle = '#fbf8f0'; g.fill(); g.restore();
    text(g, 'CISCO · MARCH 2000 PEAK', px + 40, py + 56, { size: 34, color: '#8a6a20', stroke: 0, align: 'left' });
    for (let i = 1; i < 8; i++) { seg(g, [[px + 50, py + 100 + i * 80], [px + pw - 50, py + 100 + i * 80]], 1.5, '#e4dccc'); }
    polyline(g, px + 60, py + 120, pw - 120, ph - 220, CIS, 1, '#e69a10', 8);
    // tracing paper (Nvidia, green) slides in from the right and settles over it
    const sk = ease.inOut(prog(t, 0.3, 2.5)), sx = lerp(px + 560, px + 14, sk), sy = lerp(py + 70, py + 8, sk), rot = lerp(0.07, 0, sk);
    g.save(); g.translate(sx + pw / 2, sy + ph / 2); g.rotate(rot); g.translate(-pw / 2, -ph / 2); rr(g, 0, 0, pw, ph, 6); g.fillStyle = 'rgba(210,235,225,.34)'; g.fill(); g.strokeStyle = 'rgba(255,255,255,.6)'; g.lineWidth = 3; g.stroke();
    text(g, 'NVIDIA · OCT 2026 PEAK', pw - 40, 56, { size: 34, color: '#1f8a52', stroke: 0, align: 'right' }); polyline(g, 60, 120, pw - 120, ph - 220, NVD, 1, '#1f9a5a', 8); g.restore();
    // aligned peak glow + first-5-weeks bracket + the two drops
    const al = ease.out(prog(t, 2.5, 3.3)); if (al > 0) { const ppx = px + 60 + (28 / 43) * (pw - 120), ppy = py + 120; glow(g, ppx, ppy, 120 * al, '#ffe28a', 0.5 * al); circle(g, ppx, ppy, 14 * al, '#ffffff');
      const bx0 = ppx, bx1 = px + pw - 60, by = py + ph - 70; seg(g, [[bx0, by], [bx1, by]], 6, INK); seg(g, [[bx0, by - 16], [bx0, by + 16]], 6, INK); seg(g, [[bx1, by - 16], [bx1, by + 16]], 6, INK); text(g, 'FIRST 5 WEEKS', (bx0 + bx1) / 2, by + 48, { size: 30, color: INK, stroke: 0 });
      const kk = pop(t, 3.3, 0.35); if (kk > 0) { g.save(); g.translate(px + pw - 60, py + 120 + (ph - 220) * 0.29 + 10); g.scale(kk, kk); rr(g, -150, -44, 150, 62, 16); g.fillStyle = '#e69a10'; g.fill(); text(g, '-29%', -75, -12, { size: 40, color: '#ffffff', stroke: 0 }); g.restore(); }
      const k2 = pop(t, 3.8, 0.35); if (k2 > 0) { g.save(); g.translate(px + pw - 60, py + 120 + (ph - 220) * 0.33 + 70); g.scale(k2, k2); rr(g, -150, -44, 150, 62, 16); g.fillStyle = '#1f9a5a'; g.fill(); text(g, '-33%', -75, -12, { size: 40, color: '#ffffff', stroke: 0 }); g.restore(); } }
    D.mug(g, E.W * 0.9, E.H * 0.5, 1.4, { color: '#f4f0e6', t }); D.deskLamp(g, E.W * 0.06, E.H * 0.9, 1.0, { on: 1 });
    g.save(); g.translate(E.W * 0.93, E.H * 0.86); g.rotate(-0.4); rr(g, -150, -18, 300, 36, 18); g.fillStyle = '#2a4a8a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); g.restore();     // a pen
    g.save(); g.translate(E.W * 0.1, E.H * 0.34); g.rotate(-0.1); rr(g, -90, -110, 180, 220, 14); g.fillStyle = '#2a2e38'; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke(); rr(g, -74, -96, 148, 56, 8); g.fillStyle = '#9ad8a0'; g.fill(); for (let r = 0; r < 4; r++) for (let q = 0; q < 3; q++) { rr(g, -66 + q * 46, -20 + r * 36, 38, 28, 6); g.fillStyle = q === 2 && r === 0 ? '#e0562f' : '#d8dce4'; g.fill(); } g.restore(); }); } });   // calculator

// i02 "Then, on November twelfth, Nvidia's founder, ... resigned, effective immediately."  keynote stage, empty podium in the spotlight, the audience's phones light up with BREAKING
registerShot('i02', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.2, x0: 0, x1: 0, y0: 70, y1: -40 });
  zoomed(g, c, () => { const sky = g.createLinearGradient(0, 0, 0, E.H); sky.addColorStop(0, '#0a0e26'); sky.addColorStop(1, '#1c1840'); g.fillStyle = sky; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    // truss + stage lights
    seg(g, [[0, 70], [E.W, 70]], 18, '#2a2e3a'); for (let i = 0; i < 9; i++) { const lx = 160 + i * 200; seg(g, [[lx, 70], [lx, 100]], 6, '#3a3e4a'); circle(g, lx, 112, 20, '#c8d0e0'); const flick = 0.6 + 0.4 * Math.sin(t * 3 + i); g.save(); g.globalCompositeOperation = 'lighter'; const cone = g.createLinearGradient(lx, 112, lx, 700); cone.addColorStop(0, `rgba(${i % 2 ? '120,160,255' : '255,200,140'},${0.16 * flick})`); cone.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = cone; g.beginPath(); g.moveTo(lx - 12, 118); g.lineTo(lx + 12, 118); g.lineTo(lx + 120, 700); g.lineTo(lx - 120, 700); g.closePath(); g.fill(); g.restore(); }
    // big LED screen
    rr(g, 300, 150, E.W - 600, 420, 14); g.fillStyle = '#05070f'; g.fill(); g.strokeStyle = '#3a4060'; g.lineWidth = 8; g.stroke(); const lg = g.createLinearGradient(300, 150, 1620, 570); lg.addColorStop(0, '#12306a'); lg.addColorStop(0.5, '#1a7a6a'); lg.addColorStop(1, '#3a1a6a'); g.save(); rr(g, 310, 160, E.W - 620, 400, 10); g.clip(); g.fillStyle = lg; g.fillRect(300, 150, E.W, 500);
    for (let i = 0; i < 6; i++) { g.strokeStyle = `rgba(255,255,255,${0.12 - i * 0.015})`; g.lineWidth = 3; g.beginPath(); for (let x = 300; x <= E.W - 300; x += 20) { const y = 360 + Math.sin(x * 0.012 + t * 1.2 + i) * (40 + i * 12) + i * 14 - 40; x === 300 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } g.restore();
    text(g, 'AI CHIPS KEYNOTE', E.W / 2, 300, { size: 84, color: '#ffffff', stroke: 0, glow: 18, glowColor: '#5ab4ff' }); text(g, 'DEVELOPER SUMMIT · NOV 12', E.W / 2, 400, { size: 36, color: '#a8c0ff', stroke: 0 });
    // stage floor + podium + spotlight
    g.fillStyle = '#16142c'; g.fillRect(-E.W, E.H * 0.62, E.W * 3, E.H); g.fillStyle = '#26224a'; g.beginPath(); g.moveTo(240, E.H * 0.62); g.lineTo(E.W - 240, E.H * 0.62); g.lineTo(E.W - 40, E.H * 0.8); g.lineTo(40, E.H * 0.8); g.closePath(); g.fill();
    const px = E.W / 2; g.save(); g.globalCompositeOperation = 'lighter'; const sp = g.createLinearGradient(px, 0, px, E.H * 0.7); sp.addColorStop(0, 'rgba(255,240,200,0)'); sp.addColorStop(1, 'rgba(255,240,200,.38)'); g.fillStyle = sp; g.beginPath(); g.moveTo(px - 30, 110); g.lineTo(px + 30, 110); g.lineTo(px + 330, E.H * 0.74); g.lineTo(px - 330, E.H * 0.74); g.closePath(); g.fill(); g.restore();
    rr(g, px - 110, E.H * 0.52, 220, 230, 12); g.fillStyle = '#c8ccd6'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); rr(g, px - 130, E.H * 0.5, 260, 36, 10); g.fillStyle = '#e8ecf4'; g.fill(); g.stroke(); seg(g, [[px + 40, E.H * 0.5], [px + 30, E.H * 0.45]], 7, '#2a2e38'); circle(g, px + 30, E.H * 0.445, 14, '#2a2e38');
    const tip = ease.in(prog(t, 3.8, 4.4)); g.save(); g.translate(px - 20, E.H * 0.6); g.rotate(-tip * 1.2); rr(g, -70, -26, 140, 52, 8); g.fillStyle = '#f4f0e6'; g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); text(g, 'FOUNDER', 0, 2, { size: 26, color: INK, stroke: 0 }); g.restore();
    rr(g, px + 260, E.H * 0.6, 90, 22, 8); g.fillStyle = '#3a3248'; g.fill(); seg(g, [[px + 280, E.H * 0.6 + 20], [px + 280, E.H * 0.74]], 8, '#3a3248'); seg(g, [[px + 330, E.H * 0.6 + 20], [px + 330, E.H * 0.74]], 8, '#3a3248');   // an empty stool
    // audience silhouettes with phones
    for (let row = 0; row < 3; row++) for (let i = 0; i < 12; i++) { const x = ((i + row * 0.5) * 170) - 60 + Math.sin(t * 1.4 + i + row) * 4, y = E.H * (0.9 + row * 0.07), s = 1 + row * 0.18, col = ['#0b0a18', '#12102a', '#1a1636'][row];
      circle(g, x, y - 90 * s, 44 * s, col); g.fillStyle = col; g.beginPath(); g.ellipse(x, y + 20 * s, 84 * s, 80 * s, 0, Math.PI, 0); g.fill(); g.strokeStyle = 'rgba(255,200,140,.25)'; g.lineWidth = 4; g.beginPath(); g.arc(x, y - 90 * s, 44 * s, -2.6, -0.5); g.stroke();
      const ph = 1.5 + (i % 5) * 0.25 + row * 0.1; if (t > ph && (i + row) % 2 === 0) { rr(g, x - 20 * s, y - 150 * s, 40 * s, 66 * s, 8 * s); g.fillStyle = '#9fd8ff'; g.fill(); glow(g, x, y - 120 * s, 90 * s, '#9fd8ff', 0.3 * clamp((t - ph) * 3, 0, 1)); } }
    // push notifications pop over the crowd
    [[2.2, 0.22, 0.58], [2.6, 0.5, 0.66], [3.0, 0.78, 0.6]].forEach(([t0, fx, fy]) => { const k = pop(t, t0, 0.3); if (k <= 0) return; g.save(); g.translate(E.W * fx, E.H * fy); g.scale(k, k); FP.glass(g, -230, -48, 460, 96, { r: 18, fill: 'rgba(28,32,46,.96)' }); circle(g, -190, 0, 20, '#e0302a'); text(g, 'BREAKING', -150, -14, { size: 22, color: '#ff8a7a', stroke: 0, align: 'left' }); text(g, 'Founder resigns, effective now', -150, 16, { size: 20, color: '#ffffff', stroke: 0, align: 'left' }); g.restore(); });
    const dk = pop(t, 0.2, 0.4); if (dk > 0) { g.save(); g.translate(E.W - 200, 240); g.scale(0.9 * dk, 0.9 * dk); D.calendar(g, 0, 0, 1, { month: 'NOV', day: 12, color: '#e0302a' }); g.restore(); } }); } });

// i03 "So the easy story became, it's just the CEO news. It'll pass."  a talk-show studio: three pundits at a curved desk wave it off; the banner changes
registerShot('i03', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.02, z1: 1.12, x0: -50, x1: 50, y0: 10, y1: -10 });
  zoomed(g, c, () => { const bg = g.createLinearGradient(0, 0, 0, E.H); bg.addColorStop(0, '#13204a'); bg.addColorStop(1, '#0a1230'); g.fillStyle = bg; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);
    for (let i = 0; i < 9; i++) { rr(g, 90 + i * 200, 60, 150, 360, 10); g.fillStyle = i % 2 ? '#1a2a5a' : '#142250'; g.fill(); g.fillStyle = `rgba(90,180,255,${0.08 + 0.06 * Math.sin(t * 2 + i)})`; g.fillRect(100 + i * 200, 70, 130, 340); }
    rr(g, 520, 100, 880, 360, 14); g.fillStyle = '#05070f'; g.fill(); g.strokeStyle = '#3a4880'; g.lineWidth = 8; g.stroke(); FP.candles(g, 560, 140, 640, 280, [60, 64, 70, 75, 80, 88, 96, 110, 130, 150, 170, 160, 150, 130, 120, 128, 135, 140, 150, 138], 1, { dec: 0, vol: false, ma: false }); text(g, 'MARKETS LIVE', 1250, 180, { size: 34, color: '#5ab4ff', stroke: 0 });
    const cast = [[E.W * 0.22, { ...STRANGER, top: '#c03a4a', topDark: '#902a38' }, 0.2], [E.W * 0.5, SUIT(DAD, '#2a3a5a'), 0.5], [E.W * 0.78, SUIT(SHOPPER(1), '#3a5a4a'), 0.8]];
    cast.forEach(([x, cs, d], i) => { const ex = t > 2.6 ? 'smug' : 'smile', ps = t > 2.4 ? 'shrug' : (t > 0.4 ? 'explain' : 'stand'); drawToon(g, { x, y: E.H * 0.9, s: 1.6, facing: i === 2 ? -1 : 1, cast: cs, pose: breathe(posesAt(t + d, [[0, 'stand'], [0.4 + d, 'explain'], [2.4, ps]]), t + i), expr: ex, talk: t > 0.3 + i * 0.3 && t < 2.2, blink: blink(t + i), rim: { color: '#5ab4ff', dir: [0.7, -0.7], w: 3 } }); });
    g.fillStyle = '#2a2018'; g.beginPath(); g.moveTo(-100, E.H * 0.8); g.quadraticCurveTo(E.W / 2, E.H * 0.7, E.W + 100, E.H * 0.8); g.lineTo(E.W + 100, E.H * 1.1); g.lineTo(-100, E.H * 1.1); g.closePath(); g.fill(); g.strokeStyle = '#5a4a38'; g.lineWidth = 10; g.stroke(); g.fillStyle = '#c8a060'; g.beginPath(); g.moveTo(-100, E.H * 0.8); g.quadraticCurveTo(E.W / 2, E.H * 0.7, E.W + 100, E.H * 0.8); g.lineTo(E.W + 100, E.H * 0.8 + 12); g.quadraticCurveTo(E.W / 2, E.H * 0.7 + 12, -100, E.H * 0.8 + 12); g.closePath(); g.fill();
    D.mug(g, E.W * 0.34, E.H * 0.78, 1.0, { color: '#f4f0e6', t }); D.mug(g, E.W * 0.64, E.H * 0.78, 1.0, { color: '#e0562f', t });
    FP.newsBanner(g, 120, E.H - 170, E.W - 240, t > 3.2 ? "IT'LL PASS." : (t > 1.4 ? 'JUST THE CEO NEWS?' : 'AI CHIP LEADER: WHAT NEXT?'), t, { tag: 'LIVE', ticker: 'NVDA -8.1%   FOUNDER RESIGNS   ANALYSTS: "BUY THE DIP"   AI STOCKS SLIP   FED WATCH' }); }); } });

// i04 "But look at the timing. More than half of the fall had already happened before that announcement."
//   a dark chart: falling candles; a dashed line at NOV 12; the part BEFORE the line is highlighted and braced "MORE THAN HALF"
const FALL = [239, 236, 238, 233, 229, 231, 226, 222, 224, 218, 213, 215, 209, 205, 207, 201, 198, 196, 199, 194, 190, 192, 172, 168, 171, 163, 166, 160, 158, 161, 155, 157, 152, 156, 150, 153];
registerShot('i04', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.12, z1: 1.0, x0: -40, x1: 20 });
  zoomed(g, c, () => { g.fillStyle = '#0a0d16'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); glow(g, E.W / 2, E.H * 0.4, 900, '#ff4d5e', 0.06);
    FP.glass(g, 110, 70, E.W - 220, 800, { r: 30 }); const cx0 = 170, cy0 = 130, cw = E.W - 520, ch = 620, n = FALL.length, k = ease.inOut(prog(t, 0.1, 1.9)), lx = cx0 + (22 / n) * cw;
    g.fillStyle = 'rgba(255,77,94,.08)'; g.fillRect(cx0, cy0, lx - cx0, ch + 40); FP.candles(g, cx0, cy0, cw, ch, FALL, k, { dec: 0, prefix: '$' });
    const dl = prog(t, 1.2, 1.9); if (dl > 0) { g.setLineDash([16, 12]); seg(g, [[lx, cy0 - 10], [lx, cy0 + (ch + 40) * dl]], 4, '#ffe28a'); g.setLineDash([]); rr(g, lx - 200, cy0 - 60, 400, 50, 25); g.fillStyle = '#ffe28a'; g.fill(); text(g, 'NOV 12 · RESIGNATION', lx, cy0 - 34, { size: 24, color: INK, stroke: 0 }); }
    const bk = ease.out(prog(t, 2.2, 3.0)); if (bk > 0) { const by = cy0 + ch + 60; seg(g, [[cx0 + 10, by], [lx - 10, by]], 8, GOLD); seg(g, [[cx0 + 10, by - 18], [cx0 + 10, by + 18]], 8, GOLD); seg(g, [[lx - 10, by - 18], [lx - 10, by + 18]], 8, GOLD);
      g.save(); g.globalAlpha = bk; FP.glass(g, cx0 + 80, by + 28 + (1 - bk) * 20, 620, 110, { r: 20, fill: 'rgba(40,34,10,.9)', border: 'rgba(255,226,138,.5)' }); text(g, 'MORE THAN HALF OF THE FALL', cx0 + 390, by + 66, { size: 34, color: GOLD, stroke: 0 }); text(g, 'ALREADY HAPPENED BEFORE THE NEWS', cx0 + 390, by + 108, { size: 22, color: '#c8c0a0', stroke: 0 }); g.restore(); }
    [[E.W * 0.08, '#4a5a7a'], [E.W * 0.93, '#7a3a3a']].forEach(([x, col], i) => { g.save(); g.translate(x, E.H * 1.04); g.fillStyle = col; g.beginPath(); g.ellipse(0, 150, 230, 150, 0, Math.PI, 0); g.fill(); g.fillStyle = '#1a1210'; g.beginPath(); g.ellipse(0, -8, 98, 118, 0, 0, 7); g.fill(); g.strokeStyle = 'rgba(160,200,255,.5)'; g.lineWidth = 6; g.beginPath(); g.arc(0, -8, 100, i ? -2.6 : -2.6, -0.6); g.stroke(); g.restore(); }); }); } });

// i05 "AI stocks were already sliding. This wasn't about one man."  a market heat-map, all red; a stamp: NOT ONE MAN
const AIS = [['NVDA', 20, -6.1], ['MSFT', 14, -3.2], ['AVGO', 9, -5.4], ['AMD', 5, -7.2], ['META', 8, -4.1], ['GOOGL', 11, -2.9], ['AMZN', 10, -3.6], ['ORCL', 4, -8.3], ['TSM', 7, -5.8], ['MU', 3, -9.1], ['ARM', 2.5, -6.6], ['SMCI', 2, -11.0], ['DELL', 2.5, -4.4], ['CRWV', 2, -9.8]];
registerShot('i05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.07, x0: 20, x1: -20 });
  zoomed(g, c, () => { g.fillStyle = '#0a0d16'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); FP.glass(g, 100, 60, E.W - 200, 900, { r: 30 }); text(g, 'AI STOCKS · THIS WEEK', 160, 112, { size: 34, color: '#ffffff', stroke: 0, align: 'left' }); text(g, 'illustrative', E.W - 160, 112, { size: 20, color: '#6a7080', stroke: 0, align: 'right' });
    FP.heatmap(g, 140, 150, E.W - 280, 770, AIS, ease.out(prog(t, 0, 1.6)), { max: 8 });
    const k = pop(t, 2.3, 0.3); if (k > 0) { veil(g, '#000000', 0.35 * Math.min(1, k)); const sh = t < 2.7 ? Math.sin(t * 60) * 6 * (1 - prog(t, 2.3, 2.7)) : 0; g.save(); g.translate(E.W / 2 + sh, E.H * 0.5); g.rotate(-0.07); g.scale(k, k); rr(g, -480, -110, 960, 220, 26); g.fillStyle = 'rgba(30,6,10,.92)'; g.fill(); g.strokeStyle = '#ff4d5e'; g.lineWidth = 10; g.stroke(); text(g, 'NOT ONE MAN', 0, 6, { size: 150, color: '#ff4d5e', stroke: 0, glow: 22, glowColor: '#ff2a3a' }); g.restore(); } }); } });
