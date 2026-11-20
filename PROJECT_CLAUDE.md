# YouTube explainer project - read this first

This folder is one video project of the user's 2D cartoon YouTube channel (one clip per voice-over chunk; clip numbers start at 1 in every video). Everything reusable lives in `Animation/` (a clone of the shared kit; `git pull` there brings kit upgrades).
**Full briefing: `Animation/START_HERE.md`.** Skill: `/cartoon-explainer-clip` (installed in `~/.claude/skills/`).

## Working rules (the user's preferences)
- Making a clip: use the `cartoon-explainer-clip` skill. Output `Animation/renders/Clip N.mp4`; send it with SendUserFile (display render).
- Token-light by default: plan -> write a short JSON spec -> `scene.py` -> `render-clip.sh` -> hand over. No render-screenshot-analyze loops unless the user asks for screenshots/storyboards (then extract frames with ffmpeg and send them).
- Reuse the library (`Animation/_kit`, cheat sheet `Animation/LIBRARY.md`, pictures `Animation/LIBRARY_CATALOG.png`). Do not hand-write scenes for things the library already has. If something is missing, add it to the kit once (and save it), then reuse.
- Style rules are measured, not guessed: `Animation/STYLE_RULES.md`. Hero = the user's own character (`role:"abid"`, automatic for a char named "hero"; old yellow hoodie via `role:"hoodie"`); pear characters are supporting cast.
- Voice-overs: the narrator is the user's own recording (`Voice-overs Chunks/`, paired with `Transcript Chunks/` by number). Character voices use Fish Audio, ids in `Animation/VOICES.md`. **Never generate any voice without an explicit go-ahead.** Never ask for or store an API key in chat/files (env var `FISH_API_KEY` only).
- Do not copy other creators' characters, art, audio or logos: measure and reuse techniques only.
- Ask before outward actions (pushing to GitHub, deleting real clips, spending API credit). Finished clips 1-32 and `renders/` are never deleted without asking.
- Explain simply, short answers, show results as images/clips when possible.

## Repo
Kit backup: https://github.com/abidhabib/animation_skill_2d_mascoat (repo root = the `Animation/` folder). Keep `Animation/skill/cartoon-explainer-clip/SKILL.md` in sync with the live skill before committing.
