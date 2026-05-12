import { test, expect } from '@playwright/test';
import { openApp, navegar } from './helpers';

test.describe('historia', () => {
  test('ROTEIRO tem 16 cenas, todas navegáveis sem erro de console', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const t = msg.text();
      // Ignora falhas de carregar recurso de CDN (WebAudioFont) — em CI
      // ou offline o app cai pro fallback Karplus-Strong sem problemas.
      if (t.includes('Failed to load resource')) return;
      if (t.includes('ERR_CERT_AUTHORITY_INVALID')) return;
      if (t.includes('net::ERR')) return;
      errors.push(t);
    });

    await openApp(page, { fresh: true });

    // 1. ROTEIRO existe e tem >= 16 cenas
    const total = await page.evaluate('ROTEIRO.length') as number;
    expect(total).toBeGreaterThanOrEqual(16);

    // 2. Cena `paios-maios` NÃO está (foi removida na v9.2)
    const ids = await page.evaluate('ROTEIRO.map(c => c.id)') as string[];
    expect(ids).not.toContain('paios-maios');
    expect(ids).toContain('em-casa');
    expect(ids).toContain('sos-licao');
    expect(ids).toContain('roda-da-turma');

    // 3. Smoke: navega cada cena sem erro
    for (let i = 0; i < total; i++) {
      await navegar(page, 'historia', { cenaIdx: i });
      await page.waitForTimeout(80);
    }
    expect(errors, errors.join('\n')).toEqual([]);
  });

  test('cena sos-licao mostra 3 grupos · · · / − − − / · · ·', async ({ page }) => {
    await openApp(page, { fresh: true });
    const ids = await page.evaluate('ROTEIRO.map(c => c.id)') as string[];
    const idx = ids.indexOf('sos-licao');
    expect(idx).toBeGreaterThanOrEqual(0);

    await navegar(page, 'historia', { cenaIdx: idx });

    // 3 grupos visuais com aria-label = letra
    await expect(page.locator('.sos-grupo')).toHaveCount(3);
    await expect(page.locator('.sos-grupo[aria-label="S"]')).toHaveCount(2);
    await expect(page.locator('.sos-grupo[aria-label="O"]')).toHaveCount(1);

    // S = · · · → 3 pontos. O = − − − → 3 traços. Total: 6 pontos + 3 traços
    await expect(page.locator('.sos-grupo .ponto')).toHaveCount(6);
    await expect(page.locator('.sos-grupo .traco')).toHaveCount(3);
  });
});
