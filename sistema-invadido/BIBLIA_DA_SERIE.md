# SISTEMA INVADIDO — Bíblia da série

Série de suspense interativa em 10 episódios, vertical (9:16), cerca de 75 s cada, animação 2D minimalista.
O público decide o rumo da história comentando **A** ou **B** no fim de cada episódio.

## Identidade visual (não mudar entre episódios)

| Item | Valor |
|---|---|
| Paleta | fundo `#060912`, paredes `#17213a`, azul `#3d8bff`, ciano `#6fd3ff`, vermelho `#ff2d3d`, amarelo de destaque `#ffd23f` |
| Tipografia | Montserrat Black/ExtraBold (títulos e legendas), JetBrains Mono (interfaces do hacker e câmeras) |
| Legendas | 1 a 3 palavras por vez, MAIÚSCULAS, a palavra falada em amarelo, as palavras-chave em vermelho; o hacker em fonte mono com contorno vermelho |
| Câmeras de segurança | tom frio, linhas de varredura, `● REC`, data/hora `15/11 HH:MM:SS` |
| Código | `src/remotion/theme.ts` (cores/fontes), `src/remotion/fx/Fx.tsx` (câmera, glitch, grão) |

## Personagens

### BIA (protagonista, 22 anos)
- Cabelo preto preso em rabo de cavalo, camiseta branca com **uma faixa vermelha horizontal**, calça preta e tênis brancos.
- Inteligente e observadora, mas impulsiva sob pressão.
- Expressões já modeladas: `neutral`, `surprised`, `shock`, `fear`, `suspicious`, `determined`.
- Poses prontas: `idle`, `phoneL`, `phoneBoth`, `phoneFace`, `raiseR`, `reach`, `scared`, `handle`, `run`, além de IK (`lT`/`rT`) para a mão alcançar qualquer ponto.
- Componente: `src/remotion/characters/Bia.tsx`. A folha de modelo fica na composição `CharacterSheet`.

### HACKER
- Nunca aparece. Fala pela TV, pelo celular e pelos sistemas do prédio.
- Voz: pt-BR-AntonioNeural, rate −14 %, pitch −12 Hz, mais o tratamento FFmpeg `hacker` em `pipeline/tts.py` (pitch −4 semitons, bitcrush, flanger, eco).
- Símbolo: triângulo vermelho de alerta e barras de áudio que reagem à voz (`HackerTV`).
- **Não revelar** rosto, identidade nem motivação antes do momento planejado.

### MORADORES
- Figuras simples, vistas de lado e só pelas câmeras: `homemAzul` (o homem de blusa azul da escada), `senhora`, `rapaz`, `moca`, `senhor`, `vizinho` (`src/remotion/characters/Resident.tsx`).

### Narrador
- pt-BR-AntonioNeural, rate −4 %, pitch −7 Hz, EQ encorpada. Fala sempre em segunda pessoa ("você").

## Cenários
- **Apartamento da Bia (7º andar)**: sala com sofá sob a janela (cidade e lua), TV no rack, porta com fechadura eletrônica (LED verde/vermelho), mesinha com caneca vermelha, detector de fumaça com LED piscando (mistério deixado em aberto) e grade de ventilação. Código: `sets/Apartment.tsx`.
- **Prédio**: `Corridor` (corredores por andar), `Stairwell` (Escada B), `Elevator` (elevador de serviço), `ExitHall` (portaria). Código: `sets/Building.tsx`.

## Continuidade do EP. 1 — "VOCÊ ESTÁ AO VIVO"
- A live mostrava a Bia com 1 s de atraso, e 27.483 pessoas assistiam.
- A TV anunciou "SISTEMA DO PRÉDIO COMPROMETIDO". A porta foi trancada às 23:46.
- **Regra nº 1**: apenas uma rota de fuga será liberada. O cronômetro começou em 01:30.
- **Pista**: a câmera da Escada B repete em loop os mesmos 3 s (23:47:12 → 23:47:14), com o homem de blusa azul.
- O elevador de serviço estava parado e aberto no 7º andar, **vazio**. Ele voltou ao 7º andar ("DING") trazendo uma **mochila vermelha**.
- Mensagem do hacker: "VOCÊ NÃO ESTÁ SOZINHA NO ANDAR." O hacker reduziu o cronômetro para 00:10. Passos se aproximam e a sombra de pés aparece na fresta da porta.
- No fim, a mochila toca e o celular da Bia recebe uma chamada de **"VOCÊ"**. O cronômetro ficou congelado em 00:06 ("VOTAÇÃO ABERTA").

## Ramificações para o EP. 2
- **A — Escadas**: a Bia desce pela Escada B e descobre que a câmera exibia uma gravação. A escada real mostra por que o loop foi montado (e quem não queria que se visse o que acontece lá).
- **B — Elevador**: a Bia entra no elevador e precisa descobrir quem deixou a mochila vermelha. O celular que toca dentro dela está ligado ao número dela.
- **Convergência (EP. 3–4)**: as duas rotas levam à sala técnica do subsolo, onde ficam as gravações e o servidor do prédio.

## Arco da temporada (revelação gradual, nada disso aparece no EP. 1)
1. Quem controla o prédio.
2. Por que estes moradores foram escolhidos.
3. Por que as transmissões estão sendo manipuladas (atraso de 1 s, loop da escada).
4. Quem mais participa do jogo (os "espectadores" da live).
5. Se o hacker quer matar os moradores ou protegê-los de outra ameaça.

## Regras de edição (retenção)
- Começar direto no gancho, sem vinheta.
- Trocar de enquadramento a cada 3–4 s, no máximo.
- Cada cena traz uma informação, um perigo ou uma dúvida nova.
- Fazer uma pausa curta antes das revelações. Votação clara e fácil de entender.
- Terminar logo depois da revelação final, com corte seco para o preto.
