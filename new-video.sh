#!/usr/bin/env bash
# Start a NEW video in the shared studio:   bash "_Studio Kit/new-video.sh" "V03 - Topic"
# Creates "YouTube Content/<name>/" next to this kit. NO copy or clone of the kit: every video uses
# "_Studio Kit" directly, so kit upgrades reach all videos at once (GitHub is only the backup).
#   Voice-overs Chunks/   narration mp3s (Clip 01 - Voice-over.mp3 ..., Short 1 - Voice-over.mp3)
#   Transcript Chunks/    matching texts, paired by number
#   specs/ clips/ renders/ thumbnails/
# Work from inside the video folder:  cd "V03 - Topic" && bash "../_Studio Kit/new-clip.sh" 1
# Open Claude in "YouTube Content" (the shared CLAUDE.md + memory live there).
set -euo pipefail
NAME="${1:?usage: new-video.sh \"V03 - Topic\"}"
KITD="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="$(dirname "$KITD")/$NAME"
[ -e "$DEST" ] && { echo "already exists: $DEST"; exit 1; }
mkdir -p "$DEST/Voice-overs Chunks" "$DEST/Transcript Chunks" "$DEST/specs" "$DEST/clips" "$DEST/renders" "$DEST/thumbnails"
echo "Created: $DEST"
echo "Next: cd into it, put narration in 'Voice-overs Chunks' + texts in 'Transcript Chunks' (or let Claude make the Fish voice-over), then: bash \"../_Studio Kit/new-clip.sh\" 1"
