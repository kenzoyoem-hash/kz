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
};

export const Hall6: React.FC<{open?: number; readerState?: 'idle' | 'denied'; children?: React.ReactNode; light?: number}> = ({open = 0.42, readerState = 'idle', children, light = 1}) => {
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
