import { test, expect } from '@playwright/test';
import { openApp, navegar } from './helpers';

test.describe('letras', () => {
  test('grade, vogais, carimbar e persistência', async ({ page }) => {
    await openApp(page, { fresh: true });
    await navegar(page, 'letras');

    // 1. 26 letras na grade — 5 vogais + 21 consoantes
    await expect(page.locator('.letra-card')).toHaveCount(26);
    await expect(page.locator('.letra-card.vogal')).toHaveCount(5);
    await expect(page.locator('.letra-card.consoante')).toHaveCount(21);

    // 2. Sem visitadas — nenhum ✓
    await expect(page.locator('.visita-marca')).toHaveCount(0);

    // 3. Entra na letra S, carimba, volta pra grade
    await navegar(page, 'letra-detalhe', { letra: 'S' });
    await expect(page.locator('.letra-display')).toHaveText('S');
    await page.locator('.botao-carimbo').click();
    // animação dispara em 600ms — espera passar
    await expect(page.locator('.carimbo-feito')).toBeVisible({ timeout: 1500 });

    // 4. Estado persistiu: cumpridas tem 'letra:S'
    const temS = await page.evaluate(`State.cumpridas.has('letra:S')`);
    expect(temS).toBe(true);

    // 5. Reload mantém: card S ganha .visitada e ✓ aparece
    await page.reload();
    await page.waitForSelector('.loader-tela.escondido', { timeout: 12000 });
    await navegar(page, 'letras');
    await expect(page.locator('.letra-card.visitada')).toHaveCount(1);
    await expect(page.locator('.visita-marca')).toHaveCount(1);
  });
});
