# Sabiá Morse

App standalone (1 HTML) que ensina Morse pro Bento (5 anos) via uma história na escola dos sabiás.

> *"Pássaros escrevem com música."*

**No ar:** https://freirelucas.github.io/sabi-/

## Modos

- **História do To** — 10 cenas. To, Ben, Caca e os três colegas aprendem com a professora Nena. Final: surpresa de aniversário pra ela.
- **Teclado** — escreve uma palavra, ouve em sabiá / palma / telégrafo / violão, com BPM e loop.
- **Letra por letra** — 26 letras × 26 palavras-âncora (A→Asa, B→Bento…).

## Rodar local

```bash
python3 -m http.server 8000
```

## Stack

HTML + CSS + JS puro num único `index.html`. Sem build, sem deps de runtime. Detalhes de arquitetura, decisões narrativas e pendências em [`CLAUDE.md`](./CLAUDE.md).

## Créditos

- Sabiá-laranjeira (*Turdus rufiventris*) — ave-símbolo do Brasil
- Tipografia: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Nunito](https://fonts.google.com/specimen/Nunito)
