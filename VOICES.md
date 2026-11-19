# Voices (Fish Audio) - notes only, nothing generated yet

Read 2026-11-19 from docs.fish.audio. Voice ids are the `reference_id` for the API.

## Cast
| Role | Fish model id | What we know |
|---|---|---|
| **Main character (mascot)** | `3885786187cc47adb78fecb51b02db99` | Page is a JS shell: name/description not readable. User chose it as the hero voice |
| Other: anxious young male | `f79c48d249324e599d3c2cd3302f3dd2` | User's description: energetic, anxious, fast, breathy, urgent. Page not readable |
| Other: gritty heroic | `c524a197a2af44859b903c540732c4d8` | Page name "Zoro" by Techn0Fox, English, tags: raspy, energetic, dramatic, anime, gaming. Description says young, tags say Old. ~4K uses |
| Other: authoritative announcer | `90e65eaaf50e4470b8e6d43ee6afd7d5` | Page name "Super Smash Bros. 4/Ultimate Announcer" by Club RM Studios Latinoamerica, English, deep, authoritative, cinematic. ~21M uses |

Rights warning: voices 3 and 4 appear to imitate a named anime character and a game announcer. Fish terms: free plan is personal/non-commercial; paid users are licensed for commercial use but may not exploit content they do not own. Check fish.audio/terms and the voice owner before using these in monetised videos.

## Decision (user, 2026-11-19)
Other characters speak only a few short lines per video (about 10% of words, 8 words or fewer each), so these four voices are enough. Do NOT ask for more voices unless a script clearly needs a role none of them can play (then tell the user which role). Quick casting: anxious young male = nervous/scared/young side characters; gritty heroic = tough/rival/coach; announcer = authority, host, crowd announcer, narrator-style interjections. Narrator = the user's own recorded voice (not Fish).

## API cheat sheet
- `POST https://api.fish.audio/v1/tts`, header `Authorization: Bearer $FISH_API_KEY`, optional header `model: s2.1-pro` (`s2.1-pro-free` for no-credit accounts). Key from fish.audio/app/developers/get-started/ - keep it in the environment variable `FISH_API_KEY`, never in files or chat.
- Body: `{"text":"...","reference_id":"<id>","format":"mp3","prosody":{"speed":1.0,"volume":0},"temperature":0.7,"top_p":0.7}`
- Python: `pip install fish-audio-sdk`; `client.tts.convert(text=..., reference_id=..., model="s2.1-pro")` then `save(audio,"out.mp3")`.
- Emotion tags (S2 models) go in square brackets in the text, at sentence start, max ~3 per sentence: `[happy]`, `[nervous]`, `[angry][shouting]`, `[sobbing]`, `[whispering]`, `[surprised][gasping]`, `[sarcastic]`, `[yawning]`, `[screaming]`, `[break]`, `[long-break]`. (Old S1 used parentheses.)
- Price: about $15 per 1M bytes of text on s2.1-pro (about 12 hours of speech); concurrency 5 on the starter tier; free web plan 500 chars per generation, non-commercial.

## Planned mapping: scene `say` emotion -> Fish tags (not built yet)
happy `[happy]`, joy `[excited]`, love `[soft tone][happy]`, crying `[sobbing]`, nervous `[nervous]`, scared `[nervous][gasping]`, angry `[angry][shouting]`, shocked/mindblown `[surprised][gasping]`, smug `[confident][sarcastic]`, sleepy `[yawning][soft tone]`, scream `[screaming]`, explain `[calm]`.

## Planned pipeline (not built)
Tagged script (`HERO (shocked): ...`, `COACH (excited): ...`) -> one Fish call per line with that character's voice id + tags -> mp3 per line -> joined with the narrator track -> `new-clip.sh` word timings -> `say.at` phrases fill the close-ups automatically.
