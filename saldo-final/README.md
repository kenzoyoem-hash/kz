# SALDO FINAL — Episódio 01: Cinco anos por R$ 80 mil

Minissérie animada brasileira em 2D minimalista com profundidade 2.5D, no formato vertical 9:16
(1080 × 1920, 30 fps, 89 s). O projeto inteiro é código editável: personagens vetoriais (SVG) animados
em React/Remotion, vozes neurais em pt-BR, e trilha e efeitos sintetizados.

## Entregas

| Arquivo | O que é |
|---|---|
| `out/saldo-final-ep01.mp4` | **Episódio final**: H.264 + AAC, 1080 × 1920, 30 fps, 89 s, legendas na imagem, −14 LUFS |
| `out/saldo-final-ep01.srt` | Legendas em texto, para enviar como legenda nas plataformas |
| `out/personagens.png` | Folha dos modelos oficiais (Maya, Noah, Maya de 2041 e figurantes) |
| `public/audio/voices/*.wav` | Cada fala em um arquivo separado (l01–l18) |
| `public/audio/music/trilha_ep01.wav` | Trilha original, sem a abaixada para as vozes |
| `public/audio/sfx/*.wav` | Efeitos sonoros usados no episódio |
| `public/audio/stems/` | Stems de voz e de efeitos; `public/audio/mix_ep01.wav` é a mixagem final |
| `GUIA_DE_CONTINUIDADE.md` | Personagens, cenários, regras do universo e o que manter nos próximos episódios |

## Requisitos

- Node.js 18 ou mais recente (testado com o 22) e npm
- Python 3.10 ou mais recente, mais FFmpeg/FFprobe (só para regenerar o áudio)
- Chrome ou Chromium. O `remotion.config.ts` usa `REMOTION_CHROME`, se essa variável estiver definida,
  ou `/opt/pw-browsers/chromium`. Sem nenhum dos dois, o Remotion baixa o próprio navegador.

## Comandos

```bash
npm install            # dependências (Remotion 4, React 18, TypeScript)
npm run dev            # Remotion Studio no navegador (composições EP01 e Personagens)
npm run render         # gera out/saldo-final-ep01.mp4 (H.264 + AAC)
npm run render:preview # versão de teste em 540 × 960
npm run sheet          # folha de personagens em out/personagens.png
npm run typecheck      # verificação do TypeScript
```

### Regenerar o áudio (só quando falas, efeitos ou trilha mudarem)

```bash
pip install edge-tts numpy          # faster-whisper é opcional (só para o controle de qualidade)
npm run audio                       # = python3 pipeline/tts.py && python3 pipeline/mix.py
python3 pipeline/export_srt.py      # SRT
python3 pipeline/check_voices.py    # opcional: transcreve cada fala e compara com o roteiro
```

`tts.py` sintetiza cada fala (edge-tts, vozes Francisca e Antonio), aplica o tratamento do personagem
(chamada de vídeo, telefone, sussurro) e agenda as falas. Ele salva os tempos de cada palavra em
`src/data/cues.generated.json`. As legendas e os gestos dos personagens usam esses tempos, então tudo
continua sincronizado quando uma fala muda de duração. `mix.py` junta vozes, efeitos e trilha, abaixa a
música sob as falas, masteriza em −14 LUFS e exporta a intensidade da voz quadro a quadro
(`voice_env.generated.json`), que move cabeça e tronco de quem está falando. A síntese de voz precisa de
acesso a `speech.platform.bing.com`.

## Estrutura

```
saldo-final/
├── package.json · tsconfig.json · remotion.config.ts
├── src/
│   ├── index.ts · Root.tsx · Episode01.tsx   composição de 2670 quadros (89 s) + folha de personagens
│   ├── characters/   Rig.tsx (rig oficial) · Maya · Noah · FutureMaya · Extras · poses.ts
│   ├── scenes/       Scene01 … Scene11 (uma cena por arquivo) · AptStage (palco do apartamento)
│   ├── components/   Camera (parallax 2.5D) · Background (cidade, apartamento, quarto do Noah, sala de 2041)
│   │                 Phone (app TEMPO) · Hourglass · Subtitles · Effects · Fonts
│   ├── styles/theme.ts   paleta oficial e fontes
│   ├── lib/anim.ts       interpolação, keyframes, tremores
│   └── data/   script.json (roteiro e vozes) · dialogue.ts · timeline.ts · audio_timeline.json (efeitos e trilha)
├── pipeline/   tts.py · mix.py · sfx.py · export_srt.py · check_voices.py
├── public/     fonts/ (Montserrat, JetBrains Mono) · audio/ (voices, music, sfx, stems, mix)
└── out/        saldo-final-ep01.mp4 · saldo-final-ep01.srt
```

## Como as personagens se movem

`characters/Rig.tsx` é um esqueleto 2D com tronco, cabeça (inclinação e direção do rosto), ombros,
cotovelos, quadris e joelhos. A altura do quadril é calculada pela pose das pernas, então sentar,
levantar e pular mantêm os pés no chão. As poses ficam em `poses.ts` (`sit`, `sitPhone`, `cheer`,
`headHands`, `standPhoneEar`, `rigid`, entre outras). O tempo é animado com `posekf`, o ciclo de
caminhada com `walk`/`walkTo`. O rig também cuida do movimento secundário: respiração, inércia do
cabelo, tremor das mãos e gestos acompanhando a voz.

## Criar o próximo episódio

1. Copie `src/data/script.json` e `audio_timeline.json` para o novo episódio e escreva as falas e os efeitos.
2. Crie as cenas reutilizando `Maya`, `Noah`, `FutureMaya`, `AptStage`, `PhoneInsert`, as telas do app
   TEMPO, `Hourglass`, `YearStream` e `Glitch`.
3. Registre a nova composição em `Root.tsx`, com no máximo 2700 quadros.
4. Rode `npm run audio` e depois `npm run render`.
