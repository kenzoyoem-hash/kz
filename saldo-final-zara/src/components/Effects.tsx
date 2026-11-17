import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../styles/theme';
import {clamp, rnd} from '../lib/anim';

/** poeira/partículas flutuantes (SVG) */
export const Dust: React.FC<{t: number; n?: number; seed?: string; x?: number; y?: number; w?: number; h?: number; col?: string; speed?: number; size?: number; opacity?: number}> =
  ({t, n = 40, seed = 'd', x = 0, y = 0, w = 1080, h = 1920, col = C.purple, speed = 30, size = 4, opacity = 0.6}) => (
  <g>
    {Array.from({length: n}).map((_, i) => {
      const r1 = rnd(`${seed}a${i}`), r2 = rnd(`${seed}b${i}`), r3 = rnd(`${seed}c${i}`);
      const py = y + ((r2 * h - t * speed * (0.5 + r3)) % h + h) % h;
      const px = x + r1 * w + Math.sin(t * (0.5 + r3) + i) * 18;
      const tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (1 + r1 * 2) + i));
      return <circle key={i} cx={px} cy={py} r={size * (0.4 + r3)} fill={col} opacity={opacity * tw} />;
    })}
  </g>
);

/** fluxo de partículas douradas de A para B (transferência de anos de vida) */
export const YearStream: React.FC<{t: number; t0: number; t1: number; from: [number, number]; to: [number, number]; bend?: number; n?: number; col?: string; size?: number; seed?: string}> =
  ({t, t0, t1, from, to, bend = -200, n = 60, col = C.gold, size = 7, seed = 'ys'}) => {
  if (t < t0 || t > t1 + 1.2) return null;
  const mx = (from[0] + to[0]) / 2, my = (from[1] + to[1]) / 2 + bend;
  return (
    <g>
      {Array.from({length: n}).map((_, i) => {
        const st = t0 + rnd(`${seed}s${i}`) * (t1 - t0);
        const d = 0.9 + rnd(`${seed}d${i}`) * 0.6;
        const k = (t - st) / d;
        if (k < 0 || k > 1) return null;
        const u = 1 - k;
        const jx = (rnd(`${seed}x${i}`) - 0.5) * 50 * Math.sin(k * Math.PI), jy = (rnd(`${seed}y${i}`) - 0.5) * 50 * Math.sin(k * Math.PI);
        const px = u * u * from[0] + 2 * u * k * mx + k * k * to[0] + jx;
        const py = u * u * from[1] + 2 * u * k * my + k * k * to[1] + jy;
        const r = size * (0.5 + rnd(`${seed}r${i}`)) * (1 - k * 0.4);
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={r * 2.6} fill={col} opacity={0.18 * Math.sin(k * Math.PI)} />
            <circle cx={px} cy={py} r={r} fill={i % 5 === 0 ? C.goldLight : col} opacity={Math.sin(k * Math.PI) * 0.95} />
          </g>
        );
      })}
    </g>
  );
};

/** vinheta cinematográfica */
export const Vignette: React.FC<{amt?: number; col?: string}> = ({amt = 0.75, col = '0,0,0'}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 75% 60% at 50% 46%, rgba(${col},0) 45%, rgba(${col},${amt}) 100%)`}} />
);

/** grão de filme (muda a cada quadro) */
export const Grain: React.FC<{t: number; amt?: number}> = ({t, amt = 0.07}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: amt, mixBlendMode: 'overlay'}}>
    <svg width="1080" height="1920">
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(t * 30) % 50} /></filter>
      <rect width="1080" height="1920" filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

/** clarão (transição luminosa) */
export const Flash: React.FC<{amt: number; col?: string}> = ({amt, col = '#FFFFFF'}) =>
  amt > 0.001 ? <AbsoluteFill style={{background: col, opacity: clamp(amt), pointerEvents: 'none'}} /> : null;

/** linhas de varredura (telas e transmissões) */
export const Scanlines: React.FC<{amt?: number; t?: number}> = ({amt = 0.12, t = 0}) => (
  <AbsoluteFill style={{pointerEvents: 'none', opacity: amt,
    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.9) 0px, rgba(0,0,0,0.9) 2px, transparent 2px, transparent 6px)',
    backgroundPosition: `0 ${(t * 40) % 6}px`}} />
);

/** glitch digital: fatias deslocadas com separação de cor (renderiza cópias só enquanto ativo) */
export const Glitch: React.FC<{amt: number; t: number; children: React.ReactNode; seed?: number}> = ({amt, t, children, seed = 0}) => {
  if (amt <= 0.01) return <AbsoluteFill>{children}</AbsoluteFill>;
  const f = Math.floor(t * 24) + seed * 100;
  const slices = Array.from({length: 5}).map((_, i) => {
    const y = rnd(`gy${f}-${i}`) * 100, h = 2 + rnd(`gh${f}-${i}`) * 12;
    const dx = (rnd(`gx${f}-${i}`) - 0.5) * 120 * amt;
    return {y, h, dx};
  });
  const dx = (rnd(`gd${f}`) - 0.5) * 30 * amt;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{transform: `translateX(${dx}px)`}}>{children}</AbsoluteFill>
      <AbsoluteFill style={{mixBlendMode: 'screen', opacity: 0.3 * amt, transform: `translateX(${-14 * amt}px)`, filter: 'sepia(1) saturate(8) hue-rotate(-50deg)'}}>{children}</AbsoluteFill>
      {slices.map((s, i) => (
        <AbsoluteFill key={i} style={{clipPath: `inset(${s.y}% 0 ${Math.max(0, 100 - s.y - s.h)}% 0)`, transform: `translateX(${s.dx}px)`}}>{children}</AbsoluteFill>
      ))}
      <AbsoluteFill style={{background: `linear-gradient(transparent ${slices[0].y}%, rgba(255,59,78,0.25) ${slices[0].y}%, rgba(255,59,78,0.25) ${slices[0].y + 1.2}%, transparent ${slices[0].y + 1.2}%)`}} />
    </AbsoluteFill>
  );
};
