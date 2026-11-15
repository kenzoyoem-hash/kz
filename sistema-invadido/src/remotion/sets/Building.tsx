import React from 'react';
import {C} from '../theme';
import {Resident, LOOKS, ResidentLook} from '../characters/Resident';
import {lerp, clamp} from '../lib/anim';

/** Cenários do prédio vistos pelas câmeras de segurança. Todos em viewBox 0 0 600 800. */
const VB = '0 0 600 800';
type SvgProps = {children: React.ReactNode};
const Feed: React.FC<SvgProps> = ({children}) => (
  <svg viewBox={VB} width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0}}>
    {children}
  </svg>
);

/** CORREDOR em perspectiva com portas numeradas */
export const Corridor: React.FC<{t: number; floor: number; who?: {look: ResidentLook; action: 'bang' | 'run' | 'walk' | 'push'; x: number; y: number; s: number; dir?: 1 | -1; vx?: number}[]}> = ({t, floor, who = []}) => (
  <Feed>
    <rect width={600} height={800} fill="#1a2238" />
    <path d="M0,800 L230,420 L370,420 L600,800 Z" fill="#232c45" />
    <path d="M0,0 L230,300 L370,300 L600,0 Z" fill="#111827" />
    <rect x={230} y={300} width={140} height={120} fill="#0c1220" />
    {[0, 1, 2].map((k) => {
      const p = k / 3, q = (k + 0.6) / 3;
      const lx = (pp: number) => lerp(0, 230, pp);
      return (
        <g key={k}>
          <path d={`M${lx(p) + 10},${lerp(80, 320, p)} L${lx(q)},${lerp(110, 330, q)} L${lx(q)},${lerp(740, 412, q)} L${lx(p) + 10},${lerp(760, 405, p)} Z`} fill="#3a3550" stroke="#4a4566" strokeWidth={3} />
          <path d={`M${600 - lx(p) - 10},${lerp(80, 320, p)} L${600 - lx(q)},${lerp(110, 330, q)} L${600 - lx(q)},${lerp(740, 412, q)} L${600 - lx(p) - 10},${lerp(760, 405, p)} Z`} fill="#3a3550" stroke="#4a4566" strokeWidth={3} />
          <text x={lx(p) + 30} y={lerp(170, 340, p)} fill="#8a94a8" fontSize={22 - k * 5} fontFamily="monospace">{floor}0{k + 1}</text>
        </g>
      );
    })}
    {[0, 1, 2].map((k) => <rect key={k} x={300 - 50 + k * 15} y={lerp(30, 280, k / 3)} width={100 - k * 30} height={10} rx={5} fill="#e9f0ff" opacity={0.8} />)}
    <rect x={262} y={330} width={76} height={40} fill="#16a34a" opacity={0.8} />
    <text x={300} y={358} fill="#eafff0" fontSize={20} textAnchor="middle" fontFamily="sans-serif" fontWeight={800}>SAÍDA</text>
    {who.map((w, i) => (
      <Resident key={i} t={t} look={w.look} action={w.action} x={w.x + (w.vx ?? 0) * t} y={w.y} scale={w.s} dir={w.dir ?? 1} />
    ))}
  </Feed>
);

/** ESCADA DE EMERGÊNCIA (câmera alta no canto). people: moradores descendo, com fase própria. */
export const Stairwell: React.FC<{t: number; people?: {look: ResidentLook; phase: number; speed?: number}[]; loop?: number; tint?: string; floorSign?: string}> = ({t, people = [], loop, floorSign = '7'}) => {
  const steps = 11;
  const pos = (u: number) => ({x: lerp(560, 30, u), y: lerp(250, 760, u), s: lerp(0.55, 0.95, u)});
  return (
    <Feed>
      <rect width={600} height={800} fill="#1d2433" />
      <rect x={0} y={0} width={600} height={170} fill="#161c29" />
      {/* parede com número do andar */}
      <text x={110} y={150} fill="#e9eef8" opacity={0.75} fontSize={110} fontFamily="sans-serif" fontWeight={900}>{floorSign}</text>
      <rect x={420} y={40} width={120} height={46} rx={4} fill="#16a34a" opacity={0.85} />
      <text x={480} y={72} fill="#eafff0" fontSize={24} textAnchor="middle" fontFamily="sans-serif" fontWeight={800}>SAÍDA ↓</text>
      {/* degraus */}
      {Array.from({length: steps}).map((_, k) => {
        const u0 = k / steps, u1 = (k + 1) / steps;
        const a = pos(u0), b = pos(u1);
        return (
          <g key={k}>
            <path d={`M${a.x + 120},${a.y + 10} L${a.x - 220},${a.y + 10} L${b.x - 220},${b.y + 10} L${b.x + 120},${b.y + 10} Z`} fill={k % 2 ? '#323b50' : '#2b3346'} />
            <line x1={b.x - 220} y1={b.y + 10} x2={b.x + 120} y2={b.y + 10} stroke="#4b5672" strokeWidth={4} />
          </g>
        );
      })}
      {/* corrimão */}
      <path d={`M600,200 L0,700`} stroke="#c9a227" strokeWidth={10} />
      {[0.1, 0.3, 0.5, 0.7, 0.9].map((u) => <line key={u} x1={lerp(600, 0, u)} y1={lerp(200, 700, u)} x2={lerp(600, 0, u)} y2={lerp(200, 700, u) + 90} stroke="#8a7420" strokeWidth={6} />)}
      {people.map((p, i) => {
        const T = loop ? ((t + p.phase) % loop) / loop : clamp(((t + p.phase) * (p.speed ?? 0.3)) % 1.2);
        if (T > 1) return null;
        const q = pos(T);
        return <Resident key={i} t={loop ? (t + p.phase) % loop : t + p.phase} look={p.look} action="walk" dir={-1} x={q.x} y={q.y + 20} scale={q.s} />;
      })}
      {/* luz de emergência */}
      <circle cx={560} cy={20} r={60} fill="#fff6d6" opacity={0.08} />
    </Feed>
  );
};

/** ELEVADOR DE SERVIÇO no 7º andar */
export const Elevator: React.FC<{t: number; open: number; floor: number; arrow?: boolean; backpackShake?: number; ringGlow?: number; inside?: string}> = ({t, open, floor, arrow = false, backpackShake = 0, ringGlow = 0, inside = '#c9d4e8'}) => {
  const shakeX = backpackShake ? Math.sin(t * 70) * 4 * backpackShake : 0;
  const dw = 150 * (1 - open);
  return (
    <Feed>
      <rect width={600} height={800} fill="#20263a" />
      <rect x={0} y={640} width={600} height={160} fill="#2a3048" />
      {/* cabine */}
      <rect x={150} y={180} width={300} height={470} fill={inside} />
      <path d="M150,650 L450,650 L420,560 L180,560 Z" fill="#9aa6bd" opacity={0.5} />
      <rect x={180} y={200} width={240} height={14} rx={7} fill="#fff" opacity={0.9} />
      <rect x={160} y={260} width={20} height={300} fill="#aab4c9" />
      <rect x={420} y={260} width={20} height={300} fill="#aab4c9" />
      {/* mochila vermelha */}
      <g transform={`translate(${300 + shakeX}, 600)`}>
        {ringGlow > 0 && <circle cx={0} cy={-40} r={90} fill={C.red} opacity={0.25 * ringGlow} />}
        <ellipse cx={0} cy={10} rx={66} ry={12} fill="#000" opacity={0.3} />
        <path d="M-50,8 Q-58,-70 -30,-92 Q0,-108 30,-92 Q58,-70 50,8 Z" fill="#d31f2f" />
        <path d="M-30,-92 Q0,-130 30,-92" stroke="#8f1420" strokeWidth={10} fill="none" />
        <rect x={-34} y={-40} width={68} height={40} rx={10} fill="#b51826" />
        <line x1={-30} y1={-30} x2={30} y2={-30} stroke="#ffd2d6" strokeWidth={3} />
        {ringGlow > 0 && <rect x={-14} y={-26} width={28} height={18} rx={3} fill="#ffe0e3" opacity={ringGlow * (Math.sin(t * 20) > 0 ? 1 : 0.4)} />}
      </g>
      {/* portas */}
      <rect x={150} y={180} width={dw} height={470} fill="#8d96aa" stroke="#6b7488" strokeWidth={3} />
      <rect x={450 - dw} y={180} width={dw} height={470} fill="#8d96aa" stroke="#6b7488" strokeWidth={3} />
      {/* moldura */}
      <path d="M120,660 L120,150 L480,150 L480,660" stroke="#596278" strokeWidth={30} fill="none" />
      <rect x={250} y={70} width={100} height={60} rx={8} fill="#0a0c12" />
      <text x={300} y={118} fill={C.red} fontSize={48} textAnchor="middle" fontFamily="monospace" fontWeight={800}>{floor}</text>
      {arrow && <text x={372} y={116} fill={C.red} fontSize={34} fontFamily="monospace">▲</text>}
      <rect x={500} y={360} width={40} height={80} rx={8} fill="#11131c" />
      <circle cx={520} cy={385} r={9} fill="#3a3f55" /><circle cx={520} cy={415} r={9} fill="#3a3f55" />
    </Feed>
  );
};

/** SAÍDA / GARAGEM: porta de saída trancada */
export const ExitHall: React.FC<{t: number}> = ({t}) => (
  <Feed>
    <rect width={600} height={800} fill="#191f30" />
    <rect x={0} y={600} width={600} height={200} fill="#232a40" />
    <rect x={170} y={190} width={260} height={420} fill="#3c4560" stroke="#59627e" strokeWidth={8} />
    <rect x={190} y={380} width={220} height={18} rx={9} fill="#9aa3b5" />
    <rect x={240} y={110} width={120} height={50} rx={4} fill="#16a34a" />
    <text x={300} y={145} fill="#eafff0" fontSize={26} textAnchor="middle" fontFamily="sans-serif" fontWeight={800}>SAÍDA</text>
    <circle cx={445} cy={360} r={10} fill={C.red} opacity={Math.sin(t * 10) > 0 ? 1 : 0.3} />
    <Resident t={t} look={LOOKS.moca} action="push" x={250} y={690} scale={0.95} />
    <Resident t={t + 0.4} look={LOOKS.senhor} action="bang" x={420} y={710} scale={0.95} dir={-1} />
  </Feed>
);

export {LOOKS};
