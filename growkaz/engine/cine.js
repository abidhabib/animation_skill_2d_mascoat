// cine.js: shared helpers for cinematic 9:16 story reels: speech-synced mouths, captions, eased handheld camera, light motes, vignette.
import { E, ease, prog, clamp, lerp, rr, circle, alpha, text, rng, FONTS } from '/engine/core.js';
const W = () => E.W, H = () => E.H;
// lines: [{who, s, e}] from the dialogue edit. speak(gt, who) -> {talk, phoneme} for the character that is speaking, else {}.
const VIS = { a: 'A', e: 'E', i: 'I', y: 'I', o: 'O', u: 'U', m: 'M', b: 'M', p: 'M', f: 'F', v: 'F', l: 'L', w: 'W' };
export const speaker = (lines) => (gt, who) => {
  if (!lines.some((l) => l.who === who && gt >= l.s - 0.02 && gt <= l.e + 0.04)) return {};
  const w = E.words.find((w) => gt >= w.start && gt <= w.end); if (!w) return { phoneme: 'rest', talk: 0 };   // closed in every pause
  const letters = w.word.toLowerCase().replace(/[^a-z]/g, '') || 'a', k = clamp((gt - w.start) / Math.max(0.05, w.end - w.start), 0, 0.999);
  const ch = letters[Math.floor(k * letters.length)];
  return { phoneme: VIS[ch] || (Math.sin(gt * 22) > 0 ? 'E' : 'L'), talk: 0.5 };
};
export function capt(g, gt, yk = 0.775) {
  const ws = E.words; let i = -1; for (let k = ws.length - 1; k >= 0; k--) if (gt >= ws[k].start - 0.05) { if (gt <= ws[k].end + 0.4) i = k; break; } if (i < 0) return;
  const ends = (k) => /[.?!,]$/.test(ws[k].word); let st = 0; for (let k = 0; k <= i;) { st = k; let n = 0; while (k < ws.length && n < 3) { n++; if (ends(k++)) break; } }
  const grp = []; for (let k = st; k < ws.length && grp.length < 3; k++) { grp.push(k); if (ends(k)) break; }
  const sz = 70; g.save(); g.font = `700 ${sz}px "${FONTS.title}"`;
  const strs = grp.map((k) => ws[k].word.replace(/[.,!]$/, '').toUpperCase()), wd = strs.map((s) => g.measureText(s).width + 10), gap = 30, tot = wd.reduce((a, b) => a + b, 0) + gap * (strs.length - 1), k0 = Math.min(1, (E.W - 150) / tot);
  g.translate(E.W / 2, E.H * yk); g.scale(k0, k0); g.fillStyle = 'rgba(11,6,32,.58)'; rr(g, -tot / 2 - 34, -58, tot + 68, 116, 40); g.fill();
  let x = -tot / 2; strs.forEach((s, j) => { const cur = grp[j] === i, p = cur ? 1 + 0.1 * ease.out(prog(gt, ws[grp[j]].start, ws[grp[j]].start + 0.12)) : 1; g.save(); g.translate(x + wd[j] / 2, 2); g.scale(p, p); text(g, s, 0, 0, { size: sz, color: cur ? '#ffd84a' : '#ffffff', stroke: 10, strokeColor: '#0b0620' }); g.restore(); x += wd[j] + gap; });
  g.restore();
}
// eased zoom + pan to a focus point (fractions of the frame) with a gentle handheld sway. from/to = [zoom, fx, fy]
export function cam(g, t, dur, from, to, fn) {
  const k = ease.inOut(clamp(t / dur)), z = lerp(from[0], to[0], k), fx = lerp(from[1], to[1], k), fy = lerp(from[2], to[2], k), sx = Math.sin(t * 1.7) * 5 + Math.sin(t * 3.1) * 2, sy = Math.cos(t * 1.3) * 5;
  g.save(); g.translate(W() / 2 + sx, H() / 2 + sy); g.scale(z, z); g.translate(-fx * W(), -fy * H()); fn(k); g.restore();
}
export const grad = (g, stops) => { const gr = g.createLinearGradient(0, 0, 0, H()); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); };
export const motes = (g, t, col = '#ffe9b0', n = 30) => { const r = rng(9); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = r() * W(), s = 3 + r() * 6, y = ((r() * H() - t * (18 + r() * 40)) % H() + H()) % H(); circle(g, x + Math.sin(t + i) * 18, y, s, alpha(col, 0.15 + 0.12 * Math.sin(t * 2 + i))); } g.restore(); };
export const vig = (g, a = 0.5) => { const v = g.createRadialGradient(W() / 2, H() * 0.5, W() * 0.35, W() / 2, H() * 0.5, H() * 0.72); v.addColorStop(0, 'rgba(8,4,20,0)'); v.addColorStop(1, `rgba(8,4,20,${a})`); g.fillStyle = v; g.fillRect(0, 0, W(), H()); };
