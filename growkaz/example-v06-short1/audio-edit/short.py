# short.py: download the Short 1 takes (older take per part), join naturally, transcribe to verify
import json, os, subprocess, sys, urllib.request
from email.utils import parsedate_to_datetime
here = os.path.dirname(os.path.abspath(__file__)); os.chdir(here)
PARTS = [
 ("S1_A", ["77255e8dcb8f41d29eeff1f78d33ed79", "3f43353a7af0451491ad89a4fa034f8e"], 0.0,
  "Your bedroom wall just gave you a job. One yellow note. Fix one thing, every day. Wash the sheets. Clink. Clear the chair. Clink. Twelve days later, your life looks amazing."),
 ("S1_B", ["1edcb99a034743ec84e0544aa80e18e5", "2198e195c6f34df6a2de15d2fbf4de01"], 0.35,
  "Then, on day thirteen, you write six words. And you'd do anything to avoid them. You buy new pens. You turn your bed around. You ride a bus to the very last stop, just to bin that note. You get home. It's back. With a banana skin."),
 ("S1_C", ["65bab7cfbf714512b9b55459b6ba287a", "61f441ceec62423697db0829713efd64"], 0.45,
  "So what did you write? And what is your dad hiding under the coins in his cash drawer? The full story is on Thinkle Show. Tap the link and watch it, before your next note arrives."),
]
args, text = [], []
for i, (key, ids, gap, line) in enumerate(PARTS):
    takes = []
    for tid in ids:
        f = f"raw/{key}_{tid[:8]}.mp3"
        for attempt in range(5):
            try:
                with urllib.request.urlopen(urllib.request.Request(f"https://platform.r2.fish.audio/tasks/2026-11-27/{tid}.mp3", headers={"User-Agent": "studio-kit"}), timeout=60) as r:
                    open(f, "wb").write(r.read()); mod = parsedate_to_datetime(r.headers["Last-Modified"]).timestamp()
                break
            except OSError:
                if attempt == 4: raise
        d = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
        takes.append((mod, d, os.path.abspath(f)))
    takes.sort(); pick = takes[0]
    if pick[1] < 0.75 * takes[1][1]: pick = takes[1]
    print(key, [round(t[1], 2) for t in takes], "->", os.path.basename(pick[2]))
    if i: args.append(f"gap={gap}")
    args.append(f"{pick[2]}::{line}"); text.append(line)
kit = os.path.join(here, "..", "..", "_Studio Kit", "fishjoin.py")
subprocess.run([sys.executable, kit, "Short 1", " ".join(text), *args], check=True, env={**os.environ, "NOSLOW": "1", "VIDEO_DIR": os.path.dirname(here), "PYTHONUTF8": "1"})
import numpy as np
from faster_whisper import WhisperModel
a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", "Short 1 - Voice-over.mp3", "-f", "f32le", "-ac", "1", "-ar", "16000", "-"], capture_output=True).stdout, np.float32)
print("seconds", round(len(a) / 16000, 2))
for s in WhisperModel("small.en", device="cpu", compute_type="int8").transcribe(a, language="en")[0]: print(round(s.start, 2), s.text)
