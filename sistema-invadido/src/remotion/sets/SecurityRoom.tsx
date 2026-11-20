import React from 'react';
import {C, FONT} from '../theme';
import {Hall6, AptCorridor, AP} from './Hall6';

/**
 * ÁREA TÉCNICA e SALA DE SEGURANÇA (EP. 7+). Planos em 1080 x 1920.
 * Sala realista: mesa de monitoramento, computador principal, 4 monitores de câmeras, rack de rede, câmera no teto.
 */
export const SR = {floorY: 1700, cam: {x: 170, y: 250}};

/** CORREDOR TÉCNICO: estreito, pouca luz, placa e porta entreaberta. open 0.15..1 */
export const TechHallDoor: React.FC<{open: number; children?: React.ReactNode}> = ({open, children}) => {
  const x = 380, y = 640, w = 340, h = 860;
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#161c2a" />
      <path d="M-300,-300 L120,300 L120,1500 L-300,2200 Z" fill="#11161f" />
      <path d="M1380,-300 L960,300 L960,1500 L1380,2200 Z" fill="#121822" />
      <rect x={120} y={300} width={840} height={1200} fill="#1b2232" />
      <path d="M120,1500 L960,1500 L1380,2200 L-300,2200 Z" fill="#10141d" />
      {[0, 1].map((i) => <line key={i} x1={130} y1={360 + i * 40} x2={950} y2={360 + i * 40} stroke="#4b5568" strokeWidth={14 - i * 4} />)}
      <rect x={480} y={240} width={120} height={18} rx={6} fill="#cfd8e8" opacity={0.35} />
      {/* placa */}
      <rect x={300} y={470} width={500} height={110} rx={8} fill={C.yellow} />
      <text x={550} y={516} fontSize={40} textAnchor="middle" fontFamily={FONT.title} fill="#111">SEGURANÇA</text>
      <text x={550} y={560} fontSize={30} textAnchor="middle" fontFamily={FONT.title} fill="#7a1018">ACESSO RESTRITO</text>
      {/* vão com a luz azul dos monitores */}
      <rect x={x} y={y} width={w} height={h} fill="#0b1426" />
      <rect x={x} y={y} width={w} height={h} fill="#3d8bff" opacity={0.18 + open * 0.15} />
      <path d={`M${x},${y + h} L${x + w},${y + h} L${x + w + 180},${y + h + 260} L${x - 120},${y + h + 260} Z`} fill="#3d8bff" opacity={0.06 + open * 0.1} />
      {/* folha da porta (abre para dentro; dobradiça à direita) */}
      <g transform={`translate(${x + w},0) scale(${Math.max(0.06, 1 - open)},1) translate(${-(x + w)},0)`}>
        <rect x={x} y={y} width={w} height={h} fill="#3a4152" stroke="#2a303d" strokeWidth={6} />
        <rect x={x + 20} y={y + 380} width={22} height={70} rx={8} fill="#c0c7d6" />
      </g>
      {children}
    </g>
  );
};

/** imagem de câmera dentro de um monitor (svg do cenário + tom azul + rótulo) */
const Feed: React.FC<{x: number; y: number; w: number; h: number; label: string; view: React.ReactNode; vb: string}> = ({x, y, w, h, label, view, vb}) => (
  <g>
    <rect x={x - 12} y={y - 12} width={w + 24} height={h + 24} rx={10} fill="#0b0d12" />
    <svg x={x} y={y} width={w} height={h} viewBox={vb} preserveAspectRatio="xMidYMid slice">{view}</svg>
    <rect x={x} y={y} width={w} height={h} fill="#3d6bff" opacity={0.22} />
    <text x={x + 10} y={y + 26} fontSize={20} fontFamily={FONT.mono} fill="#e8eefc">{label}</text>
    <circle cx={x + w - 18} cy={y + 18} r={6} fill={C.red} />
  </g>
);
export const FEEDS = {
  elev: {label: 'ELEVADOR', vb: '80 360 900 1300', view: <Hall6 open={0.42} />},
  hall: {label: 'CORREDOR · 6º', vb: '1500 360 1400 1300', view: <AptCorridor open604={1} />},
  door604: {label: 'APTO 604', vb: `${AP.door(604).x - 300} 360 920 1300`, view: <AptCorridor open604={1} />},
  door601: {label: 'APTO 601', vb: `${AP.door(601).x - 300} 360 920 1300`, view: <AptCorridor />},
};

/** SALA DE SEGURANÇA vista de trás dos personagens (olhando para a parede de monitores). screen = conteúdo do monitor principal. */
export const SecurityRoom: React.FC<{t: number; children?: React.ReactNode; screen?: React.ReactNode; mainGlow?: string}> = ({t, children, screen, mainGlow = '#3d8bff'}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#141a28" />
    <rect x={-300} y={-300} width={1680} height={300} fill="#0f1420" />
    <rect x={460} y={60} width={160} height={16} rx={6} fill="#cfd8e8" opacity={0.25} />
    {/* parede de monitores 2x2 */}
    <Feed x={110} y={330} w={400} h={260} {...FEEDS.elev} />
    <Feed x={570} y={330} w={400} h={260} {...FEEDS.hall} />
    <Feed x={110} y={650} w={400} h={260} {...FEEDS.door604} />
    <Feed x={570} y={650} w={400} h={260} {...FEEDS.door601} />
    {/* rack de rede */}
    <rect x={1010} y={380} width={150} height={900} rx={8} fill="#0d1018" stroke="#2a303d" strokeWidth={4} />
    {Array.from({length: 14}).map((_, i) => (
      <g key={i}>
        <rect x={1022} y={400 + i * 62} width={126} height={44} rx={4} fill="#1a1f2b" />
        <circle cx={1040} cy={422 + i * 62} r={5} fill={Math.sin(t * 6 + i * 1.7) > 0 ? C.green : '#173a25'} />
        <circle cx={1058} cy={422 + i * 62} r={5} fill={Math.sin(t * 9 + i) > 0.4 ? '#ffb020' : '#3a2a10'} />
      </g>
    ))}
    {/* mesa + computador principal */}
    <rect x={-300} y={1300} width={1680} height={80} fill="#2a2f3b" />
    <rect x={-300} y={1380} width={1680} height={900} fill="#0e121b" />
    <rect x={330} y={980} width={420} height={280} rx={12} fill="#05070c" stroke="#2a303d" strokeWidth={8} />
    <rect x={345} y={995} width={390} height={250} fill="#0b1020" />
    <rect x={345} y={995} width={390} height={250} fill={mainGlow} opacity={0.12} />
    {screen ?? Array.from({length: 7}).map((_, i) => <rect key={i} x={365} y={1015 + i * 30} width={180 + (i * 53) % 160} height={10} rx={4} fill="#5c7cff" opacity={0.6} />)}
    <rect x={520} y={1260} width={40} height={40} fill="#1a1f2a" />
    <rect x={400} y={1300} width={280} height={30} rx={6} fill="#3a4050" />
    <ellipse cx={540} cy={1200} rx={600} ry={500} fill={mainGlow} opacity={0.05} />
    {children}
  </g>
);

/** CONTRAPLANO: os personagens de frente, iluminados pelos monitores; porta da sala ao fundo e câmera no teto. camRot gira a câmera. */
export const SecurityReverse: React.FC<{t: number; camRot?: number; children?: React.ReactNode; red?: number}> = ({t, camRot = -20, children, red = 0}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#121826" />
    <rect x={-300} y={1500} width={1680} height={800} fill="#0d111a" />
    {/* porta entreaberta ao fundo */}
    <rect x={640} y={560} width={300} height={940} fill="#0a0e16" />
    <rect x={640} y={560} width={110} height={940} fill="#1b2232" />
    <rect x={620} y={540} width={340} height={20} fill="#0a0e16" />
    {/* câmera de segurança no teto */}
    <g transform={`translate(${SR.cam.x},${SR.cam.y})`}>
      <rect x={-34} y={-46} width={68} height={30} rx={6} fill="#c3cad8" />
      <rect x={-8} y={-18} width={16} height={26} fill="#9aa3b5" />
      <g transform={`rotate(${camRot})`}>
        <rect x={-58} y={6} width={116} height={52} rx={20} fill="#e6eaf2" />
        <rect x={42} y={14} width={28} height={36} rx={10} fill="#1a1f2a" />
        <circle cx={56} cy={32} r={9} fill="#3a5a9a" />
        <circle cx={-36} cy={24} r={6} fill={C.red} opacity={0.6 + 0.4 * Math.sin(t * 3)} />
      </g>
    </g>
    {children}
    {/* luz azul dos monitores vinda da câmera (frente) */}
    <rect x={-300} y={-300} width={1680} height={2520} fill="#3d8bff" opacity={0.08} />
    {red > 0 && <rect x={-300} y={-300} width={1680} height={2520} fill={C.red} opacity={red * 0.14} />}
  </g>
);

/** close no teclado com a mão da Bia se aproximando */
export const KeyboardClose: React.FC<{reach: number}> = ({reach}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#0e121b" />
    <rect x={60} y={900} width={960} height={420} rx={30} fill="#23283a" />
    {Array.from({length: 4}).map((_, r) => Array.from({length: 11}).map((__, c) => (
      <rect key={`${r}-${c}`} x={100 + c * 80} y={940 + r * 86} width={66} height={70} rx={10} fill="#3a4156" />
    )))}
    <rect x={260} y={1290} width={540} height={0} />
    <g transform={`translate(${880 - reach * 300},${660 - reach * 150})`}>
      <path d="M40,40 L640,-240 L700,-120 L80,150 Z" fill={C.skin} />
      <path d="M520,-200 L860,-360 L920,-220 L580,-80 Z" fill={C.shirt} />
      <ellipse cx={20} cy={90} rx={110} ry={80} fill={C.skin} />
      {[-40, 0, 40, 80].map((dx, i) => <rect key={i} x={-110 + dx} y={110} width={36} height={110} rx={18} fill={C.skin} transform={`rotate(${10 - i * 5} ${-92 + dx} 110)`} />)}
    </g>
  </g>
);
