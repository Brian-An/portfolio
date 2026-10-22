import { expect, test } from '@playwright/test';

const api = 'https://github-contributions-api.jogruber.de/v4/Brian-An?y=last';
const contributions = Array.from({ length: 370 }, (_, index) => ({
  date: new Date(Date.UTC(2025, 9, 12 + index)).toISOString().slice(0, 10),
  count: index === 0 ? 3 : index === 1 ? 12 : 0,
  level: index === 0 ? 1 : index === 1 ? 4 : 0,
}));

test('projects show a themed contribution calendar with accurate dates and totals', async ({ page }) => {
  await page.route(api, route => route.fulfill({ json: { total: { lastYear: 15 }, contributions } }));
  await page.goto('/projects');
  const section = page.getByRole('region', { name: 'Contributions' });
  await expect(section.getByText('15 contributions in the last year', { exact: true })).toBeVisible();
  await expect(section.getByRole('img', { name: /GitHub contributions/ })).toBeVisible();
  const chart = section.getByRole('img');
  await expect(chart.locator('rect[data-level]')).toHaveCount(370);
  await expect(chart.locator('rect[data-level="1"]').first().locator('title')).toHaveText('3 contributions on October 12, 2025');
  await expect(chart.locator('rect[data-level="4"]').first().locator('title')).toHaveText('12 contributions on October 13, 2025');
  await expect(chart.locator('rect[data-level="0"]').first().locator('title')).toHaveText('No contributions on October 14, 2025');
  const projects = (await page.locator('.project-list').boundingBox())!;
  expect((await section.boundingBox())!.y).toBeGreaterThan(projects.y + projects.height);
  await expect(section.getByRole('link', { name: 'Contributions', exact: true })).toHaveAttribute('href', 'https://github.com/Brian-An');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Contributions' })).toHaveCount(0);
});

for (const failure of ['unavailable', 'malformed', 'empty'] as const) {
  test(`contribution calendar keeps a useful fallback when data is ${failure}`, async ({ page }) => {
    await page.route(api, route => route.fulfill(failure === 'unavailable'
      ? { status: 503, json: { error: 'Unavailable' } }
      : { json: { contributions: failure === 'empty' ? [] : [{ date: 'bad', count: -1, level: 99 }] } }));
    await page.goto('/projects');
    const section = page.getByRole('region', { name: 'Contributions' });
    await expect(section.getByText('Activity is temporarily unavailable.')).toBeVisible();
    await expect(section.getByRole('link', { name: 'Contributions', exact: true })).toBeVisible();
    await expect(page.locator('.project-list a')).toHaveCount(9);
  });
}

test('projects and footer remain usable while contributions load', async ({ page }) => {
  await page.route(api, () => {});
  await page.goto('/projects');
  await expect(page.getByRole('status')).toHaveText('Loading GitHub activity…');
  await expect(page.locator('.project-list a')).toHaveCount(9);
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Email', exact: true })).toBeVisible();
});

test('all routes share one footer below their content', async ({ page }) => {
  await page.route(api, route => route.fulfill({ json: { total: { lastYear: 15 }, contributions } }));
  let footerX: number | undefined;
  for (const path of ['/', '/projects', '/photography', '/missing-page']) {
    await page.goto(path);
    const footer = page.getByRole('contentinfo');
    await expect(footer).toHaveCount(1);
    await footer.scrollIntoViewIfNeeded();
    for (const name of ['Email', 'LinkedIn', 'GitHub', 'Instagram', 'X']) {
      await expect(footer.getByRole('link', { name, exact: true })).toBeVisible();
      await expect(page.getByRole('link', { name, exact: true })).toHaveCount(1);
    }
    const bounds = (await footer.locator('.social-links').boundingBox())!;
    footerX ??= bounds.x;
    expect(bounds.x).toBeCloseTo(footerX, 0);
    const content = (await page.locator('main').boundingBox())!;
    expect(bounds.y).toBeGreaterThanOrEqual(content.y + content.height);
  }
});


test('projects fit a short viewport with the yearly total beside the title', async ({ page, isMobile }) => {
  await page.setViewportSize(isMobile ? { width: 390, height: 844 } : { width: 1280, height: 720 });
  await page.route(api, route => route.fulfill({ json: { total: { lastYear: 15 }, contributions } }));
  await page.goto('/projects');
  const title = page.getByRole('heading', { name: 'Contributions', exact: true });
  const total = page.getByText('15 contributions in the last year', { exact: true });
  await expect(total).toBeVisible();
  await expect(title).toBeVisible();
  const titleBox = (await title.boundingBox())!;
  const totalBox = (await total.boundingBox())!;
  expect(totalBox.x).toBeGreaterThan(titleBox.x + titleBox.width);
  expect(Math.abs(totalBox.y - titleBox.y)).toBeLessThan(5);
  expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBeLessThanOrEqual(page.viewportSize()!.height);
});

test('the full contribution year fits while the page is resized', async ({ page }) => {
  await page.route(api, route => route.fulfill({ json: { total: { lastYear: 15 }, contributions } }));
  await page.goto('/projects');
  const chart = page.getByRole('img', { name: /GitHub contributions:/ });
  await expect(chart).toBeVisible();
  for (const width of [1280, 820, 600, 456, 390, 320, 960]) {
    await page.setViewportSize({ width, height: 900 });
    await expect.poll(() => chart.evaluate(element => {
      const container = element.parentElement!;
      return element.getBoundingClientRect().width <= container.clientWidth + 1 && container.scrollWidth <= container.clientWidth;
    })).toBe(true);
    await expect(chart.locator('rect[data-level]')).toHaveCount(370);
    await expect.poll(() => chart.locator('text').filter({ hasText: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)$/ }).evaluateAll(labels => labels.every((label, index) => index === 0 || labels[index - 1].getBoundingClientRect().right + 2 <= label.getBoundingClientRect().left))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
  }
});
