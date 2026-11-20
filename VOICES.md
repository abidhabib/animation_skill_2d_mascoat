# Voices (Fish Audio)

**MAIN VOICE (user, 2026-11-20): "Abid's Fav" by Abid Habib, Fish id `4de5245b355c4974a0c71baf01775d48` (https://fish.audio/m/4de5245b355c4974a0c71baf01775d48), replaces Elliot as the main character / narrator. Every rule below that says "Elliot" applies to this voice (Speed 1.2x set in Fish, no tag by default, rhythm check, CTA at 1.0x). Open it with https://fish.audio/app/text-to-speech/?modelId=4de5245b355c4974a0c71baf01775d48. First used: V02 clip 1 (test); the Elliot version is kept as `renders/V02 - Clip 1 (Elliot).mp4`.**

**VOICE TRIAL (user, 2026-11-20): "Energetic Male" by @lengyue, Fish id `802e3bc2b27e49c2995d23ef70e6ac89` (young, clear American), generated at Speed 1.0x as the possible new main voice; tested on V02 clip 1. For 1.0x voices run fishjoin with `NOSLOW=1` (no time-stretch, Fish's own pace). Earlier tests kept: `renders/V02 - Clip 1 (Elliot).mp4`, `renders/V02 - Clip 1 (Abid's Fav).mp4`. Pitch can be changed after download (ffmpeg rubberband, speed unchanged): tests in `Voice-overs Chunks/_pitch-tests`.**

## HARD RULES for the main character / narrator (Elliot), user review of Short 1 (2026-11-19)
- **Emotion tags: ONLY these four are allowed**: `[curious]`, `[intrigued]`, `[nervous]`, `[serious, slow]`. Never use any other tag on the main character.
- **Banned (they made the voice bad)**: `[low, ominous]`, `[whispering]`, `[warm, quick]` (it made the line far too fast). Also do not invent new tags such as `[building tension]` or `[quiet, hurt]`: if a line needs a mood, pick one of the four or use no tag.
- **NO TAG BY DEFAULT (user, V02 clip 1 review):** tags also change the pacing; `[curious]` made Elliot rush and broke the rhythm on top of 1.2x. Elliot's lines get **no tag** unless one line truly needs an emotion; then tag only that line (prefer `[serious, slow]`, which slows down). Never tag a whole paragraph.
- **Pace with punctuation, not tags:** full stops, commas and `...` give natural pauses ("Your alarm goes off... Seven a.m.").
- **Generate in short pieces** (1-2 sentences per Fish generation) so one tag or rush cannot take over a clip. `fishjoin.py` then picks the steadier of the two takes, slows any piece that runs faster than Elliot's normal pace (pitch kept) and makes every pause at least 0.24 s.
- **Smooth speaker hand-offs (user, V02 clip 2):** the jump from Elliot to another voice must not jerk or stop. `fishjoin.py` levels every part to the same loudness, adds soft 15/60 ms fades, fills every pause with quiet room tone (never dead silence) and uses about 0.25 s before a reply (`gap=0.25`).
- **Speed 1.2x is set during generation in Fish** (Text to Speech: Speed 1.2x; in Voice Acting use the role/line speed if offered, otherwise generate Elliot's lines in Text to Speech at 1.2x). `fishvo.py`'s ffmpeg speed-up is only the fallback when Fish could not do it.
- Call-to-action lines ("Full story on my channel", subscribe, comment) are generated at 1.0x and never sped up.
- Other characters keep normal speed; their tags are free (e.g. `[nervous]` worked for Sam).

Read 2026-11-19 from docs.fish.audio. Voice ids are the `reference_id` for the API.

## Cast
| Role | Fish model id | What we know |
|---|---|---|
| **Main character (mascot)** | `3885786187cc47adb78fecb51b02db99` | Page is a JS shell: name/description not readable. User chose it as the hero voice |
| Other: anxious young male | `f79c48d249324e599d3c2cd3302f3dd2` | User's description: energetic, anxious, fast, breathy, urgent. Page not readable |
| Other: "Max Goof" (user added 2026-11-19) | `66b40af2b5074a278bd4274f51d9fa57` | Bookmarked as "Max Goof (A Goofy Movie version)": versatile, expressive, enthusiastic to dramatic shouting. Use for energetic / loud / teen-style lines |
| Other: "Twinko" (user added) | `15742afadec44b82bf52f7bb62b83f83` | By @Benyamin. Female, young, bright, playful, animated, energetic. The only female role voice: use for mum / sister / girlfriend / female friend lines |
| Other: "Venti" (user added) | `e34c486929524d41b88646b4ac2f382f` | By @Juvenile. Youthful, melodic, playful, light and breathy, whimsical (page tags say Female, Middle Aged; description says male). Use for light, playful, quirky side characters |

| Other: "Adrian" (Claude's pick, Fish Official default voice) | `bf322df2096a46f18c579d0baa36f41d` | "A steady and reliable narrator", male, middle-aged. Fish-official, so no third-party character IP. Use for calm adult males: Dad, doctor, teacher |
| Other: "Ethan" (Claude's pick, Fish Official default voice) | `536d3a5e000945adb7038665781a4aca` | "A curious explainer", male, middle-aged, Fish-official. Use for boss, coworker, friendly adult male |

**Rule (user, 2026-11-19): the main character / narrator voice (Elliot) ALWAYS plays at 1.2x speed.** Set Speed 1.2x in Fish Text to Speech, or (Voice Acting has no speed control) export the scene as separate Clips and speed only Elliot's lines with `ffmpeg -af atempo=1.2` (keeps the pitch); other characters stay at 1.0x.
**Rule (user, 2026-11-19): Elliot is the MAIN voice (hero). For every other character Claude chooses the voice from this cast, then tells the user.** Preferred order for side roles: Fish-official defaults (Adrian, Ethan, Sarah, Laura, Jordan, Hannah, Selene) first, because they are licensed; character-imitation voices only for characters that need that energy.

**EXCLUDED by the user (2026-11-19): "Zoro" (`c524a197...`) and "Super Smash Bros. 4/Ultimate Announcer" (`90e65eaa...`). Do not use them.** They are still bookmarked in the account unless the user removes them.
Rights warning: Max Goof and Venti look like imitations of a named cartoon character and a game character (Twinko may be too). Fish terms: free plan is personal/non-commercial; paid users are licensed for commercial use but may not exploit content they do not own. Check fish.audio/terms and the voice owner before using these in monetised videos.

## Decision (user, 2026-11-19)
Other characters speak only a few short lines per video (about 10% of words, 8 words or fewer each), so the current cast (Elliot hero, Gregory, Max Goof, Twinko, Venti) is enough. Do NOT ask for more voices unless a script clearly needs a role none of them can play (then tell the user which role; today the gap is a calm deep adult male for roles like Dad or a boss). Quick casting: Gregory = nervous/scared/young male side characters; Max Goof = loud, energetic, teen lines; Twinko = female roles; Venti = playful/quirky characters. Narrator = the user's own recorded voice (not Fish).

## Fish web app, seen 2026-11-19 (user logged in, Plus plan; looked only, nothing generated)
- Model in the web app is **Fish Audio Drama 3** (newest). Text to Speech page (fish.audio/app/text-to-speech/): one voice per block, "Add Speaker" for several voices, Tags and Auto Tag buttons, Volume and Speed controls, 15,000-character limit per generation, Generate button.
- Tags: preset `[sigh]`, natural-language directions in square brackets (`[warm and relaxed, like talking to an old friend]`), and paired tags like `<whisper>...</whisper>` that change only the words inside.
- **Voice Acting** (fish.audio/app/voice-acting/): a scene with a Cast (one voice per role), a scene note ("where are we, how do they feel", 500 chars), lines per character, "Perform scene" (each character's lines in one take) or per-line Generate, re-take / switch take / keep, Export scene. Best fit for the short Sam / Dad / Boss lines; narrator stays the user's own voice.
- **Voices added 2026-11-19 (user said yes; nothing generated):** the hero id `3885...` is "Elliot" by Rameen Kaif, already in My Voices. The others are saved under **Bookmarks** (fish.audio/app/bookmarks/): `f79c...` = "Gregory" (anxious young; page tags say Female, description says young male), plus the user's own additions Max Goof, Twinko and Venti (ids in the cast table). Zoro and the Smash announcer are also bookmarked but EXCLUDED. Bookmarks have a "Use" button for Text to Speech / Voice Acting. "My Voices" (0/10 slots) is for the user's own cloned voices, so bookmarks are the right place for others' voices.
- Heads-up: voices that imitate named characters (Max Goof, Venti) need a Fish terms / rights check before monetised use (see rights warning above).

## DOWNLOADING (user rule 2026-11-19: Claude downloads Fish audio itself, NEVER asks the user to download)
The built-in browser pane cannot save downloads. Instead: on fish.audio/app/text-to-speech/ open the History tab, then read the audio links with the browser's JS tool: `[...document.querySelectorAll('audio')].map(a=>a.currentSrc)` (each sits in its history card, so pair it with the card text). They are direct files like `https://platform.r2.fish.audio/tasks/<date>/<id>.mp3`; fetch them with `curl -s -f -o part.mp3 <url>` into the scratchpad. Generate Elliot in Text to Speech (Speed slider 1.2 via ArrowRight from 1.0; CTA at 1.0) and other voices separately, then join with ffmpeg (trim edge silence, 0.35-0.5 s pauses, loudnorm). Example: scratchpad `join_vo.py` logic, Short 1 (35.6 s).

## Fish voice-over workflow (used for Short 1, 2026-11-19; user approved generation)
1. Fish web app (built-in browser, user logged in): Voice Acting -> New scene -> **Paste script** with `ROLE: [emotion] line` per line -> Import -> set voices (Narrator = Elliot from Recently used/My Voices, others from Bookmarked or Default) -> Create scene -> scene note -> **Perform scene** (about 600 characters for a 45 s Short).
2. Export -> tick **Scene mix** -> Export. The built-in browser pane does NOT save downloads to disk: ask the user to click Download (History tab) so the zip lands in Downloads.
3. `python3 fishvo.py "<Downloads>/<date>_<scene>.zip" "Short 1"` cuts every line from the mix using manifest.csv, speeds Elliot to 1.2x (call-to-action lines stay 1.0x), joins with 0.32 s pauses, normalises loudness, writes the voice-over + transcript.
4. `bash new-clip.sh S1` times every word and builds the lip-sync envelope; build the spec with phrase timing; render.

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
