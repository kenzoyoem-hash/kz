import React from 'react';
import {C, FONT} from '../styles/theme';
import {rnd, wobble} from '../lib/anim';
import {useCam} from './Camera';

/* =====================================================================
 * CENÁRIOS REUTILIZÁVEIS — São Paulo futurista (camadas para parallax)
 * ===================================================================== */

/** céu noturno com névoa roxa */
export const NightSky: React.FC<{x?: number; y?: number; w?: number; h?: number; hue?: 'purple' | 'red'}> = ({x = -600, y = -800, w = 2400, h = 3200, hue = 'purple'}) => (
  <g>
    <defs>
      <linearGradient id={`sky-${hue}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={C.ink} />
        <stop offset="0.55" stopColor={C.navy} />
        <stop offset="0.8" stopColor={hue === 'red' ? '#3A1022' : '#2A1650'} />
        <stop offset="1" stopColor={hue === 'red' ? '#5A1430' : '#4A1F7A'} />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#sky-${hue})`} />
  </g>
);

/** fileira de prédios estilizados com janelas acesas. seed fixo = mesma cidade em todos os episódios */
export const Skyline: React.FC<{seed: string; x0: number; x1: number; base: number; minH: number; maxH: number;
  col: string; win?: string; winP?: number; t?: number; neon?: boolean; antenna?: boolean}> =
  ({seed, x0, x1, base, minH, maxH, col, win = '#36B7FF', winP = 0.25, t = 0, neon = false, antenna = false}) => {
  const out: React.ReactNode[] = [];
  let x = x0, i = 0;
  while (x < x1) {
    const w = 70 + rnd(`${seed}w${i}`) * 110;
    const h = minH + rnd(`${seed}h${i}`) * (maxH - minH);
    const top = base - h;
    const kind = Math.floor(rnd(`${seed}k${i}`) * 4);
    out.push(
      <g key={i}>
        {kind === 1 ? (
          <path d={`M${x},${base} L${x},${top + 30} L${x + w / 2},${top} L${x + w},${top + 30} L${x + w},${base} Z`} fill={col} />
        ) : kind === 2 ? (
          <path d={`M${x},${base} L${x},${top} L${x + w * 0.7},${top} L${x + w},${top + 40} L${x + w},${base} Z`} fill={col} />
        ) : (
          <rect x={x} y={top} width={w} height={h} fill={col} />
        )}
        {antenna && kind === 0 && <rect x={x + w / 2 - 2} y={top - 50} width={4} height={50} fill={col} />}
        {antenna && kind === 0 && <circle cx={x + w / 2} cy={top - 52} r={4} fill={C.red} opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />}
      </g>,
    );
    // janelas
    const cols = Math.floor(w / 22), rows = Math.floor((h - 40) / 30);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const v = rnd(`${seed}${i}-${r}-${c}`);
      if (v < winP) {
        const flick = v < winP * 0.08 ? 0.4 + 0.6 * (Math.sin(t * 9 + r) > 0 ? 1 : 0) : 1;
        out.push(<rect key={`${i}-${r}-${c}`} x={x + 8 + c * 22} y={top + 34 + r * 30} width={10} height={14}
          fill={v < winP * 0.3 ? C.magenta : v < winP * 0.55 ? C.gold : win} opacity={(0.35 + v) * flick * 0.8} />);
      }
    }
    if (neon && rnd(`${seed}n${i}`) < 0.3 && h > minH + 80) {
      const nc = [C.purple, C.magenta, C.blue][Math.floor(rnd(`${seed}c${i}`) * 3)];
      out.push(<rect key={`n${i}`} x={x + 6} y={top + 14} width={w - 12} height={5} fill={nc} opacity={0.9} />);
    }
    x += w + 8 + rnd(`${seed}g${i}`) * 20;
    i++;
  }
  return <g>{out}</g>;
};

/** telão publicitário com texto real */
export const Billboard: React.FC<{x: number; y: number; w: number; h: number; t: number; lines: string[]; col?: string; sub?: string}> = ({x, y, w, h, t, lines, col = C.purple, sub}) => {
  const fl = 0.85 + 0.15 * Math.sin(t * 7) * Math.sin(t * 2.3);
  return (
    <g>
      <rect x={x - 10} y={y - 10} width={w + 20} height={h + 20} rx={10} fill="#05070E" />
      <rect x={x} y={y} width={w} height={h} rx={6} fill={col} opacity={0.18 * fl} />
      <rect x={x} y={y} width={w} height={h} rx={6} fill="none" stroke={col} strokeWidth={4} opacity={fl} />
      {lines.map((l, i) => (
        <text key={i} x={x + w / 2} y={y + h * (lines.length === 1 ? 0.62 : 0.42 + i * 0.36)} textAnchor="middle" fill={i === 0 ? C.white : col}
          fontFamily={i === 0 ? FONT.title : FONT.bold} fontSize={i === 0 ? h * 0.32 : h * 0.17} opacity={fl}>{l}</text>
      ))}
      {sub && <text x={x + w / 2} y={y + h + 44} textAnchor="middle" fill={col} fontFamily={FONT.semi} fontSize={24} opacity={0.7}>{sub}</text>}
      <rect x={x + w / 2 - 6} y={y + h + 10} width={12} height={200} fill="#05070E" />
    </g>
  );
};

/** ícone de ampulheta (logotipo do app TEMPO) */
export const TempoIcon: React.FC<{x: number; y: number; s?: number; col?: string}> = ({x, y, s = 1, col = C.gold}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-14,-20 L14,-20 L14,-16 L3,-2 L3,2 L14,16 L14,20 L-14,20 L-14,16 L-3,2 L-3,-2 L-14,-16 Z" fill="none" stroke={col} strokeWidth={4} strokeLinejoin="round" />
    <path d="M-7,14 L7,14 L0,6 Z" fill={col} />
  </g>
);

/* =====================================================================
 * APARTAMENTO DA MAYA — cenário fixo (mesma planta em todos os episódios)
 * Coordenadas de mundo: chão em y = 1500. Sofá centrado em x = 720 (assento a 117 px do chão, escala 1,3).
 * Mesa com contas à esquerda, janela com vista urbana ao fundo, cozinha compacta + geladeira à direita.
 * ===================================================================== */
export const SOFA_X = 720;
export const SOFA_SEAT_Y = 1500;   // personagens sentados usam y = chão (o rig dobra as pernas)
export const FLOOR_Y = 1500;
export const MAYA_S = 1.3;

export const ApartmentBack: React.FC<{t: number; fridgeOpen?: number; light?: number; windowGlow?: number}> = ({t, fridgeOpen = 0, light = 1, windowGlow = 1}) => {
  const cam = useCam();
  const px = (cam.x - 540) * 0.55, py = (cam.y - 960) * 0.35;  // parallax da vista pela janela
  return (
    <g>
      <defs>
        <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0C1222" />
          <stop offset="0.6" stopColor={C.wall} />
          <stop offset="1" stopColor="#1A1B3E" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.purple} stopOpacity="0.55" />
          <stop offset="1" stopColor={C.purple} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="winGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.blue} stopOpacity="0.35" />
          <stop offset="1" stopColor={C.blue} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#151A35" />
          <stop offset="1" stopColor={C.ink} />
        </linearGradient>
        <clipPath id="winClip"><rect x={300} y={560} width={540} height={560} /></clipPath>
        <linearGradient id="fridgeIn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF6D8" />
          <stop offset="1" stopColor="#D8E6FF" />
        </linearGradient>
      </defs>
      {/* parede */}
      <rect x={-600} y={-700} width={2700} height={2200} fill="url(#wall)" />
      {/* faixa de LED no teto */}
      <rect x={-600} y={330} width={2700} height={6} fill={C.purple} opacity={0.5} />
      <rect x={-600} y={336} width={2700} height={60} fill={C.purple} opacity={0.06} />
      {/* janela com vista urbana (parallax) */}
      <g clipPath="url(#winClip)">
        <g transform={`translate(${px},${py})`}>
          <NightSky x={-200} y={300} w={1600} h={1100} />
          <Skyline seed="sp-far" x0={-200} x1={1400} base={1180} minH={160} maxH={420} col="#1B1640" winP={0.12} t={t} antenna />
          <Billboard x={600} y={700} w={210} h={105} t={t} lines={['TEMPO', 'VENDA SEUS ANOS']} col={C.magenta} />
          <Skyline seed="sp-mid" x0={-200} x1={1400} base={1200} minH={80} maxH={260} col="#120F2C" winP={0.2} t={t} neon />
        </g>
        <rect x={300} y={560} width={540} height={560} fill={C.blue} opacity={0.05} />
      </g>
      {/* caixilho */}
      <rect x={300} y={560} width={540} height={560} fill="none" stroke="#2A2F4A" strokeWidth={18} />
      <rect x={562} y={560} width={16} height={560} fill="#2A2F4A" />
      <rect x={300} y={830} width={540} height={12} fill="#2A2F4A" />
      <rect x={280} y={1120} width={580} height={22} rx={4} fill="#232842" />
      <ellipse cx={570} cy={1250} rx={520} ry={420} fill="url(#winGlow)" opacity={windowGlow} />
      {/* pôster e prateleira acima da mesa */}
      <rect x={70} y={640} width={170} height={230} rx={6} fill="#1C2340" />
      <circle cx={155} cy={730} r={52} fill="none" stroke={C.magenta} strokeWidth={6} opacity={0.6} />
      <path d="M110,820 L200,820" stroke={C.blue} strokeWidth={6} opacity={0.5} />
      <rect x={40} y={960} width={240} height={12} rx={3} fill="#272D4A" />
      <path d="M90,960 q-10,-40 6,-62 q8,26 -2,62 M100,960 q14,-34 34,-44 q-10,26 -26,44" fill={C.moss} opacity={0.8} />
      <rect x={82} y={930} width={32} height={30} rx={4} fill="#3A3F5E" />
      <rect x={190} y={920} width={22} height={40} rx={3} fill="#3A3F5E" />
      {/* cozinha compacta */}
      <rect x={1050} y={800} width={230} height={170} rx={6} fill="#1B2240" />
      <rect x={1060} y={810} width={100} height={150} rx={4} fill="#202850" />
      <rect x={1170} y={810} width={100} height={150} rx={4} fill="#202850" />
      <rect x={1050} y={1340} width={230} height={160} fill="#1B2240" />
      <rect x={1040} y={1324} width={250} height={20} rx={4} fill="#2C3460" />
      <rect x={1080} y={1290} width={60} height={34} rx={6} fill="#384070" />
      <rect x={1180} y={1270} width={34} height={54} rx={5} fill="#3D4678" />
      <rect x={1060} y={1360} width={100} height={130} rx={4} fill="#202850" />
      <rect x={1170} y={1360} width={100} height={130} rx={4} fill="#202850" />
      {/* geladeira */}
      <Fridge open={fridgeOpen} />
      {/* luminária de chão roxa */}
      <ellipse cx={1010} cy={980} rx={300} ry={300} fill="url(#lampGlow)" opacity={light} />
      <rect x={1006} y={1000} width={8} height={500} fill="#2A2F4A" />
      <path d="M970,1000 L1050,1000 L1036,950 L984,950 Z" fill={C.purple} opacity={0.9} />
      {/* chão */}
      <rect x={-600} y={FLOOR_Y} width={2700} height={1200} fill="url(#floor)" />
      <rect x={-600} y={FLOOR_Y} width={2700} height={4} fill="#262C50" />
      <ellipse cx={720} cy={1590} rx={430} ry={70} fill="#1C1A44" opacity={0.85} />
      <ellipse cx={720} cy={1590} rx={430} ry={70} fill="none" stroke={C.purple} strokeWidth={3} opacity={0.25} />
    </g>
  );
};

const Fridge: React.FC<{open: number}> = ({open}) => {
  const x = 1300, y = 1000, w = 180, h = 500;
  const dw = w * (1 - open * 0.85);      // porta girando em direção à câmera
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill="#2E3558" />
      {open > 0.02 && (
        <g>
          <rect x={x + 8} y={y + 8} width={w - 16} height={h - 16} rx={6} fill="url(#fridgeIn)" opacity={0.9 * Math.min(1, open * 2)} />
          <rect x={x + 8} y={y + 180} width={w - 16} height={6} fill="#B8C4DC" />
          <rect x={x + 8} y={y + 320} width={w - 16} height={6} fill="#B8C4DC" />
          {/* quase vazia: uma garrafa e meio limão */}
          <rect x={x + 120} y={y + 250} width={22} height={70} rx={6} fill="#6FA1D8" opacity={0.85} />
          <rect x={x + 126} y={y + 238} width={10} height={14} fill="#4A6A9A" />
          <path d={`M${x + 40},${y + 320} a20,20 0 0 1 40,0 Z`} fill="#C8D86A" />
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={260} ry={340} fill="#FFF3C4" opacity={0.12 * open} />
        </g>
      )}
      {/* porta */}
      <g>
        <rect x={x + w - dw} y={y} width={dw} height={h} rx={10} fill="#3A4370" />
        <rect x={x + w - dw} y={y + 160} width={dw} height={4} fill="#2A3258" />
        <rect x={x + w - dw + 14} y={y + 60} width={6} height={80} rx={3} fill="#8F9AC8" />
        <rect x={x + w - dw + 14} y={y + 200} width={6} height={110} rx={3} fill="#8F9AC8" />
      </g>
    </g>
  );
};

/** sofá + mesa com contas (desenhados atrás das personagens; braço do sofá da frente em ApartmentFront) */
export const ApartmentMid: React.FC<{t: number; billsLifted?: boolean; phoneOnSofa?: number; phoneGlow?: string; phoneBuzz?: number}> = ({t, billsLifted = false, phoneOnSofa = 0, phoneGlow = C.blue, phoneBuzz = 0}) => (
  <g>
    {/* mesa com contas atrasadas */}
    <rect x={60} y={1350} width={280} height={18} rx={4} fill="#3A3256" />
    <rect x={80} y={1368} width={12} height={132} fill="#2A2442" />
    <rect x={308} y={1368} width={12} height={132} fill="#2A2442" />
    {[[90, 1338, -8], [140, 1336, 6], [200, 1340, -3], [250, 1337, 10], [120, 1330, 14]].map(([bx, by, r], i) =>
      billsLifted && i === 2 ? null : (
        <g key={i} transform={`translate(${bx},${by}) rotate(${r})`}>
          <rect x={-26} y={-6} width={52} height={12} rx={2} fill={C.white} opacity={0.92} />
          <rect x={6} y={-4} width={16} height={7} fill={C.red} opacity={0.9} />
        </g>
      ))}
    <rect x={262} y={1296} width={30} height={40} rx={5} fill="#4A4370" />
    {/* sofá simples */}
    <rect x={470} y={1200} width={500} height={190} rx={34} fill="#3B2F6A" />
    <rect x={480} y={1215} width={235} height={150} rx={26} fill="#45377A" />
    <rect x={725} y={1215} width={235} height={150} rx={26} fill="#45377A" />
    <rect x={460} y={1370} width={520} height={70} rx={20} fill="#4E3F88" />
    <rect x={470} y={1440} width={500} height={44} rx={10} fill="#2C2350" />
    <rect x={492} y={1484} width={16} height={16} fill="#1A1630" />
    <rect x={932} y={1484} width={16} height={16} fill="#1A1630" />
    <rect x={440} y={1300} width={56} height={160} rx={24} fill="#3B2F6A" />
    {phoneOnSofa > 0 && (
      <g transform={`translate(${870 + wobble(t * 50, 3) * 3 * phoneBuzz},${1366}) rotate(${-8 + wobble(t * 45, 1) * 4 * phoneBuzz})`} opacity={phoneOnSofa}>
        <ellipse cx={0} cy={4} rx={70} ry={26} fill={phoneGlow} opacity={0.18 + 0.2 * phoneBuzz} />
        <rect x={-36} y={-9} width={72} height={18} rx={5} fill="#1B2133" />
        <rect x={-32} y={-12} width={64} height={10} rx={3} fill={phoneGlow} opacity={0.9} />
      </g>
    )}
  </g>
);
export const ApartmentFront: React.FC = () => (
  <g>
    <rect x={944} y={1300} width={56} height={160} rx={24} fill="#352A60" />
  </g>
);

/** escurecimento da cena (luz da sala) + tom azul/roxo */
export const RoomLight: React.FC<{dark: number; tint?: string}> = ({dark, tint = '#05070F'}) => (
  <rect x={-1000} y={-1000} width={4000} height={5000} fill={tint} opacity={dark} />
);

/** QUARTO DO NOAH (visto pela videochamada) — cenário fixo do personagem */
export const NoahRoom: React.FC<{t: number}> = ({t}) => (
  <g>
    <rect x={-400} y={-400} width={1900} height={2900} fill="#1B1530" />
    <rect x={-400} y={700} width={1900} height={8} fill={C.blue} opacity={0.6} />
    <rect x={-400} y={708} width={1900} height={80} fill={C.blue} opacity={0.06} />
    {/* pôsteres e prateleira */}
    <rect x={110} y={860} width={190} height={260} rx={8} fill="#2A2150" />
    <path d="M140,1080 L205,920 L270,1080 Z" fill={C.magenta} opacity={0.55} />
    <rect x={740} y={880} width={230} height={150} rx={8} fill="#22284A" />
    <text x={855} y={970} textAnchor="middle" fill={C.blue} fontFamily={FONT.title} fontSize={40} opacity={0.75}>GG</text>
    <rect x={700} y={1150} width={320} height={14} rx={4} fill="#2C2650" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={720 + i * 26} y={1086} width={20} height={64} rx={3} fill={[C.purple, C.blue, C.moss, C.magenta, C.gold][i]} opacity={0.6} />)}
    <rect x={880} y={1100} width={70} height={50} rx={6} fill="#3A3366" />
    {/* luz quente de abajur */}
    <circle cx={120} cy={1350} r={320} fill="#FF9A5A" opacity={0.08 + 0.01 * Math.sin(t * 3)} />
    <rect x={-400} y={1500} width={1900} height={1000} fill="#120F22" />
  </g>
);

/** SALA DA MAYA DO FUTURO (2041) — escura, luz vermelha lateral, cidade futura ao fundo, ampulheta holográfica */
export const FutureRoom: React.FC<{t: number}> = ({t}) => {
  const cam = useCam();
  const px = (cam.x - 540) * 0.5;
  return (
    <g>
      <rect x={-600} y={-700} width={2400} height={3400} fill="#07080F" />
      <defs><clipPath id="glass2041"><rect x={60} y={420} width={960} height={1000} /></clipPath></defs>
      <g clipPath="url(#glass2041)">
        <g transform={`translate(${px},0)`}>
          <NightSky x={-300} y={300} w={1700} h={1200} hue="red" />
          <Skyline seed="sp-2041-far" x0={-300} x1={1400} base={1300} minH={300} maxH={760} col="#170A16" win={C.red} winP={0.1} t={t} antenna />
          <Skyline seed="sp-2041-mid" x0={-300} x1={1400} base={1420} minH={160} maxH={420} col="#0E0710" win={C.red} winP={0.16} t={t} neon />
        </g>
      </g>
      {/* vidro com montantes */}
      <rect x={60} y={420} width={960} height={1000} fill="none" stroke="#151826" strokeWidth={20} />
      {[300, 540, 780].map((x) => <rect key={x} x={x - 6} y={420} width={12} height={1000} fill="#151826" />)}
      {/* holograma de ampulheta */}
      <g opacity={0.35 + 0.1 * Math.sin(t * 5)}>
        <path d="M790,620 L890,620 L850,700 L850,710 L890,790 L790,790 L830,710 L830,700 Z" fill="none" stroke={C.red} strokeWidth={3} />
        <text x={840} y={830} textAnchor="middle" fill={C.red} fontFamily={FONT.mono} fontSize={22}>ANOS: 0,4</text>
      </g>
      <rect x={-600} y={1500} width={2400} height={1200} fill="#05060B" />
      <rect x={-600} y={1500} width={2400} height={3} fill={C.red} opacity={0.4} />
      <ellipse cx={180} cy={1100} rx={420} ry={700} fill={C.red} opacity={0.1} />
    </g>
  );
};
