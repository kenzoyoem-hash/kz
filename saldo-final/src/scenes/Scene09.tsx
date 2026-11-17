import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {Stage} from '../components/Camera';
import {MAYA_S} from '../components/Background';
import {PhoneInsert} from '../components/Phone';
import {Vignette, Glitch} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {FUTURE_MAYA_PAL} from '../characters/FutureMaya';
import {MAYA_PAL} from '../characters/Maya';
import {POSES, posekf, walkTo} from '../characters/poses';
import {P, Pose} from '../characters/Rig';
import {voiceAt} from '../data/dialogue';
import {C, FONT} from '../styles/theme';
import {bump, ease, kf, prog, rnd} from '../lib/anim';

/** CENA 09 — A LIGAÇÃO IMPOSSÍVEL (00:58–01:08): o celular toca sozinho, as luzes piscam; "Você." */
const flick = (t: number) => {
  // luzes da sala piscando
  const f = Math.floor(t * 15);
  const on = (t > 58 && t < 59.6 && rnd(`fl${f}`) < 0.35) || (t > 63.2 && t < 63.8 && rnd(`fl${f}`) < 0.4) || (t > 66.6 && t < 66.9);
  return on ? 0.35 : 0;
};

/** reflexo no vidro do celular: a silhueta de Maya e, atrás dela, uma segunda silhueta (cabelo mais longo, gola alta) */
const Reflection: React.FC<{t: number; k: number}> = ({t, k}) => (
  <g>
    <rect x={0} y={0} width={600} height={1180} fill="#05060A" />
    <path d="M0,0 L600,0 L600,240 L0,700 Z" fill="#FFFFFF" opacity={0.04} />
    {/* Maya (reflexo, de frente) */}
    <g opacity={0.35} transform="translate(230,640)">
      <ellipse cx={0} cy={-20} rx={110} ry={115} fill={MAYA_PAL.hairShade} />
      <ellipse cx={0} cy={0} rx={92} ry={98} fill="#6C7080" />
      <path d="M-150,330 Q-140,150 0,140 Q140,150 150,330 Z" fill="#3E4C3A" />
    </g>
    {/* a segunda silhueta surge atrás, com contorno vermelho */}
    <g opacity={k} transform={`translate(${430 - (1 - k) * 40},560)`}>
      <ellipse cx={0} cy={0} rx={108} ry={116} fill={FUTURE_MAYA_PAL.hairShade} />
      <path d="M-104,10 Q-120,200 -90,330 L90,330 Q120,200 104,10 Z" fill={FUTURE_MAYA_PAL.hairShade} />
      <ellipse cx={0} cy={20} rx={86} ry={94} fill="#14151E" />
      <path d="M-160,420 Q-150,200 -40,180 L40,180 Q150,200 160,420 Z" fill="#0D0F18" />
      <path d="M-60,180 L60,180 L70,230 L-70,230 Z" fill="#1B1F2D" />
      <ellipse cx={0} cy={20} rx={90} ry={98} fill="none" stroke={C.red} strokeWidth={4} opacity={0.6 + 0.4 * Math.sin(t * 9)} />
      <path d="M-160,420 Q-150,200 -40,180" fill="none" stroke={C.red} strokeWidth={4} opacity={0.6} />
    </g>
  </g>
);

export const Scene09: React.FC<{t: number}> = ({t}) => {
  if (t >= 66.7) {
    const k = prog(t, 66.75, 67.4, ease.out);
    return (
      <Glitch amt={bump(t, 66.9, 0.12)} t={t} seed={4}>
        <Stage cam={{x: 540, y: 960, z: 1}} bg="#020306">
          <PhoneInsert x={540} y={820} s={kf(t, [[66.7, 1.0], [68, 1.12]])} glow={C.red} hand={false}>
            <Reflection t={t} k={k} />
          </PhoneInsert>
        </Stage>
        <Vignette amt={0.9} />
      </Glitch>
    );
  }
  let x = 600, pose: Pose;
  let prop: 'phone' | 'phoneEar' | null = null;
  if (t < 59.7) {
    pose = posekf(t, [[58, POSES.scared], [59.0, {...POSES.scared, head: 14, lean: 4}], [59.7, P({...POSES.scared, lean: 0})]]);
  } else if (t < 60.2) {
    const w = walkTo(t, 59.7, 60.2, 600, 760, 1.6, P({look: 1, head: 10, lookY: 0.6, sh: 0.6}));
    x = w.x; pose = w.pose;
  } else if (t < 60.6) {
    x = 760;
    pose = posekf(t, [[60.2, P({...POSES.reach, aR: [60, 10], lean: 22, head: 18, lookY: 1})], [60.6, P({...POSES.standPhoneEar, sh: 0.7})]]);
    prop = t > 60.35 ? 'phone' : null;
  } else {
    x = 760;
    const lean = t > 65.4 ? 10 : 0;
    pose = posekf(t, [[60.6, P({...POSES.standPhoneEar, sh: 0.7})], [65.4, P({...POSES.standPhoneEar, sh: 0.8, head: 8})], [65.7, P({...POSES.standPhoneEar, sh: 1, lean, head: -6, lookY: -0.2})], [66.7, P({...POSES.standPhoneEar, sh: 1, lean, head: -4})]]);
    prop = 'phoneEar';
  }
  const ringing = t < 60.35;
  const cam = t < 60.6
    ? {x: 740, y: 1180, z: kf(t, [[58, 1.3], [60.6, 1.42]])}
    : t < 65.4
      ? {x: 760, y: 1150, z: kf(t, [[60.6, 2.0], [65.4, 2.45, ease.linear]])}
      : {x: 770, y: 1120, z: kf(t, [[65.4, 2.8], [66.7, 3.0]])};
  const fv = voiceAt('MAYA_FUTURO', t);
  const dark = 0.4 + flick(t);
  return (
    <AbsoluteFill>
      <AptStage t={t} cam={cam} dark={dark} lamp={0.4} phoneOnSofa={t < 60.35 ? 1 : 0} phoneGlow={C.red} phoneBuzz={ringing ? (Math.floor(t / 0.8) % 1 === 0 && (t % 0.8) < 0.45 ? 1 : 0.2) : 0}
        over={<rect x={-1000} y={-1000} width={4000} height={5000} fill={C.red} opacity={0.05 + fv * 0.08} />}>
        <Maya t={t} pose={pose} x={x} y={1500} s={MAYA_S} prop={prop} propGlow={C.red} faceGlow={prop ? 0.6 : 0} dark={flick(t) * 0.8}
          tremble={0.35} voice={voiceAt('MAYA', t)} />
        {/* ondas vermelhas da voz saindo do celular */}
        {prop === 'phoneEar' && [0, 1, 2].map((i) => (
          <circle key={i} cx={x + 70} cy={1180} r={30 + i * 22 + fv * 20} fill="none" stroke={C.red} strokeWidth={3} opacity={fv * (0.6 - i * 0.18)} />
        ))}
      </AptStage>
      {ringing && (
        <AbsoluteFill>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
            <text x={540} y={300} textAnchor="middle" fill={C.red} fontFamily={FONT.mono} fontSize={38} opacity={0.6 + 0.4 * Math.sin(t * 10)} letterSpacing={4}>NÚMERO DESCONHECIDO</text>
          </svg>
        </AbsoluteFill>
      )}
      <Vignette amt={0.85} />
    </AbsoluteFill>
  );
};
