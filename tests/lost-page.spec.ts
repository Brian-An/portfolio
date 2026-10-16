import { expect, test } from '@playwright/test';

const snapshot = (page: import('@playwright/test').Page) => page.locator('.wander-canvas').evaluate((canvas: HTMLCanvasElement) => {
  const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
  let hash = 0;
  let ink = 0;
  let trail = 0;
  let blue = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3]) {
      ink++;
      hash = (hash * 31 + i + pixels[i + 3]) | 0;
      if (pixels[i] === 106 && pixels[i + 1] === 134 && pixels[i + 2] === 160) blue++;
      if (pixels[i] === 182 && pixels[i + 1] === 179 && pixels[i + 2] === 167) trail++;
    }
  }
  return { hash, ink, trail, blue };
});

test('lost page has a blue-bag traveler and dotted trail without blocking the home link', async ({ page }) => {
  await page.clock.install();
  const response = await page.goto('/somewhere-unknown');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Looks like you’re lost', exact: true })).toBeVisible();
  await page.clock.runFor(1000);
  const initial = await snapshot(page);
  expect(initial.ink).toBeGreaterThan(0);
  expect(initial.blue).toBeGreaterThan(0);
  await page.clock.runFor(4000);
  const walked = await snapshot(page);
  expect(walked.hash).not.toBe(initial.hash);
  expect(walked.trail).toBeGreaterThan(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.getByRole('link', { name: 'Go back home', exact: true }).click();
  await expect(page).toHaveURL('/');
});

test('reduced motion keeps the traveler still and the home link usable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/lost');
  await page.clock.runFor(50);
  const initial = await snapshot(page);
  expect(initial.ink).toBeGreaterThan(0);
  await page.clock.runFor(4000);
  expect(await snapshot(page)).toEqual(initial);
  await page.getByRole('link', { name: 'Go back home', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
});


test('the traveler starts near the center and stops drawing in a hidden tab', async ({ page }) => {
  await page.clock.install();
  await page.goto('/lost');
  await page.clock.runFor(50);
  const position = await page.locator('.wander-canvas').evaluate((canvas: HTMLCanvasElement) => {
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    let left = canvas.width, right = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] === 255) {
        const x = (i / 4) % canvas.width;
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
    return (left + right) / 2 / canvas.width;
  });
  expect(position).toBeGreaterThan(.4);
  expect(position).toBeLessThan(.6);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const hidden = await snapshot(page);
  await page.clock.runFor(3000);
  expect(await snapshot(page)).toEqual(hidden);
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => false });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.clock.runFor(2000);
  expect((await snapshot(page)).hash).not.toBe(hidden.hash);
});
