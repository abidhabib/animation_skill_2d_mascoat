// 3D test: Dad's kitchen in soft cartoon 3D, our 2D cast pinned into it, four smooth camera moves.
import { E, registerShot, ease, prog } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import { drawToon, DAD } from '/engine/toon2d.js';
import { blink, headNum } from '/engine/storyfx.js';
import { cam3, moves, pin, screenOf } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';

const GOLD = '#ffe28a', RIM = { color: '#ffc68a', dir: [-0.7, -0.7], w: 3.5 };
const init = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
function dadAt(g, st, t, p, o = {}) {
  const q = pin(st, p, o.h || 1.7);
  drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: DAD, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'happy', blink: blink(t, 3.2), rim: RIM });
  if (o.num !== false) headNum(g, q.x, q.y - 300 * q.s, '100', t, o.t0 ?? 0.2, { size: Math.max(30, 64 * q.s / 1.6), color: GOLD });
}

// t01 push in: Dad at the counter making tea (back to camera turning), camera glides in
registerShot('t01', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.push([2.6, 1.15, -1.9], 5.2, 3.5, 1.6, [-0.35, 0, 0.94])); },
  overlay(g, t, info, st) { dadAt(g, st, t, st.spots.stove, { facing: -1, pose: breathe(posesAt(t, [[0, 'holdFront'], [1.6, 'relaxed']]), t), expr: t < 1.6 ? 'neutral' : 'happy' }); } });

// t02 side slide: camera tracks sideways past the table, parallax on chairs/lamp, Dad at the counter
registerShot('t02', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.slide([0.6, 1.0, -1.2], -2.0, 1.4, 4.2, 1.35)); },
  overlay(g, t, info, st) { dadAt(g, st, t, st.spots.stove, { facing: -1, pose: breathe(POSES.holdFront, t) }); } });

// t03 crane up: from table-top level (mugs, lamp glow) rising to a high view of the room
registerShot('t03', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.crane([-0.6, 0.9, 0.3], 1.15, 2.8, 4.0)); },
  overlay(g, t, info, st) { dadAt(g, st, t, st.spots.chairOld, { facing: 1, pose: breathe(POSES.sit, t, 0.6), h: 1.7 }); } });

// t04 orbit: slow half-orbit around Dad in the old chair, window glow behind
registerShot('t04', { kind: '3d', init,
  draw(st, t, info) { cam3(st, t, info.dur, moves.orbit([-1.1, 1.0, 0.3], -0.7, 0.35, 4.2, 1.55)); },
  overlay(g, t, info, st) { dadAt(g, st, t, st.spots.chairOld, { facing: 1, pose: breathe(POSES.sit, t, 0.6), expr: 'smile' }); } });
