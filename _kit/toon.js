// toon.js — shared 2D cartoon kit for this film (flat fills, bold ink outline, bean characters).
// Everything is deterministic: no clocks, no unseeded randomness. Scenes build SVG strings with these
// helpers synchronously, then animate the ids with GSAP on their own paused timeline.
(function () {
  // pivots set with svgOrigin must never shift an element that is already transformed (that drift moved props off their marks)
  if (window.gsap) gsap.defaults({ smoothOrigin: false });
  // SLOW: every helper-made move lasts this much longer (clip 2+ = 1.15, the user's 'slightly slower').
  // Start times stay on the voice; only durations stretch. Use d(x) for hand-written tween durations too.
  const SLOW = 1.15;
  const d = (x) => x * SLOW;
  const INK = '#2b2622';
  const SW = 5; // outline width at 1x

  // seeded random (mulberry32) so crowds/props vary but every render matches
  function rng(seed) {
    let a = seed >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const S = (o) => `stroke="${INK}" stroke-width="${o || SW}" stroke-linejoin="round" stroke-linecap="round"`;

  // ---------- hair ----------
  function hair(style, col) {
    const s = S();
    switch (style) {
      case 'short':
        return `<path ${s} fill="${col}" d="M-61,-6 C-68,-58 -24,-80 8,-74 C48,-68 68,-40 62,-6 C54,-26 34,-38 6,-40 C-22,-42 -46,-30 -61,-6Z"/>`;
      case 'side': // parted, swoop like the reference lead
        return `<path ${s} fill="${col}" d="M-62,0 C-70,-60 -20,-84 18,-76 C58,-68 70,-36 63,-2 C58,-20 48,-30 30,-34 C10,-30 -18,-44 -34,-34 C-48,-26 -56,-14 -62,0Z"/>`;
      case 'bald':
        return `<path ${s} fill="${col}" d="M-61,4 C-64,-14 -58,-26 -52,-30 C-50,-18 -52,-6 -50,8Z"/><path ${s} fill="${col}" d="M61,4 C64,-14 58,-26 52,-30 C50,-18 52,-6 50,8Z"/>`;
      case 'grey':
        return `<path ${s} fill="${col}" d="M-62,6 C-72,-50 -36,-80 4,-76 C44,-74 70,-48 63,4 C58,-16 50,-28 36,-30 C30,-44 -10,-50 -30,-36 C-46,-30 -56,-12 -62,6Z"/>`;
      case 'bun': // tied back
        return `<circle ${s} fill="${col}" cx="0" cy="-70" r="22"/><path ${s} fill="${col}" d="M-62,0 C-68,-56 -28,-78 4,-76 C44,-74 68,-48 62,0 C56,-24 30,-40 0,-40 C-30,-40 -54,-24 -62,0Z"/>`;
      case 'helmet':
        return `<path ${s} fill="#f4c430" d="M-70,-14 C-70,-70 -30,-88 0,-88 C30,-88 70,-70 70,-14Z"/><path ${s} fill="#f4c430" d="M-80,-14 L80,-14 L80,-2 L-80,-2Z"/><path stroke="${INK}" stroke-width="4" fill="none" d="M0,-88 L0,-20"/>`;
      default:
        return '';
    }
  }


  // ---------- mascot: expressive hero with hoodie, curl, big glossy eyes, shading + rim light (same ids as char) ----------
  function mascotChar(o) {
    const id = o.id, PI = '#2a1f3d', skin = o.skin || '#fff6ea', hood = o.shirt || '#ffc933', hoodDark = o.hoodDark || '#e09a00', pants = o.pants || '#2f2d5a';
    const view = o.view || 'front';
    const V = !!o.vol; // semi-3D: form shading, specular highlights, rim lights, ambient occlusion, soft contact shadow
    // 2.5D light: rim colour (o.rim) on the lit side (o.lightSide 'right' default), fill colour (o.fill) on the other
    const LS = o.lightSide === 'left' ? -1 : 1, RIM = o.rim || '#8be9ff', FIL = o.fill || '#ffd29a', RIMR = LS > 0 ? RIM : FIL, RIML = LS > 0 ? FIL : RIM;
    // cast looks: outfit hoodie|tee|shirt|suit|coat|apron|vest|cardigan|uniform|dress, build slim|wide|kid
    const outfit = o.outfit || 'hoodie', hoodie = outfit === 'hoodie', SHORT = outfit === 'tee' || outfit === 'dress', SLV = outfit === 'coat' ? '#f4f6fa' : hood;
    const KID = o.build === 'kid', bw = { slim: 0.86, wide: 1.17 }[o.build] || 1, HK = KID ? 1.42 : (o.headK || 1.22), TALL = o.tall || 1, LIFT = Math.round((TALL - 1) * 260), HIP = -76 - LIFT, HY = KID ? -268 : Math.round(-206 - 62 * HK);  // tall: extra height goes into the legs; body + head lift together (neck joint and arm reach stay the same)
    // ---- age: 0 = young; ~15 first lines, 30 glasses + grey tufts, 50 grey brows, 60+ white hair + cane + stoop ----
    const age = o.age || 0, AT = Math.min(1, age / 70);
    const canePath = `<path d="M0,-4 L0,92" stroke="${PI}" stroke-width="11" stroke-linecap="round"/><path d="M0,-4 L0,92" stroke="#b4783a" stroke-width="6" stroke-linecap="round"/><path d="M-15,-6 Q-15,-24 0,-24 Q15,-24 15,-8" fill="none" stroke="${PI}" stroke-width="11" stroke-linecap="round"/><path d="M-15,-6 Q-15,-24 0,-24 Q15,-24 15,-8" fill="none" stroke="#b4783a" stroke-width="6" stroke-linecap="round"/>`;
    if (o.hold === 'mug' && !o.prop) o = Object.assign({}, o, { prop: { side: o.holdSide || 'r', svg: `<g transform="translate(0,-6)"><path d="M14,-26 q22,0 22,18 q0,18 -22,18" fill="none" stroke="${PI}" stroke-width="7"/><rect x="-22" y="-34" width="40" height="48" rx="7" fill="#f4f1ea" stroke="${PI}" stroke-width="5"/><path d="M-12,-14 l6,-6 l6,6" fill="none" stroke="#c9c2b0" stroke-width="3"/></g>` } });
    if ((o.cane || age >= 55) && o.cane !== false && !o.prop) o = Object.assign({}, o, { prop: { side: 'r', svg: canePath } });
    const hairC = age >= 60 ? '#f2f0fa' : age >= 40 ? '#cfccdc' : '#a8a3bd', curlCol = age >= 20 ? hairC : PI, browCol = age >= 40 ? '#a29cbc' : PI;
    const tuft = (x, s) => `<ellipse stroke="${PI}" stroke-width="4" stroke-linejoin="round" fill="${hairC}" cx="${x}" cy="-6" rx="17" ry="${(24 + AT * 6).toFixed(1)}" transform="rotate(${s * 14} ${x} -6)"/>`;
    const tufts = age < 25 || (o.hair && o.hair !== 'bald') ? '' : view === 'side' ? tuft(-60, -1) : tuft(-62, -1) + tuft(62, 1);
    const ageSkin = age >= 15 ? `<ellipse cx="0" cy="0" rx="68" ry="62" fill="#9a7a58" opacity="${(0.04 + 0.2 * AT).toFixed(2)}"/>${age >= 50 ? `<circle cx="-40" cy="-26" r="3.5" fill="#8a6540" opacity="0.7"/><circle cx="46" cy="-12" r="3" fill="#8a6540" opacity="0.7"/><circle cx="-22" cy="-44" r="2.5" fill="#8a6540" opacity="0.7"/>` : ''}` : '';
    const wo = (0.18 + 0.6 * AT).toFixed(2), ww = (2.2 + 1.8 * AT).toFixed(1);
    const ageFace = age >= 10 ? `<g fill="none" stroke="#5a4636" stroke-width="${ww}" stroke-linecap="round" opacity="${wo}"><path d="M-30,-48 Q-16,-54 -4,-48 M4,-48 Q16,-54 30,-48"/>${age >= 25 ? '<path d="M-44,-8 l-12,-5 M-44,-1 l-13,0 M-44,6 l-12,5 M44,-8 l12,-5 M44,-1 l13,0 M44,6 l12,5"/>' : ''}${age >= 35 ? '<path d="M-38,26 Q-22,36 -6,26 M6,26 Q22,36 38,26"/><path d="M-34,12 Q-44,28 -32,44 M34,12 Q44,28 32,44"/>' : ''}${age >= 55 ? '<path d="M-24,-58 Q0,-66 24,-58"/>' : ''}</g>` : '';
    const stoop = view === 'side' ? 12 * AT : view === 'q3' ? 5 * AT : 0;
    const face = o.face == null ? 0.3 : o.face, fx = 12 * face, st = (w) => `stroke="${PI}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
    const H = o.hair && o.hair !== 'bald' ? o.hair : null, HCOL = o.hairCol || (age >= 60 ? '#e8e6f0' : age >= 45 ? '#a7a3b5' : '#3b2a20');
    const capD = 'M-69,-6 C-74,-54 -40,-74 0,-74 C40,-74 74,-54 69,-6 C58,-30 34,-42 0,-42 C-34,-42 -58,-30 -69,-6Z';
    const hairBack = !H ? '' : H === 'fluffy' ? `<g ${st(4.5)} fill="${HCOL}">${[[-64, -40, 18], [64, -40, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>` : H === 'long' ? `<path ${st(5)} fill="${HCOL}" d="M-70,-14 C-80,40 -72,84 -52,92 L52,92 C72,84 80,40 70,-14Z"/>`
      : H === 'ponytail' ? `<path ${st(5)} fill="${HCOL}" d="M-58,-44 C-108,-34 -114,40 -86,82 C-82,40 -72,10 -50,-10Z"/>` : '';
    const hairFront = !H ? '' : view === 'back' ? `<ellipse ${st(5)} fill="${HCOL}" cx="0" cy="-1" rx="69" ry="63"/>` + (H === 'bun' ? `<circle ${st(5)} fill="${HCOL}" cx="0" cy="-74" r="22"/>` : '')
      : (H === 'fluffy' ? `<path fill="${HCOL}" d="M-70,-6 C-76,-62 -40,-84 0,-84 C40,-84 76,-62 70,-6 C62,-30 44,-44 0,-46 C-44,-44 -62,-30 -70,-6Z"/><g ${st(4.5)} fill="${HCOL}">${[[-56, -52, 19], [-36, -72, 21], [-12, -84, 22], [14, -84, 22], [38, -74, 21], [57, -54, 18]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><g ${st(4)} fill="${HCOL}">${[[-30, -50, 14], [-8, -56, 15], [16, -53, 14], [36, -48, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g><path d="M-40,-60 q8,-8 16,0 M-6,-66 q8,-8 16,0 M26,-62 q8,-8 16,0" fill="none" stroke="#ffffff" stroke-opacity="0.25" stroke-width="4" stroke-linecap="round"/>`
        : H === 'side' ? `<path ${st(5)} fill="${HCOL}" d="M-70,2 C-76,-52 -36,-76 8,-74 C50,-72 76,-46 70,-4 C64,-24 52,-32 40,-34 C16,-26 -14,-46 -34,-38 C-52,-32 -64,-18 -70,2Z"/>`
        : H === 'spiky' ? `<path ${st(5)} fill="${HCOL}" d="M-69,-6 C-72,-40 -62,-56 -52,-62 L-48,-86 L-32,-68 L-18,-94 L-4,-72 L10,-96 L22,-70 L38,-90 L44,-64 L60,-74 L57,-52 C70,-40 72,-24 69,-6 C58,-30 34,-42 0,-42 C-34,-42 -58,-30 -69,-6Z"/>`
        : H === 'curly' ? `<g ${st(4)} fill="${HCOL}">${[-62, -46, -28, -9, 10, 29, 47, 63].map((x, i) => `<circle cx="${x}" cy="${(-24 - Math.sqrt(Math.max(0, 1 - (x / 74) ** 2)) * 40).toFixed(1)}" r="${i % 2 ? 21 : 18}"/>`).join('')}</g><path fill="${HCOL}" d="${capD}"/>`
        : `<path ${st(5)} fill="${HCOL}" d="${capD}"/>`) + (H === 'bun' ? `<circle ${st(5)} fill="${HCOL}" cx="0" cy="-84" r="22"/>` : '');
    const hatC = o.hatCol || ({ hardhat: '#f5c400', chef: '#ffffff', cap: '#2d3a6a', beanie: '#c0392b', bowler: '#26222a', cop: '#1f2a4a' }[o.hat] || '#2d3a6a'), bx = view === 'side' ? 1 : 0;
    const HAT = !o.hat ? '' : o.hat === 'cap' || o.hat === 'cop' ? `<path ${st(5)} fill="${hatC}" d="M-67,-34 C-70,-74 -36,-90 0,-90 C36,-90 70,-74 67,-34Z"/>${view === 'back' ? '' : bx ? `<path ${st(5)} fill="${hatC}" d="M40,-40 L112,-30 C108,-20 60,-22 40,-30Z"/>` : `<ellipse ${st(5)} fill="${hatC}" cx="${fx * 1.6}" cy="-36" rx="62" ry="13"/>`}${o.hat === 'cop' ? `<path d="M-6,-72 l6,-10 l6,10 l-6,8Z" fill="#f2c14e" stroke="${PI}" stroke-width="2.5"/>` : ''}`
      : o.hat === 'beanie' ? `<path ${st(5)} fill="${hatC}" d="M-68,-38 C-72,-80 -38,-98 0,-98 C38,-98 72,-80 68,-38Z"/><path ${st(4)} fill="${hatC}" d="M-70,-54 L70,-54 L70,-34 L-70,-34Z" opacity="0.92"/><circle ${st(4)} fill="${hatC}" cx="0" cy="-102" r="13"/>`
      : o.hat === 'hardhat' ? `<path ${st(5)} fill="${hatC}" d="M-64,-40 C-66,-84 -32,-98 0,-98 C32,-98 66,-84 64,-40Z"/><path d="M0,-98 L0,-44" stroke="${PI}" stroke-width="5" opacity="0.5"/><ellipse ${st(5)} fill="${hatC}" cx="0" cy="-40" rx="86" ry="12"/>`
      : o.hat === 'chef' ? `<path ${st(5)} fill="${hatC}" d="M-48,-42 C-86,-66 -64,-128 -24,-114 C-14,-146 26,-146 32,-114 C70,-128 86,-66 48,-42Z"/><path ${st(5)} fill="${hatC}" d="M-50,-60 L50,-60 L50,-38 L-50,-38Z"/>`
      : `<path ${st(5)} fill="${hatC}" d="M-50,-44 C-54,-96 54,-96 50,-44Z"/><ellipse ${st(5)} fill="${hatC}" cx="0" cy="-42" rx="84" ry="13"/><path d="M-50,-56 L50,-56" stroke="#7a1f45" stroke-width="7"/>`;
    const STACHE = o.stache === 'curl' ? `<path fill="none" stroke="${HCOL}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" d="M${fx - 3},19 Q${fx - 14},15 ${fx - 24},20 Q${fx - 30},23 ${fx - 32},16 M${fx + 3},19 Q${fx + 14},15 ${fx + 24},20 Q${fx + 30},23 ${fx + 32},16"/>` : o.stache ? `<path ${st(3.5)} fill="${HCOL}" d="M${fx - 24},20 C${fx - 13},8 ${fx - 3},12 ${fx},16 C${fx + 3},12 ${fx + 13},8 ${fx + 24},20 C${fx + 12},26 ${fx - 12},26 ${fx - 24},20Z"/>` : '';
    const BEARD = o.beard === 'goatee' ? `<ellipse cx="${fx}" cy="34" rx="46" ry="24" fill="${HCOL}" opacity="0.13"/><path ${st(3)} fill="${HCOL}" d="M${fx - 10},46 Q${fx},60 ${fx + 10},46 Q${fx},51 ${fx - 10},46Z"/>` : o.beard ? `<path ${st(4)} fill="${HCOL}" d="M${fx - 60},4 C${fx - 58},78 ${fx + 58},78 ${fx + 60},4 C${fx + 40},24 ${fx - 40},24 ${fx - 60},4Z"/>` : '';
    const leg = (side) => { const x = side === 'l' ? -20 : 20, dir = side === 'l' ? -1 : 1;
      return `<g id="${id}-l${side === 'l' ? 'l' : 'r'}" data-hy="${HIP}"><path d="M${x},${HIP} L${x},-16" fill="none" stroke="${PI}" stroke-width="${(o.legW || 13) + 7}" stroke-linecap="round"/><path d="M${x},${HIP} L${x},-16" fill="none" stroke="${pants}" stroke-width="${o.legW || 13}" stroke-linecap="round"/>${V ? `<path d="M${x - 3.5},${HIP + 4} L${x - 3.5},-22" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="3.5" stroke-linecap="round"/>` : ''}
        <path ${st(4)} fill="#fff" d="M${x - 18},-4 C${x - 18},-24 ${x + 14},-26 ${x + 20},-12 L${x + 22},0 L${x - 18},0Z" transform="${side === 'r' ? '' : ''}"/><path d="M${x - 18},-4 L${x + 22},-4" stroke="${hood}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 6},-20 l6,5 M${x + 4},-22 l6,5" stroke="${PI}" stroke-width="3" stroke-linecap="round"/></g>`; };
    const arm = (side) => { const x = side === 'l' ? -48 : 48, k = side === 'l' ? -6 : 6;
      return `<g id="${id}-a${side}" data-sx="${x}" data-sy="-190">
        <path d="M${x},-190 Q${x + k},-142 ${x},-100" fill="none" stroke="${PI}" stroke-width="26" stroke-linecap="round"/><path d="M${x},-190 Q${x + k},-142 ${x},-100" fill="none" stroke="${SHORT ? skin : SLV}" stroke-width="18" stroke-linecap="round"/>${SHORT ? `<path d="M${x},-190 L${x},-160" fill="none" stroke="${PI}" stroke-width="28" stroke-linecap="round"/><path d="M${x},-190 L${x},-160" fill="none" stroke="${hood}" stroke-width="20" stroke-linecap="round"/>` : ''}${V ? `<path d="M${x - 5},-186 Q${x + k - 5},-142 ${x - 5},-106" fill="none" stroke="#fff" stroke-opacity="0.32" stroke-width="4" stroke-linecap="round"/><path d="M${x + 6},-186 Q${x + k + 6},-142 ${x + 6},-106" fill="none" stroke="#3a1a00" stroke-opacity="0.2" stroke-width="4" stroke-linecap="round"/>` : ''}
        ${o.roll ? `<path d="M${x + k * 0.6},-136 Q${x + k * 0.4},-118 ${x},-100" fill="none" stroke="${PI}" stroke-width="24" stroke-linecap="round"/><path d="M${x + k * 0.6},-136 Q${x + k * 0.4},-118 ${x},-100" fill="none" stroke="${skin}" stroke-width="16" stroke-linecap="round"/><path d="M${x + k * 0.7 - 15},-140 L${x + k * 0.7 + 15},-140" stroke="${PI}" stroke-width="20" stroke-linecap="round"/><path d="M${x + k * 0.7 - 13},-140 L${x + k * 0.7 + 13},-140" stroke="${hoodDark}" stroke-width="12" stroke-linecap="round"/>${side === 'l' ? `<rect x="${x - 10}" y="-112" width="20" height="9" rx="3" fill="#c9c9d4" stroke="${PI}" stroke-width="3"/>` : ''}` : `<path d="M${x - 11},-104 L${x + 11},-104" stroke="${SHORT ? skin : outfit === 'coat' ? '#d7dce6' : hoodDark}" stroke-width="7" stroke-linecap="round"/>`}<circle ${st(4)} fill="${skin}" cx="${x}" cy="-90" r="13"/>
        ${o.prop && o.prop.side === side ? `<g id="${id}-prop" transform="translate(${x},-90)">${o.prop.svg}</g>` : ''}</g>`; };
    const torsoD = 'M-52,-206 C-62,-140 -64,-98 -48,-68 L48,-68 C64,-98 62,-140 52,-206 C36,-224 -36,-224 -52,-206Z';
    const torso = `<defs><linearGradient id="${id}-tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a1a00" stop-opacity="0.3"/></linearGradient></defs>
      <path ${st(5)} fill="${hood}" d="${torsoD}"/><path d="${torsoD}" fill="url(#${id}-tg)"/>
      <path ${st(5)} fill="${hoodDark}" d="M-54,-212 C-40,-240 40,-240 54,-212 C30,-196 -30,-196 -54,-212Z"/>
      <g id="${id}-str"><path ${st(4)} fill="none" d="M-14,-204 L-17,-158 M14,-204 L17,-158"/><circle cx="-17" cy="-154" r="5" fill="#fff" stroke="${PI}" stroke-width="3"/><circle cx="17" cy="-154" r="5" fill="#fff" stroke="${PI}" stroke-width="3"/></g>
      <path ${st(4)} fill="${hoodDark}" fill-opacity="0.55" d="M-38,-122 C-30,-98 30,-98 38,-122"/><path d="M-40,-100 L-30,-90 M40,-100 L30,-90" stroke="${PI}" stroke-width="4" stroke-linecap="round"/>
      <path d="M52,-196 C62,-150 64,-110 50,-76" fill="none" stroke="${RIMR}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
    const M = (k) => ({
      flat: `<path ${st(4.5)} fill="none" d="M${fx - 10},30 L${fx + 10},30"/>`,
      smile: `<path ${st(4.5)} fill="none" d="M${fx - 14},26 Q${fx},40 ${fx + 14},26"/>`,
      grin: `<path ${st(4.5)} fill="#7a1f45" d="M${fx - 18},24 Q${fx},56 ${fx + 18},24Z"/><path d="M${fx - 9},38 Q${fx},34 ${fx + 9},38 Q${fx},47 ${fx - 9},38Z" fill="#ff7aa0"/>`,
      open: `<ellipse ${st(4.5)} fill="#7a1f45" cx="${fx}" cy="32" rx="10" ry="12"/><ellipse cx="${fx}" cy="38" rx="6" ry="4" fill="#ff7aa0"/>`,
      frown: `<path ${st(4.5)} fill="none" d="M${fx - 13},36 Q${fx},24 ${fx + 13},36"/>`,
      shock: `<ellipse ${st(4.5)} fill="#7a1f45" cx="${fx}" cy="34" rx="13" ry="17"/><ellipse cx="${fx}" cy="42" rx="8" ry="5" fill="#ff7aa0"/>`,
      wail: `<path ${st(4.5)} fill="#7a1f45" d="M${fx - 20},42 Q${fx},12 ${fx + 20},42Z"/>`,
      gritted: `<rect x="${fx - 19}" y="24" width="38" height="19" rx="6" fill="#fff" stroke="${PI}" stroke-width="4.5"/><path d="M${fx - 6},24 L${fx - 6},43 M${fx + 6},24 L${fx + 6},43 M${fx - 19},33.5 L${fx + 19},33.5" stroke="${PI}" stroke-width="3"/>`,
      wave: `<path ${st(4.5)} fill="none" d="M${fx - 18},32 q4.5,-9 9,0 t9,0 t9,0 t9,0"/>`,
      smirk: `<path ${st(4.5)} fill="none" d="M${fx - 14},33 Q${fx + 4},38 ${fx + 17},24"/>`,
    })[k];
    const mood = o.mood || 'flat';
    const mouthSvg = ['flat', 'smile', 'grin', 'open', 'frown', 'shock', 'wail', 'gritted', 'wave', 'smirk'].map((k) => `<g id="${id}-m-${k}" opacity="${k === mood ? 1 : 0}">${M(k)}</g>`).join('');
    const eye = (cx) => `<ellipse fill="#fff" stroke="${PI}" stroke-width="4" cx="${cx}" cy="0" rx="15" ry="19"/><path d="M${cx - 16},-6 Q${cx},-27 ${cx + 16},-6" fill="none" stroke="${PI}" stroke-width="6" stroke-linecap="round"/><path d="M${cx + (cx < 0 ? -16 : 16)},-6 l${cx < 0 ? -6 : 6},-5" stroke="${PI}" stroke-width="4.5" stroke-linecap="round"/>`;
    const PK = o.eyes === 'dark' ? 1.35 : 1;
    const pupil = (cx) => `<ellipse fill="${PI}" cx="${cx}" cy="2" rx="${9 * PK}" ry="${12.5 * PK}"/><circle fill="#fff" cx="${cx - 3.5}" cy="-4" r="4.2"/><circle fill="#fff" cx="${cx + 3.5}" cy="6" r="2"/>`;
    const glasses = (o.glasses || (age >= 30 && o.glasses !== false)) ? `<g ${st(3.5)} fill="rgba(255,255,255,0.18)"><circle cx="${fx - 20}" cy="-2" r="20"/><circle cx="${fx + 20}" cy="-2" r="20"/><path fill="none" d="M${fx},-2 L${fx},-2"/></g>` : '';
    const curl = (o.curl === false || (o.hair && o.curl !== true)) ? '' : `<path stroke="${curlCol}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round" fill="none" d="M0,-58 C-4,-84 22,-98 30,-80 C36,-66 16,-62 18,-74"/>`;

    const heartP = (cx) => `<path d="M${cx},12 C${cx - 24},-6 ${cx - 14},-26 ${cx},-12 C${cx + 14},-26 ${cx + 24},-6 ${cx},12Z" fill="#ff4f9a" stroke="${PI}" stroke-width="3.5"/>`;
    const spiralP = (cx) => { let d = ''; for (let a = 0; a <= Math.PI * 6; a += 0.4) { const rr = 1.2 + a * 0.95; d += (a ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ',' + (rr * Math.sin(a)).toFixed(1); } return `<ellipse fill="#fff" stroke="${PI}" stroke-width="4" cx="${cx}" cy="0" rx="15" ry="19"/><path d="${d}" fill="none" stroke="${PI}" stroke-width="3.5" stroke-linecap="round"/>`; };
    const eyeW = (cx) => `<ellipse fill="#fff" stroke="${PI}" stroke-width="4" cx="${cx}" cy="0" rx="15" ry="19"/>`;
    const altEyes = `<g id="${id}-ex" transform="translate(${fx},-6)">
      <g id="${id}-ex-happy" opacity="0"><path d="M-36,6 Q-22,-18 -8,6 M8,6 Q22,-18 36,6" fill="none" stroke="${PI}" stroke-width="6.5" stroke-linecap="round"/></g>
      <g id="${id}-ex-cry" opacity="0"><path d="M-38,-14 L-14,0 L-38,14 M38,-14 L14,0 L38,14" fill="none" stroke="${PI}" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g id="${id}-ex-heart" opacity="0">${heartP(-22)}${heartP(22)}</g>
      <g id="${id}-ex-spiral" opacity="0">${spiralP(-22)}${spiralP(22)}</g>
      <g id="${id}-ex-smug" opacity="0">${eyeW(-22)}${eyeW(22)}<ellipse fill="${PI}" cx="-18" cy="8" rx="8" ry="9"/><ellipse fill="${PI}" cx="26" cy="8" rx="8" ry="9"/>${[-22, 22].map((cx) => `<path d="M${cx - 15},-1 A15,19 0 0 1 ${cx + 15},-1Z" fill="${skin}" stroke="${PI}" stroke-width="4.5" stroke-linejoin="round"/>`).join('')}</g>
      <g id="${id}-ex-sleepy" opacity="0"><path d="M-37,2 Q-22,13 -7,2 M7,2 Q22,13 37,2" fill="none" stroke="${PI}" stroke-width="6.5" stroke-linecap="round"/></g></g>`;
    const hs = (x, y, k) => `<path d="M0,6 C-12,-4 -7,-14 0,-8 C7,-14 12,-4 0,6Z" transform="translate(${x},${y}) scale(${k})" fill="#ff4f9a" stroke="${PI}" stroke-width="2.5"/>`;
    const fxSvg = `<g id="${id}-fx">
      <g id="${id}-fx-tears" opacity="0"><g class="t1"><ellipse cx="${fx - 30}" cy="22" rx="6" ry="10" fill="#6cd0ff" stroke="${PI}" stroke-width="2.5"/></g><g class="t2"><ellipse cx="${fx + 30}" cy="22" rx="6" ry="10" fill="#6cd0ff" stroke="${PI}" stroke-width="2.5"/></g></g>
      <g id="${id}-fx-sweat" opacity="0"><path d="M62,-26 C54,-8 56,2 64,2 C72,2 74,-8 62,-26Z" fill="#8be9ff" stroke="${PI}" stroke-width="3"/></g>
      <g id="${id}-fx-hearts" opacity="0">${hs(-70, -60, 1.4)}${hs(72, -48, 1.1)}${hs(0, -96, 1.6)}</g>
      <g id="${id}-fx-anger" opacity="0"><path d="M44,-52 q8,-2 10,-10 M64,-60 q-2,8 6,12 M44,-70 q8,2 12,-4 M66,-40 q8,2 12,-4" fill="none" stroke="#e6322c" stroke-width="5" stroke-linecap="round"/></g>
      <ellipse id="${id}-fx-tint" cx="0" cy="0" rx="68" ry="62" fill="#ff3b30" opacity="0"/>
      <g id="${id}-fx-zzz" opacity="0"><text x="52" y="-58" font-size="30" fill="#e6f1ff" stroke="${PI}" stroke-width="2" font-family="Kalam" font-weight="700">Z</text><text x="76" y="-84" font-size="40" fill="#e6f1ff" stroke="${PI}" stroke-width="2" font-family="Kalam" font-weight="700">Z</text></g>
      <g id="${id}-fx-rings" opacity="0"><path d="M-90,-30 Q-104,0 -90,30 M-110,-44 Q-130,0 -110,44 M90,-30 Q104,0 90,30 M110,-44 Q130,0 110,44" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.85"/></g>
      <g id="${id}-fx-spark" opacity="0"><path d="M-84,-40 l4,10 l10,4 l-10,4 l-4,10 l-4,-10 l-10,-4 l10,-4Z M84,-20 l3,8 l8,3 l-8,3 l-3,8 l-3,-8 l-8,-3 l8,-3Z" fill="#fff6a8" stroke="${PI}" stroke-width="2"/></g></g>`;

    // side view: shoes point forward (+x), both arms hang from the shoulder line, one drawstring, pocket on the front
    const sideLeg = (side) => { const x = side === 'l' ? -14 : 14;
      return `<g id="${id}-l${side === 'l' ? 'l' : 'r'}" data-hy="${HIP}"><path d="M${x},${HIP} L${x},-16" fill="none" stroke="${PI}" stroke-width="${(o.legW || 13) + 7}" stroke-linecap="round"/><path d="M${x},${HIP} L${x},-16" fill="none" stroke="${pants}" stroke-width="${o.legW || 13}" stroke-linecap="round"/>${V ? `<path d="M${x - 3.5},${HIP + 4} L${x - 3.5},-22" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="3.5" stroke-linecap="round"/>` : ''}
        <path ${st(4)} fill="#fff" d="M${x - 10},-4 C${x - 10},-26 ${x + 22},-26 ${x + 34},-12 L${x + 38},0 L${x - 10},0Z"/><path d="M${x - 10},-4 L${x + 38},-4" stroke="${hood}" stroke-width="7" stroke-linecap="round"/><path d="M${x + 2},-21 l5,5 M${x + 11},-22 l5,5" stroke="${PI}" stroke-width="3" stroke-linecap="round"/></g>`; };
    const sideArm = (side) => { const x = side === 'l' ? -3 : 3, col = SHORT ? skin : outfit === 'coat' ? (side === 'l' ? '#d7dce6' : '#f4f6fa') : side === 'l' ? hoodDark : hood;
      return `<g id="${id}-a${side}" data-sx="${x}" data-sy="-190">
        <path d="M${x},-190 Q${x + 5},-142 ${x},-100" fill="none" stroke="${PI}" stroke-width="26" stroke-linecap="round"/><path d="M${x},-190 Q${x + 5},-142 ${x},-100" fill="none" stroke="${col}" stroke-width="18" stroke-linecap="round"/>${V ? `<path d="M${x - 5},-186 Q${x},-142 ${x - 5},-106" fill="none" stroke="#fff" stroke-opacity="0.28" stroke-width="4" stroke-linecap="round"/>` : ''}
        <path d="M${x - 11},-104 L${x + 11},-104" stroke="${SHORT ? skin : outfit === 'coat' ? '#d7dce6' : hoodDark}" stroke-width="7" stroke-linecap="round"/><circle ${st(4)} fill="${skin}" cx="${x}" cy="-90" r="13"/>
        ${o.prop && o.prop.side === side ? `<g id="${id}-prop" transform="translate(${x},-90)">${o.prop.svg}</g>` : ''}</g>`; };
    const grad = `<defs><linearGradient id="${id}-tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a1a00" stop-opacity="0.3"/></linearGradient></defs>`;
    const SD = 'M-36,-206 C-46,-140 -48,-98 -36,-68 L36,-68 C48,-98 46,-140 36,-206 C24,-224 -24,-224 -36,-206Z';
    const sideTorso = `${grad}<path ${st(5)} fill="${hoodDark}" d="M-30,-216 C-84,-222 -90,-166 -34,-154Z"/><path ${st(5)} fill="${hood}" d="${SD}"/><path d="${SD}" fill="url(#${id}-tg)"/>
      <g id="${id}-str"><path ${st(4)} fill="none" d="M18,-204 L21,-160"/><circle cx="21" cy="-156" r="5" fill="#fff" stroke="${PI}" stroke-width="3"/></g>
      <path ${st(4)} fill="${hoodDark}" fill-opacity="0.55" d="M-2,-120 C6,-96 28,-98 36,-122"/><path d="M36,-196 C46,-150 48,-110 36,-76" fill="none" stroke="${RIMR}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
    const backTorso = `${grad}<path ${st(5)} fill="${hood}" d="${torsoD}"/><path d="${torsoD}" fill="url(#${id}-tg)"/>
      <path ${st(5)} fill="${hoodDark}" d="M-58,-216 C-40,-254 40,-254 58,-216 C38,-168 -38,-168 -58,-216Z"/><path d="M0,-210 L0,-182 M0,-150 L0,-76" stroke="${PI}" stroke-width="4" stroke-linecap="round"/><path d="M52,-196 C62,-150 64,-110 50,-76" fill="none" stroke="${RIMR}" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
    const legsV = view === 'side' ? sideLeg('l') + sideLeg('r') : leg('l') + leg('r');
    const armsV = view === 'side' ? [sideArm('l'), sideArm('r')] : [arm('l'), arm('r')];
    const TD = view === 'side' ? SD : torsoD, SPD = view === 'side' ? 0.6 : 1;
    const torsoVol = V ? `<defs><linearGradient id="${id}-ao" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#2a1000" stop-opacity="0.34"/></linearGradient></defs><path d="${TD}" fill="url(#${id}-ao)"/>
      <path d="M${-30 * SPD},-190 C${-36 * SPD},-160 ${-36 * SPD},-130 ${-30 * SPD},-110" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="6" stroke-linecap="round"/><path d="M${-26 * SPD},-228 Q0,-238 ${24 * SPD},-228" fill="none" stroke="#fff" stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
      <path d="M${54 * SPD},-196 C${64 * SPD},-150 ${66 * SPD},-110 ${52 * SPD},-76" fill="none" stroke="${RIMR}" stroke-width="8" stroke-linecap="round" opacity="0.8"/><path d="M${-54 * SPD},-196 C${-64 * SPD},-150 ${-66 * SPD},-110 ${-52 * SPD},-76" fill="none" stroke="${RIML}" stroke-width="5" stroke-linecap="round" opacity="0.5"/>
      <ellipse cx="0" cy="-204" rx="${44 * SPD}" ry="14" fill="#2a1000" opacity="0.3"/>` : '';
    const baseF = `<path ${st(5)} fill="${hood}" d="${torsoD}"/><path d="${torsoD}" fill="url(#${id}-tg)"/>`, INNER = o.inner || '#f2efe6', APR = o.apron || '#2f8a57';
    const neck = `<path ${st(4)} fill="${skin}" d="M-24,-214 Q0,-188 24,-214Z"/>`;
    const OF = {
      tee: baseF + neck, dress: baseF + neck + `<path d="M-46,-120 Q0,-108 46,-120" stroke="${hoodDark}" stroke-width="6" fill="none"/>`,
      shirt: baseF + `<path ${st(4)} fill="${o.collar || "#fff"}" d="M-26,-216 L-4,-196 L-16,-182Z M26,-216 L4,-196 L16,-182Z"/><path d="M0,-196 L0,-72" stroke="${PI}" stroke-width="3" opacity=".5"/>` + (o.tie ? `<path ${st(3)} fill="${o.tie}" d="M-7,-206 L7,-206 L10,-168 L0,-154 L-10,-168Z"/>` : [-176, -146, -116].map((y) => `<circle cx="0" cy="${y}" r="3.5" fill="${o.collar ? "#8a8a99" : PI}" opacity=".85"/>`).join('')) + (o.tuck ? `<path ${st(5)} fill="${pants}" d="M-61,-106 C-61,-90 -57,-78 -48,-68 L48,-68 C57,-78 61,-90 61,-106Z"/><path d="M0,-100 L0,-74" stroke="#000" stroke-opacity=".45" stroke-width="3"/><rect x="-61" y="-112" width="122" height="11" rx="3" fill="#0c0c10" stroke="${PI}" stroke-width="3"/><rect x="-9" y="-114" width="18" height="15" rx="3" fill="none" stroke="#b8b8c4" stroke-width="3.5"/>` : ''),
      suit: baseF + `<path ${st(4)} fill="${o.inner || '#ffffff'}" d="M-24,-216 L0,-150 L24,-216Z"/>` + (o.tie === false ? '' : `<path ${st(3)} fill="${o.tie || '#c0392b'}" d="M-6,-206 L6,-206 L9,-170 L0,-158 L-9,-170Z"/>`) + `<path ${st(4)} fill="none" d="M-24,-216 L-34,-150 L-2,-140 M24,-216 L34,-150 L2,-140"/><circle cx="0" cy="-118" r="4.5" fill="${PI}"/><circle cx="0" cy="-96" r="4.5" fill="${PI}"/><path d="M28,-112 L44,-112" stroke="#fff" stroke-width="5" stroke-linecap="round"/>`,
      coat: `<path ${st(5)} fill="${o.inner || '#8fc7e0'}" d="${torsoD}"/><path ${st(5)} fill="#f4f6fa" d="M-52,-206 C-62,-140 -64,-98 -48,-68 L-10,-68 L-12,-196 L-24,-216Z"/><path ${st(5)} fill="#f4f6fa" d="M52,-206 C62,-140 64,-98 48,-68 L10,-68 L12,-196 L24,-216Z"/><path d="${torsoD}" fill="url(#${id}-tg)"/><path fill="none" stroke="#2a2a35" stroke-width="5" stroke-linecap="round" d="M-18,-210 C-34,-160 -16,-128 0,-126 C16,-128 34,-160 18,-210"/><circle cx="0" cy="-122" r="8" fill="#c9ced8" stroke="${PI}" stroke-width="3"/><rect x="24" y="-150" width="22" height="26" rx="3" fill="none" stroke="#c9ced8" stroke-width="3"/><path d="M30,-160 L30,-146" stroke="#3d7be0" stroke-width="4" stroke-linecap="round"/>`,
      apron: baseF + neck + `<path d="M-26,-206 L-30,-170 M26,-206 L30,-170" stroke="${APR}" stroke-width="7"/><path ${st(5)} fill="${APR}" d="M-38,-172 L38,-172 L48,-70 L-48,-70Z"/><rect x="10" y="-160" width="24" height="14" rx="3" fill="#fff" stroke="${PI}" stroke-width="2.5"/><path d="M-22,-120 L22,-120 L22,-98 L-22,-98Z" fill="none" stroke="${PI}" stroke-width="3" opacity=".6"/>`,
      vest: baseF + `<path ${st(5)} fill="#ff7a1a" d="M-52,-206 C-62,-140 -64,-98 -48,-68 L-14,-68 L-16,-200 L-26,-216Z M52,-206 C62,-140 64,-98 48,-68 L14,-68 L16,-200 L26,-216Z"/><path d="M-60,-130 L-16,-130 M16,-130 L60,-130 M-60,-104 L-16,-104 M16,-104 L60,-104" stroke="#e8edf5" stroke-width="7"/>`,
      cardigan: `<path ${st(5)} fill="${INNER}" d="${torsoD}"/><path ${st(5)} fill="${hood}" d="M-52,-206 C-62,-140 -64,-98 -48,-68 L-6,-68 L-6,-160 L-26,-216Z M52,-206 C62,-140 64,-98 48,-68 L6,-68 L6,-160 L26,-216Z"/><path d="${torsoD}" fill="url(#${id}-tg)"/>${[-148, -122, -96].map((y) => `<circle cx="-12" cy="${y}" r="4" fill="${hoodDark}" stroke="${PI}" stroke-width="2"/>`).join('')}`,
      uniform: baseF + `<path ${st(4)} fill="${hoodDark}" d="M-26,-216 L-4,-196 L-16,-182Z M26,-216 L4,-196 L16,-182Z"/><rect x="-44" y="-176" width="30" height="24" rx="4" fill="none" stroke="${PI}" stroke-width="3"/><rect x="14" y="-176" width="30" height="24" rx="4" fill="none" stroke="${PI}" stroke-width="3"/><path d="M-30,-150 l4,-9 l4,9 l-8,-6 l8,0Z" fill="#f2c14e" stroke="${PI}" stroke-width="2"/><path d="M-60,-84 L60,-84" stroke="${PI}" stroke-width="7"/>`,
    };
    const baseS = `<path ${st(5)} fill="${outfit === 'coat' ? (o.inner || '#8fc7e0') : hood}" d="${SD}"/><path d="${SD}" fill="url(#${id}-tg)"/>`;
    const OS = baseS + ({ coat: `<path ${st(5)} fill="#f4f6fa" d="M-36,-206 C-46,-140 -48,-98 -36,-68 L22,-68 L24,-210 C10,-222 -24,-222 -36,-206Z"/>`, apron: `<path ${st(5)} fill="${APR}" d="M16,-172 L40,-172 L44,-70 L16,-70Z"/>`, suit: `<path ${st(3)} fill="${o.tie || '#c0392b'}" d="M28,-206 L36,-206 L38,-170 L30,-160Z"/>`, vest: `<path ${st(5)} fill="#ff7a1a" d="M-36,-206 C-46,-140 -48,-98 -36,-68 L36,-68 C48,-98 46,-140 36,-206 C24,-224 -24,-224 -36,-206Z" opacity="0.95"/><path d="M-44,-130 L44,-130 M-44,-104 L44,-104" stroke="#e8edf5" stroke-width="7"/>`, cardigan: `<path ${st(4)} fill="${INNER}" d="M24,-210 L36,-206 C46,-150 46,-110 36,-70 L26,-70Z"/>` }[outfit] || '');
    const OB = `<path ${st(5)} fill="${outfit === 'coat' ? '#f4f6fa' : outfit === 'vest' ? '#ff7a1a' : hood}" d="${torsoD}"/><path d="${torsoD}" fill="url(#${id}-tg)"/>`;
    const BP = o.backpack, SCF = o.scarf;
    const EXTRA = {
      front: (BP ? `<path d="M-34,-214 C-42,-170 -40,-140 -32,-118 M34,-214 C42,-170 40,-140 32,-118" fill="none" stroke="${PI}" stroke-width="13" stroke-linecap="round"/><path d="M-34,-214 C-42,-170 -40,-140 -32,-118 M34,-214 C42,-170 40,-140 32,-118" fill="none" stroke="${BP}" stroke-width="7" stroke-linecap="round"/>` : '') + (SCF ? `<path ${st(4)} fill="${SCF}" d="M-48,-224 Q0,-196 48,-224 L46,-204 Q0,-178 -46,-204Z"/><path ${st(4)} fill="${SCF}" d="M16,-204 L30,-140 L12,-140 L4,-198Z"/>` : ''),
      side: (BP ? `<path d="M-20,-214 C-26,-170 -24,-140 -16,-118" fill="none" stroke="${BP}" stroke-width="8" stroke-linecap="round"/>` : '') + (SCF ? `<path ${st(4)} fill="${SCF}" d="M-34,-224 Q0,-200 34,-224 L32,-204 Q0,-182 -32,-204Z"/><path ${st(4)} fill="${SCF}" d="M-30,-210 L-58,-150 L-42,-146 L-20,-200Z"/>` : ''),
      back: (BP ? `<rect ${st(5)} fill="${BP}" x="-46" y="-206" width="92" height="118" rx="26"/><rect ${st(4)} fill="${BP}" x="-30" y="-140" width="60" height="38" rx="10"/>` : '') + (SCF ? `<path ${st(4)} fill="${SCF}" d="M-48,-224 Q0,-204 48,-224 L46,-206 Q0,-186 -46,-206Z"/>` : ''),
    };
    const BPS = BP && view === 'side' ? `<rect ${st(5)} fill="${BP}" x="-86" y="-204" width="52" height="112" rx="18"/>` : '';
    const vk = view === 'side' ? 'side' : view === 'back' ? 'back' : 'front';
    const torsoV = (hoodie ? (view === 'side' ? sideTorso : view === 'back' ? backTorso : torso) : vk === 'side' ? OS : vk === 'back' ? OB : (OF[outfit] || baseF)) + torsoVol + EXTRA[vk];
    const SKIRT = o.skirt ? `<path ${st(5)} fill="${o.skirt}" d="M-52,-80 L52,-80 L68,-26 Q0,-16 -68,-26Z"/>` : '';
    // 2.5D: the far limbs are darker (they sit in the character's own shadow)
    const LEGS = view === 'side' ? `<g style="filter:brightness(0.72)">${sideLeg('l')}</g>${sideLeg('r')}` : view === 'q3' ? `<g style="filter:brightness(0.86)">${leg('l')}</g>${leg('r')}` : legsV;
    const FARA = view === 'side' || view === 'q3' ? `<g style="filter:brightness(0.74)">${armsV[0]}</g>` : armsV[0];
    const yaw0 = view === 'side' ? 1 : view === 'q3' ? 0.45 : 0, a0 = 1 - 0.38 * Math.abs(yaw0), b0 = 30 * yaw0;
    const faceT = yaw0 ? `translate(${b0},0) scale(${a0},1)` : '';
    const nose = `<g transform="translate(${yaw0 * 71},0)"><g id="${id}-nose" data-y0="${yaw0}" opacity="${yaw0 ? 1 : 0}"><ellipse ${st(4)} fill="${skin}" cx="0" cy="6" rx="8" ry="6.5"/></g></g>`;
    const earFill = o.skin ? skin : '#efd3ba';
    const ears = view === 'side' ? `<ellipse ${st(4)} fill="${earFill}" cx="-30" cy="12" rx="8" ry="12"/><path d="M-33,8 q4,4 0,10" fill="none" stroke="${PI}" stroke-width="2.5" stroke-linecap="round"/>` : view === 'back' ? `<ellipse ${st(4)} fill="${earFill}" cx="-68" cy="6" rx="9" ry="13"/><ellipse ${st(4)} fill="${earFill}" cx="68" cy="6" rx="9" ry="13"/>` : '';
    const head = `<g id="${id}-hp"><g transform="translate(0,${HY}) scale(${HK})"><g id="${id}-head">
        <defs><radialGradient id="${id}-hg" cx="0.38" cy="0.3" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.6" stop-color="${skin}" stop-opacity="0"/><stop offset="1" stop-color="#7a5fb0" stop-opacity="0.35"/></radialGradient></defs>
        <g id="${id}-curl">${curl}</g>
        ${tufts}${hairBack}
        <ellipse ${st(5)} fill="${skin}" cx="0" cy="0" rx="68" ry="62"/><ellipse cx="0" cy="0" rx="68" ry="62" fill="url(#${id}-hg)"/>${ageSkin}${V ? `<defs><radialGradient id="${id}-hv" cx="0.72" cy="0.86" r="0.62"><stop offset="0" stop-color="#2a1000" stop-opacity="0.32"/><stop offset="1" stop-color="#2a1000" stop-opacity="0"/></radialGradient></defs><ellipse cx="0" cy="0" rx="68" ry="62" fill="url(#${id}-hv)"/><ellipse cx="-30" cy="-34" rx="17" ry="9" transform="rotate(-28 -30 -34)" fill="#fff" opacity="0.62"/><circle cx="-10" cy="-50" r="4" fill="#fff" opacity="0.7"/>` : ''}
        <path d="M52,-34 A68,62 0 0 1 56,34" fill="none" stroke="${RIMR}" stroke-width="${V ? 8 : 5}" stroke-linecap="round" opacity="${V ? 0.95 : 0.75}"/>${V ? '<path d="M-52,-34 A68,62 0 0 0 -56,30" fill="none" stroke="${RIML}" stroke-width="5" stroke-linecap="round" opacity="0.5"/>' : ''}
        ${hairFront}${HAT}${o.headphones ? `<path d="M-74,6 C-82,-96 82,-96 74,6" fill="none" stroke="${PI}" stroke-width="18" stroke-linecap="round"/><path d="M-74,6 C-82,-96 82,-96 74,6" fill="none" stroke="${o.headphones === true ? '#3a3a44' : o.headphones}" stroke-width="10" stroke-linecap="round"/><g ${st(5)} fill="${o.headphones === true ? '#2b2b33' : o.headphones}"><rect x="-92" y="-20" width="34" height="54" rx="14"/><rect x="58" y="-20" width="34" height="54" rx="14"/></g>` : ''}
        ${ears}
        <g id="${id}-face" transform="${faceT}" opacity="${view === 'back' ? 0 : 1}"><g id="${id}-yaw" data-a0="${a0}" data-b0="${b0}">
        <ellipse cx="${fx - 42}" cy="22" rx="12" ry="7.5" fill="#ff8fb0" opacity="0.55"/><ellipse cx="${fx + 42}" cy="22" rx="12" ry="7.5" fill="#ff8fb0" opacity="0.55"/>
        <g id="${id}-eyes" transform="translate(${fx},-6)">${eye(-22)}${eye(22)}<g id="${id}-pupils">${pupil(-22)}${pupil(22)}</g></g>
        <g id="${id}-brows" stroke="${browCol}" stroke-width="${(6 + AT * 3).toFixed(1)}" stroke-linecap="round" stroke-linejoin="round" fill="none"><path id="${id}-bl" d="M${fx - 38},-34 L${fx - 8},-38"/><path id="${id}-br" d="M${fx + 8},-38 L${fx + 38},-34"/></g>
        ${BEARD}${altEyes}${mouthSvg}${STACHE}${glasses}${ageFace}${o.shades === 'pixel' ? `<g transform="translate(${fx},-6)" fill="#111">${[[-46, -10, 92, 8], [-42, -2, 32, 16], [10, -2, 32, 16], [-38, 14, 24, 8], [14, 14, 24, 8], [-10, -2, 20, 8]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`).join('')}<rect x="-34" y="2" width="8" height="8" fill="#fff"/><rect x="18" y="2" width="8" height="8" fill="#fff"/></g>` : o.shades ? `<g transform="translate(${fx},-6)"><path d="M-46,-10 L-4,-10 C-4,14 -14,22 -26,22 C-40,22 -46,10 -46,-10Z M4,-10 L46,-10 C46,10 40,22 26,22 C14,22 4,14 4,-10Z" fill="#15151a" stroke="${PI}" stroke-width="4" stroke-linejoin="round"/><path d="M-4,-6 L4,-6" stroke="#15151a" stroke-width="6"/><path d="M-38,-4 l10,-2 M12,-4 l10,-2" stroke="#ffffff" stroke-opacity="0.55" stroke-width="4" stroke-linecap="round"/></g>` : ''}</g></g>${nose}${fxSvg}
      </g></g></g>`;
    const sc = o.scale || 1;
    return `<g id="${id}-pos"><g id="${id}" transform="translate(${o.x || 0},${o.y || 0}) scale(${(o.flip ? -1 : 1) * sc},${sc})">
      ${V ? '<ellipse fill="#000" opacity="0.14" cx="0" cy="3" rx="96" ry="17"/><ellipse fill="#000" opacity="0.32" cx="0" cy="3" rx="56" ry="9"/>' : '<ellipse fill="#000" opacity="0.22" cx="0" cy="3" rx="78" ry="13"/>'}
      ${LEGS}<g transform="translate(0,${-LIFT})">${SKIRT}
      <g transform="rotate(${stoop.toFixed(1)} 0 -70)"><g><g id="${id}-body">${bw !== 1 ? `<g transform="scale(${bw},1)">` : ''}${FARA}${BPS}${torsoV}${armsV[1]}${bw !== 1 ? '</g>' : ''}</g></g>
      ${head}</g></g>
    </g></g>`;
  }

  // ---------- character ----------
  // feet at (0,0); about 330 units tall. Ids: <id>-head, -body, -al, -ar, -ll, -lr, -eyes, -pupils, -brows, -m-<mood>
  function char(o) {
    if (o.style === 'mascot') return mascotChar(o);
    const id = o.id;
    const skin = o.skin || '#f2c9a0';
    const shirt = o.shirt || '#5b8fb9';
    const face = o.face == null ? 0.4 : o.face; // -1 looks left, 1 looks right
    const fx = 12 * face;
    const s = S(o.style === 'pear' ? 3.5 : undefined);
    const legs = `
      <g id="${id}-ll"><path ${s} fill="none" d="M-18,-76 L-19,0 L-30,0"/></g>
      <g id="${id}-lr"><path ${s} fill="none" d="M18,-76 L19,0 L30,0"/></g>`;
    const arm = (side) => {
      const x = side === 'l' ? -50 : 50;
      const hand = o.handCol || skin;
      return `<g id="${id}-a${side}" data-sx="${x}" data-sy="-186">
        <path ${s} fill="none" d="M${x},-186 Q${x + (side === 'l' ? -6 : 6)},-140 ${x},-98"/>
        <circle ${S(4)} fill="${hand}" cx="${x}" cy="-92" r="9"/>
        ${o.prop && o.prop.side === side ? `<g id="${id}-prop" transform="translate(${x},-92)">${o.prop.svg}</g>` : ''}
      </g>`;
    };
    const pear = o.style === 'pear';
    let torso = pear
      ? `<path ${s} fill="${o.suit || shirt}" d="M-40,-196 C-52,-150 -62,-110 -48,-76 C-30,-62 30,-62 48,-76 C62,-110 52,-150 40,-196 C20,-208 -20,-208 -40,-196Z"/>`
      : `<path ${s} fill="${shirt}" d="M-56,-200 C-62,-140 -66,-92 -50,-72 L50,-72 C66,-92 62,-140 56,-200 C40,-216 -40,-216 -56,-200Z"/>`;
    if (o.suit && !pear) {
      torso = `<path ${s} fill="${o.suit}" d="M-56,-200 C-62,-140 -66,-92 -50,-72 L50,-72 C66,-92 62,-140 56,-200 C40,-216 -40,-216 -56,-200Z"/>
        <path ${S(4)} fill="${o.collar || '#ffffff'}" d="M-22,-209 L0,-160 L22,-209 C10,-212 -10,-212 -22,-209Z"/>
        ${o.tie ? `<path ${S(3)} fill="${o.tie}" d="M-6,-196 L6,-196 L9,-160 L0,-148 L-9,-160Z"/>` : ''}
        <path stroke="${INK}" stroke-width="3" fill="none" d="M0,-150 L0,-80"/>`;
    }
    if (pear) {
      const TP = 'M-40,-196 C-52,-150 -62,-110 -48,-76 C-30,-62 30,-62 48,-76 C62,-110 52,-150 40,-196 C20,-208 -20,-208 -40,-196Z';
      torso += `<defs><linearGradient id="${id}-bg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.3"/></linearGradient></defs><path d="${TP}" fill="url(#${id}-bg)"/>`;
      if (o.suit) torso += `<path ${S(3)} fill="${o.collar || '#ffffff'}" d="M-16,-200 L0,-156 L16,-200 C8,-204 -8,-204 -16,-200Z"/>${o.tie ? `<path ${S(3)} fill="${o.tie}" d="M-5,-194 L5,-194 L8,-156 L0,-142 L-8,-156Z"/>` : ''}<path stroke="${INK}" stroke-width="3" fill="none" d="M0,-140 L0,-76"/><path ${S(2)} fill="#fff" d="M-34,-160 L-22,-160 L-22,-148 L-28,-152 L-34,-148Z"/>`;
    }
    if (o.vest) torso += `<path ${S(4)} fill="${o.vest}" d="M-50,-150 L50,-150 L52,-100 L-52,-100Z" opacity="0.95"/>`;
    const hc = o.hatCol || '#26222a';
    const hatSvg = o.hat === 'bowler'
      ? `<path ${S(4)} fill="${hc}" d="M-48,-26 C-50,-96 50,-96 48,-26Z"/><ellipse ${S(4)} fill="${hc}" cx="0" cy="-26" rx="68" ry="11"/><path stroke="#b83a3a" stroke-width="9" fill="none" d="M-48,-38 L48,-38"/>`
      : o.hat === 'fedora'
        ? `<path ${S(4)} fill="${hc}" d="M-46,-26 C-46,-88 -20,-98 0,-92 C20,-98 46,-88 46,-26Z"/><ellipse ${S(4)} fill="${hc}" cx="0" cy="-26" rx="80" ry="13"/><path stroke="#c9a24a" stroke-width="9" fill="none" d="M-46,-40 L46,-40"/>`
        : '';
    const stacheSvg = o.stache ? `<path ${S(3)} fill="${o.hairCol || '#2a1d18'}" d="M${fx - 21},13 C${fx - 12},3 ${fx - 3},7 ${fx},11 C${fx + 3},7 ${fx + 12},3 ${fx + 21},13 C${fx + 12},21 ${fx - 12},21 ${fx - 21},13Z"/>` : '';
    const hiSvg = pear && o.hair !== 'bald' && !o.hat ? `<path d="M-38,-40 Q-8,-62 28,-54" fill="none" stroke="#ffffff" stroke-opacity="0.38" stroke-width="5" stroke-linecap="round"/>` : '';
    const lidSvg = o.lids ? [-19, 19].map((cx) => `<path d="M${cx - 13},-1 A13,15 0 0 1 ${cx + 13},-1Z" fill="${skin}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>`).join('') : '';
    const mouths = {
      flat: `<path ${S(4)} fill="none" d="M${fx - 9},30 L${fx + 9},30"/>`,
      smile: `<path ${S(4)} fill="none" d="M${fx - 13},26 Q${fx},38 ${fx + 13},26"/>`,
      grin: `<path ${S(4)} fill="#7a2e2e" d="M${fx - 16},24 Q${fx},48 ${fx + 16},24Z"/>`,
      open: `<ellipse ${S(4)} fill="#7a2e2e" cx="${fx}" cy="31" rx="9" ry="11"/>`,
      frown: `<path ${S(4)} fill="none" d="M${fx - 12},35 Q${fx},24 ${fx + 12},35"/>`,
      shock: `<ellipse ${S(4)} fill="#7a2e2e" cx="${fx}" cy="33" rx="12" ry="16"/>`,
    };
    const mood = o.mood || 'flat';
    const mouthSvg = Object.entries(mouths)
      .map(([k, d]) => `<g id="${id}-m-${k}" opacity="${k === mood ? 1 : 0}">${d}</g>`).join('');
    const stub = o.stubble ? `<path fill="#000" opacity="0.13" d="M-50,14 C-40,58 40,58 50,14 C34,40 -34,40 -50,14Z"/>` : '';
    const glasses = o.glasses ? `<g ${S(3)} fill="rgba(255,255,255,0.25)"><circle cx="${fx - 20}" cy="-2" r="14"/><circle cx="${fx + 20}" cy="-2" r="14"/><path fill="none" d="M${fx - 6},-2 L${fx + 6},-2"/></g>` : '';
    const head = `<g transform="translate(0,-250)"><g id="${id}-head">
        ${o.hair === 'long' ? `<path ${s} fill="${o.hairCol || '#3b2a20'}" d="M-66,-10 C-74,60 -60,96 -44,104 L44,104 C60,96 74,60 66,-10Z"/>` : ''}
        <circle ${s} fill="${skin}" cx="0" cy="0" r="62"/>
        ${pear ? `<defs><linearGradient id="${id}-hg" x1="0" y1="0" x2="0.3" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0.22"/><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#5a2a10" stop-opacity="0.28"/></linearGradient></defs><circle r="62" fill="url(#${id}-hg)"/>` : ''}
        ${stub}
        <g id="${id}-eyes" transform="translate(${fx},-2)">
          ${pear ? `<ellipse ${S(3)} fill="#fff" cx="-19" cy="0" rx="13" ry="15"/><ellipse ${S(3)} fill="#fff" cx="19" cy="0" rx="13" ry="15"/>` : ''}
          <g id="${id}-pupils">
            <ellipse fill="${INK}" cx="${o.lids ? -21 : -19}" cy="${o.lids ? 4 : 0}" rx="${pear ? 4.5 : 5.5}" ry="${pear ? 6 : 7.5}"/>
            <ellipse fill="${INK}" cx="${o.lids ? 21 : 19}" cy="${o.lids ? 4 : 0}" rx="${pear ? 4.5 : 5.5}" ry="${pear ? 6 : 7.5}"/>
          </g>
          ${lidSvg}
        </g>
        <g id="${id}-brows" ${S(4)} fill="none">
          <path id="${id}-bl" d="M${fx - 28},-20 L${fx - 12},-22"/>
          <path id="${id}-br" d="M${fx + 12},-22 L${fx + 28},-20"/>
        </g>
        ${mouthSvg}
        ${stacheSvg}
        ${glasses}
        ${hair(o.hair === 'long' ? 'short' : o.hair || 'short', o.hairCol || '#3b2a20')}
        ${hiSvg}
        ${hatSvg}
      </g></g>`;
    const sc = o.scale || 1;
    return `<g id="${id}-pos"><g id="${id}" transform="translate(${o.x || 0},${o.y || 0}) scale(${(o.flip ? -1 : 1) * sc},${sc})">
      <ellipse fill="#000" opacity="0.18" cx="0" cy="2" rx="70" ry="12"/>
      ${legs}
      <g id="${id}-body">${arm('l')}${torso}${arm('r')}</g>
      ${head}
    </g></g>`;
  }

  // ---------- acting helpers (all on a given paused timeline) ----------
  const q = (sel) => document.querySelector(sel);
  // gestures: a small anticipation (opposite) move, then the move with overshoot (follow-through)
  function armTo(tl, id, side, deg, t, dur, ease) {
    const g = q(`#${id}-a${side}`); if (!g) return; const org = `${g.dataset.sx} ${g.dataset.sy}`;
    if (!ease && (dur || 0.35) >= 0.25 && t > 0.08) tl.to(g, { rotation: `-=${Math.sign(deg || 1) * 7}`, svgOrigin: org, duration: 0.07, ease: 'power1.out' }, t - 0.07);
    tl.to(g, { rotation: deg, svgOrigin: org, duration: d(dur || 0.35), ease: ease || 'back.out(2.2)' }, t);
  }
  function armSet(tl, id, side, deg) {
    const g = q(`#${id}-a${side}`);
    tl.set(g, { rotation: deg, svgOrigin: `${g.dataset.sx} ${g.dataset.sy}` }, 0);
  }
  function mood(tl, id, t, m) {
    ['flat', 'smile', 'grin', 'open', 'frown', 'shock', 'wail', 'gritted', 'wave', 'smirk'].filter((k) => q(`#${id}-m-${k}`)).forEach((k) => tl.set(`#${id}-m-${k}`, { opacity: k === m ? 1 : 0 }, t));
    // the take: anticipation squash, new face, overshoot, settle
    tl.fromTo(`#${id}-head`, { scaleX: 1.06, scaleY: 0.92, transformOrigin: '50% 100%' }, { scaleX: 1, scaleY: 1, duration: d(0.45), ease: 'elastic.out(1,0.45)' }, t - 0.02);
  }
  function brows(tl, id, t, kind) {
    const L = { calm: [0, 0], up: [-8, -8], angry: [14, -6], worried: [-14, -8] }[kind] || [0, 0];
    tl.to(`#${id}-bl`, { rotation: L[0], y: L[1], svgOrigin: '-20 -21', duration: d(0.25), ease: 'power2.out' }, t);
    tl.to(`#${id}-br`, { rotation: -L[0], y: L[1], svgOrigin: '20 -21', duration: d(0.25), ease: 'power2.out' }, t + 0.03);
  }
  function blink(tl, id, times) {
    times.forEach((t) => {
      tl.to(`#${id}-eyes`, { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.06, ease: 'power1.in' }, t);
      tl.to(`#${id}-eyes`, { scaleY: 1, duration: 0.09, ease: 'power1.out' }, t + 0.08);
    });
  }
  function look(tl, id, t, dx, dy) {
    tl.to(`#${id}-pupils`, { x: dx || 0, y: dy || 0, duration: d(0.2), ease: 'power2.out' }, t);
  }
  // mouth flaps for speech between t0 and t1 (deterministic pattern)
  function talk(tl, id, t0, t1, rest) {
    const r = rng(id.length * 97 + Math.round(t0 * 10));
    if (rest && rest !== 'flat' && rest !== 'open' && q(`#${id}-m-${rest}`)) tl.set(`#${id}-m-${rest}`, { opacity: 0 }, t0);
    let t = t0, open = false;
    while (t < t1) {
      open = !open;
      tl.set(`#${id}-m-open`, { opacity: open ? 1 : 0 }, t);
      tl.set(`#${id}-m-flat`, { opacity: open ? 0 : 1 }, t);
      t += 0.09 + r() * 0.1;
    }
    tl.set(`#${id}-m-open`, { opacity: 0 }, t1);
    tl.set(`#${id}-m-${rest || 'flat'}`, { opacity: 1 }, t1);
  }
  // idle: weight shift + breath, body leads, head follows (finite repeats only)
  function idle(tl, id, t0, t1, amt) {
    const a = amt || 1;
    const n = Math.max(1, Math.floor((t1 - t0) / d(1.6)));
    tl.to(`#${id}-body`, { scaleY: 1 + 0.018 * a, transformOrigin: '50% 100%', duration: d(0.8), ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1 }, t0);
    tl.to(`#${id}-head`, { y: -3 * a, duration: d(0.8), ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1 }, t0 + 0.12);
    // weight shift: the body leans side to side over the feet, the head counters a little
    const m = Math.max(1, Math.floor((t1 - t0) / 3.2));
    tl.fromTo(`#${id}-body`, { rotation: -1.3 * a }, { rotation: 1.3 * a, transformOrigin: '50% 100%', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: m * 2 - 1, immediateRender: false }, t0 + 0.3);
    tl.fromTo(`#${id}-head`, { rotation: 1 * a }, { rotation: -1 * a, transformOrigin: '50% 100%', duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: m * 2 - 1, immediateRender: false }, t0 + 0.5);
  }
  // secondary motion: the curl and the hoodie strings swing (stronger and faster while walking: a = 2)
  function secondary(tl, id, t0, t1, a) {
    a = a || 1; const per = a > 1 ? 0.26 : 0.55, n = Math.max(1, Math.floor((t1 - t0) / (per * 2)));
    if (q(`#${id}-curl path`)) tl.fromTo(`#${id}-curl`, { rotation: -4 * a }, { rotation: 5 * a, svgOrigin: '0 -58', duration: per, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, immediateRender: false }, t0);
    if (q(`#${id}-str`)) tl.fromTo(`#${id}-str`, { rotation: -3 * a }, { rotation: 3 * a, svgOrigin: '0 -206', duration: per, ease: 'sine.inOut', yoyo: true, repeat: n * 2 - 1, immediateRender: false }, t0 + per * 0.4);
  }
  // audio lip sync: env = loudness samples (0..1) at fps from the voice-over; closed / open / wide mouths
  function lips(tl, id, t0, env, fps, rest) {
    const has = (k) => q(`#${id}-m-${k}`); let prev = -1;
    if (rest && rest !== 'flat' && has(rest)) tl.set(`#${id}-m-${rest}`, { opacity: 0 }, t0);
    env.forEach((v, i) => { const s = v > 0.62 ? 2 : v > 0.2 ? 1 : 0; if (s === prev) return; prev = s; const t = t0 + i / fps;
      tl.set(`#${id}-m-flat`, { opacity: s === 0 ? 1 : 0 }, t); tl.set(`#${id}-m-open`, { opacity: s === 1 ? 1 : 0 }, t); if (has('shock')) tl.set(`#${id}-m-shock`, { opacity: s === 2 ? 1 : 0 }, t); });
    const t1 = t0 + env.length / fps; tl.set(`#${id}-m-open`, { opacity: 0 }, t1); if (has('shock')) tl.set(`#${id}-m-shock`, { opacity: 0 }, t1);
    tl.set(`#${id}-m-flat`, { opacity: !rest || rest === 'flat' ? 1 : 0 }, t1); if (rest && rest !== 'flat' && has(rest)) tl.set(`#${id}-m-${rest}`, { opacity: 1 }, t1);
  }
  // walk cycle: legs scissor, small bob, translation by dx over [t0,t1]
  function walk(tl, id, t0, t1, dx, x0) {
    const steps = Math.max(2, Math.round((t1 - t0) / d(0.26)));
    const st = (t1 - t0) / steps;
    for (let i = 0; i < steps; i++) {
      const a = i % 2 ? 22 : -22;
      const hy = (q(`#${id}-ll`) && q(`#${id}-ll`).dataset.hy) || -76;
      tl.to(`#${id}-ll`, { rotation: a, svgOrigin: `-18 ${hy}`, duration: st, ease: 'sine.inOut' }, t0 + i * st);
      tl.to(`#${id}-lr`, { rotation: -a, svgOrigin: `18 ${hy}`, duration: st, ease: 'sine.inOut' }, t0 + i * st);
      tl.to(`#${id}-body`, { y: -6, duration: st / 2, ease: 'sine.out', yoyo: true, repeat: 1 }, t0 + i * st);
    }
    tl.to(`#${id}-ll, #${id}-lr`, { rotation: 0, duration: 0.15 }, t1);
    // moves the outer wrapper from x0 to x0+dx (screen px offsets from the placed position)
    if (dx) tl.fromTo(`#${id}-pos`, { x: x0 || 0 }, { x: (x0 || 0) + dx, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
  }

  // ---------- world map ----------
  // returns <g> with every country; highlight = {name: fill}; ids "c-<slug>"
  function slug(n) { return n.toLowerCase().replace(/[^a-z]+/g, '-'); }
  function map(o) {
    const W = window.WORLD;
    const hi = o.highlight || {};
    const land = o.land || '#efe2c4';
    const sw = o.sw || 1.2;
    const pal = o.palette; // optional array: seeded pastel per country, cartoon-atlas look
    const r = rng(7);
    return W.countries.map((c) => {
      const f = hi[c.n] || (pal ? pal[Math.floor(r() * pal.length)] : land);
      return `<path id="${o.prefix || 'm'}-${slug(c.n)}" d="${c.d}" fill="${f}" stroke="${o.stroke || INK}" stroke-width="${sw}" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>`;
    }).join('');
  }
  const pt = (k) => window.WORLD.pts[k];

  // ---------- flags ----------
  function flagSG(w) {
    const h = w * 2 / 3;
    const star = (cx, cy, r) => {
      let d = '';
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? r * 0.4 : r, a = -Math.PI / 2 + i * Math.PI / 5;
        d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1);
      }
      return `<path d="${d}Z" fill="#fff"/>`;
    };
    const u = w / 30;
    return `<rect width="${w}" height="${h / 2}" fill="#ee2536"/><rect y="${h / 2}" width="${w}" height="${h / 2}" fill="#fff"/>
      <circle cx="${7.5 * u}" cy="${5 * u}" r="${3.9 * u}" fill="#fff"/><circle cx="${9 * u}" cy="${5 * u}" r="${3.9 * u}" fill="#ee2536"/>
      ${star(10.6 * u, 3 * u, 0.9 * u)}${star(8.2 * u, 4.6 * u, 0.9 * u)}${star(13 * u, 4.6 * u, 0.9 * u)}${star(9.1 * u, 7.3 * u, 0.9 * u)}${star(12.1 * u, 7.3 * u, 0.9 * u)}
      <rect width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="4"/>`;
  }

  // China: red field, one large and four small yellow stars (the small ones turned toward the large one)
  function flagCN(w) {
    const u = w / 30, h = w * 2 / 3;
    const star = (cx, cy, r, rot) => {
      let d = '';
      for (let i = 0; i < 10; i++) { const rr = i % 2 ? r * 0.382 : r, a = -Math.PI / 2 + rot + i * Math.PI / 5; d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1); }
      return `<path d="${d}Z" fill="#ffde00"/>`;
    };
    const small = [[10, 2], [12, 4], [12, 7], [10, 9]].map(([x, y]) => star(x * u, y * u, u, Math.atan2(5 - y, 5 - x) + Math.PI / 2)).join('');
    return `<rect width="${w}" height="${h}" fill="#de2910"/>${star(5 * u, 5 * u, 3 * u, 0)}${small}<rect width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="4"/>`;
  }


  // ---------- reusable props (strings; place inside a translate group) ----------
  // tear-off calendar page centred on (0,0): small top line (day/month), big number
  function calendar(top, big, w) {
    w = w || 260; const h = w * 1.1;
    return `<rect x="${-w / 2 + 10}" y="${-h / 2 + 12}" width="${w}" height="${h}" fill="#000" opacity="0.2"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" fill="#fbfaf5" stroke="${INK}" stroke-width="7"/>
      <rect x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h * 0.27}" fill="#d8433b" stroke="${INK}" stroke-width="7"/>
      <text x="0" y="${-h / 2 + h * 0.2}" font-size="${w * 0.17}" fill="#fbfaf5" text-anchor="middle">${top}</text>
      <text x="0" y="${h * 0.32}" font-size="${w * 0.48}" fill="${INK}" text-anchor="middle">${big}</text>
      <g fill="${INK}"><circle cx="${-w * 0.25}" cy="${-h / 2 - 2}" r="10"/><circle cx="${w * 0.25}" cy="${-h / 2 - 2}" r="10"/></g>`;
  }
  // desk nameplate, base centred at (0,0)
  function nameplate(text, w, fs) {
    w = w || 360; fs = fs || 54;
    return `<path d="M${-w / 2},0 L${w / 2},0 L${w / 2 - 22},-90 L${-w / 2 + 22},-90 Z" fill="#c9a34a" stroke="${INK}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M${-w / 2 + 14},-12 L${w / 2 - 14},-12 L${w / 2 - 30},-78 L${-w / 2 + 30},-78 Z" fill="${INK}"/>
      <text x="0" y="-28" font-size="${fs}" fill="#e8c86a" text-anchor="middle">${text}</text>`;
  }
  // rubber-stamp mark centred on (0,0)
  function stamp(text, col, fs) {
    fs = fs || 86; const w = text.length * fs * 0.56 + 70;
    return `<rect x="${-w / 2}" y="${-fs * 0.72}" width="${w}" height="${fs * 1.34}" rx="10" fill="none" stroke="${col || '#d8433b'}" stroke-width="${fs * 0.13}"/>
      <text x="0" y="${fs * 0.33}" font-size="${fs}" fill="${col || '#d8433b'}" text-anchor="middle">${text}</text>`;
  }
  // speech bubble centred on (0,0), tail toward (tx,ty)
  function bubble(text, fs, col, tx, ty) {
    fs = fs || 70; const w = text.length * fs * 0.55 + 90, h = fs * 1.9;
    tx = tx == null ? -w * 0.3 : tx; ty = ty == null ? h : ty;
    return `<path d="M${-w / 2 + 30},${-h / 2} L${w / 2 - 30},${-h / 2} Q${w / 2},${-h / 2} ${w / 2},${-h / 2 + 30} L${w / 2},${h / 2 - 30} Q${w / 2},${h / 2} ${w / 2 - 30},${h / 2} L${tx + 50},${h / 2} L${tx},${ty} L${tx + 10},${h / 2} L${-w / 2 + 30},${h / 2} Q${-w / 2},${h / 2} ${-w / 2},${h / 2 - 30} L${-w / 2},${-h / 2 + 30} Q${-w / 2},${-h / 2} ${-w / 2 + 30},${-h / 2} Z" fill="#fbfaf5" stroke="${INK}" stroke-width="7" stroke-linejoin="round"/>
      <text x="0" y="${fs * 0.35}" font-size="${fs}" fill="${col || INK}" text-anchor="middle">${text}</text>`;
  }
  // USA: 13 stripes, blue canton with a grid of small stars (simplified but correct colours/layout)
  function flagUS(w) {
    const h = w * 10 / 19, sh = h / 13, cw = w * 0.4, ch = sh * 7;
    let s = `<rect width="${w}" height="${h}" fill="#fff"/>`;
    for (let i = 0; i < 13; i += 2) s += `<rect y="${i * sh}" width="${w}" height="${sh}" fill="#b22234"/>`;
    s += `<rect width="${cw}" height="${ch}" fill="#3c3b6e"/>`;
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) s += `<circle cx="${cw * (c + 0.5) / 6}" cy="${ch * (r + 0.5) / 5}" r="${w * 0.009}" fill="#fff"/>`;
    return s + `<rect width="${w}" height="${h}" fill="none" stroke="${INK}" stroke-width="4"/>`;
  }
  // ID badge (no photo: a plain silhouette), centred on (0,0)
  function badge(name, role, col) {
    return `<rect x="-130" y="-170" width="260" height="340" rx="18" fill="#fbfaf5" stroke="${INK}" stroke-width="7"/>
      <rect x="-130" y="-170" width="260" height="70" rx="18" fill="${col || '#2f3e5c'}" stroke="${INK}" stroke-width="7"/>
      <rect x="-30" y="-200" width="60" height="40" rx="8" fill="#c9d1d6" stroke="${INK}" stroke-width="5"/>
      <circle cx="0" cy="-30" r="44" fill="#9a958a"/><path d="M-70,50 C-70,0 70,0 70,50 Z" fill="#9a958a"/>
      <text x="0" y="100" font-size="34" fill="${INK}" text-anchor="middle">${name}</text>
      <text x="0" y="145" font-size="26" fill="#6b6658" text-anchor="middle">${role}</text>`;
  }

  // the chip: green-edged package with gold pins (the film's hero object)
  function chip(size, id) {
    const s = size, p = s * 0.12, pins = [];
    for (let i = 0; i < 7; i++) {
      const o = -s / 2 + s * 0.14 + i * (s * 0.72 / 6);
      pins.push(`<rect x="${o - 4}" y="${-s / 2 - p}" width="8" height="${p}" fill="#e7b84a" stroke="${INK}" stroke-width="3"/>`);
      pins.push(`<rect x="${o - 4}" y="${s / 2}" width="8" height="${p}" fill="#e7b84a" stroke="${INK}" stroke-width="3"/>`);
      pins.push(`<rect x="${-s / 2 - p}" y="${o - 4}" width="${p}" height="8" fill="#e7b84a" stroke="${INK}" stroke-width="3"/>`);
      pins.push(`<rect x="${s / 2}" y="${o - 4}" width="${p}" height="8" fill="#e7b84a" stroke="${INK}" stroke-width="3"/>`);
    }
    return `<g id="${id || 'chip'}">${pins.join('')}
      <rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" rx="${s * 0.08}" fill="#2f3a33" stroke="${INK}" stroke-width="5"/>
      <rect x="${-s * 0.32}" y="${-s * 0.32}" width="${s * 0.64}" height="${s * 0.64}" rx="${s * 0.04}" fill="#7cc242" stroke="${INK}" stroke-width="4"/>
      <rect x="${-s * 0.2}" y="${-s * 0.2}" width="${s * 0.4}" height="${s * 0.4}" rx="${s * 0.03}" fill="#a6e070" opacity="0.9"/>
      <path d="M${-s * 0.26},${-s * 0.26} L${-s * 0.08},${-s * 0.26}" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity="0.7"/>
    </g>`;
  }

  // camera: shows point (fx,fy) at frame centre at zoom k, rotation r, plus a screen offset (dx,dy) for shakes.
  // Written straight to the transform attribute from a proxy, so pivots never drift when the focus changes.
  function cam(tl, sel, init) {
    const el = q(sel);
    const hook = init && init.onApply; init = Object.assign({}, init); delete init.onApply;
    const st = Object.assign({ fx: 960, fy: 540, k: 1, r: 0, dx: 0, dy: 0, oy: 0 }, init);
    const apply = () => { el.setAttribute('transform', `translate(${(960 + st.dx).toFixed(2)},${(540 + st.dy + st.oy).toFixed(2)}) rotate(${st.r.toFixed(3)}) scale(${st.k.toFixed(4)}) translate(${(-st.fx).toFixed(2)},${(-st.fy).toFixed(2)})`); if (hook) hook(st); };
    apply();
    const base = Object.assign({}, st);
    tl.fromTo(st, Object.assign({}, base), Object.assign({}, base, { duration: 0.001, onUpdate: apply, immediateRender: true }), 0);
    return {
      to(t, dur, props, ease) { tl.to(st, Object.assign({}, props, { duration: d(dur), ease: ease || 'power2.inOut', onUpdate: apply }), t); return this; },
      shake(t, a) { tl.to(st, { keyframes: [{ dx: -a, dy: a * 0.7, duration: 0.05 }, { dx: a * 0.9, dy: -a * 0.6, duration: 0.05 }, { dx: -a * 0.6, dy: a * 0.4, duration: 0.05 }, { dx: 0, dy: 0, duration: 0.06 }], onUpdate: apply }, t); return this; },
    };
  }


  // turn the head: yaw -1 (looks left) .. 0 (front) .. 1 (looks right); features slide and squeeze, the nose appears in profile
  function turn(tl, id, t, dur, to, from) {
    const y = q(`#${id}-yaw`); if (!y) return; const a0 = Number(y.dataset.a0), b0 = Number(y.dataset.b0), n = q(`#${id}-nose`), y0 = Number(n.dataset.y0);
    const A = (f) => 1 - 0.38 * Math.abs(f), P = (f) => ({ scaleX: A(f) / a0, x: (30 * f - b0) / a0, svgOrigin: '0 0' });
    const f = from == null ? y0 : from;
    tl.fromTo(`#${id}-yaw`, P(f), Object.assign(P(to), { duration: d(dur), ease: 'power2.inOut', immediateRender: false }), t);
    tl.fromTo(`#${id}-nose`, { x: (f - y0) * 71, opacity: Math.abs(f) > 0.45 ? 1 : 0 }, { x: (to - y0) * 71, opacity: Math.abs(to) > 0.45 ? 1 : 0, duration: d(dur), ease: 'power2.inOut', immediateRender: false }, t);
    look(tl, id, t, to * 8, 0);
  }

  // ---------- expressions for the mascot: eyes + mouth + brows + effects in one call ----------
  const EXPR = {
    neutral: { mouth: 'flat', brows: 'calm' },
    happy: { mouth: 'grin', brows: 'up', fx: ['spark'] },
    joy: { mouth: 'grin', brows: 'up', eyes: 'happy', fx: ['spark'] },
    love: { mouth: 'smile', brows: 'up', eyes: 'heart', fx: ['hearts'] },
    crying: { mouth: 'wail', brows: 'worried', eyes: 'cry', fx: ['tears'] },
    sad: { mouth: 'frown', brows: 'worried', fx: ['tears'] },
    nervous: { mouth: 'wave', brows: 'worried', fx: ['sweat'] },
    scared: { mouth: 'shock', brows: 'worried', fx: ['sweat'] },
    angry: { mouth: 'gritted', brows: 'angry', fx: ['anger', 'tint'] },
    dizzy: { mouth: 'wave', brows: 'worried', eyes: 'spiral', silent: true },
    mindblown: { mouth: 'shock', brows: 'up', bulge: true, silent: true },
    shocked: { mouth: 'shock', brows: 'up' },
    smug: { mouth: 'smirk', brows: 'angry', eyes: 'smug' },
    sleepy: { mouth: 'flat', brows: 'calm', eyes: 'sleepy', fx: ['zzz'], silent: true },
    scream: { mouth: 'shock', brows: 'up', bulge: true, fx: ['rings'], silent: true },
    explain: { mouth: 'open', brows: 'up' },
  };
  const MOUTHS = ['flat', 'smile', 'grin', 'open', 'frown', 'shock', 'wail', 'gritted', 'wave', 'smirk'];
  function expr(tl, id, t, name, dur) {
    const X = EXPR[name] || EXPR.neutral, D = dur || 1.6, has = (k) => (X.fx || []).includes(k);
    ['happy', 'cry', 'heart', 'spiral', 'smug', 'sleepy'].forEach((k) => tl.set(`#${id}-ex-${k}`, { opacity: k === X.eyes ? 1 : 0 }, t));
    tl.set(`#${id}-eyes`, { opacity: X.eyes ? 0 : 1 }, t);
    ['tears', 'sweat', 'hearts', 'anger', 'zzz', 'rings', 'spark'].forEach((k) => tl.set(`#${id}-fx-${k}`, { opacity: has(k) ? 1 : 0 }, t));
    tl.set(`#${id}-fx-tint`, { opacity: has('tint') ? 0.3 : 0 }, t);
    MOUTHS.filter((k) => q(`#${id}-m-${k}`)).forEach((k) => tl.set(`#${id}-m-${k}`, { opacity: k === X.mouth ? 1 : 0 }, t));
    brows(tl, id, t, X.brows);
    tl.fromTo(`#${id}-head`, { scaleX: 1.06, scaleY: 0.92, transformOrigin: '50% 100%' }, { scaleX: 1, scaleY: 1, duration: d(0.45), ease: 'elastic.out(1,0.45)' }, t - 0.02);
    tl.to(`#${id}-eyes`, { scale: X.bulge ? 1.3 : 1, transformOrigin: '50% 50%', duration: 0.15 }, t);
    const rep = (per) => Math.max(0, Math.ceil(D / per) - 1);
    if (has('tears')) { tl.fromTo(`#${id}-fx-tears .t1`, { y: 0 }, { y: 36, duration: 0.7, ease: 'none', repeat: rep(0.7) }, t); tl.fromTo(`#${id}-fx-tears .t2`, { y: 0 }, { y: 36, duration: 0.7, ease: 'none', repeat: rep(0.7) }, t + 0.25); }
    if (has('sweat')) tl.fromTo(`#${id}-fx-sweat`, { y: 0 }, { y: 28, duration: 0.9, ease: 'none', repeat: rep(0.9) }, t);
    if (has('hearts')) tl.fromTo(`#${id}-fx-hearts`, { y: 6 }, { y: -22, duration: 1.0, ease: 'sine.inOut', yoyo: true, repeat: rep(1.0) }, t);
    if (has('zzz')) tl.fromTo(`#${id}-fx-zzz`, { y: 0 }, { y: -22, duration: 1.1, ease: 'none', repeat: rep(1.1) }, t);
    if (has('rings')) tl.fromTo(`#${id}-fx-rings`, { scale: 0.92, transformOrigin: '50% 50%' }, { scale: 1.1, duration: 0.18, yoyo: true, repeat: rep(0.18) }, t);
  }

  window.T = { turn, EXPR, expr, secondary, lips, SLOW, d, cam, INK, SW, rng, S, char, armTo, armSet, mood, brows, blink, look, talk, idle, walk, map, pt, slug, flagSG, flagCN, flagUS, calendar, nameplate, stamp, bubble, badge, chip };
})();
