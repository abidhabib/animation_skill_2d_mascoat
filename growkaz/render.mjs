// render.mjs — deterministic frame renderer (headless Chromium -> ffmpeg), parallel workers.
//   node render.mjs --project projects/my-video                      full video  -> build/video_silent.mp4
//   node render.mjs --project P --from 30 --to 45 --scale 0.5         preview a range
//   node render.mjs --project P --sheet                               one still per shot -> build/sheets/*.png
//   node render.mjs --project P --overflow --scale 0.5               scan every shot for text that sticks out of its box (build/overflow.json)
//   node render.mjs --project P --stills 3.5,12,40                    stills at times -> build/stills
//   node render.mjs --project P --styles emerald,ember,arctic,sakura,retro --at 3.5,12,40   style comparison grid
// Options: --workers N  --scale K  --style ID  --debug  --format png|jpeg  --crf 18  --gl auto|gpu|swiftshader  --out FILE
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const args = {}; { const a = process.argv.slice(2); for (let i = 0; i < a.length; i++) { if (a[i].startsWith('--')) { const k = a[i].slice(2); const v = a[i + 1] && !a[i + 1].startsWith('--') ? a[++i] : true; args[k] = v; } } }
if (!args.project) { console.error('usage: node render.mjs --project projects/<name> [options]'); process.exit(1); }
const PROJECT = path.resolve(args.project);
const BUILD = path.join(PROJECT, 'build'); fs.mkdirSync(BUILD, { recursive: true });
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };

function listScenes(dir, base) { let out = []; if (!fs.existsSync(dir)) return out; for (const f of fs.readdirSync(dir).sort()) { const p = path.join(dir, f); if (fs.statSync(p).isDirectory()) out = out.concat(listScenes(p, `${base}/${f}`)); else if (f.endsWith('.js') && !f.startsWith('_')) out.push(`${base}/${f}`); } return out; }
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/__manifest') { res.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }); return res.end(JSON.stringify(listScenes(path.join(PROJECT, 'scenes'), '/project/scenes'))); }
  const p = url.startsWith('/project/') ? path.join(PROJECT, url.slice(9)) : path.join(ROOT, url);
  if (!(p.startsWith(ROOT) || p.startsWith(PROJECT)) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream', 'Cache-Control': 'no-store' }); fs.createReadStream(p).pipe(res);
}).listen(0);
const PORT = server.address().port;
const gl = args.gl || (process.platform === 'linux' ? 'swiftshader' : 'auto');
const CHROME = process.env.CHROME_PATH || (process.platform === 'win32' ? 'C:/Program Files/Google/Chrome/Application/chrome.exe' : null);   // user's own Chrome (2026-11-21)
const LAUNCH = { ...(CHROME && fs.existsSync(CHROME) ? { executablePath: CHROME } : {}), args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader', '--disable-dev-shm-usage', ...(gl === 'swiftshader' ? ['--use-angle=swiftshader'] : []), ...(gl === 'gpu' ? ['--enable-gpu', '--use-angle=default'] : [])] };
const FORMAT = args.format === 'jpeg' ? 'jpeg' : 'png';
const CFG = JSON.parse(fs.readFileSync(path.join(PROJECT, 'config.json'), 'utf8'));
const FPS = CFG.fps || 24;

async function openPlayer(browser, style, patch) {
  const qs = new URLSearchParams(); if (args.scale) qs.set('scale', args.scale); if (style || args.style) qs.set('style', style || args.style); if (args.debug) qs.set('debug', '1');
  const page = await browser.newPage({ viewport: { width: 640, height: 360 } });
  if (patch) await page.addInitScript(patch);
  page.on('pageerror', e => console.log('[pageerror]', e.message));
  page.on('console', m => { const t = m.text(); if (/ERROR|missing/i.test(t)) console.log('[page]', t); });
  await page.goto(`http://localhost:${PORT}/player.html?${qs}`);
  await page.waitForFunction('window.READY === true || !!window.BOOT_ERROR', null, { timeout: 120000 });
  const boot = await page.evaluate('window.BOOT_ERROR'); if (boot) throw new Error('Player failed to boot: ' + boot);
  const [w, h] = await page.evaluate('window.OUT'); await page.setViewportSize({ width: w, height: h });
  return page;
}
const shot = (page, f) => page.evaluate(i => window.renderFrame(i), f).then(() => page.screenshot({ type: FORMAT, ...(FORMAT === 'jpeg' ? { quality: 94 } : {}) }));
const fmtT = s => `${Math.floor(s / 60)}m${String(Math.round(s % 60)).padStart(2, '0')}s`;

async function renderVideo() {
  const b0 = await chromium.launch(LAUNCH); const p0 = await openPlayer(b0);
  const total = await p0.evaluate('window.TOTAL_FRAMES'), fps = FPS;
  const missing = (await p0.evaluate('window.SHOT_LIST')).filter(s => !s.ok); if (missing.length) console.log(`WARNING: ${missing.length} shots have no scene file yet: ${missing.slice(0, 12).map(s => s.id).join(', ')}${missing.length > 12 ? ' …' : ''}`);
  await b0.close();
  const f0 = Math.max(0, Math.round((+args.from || 0) * fps)), f1 = Math.min(total, args.to ? Math.round(+args.to * fps) : total);
  const W = Math.max(1, Math.min(+(args.workers || Math.max(1, Math.min(8, Math.floor(os.cpus().length / 2)))), Math.ceil((f1 - f0) / 24)));
  const partsDir = path.join(BUILD, 'parts'); fs.rmSync(partsDir, { recursive: true, force: true }); fs.mkdirSync(partsDir, { recursive: true });
  const chunk = Math.ceil((f1 - f0) / W); let done = 0; const t0 = Date.now(); const errs = new Set();
  console.log(`Rendering frames ${f0}-${f1} (${((f1 - f0) / fps).toFixed(1)} s) with ${W} worker(s)…`);
  const work = async (k) => {
    const a = f0 + k * chunk, b = Math.min(f1, a + chunk); if (a >= b) return null;
    const browser = await chromium.launch(LAUNCH); const page = await openPlayer(browser);
    const out = path.join(partsDir, `part_${String(k).padStart(3, '0')}.mp4`);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-preset', args.preset || 'medium', '-crf', String(args.crf || 18), '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let f = a; f < b; f++) {
      const img = await shot(page, f); if (!ff.stdin.write(img)) await new Promise(r => ff.stdin.once('drain', r)); done++;
      if (done % 48 === 0) { const el = (Date.now() - t0) / 1000, eta = (el / done) * (f1 - f0 - done); process.stdout.write(`  ${done}/${f1 - f0} frames  ${(done / el).toFixed(2)} fps  elapsed ${fmtT(el)}  eta ${fmtT(eta)}\n`); }
    }
    (await page.evaluate('window.ERRORS')).forEach(e => errs.add(e));
    ff.stdin.end(); await new Promise(r => ff.on('close', r)); await browser.close(); return out;
  };
  const parts = (await Promise.all([...Array(W)].map((_, k) => work(k)))).filter(Boolean);
  const list = path.join(partsDir, 'list.txt'); fs.writeFileSync(list, parts.map(p => `file '${p.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n'));
  const out = path.resolve(args.out || path.join(BUILD, args.from || args.to ? 'preview.mp4' : 'video_silent.mp4'));
  await new Promise((res, rej) => spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out], { stdio: 'inherit' }).on('close', c => (c ? rej(new Error('concat failed')) : res())));
  if (errs.size) { console.log(`\n${errs.size} shot error(s):`); [...errs].slice(0, 40).forEach(e => console.log('  ' + e)); }
  console.log(`\nDone: ${out}  (${fmtT((Date.now() - t0) / 1000)})`);
}
// grid of labelled images, laid out by the browser (works on every OS)
async function contactSheet(browser, items, outFile, cols = 4, cellW = 480) {
  const page = await browser.newPage({ viewport: { width: cols * (cellW + 12) + 12, height: 400 } });
  const html = `<html><body style="margin:0;background:#111;font:600 15px sans-serif;color:#eee"><div style="display:grid;grid-template-columns:repeat(${cols},${cellW}px);gap:12px;padding:12px">${items.map(it => `<div><img src="data:image/${FORMAT};base64,${it.img.toString('base64')}" style="width:${cellW}px;display:block;border-radius:4px"><div style="padding:5px 2px">${it.label.replace(/</g, '&lt;')}</div></div>`).join('')}</div></body></html>`;
  await page.setContent(html); await page.screenshot({ path: outFile, fullPage: true }); await page.close();
}

const OVF_PATCH = `(() => {
  const P = CanvasRenderingContext2D.prototype; let path = null, shapes = [], hits = [], seen = new Set();
  const add = (ctx, x, y) => { const m = ctx.getTransform(), X = m.a * x + m.c * y + m.e, Y = m.b * x + m.d * y + m.f; if (!path) path = { x0: X, y0: Y, x1: X, y1: Y }; else { path.x0 = Math.min(path.x0, X); path.y0 = Math.min(path.y0, Y); path.x1 = Math.max(path.x1, X); path.y1 = Math.max(path.y1, Y); } };
  const wrap = (name, fn) => { const o = P[name]; P[name] = function (...a) { fn(this, ...a); return o.apply(this, a); }; };
  wrap('beginPath', () => { path = null; }); wrap('moveTo', (c, x, y) => add(c, x, y)); wrap('lineTo', (c, x, y) => add(c, x, y)); wrap('arcTo', (c, x1, y1, x2, y2) => { add(c, x1, y1); add(c, x2, y2); });
  wrap('quadraticCurveTo', (c, cx, cy, x, y) => { add(c, cx, cy); add(c, x, y); }); wrap('bezierCurveTo', (c, a, b, d, e, x, y) => { add(c, a, b); add(c, d, e); add(c, x, y); });
  wrap('rect', (c, x, y, w, h) => { add(c, x, y); add(c, x + w, y + h); }); wrap('roundRect', (c, x, y, w, h) => { add(c, x, y); add(c, x + w, y + h); }); wrap('arc', (c, x, y, r) => { add(c, x - r, y - r); add(c, x + r, y + r); }); wrap('ellipse', (c, x, y, rx, ry) => { add(c, x - rx, y - ry); add(c, x + rx, y + ry); });
  const alphaOf = (c) => { const f = c.fillStyle; if (typeof f !== 'string') return 1; const m = f.match(/rgba?\(([^)]+)\)/); if (m) { const p = m[1].split(','); return p.length > 3 ? parseFloat(p[3]) : 1; } return 1; };
  const oFill = P.fill; P.fill = function (...a) { if (path && this.globalAlpha > 0.4 && alphaOf(this) > 0.4) { const w = path.x1 - path.x0, h = path.y1 - path.y0; if (w > 20 && h > 14) shapes.push({ ...path, w, h }); } return oFill.apply(this, a); };
  const oFR = P.fillRect; P.fillRect = function (x, y, w, h) { if (this.globalAlpha > 0.4 && alphaOf(this) > 0.4 && Math.abs(w) > 20 && Math.abs(h) > 14) { const m = this.getTransform(), pts = [[x, y], [x + w, y + h]].map(([px, py]) => [m.a * px + m.c * py + m.e, m.b * px + m.d * py + m.f]); shapes.push({ x0: Math.min(pts[0][0], pts[1][0]), x1: Math.max(pts[0][0], pts[1][0]), y0: Math.min(pts[0][1], pts[1][1]), y1: Math.max(pts[0][1], pts[1][1]), w: Math.abs(pts[1][0] - pts[0][0]), h: Math.abs(pts[1][1] - pts[0][1]) }); } return oFR.call(this, x, y, w, h); };
  const oSt = P.stroke; P.stroke = function (...a) { if (path && this.globalAlpha > 0.4 && this.lineWidth * Math.abs(this.getTransform().a) >= 2) { const w = path.x1 - path.x0, h = path.y1 - path.y0; if (w > 40 && h > 24) shapes.push({ ...path, w, h }); } return oSt.apply(this, a); };
  const oFT = P.fillText; P.fillText = function (txt, x, y, mw) { try { if (this.globalAlpha > 0.4 && String(txt).trim() && alphaOf(this) > 0.4 && this.fillStyle !== 'rgba(0,0,0,0)') {
      const m = this.measureText(String(txt)), L = m.actualBoundingBoxLeft, R = m.actualBoundingBoxRight, A = m.actualBoundingBoxAscent, D = m.actualBoundingBoxDescent, T = this.getTransform();
      const pts = [[x - L, y - A], [x + R, y - A], [x - L, y + D], [x + R, y + D]].map(([px, py]) => [T.a * px + T.c * py + T.e, T.b * px + T.d * py + T.f]);
      const tb = { x0: Math.min(...pts.map(p => p[0])), x1: Math.max(...pts.map(p => p[0])), y0: Math.min(...pts.map(p => p[1])), y1: Math.max(...pts.map(p => p[1])) }; const tw = tb.x1 - tb.x0, th = tb.y1 - tb.y0, cx = (tb.x0 + tb.x1) / 2, cy = (tb.y0 + tb.y1) / 2;
      let best = null; for (const s of shapes) { if (cx >= s.x0 && cx <= s.x1 && cy >= s.y0 && cy <= s.y1 && s.h >= th * 0.9 && s.w >= tw * 0.5 && (s.w >= 1.25 * s.h || s.h >= 3 * th) && s.w * s.h < 0.3 * innerWidth * innerHeight && (!best || s.w * s.h < best.w * best.h)) best = s; }
      if (best) { const tol = Math.max(6, th * 0.12), ox = Math.max(best.x0 - tb.x0, tb.x1 - best.x1), oy = Math.max(best.y0 - tb.y0, tb.y1 - best.y1); if (ox > tol || oy > th * 0.4) { const key = String(txt) + '|' + Math.round(cx / 20) + '|' + Math.round(cy / 20); if (!seen.has(key)) { seen.add(key); hits.push({ text: String(txt), textW: Math.round(tw), boxW: Math.round(best.w), boxH: Math.round(best.h), overX: Math.round(ox), overY: Math.round(oy), at: [Math.round(cx), Math.round(cy)] }); } } }
    } } catch (e) {} return oFT.call(this, txt, x, y, mw); };
  window.__ovfReset = () => { shapes = []; hits = []; seen = new Set(); path = null; }; window.__ovfGet = () => hits.slice();
})();`;
async function scanOverflow() {
  const browser = await chromium.launch(LAUNCH); const page = await openPlayer(browser, null, OVF_PATCH);
  const shots = await page.evaluate('window.SHOT_LIST'); const out = []; const KS = [0.2, 0.4, 0.6, 0.8, 0.96];
  for (const s of shots) for (const k of KS) { const t = s.start + (s.end - s.start) * k; await page.evaluate(() => window.__ovfReset()); await page.evaluate(i => window.renderFrame(i), Math.round(t * FPS)); const r = await page.evaluate(() => window.__ovfGet()); r.forEach(x => out.push({ shot: s.id, t: +t.toFixed(2), ...x })); }
  fs.mkdirSync(BUILD, { recursive: true }); fs.writeFileSync(path.join(BUILD, 'overflow.json'), JSON.stringify(out, null, 1));
  const seenK = new Set(); out.forEach(o => { const key = o.shot + o.text; if (seenK.has(key)) return; seenK.add(key); console.log(`OVERFLOW ${o.shot} t=${o.t}s "${o.text}" text ${o.textW}px in box ${o.boxW}x${o.boxH} (out by ${o.overX}/${o.overY}) at ${o.at}`); });
  console.log(`overflow scan done: ${seenK.size} suspect text(s)`); await browser.close();
}
async function renderStills() {
  const browser = await chromium.launch(LAUNCH); const styles = args.styles ? String(args.styles).split(',') : [args.style || null];
  const dir = path.join(BUILD, args.styles ? 'styles' : args.sheet ? 'sheets' : 'stills'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const all = [];
  for (const st of styles) {
    const page = await openPlayer(browser, st); const fps = FPS;
    let targets;
    if (args.sheet) targets = (await page.evaluate('window.SHOT_LIST')).map(s => ({ t: s.start + (s.end - s.start) * 0.45, label: `${s.id}  ${s.start.toFixed(1)}s${s.ok ? '' : '  (MISSING)'}` }));
    else targets = String(args.stills || args.at || '1').split(',').map(Number).map(t => ({ t, label: `${t}s` }));
    for (const tg of targets) { const img = await shot(page, Math.round(tg.t * fps)); const name = `${st ? st + '_' : ''}${tg.label.split(' ')[0].replace(/[^\w.]/g, '')}_${tg.t.toFixed(2)}.${FORMAT}`; fs.writeFileSync(path.join(dir, name), img); all.push({ img, label: `${st ? `[${st}] ` : ''}${tg.label}`, st }); }
    (await page.evaluate('window.ERRORS')).forEach(e => console.log('  shot error:', e)); await page.close();
  }
  if (args.styles) { const n = all.length / styles.length; await contactSheet(browser, all, path.join(dir, 'style_grid.png'), n, 420); }
  else { const per = 24; for (let i = 0; i < all.length; i += per) await contactSheet(browser, all.slice(i, i + per), path.join(dir, `sheet_${String(i / per + 1).padStart(2, '0')}.png`), 4, 440); }
  await browser.close(); console.log(`Wrote ${all.length} stills + contact sheet(s) to ${dir}`);
}
try { if (args.overflow) await scanOverflow(); else if (args.sheet || args.stills || args.styles) await renderStills(); else await renderVideo(); }
catch (e) { console.error('RENDER FAILED:', e.message); process.exitCode = 1; }
finally { server.close(); }
