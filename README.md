# Cartoon explainer kit

Reusable animation kit for a 2D cartoon explainer channel (HyperFrames): one hero mascot with 12 expressions and
front/side/back views, rich environments (streets, rooms, factory, lab, stadium, harbor...), vehicles, machines,
crowds, weather, talking close-ups and voice-over phrase timing.

## Contents
| Path | What |
|---|---|
| `_kit/toon.js`, `_kit/scenes.js`, `_kit/world.js`, `_kit/fonts/` | The library (characters, scenes, props, envs). Copied into every clip |
| `scene.py`, `mount.py` | Turn `specs/clipN.json` into scene files and mount them |
| `new-clip.sh`, `render-clip.sh` | Scaffold a clip from a voice-over, check + render it |
| `STYLE_RULES.md` | Measured style rules (cuts, camera, light, colour, characters) |
| `LIBRARY.md`, `LIBRARY_CATALOG.png` | Cheat sheet and picture catalog of every asset |
| `docs/` | Mascot model sheet, expressions, montage storyboard |
| `START_HERE.md` | Briefing for a new Claude session (workflow, library map, voices, gotchas, to-do) |
| `thumb.py`, `specs/thumb_example_*.json` | Thumbnail maker: spec -> 1920x1080 PNG + 1280x720 JPG |
| `PACKAGING_PLAYBOOK.md`, `SCRIPT_TEMPLATE.md` | Title/thumbnail/hook/retention rules and a timed script outline |
| `VOICES.md` | Fish Audio voice ids, API cheat sheet, emotion-tag map (nothing generated) |
| `PROJECT_CLAUDE.md` | Copy of the project `CLAUDE.md`; place it as `CLAUDE.md` in the video project root |
| `skill/cartoon-explainer-clip/SKILL.md` | The Claude Code skill (copy of the live one) |
| `specs/` | Scene specs of finished clips (examples to copy) |

## Use it in a new place
1. Clone this repo as `Animation/` inside your video project folder (next to `Voice-overs Chunks/` and `Transcript Chunks/`).
2. Install the skill: copy `skill/cartoon-explainer-clip/` to `~/.claude/skills/` (Windows: `C:\Users\<you>\.claude\skills\`).
3. `bash new-clip.sh N` -> write `specs/clipN.json` -> `python3 scene.py N specs/clipN.json` -> `bash render-clip.sh N`.
4. Ask Claude: "Make clip N with the mascot using the library", or run `/cartoon-explainer-clip`.

Needs: Node (npx hyperframes), Python 3, ffmpeg.

## Keep the skill in sync
The live skill is edited at `~/.claude/skills/cartoon-explainer-clip/SKILL.md`; copy it back into `skill/` before committing.
Old hand-built clips (`clip-01` ... `clip-22`) and renders are intentionally not in git.
