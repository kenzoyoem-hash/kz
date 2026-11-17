import React from 'react';
import {AbsoluteFill} from 'remotion';
import {AptStage} from './AptStage';
import {Stage, Layer} from '../components/Camera';
import {FutureRoom, MAYA_S} from '../components/Background';
import {Hourglass} from '../components/Hourglass';
import {PhoneInsert, ScreenCall} from '../components/Phone';
import {Dust, Glitch, Scanlines, Vignette} from '../components/Effects';
import {Maya} from '../characters/Maya';
import {FutureMaya} from '../characters/FutureMaya';
import {POSES, posekf} from '../characters/poses';
import {P} from '../characters/Rig';
import {voiceAt} from '../data/dialogue';
import {C, FONT} from '../styles/theme';
import {bump, ease, kf, prog, tw} from '../lib/anim';

/** CENA 10 — O AVISO FINAL (01:08–01:17): a Maya do futuro, em 2041; a ligação cai; a ampulheta quebra. */
export const Scene10: React.FC<{t: number}> = ({t}) => {
  if (t < 72.1) {
    const pose = posekf(t, [
      [68, P({...POSES.rigid, look: 0.1})],
      [71.6, P({...POSES.rigid, look: 0.05, head: 4})],
      [72.1, P({...POSES.rigid, aR: [10, 20], head: 8, look: 0})],
    ]);
    return (
      <Glitch amt={bump(t, 68.05, 0.12) + bump(t, 72.05, 0.1)} t={t} seed={6}>
        <Stage cam={{x: 540, y: kf(t, [[68, 1170], [72, 1110]]), z: kf(t, [[68, 1.85], [72.1, 2.5, ease.linear]])}} bg="#05060B">
          <Layer depth={0.9}><FutureRoom t={t} /></Layer>
          <Layer depth={1}>
            <FutureMaya t={t} pose={pose} x={540} y={1500} s={MAYA_S} facing={-1} prop={t < 71.9 ? 'phoneEar' : 'phone'} propGlow={C.red}
              voice={voiceAt('MAYA_FUTURO', t) * 0.4} breathe={0.4} dark={0.25} darkColor="#1A0610" />
            <rect x={545} y={950} width={4} height={600} fill={C.red} opacity={0.0} />
          </Layer>
          <Layer depth={0.6}><Dust t={t} n={30} seed="fut" col={C.red} speed={15} opacity={0.4} /></Layer>
        </Stage>
        <AbsoluteFill>
          <svg viewBox="0 0 1080 1920" width={1080} height={1920}>
            <text x={70} y={210} fill={C.red} fontFamily={FONT.mono} fontSize={40} letterSpacing={6} opacity={0.85}>● 2041</text>
            <text x={70} y={256} fill={C.white} fontFamily={FONT.mono} fontSize={22} opacity={0.5}>SINAL: INSTÁVEL</text>
          </svg>
        </AbsoluteFill>
        <Scanlines amt={0.14} t={t} />
        <Vignette amt={0.85} col="20,0,6" />
      </Glitch>
    );
  }
  if (t < 72.7) {
    return (
      <AbsoluteFill>
        <Stage cam={{x: 540, y: 960, z: 1}} bg="#020306">
          <PhoneInsert x={540} y={800} s={0.9} glow={C.red}><ScreenCall state="ended" t={t} since={0} /></PhoneInsert>
        </Stage>
        <Vignette amt={0.85} />
      </AbsoluteFill>
    );
  }
  // apartamento no escuro, Maya paralisada; a ampulheta reaparece e quebra
  const hgIn = prog(t, 74.2, 74.8, ease.out);
  const broken = t >= 75.5 ? prog(t, 75.5, 76.7, ease.out) : 0;
  const pose = P({...POSES.standPhone, aR: [8, 20], aL: [4, 8], head: 6, look: 0, lookY: 0, sh: 0.4});
  return (
    <AbsoluteFill>
      <AptStage t={t} cam={{x: 720, y: kf(t, [[72.7, 1200], [76, 1150]]), z: kf(t, [[72.7, 1.5], [77, 2.1, ease.linear]])}}
        dark={tw(t, 72.6, 72.9, 0.45, 0.78)} lamp={0} windowGlow={0.6}>
        <Maya t={t} pose={pose} x={720} y={1500} s={MAYA_S} prop="phone" propGlow={C.red} dark={0.75} breathe={2.2} />
      </AptStage>
      {hgIn > 0 && (
        <Glitch amt={bump(t, 75.4, 0.15)} t={t} seed={8}>
          <AbsoluteFill style={{background: `rgba(2,3,8,${0.75 * hgIn})`}} />
          <Stage cam={{x: 540, y: 900, z: 1 + (t - 74.2) * 0.05}} style={{opacity: hgIn}}>
            <Hourglass x={540} y={880} s={1.3} t={t} sand={tw(t, 74.2, 75.5, 0.4, 0.05)} dissolve={1 - broken} broken={broken} />
          </Stage>
        </Glitch>
      )}
      <Vignette amt={0.9} />
      {t > 76.4 && <AbsoluteFill style={{background: '#020306', opacity: prog(t, 76.4, 76.9)}} />}
    </AbsoluteFill>
  );
};
