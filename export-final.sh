#!/usr/bin/env bash
# Copies the finished renders into "<video>/Final Clips/" named "Clip 01.mp4", "Clip 02.mp4" ... (zero-padded so CapCut sorts them in order).
# Run from inside the video folder:  bash "../_Studio Kit/export-final.sh"
set -e
OUT="Final Clips"; mkdir -p "$OUT"
for f in renders/*Clip\ [0-9]*.mp4; do
  [ -f "$f" ] || continue
  n=$(basename "$f" | grep -o 'Clip [0-9]\+' | grep -o '[0-9]\+')
  cp -f "$f" "$OUT/Clip $(printf %02d $((10#$n))).mp4"
done
ls "$OUT"
