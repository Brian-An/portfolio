import { expect, test } from '@playwright/test';

test('home uses Geist with only the requested content', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Brian An', exact: true })).toBeVisible();
  await expect(page.getByText('CS + Finance at', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Work', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Projects', exact: true })).toBeVisible();
  await expect(page.locator('header')).toHaveCount(0);
  await expect(page.getByText(/Selected projects|A FEW THINGS|Ideas turned|ALONG THE WAY/)).toHaveCount(0);
  await expect(page.locator('body')).toHaveCSS('font-family', /Geist/);
  expect(await page.locator('main').innerText()).not.toMatch(/[↗→]/);
  await expect(page.locator('.project-description')).toHaveCount(0);
});

test('portrait opens rounded photos inside its surrounding region', async ({ page, isMobile }) => {
  await page.goto('/');
  const portrait = page.getByRole('link', { name: 'Explore the photo gallery' });
  await expect(page.getByRole('img', { name: 'A cartoon portrait of Brian made of dots' })).toBeVisible();
  if (isMobile) await portrait.focus();
  else await portrait.hover();
  const photo = page.locator('.floating-photo').first();
  await expect(photo).toHaveCSS('opacity', '1');
  await expect(photo.locator('img')).toHaveCSS('border-radius', '16px');
  const portraitBounds = await portrait.boundingBox();
  const cards = await page.locator('.floating-photo').all();
  expect(cards.length).toBeGreaterThanOrEqual(6);
  await expect.poll(async () => {
    let outside = 0;
    for (const card of cards) {
      const bounds = await card.boundingBox();
      if (bounds!.x < portraitBounds!.x || bounds!.x + bounds!.width > portraitBounds!.x + portraitBounds!.width) outside++;
    }
    return outside;
  }).toBeGreaterThanOrEqual(3);
  for (const card of cards) {
    const bounds = await card.boundingBox();
    expect(bounds!.x).toBeGreaterThan(portraitBounds!.x - portraitBounds!.width * .35);
    expect(bounds!.x + bounds!.width).toBeLessThan(portraitBounds!.x + portraitBounds!.width * 1.35);
  }
  await page.keyboard.press('Escape');
  await expect(photo).toHaveCSS('opacity', '0');
  await portrait.click();
  await expect(page).toHaveURL('/photography');
});

test('experience previews load and stay inside the viewport', async ({ page }) => {
  await page.goto('/');
  for (const name of ['UWaterloo', 'AXL', 'Rogers', 'TouchBistro', 'UW Data Science Club']) {
    const link = page.getByRole('link', { name, exact: true });
    await link.focus();
    const preview = link.locator('..').getByRole('img');
    await expect(preview).toBeVisible();
    await expect.poll(() => preview.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
    const bounds = await preview.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    await page.keyboard.press('Escape');
    await expect(preview).not.toBeVisible();
  }
});

test('gallery captions include place and date', async ({ page, isMobile }) => {
  await page.goto('/photography');
  const photo = page.getByRole('button', { name: /^Open photo:/ }).first();
  if (!isMobile) await photo.hover();
  await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible();
  await expect(photo.locator('.photo-caption')).toHaveText('Dec 2024 · Los Angeles');
  await expect(photo.locator('.photo-caption')).toHaveCSS('opacity', '1');
  await expect(photo.getByText('Along the coast')).toHaveCount(0);
  await photo.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('dialog').getByText('Dec 2024 · Los Angeles', { exact: true })).toBeVisible();
});

test('gallery reserves each photo’s natural proportions before loading', async ({ page }) => {
  await page.route('**/_next/image?*', route => route.abort());
  await page.goto('/photography');
  const box = await page.getByRole('button', { name: /^Open photo:/ }).first().getByRole('img').boundingBox();
  expect(box!.width / box!.height).toBeCloseTo(0.75, 2);
});

test('every gallery photo loads when scrolled into view', async ({ page }) => {
  await page.goto('/photography');
  for (const photo of await page.getByRole('button', { name: /^Open photo:/ }).all()) {
    await photo.scrollIntoViewIfNeeded();
    await expect.poll(() => photo.getByRole('img').evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  }
});

test('touch tablets offer a plain photography link', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Requires a touch device.');
  await page.setViewportSize({ width: 820, height: 1180 });
  await page.goto('/');
  const photography = page.getByRole('link', { name: 'View Photography', exact: true });
  await expect(photography).toHaveCSS('opacity', '1');
  await expect(photography).toHaveCSS('text-decoration-line', 'none');
  await expect(page.getByRole('button', { name: 'Preview photos' })).toHaveCount(0);
  await photography.click();
  await expect(page).toHaveURL('/photography');
});

test('reduced motion supports preview and restoration', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the photo gallery' }).focus();
  const photo = page.locator('.floating-photo').first();
  await expect(photo).toHaveCSS('opacity', '1');
  await expect(photo.locator('.floating-photo-motion')).toHaveCSS('animation-name', 'none');
  await page.keyboard.press('Escape');
  await expect(photo).toHaveCSS('opacity', '0');
});

test('closed previews do not widen the mobile page', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
});

test('cartoon dots leave the portrait background transparent', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.portrait-fallback')).toHaveCount(0);
  const pixels = await page.locator('.portrait-canvas').evaluate((canvas: HTMLCanvasElement) => {
    const context = canvas.getContext('2d')!;
    const background = context.getImageData(0, 0, canvas.width / 10, canvas.height / 10).data;
    const portrait = context.getImageData(0, 0, canvas.width, canvas.height).data;
    return {
      backgroundIsClear: !background.some((value, index) => index % 4 === 3 && value > 0),
      portraitHasDots: portrait.some((value, index) => index % 4 === 3 && value > 0),
    };
  });
  expect(pixels).toEqual({ backgroundIsClear: true, portraitHasDots: true });
});

test('focus can move between floating photo cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the photo gallery' }).focus();
  const cards = page.locator('.floating-photo');
  await expect(cards.first()).toHaveCSS('opacity', '1');
  await cards.first().focus();
  await page.keyboard.press('Tab');
  await expect(cards.nth(1)).toBeFocused();
  await expect(cards.nth(1)).toHaveCSS('opacity', '1');
  await page.keyboard.press('Escape');
  await expect(cards.nth(1)).toHaveCSS('opacity', '0');
  await expect(page.getByRole('link', { name: 'Explore the photo gallery' })).toBeFocused();
});

test('home shows three projects and links to the complete list', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.project-list a')).toHaveCount(3);
  await page.getByRole('link', { name: 'More projects', exact: true }).click();
  await expect(page).toHaveURL('/projects');
  await expect(page.locator('.project-list a')).toHaveCount(8);
});

test('experience preview sits to the right of the work list', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Phone previews use the space above or below the list.');
  await page.goto('/');
  await page.getByRole('link', { name: 'Rogers', exact: true }).focus();
  const preview = await page.getByRole('img', { name: 'Rogers Communications website preview' }).boundingBox();
  const rightmostLink = await page.locator('.work-list .inline-link').evaluateAll(links => Math.max(...links.map(link => link.getBoundingClientRect().right)));
  expect(preview!.x).toBeGreaterThan(rightmostLink);
});

test('photos close when the pointer leaves the portrait region', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Touch previews use a toggle.');
  await page.goto('/');
  await page.getByRole('link', { name: 'Explore the photo gallery' }).hover();
  await expect(page.locator('.floating-photo').first()).toHaveCSS('opacity', '1');
  await page.getByRole('heading', { name: 'Brian An', exact: true }).hover();
  await expect(page.locator('.floating-photo').first()).toHaveCSS('opacity', '0', { timeout: 1500 });
});

test('dots fade out and reconstruct their exact face positions', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.portrait-fallback')).toHaveCount(0);
  const canvas = page.locator('.portrait-canvas');
  const sample = () => canvas.evaluate((element: HTMLCanvasElement) => {
    const pixels = element.getContext('2d')!.getImageData(0, 0, element.width, element.height).data;
    let sum = 0;
    let hash = 0;
    for (let i = 3; i < pixels.length; i += 4) {
      sum += pixels[i];
      hash = (hash * 31 + pixels[i]) | 0;
    }
    return { sum, hash };
  });
  const face = await sample();
  await page.getByRole('link', { name: 'Explore the photo gallery' }).focus();
  const exploded = await sample();
  expect(exploded.sum).toBe(0);
  await page.keyboard.press('Escape');
  expect(await sample()).toEqual(face);
});

test('gallery photos grow slightly before revealing the short caption', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Touch layouts keep captions visible.');
  await page.goto('/photography');
  const photo = page.getByRole('button', { name: /^Open photo:/ }).first();
  const image = photo.locator('.gallery-image');
  const initial = await image.boundingBox();
  await expect(photo.locator('.photo-caption')).toHaveCSS('opacity', '0');
  await photo.hover();
  await expect.poll(async () => (await image.boundingBox())!.width).toBeGreaterThan(initial!.width * 1.01);
  await expect(photo.locator('.photo-caption')).toHaveCSS('opacity', '1');
  await expect(photo.locator('.photo-caption')).toHaveText('Dec 2024 · Los Angeles');
});

test('particle paths respond to the pointer entry position', async ({ page }) => {
  await page.clock.install({ time: new Date('2026-10-15T12:00:00Z') });
  await page.goto('/');
  await expect(page.locator('.portrait-fallback')).toHaveCount(0);
  await page.mouse.move(0, 0);
  await page.clock.pauseAt(new Date('2026-10-15T12:01:00Z'));
  const stage = (await page.locator('.portrait-stage').boundingBox())!;
  const sample = () => page.locator('.portrait-canvas').evaluate((canvas: HTMLCanvasElement) => {
    const pixels = canvas.getContext('2d')!.getImageData(0, 0, canvas.width, canvas.height).data;
    let hash = 0;
    for (let i = 3; i < pixels.length; i += 4) hash = (hash * 31 + pixels[i]) | 0;
    return hash;
  });
  await page.mouse.move(stage.x + 5, stage.y + stage.height / 2);
  await page.clock.runFor(250);
  const fromLeft = await sample();
  await page.mouse.move(0, 0);
  await page.clock.runFor(1000);
  await page.mouse.move(stage.x + stage.width - 5, stage.y + stage.height / 2);
  await page.clock.runFor(250);
  expect(await sample()).not.toBe(fromLeft);
});

test('profile socials sit below both columns at the container’s left edge', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Brian An', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'UWaterloo', exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Instagram', exact: true })).toHaveAttribute('href', 'https://www.instagram.com/hibrianan');
  const content = (await page.locator('.intro').boundingBox())!;
  const socials = (await page.locator('.social-links').boundingBox())!;
  expect(socials.y).toBeGreaterThanOrEqual(content.y + content.height);
  expect(socials.x).toBeCloseTo(content.x, 0);
  await expect(page.getByRole('link', { name: 'More projects', exact: true }).locator('svg')).toBeVisible();
  await expect(page.getByRole('link', { name: 'More projects', exact: true })).toHaveCSS('border-top-width', '0px');
});

test('portrait uses saved dots without exposing source images', async ({ page, request }) => {
  const portraitRequests: string[] = [];
  page.on('request', req => {
    if (/headshot\.png|portrait-cartoon\.png/.test(decodeURIComponent(req.url()))) portraitRequests.push(req.url());
  });
  await page.goto('/');
  await expect(page.locator('.portrait-fallback')).toHaveCount(0);
  await expect(page.getByRole('link', { name: 'View Photography', exact: true })).toBeVisible();
  expect(portraitRequests).toEqual([]);
  for (const source of ['/headshot.png', '/portrait-cartoon.png']) {
    expect((await request.get(source)).status()).toBe(404);
    expect((await request.get(`/_next/image?url=${encodeURIComponent(source)}&w=640&q=75`)).status()).toBe(400);
  }
});

test.describe('portrait without JavaScript', () => {
  test.use({ javaScriptEnabled: false });
  test('keeps a dot portrait and native photography link', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('svg.portrait-fallback')).toBeVisible();
    expect(await page.locator('svg.portrait-fallback path').count()).toBeGreaterThan(0);
    await page.getByRole('link', { name: 'Explore the photo gallery' }).hover();
    const photography = page.getByRole('link', { name: 'View Photography', exact: true });
    await expect(photography).toHaveCSS('opacity', '1');
    await photography.click();
    await expect(page.getByRole('heading', { name: 'Photography', exact: true })).toBeVisible();
  });
});


test('photography hint animates on desktop hover and keyboard focus', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Touch devices keep the link visible.');
  await page.goto('/');
  const hint = page.getByRole('link', { name: 'View Photography', exact: true });
  await expect(hint).toHaveCSS('opacity', '0');
  await page.locator('.portrait-link').hover();
  await expect(hint).toHaveCSS('opacity', '1');
  await page.mouse.move(0, 0);
  await expect(hint).toHaveCSS('opacity', '0');
  await page.locator('.portrait-link').focus();
  await expect(hint).toHaveCSS('opacity', '1');
});

test('Golden Gate photos share the correct dates across captions and lightbox', async ({ page }) => {
  await page.goto('/photography');
  for (const [filename, date] of [['goldengate2.jpg', 'Oct 2025'], ['goldgate.jpg', 'Dec 2024']]) {
    const photo = page.locator('.gallery-photo').filter({ has: page.locator(`img[src*="${filename}"]`) });
    await photo.focus();
    await expect(photo.locator('.photo-caption')).toHaveText(`${date} · San Francisco`);
    await expect(photo).toHaveAccessibleName(`Open photo: San Francisco, ${date}`);
    await photo.click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('img')).toHaveAttribute('alt', `San Francisco, ${date}`);
    await expect(dialog.locator('#photo-caption')).toHaveText(`${date} · San Francisco`);
    await page.keyboard.press('Escape');
  }
});

test('missing pages provide a keyboard-accessible route home', async ({ page }) => {
  const response = await page.goto('/missing-page');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  const home = page.getByRole('link', { name: 'Go Back Home' });
  await home.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { name: 'Brian An', exact: true })).toBeVisible();
});
