"""Mount scenes into clip N's index.html (replaces <!-- SCENES --> or the previous mount block).
usage: python3 mount.py N name:start:dur [name:start:dur ...]
       name = compositions/<name>.html whose root id is its prefix before '-' (s1-report -> s1)."""
import os, re, sys

here = os.path.dirname(os.path.abspath(__file__))
n = int(sys.argv[1])
p = os.path.join(here, f"clip-{n:02d}", "index.html")
rows = []
for k, spec in enumerate(sys.argv[2:]):
    name, start, dur = spec.split(":")
    sid = name.split("-")[0]
    rows.append(f'      <div id="{sid}" data-composition-id="{sid}" data-composition-src="compositions/{name}.html" '
                f'data-start="{start}" data-duration="{dur}" data-track-index="{1 + k % 2}" data-track-kind="graphics" '
                f'data-width="1920" data-height="1080" style="z-index:{k + 1}"></div>')
block = "      <!-- SCENES:BEGIN -->\n" + "\n".join(rows) + "\n      <!-- SCENES:END -->"
t = open(p, encoding="utf-8").read()
if "<!-- SCENES -->" in t:
    t = t.replace("      <!-- SCENES -->", block)
else:
    t = re.sub(r"      <!-- SCENES:BEGIN -->.*?<!-- SCENES:END -->", lambda m: block, t, flags=re.S)
open(p, "w", encoding="utf-8").write(t)
print(f"clip {n}: mounted {len(rows)} scenes")
