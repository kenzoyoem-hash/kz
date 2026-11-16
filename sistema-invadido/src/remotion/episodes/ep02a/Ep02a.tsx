import React from 'react';
import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';
import {S1, S2, S3, S4} from './ScenesA';
import {S5, S6, S7, S8} from './ScenesB';
import {TL} from './shared';
import {Grain, Vignette} from '../../fx/Fx';

/** SISTEMA INVADIDO — EP. 2A "A ESCADA NÃO ESTÁ VAZIA" (venceu A: descer pelas escadas) */
const SCENES: Record<string, React.FC> = {
  s1_escolha: S1, s2_ligacao: S2, s3_descida: S3, s4_homem: S4,
  s5_contradicao: S5, s6_aviso: S6, s7_perigo: S7, s8_votacao: S8,
};
export const Ep02a: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {TL.scenes.map((s) => {
        const C = SCENES[s.id];
        const from = Math.round(s.start * fps);
        return <Sequence key={s.id} from={from} durationInFrames={Math.round(s.end * fps) - from} name={s.id}><C /></Sequence>;
      })}
      <Vignette strength={0.25} />
      <Grain opacity={0.04} />
    </AbsoluteFill>
  );
};
export const EP02A_FRAMES = Math.round(TL.duration * TL.fps);
