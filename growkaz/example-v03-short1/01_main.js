// V03 Short 1 (9:16, ~30 s): the Nvidia vs Cisco hook as a reel. Semi-3D: verdict stage (cubes, scale, chain), data-center bars, the road of years; 2D big numbers + chips + own captions.
import { E, registerShot as reg0, ease, FONTS, prog, clamp, lerp, rr, text, wordTime } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import { drawToon, HERO } from '/engine/toon2d.js';
import { blink } from '/engine/storyfx.js';
import { cam3, pin, screenOf } from '/engine/three-toon.js';
import { verdict3d } from '/engine/sets3d/verdict3d.js';
import { dataCenter3d } from '/engine/sets3d/dataCenter3d.js';
import { lifeRoad3d } from '/engine/sets3d/lifeRoad3d.js';
import { FP } from '/engine/finprops.js';
import { pop, greyed } from '/engine/finfx.js';

const RIM = { color: '#ffe2b0', dir: [-0.7, -0.7], w: 3.5 };
const initV = (T) => verdict3d(T).st, initD = (T) => dataCenter3d(T).st;
const initR = (T) => { const r = lifeRoad3d(T); Object.assign(r.st, { ageX: r.ageX, tape: r.tape }); return r.st; };
const person = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'neutral', blink: blink(t), rim: RIM, talk: o.talk }); return q; };
// own captions (measured with the real font): 1-3 words, gold active word, soft dark pill above the Shorts UI
function capt(g, gt) { const ws = E.words; let i = -1; for (let k = ws.length - 1; k >= 0; k--) if (gt >= ws[k].start - 0.05) { if (gt <= ws[k].end + 0.4) i = k; break; } if (i < 0) return;
  let st = i; while (st > 0 && i - st < 2 && !/[.,?!]$/.test(ws[st - 1].word)) st--; const grp = []; for (let k = st; k < ws.length && grp.length < 3; k++) { grp.push(k); if (/[.,?!]$/.test(ws[k].word)) break; } if (!grp.includes(i)) { grp.length = 0; grp.push(i); }
  const sz = 70; g.save(); g.font = `700 ${sz}px "${FONTS.title}"`; const strs = grp.map(k => ws[k].word.replace(/[.,!]$/, '').toUpperCase()), wd = strs.map(s => g.measureText(s).width + 10), gap = 34, tot = wd.reduce((a, b) => a + b, 0) + gap * (strs.length - 1);
  const y = E.H * 0.76; g.fillStyle = 'rgba(11,6,32,.55)'; rr(g, E.W / 2 - tot / 2 - 34, y - 58, tot + 68, 116, 40); g.fill(); g.restore();
  let x = E.W / 2 - tot / 2; strs.forEach((s, j) => { const cur = grp[j] === i, p = cur ? 1 + 0.1 * ease.out(prog(gt, ws[grp[j]].start, ws[grp[j]].start + 0.12)) : 1; g.save(); g.translate(x + wd[j] / 2, y + 2); g.scale(p, p); text(g, s, 0, 0, { size: sz, color: cur ? '#ffd84a' : '#ffffff', stroke: 10, strokeColor: '#0b0620' }); g.restore(); x += wd[j] + gap; }); }
const registerShot = (id, def) => reg0(id, { ...def, overlay(g, t, info, st) { def.overlay && def.overlay(g, t, info, st); capt(g, info.globalT); } });
const wt = (info, w, after = 0) => { const x = wordTime(w, info.shot.start + after); return x == null ? null : x - info.shot.start; };
const chip = (g, y, str, t, t0, o = {}) => { const k = pop(t, t0, 0.35); if (k <= 0) return; const fs = o.fs || 54; g.save(); g.font = `800 ${fs}px "${FONTS.title}"`; const w = Math.min(E.W - 80, g.measureText(str).width + 80); g.restore();
  g.save(); g.translate(E.W / 2, y); g.scale(k, k); FP.glass(g, -w / 2, -fs * 0.95, w, fs * 1.9, { r: 26, fill: o.fill || 'rgba(14,20,44,.94)', border: o.border || 'rgba(140,170,255,.5)' }); text(g, str, 0, 4, { size: fs, color: o.col || '#ffffff', stroke: 0 }); g.restore(); };
const GRN = { col: '#5affb0', fill: 'rgba(10,40,24,.95)', border: 'rgba(90,255,176,.55)' }, RED = { col: '#ff8a7a', fill: 'rgba(40,10,14,.95)', border: 'rgba(255,100,110,.6)' }, YEL = { col: '#ffd24a', fill: 'rgba(40,32,10,.95)', border: 'rgba(255,210,74,.55)' };
const big = (g, y, str, col, sc = 1) => { g.save(); g.translate(E.W / 2, y); g.scale(sc, sc); text(g, str, 0, 0, { size: 190, color: col, stroke: 14, strokeColor: '#0b0620' }); g.restore(); };
const NV = { from: { pos: [3.9, 2.0, 3.8], look: [3.9, 1.5, -1.5], fov: 50 }, to: { pos: [3.9, 1.9, 3.0], look: [3.9, 1.5, -1.5], fov: 50 } };
const CS = { from: { pos: [-3.9, 2.0, 3.8], look: [-3.9, 1.5, -1.5], fov: 50 }, to: { pos: [-3.9, 1.9, 3.0], look: [-3.9, 1.5, -1.5], fov: 50 } };

// h1 HOOK: the number is on screen in the first frame
registerShot('h1', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('R', 12); st.setCoins('L', 6); cam3(st, t, info.dur, NV); },
  overlay(g, t, info, st) { big(g, E.H * 0.17, '$10,000', '#ffd24a', 1 + 0.06 * ease.out(prog(t, 0, 0.3))); chip(g, E.H * 0.29, 'NVIDIA  ·  AT THE PEAK', t, 0.3, { ...YEL, fs: 50 }); } });

// h2 "Six weeks later, about six thousand."  the number drains
registerShot('h2', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); const k = prog(t, 0.5, 1.8); st.setCoins('R', Math.round(lerp(12, 7, k))); st.setCoins('L', 6); cam3(st, t, info.dur, { from: NV.to, to: { pos: [3.9, 1.8, 3.4], look: [3.9, 1.5, -1.5], fov: 50 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0.5, 1.8), v = Math.round(lerp(10000, 6000, ease.inOut(k)) / 100) * 100; big(g, E.H * 0.17, '$' + v.toLocaleString('en-US'), k > 0.2 ? '#ff6a6a' : '#ffd24a', 1 + 0.05 * Math.sin(prog(t, 0.4, 1.9) * 20) * (1 - k)); chip(g, E.H * 0.29, '6 WEEKS LATER', t, 0.2, { ...RED, fs: 50 }); } });

// h3 "Someone did the exact same thing in two thousand, with Cisco."  the camera slides over to the Cisco cube
registerShot('h3', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('R', 7); st.setCoins('L', 14); cam3(st, t, info.dur, { from: { pos: [3.9, 1.8, 3.4], look: [3.9, 1.5, -1.5], fov: 50 }, to: CS.from }); },
  overlay(g, t, info, st) { big(g, E.H * 0.17, '2000', '#8fc8ff', 1); chip(g, E.H * 0.29, 'THE SAME MOVE  ·  CISCO', t, wt(info, 'Someone') ?? 0.2, { ...YEL, fs: 50 }); } });

// h4 "Most valuable company on Earth. Everyone said, you can't lose."
registerShot('h4', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('R', 7); st.setCoins('L', 16); cam3(st, t, info.dur, CS); },
  overlay(g, t, info, st) { big(g, E.H * 0.17, '#1', '#ffd24a', 1 + 0.05 * Math.sin(t * 3)); chip(g, E.H * 0.29, 'MOST VALUABLE ON EARTH', t, 0.2, { ...YEL, fs: 46 }); chip(g, E.H * 0.38, "\"YOU CAN'T LOSE\"", t, wt(info, "can't") ?? 2.6, { ...GRN, fs: 52 }); } });

// h5 "Cisco fell almost ninety percent. And here's the brutal part."  the Cisco pile crashes
registerShot('h5', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('R', 7); const k = prog(t, 0.6, 1.8); st.setCoins('L', Math.round(lerp(16, 2, ease.in(k)))); st.hg.scale.setScalar(Math.max(0.001, ease.out(prog(t, 2.0, 2.8)))); st.setSand(prog(t, 2.2, 3.4)); cam3(st, t, info.dur, { from: CS.to, to: { pos: [-3.9, 2.1, 3.9], look: [-3.9, 1.6, -1.5], fov: 50 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0.6, 1.8); big(g, E.H * 0.17, '-' + Math.round(90 * ease.out(k)) + '%', '#ff4d5e', 1); chip(g, E.H * 0.29, 'CISCO: DOWN ALMOST 90%', t, 1.0, { ...RED, fs: 46 }); chip(g, E.H * 0.38, 'AND HERE IS THE BRUTAL PART', t, 2.2, { ...YEL, fs: 42 }); } });

// h6 "The company didn't fail. Its sales doubled."  two bars, the second is twice the first
registerShot('h6', { kind: '3d', init: initD,
  draw(st, t, info) { st.upd(t); st.setBars(0.6 * ease.out(prog(t, 0.2, 0.8)), 0.554 * ease.out(prog(t, 1.6, 2.3))); cam3(st, t, info.dur, { from: { pos: [-0.6, 1.9, -2.6], look: [0, 1.0, -11], fov: 52 }, to: { pos: [0.6, 2.4, -3.2], look: [0, 1.0, -11], fov: 52 } }); },
  overlay(g, t, info, st) { chip(g, E.H * 0.15, "THE COMPANY DIDN'T FAIL", t, 0.2, { ...GRN, fs: 46 }); const k = pop(t, 1.9, 0.4); if (k > 0) big(g, E.H * 0.3, 'SALES x2', '#5affb0', k); } });

// h7 "Holders still waited almost twenty-six years to get their money back."  the road of years
registerShot('h7', { kind: '3d', init: initR,
  draw(st, t, info) { cam3(st, t, info.dur, { e: 'linear', from: { pos: [-2.4, 1.7, 4.8], look: [0.8, 1.3, 0], fov: 52 }, to: { pos: [22.2, 1.7, 4.8], look: [25.4, 1.3, 0], fov: 52 } }); },
  overlay(g, t, info, st) { const k = prog(t, 0, info.dur - 0.3), hx = lerp(0, 25.5, k); person(g, st, [hx, 0, 0.6], t, { cast: greyed(HERO, ease.inOut(k)), pose: walkPose(t * 5.2), expr: k > 0.8 ? 'tired' : 'neutral' });
    const y = Math.round(26 * ease.out(prog(t, 0.6, 2.9))); big(g, E.H * 0.17, y + ' YEARS', '#ffd24a', 1); chip(g, E.H * 0.29, 'TO GET THEIR MONEY BACK', t, 0.4, { ...RED, fs: 46 }); } });

// h8 "Nvidia isn't priced like Cisco was."  the scale: Cisco heavy, Nvidia lighter
registerShot('h8', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); const k = ease.out(prog(t, 0.3, 1.2)); st.setCoins('L', 16); st.setCoins('R', 5); st.setTilt(0.26 * k); cam3(st, t, info.dur, { from: { pos: [0, 3.0, 12.6], look: [0, 1.7, 0], fov: 52 }, to: { pos: [0, 2.8, 11.4], look: [0, 1.7, 0], fov: 52 } }); },
  overlay(g, t, info, st) { chip(g, E.H * 0.15, "NVIDIA ISN'T PRICED LIKE CISCO", t, 0.2, { ...GRN, fs: 44 }); const a = 0.26, lp = screenOf(st, [-2.3 * Math.cos(a), 2.7 - 2.3 * Math.sin(a) + 1.0, 0.5]), rp = screenOf(st, [2.3 * Math.cos(a), 2.7 + 2.3 * Math.sin(a) + 1.0, 0.5]);
    const k = pop(t, 1.0, 0.35); if (k > 0) { text(g, 'CISCO 2000', lp.x, lp.y - 40, { size: 44, color: '#ff8a7a', stroke: 8, strokeColor: '#0b0620' }); text(g, 'NVIDIA', rp.x, rp.y - 40, { size: 44, color: '#5affb0', stroke: 8, strokeColor: '#0b0620' }); } } });

// h9 "But it shares one thing that's far more dangerous."  a chain links the two
registerShot('h9', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); st.setCoins('L', 6); st.setCoins('R', 6); st.setTilt(0); st.chain.scale.x = Math.max(0.001, ease.inOut(prog(t, 0.3, 1.8))); cam3(st, t, info.dur, { from: { pos: [0, 2.8, 12.4], look: [0, 1.5, -1.5], fov: 52 }, to: { pos: [0, 2.4, 10.4], look: [0, 1.5, -1.5], fov: 52 } }); },
  overlay(g, t, info, st) { chip(g, E.H * 0.15, 'ONE THING IN COMMON', t, 0.2, { ...YEL, fs: 50 }); chip(g, E.H * 0.25, 'FAR MORE DANGEROUS', t, wt(info, 'dangerous') ?? 1.8, { ...RED, fs: 50 }); } });

// h10 "And it's not the chart. Full breakdown on my channel."  back on the Nvidia cube; the last frame matches the first ($10,000) so it loops
registerShot('h10', { kind: '3d', init: initV,
  draw(st, t, info) { st.upd(t); const back = prog(t, info.dur - 0.7, info.dur - 0.2); st.setCoins('R', back > 0.5 ? 12 : 7); st.setCoins('L', 6); cam3(st, t, info.dur, { from: { pos: [3.9, 1.8, 3.4], look: [3.9, 1.5, -1.5], fov: 50 }, to: { pos: [3.9, 2.0, 3.8], look: [3.9, 1.5, -1.5], fov: 50 } }); },
  overlay(g, t, info, st) { const back = prog(t, info.dur - 0.7, info.dur - 0.2); g.save(); g.globalAlpha = 1 - back; big(g, E.H * 0.15, '$6,000', '#ff6a6a', 1); g.restore(); g.save(); g.globalAlpha = back; big(g, E.H * 0.15, '$10,000', '#ffd24a', 1); g.restore();
    const k = pop(t, 0.2, 0.35); if (k > 0) { g.save(); g.globalAlpha = 1 - back; text(g, 'NOT THE CHART.', E.W / 2, E.H * 0.255, { size: 66, color: '#ffffff', stroke: 10, strokeColor: '#0b0620' }); g.restore(); }
    chip(g, E.H * 0.325, 'FULL BREAKDOWN ON MY CHANNEL', t, wt(info, 'Full') ?? 1.2, { ...GRN, fs: 40 }); } });
