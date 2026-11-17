import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {Stage} from '../components/Camera';
import {MAYA_S} from '../components/Background';
import {AlertBanner, PhoneInsert, ScreenReceived} from '../components/Phone';
import {Dust, Vignette} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {POSES, posekf} from '../characters/poses';
import {P} from '../characters/Rig';
import {voiceAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {bump, ease, kf, prog, shake} from '../lib/anim';

/** CENA 07 — O DINHEIRO CAIU (00:43–00:50): comemoração interrompida por uma notificação vermelha. */
export const Scene07: React.FC<{t: number}> = ({t}) => {
  if (t < 44.3) {
    return (
      <AbsoluteFill>
        <Stage cam={{x: 540, y: 960, z: 1}} bg={C.ink}>
          <rect x={0} y={0} width={1080} height={1920} fill="#0B1022" />
          <Dust t={t} n={40} col={C.gold} opacity={0.5} speed={60} />
          <PhoneInsert x={540} y={790} s={0.9} glow={C.gold}><ScreenReceived k={(t - 43) / 1.3} /></PhoneInsert>
        </Stage>
        <Vignette amt={0.6} />
      </AbsoluteFill>
    );
  }
  // pula do sofá e comemora; congela quando o alerta chega (48.2)
  const jump = (tc: number, h = 90) => -h * Math.max(0, 1 - Math.pow((t - tc) / 0.3, 2));
  const air = t < 48.2 ? jump(45.0) + jump(45.75) + jump(46.5, 70) + jump(47.4, 60) + jump(48.05, 50) : 0;
  const x = kf(t, [[44.3, 740], [44.8, 640]]);
  const facing: 1 | -1 = 1;
  const pose = posekf(t, [
    [44.3, POSES.sitPhone],
    [44.55, P({...POSES.sit, lean: 20, aL: [60, 20], aR: [70, 30], y: -20})],
    [44.8, P({...POSES.cheer, y: 0})],
    [48.15, POSES.cheer],
    [48.45, P({...POSES.cheer, aL: [120, 20], aR: [110, 30], head: 0, lookY: 0, look: 0.2})],
    [49.3, P({...POSES.standPhone, sh: 0.5})],
    [50, P({...POSES.standPhone, head: 20, sh: 0.6})],
  ]);
  const p = {...pose, y: pose.y + air};
  const alert = prog(t, 48.2, 48.55);
  const red = bump(t, 48.35, 0.3);
  const sk = shake(t, 48.2, 16, 0.5, 3);
  const cam = {x: kf(t, [[44.3, 720], [48.2, 700], [48.5, 660]]) + sk.x, y: kf(t, [[44.3, 1200], [48.2, 1180], [48.5, 1150]]) + sk.y,
    z: kf(t, [[44.3, 1.3], [48.2, 1.38], [48.45, 1.85, ease.out], [50, 1.95]])};
  return (
    <AbsoluteFill>
      <AptStage t={t} cam={cam} dark={0.06 + alert * 0.18} lamp={1}
        over={<rect x={-1000} y={-1000} width={4000} height={5000} fill={C.red} opacity={red * 0.3 + alert * 0.08} />}>
        <Maya t={t} pose={p} x={x} y={1500} s={MAYA_S} facing={facing} prop="phone" propGlow={alert > 0 ? C.red : C.gold}
          faceGlow={alert} voice={voiceAt('MAYA', t)} />
        {t < 48.2 && <Dust t={t} n={36} seed="conf" x={300} y={700} w={900} h={900} col={C.gold} speed={-80} size={6} opacity={0.7} />}
      </AptStage>
      {alert > 0 && (
        <AbsoluteFill>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}><AlertBanner k={alert} t={t} y={210} /></svg>
        </AbsoluteFill>
      )}
      <Vignette amt={0.65 + alert * 0.2} col={alert > 0 ? '40,0,10' : '0,0,0'} />
    </AbsoluteFill>
  );
};
