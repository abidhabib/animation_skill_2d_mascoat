// sets3d/bedroom3d.js: the hero's bedroom in soft cartoon 3D. o.time: 'dawn' (pre-dawn blue, phone glow) | 'morning' (warm sunrise).
//   const b = bedroom3d(T, { time }); -> { st, spots, setClock(h, m), setPhone(glow 0..1, buzzX) }
//   spots: bedEdge (sit, feet), standBy (stand next to bed), phone (on the nightstand), clock (wall clock centre), window
import * as THREE from 'three';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo } from '/engine/three-toon.js';

export function bedroom3d(T, o = {}) {
  const dawn = (o.time || 'morning') === 'dawn';
  const st = T.stage({ mood: dawn ? 'night' : 'golden', fog: false, fov: 35, sky: '#1a1a2e', keyPos: [3, 5, -7], keyColor: dawn ? '#9fb0ff' : '#ffd9b0', keyIntensity: dawn ? 0.5 : 1.3, ambientSky: dawn ? '#8090c0' : '#fff1e0', ambient: dawn ? 0.55 : 1.2, bloom: 0.35, bloomThreshold: 0.92, shadowSize: 6 });
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); };
  const planks = tex(512, 512, (g, w, h) => { g.fillStyle = '#8a6248'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.04)'; g.fillRect(0, i * h / 8, w, h / 8); g.fillStyle = 'rgba(40,20,10,.35)'; g.fillRect(0, i * h / 8, w, 3); g.fillRect((i * 211) % w, i * h / 8, 3, h / 8); } }, [4, 4]);
  const floor = flat(12, 10, toon('#ffffff', { map: planks }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; A(floor);
  const wall = dawn ? '#6e7aa8' : '#c7b0c8';
  A(flat(12, 3.2, wall, 0, 1.6, -3)); const L = flat(10, 3.2, dawn ? '#5e6a98' : '#b89fba', -4.2, 1.6, 2); L.rotation.y = Math.PI / 2; A(L);
  const R = flat(10, 3.2, dawn ? '#5e6a98' : '#b89fba', 4.4, 1.6, 2); R.rotation.y = -Math.PI / 2; A(R);
  A(rbox(12, 0.12, 0.06, '#e8e0d4', 0, 0, -2.97, 0.02, 0));
  // window with blinds half open + sunrise sky
  const sky = tex(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); (dawn ? ['#141a3a', '#2a3a70', '#5a5a9a'] : ['#7a6aa8', '#e89a8a', '#ffc070', '#ffe2a0']).forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = dawn ? 'rgba(20,24,50,.95)' : 'rgba(110,70,100,.8)'; for (let i = 0; i < 12; i++) { const bh = 50 + ((i * 41) % 80); g.fillRect(i * 22, h - bh, 20, bh); }
    g.fillStyle = 'rgba(255,220,140,.9)'; for (let i = 0; i < 20; i++) g.fillRect((i * 37) % w, h - 20 - ((i * 23) % 60), 3, 4); if (!dawn) { g.fillStyle = '#fff4d0'; g.beginPath(); g.arc(w * 0.68, h * 0.72, 22, 0, 7); g.fill(); } });
  const wx = 1.5, wy = 1.75;
  A(flat(1.6, 1.3, new THREE.MeshBasicMaterial({ map: sky }), wx, wy, -2.99));
  for (const [w, h, x, y] of [[1.76, 0.08, wx, wy + 0.69], [1.76, 0.08, wx, wy - 0.69], [0.08, 1.46, wx - 0.84, wy], [0.08, 1.46, wx + 0.84, wy]]) A(rbox(w, h, 0.08, '#f4ecdc', x, y - h / 2, -2.96, 0.03, 0.012));
  for (let i = 0; i < 8; i++) A(rbox(1.6, 0.05, 0.03, dawn ? '#8a90b8' : '#f6efe2', wx, wy + 0.62 - i * 0.075, -2.93, 0.015, 0));   // blinds (top half)
  A(rbox(1.9, 0.07, 0.22, '#f4ecdc', wx, wy - 0.76, -2.88, 0.03));
  if (!dawn) { const sun = halo(3.0, '#ffb070', 0.32); sun.position.set(wx + 0.3, wy - 0.2, -2.85); A(sun); const fill = new THREE.PointLight('#ffb878', 3, 6, 2); fill.position.set(wx, wy, -2.4); A(fill); }
  // bed (rounded): headboard on the left, long side to camera
  const bx = -0.5, bz = -2.25;
  A(rbox(2.2, 0.32, 1.5, '#7a4e34', bx, 0.12, bz, 0.06));                                       // frame
  for (const [lx, lz] of [[-1, -0.65], [1, -0.65], [-1, 0.65], [1, 0.65]]) A(disc(0.05, 0.14, '#5a3828', bx + lx, 0, bz + lz, 0.01));
  A(rbox(0.12, 1.05, 1.56, '#7a4e34', bx - 1.12, 0, bz, 0.06));                                 // headboard
  A(rbox(2.1, 0.22, 1.42, '#f4efe6', bx, 0.42, bz, 0.09));                                       // mattress
  A(rbox(1.35, 0.16, 1.48, dawn ? '#3a4a8a' : '#e08a5a', bx + 0.38, 0.6, bz, 0.08));            // duvet
  A(rbox(0.4, 0.14, 0.62, '#ffffff', bx - 0.8, 0.62, bz - 0.33, 0.07), rbox(0.4, 0.14, 0.62, '#ffffff', bx - 0.8, 0.62, bz + 0.33, 0.07));
  // nightstand + lamp + phone (screen glow controllable)
  const nx = bx - 1.6, nz = -2.55;
  A(rbox(0.5, 0.55, 0.45, '#8a5a3e', nx, 0, nz, 0.05)); A(pill(0.015, 0.1, '#d8c08a', nx, 0.3, nz + 0.24, 0));
  A(lathe([[0, 0], [0.09, 0], [0.04, 0.05], [0.025, 0.3], [0, 0.3]], '#3a3040', nx - 0.12, 0.55, nz - 0.05));
  const shade = lathe([[0.16, 0], [0.1, 0.2], [0.0, 0.2]], toon(dawn ? '#8a8aa0' : '#ffe2a8', { side: THREE.DoubleSide }), nx - 0.12, 0.8, nz - 0.05); A(shade);
  const phone = new THREE.Group(); phone.position.set(nx + 0.1, 0.56, nz + 0.05); phone.rotation.y = 0.3;
  phone.add(rbox(0.09, 0.015, 0.17, '#1e1c26', 0, 0, 0, 0.01, 0.004)); const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.155), glowMat('#bfe6ff', 0.0)); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.017; phone.add(scr); A(phone);
  const pl = new THREE.PointLight('#9fd8ff', 0, 2.5, 1.5); pl.position.set(nx + 0.1, 0.75, nz + 0.05); A(pl); const ph = halo(0.8, '#9fd8ff', 0); ph.position.set(nx + 0.1, 0.65, nz + 0.05); A(ph);
  // mounted wall clock with real hands (pivot groups)
  const cx = bx - 0.1, cy = 2.25;
  const face = tex(256, 256, (g, w, h) => { g.fillStyle = '#fbf6ea'; g.beginPath(); g.arc(w / 2, h / 2, w / 2, 0, 7); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * 100, h / 2 + Math.sin(a) * 100); g.lineTo(w / 2 + Math.cos(a) * 118, h / 2 + Math.sin(a) * 118); g.stroke(); } });
  const clk = disc(0.26, 0.05, toon('#ffffff', { map: face }), cx, cy, -2.99); clk.rotation.x = Math.PI / 2; A(clk);
  const hand = (len, w) => { const gp = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.01), new THREE.MeshBasicMaterial({ color: '#1b1424' })); m.position.y = len / 2; gp.add(m); gp.position.set(cx, cy, -2.93); A(gp); return gp; };
  const hh = hand(0.13, 0.025), mh = hand(0.2, 0.016); A(ball(0.02, '#1b1424', cx, cy, -2.925, 0));
  const setClock = (h, m) => { hh.rotation.z = -((h % 12) + m / 60) / 12 * Math.PI * 2; mh.rotation.z = -(m / 60) * Math.PI * 2; };
  setClock(7, 0);
  // poster, shelf + plant, rug
  A(rbox(0.7, 0.9, 0.03, '#2a2030', -2.9, 1.3, -2.97, 0.02, 0)); A(flat(0.6, 0.8, toon('#8ab0c8'), -2.9, 1.75, -2.94));
  A(rbox(0.9, 0.05, 0.25, '#7a4e34', 3.3, 1.6, -2.85, 0.02)); A(lathe([[0, 0], [0.1, 0], [0.12, 0.16], [0, 0.16]], '#c4643a', 3.1, 1.65, -2.85)); A(ball(0.14, '#4f9a55', 3.1, 1.9, -2.85));
  const rug = disc(1.3, 0.01, dawn ? '#3a3a6a' : '#9a5a7a', 0.2, 0.001, -0.8, 0); rug.scale.z = 0.6; A(rug);
  const lampL = new THREE.PointLight('#ffd49a', dawn ? 0 : 1.5, 4, 2); lampL.position.set(nx - 0.12, 0.95, nz); A(lampL);
  const setPhone = (k, buzz = 0) => { scr.material.color.set('#bfe6ff').multiplyScalar(0.05 + 2.2 * k); pl.intensity = 3.5 * k; ph.material.opacity = 0.55 * k; phone.position.x = nx + 0.1 + buzz; };
  setPhone(0);
  const spots = { bedEdge: [bx + 0.35, 0, bz + 0.8], standBy: [bx + 1.5, 0, -1.2], phone: [nx + 0.1, 0.57, nz + 0.05], clock: [cx, cy, -2.95], window: [wx, wy, -2.95], nightstand: [nx, 0.55, nz] };
  return { st, spots, setClock, setPhone };
}
