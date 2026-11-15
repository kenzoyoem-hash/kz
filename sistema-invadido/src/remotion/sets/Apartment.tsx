import React from 'react';
import {C} from '../theme';
import {rnd} from '../lib/anim';

/**
 * APARTAMENTO DA BIA (7º andar) — cenário fixo da série. Coordenadas de mundo 1800 x 1920.
 * Pontos úteis: TV (990, 855) | porta (1580, 930) | maçaneta (1478, 950) | janela (340, 690)
 * detector de fumaça (300, 172) | chão onde Bia fica (900, 1640)
 */
export const APT = {
  W: 1800, H: 1920,
  tv: {x: 760, y: 720, w: 460, h: 270},
  door: {x: 1440, y: 560, w: 280, h: 740},
  handle: {x: 1478, y: 950},
  lock: {x: 1500, y: 860},
  smoke: {x: 300, y: 172},
  vent: {x: 1500, y: 196},
  biaSpot: {x: 900, y: 1640},
};

type Props = {
  t: number;
  light?: number; // 0..1 luz ambiente
  tvOn?: number; // 0..1 brilho da TV
  tvColor?: string; // cor do brilho da TV no ambiente
  tvContent?: React.ReactNode; // conteúdo desenhado em viewBox 0 0 428 238
  locked?: boolean;
  lockBlink?: boolean;
  doorShake?: number;
  underDoorShadow?: number; // 0..1 sombra de pés na fresta da porta (-1 = sem luz)
  corridorLight?: number;
  children?: React.ReactNode; // personagens (entre móveis e escuridão)
  foreground?: React.ReactNode;
};

const City: React.FC<{t: number}> = ({t}) => {
  const b = [] as React.ReactNode[];
  let x = 120;
  let i = 0;
  while (x < 560) {
    const w = 40 + rnd(`bw${i}`) * 60;
    const h = 120 + rnd(`bh${i}`) * 330;
    const top = 1000 - h;
    b.push(<rect key={`b${i}`} x={x} y={top} width={w} height={h} fill={i % 2 ? '#0d1730' : '#111d3a'} />);
    for (let wy = top + 14; wy < 990; wy += 26) {
      for (let wx = x + 8; wx < x + w - 10; wx += 16) {
        const r = rnd(`w${i}-${wx}-${wy}`);
        if (r > 0.72) {
          const flick = r > 0.985 ? (Math.sin(t * 9 + r * 50) > 0 ? 1 : 0.2) : 1;
          b.push(<rect key={`w${i}-${wx}-${wy}`} x={wx} y={wy} width={7} height={10} fill={r > 0.93 ? '#ffd79a' : '#8fb7ff'} opacity={0.55 * flick} />);
        }
      }
    }
    x += w + 4; i++;
  }
  return <g>{b}</g>;
};

export const Apartment: React.FC<Props> = ({
  t, light = 1, tvOn = 0, tvColor = C.cyan, tvContent, locked = false, lockBlink = false,
  doorShake = 0, underDoorShadow = -1, corridorLight = 0, children, foreground,
}) => {
  const {tv, door} = APT;
  const ds = doorShake ? Math.sin(t * 60) * 3 * doorShake : 0;
  const ledOn = !lockBlink || Math.sin(t * 12) > 0;
  return (
    <g>
      <defs>
        <linearGradient id="aptSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#050a18" />
          <stop offset="1" stopColor="#1a2850" />
        </linearGradient>
        <linearGradient id="aptWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#121a30" />
          <stop offset="1" stopColor={C.wall} />
        </linearGradient>
        <linearGradient id="aptFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141c33" />
          <stop offset="1" stopColor="#090e1c" />
        </linearGradient>
        <radialGradient id="aptMoon" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#dfe8ff" stopOpacity={0.35} />
          <stop offset="1" stopColor="#dfe8ff" stopOpacity={0} />
        </radialGradient>
        <radialGradient id="aptTvGlow" cx="0.5" cy="0.4" r="0.5">
          <stop offset="0" stopColor={tvColor} stopOpacity={0.45} />
          <stop offset="1" stopColor={tvColor} stopOpacity={0} />
        </radialGradient>
        <linearGradient id="aptGap" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffe6b0" stopOpacity={0.9} />
          <stop offset="1" stopColor="#ffe6b0" stopOpacity={0} />
        </linearGradient>
      </defs>
      {/* teto e paredes */}
      <rect x={0} y={0} width={1800} height={160} fill="#0b1122" />
      <rect x={0} y={150} width={1800} height={1160} fill="url(#aptWall)" />
      <rect x={0} y={148} width={1800} height={8} fill="#0a0f1e" />
      {/* detector de fumaça com LED */}
      <ellipse cx={APT.smoke.x} cy={APT.smoke.y} rx={34} ry={12} fill="#c9cfdb" />
      <circle cx={APT.smoke.x + 16} cy={APT.smoke.y + 2} r={4} fill={Math.sin(t * 3) > 0.6 ? C.red : '#4a1a20'} />
      {/* grade de ventilação */}
      <rect x={APT.vent.x - 50} y={APT.vent.y - 18} width={100} height={36} rx={4} fill="#0e1528" stroke="#2a3552" strokeWidth={3} />
      {[0, 1, 2, 3].map((k) => <line key={k} x1={APT.vent.x - 40} x2={APT.vent.x + 40} y1={APT.vent.y - 10 + k * 7} y2={APT.vent.y - 10 + k * 7} stroke="#2a3552" strokeWidth={3} />)}
      {/* janela */}
      <rect x={110} y={370} width={460} height={640} rx={8} fill="#0a0f1d" />
      <rect x={124} y={384} width={432} height={612} fill="url(#aptSky)" />
      <circle cx={460} cy={480} r={110} fill="url(#aptMoon)" />
      <circle cx={460} cy={480} r={34} fill="#e8eeff" opacity={0.85} />
      <City t={t} />
      <rect x={334} y={384} width={12} height={612} fill="#0a0f1d" />
      <rect x={124} y={680} width={432} height={12} fill="#0a0f1d" />
      {/* cortinas */}
      <path d="M70,350 L170,350 Q150,700 180,1060 L60,1060 Z" fill="#1c2a52" />
      <path d="M610,350 L510,350 Q530,700 500,1060 L620,1060 Z" fill="#1c2a52" />
      <rect x={50} y={340} width={580} height={14} rx={7} fill="#2a3552" />
      {/* luz da lua no chão */}
      <path d="M124,1310 L556,1310 L700,1920 L-40,1920 Z" fill="#9ab8ff" opacity={0.05} />
      {/* rodapé e chão */}
      <rect x={0} y={1300} width={1800} height={620} fill="url(#aptFloor)" />
      <rect x={0} y={1296} width={1800} height={10} fill="#0a0f1e" />
      {[-6, -4, -2, 0, 2, 4, 6, 8, 10].map((k) => (
        <line key={k} x1={900 + k * 110} y1={1306} x2={900 + k * 330} y2={1920} stroke={C.floorLine} strokeWidth={3} />
      ))}
      {/* sofá sob a janela */}
      <rect x={80} y={1080} width={560} height={110} rx={30} fill="#26345e" />
      <rect x={60} y={1150} width={600} height={150} rx={26} fill="#2c3c6b" />
      <rect x={40} y={1100} width={70} height={210} rx={26} fill="#24325a" />
      <rect x={610} y={1100} width={70} height={210} rx={26} fill="#24325a" />
      <rect x={130} y={1130} width={150} height={60} rx={20} fill="#33457a" />
      <rect x={460} y={1130} width={150} height={60} rx={20} fill="#33457a" />
      {/* rack + TV */}
      <rect x={700} y={1170} width={580} height={130} rx={8} fill={C.wood} />
      <rect x={720} y={1190} width={260} height={90} rx={4} fill="#221d36" />
      <rect x={1000} y={1190} width={260} height={90} rx={4} fill="#221d36" />
      <rect x={960} y={990} width={60} height={180} fill="#0b0d14" />
      <rect x={880} y={1150} width={220} height={22} rx={6} fill="#0b0d14" />
      <rect x={tv.x} y={tv.y} width={tv.w} height={tv.h} rx={12} fill="#05060a" stroke="#1b2030" strokeWidth={6} />
      <svg x={tv.x + 16} y={tv.y + 16} width={tv.w - 32} height={tv.h - 32} viewBox="0 0 428 238" preserveAspectRatio="none">
        <rect width={428} height={238} fill="#020306" />
        {tvOn > 0 && <g opacity={tvOn}>{tvContent}</g>}
      </svg>
      {/* porta de entrada com fechadura eletrônica */}
      <g transform={`translate(${ds},0)`}>
        <rect x={door.x - 20} y={door.y - 20} width={door.w + 40} height={door.h + 20} fill="#0d1426" />
        <rect x={door.x} y={door.y} width={door.w} height={door.h} fill="#2b2a44" />
        <rect x={door.x + 30} y={door.y + 40} width={door.w - 60} height={290} rx={6} fill="none" stroke="#3a3858" strokeWidth={6} />
        <rect x={door.x + 30} y={door.y + 380} width={door.w - 60} height={310} rx={6} fill="none" stroke="#3a3858" strokeWidth={6} />
        <rect x={APT.lock.x - 26} y={APT.lock.y - 50} width={52} height={100} rx={8} fill="#11131c" stroke="#3a3f55" strokeWidth={3} />
        <circle cx={APT.lock.x} cy={APT.lock.y - 22} r={9} fill={locked ? (ledOn ? C.red : '#3a0d12') : C.green} />
        {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={APT.lock.x - 16 + c * 18} y={APT.lock.y - 4 + r * 14} width={14} height={9} rx={2} fill="#2a2f42" />))}
        <rect x={APT.handle.x - 14} y={APT.handle.y - 14} width={28} height={28} rx={14} fill="#9aa3b5" />
        <rect x={APT.handle.x - 6} y={APT.handle.y - 8} width={70} height={16} rx={8} fill="#c0c7d6" />
      </g>
      {/* fresta de luz sob a porta (corredor) */}
      {corridorLight > 0 && (
        <g>
          <rect x={door.x} y={1290} width={door.w} height={10} fill="#ffe6b0" opacity={corridorLight} />
          <path d={`M${door.x},1300 L${door.x + door.w},1300 L${door.x + door.w + 120},1420 L${door.x - 120},1420 Z`} fill="url(#aptGap)" opacity={corridorLight * 0.35} />
          {underDoorShadow >= 0 && (
            <g opacity={corridorLight}>
              <rect x={door.x + 40 + underDoorShadow * 120} y={1290} width={44} height={10} fill="#05060a" />
              <rect x={door.x + 110 + underDoorShadow * 120} y={1290} width={44} height={10} fill="#05060a" />
            </g>
          )}
        </g>
      )}
      {/* mesinha em primeiro plano */}
      <ellipse cx={230} cy={1560} rx={170} ry={36} fill="#2a2440" />
      <rect x={220} y={1575} width={20} height={190} fill="#201b33" />
      <ellipse cx={230} cy={1768} rx={80} ry={14} fill="#000" opacity={0.3} />
      <rect x={180} y={1510} width={46} height={52} rx={8} fill="#c94a52" />
      <path d="M226,1522 Q250,1532 226,1548" stroke="#c94a52" strokeWidth={8} fill="none" />
      {/* escuridão (luz ambiente) sobre o cenário */}
      <rect x={-500} y={-500} width={2800} height={2920} fill="#02040a" opacity={(1 - light) * 0.82} />
      {/* elementos emissivos (não escurecem) */}
      {light < 1 && tvOn > 0 && (
        <svg x={tv.x + 16} y={tv.y + 16} width={tv.w - 32} height={tv.h - 32} viewBox="0 0 428 238" preserveAspectRatio="none" opacity={1 - light}>
          <rect width={428} height={238} fill="#020306" />
          <g opacity={tvOn}>{tvContent}</g>
        </svg>
      )}
      {light < 1 && <circle cx={APT.lock.x + ds} cy={APT.lock.y - 22} r={9} fill={locked ? (ledOn ? C.red : '#3a0d12') : C.green} />}
      {locked && ledOn && <circle cx={APT.lock.x + ds} cy={APT.lock.y - 22} r={40} fill={C.red} opacity={0.18} />}
      {/* brilho da TV no ambiente */}
      {tvOn > 0 && <ellipse cx={tv.x + tv.w / 2} cy={tv.y + tv.h / 2 + 300} rx={900} ry={800} fill="url(#aptTvGlow)" opacity={tvOn} />}
      {/* personagens: escurecidos por filtro (ficam na frente da TV/LED) */}
      <g style={{filter: `brightness(${(0.18 + 0.82 * light).toFixed(3)})`}}>{children}</g>
      {foreground}
    </g>
  );
};
