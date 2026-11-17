import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HospStage, POS} from './Hosp';
import {Toon} from '../characters/Toon';
import {ZARA, HELENA, DANTE, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {Vignette} from '../components/Effects';
import {C} from '../styles/theme';
import {kf, prog} from '../lib/anim';

/** CENA 06 — O SEGREDO (53,3–58,3 s): Helena toca o pingente com o símbolo da Áurea. */
export const Scene06: React.FC<{t: number}> = ({t}) => {
  const zar = say('ZARA', t), hel = say('HELENA', t);
  const locketY = POS.helenaY - 546 * POS.helenaS;
  const insert = t >= 54.9 && t < 56.0;
  const hPose = posekf(t, [[53.3, {rSh: 14, rEl: 40, lSh: 14, lEl: 40, head: 10}], [54.6, {rSh: 0, rEl: 0, lSh: 14, lEl: 40, rT: {x: -14, y: -530}, rHand: 'grip', head: 16}]]);
  const cam = insert ? {x: POS.helena + 4, y: locketY, z: kf(t, [[54.9, 5.5], [56, 6.2]])}
    : t < 54.9 ? {x: 620, y: 1060, z: kf(t, [[53.3, 1.6], [54.9, 1.7]])}
      : {x: POS.helena + 10, y: 1000, z: kf(t, [[56, 2.4], [58.3, 2.6]])};
  return (
    <AbsoluteFill>
      <HospStage t={t} cam={cam} towerGlow={0.4}
        helena={<Toon t={t} look={HELENA} pose={hPose} expr={exprAt(t, [[53.3, 'weak'], [54.2, 'sad']])} x={POS.helena} y={POS.helenaY} scale={POS.helenaS} noLegs
          talk={hel.talk} vis={hel.vis} lookX={t > 56 ? 0.4 : 0.7} lookY={t > 56 ? 0.5 : 0} band={0.03} seed={6} />}
        front={<>
          {insert && <circle cx={POS.helena} cy={locketY} r={16 + 4 * Math.sin(t * 9)} fill={C.gold} opacity={0.35} />}
          <Toon t={t} look={ZARA} pose={{...P.hold, rT: {x: -60, y: -470}, lT: {x: 0, y: -470}, head: 8}} x={POS.zara} y={POS.floor} scale={POS.s} band={0.82}
            expr={exprAt(t, [[53.3, 'worried'], [56, 'sad']])} talk={zar.talk} vis={zar.vis} lookX={-0.8} seed={1} />
          <Toon t={t} look={DANTE} pose={P.relaxed} x={POS.dante} y={POS.floor} scale={0.69} expr="cold" lookX={-0.8} band={0.5} seed={4} />
        </>}
        over={insert ? <rect x={-2000} y={-2000} width={6000} height={6000} fill={C.gold} opacity={0.06 * prog(t, 54.9, 55.3)} /> : null}
      />
      <Vignette amt={insert ? 0.8 : 0.6} />
    </AbsoluteFill>
  );
};
