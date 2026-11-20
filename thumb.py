"""Make a YouTube thumbnail from a scene spec:   python3 thumb.py specs/thumb_foo.json [name]
Spec = one scene object (or a list; the first is used) with "type":"thumb" (see LIBRARY.md).
Writes thumbnails/<name>.png (1920x1080) and thumbnails/<name>_1280x720.jpg (upload size, under 2 MB).
Uses the scratch project clip-99 (deleted afterwards when possible)."""
import json, os, shutil, subprocess, sys
here = os.path.dirname(os.path.abspath(__file__))
_c = os.environ.get("VIDEO_DIR") or os.getcwd()
VD = _c if os.path.isdir(os.path.join(_c, "Voice-overs Chunks")) or os.path.isdir(os.path.join(_c, "clips")) else None
ENV = {k: v for k, v in os.environ.items() if k != "VIDEO_DIR"}
spec_abs = os.path.abspath(sys.argv[1])
spec_path = sys.argv[1]
name = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(os.path.basename(spec_path))[0]
spec = json.load(open(spec_path, encoding="utf-8"))
scene = spec[0] if isinstance(spec, list) else spec
scene.update({"name": "s1-thumb", "start": 0, "dur": 1.2, "drift": False, "type": "thumb"})
scene.setdefault("cam", {"fx": 960, "fy": 540, "k": 1.0})
P = os.path.join(here, "clip-99")
shutil.rmtree(P, ignore_errors=True)
os.makedirs(os.path.join(P, "compositions")); os.makedirs(os.path.join(P, "assets", "fonts"))
for f in ("toon.js", "world.js", "scenes.js"): shutil.copy(os.path.join(here, "_kit", f), os.path.join(P, "assets", f))
for f in os.listdir(os.path.join(here, "_kit", "fonts")): shutil.copy(os.path.join(here, "_kit", "fonts", f), os.path.join(P, "assets", "fonts", f))
shutil.copy(os.path.join(here, "_base", "index.template.html"), os.path.join(P, "index.html"))
for f in ("package.json", "hyperframes.json"): shutil.copy(os.path.join(here, "_base", f), os.path.join(P, f))
open(os.path.join(P, "meta.json"), "w").write('{"id": "clip-99", "name": "clip-99"}')
tmp = os.path.join(here, "specs", "_thumb_tmp.json")
json.dump([scene], open(tmp, "w", encoding="utf-8"))
subprocess.run([sys.executable, os.path.join(here, "scene.py"), "99", tmp], check=True, cwd=here, env=ENV)
subprocess.run(["bash", os.path.join(here, "render-clip.sh"), "99"], check=True, cwd=here, env=ENV)
out = os.path.join(VD or here, "thumbnails"); os.makedirs(out, exist_ok=True)
video = os.path.join(here, "renders", "Clip 99.mp4")
png = os.path.join(out, name + ".png"); jpg = os.path.join(out, name + "_1280x720.jpg")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-ss", "0.9", "-i", video, "-frames:v", "1", png], check=True)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", png, "-vf", "scale=1280:720", "-q:v", "2", jpg], check=True)
os.remove(tmp)
if os.path.exists(video): os.remove(video)
shutil.rmtree(P, ignore_errors=True)
print("thumbnail:", png, "|", jpg)
