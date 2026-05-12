import { test, expect } from '@playwright/test';
import { openApp, navegar, activeSources, waitAudioSilent, unlockAudio } from './helpers';

test.describe('pulso', () => {
  test('camadas, tocar e sincronia (regressão v8.7)', async ({ page }) => {
    await openApp(page, { fresh: true });
    await navegar(page, 'pulso');

    // 1. 3 camadas com vocabulário infantil
    const cabecalhos = page.locator('.pulso-camada-tit-infantil');
    await expect(cabecalhos).toHaveCount(3);
    await expect(cabecalhos.nth(0)).toContainText('1 batida');
    await expect(cabecalhos.nth(1)).toContainText('2 batidinhas');
    await expect(cabecalhos.nth(2)).toContainText('4 pinguinhos');

    // 2. 3 botões 🔊 ouvir (um por camada). Click no da camada 4 (pinguinhos)
    await unlockAudio(page);
    const btnsOuvir = page.getByRole('button', { name: 'ouvir', exact: true });
    await expect(btnsOuvir).toHaveCount(3);
    await btnsOuvir.nth(2).click();

    // 3. Logo após click: muitos sources agendados
    await expect.poll(() => activeSources(page), { timeout: 1500 })
      .toBeGreaterThan(20);

    // 4. Após 100ms: sources continuam agendados (regressão v8.7
    //    — antes, sources eram mortos prematuramente)
    await page.waitForTimeout(100);
    expect(await activeSources(page)).toBeGreaterThan(10);

    // 5. Click novamente pausa — sources caem pra 0 logo
    await btnsOuvir.nth(2).click();
    await waitAudioSilent(page, 2500);

    // 6. 4 chips de velocidade (com guepardo na tela Pulso)
    await expect(page.locator('.chip-velocidade')).toHaveCount(4);
  });
});
