#!/usr/bin/env bash
# Per-clip helper for the NEW default engine (user 2026-11-21). Run from inside the video folder, e.g. "V02 - Trust Numbers".
#   bash "../_Studio Kit/growkaz/gk-clip.sh" init 20      -> needs "Voice-overs Chunks/Clip 20 - Voice-over.mp3" (built with fishjoin.py);
#                                                           times every word (our Parakeet, via new-clip.sh), creates the studio
#                                                           project <video-prefix>-clipNN with config (cozy style, 1080p, 30 fps),
#                                                           copies the words into its timeline, prints the words for planning.
#   (then Claude writes  projects/<slug>/story/shots.json  and  projects/<slug>/scenes/shots/01_main.js  using engine/toon2d.js)
#   bash "../_Studio Kit/growkaz/gk-clip.sh" sheet 20     -> contact sheet of every shot (look at it before rendering)
#   bash "../_Studio Kit/growkaz/gk-clip.sh" render 20    -> full render + music/SFX mix, copies to renders/<V02> - Clip 20.mp4 and Final Clips/
set -euo pipefail
CMD="${1:?init|sheet|render}"; N="$((10#${2:?clip number}))"; NN=$(printf %02d "$N")
VIDEO="$PWD"; KIT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"; ROOT="$(cd "$KIT/.." && pwd)"; STUDIO="$ROOT/growkaz-stickman-studio"
PFX="$(basename "$VIDEO" | grep -o '^V[0-9]\+' || echo vid)"; SLUG="$(echo "$PFX" | tr 'A-Z' 'a-z')-clip$NN"; P="$STUDIO/projects/$SLUG"
[ -f "$STUDIO/render.mjs" ] || bash "$KIT/growkaz/setup-studio.sh"
case "$CMD" in
  init)
    VO="$VIDEO/Voice-overs Chunks/Clip $NN - Voice-over.mp3"; [ -f "$VO" ] || { echo "missing $VO"; exit 1; }
    TX="$VIDEO/Transcript Chunks/Clip $NN - Transcript.txt"
    rm -rf "$VIDEO/clips/clip-$NN"; bash "$KIT/new-clip.sh" "$N" > "/tmp/gk_newclip_$NN.log" 2>&1 || { tail -5 "/tmp/gk_newclip_$NN.log"; exit 1; }
    cd "$STUDIO"; rm -rf "projects/$SLUG"
    python3 tools/new_project.py --name "$SLUG" --voice "$VO" ${TX:+--script "$TX"} --aspect 16:9 --resolution 1080p --fps 30 --style cozy --title "$PFX Clip $N" | tail -1
    python3 -I - "$VIDEO/clips/clip-$NN/assets/vo.words.json" "projects/$SLUG" <<'PY'
import json, sys
sys.path.insert(0, "tools")
from common import sentences_from_words, write_timeline
w = json.load(open(sys.argv[1], encoding="utf-8")); proj = sys.argv[2]
words = [{"word": x["w"], "start": round(x["s"], 3), "end": round(x["e"], 3)} for x in w]
write_timeline(proj + "/timeline", words, sentences_from_words(words), "parakeet (studio kit)")
c = json.load(open(proj + "/config.json")); c.update(style="cozy", bars=None); c["music"]["gainDb"] = -22
json.dump(c, open(proj + "/config.json", "w"), indent=1)
PY
    printf "// cast lives in /engine/toon2d.js (HERO, CASHIER, STRANGER, SAM, SHOPPER(i))\nexport const CAST = [];\n" > "projects/$SLUG/scenes/cast.js"
    grep "@" "/tmp/gk_newclip_$NN.log" | sed -n '2,200p'
    echo "project: $P   (write story/shots.json + scenes/shots/01_main.js; example: _Studio Kit/growkaz/example-v02-clip19)";;
  sheet)
    cd "$STUDIO"; node render.mjs --project "projects/$SLUG" --sheet --scale 0.4 | tail -1; echo "$P/build/sheets/sheet_01.png";;
  render)
    cd "$STUDIO"; node render.mjs --project "projects/$SLUG" --workers 4 | tail -2; python3 audio/mix.py --project "projects/$SLUG" | tail -1
    OUT="$(ls -t "projects/$SLUG/out/"*.mp4 | head -1)"; mkdir -p "$VIDEO/renders"; cp -f "$OUT" "$VIDEO/renders/$PFX - Clip $N.mp4"
    cd "$VIDEO"; bash "$KIT/export-final.sh" | tail -1; echo "final: $VIDEO/renders/$PFX - Clip $N.mp4";;
  *) echo "usage: gk-clip.sh init|sheet|render N"; exit 1;;
esac
