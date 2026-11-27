# short_build.py: create/refresh the 9:16 studio project for V06 Short 1 and write its shot list, sound cues and music
import json, os, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__)); V = os.path.dirname(here); R = os.path.dirname(V); S = os.path.join(R, "growkaz-stickman-studio")
os.chdir(S); P = "projects/v06-short1"; vo = os.path.join(here, "Short 1 - Voice-over.mp3")
if not os.path.exists(P):
    subprocess.run([sys.executable, "tools/new_project.py", "--name", "v06-short1", "--voice", vo, "--script", os.path.join(V, "Transcript Chunks", "Short 1 - Transcript.txt"), "--aspect", "9:16", "--resolution", "1080p", "--fps", "30", "--style", "cozy", "--title", "V06 Short 1"], check=True, capture_output=True)
sys.path.insert(0, "tools"); from common import sentences_from_words, write_timeline
words = [{"word": x["w"], "start": round(x["s"], 3), "end": round(x["e"], 3)} for x in json.load(open(os.path.join(V, "clips", "clip-90", "assets", "vo.words.json"), encoding="utf-8"))]
words[0]["start"] = 0.05
write_timeline(P + "/timeline", words, sentences_from_words(words), "parakeet (studio kit)")
c = json.load(open(P + "/config.json")); c.update(style="cozy", bars=None, captions=False, fadeIn=0.0, fadeOut=0.15); c["music"]["gainDb"] = -24; c["sfx"]["gainDb"] = -9; json.dump(c, open(P + "/config.json", "w"), indent=1)
os.makedirs(P + "/scenes/shots", exist_ok=True); open(P + "/scenes/cast.js", "w").write("export const CAST = [];\n")
dur = c["duration"]
# id, start, transition, [sfx at (seconds in the whole short), name, gain], room tone
SH = [
 ("a", 0.0, "cut", [(0.06, "hit", -15), (0.1, "swish", -22)]),
 ("b", 3.05, "cut", [(3.1, "pop", -20), (4.9, "tick", -22)]),
 ("c", 7.35, "whipR", [(7.45, "swish", -22), (8.96, "ding", -17)]),
 ("d", 9.55, "cut", [(9.65, "pop", -22), (11.12, "ding", -17)]),
 ("e", 11.7, "zoom", [(11.8, "shimmer", -22), (14.8, "ding", -18)]),
 ("f", 16.0, "fade", [(17.4, "hit", -17)]),
 ("g", 19.85, "cut", [(20.0, "swish", -22)]),
 ("h", 22.65, "cut", [(22.95, "shimmer", -22)]),
 ("i", 24.4, "whipR", [(24.8, "swish", -20), (25.65, "hit", -20)]),
 ("j", 26.15, "cut", [(26.5, "swish", -22)]),
 ("k", 29.25, "cut", [(29.95, "swish", -20), (30.55, "hit", -18)]),
 ("l", 31.45, "fade", [(33.4, "hit", -15), (34.4, "pop", -20)]),
 ("m", 36.0, "zoom", [(36.1, "swish", -22), (37.1, "pop", -20)]),
 ("n", 37.55, "cut", [(38.4, "swish", -22), (39.45, "ding", -19)]),
 ("o", 41.1, "zoom", [(41.2, "shimmer", -21), (42.55, "pop", -18)]),
 ("p", 43.6, "cut", [(43.7, "pop", -19), (44.4, "tick", -20), (45.0, "tick", -20), (45.6, "tick", -19), (46.56, "hit", -14)]),
]
ends = [s[1] for s in SH[1:]] + [dur]
shots = [[i, a, e, i, "mixed", tr, [[round(x - a, 2), n, g] for x, n, g in fx], ["roomtone", -35]] for (i, a, tr, fx), e in zip(SH, ends)]
music = [[0, 11.7, "playful", 0.28], [11.7, 16.0, "triumph", 0.22], [16.0, 31.45, "tension", 0.22], [31.45, 41.1, "wonder", 0.2], [41.1, dur, "triumph", 0.26]]
json.dump({"title": "V06 Short 1", "dur": dur, "set": "mixed", "music": music, "shots": shots}, open(P + "/story/spec.json", "w"), indent=1)
print(subprocess.run([sys.executable, os.path.join(R, "_Studio Kit", "growkaz", "mkshots.py"), P, P + "/story/spec.json"], capture_output=True, text=True).stdout.strip(), "| duration", dur)
