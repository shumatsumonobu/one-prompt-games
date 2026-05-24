# CLAUDE.md

## what this repo is

1 prompt = 1 game. no edits, no follow-ups. whatever Claude Code outputs from a single prompt ships as-is.

## game prompt rules

all game prompts follow these constraints:

- single-file browser game (HTML/CSS/JS in one index.html)
- retro aesthetic with CRT scanlines and screen glow
- 8-bit sound effects via Web Audio API
- no external dependencies
- fixed canvas, centered on screen
- score counter + lives system + high score saved to localStorage
- PC: keyboard controls, mobile: touch buttons on canvas, responsive layout
- title screen with game name, control instructions, and press Enter or tap to start
- prompts are written in english

## workflow

1. create directory: `mkdir docs/<game-name>`
2. feed one prompt to Claude Code in that directory
3. do NOT edit the generated code
4. add GA4 tag to the generated index.html (measurement ID: G-BSB5RE2TXH)
5. capture GIF: `node scripts/capture.mjs docs/<game-name>`
6. add entry to README.md gallery (HTML table grid) with GitHub Pages play link
7. add card to docs/index.html
8. update game count in docs/index.html meta tags (og:title, og:description, twitter:title, twitter:description, meta description)
9. regenerate OG image: `node scripts/og-image.mjs`
10. commit + push

## commit style

- english commit messages, playful tone
