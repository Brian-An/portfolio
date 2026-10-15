import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve, extname } from 'node:path';
import { chromium } from '@playwright/test';

// Run manually with a transparent cutout: node scripts/generate-portrait-dots.mjs [input.png] [output.json]
const input = resolve(process.argv[2] ?? '.portrait-source/portrait-cartoon.png');
const output = resolve(process.argv[3] ?? 'constants/portrait-dots.json');
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp' }[extname(input).toLowerCase()];
if (!mime) throw new Error('Portrait input must be PNG, JPEG, or WebP.');
const data = await readFile(input);
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  const dots = await page.evaluate(async source => {
    const image = new Image();
    image.src = source;
    await image.decode();
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 100;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable.');
    context.drawImage(image, 0, 0, 100, 100);
    const pixels = context.getImageData(0, 0, 100, 100).data;
    const result = [];
    for (let y = 0; y < 100; y++) {
      for (let x = 0; x < 100; x++) {
        const i = (y * 100 + x) * 4;
        const darkness = 1 - (pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722) / 255;
        if (pixels[i + 3] < 128 || darkness < .04) continue;
        result.push([x, y, Math.round(darkness * 31)]);
      }
    }
    return result;
  }, `data:${mime};base64,${data.toString('base64')}`);
  if (!dots.length) throw new Error('Portrait contains no visible dots.');
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, JSON.stringify(dots) + '\n');
  console.log(`Saved ${dots.length} dots to ${output}`);
} finally {
  await browser.close();
}
