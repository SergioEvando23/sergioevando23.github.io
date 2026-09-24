import { expect, test } from '@playwright/test';

test('first visit shows welcome screen and visitor can enter portfolio', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Welcome to my portfolio' }),
  ).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue as visitor' })).toBeVisible();

  await page.getByRole('button', { name: 'Continue as visitor' }).click();
  await expect(page.getByRole('heading', { name: /Fullstack Web/ })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Study gallery' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Insert projects' })).not.toBeVisible();

  await page.goto('/admin/projects/new');
  await expect(page.getByRole('heading', { name: 'Access denied' })).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);

  expect(consoleErrors.filter((error) => /hydration|hydrated/i.test(error))).toEqual([]);
});
