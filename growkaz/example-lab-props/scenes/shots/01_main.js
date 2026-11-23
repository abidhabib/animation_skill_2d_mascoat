// lab-props: gallery of the props3d library + the clean face, for QC. Not a video clip.
import { E, registerShot, text, rr } from '/engine/core.js';
import { POSES, breathe } from '/engine/rig2d.js';
import { drawToon, bigToonFace, HERO, SAM, MOM, DAD, STRANGER, CASHIER, KID } from '/engine/toon2d.js';
import { cam3, screenOf, flat, toon } from '/engine/three-toon.js';
import { P, put } from '/engine/props3d.js';

const studio = (T, items, cam) => {
  const st = T.stage({ mood: 'golden', fog: false, fov: 32, sky: '#efe6da', keyPos: [3, 6, 5], keyColor: '#fff1e0', keyIntensity: 1.6, ambientSky: '#fff6ec', ambient: 1.3, bloom: 0.2, bloomThreshold: 0.95, shadowSize: 8 });
  const fl = flat(40, 40, toon('#e6dccd'), 0, 0, 0); fl.rotation.x = -Math.PI / 2; st.scene.add(fl);
  const wall = flat(40, 12, toon('#efe6da'), 0, 6, -3.2); st.scene.add(wall);
  st.items = items.map(([name, o, p, ry = 0, s = 1]) => { const m = P[name](o || {}); put(m, p, ry, s); st.scene.add(m); return { name: (o && o.label) || name, p }; });
  st.cam = cam; return st;
};
const shot3 = (id, items, cam) => registerShot(id, { kind: '3d', init: (T) => studio(T, items, cam),
  draw(st, t, info) { cam3(st, t, info.dur, { from: cam, to: cam, breathe: 0 }); },
  overlay(g, t, info, st) { for (const it of st.items) { const q = screenOf(st, it.p); text(g, it.name, q.x, Math.min(E.H - 24, q.y + 26), { size: 24, color: '#1b1424', weight: 700 }); } } });

shot3('L01', [['mug', {}, [-0.95, 0, 0]], ['glass', {}, [-0.7, 0, 0]], ['bottle', {}, [-0.45, 0, 0]], ['phone', {}, [-0.15, 0, 0.05], 0.3], ['laptop', {}, [0.25, 0, -0.05], -0.2], ['bookStack', {}, [0.65, 0, 0]], ['alarmClock', {}, [0.95, 0, 0.05], -0.2], ['tableLamp', {}, [1.25, 0, -0.1]]],
  { pos: [0.15, 0.55, 2.2], look: [0.15, 0.12, 0], fov: 34 });
shot3('L02', [['plant', { label: 'plant leafy' }, [-1.6, 0, 0]], ['plant', { kind: 'tall', label: 'tall' }, [-1.15, 0, 0]], ['plant', { kind: 'monstera', label: 'monstera' }, [-0.6, 0, 0]], ['plant', { kind: 'succulent', label: 'succulent' }, [-0.15, 0, 0.1]], ['plant', { kind: 'round', label: 'round' }, [0.2, 0, 0]],
  ['kettle', {}, [0.55, 0, 0.1]], ['backpack', {}, [0.95, 0, 0], -0.3], ['sneakers', {}, [1.35, 0, 0.1], -0.5], ['foldedClothes', {}, [1.75, 0, 0.1]], ['clothesPile', {}, [2.25, 0, 0]]],
  { pos: [0.3, 1.0, 3.6], look: [0.3, 0.25, 0], fov: 36 });
shot3('L03', [['bed', {}, [-2.6, 0, -0.4]], ['nightstand', {}, [-1.1, 0, -0.6]], ['desk', {}, [0.2, 0, -0.5]], ['chair', {}, [0.2, 0, 0.15], Math.PI], ['officeChair', {}, [1.4, 0, 0], -0.4], ['table', { shape: 'round', label: 'table round' }, [2.6, 0, -0.3]]],
  { pos: [0, 2.0, 6.2], look: [0, 0.55, 0], fov: 40 });
shot3('L04', [['sofa', {}, [-2.4, 0, -0.2]], ['bookshelf', {}, [-0.7, 0, -0.6]], ['wardrobe', {}, [0.5, 0, -0.6]], ['tvUnit', {}, [2.2, 0, -0.5]], ['tv', {}, [2.2, 0.5, -0.5]], ['rug', {}, [-2.4, 0, 1.0]], ['floorLamp', {}, [3.4, 0, -0.6]], ['table', { shape: 'coffee', label: 'coffee table' }, [0.9, 0, 1.0]]],
  { pos: [0.3, 2.0, 7.0], look: [0.3, 0.85, 0], fov: 40 });
shot3('L05', [['door', { open: 0.3 }, [-2.9, 0, -0.5]], ['window', { sky: 'sunset' }, [-1.2, 0.9, -1.0]], ['mirror', {}, [0.2, 0, -0.5], -0.2], ['mirror', { kind: 'wall', label: 'mirror wall' }, [0.9, 1.5, -1.0]], ['frame', {}, [1.6, 1.2, -1.0]], ['wallClock', {}, [1.25, 2.3, -1.0]], ['fridge', {}, [2.4, 0, -0.6]], ['counter', { hob: true, w: 1.8 }, [-1.2, 0, 0.6]], ['kettle', {}, [-0.6, 0.91, 0.6]], ['wallShelf', {}, [-0.1, 2.0, -0.9]]],
  { pos: [-0.2, 1.8, 7.0], look: [-0.2, 1.05, 0], fov: 40 });
shot3('L06', [['bench', {}, [-3.6, 0, 0.6]], ['tree', {}, [-1.8, 0, -1]], ['pine', {}, [0.3, 0, -1.2]], ['bush', {}, [-0.8, 0, 0.8]], ['lampPost', {}, [1.5, 0, -0.5]], ['fence', {}, [-0.2, 0, -2.4]], ['trashBin', {}, [2.3, 0, 0.5]], ['bike', {}, [0.6, 0, 1.2]], ['car', {}, [4.2, 0, 0], -0.5]],
  { pos: [0.2, 2.4, 10.5], look: [0.2, 1.3, 0], fov: 40 });

// faces: big close-ups in several expressions + small full bodies (readability at small size)
const CASTS = [['HERO', HERO], ['SAM', SAM], ['MOM', MOM], ['DAD', DAD], ['STRANGER', STRANGER], ['CASHIER', CASHIER]];
const EXPRS = ['neutral', 'smile', 'joy', 'sad', 'angry', 'shocked', 'worried', 'thinking', 'tired', 'smug', 'nervous', 'determined'];
registerShot('L07', { draw(g, t) { g.fillStyle = '#efe6da'; g.fillRect(0, 0, E.W, E.H);
  EXPRS.forEach((ex, i) => { const x = 160 + (i % 6) * 320, y = 230 + Math.floor(i / 6) * 520, c = CASTS[i % 6][1]; bigToonFace(g, x, y, 110, { cast: c, expr: ex }); text(g, ex, x, y + 230, { size: 30, color: '#1b1424' }); }); } });
registerShot('L08', { draw(g, t) { g.fillStyle = '#d8cfc0'; g.fillRect(0, 0, E.W, E.H);
  CASTS.forEach(([n, c], i) => { const x = 150 + i * 300; drawToon(g, { x, y: 520, s: 1.3, cast: c, pose: breathe(POSES.stand, t), expr: ['smile', 'happy', 'neutral', 'worried', 'surprised', 'smile'][i] }); text(g, n, x, 570, { size: 28, color: '#1b1424' });
    drawToon(g, { x: x - 60, y: 980, s: 0.55, cast: c, pose: POSES.stand, expr: 'smile' }); drawToon(g, { x: x + 60, y: 980, s: 0.35, cast: c, pose: POSES.stand, expr: 'sad' }); }); } });
