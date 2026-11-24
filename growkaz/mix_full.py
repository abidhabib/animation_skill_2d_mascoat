"""mix_full.py: lay the SFX / ambience (/ music) stems from stems.py under ONE narration file (e.g. noise-reduced in Adobe) of the whole video.

  cd growkaz-stickman-studio
  python "../_Studio Kit/growkaz/mix_full.py" --voice "C:/path/narration.wav" --stems "../V03 - Nvidia Next Cisco/audio-stems" --out "../V03 - Nvidia Next Cisco/audio-stems/V03 - full audio.wav" [--no-music] [--no-amb] [--offset 0.0] [--lufs -14]

Per clip, the stems are rescaled so they keep the SAME level relation to the narrator as in the original clip mix (the narration may be louder/quieter after noise reduction).
Music is ducked -9 dB and ambience -5 dB while the narrator speaks (like audio/mix.py); sound effects are not ducked. Master: gentle high-pass, soft clip, loudnorm."""
import argparse, json, os, subprocess, sys
import numpy as np
sys.path.insert(0, "audio"); sys.path.insert(0, "tools")
from dsp import SR, secs, db, rms_db, write_wav, as_stereo, lp
from common import load_audio

def envelope(x, att=0.03, rel=0.45):
    mono = np.abs(x).mean(axis=1); hop = secs(0.01); frames = np.sqrt(np.add.reduceat(mono ** 2, np.arange(0, len(mono), hop)) / hop)
    lv = np.clip((20 * np.log10(frames + 1e-9) + 50) / 30, 0, 1); out = np.zeros_like(lv); a, r = np.exp(-0.01 / att), np.exp(-0.01 / rel); v = 0.0
    for i, s in enumerate(lv): v = a * v + (1 - a) * s if s > v else r * v + (1 - r) * s; out[i] = v
    return np.repeat(out, hop)[: len(mono)]

ap = argparse.ArgumentParser(); ap.add_argument("--voice", required=True); ap.add_argument("--stems", required=True); ap.add_argument("--out", required=True)
ap.add_argument("--no-music", action="store_true"); ap.add_argument("--no-amb", action="store_true"); ap.add_argument("--offset", type=float, default=0.0); ap.add_argument("--lufs", type=float, default=-14); ap.add_argument("--raw", action="store_true", help="keep the narration level: no high-pass, no loudness normalise (only a safety limiter)"); ap.add_argument("--rate", type=int, default=SR)
a = ap.parse_args(); meta = json.load(open(os.path.join(a.stems, "stems.json"))); total = meta["total"]
voice = load_audio(a.voice, SR, mono=False); voice = as_stereo(voice)
if a.offset: voice = np.concatenate([np.zeros((secs(a.offset), 2), np.float32), voice]) if a.offset > 0 else voice[secs(-a.offset):]
vlen = len(voice) / SR; print(f"narration {vlen:.1f} s, stems timeline {total:.1f} s (difference {vlen - total:+.1f} s)")
if abs(vlen - total) > 1.0: print("WARNING: lengths differ by more than 1 s, so effects may drift; check that the clips are in order, untrimmed, and use --offset if the file starts late")
N = max(len(voice), secs(total)); voice = np.concatenate([voice, np.zeros((N - len(voice), 2), np.float32)])
def stem(name): x = load_audio(os.path.join(a.stems, f"{name}_stem.wav"), SR, mono=False); x = as_stereo(x); return np.concatenate([x, np.zeros((max(0, N - len(x)), 2), np.float32)])[:N]
sfx, amb, mus = stem("sfx"), stem("amb"), stem("music")
for c in meta["clips"]:   # keep each clip's effect/music level relative to its narration
    s0, s1 = secs(c["start"]), min(N, secs(c["start"] + c["dur"])); seg = voice[s0:s1]; loud = np.abs(seg).mean(1) > db(-40)
    if not loud.any(): continue
    k = db(rms_db(seg[loud]) - c["voice_rms_db"]); sfx[s0:s1] *= k; amb[s0:s1] *= k; mus[s0:s1] *= k
env = envelope(voice); mix = voice + sfx
if not a.no_amb: mix = mix + amb * db(-5 * env)[:, None]
if not a.no_music: mix = mix + mus * db(-9 * env)[:, None]
if not a.raw: mix = mix - lp(mix, 25)
peak = np.abs(mix).max()
if peak > 0.95: mix = np.tanh(mix / peak * 1.2) / np.tanh(1.2) * 0.95
raw = a.out + ".raw.wav"; write_wav(raw, mix)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw] + ([] if a.raw else ["-af", f"loudnorm=I={a.lufs}:TP=-1.5:LRA=11"]) + ["-ar", str(a.rate), "-c:a", "pcm_s16le", a.out], check=True); os.remove(raw)
print(f"wrote {a.out} ({N / SR:.1f} s)")
