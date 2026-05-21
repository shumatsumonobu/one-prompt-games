```
  ___  _  _ ___   ___ ___  ___  __  __ ___ _____
 / _ \| \| | __| | _ \ _ \/ _ \|  \/  | _ \_   _|
| (_) | .` | _|  |  _/   / (_) | |\/| |  _/ | |
 \___/|_|\_|___| |_| |_|_\\___/|_|  |_|_|   |_|

  ___ _   __  __ ___ ___
 / __| |_|  \/  | __/ __|
| (_ | ' \ |\/| | _|\__ \
 \___|_||_|_|  |_|___|___/
```

> 1 prompt. 1 game. no second chances.

**no edits. 1 prompt each.**

every game in this repo was built from a single prompt fed to [Claude Code](https://claude.ai/code). no edits. no follow-ups. no "actually, can you also..." — whatever comes out ships as-is.

**all games are playable in your browser right now** → [play them here](https://shumatsumonobu.github.io/one-prompt-games/)

## the rules

```
> write one prompt.
> feed it to claude code.
> ship whatever comes out.
> touch the code and you're disqualified.
```

that's it. the prompt is the only weapon you get.

## games

<table>
<tr>
<td align="center" valign="top" width="33%">
<h3>space-shooter</h3>
<em>blast through waves of enemies in neon space. survive the boss. chase the high score.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/space-shooter/"><img src="docs/space-shooter/preview.gif" alt="space-shooter" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/space-shooter/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro space shooter with neon-on-black aesthetic, CRT scanlines, and screen glow. Scrolling starfield background. Player ship is a glowing cyan triangle. Arrow keys to move, space to shoot. Enemy waves: straight-line drones, zigzag fighters, V-formation bombers. Power-ups drop from destroyed enemies: spread shot, shield, speed boost. Boss fight after wave 3 with health bar. Score counter, 3 lives, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fullscreen responsive canvas. No external dependencies.</p>
</td>
<td align="center" valign="top" width="33%">
<h3>breakout</h3>
<em>smash neon bricks with a glowing paddle. catch power-ups. clear all 3 levels.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/breakout/"><img src="docs/breakout/preview.gif" alt="breakout" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/breakout/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro breakout/brick-breaker with neon-on-black aesthetic, CRT scanlines, and screen glow. Neon-colored bricks in rows, glowing paddle at bottom, bright ball with trail effect. Arrow keys to move paddle. Power-ups drop from broken bricks: wide paddle, multi-ball, fireball that pierces through bricks. 3 levels with increasing brick layouts. Score counter, 3 lives, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. No external dependencies.</p>
</td>
<td align="center" valign="top" width="33%">
<h3>snake</h3>
<em>eat, grow, don't hit yourself. classic snake with bonus food and speed levels.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/snake/"><img src="docs/snake/preview.gif" alt="snake" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/snake/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro snake game with green-on-black terminal aesthetic, CRT scanlines, and screen glow. Arrow keys to move. Snake is bright green segments on a dark grid. Normal food glows green, bonus food appears randomly in gold for extra points and fades after 5 seconds. Snake speeds up every 5 food eaten. Speed level display on screen. Wall collision and self-collision mean death. Score counter, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. No external dependencies.</p>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<h3>asteroid-dodge</h3>
<em>no weapons. just reflexes. dodge falling asteroids as long as you can.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/asteroid-dodge/"><img src="docs/asteroid-dodge/preview.gif" alt="asteroid-dodge" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/asteroid-dodge/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro asteroid dodger with neon-on-black aesthetic, CRT scanlines, and screen glow. Ship at bottom, asteroids fall from top in random sizes and speeds. Arrow keys to move, no shooting — pure dodge. Speed increases over time. Near-miss bonus points when asteroids pass close. Particle explosion when hit. Score counter based on survival time, 3 lives, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. No external dependencies.</p>
</td>
<td align="center" valign="top" width="33%">
<h3>memory-matrix</h3>
<em>watch the pattern. tap from memory. grids get bigger. your confidence doesn't.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/memory-matrix/"><img src="docs/memory-matrix/preview.gif" alt="memory-matrix" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/memory-matrix/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro memory matrix game with cyan-on-black terminal aesthetic, CRT scanlines, and screen glow. Grid of cells that flash a pattern, player must click cells from memory. Starts 3x3 with 3 cells lit, grows to 4x4 then 5x5 with more cells each level. Pattern shows for 2 seconds then hides. Wrong click = lose a life, correct sequence = next round. Score counter, 3 lives, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. START button on title screen. No external dependencies.</p>
</td>
<td align="center" valign="top" width="33%">
<h3>rhythm-tap</h3>
<em>notes fall. arrows flash. hit the beat or lose it all.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/rhythm-tap/"><img src="docs/rhythm-tap/preview.gif" alt="rhythm-tap" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/rhythm-tap/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro rhythm tap game with neon-on-black aesthetic, CRT scanlines, and screen glow. 4 lanes with falling notes, each mapped to arrow keys (Left/Down/Up/Right). Notes fall from top to hit zone at bottom. Only one note falls at a time, never simultaneous notes in multiple lanes. Perfect/Good/Miss judgement with visual feedback. Combo counter and multiplier. Patterns are auto-generated and loop. Speed increases every 30 seconds. Glowing hit effects and particle bursts on perfect hits. Score counter, 3 lives (miss = lose life), high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. Title screen with game name, press Enter to start. No external dependencies.</p>
</td>
</tr>
<tr>
<td align="center" valign="top" width="33%">
<h3>tetris</h3>
<em>stack blocks. clear lines. lose a life when you top out. classic falling-piece puzzle.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/tetris/"><img src="docs/tetris/preview.gif" alt="tetris" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/tetris/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro Tetris clone with neon-on-black aesthetic, CRT scanlines, and screen glow. Classic 10x20 grid. 7 standard tetrominoes (I, O, T, S, Z, J, L) in distinct neon colors. Arrow keys to move left/right/down, Up to rotate, Space for hard drop. Ghost piece showing where the block will land. Next piece preview. Line clear animation with flash effect. Scoring: 1 line = 100, 2 = 300, 3 = 500, 4 (Tetris) = 800, multiplied by level. Speed increases every 10 lines cleared. 3 lives — topping out costs a life and partially clears the board to continue. Game over when all lives are lost. Score counter, level display, lines cleared counter, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. Title screen with game name, press Enter to start. No external dependencies.</p>
</td>
<td align="center" valign="top" width="33%">
<h3>platformer</h3>
<em>run, jump, stomp. neon city scrolls by as you chase coins and dodge enemies.</em>
<br><br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/platformer/"><img src="docs/platformer/preview.gif" alt="platformer" width="100%"></a>
<br>
<a href="https://shumatsumonobu.github.io/one-prompt-games/platformer/">▶ Play</a>
<br><br>
<strong>the prompt:</strong>
<p>Build a single-file browser game (HTML/CSS/JS). A retro side-scrolling platformer with neon-on-black aesthetic, CRT scanlines, and screen glow. Player is a glowing cyan character that runs and jumps through procedurally generated levels. Arrow keys to move left/right, Space to jump. Scrolling camera follows the player. Platforms at varying heights with gaps to jump across — gaps never wider than the player's max jump distance so all layouts are beatable. Enemies patrol platforms and can be stomped from above for points, but touching them from the side costs a life. Collectible coins floating above platforms for bonus score. Speed gradually increases as the player progresses. Parallax scrolling background with distant neon city silhouette. Particle effects on jump, stomp, and coin pickup. Score counter, 3 lives, high score saved to localStorage. 8-bit sound effects via Web Audio API. Fixed 4:3 canvas, centered on screen. Title screen with game name, control instructions (Arrow keys: move, Space: jump, stomp enemies from above), and press Enter to start. No external dependencies.</p>
</td>
<td align="center" valign="top" width="33%">
</td>
</tr>
</table>

---

built with [Claude Code](https://claude.ai/code) (Opus 4.6) and zero regrets by [@shumatsumonobu](https://github.com/shumatsumonobu) / [X](https://x.com/shumatsumonobu)
