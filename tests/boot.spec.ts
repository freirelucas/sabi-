import { test, expect } from '@playwright/test';
import { openApp } from './helpers';

test.describe('boot', () => {
  test('loader some, landing renderiza, História abre', async ({ page }) => {
    await openApp(page, { fresh: true });

    // 1. Loader some em < 12s (waitLoaderGone já valida) e fica escondido
    await expect(page.locator('.loader-tela')).toHaveClass(/escondido/);

    // 2. Landing tem 3 grupos + 5 portas (História, Pulso, Letras,
    //    Coleguinhas, Teclado) + hero
    await expect(page.locator('.menu-grupo')).toHaveCount(3);
    await expect(page.locator('.porta')).toHaveCount(5);
    await expect(page.locator('.porta.principal')).toHaveCount(1);
    await expect(page.locator('.menu-hero-titulo')).toHaveText('Sabiá Morse');

    // 3. Click em História abre cena 0 (em-casa) com botão próximo
    await page.locator('.porta.principal').click();
    await expect(page.locator('#titulo-tela')).toContainText('Ep 1/');
  });
});
