#!/usr/bin/env bash
# Scaffold clip N:  bash new-clip.sh 2
# Finds voice-over N and script N (matched by the first number in each file name), copies the shared kit,
# times every word with Parakeet, writes index.html with the voice track, and prints what the planner needs.
set -euo pipefail
ANIM="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VIDEO="$(dirname "$ANIM")"
N=$((10#${1:?usage: new-clip.sh N}))
NN=$(printf %02d "$N")
P="$ANIM/clip-$NN"
KIT="$HOME/claude-skill-repos/claude-animation-skills/kit"
PY="$KIT/.venv/bin/python"

pick() { # first file in dir $1 whose first number equals N
  for f in "$1"/*; do
    num=$(basename "$f" | grep -o '[0-9]\+' | head -1 || true)
    [ -n "$num" ] && [ $((10#$num)) -eq "$N" ] && { echo "$f"; return; }
  done
}
VO=$(pick "$(ls -d "$VIDEO"/Voice*over* 2>/dev/null | head -1)")
TX=$(pick "$(ls -d "$VIDEO"/Transcript* "$VIDEO"/Script* 2>/dev/null | head -1)")
[ -n "$VO" ] || { echo "no voice-over numbered $N"; exit 1; }
[ -n "$TX" ] || { echo "no script numbered $N"; exit 1; }
[ -e "$P" ] && { echo "exists: $P"; exit 1; }

mkdir -p "$P/compositions" "$P/assets/fonts"
cp "$ANIM/_kit/toon.js" "$ANIM/_kit/world.js" "$ANIM/_kit/scenes.js" "$P/assets/"
cp "$ANIM/_kit/fonts/"* "$P/assets/fonts/"
cp "$ANIM/clip-01/package.json" "$ANIM/clip-01/hyperframes.json" "$P/"
sed -i "s/clip-01/clip-$NN/g" "$P/package.json"
printf '{\n  "id": "clip-%s",\n  "name": "clip-%s"\n}\n' "$NN" "$NN" > "$P/meta.json"
cp "$VO" "$P/assets/vo.mp3"
cp "$TX" "$P/assets/script.txt"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/assets/vo.mp3")
ROOT=$(python3 -c "print(round($DUR + 0.5, 1))")

cat > "$P/index.html" <<EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="assets/world.js"></script>
    <script src="assets/toon.js"></script>
    <script src="assets/scenes.js"></script>
    <style>
      @font-face { font-family: "Kalam"; src: url("assets/fonts/kalam-700.woff2") format("woff2"); font-weight: 700; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; background: #1b1a1f; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      #root > div { filter: saturate(0.85) contrast(1.06); }
    </style>
  </head>
  <body>
    <!-- Clip $N. Scenes overlap ~0.3 s; the incoming scene (higher z-index) plays the transition. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="$ROOT" data-width="1920" data-height="1080">
      <!-- SCENES -->
      <audio id="vo" class="clip" src="assets/vo.mp3" data-start="0" data-duration="$DUR" data-track-index="10" data-volume="1"></audio>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
EOF

echo "== clip $N  →  $P"
echo "== voice: $(basename "$VO")  ($DUR s, root $ROOT s)"
echo "== words (word@seconds):"
(cd "$P/assets" && "$PY" "$KIT/words.py" vo.mp3 script.txt) | grep -v '^wrote'
