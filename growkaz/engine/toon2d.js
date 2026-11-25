// toon2d.js: the user's own cartoon cast for the GrowKaz engine (added 2026-11-21).
// Characters keep the house style of the user's channel (big cream head, glossy eyes, curly hair, the hero "Abid":
// curled moustache + goatee, denim-blue shirt with rolled sleeves, beige chinos, white sneakers) but use the GrowKaz
// skeleton (POSES / posesAt / breathe / walkPose), cinematic rim light and rich, expressive faces.
//   drawToon(g, {x, y, s, facing, pose, look:[x,y], expr, talk, blink, cast, rim:{color, dir}, alpha, shadow})
//   bigToonFace(g, cx, cy, r, {cast, expr, talk, blink, look, rimColor, tilt})
//   TOON_EXPR names: neutral smile happy joy laugh smug fake awkward angry furious sad cry worried nervous shocked surprised thinking confused determined tired
import { E, S, seg, circle, rr, shade, alpha, mix } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { draw19, face19 } from '/engine/char19.js';
export { ACTIONS, EMOTION_NAMES } from '/engine/char19.js';
// 2026-11-25: Character 19 rig is the default cast. The old round-head look stays available:
//   per call { rig: 'classic' }, per cast { rig: 'classic' }, or per project config.json "cast": "classic".
const classic = (o, c) => (o.rig || c.rig || E.cfg.cast) === 'classic';

// ---------- cast presets ----------
export const HERO = { c19: ['lead_mooch', 'original'], skin: '#f6d6bd', hair: 'curly', hairColor: '#3a2418', top: '#4a78b8', topDark: '#33598f', collar: '#2f5286', sleeves: 'rolled',
                      legs: '#b8a07a', shoes: '#f4f4f4', stache: 'curl', beard: 'goatee', eyes: 'dark', belt: '#2a2033' };
export const CASHIER = { c19: ['tess', 'uniform'], skin: '#d6a074', hair: 'ponytail', hairColor: '#2a1d18', top: '#e8e2d0', topDark: '#c8c0a8', apron: '#2f8a57', cap: '#2f8a57', legs: '#3a3f52', shoes: '#2a2a33', eyes: 'dark', lashes: true };
export const STRANGER = { c19: ['ines', 'blazer'], skin: '#f1c8a0', hair: 'swoop', hairColor: '#7a4a2a', top: '#8a5cc8', topDark: '#6a42a0', legs: '#2e3344', shoes: '#e8e8f0', eyes: 'dark' };
export const SAM = { c19: ['sam', 'workwear'], skin: '#b9825a', hair: 'curly', hairColor: '#1d1410', top: '#4fb286', topDark: '#2f7a5a', legs: '#3a4a6a', shoes: '#f4f4f4', eyes: 'dark' };
export const ROOMMATE = { c19: ['ivo', 'marine'], skin: '#f3cfae', hair: 'swoop', hairColor: '#c0602a', top: '#e0743a', topDark: '#b0522a', legs: '#3a3f52', shoes: '#e8e8f0', eyes: 'dark' };
export const MOM = { c19: ['mom', 'cardigan'], skin: '#e8b892', hair: 'long', hairColor: '#4a2a1c', top: '#c96f8a', topDark: '#9d4a64', legs: '#4a3f6e', shoes: '#2a2a33', eyes: 'dark', lashes: true };
export const DAD = { c19: ['dad', 'cardigan'], skin: '#e4b48c', hair: 'short', hairColor: '#8d8a96', top: '#6b7f5a', topDark: '#46573a', legs: '#3a3a44', shoes: '#2a2a33', eyes: 'dark', glasses: true, stache: 'curl' };
export const KID = { ...HERO, c19: ['kid', 'marine'], stache: null, beard: null, top: '#e0562f', topDark: '#b0402a', collar: '#b0402a', sleeves: null, legs: '#4a78b8', belt: null };   // young Abid (flashbacks)
export const YOUNG_DAD = { ...DAD, c19: ['youngdad', 'uniform'], hairColor: '#4a3020' };                                                                                   // Dad, 20 years younger
export const MIA = { c19: ['mia', 'marine'] };
export const SHOPPER = (i) => ({ c19: [['mara', 'cardigan'], ['omar', 'workwear'], ['june', 'workwear'], ['ines', 'marine']][i % 4], ...[{ skin: '#f5d6b8', hair: 'bun', hairColor: '#5a3825', top: '#c96f8a', topDark: '#8d4a60', legs: '#4a3f6e', eyes: 'dark', lashes: true },
  { skin: '#a8714a', hair: 'short', hairColor: '#1d1410', top: '#e0a24a', topDark: '#b07a2a', legs: '#2e3344', eyes: 'dark' },
  { skin: '#e8c4a0', hair: 'short', hairColor: '#8d8a96', top: '#6b7f5a', topDark: '#46573a', legs: '#3a3a44', eyes: 'dark', glasses: true },
  { skin: '#d6a074', hair: 'long', hairColor: '#2a1d18', top: '#3fa7f5', topDark: '#2a78b8', legs: '#2e3344', eyes: 'dark', lashes: true }][i % 4] });

// ---------- expressions: eyes, lids, brows, mouth, extras ----------
export const TOON_EXPR = {
  neutral: { eye: 1, lid: 0, brow: [0, 0], mouth: 'flatSmile' },
  smile: { eye: 1, lid: 0.15, brow: [0.1, 0.1], mouth: 'smile', blush: 0.5 },
  happy: { eye: 0.9, lid: 0.25, brow: [0.25, 0.25], mouth: 'open', blush: 0.7 },
  joy: { eye: 0, lid: 0, brow: [0.35, 0.35], mouth: 'laugh', blush: 0.9, happyEyes: true },
  laugh: { eye: 0, lid: 0, brow: [0.3, 0.3], mouth: 'laugh', blush: 0.9, happyEyes: true, bounce: true },
  smug: { eye: 0.9, lid: 0.45, brow: [0.2, -0.15], mouth: 'smirk' },
  fake: { eye: 1.05, lid: 0, brow: [-0.25, -0.25], mouth: 'tightSmile', sweat: true },          // forced smile, worried brows
  awkward: { eye: 1, lid: 0.1, brow: [-0.2, 0.15], mouth: 'wavy', sweat: true },
  angry: { eye: 0.9, lid: 0.3, brow: [-0.7, -0.7], angryBrow: true, mouth: 'frownTeeth', red: 0.25 },
  furious: { eye: 0.8, lid: 0.35, brow: [-0.9, -0.9], angryBrow: true, mouth: 'shout', red: 0.5, vein: true },
  sad: { eye: 1, lid: 0.35, brow: [-0.1, -0.1], sadBrow: true, mouth: 'frown' },
  cry: { eye: 0, lid: 0, brow: [-0.15, -0.15], sadBrow: true, mouth: 'cry', tears: true, closedEyes: true },
  worried: { eye: 1.05, lid: 0.1, brow: [0.0, 0.0], sadBrow: true, mouth: 'wavy' },
  nervous: { eye: 1.1, lid: 0, brow: [0.05, 0.05], sadBrow: true, mouth: 'tightSmile', sweat: true },
  shocked: { eye: 1.35, lid: 0, brow: [0.7, 0.7], mouth: 'o', small: true },
  surprised: { eye: 1.2, lid: 0, brow: [0.55, 0.55], mouth: 'smallO' },
  thinking: { eye: 1, lid: 0.25, brow: [0.35, -0.2], mouth: 'side', look: [0.6, -0.5] },
  confused: { eye: 1, lid: 0.1, brow: [0.5, -0.4], mouth: 'wavy' },
  determined: { eye: 0.95, lid: 0.3, brow: [-0.5, -0.5], angryBrow: true, mouth: 'flat' },
  tired: { eye: 1, lid: 0.6, brow: [-0.2, -0.2], mouth: 'flat' },
};

const P = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];

// ---------- the face (used for body heads and giant close-ups) ----------
export function toonFace(g, hx, hy, r, o = {}) {
  const c = o.cast || HERO, ex = { ...(TOON_EXPR[o.expr] || TOON_EXPR.neutral) }, ink = '#1b1424';
  const side = o.front ? 0 : 0.16;                              // 3/4 view: features drift to the facing side
  const fx = hx + r * side, look = o.look || ex.look || [0, 0];
  g.save(); g.lineCap = 'round'; g.lineJoin = 'round';
  // CLEAN face (default since 2026-11-22, user: "minimal clear face"): dark glossy eyes like the hero sheet, no white bug-eyes,
  // soft brows, constant light blush; features grow a little when the head is small on screen so they still read.
  // o.face === 'classic' (or cast.face) keeps the old white-eye face.
  if ((o.face || c.face) !== 'classic') {
    const T = g.getTransform(), px = r * Math.hypot(T.a, T.b), boost = px < 34 ? Math.min(1.35, Math.pow(34 / Math.max(px, 6), 0.4)) : 1;
    g.fillStyle = alpha('#ff8a8a', 0.13 + 0.3 * (ex.blush || 0)); for (const dx of [-0.5, 0.52]) { g.beginPath(); g.ellipse(fx + dx * r, hy + r * 0.24, r * 0.15, r * 0.085, 0, 0, Math.PI * 2); g.fill(); }
    if (ex.red) { g.fillStyle = alpha('#ff3a3a', ex.red * 0.3); g.beginPath(); g.ellipse(hx, hy - r * 0.2, r * 0.85, r * 0.45, 0, 0, Math.PI * 2); g.fill(); }
    const ey = hy - r * 0.04, exs = [fx - r * 0.3, fx + r * 0.3], sc0 = boost * (ex.eye ? Math.max(0.85, Math.min(1.2, ex.eye)) : 1);
    const ew = r * 0.125 * sc0, eh = r * 0.168 * sc0, lw = Math.max(r * 0.05, 1.2 / Math.hypot(T.a, T.b));
    exs.forEach((x, i) => {
      const sc = o.front ? 1 : (i === 0 ? 0.92 : 1.04), w = ew * sc, h = eh * sc;
      if (o.blink || ex.closedEyes) { g.strokeStyle = ink; g.lineWidth = lw * 1.1; g.beginPath(); g.arc(x, ey - h * 0.1, w * 1.05, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); return; }
      if (ex.happyEyes) { g.strokeStyle = ink; g.lineWidth = lw * 1.25; g.beginPath(); g.arc(x, ey + h * 0.45, w * 1.1, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); return; }
      const lx = look[0] * w * 0.35, ly = look[1] * h * 0.3;
      if (ex.small) {   // shocked / surprised: white eye, tiny pupil (the one face that keeps a white)
        g.fillStyle = '#ffffff'; g.strokeStyle = ink; g.lineWidth = lw * 0.8; g.beginPath(); g.ellipse(x, ey, w * 1.25, h * 1.15, 0, 0, Math.PI * 2); g.fill(); g.stroke();
        circle(g, x + lx, ey + ly, w * 0.5, '#24161a'); circle(g, x + lx + w * 0.18, ey + ly - w * 0.2, w * 0.17, '#ffffff');
      } else {
        g.fillStyle = c.eyes === 'blue' ? '#2a3a6a' : '#24161a'; g.beginPath(); g.ellipse(x + lx * 0.4, ey + ly * 0.4, w, h, 0, 0, Math.PI * 2); g.fill();
        circle(g, x + lx * 0.4 + w * 0.32, ey + ly * 0.4 - h * 0.38, w * 0.4, '#ffffff'); circle(g, x + lx * 0.4 - w * 0.35, ey + ly * 0.4 + h * 0.4, w * 0.17, alpha('#ffffff', 0.85));
      }
      if (ex.lid > 0) { const ww = ex.small ? w * 1.3 : w * 1.08, hh = ex.small ? h * 1.2 : h * 1.08, yl = ey - hh + hh * 2 * Math.min(0.75, ex.lid);
        g.save(); g.beginPath(); g.ellipse(x, ey, ww + lw, hh + lw, 0, 0, Math.PI * 2); g.clip(); g.fillStyle = c.skin; g.fillRect(x - ww * 2, ey - hh * 2, ww * 4, yl - (ey - hh * 2)); g.restore();
        g.strokeStyle = ink; g.lineWidth = lw; g.beginPath(); g.moveTo(x - ww * 1.05, yl + h * 0.05); g.quadraticCurveTo(x, yl - h * 0.06, x + ww * 1.05, yl + h * 0.05); g.stroke(); }
      if (ex.angryBrow && !ex.small) { const inner = i === 0 ? 1 : -1; g.fillStyle = c.skin; g.beginPath(); g.moveTo(x + inner * w * 1.3, ey - h * 0.1); g.lineTo(x + inner * w * 1.3, ey - h * 1.3); g.lineTo(x - inner * w * 1.3, ey - h * 1.3); g.closePath(); g.fill(); }
      if (c.lashes) { const out = i === 0 ? -1 : 1; g.strokeStyle = ink; g.lineWidth = lw * 0.9; g.beginPath(); g.moveTo(x + out * w * 0.75, ey - h * 0.7); g.quadraticCurveTo(x + out * w * 1.2, ey - h * 0.9, x + out * w * 1.45, ey - h * 1.25); g.stroke(); }
    });
    const by = ey - eh * 1.9, bw = r * 0.13;
    exs.forEach((x, i) => {
      const lift = (ex.brow?.[i] || 0) * r * 0.14, inner = i === 0 ? 1 : -1; let tilt = 0; if (ex.angryBrow) tilt = -r * 0.1; if (ex.sadBrow) tilt = r * 0.1;
      g.strokeStyle = shade(c.hairColor || ink, -0.25); g.lineWidth = Math.max(r * 0.065, lw); g.lineCap = 'round';
      g.beginPath(); g.moveTo(x - bw, by - lift - (inner === 1 ? 0 : tilt)); g.quadraticCurveTo(x, by - lift - r * 0.04 - tilt * 0.3, x + bw, by - lift - (inner === 1 ? tilt : 0)); g.stroke();
    });
    faceRest(g, o, c, ex, ink, hx, hy, r, fx, ey, exs, ew * 1.1, Math.max(r * 0.05, lw), look);
    g.restore(); return;
  }
  // cheeks
  if (ex.blush) { g.fillStyle = alpha('#ff8a8a', 0.35 * ex.blush); for (const dx of [-0.52, 0.56]) { g.beginPath(); g.ellipse(fx + dx * r, hy + r * 0.2, r * 0.17, r * 0.1, 0, 0, Math.PI * 2); g.fill(); } }
  if (ex.red) { g.fillStyle = alpha('#ff3a3a', ex.red * 0.35); g.beginPath(); g.ellipse(hx, hy - r * 0.2, r * 0.9, r * 0.5, 0, 0, Math.PI * 2); g.fill(); }
  // eyes
  const ey = hy - r * 0.08, exs = [fx - r * 0.33, fx + r * 0.33], er = r * 0.2 * (ex.small ? 0.85 : 1) * (ex.eye ? Math.max(0.8, ex.eye) : 1);
  exs.forEach((x, i) => {
    const sc = o.front ? 1 : (i === 0 ? 0.9 : 1.04);
    if (o.blink || ex.closedEyes) { g.strokeStyle = ink; g.lineWidth = r * 0.07; g.beginPath(); g.arc(x, ey + r * 0.02, er * 0.8 * sc, Math.PI * 0.15, Math.PI * 0.85); g.stroke(); return; }
    if (ex.happyEyes) { g.strokeStyle = ink; g.lineWidth = r * 0.075; g.beginPath(); g.arc(x, ey + er * 0.4, er * 0.85 * sc, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); return; }
    // white
    g.fillStyle = '#ffffff'; g.strokeStyle = ink; g.lineWidth = r * 0.05; g.beginPath(); g.ellipse(x, ey, er * sc, er * 1.15 * sc * (ex.eye || 1), 0, 0, Math.PI * 2); g.fill(); g.stroke();
    // iris + pupil + highlights
    const px = x + look[0] * er * 0.38, py = ey + look[1] * er * 0.38, pr = er * (ex.small ? 0.42 : 0.62) * sc;
    circle(g, px, py, pr, c.eyes === 'dark' ? '#2a1a14' : '#3a5aa0'); circle(g, px, py, pr * 0.55, '#0b0610');
    circle(g, px - pr * 0.35, py - pr * 0.4, pr * 0.32, '#ffffff'); circle(g, px + pr * 0.35, py + pr * 0.35, pr * 0.14, alpha('#ffffff', 0.8));
    // lids (tired / smug / angry)
    if (ex.lid > 0) { g.save(); g.beginPath(); g.ellipse(x, ey, er * sc * 1.02, er * 1.17 * sc * (ex.eye || 1), 0, 0, Math.PI * 2); g.clip();
      g.fillStyle = c.skin; g.fillRect(x - er * 1.2, ey - er * 1.3, er * 2.4, er * 2.4 * ex.lid); g.strokeStyle = ink; g.lineWidth = r * 0.05;
      g.beginPath(); g.moveTo(x - er * 1.2, ey - er * 1.3 + er * 2.4 * ex.lid); g.lineTo(x + er * 1.2, ey - er * 1.3 + er * 2.4 * ex.lid); g.stroke(); g.restore(); }
    if (c.lashes) { g.strokeStyle = ink; g.lineWidth = r * 0.04; for (const k of [-0.6, 0, 0.6]) { g.beginPath(); g.moveTo(x + k * er * 0.7, ey - er * 1.05); g.lineTo(x + k * er * 0.95, ey - er * 1.35); g.stroke(); } }
  });
  // brows
  const by = ey - er * 1.55, bw = r * 0.2;
  exs.forEach((x, i) => {
    const lift = (ex.brow?.[i] || 0) * r * 0.18, inner = i === 0 ? 1 : -1;
    let tilt = 0; if (ex.angryBrow) tilt = -r * 0.13; if (ex.sadBrow) tilt = r * 0.16;   // fixed 2026-11-21: inner end DOWN = angry, UP = sad/worried
    g.strokeStyle = shade(c.hairColor || ink, -0.2); g.lineWidth = r * 0.09;
    g.beginPath(); g.moveTo(x - bw, by - lift - (inner === 1 ? 0 : tilt)); g.quadraticCurveTo(x, by - lift - r * 0.05 - tilt * 0.3, x + bw, by - lift - (inner === 1 ? tilt : 0)); g.stroke();
  });
  faceRest(g, o, c, ex, ink, hx, hy, r, fx, ey, exs, er, r * 0.065, look);
  g.restore();
}

function faceRest(g, o, c, ex, ink, hx, hy, r, fx, ey, exs, er, lw, look) {
  // mouth
  const mx = fx + r * 0.02, my = hy + r * 0.48, talk = o.talk || 0;
  g.strokeStyle = ink; g.lineWidth = lw;
  const fillMouth = (w, h, tongue = true) => { g.fillStyle = '#5a1a26'; g.beginPath(); g.ellipse(mx, my, w, h, 0, 0, Math.PI * 2); g.fill(); g.stroke();
    if (tongue && h > r * 0.08) { g.fillStyle = '#ff7a8a'; g.beginPath(); g.ellipse(mx, my + h * 0.45, w * 0.6, h * 0.45, 0, 0, Math.PI * 2); g.fill(); } };
  if (talk > 0.05 && !['laugh', 'shout'].includes(ex.mouth)) fillMouth(r * 0.16, r * (0.04 + 0.16 * talk));
  else switch (ex.mouth) {
    case 'smile': g.beginPath(); g.arc(mx, my - r * 0.22, r * 0.3, 0.35, Math.PI - 0.35); g.stroke(); break;
    case 'flatSmile': g.beginPath(); g.arc(mx, my - r * 0.3, r * 0.3, 0.6, Math.PI - 0.6); g.stroke(); break;
    case 'open': g.fillStyle = '#5a1a26'; g.beginPath(); g.moveTo(mx - r * 0.28, my - r * 0.06); g.quadraticCurveTo(mx, my + r * 0.3, mx + r * 0.28, my - r * 0.06); g.closePath(); g.fill(); g.stroke(); break;
    case 'laugh': g.fillStyle = '#5a1a26'; g.beginPath(); g.moveTo(mx - r * 0.34, my - r * 0.1); g.quadraticCurveTo(mx, my + r * 0.45, mx + r * 0.34, my - r * 0.1); g.closePath(); g.fill(); g.stroke();
      g.fillStyle = '#fff'; g.fillRect(mx - r * 0.24, my - r * 0.09, r * 0.48, r * 0.07); g.fillStyle = '#ff7a8a'; g.beginPath(); g.ellipse(mx, my + r * 0.2, r * 0.14, r * 0.07, 0, 0, Math.PI * 2); g.fill(); break;
    case 'smirk': g.beginPath(); g.moveTo(mx - r * 0.18, my + r * 0.02); g.quadraticCurveTo(mx + r * 0.08, my + r * 0.08, mx + r * 0.26, my - r * 0.1); g.stroke(); break;
    case 'tightSmile': g.beginPath(); g.moveTo(mx - r * 0.28, my - r * 0.04); g.quadraticCurveTo(mx, my + r * 0.1, mx + r * 0.28, my - r * 0.04); g.stroke();
      g.lineWidth = r * 0.03; for (const k of [-0.14, 0, 0.14]) { g.beginPath(); g.moveTo(mx + k * r, my - r * 0.02); g.lineTo(mx + k * r, my + r * 0.05); g.stroke(); } break;
    case 'wavy': g.beginPath(); for (let i = 0; i <= 16; i++) { const u = i / 16, x = mx - r * 0.22 + u * r * 0.44, y = my + Math.sin(u * Math.PI * 2) * r * 0.05; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); break;
    case 'frown': g.beginPath(); g.arc(mx, my + r * 0.22, r * 0.22, Math.PI + 0.55, Math.PI * 2 - 0.55); g.stroke(); break;
    case 'frownTeeth': g.fillStyle = '#fff'; g.beginPath(); g.moveTo(mx - r * 0.24, my + r * 0.08); g.quadraticCurveTo(mx, my - r * 0.08, mx + r * 0.24, my + r * 0.08); g.lineTo(mx + r * 0.2, my + r * 0.14); g.quadraticCurveTo(mx, my + r * 0.04, mx - r * 0.2, my + r * 0.14); g.closePath(); g.fill(); g.stroke(); break;
    case 'shout': fillMouth(r * 0.22, r * 0.2); g.fillStyle = '#fff'; g.fillRect(mx - r * 0.16, my - r * 0.18, r * 0.32, r * 0.06); break;
    case 'cry': g.beginPath(); g.moveTo(mx - r * 0.24, my + r * 0.12); g.quadraticCurveTo(mx, my - r * 0.12, mx + r * 0.24, my + r * 0.12); g.stroke(); break;
    case 'o': fillMouth(r * 0.12, r * 0.17, false); break;
    case 'smallO': fillMouth(r * 0.07, r * 0.09, false); break;
    case 'side': seg(g, [[mx - r * 0.05, my], [mx + r * 0.2, my - r * 0.04]], lw, ink); break;
    default: seg(g, [[mx - r * 0.18, my], [mx + r * 0.18, my]], lw, ink);
  }
  // moustache + goatee (hero)
  if (c.stache === 'curl') { g.strokeStyle = shade(c.hairColor, -0.1); g.lineWidth = lw * 0.95; const sy = my - r * 0.25;   // thin curled moustache, clear of the mouth
    for (const d of [-1, 1]) { g.beginPath(); g.moveTo(mx + d * r * 0.025, sy); g.quadraticCurveTo(mx + d * r * 0.14, sy - r * 0.05, mx + d * r * 0.2, sy + r * 0.005); g.quadraticCurveTo(mx + d * r * 0.25, sy - r * 0.035, mx + d * r * 0.21, sy - r * 0.07); g.stroke(); } }
  if (c.beard === 'goatee') { g.fillStyle = shade(c.hairColor, 0.05); g.beginPath(); g.ellipse(mx, my + r * 0.25 + (talk > 0.05 ? r * 0.12 * talk : 0), r * 0.075, r * 0.06, 0, 0, Math.PI * 2); g.fill(); }
  if (c.glasses) { g.strokeStyle = ink; g.lineWidth = r * 0.05; for (const x of exs) { g.beginPath(); g.arc(x, ey, er * 1.35, 0, Math.PI * 2); g.stroke(); } seg(g, [[exs[0] + er * 1.35, ey], [exs[1] - er * 1.35, ey]], r * 0.04, ink); }
  // extras
  if (ex.tears) { g.fillStyle = '#8fd0ff'; for (const x of exs) { g.beginPath(); g.moveTo(x, ey + er); g.quadraticCurveTo(x - r * 0.08, ey + er + r * 0.22, x, ey + er + r * 0.3); g.quadraticCurveTo(x + r * 0.08, ey + er + r * 0.22, x, ey + er); g.fill(); } }
  if (ex.sweat) { g.fillStyle = '#9fd8ff'; g.strokeStyle = ink; g.lineWidth = r * 0.03; g.beginPath(); g.moveTo(hx - r * 0.72, hy - r * 0.55); g.quadraticCurveTo(hx - r * 0.84, hy - r * 0.32, hx - r * 0.72, hy - r * 0.26); g.quadraticCurveTo(hx - r * 0.6, hy - r * 0.32, hx - r * 0.72, hy - r * 0.55); g.fill(); g.stroke(); }
  if (ex.vein) { g.strokeStyle = '#e0302a'; g.lineWidth = r * 0.05; const vx = hx + r * 0.5, vy = hy - r * 0.62; for (const a of [0, 1.57, 3.14, 4.71]) { g.beginPath(); g.arc(vx + Math.cos(a) * r * 0.1, vy + Math.sin(a) * r * 0.1, r * 0.07, a + 2.4, a + 3.9); g.stroke(); } }
}

// ---------- hair ----------
function hairBack(g, c, hx, hy, r) {
  const col = c.hairColor;
  if (c.hair === 'ponytail') { g.fillStyle = col; g.beginPath(); g.ellipse(hx - r * 0.95, hy + r * 0.1, r * 0.3, r * 0.55, 0.4, 0, Math.PI * 2); g.fill(); }
  if (c.hair === 'long') { g.fillStyle = col; rr(g, hx - r * 1.05, hy - r * 0.3, r * 2.1, r * 1.45, r * 0.4); g.fill(); }
  if (c.hair === 'bun') { circle(g, hx - r * 0.2, hy - r * 1.05, r * 0.36, col); }
}
function hairFront(g, c, hx, hy, r) {
  const col = c.hairColor, hl = shade(col, 0.25);
  if (c.hair === 'curly') { const pts = [[-0.78, -0.42], [-0.6, -0.8], [-0.25, -1.0], [0.15, -1.02], [0.52, -0.86], [0.78, -0.52], [-0.88, -0.05], [0.02, -0.78], [-0.38, -0.6], [0.4, -0.6]];
    for (const [dx, dy] of pts) circle(g, hx + dx * r, hy + dy * r, r * 0.34, col);
    for (const [dx, dy] of pts.slice(0, 6)) { g.strokeStyle = hl; g.lineWidth = r * 0.04; g.beginPath(); g.arc(hx + dx * r, hy + dy * r, r * 0.18, 3.6, 5.2); g.stroke(); } }
  else if (c.hair === 'short') { g.fillStyle = col; g.beginPath(); g.arc(hx, hy - r * 0.08, r * 1.02, Math.PI * 1.05, Math.PI * 1.98); g.closePath(); g.fill(); }
  else if (c.hair === 'swoop') { g.fillStyle = col; g.beginPath(); g.moveTo(hx - r * 1.0, hy - r * 0.1); g.quadraticCurveTo(hx - r * 0.9, hy - r * 1.25, hx + r * 0.3, hy - r * 1.1); g.quadraticCurveTo(hx + r * 1.15, hy - r * 0.9, hx + r * 1.0, hy - r * 0.2); g.quadraticCurveTo(hx + r * 0.3, hy - r * 0.85, hx - r * 0.2, hy - r * 0.55); g.quadraticCurveTo(hx - r * 0.7, hy - r * 0.5, hx - r * 1.0, hy - r * 0.1); g.fill(); }
  else if (['ponytail', 'long', 'bun'].includes(c.hair)) { g.fillStyle = col; g.beginPath(); g.arc(hx, hy - r * 0.05, r * 1.03, Math.PI * 1.02, Math.PI * 2.0); g.quadraticCurveTo(hx + r * 0.2, hy - r * 0.45, hx - r * 1.03, hy - r * 0.05); g.fill(); }
  if (c.cap) { g.fillStyle = c.cap; g.beginPath(); g.arc(hx, hy - r * 0.28, r * 1.0, Math.PI * 1.05, Math.PI * 1.95); g.closePath(); g.fill(); rr(g, hx - r * 0.2, hy - r * 0.42, r * 1.4, r * 0.18, r * 0.08); g.fill(); }
}

// soft round shading on the head (no hard half-face line): darker toward the lower back edge, a light glint top-front
function softShade(g, x, y, r) { g.save(); g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.clip();
  const gr = g.createRadialGradient(x + r * 0.25, y - r * 0.3, r * 0.2, x + r * 0.1, y - r * 0.1, r * 1.15); gr.addColorStop(0, 'rgba(255,255,255,0.10)'); gr.addColorStop(0.6, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(60,20,30,0.16)');
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore(); }

// head width (user 2026-11-22: "not fat face"): heads are a slim oval, not a full circle. cast.headW overrides (1 = old round head).
export const HEAD_W = 0.84;
// egg head: round crown and cheekbones, the jaw tapers to a softer, narrower chin
function headShape(g, x, y, r, fill) { g.fillStyle = fill; g.beginPath(); g.moveTo(x - r, y); g.arc(x, y, r, Math.PI, 0); g.bezierCurveTo(x + r, y + r * 0.62, x + r * 0.55, y + r * 1.06, x, y + r * 1.06); g.bezierCurveTo(x - r * 0.55, y + r * 1.06, x - r, y + r * 0.62, x - r, y); g.fill(); }
function slim(g, head, c, fn) { const k = c.headW || HEAD_W; g.save(); g.translate(head[0], head[1]); g.scale(k, 1); g.translate(-head[0], -head[1]); fn(); g.restore(); }

// ---------- full body ----------
export function drawToon(g, o) {
  if (!classic(o, o.cast || HERO)) return draw19(g, { ...o, cast: o.cast || HERO });
  const c = o.cast || HERO, p = o.pose || POSES.stand, s = o.s ?? 1, f = o.facing ?? 1, ink = '#1b1424';
  const rim = o.rim === false ? null : { dir: [-0.8, -0.5], color: '#ffd2a0', w: 3.2, ...(o.rim || {}) };
  g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
  if (o.shadow !== false) { g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(o.x, o.y + 3, 46 * s, 8 * s, 0, 0, Math.PI * 2); g.fill(); }
  const draw = (sil, dx = 0, dy = 0) => { g.save(); g.translate(o.x + dx, o.y + dy); g.scale(f * s, s); body(g, o, c, p, sil, ink); g.restore(); };
  if (rim) { g.save(); g.globalAlpha *= 0.9; draw(rim.color, rim.dir[0] * rim.w * s, rim.dir[1] * rim.w * s); g.restore(); }
  draw(null);
  g.restore();
}
function limb(g, pts, w, col, ink, sil) { seg(g, pts, w + 5, sil || ink); if (!sil) seg(g, pts, w, col); }
function body(g, o, c, p, sil, ink) {
  const skin = c.skin, top = c.top, topD = c.topDark || shade(top, -0.25), legs = c.legs, far = (col) => shade(col, -0.22);
  const HR = 46, head = [p.head[0] + 2, p.head[1] - 18];
  // far leg + far arm
  limb(g, [p.hip, p.kB, p.fB], 17, far(legs), ink, sil);
  if (!sil) { g.fillStyle = far(c.shoes || '#eee'); g.strokeStyle = ink; g.lineWidth = 4; rr(g, p.fB[0] - 10, p.fB[1] - 11, 34, 14, 7); g.fill(); g.stroke(); }
  limb(g, [p.sh, p.eB], 15, far(top), ink, sil); limb(g, [p.eB, p.hB], 12, far(skin), ink, sil);
  if (!sil) circle(g, p.hB[0], p.hB[1], 8, far(skin));
  // back hair
  if (!sil) slim(g, head, c, () => hairBack(g, c, head[0], head[1], HR));
  // torso: rounded shirt
  const sh = p.sh, hip = p.hip, w1 = 30, w2 = 26;
  g.beginPath(); g.moveTo(sh[0] - w1, sh[1] + 4); g.quadraticCurveTo(sh[0], sh[1] - 10, sh[0] + w1, sh[1] + 4);
  g.lineTo(hip[0] + w2, hip[1] + 4); g.quadraticCurveTo(hip[0], hip[1] + 12, hip[0] - w2, hip[1] + 4); g.closePath();
  g.fillStyle = sil || top; g.fill(); if (!sil) { g.strokeStyle = ink; g.lineWidth = 4.5; g.stroke(); }
  if (!sil) {
    if (c.apron) { g.fillStyle = c.apron; rr(g, sh[0] - 22, sh[1] + 22, 44, hip[1] - sh[1] - 12, 8); g.fill(); g.strokeStyle = ink; g.lineWidth = 3; g.stroke(); }
    else { // collar + placket + buttons + pocket
      g.fillStyle = c.collar || topD; g.beginPath(); g.moveTo(sh[0] - 14, sh[1] - 2); g.lineTo(sh[0], sh[1] + 14); g.lineTo(sh[0] + 14, sh[1] - 2); g.lineTo(sh[0] + 4, sh[1] - 6); g.lineTo(sh[0] - 4, sh[1] - 6); g.closePath(); g.fill();
      seg(g, [[sh[0] + 1, sh[1] + 12], [hip[0] + 1, hip[1] - 4]], 2.2, alpha(ink, 0.5));
      for (let k = 0; k < 3; k++) circle(g, sh[0] + 4, sh[1] + 24 + k * 20, 2.6, '#e8eef8');
      g.strokeStyle = alpha(ink, 0.45); g.lineWidth = 2; rr(g, sh[0] - 22, sh[1] + 18, 14, 12, 3); g.stroke(); }
    if (c.belt) { g.fillStyle = c.belt; g.fillRect(hip[0] - w2, hip[1] - 2, w2 * 2, 8); g.fillStyle = '#c8b070'; g.fillRect(hip[0] - 5, hip[1] - 3, 10, 10); }
  }
  // near leg
  limb(g, [p.hip, p.kF, p.fF], 18, legs, ink, sil);
  if (!sil) { g.fillStyle = c.shoes || '#eee'; g.strokeStyle = ink; g.lineWidth = 4; rr(g, p.fF[0] - 10, p.fF[1] - 12, 36, 15, 7); g.fill(); g.stroke(); }
  // near arm: sleeve to the elbow (rolled), skin forearm, hand
  limb(g, [p.sh, p.eF], 16, top, ink, sil);
  if (!sil && c.sleeves === 'rolled') { const m = P(p.sh, p.eF, 0.86); seg(g, [P(p.sh, p.eF, 0.72), m], 19, topD); }
  limb(g, [p.eF, p.hF], 12.5, skin, ink, sil);
  if (!sil) { circle(g, p.hF[0], p.hF[1], 9.5, ink); circle(g, p.hF[0], p.hF[1], 7.5, skin); }
  // head
  if (sil) { slim(g, head, c, () => circle(g, head[0], head[1], HR + 3, sil)); return; }
  seg(g, [[sh[0], sh[1] - 4], [head[0], head[1] + HR * 0.7]], 13, skin);
  slim(g, head, c, () => { headShape(g, head[0], head[1], HR + 3.5, ink); headShape(g, head[0], head[1], HR, c.skin);
  // ear + subtle face shading
  circle(g, head[0] - HR * 0.82, head[1] + 4, 9, ink); circle(g, head[0] - HR * 0.82, head[1] + 4, 7, shade(c.skin, -0.05));
  softShade(g, head[0], head[1], HR);
  hairFront(g, c, head[0], head[1], HR);
  toonFace(g, head[0], head[1], HR, { cast: c, expr: o.expr, talk: o.talk, blink: o.blink, look: o.look, face: o.face }); });
  if (o.prop === 'phone') { g.fillStyle = '#1b1d26'; rr(g, p.hF[0] - 9, p.hF[1] - 30, 22, 38, 5); g.fill(); g.fillStyle = '#8fd0ff'; g.fillRect(p.hF[0] - 6, p.hF[1] - 26, 16, 28); }
}

// ---------- giant face close-up ----------
export function bigToonFace(g, cx, cy, r, o = {}) {
  if (!classic(o, o.cast || HERO)) return face19(g, cx, cy, r, { ...o, cast: o.cast || HERO });
  const c = o.cast || HERO, ink = '#1b1424';
  g.save(); g.translate(cx, cy); if (o.tilt) g.rotate(o.tilt);
  // shoulders
  g.fillStyle = ink; g.beginPath(); g.ellipse(0, r * 1.55, r * 1.45, r * 0.75, 0, Math.PI, 0); g.fill();
  g.fillStyle = c.top; g.beginPath(); g.ellipse(0, r * 1.57, r * 1.4, r * 0.7, 0, Math.PI, 0); g.fill();
  if (!c.apron) { g.fillStyle = c.collar || c.topDark; g.beginPath(); g.moveTo(-r * 0.36, r * 0.86); g.lineTo(0, r * 1.25); g.lineTo(r * 0.36, r * 0.86); g.lineTo(r * 0.12, r * 0.78); g.lineTo(-r * 0.12, r * 0.78); g.closePath(); g.fill(); }
  seg(g, [[0, r * 0.6], [0, r * 0.95]], r * 0.36, c.skin);
  if (o.rimColor) { g.strokeStyle = o.rimColor; g.lineWidth = r * 0.06; g.beginPath(); g.arc(0, 0, r * 1.04, Math.PI * 1.1, Math.PI * 1.75); g.stroke(); }
  g.save(); g.scale(c.headW || HEAD_W, 1); hairBack(g, c, 0, 0, r);
  headShape(g, 0, 0, r * 1.035, ink); headShape(g, 0, 0, r, c.skin);
  softShade(g, 0, 0, r);
  hairFront(g, c, 0, 0, r);
  toonFace(g, 0, 0, r, { cast: c, expr: o.expr, talk: o.talk, blink: o.blink, look: o.look, front: true, face: o.face });
  g.restore(); g.restore();
}
