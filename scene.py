"""Generate library scenes for clip N from a JSON list and mount them.
usage: python3 scene.py N clipN.json
JSON: [{"name":"s1-hook","start":0,"dur":4.2,"type":"docStamp","bg":"teal","in":{"kind":"whip"}, ...opts}, ...]
  - every opts time is scene-local (word time - start). "dur" is passed through to S.mount.
  - "html": a full scene file body instead of a library type (custom scene); "js": extra JS run as opts.custom(tl,ctx,C,T).
  - "copy": true → only re-sync assets/scenes.js from _kit."""
import json, os, shutil, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
# shared studio: inside a video folder (has "Voice-overs Chunks" or "clips", or VIDEO_DIR is set) clips live in <video>/clips
def _video_dir():
    v = os.environ.get("VIDEO_DIR")
    if v: return os.path.abspath(v)
    c = os.getcwd()
    return c if os.path.isdir(os.path.join(c, "Voice-overs Chunks")) or os.path.isdir(os.path.join(c, "clips")) else None
VD = _video_dir()
CLIPS = os.path.join(VD, "clips") if VD else here
n = int(sys.argv[1]); clip = os.path.join(CLIPS, f"clip-{n:02d}")
for _f in ("scenes.js", "toon.js"):  # keep the clip's kit copy current (characters live in toon.js)
    shutil.copy(os.path.join(here, "_kit", _f), os.path.join(clip, "assets", _f))
specs = json.load(open(sys.argv[2], encoding="utf-8"))
# portrait (YouTube Short, 9:16): clip meta.json has "portrait": true -> 1080x1920 output showing a 607.5x1080 slice of the 1920x1080 scene,
# centred on x=960 (move it with the scene's cam fx). Keep the action and text inside x 690..1230.
_meta = json.load(open(os.path.join(clip, "meta.json"), encoding="utf-8")) if os.path.exists(os.path.join(clip, "meta.json")) else {}
PORTRAIT = bool(_meta.get("portrait"))
OW, OH, VB = (1080, 1920, "656.25 0 607.5 1080") if PORTRAIT else (1920, 1080, "0 0 1920 1080")

# --- timing from the voice-over: "start":"phrase", "end":"phrase" (sets dur), say[].at / from / to as phrases ---
import re
_wf = os.path.join(clip, "assets", "vo.words.json")
WORDS = json.load(open(_wf, encoding="utf-8")) if os.path.exists(_wf) else []
_norm = lambda w: re.sub(r"[^a-z0-9']+", "", w.lower())
NW = [_norm(w["w"]) for w in WORDS]
def find(phrase, after=0.0):
    toks = [_norm(x) for x in phrase.split() if _norm(x)]
    for i in range(len(NW) - len(toks) + 1):
        if NW[i:i + len(toks)] == toks and WORDS[i]["s"] >= after - 0.01:
            return WORDS[i]["s"], WORDS[i + len(toks) - 1]["e"]
    raise SystemExit('phrase not found in voice-over words: "%s"' % phrase)
_prev = 0.0
for s_ in specs:
    if isinstance(s_.get("start"), str):
        s_["start"] = round(max(0.0, find(s_["start"], _prev)[0] - s_.pop("lead", 0.15)), 2)
    if "end" in s_:
        s_["dur"] = round(find(s_.pop("end"), s_["start"])[1] - s_["start"] + s_.pop("tail", 0.35), 2)
    _prev = s_["start"]
    for sy in s_.get("say", []):
        if "at" in sy:
            a_, b_ = find(sy.pop("at"), s_["start"]); sy["from"] = round(a_ - s_["start"], 2); sy["to"] = round(b_ - s_["start"], 2)
        for k_ in ("from", "to"):
            if isinstance(sy.get(k_), str):
                a_, b_ = find(sy[k_], s_["start"]); sy[k_] = round((a_ if k_ == "from" else b_) - s_["start"], 2)
# --- portrait flag + lip sync envelope (assets/vo.env.json from lipsync.py) -> say[].env at 15 fps ---
_ef = os.path.join(clip, "assets", "vo.env.json")
ENV = json.load(open(_ef, encoding="utf-8")) if os.path.exists(_ef) else None
def _warn(m): print("SAFE-ZONE:", m)
for s_ in specs:
    if PORTRAIT: s_.setdefault("portrait", True)
    if ENV:
        fps = ENV["fps"]; step = max(1, fps // 15)
        for sy in s_.get("say", []):
            if isinstance(sy.get("from"), (int, float)) and isinstance(sy.get("to"), (int, float)) and "env" not in sy:
                a0 = int((s_["start"] + sy["from"]) * fps); b0 = int((s_["start"] + sy["to"]) * fps)
                sy["env"] = ENV["v"][a0:b0:step]; sy["envFps"] = fps / step
    # 9:16 safe zone (YouTube/Reels UI covers the bottom 20%, top 12%, right 15%); the camera is lifted 160 px in portrait
    if PORTRAIT and s_.get("type") in ("stage", "thumb") and not s_.get("shots") and not s_.get("shot"):
        cam = {"fx": 960, "fy": 540, "k": 1.04}; cam.update(s_.get("cam", {})); lift = s_.get("lift", 160)
        for c in s_.get("chars", []):
            sc, y, x = c.get("scale", 1), c.get("y", 0), c.get("x", 0)
            feet = (y - cam["fy"]) * cam["k"] + 540 - lift; head = (y - 340 * sc - cam["fy"]) * cam["k"] + 540 - lift; off = (x - cam["fx"]) * cam["k"]
            if feet > 880: _warn(f'{s_["name"]}: "{c.get("name")}" feet at {feet / 10.8:.0f}% of the height (keep above 80%: raise cam fy or the character)')
            if head < 130: _warn(f'{s_["name"]}: "{c.get("name")}" head at {head / 10.8:.0f}% (top 12% is covered)')
            if abs(off) > 250 and not c.get("walk"): _warn(f'{s_["name"]}: "{c.get("name")}" is {off:+.0f} px from the centre (portrait shows about +-300; right 15% has the buttons)')
    if PORTRAIT:
        for it in s_.get("items", []):
            if it.get("y", 540) > 880 or it.get("y", 540) < 130 or abs(it.get("x", 960) - 960) > 240: _warn(f'{s_["name"]}: text "{it.get("text")}" sits outside the safe box')
HEAD = '''<template>
  <style>
    @font-face { font-family: "Kalam"; src: url("assets/fonts/kalam-700.woff2") format("woff2"); font-weight: 700; }
    #root { position: absolute; inset: 0; overflow: hidden; background: transparent;  /* transparent so pass/dissolve/whip show the previous shot underneath, never a black gap */ }
    #root svg { position: absolute; inset: 0; }
    #root text { font-family: "Kalam"; font-weight: 700; }
  </style>
  <div id="root" data-composition-id="%(sid)s" data-width="%(ow)d" data-height="%(oh)d">
    <svg id="%(sid)s-svg" viewBox="%(vb)s" width="%(ow)d" height="%(oh)d"></svg>
  </div>
  <script>
    (function () {
      const o = %(opts)s;%(custom)s
      S.mount("%(sid)s", o);
    })();
  </script>
</template>
'''
mounts = []
for s in specs:
    name, start, dur = s.pop("name"), s.pop("start"), s["dur"]
    sid = name.split("-")[0]
    path = os.path.join(clip, "compositions", name + ".html")
    if "html" in s:
        open(path, "w", encoding="utf-8").write(s["html"])
    else:
        js = s.pop("js", None)
        custom = f"\n      o.custom = function (tl, ctx, C, T) {{ {js} }};" if js else ""
        open(path, "w", encoding="utf-8").write(HEAD % {"ow": OW, "oh": OH, "vb": VB, "sid": sid, "opts": json.dumps(s, ensure_ascii=False), "custom": custom})
    mounts.append(f"{name}:{start}:{dur}")
subprocess.run([sys.executable, os.path.join(here, "mount.py"), str(n), *mounts], check=True)
