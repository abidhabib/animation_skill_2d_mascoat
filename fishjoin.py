"""Join Fish Text-to-Speech parts into one clip voice-over (run from inside the video folder):
    python3 "../_Studio Kit/fishjoin.py" "Clip 02" "<text of the whole clip>" part1.mp3 part2.mp3 [gap=0.5] part3.mp3 ...
Parts are files or https links (Fish history audio: https://platform.r2.fish.audio/tasks/<date>/<id>.mp3, fetched
with curl). Each part's edge silence is trimmed, parts are joined with 0.35 s pauses (write gap=0.6 between two parts
to change one pause), loudness is normalised. Writes "Voice-overs Chunks/<name> - Voice-over.mp3" and
"Transcript Chunks/<name> - Transcript.txt". Speed and tags are decided in Fish (Elliot 1.2x, VOICES.md rules)."""
import os, subprocess, sys, tempfile

name, text, args = sys.argv[1], sys.argv[2], sys.argv[3:]
video = os.environ.get("VIDEO_DIR") or os.getcwd()
tmp = tempfile.mkdtemp()
run = lambda *a: subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)
trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
parts, gap, k = [], 0.35, 0
for a in args:
    if a.startswith("gap="): gap = float(a[4:]); continue
    src = a
    if a.startswith("http"):
        src = os.path.join(tmp, f"dl{k}.mp3"); subprocess.run(["curl", "-s", "-f", "-o", src, a], check=True)
    w = os.path.join(tmp, f"p{k}.wav"); run("-i", src, "-af", trim, "-ar", "44100", "-ac", "1", w)
    if parts:
        g = os.path.join(tmp, f"g{k}.wav"); run("-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(gap), g); parts.append(g)
    parts.append(w); gap = 0.35; k += 1
end = os.path.join(tmp, "end.wav"); run("-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", "0.4", end); parts.append(end)
lst = os.path.join(tmp, "list.txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
os.makedirs(os.path.join(video, "Voice-overs Chunks"), exist_ok=True); os.makedirs(os.path.join(video, "Transcript Chunks"), exist_ok=True)
out = os.path.join(video, "Voice-overs Chunks", f"{name} - Voice-over.mp3")
run("-f", "concat", "-safe", "0", "-i", lst, "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", "-b:a", "192k", out)
open(os.path.join(video, "Transcript Chunks", f"{name} - Transcript.txt"), "w", encoding="utf-8").write(text.strip() + "\n")
print("voice-over:", out)
