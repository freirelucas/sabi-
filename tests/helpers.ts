import { Page, expect } from '@playwright/test';
import * as path from 'path';

const APP_PATH = path.resolve(__dirname, '..', 'index.html');
export const APP_URL = 'file://' + APP_PATH;

/**
 * Os símbolos do app (`Audio`, `State`, `ROTEIRO`, `navegar`, …) são `const`
 * no top-level de um `<script>` clássico — então NÃO ficam em `window`
 * (inclusive `window.Audio` é o construtor nativo do HTMLAudioElement). Mas
 * eles ESTÃO no Global Lexical Environment, e portanto são resolvidos por
 * referência crua em qualquer código avaliado no escopo global. Por isso
 * usamos `page.evaluate('expr')` em vez de `page.evaluate(() => …)`: a forma
 * string é tratada como código no escopo global e enxerga os bindings.
 */

export async function openApp(page: Page, opts: { fresh?: boolean } = {}) {
  await page.goto(APP_URL);
  await waitLoaderGone(page);
  if (opts.fresh) {
    // Limpa pós-load (não via addInitScript, que rodaria em todo reload e
    // arruinaria testes de persistência) e re-renderiza pelo recarregar.
    await page.evaluate(() => {
      try { localStorage.clear(); sessionStorage.clear(); } catch {}
    });
    await page.reload();
    await waitLoaderGone(page);
  }
}

export async function waitLoaderGone(page: Page) {
  await page.waitForSelector('.loader-tela.escondido', { timeout: 12000 });
}

export async function navegar(page: Page, modo: string, params: Record<string, unknown> = {}) {
  const expr = `navegar(${JSON.stringify(modo)}, ${JSON.stringify(params)})`;
  await page.evaluate(expr);
}

export async function activeSources(page: Page): Promise<number> {
  return await page.evaluate('Audio._activeSourcesSize()') as number;
}

export async function visualQueue(page: Page): Promise<number> {
  return await page.evaluate('Audio._visualQueueSize()') as number;
}

export async function masterGain(page: Page): Promise<number> {
  return await page.evaluate('Audio._masterGainValue()') as number;
}

export async function getState<T = unknown>(page: Page, prop: string): Promise<T> {
  return await page.evaluate(`State[${JSON.stringify(prop)}]`) as T;
}

export async function unlockAudio(page: Page) {
  await page.evaluate('Audio.unlock()');
}

/** Espera até a fila de áudio drenar (sem sources ativos). */
export async function waitAudioSilent(page: Page, timeoutMs = 2000) {
  await expect.poll(() => activeSources(page), { timeout: timeoutMs }).toBe(0);
}
