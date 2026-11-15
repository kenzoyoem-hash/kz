import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import audio from '../../../episodes/ep01/audio.generated.json';
import timeline from '../../../episodes/ep01/timeline.json';
import {Apartment} from '../../sets/Apartment';
import {Bia, POSES, Pose, mixPose} from '../../characters/Bia';
import {LiveUI} from '../../ui/UI';
import {kf, ease, tw} from '../../lib/anim';

export const TL = timeline;
export const scene = (id: string) => TL.scenes.find((s) => s.id === id)!;

/** tempo local (s) dentro da Sequence */
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};

/** envelope de voz (0..1) de um personagem em tempo absoluto */
export const voiceEnv = (who: 'HACKER' | 'BIA' | 'NARRADOR', T: number) => {
  const arr = (audio.env as Record<string, number[]>)[who];
  const i = Math.floor(T * audio.fps);
  return arr[Math.max(0, Math.min(arr.length - 1, i))] ?? 0;
};

/** cronômetro global do episódio: 01:30 a partir de 31s; o hacker corta para 00:10 em 60,5s; congela na votação */
export const remainingAt = (T: number) => (T < 60.5 ? 90 - (T - 31.0) : T < 65.2 ? 10 - (T - 60.5) : 10 - 4.7);

/** pose da Bia na cena 2 (levanta o braço duas vezes) — usada com atraso de 1s na live */
export const s2Pose = (t: number): Pose => {
  const k = Math.max(kf(t, [[0.9, 0], [1.25, 1, ease.out], [2.0, 1], [2.35, 0]]), kf(t, [[2.9, 0], [3.2, 1, ease.out], [3.9, 1], [4.2, 0]]));
  return mixPose(POSES.phoneL, POSES.raiseR, k);
};

/** Transmissão "ao vivo" da Bia dentro de casa (para a tela do celular) */
export const LiveFeed: React.FC<{t: number; T: number; pose: Pose; expr?: any; viewers: number; uiScale?: number; banner?: boolean; lookX?: number}> = ({t, T, pose, expr = 'surprised', viewers, uiScale = 1, banner = true, lookX = 0}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <svg viewBox="560 560 680 1300" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', inset: 0, filter: 'saturate(0.8) contrast(1.05)'}}>
      <Apartment t={T} light={0.85}>
        <Bia t={T} x={900} y={1640} pose={pose} expr={expr} phone="L" phoneLit lookX={lookX} />
      </Apartment>
    </svg>
    <LiveUI t={t} viewers={viewers} scale={uiScale} showBanner={banner} />
  </div>
);

export const flicker = (t: number, t0: number, t1: number) => {
  if (t < t0 || t > t1) return 1;
  const s = Math.sin(t * 37) + Math.sin(t * 91) * 0.7 + Math.sin(t * 13);
  return s > 0.4 ? 0.85 : s > -0.6 ? 0.35 : 0.08;
};

export {tw, kf, ease};
