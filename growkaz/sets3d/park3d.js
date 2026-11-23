// sets3d/park3d.js: a city park at sunrise in soft cartoon 3D (morning runs, walks). Path runs along X (z = 0), camera from +z.
//   const p = park3d(T, { time: 'sunrise' | 'day' }) -> { st, spots: { pathY:0, runFrom:[-6,0,0], runTo:[6,0,0], bench:[...] } }
import * as THREE from 'three';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo } from '/engine/three-toon.js';
import { P, put, leafPlant, mirrorMat } from '/engine/props3d.js';   // the shared object library (2026-11-22)
import { rng } from '/engine/core.js';

export function park3d(T, o = {}) {
  const sunrise = (o.time || 'sunrise') === 'sunrise';
  const skyT = tex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); (sunrise ? ['#6a7ab8', '#e8a0a0', '#ffc888', '#ffe8c0'] : ['#7ab0e8', '#cfe4f4', '#f0f0e0']).forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const st = T.stage({ mood: 'golden', fog: [14, 40], fogColor: sunrise ? '#f0c0a0' : '#d8e4ee', fov: 38, keyPos: [-8, 4, -10], keyColor: sunrise ? '#ffd0a0' : '#fff4e0', keyIntensity: sunrise ? 1.8 : 2.2, ambientSky: '#fff1e6', ambient: 1.2, bloom: 0.35, bloomThreshold: 0.92, shadowSize: 12 });
  st.scene.background = skyT;
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); }, r = rng(7);
  const grass = flat(80, 60, toon('#7cbf6a'), 0, 0, -10); grass.rotation.x = -Math.PI / 2; A(grass);
  const pathT = tex(512, 64, (g, w, h) => { g.fillStyle = '#e6cfa4'; g.fillRect(0, 0, w, h); for (let i = 0; i < 60; i++) { g.fillStyle = `rgba(150,110,70,${0.15 + (i % 3) * 0.05})`; g.fillRect((i * 97) % w, (i * 31) % h, 6, 3); } }, [8, 1]);
  const path = flat(80, 1.6, toon('#ffffff', { map: pathT }), 0, 0.005, 0); path.rotation.x = -Math.PI / 2; A(path);
  for (const z of [-0.85, 0.85]) A(rbox(80, 0.06, 0.08, '#cfc0a0', 0, 0, z, 0.02, 0));
  // trees: lathe trunk + ball crowns, two rows + far row
  let ts = 1; const tree = (x, z, s = 1, c = '#4f9a55') => A(put(P.tree({ h: 3.2, color: c, seed: ts++ }), [x, 0, z], ts, s));
  for (let i = 0; i < 14; i++) tree(-24 + i * 3.6 + r() * 1.2, -3.2 - r() * 1.5, 0.9 + r() * 0.4, ['#4f9a55', '#5fae5f', '#6aa84f'][i % 3]);
  for (let i = 0; i < 8; i++) tree(-20 + i * 6 + r() * 2, 3.6 + r(), 1.1, '#4f9a55');
  for (let i = 0; i < 20; i++) tree(-30 + i * 3.2, -12 - r() * 4, 1.4 + r() * 0.5, '#6a9a7a');
  // benches + lamp posts along the path (behind it)
  for (const x of [-9, -1, 7]) A(put(P.bench({ w: 1.4, color: '#9a6a48' }), [x, 0, -1.45]));
  for (const x of [-12, -5, 3, 11]) A(put(P.lampPost({ h: 2.9, lit: sunrise }), [x, 0, -1.2]));
  // fence far back, hills, skyline, sun
  for (let i = 0; i < 40; i++) A(rbox(0.08, 0.7, 0.06, '#f4ecdc', -24 + i * 1.2, 0, -6.5, 0.02, 0.006)); A(rbox(48, 0.06, 0.05, '#f4ecdc', 0, 0.5, -6.5, 0.02, 0.006));
  for (let i = 0; i < 6; i++) { const h = ball(7 + r() * 4, '#8cc47a', -30 + i * 12, -5, -22 - r() * 4, 0); h.scale.y = 0.6; A(h); }
  for (let i = 0; i < 22; i++) { const bh = 3 + r() * 7; A(rbox(1.6 + r(), bh, 1.5, sunrise ? '#c8a0a8' : '#a8b8c8', -32 + i * 3, 0, -30 - r() * 3, 0.1, 0)); }
  const sun = halo(16, '#ffd090', sunrise ? 0.75 : 0.3); sun.position.set(-6, 5, -34); A(sun); const sunB = new THREE.Mesh(new THREE.SphereGeometry(1.4, 24, 16), glowMat('#fff2d0', 1.4)); sunB.position.set(-6, 5, -35); A(sunB);
  // flowers + bushes along the path edges
  for (let i = 0; i < 70; i++) A(ball(0.06, ['#ffd08a', '#ff9ab0', '#ffffff', '#c8a0ff'][i % 4], -25 + r() * 50, 0.06, (r() < 0.5 ? -1 : 1) * (1.1 + r() * 1.5), 0));
  for (let i = 0; i < 16; i++) A(put(P.bush({ seed: i + 1 }), [-24 + i * 3.1 + r(), 0, -2.2 + r() * 0.3], r() * 3, 0.85 + r() * 0.3));
  const spots = { runFrom: [-6, 0, 0.1], runTo: [6, 0, 0.1], bench: [-1, 0, -1.4] };
  return { st, spots };
}
