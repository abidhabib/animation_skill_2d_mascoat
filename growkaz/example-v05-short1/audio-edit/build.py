import json, os, shutil, subprocess, sys
R = r"C:\Users\Abid .H\Documents\YouTube Content"; S = os.path.join(R, "growkaz-stickman-studio"); V = os.path.join(R, "V05 - Paid To Ignore Your Phone"); A = os.path.join(V, "Voice-overs Chunks")
os.chdir(S); P = "projects/v05-short1"
if not os.path.exists(P):
    subprocess.run([sys.executable, "tools/new_project.py", "--name", "v05-short1", "--voice", os.path.join(A, "Short 1 - Voice-over.mp3"), "--script", os.path.join(V, "Transcript Chunks", "Short 1 - Transcript.txt"), "--aspect", "9:16", "--resolution", "1080p", "--fps", "30", "--style", "cozy", "--title", "V05 Short 1"], check=True, capture_output=True)
sys.path.insert(0, "tools"); from common import sentences_from_words, write_timeline
words = json.load(open(os.path.join(A, "words.json"), encoding="utf-8")); lines = json.load(open(os.path.join(A, "lines.json"), encoding="utf-8"))
write_timeline(P + "/timeline", words, sentences_from_words(words), "dialogue edit (whisper, script spelling)")
c = json.load(open(P + "/config.json")); c.update(style="cozy", bars=None, captions=False, fadeIn=0.0, fadeOut=0.3); c["music"]["gainDb"] = -25; c["sfx"]["gainDb"] = -9; json.dump(c, open(P + "/config.json", "w"), indent=1)
os.makedirs(P + "/scenes/shots", exist_ok=True)
if os.path.exists("projects/v05-main.js"): shutil.move("projects/v05-main.js", P + "/scenes/shots/01_main.js")
open(P + "/scenes/shots/00_lines.js", "w", encoding="utf-8").write("export const LINES = " + json.dumps(lines) + ";\n")
open(P + "/scenes/cast.js", "w").write("export const CAST = [];\n")
L = {l["key"]: l for l in lines}; W = words
def word(w, key): l = L[key]; return next((x["start"] for x in W if x["start"] >= l["s"] - 0.05 and "".join(ch for ch in x["word"].lower() if ch.isalpha()).startswith(w)), l["s"] + 0.5)
# shot cuts: a breath before each line
order = [("s01", "N1"), ("s02", "Y1"), ("s03", "N2"), ("s04", "N3"), ("s05", "N4"), ("s06", "Y2"), ("s07", "N5"), ("s08", "D1"), ("s09", "N6"), ("s10", "D2"), ("s11", "Y3"), ("s12", "N7"), ("s13", "N8"), ("s14", "N9"), ("s15", "D3"), ("s16", "N10")]
dur = round(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(A, "Short 1 - Voice-over.mp3")], capture_output=True, text=True).stdout and float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", os.path.join(A, "Short 1 - Voice-over.mp3")], capture_output=True, text=True).stdout), 2)
starts = [0.0] + [round(L[k]["s"] - 0.15, 2) for _, k in order[1:]]; ends = starts[1:] + [dur]
rel = lambda sid, t: round(t - starts[[o[0] for o in order].index(sid)], 2)
def steps(a, b, gain, every=0.52):  # footfalls
    return [[round(a + i * every, 2), "footstep", gain] for i in range(int((b - a) / every) + 1)]
tdad = rel("s07", word("dad", "N5"))
sfx = {
 "s01": [[rel("s01", word("dollar", "N1")), "ding", -17], [rel("s01", word("dollar", "N1")) + 0.2, "shimmer", -24]],
 "s02": [[0.1, "swish", -24], [0.3, "pop", -22]],
 "s03": [[0.3, "tick", -22], [0.9, "tick", -22], [1.5, "tick", -22]],
 "s04": [[round(0.05 + i * 0.15, 2), "blip", -23] for i in range(8)] + [[1.3, "ding", -18]],
 "s05": [[rel("s05", word("buzz", "N4")), "phonebuzz", -16], [rel("s05", word("grab", "N4")), "swish", -18], [rel("s05", word("zero", "N4")), "glitch", -17], [rel("s05", word("zero", "N4")) + 0.05, "hit", -20]],
 "s06": [],
 "s07": [[rel("s07", word("drawer", "N5")) + 0.4, "hit", -19]] + steps(tdad + 0.05, tdad + 0.75, -24, 0.34),
 "s08": [[0.05, "swish", -26], [0.95, "pop", -24]],
 "s09": [[rel("s09", word("he", "N6")) + 0.4, "shimmer", -24]],
 "s10": [], "s11": [],
 "s12": [[rel("s12", word("drawer", "N7")) - 0.2, "swish", -20], [rel("s12", word("two", "N7")), "counter", -22], [rel("s12", word("two", "N7")) + 0.7, "ding", -17]],
 "s13": [[0.4, "tick", -24], [1.0, "tick", -24], [1.6, "tick", -24], [2.2, "tick", -24]],
 "s14": [[rel("s14", word("over", "N9")), "blip", -19], [rel("s14", word("drawer", "N9")) + 0.45, "hit", -18]],
 "s15": steps(0.05, 0.8, -23, 0.4),
 "s16": [[0.2, "shimmer", -24]],
}
amb = {"s01": ["hum", -36], "s02": ["roomtone", -36], "s03": ["roomtone", -32], "s04": ["roomtone", -32], "s05": ["roomtone", -34], "s06": ["roomtone", -38], "s07": ["roomtone", -34], "s08": ["rain", -39], "s09": ["rain", -42], "s10": ["roomtone", -36], "s11": ["roomtone", -40], "s12": ["wind", -38], "s13": ["roomtone", -34], "s14": ["roomtone", -34], "s15": ["rain", -42], "s16": ["wind", -34]}
trans = {"s07": "fade", "s08": "zoom", "s10": "fade", "s11": "fade", "s12": "fade", "s13": "fade", "s14": "fade", "s15": "zoom", "s16": "zoom", "s03": "whipR"}
st = dict(zip([o[0] for o in order], starts))
music = [[0, st["s03"], "playful", 0.3], [st["s03"], st["s06"], "tension", 0.2], [st["s06"], st["s07"], "dark", 0.12], [st["s07"], st["s10"], "playful", 0.22], [st["s10"], st["s12"], "sad", 0.14], [st["s12"], st["s15"], "wonder", 0.24], [st["s15"], dur, "triumph", 0.28]]
spec = {"title": "V05 Short 1", "dur": dur, "set": "mixed", "music": music,
        "shots": [[sid, starts[i], ends[i], L[k]["text"], k, trans.get(sid, "cut"), sfx[sid], amb[sid]] for i, (sid, k) in enumerate(order)]}
json.dump(spec, open(P + "/story/spec.json", "w", encoding="utf-8"), indent=1)
print(subprocess.run([sys.executable, os.path.join(R, "_Studio Kit", "growkaz", "mkshots.py"), P, P + "/story/spec.json"], capture_output=True, text=True).stdout.strip())
