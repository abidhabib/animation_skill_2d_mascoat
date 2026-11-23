// sets3d/verdict3d.js: "the verdict stage" in soft cartoon 3D (V03 Clip 22). Dark navy stage: CISCO pedestal (left, blue) and NVIDIA pedestal (right, green)
//   with logo cubes, a glowing chain between them ("same seat"), a balance scale in front (coin stacks on both pans), an hourglass over the Cisco cube.
//   const v = verdict3d(T) -> { st, spots }   st.setTilt(rad) (+ = left pan down), st.setCoins('L'|'R', n), st.chain (scale.x 0..1), st.sand (0..1), st.upd(t)
import * as THREE from 'three';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo } from '/engine/three-toon.js';

export function verdict3d(T, o = {}) {
  const st = T.stage({ mood: 'dusk', fog: [16, 44], fogColor: '#0e1630', fov: 38, keyPos: [-4, 8, 6], keyColor: '#ffe8c8', keyIntensity: 1.7, ambientSky: '#a8b8ff', ambient: 1.0, bloom: 0.45, bloomThreshold: 0.88, shadowSize: 14 });
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); return x[0]; };
  S.background = tex(4, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); [['0', '#0a1030'], ['0.6', '#1c2a5a'], ['1', '#3a3a7a']].forEach(([a, c]) => gr.addColorStop(+a, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  A(disc(9, 0.2, '#1f2d52', 0, -0.2, 0)); A(disc(8.7, 0.02, '#35508f', 0, 0.002, 0)); A(disc(5.2, 0.015, '#2a3f78', 0, 0.004, 0));
  for (let i = 0; i < 40; i++) { const a = i / 40 * Math.PI * 2, r = 10 + (i % 5); A(ball(0.05 + (i % 3) * 0.03, '#ffe9a8', Math.cos(a) * r, 2 + (i * 37 % 60) / 10, -Math.abs(Math.sin(a)) * r - 6, 0)); }
  // back lights: soft blue/green glows
  const hl = (c, x, y, z, r, a) => { const h = halo(r, c, a); h.position.set(x, y, z); A(h); }; hl('#4a8aff', -6, 3, -7, 6, 0.25); hl('#76b900', 6, 3, -7, 6, 0.2);
  // pedestals + logo cubes
  const logo = (txt, col, sub) => tex(512, 512, (g, w, h) => { g.fillStyle = col; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.12)'; g.fillRect(0, 0, w, h * 0.5); g.fillStyle = '#ffffff'; g.font = 'bold 118px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(txt, w / 2, h * 0.46); g.font = 'bold 54px sans-serif'; g.fillStyle = 'rgba(255,255,255,.85)'; g.fillText(sub, w / 2, h * 0.74); });
  const cubeAt = (x, txt, col, sub) => { const z = -1.5; A(disc(1.15, 0.55, '#2a3558', x, 0, z)); A(disc(1.0, 0.06, '#3f4f86', x, 0.55, z)); A(rbox(1.5, 1.5, 1.5, col, x, 0.62, z, 0.12, 0.02)); const p = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), new THREE.MeshBasicMaterial({ map: logo(txt, col, sub), toneMapped: false })); p.position.set(x, 1.37, z + 0.77); A(p); };
  cubeAt(-3.9, 'CISCO', '#2d6cc8', '2000'); cubeAt(3.9, 'NVIDIA', '#5f9a00', 'NOW');
  // chain between the cubes (glowing links)
  const chain = new THREE.Group(); for (let i = 0; i < 14; i++) { const x = -3.0 + i * (6.0 / 13); const l = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.045, 10, 20), glowMat(i % 2 ? '#ffd24a' : '#fff0b0', 1.5)); l.position.set(x, 1.37 + Math.sin(i / 13 * Math.PI) * -0.16, -1.5); l.rotation.y = i % 2 ? 0 : Math.PI / 2; chain.add(l); }
  chain.position.x = -3.0; chain.children.forEach(c => { c.position.x += 3.0; }); chain.scale.x = 0.001; A(chain); st.chain = chain;
  // balance scale in front
  const sc = { x: 0, y: 2.7, z: 0.5 };
  A(disc(0.7, 0.12, '#cfd5e8', sc.x, 0, sc.z)); A(rbox(0.2, sc.y, 0.2, '#cfd5e8', sc.x, 0.1, sc.z, 0.05, 0.012)); A(ball(0.2, '#ffd24a', sc.x, sc.y, sc.z, 0.012));
  const beam = new THREE.Group(); beam.position.set(sc.x, sc.y, sc.z); beam.add(rbox(4.8, 0.14, 0.14, '#e8ecf8', 0, -0.07, 0, 0.05, 0.012)); A(beam);
  const mkPan = (sx) => { const g = new THREE.Group(); g.position.set(sx * 2.3, 0, 0); for (const dx of [-0.5, 0.5]) { const s = rbox(0.03, 1.3, 0.03, '#b8bfd8', dx, -1.3, 0, 0.01, 0); s.rotation.z = -dx * 0.25; g.add(s); } g.add(disc(0.78, 0.07, '#e8ecf8', 0, -1.38, 0, 0.012)); const coins = []; for (let i = 0; i < 16; i++) { const c = disc(0.3, 0.06, i % 2 ? '#ffd24a' : '#f0b830', (i % 4 - 1.5) * 0.04, -1.31 + Math.floor(i / 1) * 0.062, 0, 0.006); g.add(c); coins.push(c); } beam.add(g); g.coins = coins; return g; };
  const panL = mkPan(-1), panR = mkPan(1); st.panL = panL; st.panR = panR;
  st.setCoins = (side, n) => { (side === 'L' ? panL : panR).coins.forEach((c, i) => { c.visible = i < n; }); };
  st.setTilt = (a) => { beam.rotation.z = a; panL.rotation.z = -a; panR.rotation.z = -a; };
  st.setCoins('L', 6); st.setCoins('R', 6); st.setTilt(0);
  // hourglass over the Cisco cube
  const hg = new THREE.Group(); hg.position.set(-3.9, 2.35, -1.5);
  for (const y of [0, 1.1]) hg.add(disc(0.5, 0.07, '#ffd24a', 0, y, 0, 0.012));
  const glassM = new THREE.MeshBasicMaterial({ color: '#8fc8ff', transparent: true, opacity: 0.32, depthWrite: false });
  const c1 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.5, 24), glassM); c1.position.y = 0.32; hg.add(c1); const c2 = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.5, 24), glassM); c2.rotation.x = Math.PI; c2.position.y = 0.82; hg.add(c2);
  const sand = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.45, 20), glowMat('#ffd24a', 1.1)); sand.position.y = 0.3; hg.add(sand); const top = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.4, 20), glowMat('#ffd24a', 1.1)); top.rotation.x = Math.PI; top.position.y = 0.92; hg.add(top);
  hg.scale.setScalar(0.001); A(hg); st.hg = hg; st.setSand = (k) => { sand.scale.setScalar(0.15 + 0.85 * k); sand.position.y = 0.07 + 0.23 * (0.15 + 0.85 * k); top.scale.setScalar(Math.max(0.05, 1 - k)); };
  st.setSand(0);
  st.spots = { cisco: [-3.9, 0, -1.5], nvidia: [3.9, 0, -1.5], scale: [0, 2.7, 0.5], chain: [0, 1.37, -1.5], stage: [0, 0, 3.2] };
  st.upd = (t) => { hg.rotation.y = t * 0.6; };
  return { st, spots: st.spots };
}
