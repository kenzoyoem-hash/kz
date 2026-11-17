import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Layer} from '../components/Camera';
import {NightSky, Skyline, AureaTower, Rain} from '../sets/Sets';
import {Toon} from '../characters/Toon';
import {ZARA_DELIVERY} from '../characters/Cast';
import {say} from '../characters/act';
import {Vignette, Flash} from '../components/Effects';
import {C} from '../styles/theme';
import {bump, kf, rnd} from '../lib/anim';

/** CENA 03 — CORRIDA NA CHUVA (19,6–24,6 s): Zara atravessa a cidade; a torre da Áurea domina o céu. */
const F = 1500;
export const Scene03: React.FC<{t: number}> = ({t}) => {
  const x = kf(t, [[19.6, 120], [24.6, 1700]]);
  const zar = say('ZARA', t);
  const thunder = bump(t, 20.85, 0.12) + bump(t, 21.05, 0.08) * 0.6;
  return (
    <AbsoluteFill>
      <Stage cam={{x: x + 160, y: 1080, z: 1.35}} bg={C.ink}>
        <Layer depth={0.08}><NightSky /></Layer>
        <Layer depth={0.2}>
          <Skyline seed="sp-far" x0={-400} x1={2400} base={1250} minH={260} maxH={620} col="#1F1B38" t={t} winP={0.14} />
          <AureaTower x={700} base={1400} s={0.9} t={t} glow={0.3} />
        </Layer>
        <Layer depth={0.5}>
          <Skyline seed="sp-mid" x0={-400} x1={3200} base={1380} minH={150} maxH={420} col="#16132B" t={t} winP={0.22} />
        </Layer>
        <Layer depth={1}>
          {/* fachadas com letreiros em forma de ícones (sem texto) */}
          {Array.from({length: 7}).map((_, i) => {
            const fx = -200 + i * 420, col = [C.magenta, C.teal, C.blue, C.gold][i % 4];
            return (
              <g key={i}>
                <rect x={fx} y={760} width={380} height={740} fill="#1A1730" stroke={C.outline} strokeWidth={6} />
                <rect x={fx + 30} y={1180} width={320} height={320} fill="#23203F" stroke={C.outline} strokeWidth={5} />
                <rect x={fx + 40} y={1190} width={300} height={200} fill={col} opacity={0.12} />
                <circle cx={fx + 190} cy={900} r={46} fill="none" stroke={col} strokeWidth={10} opacity={0.6 + 0.4 * (rnd(`n${i}${Math.floor(t * 6)}`) > 0.1 ? 1 : 0)} />
              </g>
            );
          })}
          {/* hospital (cruz verde) */}
          <rect x={1650} y={700} width={700} height={800} fill="#DCE8EC" stroke={C.outline} strokeWidth={7} />
          <path d="M1960,820 h60 v60 h60 v60 h-60 v60 h-60 v-60 h-60 v-60 h60 Z" fill="#33D17A" stroke={C.outline} strokeWidth={6} />
          <rect x={1760} y={1150} width={260} height={350} fill="#9ED6FF" stroke={C.outline} strokeWidth={6} opacity={0.9} />
          {/* chão molhado com reflexos */}
          <rect x={-600} y={F} width={3400} height={900} fill="#121426" stroke={C.outline} strokeWidth={6} />
          {Array.from({length: 12}).map((_, i) => <rect key={i} x={-300 + i * 260} y={F + 40 + (i % 3) * 60} width={140} height={10} rx={5} fill={[C.magenta, C.teal, C.gold][i % 3]} opacity={0.25} />)}
          <Toon t={t} look={ZARA_DELIVERY} facing="side" run={1} dir={1} x={x} y={F} scale={0.62} expr={t > 21.6 && t < 23.6 ? 'determined' : 'fear'}
            talk={zar.talk} vis={zar.vis} band={0.82} seed={1} />
          {/* respingos */}
          {[0, 1, 2].map((k) => { const ph = (t * 3.6 + k / 3) % 1; return <circle key={k} cx={x - 40 - ph * 60} cy={F - ph * 40} r={8 * (1 - ph)} fill="#A9C7FF" opacity={1 - ph} />; })}
        </Layer>
        <Layer depth={1.4}><Rain t={t} n={150} o={0.5} /></Layer>
      </Stage>
      <Flash amt={thunder * 0.5} col="#DDE6FF" />
      <Vignette amt={0.7} />
    </AbsoluteFill>
  );
};
