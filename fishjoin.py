"""Join Fish Text-to-Speech parts into one clip voice-over, with an automatic RHYTHM CHECK (run inside the video folder):
    python3 "../_Studio Kit/fishjoin.py" "Clip 02" "<text of the whole clip>" PART [gap=0.5] PART ...
PART = one take or two takes plus the part's text:   "urlA|urlB::Your alarm goes off... Seven a.m."
       (urls = Fish history audio https://platform.r2.fish.audio/tasks/<date>/<id>.mp3, fetched with curl; files also work)
Rhythm check per part (user rule: tags/rushing must not break Elliot's rhythm):
  1. of two takes, keep the one whose speaking rate is closest to the target (steadier, less rushed)
  2. if a part still runs faster than MAX words/s (speech only), slow it down a little (atempo, pitch kept, never below 0.86)
  3. every pause inside a part is made at least MINGAP long; parts are joined with 0.3 s pauses (gap=0.25 changes one;
     use about 0.25 when the speaker changes so a reply comes like a real conversation)
  4. smooth hand-offs: every part/speaker is levelled to the same loudness, gets soft 15/60 ms fades, and all pauses are
     filled with quiet room tone instead of dead silence (no jerk/stop when the voice changes)
Writes "Voice-overs Chunks/<name> - Voice-over.mp3" + "Transcript Chunks/<name> - Transcript.txt" and prints the rate of each part."""
import os, re, subprocess, sys, tempfile

TARGET, MAX, MINGAP = 3.3, 3.6, 0.24          # words per second of speech (Elliot at 1.2x), shortest pause in seconds
name, text, args = sys.argv[1], sys.argv[2], sys.argv[3:]
video = os.environ.get("VIDEO_DIR") or os.getcwd()
tmp = tempfile.mkdtemp(); n = [0]
def run(*a): subprocess.run(["ffmpeg", "-v", "error", "-y", *a], check=True)
def new(ext="wav"): n[0] += 1; return os.path.join(tmp, f"f{n[0]}.{ext}")
def dur(f): return float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f], capture_output=True, text=True).stdout)
def silences(f):
    err = subprocess.run(["ffmpeg", "-i", f, "-af", "silencedetect=noise=-38dB:d=0.06", "-f", "null", "-"], capture_output=True, text=True).stderr
    st = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", err)]; en = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", err)]
    return list(zip(st, en))
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
def fetch(src):
    if src.startswith("http"):
        f = new("mp3"); subprocess.run(["curl", "-s", "-f", "-o", f, src], check=True); src = f
    w = new(); run("-i", src, "-af", TRIM, "-ar", "44100", "-ac", "1", w); return w
def rate(w, words):
    d = dur(w); inner = sum(e - s for s, e in silences(w) if s > 0.05 and e < d - 0.05)
    return words / max(0.3, d - inner) if words else None
def tone(sec):
    """room tone: a very quiet natural hiss instead of dead digital silence (no 'audio stopped' feeling)"""
    g = new(); run("-f", "lavfi", "-i", "anoisesrc=color=pink:amplitude=0.0018:sample_rate=44100", "-t", f"{sec:.3f}", "-ac", "1", g); return g
def smooth(w):
    """same loudness for every part/speaker + soft edges (no clicks, no volume jump between voices)"""
    d = dur(w); s = new(); run("-i", w, "-af", f"loudnorm=I=-18:TP=-2,afade=t=in:d=0.015,afade=t=out:st={max(0, d - 0.06):.3f}:d=0.06", "-ar", "44100", "-ac", "1", s); return s
def even_pauses(w):
    d = dur(w); cuts = [(s, e) for s, e in silences(w) if s > 0.05 and e < d - 0.05 and e - s < MINGAP]
    if not cuts: return w
    segs, pos = [], 0.0
    for s, e in cuts:
        mid = (s + e) / 2; a = new(); run("-i", w, "-af", f"atrim={pos}:{mid},asetpts=PTS-STARTPTS", a); segs.append(a)
        segs.append(tone(MINGAP - (e - s))); pos = mid
    a = new(); run("-i", w, "-af", f"atrim={pos},asetpts=PTS-STARTPTS", a); segs.append(a)
    lst = new("txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in segs)); out = new(); run("-f", "concat", "-safe", "0", "-i", lst, out); return out

parts, gap = [], 0.3
for a in args:
    if a.startswith("gap="): gap = float(a[4:]); continue
    srcs, _, ptxt = a.partition("::"); words = len(ptxt.split()) if ptxt else 0
    takes = [fetch(s) for s in srcs.split("|")]
    if words:
        scored = sorted(takes, key=lambda w: abs(rate(w, words) - TARGET)); w = scored[0]; r = rate(w, words)
        if r > MAX:
            k = max(0.86, TARGET / r); s2 = new(); run("-i", w, "-af", f"atempo={k:.3f}", s2); w = s2
            print(f"  part {len(parts) // 2 + 1}: {r:.2f} w/s -> slowed x{k:.2f}")
        else: print(f"  part {len(parts) // 2 + 1}: {r:.2f} w/s ok")
    else: w = max(takes, key=dur)
    w = smooth(even_pauses(w))
    if parts: parts.append(tone(gap))
    parts.append(w); gap = 0.3
parts.insert(0, tone(0.08)); parts.append(tone(0.4))
lst = new("txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
os.makedirs(os.path.join(video, "Voice-overs Chunks"), exist_ok=True); os.makedirs(os.path.join(video, "Transcript Chunks"), exist_ok=True)
out = os.path.join(video, "Voice-overs Chunks", f"{name} - Voice-over.mp3")
run("-f", "concat", "-safe", "0", "-i", lst, "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", "-b:a", "192k", out)
open(os.path.join(video, "Transcript Chunks", f"{name} - Transcript.txt"), "w", encoding="utf-8").write(text.strip() + "\n")
print("voice-over:", out, f"({dur(out):.1f} s)")
