// coolfaces.js: ORIGINAL "cool / slightly naughty" faces for the Ordinary Mind hero (user 2026-11-26: "slightly naughty (cool), looks so boring").
// Head space of the Character 19 rig (skin x -46..46, chin about y 44; hair covers the top). Driven by the rig emotions,
// with a cheeky resting attitude added: one brow up, side smirk, relaxed lids. Hooked in through look.face.
const INK = '#1d1418', TAU = Math.PI * 2;
const path = (g, d, fill, w = 2.6, col = INK) => { const p = new Path2D(d); if (fill) { g.fillStyle = fill; g.fill(p); } if (w) { g.lineWidth = w; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(p); } };
const oval = (g, x, y, rx, ry, fill, w = 2.4) => { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); if (fill) { g.fillStyle = fill; g.fill(); } if (w) { g.lineWidth = w; g.strokeStyle = INK; g.stroke(); } };
const blinkK = (c) => (c.options.blink === true || (c.options.autoBlink !== false && ((c.options.time || 0) % 3.7) > 3.55) ? 0.1 : 1);
const xs = (c) => (c.inProfile ? [null, 24] : [-18 + c.shift, 19 + c.shift]);
const stubble = (g, c) => { for (let i = -5; i <= 5; i++) { const x = i * 3.8 + c.shift * 0.5, y = 42.5 - i * i * 0.13; path(g, `M ${x} ${y} l 1 -2.2`, null, 0.9, '#715548'); } };
function extras(g, c) { const e = c.e, both = xs(c).filter((x) => x !== null);
  if (e.blush) { g.save(); g.globalAlpha *= e.blush * 0.45; for (const x of both) for (let i = 0; i < 3; i++) path(g, `M ${x - 8 + i * 6} 19 l -3 7`, null, 2, '#d0503c'); g.restore(); }
  if (e.tears) for (const x of both) path(g, `M ${x - 6} 12 q -5 11 -2 22 q 5 2 6 -1 q -2 -11 1 -20 Z`, '#9fdcf0', 1.4);
  if (e.sweat) path(g, 'M -40 -20 q -8 12 0 16 q 8 -4 0 -16 Z', '#9fdcf0', 1.4); }
// eye with a relaxed top lid that slants with the brows
function eye(g, c, x, open, side, o = {}) { if (x === null) return; const e = c.e, r = o.r || 12.5, k = blinkK(c), op = Math.max(0, Math.min(1.35, open)) * k, h = 11 * Math.max(op, 0.05), cy = -3;
  if (op < 0.22) { path(g, `M ${x - r} ${cy + 1} Q ${x} ${e.curve > 0.15 ? cy - 8 : cy + 4} ${x + r} ${cy + 1}`, null, 3.2); return; }
  const lid = Math.max(0, Math.min(0.62, (o.lid ?? 0.34) - (open - 1) * 0.7)), tilt = (e.browL - e.browR) * 5 * -side, top = cy - h + h * 2 * lid;
  oval(g, x, cy, r, h, '#fffdf6', 0); g.save(); g.beginPath(); g.ellipse(x, cy, r, h, 0, 0, TAU); g.clip();
  const px = x + (e.lookX + (o.lookX || 0)) * 5.5, py = cy + 1.5 + e.lookY * 4.5; oval(g, px, py, 5.2, Math.min(h * 0.75, 6), INK, 0); oval(g, px + 1.8, py - 2.2, 1.7, 1.7, '#ffffff', 0);
  g.fillStyle = c.skin; g.beginPath(); g.moveTo(x - r - 3, cy - h - 4); g.lineTo(x + r + 3, cy - h - 4); g.lineTo(x + r + 3, top + tilt); g.lineTo(x - r - 3, top - tilt); g.closePath(); g.fill(); g.restore();
  oval(g, x, cy, r, h, null, 2); path(g, `M ${x - r - 1.5} ${top - tilt} L ${x + r + 1.5} ${top + tilt}`, null, 3.8); }
function brows(g, c, lift = [0, -5], y0 = -16.5) { const e = c.e, [a, b] = xs(c);
  for (const [x, ang, up, extra, side] of [[a, e.browL, e.browYL, lift[0], -1], [b, e.browR, e.browYR, lift[1], 1]]) { if (x === null) continue; const y = y0 + up * 55 + extra, s = ang * 30;
    path(g, `M ${x - 13} ${y - s * 0.5 + 2} Q ${x + side * 2} ${y - 6 + (extra < -3 ? -3 : 0)} ${x + 13} ${y + s * 0.5 + 1}`, null, 6, c.hair); } }
// lopsided cheeky mouth: smirk with a fang-like tooth glint; opens neatly when talking
function mouth(g, c, o = {}) { const e = c.e, mx = c.inProfile ? 31 : c.shift * 0.7 + 2, y = 28, w = c.inProfile ? 9 : 7 + e.width * 24, grumpy = e.curve < -0.05, as = grumpy ? e.asym : e.asym + (o.asym ?? 0.28), curve = e.curve + (grumpy ? 0 : 0.05);
  if (c.open > 0.06) { const h = Math.min(13, 3 + c.open * 21), d = `M ${mx - w} ${y - curve * 4} Q ${mx} ${y - 1} ${mx + w} ${y - curve * 4 - as * 11} Q ${mx + w * 0.7} ${y + h} ${mx} ${y + h} Q ${mx - w * 0.75} ${y + h} ${mx - w} ${y - curve * 4} Z`;
    path(g, d, '#4a1c24', 0); g.save(); g.clip(new Path2D(d)); g.fillStyle = '#fffdf6'; g.fillRect(mx - 24, y - 16, 48, 18 - as * 5); if (h > 9) oval(g, mx, y + h + 3.5, w * 0.5, 5.5, '#a04c52', 0); g.restore(); path(g, d, null, 2.4); }
  else { path(g, `M ${mx - w} ${y + 1 + as * 3} Q ${mx + 2} ${y + curve * 34 + 2} ${mx + w} ${y - as * 17}`, null, 3); if (as > 0.18) path(g, `M ${mx + w - 1} ${y - as * 17 - 4} q 5 2 4 8`, null, 2.2);
    if (o.tooth && !grumpy && curve > 0.08) path(g, `M ${mx - w * 0.5} ${y + curve * 15 + 1} Q ${mx + 2} ${y + curve * 17 + 8} ${mx + w - 3} ${y - as * 12} Q ${mx + 3} ${y + curve * 17 - 1} ${mx - w * 0.5} ${y + curve * 15 + 1} Z`, '#fffdf6', 2); } }
const nose = (g, c) => { if (!c.inProfile) path(g, `M ${5 + c.shift} 1 q 7 10 -2 13`, null, 2, '#c98a6a'); };

// A "SHADES": tinted round glasses slid down the nose, eyes peeking over them with one raised brow
export function shades(g, c) { const [a, b] = xs(c); brows(g, c, [0, -5], -17);
  eye(g, c, a, c.e.eyeL, -1, { lid: 0.3, r: 11 }); eye(g, c, b, c.e.eyeR, 1, { lid: 0.24, r: 11 });
  nose(g, c); stubble(g, c); mouth(g, c, { asym: 0.3 }); extras(g, c);
  const slide = c.e.eyeL > 1.25 ? 5 : 0, gy = 9 + slide;
  for (const x of [a, b]) if (x !== null) { const d = `M ${x - 15} ${gy - 5} Q ${x} ${gy - 8} ${x + 15} ${gy - 5} Q ${x + 14} ${gy + 11} ${x} ${gy + 12} Q ${x - 14} ${gy + 11} ${x - 15} ${gy - 5} Z`; g.save(); g.globalAlpha *= 0.88; path(g, d, '#151226', 0); g.restore(); g.save(); g.clip(new Path2D(d)); g.fillStyle = 'rgba(120,230,255,.5)'; g.beginPath(); g.moveTo(x - 11, gy - 9); g.lineTo(x - 2, gy - 9); g.lineTo(x - 12, gy + 8); g.lineTo(x - 18, gy + 8); g.fill(); g.restore(); path(g, d, null, 3.4, '#e0a93a'); }
  if (a !== null) path(g, `M ${a + 15} ${gy - 3} Q ${c.shift} ${gy - 9} ${b - 15} ${gy - 3}`, null, 3, '#e0a93a'); path(g, `M ${b + 15} ${gy - 4} L ${b + 27} ${gy - 11}`, null, 3, '#e0a93a'); }

// B "SMIRK": heavy cool lids, one sky-high brow, side smirk with a toothpick and a small brow scar
export function smirk(g, c) { const [a, b] = xs(c); brows(g, c, [1.5, -6], -16.5);
  eye(g, c, a, c.e.eyeL, -1, { lid: 0.46, lookX: 0.25 }); eye(g, c, b, c.e.eyeR, 1, { lid: 0.3, lookX: 0.25 });
  nose(g, c); stubble(g, c); mouth(g, c, { asym: 0.36 }); extras(g, c);
  if (a !== null) path(g, `M ${a - 5} ${-19.5 + c.e.browYL * 55} l 3 8`, null, 2.2, c.skin);
  const mx = c.inProfile ? 31 : c.shift * 0.7 + 2, bob = Math.sin((c.options.time || 0) * 3) * 1.5; path(g, `M ${mx + 12} 27 L ${mx + 33} ${19 + bob}`, null, 4.6, INK); path(g, `M ${mx + 12} 27 L ${mx + 33} ${19 + bob}`, null, 2.2, '#e8c27a'); }

// C "WINK": playful wink at rest (opens both eyes when surprised or angry), big one-sided grin with a tooth glint, gold ear stud
export function wink(g, c) { const [a, b] = xs(c), e = c.e, playful = e.curve >= 0.1 && e.eyeL < 1.15; brows(g, c, [2, -5], -16.5);
  if (playful && a !== null) path(g, `M ${a - 12} -4 Q ${a} 4 ${a + 12} -4`, null, 4); else eye(g, c, a, e.eyeL, -1, { lid: 0.28 });
  eye(g, c, b, e.eyeR, 1, { lid: 0.2 }); nose(g, c); stubble(g, c); mouth(g, c, { asym: 0.32, tooth: true }); extras(g, c);
  if (!c.inProfile) { oval(g, 45, 17, 3.4, 3.4, '#ffd23a', 1.4); } }

export const COOL_FACES = { shades, smirk, wink };
