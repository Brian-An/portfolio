import { expect, test } from '@playwright/test';

test('routes support direct links, refresh, and browser history', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the photo gallery' }).click();
  await expect(page).toHaveURL('/photography');
  await page.reload();
  await expect(page.getByRole('button', { name: /^Open photo:/ }).first()).toBeVisible();
  await page.getByRole('link', { name: 'Back', exact: true }).click();
  await expect(page).toHaveURL('/');
  await page.goBack();
  await expect(page).toHaveURL('/photography');
  await page.goForward();
  await expect(page).toHaveURL('/');
  for (const [path, title] of [['/', 'Brian An'], ['/projects', 'Projects | Brian An'], ['/photography', 'Photography | Brian An']]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.brianan.ca${path === '/' ? '' : path}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  }
});

test('gallery works by keyboard and restores focus after closing', async ({ page }) => {
  await page.goto('/photography');
  const thumbnail = page.getByRole('button', { name: 'Open photo: Los Angeles, Dec 2024', exact: true }).first();
  await thumbnail.focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close photo', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Close photo', exact: true })).toBeFocused();
  expect(await dialog.getByRole('img').getAttribute('src')).toContain('/_next/image?');
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
  await page.goto('/');
  for (const name of ['Email', 'LinkedIn', 'GitHub', 'Instagram', 'X']) await expect(page.getByRole('link', { name, exact: true })).toBeVisible();
});


test('photography replaces the gallery route in navigation and sitemap', async ({ page, request }) => {
  const response = await request.get('/gallery', { maxRedirects: 0 });
  expect(response.status()).toBe(404);
  await page.goto('/photography');
  await expect(page).toHaveURL('/photography');
  await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible();
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).toContain('https://www.brianan.ca/photography');
  expect(sitemap).not.toContain('https://www.brianan.ca/gallery');
});
