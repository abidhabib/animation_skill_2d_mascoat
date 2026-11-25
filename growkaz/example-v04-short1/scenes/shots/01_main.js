// V04 Short "What If Unsaid Words Arrived as Packages?" (9:16). Cinematic 2D layers + 3D kitchen, Character 19 cast.
import { E, registerShot as reg0, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil, rng, shade, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, DAD, MIA } from '/engine/toon2d.js';
import { cam3, pin } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';
import { D } from '/engine/props2d.js';

const W = () => E.W, H = () => E.H, INK = '#1d1418';
const talkAt = (gt) => { const w = E.words.find((w) => gt >= w.start - 0.03 && gt <= w.end + 0.05); return w ? clamp(0.2 + 0.8 * Math.abs(Math.sin(gt * 15) * (0.65 + 0.35 * Math.sin(gt * 6.3)))) : 0; };
function capt(g, gt) { const ws = E.words; let i = -1; for (let k = ws.length - 1; k >= 0; k--) if (gt >= ws[k].start - 0.05) { if (gt <= ws[k].end + 0.4) i = k; break; } if (i < 0) return;
  const ends = (k) => /[.?!,]$/.test(ws[k].word); let st = 0; for (let k = 0; k <= i;) { st = k; let n = 0; while (k < ws.length && n < 3) { n++; if (ends(k++)) break; } }
  const grp = []; for (let k = st; k < ws.length && grp.length < 3; k++) { grp.push(k); if (ends(k)) break; }
  const sz = 70; g.save(); g.font = `700 ${sz}px "${FONTS.title}"`; const strs = grp.map((k) => ws[k].word.replace(/[.,!]$/, '').toUpperCase()), wd = strs.map((s) => g.measureText(s).width + 10), gap = 30, tot = wd.reduce((a, b) => a + b, 0) + gap * (strs.length - 1), k0 = Math.min(1, (E.W - 150) / tot);
  const y = E.H * 0.775; g.translate(E.W / 2, y); g.scale(k0, k0); g.fillStyle = 'rgba(11,6,32,.55)'; rr(g, -tot / 2 - 34, -58, tot + 68, 116, 40); g.fill();
  let x = -tot / 2; strs.forEach((s, j) => { const cur = grp[j] === i, p = cur ? 1 + 0.1 * ease.out(prog(gt, ws[grp[j]].start, ws[grp[j]].start + 0.12)) : 1; g.save(); g.translate(x + wd[j] / 2, 2); g.scale(p, p); text(g, s, 0, 0, { size: sz, color: cur ? '#ffd84a' : '#ffffff', stroke: 10, strokeColor: '#0b0620' }); g.restore(); x += wd[j] + gap; }); g.restore(); }
const reg = (id, def) => reg0(id, def.kind === '3d' ? { ...def, overlay(g, t, info, st) { def.overlay && def.overlay(g, t, info, st); capt(g, info.globalT); } } : { ...def, draw(g, t, info) { def.draw(g, t, info); capt(g, info.globalT); } });
// camera: eased zoom + pan around a focus point, with a little handheld sway
function cam(g, t, dur, from, to, fn) { const k = ease.inOut(clamp(t / dur)), z = lerp(from[0], to[0], k), fx = lerp(from[1], to[1], k), fy = lerp(from[2], to[2], k), sx = Math.sin(t * 1.7) * 5 + Math.sin(t * 3.1) * 2, sy = Math.cos(t * 1.3) * 5;
  g.save(); g.translate(W() / 2 + sx, H() / 2 + sy); g.scale(z, z); g.translate(-fx * W(), -fy * H()); fn(k); g.restore(); }
const grad = (g, stops, y0 = 0, y1 = H()) => { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); };
const SKY = { dawn: [[0, '#1e2250'], [0.35, '#5a4a86'], [0.55, '#e88a7a'], [0.7, '#ffd09a']], sunset: [[0, '#2a1850'], [0.35, '#8a3a78'], [0.55, '#f06a52'], [0.72, '#ffc070']], night: [[0, '#0b1030'], [0.55, '#232a5c'], [0.75, '#4a4078']] };
// a row of houses with porches; base = ground y
function houses(g, base, pal, off = 0, k = 1, lit = 1) { const r = rng(5); for (let i = -2; i < 6; i++) { const w = 330 * k, x = i * 350 * k + off, h = (420 + r() * 190) * k, c = pal[(i + 6) % pal.length];
  rr(g, x, base - h, w, h, 6); g.fillStyle = c; g.fill(); g.strokeStyle = INK; g.lineWidth = 5; g.stroke();
  g.fillStyle = shade(c, -0.35); g.beginPath(); g.moveTo(x - 26 * k, base - h + 8); g.lineTo(x + w / 2, base - h - 150 * k); g.lineTo(x + w + 26 * k, base - h + 8); g.closePath(); g.fill(); g.stroke();
  for (let j = 0; j < 2; j++) { const wx = x + (46 + j * 150) * k, wy = base - h + 60 * k, on = r() < 0.65 * lit; rr(g, wx, wy, 90 * k, 110 * k, 6); g.fillStyle = on ? '#ffd98a' : '#2a2448'; g.fill(); g.stroke(); seg(g, [[wx + 45 * k, wy], [wx + 45 * k, wy + 110 * k]], 4, INK); if (on) glow(g, wx + 45 * k, wy + 55 * k, 120 * k, '#ffd98a', 0.18); }
  const dx = x + w / 2 - 55 * k; rr(g, dx, base - 200 * k, 110 * k, 200 * k, 8); g.fillStyle = shade(c, -0.5); g.fill(); g.stroke(); circle(g, dx + 90 * k, base - 100 * k, 7 * k, '#ffd84a'); } }
const ground = (g, base, c1, c2) => { const gr = g.createLinearGradient(0, base, 0, H() * 1.2); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(-W(), base, W() * 3, H() * 2); seg(g, [[-W(), base], [W() * 2, base]], 6, alpha(INK, 0.6)); };
// a front door close-up; open 0..1 shows warm light
function doorway(g, x, base, w, h, open, wall) { g.fillStyle = wall; g.fillRect(-W(), -H(), W() * 3, base + H());
  g.strokeStyle = alpha(INK, 0.14); g.lineWidth = 4; for (let y = -200; y < base; y += 74) seg(g, [[-W(), y], [W() * 2, y]], 4, alpha(INK, 0.14));
  rr(g, x - w / 2 - 34, base - h - 34, w + 68, h + 34, 14); g.fillStyle = '#3a2430'; g.fill();
  const gr = g.createLinearGradient(0, base - h, 0, base); gr.addColorStop(0, '#fff0c4'); gr.addColorStop(1, '#f0a060'); g.fillStyle = gr; g.fillRect(x - w / 2, base - h, w, h);
  const dw = w * (1 - open * 0.86); rr(g, x - w / 2, base - h, dw, h, 8); g.fillStyle = '#7a4030'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); if (dw > 150) { for (const py of [0.08, 0.52]) { rr(g, x - w / 2 + 30, base - h + h * py, dw - 60, h * 0.38, 10); g.lineWidth = 4; g.stroke(); } circle(g, x - w / 2 + dw - 34, base - h * 0.47, 14, '#ffd84a'); }
  if (open > 0.1) glow(g, x + w * 0.2, base - h * 0.45, w * 1.5, '#ffd08a', 0.35 * open); }
const motes = (g, t, col = '#ffe9b0', n = 34) => { const r = rng(9); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = r() * W(), s = 3 + r() * 6, y = ((r() * H() - t * (18 + r() * 40)) % H() + H()) % H(); circle(g, x + Math.sin(t + i) * 18, y, s, alpha(col, 0.16 + 0.14 * Math.sin(t * 2 + i))); } g.restore(); };
const vig = (g, a = 0.55) => { const v = g.createRadialGradient(W() / 2, H() * 0.5, W() * 0.35, W() / 2, H() * 0.5, H() * 0.72); v.addColorStop(0, 'rgba(8,4,20,0)'); v.addColorStop(1, `rgba(8,4,20,${a})`); g.fillStyle = v; g.fillRect(0, 0, W(), H()); };
const PAL = ['#8a5a78', '#5a6a96', '#b06a5a', '#5a8a7a', '#9a7a52'];
const drop = (p) => (p < 0.7 ? Math.pow(p / 0.7, 2) : 1 - Math.sin((p - 0.7) / 0.3 * Math.PI) * 0.06);

// N1 every doorbell rings: boxes drop onto every porch
reg('s01', { draw(g, t, info) { grad(g, SKY.dawn); FX.stars(g, t, { count: 40, area: [0, 0, W(), H() * 0.25] }); glow(g, W() * 0.7, H() * 0.55, 700, '#ffd09a', 0.5);
  cam(g, t, info.dur, [1.28, 0.5, 0.56], [1.0, 0.5, 0.5], () => { houses(g, H() * 0.5, ['#5a4270', '#43507a', '#6a4466'], -t * 12, 0.6, 0.5); houses(g, H() * 0.66, PAL, 40 - t * 26, 1.0); ground(g, H() * 0.66, '#4a3a66', '#1a1430');
    [[0.2, 0.1], [0.52, 0.45], [0.84, 0.85], [0.35, 1.2], [0.7, 1.55]].forEach(([fx, t0], i) => { const p = prog(t, t0, t0 + 0.55); if (p <= 0) return; const gy = H() * (0.685 + (i % 2) * 0.035), y = lerp(-200, gy, drop(p));
      D.parcel(g, W() * fx, y, 0.62 + (i % 2) * 0.14, { glow: 0.5 + 0.5 * Math.sin(t * 5 + i), t }); if (p >= 0.7) FX.rings(g, W() * fx, gy - 90, t - t0, { color: '#ffd98a', a: 0.4, r1: 170 }); }); });
  motes(g, t); vig(g); } });
// N2 your porch: you open the door and look down at the glowing box
reg('s02', { draw(g, t, info) { cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.34, 0.58, 0.6], () => { const base = H() * 0.74; doorway(g, W() * 0.32, base, 430, 960, ease.inOut(prog(t, 0.1, 0.9)), '#4a3a6a'); ground(g, base, '#6a4a60', '#2a1a30');
    drawToon(g, { x: W() * 0.34, y: base - 6, s: 2.5, cast: HERO, actions: [[0, 'openDoor'], [1.1, 'idle'], [2.6, 'think']], t, facing: 1, yaw: 0.6, expr: t < 1.3 ? 'sleepy' : t < 3 ? 'surprised' : 'curious', look: t > 1.1 ? [0.8, 0.7] : undefined });
    D.parcel(g, W() * 0.73, base + 40, 1.15, { glow: 0.35 + 0.65 * prog(t, 1.8, 3.6), t, label: ['TO: YOU'] }); });
  motes(g, t); vig(g); } });
// S1 sister: "Why is yours bigger than the fridge?"  tilt up the giant box
reg('s03', { draw(g, t, info) { grad(g, SKY.dawn); cam(g, t, info.dur, [1.12, 0.52, 0.66], [1.0, 0.5, 0.47], () => { houses(g, H() * 0.68, ['#6a4a7a', '#4a5a86', '#7a5070'], -100, 0.8, 0.4); ground(g, H() * 0.68, '#5a446a', '#1e1430');
    D.parcel(g, W() * 0.66, H() * 0.73, 1.9, { w: 320, h: 600, glow: 0.7, t });
    drawToon(g, { x: W() * 0.2, y: H() * 0.735, s: 2.35, cast: MIA, actions: [[0, 'recoil'], [0.8, 'pointUp'], [1.9, 'shrug']], t, facing: 1, yaw: 0.55, expr: t < 1.7 ? 'shocked' : 'confused', talk: talkAt(info.globalT), look: [0.7, -0.5] }); });
  vig(g, 0.45); } });
// N3 heavier: the porch cracks, years tick
reg('s04', { draw(g, t, info) { grad(g, [[0, '#171433'], [0.6, '#46305e'], [1, '#150f28']]); const sh = t > 0.5 ? Math.sin(t * 60) * 7 * Math.max(0, 1 - ((t * 1.35) % 1) * 3) : 0;
  cam(g, t, info.dur, [1.0, 0.5, 0.52], [1.18, 0.5, 0.58], () => { g.translate(sh, 0); const base = H() * 0.68, sink = ease.out(prog(t, 0.2, info.dur)) * 80; ground(g, base, '#5a4060', '#1a1028');
    D.parcel(g, W() / 2, base + sink, 1.8 + 0.25 * prog(t, 0, info.dur), { h: 330, glow: 0.4 + 0.3 * Math.sin(t * 7), t });
    ground(g, base + sink + 6, '#4a3252', '#1a1028');
    for (let i = 0; i < 9; i++) { const k = ease.out(prog(t, 0.4 + i * 0.12, 1.4 + i * 0.12)); if (k <= 0) continue; const d = (i - 4) * 0.45; const pts = [[W() / 2 + (i - 4) * 80, base + sink + 8]]; for (let j = 1; j <= 4; j++) pts.push([pts[0][0] + d * j * 80 * k + (j % 2 ? 26 : -20), base + sink + 8 + j * 62 * k]); seg(g, pts, 8 - Math.abs(i - 4), '#12091c'); } });
  const yr = Math.min(3, 1 + Math.floor(prog(t, 0.25, info.dur - 0.3) * 3)), p = ease.outBack(clamp(((prog(t, 0.25, info.dur - 0.3) * 3) % 1) * 3 + (yr === 3 && t > info.dur - 0.4 ? 1 : 0)));
  g.save(); g.translate(W() / 2, H() * 0.2); g.scale(0.7 + 0.3 * p, 0.7 + 0.3 * p); text(g, `${yr} YEAR${yr > 1 ? 'S' : ''}`, 0, 0, { size: 150, color: '#ff8a6a', stroke: 22, strokeColor: INK, glow: 30, glowColor: 'rgba(255,100,70,.8)' }); g.restore(); vig(g); } });
// H1 "No way. That one can't be mine."
reg('s05', { draw(g, t, info) { grad(g, [[0, '#3a2a6a'], [0.55, '#8a4a6a'], [1, '#2a1838']]); glow(g, W() * 0.8, H() * 0.35, 800, '#ffb070', 0.35); motes(g, t, '#ffc8a0', 22);
  cam(g, t, info.dur, [1.0, 0.5, 0.5], [1.16, 0.5, 0.46], () => bigToonFace(g, W() / 2 + Math.sin(t * 13) * 14 * prog(t, 0.1, 0.4) * (1 - prog(t, 0.8, 1.1)), H() * 0.43, 270, { cast: HERO, expr: t < 1.05 ? 'shocked' : 'nervous', talk: talkAt(info.globalT), t })); vig(g); } });
// N4 the label: your own handwriting
reg('s06', { draw(g, t, info) { grad(g, [[0, '#a86a40'], [1, '#6a3a24']]); cam(g, t, info.dur, [1.18, 0.46, 0.43], [1.0, 0.5, 0.5], () => { g.fillStyle = '#c88a55'; g.fillRect(-W(), -H(), W() * 3, H() * 3); g.fillStyle = '#dda872'; g.fillRect(W() * 0.4, -H(), 220, H() * 3);
    for (let i = 0; i < 26; i++) seg(g, [[-100, i * 90], [W() + 100, i * 90 + 14]], 3, alpha('#7a4a24', 0.18));
    g.save(); g.translate(W() / 2, H() * 0.43); g.rotate(-0.04); g.fillStyle = 'rgba(30,10,0,.25)'; rr(g, -432, -358, 880, 740, 30); g.fill(); rr(g, -450, -380, 880, 740, 30); g.fillStyle = '#fff6e4'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
      text(g, 'DELIVER WHEN SAID', -10, -300, { size: 46, color: '#a89a86' }); seg(g, [[-400, -250], [380, -250]], 5, '#d8ccb8');
      const write = (str, y, size, t0, t1, col) => { const p = prog(t, t0, t1); if (p <= 0) return; g.save(); g.beginPath(); g.rect(-440, y - size, 860 * p, size * 2); g.clip(); text(g, str, -10, y, { size, font: 'Playfair Display', weight: 900, italic: true, color: col }); g.restore(); if (p < 1) circle(g, -440 + 860 * p, y + size * 0.2, 10, col); };
      write('To: Dad', -90, 190, 0.2, 1.8, '#2a3a8a'); write('Waiting: 3 years', 130, 90, 2.2, 3.5, '#2a3a8a');
      const s = ease.outBack(prog(t, 3.5, 3.8)); if (s > 0) { g.save(); g.translate(150, 270); g.rotate(-0.16); g.scale(s, s); rr(g, -210, -52, 420, 104, 16); g.strokeStyle = '#d0342a'; g.lineWidth = 9; g.stroke(); text(g, 'NEVER SENT', 0, 3, { size: 58, color: '#d0342a' }); g.restore(); }
    g.restore(); }); vig(g, 0.5); } });
// S2 "It only opens if you say it out loud."
reg('s07', { draw(g, t, info) { grad(g, SKY.dawn); cam(g, t, info.dur, [1.05, 0.44, 0.55], [1.22, 0.4, 0.52], () => { const base = H() * 0.73; houses(g, H() * 0.66, ['#6a4a7a', '#4a5a86', '#7a5070'], -260, 0.8, 0.4); ground(g, H() * 0.66, '#5a446a', '#1e1430');
    D.parcel(g, W() * 0.74, base + 20, 1.6, { w: 320, h: 460, glow: 0.3 + 0.7 * Math.abs(Math.sin(t * 4)) * prog(t, 0.6, 1.2), t, label: ['TO: DAD'] });
    drawToon(g, { x: W() * 0.3, y: base, s: 2.55, cast: MIA, actions: [[0, 'idle'], [0.25, 'pressButton'], [1.4, 'explain']], t, facing: 1, yaw: 0.6, expr: t < 1.4 ? 'curious' : 'friendly', talk: talkAt(info.globalT) }); }); motes(g, t); vig(g, 0.45); } });
// N5 drag it across town: sunset travelling shot
reg('s08', { draw(g, t, info) { grad(g, SKY.sunset); glow(g, W() * 0.75, H() * 0.55, 750, '#ffc070', 0.6); circle(g, W() * 0.75, H() * 0.5, 150, '#ffe2a0');
  cam(g, t, info.dur, [1.0, 0.5, 0.55], [1.12, 0.5, 0.58], () => { const base = H() * 0.7; houses(g, H() * 0.6, ['#4a2a5a', '#5a3060', '#3a2450'], 500 - t * 55, 0.6, 0.35); houses(g, H() * 0.665, ['#6a3a5e', '#4a3a6a', '#7a404e'], 640 - t * 150, 0.85, 0.5); ground(g, H() * 0.665, '#6a3a52', '#1c0e24');
    for (let i = 0; i < 9; i++) { const x = ((i * 260 - t * 330) % 2340 + 2340) % 2340 - 400; seg(g, [[x, base + 80], [x + 110, base + 80]], 12, alpha('#ffd0a0', 0.5)); }
    const hx = lerp(W() * 0.52, W() * 0.66, t / info.dur), bx = hx - 400, jit = Math.abs(Math.sin(t * 6)) * 6;
    D.parcel(g, bx, base + 8 - jit, 1.05, { h: 330, glow: 0.45, t, label: ['TO: DAD'] });
    for (let i = 0; i < 6; i++) { const p = (t * 1.6 + i / 6) % 1; circle(g, bx - 170 - p * 160, base - p * 50, 16 + p * 30, alpha('#ffd0b0', 0.28 * (1 - p))); }
    seg(g, [[bx + 175, base - 190], [(bx + hx) / 2 + 60, base - 150], [hx - 20, base - 250]], 12, INK); seg(g, [[bx + 175, base - 190], [(bx + hx) / 2 + 60, base - 150], [hx - 20, base - 250]], 6, '#e0b878');
    drawToon(g, { x: hx, y: base, s: 2.2, cast: HERO, action: 'walk', t: t * 0.8 + 1, facing: 1, expr: 'determined' }); }); vig(g, 0.45); } });
// D1 Dad opens the door: his own giant box behind him
reg('s09', { draw(g, t, info) { cam(g, t, info.dur, [1.34, 0.42, 0.52], [1.0, 0.5, 0.5], () => { const base = H() * 0.73; doorway(g, W() * 0.5, base, 700, 1060, ease.inOut(prog(t, 0, 0.45)), '#5a3050');
    g.save(); g.globalAlpha = prog(t, 0.5, 1.1); D.parcel(g, W() * 0.66, base - 8, 1.25, { h: 460, glow: 0.8, t, label: ['TO: MY KID'] }); g.restore(); ground(g, base, '#6a3a4a', '#1c0e20');
    drawToon(g, { x: W() * 0.32, y: base + 14, s: 2.6, cast: DAD, actions: [[0, 'openDoor'], [0.7, 'shrug'], [1.9, 'idle']], t, facing: 1, yaw: 0.5, expr: t < 0.6 ? 'surprised' : 'grateful', talk: talkAt(info.globalT) }); }); motes(g, t, '#ffd0a0'); vig(g); } });
// H2 "Dad, I'm sorry I stopped calling."
reg('s10', { draw(g, t, info) { grad(g, SKY.sunset); glow(g, W() * 0.2, H() * 0.4, 900, '#ffc890', 0.45); FX.pool && motes(g, t, '#ffd8a8', 28);
  cam(g, t, info.dur, [1.02, 0.5, 0.47], [1.2, 0.5, 0.43], () => bigToonFace(g, W() / 2, H() * 0.43 + 10 * ease.out(prog(t, 0, 0.6)), 280, { cast: HERO, expr: t < 1.7 ? 'sad' : 'hopeful', talk: talkAt(info.globalT), t, tilt: 0.04 })); vig(g, 0.6); } });
// N6 the box splits open: empty, light everywhere
reg('s11', { draw(g, t, info) { const burst = prog(t, 1.0, 1.35), after = prog(t, 1.35, 2.2); grad(g, [[0, '#241848'], [0.55, '#7a3a66'], [1, '#1a1030']]);
  if (burst > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 16; i++) { const a = -Math.PI + i * Math.PI / 15, len = 1600 * ease.out(burst); g.fillStyle = alpha('#ffe6a8', 0.11 * (1 - after * 0.5)); g.beginPath(); g.moveTo(W() / 2, H() * 0.5); g.arc(W() / 2, H() * 0.5, len, a - 0.06 + Math.sin(t * 0.7) * 0.05, a + 0.06 + Math.sin(t * 0.7) * 0.05); g.closePath(); g.fill(); } g.restore(); }
  cam(g, t, info.dur, [1.28, 0.5, 0.58], [1.0, 0.5, 0.52], () => { const base = H() * 0.7; ground(g, base, '#6a3a5a', '#1a0e24');
    if (t > 1.4) { drawToon(g, { x: W() * 0.16, y: base - 10, s: 2.0, cast: HERO, actions: [[1.4, 'recoil'], [2.6, 'idle']], t, facing: 1, yaw: 0.6, expr: t < 3 ? 'awe' : 'relieved' }); drawToon(g, { x: W() * 0.86, y: base - 10, s: 2.0, cast: DAD, actions: [[1.4, 'idle'], [3.2, 'reach']], t, facing: -1, yaw: 0.6, expr: 'grateful' }); }
    D.parcel(g, W() / 2 + (t < 1.0 ? Math.sin(t * 55) * 12 * t : 0), base + 40, 1.45, { h: 330, glow: 1 - after * 0.5, t, crack: t < 1.2 ? prog(t, 0.15, 1.0) : 0, open: ease.out(burst) });
    if (burst > 0) { glow(g, W() / 2, base - 470, 520, '#fff2c0', 0.7 * (1 - after * 0.6)); const r = rng(4); for (let i = 0; i < 60; i++) { const a = r() * Math.PI * 2, v = 200 + r() * 700, p = ease.out(prog(t, 1.05, 3.2)); circle(g, W() / 2 + Math.cos(a) * v * p, base - 470 + Math.sin(a) * v * p - p * 200 + p * p * 260, 4 + r() * 8, alpha('#ffe9a8', 0.9 * (1 - p * 0.8))); } } });
  if (burst > 0 && t < 1.5) veil(g, '#fff6d8', 0.7 * (1 - prog(t, 1.1, 1.5)), 'lighter'); vig(g, 0.45); } });
// D2 the kitchen: two mugs, steam
const initK = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
reg('s12', { kind: '3d', init: initK, draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.4, 1.7, 5.4], look: [-0.4, 1.0, 0.3], fov: 50 }, to: { pos: [-0.5, 1.45, 3.9], look: [-0.45, 1.0, 0.3], fov: 47 } }); },
  overlay(g, t, info, st) { for (const [spot, cast, facing, expr, talk, action] of [['chairOld', DAD, 1, 'friendly', talkAt(info.globalT), 'sit'], ['chairNew', HERO, -1, 'grateful', 0, 'sit']]) { const q = pin(st, st.spots[spot], 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, cast, action, t, facing, expr, talk }); }
    motes(g, t, '#ffd8a0', 20); vig(g, 0.4); } });
// N7 your phone: doorbell camera, a new box from Mia
reg('s13', { draw(g, t, info) { grad(g, [[0, '#101536'], [0.6, '#2a2458'], [1, '#0c0a20']]); glow(g, W() / 2, H() * 0.46, 800, '#6a8aff', 0.25);
  cam(g, t, info.dur, [0.94, 0.5, 0.5], [1.1, 0.5, 0.47], () => { const buzz = t < 0.9 ? Math.sin(t * 70) * 7 : 0; g.translate(buzz, 0);
    D.handPhone(g, W() / 2, H() * 0.44, 3.0, { t, screen: (g2, x, y, w, h) => { const k = w / 134; g2.fillStyle = '#1c2448'; g2.fillRect(x, y, w, h); g2.fillStyle = '#4a4a78'; g2.fillRect(x, y + h * 0.18, w, h * 0.46); g2.fillStyle = '#5a3a50'; g2.fillRect(x + w * 0.18, y + h * 0.2, w * 0.34, h * 0.42); g2.fillStyle = '#322c50'; g2.fillRect(x, y + h * 0.62, w, h * 0.16);
      const p = prog(t, 1.0, 1.7); if (p > 0) D.parcel(g2, x + w * 0.66, lerp(y, y + h * 0.69, drop(p)), 0.14 * k, { glow: 0.6 + 0.4 * Math.sin(t * 6), t });
      circle(g2, x + w * 0.1, y + h * 0.14, 3 * k, Math.sin(t * 6) > 0 ? '#ff4a3a' : '#7a2a2a'); text(g2, 'FRONT DOOR', x + w * 0.58, y + h * 0.14, { size: 9 * k, color: '#ffffff' });
      const n = ease.outBack(prog(t, 2.2, 2.6)); if (n > 0) { g2.save(); g2.translate(x + w / 2, y + h * 0.86); g2.scale(n, n); rr(g2, -w * 0.46, -18 * k, w * 0.92, 36 * k, 8 * k); g2.fillStyle = '#ffffff'; g2.fill(); text(g2, 'New delivery', 0, -7 * k, { size: 10 * k, color: '#1b1424' }); text(g2, 'From: Mia', 0, 8 * k, { size: 11 * k, color: '#d0342a' }); g2.restore(); } } }); }); vig(g, 0.5); } });
// N8 the loop: your doorstep at dawn, the doorbell glows and rings again
reg('s14', { draw(g, t, info) { cam(g, t, info.dur, [1.3, 0.55, 0.62], [1.0, 0.5, 0.5], () => { const base = H() * 0.7; doorway(g, W() * 0.4, base, 520, 1000, 0, '#3a3466'); ground(g, base, '#5a4468', '#1a1230');
    D.parcel(g, W() * 0.58, base + 60, 1.0, { glow: 0.55 + 0.45 * Math.sin(t * 5), t, label: ['FROM: MIA'] });
    const bx = W() * 0.82, by = base - 480; rr(g, bx - 46, by - 76, 92, 152, 22); g.fillStyle = '#e8e0d0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 6; g.stroke(); circle(g, bx, by + 14, 24, '#ffd84a'); glow(g, bx, by + 14, 160, '#ffd84a', 0.4 + 0.4 * Math.abs(Math.sin(t * 6))); if (t > 1.5) FX.rings(g, bx, by + 14, t, { color: '#ffd84a', a: 0.6, r1: 190 }); });
  motes(g, t); vig(g); const lp = prog(t, info.dur - 0.25, info.dur); if (lp > 0) veil(g, '#ffd09a', 0.45 * lp, 'lighter'); } });
