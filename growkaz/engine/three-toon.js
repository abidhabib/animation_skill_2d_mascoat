// three-toon.js: our SOFT cartoon 3D (user 2026-11-21: "3d not boxy", smooth camera). Use for 3D backgrounds with our 2D cast on top.
//   Look: rounded shapes (rbox / lathe / capsules), cartoon shading (toon 4-step), thin ink outlines (inverted hull), warm lights.
//   Camera: cam3(st, t, dur, move) = smooth eased moves (push, pull, slideL/R, craneUp/Down, orbit, path) + gentle breathing drift.
//   Characters: pin(st, [x,y,z], h=1.7) -> {x, y, s} screen position + drawToon scale for a 2D figure standing at that 3D spot.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { E, ease, clamp, lerp, noise } from '/engine/core.js';

const C = (c) => new THREE.Color(c);
let _grad = null;
const grad = () => { if (_grad) return _grad; const d = new Uint8Array([90, 150, 205, 255]); _grad = new THREE.DataTexture(d, 4, 1, THREE.RedFormat); _grad.minFilter = _grad.magFilter = THREE.NearestFilter; _grad.needsUpdate = true; return _grad; };
export const toon = (c, o = {}) => new THREE.MeshToonMaterial({ color: C(c), gradientMap: grad(), ...o });
export const glowMat = (c, k = 1.6) => new THREE.MeshBasicMaterial({ color: C(c).multiplyScalar(k), toneMapped: false });
const INK = new THREE.MeshBasicMaterial({ color: C('#1b1424'), side: THREE.BackSide });
// ink outline: a slightly bigger back-face copy (keeps the cartoon line look of our 2D sets)
export function ink(mesh, w = 0.025) {
  const o = new THREE.Mesh(mesh.geometry, INK); o.castShadow = false; o.receiveShadow = false;
  mesh.geometry.computeBoundingBox(); const b = mesh.geometry.boundingBox, sz = new THREE.Vector3(); b.getSize(sz);
  o.scale.set(1 + (2 * w) / Math.max(sz.x, 0.05), 1 + (2 * w) / Math.max(sz.y, 0.05), 1 + (2 * w) / Math.max(sz.z, 0.05)); mesh.add(o); return mesh;
}
const prep = (m, cast = true, recv = true) => { m.castShadow = cast; m.receiveShadow = recv; return m; };
const mm = (m) => (typeof m === 'string' ? toon(m) : m);
// rounded box (radius r) at x,y,z (y = bottom), outlined
export function rbox(w, h, d, m, x = 0, y = 0, z = 0, r = 0.06, line = 0.02) {
  const g = new RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2)); g.translate(0, h / 2, 0);
  const me = prep(new THREE.Mesh(g, mm(m))); me.position.set(x, y, z); return line ? ink(me, line) : me;
}
// lathe: profile [[radius, y], ...] spun around Y (mugs, kettles, lamp shades, pots, vases)
export function lathe(profile, m, x = 0, y = 0, z = 0, line = 0.015, seg = 40) {
  const me = prep(new THREE.Mesh(new THREE.LatheGeometry(profile.map(([r, yy]) => new THREE.Vector2(r, yy)), seg), mm(m))); me.position.set(x, y, z); return line ? ink(me, line) : me;
}
export function ball(r, m, x = 0, y = 0, z = 0, line = 0.015) { const me = prep(new THREE.Mesh(new THREE.SphereGeometry(r, 32, 20), mm(m))); me.position.set(x, y, z); return line ? ink(me, line) : me; }
export function pill(r, len, m, x = 0, y = 0, z = 0, line = 0.015) { const me = prep(new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 6, 20), mm(m))); me.position.set(x, y, z); return line ? ink(me, line) : me; }
export function disc(r, h, m, x = 0, y = 0, z = 0, line = 0.015) { const g = new THREE.CylinderGeometry(r, r, h, 48); g.translate(0, h / 2, 0); const me = prep(new THREE.Mesh(g, mm(m))); me.position.set(x, y, z); return line ? ink(me, line) : me; }
export function flat(w, h, m, x = 0, y = 0, z = 0) { const me = prep(new THREE.Mesh(new THREE.PlaneGeometry(w, h), mm(m)), false, true); me.position.set(x, y, z); return me; }
export function tex(w, h, draw, repeat = null) { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...repeat); } return t; }
// soft light pool / glow sprite (additive) for lamps and windows
export function halo(r, c, a = 0.5) {
  const t = tex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, color: C(c), transparent: true, opacity: a, blending: THREE.AdditiveBlending, depthWrite: false })); s.scale.set(r, r, 1); return s;
}

// ---------- smooth camera ----------
// move = { from:{pos:[x,y,z], look:[x,y,z], fov}, to:{...}, e:'inOut'|'sine'|'out', breathe: 0.015 }
// presets build a from/to around a target: push(target, dist0, dist1), slide(target, side), crane(target, h0, h1), orbit(target, a0, a1, r, h)
const V3 = (a) => new THREE.Vector3(...a);
const EZ = { inOut: ease.inOut, sine: ease.sine, out: ease.out, in: ease.in, linear: ease.linear, smooth: (x) => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); } };
export function cam3(st, t, dur, mv) {
  const cam = st.camera, k = (EZ[mv.e || 'smooth'])(clamp(t / dur));
  let pos, look, fov;
  if (mv.path) { const curve = mv._c || (mv._c = new THREE.CatmullRomCurve3(mv.path.map(V3), false, 'centripetal')); pos = curve.getPointAt(k); look = V3(mv.look0).lerp(V3(mv.look1 || mv.look0), k); fov = lerp(mv.fov0 || 35, mv.fov1 || mv.fov0 || 35, k); }
  else { pos = V3(mv.from.pos).lerp(V3(mv.to.pos), k); look = V3(mv.from.look).lerp(V3(mv.to.look), k); fov = lerp(mv.from.fov || 35, mv.to.fov || mv.from.fov || 35, k); }
  const b = mv.breathe ?? 0.012, T = st._t0 = (st._t0 ?? 0); const gt = t + (mv.seed || 0) * 10;
  pos.x += noise(gt * 0.35, 1) * b; pos.y += noise(gt * 0.3, 2) * b; look.x += noise(gt * 0.25, 3) * b * 0.6;
  cam.position.copy(pos); cam.lookAt(look); if (Math.abs(cam.fov - fov) > 1e-4) { cam.fov = fov; cam.updateProjectionMatrix(); }
}
const off = (tg, d) => [tg[0] + d[0], tg[1] + d[1], tg[2] + d[2]];
export const moves = {
  push: (tg, d0 = 5, d1 = 3.6, h = 1.5, dir = [0, 0, 1]) => ({ from: { pos: off(tg, [dir[0] * d0, h - tg[1], dir[2] * d0]), look: tg }, to: { pos: off(tg, [dir[0] * d1, h - tg[1], dir[2] * d1]), look: tg } }),
  pull: (tg, d0 = 3.6, d1 = 5, h = 1.5, dir = [0, 0, 1]) => moves.push(tg, d0, d1, h, dir),
  slide: (tg, x0 = -1.2, x1 = 1.2, d = 4.5, h = 1.5) => ({ from: { pos: off(tg, [x0, h - tg[1], d]), look: off(tg, [x0 * 0.25, 0, 0]) }, to: { pos: off(tg, [x1, h - tg[1], d]), look: off(tg, [x1 * 0.25, 0, 0]) } }),
  crane: (tg, h0 = 0.9, h1 = 2.6, d = 4.6) => ({ from: { pos: off(tg, [0, h0 - tg[1], d]), look: off(tg, [0, -0.1, 0]) }, to: { pos: off(tg, [0, h1 - tg[1], d * 0.92]), look: off(tg, [0, -0.35, 0]) } }),
  orbit: (tg, a0 = -0.5, a1 = 0.3, r = 4.6, h = 1.6) => { const p = []; for (let i = 0; i <= 6; i++) { const a = lerp(a0, a1, i / 6); p.push([tg[0] + Math.sin(a) * r, h, tg[2] + Math.cos(a) * r]); } return { path: p, look0: tg }; },
};

// ---------- 2D cast on 3D ----------
// pin(st, [x,y,z] feet position, figureHeightMetres) -> {x, y, s, z}: where to drawToon + its scale (figure ~270 units tall at s=1)
const _v = new THREE.Vector3();
export function pin(st, p, h = 1.7) {
  const cam = st.camera; _v.set(p[0], p[1], p[2]).project(cam); const x = (_v.x + 1) / 2 * E.W, y = (1 - _v.y) / 2 * E.H;
  _v.set(p[0], p[1] + h, p[2]).project(cam); const yt = (1 - _v.y) / 2 * E.H;
  return { x, y, s: Math.max(0.05, (y - yt) / 270), z: cam.position.distanceTo(new THREE.Vector3(...p)) };
}
// screen point of any 3D spot (for glows/numbers/props)
export function screenOf(st, p) { _v.set(p[0], p[1], p[2]).project(st.camera); return { x: (_v.x + 1) / 2 * E.W, y: (1 - _v.y) / 2 * E.H }; }
