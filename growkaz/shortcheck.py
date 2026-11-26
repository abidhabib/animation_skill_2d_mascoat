# shortcheck.py <studio project dir> [final.mp4] : pre-export checks for a Short (SHORTS_PLAYBOOK.md section 4)
import glob, json, os, subprocess, sys
P = sys.argv[1]
story = json.load(open(os.path.join(P, "story", "shots.json"), encoding="utf-8"))
words = json.load(open(os.path.join(P, "timeline", "words.json"), encoding="utf-8"))
words = words.get("words", words) if isinstance(words, dict) else words
dur = story.get("duration") or story["shots"][-1]["end"]
res = []
def check(name, ok, info): res.append(ok); print(("PASS " if ok else "FIX  ") + name + ": " + info)
check("length 38-55 s", 38 <= dur <= 55, f"{dur:.1f} s")
check("first word at 0 s", words[0]["start"] <= 0.1, f"first word at {words[0]['start']:.2f} s")
beats = [s["start"] for s in story["shots"]] + [dur]
gaps = [(b - a, a) for a, b in zip(beats, beats[1:])]; g, at = max(gaps)
check("new picture at least every 7 s", g <= 7, f"longest shot {g:.1f} s (from {at:.1f} s)")
code = "".join(open(f, encoding="utf-8").read() for f in glob.glob(os.path.join(P, "scenes", "shots", "*.js")))
check("hook title on frame 1", "hook(" in code, "hook() used" if "hook(" in code else "no hook() call in the shots")
mp4 = sys.argv[2] if len(sys.argv) > 2 else max(glob.glob(os.path.join(P, "out", "*.mp4")), key=os.path.getmtime, default=None)
if mp4:
    def frame(t): return subprocess.run(["ffmpeg", "-v", "error", "-ss", str(t), "-i", mp4, "-frames:v", "1", "-vf", "scale=90:160,format=gray", "-f", "rawvideo", "-"], capture_output=True, check=True).stdout
    a, b = frame(0.55), frame(0.9)      # after the fade-in
    diff = sum(abs(x - y) for x, y in zip(a, b)) / max(1, len(a))
    check("opening is moving", diff > 1.0, f"average pixel change {diff:.1f} between 0.55 s and 0.9 s")
    cfg = json.load(open(os.path.join(P, "config.json"), encoding="utf-8"))
    check("no fade-in from black", cfg.get("fadeIn", 0) <= 0.02, f"fadeIn {cfg.get('fadeIn', 0)} s")
print(f"{sum(res)}/{len(res)} passed"); sys.exit(0 if all(res) else 1)
