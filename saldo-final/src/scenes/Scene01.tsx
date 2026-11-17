import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Layer} from '../components/Camera';
import {Hourglass} from '../components/Hourglass';
import {Dust, Glitch, Vignette} from '../components/Effects';
import {C, FONT} from '../styles/theme';
import {bump, ease, kf, prog, tw} from '../lib/anim';

/** CENA 01 — GANCHO (00:00–00:03): ampulheta futurista, partículas douradas sumindo, glitch vermelho, zoom rápido. */
export const Scene01: React.FC<{t: number}> = ({t}) => {
  const z = kf(t, [[0, 0.92], [2.3, 1.12, ease.inOut], [3.0, 2.6, ease.in]]);
  const gl = Math.max(bump(t, 1.7, 0.2), bump(t, 2.85, 0.15) * 0.8);
  const title = prog(t, 0.35, 0.9, ease.out) * (1 - prog(t, 2.3, 2.6));
  return (
    <Glitch amt={gl} t={t}>
      <Stage cam={{x: 540, y: 900, z, r: tw(t, 2.3, 3, 0, 6, ease.in)}} bg={C.ink}>
        <defs>
          <radialGradient id="s1bg" cx="0.5" cy="0.47" r="0.6">
            <stop offset="0" stopColor="#24124A" /><stop offset="0.6" stopColor={C.navy} /><stop offset="1" stopColor={C.ink} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={1080} height={1920} fill="url(#s1bg)" />
        <Layer depth={0.3}><Dust t={t} n={50} seed="s1" col={C.purple} speed={40} /></Layer>
        <Layer depth={1}>
          <Hourglass x={540} y={900} s={1.25} t={t} sand={tw(t, 0, 3, 0.72, 0.5)} dissolve={1} glitch={gl} />
        </Layer>
        <Layer depth={1.4}><Dust t={t + 3} n={18} seed="s1b" col={C.gold} speed={70} size={6} opacity={0.5} /></Layer>
        {gl > 0.1 && <rect x={0} y={880 + Math.sin(t * 90) * 300} width={1080} height={14} fill={C.red} opacity={0.8 * gl} />}
      </Stage>
      <AbsoluteFill style={{opacity: title}}>
        <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
          <text x={540} y={330} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={96} letterSpacing={10}>SALDO FINAL</text>
          <rect x={390} y={360} width={300} height={4} fill={C.purple} />
          <text x={540} y={410} textAnchor="middle" fill={C.purple} fontFamily={FONT.semi} fontSize={30} letterSpacing={8}>EPISÓDIO 01</text>
        </svg>
      </AbsoluteFill>
      <Vignette amt={0.8} />
    </Glitch>
  );
};
