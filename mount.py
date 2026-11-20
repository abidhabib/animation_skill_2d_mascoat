"""Mount scenes into clip N's index.html (replaces <!-- SCENES --> or the previous mount block).
usage: python3 mount.py N name:start:dur [name:start:dur ...]
       name = compositions/<name>.html whose root id is its prefix before '-' (s1-report -> s1)."""
import os, re, sys

here = os.path.dirname(os.path.abspath(__file__))
# shared studio: inside a video folder (has "Voice-overs Chunks" or "clips", or VIDEO_DIR is set) clips live in <video>/clips
def _video_dir():
    v = os.environ.get("VIDEO_DIR")
    if v: return os.path.abspath(v)
    c = os.getcwd()
    return c if os.path.isdir(os.path.join(c, "Voice-overs Chunks")) or os.path.isdir(os.path.join(c, "clips")) else None
VD = _video_dir()
CLIPS = os.path.join(VD, "clips") if VD else here
n = int(sys.argv[1])
p = os.path.join(CLIPS, f"clip-{n:02d}", "index.html")
import json
_mp = os.path.join(CLIPS, f"clip-{n:02d}", "meta.json")
_portrait = os.path.exists(_mp) and bool(json.load(open(_mp, encoding="utf-8")).get("portrait"))
W, H = (1080, 1920) if _portrait else (1920, 1080)
rows = []
for k, spec in enumerate(sys.argv[2:]):
    name, start, dur = spec.split(":")
    sid = name.split("-")[0]
    rows.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{name}.html" '
                f'data-start="{start}" data-duration="{dur}" data-track-index="{1 + k % 2}" data-track-kind="graphics" '
                f'data-width="{W}" data-height="{H}" style="z-index:{k + 1}"></div>')
block = "      <!-- SCENES:BEGIN -->\n" + "\n".join(rows) + "\n      <!-- SCENES:END -->"
t = open(p, encoding="utf-8").read()
if "<!-- SCENES -->" in t:
    t = t.replace("      <!-- SCENES -->", block)
else:
    t = re.sub(r"      <!-- SCENES:BEGIN -->.*?<!-- SCENES:END -->", lambda m: block, t, flags=re.S)
open(p, "w", encoding="utf-8").write(t)
print(f"clip {n}: mounted {len(rows)} scenes")
