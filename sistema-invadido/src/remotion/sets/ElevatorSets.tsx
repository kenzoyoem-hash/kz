import React from 'react';
import {C, FONT} from '../theme';
import {lerp} from '../lib/anim';

/**
 * ELEVADOR DE SERVIÇO — planos fixos (EP. 2B+), cada um em 1080 x 1920.
 * A mochila VERMELHA (EP. 1) fica no canto esquerdo da cabine, com etiqueta "DAVI — MANUTENÇÃO".
 */
export const EV = {
  floorY: 1500,
  bia: {x: 600, y: 1505, s: 1.0},       // Bia dentro da cabine (posição fixa)
  bag: {x: 250, y: 1500},               // mochila no canto
  hallDoors: {x: 290, y: 520, w: 500, h: 960},
};
const STEEL = '#8d97ab', STEEL_D = '#6f798d', STEEL_L = '#a9b2c4';

/** Mochila vermelha (origem = base). open 0..1 abre a aba e mostra os itens. tag = etiqueta presa à alça. */
export const Backpack: React.FC<{open?: number; tag?: boolean; scale?: number; x?: number; y?: number; shake?: number; t?: number}> = ({open = 0, tag = true, scale = 1, x = 0, y = 0, shake = 0, t = 0}) => (
  <g transform={`translate(${x + (shake ? Math.sin(t * 60) * 3 * shake : 0)},${y}) scale(${scale})`}>
    <ellipse cx={0} cy={6} rx={110} ry={16} fill="#000" opacity={0.3} />
    <path d="M-90,0 Q-100,-130 -55,-165 Q0,-190 55,-165 Q100,-130 90,0 Z" fill="#c81f2e" />
    <path d="M-55,-165 Q0,-235 55,-165" stroke="#8f1420" strokeWidth={16} fill="none" />
    <rect x={-62} y={-80} width={124} height={70} rx={16} fill="#a91826" />
    <line x1={-56} y1={-64} x2={56} y2={-64} stroke="#ffb3ba" strokeWidth={4} />
    {open > 0 && (
      <g>
        <path d={`M-70,-150 Q0,${-150 - 50 * open} 70,-150 L60,-130 Q0,-120 -60,-130 Z`} fill="#3a0a10" />
        {/* itens aparecendo: caderno, crachá, chave */}
        <rect x={-50} y={-150 - 40 * open} width={56} height={70} rx={4} fill="#e9dcb8" transform={`rotate(-8)`} />
        <rect x={10} y={-145 - 35 * open} width={40} height={54} rx={4} fill="#f4f6fb" stroke="#2f6fd6" strokeWidth={3} />
      </g>
    )}
    {tag && (
      <g transform="translate(58,-170) rotate(12)">
        <line x1={0} y1={0} x2={10} y2={40} stroke="#d0d5df" strokeWidth={3} />
        <rect x={-30} y={40} width={92} height={50} rx={6} fill="#f4f6fb" stroke="#9aa3b5" strokeWidth={2} />
        <text x={16} y={62} fontSize={15} textAnchor="middle" fontFamily={FONT.title} fill="#1a1f2e">DAVI</text>
        <text x={16} y={80} fontSize={10} textAnchor="middle" fontFamily={FONT.bold} fill="#4d5566">MANUTENÇÃO</text>
      </g>
    )}
  </g>
);

/** Portas de aço (origem: retângulo do vão). open 0..1 (abrem para os lados). */
const SlidingDoors: React.FC<{x: number; y: number; w: number; h: number; open: number; shake?: number; t?: number}> = ({x, y, w, h, open, shake = 0, t = 0}) => {
  const dw = (w / 2) * (1 - open);
  const j = shake ? Math.sin(t * 50) * 4 * shake : 0;
  return (
    <g>
      <rect x={x} y={y} width={dw} height={h} fill={STEEL} stroke={STEEL_D} strokeWidth={4} transform={`translate(${j},0)`} />
      <rect x={x + w - dw} y={y} width={dw} height={h} fill={STEEL} stroke={STEEL_D} strokeWidth={4} transform={`translate(${-j},0)`} />
      {dw > 6 && <>
        <rect x={x + 20} y={y + 60} width={Math.max(0, dw - 40)} height={6} fill={STEEL_L} opacity={0.6} />
        <rect x={x + w - dw + 20} y={y + 60} width={Math.max(0, dw - 40)} height={6} fill={STEEL_L} opacity={0.6} />
      </>}
    </g>
  );
};

/** Interior da cabine visto do corredor (atrás das portas). */
const CabSeenFromHall: React.FC<{x: number; y: number; w: number; h: number; light?: number}> = ({x, y, w, h, light = 1}) => (
  <g>
    <rect x={x} y={y} width={w} height={h} fill="#c9d2e3" />
    <rect x={x + 40} y={y + 30} width={w - 80} height={20} rx={8} fill="#fff" opacity={0.9} />
    <rect x={x} y={y + h - 120} width={w} height={120} fill="#9aa6bd" />
    <line x1={x + 20} y1={y + h * 0.55} x2={x + w - 20} y2={y + h * 0.55} stroke="#7d889b" strokeWidth={10} />
    <Backpack x={x + 90} y={y + h - 30} scale={0.65} tag={false} />
    <rect x={x} y={y} width={w} height={h} fill="#000" opacity={(1 - light) * 0.6} />
  </g>
);

/** CORREDOR DO 7º: portas do elevador de serviço, indicador e botão. children = personagens no corredor; inside = personagem na cabine. */
export const ElevatorHall: React.FC<{open: number; floor: number; arrow?: boolean; children?: React.ReactNode; inside?: React.ReactNode}> = ({open, floor, arrow, children, inside}) => {
  const {x, y, w, h} = EV.hallDoors;
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#1c2540" />
      <rect x={-300} y={1480} width={1680} height={800} fill="#141b30" />
      <rect x={430} y={150} width={220} height={26} rx={8} fill="#dfe7f5" opacity={0.6} />
      <rect x={x - 40} y={y - 40} width={w + 80} height={h + 40} fill="#59627a" />
      <CabSeenFromHall x={x} y={y} w={w} h={h} />
      {inside}
      <SlidingDoors x={x} y={y} w={w} h={h} open={open} />
      <rect x={x + w / 2 - 70} y={y - 170} width={140} height={90} rx={10} fill="#0a0c12" />
      <text x={x + w / 2 - 10} y={y - 102} fontSize={64} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>{floor}</text>
      {arrow && <text x={x + w / 2 + 42} y={y - 104} fontSize={40} fontFamily={FONT.mono} fill={C.red}>▼</text>}
      <rect x={x + w + 70} y={y + 380} width={60} height={130} rx={10} fill="#11131c" />
      <circle cx={x + w + 100} cy={y + 445} r={16} fill={open > 0 ? '#ffd23f' : '#3a3f55'} />
      <text x={x + w / 2} y={y + h + 110} fontSize={30} textAnchor="middle" fontFamily={FONT.title} fill="#8a94a8">ELEVADOR DE SERVIÇO</text>
      {children}
    </g>
  );
};

/** INTERIOR DA CABINE (olhando para o fundo). light 0..1; panelGlow destaca o painel. */
export const CabInterior: React.FC<{light?: number; floor: string; children?: React.ReactNode; bag?: React.ReactNode; red?: number}> = ({light = 1, floor, children, bag, red = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#7d8698" />
    {/* paredes laterais em perspectiva */}
    <path d="M-300,-300 L120,260 L120,1500 L-300,2200 Z" fill="#6e7789" />
    <path d="M1380,-300 L960,260 L960,1500 L1380,2200 Z" fill="#737c8f" />
    {/* fundo em painéis de aço escovado */}
    <rect x={120} y={260} width={840} height={1240} fill="#8b95a8" />
    {[0, 1, 2].map((i) => <rect key={i} x={140 + i * 275} y={290} width={250} height={1180} rx={6} fill="#949eb1" />)}
    <line x1={120} y1={1080} x2={960} y2={1080} stroke="#c3cad8" strokeWidth={14} strokeLinecap="round" />
    {/* teto com luz */}
    <path d="M-300,-300 L120,260 L960,260 L1380,-300 Z" fill="#596276" />
    <rect x={380} y={150} width={320} height={44} rx={10} fill="#f4f8ff" opacity={0.25 + light * 0.75} />
    {/* chão */}
    <path d="M120,1500 L960,1500 L1380,2200 L-300,2200 Z" fill="#4b5468" />
    {/* painel na parede lateral direita */}
    <path d="M1010,700 L1110,640 L1110,1260 L1010,1220 Z" fill="#2a2f3a" />
    <rect x={1030} y={720} width={56} height={44} rx={4} fill="#0a0c12" />
    <text x={1058} y={756} fontSize={34} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>{floor}</text>
    {Array.from({length: 10}).map((_, i) => <circle key={i} cx={1040 + (i % 2) * 34} cy={800 + Math.floor(i / 2) * 60} r={12} fill="#9aa3b5" />)}
    {bag}
    {children}
    {red > 0 && <rect x={-300} y={-300} width={1680} height={2520} fill={C.red} opacity={red * 0.16} />}
    <rect x={-300} y={-300} width={1680} height={2520} fill="#000" opacity={(1 - light) * 0.78} />
  </g>
);

/** CLOSE DO PAINEL: botões T..9 e visor. pressed = botão aceso; finger 0..1 = dedo chegando no "T". */
export const PanelClose: React.FC<{floor: string; arrow?: boolean; pressed?: boolean; finger?: number}> = ({floor, arrow, pressed, finger = 0}) => {
  const btn = (label: string, i: number) => {
    const col = i % 2, row = Math.floor(i / 2);
    const cx = 420 + col * 240, cy = 1500 - row * 170;
    const lit = pressed && label === 'T';
    return (
      <g key={label}>
        <circle cx={cx} cy={cy} r={72} fill={lit ? '#ffd23f' : '#c3cad8'} stroke="#7d889b" strokeWidth={8} />
        {lit && <circle cx={cx} cy={cy} r={100} fill="#ffd23f" opacity={0.2} />}
        <text x={cx} y={cy + 24} fontSize={68} textAnchor="middle" fontFamily={FONT.title} fill={lit ? '#5a4500' : '#3a4152'}>{label}</text>
      </g>
    );
  };
  const tx = 420, ty = 1500;
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#2a2f3a" />
      <rect x={230} y={180} width={620} height={1520} rx={40} fill="#3a404d" stroke="#555d6d" strokeWidth={8} />
      <rect x={330} y={260} width={420} height={260} rx={20} fill="#05060a" />
      <text x={510} y={450} fontSize={190} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>{floor}</text>
      {arrow && <text x={680} y={420} fontSize={90} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>▼</text>}
      {['T', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(btn)}
      {/* interfone */}
      <g transform="translate(540,1650)">{Array.from({length: 15}).map((_, i) => <circle key={i} cx={-84 + (i % 5) * 42} cy={-20 + Math.floor(i / 5) * 20} r={6} fill="#1b1f27" />)}</g>
      {finger > 0 && (
        <g transform={`translate(${tx + (1 - finger) * 260},${ty + 40 + (1 - finger) * 260})`}>
          <rect x={20} y={20} width={200} height={600} rx={90} fill={C.skin} transform="rotate(-35 20 20)" />
          <rect x={-22} y={-50} width={56} height={170} rx={28} fill={C.skin} transform="rotate(-35 0 0)" />
          <rect x={60} y={300} width={260} height={500} rx={60} fill={C.shirt} transform="rotate(-35 20 20)" />
        </g>
      )}
    </g>
  );
};

/** CLOSE DO INTERFONE. led: 'green' | 'red' | 'off'; level 0..1 anima a grade */
export const IntercomClose: React.FC<{led: 'green' | 'red' | 'off'; level?: number}> = ({led, level = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#2a2f3a" />
    <rect x={190} y={420} width={700} height={1080} rx={50} fill="#3a404d" stroke="#555d6d" strokeWidth={10} />
    <text x={540} y={560} fontSize={54} textAnchor="middle" fontFamily={FONT.title} fill="#c9d2e3">INTERFONE</text>
    <text x={540} y={620} fontSize={30} textAnchor="middle" fontFamily={FONT.bold} fill="#8a94a8">EMERGÊNCIA · CENTRAL</text>
    <circle cx={540} cy={980} r={250} fill="#2c313c" />
    {Array.from({length: 61}).map((_, i) => {
      const r = Math.floor(Math.sqrt(i)) * 42; const a = i * 2.4;
      return <circle key={i} cx={540 + Math.cos(a) * r} cy={980 + Math.sin(a) * r} r={13 + level * 3} fill="#14171d" />;
    })}
    <circle cx={540} cy={1330} r={34} fill={led === 'red' ? C.red : led === 'green' ? C.green : '#3a3f55'} />
    {led !== 'off' && <circle cx={540} cy={1330} r={80} fill={led === 'red' ? C.red : C.green} opacity={0.25 + level * 0.3} />}
  </g>
);

/** PORTAS VISTAS DE DENTRO, com fresta de luz; shake = batidas do lado de fora; feet = sombra de pés na fresta. */
export const DoorsInside: React.FC<{shake?: number; t: number; feet?: number; light?: number}> = ({shake = 0, t, feet = 0, light = 1}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#6e7789" />
    <rect x={140} y={200} width={800} height={1400} fill="#59627a" />
    <rect x={540 - 3} y={220} width={6} height={1360} fill="#ffe9c0" opacity={0.85} />
    <SlidingDoors x={170} y={220} w={740} h={1360} open={0.006} shake={shake} t={t} />
    <rect x={140} y={1580} width={800} height={40} fill="#c3cad8" />
    {feet > 0 && <g opacity={feet}><rect x={410} y={1590} width={70} height={20} fill="#05060a" /><rect x={600} y={1590} width={70} height={20} fill="#05060a" /></g>}
    <rect x={-300} y={1620} width={1680} height={700} fill="#4b5468" />
    <rect x={-300} y={-300} width={1680} height={2520} fill="#000" opacity={(1 - light) * 0.7} />
  </g>
);

/** CLOSE DOS ITENS DA MOCHILA: crachá, chave e caderno sobre o forro vermelho. */
export const BagItems: React.FC = () => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#7a1220" />
    <rect x={-300} y={-300} width={1680} height={2520} fill="url(#bagShade)" />
    <defs><radialGradient id="bagShade" cx="0.5" cy="0.45" r="0.7"><stop offset="0" stopColor="#000" stopOpacity={0} /><stop offset="1" stopColor="#000" stopOpacity={0.6} /></radialGradient></defs>
    <g transform="translate(250,700) rotate(-10)">
      <rect x={0} y={0} width={300} height={400} rx={20} fill="#f4f6fb" stroke="#9aa3b5" strokeWidth={6} />
      <rect x={20} y={20} width={260} height={70} rx={10} fill="#2f6fd6" />
      <text x={150} y={70} fontSize={40} textAnchor="middle" fontFamily={FONT.title} fill="#fff">MANUTENÇÃO</text>
      <circle cx={150} cy={190} r={60} fill="#c9cfdb" />
      <text x={150} y={330} fontSize={70} textAnchor="middle" fontFamily={FONT.title} fill="#1a1f2e">DAVI</text>
    </g>
    <g transform="translate(640,760) rotate(25)">
      <rect x={0} y={-16} width={250} height={32} rx={10} fill="#d8b44a" />
      <circle cx={-50} cy={0} r={70} fill="#d8b44a" /><circle cx={-50} cy={0} r={24} fill="#7a1220" />
      {[40, 90, 140, 190].map((x, i) => <rect key={x} x={x} y={14} width={22} height={18 + (i % 2) * 14} fill="#d8b44a" />)}
    </g>
    <g transform="translate(330,1180) rotate(4)">
      <rect x={0} y={0} width={440} height={560} rx={16} fill="#1d2433" />
      <rect x={30} y={0} width={410} height={560} rx={10} fill="#e9dcb8" />
      {Array.from({length: 8}).map((_, i) => <line key={i} x1={60} y1={80 + i * 58} x2={410} y2={80 + i * 58} stroke="#c9b993" strokeWidth={4} />)}
    </g>
  </g>
);

/** PÁGINA DO CADERNO: aviso + desenho do acesso técnico no 6º. reveal 0..1 escreve o texto. */
export const NotebookPage: React.FC<{reveal: number}> = ({reveal}) => {
  const lines = ['SE O SISTEMA', 'FOR INVADIDO,', 'NÃO CONFIE', 'NO PAINEL DIGITAL.'];
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#1d2433" />
      <rect x={110} y={180} width={860} height={1560} rx={20} fill="#efe4c4" />
      {Array.from({length: 22}).map((_, i) => <line key={i} x1={150} y1={300 + i * 64} x2={930} y2={300 + i * 64} stroke="#d6c79f" strokeWidth={3} />)}
      <line x1={230} y1={200} x2={230} y2={1720} stroke="#e8a0a0" strokeWidth={4} />
      {lines.map((l, i) => (
        <text key={l} x={270} y={420 + i * 110} fontSize={72} fontFamily={FONT.bold} fill="#1f2a5a" opacity={reveal * 4 - i > 0 ? Math.min(1, reveal * 4 - i) : 0}>{l}</text>
      ))}
      <g opacity={Math.min(1, Math.max(0, reveal * 3 - 2))} stroke="#1f2a5a" strokeWidth={8} fill="none" strokeLinecap="round">
        <rect x={300} y={1000} width={220} height={360} />
        <line x1={410} y1={1000} x2={410} y2={1360} />
        <rect x={640} y={1060} width={180} height={300} />
        <path d="M560,1420 Q600,1480 700,1400" />
        <path d="M680,1380 L700,1400 L676,1414" />
        <text x={530} y={1520} fontSize={52} textAnchor="middle" fontFamily={FONT.bold} fill="#1f2a5a" stroke="none">6º ANDAR —</text>
        <text x={530} y={1590} fontSize={52} textAnchor="middle" fontFamily={FONT.bold} fill="#b3121f" stroke="none">ACESSO TÉCNICO</text>
      </g>
    </g>
  );
};

/** PORTARIA (CAM 04): portas do elevador abertas à esquerda e a saída de vidro ao fundo. children = Bia falsa. */
export const LobbyFeed: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#2a3045" />
    <path d="M-300,2200 L300,1180 L780,1180 L1380,2200 Z" fill="#3a4258" />
    {Array.from({length: 7}).map((_, i) => <line key={i} x1={lerp(-300, 300, i / 6)} y1={lerp(2200, 1180, i / 6)} x2={lerp(1380, 780, i / 6)} y2={lerp(2200, 1180, i / 6)} stroke="#2f364a" strokeWidth={4} />)}
    <rect x={300} y={600} width={480} height={580} fill="#9fb6e0" opacity={0.35} />
    <rect x={300} y={600} width={480} height={580} fill="none" stroke="#c3cad8" strokeWidth={10} />
    <line x1={540} y1={600} x2={540} y2={1180} stroke="#c3cad8" strokeWidth={8} />
    <rect x={400} y={500} width={280} height={70} rx={8} fill="#16a34a" />
    <text x={540} y={548} fontSize={40} textAnchor="middle" fontFamily={FONT.title} fill="#eafff0">PORTARIA</text>
    <path d="M-300,400 L80,700 L80,1500 L-300,2000 Z" fill="#8d97ab" />
    <path d="M-120,560 L40,690 L40,1440 L-120,1600 Z" fill="#c9d2e3" />
    <rect x={820} y={1000} width={300} height={200} rx={10} fill="#4a3a2f" />
    {children}
  </g>
);
