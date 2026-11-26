// newheads.js: completely NEW heads (shape, hair, eyes, nose, mouth, beard) for the Ordinary Mind hero (user 2026-11-26).
// Original designs, all with formal glasses. Replaces the rig head through look.head (hook in cast19/rig.js).
// Head space: chin about y 46-56, ears x +-46, hair may rise to y -80. Driven by the rig emotions, blinking and talking.
const INK = '#1d1418', TAU = Math.PI * 2;
const P = (g, d, fill, w = 2.4, col = INK) => { const p = new Path2D(d); if (fill) { g.fillStyle = fill; g.fill(p); } if (w) { g.lineWidth = w; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(p); } };
const O = (g, x, y, rx, ry, fill, w = 0, col = INK) => { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); if (fill) { g.fillStyle = fill; g.fill(); } if (w) { g.lineWidth = w; g.strokeStyle = col; g.stroke(); } };
const clipFill = (g, d, fn) => { g.save(); g.clip(new Path2D(d)); fn(); g.restore(); };
const blinkK = (c) => (c.options.blink === true || (c.options.autoBlink !== false && ((c.options.time || 0) % 3.7) > 3.55) ? 0.1 : 1);
const SH = '#e9b48f';
function geo(c) { const pr = c.inProfile, s = pr ? 20 : c.shift * 0.8; return { pr, s, eyes: pr ? [null, 22] : [-17 + s, 18 + s] }; }
// skin with a soft shadow down one side and under the hair
function skull(g, c, d) { P(g, d, c.skin, 0); clipFill(g, d, () => { g.globalAlpha *= 0.55; P(g, 'M -70 -80 L -30 -80 Q -52 0 -22 44 L -10 70 L -70 70 Z', SH, 0); P(g, 'M -60 -60 L 60 -60 L 60 -27 Q 0 -17 -60 -29 Z', SH, 0); }); P(g, d, null, 2.6); }
function ears(g, c, y = 4, x = 45) { for (const sd of c.inProfile ? [-1] : [-1, 1]) { const ex = c.inProfile ? -14 : sd * x; O(g, ex, y, 8.5, 11, c.skin, 2.4); P(g, `M ${ex - 2 * sd} ${y - 4} q ${5 * sd} 3 ${1 * sd} 9`, null, 1.6, '#c98a6a'); } }
// almond eye with iris, lid and lower line. o: {w, lid, iris}
function eye(g, c, x, open, side, o = {}) { if (x === null) return; const e = c.e, w = o.w || 10.5, op = Math.max(0, Math.min(1.45, open)) * blinkK(c), y = o.y ?? -3, h = 8.2 * Math.max(op, 0.05);
  if (op < 0.2) { P(g, `M ${x - w} ${y} Q ${x} ${e.curve > 0.15 ? y - 8 : y + 5} ${x + w} ${y}`, null, 3.2); return; }
  const tilt = (o.slant || 0) * side + (e.browL - e.browR) * 3 * -side, d = `M ${x - w} ${y - tilt * 0.5} Q ${x} ${y - h * 1.35} ${x + w} ${y + tilt * 0.5} Q ${x} ${y + h * 1.15} ${x - w} ${y - tilt * 0.5} Z`;
  P(g, d, '#fffdf8', 0); clipFill(g, d, () => { const px = x + e.lookX * 4.4 + (o.lookX || 0), py = y + e.lookY * 3.4 + 0.5, r = op > 1.25 ? 3.6 : 5.6; O(g, px, py, r, r * 1.05, o.iris || '#5a3418'); O(g, px, py, r * 0.55, r * 0.58, '#120a08'); O(g, px + 1.7, py - 2, 1.5, 1.5, '#ffffff');
    const lid = Math.max(0, (o.lid ?? 0.24) - (open - 1) * 0.6); if (lid > 0) { const yl = y - h * 1.5 + h * (0.5 + lid * 1.6); g.fillStyle = c.skin; g.fillRect(x - w - 2, y - h * 1.5, w * 2 + 4, yl - (y - h * 1.5)); P(g, `M ${x - w - 1} ${yl - tilt * 0.5} L ${x + w + 1} ${yl + tilt * 0.5}`, null, 3.2); } });
  P(g, d, null, 1.7); P(g, `M ${x - w - 1} ${y - tilt * 0.5} Q ${x} ${y - h * 1.42} ${x + w + 1} ${y + tilt * 0.5}`, null, 3); }
function brows(g, c, eyes, hair, o = {}) { const e = c.e, y0 = o.y ?? -18, th = o.th || 5.5;
  eyes.forEach((x, i) => { if (x === null) return; const side = i ? 1 : -1, ang = i ? e.browR : e.browL, up = i ? e.browYR : e.browYL, y = y0 + up * 48 + (i ? -(o.cock ?? 3.5) : 0), s = ang * 26;
    P(g, `M ${x - 12.5} ${y - s * 0.5 + 1.5} Q ${x + side * 2} ${y - th * 0.9 - (i ? 2 : 0)} ${x + 12.5} ${y + s * 0.5} Q ${x + side * 2} ${y - th * 0.9 + th} ${x - 12.5} ${y - s * 0.5 + 1.5 + th * 0.55} Z`, hair, 1.4, hair); }); }
function mouth(g, c, mx, y, o = {}) { const e = c.e, w = c.inProfile ? 8 : 6 + e.width * 22, grumpy = e.curve < -0.05, as = grumpy ? e.asym : e.asym + (o.asym ?? 0.3), curve = e.curve + (grumpy ? 0 : 0.05);
  if (c.open > 0.06) { const h = Math.min(12, 3 + c.open * 20), d = `M ${mx - w} ${y - curve * 4} Q ${mx} ${y - 2} ${mx + w} ${y - curve * 4 - as * 10} Q ${mx + w * 0.7} ${y + h} ${mx} ${y + h} Q ${mx - w * 0.75} ${y + h} ${mx - w} ${y - curve * 4} Z`;
    P(g, d, '#4a1c24', 0); clipFill(g, d, () => { g.fillStyle = '#fffdf6'; g.fillRect(mx - 24, y - 16, 48, 17.5 - as * 5); if (h > 8) O(g, mx, y + h + 3.5, w * 0.5, 5.5, '#a04c52'); }); P(g, d, null, 2.3); }
  else { P(g, `M ${mx - w} ${y + as * 3} Q ${mx + 2} ${y + curve * 30 + 1} ${mx + w} ${y - as * 15}`, null, 2.9); if (as > 0.15) P(g, `M ${mx + w - 1.5} ${y - as * 15 - 4} q 5.5 2 3.5 8`, null, 2.1); P(g, `M ${mx - 6} ${y + 8 + curve * 8} q 6 2.4 12 -0.6`, null, 1.5, '#c98a6a'); } }
// formal frames. kind: 'rect' | 'half' | 'round'
function glasses(g, c, eyes, o = {}) { const [a, b] = eyes, col = o.col || '#17131c', y = (o.y ?? -3) + (c.e.eyeL > 1.25 ? 4 : 0), kind = o.kind || 'rect';
  for (const x of [a, b]) { if (x === null) continue; const d = kind === 'round' ? `M ${x - 14} ${y} a 14 13 0 1 0 28 0 a 14 13 0 1 0 -28 0 Z` : `M ${x - 15} ${y - 9.5} Q ${x} ${y - 11} ${x + 15} ${y - 9.5} Q ${x + 15.5} ${y + 11} ${x + 7} ${y + 11.5} L ${x - 7} ${y + 11.5} Q ${x - 15.5} ${y + 11} ${x - 15} ${y - 9.5} Z`;
    g.save(); g.globalAlpha *= 0.1; P(g, d, '#bfe6ff', 0); g.restore(); clipFill(g, d, () => { g.fillStyle = 'rgba(255,255,255,.38)'; g.beginPath(); g.moveTo(x - 9, y - 15); g.lineTo(x - 4.5, y - 15); g.lineTo(x - 15, y + 3); g.lineTo(x - 19, y + 3); g.fill(); });
    if (kind === 'half') { P(g, d, null, 1.7, '#5a4658'); P(g, `M ${x - 15.5} ${y + 1} Q ${x - 15.5} ${y - 10} ${x - 8} ${y - 10.5} L ${x + 8} ${y - 10.5} Q ${x + 15.5} ${y - 10} ${x + 15.5} ${y + 1}`, null, 3.6, col); } else P(g, d, null, kind === 'round' ? 2.4 : 2.7, col); }
  if (a !== null) { P(g, `M ${a + 14.5} ${y - 4} Q ${(a + b) / 2} ${y - 9.5} ${b - 14.5} ${y - 4}`, null, 2.4, col); P(g, `M ${a - 15} ${y - 5} L -45 ${y - 1}`, null, 2.4, col); }
  P(g, `M ${b + 15} ${y - 5} L ${c.inProfile ? -12 : 45} ${y - 1}`, null, 2.4, col); }
function extras(g, c, eyes) { const e = c.e; if (e.blush) { g.save(); g.globalAlpha *= e.blush * 0.4; for (const x of eyes) if (x !== null) for (let i = 0; i < 3; i++) P(g, `M ${x - 8 + i * 6} 17 l -3 6`, null, 1.8, '#d0503c'); g.restore(); }
  if (e.tears) for (const x of eyes) if (x !== null) P(g, `M ${x - 6} 12 q -5 11 -2 21 q 5 2 6 -1 q -2 -10 1 -19 Z`, '#9fdcf0', 1.3); if (e.sweat) P(g, 'M -40 -18 q -8 12 0 16 q 8 -4 0 -16 Z', '#9fdcf0', 1.3); }
const wrap = (draw, hairCol) => (g, c) => { g.save(); if (c.back) { O(g, 0, -4, 49, 54, c.skin, 2.6); P(g, 'M -50 -10 C -56 -70 56 -70 50 -10 Q 46 30 26 36 L -26 36 Q -46 30 -50 -10 Z', hairCol, 2.6); } else draw(g, c); g.restore(); };

// A "THE CLOSER": long angular face, tall swept-back quiff, short boxed beard, black rectangular frames
function closer(g, c) { const H = '#221a24', L = '#4a3a52', { s, pr, eyes } = geo(c);
  P(g, 'M -48 4 C -58 -50 -34 -66 0 -66 C 38 -66 54 -44 47 6 Z', H, 2.6); ears(g, c, 5, 44);
  const face = pr ? 'M -30 -40 Q 8 -52 34 -30 L 40 -8 L 52 6 L 41 11 L 40 28 Q 34 50 14 54 L -6 50 Q -30 38 -34 10 Z' : 'M -43 -26 C -42 -46 42 -46 43 -26 L 41 14 Q 36 34 18 49 Q 10 56 0 56 Q -10 56 -18 49 Q -36 34 -41 14 Z';
  skull(g, c, face);
  clipFill(g, face, () => { P(g, `M ${s - 52} 15 Q ${s - 30} 34 ${s - 17} 27 Q ${s - 8} 20 ${s} 23 Q ${s + 8} 20 ${s + 17} 27 Q ${s + 30} 34 ${s + 52} 15 L ${s + 52} 70 L ${s - 52} 70 Z`, H, 0); });
  P(g, face, null, 2.6); if (!pr) O(g, s + 1, 33, 15, 9.5, c.skin);
  brows(g, c, eyes, H, { y: -17, th: 6.5 }); eye(g, c, eyes[0], c.e.eyeL, -1, { lid: 0.3, slant: -1.5 }); eye(g, c, eyes[1], c.e.eyeR, 1, { lid: 0.18, slant: -1.5 });
  if (!pr) P(g, `M ${s + 2} -4 L ${s + 8} 14 Q ${s + 2} 19 ${s - 4} 15`, null, 2, '#b9785c');
  mouth(g, c, pr ? 28 : s + 1, 31); extras(g, c, eyes); glasses(g, c, eyes, { kind: 'rect' });
  P(g, 'M -45 -14 C -52 -38 -42 -52 -26 -55 C -38 -72 -4 -88 18 -76 C 40 -86 60 -62 46 -44 C 52 -36 48 -22 43 -14 C 42 -28 34 -36 22 -34 C 2 -30 -22 -30 -35 -37 C -42 -32 -43 -24 -45 -14 Z', H, 2.6);
  P(g, 'M -26 -55 C -10 -74 18 -76 34 -66 C 14 -68 -6 -60 -14 -46 C -12 -58 -18 -58 -26 -55 Z', L, 0); P(g, 'M -8 -40 C 8 -56 28 -58 42 -48 C 26 -48 10 -42 -8 -40 Z', L, 0); }
// B "THE STRATEGIST": narrow V jaw, side-parted wave falling over one brow, thin half-rim frames, light stubble, sly look
function strategist(g, c) { const H = '#4a2a1c', L = '#a0603a', { s, pr, eyes } = geo(c);
  P(g, 'M -49 16 C -60 -44 -30 -68 6 -66 C 46 -66 58 -36 49 18 Q 42 6 40 -8 L -40 -8 Q -42 6 -49 16 Z', H, 2.6); ears(g, c, 6, 43);
  const face = pr ? 'M -30 -40 Q 6 -54 33 -30 L 39 -6 L 53 8 L 40 13 L 36 30 Q 28 46 8 56 L -8 46 Q -30 34 -34 8 Z' : 'M -42 -24 C -40 -48 40 -48 42 -24 L 38 12 Q 30 36 10 52 Q 0 60 -10 52 Q -30 36 -38 12 Z';
  skull(g, c, face); clipFill(g, face, () => { for (let i = -6; i <= 6; i++) for (let j = 0; j < 4; j++) { const x = s + i * 5 + (j % 2) * 2.5, y = 38 + j * 5 - Math.abs(i) * 1.5; if (Math.hypot(x - s, y - 31) > 12) O(g, x, y, 0.9, 0.9, 'rgba(90,52,34,.65)'); } });
  brows(g, c, eyes, H, { y: -16.5, th: 4.5, cock: 5 }); eye(g, c, eyes[0], c.e.eyeL, -1, { lid: 0.42, w: 11, slant: -2.5, iris: '#2f5a4a', lookX: 1.5 }); eye(g, c, eyes[1], c.e.eyeR, 1, { lid: 0.28, w: 11, slant: -2.5, iris: '#2f5a4a', lookX: 1.5 });
  if (!pr) P(g, `M ${s + 3} -2 Q ${s + 6} 8 ${s + 9} 14 L ${s} 16`, null, 2, '#b9785c');
  mouth(g, c, pr ? 27 : s + 2, 30, { asym: 0.4 }); extras(g, c, eyes); glasses(g, c, eyes, { kind: 'half', col: '#2a1a14' });
  P(g, 'M -46 -4 C -56 -48 -30 -66 -8 -62 C 4 -76 44 -70 52 -44 C 58 -28 52 -12 45 -4 C 44 -20 38 -30 30 -34 C 36 -24 32 -14 24 -10 C 28 -22 14 -34 -2 -36 C -22 -38 -34 -28 -38 -18 C -42 -14 -44 -8 -46 -4 Z', H, 2.6);
  P(g, 'M -34 -48 C -14 -64 14 -62 30 -50 C 10 -54 -10 -52 -22 -40 C -22 -48 -26 -50 -34 -48 Z', L, 0); P(g, 'M 16 -62 C 34 -62 46 -50 48 -38 C 40 -48 28 -52 16 -62 Z', L, 0); }
// C "THE BOSS": broad square jaw, high fade with a flat textured top, goatee + moustache, round gold frames
function boss(g, c) { const H = '#17121a', L = '#3c3246', { s, pr, eyes } = geo(c);
  ears(g, c, 4, 47);
  const face = pr ? 'M -32 -40 Q 6 -52 36 -32 L 42 -8 L 54 8 L 43 13 L 42 34 Q 38 50 18 50 L -12 46 Q -34 36 -36 8 Z' : 'M -46 -26 C -44 -52 44 -52 46 -26 L 46 18 Q 44 36 30 46 Q 16 53 0 53 Q -16 53 -30 46 Q -44 36 -46 18 Z';
  skull(g, c, face); clipFill(g, face, () => { g.globalAlpha *= 0.35; g.fillStyle = H; g.fillRect(-60, -60, 22, 52); if (!pr) g.fillRect(38, -60, 22, 52); }); P(g, face, null, 2.6);
  brows(g, c, eyes, H, { y: -17, th: 7, cock: 3 }); eye(g, c, eyes[0], c.e.eyeL, -1, { lid: 0.22, w: 9.5 }); eye(g, c, eyes[1], c.e.eyeR, 1, { lid: 0.16, w: 9.5 });
  if (!pr) P(g, `M ${s + 1} -3 q 2 10 7 14 q -4 6 -13 2`, null, 2.1, '#b9785c');
  const mx = pr ? 29 : s + 1; P(g, `M ${mx} 20 C ${mx - 8} 17 ${mx - 17} 22 ${mx - 18} 29 C ${mx - 12} 24 ${mx - 6} 25 ${mx} 24.5 C ${mx + 6} 25 ${mx + 12} 23 ${mx + 19} 25 C ${mx + 16} 18 ${mx + 8} 17 ${mx} 20 Z`, H, 1.2, H);
  mouth(g, c, mx, 31, { asym: 0.32 }); if (c.open <= 0.06) P(g, `M ${mx - 11} 40 Q ${mx} 37 ${mx + 11} 40 Q ${mx + 8} 52 ${mx} 52.5 Q ${mx - 8} 52 ${mx - 11} 40 Z`, H, 1.4, H); else P(g, `M ${mx - 9} 46 Q ${mx} 43.5 ${mx + 9} 46 Q ${mx + 5} 53 ${mx} 53 Q ${mx - 5} 53 ${mx - 9} 46 Z`, H, 1.4, H);
  extras(g, c, eyes); glasses(g, c, eyes, { kind: 'round', col: '#d79a2c' });
  P(g, 'M -45 -24 L -49 -46 L -42 -50 L -44 -62 L -30 -64 L -26 -73 L -10 -70 L 0 -78 L 14 -71 L 28 -75 L 34 -64 L 48 -62 L 46 -50 L 52 -44 L 45 -24 Q 40 -38 28 -37 Q 0 -33 -28 -37 Q -40 -36 -45 -24 Z', H, 2.6);
  for (const [x, y] of [[-30, -52], [-12, -60], [6, -55], [22, -62], [34, -49], [-20, -45]]) P(g, `M ${x} ${y} q 6 -8 13 -4`, null, 2.6, L); }

export const NEW_HEADS = { closer: wrap(closer, '#221a24'), strategist: wrap(strategist, '#4a2a1c'), boss: wrap(boss, '#17121a') };
