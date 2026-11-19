---
name: video-script-writer
description: Write titles, a retention-engineered script (default 11-13 minutes), thumbnail concept and chunked voice-over files for the user's cartoon YouTube channel. Use when the user asks for a video idea, title, script, hook or retention plan, or runs /video-script-writer.
---

# Video script writer (user's channel: hypothetical-premise cartoon explainers, hero = yellow-hoodie mascot)

Do NOT write a script until the user says to (they sometimes only want advice). Never generate voice audio.

## Read first (in the project's `Animation/` folder)
`PACKAGING_PLAYBOOK.md` (title/thumbnail rules, 11-13 min blueprint, the user's retention rules + pre-record checklist), `SCRIPT_TEMPLATE.md` (timed outline), `VOICES.md` (4 character voices; narrator is the user). If those files are missing, tell the user to run `git pull` in `Animation/` or clone https://github.com/abidhabib/animation_skill_2d_mascoat.

## Inputs (ask only for what is missing, one short question)
Premise/rule, target length (default 11-13 min), anything to avoid. The channel is NOT tech/news; the hero is "you".

## Steps
1. **Titles**: 10 options, ~70% without "What If", under ~60 characters, rule + catch + number; pick one and say why. Thumbnail TEXT idea (2 words, not repeating the title). The user makes the thumbnail art themselves (or `Animation/thumb.py`).
2. **Loop map**: list the open loops (what is promised, where, where paid) so a loop is active every minute; midpoint twist at ~50%; title promise paid at ~70-80%; bigger final twist + sequel hook.
3. **Script**: follow the blueprint table. Rules: "Therefore / But" between beats (never "and then"); a re-hook at least every 90-120 s; a numbered stake or measurable test in every beat; every twist tied to time, money, family, love, survival or status; a viewer question about every 2 minutes; one `[SILENCE 1-2s]` before each big emotional line; no filler (add a test, a person affected or a harder consequence instead); about 1,200-1,500 narrated words for 11-13 min (the user's pacing is slow, ~100 wpm with pauses).
4. **Other characters**: a touch only. `NAME (emotion): "line"`, 8 words or fewer, at turning points, about 10% of words at most, mapped to the 4 voices in VOICES.md (female roles are not available: avoid them or ask).
5. **Checklist**: score the draft 0-5 on the user's pre-record checklist (one-second clarity, open loop at every minute, two distinct emotions, a share-worthy line, an ending question with no single right answer) and fix anything below 5.
6. **Save**: `<project>/Script - <short title>.md` (full script with timestamps, beat names and bracket notes). Only after the user approves, split narration into ~30 s chunks `Transcript Chunks/VO_01.txt ...` (strip bracket notes and tags; one file per voice-over clip) so `new-clip.sh N` can pair them with the recordings.
7. Show the user the title picks, the loop map and a summary; give the full script in chat only if asked (it is in the file).

## Reminders
Claims about views/algorithm are patterns to test, not promises. Do not copy other creators' stories, characters or likenesses. Keep answers short and simple.
