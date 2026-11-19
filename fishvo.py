"""Turn a Fish Audio Voice Acting export into a clip voice-over:
    python3 fishvo.py "<Downloads>/2026-11-19_the-trust-number.zip" "Short 1"
The zip must contain mix/*.wav + manifest.csv (Export -> Scene mix). Each line is cut from the mix by its
mix_start_ms/mix_end_ms, the MAIN voice (Elliot) is sped to 1.2x (pitch kept, user rule) except call-to-action lines ("full story on my channel",
subscribe, comment...), which stay 1.0x like the other voices;
lines are joined with short pauses and loudness-normalised. Writes
    ../Voice-overs Chunks/<name> - Voice-over.mp3   and   ../Transcript Chunks/<name> - Transcript.txt
then run:  bash new-clip.sh S1   (or the clip number). Nothing is generated here: it only edits the exported audio."""
import csv, os, re, subprocess, sys, tempfile, zipfile

MAIN, SPEED, GAP = "Elliot", 1.2, 0.32
CTA = re.compile(r"channel|subscribe|full (story|video)|link (is )?(in|below)|comment", re.I)   # call-to-action lines stay at 1.0x (user rule)
zp, name = sys.argv[1], sys.argv[2]
here = os.path.dirname(os.path.abspath(__file__)); video = os.path.dirname(here)
tmp = tempfile.mkdtemp()
zipfile.ZipFile(zp).extractall(tmp)
mix = next(os.path.join(r, f) for r, _, fs in os.walk(tmp) for f in fs if f.endswith(".wav"))
man = next(os.path.join(r, f) for r, _, fs in os.walk(tmp) for f in fs if f == "manifest.csv")
rows = sorted(csv.DictReader(open(man, encoding="utf-8")), key=lambda r: int(r["order"]))
parts, text = [], []
for i, r in enumerate(rows):
    a, b = int(r["mix_start_ms"]) / 1000, int(r["mix_end_ms"]) / 1000
    af = f"atrim={a}:{b},asetpts=PTS-STARTPTS" + (f",atempo={SPEED}" if r["voice"] == MAIN and not CTA.search(r["text"]) else "")
    p = os.path.join(tmp, f"p{i}.wav"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", mix, "-af", af, "-ar", "44100", "-ac", "1", p], check=True); parts.append(p)
    g = os.path.join(tmp, f"g{i}.wav"); subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "lavfi", "-i", "anullsrc=r=44100:cl=mono", "-t", str(GAP if i < len(rows) - 1 else 0.5), g], check=True); parts.append(g)
    text.append(r["text"])
lst = os.path.join(tmp, "list.txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
out = os.path.join(video, "Voice-overs Chunks", f"{name} - Voice-over.mp3")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", lst, "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", "-b:a", "192k", out], check=True)
open(os.path.join(video, "Transcript Chunks", f"{name} - Transcript.txt"), "w", encoding="utf-8").write(" ".join(text) + "\n")
print("voice-over:", out)
