#!/usr/bin/env bash
# Start a NEW video project that reuses this kit:   bash new-video.sh "Video 2"
# Creates ../../<name>/ (next to the current project) with:
#   Animation/            a git clone of this kit (clips start again at 1; `git pull` later brings kit upgrades)
#   Voice-overs Chunks/   put the narration mp3s here (Clip 01 - Voice-over.mp3 ...)
#   Transcript Chunks/    put the scripts here (VO_01.txt ...), paired with the mp3s by number
#   CLAUDE.md             working rules for Claude (open your Claude session in this folder)
set -euo pipefail
NAME="${1:?usage: new-video.sh \"Video 2\"}"
ANIM="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$(cd "$ANIM/../.." && pwd)/$NAME"
[ -e "$DEST" ] && { echo "already exists: $DEST"; exit 1; }
mkdir -p "$DEST/Voice-overs Chunks" "$DEST/Transcript Chunks"
git clone -q "$ANIM" "$DEST/Animation"
ORIGIN="$(git -C "$ANIM" remote get-url origin 2>/dev/null || true)"
[ -n "$ORIGIN" ] && git -C "$DEST/Animation" remote set-url origin "$ORIGIN"
# a clone only has committed files: carry over uncommitted kit edits too
mkdir -p "$DEST/Animation/_base"
for f in _kit/toon.js _kit/scenes.js _kit/world.js scene.py mount.py lipsync.py new-clip.sh render-clip.sh _base/package.json _base/hyperframes.json; do cp "$ANIM/$f" "$DEST/Animation/$f"; done
cp "$ANIM/PROJECT_CLAUDE.md" "$DEST/CLAUDE.md"
echo "Created: $DEST"
echo "Next: put narration in 'Voice-overs Chunks', scripts in 'Transcript Chunks', open Claude in that folder, ask for clip 1."
