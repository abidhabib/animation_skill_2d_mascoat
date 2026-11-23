// sets3d/kitchen3d.js: Dad's kitchen in soft cartoon 3D (rounded, outlined, warm). 1 unit = 1 m. Camera looks toward -z.
//   const k = kitchen3d(T, { time: 'evening' | 'morning' });  ->  { st (stage), spots }
//   spots: stove (Dad making tea), chairOld / chairNew (seated, feet), tableTop (y of the table top), door, window
import * as THREE from 'three';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo } from '/engine/three-toon.js';
import { P, put, leafPlant, mirrorMat } from '/engine/props3d.js';   // the shared object library (2026-11-22)

export function kitchen3d(T, o = {}) {
  const eve = (o.time || 'evening') === 'evening';
  const st = T.stage({ mood: eve ? 'golden' : 'day', fog: false, fov: 35, sky: '#2a1e28', keyPos: [-3, 5, -7], keyColor: eve ? '#ffd2a8' : '#fff4e0', keyIntensity: eve ? 1.2 : 2.0, ambientSky: '#fff3e6', ambient: eve ? 1.25 : 1.5, bloom: 0.3, bloomThreshold: 0.95, shadowSize: 6 });
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); };
  // floor (warm planks) + walls
  const planks = tex(512, 512, (g, w, h) => { g.fillStyle = '#9a6a48'; g.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? 'rgba(0,0,0,.05)' : 'rgba(255,255,255,.04)'; g.fillRect(0, i * h / 8, w, h / 8); g.fillStyle = 'rgba(40,20,10,.35)'; g.fillRect(0, i * h / 8, w, 3); g.fillRect(((i * 197) % w), i * h / 8, 3, h / 8); } }, [4, 4]);
  const floor = flat(12, 10, toon('#ffffff', { map: planks }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; A(floor);
  const wallC = eve ? '#e2b98e' : '#ecd2aa';
  const back = flat(12, 3.2, wallC, 0, 1.6, -3); A(back);
  const left = flat(10, 3.2, '#d6a87c', -4.2, 1.6, 2); left.rotation.y = Math.PI / 2; A(left);
  const right = flat(10, 3.2, '#d6a87c', 4.6, 1.6, 2); right.rotation.y = -Math.PI / 2; A(right);
  A(rbox(12, 0.12, 0.06, '#7a4a32', 0, 0, -2.97, 0.02, 0));                                  // skirting
  const tiles = tex(256, 128, (g, w, h) => { g.fillStyle = '#f1e7d6'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(150,120,90,.35)'; g.lineWidth = 3; for (let x = 0; x <= w; x += 32) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); } for (let y = 0; y <= h; y += 32) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); } }, [6, 2]);
  A(flat(3.8, 0.75, toon('#ffffff', { map: tiles }), 2.1, 1.3, -2.985));                     // backsplash
  // window with an evening sky (emissive) + curtains
  const sky = tex(256, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); (eve ? ['#5a4a8a', '#c86a7a', '#f4a860', '#ffd890'] : ['#8ab8e8', '#cfe4f4', '#f4ecd8']).forEach((c, i, a) => gr.addColorStop(i / (a.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = eve ? 'rgba(70,40,70,.85)' : 'rgba(120,140,160,.6)'; for (let i = 0; i < 12; i++) { const bh = 40 + ((i * 53) % 90); g.fillRect(i * 22, h - bh, 20, bh); }
    if (eve) { g.fillStyle = 'rgba(255,220,140,.9)'; for (let i = 0; i < 18; i++) g.fillRect((i * 37) % w, h - 20 - ((i * 29) % 70), 3, 4); } });
  A(flat(1.5, 1.2, new THREE.MeshBasicMaterial({ map: sky }), -1.6, 1.75, -2.99));
  for (const [w, h, x, y] of [[1.66, 0.08, -1.6, 2.35], [1.66, 0.08, -1.6, 1.11], [0.08, 1.3, -2.39, 1.15], [0.08, 1.3, -0.81, 1.15], [0.06, 1.2, -1.6, 1.15]]) A(rbox(w, h, 0.08, '#f4ecdc', x, y, -2.96, 0.03, 0.012));
  A(rbox(1.8, 0.07, 0.22, '#f4ecdc', -1.6, 1.05, -2.88, 0.03));                                // sill
  for (const s of [-1, 1]) { const c = pill(0.09, 1.2, '#c0563a', -1.6 + s * 0.92, 1.72, -2.86); c.scale.x = 1.6; A(c); }
  A(rbox(2.2, 0.05, 0.05, '#7a4a32', -1.6, 2.45, -2.9, 0.02, 0));
  if (eve) { const sun = halo(2.6, '#ffb060', 0.35); sun.position.set(-1.6, 1.6, -2.9); A(sun); }
  // counter run (sage cabinets, cream top), uppers, handles
  const cab = '#7fa69a';
  A(rbox(3.7, 0.86, 0.62, cab, 2.15, 0, -2.66, 0.05));
  for (let i = 0; i < 4; i++) { A(rbox(0.86, 0.72, 0.03, '#7ea398', 0.7 + i * 0.92, 0.07, -2.34, 0.04, 0.01)); A(pill(0.018, 0.12, '#d8c08a', 1.02 + i * 0.92, 0.66, -2.3, 0)); }
  A(rbox(3.8, 0.07, 0.68, '#f2ead8', 2.15, 0.86, -2.66, 0.03));
  A(rbox(3.0, 0.7, 0.36, cab, 2.45, 1.85, -2.8, 0.05)); for (let i = 0; i < 3; i++) A(pill(0.018, 0.1, '#d8c08a', 1.45 + i * 1.0, 1.98, -2.6, 0));
  A(rbox(0.7, 0.03, 0.55, '#2a2a30', 3.2, 0.93, -2.66, 0.01, 0));                               // hob
  A(put(P.kettle({}), [3.1, 0.96, -2.62], 0, 1.3));   // kettle
  A(lathe([[0, 0], [0.09, 0], [0.1, 0.16], [0.07, 0.18], [0, 0.19]], '#f4f0e6', 1.0, 0.93, -2.6));                                 // sugar jar
  A(ball(0.04, '#c0563a', 1.0, 1.13, -2.6, 0));
  A(put(leafPlant({ kind: 'leafy', size: 1.1 }), [0.45, 0.93, -2.65]));
  // fridge (rounded, cream) left corner
  A(put(P.fridge({ h: 1.95 }), [-3.55, 0, -2.55], 0, 1.05));
  // wall clock (mounted) above the counter
  const clockFace = tex(256, 256, (g, w, h) => { g.fillStyle = '#fbf6ea'; g.beginPath(); g.arc(w / 2, h / 2, w / 2, 0, 7); g.fill(); g.strokeStyle = '#1b1424'; g.lineWidth = 6; for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * 100, h / 2 + Math.sin(a) * 100); g.lineTo(w / 2 + Math.cos(a) * 115, h / 2 + Math.sin(a) * 115); g.stroke(); }
    g.lineWidth = 10; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2 + 60 * Math.cos(-Math.PI / 2 + 7 / 12 * 2 * Math.PI), h / 2 + 60 * Math.sin(-Math.PI / 2 + 7 / 12 * 2 * Math.PI)); g.stroke(); g.lineWidth = 7; g.beginPath(); g.moveTo(w / 2, h / 2); g.lineTo(w / 2, h / 2 - 90); g.stroke(); });
  const clk = disc(0.24, 0.05, toon('#ffffff', { map: clockFace }), 0.2, 2.25, -2.98); clk.rotation.x = Math.PI / 2; A(clk);
  // shelf with jars on the left wall
  const shelf = rbox(0.24, 0.05, 1.3, '#7a4a32', -4.05, 1.7, -0.2, 0.02); A(shelf);
  ['#e0b05a', '#c96f8a', '#5a8ab8', '#e0562f'].forEach((c, i) => A(lathe([[0, 0], [0.07, 0], [0.075, 0.16], [0.05, 0.18], [0, 0.18]], c, -4.05, 1.75, -0.7 + i * 0.32)));
  // round table + the two chairs (old one = worn brown, by the window side)
  const tb = [-0.4, 0, 0.3];
  A(disc(0.34, 0.04, '#5a3a28', tb[0], 0, tb[2])); A(disc(0.06, 0.72, '#5a3a28', tb[0], 0.02, tb[2], 0.012)); A(disc(0.75, 0.06, '#a8724a', tb[0], 0.72, tb[2]));
  function chair(x, z, rotY, col) { const g = new THREE.Group(); g.add(rbox(0.46, 0.06, 0.46, col, 0, 0.45, 0, 0.03)); g.add(rbox(0.46, 0.55, 0.06, col, 0, 0.5, -0.21, 0.03)); for (const [lx, lz] of [[-0.19, -0.19], [0.19, -0.19], [-0.19, 0.19], [0.19, 0.19]]) g.add(disc(0.025, 0.45, col, lx, 0, lz, 0.01)); g.position.set(x, 0, z); g.rotation.y = rotY; return g; }
  A(chair(tb[0] - 1.05, tb[2], Math.PI / 2, '#7a4e34'));   // the same old chair
  A(chair(tb[0] + 1.05, tb[2], -Math.PI / 2, '#a8784e'));
  A(put(P.mug({ color: '#f4f0e6' }), [tb[0] - 0.2, 0.78, tb[2] + 0.1], 0.5), put(P.mug({ color: '#5a8ab8' }), [tb[0] + 0.25, 0.78, tb[2] - 0.05], 2.6));
  const rug = disc(1.5, 0.01, '#9a4a3e', tb[0], 0.001, tb[2], 0); rug.scale.z = 0.7; A(rug);
  // pendant lamp over the table (warm light + glow)
  A(disc(0.012, 1.4, '#1b1424', tb[0], 1.95, tb[2], 0));
  A(lathe([[0.02, 0.22], [0.08, 0.2], [0.26, 0.02], [0.28, 0], [0.02, 0.0]].reverse(), toon('#e0a040', { side: THREE.DoubleSide }), tb[0], 1.75, tb[2]));
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), glowMat('#fff0c0', 1.4)); bulb.position.set(tb[0], 1.76, tb[2]); A(bulb);
  const lamp = new THREE.PointLight('#ffd49a', eve ? 4.5 : 2, 7, 1.6); lamp.position.set(tb[0], 1.7, tb[2]); lamp.castShadow = true; lamp.shadow.mapSize.set(1024, 1024); lamp.shadow.bias = -0.002; A(lamp);
  const hl = halo(1.0, '#ffd08a', 0.28); hl.position.set(tb[0], 1.72, tb[2]); A(hl);
  const fill = new THREE.PointLight('#ffc090', eve ? 2 : 1, 6, 2); fill.position.set(-1.6, 1.8, -2.4); A(fill);
  // doorway on the right wall (warm hallway light)
  A(rbox(0.06, 2.1, 1.0, '#f4ecdc', 4.56, 0, 1.2, 0.02, 0.012)); const dh = flat(0.9, 2.0, glowMat('#ffd8a0', 0.9), 4.55, 1.0, 1.2); dh.rotation.y = -Math.PI / 2; A(dh);
  const spots = { stove: [2.7, 0, -1.85], chairOld: [tb[0] - 0.78, 0, tb[2]], chairNew: [tb[0] + 0.78, 0, tb[2]], table: [tb[0], 0.75, tb[2]], window: [-1.6, 1.7, -2.9], kettle: [3.1, 1.1, -2.62], door: [4.2, 0, 1.2] };
  return { st, spots };
}
