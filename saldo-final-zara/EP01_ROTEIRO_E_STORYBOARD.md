# SALDO FINAL — EP. 1: “QUANTO VALE SUA VIDA?”

Vertical 9:16 · 1080 × 1920 · 30 fps · **89 s** (limite: 90 s) · animação 2D com contorno preto e cores chapadas.
O público vota **A** ou **B** nos comentários. O EP. 2 só será escrito depois do resultado.

---

## 1. Sinopse

Numa São Paulo onde vender anos de vida é tão comum quanto pagar um boleto, a entregadora Zara Vilar
descobre que o saldo de vida da mãe está zerando. Para salvá-la, precisa entregar dez anos dela mesma
à Áurea, a gigante que controla o comércio de tempo. Mas os anos da mãe não estão acabando: estão sendo
**sugados para a torre da Áurea**. Um estranho que “não existe no sistema” pede que Zara não assine,
e o executivo Ciro Voss oferece um acordo bom demais. Entre a vida da mãe e a verdade, quem decide é o público.

## 2. Ficha visual dos personagens

Modelos em `src/characters/Cast.tsx` e folha de modelo em `out/personagens.png`. Regras comuns: contorno
preto (#120E16), cores chapadas, sombra lateral simples, olhos grandes com brilho, boca sincronizada à fala.
Todo mundo usa no pulso esquerdo a **pulseira de saldo**: 10 segmentos dourados que mostram quanto de vida resta.

| Personagem | Visual fixo | Personalidade e atuação | Voz |
|---|---|---|---|
| **ZARA VILAR** (22) | pele marrom, black puff alto e cacheado com **mecha magenta**, argolas douradas, **jaqueta puffer cropped amarela**, top preto, calça cargo verde-oliva, tênis branco com sola magenta. No EP. 1 trabalha de entregadora (alças vermelhas da mochila térmica e sacola). Pulseira cheia (~82 %). | Sarcástica, impulsiva e corajosa. Sobrancelha arqueada, sorriso de canto, gestos grandes. Sob pressão, punhos fechados e queixo para a frente. | Francisca (pt-BR), +8 % de velocidade, tom +3 Hz, sem eco |
| **DANTE REIS** (24) | pele clara oliva, cabelo preto bagunçado com laterais raspadas e **franja caindo sobre o olho**, sobretudo verde-petróleo comprido, moletom preto com capuz abaixado, olhos verde-água, ear cuff prateado. Pulseira pela metade. | Irônico e misterioso. Encostado no batente, braços cruzados, meio sorriso. Quando fala sério, aponta e se inclina para a frente. | Antonio (pt-BR), +10 %, tom +8 Hz (jovem) |
| **HELENA VILAR** (46) | mesma família de pele da Zara, cabelo ondulado nos ombros com **mecha grisalha**, camisola hospitalar azul-clara de bolinhas, **pingente dourado com o símbolo da Áurea**. Pulseira quase vazia, piscando. | Amorosa e cansada. Pálpebras pesadas e voz fraca. Toca o pingente quando esconde algo. | Thalita (pt-BR), −12 %, tom −8 Hz, voz fraca |
| **CIRO VOSS** (38) | pele clara, cabelo loiro-prateado penteado para trás, óculos retangulares, terno grafite, gravata vermelho-escura, **broche dourado da Áurea**. No EP. 1 aparece só como **holograma azul**. | Frio, elegante e manipulador. Mão na lapela, palma aberta oferecendo e sorriso de canto. | Antonio (pt-BR), −2 %, tom −10 Hz, tratamento de holograma |
| Atendente da Áurea | coque castanho, blazer creme com debrum dourado | simpática no automático | Thalita, +16 %, tom +8 Hz |
| Jovem no guichê | rabo de cavalo, moletom roxo | abatida | Francisca, tom +14 Hz |
| Rapaz da fila | boné vermelho, moletom verde | entediado no celular | Antonio, +14 % |
| Enfermeira (ao telefone) | só voz | apressada | Thalita, filtro de telefone |

## 3. Regras definitivas do universo

1. Cada pessoa nasce com um **saldo de vida** e o carrega numa pulseira de 10 segmentos dourados.
2. Vender anos é **legal e cotidiano**. Agências da **Áurea** funcionam como bancos: senha, fila, guichê e leitor de pulso.
3. Vender não envelhece o corpo na hora. Os anos saem do pulso como **partículas douradas** e correm por tubos até a **Torre da Áurea**.
4. Ricos compram anos. Pobres vendem para sobreviver (aluguel, dívidas, remédios).
5. **Transferência familiar**: anos podem ir de uma pessoa para outra, sempre pela Áurea, que cobra o custo do doador.
6. Quando o saldo zera, a pessoa morre.
7. **Segredo (não revelado no EP. 1):** a Áurea consegue **drenar** anos de alguém sem venda (“saque”).
   A Helena trabalhou para a Áurea. Dante não aparece nos registros do sistema. Ciro tem um laço pessoal com a família Vilar.
8. Cores narrativas: **dourado** = anos de vida · **vermelho** = alarme e perigo · **verde-petróleo** = Dante · **azul** = holograma e tecnologia.
9. Nada de texto dentro da animação: telas e letreiros usam ícones (ampulheta, pessoas, segmentos). Os textos ficam na camada de edição.

## 4. Roteiro completo (diálogos exatos)

> Os tempos são os das vozes gravadas (`src/data/cues.generated.json`).

**CENA 1 — AGÊNCIA ÁUREA** (0,0–12,4 s)
Close no leitor de pulso dourado; a câmera recua e sobe até a atendente, que acena.
- **ATENDENTE** (simpática, no automático): Próximo! Quantos anos vai vender hoje?
- **JOVEM** (abatida, estende o pulso): Três. Pra pagar o aluguel.
- **ATENDENTE** (aperta o botão, sorrindo): Três anos, confirmado. Tenha um ótimo dia!
  *(As partículas douradas saem do pulso da jovem, entram no leitor e sobem pelo tubo do teto. Um segmento da pulseira dela se apaga.)*
- **RAPAZ DA FILA** (sem tirar os olhos do celular): Mano, essa fila não anda…
  *(Travelling pela fila: todo mundo no celular. A porta abre: Zara entra com a mochila térmica.)*
- **ZARA** (ergue a sacola, sarcástica): Delivery! Quem pediu lanche pra vender a vida dos outros?

**CENA 2 — A LIGAÇÃO** (12,4–19,6 s)
O celular vibra no bolso. Zara atende.
- **ENFERMEIRA** (telefone): Zara Vilar? É do hospital. O saldo da sua mãe tá zerando.
  *(A agência escurece em volta dela; tremor de câmera em “zerando”.)*
- **ZARA** (choque que vira raiva): Zerando?! Ela tinha trinta anos ontem!
  *(A sacola cai. Ela dispara para a porta.)*

**CENA 3 — CORRIDA NA CHUVA** (19,6–24,6 s)
Travelling lateral pela cidade molhada e neon. A Torre da Áurea brilha no céu. Trovão.
- **ZARA** (ofegante): Aguenta, mãe. Aguenta…
  *(Chega à fachada branca do hospital, com a cruz verde.)*

**CENA 4 — HOSPITAL** (24,6–38,6 s)
Zara entra no quarto. Helena está na cama, com a pulseira quase vazia e piscando.
- **HELENA** (fraca, tentando sorrir): Filha… não era pra você me ver assim.
- **ZARA** (segura a mão dela, firme): Para, mãe. Eu vou resolver. Eu sempre resolvo.
  *(O terminal da Áurea ao lado da cama acende: duas pessoas, dez segmentos dourados passando de uma para a outra.)*
- **ZARA** (lendo a tela, engole em seco): Transferência familiar… dez anos meus pra ela.
- **ZARA** (estende o pulso para o leitor): Fechou. Nem penso duas vezes.

**CENA 5 — O SAQUE** (38,6–53,3 s)
A pulseira da Helena brilha. Um rio de partículas douradas sai do pulso dela, atravessa a janela e vai
até a torre, que se acende.
- **ZARA** (sem acreditar): Pera… os anos dela tão indo pra torre da Áurea?!
- **DANTE** (encostado na porta, braços cruzados): Isso não é doença. É saque.
- **ZARA** (agarra o suporte de soro como arma): Mano, quem é você?! Chega mais perto que eu te furo com o soro!
- **DANTE** (mãos para o alto, meio sorriso): Justo. Dante. E a sua mãe trabalhou pra eles, sabia?

**CENA 6 — O SEGREDO** (53,3–58,3 s)
- **ZARA** (abaixa o soro, vira-se para a mãe): Mãe… isso é verdade?
  *(Close: Helena aperta o pingente. Insert: o símbolo da Áurea brilha na mão dela.)*
- **HELENA** (desvia o olhar): Eu ia te contar… antes deles me acharem.

**CENA 7 — CIRO VOSS** (58,3–72,0 s)
O terminal falha e projeta um holograma azul: Ciro, mão na lapela.
- **CIRO** (calmo, cordial demais): Boa noite, Zara. Dez anos… e ela vive. Simples.
- **DANTE** (avança e aponta para o holograma): Não assina. Se vender pra eles, você vira propriedade deles.
- **CIRO** (aponta para Dante, sorriso de canto): Vai confiar num rapaz que nem existe no nosso sistema?
- **ZARA** (mão na boca, encara Dante): Tá zoando… ele não existe?!
  *(Dante não responde e desvia o olhar.)*

**CENA 8 — CLIFFHANGER** (72,0–77,4 s)
O monitor dispara um alarme vermelho. Helena agarra o pulso da filha.
- **HELENA** (sussurro urgente): Zara… o Ciro… ele é o seu…
  *(LINHA RETA no monitor. Corte seco para o preto. Só o apito, depois silêncio.)*

**CENA 9 — VOTAÇÃO** (77,4–89,0 s)
Zara olha para a câmera. À esquerda, o brilho dourado da Áurea (A); à direita, a silhueta do Dante (B).
- **ZARA** (direto para o público): Dez anos pela minha mãe… ou eu derrubo quem tá fazendo isso? Comenta A ou B, rápido, véi, que ela não tem tempo!

Cartela (camada de edição): **O QUE A ZARA DEVE FAZER?**
**A — VENDER 10 ANOS DE VIDA PARA SALVAR A MÃE** · **B — RECUSAR E DESCOBRIR QUEM CONTROLA O SISTEMA**

## 5. Cenas e duração

| # | Cena | Início–fim | Duração | Ritmo |
|---|---|---|---|---|
| 1 | Agência Áurea | 0,0–12,4 | 12,4 s | gancho em 0,2 s (“Quantos anos vai vender hoje?”) e humor no fim |
| 2 | A ligação | 12,4–19,6 | 7,2 s | tensão crescente, sem trilha até o grito |
| 3 | Corrida na chuva | 19,6–24,6 | 5,0 s | adrenalina, trilha no máximo |
| 4 | Hospital | 24,6–38,6 | 14,0 s | emoção, a trilha baixa |
| 5 | O saque | 38,6–53,3 | 14,7 s | revelação e humor (o soro) |
| 6 | O segredo | 53,3–58,3 | 5,0 s | silêncio, batimento |
| 7 | Ciro Voss | 58,3–72,0 | 13,7 s | duelo de vozes |
| 8 | Cliffhanger | 72,0–77,4 | 5,4 s | alarme, corte seco, 2,3 s de silêncio |
| 9 | Votação | 77,4–89,0 | 11,6 s | fala direta para o público |

## 6. Storyboard (planos)

Os quadros reais do vídeo, um por plano, estão em `out/storyboard_ep01.png`.

| Plano | Tempo | Enquadramento e câmera | Ação e atuação | Som |
|---|---|---|---|---|
| 1A | 0,0–1,5 | close extremo no leitor dourado → recua e sobe rápido (z 3,4 → 2,1) | atendente acena, sorriso profissional | pulso grave, murmúrio da agência |
| 1B | 2,3–4,2 | plano médio de dois: atendente + jovem de perfil | jovem triste, ombros caídos | murmúrio |
| 1C | 4,2–6,8 | plano médio | pulso no leitor; partículas saem do pulso e sobem ao tubo do teto; a pulseira perde um segmento | leitor (bip ascendente) + cintilar dourado |
| 1D | 6,8–8,4 | travelling lateral pela fila | todos no celular; rapaz revira os olhos | — |
| 1E | 8,4–12,4 | travelling até a porta → plano médio da Zara | Zara entra caminhando de perfil, vira de frente, ergue a sacola, sobrancelha arqueada | porta, chuva lá fora |
| 2A | 12,4–19,0 | plano médio fechado, câmera se aproximando; tremor em “zerando” | celular vibra; leva ao ouvido; neutra → preocupada → choque → raiva; a mão treme | vibração, atender, drone grave |
| 2B | 18,4–19,6 | plano médio | a sacola cai; Zara sai correndo de perfil | queda da sacola, whoosh |
| 3A | 19,6–24,6 | travelling lateral acompanhando a corrida; parallax em 4 camadas; chuva em primeiro plano | corrida (ciclo de 11 passos/s), respingos; expressão de medo → determinação | chuva, passos na água, respiração, trovão (clarão) |
| 4A | 24,6–28,4 | plano geral do quarto | Zara entra de perfil e para ao lado da cama; Helena fraca | porta, monitor (bip) |
| 4B | 28,4–33,0 | plano de dois | Zara segura a mão da mãe, rosto determinado | trilha emotiva baixa |
| 4C | 33,0–35,4 | insert no terminal | ícones de transferência, 10 segmentos | bip de interface |
| 4D | 35,4–38,6 | plano médio da Zara | estende o pulso, a pulseira brilha | — |
| 5A | 38,6–42,9 | plano geral (o rio dourado vai da cama à janela) | Zara vira para a janela: surpresa → choque; a torre acende | riser + cintilar contínuo |
| 5B | 42,9–45,5 | chicote para a porta, plano médio do Dante | encostado, braços cruzados, olhar frio | impacto |
| 5C | 45,5–49,2 | punch-in com tremor na Zara | agarra o soro e aponta para Dante (humor) | metal do suporte |
| 5D | 49,2–53,3 | plano de dois | Dante ergue as mãos, meio sorriso → frio em “sua mãe”; Zara em choque | braam |
| 6A | 53,3–54,9 | plano de dois | Zara abaixa o soro e olha para a mãe | batimento |
| 6B | 54,9–56,0 | insert macro no pingente | o símbolo da Áurea brilha | — |
| 6C | 56,0–58,3 | close da Helena | olhos baixos, culpa | — |
| 7A | 58,3–62,5 | plano médio do terminal | glitch; o holograma do Ciro surge com cintilação | glitch, holograma ligando, zumbido |
| 7B | 62,5–66,2 | plano de três | Dante avança e aponta, com raiva | — |
| 7C | 66,2–69,6 | close no holograma | Ciro aponta para Dante, sorriso de canto | pulso grave |
| 7D | 69,6–72,0 | close da Zara → close do Dante | mão na boca; Dante desvia o olhar | drone |
| 8A | 72,0–75,1 | close de dois com zoom lento; luz vermelha piscando | Helena agarra o pulso da filha; tremor | alarme, monitor acelerado |
| 8B | 75,1–77,4 | preto | — | linha reta e silêncio |
| 9A | 77,4–89,0 | plano médio frontal com push-in lento | fala para a câmera; aponta para o público; gesto para a esquerda (A, luz dourada no rosto) e para a direita (B); termina com mãos na cintura e olhar sarcástico | impacto, trilha de volta |

## 7. Direção de câmera e transições

- **Câmera 2.5D**: cada cenário tem camadas com profundidade (`Layer depth`). O fundo se move menos que os personagens (parallax).
- **Movimentos**: close extremo → recuo (gancho), travelling lateral (fila e corrida), chicote (Dante), punch-in com tremor (humor e choque), zoom lento (suspense).
- **Transições**: clarões curtos nas viradas de cena (branco, dourado, verde-petróleo, azul), glitch no holograma e corte seco para o preto no cliffhanger. Nada de cortes aleatórios: cada cena termina num gesto que leva à próxima.

## 8. Trilha e efeitos

- **Trilha original** sintetizada (`pipeline/sfx.py → music`): pad em Ré menor, arpejo de pulsos e sub-grave, com a intensidade automatizada por cena em `src/data/audio_timeline.json`.
  Música zero durante a ligação (12,6–16,4 s), máxima na corrida, contida no hospital e em silêncio total depois da linha reta.
- **Efeitos** (todos originais): murmúrio da agência, leitor de pulso, cintilar dourado (anos), vibração do celular, chuva, trovão,
  passos na água, respiração ofegante, monitor cardíaco (normal e acelerado), linha reta, holograma ligando e zumbindo, metal do soro,
  porta, glitch, impactos, riser e braam.
- **Mixagem**: a trilha abaixa sozinha sob as falas; master em −14 LUFS (padrão de redes sociais).

## 9. Instruções técnicas de animação 2D

- **Motor**: React + Remotion (cada quadro é uma função do tempo, o que garante sincronia exata). Personagens em SVG vetorial.
- **Rig** (`src/characters/Toon.tsx`): esqueleto com IK nos braços (a mão alcança qualquer ponto), poses interpoladas com easing
  (`act.ts → posekf`), respiração, piscadas automáticas, ciclos de caminhada e corrida, tremor e vistas de frente e de perfil.
- **Sincronia labial**: a abertura da boca vem da intensidade real da voz quadro a quadro (`voice_env.generated.json`). O formato da
  boca (A, E, I, O, U, M) vem da letra da palavra que está sendo falada naquele instante (marcas de tempo do TTS).
- **Expressões**: 14 (`neutral`, `smile`, `smirk`, `sarcastic`, `worried`, `sad`, `weak`, `tender`, `surprised`, `shock`, `fear`, `angry`, `determined`, `cold`).
- **Consistência**: personagens e cenários são componentes únicos e reutilizados, então nada muda de um plano para outro.

## 10. Organização, montagem e exportação

```
saldo-final-zara/
├── src/
│   ├── characters/  Toon.tsx (motor) · Cast.tsx (elenco e poses) · act.ts (atuação e boca)
│   ├── sets/        Sets.tsx (agência, rua, hospital, torre, terminal)
│   ├── scenes/      Scene01…Scene09 · Hosp.tsx (palco do quarto)
│   ├── components/  Camera · Effects · Subtitles · TextLayer (títulos e votação) · Fonts
│   └── data/        script.json (falas e vozes) · audio_timeline.json · timeline.ts
├── pipeline/        tts.py · sfx.py · mix.py · export_srt.py · check_voices.py
├── public/audio/    voices/ (uma fala por arquivo) · sfx/ · music/ · stems/ · mix_ep01.wav
└── out/
    ├── saldo-final-ep01.mp4        versão FINAL (animação + legendas + cartela A/B)
    ├── saldo-final-ep01-limpo.mp4  versão LIMPA (sem nenhum texto, para editar)
    ├── saldo-final-ep01.srt        legendas em arquivo
    ├── personagens.png · storyboard_ep01.png
```

Exportação: `npm run render` (final) e `npm run render:limpo` (sem textos). Ambas saem em H.264 + AAC, 1080 × 1920, 30 fps.
Ao editar fora do projeto, use a versão limpa, o SRT e os áudios separados.

## Votação

**O QUE A ZARA DEVE FAZER?**
- **A** — Vender 10 anos de vida para salvar a mãe. *Risco: a Áurea passa a “ter” a Zara, e talvez a Helena continue sendo drenada.*
- **B** — Recusar a proposta e descobrir quem controla o sistema. *Risco: a Helena pode não aguentar, e Dante é uma incógnita.*

O EP. 2 começa a partir da opção vencedora, com consequências reais e diferentes para cada caminho.
