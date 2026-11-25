#!/usr/bin/env bash
# One-time (or repair) setup of the NEW default engine (user 2026-11-21): the GrowKaz Stickman Studio engine + our own
# cartoon cast. Safe to re-run: it never touches existing projects.
#   bash "_Studio Kit/growkaz/setup-studio.sh"          (run from "YouTube Content")
# What it does:
#   1. copies the plugin kit (from the installed make-2d-video skill) into "YouTube Content/growkaz-stickman-studio/" if missing
#   2. overlays OUR patches from _Studio Kit/growkaz/: engine/toon2d.js (the user's hero + 20 expressions),
#      engine/styles.js (adds the "cozy" grade = our channel look), render.mjs (uses the user's Google Chrome, no Chromium download),
#      shared sets (sets/*.js, e.g. mall.js) into engine/sets/
#   3. npm install (renderer, three.js, fonts) and checks Python packages (numpy scipy faster-whisper)
# Windows notes: Whisper needs the Microsoft Visual C++ runtime (winget install Microsoft.VCRedist.2015+.x64).
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"            # _Studio Kit/growkaz
ROOT="$(cd "$HERE/../.." && pwd)"                               # YouTube Content
STUDIO="$ROOT/growkaz-stickman-studio"
SKILL_KIT="$HOME/.claude/skills/make-2d-video/kit"
if [ ! -f "$STUDIO/render.mjs" ]; then
  [ -d "$SKILL_KIT" ] || { echo "make-2d-video skill not installed (needs ~/.claude/skills/make-2d-video). Install the GrowKaz_Stickman.plugin first."; exit 1; }
  mkdir -p "$STUDIO"; cp -r "$SKILL_KIT/." "$STUDIO/"; echo "studio copied from the plugin kit"
fi
cp -f "$HERE/engine/"*.js "$STUDIO/engine/"            # toon2d.js, storyfx.js, styles.js (+ any new engine helpers)
mkdir -p "$STUDIO/engine/cast19"; cp -f "$HERE/engine/cast19/"* "$STUDIO/engine/cast19/"   # Character 19 rig + cast (2026-11-25)
cp -f "$HERE/render.mjs" "$STUDIO/render.mjs"
mkdir -p "$STUDIO/engine/sets"; cp -f "$HERE/sets/"*.js "$STUDIO/engine/sets/" 2>/dev/null || true
mkdir -p "$STUDIO/engine/sets3d"; cp -f "$HERE/sets3d/"*.js "$STUDIO/engine/sets3d/" 2>/dev/null || true   # soft cartoon 3D sets (three-toon.js)
cd "$STUDIO"
[ -d node_modules/three ] || npm install --no-audit --no-fund
python3 -c "import numpy, scipy" 2>/dev/null || python3 -m pip install numpy scipy faster-whisper
python3 -c "import faster_whisper" 2>/dev/null && echo "whisper: ok" || echo "whisper: NOT loading (install the VC++ runtime); our own word timings still work"
[ -f "/c/Program Files/Google/Chrome/Application/chrome.exe" ] && echo "chrome: ok" || echo "chrome: not found (set CHROME_PATH or run: npx playwright install chromium)"
echo "studio ready: $STUDIO"
