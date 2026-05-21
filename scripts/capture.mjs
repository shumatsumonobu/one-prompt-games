#!/usr/bin/env node
/**
 * GIF capture for one-prompt-games
 *
 * Opens a game in headless Chromium via Playwright, simulates keyboard input
 * to play the game, captures screenshots at 10 FPS, and assembles them into
 * a preview GIF using sharp-gif2.
 *
 * Usage: node scripts/capture.mjs <game-dir> [--start <action>] [--play <mode>]
 *
 * --start <action>  How to start the game (default: Enter + Space)
 *   key:<KeyName>     press a key to start         e.g. key:ArrowRight
 *   click:<selector>  click an element to start     e.g. click:#start-btn
 *
 * --play <mode>  How to simulate gameplay (default: hold mode with arrows + Space)
 *   hold:<keys>[+<action>[:<N>]]  hold/cycle keys, optionally press action key every N frames (default: 2)
 *                             N=0 means hold the action key down continuously
 *                             N<0 means hold for |N| frames then release for 1 frame, repeat
 *                             e.g. hold:ArrowLeft,ArrowRight,ArrowUp,ArrowDown+Space
 *                             e.g. hold:ArrowRight+Space:5 (jump every 5 frames)
 *                             e.g. hold:ArrowRight+Space:0 (hold space down)
 *                             e.g. hold:ArrowLeft,ArrowRight (no action key)
 *   tap:<keys>:<ms>           press a random key at interval
 *                             e.g. tap:ArrowLeft,ArrowDown,ArrowUp,ArrowRight:200
 *   sequence:<keys>:<ms>      press keys in order, looping
 *                             e.g. sequence:ArrowRight,ArrowRight,ArrowUp,Space:400
 *   click:<selector>:<ms>     click a random matching element at interval
 *                             e.g. click:.cell:500
 *
 * @example
 *   node scripts/capture.mjs space-shooter
 *   node scripts/capture.mjs snake --start key:ArrowRight
 *   node scripts/capture.mjs memory-matrix --start click:#start-btn --play click:.cell:500
 *   node scripts/capture.mjs rhythm-tap --play tap:ArrowLeft,ArrowDown,ArrowUp,ArrowRight:200
 *
 * @output {file} <game-dir>/preview.gif - animated GIF (800x600, 10fps, 10sec)
 *
 * @requires commander - CLI argument parsing
 * @requires playwright - headless browser automation
 * @requires sharp - image processing
 * @requires sharp-gif2 - animated GIF assembly from sharp frames
 */

import { Command } from "commander";
import { chromium } from "playwright";
import sharp from "sharp";
import GIF from "sharp-gif2";
import { existsSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const program = new Command();
program
  .name("capture")
  .description("Capture animated GIF preview for a game")
  .argument("<game-dir>", "game directory containing index.html")
  .option("--start <action>", "how to start (key:<KeyName> | click:<selector>, default: Enter+Space)")
  .option("--play <mode>", "gameplay input (hold:<keys>[+<action>] | tap:<keys>:<ms> | sequence:<keys>:<ms> | click:<selector>:<ms>, default: hold:ArrowLeft,ArrowRight,ArrowUp,ArrowDown+Space)")
  .parse();

const gameDir = program.args[0];
const { start, play } = program.opts();

const gamePath = resolve(ROOT, gameDir, "index.html");
if (!existsSync(gamePath)) {
  console.error(`Not found: ${gamePath}`);
  process.exit(1);
}

const TMP_DIR = resolve(ROOT, gameDir, ".frames");
const OUT_GIF = resolve(ROOT, gameDir, "preview.gif");
const WIDTH = 800;
const HEIGHT = 600;
const FPS = 10;
const FRAME_INTERVAL = 1000 / FPS;
const DURATION_SEC = 10;
const TOTAL_FRAMES = DURATION_SEC * FPS;
const OPENING_FRAMES = 20;

if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true });
mkdirSync(TMP_DIR, { recursive: true });

function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Parse --play option into a structured play mode.
 *
 *   hold:<keys>[+<action>]  → { type: "hold", keys: [...], action: "Space"|null }
 *   tap:<keys>:<ms>         → { type: "tap", keys: [...], interval: N }
 *   click:<selector>:<ms>   → { type: "click", selector: "...", interval: N }
 *
 * Default (null): hold:ArrowLeft,ArrowRight,ArrowUp,ArrowDown+Space
 */
function parsePlayMode(playOpt) {
  if (!playOpt) {
    return {
      type: "hold",
      keys: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"],
      action: "Space",
      actionInterval: 2,
    };
  }
  if (playOpt.startsWith("hold:")) {
    const rest = playOpt.slice(5);
    const plusIdx = rest.indexOf("+");
    if (plusIdx === -1) {
      return { type: "hold", keys: rest.split(","), action: null, actionInterval: 2 };
    }
    const afterPlus = rest.slice(plusIdx + 1);
    const colonIdx = afterPlus.indexOf(":");
    if (colonIdx === -1) {
      return { type: "hold", keys: rest.slice(0, plusIdx).split(","), action: afterPlus, actionInterval: 2 };
    }
    return {
      type: "hold",
      keys: rest.slice(0, plusIdx).split(","),
      action: afterPlus.slice(0, colonIdx),
      actionInterval: parseInt(afterPlus.slice(colonIdx + 1), 10),
    };
  }
  if (playOpt.startsWith("tap:")) {
    const rest = playOpt.slice(4);
    const lastColon = rest.lastIndexOf(":");
    if (lastColon === -1) return null;
    return {
      type: "tap",
      keys: rest.slice(0, lastColon).split(","),
      interval: parseInt(rest.slice(lastColon + 1), 10),
    };
  }
  if (playOpt.startsWith("sequence:")) {
    const rest = playOpt.slice(9);
    const lastColon = rest.lastIndexOf(":");
    if (lastColon === -1) return null;
    return {
      type: "sequence",
      keys: rest.slice(0, lastColon).split(","),
      interval: parseInt(rest.slice(lastColon + 1), 10),
    };
  }
  if (playOpt.startsWith("click:")) {
    const rest = playOpt.slice(6);
    const lastColon = rest.lastIndexOf(":");
    if (lastColon === -1) return null;
    return {
      type: "click",
      selector: rest.slice(0, lastColon),
      interval: parseInt(rest.slice(lastColon + 1), 10),
    };
  }
  return null;
}

async function capture() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  const fileUrl = `file:///${gamePath.replace(/\\/g, "/")}`;
  console.log(`Opening: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: "networkidle" });
  await waitFor(1000);

  console.log("Capturing opening screen...");
  const startTime = Date.now();

  const playMode = parsePlayMode(play);
  let lastPlayTime = 0;
  let currentHoldKey = null;

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    if (i === OPENING_FRAMES) {
      console.log("Starting gameplay...");
      if (start?.startsWith("click:")) {
        await page.click(start.slice(6));
      } else if (start?.startsWith("key:")) {
        await page.click("body");
        await page.keyboard.press(start.slice(4));
      } else {
        await page.click("body");
        await page.keyboard.press("Enter");
        await page.keyboard.press("Space");
      }
    }

    if (i > OPENING_FRAMES && playMode) {
      if (playMode.type === "hold") {
        const segmentLen = Math.floor(80 / playMode.keys.length);
        const keyIdx = Math.min(
          Math.floor((i - OPENING_FRAMES - 1) / segmentLen),
          playMode.keys.length - 1
        );
        const targetKey = playMode.keys[keyIdx];

        if (currentHoldKey !== targetKey) {
          if (currentHoldKey) await page.keyboard.up(currentHoldKey);
          await page.keyboard.down(targetKey);
          currentHoldKey = targetKey;
        }
        if (playMode.action) {
          if (playMode.actionInterval === 0) {
            if (!playMode._actionHeld) {
              await page.keyboard.down(playMode.action);
              playMode._actionHeld = true;
            }
          } else if (playMode.actionInterval < 0) {
            const cycle = Math.abs(playMode.actionInterval) + 1;
            const phase = (i - OPENING_FRAMES - 1) % cycle;
            if (phase === 0) {
              await page.keyboard.down(playMode.action);
            } else if (phase === Math.abs(playMode.actionInterval)) {
              await page.keyboard.up(playMode.action);
            }
          } else if (i % playMode.actionInterval === 0) {
            await page.keyboard.press(playMode.action);
          }
        }
      } else if (playMode.type === "tap") {
        const now = Date.now();
        if (now - lastPlayTime >= playMode.interval) {
          const key = playMode.keys[Math.floor(Math.random() * playMode.keys.length)];
          await page.keyboard.press(key);
          lastPlayTime = now;
        }
      } else if (playMode.type === "sequence") {
        const now = Date.now();
        if (now - lastPlayTime >= playMode.interval) {
          if (!playMode._idx) playMode._idx = 0;
          await page.keyboard.press(playMode.keys[playMode._idx % playMode.keys.length]);
          playMode._idx++;
          lastPlayTime = now;
        }
      } else if (playMode.type === "click") {
        const now = Date.now();
        if (now - lastPlayTime >= playMode.interval) {
          const els = await page.$$(playMode.selector);
          if (els.length > 0) {
            const target = els[Math.floor(Math.random() * els.length)];
            await target.click({ force: true, timeout: 500 }).catch(() => {});
          }
          lastPlayTime = now;
        }
      }
    }

    const framePath = resolve(TMP_DIR, `frame-${String(i).padStart(4, "0")}.png`);
    await page.screenshot({ path: framePath });

    const nextTime = startTime + (i + 1) * FRAME_INTERVAL;
    const now = Date.now();
    if (nextTime > now) await waitFor(nextTime - now);
  }

  if (currentHoldKey) await page.keyboard.up(currentHoldKey);
  await browser.close();

  console.log(`Captured ${TOTAL_FRAMES} frames`);
  console.log("Assembling GIF...");

  const files = (await readdir(TMP_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => resolve(TMP_DIR, f));

  const frames = files.map((f) => sharp(f).resize(WIDTH, HEIGHT));

  const gif = GIF.createGif({ delay: Math.round(FRAME_INTERVAL), repeat: 0 });
  gif.addFrame(frames);
  const output = await gif.toSharp();
  await output.toFile(OUT_GIF);

  rmSync(TMP_DIR, { recursive: true });
  console.log(`Done! ${OUT_GIF}`);
}

capture().catch((e) => {
  console.error(e);
  process.exit(1);
});
