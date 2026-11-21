// V02 Clip 20 "the gift and the speech" (GrowKaz engine + our cast). Smooth eased camera everywhere (camEase).
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, rr, glow, alpha, shade, linGrad, text } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawToon, bigToonFace, HERO, SAM } from '/engine/toon2d.js';
import { blink, headNum, numChange, floater, camEase } from '/engine/storyfx.js';
import { mall, mallGround } from '/engine/sets/mall.js';
import { apartment, aptGround } from '/engine/sets/apartment.js';
import { bathroom, mirrorRect, mirrorGlass } from '/engine/sets/bathroom.js';

const rim = (M) => ({ color: M.rim, dir: [0.6, -0.8], w: 3.5 });
function shoeBox(g, x, y, s, open = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(0, 4, 120, 14, 0, 0, Math.PI * 2); g.fill();
  rr(g, -110, -90, 220, 90, 8); g.fillStyle = '#e0562f'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke();
  g.save(); g.translate(-110, -90); g.rotate(-open * 1.2); rr(g, -6, -26, 232, 30, 8); g.fillStyle = '#f07040'; g.fill(); g.stroke(); g.restore();
  if (open < 0.2) { seg(g, [[0, -116], [0, 0]], 12, '#ffd400'); g.fillStyle = '#ffd400'; g.beginPath(); g.ellipse(-22, -118, 26, 14, -0.4, 0, 7); g.ellipse(22, -118, 26, 14, 0.4, 0, 7); g.fill(); }
  g.restore();
}
function sneaker(g, x, y, s, rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = '#ffffff'; g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.beginPath(); g.moveTo(-90, 10); g.quadraticCurveTo(-90, -60, -30, -60); g.lineTo(10, -30); g.quadraticCurveTo(80, -24, 96, 4); g.lineTo(96, 18); g.lineTo(-90, 18); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = '#e0562f'; g.beginPath(); g.moveTo(-70, -10); g.quadraticCurveTo(-10, -40, 60, -10); g.lineTo(40, 4); g.quadraticCurveTo(-10, -20, -60, 4); g.closePath(); g.fill();
  g.fillStyle = '#2a2a33'; g.fillRect(-90, 14, 186, 10);
  g.restore();
}

// u01 "But you try anyway."  out of the mall with a shopping bag, determined; tracking
registerShot('u01', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.06, x0: -120, x1: 80 });
  const { M } = mall(g, t, cam);
  layer(g, cam, 1, (g) => drawToon(g, { x: E.W / 2 - 220 + 300 * ease.inOut(t / info.dur), y: mallGround(), s: V(1.5, 1.6), facing: 1, cast: HERO, pose: walkPose(t * 1.6), expr: 'determined', blink: blink(t), rim: rim(M) }));
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// u02 "Shortcut one, a gift."  insert: the shoe box slides onto a counter with a settle, the bow pops, sparkles
registerShot('u02', { draw(g, t, info) {
  blurLayer(g, 12, (g) => mall(g, t, { z: 1.3, x: 120, y: -60 })); veil(g, '#120a10', 0.25);
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.08 });
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(cam.z, cam.z); g.translate(-E.W / 2, -E.H / 2);
  rr(g, -100, E.H * 0.72, E.W + 200, 40, 10); g.fillStyle = '#7a4f38'; g.fill(); g.fillStyle = '#5a3828'; g.fillRect(-100, E.H * 0.72 + 40, E.W + 200, E.H);
  const k = ease.outBack(prog(t, 0.1, 0.6)); shoeBox(g, lerp(-300, E.W / 2, k), E.H * 0.72, 2.0);
  if (t > 0.6) for (let i = 0; i < 4; i++) FX.sparkle(g, E.W / 2 - 200 + i * 130, E.H * 0.42 - (i % 2) * 60, 16 * Math.max(0, Math.sin((t - 0.6) * 6 + i)), '#fff6c8', 0.9);
  g.restore();
} });

// u03 "You buy Sam the sneakers he's wanted for a year."  Sam's apartment at dusk: he opens the box, the sneakers rise out, pure joy
registerShot('u03', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.08, x0: -60, x1: 40 });
  const { M } = apartment(g, t, cam);
  const s = V(1.6, 1.6), sx = E.W / 2 + 120, hx = E.W / 2 - 260, open = ease.inOut(prog(t, 0.6, 1.2));
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: hx, y: aptGround(), s, facing: 1, cast: HERO, pose: breathe(POSES.relaxed, t), expr: 'smile', blink: blink(t), rim: rim(M) });
    drawToon(g, { x: sx, y: aptGround(), s, facing: -1, cast: SAM, pose: posesAt(t, [[0, 'holdFront'], [1.3, 'cheer']]), expr: t < 1.2 ? 'surprised' : 'joy', blink: blink(t, 3.4), rim: rim(M) });
    shoeBox(g, sx - 170, aptGround() + 6, 0.75, open);
    if (open > 0.3) sneaker(g, sx - 170, aptGround() - 70 - 110 * ease.outBack(prog(t, 1.1, 1.6)), 0.75, -0.1);
  });
} });

// u04 "Forty-one, forty-six."  close two-shot: the number on Sam's head jumps 41 -> 46 (+5)
registerShot('u04', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.08, z1: 1.14, x0: 120, x1: 160 });
  const { M } = apartment(g, t, cam);
  const s = V(1.8, 1.8), x = E.W / 2 + 60;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x, y: aptGround(), s, facing: -1, cast: SAM, pose: breathe(POSES.cheer, t), expr: 'joy', blink: blink(t, 3.4), rim: rim(M) });
    numChange(g, x, aptGround() - 310 * s, '41', '46', t, 1.05, { size: 72 });
  });
} });

// u05 "Then, one second later, back to forty-three."  the glow flickers and drops to 43 (-3); his cheer relaxes into a polite smile
registerShot('u05', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.14, z1: 1.18, x0: 160, x1: 170 });
  const { M } = apartment(g, t, cam);
  const s = V(1.8, 1.8), x = E.W / 2 + 60, tSw = 2.7;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x, y: aptGround(), s, facing: -1, cast: SAM, pose: posesAt(t, [[0, 'cheer'], [tSw, 'relaxed']]), expr: t < tSw ? 'happy' : 'awkward', blink: blink(t, 3.4), rim: rim(M) });
    numChange(g, x, aptGround() - 310 * s, '46', '43', t, tSw, { size: 72, t0: -1 });
  });
} });

// u06 "He doesn't know why."  giant close-up: Sam looks down at the sneakers, confused
registerShot('u06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => apartment(g, t, { z: 1.4, x: -120, y: -60 })); veil(g, '#120a10', 0.25);
  const M = mood('dusk'), r = V(240, 270) * (1 + 0.03 * ease.inOut(t / info.dur));
  bigToonFace(g, E.W / 2, E.H * V(0.5, 0.48), r, { cast: SAM, expr: 'confused', look: [0.2, 0.6], blink: blink(t, 3.4), rimColor: M.rim });
} });

// u07 "It just feels like a bribe."  insert: a price tag swings off the sneaker on its string, a '$' on it; slow push
registerShot('u07', { draw(g, t, info) {
  blurLayer(g, 12, (g) => apartment(g, t, { z: 1.3, x: 160, y: -40 })); veil(g, '#120a10', 0.3);
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.1 });
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(cam.z, cam.z); g.translate(-E.W / 2, -E.H / 2);
  sneaker(g, E.W / 2 - 80, E.H * 0.58, 3.0, -0.05);
  const sw = Math.sin(t * 3.2) * 0.35 * (1 - prog(t, 0, info.dur) * 0.6), ax = E.W / 2 + 120, ay = E.H * 0.42;
  g.save(); g.translate(ax, ay); g.rotate(sw); seg(g, [[0, 0], [0, 150]], 4, '#1b1424');
  rr(g, -70, 150, 140, 90, 12); g.fillStyle = '#fff3c8'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; g.stroke(); circle(g, 0, 170, 9, '#1b1424');
  text(g, '$', 0, 205, { size: 64, color: '#2f8a57', stroke: 6, strokeColor: '#0b0620' }); g.restore();
  g.restore();
} });

// u08 "Shortcut two, the perfect apology speech."  night desk: he writes, crumpled drafts arc into a bin (physics)
registerShot('u08', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.06, x0: 40, x1: -40 });
  const { M } = apartment(g, t, cam, { mood: 'night', sofa: false, wall: '#3e3550' });
  const s = V(1.6, 1.6), hx = E.W / 2 - 150;
  layer(g, cam, 1, (g) => {
    rr(g, hx + 40, aptGround() - 170, 420, 26, 8); g.fillStyle = '#7a5038'; g.fill(); seg(g, [[hx + 70, aptGround() - 150], [hx + 70, aptGround()]], 12, '#5a3828'); seg(g, [[hx + 430, aptGround() - 150], [hx + 430, aptGround()]], 12, '#5a3828');
    rr(g, hx + 140, aptGround() - 196, 150, 26, 4); g.fillStyle = '#fffdf5'; g.fill();
    rr(g, hx + 560, aptGround() - 110, 90, 110, 10); g.fillStyle = '#4a4a5a'; g.fill();
    drawToon(g, { x: hx, y: aptGround(), s, facing: 1, cast: HERO, pose: breathe(POSES.holdFront, t), expr: 'determined', blink: blink(t), rim: rim(M) });
    for (let i = 0; i < 3; i++) { const t0 = 0.3 + i * 0.55, p = prog(t, t0, t0 + 0.6); if (p <= 0) continue;
      const bx = lerp(hx + 220, hx + 605, p), by = aptGround() - 200 - Math.sin(p * Math.PI) * 220 + p * 120;
      circle(g, bx, Math.min(by, aptGround() - 80), 20, '#fffdf5'); g.strokeStyle = '#1b1424'; g.lineWidth = 4; g.beginPath(); g.arc(bx, Math.min(by, aptGround() - 80), 20, 0, 7); g.stroke(); }
  });
} });

// u09 "You rehearse it in the mirror, three times."  bathroom mirror: he talks, his reflection talks back; three tally marks appear in the mist
registerShot('u09', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.0, z1: 1.07 });
  const { GY, m } = bathroom(g, t, cam);
  const s = V(1.6, 1.6), talk = 0.25 + 0.25 * Math.abs(Math.sin(t * 9));
  layer(g, cam, 0.6, (g) => {
    g.save(); g.beginPath(); g.rect(m.x, m.y, m.w, m.h); g.clip();
    drawToon(g, { x: E.W / 2 + 40, y: m.y + m.h + 330, s: s * 1.05, facing: -1, cast: HERO, pose: posesAt(t, [[0, 'explain'], [0.9, 'talk'], [1.8, 'explain']]), expr: 'nervous', talk, blink: blink(t), rim: false, shadow: false, alpha: 0.85 });
    for (let i = 0; i < 3; i++) { const k = prog(t, 0.4 + i * 0.6, 0.6 + i * 0.6); if (k > 0) seg(g, [[m.x + m.w - 160 + i * 36, m.y + 50], [m.x + m.w - 160 + i * 36, m.y + 50 + 90 * k]], 10, alpha('#ffffff', 0.85)); }
    mirrorGlass(g, m); g.restore();
  });
  layer(g, cam, 1, (g) => drawToon(g, { x: E.W / 2 - 240, y: GY + 300, s: s * 1.4, facing: 1, cast: HERO, pose: POSES.stand, expr: 'nervous', talk, rim: false, shadow: false }));
} });

// u10 "Forty-four."  back at Sam's: he listens kindly, the number creeps 43 -> 44
registerShot('u10', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.06, z1: 1.12, x0: 100, x1: 140 });
  const { M } = apartment(g, t, cam);
  const s = V(1.7, 1.7), x = E.W / 2 + 80;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x, y: aptGround(), s, facing: -1, cast: SAM, pose: breathe(POSES.crossArms, t), expr: 'neutral', blink: blink(t, 3.4), rim: rim(M) });
    numChange(g, x, aptGround() - 310 * s, '43', '44', t, 0.15, { size: 72 });
  });
} });

// u11 "Words are cheap."  the speech pages blow away out of his hands; slow pull-out, he is left with nothing
registerShot('u11', { draw(g, t, info) {
  const cam = camEase(t, info.dur, { z0: 1.12, z1: 1.0 });
  const { M } = apartment(g, t, cam, { mood: 'night', wall: '#3e3550' });
  const s = V(1.6, 1.6), hx = E.W / 2 - 60;
  layer(g, cam, 1, (g) => {
    drawToon(g, { x: hx, y: aptGround(), s, facing: 1, cast: HERO, pose: posesAt(t, [[0, 'holdFront'], [0.6, 'sad']]), expr: t < 0.5 ? 'nervous' : 'sad', blink: blink(t), rim: rim(M) });
    for (let i = 0; i < 4; i++) { const p = ease.in(prog(t, 0.4 + i * 0.12, 1.6 + i * 0.12)); if (p <= 0) continue;
      g.save(); g.translate(hx + 90 + p * (700 + i * 120), aptGround() - 220 * s * 0.6 - p * (200 + i * 60) + Math.sin(t * 6 + i) * 20); g.rotate(p * (3 + i));
      rr(g, -40, -54, 80, 108, 4); g.fillStyle = '#fffdf5'; g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 3; g.stroke();
      for (let k = 0; k < 4; k++) seg(g, [[-26, -30 + k * 18], [22, -30 + k * 18]], 3, '#9aa'); g.restore(); }
  });
} });
