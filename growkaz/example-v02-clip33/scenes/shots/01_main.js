// V02 Clip 33 "arithmetic" - the ending. 3D kitchen / park / bedroom recaps (sets3d) + 2D inserts, our cast, the comment ask, the share ask.
import { E, V, registerShot, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, text, veil } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM, MOM, DAD, KID, YOUNG_DAD, STRANGER } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater, camEase, handPhone } from '/engine/storyfx.js';
import { cam3, moves, pin, screenOf } from '/engine/three-toon.js';
import { kitchen3d } from '/engine/sets3d/kitchen3d.js';
import { park3d } from '/engine/sets3d/park3d.js';
import { bedroom3d } from '/engine/sets3d/bedroom3d.js';
import { bike } from '/engine/sets/park.js';

const RED = '#ff8a7a', GREEN = '#8dffc8', GOLD = '#ffe28a', RIM = { color: '#ffd2a0', dir: [0.7, -0.7], w: 3.5 };
const ZERO = { ...STRANGER, skin: '#a89a9e', top: '#2a2a33', topDark: '#1a1a22', collar: '#1a1a22', hair: 'short', hairColor: '#1a1a22', legs: '#22222a', shoes: '#22222a' };
const initK = (T) => { const k = kitchen3d(T); k.st.spots = k.spots; return k.st; };
const initP = (T) => { const p = park3d(T, { time: 'sunrise' }); p.st.spots = p.spots; return p.st; };
const initB = (T) => { const b = bedroom3d(T, { time: 'morning', made: 1 }); Object.assign(b.st, { spots: b.spots, bottle: b.bottle }); return b.st; };
const at = (g, st, p, t, o = {}) => { const q = pin(st, p, o.h || 1.7); drawToon(g, { x: q.x, y: q.y, s: q.s, facing: o.facing ?? 1, cast: o.cast || HERO, pose: o.pose || breathe(POSES.stand, t), expr: o.expr || 'smile', look: o.look, blink: o.blink ?? blink(t), rim: RIM, talk: o.talk }); return q; };
const numOn = (g, q, s, t, col = GREEN, t0 = -1, k = 300) => headNum(g, q.x, q.y - k * q.s, s, t, t0, { size: Math.max(32, 46 * q.s), color: col });
const zoomed = (g, c, fn) => { g.save(); g.translate(E.W / 2 + c.x, E.H / 2 + c.y); g.scale(c.z, c.z); g.translate(-E.W / 2, -E.H / 2); fn(); g.restore(); };

// r01 "Every number you saw this week started somewhere."  night-blue space: the week's numbers float past as we fly through them
const NUMS = [['99', GREEN], ['100', GOLD], ['35', GREEN], ['0', RED], ['72', GREEN], ['31', GREEN], ['48', GREEN], ['96', GREEN], ['62', GREEN], ['53', GREEN], ['1', GREEN], ['12', RED], ['88', GREEN], ['41', GREEN]];
registerShot('r01', { draw(g, t, info) {
  g.fillStyle = '#100c22'; g.fillRect(0, 0, E.W, E.H); FX.stars(g, t, { count: 160 }); glow(g, E.W / 2, E.H / 2, 700, '#6a5aff', 0.15);
  const items = NUMS.map(([n, c], i) => { const a = i * 2.4, r = 0.25 + (i % 5) * 0.12; const z = ((i / NUMS.length) + t * 0.22) % 1; return { n, c, x: Math.cos(a) * r, y: Math.sin(a) * r * 0.7, z }; }).sort((a, b) => a.z - b.z);
  for (const it of items) { const s = 0.6 + it.z * it.z * 4, fade = Math.min(1, it.z * 4) * (1 - prog(it.z, 0.85, 1));
    g.save(); g.globalAlpha = fade; headNum(g, E.W / 2 + it.x * E.W * s * 0.9, E.H / 2 + it.y * E.H * s * 0.9, it.n, t, -1, { size: 40 * s, color: it.c }); g.restore(); } } });
// r02 "Mom's ninety-nine took thirty years."  Mom in the warm kitchen, her 99 glowing; sunlight sweeps across the room (years passing)
registerShot('r02', { kind: '3d', init: initK,
  draw(st, t, info) { cam3(st, t, info.dur, moves.push([2.6, 1.2, -1.9], 4.6, 3.5, 1.6, [-0.35, 0, 0.94])); },
  overlay(g, t, info, st) { const q = at(g, st, st.spots.stove, t, { cast: MOM, facing: -1, pose: breathe(posesAt(t, [[0, 'holdFront'], [1.4, 'relaxed']]), t), expr: 'smile', look: [-0.6, 0] }); numOn(g, q, '99', t, GREEN, 0.3);
    const sx = lerp(-200, E.W + 200, prog(t, 0, info.dur)); glow(g, sx, E.H * 0.3, 600, '#ffd8a0', 0.18); } });
// r03 "Dad's hundred took a bike, a fence, and eleven agains."  sunrise park: young Dad runs behind the kid's wobbly bike past the fence; eleven green ticks pop
registerShot('r03', { kind: '3d', init: initP,
  draw(st, t, info) { const k = prog(t, 0, info.dur), x = lerp(-5.5, 1.5, k); st._x = x; cam3(st, t, info.dur, { from: { pos: [-5.2, 1.4, 4.4], look: [-5.4, 0.9, 0], fov: 38 }, to: { pos: [1.9, 1.5, 4.0], look: [1.4, 1.0, 0], fov: 36 } }); },
  overlay(g, t, info, st) { const x = st._x, wob = Math.sin(t * 5) * 0.08;
    const qb = pin(st, [x + 0.35, 0, 0.25], 1.7); bike(g, qb.x, qb.y, qb.s * 0.95, { spin: t * 9, tilt: wob });
    drawToon(g, { x: qb.x + 6 * qb.s, y: qb.y - 70 * qb.s, s: qb.s * 0.62, facing: 1, cast: KID, pose: breathe(POSES.sit, t), expr: t < 1.6 ? 'nervous' : 'happy', blink: blink(t), rim: RIM });
    const qd = at(g, st, [x - 0.55, 0, 0.1], t, { cast: YOUNG_DAD, facing: 1, pose: walkPose(t * 7, { run: true }), expr: 'happy' }); numOn(g, qd, '100', t, GOLD, 1.2);
    for (let i = 0; i < 11; i++) { const p = ease.outBack(prog(t, 2.4 + i * 0.1, 2.6 + i * 0.1)); if (p > 0) { const cx = E.W / 2 - 400 + i * 80, cy = 110; g.save(); g.translate(cx, cy); g.scale(p, p); circle(g, 0, 0, 26, GREEN); g.strokeStyle = '#0b0620'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 26, 0, 7); g.stroke(); seg(g, [[-11, 1], [-3, 10], [12, -9]], 6, '#0b0620'); g.restore(); } } } });
// r04 "Your own thirty-five took a made bed and a glass of water."  bedroom: camera glides from the made bed to you at the desk; you drink; 35 glows
registerShot('r04', { kind: '3d', init: initB,
  draw(st, t, info) { const d = st.spots.desk; st.bottle.visible = t < 2.5;
    cam3(st, t, info.dur, { path: [[-2.2, 1.6, 2.4], [-0.6, 1.6, 2.9], [d[0] - 1.4, 1.6, d[2] + 3.1]], look0: [-0.6, 0.6, -1.9], look1: [d[0] - 0.1, 1.1, d[2] + 0.3], fov0: 38, fov1: 34, e: 'inOut' }); },
  overlay(g, t, info, st) { const drink = t > 2.5, q = at(g, st, st.spots.deskChair, t, { facing: 1, pose: breathe(posesAt(t, [[0, 'sit'], [1.9, 'reach'], [2.5, 'phone']]), t), expr: drink ? 'happy' : 'smile' });
    if (drink) { const hx = q.x + 28 * q.s, hy = q.y - 172 * q.s; g.save(); g.translate(hx, hy); g.rotate(-0.5); rr(g, -9 * q.s, -34 * q.s, 18 * q.s, 46 * q.s, 5 * q.s); g.fillStyle = 'rgba(159,216,240,0.9)'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 3; g.stroke(); g.restore(); }
    numOn(g, q, '35', t, GREEN, 0.3, 292); } });
// r05 "And that one took eleven stations."  the route map, all eleven lit; a small green 1 floats above Central
function routeMap(g, t, lit = 0) {
  g.fillStyle = '#dfe4e8'; g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); g.fillStyle = 'rgba(0,0,0,.05)'; for (let i = 0; i < 12; i++) g.fillRect(0, i * 96, E.W, 2);
  const x0 = 260, x1 = E.W - 260, y = E.H * 0.56; rr(g, x0 - 120, y - 260, x1 - x0 + 240, 470, 36); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#9aa4ae'; g.lineWidth = 6; g.stroke();
  seg(g, [[x0, y], [x1, y]], 22, '#2f8a57');
  for (let i = 0; i <= 11; i++) { const x = lerp(x0, x1, i / 11), end = i === 11, p = ease.outBack(prog(t, 0.1 + i * 0.07, 0.3 + i * 0.07));
    circle(g, x, y, end ? 34 : 22, '#ffffff'); g.strokeStyle = '#2f8a57'; g.lineWidth = 8; g.beginPath(); g.arc(x, y, end ? 34 : 22, 0, 7); g.stroke(); if (p > 0) circle(g, x, y, (end ? 20 : 12) * p, '#2f8a57'); }
  text(g, 'CENTRAL', x1, y + 90, { size: 54, color: '#1b1424', stroke: 0 }); return { x1, y };
}
registerShot('r05', { draw(g, t, info) { const c = camEase(t, info.dur, { z0: 1.0, z1: 1.25, x0: 0, x1: -380, y0: 0, y1: 60 });
  zoomed(g, c, () => { const m = routeMap(g, t); glow(g, m.x1, m.y - 150, 160, '#4affa0', 0.35); headNum(g, m.x1, m.y - 150, '1', t, 0.8, { size: 90, color: GREEN }); }); } });
// r06 "Trust isn't magic."  a big red 0; a cartoon wand swoops in, taps it, sparkles burst... and the 0 just wobbles. Still 0.
registerShot('r06', { draw(g, t, info) {
  g.fillStyle = '#1a1424'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W / 2, E.H / 2, 700, '#a06aff', 0.12);
  const wob = t > 0.45 ? Math.sin((t - 0.45) * 22) * 0.12 * (1 - prog(t, 0.45, 1.2)) : 0;
  g.save(); g.translate(E.W / 2, E.H * 0.52); g.rotate(wob); headNum(g, 0, 0, '0', t, -1, { size: 260, color: RED }); g.restore();
  const k = ease.inOut(prog(t, 0, 0.45)), back = ease.inOut(prog(t, 0.6, 1.1)), wx = lerp(E.W + 200, E.W / 2 + 230, k) + 500 * back, wy = lerp(E.H * 0.1, E.H * 0.3, k) - 200 * back;
  g.save(); g.translate(wx, wy); g.rotate(-0.7); seg(g, [[0, 0], [260, 0]], 22, '#1b1424'); seg(g, [[0, 0], [250, 0]], 14, '#2a2a33'); seg(g, [[190, 0], [250, 0]], 14, '#f4f4f4');
  g.fillStyle = GOLD; g.beginPath(); for (let i = 0; i < 10; i++) { const a = i * Math.PI / 5 - Math.PI / 2, r = i % 2 ? 18 : 42; g.lineTo(-20 + Math.cos(a) * r, Math.sin(a) * r); } g.closePath(); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 5; g.stroke(); g.restore();
  const sp = prog(t, 0.45, 1.1); if (sp > 0 && sp < 1) for (let i = 0; i < 12; i++) { const a = i * 0.52, d = 80 + 260 * ease.out(sp); FX.sparkle(g, E.W / 2 + Math.cos(a) * d, E.H * 0.52 + Math.sin(a) * d, 20, i % 2 ? GOLD : '#ffffff', 1 - sp); } } });
// r07 "It's arithmetic. One kept promise at a time."  you stack glowing +1 blocks one at a time; the counter climbs
registerShot('r07', { draw(g, t, info) {
  g.fillStyle = '#f4ecdc'; g.fillRect(0, 0, E.W, E.H); g.fillStyle = 'rgba(0,0,0,.04)'; for (let i = 0; i < 24; i++) g.fillRect(i * 80, 0, 2, E.H); for (let i = 0; i < 14; i++) g.fillRect(0, i * 80, E.W, 2);
  const c = camEase(t, info.dur, { z0: 1.0, z1: 1.05 }); zoomed(g, c, () => {
    const gy = E.H * 0.88, bx = E.W / 2 + 120, BW = 150, BH = 92; seg(g, [[200, gy], [E.W - 200, gy]], 8, '#1b1424');
    const drops = [1.1, 1.45, 1.8, 2.15, 2.5, 2.85, 3.2]; let n = 0;
    drops.forEach((d, i) => { if (t < d - 0.25) return; const k = ease.outBack(prog(t, d - 0.25, d)), y = gy - BH * (i + 1) - 400 * (1 - prog(t, d - 0.25, d)); if (t >= d) n++;
      rr(g, bx - BW / 2, y, BW, BH - 6, 14); g.fillStyle = i % 2 ? '#6dd8a0' : GREEN; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke(); text(g, '+1', bx, y + BH / 2 - 3, { size: 50, color: '#1b1424', stroke: 0 }); });
    const top = gy - BH * 7 - 40; headNum(g, bx + 250, top + 60, String(n), t, -1, { size: 90, color: GREEN });
    drawToon(g, { x: bx - 330, y: gy, s: 1.7, facing: 1, cast: HERO, pose: breathe(posesAt(t, [[0, 'explain'], [1.0, 'reach'], [1.4, 'holdFront'], [1.8, 'reach'], [2.2, 'holdFront'], [2.6, 'reach'], [3.2, 'cheer']]), t), expr: t > 3.2 ? 'joy' : 'smile', blink: blink(t), rim: RIM });
    }); } });
// r08 "So, whose number would you check first: your best friend's, your dad's, or your own?"  sunrise park, softly dimmed; three glowing portraits pop, one per name
registerShot('r08', { kind: '3d', init: initP,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-1.0, 1.7, 2.9], look: [-1.0, 1.5, -6], fov: 42 }, to: { pos: [-0.6, 1.7, 2.6], look: [-0.8, 1.55, -6], fov: 41 }, breathe: 0.006 }); },
  overlay(g, t, info, st) { veil(g, '#1a1030', 0.45 * ease.out(prog(t, 0, 0.6)));
    [[SAM, 2.4, GREEN], [DAD, 3.28, GOLD], [HERO, 4.32, '#8ab8ff']].forEach(([c, t0, col], i) => { const p = ease.outBack(prog(t, t0, t0 + 0.35)); if (p <= 0) return; const x = E.W / 2 + (i - 1) * 520, y = E.H * 0.5;
      g.save(); g.translate(x, y); g.scale(p, p); glow(g, 0, 0, 320, col, 0.35); rr(g, -190, -230, 380, 460, 40); g.fillStyle = 'rgba(20,16,36,0.85)'; g.fill(); g.strokeStyle = col; g.lineWidth = 6; g.stroke();
      bigToonFace(g, 0, 10, 120, { cast: c, expr: i === 2 ? 'thinking' : 'smile', blink: blink(t + i) }); text(g, '?', 0, -170, { size: 90, color: col, stroke: 0, glow: 16, glowColor: col }); g.restore(); }); } });
// r09 "Tell me in the comments."  three comment bubbles pop with typing dots
registerShot('r09', { kind: '3d', init: initP,
  draw(st, t, info) { cam3(st, t, info.dur, { from: { pos: [-0.6, 1.7, 2.6], look: [-0.8, 1.55, -6], fov: 41 }, to: { pos: [-0.5, 1.7, 2.45], look: [-0.8, 1.55, -6], fov: 40 }, breathe: 0.006 }); },
  overlay(g, t, info, st) { veil(g, '#1a1030', 0.45);
    for (let i = 0; i < 3; i++) { const p = ease.outBack(prog(t, 0.1 + i * 0.25, 0.4 + i * 0.25)); if (p <= 0) continue; const x = E.W * (0.3 + i * 0.2), y = E.H * (0.42 + (i % 2) * 0.12);
      g.save(); g.translate(x, y); g.scale(p, p); rr(g, -150, -70, 300, 140, 40); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke();
      g.beginPath(); g.moveTo(-60, 68); g.lineTo(-100, 120); g.lineTo(-10, 68); g.closePath(); g.fill(); g.stroke(); for (let d = 0; d < 3; d++) circle(g, -50 + d * 50, 0, 16 * (0.7 + 0.3 * Math.abs(Math.sin(t * 6 - d))), '#4a78b8'); g.restore(); } } });
// r10 "And if someone came to mind while you watched this, send it to them."  your phone: a friend's face on screen, a send button... a paper plane flies off
registerShot('r10', { draw(g, t, info) {
  g.fillStyle = '#ffd8b0'; g.fillRect(0, 0, E.W, E.H); glow(g, E.W * 0.2, E.H * 0.2, 900, '#ffffff', 0.35); glow(g, E.W * 0.85, E.H * 0.9, 800, '#ff9a7a', 0.25);
  const c = camEase(t, info.dur, { z0: 1.0, z1: 1.06 }), sent = t > 2.35;
  handPhone(g, E.W / 2, E.H * 0.6, 0.95 * c.z, (g2, x, y, w, h) => { g2.fillStyle = '#f4f6fa'; g2.fillRect(x, y, w, h);
    circle(g2, x + w / 2, y + 170, 95, '#4fb286'); g2.save(); g2.beginPath(); g2.arc(x + w / 2, y + 170, 95, 0, 7); g2.clip(); bigToonFace(g2, x + w / 2, y + 205, 62, { cast: SAM, expr: 'smile', blink: blink(t) }); g2.restore();
    rr(g2, x + 40, y + 320, w - 80, 26, 13); g2.fillStyle = '#d8dde6'; g2.fill(); rr(g2, x + 70, y + 362, w - 140, 20, 10); g2.fill();
    const press = t > 2.1 && t < 2.4 ? 0.9 : 1; g2.save(); g2.translate(x + w / 2, y + 470); g2.scale(press, press); rr(g2, -100, -40, 200, 80, 40); g2.fillStyle = sent ? '#2f8a57' : '#4a78b8'; g2.fill();
    if (sent) seg(g2, [[-24, 2], [-6, 20], [28, -16]], 10, '#ffffff'); else { g2.fillStyle = '#ffffff'; g2.beginPath(); g2.moveTo(-26, -20); g2.lineTo(30, 0); g2.lineTo(-26, 20); g2.lineTo(-16, 0); g2.closePath(); g2.fill(); } g2.restore(); }, { skin: HERO.skin, sleeve: HERO.top });
  if (sent) { const k = ease.in(prog(t, 2.35, 3.1)), px = lerp(E.W / 2, E.W + 200, k), py = lerp(E.H * 0.6, -150, k);
    g.save(); g.translate(px, py); g.rotate(-0.6); g.fillStyle = '#ffffff'; g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.beginPath(); g.moveTo(-60, -30); g.lineTo(70, 0); g.lineTo(-60, 30); g.lineTo(-30, 0); g.closePath(); g.fill(); g.stroke(); g.restore();
    for (let i = 1; i < 6; i++) { const kk = ease.in(prog(t, 2.35, 3.1 + i * 0.05)); circle(g, lerp(E.W / 2, E.W + 200, kk) - i * 30, lerp(E.H * 0.6, -150, kk) + i * 26, 6, alpha('#ffffff', 0.6 - i * 0.1)); } } } });
// r11 "Maybe it's their turn to watch the number go up."  sunrise park: your friend on the bench reads it; their number ticks up; crane up into the sun, fade
registerShot('r11', { kind: '3d', init: initP,
  draw(st, t, info) { const b = st.spots.bench; cam3(st, t, info.dur, { from: { pos: [b[0] + 0.8, 1.3, b[2] + 3.6], look: [b[0], 1.0, b[2]], fov: 38 }, to: { pos: [b[0] + 1.6, 2.8, b[2] + 6.5], look: [b[0] - 2.0, 2.6, b[2] - 20], fov: 44 } }); },
  overlay(g, t, info, st) { const q = at(g, st, [st.spots.bench[0], 0, st.spots.bench[2] + 0.15], t, { cast: SAM, facing: 1, pose: breathe(t < 1.5 ? POSES.sit : POSES.sit, t), expr: t < 1.5 ? 'neutral' : 'happy', look: [0.3, 0.6] });
    const hx = q.x + 30 * q.s, hy = q.y - 165 * q.s; rr(g, hx - 14 * q.s, hy - 22 * q.s, 28 * q.s, 44 * q.s, 6 * q.s); g.fillStyle = '#1e1c26'; g.fill(); glow(g, hx, hy, 60 * q.s, '#8ab8ff', 0.3);
    numChange(g, q.x, q.y - 240 * q.s, '61', '62', t, 1.6, { size: Math.max(32, 46 * q.s), t0: 0.2 });
    veil(g, '#000000', ease.in(prog(t, info.dur - 0.7, info.dur))); } });
