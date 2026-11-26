// popups.js: DESIGNED pop-up elements (user 2026-11-26: "popups should not look generic, everything unique, good taste").
// Idea: a pop-up is a physical OBJECT from the story's world (board, receipt, tag, stamp, jar, neon...), never a glowing capsule.
//   import { POP, capt2, spring } from '/engine/popups.js';
//   POP.flap(g, x, y, t, { value: '$240', label: 'EARNED', s: 1, out })   t = seconds since it appears; out = t at which it leaves
// All are centred on (x, y), animate in by themselves, keep a little life afterwards, and fit their text.
import { E, ease, prog, clamp, lerp, rr, seg, circle, alpha, shade, rng, glow, FONTS } from '/engine/core.js';

const INK = '#1d1418', TAU = Math.PI * 2;
export const spring = (t, f = 13, d = 7) => (t <= 0 ? 0 : 1 - Math.exp(-d * t) * Math.cos(f * t));
const font = (g, size, o = {}) => { g.font = `${o.italic ? 'italic ' : ''}${o.weight || 700} ${size}px "${o.family || FONTS.title}"`; };
// text that shrinks to fit maxW; returns the size used
function fit(g, str, x, y, size, maxW, color, o = {}) { font(g, size, o); const w = g.measureText(str).width; if (w > maxW) { size *= maxW / w; font(g, size, o); } g.textAlign = o.align || 'center'; g.textBaseline = 'middle';
  if (o.stroke) { g.lineJoin = 'round'; g.lineWidth = o.stroke; g.strokeStyle = o.strokeColor || INK; g.strokeText(str, x, y); } g.fillStyle = color; g.fillText(str, x, y); return size; }
const shadow = (g, blur = 34, dy = 22, a = 0.34) => { g.shadowColor = `rgba(8,3,16,${a})`; g.shadowBlur = blur * g.getTransform().a; g.shadowOffsetY = dy * g.getTransform().a; };
const flatShadow = (g) => { g.shadowColor = 'transparent'; g.shadowBlur = 0; g.shadowOffsetY = 0; };
const poly = (g, pts) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };
const grain = (g, x, y, w, h, col, n, seed = 1, r0 = 2) => { const r = rng(seed); g.fillStyle = col; for (let i = 0; i < n; i++) g.fillRect(x + r() * w, y + r() * h, 1 + r() * r0, 1 + r() * r0); };
// shared wrapper: position, spring entrance, exit
function pop(fn, enter = 'drop') { return (g, x, y, t, o = {}) => { if (t < 0) return; const gone = o.out != null ? ease.in(prog(t, o.out, o.out + 0.28)) : 0; if (gone >= 1) return; const k = spring(t);
  g.save(); g.translate(x, y); const s = o.s ?? 1; g.scale(s, s);
  if (enter === 'drop') g.translate(0, (1 - k) * -260); else if (enter === 'zoom') g.scale(0.3 + 0.7 * k, 0.3 + 0.7 * k); else if (enter === 'side') g.translate((1 - k) * 620, 0);
  g.globalAlpha *= Math.min(1, t * 9) * (1 - gone); g.translate(0, -gone * 120); fn(g, t, o); g.restore(); }; }

export const POP = {};
// 1 SPLIT-FLAP BOARD: station-style tiles that flip through characters, then lock. o: {value, label, color}
POP.flap = pop((g, t, o) => { const str = String(o.value ?? '$240'), n = str.length, tw = Math.min(150, 640 / n), th = tw * 1.45, W = n * (tw + 12) + 56;
  shadow(g); rr(g, -W / 2, -th / 2 - 34, W, th + 68, 26); g.fillStyle = '#2b2a2e'; g.fill(); flatShadow(g); g.strokeStyle = '#6a5a3a'; g.lineWidth = 6; rr(g, -W / 2 + 10, -th / 2 - 24, W - 20, th + 48, 18); g.stroke();
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) { circle(g, sx * (W / 2 - 22), sy * (th / 2 + 12), 7, '#c9a95a'); seg(g, [[sx * (W / 2 - 26), sy * (th / 2 + 12)], [sx * (W / 2 - 18), sy * (th / 2 + 12)]], 2.5, '#5a4622'); }
  const pool = '0123456789$';
  [...str].forEach((ch, i) => { const lock = 0.18 + i * 0.12, done = t >= lock, c = done ? ch : pool[Math.floor(t * 22 + i * 3) % pool.length], x = -W / 2 + 28 + i * (tw + 12), f = done ? clamp((t - lock) * 9) : (t * 22) % 1;
    rr(g, x, -th / 2, tw, th, 12); const gr = g.createLinearGradient(0, -th / 2, 0, th / 2); gr.addColorStop(0, '#17161a'); gr.addColorStop(0.49, '#232228'); gr.addColorStop(0.51, '#121115'); gr.addColorStop(1, '#1f1e24'); g.fillStyle = gr; g.fill();
    fit(g, c, x + tw / 2, 4, th * 0.72, tw * 0.86, o.color || '#ffd166'); g.fillStyle = '#050407'; g.fillRect(x, -2, tw, 4);
    if (f < 1) { g.save(); g.globalAlpha *= 0.85 * (1 - f); g.translate(x + tw / 2, 0); g.scale(1, Math.max(0.02, 1 - f)); rr(g, -tw / 2, -th / 2, tw, th / 2, 12); g.fillStyle = '#2e2c34'; g.fill(); g.restore(); } });
  if (o.label) { g.save(); g.translate(0, th / 2 + 62); g.rotate(-0.025); shadow(g, 14, 8); rr(g, -130, -28, 260, 56, 8); g.fillStyle = '#e9dcc0'; g.fill(); flatShadow(g); fit(g, o.label, 0, 2, 32, 230, '#3a2c18', { family: 'Nunito', weight: 900 }); g.restore(); } });

// 2 ODOMETER: chrome drums rolling up to a number. o: {value:number, prefix, digits, dur}
POP.odometer = pop((g, t, o) => { const v = o.value ?? 240, digits = o.digits || String(v).length, cur = v * ease.out(clamp(t / (o.dur || 1.1))), dw = 120, dh = 170, pre = o.prefix ?? '$', W = digits * dw + (pre ? 110 : 40) + 40, x0 = -W / 2 + 30 + (pre ? 80 : 0);
  const bw = W + 40, bh = dh + 92; shadow(g); poly(g, [[-bw / 2 + 26, -bh / 2], [bw / 2 - 26, -bh / 2], [bw / 2, -bh / 2 + 26], [bw / 2, bh / 2 - 26], [bw / 2 - 26, bh / 2], [-bw / 2 + 26, bh / 2], [-bw / 2, bh / 2 - 26], [-bw / 2, -bh / 2 + 26]]); const m = g.createLinearGradient(0, -bh / 2, 0, bh / 2); m.addColorStop(0, '#f1d27a'); m.addColorStop(0.42, '#b98a2e'); m.addColorStop(0.62, '#8a6018'); m.addColorStop(1, '#d9ae4c'); g.fillStyle = m; g.fill(); flatShadow(g); g.strokeStyle = INK; g.lineWidth = 7; g.stroke(); rr(g, -W / 2 + 6, -dh / 2 - 18, W - 12, dh + 36, 18); g.fillStyle = '#24190c'; g.fill(); for (const sx of [-1, 1]) for (const sy of [-1, 1]) { circle(g, sx * (bw / 2 - 24), sy * (bh / 2 - 22), 8, '#6a4a14'); circle(g, sx * (bw / 2 - 26), sy * (bh / 2 - 24), 3, '#ffe9a8'); }
  if (pre) fit(g, pre, x0 - 42, 6, 104, 70, '#ffd166');
  for (let i = 0; i < digits; i++) { const pw = 10 ** (digits - 1 - i), roll = pw === 1 ? cur : Math.floor(cur / pw) + clamp((cur % pw) - (pw - 1)), x = x0 + i * dw, base = Math.floor(roll), fr = roll - base;
    g.save(); rr(g, x + 5, -dh / 2, dw - 10, dh, 14); g.fillStyle = '#fbf4e4'; g.fill(); g.clip(); for (let k = -1; k <= 1; k++) fit(g, String(((base + k) % 10 + 10) % 10), x + dw / 2, (k - fr) * 128 + 6, 128, dw - 28, '#201a16');
    const sh = g.createLinearGradient(0, -dh / 2, 0, dh / 2); sh.addColorStop(0, 'rgba(20,10,0,.75)'); sh.addColorStop(0.3, 'rgba(20,10,0,0)'); sh.addColorStop(0.7, 'rgba(20,10,0,0)'); sh.addColorStop(1, 'rgba(20,10,0,.75)'); g.fillStyle = sh; g.fillRect(x, -dh / 2, dw, dh); g.restore(); }
  g.fillStyle = '#d0342a'; poly(g, [[x0 + digits * dw + 2, 0], [x0 + digits * dw + 26, -16], [x0 + digits * dw + 26, 16]]); g.fill(); }, 'zoom');

// 3 RECEIPT: thermal paper feeding out of a slot, itemised, with a big total. o: {title, rows:[[label, amount]], total}
POP.receipt = pop((g, t, o) => { const rows = o.rows || [['Minute 1', '$1'], ['Minute 2', '$1'], ['Minute 3', '$1']], W = 440, full = 270 + rows.length * 62, k = ease.out(clamp(t / 0.9)), h = full * k, top = -full / 2;
  g.save(); g.beginPath(); g.rect(-W, top, W * 2, full + 60); g.clip(); g.translate(0, h - full); g.rotate(Math.sin(t * 2.4) * 0.006); const pts = [[-W / 2, top], [W / 2, top]]; for (let i = 0; i <= 14; i++) pts.push([W / 2 - (i * W) / 14, top + full - (i % 2 ? 22 : 0)]); shadow(g, 30, 16); poly(g, pts); g.fillStyle = '#fbf8f0'; g.fill(); flatShadow(g);
    grain(g, -W / 2, top, W, full - 24, 'rgba(90,70,40,.08)', 500, 4);
    fit(g, o.title || 'THINKLE MART', 0, top + 54, 40, W - 70, '#26201c', { family: 'Nunito', weight: 900 }); g.setLineDash([10, 9]); seg(g, [[-W / 2 + 28, top + 92], [W / 2 - 28, top + 92]], 4, '#8a8278'); g.setLineDash([]);
    rows.forEach(([a, b], i) => { const y = top + 132 + i * 62; fit(g, a, -W / 2 + 34, y, 34, 270, '#443c36', { family: 'Nunito', weight: 800, align: 'left' }); fit(g, b, W / 2 - 34, y, 34, 120, '#443c36', { family: 'Nunito', weight: 900, align: 'right' }); });
    const ty = top + full - 112; g.fillStyle = '#26201c'; g.fillRect(-W / 2 + 28, ty - 44, W - 56, 5); fit(g, 'TOTAL', -W / 2 + 34, ty + 8, 36, 150, '#26201c', { family: 'Nunito', weight: 900, align: 'left' }); fit(g, o.total || '$3', W / 2 - 34, ty + 8, 74, 220, o.color || '#1f7a46', { align: 'right' }); g.restore();
  rr(g, -W / 2 - 34, top - 26, W + 68, 34, 17); g.fillStyle = '#2b2a2e'; g.fill(); seg(g, [[-W / 2 - 4, top - 4], [W / 2 + 4, top - 4]], 6, '#0c0b0e'); }, 'zoom');

// 4 HANGING TAG: kraft price tag swinging on a string. o: {value, sub, color}
POP.tag = pop((g, t, o) => { const sw = Math.sin(t * 5.2) * 0.22 * Math.exp(-t * 1.5) + Math.sin(t * 1.6) * 0.025; g.translate(0, -230); circle(g, 0, 0, 9, '#8a8278'); g.rotate(sw);
  g.strokeStyle = '#d9c7a0'; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(-46, 60, -4, 112); g.quadraticCurveTo(42, 62, 0, 0); g.stroke();
  shadow(g); poly(g, [[-66, 90], [66, 90], [190, 180], [190, 400], [-190, 400], [-190, 180]]); g.fillStyle = o.color || '#d7a86a'; g.fill(); flatShadow(g); grain(g, -185, 150, 370, 245, 'rgba(80,45,10,.18)', 700, 6, 3);
  g.setLineDash([14, 10]); g.strokeStyle = alpha('#5a3a18', 0.65); g.lineWidth = 4; poly(g, [[-54, 108], [54, 108], [170, 190], [170, 380], [-170, 380], [-170, 190]]); g.stroke(); g.setLineDash([]);
  circle(g, 0, 126, 30, '#f1e2bd'); circle(g, 0, 126, 12, '#3a2412');
  fit(g, String(o.value ?? '$9.99'), 0, 262, 140, 320, '#2a1a0c'); fit(g, o.sub || 'per minute', 0, 346, 40, 300, '#6a2a18', { family: 'Playfair Display', weight: 900, italic: true }); }, 'drop');

// 5 DIE-CUT STICKER: huge value with a thick white cut line, offset block shadow, peeling corner. o: {value, sub, color, tilt}
POP.sticker = pop((g, t, o) => { const str = String(o.value ?? '+$1'), col = o.color || '#ff5a36', size = 230; g.rotate((o.tilt ?? -0.09) + Math.sin(t * 2) * 0.012); font(g, size); const w = Math.min(760, g.measureText(str).width), sc = w / g.measureText(str).width; g.scale(sc, sc);
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round';
  g.lineWidth = 62; g.strokeStyle = 'rgba(15,6,24,.35)'; g.strokeText(str, 14, 24); g.strokeStyle = '#fffaf0'; g.lineWidth = 56; g.strokeText(str, 0, 0); g.strokeStyle = INK; g.lineWidth = 20; g.strokeText(str, 0, 0);
  const gr = g.createLinearGradient(0, -90, 0, 100); gr.addColorStop(0, shade(col, 0.28)); gr.addColorStop(0.52, col); gr.addColorStop(0.521, shade(col, -0.18)); gr.addColorStop(1, shade(col, -0.28)); g.fillStyle = gr; g.fillText(str, 0, 0);
  g.save(); g.globalAlpha *= 0.55; const sx = ((t * 0.7) % 2) * w * 1.6 - w; g.globalCompositeOperation = 'source-atop'; g.fillStyle = '#ffffff'; poly(g, [[sx, -140], [sx + 40, -140], [sx - 30, 140], [sx - 70, 140]]); g.restore();
  for (const [dx, dy, r, ph] of [[-0.56, -0.62, 26, 0], [0.58, -0.5, 18, 2], [0.5, 0.66, 14, 4]]) { const k = 0.6 + 0.4 * Math.sin(t * 6 + ph); const px = dx * w / sc, py = dy * size * 0.8; g.fillStyle = '#ffe58a'; g.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr2 = (i % 2 ? 0.32 : 1) * r * k * 1.5; i ? g.lineTo(px + Math.cos(a) * rr2, py + Math.sin(a) * rr2) : g.moveTo(px + Math.cos(a) * rr2, py + Math.sin(a) * rr2); } g.closePath(); g.fill(); }
  if (o.sub) { g.save(); g.translate(0, 168); g.rotate(0.05); font(g, 52); const sw2 = g.measureText(o.sub).width + 66; rr(g, -sw2 / 2, -42, sw2, 84, 12); g.fillStyle = INK; g.fill(); fit(g, o.sub, 0, 3, 52, sw2 - 40, '#fffaf0'); g.restore(); } }, 'zoom');

// 6 RUBBER STAMP: slams down, shakes, leaves worn ink. o: {text, sub, color}
POP.stamp = (g, x, y, t, o = {}) => { if (t < 0) return; const slam = clamp(t / 0.14), k = t < 0.14 ? lerp(2.6, 1, ease.in(slam)) : 1 + Math.exp(-(t - 0.14) * 14) * Math.sin((t - 0.14) * 60) * 0.05, str = o.text || 'GAME OVER', col = o.color || '#c8281e';
  const c = document.createElement('canvas'); c.width = 900; c.height = 420; const q = c.getContext('2d'); q.translate(450, 210); font(q, 130); const w = Math.min(720, Math.max(360, q.measureText(str).width + 110)), h = o.sub ? 290 : 220;
  q.strokeStyle = col; q.lineWidth = 18; rr(q, -w / 2, -h / 2, w, h, 26); q.stroke(); q.lineWidth = 6; rr(q, -w / 2 + 22, -h / 2 + 22, w - 44, h - 44, 14); q.stroke(); fit(q, str, 0, o.sub ? -30 : 4, 130, w - 90, col); if (o.sub) { q.fillStyle = col; q.fillRect(-w / 2 + 50, 44, w - 100, 6); fit(q, o.sub, 0, 88, 44, w - 110, col, { family: 'Nunito', weight: 900 }); }
  q.globalCompositeOperation = 'destination-out'; const r = rng(21); for (let i = 0; i < 2600; i++) { q.globalAlpha = 0.25 + r() * 0.75; q.beginPath(); q.arc(-450 + r() * 900, -210 + r() * 420, r() < 0.985 ? r() * 2.4 : 5 + r() * 16, 0, TAU); q.fill(); }
  g.save(); g.translate(x, y); const s = o.s ?? 1; g.scale(s * k, s * k); g.rotate(o.tilt ?? -0.17); g.globalAlpha *= slam * (o.out != null ? 1 - prog(t, o.out, o.out + 0.25) : 1);
  if (o.paper !== false) { shadow(g, 26, 14); poly(g, [[-w / 2 - 46, -h / 2 - 30], [w / 2 + 40, -h / 2 - 44], [w / 2 + 52, h / 2 + 36], [-w / 2 - 38, h / 2 + 46]]); g.fillStyle = '#f6efdf'; g.fill(); flatShadow(g); }
  g.drawImage(c, -450, -210);
  if (t > 0.14 && t < 0.5) { const p = (t - 0.14) / 0.36; for (let i = 0; i < 14; i++) { const a = i * 0.45; circle(g, Math.cos(a) * (w / 2 + 40 + p * 140), Math.sin(a) * (h / 2 + 30 + p * 90), 9 * (1 - p), alpha(col, 0.7 * (1 - p))); } } g.restore(); };

// 7 MASKING TAPE LABEL: torn tape with hand-lettered words that write on. o: {text, color}
POP.tape = pop((g, t, o) => { const str = o.text || 'day one'; font(g, 76, { family: 'Playfair Display', weight: 900, italic: true }); const w = Math.min(760, g.measureText(str).width + 130), h = 140, r = rng(str.length + 3); g.rotate(o.tilt ?? -0.045);
  const pts = [[-w / 2, -h / 2], [w / 2, -h / 2]]; for (let i = 1; i < 7; i++) pts.push([w / 2 + (i % 2 ? -22 : 6) + r() * 8, -h / 2 + (i * h) / 7]); pts.push([w / 2, h / 2], [-w / 2, h / 2]); for (let i = 6; i > 0; i--) pts.push([-w / 2 + (i % 2 ? 22 : -6) - r() * 8, -h / 2 + (i * h) / 7]);
  shadow(g, 18, 10, 0.28); poly(g, pts); g.fillStyle = alpha(o.color || '#f2dfa6', 0.96); g.fill(); flatShadow(g); g.save(); poly(g, pts); g.clip(); for (let i = 0; i < 40; i++) seg(g, [[-w / 2 + r() * w, -h / 2], [-w / 2 + r() * w + 18, h / 2]], 1.2, 'rgba(140,100,30,.13)');
  const p = clamp((t - 0.12) / 0.6); g.beginPath(); g.rect(-w / 2, -h / 2, w * p + 1, h); g.clip(); fit(g, str, 0, 4, 76, w - 90, '#22305a', { family: 'Playfair Display', weight: 900, italic: true }); g.restore(); }, 'side');

// 8 NEON SIGN: glass tube letters on a wall plate; flickers on. o: {text, color}
POP.neon = pop((g, t, o) => { const str = o.text || 'OPEN', col = o.color || '#ff4fae'; font(g, 150); const w = Math.min(780, g.measureText(str).width + 150), h = 260;
  const on = t < 0.12 ? 0 : t < 0.2 ? 1 : t < 0.3 ? 0.15 : t < 0.4 ? 1 : t < 0.46 ? 0.4 : 0.94 + 0.06 * Math.sin(t * 31);
  for (const sx of [-1, 1]) seg(g, [[sx * w * 0.32, -h / 2], [sx * w * 0.22, -h / 2 - 120]], 5, '#8a8896'); shadow(g); rr(g, -w / 2, -h / 2, w, h, 40); g.fillStyle = 'rgba(18,14,34,.9)'; g.fill(); flatShadow(g); g.strokeStyle = '#4a4660'; g.lineWidth = 5; g.stroke();
  if (on > 0.5) glow(g, 0, 0, w * 0.8, col, 0.3 * on);
  const tube = (width, c, blur) => { g.save(); g.shadowColor = col; g.shadowBlur = blur * on; font(g, 150); let size = 150; const tw = g.measureText(str).width; if (tw > w - 100) { size *= (w - 100) / tw; font(g, size); } g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = width; g.strokeStyle = c; g.strokeText(str, 0, 6); g.restore(); };
  tube(11, on > 0.5 ? col : '#5a4a62', 46); tube(4, on > 0.5 ? '#fff4fa' : '#6a5a72', 10);
  g.save(); g.shadowColor = col; g.shadowBlur = 30 * on; g.strokeStyle = on > 0.5 ? col : '#5a4a62'; g.lineWidth = 7; rr(g, -w / 2 + 24, -h / 2 + 24, w - 48, h - 48, 26); g.setLineDash([w * 0.9, 60]); g.stroke(); g.restore(); }, 'zoom');

// 9 CHALK: hand-drawn words with a scribbled ring and underline writing themselves. o: {text, color}
POP.chalk = pop((g, t, o) => { const str = o.text || '9 minutes', col = o.color || '#fff6e0'; font(g, 124); const w = Math.min(720, g.measureText(str).width);
  const p = clamp(t / 0.55), c = document.createElement('canvas'); c.width = 900; c.height = 240; const q = c.getContext('2d'); q.translate(450, 120); fit(q, str, 0, 0, 124, w, col); q.globalCompositeOperation = 'destination-out'; grain(q, -w / 2, -80, w, 160, 'rgba(0,0,0,.7)', 1100, 12, 2.4); g.save(); g.beginPath(); g.rect(-w / 2 - 30, -110, (w + 60) * p, 220); g.clip(); g.drawImage(c, -450, -120); g.restore();
  const wob = (k, rx, ry, turns, wdt, c) => { if (k <= 0) return; const r = rng(31), n = Math.floor(90 * turns * k); const pts = []; for (let i = 0; i <= n; i++) { const a = -2.6 + (i / 90) * TAU; pts.push([Math.cos(a) * (rx + (r() - 0.5) * 12 + i * 0.12), Math.sin(a) * (ry + (r() - 0.5) * 10 + i * 0.05)]); } if (pts.length > 1) seg(g, pts, wdt, c); };
  wob(clamp((t - 0.5) / 0.55), w / 2 + 66, 112, 1.12, 8, alpha(o.accent || '#ffd84a', 0.92)); const u = clamp((t - 1) / 0.35); if (u > 0) seg(g, [[-w * 0.3, 164], [-w * 0.3 + w * 0.6 * u, 150]], 10, alpha(col, 0.85)); }, 'none');

// 10 COIN JAR: glass jar filling up, with a taped amount. o: {value, fill 0..1}
POP.jar = pop((g, t, o) => { const k = (o.fill ?? 0.75) * ease.out(clamp((t - 0.15) / 1.1)), W = 360, H = 460;
  const body = () => { g.beginPath(); g.moveTo(-110, -H / 2); g.lineTo(110, -H / 2); g.lineTo(112, -H / 2 + 42); g.quadraticCurveTo(W / 2, -H / 2 + 66, W / 2, -H / 2 + 140); g.lineTo(W / 2, H / 2 - 46); g.quadraticCurveTo(W / 2, H / 2, W / 2 - 46, H / 2); g.lineTo(-W / 2 + 46, H / 2); g.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - 46); g.lineTo(-W / 2, -H / 2 + 140); g.quadraticCurveTo(-W / 2, -H / 2 + 66, -112, -H / 2 + 42); g.closePath(); };
  shadow(g); body(); g.fillStyle = 'rgba(190,225,240,.28)'; g.fill(); flatShadow(g); g.save(); body(); g.clip(); const r = rng(17), n = Math.floor(120 * k);
  for (let i = 0; i < n; i++) { const row = Math.floor(i / 9), x = -150 + (i % 9) * 37 + (row % 2) * 18 + (r() - 0.5) * 14, y = H / 2 - 24 - row * 25 + (r() - 0.5) * 8; g.save(); g.translate(x, y); g.rotate((r() - 0.5) * 0.7); g.beginPath(); g.ellipse(0, 0, 29, 15, 0, 0, TAU); g.fillStyle = r() < 0.5 ? '#ffc83a' : '#eaa61c'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#6a4608'; g.stroke(); g.beginPath(); g.ellipse(0, -2, 17, 7, 0, 0, TAU); g.strokeStyle = '#ffe28a'; g.stroke(); g.restore(); }
  for (let i = 0; i < 4; i++) { const p = (t * 1.5 + i * 0.25) % 1, top = H / 2 - 40 - Math.floor(n / 9) * 25; if (t < 1.4) { g.beginPath(); g.ellipse(-60 + i * 40, lerp(-H / 2, top, p * p), 22, 22 * Math.abs(Math.cos(t * 12 + i)) + 3, 0, 0, TAU); g.fillStyle = '#ffd24a'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#6a4608'; g.stroke(); } } g.restore();
  body(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke(); seg(g, [[-W / 2 + 34, -H / 2 + 160], [-W / 2 + 34, H / 2 - 80]], 16, 'rgba(255,255,255,.55)'); rr(g, -132, -H / 2 - 46, 264, 52, 12); g.fillStyle = '#c0563a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  g.save(); g.translate(0, -20); g.rotate(-0.05); shadow(g, 12, 7); rr(g, -140, -62, 280, 124, 6); g.fillStyle = '#f6efdc'; g.fill(); flatShadow(g); fit(g, String(o.value ?? '$240'), 0, 4, 88, 250, '#1f5a36'); g.restore(); }, 'drop');

// 11 COMIC BURST: jagged shape with halftone dots and offset ink, for reactions. o: {text, color, ink}
POP.burst = pop((g, t, o) => { const col = o.color || '#ffd23a', str = o.text || 'BZZT!', r = rng(5), pts = []; const j = Math.floor(t * 8) % 2; font(g, 150); const rx = Math.min(470, g.measureText(str).width / 2 + 130), ry = 230;
  for (let i = 0; i < 28; i++) { const a = (i / 28) * TAU, k = i % 2 ? 0.72 + r() * 0.06 : 1 + r() * 0.16 + (j && !(i % 4) ? 0.05 : 0); pts.push([Math.cos(a) * rx * k, Math.sin(a) * ry * k]); }
  g.save(); g.translate(16, 20); poly(g, pts); g.fillStyle = o.ink || '#2a1050'; g.fill(); g.restore(); poly(g, pts); g.fillStyle = col; g.fill(); g.save(); poly(g, pts); g.clip(); for (let y = -ry; y < ry * 1.2; y += 24) for (let x = -rx * 1.2 + ((y / 24) % 2) * 12; x < rx * 1.2; x += 24) circle(g, x, y, clamp((y + ry * 0.3) / (ry * 1.5)) * 9, alpha('#ff5a28', 0.7)); g.restore(); poly(g, pts); g.strokeStyle = INK; g.lineWidth = 9; g.lineJoin = 'miter'; g.stroke();
  g.rotate(-0.08); fit(g, str, 8, 10, 150, rx * 1.5, INK); fit(g, str, 0, 0, 150, rx * 1.5, '#ffffff', { stroke: 18 }); }, 'zoom');

// 12 NOTE CARD: a message as a layered paper card (stacked sheets, folded corner, wax dot). o: {from, text, color}
POP.note = pop((g, t, o) => { const W = 680, H = 230, col = o.color || '#ff6a4a'; g.rotate(-0.018 + Math.sin(t * 40) * 0.02 * Math.exp(-t * 5));
  for (const [dx, dy, a, c] of [[22, 24, 0.045, shade(col, 0.1)], [-12, 12, -0.025, '#e9dfca']]) { g.save(); g.translate(dx, dy); g.rotate(a); rr(g, -W / 2, -H / 2, W, H, 18); g.fillStyle = c; g.fill(); g.restore(); }
  shadow(g); poly(g, [[-W / 2, -H / 2], [W / 2 - 62, -H / 2], [W / 2, -H / 2 + 62], [W / 2, H / 2], [-W / 2, H / 2]]); g.fillStyle = '#fffaf0'; g.fill(); flatShadow(g); poly(g, [[W / 2 - 62, -H / 2], [W / 2 - 62, -H / 2 + 62], [W / 2, -H / 2 + 62]]); g.fillStyle = '#e2d6bc'; g.fill();
  g.fillStyle = col; g.fillRect(-W / 2, -H / 2, 18, H); circle(g, -W / 2 + 92, -30, 44, col); fit(g, (o.from || 'Mia')[0].toUpperCase(), -W / 2 + 92, -27, 52, 60, '#fffaf0');
  fit(g, o.from || 'Mia', -W / 2 + 168, -52, 40, 340, '#8a7a6a', { family: 'Nunito', weight: 900, align: 'left' }); fit(g, o.text || 'where are you?', -W / 2 + 168, 6, 58, W - 210, '#241a20', { align: 'left' });
  g.setLineDash([2, 14]); g.lineCap = 'round'; seg(g, [[-W / 2 + 168, 62], [W / 2 - 40, 62]], 5, '#c8b89c'); g.setLineDash([]); fit(g, o.time || 'now', W / 2 - 40, 88, 30, 160, '#a8988a', { family: 'Nunito', weight: 800, align: 'right' }); }, 'side');

// 13 DIAL GAUGE: painted meter with a springy needle. o: {k 0..1, text}
POP.dial = pop((g, t, o) => { const k = (o.k ?? 0.8) * spring(Math.max(0, t - 0.15), 9, 4), R = 270; g.translate(0, 80);
  shadow(g); g.beginPath(); g.arc(0, 0, R + 34, Math.PI, 0); g.lineTo(R + 34, 80); g.lineTo(-R - 34, 80); g.closePath(); g.fillStyle = '#f3e8d0'; g.fill(); flatShadow(g); g.strokeStyle = INK; g.lineWidth = 8; g.stroke();
  ['#d8432e', '#e8842e', '#e8c032', '#8cba4a', '#2f9a62'].forEach((c, i) => { g.beginPath(); g.arc(0, 0, R - 34, Math.PI + (i * Math.PI) / 5 + 0.015, Math.PI + ((i + 1) * Math.PI) / 5 - 0.015); g.lineWidth = 62; g.strokeStyle = c; g.lineCap = 'butt'; g.stroke(); });
  for (let i = 0; i <= 20; i++) { const a = Math.PI + (i * Math.PI) / 20; seg(g, [[Math.cos(a) * (R - 80), Math.sin(a) * (R - 80)], [Math.cos(a) * (R - (i % 5 ? 96 : 110)), Math.sin(a) * (R - (i % 5 ? 96 : 110))]], i % 5 ? 3 : 7, INK); }
  g.save(); g.rotate(Math.PI + Math.PI * clamp(k, 0, 1.04)); shadow(g, 10, 8); poly(g, [[-30, -16], [R - 52, 0], [-30, 16]]); g.fillStyle = INK; g.fill(); g.restore(); circle(g, 0, 0, 34, INK); circle(g, 0, 0, 13, '#c9a95a'); fit(g, o.text || 'TRUST', 0, 52, 46, R * 1.6, '#3a2c18', { family: 'Nunito', weight: 900 }); }, 'drop');

export const POP_NAMES = Object.keys(POP);

// ---------- captions (no more dark pill) ----------
// style: 'punch' (default: bare chunky words, hard colour shadow, spoken word on a tilted colour block) |
//        'strip' (torn paper strip, spoken word swiped with highlighter) | 'serif' (cinematic italic, spoken word coloured + underline)
export function capt2(g, gt, o = {}) {
  const ws = E.words; let i = -1; for (let k = ws.length - 1; k >= 0; k--) if (gt >= ws[k].start - 0.05) { if (gt <= ws[k].end + 0.4) i = k; break; } if (i < 0) return;
  const ends = (k) => /[.?!,]$/.test(ws[k].word); let st = 0; for (let k = 0; k <= i;) { st = k; let n = 0; while (k < ws.length && n < 3) { n++; if (ends(k++)) break; } }
  const grp = []; for (let k = st; k < ws.length && grp.length < 3; k++) { grp.push(k); if (ends(k)) break; }
  const style = o.style || 'punch', accent = o.accent || '#ff5a36', y = E.H * (o.y ?? 0.76), serif = style === 'serif', size = o.size || (serif ? 78 : 80);
  const f = serif ? { family: 'Playfair Display', weight: 900, italic: true } : {}; g.save(); font(g, size, f);
  const strs = grp.map((k) => { const s = ws[k].word.replace(/[.,!]$/, ''); return style === 'punch' ? s.toUpperCase() : s; }), wd = strs.map((s) => g.measureText(s).width), gap = size * (o.style === 'strip' || o.style === 'serif' ? 0.34 : 0.62), tot = wd.reduce((a, b) => a + b, 0) + gap * (strs.length - 1), k0 = Math.min(1, (E.W - 150) / tot), born = spring(gt - ws[grp[0]].start + 0.05, 16, 11);
  g.translate(E.W / 2, y); g.scale(k0, k0); g.translate(0, (1 - born) * 34);
  if (style === 'strip') { const r = rng(st + 2), pts = [[-tot / 2 - 44, -66 + r() * 8], [tot / 2 + 40, -70 + r() * 10]]; for (let k = 1; k < 5; k++) pts.push([tot / 2 + 40 + (k % 2 ? -18 : 8), -70 + k * 28]); pts.push([tot / 2 + 46, 68], [-tot / 2 - 38, 64]); for (let k = 4; k > 0; k--) pts.push([-tot / 2 - 40 + (k % 2 ? 18 : -8), -66 + k * 26]); g.rotate((st % 2 ? 1 : -1) * 0.018); shadow(g, 18, 10, 0.3); poly(g, pts); g.fillStyle = '#fbf5e6'; g.fill(); flatShadow(g); }
  let x = -tot / 2; strs.forEach((s, j) => { const cur = grp[j] === i, p = spring(gt - ws[grp[j]].start, 18, 12), cx = x + wd[j] / 2; g.save(); g.translate(cx, 0);
    if (style === 'punch') { if (cur) { g.rotate(-0.035); g.scale(0.86 + 0.14 * p, 0.86 + 0.14 * p); poly(g, [[-wd[j] / 2 - 18, -54], [wd[j] / 2 + 22, -62], [wd[j] / 2 + 16, 52], [-wd[j] / 2 - 22, 58]]); g.fillStyle = accent; g.fill(); }
      font(g, size); g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; if (!cur) { g.fillStyle = 'rgba(14,6,22,.92)'; g.lineWidth = 16; g.strokeStyle = 'rgba(14,6,22,.92)'; g.strokeText(s, 5, 10); g.strokeStyle = INK; g.strokeText(s, 0, 0); } else { g.fillStyle = INK; g.fillText(s, 3, 6); } g.fillStyle = '#fffaf0'; g.fillText(s, 0, 0); }
    else if (style === 'strip') { if (cur) { g.globalAlpha = 0.95; const hw = (wd[j] + 22) * clamp((gt - ws[grp[j]].start) / 0.14 + 0.2); poly(g, [[-wd[j] / 2 - 11, -28], [-wd[j] / 2 - 11 + hw, -36], [-wd[j] / 2 - 15 + hw, 36], [-wd[j] / 2 - 7, 42]]); g.fillStyle = o.accent || '#ffe14a'; g.fill(); g.globalAlpha = 1; } fit(g, s, 0, 2, size, wd[j] + 4, '#221823'); }
    else { fit(g, s, 3, 5, size, wd[j] + 4, 'rgba(10,4,18,.8)', { ...f, stroke: 14, strokeColor: 'rgba(10,4,18,.55)' }); fit(g, s, 0, 0, size, wd[j] + 4, cur ? (o.accent || '#ffd166') : '#fffaf0', f); if (cur) seg(g, [[-wd[j] / 2, 52], [-wd[j] / 2 + wd[j] * clamp((gt - ws[grp[j]].start) / 0.18), 48]], 8, o.accent || '#ffd166'); }
    g.restore(); x += wd[j] + gap; });
  g.restore();
}

// HOOK TITLE for Shorts (SHORTS_PLAYBOOK.md): visible from frame 1, 2 lines, centre-top safe area, 2 words coloured.
//   hook(g, globalT, ['PAID TO IGNORE', 'YOUR PHONE?'], { keys: ['PAID', 'PHONE'], colors: ['#ffd84a', '#2fe0c4'], out: 2.8 })
export function hook(g, t, lines, o = {}) {
  const out = o.out ?? 2.8, gone = ease.in(prog(t, out, out + 0.25)); if (gone >= 1) return;
  const keys = (o.keys || []).map((k) => k.toUpperCase()), colors = o.colors || ['#ffd84a', '#2fe0c4'], y = E.H * (o.y ?? 0.2), size = o.size || 118, settle = 1 + 0.07 * Math.exp(-t * 9);
  g.save(); g.translate(E.W / 2, y - gone * 220); g.scale(settle, settle); g.globalAlpha *= 1 - gone;
  lines.slice(0, 2).forEach((line, i) => { const ws = line.toUpperCase().split(' '); font(g, size); const gap = size * 0.34, wd = ws.map((w) => g.measureText(w).width), tot = wd.reduce((a, b) => a + b, 0) + gap * (ws.length - 1), k = Math.min(1, (E.W - 130) / tot);
    g.save(); g.translate(0, (i - 0.5) * size * 1.18); g.rotate(i ? 0.012 : -0.022); g.scale(k, k); let x = -tot / 2;
    ws.forEach((w, j) => { const ki = keys.indexOf(w.replace(/[^A-Z0-9$%']/g, '')), col = ki >= 0 ? colors[ki % colors.length] : '#fffaf0';
      font(g, size); g.textAlign = 'left'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.lineWidth = 26; g.strokeStyle = 'rgba(12,5,20,.9)'; g.strokeText(w, x + 6, 12); g.strokeStyle = INK; g.strokeText(w, x, 0); g.fillStyle = col; g.fillText(w, x, 0); x += wd[j] + gap; });
    g.restore(); });
  g.restore();
}
