import React from 'react';
import {C, FONT} from '../theme';
import {lerp} from '../lib/anim';

/**
 * ESCADA B — PLANOS FIXOS (EP. 2A+). Cada componente é um enquadramento independente em 1080 x 1920.
 * Regras: só uma porta, um patamar ou um lance curto (6 degraus) por plano.
 * Posições de referência: chão do patamar y = 1460 | porta x 120–440 | placa x 520–720 | lance começa em x 760.
 */
export const LS = {
  floorY: 1460,
  door: {x: 120, y: 600, w: 320, h: 860},
  bia: {x: 730, y: 1462, s: 1.0},       // Bia em pé no patamar (ao lado da grade) — posição FIXA
  davi: {x: 280, y: 1462, s: 0.98},     // Davi na abertura / em frente à porta técnica
  daviSide: {x: 500, y: 1462, s: 0.98}, // Davi ao lado da porta aberta (cena 7+)
  stepW: 52, stepH: 62, steps: 6, stairX: 760,
};
const WALL_TOP = '#384a66', WALL_BOT = '#2b3a54', FLOOR = '#1e283d', EDGE = '#56647e';

/** Folha de porta com dobradiça à esquerda. open 0..1; toward=true abre em direção à câmera. */
export const DoorLeaf: React.FC<{x: number; y: number; w: number; h: number; open: number; toward?: boolean; color: string; children?: React.ReactNode; inside?: string; inDoor?: React.ReactNode}> = ({x, y, w, h, open, toward = true, color, children, inside = '#06080d', inDoor}) => {
  const a = open * Math.PI * 0.45;
  const fx = x + w * Math.cos(a);
  const grow = (toward ? 0.16 : -0.1) * Math.sin(a) * h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={inside} />
      {inDoor}
      <path d={`M${x},${y} L${fx},${y - grow * 0.5} L${fx},${y + h + grow * 0.5} L${x},${y + h} Z`} fill={color} stroke="rgba(0,0,0,0.35)" strokeWidth={6} />
      {open < 0.05 && children}
    </g>
  );
};

/** Porta corta-fogo (vermelha) com número/placa, maçaneta de alavanca e fechadura de chave. */
export const FireDoor: React.FC<{open?: number; label: string; sign?: string; locked?: boolean; inside?: string; toward?: boolean; inDoor?: React.ReactNode}> = ({open = 0, label, sign, inside, toward = true, inDoor}) => {
  const {x, y, w, h} = LS.door;
  return (
    <g>
      <rect x={x - 22} y={y - 22} width={w + 44} height={h + 22} fill="#1a2234" />
      {sign && (
        <g>
          <rect x={x - 10} y={y - 110} width={w + 20} height={70} rx={8} fill={C.yellow} />
          <text x={x + w / 2} y={y - 62} fontSize={36} textAnchor="middle" fontFamily={FONT.title} fill="#111">{sign}</text>
        </g>
      )}
      <DoorLeaf x={x} y={y} w={w} h={h} open={open} toward={toward} color="#8a2c31" inside={inside} inDoor={inDoor}>
        <rect x={x + 30} y={y + 40} width={w - 60} height={330} rx={6} fill="none" stroke="#6a1f24" strokeWidth={6} />
        <rect x={x + 30} y={y + 430} width={w - 60} height={380} rx={6} fill="none" stroke="#6a1f24" strokeWidth={6} />
        <rect x={x + w / 2 - 60} y={y + 120} width={120} height={150} rx={8} fill="#e8e2d0" />
        <text x={x + w / 2} y={y + 232} fontSize={label.length > 2 ? 34 : 100} textAnchor="middle" fontFamily={FONT.title} fill="#5b1b20">{label}</text>
        {/* fechadura + alavanca */}
        <rect x={x + w - 64} y={y + 400} width={34} height={70} rx={8} fill="#b8c0cf" />
        <circle cx={x + w - 47} cy={y + 452} r={7} fill="#2a2f38" />
        <rect x={x + w - 110} y={y + 412} width={80} height={18} rx={9} fill="#d4dae6" />
      </DoorLeaf>
    </g>
  );
};

/** Lance curto descendo para a direita (6 degraus) + corrimão metálico. */
export const ShortFlight: React.FC<{gate?: boolean; people?: React.ReactNode}> = ({gate = false, people}) => {
  const {stairX, stepW, stepH, steps, floorY} = LS;
  const pts = Array.from({length: steps + 1}).map((_, i) => ({x: stairX + i * stepW, y: floorY + i * stepH}));
  return (
    <g>
      {/* vão da escada (sombra) */}
      <path d={`M${stairX},${floorY} L1100,${floorY} L1100,1920 L${stairX},1920 Z`} fill="#121a2a" />
      {pts.slice(0, -1).map((p, i) => (
        <g key={i}>
          <rect x={p.x} y={p.y} width={1100 - p.x} height={stepH + 2} fill={i % 2 ? '#34425c' : '#2f3c55'} />
          <line x1={p.x} y1={p.y} x2={1100} y2={p.y} stroke={EDGE} strokeWidth={5} />
        </g>
      ))}
      {people}
      {/* corrimão */}
      <path d={`M${stairX - 20},${floorY - 230} L${stairX + steps * stepW + 40},${floorY + steps * stepH - 230}`} stroke="#a8b2c3" strokeWidth={12} strokeLinecap="round" />
      {[0, 2, 4, 6].map((i) => (
        <line key={i} x1={stairX + i * stepW} y1={floorY + i * stepH - 230 + 2} x2={stairX + i * stepW} y2={floorY + i * stepH} stroke="#7d889b" strokeWidth={7} />
      ))}
      {gate && (
        <g>
          {/* grade de segurança fechada, presa na parede e no corrimão */}
          <rect x={stairX - 30} y={floorY - 330} width={330} height={340} fill="none" stroke="#9aa3b5" strokeWidth={12} />
          {Array.from({length: 11}).map((_, i) => <line key={i} x1={stairX - 30 + i * 33} y1={floorY - 330} x2={stairX - 30 + i * 33} y2={floorY + 10} stroke="#8a93a6" strokeWidth={6} />)}
          <line x1={stairX - 30} y1={floorY - 170} x2={stairX + 300} y2={floorY - 170} stroke="#9aa3b5" strokeWidth={8} />
          <path d={`M${stairX + 110},${floorY - 190} q25,30 50,0`} stroke="#c9cfdb" strokeWidth={6} fill="none" />
          <rect x={stairX + 115} y={floorY - 175} width={40} height={46} rx={6} fill="#d8b44a" />
          <rect x={stairX + 60} y={floorY - 360} width={210} height={46} rx={6} fill={C.red} />
          <text x={stairX + 165} y={floorY - 328} fontSize={26} textAnchor="middle" fontFamily={FONT.title} fill="#fff">BLOQUEADO</text>
        </g>
      )}
    </g>
  );
};

/** PATAMAR (7º ou 6º): parede azul-acinzentada, uma porta, placa do andar, lance curto. */
export const LandingSet: React.FC<{
  floor: 6 | 7; doorOpen?: number; gate?: boolean; light?: number; redLight?: number; blueLight?: number; children?: React.ReactNode; flightPeople?: React.ReactNode; doorInside?: string; inDoor?: React.ReactNode;
}> = ({floor, doorOpen = 0, gate = false, light = 1, redLight = 0, blueLight = 0, children, flightPeople, doorInside, inDoor}) => (
  <g>
    <defs>
      <linearGradient id={`lw${floor}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={WALL_TOP} /><stop offset="1" stopColor={WALL_BOT} /></linearGradient>
    </defs>
    <rect x={-300} y={-300} width={1680} height={LS.floorY + 300} fill={`url(#lw${floor})`} />
    <rect x={-300} y={LS.floorY} width={1680} height={800} fill={FLOOR} />
    <rect x={-300} y={LS.floorY - 6} width={1680} height={10} fill="#18203a" />
    {/* luminária e câmera de segurança no teto */}
    <rect x={430} y={150} width={220} height={26} rx={8} fill="#dfe7f5" opacity={0.85} />
    <ellipse cx={540} cy={260} rx={420} ry={180} fill="#dfe7f5" opacity={0.05} />
    <g transform="translate(960,150)"><rect x={-30} y={-20} width={60} height={24} rx={6} fill="#c9cfdb" /><circle cx={0} cy={18} r={22} fill="#1a1f2a" /><circle cx={0} cy={20} r={6} fill={C.red} /></g>
    {/* placa do andar */}
    <rect x={470} y={330} width={180} height={210} rx={14} fill="#eef1f6" />
    <text x={560} y={500} fontSize={175} textAnchor="middle" fontFamily={FONT.title} fill="#1d2433">{floor}</text>
    <text x={560} y={580} fontSize={28} textAnchor="middle" fontFamily={FONT.title} fill="#c9d2e3">{floor}º ANDAR</text>
    <FireDoor open={doorOpen} label={floor === 6 ? 'TÉCNICO' : '7'} sign={floor === 6 ? 'ACESSO TÉCNICO' : 'ESCADA B'} inside={doorInside} toward={floor === 7} inDoor={inDoor} />
    <ShortFlight gate={gate} people={flightPeople} />
    {children}
    {blueLight > 0 && <rect x={-300} y={-300} width={1680} height={2520} fill={C.blue} opacity={blueLight * 0.18} />}
    {redLight > 0 && <rect x={-300} y={-300} width={1680} height={2520} fill={C.red} opacity={redLight * 0.18} />}
    <rect x={-300} y={-300} width={1680} height={2520} fill="#000" opacity={(1 - light) * 0.75} />
  </g>
);

/** CLOSE DOS TÊNIS descendo dois degraus, um pé por vez (pés sempre apoiados). t em segundos locais. */
export const FeetOnSteps: React.FC<{t: number}> = ({t}) => {
  const SW = 300, SH = 150; // degrau grande no close
  const stepTop = (i: number) => ({x: 40 + i * SW, y: 820 + i * SH});
  // pé direito: degrau 0 -> 1 (0,4–1,0s) -> 2 (2,2–2,8s); pé esquerdo: 0 -> 2 (1,3–1,9s)
  const move = (a: number, b: number, t0: number, t1: number) => {
    const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const A = stepTop(a), B = stepTop(b);
    return {x: lerp(A.x + 150, B.x + 150, e), y: lerp(A.y, B.y, e) - Math.sin(Math.PI * k) * 70};
  };
  const R = t < 1.1 ? move(0, 1, 0.4, 1.0) : move(1, 2, 2.2, 2.8);
  const Lp = move(0, 2, 1.3, 1.9);
  const shoe = (p: {x: number; y: number}, far: boolean) => (
    <g>
      <path d={`M${p.x - 10},${p.y - 60} L${p.x - 40},-200`} stroke={far ? '#0c0d12' : C.pants} strokeWidth={96} strokeLinecap="round" />
      <path d={`M${p.x - 70},${p.y} Q${p.x - 72},${p.y - 64} ${p.x - 20},${p.y - 66} Q${p.x + 70},${p.y - 56} ${p.x + 96},${p.y - 6} L${p.x + 96},${p.y} Z`} fill={far ? '#dfe3ea' : C.shoe} />
      <rect x={p.x - 74} y={p.y - 14} width={174} height={16} rx={7} fill="#b9bfcc" />
    </g>
  );
  return (
    <g>
      <rect x={-300} y={-300} width={1680} height={2520} fill="#2b3a54" />
      {[0, 1, 2, 3].map((i) => {
        const s = stepTop(i);
        return <g key={i}><rect x={s.x} y={s.y} width={1400} height={SH + 600} fill={i % 2 ? '#34425c' : '#2f3c55'} /><line x1={s.x} y1={s.y} x2={1400} y2={s.y} stroke={EDGE} strokeWidth={8} /></g>;
      })}
      {shoe(Lp, true)}
      {shoe(R, false)}
    </g>
  );
};

/** CLOSE DA FECHADURA DA PORTA TÉCNICA: mão do Davi girando a chave (rot 0..1 = 0°..90°). */
export const KeyInLock: React.FC<{turn: number; insert: number}> = ({turn, insert}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#8a2c31" />
    <rect x={-300} y={500} width={1680} height={10} fill="#6a1f24" />
    <rect x={380} y={700} width={320} height={560} rx={30} fill="#b8c0cf" stroke="#8a93a6" strokeWidth={8} />
    <circle cx={540} cy={980} r={70} fill="#9aa3b5" />
    <circle cx={540} cy={980} r={44} fill="#c9cfdb" />
    <g transform={`translate(540,980) rotate(${turn * 90})`}>
      <rect x={-8} y={-30} width={16} height={60} rx={4} fill="#2a2f38" />
      <g transform={`translate(${(1 - insert) * 160},0)`}>
        {/* chave */}
        <rect x={0} y={-14} width={150} height={28} rx={8} fill="#d8b44a" />
        <circle cx={200} cy={0} r={62} fill="#d8b44a" /><circle cx={200} cy={0} r={22} fill="#8a2c31" />
        {/* mão (manga cinza-azulada vindo da direita) */}
        <ellipse cx={210} cy={30} rx={92} ry={74} fill="#c98f6b" />
        <rect x={150} y={-40} width={60} height={30} rx={15} fill="#c98f6b" />
        <rect x={270} y={-40} width={500} height={170} rx={60} fill="#5f7690" />
      </g>
    </g>
  </g>
);

/** CORREDOR TÉCNICO (imagem da câmera CAM 12). children = personagens. */
export const TechCorridor: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <g>
    <rect x={-300} y={-300} width={1680} height={2520} fill="#1c222c" />
    <path d="M-300,2200 L420,1080 L660,1080 L1380,2200 Z" fill="#2a313d" />
    <path d="M-300,-300 L420,700 L660,700 L1380,-300 Z" fill="#151a22" />
    <rect x={420} y={700} width={240} height={380} fill="#0b0e13" />
    {[0, 1, 2].map((i) => <line key={i} x1={-300} y1={-100 + i * 70} x2={420} y2={720 + i * 18} stroke="#5b6475" strokeWidth={22 - i * 5} />)}
    {[0.2, 0.5, 0.75].map((k) => <rect key={k} x={540 - lerp(160, 40, k)} y={lerp(-300, 700, k) + 20} width={lerp(320, 80, k)} height={lerp(26, 8, k)} rx={6} fill="#dfe7f5" opacity={0.7} />)}
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={lerp(-300, 420, i / 5)} y={lerp(2200, 1080, i / 5) - 30} width={60} height={14} fill={C.yellow} opacity={0.5} transform={`skewX(-30)`} />)}
    {/* batente da porta (em primeiro plano, à direita) */}
    <rect x={820} y={300} width={70} height={1700} fill="#8a2c31" />
    {children}
  </g>
);
