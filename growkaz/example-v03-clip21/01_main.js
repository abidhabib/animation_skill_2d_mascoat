// V03 Clip 21 "put your own age on it": the first 3D-world clip of the finance channel. One long 3D road (1 metre = 1 year): the NOW arch at age 34, signposts every 5 years,
// a RETIRE arch and cabin at 65. Our 2D cast lives in the 3D world (pin). Camera: orbit-in, a tracking shot along the road, a dolly with a growing measuring tape, a crane.
import { E, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { drawToon, HERO, SAM, ROOMMATE, DAD, MOM, SHOPPER } from '/engine/toon2d.js';
import { blink, headNum } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { lifeRoad3d } from '/engine/sets3d/lifeRoad3d.js';
import { D } from '/engine/props2d.js';
import { FP } from '/engine/finprops.js';
import { GREEN, RED, GOLD, INK, greyed, pop, money } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initR = (T) => { const r = lifeRoad3d(T); Object.assign(r.st, { ageX: r.ageX, tape: r.tape }); return r.st; };
const person = (g, st, p, t, cast, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'smile', look: o.look, blink: blink(t + (o.ph || 0)), rim: RIM, talk: o.talk }); return q; };

// w01 "Now put your own age on it."  you stand under the NOW arch; AGE 34 glows over your head; the camera swings in
registerShot('w01', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-4.2, 1.3, 4.6], look: [-0.2, 1.3, 0], fov: 40 }, to: { pos: [-2.6, 1.5, 3.6], look: [-0.3, 1.35, 0], fov: 34 } }); },
  overlay(g, t, info, st) { const q = person(g, st, [-0.4, 0, 0.5], t, HERO, { pose: breathe(posesAt(t, [[0, 'stand'], [0.5, 'point']]), t), talk: t < 1.5 });
    headNum(g, q.x, q.y - 300 * q.s, 'AGE 34', t, 0.25, { size: Math.max(40, 52 * q.s), color: GREEN });
    const k = pop(t, 0.1, 0.35); if (k > 0) { g.save(); g.translate(E.W / 2, 110); g.scale(k, k); FP.glass(g, -330, -48, 660, 96, { r: 26 }); text(g, 'PUT YOUR AGE ON IT', 0, 4, { size: 46, color: '#ffffff', stroke: 0 }); g.restore(); } } });

// w02 "If you're thirty-four today and it's a Cisco-sized wait, you're sixty when you see your money again."
//   a tracking shot along the road: you walk from 34 to 60, signposts slide past, your hair goes grey; the money comes back at 60
registerShot('w02', { kind: '3d', init: initR,
  draw(st, t, info) { const hx = lerp(0, 26, prog(t, 0.1, info.dur - 0.5)); cam3(st, t, info.dur, { e: 'linear', from: { pos: [-2.8, 1.55, 4.5], look: [1.4, 1.2, 0], fov: 36 }, to: { pos: [23.2 + 0.2, 1.55, 4.5], look: [27.4, 1.2, 0], fov: 36 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0.1, info.dur - 0.5), hx = lerp(0, 26, k), age = Math.round(34 + hx);
    [[ -2 + 8, SAM, 1], [14, MOM, -1]].forEach(([x, cs, f], i) => person(g, st, [st.ageX(46) + (i ? 1.0 : -1.0), 0.32, -1.4], t, cs, { pose: breathe(POSES.sit, t + i), facing: i ? -1 : 1, expr: 'neutral' }));
    person(g, st, [hx, 0, 0.5], t, greyed(HERO, ease.inOut(k)), { pose: walkPose(t * 5.2), expr: k > 0.9 ? 'tired' : 'neutral' });
    const q = pin(st, [hx, 0, 0.5], 1.7); headNum(g, q.x, q.y - 300 * q.s, 'AGE ' + age, t, 0.1, { size: Math.max(40, 50 * q.s), color: k > 0.9 ? GOLD : GREEN });
    FP.glass(g, 70, 60, 440, 130, { r: 26 }); text(g, 'YEARS WAITED', 290, 100, { size: 26, color: '#a8b0c8', stroke: 0 }); text(g, String(Math.round(hx)), 290, 156, { size: 66, color: k > 0.9 ? '#ffd24a' : '#ffffff', stroke: 0 });
    const mk = pop(t, 4.6, 0.4); if (mk > 0) { g.save(); g.translate(E.W / 2, 220); g.scale(mk, mk); FP.glass(g, -300, -60, 600, 120, { r: 28, fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.5)' }); text(g, 'BACK TO EVEN: $10,000', 0, 4, { size: 48, color: '#5affb0', stroke: 0 }); g.restore(); } } });

// w03 "If you're fifty-five and planning to retire at sixty-five, even the Nasdaq's fifteen years doesn't fit."
//   a dolly toward the RETIRE arch while a 3D measuring tape grows: green to 65, then RED 5 years past it
registerShot('w03', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [16.6, 1.75, 4.9], look: [23.5, 1.3, 0], fov: 38 }, to: { pos: [27.4, 2.1, 5.6], look: [31.8, 1.4, 0], fov: 40 } }); st.tape.green.scale.x = Math.max(0.001, 10 * ease.out(prog(t, 1.9, 3.0))); st.tape.red.scale.x = Math.max(0.001, 5 * ease.out(prog(t, 4.1, 5.3))); },
  overlay(g, t, info, st) { const hx = st.ageX(55); const q = person(g, st, [hx, 0, 0.5], t, greyed(HERO, 0.5), { pose: breathe(posesAt(t, [[0, 'stand'], [4.3, 'handsOnHead']]), t), expr: t > 4.3 ? 'worried' : 'neutral', facing: 1 });
    headNum(g, q.x, q.y - 300 * q.s, 'AGE 55', t, 0.2, { size: Math.max(40, 50 * q.s), color: GREEN });
    const a = screenOf(st, [st.ageX(65), 3.9, 0]), k = pop(t, 2.0, 0.4); if (k > 0) { g.save(); g.translate(clamp(a.x, 260, E.W - 260), clamp(a.y - 40, 90, 400)); g.scale(k, k); FP.glass(g, -230, -44, 460, 88, { r: 24, fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.5)' }); text(g, 'RETIRE AT 65', 0, 4, { size: 44, color: '#5affb0', stroke: 0 }); g.restore(); }
    const n = pop(t, 4.2, 0.4); if (n > 0) { g.save(); g.translate(E.W / 2, E.H - 150); g.scale(n, n); FP.glass(g, -330, -52, 660, 104, { r: 26, fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }); text(g, 'NASDAQ: 15 YEARS', 0, 4, { size: 52, color: '#ff8a7a', stroke: 0 }); g.restore(); }
    FP.stamp(g, E.W * 0.5, 330, 0.9, "DOESN'T FIT", '#ff4d5e', prog(t, 5.1, 5.4), { fs: 80, rot: -0.06 }); } });

// w04 "The crash is the headline. The waiting is the damage."  a crane up over the whole road: you, small and grey on a bench; the headline, then the damage
registerShot('w04', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [8.0, 1.5, 5.8], look: [14, 1.0, 0], fov: 38 }, to: { pos: [14.5, 11.5, 22], look: [19, 0.2, 0], fov: 46 } }); },
  overlay(g, t, info, st) { person(g, st, [st.ageX(60), 0.34, -1.4], t, greyed(HERO, 1), { pose: breathe(POSES.sit, t), expr: t > 1.7 ? 'tired' : 'neutral', facing: 1, h: 1.3 });
    const a = ease.out(prog(t, 0.15, 0.55)); if (a > 0) { g.save(); g.globalAlpha = a; FP.glass(g, E.W / 2 - 520, 90 - (1 - a) * 30, 1040, 130, { r: 30 }); text(g, 'THE CRASH IS THE HEADLINE', E.W / 2, 156, { size: 62, color: '#ffffff', stroke: 0 }); g.restore(); }
    const b = ease.out(prog(t, 1.6, 2.0)); if (b > 0) { g.save(); g.globalAlpha = b; FP.glass(g, E.W / 2 - 560, 250 - (1 - b) * 30, 1120, 130, { r: 30, fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }); text(g, 'THE WAITING IS THE DAMAGE', E.W / 2, 316, { size: 62, color: '#ff8a7a', stroke: 0 }); g.restore(); }
    veil(g, '#05030c', 0.35 * ease.in(prog(t, 2.6, info.dur))); } });
