// props2d.js: THE reusable 2D prop + icon library (user 2026-11-22: "2d props library"). Same house look everywhere:
// flat cartoon colours, one soft shade band + one shine, ink outline #1b1424 (5 units), rounded corners, no brand marks.
//   import { D } from '/engine/props2d.js';   D.mug(g, x, y, s, { color, steam: 1, t });
// Every prop: D.<name>(g, x, y, s = 1, o = {}). Common options: o.rot (radians), o.flip (mirror), o.t (time, for animated bits),
// o.a (alpha). ANCHOR: objects that sit on something (mug, bottle, plant, laptop, bag, shoe, car...) = BOTTOM CENTRE;
// icons / UI / floating things (heart, tick, bubble, phone, coin, map...) = CENTRE. Sizes at s = 1 are noted per prop.
// Picture of everything: _Studio Kit/docs/PROPS_2D.png  (gallery: example-lab-props shots L09-L12).
import { E, rr, seg, circle, alpha, shade, text, glow, ease, prog, lerp, measure } from '/engine/core.js';
import { bigToonFace, HERO } from '/engine/toon2d.js';
import { bike } from '/engine/sets/park.js';
import { cup } from '/engine/sets/cafe.js';
import { umbrella } from '/engine/sets/street.js';

const INK = '#1b1424';
const D = {};
const def = (name, fn) => { D[name] = (g, x, y, s = 1, o = {}) => { g.save(); if (o.a != null) g.globalAlpha *= o.a; g.translate(x, y); if (o.rot) g.rotate(o.rot); g.scale(s * (o.flip ? -1 : 1), s); g.lineJoin = 'round'; g.lineCap = 'round'; const r = fn(g, o, o.t || 0); g.restore(); return r; }; };
// drawing helpers (also exported for new props)
export const fs = (g, fill, lw = 5) => { if (fill) { g.fillStyle = fill; g.fill(); } if (lw) { g.strokeStyle = INK; g.lineWidth = lw; g.stroke(); } };
export const R = (g, x, y, w, h, r, fill, lw = 5) => { rr(g, x, y, w, h, r); fs(g, fill, lw); };
export const C = (g, x, y, r, fill, lw = 5) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); fs(g, fill, lw); };
export const EL = (g, x, y, rx, ry, fill, lw = 5, rot = 0) => { g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); fs(g, fill, lw); };
export const PATH = (g, pts, fill, lw = 5, close = true) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); fs(g, fill, lw); };
export const shine = (g, x, y, w, h, a = 0.4) => { g.fillStyle = alpha('#ffffff', a); rr(g, x, y, w, h, Math.min(w, h) / 2); g.fill(); };
const band = (g, clipFn, x, y, w, h, a = 0.14) => { g.save(); clipFn(); g.clip(); g.fillStyle = alpha('#000000', a); g.fillRect(x, y, w, h); g.restore(); };   // one soft shade band
const T = (g, str, x, y, size, color = INK, o = {}) => text(g, String(str), x, y, { size, color, ...o });
const star5 = (g, x, y, r1, r2, fill, lw = 5) => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? r2 : r1; p.push([x + Math.cos(a) * r, y + Math.sin(a) * r]); } PATH(g, p, fill, lw); };
// small round portrait of a cast member (for phones, comments, contacts). r = radius.
export function avatar(g, x, y, r, cast = HERO, bg = '#8fd0ff', o = {}) { g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = bg; g.fill(); g.clip(); bigToonFace(g, x, y + r * 0.25, r * 0.55, { cast, expr: o.expr || 'smile' }); g.restore(); g.strokeStyle = INK; g.lineWidth = Math.max(2, r * 0.08); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke(); }

// ---------- phone screens (used by phone / handPhone). kind: 'lock' | 'home' | 'chat' | 'call' | 'dead' | 'off' | function(g,x,y,w,h) ----------
const WALL = ['#6a5acd', '#ff9a8a'];
export function screen(g, kind, x, y, w, h, o = {}, t = 0) {
  if (typeof kind === 'function') return kind(g, x, y, w, h);
  const wall = () => { const gr = g.createLinearGradient(x, y, x + w, y + h); gr.addColorStop(0, (o.wall || WALL)[0]); gr.addColorStop(1, (o.wall || WALL)[1]); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const cx = x + w / 2;
  if (kind === 'off') { g.fillStyle = '#0d0f1a'; g.fillRect(x, y, w, h); g.fillStyle = 'rgba(255,255,255,.07)'; g.beginPath(); g.moveTo(x + w * 0.2, y); g.lineTo(x + w * 0.55, y); g.lineTo(x, y + h * 0.45); g.lineTo(x, y + h * 0.25); g.fill(); return; }
  if (kind === 'dead') { g.fillStyle = '#05060a'; g.fillRect(x, y, w, h); const bw = w * 0.42, bh = bw * 0.5; g.save(); g.translate(cx, y + h * 0.48); R(g, -bw / 2, -bh / 2, bw, bh, bh * 0.2, null, 0); g.strokeStyle = '#c8ccd4'; g.lineWidth = w * 0.025; rr(g, -bw / 2, -bh / 2, bw, bh, bh * 0.2); g.stroke(); g.fillStyle = '#c8ccd4'; g.fillRect(bw / 2 + 2, -bh * 0.18, w * 0.03, bh * 0.36);
    if (Math.sin(t * 6) > -0.2) { g.fillStyle = '#ff4a3a'; rr(g, -bw / 2 + w * 0.03, -bh / 2 + w * 0.03, bw * 0.14, bh - w * 0.06, 3); g.fill(); } g.restore(); return; }
  if (kind === 'lock' || kind === 'home') { wall(); T(g, o.time || '9:41', cx, y + h * 0.17, w * 0.24, '#ffffff', { weight: 600 }); T(g, o.date || 'Monday', cx, y + h * 0.26, w * 0.07, 'rgba(255,255,255,.9)', { weight: 600 });
    if (kind === 'home') { const cols = ['#ffd08a', '#8dffc8', '#8fd0ff', '#ff9ab0', '#c8a0ff', '#ffffff', '#ffb070', '#9ad0a0']; for (let i = 0; i < 8; i++) { const s2 = w * 0.17, gx = x + w * 0.09 + (i % 4) * w * 0.22, gy = y + h * 0.42 + Math.floor(i / 4) * w * 0.25; g.fillStyle = cols[i]; rr(g, gx, gy, s2, s2, s2 * 0.28); g.fill(); } }
    else if (o.note) { g.fillStyle = 'rgba(255,255,255,.88)'; rr(g, x + w * 0.06, y + h * 0.36, w * 0.88, h * 0.13, w * 0.05); g.fill(); T(g, o.note, cx, y + h * 0.425, w * 0.07, INK, { weight: 600 }); }
    g.fillStyle = 'rgba(255,255,255,.7)'; rr(g, cx - w * 0.18, y + h - h * 0.035, w * 0.36, h * 0.012, 3); g.fill(); return; }
  if (kind === 'chat') { g.fillStyle = '#f4f6fa'; g.fillRect(x, y, w, h); g.fillStyle = '#ffffff'; g.fillRect(x, y, w, h * 0.13); avatar(g, x + w * 0.16, y + h * 0.075, w * 0.08, o.cast || HERO, o.avatarBg || '#8fd0ff');
    T(g, o.name || 'Sam', x + w * 0.3, y + h * 0.075, w * 0.075, INK, { align: 'left' }); let yy = y + h * 0.18;
    for (const [who, msg] of (o.msgs || [['them', 'Hey!'], ['me', 'On my way']])) { const me = who === 'me', fsz = w * 0.062, tw = Math.min(w * 0.7, measure(g, msg, fsz) + w * 0.1), bx = me ? x + w - tw - w * 0.05 : x + w * 0.05;
      g.fillStyle = me ? '#4a78b8' : '#ffffff'; rr(g, bx, yy, tw, h * 0.075, h * 0.03); g.fill(); if (!me) { g.strokeStyle = '#dfe3ea'; g.lineWidth = 2; g.stroke(); } T(g, msg, bx + tw / 2, yy + h * 0.038, fsz, me ? '#ffffff' : INK, { weight: 600 }); yy += h * 0.1; }
    if (o.typing) { g.fillStyle = '#ffffff'; rr(g, x + w * 0.05, yy, w * 0.26, h * 0.06, h * 0.03); g.fill(); for (let d = 0; d < 3; d++) circle(g, x + w * 0.11 + d * w * 0.07, yy + h * 0.03, w * 0.022 * (0.75 + 0.25 * Math.sin(t * 7 - d)), '#9aa4ae'); }
    g.fillStyle = '#ffffff'; g.fillRect(x, y + h * 0.9, w, h * 0.1); g.fillStyle = '#eef0f4'; rr(g, x + w * 0.05, y + h * 0.92, w * 0.68, h * 0.055, h * 0.027); g.fill(); circle(g, x + w * 0.86, y + h * 0.947, w * 0.07, '#4a78b8'); return; }
  if (kind === 'call') { const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, '#2a3a5a'); gr.addColorStop(1, '#141a2a'); g.fillStyle = gr; g.fillRect(x, y, w, h);
    for (let k = 0; k < 3; k++) { const p = (t * 0.8 + k / 3) % 1; g.strokeStyle = alpha('#8fd0ff', 0.5 * (1 - p)); g.lineWidth = 3; g.beginPath(); g.arc(cx, y + h * 0.33, w * (0.2 + p * 0.25), 0, 7); g.stroke(); }
    avatar(g, cx, y + h * 0.33, w * 0.2, o.cast || HERO, o.avatarBg || '#ffd08a'); T(g, o.name || 'Dad', cx, y + h * 0.53, w * 0.1, '#ffffff'); T(g, o.sub || 'calling...', cx, y + h * 0.59, w * 0.06, 'rgba(255,255,255,.7)', { weight: 600 });
    for (const [dx, col, rot] of [[-0.22, '#e0302a', 2.36], [0.22, '#2fbf6a', 0]]) { circle(g, cx + dx * w, y + h * 0.84, w * 0.1, col); g.save(); g.translate(cx + dx * w, y + h * 0.84); g.rotate(rot); g.fillStyle = '#fff'; rr(g, -w * 0.05, -w * 0.018, w * 0.1, w * 0.036, w * 0.018); g.fill(); g.restore(); } return; }
  wall();
}

// ================= UI / SCREENS (centre anchor) =================
// phone ~150x300. o: {screen, color, ...screen options (name, cast, msgs, typing, note, time)}
def('phone', (g, o, t) => { const w = 150, h = 300; R(g, -w / 2, -h / 2, w, h, 26, o.color || '#1e1c26', 5); g.save(); rr(g, -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, 19); g.clip(); screen(g, o.screen || 'lock', -w / 2 + 8, -h / 2 + 8, w - 16, h - 16, o, t); g.restore();
  g.fillStyle = '#1e1c26'; rr(g, -18, -h / 2 + 12, 36, 9, 5); g.fill(); shine(g, -w / 2 + 4, -h / 2 + 30, 4, 60, 0.25); });
// phone held in two hands, seen by the holder (POV). ~420 wide. o = phone options + {skin, sleeve}
def('handPhone', (g, o, t) => { const skin = o.skin || HERO.skin, sl = o.sleeve || HERO.top;
  for (const d of [-1, 1]) EL(g, d * 150, 330, 80, 140, sl, 5, d * -0.35);
  for (const d of [-1, 1]) { g.save(); g.scale(d, 1); EL(g, 104, 150, 58, 92, skin, 5, -0.2); for (let k = 0; k < 3; k++) EL(g, 110 + k * 2, 20 + k * 40, 24, 17, skin, 4, 0.1); g.restore(); }
  D.phone(g, 0, 0, 1.25, { ...o, a: null, rot: 0, flip: false, t });
  for (const d of [-1, 1]) { g.save(); g.scale(d, 1); EL(g, 96, 92, 19, 44, skin, 5, 0.45); g.restore(); } });
// chat bubble. o: {text, side:'left'|'right', typing, color}. width fits the text (~min 120)
def('chatBubble', (g, o, t) => { const me = o.side === 'right', col = o.color || (me ? '#4a78b8' : '#ffffff'), fsz = 34, w = o.typing ? 130 : Math.max(120, measure(g, o.text || 'Hey!', fsz) + 56), h = 76;
  g.beginPath(); rr(g, -w / 2, -h / 2, w, h, 32); fs(g, col); g.beginPath(); const tx = me ? w / 2 - 34 : -w / 2 + 34; g.moveTo(tx - 12, h / 2 - 4); g.lineTo(tx + (me ? 24 : -24), h / 2 + 20); g.lineTo(tx + 14, h / 2 - 4); fs(g, col, 0);
  g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(tx - 12, h / 2); g.lineTo(tx + (me ? 24 : -24), h / 2 + 20); g.lineTo(tx + 14, h / 2); g.stroke();
  if (o.typing) for (let d = 0; d < 3; d++) circle(g, -32 + d * 32, 0, 10 * (0.7 + 0.3 * Math.abs(Math.sin(t * 6 - d))), me ? '#ffffff' : '#4a78b8'); else T(g, o.text || 'Hey!', 0, 2, fsz, me ? '#ffffff' : INK); });
// comment card (avatar, name bar, text). ~520x150. o: {name, text, cast, likes}
def('comment', (g, o) => { const w = 520, h = 150; R(g, -w / 2, -h / 2, w, h, 26, '#ffffff', 5); avatar(g, -w / 2 + 62, -8, 38, o.cast || HERO, o.avatarBg || '#ffd08a');
  T(g, o.name || '@viewer', -w / 2 + 120, -36, 28, '#6a6a7a', { align: 'left', weight: 600 }); T(g, o.text || 'This made me call my dad', -w / 2 + 120, 6, 30, INK, { align: 'left', weight: 600 });
  D.heart(g, -w / 2 + 134, 46, 0.18, { fill: o.liked ? '#ff4a6a' : '#c8ccd4' }); T(g, o.likes ?? '12', -w / 2 + 160, 47, 24, '#6a6a7a', { align: 'left', weight: 600 }); });
// notification toast card. ~560x120. o: {title, text, color}
def('toast', (g, o) => { const w = 560, h = 120; g.fillStyle = 'rgba(0,0,0,.18)'; rr(g, -w / 2 + 6, -h / 2 + 10, w, h, 28); g.fill(); R(g, -w / 2, -h / 2, w, h, 28, 'rgba(255,255,255,.97)', 4);
  R(g, -w / 2 + 22, -30, 60, 60, 16, o.color || '#2fbf6a', 0); T(g, o.icon || '✓', -w / 2 + 52, 1, 34, '#ffffff'); T(g, o.title || 'Reminder', -w / 2 + 104, -20, 30, INK, { align: 'left' }); T(g, o.text || 'Call Dad back', -w / 2 + 104, 20, 26, '#5a5a6a', { align: 'left', weight: 600 }); });
// round send button with a paper-plane arrow. r 60. o.pressed 0..1
def('sendButton', (g, o) => { const k = 1 - 0.12 * (o.pressed || 0); g.scale(k, k); C(g, 0, 0, 60, o.color || '#4a78b8'); shine(g, -34, -44, 40, 12, 0.3); PATH(g, [[-28, -6], [30, -26], [8, 30], [0, 6]], '#ffffff', 0); PATH(g, [[0, 6], [30, -26]], null, 4, false); });
// heart ~ 200 wide. o: {fill, pop:0..1 (bounce in), beat (uses t)}
def('heart', (g, o, t) => { const k = (o.pop != null ? ease.outBack(Math.min(1, o.pop)) : 1) * (o.beat ? 1 + 0.06 * Math.max(0, Math.sin(t * 8)) : 1); g.scale(k, k); const f = o.fill || '#ff4a6a';
  g.beginPath(); g.moveTo(0, 80); g.bezierCurveTo(-120, 0, -100, -95, -50, -95); g.bezierCurveTo(-20, -95, -4, -75, 0, -55); g.bezierCurveTo(4, -75, 20, -95, 50, -95); g.bezierCurveTo(100, -95, 120, 0, 0, 80); fs(g, f); shine(g, -70, -70, 34, 18, 0.55); });
// thumbs-up ~ 180 tall
def('thumbsUp', (g, o) => { const sk = o.skin || '#f6d6bd'; R(g, -70, 10, 46, 90, 12, o.cuff || '#4a78b8'); R(g, -30, -6, 110, 110, 30, sk);
  for (let i = 0; i < 3; i++) { g.strokeStyle = alpha(INK, 0.5); g.lineWidth = 4; g.beginPath(); g.moveTo(40, 22 + i * 26); g.lineTo(78, 22 + i * 26); g.stroke(); }
  g.beginPath(); g.moveTo(-26, 8); g.quadraticCurveTo(-30, -80, 10, -96); g.quadraticCurveTo(36, -100, 30, -60); g.quadraticCurveTo(26, -30, 40, -6); fs(g, sk); });
// tick / cross in a circle, r 70. o.pop 0..1
def('tick', (g, o) => { const k = o.pop != null ? ease.outBack(Math.min(1, o.pop)) : 1; g.scale(k, k); C(g, 0, 0, 70, o.color || '#2fbf6a'); shine(g, -40, -52, 44, 14, 0.3); seg(g, [[-32, 2], [-8, 26], [36, -24]], 16, '#ffffff'); });
def('cross', (g, o) => { const k = o.pop != null ? ease.outBack(Math.min(1, o.pop)) : 1; g.scale(k, k); C(g, 0, 0, 70, o.color || '#e0302a'); shine(g, -40, -52, 44, 14, 0.3); seg(g, [[-26, -26], [26, 26]], 16, '#ffffff'); seg(g, [[26, -26], [-26, 26]], 16, '#ffffff'); });
// battery ~ 200x100. o: {level 0..1, charging}
def('battery', (g, o, t) => { const lv = o.level ?? 0.7, col = lv < 0.2 ? '#ff4a3a' : lv < 0.5 ? '#ffb020' : '#2fbf6a'; R(g, -100, -50, 190, 100, 18, '#ffffff'); R(g, 92, -20, 16, 40, 6, INK, 0);
  if (lv > 0.01 && (lv > 0.12 || Math.sin(t * 6) > -0.2)) { g.fillStyle = col; rr(g, -88, -38, 166 * lv, 76, 10); g.fill(); }
  if (o.charging) PATH(g, [[8, -44], [-26, 6], [0, 6], [-10, 44], [28, -8], [2, -8]], '#ffd020', 4); });
// notification bell ~ 160. o.ring (shakes with t), o.count
def('bell', (g, o, t) => { if (o.ring) g.rotate(Math.sin(t * 22) * 0.18); g.beginPath(); g.moveTo(-60, 50); g.quadraticCurveTo(-50, 30, -50, -10); g.quadraticCurveTo(-50, -66, 0, -68); g.quadraticCurveTo(50, -66, 50, -10); g.quadraticCurveTo(50, 30, 60, 50); g.closePath(); fs(g, o.color || '#ffc83a');
  C(g, 0, 62, 14, '#ffc83a'); C(g, 0, -74, 10, '#ffc83a'); shine(g, -36, -40, 12, 44, 0.45); if (o.count) { C(g, 46, -54, 26, '#e0302a', 4); T(g, o.count, 46, -52, 30, '#ffffff'); } });
// envelope ~ 240x160. o.open 0..1 (flap opens, a letter rises)
def('envelope', (g, o) => { const k = o.open || 0, w = 240, h = 160; if (k > 0) { R(g, -w / 2 + 20, -h / 2 + 10 - 90 * k, w - 40, h - 20, 8, '#ffffff', 4); for (let i = 0; i < 3; i++) seg(g, [[-80, -60 - 90 * k + i * 26 + 40], [60 - i * 20, -60 - 90 * k + i * 26 + 40]], 5, '#c8ccd4'); }
  R(g, -w / 2, -h / 2, w, h, 10, o.color || '#f4ead4'); PATH(g, [[-w / 2, h / 2], [0, 0], [w / 2, h / 2]], null, 4, false); PATH(g, [[-w / 2, -h / 2], [0, lerp(15, -h / 2 - 70, k)], [w / 2, -h / 2]], shade(o.color || '#f4ead4', -0.06), 5); });
// tear-off calendar page ~ 200x220. o: {day, month}
def('calendar', (g, o) => { R(g, -100, -100, 200, 210, 22, '#ffffff'); g.save(); rr(g, -100, -100, 200, 210, 22); g.clip(); g.fillStyle = o.color || '#e0302a'; g.fillRect(-100, -100, 200, 62); g.restore(); g.strokeStyle = INK; g.lineWidth = 5; rr(g, -100, -100, 200, 210, 22); g.stroke();
  for (const x of [-50, 50]) R(g, x - 9, -120, 18, 40, 9, '#c8ccd4', 4); T(g, o.month || 'MON', 0, -66, 36, '#ffffff'); T(g, o.day ?? 7, 0, 38, 100, INK); });
// analog clock icon r 100. o: {h, m} (or o.spin with t)
def('clock', (g, o, t) => { C(g, 0, 0, 100, '#ffffff', 7); g.strokeStyle = o.rim || '#e0562f'; g.lineWidth = 12; g.beginPath(); g.arc(0, 0, 92, 0, 7); g.stroke();
  for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; seg(g, [[Math.sin(a) * 66, -Math.cos(a) * 66], [Math.sin(a) * (i % 3 ? 74 : 78), -Math.cos(a) * (i % 3 ? 74 : 78)]], i % 3 ? 4 : 7, INK); }
  const m = o.spin ? t * 360 : (o.m ?? 10), h = o.spin ? t * 30 : (o.h ?? 10) + m / 60; seg(g, [[0, 0], [Math.sin(h / 12 * 6.283) * 40, -Math.cos(h / 12 * 6.283) * 40]], 10, INK); seg(g, [[0, 0], [Math.sin(m / 60 * 6.283) * 60, -Math.cos(m / 60 * 6.283) * 60]], 6, INK); C(g, 0, 0, 8, o.rim || '#e0562f', 0); });
// route map card: n stops on a line, progress lit up to o.at (float), last stop labelled. ~ w x 260. o: {n, at, w, label, color}
def('routeMap', (g, o, t) => { const n = o.n || 11, w = o.w || 1200, at = o.at ?? 0, col = o.color || '#2f8a57', x0 = -w / 2 + 70, x1 = w / 2 - 70; R(g, -w / 2, -130, w, 260, 32, '#ffffff', 6);
  seg(g, [[x0, 20], [x1, 20]], 20, '#bfe2da'); if (at > 0) seg(g, [[x0, 20], [lerp(x0, x1, Math.min(at, n) / n), 20]], 20, col);
  for (let i = 0; i <= n; i++) { const x = lerp(x0, x1, i / n), on = i <= at, end = i === n, r = end ? 30 : 18; C(g, x, 20, r, '#ffffff', 7); if (on) C(g, x, 20, r * 0.55, col, 0); if (i === Math.floor(at) && !end) glow(g, x, 20, 80, col, 0.4 + 0.2 * Math.sin(t * 8)); }
  T(g, o.label || 'CENTRAL', x1 - 10, -92, 44, INK); D.pin(g, x1, -14, 0.32, { color: '#e0302a' }); });
// map pin ~ 120 tall (anchor = tip at bottom)
def('pin', (g, o) => { g.beginPath(); g.moveTo(0, 0); g.bezierCurveTo(-30, -50, -60, -80, -60, -120); g.arc(0, -120, 60, Math.PI, 0); g.bezierCurveTo(60, -80, 30, -50, 0, 0); fs(g, o.color || '#e0302a', 6); C(g, 0, -120, 24, '#ffffff', 5); });
// progress bar ~ w x 50. o: {k 0..1, color, w}
def('progressBar', (g, o) => { const w = o.w || 600, k = Math.max(0, Math.min(1, o.k ?? 0.6)); R(g, -w / 2, -25, w, 50, 25, '#e8e4dc'); if (k > 0) { g.fillStyle = o.color || '#2fbf6a'; rr(g, -w / 2 + 7, -18, (w - 14) * k, 36, 18); g.fill(); shine(g, -w / 2 + 16, -14, Math.max(0, (w - 40) * k), 8, 0.35); } });
// "+1" block (little 3D cube). ~ 140. o: {text, color}
def('plusBlock', (g, o) => { const c = o.color || '#5fd89a', s2 = 110; PATH(g, [[-s2 / 2, -s2 / 2], [-s2 / 2 + 24, -s2 / 2 - 22], [s2 / 2 + 24, -s2 / 2 - 22], [s2 / 2, -s2 / 2]], shade(c, 0.3)); PATH(g, [[s2 / 2, -s2 / 2], [s2 / 2 + 24, -s2 / 2 - 22], [s2 / 2 + 24, s2 / 2 - 22], [s2 / 2, s2 / 2]], shade(c, -0.25));
  R(g, -s2 / 2, -s2 / 2, s2, s2, 8, c); T(g, o.text || '+1', 0, 2, 52, '#ffffff', { stroke: 6, strokeColor: shade(c, -0.45) }); });
// gold coin r 70. o.spin (uses t) flips it
def('coin', (g, o, t) => { const k = o.spin ? Math.cos(t * 6) : 1; g.scale(Math.max(0.08, Math.abs(k)), 1); C(g, 0, 0, 70, '#ffc83a', 6); C(g, 0, 0, 52, '#ffd866', 4); star5(g, 0, 0, 30, 13, '#f0a818', 4); shine(g, -44, -40, 26, 12, 0.5); });
def('cash', (g, o) => { R(g, -120, -60, 240, 120, 10, '#8fd48a'); R(g, -104, -46, 208, 92, 6, null, 3); C(g, 0, 0, 34, '#b8e8b0', 4); T(g, o.text || '10', 0, 2, 38, '#2f7a3a'); for (const x of [-80, 80]) T(g, o.text || '10', x, -26, 20, '#2f7a3a'); });
// gift box ~ 200. o.open 0..1 lifts the lid
def('gift', (g, o) => { const c = o.color || '#e0562f', rb = o.ribbon || '#ffd03a', k = o.open || 0; R(g, -90, -60, 180, 140, 10, c); g.fillStyle = rb; g.fillRect(-14, -60, 28, 140); g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(-14, -60, 28, 140);
  g.save(); g.translate(0, -60 - 70 * k); g.rotate(-0.4 * k); R(g, -104, -36, 208, 40, 10, shade(c, 0.1)); g.fillStyle = rb; g.fillRect(-14, -36, 28, 40); EL(g, -30, -52, 32, 18, rb, 4, 0.4); EL(g, 30, -52, 32, 18, rb, 4, -0.4); C(g, 0, -46, 14, rb, 4); g.restore(); });
def('trophy', (g, o) => { const c = o.color || '#ffc83a'; R(g, -60, 70, 120, 30, 6, '#7a4e34'); R(g, -16, 30, 32, 44, 4, c); for (const d of [-1, 1]) { g.beginPath(); g.arc(d * 72, -44, 32, d > 0 ? -Math.PI / 2 : Math.PI / 2, d > 0 ? Math.PI / 2 : Math.PI * 1.5); g.strokeStyle = INK; g.lineWidth = 18; g.stroke(); g.strokeStyle = c; g.lineWidth = 9; g.stroke(); }
  g.beginPath(); g.moveTo(-74, -90); g.lineTo(74, -90); g.quadraticCurveTo(70, 30, 0, 36); g.quadraticCurveTo(-70, 30, -74, -90); fs(g, c); shine(g, -50, -76, 14, 70, 0.5); star5(g, 0, -34, 26, 11, shade(c, 0.4), 3); });
def('star', (g, o, t) => { const k = o.pop != null ? ease.outBack(Math.min(1, o.pop)) : 1; g.scale(k, k); if (o.glow) glow(g, 0, 0, 160, o.color || '#ffd03a', 0.4); star5(g, 0, 0, 90, 40, o.color || '#ffd03a', 6); shine(g, -30, -40, 30, 12, 0.5); });
// light bulb ~ 220 tall (anchor centre of glass). o.on 0..1
def('bulb', (g, o) => { const on = o.on ?? 1; if (on > 0) glow(g, 0, -10, 220, '#ffe28a', 0.6 * on); g.beginPath(); g.arc(0, -20, 70, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(28, 70); g.lineTo(-28, 70); g.closePath(); fs(g, on > 0.3 ? '#fff2a0' : '#e8eef0');
  shine(g, -46, -56, 18, 50, 0.6); for (let i = 0; i < 3; i++) R(g, -30, 70 + i * 16, 60, 16, 6, '#b8bec8', 4); seg(g, [[-14, 40], [-14, 0], [0, -14], [14, 0], [14, 40]], 5, on > 0.3 ? '#ff9a2a' : '#9aa4ae'); });
// magic wand ~ 260 long (anchor = handle end). o.k 0..1 sparkle burst at the tip
def('wand', (g, o, t) => { g.rotate(-0.7); R(g, -8, -230, 16, 230, 8, '#2a2230'); R(g, -9, -48, 18, 48, 6, '#ffffff', 4); star5(g, 0, -248, 36, 15, '#ffd03a', 5);
  const k = o.k || 0; if (k > 0) for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + t, r = 40 + 80 * ease.out(k); star5(g, Math.cos(a) * r, -248 + Math.sin(a) * r, 12 * (1 - k * 0.6), 5, '#fff3a0', 0); } });
// paper plane ~ 220 (nose to +x). o.trail (dashed line behind)
def('paperPlane', (g, o) => { if (o.trail) { g.setLineDash([14, 14]); seg(g, [[-120, 30], [-260, 60], [-380, 20]], 5, alpha('#ffffff', 0.8)); g.setLineDash([]); }
  PATH(g, [[110, 0], [-110, -60], [-40, 10]], '#ffffff'); PATH(g, [[110, 0], [-40, 10], [-60, 60]], '#dfe6f0'); PATH(g, [[110, 0], [-40, 10], [-110, -60]], null, 4, false); });
def('key', (g, o) => { const c = o.color || '#ffc83a'; g.beginPath(); g.arc(-70, 0, 46, 0, 7); g.moveTo(-50, 0); g.arc(-70, 0, 18, 0, 7, true); fs(g, c); R(g, -26, -12, 140, 24, 8, c); R(g, 76, 10, 16, 34, 4, c); R(g, 46, 10, 16, 24, 4, c); });
def('padlock', (g, o) => { const op = o.open ? 1 : 0; g.strokeStyle = INK; g.lineWidth = 30; g.beginPath(); g.arc(0, -40 - 30 * op, 52, Math.PI, 0); g.lineTo(52, -40 - 30 * op + (op ? -10 : 0)); g.stroke(); g.strokeStyle = '#b8bec8'; g.lineWidth = 18; g.stroke();
  R(g, -80, -40, 160, 130, 20, o.color || '#ffc83a'); C(g, 0, 10, 16, INK, 0); R(g, -6, 10, 12, 40, 4, INK, 0); });
// thought cloud with text ~ 420x220 (+ trail of small puffs toward o.tail [dx,dy])
def('thought', (g, o) => { const w = o.w || 420, h = 200; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.moveTo(Math.cos(a) * w * 0.42 + 46, Math.sin(a) * h * 0.38); g.arc(Math.cos(a) * w * 0.42, Math.sin(a) * h * 0.38, 46, 0, 7); } fs(g, '#ffffff');
  g.beginPath(); g.ellipse(0, 0, w * 0.44, h * 0.4, 0, 0, 7); g.fillStyle = '#ffffff'; g.fill(); const [dx, dy] = o.tail || [-0.35, 0.9]; for (let i = 1; i <= 3; i++) C(g, dx * w * 0.42 * (1 + i * 0.15), dy * h * 0.5 * (1 + i * 0.25), 22 - i * 5, '#ffffff', 4);
  if (o.text) T(g, o.text, 0, 2, o.size || 44, INK); });
// big ? or ! mark in a burst. o.ch '?' | '!'
def('mark', (g, o, t) => { const c = o.color || (o.ch === '!' ? '#ff5a3a' : '#4a78b8'); const p = []; for (let i = 0; i < 24; i++) { const a = i * Math.PI / 12, r = i % 2 ? 70 : 90; p.push([Math.cos(a) * r, Math.sin(a) * r]); } PATH(g, p, c); T(g, o.ch || '?', 0, 6, 110, '#ffffff', { stroke: 8, strokeColor: INK }); });
// curved arrow ~ len 300 (from anchor to the right). o: {len, bend, color}
def('arrow', (g, o) => { const L = o.len || 300, b = o.bend ?? -80, c = o.color || '#ffd03a'; g.lineCap = 'round'; g.strokeStyle = INK; g.lineWidth = 30; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(L / 2, b, L - 40, 0); g.stroke(); g.strokeStyle = c; g.lineWidth = 18; g.stroke();
  const a = Math.atan2(-b, L / 2); g.save(); g.translate(L - 40, 0); g.rotate(a * 0.9); PATH(g, [[50, 0], [-10, -36], [-10, 36]], c, 6); g.restore(); });
// sign board on a post ~ 300 wide (bottom anchor). o: {text, color}
def('sign', (g, o) => { R(g, -10, -260, 20, 260, 6, '#7a4e34'); R(g, -150, -330, 300, 120, 18, o.color || '#2f8a57'); R(g, -136, -316, 272, 92, 12, null, 3); T(g, o.text || 'CENTRAL', 0, -270, o.size || 50, '#ffffff'); });
def('priceTag', (g, o) => { PATH(g, [[-110, -50], [70, -50], [120, 0], [70, 50], [-110, 50]], o.color || '#ffd03a'); C(g, 72, 0, 12, '#ffffff', 4); T(g, o.text || '$9.99', -26, 3, 46, INK); });
def('receipt', (g, o) => { const n = o.lines || 5, h = 80 + n * 34; const p = [[-90, -h / 2]]; for (let i = 0; i <= 9; i++) p.push([-90 + i * 20, -h / 2 + (i % 2 ? 0 : 0)]); p.push([90, -h / 2]); for (let i = 0; i <= 9; i++) p.push([90 - i * 20, h / 2 - (i % 2 ? 14 : 0)]); PATH(g, p, '#ffffff', 4);
  for (let i = 0; i < n; i++) { seg(g, [[-66, -h / 2 + 40 + i * 34], [10 - (i % 3) * 14, -h / 2 + 40 + i * 34]], 6, '#c8ccd4'); seg(g, [[40, -h / 2 + 40 + i * 34], [66, -h / 2 + 40 + i * 34]], 6, '#9aa4ae'); } });

// ================= OBJECTS (bottom-centre anchor) =================
// mug ~ 110 tall. o: {color, steam 0..1}
def('mug', (g, o, t) => { const c = o.color || '#e0562f'; g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.ellipse(48, -56, 26, 30, 0, -1.5, 1.5); g.stroke(); g.strokeStyle = c; g.lineWidth = 8; g.stroke();
  g.beginPath(); g.moveTo(-50, -110); g.lineTo(50, -110); g.lineTo(46, -6); g.quadraticCurveTo(46, 0, 38, 0); g.lineTo(-38, 0); g.quadraticCurveTo(-46, 0, -46, -6); g.closePath(); fs(g, c); band(g, () => rr(g, -50, -110, 100, 110, 6), 18, -110, 40, 110); shine(g, -36, -96, 12, 60, 0.4);
  EL(g, 0, -110, 50, 11, shade(c, -0.15), 5); EL(g, 0, -108, 42, 7, o.drink || '#6a3a22', 0);
  for (let i = 0; i < 2 && (o.steam || 0) > 0; i++) { g.strokeStyle = alpha('#ffffff', 0.5 * o.steam); g.lineWidth = 6; g.beginPath(); for (let k = 0; k <= 10; k++) { const yy = -126 - k * 9, xx = (i ? 14 : -14) + Math.sin(t * 3 + k * 0.6 + i) * 8; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } });
def('glass', (g, o) => { const f = o.fill ?? 0.7; g.beginPath(); g.moveTo(-44, -150); g.lineTo(44, -150); g.lineTo(36, 0); g.lineTo(-36, 0); g.closePath(); g.fillStyle = 'rgba(220,240,255,.45)'; g.fill();
  if (f > 0) { const y = -150 * f * 0.92; g.beginPath(); g.moveTo(lerp(-36, -44, f * 0.92), y); g.lineTo(lerp(36, 44, f * 0.92), y); g.lineTo(36, -4); g.lineTo(-36, -4); g.closePath(); g.fillStyle = 'rgba(120,200,255,.75)'; g.fill(); EL(g, 0, y, lerp(36, 44, f * 0.92), 6, 'rgba(180,230,255,.9)', 0); }
  g.beginPath(); g.moveTo(-44, -150); g.lineTo(44, -150); g.lineTo(36, 0); g.lineTo(-36, 0); g.closePath(); fs(g, null, 5); shine(g, -30, -130, 8, 110, 0.6); });
def('bottle', (g, o) => { const c = o.color || '#9fd8f0'; g.beginPath(); g.moveTo(-40, 0); g.lineTo(-40, -150); g.quadraticCurveTo(-40, -186, -18, -200); g.lineTo(-18, -214); g.lineTo(18, -214); g.lineTo(18, -200); g.quadraticCurveTo(40, -186, 40, -150); g.lineTo(40, 0); g.closePath(); fs(g, c);
  R(g, -22, -244, 44, 32, 8, o.cap || '#2f6aa8'); R(g, -41, -120, 82, 50, 0, o.label || '#4a78b8', 4); T(g, '~', 0, -96, 40, '#ffffff'); shine(g, -30, -170, 10, 140, 0.5); });
// book (closed, standing, cover to camera) ~ 140x190. o: {color, title}
def('book', (g, o) => { const c = o.color || '#4a78b8'; R(g, -64, -190, 140, 190, 10, '#f4ecd8'); R(g, -72, -194, 136, 190, 10, c); g.fillStyle = shade(c, -0.25); g.fillRect(-72, -194, 18, 190); g.strokeStyle = INK; g.lineWidth = 5; rr(g, -72, -194, 136, 190, 10); g.stroke();
  R(g, -40, -160, 90, 40, 6, shade(c, 0.35), 3); if (o.title) T(g, o.title, 5, -139, 22, INK); });
def('bookStack', (g, o) => { const cols = o.colors || ['#c0563a', '#2f8a57', '#e0b05a', '#4a78b8']; let y = 0; cols.forEach((c, i) => { const h = 30 + (i % 2) * 10, w = 200 - (i % 3) * 16, dx = [0, 10, -8, 6][i % 4]; R(g, dx - w / 2, y - h, w, h, 6, c); g.fillStyle = '#f4ecd8'; g.fillRect(dx + w / 2 - 22, y - h + 6, 16, h - 12); seg(g, [[dx - w / 2 + 14, y - h / 2], [dx - w / 2 + 60, y - h / 2]], 4, shade(c, 0.4)); y -= h; }); });
// open notebook with a pen, seen from above ~ 360x240 (centre anchor). o.k 0..1 written lines
def('notebook', (g, o) => { R(g, -180, -120, 360, 240, 14, o.cover || '#2f5286'); for (const d of [-1, 1]) R(g, d > 0 ? 4 : -172, -110, 168, 220, 8, '#ffffff', 4); seg(g, [[0, -112], [0, 112]], 4, alpha(INK, 0.5));
  const k = o.k ?? 0.6, n = 7; for (let i = 0; i < n; i++) { seg(g, [[-160, -80 + i * 28], [-14, -80 + i * 28]], 2, '#cfe0f0'); seg(g, [[14, -80 + i * 28], [160, -80 + i * 28]], 2, '#cfe0f0'); if (i / n < k) seg(g, [[-150, -88 + i * 28], [-150 + 120 * Math.min(1, (k - i / n) * n), -88 + i * 28]], 4, '#4a4a6a'); }
  g.save(); g.translate(110, 40); g.rotate(-0.7); R(g, -8, -100, 16, 120, 6, '#e0562f'); PATH(g, [[-8, 20], [8, 20], [0, 40]], '#f4dcb0', 3); g.restore(); });
// laptop 3/4 front ~ 340 wide. o: {on, screen fn}
def('laptop', (g, o, t) => { PATH(g, [[-170, 0], [170, 0], [140, -36], [-140, -36]], '#c4c9d2'); g.fillStyle = '#9aa0aa'; for (let r2 = 0; r2 < 2; r2++) for (let c2 = 0; c2 < 10; c2++) g.fillRect(-120 + c2 * 24 + r2 * 4, -30 + r2 * 12, 18, 7);
  R(g, -140, -230, 280, 196, 14, '#b8bec8'); g.save(); rr(g, -126, -218, 252, 168, 6); g.clip(); if (o.on === false) screen(g, 'off', -126, -218, 252, 168); else if (typeof o.screen === 'function') o.screen(g, -126, -218, 252, 168); else { g.fillStyle = '#e8eef8'; g.fillRect(-126, -218, 252, 168); g.fillStyle = '#4a78b8'; g.fillRect(-126, -218, 252, 18);
    g.fillStyle = '#c8d4e8'; for (let i = 0; i < 6; i++) g.fillRect(-110, -186 + i * 20, 80 + (i * 37) % 70, 8); g.fillStyle = '#8dc8a0'; g.fillRect(40, -188, 70, 56); g.fillStyle = '#ffd08a'; g.fillRect(40, -124, 70, 56); } g.restore(); if (o.on !== false) glow(g, 0, -140, 260, '#9fc8ff', 0.15); });
def('tv', (g, o) => { R(g, -60, -24, 120, 24, 6, '#2a2a33'); R(g, -8, -50, 16, 30, 3, '#2a2a33'); R(g, -230, -330, 460, 284, 16, '#1b1a22'); g.save(); rr(g, -214, -314, 428, 252, 6); g.clip(); if (o.on === false) screen(g, 'off', -214, -314, 428, 252); else if (typeof o.screen === 'function') o.screen(g, -214, -314, 428, 252);
  else { const gr = g.createLinearGradient(-214, -314, 214, -62); gr.addColorStop(0, '#3a6a9a'); gr.addColorStop(1, '#e8a87a'); g.fillStyle = gr; g.fillRect(-214, -314, 428, 252); PATH(g, [[-24, -230], [36, -188], [-24, -146]], '#ffffff', 0); } g.restore(); });
def('alarmClock', (g, o, t) => { const sh2 = o.ring ? Math.sin(t * 40) * 0.08 : 0; g.rotate(sh2); for (const d of [-1, 1]) { R(g, d * 50 - 8, -24, 16, 26, 6, INK, 0); C(g, d * 52, -168, 30, o.color || '#e0302a'); } R(g, -6, -196, 12, 20, 4, INK, 0);
  C(g, 0, -100, 84, o.color || '#e0302a'); D.clock(g, 0, -100, 0.66, { h: o.h ?? 7, m: o.m ?? 0, rim: o.color || '#e0302a' }); if (o.ring) for (const d of [-1, 1]) for (let i = 0; i < 3; i++) seg(g, [[d * (110 + i * 4), -200 + i * 30], [d * (136 + i * 4), -214 + i * 30]], 6, INK); });
// potted plant ~ 260 tall. o: {kind:'leafy'|'tall'|'round', pot}
def('plant', (g, o, t) => { const pot = o.pot || '#c4643a', kind = o.kind || 'leafy', sway = Math.sin(t * 1.5) * 0.04, lc = ['#4f9a55', '#5fae5f', '#3f8a4a'];
  g.save(); g.translate(0, -96); g.rotate(sway); if (kind === 'round') { for (const [x, y, r, i] of [[-30, -60, 54, 0], [34, -56, 50, 1], [0, -104, 56, 2]]) C(g, x, y, r, lc[i]); }
  else { const n = kind === 'tall' ? 7 : 9; for (let i = 0; i < n; i++) { const a = -Math.PI / 2 + (i - (n - 1) / 2) * (kind === 'tall' ? 0.16 : 0.32), L = kind === 'tall' ? 220 - Math.abs(i - 3) * 22 : 130 + (i % 3) * 20;
    g.save(); g.rotate(a + Math.PI / 2); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(kind === 'tall' ? 22 : 46, -L * 0.5, 0, -L); g.quadraticCurveTo(kind === 'tall' ? -22 : -46, -L * 0.5, 0, 0); fs(g, lc[i % 3], 4); seg(g, [[0, -6], [0, -L * 0.8]], 3, alpha('#ffffff', 0.3)); g.restore(); } }
  g.restore(); g.beginPath(); g.moveTo(-70, -100); g.lineTo(70, -100); g.lineTo(54, 0); g.lineTo(-54, 0); g.closePath(); fs(g, pot); R(g, -80, -116, 160, 26, 8, shade(pot, 0.12)); band(g, () => { g.beginPath(); g.moveTo(-70, -100); g.lineTo(70, -100); g.lineTo(54, 0); g.lineTo(-54, 0); g.closePath(); }, 20, -100, 60, 100); });
def('deskLamp', (g, o) => { const c = o.color || '#2f5286', on = o.on ?? 1; EL(g, 0, -10, 80, 16, c); seg(g, [[0, -14], [-50, -140], [40, -220]], 22, INK); seg(g, [[0, -14], [-50, -140], [40, -220]], 12, c); C(g, -50, -140, 14, c, 4);
  g.save(); g.translate(40, -220); g.rotate(0.6); if (on > 0) { g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, 0, 0, 260); gr.addColorStop(0, alpha('#ffe2a8', 0.5 * on)); gr.addColorStop(1, alpha('#ffe2a8', 0)); g.fillStyle = gr; g.beginPath(); g.moveTo(-40, 20); g.lineTo(40, 20); g.lineTo(150, 260); g.lineTo(-150, 260); g.fill(); g.globalCompositeOperation = 'source-over'; }
  g.beginPath(); g.moveTo(-60, 30); g.quadraticCurveTo(-56, -50, 0, -50); g.quadraticCurveTo(56, -50, 60, 30); g.closePath(); fs(g, c); if (on > 0) EL(g, 0, 30, 34, 10, '#fff4c0', 0); g.restore(); });
def('backpack', (g, o) => { const c = o.color || '#3a5a8a'; g.strokeStyle = INK; g.lineWidth = 16; g.beginPath(); g.arc(0, -210, 34, Math.PI, 0); g.stroke(); g.strokeStyle = shade(c, -0.2); g.lineWidth = 8; g.stroke();
  R(g, -100, -220, 200, 220, 50, c); R(g, -70, -100, 140, 84, 24, shade(c, -0.12)); seg(g, [[-60, -78], [60, -78]], 5, '#ffd03a'); band(g, () => rr(g, -100, -220, 200, 220, 50), 40, -220, 60, 220); shine(g, -80, -190, 14, 70, 0.3); });
// sneaker side view, toe to +x, ~ 260 long. o: {color, sole, accent}
def('sneaker', (g, o) => { const up = o.color || '#f4f4f4', ac = o.accent || '#e0562f'; g.beginPath(); g.moveTo(-120, -12); g.lineTo(-124, -80); g.quadraticCurveTo(-110, -100, -70, -96); g.lineTo(-30, -96); g.quadraticCurveTo(10, -70, 70, -60); g.quadraticCurveTo(130, -50, 130, -14); g.closePath(); fs(g, up);
  PATH(g, [[-128, 0], [136, 0], [136, -22], [-128, -22]], o.sole || '#ffffff'); seg(g, [[-126, -10], [134, -10]], 4, alpha(INK, 0.35)); R(g, -126, -84, 40, 64, 14, ac, 4);
  g.beginPath(); g.moveTo(-60, -40); g.quadraticCurveTo(10, -30, 60, -70); fs(g, null, 9); g.strokeStyle = ac; g.lineWidth = 5; g.stroke(); for (let i = 0; i < 4; i++) seg(g, [[-22 + i * 18, -88 + i * 6], [-8 + i * 18, -74 + i * 6]], 6, INK); });
def('shoeBox', (g, o) => { const c = o.color || '#e0562f'; R(g, -150, -110, 300, 110, 8, c); R(g, -160, -130, 320, 36, 8, shade(c, 0.12)); R(g, -40, -76, 80, 40, 6, '#ffffff', 4); seg(g, [[-24, -56], [24, -56]], 5, alpha(INK, 0.5)); });
def('briefcase', (g, o) => { const c = o.color || '#6a4430'; R(g, -40, -200, 80, 36, 14, null, 10); R(g, -130, -176, 260, 176, 18, c); seg(g, [[-130, -110], [130, -110]], 5, INK); R(g, -20, -124, 40, 28, 5, '#ffc83a', 4); });
def('bag', (g, o) => { const c = o.color || '#e8c8a0'; g.strokeStyle = INK; g.lineWidth = 12; g.beginPath(); g.arc(0, -180, 40, Math.PI, 0); g.stroke(); PATH(g, [[-100, -180], [100, -180], [116, 0], [-116, 0]], c); R(g, -40, -120, 80, 60, 10, shade(c, 0.2), 4); });
// car side view, front to +x, ~ 440 long. o: {color, spin (uses t)}
def('car', (g, o, t) => { const c = o.color || '#4a78b8'; g.beginPath(); g.moveTo(-210, -40); g.lineTo(-216, -110); g.quadraticCurveTo(-210, -130, -170, -134); g.lineTo(-110, -136); g.quadraticCurveTo(-80, -210, -20, -212); g.lineTo(70, -212); g.quadraticCurveTo(110, -210, 140, -140); g.lineTo(196, -128); g.quadraticCurveTo(220, -120, 220, -80); g.lineTo(220, -40); g.closePath(); fs(g, c);
  PATH(g, [[-92, -142], [-52, -196], [-6, -196], [-6, -142]], '#9fd0f0', 4); PATH(g, [[8, -142], [8, -196], [64, -196], [112, -142]], '#9fd0f0', 4);
  band(g, () => { g.beginPath(); g.rect(-216, -110, 436, 70); }, -216, -80, 436, 40, 0.1); EL(g, 206, -100, 12, 16, '#fff4c0', 3); R(g, -220, -96, 14, 26, 4, '#ff5a4a', 3); seg(g, [[-30, -126], [-10, -126]], 5, INK); seg(g, [[60, -126], [80, -126]], 5, INK);
  for (const x of [-130, 130]) { C(g, x, -40, 48, '#2a2a33', 6); C(g, x, -40, 22, '#c8ccd4', 4); const a = -(o.spin ? t * 8 : 0); seg(g, [[x + Math.cos(a) * 18, -40 + Math.sin(a) * 18], [x - Math.cos(a) * 18, -40 - Math.sin(a) * 18]], 4, INK); } });
def('house', (g, o) => { const c = o.color || '#f4d0a0', rf = o.roof || '#c0563a'; R(g, -150, -200, 300, 200, 6, c); PATH(g, [[-180, -190], [0, -330], [180, -190]], rf); R(g, -30, -110, 60, 110, 6, '#7a4e34'); C(g, 18, -56, 5, '#ffc83a', 0);
  for (const x of [-100, 100]) { R(g, x - 34, -160, 68, 60, 4, o.lit ? '#ffe28a' : '#9fd0f0'); seg(g, [[x, -160], [x, -100]], 4, INK); seg(g, [[x - 34, -130], [x + 34, -130]], 4, INK); } R(g, 70, -310, 40, 70, 4, shade(rf, -0.2)); });
// older 2D props, now reachable from the same place (bike: ground anchor, ~200 long; cup: saucer anchor; umbrella: hand anchor)
D.bike = (g, x, y, s = 1, o = {}) => bike(g, x, y, s, o);
D.cup = (g, x, y, s = 1, o = {}) => cup(g, x, y, s, o.steam || 0, o.t || 0);
D.umbrella = (g, x, y, s = 1, o = {}) => umbrella(g, x, y, s, o.color, o.tilt || 0);
// delivery parcel ~300 wide (bottom centre). o: {w, h, color, glow 0..1 (light from the seams), label (text lines), open 0..1 (flaps), crack 0..1}
def('parcel', (g, o, t) => { const w = o.w || 300, h = o.h || 240, c = o.color || '#c88a55', gl = o.glow || 0, op = o.open || 0, top = -h;
  g.fillStyle = 'rgba(20,10,30,.28)'; g.beginPath(); g.ellipse(0, 4, w * 0.66, 22, 0, 0, 7); g.fill();
  if (gl > 0) glow(g, 0, top + h * 0.35, w * 0.95, '#ffd98a', 0.45 * gl);
  PATH(g, [[w / 2, top], [w / 2 + w * 0.16, top - h * 0.1], [w / 2 + w * 0.16, -h * 0.1], [w / 2, 0]], shade(c, -0.28)); 
  if (op < 0.05) PATH(g, [[-w / 2, top], [-w / 2 + w * 0.16, top - h * 0.1], [w / 2 + w * 0.16, top - h * 0.1], [w / 2, top]], shade(c, 0.18));
  else { g.fillStyle = '#4a2a18'; g.beginPath(); g.moveTo(-w / 2, top); g.lineTo(-w / 2 + w * 0.16, top - h * 0.1); g.lineTo(w / 2 + w * 0.16, top - h * 0.1); g.lineTo(w / 2, top); g.closePath(); fs(g, '#4a2a18');
    for (const d of [-1, 1]) { const x = d * w / 2 + (d > 0 ? 0 : 0); PATH(g, [[x, top], [x + d * w * 0.34 * op, top - h * 0.3 * Math.sin(op * 1.9)], [x + d * w * 0.34 * op + w * 0.16, top - h * 0.1 - h * 0.3 * Math.sin(op * 1.9)], [x + w * 0.16, top - h * 0.1]], shade(c, 0.1)); } }
  R(g, -w / 2, top, w, h, 8, c); band(g, () => rr(g, -w / 2, top, w, h, 8), -w / 2, -h * 0.28, w, h * 0.28, 0.1);
  g.fillStyle = shade(c, 0.34); g.fillRect(-w * 0.07, top + 4, w * 0.14, h - 8); if (gl > 0) { g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffe9a8', 0.75 * gl); g.fillRect(-4, top + 6, 8, h - 12); g.fillRect(-w / 2 + 6, top + 4, w - 12, 6); g.restore(); }
  if (o.label) { const lw = w * 0.62, lh = Math.min(h * 0.42, 40 + o.label.length * w * 0.11); R(g, -lw / 2, top + h * 0.3, lw, lh, 8, '#fff6e4', 4); o.label.forEach((s2, i) => T(g, s2, 0, top + h * 0.3 + lh * (i + 0.5) / o.label.length, Math.min(lh / o.label.length * 0.7, lw / Math.max(6, s2.length) * 1.7), INK)); }
  if (o.crack > 0) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const a = i * 0.9 + 0.2, k = Math.min(1, o.crack * 1.4); const pts = [[0, -h / 2]]; for (let j = 1; j <= 4; j++) pts.push([Math.cos(a) * w * 0.17 * j * k + (j % 2 ? 16 : -12), -h / 2 + Math.sin(a) * h * 0.16 * j * k + (j % 2 ? -14 : 14)]); seg(g, pts, 7, alpha('#fff3b8', 0.95)); } g.restore(); } });
export { D };
export const PROP2D_NAMES = () => Object.keys(D);
