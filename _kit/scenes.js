// Scene library for the cartoon explainer. Loaded after toon.js.
// Usage in a scene file:  S.mount("s3", { type: "docStamp", bg: "teal", in: { kind: "whip" }, dur: 4, title: "...", t: { in: 0.3, stamp: 1.3 } })
// Every time in opts is scene-local seconds (word time - scene start). Hand-written durations go through T.d().
(function () {
  const T = window.T, INK = T.INK, q = (s) => document.querySelector(s);
  const W = (txt, fs) => String(txt).length * fs * 0.55; // Kalam width estimate
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const SHIRTS = ["#e07b39", "#2fb3a0", "#d23a2e", "#3d6fd1", "#f2c14e", "#7d4fc2", "#e45a8f", "#4a9e4f"];
  const SKINS = ["#f1c8a0", "#d6a074", "#a8714a", "#f5d6b8", "#7a4e33"];
  const HAIRS = ["short", "side", "bun", "long", "bald", "grey"];
  const FLAGS = { SG: T.flagSG, CN: T.flagCN, US: T.flagUS };

  // ---------- backgrounds: always edge to edge and dressed ----------
  function bg(kind, seed) {
    const r = T.rng(seed || 11), F = (x, y, w, h, c, sw) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="${sw == null ? 5 : sw}"/>`;
    const full = (c) => `<rect x="-400" y="-400" width="2720" height="1880" fill="${c}"/>`;
    const floor = (c, y) => `<rect x="-400" y="${y}" width="2720" height="800" fill="${c}"/><path d="M-400,${y} L2320,${y}" stroke="${INK}" stroke-width="7"/>`;
    const skyline = (y, col, win) => { let s = ""; let x = -380; while (x < 2300) { const w = 140 + r() * 160, h = 180 + r() * 380; s += F(x, y - h, w, h + 400, col); for (let wy = y - h + 40; wy < y - 30; wy += 70) for (let wx = x + 25; wx < x + w - 40; wx += 55) if (r() > 0.35) s += `<rect x="${wx}" y="${wy}" width="26" height="36" fill="${win}"/>`; x += w + 10 + r() * 30; } return s; };
    const shelf = (x, y) => { let s = F(x, y, 380, 18, "#8a5a35"); let bx = x + 14; while (bx < x + 350) { const w = 26 + r() * 22, h = 70 + r() * 40; s += F(bx, y - h, w, h, SHIRTS[Math.floor(r() * 8)], 4); bx += w + 4; } return s; };
    const win = (x, y, w, h, sky) => F(x, y, w, h, sky, 7) + `<path d="M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}" stroke="${INK}" stroke-width="7"/>`;
    const frame = (x, y, w, h, c) => F(x, y, w, h, "#fbfaf5", 6) + F(x + 16, y + 16, w - 32, h - 32, c, 4);
    const plant = (x, y) => `<path d="M${x},${y - 60} C${x - 70},${y - 200} ${x - 20},${y - 230} ${x},${y - 120} C${x + 20},${y - 240} ${x + 80},${y - 200} ${x},${y - 60}Z" fill="#4a9e4f" stroke="${INK}" stroke-width="5"/>` + `<path d="M${x - 50},${y - 70} L${x + 50},${y - 70} L${x + 36},${y} L${x - 36},${y}Z" fill="#c4643a" stroke="${INK}" stroke-width="5"/>`;
    const burst = (cx, cy, c) => { let b = ""; for (let i = 0; i < 18; i++) { const a0 = (i / 18) * Math.PI * 2, a1 = a0 + Math.PI / 18, R = 2200; b += `<path d="M${cx},${cy} L${(cx + R * Math.cos(a0)).toFixed(0)},${(cy + R * Math.sin(a0)).toFixed(0)} L${(cx + R * Math.cos(a1)).toFixed(0)},${(cy + R * Math.sin(a1)).toFixed(0)}Z"/>`; } return `<g fill="${c}">${b}</g>`; };
    const clouds = () => { let s = ""; for (let i = 0; i < 5; i++) { const x = -200 + i * 480 + r() * 120, y = 90 + r() * 160; s += `<path d="M${x},${y} a60,60 0 0,1 110,-30 a70,70 0 0,1 130,20 a50,50 0 0,1 0,90 l-240,0 a50,50 0 0,1 0,-80z" fill="#fbfaf5" stroke="${INK}" stroke-width="5"/>`; } return s; };
    switch (kind) {
      case "sunset": return full("#e8644a") + `<rect x="-400" y="160" width="2720" height="200" fill="#ee8452"/><rect x="-400" y="360" width="2720" height="260" fill="#f2a65a"/><circle cx="1460" cy="560" r="190" fill="#f9d77a" stroke="${INK}" stroke-width="6"/>` + skyline(860, "#5a2f4f", "#f2c14e") + floor("#3b2440", 860);
      case "night": return full("#1f2a5c") + `<circle cx="1620" cy="180" r="90" fill="#f6e7a8" stroke="${INK}" stroke-width="6"/>` + skyline(880, "#2c2350", "#f2c14e") + floor("#16183a", 880);
      case "sky": return full("#7ec8f0") + clouds() + `<path d="M-400,820 Q300,620 900,800 T2320,760 L2320,1480 L-400,1480Z" fill="#7cc242" stroke="${INK}" stroke-width="7"/>` + skyline(900, "#3d6fd1", "#fbe2a0") + floor("#4a9e4f", 900);
      case "yellow": return full("#f2c14e") + burst(960, 520, "#f6cf6a") + floor("#6a4fc2", 900);
      case "red": return full("#d23a2e") + win(140, 160, 420, 360, "#7ec8f0") + shelf(1460, 330) + shelf(1460, 560) + frame(760, 200, 240, 180, "#f2c14e") + floor("#7a3b2a", 900) + plant(1800, 900);
      case "teal": return full("#2fb3a0") + frame(220, 180, 300, 220, "#e8644a") + frame(1420, 160, 360, 260, "#f2c14e") + shelf(700, 320) + floor("#f2c14e", 900) + plant(140, 900);
      case "purple": return full("#6a4fc2") + win(160, 140, 520, 400, "#e8644a") + win(1260, 140, 520, 400, "#e8644a") + floor("#2fb3a0", 900) + plant(980, 900);
      case "blue": return full("#3d6fd1") + `<g opacity="0.25" stroke="#fbfaf5" stroke-width="3">${Array.from({ length: 30 }, (_, i) => `<path d="M${-400 + i * 100},-400 L${-400 + i * 100},1480"/><path d="M-400,${-400 + i * 100} L2320,${-400 + i * 100}"/>`).join("")}</g>` + floor("#f2c14e", 920);
      default: return full(kind || "#7ec8f0");
    }
  }

  // ---------- intro transitions (played by the incoming scene on its own svg) ----------
  function intro(tl, sid, o) {
    if (!o) return;
    const el = `#${sid}-svg`, at = o.at || [960, 540];
    switch (o.kind) {
      case "whip": tl.fromTo(el, { x: (o.dir || 1) * 700, filter: "blur(16px)" }, { x: 0, filter: "blur(0px)", duration: 0.32, ease: "power3.out" }, 0); break;
      case "vwhip": tl.fromTo(el, { y: (o.dir || 1) * 600, filter: "blur(16px)" }, { y: 0, filter: "blur(0px)", duration: 0.32, ease: "power3.out" }, 0); break;
      case "iris": case "flood": tl.fromTo(el, { clipPath: `circle(0px at ${at[0]}px ${at[1]}px)` }, { clipPath: `circle(2300px at ${at[0]}px ${at[1]}px)`, duration: o.kind === "iris" ? 0.38 : 0.45, ease: "power2.in" }, 0); break;
      case "wipe": { tl.fromTo(el, { clipPath: "polygon(0% 0%, 0% 0%, -20% 100%, -20% 100%)" }, { clipPath: "polygon(0% 0%, 120% 0%, 100% 100%, -20% 100%)", duration: 0.4, ease: "power2.inOut" }, 0); break; }
      case "zoom": tl.fromTo(el, { scale: 2.6, transformOrigin: `${at[0]}px ${at[1]}px`, filter: "blur(10px)" }, { scale: 1, filter: "blur(0px)", duration: 0.4, ease: "expo.out" }, 0); break;
      case "drop": tl.fromTo(el, { y: -1100 }, { y: 0, duration: 0.42, ease: "bounce.out" }, 0); break;
    }
  }

  // ---------- characters from opts ----------
  // direction-aware characters: walk dx sets side view + mirror; dir 'away' = back view shrinking, 'toward' = front view growing
  function prepChars(o) {
    (o.chars || []).forEach((c) => {
      if (c.style !== "mascot") return;
      if (o.type === "thumb" && c.vol == null) c.vol = true;
      if (c.pose && POSES[c.pose] && POSES[c.pose].side && !c.dir && !c.view) c.dir = "right";
      if (c.walk && !c.dir && !c.view) c.dir = c.walk[2] >= 0 ? "right" : "left";
      if (c.dir === "left") { c.view = "side"; c.flip = true; } else if (c.dir === "right") { c.view = "side"; c.flip = false; } else if (c.dir === "away") c.view = "back"; else if (c.dir === "toward") c.view = "front";
    });
  }
  function expandGroup(o) {
    if (o.group) expandGroup2(o); expandCrowd(o); prepChars(o);
  }
  function expandGroup2(o) {
    if (!o.group) return; const g = o.group, r = T.rng(g.seed || 9);
    o.chars = (o.chars || []).concat(Array.from({ length: g.n }, (_, i) => ({ name: "g" + i, style: g.style || "pear", x: g.x + i * g.dx, y: g.y + (i % 2) * (g.stagger || 10), scale: (g.scale || 1) * (0.92 + r() * 0.16), face: g.face == null ? 0.6 : g.face, flip: !!g.flip, shirt: SHIRTS[Math.floor(r() * 8)], hair: HAIRS[Math.floor(r() * 6)], skin: SKINS[Math.floor(r() * 5)], hat: g.hats ? g.hats[Math.floor(r() * g.hats.length)] : undefined, hatCol: g.hatCol, glasses: r() > 0.7, stache: r() > 0.78, walk: g.walk ? [g.walk[0] + i * 0.06, g.walk[1], g.walk[2]] : undefined })));
  }
  function chars(o, sid) { return (o.chars || []).map((c, i) => T.char(Object.assign({ id: `${sid}-c${i}` }, c))).join(""); }

  // ---------- number tags: a glowing number floating over a head (trust score, price, age ...) ----------
  // spec: "tags":[{"ch":"hero"|index, "text":"62", "t":0.5, "to":[[2.0,"41"],[3.5,"31"]], "size":120, "col":"#5dffb0" (auto: >=70 green, 45-69 amber, <45 red), "dy":60, "x":..,"y":..}]
  // The number pops in with a bounce, glows softly (finite pulse), and each "to" step swaps the value with a new pop and colour.
  function tagCol(txt, c) { if (c) return c; const v = parseFloat(txt); if (isNaN(v)) return "#7dffea"; return v >= 70 ? "#5dffb0" : v >= 45 ? "#ffd24a" : "#ff6a5c"; }
  function tagList(o) {
    return (o.tags || []).map((g, i) => {
      const ch = typeof g.ch === "number" ? (o.chars || [])[g.ch] : (o.chars || []).find((c) => c.name === g.ch), sc = ch ? (ch.scale || 1) : 1;
      const x = g.x != null ? g.x : (ch ? ch.x || 0 : 960), y = g.y != null ? g.y : (ch ? (ch.y || 0) - (ch.style === "mascot" ? 372 : 335) * sc - (g.dy == null ? 70 : g.dy) : 300);
      const vals = [[g.t == null ? 0.3 : g.t, String(g.text)]].concat((g.to || []).map((a) => [a[0], String(a[1])]));
      return { g, i, x, y, vals, size: g.size || 120 };
    });
  }
  function tagsSvg(o, sid) {
    const L = tagList(o); if (!L.length) return "";
    let out = `<defs><filter id="${sid}-tgb" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14"/></filter><filter id="${sid}-tgb2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter></defs>`;
    L.forEach(({ g, i, x, y, vals, size }) => {
      vals.forEach(([t, v], k) => {
        const col = tagCol(v, g.col), fs = size, ty = y + fs * 0.34;
        out += `<g id="${sid}-tgv${i}_${k}" opacity="0"><g id="${sid}-tgg${i}_${k}">`
          + `<text x="${x}" y="${ty}" font-size="${fs * 1.08}" text-anchor="middle" fill="${col}" stroke="${col}" stroke-width="${fs * 0.16}" stroke-linejoin="round" filter="url(#${sid}-tgb)">${esc(v)}</text></g>`
          + `<text x="${x}" y="${ty}" font-size="${fs}" text-anchor="middle" fill="${col}" stroke="${col}" stroke-width="${fs * 0.05}" stroke-linejoin="round" opacity="0.9" filter="url(#${sid}-tgb2)">${esc(v)}</text>`
          + `<text x="${x}" y="${ty}" font-size="${fs}" text-anchor="middle" fill="#ffffff" stroke="#0b0620" stroke-width="${fs * 0.07}" paint-order="stroke" stroke-linejoin="round">${esc(v)}</text></g>`;
      });
    });
    return out;
  }
  function tagsAnim(tl, o, sid, dur) {
    tagList(o).forEach(({ i, x, y, vals }) => {
      vals.forEach(([t, v], k) => {
        const el = `#${sid}-tgv${i}_${k}`, gl = `#${sid}-tgg${i}_${k}`, end = k + 1 < vals.length ? vals[k + 1][0] : dur;
        tl.fromTo(el, { opacity: 0, scale: 0.45, svgOrigin: `${x} ${y}` }, { opacity: 1, scale: 1, svgOrigin: `${x} ${y}`, duration: 0.42, ease: "back.out(2.6)", immediateRender: false }, t);
        if (k + 1 < vals.length) tl.set(el, { opacity: 0 }, end);
        const half = 0.6, reps = Math.max(1, Math.floor((end - t - 0.3) / half)) - 1;
        tl.fromTo(gl, { opacity: 0.95 }, { opacity: 0.5, duration: half, ease: "sine.inOut", yoyo: true, repeat: reps, immediateRender: false }, t + 0.4);
      });
    });
  }

  function animChars(tl, o, sid, dur) {
    (o.chars || []).forEach((c, i) => {
      const id = `${sid}-c${i}`;
      T.armSet(tl, id, "l", c.armL == null ? 10 : c.armL); T.armSet(tl, id, "r", c.armR == null ? -10 : c.armR);
      T.idle(tl, id, 0.2 + i * 0.13, dur, 1);
      T.blink(tl, id, [0.9 + i * 0.4, 3.1 + i * 0.3, 5.6 + i * 0.2, 8.2].filter((x) => x < dur));
      if (c.walk) { T.walk(tl, id, c.walk[0], c.walk[1], c.walk[2], 0); const n = Math.round((c.walk[1] - c.walk[0]) / 0.3); for (let k = 0; k < n; k++) { const a = k % 2 ? 26 : -26; T.armTo(tl, id, "l", a, c.walk[0] + k * 0.3, 0.28, "sine.inOut"); T.armTo(tl, id, "r", -a, c.walk[0] + k * 0.3, 0.28, "sine.inOut"); } }
      if (c.dir === "away" || c.dir === "toward") { const w = c.walk || [0.1, dur - 0.1, 0], aw = c.dir === "away", org = `${c.x || 0} ${c.y || 0}`; if (!c.walk) T.walk(tl, id, w[0], w[1], 0, 0); tl.fromTo(`#${id}-pos`, aw ? { scale: 1, y: 0, svgOrigin: org } : { scale: c.farScale || 0.5, y: -(c.depth || 80), svgOrigin: org }, { scale: aw ? (c.farScale || 0.5) : 1, y: aw ? -(c.depth || 80) : 0, svgOrigin: org, duration: w[1] - w[0], ease: "none", immediateRender: false }, w[0]); }
      (c.turns || []).forEach(([tt, dur2, to, from]) => T.turn(tl, id, tt, dur2, to, from));
      (c.moods || []).forEach(([t, m]) => T.mood(tl, id, t, m));
      (c.browsAt || []).forEach(([t, k]) => T.brows(tl, id, t, k));
      (c.arms || []).forEach(([t, side, deg]) => T.armTo(tl, id, side, deg, t, 0.3));
      (c.looks || []).forEach(([t, dx, dy]) => T.look(tl, id, t, dx, dy || 0));
      if (c.talk) T.talk(tl, id, c.talk[0], c.talk[1], c.mood || "smile");
    });
  }
  const show = (tl, sel, t) => { tl.set(sel, { opacity: 0 }, 0); tl.set(sel, { opacity: 1 }, t); };
  const pop = (tl, sel, t, from) => { show(tl, sel, t); tl.fromTo(sel, { scale: from == null ? 0.2 : from, transformOrigin: "50% 50%" }, { scale: 1, duration: T.d(0.45), ease: "back.out(1.6)", immediateRender: false }, t); };
  const slam = (tl, sel, t, C) => { show(tl, sel, t); tl.fromTo(sel, { scale: 2.6, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.22, ease: "power4.in", immediateRender: false }, t); if (C) C.shake(t + 0.22, 9); };
  const card = (w, h, fill, rx) => `<rect x="${-w / 2 + 14}" y="${-h / 2 + 16}" width="${w}" height="${h}" rx="${rx || 22}" fill="#000" opacity="0.22"/><rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" rx="${rx || 22}" fill="${fill}" stroke="${INK}" stroke-width="7"/>`;
  const txt = (s, x, y, fs, col, anchor) => `<text x="${x}" y="${y}" font-size="${fs}" fill="${col || INK}" text-anchor="${anchor || "middle"}">${esc(s)}</text>`;
  const fit = (s, fs, maxW) => Math.min(fs, maxW / Math.max(1, W(s, 1)));
  const fmt = (v, o) => (o.prefix || "") + (o.decimals ? v.toFixed(o.decimals) : Math.round(v).toLocaleString("en-US")) + (o.suffix || "");
  const mark = (m, s) => {
    const col = m === "✓" ? "#4a9e4f" : m === "✗" ? "#d8433b" : "#f2c14e";
    const glyph = m === "✓" ? `<path d="M${-s * 0.4},0 L${-s * 0.1},${s * 0.32} L${s * 0.45},${-s * 0.35}" fill="none" stroke="#fbfaf5" stroke-width="${s * 0.16}" stroke-linecap="round" stroke-linejoin="round"/>`
      : m === "✗" ? `<path d="M${-s * 0.32},${-s * 0.32} L${s * 0.32},${s * 0.32} M${s * 0.32},${-s * 0.32} L${-s * 0.32},${s * 0.32}" stroke="#fbfaf5" stroke-width="${s * 0.16}" stroke-linecap="round"/>`
      : txt(m, 0, s * 0.3, s * 0.9, INK);
    return `<circle r="${s * 0.62}" fill="${col}" stroke="${INK}" stroke-width="7"/>${glyph}`;
  };
  const counterTo = (tl, sel, o, from, to, t0, t1) => { const p = { v: from }; const el = q(sel); el.textContent = fmt(from, o); tl.fromTo(p, { v: from }, { v: to, duration: Math.max(0.1, t1 - t0), ease: "power2.out", onUpdate: () => (el.textContent = fmt(p.v, o)), immediateRender: false }, t0); };

  // ---------- scene types: svg(ctx) → string; build(tl, ctx, C) ----------
  const S = {};

  // paper document slides up; title + lines; stamp slams at t.stamp
  S.docStamp = {
    svg: ({ o, id }) => `<g transform="translate(${o.x || 1080},560) rotate(-3)"><g id="${id("doc")}">${card(860, 760, "#fbfaf5", 10)}
      <rect x="-430" y="-380" width="860" height="150" fill="${o.col || "#3d6fd1"}" stroke="${INK}" stroke-width="7"/>${txt(o.title, 0, -278, fit(o.title, 84, 760), "#fbfaf5")}
      ${(o.lines || ["", "", "", ""]).map((l, i) => l ? txt(l, -360, -140 + i * 92, 50, INK, "start") : `<path d="M-360,${-160 + i * 92} L${300 - (i % 2) * 140},${-160 + i * 92}" stroke="#c4bdb0" stroke-width="12" stroke-linecap="round"/>`).join("")}
      <g transform="translate(110,250) rotate(-12)"><g id="${id("stamp")}">${T.stamp(o.stamp || "CONFIRMED", o.stampCol || "#d8433b", fit(o.stamp || "CONFIRMED", 96, 560))}</g></g></g></g>`,
    build(tl, { o, id, t }, C) { tl.fromTo(`#${id("doc")}`, { y: 1100 }, { y: 0, duration: T.d(0.6), ease: "expo.out" }, t.in || 0.2); if (o.stamp !== false) slam(tl, `#${id("stamp")}`, t.stamp || 1.4, C); },
  };

  // big tear-off calendar; pages [[top,big,t], ...]; earlier pages tear off
  S.calFlip = {
    svg: ({ o, id }) => `<g transform="translate(${o.x || 1180},${o.y || 520})">${o.pages.slice().reverse().map((p, i) => `<g id="${id("pg" + (o.pages.length - 1 - i))}">${T.calendar(p[0], p[1], 440)}</g>`).join("")}</g>`,
    build(tl, { o, id }, C) {
      o.pages.forEach((p, i) => { if (i === 0) pop(tl, `#${id("pg0")}`, p[2] || 0.2, 0.3); else { show(tl, `#${id("pg" + i)}`, p[2] - 0.05); tl.to(`#${id("pg" + (i - 1))}`, { y: 900, rotation: 35, transformOrigin: "50% 0%", duration: T.d(0.5), ease: "power2.in" }, p[2]); } });
    },
  };

  // world map, fly to a city (pin + label card + optional flag); optional route plane from `from`
  S.mapTo = {
    svg: ({ o, id }) => { const P = T.pt(o.city), A = o.from ? T.pt(o.from) : null; return `<rect x="-2000" y="-2000" width="6000" height="5000" fill="#7ec8f0"/>${T.map({ prefix: id("m"), sw: 1.4, palette: ["#f2c14e", "#f6d98a", "#e8b04a", "#9fd36a", "#f2a65a"], highlight: o.highlight || {} })}
      ${A ? `<path id="${id("route")}" d="M${A[0]},${A[1]} Q${(A[0] + P[0]) / 2},${Math.min(A[1], P[1]) - 160} ${P[0]},${P[1]}" fill="none" stroke="#d8433b" stroke-width="5" stroke-dasharray="14 10" vector-effect="non-scaling-stroke"/>` : ""}
      <g transform="translate(${P[0]},${P[1]})"><g id="${id("pin")}"><path d="M0,0 C-14,-22 -20,-30 -20,-40 a20,20 0 1,1 40,0 C20,-30 14,-22 0,0Z" fill="#d8433b" stroke="${INK}" stroke-width="3"/><circle cy="-40" r="7" fill="#fbfaf5"/></g></g>`; },
    over: ({ o, id }) => { const f = FLAGS[o.flag], lw = Math.max(360, W(o.label || "", 70) + 80 + (f ? 170 : 0)); return `<g transform="translate(960,${o.labelY || 250})"><g id="${id("lab")}">${card(lw, 140, "#fbfaf5")}${f ? `<g transform="translate(${-lw / 2 + 30},-45)">${f(135)}</g>` : ""}${txt(o.label || "", f ? 80 : 0, 25, 70)}</g></g>`; },
    build(tl, { o, id, sid }, C) {
      const P = T.pt(o.city), A = o.from ? T.pt(o.from) : null, t = o.t || {};
      C.to(t.fly || 0.2, 1.6, { fx: P[0], fy: P[1], k: o.k || 3.2 }, "power2.inOut");
      if (A) { const L = q(`#${id("route")}`).getTotalLength(); tl.fromTo(`#${id("route")}`, { strokeDashoffset: L, strokeDasharray: `${L} ${L}` }, { strokeDashoffset: 0, duration: T.d(1.2), ease: "power1.inOut" }, t.fly || 0.2); }
      show(tl, `#${id("pin")}`, t.land || 1.6); tl.fromTo(`#${id("pin")}`, { y: -200 }, { y: 0, duration: T.d(0.45), ease: "bounce.out", immediateRender: false }, t.land || 1.6);
      if (o.label) pop(tl, `#${id("lab")}`, (t.land || 1.6) + 0.25);
    },
  };

  // two cards side by side; mark (✓ ✗ ≠ vs) between
  S.compare = {
    svg: ({ o, id }) => { const side = (c, x, k) => `<g transform="translate(${x},500) rotate(${k * 3})"><g id="${id(k < 0 ? "L" : "R")}">${card(640, 600, c.col || (k < 0 ? "#fbfaf5" : "#fbe2a0"))}
      <rect x="-320" y="-300" width="640" height="130" rx="22" fill="${c.head || (k < 0 ? "#3d6fd1" : "#b8332b")}" stroke="${INK}" stroke-width="7"/>${txt(c.title, 0, -212, fit(c.title, 72, 560), "#fbfaf5")}
      ${txt(c.value || "", 0, 60, fit(c.value || "", 150, 560))}${c.sub ? txt(c.sub, 0, 190, fit(c.sub, 56, 560), "#6b6658") : ""}
      ${c.mark ? `<g transform="translate(250,250)"><g id="${id(k < 0 ? "Lm" : "Rm")}">${mark(c.mark, 90)}</g></g>` : ""}</g></g>`;
      return side(o.left, 560, -1) + side(o.right, 1360, 1) + (o.mark ? `<g transform="translate(960,520)"><g id="${id("mk")}">${mark(o.mark, 140)}</g></g>` : ""); },
    build(tl, { o, id }, C) {
      const t = o.t || {};
      tl.fromTo(`#${id("L")}`, { x: -1300 }, { x: 0, duration: T.d(0.55), ease: "expo.out" }, t.l || 0.2);
      tl.fromTo(`#${id("R")}`, { x: 1300 }, { x: 0, duration: T.d(0.55), ease: "expo.out" }, t.r || 0.6);
      if (o.left.mark) pop(tl, `#${id("Lm")}`, t.lm || (t.l || 0.2) + 0.6);
      if (o.right.mark) pop(tl, `#${id("Rm")}`, t.rm || (t.r || 0.6) + 0.6);
      if (o.mark) slam(tl, `#${id("mk")}`, t.mark || 1.4, C);
    },
  };

  // big number counts up on a board; optional label + progress bar
  S.counter = {
    svg: ({ o, id }) => `<g transform="translate(${o.x || 1060},${o.y || 470})"><g id="${id("bd")}">${card(1100, 560, o.card || "#fbfaf5")}
      ${o.title ? `<rect x="-550" y="-280" width="1100" height="120" rx="22" fill="${o.head || "#2f3e5c"}" stroke="${INK}" stroke-width="7"/>${txt(o.title, 0, -198, fit(o.title, 70, 1000), "#fbfaf5")}` : ""}
      <text id="${id("num")}" x="0" y="${o.title ? 70 : 40}" font-size="${o.fs || 190}" fill="${o.numCol || INK}" text-anchor="middle">0</text>
      ${o.label ? txt(o.label, 0, 200, fit(o.label, 60, 1000), "#6b6658") : ""}
      ${o.tag ? `<g transform="translate(420,-300) rotate(10)"><g id="${id("tag")}">${T.stamp(o.tag, o.tagCol || "#d8433b", 60)}</g></g>` : ""}</g></g>`,
    build(tl, { o, id }, C) {
      const t = o.t || {};
      tl.fromTo(`#${id("bd")}`, { y: -1100 }, { y: 0, duration: T.d(0.55), ease: "back.out(1.3)" }, t.in || 0.15);
      counterTo(tl, `#${id("num")}`, o, o.from || 0, o.to, t.count || 0.6, t.end || 2.2);
      tl.fromTo(`#${id("num")}`, { scale: 1 }, { scale: 1.12, transformOrigin: "50% 50%", duration: 0.12, yoyo: true, repeat: 1, immediateRender: false }, t.end || 2.2);
      if (o.tag) slam(tl, `#${id("tag")}`, t.tag || (t.end || 2.2) + 0.3, C);
    },
  };

  // bar chart; bars [{label,val,col,t,text}]
  S.barTo = {
    svg: ({ o, id }) => { const n = o.bars.length, bw = Math.min(260, 1300 / n - 60), x0 = 960 - ((n - 1) * (bw + 80)) / 2, max = o.max || Math.max(...o.bars.map((b) => b.val));
      return `<g>${card(1500, 820, "#fbfaf5")}</g>`.replace("<g>", `<g transform="translate(960,520)">`) + (o.title ? txt(o.title, 960, 200, fit(o.title, 70, 1300)) : "") + `<path d="M${x0 - bw},880 L${x0 + (n - 1) * (bw + 80) + bw},880" stroke="${INK}" stroke-width="7"/>` +
        o.bars.map((b, i) => { const x = x0 + i * (bw + 80), h = (b.val / max) * 560; return `<g transform="translate(${x},880)"><g id="${id("b" + i)}"><rect x="${-bw / 2}" y="${-h}" width="${bw}" height="${h}" fill="${b.col || SHIRTS[i]}" stroke="${INK}" stroke-width="6"/></g>${txt(b.label, 0, 70, fit(b.label, 50, bw + 70))}<text id="${id("v" + i)}" x="0" y="${-h - 24}" font-size="64" fill="${INK}" text-anchor="middle">${esc(b.text || fmt(b.val, o))}</text></g>`; }).join(""); },
    build(tl, { o, id }) { o.bars.forEach((b, i) => { const t = b.t == null ? 0.4 + i * 0.5 : b.t; tl.fromTo(`#${id("b" + i)}`, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: T.d(0.7), ease: "expo.out" }, t); show(tl, `#${id("v" + i)}`, t + 0.4); }); },
  };

  // office: desk, empty chair behind, nameplate drops on desk; optional "?" above chair
  S.deskPlate = {
    svg: ({ o, id }) => `<g transform="translate(960,620)"><path d="M-170,-320 L170,-320 L150,40 L-150,40Z" fill="${o.chair || "#2f3e5c"}" stroke="${INK}" stroke-width="7"/><rect x="-200" y="20" width="400" height="60" rx="14" fill="${o.chair || "#2f3e5c"}" stroke="${INK}" stroke-width="7"/></g>
      ${o.q ? `<g transform="translate(960,190)"><g id="${id("q")}">${T.bubble(o.q, 90, "#d8433b", -40, 120)}</g></g>` : ""}
      <rect x="140" y="700" width="1640" height="70" fill="#8a5a35" stroke="${INK}" stroke-width="7"/><rect x="200" y="770" width="1520" height="320" fill="#6e4429" stroke="${INK}" stroke-width="7"/>
      <g transform="translate(1440,700)"><rect x="-60" y="-110" width="120" height="110" fill="#fbfaf5" stroke="${INK}" stroke-width="5"/><path d="M-60,-110 L-30,-150 L90,-150 L60,-110" fill="#f2c14e" stroke="${INK}" stroke-width="5"/></g>
      <g transform="translate(560,700)"><rect x="-90" y="-26" width="180" height="26" fill="#3d6fd1" stroke="${INK}" stroke-width="5"/><rect x="-80" y="-50" width="160" height="26" fill="#e07b39" stroke="${INK}" stroke-width="5"/></g>
      <g transform="translate(960,702)"><g id="${id("np")}">${T.nameplate(o.plate, Math.max(420, W(o.plate, 60) + 120), 60)}</g></g>`,
    build(tl, { o, id }, C) { const t = o.t || {}; show(tl, `#${id("np")}`, t.in || 0.4); tl.fromTo(`#${id("np")}`, { y: -800 }, { y: 0, duration: T.d(0.45), ease: "bounce.out", immediateRender: false }, t.in || 0.4); if (o.q) pop(tl, `#${id("q")}`, t.q || 1.5); },
  };

  // big building with sign and flag; windows light up
  S.building = {
    svg: ({ o, id }) => { const r = T.rng(5); let w = ""; for (let y = 330; y < 880; y += 90) for (let x = 680; x < 1220; x += 90) w += `<rect class="${id("w")}" x="${x}" y="${y}" width="50" height="60" fill="#2f3e5c" stroke="${INK}" stroke-width="4"/>`;
      const f = FLAGS[o.flag]; return `<rect x="610" y="260" width="700" height="640" fill="${o.col || "#e9e2d0"}" stroke="${INK}" stroke-width="8"/>${w}<rect x="900" y="770" width="120" height="130" fill="#8a5a35" stroke="${INK}" stroke-width="6"/>
      <g transform="translate(960,230)"><g id="${id("sign")}">${card(Math.max(520, W(o.sign, 76) + 100), 130, "#fbfaf5")}${txt(o.sign, 0, 26, 76)}</g></g>
      ${f ? `<path d="M1420,900 L1420,300" stroke="${INK}" stroke-width="10"/><g transform="translate(1425,305)"><g id="${id("flag")}">${f(240)}</g></g>` : ""}`; },
    build(tl, { o, id }, C) { const t = o.t || {}; tl.fromTo(`.${id("w")}`, { fill: "#2f3e5c" }, { fill: "#f2c14e", duration: 0.05, stagger: { each: 0.03, from: "random" } }, t.lights || 0.4); pop(tl, `#${id("sign")}`, t.sign || 0.3); if (o.flag) tl.fromTo(`#${id("flag")}`, { skewY: -3, transformOrigin: "0% 50%" }, { skewY: 3, duration: 0.6, yoyo: true, repeat: 8, ease: "sine.inOut" }, 0); },
  };

  // row of 5 characters reacting at t.react (mood), optional sign held above
  S.reactRow = {
    svg: ({ o, sid }) => { const n = o.n || 5, r = T.rng(o.seed || 9); return Array.from({ length: n }, (_, i) => T.char({ id: `${sid}-r${i}`, x: 260 + i * (1400 / (n - 1)), y: 1010, scale: 1.5, face: (i - (n - 1) / 2) * -0.3, shirt: SHIRTS[(i * 3 + (o.seed || 0)) % 8], skin: SKINS[Math.floor(r() * 5)], hair: HAIRS[Math.floor(r() * 6)], hairCol: ["#2a1d18", "#5a3a22", "#1d1d1d", "#b5651d"][i % 4] })).join("") +
      (o.sign ? `<g transform="translate(960,250)"><g id="${sid}-sign">${card(Math.max(600, W(o.sign, 90) + 120), 170, "#fbfaf5")}${txt(o.sign, 0, 32, 90, o.signCol)}</g></g>` : ""); },
    build(tl, { o, sid }, C) { const n = o.n || 5, t = o.t || {}; for (let i = 0; i < n; i++) { const c = `${sid}-r${i}`; T.armSet(tl, c, "l", 10); T.armSet(tl, c, "r", -10); T.idle(tl, c, i * 0.1, 30, 1); T.blink(tl, c, [0.7 + i * 0.3, 2.9 + i * 0.2]); T.mood(tl, c, (t.react || 1) + i * 0.06, o.mood || "shock"); T.brows(tl, c, (t.react || 1) + i * 0.06, o.brows || "up"); if (o.arms) { T.armTo(tl, c, "l", 130, (t.react || 1) + i * 0.06, 0.25); T.armTo(tl, c, "r", -130, (t.react || 1) + i * 0.06, 0.25); } } if (o.sign) pop(tl, `#${sid}-sign`, t.sign || 0.4); },
  };

  // clipboard/board with title; items [{text,t,mark}] drop in
  S.dropList = {
    svg: ({ o, id }) => `<g transform="translate(${o.x || 1100},540) rotate(2)"><g id="${id("bd")}">${card(980, 860, o.card || "#fbfaf5", 16)}<rect x="-150" y="-460" width="300" height="70" rx="16" fill="#8a8a8a" stroke="${INK}" stroke-width="6"/>
      ${txt(o.title || "", 0, -310, fit(o.title || "", 80, 880))}<path d="M-420,-280 L420,-280" stroke="${INK}" stroke-width="5"/>
      ${o.items.map((it, i) => `<g transform="translate(0,${-170 + i * (620 / o.items.length)})"><g id="${id("i" + i)}"><g transform="translate(-370,-20)">${mark(it.mark || "✓", 44)}</g>${txt(it.text, -300, 0, fit(it.text, 66, 700), INK, "start")}</g></g>`).join("")}</g></g>`,
    build(tl, { o, id }) { tl.fromTo(`#${id("bd")}`, { y: 1100 }, { y: 0, duration: T.d(0.55), ease: "expo.out" }, o.tIn || 0.15); o.items.forEach((it, i) => { show(tl, `#${id("i" + i)}`, it.t); tl.fromTo(`#${id("i" + i)}`, { x: 700 }, { x: 0, duration: T.d(0.35), ease: "back.out(1.4)", immediateRender: false }, it.t); }); },
  };

  // label / bubble / sign / stamp pops at t (on any bg, usually with chars)
  S.pop = {
    svg: ({ o, id }) => (o.items || []).map((p, i) => { const x = p.x || 1200, y = p.y || 300, fs = p.fs || 90;
      const body = p.style === "bubble" ? T.bubble(p.text, fs, p.col, p.tx, p.ty) : p.style === "stamp" ? T.stamp(p.text, p.col || "#d8433b", fs) : card(W(p.text, fs) + 110, fs * 1.9, p.card || "#fbfaf5") + txt(p.text, 0, fs * 0.35, fs, p.col);
      return `<g transform="translate(${x},${y}) rotate(${p.rot || 0})"><g id="${id("p" + i)}">${body}</g></g>`; }).join(""),
    build(tl, { o, id }, C) { (o.items || []).forEach((p, i) => (p.style === "stamp" ? slam(tl, `#${id("p" + i)}`, p.t, C) : pop(tl, `#${id("p" + i)}`, p.t))); },
  };

  // stock-style line chart on a screen; pts [[x0..1,y0..1],...] drawn t0→t1; optional marker label at the last point
  S.lineChart = {
    svg: ({ o, id }) => { const X = (v) => 360 + v * 1200, Y = (v) => 820 - v * 560, d = o.pts.map((p, i) => (i ? "L" : "M") + X(p[0]).toFixed(0) + "," + Y(p[1]).toFixed(0)).join(" "), L = o.pts[o.pts.length - 1];
      return `<g transform="translate(960,520)">${card(1520, 880, "#1f2a5c", 26)}</g>${o.title ? txt(o.title, 960, 190, fit(o.title, 70, 1300), "#fbfaf5") : ""}
      <g stroke="#3b4a86" stroke-width="3">${[0, 1, 2, 3, 4].map((i) => `<path d="M360,${260 + i * 140} L1560,${260 + i * 140}"/>`).join("")}</g>
      <path id="${id("ln")}" d="${d}" fill="none" stroke="${o.col || "#7cc242"}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
      <g transform="translate(${X(L[0])},${Y(L[1])})"><g id="${id("dot")}"><circle r="22" fill="${o.col || "#7cc242"}" stroke="${INK}" stroke-width="5"/></g>
      ${o.label ? `<g transform="translate(${o.labelDx || -220},${o.labelDy || -120})"><g id="${id("lab")}">${card(W(o.label, 64) + 90, 120, "#fbfaf5")}${txt(o.label, 0, 22, 64, o.labelCol)}</g></g>` : ""}</g>`; },
    build(tl, { o, id }) { const t = o.t || {}, L = q(`#${id("ln")}`).getTotalLength(); tl.fromTo(`#${id("ln")}`, { strokeDasharray: `${L} ${L}`, strokeDashoffset: L }, { strokeDashoffset: 0, duration: Math.max(0.3, (t.end || 2) - (t.draw || 0.3)), ease: "power1.inOut" }, t.draw || 0.3); pop(tl, `#${id("dot")}`, t.end || 2); if (o.label) pop(tl, `#${id("lab")}`, t.label || (t.end || 2) + 0.2); },
  };

  // yellow notepad, yellow highlighter sweeps each line at t.lines[i]
  S.highlightNote = {
    svg: ({ o, id }) => `<g transform="translate(${o.x || 960},540) rotate(-3)"><g id="${id("pad")}">${card(760, 820, "#fbe36a", 10)}
      <rect x="-380" y="-410" width="760" height="70" fill="#b8443b" stroke="${INK}" stroke-width="7"/>
      ${(o.lines || []).map((l, i) => `<rect id="${id("hl" + i)}" x="-330" y="${-250 + i * 130 - 44}" width="${W(l, 56) + 30}" height="64" fill="#fff35c" opacity="0.9" transform-origin="-330 0"/>` + txt(l, -320, -250 + i * 130, 56, INK, "start")).join("")}</g></g>`,
    build(tl, { o, id, t }) { tl.fromTo(`#${id("pad")}`, { y: 1100, rotation: 8 }, { y: 0, rotation: 0, duration: T.d(0.6), ease: "expo.out" }, t.in || 0.2);
      (o.lines || []).forEach((l, i) => tl.fromTo(`#${id("hl" + i)}`, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: T.d(0.5), ease: "power2.inOut" }, (t.lines || [])[i] == null ? 1 + i * 0.7 : t.lines[i])); },
  };
  // glowing ID cards on a desk; they go dark one by one; counter label updates ("3 JOBS" → "0 JOBS")
  S.dimCards = {
    svg: ({ o, id }) => { const cs = o.cards || [["LEON", "#fbfaf5"], ["CTO", "#d23a2e"], ["CEO", "#d23a2e"]];
      return `<rect x="-400" y="640" width="2720" height="500" fill="#7a4a2a"/><path d="M-400,640 L2320,640" stroke="${INK}" stroke-width="7"/>` + cs.map((c, i) => { const x = 960 + (i - (cs.length - 1) / 2) * 330;
        return `<g transform="translate(${x},620)"><g id="${id("c" + i)}">${card(260, 340, c[1], 18)}${txt(c[0], 0, 120, 56, c[1] === "#fbfaf5" ? INK : "#fbfaf5")}<circle cx="0" cy="-30" r="64" fill="#f1c8a0" stroke="${INK}" stroke-width="6"/></g><rect id="${id("d" + i)}" x="-130" y="-170" width="260" height="340" rx="18" fill="#000" opacity="0"/></g>`; }).join("")
        + `<g transform="translate(300,160)"><g id="${id("lab")}">${card(300, 110, "#fbfaf5")}<text id="${id("labt")}" x="0" y="22" font-size="64" fill="${INK}" text-anchor="middle">${esc(o.label || cs.length + " JOBS")}</text></g></g>`; },
    build(tl, { o, id, t }) { const n = (o.cards || [0, 0, 0]).length; pop(tl, `#${id("lab")}`, 0.3);
      (t.dim || []).forEach((tt, i) => { tl.to(`#${id("d" + (n - 1 - i))}`, { opacity: 0.7, duration: T.d(0.4) }, tt); tl.to(`#${id("c" + (n - 1 - i))}`, { y: 10, duration: T.d(0.3) }, tt);
        tl.set(`#${id("labt")}`, { textContent: (n - 1 - i) + (n - 1 - i === 1 ? " JOB" : " JOBS") }, tt + 0.1); }); },
  };
  // stage: spotlight on a podium, confetti, a date sign drops in
  S.spotlight = {
    svg: ({ o, id }) => `<rect x="-400" y="-400" width="2720" height="1880" fill="#0e1330"/><path id="${id("beam")}" d="M780,-40 L1140,-40 L1400,880 L520,880Z" fill="#fff6c0" opacity="0"/>
      <rect x="860" y="560" width="200" height="320" fill="#3a3f55" stroke="${INK}" stroke-width="7"/><rect x="840" y="540" width="240" height="40" fill="#e0405a" stroke="${INK}" stroke-width="6"/>
      <g id="${id("sign")}" transform="translate(960,200)">${card(520, 150, "#fbfaf5")}${txt(o.date || "NOV 2025", 0, 24, 80)}</g>
      <g id="${id("conf")}">${Array.from({ length: 36 }, (_, i) => `<rect class="${id("cf")}" x="${300 + (i * 97) % 1320}" y="-60" width="16" height="26" fill="${SHIRTS[i % 8]}"/>`).join("")}</g>`,
    build(tl, { o, id, t }) { tl.to(`#${id("beam")}`, { opacity: 0.35, duration: T.d(0.8) }, t.light || 0.3); tl.fromTo(`#${id("sign")}`, { y: -300 }, { y: 200, duration: T.d(0.55), ease: "bounce.out" }, t.sign || 1.2);
      document.querySelectorAll(`.${id("cf")}`).forEach((el, i) => tl.to(el, { y: 1200, rotation: 360 + i * 20, duration: 2.2 + (i % 5) * 0.2, ease: "none" }, (t.sign || 1.2) + (i % 9) * 0.08)); },
  };

  // ---------- brand kit: palette + simplified stylised icons (not traced logos) ----------
  const GC = { b: "#4285f4", r: "#ea4335", y: "#fbbc05", g: "#34a853" }, GCOLS = [GC.b, GC.r, GC.y, GC.g];
  const arc = (a0, a1, R) => { const P = (a) => `${(R * Math.cos(a * Math.PI / 180)).toFixed(1)},${(R * Math.sin(a * Math.PI / 180)).toFixed(1)}`; return `M${P(a0)} A${R},${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${P(a1)}`; };
  const ICONS = {
    gmark: (z = 1) => `<g transform="scale(${z})"><circle r="62" fill="#fff" stroke="${INK}" stroke-width="6"/><g fill="none" stroke-width="16">
      <path d="${arc(-150, -50, 34)}" stroke="${GC.r}"/><path d="${arc(-230, -150, 34)}" stroke="${GC.y}"/><path d="${arc(40, 130, 34)}" stroke="${GC.g}"/><path d="${arc(-50, 40, 34)}" stroke="${GC.b}"/></g><rect x="2" y="-8" width="36" height="16" fill="${GC.b}"/></g>`,
    dots4: (z = 1) => `<g transform="scale(${z})">${GCOLS.map((c, i) => `<circle cx="${(i - 1.5) * 30}" cy="0" r="11" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join("")}</g>`,
    chip: (z = 1) => `<g transform="scale(${z})">${[-40, -14, 14, 40].map((v) => `<path d="M${v},-70 L${v},70 M-70,${v} L70,${v}" stroke="${INK}" stroke-width="6"/>`).join("")}<rect x="-52" y="-52" width="104" height="104" rx="12" fill="#2b3a55" stroke="${INK}" stroke-width="7"/><rect x="-28" y="-28" width="56" height="56" rx="6" fill="${GC.b}" stroke="${INK}" stroke-width="4"/><text y="14" font-size="40" fill="#fff" text-anchor="middle">TPU</text></g>`,
    server: (z = 1) => `<g transform="scale(${z})"><rect x="-60" y="-90" width="120" height="180" rx="10" fill="#2b3a55" stroke="${INK}" stroke-width="7"/>${[0, 1, 2, 3].map((i) => `<rect x="-48" y="${-78 + i * 42}" width="96" height="30" rx="5" fill="#1b2438" stroke="${INK}" stroke-width="3"/><circle cx="-34" cy="${-63 + i * 42}" r="5" fill="${GCOLS[i]}"/><path d="M-14,${-63 + i * 42} L38,${-63 + i * 42}" stroke="#5d6f93" stroke-width="5"/>`).join("")}</g>`,
    cloud: (z = 1) => `<g transform="scale(${z})"><path d="M-80,40 a50,50 0 0,1 10,-86 a60,60 0 0,1 110,-14 a52,52 0 0,1 50,100 Z" fill="#fff" stroke="${INK}" stroke-width="7"/><circle cx="-22" cy="-6" r="6" fill="${INK}"/><circle cx="22" cy="-6" r="6" fill="${INK}"/><path d="M-14,12 Q0,26 14,12" stroke="${INK}" stroke-width="5" fill="none"/><circle cx="-44" cy="8" r="9" fill="#f6a5b5" opacity="0.8"/><circle cx="44" cy="8" r="9" fill="#f6a5b5" opacity="0.8"/></g>`,
    badge: (z = 1, name = "LEON") => `<g transform="scale(${z})"><rect x="-60" y="-90" width="120" height="180" rx="12" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-60,-62 L60,-62" stroke="${INK}" stroke-width="4"/>${GCOLS.map((c, i) => `<rect x="${-60 + i * 30}" y="-90" width="30" height="14" fill="${c}"/>`).join("")}<circle cy="-8" r="30" fill="#f1c8a0" stroke="${INK}" stroke-width="5"/><text y="62" font-size="30" fill="${INK}" text-anchor="middle">${esc(name)}</text></g>`,
    search: (z = 1, q = "search…") => `<g transform="scale(${z})"><rect x="-190" y="-38" width="380" height="76" rx="38" fill="#fff" stroke="${INK}" stroke-width="6"/><circle cx="-150" cy="0" r="14" fill="none" stroke="${GC.b}" stroke-width="6"/><path d="M-140,10 L-126,24" stroke="${GC.b}" stroke-width="6"/><text x="-100" y="14" font-size="38" fill="#6b6658">${esc(q)}</text></g>`,
    mug: (z = 1) => `<g transform="scale(${z})"><rect x="-40" y="-45" width="80" height="90" rx="8" fill="${GC.r}" stroke="${INK}" stroke-width="6"/><path d="M40,-20 a24,24 0 0,1 0,50" fill="none" stroke="${INK}" stroke-width="7"/><path d="M-40,-10 L40,-10" stroke="${GC.y}" stroke-width="10"/></g>`,
    balloon: (z = 1, c) => `<g transform="scale(${z})"><ellipse cy="-30" rx="42" ry="52" fill="${c || GC.r}" stroke="${INK}" stroke-width="6"/><path d="M0,22 Q-12,60 4,100" fill="none" stroke="${INK}" stroke-width="4"/></g>`,
    bunting: (w = 900) => `<path d="M0,0 Q${w / 2},60 ${w},0" fill="none" stroke="${INK}" stroke-width="5"/>${Array.from({ length: 10 }, (_, i) => { const x = (i + 0.5) * w / 10, y = 60 * Math.sin(Math.PI * (i + 0.5) / 10) + 4; return `<path d="M${x - 26},${y} L${x + 26},${y} L${x},${y + 56}Z" fill="${GCOLS[i % 4]}" stroke="${INK}" stroke-width="4"/>`; }).join("")}`,
    rainbow: (w = 3000, h = 14) => GCOLS.map((c, i) => `<rect x="-500" y="${i * h}" width="${w}" height="${h}" fill="${c}"/>`).join(""),
  };
  // theme decor drawn over the background, behind characters
  const THEMES = { google: () => `<g opacity="0.95"><g transform="translate(0,560)">${ICONS.rainbow()}</g><g transform="translate(40,60)">${ICONS.bunting(1840)}</g><g transform="translate(1800,150)">${ICONS.balloon(1, GC.y)}</g><g transform="translate(1690,170)">${ICONS.balloon(0.8, GC.g)}</g></g><g transform="translate(1810,990)">${ICONS.dots4(1)}</g>` };

  // icons popping in as a labelled row: items [{icon,label,t,arg}]
  S.iconRow = {
    svg: ({ o, id }) => { const it = o.items || [], n = it.length; return it.map((p, i) => { const x = 960 + (i - (n - 1) / 2) * 400;
      return `<g transform="translate(${x},${o.y || 480})"><g id="${id("i" + i)}"><g transform="scale(2.1)">${(ICONS[p.icon] || ICONS.gmark)(1, p.arg)}</g></g><g id="${id("l" + i)}" transform="translate(0,${o.ly || 300})">${card(W(p.label, 56) + 80, 100, "#fbfaf5")}${txt(p.label, 0, 20, 56)}</g></g>`; }).join(""); },
    build(tl, { o, id }) { (o.items || []).forEach((p, i) => { pop(tl, `#${id("i" + i)}`, p.t == null ? 0.5 + i * 0.7 : p.t); pop(tl, `#${id("l" + i)}`, (p.t == null ? 0.5 + i * 0.7 : p.t) + 0.2); }); },
  };

  // ---------- rich layered environments: gradients, glow, depth layers (far / mid), vignette ----------
  const DEFS = `<defs>
    <linearGradient id="rb-wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7e3b8"/><stop offset="1" stop-color="#e2b97c"/></linearGradient>
    <linearGradient id="rb-night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121b52"/><stop offset="1" stop-color="#3a58b4"/></linearGradient>
    <linearGradient id="rb-dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ee7d2e"/><stop offset="0.55" stop-color="#f7b64e"/><stop offset="1" stop-color="#ffe49a"/></linearGradient>
    <linearGradient id="rb-day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#46a9ee"/><stop offset="1" stop-color="#dcf2ff"/></linearGradient>
    <linearGradient id="rb-floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4d4953"/><stop offset="1" stop-color="#26232b"/></linearGradient>
    <linearGradient id="rb-dirt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d89c58"/><stop offset="1" stop-color="#9a6030"/></linearGradient>
    <linearGradient id="rb-hall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1230"/><stop offset="1" stop-color="#1f3466"/></linearGradient>
    <radialGradient id="rb-glow"><stop offset="0" stop-color="#fff3b8" stop-opacity="0.95"/><stop offset="1" stop-color="#fff3b8" stop-opacity="0"/></radialGradient>
    <radialGradient id="rb-vig" cx="0.5" cy="0.5" r="0.78"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.5"/></radialGradient>
  </defs>`;
  const FULL = (f) => `<rect x="-400" y="-400" width="2720" height="1880" fill="${f}"/>`;
  const R_ = (x, y, w, h, f, sw, rx) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx || 0}" fill="${f}" stroke="${INK}" stroke-width="${sw == null ? 5 : sw}"/>`;
  const softCloud = (x, y, k, tint) => { const c = [[0, 0, 70], [80, -30, 86], [170, -4, 74], [240, 14, 52], [-60, 20, 50]]; const mk = (dx, dy, f, sw) => c.map(([cx, cy, r]) => `<circle cx="${cx + dx}" cy="${cy + dy}" r="${r}" fill="${f}" ${sw ? `stroke="${INK}" stroke-width="3"` : ""}/>`).join("");
    return `<g transform="translate(${x},${y}) scale(${k})">${mk(8, 14, tint || "#cbe5f6")}${mk(0, 0, "#fff", true)}${mk(0, 0, "#fff")}</g>`; };
  const treeBlob = (x, y, k) => `<g transform="translate(${x},${y}) scale(${k})"><rect x="-10" y="40" width="20" height="120" fill="#7a5a3a" stroke="${INK}" stroke-width="4"/>${[[0, 0, 70, "#5fcf53"], [-48, 30, 50, "#52bd48"], [52, 26, 54, "#52bd48"]].map(([a, b, r, f]) => `<circle cx="${a}" cy="${b}" r="${r}" fill="${f}" stroke="${INK}" stroke-width="4"/>`).join("")}<circle cx="-14" cy="-22" r="26" fill="#8be474" opacity="0.8"/></g>`;
  const tiles = (y) => `<rect x="-400" y="${y}" width="2720" height="${1100 - y}" fill="url(#rb-floor)"/><path d="M-400,${y} L2320,${y}" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 24 }, (_, i) => `<path d="M${-400 + i * 140},${y} L${-400 + i * 140 - (i - 10) * 36},1100" stroke="#1a1820" stroke-width="3" opacity="0.6"/>`).join("") + `<path d="M-400,${y + 46} L2320,${y + 46} M-400,${y + 110} L2320,${y + 110}" stroke="#1a1820" stroke-width="3" opacity="0.6"/>`;
  const RICH = {
    officeNight: () => ({
      far: FULL("url(#rb-wall)") + `<g>${R_(1090, 40, 830, 480, "url(#rb-night)", 10)}<circle cx="1760" cy="150" r="46" fill="#f8efc0"/><rect x="1090" y="400" width="830" height="120" fill="#27553a"/>${treeBlob(1260, 250, 1.1)}${treeBlob(1520, 300, 0.9)}${treeBlob(1790, 240, 1.2)}<path d="M1500,40 L1500,520 M1090,280 L1920,280" stroke="#f5f1e6" stroke-width="12"/><rect x="1070" y="510" width="870" height="26" fill="#f5f1e6" stroke="${INK}" stroke-width="5"/></g>`
        + `<rect x="-400" y="560" width="2720" height="14" fill="#4285f4"/><rect x="-400" y="574" width="2720" height="14" fill="#ea4335"/><rect x="-400" y="588" width="2720" height="14" fill="#fbbc05"/><rect x="-400" y="602" width="2720" height="14" fill="#34a853"/><path d="M-400,560 L2320,560 M-400,616 L2320,616" stroke="${INK}" stroke-width="3"/>`
        + `<g>${R_(505, 95, 460, 905, "#9cb8bd", 12)}<rect x="528" y="118" width="414" height="860" fill="#b9d3d6" opacity="0.7"/><path d="M570,185 L690,400 M615,185 L735,400" stroke="#e8f2f2" stroke-width="12" stroke-linecap="round" opacity="0.7"/><g transform="translate(735,385) scale(0.9)">${ICONS.gmark(1)}</g></g>`
        + `<circle cx="960" cy="520" r="760" fill="url(#rb-glow)" opacity="0.45"/>`,
      mid: `<g>${R_(445, 295, 62, 710, "#f4f2ee", 6)}<circle cx="476" cy="395" r="11" fill="#4285f4"/><circle cx="476" cy="460" r="11" fill="#fbbc05"/></g>`
        + `<g>${R_(0, 650, 440, 350, "#3a62a8", 6)}<path d="M220,650 L220,1000" stroke="${INK}" stroke-width="5"/><rect x="24" y="722" width="72" height="14" rx="7" fill="#c8d4ea"/><rect x="266" y="722" width="72" height="14" rx="7" fill="#c8d4ea"/>${R_(108, 445, 328, 205, "#e9e7e2", 7, 16)}<rect x="132" y="470" width="215" height="155" rx="8" fill="#26262c" stroke="${INK}" stroke-width="5"/><ellipse cx="240" cy="590" rx="90" ry="14" fill="#cfcac0"/><rect x="170" y="545" width="140" height="48" rx="24" fill="#e2b872" stroke="${INK}" stroke-width="4"/><rect x="362" y="474" width="64" height="70" rx="6" fill="#d6d3cc" stroke="${INK}" stroke-width="4"/><text x="394" y="522" font-size="26" fill="#5af07a" text-anchor="middle">12:00</text></g>`
        + `<g>${R_(1075, 722, 475, 22, "#f1f1ee", 6)}<path d="M1100,744 L1100,1000 M1525,744 L1525,1000" stroke="${INK}" stroke-width="8"/>${R_(1320, 564, 90, 160, "#e5e5e5", 5, 6)}${R_(1600, 722, 340, 22, "#f1f1ee", 6)}${R_(1745, 566, 150, 150, "#f4f4f4", 5, 6)}<path d="M1765,610 L1870,610 M1765,640 L1850,640" stroke="#ea4335" stroke-width="8"/><path d="M1765,670 L1860,670" stroke="#9aa" stroke-width="8"/>${R_(1425, 650, 40, 72, "#ea4335", 5)}<ellipse cx="1190" cy="920" rx="62" ry="22" fill="#4285f4" stroke="${INK}" stroke-width="5"/><path d="M1190,935 L1190,1000" stroke="${INK}" stroke-width="7"/><ellipse cx="1710" cy="920" rx="62" ry="22" fill="#ea4335" stroke="${INK}" stroke-width="5"/><path d="M1710,935 L1710,1000" stroke="${INK}" stroke-width="7"/></g>`
        + `<g transform="translate(1840,990)"><path d="M-60,-70 L60,-70 L44,0 L-44,0Z" fill="#c4643a" stroke="${INK}" stroke-width="5"/><path d="M0,-70 C-90,-190 -40,-250 0,-130 C30,-260 100,-190 0,-70" fill="#4a9e4f" stroke="${INK}" stroke-width="5"/></g>` + tiles(990),
    }),
    dayCloud: () => ({
      far: FULL("url(#rb-day)") + `<circle cx="1580" cy="170" r="520" fill="url(#rb-glow)" opacity="0.8"/><circle cx="1580" cy="170" r="70" fill="#fff6b0" stroke="#f4c542" stroke-width="6"/>` + softCloud(120, 220, 0.9) + softCloud(900, 110, 0.7) + softCloud(1380, 330, 1.1) + softCloud(500, 420, 0.6, "#d9ecf8") + `<path d="M300,150 q15,-18 30,0 q15,-18 30,0 M1100,300 q12,-14 24,0 q12,-14 24,0 M1660,80 q10,-12 20,0 q10,-12 20,0" stroke="${INK}" stroke-width="4" fill="none"/>`,
      mid: "",
    }),
    buildSite: (seed) => { const r = T.rng(seed || 7); let far = "", near = ""; let x = -380; while (x < 2300) { const w = 110 + r() * 130, h = 140 + r() * 260; far += `<rect x="${x}" y="${760 - h}" width="${w}" height="${h + 200}" fill="#c0728a" opacity="0.85"/>`; x += w - 10; } x = -380; while (x < 2300) { const w = 150 + r() * 150, h = 110 + r() * 180; near += `<rect x="${x}" y="${790 - h}" width="${w}" height="${h + 200}" fill="#7e4a74"/>`; x += w + 6; }
      return { far: FULL("url(#rb-dusk)") + `<circle cx="1450" cy="520" r="700" fill="url(#rb-glow)"/><circle cx="1450" cy="520" r="120" fill="#fff2b0"/>` + softCloud(160, 240, 0.9, "#f7c98a") + softCloud(1100, 150, 0.8, "#f7c98a") + softCloud(1560, 330, 0.7, "#f7c98a") + far + near
        + `<g stroke="${INK}" stroke-width="5" fill="none"><path d="M600,780 L600,260 M680,780 L680,260 M600,260 L640,200 L680,260 M600,320 L680,380 M680,320 L600,380 M600,440 L680,500 M680,440 L600,500 M600,560 L680,620 M680,560 L600,620 M640,200 L640,120 M500,270 L1000,270 M1000,270 L1000,340"/></g><rect x="980" y="340" width="40" height="40" fill="#9a9a9a" stroke="${INK}" stroke-width="4"/>`,
        mid: `<rect x="-400" y="780" width="2720" height="400" fill="url(#rb-dirt)"/><path d="M-400,780 L2320,780" stroke="${INK}" stroke-width="6"/>` + `<g>${[560, 660, 760, 860, 960, 1060, 1160, 1260, 1360].map((px) => `<path d="M${px},540 L${px},800" stroke="#e5622d" stroke-width="14"/>`).join("")}<path d="M540,560 L1380,560 M540,680 L1380,680" stroke="#e5622d" stroke-width="14"/>${[560, 760, 960, 1160].map((px) => `<path d="M${px},560 L${px + 100},680 M${px + 100},560 L${px},680" stroke="#c4501f" stroke-width="8"/>`).join("")}${R_(560, 690, 800, 100, "#1c2540", 6)}${Array.from({ length: 16 }, (_, i) => `<circle cx="${590 + i * 48}" cy="${720 + (i % 2) * 40}" r="5" fill="${GCOLS[i % 4]}"/>`).join("")}</g>`
          + `<g><path d="M1560,780 L1560,300" stroke="${INK}" stroke-width="8"/><rect x="1500" y="270" width="130" height="50" rx="8" fill="#f3f0e0" stroke="${INK}" stroke-width="5"/><path d="M1520,320 L1300,800 L1760,800Z" fill="#fff6c0" opacity="0.22"/></g>` };
    },
  };

  // Paris 1925 office: dark exposure, one warm practical lamp with rays, cool moon with halo rings, patterned surfaces
  RICH.office1925 = (seed) => {
    const r = T.rng(seed || 5); const stars = Array.from({ length: 26 }, () => `<circle cx="${(90 + r() * 640).toFixed(0)}" cy="${(30 + r() * 330).toFixed(0)}" r="${(1.5 + r() * 2).toFixed(1)}" fill="#fff" opacity="${(0.5 + r() * 0.5).toFixed(2)}"/>`).join("");
    const house = (x, y, w, h, lit) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1c2a5e"/><path d="M${x - 8},${y} L${x + w / 2},${y - 50} L${x + w + 8},${y}Z" fill="#17234f"/>` + lit.map(([a, b]) => `<rect x="${x + a}" y="${y + b}" width="22" height="30" fill="#f6d36a"/>`).join("");
    const lines = Array.from({ length: 40 }, (_, i) => `<path d="M${880 + i * 28},0 L${880 + i * 28},620" stroke="#0e3a30" stroke-width="5" opacity="0.7"/>`).join("");
    const panels = Array.from({ length: 11 }, (_, i) => `<rect x="${20 + i * 180}" y="${610}" width="150" height="120" fill="#3c2415" stroke="${INK}" stroke-width="4"/>`).join("");
    const planks = Array.from({ length: 14 }, (_, i) => `<path d="M-400,${760 + i * 26} L2320,${760 + i * 26}" stroke="#1b0f08" stroke-width="3" opacity="0.7"/>`).join("") + Array.from({ length: 30 }, (_, i) => `<path d="M${(i * 173) % 1900},${760 + (i % 9) * 26} l0,26" stroke="#1b0f08" stroke-width="3" opacity="0.6"/>`).join("");
    const rays = Array.from({ length: 9 }, (_, i) => { const a = (-70 + i * 17.5) * Math.PI / 180; return `<path d="M${1640 + 60 * Math.sin(a)},610 L${1640 + 210 * Math.sin(a)},${610 + 210 * Math.cos(a) * 0.9}" stroke="#ffe9a0" stroke-width="4" opacity="0.5" stroke-linecap="round"/>`; }).join("");
    const lineup = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="4"/>`;
    return {
      heavy: true,
      far: `<defs><linearGradient id="rb-wp" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0d3a32"/><stop offset="1" stop-color="#1f5f50"/></linearGradient><linearGradient id="rb-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a3820"/><stop offset="1" stop-color="#241408"/></linearGradient><linearGradient id="rb-tower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9a7a42"/><stop offset="1" stop-color="#6e5330"/></linearGradient><radialGradient id="rb-lamp"><stop offset="0" stop-color="#ffe08a" stop-opacity="0.95"/><stop offset="0.45" stop-color="#ffc85a" stop-opacity="0.35"/><stop offset="1" stop-color="#ffc85a" stop-opacity="0"/></radialGradient></defs>`
        + FULL("url(#rb-wp)") + lines
        + `<g>${R_(60, 20, 700, 560, "#10194a", 12)}<rect x="62" y="22" width="696" height="556" fill="#1a2866"/><circle cx="150" cy="95" r="120" fill="#cfe0ff" opacity="0.10"/><circle cx="150" cy="95" r="85" fill="#cfe0ff" opacity="0.16"/><circle cx="150" cy="95" r="52" fill="#fbf3c8"/><circle cx="596" cy="330" r="200" fill="#6f86d8" opacity="0.18"/>${stars}${softCloud(280, 190, 0.28, "#2a3a80")}${house(110, 370, 140, 200, [[24, 40], [92, 40], [24, 110]])}${house(290, 330, 140, 240, [[24, 50], [92, 50]])}${house(640, 400, 110, 170, [[30, 40]])}`
        + `<path d="M596,42 L614,180 L632,300 L700,570 L492,570 L560,300 L578,180Z" fill="url(#rb-tower)" stroke="${INK}" stroke-width="4"/><path d="M570,330 L622,330 M582,200 L610,200" stroke="#3a2a14" stroke-width="10"/><path d="M520,520 Q596,420 672,520" fill="#1a2866" stroke="${INK}" stroke-width="4"/><circle cx="596" cy="38" r="9" fill="#ffefb0"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${572 + (i % 3) * 22},${350 + i * 18} l${20 - (i % 2) * 10},${14}" stroke="#3a2a14" stroke-width="3"/>`).join("")}<path d="M411,20 L411,578 M62,300 L758,300" stroke="#5a3b24" stroke-width="12"/><rect x="40" y="578" width="740" height="26" fill="#5a3b24" stroke="${INK}" stroke-width="5"/></g>`
        + `<g><rect x="0" y="0" width="72" height="1080" fill="#7a1420"/><path d="M20,0 L20,1080 M44,0 L44,1080" stroke="#4d0c14" stroke-width="6" opacity="0.7"/><rect x="760" y="0" width="140" height="640" fill="#8a1a28" stroke="${INK}" stroke-width="5"/><path d="M790,0 L790,640 M830,0 L830,640 M868,0 L868,640" stroke="#58101a" stroke-width="7" opacity="0.7"/></g>`
        + `<g>${R_(965, 75, 175, 225, "#d9b25e", 6)}${R_(985, 95, 135, 185, "#cfe0ee", 4)}<path d="M1000,260 L1050,170 L1075,215 L1095,185 L1110,260Z" fill="#7fb0a8" stroke="${INK}" stroke-width="4"/><circle cx="1085" cy="130" r="14" fill="#c9a050"/></g><circle cx="1318" cy="140" r="70" fill="#7f90d8" stroke="${INK}" stroke-width="6"/><path d="M1318,140 L1318,95 M1318,140 L1355,162" stroke="${INK}" stroke-width="6" stroke-linecap="round"/><g>${R_(1510, 50, 160, 190, "#dfe6f2", 4)}<rect x="1512" y="52" width="156" height="50" fill="#b3202c"/><text x="1590" y="90" font-size="40" fill="#f6dfe0" text-anchor="middle">MAI</text><text x="1590" y="182" font-size="62" fill="#1b2146" text-anchor="middle">1925</text></g>`
        + `<rect x="-400" y="600" width="2720" height="160" fill="#3a2314"/>${panels}<path d="M-400,600 L2320,600" stroke="${INK}" stroke-width="6"/>`
        + `<rect x="-400" y="745" width="2720" height="400" fill="url(#rb-wood)"/><path d="M-400,745 L2320,745" stroke="${INK}" stroke-width="6"/>${planks}`
        + `<path d="M70,605 L760,605 L560,1080 L-300,1080Z" fill="#9fb6ff" opacity="0.09"/>`,
      mid: `<ellipse cx="950" cy="985" rx="440" ry="78" fill="#6f1a2a" stroke="${INK}" stroke-width="5"/><ellipse cx="950" cy="985" rx="400" ry="64" fill="none" stroke="#d9b25e" stroke-width="6"/>`
        + `<g>${R_(1190, 700, 710, 26, "#6a4325", 6)}${R_(1210, 726, 670, 300, "#4f301a", 6)}<path d="M1545,726 L1545,1026 M1210,876 L1880,876" stroke="${INK}" stroke-width="5"/>${[[1375, 800], [1710, 800], [1375, 950], [1710, 950]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#e0b450" stroke="${INK}" stroke-width="3"/>`).join("")}${R_(1430, 470, 195, 230, "#8a2a2a", 6, 24)}${R_(1430, 662, 195, 36, "#f2f0ea", 4)}<g><rect x="1255" y="560" width="30" height="140" fill="#222" stroke="${INK}" stroke-width="4"/><circle cx="1322" cy="568" r="30" fill="#2c2c2c" stroke="${INK}" stroke-width="5"/><path d="M1322,598 L1322,700" stroke="${INK}" stroke-width="9"/></g></g>`
        + `<ellipse cx="1640" cy="620" rx="380" ry="320" fill="url(#rb-lamp)"/>` + rays
        + `<g><path d="M1640,640 L1640,700 M1600,700 L1680,700" stroke="#c9a24a" stroke-width="10" stroke-linecap="round"/><path d="M1540,630 C1540,560 1590,520 1640,520 C1690,520 1740,560 1740,630Z" fill="#2f9a62" stroke="${INK}" stroke-width="5"/><ellipse cx="1640" cy="630" rx="100" ry="14" fill="#fff4c0" stroke="${INK}" stroke-width="4"/></g>`
        + `<ellipse cx="1360" cy="1040" rx="520" ry="70" fill="#ffd27a" opacity="0.12"/>`,
    };
  };


  // street: day / dusk / night. Layers: sky + skyline (far), facades (mid-far), sidewalk, road with scrolling lane dashes, lamp posts
  RICH.street = (seed, o) => {
    const time = (o && o.time) || "day", night = time === "night", dusk = time === "dusk", r = T.rng(seed || 3);
    const sky = night ? "url(#rb-night)" : dusk ? "url(#rb-dusk)" : "url(#rb-day)";
    const farC = night ? "#1a2455" : dusk ? "#b0627a" : "#9cc4e8", nearC = night ? "#222b63" : dusk ? "#7e4a74" : "#e4c9a0", sideC = night ? "#4a4658" : "#c9c1b4", roadA = night ? "#2a2933" : "#55535c", roadB = night ? "#14131a" : "#33313a";
    let far = "", x = -380; while (x < 2300) { const w = 90 + r() * 120, h = 160 + r() * 280; far += `<rect x="${x}" y="${700 - h}" width="${w}" height="${h + 200}" fill="${farC}" opacity="0.9"/>`; x += w - 6; }
    let fac = ""; x = -380; while (x < 2300) { const w = 230 + r() * 160, h = 340 + r() * 260, top = 760 - h; fac += `<rect x="${x}" y="${top}" width="${w}" height="${h + 40}" fill="${nearC}" stroke="${INK}" stroke-width="5"/>`; for (let wy = top + 40; wy < 700; wy += 90) for (let wx = x + 28; wx < x + w - 50; wx += 70) fac += `<rect x="${wx}" y="${wy}" width="36" height="52" fill="${night ? (r() > 0.45 ? "#f6d36a" : "#2a3265") : "#bfe0f4"}" stroke="${INK}" stroke-width="3"/>`; x += w + 14; }
    const lamp = (px) => `<g><path d="M${px},780 L${px},420 Q${px},380 ${px + 40},380" stroke="${INK}" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="${px + 24}" y="372" width="64" height="26" rx="10" fill="#f3efd8" stroke="${INK}" stroke-width="5"/>${night || dusk ? `<circle cx="${px + 56}" cy="410" r="${night ? 300 : 200}" fill="url(#rb-glow)" opacity="${night ? 0.85 : 0.5}"/><path d="M${px + 30},398 L${px - 60},790 L${px + 160},790 L${px + 84},398Z" fill="#fff2b0" opacity="0.16"/>` : ""}</g>`;
    const dashes = Array.from({ length: 16 }, (_, i) => `<rect x="${-400 + i * 220}" y="962" width="120" height="16" fill="#f4f1e0"/>`).join("");
    const cross = Array.from({ length: 8 }, (_, i) => `<rect x="${760 + i * 56}" y="842" width="34" height="238" fill="#f4f1e0" opacity="0.92"/>`).join("");
    return {
      far: FULL(sky) + (night ? `<circle cx="1500" cy="170" r="60" fill="#fbf3c8"/><circle cx="1500" cy="170" r="140" fill="#cfe0ff" opacity="0.14"/>` : `<circle cx="1500" cy="250" r="640" fill="url(#rb-glow)" opacity="${dusk ? 1 : 0.8}"/>`) + far + (!night ? softCloud(200, 180, 0.8, dusk ? "#f7c98a" : "#cbe5f6") + softCloud(1100, 120, 0.7, dusk ? "#f7c98a" : "#cbe5f6") : "") + fac,
      mid: `<rect x="-400" y="760" width="2720" height="90" fill="${sideC}" stroke="${INK}" stroke-width="5"/><path d="M-400,800 L2320,800" stroke="#00000033" stroke-width="3"/>` + `<rect x="-400" y="850" width="2720" height="400" fill="${"url(#rb-road)"}"/>` + `<g class="rb-scroll" data-scroll="440">${dashes}</g>` + cross + lamp(320) + lamp(1020) + lamp(1720),
      defs: `<linearGradient id="rb-road" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${roadA}"/><stop offset="1" stop-color="${roadB}"/></linearGradient>`,
    };
  };


  // neon night city: purple-pink gradient, blurred bokeh lights, lit skyline, wet street with neon streaks
  RICH.neonNight = (seed) => {
    const r = T.rng(seed || 12); let sk = "", x = -380; while (x < 2300) { const w = 120 + r() * 150, h = 220 + r() * 380; sk += `<rect x="${x}" y="${820 - h}" width="${w}" height="${h + 300}" fill="#1b0f45"/>`; for (let wy = 820 - h + 30; wy < 780; wy += 58) for (let wx = x + 18; wx < x + w - 30; wx += 40) if (r() > 0.55) sk += `<rect x="${wx}" y="${wy}" width="18" height="26" fill="${r() > 0.5 ? "#ffd85a" : "#ff7ac8"}" opacity="0.9"/>`; x += w + 8; }
    const cols = ["#ff4fd8", "#4fe8ff", "#ffd400", "#8a5cff"]; const bokeh = Array.from({ length: 28 }, () => `<circle cx="${(r() * 2000 - 40).toFixed(0)}" cy="${(120 + r() * 700).toFixed(0)}" r="${(24 + r() * 60).toFixed(0)}" fill="${cols[Math.floor(r() * 4)]}" opacity="${(0.15 + r() * 0.22).toFixed(2)}"/>`).join("");
    const streaks = Array.from({ length: 14 }, (_, i) => `<rect x="${60 + i * 140}" y="830" width="${10 + (i % 3) * 8}" height="${160 + (i % 4) * 50}" fill="${cols[i % 4]}" opacity="0.2"/>`).join("");
    return { far: `<defs><linearGradient id="rb-neon" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#150a3a"/><stop offset="0.55" stop-color="#4a1d8f"/><stop offset="1" stop-color="#b53a9e"/></linearGradient><linearGradient id="rb-wet" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a1a70"/><stop offset="1" stop-color="#0c0524"/></linearGradient><filter id="rb-bk" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7"/></filter></defs>` + FULL("url(#rb-neon)") + `<circle cx="1480" cy="230" r="300" fill="#ffd6f6" opacity="0.22"/><circle cx="1480" cy="230" r="86" fill="#fff3d0"/>` + sk + `<g filter="url(#rb-bk)">${bokeh}</g>`,
      mid: `<rect x="-400" y="820" width="2720" height="400" fill="url(#rb-wet)"/><path d="M-400,820 L2320,820" stroke="#ff7ac8" stroke-width="5" opacity="0.7"/>` + streaks + `<ellipse cx="960" cy="1000" rx="900" ry="80" fill="#ff4fd8" opacity="0.12"/>` };
  };

  const VIG = `<rect x="0" y="0" width="1920" height="1080" fill="url(#rb-vig)" pointer-events="none"/>`;

  // empty set: a rich environment plus characters, close-ups, pop-up board — the workhorse for dialogue scenes
  S.stage = {
    svg: ({ o, id }) => (o.platform === "cloud" ? `<g>${[[300, 1030, 330], [650, 1050, 380], [1050, 1040, 360], [1450, 1050, 340], [1780, 1030, 300]].map(([x, y, r]) => `<ellipse cx="${x + 10}" cy="${y + 20}" rx="${r}" ry="140" fill="#cbe5f6"/><ellipse cx="${x}" cy="${y}" rx="${r}" ry="140" fill="#fff" stroke="${INK}" stroke-width="5"/>`).join("")}</g>` : "")
      + (o.board ? `<g transform="translate(${o.board.x || 960},${o.board.y || 230})"><g id="${id("board")}">${card(1000, 300, "#10162e", 22)}${txt(o.board.text, 0, 30, fit(o.board.text, 100, 900), "#8dff8a")}${o.board.sub ? txt(o.board.sub, 0, 110, 56, "#ffd84d") : ""}<g transform="translate(-440,-90)">${ICONS.gmark(0.9)}</g></g></g>` : ""),
    build(tl, { o, id }) { if (o.board) pop(tl, `#${id("board")}`, (o.t || {}).board || 0.8); },
  };

  // ---------- talking characters: say[{char, emotion, from, to}] -> face, brows, gesture, mouth flaps, close-up, return to wide ----------
  const EMO = {
    neutral: { mood: "flat", brows: "calm", arms: [] },
    happy: { mood: "grin", brows: "up", arms: [["l", 35], ["r", -35]] },
    shocked: { mood: "shock", brows: "up", arms: [["l", 150], ["r", -150]], shake: 7 },
    scared: { mood: "shock", brows: "worried", arms: [["l", 40], ["r", -40]], shake: 4 },
    nervous: { mood: "frown", brows: "worried", arms: [["l", 20], ["r", -20]] },
    sad: { mood: "frown", brows: "worried", arms: [] },
    angry: { mood: "frown", brows: "angry", arms: [["l", 70], ["r", -70]], shake: 6 },
    smug: { mood: "smile", brows: "angry", arms: [] },
    explain: { mood: "open", brows: "up", arms: [["r", -70]] },
    joy: { mood: "grin", brows: "up", arms: [["l", 160], ["r", -160]] },
    love: { mood: "smile", brows: "up", arms: [["l", 50], ["r", -50]] },
    crying: { mood: "frown", brows: "worried", arms: [["l", 120], ["r", -120]] },
    dizzy: { mood: "frown", brows: "worried", arms: [] },
    mindblown: { mood: "shock", brows: "up", arms: [["l", 150], ["r", -150]], shake: 8 },
    sleepy: { mood: "flat", brows: "calm", arms: [] },
    scream: { mood: "shock", brows: "up", arms: [["l", 160], ["r", -160]], shake: 9 },
  };
  function applySay(tl, o, sid, C) {
    (o.say || []).forEach((s) => {
      const ci = typeof s.char === "number" ? s.char : (o.chars || []).findIndex((c) => c.name === s.char); if (ci < 0) return;
      const c = o.chars[ci], id = `${sid}-c${ci}`, E = EMO[s.emotion] || EMO.neutral, sc = c.scale || 1;
      const X = c.style === "mascot" && T.EXPR && T.EXPR[s.emotion];
      if (X) T.expr(tl, id, s.from, s.emotion, s.to - s.from + 0.6); else { T.mood(tl, id, s.from, E.mood); T.brows(tl, id, s.from, E.brows); }
      E.arms.forEach(([side, deg]) => T.armTo(tl, id, side, deg, s.from + 0.05, 0.3));
      if (E.arms.length) { T.armTo(tl, id, "l", c.armL == null ? 10 : c.armL, s.to + 0.15, 0.4); T.armTo(tl, id, "r", c.armR == null ? -10 : c.armR, s.to + 0.15, 0.4); }
      if (!(X && X.silent)) T.talk(tl, id, s.from + 0.1, s.to, X ? (X.mouth === "open" ? "smile" : X.mouth) : (E.mood === "open" ? "smile" : E.mood));
      if (E.shake) C.shake(s.from + 0.05, E.shake);
      if (s.zoom !== false && o.bg && RICH[o.bg]) { const bl = s.blur == null ? 14 : s.blur; ["far", "mid"].forEach((k) => { tl.set(`#${sid}-${k}`, { filter: "blur(0px) brightness(1)" }, 0); tl.to(`#${sid}-${k}`, { filter: `blur(${bl}px) brightness(0.72)`, duration: 0.45 }, s.from - 0.15); tl.to(`#${sid}-${k}`, { filter: "blur(0px) brightness(1)", duration: 0.5 }, s.to + 0.1); }); }
      if (s.zoom !== false) { C.to(s.from - 0.2, 0.55, { k: s.k || 1.9, fx: (c.x || 960), fy: (c.y || 1000) - 240 * sc }, "power2.inOut"); C.to(s.to + 0.1, 0.6, { k: 1.06, fx: 960, fy: 540 }, "power2.inOut"); }
    });
  }


  // =====================================================================================
  // LIBRARY BATCHES 2-5: vehicles, machines (props), rooms, crowds, weather
  // props: [{type,x,y,scale,dir,move:[t0,t1,dx],col,front}]  (y = ground line, x = centre)
  // =====================================================================================
  const wheel = (cx, cy, r, tire) => `<g transform="translate(${cx},${cy})"><g class="wheel" data-r="${r}"><circle r="${r}" fill="${tire || "#2b2b33"}" stroke="${INK}" stroke-width="5"/><circle r="${r * 0.55}" fill="#cfd3dc" stroke="${INK}" stroke-width="3"/><path d="M0,${-r * 0.5} L0,${r * 0.5} M${-r * 0.5},0 L${r * 0.5},0" stroke="${INK}" stroke-width="4"/><circle r="${r * 0.14}" fill="${INK}"/></g></g>`;
  const WIN = "#bfe4f7";
  const PROPS = {
    car: (p) => { const c = p.col || "#e0402f"; return `<ellipse cx="0" cy="2" rx="190" ry="12" fill="#000" opacity="0.2"/>
      <path d="M-172,-30 L-172,-70 Q-150,-82 -110,-86 L-62,-122 Q-40,-132 0,-132 L68,-132 Q94,-130 112,-100 L150,-86 Q174,-80 174,-52 L174,-30Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-52,-112 L-30,-122 L30,-122 L30,-92 L-70,-92Z M44,-122 L66,-122 Q82,-120 96,-96 L44,-96Z" fill="${WIN}" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M-172,-52 L174,-52" stroke="#00000030" stroke-width="4"/><circle cx="162" cy="-66" r="9" fill="#fff3a8" stroke="${INK}" stroke-width="3"/><rect x="-176" y="-70" width="10" height="16" fill="#ff5a4a" stroke="${INK}" stroke-width="3"/>
      ${p.beam ? `<path d="M170,-66 L520,-120 L520,10 L170,-48Z" fill="#fff3a8" opacity="0.22"/>` : ""}${wheel(-105, -30, 32)}${wheel(105, -30, 32)}`; },
    bus: (p) => { const c = p.col || "#f2b01e"; return `<ellipse cx="0" cy="2" rx="300" ry="14" fill="#000" opacity="0.2"/>
      <rect x="-290" y="-196" width="580" height="170" rx="30" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="-290" y="-66" width="580" height="12" fill="#00000026"/>
      ${[-250, -170, -90, -10, 70].map((x) => `<rect x="${x}" y="-170" width="64" height="62" rx="8" fill="${WIN}" stroke="${INK}" stroke-width="4"/>`).join("")}<rect x="162" y="-176" width="100" height="120" rx="8" fill="${WIN}" stroke="${INK}" stroke-width="4"/><path d="M212,-176 L212,-56" stroke="${INK}" stroke-width="4"/>
      <rect x="-80" y="-214" width="160" height="26" rx="8" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="0" y="-194" font-size="22" text-anchor="middle" fill="${INK}">${p.label || "CITY"}</text><circle cx="274" cy="-50" r="9" fill="#fff3a8" stroke="${INK}" stroke-width="3"/>${wheel(-175, -30, 38)}${wheel(175, -30, 38)}`; },
    truck: (p) => { const c = p.col || "#3d6fd1"; return `<ellipse cx="0" cy="2" rx="300" ry="14" fill="#000" opacity="0.2"/>
      <rect x="-290" y="-206" width="360" height="176" rx="12" fill="#f4f1e6" stroke="${INK}" stroke-width="6"/><text x="-110" y="-110" font-size="46" text-anchor="middle" fill="${c}">${p.label || "CARGO"}</text>
      <path d="M80,-30 L80,-150 L200,-150 Q226,-148 240,-112 L290,-98 L290,-30Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M104,-132 L196,-132 Q212,-130 222,-104 L104,-104Z" fill="${WIN}" stroke="${INK}" stroke-width="4"/><circle cx="282" cy="-64" r="9" fill="#fff3a8" stroke="${INK}" stroke-width="3"/>
      ${wheel(-210, -30, 36)}${wheel(-110, -30, 36)}${wheel(160, -30, 36)}`; },
    train: (p) => { const c = p.col || "#2f9a62"; const car = (x, col) => `<rect x="${x}" y="-170" width="300" height="130" rx="16" fill="${col}" stroke="${INK}" stroke-width="6"/>${[0, 1, 2].map((i) => `<rect x="${x + 24 + i * 90}" y="-146" width="64" height="50" rx="6" fill="${WIN}" stroke="${INK}" stroke-width="4"/>`).join("")}${wheel(x + 60, -26, 26)}${wheel(x + 240, -26, 26)}<path d="M${x + 300},-60 L${x + 314},-60" stroke="${INK}" stroke-width="8"/>`;
      return `<ellipse cx="0" cy="2" rx="560" ry="12" fill="#000" opacity="0.2"/>${car(-640, "#d9b25e")}${car(-320, c)}
      <rect x="20" y="-150" width="250" height="110" rx="10" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="170" y="-210" width="110" height="170" rx="10" fill="${c}" stroke="${INK}" stroke-width="6"/><rect x="190" y="-190" width="70" height="56" rx="6" fill="${WIN}" stroke="${INK}" stroke-width="4"/>
      <rect x="40" y="-200" width="46" height="56" fill="#444" stroke="${INK}" stroke-width="5"/><g id="PID-smoke" class="smoke">${[0, 1, 2].map((i) => `<circle cx="${63 + i * 6}" cy="${-230 - i * 40}" r="${24 + i * 8}" fill="#e8e8ee" stroke="${INK}" stroke-width="3" opacity="0.9"/>`).join("")}</g>
      <path d="M270,-60 L300,-30 L270,-30Z" fill="#ffd400" stroke="${INK}" stroke-width="4"/>${wheel(70, -34, 34)}${wheel(150, -34, 34)}${wheel(230, -34, 34)}`.replace(/PID/g, p._id); },
    plane: (p) => { const c = p.col || "#f4f6fa"; return `<path d="M-300,-40 Q-300,-86 -240,-92 L200,-92 Q320,-90 360,-50 Q320,-12 200,-8 L-240,-8 Q-300,-10 -300,-40Z" fill="${c}" stroke="${INK}" stroke-width="6"/>
      <path d="M-290,-80 L-340,-190 L-270,-190 L-190,-86Z" fill="${p.tail || "#e0402f"}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-40,-54 L-120,40 L-60,40 L60,-54Z" fill="#dfe4ee" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-30,-70 L-110,-150 L-60,-150 L50,-70Z" fill="#cfd5e2" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <ellipse cx="-10" cy="8" rx="62" ry="22" fill="#9aa3b5" stroke="${INK}" stroke-width="5"/>${Array.from({ length: 11 }, (_, i) => `<ellipse cx="${-210 + i * 38}" cy="-58" rx="9" ry="12" fill="${WIN}" stroke="${INK}" stroke-width="3"/>`).join("")}<path d="M250,-66 Q320,-64 336,-48 L250,-48Z" fill="${WIN}" stroke="${INK}" stroke-width="4"/>`; },
    bike: (p) => { const c = p.col || "#e0402f"; return `<ellipse cx="0" cy="2" rx="110" ry="8" fill="#000" opacity="0.2"/>${wheel(-70, -46, 46, "#3a3a44")}${wheel(70, -46, 46, "#3a3a44")}
      <path d="M-70,-46 L-20,-110 L50,-110 L70,-46 M-20,-110 L10,-46 L-70,-46 M10,-46 L50,-110 M50,-110 L44,-142 M30,-142 L66,-142 M-20,-110 L-26,-124 M-40,-124 L-10,-124" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="-46" r="9" fill="${INK}"/>`; },
    boat: (p) => { const c = p.col || "#d23a2e"; return `<g id="PID-bob"><path d="M-230,-60 L230,-60 L180,0 L-180,0Z" fill="${c}" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><rect x="-60" y="-130" width="140" height="70" rx="8" fill="#f4f1e6" stroke="${INK}" stroke-width="6"/>${[-40, 0, 40].map((x) => `<circle cx="${x + 10}" cy="-96" r="12" fill="${WIN}" stroke="${INK}" stroke-width="4"/>`).join("")}
      <rect x="-30" y="-176" width="40" height="46" fill="#f2b01e" stroke="${INK}" stroke-width="5"/><path d="M-230,-30 L230,-30" stroke="#ffffff55" stroke-width="6"/>${p.sail ? `<path d="M-90,-60 L-90,-300 L110,-60Z" fill="#fff" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/><path d="M-90,-300 L-90,-60" stroke="${INK}" stroke-width="7"/>` : ""}</g>
      <path d="M-270,-4 q30,-18 60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0 t60,0" fill="none" stroke="#ffffffaa" stroke-width="8" stroke-linecap="round"/>`.replace(/PID/g, p._id); },
    // ---- machines ----
    factoryLine: (p) => { return `<clipPath id="PID-clip"><rect x="-440" y="-170" width="880" height="100"/></clipPath>
      <rect x="-460" y="-70" width="920" height="46" rx="23" fill="#3b3f4e" stroke="${INK}" stroke-width="6"/>${Array.from({ length: 12 }, (_, i) => `<circle cx="${-410 + i * 75}" cy="-47" r="14" fill="#9aa3b5" stroke="${INK}" stroke-width="4"/>`).join("")}
      <rect x="-440" y="-24" width="40" height="24" fill="#2b2f3a"/><rect x="400" y="-24" width="40" height="24" fill="#2b2f3a"/>
      <g clip-path="url(#PID-clip)"><g id="PID-boxes">${Array.from({ length: 6 }, (_, i) => `<rect x="${-600 + i * 240}" y="-134" width="84" height="64" fill="${["#e0402f", "#4285f4", "#fbbc05"][i % 3]}" stroke="${INK}" stroke-width="5"/><path d="M${-600 + i * 240},-110 L${-516 + i * 240},-110" stroke="#00000040" stroke-width="5"/>`).join("")}</g></g>
      <g transform="translate(-300,-24)"><path d="M0,0 L0,-330 L160,-330" fill="none" stroke="#c7ccd8" stroke-width="22" stroke-linecap="round"/><path d="M160,-330 L160,-250" stroke="#e0402f" stroke-width="12"/><rect x="130" y="-250" width="60" height="22" fill="#2b2f3a" stroke="${INK}" stroke-width="4"/></g>`.replace(/PID/g, p._id); },
    robotArm: (p) => `<rect x="-90" y="-40" width="180" height="40" rx="8" fill="#3b3f4e" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-60" r="38" fill="#e0402f" stroke="${INK}" stroke-width="6"/>
      <g transform="translate(0,-60)"><g id="PID-a1"><rect x="-20" y="-200" width="40" height="200" rx="14" fill="#f2b01e" stroke="${INK}" stroke-width="6"/><circle cx="0" cy="-200" r="30" fill="#e0402f" stroke="${INK}" stroke-width="6"/>
      <g transform="translate(0,-200)"><g id="PID-a2"><rect x="-18" y="-170" width="36" height="170" rx="12" fill="#f2b01e" stroke="${INK}" stroke-width="6"/><g transform="translate(0,-170)"><path d="M-30,0 L30,0 M-26,0 L-26,-46 M26,0 L26,-46" fill="none" stroke="${INK}" stroke-width="12" stroke-linecap="round"/></g></g></g></g></g>`.replace(/PID/g, p._id),
    serverRack: (p) => `<rect x="-90" y="-340" width="180" height="340" rx="10" fill="#2b3a55" stroke="${INK}" stroke-width="7"/>${Array.from({ length: 8 }, (_, i) => `<rect x="-76" y="${-324 + i * 40}" width="152" height="30" rx="5" fill="#1b2438" stroke="${INK}" stroke-width="3"/><circle class="led" cx="-58" cy="${-309 + i * 40}" r="6" fill="${["#4285f4", "#ea4335", "#fbbc05", "#34a853"][i % 4]}"/><circle class="led" cx="-40" cy="${-309 + i * 40}" r="6" fill="${["#34a853", "#4285f4", "#ea4335", "#fbbc05"][i % 4]}"/><path d="M-20,${-309 + i * 40} L60,${-309 + i * 40}" stroke="#5d6f93" stroke-width="5"/>`).join("")}`,
    labBench: (p) => `<rect x="-300" y="-190" width="600" height="30" fill="#c9a06b" stroke="${INK}" stroke-width="6"/><rect x="-280" y="-160" width="560" height="160" fill="#8a6a46" stroke="${INK}" stroke-width="6"/><path d="M0,-160 L0,0" stroke="${INK}" stroke-width="5"/>
      <path d="M-200,-190 L-200,-250 L-240,-300 L-160,-300 L-200,-250Z" fill="#e6f7ff" stroke="${INK}" stroke-width="5"/><path d="M-224,-262 L-176,-262 L-160,-222 L-240,-222Z" fill="#7cc242" opacity="0.85"/><g id="PID-bub">${[0, 1, 2].map((i) => `<circle class="bub" cx="${-205 + i * 10}" cy="${-250 - i * 14}" r="${5 - i}" fill="#fff" opacity="0.9"/>`).join("")}</g>
      <rect x="-90" y="-205" width="70" height="14" fill="#6b6f80" stroke="${INK}" stroke-width="4"/><path d="M-55,-205 L-55,-290 L-20,-310 L-5,-280 L-40,-262 L-40,-205" fill="#9aa3b5" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/><circle cx="-20" cy="-300" r="12" fill="#cfd3dc" stroke="${INK}" stroke-width="4"/>
      ${[80, 120, 160, 200].map((x, i) => `<rect x="${x}" y="-260" width="26" height="70" rx="12" fill="#e6f7ff" stroke="${INK}" stroke-width="4"/><rect x="${x + 2}" y="${-226 + i * 3}" width="22" height="${34 - i * 3}" rx="8" fill="${["#ea4335", "#4285f4", "#fbbc05", "#34a853"][i]}"/>`).join("")}`.replace(/PID/g, p._id),
    controlPanel: (p) => `<rect x="-320" y="-300" width="640" height="300" rx="20" fill="#3b3f4e" stroke="${INK}" stroke-width="7"/><rect x="-290" y="-270" width="270" height="150" rx="10" fill="#0f1a2e" stroke="${INK}" stroke-width="5"/><path d="M-270,-180 L-230,-210 L-190,-160 L-150,-230 L-110,-190 L-70,-220 L-40,-170" fill="none" stroke="#5af07a" stroke-width="5" stroke-linejoin="round"/>
      <rect x="-5" y="-270" width="270" height="150" rx="10" fill="#0f1a2e" stroke="${INK}" stroke-width="5"/>${[0, 1, 2, 3, 4].map((i) => `<rect x="${15 + i * 48}" y="${-130 - [60, 90, 40, 100, 70][i]}" width="34" height="${[60, 90, 40, 100, 70][i]}" fill="#4fe8ff"/>`).join("")}
      ${Array.from({ length: 10 }, (_, i) => `<circle class="led" cx="${-280 + i * 62}" cy="-84" r="13" fill="${["#ea4335", "#fbbc05", "#34a853", "#4285f4"][i % 4]}" stroke="${INK}" stroke-width="3"/>`).join("")}${Array.from({ length: 6 }, (_, i) => `<rect x="${-280 + i * 100}" y="-52" width="70" height="30" rx="8" fill="#c7ccd8" stroke="${INK}" stroke-width="4"/>`).join("")}<rect x="280" y="-140" width="22" height="90" rx="10" fill="#e0402f" stroke="${INK}" stroke-width="4"/>`,
  };
  const PROPANIM = {
    train: (tl, id, p, dur) => { tl.fromTo(`#${id}-smoke`, { y: 0, opacity: 0.9 }, { y: -50, opacity: 0, duration: 0.9, ease: "none", repeat: Math.ceil(dur / 0.9) }, 0); },
    boat: (tl, id, p, dur) => { tl.fromTo(`#${id}-bob`, { y: 0, rotation: -1.5, transformOrigin: "50% 100%" }, { y: -10, rotation: 1.5, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: Math.ceil(dur / 0.9) }, 0); },
    factoryLine: (tl, id, p, dur) => { tl.fromTo(`#${id}-boxes`, { x: 0 }, { x: 240, duration: 1.4, ease: "none", repeat: Math.ceil(dur / 1.4) }, 0); },
    robotArm: (tl, id, p, dur) => { const n = Math.ceil(dur / 1.2); tl.fromTo(`#${id}-a1`, { rotation: -30 }, { rotation: 35, duration: 1.2, ease: "sine.inOut", yoyo: true, repeat: n, svgOrigin: "0 0" }, 0); tl.fromTo(`#${id}-a2`, { rotation: 25 }, { rotation: -40, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: Math.ceil(dur / 0.9), svgOrigin: "0 0" }, 0); },
    labBench: (tl, id, p, dur) => { document.querySelectorAll(`#${id}-bub .bub`).forEach((b, i) => tl.fromTo(b, { y: 0, opacity: 0.9 }, { y: -36, opacity: 0, duration: 0.8, ease: "none", repeat: Math.ceil(dur / 0.8) }, i * 0.25)); },
    serverRack: (tl, id, p, dur) => { document.querySelectorAll(`#${id} .led`).forEach((el, k) => tl.fromTo(el, { opacity: 0.25 }, { opacity: 1, duration: 0.22 + (k % 4) * 0.1, ease: "none", yoyo: true, repeat: Math.ceil(dur / 0.25) }, k * 0.07)); },
    controlPanel: (tl, id, p, dur) => { document.querySelectorAll(`#${id} .led`).forEach((el, k) => tl.fromTo(el, { opacity: 0.2 }, { opacity: 1, duration: 0.3 + (k % 3) * 0.12, ease: "none", yoyo: true, repeat: Math.ceil(dur / 0.3) }, k * 0.09)); },
  };
  function propSvg(sid, p, i) {
    p._id = `${sid}-p${i}`; const dir = p.dir || (p.move && p.move[2] < 0 ? "left" : "right"), k = p.scale || 1, sx = (dir === "left" ? -1 : 1) * k;
    if (!PROPS[p.type]) throw new Error("unknown prop " + p.type);
    return `<g id="${p._id}-pos"><g transform="translate(${p.x || 0},${p.y || 0}) rotate(${p.rot || 0}) scale(${sx},${k})"><g id="${p._id}">${PROPS[p.type](p)}</g></g></g>`;
  }
  const propsHtml = (sid, o, front) => (o.props || []).map((p, i) => ((!!p.front) === front ? propSvg(sid, p, i) : "")).join("");
  function animProps(tl, sid, o, dur) {
    (o.props || []).forEach((p, i) => {
      const id = `${sid}-p${i}`;
      if (p.move) { const [t0, t1, dx] = p.move; tl.fromTo(`#${id}-pos`, { x: 0 }, { x: dx, duration: t1 - t0, ease: p.ease || "none", immediateRender: false }, t0);
        document.querySelectorAll(`#${id} .wheel`).forEach((w) => { const r = Number(w.dataset.r); tl.fromTo(w, { rotation: 0, transformOrigin: "50% 50%" }, { rotation: (Math.abs(dx) / ((p.scale || 1) * r)) * 57.3, duration: t1 - t0, ease: p.ease || "none", immediateRender: false }, t0); }); }
      if (PROPANIM[p.type]) PROPANIM[p.type](tl, id, p, dur);
    });
  }

  // ---------- rooms (time: "day" | "night") ----------
  const winSky = (time) => (time === "night" ? "url(#rb-night)" : "#8fd0ff");
  const room = (o, wallA, wallB, floorA, floorB, floorY) => `<defs><linearGradient id="rb-rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wallA}"/><stop offset="1" stop-color="${wallB}"/></linearGradient><linearGradient id="rb-rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floorA}"/><stop offset="1" stop-color="${floorB}"/></linearGradient></defs>` + FULL("url(#rb-rw)") + `<rect x="-400" y="${floorY}" width="2720" height="${1200 - floorY}" fill="url(#rb-rf)"/><path d="M-400,${floorY} L2320,${floorY}" stroke="${INK}" stroke-width="6"/><rect x="-400" y="${floorY - 24}" width="2720" height="24" fill="#ffffff55" stroke="${INK}" stroke-width="3"/>` + Array.from({ length: 12 }, (_, i) => `<path d="M-400,${floorY + 30 + i * 28} L2320,${floorY + 30 + i * 28}" stroke="#00000026" stroke-width="3"/>`).join("");
  const windowAt = (x, y, w, h, time, curtain) => `${R_(x, y, w, h, winSky(time), 9)}${time === "night" ? `<circle cx="${x + w * 0.75}" cy="${y + h * 0.28}" r="${h * 0.1}" fill="#fbf3c8"/>${Array.from({ length: 9 }, (_, i) => `<circle cx="${x + 20 + ((i * 53) % (w - 40))}" cy="${y + 20 + ((i * 37) % (h * 0.5))}" r="2.5" fill="#fff"/>`).join("")}` : `<circle cx="${x + w * 0.75}" cy="${y + h * 0.25}" r="${h * 0.1}" fill="#fff6b0"/>${softCloud(x + w * 0.1, y + h * 0.5, 0.26)}`}<path d="M${x + w / 2},${y} L${x + w / 2},${y + h} M${x},${y + h / 2} L${x + w},${y + h / 2}" stroke="${INK}" stroke-width="8"/>${curtain ? `<rect x="${x - 40}" y="${y - 20}" width="70" height="${h + 60}" fill="${curtain}" stroke="${INK}" stroke-width="5"/><rect x="${x + w - 30}" y="${y - 20}" width="70" height="${h + 60}" fill="${curtain}" stroke="${INK}" stroke-width="5"/>` : ""}`;
  const night = (o) => o && o.time === "night";
  RICH.bedroom = (seed, o) => ({ far: room(o, "#cfd8ff", "#aab8f0", "#c98f5a", "#7a4a28", 820) + windowAt(1180, 130, 460, 360, (o || {}).time, "#e86a8a") + R_(360, 170, 220, 160, "#fbfaf5", 6) + `<path d="M390,300 L450,220 L490,270 L520,240 L550,300Z" fill="#7fb0a8" stroke="${INK}" stroke-width="4"/><circle cx="530" cy="215" r="14" fill="#f2c14e"/>`,
    mid: `<ellipse cx="1260" cy="990" rx="420" ry="46" fill="#8a5cff" stroke="${INK}" stroke-width="5" opacity="0.9"/>` + R_(100, 430, 44, 470, "#6a4325", 6) + R_(140, 640, 700, 150, "#fbfaf5", 6, 14) + R_(330, 650, 510, 140, "#4285f4", 6, 14) + `<path d="M330,700 L840,700" stroke="#ffffff66" stroke-width="6"/><ellipse cx="250" cy="630" rx="96" ry="40" fill="#fff" stroke="${INK}" stroke-width="5"/>` + R_(140, 790, 700, 20, "#6a4325", 6) + R_(160, 810, 30, 90, "#6a4325", 5) + R_(780, 810, 30, 90, "#6a4325", 5)
      + `<circle cx="560" cy="610" r="34" fill="#c98f5a" stroke="${INK}" stroke-width="5"/><circle cx="540" cy="596" r="5" fill="${INK}"/><circle cx="580" cy="596" r="5" fill="${INK}"/><circle cx="534" cy="580" r="12" fill="#c98f5a" stroke="${INK}" stroke-width="4"/><circle cx="586" cy="580" r="12" fill="#c98f5a" stroke="${INK}" stroke-width="4"/>`
      + R_(890, 690, 170, 210, "#8a5530", 6) + R_(900, 710, 150, 80, "#6a4325", 4) + `<path d="M940,690 L1010,690 L1030,630 L920,630Z" fill="#fff3a8" stroke="${INK}" stroke-width="5"/><path d="M975,690 L975,720" stroke="${INK}" stroke-width="5"/>` + (night(o) ? `<rect x="-400" y="-400" width="2720" height="1880" fill="#0a0c24" opacity="0.38"/><circle cx="975" cy="650" r="340" fill="url(#rb-glow)" opacity="0.9"/>` : `<circle cx="1410" cy="310" r="520" fill="url(#rb-glow)" opacity="0.35"/>`) });
  RICH.kitchen = (seed, o) => ({ far: room(o, "#f6efe3", "#e8dcc6", "#b9b3a6", "#7e786c", 960) + Array.from({ length: 7 }, (_, r) => Array.from({ length: 22 }, (_, c) => `<rect x="${40 + c * 90}" y="${400 + r * 40}" width="86" height="36" fill="#fff" stroke="#c9c2b0" stroke-width="2"/>`).join("")).join("") + windowAt(1580, 200, 300, 280, (o || {}).time, "#f2b01e"),
    mid: R_(90, 120, 880, 250, "#8a5530", 6) + [0, 1, 2, 3].map((i) => `<path d="M${310 + i * 220},120 L${310 + i * 220},370" stroke="${INK}" stroke-width="5"/><rect x="${280 + i * 220}" y="320" width="26" height="12" rx="6" fill="#e0b450"/>`).join("") + R_(60, 640, 1020, 40, "#e8e8ee", 6) + R_(60, 680, 1020, 290, "#c9a06b", 6) + [0, 1, 2, 3].map((i) => `<path d="M${315 + i * 250},680 L${315 + i * 250},970" stroke="${INK}" stroke-width="5"/><circle cx="${340 + i * 250}" cy="740" r="9" fill="#e0b450" stroke="${INK}" stroke-width="3"/>`).join("")
      + R_(1100, 520, 220, 450, "#2b2f3a", 6) + R_(1120, 600, 180, 280, "#3b3f4e", 5) + `<rect x="1130" y="540" width="160" height="40" fill="#e0402f"/><circle cx="1180" cy="520" r="14" fill="#cfd3dc" stroke="${INK}" stroke-width="3"/><ellipse cx="1210" cy="500" rx="60" ry="14" fill="#9aa3b5" stroke="${INK}" stroke-width="5"/><rect x="1150" y="440" width="120" height="70" rx="10" fill="#cfd3dc" stroke="${INK}" stroke-width="5"/>`
      + R_(1360, 150, 240, 820, "#f4f4f8", 7, 16) + `<path d="M1360,520 L1600,520" stroke="${INK}" stroke-width="6"/><rect x="1560" y="300" width="14" height="150" rx="7" fill="#9aa3b5" stroke="${INK}" stroke-width="3"/><rect x="1560" y="560" width="14" height="150" rx="7" fill="#9aa3b5" stroke="${INK}" stroke-width="3"/><circle cx="1420" cy="250" r="14" fill="#4285f4"/><circle cx="1450" cy="300" r="14" fill="#ea4335"/>`
      + `<path d="M1000,0 L1000,110" stroke="${INK}" stroke-width="6"/><path d="M930,110 L1070,110 L1040,160 L960,160Z" fill="#fbbc05" stroke="${INK}" stroke-width="5"/>` + (night(o) ? `<rect x="-400" y="-400" width="2720" height="1880" fill="#0a0c24" opacity="0.4"/><circle cx="1000" cy="170" r="380" fill="url(#rb-glow)" opacity="0.9"/>` : `<circle cx="1000" cy="170" r="300" fill="url(#rb-glow)" opacity="0.35"/>`) });
  RICH.classroom = (seed, o) => ({ far: room(o, "#f3e7b8", "#e2cf90", "#c9a06b", "#7e5a34", 900) + R_(180, 120, 940, 400, "#2f6b4f", 12) + `<rect x="176" y="116" width="948" height="408" fill="none" stroke="#8a5530" stroke-width="22"/><rect x="170" y="520" width="960" height="22" fill="#8a5530" stroke="${INK}" stroke-width="5"/><path d="M240,200 L520,200 M240,260 L420,260 M240,320 L600,320 M700,220 L1000,220 M700,300 L900,300" stroke="#f4f4f0" stroke-width="7" stroke-linecap="round" opacity="0.85"/><circle cx="1240" cy="180" r="62" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M1240,180 L1240,140 M1240,180 L1272,196" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>` + windowAt(1380, 280, 480, 330, (o || {}).time) + R_(180, 580, 140, 110, "#fbfaf5", 5) + `<path d="M200,610 L300,610 M200,640 L280,640" stroke="#ea4335" stroke-width="6"/>`,
    mid: [0, 1, 2].map((i) => R_(160 + i * 330, 770, 220, 18, "#c9a06b", 6) + `<path d="M${180 + i * 330},788 L${180 + i * 330},900 M${360 + i * 330},788 L${360 + i * 330},900" stroke="${INK}" stroke-width="7"/><rect x="${200 + i * 330}" y="720" width="70" height="50" rx="6" fill="#4285f4" stroke="${INK}" stroke-width="4"/>`).join("") + R_(1280, 760, 400, 26, "#8a5530", 6) + `<rect x="1300" y="786" width="360" height="130" fill="#6a4325" stroke="${INK}" stroke-width="6"/><circle cx="1600" cy="720" r="40" fill="#4285f4" stroke="${INK}" stroke-width="5"/><path d="M1560,720 L1640,720" stroke="${INK}" stroke-width="3"/><rect x="1590" y="758" width="20" height="12" fill="${INK}"/>` + (night(o) ? `<rect x="-400" y="-400" width="2720" height="1880" fill="#0a0c24" opacity="0.35"/>` : `<circle cx="1620" cy="440" r="480" fill="url(#rb-glow)" opacity="0.3"/>`) });
  RICH.hospital = (seed, o) => ({ far: room(o, "#dcf1ec", "#bfe0d8", "#e8eef0", "#b9c4c8", 880) + `<rect x="-400" y="520" width="2720" height="360" fill="#a9d6cc" opacity="0.7"/><path d="M-400,520 L2320,520" stroke="${INK}" stroke-width="5"/>` + windowAt(1280, 120, 500, 340, (o || {}).time) + [0, 1, 2, 3, 4, 5].map((i) => `<rect x="1280" y="${150 + i * 50}" width="500" height="8" fill="#ffffffaa"/>`).join("") + `<g transform="translate(260,230)"><rect x="-70" y="-70" width="140" height="140" rx="20" fill="#fff" stroke="${INK}" stroke-width="7"/><path d="M-12,-46 L12,-46 L12,-12 L46,-12 L46,12 L12,12 L12,46 L-12,46 L-12,12 L-46,12 L-46,-12 L-12,-12Z" fill="#e0402f" stroke="${INK}" stroke-width="4"/></g><rect x="760" y="40" width="400" height="26" rx="13" fill="#ffffffee" stroke="${INK}" stroke-width="4"/>`,
    mid: R_(140, 620, 760, 40, "#e6f0f2", 6, 10) + R_(160, 660, 720, 40, "#4a9ad6", 6, 8) + `<ellipse cx="260" cy="610" rx="90" ry="36" fill="#fff" stroke="${INK}" stroke-width="5"/>` + R_(120, 500, 36, 400, "#c7ccd8", 6) + R_(880, 560, 36, 340, "#c7ccd8", 6) + `<path d="M140,700 L140,880 M860,700 L860,880" stroke="${INK}" stroke-width="8"/>`
      + `<g><path d="M1010,360 L1010,900" stroke="#c7ccd8" stroke-width="12"/><path d="M960,900 L1060,900" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M1010,360 L1010,420" stroke="${INK}" stroke-width="6"/><rect x="975" y="410" width="70" height="120" rx="20" fill="#dff4ff" stroke="${INK}" stroke-width="5"/><rect x="982" y="470" width="56" height="52" rx="14" fill="#7cc242" opacity="0.85"/><path d="M1010,530 L1010,620 L930,640" fill="none" stroke="${INK}" stroke-width="4"/></g>`
      + R_(1180, 620, 300, 280, "#dfe4ee", 6, 10) + R_(1200, 440, 260, 180, "#0f1a2e", 7, 12) + `<path d="M1216,540 L1262,540 L1282,490 L1310,590 L1336,520 L1360,540 L1444,540" fill="none" stroke="#5af07a" stroke-width="6" stroke-linejoin="round"/><circle cx="1230" cy="470" r="8" fill="#ea4335"/>` + (night(o) ? `<rect x="-400" y="-400" width="2720" height="1880" fill="#0a0c24" opacity="0.4"/><circle cx="1330" cy="530" r="260" fill="#5af07a" opacity="0.18"/>` : `<circle cx="960" cy="200" r="620" fill="url(#rb-glow)" opacity="0.35"/>`) });
  RICH.livingRoom = (seed, o) => ({ far: room(o, "#e8c9a0", "#d6aa78", "#a8714a", "#5e3a20", 860) + windowAt(120, 140, 440, 360, (o || {}).time, "#7a3b4a") + R_(700, 160, 200, 150, "#fbfaf5", 6) + `<path d="M730,280 L790,200 L830,250 L860,220 L880,280Z" fill="#7fb0a8" stroke="${INK}" stroke-width="4"/>`,
    mid: `<ellipse cx="900" cy="990" rx="520" ry="50" fill="#d23a2e" stroke="${INK}" stroke-width="5" opacity="0.9"/>` + R_(620, 560, 640, 220, "#3d6fd1", 7, 28) + R_(600, 640, 100, 190, "#335ab0", 7, 24) + R_(1180, 640, 100, 190, "#335ab0", 7, 24) + R_(700, 700, 480, 130, "#4a7fe0", 6, 22) + R_(720, 590, 180, 130, "#f2b01e", 5, 18) + R_(1000, 590, 160, 130, "#ea4335", 5, 18) + R_(740, 870, 440, 24, "#8a5530", 6) + R_(760, 894, 24, 70, "#6a4325", 5) + R_(1136, 894, 24, 70, "#6a4325", 5)
      + R_(1380, 640, 430, 40, "#6a4325", 6) + R_(1400, 680, 390, 220, "#8a5530", 6) + R_(1430, 360, 340, 210, "#14141c", 9, 10) + `<rect x="1442" y="372" width="316" height="186" fill="#4fa0e8"/><path d="M1442,500 L1520,430 L1580,480 L1650,400 L1758,490 L1758,558 L1442,558Z" fill="#2c6fc0"/><rect x="1560" y="570" width="80" height="70" fill="#14141c" stroke="${INK}" stroke-width="4"/>`
      + R_(1860, 220, 120, 620, "#8a5530", 6) + [0, 1, 2, 3].map((i) => `<rect x="1870" y="${240 + i * 150}" width="100" height="10" fill="#6a4325"/><rect x="${1880 + (i % 2) * 8}" y="${180 + i * 150 + 20}" width="22" height="50" fill="${["#ea4335", "#4285f4", "#fbbc05", "#34a853"][i]}" stroke="${INK}" stroke-width="3"/>`).join("") + `<path d="M470,880 L470,560" stroke="${INK}" stroke-width="9"/><path d="M410,560 L530,560 L505,500 L435,500Z" fill="#fff3a8" stroke="${INK}" stroke-width="5"/>` + (night(o) ? `<rect x="-400" y="-400" width="2720" height="1880" fill="#0a0c24" opacity="0.4"/><circle cx="470" cy="520" r="360" fill="url(#rb-glow)" opacity="0.9"/><circle cx="1600" cy="470" r="420" fill="#4fa0e8" opacity="0.22"/>` : `<circle cx="340" cy="320" r="520" fill="url(#rb-glow)" opacity="0.4"/>`) });
  // ---------- extra places for the vehicles and machines ----------
  RICH.harbor = () => ({ far: `<defs><linearGradient id="rb-sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f8fd8"/><stop offset="1" stop-color="#0f3f86"/></linearGradient></defs>` + FULL("url(#rb-day)") + `<circle cx="1500" cy="200" r="520" fill="url(#rb-glow)" opacity="0.8"/>` + softCloud(200, 200, 0.9) + softCloud(1100, 130, 0.7) + `<path d="M-400,640 L2320,640 L2320,700 L-400,700Z" fill="#6aa0c8"/>`, mid: `<rect x="-400" y="640" width="2720" height="600" fill="url(#rb-sea)"/>` + Array.from({ length: 10 }, (_, i) => `<path d="M${-200 + i * 260},${700 + (i % 4) * 90} q40,-24 80,0 t80,0 t80,0" fill="none" stroke="#ffffff66" stroke-width="6" stroke-linecap="round"/>`).join("") });
  RICH.railway = () => ({ far: FULL("url(#rb-day)") + softCloud(300, 170, 0.8) + softCloud(1300, 120, 0.7) + `<path d="M-400,640 Q300,500 900,620 T2320,580 L2320,900 L-400,900Z" fill="#7fc25a" stroke="${INK}" stroke-width="5"/><path d="M-400,720 Q500,600 1200,700 T2320,680 L2320,900 L-400,900Z" fill="#5fa244"/>`, mid: `<rect x="-400" y="860" width="2720" height="300" fill="#8a7a66"/><rect x="-400" y="900" width="2720" height="14" fill="#4a4540" stroke="${INK}" stroke-width="3"/><rect x="-400" y="960" width="2720" height="14" fill="#4a4540" stroke="${INK}" stroke-width="3"/><g class="rb-scroll" data-scroll="340">${Array.from({ length: 20 }, (_, i) => `<rect x="${-400 + i * 170}" y="888" width="60" height="100" fill="#6a4325" stroke="${INK}" stroke-width="3"/>`).join("")}</g>` });
  const mach = (wall, floor) => `<defs><linearGradient id="rb-mw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wall[0]}"/><stop offset="1" stop-color="${wall[1]}"/></linearGradient><linearGradient id="rb-mf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${floor[0]}"/><stop offset="1" stop-color="${floor[1]}"/></linearGradient></defs>` + FULL("url(#rb-mw)") + `<rect x="-400" y="860" width="2720" height="400" fill="url(#rb-mf)"/><path d="M-400,860 L2320,860" stroke="${INK}" stroke-width="6"/>` + Array.from({ length: 10 }, (_, i) => `<rect x="${-200 + i * 260}" y="880" width="130" height="14" fill="#f2b01e" opacity="0.8"/>`).join("");
  RICH.factory = () => ({ far: mach(["#8da2b8", "#5d7088"], ["#6b6f7a", "#32343c"]) + Array.from({ length: 6 }, (_, i) => `<rect x="${60 + i * 330}" y="140" width="230" height="120" fill="#c5d3e0" stroke="${INK}" stroke-width="5"/><path d="M${60 + i * 330},200 L${290 + i * 330},200" stroke="${INK}" stroke-width="3"/>`).join("") + `<path d="M-400,70 L2320,70" stroke="${INK}" stroke-width="14"/><g transform="translate(1700,70)"><path d="M0,0 L0,140" stroke="${INK}" stroke-width="6"/><rect x="-60" y="140" width="120" height="36" fill="#f2b01e" stroke="${INK}" stroke-width="5"/></g>`, mid: `<circle cx="960" cy="480" r="620" fill="url(#rb-glow)" opacity="0.18"/>` });
  RICH.lab = () => ({ far: mach(["#e4f1f6", "#bcd6e0"], ["#d6dde2", "#9aa6b0"]) + R_(160, 150, 520, 300, "#fff", 8) + `<path d="M200,380 L300,300 L380,340 L480,230 L640,320" fill="none" stroke="#4285f4" stroke-width="7" stroke-linejoin="round"/>` + R_(1300, 140, 480, 340, "#10213a", 8) + `<path d="M1340,420 Q1450,200 1560,360 T1760,260" fill="none" stroke="#5af07a" stroke-width="7"/>`, mid: `<circle cx="960" cy="420" r="640" fill="url(#rb-glow)" opacity="0.3"/>` });
  RICH.stadium = (seed) => { const r = T.rng(seed || 17); const cols = ["#ea4335", "#4285f4", "#fbbc05", "#fff", "#34a853", "#ff7ac8"]; let rows = ""; for (let k = 0; k < 6; k++) { const y = 360 + k * 62; rows += `<rect x="-400" y="${y}" width="2720" height="66" fill="${k % 2 ? "#2a2f52" : "#222645"}"/>`; for (let x = -30 + (k % 2) * 22; x < 1960; x += 44) { const c = cols[Math.floor(r() * 6)]; rows += `<circle cx="${x}" cy="${y + 20}" r="14" fill="#f1c8a0" stroke="${INK}" stroke-width="2"/><path d="M${x - 17},${y + 66} q0,-26 17,-26 q17,0 17,26Z" fill="${c}" stroke="${INK}" stroke-width="2"/>`; } }
    return { far: `<defs><linearGradient id="rb-stad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0c1034"/><stop offset="1" stop-color="#2b3a7a"/></linearGradient><linearGradient id="rb-grass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4caf50"/><stop offset="1" stop-color="#2e7d32"/></linearGradient></defs>` + FULL("url(#rb-stad)") + [260, 700, 1160, 1600].map((x) => `<circle cx="${x}" cy="150" r="260" fill="url(#rb-glow)" opacity="0.7"/><rect x="${x - 70}" y="110" width="140" height="70" rx="8" fill="#fff6c0" stroke="${INK}" stroke-width="5"/>`).join("") + rows, mid: `<rect x="-400" y="740" width="2720" height="500" fill="url(#rb-grass)"/><path d="M-400,740 L2320,740" stroke="#fff" stroke-width="8"/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${-300 + i * 340}" y="740" width="170" height="500" fill="#ffffff12"/>`).join("") + `<ellipse cx="960" cy="960" rx="260" ry="60" fill="none" stroke="#fff" stroke-width="7"/>` }; };

  // ---------- crowds: o.crowd = {n, x0, x1, y, scale, walk:[t0,t1], seed, mix} of varied walking mascots (never the hero yellow) ----------
  function expandCrowd(o) {
    if (!o.crowd) return; const g = o.crowd, r = T.rng(g.seed || 31), n = Math.min(g.n || 12, 28), COLS = ["#e0402f", "#4285f4", "#34a853", "#8a5cff", "#ff6fb5", "#4fe8ff", "#f08a2a", "#2d2f4a", "#7a5a3a"];
    const items = Array.from({ length: n }, (_, i) => { const x = g.x0 + r() * (g.x1 - g.x0), dep = r(), col = COLS[Math.floor(r() * COLS.length)], t0 = (g.walk ? g.walk[0] : 0) + r() * 0.4, dx = (r() > (g.mix == null ? 0.5 : g.mix) ? 1 : -1) * (180 + r() * 340);
      return { name: "k" + i, style: "mascot", x, y: g.y + dep * 70, scale: (g.scale || 0.8) * (0.8 + dep * 0.35), shirt: col, hoodDark: "#00000040", skin: SKINS[Math.floor(r() * 5)], curl: r() > 0.8, glasses: r() > 0.78, face: 0.2, walk: g.still ? undefined : [t0, g.walk ? g.walk[1] : 2.5, dx], moods: [[0.1, ["smile", "flat", "grin", "open"][Math.floor(r() * 4)]]] }; }).sort((a, b) => a.y - b.y);
    o.chars = (o.chars || []).concat(items);
  }

  // ---------- weather / time-of-day overlays (screen space): rain, snow, fog, sunrise, stars ----------
  const WEATHER = {
    rain: (sid, dur) => { const r = T.rng(5); const tile = Array.from({ length: 46 }, () => { const x = r() * 2000 - 40, y = r() * 240; return `<path d="M${x.toFixed(0)},${y.toFixed(0)} l-16,46"/>`; }).join(""); return { svg: `<g id="${sid}-wx0"><rect x="0" y="0" width="1920" height="1080" fill="#102a5a" opacity="0.2"/></g><g id="${sid}-wx" stroke="#d6ebff" stroke-width="3.5" stroke-linecap="round" opacity="0.6" fill="none">${[0, 1, 2, 3, 4, 5].map((k) => `<g transform="translate(0,${k * 240 - 240})">${tile}</g>`).join("")}</g>`, anim: (tl) => tl.fromTo(`#${sid}-wx`, { y: 0 }, { y: 240, duration: 0.35, ease: "none", repeat: Math.ceil(dur / 0.35) }, 0) }; },
    snow: (sid, dur) => { const r = T.rng(8); const tile = (n, rr) => Array.from({ length: n }, () => `<circle cx="${(r() * 1960 - 20).toFixed(0)}" cy="${(r() * 360).toFixed(0)}" r="${(rr * (0.6 + r() * 0.8)).toFixed(1)}"/>`).join(""); return { svg: `<g id="${sid}-sx1" fill="#fff" opacity="0.9">${[0, 1, 2, 3].map((k) => `<g transform="translate(0,${k * 360 - 360})">${tile(34, 6)}</g>`).join("")}</g><g id="${sid}-sx2" fill="#fff" opacity="0.7">${[0, 1, 2, 3].map((k) => `<g transform="translate(0,${k * 360 - 360})">${tile(46, 3.5)}</g>`).join("")}</g>`, anim: (tl) => { tl.fromTo(`#${sid}-sx1`, { y: 0 }, { y: 360, duration: 3.2, ease: "none", repeat: Math.ceil(dur / 3.2) }, 0); tl.fromTo(`#${sid}-sx2`, { y: 0 }, { y: 360, duration: 5, ease: "none", repeat: Math.ceil(dur / 5) }, 0); tl.fromTo(`#${sid}-sx1`, { x: -14 }, { x: 14, duration: 1.4, ease: "sine.inOut", yoyo: true, repeat: Math.ceil(dur / 1.4) }, 0); } }; },
    fog: (sid, dur) => ({ svg: `<defs><linearGradient id="${sid}-fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#eef2f8" stop-opacity="0"/><stop offset="0.5" stop-color="#eef2f8" stop-opacity="0.75"/><stop offset="1" stop-color="#eef2f8" stop-opacity="0"/></linearGradient></defs><rect x="0" y="0" width="1920" height="1080" fill="#cfd8e4" opacity="0.28"/><g id="${sid}-fog"><rect x="-300" y="420" width="2520" height="280" fill="url(#${sid}-fg)"/><rect x="-300" y="640" width="2520" height="300" fill="url(#${sid}-fg)" opacity="0.85"/><rect x="-300" y="800" width="2520" height="280" fill="url(#${sid}-fg)" opacity="0.7"/></g>`, anim: (tl) => tl.fromTo(`#${sid}-fog`, { x: -90 }, { x: 90, duration: Math.max(2, dur), ease: "sine.inOut" }, 0) }),
    sunrise: (sid, dur) => ({ svg: `<defs><linearGradient id="${sid}-sr" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#ff8a3c" stop-opacity="0.6"/><stop offset="0.55" stop-color="#ffb35a" stop-opacity="0.22"/><stop offset="1" stop-color="#ffb35a" stop-opacity="0"/></linearGradient></defs><rect id="${sid}-srw" x="0" y="0" width="1920" height="1080" fill="url(#${sid}-sr)"/><g id="${sid}-sun"><circle cx="960" cy="800" r="720" fill="url(#rb-glow)"/><circle cx="960" cy="800" r="96" fill="#fff2b0"/></g>`, anim: (tl) => { tl.fromTo(`#${sid}-sun`, { y: 150, opacity: 0 }, { y: -90, opacity: 1, duration: Math.max(1, dur), ease: "sine.out" }, 0); tl.fromTo(`#${sid}-srw`, { opacity: 0 }, { opacity: 1, duration: Math.max(1, dur) * 0.8, ease: "none" }, 0); } }),
    stars: (sid, dur) => { const r = T.rng(13); const st = Array.from({ length: 70 }, (_, i) => `<circle class="${sid}-st${i % 6}" cx="${(r() * 1900 + 10).toFixed(0)}" cy="${(r() * 300 + 8).toFixed(0)}" r="${(1.5 + r() * 3).toFixed(1)}" fill="#fff"/>`).join(""); return { svg: `<g opacity="0.95">${st}<path d="M1700,90 a56,56 0 1,0 40,90 a44,44 0 1,1 -40,-90Z" fill="#fbf3c8"/></g>`, anim: (tl) => { for (let k = 0; k < 6; k++) tl.fromTo(`.${sid}-st${k}`, { opacity: 0.25 }, { opacity: 1, duration: 0.5 + k * 0.17, ease: "sine.inOut", yoyo: true, repeat: Math.ceil(dur / (0.5 + k * 0.17)) }, k * 0.11); } }; },
  };


  // =====================================================================================
  // THUMBNAIL scene type: hero + 2-word reaction text (last word yellow) + number badge + speed lines + glow
  // spec: {"type":"thumb","bg":...,"text":["TOO","SLOW."],"badge":"10x","lines":{"dir":"left"},"glow":{x,y,r,col},"arrow":{x,y,rot},"burst":{x,y,r},"chars":[{...,"pose":"run"}]}
  // =====================================================================================
  RICH.white = () => ({ far: `<defs><linearGradient id="rb-wh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#e3e8f2"/></linearGradient></defs>` + FULL("url(#rb-wh)"), mid: `<ellipse cx="960" cy="1010" rx="1100" ry="60" fill="#9aa6bd" opacity="0.28"/><path d="M-400,1000 L2320,1000" stroke="#c7cfdd" stroke-width="4"/>` });
  const POSES = {
    stand: {}, run: { side: true, tilt: -6, l: 60, r: -70, ll: 34, lr: -34 }, punch: { side: true, tilt: -3, l: 55, r: -95, ll: 22, lr: -22 },
    float: { side: true, tilt: 72, l: 168, r: -168, ll: 8, lr: -8 }, cross: { l: -52, r: 52 }, point: { side: true, l: 12, r: -108 }, shock: { l: 150, r: -150 },
  };
  function applyPoses(tl, o, sid) {
    (o.chars || []).forEach((c, i) => {
      const P = c.pose && POSES[c.pose]; if (!P) return; const id = `${sid}-c${i}`, sgn = c.flip ? -1 : 1;
      if (P.l != null) T.armSet(tl, id, "l", P.l); if (P.r != null) T.armSet(tl, id, "r", P.r);
      if (P.ll != null) { tl.set(`#${id}-ll`, { rotation: P.ll, svgOrigin: "-14 -76" }, 0); tl.set(`#${id}-lr`, { rotation: P.lr, svgOrigin: "14 -76" }, 0); }
      if (P.tilt) tl.set(`#${id}-pos`, { rotation: P.tilt * sgn, svgOrigin: `${c.x || 0} ${c.y || 0}` }, 0);
    });
  }
  S.thumb = {
    svg: ({ o, id }) => { const r = T.rng(o.seed || 3); let g = "";
      if (o.glow) { const G = o.glow; g += `<defs><radialGradient id="${id("gl")}"><stop offset="0" stop-color="${G.col || "#4fe8ff"}" stop-opacity="0.85"/><stop offset="1" stop-color="${G.col || "#4fe8ff"}" stop-opacity="0"/></radialGradient></defs><circle cx="${G.x || 1200}" cy="${G.y || 560}" r="${G.r || 560}" fill="url(#${id("gl")})"/>`; }
      if (o.lines) { const L = o.lines, dir = L.dir === "right" ? 1 : -1, n = L.n || 16; for (let i = 0; i < n; i++) { const y = 80 + r() * 900, len = 360 + r() * 700, x0 = dir < 0 ? 1920 - r() * 500 : r() * 500, w = 4 + r() * 10; g += `<path d="M${x0},${y} L${x0 + dir * len},${y - w / 2} L${x0 + dir * len},${y + w / 2}Z" fill="${L.col || "#ffffff"}" opacity="${(0.25 + r() * 0.4).toFixed(2)}"/>`; } }
      if (o.burst) { const B = o.burst, n = 14; let pts = ""; for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? (B.r || 200) * 0.55 : (B.r || 200); pts += `${(B.x + rr * Math.cos(a)).toFixed(0)},${(B.y + rr * Math.sin(a)).toFixed(0)} `; } g += `<polygon points="${pts}" fill="${B.col || "#ffd400"}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>`; }
      return g; },
    build() {},
    top: ({ o }) => { let out = "";
      if (o.text) { const words = Array.isArray(o.text) ? o.text : String(o.text).split(" "), lines = Array.isArray(o.text) ? o.text : [words.slice(0, -1).join(" "), words[words.length - 1]].filter(Boolean), fs = o.textSize || 200, pos = o.textPos || "bl", x = pos.endsWith("l") ? 70 : 1850, anchor = pos.endsWith("l") ? "start" : "end", yB = pos.startsWith("b") ? 1030 : 70 + fs * lines.length * 0.95;
        out += `<g font-family="Kalam" font-weight="700" transform="rotate(${o.textRot == null ? -3 : o.textRot} ${x} ${yB})">` + lines.map((ln, i) => { const y = yB - (lines.length - 1 - i) * fs * 0.92, last = i === lines.length - 1; return `<text x="${x + 8}" y="${y + 10}" font-size="${fs}" text-anchor="${anchor}" fill="#000" opacity="0.45" stroke="#000" stroke-width="${fs * 0.14}" stroke-linejoin="round">${esc(ln)}</text><text x="${x}" y="${y}" font-size="${fs}" text-anchor="${anchor}" fill="${last ? (o.accent || "#ffd400") : "#ffffff"}" stroke="#0b0620" stroke-width="${fs * 0.12}" paint-order="stroke" stroke-linejoin="round">${esc(ln)}</text>`; }).join("") + `</g>`; }
      if (o.badge) { const bs = o.badgeSize || 230, bx = o.badgeX || 1830, by = o.badgeY || 270; out += `<g font-family="Kalam" font-weight="700" transform="rotate(6 ${bx} ${by})"><text x="${bx}" y="${by}" font-size="${bs}" text-anchor="end" fill="${o.badgeCol || "#ffffff"}" stroke="#0b0620" stroke-width="${bs * 0.13}" paint-order="stroke" stroke-linejoin="round">${esc(o.badge)}</text></g>`; }
      if (o.arrow) { const A = o.arrow; out += `<g transform="translate(${A.x},${A.y}) rotate(${A.rot || 0}) scale(${A.k || 1})"><path d="M-170,-26 L40,-26 L40,-78 L170,0 L40,78 L40,26 L-170,26Z" fill="${A.col || "#e0262a"}" stroke="#0b0620" stroke-width="9" stroke-linejoin="round"/></g>`; }
      return out; },
  };

  // ---------- mount: build a whole scene into #sid-svg ----------
  function mount(sid, o) {
    expandGroup(o);
    const M = S[o.type]; if (!M) throw new Error("unknown scene type " + o.type);
    const id = (n) => `${sid}-${n}`, ctx = { sid, o, id, t: o.t || {} }, dur = o.dur || 5;
    const svg = q(`#${sid}-svg`);
    const WXk = o.weather && (typeof o.weather === "string" ? o.weather : o.weather.type), WX = WXk && WEATHER[WXk] ? WEATHER[WXk](sid, dur) : null;
    const RB = RICH[o.bg] ? RICH[o.bg](o.seed, o) : null;
    const back = RB ? DEFS + (RB.defs ? `<defs>${RB.defs}</defs>` : "") + `<g id="${sid}-far">${RB.far}</g><g id="${sid}-mid">${RB.mid}</g>${o.exposure ? `<rect x="-400" y="-400" width="2720" height="1880" fill="#2a1030" opacity="${o.exposure}"/>` : ""}${(o.lights || []).map((L) => `<circle cx="${L[0]}" cy="${L[1]}" r="${L[2]}" fill="url(#rb-glow)" opacity="${L[3] == null ? 0.7 : L[3]}"/>`).join("")}` : (o.bg === false ? "" : bg(o.bg || "teal", o.seed)) + (o.theme && THEMES[o.theme] ? THEMES[o.theme]() : "");
    svg.innerHTML = `<g id="${sid}-cam">${back}${o.charsBehind ? chars(o, sid) : ""}${M.svg(ctx)}${propsHtml(sid, o, false)}${o.charsBehind ? "" : chars(o, sid)}${propsHtml(sid, o, true)}${tagsSvg(o, sid)}${o.extra || ""}</g>${M.over ? M.over(ctx) : ""}${WX ? WX.svg : ""}${RB ? VIG + (RB.heavy ? VIG : "") : ""}${M.top ? M.top(ctx) : ""}`;
    const tl = gsap.timeline({ paused: true });
    const C = T.cam(tl, `#${sid}-cam`, Object.assign({ fx: 960, fy: 540, k: 1.04 }, o.cam || {}));
    if (RB) { tl.fromTo(`#${sid}-far`, { x: 22 }, { x: -22, duration: dur, ease: "none" }, 0); tl.fromTo(`#${sid}-mid`, { x: 10 }, { x: -10, duration: dur, ease: "none" }, 0); }
    document.querySelectorAll(`#${sid}-svg .rb-scroll`).forEach((el) => tl.fromTo(el, { x: 0 }, { x: -Number(el.dataset.scroll || 300), duration: dur, ease: "none" }, 0));
    (o.camMoves || []).forEach((m) => C.to(m.t, m.dur, { fx: m.fx, fy: m.fy, k: m.k }, m.ease));
    if (o.drift !== false && !o.say && !o.camMoves && o.type !== "mapTo") C.to(0.3, Math.max(0.5, dur / T.SLOW - 0.3), Object.assign({ k: 1.1, fx: 980 }, o.drift || {}), "sine.inOut");
    M.build(tl, ctx, C);
    animChars(tl, o, sid, dur); tagsAnim(tl, o, sid, dur);
    applySay(tl, o, sid, C);
    animProps(tl, sid, o, dur); applyPoses(tl, o, sid); if (WX) WX.anim(tl);
    intro(tl, sid, o.in);
    if (o.custom) o.custom(tl, ctx, C, T);
    window.__timelines[sid] = tl;
    return { tl, C };
  }

  window.S = Object.assign(S, { ICONS, GC, mount, bg, intro, card, txt, mark, popIn: pop, slamIn: slam, show, counterTo, fit });
})();
