// storyfx.js: shared story helpers for our clips (2026-11-21).
//   blink(t, period)                      natural blink timing
//   headNum(g, x, y, str, t, t0, {color, size})   glowing trust number popping ON a head (back.out), gentle bob
//   numChange(g, x, y, from, to, t, tSwitch, o)    number that changes in place (old pops out, new pops in), colour by direction
//   floater(g, x, y, str, t, t0, color)            "+5" / "-3" that drifts away and fades (rises if +, sinks if -)
//   camEase(t, dur, o)                    smooth eased camera {z, x, y}: o = {z0, z1, x0, x1, y0, y1}; ALWAYS use this (user: smooth zoom)
import { ease, prog, glow, text, lerp } from '/engine/core.js';

export const blink = (t, p = 3.1) => (t % p) > p - 0.12;
export function headNum(g, x, y, str, t, t0 = 0, o = {}) {
  const k = ease.outBack(prog(t, t0, t0 + 0.35)); if (k <= 0 || !str) return;
  const col = o.color || '#8dffc8';
  g.save(); g.translate(x, y - 8 * Math.sin(t * 2)); g.scale(k, k);
  glow(g, 0, 0, 90, col, 0.45);
  text(g, String(str), 0, 0, { size: o.size || 64, color: '#ffffff', glow: 18, glowColor: col, stroke: 8, strokeColor: '#0b0620' });
  g.restore();
}
export function numChange(g, x, y, from, to, t, tSwitch, o = {}) {
  const up = Number(to) > Number(from);
  if (t < tSwitch) { headNum(g, x, y, from, t, o.t0 ?? 0, o); return; }
  const out = 1 - ease.in(prog(t, tSwitch, tSwitch + 0.15));
  if (out > 0) { g.save(); g.globalAlpha = out; headNum(g, x, y, from, t, -1, o); g.restore(); }
  headNum(g, x, y, to, t, tSwitch + 0.1, { ...o, color: up ? '#8dffc8' : '#ff8a7a' });
  floater(g, x + 120, y, (up ? '+' : '') + (Number(to) - Number(from)), t, tSwitch, up ? '#6dff8a' : '#ff5a5a');
}
export function floater(g, x, y, str, t, t0, col) {
  const p = prog(t, t0, t0 + 1.2); if (p <= 0 || p >= 1) return;
  const dir = String(str).startsWith('-') ? 1 : -1;
  g.save(); g.globalAlpha = 1 - p; text(g, String(str), x, y + dir * 90 * ease.out(p), { size: 58, color: col, stroke: 7, strokeColor: '#0b0620' }); g.restore();
}
export function camEase(t, dur, o = {}) {
  const k = ease.inOut(Math.min(1, Math.max(0, t / dur)));
  return { z: lerp(o.z0 ?? 1.0, o.z1 ?? 1.06, k), x: lerp(o.x0 ?? 0, o.x1 ?? 0, k), y: lerp(o.y0 ?? 0, o.y1 ?? 0, k) };
}
