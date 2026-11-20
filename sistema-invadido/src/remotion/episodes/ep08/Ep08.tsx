import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {S1, S2, S3, S4, S5, S6, S7, S8} from './Scenes';
import {TL} from './shared';
import {Grain, Vignette} from '../../fx/Fx';

/** SISTEMA INVADIDO — EP. 8 "VOCÊ ERA O SISTEMA" — GRANDE FINAL (após EP. 7, venceu B) */
const SCENES: Record<string, React.FC> = {s1: S1, s2: S2, s3: S3, s4: S4, s5: S5, s6: S6, s7: S7, s8: S8};
export const Ep08: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {TL.scenes.map((s) => {
        const C = SCENES[s.id];
        const from = Math.round(s.start * fps);
        return <Sequence key={s.id} from={from} durationInFrames={Math.round(s.end * fps) - from} name={s.id}><C /></Sequence>;
      })}
      {/* grão e vinheta só até o corte para o preto (84 s): o final é PRETO ABSOLUTO */}
      <Sequence from={0} durationInFrames={Math.round(84 * fps)} name="grao">
        <Vignette strength={0.25} />
        <Grain opacity={0.04} />
      </Sequence>
    </AbsoluteFill>
  );
};
export const EP08_FRAMES = Math.round(TL.duration * TL.fps);
