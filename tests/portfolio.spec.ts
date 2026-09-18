import { expect, test } from '@playwright/test';

declare global {
  interface Window {
    cameraStreams: MediaStream[];
    releaseCamera: () => void;
  }
}

test('routes support direct links, refresh, and browser history', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByRole('link', { name: 'Projects', exact: true }).click();
  await expect(page).toHaveURL('/projects');
  await expect(page.getByRole('heading', { name: 'UWGitRank' })).toBeVisible();
  await page.getByRole('link', { name: 'Gallery', exact: true }).click();
  await expect(page).toHaveURL('/gallery');
  await expect(page.getByRole('button', { name: /^Open photo:/ }).first()).toHaveCSS('opacity', '1');
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('link', { name: 'Gallery', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(page.locator('header')).toHaveCSS('opacity', '1');
  await page.goBack({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL('/projects');
  await page.goForward({ waitUntil: 'domcontentloaded' });
  await expect(page).toHaveURL('/gallery');
  for (const [path, title] of [['/', 'Brian An'], ['/projects', 'Projects | Brian An'], ['/gallery', 'Gallery | Brian An']]) {
    const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.brianan.ca${path === '/' ? '' : path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});

test('gallery works by keyboard and restores focus after closing', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.getByText('Gallery', { exact: true }).click();
  const thumbnail = page.getByRole('button', { name: 'Open photo: dec 2024 - los angeles', exact: true }).first();
  await expect(thumbnail).toHaveCSS('opacity', '1');
  await thumbnail.focus();
  await expect(thumbnail).toBeFocused();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close photo', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Gallery', exact: true })).not.toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close photo', exact: true })).toBeFocused();
  const src = await dialog.getByRole('img').getAttribute('src');
  expect(src).toContain('/_next/image?');
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(thumbnail).toBeFocused();
  await thumbnail.click();
  await dialog.getByRole('img').click();
  await expect(dialog).toBeVisible();
  await page.getByRole('button', { name: 'Close photo', exact: true }).click();
  await expect(dialog).not.toBeVisible();
  await thumbnail.click();
  await page.getByRole('button', { name: 'Close photo backdrop', exact: true }).click({ position: { x: 5, y: 5 } });
  await expect(dialog).not.toBeVisible();
});

test('social links have accessible names', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  for (const name of ['Email', 'LinkedIn', 'GitHub', 'X']) {
    await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
  }
});

for (const delayed of [false, true]) {
  test(`camera releases capture when closed${delayed ? ' before permission resolves' : ''}`, async ({ page }) => {
    await page.addInitScript((delay) => {
      window.cameraStreams = [];
      const pending: (() => void)[] = [];
      let released = false;
      window.releaseCamera = () => {
        released = true;
        pending.forEach(resolve => resolve());
      };
      const getUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
      navigator.mediaDevices.getUserMedia = async (constraints) => {
        const stream = await getUserMedia(constraints);
        window.cameraStreams.push(stream);
        if (delay && !released) await new Promise<void>((resolve) => { pending.push(resolve); });
        return stream;
      };
    }, delayed);
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await expect(page.locator('header')).toHaveCSS('opacity', '1');
    await page.getByRole('button', { name: 'click me for a surprise' }).click();
    await expect.poll(() => page.evaluate(() => window.cameraStreams.length)).toBeGreaterThan(0);
    if (!delayed) await expect(page.locator('pre')).not.toBeEmpty();
    await page.getByRole('button', { name: /^(✕|Close camera)$/ }).click();
    if (delayed) await page.evaluate(() => window.releaseCamera());
    await expect.poll(() => page.evaluate(() => window.cameraStreams.every(stream => stream.getTracks().every(track => track.readyState === 'ended')))).toBe(true);
  });
}
