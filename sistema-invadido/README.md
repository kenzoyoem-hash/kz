# SISTEMA INVADIDO — projeto de produção

Série animada interativa (9:16, cerca de 75 s por episódio). Este repositório contém o EP. 1
pronto e todo o pipeline editável para produzir os próximos episódios.

## Entregas do EP. 1 (`done/`)
| Arquivo | O que é |
|---|---|
| `sistema_invadido_ep01.mp4` | **Vídeo final**: 1080×1920, 30 fps, H.264 + AAC, −14 LUFS, legendas queimadas |
| `ep01_video_sem_audio.mp4` | Render limpo do Remotion (sem legendas e sem áudio), para reedição |
| `ep01_legendas.ass` | Legendas estilizadas (palavra a palavra), usadas na queima via libass |
| `ep01_legendas.srt` | Legendas simples, para enviar como legenda nas plataformas |
| `ep01_capa_animada.mp4` | Capa/teaser da série (3 s), feita com HyperFrames + GSAP |
| `sistema_invadido_ep02a.mp4` | **EP. 2A — A escada não está vazia** (caminho A), com legendas `ep02a_legendas.*` |

## Estrutura
```
sistema-invadido/
├─ raw/          vozes (voice/epXX), mixagem e stems (mix/)
├─ references/   vídeos de referência de estilo e edição
├─ src/
│  ├─ episodes/epXX/   script.json (roteiro e vozes) · timeline.json (cenas, SFX, trilha, posição das legendas)
│  │                   *.generated.json (tempos das falas, palavras do Whisper, envelopes de voz)
│  ├─ pipeline/        tts.py · sfx.py · mix.py · captions.py · build_ep.sh
│  ├─ remotion/        animação (React): characters/ sets/ ui/ fx/ episodes/
│  ├─ hyperframes/     composições HTML/GSAP (capa da série)
│  └─ public/fonts/    Montserrat e JetBrains Mono (woff2 para o Remotion, ttf para o libass)
├─ done/         vídeos e legendas finais
└─ BIBLIA_DA_SERIE.md   personagens, continuidade e ramificações A/B
```

## Ferramentas e papéis
| Ferramenta | Versão | Uso |
|---|---|---|
| FFmpeg (libass) | 6.1.1 | tratamento das vozes, loudnorm, queima das legendas ASS, encode final |
| faster-whisper | 1.2.1 (modelo `small`, int8, CPU) | marcas de tempo palavra a palavra das falas em pt-BR → legendas |
| Remotion | 4.0.543 | **motor principal de animação** (personagens, câmera, cenas) |
| HyperFrames | 0.9.54 | capa animada da série (HTML + GSAP) |
| edge-tts | 7.3.1 | vozes neurais pt-BR (narrador, Bia e base da voz do hacker) |
| yt-dlp | 2026.10.26 | instalado, mas não foi necessário: todos os sons e imagens são originais |
| NumPy | — | síntese procedural da trilha e dos efeitos sonoros (sem direitos de terceiros) |

## Produzir um episódio
```bash
cd src
npm install
pip install faster-whisper edge-tts numpy fonttools brotli
./pipeline/build_ep.sh 1            # (ou 2a, 2b…) tudo: vozes → mix → legendas → render → MP4 final
SKIP_AUDIO=1 ./pipeline/build_ep.sh 1   # só o vídeo, quando apenas a animação mudou
npx remotion studio remotion/index.ts   # editar e pré-visualizar no navegador
```
Observações:
- O download do modelo do Whisper usa `huggingface.co` e o CDN `us.aws.cdn.hf.co`. Se o modo Xet falhar, use `HF_HUB_DISABLE_XET=1`.
- As vozes usam `speech.platform.bing.com` (edge-tts).
- Fora deste ambiente, defina `CHROME=` com o caminho do Chrome/Chromium, ou remova `--browser-executable` do script.

## Entonação das vozes (marcações no roteiro)
Escreva as marcações dentro do texto das falas em `script.json`. Cada uma vale até a próxima:

| Marcação | Efeito |
|---|---|
| `[lento]` / `[rapido]` | velocidade −16 % / +14 % |
| `[grave]` / `[agudo]` | tom −9 Hz / +10 Hz |
| `[sussurro]` | mais baixo, mais lento e mais grave |
| `[alto]` | grito/ênfase (mais volume e tom) |
| `[tenso]` / `[misterioso]` | leve aceleração e tom acima / mais lento e grave |
| `[pausa]` / `[pausa longa]` / `[respira]` | silêncio de 0,45 s / 0,9 s / 0,3 s |

Exemplo: `"[lento] Você tem dez segundos… [pausa] [rapido] E alguém está se aproximando."`
Cada trecho é sintetizado separadamente com sua própria velocidade e tom, e o pipeline acrescenta uma micro-variação automática para evitar monotonia.

Tratamentos de voz disponíveis (`fx` em `voices`): `narrator`, `bia`, `whisper`, `phone` (voz saindo do celular), `hacker`, `stair` (eco de escada), `far` (voz vinda de longe).

## Gestos disponíveis (Bia/Person)
`idle`, `phoneL`, `phone="both"`, `phoneEar`, `stop`, `coverMouth`, `pointPhone`, `hugSelf`, `armsOut`, `push`, `raiseR`, `scared`, `handle`, `run`, além de vista lateral (`facing="side"` com `walk`, `nSh/nEl`) e IK livre (`rT`/`lT` + escorço `rFs`/`lFs`).

## Criar o EP. 2
1. Copie `src/episodes/ep01` para `ep02` e reescreva `script.json` (falas e horários aproximados) e `timeline.json` (cenas, SFX, trilha).
2. Copie `src/remotion/episodes/ep01` para `ep02` e monte as cenas reaproveitando `Bia`, `Resident`, `Apartment`, `Stairwell`, `Elevator`, `Corridor`, `CCTV`, `RuleCard`, `Timer`, `VoteCard`, `MessageBubble`, `IncomingCall`, `HackerTV`, `Glitch` etc.
3. Registre a composição `EP02` em `remotion/Root.tsx`.
4. Rode `./pipeline/build_ep.sh 2`.
