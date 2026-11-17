import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {Stage} from '../components/Camera';
import {MAYA_S} from '../components/Background';
import {PhoneInsert, ScreenConfirm} from '../components/Phone';
import {Dust, Vignette, YearStream} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {POSES, posekf} from '../characters/poses';
import {P} from '../characters/Rig';
import {voiceAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {bump, ease, kf, prog, tw, wobble} from '../lib/anim';

/** CENA 06 — A VENDA (00:35–00:43): a mão treme sobre CONFIRMAR; partículas douradas saem do pulso. */
export const Scene06: React.FC<{t: number}> = ({t}) => {
  // inserts do celular: hesitação (35–37.2) e o toque (40.4–41.0)
  if ((t >= 35 && t < 37.2) || (t >= 40.4 && t < 41.0)) {
    const pressing = t >= 40.4;
    const press = pressing ? prog(t, 40.55, 40.95) : 0;
    const tremble = pressing ? 0 : 1;
    const hover = pressing ? tw(t, 40.4, 40.55, 1140, 1050, ease.in) : 1150 + wobble(t * 2, 4) * 20;
    return (
      <AbsoluteFill>
        <Stage cam={{x: 540, y: 960, z: 1}} bg={C.ink}>
          <rect x={0} y={0} width={1080} height={1920} fill="#0A0E1F" />
          <Dust t={t} n={20} col={C.purple} opacity={0.3} />
          <PhoneInsert x={540} y={pressing ? 760 : tw(t, 35, 37.2, 820, 760)} s={pressing ? 0.95 : tw(t, 35, 37.2, 0.86, 0.95, ease.out)}
            thumb={{x: 300 + wobble(t * 31, 1) * 9 * tremble, y: hover + wobble(t * 29, 2) * 9 * tremble, press}}>
            <ScreenConfirm k={(t - 35) / 2} press={press} done={pressing ? prog(t, 40.8, 41.0) : 0} />
          </PhoneInsert>
        </Stage>
        <Vignette amt={0.75} />
      </AbsoluteFill>
    );
  }
  const after = t >= 41.0;
  const pose = after
    ? posekf(t, [[41.0, POSES.sitPhoneBoth], [41.6, P({...POSES.sitPhone, aL: [50, 110], head: 18, look: 0.5, lookY: 1})], [43, P({...POSES.sitPhone, aL: [52, 112], head: 20, look: 0.4, lookY: 1})]])
    : posekf(t, [[37.2, POSES.sitPhoneBoth], [40.4, {...POSES.sitPhoneBoth, lean: 14, head: 18, sh: 0.6}]]);
  const cam = after
    ? {x: 740, y: 1180, z: kf(t, [[41, 1.6], [43, 1.45]])}
    : {x: 770, y: 1150, z: kf(t, [[37.2, 2.0], [40.4, 2.5, ease.linear]])};
  const blue = bump(t, 41.25, 0.6);
  const wrist: [number, number] = [800, 1290];
  return (
    <AbsoluteFill>
      <AptStage t={t} cam={cam} dark={after ? 0.25 - blue * 0.25 : 0.32} lamp={0.7}
        over={<rect x={-1000} y={-1000} width={4000} height={5000} fill={C.blue} opacity={blue * 0.35} />}>
        <Maya t={t} pose={pose} x={740} y={1500} s={MAYA_S} prop="phone" faceGlow={1} propGlow={after ? C.gold : C.blue}
          tremble={after ? 0.15 : 0.7} voice={voiceAt('MAYA', t) * 0.5} />
        {after && (
          <>
            <YearStream t={t} t0={41.0} t1={42.4} from={wrist} to={[810, 1215]} bend={-60} n={50} seed="v1" size={6} />
            <YearStream t={t} t0={41.4} t1={42.9} from={[810, 1215]} to={[560, 720]} bend={-120} n={70} seed="v2" size={6} />
            <circle cx={wrist[0]} cy={wrist[1]} r={26 + 10 * Math.sin(t * 12)} fill={C.gold} opacity={0.5 * (1 - prog(t, 42.2, 43))} />
          </>
        )}
      </AptStage>
      <Vignette amt={0.8} />
    </AbsoluteFill>
  );
};
