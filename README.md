# Sabiá Morse

App standalone (1 HTML) que ensina Morse pro Bento (5 anos) via uma história na escola dos sabiás.

> *"Pássaros escrevem com música."*

**No ar:** https://freirelucas.github.io/sabi-/

## Modos

Três áreas distintas, sem mistura entre si:

- **História** — 6 episódios. To e Ben no primeiro dia de escola; conhecem o **time de ping-pong** (Caca, Jo, Tete) e o **time de xadrez** (Tata, Tito, Lila); jogam futebol juntos; aprendem que **SOS é pedido de ajuda**; preparam um parabéns secreto pra Nena.
- **Jogo das letras** — 26 letras × 26 palavras-âncora (A→Asa, B→Bento, C→Casa…). Ouve cada letra e palavra em canto sabiá.
- **Teclado livre** — escreve qualquer palavra, ouve em sabiá / palma / telégrafo / **guitarra**, com 4 velocidades (🐢 🚶 🐰 🐆) e loop.

## Rodar local

```bash
python3 -m http.server 8000
```

## Stack

HTML + CSS + JS puro num único `index.html`. Sem build, sem deps de runtime. Detalhes de arquitetura, decisões narrativas e pendências em [`CLAUDE.md`](./CLAUDE.md).

## Créditos

- **Canto do sabiá**: [XC421912](https://xeno-canto.org/421912) — *Turdus rufiventris*, gravado por Fernando Igor de Godoy em 2017-03-30 (RPPN Estação Veracel, Porto Seguro, Bahia). Licença [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Convertido para mono 96 kbps, embutido como base64 inline (~37 KB).
- Sabiá-laranjeira (*Turdus rufiventris*) — ave-símbolo do Brasil
- Tipografia: [Fraunces](https://fonts.google.com/specimen/Fraunces) + [Nunito](https://fonts.google.com/specimen/Nunito)

## Licença

O canto do sabiá embutido é CC BY-NC-SA 4.0 — uso não-comercial, exigindo o mesmo licenciamento em derivados. Como esse é um app pessoal pedagógico (não comercial) e o repo é aberto, está em conformidade.
