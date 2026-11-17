# SALDO FINAL — EP. 1: “Quanto vale sua vida?”

Minissérie animada interativa em 2D, com contorno preto e cores chapadas. Formato vertical 9:16
(1080 × 1920, 30 fps, 89 s). Tudo é código editável: personagens vetoriais com rosto expressivo e boca
sincronizada, animados em React/Remotion; vozes neurais em pt-BR; trilha e efeitos originais sintetizados.

- **Roteiro, fichas, regras do universo, storyboard e direção**: [`EP01_ROTEIRO_E_STORYBOARD.md`](EP01_ROTEIRO_E_STORYBOARD.md)
- **Continuidade para os próximos episódios**: [`GUIA_DE_CONTINUIDADE.md`](GUIA_DE_CONTINUIDADE.md)

## Entregas (`out/`)

| Arquivo | Conteúdo |
|---|---|
| `saldo-final-ep01.mp4` | versão final: animação, áudio, legendas, título e cartela de votação A/B |
| `saldo-final-ep01-limpo.mp4` | versão limpa: animação e áudio **sem nenhum texto**, para editar |
| `saldo-final-ep01.srt` | legendas com o nome de quem fala |
| `personagens.png` | folha de modelo do elenco (poses, expressões, bocas, perfis) |
| `storyboard_ep01.png` | um quadro de cada plano, na ordem |

Áudios separados: `public/audio/voices/` (uma fala por arquivo), `music/`, `sfx/`, `stems/` e `mix_ep01.wav`.

## Comandos

```bash
npm install
npm run dev            # Remotion Studio (composições EP01, EP01-limpo, Personagens)
npm run render         # out/saldo-final-ep01.mp4
npm run render:limpo   # out/saldo-final-ep01-limpo.mp4
npm run render:preview # teste rápido em 540 × 960
npm run audio          # regenera vozes, mixagem e SRT (pip install edge-tts numpy)
python3 pipeline/check_voices.py   # opcional: confere cada fala com o Whisper (pip install faster-whisper)
```

O navegador usado no render vem de `REMOTION_CHROME` ou de `/opt/pw-browsers/chromium`. Sem nenhum dos
dois, o Remotion baixa o próprio navegador. As vozes precisam de acesso a `speech.platform.bing.com`.

## Como funciona

- **`src/characters/Toon.tsx`**: motor dos personagens. Contorno preto, IK nos braços, vistas de frente e de
  perfil, caminhada e corrida, 14 expressões, piscadas, respiração e a pulseira de saldo de vida.
- **Sincronia labial**: `pipeline/tts.py` salva o tempo de cada palavra e `pipeline/mix.py` salva a intensidade
  da voz quadro a quadro. `data/dialogue.ts → mouthAt` combina os dois: a abertura vem do volume real e o
  formato (A/E/I/O/U/M) vem da letra falada naquele instante.
- **Edição de diálogo automática**: pausas longas da síntese são encurtadas e os tempos das palavras são
  remapeados, para as falas caberem no ritmo das cenas.
- **Cenas** (`src/scenes/Scene01…09`) usam o tempo global em segundos, sincronizado com o áudio. Reaproveitam
  os cenários de `src/sets/Sets.tsx` e o palco do quarto (`Hosp.tsx`).

## Próximo episódio

Depois da votação: crie `script.json` e `audio_timeline.json` do EP. 2, escreva as cenas reaproveitando o
elenco e os cenários, registre a composição em `Root.tsx` (no máximo 2700 quadros) e rode `npm run audio`
e `npm run render`.
