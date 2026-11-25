// memefaces.js: ORIGINAL meme-style faces for the hero (user 2026-11-25: "memes face, unique, not what everyone uses").
// Drawn in the rig's head space (skin spans x -46..46, y -45..46; hair covers the top), driven by the same emotion
// values as the rig, so all 46 emotions, blinking and talking work. Hooked in via look.face (rig.js).
const INK = '#1d1418', TAU = Math.PI * 2;
const oval = (g, x, y, rx, ry, fill, w = 2.6) => { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, TAU); if (fill) { g.fillStyle = fill; g.fill(); } if (w) { g.lineWidth = w; g.strokeStyle = INK; g.stroke(); } };
const path = (g, d, fill, w = 2.6, col = INK) => { const p = new Path2D(d); if (fill) { g.fillStyle = fill; g.fill(p); } if (w) { g.lineWidth = w; g.strokeStyle = col; g.lineCap = 'round'; g.lineJoin = 'round'; g.stroke(p); } };
const blinkK = (c) => (c.options.blink === true || (c.options.autoBlink !== false && ((c.options.time || 0) % 3.7) > 3.55) ? 0.08 : 1);
const xs = (c) => (c.inProfile ? [null, 24] : [-18 + c.shift, 19 + c.shift]);
function extras(g, c, y = 4) {
  const e = c.e, both = xs(c).filter((x) => x !== null);
  if (e.blush) { g.save(); g.globalAlpha *= e.blush * 0.5; for (const x of both) for (let i = 0; i < 3; i++) path(g, `M ${x - 9 + i * 6} ${y + 17} l -3 7`, null, 2, '#d0503c'); g.restore(); }
  if (e.tears) for (const x of both) path(g, `M ${x - 7} ${y + 8} q -6 12 -3 26 q 5 3 7 -1 q -2 -13 1 -24 Z`, '#9fdcf0', 1.6);
  if (e.sweat) path(g, 'M -40 -22 q -9 13 0 17 q 9 -4 0 -17 Z', '#9fdcf0', 1.6);
}
function mouthShape(g, x, y, w, open, curve, asym, teeth) {
  if (open > 0.06) {
    const h = 6 + open * 42;
    const d = `M ${x - w} ${y - curve * 8} Q ${x} ${y + curve * 10 - 3} ${x + w} ${y - curve * 8 - asym * 18} Q ${x + w * 0.7} ${y + h} ${x} ${y + h} Q ${x - w * 0.8} ${y + h * 0.85} ${x - w} ${y - curve * 8} Z`;
    path(g, d, '#4a1c24', 0); g.save(); g.clip(new Path2D(d)); if (teeth) teeth(h); oval(g, x + 2, y + h, w * 0.62, h * 0.36, '#e0766a', 0); g.restore(); path(g, d, null, 2.8);
  } else path(g, `M ${x - w} ${y + asym * 4} Q ${x} ${y + curve * 46} ${x + w} ${y - asym * 22}`, null, 3);
}

// A "MOOCH": the moustache is the star: it curls up when happy, droops when sad, bristles when angry. Lopsided eyes.
export function mooch(g, c) {
  const e = c.e, [a, b] = xs(c), k = blinkK(c);
  const eye = (x, r, open) => {
    if (x === null) return; const h = r * Math.min(1.35, open) * k;
    if (h < 2.4) { path(g, `M ${x - r} -3 Q ${x} ${e.curve > 0.15 ? -11 : 2} ${x + r} -3`, null, 3.2); return; }
    oval(g, x, -4, r, h, '#fffdf6'); const cut = Math.max(0, 1 - open) * h * 1.2, py = -4 + e.lookY * h * 0.4 + cut * 0.3, px = x + e.lookX * r * 0.45;
    oval(g, px, py, r * 0.34, Math.min(h * 0.6, r * 0.42), INK, 0); oval(g, px + 2, py - 3, 1.4, 1.4, '#fff', 0);
    if (cut > 0.5) { g.save(); const p = new Path2D(); p.ellipse(x, -4, r + 1, h + 1, 0, 0, TAU); g.clip(p); g.fillStyle = c.skin; g.fillRect(x - r - 3, -4 - h - 3, 2 * r + 6, cut + 3); g.restore(); path(g, `M ${x - r} ${-4 - h + cut} L ${x + r} ${-4 - h + cut}`, null, 3); }
  };
  eye(a, 11.5, e.eyeL); eye(b, 14.5, e.eyeR);
  for (const [x, ang, lift] of [[a, e.browL, e.browYL], [b, e.browR, e.browYR]]) if (x !== null) path(g, `M ${x - 13} ${-24 + lift * 55 - ang * 28} Q ${x} ${-30 + lift * 55} ${x + 13} ${-24 + lift * 55 + ang * 28}`, null, 6.5, c.hair);
  const mx = c.inProfile ? 30 : c.shift * 0.7, angry = e.browL - e.browR > 0.3, tip = Math.max(-1, Math.min(1, e.curve * 3.2)) * 11;
  mouthShape(g, mx, 31, c.inProfile ? 8 : 6 + e.width * 22, c.open * 1.15, e.curve, e.asym, () => { g.fillStyle = '#fffdf6'; g.fillRect(mx - 24, 24, 48, 10); });
  g.save(); g.translate(mx, 17); g.scale(0.82, 0.8); g.translate(-mx, -17);
  for (const d of c.inProfile ? [1] : [-1, 1]) {
    const t = tip + (d > 0 ? e.asym * 14 : 0);
    path(g, angry ? `M ${mx} 17 L ${mx + d * 8} 12 L ${mx + d * 13} 19 L ${mx + d * 20} 13 L ${mx + d * 25} 21 L ${mx + d * 34} 17 L ${mx + d * 22} 28 L ${mx + d * 12} 24 L ${mx} 24 Z`
      : `M ${mx} 17 C ${mx + d * 9} 9 ${mx + d * 20} 20 ${mx + d * 27} ${21 - t * 0.4} Q ${mx + d * 35} ${22 - t} ${mx + d * 34} ${12 - t} Q ${mx + d * 43} ${22 - t} ${mx + d * 31} ${29 - t * 0.5} C ${mx + d * 20} 32 ${mx + d * 8} 26 ${mx} 24 Z`, c.hair, 1.6);
  }
  g.restore(); extras(g, c);
}

// B "POP-BROW": huge eyebrows that jump right out of the hair, big round eyes with tiny pupils, rubber mouth.
export function popbrow(g, c) {
  const e = c.e, [a, b] = xs(c), k = blinkK(c);
  const eye = (x, open, side) => {
    if (x === null) return; const r = 15.5, h = r * Math.max(0.12, Math.min(1.3, open)) * k;
    if (h < 3.5) { path(g, `M ${x - r} 0 Q ${x} ${e.curve > 0.15 ? -13 : 3} ${x + r} 0`, null, 3.4); return; }
    const small = open > 1.2; oval(g, x, -1, r, h, '#fff', 3); oval(g, x + e.lookX * 7 + side * 1.5, -1 + e.lookY * h * 0.5, small ? 2.4 : 4.4, Math.min(h * 0.7, small ? 2.4 : 4.8), INK, 0);
  };
  eye(a, e.eyeL, 1); eye(b, e.eyeR, -1);
  const nx = c.inProfile ? 40 : 2 + c.shift; path(g, `M ${nx - 2} 9 q 11 6 -1 10`, null, 2.2, '#b9785c');
  const mx = c.inProfile ? 30 : c.shift * 0.7;
  mouthShape(g, mx, 28, c.inProfile ? 9 : 4 + e.width * 34, c.open * 1.2, e.curve, e.asym, () => { g.fillStyle = '#fff'; g.fillRect(-40, 22, 80, 9); });
  extras(g, c);
  for (const [x, ang, lift] of [[a, e.browL, e.browYL], [b, e.browR, e.browYR]]) {
    if (x === null) continue; const y = -30 + lift * 150, s = ang * 55;
    path(g, `M ${x - 15} ${y - s * 0.45 + 3} Q ${x - 1} ${y - 12 - s * 0.1} ${x + 15} ${y + s * 0.45 + 1} Q ${x + 16} ${y + s * 0.45 + 8} ${x + 9} ${y + s * 0.45 + 6} Q ${x - 1} ${y - 2} ${x - 12} ${y - s * 0.45 + 9} Q ${x - 18} ${y - s * 0.45 + 9} ${x - 15} ${y - s * 0.45 + 3} Z`, c.hair, 2.8, '#fff4dc');
  }
}

// C "GAP-TOOTH": heavy half-lids with under-eye lines, one flat unibrow, gap-tooth grin.
export function gaptooth(g, c) {
  const e = c.e, [a, b] = xs(c), k = blinkK(c);
  const eye = (x, open) => {
    if (x === null) return; const r = 15, o = Math.max(0, Math.min(1.4, open)) * k, lid = -8 + (1 - Math.min(1, o * 0.75)) * 14;
    if (o < 0.2) path(g, `M ${x - r} 1 Q ${x} ${e.curve > 0.15 ? -8 : 5} ${x + r} 1`, null, 3.4);
    else {
      const d = `M ${x - r} ${lid} L ${x + r} ${lid} Q ${x + r - 1} 13 ${x} 13 Q ${x - r + 1} 13 ${x - r} ${lid} Z`; path(g, d, '#fffdf6', 0);
      g.save(); g.clip(new Path2D(d)); const py = Math.max(lid + 4, 1 + e.lookY * 6); oval(g, x + e.lookX * 7, py, 5.2, 5.6, INK, 0); oval(g, x + e.lookX * 7 + 2, py - 2, 1.6, 1.6, '#fff', 0); g.restore();
      path(g, d, null, 2.8); path(g, `M ${x - r - 2} ${lid} L ${x + r + 2} ${lid}`, null, 4.6);
    }
    path(g, `M ${x - 11} 18 Q ${x} 23 ${x + 11} 18`, null, 1.8, '#b9785c');
  };
  eye(a, e.eyeL); eye(b, e.eyeR);
  const y = -14 + ((e.browYL + e.browYR) / 2) * 60, v = (e.browL - e.browR) * 26, worry = e.browR > e.browL ? 7 : 0;
  if (c.inProfile) path(g, `M 8 ${y - v * 0.5} L 40 ${y + 1}`, null, 7, c.hair);
  else path(g, `M ${a - 17} ${y - v * 0.5 + worry * 0.5} Q ${a} ${y - 4} ${c.shift} ${y + v * 0.6 - worry} Q ${b} ${y - 4} ${b + 17} ${y - v * 0.5 + worry * 0.5}`, null, 7.5, c.hair);
  const mx = c.inProfile ? 31 : c.shift * 0.7, grin = c.open <= 0.06 && e.curve > 0.1;
  mouthShape(g, mx, 29, c.inProfile ? 10 : 8 + e.width * 28, grin ? 0.16 : c.open * 1.15, e.curve, e.asym, () => { g.fillStyle = '#fffdf6'; g.fillRect(mx - 34, 18, 32, 19); g.fillRect(mx + 3, 18, 32, 19); });
  extras(g, c);
}

export const MEME_FACES = { mooch, popbrow, gaptooth };
