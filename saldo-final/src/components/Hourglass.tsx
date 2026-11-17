import React from 'react';
import {C} from '../styles/theme';
import {clamp, rnd} from '../lib/anim';

/** Ampulheta futurista (símbolo da série). sand = fração de areia no bulbo de cima (1 = cheio).
 * dissolve: partículas douradas sumindo. broken: 0..1 estilhaçando. */
export const Hourglass: React.FC<{x: number; y: number; s?: number; t: number; sand: number; dissolve?: number; broken?: number; glitch?: number}> =
  ({x, y, s = 1, t, sand, dissolve = 0, broken = 0, glitch = 0}) => {
  const top = clamp(sand), bot = 1 - top;
  const H = 300, Wd = 170;
  if (broken > 0) {
    // estilhaços de vidro + explosão de areia dourada
    return (
      <g transform={`translate(${x},${y}) scale(${s})`}>
        {Array.from({length: 26}).map((_, i) => {
          const a = rnd(`sh${i}`) * Math.PI * 2, sp = 300 + rnd(`sp${i}`) * 900;
          const d = sp * broken, g = 900 * broken * broken;
          const px = Math.cos(a) * d, py = Math.sin(a) * d * 0.8 + g * 0.4 - 0;
          const sz = 18 + rnd(`sz${i}`) * 40;
          return (
            <path key={i} d={`M0,${-sz} L${sz * 0.6},${sz * 0.4} L${-sz * 0.5},${sz * 0.5} Z`}
              transform={`translate(${px},${py}) rotate(${rnd(`r${i}`) * 360 + broken * 720 * (rnd(`d${i}`) - 0.5)})`}
              fill={C.blue} opacity={0.35 * (1 - broken)} stroke={C.white} strokeWidth={2} strokeOpacity={0.7 * (1 - broken)} />
          );
        })}
        {Array.from({length: 90}).map((_, i) => {
          const a = rnd(`g${i}`) * Math.PI * 2, sp = 100 + rnd(`gs${i}`) * 700;
          return <circle key={`g${i}`} cx={Math.cos(a) * sp * broken} cy={Math.sin(a) * sp * broken + 300 * broken * broken}
            r={3 + rnd(`gr${i}`) * 5} fill={i % 7 === 0 ? C.red : C.gold} opacity={1 - broken} />;
        })}
        <circle cx={0} cy={0} r={300 * broken} fill={C.white} opacity={0.6 * (1 - broken) * (1 - broken)} />
      </g>
    );
  }
  const gx = glitch > 0 ? (rnd(Math.floor(t * 20)) - 0.5) * 40 * glitch : 0;
  const bulb = (dirn: 1 | -1) => `M${-Wd / 2},${-dirn * H / 2} Q${-Wd / 2},${-dirn * H * 0.12} -10,${-dirn * 12} L-10,0 L10,0 L10,${-dirn * 12} Q${Wd / 2},${-dirn * H * 0.12} ${Wd / 2},${-dirn * H / 2} Z`;
  // areia: triângulo no topo diminuindo, monte embaixo crescendo
  const tsY = -H / 2 + (H / 2 - 14) * (1 - top);
  const tw_ = (Wd / 2 - 12) * Math.sqrt(top);
  const mh = (H / 2 - 20) * Math.sqrt(bot) * 0.75;
  return (
    <g transform={`translate(${x + gx},${y}) scale(${s})`}>
      <defs>
        <radialGradient id="hgGlow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={C.gold} stopOpacity="0.45" /><stop offset="1" stopColor={C.purple} stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={0} cy={0} r={300} fill="url(#hgGlow)" />
      {/* areia de cima */}
      {top > 0.01 && <path d={`M${-tw_},${tsY} L${tw_},${tsY} L4,-10 L-4,-10 Z`} fill={C.gold} />}
      {/* fio de areia */}
      {top > 0.01 && <rect x={-3} y={-10} width={6} height={H / 2 - mh} fill={C.goldLight} opacity={0.9} />}
      {/* monte de baixo */}
      {bot > 0.01 && <path d={`M${-Wd / 2 + 14},${H / 2 - 8} Q0,${H / 2 - 8 - mh * 2} ${Wd / 2 - 14},${H / 2 - 8} Z`} fill={C.gold} />}
      {/* vidro */}
      <path d={bulb(1)} fill={C.blue} opacity={0.08} stroke={C.white} strokeWidth={4} strokeOpacity={0.75} />
      <path d={bulb(-1)} fill={C.blue} opacity={0.08} stroke={C.white} strokeWidth={4} strokeOpacity={0.75} />
      <path d={`M${-Wd / 2 + 18},${-H / 2 + 30} Q${-Wd / 2 + 16},${-H * 0.2} -24,-30`} stroke={C.white} strokeWidth={5} opacity={0.35} fill="none" />
      {/* tampas futuristas com neon */}
      {[-1, 1].map((d) => (
        <g key={d}>
          <rect x={-Wd / 2 - 30} y={d * H / 2 - 14} width={Wd + 60} height={28} rx={10} fill="#1A2140" />
          <rect x={-Wd / 2 - 30} y={d * H / 2 - 14} width={Wd + 60} height={28} rx={10} fill="none" stroke={C.purple} strokeWidth={3} />
          <rect x={-Wd / 2 - 10} y={d * H / 2 - 3} width={Wd + 20} height={6} rx={3} fill={C.magenta} opacity={0.8} />
        </g>
      ))}
      <rect x={-Wd / 2 - 22} y={-H / 2} width={8} height={H} fill="#1A2140" />
      <rect x={Wd / 2 + 14} y={-H / 2} width={8} height={H} fill="#1A2140" />
      {/* partículas douradas desaparecendo */}
      {dissolve > 0 && Array.from({length: 40}).map((_, i) => {
        const ph = (t * (0.3 + rnd(`p${i}`) * 0.5) + rnd(`o${i}`)) % 1;
        const px = (rnd(`x${i}`) - 0.5) * Wd * 0.8 + Math.sin(t * 2 + i) * 20 * ph;
        const py = tsY - ph * 360;
        return <circle key={i} cx={px} cy={py} r={2 + rnd(`r${i}`) * 4} fill={C.gold} opacity={(1 - ph) * dissolve} />;
      })}
    </g>
  );
};
