#!/usr/bin/env bash
# Check and render clip N:  bash render-clip.sh 2   →  renders/Clip 2.mp4
# Prints only errors from the check (token-light), then renders at 1080p30 high quality.
set -euo pipefail
ANIM="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
N=$((10#${1:?usage: render-clip.sh N}))
P="$ANIM/clip-$(printf %02d "$N")"
cd "$P"
V=$(grep -o 'hyperframes@[0-9.]*' package.json | head -1)
echo "== check"
npx --yes "$V" check --no-cache 2>&1 | grep -E "✗|^\s+✗| error|Error" | grep -v " 0 error" || echo "no errors"
mkdir -p "$ANIM/renders"
echo "== render"
npx --yes "$V" render . -o "$ANIM/renders/Clip $N.mp4" -q high --fps 30 2>&1 | grep -E "rendered in|rror" || true
ls -la "$ANIM/renders/Clip $N.mp4"
