#!/usr/bin/env node
/**
 * Promo GIF generator for one-prompt-games
 *
 * Records docs/index.html with all game GIFs playing simultaneously,
 * zoomed out to fit the full page, and outputs an animated GIF.
 *
 * Usage: node scripts/promo.mjs
 *
 * @output {file} docs/promo.gif - animated GIF (1200x630, 10fps, 6sec)
 */

import { chromium } from "playwright";
import sharp from "sharp";
import GIF from "sharp-gif2";
import { existsSync, mkdirSync, rmSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { readdir } from "fs/promises";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const INDEX = resolve(ROOT, "docs", "index.html");
const TMP_DIR = resolve(ROOT, "docs", ".frames");
const OUT = resolve(ROOT, "docs", "promo.gif");

const WIDTH = 1200;
const HEIGHT = 630;
const FPS = 10;
const FRAME_INTERVAL = 1000 / FPS;
const DURATION_SEC = 6;
const TOTAL_FRAMES = DURATION_SEC * FPS;
const GIF_WAIT_MS = 3000;

function waitFor(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function generate() {
  if (existsSync(TMP_DIR)) rmSync(TMP_DIR, { recursive: true });
  mkdirSync(TMP_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: WIDTH, height: HEIGHT });

  const fileUrl = `file:///${INDEX.replace(/\\/g, "/")}`;
  console.log(`Opening: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: "networkidle" });

  // zoom out to fit full page
  const scrollH = await page.evaluate(() => document.body.scrollHeight);
  const zoom = Math.min(1, HEIGHT / scrollH);
  console.log(`Page height: ${scrollH}px, zoom: ${zoom.toFixed(2)}`);
  await page.evaluate((z) => { document.body.style.zoom = z; }, zoom);

  // wait for GIFs to reach gameplay
  console.log(`Waiting ${GIF_WAIT_MS}ms for GIFs to start...`);
  await waitFor(GIF_WAIT_MS);

  console.log(`Capturing ${TOTAL_FRAMES} frames...`);
  const startTime = Date.now();

  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const framePath = resolve(TMP_DIR, `frame-${String(i).padStart(4, "0")}.png`);
    await page.screenshot({ path: framePath });

    const nextTime = startTime + (i + 1) * FRAME_INTERVAL;
    const now = Date.now();
    if (nextTime > now) await waitFor(nextTime - now);
  }

  await browser.close();

  console.log("Assembling GIF...");
  const files = (await readdir(TMP_DIR))
    .filter((f) => f.endsWith(".png"))
    .sort()
    .map((f) => resolve(TMP_DIR, f));

  const frames = files.map((f) => sharp(f).resize(WIDTH, HEIGHT));

  const gif = GIF.createGif({ delay: Math.round(FRAME_INTERVAL), repeat: 0 });
  gif.addFrame(frames);
  const output = await gif.toSharp();
  await output.toFile(OUT);

  rmSync(TMP_DIR, { recursive: true });
  console.log(`Done! ${OUT}`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
