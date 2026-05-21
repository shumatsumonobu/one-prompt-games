#!/usr/bin/env node
/**
 * OG image generator for one-prompt-games
 *
 * Screenshots docs/index.html at OG dimensions (1200x630),
 * zooming out the page so all content fits in a single frame.
 * Waits for GIFs to reach gameplay frames before capturing.
 *
 * Usage: node scripts/og-image.mjs
 *
 * @output {file} docs/og-image.png - 1200x630 screenshot
 */

import { chromium } from "playwright";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const INDEX = resolve(ROOT, "docs", "index.html");
const OUT = resolve(ROOT, "docs", "og-image.png");

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const GIF_WAIT_MS = 3500;

async function generate() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.setViewportSize({ width: OG_WIDTH, height: OG_HEIGHT });

  const fileUrl = `file:///${INDEX.replace(/\\/g, "/")}`;
  console.log(`Opening: ${fileUrl}`);
  await page.goto(fileUrl, { waitUntil: "networkidle" });

  // zoom out so full page fits in viewport
  const scrollH = await page.evaluate(() => document.body.scrollHeight);
  const zoom = Math.min(1, OG_HEIGHT / scrollH);
  console.log(`Page height: ${scrollH}px, zoom: ${zoom.toFixed(2)}`);
  await page.evaluate((z) => { document.body.style.zoom = z; }, zoom);
  await page.waitForTimeout(200);

  console.log(`Waiting ${GIF_WAIT_MS}ms for GIFs to reach gameplay...`);
  await new Promise((r) => setTimeout(r, GIF_WAIT_MS));

  await page.screenshot({ path: OUT });
  await browser.close();

  console.log(`Done! ${OUT}`);
}

generate().catch((e) => {
  console.error(e);
  process.exit(1);
});
