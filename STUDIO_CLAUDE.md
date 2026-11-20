# YouTube studio - read this first (shared by ALL videos)

Open Claude in THIS folder ("YouTube Content"). One kit, one memory, every video.

## Layout
- `_Studio Kit/` = THE kit (code, scene library, docs, voice rules). Every video uses it directly: no copies, no `git pull`. Its git repo is only the backup: https://github.com/abidhabib/animation_skill_2d_mascoat (repo root = `_Studio Kit/`).
- `V02 - Trust Numbers/`, `V03 - .../` = one folder per video: `Script - *.md`, `Short - *.md`, `Voice-overs Chunks/`, `Transcript Chunks/`, `specs/`, `clips/`, `renders/` (`V02 - Clip 3.mp4`, `V02 - Short 1.mp4`), `thumbnails/`.
- `First Video/` = Video 1, FINISHED archive (32 clips). Never extend it. Its old `Animation/` folder is an older kit copy: do not use it for new work.
- New video: `bash "_Studio Kit/new-video.sh" "V03 - Topic"`.
- Work from inside the video folder: `cd "V02 - Trust Numbers"` then `bash "../_Studio Kit/new-clip.sh" 3`, `python3 "../_Studio Kit/scene.py" 3 specs/clip03.json`, `bash "../_Studio Kit/render-clip.sh" 3` (Shorts: `S1`).

## Read order
`_Studio Kit/START_HERE.md` (section 0b = CURRENT DEFAULTS) -> `LIBRARY.md` (KIT V2, cinematic rules, Short 1 review rules) -> `VOICES.md` (HARD RULES, DOWNLOADING) -> `PACKAGING_PLAYBOOK.md` -> `STYLE_RULES.md`. Skills: `/cartoon-explainer-clip`, `/video-script-writer` (global).

## Working rules (the user's preferences)
- Animation = KIT V2 shots, not slides: every narration beat shows its own picture, varied places, zoom-through transitions, no random weather, 9:16 safe zone for Shorts. Every long video gets a companion Short. Titles default to "What If You Could ...".
- Voice-over = Fish Audio (fish.audio, user logged in the built-in browser): main character/narrator = "Abid's Fav" (Fish id 4de5245b355c4974a0c71baf01775d48, replaced Elliot 2026-11-20), Text to Speech Speed 1.2x, NO tags at all, ever (user 2026-11-20); always the 1st Fish generation (older take, listed second in history); commas instead of many '...'; CTA lines 1.0x; other characters in their own voices at 1.0x. Claude downloads the audio itself (history audio links + curl), never asks the user to download.
- **Every finished clip/Short/thumbnail: send it with SendUserFile AND write its clickable path in the chat message** as a markdown link relative to `YouTube Content`, e.g. `[V02 - Clip 3.mp4](V02 - Trust Numbers/renders/V02 - Clip 3.mp4)`, plus the full Windows path (`C:\Users\Abid .H\Documents\YouTube Content\V02 - Trust Numbers\renders\V02 - Clip 3.mp4`) so the user can open it in File Explorer (user rule 2026-11-19).
- Token-light: plan -> short JSON spec -> scene.py -> render -> send (SendUserFile). Check frames with ffmpeg contact sheets when building something new.
- Reuse the library; add missing assets to `_Studio Kit/_kit` once, then reuse. Measure techniques, never copy other creators' characters, art, audio or logos. No brand marks unless asked.
- Kit/skill/doc updates: commit + push `_Studio Kit` without asking (only that repo). Ask before other outward actions or deleting real clips/renders.
- Explain simply, short answers, show results as images/clips.
