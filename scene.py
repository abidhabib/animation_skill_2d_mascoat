"""Generate library scenes for clip N from a JSON list and mount them.
usage: python3 scene.py N clipN.json
JSON: [{"name":"s1-hook","start":0,"dur":4.2,"type":"docStamp","bg":"teal","in":{"kind":"whip"}, ...opts}, ...]
  - every opts time is scene-local (word time - start). "dur" is passed through to S.mount.
  - "html": a full scene file body instead of a library type (custom scene); "js": extra JS run as opts.custom(tl,ctx,C,T).
  - "copy": true → only re-sync assets/scenes.js from _kit."""
import json, os, shutil, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
n = int(sys.argv[1]); clip = os.path.join(here, f"clip-{n:02d}")
shutil.copy(os.path.join(here, "_kit", "scenes.js"), os.path.join(clip, "assets", "scenes.js"))
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
HEAD = '''<template>
  <style>
    @font-face { font-family: "Kalam"; src: url("assets/fonts/kalam-700.woff2") format("woff2"); font-weight: 700; }
    #root { position: absolute; inset: 0; overflow: hidden; background: #1b1a1f; }
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
