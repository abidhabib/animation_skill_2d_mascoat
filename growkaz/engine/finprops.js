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
import { E, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';

const INK = '#1b1424', F = (g, c) => { g.fillStyle = c; g.fill(); }, S = (g, c, w) => { g.strokeStyle = c; g.lineWidth = w; g.stroke(); };
const T = (g, s, x, y, sz, col, o = {}) => { g.save(); g.font = `${o.w || 700} ${sz}px ${o.font || 'Inter, "Segoe UI", Arial, sans-serif'}`; g.fillStyle = col; g.textAlign = o.align || 'left'; g.textBaseline = 'middle'; g.fillText(s, x, y); g.restore(); };
const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const FP = {};

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
  (o.head || ['THE INTERNET', 'CHANGES EVERYTHING']).forEach((l, i) => T(g, l, 0, -H / 2 + 176 + i * 58, 52, '#111', { align: 'center', font: serif, w: 900 }));
  const py = -H / 2 + 300; g.fillStyle = '#ddd6c4'; g.fillRect(-W / 2 + 24, py, W * 0.58, 230); if (o.photo) o.photo(g, -W / 2 + 24, py, W * 0.58, 230); g.strokeStyle = '#151515'; g.lineWidth = 2; g.strokeRect(-W / 2 + 24, py, W * 0.58, 230);
  for (let i = 0; i < 14; i++) { const yy = py + 6 + i * 16.5; g.fillStyle = '#9a958a'; g.fillRect(W * 0.08 + 14, yy, (W * 0.42 - 40) * (0.7 + rnd(i) * 0.3), 6); }
  for (let c = 0; c < 4; c++) for (let i = 0; i < 12; i++) { g.fillStyle = '#a8a395'; g.fillRect(-W / 2 + 24 + c * (W - 48) / 4, py + 260 + i * 16.5, ((W - 48) / 4 - 16) * (0.6 + rnd(c * 20 + i) * 0.4), 6); }
  T(g, o.sub || 'Tech giant now worth more than any company on Earth', -W / 2 + 24, py + 246, 15, '#222', { font: serif, w: 700 }); g.restore(); };

FP.tv2000 = (g, x, y, s, screen, t) => { g.save(); g.translate(x, y); g.scale(s, s); const W = 640, H = 480;
  seg(g, [[-60, -H / 2 - 40], [-170, -H / 2 - 200]], 6, '#3a3a3a'); seg(g, [[60, -H / 2 - 40], [170, -H / 2 - 210]], 6, '#3a3a3a'); circle(g, -170, -H / 2 - 200, 8, '#5a5a5a'); circle(g, 170, -H / 2 - 210, 8, '#5a5a5a');
  for (const d of [-1, 1]) seg(g, [[d * 230, H / 2], [d * 270, H / 2 + 110]], 12, '#4a3020');
  rr(g, -W / 2 - 30, -H / 2 - 40, W + 160, H + 80, 30); F(g, '#7a4e2e'); S(g, INK, 6); g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 10; i++) g.fillRect(-W / 2 - 30, -H / 2 - 30 + i * 52, W + 160, 3);
  rr(g, -W / 2 - 10, -H / 2 - 20, W + 20, H + 40, 40); F(g, '#1e1e22');
  g.save(); rr(g, -W / 2, -H / 2, W, H, 44); g.clip(); g.fillStyle = '#0a0a10'; g.fillRect(-W / 2, -H / 2, W, H); if (screen) screen(g, -W / 2, -H / 2, W, H);
  for (let yy = -H / 2; yy < H / 2; yy += 4) { g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-W / 2, yy, W, 1.5); } const gl = g.createRadialGradient(-120, -140, 10, 0, 0, W * 0.7); gl.addColorStop(0, 'rgba(255,255,255,.18)'); gl.addColorStop(0.4, 'rgba(255,255,255,0)'); gl.addColorStop(1, 'rgba(0,0,0,.45)'); g.fillStyle = gl; g.fillRect(-W / 2, -H / 2, W, H); g.restore();
  for (let i = 0; i < 2; i++) { circle(g, W / 2 + 70, -H / 2 + 60 + i * 80, 22, '#c8b090'); S(g, INK, 4); } for (let i = 0; i < 6; i++) { rr(g, W / 2 + 40, 40 + i * 22, 60, 10, 4); F(g, '#3a2a1a'); } g.restore(); };

FP.newsBanner = (g, x, y, w, head, t, o = {}) => { rr(g, x, y, 190, 70, 6); F(g, '#d81e2a'); T(g, o.tag || 'LIVE', x + 95, y + 36, 32, '#ffffff', { align: 'center', w: 900 });
  g.fillStyle = '#ffffff'; g.fillRect(x + 190, y, w - 190, 70); T(g, head, x + 214, y + 36, 34, '#111', { w: 900 }); g.fillStyle = '#101820'; g.fillRect(x, y + 70, w, 36);
  g.save(); g.beginPath(); g.rect(x, y + 70, w, 36); g.clip(); const s2 = o.ticker || 'NASDAQ 4,223 -6.2%   CSCO 57.13 -28.6%   DOW 10,560 -1.1%   ANALYSTS: "STILL THE BEST COMPANY IN THE WORLD"'; for (let k = 0; k < 3; k++) T(g, s2, x + 20 - (t * 140) % 1600 + k * 1600, y + 89, 20, '#ffd24a', { w: 700 }); g.restore(); };

FP.phone = (g, x, y, s, screen, o = {}) => { g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const W = 360, H = 760;
  g.shadowColor = 'rgba(0,0,0,.5)'; g.shadowBlur = 50; g.shadowOffsetY = 24; rr(g, -W / 2 - 14, -H / 2 - 14, W + 28, H + 28, 62); F(g, '#16171c'); g.shadowColor = 'transparent'; rr(g, -W / 2 - 14, -H / 2 - 14, W + 28, H + 28, 62); S(g, '#4a4d58', 3);
  g.save(); rr(g, -W / 2, -H / 2, W, H, 50); g.clip(); g.fillStyle = o.bg || '#0c0e14'; g.fillRect(-W / 2, -H / 2, W, H); if (screen) screen(g, -W / 2, -H / 2, W, H);
  T(g, o.time || '9:41', -W / 2 + 40, -H / 2 + 30, 20, '#ffffff', { w: 700 }); for (let i = 0; i < 4; i++) { g.fillStyle = '#ffffff'; g.fillRect(W / 2 - 92 + i * 7, -H / 2 + 34 - i * 4, 5, 6 + i * 4); } rr(g, W / 2 - 56, -H / 2 + 22, 34, 16, 5); S(g, '#ffffff', 2); g.fillStyle = '#ffffff'; g.fillRect(W / 2 - 53, -H / 2 + 25, 24, 10);
  rr(g, -60, -H / 2 + 14, 120, 34, 17); F(g, '#000000'); g.restore(); g.restore(); };

FP.post = (g, x, y, w, o = {}) => { const h = o.h || 210; FP.glass(g, x, y, w, h, { r: 22, fill: 'rgba(24,27,38,.95)' });
  g.save(); g.beginPath(); g.arc(x + 46, y + 46, 26, 0, 7); g.fillStyle = o.color || '#4a78b8'; g.fill(); g.clip(); bigToonFace(g, x + 46, y + 56, 15, { cast: o.cast || HERO, expr: o.expr || 'happy' }); g.restore();
  T(g, o.name || 'Alex', x + 86, y + 36, 21, '#ffffff', { w: 800 }); T(g, (o.handle || '@alex') + ' · ' + (o.ago || '2m'), x + 86, y + 60, 17, '#8a90a0', { w: 500 });
  T(g, o.text || 'It’s a dip. Buy it.', x + 24, y + 110, o.size || 30, '#ffffff', { w: 800 }); if (o.emoji) T(g, o.emoji, x + w - 70, y + 110, 30, '#2fd67a', { w: 900 });
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
  T(g, o.text || 'Held. Never sold.', x + 84, y + 76, 24, '#e8eaf0', { w: 600 }); T(g, '\u{1F44D} ' + (o.likes || '1.2K') + '      \u{1F44E}      Reply', x + 84, y + 118, 17, '#8a90a0', { w: 600 }); };

FP.door = (g, x, y, s, label, open, o = {}) => { g.save(); g.translate(x, y); g.scale(s, s); const c = o.color || '#7a4e34';
  rr(g, -150, -440, 300, 440, 10); F(g, '#2a2230'); S(g, INK, 6); if (open > 0) { const lg = g.createLinearGradient(0, -440, 0, 0); lg.addColorStop(0, alpha(o.light || '#fff2c8', 0.9)); lg.addColorStop(1, alpha(o.light || '#fff2c8', 0.4)); g.fillStyle = lg; g.fillRect(-140, -430, 280, 430); }
  g.save(); g.translate(-140, 0); g.scale(1 - 0.75 * ease.inOut(open), 1); rr(g, 0, -430, 280, 430, 8); F(g, c); S(g, INK, 5); for (const yy of [-400, -200]) { rr(g, 30, yy, 220, 160, 10); S(g, 'rgba(0,0,0,.25)', 5); } circle(g, 240, -210, 14, '#e0b05a'); g.restore();
  rr(g, -110, -520, 220, 64, 12); F(g, o.plate || '#f4f0e6'); S(g, INK, 5); T(g, label, 0, -487, 36, o.plateText || INK, { align: 'center', w: 900 }); g.restore(); };
