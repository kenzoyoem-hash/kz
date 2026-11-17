import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import audio from '../../../episodes/ep04/audio.generated.json';
import timeline from '../../../episodes/ep04/timeline.json';
import {Bia} from '../../characters/Bia';

export const TL = timeline;
export const scene = (id: string) => TL.scenes.find((s) => s.id === id)!;
export const useT = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return f / fps;
};
export const voiceEnv = (who: string, T: number) => {
  const arr = (audio.env as Record<string, number[]>)[who];
  if (!arr) return 0;
  const i = Math.floor(T * audio.fps);
  return arr[Math.max(0, Math.min(arr.length - 1, i))] ?? 0;
};
/** boca: abre conforme o envelope de voz */
export const mouthOf = (who: string, T: number, gain = 1.5) => Math.min(1, voiceEnv(who, T) * gain);

export const BiaAvatar: React.FC<{t: number}> = ({t}) => (
  <svg viewBox="-150 -880 300 300" width="100%" height="100%"><rect x={-150} y={-880} width={300} height={300} fill="#2a3045" /><Bia t={t} /></svg>
);
