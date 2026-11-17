import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage} from '../components/Camera';
import {Dust, Vignette} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {POSES} from '../characters/poses';
import {P} from '../characters/Rig';
import {wordAt} from '../data/dialogue';
import {C, FONT} from '../styles/theme';
import {bump, ease, prog, tw} from '../lib/anim';

/** CENA 11 — VOTAÇÃO (01:17–01:29): O QUE MAYA DEVE FAZER? A ou B — legível até o último quadro. */
const Option: React.FC<{y: number; letter: string; l1: string; l2: string; col: string; k: number; hi: number; t: number; icon: 'search' | 'cancel'}> = ({y, letter, l1, l2, col, k, hi, t, icon}) => (
  <g opacity={k} transform={`translate(${(1 - k) * (letter === 'A' ? -700 : 700)},0)`}>
    <g transform={`translate(540,${y}) scale(${1 + hi * 0.05}) translate(-540,${-y})`}>
      <rect x={70} y={y - 120} width={940} height={240} rx={40} fill="#141B36" />
      <rect x={70} y={y - 120} width={940} height={240} rx={40} fill={col} opacity={0.12 + hi * 0.2} />
      <rect x={70} y={y - 120} width={940} height={240} rx={40} fill="none" stroke={col} strokeWidth={5} opacity={0.6 + 0.4 * Math.sin(t * 4 + (letter === 'A' ? 0 : 2))} />
      <circle cx={190} cy={y} r={78} fill={col} />
      <text x={190} y={y + 34} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={96}>{letter}</text>
      <text x={300} y={y - 12} fill={C.white} fontFamily={FONT.title} fontSize={50}>{l1}</text>
      <text x={300} y={y + 52} fill={C.white} fontFamily={FONT.title} fontSize={50}>{l2}</text>
      {icon === 'search' ? (
        <g transform={`translate(940,${y - 60})`} opacity={0.8}>
          <circle cx={0} cy={0} r={20} fill="none" stroke={col} strokeWidth={6} />
          <path d="M14,14 L30,30" stroke={col} strokeWidth={8} strokeLinecap="round" />
        </g>
      ) : (
        <g transform={`translate(950,${y - 50})`} opacity={0.8}>
          <path d="M-22,-22 L22,22 M22,-22 L-22,22" stroke={col} strokeWidth={8} strokeLinecap="round" />
        </g>
      )}
    </g>
  </g>
);

export const Scene11: React.FC<{t: number}> = ({t}) => {
  const q = prog(t, 77.2, 77.7, ease.back);
  const a = prog(t, 77.7, 78.2, ease.out), b = prog(t, 78.0, 78.5, ease.out);
  const tA = wordAt('l18', 'A'), tB = wordAt('l18', 'B');
  const hiA = bump(t, tA + 0.15, 0.4), hiB = bump(t, tB + 0.15, 0.4);
  const sub = prog(t, 79.2, 79.7);
  return (
    <AbsoluteFill>
      <Stage cam={{x: 540, y: 960, z: tw(t, 77, 89, 1.02, 1.0)}} bg={C.ink}>
        <defs>
          <radialGradient id="voteBg" cx="0.5" cy="0.4" r="0.7">
            <stop offset="0" stopColor="#2A1660" /><stop offset="0.55" stopColor={C.navy} /><stop offset="1" stopColor={C.ink} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#voteBg)" />
        <Dust t={t} n={70} seed="vote" col={C.purple} speed={35} size={5} opacity={0.7} />
        <Dust t={t} n={30} seed="vote2" col={C.magenta} speed={20} size={3} opacity={0.5} />
        {/* grade digital */}
        {Array.from({length: 12}).map((_, i) => <rect key={i} x={0} y={i * 170 + ((t * 30) % 170)} width={1080} height={1} fill={C.purple} opacity={0.12} />)}
        <text x={540} y={170} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={44} letterSpacing={8} opacity={0.85}>SALDO FINAL</text>
        <text x={540} y={212} textAnchor="middle" fill={C.purple} fontFamily={FONT.semi} fontSize={24} letterSpacing={6} opacity={0.85}>EP. 01 · CINCO ANOS POR R$ 80 MIL</text>
        <g opacity={q} transform={`translate(540,400) scale(${0.8 + 0.2 * q}) translate(-540,-400)`}>
          <text x={540} y={380} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={92}>O QUE MAYA</text>
          <text x={540} y={480} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={92}>DEVE FAZER?</text>
        </g>
        <Option y={700} letter="A" l1="INVESTIGAR A" l2="MAYA DO FUTURO" col={C.purple} k={a} hi={hiA} t={t} icon="search" />
        <Option y={990} letter="B" l1="TENTAR CANCELAR" l2="A VENDA" col={C.magenta} k={b} hi={hiB} t={t} icon="cancel" />
        <g opacity={sub}>
          <rect x={250} y={1150} width={580} height={70} rx={35} fill={C.purple} opacity={0.25} />
          <text x={540} y={1197} textAnchor="middle" fill={C.white} fontFamily={FONT.bold} fontSize={32} letterSpacing={3}>COMENTE A OU B</text>
        </g>
        {/* Maya olhando as duas escolhas */}
        <Maya t={t} pose={P({...POSES.standPhone, head: -10, lookY: -1, look: 0, aR: [30, 100]})} x={540} y={1440} s={0.4} prop="phone" propGlow={C.purple} faceGlow={0.5} />
      </Stage>
      <Vignette amt={0.6} />
    </AbsoluteFill>
  );
};
