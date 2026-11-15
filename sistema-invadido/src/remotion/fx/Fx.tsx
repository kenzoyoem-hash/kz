import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {clamp, rnd} from '../lib/anim';

/** Câmera para cenas SVG: foco (cx, cy) em coordenadas de mundo, zoom e tremor. */
export const SvgCamera: React.FC<{cx: number; cy: number; zoom: number; rot?: number; sx?: number; sy?: number; children: React.ReactNode}> = ({cx, cy, zoom, rot = 0, sx = 0, sy = 0, children}) => {
  const w = 1080 / zoom, h = 1920 / zoom;
  const x = cx - w / 2 + sx / zoom, y = cy - h / 2 + sy / zoom;
  return (
    <svg viewBox={`${x} ${y} ${w} ${h}`} width={1080} height={1920} style={{position: 'absolute', inset: 0}} preserveAspectRatio="xMidYMid slice">
      <g transform={`rotate(${rot}, ${cx}, ${cy})`}>{children}</g>
    </svg>
  );
};

/** Interferência digital: faixas deslocadas + RGB */
export const Glitch: React.FC<{amount: number; seed?: number}> = ({amount, seed = 0}) => {
  const f = useCurrentFrame();
  if (amount <= 0.01) return null;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: 9}).map((_, i) => {
        const r = rnd(`g${seed}-${i}-${f}`);
        const r2 = rnd(`h${seed}-${i}-${f}`);
        if (r2 > 0.35 + amount * 0.6) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: `${r * 100}%`, height: 8 + r2 * 90,
            background: i % 3 === 0 ? 'rgba(255,45,61,0.55)' : i % 3 === 1 ? 'rgba(111,211,255,0.5)' : 'rgba(255,255,255,0.25)',
            mixBlendMode: 'screen', transform: `translateX(${(r2 - 0.5) * 260 * amount}px)`}} />
        );
      })}
      <AbsoluteFill style={{background: `repeating-linear-gradient(0deg, rgba(255,255,255,${0.05 * amount}) 0 2px, transparent 2px 6px)`}} />
    </AbsoluteFill>
  );
};

/** Grão de filme leve */
export const Grain: React.FC<{opacity?: number}> = ({opacity = 0.07}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity, mixBlendMode: 'overlay'}}>
      <svg width={1080} height={1920} viewBox="0 0 540 960" preserveAspectRatio="none">
        <filter id="grainF"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={f % 30} /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width={540} height={960} filter="url(#grainF)" />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{strength?: number; color?: string}> = ({strength = 0.75, color = '0,0,0'}) => (
  <AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(${color},${strength}) 100%)`}} />
);

export const Flash: React.FC<{amount: number; color?: string}> = ({amount, color = '#fff'}) =>
  amount > 0.01 ? <AbsoluteFill style={{background: color, opacity: clamp(amount), pointerEvents: 'none'}} /> : null;

export const Darken: React.FC<{amount: number}> = ({amount}) =>
  amount > 0.01 ? <AbsoluteFill style={{background: '#000', opacity: clamp(amount)}} /> : null;
