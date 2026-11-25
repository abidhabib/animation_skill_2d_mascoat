// char19.js: the DEFAULT cast since 2026-11-25: the Character 19 rig (46 emotions, 42 actions, turnarounds, mouth shapes)
// from the user's reference kit. engine/cast19/rig.js (latest arm corrections) + cast19/cast.js are verbatim copies.
// Old code keeps working: toon2d's drawToon / bigToonFace call this. New code can use it directly:
//   drawToon(g, { x, y, s, facing, cast: HERO, action: 'makeBed', t, expr: 'teasing', yaw, phoneme, talk })
//   ACTIONS (42) and EMOTION_NAMES (46) list what is available. Cast ids: cast.c19 = [personId, outfitId].
import './cast19/rig.js';
import './cast19/cast.js';
import { POSES } from '/engine/rig2d.js';
import { MEME_FACES } from '/engine/memefaces.js';

const R = window.Character19, Cast = window.Cast;
// our story's own people, added on top of the reference cast (cast.js stays verbatim)
Object.assign(Cast.people, {
  mom: ['Mom', 'cardigan', { skin: '#edb993', shade: '#bf896f', hair: '#4a2a1c', hairStyle: 'bob', stubble: false, faceWidth: .98, faceHeight: .98, height: .95, build: .98 }],
  sam: ['Sam · best friend', 'workwear', { skin: '#ae704e', shade: '#85523e', hair: '#1f1718', hairStyle: 'curls', stubble: false, faceWidth: .95, height: 1.03, build: .98 }],
  dad: ['Dad', 'cardigan', { skin: '#eebd98', shade: '#c4906f', hair: '#b9b2ad', hairStyle: 'crop', glasses: true, aged: true, faceWidth: 1.06, build: 1.08 }],
  youngdad: ['Dad · younger', 'uniform', { skin: '#eebd98', shade: '#c4906f', hair: '#4a3020', hairStyle: 'crop', glasses: true, faceWidth: 1.04, build: 1.04 }],
  mia: ['Mia · little sister', 'blazer', { skin: '#f2c09a', shade: '#c9936f', hair: '#33201f', hairStyle: 'bun', stubble: false, faceWidth: .99, faceHeight: .94, height: .88, build: .9 }],
  kid: ['Young lead', 'marine', { skin: '#ffdab9', shade: '#deaa88', hair: '#302326', hairStyle: 'curls', stubble: false, faceWidth: 1.05, height: .9, build: .9 }],
});

// hero with an original meme face: cast.c19 = ['lead_mooch' | 'lead_popbrow' | 'lead_gaptooth', outfit]
for (const [k, face] of Object.entries(MEME_FACES)) Cast.people['lead_' + k] = ['Main character, ' + k, 'original', { face }];

export const ACTIONS = [...R.POSE_NAMES, 'conceal'];
export const EMOTION_NAMES = Object.keys(R.EMOTIONS);
export const PEOPLE = Cast.people, OUTFITS = Cast.outfits;
export const rigFor = (cast) => { const [person, outfit] = cast?.c19 || ['lead_mooch', 'original']; return Cast.rig(person, outfit); };

const FIT = 0.365;                       // rig units -> our figure units (a standing figure is ~270 tall at s = 1)
const FACE_R = 88, HEAD_Y = 636;         // rig head radius and head height above the ground
const EXPR = { smile: 'friendly', smug: 'smugAside', fake: 'nervous', awkward: 'embarrassed', cry: 'crying' };
export const emotionName = (e) => (R.EMOTIONS[EXPR[e] || e] ? EXPR[e] || e : 'neutral');

// old 2D pose objects -> rig actions
const LEGACY = { stand: 'idle', relaxed: 'idle', ready: 'idle', talk: 'talk', explain: 'explain', point: 'point', pointUp: 'pointUp', wave: 'wave', cheer: 'celebrate',
  handsOnHead: 'facepalm', crossArms: 'crossArms', think: 'think', shrug: 'shrug', holdFront: 'carry', phone: 'phone', reach: 'reach', sad: 'idle', facepalm: 'facepalm',
  crouch: 'crouch', sit: 'sit', sitBack: 'sit', kneel: 'kneel', jump: 'jump', fall: 'recoil', kick: 'push', dive: 'reach', lie: 'idle' };
const KEYS = ['head', 'hip', 'hF', 'hB', 'eF', 'eB', 'fF', 'fB', 'kF', 'kB'];
const dist = (a, b) => KEYS.reduce((n, k) => n + (a[k] && b[k] ? Math.hypot(a[k][0] - b[k][0], a[k][1] - b[k][1]) : 0), 0);
const STILL = { jump: 0.9, pickUp: 1.1, bow: 1.2, standUp: 1, clap: 0.25 };
const timed = (rig, action, t, yaw) => rig.motion(action, t, yaw === undefined ? {} : { yaw });
const viewYaw = (action) => (['walk', 'run', 'sneak', 'tiptoe', 'sadWalk', 'climb'].includes(action) ? 1.45 : action === 'sit' || action === 'standUp' ? 0.95 : 0.45);

function fromLegacy(rig, p, t, yaw) {
  if (p._from) { const A = fromLegacy(rig, p._from, t, yaw), B = fromLegacy(rig, p._to, t, yaw); return { pose: rig.blendPose(A.pose, B.pose, p._k), name: p._k < 0.5 ? A.name : B.name }; }
  if (p._walk !== undefined) { const act = p._run ? 'run' : 'walk'; return { pose: timed(rig, act, Math.max(0, p._walk / (Math.PI * 2 * (p._run ? 1.65 : 0.95)) + 4), yaw ?? viewYaw(act)), name: act }; }
  const ranked = Object.keys(LEGACY).filter(n => POSES[n]).map(n => [dist(p, POSES[n]), n]).sort((a, b) => a[0] - b[0]);
  const [d1, n1] = ranked[0]; const other = ranked.find(([, n]) => LEGACY[n] !== LEGACY[n1]);
  const make = (n) => { const a = LEGACY[n]; const m = timed(rig, a, STILL[a] ?? t, yaw ?? viewYaw(a)); if (n === 'sad') { m.headTilt = 0.14; m.lean = 0.07; } return m; };
  let pose = make(n1);
  if (other && d1 > 14) { const k = d1 / (d1 + other[0]); if (k > 0.12) pose = rig.blendPose(pose, make(other[1]), k); }   // in-between of two old poses
  return { pose, name: n1 };
}

// actions: [[0, 'idle'], [1.2, 'wave'], [3, 'think']] (seconds): each change is eased over ~0.5 s
function sequence(rig, keys, t, yaw, blend = 0.55) {
  let i = 0; while (i + 1 < keys.length && t >= keys[i + 1][0]) i++;
  const [at, name] = keys[i], make = (n, since) => timed(rig, n, Math.max(0, since), yaw ?? viewYaw(n));
  const cur = make(name, STILL[name] ?? t - at + (i ? 0 : 0.6));
  if (i === 0 || t - at >= blend) return { pose: cur, name };
  const prev = keys[i - 1]; return { pose: rig.blendPose(make(prev[1], STILL[prev[1]] ?? t - prev[0]), cur, (t - at) / blend), name };
}

export function draw19(g, o) {
  const cast = o.cast, rig = rigFor(cast), s = (o.s ?? 1) * FIT, f = o.facing ?? 1, t = o.t ?? o.pose?._t ?? 0.8;
  let pose, name = o.action;
  if (o.actions) ({ pose, name } = sequence(rig, o.actions, t, o.yaw));
  else if (o.action) pose = timed(rig, o.action, t, o.yaw ?? viewYaw(o.action));
  else if (o.pose && o.pose.footL) pose = o.pose;                       // already a rig pose
  else ({ pose, name } = fromLegacy(rig, o.pose || POSES.stand, t, o.yaw));
  const lie = name === 'lie';
  const faded = o.alpha != null && o.alpha < 1;
  let emotion = emotionName(o.expr || 'neutral');
  if (faded) emotion = { ...rig.emotion(emotion), blush: 0 };           // the rig resets alpha after drawing blush
  g.save(); if (o.alpha != null) g.globalAlpha *= o.alpha;
  if (lie) { g.translate(o.x, o.y); g.rotate(-Math.PI / 2 * f); g.translate(-o.x, -o.y); }
  const opts = { x: o.x, y: o.y, scale: s, pose, facing: f, time: t, emotion, talk: o.talk, phoneme: o.phoneme, shadow: o.shadow !== false };
  if (o.look) opts.look = [o.look[0] * (f < 0 ? -1 : 1), o.look[1]];
  if (o.blink !== undefined) { opts.blink = !!o.blink; opts.autoBlink = false; }
  const world = rig.draw(g, opts);
  if (o.prop === 'phone' && world?.armR) { const [hx, hy] = world.armR.c, k = s * (rig.look.height || 1); g.fillStyle = '#1b1d26'; g.beginPath(); g.roundRect(o.x + hx * k * f * 0.9 - 24 * k, o.y + hy * k - 62 * k, 48 * k, 86 * k, 10 * k); g.fill(); }
  g.restore(); return world;
}

// giant face close-up: same call as before (cx, cy = head centre, r = head radius)
export function face19(g, cx, cy, r, o = {}) {
  const rig = rigFor(o.cast), s = r / FACE_R, h = rig.look.height || 1;
  const pose = rig.motion('idle', 0, { yaw: o.yaw ?? 0.12 });
  g.save(); g.translate(cx, cy); if (o.tilt) g.rotate(o.tilt);
  if (o.clip) { g.beginPath(); g.rect(-r * 3, -r * 3, r * 6, r * 4.9); g.clip(); }     // o.clip: head and shoulders only (small portraits)
  const opts = { x: 0, y: (HEAD_Y - 6) * s * h, scale: s, pose, time: o.t ?? 0, emotion: emotionName(o.expr || 'neutral'), talk: o.talk, phoneme: o.phoneme, shadow: false };
  if (o.look) opts.look = o.look;
  if (o.blink !== undefined) { opts.blink = !!o.blink; opts.autoBlink = false; }
  rig.draw(g, opts); g.restore();
}
