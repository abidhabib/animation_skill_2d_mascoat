#!/usr/bin/env bash
# Check and render clip N:  bash render-clip.sh 2   →  renders/Clip 2.mp4
# Prints only errors from the check (token-light), then renders at 1080p30 high quality.
set -euo pipefail
ANIM="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# --- shared studio: run from inside a video folder (it has "Voice-overs Chunks" or "clips") and everything
# --- goes there: <video>/clips/clip-NN, <video>/renders/<V02> - Clip N.mp4. VIDEO_DIR=... forces a folder.
# --- Run from anywhere else = legacy mode (clips inside the kit folder, voice files next to the kit).
if [ -n "${VIDEO_DIR:-}" ]; then VD="$(cd "$VIDEO_DIR" && pwd)"; elif [ -d "$PWD/Voice-overs Chunks" ] || [ -d "$PWD/clips" ]; then VD="$PWD"; else VD=""; fi
if [ -n "$VD" ]; then VIDEO="$VD"; CLIPS="$VD/clips"; RD="$VD/renders"; PFX="$(basename "$VD" | grep -o '^V[0-9]\+' || true)"; else VIDEO="$(dirname "$ANIM")"; CLIPS="$ANIM"; RD="$ANIM/renders"; PFX=""; fi
ARG="${1:?usage: render-clip.sh N   |   render-clip.sh S1  (Short 1 -> renders/Short 1.mp4)}"
if [[ "$ARG" =~ ^[Ss]([0-9]+)$ ]]; then K=$((10#${BASH_REMATCH[1]})); N=$((89 + K)); OUT="${PFX:+$PFX - }Short $K.mp4"; else N=$((10#$ARG)); OUT="${PFX:+$PFX - }Clip $N.mp4"; fi
P="$CLIPS/clip-$(printf %02d "$N")"
cd "$P"
V=$(grep -o 'hyperframes@[0-9.]*' package.json | head -1)
echo "== check"
npx --yes "$V" check --no-cache 2>&1 | grep -E "✗|^\s+✗| error|Error" | grep -v " 0 error" || echo "no errors"
mkdir -p "$RD"
echo "== render"
npx --yes "$V" render . -o "$RD/$OUT" -q high --fps 30 2>&1 | grep -E "rendered in|rror" || true
ls -la "$RD/$OUT"
