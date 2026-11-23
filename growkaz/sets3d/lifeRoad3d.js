// sets3d/lifeRoad3d.js: "the road of years" in soft cartoon 3D (V03 Clip 21). One long road along X: 1 metre = 1 year, x = age - 34.
//   const r = lifeRoad3d(T) -> { st, ageX(age), tape }   st.tape = growing measuring tape (set tape.green.scale.x / tape.red.scale.x)
//   Start arch "NOW" at age 34, signposts every 5 years, a RETIRE arch + cabin at age 65, bench, trees, lamp posts, puffy 3D clouds, hills, warm sky.
import * as THREE from 'three';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo, ink } from '/engine/three-toon.js';
import { P, put } from '/engine/props3d.js';
import { rng } from '/engine/core.js';

export function lifeRoad3d(T, o = {}) {
  const skyT = tex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); ['#6a8ac8', '#e8b0a0', '#ffd8a8', '#fff0d0'].forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const st = T.stage({ mood: 'golden', fog: [22, 80], fogColor: '#f0d4b8', fov: 38, keyPos: [-10, 7, -8], keyColor: '#ffe0b0', keyIntensity: 2.0, ambientSky: '#fff1e6', ambient: 1.25, bloom: 0.3, bloomThreshold: 0.92, shadowSize: 16 });
  st.scene.background = skyT; const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); }, r = rng(11), ageX = (a) => a - 34;
  const grass = flat(160, 80, toon('#7cbf6a'), 14, 0, -10); grass.rotation.x = -Math.PI / 2; A(grass);
  const pathT = tex(512, 128, (g, w, h) => { g.fillStyle = '#d8c09a'; g.fillRect(0, 0, w, h); for (let i = 0; i < 80; i++) { g.fillStyle = `rgba(150,110,70,${0.12 + (i % 3) * 0.05})`; g.fillRect((i * 97) % w, (i * 31) % h, 6, 3); } g.fillStyle = 'rgba(255,255,255,.55)'; for (let i = 0; i < 8; i++) g.fillRect(i * 64 + 8, h / 2 - 3, 36, 6); }, [14, 1]);
  const road = flat(110, 2.2, toon('#ffffff', { map: pathT }), 14, 0.006, 0); road.rotation.x = -Math.PI / 2; A(road);
  for (const z of [-1.2, 1.2]) A(rbox(110, 0.08, 0.1, '#cfc0a0', 14, 0, z, 0.02, 0));
  // puffy 3D clouds: clusters of white balls high in the back
  const cloud = (x, y, z, s) => { const c = new THREE.Group(); for (const [dx, dy, dz, rr] of [[0, 0, 0, 1.3], [1.2, -0.1, 0.1, 1.0], [-1.25, -0.15, 0, 0.95], [0.45, 0.55, 0, 1.0], [-0.45, 0.4, 0.1, 0.85], [2.1, -0.25, 0, 0.7]]) { const b = ball(rr, '#ffffff', dx, dy, dz, 0); b.scale.y = 0.78; c.add(b); } c.position.set(x, y, z); c.scale.setScalar(s); A(c); };
  for (let i = 0; i < 12; i++) cloud(-30 + i * 9 + r() * 3, 12 + r() * 6, -40 - r() * 10, 1.6 + r() * 1.2);
  // hills + far skyline
  for (let i = 0; i < 9; i++) { const hh = ball(9 + r() * 5, '#8cc47a', -30 + i * 14, -6, -36 - r() * 6, 0); hh.scale.y = 0.55; A(hh); }
  for (let i = 0; i < 26; i++) { const bh = 3 + r() * 8; A(rbox(1.8 + r(), bh, 1.6, '#c8a8b0', -34 + i * 3.4, 0, -46 - r() * 3, 0.1, 0)); }
  const sun = halo(20, '#ffd090', 0.7); sun.position.set(-8, 6, -44); A(sun); const sunB = new THREE.Mesh(new THREE.SphereGeometry(1.6, 24, 16), glowMat('#fff2d0', 1.4)); sunB.position.set(-8, 6, -45); A(sunB);
  // trees, bushes, lamp posts, benches along the road
  let ts = 1; const tree = (x, z, s = 1, c = '#4f9a55') => A(put(P.tree({ h: 3.2, color: c, seed: ts++ }), [x, 0, z], ts, s));
  for (let i = 0; i < 26; i++) tree(-12 + i * 2.2 + r() * 0.8, -3.2 - r() * 1.6, 0.9 + r() * 0.5, ['#4f9a55', '#5fae5f', '#6aa84f'][i % 3]); for (let i = 0; i < 16; i++) tree(-10 + i * 3.6 + r() * 1.2, 7.5 + r() * 1.5, 1.0 + r() * 0.4, '#4f9a55'); for (let i = 0; i < 30; i++) tree(-20 + i * 3.4, -12 - r() * 5, 1.5 + r() * 0.6, '#6a9a7a');
  for (let i = 0; i < 28; i++) A(put(P.bush({ seed: i + 1 }), [-12 + i * 2.1 + r(), 0, -2.0 + r() * 0.3], r() * 3, 0.8 + r() * 0.3)); for (let i = 0; i < 90; i++) A(ball(0.06, ['#ffd08a', '#ff9ab0', '#ffffff', '#c8a0ff'][i % 4], -12 + r() * 62, 0.06, (r() < 0.5 ? -1 : 1) * (1.5 + r() * 1.6), 0));
  for (const x of [-4, 4, 12, 20, 28, 36, 44]) A(put(P.lampPost({ h: 2.9, lit: false }), [x, 0, -1.5]));
  A(put(P.bench({ w: 1.4, color: '#9a6a48' }), [ageX(60), 0, -1.55]), put(P.bench({ w: 1.4, color: '#9a6a48' }), [ageX(46), 0, -1.55]));
  // sign textures
  const signTex = (txt, sub, col) => tex(512, 256, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); g.strokeStyle = '#1b1424'; g.lineWidth = 14; g.strokeRect(7, 7, w - 14, h - 14); g.fillStyle = '#ffffff'; g.font = 'bold 104px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, sub ? h * 0.4 : h / 2); if (sub) { g.font = 'bold 44px sans-serif'; g.fillText(sub, w / 2, h * 0.78); } });
  const sign = (x, txt, sub, col, z = -1.7, y = 1.75) => { A(rbox(0.07, y, 0.07, '#6a4a2a', x, 0, z, 0.02, 0)); const b = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 0.62), new THREE.MeshBasicMaterial({ map: signTex(txt, sub, col), toneMapped: false })); b.position.set(x, y + 0.1, z + 0.045); A(rbox(1.34, 0.7, 0.06, '#2a1e34', x, y - 0.25, z, 0.04, 0.012)); A(b); };
  for (let a = 35; a <= 70; a += 5) if (a !== 65) sign(ageX(a), 'AGE ' + a, a === 60 ? 'MONEY BACK' : null, a === 60 ? '#2f8a57' : '#3a5a9a');
  // arches: START (now) and RETIRE (65)
  const arch = (x, txt, sub, col) => { for (const dz of [-1.6, 1.6]) A(rbox(0.32, 3.2, 0.32, '#e8dcc4', x, 0, dz, 0.05, 0.012)); A(rbox(0.5, 0.5, 3.6, '#e8dcc4', x, 3.1, 0, 0.06, 0.012)); const b = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 0.92), new THREE.MeshBasicMaterial({ map: signTex(txt, sub, col), toneMapped: false })); b.rotation.y = 0; b.position.set(x + 0.28, 3.12, 0); b.rotation.y = Math.PI / 2; A(b); const b2 = b.clone(); b2.position.x = x - 0.28; b2.rotation.y = -Math.PI / 2; A(b2); };
  arch(ageX(34), 'NOW', 'AGE 34', '#e0562f'); arch(ageX(65), 'RETIRE', 'AT 65', '#2f8a57');
  // cabin beyond the retire arch
  const cx = ageX(65) + 2.6; A(rbox(2.6, 1.5, 2.0, '#f0d4a8', cx, 0, -1.2, 0.06, 0.015)); const roof = ink(new THREE.Mesh(new THREE.ConeGeometry(2.3, 1.2, 4), toon('#c0563a')), 0.02); roof.position.set(cx, 2.1, -1.2); roof.rotation.y = Math.PI / 4; roof.scale.z = 0.8; A(roof); A(rbox(0.5, 0.9, 0.06, '#7a4e34', cx, 0, -0.18, 0.03, 0.01)); A(rbox(0.6, 0.5, 0.06, '#bfe4f4', cx + 0.8, 0.6, -0.18, 0.03, 0.01)); A(put(P.bench({ w: 1.2, color: '#9a6a48' }), [cx - 2.0, 0, -0.4]));
  // measuring tape (grows from the hero): green until age 65, red beyond
  const mk = (col) => { const g = new THREE.Group(); g.add(rbox(1, 0.1, 0.34, col, 0.5, 0, 0, 0.03, 0.012)); for (let i = 1; i < 15; i++) g.add(rbox(0.03, 0.14, 0.36, '#1b1424', i + 0.0, 0, 0, 0.005, 0)); return g; };
  const green = mk('#2fb866'), red = mk('#e0302a'); green.position.set(ageX(55), 0.12, 1.05); red.position.set(ageX(65), 0.12, 1.05); green.scale.x = 0.001; red.scale.x = 0.001; A(green, red); st.tape = { green, red };
  return { st, ageX, tape: st.tape };
}
