// finprops.js: PROPER finance objects + modern UI for the finance channel (user 2026-11-22: "proper, not generic 2010 UI").
//   import { FP } from '/engine/finprops.js';  FP.<name>(g, ...)
//   glass        modern dark glass card (soft shadow, top highlight, rounded 28)
//   candles      real candlestick chart (wicks, bodies, volume, moving average, price axis, live last-price tag)
//   term2000     year-2000 market terminal (black, amber text, function-key bar, ticker, candles, quote table)
//   newspaper    front page (masthead, date rule, big serif headline, photo with chart, 4 columns of text lines)
//   tv2000       wood-cased CRT TV on legs with antenna; screen(fn) callback; scanlines + glass curve
//   newsBanner   lower-third news banner (red tag + white strip + scrolling ticker)
//   phone        modern phone (thin bezel, island, status bar); screen(fn) callback
//   post         social feed post card (avatar, name, handle, text, chart thumb, likes)
//   statement    brokerage statement on paper (header, account box, holdings table, red circled total)
//   mousetrap    wooden mousetrap with bait; snap 0..1
//   shelf        supermarket shelf with real-looking products + price labels (o.prices = [..], o.mult)
//   commentCard  modern dark comment card (avatar, name, time, text, like + reply)
//   door         interior door with frame, sign plate, light spill (open 0..1)
//   gpu, router  graphics card (spinning fans), 2000-era network box (blinking LEDs)
//   heatmap      market heat-map treemap (tickers, red/green %); k = reveal 0..1
//   sheet        modern spreadsheet card (column letters, header row, highlighted cells)
//   hourglass    glass hourglass; k = sand fallen 0..1
//   report       report cover (title lines, seal, barcode)
//   vault        bank vault door with wheel handle (open 0..1)
//   oven, bank, contract(+signature), stamp, register, cheque, chain(+ball), ovenShop(bg), bankInterior(bg)  (V03 clips 12-14)
import { E, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';

const INK = '#1b1424', F = (g, c) => { g.fillStyle = c; g.fill(); }, S = (g, c, w) => { g.strokeStyle = c; g.lineWidth = w; g.stroke(); };
const T = (g, s, x, y, sz, col, o = {}) => { g.save(); g.font = `${o.w || 700} ${sz}px ${o.font || 'Inter, "Segoe UI", Arial, sans-serif'}`; g.fillStyle = col; g.textAlign = o.align || 'left'; g.textBaseline = 'middle'; g.fillText(s, x, y); g.restore(); };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const FP = {};
// shrink a font size so the string fits maxW (user 2026-11-23: text must never stick out of its box)
const fitSz = (g, str, maxW, size, w = 700, font) => { g.save(); g.font = `${w} ${size}px ${font || 'Inter, "Segoe UI", Arial, sans-serif'}`; const tw = g.measureText(String(str)).width; g.restore(); return tw > maxW ? Math.max(10, Math.floor(size * maxW / tw)) : size; };

FP.glass = (g, x, y, w, h, o = {}) => { g.save(); g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 40; g.shadowOffsetY = 18; rr(g, x, y, w, h, o.r || 28); F(g, o.fill || 'rgba(18,22,34,0.82)'); g.restore();
  g.save(); rr(g, x, y, w, h, o.r || 28); g.clip(); const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, 'rgba(255,255,255,.10)'); gr.addColorStop(0.25, 'rgba(255,255,255,.02)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x, y, w, h); g.restore();
  rr(g, x + 1, y + 1, w - 2, h - 2, o.r || 28); S(g, o.border || 'rgba(255,255,255,.14)', 2); };

// data: array of closes (auto OHLC). k = fraction revealed. o: {up, down, ma, vol, label, last}
FP.candles = (g, x, y, w, h, data, k, o = {}) => { const n = data.length, hi = Math.max(...data) * 1.06, lo = Math.min(...data) * 0.92, Y = (v) => y + h * 0.78 * (1 - (v - lo) / (hi - lo)), cw = w / n;
  for (let i = 1; i < 5; i++) { const yy = y + h * 0.78 * i / 5; g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, yy); g.lineTo(x + w, yy); g.stroke(); T(g, (hi - (hi - lo) * i / 5).toFixed(o.dec ?? 0), x + w + 14, yy, 18, 'rgba(255,255,255,.45)', { w: 600 }); }
  const m = Math.max(1, Math.floor(n * k)); let ma = [];
  for (let i = 0; i < m; i++) { const c = data[i], op = i ? data[i - 1] : c * 0.99, up = c >= op, hh = Math.max(c, op) * (1 + 0.015 + rnd(i) * 0.02), ll = Math.min(c, op) * (1 - 0.015 - rnd(i + 9) * 0.02), cx = x + (i + 0.5) * cw, col = up ? (o.up || '#2fd67a') : (o.down || '#ff4d5e');
    seg(g, [[cx, Y(hh)], [cx, Y(ll)]], 2.5, col); const by = Math.min(Y(c), Y(op)), bh = Math.max(3, Math.abs(Y(c) - Y(op))); rr(g, cx - cw * 0.32, by, cw * 0.64, bh, 2); F(g, col);
    if (o.vol !== false) { const vh = h * 0.16 * (0.3 + rnd(i + 3) * 0.7) * (up ? 0.8 : 1.1); g.fillStyle = alpha(col, 0.35); g.fillRect(cx - cw * 0.32, y + h - vh, cw * 0.64, vh); }
    ma.push([cx, Y(data.slice(Math.max(0, i - 6), i + 1).reduce((a, b) => a + b, 0) / Math.min(i + 1, 7))]); }
  if (o.ma !== false && ma.length > 1) { g.beginPath(); ma.forEach(([px, py], i) => (i ? g.lineTo(px, py) : g.moveTo(px, py))); S(g, o.maCol || '#ffb84a', 3); }
  const last = data[m - 1], ly = Y(last), up = m < 2 || last >= data[m - 2]; seg(g, [[x, ly], [x + w, ly]], 1.5, alpha(up ? '#2fd67a' : '#ff4d5e', 0.5));
  rr(g, x + w + 6, ly - 17, 96, 34, 8); F(g, up ? '#2fd67a' : '#ff4d5e'); T(g, (o.prefix || '') + last.toFixed(o.dec ?? 2), x + w + 54, ly + 1, 19, '#08110c', { align: 'center', w: 800 }); };

FP.term2000 = (g, x, y, w, h, t, o = {}) => { const A = '#ffb000', G2 = '#35e06a', R2 = '#ff4a3a', mono = '"Courier New", monospace';
  g.save(); rr(g, x, y, w, h, 10); g.clip(); g.fillStyle = '#050505'; g.fillRect(x, y, w, h);
  g.fillStyle = '#1a1a1a'; g.fillRect(x, y, w, 46); ['EQUITY', 'CMDTY', 'NEWS', 'MSG', 'GP', 'HP', 'DES', 'GO'].forEach((k, i) => { rr(g, x + 12 + i * 92, y + 8, 84, 30, 4); F(g, i === 7 ? '#2a8a3a' : (i % 2 ? '#c8a000' : '#9a2020')); T(g, k, x + 54 + i * 92, y + 24, 16, '#ffffff', { align: 'center', font: mono }); });
  T(g, (o.sym || 'CSCO US Equity') + '   ' + (o.title || 'GP  Price Graph'), x + 16, y + 72, 22, A, { font: mono });
  T(g, o.date || '03/27/00 16:00', x + w - 16, y + 72, 20, A, { font: mono, align: 'right' });
  if (o.data) FP.candles(g, x + 24, y + 100, w * (o.table ? 0.6 : 0.86), h - 170, o.data, o.k ?? 1, { up: G2, down: R2, maCol: A, dec: 2, ma: true });
  if (o.table) { const tx = x + w * 0.66 + 40; o.table.forEach((r, i) => { const yy = y + 120 + i * 40; T(g, r[0], tx, yy, 20, A, { font: mono }); T(g, r[1], tx + 150, yy, 20, '#ffffff', { font: mono }); if (r[2]) T(g, r[2], x + w - 20, yy, 20, r[2].startsWith('-') ? R2 : G2, { font: mono, align: 'right' }); }); }
  g.fillStyle = '#1a1a1a'; g.fillRect(x, y + h - 40, w, 40); const items = o.ticker || ['NASDAQ 4,963 +2.1%', 'CSCO 80.06 +1.4%', 'MSFT 106.25', 'INTC 132.50', 'ORCL 79.31', 'DOW 10,864'];
  const line = items.join('     '); g.font = `700 20px ${mono}`; const lw = g.measureText(line + '     ').width; const off = (t * 120) % lw; for (let k2 = 0; k2 < 3; k2++) T(g, line, x + 12 - off + k2 * lw, y + h - 20, 20, A, { font: mono });
  for (let yy = y; yy < y + h; yy += 4) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(x, yy, w, 1.5); }
  const v = g.createRadialGradient(x + w / 2, y + h / 2, h * 0.3, x + w / 2, y + h / 2, w * 0.7); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.5)'); g.fillStyle = v; g.fillRect(x, y, w, h); g.restore(); };

FP.newspaper = (g, x, y, s, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 560, H = 760, serif = 'Georgia, "Times New Roman", serif';
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 30; g.shadowOffsetY = 14; g.fillStyle = '#f4efe2'; g.fillRect(-W / 2, -H / 2, W, H); g.shadowColor = 'transparent';
  T(g, o.paper || 'The Daily Ledger', 0, -H / 2 + 56, 50, '#151515', { align: 'center', font: serif, w: 800 }); seg(g, [[-W / 2 + 24, -H / 2 + 92], [W / 2 - 24, -H / 2 + 92]], 3, '#151515');
  T(g, o.date || 'MONDAY, MARCH 27, 2000', -W / 2 + 24, -H / 2 + 110, 14, '#333', { font: serif }); T(g, '50 CENTS', W / 2 - 24, -H / 2 + 110, 14, '#333', { font: serif, align: 'right' }); seg(g, [[-W / 2 + 24, -H / 2 + 124], [W / 2 - 24, -H / 2 + 124]], 1.5, '#151515');
  (o.head || ['THE INTERNET', 'CHANGES EVERYTHING']).forEach((l, i) => T(g, l, 0, -H / 2 + 176 + i * 58, fitSz(g, l, W - 56, 52, 900, serif), '#111', { align: 'center', font: serif, w: 900 }));
  const py = -H / 2 + 300; g.fillStyle = '#ddd6c4'; g.fillRect(-W / 2 + 24, py, W * 0.58, 230); if (o.photo) o.photo(g, -W / 2 + 24, py, W * 0.58, 230); g.strokeStyle = '#151515'; g.lineWidth = 2; g.strokeRect(-W / 2 + 24, py, W * 0.58, 230);
  for (let i = 0; i < 14; i++) { const yy = py + 6 + i * 16.5; g.fillStyle = '#9a958a'; g.fillRect(W * 0.08 + 14, yy, (W * 0.42 - 40) * (0.7 + rnd(i) * 0.3), 6); }
  for (let c = 0; c < 4; c++) for (let i = 0; i < 12; i++) { g.fillStyle = '#a8a395'; g.fillRect(-W / 2 + 24 + c * (W - 48) / 4, py + 260 + i * 16.5, ((W - 48) / 4 - 16) * (0.6 + rnd(c * 20 + i) * 0.4), 6); }
  T(g, o.sub || 'Tech giant now worth more than any company on Earth', -W / 2 + 24, py + 246, fitSz(g, o.sub || 'Tech giant now worth more than any company on Earth', W - 48, 15, 700, serif), '#222', { font: serif, w: 700 }); g.restore(); };

FP.tv2000 = (g, x, y, s, screen, t) => { g.save(); g.translate(x, y); g.scale(s, s); const W = 640, H = 480;
  seg(g, [[-60, -H / 2 - 40], [-170, -H / 2 - 200]], 6, '#3a3a3a'); seg(g, [[60, -H / 2 - 40], [170, -H / 2 - 210]], 6, '#3a3a3a'); circle(g, -170, -H / 2 - 200, 8, '#5a5a5a'); circle(g, 170, -H / 2 - 210, 8, '#5a5a5a');
  for (const d of [-1, 1]) seg(g, [[d * 230, H / 2], [d * 270, H / 2 + 110]], 12, '#4a3020');
  rr(g, -W / 2 - 30, -H / 2 - 40, W + 160, H + 80, 30); F(g, '#7a4e2e'); S(g, INK, 6); g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 10; i++) g.fillRect(-W / 2 - 30, -H / 2 - 30 + i * 52, W + 160, 3);
  rr(g, -W / 2 - 10, -H / 2 - 20, W + 20, H + 40, 40); F(g, '#1e1e22');
  g.save(); rr(g, -W / 2, -H / 2, W, H, 44); g.clip(); g.fillStyle = '#0a0a10'; g.fillRect(-W / 2, -H / 2, W, H); if (screen) screen(g, -W / 2, -H / 2, W, H);
  for (let yy = -H / 2; yy < H / 2; yy += 4) { g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-W / 2, yy, W, 1.5); } const gl = g.createRadialGradient(-120, -140, 10, 0, 0, W * 0.7); gl.addColorStop(0, 'rgba(255,255,255,.18)'); gl.addColorStop(0.4, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = gl; g.fillRect(-W / 2, -H / 2, W, H); g.restore();
  for (let i = 0; i < 2; i++) { circle(g, W / 2 + 70, -H / 2 + 60 + i * 80, 22, '#c8b090'); S(g, INK, 4); } for (let i = 0; i < 6; i++) { rr(g, W / 2 + 40, 40 + i * 22, 60, 10, 4); F(g, '#3a2a1a'); } g.restore(); };

FP.newsBanner = (g, x, y, w, head, t, o = {}) => { rr(g, x, y, 190, 70, 6); F(g, '#d81e2a'); T(g, o.tag || 'LIVE', x + 95, y + 36, 32, '#ffffff', { align: 'center', w: 900 });
  g.fillStyle = '#ffffff'; g.fillRect(x + 190, y, w - 190, 70); T(g, head, x + 214, y + 36, fitSz(g, head, w - 190 - 44, 34, 900), '#111', { w: 900 }); g.fillStyle = '#101820'; g.fillRect(x, y + 70, w, 36);
  g.save(); g.beginPath(); g.rect(x, y + 70, w, 36); g.clip(); const s2 = o.ticker || 'NASDAQ 4,223 -6.2%   CSCO 57.13 -28.6%   DOW 10,560 -1.1%   ANALYSTS: "STILL THE BEST COMPANY IN THE WORLD"'; for (let k = 0; k < 3; k++) T(g, s2, x + 20 - (t * 140) % 1600 + k * 1600, y + 89, 20, '#ffd24a', { w: 700 }); g.restore(); };

FP.phone = (g, x, y, s, screen, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 360, H = 760;
  g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 50; g.shadowOffsetY = 24; rr(g, -W / 2 - 14, -H / 2 - 14, W + 28, H + 28, 62); F(g, '#16171c'); g.shadowColor = 'transparent'; rr(g, -W / 2 - 14, -H / 2 - 14, W + 28, H + 28, 62); S(g, '#4a4d58', 3);
  g.save(); rr(g, -W / 2, -H / 2, W, H, 50); g.clip(); g.fillStyle = o.bg || '#0c0e14'; g.fillRect(-W / 2, -H / 2, W, H); if (screen) screen(g, -W / 2, -H / 2, W, H);
  T(g, o.time || '9:41', -W / 2 + 40, -H / 2 + 30, 20, '#ffffff', { w: 700 }); for (let i = 0; i < 4; i++) { g.fillStyle = '#ffffff'; g.fillRect(W / 2 - 92 + i * 7, -H / 2 + 34 - i * 4, 5, 6 + i * 4); } rr(g, W / 2 - 56, -H / 2 + 22, 34, 16, 5); S(g, '#ffffff', 2); g.fillStyle = '#ffffff'; g.fillRect(W / 2 - 53, -H / 2 + 25, 24, 10);
  rr(g, -60, -H / 2 + 14, 120, 34, 17); F(g, '#000000'); g.restore(); g.restore(); };

FP.post = (g, x, y, w, o = {}) => { const h = o.h || 210; FP.glass(g, x, y, w, h, { r: 22, fill: 'rgba(24,27,38,.95)' });
  g.save(); g.beginPath(); g.arc(x + 46, y + 46, 26, 0, 7); g.fillStyle = o.color || '#4a78b8'; g.fill(); g.clip(); bigToonFace(g, x + 46, y + 56, 15, { cast: o.cast || HERO, expr: o.expr || 'happy' }); g.restore();
  T(g, o.name || 'Alex', x + 86, y + 36, 21, '#ffffff', { w: 800 }); T(g, (o.handle || '@alex') + ' · ' + (o.ago || '2m'), x + 86, y + 60, 17, '#8a90a0', { w: 500 });
  T(g, o.text || 'It’s a dip. Buy it.', x + 24, y + 110, fitSz(g, o.text || 'It’s a dip. Buy it.', w - 48 - (o.emoji ? 60 : 0), o.size || 30, 800), '#ffffff', { w: 800 }); if (o.emoji) T(g, o.emoji, x + w - 70, y + 110, 30, '#2fd67a', { w: 900 });
  for (const [i, ic] of ['♡', '↻', '↗'].entries()) T(g, ic + ' ' + (o.likes ? o.likes[i] : ['2.4K', '318', '']), x + 24 + i * 130, y + h - 32, 18, '#8a90a0', { w: 600 }); };

FP.statement = (g, x, y, s, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 620, H = 820;
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 30; g.shadowOffsetY = 12; g.fillStyle = '#fbfaf6'; g.fillRect(-W / 2, -H / 2, W, H); g.shadowColor = 'transparent';
  g.fillStyle = '#1f3a5f'; g.fillRect(-W / 2, -H / 2, W, 12); T(g, 'ACCOUNT STATEMENT', -W / 2 + 40, -H / 2 + 62, 30, '#1f3a5f', { w: 900 }); T(g, o.period || 'Period ending Oct 31, 2002', -W / 2 + 40, -H / 2 + 98, 18, '#555', { w: 500 });
  rr(g, W / 2 - 230, -H / 2 + 40, 190, 70, 8); S(g, '#1f3a5f', 2); T(g, 'Acct  ****4417', W / 2 - 135, -H / 2 + 75, 17, '#1f3a5f', { align: 'center', w: 700 });
  const rows = o.rows || [['Symbol', 'Shares', 'Cost', 'Value'], ['CSCO', '125', '$10,000', '$1,070']]; rows.forEach((r, i) => { const yy = -H / 2 + 170 + i * 52; if (!i) { g.fillStyle = '#e8edf4'; g.fillRect(-W / 2 + 30, yy - 22, W - 60, 44); }
    r.forEach((c, j) => T(g, c, -W / 2 + 50 + j * 140, yy, 20, i ? '#222' : '#1f3a5f', { w: i ? 600 : 800 })); seg(g, [[-W / 2 + 30, yy + 26], [W / 2 - 30, yy + 26]], 1, '#d0d4da'); });
  for (let i = 0; i < 9; i++) { g.fillStyle = '#cfd3d9'; g.fillRect(-W / 2 + 40, -H / 2 + 330 + i * 26, (W - 80) * (0.5 + rnd(i) * 0.5), 8); }
  T(g, 'TOTAL VALUE', -W / 2 + 40, H / 2 - 120, 24, '#222', { w: 800 }); T(g, o.total || '$1,070.00', W / 2 - 60, H / 2 - 120, 40, '#c8202a', { align: 'right', w: 900 });
  if ((o.circle ?? 1) > 0) { const k = o.circle ?? 1; g.strokeStyle = '#d0202a'; g.lineWidth = 6; g.beginPath(); g.ellipse(W / 2 - 150, H / 2 - 120, 150, 50, -0.05, 0, Math.PI * 2 * k); g.stroke(); } g.restore(); };

FP.mousetrap = (g, x, y, s, snap, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -220, -40, 440, 70, 12); F(g, '#c89a5a'); S(g, INK, 6); g.fillStyle = 'rgba(0,0,0,.1)'; for (let i = 0; i < 6; i++) g.fillRect(-210, -30 + i * 11, 420, 3);
  seg(g, [[-120, -40], [120, -40]], 8, '#9aa0a8'); circle(g, -120, -40, 10, '#7a808a'); circle(g, 120, -40, 10, '#7a808a'); const a = lerp(-Math.PI * 0.95, -0.05, ease.in(clamp(snap, 0, 1)));
  g.save(); g.translate(0, -40); g.rotate(a); rr(g, -150, -8, 300, 16, 8); F(g, '#b8bec8'); S(g, INK, 5); seg(g, [[-150, 0], [-150, 150]], 10, '#b8bec8'); seg(g, [[150, 0], [150, 150]], 10, '#b8bec8'); g.restore();
  rr(g, 20, -60, 80, 24, 6); F(g, '#e0b030'); S(g, INK, 4); if (o.bait) o.bait(g, 60, -100); g.restore(); };

FP.shelf = (g, x, y, w, o = {}) => { const prods = o.prods || [['MILK', '#f4f4f8', '#4a78b8'], ['BREAD', '#d89a5a', '#a0602a'], ['EGGS', '#f4e4c4', '#c89a5a'], ['COFFEE', '#5a3a2a', '#e0b05a'], ['CEREAL', '#e0562f', '#ffd03a'], ['RICE', '#f8f4ea', '#2f8a57']];
  rr(g, x, y, w, 26, 6); F(g, '#8a8e98'); S(g, INK, 4); const pw = w / prods.length;
  prods.forEach(([name, body, accent], i) => { const px = x + pw * i + pw / 2, ph = 150 + (i % 3) * 30, bw = pw * 0.62; rr(g, px - bw / 2, y - ph, bw, ph, 14); F(g, body); S(g, INK, 5); rr(g, px - bw / 2 + 8, y - ph * 0.62, bw - 16, ph * 0.3, 8); F(g, accent); T(g, name, px, y - ph * 0.47, 22, '#ffffff', { align: 'center', w: 900 });
    g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(px - bw / 2 + 10, y - ph + 12, 10, ph - 24);
    const pr = o.prices ? o.prices[i] : (1 + i * 0.6), mult = o.mult ?? 1, v = pr * mult; rr(g, px - 56, y + 4, 112, 52, 6); F(g, o.tagCol || '#ffe24a'); S(g, INK, 3); T(g, '$' + v.toFixed(2), px, y + 31, 26, INK, { align: 'center', w: 900 }); }); };

FP.commentCard = (g, x, y, w, o = {}) => { FP.glass(g, x, y, w, 150, { r: 20, fill: 'rgba(20,22,30,.94)' });
  g.save(); g.beginPath(); g.arc(x + 44, y + 48, 24, 0, 7); g.fillStyle = o.color || '#e0562f'; g.fill(); g.clip(); bigToonFace(g, x + 44, y + 57, 14, { cast: o.cast || HERO, expr: o.expr || 'smile' }); g.restore();
  T(g, o.name || '@viewer', x + 84, y + 36, 19, '#ffffff', { w: 800 }); T(g, o.ago || '3 hours ago', x + 84 + Math.min(220, (o.name || '@viewer').length * 11 + 16), y + 36, 16, '#8a90a0', { w: 500 });
  T(g, o.text || 'Held. Never sold.', x + 84, y + 76, fitSz(g, o.text || 'Held. Never sold.', w - 84 - 22, 24, 600), '#e8eaf0', { w: 600 }); T(g, '\u{1F44D} ' + (o.likes || '1.2K') + '      \u{1F44E}      Reply', x + 84, y + 118, 17, '#8a90a0', { w: 600 }); };

FP.door = (g, x, y, s, label, open, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); const c = o.color || '#7a4e34';
  rr(g, -150, -440, 300, 440, 10); F(g, '#2a2230'); S(g, INK, 6); if (open > 0) { const lg = g.createLinearGradient(0, -440, 0, 0); lg.addColorStop(0, alpha(o.light || '#fff2c8', 0.9)); lg.addColorStop(1, alpha(o.light || '#fff2c8', 0.4)); g.fillStyle = lg; g.fillRect(-140, -430, 280, 430); }
  g.save(); g.translate(-140, 0); g.scale(1 - 0.75 * ease.inOut(open), 1); rr(g, 0, -430, 280, 430, 8); F(g, c); S(g, INK, 5); for (const yy of [-400, -200]) { rr(g, 30, yy, 220, 160, 10); S(g, 'rgba(0,0,0,.25)', 5); } circle(g, 240, -210, 14, '#e0b05a'); g.restore();
  rr(g, -110, -520, 220, 64, 12); F(g, o.plate || '#f4f0e6'); S(g, INK, 5); T(g, label, 0, -487, 36, o.plateText || INK, { align: 'center', w: 900 }); g.restore(); };

// graphics card (GPU) 3/4 view: PCB, shroud, two spinning fans, heat-pipes, PCIe gold fingers, glowing edge strip. ~520 wide at s=1. o: {t, glow, color}
FP.gpu = (g, x, y, s, o = {}) => { const t = o.t || 0; g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 40; g.shadowOffsetY = 20; rr(g, -260, -110, 520, 220, 18); F(g, '#1e2a22'); g.shadowColor = 'transparent'; S(g, INK, 6);
  for (let i = 0; i < 26; i++) { g.fillStyle = '#d8b04a'; g.fillRect(-200 + i * 12, 108, 8, 22); } rr(g, -210, 104, 320, 10, 3); F(g, '#2a3a2e');
  rr(g, -250, -100, 500, 196, 22); F(g, o.color || '#2a2d36'); S(g, '#4a4f5c', 3); const sg = g.createLinearGradient(0, -100, 0, 96); sg.addColorStop(0, 'rgba(255,255,255,.12)'); sg.addColorStop(1, 'rgba(0,0,0,.2)'); g.fillStyle = sg; rr(g, -250, -100, 500, 196, 22); g.fill();
  for (const fx of [-120, 120]) { circle(g, fx, -2, 84, '#101216'); g.save(); g.translate(fx, -2); g.rotate(t * 14); for (let b = 0; b < 9; b++) { g.rotate(Math.PI * 2 / 9); g.beginPath(); g.moveTo(14, 0); g.quadraticCurveTo(50, -24, 78, -6); g.lineTo(74, 10); g.quadraticCurveTo(46, -6, 14, 8); g.closePath(); g.fillStyle = '#3a3e48'; g.fill(); } circle(g, 0, 0, 22, '#5a5f6c'); g.restore(); g.strokeStyle = '#5a5f6c'; g.lineWidth = 5; g.beginPath(); g.arc(fx, -2, 84, 0, 7); g.stroke(); }
  const gl = o.glow ?? 1; seg(g, [[-230, -96], [230, -96]], 6, alpha('#76ff5a', 0.5 + 0.5 * gl)); if (gl > 0) glow(g, 0, -96, 260, '#76ff5a', 0.25 * gl);
  for (let i = 0; i < 4; i++) seg(g, [[250, -60 + i * 30], [280, -60 + i * 30]], 10, '#c87a3a'); g.restore(); };
// 2000-era network router/switch box: beige/grey 1U chassis, port rows, blinking LEDs, antenna-less. ~520 wide. o: {t}
FP.router = (g, x, y, s, o = {}) => { const t = o.t || 0; g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 30; g.shadowOffsetY = 16; rr(g, -260, -70, 520, 140, 14); F(g, '#5a6472'); g.shadowColor = 'transparent'; S(g, INK, 6); rr(g, -250, -60, 500, 40, 8); F(g, '#6c7686');
  for (let r = 0; r < 2; r++) for (let i = 0; i < 12; i++) { rr(g, -170 + i * 30, -4 + r * 34, 24, 22, 3); F(g, '#1a1c22'); circle(g, -158 + i * 30, -10 + r * 34, 3.5, Math.sin(t * 9 + i * 1.7 + r * 3) > -0.2 ? ['#5aff8a', '#ffb43a'][(i + r) % 2] : '#2a2c30'); }
  rr(g, -240, 0, 50, 50, 6); F(g, '#2a2c34'); circle(g, -215, 25, 10, '#5aff8a'); g.restore(); };

// market heat-map: tiles = [[label, weight, pct], ...]; k = reveal 0..1; slice-and-dice treemap
FP.heatmap = (g, x, y, w, h, tiles, k = 1, o = {}) => { const items = tiles.slice().sort((a, b) => b[1] - a[1]); let idx = 0;
  const col = (p) => { const a = clamp(Math.abs(p) / (o.max || 6), 0.15, 1); return p < 0 ? `rgb(${Math.round(60 + 170 * a)},${Math.round(36 - 12 * a)},${Math.round(46 - 10 * a)})` : `rgb(${Math.round(30 - 8 * a)},${Math.round(70 + 120 * a)},${Math.round(60 + 20 * a)})`; };
  const draw = (arr, X, Y, W, H) => { if (!arr.length) return; if (arr.length === 1) { const [lab, wt, p] = arr[0], i = idx++, rk = ease.outBack(clamp(k * (items.length + 3) - i, 0, 1)); if (rk <= 0) return; const cx = X + W / 2, cy = Y + H / 2;
        g.save(); g.translate(cx, cy); g.scale(rk, rk); rr(g, -W / 2 + 3, -H / 2 + 3, W - 6, H - 6, 8); F(g, col(p)); S(g, 'rgba(0,0,0,.35)', 2); const fs = clamp(Math.min(W, H) * 0.3, 14, 54);
        T(g, lab, 0, -fs * 0.35, fs, '#ffffff', { align: 'center', w: 900 }); T(g, (p > 0 ? '+' : '') + p.toFixed(1) + '%', 0, fs * 0.65, fs * 0.55, 'rgba(255,255,255,.85)', { align: 'center', w: 700 }); g.restore(); return; }
      const tot = arr.reduce((a, b) => a + b[1], 0); let acc = 0, cut = 1; for (let i = 0; i < arr.length - 1; i++) { acc += arr[i][1]; cut = i + 1; if (acc >= tot / 2) break; }
      const A = arr.slice(0, cut), B = arr.slice(cut), fa = A.reduce((a, b) => a + b[1], 0) / tot;
      if (W >= H) { draw(A, X, Y, W * fa, H); draw(B, X + W * fa, Y, W * (1 - fa), H); } else { draw(A, X, Y, W, H * fa); draw(B, X, Y + H * fa, W, H * (1 - fa)); } };
  draw(items, x, y, w, h); };

// modern spreadsheet card. cells = array of rows (strings); o: {colW, rowH, hi:[[r,c,fill,textColor]], title, fs}
FP.sheet = (g, x, y, w, cells, o = {}) => { const rows = cells.length, cols = cells[0].length, rh = o.rowH || 76, hh = 56, cw = o.colW || (w - 70) / cols, h = hh + 44 + rows * rh + 20;
  g.save(); g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 40; g.shadowOffsetY = 18; rr(g, x, y, w, h, 18); F(g, '#fbfcfe'); g.restore(); rr(g, x, y, w, h, 18); S(g, 'rgba(0,0,0,.12)', 2);
  g.save(); rr(g, x, y, w, h, 18); g.clip(); g.fillStyle = '#1f7a4a'; g.fillRect(x, y, w, hh); T(g, o.title || 'Analyst model — v7_FINAL.xlsx', x + 24, y + hh / 2, 24, '#ffffff', { w: 700 }); for (let i = 0; i < 3; i++) circle(g, x + w - 30 - i * 26, y + hh / 2, 7, 'rgba(255,255,255,.7)');
  g.fillStyle = '#eef1f5'; g.fillRect(x, y + hh, w, 44); g.fillRect(x, y + hh, 70, h); for (let c = 0; c < cols; c++) T(g, String.fromCharCode(65 + c), x + 70 + c * cw + cw / 2, y + hh + 22, 20, '#6a7280', { align: 'center', w: 700 });
  for (let r = 0; r < rows; r++) { const yy = y + hh + 44 + r * rh; T(g, String(r + 1), x + 35, yy + rh / 2, 20, '#6a7280', { align: 'center', w: 600 }); seg(g, [[x, yy + rh], [x + w, yy + rh]], 1.5, '#dfe3ea');
    for (let c = 0; c < cols; c++) { const cx = x + 70 + c * cw, hi = (o.hi || []).find(q => q[0] === r && q[1] === c); if (hi) { g.fillStyle = hi[2]; g.fillRect(cx, yy, cw, rh); }
      seg(g, [[cx, yy], [cx, yy + rh]], 1.5, '#dfe3ea'); const v = cells[r][c]; if (v != null) T(g, String(v), cx + (c ? cw / 2 : 18), yy + rh / 2, o.fs || 30, hi && hi[3] ? hi[3] : (r === 0 ? '#1a2230' : '#2a3140'), { align: c ? 'center' : 'left', w: r === 0 ? 800 : 600 }); } }
  g.restore(); };

// hourglass: k = sand fallen 0..1; centre anchor; ~260 tall at s = 1
FP.hourglass = (g, x, y, s, k, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); const gl = () => { g.beginPath(); g.moveTo(-90, -130); g.lineTo(90, -130); g.lineTo(90, -112); g.quadraticCurveTo(90, -40, 14, -6); g.lineTo(14, 6); g.quadraticCurveTo(90, 40, 90, 112); g.lineTo(90, 130); g.lineTo(-90, 130); g.lineTo(-90, 112); g.quadraticCurveTo(-90, 40, -14, 6); g.lineTo(-14, -6); g.quadraticCurveTo(-90, -40, -90, -112); g.closePath(); };
  gl(); g.fillStyle = 'rgba(200,230,255,.14)'; g.fill(); g.save(); gl(); g.clip(); const top = 1 - k, sandC = o.sand || '#f0b020';
  g.fillStyle = sandC; g.beginPath(); g.moveTo(-90, -130 + 110 * k); g.lineTo(90, -130 + 110 * k); g.lineTo(90, -40); g.lineTo(0, 0); g.lineTo(-90, -40); g.closePath(); if (top > 0.02) g.fill(); const pile = 110 * k; g.beginPath(); g.moveTo(-90, 130); g.lineTo(-90, 122); g.quadraticCurveTo(0, 130 - pile * 1.1, 90, 122); g.lineTo(90, 130); g.closePath(); if (k > 0.02) g.fill();
  if (k > 0 && k < 0.99) seg(g, [[0, -4], [0, 128 - pile]], 5, sandC); g.restore(); gl(); S(g, INK, 7); gl(); S(g, 'rgba(255,255,255,.5)', 3);
  for (const yy of [-146, 130]) { rr(g, -110, yy, 220, 18, 8); F(g, '#7a4e2e'); S(g, INK, 5); } seg(g, [[-96, -130], [-96, 130]], 8, '#7a4e2e'); seg(g, [[96, -130], [96, 130]], 8, '#7a4e2e'); g.restore(); };

// report / document cover. o: {title:[..], sub, seal, kicker}
FP.report = (g, x, y, s, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 520, H = 700;
  g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 36; g.shadowOffsetY = 16; rr(g, -W / 2, -H / 2, W, H, 8); F(g, '#f6f3ea'); g.shadowColor = 'transparent'; rr(g, -W / 2, -H / 2, 24, H, 4); F(g, '#1f3a5f');
  T(g, o.kicker || 'NOVEMBER 2026', -W / 2 + 60, -H / 2 + 60, 20, '#6a6a6a', { w: 700 }); (o.title || ['Financial', 'Stability', 'Report']).forEach((l, i) => T(g, l, -W / 2 + 60, -H / 2 + 150 + i * 70, 62, '#1f3a5f', { w: 900, font: 'Georgia, serif' }));
  seg(g, [[-W / 2 + 60, -H / 2 + 330], [W / 2 - 60, -H / 2 + 330]], 4, '#c8202a'); T(g, o.sub || 'AI investment and debt', -W / 2 + 60, -H / 2 + 372, 28, '#444', { w: 600, font: 'Georgia, serif' });
  circle(g, W / 2 - 120, H / 2 - 150, 70, '#1f3a5f'); circle(g, W / 2 - 120, H / 2 - 150, 58, '#f6f3ea'); circle(g, W / 2 - 120, H / 2 - 150, 48, '#1f3a5f'); T(g, o.seal || 'FSR', W / 2 - 120, H / 2 - 150, 30, '#f6f3ea', { align: 'center', w: 900 });
  for (let i = 0; i < 28; i++) { g.fillStyle = '#333'; g.fillRect(-W / 2 + 60 + i * 6, H / 2 - 90, 2 + (i * 7) % 4, 40); } g.restore(); };

// bank vault door: wheel handle + bolts; open 0..1 (door swings, light spills)
FP.vault = (g, x, y, s, open, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -230, -230, 460, 460, 40); F(g, '#2a2e38'); S(g, INK, 8);
  if (open > 0) { const lg = g.createRadialGradient(0, 0, 20, 0, 0, 200); lg.addColorStop(0, alpha(o.light || '#ffe28a', 0.95)); lg.addColorStop(1, alpha(o.light || '#ffe28a', 0.15)); g.fillStyle = lg; g.beginPath(); g.arc(0, 0, 190, 0, 7); g.fill(); }
  g.save(); g.scale(1 - 0.85 * ease.inOut(open), 1); circle(g, 0, 0, 190, '#7a8494'); S(g, INK, 8); circle(g, 0, 0, 160, '#9aa4b4'); S(g, INK, 4); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; circle(g, Math.cos(a) * 172, Math.sin(a) * 172, 9, '#5a6474'); }
  g.save(); g.rotate(open * 4.0 + (o.spin || 0)); circle(g, 0, 0, 40, '#b8c0cc'); S(g, INK, 5); for (let i = 0; i < 4; i++) { g.rotate(Math.PI / 2); seg(g, [[0, 0], [0, -110]], 16, INK); seg(g, [[0, 0], [0, -110]], 9, '#c8d0dc'); circle(g, 0, -118, 14, '#c8d0dc'); S(g, INK, 4); } g.restore(); g.restore(); g.restore(); };

// ---- V03 clips 12-14: the oven-shop analogy + guarantees ----
// stainless commercial oven, bottom-centre anchor, ~200w x 240h. o: {glow, bread, tag:'$4k', on}
FP.oven = (g, x, y, s, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); const W = 200, H = 240;
  for (const d of [-1, 1]) { rr(g, d * 78 - 10, -22, 20, 22, 4); F(g, '#4a4e58'); S(g, INK, 3); }
  rr(g, -W / 2, -H, W, H - 20, 14); const gr = g.createLinearGradient(-W / 2, 0, W / 2, 0); gr.addColorStop(0, '#b8c0cc'); gr.addColorStop(0.5, '#f0f4fa'); gr.addColorStop(1, '#9aa4b2'); g.fillStyle = gr; g.fill(); S(g, INK, 6);
  rr(g, -W / 2 + 10, -H + 10, W - 20, 40, 8); F(g, '#3a3e48'); for (let i = 0; i < 3; i++) { circle(g, -50 + i * 50, -H + 30, 11, '#e8ecf4'); seg(g, [[-50 + i * 50, -H + 30], [-50 + i * 50 + 6, -H + 22]], 3, INK); } circle(g, 74, -H + 30, 7, o.on ? '#ff5a3a' : '#5a3a3a');
  rr(g, -W / 2 + 16, -H + 62, W - 32, H - 112, 10); F(g, '#2a2e38'); S(g, INK, 5); rr(g, -W / 2 + 30, -H + 76, W - 60, H - 142, 6); F(g, o.glow ? '#ffb050' : '#3a3e48');
  if (o.glow) glow(g, 0, -H / 2 - 10, 130, '#ff9a30', 0.3); if (o.bread) for (let i = 0; i < 3; i++) { g.fillStyle = '#8a4a1a'; g.beginPath(); g.ellipse(-38 + i * 38, -H + 150, 17, 10, 0, 0, 7); g.fill(); }
  seg(g, [[-60, -H + 66], [60, -H + 66]], 7, '#c8ced8'); g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(-W / 2 + 34, -H + 80, 10, H - 150);
  if (o.tag) { seg(g, [[W / 2 - 22, -H + 60], [W / 2 - 8, -H + 26]], 3, INK); rr(g, W / 2 - 44, -H + 20, 72, 38, 6); F(g, '#ffe24a'); S(g, INK, 3); T(g, o.tag, W / 2 - 8, -H + 40, 20, INK, { align: 'center', w: 900 }); }
  g.restore(); };

// generic bank facade: pediment, columns, steps, sign. bottom-centre, ~560w x 420h
FP.bank = (g, x, y, s, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s);
  for (let i = 0; i < 3; i++) { rr(g, -300 + i * 20, -30 + i * 10 - 10, 600 - i * 40, 20, 3); F(g, ['#c8c2b4', '#d8d2c4', '#e8e2d4'][i]); S(g, INK, 3); }
  rr(g, -250, -260, 500, 230, 4); F(g, '#efe8d8'); S(g, INK, 5); for (let i = 0; i < 5; i++) { const cx = -200 + i * 100; rr(g, cx - 22, -250, 44, 215, 6); const cg = g.createLinearGradient(cx - 22, 0, cx + 22, 0); cg.addColorStop(0, '#d8d0bc'); cg.addColorStop(0.5, '#fffaf0'); cg.addColorStop(1, '#c8c0aa'); g.fillStyle = cg; g.fill(); S(g, INK, 4); }
  g.beginPath(); g.moveTo(-280, -260); g.lineTo(0, -380); g.lineTo(280, -260); g.closePath(); F(g, '#e0d8c4'); S(g, INK, 6); rr(g, -130, -330, 260, 56, 8); F(g, '#1f3a5f'); S(g, INK, 4); T(g, o.name || 'THE BANK', 0, -301, 36, '#ffe28a', { align: 'center', w: 900 });
  rr(g, -52, -150, 104, 118, 6); F(g, '#5a3a22'); S(g, INK, 4); circle(g, 30, -92, 6, '#ffc83a'); g.restore(); };

// contract page with a signature that draws itself: k = signature progress 0..1. o: {title, lines:[...], pen:true}
const SIG = [[-210, 6], [-180, -34], [-160, 18], [-124, -44], [-96, 12], [-66, -22], [-28, 14], [26, -34], [78, 8], [136, -14], [196, 6]];
FP.contract = (g, x, y, s, k = 0, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 560, H = 720;
  g.shadowColor = 'rgba(0,0,0,.4)'; g.shadowBlur = 30; g.shadowOffsetY = 14; rr(g, -W / 2, -H / 2, W, H, 6); F(g, '#fbfaf4'); g.shadowColor = 'transparent';
  T(g, o.title || 'GUARANTEE', 0, -H / 2 + 76, 58, '#1f3a5f', { align: 'center', w: 900, font: 'Georgia, serif' }); seg(g, [[-W / 2 + 50, -H / 2 + 120], [W / 2 - 50, -H / 2 + 120]], 4, '#1f3a5f');
  (o.lines || ['If the borrower fails to pay,', 'the guarantor will cover the', 'full amount, up to the limit.']).forEach((l, i) => T(g, l, -W / 2 + 56, -H / 2 + 180 + i * 46, 29, '#33363e', { w: 600, font: 'Georgia, serif' }));
  for (let i = 0; i < 6; i++) { g.fillStyle = '#d4d6dc'; g.fillRect(-W / 2 + 56, -H / 2 + 345 + i * 28, (W - 112) * (0.55 + ((i * 7) % 4) * 0.1), 8); }
  T(g, 'Guarantor', -W / 2 + 56, H / 2 - 92, 22, '#6a6e7a', { w: 700 }); seg(g, [[-W / 2 + 56, H / 2 - 120], [W / 2 - 56, H / 2 - 120]], 3, '#1a1a22');
  if (k > 0) { g.beginPath(); const n = Math.max(1, Math.floor((SIG.length - 1) * k)); SIG.forEach(([px, py], i) => { if (i > n) return; const f = i === n ? ((SIG.length - 1) * k - n) : 1; const [qx, qy] = i ? SIG[i - 1] : SIG[0]; const ex = i ? qx + (px - qx) * f : px, ey = i ? qy + (py - qy) * f : py; i ? g.lineTo(ex, ey + H / 2 - 150) : g.moveTo(px, py + H / 2 - 150); }); g.strokeStyle = '#1a3aa0'; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(); }
  circle(g, W / 2 - 100, -H / 2 + 330, 0.1, '#000'); g.restore(); };

// big rubber-stamp text slamming down. k = 0..1 progress of the slam; col = ink colour
FP.stamp = (g, x, y, s, label, col, k, o = {}) => { if (k <= 0) return; const fs = o.fs || 98; g.save(); g.font = `900 ${fs}px Inter, "Segoe UI", Arial, sans-serif`; const tw = g.measureText(label).width; g.restore(); const W = Math.max(380, tw + 120), H = fs * 1.5;   // the box always grows to fit the text (user 2026-11-23: text must never stick out)
  const sc = 1 + (1 - ease.out(clamp(k * 3, 0, 1))) * 1.3; g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.12); g.scale(s * sc, s * sc); g.globalAlpha = clamp(k * 4, 0, 1);
  rr(g, -W / 2, -H / 2, W, H, 20); g.fillStyle = alpha(col, 0.1); g.fill(); g.strokeStyle = col; g.lineWidth = 11; g.stroke(); rr(g, -W / 2 + 14, -H / 2 + 14, W - 28, H - 28, 14); g.lineWidth = 3; g.stroke(); T(g, label, 0, 6, fs, col, { align: 'center', w: 900 }); g.restore(); };

// cash register on a counter, bottom-centre ~300w x 250h. open = drawer 0..1; o.amount shown on the display
FP.register = (g, x, y, s, open = 0, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s);
  rr(g, -140 + open * 6, -70 + open * 0, 280, 60 + open * 40, 10); F(g, '#7a4e2e'); S(g, INK, 5); if (open > 0) { rr(g, -126, -54 + open * 34, 252, 34, 6); F(g, '#2a2e38'); for (let i = 0; i < 4; i++) { g.fillStyle = '#7fd08a'; g.fillRect(-110 + i * 56, -54 + open * 34 + 4, 44, 24); } }
  rr(g, -150, -180, 300, 120, 16); F(g, '#c8ced8'); S(g, INK, 6); rr(g, -112, -168, 224, 56, 8); F(g, '#0e2a1a'); S(g, INK, 4); T(g, o.amount || '$0.00', 100, -140, 40, '#5aff8a', { align: 'right', font: '"Courier New", monospace' });
  for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) { rr(g, -124 + c * 42, -100 + r * 26, 34, 20, 4); F(g, c === 5 ? '#e0562f' : '#e8ecf4'); S(g, INK, 2); } seg(g, [[-100, -190], [-100, -250]], 8, '#8a8e98'); g.restore(); };

// cheque / loan note. o: {amount:'$250,000', pay:'THE BAKERY'}
FP.cheque = (g, x, y, s, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 560, H = 240;
  g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 22; g.shadowOffsetY = 10; rr(g, -W / 2, -H / 2, W, H, 10); F(g, '#e6f2e4'); g.shadowColor = 'transparent'; S(g, '#4a7a5a', 4);
  for (let i = 0; i < 6; i++) seg(g, [[-W / 2 + 20, -H / 2 + 30 + i * 34], [W / 2 - 20, -H / 2 + 30 + i * 34 + 4]], 1.5, 'rgba(74,122,90,.18)'); T(g, o.bank || 'THE BANK', -W / 2 + 28, -H / 2 + 36, fitSz(g, o.bank || 'THE BANK', 300, 24, 900), '#1f5a3a', { w: 900 }); T(g, o.date || 'LOAN NOTE', W / 2 - 28, -H / 2 + 36, 18, '#4a7a5a', { align: 'right', w: 600 });
  T(g, 'PAY', -W / 2 + 28, -14, 20, '#4a7a5a', { w: 700 }); T(g, o.pay || 'THE BAKERY', -W / 2 + 90, -14, fitSz(g, o.pay || 'THE BAKERY', W - 90 - 28 - 190 - 10, 30, 800, 'Georgia, serif'), '#1a2a22', { w: 800, font: 'Georgia, serif' }); seg(g, [[-W / 2 + 84, 4], [W / 2 - 190, 4]], 2, '#1a2a22');
  rr(g, W / 2 - 180, -38, 156, 52, 8); F(g, '#ffffff'); S(g, '#1f5a3a', 3); T(g, o.amount || '$250,000', W / 2 - 102, -12, 28, '#1a2a22', { align: 'center', w: 900 }); seg(g, [[-W / 2 + 28, H / 2 - 36], [-W / 2 + 230, H / 2 - 36]], 2, '#1a2a22'); T(g, 'GUARANTEED BY YOU', -W / 2 + 28, H / 2 - 18, 15, '#a0302a', { w: 800 }); g.restore(); };

// chain from (x0,y0) to (x1,y1) with a sag, links as ovals; draws an iron ball at the end if o.ball ('label')
FP.chain = (g, x0, y0, x1, y1, o = {}) => { const n = o.links || 14, sag = o.sag ?? 50, col = o.col || '#9aa0ac';
  for (let i = 0; i <= n; i++) { const p = i / n, px = lerp(x0, x1, p), py = lerp(y0, y1, p) + Math.sin(p * Math.PI) * sag, q = (i + 1) / n, nx = lerp(x0, x1, q), ny = lerp(y0, y1, q) + Math.sin(q * Math.PI) * sag, a = Math.atan2(ny - py, nx - px);
    g.save(); g.translate(px, py); g.rotate(a + (i % 2 ? Math.PI / 2 : 0)); g.beginPath(); g.ellipse(0, 0, 17, 9, 0, 0, 7); g.strokeStyle = INK; g.lineWidth = 11; g.stroke(); g.strokeStyle = col; g.lineWidth = 6; g.stroke(); g.restore(); }
  if (o.ball) { circle(g, x1, y1 + 46, 56, '#2a2e38'); S(g, INK, 6); g.fillStyle = 'rgba(255,255,255,.18)'; g.beginPath(); g.ellipse(x1 - 18, y1 + 26, 16, 10, -0.6, 0, 7); g.fill(); T(g, o.ball, x1, y1 + 50, fitSz(g, o.ball, 92, 20, 900), '#ffffff', { align: 'center', w: 900 }); } };

// room backdrops for the oven-shop story. Both return {gy} (floor line). Figures are drawn by the scene on top.
FP.ovenShop = (g, t, o = {}) => { const gy = E.H * 0.8, n = o.ovens ?? 5;
  const w = g.createLinearGradient(0, 0, 0, gy); w.addColorStop(0, '#34767f'); w.addColorStop(1, '#245a64'); g.fillStyle = w; g.fillRect(-E.W, -E.H, E.W * 3, gy + E.H);
  g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 2; for (let y = 60; y < gy; y += 70) { g.beginPath(); g.moveTo(-E.W, y); g.lineTo(E.W * 2, y); g.stroke(); for (let x = (y / 70 % 2) * 60 - E.W; x < E.W * 2; x += 120) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 70); g.stroke(); } }
  rr(g, 90, 110, 430, 470, 16); F(g, '#bfe4f4'); S(g, '#e8dcc4', 14); seg(g, [[305, 110], [305, 580]], 10, '#e8dcc4'); seg(g, [[90, 345], [520, 345]], 10, '#e8dcc4'); glow(g, 305, 340, 300, '#ffffff', 0.15);
  g.save(); rr(g, 120, 140, 370, 410, 8); g.clip(); g.fillStyle = '#8ac8e8'; g.fillRect(120, 140, 370, 410); for (let i = 0; i < 6; i++) { g.fillStyle = '#6aa8c8'; g.fillRect(130 + i * 62, 380 - (i * 53) % 120, 44, 170 + (i * 53) % 120); } g.restore();
  const fl = 0.75 + 0.25 * Math.sin(t * 7); rr(g, 130, 36, 360, 62, 14); F(g, '#12161e'); S(g, INK, 4); T(g, 'OVENS', 310, 68, 46, `rgba(255,140,90,${fl})`, { align: 'center', w: 900 }); glow(g, 310, 68, 220, '#ff7a3a', 0.2 * fl);
  for (const y of [300, 470]) { rr(g, 1380, y, 480, 18, 4); F(g, '#7a4e2e'); S(g, INK, 4); for (let i = 0; i < 5; i++) { g.fillStyle = ['#c8844a', '#d8984a', '#b87438'][i % 3]; g.beginPath(); g.ellipse(1430 + i * 92, y - 20, 38, 22, 0, 0, 7); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); for (let s = 0; s < 3; s++) seg(g, [[1412 + i * 92 + s * 16, y - 30], [1420 + i * 92 + s * 16, y - 10]], 3, '#8a5428'); } }
  g.fillStyle = '#e8dcc4'; g.fillRect(-E.W, gy, E.W * 3, E.H); for (let x = -E.W; x < E.W * 2; x += 140) for (let r = 0; r < 4; r++) { if ((x / 140 + r) % 2) { g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x, gy + r * 70, 140, 70); } }
  g.fillStyle = '#3a2a1c'; g.fillRect(-E.W, gy - 6, E.W * 3, 12);
  for (let i = 0; i < n; i++) FP.oven(g, 640 + i * 190, gy + 6, 0.95, { glow: o.glow, bread: o.glow, tag: o.tags ? o.tags[i] : null, on: o.glow });
  return { gy }; };
FP.bankInterior = (g, t, o = {}) => { const gy = E.H * 0.8; const w = g.createLinearGradient(0, 0, 0, gy); w.addColorStop(0, '#e8dfc8'); w.addColorStop(1, '#d4c8a8'); g.fillStyle = w; g.fillRect(-E.W, -E.H, E.W * 3, gy + E.H);
  g.fillStyle = '#7a5a38'; g.fillRect(-E.W, gy - 220, E.W * 3, 220); g.fillStyle = 'rgba(0,0,0,.12)'; for (let x = -E.W; x < E.W * 2; x += 150) { rr(g, x + 10, gy - 200, 130, 170, 6); g.fill(); }
  g.fillStyle = '#c8c0a8'; g.fillRect(-E.W, gy - 226, E.W * 3, 12); circle(g, E.W / 2, 150, 90, '#fbf6ea'); S(g, INK, 8); for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; seg(g, [[E.W / 2 + Math.sin(a) * 74, 150 - Math.cos(a) * 74], [E.W / 2 + Math.sin(a) * 84, 150 - Math.cos(a) * 84]], 4, INK); }
  const tt = (o.h ?? 10) + t / 40; seg(g, [[E.W / 2, 150], [E.W / 2 + Math.sin(tt * Math.PI / 6) * 40, 150 - Math.cos(tt * Math.PI / 6) * 40]], 8, INK); seg(g, [[E.W / 2, 150], [E.W / 2 + Math.sin(t * 0.3) * 62, 150 - Math.cos(t * 0.3) * 62]], 5, INK);
  rr(g, E.W / 2 - 150, 270, 300, 60, 10); F(g, '#1f3a5f'); S(g, INK, 5); T(g, o.sign || 'LOANS', E.W / 2, 300, 40, '#ffe28a', { align: 'center', w: 900 });
  g.fillStyle = '#e0d8c0'; g.fillRect(-E.W, gy, E.W * 3, E.H); for (let x = -E.W; x < E.W * 2; x += 120) for (let r = 0; r < 4; r++) if ((x / 120 + r) % 2) { g.fillStyle = 'rgba(0,0,0,.08)'; g.fillRect(x, gy + r * 60, 120, 60); }
  return { gy }; };

// the AI chip as a worried little character with legs (V03). bottom-centre anchor, ~300w x 330h at s=1. o: {mood:'worried'|'happy', look}
FP.chipChar = (g, x, y, s, t, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); const bob = Math.sin(t * 3) * 4;
  for (const d of [-1, 1]) { seg(g, [[d * 50, -40 + bob], [d * 60, 30]], 24, INK); seg(g, [[d * 50, -40 + bob], [d * 60, 30]], 15, '#e0b05a'); rr(g, d * 60 - 26, 22, 52, 20, 8); F(g, '#3a3e48'); S(g, INK, 4); }
  g.fillStyle = '#e0b05a'; for (let i = 0; i < 5; i++) { g.fillRect(-100 + i * 50 - 8, -262 + bob, 16, 34); g.fillRect(-142, -200 + i * 38 + bob, 34, 14); g.fillRect(108, -200 + i * 38 + bob, 34, 14); }
  rr(g, -130, -232 + bob, 260, 200, 26); F(g, '#20262e'); S(g, INK, 7); rr(g, -104, -206 + bob, 208, 148, 16); F(g, '#2f3a44'); S(g, '#5affb0', 4); glow(g, 0, -132 + bob, 150, '#5affb0', 0.12);
  T(g, o.label || 'AI', 0, -176 + bob, 34, '#d8ffee', { align: 'center', w: 900 }); for (const d of [-1, 1]) { circle(g, d * 44, -128 + bob, 24, '#ffffff'); S(g, INK, 4); circle(g, d * 44 + (o.look || 0) * 8, -126 + bob, 10, INK); }
  g.strokeStyle = INK; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); if (o.mood === 'worried') { g.moveTo(-30, -78 + bob); g.quadraticCurveTo(0, -96 + bob, 30, -78 + bob); } else { g.moveTo(-30, -84 + bob); g.quadraticCurveTo(0, -66 + bob, 30, -84 + bob); } g.stroke();
  if (o.mood === 'worried') { seg(g, [[-70, -164 + bob], [-20, -152 + bob]], 5, INK); seg(g, [[70, -164 + bob], [20, -152 + bob]], 5, INK); } g.restore(); };
