import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HospStage, POS} from './Hosp';
import {Toon} from '../characters/Toon';
import {ZARA, HELENA, CIRO} from '../characters/Cast';
import {exprAt, posekf, say} from '../characters/act';
import {Vignette} from '../components/Effects';
import {ease, kf, prog} from '../lib/anim';

/** CENA 08 — CLIFFHANGER (72–77,4 s): alarme, Helena agarra o pulso da filha: "o Ciro… ele é o seu…" — corte seco. */
export const Scene08: React.FC<{t: number}> = ({t}) => {
  if (t >= 75.1) return <AbsoluteFill style={{background: '#000'}} />;
  const hel = say('HELENA', t);
  const alarm = 1;
  const red = 0.16 + 0.1 * (Math.sin(t * 12) > 0 ? 1 : 0);
  const zx = kf(t, [[72, POS.zara], [72.6, 620, ease.out]]);
  const hPose = posekf(t, [[72, {rSh: 14, rEl: 40, lSh: 14, lEl: 40, head: 14}], [72.5, {rSh: 14, rEl: 40, lSh: 0, lEl: 0, lT: {x: 300, y: -520}, lHand: 'grip', head: 6}]]);
  return (
    <AbsoluteFill>
      <HospStage t={t} cam={{x: 520, y: kf(t, [[72, 1020], [75, 990]]), z: kf(t, [[72, 1.9], [74.8, 2.7, ease.in]])}} alarm={alarm} red={red} towerGlow={0.9}
        helena={<Toon t={t} look={HELENA} pose={hPose} expr={exprAt(t, [[72, 'fear'], [72.4, 'worried'], [74.6, 'weak']])} x={POS.helena} y={POS.helenaY} scale={POS.helenaS} noLegs
          talk={hel.talk} vis={hel.vis} lookX={0.8} band={0.0} bandGlow={0} tremble={0.5} seed={6} />}
        front={<>
          <Toon t={t} look={ZARA} pose={{rSh: 0, rEl: 0, lSh: 10, lEl: 12, rT: {x: -150, y: -560}, rHand: 'open', head: 10, lean: -6}} x={zx} y={POS.floor} scale={POS.s} band={0.82}
            expr={exprAt(t, [[72, 'shock'], [73.6, 'fear']])} lookX={-0.9} lookY={0.3} tremble={0.3} seed={1} />
          {/* Ciro (holograma) continua ali, sorrindo */}
          <g opacity={0.5}><Toon t={t} look={CIRO} pose={{rSh: 0, rEl: 0, lSh: 8, lEl: 8, rT: {x: -40, y: -560}, rFs: 0.6, rHand: 'grip'}} x={POS.terminal} y={1035} scale={0.46} expr="smirk" noLegs lookX={-0.8} seed={8} /></g>
        </>}
        dark={prog(t, 74.85, 75.1)}
      />
      <Vignette amt={0.85} col="40,0,8" />
    </AbsoluteFill>
  );
};
