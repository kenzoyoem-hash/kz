import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {S1, S2, S3, S4} from './ScenesA';
import {S5, S6, S7, S8} from './ScenesB';
import {TL, remainingAt} from './shared';
import {Timer} from '../../ui/UI';
import {Grain, Vignette, Glitch} from '../../fx/Fx';
import {tw} from '../../lib/anim';

/**
 * SISTEMA INVADIDO — EP. 1 "VOCÊ ESTÁ AO VIVO"
 * Vídeo sem áudio e sem legendas: a mixagem (pipeline/mix.py) e as legendas ASS
 * (pipeline/captions.py) são aplicadas na finalização com FFmpeg (pipeline/build_ep.sh).
 */
const SCENES: Record<string, React.FC> = {
  s1_gancho: S1, s2_invasao: S2, s3_hacker: S3, s4_regra: S4,
  s5_saidas: S5, s6_pista: S6, s7_ameaca: S7, s8_votacao: S8,
};

const HudTimer: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = f / fps;
  if (T < 33.6 || T >= 65.2) return null;
  const jump = T > 60.5 && T < 60.9;
  return (
    <>
      <Timer t={T} remaining={remainingAt(T)} y={225} size={0.55} appear={tw(T, 33.6, 33.9, 0, 1)} />
      {jump && <Glitch amount={0.8} seed={60} />}
    </>
  );
};

export const Ep01: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {TL.scenes.map((s) => {
        const C = SCENES[s.id];
        const from = Math.round(s.start * fps);
        const dur = Math.round(s.end * fps) - from;
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
            <C />
          </Sequence>
        );
      })}
      <HudTimer />
      <Vignette strength={0.45} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
export const EP01_FRAMES = Math.round(TL.duration * TL.fps);
