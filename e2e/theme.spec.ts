import { expect, test } from '@playwright/test';

test('theme preference persists and keeps carousel state', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/');

  await page.getByRole('radio', { name: 'Tema Escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  const carousel = page.getByRole('region', {
    name: 'Carrossel principal de competências',
  });
  await carousel.getByRole('button', { name: 'Próximo slide' }).click();
  await expect(carousel.getByText('Mobile — Flutter + Dart')).toBeVisible();

  await page.getByRole('radio', { name: 'Tema Claro' }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(carousel.getByText('Mobile — Flutter + Dart')).toBeVisible();

  await page.reload();
  await expect(page.locator('html')).not.toHaveClass(/dark/);

  expect(consoleErrors.filter((error) => /hydration|hydrated/i.test(error))).toEqual([]);
});
