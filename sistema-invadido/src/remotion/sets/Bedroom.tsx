import React from 'react';
import {FONT} from '../theme';

/**
 * QUARTO DA BIA (manhã) — cenário final do EP. 8. Mundo 1080 x 1920.
 * Seguro e normal: sem câmeras, sem luzes vermelhas. Cama à esquerda, criado-mudo com o celular à direita.
 */
export const BR = {bedTop: 1180, pillow: {x: 300, y: 1130}, stand: {x: 860, y: 1260}, phone: {x: 860, y: 1236}};

export const Bedroom: React.FC<{children?: React.ReactNode; front?: React.ReactNode; phoneLit?: boolean}> = ({children, front, phoneLit = true}) => (
  <g>
    <defs>
      <linearGradient id="brWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e9e2d6" /><stop offset="1" stopColor="#d9d0c2" /></linearGradient>
      <linearGradient id="brSun" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#fff4d8" stopOpacity={0.55} /><stop offset="1" stopColor="#fff4d8" stopOpacity={0} /></linearGradient>
    </defs>
    <rect x={-300} y={-300} width={1680} height={1800} fill="url(#brWall)" />
    <rect x={-300} y={1500} width={1680} height={800} fill="#b9a68c" />
    <rect x={-300} y={1494} width={1680} height={12} fill="#a08d74" />
    {/* janela com cortinas parcialmente fechadas e luz suave da manhã */}
    <rect x={560} y={260} width={420} height={560} fill="#cfe6f5" />
    <rect x={560} y={260} width={420} height={560} fill="none" stroke="#f5f1ea" strokeWidth={16} />
    <path d="M520,230 L700,230 Q680,520 710,860 L520,860 Z" fill="#a9b7c9" />
    <path d="M1020,230 L860,230 Q880,520 850,860 L1020,860 Z" fill="#a9b7c9" />
    <rect x={500} y={216} width={540} height={18} rx={9} fill="#8a8f99" />
    <path d="M700,820 L860,820 L1000,1500 L420,1500 Z" fill="url(#brSun)" />
    {/* quadro na parede */}
    <rect x={120} y={420} width={260} height={190} fill="#f7f3ec" stroke="#b9a68c" strokeWidth={10} />
    <path d="M150,580 L220,500 L270,550 L310,510 L350,580 Z" fill="#9db7c9" />
    {/* cama: cabeceira, colchão, travesseiro */}
    <rect x={20} y={900} width={640} height={300} rx={20} fill="#9a7a5e" />
    <rect x={10} y={1160} width={720} height={160} rx={24} fill="#f4f5f7" />
    <rect x={10} y={1300} width={720} height={200} fill="#8a6b51" />
    <ellipse cx={BR.pillow.x} cy={BR.pillow.y} rx={210} ry={70} fill="#ffffff" />
    <path d={`M${BR.pillow.x - 180},${BR.pillow.y - 10} Q${BR.pillow.x},${BR.pillow.y - 40} ${BR.pillow.x + 180},${BR.pillow.y - 10}`} stroke="#e3e6ec" strokeWidth={6} fill="none" />
    {/* criado-mudo com o celular */}
    <rect x={760} y={1250} width={230} height={250} rx={10} fill="#8a6b51" />
    <rect x={750} y={1236} width={250} height={26} rx={8} fill="#9a7a5e" />
    <rect x={790} y={1320} width={170} height={60} rx={6} fill="#7a5d45" />
    <circle cx={875} cy={1350} r={8} fill="#d8c3a5" />
    {children}
    {front}
  </g>
);

/** celular sobre o criado-mudo (deitado, tela para cima) — mostra o alarme. ringing anima a tela */
export const PhoneOnStand: React.FC<{ringing: boolean; t: number}> = ({ringing, t}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#9a7a5e" />
    <rect x={-300} y={-300} width={1680} height={2520} fill="url(#grainWood)" />
    <defs><linearGradient id="grainWood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity={0.06} /><stop offset="0.5" stopColor="#fff" stopOpacity={0.05} /><stop offset="1" stopColor="#000" stopOpacity={0.08} /></linearGradient></defs>
    <g transform={`translate(540,960) rotate(-6) translate(${ringing ? Math.sin(t * 60) * 3 : 0},0)`}>
      <rect x={-260} y={-520} width={520} height={1040} rx={70} fill="#0b0d14" stroke="#262c3c" strokeWidth={10} />
      <rect x={-232} y={-492} width={464} height={984} rx={52} fill="#0d1222" />
      <text x={0} y={-190} fontSize={170} textAnchor="middle" fontFamily={FONT.semi} fill="#f4f6fb">07:00</text>
      <text x={0} y={-70} fontSize={50} textAnchor="middle" fontFamily={FONT.bold} fill="#cfd6e6">DESPERTADOR</text>
      <rect x={-190} y={20} width={380} height={86} rx={43} fill={ringing && Math.sin(t * 8) > 0 ? '#2b3550' : '#1d2438'} />
      <text x={0} y={76} fontSize={40} textAnchor="middle" fontFamily={FONT.bold} fill="#ffd23f">ADIADO 6 VEZES</text>
      <circle cx={-110} cy={330} r={70} fill="#3a4258" /><text x={-110} y={346} fontSize={34} textAnchor="middle" fontFamily={FONT.bold} fill="#fff">ADIAR</text>
      <circle cx={110} cy={330} r={70} fill="#e2a03a" /><text x={110} y={346} fontSize={34} textAnchor="middle" fontFamily={FONT.bold} fill="#fff">PARAR</text>
    </g>
  </g>
);
