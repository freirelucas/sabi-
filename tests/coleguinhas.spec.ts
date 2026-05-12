import { test, expect } from '@playwright/test';
import { openApp, navegar } from './helpers';

test.describe('coleguinhas', () => {
  test('3 grupos, 9 cards, painel decomp ao clicar', async ({ page }) => {
    await openApp(page, { fresh: true });
    await navegar(page, 'coleguinhas');

    // 1. Header da turma
    await expect(page.locator('.coleguinhas-titulo'))
      .toHaveText('A turma da Escola dos Sabiás');

    // 2. 3 grupos: professora, rápido, calmo
    await expect(page.locator('.coleguinha-grupo')).toHaveCount(3);
    await expect(page.locator('.grupo-professora')).toHaveCount(1);
    await expect(page.locator('.grupo-rapido')).toHaveCount(1);
    await expect(page.locator('.grupo-calmo')).toHaveCount(1);

    // 3. 9 personagens: 1 + 5 + 3
    await expect(page.locator('.coleguinha-card')).toHaveCount(9);
    await expect(page.locator('.grupo-rapido .coleguinha-card')).toHaveCount(5);
    await expect(page.locator('.grupo-calmo .coleguinha-card')).toHaveCount(3);

    // 4. Painel de decomposição começa escondido
    await expect(page.locator('.decomp-painel')).toHaveClass(/escondido/);

    // 5. Click no card da Nena → painel aparece com fala "oi, eu sou a Nena!"
    await page.locator('.coleguinha-card[data-quem="nena"]').click();
    await expect(page.locator('.decomp-painel')).not.toHaveClass(/escondido/);
    await expect(page.locator('.decomp-fala-texto')).toHaveText('oi, eu sou a Nena!');
  });
});
