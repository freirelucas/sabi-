# CLAUDE.md

Este arquivo orienta o Claude Code (e instâncias futuras do Claude) sobre o projeto. **Lê-o antes de fazer mudanças.**

## Quem é o usuário

**Lucas** — pesquisador IPEA/DIEST em Brasília. Pai do **Bento** (5 anos), o público-alvo do app. Companheira **Gabriela** ("Nena"). Lucas escreve em português, com gírias afetivas — "carpicha" significa "capricha" (faz com cuidado e capricho).

Lucas pediu pra **planejar antes de pivotar** quando há mudanças de escopo. Respeita esse pedido — quando ele pedir reformulações grandes, faz um plano enxuto antes de mexer no código.

## Visão do app

App pedagógico standalone (1 arquivo HTML) pra ensinar Morse ao Bento. Mote central: **"pássaros escrevem com música"**.

A voz default em todo o fio narrativo é **sabiá** com inflexão melódica (Sol4 ponto / Ré4 traço, mesmas alturas das cordas soltas do violão do Bento). Outras vozes (palma, telégrafo, violão) só estão disponíveis no teclado de exploração livre.

O app é também uma carta afetiva pra Gabriela ("Nena"): na ficção, **Nena é a professora dos sabiás** que recebe Ben e To na escola. A história termina com a turma cantando Parabéns pra ela, surpresa preparada pelos próprios alunos. A maternidade real (Gabriela é mãe do Bento) fica fora do app — a homenagem se sustenta pelo arco professora ↔ alunos.

## Decisões narrativas

### Personagens

- **To** — protagonista, filhote sabiá-laranjeira
- **Ben** — vizinho e amigo de To (mora no galho do lado), vão juntos pra escola. Sabiá com **topete distintivo**
- **Caca** — colega da escola, **canarinho amarelo** (espécie diferente — variedade visual; a escola dos sabiás aceita amigos de outras espécies)
- **Jo, Tete, Tata** — três colegas que se apresentam e contam histórias (Tete tem flor de ipê na cabeça; Tata tem fita)
- **Didi, Toto, Todi** — personagens da história contada pelas três colegas (conjunto restritíssimo de letras D/I/T/O — pedagogicamente intencional)
- **Nena** — **professora dos sabiás**, sabiá mais velha com óculos. Aniversariante (revelado como surpresa pela turma na cena 8). Tipo de personagem no código: `'nena'`.
- **Bento** — filho do Lucas (mundo real, não personagem do app). Revelação na cena 7: BENTO = To + Ben.

### Roteiro — 10 cenas

```
0. Amanhecer no ninho       To acorda, canto sabiá
1. Encontro com Ben         Letras T, O, B, E, N
2. Escola e Caca            Letras C, A
3. Aula curto/longo         Nena se apresenta como professora,
                            recebe Ben e To. Botões · e –
4. Três colegas             Jo, Tete, Tata se apresentam
5. História das irmãs       Didi, Toto, Todi (letras D, I)
6. Palavras solenes         Mama, Papa, Mim (letras M, P) — Nena ensina
7. Revelação BENTO          BENTO = Ben + To
8. Surpresa pra Nena        Cada criança traz 2 letras, junta tudo
                            forma PARABENS NENA. Distribuição:
                            To→PA, Ben→RA, Caca→BE,
                            Jo→NS, Tete→NE, Tata→NA
9. Final: PARABÉNS NENA     Toda a turma canta para a Nena.
                            Sequência: PARABENS NENA NENA NENA NENA
                            (o nome dela ecoa 4 vezes seguidas)
```

### Palavras por letra (modo letra-por-letra)

Lista decidida com Lucas. **Não trocar sem confirmar.**

```
A→Asa     B→Bento   C→Casa     D→Didi
E→Estela  F→Flor    G→Galho    H→Homem
I→Ipê     J→Judo    K→Karatê   L→Lua
M→Mama    N→Nena    O→Oi       P→Papa
Q→Quintal R→Rio     S→Sabiá    T→To
U→Uva     V→Vento   W→Wawe     X→Xícara
Y→Yo      Z→Zebra
```

Lucas escolheu explicitamente: **Asa, Casa, Estela** (não Estrela), **Flor, Homem, Wawe, Yo, Judo**. As demais foram propostas e aceitas implicitamente.

Nota: o personagem **Jo** (uma das três colegas na história) continua sendo Jo — a mudança J→Judo é apenas na palavra-âncora pedagógica do modo letra-por-letra.

## Decisões técnicas

### Áudio — WebAudioFont via CDN

Carrega 3 arquivos do GitHub Pages do projeto:

```
https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js   (122 KB)
https://surikov.github.io/webaudiofontdata/sound/0240_GeneralUserGS_sf2_file.js   (118 KB) — violão acústico steel
https://surikov.github.io/webaudiofontdata/sound/01230_Aspirin_sf2_file.js   (9 KB) — Bird Tweet
```

Total ~290 KB, primeira carga. Cacheia depois. Loader inicial mostra "o sabiá está afinando o bico…" com barra de progresso. Timeout de 6s por arquivo. Botão "continuar com som simples" aparece após 4s. Se CDN falhar, usa síntese FM aprimorada (3 harmônicos + vibrato + envelope multiestágio).

**Lucas reportou explicitamente que o áudio do teclado "não exporta legal"** na v1 (síntese pura) — esta é a razão principal pra mudança pra WebAudioFont. Se ele continuar com queixas de áudio, investiga o agendador (`tocarSequencia` em `index.html`) — pode ser timing de cleanup entre repetições, não a qualidade do som em si.

### Sistema de loops

- **Slider BPM**: 21 valores fixos de 40 a 100, step 3 (`VALORES_BPM` no código)
- **Repetições**: chips 1× / 2× / 4× / 8× (mutuamente exclusivos)
- **Loop infinito**: toggle separado; quando ativo, repetições ficam desabilitadas

### Single-file HTML

Tudo num arquivo só (`index.html`). CSS inline em `<style>`, JS inline em `<script>`, SVGs como `<symbol>` no topo. **Não fragmentar em arquivos separados** sem motivo forte — Lucas valoriza o standalone.

A única exceção é o WebAudioFont via CDN. Se quiser tornar 100% offline, precisa baixar os 3 arquivos JS do soundfont, embutir como base64 no HTML — fica ~400 KB total.

## Arquitetura do código

Organizado em módulos lógicos dentro do mesmo `<script>`:

1. **`Audio` (IIFE)** — engine, loader WebAudioFont com fallback, sintetizadores (`playSabiaTomSintetico`, `playSabiaTomReal`, `playPalmaInicio/Curto/Longo`, `playTelegrafo`, `playViolaoSintetico/Real`, `playCantoSabiaFloreio`), dispatcher `playElemento(elemento, voz, when, durMs)`.
2. **`MORSE`** — tabela A-Z, função `calcularTiming(bpm)` com Farnsworth (ponto = 60000/bpm, traço = 3×, espaçoLetra = 3.8×, espaçoPalavra = 7×).
3. **`State`** — estado global (modo, cenaIdx, vozTeclado, bpm, loopInfinito, loopId, cumpridas Set). `localStorage` chave `sabia-morse-bento-v2`.
4. **`tocarSequencia(seq, opts)`** — agendador principal. Recebe string com `.`, `-`, ` ` (entre letras), `/` (entre palavras). Suporta `repeticoes`, `infinito`, `onElemento`, `onFim`. Usa `State.loopId` pra cancelar.
5. **`ROTEIRO`** — array de 10 cenas, cada uma com `{ id, fundo, decoracao, personagens, fala, falaSub, acao, proximo }`. Cenas referenciam personagens por tipo (`'to'`, `'ben'`, `'nena'`, etc.). **Tipos de ação**: `ouvir-canto`, `aprender-letras`, `apresentar-nomes`, `curto-longo`, `revelar-bento`, `surpresa-letras`, `parabens-nena`, `final`.
6. **`PALAVRAS_LETRA`** — mapa A-Z → palavra-âncora. **Não editar sem consultar Lucas.**
7. **`passaroSVG(personagem)`** — fábrica que retorna `<svg>` configurado por CSS variables. Acessórios via `<use href>` (`#topete`, `#flor-cabeca`, `#fita-cabeca`, `#oculos`).
8. **Renderers** — `renderLanding`, `renderCena`, `renderTeclado`, `renderLetras`, `renderLetraDetalhe`. Todos usam helper `el(tag, props, children)` pra construir DOM.
9. **`navegar(modo, params)`** — navegação central, faz cleanup de loops e handlers antes de mudar tela.

## Convenções

- **Português brasileiro** em toda a interface, comentários, e variáveis de domínio.
- **Tom afetivo** mas não infantilizado. As falas tratam Bento como interlocutor inteligente.
- **Acessibilidade** — botões com 44px mínimo (regra Apple), `:active` com `transform: scale(0.92)` pra feedback tátil, animações com `prefers-reduced-motion`.
- **Mobile-first** — viewport com `viewport-fit=cover`, font-size com `clamp()`, media queries em `480px` e `380px` reduzem personagens.
- **Cores** — paleta de variáveis CSS no `:root`. Manter os tons de papel/madeira/folha como base. Acentos: laranja (sabiá), amarelo (sol/Caca/celebração), verde (folha), violeta-rosa (Ré do violão).

## Pendências conhecidas

- **Teste em iPhone real do Bento** — o app foi desenvolvido com Playwright em viewport mobile, mas falta validação com criança real. Especialmente: qualidade do áudio carregado da CDN, fluidez das transições, se o tempo de loading inicial é tolerável.
- **Sample real de canto de sabiá-laranjeira** — Lucas mencionou "embed Xeno-Canto sample real" como possível upgrade. Hoje usa síntese FM + Bird Tweet do soundfont (que é genérico). Se quiser autenticidade, baixa de Xeno-Canto (CC-BY) e embute como base64 — recomendo cortar pra 2-3s pra não inflar o arquivo.
- **PWA install/service worker** — escopo descartado na v2 mas pode voltar. Bento poderia ter ícone na tela inicial sem depender de "Adicionar à Tela de Início".
- **Testes automatizados** — nenhum hoje. Apenas validação de sintaxe JS via `new Function(js)`.

## Como continuar

Se Lucas pedir uma nova mudança:

1. **Lê o pedido com cuidado** — ele às vezes muda partes específicas mantendo o resto. Pergunta o que ficou ambíguo.
2. **Se for mudança grande** (novo personagem, nova cena, mudança narrativa estrutural), faz um plano enxuto antes de mexer no código.
3. **Edita `index.html`** diretamente. Use `str_replace` em vez de reescrever o arquivo todo — preserva o que já funciona.
4. **Valida a sintaxe** depois de cada bloco de mudanças:
   ```bash
   node -e "const html = require('fs').readFileSync('index.html', 'utf8'); const m = html.match(/<script>([\\s\\S]*?)<\\/script>/); new Function(m[1]); console.log('OK');"
   ```
5. **Visualiza com Playwright** as cenas afetadas (mobile, 390×844):
   ```bash
   python3 -c "
   from playwright.sync_api import sync_playwright
   import os
   with sync_playwright() as p:
       browser = p.chromium.launch()
       page = browser.new_page(viewport={'width':390, 'height':844}, device_scale_factor=2)
       page.goto('file://' + os.path.abspath('index.html'))
       try: page.wait_for_selector('.loader-tela.escondido', timeout=12000)
       except: pass
       page.wait_for_timeout(800)
       page.evaluate('navegar(\"historia\", { cenaIdx: 3 })')  # ajusta cena
       page.wait_for_timeout(700)
       page.screenshot(path='out.png')
   "
   ```
6. **Atualiza este `CLAUDE.md`** se a mudança alterar decisões narrativas ou arquitetura.

## Histórico resumido

- **v1** (sessão original) — 7 etapas pedagógicas (pulso, curto/longo, contar, letras, violão, palavras, teclado livre). Final: desafio "PARABENS NENA" no modo livre. Áudio: síntese Web Audio pura. Funcional mas Lucas reportou que áudio não convencia.
- **v2 narrativa** (segunda sessão) — pivot pra história em 9 cenas. Personagens To, Ben, Caca, Jo, Tete, Tata, Professor. Áudio: WebAudioFont via CDN. Final inicial: "BENTO = Ben + To".
- **v2 final-aniversário** (sessão anterior) — três mudanças do Lucas: (1) J→Judo no vocabulário (não Jo); (2) cena 3 da aula explica que é boas-vindas pro Ben+To e aniversário da Nena; (3) cena final vira PARABÉNS NENA, com o nome dela ecoando 4 vezes na sequência Morse final.
- **v3 Nena-professora** (sessão atual) — pivot do arco: Nena deixa de ser "mãe do Bento aniversariante invisível" e vira a **professora dos sabiás** (substitui o tipo `professor` no código). O aniversário é revelado como surpresa da turma. **Nova cena 8 `surpresa-letras`**: cada uma das 6 crianças traz 2 letras (PA, RA, BE, NS, NE, NA) que se juntam pra formar PARABENS NENA — display vai construindo letra a letra, com Morse acompanhando, e botão final libera a cena de canto. Polish junto: `aria-live="polite"` na fala da cena, animação `letraPousa` quando letra chega no display, layout do Morse final em duas linhas pra não transbordar em telas pequenas.
