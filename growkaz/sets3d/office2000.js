// sets3d/office2000.js: a March-2000 trading floor / dot-com office in soft cartoon 3D (V03 Nvidia vs Cisco, 2026-11-22).
//   const o = office2000(T, { time: 'day'|'evening' }); -> { st, spots, update(t) }
//   Beige CRTs on rows of desks with low cubicle panels, a glowing green stock ticker on the back wall (scrolls in update),
//   a router rack in the back-right corner (blinking LEDs), wall calendar "MAR 2000", wall clock, plants, water cooler, filing cabinets.
//   spots: heroChair (sit here, faces -z to his CRT), heroDesk, heroCrt (screen centre), rack (front centre), ticker (centre),
//          deskSeats: other people's chair spots, calendar, window
import * as THREE from 'three';
import { toon, glowMat, rbox, disc, flat, tex, halo } from '/engine/three-toon.js';
import { P, put, leafPlant } from '/engine/props3d.js';

export function office2000(T, o = {}) {
  const eve = o.time === 'evening', crash = !!o.crash;
  const st = T.stage({ mood: eve ? 'golden' : 'day', fog: false, fov: 38, sky: '#cfe0ee', keyPos: [-4, 6, 3], keyColor: eve ? '#ffd2a0' : '#fff4e6', keyIntensity: crash ? 0.7 : 1.1, ambientSky: crash ? '#c0c8e0' : '#f4f0ff', ambient: crash ? 0.8 : 1.25, bloom: 0.4, bloomThreshold: 0.9, shadowSize: 9 });
  const S = st.scene, A = (...x) => { x.forEach(m => S.add(m)); };
  // carpet + walls + ceiling
  const carpet = tex(256, 256, (g, w, h) => { g.fillStyle = '#5a6a86'; g.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { g.fillStyle = i % 2 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.07)'; g.fillRect((i * 97) % w, (i * 61) % h, 3, 3); } g.strokeStyle = 'rgba(0,0,0,.08)'; for (let i = 0; i < 4; i++) { g.strokeRect(i * 64, 0, 64, h); } }, [6, 6]);
  const floor = flat(16, 12, toon('#ffffff', { map: carpet }), 0, 0, 0); floor.rotation.x = -Math.PI / 2; A(floor);
  A(flat(16, 3.4, '#e6dcc8', 0, 1.7, -4)); const L = flat(12, 3.4, '#d8ccb6', -6, 1.7, 2); L.rotation.y = Math.PI / 2; A(L); const R = flat(12, 3.4, '#d8ccb6', 6, 1.7, 2); R.rotation.y = -Math.PI / 2; A(R);
  const ceil = flat(16, 12, '#efeae0', 0, 3.4, 0); ceil.rotation.x = Math.PI / 2; A(ceil);
  A(rbox(16, 0.12, 0.05, '#bfb29a', 0, 0, -3.97, 0.02, 0));
  for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.5), glowMat('#fffbea', 1.3)); p.rotation.x = Math.PI / 2; p.position.set(-4.5 + i * 3, 3.39, -2.5 + j * 2.5); A(p); }
  // windows (left wall) with a 2000 skyline
  for (const z of [-2.4, 0.4]) A(put(P.window({ w: 1.8, h: 1.4, sky: eve ? 'sunset' : 'day', curtains: false }), [-5.97, 0.9, z], Math.PI / 2));
  // the stock ticker board on the back wall (scrolling, glowing)
  const tk = tex(2048, 128, (g, w, h) => { g.fillStyle = '#050a08'; g.fillRect(0, 0, w, h); g.font = 'bold 74px monospace'; g.textBaseline = 'middle';
    const items = crash ? [['NASDAQ 1,795', 0], ['CSCO 15.81', 0], ['DOW 9,551', 0], ['MSFT 59.10', 0], ['INTC 26.52', 0], ['ORCL 12.66', 0], ['NORTEL 7.86', 0], ['S&P 1,153', 0]] : [['NASDAQ 4,963', 1], ['CSCO 80.06', 1], ['DOW 10,864', 1], ['MSFT 106.25', 1], ['INTC 132.50', 1], ['ORCL 79.31', 1], ['NORTEL 70.25', 1], ['S&P 1,523', 1]]; let x = 30;
    for (const [s, up] of items) { const ar = up ? ' ▲' : ' ▼'; g.fillStyle = up ? '#5aff8a' : '#ff5a5a'; g.fillText(s + ar, x, h / 2 + 4); x += g.measureText(s + ar).width + 90; }
    g.fillStyle = 'rgba(0,0,0,.35)'; for (let y = 0; y < h; y += 6) g.fillRect(0, y, w, 2); });
  tk.wrapS = THREE.RepeatWrapping; tk.repeat.set(1.6, 1);
  A(rbox(7.4, 0.62, 0.12, '#1a1c22', 0, 2.25, -3.95, 0.03, 0.01));
  const board = new THREE.Mesh(new THREE.PlaneGeometry(7.2, 0.5), new THREE.MeshBasicMaterial({ map: tk, toneMapped: false })); board.position.set(0, 2.56, -3.88); A(board);
  const bh = halo(4.5, crash ? '#ff5a5a' : '#5aff8a', 0.12); bh.position.set(0, 2.56, -3.8); A(bh);
  // wall calendar "MAR 2000" + wall clock
  const cal = tex(256, 300, (g, w, h) => { g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h); g.fillStyle = '#d8302a'; g.fillRect(0, 0, w, 80); g.fillStyle = '#ffffff'; g.font = 'bold 54px sans-serif'; g.textAlign = 'center'; g.fillText('MARCH', w / 2, 58);
    g.fillStyle = '#1b1424'; g.font = 'bold 120px sans-serif'; g.fillText(crash ? '27' : '27', w / 2, 200); g.font = 'bold 48px sans-serif'; g.fillText(crash ? '2001' : '2000', w / 2, 268); });
  A(flat(0.5, 0.6, new THREE.MeshBasicMaterial({ map: cal }), 4.2, 1.75, -3.97));
  A(put(P.wallClock({}), [-3.6, 2.05, -3.96]));
  // rows of desks: low cubicle panel + CRT + office chair each
  const crts = [], seats = [];
  const rows = [-2.3, -0.3, 1.7], cols = [-3.4, -1.15, 1.15, 3.4];
  rows.forEach((z, ri) => cols.forEach((x, ci) => {
    A(put(P.desk({ w: 1.5, d: 0.75, color: '#b8a888' }), [x, 0, z]));
    A(rbox(1.6, 1.15, 0.06, '#7a8aa6', x, 0, z - 0.42, 0.02, 0.006));
    const c = put(P.crt({ screen: crash ? 'down' : ((ri + ci) % 3 ? 'chart' : 'up') }), [x - 0.15, 0.735, z - 0.05], 0, 1); A(c); crts.push(c);
    A(put(P.officeChair({ color: ['#2a2a33', '#3a3a5a', '#4a2a2a'][(ri + ci) % 3] }), [x - 0.15, 0, z + 0.62], Math.PI));
    if ((ri + ci) % 2) A(put(P.mug({ color: ['#e0562f', '#f4f0e6', '#4a78b8'][ci % 3] }), [x + 0.4, 0.735, z + 0.1], 0.4));
    if ((ri * 4 + ci) % 3 === 1) A(put(P.bookStack({}), [x + 0.5, 0.735, z - 0.15], 0.2, 0.8));
    seats.push([x - 0.15, 0, z + 0.75]);
  }));
  // router rack (back right corner), filing cabinets, water cooler, plants
  const rack = put(P.routerRack({}), [5.0, 0, -3.3], -0.5); A(rack);
  for (let i = 0; i < 3; i++) { A(rbox(0.5, 1.3, 0.6, '#9aa0a8', -5.4, 0, -3.5 + i * 0.55, 0.02, 0.006)); for (let d = 0; d < 3; d++) A(rbox(0.42, 0.34, 0.02, '#aab0b8', -5.13, 0.1 + d * 0.4, -3.5 + i * 0.55, 0.01, 0.003)); }
  A(rbox(0.36, 1.0, 0.36, '#e8e8ee', 5.4, 0, 0.8, 0.04, 0.006)); A(disc(0.15, 0.45, toon('#9fd0f0', { transparent: true, opacity: 0.85 }), 5.4, 1.0, 0.8, 0.006));
  A(put(leafPlant({ kind: 'tall', size: 1.6 }), [-5.4, 0, 2.6]), put(leafPlant({ kind: 'monstera', size: 1.8 }), [5.3, 0, 2.2]), put(leafPlant({ kind: 'leafy', size: 1.2 }), [-0.0, 0, -3.6]));
  const hero = { desk: [cols[1], 0.735, rows[2]], chair: [cols[1] - 0.15, 0, rows[2] + 0.75] };
  const update = (t) => { tk.offset.x = (t * 0.06) % 1; rack.update(t); };
  update(0);
  const spots = { heroDesk: hero.desk, heroChair: hero.chair, heroCrt: [cols[1] - 0.15, 1.01, rows[2] + 0.11], rack: [5.0, 1.0, -3.3], ticker: [0, 2.56, -3.88], deskSeats: seats, calendar: [4.2, 1.75, -3.97], window: [-5.97, 1.6, -2.4] };
  return { st, spots, update, crts };
}
