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

### DAVI (manutenção, ~30 anos) — a partir do EP. 2A
- Cabelo castanho curto, uniforme de manutenção cinza-azulado, crachá "DAVI" no peito e chaveiro metálico na mão direita.
- Componente `characters/Davi.tsx` (`Keychain` preso à mão via `holdR`).
- Voz: en-US-AndrewMultilingualNeural falando português, sem efeitos.
- Fica sempre na porta da área técnica do 6º andar.

### HOMEM DE BLUSA AZUL (versão anterior descartada do EP. 2A)
- Ainda existe como figura das câmeras (`LOOKS.homemAzul`) e em `characters/Man.tsx`.

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

## Continuidade do EP. 2A — "A CÂMERA MENTIU" (venceu a Rota A)
- No celular: "VOTAÇÃO ENCERRADA / ROTA A LIBERADA". A fechadura da porta 702 ficou verde.
- Diante da porta da escada do 7º, chega uma chamada de "VOCÊ". A imitação digital da voz da Bia diz: "Não desce! Volta pro elevador!"
- CAM 07 — ESCADA mostrava, às 22:46:57 (horário congelado), três silhuetas descendo em loop. O patamar real do 7º estava vazio.
- A Bia desceu UM lance até o patamar do 6º. O lance seguinte está fechado por uma grade metálica de segurança com cadeado ("BLOQUEADO").
- DAVI saiu pela porta corta-fogo de ACESSO TÉCNICO do 6º, que fecha e trava sozinha atrás dele. Ele a destranca com uma chave mecânica.
- O hacker mandou: "ALERTA — NÃO CONFIE NO FUNCIONÁRIO."
- A CAM 12 — CORREDOR TÉCNICO ("AO VIVO") mostra uma imagem fabricada da Bia já entrando atrás de Davi. A Bia real continua parada do lado de fora.
- Nova votação: **A** = seguir Davi; **B** = continuar sozinha (na escada, perto da grade).
- Posições fixas no patamar do 6º: porta técnica à esquerda, Davi em frente/ao lado dela, Bia junto à grade (`LS` em `sets/Landings.tsx`).

## Continuidade do EP. 2B — "O ELEVADOR NÃO VAI PARA O TÉRREO" (Rota B)
- Votação: "ELEVADOR ESCOLHIDO". O elevador de serviço chega ao 7º, a Bia entra e aperta "T".
- A mochila VERMELHA do EP. 1 está no canto da cabine, com a etiqueta "DAVI — MANUTENÇÃO". Hacker: "NÃO TOQUE NA MOCHILA."
- O elevador desce 7 → 6 e para; as luzes piscam. Hacker: "VOCÊ JÁ CHEGOU AO TÉRREO."
- CAM 04 — PORTARIA ("AO VIVO") mostra uma imagem fabricada da Bia saindo na portaria.
- Dentro da mochila: crachá do DAVI (manutenção), uma chave física e um caderno: "SE O SISTEMA FOR INVADIDO, NÃO CONFIE NO PAINEL DIGITAL." O desenho aponta "6º ANDAR — ACESSO TÉCNICO".
- O interfone (que diz ser a "central de segurança") sabe o nome dela e manda "Permaneça na cabine… Não abra essa porta… Não responda."
- Uma voz de fora bate na porta: "Sou da manutenção! O elevador parou no sexto!" (voz do Davi, abafada). Último grito: "BIA! NÃO ESCUTA ESSE INTERFONE!"
- Votação: **A** = confiar na voz do lado de fora; **B** = obedecer à central de segurança.
- Voz do interfone: pt-BR-AntonioNeural, mais grave, com filtro `intercom` (difere do narrador pelo timbre e pelo filtro).
- Os dois ramos convergem no ACESSO TÉCNICO do 6º andar (2A: a porta do Davi; 2B: o desenho do caderno).

## Continuidade do EP. 3A — "NÃO CONFIE EM MIM" (após o 2B; venceu A, confiar na voz de fora)
- Davi abre à força, com uma alavanca de manutenção, a porta do elevador parado no 6º. A Bia sai com a mochila e a entrega a ele, mas fica com o caderno e a chave.
- Corredor do 6º (`sets/Hall6.tsx`): elevador à esquerda, porta de MANUTENÇÃO com leitor de crachá à direita.
- Mensagem: "NÃO CONFIE NO FUNCIONÁRIO." Davi diz que alguém bloqueou o acesso dele; o leitor mostra "ACESSO NEGADO" duas vezes.
- "CÂMERA 06 — GRAVAÇÃO" mostra Davi ao celular diante do elevador: "Ela já entrou?" É uma gravação FALSIFICADA (Davi está realmente assustado).
- Final: "Bia, escuta. Isso não aconteceu." / "Como eu vou saber?" Votação: **A** = continuar com Davi; **B** = seguir sozinha.
- Vozes a partir do EP. 3A: Davi = pt-BR-AntonioNeural (timbre natural); narrador = Antonio mais grave e mais lento (só na abertura e na votação).
- Encerramento padrão: "● TRANSMISSÃO INTERROMPIDA / SISTEMA INVADIDO / CONTINUA…"

## Continuidade do EP. 4 — "A PROVA QUE NÃO EXISTE" (após 3A; venceu A, continuar com Davi)
- A Bia decide confiar em Davi. Eles reveem a CÂMERA 06: na gravação o elevador aparece FECHADO, mas Davi já o tinha aberto à mão quando ela saiu (flash do 3A). Prova de que a gravação foi alterada.
- Na gravação, o rosto do Davi distorce por um instante.
- O corredor do 6º tem uma câmera de segurança no teto (`H6.cam`), com luz vermelha, que gira para segui-los. Davi indica a passagem lateral escura à direita.
- Mensagens: "VOCÊ DESCOBRIU A GRAVAÇÃO." / "MAS AINDA NÃO ENTENDEU O JOGO." Depois, numa transmissão clandestina: "VOCÊ NÃO É A ÚNICA PARTICIPANTE." com o quadro da câmera do APARTAMENTO 604 (porta fechada) e três batidas abafadas.
- Votação: **A** = investigar o 604; **B** = seguir com Davi. Não mostrar quem está no 604.
- Ritmo: vozes ~1,10x (taxa +7% a +9% na síntese); duração máxima de 90 s.

## Continuidade do EP. 5 — "O APARTAMENTO 604" (após o EP. 4; venceu A, investigar o 604)
- Corredor dos apartamentos do 6º (`AptCorridor`): portas 601–605. A 604 tem leitor eletrônico à esquerda com luz vermelha; há uma câmera no teto. Davi fica à esquerda da porta, Bia à direita.
- CLARA (voz feminina adulta, cansada; pt-BR-FranciscaNeural com pitch −14 Hz e filtro `muffled` — a Thalita foi descartada por não soar brasileira) está presa no 604. A fechadura "travou sozinha", com o mesmo bloqueio do elevador. Ela NÃO aparece.
- Clara viu um homem entrando na sala de segurança: não viu o rosto, mas reconheceu o uniforme azul com o símbolo da manutenção. Davi: "Tem outros funcionários usando esse uniforme." A dúvida volta, mas sem provas.
- O crachá do Davi tem um pequeno símbolo de chave inglesa (o "símbolo da manutenção").
- Mensagens: "VOCÊ ENCONTROU A OUTRA PARTICIPANTE." / "MAS NÃO PODE SALVAR TODO MUNDO." / "SE ABRIR ESSA PORTA, OUTRA SERÁ TRANCADA." (não revelar se é blefe).
- Termina com a mão da Bia hesitando perto da maçaneta (sem tocar). Votação: **A** = tentar salvar Clara; **B** = ir à sala de segurança.

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
