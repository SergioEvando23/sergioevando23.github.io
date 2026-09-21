import { expect, test } from '@playwright/test';

test('language selection persists and keeps theme carousel and resume links', async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.addInitScript(() => {
    if (!localStorage.getItem('Sérgio-portfolio-language')) {
      localStorage.setItem('Sérgio-portfolio-language', 'portugues');
    }
    localStorage.setItem('Sérgio-portfolio-entry-choice', 'visitor');
  });
  await page.goto('/');
  await expect(page.locator('html[data-hydrated="true"]')).toBeAttached();
  await expect(
    page.getByRole('heading', { name: /Engenheiro de Software/ }),
  ).toBeVisible();

  await page.getByRole('radio', { name: 'Tema Escuro' }).click();
  await expect(page.locator('html')).toHaveClass(/dark/);

  const carousel = page.getByRole('region', {
    name: 'Carrossel principal de competencias',
  });
  await carousel.getByRole('button', { name: 'Proximo slide' }).click();
  await expect(
    carousel.getByRole('heading', { name: 'Mobile - Flutter + Dart' }),
  ).toBeVisible();

  await page.getByRole('button', { name: 'Alterar idioma para ingles' }).first().click();
  await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();
  await expect(
    page.getByRole('heading', {
      name: 'Fullstack Web & Mobile Software Engineer',
    }),
  ).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Technologies and technical focus' }),
  ).toBeVisible();
  await expect(page.getByText(/All rights reserved\./)).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(
    page.getByRole('region', { name: 'Main skills carousel' }).getByRole('heading', {
      name: 'Mobile - Flutter + Dart',
    }),
  ).toBeVisible();

  const portugueseResume = page.getByRole('link', { name: 'Download resume PT' });
  await expect(portugueseResume).toHaveAttribute(
    'href',
    '/documents/CurriculoSérgioCosta.pdf',
  );
  await expect(portugueseResume).toHaveAttribute('download', 'CurriculoSérgioCosta.pdf');
  await expect(page.getByRole('link', { name: 'Download resume EN' })).toHaveAttribute(
    'download',
    'SérgioCostaResume.pdf',
  );

  const portugueseResponse = await page.request.get(
    '/documents/CurriculoSérgioCosta.pdf',
  );
  const englishResponse = await page.request.get('/documents/SérgioCostaResume.pdf');
  expect(portugueseResponse.status()).toBe(200);
  expect(englishResponse.status()).toBe(200);

  await page.reload();
  await expect(page.locator('html[data-hydrated="true"]')).toBeAttached();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('link', { name: 'Projects' }).first()).toBeVisible();

  await page
    .getByRole('button', { name: 'Change language to Portuguese' })
    .first()
    .click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('link', { name: 'Projetos' }).first()).toBeVisible();

  await page.setViewportSize({ width: 390, height: 844 });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  expect(overflow).toBe(false);

  expect(consoleErrors.filter((error) => /hydration|hydrated/i.test(error))).toEqual([]);
});
