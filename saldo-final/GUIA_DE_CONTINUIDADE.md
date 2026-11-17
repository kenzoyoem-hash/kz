# SALDO FINAL — Guia de continuidade

Referência obrigatória para todos os episódios. A série não tem número total de episódios definido.
Cada episódio dura no máximo 90 s, em vertical 9:16, e termina com uma votação A/B.

## Universo

- São Paulo num futuro próximo. A plataforma **TEMPO** (“mercado de anos de vida”) negocia expectativa de vida.
- Cada pessoa tem um **saldo estimado de anos**. Vender reduz o saldo, mas **não envelhece o corpo na hora**.
- O sistema registra comprador, vendedor, quantidade e valor, como uma transação financeira.
- Quem é pobre vende por necessidade; quem é rico compra anos (por exemplo, na **Clínica Longeva**).
- O sistema tem anomalias e segredos. **A compradora “MAYA — 2041” não foi explicada e não deve ser
  explicada antes de a história pedir.**

## Cores narrativas

| Cor | Hex | Significado |
|---|---|---|
| Dourado | `#F2C14E` | anos de vida (partículas, valores em anos) |
| Vermelho | `#FF3B4E` | perigo, anomalias, Maya do futuro |
| Azul | `#36B7FF` | transações e tecnologia |
| Roxo neon / magenta | `#8A45FF` / `#E44CE0` | identidade da série, legendas, votação |
| Azul-marinho / preto azulado | `#10182B` / `#090E1B` | fundos |

## Personagens (modelos oficiais em `src/characters/`)

Todos usam o mesmo rig: cabeça redonda **sem rosto**, corpo cinza-claro (`#C9CDD6`), braços e pernas finos.
A emoção vem da postura e da voz. Escala padrão no apartamento: `MAYA_S = 1.3`.

| Personagem | Visual fixo | Voz (edge-tts) |
|---|---|---|
| **Maya** (22) | cabelo castanho-escuro ondulado na altura dos ombros, jaqueta verde-musgo `#607A58`, camiseta preta, calça escura, tênis preto | `pt-BR-FranciscaNeural`, velocidade +6 %, tom +4 Hz |
| **Maya (narração)** | — | Francisca, velocidade +2 %, tom +2 Hz, tratamento `narr` |
| **Noah** (23) | ~6 % mais alto, cabelo preto curto, jaqueta jeans azul `#3D6CA8`, camiseta cinza, calça escura, tênis claro | `pt-BR-AntonioNeural`, velocidade +8 %, tom +6 Hz; na videochamada, tratamento `call` |
| **Maya do futuro** (aparenta 37, ano de 2041) | mesmo modelo da Maya; cabelo mais longo, sobretudo escuro de gola alta com costuras vermelhas, postura rígida | Francisca, velocidade −8 %, tom −12 Hz; no telefone, tratamento `future` |

## Cenários fixos (`src/components/Background.tsx`)

- **Apartamento da Maya** (chão em y = 1500). Mesa com contas atrasadas à esquerda (x 60–340), janela com
  vista urbana e telão “TEMPO / VENDA SEUS ANOS” ao centro (x 300–840), sofá roxo simples (centro em
  x 720), luminária roxa (x 1010) e cozinha compacta com geladeira quase vazia à direita (x 1040–1480).
  Luz azul e roxa.
- **Avenida** (cena 2): terminal “VENDER ANOS”, Clínica Longeva com terminal “COMPRAR ANOS”, telões
  “TEMPO” e “VIVA MAIS”.
- **Quarto do Noah**: parede roxa, LED azul, pôsteres e prateleira. Até aqui ele só aparece por videochamada.
- **Sala de 2041**: escura, luz vermelha, vidro com cidade avermelhada e ampulheta holográfica (“ANOS: 0,4”).
- O mesmo `seed` gera sempre o mesmo skyline (`sp-far`, `sp-mid`, `sp-2041-*`).

## Estado da história ao fim do EP. 01

- Maya vendeu **5 anos por R$ 80.000**. Seu saldo estimado caiu de **58 para 53 anos**.
- O app mostra **COMPRADORA: MAYA — 2041** e “ERRO: DATA DE ORIGEM INVÁLIDA”.
- Uma ligação de “NÚMERO DESCONHECIDO” foi atendida. A Maya do futuro disse: “Você não devia ter vendido
  esses anos.” e “A gente tem menos tempo do que imagina.” A ligação caiu (“SINAL PERDIDO”).
- Uma silhueta da Maya do futuro apareceu no reflexo do celular.
- O celular estava no sofá quando tocou, depois ficou na mão da Maya. As luzes do apartamento apagaram.
- Noah sabe da venda, foi contra e ainda não sabe da compradora.

## Votação do EP. 01

- **A — Investigar a Maya do futuro**
- **B — Tentar cancelar a venda**

A opção mais votada tem de ter consequências reais no EP. 02.

## Regras de produção

- Legendas: tipografia real (Montserrat), branco com destaque roxo na palavra falada. As falas do Noah
  têm destaque azul e as da Maya do futuro, vermelho em itálico. Nada de texto gerado como imagem.
- Áudio: trilha e efeitos originais (`pipeline/sfx.py`). Nenhuma música de terceiros.
- Não mudar formato da cabeça, proporções, cabelo, cores, roupas, vozes ou estilo de animação.
