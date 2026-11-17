import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {MAYA_S} from '../components/Background';
import {Vignette} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {POSES, posekf, walkTo} from '../characters/poses';
import {P, Pose} from '../characters/Rig';
import {voiceAt} from '../data/dialogue';
import {ease, kf, prog, tw} from '../lib/anim';

/** CENA 03 — OS BOLETOS (00:11–00:18): contas na mesa, geladeira quase vazia, suspiro, se joga no sofá. */
export const Scene03: React.FC<{t: number}> = ({t}) => {
  let x = 400, facing: 1 | -1 = -1, pose: Pose, prop: 'bill' | null = null;
  if (t < 12.75) {
    pose = posekf(t, [
      [11.0, P({look: 1, lookY: 0.9, head: 16, lean: 10, aR: [44, 24], aL: [8, 12]})],
      [11.45, P({look: 1, lookY: 0.2, head: 4, lean: 2, aR: [64, 92], aL: [8, 12]})],
      [12.1, P({look: 1, lookY: 0.3, head: 9, lean: 0, aR: [62, 96], aL: [30, -60], sh: 0.3})],
      [12.6, P({look: 0.6, lookY: 0.4, head: 14, lean: 2, aR: [20, 30], aL: [10, 10]})],
    ]);
    prop = t > 11.4 && t < 12.55 ? 'bill' : null;
  } else if (t < 13.85) {
    const w = walkTo(t, 12.75, 13.85, 400, 1170, 1.7, P({look: 0.8, head: 4}));
    x = w.x; facing = 1; pose = w.pose;
  } else if (t < 15.15) {
    x = 1170; facing = 1;
    pose = posekf(t, [
      [13.85, P({look: 1, aR: [70, 10], lean: 4})],
      [14.25, P({look: 1, aR: [84, 6], lean: 8, head: 6, lookY: 0.4})],
      [14.55, P({look: 1, aR: [40, 20], lean: 8, head: 8, lookY: 0.5, sh: 0.9})],
      [14.95, P({look: 0.7, aR: [8, 10], aL: [4, 6], lean: 14, head: 26, lookY: 1, sh: 0})],   // suspiro
      [15.15, P({look: 0.2, aR: [60, 10], lean: 6, head: 14, lookY: 0.6})],
    ]);
  } else if (t < 15.7) {
    x = 1170; facing = -1;
    pose = posekf(t, [[15.15, P({look: 0.6, head: 10})], [15.4, P({...POSES.reach, aR: [96, 0], look: 1, head: 0, lean: 6})], [15.7, P({look: 0.8, aR: [80, 10]})]]);
  } else if (t < 16.45) {
    const w = walkTo(t, 15.7, 16.45, 1170, 760, 1.8, P({look: 0.6, head: 8}));
    x = w.x; facing = -1; pose = w.pose;
  } else {
    x = 740; facing = 1;
    pose = posekf(t, [
      [16.45, P({look: 0, lookY: 0, head: 0})],
      [16.65, {...POSES.sit, y: -40, lean: -10, aL: [80, 10], aR: [70, 10]}, ease.in],
      [16.85, {...POSES.sitFlop, y: 6}, ease.out],
      [17.05, POSES.sitFlop],
    ]);
  }
  const fridge = kf(t, [[13.95, 0], [14.3, 1, ease.out], [14.95, 1], [15.2, 0, ease.in]]);
  const camX = kf(t, [[11, 330], [12.7, 360], [13.9, 1090], [15.3, 1110], [16.5, 760], [18, 750]]);
  const camY = kf(t, [[11, 1210], [14, 1170], [16.5, 1240], [18, 1260]]);
  const z = kf(t, [[11, 1.3], [12.7, 1.38], [13.9, 1.3], [14.6, 1.48], [15.6, 1.3], [16.6, 1.32], [18, 1.45]]);
  const sq = t > 16.8 && t < 17.0 ? 1 + 0.03 * Math.sin((t - 16.8) * 30) : 1;
  return (
    <AbsoluteFill>
      <AptStage t={t} cam={{x: camX, y: camY, z: z * sq}} fridgeOpen={fridge} billsLifted={prop === 'bill'} dark={0.08}>
        <Maya t={t} pose={pose} x={x} y={1500} s={MAYA_S} facing={facing} prop={prop} voice={voiceAt('MAYA', t)} />
      </AptStage>
      <Vignette amt={0.7} />
    </AbsoluteFill>
  );
};
