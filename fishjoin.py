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

TARGET, MAX, MINGAP = 3.3, 3.6, 0.24
COMMA_MAX = 0.12          # words per second of speech (Elliot at 1.2x), shortest pause in seconds
if os.environ.get("NOSLOW"): MAX = 99.0     # NOSLOW=1: never slow a part (voices generated at 1.0x keep Fish's own speed)
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
WKIT = os.path.join(os.path.expanduser("~"), "claude-skill-repos", "claude-animation-skills", "kit")
def word_times(w, ptxt):
    """Parakeet word timings of one part (same tool as new-clip.sh); [] if it is not available"""
    try:
        d = tempfile.mkdtemp(); a = os.path.join(d, "part.mp3"); run("-i", w, "-b:a", "192k", a)
        open(os.path.join(d, "script.txt"), "w", encoding="utf-8").write(ptxt)
        subprocess.run(["bash", "-c", f'cd "{d}" && "{WKIT}/.venv/bin/python" "{WKIT}/words.py" part.mp3 script.txt'], capture_output=True, check=True)
        import json; return json.load(open(os.path.join(d, "part.words.json"), encoding="utf-8"))
    except Exception: return []
PUNCT = re.compile(r"(\.|\?|!|…)['\"]?$")  # sentence ends only: never stretch a comma pause (it sounds like the voice stops and restarts mid-sentence; user review V02 clip 2, 2026-11-20)
def even_pauses(w, ptxt=""):
    """Stretch a too-short pause to MINGAP ONLY after punctuation (. , ? ! ... :). Never between words inside a phrase
    (stretching tiny breaths like 'is ... burning' made gaps/flicker mid-sentence; user review V02 clip 2)."""
    if not ptxt: return w
    W = word_times(w, ptxt); d = dur(w); sil = silences(w); cuts = []
    for a, b in zip(W, W[1:]):
        if not PUNCT.search(a["w"]): continue
        s = next(((s0, e0) for s0, e0 in sil if s0 < b["s"] + 0.05 and s0 >= a["s"] + 0.1 and s0 > 0.05 and e0 < d - 0.05), None)
        s0, e0 = s if s else (a["e"], a["e"])
        if e0 - s0 < MINGAP: cuts.append((s0, e0))
    # COMMA pauses inside a sentence: never stretch, and shorten a long one to COMMA_MAX (a 0.25 s hole after "game," made the
    # voice sound like it stopped and restarted; user review V02 clip 2, 2026-11-20). Cut from the middle of the silence.
    trims = []
    for a, b in zip(W, W[1:]):
        if not a["w"].rstrip("'\"").endswith((",", ":", ";")): continue
        s = next(((s0, e0) for s0, e0 in sil if s0 < b["s"] + 0.05 and s0 >= a["s"] + 0.1 and s0 > 0.05 and e0 < d - 0.05), None)
        if s and s[1] - s[0] > COMMA_MAX + 0.03: trims.append(s)
    cuts = []  # 2026-11-20: NEVER insert pauses (room tone) inside a take: the natural Fish rhythm sounds right, inserted gaps after short sentences like 'sixty-two. Sixty-two what?' sounded like a stop/start
    if trims and not cuts:
        segs, pos = [], 0.0
        for s0, e0 in trims:
            keep = COMMA_MAX / 2; a = new(); run("-i", w, "-af", f"atrim={pos}:{s0 + keep},asetpts=PTS-STARTPTS,afade=t=out:st={max(0, s0 + keep - pos - 0.03):.3f}:d=0.03", a); segs.append(a); pos = e0 - keep
        a = new(); run("-i", w, "-af", f"atrim={pos},asetpts=PTS-STARTPTS,afade=t=in:d=0.03", a); segs.append(a)
        lst = new("txt"); open(lst, "w").write("".join("file '" + q + "'" + chr(10) for q in segs)); out = new(); run("-f", "concat", "-safe", "0", "-i", lst, out); return out
    if not cuts: return w
    segs, pos = [], 0.0
    for s, e in cuts:
        mid = (s + e) / 2; a = new(); run("-i", w, "-af", f"atrim={pos}:{mid},asetpts=PTS-STARTPTS", a); segs.append(a)
        segs.append(tone(MINGAP - (e - s))); pos = mid
    a = new(); run("-i", w, "-af", f"atrim={pos},asetpts=PTS-STARTPTS", a); segs.append(a)
    lst = new("txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in segs)); out = new(); run("-f", "concat", "-safe", "0", "-i", lst, out); return out

# NATURAL JOIN (default since 2026-11-26, user: "joining should not ruin the pace, flow and naturality"):
# takes are never cut inside, never time-stretched, never compressed. Only silent edges are trimmed gently, one constant
# volume change per take evens the loudness, and takes are placed with a short breath between them. TIGHT=1 = old behaviour.
def natural(src):
    if src.startswith("http"):
        f = new("mp3"); subprocess.run(["curl", "-s", "-f", "-o", f, src], check=True); src = f
    edge = "silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.05"
    w = new(); run("-i", src, "-af", f"{edge},areverse,{edge},areverse", "-ar", "44100", "-ac", "1", w)
    err = subprocess.run(["ffmpeg", "-i", w, "-af", "volumedetect", "-f", "null", "-"], capture_output=True, text=True).stderr
    mean, peak = float(re.search(r"mean_volume: (-?[\d.]+)", err)[1]), float(re.search(r"max_volume: (-?[\d.]+)", err)[1])
    gain = min(-19.0 - mean, -1.0 - peak); d = dur(w); s = new()
    run("-i", w, "-af", f"volume={gain:.2f}dB,afade=t=in:d=0.008,afade=t=out:st={max(0, d - 0.03):.3f}:d=0.03", "-ar", "44100", "-ac", "1", s); return s
if not os.environ.get("TIGHT"):
    seq, g = [tone(0.1)], None
    for a in args:
        if a.startswith("gap="): g = float(a[4:]); continue
        srcs = a.partition("::")[0].split("|"); w = natural(srcs[0])
        if len(seq) > 1: seq.append(tone(g if g is not None else 0.35))
        seq.append(w); g = None
    seq.append(tone(0.4))
    lst = new("txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in seq))
    os.makedirs(os.path.join(video, "Voice-overs Chunks"), exist_ok=True); os.makedirs(os.path.join(video, "Transcript Chunks"), exist_ok=True)
    out = os.path.join(video, "Voice-overs Chunks", f"{name} - Voice-over.mp3")
    run("-f", "concat", "-safe", "0", "-i", lst, "-ar", "44100", "-b:a", "192k", out)
    open(os.path.join(video, "Transcript Chunks", f"{name} - Transcript.txt"), "w", encoding="utf-8").write(text.strip() + "\n")
    print("voice-over (natural):", out, f"({dur(out):.1f} s)"); sys.exit(0)

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
    w = smooth(even_pauses(w, ptxt))
    if parts: parts.append(tone(gap))
    parts.append(w); gap = 0.3
parts.insert(0, tone(0.08)); parts.append(tone(0.4))
lst = new("txt"); open(lst, "w").write("".join(f"file '{p}'\n" for p in parts))
os.makedirs(os.path.join(video, "Voice-overs Chunks"), exist_ok=True); os.makedirs(os.path.join(video, "Transcript Chunks"), exist_ok=True)
out = os.path.join(video, "Voice-overs Chunks", f"{name} - Voice-over.mp3")
run("-f", "concat", "-safe", "0", "-i", lst, "-af", "loudnorm=I=-16:TP=-1.5", "-ar", "44100", "-b:a", "192k", out)
open(os.path.join(video, "Transcript Chunks", f"{name} - Transcript.txt"), "w", encoding="utf-8").write(text.strip() + "\n")
print("voice-over:", out, f"({dur(out):.1f} s)")
