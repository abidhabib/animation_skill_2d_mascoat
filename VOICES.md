# Voices (Fish Audio) - notes only, nothing generated yet

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
