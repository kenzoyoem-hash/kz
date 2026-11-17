import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HospStage, POS} from './Hosp';
import {Toon} from '../characters/Toon';
import {ZARA, HELENA, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {Vignette} from '../components/Effects';
import {wordAt} from '../data/dialogue';
import {ease, kf, prog} from '../lib/anim';

/** CENA 04 — HOSPITAL (24,6–38,6 s): Helena fraca; a transferência familiar custa dez anos. */
export const Scene04: React.FC<{t: number}> = ({t}) => {
  const zar = say('ZARA', t), hel = say('HELENA', t);
  const tFechou = wordAt('l12', 'Fechou');
  const walking = t < 25.7;
  const zx = walking ? kf(t, [[24.6, 1330], [25.7, POS.zara, ease.out]]) : POS.zara;
  const zPose = posekf(t, [
    [25.7, P.idle],
    [28.5, {...P.idle, head: 4}],
    [28.9, {...P.holdHand, rT: {x: -230, y: -420}}],
    [32.2, {...P.holdHand, rT: {x: -230, y: -420}}],
    [32.6, {...P.relaxed, head: 6}],
    [tFechou - 0.1, {...P.relaxed, head: 4}],
    [tFechou + 0.3, {...P.wristOut, head: -2}, ease.out],
    [38.6, {...P.wristOut, head: -4}],
  ]);
  const hPose = posekf(t, [[24.6, {rSh: 14, rEl: 40, lSh: 14, lEl: 40, head: 8}], [28.9, {rSh: 14, rEl: 40, lSh: 30, lEl: 30, lHand: 'open', head: 10}], [32.2, {rSh: 14, rEl: 40, lSh: 30, lEl: 30, head: 10}], [32.8, {rSh: 14, rEl: 40, lSh: 14, lEl: 40, head: 6}]]);
  const insert = t >= 33.0 && t < 35.4;
  const cam = insert
    ? {x: POS.terminal, y: 1110, z: kf(t, [[33, 3.4], [35.4, 3.7]])}
    : t < 28.4
      ? {x: kf(t, [[24.6, 900], [26, 640]]), y: 1130, z: kf(t, [[24.6, 1.25], [28.4, 1.45]])}
      : t < 33
        ? {x: 600, y: 1080, z: kf(t, [[28.4, 1.7], [33, 1.85]])}
        : {x: 870, y: 1060, z: kf(t, [[35.4, 1.9], [38.6, 2.15]])};
  return (
    <AbsoluteFill>
      <HospStage t={t} cam={cam} term={t > 32.2 ? 'transfer' : 'idle'} termK={prog(t, 33, 38)}
        helena={<Toon t={t} look={HELENA} pose={hPose} expr={exprAt(t, [[24.6, 'weak'], [25.4, 'sad'], [28.6, 'tender'], [32.4, 'worried']])}
          x={POS.helena} y={POS.helenaY} scale={POS.helenaS} noLegs talk={hel.talk} vis={hel.vis} lookX={t > 25 ? 0.7 : 0.2} band={0.08} seed={6} />}
        front={walking
          ? <Toon t={t} look={ZARA} facing="side" dir={-1} walk={1} x={zx} y={POS.floor} scale={POS.s} expr="fear" band={0.82} seed={1} />
          : <Toon t={t} look={ZARA} pose={zPose} x={zx} y={POS.floor} scale={POS.s} band={0.82} bandGlow={t > tFechou ? 0.6 : 0}
            expr={exprAt(t, [[25.7, 'worried'], [28.6, 'determined'], [32.4, 'worried'], [tFechou, 'determined']])}
            talk={zar.talk} vis={zar.vis} lookX={t < 32.3 ? -0.8 : 0.9} lookY={t > 32.3 && t < tFechou ? 0.3 : 0} seed={1} />}
      />
      <Vignette amt={0.5} />
    </AbsoluteFill>
  );
};
