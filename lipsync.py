"""Loudness envelope for audio lip sync:   python3 lipsync.py clip-NN
Reads clip-NN/assets/vo.mp3, writes clip-NN/assets/vo.env.json = {"fps": 30, "v": [0..1 per frame]}.
scene.py slices it into every say[] window, scenes.js then opens the mouth closed / open / wide from the real voice.
new-clip.sh runs this automatically. Nothing is generated: it only measures the user's own recording."""
import array, json, math, os, subprocess, sys

d = sys.argv[1]
src = os.path.join(d, "assets", "vo.mp3")
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-ac", "1", "-ar", "16000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
a = array.array("h"); a.frombytes(raw[: len(raw) // 2 * 2])
fps, hop = 30, 16000 // 30
rms = []
for i in range(0, len(a), hop):
    seg = a[i:i + hop]
    rms.append(math.sqrt(sum(x * x for x in seg) / max(1, len(seg))))
ref = sorted(rms)[int(len(rms) * 0.95)] if rms else 1
ref = ref or 1
v = [min(1.0, r / ref) for r in rms]
v = [round((v[max(0, i - 1)] + 2 * v[i] + v[min(len(v) - 1, i + 1)]) / 4, 2) for i in range(len(v))]
json.dump({"fps": fps, "v": v}, open(os.path.join(d, "assets", "vo.env.json"), "w"))
print("lip sync envelope:", len(v), "frames")
