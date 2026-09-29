import { expect, test } from '@playwright/test';

test('carousel supports mouse, indicators, keyboard and mobile layout', async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    localStorage.setItem('SÃ©rgio-portfolio-language', 'portuguese');
    localStorage.setItem(
      'SÃ©rgio-portfolio-entry-choice',
      JSON.stringify({ choice: 'visitor', expiresAt: Date.now() + 48 * 60 * 60 * 1000 }),
    );
  });
  await page.goto('/');
  await expect(page.locator('html[data-hydrated="true"]')).toBeAttached();

  const carousel = page.getByRole('region', {
    name: 'Carrossel principal de competencias',
  });

  await expect(carousel).toBeVisible();
  await expect(
    carousel.getByRole('heading', { name: 'Frontend - React + TypeScript' }),
  ).toBeVisible();

  const nextButton = carousel.getByRole('button', { name: 'Proximo slide' });
  if (testInfo.project.name === 'mobile-chrome') {
    await expect(nextButton).toHaveCount(0);
  } else {
    await nextButton.click();
  }
  if (testInfo.project.name === 'mobile-chrome') {
    await carousel.getByRole('tab', { name: 'Ir para o slide 2' }).click();
  }
  await expect(
    carousel.getByRole('heading', { name: 'Mobile - Flutter + Dart' }),
  ).toBeVisible();

  await carousel.getByRole('tab', { name: 'Ir para o slide 3' }).click();
  await expect(
    carousel.getByRole('heading', { name: 'Backend - Node.js + APIs' }),
  ).toBeVisible();

  await carousel.focus();
  await page.keyboard.press('Home');
  await expect(
    carousel.getByRole('heading', { name: 'Frontend - React + TypeScript' }),
  ).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);
});
