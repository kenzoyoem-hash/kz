import React from 'react';
import {C, FONT} from '../theme';
import {lerp, rnd} from '../lib/anim';

/**
 * CORREDOR DO 7º ANDAR, PORTA DE EMERGÊNCIA e ESCADA B (cenários do prédio, EP. 2+).
 * Todos em coordenadas de mundo 1080 x 1920 (use com SvgCamera), exceto quando indicado.
 */

const EmergencyLight: React.FC<{x: number; y: number; t: number; color?: string}> = ({x, y, t, color = C.red}) => (
  <g>
    <circle cx={x} cy={y} r={160} fill={color} opacity={0.10 + 0.04 * Math.sin(t * 3)} />
    <rect x={x - 26} y={y - 10} width={52} height={20} rx={6} fill={color} opacity={0.9} />
  </g>
);

/** Corredor em perspectiva (fundo). Porta da Bia (702) à esquerda em primeiro plano. */
export const Hallway: React.FC<{t: number; light?: number; children?: React.ReactNode; doorOpen?: number}> = ({t, light = 1, children, doorOpen = 0}) => {
  const vx = 540, vy = 860;
  return (
    <g>
      <rect x={-400} y={-200} width={1880} height={2400} fill="#0b1020" />
      {/* teto, chão, paredes */}
      <path d={`M-400,-200 L${vx - 120},${vy - 160} L${vx + 120},${vy - 160} L1480,-200 Z`} fill="#0d1325" />
      <path d={`M-400,2200 L${vx - 120},${vy + 160} L${vx + 120},${vy + 160} L1480,2200 Z`} fill="#141a2e" />
      <path d={`M-400,-200 L${vx - 120},${vy - 160} L${vx - 120},${vy + 160} L-400,2200 Z`} fill="#18203a" />
      <path d={`M1480,-200 L${vx + 120},${vy - 160} L${vx + 120},${vy + 160} L1480,2200 Z`} fill="#151c33" />
      <rect x={vx - 120} y={vy - 160} width={240} height={320} fill="#070a14" />
      {/* placa SAÍDA no fundo */}
      <rect x={vx - 50} y={vy - 140} width={100} height={36} fill="#16a34a" opacity={0.9} />
      <text x={vx} y={vy - 114} fill="#eafff0" fontSize={24} textAnchor="middle" fontFamily={FONT.title}>SAÍDA</text>
      <circle cx={vx} cy={vy - 122} r={90} fill="#16a34a" opacity={0.08} />
      {/* portas laterais em perspectiva */}
      {[0.18, 0.45, 0.68].map((k, i) => {
        const x0 = lerp(-400, vx - 120, k), x1 = lerp(-400, vx - 120, k + 0.12);
        const top0 = lerp(-200, vy - 160, k) + lerp(300, 30, k), top1 = lerp(-200, vy - 160, k + 0.12) + lerp(300, 30, k + 0.12);
        const bot0 = lerp(2200, vy + 160, k), bot1 = lerp(2200, vy + 160, k + 0.12);
        const rx0 = 1080 - x0, rx1 = 1080 - x1;
        return (
          <g key={i}>
            <path d={`M${x0},${top0} L${x1},${top1} L${x1},${bot1} L${x0},${bot0} Z`} fill="#2b2a44" stroke="#3a3858" strokeWidth={4} />
            <path d={`M${rx0},${top0} L${rx1},${top1} L${rx1},${bot1} L${rx0},${bot0} Z`} fill="#26253d" stroke="#3a3858" strokeWidth={4} />
            <text x={lerp(x0, x1, 0.5)} y={lerp(top0, top1, 0.5) + 60 * (1 - k)} fill="#8a94a8" fontSize={40 * (1 - k)} textAnchor="middle" fontFamily={FONT.mono}>{70 + 3 + i * 2}</text>
          </g>
        );
      })}
      {/* lâmpadas apagadas + luz de emergência */}
      {[0.2, 0.5, 0.75].map((k) => <rect key={k} x={vx - lerp(120, 30, k)} y={lerp(-200, vy - 160, k) + 10} width={lerp(240, 60, k)} height={lerp(20, 6, k)} rx={6} fill="#2a3150" />)}
      <EmergencyLight x={180} y={260} t={t} />
      <EmergencyLight x={900} y={300} t={t + 1} />
      {children}
      <rect x={-500} y={-500} width={2200} height={3000} fill="#000" opacity={(1 - light) * 0.75} />
      {doorOpen > 0 && null}
    </g>
  );
};

/** Porta do apartamento vista do corredor (de frente). open 0..1: abre para dentro revelando a sala acesa. */
export const AptDoorFromHall: React.FC<{t: number; open: number; children?: React.ReactNode}> = ({t, open, children}) => (
  <g>
    <rect x={-400} y={-200} width={1880} height={2400} fill="#151c33" />
    <rect x={-400} y={1500} width={1880} height={700} fill="#10162a" />
    <EmergencyLight x={900} y={240} t={t} />
    {/* vão da porta: sala iluminada */}
    <rect x={300} y={560} width={480} height={940} fill="#0a0f1d" />
    <rect x={310} y={570} width={460} height={930} fill="#2a3b6a" />
    <path d="M310,1500 L770,1500 L900,1900 L180,1900 Z" fill="#9ab8ff" opacity={0.12 * open} />
    {children}
    {/* folha da porta abrindo (dobradiça à esquerda) */}
    <g transform={`translate(310,0) scale(${Math.max(0.05, 1 - open * 0.88)},1) translate(-310,0)`}>
      <rect x={310} y={570} width={460} height={930} fill="#2b2a44" stroke="#3a3858" strokeWidth={6} />
      <rect x={350} y={620} width={380} height={360} rx={6} fill="none" stroke="#3a3858" strokeWidth={6} />
      <rect x={350} y={1040} width={380} height={400} rx={6} fill="none" stroke="#3a3858" strokeWidth={6} />
      <rect x={690} y={1010} width={60} height={14} rx={7} fill="#c0c7d6" />
    </g>
    <rect x={290} y={550} width={500} height={20} fill="#0d1426" />
    <text x={540} y={520} fill="#c9cfdb" fontSize={46} textAnchor="middle" fontFamily={FONT.mono}>702</text>
  </g>
);

/** Porta corta-fogo da escada (de frente), com barra antipânico. open 0..1 */
export const StairDoor: React.FC<{t: number; open: number; children?: React.ReactNode}> = ({t, open, children}) => (
  <g>
    <rect x={-400} y={-200} width={1880} height={2400} fill="#141a2e" />
    <rect x={-400} y={1500} width={1880} height={700} fill="#0f1426" />
    <EmergencyLight x={540} y={300} t={t} />
    <rect x={290} y={430} width={500} height={80} rx={8} fill="#16a34a" />
    <text x={540} y={485} fill="#eafff0" fontSize={36} textAnchor="middle" fontFamily={FONT.title}>SAÍDA DE EMERGÊNCIA</text>
    <rect x={300} y={560} width={480} height={940} fill="#050709" />
    {/* escada escura atrás da porta */}
    <g opacity={open}>
      {Array.from({length: 7}).map((_, i) => <rect key={i} x={320} y={1500 - i * 70} width={440 - i * 30} height={70} fill={i % 2 ? '#1c2233' : '#222a3d'} />)}
    </g>
    <g transform={`translate(780,0) scale(${Math.max(0.05, 1 - open * 0.9)},1) translate(-780,0)`}>
      <rect x={300} y={560} width={480} height={940} fill="#7d2a2e" stroke="#4d1518" strokeWidth={8} />
      <rect x={330} y={1010} width={420} height={36} rx={18} fill="#c0c7d6" />
      <rect x={480} y={660} width={120} height={150} rx={8} fill="#e8e2d0" />
      <text x={540} y={760} fill="#4d1518" fontSize={90} textAnchor="middle" fontFamily={FONT.title}>7</text>
    </g>
    {children}
  </g>
);

/** ESCADA EM CORTE LATERAL. Cada andar tem 700 px. floorTop = número do andar no topo (y=0). */
export const STAIR = {
  H: 700,
  landingY: (k: number) => 300 + k * 700, // k = 0 é o andar do topo
  /** posição no lance A (desce para a esquerda): u 0..1 */
  flightA: (k: number, u: number) => ({x: lerp(760, 360, u), y: lerp(300 + k * 700, 650 + k * 700, u)}),
  /** lance B (desce para a direita) */
  flightB: (k: number, u: number) => ({x: lerp(300, 720, u), y: lerp(650 + k * 700, 1000 + k * 700, u)}),
};

export const StairSection: React.FC<{t: number; floorTop: number; floors?: number; light?: number; children?: React.ReactNode; front?: React.ReactNode}> = ({t, floorTop, floors = 4, light = 1, children, front}) => {
  const steps = 10;
  return (
    <g>
      <rect x={-600} y={-800} width={2400} height={floors * 700 + 1800} fill="#151b2b" />
      {Array.from({length: floors}).map((_, k) => {
        const y0 = STAIR.landingY(k);
        const fl = floorTop - k;
        return (
          <g key={k}>
            {/* parede com número do andar */}
            <text x={930} y={y0 - 120} fill="#e9eef8" opacity={0.16} fontSize={240} textAnchor="middle" fontFamily={FONT.title}>{fl}</text>
            <rect x={840} y={y0 - 330} width={110} height={44} rx={4} fill="#16a34a" opacity={0.75} />
            <text x={895} y={y0 - 298} fill="#eafff0" fontSize={24} textAnchor="middle" fontFamily={FONT.title}>{fl}º ANDAR</text>
            {/* lance B (atrás, mais escuro) */}
            {Array.from({length: steps}).map((_, i) => {
              const a = STAIR.flightB(k, i / steps), b = STAIR.flightB(k, (i + 1) / steps);
              return <rect key={`b${i}`} x={a.x} y={a.y} width={b.x - a.x + 2} height={1200 - (a.y - y0)} fill={i % 2 ? '#1a2031' : '#1d2436'} />;
            })}
            {/* patamares */}
            <rect x={700} y={y0} width={500} height={40} fill="#2c3550" />
            <rect x={-200} y={y0 + 350} width={560} height={40} fill="#2c3550" />
            {/* lance A (frente) */}
            {Array.from({length: steps}).map((_, i) => {
              const a = STAIR.flightA(k, i / steps), b = STAIR.flightA(k, (i + 1) / steps);
              return (
                <g key={`a${i}`}>
                  <rect x={b.x} y={a.y} width={a.x - b.x + 1} height={b.y - a.y + 4} fill={i % 2 ? '#323b55' : '#2b334b'} />
                  <line x1={b.x} y1={a.y} x2={a.x} y2={a.y} stroke="#4b5672" strokeWidth={4} />
                </g>
              );
            })}
            <path d={`M760,${y0 + 40} L360,${y0 + 390} L360,${y0 + 470} L760,${y0 + 120} Z`} fill="#222a3f" />
            <EmergencyLight x={1000} y={y0 - 420} t={t + k} />
          </g>
        );
      })}
      {children}
      {/* corrimão do lance A (na frente dos personagens) */}
      {Array.from({length: floors}).map((_, k) => {
        const y0 = STAIR.landingY(k);
        return (
          <g key={`r${k}`}>
            <path d={`M800,${y0 - 150} L380,${y0 + 200}`} stroke="#c9a227" strokeWidth={12} strokeLinecap="round" />
            {[0, 0.25, 0.5, 0.75, 1].map((u) => <line key={u} x1={lerp(800, 380, u)} y1={lerp(y0 - 150, y0 + 200, u)} x2={lerp(800, 380, u)} y2={lerp(y0, y0 + 350, u) + 4} stroke="#8a7420" strokeWidth={6} />)}
          </g>
        );
      })}
      {front}
      <rect x={-600} y={-800} width={2400} height={floors * 700 + 1800} fill="#000" opacity={(1 - light) * 0.7} />
    </g>
  );
};

/** VISTA DE CIMA pelo vão entre os corrimãos (POV da Bia). viewBox 0 0 1080 1920. person = desenho no fundo. */
export const StairGap: React.FC<{t: number; depth?: number; bottom?: React.ReactNode}> = ({t, depth = 7, bottom}) => {
  const cx = 540, cy = 1000;
  return (
    <g>
      <rect x={-400} y={-400} width={1880} height={2720} fill="#0a0d16" />
      {Array.from({length: depth}).map((_, k) => {
        const s = Math.pow(0.7, k);
        const w = 1500 * s, h = 2000 * s;
        const dark = Math.min(0.9, k * 0.13);
        return (
          <g key={k}>
            {/* degraus (anel) */}
            <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill={`rgba(${50 - k * 5},${58 - k * 6},${82 - k * 8},1)`} />
            {Array.from({length: 8}).map((_, i) => <line key={i} x1={cx - w / 2 + (i / 8) * w * 0.35} y1={cy - h / 2} x2={cx - w / 2 + (i / 8) * w * 0.35} y2={cy + h / 2} stroke="#000" opacity={0.25} strokeWidth={3 * s + 1} />)}
            <rect x={cx - w * 0.33} y={cy - h * 0.36} width={w * 0.66} height={h * 0.72} fill="#06080f" />
            {/* corrimão amarelo */}
            <rect x={cx - w * 0.33} y={cy - h * 0.36} width={w * 0.66} height={h * 0.72} fill="none" stroke="#c9a227" strokeWidth={14 * s + 2} opacity={1 - dark * 0.6} />
            <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} fill="#000" opacity={dark} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={60} fill="#fff6d6" opacity={0.06 + 0.02 * Math.sin(t * 4)} />
      {bottom}
      {/* poeira no ar */}
      {Array.from({length: 18}).map((_, i) => {
        const r = rnd(`dust${i}`);
        return <circle key={i} cx={(r * 1080 + t * 12 * (i % 3)) % 1080} cy={(rnd(`dy${i}`) * 1920 + t * 20) % 1920} r={2 + r * 3} fill="#fff" opacity={0.12} />;
      })}
    </g>
  );
};

/** PATAMAR (fundo para closes de frente): parede com número, lance subindo ao fundo, corrimão. */
export const Landing: React.FC<{t: number; floor: number; light?: number; children?: React.ReactNode; behind?: React.ReactNode}> = ({t, floor, light = 1, children, behind}) => (
  <g>
    <rect x={-600} y={-400} width={2400} height={2800} fill="#161c2c" />
    <text x={240} y={760} fill="#e9eef8" opacity={0.14} fontSize={420} textAnchor="middle" fontFamily={FONT.title}>{floor}</text>
    {/* lance subindo atrás, na escuridão */}
    {Array.from({length: 9}).map((_, i) => <rect key={i} x={560 + i * 52} y={1340 - i * 70} width={900} height={70} fill={i % 2 ? '#1b2132' : '#1f2638'} />)}
    <path d="M560,1210 L1100,580" stroke="#8a7420" strokeWidth={10} opacity={0.7} />
    <rect x={-600} y={1340} width={2400} height={1200} fill="#20283d" />
    <EmergencyLight x={160} y={260} t={t} />
    {behind}
    {children}
    <rect x={-600} y={-400} width={2400} height={2800} fill="#000" opacity={(1 - light) * 0.7} />
  </g>
);

/** SILHUETA (presença atrás da Bia). Nunca mostrar rosto. */
export const Shadow: React.FC<{x: number; y: number; scale?: number; opacity?: number; t: number}> = ({x, y, scale = 1, opacity = 1, t}) => (
  <g transform={`translate(${x},${y + Math.sin(t * 1.3) * 3}) scale(${scale})`} opacity={opacity}>
    <path d="M-70,0 L-80,-380 Q-120,-420 -120,-520 L-110,-640 Q-60,-700 0,-700 Q60,-700 110,-640 L120,-520 Q120,-420 80,-380 L70,0 Z" fill="#020306" />
    <ellipse cx={0} cy={-800} rx={86} ry={100} fill="#020306" />
    <path d="M-86,-800 Q-86,-900 0,-905 Q86,-900 86,-800" fill="none" stroke="#3a1015" strokeWidth={3} opacity={0.6} />
  </g>
);
