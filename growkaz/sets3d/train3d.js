// sets3d/train3d.js: a commuter train car interior in soft cartoon 3D. The aisle runs along Z (camera usually at +z looking -z).
//   const tr = train3d(T, { time: 'morning' }) -> { st, spots, update(t), setLights(k) }
//   update(t): scrolls the city past the windows + sways the hanging handles. setLights(0..1): ceiling light level (flicker/dim).
//   spots: youSeat (left bench, sitting), aisle(z) -> [0,0,z], farEnd [0,0,-10.5], seatsL/seatsR arrays for passengers
import * as THREE from 'three';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo } from '/engine/three-toon.js';

export function train3d(T, o = {}) {
  const st = T.stage({ mood: 'day', fog: [9, 22], fogColor: '#c8d8e0', fov: 40, keyPos: [4, 6, 4], keyColor: '#fff6e8', keyIntensity: 1.3, ambientSky: '#f4f4ff', ambient: 1.35, bloom: 0.35, bloomThreshold: 0.9, shadowSize: 8 });
  st.scene.background = new THREE.Color('#bcd4e0');
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); return x[0]; };
  const L = 14, z0 = 2.5, zEnd = z0 - L, W = 2.6, H = 2.35;
  // floor, ceiling, walls
  const floorT = tex(256, 256, (g, w, h) => { g.fillStyle = '#7a7e88'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(0,0,0,.12)'; for (let i = 0; i < 40; i++) g.fillRect((i * 53) % w, (i * 97) % h, 6, 6); g.fillStyle = '#e0b84a'; g.fillRect(0, 0, 10, h); g.fillRect(w - 10, 0, 10, h); }, [1, 6]);
  const fl = A(flat(W, L, toon('#ffffff', { map: floorT }), 0, 0, z0 - L / 2)); fl.rotation.x = -Math.PI / 2;
  const ceil = A(flat(W, L, toon('#eef0f2'), 0, H, z0 - L / 2)); ceil.rotation.x = Math.PI / 2;
  for (const sx of [-1, 1]) { const wl = A(flat(L, H, toon('#dfe4e8'), sx * W / 2, H / 2, z0 - L / 2)); wl.rotation.y = -sx * Math.PI / 2; }
  // end wall with door window
  A(flat(W, H, toon('#cfd6dc'), 0, H / 2, zEnd)); A(rbox(0.9, 1.9, 0.05, '#9aa4ae', 0, 0, zEnd + 0.03, 0.04, 0.01)); A(flat(0.6, 0.7, glowMat('#cfe6f4', 0.9), 0, 1.45, zEnd + 0.07));
  // windows with a scrolling city (one shared texture, offset in update)
  const city = tex(1024, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#9fcbe8'); gr.addColorStop(1, '#e8f0f0'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 60; i++) { const bw = 20 + (i * 37) % 50, bh = 60 + (i * 61) % 150, x = (i * 71) % w; g.fillStyle = ['#a8b4c8', '#8a9ab0', '#c0b0a8', '#b0c0b8'][i % 4]; g.fillRect(x, h - bh, bw, bh); g.fillStyle = 'rgba(255,255,255,.5)'; for (let k = 0; k < bh / 18; k++) g.fillRect(x + 4, h - bh + 6 + k * 18, bw - 8, 5); }
    g.fillStyle = '#6a7a6a'; g.fillRect(0, h - 18, w, 18); }); city.wrapS = THREE.RepeatWrapping; city.repeat.set(0.35, 1);
  const winMat = new THREE.MeshBasicMaterial({ map: city });
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) { const z = z0 - 1.3 - i * 2.1, wn = A(new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.8), winMat)); wn.position.set(sx * (W / 2 - 0.01), 1.55, z); wn.rotation.y = -sx * Math.PI / 2;
    A(rbox(0.04, 0.9, 1.62, '#9aa4ae', sx * (W / 2 - 0.02), 1.1, z, 0.03, 0.008)); }
  // ad panels above windows, colourful (no text)
  for (const sx of [-1, 1]) for (let i = 0; i < 6; i++) { const ad = A(flat(1.2, 0.32, toon(['#e0562f', '#4a78b8', '#e0b05a', '#2f8a57', '#a8508a', '#3fa7a0'][(i + (sx > 0 ? 2 : 0)) % 6]), sx * (W / 2 - 0.02), 2.12, z0 - 1.3 - i * 2.1)); ad.rotation.y = -sx * Math.PI / 2; }
  // benches (rounded) along both sides
  const seatsL = [], seatsR = [];
  for (const sx of [-1, 1]) for (let i = 0; i < 4; i++) { const z = z0 - 1.6 - i * 3.0; A(rbox(0.55, 0.12, 2.2, sx < 0 ? '#3a6aa8' : '#c0563a', sx * (W / 2 - 0.32), 0.42, z, 0.05)); A(rbox(0.12, 0.55, 2.2, sx < 0 ? '#3a6aa8' : '#c0563a', sx * (W / 2 - 0.08), 0.5, z, 0.05)); A(rbox(0.5, 0.42, 2.1, '#8a929c', sx * (W / 2 - 0.32), 0, z, 0.04, 0.008));
    for (const dz of [-0.6, 0.6]) (sx < 0 ? seatsL : seatsR).push([sx * (W / 2 - 0.55), 0, z + dz]); }
  // poles + top rails + hanging handles (sway)
  const handles = [];
  for (let i = 0; i < 7; i++) { const z = z0 - 0.6 - i * 2.0; for (const sx of [-1, 1]) A(disc(0.025, H, '#c8ccd4', sx * 0.55, 0, z, 0.006)); }
  for (const sx of [-1, 1]) { const rail = A(pill(0.02, L - 0.4, '#c8ccd4', sx * 0.7, 2.05, z0 - L / 2, 0.006)); rail.rotation.x = Math.PI / 2;
    for (let i = 0; i < 14; i++) { const gp = new THREE.Group(); gp.position.set(sx * 0.7, 2.05, z0 - 0.5 - i * 1.0); const strap = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.01), toon('#3a3a44')); strap.position.y = -0.11; gp.add(strap);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20), toon('#f4f4f4')); ring.position.y = -0.28; gp.add(ring); A(gp); handles.push(gp); } }
  // ceiling light strips (emissive) + lights
  const strips = [];
  for (const sx of [-1, 1]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, L - 0.6), glowMat('#fffaf0', 1.6)); s.position.set(sx * 0.45, H - 0.03, z0 - L / 2); A(s); strips.push(s); }
  const pls = []; for (let i = 0; i < 4; i++) { const p = new THREE.PointLight('#fff4e4', 3.0, 6, 1.6); p.position.set(0, H - 0.2, z0 - 1 - i * 3.4); A(p); pls.push(p); }
  // a few bags / a newspaper on seats as clutter
  A(rbox(0.3, 0.22, 0.4, '#5a3a2a', -(W / 2 - 0.35), 0.48, z0 - 7.3, 0.05)); A(rbox(0.32, 0.02, 0.24, '#f4f0e6', W / 2 - 0.35, 0.49, z0 - 4.2, 0.01, 0.004));
  const setLights = (k) => { strips.forEach(s => s.material.color.set('#fffaf0').multiplyScalar(0.15 + 1.45 * k)); pls.forEach(p => { p.intensity = 3.0 * k; }); st.hemi.intensity = 0.5 + 0.85 * k; };
  const update = (t, speed = 1) => { city.offset.x = (t * 0.25 * speed) % 1; handles.forEach((h, i) => { h.rotation.x = Math.sin(t * 1.6 + i * 0.4) * 0.12; }); };
  update(0);
  const spots = { youSeat: [-(W / 2 - 0.55), 0, z0 - 1.0], farEnd: [0, 0, zEnd + 1.2], aisle: (z) => [0, 0, z], seatsL, seatsR, z0, zEnd };
  return { st, spots, update, setLights };
}
