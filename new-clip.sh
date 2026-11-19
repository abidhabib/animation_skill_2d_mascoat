#!/usr/bin/env bash
# Scaffold clip N:  bash new-clip.sh 2
# Finds voice-over N and script N (matched by the first number in each file name), copies the shared kit,
# times every word with Parakeet, writes index.html with the voice track, and prints what the planner needs.
set -euo pipefail
ANIM="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VIDEO="$(dirname "$ANIM")"
ARG="${1:?usage: new-clip.sh N   |   new-clip.sh S1  (YouTube Short 1 = portrait 9:16, stored as clip 90)}"
SHORT=0; K=0
if [[ "$ARG" =~ ^[Ss]([0-9]+)$ ]]; then SHORT=1; K=$((10#${BASH_REMATCH[1]})); N=$((89 + K)); else N=$((10#$ARG)); fi
NN=$(printf %02d "$N")
P="$ANIM/clip-$NN"
KIT="$HOME/claude-skill-repos/claude-animation-skills/kit"
PY="$KIT/.venv/bin/python"

pick() { # first file in dir $1 whose first number equals N (for a Short: file name contains "Short" and its number equals K)
  for f in "$1"/*; do
    b=$(basename "$f"); num=$(echo "$b" | grep -o '[0-9]\+' | head -1 || true)
    if [ "$SHORT" = 1 ]; then
      case "$b" in *[Ss]hort*) ;; *) continue ;; esac
      [ -n "$num" ] && [ $((10#$num)) -eq "$K" ] && { echo "$f"; return; }
    else
      case "$b" in *[Ss]hort*) continue ;; esac
      [ -n "$num" ] && [ $((10#$num)) -eq "$N" ] && { echo "$f"; return; }
    fi
  done
}
VO=$(pick "$(ls -d "$VIDEO"/Voice*over* 2>/dev/null | head -1)")
TX=$(pick "$(ls -d "$VIDEO"/Transcript* "$VIDEO"/Script* 2>/dev/null | head -1)")
SILENT="${SILENT:-}"   # SILENT=45 bash new-clip.sh S1  -> a silent clip of 45 s (no voice-over yet; time scenes by hand, add the voice later)
if [ -z "$SILENT" ]; then
[ -n "$VO" ] || { echo "no voice-over numbered $N"; exit 1; }
[ -n "$TX" ] || { echo "no script numbered $N"; exit 1; }
fi
[ -e "$P" ] && { echo "exists: $P"; exit 1; }

mkdir -p "$P/compositions" "$P/assets/fonts"
cp "$ANIM/_kit/toon.js" "$ANIM/_kit/world.js" "$ANIM/_kit/scenes.js" "$P/assets/"
cp "$ANIM/_kit/fonts/"* "$P/assets/fonts/"
cp "$ANIM/_base/package.json" "$ANIM/_base/hyperframes.json" "$P/"
sed -i "s/clip-01/clip-$NN/g" "$P/package.json"
if [ "$SHORT" = 1 ]; then
  printf '{\n  "id": "clip-%s",\n  "name": "clip-%s",\n  "portrait": true\n}\n' "$NN" "$NN" > "$P/meta.json"; W=1080; H=1920
else
  printf '{\n  "id": "clip-%s",\n  "name": "clip-%s"\n}\n' "$NN" "$NN" > "$P/meta.json"; W=1920; H=1080
fi
if [ -z "$SILENT" ]; then
  cp "$VO" "$P/assets/vo.mp3"
  cp "$TX" "$P/assets/script.txt"
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$P/assets/vo.mp3")
  ROOT=$(python3 -c "print(round($DUR + 0.5, 1))")
  AUDIO="<audio id=\"vo\" class=\"clip\" src=\"assets/vo.mp3\" data-start=\"0\" data-duration=\"$DUR\" data-track-index=\"10\" data-volume=\"1\"></audio>"
else
  DUR="$SILENT"; ROOT="$SILENT"; AUDIO=""
fi

cat > "$P/index.html" <<EOF
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=$W, height=$H" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <script src="assets/world.js"></script>
    <script src="assets/toon.js"></script>
    <script src="assets/scenes.js"></script>
    <style>
      @font-face { font-family: "Kalam"; src: url("assets/fonts/kalam-700.woff2") format("woff2"); font-weight: 700; }
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { margin: 0; width: ${W}px; height: ${H}px; overflow: hidden; background: #1b1a1f; }
      #root { position: relative; width: 100%; height: 100%; overflow: hidden; }
      #root > div { filter: saturate(0.85) contrast(1.06); }
    </style>
  </head>
  <body>
    <!-- Clip $N. Scenes overlap ~0.3 s; the incoming scene (higher z-index) plays the transition. -->
    <div id="root" data-composition-id="main" data-start="0" data-duration="$ROOT" data-width="$W" data-height="$H">
      <!-- SCENES -->
      $AUDIO
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
EOF

echo "== clip $N  →  $P"
if [ -n "$SILENT" ]; then echo "== silent clip, $SILENT s (no voice-over). Scene times are hand-set."; exit 0; fi
echo "== voice: $(basename "$VO")  ($DUR s, root $ROOT s)"
echo "== words (word@seconds):"
(cd "$P/assets" && "$PY" "$KIT/words.py" vo.mp3 script.txt) | grep -v '^wrote'
python3 "$ANIM/lipsync.py" "$P" || echo "(lip sync envelope skipped)"
[ "$SHORT" = 1 ] && echo "== portrait: camera is lifted for the 9:16 safe zone; scene.py prints SAFE-ZONE warnings" || true
