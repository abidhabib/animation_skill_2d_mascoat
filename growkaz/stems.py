"""stems.py: rebuild the SOUND-EFFECT / AMBIENCE / MUSIC stems of a video made of several clips, on ONE timeline (clips joined in order, no trimming).
Same levels as audio/mix.py (SFX trimmed -3.1 dB at spec time, relative to each clip's original voice), but WITHOUT the narrator and WITHOUT ducking,
so they can be laid under a different (e.g. noise-reduced) narration with mix_full.py.

  cd growkaz-stickman-studio
  python "../_Studio Kit/growkaz/stems.py" --prefix v03-clip --clips 1-26 --out "../V03 - Nvidia Next Cisco/audio-stems"

Writes in --out: sfx_stem.wav (hits only), amb_stem.wav (ambience beds), music_stem.wav, stems.json (per clip: start, dur, original voice rms in dB)."""
import argparse, json, os, re, sys
import numpy as np
sys.path.insert(0, "audio"); sys.path.insert(0, "tools")
from dsp import SR, secs, db, rms_db, place, write_wav, as_stereo
from common import load_audio
import sfx as SFX
import music as MUSIC

ap = argparse.ArgumentParser(); ap.add_argument("--prefix", default="v03-clip"); ap.add_argument("--clips", default="1-26"); ap.add_argument("--out", required=True)
a = ap.parse_args(); lo, hi = [int(x) for x in a.clips.split("-")]; os.makedirs(a.out, exist_ok=True)
segs = {"sfx": [], "amb": [], "music": []}; meta = []; t0 = 0.0
for n in range(lo, hi + 1):
    P = f"projects/{a.prefix}{n:02d}"
    cfg = json.load(open(f"{P}/config.json", encoding="utf-8")); story = json.load(open(f"{P}/story/shots.json", encoding="utf-8"))
    total = story.get("duration") or story["shots"][-1]["end"]; N = secs(total)
    voice = load_audio(os.path.join(P, cfg["voiceover"]), SR, mono=False); voice = np.concatenate([voice, np.zeros((max(0, N - len(voice)), 2), np.float32)])[:N]
    loud = np.abs(voice).mean(1) > db(-40); v_rms = rms_db(voice[loud]) if loud.any() else -20
    # music (unducked, at the project's music level relative to the voice)
    mcfg = cfg.get("music", {}) or {}; mus = np.zeros((N, 2), np.float32)
    if mcfg.get("enabled", True):
        path = os.path.join(P, "build", "music.wav")
        if os.path.exists(path): mus = load_audio(path, SR, mono=False)
        else: mus = MUSIC.render_score(story.get("music") or MUSIC.default_plan(total), total, mcfg.get("seed", 1), mcfg.get("key"))
        mus = as_stereo(mus)[:N]; mus = np.concatenate([mus, np.zeros((N - len(mus), 2), np.float32)]); mus *= db(v_rms + mcfg.get("gainDb", -17) - rms_db(mus))
    # sfx hits + ambience beds (relative to the voice, like mix.py)
    scfg = cfg.get("sfx", {}) or {}; bed = np.zeros((N, 2), np.float32); hits = np.zeros((N, 2), np.float32); cache = {}; cues = []
    for s in story["shots"]:
        for c in s.get("sfx", []) or []: cues.append({**c, "t": s["start"] + float(c.get("at", 0))})
        if s.get("amb"):
            am = s["amb"]; ln = s["end"] - s["start"]; key = (am["name"], am.get("seed", 1)); base = cache.get(key)
            if base is None: base = cache[key] = SFX.make(am["name"], dur=6.0, seed=am.get("seed", 1))
            loop = np.concatenate([base] * int(np.ceil(ln / (len(base) / SR) + 1)))[: secs(ln)]
            f = min(secs(0.4), len(loop) // 2); loop[:f] *= np.linspace(0, 1, f)[:, None]; loop[-f:] *= np.linspace(1, 0, f)[:, None]
            place(bed, loop, secs(s["start"]), db(am.get("gain", -20)))
    for c in story.get("sfx", []) or []: cues.append({**c, "t": float(c["t"])})
    for c in cues:
        nm = c["name"]; snd = load_audio(os.path.join(P, nm), SR, mono=False) if re.search(r"\.(wav|mp3|ogg|flac|m4a)$", nm, re.I) else SFX.make(nm, dur=c.get("dur"), seed=c.get("seed"), pitch=c.get("pitch"))
        place(hits, snd, secs(c["t"]), db(c.get("gain", -8)))
    g = db(scfg.get("gainDb", -6) + (v_rms + 18))
    if not scfg.get("enabled", True): hits[:] = 0; bed[:] = 0
    segs["sfx"].append(hits * g); segs["amb"].append(bed * g); segs["music"].append(mus)
    meta.append({"clip": n, "start": round(t0, 3), "dur": round(total, 3), "voice_rms_db": round(float(v_rms), 2), "cues": len(cues)}); t0 += total
    print(f"clip {n}: {total:.2f}s, voice {v_rms:.1f} dB, {len(cues)} sfx cues", flush=True)
for k, v in segs.items(): write_wav(os.path.join(a.out, f"{k}_stem.wav"), np.concatenate(v))
json.dump({"total": round(t0, 3), "clips": meta}, open(os.path.join(a.out, "stems.json"), "w"), indent=1)
print(f"done: {t0:.1f} s ({int(t0 // 60)}:{t0 % 60:04.1f}) -> {a.out}")
