import { test, expect } from '@playwright/test';
import { openApp } from './helpers';

test.describe('conquistas (v9.3)', () => {
  test('painel mostra 4 categorias e contagem aumenta ao explorar', async ({ page }) => {
    await openApp(page, { fresh: true });

    // Estado limpo: 0 estrelas
    await page.evaluate(() => navegar('conquistas'));
    await expect(page.locator('.conquista-cat')).toHaveCount(4);
    await expect(page.locator('.conquista-item.ganha')).toHaveCount(0);

    // Volta, vai pra Coleguinhas, clica num card → conquista coleguinha
    await page.evaluate(() => navegar('coleguinhas'));
    await page.locator('.coleguinha-card').first().click();
    await page.waitForTimeout(300);

    // Reabre conquistas: deve ter pelo menos 1 ganha
    await page.evaluate(() => navegar('conquistas'));
    await expect(page.locator('.conquista-item.ganha')).toHaveCount(1);
    await expect(page.locator('.conquistas-resumo-num')).toContainText('1 / ');
  });
});
