---
name: video-script-writer
description: Write titles, a retention-engineered script (default 11-13 minutes), thumbnail concept and chunked voice-over files for the user's cartoon YouTube channel. Use when the user asks for a video idea, title, script, hook or retention plan, or runs /video-script-writer.
---


> **SHARED STUDIO (2026-11-19):** the live kit is `YouTube Content/_Studio Kit/` (open Claude in `YouTube Content`). Wherever this file says `Animation/...`, read `_Studio Kit/...` for kit files; each video has its own folder (`V02 - Trust Numbers/`: specs, clips, renders, voice files) and the scripts run from inside it: `bash "../_Studio Kit/new-clip.sh" N`, `python3 "../_Studio Kit/scene.py" N specs/x.json`, `bash "../_Studio Kit/render-clip.sh" N`. New video: `bash "_Studio Kit/new-video.sh" "V03 - Topic"`. No git pull, no clones; push `_Studio Kit` after kit changes.

# Video script writer (user's channel: hypothetical-premise cartoon explainers, hero = yellow-hoodie mascot)

Do NOT write a script until the user says to (they sometimes only want advice). Never generate voice audio.

## Read first (in the project's `Animation/` folder)
`PACKAGING_PLAYBOOK.md` (title/thumbnail rules, 11-13 min blueprint, the user's retention rules + pre-record checklist), `SCRIPT_TEMPLATE.md` (timed outline), `VOICES.md` (4 character voices; narrator is the user). If those files are missing, tell the user to run `git pull` in `Animation/` or clone https://github.com/abidhabib/animation_skill_2d_mascoat.

## Inputs (ask only for what is missing, one short question)
Premise/rule, target length (default 11-13 min), anything to avoid. The channel is NOT tech/news; the hero is "you".

## Steps
1. **Titles**: 10 options, mostly "What If You Could ..." (user decision 2026-11-19: the channel's default style; add at most 2-3 no-"What If" alternatives; follow the user's own CTR later), under ~60 characters, rule + catch + number; pick one and say why. Thumbnail TEXT idea (2 words, not repeating the title). The user makes the thumbnail art themselves (or `Animation/thumb.py`).
2. **Loop map**: list the open loops (what is promised, where, where paid) so a loop is active every minute; midpoint twist at ~50%; title promise paid at ~70-80%; bigger final twist + sequel hook.
3. **Script**: follow the blueprint table. Rules: "Therefore / But" between beats (never "and then"); a re-hook at least every 90-120 s; a numbered stake or measurable test in every beat; every twist tied to time, money, family, love, survival or status; a viewer question about every 2 minutes; one `[SILENCE 1-2s]` before each big emotional line; no filler (add a test, a person affected or a harder consequence instead); about 1,200-1,500 narrated words for 11-13 min (the user's pacing is slow, ~100 wpm with pauses).
4. **Other characters**: a touch only. `NAME (emotion): "line"`, 8 words or fewer, at turning points, about 10% of words at most, mapped to the 4 voices in VOICES.md (female roles are not available: avoid them or ask).
5. **Checklist**: score the draft 0-5 on the user's pre-record checklist (one-second clarity, open loop at every minute, two distinct emotions, a share-worthy line, an ending question with no single right answer) and fix anything below 5.
5b. **NO TAGS AT ALL in Fish text (user, 2026-11-20); older tag notes below are void.** Fish voice tags for the main character/narrator (old rule): NO tag by default (tags change the pacing and can rush him); if one line truly needs an emotion, tag only that line. Allowed when used: only `[curious]`, `[intrigued]`, `[nervous]`, `[serious, slow]` (or no tag). Never `[low, ominous]`, `[whispering]`, `[warm, quick]` or any other tag. Main voice is generated at 1.2x; call-to-action lines at 1.0x. See `Animation/VOICES.md` "HARD RULES".
6. **Save**: `<project>/Script - <short title>.md` (full script with timestamps, beat names and bracket notes). Only after the user approves, split narration into ~30 s chunks `Transcript Chunks/VO_01.txt ...` (strip bracket notes and tags; one file per voice-over clip) so `new-clip.sh N` can pair them with the recordings.
7. **Short (user rule 2026-11-19: EVERY long video gets a companion YouTube Short)**: after the long script, also save `<project>/Short - <short title>.md`: 40-50 s, 9:16, ~100-120 words, hook in the first second (a number/visual, no intro), one idea, one 8-word character line max, an open loop that is only closed by the long video, a loop-back last frame, same title premise + `#shorts`, burned-in 1-3 word captions, link the long video in Studio. Template: `Short - Trust Numbers.md`.
8. Show the user the title picks, the loop map and a summary; give the full script in chat only if asked (it is in the file).

## Reminders
Claims about views/algorithm are patterns to test, not promises. Do not copy other creators' stories, characters or likenesses. Keep answers short and simple.
