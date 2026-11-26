# Design taste: pop-ups, numbers, captions (user 2026-11-26: "should not look generic, everything unique, good design")

Picture: `docs/POPUPS.png`. Code: `growkaz/engine/popups.js` (`POP.<name>`, `capt2`). Gallery: `growkaz/example-lab-popups`.

## The one rule
A pop-up is an **object from the story's world**, with a material, a way of arriving and a small life afterwards.
Ask: "What real thing would show this?" A fare is a receipt, savings are a jar, a score is a station board.

## Banned (generic AI look)
- Rounded capsule / pill with a coloured outline, glow and centred text (the old `$9` counter).
- Translucent dark box behind captions.
- Same pop-in scale on everything; text that only fades.
- Glow used as decoration. Glow belongs to real light sources (neon, screens, lamps).
- One style for the whole channel.

## Pick by meaning
| Need | Use | Material / motion |
|---|---|---|
| counting score, money | `flap` | station board, tiles flip then lock |
| fast rising total | `odometer` | brass drums roll |
| costs, gains and losses | `receipt` | thermal paper feeds out |
| a price or rule ("$1 per minute") | `tag` | kraft tag swings on string |
| one big win/loss reaction | `sticker` | die-cut, shine sweep |
| verdict, ending of a game | `stamp` | slams, worn ink, dust |
| time jump, chapter | `tape` | torn tape, handwriting writes on |
| opening title, night scenes | `neon` | flickers on |
| classroom, explaining | `chalk` | writes, circles itself |
| savings over time | `jar` | coins drop and pile |
| sudden noise or shock | `burst` | comic jag, halftone |
| a message | `note` | stacked paper card slides in |
| level, trust, danger | `dial` | needle springs |

## Rules for every use
1. Max ONE pop-up on screen, plus captions. Top third; never over a face.
2. A video uses at most 3 pop-up types, chosen for its world; do not repeat the previous video's trio (note them in `LOOKS.md`).
3. Match palette to the scene look: one accent colour per video.
4. Sound matches material: board = ticks, receipt = counter, stamp = impact, jar = coin pings, neon = buzz, tape/note = swish.
5. Captions: choose one style per video. `punch` energetic, `strip` calm story, `serif` emotional/cinematic. Rotate between videos.
6. New pop-up needed? Add it to `popups.js` once, following: real material (texture, edge, shadow), own entrance, text fits (`fit`), add to gallery, look at it.

## Check before render
Look at a still and ask: Could this appear in any other channel's video? Does it look like a thing you could touch? Is the number readable on a phone?
