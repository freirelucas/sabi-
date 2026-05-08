# Sabiá Morse

App pedagógico em HTML standalone para ensinar código Morse ao Bento (5 anos), através da história do filhote-sabiá **To** e seu vizinho-amigo **Ben** na escola dos sabiás. A aula é especial: boas-vindas para Ben e To, e aniversário da **Nena** (mãe do Bento) — termina com toda a turma cantando **Parabéns** pra ela.

> *"Pássaros escrevem com música."*

## Como rodar

Abre `index.html` em qualquer navegador moderno. Funciona em desktop e mobile. Em iPhone, "Adicionar à Tela de Início" funciona como app nativo.

Para servir localmente:
```bash
python3 -m http.server 8000
# ou
npx serve
```

## O que tem dentro

Três modos de uso (landing tem três portas):

1. **História do To** — 9 cenas narrativas. To acorda no ninho, encontra Ben, vão pra escola, conhecem Caca (canarinho), aula especial do professor (boas-vindas + aniversário Nena), três colegas Jo/Tete/Tata se apresentam, contam história de Didi/Toto/Todi, professor apresenta palavras grandes (Mama, Papa, Mim), revelação BENTO = Ben + To, e final coletivo cantando **PARABÉNS NENA**.
2. **Teclado do Sabiá** — escreve qualquer palavra e ouve em 4 vozes (sabiá / palma / telégrafo / violão), com slider de BPM (40–100), notação ·– ou 0/1, repetições 1×/2×/4×/8× ou loop infinito. Palavras prontas: BENTO, NENA, PARABENS NENA, TO, BEN, CACA, OI, MAMA, PAPA, MIM, JUDO.
3. **Letra por letra** — 26 letras, 26 palavras-âncora (A→Asa, B→Bento, C→Casa, D→Didi, E→Estela, F→Flor, G→Galho, H→Homem, I→Ipê, J→Judo, K→Karatê, L→Lua, M→Mama, N→Nena, O→Oi, P→Papa, Q→Quintal, R→Rio, S→Sabiá, T→To, U→Uva, V→Vento, W→Wawe, X→Xícara, Y→Yo, Z→Zebra). Mostra forma rítmica e Morse, com botões pra ouvir letra e palavra inteira em sabiá ou violão.

## Áudio

Usa [WebAudioFont](https://github.com/surikov/webaudiofont) via CDN do GitHub Pages para violão acústico real (~118 KB) e Bird Tweet (~9 KB). Total ~290 KB de download na primeira abertura, depois cacheia. Fallback para síntese FM melódica quando offline.

A voz default em todo o fio narrativo é **sabiá** (Sol4 ponto / Ré4 traço, mesmas alturas das cordas soltas do violão).

## Stack

HTML + CSS + JS puro. Sem bundler, sem build step, sem dependências de runtime além da CDN do WebAudioFont. Um único arquivo (~82 KB).

## Hospedar no GitHub Pages

1. Sobe o repositório no GitHub
2. Settings → Pages → Source: `main` branch → `/` (root)
3. Acessa em `https://USUARIO.github.io/sabia-morse/`

## Status

**v2 narrativa com final-aniversário** — funcional. Falta teste em iPhone real do Bento. Pendências e arquitetura detalhadas em [`CLAUDE.md`](./CLAUDE.md).

## Créditos

- WebAudioFont — Sergey Surikov ([repo](https://github.com/surikov/webaudiofont))
- Tipografia: [Fraunces](https://fonts.google.com/specimen/Fraunces) (display), [Nunito](https://fonts.google.com/specimen/Nunito) (body) via Google Fonts
- Sabiá-laranjeira (*Turdus rufiventris*) — ave-símbolo do Brasil, inspiração do projeto
