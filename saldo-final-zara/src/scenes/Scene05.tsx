import React from 'react';
import {AbsoluteFill} from 'remotion';
import {HospStage, POS} from './Hosp';
import {Toon} from '../characters/Toon';
import {ZARA, HELENA, DANTE, P} from '../characters/Cast';
import {posekf, exprAt, say} from '../characters/act';
import {IVPole} from '../sets/Sets';
import {Vignette, YearStream} from '../components/Effects';
import {wordAt} from '../data/dialogue';
import {ease, kf, prog, shake} from '../lib/anim';

/** CENA 05 — O SAQUE (38,6–53,3 s): os anos da Helena saem pela janela até a torre; Dante aparece. */
export const Scene05: React.FC<{t: number}> = ({t}) => {
  const zar = say('ZARA', t), dan = say('DANTE', t);
  const tMae = wordAt('l16', 'mãe');
  const grab = t >= 45.6;
  const zPose = posekf(t, [
    [38.6, {...P.wristOut, head: -4}],
    [39.2, {...P.relaxed, head: -6}],
    [42.9, {...P.relaxed, head: 0}],
    [45.5, {...P.relaxed, head: 0}],
    [45.85, P.weapon, ease.out],
    [tMae, P.weapon],
    [tMae + 0.8, {...P.hold, rT: {x: -60, y: -470}, lT: {x: 0, y: -470}, head: 8}],
  ]);
  const dPose = posekf(t, [[42.9, {...P.armsCrossed, lean: -6, head: 6}], [49.0, {...P.armsCrossed, lean: -4, head: 6}], [49.4, {...P.handsUp, head: 4}], [tMae, P.handsUp], [tMae + 0.5, {...P.relaxed, head: 6}]]);
  const sk = shake(t, 45.7, 14, 0.4, 2);
  const cam = t < 42.9
    ? {x: kf(t, [[38.6, 700], [42.9, 760]]), y: kf(t, [[38.6, 1100], [42.9, 1000]]), z: kf(t, [[38.6, 1.3], [42.9, 1.4]])}
    : t < 45.5
      ? {x: 1260, y: 1060, z: kf(t, [[42.9, 1.9], [45.5, 2.05]])}
      : t < 49.2
        ? {x: 860 + sk.x, y: 1050 + sk.y, z: kf(t, [[45.5, 1.9], [45.8, 2.25, ease.out], [49.2, 2.3]])}
        : {x: 1050, y: 1110, z: kf(t, [[49.2, 1.45], [53.3, 1.6]])};
  const stream = t < 53.3;
  return (
    <AbsoluteFill>
      <HospStage t={t} cam={cam} towerGlow={prog(t, 39, 41)} ivInHand={grab}
        helena={<Toon t={t} look={HELENA} pose={{rSh: 14, rEl: 40, lSh: 40, lEl: 20, head: 14}} expr="weak" x={POS.helena} y={POS.helenaY} scale={POS.helenaS} noLegs
          band={kf(t, [[38.6, 0.08], [53, 0.03]])} bandGlow={0.8} lookX={0.6} seed={6} />}
        front={<>
          {stream && <YearStream t={t} t0={38.7} t1={53.2} from={[POS.helena + 130, 1290]} to={[880, 820]} bend={-260} n={200} seed="saque" size={7} />}
          <Toon t={t} look={ZARA} pose={zPose} x={POS.zara} y={POS.floor} scale={POS.s} band={0.82}
            expr={exprAt(t, [[38.6, 'surprised'], [39.6, 'shock'], [43.1, 'fear'], [45.6, 'angry'], [49.4, 'sarcastic'], [tMae + 0.2, 'shock']])}
            talk={zar.talk} vis={zar.vis} lookX={t < 42.9 ? 0.5 : 1} lookY={t < 42.9 ? -0.6 : 0}
            holdR={grab ? <g transform="rotate(-150)"><IVPole x={0} y={300} /></g> : undefined} seed={1} />
          {t >= 42.9 && <Toon t={t} look={DANTE} pose={dPose} x={POS.dante} y={POS.floor} scale={0.69}
            expr={exprAt(t, [[42.9, 'cold'], [45.6, 'surprised'], [49.4, 'smirk'], [tMae, 'cold']])} talk={dan.talk} vis={dan.vis} lookX={-0.8} band={0.5} seed={4} />}
        </>}
      />
      <Vignette amt={0.55} />
    </AbsoluteFill>
  );
};
