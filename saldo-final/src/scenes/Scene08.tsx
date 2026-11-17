import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {Stage} from '../components/Camera';
import {MAYA_S} from '../components/Background';
import {PhoneInsert, ScreenDetails} from '../components/Phone';
import {Dust, Glitch, Vignette} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {POSES, posekf} from '../characters/poses';
import {P} from '../characters/Rig';
import {voiceAt, wordAt} from '../data/dialogue';
import {C} from '../styles/theme';
import {bump, ease, kf, prog, shake} from '../lib/anim';

/** CENA 08 — A DESCOBERTA (00:50–00:58): COMPRADORA: MAYA — 2041. */
export const Scene08: React.FC<{t: number}> = ({t}) => {
  if (t >= 53.0 && t < 55.0) {
    const reveal = t >= 53.55 ? prog(t, 53.55, 54.6, ease.linear) : 0;
    const sk = shake(t, 53.55, 18, 0.5, 7);
    return (
      <Glitch amt={bump(t, 53.65, 0.18)} t={t}>
        <Stage cam={{x: 540 + sk.x, y: 960 + sk.y, z: 1}} bg={C.ink}>
          <rect x={0} y={0} width={1080} height={1920} fill={reveal > 0 ? '#1A0710' : '#0B1022'} />
          <Dust t={t} n={30} col={reveal > 0 ? C.red : C.blue} opacity={0.4} />
          <PhoneInsert x={540} y={780} s={reveal > 0 ? 0.92 + 0.04 * prog(t, 53.55, 55, ease.out) : 0.9} glow={reveal > 0 ? C.red : C.blue}>
            <ScreenDetails k={(t - 53) / 0.8} reveal={reveal} t={t} />
          </PhoneInsert>
        </Stage>
        <Vignette amt={0.75} col={reveal > 0 ? '40,0,10' : '0,0,0'} />
      </Glitch>
    );
  }
  const tEu = wordAt('l13', 'EU');
  const late = t >= 55.0;
  const pose = late
    ? posekf(t, [
        [55.0, P({...POSES.standPhone, head: 10, lookY: 0.5})],
        [tEu - 0.15, P({...POSES.standPhone, lean: -6, head: -2, look: 0.2, lookY: 0, sh: 0.8})],
        [tEu + 0.15, P({...POSES.headHands, lean: -10, head: -4, lL: [-10, -4], lR: [14, -8]}), ease.out],
        [56.9, P({...POSES.headHands, lean: -8, head: 8})],
        [57.3, P({...POSES.scared, aR: [70, 10], head: 4})],
        [58, P({...POSES.scared, head: 8})],
      ])
    : posekf(t, [[50, POSES.standPhone], [51.4, {...POSES.standPhone, head: 20, aR: [34, 116]}], [53, {...POSES.standPhone, head: 22, lean: 6}]]);
  const x = late ? kf(t, [[55, 640], [tEu + 0.2, 600, ease.out]]) : 640;
  // com o susto, o celular escapa das mãos e cai no sofá
  const throwK = prog(t, tEu, tEu + 0.45, ease.in);
  const phoneInHand = !late || t < tEu;
  const gl = late ? bump(t, tEu + 0.1, 0.25) : 0;
  const cam = late
    ? {x: kf(t, [[55, 640], [57, 650], [58, 700]]), y: kf(t, [[55, 1110], [58, 1170]]), z: kf(t, [[55, 2.35], [tEu + 0.15, 2.7, ease.out], [57, 2.6], [58, 1.6]])}
    : {x: 650, y: kf(t, [[50, 1170], [53, 1130]]), z: kf(t, [[50, 1.75], [53, 2.15, ease.linear]])};
  return (
    <Glitch amt={gl} t={t} seed={2}>
      <AptStage t={t} cam={cam} dark={late ? 0.28 : 0.2} phoneOnSofa={t >= tEu + 0.45 ? 1 : 0} phoneGlow={C.red}
        over={late ? <rect x={-1000} y={-1000} width={4000} height={5000} fill={C.red} opacity={0.08 + gl * 0.2} /> : null}>
        <Maya t={t} pose={pose} x={x} y={1500} s={MAYA_S} prop={phoneInHand ? 'phone' : null} propGlow={late ? C.red : C.blue}
          faceGlow={phoneInHand ? 1 : 0} voice={voiceAt('MAYA', t)} tremble={late ? 0.4 : 0} />
        {throwK > 0 && throwK < 1 && (
          <g transform={`translate(${680 + throwK * 190},${1230 + 140 * throwK - 160 * Math.sin(throwK * Math.PI)}) rotate(${throwK * 400})`}>
            <rect x={-12} y={-22} width={24} height={44} rx={5} fill="#1B2133" stroke={C.red} strokeWidth={2} />
          </g>
        )}
      </AptStage>
      <Vignette amt={0.75} />
    </Glitch>
  );
};
