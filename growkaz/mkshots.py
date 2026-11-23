# mkshots.py <project dir> <spec.json>: compact spec -> story/shots.json
# spec: {"title":..., "dur":..., "music":[[s,e,mood,int],...], "shots":[[id,start,end,line,scene,in,sfx,amb],...]}
#   in: "fade" | "cut" ; sfx: [[at,name,gain],...] ; amb: null | [name,gain]
import json, sys
TRANS = {"fade": {"type": "fade", "dur": 0.25}, "zoom": {"type": "zoom", "dur": 0.5}, "whipR": {"type": "whip", "dir": 1, "dur": 0.35}, "whipL": {"type": "whip", "dir": -1, "dur": 0.35}, "flash": {"type": "flash", "dur": 0.3}, "cut": {"type": "cut"}}   # "zoom" = zoom-through into the next scene (user 2026-11-23)
SFX_TRIM_DB = -3.1   # user 2026-11-23: sound effects (ting, pop...) ~30% quieter; applied to every sfx cue, ambience unchanged
proj, spec = sys.argv[1], json.load(open(sys.argv[2], encoding="utf-8"))
shots = []
for sid, s, e, line, scene, tin, sfx, amb in spec["shots"]:
    d = {"id": sid, "start": s, "end": e, "line": line, "scene": scene, "set": spec.get("set", ""), "bars": None,
         "in": TRANS.get(tin, {"type": "cut"}),
         "sfx": [{"at": a, "name": n, "gain": round(g + SFX_TRIM_DB, 1)} for a, n, g in sfx], "notes": ""}
    if amb: d["amb"] = {"name": amb[0], "gain": amb[1]}
    shots.append(d)
out = {"title": spec["title"], "duration": spec["dur"], "shots": shots,
       "music": [{"start": a, "end": b, "mood": m, "intensity": i} for a, b, m, i in spec["music"]], "sfx": []}
json.dump(out, open(proj + "/story/shots.json", "w", encoding="utf-8"), indent=1)
print("shots:", len(shots), "last end", shots[-1]["end"])
