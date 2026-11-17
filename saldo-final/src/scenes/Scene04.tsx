import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {MAYA_S} from '../components/Background';
import {PhoneInsert, ScreenProposal} from '../components/Phone';
import {Dust, Vignette} from '../components/Effects';
import {Stage} from '../components/Camera';
import {Maya} from '../characters/Maya';
import {POSES, posekf} from '../characters/poses';
import {P} from '../characters/Rig';
import {voiceAt, wordAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {ease, kf, tw, wobble} from '../lib/anim';

/** CENA 04 — A PROPOSTA (00:18–00:26): Maya abre o app TEMPO; 5 anos por R$ 80.000. */
export const Scene04: React.FC<{t: number}> = ({t}) => {
  const tCaraca = wordAt('l06', 'Caraca');
  const tQuase = wordAt('l07', 'Quase');
  if (t >= 19.0 && t < 21.4) {
    const k = (t - 19.0) / 2.4;
    return (
      <AbsoluteFill>
        <Stage cam={{x: 540, y: 960, z: 1}} bg={C.ink}>
          <rect x={0} y={0} width={1080} height={1920} fill="#0B1022" />
          <Dust t={t} n={30} col={C.blue} opacity={0.35} />
          <PhoneInsert x={540 + wobble(t * 1.3, 1) * 6} y={tw(t, 19, 21.4, 820, 790)} s={tw(t, 19, 21.4, 0.84, 0.9, ease.out)} r={wobble(t, 2) * 1.2}>
            <ScreenProposal k={k} />
          </PhoneInsert>
        </Stage>
        <Vignette amt={0.6} />
      </AbsoluteFill>
    );
  }
  const pose = posekf(t, [
    [18.0, POSES.sitFlop],
    [18.45, P({...POSES.sit, aR: [10, 30], lean: -6, head: 4})],
    [18.8, POSES.sitPhone],
    [21.4, POSES.sitPhone],
    [tCaraca - 0.05, {...POSES.sitPhone, lean: 8}],
    [tCaraca + 0.25, {...POSES.sitExcited, y: -22}, ease.out],
    [tCaraca + 0.55, POSES.sitExcited],
    [tQuase - 0.3, {...POSES.sitExcited, aL: [60, 60], y: 0}],
    [tQuase + 0.25, POSES.sitDeadpan],
    [26, {...POSES.sitDeadpan, head: 18}],
  ]);
  const close = t >= 21.4;
  const cam = close
    ? {x: 780, y: kf(t, [[21.4, 1150], [26, 1170]]), z: kf(t, [[21.4, 2.2], [tQuase, 2.35], [26, 2.6]])}
    : {x: 760, y: 1220, z: kf(t, [[18, 1.6], [19, 1.75]])};
  const glow = tw(t, 18.6, 19.0, 0, 1);
  return (
    <AbsoluteFill>
      <AptStage t={t} cam={cam} dark={0.12}>
        <Maya t={t} pose={pose} x={740} y={1500} s={MAYA_S} prop={t > 18.5 ? 'phone' : null} faceGlow={glow} propGlow={C.blue}
          voice={voiceAt('MAYA', t)} />
      </AptStage>
      <Vignette amt={0.7} />
    </AbsoluteFill>
  );
};
