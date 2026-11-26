# Dialogue edit: trim, modest narrator speed, equal loudness, meaning-sized gaps -> voice-over wav/mp3 + lines.json + words.json (script spelling).
import json, os, subprocess, sys
import numpy as np
from faster_whisper import WhisperModel
HERE = os.path.dirname(os.path.abspath(__file__)); os.chdir(HERE); os.makedirs("edited", exist_ok=True)
sys.path.insert(0, os.path.join(HERE, "..", "..", "growkaz-stickman-studio", "tools"))
from transcribe import align_script
SR = 44100
SPEED = {"narrator": 1.08, "you": 1.0, "dad": 1.0}
# pause AFTER each line (s)
GAP = dict(N1=0.35, Y1=0.3, N2=0.35, N3=0.45, N4=0.3, Y2=0.55, N5=0.3, D1=0.35, N6=0.5, D2=0.65, Y3=0.7, N7=0.4, N8=0.55, N9=0.35, D3=0.35, Y4=0.65, N10=0.7)
LEAD = 0.0   # first word at 0 s (SHORTS_PLAYBOOK.md)
TRIM = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
def pcm(path, af, sr=SR):
    return np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-af", af, "-f", "f32le", "-ac", "1", "-ar", str(sr), "-"], capture_output=True, check=True).stdout, np.float32)
log = json.load(open("voices.json", encoding="utf-8"))
model = WhisperModel("small.en", device="cpu", compute_type="int8")
rng = np.random.default_rng(3)
parts, lines, words, t = [np.zeros(int(LEAD * SR), np.float32)], [], [], LEAD
for l in log:
    k, who = l["key"], l["speaker"]; sp = SPEED[who]; l["speed_edit"] = sp
    af = TRIM + (f",atempo={sp}" if sp != 1 else "") + ",loudnorm=I=-16:TP=-2:LRA=11,afade=t=in:d=0.012,areverse,afade=t=in:d=0.05,areverse"
    out = f"edited/{k}.wav"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", f"raw/{k}.mp3", "-af", af, "-ac", "1", "-ar", str(SR), out], check=True)
    a = pcm(out, "anull"); dur = len(a) / SR
    segs, _ = model.transcribe(pcm(out, "anull", 16000), language="en", word_timestamps=True)
    ww = [{"word": w.word.strip(), "start": w.start, "end": w.end} for s in segs for w in s.words]
    for w in align_script(l["text"], ww):
        words.append({"word": w["word"], "start": round(t + max(0, w["start"]), 3), "end": round(t + min(dur, w["end"]), 3)})
    lines.append({"key": k, "who": who, "s": round(t, 3), "e": round(t + dur, 3), "text": l["text"]})
    gap = np.zeros(int(GAP[k] * SR), np.float32)
    parts += [a, gap]; t += (len(a) + len(gap)) / SR
voice = np.concatenate(parts); voice = voice + rng.normal(0, 0.00018, len(voice)).astype(np.float32)   # faint room tone, no dead silence
voice = np.clip(voice, -0.98, 0.98)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ac", "1", "-ar", str(SR), "-i", "-", "-b:a", "192k", "Short 1 - Voice-over.mp3"], input=voice.tobytes(), check=True)
json.dump(lines, open("lines.json", "w", encoding="utf-8"), indent=1); json.dump(words, open("words.json", "w", encoding="utf-8"), indent=1)
json.dump(log, open("voices.json", "w", encoding="utf-8"), indent=1)
os.makedirs("../Transcript Chunks", exist_ok=True); open("../Transcript Chunks/Short 1 - Transcript.txt", "w", encoding="utf-8").write(" ".join(l["text"] for l in log))
print("total", round(len(voice) / SR, 2)); print(" ".join(f'{l["key"]}:{l["s"]}-{l["e"]}' for l in lines))
