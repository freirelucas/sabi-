# CLAUDE.md

Este arquivo orienta o Claude Code (e instâncias futuras do Claude) sobre o projeto. **Lê-o antes de fazer mudanças.**

## Quem é o usuário

**Lucas** — pesquisador IPEA/DIEST em Brasília. Pai do **Bento** (5 anos), o público-alvo do app. Companheira **Gabriela** ("Nena"). Lucas escreve em português, com gírias afetivas — "carpicha" significa "capricha" (faz com cuidado e capricho).

Lucas pediu pra **planejar antes de pivotar** quando há mudanças de escopo. Respeita esse pedido — quando ele pedir reformulações grandes, faz um plano enxuto antes de mexer no código.

## Visão do app

App pedagógico standalone (1 arquivo HTML) pra ensinar Morse ao Bento. Mote central: **"pássaros escrevem com música"**.

A voz default em todo o fio narrativo é **sabiá** (amostra real de canto + síntese fallback). Outras vozes (palma, telégrafo, violão) só estão disponíveis no teclado de exploração livre.

O app tem **três áreas distintas** que não se misturam:
1. **História** — narrativa pedagógica do primeiro dia. Termina em si mesma, volta pra landing.
2. **Jogo das letras** — A→Z com palavras-âncora.
3. **Teclado livre** — escrever qualquer palavra.

O app é uma carta afetiva pra Gabriela ("Nena"): na ficção, **Nena é a professora dos sabiás** que recebe Ben e To no primeiro dia. A história termina com a turma cantando Parabéns pra ela, mas o foco não é o aniversário (não mencionado no app) — é o acolhimento. A maternidade real (Gabriela é mãe do Bento) fica fora do app — a homenagem se sustenta pelo arco professora ↔ alunos.

## Decisões narrativas

### Personagens

- **To** — protagonista, filhote sabiá-laranjeira
- **Ben** — vizinho e amigo de To (mora no galho do lado), vão juntos pra escola. Sabiá com **topete distintivo**
- **Time de ping-pong** (rápidos):
  - **Caca** — canarinho amarelo (espécie diferente)
  - **Jo** — sabiá sem acessório, peito mais escuro
  - **Tete** — sabiá com flor de ipê na cabeça
- **Time de xadrez** (calmos):
  - **Tata** — sabiá com fita na cabeça
  - **Tito** — sabiá com **penagem cinza-oliveira** (introduzido na v5)
  - **Lila** — sabiá com **penagem rosa-violeta** + flor (introduzido na v5)
- **Nena** — **professora dos sabiás**, sabiá mais velha com óculos. Aniversariante (surpresa silenciosa no E6). Tipo no código: `'nena'`.
- **Bento** — filho do Lucas (mundo real, não personagem do app). Easter-egg no antigo `roda-apresentacao` (legado).

### Roteiro — 6 episódios (v5)

```
E1. primeiro-dia    Lógica geral dos toques. Nena recebe Ben e To,
                    explica que tudo no Morse é · ou –.
E2. time-pingpong   Caca, Jo, Tete (rápidos). Cada um se apresenta;
                    "rebatida" de palma antes do nome em Morse.
E3. time-xadrez     Tata, Tito, Lila (calmos). Mesmo molde, mas
                    BPM reduzido pra 70% durante o episódio.
E4. futebol-recap   Os 6 amigos numa grade 3×2. Botão "ouvir a
                    turma" toca cada nome em ordem.
E5. sos-licao       SOS é pedido de ajuda — confiança, seriedade.
                    Reusa o renderer aula-sos com fala diferente.
E6. segredo         Turma sussurra sem Nena (8 personagens em
                    círculo). Botão "ensaiar baixinho" toca
                    PARABENS NENA. Botão "Nena chegou!" mostra
                    overlay celebrando + confete.
```

Tipos de ação ativos:
- `aprender-toques` (E1): compasso + 4 velocidades + botões · / –
- `time-apresentacao` (E2/E3): 3 personagens em fileira, sequência guiada
- `recap-nomes` (E4): grade + botão "ouvir todos"
- `aula-sos` (E5): 3 grupos visuais + ouvir SOS + brincar
- `segredo-parabens` (E6): círculo de turma + ensaiar + Nena chegou

Tipos legados (renderers preservados como dead code): `ouvir-canto`,
`aprender-letras`, `apresentar-nomes`, `curto-longo`, `revelar-bento`,
`surpresa-letras`, `roda-apresentacao`, `parabens-nena`, `final`.

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

### Áudio — três camadas

1. **Amostra real do sabiá-laranjeira** (XC421912, Xeno-Canto, CC BY-NC-SA 4.0) embutida como base64 inline no `index.html` (~37 KB mp3, ~50 KB em base64). Decodificada em `AudioBuffer` no primeiro `unlock()`. Usa offsets fixos do sample pra papéis distintos:
   - **Ponto** → frase 4 (offset 1.95s × 0.18s): ataque curto e nítido
   - **Traço** → frase 3 (offset 1.13s × 0.55s): longa, cantada, com trinado natural
   - **Floreio/intro** → frase inteira (0 → 3.0s)
   - `playbackRate` é levemente ajustado pra encaixar no BPM (clamped em [0.85, 1.4] pra não distorcer timbre).

2. **Síntese sabiá** (fallback): duas funções específicas — `playSabiaPontoSintetico` (chirp ascendente em G5) e `playSabiaTracoSintetico` (pio descendente G5→A4 com vibrato 7Hz). Auditivamente distintas. Usadas se o decode do sample falhar.

3. **WebAudioFont via CDN**: preset **0260_Stratocaster_sf2_file** (sample real de Stratocaster) pra **guitarra**, + Bird Tweet pro sabiá fallback. Antes usava 0240 (acoustic steel). Lucas testou 0270 (Electric Clean) e reportou "horroroso", então a v5 trocou pra Stratocaster real. Carregamento em background, fallback pra síntese se CDN falhar.

4. **Karplus-Strong para guitarra** (síntese fallback v5): quando WebAudioFont não carrega ou não está disponível, `playViolaoSintetico` gera o som via algoritmo Karplus-Strong — buffer PCM offline com loop de delay + lowpass + decay. Soa muito mais como corda real do que oscillator+filter (que era a abordagem da v4 e Lucas reportou ruim). Buffer cacheado por nota MIDI pra evitar recomputar.

Loader inicial mostra "o sabiá está afinando o bico…". Timeout de 6s por arquivo. Botão "continuar com som simples" aparece após 4s.

**Conceito de pulso (v4)**: BPM agora é semínima por minuto. Ponto = semicolcheia (1/4 de beat). Espaçamentos seguem o padrão Morse 1:3:7. Default 120 BPM (range 60-180). Cabeça de compasso visual (`.compasso`) aparece nas cenas de Morse pulsando no tempo do BPM, dando referência rítmica visual.

### Sistema de velocidade (v5)

4 níveis nomeados (`VELOCIDADES` no código):
- 🐢 **tartaruga** — 50 BPM
- 🚶 **menino**    — 75 BPM (default)
- 🐰 **coelho**    — 110 BPM
- 🐆 **guepardo**  — 160 BPM

Substituiu o slider contínuo da v4 (Lucas reportou que 120 BPM ficava
rápido demais e queria níveis claros pra criança).

`criarSeletorVelocidade(onChange)` é a função reusável — aparece no
teclado, na cena E1 (aprender-toques) e na E5 (aula-sos). Estado
persiste em `localStorage`.

### Sistema de loops

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
5. **`ROTEIRO`** — array de 6 cenas, cada uma com `{ id, fundo, decoracao, personagens, fala, falaSub, acao, proximo }`. Cenas referenciam personagens por tipo (`'to'`, `'ben'`, `'nena'`, etc.). **Tipos de ação ativos**: `ouvir-canto`, `aprender-letras`, `aula-sos`, `roda-apresentacao`, `parabens-nena`, `final`. Os tipos antigos (`apresentar-nomes`, `curto-longo`, `revelar-bento`, `surpresa-letras`) ainda têm renderers no código (dead code) caso voltem a ser usados.
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
- **v3 Nena-professora** — pivot do arco: Nena deixa de ser "mãe do Bento aniversariante invisível" e vira a **professora dos sabiás**. O aniversário é revelado como surpresa da turma com cena dedicada de letras (PA+RA+BE+NS+NE+NA).
- **v4 SOS + roda + 3 áreas separadas** — reformulação narrativa grande: a história agora é sobre o **primeiro dia** de To e Ben, com a aula focada em **SOS** e nos **nomes da turma**. ROTEIRO compactado pra 6 cenas (era 10). Cena de apresentações vira **roda interativa em círculo** — 7 personagens (Nena + 6 crianças) dispostos em ângulos via cálculo polar; sequência guiada por seta. BENTO=Ben+To vira easter-egg overlay quando o último (Ben) fala. Landing redesenhada: 3 portas claras (História / Jogo das letras / Teclado livre), final da história volta pra landing (sem auto-nav pro teclado). PALAVRAS_RAPIDAS ganha SOS e os nomes individuais (JO, TETE, TATA).
- **v5 técnico** — bumbo + baqueta SVG no lugar da bolinha que andava de lado a lado. Toggle 🥁 (default mudo) liga tique audível. Violão → guitarra: preset 0240 → 0270 → **0260 Stratocaster** (Lucas reportou 0270 horroroso). UX dos botões padronizada (emojis em todos os "próximo", `.botao.grande` no tocar do teclado). Teclado mobile mais espaçado.
- **v5 narrativo + Karplus-Strong + 4 velocidades** (atual) — reformulação completa em 6 episódios: E1 primeiro-dia (lógica geral), E2 time de ping-pong (Caca + Jo + Tete), E3 time de xadrez (Tata + **Tito** + **Lila** — 2 personagens novos), E4 futebol-recap (todos juntos), E5 SOS-lição (tom mais sério, sobre confiança), E6 segredo (turma sussurra preparando surpresa pra Nena). 4 ações novas: `aprender-toques`, `time-apresentacao`, `recap-nomes`, `segredo-parabens`. Síntese da guitarra reescrita em **Karplus-Strong** (pluck de string realista). Slider BPM substituído por **4 velocidades nomeadas** (tartaruga / menino / coelho / guepardo) — default = menino (75 BPM, era 120). Seletor de velocidade aparece no teclado e nas cenas com pulso.
