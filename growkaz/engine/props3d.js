// props3d.js: THE reusable 3D object library (user 2026-11-22: "objects more real, proper library for future reuse").
// Every prop returns a THREE.Group: base on y = 0, centred on x/z, FRONT faces +z (toward the usual camera), 1 unit = 1 m,
// real-world sizes. Place with put(obj, [x, y, z], rotY, scale). Cartoon look: toon shading + thin ink lines, but REAL
// proportions and the small details that make an object read instantly (rims, handles, seams, labels, soles, page edges).
//   import { P, put } from '/engine/props3d.js';   S.add(put(P.mug({ color: '#e0562f' }), [x, 0.77, z]));
//   P.<name>(o) for every name in PROP_NAMES. Building blocks also exported: blob, puffy, tube, leafPlant, tex2.
// Interactive handles live on the group: clock.setTime(h, m), phone.setGlow(k), laptop.setOpen(k), lamp.setOn(k), door.setOpen(k).
import * as THREE from 'three';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';
import { toon, glowMat, rbox, lathe, ball, pill, disc, flat, tex, halo, ink } from '/engine/three-toon.js';

// ---------- building blocks ----------
const G = (...kids) => { const g = new THREE.Group(); kids.forEach(k => k && g.add(k)); return g; };
const pos = (m, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0) => { m.position.set(x, y, z); m.rotation.set(rx, ry, rz); return m; };
export const put = (m, p = [0, 0, 0], ry = 0, s = 1) => { m.position.set(...p); m.rotation.y = ry; m.scale.setScalar(s); return m; };
const sh = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
const M = (c) => (typeof c === 'string' ? toon(c) : c);
const mesh = (geo, c, line = 0) => { const m = sh(new THREE.Mesh(geo, M(c))); return line ? ink(m, line) : m; };
const dk = (c, k = 0.25) => '#' + new THREE.Color(c).multiplyScalar(1 - k).getHexString();
const lt = (c, k = 0.25) => '#' + new THREE.Color(c).lerp(new THREE.Color('#ffffff'), k).getHexString();
const _tx = new Map();
export const tex2 = (key, w, h, draw, rep) => { if (!_tx.has(key)) _tx.set(key, tex(w, h, draw, rep)); return _tx.get(key); };
const TM = (key, w, h, draw, o = {}) => toon('#ffffff', { map: tex2(key, w, h, draw), ...o });
const GM = (key, w, h, draw, k = 1) => new THREE.MeshBasicMaterial({ map: tex2(key, w, h, draw), color: new THREE.Color(k, k, k), toneMapped: false });
const nz = (x, y, z, s) => Math.sin(x * 1.7 + s * 1.3 + Math.sin(y * 2.3 + s)) * 0.5 + Math.sin(y * 1.9 + z * 1.1 + s * 2.1) * 0.3 + Math.sin(z * 2.7 + x * 0.7 + s * 0.7) * 0.2;
const smooth = (g) => { g.deleteAttribute('normal'); g.deleteAttribute('uv'); return mergeVertices(g); };
// lumpy organic sphere (foliage, bushes, crumpled cloth, rocks): r, colour, {seed, amp, freq, sq:[sx,sy,sz]}
export function blob(r, c, o = {}) {
  const { seed = 1, amp = 0.16, freq = 2.4, detail = 3, sq = [1, 1, 1], line = 0.01 } = o;
  const g = smooth(new THREE.IcosahedronGeometry(r, detail)), p = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); const n = v.clone().normalize(); v.multiplyScalar(1 + amp * nz(n.x * freq, n.y * freq, n.z * freq, seed)); p.setXYZ(i, v.x * sq[0], v.y * sq[1], v.z * sq[2]); }
  g.computeVertexNormals(); return mesh(g, c, line);
}
// soft stuffed box (pillows, cushions, duvets, seat pads): thin at the edges, full in the middle. Base at y = 0.
export function puffy(w, h, d, c, o = {}) {
  const { k = 0.55, line = 0.008 } = o; const g = smooth(new THREE.BoxGeometry(w, h, d, 12, 4, 12)), p = g.attributes.position;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i) / (w / 2), y = p.getY(i) / (h / 2), z = p.getZ(i) / (d / 2), e = Math.max(x * x, z * z);
    p.setXYZ(i, x * (1 - 0.05 * z * z) * w / 2, (y * (1 - k * e * e) + 1) * h / 2, z * (1 - 0.05 * x * x) * d / 2); }
  g.computeVertexNormals(); return mesh(g, c, line);
}
// smooth tube through points (handles, frames, cables, iron legs). Geometry is centred so the ink hull sits right.
export function tube(pts, r, c, o = {}) {
  const { closed = false, line = 0, seg = 0 } = o; const cv = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p)), closed, 'centripetal');
  const g = new THREE.TubeGeometry(cv, seg || Math.max(16, pts.length * 12), r, 10, closed); g.computeBoundingBox(); const ctr = new THREE.Vector3(); g.boundingBox.getCenter(ctr); g.translate(-ctr.x, -ctr.y, -ctr.z);
  const m = mesh(g, c, line); m.position.copy(ctr); return m;
}
const arc = (r, t, c, a = Math.PI) => mesh(new THREE.TorusGeometry(r, t, 10, 28, a), c);
const cyl = (rt, rb, h, c, line = 0, seg = 24) => { const g = new THREE.CylinderGeometry(rt, rb, h, seg); g.translate(0, h / 2, 0); return mesh(g, c, line); };
const cone = (r, h, c, seg = 24) => { const g = new THREE.ConeGeometry(r, h, seg); g.translate(0, h / 2, 0); return mesh(g, c); };
const leg = (h, r = 0.022, c = '#5a3828', taper = 0.7) => cyl(r * taper, r, h, c, 0.004, 12);
const glowPlane = (w, h, mat) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); return m; };

// ---------- textures (cached) ----------
const clockFace = () => tex2('clock', 256, 256, (g, w, h) => { g.fillStyle = '#fbf6ea'; g.fillRect(0, 0, w, h); g.fillStyle = '#1b1424'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.font = 'bold 30px sans-serif';
  for (let i = 1; i <= 12; i++) { const a = i * Math.PI / 6 - Math.PI / 2; g.fillText(String(i), w / 2 + Math.cos(a) * 92, h / 2 + Math.sin(a) * 92); }
  g.strokeStyle = 'rgba(27,20,36,.5)'; g.lineWidth = 2; for (let i = 0; i < 60; i++) if (i % 5) { const a = i * Math.PI / 30; g.beginPath(); g.moveTo(w / 2 + Math.cos(a) * 116, h / 2 + Math.sin(a) * 116); g.lineTo(w / 2 + Math.cos(a) * 122, h / 2 + Math.sin(a) * 122); g.stroke(); } });
const phoneUI = (key = 'phoneUI', top = '#6a5acd', bot = '#ff9a8a') => tex2(key, 128, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.95)'; g.font = 'bold 30px sans-serif'; g.textAlign = 'center'; g.fillText('9:41', w / 2, 62); g.font = '11px sans-serif'; g.fillText('Monday', w / 2, 80);
  const cols = ['#ffd08a', '#8dffc8', '#8fd0ff', '#ff9ab0', '#c8a0ff', '#ffffff']; for (let i = 0; i < 8; i++) { g.fillStyle = cols[i % 6]; const x = 14 + (i % 4) * 27, y = 170 + Math.floor(i / 4) * 30; g.beginPath(); g.roundRect(x, y, 20, 20, 6); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.roundRect(10, 232, w - 20, 16, 8); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.roundRect(w / 2 - 16, 6, 32, 9, 5); g.fill(); });
const laptopUI = () => tex2('laptopUI', 256, 160, (g, w, h) => { g.fillStyle = '#e8eef8'; g.fillRect(0, 0, w, h); g.fillStyle = '#4a78b8'; g.fillRect(0, 0, w, 14); g.fillStyle = '#ffffff'; g.fillRect(14, 26, 150, 120); g.fillStyle = '#c8d4e8';
  for (let i = 0; i < 8; i++) g.fillRect(24, 38 + i * 13, 60 + ((i * 37) % 70), 6); g.fillStyle = '#8dc8a0'; g.fillRect(176, 26, 66, 56); g.fillStyle = '#ffd08a'; g.fillRect(176, 90, 66, 56); });
const keys = () => tex2('keys', 256, 160, (g, w, h) => { g.fillStyle = '#c4c9d2'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a2a33'; for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) { g.beginPath(); g.roundRect(8 + c * 17.4, 8 + r * 15, 14, 12, 2); g.fill(); }
  g.fillStyle = '#b2b8c2'; g.beginPath(); g.roundRect(w / 2 - 40, 88, 80, 60, 5); g.fill(); });
const skyTex = (kind) => tex2('sky_' + kind, 256, 256, (g, w, h) => { const C = { day: ['#7ab8f0', '#cfe8fa', '#f4f0e0'], sunset: ['#5a4a8a', '#c86a7a', '#f4a860', '#ffd890'], night: ['#0e1230', '#1e2a5a', '#3a3a7a'], dawn: ['#7a6aa8', '#e89a8a', '#ffc070', '#ffe2a0'] }[kind] || ['#7ab8f0', '#f4f0e0'];
  const gr = g.createLinearGradient(0, 0, 0, h); C.forEach((c, i) => gr.addColorStop(i / (C.length - 1), c)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = kind === 'day' ? 'rgba(120,140,170,.55)' : 'rgba(40,30,60,.85)'; for (let i = 0; i < 12; i++) { const bh = 40 + ((i * 53) % 90); g.fillRect(i * 22, h - bh, 20, bh); }
  if (kind !== 'day') { g.fillStyle = 'rgba(255,220,140,.9)'; for (let i = 0; i < 22; i++) g.fillRect((i * 37) % w, h - 16 - ((i * 29) % 70), 3, 4); }
  if (kind === 'night') { g.fillStyle = '#fff'; for (let i = 0; i < 30; i++) g.fillRect((i * 71) % w, (i * 43) % (h * 0.5), 2, 2); g.beginPath(); g.arc(w * 0.75, h * 0.2, 14, 0, 7); g.fill(); } });
const mirrorTex = (night) => tex2('mirror' + (night ? 'N' : ''), 128, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, w, h); (night ? ['#2a3458', '#4a5a88', '#2a3458'] : ['#9fb8c8', '#d4e6ee', '#86a2b6']).forEach((c, i) => gr.addColorStop(i / 2, c)); g.fillStyle = gr; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,.55)'; g.save(); g.translate(w / 2, h / 2); g.rotate(-0.5); g.fillRect(-90, -40, 220, 14); g.fillRect(-90, -10, 220, 5); g.fillRect(-90, 60, 220, 9); g.restore(); });
const artTex = (seed) => tex2('art' + seed, 192, 256, (g, w, h) => { const P = [['#f4c37a', '#e07a5a', '#3a6a8a', '#f4ecdc'], ['#8ab0c8', '#2f5286', '#f4d0a0', '#e8eef0'], ['#c96f8a', '#ffd08a', '#4f9a55', '#fff4e4']][seed % 3];
  g.fillStyle = P[3]; g.fillRect(0, 0, w, h); g.fillStyle = P[0]; g.beginPath(); g.arc(w * 0.65, h * 0.35, 40, 0, 7); g.fill(); g.fillStyle = P[1]; g.beginPath(); g.moveTo(0, h); g.lineTo(w * 0.35, h * 0.45); g.lineTo(w * 0.7, h); g.fill();
  g.fillStyle = P[2]; g.beginPath(); g.moveTo(w * 0.3, h); g.lineTo(w * 0.7, h * 0.55); g.lineTo(w, h * 0.8); g.lineTo(w, h); g.fill(); });
const rugTex = (c1, c2) => tex2('rug' + c1 + c2, 256, 256, (g, w, h) => { g.fillStyle = c1; g.fillRect(0, 0, w, h); g.strokeStyle = c2; g.lineWidth = 10; g.strokeRect(16, 16, w - 32, h - 32); g.lineWidth = 3; g.strokeRect(34, 34, w - 68, h - 68);
  g.fillStyle = c2; for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { g.save(); g.translate(60 + i * 34, 60 + j * 34); g.rotate(Math.PI / 4); g.fillRect(-6, -6, 12, 12); g.restore(); } });
const labelTex = (c) => tex2('label' + c, 128, 64, (g, w, h) => { g.fillStyle = c; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(0, 22, w, 20); g.fillStyle = c; g.fillRect(20, 28, 50, 8); });

// ================= SMALL OBJECTS =================
const P = {};
// mug with a real handle, inner wall and drink. o: {color, drink:'#5a3424'|null}
P.mug = (o = {}) => { const c = o.color || '#e0562f', g = G();
  g.add(lathe([[0, 0], [0.04, 0], [0.044, 0.004], [0.045, 0.095], [0.041, 0.097], [0.039, 0.012], [0, 0.012]], toon(c, { side: THREE.DoubleSide }), 0, 0, 0, 0.004));
  if (o.drink !== null) g.add(pos(disc(0.039, 0.004, o.drink || '#5a3424', 0), 0, 0.078, 0));
  g.add(pos(arc(0.025, 0.0075, c), 0.045, 0.05, 0, 0, 0, -Math.PI / 2)); return g; };
// drinking glass, o.fill 0..1 water
P.glass = (o = {}) => { const g = G(), f = o.fill ?? 0.7;
  g.add(lathe([[0, 0], [0.032, 0], [0.038, 0.12], [0.036, 0.12], [0.03, 0.006], [0, 0.006]], new THREE.MeshBasicMaterial({ color: '#e8f6ff', transparent: true, opacity: 0.35, depthWrite: false }), 0, 0, 0, 0));
  if (f > 0) g.add(lathe([[0, 0], [0.03, 0], [0.03 + 0.006 * f, 0.112 * f], [0, 0.112 * f]], new THREE.MeshBasicMaterial({ color: '#9fd8ff', transparent: true, opacity: 0.55, depthWrite: false }), 0, 0.006, 0, 0)); return g; };
// water bottle with cap and label
P.bottle = (o = {}) => { const c = o.color || '#9fd8f0', g = G();
  g.add(lathe([[0, 0], [0.034, 0], [0.037, 0.006], [0.037, 0.17], [0.022, 0.21], [0.016, 0.22], [0, 0.22]], toon(c, { transparent: true, opacity: 0.8 }), 0, 0, 0, 0.004));
  g.add(pos(disc(0.017, 0.03, o.cap || '#2f6aa8', 0.003), 0, 0.22, 0)); const lab = new THREE.Mesh(new THREE.CylinderGeometry(0.0385, 0.0385, 0.06, 32, 1, true), toon('#ffffff', { map: labelTex(o.label || '#4a78b8') })); lab.position.y = 0.09; g.add(lab); return g; };
// phone lying on its back (screen up). o: {color, on: 0..1}. g.setGlow(k)
P.phone = (o = {}) => { const g = G(), body = o.color || '#1e1c26';
  g.add(rbox(0.074, 0.009, 0.152, body, 0, 0, 0, 0.008, 0.003));
  const scr = glowPlane(0.066, 0.142, new THREE.MeshBasicMaterial({ map: phoneUI(), toneMapped: false })); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.0095; g.add(scr);
  const off = glowPlane(0.066, 0.142, new THREE.MeshBasicMaterial({ color: '#101018', transparent: true })); off.rotation.x = -Math.PI / 2; off.position.y = 0.0097; g.add(off);
  g.setGlow = (k) => { scr.material.color.setScalar(0.4 + 0.9 * k); off.material.opacity = 1 - Math.min(1, k * 1.5); }; g.setGlow(o.on ?? 1); return g; };
// laptop: base with keys, lid on a hinge at the back. o: {open:0..1, color, on}
P.laptop = (o = {}) => { const c = o.color || '#b8bec8', g = G();
  g.add(rbox(0.34, 0.016, 0.24, c, 0, 0, 0, 0.012, 0.004)); const kb = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.19), toon('#ffffff', { map: keys() })); kb.rotation.x = -Math.PI / 2; kb.position.set(0, 0.0165, 0.005); g.add(kb);
  const hinge = G(); hinge.position.set(0, 0.016, -0.12); g.add(hinge); hinge.add(pos(rbox(0.34, 0.23, 0.01, c, 0, 0, 0, 0.012, 0.004), 0, 0, 0.005));
  const scr = glowPlane(0.31, 0.2, new THREE.MeshBasicMaterial({ map: laptopUI(), toneMapped: false })); scr.position.set(0, 0.117, 0.0105); hinge.add(scr);
  g.setOpen = (k) => { hinge.rotation.x = -(1 - k) * Math.PI * 0.5 + 0.0 - k * 0.22; }; g.setOpen(o.open ?? 1); return g; };
// hardcover book lying flat (o.stand: upright on its base, spine to +z). o: {color, w, h(thick), d}
P.book = (o = {}) => { const c = o.color || '#4a78b8', w = o.w || 0.16, t = o.t || 0.03, d = o.d || 0.23, g = G();
  g.add(rbox(w, t, d, c, 0, 0, 0, 0.004, 0.003)); g.add(rbox(w - 0.012, t - 0.008, d - 0.01, '#f6efdc', 0.008, 0.004, 0, 0.002, 0));
  g.add(rbox(0.006, t + 0.001, d * 0.7, lt(c, 0.5), -w / 2 + 0.01, 0, 0, 0.002, 0));
  if (o.stand) { const s = G(g); g.rotation.z = Math.PI / 2; g.position.set(t / 2, w / 2, 0); return s; } return g; };
P.bookStack = (o = {}) => { const g = G(), cols = o.colors || ['#c0563a', '#2f8a57', '#e0b05a', '#4a78b8']; let y = 0;
  cols.forEach((c, i) => { const t = 0.025 + (i % 2) * 0.012, b = P.book({ color: c, t, w: 0.15 + (i % 3) * 0.02, d: 0.22 + (i % 2) * 0.02 }); b.position.y = y; b.rotation.y = (i % 2 ? 0.12 : -0.08) * (i + 1) * 0.5; g.add(b); y += t; }); return g; };
// a row of upright books for shelves, spines to +z. o: {len, h}
P.bookRow = (o = {}) => { const g = G(), len = o.len || 0.6, H = o.h || 0.26, cols = ['#c0563a', '#4a78b8', '#e0b05a', '#2f8a57', '#a8508a', '#3fa7a0', '#e8e0d0', '#5a4a6a']; let x = -len / 2, i = 0;
  while (x < len / 2 - 0.03) { const t = 0.022 + ((i * 7) % 4) * 0.008, h = H * (0.78 + ((i * 5) % 4) * 0.07), c = cols[(i * 3) % cols.length];
    g.add(rbox(t, h, 0.17, c, x + t / 2, 0, 0, 0.004, 0.003)); g.add(rbox(t + 0.001, 0.012, 0.171, lt(c, 0.55), x + t / 2, h * 0.78, 0.0, 0.002, 0)); g.add(rbox(t + 0.001, 0.008, 0.171, lt(c, 0.55), x + t / 2, h * 0.18, 0, 0.002, 0)); x += t + 0.003; i++; }
  return g; };
// table lamp. o: {shade, base, on}. g.setOn(k)
P.tableLamp = (o = {}) => { const g = G(), sc = o.shade || '#ffe2a8', bc = o.base || '#3a3040';
  g.add(lathe([[0, 0], [0.085, 0], [0.09, 0.012], [0.07, 0.028], [0, 0.028]], bc, 0, 0, 0, 0.004)); const bodyB = ball(0.068, o.body || '#d8c8a8', 0, 0.09, 0, 0.004); bodyB.scale.y = 1.05; g.add(bodyB);
  g.add(pos(cyl(0.008, 0.008, 0.16, '#c8b070', 0, 10), 0, 0.14, 0));
  const shd = lathe([[0.17, 0], [0.165, 0.01], [0.11, 0.21], [0.108, 0.21]], toon(sc, { side: THREE.DoubleSide, emissive: new THREE.Color(sc), emissiveIntensity: 0 }), 0, 0.22, 0, 0.005); shd.castShadow = false; g.add(shd);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), glowMat('#fff0c0', 1.4)); bulb.position.y = 0.3; g.add(bulb); const hl = halo(0.9, '#ffd08a', 0.3); hl.position.y = 0.33; g.add(hl);
  const L = o.light ? new THREE.PointLight('#ffd49a', 1.5, 4, 2) : null; if (L) { L.position.y = 0.33; g.add(L); }
  g.setOn = (k) => { bulb.visible = k > 0.05; hl.material.opacity = 0.3 * k; shd.material.emissiveIntensity = 0.55 * k; if (L) L.intensity = 1.5 * k; }; g.setOn(o.on ?? 1); return g; };
// potted plants. o.kind: 'leafy' (default) | 'tall' (snake plant) | 'monstera' | 'succulent' | 'round' (bush). o.size scales all.
export function leafPlant(o = {}) {
  const s = o.size || 1, kind = o.kind || 'leafy', potC = o.pot || '#c4643a', g = G(), lc = ['#4f9a55', '#5fae5f', '#3f8a4a'];
  g.add(lathe([[0, 0], [0.085, 0], [0.11, 0.18], [0.122, 0.18], [0.122, 0.21], [0.104, 0.21], [0.1, 0.195], [0, 0.195]].map(([r, y]) => [r * s, y * s]), potC, 0, 0, 0, 0.005));
  g.add(pos(disc(0.1 * s, 0.004, '#4a3020', 0), 0, 0.19 * s, 0));
  const leaf = (len, wid, c) => { const shp = new THREE.Shape(); shp.moveTo(0, 0); shp.bezierCurveTo(wid, len * 0.25, wid * 0.9, len * 0.7, 0, len); shp.bezierCurveTo(-wid * 0.9, len * 0.7, -wid, len * 0.25, 0, 0);
    const gg = new THREE.ExtrudeGeometry(shp, { depth: 0.003, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 1, curveSegments: 12 }); gg.translate(0, 0, -0.0015); return mesh(gg, c, 0.003); };
  const add = (n, len, wid, tilt0, tilt1, y0) => { for (let i = 0; i < n; i++) { const a = i * 2.39996, piv = G(); piv.position.y = y0 * s; piv.rotation.y = a; const l = leaf(len * s * (0.8 + (i % 3) * 0.12), wid * s, lc[i % 3]); l.rotation.x = tilt0 + (tilt1 - tilt0) * ((i % 5) / 4); piv.add(l); g.add(piv); } };
  if (kind === 'tall') add(9, 0.62, 0.05, 0.05, 0.3, 0.19);
  else if (kind === 'monstera') { for (let i = 0; i < 7; i++) { const a = i * 2.39996, piv = G(); piv.position.y = 0.19 * s; piv.rotation.y = a; const stem = tube([[0, 0, 0], [0, 0.25 * s, 0.06 * s], [0, 0.42 * s, 0.18 * s]], 0.006 * s, '#3f8a4a'); piv.add(stem); const l = leaf(0.26 * s, 0.17 * s, lc[i % 3]); l.position.set(0, 0.42 * s, 0.18 * s); l.rotation.x = 0.9 + (i % 3) * 0.15; piv.add(l); g.add(piv); } }
  else if (kind === 'succulent') add(14, 0.1, 0.035, 0.6, 1.25, 0.19);
  else if (kind === 'round') { [[0, 0.33, 0, 0.13], [-0.08, 0.28, 0.05, 0.1], [0.08, 0.29, -0.03, 0.1]].forEach(([x, y, z, r], i) => g.add(pos(blob(r * s, lc[i], { seed: i + 3 }), x * s, y * s, z * s))); }
  else add(16, 0.26, 0.07, 0.35, 1.05, 0.19);
  return g;
}
P.plant = leafPlant;
// wall clock (front +z, hangs at its centre). g.setTime(h, m)
P.wallClock = (o = {}) => { const r = o.r || 0.22, g = G();
  const rim = disc(r, 0.045, o.rim || '#2a2030', 0.004); rim.rotation.x = Math.PI / 2; g.add(rim);
  const face = new THREE.Mesh(new THREE.CircleGeometry(r * 0.9, 48), toon('#ffffff', { map: clockFace() })); face.position.z = 0.047; g.add(face);
  const hand = (len, w) => { const gp = G(); const m = new THREE.Mesh(new THREE.BoxGeometry(w, len, 0.004), new THREE.MeshBasicMaterial({ color: '#1b1424' })); m.position.y = len / 2 - 0.01; gp.add(m); gp.position.z = 0.05; g.add(gp); return gp; };
  const hh = hand(r * 0.5, 0.014), mh = hand(r * 0.75, 0.009), sec = hand(r * 0.8, 0.003); sec.children[0].material = new THREE.MeshBasicMaterial({ color: '#e0302a' }); g.add(pos(ball(0.012, '#1b1424', 0), 0, 0, 0.055));
  g.setTime = (h, m, s = 0) => { hh.rotation.z = -((h % 12) + m / 60) / 12 * Math.PI * 2; mh.rotation.z = -(m / 60) * Math.PI * 2; sec.rotation.z = -(s / 60) * Math.PI * 2; }; g.setTime(o.h ?? 10, o.m ?? 10, 0); return g; };
// bedside alarm clock with glowing digits
P.alarmClock = (o = {}) => { const g = G(); g.add(rbox(0.16, 0.08, 0.07, o.color || '#2a2a33', 0, 0, 0, 0.02, 0.004));
  const d = glowPlane(0.12, 0.045, GM('alarm', 128, 48, (gg, w, h) => { gg.fillStyle = '#081014'; gg.fillRect(0, 0, w, h); gg.fillStyle = '#ff5a4a'; gg.font = 'bold 36px monospace'; gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillText(o.text || '6:00', w / 2, h / 2 + 2); }, 1.3)); d.position.set(0, 0.04, 0.0355); g.add(d); return g; };
// picture frame (front +z, base at its bottom). o: {w, h, art: 0..2, frame}
P.frame = (o = {}) => { const w = o.w || 0.45, h = o.h || 0.6, g = G(); g.add(rbox(w, h, 0.03, o.frame || '#2a2030', 0, 0, 0, 0.012, 0.004));
  g.add(pos(rbox(w - 0.06, h - 0.06, 0.005, '#f8f4ea', 0, 0.03, 0.014, 0.004, 0))); const a = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.12, h - 0.12), toon('#ffffff', { map: artTex(o.art ?? 0) })); a.position.set(0, h / 2, 0.021); g.add(a); return g; };
// a pair of sneakers, toes to +z. o: {color (upper), sole, accent}
P.sneaker = (o = {}) => { const up = o.color || '#f4f4f4', so = o.sole || '#ffffff', ac = o.accent || '#e0562f', g = G();
  const prof = (pts, w, c, bev = 0.008) => { const shp = new THREE.Shape(); pts.forEach(([z, y], i) => (i ? shp.lineTo(z, y) : shp.moveTo(z, y))); shp.closePath();
    const gg = new THREE.ExtrudeGeometry(shp, { depth: w, bevelEnabled: true, bevelThickness: bev, bevelSize: bev, bevelSegments: 3, curveSegments: 8 }); gg.translate(0, 0, -w / 2); const m = mesh(gg, c, 0.003); m.rotation.y = -Math.PI / 2; return m; };
  const upper = new THREE.Shape(); upper.moveTo(-0.128, 0.02); upper.lineTo(0.1, 0.02); upper.quadraticCurveTo(0.145, 0.022, 0.142, 0.045); upper.quadraticCurveTo(0.12, 0.07, 0.05, 0.08);
  upper.quadraticCurveTo(-0.02, 0.095, -0.06, 0.1); upper.lineTo(-0.11, 0.108); upper.quadraticCurveTo(-0.136, 0.1, -0.13, 0.05); upper.closePath();
  const ug = new THREE.ExtrudeGeometry(upper, { depth: 0.068, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.012, bevelSegments: 4, curveSegments: 10 }); ug.translate(0, 0, -0.034); const um = mesh(ug, up, 0.003); um.rotation.y = -Math.PI / 2; g.add(um);
  g.add(prof([[-0.14, 0], [0.14, 0], [0.152, 0.012], [0.148, 0.024], [-0.142, 0.024], [-0.146, 0.01]], 0.084, so, 0.006));
  g.add(prof([[-0.141, 0.018], [0.15, 0.018], [0.149, 0.022], [-0.142, 0.022]], 0.088, ac, 0.002));
  const col = new THREE.Mesh(new THREE.CircleGeometry(0.04, 24), toon('#2a2230')); col.rotation.x = -Math.PI / 2 + 0.12; col.scale.set(0.6, 1.0, 1); col.position.set(0, 0.124, -0.082); g.add(col);
  g.add(pos(rbox(0.066, 0.05, 0.03, ac, 0, 0.03, -0.128, 0.012, 0.003)));
  for (let i = 0; i < 4; i++) g.add(pos(rbox(0.05, 0.005, 0.008, '#ffffff', 0, 0, 0, 0.002, 0.002), 0, 0.103 - i * 0.008, -0.03 + i * 0.022, -0.3));
  for (const s2 of [-1, 1]) g.add(pos(rbox(0.004, 0.026, 0.11, ac, 0, 0, 0, 0.002, 0), s2 * 0.048, 0.04, -0.01, 0, 0, 0)); return g; };
P.sneakers = (o = {}) => G(pos(P.sneaker(o), -0.065, 0, 0, 0, 0.06), pos(P.sneaker(o), 0.065, 0, 0.03, 0, -0.04));
// neatly folded clothes stack / messy pile
P.foldedClothes = (o = {}) => { const g = G(), cols = o.colors || ['#4a78b8', '#e8e0d0', '#2f8a57']; cols.forEach((c, i) => { const p = puffy(0.32, 0.055, 0.26, c, { k: 0.35 }); p.position.set((i % 2) * 0.012, i * 0.05, 0); p.rotation.y = (i - 1) * 0.04; g.add(p); g.add(pos(rbox(0.3, 0.004, 0.004, dk(c, 0.3), (i % 2) * 0.012, i * 0.05 + 0.03, 0.131, 0.002, 0))); }); return g; };
P.clothesPile = (o = {}) => { const g = G(), cols = o.colors || ['#4a78b8', '#e0b05a', '#2f8a57', '#c0563a'];
  cols.forEach((c, i) => { const p = puffy(0.34, 0.05, 0.28, c, { k: 0.5 }); p.position.set([0, 0.1, -0.08, 0.05][i % 4], i * 0.035, [0, 0.05, 0.07, -0.06][i % 4]); p.rotation.set([0.06, -0.08, 0.1, -0.05][i % 4], i * 0.9, [0.05, 0.08, -0.06, 0.1][i % 4]); g.add(p); });
  const c0 = cols[0]; g.add(tube([[0.1, 0.03, 0.08], [0.22, 0.02, 0.16], [0.32, 0.012, 0.18]], 0.03, c0, { line: 0.004 })); g.add(tube([[-0.12, 0.06, -0.02], [-0.24, 0.03, 0.06], [-0.3, 0.012, 0.16]], 0.028, cols[2 % cols.length], { line: 0.004 }));
  return g; };
// soft pillow / cushion
P.pillow = (o = {}) => puffy(o.w || 0.6, o.h || 0.16, o.d || 0.4, o.color || '#ffffff', { k: 0.6 });
// kettle with an arched handle and a spout
P.kettle = (o = {}) => { const c = o.color || '#d0563a', g = G();
  g.add(lathe([[0, 0], [0.12, 0], [0.135, 0.02], [0.13, 0.12], [0.1, 0.18], [0.05, 0.2], [0, 0.2]], c, 0, 0, 0, 0.005)); g.add(pos(ball(0.022, '#1b1424', 0), 0, 0.21, 0));
  g.add(tube([[-0.07, 0.17, 0], [-0.03, 0.3, 0], [0.05, 0.3, 0], [0.08, 0.16, 0]], 0.012, '#1b1424'));
  g.add(tube([[0.11, 0.06, 0], [0.17, 0.12, 0], [0.2, 0.18, 0]], 0.016, c)); return g; };
// backpack (front pocket to +z)
P.backpack = (o = {}) => { const c = o.color || '#3a5a8a', g = G(); const b = puffy(0.32, 0.42, 0.18, c, { k: 0.25 }); g.add(b); g.add(pos(puffy(0.24, 0.16, 0.06, dk(c, 0.15), { k: 0.4 }), 0, 0.06, 0.09));
  g.add(pos(rbox(0.22, 0.01, 0.005, '#e0b05a', 0, 0.2, 0.123, 0.002, 0))); g.add(tube([[-0.06, 0.42, -0.02], [0, 0.47, -0.02], [0.06, 0.42, -0.02]], 0.012, dk(c, 0.3))); return g; };

// ================= FURNITURE =================
// bed: long side to +z, headboard at -x. o: {len, w, frame, duvet, sheet, made:0..1}
P.bed = (o = {}) => { const L = o.len || 2.1, W = o.w || 1.5, fr = o.frame || '#7a4e34', du = o.duvet || '#e08a5a', g = G();
  g.add(rbox(L, 0.26, W, fr, 0, 0.1, 0, 0.05, 0.01)); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(pos(leg(0.1, 0.035, dk(fr, 0.2), 1), x * (L / 2 - 0.08), 0, z * (W / 2 - 0.08)));
  g.add(rbox(0.1, 1.0, W + 0.06, fr, -L / 2 - 0.02, 0, 0, 0.05, 0.01)); g.add(pos(puffy(0.06, 0.5, W - 0.12, lt(fr, 0.35), { k: 0.3 }), -L / 2 + 0.055, 0.4, 0, 0, 0, 0));
  g.add(rbox(L - 0.06, 0.22, W - 0.04, o.sheet || '#f4efe6', 0.01, 0.34, 0, 0.08, 0.006));
  const made = o.made ?? 1, dz = G(); dz.position.set(0.2, 0.55, 0); g.add(dz);
  dz.add(rbox(L * 0.7, 0.07, W + 0.06, du, 0, 0, 0, 0.035, 0.006)); dz.add(pos(puffy(L * 0.68, 0.09, W - 0.04, du, { k: 0.3 }), 0, 0.05, 0)); dz.add(rbox(0.16, 0.12, W + 0.07, o.sheet || '#f4efe6', -L * 0.35 + 0.08, 0.0, 0, 0.05, 0.006));
  for (const z of [-1, 1]) g.add(pos(P.pillow({ w: 0.42, h: 0.14, d: W / 2 - 0.12, color: '#ffffff' }), -L / 2 + 0.3, 0.56, z * (W / 4)));
  dz.rotation.y = (1 - made) * 0.22; dz.position.x = 0.2 + (1 - made) * 0.15; return g; };
P.nightstand = (o = {}) => { const c = o.color || '#8a5a3e', g = G(); g.add(rbox(0.48, 0.5, 0.4, c, 0, 0.06, 0, 0.03, 0.008));
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(pos(leg(0.07, 0.016, dk(c, 0.3)), x * 0.2, 0, z * 0.16));
  for (const y of [0.1, 0.32]) { g.add(rbox(0.42, 0.18, 0.02, lt(c, 0.12), 0, y, 0.2, 0.02, 0.004)); g.add(pos(ball(0.014, '#d8c08a', 0), 0, y + 0.09, 0.215)); } return g; };
P.desk = (o = {}) => { const c = o.color || '#9a6a48', W = o.w || 1.4, D = o.d || 0.65, g = G(); g.add(rbox(W, 0.045, D, c, 0, 0.71, 0, 0.015, 0.006));
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1]]) g.add(pos(leg(0.71, 0.025, dk(c, 0.25)), x * (W / 2 - 0.06), 0, z * (D / 2 - 0.06)));
  g.add(rbox(0.42, 0.66, D - 0.06, c, W / 2 - 0.25, 0.05, 0, 0.02, 0.006)); for (const y of [0.1, 0.32, 0.5]) { g.add(rbox(0.38, 0.18, 0.015, lt(c, 0.12), W / 2 - 0.25, y, D / 2 - 0.025, 0.015, 0.003)); g.add(pos(pill(0.008, 0.05, '#d8c08a', 0), W / 2 - 0.25, y + 0.15, D / 2 - 0.01, 0, 0, Math.PI / 2)); }
  return g; };
// chair: seat faces +z, back at -z. o: {color, cushion}
P.chair = (o = {}) => { const c = o.color || '#a8784e', g = G(); g.add(rbox(0.44, 0.04, 0.42, c, 0, 0.43, 0, 0.015, 0.005)); if (o.cushion !== false) g.add(pos(puffy(0.4, 0.05, 0.38, o.cushion || '#c96f6a', { k: 0.4 }), 0, 0.47, 0.01));
  for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(pos(leg(0.43, 0.02, dk(c, 0.15)), x * 0.18, 0, z * 0.17));
  for (const x of [-0.18, 0.18]) g.add(pos(rbox(0.035, 0.48, 0.03, c, 0, 0, 0, 0.012, 0.004), x, 0.45, -0.19, -0.08)); g.add(pos(rbox(0.44, 0.14, 0.03, c, 0, 0, 0, 0.015, 0.005), 0, 0.76, -0.215, -0.08)); return g; };
// office chair on a 5-star base
P.officeChair = (o = {}) => { const c = o.color || '#2a2a33', g = G();
  for (let i = 0; i < 5; i++) { const a = i * Math.PI * 2 / 5, arm = rbox(0.03, 0.025, 0.28, '#3a3a44', 0, 0, 0, 0.01, 0.004); arm.position.set(Math.sin(a) * 0.13, 0.07, Math.cos(a) * 0.13); arm.rotation.y = a; g.add(arm); g.add(pos(ball(0.025, '#1b1424', 0), Math.sin(a) * 0.27, 0.025, Math.cos(a) * 0.27)); }
  g.add(pos(cyl(0.025, 0.03, 0.36, '#8a8a96', 0.004), 0, 0.08, 0)); g.add(pos(puffy(0.48, 0.08, 0.46, c, { k: 0.4 }), 0, 0.44, 0));
  g.add(pos(puffy(0.44, 0.06, 0.52, c, { k: 0.4 }), 0, 0.82, -0.23, Math.PI / 2 - 0.12)); g.add(pos(rbox(0.05, 0.3, 0.03, '#3a3a44', 0, 0.48, -0.22, 0.01, 0.004)));
  for (const x of [-0.25, 0.25]) { g.add(pos(rbox(0.04, 0.18, 0.03, '#3a3a44', x, 0.47, 0, 0.01, 0.004))); g.add(pos(rbox(0.06, 0.03, 0.26, '#3a3a44', x, 0.65, 0, 0.012, 0.004))); } return g; };
// table: o.shape 'round' | 'rect' | 'coffee'
P.table = (o = {}) => { const c = o.color || '#a8724a', g = G(), sh2 = o.shape || 'rect';
  if (sh2 === 'round') { const r = o.r || 0.6; g.add(disc(r, 0.05, c, 0, 0.7, 0, 0.008)); g.add(pos(lathe([[0, 0], [0.3, 0], [0.28, 0.04], [0.06, 0.08], [0.05, 0.7], [0, 0.7]], dk(c, 0.25), 0, 0, 0, 0.006))); return g; }
  const W = o.w || (sh2 === 'coffee' ? 1.0 : 1.4), D = o.d || (sh2 === 'coffee' ? 0.55 : 0.8), H = sh2 === 'coffee' ? 0.4 : 0.72;
  g.add(rbox(W, 0.05, D, c, 0, H - 0.05, 0, 0.02, 0.006)); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(pos(leg(H - 0.05, 0.028, dk(c, 0.2)), x * (W / 2 - 0.07), 0, z * (D / 2 - 0.07)));
  if (sh2 === 'coffee') g.add(rbox(W - 0.14, 0.03, D - 0.14, dk(c, 0.1), 0, 0.12, 0, 0.01, 0.004)); return g; };
// sofa: seat faces +z. o: {w, color, pillows:[colors]}
P.sofa = (o = {}) => { const c = o.color || '#4a6a8a', W = o.w || 2.0, g = G(), n = W > 1.6 ? 3 : 2;
  g.add(rbox(W, 0.28, 0.9, dk(c, 0.1), 0, 0.1, 0, 0.06, 0.008)); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(pos(leg(0.1, 0.025, '#3a2820'), x * (W / 2 - 0.1), 0, z * 0.36));
  for (const s of [-1, 1]) g.add(rbox(0.2, 0.62, 0.9, c, s * (W / 2 - 0.1), 0.1, 0, 0.09, 0.008)); g.add(rbox(W - 0.1, 0.72, 0.22, c, 0, 0.1, -0.34, 0.09, 0.008));
  const cw = (W - 0.4) / n; for (let i = 0; i < n; i++) { g.add(pos(puffy(cw - 0.01, 0.16, 0.66, c, { k: 0.35 }), -W / 2 + 0.2 + cw * (i + 0.5), 0.37, 0.08)); g.add(pos(puffy(cw - 0.02, 0.15, 0.42, lt(c, 0.06), { k: 0.4 }), -W / 2 + 0.2 + cw * (i + 0.5), 0.56, -0.18, Math.PI / 2 - 0.2)); }
  (o.pillows || ['#e0b05a', '#c96f8a']).forEach((pc, i) => g.add(pos(puffy(0.36, 0.12, 0.36, pc, { k: 0.6 }), (i ? 1 : -1) * (W / 2 - 0.42), 0.62, -0.05, Math.PI / 2 - 0.35, 0, (i ? -1 : 1) * 0.2)));
  return g; };
// bookshelf with books, a plant and a box. Front +z. o: {w, h, color}
P.bookshelf = (o = {}) => { const c = o.color || '#7a4e34', W = o.w || 0.9, H = o.h || 1.8, D = 0.32, g = G(), n = Math.round(H / 0.42);
  g.add(rbox(W, H, 0.02, dk(c, 0.2), 0, 0, -D / 2 + 0.01, 0.005, 0)); for (const s of [-1, 1]) g.add(rbox(0.03, H, D, c, s * (W / 2 - 0.015), 0, 0, 0.008, 0.006));
  for (let i = 0; i <= n; i++) g.add(rbox(W, 0.03, D, c, 0, i * (H - 0.03) / n, 0, 0.008, 0.006));
  for (let i = 0; i < n; i++) { const y = i * (H - 0.03) / n + 0.03, sp = (H - 0.03) / n - 0.05; const row = P.bookRow({ len: i % 2 ? W * 0.55 : W - 0.1, h: Math.min(0.28, sp) }); row.position.set(i % 2 ? -W * 0.2 : 0, y, 0.0); g.add(row);
    if (i % 2) { const pl = leafPlant({ kind: i % 4 === 1 ? 'succulent' : 'leafy', size: 0.55 }); pl.position.set(W * 0.3, y, 0); g.add(pl); } }
  return g; };
P.wardrobe = (o = {}) => { const c = o.color || '#e8dcc4', W = o.w || 1.2, H = o.h || 2.0, g = G(); g.add(rbox(W, H, 0.6, c, 0, 0.06, 0, 0.03, 0.008)); g.add(rbox(W + 0.06, 0.06, 0.64, dk(c, 0.1), 0, H + 0.06, 0, 0.02, 0.006));
  for (const s of [-1, 1]) { g.add(rbox(W / 2 - 0.03, H - 0.08, 0.02, lt(c, 0.1), s * W / 4, 0.1, 0.3, 0.02, 0.004)); g.add(pos(pill(0.012, 0.22, '#b89a6a', 0), s * 0.06, H * 0.55, 0.33)); }
  for (const x of [-1, 1]) g.add(pos(leg(0.06, 0.02, '#3a2820', 1), x * (W / 2 - 0.06), 0, 0.2)); return g; };
// flat TV on a low cabinet. o: {on, w}
P.tv = (o = {}) => { const W = o.w || 1.2, g = G(); g.add(rbox(W, W * 0.58, 0.05, '#1b1a22', 0, 0.06, 0, 0.015, 0.006)); g.add(pos(rbox(0.3, 0.012, 0.18, '#2a2a33', 0, 0, 0, 0.004, 0.003))); g.add(pos(rbox(0.05, 0.08, 0.03, '#2a2a33', 0, 0, -0.01, 0.004, 0)));
  const scr = glowPlane(W - 0.04, W * 0.58 - 0.04, o.on === false ? new THREE.MeshBasicMaterial({ color: '#10101a' }) : GM('tvUI', 256, 150, (gg, w, h) => { const gr = gg.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#3a6a9a'); gr.addColorStop(1, '#e8a87a'); gg.fillStyle = gr; gg.fillRect(0, 0, w, h); gg.fillStyle = 'rgba(255,255,255,.85)'; gg.beginPath(); gg.moveTo(w * 0.45, h * 0.35); gg.lineTo(w * 0.58, h * 0.5); gg.lineTo(w * 0.45, h * 0.65); gg.fill(); }, 1.0));
  scr.position.set(0, 0.06 + W * 0.29, 0.026); g.add(scr); return g; };
P.tvUnit = (o = {}) => { const c = o.color || '#7a5a44', W = o.w || 1.6, g = G(); g.add(rbox(W, 0.42, 0.42, c, 0, 0.08, 0, 0.03, 0.008)); for (const x of [-1, 1]) g.add(pos(leg(0.08, 0.02, '#2a2020'), x * (W / 2 - 0.08), 0, 0));
  for (let i = 0; i < 3; i++) { g.add(rbox(W / 3 - 0.04, 0.34, 0.015, lt(c, 0.1), -W / 3 + i * W / 3, 0.12, 0.21, 0.015, 0.003)); g.add(pos(pill(0.008, 0.06, '#d8c08a', 0), -W / 3 + i * W / 3, 0.44, 0.225, 0, 0, Math.PI / 2)); } return g; };
// rug: o.shape 'rect' | 'round', colours c1/c2
P.rug = (o = {}) => { const W = o.w || 2.0, D = o.d || 1.4, c1 = o.c1 || '#9a5a7a', c2 = o.c2 || '#f4d0a0'; const geo = o.shape === 'round' ? new THREE.CircleGeometry(W / 2, 48) : new THREE.PlaneGeometry(W, D);
  const m = new THREE.Mesh(geo, toon('#ffffff', { map: rugTex(c1, c2) })); m.rotation.x = -Math.PI / 2; m.position.y = 0.004; m.receiveShadow = true; if (o.shape === 'round') m.scale.y = D / W; return G(m); };
// door (front +z, hinge on the left). g.setOpen(k)
P.door = (o = {}) => { const c = o.color || '#f4ecdc', fr = o.frame || '#e8dcc4', g = G(), W = 0.9, H = 2.05;
  g.add(rbox(0.08, H + 0.06, 0.12, fr, -W / 2 - 0.04, 0, 0, 0.01, 0.006)); g.add(rbox(0.08, H + 0.06, 0.12, fr, W / 2 + 0.04, 0, 0, 0.01, 0.006)); g.add(rbox(W + 0.16, 0.08, 0.12, fr, 0, H, 0, 0.01, 0.006));
  const hinge = G(); hinge.position.set(-W / 2, 0, 0); g.add(hinge); hinge.add(rbox(W - 0.01, H - 0.01, 0.045, c, W / 2, 0, 0, 0.01, 0.006));
  for (const [y, h] of [[0.15, 0.85], [1.15, 0.75]]) for (const x of [0.25, 0.65]) hinge.add(rbox(0.3, h, 0.01, lt(c, 0.12), x, y, 0.026, 0.02, 0.003));
  hinge.add(pos(ball(0.03, '#c8a050', 0), W - 0.1, 1.0, 0.05)); hinge.add(pos(ball(0.03, '#c8a050', 0), W - 0.1, 1.0, -0.05));
  g.setOpen = (k) => { hinge.rotation.y = -k * 1.4; }; g.setOpen(o.open || 0); return g; };
// window on a wall (front +z, base at the sill bottom). o: {w, h, sky:'day'|'sunset'|'night'|'dawn', curtains, frame}
P.window = (o = {}) => { const W = o.w || 1.4, H = o.h || 1.2, fr = o.frame || '#f4ecdc', g = G();
  const glass = glowPlane(W, H, new THREE.MeshBasicMaterial({ map: skyTex(o.sky || 'day'), toneMapped: false })); glass.position.set(0, 0.08 + H / 2, -0.02); g.add(glass);
  for (const [w, h, x, y] of [[W + 0.16, 0.08, 0, 0.04], [W + 0.16, 0.08, 0, H + 0.08], [0.08, H + 0.12, -W / 2 - 0.04, 0.04], [0.08, H + 0.12, W / 2 + 0.04, 0.04], [0.05, H, 0, 0.08], [W, 0.04, 0, 0.08 + H * 0.58]]) g.add(rbox(w, h, 0.07, fr, x, y, 0, 0.015, 0.005));
  g.add(rbox(W + 0.3, 0.05, 0.2, fr, 0, 0, 0.06, 0.02, 0.005));
  if (o.curtains !== false) { const cc = o.curtains || '#c0563a'; for (const s of [-1, 1]) for (let i = 0; i < 4; i++) g.add(pos(pill(0.05, H + 0.05, i % 2 ? dk(cc, 0.1) : cc, 0.004), s * (W / 2 + 0.06 + i * 0.07), 0.08 + H / 2 + 0.12, 0.1));
    g.add(pos(rbox(W + 0.8, 0.03, 0.03, '#5a3828', 0, H + 0.42, 0.1, 0.01, 0))); }
  return g; };
// mirror: o.kind 'standing' (default) | 'wall' (round). Glass is a soft reflective gradient (not a blank slab).
P.mirror = (o = {}) => { const g = G(), fr = o.frame || '#e8dcc4';
  if (o.kind === 'wall') { const r = o.r || 0.35; const rim = disc(r, 0.04, fr, 0.006); rim.rotation.x = Math.PI / 2; g.add(rim); const gl = new THREE.Mesh(new THREE.CircleGeometry(r * 0.88, 48), new THREE.MeshBasicMaterial({ map: mirrorTex(o.night) })); gl.position.z = 0.042; g.add(gl); return g; }
  g.add(rbox(0.62, 1.66, 0.05, fr, 0, 0.12, 0, 0.04, 0.008)); const gl = glowPlane(0.52, 1.54, new THREE.MeshBasicMaterial({ map: mirrorTex(o.night), color: new THREE.Color(0.85, 0.85, 0.85) })); gl.position.set(0, 0.95, 0.027); g.add(gl);
  for (const x of [-0.22, 0.22]) g.add(pos(rbox(0.05, 0.14, 0.32, dk(fr, 0.25), x, 0, -0.06, 0.02, 0.004))); return g; };
// fridge (front +z): two doors, handles, magnets and a note
P.fridge = (o = {}) => { const c = o.color || '#eef0ea', g = G(), H = o.h || 1.85; g.add(rbox(0.75, H, 0.7, c, 0, 0.03, 0, 0.08, 0.01)); g.add(rbox(0.76, 0.015, 0.02, '#a8aaa4', 0, H * 0.66, 0.35, 0.005, 0));
  g.add(pos(rbox(0.02, 0.3, 0.03, '#b8bab4', 0.3, H * 0.72, 0.36, 0.01, 0.003))); g.add(pos(rbox(0.02, 0.5, 0.03, '#b8bab4', 0.3, H * 0.36, 0.36, 0.01, 0.003)));
  ['#e0562f', '#4a78b8', '#e0b05a', '#2f8a57'].forEach((mc, i) => g.add(pos(disc(0.02, 0.012, mc, 0), -0.2 + i * 0.1, H * 0.45 + (i % 2) * 0.12, 0.356, Math.PI / 2)));
  const note = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.16), toon('#fff6b0')); note.position.set(-0.08, H * 0.52, 0.357); note.rotation.z = 0.08; g.add(note);
  for (const x of [-1, 1]) g.add(pos(rbox(0.08, 0.03, 0.06, '#3a3a44', x * 0.3, 0, 0.3, 0.01, 0))); return g; };
// kitchen counter run: base cabinets + worktop (+ optional sink / hob). o: {w, color, top, sink, hob}
P.counter = (o = {}) => { const W = o.w || 2.4, c = o.color || '#7fa69a', g = G(), n = Math.max(2, Math.round(W / 0.6)), cw = W / n;
  g.add(rbox(W, 0.1, 0.56, '#2a2a30', 0, 0, -0.02, 0.01, 0)); g.add(rbox(W, 0.76, 0.6, c, 0, 0.1, 0, 0.03, 0.008)); g.add(rbox(W + 0.04, 0.05, 0.64, o.top || '#f2ead8', 0, 0.86, 0, 0.015, 0.006));
  for (let i = 0; i < n; i++) { g.add(rbox(cw - 0.03, 0.66, 0.02, lt(c, 0.08), -W / 2 + cw * (i + 0.5), 0.15, 0.3, 0.02, 0.003)); g.add(pos(pill(0.009, 0.08, '#d8c08a', 0), -W / 2 + cw * (i + 0.5) + cw * 0.32, 0.7, 0.32)); }
  if (o.sink !== false) { const sx = -W / 2 + cw; g.add(rbox(0.5, 0.012, 0.38, '#b8c0c8', sx, 0.905, 0, 0.03, 0)); g.add(rbox(0.44, 0.006, 0.32, '#8a929a', sx, 0.913, 0, 0.03, 0)); g.add(tube([[sx, 0.91, -0.24], [sx, 1.12, -0.24], [sx, 1.14, -0.12], [sx, 1.06, -0.08]], 0.014, '#c8ccd4')); }
  if (o.hob) { const hx = W / 2 - cw; g.add(rbox(0.56, 0.012, 0.48, '#1e1e24', hx, 0.905, 0, 0.02, 0)); for (const [x, z] of [[-0.13, -0.11], [0.13, -0.11], [-0.13, 0.11], [0.13, 0.11]]) g.add(pos(arc(0.07, 0.006, '#4a4a55', Math.PI * 2), hx + x, 0.919, z, Math.PI / 2)); }
  return g; };
// pendant lamp hanging from the ceiling at y = top (o.top, default 2.8); bulb glows
P.pendant = (o = {}) => { const top = o.top || 2.8, drop = o.drop || 0.9, c = o.color || '#e0a040', g = G(); g.add(pos(cyl(0.006, 0.006, drop, '#1b1424'), 0, top - drop, 0));
  g.add(lathe([[0.02, 0.2], [0.08, 0.19], [0.24, 0.03], [0.26, 0], [0.25, 0], [0.07, 0.17], [0.0, 0.18]].reverse(), toon(c, { side: THREE.DoubleSide }), 0, top - drop - 0.2, 0, 0.005));
  const b = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), glowMat('#fff0c0', 1.4)); b.position.y = top - drop - 0.19; g.add(b); const hl = halo(0.9, '#ffd08a', 0.28); hl.position.y = top - drop - 0.2; g.add(hl); return g; };
P.floorLamp = (o = {}) => { const g = G(); g.add(disc(0.16, 0.025, '#2a2a33', 0, 0, 0, 0.004)); g.add(pos(cyl(0.012, 0.012, 1.45, '#2a2a33', 0.003), 0, 0.025, 0));
  g.add(lathe([[0.2, 0], [0.19, 0.01], [0.13, 0.28], [0.125, 0.28]], toon(o.shade || '#f4e4c0', { side: THREE.DoubleSide }), 0, 1.35, 0, 0.005)); const hl = halo(1.1, '#ffd08a', 0.32); hl.position.y = 1.45; g.add(hl); return g; };
P.wallShelf = (o = {}) => { const W = o.w || 0.9, g = G(); g.add(rbox(W, 0.035, 0.22, o.color || '#7a4e34', 0, 0, 0, 0.01, 0.005)); for (const x of [-1, 1]) g.add(pos(rbox(0.02, 0.12, 0.16, '#2a2a33', x * W * 0.35, -0.12, -0.02, 0.005, 0)));
  const st = P.bookRow({ len: W * 0.45, h: 0.2 }); st.position.set(-W * 0.22, 0.035, 0); g.add(st); g.add(pos(leafPlant({ kind: 'succulent', size: 0.6 }), W * 0.28, 0.035, 0)); return g; };

// ================= OUTDOOR =================
// park bench: wooden slats, cast-iron curled sides. Seat faces +z.
P.bench = (o = {}) => { const W = o.w || 1.5, c = o.color || '#a8724a', iron = o.iron || '#2a2a33', g = G();
  for (let i = 0; i < 3; i++) g.add(rbox(W, 0.035, 0.1, i % 2 ? dk(c, 0.06) : c, 0, 0.44, 0.13 - i * 0.12, 0.012, 0.005));
  for (let i = 0; i < 3; i++) g.add(pos(rbox(W, 0.1, 0.03, i % 2 ? dk(c, 0.06) : c, 0, 0, 0, 0.012, 0.005), 0, 0.56 + i * 0.12, -0.21 - i * 0.025, -0.2));
  for (const s of [-1, 1]) { const x = s * (W / 2 - 0.12);
    g.add(tube([[x, 0, 0.2], [x, 0.22, 0.17], [x, 0.43, 0.16]], 0.02, iron)); g.add(tube([[x, 0, -0.22], [x, 0.2, -0.2], [x, 0.43, -0.2], [x, 0.62, -0.25], [x, 0.86, -0.3], [x, 0.9, -0.25]], 0.02, iron));
    g.add(tube([[x, 0.43, -0.2], [x, 0.43, 0.18], [x, 0.62, 0.22], [x, 0.66, 0.12], [x, 0.6, 0.06]], 0.018, iron)); g.add(tube([[x, 0.12, 0.17], [x, 0.18, 0.0], [x, 0.12, -0.18]], 0.012, iron)); }
  return g; };
// leafy tree: tapered trunk with branches + lumpy two-tone crown. o: {h, color, seed}
P.tree = (o = {}) => { const s = (o.h || 4) / 4, c = o.color || '#4f9a55', sd = o.seed || 1, g = G(), tr = o.trunk || '#7a4e34';
  g.add(lathe([[0, 0], [0.22 * s, 0], [0.15 * s, 0.15 * s], [0.11 * s, 1.6 * s], [0.08 * s, 2.2 * s], [0, 2.2 * s]], tr, 0, 0, 0, 0.01));
  g.add(tube([[0, 1.5 * s, 0], [0.35 * s, 2.0 * s, 0.1 * s], [0.6 * s, 2.3 * s, 0.1 * s]], 0.05 * s, tr)); g.add(tube([[0, 1.7 * s, 0], [-0.3 * s, 2.2 * s, -0.1 * s], [-0.55 * s, 2.45 * s, 0]], 0.045 * s, tr));
  [[0, 2.85, 0, 0.95, 0], [-0.62, 2.45, 0.15, 0.7, 1], [0.66, 2.5, -0.05, 0.72, 1], [0.1, 3.45, -0.1, 0.7, 2], [-0.3, 2.9, -0.45, 0.7, 0], [0.35, 2.75, 0.45, 0.62, 2]].forEach(([x, y, z, r, t], i) =>
    g.add(pos(blob(r * s, [c, lt(c, 0.12), dk(c, 0.12)][t], { seed: sd * 7 + i, amp: 0.14, sq: [1, 0.85, 1], line: 0.012 }), x * s, y * s, z * s)));
  return g; };
P.pine = (o = {}) => { const s = (o.h || 4) / 4, c = o.color || '#3f7a55', g = G(); g.add(pos(cyl(0.08 * s, 0.12 * s, 0.8 * s, '#6a4430', 0.008), 0, 0, 0));
  for (let i = 0; i < 4; i++) { const k = 1 - i * 0.2; g.add(pos(cone(1.0 * s * k, 1.4 * s * k, i % 2 ? lt(c, 0.08) : c, 9), 0, (0.6 + i * 0.75) * s, 0, 0, i * 0.4, 0)); } return g; };
P.bush = (o = {}) => { const s = o.size || 1, c = o.color || '#5fae5f', g = G(); [[0, 0.32, 0, 0.42, 0], [-0.4, 0.25, 0.05, 0.32, 1], [0.42, 0.26, -0.02, 0.34, 2], [0.1, 0.5, -0.1, 0.3, 1]].forEach(([x, y, z, r, t], i) =>
  g.add(pos(blob(r * s, [c, lt(c, 0.1), dk(c, 0.1)][t], { seed: (o.seed || 1) * 5 + i, amp: 0.15, sq: [1, 0.8, 1] }), x * s, y * s, z * s))); return g; };
P.lampPost = (o = {}) => { const H = o.h || 3.2, g = G(), c = o.color || '#2a2a33'; g.add(lathe([[0, 0], [0.16, 0], [0.16, 0.05], [0.1, 0.12], [0.07, 0.4], [0, 0.4]], c, 0, 0, 0, 0.006)); g.add(pos(cyl(0.045, 0.06, H - 0.4, c, 0.005), 0, 0.4, 0));
  g.add(pos(cone(0.22, 0.16, c, 8), 0, H + 0.33, 0)); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) g.add(pos(rbox(0.02, 0.32, 0.02, c, x * 0.12, H, z * 0.12, 0.005, 0)));
  const lanternGlow = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.28, 0.2), glowMat('#ffe8b0', o.lit === false ? 0.5 : 1.3)); lanternGlow.position.y = H + 0.17; g.add(lanternGlow); if (o.lit !== false) { const hl = halo(1.4, '#ffd08a', 0.35); hl.position.y = H + 0.17; g.add(hl); } return g; };
// fence run along x. o: {len, h, color}
P.fence = (o = {}) => { const L = o.len || 3, H = o.h || 0.8, c = o.color || '#f4ecdc', g = G(); const shp = new THREE.Shape(); shp.moveTo(-0.045, 0); shp.lineTo(0.045, 0); shp.lineTo(0.045, H - 0.06); shp.lineTo(0, H); shp.lineTo(-0.045, H - 0.06); shp.closePath();
  const pg = new THREE.ExtrudeGeometry(shp, { depth: 0.025, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
  for (let x = -L / 2; x <= L / 2 + 1e-6; x += 0.16) g.add(pos(mesh(pg, c, 0.004), x, 0, 0)); for (const y of [0.2, H - 0.22]) g.add(rbox(L + 0.1, 0.06, 0.025, dk(c, 0.08), 0, y, -0.025, 0.01, 0.004)); return g; };
P.trashBin = (o = {}) => { const c = o.color || '#3a6a5a', g = G(); g.add(lathe([[0, 0], [0.2, 0], [0.23, 0.75], [0.25, 0.76], [0.25, 0.8], [0, 0.8]], c, 0, 0, 0, 0.006));
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; g.add(pos(rbox(0.02, 0.6, 0.01, dk(c, 0.2), 0, 0, 0, 0.005, 0), Math.sin(a) * 0.218, 0.1, Math.cos(a) * 0.218, 0, a, 0)); } return g; };
// bicycle along x, front wheel at +x. o: {color}. g.spin(angle)
P.bike = (o = {}) => { const c = o.color || '#e0562f', g = G(), R = 0.33, wheels = [];
  for (const x of [-0.52, 0.52]) { const w = G(); w.position.set(x, R, 0); w.add(arc(R, 0.022, '#1b1424', Math.PI * 2)); w.add(arc(R - 0.025, 0.007, '#b8bec8', Math.PI * 2)); w.add(pos(cyl(0.03, 0.03, 0.06, '#8a8a96'), 0, 0, -0.03, Math.PI / 2));
    for (let i = 0; i < 12; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.004, R * 2 - 0.05, 0.004), toon('#c8ccd4')); sp.rotation.z = i * Math.PI / 12; w.add(sp); } g.add(w); wheels.push(w); }
  const bb = [0, 0.3, 0], seat = [-0.15, 0.78, 0], head = [0.38, 0.85, 0]; const T = (a, b, r = 0.022) => g.add(tube([a, b], r, c));
  T(bb, seat); T(seat, head); T(bb, head, 0.026); T(bb, [-0.52, R, 0]); T(seat, [-0.52, R, 0], 0.016); T(head, [0.52, R, 0], 0.02);
  g.add(tube([[0.38, 0.85, 0], [0.36, 1.0, 0]], 0.018, '#2a2a33')); g.add(tube([[0.33, 1.0, -0.24], [0.38, 1.0, 0], [0.33, 1.0, 0.24]], 0.016, '#2a2a33'));
  for (const z of [-0.24, 0.24]) g.add(pos(pill(0.022, 0.07, '#1b1424', 0), 0.32, 1.0, z, Math.PI / 2));
  g.add(pos(puffy(0.24, 0.06, 0.12, '#2a2a33', { k: 0.5 }), -0.17, 0.82, 0)); g.add(pos(cyl(0.012, 0.012, 0.06, '#8a8a96'), -0.15, 0.77, 0));
  g.add(pos(arc(0.08, 0.012, '#8a8a96', Math.PI * 2), 0, 0.3, 0.04)); for (const z of [-0.09, 0.09]) g.add(pos(rbox(0.1, 0.02, 0.05, '#2a2a33', 0, 0, 0, 0.005, 0), 0.0, 0.26, z));
  g.spin = (a) => wheels.forEach(w => { w.rotation.z = -a; }); return g; };
// cute car along x (front at +x). o: {color}
P.car = (o = {}) => { const c = o.color || '#4a78b8', g = G(), wheels = [];
  g.add(rbox(3.4, 0.62, 1.6, c, 0, 0.3, 0, 0.22, 0.012)); g.add(rbox(1.9, 0.6, 1.44, lt(c, 0.05), -0.25, 0.85, 0, 0.14, 0.012));
  const win = toon('#5a7ea8', { emissive: new THREE.Color('#2a4a6a'), emissiveIntensity: 0.3 }); for (const z of [-0.745, 0.745]) { const wn = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.42), win); wn.position.set(-0.25, 1.17, z); wn.rotation.y = z > 0 ? 0 : Math.PI; g.add(wn); g.add(pos(rbox(0.06, 0.44, 0.005, c, -0.2, 0.95, z + Math.sign(z) * 0.003, 0.01, 0))); }
  const ws = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.48), win); ws.position.set(0.72, 1.15, 0); ws.rotation.y = Math.PI / 2; ws.rotation.x = 0; g.add(ws);
  for (const [x, z] of [[-1.1, -0.8], [1.1, -0.8], [-1.1, 0.8], [1.1, 0.8]]) { const w = G(); w.position.set(x, 0.34, z); w.add(pos(cyl(0.34, 0.34, 0.24, '#1b1424', 0.006, 32), 0, 0, -0.12, Math.PI / 2)); w.add(pos(cyl(0.18, 0.18, 0.25, '#c8ccd4', 0, 24), 0, 0, -0.125, Math.PI / 2)); g.add(w); wheels.push(w); }
  for (const z of [-0.5, 0.5]) { const hl = new THREE.Mesh(new THREE.CircleGeometry(0.11, 24), glowMat('#fff4d0', 1.3)); hl.position.set(1.701, 0.68, z); hl.rotation.y = Math.PI / 2; g.add(hl); const tl = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.18), glowMat('#ff3a3a', 1.0)); tl.position.set(-1.701, 0.68, z); tl.rotation.y = -Math.PI / 2; g.add(tl); }
  for (const x of [-1.68, 1.68]) g.add(rbox(0.1, 0.16, 1.62, '#2a2a33', x, 0.26, 0, 0.05, 0.006));
  g.spin = (a) => wheels.forEach(w => { w.rotation.z = -a; }); return g; };

export { P };
export const mirrorMat = (night) => new THREE.MeshBasicMaterial({ map: mirrorTex(night), color: new THREE.Color(0.85, 0.85, 0.85) });
export const PROP_NAMES = Object.keys(P);
export const prop = (name, o) => { if (!P[name]) throw new Error('props3d: no prop ' + name + ' (have: ' + PROP_NAMES.join(', ') + ')'); return P[name](o); };
