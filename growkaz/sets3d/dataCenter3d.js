// sets3d/dataCenter3d.js: an AI data-center hall in soft cartoon 3D (V03 Clip 23). A long aisle between rows of blinking server racks (blue-lit, green LEDs),
//   glowing ceiling strips, opening onto a pad at the far end with two revenue bars and a pile of GPU order crates.
//   const d = dataCenter3d(T) -> { st, spots }  st.setBars(k0,k1) (0..1 heights: before / last quarter), st.setCrates(n), st.upd(t)
import * as THREE from 'three';
import { toon, glowMat, rbox, disc, flat, tex, halo } from '/engine/three-toon.js';
import { P, put } from '/engine/props3d.js';

export function dataCenter3d(T, o = {}) {
  const st = T.stage({ mood: 'night', fog: [10, 36], fogColor: '#08142a', fov: 38, keyPos: [2, 5, 4], keyColor: '#bcd8ff', keyIntensity: 1.2, ambientSky: '#8aa8e8', ambient: 0.85, bloom: 0.55, bloomThreshold: 0.86, shadowSize: 10 });
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); return x[0]; };
  S.background = new THREE.Color('#08142a');
  const flr = tex(256, 256, (g, w, h) => { g.fillStyle = '#16233f'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(90,180,255,.35)'; g.lineWidth = 3; g.strokeRect(0, 0, w, h); g.strokeStyle = 'rgba(90,255,176,.25)'; g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); }, [1, 24]);
  const floor = flat(12, 48, toon('#ffffff', { map: flr }), 0, 0, -12); floor.rotation.x = -Math.PI / 2; A(floor);
  const ceil = flat(12, 48, '#0c1630', 0, 3.2, -12); ceil.rotation.x = Math.PI / 2; A(ceil);
  for (let z = 2; z > -24; z -= 2.2) { const s = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.18), glowMat('#cfe8ff', 1.5)); s.rotation.x = Math.PI / 2; s.position.set(0, 3.19, z); A(s); }
  // racks along both sides of the aisle (z from +2 to -6.5), a dim wall of racks far behind the pad
  const racks = []; const mk = (x, z, ry, h = 2.2) => { const r = P.routerRack({ h, units: 8 }); put(r, [x, 0, z], ry); A(r); racks.push(r); };
  for (let z = 2; z > -6.6; z -= 0.8) { mk(-2.05, z, Math.PI / 2); mk(2.05, z, -Math.PI / 2); }
  for (let x = -5; x <= 5; x += 0.8) mk(x, -17, 0, 2.4);
  for (const side of [-1, 1]) A(rbox(0.05, 0.05, 11, '#5ab4ff', side * 1.55, 0.03, -2.3, 0.01, 0));
  // cable ladders overhead
  for (const x of [-1.2, 1.2]) A(rbox(0.12, 0.08, 30, '#2a3550', x, 2.8, -8, 0.02, 0));
  // pad at the far end: two revenue bars + crates
  A(disc(3.6, 0.12, '#1d3a66', 0, 0, -11)); A(disc(3.4, 0.02, '#2f6ab0', 0, 0.12, -11));
  const barG = new THREE.Group(); const b0 = rbox(0.9, 1, 0.9, '#6a86b8', -1.5, 0, -11, 0.08, 0.015), b1 = rbox(0.9, 1, 0.9, '#2fd07a', 1.5, 0, -11, 0.08, 0.015);
  const b1g = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1, 0.92), glowMat('#5affb0', 0.5)); b1g.visible = false; A(b0, b1);
  b0.scale.y = 0.001; b1.scale.y = 0.001; st.setBars = (k0, k1) => { b0.scale.y = Math.max(0.001, 1.2 * k0); b1.scale.y = Math.max(0.001, 2.6 * k1); }; st.bars = { b0, b1 };
  const crates = []; const crateMat = ['#2a2f44', '#3a4260']; for (let i = 0; i < 18; i++) { const row = Math.floor(i / 6), c = i % 6, x = -1.5 + c * 0.6, y = row * 0.46, z = -13.5 + (row % 2) * 0.05; const cr = rbox(0.55, 0.42, 0.55, crateMat[i % 2], x, y + 0.12, z, 0.04, 0.01); const led = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.06), glowMat('#4aff7a', 2)); led.position.set(0, 0.28, 0.28); cr.add(led); A(cr); crates.push(cr); }
  st.setCrates = (n) => crates.forEach((c, i) => { c.visible = i < n; c.scale.setScalar(i < n ? 1 : 0.001); }); st.setCrates(0);
  const gl = halo(6, '#5affb0', 0.2); gl.position.set(0, 3, -15); A(gl);
  st.spots = { aisle: (z) => [0, 0, z], pad: [0, 0, -11], bar0: [-1.5, 0, -11], bar1: [1.5, 0, -11], crates: [0, 0, -13.5] };
  st.upd = (t) => { racks.forEach((r, i) => { if (r.update && i < 24) r.update(t); }); };
  return { st, spots: st.spots };
}
