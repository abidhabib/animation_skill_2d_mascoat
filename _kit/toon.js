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
    const face = o.face == null ? 0.3 : o.face, fx = 12 * face, st = (w) => `stroke="${PI}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
    const leg = (side) => { const x = side === 'l' ? -20 : 20, dir = side === 'l' ? -1 : 1;
      return `<g id="${id}-l${side === 'l' ? 'l' : 'r'}"><path d="M${x},-76 L${x},-16" fill="none" stroke="${PI}" stroke-width="20" stroke-linecap="round"/><path d="M${x},-76 L${x},-16" fill="none" stroke="${pants}" stroke-width="13" stroke-linecap="round"/>
        <path ${st(4)} fill="#fff" d="M${x - 18},-4 C${x - 18},-24 ${x + 14},-26 ${x + 20},-12 L${x + 22},0 L${x - 18},0Z" transform="${side === 'r' ? '' : ''}"/><path d="M${x - 18},-4 L${x + 22},-4" stroke="${hood}" stroke-width="7" stroke-linecap="round"/><path d="M${x - 6},-20 l6,5 M${x + 4},-22 l6,5" stroke="${PI}" stroke-width="3" stroke-linecap="round"/></g>`; };
    const arm = (side) => { const x = side === 'l' ? -48 : 48, k = side === 'l' ? -6 : 6;
      return `<g id="${id}-a${side}" data-sx="${x}" data-sy="-190">
        <path d="M${x},-190 Q${x + k},-142 ${x},-100" fill="none" stroke="${PI}" stroke-width="26" stroke-linecap="round"/><path d="M${x},-190 Q${x + k},-142 ${x},-100" fill="none" stroke="${hood}" stroke-width="18" stroke-linecap="round"/>
        <path d="M${x - 11},-104 L${x + 11},-104" stroke="${hoodDark}" stroke-width="7" stroke-linecap="round"/><circle ${st(4)} fill="${skin}" cx="${x}" cy="-90" r="13"/>
        ${o.prop && o.prop.side === side ? `<g id="${id}-prop" transform="translate(${x},-90)">${o.prop.svg}</g>` : ''}</g>`; };
    const torsoD = 'M-52,-206 C-62,-140 -64,-98 -48,-68 L48,-68 C64,-98 62,-140 52,-206 C36,-224 -36,-224 -52,-206Z';
    const torso = `<defs><linearGradient id="${id}-tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a1a00" stop-opacity="0.3"/></linearGradient></defs>
      <path ${st(5)} fill="${hood}" d="${torsoD}"/><path d="${torsoD}" fill="url(#${id}-tg)"/>
      <path ${st(5)} fill="${hoodDark}" d="M-54,-212 C-40,-240 40,-240 54,-212 C30,-196 -30,-196 -54,-212Z"/>
      <path ${st(4)} fill="none" d="M-14,-204 L-17,-158 M14,-204 L17,-158"/><circle cx="-17" cy="-154" r="5" fill="#fff" stroke="${PI}" stroke-width="3"/><circle cx="17" cy="-154" r="5" fill="#fff" stroke="${PI}" stroke-width="3"/>
      <path ${st(4)} fill="${hoodDark}" fill-opacity="0.55" d="M-38,-122 C-30,-98 30,-98 38,-122"/><path d="M-40,-100 L-30,-90 M40,-100 L30,-90" stroke="${PI}" stroke-width="4" stroke-linecap="round"/>
      <path d="M52,-196 C62,-150 64,-110 50,-76" fill="none" stroke="#8be9ff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
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
    const pupil = (cx) => `<ellipse fill="${PI}" cx="${cx}" cy="2" rx="9" ry="12.5"/><circle fill="#fff" cx="${cx - 3.5}" cy="-4" r="4.2"/><circle fill="#fff" cx="${cx + 3.5}" cy="6" r="2"/>`;
    const glasses = o.glasses ? `<g ${st(3.5)} fill="rgba(255,255,255,0.18)"><circle cx="${fx - 20}" cy="-2" r="20"/><circle cx="${fx + 20}" cy="-2" r="20"/><path fill="none" d="M${fx},-2 L${fx},-2"/></g>` : '';
    const curl = o.curl === false ? '' : `<path ${st(5.5)} fill="none" d="M0,-58 C-4,-84 22,-98 30,-80 C36,-66 16,-62 18,-74"/>`;

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
      return `<g id="${id}-l${side === 'l' ? 'l' : 'r'}"><path d="M${x},-76 L${x},-16" fill="none" stroke="${PI}" stroke-width="20" stroke-linecap="round"/><path d="M${x},-76 L${x},-16" fill="none" stroke="${pants}" stroke-width="13" stroke-linecap="round"/>
        <path ${st(4)} fill="#fff" d="M${x - 10},-4 C${x - 10},-26 ${x + 22},-26 ${x + 34},-12 L${x + 38},0 L${x - 10},0Z"/><path d="M${x - 10},-4 L${x + 38},-4" stroke="${hood}" stroke-width="7" stroke-linecap="round"/><path d="M${x + 2},-21 l5,5 M${x + 11},-22 l5,5" stroke="${PI}" stroke-width="3" stroke-linecap="round"/></g>`; };
    const sideArm = (side) => { const x = side === 'l' ? -3 : 3, col = side === 'l' ? hoodDark : hood;
      return `<g id="${id}-a${side}" data-sx="${x}" data-sy="-190">
        <path d="M${x},-190 Q${x + 5},-142 ${x},-100" fill="none" stroke="${PI}" stroke-width="26" stroke-linecap="round"/><path d="M${x},-190 Q${x + 5},-142 ${x},-100" fill="none" stroke="${col}" stroke-width="18" stroke-linecap="round"/>
        <path d="M${x - 11},-104 L${x + 11},-104" stroke="${hoodDark}" stroke-width="7" stroke-linecap="round"/><circle ${st(4)} fill="${skin}" cx="${x}" cy="-90" r="13"/>
        ${o.prop && o.prop.side === side ? `<g id="${id}-prop" transform="translate(${x},-90)">${o.prop.svg}</g>` : ''}</g>`; };
    const grad = `<defs><linearGradient id="${id}-tg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0.28"/><stop offset="0.5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#3a1a00" stop-opacity="0.3"/></linearGradient></defs>`;
    const SD = 'M-36,-206 C-46,-140 -48,-98 -36,-68 L36,-68 C48,-98 46,-140 36,-206 C24,-224 -24,-224 -36,-206Z';
    const sideTorso = `${grad}<path ${st(5)} fill="${hoodDark}" d="M-30,-216 C-84,-222 -90,-166 -34,-154Z"/><path ${st(5)} fill="${hood}" d="${SD}"/><path d="${SD}" fill="url(#${id}-tg)"/>
      <path ${st(4)} fill="none" d="M18,-204 L21,-160"/><circle cx="21" cy="-156" r="5" fill="#fff" stroke="${PI}" stroke-width="3"/>
      <path ${st(4)} fill="${hoodDark}" fill-opacity="0.55" d="M-2,-120 C6,-96 28,-98 36,-122"/><path d="M36,-196 C46,-150 48,-110 36,-76" fill="none" stroke="#8be9ff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
    const backTorso = `${grad}<path ${st(5)} fill="${hood}" d="${torsoD}"/><path d="${torsoD}" fill="url(#${id}-tg)"/>
      <path ${st(5)} fill="${hoodDark}" d="M-58,-216 C-40,-254 40,-254 58,-216 C38,-168 -38,-168 -58,-216Z"/><path d="M0,-210 L0,-182 M0,-150 L0,-76" stroke="${PI}" stroke-width="4" stroke-linecap="round"/><path d="M52,-196 C62,-150 64,-110 50,-76" fill="none" stroke="#8be9ff" stroke-width="4" stroke-linecap="round" opacity="0.7"/>`;
    const legsV = view === 'side' ? sideLeg('l') + sideLeg('r') : leg('l') + leg('r');
    const armsV = view === 'side' ? [sideArm('l'), sideArm('r')] : [arm('l'), arm('r')];
    const torsoV = view === 'side' ? sideTorso : view === 'back' ? backTorso : torso;
    const faceT = view === 'side' ? 'translate(30,0) scale(0.62,1)' : view === 'q3' ? 'translate(13,0) scale(0.86,1)' : '';
    const nose = view === 'side' ? `<ellipse ${st(4)} fill="${skin}" cx="71" cy="6" rx="8" ry="6.5"/>` : view === 'q3' ? `<ellipse ${st(4)} fill="${skin}" cx="${fx + 38}" cy="8" rx="6" ry="5"/>` : '';
    const ears = view === 'side' ? `<ellipse ${st(4)} fill="${skin}" cx="-30" cy="12" rx="9" ry="13"/>` : view === 'back' ? `<ellipse ${st(4)} fill="${skin}" cx="-68" cy="6" rx="9" ry="13"/><ellipse ${st(4)} fill="${skin}" cx="68" cy="6" rx="9" ry="13"/>` : '';
    const head = `<g transform="translate(0,-282) scale(1.22)"><g id="${id}-head">
        <defs><radialGradient id="${id}-hg" cx="0.38" cy="0.3" r="0.85"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="0.6" stop-color="${skin}" stop-opacity="0"/><stop offset="1" stop-color="#7a5fb0" stop-opacity="0.35"/></radialGradient></defs>
        ${curl}
        <ellipse ${st(5)} fill="${skin}" cx="0" cy="0" rx="68" ry="62"/><ellipse cx="0" cy="0" rx="68" ry="62" fill="url(#${id}-hg)"/>
        <path d="M52,-34 A68,62 0 0 1 56,34" fill="none" stroke="#8be9ff" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
        ${ears}
        <g id="${id}-face" transform="${faceT}" opacity="${view === 'back' ? 0 : 1}">
        <ellipse cx="${fx - 42}" cy="22" rx="12" ry="7.5" fill="#ff8fb0" opacity="0.55"/><ellipse cx="${fx + 42}" cy="22" rx="12" ry="7.5" fill="#ff8fb0" opacity="0.55"/>
        <g id="${id}-eyes" transform="translate(${fx},-6)">${eye(-22)}${eye(22)}<g id="${id}-pupils">${pupil(-22)}${pupil(22)}</g></g>
        <g id="${id}-brows" ${st(6)} fill="none"><path id="${id}-bl" d="M${fx - 38},-34 L${fx - 8},-38"/><path id="${id}-br" d="M${fx + 8},-38 L${fx + 38},-34"/></g>
        ${altEyes}${mouthSvg}${glasses}</g>${nose}${fxSvg}
      </g></g>`;
    const sc = o.scale || 1;
    return `<g id="${id}-pos"><g id="${id}" transform="translate(${o.x || 0},${o.y || 0}) scale(${(o.flip ? -1 : 1) * sc},${sc})">
      <ellipse fill="#000" opacity="0.22" cx="0" cy="3" rx="78" ry="13"/>
      ${legsV}
      <g id="${id}-body">${armsV[0]}${torsoV}${armsV[1]}</g>
      ${head}
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
  function armTo(tl, id, side, deg, t, dur, ease) {
    const g = q(`#${id}-a${side}`);
    tl.to(g, { rotation: deg, svgOrigin: `${g.dataset.sx} ${g.dataset.sy}`, duration: d(dur || 0.35), ease: ease || 'back.out(1.6)' }, t);
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
  }
  // walk cycle: legs scissor, small bob, translation by dx over [t0,t1]
  function walk(tl, id, t0, t1, dx, x0) {
    const steps = Math.max(2, Math.round((t1 - t0) / d(0.26)));
    const st = (t1 - t0) / steps;
    for (let i = 0; i < steps; i++) {
      const a = i % 2 ? 22 : -22;
      tl.to(`#${id}-ll`, { rotation: a, svgOrigin: '-18 -76', duration: st, ease: 'sine.inOut' }, t0 + i * st);
      tl.to(`#${id}-lr`, { rotation: -a, svgOrigin: '18 -76', duration: st, ease: 'sine.inOut' }, t0 + i * st);
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
    const st = Object.assign({ fx: 960, fy: 540, k: 1, r: 0, dx: 0, dy: 0 }, init);
    const apply = () => el.setAttribute('transform', `translate(${(960 + st.dx).toFixed(2)},${(540 + st.dy).toFixed(2)}) rotate(${st.r.toFixed(3)}) scale(${st.k.toFixed(4)}) translate(${(-st.fx).toFixed(2)},${(-st.fy).toFixed(2)})`);
    apply();
    const base = Object.assign({}, st);
    tl.fromTo(st, Object.assign({}, base), Object.assign({}, base, { duration: 0.001, onUpdate: apply, immediateRender: true }), 0);
    return {
      to(t, dur, props, ease) { tl.to(st, Object.assign({}, props, { duration: d(dur), ease: ease || 'power2.inOut', onUpdate: apply }), t); return this; },
      shake(t, a) { tl.to(st, { keyframes: [{ dx: -a, dy: a * 0.7, duration: 0.05 }, { dx: a * 0.9, dy: -a * 0.6, duration: 0.05 }, { dx: -a * 0.6, dy: a * 0.4, duration: 0.05 }, { dx: 0, dy: 0, duration: 0.06 }], onUpdate: apply }, t); return this; },
    };
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

  window.T = { EXPR, expr, SLOW, d, cam, INK, SW, rng, S, char, armTo, armSet, mood, brows, blink, look, talk, idle, walk, map, pt, slug, flagSG, flagCN, flagUS, calendar, nameplate, stamp, bubble, badge, chip };
})();
