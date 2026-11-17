import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Stage, Layer} from '../components/Camera';
import {Billboard, NightSky, Skyline, TempoIcon} from '../components/Background';
import {Dust, Vignette, YearStream} from '../components/Effects';
import {Extra} from '../characters/Extras';
import {POSES, posekf, walk} from '../characters/poses';
import {P} from '../characters/Rig';
import {C, FONT} from '../styles/theme';
import {ease, kf, prog, rnd} from '../lib/anim';

/** CENA 02 — UM MUNDO ONDE VIDA É DINHEIRO (00:03–00:11)
 * Travelling lateral pela avenida: um trabalhador vende anos num terminal TEMPO; os anos (partículas
 * douradas) atravessam a cidade até uma clínica de longevidade, onde uma pessoa rica os compra. */
const GROUND = 1500;

const Terminal: React.FC<{x: number; t: number; label: string; col: string; active: number}> = ({x, t, label, col, active}) => (
  <g>
    <rect x={x - 50} y={GROUND - 330} width={100} height={330} rx={16} fill="#1A2140" />
    <rect x={x - 40} y={GROUND - 316} width={80} height={130} rx={8} fill={col} opacity={0.25 + 0.5 * active} />
    <TempoIcon x={x} y={GROUND - 270} s={0.8} col={C.gold} />
    <text x={x} y={GROUND - 210} textAnchor="middle" fill={C.white} fontFamily={FONT.title} fontSize={15}>{label}</text>
    <rect x={x - 30} y={GROUND - 160} width={60} height={40} rx={8} fill="#0B0F1E" stroke={col} strokeWidth={3} opacity={0.9} />
    <circle cx={x} cy={GROUND - 140} r={10 + 5 * Math.sin(t * 6)} fill={col} opacity={0.5 + 0.5 * active} />
    <ellipse cx={x} cy={GROUND - 250} rx={120} ry={160} fill={col} opacity={0.08 + 0.12 * active} />
  </g>
);

export const Scene02: React.FC<{t: number}> = ({t}) => {
  const camX = kf(t, [[3, 560], [6.2, 1000, ease.inOut], [10.8, 1980, ease.inOut]]);
  const z = kf(t, [[3, 1.12], [11, 1.02]]);
  const sold = prog(t, 4.7, 6.4);
  // trabalhador: estende o pulso no terminal, depois abaixa a cabeça
  const worker = posekf(t, [
    [3.0, P({look: 0.9, aR: [-4, 12]})],
    [3.8, P({look: 1, aR: [76, 14], lean: 6, head: 6})],
    [6.3, P({look: 1, aR: [78, 12], lean: 6, head: 10})],
    [7.0, P({look: 0.4, aR: [-2, 20], head: 22, lean: 10, lookY: 1, sh: 0.5})],
  ]);
  const rich = posekf(t, [
    [3, P({look: 0.6, aL: [10, 10], aR: [10, 10]})],
    [8.4, P({look: 0.3, aL: [12, 12], aR: [14, 12]})],
    [9.1, P({...POSES.armsUp, look: 0, head: -12, lookY: -1})],
    [11, P({...POSES.armsUp, look: 0, head: -16, lookY: -1})],
  ]);
  return (
    <AbsoluteFill>
      <Stage cam={{x: camX, y: 1080, z}} bg={C.ink}>
        <Layer depth={0.1}>
          <NightSky x={-600} y={-400} w={3600} h={2600} />
          <circle cx={820} cy={420} r={70} fill="#E6E8EF" opacity={0.12} />
        </Layer>
        <Layer depth={0.22}>
          <Skyline seed="sp-far" x0={-500} x1={2400} base={1320} minH={320} maxH={760} col="#16123A" winP={0.12} t={t} antenna />
        </Layer>
        <Layer depth={0.45}>
          <Skyline seed="sp-mid" x0={-500} x1={2900} base={1400} minH={200} maxH={560} col="#100D2A" winP={0.2} t={t} neon />
          <Billboard x={280} y={430} w={440} h={200} t={t} lines={['TEMPO', 'VENDA SEUS ANOS']} col={C.magenta} />
          <Billboard x={1240} y={400} w={460} h={210} t={t} lines={['VIVA MAIS', '+ ANOS DE VIDA']} col={C.gold} />
        </Layer>
        <Layer depth={0.75}>
          {/* fachadas próximas com letreiros */}
          {Array.from({length: 9}).map((_, i) => {
            const x = -200 + i * 360, h = 380 + rnd(`fh${i}`) * 260;
            return (
              <g key={i}>
                <rect x={x} y={GROUND - 40 - h} width={300} height={h} fill="#0D0B22" />
                <rect x={x + 20} y={GROUND - h} width={260} height={8} fill={[C.purple, C.blue, C.magenta][i % 3]} opacity={0.75} />
                {Array.from({length: 6}).map((__, r) => (
                  <rect key={r} x={x + 30 + (r % 3) * 85} y={GROUND - h + 50 + Math.floor(r / 3) * 90} width={60} height={50}
                    fill={rnd(`fw${i}${r}`) < 0.5 ? C.blue : C.purple} opacity={0.12 + rnd(`fo${i}${r}`) * 0.2} />
                ))}
              </g>
            );
          })}
        </Layer>
        <Layer depth={1}>
          {/* calçada e avenida */}
          <rect x={-800} y={GROUND} width={4200} height={900} fill="#0A0E1D" />
          <rect x={-800} y={GROUND} width={4200} height={6} fill={C.purple} opacity={0.5} />
          {Array.from({length: 20}).map((_, i) => (
            <rect key={i} x={-600 + i * 220 - ((t * 400) % 220)} y={GROUND + 230} width={110} height={10} fill={C.white} opacity={0.18} />
          ))}
          {/* carros elétricos passando (faixas de luz) */}
          {[0, 1, 2].map((i) => {
            const cx = ((t * (900 + i * 300) + i * 900) % 4400) - 800;
            return <rect key={i} x={cx} y={GROUND + 120 + i * 140} width={260} height={10} rx={5} fill={i === 1 ? C.red : C.blue} opacity={0.5} />;
          })}
          {/* terminal TEMPO + trabalhador */}
          <Terminal x={760} t={t} label="VENDER ANOS" col={C.blue} active={sold} />
          <Extra kind="worker" t={t} pose={() => worker} x={640} y={GROUND} s={1.05} />
          {/* clínica de longevidade */}
          <rect x={1760} y={GROUND - 620} width={520} height={620} fill="#14182E" />
          <rect x={1760} y={GROUND - 620} width={520} height={90} fill="#1C2240" />
          <text x={2020} y={GROUND - 560} textAnchor="middle" fill={C.gold} fontFamily={FONT.title} fontSize={40} letterSpacing={4}>CLÍNICA LONGEVA</text>
          <rect x={1800} y={GROUND - 500} width={440} height={500} fill={C.gold} opacity={0.08 + 0.15 * prog(t, 8.2, 9.2)} />
          <rect x={1800} y={GROUND - 500} width={440} height={500} fill="none" stroke={C.gold} strokeWidth={3} opacity={0.5} />
          <Terminal x={2200} t={t} label="COMPRAR ANOS" col={C.gold} active={prog(t, 8.2, 9)} />
          <Extra kind="rich" t={t} pose={() => rich} x={2000} y={GROUND} s={1.05} facing={-1} />
          {/* pedestres */}
          {[[0, 'p1', 1, 120], [1, 'p2', -1, 1400], [2, 'p3', 1, 900], [3, 'p2', 1, 1700], [4, 'p1', -1, 2500]].map(([i, k, f, x0]) => {
            const sp = 120 * (f as number);
            return (
              <Extra key={i as number} kind={k as any} t={t} pose={(tt) => walk(tt * 1.5 + (i as number) * 0.27)}
                x={(x0 as number) + (t - 3) * sp} y={GROUND + 30} s={0.95} facing={f as 1 | -1} dark={0.35} />
            );
          })}
          {/* anos vendidos: do pulso para o terminal, e do terminal até a clínica */}
          <YearStream t={t} t0={4.6} t1={6.3} from={[720, GROUND - 300]} to={[760, GROUND - 260]} bend={-40} n={40} seed="w1" />
          <YearStream t={t} t0={5.6} t1={9.2} from={[760, GROUND - 330]} to={[2000, GROUND - 380]} bend={-900} n={110} seed="w2" />
          <circle cx={2000} cy={GROUND - 300} r={160} fill={C.gold} opacity={0.25 * prog(t, 8.6, 9.6) * (0.8 + 0.2 * Math.sin(t * 8))} />
        </Layer>
        <Layer depth={1.35}>
          {/* primeiro plano: postes e pessoas desfocadas */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x={200 + i * 900} y={300} width={22} height={1700} fill="#05060C" />
              <rect x={150 + i * 900} y={300} width={120} height={14} fill="#05060C" />
              <ellipse cx={210 + i * 900} cy={320} rx={60} ry={10} fill={C.blue} opacity={0.5} />
            </g>
          ))}
          <Extra kind="p3" t={t} pose={(tt) => walk(tt * 1.4)} x={2100 - (t - 3) * 260} y={2000} s={1.6} facing={-1} dark={0.85} shadow={false} />
        </Layer>
        <Layer depth={0.5}><Dust t={t} n={30} seed="s2" col={C.magenta} speed={20} opacity={0.4} /></Layer>
      </Stage>
      <Vignette amt={0.7} />
    </AbsoluteFill>
  );
};
