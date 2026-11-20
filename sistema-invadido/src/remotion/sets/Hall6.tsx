import React from 'react';
import {C, FONT} from '../theme';

/**
 * CORREDOR DO 6º ANDAR (EP. 3A+). Mundo 1800 x 1920.
 * Elevador à esquerda (portas abertas à força, open≈0.42), porta de MANUTENÇÃO à direita com leitor de crachá.
 * Posições: Davi (760, junto ao elevador) | Bia (1030) | Davi no leitor (1540) | Bia atrás (1250) | leitor (1660, 930)
 */
export const H6 = {
  floorY: 1480,
  bia: {x: 1030, y: 1482, s: 1.0},
  davi: {x: 760, y: 1482, s: 1.0},
  daviReader: {x: 1500, y: 1482, s: 1.0},
  biaBehind: {x: 1200, y: 1482, s: 1.0},
  reader: {x: 1660, y: 930},
  elev: {x: 200, y: 520, w: 500, h: 960},
  cam: {x: 1020, y: 230},
  // fim do EP. 3A
  daviEnd: {x: 1380, y: 1482, s: 1.0},
  biaEnd: {x: 1130, y: 1482, s: 1.0},
};

export const Hall6: React.FC<{open?: number; readerState?: 'idle' | 'denied'; children?: React.ReactNode; light?: number; camRot?: number}> = ({open = 0.42, readerState = 'idle', children, light = 1, camRot = 0}) => {
  const {x, y, w, h} = H6.elev;
  const dw = (w / 2) * (1 - open);
  return (
    <g>
      <defs><linearGradient id="h6w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#253250" /><stop offset="1" stopColor="#1b2540" /></linearGradient></defs>
      <rect x={-300} y={-300} width={2400} height={1780} fill="url(#h6w)" />
      <rect x={-300} y={1480} width={2400} height={800} fill="#131a2e" />
      <rect x={-300} y={1474} width={2400} height={10} fill="#0e1424" />
      {[300, 900, 1500].map((lx) => <rect key={lx} x={lx} y={150} width={200} height={24} rx={8} fill="#dfe7f5" opacity={0.55} />)}
      {/* elevador */}
      <rect x={x - 40} y={y - 40} width={w + 80} height={h + 40} fill="#59627a" />
      <rect x={x} y={y} width={w} height={h} fill="#c9d2e3" />
      <rect x={x} y={y + h - 120} width={w} height={120} fill="#9aa6bd" />
      <rect x={x} y={y} width={dw} height={h} fill="#8d97ab" stroke="#6f798d" strokeWidth={4} />
      <rect x={x + w - dw} y={y} width={dw} height={h} fill="#8d97ab" stroke="#6f798d" strokeWidth={4} />
      <rect x={x + w / 2 - 70} y={y - 170} width={140} height={90} rx={10} fill="#0a0c12" />
      <text x={x + w / 2} y={y - 102} fontSize={64} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>6</text>
      <text x={x + w / 2} y={y + h + 110} fontSize={30} textAnchor="middle" fontFamily={FONT.title} fill="#8a94a8">ELEVADOR DE SERVIÇO</text>
      <text x={980} y={560} fontSize={150} textAnchor="middle" fontFamily={FONT.title} fill="#e9eef8" opacity={0.14}>6</text>
      {/* câmera de segurança no teto (lente gira; luz vermelha acesa) */}
      <g transform={`translate(${H6.cam.x},${H6.cam.y})`}>
        <rect x={-34} y={-46} width={68} height={30} rx={6} fill="#c3cad8" />
        <rect x={-8} y={-18} width={16} height={26} fill="#9aa3b5" />
        <g transform={`rotate(${camRot})`}>
          <rect x={-58} y={6} width={116} height={52} rx={20} fill="#e6eaf2" />
          <rect x={-70} y={14} width={28} height={36} rx={10} fill="#1a1f2a" />
          <circle cx={-56} cy={32} r={9} fill="#3a5a9a" />
          <circle cx={38} cy={24} r={6} fill={C.red} />
        </g>
      </g>
      {/* passagem lateral (corredor escuro à direita) */}
      <rect x={1790} y={520} width={200} height={960} fill="#0a0f1c" />
      <path d="M1790,520 L1990,520 L1990,1480 L1790,1480 Z" fill="none" stroke="#2c3758" strokeWidth={12} />
      <path d="M1800,1480 L1980,1480 L1900,1300 L1860,1300 Z" fill="#131a2e" opacity={0.8} />
      {/* porta de manutenção + leitor */}
      <rect x={1270} y={540} width={340} height={940} fill="#0f1526" />
      <rect x={1290} y={560} width={300} height={920} fill="#3d4a66" />
      <rect x={1310} y={600} width={260} height={60} rx={6} fill="#d8b44a" />
      <text x={1440} y={642} fontSize={34} textAnchor="middle" fontFamily={FONT.title} fill="#111">MANUTENÇÃO</text>
      <rect x={1550} y={980} width={22} height={70} rx={8} fill="#c0c7d6" />
      <rect x={H6.reader.x - 38} y={H6.reader.y - 70} width={76} height={140} rx={12} fill="#11131c" stroke="#3a3f55" strokeWidth={4} />
      <rect x={H6.reader.x - 26} y={H6.reader.y - 54} width={52} height={36} rx={4} fill={readerState === 'denied' ? '#3a0a10' : '#0d1a12'} />
      <circle cx={H6.reader.x} cy={H6.reader.y + 30} r={11} fill={readerState === 'denied' ? C.red : '#2f6f4a'} />
      {readerState === 'denied' && <circle cx={H6.reader.x} cy={H6.reader.y + 30} r={34} fill={C.red} opacity={0.3} />}
      {children}
      <rect x={-300} y={-300} width={2400} height={2520} fill="#000" opacity={(1 - light) * 0.7} />
    </g>
  );
};

/** CLOSE DO LEITOR DE CRACHÁ. card 0..1 aproxima o crachá; denied mostra ACESSO NEGADO. */
export const ReaderClose: React.FC<{card: number; denied: boolean; blink?: boolean}> = ({card, denied, blink = true}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#223050" />
    <rect x={330} y={420} width={420} height={820} rx={50} fill="#11131c" stroke="#3a3f55" strokeWidth={10} />
    <rect x={380} y={480} width={320} height={210} rx={14} fill={denied ? '#2a070c' : '#0d1a12'} />
    {denied && <>
      <text x={540} y={570} fontSize={50} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>ACESSO</text>
      <text x={540} y={640} fontSize={50} textAnchor="middle" fontFamily={FONT.mono} fill={C.red}>NEGADO</text>
    </>}
    {!denied && <text x={540} y={605} fontSize={40} textAnchor="middle" fontFamily={FONT.mono} fill="#4ade80">APROXIME</text>}
    <circle cx={540} cy={1020} r={60} fill="#1b1f2a" stroke="#3a3f55" strokeWidth={6} />
    <circle cx={540} cy={1020} r={36} fill={denied ? (blink ? C.red : '#5a1018') : '#2f6f4a'} />
    {denied && blink && <circle cx={540} cy={1020} r={110} fill={C.red} opacity={0.25} />}
    {/* mão do Davi com o crachá */}
    <g transform={`translate(${900 - card * 320},${1180 - card * 260}) rotate(-12)`}>
      <rect x={60} y={120} width={600} height={180} rx={80} fill="#5f7690" />
      <ellipse cx={60} cy={150} rx={110} ry={95} fill="#c98f6b" />
      <rect x={-110} y={-30} width={190} height={250} rx={18} fill="#f4f6fb" stroke="#9aa3b5" strokeWidth={6} />
      <rect x={-96} y={-16} width={162} height={46} rx={8} fill="#2f6fd6" />
      <text x={-15} y={170} fontSize={44} textAnchor="middle" fontFamily={FONT.title} fill="#1a1f2e">DAVI</text>
      <rect x={0} y={150} width={60} height={34} rx={17} fill="#c98f6b" />
    </g>
  </g>
);

/** CLOSE DA CÂMERA DE SEGURANÇA DO CORREDOR. rot gira a lente (motor). */
export const CameraClose: React.FC<{rot: number; led?: number}> = ({rot, led = 1}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#223050" />
    <rect x={-300} y={-300} width={1680} height={700} fill="#1a2440" />
    <g transform="translate(540,640)">
      <rect x={-130} y={-200} width={260} height={110} rx={20} fill="#c3cad8" />
      <rect x={-30} y={-100} width={60} height={110} fill="#9aa3b5" />
      <g transform={`rotate(${rot})`}>
        <rect x={-250} y={0} width={500} height={220} rx={90} fill="#e6eaf2" stroke="#b8c0cf" strokeWidth={8} />
        <rect x={-300} y={36} width={120} height={150} rx={40} fill="#11151e" />
        <circle cx={-240} cy={111} r={46} fill="#2a4a8a" />
        <circle cx={-240} cy={111} r={22} fill="#0a0f1a" />
        <circle cx={-252} cy={98} r={9} fill="#9fc0ff" opacity={0.8} />
        <circle cx={160} cy={70} r={24} fill={C.red} opacity={led} />
        <circle cx={160} cy={70} r={60} fill={C.red} opacity={0.25 * led} />
      </g>
    </g>
  </g>
);

/** PORTA DO APARTAMENTO 604 (quadro de câmera clandestino). knock 0..1 faz a porta vibrar. */
export const Door604: React.FC<{knock?: number; t?: number}> = ({knock = 0, t = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#1c2540" />
    <rect x={-300} y={1500} width={1680} height={800} fill="#141b30" />
    <g transform={`translate(${knock ? Math.sin(t * 60) * 3 * knock : 0},0)`}>
      <rect x={300} y={520} width={480} height={980} fill="#0f1526" />
      <rect x={320} y={540} width={440} height={960} fill="#2b2a44" />
      <rect x={360} y={600} width={360} height={360} rx={6} fill="none" stroke="#3a3858" strokeWidth={8} />
      <rect x={360} y={1010} width={360} height={420} rx={6} fill="none" stroke="#3a3858" strokeWidth={8} />
      <rect x={690} y={1040} width={60} height={18} rx={9} fill="#c0c7d6" />
      <circle cx={540} cy={700} r={14} fill="#c0c7d6" />
    </g>
    <text x={540} y={470} fontSize={70} textAnchor="middle" fontFamily={FONT.mono} fill="#c9cfdb">604</text>
  </g>
);

/**
 * CORREDOR DOS APARTAMENTOS (6º andar). Mundo 3400 x 1920. Portas 601–605 a cada 700 px.
 * 604: x 2200–2520 | leitor à esquerda (2140, 930) | câmera no teto (1700, 230) | Davi (1990, à esquerda do 604) | Bia (2640, à direita)
 */
export const AP = {
  floorY: 1480,
  door: (n: number) => ({x: 100 + (n - 601) * 700, w: 320}),
  reader: {x: 2120, y: 930},
  cam: {x: 1700, y: 230},
  bia: {x: 2660}, davi: {x: 1960},
  clara: {x: 2360}, passage: {x: 3460},
};
/** interior simples do 604 (sala): parede, janela com cortina, abajur, sofá */
const AptInside: React.FC<{x: number; w: number}> = ({x, w}) => (
  <g>
    <rect x={x} y={560} width={w} height={920} fill="#2e3a5c" />
    <rect x={x} y={1280} width={w} height={200} fill="#232c46" />
    <rect x={x + 40} y={660} width={150} height={260} fill="#14203f" stroke="#0e1424" strokeWidth={8} />
    <rect x={x + 30} y={640} width={50} height={300} fill="#5a3f4f" />
    <rect x={x + 210} y={980} width={14} height={300} fill="#1a1f2a" />
    <path d={`M${x + 180},${980} L${x + 254},${980} L${x + 240},${920} L${x + 194},${920} Z`} fill="#e8d6a8" />
    <circle cx={x + 217} cy={990} r={70} fill="#ffe7b0" opacity={0.15} />
    <rect x={x + 10} y={1200} width={w - 20} height={120} rx={20} fill="#4a4060" />
  </g>
);

export const AptCorridor: React.FC<{knock?: number; t?: number; camRot?: number; children?: React.ReactNode; open604?: number; inDoor?: React.ReactNode; knock601?: number}> = ({knock = 0, t = 0, camRot = 0, children, open604 = 0, inDoor, knock601 = 0}) => (
  <g>
    <defs><linearGradient id="apw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#253250" /><stop offset="1" stopColor="#1b2540" /></linearGradient></defs>
    <rect x={-300} y={-300} width={3900} height={1780} fill="url(#apw)" />
    <rect x={-300} y={1480} width={3900} height={800} fill="#131a2e" />
    <rect x={-300} y={1474} width={3900} height={10} fill="#0e1424" />
    {[300, 1000, 1700, 2400, 3100].map((lx) => <rect key={lx} x={lx} y={150} width={200} height={24} rx={8} fill="#dfe7f5" opacity={0.5} />)}
    {[601, 602, 603, 604, 605].map((n) => {
      const {x, w} = AP.door(n);
      const sh = (n === 604 && knock ? Math.sin(t * 60) * 3 * knock : 0) + (n === 601 && knock601 ? Math.sin(t * 60) * 5 * knock601 : 0);
      const op = n === 604 ? open604 : 0;
      return (
        <g key={n}>
          <text x={x + w / 2} y={500} fontSize={64} textAnchor="middle" fontFamily={FONT.mono} fill="#c9cfdb">{n}</text>
          <rect x={x - 20} y={540} width={w + 40} height={940} fill="#0f1526" />
          {op > 0 && <AptInside x={x} w={w} />}
          {op > 0 && inDoor}
          {/* a porta abre para DENTRO (dobradiça à esquerda): a folha estreita e escurece */}
          <g transform={`translate(${sh},0) translate(${x},0) scale(${1 - op * 0.82},1) translate(${-x},0)`} opacity={1 - op * 0.15}>
            <rect x={x} y={560} width={w} height={920} fill={n === 604 ? '#3a3f4f' : '#2b2a44'} />
            <rect x={x + 30} y={610} width={w - 60} height={340} rx={6} fill="none" stroke={n === 604 ? '#4b5163' : '#3a3858'} strokeWidth={8} />
            <rect x={x + 30} y={1000} width={w - 60} height={410} rx={6} fill="none" stroke={n === 604 ? '#4b5163' : '#3a3858'} strokeWidth={8} />
            <rect x={x + w - 70} y={1020} width={56} height={16} rx={8} fill="#c0c7d6" />
            <circle cx={x + w / 2} cy={700} r={12} fill="#c0c7d6" />
          </g>
        </g>
      );
    })}
    {/* passagem para a área técnica (outro lado do corredor) */}
    <rect x={3360} y={520} width={200} height={960} fill="#0a0f1c" />
    <path d="M3360,520 L3560,520 L3560,1480 L3360,1480 Z" fill="none" stroke="#2c3758" strokeWidth={12} />
    <rect x={3340} y={430} width={240} height={56} rx={6} fill="#d8b44a" />
    <text x={3460} y={468} fontSize={28} textAnchor="middle" fontFamily={FONT.title} fill="#111">ÁREA TÉCNICA</text>
    {/* leitor eletrônico do 604 (luz vermelha) */}
    <rect x={AP.reader.x - 34} y={AP.reader.y - 64} width={68} height={128} rx={12} fill="#11131c" stroke="#3a3f55" strokeWidth={4} />
    <rect x={AP.reader.x - 22} y={AP.reader.y - 48} width={44} height={30} rx={4} fill="#3a0a10" />
    {open604 === 0 && <>
      <circle cx={AP.reader.x} cy={AP.reader.y + 28} r={10} fill={C.red} />
      <circle cx={AP.reader.x} cy={AP.reader.y + 28} r={30} fill={C.red} opacity={0.25} />
    </>}
    {/* câmera de segurança */}
    <g transform={`translate(${AP.cam.x},${AP.cam.y})`}>
      <rect x={-34} y={-46} width={68} height={30} rx={6} fill="#c3cad8" />
      <rect x={-8} y={-18} width={16} height={26} fill="#9aa3b5" />
      <g transform={`rotate(${camRot})`}>
        <rect x={-58} y={6} width={116} height={52} rx={20} fill="#e6eaf2" />
        <rect x={42} y={14} width={28} height={36} rx={10} fill="#1a1f2a" />
        <circle cx={56} cy={32} r={9} fill="#3a5a9a" />
        <circle cx={-36} cy={24} r={6} fill={C.red} opacity={0.5 + 0.5 * Math.sin(t * 2.4)} />
      </g>
    </g>
    {children}
  </g>
);

/** CLOSE DA MAÇANETA DO 604 com a mão da Bia hesitando. reach 0..1 */
export const HandleClose: React.FC<{reach: number; t: number}> = ({reach, t}) => {
  const hes = Math.sin(t * 3) * 10 * (reach > 0.6 ? 1 : 0);
  const hx = 820 - reach * 250 + hes, hy = 1180 - reach * 120;
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#3a3f4f" />
      <rect x={-300} y={-300} width={300} height={2520} fill="#0f1526" />
      <rect x={60} y={300} width={700} height={500} rx={10} fill="none" stroke="#4b5163" strokeWidth={14} />
      <rect x={60} y={1200} width={700} height={700} rx={10} fill="none" stroke="#4b5163" strokeWidth={14} />
      {/* maçaneta de alavanca */}
      <rect x={380} y={940} width={120} height={200} rx={30} fill="#9aa3b5" />
      <circle cx={440} cy={1000} r={46} fill="#c0c7d6" />
      <rect x={300} y={980} width={180} height={44} rx={22} fill="#d4dae6" />
      {/* mão + antebraço + manga branca */}
      <path d={`M${hx + 40},${hy + 20} L${hx + 700},${hy + 260} L${hx + 700},${hy + 420} L${hx + 10},${hy + 120} Z`} fill={C.skin} />
      <path d={`M${hx + 520},${hy + 190} L${hx + 900},${hy + 330} L${hx + 900},${hy + 560} L${hx + 470},${hy + 380} Z`} fill={C.shirt} />
      <ellipse cx={hx} cy={hy + 60} rx={110} ry={90} fill={C.skin} />
      {[-55, -18, 18, 52].map((dy, i) => <rect key={i} x={hx - 190} y={hy + 20 + dy} width={120} height={34} rx={17} fill={C.skin} />)}
      <rect x={hx - 80} y={hy + 120} width={90} height={38} rx={19} fill={C.skin} transform={`rotate(-30 ${hx - 40} ${hy + 140})`} />
    </g>
  );
};

/** CLOSE DO LEITOR COM A TAMPA SENDO SOLTA (EP. 6). k 0..1 = tampa solta; off = leitor desligado */
export const ReaderOpen: React.FC<{k: number; off: boolean; t: number}> = ({k, off, t}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#223050" />
    <rect x={330} y={420} width={420} height={820} rx={50} fill="#11131c" stroke="#3a3f55" strokeWidth={10} />
    {/* interior (fios) aparece quando a tampa sai */}
    <g opacity={k}>
      <rect x={370} y={480} width={340} height={700} rx={20} fill="#1d2230" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${400 + i * 80},520 Q${430 + i * 70},800 ${410 + i * 80},1140`} stroke={['#ff2d3d', '#3d8bff', '#ffd23f', '#2fd27a'][i]} strokeWidth={10} fill="none" />)}
      <rect x={470} y={760} width={140} height={90} rx={8} fill="#2a3a2a" />
    </g>
    {/* tampa */}
    <g transform={`translate(${k * 340},${k * 120}) rotate(${k * 18} 540 830)`} opacity={1 - k * 0.25}>
      <rect x={350} y={440} width={380} height={780} rx={40} fill="#181b25" stroke="#3a3f55" strokeWidth={8} />
      <circle cx={540} cy={1020} r={36} fill={off ? '#2a0a0e' : (Math.sin(t * 5) > 0 ? C.red : '#6a1018')} />
      {!off && Math.sin(t * 5) > 0 && <circle cx={540} cy={1020} r={100} fill={C.red} opacity={0.2} />}
      <circle cx={380} cy={470} r={10} fill="#5a6070" /><circle cx={700} cy={1190} r={10} fill="#5a6070" />
    </g>
    {/* mão do Davi com a ferramenta (chave de fenda) */}
    <g transform={`translate(${720 + k * 150},${1160 + k * 60}) rotate(-35)`}>
      <rect x={-180} y={-14} width={200} height={28} rx={6} fill="#c3cad8" />
      <rect x={10} y={-34} width={150} height={68} rx={22} fill="#d8b44a" />
      <ellipse cx={170} cy={0} rx={90} ry={75} fill="#c98f6b" />
      <rect x={220} y={-80} width={500} height={160} rx={60} fill="#5f7690" />
    </g>
  </g>
);
