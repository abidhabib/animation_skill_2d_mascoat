// cine.js: shared helpers for cinematic 9:16 story reels: speech-synced mouths, captions, eased handheld camera, light motes, vignette.
import { E, ease, clamp, lerp, circle, alpha, rng } from '/engine/core.js';
import { capt2 } from '/engine/popups.js';
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
// captions: designed styles live in popups.js. style: 'punch' | 'strip' | 'serif' (pick one per video)
export function capt(g, gt, yk = 0.775, style = 'punch', accent) { capt2(g, gt, { y: yk, style, accent }); }
// eased zoom + pan to a focus point (fractions of the frame) with a gentle handheld sway. from/to = [zoom, fx, fy]
export function cam(g, t, dur, from, to, fn) {
  const k = ease.inOut(clamp(t / dur)), z = lerp(from[0], to[0], k), fx = lerp(from[1], to[1], k), fy = lerp(from[2], to[2], k), sx = Math.sin(t * 1.7) * 5 + Math.sin(t * 3.1) * 2, sy = Math.cos(t * 1.3) * 5;
  g.save(); g.translate(W() / 2 + sx, H() / 2 + sy); g.scale(z, z); g.translate(-fx * W(), -fy * H()); fn(k); g.restore();
}
export const grad = (g, stops) => { const gr = g.createLinearGradient(0, 0, 0, H()); stops.forEach(([p, c]) => gr.addColorStop(p, c)); g.fillStyle = gr; g.fillRect(-W(), -H(), W() * 3, H() * 3); };
export const motes = (g, t, col = '#ffe9b0', n = 30) => { const r = rng(9); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < n; i++) { const x = r() * W(), s = 3 + r() * 6, y = ((r() * H() - t * (18 + r() * 40)) % H() + H()) % H(); circle(g, x + Math.sin(t + i) * 18, y, s, alpha(col, 0.15 + 0.12 * Math.sin(t * 2 + i))); } g.restore(); };
export const vig = (g, a = 0.5) => { const v = g.createRadialGradient(W() / 2, H() * 0.5, W() * 0.35, W() / 2, H() * 0.5, H() * 0.72); v.addColorStop(0, 'rgba(8,4,20,0)'); v.addColorStop(1, `rgba(8,4,20,${a})`); g.fillStyle = v; g.fillRect(0, 0, W(), H()); };
