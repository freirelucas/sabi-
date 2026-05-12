import { test, expect } from '@playwright/test';
import {
  openApp, navegar, getState, masterGain, activeSources, waitAudioSilent, unlockAudio,
} from './helpers';

test.describe('teclado', () => {
  test('default modo criança, escolher palavra, alternar pra explorar', async ({ page }) => {
    await openApp(page, { fresh: true });
    await navegar(page, 'teclado');

    // 1. Default: modo CRIANÇA — botão criança ativo, sem grade do alfabeto
    expect(await getState<string>(page, 'tecladoModo')).toBe('crianca');
    await expect(page.locator('.teclado-modo.ativo')).toHaveCount(1);
    await expect(page.locator('.teclado-modo.ativo')).toContainText('crianç');
    await expect(page.locator('.crianca-display')).toHaveCount(1);

    // 2. Display começa em "escolhe uma palavra"
    await expect(page.locator('.crianca-display')).toContainText('escolhe');

    // 3. Click no chip BENTO → display mostra BENTO
    await page.locator('.palavra-rapida[data-p="BENTO"]').click();
    await expect(page.locator('.crianca-display')).toHaveText('BENTO');

    // 4. Click ouvir → sources aparecem; click novamente pausa
    await unlockAudio(page);
    const btnOuvir = page.locator('.crianca-tocar');
    await btnOuvir.click();
    await expect.poll(() => activeSources(page), { timeout: 2000 })
      .toBeGreaterThan(0);
    await btnOuvir.click();
    await waitAudioSilent(page, 2500);

    // 5. Toggle modo EXPLORAR → grade do alfabeto aparece, persiste
    await page.locator('.teclado-modo:not(.ativo)').click();
    expect(await getState<string>(page, 'tecladoModo')).toBe('explorar');
    await page.reload();
    await page.waitForSelector('.loader-tela.escondido', { timeout: 12000 });
    await navegar(page, 'teclado');
    expect(await getState<string>(page, 'tecladoModo')).toBe('explorar');
  });

  test('volume e mute global', async ({ page }) => {
    await openApp(page, { fresh: true });
    await unlockAudio(page);

    // Volume default 70%
    expect(await page.locator('#slider-volume').inputValue()).toBe('70');
    const gainInicial = await masterGain(page);
    expect(gainInicial).toBeGreaterThan(0.05); // 0.7 * curva, mas > zero

    // Click mute → masterGain rampa pra 0 em ~40ms
    await page.locator('#btn-mute').click();
    expect(await page.locator('#btn-mute').getAttribute('aria-pressed')).toBe('true');
    await expect.poll(() => masterGain(page), { timeout: 1000 }).toBeLessThan(0.001);

    // Recarrega — mute persiste
    await page.reload();
    await page.waitForSelector('.loader-tela.escondido', { timeout: 12000 });
    expect(await page.locator('#btn-mute').getAttribute('aria-pressed')).toBe('true');
  });
});
